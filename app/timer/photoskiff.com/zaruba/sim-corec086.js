// Core simulation and utility functions for TMIC
// Expose via window.SimCore and also as global functions for backward compatibility
(function(){
    'use strict';

    // Sport-level aware HRmax prediction helper (when HRmax input is empty)
    function predictedMaxHRFromAge(age, sportLevel) {
        const a = Number(age) || 0;
        switch ((sportLevel || 'general')) {
            case 'tanaka': return Math.round(208 - 0.7 * a);
            case 'gellish': return Math.round(207 - 0.7 * a);
            default: return Math.round(220 - a);
        }
    }

    function asBpm(p, hrRest, hrMax, useHRR) {
        return useHRR ? (hrRest + p * (hrMax - hrRest)) : (p * hrMax);
    }

    // Default/activity-specific zone fractions
    function activityZoneFractions(activity) {
        const base = { Z2: [0.60, 0.70], Z3: [0.70, 0.80], Z4: [0.80, 0.90], Z5: [0.90, 1.00] };
        if (activity === 'kb') {
            return { Z2: [0.61, 0.71], Z3: [0.71, 0.81], Z4: [0.81, 0.91], Z5: [0.91, 1.00] };
        } else if (activity === 'bike') {
            return { Z2: [0.58, 0.68], Z3: [0.68, 0.78], Z4: [0.78, 0.88], Z5: [0.88, 0.98] };
        }
        return base; // run
    }

    // --- Zaruba free-form pattern helpers ---
    function parseZarPattern(str, offDefault = 30) {
        const segments = [];
        if (!str || typeof str !== "string") return segments;

        // Sentinel word inserted after expanding a '(...)' group.
        // Used to prevent postfix directives like '@3' from accidentally binding to the last
        // segment inside the group when written as '(...)@3'. We intentionally keep only
        // the group multiplier syntax after ')'.
        const __ZRB_GROUP_END__ = '__ZRB_GROUP_END__';

        // Tokenize a pattern allowing parentheses groups like:
        // (30@8t20 20@8t15 0/10 30@8t20) * 3
        // We expand groups to a flat list of word tokens, then reuse the legacy flat parser.
        const tokenizeWithGroups = (s) => {
            const out = [];
            const src = String(s || '');
            const isWs = (c) => c === ' ' || c === '\t' || c === '\n' || c === '\r' || c === ',';
            const isParen = (c) => c === '(' || c === ')';
            let i = 0;
            let lastNonWs = '';
            while (i < src.length) {
                const ch = src[i];
                if (isWs(ch)) { i++; continue; }
                if (ch === '(') { out.push({ type: '(', value: '(' }); lastNonWs = '('; i++; continue; }
                if (ch === ')') { out.push({ type: ')', value: ')' }); lastNonWs = ')'; i++; continue; }

                // Group multiplier marker after ')': "...)*3" or "...) * 3".
                // IMPORTANT: keep '*' inside words like "30/20*3".
                if ((ch === '*' || ch === '×') && lastNonWs === ')') {
                    out.push({ type: '*', value: '*' });
                    lastNonWs = '*';
                    i++;
                    continue;
                }

                // Word token: everything until whitespace/comma or a parenthesis.
                const start = i;
                while (i < src.length && !isWs(src[i]) && !isParen(src[i])) i++;
                const word = src.slice(start, i);
                if (word) {
                    out.push({ type: 'word', value: word });
                    lastNonWs = word[word.length - 1] || lastNonWs;
                }
            }
            return out;
        };

        const expandGroupTokensToWords = (tokList) => {
            const words = [];
            let pos = 0;

            const parseSeq = (stopType) => {
                const out = [];
                while (pos < tokList.length) {
                    const t = tokList[pos];
                    if (stopType && t.type === stopType) break;
                    if (t.type === 'word') {
                        out.push(t.value);
                        pos++;
                        continue;
                    }
                    if (t.type === '(') {
                        pos++;
                        const inner = parseSeq(')');
                        const hasClose = (pos < tokList.length && tokList[pos].type === ')');
                        if (hasClose) pos++; // consume ')'

                        let rep = 1;
                        if (pos < tokList.length) {
                            const tMul = tokList[pos];
                            if (tMul.type === '*') {
                                pos++;
                                if (pos < tokList.length && tokList[pos].type === 'word') {
                                    const k = parseInt(tokList[pos].value, 10);
                                    if (Number.isFinite(k) && k > 0) rep = k;
                                    pos++;
                                }
                            } else if (tMul.type === 'word') {
                                // Also allow postfix "x3" / "*3" / "×3" right after the group.
                                const m = String(tMul.value || '').match(/^(?:[xX\*×хХ])(\d+)$/);
                                if (m) {
                                    const k = parseInt(m[1], 10);
                                    if (Number.isFinite(k) && k > 0) rep = k;
                                    pos++;
                                }
                            }
                        }

                        for (let r = 0; r < rep; r++) out.push(...inner);
                        // Mark end of a group expansion to prevent postfix directives
                        // (like standalone '@...') from binding to the last inner token.
                        out.push(__ZRB_GROUP_END__);
                        continue;
                    }

                    // Stray tokens (like '*' not after ')'): ignore.
                    pos++;
                }
                return out;
            };

            words.push(...parseSeq(null));
            return words;
        };

        let tokens = expandGroupTokensToWords(tokenizeWithGroups(str.trim())).filter(Boolean);
        // End markers:
        // - ';' = finish once (do not cycle; after the scheme ends, fall back to default On/Off engine)
        // - '#' = hard stop (end the workout after the pattern finishes)
        // Anything after the marker is ignored. Allow "...*10;" / "...*10#" and spaced variants.
        let noCycle = false;
        let hardStop = false;
        try {
            let best = null; // { j, pos, kind: 'noCycle'|'hardStop' }
            for (let j = 0; j < tokens.length; j++) {
                const w = String(tokens[j] ?? '');
                const pHash = w.indexOf('#');
                const pSemi = w.indexOf(';');
                if (pHash < 0 && pSemi < 0) continue;

                let pos;
                let kind;
                if (pHash >= 0 && pSemi >= 0) {
                    pos = Math.min(pHash, pSemi);
                    kind = (pHash === pos) ? 'hardStop' : 'noCycle';
                } else if (pHash >= 0) {
                    pos = pHash;
                    kind = 'hardStop';
                } else {
                    pos = pSemi;
                    kind = 'noCycle';
                }

                if (!best || j < best.j || (j === best.j && pos < best.pos)) {
                    best = { j, pos, kind };
                }
            }

            if (best) {
                const w = String(tokens[best.j] ?? '');
                const before = w.slice(0, best.pos).trim();
                tokens = tokens.slice(0, best.j);
                if (before) tokens.push(before);
                if (best.kind === 'hardStop') hardStop = true;
                else noCycle = true;
            }
        } catch (_) {}
        let i = 0;
        let lastAddedFrom = 0;
        let lastAddedTo = 0;
        let curRestEff;
        function clampSec(v) {
            const n = +String(v ?? '').replace(',', '.');
            if (!Number.isFinite(n)) return 0;
            const clamped = Math.max(0, Math.min(600, n));
            // Keep scheme durations stable and comparable; round to centiseconds.
            return Math.round(clamped * 100) / 100;
        }
        function clampTempoRpm(v) {
            if (v === null || typeof v === 'undefined') return undefined;
            const n = +String(v).replace(',', '.');
            if (!Number.isFinite(n)) return undefined;
            const k = Math.round(n);
            if (!(k > 0)) return undefined;
            return Math.max(5, Math.min(240, k));
        }
        function clampEff(v) {
            if (v === null || typeof v === 'undefined') return undefined;
            const n = +v;
            if (!Number.isFinite(n)) return undefined;
            return Math.max(0, Math.min(10, n));
        }
        function clampRestEff(v) {
            if (v === null || typeof v === 'undefined') return undefined;
            const n = +v;
            if (!Number.isFinite(n)) return undefined;
            return Math.max(0, Math.min(10, n));
        }

        function parseEffPair(s) {
            // Supports: "8.5", "/2", "8.5/2", "8.5/", "".
            // Tempo directive:
            // - Tempo override in rpm: "t15" / "т15".
            //   Note: legacy inputs may contain "T15"/"Т15"; we accept them but normalize
            //   to the canonical lowercase tempo override semantics.
            // Examples: "8.5t15", "t15", "8.5/2t60".
            // Reps targets (mutually exclusive with tempo on the same side): canonical "п12" (RU) / "r12" (EN), and with intensity like "8.5п12" / "8.5r12".
            // Cyrillic variant is also supported: "8.5т15", "т15", "8.5Т15", "Т15", "8.5п12", "п12", "8.5р12", "р12".
            // Returns { eff, restEff, workTempoRpm, workTempoSoftRpm, restTempoRpm, restTempoSoftRpm, workReps, restReps, hasSlash, hasRest } where values can be undefined.
            if (typeof s !== 'string') return { eff: undefined, restEff: undefined, workTempoRpm: undefined, workTempoSoftRpm: undefined, restTempoRpm: undefined, restTempoSoftRpm: undefined };
            const raw = s.trim();
            if (!raw) return { eff: undefined, restEff: undefined, workTempoRpm: undefined, workTempoSoftRpm: undefined, restTempoRpm: undefined, restTempoSoftRpm: undefined, hasSlash: false, hasRest: false };
            const hasSlash = raw.includes('/');
            const parts = raw.split('/');
            const left = String(parts[0] ?? '').trim();
            const right = String(parts[1] ?? '').trim();

            const parseSide = (side) => {
                const m = String(side || '').trim().match(
                    /^(?:(\d+(?:[\.,]\d+)?)\s*)?(?:(?:([tTтТ])\s*(\d+(?:[\.,]\d+)?))|(?:([пПrRрР])\s*(\d+)))?$/
                );
                if (!m) return { val: undefined, tempo: undefined, reps: undefined };
                const val = m[1] ? m[1].replace(',', '.') : '';
                const tempoMark = m[2] ? String(m[2]) : '';
                const tempo = m[3] ? m[3].replace(',', '.') : '';
                const reps = m[5] ? m[5].replace(',', '.') : '';
                return {
                    val: val ? val : undefined,
                    tempo: tempo ? tempo : undefined,
                    reps: reps ? reps : undefined
                };
            };

            const L = parseSide(left);
            const R = parseSide(right);

            const eff = L.val ? clampEff(L.val) : undefined;
            const restEff = R.val ? clampRestEff(R.val) : undefined;
            const workTempoRaw = L.tempo ? clampTempoRpm(L.tempo) : undefined;
            const restTempoRaw = R.tempo ? clampTempoRpm(R.tempo) : undefined;
            // Canonical semantics: tempo override is always the same token (t/т) in the scheme language.
            // Legacy "T"/"Т" inputs are accepted but normalized to this field.
            const workTempoRpm = (typeof workTempoRaw === 'number') ? workTempoRaw : undefined;
            const workTempoSoftRpm = undefined;
            const restTempoRpm = (typeof restTempoRaw === 'number') ? restTempoRaw : undefined;
            const restTempoSoftRpm = undefined;
            const workReps = L.reps ? Math.max(0, Math.floor(+L.reps || 0)) : undefined;
            const restReps = R.reps ? Math.max(0, Math.floor(+R.reps || 0)) : undefined;

            return {
                eff,
                restEff,
                workTempoRpm,
                workTempoSoftRpm,
                restTempoRpm,
                restTempoSoftRpm,
                workReps,
                restReps,
                hasSlash,
                hasRest: right.length > 0
            };
        }
        const repClass = "[xX\\*×хХ]";
        while (i < tokens.length) {
            const tokRaw = tokens[i];

            // Group boundary sentinel: reset the attach range so a following standalone '@...'
            // cannot apply to the last segment that came from inside the parentheses.
            if (tokRaw === __ZRB_GROUP_END__) {
                lastAddedFrom = segments.length;
                lastAddedTo = segments.length;
                i++;
                continue;
            }
            // Standalone rest-intensity directive: r3 / rest2.5 (0..10)
            {
                const mRestOnly = tokRaw.match(/^(?:r|rest)(\d+(?:[\.,]\d+)?)$/i);
                if (mRestOnly) {
                    curRestEff = clampRestEff(String(mRestOnly[1]).replace(',', '.'));
                    i++;
                    continue;
                }
            }

            // Standalone "@work/rest" token applies to the last parsed block.
            // Examples: "@8.5/2", "@8.5", "@/2".
            {
                const mEffOnly = tokRaw.match(/^@(.*)$/);
                if (mEffOnly && lastAddedTo > lastAddedFrom && lastAddedTo <= segments.length) {
                    const pair = parseEffPair(String(mEffOnly[1] ?? '').replace(',', '.'));
                    if (typeof pair.eff === 'number') {
                        for (let k = lastAddedFrom; k < lastAddedTo; k++) segments[k].eff = pair.eff;
                    }
                    if (typeof pair.workReps === 'number') {
                        for (let k = lastAddedFrom; k < lastAddedTo; k++) {
                            segments[k].workReps = pair.workReps;
                            segments[k].workTempoRpm = undefined;
                            segments[k].workTempoSoftRpm = undefined;
                        }
                    } else if (typeof pair.workTempoRpm === 'number') {
                        for (let k = lastAddedFrom; k < lastAddedTo; k++) {
                            segments[k].workTempoRpm = pair.workTempoRpm;
                            segments[k].workTempoSoftRpm = undefined;
                            segments[k].workReps = undefined;
                        }
                    } else if (typeof pair.workTempoSoftRpm === 'number') {
                        for (let k = lastAddedFrom; k < lastAddedTo; k++) {
                            segments[k].workTempoSoftRpm = pair.workTempoSoftRpm;
                            segments[k].workTempoRpm = undefined;
                            segments[k].workReps = undefined;
                        }
                    }
                    // IMPORTANT: rest intensity specified via @work/rest is per-block and must not
                    // persist into later blocks unless the user explicitly uses r/rest directives.
                    if (pair.hasSlash) {
                        for (let k = lastAddedFrom; k < lastAddedTo; k++) segments[k].restEff = (pair.hasRest ? pair.restEff : undefined);
                        for (let k = lastAddedFrom; k < lastAddedTo; k++) {
                            segments[k].restTempoRpm = (pair.hasRest ? pair.restTempoRpm : undefined);
                            segments[k].restTempoSoftRpm = (pair.hasRest ? pair.restTempoSoftRpm : undefined);
                        }
                    }
                    i++;
                    continue;
                }
            }

            // Token-level suffix: "...@8.5/2" / "...@8.5" / "...@/2"
            let tok = tokRaw;
            let effTok;
            let restTok;
            let restTokHasSlash = false;
            let restTokHasRest = false;
            let workTempoTok;
            let workTempoSoftTok;
            let restTempoTok;
            let restTempoSoftTok;
            let workRepsTok;
            let restRepsTok;
            let tokHadAtSuffix = false;
            {
                const mTokEff = tokRaw.match(/^(.*)@(.*)$/);
                if (mTokEff) {
                    tok = (mTokEff[1] || '').trim();
                    // Support repeat suffix after @-suffix, e.g.:
                    //   60/60@4t20*3
                    //   60/60@t20x10
                    // We treat the repeat as applying to the whole block token.
                    let suffix = String(mTokEff[2] ?? '').trim();
                    try {
                        const mRep = suffix.match(/^(.*?)(?:([xX\*×хХ])(\d+))$/);
                        if (mRep) {
                            const repN = parseInt(mRep[3], 10);
                            if (Number.isFinite(repN) && repN > 0) {
                                suffix = String(mRep[1] ?? '').trim();
                                // Move the repeat marker onto the duration token; reuse '*' for simplicity.
                                tok = `${tok}*${repN}`;
                            }
                        }
                    } catch (_) {}

                    const pair = parseEffPair(String(suffix ?? '').replace(',', '.'));
                    effTok = pair.eff;
                    restTok = pair.restEff;
                    restTokHasSlash = !!pair.hasSlash;
                    restTokHasRest = !!pair.hasRest;
                    workTempoTok = pair.workTempoRpm;
                    workTempoSoftTok = pair.workTempoSoftRpm;
                    restTempoTok = pair.restTempoRpm;
                    restTempoSoftTok = pair.restTempoSoftRpm;
                    workRepsTok = pair.workReps;
                    restRepsTok = pair.restReps;
                    tokHadAtSuffix = true;
                }
            }

            // Back-compat: token-level rest suffix: "...r3" / "...rest2.5".
            // If both "@..." and "r..." are present, "@..." wins for this token.
            if (!restTokHasSlash && typeof restTok !== 'number') {
                const mTokRest = tok.match(/^(.*?)(?:\s*)(?:r|rest)(\d+(?:[\.,]\d+)?)$/i);
                if (mTokRest) {
                    tok = (mTokRest[1] || '').trim();
                    restTok = clampRestEff(String(mTokRest[2]).replace(',', '.'));
                }
            }

            const startLen = segments.length;
            const secRe = `\\d+(?:[\\.,]\\d+)?`;
            if (new RegExp(`^\\d+${repClass}${secRe}\\/${secRe}$`, 'i').test(tok)) {
                const m = tok.match(new RegExp(`^(\\d+)${repClass}(${secRe})\\/(${secRe})$`, 'i'));
                if (m) {
                    const rep = Math.max(1, parseInt(m[1], 10));
                    const on = clampSec(m[2]);
                    const off = clampSec(m[3]);
                    const rEff = restTokHasSlash
                        ? (restTokHasRest ? restTok : undefined)
                        : (typeof restTok === 'number' ? restTok : (typeof curRestEff === 'number' ? curRestEff : undefined));
                    const wReps = (typeof workRepsTok === 'number') ? Math.max(0, Math.floor(workRepsTok)) : undefined;
                    const hasForced = (typeof workTempoTok === 'number');
                    const hasSoft = (typeof workTempoSoftTok === 'number');
                    const wTempoForced = (typeof wReps === 'number') ? undefined : (hasForced ? workTempoTok : undefined);
                    const wTempoSoft = (typeof wReps === 'number') ? undefined : (!hasForced && hasSoft ? workTempoSoftTok : undefined);
                    const rTempoForced = (restTokHasSlash ? (restTokHasRest ? restTempoTok : undefined) : restTempoTok);
                    const rTempoSoft = (restTokHasSlash ? (restTokHasRest ? restTempoSoftTok : undefined) : restTempoSoftTok);
                    for (let r = 0; r < rep; r++) segments.push({ on, off, eff: effTok, restEff: rEff, workTempoRpm: wTempoForced, workTempoSoftRpm: wTempoSoft, workReps: wReps, restTempoRpm: rTempoForced, restTempoSoftRpm: rTempoSoft });
                    lastAddedFrom = startLen;
                    lastAddedTo = segments.length;
                    // Persist only legacy r/rest directive.
                    if (!restTokHasSlash && typeof restTok === 'number') curRestEff = restTok;
                    i++; continue;
                }
            }
            {
                const m = tok.match(new RegExp(`^(${secRe})\\/(${secRe})(?:${repClass}(\\d+))?$`, 'i'));
                if (m) {
                    const on = clampSec(m[1]);
                    const off = clampSec(m[2]);
                    const rep = m[3] ? Math.max(1, parseInt(m[3], 10)) : 1;
                    const rEff = restTokHasSlash
                        ? (restTokHasRest ? restTok : undefined)
                        : (typeof restTok === 'number' ? restTok : (typeof curRestEff === 'number' ? curRestEff : undefined));
                    const wReps = (typeof workRepsTok === 'number') ? Math.max(0, Math.floor(workRepsTok)) : undefined;
                    const hasForced = (typeof workTempoTok === 'number');
                    const hasSoft = (typeof workTempoSoftTok === 'number');
                    const wTempoForced = (typeof wReps === 'number') ? undefined : (hasForced ? workTempoTok : undefined);
                    const wTempoSoft = (typeof wReps === 'number') ? undefined : (!hasForced && hasSoft ? workTempoSoftTok : undefined);
                    const rTempoForced = (restTokHasSlash ? (restTokHasRest ? restTempoTok : undefined) : restTempoTok);
                    const rTempoSoft = (restTokHasSlash ? (restTokHasRest ? restTempoSoftTok : undefined) : restTempoSoftTok);
                    for (let r = 0; r < rep; r++) segments.push({ on, off, eff: effTok, restEff: rEff, workTempoRpm: wTempoForced, workTempoSoftRpm: wTempoSoft, workReps: wReps, restTempoRpm: rTempoForced, restTempoSoftRpm: rTempoSoft });
                    lastAddedFrom = startLen;
                    lastAddedTo = segments.length;
                    // Persist only legacy r/rest directive.
                    if (!restTokHasSlash && typeof restTok === 'number') curRestEff = restTok;
                    i++; continue;
                }
            }
            if (new RegExp(`^${repClass}\\d+$`, 'i').test(tok) && segments.length > 0) {
                const rep = Math.max(1, parseInt(tok.slice(1), 10));
                const last = segments[segments.length - 1];
                for (let r = 1; r < rep; r++) segments.push({
                    on: last.on,
                    off: last.off,
                    eff: (typeof last.eff === 'number' ? last.eff : effTok),
                    restEff: last.restEff,
                    workTempoRpm: last.workTempoRpm,
                    workTempoSoftRpm: last.workTempoSoftRpm,
                    workReps: last.workReps,
                    restTempoRpm: last.restTempoRpm,
                    restTempoSoftRpm: last.restTempoSoftRpm
                });
                // If suffix @eff was present on the repeat token, apply it to the newly added block.
                if (typeof effTok === 'number') {
                    lastAddedFrom = startLen;
                    lastAddedTo = segments.length;
                    for (let k = lastAddedFrom; k < lastAddedTo; k++) segments[k].eff = effTok;
                    if (typeof workRepsTok === 'number') {
                        for (let k = lastAddedFrom; k < lastAddedTo; k++) {
                            segments[k].workReps = Math.max(0, Math.floor(workRepsTok));
                            segments[k].workTempoRpm = undefined;
                            segments[k].workTempoSoftRpm = undefined;
                        }
                    } else if (typeof workTempoTok === 'number') {
                        for (let k = lastAddedFrom; k < lastAddedTo; k++) {
                            segments[k].workTempoRpm = workTempoTok;
                            segments[k].workTempoSoftRpm = undefined;
                            segments[k].workReps = undefined;
                        }
                    } else if (typeof workTempoSoftTok === 'number') {
                        for (let k = lastAddedFrom; k < lastAddedTo; k++) {
                            segments[k].workTempoSoftRpm = workTempoSoftTok;
                            segments[k].workTempoRpm = undefined;
                            segments[k].workReps = undefined;
                        }
                    }
                    if (restTokHasSlash) {
                        for (let k = lastAddedFrom; k < lastAddedTo; k++) {
                            segments[k].restTempoRpm = (restTokHasRest ? restTempoTok : undefined);
                            segments[k].restTempoSoftRpm = (restTokHasRest ? restTempoSoftTok : undefined);
                        }
                    }
                } else {
                    lastAddedFrom = startLen;
                    lastAddedTo = segments.length;
                }
                i++; continue;
            }
            if (new RegExp(`^${secRe}$`, 'i').test(tok)) {
                const on = clampSec(tok);
                // Shorthand "20@..." means "20/0@..." (no implicit default rest).
                // Default rest (offDefault) applies only when the user didn't provide any @-suffix.
                let off = tokHadAtSuffix ? 0 : offDefault;
                if (i + 1 < tokens.length && new RegExp(`^${secRe}$`, 'i').test(tokens[i + 1])) { off = clampSec(tokens[i + 1]); i += 2; }
                else { i += 1; }
                const rEff = restTokHasSlash
                    ? (restTokHasRest ? restTok : undefined)
                    : (typeof restTok === 'number' ? restTok : (typeof curRestEff === 'number' ? curRestEff : undefined));
                const wReps = (typeof workRepsTok === 'number') ? Math.max(0, Math.floor(workRepsTok)) : undefined;
                const hasForced = (typeof workTempoTok === 'number');
                const hasSoft = (typeof workTempoSoftTok === 'number');
                const wTempoForced = (typeof wReps === 'number') ? undefined : (hasForced ? workTempoTok : undefined);
                const wTempoSoft = (typeof wReps === 'number') ? undefined : (!hasForced && hasSoft ? workTempoSoftTok : undefined);
                const rTempoForced = (restTokHasSlash ? (restTokHasRest ? restTempoTok : undefined) : restTempoTok);
                const rTempoSoft = (restTokHasSlash ? (restTokHasRest ? restTempoSoftTok : undefined) : restTempoSoftTok);
                segments.push({
                    on,
                    off,
                    eff: effTok,
                    restEff: rEff,
                    workTempoRpm: wTempoForced,
                    workTempoSoftRpm: wTempoSoft,
                    workReps: wReps,
                    restTempoRpm: rTempoForced,
                    restTempoSoftRpm: rTempoSoft
                });
                lastAddedFrom = startLen;
                lastAddedTo = segments.length;
                continue;
            }
            i++;
        }
        // Safety: drop zero-length segments (0/0) which can otherwise cause infinite loops in simulation.
        const out = segments.filter(s => ((+s.on || 0) + (+s.off || 0)) > 1e-9);
        try {
            if (noCycle) out._noCycle = true;
            if (hardStop) out._hardStop = true;
        } catch (_) {}
        return out;
    }
    function formatZarPatternSegments(segs, opts) {
        if (!Array.isArray(segs) || segs.length === 0) return "";
        const fmtNum = (e, maxDec = 1) => (+e).toFixed(maxDec).replace(/\.0$/, '');
        const fmtSec = (sec) => {
            const v0 = +sec;
            if (!Number.isFinite(v0)) return '0';
            const v = Math.round(Math.max(0, Math.min(600, v0)) * 100) / 100;
            // toFixed(2) then trim trailing zeros and dot.
            return v.toFixed(2).replace(/\.00$/, '').replace(/(\.\d)0$/, '$1');
        };
        const fmtEffPair = (eff, restEff) => {
            return '';
        };
        const tempoTok = (() => {
            const lang = String(opts?.lang || '').toLowerCase();
            return (lang === 'ru') ? 'т' : 't';
        })();
        const fmtTempo = (rpm) => {
            const v = +rpm;
            if (!Number.isFinite(v)) return '';
            const k = Math.round(v);
            if (!(k > 0)) return '';
            return `${tempoTok}${Math.max(5, Math.min(240, k))}`;
        };
        const repsTok = (() => {
            const lang = String(opts?.lang || '').toLowerCase();
            return (lang === 'ru') ? 'п' : 'r';
        })();
        const fmtReps = (n) => {
            const k = Math.floor(+n || 0);
            if (!(k >= 0)) return '';
            // Canonical tokens: RU uses 'пNN', EN uses 'rNN'.
            return `${repsTok}${k}`;
        };
        const fmtEffTempoPair = (eff, workTempoRpm, workTempoSoftRpm, workReps, restEff, restTempoRpm, restTempoSoftRpm) => {
            const hasEff = Number.isFinite(+eff);
            const hasWorkTempo = Number.isFinite(+workTempoRpm);
            const hasWorkReps = Number.isFinite(+workReps);
            const hasRestEff = Number.isFinite(+restEff);
            const hasRestTempo = Number.isFinite(+restTempoRpm);
            if (!hasEff && !hasWorkTempo && !hasWorkReps && !hasRestEff && !hasRestTempo) return '';

            // Mutual exclusivity: prefer reps formatting if present.
            const left = `${hasEff ? fmtNum(eff) : ''}${hasWorkReps ? fmtReps(workReps) : (hasWorkTempo ? fmtTempo(workTempoRpm) : '')}`;
            const right = `${hasRestEff ? fmtNum(restEff) : ''}${hasRestTempo ? fmtTempo(restTempoRpm) : ''}`;
            return (hasRestEff || hasRestTempo) ? `@${left}/${right}` : `@${left}`;
        };
        const normSeg = (s) => {
            const on = Math.round(Math.max(0, Math.min(600, +s?.on || 0)) * 100) / 100;
            const off = Math.round(Math.max(0, Math.min(600, +s?.off || 0)) * 100) / 100;
            const eff = Number.isFinite(+s?.eff) ? +s.eff : undefined;
            const restEff = Number.isFinite(+s?.restEff) ? +s.restEff : undefined;
            // Back-compat: legacy patterns may store tempo as workTempoSoftRpm/restTempoSoftRpm.
            const workTempoRpm = Number.isFinite(+s?.workTempoRpm)
                ? Math.max(5, Math.min(240, Math.round(+s.workTempoRpm)))
                : (Number.isFinite(+s?.workTempoSoftRpm) ? Math.max(5, Math.min(240, Math.round(+s.workTempoSoftRpm))) : undefined);
            const workReps = Number.isFinite(+s?.workReps) ? Math.max(0, Math.floor(+s.workReps)) : undefined;
            const restTempoRpm = Number.isFinite(+s?.restTempoRpm)
                ? Math.max(5, Math.min(240, Math.round(+s.restTempoRpm)))
                : (Number.isFinite(+s?.restTempoSoftRpm) ? Math.max(5, Math.min(240, Math.round(+s.restTempoSoftRpm))) : undefined);

            // Enforce exclusivity: reps targets override any tempo tokens.
            const cleanWorkTempoRpm = (typeof workReps === 'number') ? undefined : workTempoRpm;
            return { on, off, eff, restEff, workTempoRpm: cleanWorkTempoRpm, workTempoSoftRpm: undefined, workReps, restTempoRpm, restTempoSoftRpm: undefined };
        };
        const out = [];
        let prev = null;
        let rep = 0;
        const flush = () => {
            if (!prev || rep <= 0) return;
            // Always output explicit on/off.
            // NOTE: A bare number like "15" is ambiguous in the parser and becomes "15/offDefault".
            // For true milestones/EMOM blocks use "15/0".
            const base = `${fmtSec(prev.on)}/${fmtSec(prev.off)}`;
            const mult = rep > 1 ? `*${rep}` : '';
            const pair = fmtEffTempoPair(prev.eff, prev.workTempoRpm, prev.workTempoSoftRpm, prev.workReps, prev.restEff, prev.restTempoRpm, prev.restTempoSoftRpm);
            // Keep parser-friendly ordering: 30/30*5@8.5/2
            out.push(`${base}${mult}${pair}`);
        };
        for (const s of segs) {
            const cur = normSeg(s);
            if (!prev) { prev = cur; rep = 1; continue; }
            const same = (cur.on === prev.on)
                && (cur.off === prev.off)
                && ((cur.eff ?? null) === (prev.eff ?? null))
                && ((cur.restEff ?? null) === (prev.restEff ?? null))
                && ((cur.workTempoRpm ?? null) === (prev.workTempoRpm ?? null))
                && ((cur.workTempoSoftRpm ?? null) === (prev.workTempoSoftRpm ?? null))
                && ((cur.workReps ?? null) === (prev.workReps ?? null))
                && ((cur.restTempoRpm ?? null) === (prev.restTempoRpm ?? null))
                && ((cur.restTempoSoftRpm ?? null) === (prev.restTempoSoftRpm ?? null));
            if (same) { rep++; continue; }
            flush();
            prev = cur; rep = 1;
        }
        flush();
        return out.join(' ');
    }

    // HR simulation engine
    function simulateHR({
        kind, hrRest, hrMax,
        work, rest, n, eff,
        effMin,
        steadyMin, steadyFrac,
        drift10, useHRR,
        tauOn = 25, tauOff = 35,
        warm = 5, cool = 5,
        post = 0,
        restFrac,
        intervalKinetics,
        pattern,
        dur,
    // Snatch-specific (optional)
        snProt,
        snChangeMin,
    snWeight,
    snCad,
        // Swings-specific (optional)
        swProt,
        swChangeMin,
        swWeight,
        swStyle
    }) {
        const dt = 1;
        const t = [], hr = [];

        const HRR = Math.max(1, hrMax - hrRest);
        const clamp01 = (x) => Math.max(0, Math.min(1, x));
        const toBpm = (p) => useHRR ? (hrRest + p * HRR) : (p * hrMax);
        const safe = (bpm) => Math.max(hrRest, Math.min(hrMax + 10, bpm));

        let S = 0, D = 0, R = 0; // states
        let cur = hrRest; let time = 0;
        let lastWorkTargetBpm = hrRest;
        let lastWorkRpe = (kind === "SIT" ? 9.5 : 8.5);
        let baseFilteredBpm = hrRest;
        let lastMode = null;
        let postElapsedSec = 0;
        let postStartBpm = hrRest;
        let postBlend = 1;
        const restI = Math.max(0, Math.min(1, (restFrac || 0) * 2));

        // Universal Zaruba can emulate SIT-like or HIIT-like *kinetics* (fatigue build and recovery speed)
        // for cross-checking equivalence with existing interval modes.
        const intervalKind = (() => {
            if (kind !== 'ZRB') return kind;
            const v = String(intervalKinetics || '').toUpperCase();
            return (v === 'SIT' || v === 'HIIT') ? v : 'HIIT';
        })();

        const tauS_on = 60, tauS_off = 900;
        const S_gain_SIT = 20, S_gain_HIIT = 14, S_gain_steady = 8;

        const driftBasePerSec = (drift10 || 0) / 600;
        const tauD_off = 3600;
        const STEADY_CAP = { start: 0.90, width: 0.08, depth: 0.85 };

        const tauR_off = 1800;
        const kR_build_base = 0.026;
        const kR_floor = 0.85;
        const c_tauR = 0.16;

        const driftMul = { steady: 1.0, workHIIT: 1.5, workSIT: 2.4, rest: 0.10 };
        const RmulWork = { SIT: 3.4, HIIT: 1.2, Z2: 0.3, Z34: 0.3 };

        const kS = { work: 1.0, rest: 0.6, steady: 0.3 };
        const kD = { work: 0.4, rest: 0.3, steady: 0.3 };

        // Rest target baseline.
        // IMPORTANT: passive rest must be able to recover toward hrRest.
        // Rest intensity is treated as *absolute* (not relative to work):
        // restI=0 => target=hrRest, restI=1 => target near hrMax (can invert work/rest if desired).
        const restBaseBpm = (restIcur) => {
            if (intervalKind === 'SIT') return hrRest;
            const i = clamp01(restIcur);
            if ((kind === 'HIIT' || kind === 'ZRB') && i > 0) {
                return safe(toBpm(Math.min(1.02, i)));
            }
            return hrRest;
        };

        const SIT_rest_tau_mul = 1.45;
        const HIIT_rest_tau_mul = 1.15;

        const push = () => { t.push(time); hr.push(cur); };

        // Rest base target in BPM.
        // Requirements:
        // - restRPE=0 => true passive rest (hrRest)
        // - small restRPE (e.g. 0.1) must NOT jump valleys up
        // - restRPE == workRPE => base target equals work target (steady-like when intensities equal)
        // - restRPE > workRPE allowed (inversion) but must be smooth (no square plateaus)
        const restBaseFromRpe = (restRpeRaw, refWorkRpeRaw, refWorkTargetBpmRaw) => {
            if (intervalKind === 'SIT') return hrRest;
            const restRpe = Math.max(0, Math.min(10, +restRpeRaw || 0));
            if (restRpe <= 0) return hrRest;

            const refWorkRpe = Math.max(0, Math.min(10, +refWorkRpeRaw || 0));
            const refWorkTargetBpm = Number.isFinite(+refWorkTargetBpmRaw) ? +refWorkTargetBpmRaw : hrRest;
            const workSpanBpm = Math.max(0, refWorkTargetBpm - hrRest);

            // Absolute target: depends only on restRPE.
            // Use a smoothstep curve so tiny values (0.1) barely move, but mid values (4) are meaningful.
            // This avoids the "valleys go DOWN when work goes UP" artifact while keeping 0→0.1 continuous.
            const x = clamp01(restRpe / 10);
            const absFrac = clamp01(x * x * (3 - 2 * x));
            const absTarget = safe(hrRest + absFrac * HRR);

            // If we have no meaningful work reference, fall back to a gentle absolute map.
            if (refWorkRpe <= 0 || workSpanBpm <= 1) {
                return absTarget;
            }

            const ratio = restRpe / refWorkRpe; // can be >1 for inversion

            // Work-relative target: used only when rest is close to work (steady-like behavior).
            let relTarget;
            if (ratio <= 1) {
                // Work-relative rest baseline.
                // Must be VERY close to work target near equality (to avoid a sudden saw-tooth)
                // but still allow meaningful drops when rest is clearly below work.
                const a = Math.pow(Math.max(0, ratio), 1.35);
                relTarget = safe(hrRest + workSpanBpm * a);
            } else {
                // Inversion above work: smoothly extend from work target toward hrMax.
                const maxRatio = Math.max(1.01, 10 / refWorkRpe);
                const p = Math.max(0, Math.min(1, (ratio - 1) / (maxRatio - 1)));
                const a = Math.pow(p, 1.35);
                const top = safe(toBpm(1.0));
                relTarget = safe(refWorkTargetBpm + (top - refWorkTargetBpm) * a);
            }

            // Blend absolute ↔ relative based on *normalized difference*.
            // We need two things at once:
            // - Near equality: behave steady-like (w≈1) with no sharp discontinuities.
            // - Far away: behave absolute (w≈0) so fixed rest does not depend on work.
            const denom = Math.max(1e-6, Math.max(restRpe, refWorkRpe));
            const delta = clamp01(Math.abs(restRpe - refWorkRpe) / denom);
            // Make w drop very fast only when delta is meaningfully large.
            // eps≈0.12 => 0.1 RPE difference at ~5 RPE gives delta≈0.02 => w≈~1.
            const eps = 0.12;
            const p = 4;
            const w = Math.exp(-Math.pow(delta / eps, p));
            return safe(absTarget * (1 - w) + relTarget * w);
        };

        function tick(mode, baseTargetBpm, tauNominal, restIOverride) {
            const restIcur = (intervalKind === 'SIT')
                ? 0
                : (typeof restIOverride === 'number' ? Math.max(0, Math.min(1, restIOverride)) : restI);
            if (mode === 'post') {
                if (lastMode !== 'post') {
                    // When transitioning from a work peak into post-rest, starting with target=cur
                    // produces a visibly "rounded" last peak (no immediate drop).
                    // Use a rest-like start target when HR is high, but keep it continuous near HRrest
                    // to avoid a noticeable step at low HR.
                    const nearRest = (cur - hrRest) <= 8;
                    if (nearRest) {
                        postStartBpm = cur;
                    } else {
                        let restLike;
                        if ((kind === 'HIIT' || kind === 'ZRB') && restI > 0 && intervalKind !== 'SIT') {
                            restLike = restBaseBpm(restI) + kS.rest * S + kD.rest * D;
                        } else {
                            restLike = hrRest + kR_floor * R + kS.rest * S + kD.rest * D;
                        }
                        if (restLike > cur) restLike = cur;
                        postStartBpm = restLike;
                    }
                    postBlend = 1;
                }
                postElapsedSec = (lastMode === 'post') ? (postElapsedSec + dt) : 0;
                // Use a time-varying recovery speed: start gentler near the end of the workout
                // (avoids a visible slope "step" when HR is already near rest), then accelerate.
                // This affects only the *target* decay; the actual HR dynamics still use tauOff.
                const tauFast = 180;
                const tauSlow = 600;
                const tauMix = 90;
                const tauEff = tauFast + (tauSlow - tauFast) * Math.exp(-postElapsedSec / Math.max(1, tauMix));
                postBlend *= Math.exp(-dt / Math.max(1, tauEff));
            } else {
                postElapsedSec = 0;
            }
            const hrrFracNow = clamp01((cur - hrRest) / HRR);

            // Smooth base target transitions a bit to avoid visually sharp corners
            // when work/rest base targets are close (near-equality, active rest, inversion).
            // Keep it mild so passive rest still behaves like passive rest.
            let baseBpm = baseTargetBpm;
            if ((mode === 'work' || mode === 'rest') && (kind === 'HIIT' || kind === 'ZRB' || kind === 'SIT')) {
                const tauBase = (mode === 'work') ? 2.5 : 4.0;
                baseFilteredBpm += (baseTargetBpm - baseFilteredBpm) * (dt / Math.max(1e-6, tauBase));
                baseBpm = baseFilteredBpm;
            } else {
                baseFilteredBpm = baseTargetBpm;
                baseBpm = baseTargetBpm;
            }

            // Active rest blending: if rest intensity approaches (or exceeds) work intensity,
            // the dynamics should approach steady/work and the "pila" should flatten.
            let restBlend = 0;
            if (mode === 'rest' && intervalKind !== 'SIT' && (kind === 'HIIT' || kind === 'ZRB')) {
                const restRpe = Math.max(0, Math.min(10, restIcur * 10));
                const ref = Number.isFinite(+lastWorkRpe) ? Math.max(0, +lastWorkRpe) : 0;
                // Two effects:
                // 1) Equality-flattening: must be smooth and strong near equality.
                // Using an exponential in normalized difference avoids sharp transitions
                // (e.g. 5.00/5.30 should not instantly become a giant saw-tooth).
                const denom = Math.max(1e-6, Math.max(restRpe, ref));
                const delta = clamp01(Math.abs(restRpe - ref) / denom);
                const eqBlend = Math.exp(-Math.pow(delta / 0.19, 4));

                // 2) Activity-hold: if restRPE >= workRPE, rest must NOT become *more passive*
                // (otherwise rest=6 with work=5 wrongly drops the whole curve).
                // Cap below 1 to avoid reintroducing sharp "fortress wall" plateaus in inversion.
                const ratio = (ref > 0) ? (restRpe / ref) : (restRpe / 10);
                const actBlend = (ratio >= 1)
                    ? Math.min(0.85, clamp01(ratio))
                    : 0;

                restBlend = Math.max(eqBlend, actBlend);
            }

            const S_gain = (mode === "steady") ? S_gain_steady : (intervalKind === "SIT" ? S_gain_SIT : S_gain_HIIT);
            const S_target = (mode === "rest" || mode === "post" || mode === "cool")
                ? (S_gain * hrrFracNow * restBlend)
                : (S_gain * hrrFracNow);
            const tauS = (mode === "rest" || mode === "post" || mode === "cool")
                ? (tauS_off * (1 - restBlend) + tauS_on * restBlend)
                : tauS_on;
            S += (S_target - S) * (dt / tauS);

            const intensity = 0.3 + 0.7 * hrrFracNow;
            const dModeMul = (mode === "steady")
                ? driftMul.steady
                : (mode === "work")
                    ? (intervalKind === "SIT" ? driftMul.workSIT : driftMul.workHIIT)
                    : (driftMul.rest * (1 - restBlend) + driftMul.steady * restBlend);
            const applySteadyCap = (mode === "steady") && (kind !== "SN");
            const pNearMax = applySteadyCap
                ? clamp01((hrrFracNow - STEADY_CAP.start) / Math.max(1e-6, STEADY_CAP.width))
                : 0;
            const steadyCapMul = applySteadyCap
                ? (1 - STEADY_CAP.depth * (pNearMax * pNearMax))
                : 1;
            let dAdd;
            if (mode === "steady") {
                // For steady efforts (Z2/Z34/SN/SW), drift should still depend on effort level.
                // Otherwise different intensities produce nearly identical linear slopes.
                dAdd = (driftBasePerSec * dModeMul * intensity) / Math.max(1e-6, kD.steady);
                if (applySteadyCap) dAdd *= steadyCapMul;
            } else {
                dAdd = driftBasePerSec * dModeMul * intensity;
            }
            D += dAdd * dt;
            if (mode !== "steady") { D += (-D) * (dt / tauD_off); }

            if (mode === "work" || (mode === "steady" && (kind === "Z2" || kind === "Z34"))) {
                const mul = mode === "work" ? (intervalKind === "SIT" ? RmulWork.SIT : RmulWork.HIIT) : (kind === "Z2" ? RmulWork.Z2 : RmulWork.Z34);
                R += kR_build_base * mul * hrrFracNow * dt;
            } else {
                R += (-R) * (dt / tauR_off);
            }

            S = Math.max(0, Math.min(S, 30));
            R = Math.max(0, Math.min(R, 12));
            D = Math.max(0, Math.min(D, 200));

            let tauUse = tauNominal;
            if (mode === "rest" || mode === "post" || mode === "cool") {
                // If rest intensity approaches work intensity, rest dynamics should also
                // approach work dynamics (otherwise equal work/rest intensities still create a saw-tooth).
                if (mode === 'rest' && restBlend > 0 && (kind === 'HIIT' || kind === 'ZRB') && intervalKind !== 'SIT') {
                    // Keep some "rest" character even at equality (avoids sharp plateau corners).
                    const k = 0.45;
                    tauUse = (tauNominal * (1 - k * restBlend) + tauOn * (k * restBlend));
                } else tauUse = tauNominal;
                tauUse *= (1 + c_tauR * R);
                if (intervalKind === "SIT") tauUse *= SIT_rest_tau_mul;
                if (intervalKind === "HIIT") tauUse *= HIIT_rest_tau_mul;
            }

            let S_eff = S;
            if (mode === "work") {
                const thr = hrRest + 0.80 * HRR;
                const sat = clamp01((cur - thr) / Math.max(1, (hrMax - thr)));
                const comp = 1 - 0.5 * sat;
                S_eff = S * comp;
            }

            let target;
            if (mode === "work") {
                target = baseBpm + kS.work * S_eff + kD.work * D;
            } else if (mode === "rest") {
                if (kind === "HIIT" || kind === "ZRB") {
                    // Smoothly blend passive ↔ active rest so near-zero restRPE does not create a jump.
                    // restAct is ~0 near 0, ~0.35 at RPE=4, and 1 at RPE=10.
                    const restRpe = Math.max(0, Math.min(10, restIcur * 10));
                    const xr = clamp01(restRpe / 10);
                    const absAct = (intervalKind === 'SIT') ? 0 : clamp01(xr * xr * (3 - 2 * xr));
                    // Ensure work==rest (or inversion) behaves work/steady-like.
                    // restBlend already encodes equality-closeness and the "activity-hold" rule.
                    const restAct = Math.max(absAct, restBlend);

                    const passiveTarget = hrRest + kR_floor * R + kS.rest * S + kD.rest * D;
                    const kSx = kS.rest * (1 - restBlend) + kS.work * restBlend;
                    const kDx = kD.rest * (1 - restBlend) + kD.work * restBlend;
                    const activeTarget = baseBpm + kSx * S + kDx * D;

                    target = passiveTarget * (1 - restAct) + activeTarget * restAct;
                } else {
                    target = hrRest + kR_floor * R + kS.rest * S + kD.rest * D;
                }
                // Prevent "rest" from pushing HR up only when rest is truly passive.
                // If rest intensity is close to work intensity (restBlend high), allow the target to float
                // above current HR; otherwise equal work/rest intensities create an artificial flat plateau.
                const allowRiseInRest = (restIcur > 0) && (restBlend > 0.10) && (intervalKind !== 'SIT') && (kind === 'HIIT' || kind === 'ZRB');
                if (!allowRiseInRest && baseBpm < cur) { target = Math.min(target, cur); }
            } else if (mode === "cool") {
                // Active cool-down: recover toward a light-movement target (above hrRest).
                // Never push HR up during cool-down.
                target = baseBpm;
                if (target > cur) target = cur;
            } else if (mode === "post") {
                // Post-workout recovery tail.
                // Use a continuous target: start exactly from current HR at post start, then
                // smoothly decay toward hrRest. This avoids a visible "step" when the workout
                // ends around an active-recovery plateau.
                if (kind === 'SIT' || kind === 'HIIT' || kind === 'ZRB') {
                    target = hrRest + (postStartBpm - hrRest) * postBlend;
                    if (target > cur) target = cur;
                } else {
                    // For steady-style sessions, recover directly toward rest.
                    target = baseTargetBpm;
                }
            } else { 
                target = baseBpm + kS.steady * S + kD.steady * D;
                if (applySteadyCap && hrrFracNow > STEADY_CAP.start) {
                    const softBase = hrRest + STEADY_CAP.start * HRR;
                    target = softBase + (target - softBase) * steadyCapMul;
                }
            }

            target = safe(target);
            cur += (target - cur) * (dt / Math.max(1e-6, tauUse));
            time += dt;
            push();
            lastMode = mode;
        }

        function step(sec, mode, baseTargetBpm, tau, restIOverride) {
            const N = Math.max(0, Math.floor(sec || 0));
            for (let i = 0; i < N; i++) tick(mode, baseTargetBpm, tau, restIOverride);
        }
        function ramp(sec, mode, fromBpm, toBpm, tau) {
            const N = Math.max(0, Math.floor(sec || 0));
            if (N <= 0) return;
            for (let i = 0; i < N; i++) {
                const a = (i + 1) / N;
                // Ease-out ramp: avoids a visible "kink" when switching to steady.
                const eased = 1 - (1 - a) * (1 - a);
                const base = fromBpm + (toBpm - fromBpm) * eased;
                tick(mode, base, tau);
            }
        }

        // Start from true rest (hrRest). Warm-up is optional and should not artificially elevate
        // the minimum HR when a workout has no work segments.
        ramp(Math.round((warm || 0) * 60), "steady", hrRest, toBpm(0.65), tauOn);

        if (kind === "Z2" || kind === "Z34") {
            const frac = (kind === "Z2") ? (steadyFrac ?? 0.62) : (steadyFrac ?? 0.78);
            const steadyBpm = toBpm(frac);
            step(Math.max(0, Math.round((steadyMin || 0) * 60)), "steady", steadyBpm, tauOn);
    } else if (kind === "SN") {
            // Kettlebell snatch: steady effort with optional single hand-change dip
            // Adjusted (realistic): no separate "intensity" slider.
            // Intensity is a strong nonlinear function of cadence and bell weight.
            // Calibration targets (rough):
            // - 32 kg @ 18–22 rpm => near-max HR for trained athletes
            // - 8 kg @ 10–15 rpm => can remain around Z2
            const cad = Math.max(5, Math.min(35, (typeof snCad === 'number' ? snCad : 20)));
            const bellRaw = (typeof snWeight === 'number') ? snWeight : 16;
            const bell = Math.max(1, Math.min(50, bellRaw));

            const bellRatio = bell / 8;  // 8 kg baseline
            const cadRatio = cad / 10;   // 10 rpm baseline
            const load = Math.pow(bellRatio, 1.5) * Math.pow(cadRatio, 1.6);
            // Saturating map: calibrated so ~32kg @ ~20rpm is near-max.
            const intensity = Math.max(0, Math.min(1, 1 - Math.exp(-load / 7.5)));

            // Baseline target depends on weight (very light bells shouldn't start at "hard" HR levels).
            const baseFrac = 0.50 + 0.08 * Math.min(2.5, Math.sqrt(Math.max(0, bellRatio)));
            const maxFrac = 1.005;
            const targetFrac = baseFrac + (maxFrac - baseFrac) * intensity;
            const startFrac = Math.max(0.52, baseFrac - 0.06);
            const totalSec = Math.max(1, Math.round((dur || (steadyMin||10)*60)));
            // Ramp duration heuristic: baseline + heavier bell → slower ramp; higher intensity → faster ramp
            let rampSec = 180; // 3 min baseline
            rampSec += Math.max(0, (bell - 16)) * 6; // +6s per kg over 16 kg
            // Higher (cadence/weight) intensity shortens the "transition time".
            rampSec = Math.round(rampSec * (1.25 - 0.55 * intensity));
            rampSec = Math.max(120, Math.min(420, rampSec));          // clamp 2–7 min
            rampSec = Math.min(rampSec, totalSec);

            const workTarget = safe(toBpm(targetFrac));
            const startBpm = safe(toBpm(startFrac));

            const classical = (snProt || 'classic') === 'classic';
            const changeSec = classical ? Math.max(1, Math.min(totalSec-1, Math.round((snChangeMin || 5) * 60))) : -1;
            const dipSec = classical ? 6 : 0; // short micro-dip on hand change

            if (changeSec > 0) {
                // Before change: use ramp for min(changeSec, rampSec)
                const preRamp = Math.min(changeSec, rampSec);
                if (preRamp > 0) ramp(preRamp, "steady", startBpm, workTarget, tauOn);
                const preRemain = changeSec - preRamp;
                if (preRemain > 0) step(preRemain, "steady", workTarget, tauOn);

                // Dip on hand change
                if (dipSec > 0) step(Math.min(dipSec, totalSec - changeSec), "rest", hrRest + 0.35*(hrMax-hrRest), tauOff);

                // After change: continue remaining ramp if any, then steady at target
                let rem = Math.max(0, totalSec - changeSec - dipSec);
                const rampLeft = Math.max(0, rampSec - preRamp);
                if (rem > 0) {
                    if (rampLeft > 0) {
                        // estimate intermediate base for continuity
                        const fracMid = startFrac + (targetFrac - startFrac) * (preRamp / Math.max(1, rampSec));
                        const midBpm = safe(toBpm(fracMid));
                        const doRamp = Math.min(rem, rampLeft);
                        ramp(doRamp, "steady", midBpm, workTarget, tauOn);
                        rem -= doRamp;
                    }
                    if (rem > 0) step(rem, "steady", workTarget, tauOn);
                }
            } else {
                // No change/dip: full gradual ramp then steady
                if (rampSec > 0) ramp(rampSec, "steady", startBpm, workTarget, tauOn);
                const rem = totalSec - rampSec;
                if (rem > 0) step(rem, "steady", workTarget, tauOn);
            }
        } else if (kind === "SW") {
            // Kettlebell swings (unified model): gradual ramp to steady, optional single hand-change dip.
            // Intended to approximate both chest-height one-hand and overhead two-hand styles.
            // `swStyle` provides *presets* (not strict constraints):
            // - universal: flexible (best for compensating unknowns)
            // - chest1h: tighter cadence, less pause opportunity
            // - overhead2h: possible micro-pause overhead, slightly different build-up
            const style = (swStyle || 'universal');
            const effVal = (Number.isFinite(eff) ? eff : 8.5);
            // UI scale: 2..10
            const iEff = Math.max(0, Math.min(1, (effVal - 2) / 8));
            // Weight exponentially raises intensity for swings (8–12kg can sit Z3–Z4; 32kg near limit)
            const bellIn = (Number.isFinite(swWeight) ? swWeight : (Number.isFinite(snWeight) ? snWeight : 16));
            const bell = Math.max(4, Math.min(50, bellIn));
            // Logistic weight map calibrated around 18 kg (20 kg ≈ mid-high intensity, 32 kg near 1.0)
            const iW = 1 / (1 + Math.exp(-0.30 * (bell - 18)));
            // Style preset: change how much "effort" can modulate HR at a given weight.
            // Chest-height 1H tends to be more "locked in" cadence-wise → effort affects it more.
            // Overhead 2H can have brief top holds → effort affects it a bit less.
            let wW = 0.70, wE = 0.30;
            if (style === 'chest1h') { wW = 0.62; wE = 0.38; }
            if (style === 'overhead2h') { wW = 0.74; wE = 0.26; }
            let intensity = Math.max(0, Math.min(1, wW * iW + wE * iEff));
            // Overhead swings are generally more energy-expensive than chest-height.
            // Model this as a small boost to "effective" intensity.
            if (style === 'overhead2h') intensity = Math.max(0, Math.min(1, intensity * 1.06));
            // Baseline gently rises with weight so light bells stay near Z2, heavy bells approach Z3 before span
            const startFrac = (style === 'overhead2h') ? 0.62 : 0.60; // overhead starts a bit higher
            const baseFrac = (0.64 + 0.06 * iW) + (style === 'overhead2h' ? 0.01 : 0.00);
            const span = 0.30;      // allows 20 kg to settle ~0.87 HRR; 32 kg can approach near-max
            const targetFrac = baseFrac + span * intensity;
            const totalSec = Math.max(1, Math.round((dur || (steadyMin||10)*60)));
            // Ramp heuristic:
            // Important: do NOT make ramp slower for very heavy bells.
            // When target saturates near HRmax, extra weight must not increase rampSec (it makes curves look *more flat*).
            // Instead: heavier + harder => faster approach to steady.
            const baseRamp = (style === 'overhead2h') ? 240 : (style === 'chest1h' ? 270 : 300);
            // Weight factor: very light bells take longer to "build" HR, heavy bells shorten the ramp.
            const wMul = (1.18 - 0.30 * iW);           // iW=0 => 1.18, iW=1 => 0.88
            // Intensity factor: higher intensity shortens the ramp strongly.
            const iMul = (1.30 - 0.80 * intensity);    // intensity=0 => 1.30, intensity=1 => 0.50
            let rampSec = Math.round(baseRamp * wMul * iMul);
            rampSec = Math.max(120, Math.min(480, rampSec)); // clamp 2–8 min
            rampSec = Math.min(rampSec, totalSec);

            const workTarget = safe(toBpm(targetFrac));
            const startBpm = safe(toBpm(startFrac));
            // Overhead 2H: no hand change, ignore protocol/change time.
            const classical = (style === 'overhead2h') ? false : ((swProt || 'classic') === 'classic');
            // Default change at half duration if not specified
            const defaultChangeMin = Math.max(1, totalSec/120);
            const chMin = (typeof swChangeMin === 'number') ? swChangeMin : (typeof snChangeMin === 'number' ? snChangeMin : defaultChangeMin);
            const changeSec = classical ? Math.max(1, Math.min(totalSec-1, Math.round(chMin * 60))) : -1;
            const dipSec = classical
                ? (style === 'chest1h' ? 22 : 20)
                : 0;

            if (changeSec > 0) {
                const preRamp = Math.min(changeSec, rampSec);
                if (preRamp > 0) ramp(preRamp, "steady", startBpm, workTarget, tauOn);
                const preRemain = changeSec - preRamp;
                if (preRemain > 0) step(preRemain, "steady", workTarget, tauOn);
                // Dip: lower the target briefly by a small fixed BPM to create a realistic shallow dip
                if (dipSec > 0) {
                    const dipDropBpm = 18; // ~4–5 bpm actual drop with typical tauOff over ~20s
                    const dipTarget = Math.max(hrRest + 0.50*(hrMax-hrRest), workTarget - dipDropBpm);
                    step(Math.min(dipSec, totalSec - changeSec), "steady", dipTarget, tauOff);
                }
                // After change
                let rem = Math.max(0, totalSec - changeSec - dipSec);
                const rampLeft = Math.max(0, rampSec - preRamp);
                if (rem > 0) {
                    if (rampLeft > 0) {
                        const fracMid = startFrac + (targetFrac - startFrac) * (preRamp / Math.max(1, rampSec));
                        const midBpm = safe(toBpm(fracMid));
                        const doRamp = Math.min(rem, rampLeft);
                        ramp(doRamp, "steady", midBpm, workTarget, tauOn);
                        rem -= doRamp;
                    }
                    if (rem > 0) step(rem, "steady", workTarget, tauOn);
                }
            } else {
                if (rampSec > 0) ramp(rampSec, "steady", startBpm, workTarget, tauOn);
                const rem = totalSec - rampSec;
                if (rem > 0) step(rem, "steady", workTarget, tauOn);
            }
        } else {
            const W = Math.max(1, Math.floor(work || 0));
            const Rsec = Math.max(0, Math.floor(rest || 0));
            const N = Math.max(1, Math.floor(n || 1));

            const rpe = (typeof eff === "number" ? eff : (kind === "SIT" ? 9.5 : 8.5));
            // IMPORTANT: SIT UI intensity is 0..10 and must be sensitive across the range.
            // Do NOT reuse global effMin (often 6) for SIT.
            const minEffRaw = (kind === 'SIT') ? 0 : (Number.isFinite(+effMin) ? +effMin : 6);
            // For Universal Zaruba with SIT-like kinetics we keep SIT *kinetics* but do NOT force SIT mapping.
            // Also remove the low-end dead zone: if the caller uses the universal scale (effMin≈2),
            // let intensity respond from 0.
            const minEff = (kind === 'ZRB' && intervalKind === 'SIT' && minEffRaw <= 2.01) ? 0 : minEffRaw;
            const spanEff = Math.max(1e-6, (10 - minEff));

            // --- Universal ZRB: rest intensity is RELATIVE.
            // Control is 0..10, where 10 means "rest intensity equals work intensity".
            // Effective restRPE is computed per block as a fraction of workRPE.
            // This makes inversion impossible by design, and the curve flattens as rest→10.
            const isUniversalZrb = (kind === 'ZRB' && intervalKind !== 'SIT' && minEff <= 2.01);
            const workRpeRaw = Number.isFinite(+rpe) ? (+rpe) : 0;
            const restCtrlRaw = Math.max(0, Math.min(10, restI * 10));
            const workRpeUse = workRpeRaw;
            const restRpeUse = (isUniversalZrb && workRpeUse > 0)
                ? (workRpeUse * (restCtrlRaw / 10))
                : restCtrlRaw;
            const restIUse = clamp01(restRpeUse / 10);

            const intensity = Math.max(0, Math.min(1, (workRpeUse - minEff) / spanEff));

            // Effort → target HR mapping.
            // - SIT: always high-intensity.
            // - HIIT/ZRB classic (minEff≈6): low end is already "hard".
            // - ZRB universal (minEff=2): low end must be aerobic (Z1/Z2-ish), not Z3/Z4.
            let baseFrac, span;
            if (kind === "SIT") {
                // SIT: keep SIT kinetics, but allow 0..10 to cover a wide HR range.
                baseFrac = 0.68; span = 0.34;
            } else if (kind === "ZRB" && minEff <= 2.01) {
                baseFrac = 0.55; span = 0.45;
            } else {
                baseFrac = 0.70; span = 0.20;
            }
            let targetFrac = Math.max(0, Math.min(1.02, baseFrac + span * intensity));

            const rpeToTargetFrac = (rpeVal) => {
                if (!Number.isFinite(+rpeVal)) return 0;
                const vv = +rpeVal;
                if (vv <= 0) return 0;
                const i01 = Math.max(0, Math.min(1, (vv - minEff) / spanEff));
                return Math.max(0, Math.min(1.02, baseFrac + span * i01));
            };
            // Density scaling for interval protocols.
            // Goal: if you keep the same effort but add more rest (or make rest more passive),
            // the peak envelope should trend lower (otherwise it matches the continuous-work curve
            // for long work bouts).
            {
                // If we're explicitly emulating SIT, keep mapping identical: no extra density scaling.
                if (kind === 'ZRB' && intervalKind === 'SIT') {
                    // no-op
                } else {
                const Wsec = Math.max(1, Math.floor(work || 0));
                const Rsec = Math.max(0, Math.floor(rest || 0));
                const denom = Math.max(1, (Wsec + Rsec));
                const d = Wsec / denom;
                const dClamped = Math.max(0, Math.min(1, d));

                if (kind === 'ZRB' && minEff <= 2.01) {
                    // Universal Zaruba: density should reduce peaks when rest grows,
                    // but must NOT "cap" high-intensity short-on protocols (e.g. 20/40 @10)
                    // into Z2. Make density effect depend on intensity: strong at low intensity,
                    // weak near max intensity.
                    // Also account for active recovery: higher rest intensity should reduce the density penalty
                    // monotonically (no weird dip when rest crosses above work).
                    const restRpe = Math.max(0, Math.min(10, restIUse * 10));
                    const refRpe = Math.max(0, workRpeUse);
                    const restActivity = (refRpe > 0) ? clamp01(restRpe / refRpe) : clamp01(restRpe / 10);
                    const dEff = clamp01((Wsec + restActivity * Rsec) / denom);
                    const dPow = Math.pow(dEff, 0.70);
                    const intensity01 = Math.max(0, Math.min(1, intensity));
                    const k = 0.55;      // max density penalty at very low intensity
                    const gamma = 0.85;  // how fast penalty disappears as intensity→1
                    const scale = 1 - k * (1 - dPow) * Math.pow(1 - intensity01, gamma);
                    targetFrac = Math.max(0, Math.min(1.02, targetFrac * Math.max(0.25, Math.min(1, scale))));
                }

                if (kind === 'HIIT') {
                    // HIIT: milder dependence.
                    // Also account for active recovery: higher restI means rest is closer to "work"
                    // and should keep peaks higher.
                    const effD = Math.max(0, Math.min(1, (Wsec + restI * Rsec) / denom));
                    const dEff = Math.pow(effD, 0.70);
                    const densityMix = 0.70 + 0.30 * dEff;
                    targetFrac = Math.max(0, Math.min(1.02, targetFrac * densityMix));
                }
                }
            }
            const workTarget = hrRest + targetFrac * HRR;

            if (kind === "ZRB" && Array.isArray(pattern) && pattern.length > 0 && Number.isFinite(dur)) {
                let remaining = Math.max(0, Math.floor(dur || 0));
                let idx = 0;
                const noCycle = !!pattern._noCycle;
                const hardStop = !!pattern._hardStop;
                // Safety: ensure the loop always makes progress even on malformed patterns (e.g., 0/0).
                // Hard cap keeps the UI responsive even if the input is broken.
                let guard = 0;
                while (remaining > 0) {
                    if (guard++ > 20000) break;
                    if (hardStop && idx >= pattern.length) {
                        // Finished pattern (#): stop early.
                        remaining = 0;
                        break;
                    }
                    if (noCycle && idx >= pattern.length) {
                        // Finished pattern (;): continue with the main On/Off engine.
                        // This is equivalent to "pattern disabled after it ends".
                        let tailGuard = 0;
                        const baseWorkRpe = Number.isFinite(+rpe) ? Math.max(0, Math.min(10, +rpe)) : 0;
                        while (remaining > 0) {
                            if (tailGuard++ > 20000) { remaining = 0; break; }
                            if (W <= 0 && Rsec <= 0) { remaining = 0; break; }
                            if (W > 0) {
                                const w = Math.min(W, remaining);
                                lastWorkTargetBpm = workTarget;
                                lastWorkRpe = baseWorkRpe;
                                step(w, "work", workTarget, tauOn);
                                remaining -= w;
                                if (remaining <= 0) break;
                            }
                            if (Rsec > 0) {
                                const base = restBaseFromRpe(restIUse * 10, lastWorkRpe, lastWorkTargetBpm);
                                const r = Math.min(Rsec, remaining);
                                step(r, "rest", base, tauOff, restIUse);
                                remaining -= r;
                            }
                        }
                        break;
                    }
                    // Repeat the whole pattern cyclically until the requested duration ends, unless ';' or '#' is used.
                    const seg = pattern[(noCycle || hardStop) ? idx : (idx % pattern.length)];
                    const on = Math.max(0, Math.floor(+seg.on || 0));
                    const off = Math.max(0, Math.floor(+seg.off || 0));
                    // Per-block intensity: seg.eff overrides global eff for this work segment.
                    // Special case: RPE<=0 means "no work" (treat ON time as rest).
                    const rpeSeg = (seg && typeof seg.eff === 'number') ? seg.eff : rpe;
                    const isZeroWork = (Number.isFinite(rpeSeg) && rpeSeg <= 0);

                    // Per-block rest intensity (absolute scale 0..10). Used both for rest base target
                    // and for density scaling (active rest reduces the density penalty).
                    const segRestEff = (seg && typeof seg.restEff === 'number') ? seg.restEff : undefined;
                    // Rest RPE is 0..10, mapped to restFrac 0..0.5 (10 => 0.5)
                    const segRestFrac = (typeof segRestEff === 'number')
                        ? (segRestEff <= 0 ? 0 : (Math.min(10, segRestEff) / 20))
                        : (restFrac || 0);
                    const segRestIraw = Math.max(0, Math.min(1, segRestFrac * 2));
                    const segRestCtrl = Math.max(0, Math.min(10, segRestIraw * 10));
                    const segWorkRpeUse = Number.isFinite(+rpeSeg) ? Math.max(0, Math.min(10, +rpeSeg)) : 0;
                    const segRestRpeUse = (isUniversalZrb && segWorkRpeUse > 0)
                        ? (segWorkRpeUse * (segRestCtrl / 10))
                        : segRestCtrl;
                    const segRestI = clamp01(segRestRpeUse / 10);

                    const intensitySeg = Math.max(0, Math.min(1, (segWorkRpeUse - minEff) / spanEff));
                    let targetFracSeg = Math.max(0, Math.min(1.02, baseFrac + span * intensitySeg));
                    if (kind === 'ZRB' && intervalKind !== 'SIT' && minEff <= 2.01) {
                        const denomSeg = Math.max(1, (on + off));
                        const restRpeSeg = Math.max(0, Math.min(10, segRestI * 10));
                        const refRpeSeg = Math.max(0, segWorkRpeUse);
                        const restActivitySeg = (refRpeSeg > 0) ? clamp01(restRpeSeg / refRpeSeg) : clamp01(restRpeSeg / 10);
                        const dEffSeg = clamp01((on + restActivitySeg * off) / denomSeg);
                        const dPowSeg = Math.pow(dEffSeg, 0.70);
                        const intensity01Seg = Math.max(0, Math.min(1, intensitySeg));
                        const k = 0.55;
                        const gamma = 0.85;
                        const scaleSeg = 1 - k * (1 - dPowSeg) * Math.pow(1 - intensity01Seg, gamma);
                        targetFracSeg = Math.max(0, Math.min(1.02, targetFracSeg * Math.max(0.25, Math.min(1, scaleSeg))));
                    }
                    const workTargetSeg = hrRest + targetFracSeg * HRR;
                    const segBase = restBaseFromRpe(segRestI * 10, segWorkRpeUse, workTargetSeg);

                    // If the segment has no duration, skip it; if we're already past the end of the pattern,
                    // break to avoid an infinite loop on a trailing 0/0 segment.
                    if (on === 0 && off === 0) {
                        idx++;
                        continue;
                    }

                    if (on > 0) {
                        const w = Math.min(on, remaining);
                        if (isZeroWork) {
                            step(w, "rest", segBase, tauOff, segRestI);
                        } else {
                            lastWorkTargetBpm = workTargetSeg;
                            lastWorkRpe = segWorkRpeUse;
                            step(w, "work", workTargetSeg, tauOn);
                        }
                        remaining -= w;
                        if (remaining <= 0) break;
                    }
                    if (off > 0) {
                        const r = Math.min(off, remaining);
                        step(r, "rest", segBase, tauOff, segRestI);
                        remaining -= r;
                    }
                    idx++;
                }
            } else {
                // Intervals are modeled as N work segments with rests *between* them.
                // Do not append an extra rest after the final work: post-workout recovery
                // should be represented by cool-down and/or post-rest tail.
                for (let i = 0; i < N; i++) {
                    lastWorkTargetBpm = workTarget;
                    lastWorkRpe = workRpeUse;
                    step(W, "work", workTarget, tauOn);
                    if (i < N - 1 && Rsec > 0) {
                        const base = restBaseFromRpe(restIUse * 10, lastWorkRpe, lastWorkTargetBpm);
                        step(Rsec, "rest", base, tauOff, restIUse);
                    }
                }
            }
        }

        // Cool-down & post-workout tail.
        // IMPORTANT: for interval-like protocols (SIT/HIIT/ZRB) we avoid an eased ramp here.
        // A slow-changing base target can make the *final* peak look "rounded" compared to
        // earlier peaks (which transition to rest immediately). Using a direct post-recovery
        // step keeps the last peak shape consistent while preserving a smooth cool→post tail.
        const coolSec = Math.round((cool || 0) * 60);
        if (coolSec > 0) {
            // Cool-down should be distinct from a fully passive post-rest tail.
            // Model it as an "active" recovery toward a light-movement target above hrRest.
            // Choose a target that is roughly comparable across HRR vs %HRmax modes.
            const coolTargetBpm = useHRR
                ? (hrRest + 0.35 * HRR)        // ~Z1-ish in HRR terms
                : (0.54 * hrMax);              // ~Z1-ish in %HRmax terms
            const coolBase = safe(coolTargetBpm);

            if (kind === "SIT" || kind === "HIIT" || kind === "ZRB") {
                // Interval cool-down: keep the last peak shape consistent (no eased ramp here).
                step(coolSec, "cool", coolBase, tauOff);
            } else {
                // For steady-style sessions keep a gradual cool-down toward the light target.
                ramp(coolSec, "cool", cur, coolBase, tauOff);
            }
        }
        step(Math.round((post || 0) * 60), "post", hrRest, tauOff);
        return { t, hr, kind };
    }

    // Z2/Z34 tail check utility
    function zoneTailViolation(hrSeries, hrRest, hrMax, useHRR, zoneMinFrac, zoneMaxFrac, steadySec, warmSec = 300) {
        const asBpmLocal = p => useHRR ? (hrRest + p * (hrMax - hrRest)) : (p * hrMax);
        const minBpm = asBpmLocal(zoneMinFrac);
        const maxBpm = asBpmLocal(zoneMaxFrac);
        const warmupIdx = Math.max(0, Math.floor(warmSec));
        const steadyStart = warmupIdx;
        const steadyEnd = steadyStart + steadySec;
        const steadyHR = hrSeries.slice(steadyStart, steadyEnd);
        const tailLen = Math.min(300, steadyHR.length);
        const tail = steadyHR.slice(-tailLen);
        let outOfZone = 0; for (const hr of tail) if (hr < minBpm || hr > maxBpm) outOfZone++;
        return { frac: tail.length ? outOfZone / tail.length : 0, minBpm, maxBpm, last: tail.at(-1) ?? null };
    }

    // TRIMP-like and zonal load utilities
    function hrLoadAU(hrSeries, hrRest, hrMax, useHRR, warmSec = 0, coolSec = 0, b = 1.92) {
        try {
            if (!Array.isArray(hrSeries) || !hrSeries.length) return 0;
            const HRR = Math.max(1, hrMax - hrRest);
            const start = Math.max(0, Math.floor(warmSec || 0));
            const end = Math.max(start, hrSeries.length - Math.max(0, Math.floor(coolSec || 0)));
            let sum = 0;
            for (let i = start; i < end; i++) {
                const hr = hrSeries[i];
                const f = useHRR ? Math.max(0, Math.min(1, (hr - hrRest) / HRR)) : Math.max(0, Math.min(1, hr / Math.max(1, hrMax)));
                sum += f * Math.exp(b * f);
            }
            return sum / 60;
        } catch (_) { return 0; }
    }
    function hrLoadZone(hrSeries, hrRest, hrMax, useHRR, warmSec = 0, coolSec = 0, weights, zoneFractions) {
        const W = Object.assign({ Z1: 0.5, Z2: 1, Z3: 2, Z4: 3, Z5: 4 }, weights || {});
        if (!Array.isArray(hrSeries) || !hrSeries.length) return 0;
        const HRR = Math.max(1, hrMax - hrRest);

        // Zone boundaries should match the chart overlay. If activity-specific fractions are provided,
        // use their *start* thresholds (Z2 start, Z3 start, ...). Otherwise fall back to classic 60/70/80/90%.
        const af = (zoneFractions && typeof zoneFractions === 'object') ? zoneFractions : null;
        const z2Start = (af && af.Z2 && Number.isFinite(af.Z2[0])) ? af.Z2[0] : 0.60;
        const z3Start = (af && af.Z3 && Number.isFinite(af.Z3[0])) ? af.Z3[0] : 0.70;
        const z4Start = (af && af.Z4 && Number.isFinite(af.Z4[0])) ? af.Z4[0] : 0.80;
        const z5Start = (af && af.Z5 && Number.isFinite(af.Z5[0])) ? af.Z5[0] : 0.90;
        const start = Math.max(0, Math.floor(warmSec || 0));
        const end = Math.max(start, hrSeries.length - Math.max(0, Math.floor(coolSec || 0)));
        let sum = 0;
        for (let i = start; i < end; i++) {
            const hr = hrSeries[i];
            const f = useHRR ? Math.max(0, Math.min(1, (hr - hrRest) / HRR)) : Math.max(0, Math.min(1, hr / Math.max(1, hrMax)));
            let w = 0;
            if (f < z2Start) w = W.Z1;
            else if (f < z3Start) w = W.Z2;
            else if (f < z4Start) w = W.Z3;
            else if (f < z5Start) w = W.Z4;
            else w = W.Z5;
            sum += w;
        }
        return sum / 60;
    }

    // --- Zaruba performance model (reps) + optimizer ---
    // This is an intentionally simple, user-tunable model to generate a *custom* work/rest strategy
    // for a fixed-duration "max reps" test (e.g. 5-min Zaruba). It is separate from HR simulation.
    //
    // Fatigue f in [0..1]. Work increases fatigue, rest decreases fatigue.
    // Reps rate is reduced by fatigue and scaled by intensity.
    function simulateZarubaReps(pattern, durSec, model) {
        try {
            const totalSec = Math.max(1, Math.floor(+durSec || 0));
            const ptn = Array.isArray(pattern) ? pattern : [];
            const clamp01 = (x) => Math.max(0, Math.min(1, x));

            const cadenceMaxRpmBase = Math.max(1, +model?.cadenceMaxRpm || 20); // reps/min @ intensity=10, fresh
            const allOutSec = Math.max(5, +model?.allOutSec || 45);          // how long you can hold "max" before breaking
            const recTauSec = Math.max(5, +model?.recTauSec || 30);          // fatigue recovery time constant (passive rest)
            const minCadenceFrac = clamp01(Number.isFinite(+model?.minCadenceFrac) ? (+model.minCadenceFrac) : 0.35);
            const fCrit = clamp01(Number.isFinite(+model?.fCrit) ? (+model.fCrit) : 0.85); // above this fatigue, "all-out" breaks down quickly
            // Tempo fatigue scaling exponent: fatigue build ∝ (tempoFrac ^ tempoFatiguePow).
            // >1 makes slower tempo disproportionately less fatiguing than linear.
            const tempoFatiguePow = Math.max(0.5, Math.min(3.0, +model?.tempoFatiguePow || 1.0));
            // switchCostSec: non-productive transition time at the beginning of each *work* segment (except the very first).
            // It consumes the segment's ON time (does not extend total time) and yields no reps.
            // IMPORTANT: switch time is NOT real rest; by default it provides no recovery (switchRecoveryFrac=0).
            const switchCostSec = Math.max(0, Math.floor(+model?.switchCostSec || 0));
            const switchRecoveryFrac = clamp01(Number.isFinite(+model?.switchRecoveryFrac) ? (+model.switchRecoveryFrac) : 0);

            let f = clamp01(+model?.fatigue0 || 0);
            let repsRaw = 0;
            let clicks = 0;
            let phase = 0.5; // keep in sync with simulateZarubaClickPlan
            let t = 0;
            let idx = 0;

            const clampTempoRpm = (v) => {
                const n = +v;
                if (!Number.isFinite(n)) return undefined;
                const k = Math.round(n);
                if (!(k > 0)) return undefined;
                return Math.max(5, Math.min(240, k));
            };

            // Semantics:
            // - If a work segment has an explicit tempo override (tXX), treat it as an absolute cadence cap.
            //   (Intensity affects fatigue, not the metronome base cadence.)
            // - Otherwise, eff10 is a *pace fraction* (0..10) of the default cadenceMaxRpmBase.
            const emitClicksOneSecond = (secIndex, effRpm) => {
                if (!(effRpm > 0.5)) return;
                const rps = effRpm / 60;
                let cur = secIndex;
                const end = secIndex + 1;
                while (cur < end - 1e-12) {
                    const dtToNext = (1 - phase) / rps;
                    if (cur + dtToNext <= end + 1e-12) {
                        clicks++;
                        cur = cur + dtToNext;
                        phase = 0;
                        if (clicks > totalSec * 6) break;
                    } else {
                        phase = phase + rps * (end - cur);
                        phase = phase - Math.floor(phase);
                        cur = end;
                    }
                }
            };

            const stepWorkFixedCap = (sec, eff10, workTempoRpm, workTempoSoftRpm) => {
                const N = Math.max(0, Math.floor(sec));
                const paceFrac = clamp01((+eff10 || 0) / 10);
                // Canonical semantics: tempo override is an absolute rpm cap/target.
                // Back-compat: older patterns may provide tempo via workTempoSoftRpm.
                const tempoOverrideRpm = (typeof workTempoRpm === 'number')
                    ? workTempoRpm
                    : ((typeof workTempoSoftRpm === 'number') ? workTempoSoftRpm : undefined);
                const hasTempoOverride = (typeof tempoOverrideRpm === 'number');
                const cadenceMaxRpmLocal = hasTempoOverride ? tempoOverrideRpm : cadenceMaxRpmBase;
                const cadenceBase = Math.max(1, cadenceMaxRpmBase);
                for (let k = 0; k < N; k++) {
                    const secIndex = t + k;
                    const over = (f <= fCrit) ? 0 : Math.max(0, Math.min(1, (f - fCrit) / Math.max(1e-6, (1 - fCrit))));
                    const perf = (f <= fCrit) ? 1.0 : (minCadenceFrac + (1 - minCadenceFrac) * (1 - over));
                    const baseRpm = hasTempoOverride ? cadenceMaxRpmLocal : (cadenceMaxRpmLocal * paceFrac);
                    const effRpm = baseRpm * Math.max(0, perf);
                    repsRaw += effRpm / 60;
                    emitClicksOneSecond(secIndex, effRpm);

                    const tempoFracEff = Math.max(0, effRpm / cadenceBase);
                    const tempoScale = Math.pow(tempoFracEff, tempoFatiguePow);
                    const baseDf = (fCrit / allOutSec) * tempoScale;
                    const accel = (f <= fCrit) ? 1.0 : (1.0 + 6.0 * over);
                    f = clamp01(f + baseDf * accel);
                }
                return N;
            };

            const stepWorkFixedReps = (sec, eff10, repsTarget) => {
                const N = Math.max(0, Math.floor(sec));
                const target = Math.max(0, Math.floor(+repsTarget || 0));
                if (N <= 0 || target <= 0) return 0;

                // Reps-target directive: enforce *exactly* N reps in this work span.
                // Make cadence constant and independent of fatigue-driven cadence reduction.
                // Also reset phase so each reps-target span is self-contained (no carry from previous segments).
                const paceFrac = clamp01((+eff10 || 0) / 10);
                const cadenceBase = Math.max(1, cadenceMaxRpmBase);
                const desiredRpm = 60 * target / Math.max(1e-6, N);
                phase = 0.5;

                // Count reps deterministically.
                clicks += target;
                repsRaw += target;

                // Fatigue evolves per second; scale fatigue by intensity (paceFrac) even though cadence is fixed.
                for (let k = 0; k < N; k++) {
                    const over = (f <= fCrit) ? 0 : Math.max(0, Math.min(1, (f - fCrit) / Math.max(1e-6, (1 - fCrit))));
                    const tempoFracEff = Math.max(0, (desiredRpm / cadenceBase) * paceFrac);
                    const tempoScale = Math.pow(tempoFracEff, tempoFatiguePow);
                    const baseDf = (fCrit / allOutSec) * tempoScale;
                    const accel = (f <= fCrit) ? 1.0 : (1.0 + 6.0 * over);
                    f = clamp01(f + baseDf * accel);
                }
                return N;
            };

            const simulateWorkSpanClicks = (sec, eff10, tempoCapRpm, fStart, phaseStart) => {
                const N = Math.max(0, Math.floor(sec));
                const paceFrac = clamp01((+eff10 || 0) / 10);
                const hasTempoOverride = (typeof tempoCapRpm === 'number');
                const cadenceMaxRpmLocal = hasTempoOverride ? tempoCapRpm : cadenceMaxRpmBase;
                const cadenceBase = Math.max(1, cadenceMaxRpmBase);
                let fLocal = clamp01(fStart);
                let phaseLocal = phaseStart;
                let clicksLocal = 0;
                let repsRawLocal = 0;
                for (let k = 0; k < N; k++) {
                    const over = (fLocal <= fCrit) ? 0 : Math.max(0, Math.min(1, (fLocal - fCrit) / Math.max(1e-6, (1 - fCrit))));
                    const perf = (fLocal <= fCrit) ? 1.0 : (minCadenceFrac + (1 - minCadenceFrac) * (1 - over));
                    const baseRpm = hasTempoOverride ? cadenceMaxRpmLocal : (cadenceMaxRpmLocal * paceFrac);
                    const effRpm = baseRpm * Math.max(0, perf);
                    repsRawLocal += effRpm / 60;

                    if (effRpm > 0.5) {
                        const rps = effRpm / 60;
                        let cur = 0;
                        const end = 1;
                        while (cur < end - 1e-12) {
                            const dtToNext = (1 - phaseLocal) / rps;
                            if (cur + dtToNext <= end + 1e-12) {
                                clicksLocal++;
                                cur = cur + dtToNext;
                                phaseLocal = 0;
                                if (clicksLocal > totalSec * 6) break;
                            } else {
                                phaseLocal = phaseLocal + rps * (end - cur);
                                phaseLocal = phaseLocal - Math.floor(phaseLocal);
                                cur = end;
                            }
                        }
                    }

                    const tempoFracEff = Math.max(0, effRpm / cadenceBase);
                    const tempoScale = Math.pow(tempoFracEff, tempoFatiguePow);
                    const baseDf = (fCrit / allOutSec) * tempoScale;
                    const accel = (fLocal <= fCrit) ? 1.0 : (1.0 + 6.0 * over);
                    fLocal = clamp01(fLocal + baseDf * accel);
                }
                return { clicks: clicksLocal, repsRaw: repsRawLocal, fatigueEnd: fLocal, phaseEnd: phaseLocal };
            };
            const stepRest = (sec, restEff10) => {
                const N = Math.max(0, Math.floor(sec));
                const r01 = clamp01((+restEff10 || 0) / 10);
                // Active rest slows recovery in this performance model.
                const tau = recTauSec * (1 + 1.5 * r01);
                const k = 1 / Math.max(1, tau);
                for (let k0 = 0; k0 < N; k0++) {
                    f = clamp01(f + (-f) * k);
                }
                return N;
            };

            const stepSwitch = (sec, restEff10) => {
                const N = Math.max(0, Math.floor(sec));
                if (N <= 0) return 0;
                if (!(switchRecoveryFrac > 1e-9)) return N;
                const r01 = clamp01((+restEff10 || 0) / 10);
                const tau = recTauSec * (1 + 1.5 * r01);
                const k = (1 / Math.max(1, tau)) * switchRecoveryFrac;
                for (let k0 = 0; k0 < N; k0++) {
                    f = clamp01(f + (-f) * k);
                }
                return N;
            };

            while (t < totalSec) {
                const seg = ptn[idx] || ptn[ptn.length - 1] || { on: totalSec, off: 0 };
                const on = Math.max(0, Math.floor(+seg.on || 0));
                const off = Math.max(0, Math.floor(+seg.off || 0));
                const eff = Number.isFinite(+seg.eff) ? +seg.eff : (+model?.defaultEff10 || 10);
                const restEff = Number.isFinite(+seg.restEff) ? +seg.restEff : (+model?.defaultRestEff10 || 0);
                const workReps = (Number.isFinite(+seg.workReps) ? Math.max(0, Math.floor(+seg.workReps)) : undefined);
                const workTempoRpm = (Number.isFinite(+seg.workTempoRpm)
                    ? clampTempoRpm(+seg.workTempoRpm)
                    : (Number.isFinite(+seg.workTempoSoftRpm) ? clampTempoRpm(+seg.workTempoSoftRpm) : undefined));
                const workTempoSoftRpm = undefined;

                if (on === 0 && off === 0) { idx++; if (idx >= ptn.length) break; continue; }

                // Transition cost at the start of WORK: taken *from ON* time.
                // Important: do NOT charge it before the very first segment.
                let onLeft = on;
                if (switchCostSec > 0 && idx > 0 && onLeft > 0 && t < totalSec) {
                    const sc = Math.min(switchCostSec, onLeft, totalSec - t);
                    if (sc > 0) {
                        t += stepSwitch(sc, restEff);
                        onLeft -= sc;
                        if (t >= totalSec) break;
                    }
                }

                if (onLeft > 0 && t < totalSec) {
                    const w = Math.min(onLeft, totalSec - t);
                    if (typeof workReps === 'number') {
                        t += stepWorkFixedReps(w, eff, workReps);
                    } else {
                        t += stepWorkFixedCap(w, eff, workTempoRpm, workTempoSoftRpm);
                    }
                }
                if (off > 0 && t < totalSec) {
                    const r = Math.min(off, totalSec - t);
                    t += stepRest(r, restEff);
                }
                idx++;
                if (idx > 10000) break;
            }
            return { reps: Math.max(0, Math.floor(clicks)), repsRaw, fatigueEnd: f };
        } catch (_) {
            return { reps: 0, repsRaw: 0, fatigueEnd: 0 };
        }
    }

    // Deterministic metronome click plan for Zaruba Big Screen.
    // Produces click times (seconds from start) such that:
    // - Fatigue/performance evolves exactly like simulateZarubaReps (1s stepping)
    // - Total clicks equals Math.round(repsRaw) (via +0.5 phase offset)
    function simulateZarubaClickPlan(pattern, durSec, model) {
        try {
            const totalSec = Math.max(1, Math.floor(+durSec || 0));
            const ptn = Array.isArray(pattern) ? pattern : [];
            const clamp01 = (x) => Math.max(0, Math.min(1, x));

            const cadenceMaxRpmBase = Math.max(1, +model?.cadenceMaxRpm || 20);
            const allOutSec = Math.max(5, +model?.allOutSec || 45);
            const recTauSec = Math.max(5, +model?.recTauSec || 30);
            const minCadenceFrac = clamp01(Number.isFinite(+model?.minCadenceFrac) ? (+model.minCadenceFrac) : 0.35);
            const fCrit = clamp01(Number.isFinite(+model?.fCrit) ? (+model.fCrit) : 0.85);
            const tempoFatiguePow = Math.max(0.5, Math.min(3.0, +model?.tempoFatiguePow || 1.0));
            const switchCostSec = Math.max(0, Math.floor(+model?.switchCostSec || 0));
            const switchRecoveryFrac = clamp01(Number.isFinite(+model?.switchRecoveryFrac) ? (+model.switchRecoveryFrac) : 0);

            let f = clamp01(+model?.fatigue0 || 0);
            let repsRaw = 0;

            const clampTempoRpm = (v) => {
                const n = +v;
                if (!Number.isFinite(n)) return undefined;
                const k = Math.round(n);
                if (!(k > 0)) return undefined;
                return Math.max(5, Math.min(240, k));
            };

            // Generate click times on-the-fly to keep phase carry available for workReps solving.
            // Phase accumulator offset of +0.5 makes total clicks equal Math.round(repsRaw) for tempo-based plans.
            let phase = 0.5;
            const clickTimesSec = [];

            const emitClicksOneSecond = (secIndex, effRpm) => {
                if (!(effRpm > 0.5)) return;
                const rps = effRpm / 60;
                let cur = secIndex;
                const end = secIndex + 1;
                while (cur < end - 1e-12) {
                    const dtToNext = (1 - phase) / rps;
                    if (cur + dtToNext <= end + 1e-12) {
                        const tClick = cur + dtToNext;
                        clickTimesSec.push(tClick);
                        cur = tClick;
                        phase = 0;
                        if (clickTimesSec.length > totalSec * 6) break;
                    } else {
                        phase = phase + rps * (end - cur);
                        phase = phase - Math.floor(phase);
                        cur = end;
                    }
                }
            };

            const stepRestOne = (restEff10) => {
                const r01 = clamp01((+restEff10 || 0) / 10);
                const tau = recTauSec * (1 + 1.5 * r01);
                const k = 1 / Math.max(1, tau);
                f = clamp01(f + (-f) * k);
            };

            const stepWorkFixedReps = (tStartSec, sec, eff10, repsTarget) => {
                const N = Math.max(0, Math.floor(sec));
                const target = Math.max(0, Math.floor(+repsTarget || 0));
                if (N <= 0 || target <= 0) return;

                // Enforce *exactly* N reps, uniformly spaced inside (tStart, tStart+N).
                // Reset phase so reps-target spans are self-contained (no carry-in from prior blocks).
                phase = 0.5;
                const interval = N / target;
                for (let k = 0; k < target; k++) {
                    const tClick = tStartSec + (k + 0.5) * interval;
                    // Keep strictly inside the span.
                    if (tClick > tStartSec + 1e-9 && tClick < (tStartSec + N) - 1e-9) clickTimesSec.push(tClick);
                }
                repsRaw += target;

                // Fatigue stepping: constant cadence, scaled by intensity (eff10).
                const paceFrac = clamp01((+eff10 || 0) / 10);
                const cadenceBase = Math.max(1, cadenceMaxRpmBase);
                const desiredRpm = 60 * target / Math.max(1e-6, N);
                for (let k0 = 0; k0 < N; k0++) {
                    const over = (f <= fCrit) ? 0 : Math.max(0, Math.min(1, (f - fCrit) / Math.max(1e-6, (1 - fCrit))));
                    const tempoFracEff = Math.max(0, (desiredRpm / cadenceBase) * paceFrac);
                    const tempoScale = Math.pow(tempoFracEff, tempoFatiguePow);
                    const baseDf = (fCrit / allOutSec) * tempoScale;
                    const accel = (f <= fCrit) ? 1.0 : (1.0 + 6.0 * over);
                    f = clamp01(f + baseDf * accel);
                }
            };

            const simulateWorkSpanClicks = (sec, eff10, tempoCapRpm, fStart, phaseStart) => {
                const N = Math.max(0, Math.floor(sec));
                const paceFrac = clamp01((+eff10 || 0) / 10);
                // Back-compat helper: this simulates a forced tempo cap.
                const hasForcedTempo = (typeof tempoCapRpm === 'number');
                const cadenceMaxRpmLocal = hasForcedTempo ? tempoCapRpm : cadenceMaxRpmBase;
                const cadenceBase = Math.max(1, cadenceMaxRpmBase);
                let fLocal = clamp01(fStart);
                let phaseLocal = phaseStart;
                let clicksLocal = 0;
                let repsRawLocal = 0;
                for (let k0 = 0; k0 < N; k0++) {
                    const over = (fLocal <= fCrit) ? 0 : Math.max(0, Math.min(1, (fLocal - fCrit) / Math.max(1e-6, (1 - fCrit))));
                    const perf = (fLocal <= fCrit) ? 1.0 : (minCadenceFrac + (1 - minCadenceFrac) * (1 - over));
                    const baseRpm = hasForcedTempo ? cadenceMaxRpmLocal : (cadenceMaxRpmLocal * paceFrac);
                    const effRpm = hasForcedTempo ? baseRpm : (baseRpm * Math.max(0, perf));
                    repsRawLocal += effRpm / 60;

                    if (effRpm > 0.5) {
                        const rps = effRpm / 60;
                        let cur = 0;
                        const end = 1;
                        while (cur < end - 1e-12) {
                            const dtToNext = (1 - phaseLocal) / rps;
                            if (cur + dtToNext <= end + 1e-12) {
                                clicksLocal++;
                                cur = cur + dtToNext;
                                phaseLocal = 0;
                                if (clicksLocal > totalSec * 6) break;
                            } else {
                                phaseLocal = phaseLocal + rps * (end - cur);
                                phaseLocal = phaseLocal - Math.floor(phaseLocal);
                                cur = end;
                            }
                        }
                    }

                    const tempoFracEff = Math.max(0, effRpm / cadenceBase);
                    const tempoScale = Math.pow(tempoFracEff, tempoFatiguePow);
                    const baseDf = (fCrit / allOutSec) * tempoScale;
                    const accel = (fLocal <= fCrit) ? 1.0 : (1.0 + 6.0 * over);
                    fLocal = clamp01(fLocal + baseDf * accel);
                }
                return { clicks: clicksLocal, repsRaw: repsRawLocal, fatigueEnd: fLocal, phaseEnd: phaseLocal };
            };

            const stepWorkOne = (secIndex, eff10, workTempoRpm, workTempoSoftRpm) => {
                const paceFrac = clamp01((+eff10 || 0) / 10);
                const tempoOverrideRpm = (typeof workTempoRpm === 'number')
                    ? workTempoRpm
                    : ((typeof workTempoSoftRpm === 'number') ? workTempoSoftRpm : undefined);
                const hasTempoOverride = (typeof tempoOverrideRpm === 'number');
                const cadenceMaxRpmLocal = hasTempoOverride ? tempoOverrideRpm : cadenceMaxRpmBase;
                const cadenceBase = Math.max(1, cadenceMaxRpmBase);

                const over = (f <= fCrit) ? 0 : Math.max(0, Math.min(1, (f - fCrit) / Math.max(1e-6, (1 - fCrit))));
                const perf = (f <= fCrit) ? 1.0 : (minCadenceFrac + (1 - minCadenceFrac) * (1 - over));
                const baseRpm = hasTempoOverride ? cadenceMaxRpmLocal : (cadenceMaxRpmLocal * paceFrac);
                const effRpm = baseRpm * Math.max(0, perf);
                repsRaw += effRpm / 60;
                emitClicksOneSecond(secIndex, effRpm);

                const tempoFracEff = Math.max(0, effRpm / cadenceBase);
                const tempoScale = Math.pow(tempoFracEff, tempoFatiguePow);
                const baseDf = (fCrit / allOutSec) * tempoScale;
                const accel = (f <= fCrit) ? 1.0 : (1.0 + 6.0 * over);
                f = clamp01(f + baseDf * accel);
            };

            const stepSwitchOne = (restEff10) => {
                if (!(switchRecoveryFrac > 1e-9)) return;
                const r01 = clamp01((+restEff10 || 0) / 10);
                const tau = recTauSec * (1 + 1.5 * r01);
                const k = (1 / Math.max(1, tau)) * switchRecoveryFrac;
                f = clamp01(f + (-f) * k);
            };

            let t = 0;
            let idx = 0;
            while (t < totalSec) {
                const seg = ptn[idx] || ptn[ptn.length - 1] || { on: totalSec, off: 0 };
                const on = Math.max(0, Math.floor(+seg.on || 0));
                const off = Math.max(0, Math.floor(+seg.off || 0));
                const eff = Number.isFinite(+seg.eff) ? +seg.eff : (+model?.defaultEff10 || 10);
                const restEff = Number.isFinite(+seg.restEff) ? +seg.restEff : (+model?.defaultRestEff10 || 0);
                const workReps = (Number.isFinite(+seg.workReps) ? Math.max(0, Math.floor(+seg.workReps)) : undefined);
                const workTempoRpm = (Number.isFinite(+seg.workTempoRpm)
                    ? clampTempoRpm(+seg.workTempoRpm)
                    : (Number.isFinite(+seg.workTempoSoftRpm) ? clampTempoRpm(+seg.workTempoSoftRpm) : undefined));
                const workTempoSoftRpm = undefined;

                if (on === 0 && off === 0) { idx++; if (idx >= ptn.length) break; continue; }

                // Switch cost at start of WORK, taken from ON.
                let onLeft = on;
                if (switchCostSec > 0 && idx > 0 && onLeft > 0 && t < totalSec) {
                    const sc = Math.min(switchCostSec, onLeft, totalSec - t);
                    for (let k0 = 0; k0 < sc; k0++) {
                        stepSwitchOne(restEff);
                        t++;
                        if (t >= totalSec) break;
                    }
                    onLeft -= sc;
                }

                // WORK
                if (onLeft > 0 && t < totalSec) {
                    const w = Math.min(onLeft, totalSec - t);
                    if (typeof workReps === 'number') {
                        stepWorkFixedReps(t, w, eff, workReps);
                        t += w;
                    } else {
                        for (let k0 = 0; k0 < w; k0++) {
                            stepWorkOne(t, eff, workTempoRpm, workTempoSoftRpm);
                            t++;
                            if (t >= totalSec) break;
                        }
                    }
                }

                // REST
                if (off > 0 && t < totalSec) {
                    const r = Math.min(off, totalSec - t);
                    for (let k0 = 0; k0 < r; k0++) {
                        stepRestOne(restEff);
                        t++;
                        if (t >= totalSec) break;
                    }
                }

                idx++;
                if (idx > 10000) break;
            }

            return {
                reps: clickTimesSec.length,
                repsRaw,
                fatigueEnd: f,
                clickTimesSec
            };
        } catch (_) {
            return { reps: 0, repsRaw: 0, fatigueEnd: 0, clickTimesSec: [] };
        }
    }

    function optimizeZarubaPattern(opts) {
        // Returns { pattern: [{on,off,eff,restEff},...], reps, meta }
        try {
            const totalSec = Math.max(30, Math.floor(+opts?.durSec || 300));
            const model = opts?.model || {};
            const restEff10 = Number.isFinite(+opts?.restEff10) ? +opts.restEff10 : (Number.isFinite(+model?.defaultRestEff10) ? +model.defaultRestEff10 : 0);

            const fixedCycles = (() => {
                const v = +opts?.fixedCycles;
                if (!Number.isFinite(v)) return null;
                const k = Math.floor(v);
                if (!(k > 0)) return null;
                return Math.max(1, Math.min(200, k));
            })();
            const allowContinuousWorkSegments = !!opts?.allowContinuousWorkSegments || (fixedCycles !== null && fixedCycles >= 2);
            const finishSprintSec = Math.max(0, Math.floor(+opts?.finishSprintSec || 0));

            const cadenceMaxRpmBase = Math.max(1, +model?.cadenceMaxRpm || 20);
            // Sustain cap: cap ON duration as a function of (nominal pace fraction) so mid/high tempo blocks
            // can't last for minutes when allOutSec is small.
            const tempoSustainPow = (() => {
                const v = +opts?.tempoSustainPow;
                if (!Number.isFinite(v)) return 3.0;
                return Math.max(1.0, Math.min(8.0, v));
            })();
            const clampTempoRpm = (v) => {
                const n = +v;
                if (!Number.isFinite(n)) return undefined;
                const k = Math.round(n);
                if (!(k > 0)) return undefined;
                return Math.max(5, Math.min(240, k));
            };

            // Candidate action space (kept small for browser performance + readable patterns)
            let onSet = (Array.isArray(opts?.onSet) && opts.onSet.length)
                ? opts.onSet.slice()
                : [8, 10, 12, 15, 20, 25, 30, 35, 40, 45, 60, 75, 90];
            // If the user pins cycle count, make sure a full-duration block is always a legal option.
            if (fixedCycles !== null && !onSet.includes(totalSec)) onSet.push(totalSec);
            const offSet = (Array.isArray(opts?.offSet) && opts.offSet.length)
                ? opts.offSet
                : [5, 8, 10, 12, 15, 20, 25, 30, 40, 60];
            const effSet = (Array.isArray(opts?.effSet) && opts.effSet.length)
                ? opts.effSet
                : [7.5, 8.5, 9.2, 10];

            // Optional: allow the optimizer to choose a lower steady tempo (rpm) instead of forcing a max cadence.
            // If omitted, tempo is taken from model.cadenceMaxRpm.
            const workTempoSetRpmRaw = (Array.isArray(opts?.workTempoSetRpm) && opts.workTempoSetRpm.length)
                ? opts.workTempoSetRpm
                : [undefined];
            const workTempoSetRpm = Array.from(new Set(workTempoSetRpmRaw
                .map(v => clampTempoRpm(v))
                .map(v => (typeof v === 'number' ? Math.min(v, cadenceMaxRpmBase) : undefined))
            ));
            // Scheme language has only lowercase tempo overrides (t/т) and no "soft caps".
            // Any mode flags are treated as legacy and ignored.
            const workTempoMode = String(opts?.workTempoMode || 'tempo').toLowerCase();
            const minOn = Math.max(1, Math.floor(+opts?.minOnSec || 8));
            // Default constraint: require non-zero rest unless caller explicitly sets minOffSec.
            const minOff = Math.max(0, Math.floor(Number.isFinite(+opts?.minOffSec) ? +opts.minOffSec : 5));

            // Fast exact-fill solver for pinned cycles=2.
            // It derives the single rest duration as a remainder (dur - on1 - on2), so we don't need a huge offSet.
            // This is the common user case and keeps the browser responsive.
            if (fixedCycles === 2) {
                let bestPattern = null;
                let bestRepsRaw = -1e18;
                let bestMeta = null;
                let checked = 0;

                const clamp01 = (x) => Math.max(0, Math.min(1, x));
                const allOutSec = Math.max(5, +model?.allOutSec || 45);
                const allOutFatigueGamma = clamp01(Number.isFinite(+model?.allOutFatigueGamma) ? (+model.allOutFatigueGamma) : 0.5);
                const capOnAtStartSec = (eff10, tempoRpm) => {
                    const paceFrac = clamp01((+eff10 || 0) / 10);
                    const tempoFracNominal = (typeof tempoRpm === 'number')
                        ? (tempoRpm / Math.max(1e-6, cadenceMaxRpmBase))
                        : paceFrac;
                    const capBase = allOutSec / Math.pow(Math.max(1e-6, tempoFracNominal), tempoSustainPow);
                    const cap = Math.max(5, Math.round(capBase * (1 - allOutFatigueGamma * 0)));
                    return cap;
                };

                const onSet2 = onSet.map(v => Math.max(0, Math.floor(+v || 0)));
                const effSet2 = effSet.map(v => Math.max(0, Math.min(10, +v || 0)));
                const tempoSet2 = workTempoSetRpm.length ? workTempoSetRpm : [undefined];

                for (const on1 of onSet2) {
                    if (on1 < minOn) continue;
                    for (const on2 of onSet2) {
                        if (on2 < minOn) continue;
                        if (on1 + on2 > totalSec) continue;
                        const off1 = totalSec - on1 - on2;
                        if (off1 < minOff) continue;

                        for (const eff0 of effSet2) {
                            for (const tempo1 of tempoSet2) {
                                for (const tempo2 of tempoSet2) {
                                    // Apply the same sustain cap as DP transitions.
                                    if (on1 > capOnAtStartSec(eff0, tempo1)) continue;
                                    if (on2 > capOnAtStartSec(eff0, tempo2)) continue;

                                    const baseSegs = [
                                        { on: on1, off: off1, eff: eff0, restEff: restEff10, workTempoRpm: tempo1 },
                                        { on: on2, off: 0, eff: eff0, restEff: restEff10, workTempoRpm: tempo2 }
                                    ];

                                    let pattern = baseSegs;
                                    let sprintUsed = 0;
                                    if (finishSprintSec > 0 && on2 >= 2) {
                                        const sprint = Math.max(0, Math.min(on2 - 1, finishSprintSec));
                                        if (sprint > 0) {
                                            sprintUsed = sprint;
                                            const steady = Math.max(1, on2 - sprint);

                                            if (steady > capOnAtStartSec(eff0, tempo2)) continue;
                                            if (sprint > capOnAtStartSec(10, cadenceMaxRpmBase)) continue;

                                            pattern = [
                                                baseSegs[0],
                                                { on: steady, off: 0, eff: eff0, restEff: restEff10, workTempoRpm: tempo2 },
                                                { on: sprint, off: 0, eff: 10, restEff: restEff10, workTempoRpm: cadenceMaxRpmBase }
                                            ];
                                        }
                                    }

                                    checked++;
                                    const sim = simulateZarubaReps(pattern, totalSec, { ...model, defaultRestEff10: restEff10 });
                                    if (sim.repsRaw > bestRepsRaw) {
                                        bestRepsRaw = sim.repsRaw;
                                        bestPattern = pattern;
                                        bestMeta = { filledSec: totalSec, repsRaw: sim.repsRaw, fatigueEnd: sim.fatigueEnd, fixedCycles: 2, checked, finishSprintUsedSec: sprintUsed, approx: false, fastPinned: true };
                                    }
                                }
                            }
                        }
                    }
                }

                if (!bestPattern) return { pattern: [], reps: 0, meta: { reason: 'no-actions', fixedCycles: 2 } };
                const sim2 = simulateZarubaReps(bestPattern, totalSec, { ...model, defaultRestEff10: restEff10 });
                return { pattern: bestPattern, reps: sim2.reps, meta: bestMeta || { filledSec: totalSec, repsRaw: sim2.repsRaw, fatigueEnd: sim2.fatigueEnd, fixedCycles: 2, fastPinned: true } };
            }

            // Fatigue discretization
            const clamp01 = (x) => Math.max(0, Math.min(1, x));
            const fStep = Math.max(0.01, Math.min(0.10, +opts?.fatigueStep || 0.02));
            const fN = Math.floor(1 / fStep) + 1;
            const fIdx = (f) => {
                const i = Math.round(clamp01(f) / fStep);
                return Math.max(0, Math.min(fN - 1, i));
            };
            const fVal = (i) => Math.max(0, Math.min(1, i * fStep));

            // Precompute transition + reward for each (f,state action)
            // Heuristic: only force "true max" blocks to be end-only when the optimizer varies *eff*.
            // When we explore pacing via tempo choices (tXX) with eff fixed at 10, forbidding max-tempo mid-plan
            // can make results worse just because we added options.
            const useSprintEndOnly = (effSet.length > 1);
            const actions = [];
            for (const on0 of onSet) {
                const on = Math.max(0, Math.floor(+on0 || 0));
                if (on < minOn) continue;
                for (const off0 of offSet) {
                    const off = Math.max(0, Math.floor(+off0 || 0));
                    if (off < minOff) continue;
                    if (on === 0 && off === 0) continue;
                    for (const eff0 of effSet) {
                        const eff = Math.max(0, Math.min(10, +eff0 || 0));
                        for (const workTempoRpm0 of workTempoSetRpm) {
                            const tempoChoice = (typeof workTempoRpm0 === 'number') ? workTempoRpm0 : undefined;
                            const workTempoRpm = tempoChoice;
                            const workTempoSoftRpm = undefined;

                            // If OFF=0, this action can only make sense as:
                            // 1) a full-duration continuous plan, OR
                            // 2) the final work-only segment.
                            // Otherwise it creates a confusing "no rest between blocks" plan (e.g. 60/0 then immediately 8/5).
                            const off0EndOnly = (!allowContinuousWorkSegments) && (off === 0 && on !== totalSec);

                            // Sprint realism: treat true max (eff=10 at max tempo) as a finishing sprint only.
                            // Otherwise DP tends to sprinkle max blocks throughout, which is not how you race.
                            const tempoCapForMax = (typeof workTempoRpm === 'number') ? workTempoRpm : cadenceMaxRpmBase;
                            const atMaxTempo = (Math.abs(tempoCapForMax - cadenceMaxRpmBase) < 0.5);
                            const isTrueMax = (eff >= 9.999) && atMaxTempo;
                            const sprintEndOnly = (useSprintEndOnly && isTrueMax && on !== totalSec);

                            const endOnly = off0EndOnly || sprintEndOnly;
                            actions.push({ on, off, eff, restEff: restEff10, workTempoRpm, workTempoSoftRpm, endOnly, isTrueMax });
                        }
                    }
                }
            }
            if (!actions.length) {
                return { pattern: [], reps: 0, meta: { reason: 'no-actions' } };
            }

            // Cache for transitions.
            // transWith[fi][ai]  => { dt, reps, f2I }  (includes transition cost inside ON)
            // transNo[fi][ai]    => { dt, reps, f2I }  (no transition cost; used for the first segment)
            const transWith = new Array(fN);
            const transNo = new Array(fN);
            for (let fi = 0; fi < fN; fi++) {
                const f0 = fVal(fi);
                const rowW = new Array(actions.length);
                const rowN = new Array(actions.length);
                for (let ai = 0; ai < actions.length; ai++) {
                    const a = actions[ai];
                    const cadenceMaxRpmLocal = (typeof a.workTempoRpm === 'number')
                        ? a.workTempoRpm
                        : cadenceMaxRpmBase;
                    const cadenceBase = Math.max(1, cadenceMaxRpmBase);
                    const tempoFrac = cadenceMaxRpmLocal / cadenceBase;
                    const allOutSec = Math.max(5, +model?.allOutSec || 45);
                    // Additional realism: when already fatigued, you can't hold true max pace for as long as when fresh.
                    // This is used as a hard cap only for the *true max* action (eff≈10 and tempo≈max).
                    const allOutFatigueGamma = clamp01(Number.isFinite(+model?.allOutFatigueGamma) ? (+model.allOutFatigueGamma) : 0.5);
                    const recTauSec = Math.max(5, +model?.recTauSec || 30);
                    const minCadenceFrac = clamp01(Number.isFinite(+model?.minCadenceFrac) ? (+model.minCadenceFrac) : 0.35);
                    const alpha = Math.max(0.5, +model?.alpha || 1.25);
                    const beta = Math.max(0.5, +model?.beta || 1.0);
                    const fCrit = clamp01(Number.isFinite(+model?.fCrit) ? (+model.fCrit) : 0.85);
                    const switchCostSec = Math.max(0, Math.floor(+model?.switchCostSec || 0));
                    const tempoFatiguePow = Math.max(0.5, Math.min(3.0, +model?.tempoFatiguePow || 1.0));

                    const paceFrac = clamp01(a.eff / 10);
                    const r01 = clamp01(a.restEff / 10);
                    const tau = recTauSec * (1 + 1.5 * r01);
                    const kRec = 1 / Math.max(1, tau);

                    const simOnce = (includeSwitch, asEnd = false) => {
                        let f = f0;
                        let reps = 0;
                        const doRest = (n) => { for (let k0 = 0; k0 < n; k0++) f = clamp01(f + (-f) * kRec); };
                        const doWork = (n) => {
                            for (let k0 = 0; k0 < n; k0++) {
                                const over = (f <= fCrit) ? 0 : Math.max(0, Math.min(1, (f - fCrit) / Math.max(1e-6, (1 - fCrit))));
                                const perf = (f <= fCrit) ? 1.0 : (minCadenceFrac + (1 - minCadenceFrac) * (1 - over));
                                const hasTempoOverride = (typeof a.workTempoRpm === 'number');
                                const baseRpmNominal = hasTempoOverride ? cadenceMaxRpmLocal : (cadenceMaxRpmBase * paceFrac);
                                const effRpm = baseRpmNominal * Math.max(0, perf);
                                reps += effRpm / 60;

                                const tempoFracEff = Math.max(0, effRpm / cadenceBase);
                                const tempoScale = Math.pow(tempoFracEff, tempoFatiguePow);
                                const baseDf = (fCrit / allOutSec) * tempoScale;
                                const accel = (f <= fCrit) ? 1.0 : (1.0 + 6.0 * over);
                                f = clamp01(f + baseDf * accel);
                            }
                        };

                        // Transition cost is taken from the beginning of ON (no reps).
                        let onLeft = a.on;
                        if (includeSwitch && switchCostSec > 0 && onLeft > 0) {
                            const sc = Math.min(switchCostSec, onLeft);
                            const sw = Number.isFinite(+model?.switchRecoveryFrac) ? clamp01(+model.switchRecoveryFrac) : 0;
                            if (sw > 1e-9) {
                                for (let k0 = 0; k0 < sc; k0++) f = clamp01(f + (-f) * kRec * sw);
                            }
                            onLeft -= sc;
                        }

                        // Hard cap: only for the true max action.
                        // If this violates the cap, we disallow the whole action so DP cannot pick implausibly long
                        // near-max-tempo blocks when allOutSec is small.
                        const baseRpmNominalForCap = (typeof a.workTempoRpm === 'number')
                            ? cadenceMaxRpmLocal
                            : (cadenceMaxRpmBase * paceFrac);
                        const tempoFracNominalForCap = baseRpmNominalForCap / Math.max(1e-6, cadenceBase);
                        const capBase = allOutSec / Math.pow(Math.max(1e-6, tempoFracNominalForCap), tempoSustainPow);
                        const cap = Math.max(5, Math.round(capBase * (1 - allOutFatigueGamma * clamp01(f))));
                        if (onLeft > cap) {
                            const dt = asEnd ? a.on : (a.on + a.off);
                            return { dt, reps: -1e15, f2I: fIdx(f0) };
                        }
                        doWork(onLeft);
                        if (!asEnd) doRest(a.off);
                        const dt = asEnd ? a.on : (a.on + a.off);
                        return { dt, reps, f2I: fIdx(f) };
                    };

                    rowW[ai] = simOnce(true, false);
                    rowN[ai] = simOnce(false, false);
                }
                transWith[fi] = rowW;
                transNo[fi] = rowN;
            }

            // End-action transitions (skip OFF for the last segment so the attempt ends with WORK).
            const transWithEnd = new Array(fN);
            const transNoEnd = new Array(fN);
            for (let fi = 0; fi < fN; fi++) {
                const rowW = new Array(actions.length);
                const rowN = new Array(actions.length);
                for (let ai = 0; ai < actions.length; ai++) {
                    // Reuse the already-captured closure variables by re-running the same logic in-place.
                    // (We keep it explicit to avoid subtle coupling with normal transitions.)
                    const a = actions[ai];
                    const cadenceMaxRpmLocal = (typeof a.workTempoRpm === 'number')
                        ? a.workTempoRpm
                        : ((typeof a.workTempoSoftRpm === 'number') ? a.workTempoSoftRpm : cadenceMaxRpmBase);
                    const cadenceBase = Math.max(1, cadenceMaxRpmBase);
                    const tempoFrac = cadenceMaxRpmLocal / cadenceBase;
                    const allOutSec = Math.max(5, +model?.allOutSec || 45);
                    const allOutFatigueGamma = clamp01(Number.isFinite(+model?.allOutFatigueGamma) ? (+model.allOutFatigueGamma) : 0.5);
                    const recTauSec = Math.max(5, +model?.recTauSec || 30);
                    const minCadenceFrac = clamp01(Number.isFinite(+model?.minCadenceFrac) ? (+model.minCadenceFrac) : 0.35);
                    const alpha = Math.max(0.5, +model?.alpha || 1.25);
                    const beta = Math.max(0.5, +model?.beta || 1.0);
                    const fCrit = clamp01(Number.isFinite(+model?.fCrit) ? (+model.fCrit) : 0.85);
                    const switchCostSec = Math.max(0, Math.floor(+model?.switchCostSec || 0));
                    const tempoFatiguePow = Math.max(0.5, Math.min(3.0, +model?.tempoFatiguePow || 1.0));
                    const f0 = fVal(fi);
                    const paceFrac = clamp01(a.eff / 10);
                    const r01 = clamp01(a.restEff / 10);
                    const tau = recTauSec * (1 + 1.5 * r01);
                    const kRec = 1 / Math.max(1, tau);

                    const simOnceEnd = (includeSwitch) => {
                        let f = f0;
                        let reps = 0;
                        const doRest = (n) => { for (let k0 = 0; k0 < n; k0++) f = clamp01(f + (-f) * kRec); };
                        const doWork = (n) => {
                            for (let k0 = 0; k0 < n; k0++) {
                                const over = (f <= fCrit) ? 0 : Math.max(0, Math.min(1, (f - fCrit) / Math.max(1e-6, (1 - fCrit))));
                                const perf = (f <= fCrit) ? 1.0 : (minCadenceFrac + (1 - minCadenceFrac) * (1 - over));
                                const hasTempoOverride = (typeof a.workTempoRpm === 'number');
                                const baseRpmNominal = hasTempoOverride ? cadenceMaxRpmLocal : (cadenceMaxRpmBase * paceFrac);
                                const effRpm = baseRpmNominal * Math.max(0, perf);
                                reps += effRpm / 60;

                                const tempoFracEff = Math.max(0, effRpm / cadenceBase);
                                const tempoScale = Math.pow(tempoFracEff, tempoFatiguePow);
                                const baseDf = (fCrit / allOutSec) * tempoScale;
                                const accel = (f <= fCrit) ? 1.0 : (1.0 + 6.0 * over);
                                f = clamp01(f + baseDf * accel);
                            }
                        };

                        let onLeft = a.on;
                        if (includeSwitch && switchCostSec > 0 && onLeft > 0) {
                            const sc = Math.min(switchCostSec, onLeft);
                            const sw = Number.isFinite(+model?.switchRecoveryFrac) ? clamp01(+model.switchRecoveryFrac) : 0;
                            if (sw > 1e-9) {
                                for (let k0 = 0; k0 < sc; k0++) f = clamp01(f + (-f) * kRec * sw);
                            }
                            onLeft -= sc;
                        }

                        const hasTempoOverride = (typeof a.workTempoRpm === 'number');
                        const baseRpmNominalForCap = hasTempoOverride
                            ? cadenceMaxRpmLocal
                            : (cadenceMaxRpmBase * paceFrac);
                        const tempoFracNominalForCap = baseRpmNominalForCap / Math.max(1e-6, cadenceBase);
                        const capBase = allOutSec / Math.pow(Math.max(1e-6, tempoFracNominalForCap), tempoSustainPow);
                        const cap = Math.max(5, Math.round(capBase * (1 - allOutFatigueGamma * clamp01(f))));
                        if (onLeft > cap) {
                            return { dt: a.on, reps: -1e15, f2I: fIdx(f0) };
                        }
                        doWork(onLeft);
                        const dt = a.on;
                        return { dt, reps, f2I: fIdx(f) };
                    };

                    rowW[ai] = simOnceEnd(true);
                    rowN[ai] = simOnceEnd(false);
                }
                transWithEnd[fi] = rowW;
                transNoEnd[fi] = rowN;
            }

            // DP over time (seconds) and fatigue state.
            // Optional constraint: pin the number of WORK segments (cycles).
            const NEG = -1e15;

            if (fixedCycles !== null) {
                const K = fixedCycles;
                const W = K + 1;
                const idxK = (fi, k) => (fi * W + k);

                const clamp01 = (x) => Math.max(0, Math.min(1, x));
                const maxEndFatigue = (() => {
                    // If the user pins cycles to 1, they usually want a *steady* sustainable pace.
                    // Default to fCrit ("threshold") so the chosen tempo is something you can hold.
                    const raw = +opts?.maxEndFatigue;
                    if (Number.isFinite(raw)) return clamp01(raw);
                    if (K === 1) return clamp01(Number.isFinite(+model?.fCrit) ? (+model.fCrit) : 0.85);
                    return null;
                })();
                const dp = Array.from({ length: totalSec + 1 }, () => new Float64Array(fN * W).fill(NEG));
                const prevT = Array.from({ length: totalSec + 1 }, () => new Int32Array(fN * W).fill(-1));
                const prevF = Array.from({ length: totalSec + 1 }, () => new Int16Array(fN * W).fill(-1));
                const prevA = Array.from({ length: totalSec + 1 }, () => new Int16Array(fN * W).fill(-1));
                const prevK = Array.from({ length: totalSec + 1 }, () => new Int16Array(fN * W).fill(-1));
                const prevIsEnd = Array.from({ length: totalSec + 1 }, () => new Int8Array(fN * W).fill(0));

                const f0I = fIdx(+model?.fatigue0 || 0);
                dp[0][idxK(f0I, 0)] = 0;

                for (let t = 0; t <= totalSec; t++) {
                    const row = dp[t];
                    for (let fi = 0; fi < fN; fi++) {
                        for (let k = 0; k < K; k++) {
                            const base = row[idxK(fi, k)];
                            if (!(base > NEG / 2)) continue;

                            // Normal transitions (includes OFF)
                            for (let ai = 0; ai < actions.length; ai++) {
                                if (actions[ai].endOnly) continue;
                                const tr = (t === 0) ? transNo[fi][ai] : transWith[fi][ai];
                                const t2 = t + tr.dt;
                                if (t2 > totalSec) continue;
                                const k2 = k + 1;
                                const val = base + tr.reps;
                                const j = idxK(tr.f2I, k2);
                                if (val > dp[t2][j]) {
                                    dp[t2][j] = val;
                                    prevT[t2][j] = t;
                                    prevF[t2][j] = fi;
                                    prevA[t2][j] = ai;
                                    prevK[t2][j] = k;
                                    prevIsEnd[t2][j] = 0;
                                }
                            }

                            // Work-only final segment: skip OFF if (and only if) it lands exactly at the end.
                            if (k + 1 === K) {
                                for (let ai = 0; ai < actions.length; ai++) {
                                    const tr = (t === 0) ? transNoEnd[fi][ai] : transWithEnd[fi][ai];
                                    const t2 = t + tr.dt;
                                    if (t2 !== totalSec) continue;
                                    const k2 = k + 1;
                                    const val = base + tr.reps;
                                    const j = idxK(tr.f2I, k2);
                                    if (val > dp[t2][j]) {
                                        dp[t2][j] = val;
                                        prevT[t2][j] = t;
                                        prevF[t2][j] = fi;
                                        prevA[t2][j] = ai;
                                        prevK[t2][j] = k;
                                        prevIsEnd[t2][j] = 1;
                                    }
                                }
                            }
                        }
                    }
                }

                const pickBestAt = (tPick) => {
                    let bestFi = -1;
                    let bestVal = NEG;
                    for (let fi = 0; fi < fN; fi++) {
                        if (maxEndFatigue !== null && fVal(fi) > maxEndFatigue + 1e-9) continue;
                        const v = dp[tPick][idxK(fi, K)];
                        if (v > bestVal) { bestVal = v; bestFi = fi; }
                    }
                    // If the constraint is impossible, relax it.
                    if (bestFi < 0) {
                        for (let fi = 0; fi < fN; fi++) {
                            const v = dp[tPick][idxK(fi, K)];
                            if (v > bestVal) { bestVal = v; bestFi = fi; }
                        }
                    }
                    return { bestFi, bestVal };
                };

                // Take the best end state at exactly totalSec with k=K.
                let bestT = totalSec;
                let { bestFi, bestVal } = pickBestAt(totalSec);

                // If exact fill failed, allow best at <= totalSec with k=K.
                if (!(bestVal > NEG / 2)) {
                    bestT = -1;
                    bestFi = -1;
                    bestVal = NEG;
                    for (let t = totalSec; t >= 0; t--) {
                        const picked = pickBestAt(t);
                        if (picked.bestVal > bestVal) {
                            bestVal = picked.bestVal;
                            bestFi = picked.bestFi;
                            bestT = t;
                        }
                    }
                    if (bestT < 0 || bestFi < 0 || !(bestVal > NEG / 2)) {
                        return { pattern: [], reps: 0, meta: { reason: 'no-solution-for-fixed-cycles', fixedCycles: K } };
                    }
                }

                // Backtrack from bestT, bestFi, k=K
                let tCur = bestT;
                let fCur = bestFi;
                let kCur = K;
                const rev = [];
                while (tCur > 0 && kCur > 0) {
                    const j = idxK(fCur, kCur);
                    const tPrev = prevT[tCur][j];
                    const fPrev = prevF[tCur][j];
                    const aIdx = prevA[tCur][j];
                    const kPrev = prevK[tCur][j];
                    if (tPrev < 0 || fPrev < 0 || aIdx < 0 || kPrev < 0) break;
                    if (prevIsEnd[tCur][j]) {
                        const a = actions[aIdx];
                        rev.push({ on: a.on, off: 0, eff: a.eff, restEff: a.restEff, workTempoRpm: a.workTempoRpm, workTempoSoftRpm: a.workTempoSoftRpm });
                    } else {
                        rev.push(actions[aIdx]);
                    }
                    tCur = tPrev;
                    fCur = fPrev;
                    kCur = kPrev;
                    if (rev.length > 2000) break;
                }
                const pattern = rev.reverse();

                // NOTE: We intentionally do not postprocess pinned-cycles results here.
                // Earlier versions converted trailing OFF into continuous WORK by injecting tempo overrides.
                // With the current semantics, explicit tempo overrides are user-forced cadence, so injecting
                // them from the optimizer makes solutions degenerate. Callers can handle tail time explicitly.

                const sim = simulateZarubaReps(pattern, bestT, { ...model, defaultRestEff10: restEff10 });
                return {
                    pattern,
                    reps: sim.reps,
                    meta: {
                        filledSec: bestT,
                        repsRaw: sim.repsRaw,
                        fatigueEnd: sim.fatigueEnd,
                        fStep,
                        actions: actions.length,
                        approx: (bestT !== totalSec),
                        fixedCycles: K,
                        maxEndFatigue: (maxEndFatigue !== null ? maxEndFatigue : undefined)
                    }
                };
            }

            // Unconstrained DP (legacy behavior)
            // dp[t][f] = max reps, with parent pointers for reconstruction.
            const dp = Array.from({ length: totalSec + 1 }, () => new Float64Array(fN).fill(NEG));
            const prev = Array.from({ length: totalSec + 1 }, () => new Int32Array(fN).fill(-1));
            const prevF = Array.from({ length: totalSec + 1 }, () => new Int16Array(fN).fill(-1));
            const prevA = Array.from({ length: totalSec + 1 }, () => new Int16Array(fN).fill(-1));
            const prevIsEnd = Array.from({ length: totalSec + 1 }, () => new Int8Array(fN).fill(0));
            dp[0][fIdx(+model?.fatigue0 || 0)] = 0;

            for (let t = 0; t <= totalSec; t++) {
                const row = dp[t];
                for (let fi = 0; fi < fN; fi++) {
                    const base = row[fi];
                    if (!(base > NEG / 2)) continue;
                    for (let ai = 0; ai < actions.length; ai++) {
                        if (actions[ai].endOnly) continue;
                        const tr = (t === 0) ? transNo[fi][ai] : transWith[fi][ai];
                        const t2 = t + tr.dt;
                        if (t2 > totalSec) continue;
                        const val = base + tr.reps;
                        if (val > dp[t2][tr.f2I]) {
                            dp[t2][tr.f2I] = val;
                            prev[t2][tr.f2I] = t;
                            prevF[t2][tr.f2I] = fi;
                            prevA[t2][tr.f2I] = ai;
                            prevIsEnd[t2][tr.f2I] = 0;
                        }
                    }

                    // Allow a work-only final segment: skip OFF if (and only if) it lands exactly at the end.
                    for (let ai = 0; ai < actions.length; ai++) {
                        const tr = (t === 0) ? transNoEnd[fi][ai] : transWithEnd[fi][ai];
                        const t2 = t + tr.dt;
                        if (t2 !== totalSec) continue;
                        const val = base + tr.reps;
                        if (val > dp[t2][tr.f2I]) {
                            dp[t2][tr.f2I] = val;
                            prev[t2][tr.f2I] = t;
                            prevF[t2][tr.f2I] = fi;
                            prevA[t2][tr.f2I] = ai;
                            prevIsEnd[t2][tr.f2I] = 1;
                        }
                    }
                }
            }

            // Take the best end state at exactly totalSec.
            let bestFi = 0;
            let bestVal = NEG;
            for (let fi = 0; fi < fN; fi++) {
                const v = dp[totalSec][fi];
                if (v > bestVal) { bestVal = v; bestFi = fi; }
            }

            // If exact fill failed (due to coarse action durations), allow best at <=totalSec.
            if (!(bestVal > NEG / 2)) {
                let bestT = 0;
                for (let t = totalSec; t >= 0; t--) {
                    for (let fi = 0; fi < fN; fi++) {
                        const v = dp[t][fi];
                        if (v > bestVal) { bestVal = v; bestFi = fi; bestT = t; }
                    }
                }
                // Backtrack from bestT
                let tCur = bestT;
                let fCur = bestFi;
                const rev = [];
                while (tCur > 0) {
                    const tPrev = prev[tCur][fCur];
                    const fPrev = prevF[tCur][fCur];
                    const aIdx = prevA[tCur][fCur];
                    if (tPrev < 0 || fPrev < 0 || aIdx < 0) break;
                    rev.push(actions[aIdx]);
                    tCur = tPrev;
                    fCur = fPrev;
                    if (rev.length > 2000) break;
                }
                const pattern = rev.reverse();
                const sim = simulateZarubaReps(pattern, bestT, { ...model, defaultRestEff10: restEff10 });
                return { pattern, reps: sim.reps, meta: { filledSec: bestT, repsRaw: sim.repsRaw, fatigueEnd: sim.fatigueEnd, approx: true } };
            }

            // Backtrack from exact totalSec
            let tCur = totalSec;
            let fCur = bestFi;
            const rev = [];
            while (tCur > 0) {
                const tPrev = prev[tCur][fCur];
                const fPrev = prevF[tCur][fCur];
                const aIdx = prevA[tCur][fCur];
                if (tPrev < 0 || fPrev < 0 || aIdx < 0) break;
                if (prevIsEnd[tCur][fCur]) {
                    const a = actions[aIdx];
                    rev.push({ on: a.on, off: 0, eff: a.eff, restEff: a.restEff, workTempoRpm: a.workTempoRpm, workTempoSoftRpm: a.workTempoSoftRpm });
                } else {
                    rev.push(actions[aIdx]);
                }
                tCur = tPrev;
                fCur = fPrev;
                if (rev.length > 2000) break;
            }
            const pattern = rev.reverse();

            // The DP reward is in "repsRaw" units; round at the end.
            const sim = simulateZarubaReps(pattern, totalSec, { ...model, defaultRestEff10: restEff10 });
            return {
                pattern,
                reps: sim.reps,
                meta: {
                    filledSec: totalSec,
                    repsRaw: sim.repsRaw,
                    fatigueEnd: sim.fatigueEnd,
                    fStep,
                    actions: actions.length,
                    approx: false
                }
            };
        } catch (e) {
            return { pattern: [], reps: 0, meta: { error: String(e?.message || e) } };
        }
    }

    function optimizeZarubaPatternForTarget(opts) {
        // Returns a pattern that can reach targetReps with the lowest possible end-fatigue.
        // { pattern, reps, meta: { filledSec, fatigueEnd, maxReps, impossible?, reason? } }
        try {
            const totalSec = Math.max(30, Math.floor(+opts?.durSec || 300));
            const targetReps = Math.max(1, Math.floor(+opts?.targetReps || 0));
            const model = opts?.model || {};
            const restEff10 = Number.isFinite(+opts?.restEff10) ? +opts.restEff10 : (Number.isFinite(+model?.defaultRestEff10) ? +model.defaultRestEff10 : 0);

            const fixedCycles = (() => {
                const v = +opts?.fixedCycles;
                if (!Number.isFinite(v)) return null;
                const k = Math.floor(v);
                if (!(k >= 1 && k <= 200)) return null;
                return k;
            })();
            const allowContinuousWorkSegments = !!opts?.allowContinuousWorkSegments || (fixedCycles !== null && fixedCycles >= 2);

            const cadenceMaxRpmBase = Math.max(1, +model?.cadenceMaxRpm || 20);
            const tempoSustainPow = (() => {
                const v = +opts?.tempoSustainPow;
                if (!Number.isFinite(v)) return 3.0;
                return Math.max(1.0, Math.min(8.0, v));
            })();
            const clampTempoRpm = (v) => {
                const n = +v;
                if (!Number.isFinite(n)) return undefined;
                const k = Math.round(n);
                if (!(k > 0)) return undefined;
                return Math.max(5, Math.min(240, k));
            };

            const workTempoSetRpmRaw = (Array.isArray(opts?.workTempoSetRpm) && opts.workTempoSetRpm.length)
                ? opts.workTempoSetRpm
                : [undefined];
            const workTempoSetRpm = Array.from(new Set(workTempoSetRpmRaw
                .map(v => clampTempoRpm(v))
                .map(v => (typeof v === 'number' ? Math.min(v, cadenceMaxRpmBase) : undefined))
            ));

            // Scheme language has only lowercase tempo overrides (t/т) and no "soft caps".
            // Any mode flags are treated as legacy and ignored.
            const workTempoMode = String(opts?.workTempoMode || 'tempo').toLowerCase();

            const onSet = (Array.isArray(opts?.onSet) && opts.onSet.length) ? opts.onSet : [8, 10, 12, 15, 20, 25, 30, 35, 40, 45, 60, 75, 90];
            const offSet = (Array.isArray(opts?.offSet) && opts.offSet.length) ? opts.offSet : [5, 8, 10, 12, 15, 20, 25, 30, 40, 60];
            const effSet = (Array.isArray(opts?.effSet) && opts.effSet.length) ? opts.effSet : [6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10];
            const minOn = Math.max(1, Math.floor(+opts?.minOnSec || 8));
            const minOff = Math.max(0, Math.floor(Number.isFinite(+opts?.minOffSec) ? +opts.minOffSec : 5));

            // Fast exact-fill solver for pinned cycles=2.
            // For target optimization we choose the lowest end-fatigue among patterns that reach the target.
            if (fixedCycles === 2) {
                const finishSprintSec = Math.max(0, Math.floor(+opts?.finishSprintSec || 0));
                const onSet2 = onSet.map(v => Math.max(0, Math.floor(+v || 0)));
                const effSet2 = effSet.map(v => Math.max(0, Math.min(10, +v || 0)));
                const tempoSet2 = workTempoSetRpm.length ? workTempoSetRpm : [undefined];

                const clamp01T = (x) => Math.max(0, Math.min(1, x));

                const allOutSec = Math.max(5, +model?.allOutSec || 45);
                const allOutFatigueGamma = clamp01T(Number.isFinite(+model?.allOutFatigueGamma) ? (+model.allOutFatigueGamma) : 0.5);
                const capOnAtStartSec = (eff10, tempoRpm) => {
                    const paceFrac = clamp01T((+eff10 || 0) / 10);
                    const tempoFracNominal = (typeof tempoRpm === 'number')
                        ? (tempoRpm / Math.max(1e-6, cadenceMaxRpmBase))
                        : paceFrac;
                    const capBase = allOutSec / Math.pow(Math.max(1e-6, tempoFracNominal), tempoSustainPow);
                    const cap = Math.max(5, Math.round(capBase * (1 - allOutFatigueGamma * 0)));
                    return cap;
                };

                let bestPattern = null;
                let bestFatigueEnd = 1e18;
                let bestSim = null;
                let maxReps = -1;
                let checked = 0;

                for (const on1 of onSet2) {
                    if (on1 < minOn) continue;
                    for (const on2 of onSet2) {
                        if (on2 < minOn) continue;
                        if (on1 + on2 > totalSec) continue;
                        const off1 = totalSec - on1 - on2;
                        if (off1 < minOff) continue;
                        for (const eff0 of effSet2) {
                            for (const tempo1 of tempoSet2) {
                                for (const tempo2 of tempoSet2) {
                                    if (on1 > capOnAtStartSec(eff0, tempo1)) continue;
                                    if (on2 > capOnAtStartSec(eff0, tempo2)) continue;

                                    const baseSegs = [
                                        { on: on1, off: off1, eff: eff0, restEff: restEff10, workTempoRpm: tempo1 },
                                        { on: on2, off: 0, eff: eff0, restEff: restEff10, workTempoRpm: tempo2 }
                                    ];

                                    let pattern = baseSegs;
                                    if (finishSprintSec > 0 && on2 >= 2) {
                                        const sprint = Math.max(0, Math.min(on2 - 1, finishSprintSec));
                                        if (sprint > 0) {
                                            const steady = Math.max(1, on2 - sprint);

                                            if (steady > capOnAtStartSec(eff0, tempo2)) continue;
                                            if (sprint > capOnAtStartSec(10, cadenceMaxRpmBase)) continue;

                                            pattern = [
                                                baseSegs[0],
                                                { on: steady, off: 0, eff: eff0, restEff: restEff10, workTempoRpm: tempo2 },
                                                { on: sprint, off: 0, eff: 10, restEff: restEff10, workTempoRpm: cadenceMaxRpmBase }
                                            ];
                                        }
                                    }

                                    checked++;
                                    const sim = simulateZarubaReps(pattern, totalSec, { ...model, defaultRestEff10: restEff10 });
                                    if (sim.reps > maxReps) maxReps = sim.reps;
                                    if (sim.reps < targetReps) continue;
                                    if (sim.fatigueEnd < bestFatigueEnd) {
                                        bestFatigueEnd = sim.fatigueEnd;
                                        bestPattern = pattern;
                                        bestSim = sim;
                                    }
                                }
                            }
                        }
                    }
                }

                if (!bestPattern) {
                    return { pattern: [], reps: 0, meta: { impossible: true, maxReps: Math.max(0, maxReps), targetReps, filledSec: totalSec, fixedCycles: 2, checked, fastPinned: true } };
                }
                return { pattern: bestPattern, reps: bestSim?.reps ?? 0, meta: { filledSec: totalSec, fatigueEnd: bestSim?.fatigueEnd ?? 0, targetReps, maxReps: Math.max(0, maxReps), approx: false, fixedCycles: 2, checked, fastPinned: true } };
            }

            const clamp01 = (x) => Math.max(0, Math.min(1, x));
            const fStep = Math.max(0.01, Math.min(0.10, +opts?.fatigueStep || 0.02));
            const fN = Math.floor(1 / fStep) + 1;
            const fIdx = (f) => {
                const i = Math.round(clamp01(f) / fStep);
                return Math.max(0, Math.min(fN - 1, i));
            };
            const fVal = (i) => Math.max(0, Math.min(1, i * fStep));

            // Build actions
            // Heuristic: only force "true max" blocks to be end-only when the optimizer varies *eff*.
            // When we explore pacing via tempo choices (tXX) with eff fixed at 10, forbidding max-tempo mid-plan
            // can make results worse just because we added options.
            const useSprintEndOnly = (effSet.length > 1);
            const actions = [];
            for (const on0 of onSet) {
                const on = Math.max(0, Math.floor(+on0 || 0));
                if (on < minOn) continue;
                for (const off0 of offSet) {
                    const off = Math.max(0, Math.floor(+off0 || 0));
                    if (off < minOff) continue;
                    if (on === 0 && off === 0) continue;
                    for (const eff0 of effSet) {
                        const eff = Math.max(0, Math.min(10, +eff0 || 0));
                        for (const workTempoRpm0 of workTempoSetRpm) {
                            const tempoChoice = (typeof workTempoRpm0 === 'number') ? workTempoRpm0 : undefined;
                            const workTempoRpm = tempoChoice;
                            const workTempoSoftRpm = undefined;
                            const off0EndOnly = (!allowContinuousWorkSegments) && (off === 0 && on !== totalSec);
                            const tempoCapForMax = (typeof workTempoRpm === 'number') ? workTempoRpm : cadenceMaxRpmBase;
                            const atMaxTempo = (Math.abs(tempoCapForMax - cadenceMaxRpmBase) < 0.5);
                            const isTrueMax = (eff >= 9.999) && atMaxTempo;
                            const sprintEndOnly = (useSprintEndOnly && isTrueMax && on !== totalSec);
                            const endOnly = off0EndOnly || sprintEndOnly;
                            actions.push({ on, off, eff, restEff: restEff10, workTempoRpm, workTempoSoftRpm, endOnly, isTrueMax });
                        }
                    }
                }
            }
            if (!actions.length) {
                return { pattern: [], reps: 0, meta: { reason: 'no-actions' } };
            }

            // Transition cache (same as optimizeZarubaPattern)
            const transWith = new Array(fN);
            const transNo = new Array(fN);
            const transWithEnd = new Array(fN);
            const transNoEnd = new Array(fN);
            for (let fi = 0; fi < fN; fi++) {
                const f0 = fVal(fi);
                const rowW = new Array(actions.length);
                const rowN = new Array(actions.length);
                const rowWE = new Array(actions.length);
                const rowNE = new Array(actions.length);
                for (let ai = 0; ai < actions.length; ai++) {
                    const a = actions[ai];
                    const cadenceMaxRpmLocal = (typeof a.workTempoRpm === 'number')
                        ? a.workTempoRpm
                        : cadenceMaxRpmBase;
                    const cadenceBase = Math.max(1, cadenceMaxRpmBase);
                    const tempoFrac = cadenceMaxRpmLocal / cadenceBase;
                    const allOutSec = Math.max(5, +model?.allOutSec || 45);
                    const allOutFatigueGamma = clamp01(Number.isFinite(+model?.allOutFatigueGamma) ? (+model.allOutFatigueGamma) : 0.5);
                    const recTauSec = Math.max(5, +model?.recTauSec || 30);
                    const minCadenceFrac = clamp01(Number.isFinite(+model?.minCadenceFrac) ? (+model.minCadenceFrac) : 0.35);
                    const alpha = Math.max(0.5, +model?.alpha || 1.25);
                    const beta = Math.max(0.5, +model?.beta || 1.0);
                    const fCrit = clamp01(Number.isFinite(+model?.fCrit) ? (+model.fCrit) : 0.85);
                    const switchCostSec = Math.max(0, Math.floor(+model?.switchCostSec || 0));
                    const tempoFatiguePow = Math.max(0.5, Math.min(3.0, +model?.tempoFatiguePow || 1.0));

                    const paceFrac = clamp01(a.eff / 10);
                    const r01 = clamp01(a.restEff / 10);
                    const tau = recTauSec * (1 + 1.5 * r01);
                    const kRec = 1 / Math.max(1, tau);

                    const simOnce = (includeSwitch, asEnd = false) => {
                        let f = f0;
                        let reps = 0;
                        const doRest = (n) => { for (let k0 = 0; k0 < n; k0++) f = clamp01(f + (-f) * kRec); };
                        const doWork = (n) => {
                            for (let k0 = 0; k0 < n; k0++) {
                                const over = (f <= fCrit) ? 0 : Math.max(0, Math.min(1, (f - fCrit) / Math.max(1e-6, (1 - fCrit))));
                                const perf = (f <= fCrit) ? 1.0 : (minCadenceFrac + (1 - minCadenceFrac) * (1 - over));
                                const hasTempoOverride = (typeof a.workTempoRpm === 'number');
                                const baseRpmNominal = hasTempoOverride ? cadenceMaxRpmLocal : (cadenceMaxRpmBase * paceFrac);
                                const effRpm = baseRpmNominal * Math.max(0, perf);
                                reps += effRpm / 60;

                                const tempoFracEff = Math.max(0, effRpm / cadenceBase);
                                const tempoScale = Math.pow(tempoFracEff, tempoFatiguePow);
                                const baseDf = (fCrit / allOutSec) * tempoScale;
                                const accel = (f <= fCrit) ? 1.0 : (1.0 + 6.0 * over);
                                f = clamp01(f + baseDf * accel);
                            }
                        };

                        // Transition cost is taken from the beginning of ON (no reps).
                        let onLeft = a.on;
                        if (includeSwitch && switchCostSec > 0 && onLeft > 0) {
                            const sc = Math.min(switchCostSec, onLeft);
                            const sw = Number.isFinite(+model?.switchRecoveryFrac) ? clamp01(+model.switchRecoveryFrac) : 0;
                            if (sw > 1e-9) {
                                for (let k0 = 0; k0 < sc; k0++) f = clamp01(f + (-f) * kRec * sw);
                            }
                            onLeft -= sc;
                        }

                        const baseRpmNominalForCap = (typeof a.workTempoRpm === 'number')
                            ? cadenceMaxRpmLocal
                            : (cadenceMaxRpmBase * paceFrac);
                        const tempoFracNominalForCap = baseRpmNominalForCap / Math.max(1e-6, cadenceBase);
                        const capBase = allOutSec / Math.pow(Math.max(1e-6, tempoFracNominalForCap), tempoSustainPow);
                        const cap = Math.max(5, Math.round(capBase * (1 - allOutFatigueGamma * clamp01(f))));
                        if (onLeft > cap) {
                            const dt = asEnd ? a.on : (a.on + a.off);
                            return { dt, reps: -1e15, f2I: fIdx(f0) };
                        }
                        doWork(onLeft);
                        if (!asEnd) doRest(a.off);
                        const dt = asEnd ? a.on : (a.on + a.off);
                        return { dt, reps, f2I: fIdx(f) };
                    };

                    rowW[ai] = simOnce(true, false);
                    rowN[ai] = simOnce(false, false);
                    rowWE[ai] = simOnce(true, true);
                    rowNE[ai] = simOnce(false, true);
                }
                transWith[fi] = rowW;
                transNo[fi] = rowN;
                transWithEnd[fi] = rowWE;
                transNoEnd[fi] = rowNE;
            }

            const NEG = -1e15;
            const reachesTarget = (repsRaw) => {
                // UI and simulateZarubaReps report integer reps via Math.round.
                // Use the same convention here, otherwise boundary cases can be marked as "impossible"
                // even though the displayed (rounded) reps meet the target.
                return (repsRaw >= (targetReps - 0.5));
            };

            const applyPinnedCyclesFinish = (pattern) => {
                // Intentionally left as a no-op.
                // Postprocessing that injects tempo overrides is not compatible with the current
                // meaning of explicit tempo directives (user-forced cadence).
            };

            if (fixedCycles !== null) {
                const K = fixedCycles;
                const W = K + 1;
                const idxK = (fi, k) => (fi * W + k);

                const dp = Array.from({ length: totalSec + 1 }, () => new Float64Array(fN * W).fill(NEG));
                const prevT = Array.from({ length: totalSec + 1 }, () => new Int32Array(fN * W).fill(-1));
                const prevF = Array.from({ length: totalSec + 1 }, () => new Int16Array(fN * W).fill(-1));
                const prevA = Array.from({ length: totalSec + 1 }, () => new Int16Array(fN * W).fill(-1));
                const prevK = Array.from({ length: totalSec + 1 }, () => new Int16Array(fN * W).fill(-1));
                const prevIsEnd = Array.from({ length: totalSec + 1 }, () => new Int8Array(fN * W).fill(0));

                const f0I = fIdx(+model?.fatigue0 || 0);
                dp[0][idxK(f0I, 0)] = 0;

                for (let t = 0; t <= totalSec; t++) {
                    const row = dp[t];
                    for (let fi = 0; fi < fN; fi++) {
                        for (let k = 0; k < K; k++) {
                            const base = row[idxK(fi, k)];
                            if (!(base > NEG / 2)) continue;

                            for (let ai = 0; ai < actions.length; ai++) {
                                if (actions[ai].endOnly) continue;
                                const tr = (t === 0) ? transNo[fi][ai] : transWith[fi][ai];
                                const t2 = t + tr.dt;
                                if (t2 > totalSec) continue;
                                const k2 = k + 1;
                                const val = base + tr.reps;
                                const j = idxK(tr.f2I, k2);
                                if (val > dp[t2][j]) {
                                    dp[t2][j] = val;
                                    prevT[t2][j] = t;
                                    prevF[t2][j] = fi;
                                    prevA[t2][j] = ai;
                                    prevK[t2][j] = k;
                                    prevIsEnd[t2][j] = 0;
                                }
                            }

                            if (k + 1 === K) {
                                for (let ai = 0; ai < actions.length; ai++) {
                                    const tr = (t === 0) ? transNoEnd[fi][ai] : transWithEnd[fi][ai];
                                    const t2 = t + tr.dt;
                                    if (t2 !== totalSec) continue;
                                    const k2 = k + 1;
                                    const val = base + tr.reps;
                                    const j = idxK(tr.f2I, k2);
                                    if (val > dp[t2][j]) {
                                        dp[t2][j] = val;
                                        prevT[t2][j] = t;
                                        prevF[t2][j] = fi;
                                        prevA[t2][j] = ai;
                                        prevK[t2][j] = k;
                                        prevIsEnd[t2][j] = 1;
                                    }
                                }
                            }
                        }
                    }
                }

                let maxVal = NEG;
                for (let fi = 0; fi < fN; fi++) {
                    const v = dp[totalSec][idxK(fi, K)];
                    if (v > maxVal) maxVal = v;
                }

                let bestFi = -1;
                for (let fi = 0; fi < fN; fi++) {
                    const v = dp[totalSec][idxK(fi, K)];
                    if (reachesTarget(v)) { bestFi = fi; break; }
                }

                if (bestFi < 0) {
                    let bestT = -1;
                    let bestFi2 = -1;
                    let maxVal2 = maxVal;
                    for (let t = totalSec; t >= 0; t--) {
                        for (let fi = 0; fi < fN; fi++) {
                            const v = dp[t][idxK(fi, K)];
                            if (v > maxVal2) maxVal2 = v;
                        }
                        for (let fi = 0; fi < fN; fi++) {
                            const v = dp[t][idxK(fi, K)];
                            if (reachesTarget(v)) { bestT = t; bestFi2 = fi; break; }
                        }
                        if (bestFi2 >= 0) break;
                    }
                    if (bestFi2 < 0) {
                        return { pattern: [], reps: 0, meta: { impossible: true, maxReps: Math.round(Math.max(0, maxVal2)), targetReps, filledSec: totalSec, fixedCycles: K } };
                    }

                    let tCur = bestT;
                    let fCur = bestFi2;
                    let kCur = K;
                    const rev = [];
                    while (tCur > 0 && kCur > 0) {
                        const j = idxK(fCur, kCur);
                        const tPrev = prevT[tCur][j];
                        const fPrev = prevF[tCur][j];
                        const aIdx = prevA[tCur][j];
                        const kPrev = prevK[tCur][j];
                        if (tPrev < 0 || fPrev < 0 || aIdx < 0 || kPrev < 0) break;
                        if (prevIsEnd[tCur][j]) {
                            const a = actions[aIdx];
                            rev.push({ on: a.on, off: 0, eff: a.eff, restEff: a.restEff, workTempoRpm: a.workTempoRpm, workTempoSoftRpm: a.workTempoSoftRpm });
                        } else {
                            rev.push(actions[aIdx]);
                        }
                        tCur = tPrev;
                        fCur = fPrev;
                        kCur = kPrev;
                        if (rev.length > 2000) break;
                    }
                    const pattern = rev.reverse();
                    applyPinnedCyclesFinish(pattern);
                    const sim = simulateZarubaReps(pattern, bestT, { ...model, defaultRestEff10: restEff10 });
                    return { pattern, reps: sim.reps, meta: { filledSec: bestT, fatigueEnd: sim.fatigueEnd, targetReps, maxReps: Math.round(Math.max(0, maxVal2)), approx: true, fixedCycles: K } };
                }

                let tCur = totalSec;
                let fCur = bestFi;
                let kCur = K;
                const rev = [];
                while (tCur > 0 && kCur > 0) {
                    const j = idxK(fCur, kCur);
                    const tPrev = prevT[tCur][j];
                    const fPrev = prevF[tCur][j];
                    const aIdx = prevA[tCur][j];
                    const kPrev = prevK[tCur][j];
                    if (tPrev < 0 || fPrev < 0 || aIdx < 0 || kPrev < 0) break;
                    if (prevIsEnd[tCur][j]) {
                        const a = actions[aIdx];
                        rev.push({ on: a.on, off: 0, eff: a.eff, restEff: a.restEff, workTempoRpm: a.workTempoRpm, workTempoSoftRpm: a.workTempoSoftRpm });
                    } else {
                        rev.push(actions[aIdx]);
                    }
                    tCur = tPrev;
                    fCur = fPrev;
                    kCur = kPrev;
                    if (rev.length > 2000) break;
                }
                const pattern = rev.reverse();
                applyPinnedCyclesFinish(pattern);
                const sim = simulateZarubaReps(pattern, totalSec, { ...model, defaultRestEff10: restEff10 });
                return { pattern, reps: sim.reps, meta: { filledSec: totalSec, fatigueEnd: sim.fatigueEnd, targetReps, maxReps: Math.round(Math.max(0, maxVal)), approx: false, fixedCycles: K } };
            }

            const dp = Array.from({ length: totalSec + 1 }, () => new Float64Array(fN).fill(NEG));
            const prev = Array.from({ length: totalSec + 1 }, () => new Int32Array(fN).fill(-1));
            const prevF = Array.from({ length: totalSec + 1 }, () => new Int16Array(fN).fill(-1));
            const prevA = Array.from({ length: totalSec + 1 }, () => new Int16Array(fN).fill(-1));
            const prevIsEnd = Array.from({ length: totalSec + 1 }, () => new Int8Array(fN).fill(0));
            dp[0][fIdx(+model?.fatigue0 || 0)] = 0;

            for (let t = 0; t <= totalSec; t++) {
                const row = dp[t];
                for (let fi = 0; fi < fN; fi++) {
                    const base = row[fi];
                    if (!(base > NEG / 2)) continue;
                    for (let ai = 0; ai < actions.length; ai++) {
                        if (actions[ai].endOnly) continue;
                        const tr = (t === 0) ? transNo[fi][ai] : transWith[fi][ai];
                        const t2 = t + tr.dt;
                        if (t2 > totalSec) continue;
                        const val = base + tr.reps;
                        if (val > dp[t2][tr.f2I]) {
                            dp[t2][tr.f2I] = val;
                            prev[t2][tr.f2I] = t;
                            prevF[t2][tr.f2I] = fi;
                            prevA[t2][tr.f2I] = ai;
                            prevIsEnd[t2][tr.f2I] = 0;
                        }
                    }

                    for (let ai = 0; ai < actions.length; ai++) {
                        const tr = (t === 0) ? transNoEnd[fi][ai] : transWithEnd[fi][ai];
                        const t2 = t + tr.dt;
                        if (t2 !== totalSec) continue;
                        const val = base + tr.reps;
                        if (val > dp[t2][tr.f2I]) {
                            dp[t2][tr.f2I] = val;
                            prev[t2][tr.f2I] = t;
                            prevF[t2][tr.f2I] = fi;
                            prevA[t2][tr.f2I] = ai;
                            prevIsEnd[t2][tr.f2I] = 1;
                        }
                    }
                }
            }

            // Find minimal fatigue end state that can reach target.
            let bestFi = -1;
            let maxVal = NEG;
            for (let fi = 0; fi < fN; fi++) {
                const v = dp[totalSec][fi];
                if (v > maxVal) maxVal = v;
            }
            for (let fi = 0; fi < fN; fi++) {
                const v = dp[totalSec][fi];
                if (reachesTarget(v)) { bestFi = fi; break; }
            }

            if (bestFi < 0) {
                let bestT = -1;
                let bestFi2 = -1;
                let maxVal2 = maxVal;
                for (let t = totalSec; t >= 0; t--) {
                    for (let fi = 0; fi < fN; fi++) {
                        const v = dp[t][fi];
                        if (v > maxVal2) maxVal2 = v;
                    }
                    for (let fi = 0; fi < fN; fi++) {
                        const v = dp[t][fi];
                        if (reachesTarget(v)) { bestT = t; bestFi2 = fi; break; }
                    }
                    if (bestFi2 >= 0) break;
                }
                if (bestFi2 < 0) {
                    return { pattern: [], reps: 0, meta: { impossible: true, maxReps: Math.round(Math.max(0, maxVal2)), targetReps, filledSec: totalSec } };
                }
                let tCur = bestT;
                let fCur = bestFi2;
                const rev = [];
                while (tCur > 0) {
                    const tPrev = prev[tCur][fCur];
                    const fPrev = prevF[tCur][fCur];
                    const aIdx = prevA[tCur][fCur];
                    if (tPrev < 0 || fPrev < 0 || aIdx < 0) break;
                    if (prevIsEnd[tCur][fCur]) {
                        const a = actions[aIdx];
                        rev.push({ on: a.on, off: 0, eff: a.eff, restEff: a.restEff, workTempoRpm: a.workTempoRpm, workTempoSoftRpm: a.workTempoSoftRpm });
                    } else {
                        rev.push(actions[aIdx]);
                    }
                    tCur = tPrev;
                    fCur = fPrev;
                    if (rev.length > 2000) break;
                }
                const pattern = rev.reverse();
                const sim = simulateZarubaReps(pattern, bestT, { ...model, defaultRestEff10: restEff10 });
                return { pattern, reps: sim.reps, meta: { filledSec: bestT, fatigueEnd: sim.fatigueEnd, targetReps, maxReps: Math.round(Math.max(0, maxVal2)), approx: true } };
            }

            let tCur = totalSec;
            let fCur = bestFi;
            const rev = [];
            while (tCur > 0) {
                const tPrev = prev[tCur][fCur];
                const fPrev = prevF[tCur][fCur];
                const aIdx = prevA[tCur][fCur];
                if (tPrev < 0 || fPrev < 0 || aIdx < 0) break;
                if (prevIsEnd[tCur][fCur]) {
                    const a = actions[aIdx];
                    rev.push({ on: a.on, off: 0, eff: a.eff, restEff: a.restEff, workTempoRpm: a.workTempoRpm, workTempoSoftRpm: a.workTempoSoftRpm });
                } else {
                    rev.push(actions[aIdx]);
                }
                tCur = tPrev;
                fCur = fPrev;
                if (rev.length > 2000) break;
            }
            const pattern = rev.reverse();
            const sim = simulateZarubaReps(pattern, totalSec, { ...model, defaultRestEff10: restEff10 });
            return { pattern, reps: sim.reps, meta: { filledSec: totalSec, fatigueEnd: sim.fatigueEnd, targetReps, maxReps: Math.round(Math.max(0, maxVal)), approx: false } };
        } catch (e) {
            return { pattern: [], reps: 0, meta: { error: String(e?.message || e) } };
        }
    }

    const SimCore = {
        predictedMaxHRFromAge,
        asBpm,
        activityZoneFractions,
        parseZarPattern,
        formatZarPatternSegments,
        simulateHR,
        zoneTailViolation,
        hrLoadAU,
        hrLoadZone,
        simulateZarubaReps,
        simulateZarubaClickPlan,
        optimizeZarubaPattern,
        optimizeZarubaPatternForTarget
    };

    // Export namespace
    if (typeof window !== 'undefined') {
        window.SimCore = SimCore;
        // Backward compatible globals (so existing code keeps working)
        window.predictedMaxHRFromAge = predictedMaxHRFromAge;
        window.asBpm = asBpm;
        window.activityZoneFractions = activityZoneFractions;
        window.parseZarPattern = parseZarPattern;
        window.formatZarPatternSegments = formatZarPatternSegments;
        window.simulateHR = simulateHR;
        window.zoneTailViolation = zoneTailViolation;
        window.hrLoadAU = hrLoadAU;
        window.hrLoadZone = hrLoadZone;
        window.simulateZarubaReps = simulateZarubaReps;
        window.optimizeZarubaPattern = optimizeZarubaPattern;
        window.optimizeZarubaPatternForTarget = optimizeZarubaPatternForTarget;
    }
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = { SimCore };
    }
})();
