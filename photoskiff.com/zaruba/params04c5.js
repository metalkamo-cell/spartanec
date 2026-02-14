(function(){
  'use strict';
  const $ = window.$ || (id => document.getElementById(id));

  function _numFromInput(id, fallback) {
    const el = $(id);
    const v = +(el?.value);
    if (Number.isFinite(v)) return v;
    const dv = +(el?.defaultValue);
    if (Number.isFinite(dv)) return dv;
    return fallback;
  }

  function _setNumToInput(id, raw) {
    const el = $(id);
    if (!el) return;
    const v = +raw;
    if (Number.isFinite(v)) { el.value = String(v); return; }
    const dv = +(el.defaultValue);
    if (Number.isFinite(dv)) el.value = String(dv);
  }

  function getParams() {
    const clampRpe10 = (v, def) => {
      const n = +v;
      if (!Number.isFinite(n)) return def;
      return Math.max(0, Math.min(10, n));
    };
    const age = _numFromInput("age", 35);
    const hrRest = _numFromInput("hrRest", 55);
    const sportLevel = $("sportLevel")?.value || 'general';
    const hrMaxRaw = String($("hrMax")?.value || '').trim();
    const hrMaxUserProvided = hrMaxRaw.length > 0;
    const hrMaxUser = hrMaxUserProvided ? +hrMaxRaw : null;
    const hrMax = hrMaxUserProvided
      ? hrMaxUser
      : (typeof window.predictedMaxHRFromAge==='function'
        ? window.predictedMaxHRFromAge(age, sportLevel)
        : (+$("hrMax").value || 0));
    const fitHrMax = !!$("fitHrMax")?.checked;
    const tauOn = _numFromInput("tauOn", 25);
    const tauOff = _numFromInput("tauOff", 35);
    const warmup = _numFromInput("warmup", 0);
    const cooldown = _numFromInput("cooldown", 5);
    const postRest = _numFromInput("postRest", 0);
    const drift10 = _numFromInput("drift10", 2);
    const useHRR = $("useHRR").checked;
    const trimpSex = ($("trimpSex")?.value || 'm');
    const activity = $("activity")?.value || ($("selActRun")?.checked ? 'run' : ($("selActBike")?.checked ? 'bike' : 'kb'));
    // SIT/HIIT eff are RPE values (6–10 typical)
    const sit = { work: +$("sitWork").value, rest: +$("sitRest").value, n: +$("sitN").value, eff: clampRpe10($("sitEff")?.value, 9.5) };
    // Rest intensity control: 0..10 (RPE-like). 0 => passive rest. Map to 0..0.5 HRR band when >0 (10 => 0.5).
    const restRPE = clampRpe10($("hiitRestEff")?.value, 0);
    const restFrac = restRPE <= 0 ? 0 : (restRPE / 20); // 0..0.5
    const hiit = { work: +$("hiitWork").value, rest: +$("hiitRest").value, n: +$("hiitN").value, eff: clampRpe10($("hiitEff")?.value, 8.5), restFrac };
    // Zaruba: optional free-form pattern (sequence of On/Off segments)
    const zarMode = ($("zarMode")?.value || 'classic');
    const zMode = (zarMode === 'universal') ? 'universal' : 'classic';
    const getNum = (id, def) => {
      const v = +( $(id)?.value ?? def );
      return Number.isFinite(v) ? v : def;
    };
    const patStrC = $("zarPatternC")?.value || "";
    const patStrU = $("zarPatternU")?.value || "";
    const offC = getNum("zarOffC", 30);
    const offU = getNum("zarOffU", 30);
    const patSegsC = (typeof window.parseZarPattern==='function') ? window.parseZarPattern(patStrC, offC) : [];
    const patSegsU = (typeof window.parseZarPattern==='function') ? window.parseZarPattern(patStrU, offU) : [];

    const patternLenSec = (arr) => {
      try {
        if (!Array.isArray(arr) || arr.length <= 0) return 0;
        let s = 0;
        for (const it of arr) {
          const on = Number.isFinite(+it?.on) ? Math.max(0, +it.on) : 0;
          const off = Number.isFinite(+it?.off) ? Math.max(0, +it.off) : 0;
          s += (on + off);
        }
        // Round to centiseconds to match scheme semantics.
        return Math.max(0, Math.round(s * 100) / 100);
      } catch (_) {
        return 0;
      }
    };
    const patLenC = patternLenSec(patSegsC);
    const patLenU = patternLenSec(patSegsU);

    // Universal Zaruba rest intensity control: 0..10 (RPE-like). Map to 0..0.5 HRR band when >0 (10 => 0.5).
    const zarRestRPEU = clampRpe10($("zarRestEffU")?.value, 0);
    const zarRestFracU = zarRestRPEU <= 0 ? 0 : (zarRestRPEU / 20); // 0..0.5

    const zarClassic = {
      mode: 'classic',
      on: getNum("zarOnC", 30),
      off: offC,
      eff: clampRpe10(getNum("zarEffC", 8.5), 8.5),
      dur: (() => {
        const base = getNum("zarDurC", 300);
        if (patLenC > 0 && patSegsC && patSegsC._hardStop) return Math.max(1, patLenC);
        if (patLenC > 0 && patSegsC && patSegsC._noCycle) return Math.max(base, patLenC);
        return base;
      })(),
      pattern: patSegsC.length ? patSegsC : undefined
    };
    const zarKinU = (String($("zarKinU")?.value || 'hiit').toLowerCase() === 'sit') ? 'sit' : 'hiit';
    const zarUniversal = {
      mode: 'universal',
      on: getNum("zarOnU", 30),
      off: offU,
      eff: clampRpe10(getNum("zarEffU", 5.0), 5.0),
      dur: (() => {
        const base = getNum("zarDurU", 300);
        if (patLenU > 0 && patSegsU && patSegsU._hardStop) return Math.max(1, patLenU);
        if (patLenU > 0 && patSegsU && patSegsU._noCycle) return Math.max(base, patLenU);
        return base;
      })(),
      kin: zarKinU,
      // SIT-like kinetics intentionally ignore active-rest intensity.
      restFrac: (zarKinU === 'sit') ? 0 : zarRestFracU,
      pattern: patSegsU.length ? patSegsU : undefined
    };
    const zar = (zMode === 'universal') ? zarUniversal : zarClassic;
    const z2 = { min: +$("z2Min").value, frac: +$("z2Frac").value / 100 }, z34 = { min: +$("z34Min").value, frac: +$("z34Frac").value / 100 };
    // Snatch (KB)
    const snWeightEl = $("snWeight");
    const snWeightRaw = String(snWeightEl?.value ?? '').trim();
    let snWeight;
    if (snWeightRaw === '') {
      const def = String(snWeightEl?.defaultValue ?? '').trim();
      snWeight = def === '' ? 16 : +def;
    } else {
      snWeight = +snWeightRaw;
    }
    if (!Number.isFinite(snWeight)) snWeight = 16;
    snWeight = Math.max(4, Math.min(50, snWeight));
    const sn = {
      min: +( $("snMin")?.value || 10 ),
      weight: snWeight,
      cad: +( $("snCad")?.value || 20 ),
      prot: ($("snProt")?.value || 'classic'),
      changeMin: +( $("snChangeMin")?.value || 5 )
    };
    // Swings (KB)
    const sw = {
      min: +( $("swMin")?.value || 14 ),
      eff: +( $("swEff")?.value || 8.5 ),
      weight: +( $("swWeight")?.value || 20 ),
      style: ($("swStyle")?.value || 'universal'),
      prot: ($("swProt")?.value || 'classic'),
      changeMin: +( $("swChangeMin")?.value || Math.max(1, (+( $("swMin")?.value || 14 ))/2) )
    };
    const bodyWeight = +$("bodyWeight").value;

    // Zaruba optimizer (performance model tuning)
    const zarOpt = {
      allOutSec: getNum("zarOptAllOut", 45),
      cadenceMaxRpm: getNum("zarOptCad", 20),
      tempoMinPct: getNum("zarOptTempoMin", 70),
      tempoSteps: (function(){
        const v = getNum("zarOptTempoSteps", 5);
        return Math.max(1, Math.min(9, Math.floor(v)));
      })(),
      recTauSec: getNum("zarOptRec", 30),
      switchCostSec: getNum("zarOptSwitch", 1)
      ,tempoFatiguePow: getNum("zarOptTempoPow", 1.4)
      ,tempoSustainPow: getNum("zarOptTempoSustainPow", 3.0)
      ,cyclesFixed: (function(){
        const v = getNum("zarOptCycles", 0);
        const k = Math.floor(+v || 0);
        return Math.max(0, Math.min(200, k));
      })()
      ,finishSprintSec: (function(){
        // 0 disables splitting into a finishing sprint.
        const v = getNum("zarOptFinish", 20);
        const k = Math.floor(+v || 0);
        return Math.max(0, Math.min(120, k));
      })()
    };

  return { age, hrRest, hrMax, hrMaxUserProvided, hrMaxUser, sportLevel, fitHrMax, tauOn, tauOff, warmup, cooldown, postRest, drift10, useHRR, trimpSex, activity, sit, hiit, zarMode: zMode, zar, zarClassic, zarUniversal, zarOpt, z2, z34, sn, sw, bodyWeight };
  }

  function currentState() {
    const p = getParams();
    const st = {
      LANG: window.LANG,
      ...p,
      chkSIT: $("chkSIT").checked, chkHIIT: $("chkHIIT").checked, chkZ2: $("chkZ2").checked, chkZ34: $("chkZ34").checked, chkZRB: $("chkZRB")?.checked || false,
      groups: {
        adv: !!$("detAdv")?.open,
        intervals: !!$("detCtlIntervals")?.open,
        steady: !!$("detCtlSteady")?.open,
        inputs: !!$("detInputs")?.open
      },
      impOffset: (function(){ const v = Number($("impOffset")?.value || window.IMPORT_OFFSET_SEC || 0); return Number.isFinite(v) ? v : 0; })()
    };
    // Keep Zaruba custom patterns compact for sharing/presets.
    try {
      const patC = String($("zarPatternC")?.value || '').trim();
      const patU = String($("zarPatternU")?.value || '').trim();
      if (st.zarClassic) { if (patC) st.zarClassic.pattern = patC; else delete st.zarClassic.pattern; }
      if (st.zarUniversal) { if (patU) st.zarUniversal.pattern = patU; else delete st.zarUniversal.pattern; }
      if (st.zar) {
        const pat = (st.zarMode === 'universal') ? patU : patC;
        if (pat) st.zar.pattern = pat; else delete st.zar.pattern;
      }
    } catch(_) {}
    return st;
  }

  function applyState(s) {
    if (!s) return;
    if (s.LANG) { window.LANG = s.LANG; localStorage.setItem("sit_lang", window.LANG); }
    if ($("sportLevel") && s.sportLevel) { try { $("sportLevel").value = s.sportLevel; } catch(_){} }
    if (s.activity) {
      if ($("activity")) { $("activity").value = s.activity; }
      if ($("selActKb")) $("selActKb").checked = (s.activity === 'kb');
      if ($("selActRun")) $("selActRun").checked = (s.activity === 'run');
      if ($("selActBike")) $("selActBike").checked = (s.activity === 'bike');
    }
    $("age").value = s.age; $("hrRest").value = s.hrRest;
    // Back-compat: older saved states store only computed hrMax (even when the input was empty).
    if (typeof s.hrMaxUserProvided !== 'undefined') {
      $("hrMax").value = s.hrMaxUserProvided ? (s.hrMaxUser ?? s.hrMax ?? "") : "";
    } else {
      $("hrMax").value = (s.hrMax ?? "");
    }
    if ($("fitHrMax")) $("fitHrMax").checked = !!s.fitHrMax;
    _setNumToInput("tauOn", s.tauOn);
    _setNumToInput("tauOff", s.tauOff);
    _setNumToInput("warmup", s.warmup);
    _setNumToInput("cooldown", s.cooldown);
    if ($("postRest")) _setNumToInput("postRest", (typeof s.postRest !== 'undefined' ? s.postRest : 3));
    _setNumToInput("drift10", s.drift10);
    $("useHRR").checked = !!s.useHRR;
    if ($("trimpSex")) { $("trimpSex").value = (s.trimpSex === 'f' ? 'f' : 'm'); }
    const sitEffStored = s.sit.eff;
    const hiitEffStored = s.hiit.eff;
    const toRPE = (v) => (v <= 1.0 ? (6 + 4 * v) : v);
    $("sitWork").value = s.sit.work; $("sitRest").value = s.sit.rest; $("sitN").value = s.sit.n; $("sitEff").value = toRPE(sitEffStored);
    $("hiitWork").value = s.hiit.work; $("hiitRest").value = s.hiit.rest; if($("hiitRestEff")) $("hiitRestEff").value = String(Math.max(0, Math.min(10, +(s.hiit.restFrac||0)*20))); $("hiitN").value = s.hiit.n; $("hiitEff").value = toRPE(hiitEffStored);
    $("z2Min").value = s.z2.min; $("z2Frac").value = s.z2.frac * 100; $("z34Min").value = s.z34.min; $("z34Frac").value = s.z34.frac * 100;
    if (s.sn) {
      if($("snMin")) $("snMin").value = (s.sn.min ?? 10);
      if($("snWeight")) $("snWeight").value = (s.sn.weight ?? 16);
      if($("snCad")) $("snCad").value = (s.sn.cad ?? 20);
      if($("snProt")) $("snProt").value = (s.sn.prot || 'classic');
      if($("snChangeMin")) $("snChangeMin").value = (s.sn.changeMin ?? 5);
    }
    if (s.sw) {
      if($("swMin")) $("swMin").value = (s.sw.min ?? 14);
      if($("swEff")) $("swEff").value = (s.sw.eff <= 1.0 ? (2 + 8 * s.sw.eff) : s.sw.eff);
      if($("swWeight")) $("swWeight").value = (s.sw.weight ?? 20);
      if($("swStyle")) $("swStyle").value = (s.sw.style || 'universal');
      if($("swProt")) $("swProt").value = (s.sw.prot || 'classic');
      if($("swChangeMin")) $("swChangeMin").value = (s.sw.changeMin ?? Math.max(1, (s.sw.min||14)/2));
    }
    // Zaruba (Classic/Universal independent)
    {
      const mode = (s.zarMode === 'universal' || s.zar?.mode === 'universal') ? 'universal' : 'classic';
      if($("zarMode")) $("zarMode").value = mode;

      const applyOne = (src, ids, effMode) => {
        if (!src) return;
        if($(ids.dur)) $(ids.dur).value = (src.dur ?? 300);
        if($(ids.on)) $(ids.on).value = (src.on ?? 30);
        if($(ids.off)) $(ids.off).value = (src.off ?? 30);
        if($(ids.eff)) {
          const v = src.eff;
          $(ids.eff).value = (v <= 1.0)
            ? (effMode === 'universal' ? (2 + 8 * v) : (6 + 4 * v))
            : v;
        }
        if($(ids.pat)) {
          if (typeof src.pattern === 'string') {
            $(ids.pat).value = src.pattern;
          } else if (Array.isArray(src.pattern)) {
            $(ids.pat).value = (typeof window.formatZarPatternSegments === 'function')
                ? window.formatZarPatternSegments(src.pattern, { lang: window.LANG })
              : src.pattern.map(seg=>`${seg.on}/${seg.off}`).join(' ');
          } else {
            $(ids.pat).value = '';
          }
        }
        if (ids.restEff && $(ids.restEff)) {
          const rf = +src.restFrac || 0;
          $(ids.restEff).value = String(Math.max(0, Math.min(10, rf * 20)));
        }
      };

      // Prefer new fields if present
      if (s.zarClassic) applyOne(s.zarClassic, { dur:'zarDurC', on:'zarOnC', off:'zarOffC', eff:'zarEffC', pat:'zarPatternC' }, 'classic');
      if (s.zarUniversal) {
        applyOne(s.zarUniversal, { dur:'zarDurU', on:'zarOnU', off:'zarOffU', eff:'zarEffU', pat:'zarPatternU', restEff:'zarRestEffU' }, 'universal');
        if($("zarKinU")) $("zarKinU").value = (String(s.zarUniversal.kin || 'hiit').toLowerCase() === 'sit') ? 'sit' : 'hiit';
      }

      // Back-compat: old states had only s.zar
      if (!s.zarClassic && !s.zarUniversal && s.zar) {
        const m = (s.zar.mode === 'universal') ? 'universal' : 'classic';
        if (m === 'universal') applyOne(s.zar, { dur:'zarDurU', on:'zarOnU', off:'zarOffU', eff:'zarEffU', pat:'zarPatternU', restEff:'zarRestEffU' }, 'universal');
        else applyOne(s.zar, { dur:'zarDurC', on:'zarOnC', off:'zarOffC', eff:'zarEffC', pat:'zarPatternC' }, 'classic');
        // Seed the other mode with safe defaults
        if (m !== 'universal') { if($("zarDurU")) $("zarDurU").value = "300"; if($("zarOnU")) $("zarOnU").value = "30"; if($("zarOffU")) $("zarOffU").value = "30"; if($("zarEffU")) $("zarEffU").value = "5.0"; if($("zarPatternU")) $("zarPatternU").value = ""; if($("zarKinU")) $("zarKinU").value = "hiit"; if($("zarRestEffU")) $("zarRestEffU").value = "0.0"; }
        if (m !== 'classic') { if($("zarDurC")) $("zarDurC").value = "300"; if($("zarOnC")) $("zarOnC").value = "30"; if($("zarOffC")) $("zarOffC").value = "30"; if($("zarEffC")) $("zarEffC").value = "8.5"; if($("zarPatternC")) $("zarPatternC").value = ""; }
      }
    }

    // Zaruba optimizer (optional; safe defaults)
    {
      const o = s.zarOpt || {};
      if ($("zarOptAllOut")) $("zarOptAllOut").value = String(Number.isFinite(+o.allOutSec) ? +o.allOutSec : 45);
      if ($("zarOptCad")) $("zarOptCad").value = String(Number.isFinite(+o.cadenceMaxRpm) ? +o.cadenceMaxRpm : 20);
      if ($("zarOptTempoMin")) $("zarOptTempoMin").value = String(Number.isFinite(+o.tempoMinPct) ? +o.tempoMinPct : 70);
      if ($("zarOptTempoSteps")) $("zarOptTempoSteps").value = String(Number.isFinite(+o.tempoSteps) ? Math.max(1, Math.min(9, Math.floor(+o.tempoSteps))) : 5);
      if ($("zarOptRec")) $("zarOptRec").value = String(Number.isFinite(+o.recTauSec) ? +o.recTauSec : 30);
      if ($("zarOptSwitch")) $("zarOptSwitch").value = String(Number.isFinite(+o.switchCostSec) ? +o.switchCostSec : 1);
      if ($("zarOptTempoPow")) $("zarOptTempoPow").value = String(Number.isFinite(+o.tempoFatiguePow) ? +o.tempoFatiguePow : 1.4);
      try {
        const v = +($("zarOptTempoPow")?.value || 1.4);
        if ($("zarOptTempoPowV")) $("zarOptTempoPowV").textContent = (Number.isFinite(v) ? v.toFixed(2) : '1.40');
      } catch (_) {}
      if ($("zarOptTempoSustainPow")) $("zarOptTempoSustainPow").value = String(Number.isFinite(+o.tempoSustainPow) ? +o.tempoSustainPow : 3.0);
      try {
        const v = +($("zarOptTempoSustainPow")?.value || 3.0);
        if ($("zarOptTempoSustainPowV")) $("zarOptTempoSustainPowV").textContent = (Number.isFinite(v) ? v.toFixed(2) : '3.00');
      } catch (_) {}
      if ($("zarOptCycles")) $("zarOptCycles").value = String(Number.isFinite(+o.cyclesFixed) ? Math.max(0, Math.min(200, Math.floor(+o.cyclesFixed))) : 0);
      if ($("zarOptFinish")) $("zarOptFinish").value = String(Number.isFinite(+o.finishSprintSec) ? Math.max(0, Math.min(120, Math.floor(+o.finishSprintSec))) : 20);
    }
  $("chkSIT").checked = !!s.chkSIT; $("chkHIIT").checked = !!s.chkHIIT; $("chkZ2").checked = !!s.chkZ2; $("chkZ34").checked = !!s.chkZ34; if($("chkZRB")) $("chkZRB").checked = !!s.chkZRB;
    if (s.groups) {
      if ($("detAdv")) $("detAdv").open = !!s.groups.adv;
      if ($("detCtlIntervals")) $("detCtlIntervals").open = !!s.groups.intervals;
      if ($("detCtlSteady")) $("detCtlSteady").open = !!s.groups.steady;
      if ($("detInputs")) $("detInputs").open = !!s.groups.inputs;
    }
    if (typeof s.impOffset !== 'undefined') {
      window.IMPORT_OFFSET_SEC = Number(s.impOffset) || 0;
      if ($("impOffset")) $("impOffset").value = String(window.IMPORT_OFFSET_SEC);
      if ($("impOffsetRange")) $("impOffsetRange").value = String(Math.max(+$("impOffsetRange").min, Math.min(+$("impOffsetRange").max, window.IMPORT_OFFSET_SEC)));
    }
  }

  let _saveLastTimer = 0;
  function saveLastStateDebounced() {
    clearTimeout(_saveLastTimer);
    _saveLastTimer = setTimeout(() => {
      try { localStorage.setItem("sit_last", JSON.stringify(currentState())); } catch (_) { }
    }, 150);
  }

  function tryLoadLastState() {
    try {
      const raw = localStorage.getItem("sit_last");
      if (!raw) return false;
      const st = JSON.parse(raw);
      applyState(st);
      window.AUTO_TUNE_Z2 = false;
      return true;
    } catch (_) { return false; }
  }

  function _toBase64Url(b64) {
    return String(b64).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
  }

  function _fromBase64Url(b64url) {
    let s = String(b64url).trim();
    // URLSearchParams treats '+' as space in query strings; tolerate it.
    s = s.replace(/\s+/g, '+');
    s = s.replace(/-/g, '+').replace(/_/g, '/');
    const pad = s.length % 4;
    if (pad) s += '='.repeat(4 - pad);
    return s;
  }

  function encodeStateForURL(st) {
    const json = JSON.stringify(st);
    const b64 = btoa(unescape(encodeURIComponent(json)));
    // IMPORTANT: keep legacy-compatible output.
    // Older deployed versions expect standard base64 (often URI-encoded) and may fail on
    // base64url without padding. We still accept base64url in the decoder.
    return b64;
  }

  function decodeStateFromURLParam(s) {
    const b64 = _fromBase64Url(s);
    return JSON.parse(decodeURIComponent(escape(atob(b64))));
  }

  function getShareBaseUrl() {
    // `file://` pages have origin === "null"; build a reasonable base anyway.
    const origin = (location.origin && location.origin !== 'null') ? location.origin : '';
    if (origin) return `${origin}${location.pathname}`;
    return location.href.split('?')[0].split('#')[0];
  }

  function buildShareUrlForState(st) {
    const base = getShareBaseUrl();
    const s = encodeStateForURL(st);
    // Use hash so the state is not sent to the server (avoids 414 / URL length limits on hosting).
    // Still URI-encode to keep it copy/paste safe.
    return `${base}#s=${encodeURIComponent(s)}`;
  }

  function clearStateFromURL() {
    try {
      const base = getShareBaseUrl();

      // Preserve existing search params (e.g., ?lang=ru) but drop any legacy ?s=
      let search = '';
      try {
        const sp = new URLSearchParams(location.search || '');
        sp.delete('s');
        const qs = sp.toString();
        search = qs ? `?${qs}` : '';
      } catch(_) {}

      // Drop hash-based state (#s=...). If there are other hash params, keep them.
      let hash = '';
      try {
        const h = (location.hash || '').replace(/^#/, '');
        if (h) {
          const hp = new URLSearchParams(h);
          hp.delete('s');
          const hs = hp.toString();
          hash = hs ? `#${hs}` : '';
        }
      } catch(_) {
        // If hash isn't parseable as params, only clear it when it starts with s=
        try {
          const h = (location.hash || '').replace(/^#/, '');
          if (h && h.startsWith('s=')) hash = '';
        } catch(_) {}
      }

      const url = `${base}${search}${hash}`;
      history.replaceState(null, '', url);
    } catch(_) {}
  }

  function copyStateLink() {
    const st = currentState();
    const url = buildShareUrlForState(st);
    const I18N = window.I18N || {}; const LANG = window.LANG || (document.documentElement.lang || 'en');
    const tShare = (I18N[LANG]?.share) || 'Copy state link';
    navigator.clipboard?.writeText(url).then(() => {
      const btn = $("btnShare");
      if (btn) { btn.textContent = (I18N[LANG]?.linkCopied) || 'Link copied!'; setTimeout(() => { btn.textContent = tShare; }, 1500); }
    }).catch(() => { prompt(LANG === "ru" ? "Скопируйте ссылку вручную:" : "Copy link manually:", url); });
  }

  function tryLoadStateFromURL() {
    // Prefer hash-based state (#s=...) to avoid server URL-length limits.
    let s = null;
    try {
      if (location.hash && location.hash.length > 1) {
        const hs = location.hash.startsWith('#') ? location.hash.slice(1) : location.hash;
        s = new URLSearchParams(hs).get('s');
        if (!s && hs.startsWith('s=')) s = hs.slice(2);
      }
    } catch(_) {}
    if (!s) {
      try { s = new URLSearchParams(location.search).get('s'); } catch(_) {}
    }
    if (!s) return null;
    try { return decodeStateFromURLParam(s); }
    catch (e) { console.warn("Bad state in URL", e); return null; }
  }

  // Z2 auto-tune controls
  let Z2_TARGET_TOUCHED = false;
  document.getElementById("z2Frac")?.addEventListener("input", () => { Z2_TARGET_TOUCHED = true; });
  let AUTO_TUNE_Z2 = true;

  function setZ2TargetIfAbove(rec) {
    const z2FracEl = $("z2Frac");
    if (!z2FracEl) return;
    const cur = (+z2FracEl.value) / 100;
    if (cur > rec) {
      z2FracEl.value = String(Math.round(rec * 100));
      if (typeof window.updatePercentLabels === 'function') window.updatePercentLabels();
    }
  }

  function maybeAutoTuneZ2(now = false) {
    if (!AUTO_TUNE_Z2) return;
    if (Z2_TARGET_TOUCHED && !now) return;
    const age = _numFromInput("age", 35);
    const hrRest = _numFromInput("hrRest", 55);
    const sportLevel = $("sportLevel")?.value || 'general';
    const hrMax = $("hrMax").value ? +$("hrMax").value : (typeof window.predictedMaxHRFromAge==='function'? window.predictedMaxHRFromAge(age, sportLevel) : +$("hrMax").value||0);
    const useHRR = $("useHRR").checked;
    const warmMin = _numFromInput("warmup", 0);
    const coolMin = _numFromInput("cooldown", 5);
    const steadyMin = _numFromInput("z2Min", 40);
    const drift10 = _numFromInput("drift10", 2);
    const tauOn = _numFromInput("tauOn", 25);
    const tauOff = _numFromInput("tauOff", 35);

    if (typeof window.recommendZ2FracSim === 'function') {
      const rec = window.recommendZ2FracSim({ hrRest, hrMax, useHRR, tauOn, tauOff, warmMin, coolMin, steadyMin, drift10 });
      setZ2TargetIfAbove(rec);
    }
  }

  // expose
  window.getParams = getParams;
  window.currentState = currentState;
  window.applyState = applyState;
  window.saveLastStateDebounced = saveLastStateDebounced;
  window.tryLoadLastState = tryLoadLastState;
  window.encodeStateForURL = encodeStateForURL;
  window.decodeStateFromURLParam = decodeStateFromURLParam;
  window.buildShareUrlForState = buildShareUrlForState;
  window.copyStateLink = copyStateLink;
  window.tryLoadStateFromURL = tryLoadStateFromURL;
  window.clearStateFromURL = clearStateFromURL;
  window.Z2_TARGET_TOUCHED = Z2_TARGET_TOUCHED;
  window.AUTO_TUNE_Z2 = AUTO_TUNE_Z2;
  window.setZ2TargetIfAbove = setZ2TargetIfAbove;
  window.maybeAutoTuneZ2 = maybeAutoTuneZ2;
})();