// Methods registry for TMIC
// Provides a single entry point: Methods.seriesFromParams(p)
(function(){
  'use strict';

  function isChecked(id){ return !!(document.getElementById(id)?.checked); }
  // Back-compat and new UI support: prefer new dropdown ids (m*) and fall back to legacy (chk*)
  function isActiveKey(key){
    switch (key) {
      case 'SIT': return isChecked('msit') || isChecked('chkSIT');
      case 'HIIT': return isChecked('mhiit') || isChecked('chkHIIT');
      case 'ZRB': return isChecked('mzar') || isChecked('chkZRB');
      case 'SN': return isChecked('msn') || isChecked('chkSN');
      case 'SW': return isChecked('msw') || isChecked('chkSW');
      case 'Z2': return isChecked('mz2') || isChecked('chkZ2');
      case 'Z34': return isChecked('mz34') || isChecked('chkZ34');
      default: return false;
    }
  }

  function simSIT(p){
    return simulateHR({
      kind: 'SIT',
      hrRest: p.hrRest, hrMax: p.hrMax,
      work: p.sit.work, rest: p.sit.rest, n: p.sit.n, eff: p.sit.eff,
      drift10: p.drift10, useHRR: p.useHRR,
      tauOn: p.tauOn, tauOff: p.tauOff, warm: p.warmup, cool: p.cooldown, post: p.postRest
    });
  }
  function simHIIT(p){
    return simulateHR({
      kind: 'HIIT',
      hrRest: p.hrRest, hrMax: p.hrMax,
      work: p.hiit.work, rest: p.hiit.rest, n: p.hiit.n, eff: p.hiit.eff,
      drift10: p.drift10, useHRR: p.useHRR,
      tauOn: p.tauOn, tauOff: p.tauOff, warm: p.warmup, cool: p.cooldown, post: p.postRest,
      restFrac: p.hiit.restFrac
    });
  }
  function simZRB(p){
    const hasPat = Array.isArray(p.zar?.pattern) && p.zar.pattern.length > 0;
    const effMin = (p.zar?.mode === 'universal') ? 2 : 6;
    const intervalKinetics = (p.zar?.mode === 'universal') ? (p.zar?.kin || 'hiit') : undefined;
    const restFrac = (p.zar?.mode === 'universal') ? (+p.zar?.restFrac || 0) : undefined;
    if (hasPat) {
      return simulateHR({
        kind: 'ZRB',
        hrRest: p.hrRest, hrMax: p.hrMax,
        work: p.zar.on, rest: (p.zar.off ?? 0), n: 1, eff: p.zar.eff, effMin,
        drift10: p.drift10, useHRR: p.useHRR,
        tauOn: p.tauOn, tauOff: p.tauOff, warm: p.warmup, cool: p.cooldown, post: p.postRest,
        intervalKinetics,
        restFrac,
        pattern: p.zar.pattern, dur: p.zar.dur
      });
    } else {
      const restPerRound = Math.max(0, (p.zar?.off ?? 30));
      const cycleSec = Math.max(1, (p.zar?.on ?? 30) + restPerRound);
      const rounds = Math.max(1, Math.floor((p.zar?.dur ?? 300) / cycleSec));
      return simulateHR({
        kind: 'ZRB',
        hrRest: p.hrRest, hrMax: p.hrMax,
        work: p.zar.on, rest: restPerRound, n: rounds, eff: p.zar.eff, effMin,
        drift10: p.drift10, useHRR: p.useHRR,
        tauOn: p.tauOn, tauOff: p.tauOff, warm: p.warmup, cool: p.cooldown, post: p.postRest
        , intervalKinetics
        , restFrac
      });
    }
  }
  function simZ2(p){
    return simulateHR({
      kind: 'Z2',
      hrRest: p.hrRest, hrMax: p.hrMax,
      steadyMin: p.z2.min, steadyFrac: p.z2.frac,
      drift10: p.drift10, useHRR: p.useHRR,
      tauOn: p.tauOn, tauOff: p.tauOff, warm: p.warmup, cool: p.cooldown, post: p.postRest
    });
  }
  function simZ34(p){
    return simulateHR({
      kind: 'Z34',
      hrRest: p.hrRest, hrMax: p.hrMax,
      steadyMin: p.z34.min, steadyFrac: p.z34.frac,
      drift10: p.drift10, useHRR: p.useHRR,
      tauOn: p.tauOn, tauOff: p.tauOff, warm: p.warmup, cool: p.cooldown, post: p.postRest
    });
  }
  function simSN(p){
    const totalSec = Math.max(1, Math.round((p.sn?.min ?? 10) * 60));
    return simulateHR({
      kind: 'SN',
      hrRest: p.hrRest, hrMax: p.hrMax,
      drift10: p.drift10, useHRR: p.useHRR,
      tauOn: p.tauOn, tauOff: p.tauOff, warm: p.warmup, cool: p.cooldown, post: p.postRest,
      dur: totalSec,
      snProt: p.sn?.prot || 'classic',
      snChangeMin: p.sn?.changeMin ?? 5,
      snWeight: p.sn?.weight ?? 16,
      snCad: p.sn?.cad ?? 20
    });
  }
  function simSW(p){
    const totalSec = Math.max(1, Math.round((p.sw?.min ?? 14) * 60));
    return simulateHR({
      kind: 'SW',
      hrRest: p.hrRest, hrMax: p.hrMax,
      eff: p.sw?.eff ?? 8.5,
      drift10: p.drift10, useHRR: p.useHRR,
      tauOn: p.tauOn, tauOff: p.tauOff, warm: p.warmup, cool: p.cooldown, post: p.postRest,
      dur: totalSec,
      swStyle: p.sw?.style || 'universal',
      swProt: p.sw?.prot || 'classic',
      swChangeMin: p.sw?.changeMin ?? Math.max(1, (p.sw?.min ?? 14)/2),
      swWeight: p.sw?.weight ?? 20
    });
  }

  const REGISTRY = [
    { key: 'SIT',  isActive: ()=> isActiveKey('SIT'),  simulate: simSIT },
    { key: 'HIIT', isActive: ()=> isActiveKey('HIIT'), simulate: simHIIT },
    { key: 'ZRB',  isActive: ()=> isActiveKey('ZRB'),  simulate: simZRB },
    { key: 'SN',   isActive: ()=> isActiveKey('SN'),   simulate: simSN },
    { key: 'SW',   isActive: ()=> isActiveKey('SW'),   simulate: simSW },
    { key: 'Z2',   isActive: ()=> isActiveKey('Z2'),   simulate: simZ2 },
    { key: 'Z34',  isActive: ()=> isActiveKey('Z34'),  simulate: simZ34 }
  ];

  function seriesFromParams(p){
    const series = [];
    for (const m of REGISTRY) {
      if (m.isActive()) {
        try { series.push(m.simulate(p)); } catch (e) { console.warn('Method failed', m.key, e); }
      }
    }
    return series;
  }

  window.Methods = {
    REGISTRY,
    seriesFromParams
  };
})();