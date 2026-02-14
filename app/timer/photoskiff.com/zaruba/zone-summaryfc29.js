// zone-summary.js
// Summary logic for zone comparator

/**
 * Calculate similarity between theoretical and real workout charts
 * @param {Array<number>} theoretical - Theoretical HR values
 * @param {Array<number>} real - Real HR values
 * @returns {Object} Metrics: RMSE, correlation
 */
function calculateChartSimilarity(theoretical, real) {
    if (!theoretical || !real || theoretical.length !== real.length) return null;
    let n = theoretical.length;
    if (n <= 0) return null;
    let sumSq = 0, sumT = 0, sumR = 0, sumTR = 0, sumT2 = 0, sumR2 = 0;
    for (let i = 0; i < n; i++) {
        let t = theoretical[i], r = real[i];
        sumSq += Math.pow(t - r, 2);
        sumT += t;
        sumR += r;
        sumTR += t * r;
        sumT2 += t * t;
        sumR2 += r * r;
    }
    let rmse = Math.sqrt(sumSq / n);
    const denom = Math.sqrt((n * sumT2 - sumT * sumT) * (n * sumR2 - sumR * sumR));
    let corr = (denom > 0)
        ? ((n * sumTR - sumT * sumR) / denom)
        : NaN;
    return { rmse, corr };
}

/**
 * Interpolate y at time t given monotonic time axis X and values Y
 */
function interpAt(X, Y, t) {
    if (!Array.isArray(X) || !Array.isArray(Y) || X.length !== Y.length || X.length === 0) return NaN;
    if (t <= X[0]) return Y[0];
    const n = X.length;
    if (t >= X[n-1]) return Y[n-1];
    // Binary search for segment
    let lo = 0, hi = n - 1;
    while (lo + 1 < hi) {
        const mid = (lo + hi) >> 1;
        if (X[mid] === t) return Y[mid];
        if (X[mid] < t) lo = mid; else hi = mid;
    }
    const x0 = X[lo], x1 = X[hi];
    const y0 = Y[lo], y1 = Y[hi];
    const w = (t - x0) / Math.max(1e-9, (x1 - x0));
    return y0 * (1 - w) + y1 * w;
}

/**
 * Compute similarity with a constant time lag applied to real times.
 * theoretical at times T, real at times RT; compare theoretical[i] vs interp(real, T[i] + lag)
 */
function similarityAtLag(theoretical, T, real, RT, lagSec) {
    if (!Array.isArray(theoretical) || !Array.isArray(T) || theoretical.length !== T.length) return null;
    if (!Array.isArray(real) || !Array.isArray(RT) || real.length !== RT.length) return null;
    const n = theoretical.length;
    const R = new Array(n);
    for (let i = 0; i < n; i++) {
        const t = T[i] + lagSec;
        R[i] = interpAt(RT, real, t);
    }
    return calculateChartSimilarity(theoretical, R);
}

/**
 * Compute windowed correlation statistics at a given lag.
 * This is a diagnostic for local agreement (helps detect cases where global corr is high
 * but alignment is inconsistent across the session).
 *
 * Returns null if inputs are insufficient.
 */
function windowedCorrStatsAtLag(theoretical, T, real, RT, lagSec, winSec = 30, stepSec = 10) {
    try {
        if (!Array.isArray(theoretical) || !Array.isArray(T) || theoretical.length !== T.length) return null;
        if (!Array.isArray(real) || !Array.isArray(RT) || real.length !== RT.length) return null;
        const n = theoretical.length;
        if (n < 50) return null;
        const dt = (n >= 2) ? (T[1] - T[0]) : NaN;
        if (!Number.isFinite(dt) || !(dt > 0)) return null;

        const winN = Math.max(12, Math.round(winSec / dt));
        const stepN = Math.max(1, Math.round(stepSec / dt));
        if (winN >= n) return null;

        // Align real to theoretical time axis at this lag.
        const R = new Array(n);
        for (let i = 0; i < n; i++) R[i] = interpAt(RT, real, T[i] + lagSec);

        const corrs = [];
        for (let i0 = 0; i0 + winN <= n; i0 += stepN) {
            let sumT = 0, sumR = 0, sumTR = 0, sumT2 = 0, sumR2 = 0;
            for (let i = i0; i < i0 + winN; i++) {
                const t = theoretical[i];
                const r = R[i];
                sumT += t; sumR += r;
                sumTR += t * r;
                sumT2 += t * t;
                sumR2 += r * r;
            }
            const m = winN;
            const denom = Math.sqrt((m * sumT2 - sumT * sumT) * (m * sumR2 - sumR * sumR));
            const corr = (denom > 0) ? ((m * sumTR - sumT * sumR) / denom) : NaN;
            if (Number.isFinite(corr)) corrs.push(corr);
        }
        if (!corrs.length) return null;
        const s = corrs.slice().sort((a, b) => a - b);
        const q = (p) => s[Math.min(s.length - 1, Math.max(0, Math.floor(p * (s.length - 1))))];
        const median = q(0.50);
        const p10 = q(0.10);
        const p90 = q(0.90);
        const min = s[0];
        const fracOk = corrs.filter(c => c >= 0.60).length / corrs.length;
        const fracGood = corrs.filter(c => c >= 0.80).length / corrs.length;
        return {
            winSec,
            stepSec,
            nWin: corrs.length,
            medianCorr: median,
            p10Corr: p10,
            p90Corr: p90,
            minCorr: min,
            fracOk,
            fracGood
        };
    } catch (_) {
        return null;
    }
}

/**
 * Linearly rescale a theoretical HR series for a different HRmax, anchoring at hrRest.
 * This approximates re-simulation when original model used HRR/%HRmax targets.
 */
function rescaleTheoForHrMax(theoretical, hrRest, hrMaxOrig, hrMaxNew) {
    if (!Array.isArray(theoretical) || !Number.isFinite(hrRest)) return theoretical;
    const denom = Math.max(1, (Number(hrMaxOrig) || 0) - hrRest);
    const spanNew = Math.max(1, (Number(hrMaxNew) || 0) - hrRest);
    if (!Number.isFinite(denom) || !Number.isFinite(spanNew)) return theoretical.slice();
    const out = new Array(theoretical.length);
    for (let i = 0; i < theoretical.length; i++) {
        const d = theoretical[i] - hrRest;
        out[i] = hrRest + (d / denom) * spanNew;
    }
    return out;
}

/**
 * Calibrate HRmax by minimizing RMSE between rescaled theoretical and real series.
 * Searches a sensible HRmax window and a small lag neighborhood around the precomputed best lag.
 */
function calibrateHrMaxRMSE(opts) {
    const { theoretical, T, real, RT, hrRest, hrMaxOrig, age, sportLevel, bestLagGuessSec } = opts || {};
    if (!Array.isArray(theoretical) || !Array.isArray(T) || !Array.isArray(real) || !Array.isArray(RT)) return null;
    if (theoretical.length !== T.length || real.length !== RT.length) return null;
    const nTheo = theoretical.length, nReal = real.length;
    if (nTheo < 5 || nReal < 5) return null;
    if (!Number.isFinite(hrRest)) return null; // rescaling is not meaningful without an anchor

    // Candidate HRmax window
    const agePred = Number.isFinite(age) ? predictedMaxHRFromAge(age, sportLevel) : 185;
    const observed = Math.max(...real);
    const base = Number.isFinite(hrMaxOrig) ? hrMaxOrig : agePred;
    let lo = Math.max(150, Math.min(base, agePred) - 20, (Number.isFinite(observed)? observed : 0) + 2);
    let hi = Math.min(210, Math.max(base, agePred) + 25, (Number.isFinite(observed)? (observed + 45) : 210));
    if (!(hi > lo + 4)) { lo = Math.max(150, (base||180) - 15); hi = Math.min(210, (base||180) + 15); }

    // Lag search window: focus around guess, else ±10% duration capped at 60s
    const duration = Math.max(0, Math.min(T[T.length-1], RT[RT.length-1]) - Math.max(T[0], RT[0]));
    const maxLag = Math.min(60, Math.max(5, Math.round(duration * 0.1)));
    const lag0 = Number.isFinite(bestLagGuessSec) ? Math.max(-maxLag, Math.min(maxLag, bestLagGuessSec)) : 0;
    const lagFrom = Math.max(-maxLag, lag0 - 6), lagTo = Math.min(maxLag, lag0 + 6); // ~13 evaluations

    // --- Identifiability heuristics ---
    // If the import never gets close to the assumed max intensity, HRmax is fundamentally underconstrained.
    const durReal = Math.max(0, RT[RT.length - 1] - RT[0]);
    const dynRange = observed - Math.min(...real);
    const nearMaxThr90 = hrRest + 0.90 * Math.max(1, (base - hrRest));
    const nearMaxThr95 = hrRest + 0.95 * Math.max(1, (base - hrRest));
    let nearMaxSec90 = 0;
    let nearMaxSec95 = 0;
    for (let i = 1; i < nReal; i++) {
        const dt = RT[i] - RT[i - 1];
        if (!(dt > 0)) continue;
        // cap dt contribution to reduce impact of gaps
        const dts = Math.min(dt, 5);
        if (real[i] >= nearMaxThr90) nearMaxSec90 += dts;
        if (real[i] >= nearMaxThr95) nearMaxSec95 += dts;
    }
    const needNearMaxSec = Math.max(8, durReal * 0.005); // >=8s or >=0.5% of duration
    let identifiable = true;
    let identReason = null;
    if (!Number.isFinite(dynRange) || dynRange < 12) {
        identifiable = false;
        identReason = 'low-dynamics';
    } else if (nearMaxSec90 < needNearMaxSec && Number.isFinite(observed) && observed < nearMaxThr90 - 3) {
        identifiable = false;
        identReason = 'no-near-max';
    }

    // Grid search over HRmax and small lag band, minimize RMSE
    let best = { hrMax: base, rmse: Infinity, lag: lag0 };
    for (let h = Math.round(lo); h <= Math.round(hi); h += 1) {
        const scaled = rescaleTheoForHrMax(theoretical, hrRest, hrMaxOrig, h);
        let bestRmseForH = Infinity, bestLagForH = lag0;
        for (let lag = lagFrom; lag <= lagTo; lag += 1) {
            const sim = similarityAtLag(scaled, T, real, RT, lag);
            if (sim && Number.isFinite(sim.rmse) && sim.rmse < bestRmseForH) { bestRmseForH = sim.rmse; bestLagForH = lag; }
        }
        if (bestRmseForH < best.rmse) best = { hrMax: h, rmse: bestRmseForH, lag: bestLagForH };
    }

    // Optional: estimate uncertainty as width where RMSE within +2% of min
    const tol = best.rmse * 1.02;
    let loStar = best.hrMax, hiStar = best.hrMax;
    for (let h = Math.round(lo); h <= Math.round(hi); h += 1) {
        const scaled = rescaleTheoForHrMax(theoretical, hrRest, hrMaxOrig, h);
        const sim = similarityAtLag(scaled, T, real, RT, best.lag);
        if (sim && Number.isFinite(sim.rmse) && sim.rmse <= tol) { loStar = Math.min(loStar, h); hiStar = Math.max(hiStar, h); }
    }

    // Baseline RMSE at original HRmax (for sanity: does fitting meaningfully improve anything?)
    let rmseBase = NaN;
    if (Number.isFinite(hrMaxOrig)) {
        const scaledBase = rescaleTheoForHrMax(theoretical, hrRest, hrMaxOrig, hrMaxOrig);
        const simBase = similarityAtLag(scaledBase, T, real, RT, best.lag);
        if (simBase && Number.isFinite(simBase.rmse)) rmseBase = simBase.rmse;
    }

    const width = (Number.isFinite(hiStar) && Number.isFinite(loStar)) ? (hiStar - loStar) : NaN;
    return {
        hrMax: best.hrMax,
        rmse: best.rmse,
        lag: best.lag,
        lo: loStar,
        hi: hiStar,
        width,
        rmseBase,
        rmseGain: (Number.isFinite(rmseBase) ? (rmseBase - best.rmse) : NaN),
        identifiable,
        identReason,
        // Evidence of near-max exposure relative to reference HRmax (base)
        nearMaxSec: nearMaxSec90,
        nearMaxThr: nearMaxThr90,
        nearMaxSec90,
        nearMaxSec95,
        nearMaxThr90,
        nearMaxThr95,
        window: [Math.round(lo), Math.round(hi)]
    };
}

/**
 * Estimate max HR based on age and real data
 * @param {number} age - User age
 * @param {Array<number>} real - Real HR values
 * @returns {Object} { predictedMaxHR, observedMaxHR, recommendation }
 */
function predictedMaxHRFromAge(age, sportLevel) {
    const a = Number(age) || 0;
    switch ((sportLevel || 'general')) {
        case 'tanaka':
            return Math.round(208 - 0.7 * a);
        case 'gellish':
            return Math.round(207 - 0.7 * a);
        default:
            return Math.round(220 - a);
    }
}

function estimateMaxHR(age, real, sportLevel) {
    const predictedMaxHR = predictedMaxHRFromAge(age, sportLevel);
    const observedMaxHR = Array.isArray(real) && real.length ? Math.max(...real) : null;
    return { predictedMaxHR, observedMaxHR };
}

/**
 * Assess imported HR series quality (sensor artifacts, sampling issues).
 * Returns a compact report usable in the Summary UI.
 */
function assessHrSeriesQuality(hr, t) {
    try {
        if (!Array.isArray(hr) || !Array.isArray(t) || hr.length < 5 || t.length !== hr.length) {
            return { level: 'na', score: 0, reasons: ['no-data'], n: Array.isArray(hr) ? hr.length : 0 };
        }
        const n = hr.length;
        // Basic stats
        let outRange = 0;
        let nonFinite = 0;
        const dts = [];
        let gaps5 = 0;
        let gaps10 = 0;
        let negDt = 0;
        let spikes = 0;
        let highDeriv = 0;
        const rates = [];
        let bigSteps = 0;
        let flatRuns = 0;
        let curFlat = 1;

        // Thresholds (heuristic; tuned for common chest strap / optical artifacts)
        const HR_MIN = 30, HR_MAX = 230;
        const STEP_BIG = 18;          // bpm per sample (typical artifact magnitude)
        const SPIKE_RATE = 10;        // bpm/sec (very steep instantaneous change)
        const HIGH_DERIV = 6;         // bpm/sec (unusually steep; can still be artifacts)
        const GAP_5 = 5, GAP_10 = 10; // seconds
        const FLAT_SEC = 20;          // identical HR for >=20s can be a stuck sensor (not always)

        for (let i = 0; i < n; i++) {
            const h = Number(hr[i]);
            const ti = Number(t[i]);
            if (!Number.isFinite(h) || !Number.isFinite(ti)) { nonFinite++; continue; }
            if (h < HR_MIN || h > HR_MAX) outRange++;
            if (i > 0) {
                const t0 = Number(t[i - 1]);
                const h0 = Number(hr[i - 1]);
                const dt = ti - t0;
                if (!(dt > 0)) { negDt++; }
                else {
                    dts.push(dt);
                    if (dt > GAP_5) gaps5++;
                    if (dt > GAP_10) gaps10++;
                    const dh = Math.abs(h - h0);
                    if (dh >= STEP_BIG) bigSteps++;
                    const rate = dh / dt;
                    if (rate >= SPIKE_RATE) spikes++;
                    if (rate >= HIGH_DERIV) highDeriv++;
                    // Track rate distribution on reasonably local steps (ignore huge gaps)
                    if (dt <= 3) rates.push(rate);
                }
                // flatline tracking (exact equality)
                if (Number.isFinite(h0) && h === h0) curFlat++;
                else {
                    // If time elapsed across the run is long enough, count it
                    if (curFlat >= 3) {
                        const j = i - curFlat;
                        const dur = (Number(t[i - 1]) - Number(t[j]));
                        if (Number.isFinite(dur) && dur >= FLAT_SEC) flatRuns++;
                    }
                    curFlat = 1;
                }
            }
        }
        // final flat run
        if (curFlat >= 3) {
            const j = n - curFlat;
            const dur = (Number(t[n - 1]) - Number(t[j]));
            if (Number.isFinite(dur) && dur >= FLAT_SEC) flatRuns++;
        }

        const duration = Math.max(0, Number(t[n - 1]) - Number(t[0]));
        const pct = (k) => (n > 0 ? (100 * k / n) : 0);

        // dt stats
        let dtMed = NaN, dtP95 = NaN;
        if (dts.length) {
            const s = dts.slice().sort((a, b) => a - b);
            dtMed = s[Math.floor(s.length / 2)];
            dtP95 = s[Math.min(s.length - 1, Math.floor(0.95 * s.length))];
        }

        // dHR/dt stats
        let rateP95 = NaN, rateMax = NaN;
        if (rates.length) {
            const rs = rates.slice().sort((a, b) => a - b);
            rateP95 = rs[Math.min(rs.length - 1, Math.floor(0.95 * rs.length))];
            rateMax = rs[rs.length - 1];
        }

        // Score (100 = great). Penalize common issues.
        let score = 100;
        score -= Math.min(60, pct(outRange) * 6);
        score -= Math.min(40, pct(nonFinite) * 10);
        score -= Math.min(40, pct(spikes) * 8);
        // Penalize persistent high derivatives even if they don't cross the spike threshold.
        score -= Math.min(25, pct(highDeriv) * 3);
        score -= Math.min(25, pct(bigSteps) * 3);
        score -= Math.min(25, (gaps10 > 0 ? 12 : 0) + (gaps5 > 0 ? 6 : 0));
        score -= Math.min(20, flatRuns * 6);
        if (duration < 30) score -= 25; // too short for reliable tau/cal
        if (!Number.isFinite(dtMed)) score -= 10;
        if (Number.isFinite(dtMed) && dtMed > 2.5) score -= 12; // very sparse sampling
        if (Number.isFinite(dtP95) && dtP95 > 6) score -= 10;
        score = Math.max(0, Math.min(100, score));

        const reasons = [];
        if (nonFinite) reasons.push('nan');
        if (outRange) reasons.push('out-of-range');
        if (spikes) reasons.push('spikes');
        if (highDeriv) reasons.push('high-derivative');
        if (bigSteps) reasons.push('big-steps');
        if (gaps5) reasons.push('gaps');
        if (flatRuns) reasons.push('flatline');
        if (duration < 30) reasons.push('short');
        if (negDt) reasons.push('non-monotonic');

        let level = 'good';
        if (score < 55) level = 'bad';
        else if (score < 80) level = 'ok';

        return {
            level,
            score,
            reasons,
            n,
            durationSec: Math.round(duration),
            dtMedian: Number.isFinite(dtMed) ? dtMed : null,
            dtP95: Number.isFinite(dtP95) ? dtP95 : null,
            rateP95: Number.isFinite(rateP95) ? rateP95 : null,
            rateMax: Number.isFinite(rateMax) ? rateMax : null,
            outOfRange: outRange,
            spikes,
            highDeriv,
            bigSteps,
            gaps5,
            gaps10,
            flatRuns,
            nonFinite
        };
    } catch (e) {
        return { level: 'na', score: 0, reasons: ['error'], error: String(e) };
    }
}

/**
 * Generate summary of condition
 * @param {Object} params - { age, theoretical, real, settings, i18n = {} }
 * @returns {Object} Summary text and metrics
 */
function generateSummaryBasic(params) {
    const { age, theoretical, real, settings, i18n = {}, lang = 'en' } = params;
    let similarity = calculateChartSimilarity(theoretical, real);
    let maxHR = estimateMaxHR(age, real);
    let tauImpact = settings.tau ? (i18n.tauOn || 'Tau is ON, smoothing applied.') : (i18n.tauOff || 'Tau is OFF.');
    let summaryText = (i18n.conditionEstimate || 'Condition estimate:') + '\n';
    if (similarity) {
        summaryText += (i18n.chartRmseCorr || 'Chart RMSE: {rmse}, Correlation: {corr}')
            .replace('{rmse}', similarity.rmse.toFixed(1))
            .replace('{corr}', similarity.corr.toFixed(2)) + '\n';
    }
    summaryText += (i18n.predictedObservedMaxHR || 'Predicted max HR: {pred}, Observed max HR: {obs}')
        .replace('{pred}', maxHR.predictedMaxHR)
        .replace('{obs}', maxHR.observedMaxHR) + '\n';
    if (maxHR.recommendation) summaryText += (i18n.maxHRRecommendation || maxHR.recommendation) + '\n';
    summaryText += tauImpact + '\n';
    // Add more settings impact as needed
    return {
        summaryText,
        metrics: { ...similarity, ...maxHR, tau: settings.tau }
    };
}

// Export functions for use in zone-comparator.js

/**
 * Estimate tau (on/off) from HR curve
 * @param {Array<number>} hr - HR values
 * @param {Array<number>} t - time values (seconds)
 * @returns {Object} { tauOn, tauOff }
 */
function estimateTau(hr, t) {
    if (!Array.isArray(hr) || !Array.isArray(t) || hr.length < 4 || t.length !== hr.length) return {};
    const q = {
        tauOn: { level: 'good', reasons: [] },
        tauOff: { level: 'good', reasons: [] },
        overall: { level: 'good', reasons: [] }
    };
    // --- Heuristic onset detection for imported-only series ---
    const N = hr.length;
    const dtAt = (i, j) => Math.max(1e-6, Math.abs(t[i] - t[j]));
    // Light smoothing to reduce noise impact on thresholds and fits
    const hrS = new Array(N);
    for (let i = 0; i < N; i++) {
        const a = hr[Math.max(0, i-1)], b = hr[i], c = hr[Math.min(N-1, i+1)];
        hrS[i] = (a + b + c) / 3;
    }
    // Smoothed slope using 3-step difference where available
    const slope = new Array(N).fill(0);
    for (let i = 3; i < N; i++) {
        slope[i] = (hrS[i] - hrS[i-3]) / dtAt(i, i-3);
    }
    const SLOPE_TH = 0.18; // bpm/sec threshold to detect work onset
    let onset = 0;
    let onsetFound = false;
    for (let i = 3; i < N - 3; i++) {
        // require sustained positive slope for ~4 sec
        const ok = slope[i] > SLOPE_TH && slope[i+1] > SLOPE_TH && slope[i+2] > 0;
        if (ok) { onset = i; onsetFound = true; break; }
    }
    if (!onsetFound) {
        q.tauOn.level = 'bad';
        q.tauOn.reasons.push('onset-not-found');
    }
    // Rest baseline = median of 5..30s before onset if available
    const preStartTime = t[onset] - 30;
    const preEndTime = t[onset] - 5;
    const preIdx = []; for (let i = 0; i < onset; i++) { if (t[i] >= preStartTime && t[i] <= preEndTime) preIdx.push(i); }
    const sample = preIdx.length ? preIdx.map(i=>hrS[i]) : hrS.slice(0, Math.max(1, Math.min(N, 20)));
    const sorted = sample.slice().sort((a,b)=>a-b);
    const median = sorted[Math.floor(sorted.length/2)] || hr[0];
    const rest = median;

    // Peak: use global max after onset (long efforts can peak well after 120s)
    let peak = -Infinity, peakIdx = onset;
    for (let i = onset; i < N; i++) {
        if (hrS[i] > peak) { peak = hrS[i]; peakIdx = i; }
    }
    if (!Number.isFinite(peak) || peak <= rest) { peak = Math.max(...hrS); peakIdx = Math.max(onset, hrS.indexOf(peak)); }

    // Tau ON from onset to 63% of (peak-rest) (fallback to 90%)
    let tauOn = null;
    const target63 = rest + 0.6321 * Math.max(0, (peak - rest));
    let cross = -1;
    for (let i = onset; i <= peakIdx; i++) { if (hrS[i] >= target63) { cross = i; break; } }
    if (cross > onset) tauOn = Math.max(0, t[cross] - t[onset]);
    else {
        const target90 = rest + 0.9 * Math.max(0, (peak - rest));
    for (let i = onset; i <= peakIdx; i++) { if (hrS[i] >= target90) { cross = i; break; } }
        if (cross > onset) tauOn = Math.max(0, t[cross] - t[onset]);
    }
    if (!Number.isFinite(tauOn) || tauOn == null) {
        q.tauOn.level = 'bad';
        q.tauOn.reasons.push('tauOn-no-crossing');
    } else {
        if (tauOn < 2) { q.tauOn.level = (q.tauOn.level === 'good') ? 'ok' : q.tauOn.level; q.tauOn.reasons.push('tauOn-too-fast'); }
        if (tauOn > 180) { q.tauOn.level = 'ok'; q.tauOn.reasons.push('tauOn-very-slow'); }
    }

    // Tau OFF: detect start of cooldown, then prefer 1/e decay using tail baseline; fallback to exp fit on the cooldown segment; then 10% threshold; then duration
    let tauOff = null;
    let tauOffMethod = null;
    let coolStartIdx = peakIdx;
    let idxTau = -1;
    let i90 = -1, i10 = -1;
    if (peakIdx >= 0 && peakIdx < hr.length - 2) {
        // 0) Detect start of cooldown: sustained negative slope after peak
        const NEG_TH = -0.05; // bpm/sec (gentle threshold)
        let negStreak = 0;
        for (let i = Math.min(N-1, peakIdx + 1); i < N; i++) {
            if (slope[i] <= NEG_TH) { negStreak++; } else { negStreak = 0; }
            if (negStreak >= 4) { coolStartIdx = i - 3; break; } // ~4s sustained drop
        }
        // Refine cooldown start: ensure we start after leaving the peak plateau
        // Require at least ~1.5 bpm drop from peak and slightly stronger negative trend
        const NEG_STRONG = -0.08;
        for (let i = Math.max(coolStartIdx, peakIdx); i < Math.min(N, coolStartIdx + 12); i++) {
            const dropped = (peak - hrS[i]) >= 1.5;
            const neg = (i+2 < N) && (slope[i] <= NEG_STRONG || slope[i+1] <= NEG_STRONG || slope[i+2] <= NEG_STRONG);
            if (dropped && neg) { coolStartIdx = i; break; }
        }

        // 0) Estimate recovery baseline from tail (median of last ~45s) to avoid mis-anchoring
        const tailWin = 45; // seconds
        const tailStartT = Math.max(t[coolStartIdx] + 5, (t[t.length-1] - tailWin));
        const tailIdx = [];
        for (let i = coolStartIdx; i < hr.length; i++) {
            if (t[i] >= tailStartT) tailIdx.push(i);
        }
        const tailSample = tailIdx.length ? tailIdx.map(i=>hrS[i]) : hrS.slice(Math.max(peakIdx, N - Math.min(N, 20)));
        const tailSorted = tailSample.slice().sort((a,b)=>a-b);
        const restOff = tailSorted.length ? tailSorted[Math.floor(tailSorted.length/2)] : rest;
        const restB = Number.isFinite(restOff) ? restOff : rest;

        // 1) Early-window exponential fit near the start of cooldown (avoid tail flattening)
        let tauFit = null;
        {
            const maxFitSec = 45; // use early 45s of recovery to estimate tau
            const fitEndT = Math.min(t[t.length-1], t[coolStartIdx] + maxFitSec);
            const y = [], x = [];
            for (let i = coolStartIdx; i < N && t[i] <= fitEndT; i++) {
                // Skip obvious rises/oscillations
                if (i > coolStartIdx && hrS[i] > hrS[i-1] + 0.1) continue;
                const yi = hrS[i] - restB;
                if (yi > 1e-3) {
                    y.push(Math.log(yi));
                    x.push(t[i] - t[coolStartIdx]);
                }
            }
            if (x.length >= 6) {
                let sx=0, sy=0, sxx=0, sxy=0, n=x.length;
                for (let i=0;i<n;i++){ sx+=x[i]; sy+=y[i]; sxx+=x[i]*x[i]; sxy+=x[i]*y[i]; }
                const denom = n*sxx - sx*sx;
                if (Math.abs(denom) > 1e-9) {
                    const b = (n*sxy - sx*sy) / denom; // slope
                    if (b < -1e-6) {
                        const cand = Math.max(0, -1/b);
                        if (cand > 0 && cand < 600) tauFit = cand;
                    }
                }
            }
        }

        // 2) 1/e threshold (time constant) from cooldown start
        const fallTargetTau = restB + 0.3678794412 * Math.max(0, (peak - restB));
        idxTau = -1;
        for (let i = coolStartIdx; i < hr.length; i++) { if (hrS[i] <= fallTargetTau) { idxTau = i; break; } }
        if (idxTau > coolStartIdx) {
            tauOff = Math.max(0, t[idxTau] - t[coolStartIdx]);
            tauOffMethod = '1e';
        }
        // 3) If not reached, try exponential fit on the cooldown segment only: HR(t) = restB + (peak-restB)*exp(-(t-tp)/tauOff)
        if (tauOff == null) {
            const y = [];
            const x = [];
            // Use points where HR is not increasing (to avoid contaminating fit)
            for (let i = coolStartIdx; i < hr.length; i++) {
                if (i > coolStartIdx && hrS[i] > hrS[i-1] + 0.2) continue; // skip clear rises
                const yi = hrS[i] - restB;
                if (yi > 1e-3) { // avoid log(<=0)
                    y.push(Math.log(yi));
                    x.push(t[i] - t[coolStartIdx]);
                }
            }
            if (x.length >= 3) {
                let sx=0, sy=0, sxx=0, sxy=0, n=x.length;
                for (let i=0;i<n;i++){ sx+=x[i]; sy+=y[i]; sxx+=x[i]*x[i]; sxy+=x[i]*y[i]; }
                const denom = n*sxx - sx*sx;
                if (Math.abs(denom) > 1e-9) {
                    const b = (n*sxy - sx*sy) / denom; // slope
                    if (b < 0) { tauOff = Math.max(0, -1/b); tauOffMethod = 'exp-fit'; }
                }
            }
        }
        // 3) 90%→10% window-based tau: τ ≈ (t10 - t90) / ln(9) for exponential decay
        let tau9010 = null;
        {
            const target90 = restB + 0.90 * Math.max(0, (peak - restB));
            const target10 = restB + 0.10 * Math.max(0, (peak - restB));
            i90 = -1; i10 = -1;
            for (let i = coolStartIdx; i < hr.length; i++) {
                if (i90 === -1 && hrS[i] <= target90) i90 = i;
                if (hrS[i] <= target10) { i10 = i; break; }
            }
            if (i90 > coolStartIdx && i10 > i90) {
                const dt9010 = t[i10] - t[i90];
                const ln9 = 2.1972245773;
                if (dt9010 > 0) tau9010 = dt9010 / ln9;
            }
        }

        // 4) 10% above restB threshold as a fallback (later than 1/e)
        if (tauOff == null) {
            const fallTarget10 = restB + 0.1 * Math.max(0, (peak - restB));
            let idxFall = -1;
            for (let i = coolStartIdx; i < hr.length; i++) { if (hrS[i] <= fallTarget10) { idxFall = i; break; } }
            if (idxFall > coolStartIdx) { tauOff = Math.max(0, t[idxFall] - t[coolStartIdx]); tauOffMethod = '10%'; }
        }
        // Prefer a robust, noise-resistant decay estimate across methods.
        const cands = [];
        if (Number.isFinite(tauOff)) cands.push(tauOff);
        if (Number.isFinite(tauFit)) cands.push(tauFit);
        if (Number.isFinite(tau9010)) cands.push(tau9010);
        if (cands.length) {
            cands.sort((a,b)=>a-b);
            const mid = (cands.length - 1) / 2;
            const med = (Number.isInteger(mid))
                ? cands[mid]
                : 0.5 * (cands[Math.floor(mid)] + cands[Math.ceil(mid)]);
            tauOff = Math.max(0, med);
            tauOffMethod = (cands.length >= 2) ? 'median' : (tauOffMethod || 'single');
        }

        // 5) Optional debug
        try {
            if (typeof window !== 'undefined' && window.DEBUG_TAU) {
                console.log('[tau] peakIdx', peakIdx, 'coolStartIdx', coolStartIdx, 'restB', restB.toFixed(1), 'tauFit', tauFit, 'tau1e', (idxTau>coolStartIdx? (t[idxTau]-t[coolStartIdx]):null), 'tau9010', tau9010, '→ tauOff', tauOff);
            }
        } catch(_){ /* no-op */ }

        // 6) Last-resort: non-null conservative estimate = duration of observed decay window
        if (tauOff == null) {
            const dur = Math.max(0, t[t.length-1] - t[coolStartIdx]);
            tauOff = dur > 0 ? dur : null;
            if (tauOff != null) tauOffMethod = 'window';
        }

        // Tau OFF quality heuristics
        const recDur = Math.max(0, t[t.length-1] - t[coolStartIdx]);
        if (recDur < 25) {
            q.tauOff.level = 'bad';
            q.tauOff.reasons.push('recovery-too-short');
        }
        if (tauOffMethod === 'window') {
            q.tauOff.level = 'bad';
            q.tauOff.reasons.push('tauOff-fallback-window');
        }
        if (!Number.isFinite(tauOff) || tauOff == null || tauOff <= 0) {
            q.tauOff.level = 'bad';
            q.tauOff.reasons.push('tauOff-invalid');
        } else if (tauOff > 240) {
            q.tauOff.level = (q.tauOff.level === 'good') ? 'ok' : q.tauOff.level;
            q.tauOff.reasons.push('tauOff-very-slow');
        }
    }
    // Markers for overlays/debugging
    const markers = {
        onset: Number.isFinite(onset) && onset >= 0 ? t[onset] : undefined,
        peak: Number.isFinite(peakIdx) && peakIdx >= 0 ? t[peakIdx] : undefined,
        coolStart: Number.isFinite(coolStartIdx) && coolStartIdx >= 0 ? t[coolStartIdx] : undefined,
        tau1e: (idxTau > coolStartIdx && idxTau >= 0) ? t[idxTau] : undefined,
        t90: (i90 > coolStartIdx && i90 >= 0) ? t[i90] : undefined,
        t10: (i10 > coolStartIdx && i10 >= 0) ? t[i10] : undefined
    };
    // Overall quality: bad if either component bad
    const levels = [q.tauOn.level, q.tauOff.level];
    if (levels.includes('bad')) q.overall.level = 'bad';
    else if (levels.includes('ok')) q.overall.level = 'ok';
    q.overall.reasons = [...q.tauOn.reasons, ...q.tauOff.reasons];
    return { tauOn, tauOff, markers, quality: q, tauOffMethod };
}

// Downsample a (time,value) series to maxN points uniformly in time using interpolation.
function downsampleUniformTime(Y, X, maxN) {
    if (!Array.isArray(Y) || !Array.isArray(X) || Y.length !== X.length) return { Y, X };
    const n = Y.length;
    if (n <= maxN) return { Y: Y.slice(), X: X.slice() };
    const x0 = X[0], x1 = X[n - 1];
    if (!(x1 > x0)) return { Y: Y.slice(0, maxN), X: X.slice(0, maxN) };
    const outX = new Array(maxN);
    const outY = new Array(maxN);
    const step = (x1 - x0) / (maxN - 1);
    for (let i = 0; i < maxN; i++) {
        const xi = x0 + i * step;
        outX[i] = xi;
        outY[i] = interpAt(X, Y, xi);
    }
    return { Y: outY, X: outX };
}

/**
 * Estimate effort adequacy (RPE, HR peak vs expected)
 * @param {Object} settings - simulation settings
 * @param {Array<number>} real - real HR values
 * @returns {string} Recommendation
 */
function estimateEffort(settings, real) {
    const hrRest = Number.isFinite(settings?.hrRest) ? settings.hrRest : 55;
    const hrMax = Number.isFinite(settings?.hrMax) ? settings.hrMax : 185;
    // Prefer explicit expected peak from model/theoretical if provided
    const expectedPeak = Number.isFinite(settings?.expectedPeak)
        ? settings.expectedPeak
        : (hrRest + (settings?.effortFrac || 0.8) * (hrMax - hrRest));
    const observedPeak = (Array.isArray(real) && real.length) ? Math.max(...real) : NaN;
    if (!Number.isFinite(observedPeak)) return { code: 'na', expectedPeak, observedPeak };
    if (observedPeak < expectedPeak - 8) return { code: 'low', expectedPeak, observedPeak };
    if (observedPeak > expectedPeak + 8) return { code: 'high', expectedPeak, observedPeak };
    return { code: 'ok', expectedPeak, observedPeak };
}

/**
 * Estimate age adequacy
 * @param {number} age
 * @param {Array<number>} real
 * @returns {string} Recommendation
 */
function estimateAgeAdequacy(age, real) {
    const pred = 220 - age;
    const maxHR = (Array.isArray(real) && real.length) ? Math.max(...real) : NaN;
    if (!Number.isFinite(maxHR)) return { code: 'na', pred, maxHR };
    if (maxHR < pred - 15) return { code: 'low', pred, maxHR };
    if (maxHR > pred + 15) return { code: 'high', pred, maxHR };
    return { code: 'ok', pred, maxHR };
}

/**
 * Generate advanced summary of condition and recommendations
 * @param {Object} params - { age, theoretical, real, settings, i18n = {} }
 * @returns {Object} Summary text and metrics
 */
function generateSummary(params) {
    let { age, theoretical, real, settings, i18n = {} } = params; // let-bind so we can safely reassign
    const lang = (params && params.lang)
        || (typeof document !== 'undefined' && document.documentElement && document.documentElement.lang)
        || (typeof window !== 'undefined' && window.LANG)
        || 'en';
    // User intent: only do HRmax fitting when explicitly requested.
    const fitHrMax = !!(settings && settings.fitHrMax);
    // Detect availability
    const hasTheo = Array.isArray(theoretical) && theoretical.length >= 2;
    const hasReal = Array.isArray(real) && real.length >= 2;

    // --- Prepare time bases ---
    let theoreticalTime = (settings && Array.isArray(settings.t) && hasTheo && settings.t.length === theoretical.length) ? settings.t : null;
    const realTimeProvided = (settings && Array.isArray(settings.realTime) && hasReal && settings.realTime.length === real.length);
    let realTime = realTimeProvided ? settings.realTime : null;
    const realTimeIsSynthetic = !realTimeProvided;
    // Fallback to 1 Hz only when a series exists and no explicit time is provided
    if (!theoreticalTime && hasTheo) theoreticalTime = Array.from({length: theoretical.length}, (_,i)=>i);
    if (!realTime && hasReal) realTime = Array.from({length: real.length}, (_,i)=>i);

    // Preserve raw series/time bases BEFORE any overlap resampling (critical for lag + HRmax fit honesty).
    const theoRaw0 = (settings && Array.isArray(settings._theoreticalRaw) && hasTheo && settings._theoreticalRaw.length === theoretical.length)
        ? settings._theoreticalRaw.slice()
        : (hasTheo ? theoretical.slice() : []);
    const theoTimeRaw0 = (settings && Array.isArray(settings._theoreticalRawTime) && hasTheo && settings._theoreticalRawTime.length === theoretical.length)
        ? settings._theoreticalRawTime.slice()
        : (Array.isArray(theoreticalTime) ? theoreticalTime.slice() : null);
    const realRaw0 = (settings && Array.isArray(settings._realRaw) && hasReal && settings._realRaw.length === real.length)
        ? settings._realRaw.slice()
        : (hasReal ? real.slice() : []);
    const realTimeRaw0 = (settings && Array.isArray(settings._realRawTime) && hasReal && settings._realRawTime.length === real.length)
        ? settings._realRawTime.slice()
        : (Array.isArray(realTime) ? realTime.slice() : null);
    // Export raw bases for callers that didn't provide them.
    try {
        if (settings && !settings._theoreticalRaw && theoRaw0.length) settings._theoreticalRaw = theoRaw0.slice();
        if (settings && !settings._theoreticalRawTime && Array.isArray(theoTimeRaw0)) settings._theoreticalRawTime = theoTimeRaw0.slice();
        if (settings && !settings._realRaw && realRaw0.length) settings._realRaw = realRaw0.slice();
        if (settings && !settings._realRawTime && Array.isArray(realTimeRaw0)) settings._realRawTime = realTimeRaw0.slice();
    } catch(_){ /* ignore */ }

    // --- Imported HR data quality (assessed on original imported time base when available) ---
    const quality = (!realTimeIsSynthetic && hasReal && Array.isArray(realTimeRaw0) && realTimeRaw0.length === realRaw0.length)
        ? assessHrSeriesQuality(realRaw0, realTimeRaw0)
        : { level: 'na', score: 0, reasons: ['no-time'], n: (hasReal ? real.length : 0) };

    // --- If both series exist with time, restrict to overlap and align via interpolation ---
    if (hasTheo && hasReal && Array.isArray(theoreticalTime) && Array.isArray(realTime)) {
        const start = Math.max(theoreticalTime[0], realTime[0]);
        const end = Math.min(theoreticalTime[theoreticalTime.length - 1], realTime[realTime.length - 1]);
        if (end > start) {
            const restrictedTheoretical = [];
            const restrictedTheoreticalTime = [];
            for (let i = 0; i < theoreticalTime.length; i++) {
                const tt = theoreticalTime[i];
                if (tt >= start && tt <= end) { restrictedTheoretical.push(theoretical[i]); restrictedTheoreticalTime.push(tt); }
            }
            const restrictedReal = restrictedTheoreticalTime.map((tt) => interpAt(realTime, real, tt));
            theoretical = restrictedTheoretical;
            real = restrictedReal;
            settings.t = restrictedTheoreticalTime;
            theoreticalTime = restrictedTheoreticalTime;
            // IMPORTANT: real array now sampled at theoretical time points; replace realTime for alignment & calibration
            realTime = restrictedTheoreticalTime.slice();
        }
    }

    // Compute metrics conditionally (naive, no-lag)
    let similarity = (hasTheo && hasReal && theoretical.length === real.length) ? calculateChartSimilarity(theoretical, real) : null;
    // Best-lag optimization: search a small window of lags to maximize correlation.
    // IMPORTANT: use raw series/time bases (pre-resample) so lag estimation is not distorted.
    let bestLag = 0, bestSim = similarity;
    let lagStats = null; // { level, bestCorr, secondCorr, deltaCorr, widthSec, maxLag, win }
    if (hasTheo && hasReal && Array.isArray(theoTimeRaw0) && Array.isArray(realTimeRaw0)) {
        // Ensure we have raw arrays sampled on their own time bases
        const theoRaw = theoRaw0.slice();
        const Traw = theoTimeRaw0.slice();
        const realRaw = realRaw0.slice();
        const RrawT = realTimeRaw0.slice();

        // Restrict both to the overlap window to avoid edge effects
        const start = Math.max(Traw[0], RrawT[0]);
        const end = Math.min(Traw[Traw.length - 1], RrawT[RrawT.length - 1]);
        if (!(end > start)) {
            // no overlap; keep bestLag=0
        } else {
            const theoY = [], theoX = [];
            for (let i = 0; i < Traw.length; i++) {
                const tt = Traw[i];
                if (tt >= start && tt <= end) { theoX.push(tt); theoY.push(theoRaw[i]); }
            }
            const realY = [], realX = [];
            for (let i = 0; i < RrawT.length; i++) {
                const tt = RrawT[i];
                if (tt >= start && tt <= end) { realX.push(tt); realY.push(realRaw[i]); }
            }
            const dsTheo = downsampleUniformTime(theoY, theoX, 4000);
            const dsReal = downsampleUniformTime(realY, realX, 12000);
            const theoUse = dsTheo.Y, tUse = dsTheo.X;
            const realUse = dsReal.Y, rtUse = dsReal.X;
            // Define lag window based on duration: up to ±10% of overlap, capped at ±120s
            const duration = Math.max(0, Math.min(tUse[tUse.length-1], rtUse[rtUse.length-1]) - Math.max(tUse[0], rtUse[0]));
            const maxLag = Math.min(120, Math.max(10, Math.round(duration * 0.1)));
            const step = 1; // seconds
            const sims = [];
            for (let lag = -maxLag; lag <= maxLag; lag += step) {
                const sim = similarityAtLag(theoUse, tUse, realUse, rtUse, lag);
                if (sim && Number.isFinite(sim.corr)) {
                    sims.push({ lag, corr: sim.corr });
                    if (!bestSim || !Number.isFinite(bestSim.corr) || sim.corr > bestSim.corr) {
                        bestSim = sim; bestLag = lag;
                    }
                }
            }
            if (sims.length) {
                sims.sort((a,b)=>b.corr-a.corr);
                const bestCorr = sims[0].corr;
                const secondCorr = (sims.length >= 2) ? sims[1].corr : NaN;
                const deltaCorr = (Number.isFinite(secondCorr) ? (bestCorr - secondCorr) : NaN);
                // Peak width within 0.01 corr of max (flat peak => ambiguous lag)
                const tol = 0.01;
                let minLag = sims[0].lag;
                let maxLagNear = sims[0].lag;
                for (const s of sims) {
                    if (s.corr >= bestCorr - tol) {
                        if (s.lag < minLag) minLag = s.lag;
                        if (s.lag > maxLagNear) maxLagNear = s.lag;
                    } else {
                        break;
                    }
                }
                const widthSec = Math.max(0, maxLagNear - minLag);
                // Local consistency diagnostic at the best lag.
                const win = windowedCorrStatsAtLag(theoUse, tUse, realUse, rtUse, bestLag, 30, 10);

                let level = 'ok';
                if (!Number.isFinite(bestCorr) || bestCorr < 0.75) level = 'low';
                if (Number.isFinite(deltaCorr) && deltaCorr < 0.01) level = 'low';
                if (Number.isFinite(widthSec) && widthSec > 18) level = 'low';
                // Degrade confidence if local windows disagree (do not promote based on this).
                if (win && (win.fracGood < 0.50 || win.p10Corr < 0.50) && bestCorr >= 0.80) level = 'low';
                if (Number.isFinite(deltaCorr) && deltaCorr >= 0.03 && Number.isFinite(widthSec) && widthSec <= 8 && bestCorr >= 0.88) level = 'high';
                lagStats = { level, bestCorr, secondCorr, deltaCorr, widthSec, maxLag, win };
            }
        }
    }
    const tauSim = hasTheo && Array.isArray(theoreticalTime) ? estimateTau(theoretical, theoreticalTime) : {};
    let tauReal = {};
    if (hasReal) {
        // Prefer raw imported time base when available.
        if (Array.isArray(realTimeRaw0) && realTimeRaw0.length === realRaw0.length) tauReal = estimateTau(realRaw0, realTimeRaw0);
        else if (hasTheo && Array.isArray(theoreticalTime)) tauReal = estimateTau(real, theoreticalTime);
        else if (Array.isArray(realTime)) tauReal = estimateTau(real, realTime);
    }
    // Predicted/observed peaks (based on aligned arrays after overlap restriction)
    const predictedPeakHR = hasTheo && theoretical.length ? Math.round(Math.max(...theoretical)) : null;
    const observedPeakHR = hasReal && real.length ? Math.round(Math.max(...real)) : null;
    // Only compute maxHR using real when present
    const sportLevel = (settings && settings.sportLevel) || 'general';
    const maxHR = hasReal ? estimateMaxHR(age, real, sportLevel) : { predictedMaxHR: predictedMaxHRFromAge(age, sportLevel), observedMaxHR: null, recommendation: null };
    // Keep legacy tauRec empty; use localized Meaning/Recommendations blocks instead.
    let tauRec = '';
    // Will be computed after HRmax calibration (hrMaxCal) is available.
    let effortRec = null;
    let ageRec = null;
    // Qualitative labels and localized strings
    const isRu = (lang === 'ru');
    const L = {
        hdr: isRu ? 'Оценка состояния' : 'Condition estimate',
        metrics: isRu ? 'Показатели' : 'Metrics',
    overlap: isRu ? 'Окно сравнения' : 'Overlap window',
    duration: isRu ? 'Длительность' : 'Duration',
        rmse: isRu ? 'RMSE (среднекв. ошибка)' : 'RMSE (root mean square error)',
        corr: isRu ? 'Корреляция' : 'Correlation',
        corrQual: (c) => {
            if (!Number.isFinite(c)) return isRu? 'н/д' : 'n/a';
            if (c >= 0.95) return isRu? 'отлично' : 'excellent';
            if (c >= 0.90) return isRu? 'очень хорошо' : 'very good';
            if (c >= 0.80) return isRu? 'хорошо' : 'good';
            if (c >= 0.65) return isRu? 'средне' : 'fair';
            return isRu? 'слабо' : 'low';
        },
    predObs: isRu ? 'Оценочный HRmax по возрасту: {pred}, наблюдаемый макс. HR: {obs}' : 'Age-estimated HRmax: {pred}, observed max HR: {obs}',
    predOnly: isRu ? 'Оценочный HRmax по возрасту: {pred}' : 'Age-estimated HRmax: {pred}',
    predPeakObs: isRu ? 'Пик модели: {pred}, наблюдаемый пик: {obs}' : 'Model peak HR: {pred}, observed peak HR: {obs}',
    predPeakOnly: isRu ? 'Пик модели: {pred}' : 'Model peak HR: {pred}',
        tauOn: isRu ? 'τ_ON (реакция)' : 'τ_ON (rise)',
        tauOff: isRu ? 'τ_OFF (восстановление)' : 'τ_OFF (recovery)',
        effort: isRu ? 'Усилие' : 'Effort',
        effortOkText: isRu ? 'Усилие соответствует ожидаемому.' : 'Effort matches expected.',
        effortLowText: isRu ? 'Усилие ниже ожидаемого.' : 'Effort is below expected.',
        effortHighText: isRu ? 'Усилие выше ожидаемого.' : 'Effort exceeds expected.',
        whatMeans: isRu ? 'Что это значит?' : 'What this means',
        recs: isRu ? 'Рекомендации' : 'Recommendations',
        agreementGood: isRu ? 'Кривые согласуются с моделью.' : 'Curves are in good agreement with the model.',
        agreementModerate: isRu ? 'Согласование среднее — оценка ориентировочная.' : 'Agreement is moderate — treat estimates cautiously.',
        agreementLow: isRu ? 'Согласование низкое — надёжное сравнение невозможно.' : 'Agreement is low — reliable comparison is not possible.',
        checkAdvice: isRu ? 'Проверьте сдвиг импорта, выбранную модель и качество данных.' : 'Check import offset, chosen model, and data quality.',
        slowerOn: isRu ? 'Подъём ЧСС медленнее модели → возможна усталость; уменьшите интенсивность или объём.' : 'HR rise is slower than model → possible fatigue; reduce intensity/volume.',
        slowerOff: isRu ? 'Восстановление медленное → добавьте отдых, снизьте интенсивность, больше аэробной базы.' : 'Recovery is slow → add rest, lower intensity, more aerobic base.',
        effortLow: isRu ? 'Усилие ниже ожидаемого → чуть повысить интенсивность или сократить отдых.' : 'Effort below expected → increase intensity slightly or shorten rest.',
        effortHigh: isRu ? 'Усилие выше ожидаемого → снизьте интенсивность или увеличьте отдых.' : 'Effort above expected → reduce intensity or increase rest.',
        maxLow: isRu ? 'Макс. пульс заметно ниже типичного для возраста → проверьте устройство или самочувствие.' : 'Max HR well below age-typical → check device or health.',
        maxHigh: isRu ? 'Макс. пульс необычно высок → проверьте устройство; при сомнениях — к специалисту.' : 'Max HR unusually high → check device; consult a specialist if unsure.',
        hrMaxMismatch: isRu
            ? 'Внимание: указанный HRmax заметно отличается от калиброванного по данным. Проверьте HRmax в настройках и качество импорта (сдвиг/обрезка/ошибки датчика).' 
            : 'Note: user-set HRmax differs substantially from the data-fitted HRmax. Recheck HRmax settings and import quality (offset/trim/sensor artifacts).',
        hrMaxMismatchShort: isRu
            ? 'Указанный HRmax сильно расходится с подгонкой' 
            : 'User HRmax differs from fit',
        hrMaxFitWeak: isRu
            ? 'Подгонка HRmax слабо определена' 
            : 'HRmax fit is weakly identifiable',
        hrMaxFitWeakHint: isRu
            ? 'Слишком мало данных вблизи максимума: HRmax сильно зависит от формы (τ_ON/τ_OFF) и почти не фиксируется по этому импорту.'
            : 'Too little data near max: HRmax depends strongly on shape (τ_ON/τ_OFF) and is not constrained by this import.',
        hrMaxEvidence: isRu ? 'Данные импорта (HRmax)' : 'Import evidence (HRmax)',
        hrMaxEvidenceLine: isRu
            ? 'Пик: {peak} bpm; ≥90%: {t90}s; ≥95%: {t95}s'
            : 'Peak: {peak} bpm; ≥90%: {t90}s; ≥95%: {t95}s',
        hrMaxNotConstrained: isRu
            ? 'Эта тренировка почти не фиксирует HRmax (нет достаточного времени вблизи максимума).'
            : 'This session does not meaningfully constrain HRmax (insufficient time near max).',
        dataQuality: isRu ? 'Качество данных' : 'Data quality',
        dataQualityGood: isRu ? 'Хорошее' : 'Good',
        dataQualityOk: isRu ? 'Среднее' : 'OK',
        dataQualityBad: isRu ? 'Плохое' : 'Poor',
        dataQualityAdvice: isRu
            ? 'Импорт содержит артефакты (скачки/пропуски/вне диапазона/нефизиологичная скорость изменения). Подгонка HRmax и оценка τ могут быть ненадёжны. Проверьте датчик и параметры импорта (сдвиг/обрезка/сглаживание/экспорт).'
            : 'Import contains artifacts (spikes/gaps/out-of-range/unrealistic change rate). HRmax fit and τ estimates may be unreliable. Check sensor and import settings (offset/trim/smoothing/export).',

        lagConfidence: isRu ? 'Надёжность лага' : 'Lag confidence',
        lagConfHigh: isRu ? 'Высокая' : 'High',
        lagConfOk: isRu ? 'Средняя' : 'OK',
        lagConfLow: isRu ? 'Низкая' : 'Low',
        lagWindowed: isRu ? 'Оконная корреляция' : 'Windowed correlation',
        lagScan: isRu ? 'Диагностика лага' : 'Lag scan',
        keyPoints: isRu ? 'Коротко' : 'Key points',
        details: isRu ? 'Подробности' : 'Details',
        detailsHint: isRu ? 'цифры и диагностика' : 'numbers & diagnostics',
        keyMatch: isRu ? 'Совпадение с моделью' : 'Model match',
        keyLag: isRu ? 'Сдвиг (лаг)' : 'Offset (lag)',
        keyData: isRu ? 'Качество импорта' : 'Import quality',
        keyHrMax: isRu ? 'HRmax по этому импорту' : 'HRmax from this import',
        keyHrMaxSource: isRu ? 'HRmax (источник)' : 'HRmax source',
        hrMaxNotConstrainedShort: isRu ? 'не фиксируется' : 'not constrained',
        hrMaxAutoShort: isRu
            ? 'по возрастной формуле (может отличаться)'
            : 'age-based estimate (may differ)',
        hrMaxAutoAdvice: isRu
            ? 'Вы не указали HRmax — сейчас используется формула по возрасту. Реальный HRmax может отличаться на 10–20+ уд/мин и заметно влиять на зоны и расчёт нагрузки. Рекомендуется определить свой HRmax (тест/соревнование/максимум по тренировкам).'
            : 'You didn\'t enter HRmax, so an age-based formula is used. Your real HRmax can differ by 10–20+ bpm and significantly affect zones and load calculations. Consider determining your HRmax (test/race/observed training max).',
        lagUncertain: isRu
            ? 'Лаг определяется слабо (плоский максимум корреляции). Сдвиг может быть неоднозначен — не делайте выводов по небольшим различиям.'
            : 'Lag is weakly determined (flat correlation peak). Offset may be ambiguous — avoid over-interpreting small differences.',
        tauUncertain: isRu
            ? 'Оценка τ ненадёжна (недостаточно данных подъёма/восстановления или сильный шум).'
            : 'Tau estimate is unreliable (insufficient rise/recovery data or high noise).'
        ,
        effortUncertain: isRu
            ? 'Оценка «усилия» ограничена: низкое согласование модели с данными, неоднозначный лаг или плохое качество импорта.'
            : 'Effort assessment is limited: low model agreement, ambiguous lag, or poor import quality.'
    };
    const durationSec = (hasTheo && Array.isArray(theoreticalTime) && theoreticalTime.length >= 2)
        ? Math.max(0, Math.round(theoreticalTime[theoreticalTime.length - 1] - theoreticalTime[0]))
        : (hasReal && Array.isArray(realTime) && realTime.length >= 2
            ? Math.max(0, Math.round(realTime[realTime.length - 1] - realTime[0]))
            : 0);
    const overlapSec = (hasTheo && hasReal && Array.isArray(theoreticalTime) && Array.isArray(realTime))
        ? Math.max(0, Math.round(Math.min(theoreticalTime[theoreticalTime.length-1], realTime[realTime.length-1]) - Math.max(theoreticalTime[0], realTime[0])))
        : 0;
    const rmse = (hasTheo && hasReal && similarity && Number.isFinite(similarity.rmse)) ? similarity.rmse : NaN;
    const corr = (hasTheo && hasReal && similarity && Number.isFinite(similarity.corr)) ? similarity.corr : NaN;
    const corrBest = (hasTheo && hasReal && bestSim && Number.isFinite(bestSim.corr)) ? bestSim.corr : NaN;
    const bestLagStr = Number.isFinite(corrBest) && Number.isFinite(corr) && (corrBest > corr + 0.02)
        ? ( (bestLag>0?'+':'') + bestLag + ' s' )
        : null;
    const bestLagDiagStr = Number.isFinite(bestLag)
        ? ((bestLag > 0 ? '+' : '') + bestLag + ' s')
        : null;
    const tauRealLevel = (tauReal && tauReal.quality && tauReal.quality.overall && tauReal.quality.overall.level)
        ? tauReal.quality.overall.level
        : null;
    const tauWarn = (hasReal && tauRealLevel === 'bad') ? (isRu ? ' (сомн.)' : ' (uncertain)') : '';
    const tauOnStr = (hasReal && tauReal.tauOn != null)
        ? (Math.round(tauReal.tauOn) + tauWarn)
        : ((hasReal || !hasTheo) ? (isRu? 'н/д':'n/a') : (tauSim.tauOn!=null? Math.round(tauSim.tauOn):(isRu?'н/д':'n/a')));
    const tauOffStr = (hasReal && tauReal.tauOff != null)
        ? (Math.round(tauReal.tauOff) + tauWarn)
        : ((hasReal || !hasTheo) ? (isRu? 'н/д':'n/a') : (tauSim.tauOff!=null? Math.round(tauSim.tauOff):(isRu?'н/д':'n/a')));

    // --- Confidence gating to avoid misleading recommendations ---
    const lagOk = !(lagStats && lagStats.level === 'low');
    const dataOk = !(quality && quality.level === 'bad');
    const tauOk = !(hasReal && tauRealLevel === 'bad');
    const corrEffective = (Number.isFinite(corrBest) && bestLagStr && lagOk) ? corrBest : corr;
    const modelAgreement = hasTheo && hasReal && Number.isFinite(corrEffective) && corrEffective >= 0.75;
    const highAgreement = hasTheo && hasReal && Number.isFinite(corrEffective) && corrEffective >= 0.90;

    // --- HRmax calibration (only when requested) ---
    let hrMaxCal = null, hrMaxCalRmse = null, hrMaxCalLag = null, hrMaxCalRange = null;
    let hrMaxCalWeak = false;
    let hrMaxCalWeakHint = null;
    let hrMaxEvidence = null; // { peak, t90, t95, thr90, thr95, refHrMax }
    let hrMaxCalUnreliable = false;
    // IMPORTANT: prefer raw bases (pre-overlap interpolation) to keep calibration honest.
    const Tbase = (Array.isArray(theoTimeRaw0) && theoTimeRaw0.length === theoRaw0.length) ? theoTimeRaw0 : (Array.isArray(theoreticalTime) ? theoreticalTime : null);
    const theoBaseY = (Tbase === theoTimeRaw0) ? theoRaw0 : theoretical;
    const Rbase = (Array.isArray(realTimeRaw0) && realTimeRaw0.length === realRaw0.length) ? realTimeRaw0 : (Array.isArray(realTime) ? realTime : null);
    const realBaseY = (Rbase === realTimeRaw0) ? realRaw0 : real;

    if (fitHrMax && hasTheo && hasReal && Array.isArray(Tbase) && Array.isArray(Rbase) && Array.isArray(theoBaseY) && Array.isArray(realBaseY)) {
        if (quality && quality.level === 'bad') hrMaxCalUnreliable = true;
        const baseHrMax = Number.isFinite(settings?.hrMax) ? settings.hrMax : predictedMaxHRFromAge(age, sportLevel);

        // Restrict to overlap window to avoid edge artifacts
        const start = Math.max(Tbase[0], Rbase[0]);
        const end = Math.min(Tbase[Tbase.length - 1], Rbase[Rbase.length - 1]);
        if (end > start) {
            const theoY = [], theoX = [];
            for (let i = 0; i < Tbase.length; i++) {
                const tt = Tbase[i];
                if (tt >= start && tt <= end) { theoX.push(tt); theoY.push(theoBaseY[i]); }
            }
            const realY = [], realX = [];
            for (let i = 0; i < Rbase.length; i++) {
                const tt = Rbase[i];
                if (tt >= start && tt <= end) { realX.push(tt); realY.push(realBaseY[i]); }
            }
            const dsTheo = downsampleUniformTime(theoY, theoX, 2500);
            const dsReal = downsampleUniformTime(realY, realX, 12000);
            const cal = calibrateHrMaxRMSE({ theoretical: dsTheo.Y, T: dsTheo.X, real: dsReal.Y, RT: dsReal.X, hrRest: settings?.hrRest, hrMaxOrig: baseHrMax, age, sportLevel, bestLagGuessSec: bestLag });
            if (cal && Number.isFinite(cal.hrMax)) {
                hrMaxCal = Math.round(cal.hrMax);
                hrMaxCalRmse = cal.rmse;
                hrMaxCalLag = cal.lag;
                hrMaxCalRange = (Number.isFinite(cal.lo) && Number.isFinite(cal.hi) && cal.hi > cal.lo) ? [Math.round(cal.lo), Math.round(cal.hi)] : null;
                // Evidence-from-import computed relative to reference HRmax used for calibration window (baseHrMax)
                hrMaxEvidence = {
                    peak: (Array.isArray(realY) && realY.length) ? Math.round(Math.max(...realY)) : null,
                    t90: Number.isFinite(cal.nearMaxSec90) ? Math.round(cal.nearMaxSec90) : null,
                    t95: Number.isFinite(cal.nearMaxSec95) ? Math.round(cal.nearMaxSec95) : null,
                    thr90: Number.isFinite(cal.nearMaxThr90) ? Math.round(cal.nearMaxThr90) : null,
                    thr95: Number.isFinite(cal.nearMaxThr95) ? Math.round(cal.nearMaxThr95) : null,
                    refHrMax: Number.isFinite(baseHrMax) ? Math.round(baseHrMax) : null
                };
                // Mark weak/underconstrained fits (this is where HRmax becomes overly sensitive to τ_ON/τ_OFF).
                const width = Number.isFinite(cal.width) ? cal.width : (hrMaxCalRange ? (hrMaxCalRange[1] - hrMaxCalRange[0]) : NaN);
                const flatValley = Number.isFinite(width) && width >= 12;
                const lowGain = Number.isFinite(cal.rmseGain) && cal.rmseGain < 0.4;
                const notIdent = cal.identifiable === false;
                if (notIdent || flatValley) {
                    hrMaxCalWeak = true;
                    hrMaxCalWeakHint = L.hrMaxFitWeakHint;
                }
                if (notIdent || flatValley || lowGain) {
                    hrMaxCalUnreliable = true;
                }
            }
        }
    }

    // --- Effort & age recommendations (need hrMaxCal to avoid contradictions) ---
    // Use model-derived expected peak for effort adequacy when available.
    // IMPORTANT: if user-entered HRmax is wrong but we calibrated HRmax from real data,
    // anchor expected peak to the calibrated HRmax to avoid contradictory advice.
    {
        const effSettings = Object.assign({}, settings || {});
        let expectedPeakForEffort = predictedPeakHR;
        if (fitHrMax && hasTheo && Number.isFinite(hrMaxCal) && !hrMaxCalUnreliable && Number.isFinite(settings?.hrRest)) {
            const hrMaxOrig = Number.isFinite(settings?.hrMax)
                ? Number(settings.hrMax)
                : predictedMaxHRFromAge(age, sportLevel);
            // Only adjust when there's a meaningful mismatch.
            if (Number.isFinite(hrMaxOrig) && Math.abs(hrMaxCal - hrMaxOrig) >= 4) {
                const scaledTheo = rescaleTheoForHrMax(theoretical, Number(settings.hrRest), hrMaxOrig, hrMaxCal);
                if (Array.isArray(scaledTheo) && scaledTheo.length) {
                    const peakCal = Math.round(Math.max(...scaledTheo));
                    if (Number.isFinite(peakCal)) expectedPeakForEffort = peakCal;
                }
            }
        }
        if (Number.isFinite(expectedPeakForEffort)) effSettings.expectedPeak = expectedPeakForEffort;
        // Only compute effort when the model can reasonably be compared to the import.
        effortRec = (hasReal && modelAgreement && lagOk && dataOk) ? estimateEffort(effSettings, real) : null;
        ageRec = (hasReal && dataOk) ? (function(){
            // reuse age adequacy with the selected formula as a baseline window
            const pred = predictedMaxHRFromAge(age, sportLevel);
            const max = (Array.isArray(real) && real.length) ? Math.max(...real) : NaN;
            if (!Number.isFinite(max)) return { code: 'na', pred, maxHR: max };
            if (max < pred - 15) return { code: 'low', pred, maxHR: max };
            if (max > pred + 15) return { code: 'high', pred, maxHR: max };
            return { code: 'ok', pred, maxHR: max };
        })() : null;
    }

    // --- Key points (simple-first UX) ---
    const matchKey = (hasTheo && hasReal && Number.isFinite(corrEffective)) ? L.corrQual(corrEffective) : (isRu ? 'н/д' : 'n/a');
    let lagKey = isRu ? 'н/д' : 'n/a';
    if (lagStats && lagStats.level) {
        lagKey = (lagStats.level === 'high') ? L.lagConfHigh : (lagStats.level === 'low' ? L.lagConfLow : L.lagConfOk);
        if (lagStats.level === 'low') lagKey += isRu ? ' (неоднозначен)' : ' (ambiguous)';
    }
    let dataKey = isRu ? 'н/д' : 'n/a';
    if (hasReal && quality && quality.level && quality.level !== 'na') {
        dataKey = (quality.level === 'good') ? L.dataQualityGood : (quality.level === 'ok' ? L.dataQualityOk : L.dataQualityBad);
    }
    const hrMaxNotConstrained = !!(
        fitHrMax && hrMaxEvidence && Number.isFinite(hrMaxEvidence.t90) && Number.isFinite(hrMaxEvidence.t95)
        && (hrMaxEvidence.t90 < 8 && hrMaxEvidence.t95 < 4)
    );

    // HRmax source warning: only when the input was left empty and we're using an age-based estimate.
    const hrMaxUserProvided = !!(settings && settings.hrMaxUserProvided);
    const hrMaxUser = Number.isFinite(settings?.hrMaxUser) ? Number(settings.hrMaxUser) : null;
    const hrMaxAuto = !hrMaxUserProvided;
    const hrMaxAutoWarn = hrMaxAuto && Number.isFinite(age) && Number.isFinite(predictedMaxHRFromAge(age, sportLevel));

    // Build HTML summary
    const lines = [];
    lines.push(`<h3 style="margin:0 0 6px 0">${L.hdr}</h3>`);
    lines.push('<div style="opacity:.85">');

    // Simple-first block
    lines.push(`<div><b>${L.keyPoints}:</b></div>`);
    lines.push('<ul style="margin:6px 0 10px 18px">');
    if (hasTheo && hasReal) lines.push(`<li>${L.keyMatch}: <b>${matchKey}</b></li>`);
    if (hasTheo && hasReal && lagStats) lines.push(`<li>${L.keyLag}: <b>${lagKey}</b></li>`);
    if (hasReal && quality && quality.level && quality.level !== 'na') lines.push(`<li>${L.keyData}: <b>${dataKey}</b></li>`);
    if (hasReal && hrMaxNotConstrained) lines.push(`<li>${L.keyHrMax}: <b>${L.hrMaxNotConstrainedShort}</b></li>`);
    if (hrMaxAutoWarn) lines.push(`<li>${L.keyHrMaxSource}: <b>${L.hrMaxAutoShort}</b></li>`);
    lines.push('</ul>');

    // Details (keep full transparency, but avoid scaring users)
    lines.push(`<details style="margin-top:6px">`);
    lines.push(`<summary style="cursor:pointer; user-select:none"><b>${L.details}</b> <span style="opacity:.7">(${L.detailsHint})</span></summary>`);
    lines.push('<div style="margin-top:6px">');
    lines.push(`<div><b>${L.metrics}:</b></div>`);
    lines.push('<ul style="margin:6px 0 10px 18px">');
    // If user provided HRmax and it differs from age-estimate, show both
    const userHRmax = Number.isFinite(hrMaxUser) ? hrMaxUser : null;
    const ageEstHRmax = Number.isFinite(age) ? predictedMaxHRFromAge(age, sportLevel) : null;
    const hrMaxMismatchDelta = (Number.isFinite(userHRmax) && Number.isFinite(hrMaxCal)) ? (hrMaxCal - userHRmax) : null;
    const HRMAX_MISMATCH_WARN = 8; // bpm threshold for explicit warning
    const formulaShort = (function(){
        if (sportLevel === 'tanaka') return isRu ? 'Танака' : 'Tanaka';
        if (sportLevel === 'gellish') return isRu ? 'Геллиш' : 'Gellish';
        return isRu ? 'Фокс' : 'Fox';
    })();
    if (hasTheo && hasReal) {
        lines.push(`<li>${L.overlap}: ${overlapSec} s</li>`);
        if (Number.isFinite(rmse)) lines.push(`<li>${L.rmse}: ${rmse.toFixed(1)} bpm</li>`);
        if (Number.isFinite(corr)) {
            if (Number.isFinite(corrBest) && bestLagStr) {
                const lagConfTxt = lagStats
                    ? `; ${L.lagConfidence}: ${(lagStats.level==='high')?L.lagConfHigh:(lagStats.level==='low'?L.lagConfLow:L.lagConfOk)}`
                    : '';
                lines.push(`<li>${L.corr}: ${corr.toFixed(2)} → ${corrBest.toFixed(2)} (${L.corrQual(corrBest)}) ${isRu ? 'после сдвига' : 'with lag'} ${bestLagStr}${lagConfTxt}</li>`);
                const win = lagStats && lagStats.win;
                if (win && Number.isFinite(win.medianCorr) && Number.isFinite(win.p10Corr) && Number.isFinite(win.fracOk) && Number.isFinite(win.fracGood)) {
                    const pctOk = Math.round(win.fracOk * 100);
                    const pctGood = Math.round(win.fracGood * 100);
                    lines.push(`<li>${L.lagWindowed}: med ${win.medianCorr.toFixed(2)}, p10 ${win.p10Corr.toFixed(2)}, ≥0.60 ${pctOk}%, ≥0.80 ${pctGood}% (n=${win.nWin}, ${win.winSec}s/${win.stepSec}s)</li>`);
                }
            } else {
                lines.push(`<li>${L.corr}: ${corr.toFixed(2)} (${L.corrQual(corr)})</li>`);
                // Still show lag diagnostics in flat-peak cases (when corrBest doesn't exceed corr by threshold).
                if (lagStats && bestLagDiagStr && Number.isFinite(lagStats.bestCorr)) {
                    const lagConfTxt = `; ${L.lagConfidence}: ${(lagStats.level==='high')?L.lagConfHigh:(lagStats.level==='low'?L.lagConfLow:L.lagConfOk)}`;
                    const d = Number.isFinite(lagStats.deltaCorr) ? lagStats.deltaCorr : NaN;
                    const w = Number.isFinite(lagStats.widthSec) ? lagStats.widthSec : NaN;
                    const dTxt = Number.isFinite(d) ? `; Δcorr ${d.toFixed(3)}` : '';
                    const wTxt = Number.isFinite(w) ? `; ${isRu ? 'ширина~' : 'width~'}${Math.round(w)}s` : '';
                    lines.push(`<li>${L.lagScan}: best ${bestLagDiagStr}; corr(best) ${lagStats.bestCorr.toFixed(2)}${dTxt}${wTxt}${lagConfTxt}</li>`);
                    const win = lagStats && lagStats.win;
                    if (win && Number.isFinite(win.medianCorr) && Number.isFinite(win.p10Corr) && Number.isFinite(win.fracOk) && Number.isFinite(win.fracGood)) {
                        const pctOk = Math.round(win.fracOk * 100);
                        const pctGood = Math.round(win.fracGood * 100);
                        lines.push(`<li>${L.lagWindowed}: med ${win.medianCorr.toFixed(2)}, p10 ${win.p10Corr.toFixed(2)}, ≥0.60 ${pctOk}%, ≥0.80 ${pctGood}% (n=${win.nWin}, ${win.winSec}s/${win.stepSec}s)</li>`);
                    }
                }
            }
        }
        // Calibrated HRmax (only when requested)
        if (fitHrMax && Number.isFinite(hrMaxCal)) {
            const userHRmax = Number.isFinite(hrMaxUser) ? hrMaxUser : null;
            const ageEstHRmax = Number.isFinite(age) ? predictedMaxHRFromAge(age, sportLevel) : null;
            const dUser = (Number.isFinite(userHRmax) ? (hrMaxCal - userHRmax) : null);
            const dAge = (Number.isFinite(ageEstHRmax) ? (hrMaxCal - ageEstHRmax) : null);
            const deltaUser = (dUser==null) ? '' : `, ${isRu ? 'Δк пользов.' : 'Δ vs user'}: ${dUser>0?'+':''}${Math.round(dUser)} bpm`;
            const deltaAge = (dAge==null) ? '' : `, ${isRu ? 'Δк возрастн.' : 'Δ vs age'}: ${dAge>0?'+':''}${Math.round(dAge)} bpm`;
            const lagTxt = (Number.isFinite(hrMaxCalLag) && Math.abs(hrMaxCalLag) > 0) ? `, ${isRu?'лаг':''} lag ${hrMaxCalLag>0?'+':''}${Math.round(hrMaxCalLag)}s` : '';
            const rng = (hrMaxCalRange && hrMaxCalRange[1] > hrMaxCalRange[0]) ? ` [${hrMaxCalRange[0]}–${hrMaxCalRange[1]}]` : '';
            const unreli = hrMaxCalUnreliable ? (isRu ? ' <span style="color:var(--mid,#f59e0b)">(сомн.)</span>' : ' <span style="color:var(--mid,#f59e0b)">(uncertain)</span>') : '';
            const weak = hrMaxCalWeak ? (isRu ? ` <span style="color:var(--mid,#f59e0b)" title="${hrMaxCalWeakHint}">(${L.hrMaxFitWeak})</span>` : ` <span style="color:var(--mid,#f59e0b)" title="${hrMaxCalWeakHint}">(${L.hrMaxFitWeak})</span>`) : '';
            lines.push(`<li>${isRu ? 'Калиброванный HRmax (подгонка)' : 'Calibrated HRmax (fit)'}: <b>${hrMaxCal}</b> bpm${unreli}${weak}${rng}${deltaUser}${deltaAge}${lagTxt}</li>`);
        }
        // Evidence from import (independent of fit; indicates whether HRmax is actually constrained)
        if (fitHrMax && hrMaxEvidence && Number.isFinite(hrMaxEvidence.peak)) {
            const t90 = Number.isFinite(hrMaxEvidence.t90) ? hrMaxEvidence.t90 : 0;
            const t95 = Number.isFinite(hrMaxEvidence.t95) ? hrMaxEvidence.t95 : 0;
            const evLine = L.hrMaxEvidenceLine
                .replace('{peak}', hrMaxEvidence.peak)
                .replace('{t90}', t90)
                .replace('{t95}', t95);
            const refNote = (Number.isFinite(hrMaxEvidence.refHrMax) && Number.isFinite(hrMaxEvidence.thr90))
                ? ` <span style="opacity:.75">(${isRu ? 'опора' : 'ref'} ${hrMaxEvidence.refHrMax}, ${isRu ? 'порог' : 'thr'}90 ${hrMaxEvidence.thr90})</span>`
                : '';
            lines.push(`<li>${L.hrMaxEvidence}: ${evLine}${refNote}</li>`);
        }
        // Prefer model peak-based comparison when theoretical is present
        if (Number.isFinite(predictedPeakHR) && Number.isFinite(observedPeakHR)) {
            lines.push(`<li>${L.predPeakObs.replace('{pred}', predictedPeakHR).replace('{obs}', observedPeakHR)}</li>`);
        } else {
            lines.push(`<li>${L.predObs.replace('{pred}', maxHR.predictedMaxHR).replace('{obs}', maxHR.observedMaxHR)}</li>`);
        }
        if (fitHrMax && Number.isFinite(userHRmax) && Number.isFinite(ageEstHRmax)) {
            const d = userHRmax - ageEstHRmax;
            const sign = d > 0 ? '+' : '';
            lines.push(`<li>${isRu ? 'Указанный HRmax' : 'User-set HRmax'}: ${Math.round(userHRmax)}; ${isRu ? 'Оценка по возрасту' : 'Age-estimated'} (${formulaShort}): ${ageEstHRmax} (${sign}${Math.round(d)} bpm)</li>`);
        }
        if (fitHrMax && Number.isFinite(hrMaxMismatchDelta) && Math.abs(hrMaxMismatchDelta) >= HRMAX_MISMATCH_WARN) {
            const sign = hrMaxMismatchDelta > 0 ? '+' : '';
            lines.push(`<li><span style="color:var(--bad,#ef4444)"><b>${L.hrMaxMismatchShort}</b></span>: ${isRu ? 'Δподгонка–польз.' : 'Δfit–user'} = ${sign}${Math.round(hrMaxMismatchDelta)} bpm</li>`);
        }
    } else if (hasTheo) {
        lines.push(`<li>${L.duration}: ${durationSec} s</li>`);
        if (Number.isFinite(predictedPeakHR)) lines.push(`<li>${L.predPeakOnly.replace('{pred}', predictedPeakHR)}</li>`);
        else {
            const ageEst = predictedMaxHRFromAge(age, sportLevel);
            lines.push(`<li>${L.predOnly.replace('{pred}', ageEst)}</li>`);
        }
        if (Number.isFinite(userHRmax) && Number.isFinite(ageEstHRmax)) {
            const d = userHRmax - ageEstHRmax;
            const sign = d > 0 ? '+' : '';
            lines.push(`<li>${isRu ? 'Указанный HRmax' : 'User-set HRmax'}: ${Math.round(userHRmax)}; ${isRu ? 'Оценка по возрасту' : 'Age-estimated'} (${formulaShort}): ${ageEstHRmax} (${sign}${Math.round(d)} bpm)</li>`);
        }
    }
    // Imported data quality (show whenever real data exists and realTime is provided)
    if (hasReal && quality && quality.level && quality.level !== 'na') {
        const qLbl = (quality.level === 'good') ? L.dataQualityGood : (quality.level === 'ok' ? L.dataQualityOk : L.dataQualityBad);
        const dtTxt = (quality.dtMedian != null)
            ? `, dt~${quality.dtMedian.toFixed(2)}s${quality.dtP95 != null ? ` (p95 ${quality.dtP95.toFixed(2)}s)` : ''}`
            : '';
        const art = [];
        if (quality.outOfRange) art.push(`${quality.outOfRange} ${isRu ? 'вне 30–230' : 'out-of-range'}`);
        if (quality.spikes) art.push(`${quality.spikes} ${isRu ? 'скачков' : 'spikes'}`);
        if (quality.highDeriv) art.push(`${quality.highDeriv} ${isRu ? 'очень быстрых изменений' : 'high dHR/dt'}`);
        if (quality.gaps10) art.push(`${quality.gaps10} ${isRu ? 'пробелов>10с' : 'gaps>10s'}`);
        const artTxt = art.length ? `, ${art.join(', ')}` : '';
        const color = (quality.level === 'bad') ? 'var(--bad,#ef4444)' : (quality.level === 'ok' ? 'var(--mid,#f59e0b)' : 'var(--good,#22c55e)');
        lines.push(`<li>${L.dataQuality}: <span style="color:${color}"><b>${qLbl}</b></span> (${quality.score}/100, n=${quality.n}${dtTxt}${artTxt})</li>`);
    }
    // Tau row (show simulated tau when only theoretical is present)
    if (hasReal) {
        lines.push(`<li>${L.tauOn}: ${tauOnStr} s; ${L.tauOff}: ${tauOffStr} s</li>`);
    } else if (hasTheo) {
        // Prefer configured model taus from settings when available
        const cfgTauOn = Number.isFinite(settings?.tauOn) ? Math.round(settings.tauOn) : (Number.isFinite(settings?.t_on) ? Math.round(settings.t_on) : null);
        const cfgTauOff = Number.isFinite(settings?.tauOff) ? Math.round(settings.tauOff) : (Number.isFinite(settings?.t_off) ? Math.round(settings.t_off) : null);
        const sTauOn = (cfgTauOn != null) ? cfgTauOn : ((tauSim.tauOn != null) ? Math.round(tauSim.tauOn) : (isRu?'н/д':'n/a'));
        const sTauOff = (cfgTauOff != null) ? cfgTauOff : ((tauSim.tauOff != null) ? Math.round(tauSim.tauOff) : (isRu?'н/д':'n/a'));
        lines.push(`<li>${L.tauOn}: ${sTauOn} s; ${L.tauOff}: ${sTauOff} s</li>`);
    }
    if (hasReal && effortRec && effortRec.code) {
        const txt = effortRec.code === 'ok' ? L.effortOkText : (effortRec.code === 'low' ? L.effortLowText : L.effortHighText);
        lines.push(`<li>${L.effort}: ${txt}</li>`);
    }
    lines.push('</ul>');

    // Meaning section: translate tauRec into localized bullets
    const meaning = [];
    if (hasTheo && hasReal) {
        const c = Number.isFinite(corrEffective) ? corrEffective : NaN;
        // Only show tau-based slower/faster insights when overall agreement is high and tau/lag are reliable
        if (Number.isFinite(c) && c >= 0.90) {
            if (lagOk && tauOk) {
                if (tauReal.tauOn && tauSim.tauOn && (tauReal.tauOn > tauSim.tauOn + 8)) meaning.push(L.slowerOn);
                if (tauReal.tauOff && tauSim.tauOff && (tauReal.tauOff > tauSim.tauOff + 8)) meaning.push(L.slowerOff);
            }
            if (!meaning.length) meaning.push(L.agreementGood);
        } else if (Number.isFinite(c) && c >= 0.75) {
            meaning.push(L.agreementModerate);
            meaning.push(L.checkAdvice);
        } else {
            // Low or unknown correlation → caution
            meaning.push(L.agreementLow);
            meaning.push(L.checkAdvice);
        }
        if (fitHrMax && Number.isFinite(hrMaxMismatchDelta) && Math.abs(hrMaxMismatchDelta) >= HRMAX_MISMATCH_WARN) {
            meaning.push(L.hrMaxMismatch);
        }
        if (lagStats && lagStats.level === 'low') {
            meaning.push(L.lagUncertain);
        }
        if (hasReal && tauRealLevel === 'bad') {
            meaning.push(L.tauUncertain);
        }
        if (hasReal && !effortRec && (!modelAgreement || !lagOk || !dataOk)) {
            meaning.push(L.effortUncertain);
        }
        if (fitHrMax && hrMaxCalWeak) {
            meaning.push(`${L.hrMaxFitWeak}: ${L.hrMaxFitWeakHint}`);
        }
        // Explicitly say when the session doesn't constrain HRmax (no near-max evidence).
        if (fitHrMax && hrMaxEvidence && Number.isFinite(hrMaxEvidence.t90) && Number.isFinite(hrMaxEvidence.t95)) {
            if (hrMaxEvidence.t90 < 8 && hrMaxEvidence.t95 < 4) {
                meaning.push(L.hrMaxNotConstrained);
            }
        }
        if (quality && quality.level === 'bad') {
            meaning.push(L.dataQualityAdvice);
        }
    } else if (hasReal) {
        // Import-only: no theoretical model to compare with
        meaning.push(
            isRu
                ? 'Показана только реальная кривая ЧСС. Модель не выбрана — сравнение/корреляция недоступны. Значения τ оценены по данным импорта.'
                : 'Only the real HR curve is shown. No model selected — comparison/correlation are unavailable. Tau values are estimated from the imported data.'
        );
    } else if (hasTheo) {
        meaning.push(isRu ? 'Показана модельная кривая ЧСС. Импортируйте реальную кривую для сравнения.' : 'Showing the modeled HR curve. Import a real curve to compare.');
    }
    lines.push(`<div><b>${L.whatMeans}:</b></div>`);
    lines.push('<ul style="margin:6px 0 10px 18px">');
    meaning.forEach(m => lines.push(`<li>${m}</li>`));
    lines.push('</ul>');

    // Recommendations
    const recs = [];
    if (hasReal) {
        if (highAgreement && lagOk && tauOk && tauReal.tauOff && tauSim.tauOff && (tauReal.tauOff > tauSim.tauOff + 8)) recs.push(L.slowerOff);
        if (modelAgreement && lagOk && dataOk && effortRec && effortRec.code) {
            if (effortRec.code === 'low') recs.push(L.effortLow);
            if (effortRec.code === 'high') recs.push(L.effortHigh);
        }
        if (dataOk && typeof maxHR.observedMaxHR === 'number') {
            if (maxHR.observedMaxHR < maxHR.predictedMaxHR - 15) recs.push(L.maxLow);
            if (maxHR.observedMaxHR > maxHR.predictedMaxHR + 15) recs.push(L.maxHigh);
        }
        if (Number.isFinite(hrMaxMismatchDelta) && Math.abs(hrMaxMismatchDelta) >= HRMAX_MISMATCH_WARN) {
            recs.push(L.hrMaxMismatch);
        }
        if (hrMaxAutoWarn) {
            recs.push(L.hrMaxAutoAdvice);
        }
        if (quality && quality.level === 'bad') {
            recs.push(L.dataQualityAdvice);
        }
    }
    if (!hasReal && hrMaxAutoWarn) {
        recs.push(L.hrMaxAutoAdvice);
    }
    if (recs.length) {
        lines.push(`<div><b>${L.recs}:</b></div>`);
        lines.push('<ul style="margin:6px 0 0 18px">');
        recs.forEach(r => lines.push(`<li>${r}</li>`));
        lines.push('</ul>');
    }
    lines.push('</div>');
    lines.push('</details>');
    lines.push('</div>');

    const summaryHtml = lines.join('');
    // Plain text fallback (minimal)
    let summaryText = `${L.hdr}:\n`;

    // Simple-first (text)
    if (hasTheo && hasReal) summaryText += `${L.keyMatch}: ${matchKey}\n`;
    if (hasTheo && hasReal && lagStats) summaryText += `${L.keyLag}: ${lagKey}\n`;
    if (hasReal && quality && quality.level && quality.level !== 'na') summaryText += `${L.keyData}: ${dataKey}\n`;
    if (hasReal && hrMaxNotConstrained) summaryText += `${L.keyHrMax}: ${L.hrMaxNotConstrainedShort}\n`;
    if (hrMaxAutoWarn) summaryText += `${L.keyHrMaxSource}: ${L.hrMaxAutoShort}\n`;
    summaryText += `\n${L.details}:\n`;

    // Shared HRmax compare vars for text output
    const userHRmaxTxt = Number.isFinite(hrMaxUser) ? hrMaxUser : null;
    const ageEstHRmaxTxt = Number.isFinite(age) ? predictedMaxHRFromAge(age, sportLevel) : null;

    if (hasTheo && hasReal && (Number.isFinite(rmse) || Number.isFinite(corr))) {
        if (Number.isFinite(corrBest) && bestLagStr) {
            const lagConfTxt = lagStats
                ? `, ${L.lagConfidence}: ${(lagStats.level==='high')?L.lagConfHigh:(lagStats.level==='low'?L.lagConfLow:L.lagConfOk)}`
                : '';
            summaryText += `${L.rmse}: ${Number.isFinite(rmse)?rmse.toFixed(1):'n/a'}, ${L.corr}: ${Number.isFinite(corr)?corr.toFixed(2):'n/a'} → ${corrBest.toFixed(2)} (${bestLagStr})${lagConfTxt}\n`;
            const win = lagStats && lagStats.win;
            if (win && Number.isFinite(win.medianCorr) && Number.isFinite(win.p10Corr) && Number.isFinite(win.fracOk) && Number.isFinite(win.fracGood)) {
                const pctOk = Math.round(win.fracOk * 100);
                const pctGood = Math.round(win.fracGood * 100);
                summaryText += `${L.lagWindowed}: med ${win.medianCorr.toFixed(2)}, p10 ${win.p10Corr.toFixed(2)}, ≥0.60 ${pctOk}%, ≥0.80 ${pctGood}% (n=${win.nWin}, ${win.winSec}s/${win.stepSec}s)\n`;
            }
        } else {
            summaryText += `${L.rmse}: ${Number.isFinite(rmse)?rmse.toFixed(1):'n/a'}, ${L.corr}: ${Number.isFinite(corr)?corr.toFixed(2):'n/a'}\n`;
            if (lagStats && bestLagDiagStr && Number.isFinite(lagStats.bestCorr)) {
                const lagConfTxt = `, ${L.lagConfidence}: ${(lagStats.level==='high')?L.lagConfHigh:(lagStats.level==='low'?L.lagConfLow:L.lagConfOk)}`;
                const d = Number.isFinite(lagStats.deltaCorr) ? lagStats.deltaCorr : NaN;
                const w = Number.isFinite(lagStats.widthSec) ? lagStats.widthSec : NaN;
                const dTxt = Number.isFinite(d) ? `, Δcorr ${d.toFixed(3)}` : '';
                const wTxt = Number.isFinite(w) ? `, ${(isRu ? 'ширина~' : 'width~')}${Math.round(w)}s` : '';
                summaryText += `${L.lagScan}: best ${bestLagDiagStr}, corr(best) ${lagStats.bestCorr.toFixed(2)}${dTxt}${wTxt}${lagConfTxt}\n`;
                const win = lagStats && lagStats.win;
                if (win && Number.isFinite(win.medianCorr) && Number.isFinite(win.p10Corr) && Number.isFinite(win.fracOk) && Number.isFinite(win.fracGood)) {
                    const pctOk = Math.round(win.fracOk * 100);
                    const pctGood = Math.round(win.fracGood * 100);
                    summaryText += `${L.lagWindowed}: med ${win.medianCorr.toFixed(2)}, p10 ${win.p10Corr.toFixed(2)}, ≥0.60 ${pctOk}%, ≥0.80 ${pctGood}% (n=${win.nWin}, ${win.winSec}s/${win.stepSec}s)\n`;
                }
            }
        }
    }
    if (hasReal) {
        if (Number.isFinite(predictedPeakHR) && Number.isFinite(observedPeakHR)) {
            summaryText += L.predPeakObs.replace('{pred}', predictedPeakHR).replace('{obs}', observedPeakHR) + '\n';
        } else {
            summaryText += L.predObs.replace('{pred}', maxHR.predictedMaxHR).replace('{obs}', maxHR.observedMaxHR) + '\n';
        }
        if (Number.isFinite(hrMaxCal)) {
            const userHRmax = Number.isFinite(userHRmaxTxt) ? userHRmaxTxt : null;
            const ageEstHRmax = Number.isFinite(ageEstHRmaxTxt) ? ageEstHRmaxTxt : null;
            const dUser = (Number.isFinite(userHRmax) ? (hrMaxCal - userHRmax) : null);
            const dAge = (Number.isFinite(ageEstHRmax) ? (hrMaxCal - ageEstHRmax) : null);
            const dUserStr = (dUser==null) ? '' : `, ${isRu ? 'Δк пользов.' : 'Δ vs user'}: ${dUser>0?'+':''}${Math.round(dUser)} bpm`;
            const dAgeStr = (dAge==null) ? '' : `, ${isRu ? 'Δк возрастн.' : 'Δ vs age'}: ${dAge>0?'+':''}${Math.round(dAge)} bpm`;
            const unreli = hrMaxCalUnreliable ? (isRu ? ' (сомн.)' : ' (uncertain)') : '';
            const weak = hrMaxCalWeak ? (isRu ? ` (${L.hrMaxFitWeak})` : ` (${L.hrMaxFitWeak})`) : '';
            summaryText += `${isRu ? 'Калиброванный HRmax (подгонка)' : 'Calibrated HRmax (fit)'}: ${hrMaxCal} bpm${unreli}${weak}${dUserStr}${dAgeStr}` + '\n';
        }
        if (hrMaxEvidence && Number.isFinite(hrMaxEvidence.peak)) {
            const t90 = Number.isFinite(hrMaxEvidence.t90) ? hrMaxEvidence.t90 : 0;
            const t95 = Number.isFinite(hrMaxEvidence.t95) ? hrMaxEvidence.t95 : 0;
            summaryText += `${L.hrMaxEvidence}: ${L.hrMaxEvidenceLine.replace('{peak}', hrMaxEvidence.peak).replace('{t90}', t90).replace('{t95}', t95)}` + '\n';
            if (t90 < 8 && t95 < 4) summaryText += L.hrMaxNotConstrained + '\n';
        }
        if (quality && quality.level && quality.level !== 'na') {
            const qLbl = (quality.level === 'good') ? L.dataQualityGood : (quality.level === 'ok' ? L.dataQualityOk : L.dataQualityBad);
            summaryText += `${L.dataQuality}: ${qLbl} (${quality.score}/100)` + '\n';
        }
        if (fitHrMax && Number.isFinite(userHRmaxTxt) && Number.isFinite(ageEstHRmaxTxt)) {
            const d = userHRmaxTxt - ageEstHRmaxTxt; const sign = d > 0 ? '+' : '';
            summaryText += `${isRu ? 'Указанный HRmax' : 'User-set HRmax'}: ${Math.round(userHRmaxTxt)}; ${isRu ? 'Оценка по возрасту' : 'Age-estimated'} (${formulaShort}): ${ageEstHRmaxTxt} (${sign}${Math.round(d)} bpm)` + '\n';
        }
        if (tauRec) summaryText += tauRec + '\n';
        if (lagStats && lagStats.level === 'low') summaryText += L.lagUncertain + '\n';
        if (hasReal && tauRealLevel === 'bad') summaryText += L.tauUncertain + '\n';
        if (effortRec && effortRec.code) {
            summaryText += (effortRec.code === 'ok' ? L.effortOkText : (effortRec.code === 'low' ? L.effortLowText : L.effortHighText)) + '\n';
        }
        if (ageRec && ageRec.code) {
            const ageTxt = ageRec.code === 'ok' ? (isRu?'Макс. пульс адекватен возрасту.':'Max HR is adequate for age.') : (ageRec.code === 'low' ? L.maxLow : L.maxHigh);
            summaryText += ageTxt + '\n';
        }
        if (quality && quality.level === 'bad') {
            summaryText += L.dataQualityAdvice + '\n';
        }
        if (hrMaxAutoWarn) {
            summaryText += L.hrMaxAutoAdvice + '\n';
        }
    } else if (hasTheo) {
        if (Number.isFinite(predictedPeakHR)) summaryText += L.predPeakOnly.replace('{pred}', predictedPeakHR) + '\n';
        else summaryText += L.predOnly.replace('{pred}', predictedMaxHRFromAge(age, sportLevel)) + '\n';
        if (fitHrMax && Number.isFinite(userHRmaxTxt) && Number.isFinite(ageEstHRmaxTxt)) {
            const d = userHRmaxTxt - ageEstHRmaxTxt; const sign = d > 0 ? '+' : '';
            summaryText += `${isRu ? 'Указанный HRmax' : 'User-set HRmax'}: ${Math.round(userHRmaxTxt)}; ${isRu ? 'Оценка по возрасту' : 'Age-estimated'} (${formulaShort}): ${ageEstHRmaxTxt} (${sign}${Math.round(d)} bpm)` + '\n';
        }
        if (hrMaxAutoWarn) {
            summaryText += L.hrMaxAutoAdvice + '\n';
        }
    } else {
        summaryText += (isRu ? 'Нет корректной конфигурации для сводки.' : 'No valid configuration for summary.') + '\n';
    }

    return {
        summaryHtml,
        summaryText,
        metrics: {
            ...(similarity||{}),
            ...(maxHR||{}),
            tauReal,
            tauSim,
            tauRealQuality: (tauReal && tauReal.quality) ? tauReal.quality : null,
            overlapSec,
            durationSec,
            hasReal,
            hasTheo,
            corrBest,
            bestLagSec: (bestLagStr ? bestLag : 0),
            lagStats,
            hrMaxCalibrated: hrMaxCal,
            hrMaxCalRmse: hrMaxCalRmse,
            hrMaxCalLagSec: hrMaxCalLag,
            hrMaxCalRange: hrMaxCalRange,
            hrMaxCalUnreliable: hrMaxCalUnreliable,
            dataQuality: quality
        }
    };
}

window.zoneSummary = {
    calculateChartSimilarity,
    rescaleTheoForHrMax,
    calibrateHrMaxRMSE,
    estimateMaxHR,
    estimateTau,
    assessHrSeriesQuality,
    estimateEffort,
    estimateAgeAdequacy,
    generateSummary
};
