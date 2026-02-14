(function(){
  'use strict';

  // Safe DOM helper (fallback if not defined yet)
  const $ = window.$ || ((id) => document.getElementById(id));

  // Local reference to globals (used lazily at call time)
  const I18N = window.I18N || { en: {}, ru: {} };

  function getZoneBoundaries(hrRest, hrMax, useHRR) {
    // Returns array of zone boundaries in bpm
    const asBpmLocal = (p) => useHRR ? (hrRest + p * (hrMax - hrRest)) : (p * hrMax);
    const p = (typeof window.getParams === 'function') ? window.getParams() : null;
    const act = p?.activity || 'kb';
    const f = (typeof window.activityZoneFractions === 'function') ? window.activityZoneFractions(act) : { Z2:[0.6,0.7], Z3:[0.7,0.8], Z4:[0.8,0.9], Z5:[0.9,1.0] };
    return [
      { min: asBpmLocal(f.Z2[0]), max: asBpmLocal(f.Z2[1]) },  // Z2
      { min: asBpmLocal(f.Z3[0]), max: asBpmLocal(f.Z3[1]) },  // Z3
      { min: asBpmLocal(f.Z4[0]), max: asBpmLocal(f.Z4[1]) },  // Z4
      { min: asBpmLocal(f.Z5[0]), max: asBpmLocal(f.Z5[1]) }   // Z5
    ];
  }

  function exportAIBrief(detailed = false) {
    try {
      const LANG = window.LANG || (document.documentElement.lang || 'en');
      const p = (typeof window.getParams === 'function') ? window.getParams() : null;
      if (!p) throw new Error('Params unavailable');

      const active = {
        SIT: !!($("chkSIT")?.checked),
        HIIT: !!($("chkHIIT")?.checked),
        ZRB: !!($("chkZRB")?.checked),
        Z2: !!($("chkZ2")?.checked),
        Z34: !!($("chkZ34")?.checked)
      };

      const sfp = (typeof window.seriesFromParams === 'function') ? window.seriesFromParams : null;
      const ser = sfp ? sfp(p) : [];
      const theory = ser.find(s => s && s.kind && !/^(CSV|FIT)$/i.test(s.kind));
      const real = ser.find(s => s && /^(CSV|FIT)$/i.test(s.kind));

      // Compute zones (bpm)
      const zones = getZoneBoundaries(p.hrRest, p.hrMax, p.useHRR);

      // Build summary via zoneSummary if available
      let summary = null;
      if (window.zoneSummary && typeof window.zoneSummary.generateSummary === 'function') {
        const settings = {
          t: theory?.t,
          realTime: real?.t,
          tauOn: p.tauOn, tauOff: p.tauOff,
          hrRest: p.hrRest, hrMax: p.hrMax,
          hrMaxUserProvided: !!p.hrMaxUserProvided,
          hrMaxUser: Number.isFinite(p.hrMaxUser) ? p.hrMaxUser : null,
          sportLevel: p.sportLevel,
          fitHrMax: !!p.fitHrMax
        };
        try {
          summary = window.zoneSummary.generateSummary({ age: p.age, theoretical: theory?.hr, real: real?.hr, settings, lang: LANG });
        } catch(_) { summary = null; }
      }

      // Downsample aligned overlap
      function buildAlignedSamples(tA, yA, tB, yB, maxPts = 120) {
        try {
          if (!Array.isArray(tA) || !Array.isArray(yA) || !Array.isArray(tB) || !Array.isArray(yB)) return null;
          if (!tA.length || !tB.length) return null;
          const start = Math.max(tA[0], tB[0]);
          const end = Math.min(tA[tA.length-1], tB[tB.length-1]);
          if (!(end > start)) return null;
          const pts = Math.max(6, Math.min(maxPts, Math.floor((end-start)/(detailed?1:2))));
          const step = (end - start) / pts;
          const tS = Array.from({length: pts+1}, (_,i)=> start + i*step);
          const interp = (tx, ty, tt) => {
            // binary search
            let lo = 0, hi = tx.length - 1;
            if (tt <= tx[0]) return ty[0];
            if (tt >= tx[hi]) return ty[hi];
            while (lo + 1 < hi) {
              const mid = (lo + hi) >> 1;
              if (tx[mid] <= tt) lo = mid; else hi = mid;
            }
            const t0 = tx[lo], t1 = tx[hi];
            const y0 = ty[lo], y1 = ty[hi];
            const a = (tt - t0) / Math.max(1e-6, (t1 - t0));
            return y0 * (1 - a) + y1 * a;
          };
          const a = tS.map(tt => Math.round(interp(tA, yA, tt)));
          const b = tS.map(tt => Math.round(interp(tB, yB, tt)));
          return { t: tS.map(x=>Math.round(x)), A: a, B: b, start: Math.round(start), end: Math.round(end) };
        } catch(_) { return null; }
      }
      const samples = (theory && real) ? buildAlignedSamples(theory.t, theory.hr, real.t, real.hr, detailed ? 600 : 120) : null;

      // Per-minute aggregates (detailed only) within overlap
      function perMinuteAggregates(tx, ty, start, end, zones) {
        try {
          if (!Array.isArray(tx) || !Array.isArray(ty) || !tx.length) return null;
          if (!(end > start)) return null;
          const minuteStart = Math.floor(start/60);
          const minuteEnd = Math.floor((end-1)/60);
          const maxMin = 90; // cap minutes to keep token size reasonable
          const out = [];
          // simple binary-search interpolation
          function interp(tt) {
            let lo = 0, hi = tx.length - 1;
            if (tt <= tx[0]) return ty[0];
            if (tt >= tx[hi]) return ty[hi];
            while (lo + 1 < hi) {
              const mid = (lo + hi) >> 1;
              if (tx[mid] <= tt) lo = mid; else hi = mid;
            }
            const t0 = tx[lo], t1 = tx[hi];
            const y0 = ty[lo], y1 = ty[hi];
            const a = (tt - t0) / Math.max(1e-6, (t1 - t0));
            return y0 * (1 - a) + y1 * a;
          }
          const z1Min = (p.useHRR ? p.hrRest : 0);
          const z2 = zones[0], z3 = zones[1], z4 = zones[2], z5 = zones[3];
          const bounds = [z1Min, z2.min, z3.min, z4.min, z5.min, z5.max + 999];
          function zoneIndex(v) {
            if (v < bounds[1]) return 0; // Z1
            if (v < bounds[2]) return 1; // Z2
            if (v < bounds[3]) return 2; // Z3
            if (v < bounds[4]) return 3; // Z4
            return 4; // Z5+
          }
          let countMin = 0;
          for (let m = minuteStart; m <= minuteEnd && countMin < maxMin; m++, countMin++) {
            const sT = Math.max(start, m*60);
            const eT = Math.min(end, (m+1)*60);
            if (!(eT > sT)) continue;
            const samplesPerMin = 12; // ~every 5s
            const step = (eT - sT) / samplesPerMin;
            const times = Array.from({length: samplesPerMin+1}, (_,i)=> sT + i*step);
            const vals = times.map(interp);
            const avg = vals.reduce((a,b)=>a+b,0) / vals.length;
            const slopePerMin = (vals[vals.length-1] - vals[0]) * (60/Math.max(1, eT - sT));
            const zCnt = [0,0,0,0,0];
            for (const v of vals) zCnt[zoneIndex(v)]++;
            const total = vals.length || 1;
            out.push({
              minuteStartSec: m*60,
              avgHR: Math.round(avg),
              slopeBpmPerMin: +slopePerMin.toFixed(2),
              zonesFrac: {
                Z1: +(zCnt[0]/total).toFixed(3),
                Z2: +(zCnt[1]/total).toFixed(3),
                Z3: +(zCnt[2]/total).toFixed(3),
                Z4: +(zCnt[3]/total).toFixed(3),
                Z5: +(zCnt[4]/total).toFixed(3)
              }
            });
          }
          return out;
        } catch(_) { return null; }
      }

      let perMin = null;
      if (detailed && samples && samples.start != null && samples.end != null) {
        perMin = {
          theory: theory ? perMinuteAggregates(theory.t, theory.hr, samples.start, samples.end, zones) : null,
          real: real ? perMinuteAggregates(real.t, real.hr, samples.start, samples.end, zones) : null
        };
      }

      const nowIso = new Date().toISOString();
      const formulaName = (p.sportLevel === 'tanaka') ? 'Tanaka 208-0.7×age' : (p.sportLevel === 'gellish' ? 'Gellish 207-0.7×age' : 'Fox 220-age');
      // Training type classification for AI context
      function classifyTraining(p, active) {
        const types = [];
        if (active.ZRB) {
          const hasPat = Array.isArray(p.zar?.pattern) && p.zar.pattern.length > 0;
          types.push(hasPat ? 'Zaruba_Custom' : 'Zaruba_EMOM');
        }
        if (active.SIT) types.push('SIT');
        if (active.HIIT) types.push('HIIT');
        if (active.Z34) types.push('Zone3-4');
        if (active.Z2) types.push('Zone2');
        if (types.length === 0) types.push('Unspecified');
        const primary = types[0];
        // Brief protocol description
        let protocol = null;
        if (primary === 'SIT') {
          protocol = `${p.sit.n}x${p.sit.work}/${p.sit.rest}s @ RPE ${(+p.sit.eff).toFixed(1)}`;
        } else if (primary === 'HIIT') {
          protocol = `${p.hiit.n}x${p.hiit.work}/${p.hiit.rest}s @ RPE ${(+p.hiit.eff).toFixed(1)} (rest RPE ${(+((p.hiit?.restFrac||0)*20)).toFixed(1)})`;
        } else if (primary === 'Zone2') {
          protocol = `${p.z2.min} min @ ${Math.round(p.z2.frac*100)}%`;
        } else if (primary === 'Zone3-4') {
          protocol = `${p.z34.min} min @ ${Math.round(p.z34.frac*100)}%`;
        } else if (primary?.startsWith('Zaruba')) {
          const hasPat = Array.isArray(p.zar?.pattern) && p.zar.pattern.length > 0;
          protocol = hasPat ? `Custom pattern: ${(typeof window.formatZarPatternSegments==='function'?window.formatZarPatternSegments(p.zar.pattern, { lang: window.LANG }):'pattern')}; total ${p.zar.dur||300}s` : `EMOM ~1 min: on ${p.zar.on||30}s / off ${p.zar.off||30}s for ${(p.zar.dur||300)/60} min`;
        }
        return { types, primary, protocol };
      }
      const trn = classifyTraining(p, active);

      const sysPrompt = (LANG==='ru')
        ? (
      `Вы — эксперт по анализу тренировок по ЧСС. Вам дан краткий отчёт и часть данных.
      Тип тренировки: ${trn.types.join(', ')}${trn.protocol ? `; протокол: ${trn.protocol}` : ''}.
      Задачи:
      - Оценить согласованность реальной кривой с моделью (RMSE/корреляция). Если доступно corrBest/лаг — ориентироваться на согласование после сдвига, но учитывать надёжность лага.
      - Проверить качество данных импорта (если доступна метрика качества). При плохом качестве любые выводы о τ/HRmax/«усилии» помечать как ненадёжные или не делать.
      - Качественно оценить τ_ON/τ_OFF только когда это оправдано: при хорошем согласовании и приемлемой надёжности τ (если есть флаги качества). Иначе — прямо написать, что τ оценить сложно/нельзя.
      - HRmax: помнить, что HRmax часто неидентифицируем по одной тренировке (сильно зависит от τ_ON/τ_OFF). Если в данных мало времени «вблизи максимума» — прямо написать, что HRmax этим импортом не определяется.
      - Проверить «адекватность усилия» (expected vs observed peak) только если модель хорошо согласуется с импортом и лаг не неоднозначен. Иначе — объяснить, что оценка усилия ограничена.
      - Сформулировать практические рекомендации (интенсивность/отдых/объём/зоны), но НЕ давать уверенных советов при низкой надёжности.
      - Писать кратко, по пунктам. Сначала резюме (3–5 п.), затем детали.
      Если данных мало или согласование низкое (примерно c<0.75) — предупредить о низкой надёжности выводов.

      Примечание: поле summary.text может содержать исторические/устаревшие строки. Приоритет отдавайте summary.metrics и явным меткам надёжности.`)
        : (
`You are an HR training analysis expert. A brief and partial data are provided.
Training type: ${trn.types.join(', ')}${trn.protocol ? `; protocol: ${trn.protocol}` : ''}.
Tasks:
If data are limited or c<0.75 — caution about reliability.`);

            const reliabilityPrompt = (LANG==='ru')
        ? (
      `- Если присутствует summary.metrics.dataQuality и уровень плохой — не делать точных выводов о τ/HRmax/лаге; рекомендовать проверить датчик/экспорт/сдвиг/обрезку.
      - Если присутствует summary.metrics.lagStats и уровень low — считать лаг неоднозначным; не опираться на тонкие различия корреляции.
      - Если присутствует summary.metrics.tauRealQuality и уровень bad — τ пометить как «сомнительно».
      - Если присутствует summary.metrics.hrMaxCalUnreliable или широкий диапазон summary.metrics.hrMaxCalRange — HRmax из подгонки считать ориентировочным.
      - Если присутствует summary.metrics.hrMaxEvidence (пик + секунды ≥90%/≥95%) и near-max времени мало — явно писать: «эта тренировка HRmax не фиксирует».`)
        : (
      `- If summary.metrics.dataQuality exists and is poor — avoid precise conclusions about tau/HRmax/lag; recommend checking sensor/export/offset/trim.
      - If summary.metrics.lagStats exists and level is low — treat lag as ambiguous; don’t rely on small correlation differences.
      - If summary.metrics.tauRealQuality exists and is bad — mark tau as uncertain.
      - If summary.metrics.hrMaxCalUnreliable is true or summary.metrics.hrMaxCalRange is wide — treat calibrated HRmax as only approximate.
      - If summary.metrics.hrMaxEvidence exists (peak + seconds ≥90%/≥95%) and near-max time is low — explicitly state the session doesn’t constrain HRmax.`);

      // Build share URL
      let shareUrl = null;
      try {
        const st = (typeof window.currentState === 'function') ? window.currentState() : null;
        if (st) {
          if (typeof window.buildShareUrlForState === 'function') {
            shareUrl = window.buildShareUrlForState(st);
          } else {
            const b64 = btoa(unescape(encodeURIComponent(JSON.stringify(st))));
            const origin = (location.origin && location.origin !== 'null') ? location.origin : '';
            const base = origin ? `${origin}${location.pathname}` : location.href.split('?')[0].split('#')[0];
            shareUrl = `${base}?s=${encodeURIComponent(b64)}`;
          }
        }
      } catch(_){ shareUrl = null; }

      const brief = {
        meta: {
          app: 'TMIC', version: '1.0', lang: LANG,
          generatedAt: nowIso,
          shareUrl
        },
        inputs: {
          age: p.age, hrRest: p.hrRest,
          hrMax: p.hrMax || null,
          hrMaxFormula: p.hrMax ? null : { code: p.sportLevel, name: formulaName, value: (typeof window.predictedMaxHRFromAge==='function') ? window.predictedMaxHRFromAge(p.age, p.sportLevel) : null },
          useHRR: !!p.useHRR,
          trimpSex: p.trimpSex,
          activity: p.activity,
          trainingType: trn,
          drift10: p.drift10,
          tauOn: p.tauOn, tauOff: p.tauOff,
          warmupMin: p.warmup, cooldownMin: p.cooldown,
          bodyWeightKg: p.bodyWeight
        },
        activeMethods: active,
        zonesBpm: zones,
        summary: summary ? {
          text: summary.summaryText,
          metrics: summary.metrics
        } : null,
        overlapSamples: samples,       // {t, A, B, start, end} or null
        aggregates: detailed ? perMin : null
      };

      const title = (LANG==='ru') ? '# Сводка для ИИ (TMIC)\n' : '# AI analysis brief (TMIC)\n';
      const instructionsHdr = (LANG==='ru') ? '## Инструкция\n' : '## Instructions\n';
      const dataHdr = (LANG==='ru') ? '## Данные\n' : '## Data\n';
      const sysHdr = (LANG==='ru') ? '### Роль ИИ\n' : '### System role\n';
      const reliabilityHdr = (LANG==='ru') ? '### Надёжность и ограничения (обязательно)\n' : '### Reliability and limitations (required)\n';
      const content = [
        title,
        instructionsHdr,
        sysHdr,
        '```\n',
        sysPrompt,
        '\n```\n',
        reliabilityHdr,
        reliabilityPrompt,
        '\n\n',
        dataHdr,
        '```json\n',
        JSON.stringify(brief, null, 2),
        '\n```\n'
      ].join('');

      // Download as Markdown
      const a = document.createElement('a');
      a.href = 'data:text/markdown;charset=utf-8,' + encodeURIComponent(content);
      a.download = `tmic_ai_brief${detailed ? '_detailed' : ''}_${nowIso.replace(/[:.]/g,'-')}.md`;
      a.click();
    } catch (e) {
      console.error('exportAIBrief error', e);
      const LANG = window.LANG || (document.documentElement.lang || 'en');
      alert(LANG==='ru' ? 'Не удалось сформировать сводку для ИИ' : 'Failed to build AI brief');
    }
  }

  // Expose API
  window.AIBrief = {
    exportAIBrief,
    getZoneBoundaries
  };
  window.exportAIBrief = exportAIBrief; // back-compat for onclick

})();
