// chart.js — chart rendering & zone overlays
// Exposes: window.Charting.{drawChart, overlayZones, overlayTauMarkers, drawLegend, computeKarvonenZones}
// Also defines global shims: drawChart, overlayZones, overlayTauMarkers, drawLegend for backwards compatibility

(function(){
  'use strict';

  const cssVar = (typeof window.cssVar === 'function')
    ? window.cssVar
    : (name, fallback) => getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback || '#999';

  function computeKarvonenZones() {
    const p = (typeof window.getParams === 'function') ? window.getParams() : null;
    const useHRR = p ? p.useHRR : !!document.getElementById('useHRR')?.checked;
    const rest = p ? p.hrRest : +(document.getElementById('hrRest')?.value || 60);
    const maxh = p ? p.hrMax : (function(){
      const age = +((document.getElementById('age')?.value) || 35);
      const sportLevel = document.getElementById('sportLevel')?.value || 'general';
      if (document.getElementById('hrMax') && document.getElementById('hrMax').value) return +document.getElementById('hrMax').value;
      return (typeof window.predictedMaxHRFromAge === 'function') ? window.predictedMaxHRFromAge(age, sportLevel) : (220 - age);
    })();
    const activity = p ? p.activity : (document.getElementById('activity')?.value || (document.getElementById('selActRun')?.checked ? 'run' : (document.getElementById('selActBike')?.checked ? 'bike' : 'kb')));
    const af = (typeof window.activityZoneFractions === 'function') ? window.activityZoneFractions(activity) : { Z2:[0.6,0.7], Z3:[0.7,0.8], Z4:[0.8,0.9], Z5:[0.9,1.0] };
    const f = [af.Z2[0], af.Z3[0], af.Z4[0], af.Z5[0]];
    const thr = useHRR ? f.map(x => rest + x * (maxh - rest)) : f.map(x => x * maxh);
    const z1From = useHRR ? rest : 0;
    const bands = [
      { from: z1From, to: thr[0], label: 'Z1', color: 'rgba(34, 197, 94, 0.15)' },
      { from: thr[0], to: thr[1], label: 'Z2', color: 'rgba(59, 130, 246, 0.22)' },
      { from: thr[1], to: thr[2], label: 'Z3', color: 'rgba(168, 85, 247, 0.20)' },
      { from: thr[2], to: thr[3], label: 'Z4', color: 'rgba(249, 115, 22, 0.20)' },
      { from: thr[3], to: 999, label: 'Z5', color: 'rgba(239, 68, 68, 0.15)' }
    ];
    return { thr, bands };
  }

  function overlayZones(container, series) {
    try {
      const svg = container.querySelector('svg');
      if (!svg) return;
      const NS = 'http://www.w3.org/2000/svg';
      const w = container.clientWidth, h = container.clientHeight, pl = 44, pr = 22, pt = 16, pb = 28;
      const all = series.flatMap(s => s.hr);
      const ymin = Math.min(40, ...all) - 3, ymax = Math.max(200, ...all) + 3;
      const Y = v => h - pb - (h - pt - pb) * ((v - ymin) / (ymax - ymin));
      const oldB = svg.querySelector('.zone-bands'); if (oldB) oldB.remove();
      const oldL = svg.querySelector('.zone-lines'); if (oldL) oldL.remove();
      const g = document.createElementNS(NS, 'g');
      g.setAttribute('class', 'zone-bands');
      const { bands } = computeKarvonenZones();
      if (bands && bands.length > 0) bands[0].from = ymin;
      for (const z of bands) {
        const y1 = Y(Math.min(z.to, ymax)), y2 = Y(Math.max(z.from, ymin));
        const r = document.createElementNS(NS, 'rect');
        r.setAttribute('x', pl);
        r.setAttribute('y', y1);
        r.setAttribute('width', Math.max(0, (w - pl - pr)));
        r.setAttribute('height', Math.max(0, (y2 - y1)));
        r.setAttribute('fill', z.color);
        g.appendChild(r);
        const text = document.createElementNS(NS, 'text');
        text.setAttribute('x', w - pr + 3);
        text.setAttribute('y', (y1 + y2) / 2);
        text.setAttribute('fill', '#64748b');
        text.setAttribute('font-size', '12');
        text.setAttribute('dominant-baseline', 'middle');
        text.textContent = z.label;
        g.appendChild(text);
      }
      svg.insertBefore(g, svg.firstChild);
    } catch (e) {
      console.warn('overlayZones error', e);
    }
  }

  function drawChart(container, series) {
    let w = container.clientWidth, h = container.clientHeight;
    const isBig = (container && container.id === 'bigChart');
    const modalOpen = document.getElementById('modal')?.classList.contains('show');
    if (isBig && modalOpen) {
      const vw = Math.max(window.innerWidth || 0, document.documentElement.clientWidth || 0);
      const vh = (window.visualViewport && window.visualViewport.height) || window.innerHeight || h || 0;
      if (w < vw * 0.6) w = vw;
      if (h < vh * 0.4) h = Math.floor(vh * 0.7);
    }
    const pl = 44, pr = 22, pt = 16, pb = 28;
    const NS = 'http://www.w3.org/2000/svg';
    container.innerHTML = '';
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
    svg.setAttribute('width', w);
    svg.setAttribute('height', h);
    container.appendChild(svg);

    const xmax = series.reduce((m, s) => {
      const first = (Array.isArray(s.t) && s.t.length) ? (s.t[0] || 0) : 0;
      const last = (Array.isArray(s.t) && s.t.length) ? (s.t[s.t.length - 1] || 0) : 0;
      const dur = Math.max(0, last - first);
      return Math.max(m, dur);
    }, 1);
    const all = series.flatMap(s => s.hr);
    const ymin = Math.min(40, ...all) - 3;
    const ymax = Math.max(200, ...all) + 3;
    const X = v => pl + (w - pl - pr) * (v / Math.max(1, xmax));
    const Y = v => h - pb - (h - pt - pb) * ((v - ymin) / (ymax - ymin));

    const grid = document.createElementNS(NS, 'g');
    grid.setAttribute('stroke', '#243246');
    grid.setAttribute('stroke-width', '1');

    const hrStep = 20;
    const hrStart = Math.floor(ymin / hrStep) * hrStep;
    const hrEnd = Math.ceil(ymax / hrStep) * hrStep;
    for (let hr = hrStart; hr <= hrEnd; hr += hrStep) {
      const yy = Y(hr);
      const ln = document.createElementNS(NS, 'line');
      ln.setAttribute('x1', pl);
      ln.setAttribute('x2', w - pr);
      ln.setAttribute('y1', yy);
      ln.setAttribute('y2', yy);
      grid.appendChild(ln);
      const lab = document.createElementNS(NS, 'text');
      lab.setAttribute('x', 8);
      lab.setAttribute('y', yy + 4);
      lab.setAttribute('fill', '#9ca3af');
      lab.setAttribute('font-size', '12');
      lab.textContent = hr;
      svg.appendChild(lab);
    }

    const timeStep = xmax <= 1800 ? 60 : xmax <= 3600 ? 120 : xmax <= 7200 ? 300 : 600;
    const timeStart = 0;
    const timeEnd = Math.ceil(xmax / timeStep) * timeStep;
    for (let t = timeStart; t <= timeEnd; t += timeStep) {
      const xx = X(t);
      const ln = document.createElementNS(NS, 'line');
      ln.setAttribute('x1', xx);
      ln.setAttribute('x2', xx);
      ln.setAttribute('y1', pt);
      ln.setAttribute('y2', h - pb);
      grid.appendChild(ln);
      const tx = document.createElementNS(NS, 'text');
      tx.setAttribute('x', xx);
      tx.setAttribute('y', h - 6);
      tx.setAttribute('fill', '#9ca3af');
      tx.setAttribute('font-size', '12');
      tx.setAttribute('text-anchor', 'middle');
      tx.textContent = Math.round(t / 60);
      svg.appendChild(tx);
    }
    svg.appendChild(grid);

    const minLabel = document.createElementNS(NS, 'text');
    minLabel.setAttribute('x', w - 10);
    minLabel.setAttribute('y', h - 6);
    minLabel.setAttribute('fill', '#9ca3af');
    minLabel.setAttribute('font-size', '12');
    minLabel.textContent = 'min';
    svg.appendChild(minLabel);

    const ty = document.createElementNS(NS, 'text');
    ty.setAttribute('x', 10);
    ty.setAttribute('y', pt - 2);
    ty.setAttribute('fill', '#9ca3af');
    ty.setAttribute('font-size', '12');
    ty.textContent = 'HR (bpm)';
    svg.appendChild(ty);

    const color = k =>
      k === 'SIT' ? cssVar('--sit', '#60a5fa') :
      k === 'HIIT' ? cssVar('--hiit', '#f59e0b') :
      k === 'SN' ? cssVar('--sn', '#fb7185') :
      k === 'SW' ? cssVar('--sw', '#14b8a6') :
      k === 'Z2' ? cssVar('--z2', '#34d399') :
      k === 'Z34' ? cssVar('--z34', '#a78bfa') :
      k === 'ZRB' ? cssVar('--zaruba', '#22d3ee') :
      k === 'CSV' ? '#f87171' :
      k === 'FIT' ? '#22c55e' : '#9ca3af';

    for (const s of series) {
      const p = document.createElementNS(NS, 'path');
      let d = '';
      for (let i = 0; i < s.t.length; i++) d += (i ? 'L' : 'M') + X(s.t[i]) + ' ' + Y(s.hr[i]) + ' ';
      p.setAttribute('d', d);
      p.setAttribute('fill', 'none');
      p.setAttribute('stroke', color(s.kind));
      p.setAttribute('stroke-width', '2.2');
      p.setAttribute('stroke-linecap', 'round');
      p.setAttribute('stroke-linejoin', 'round');
      svg.appendChild(p);
    }
  }

  function overlayTauMarkers(container, series) {
    try {
      const svg = container.querySelector('svg');
      if (!svg) return;
      const NS = 'http://www.w3.org/2000/svg';
      const w = container.clientWidth, h = container.clientHeight, pl = 44, pr = 22, pt = 16, pb = 28;
      if (!Array.isArray(series) || !series.length) return;
      const all = series.flatMap(s => s.hr || []);
      if (!all.length) return;
      // Remove old markers
      const old = svg.querySelector('.tau-markers');
      if (old) old.remove();
      // Find first imported series (CSV/FIT)
      const imp = series.find(s => s && (s.kind === 'CSV' || s.kind === 'FIT'));
      if (!imp || !Array.isArray(imp.t) || !Array.isArray(imp.hr) || imp.t.length !== imp.hr.length || imp.t.length < 8) return;
      // Axis helpers (match drawChart logic)
      const xmax = series.reduce((m, s) => {
        const first = (Array.isArray(s.t) && s.t.length) ? (s.t[0] || 0) : 0;
        const last = (Array.isArray(s.t) && s.t.length) ? (s.t[s.t.length - 1] || 0) : 0;
        const dur = Math.max(0, last - first);
        return Math.max(m, dur);
      }, 1);
      const ymin = Math.min(40, ...all) - 3;
      const ymax = Math.max(200, ...all) + 3;
      const X = v => pl + (w - pl - pr) * (v / Math.max(1, xmax));
      const Y = v => h - pb - (h - pt - pb) * ((v - ymin) / (ymax - ymin));
      // Compute tau markers via zoneSummary
      if (!window.zoneSummary || typeof window.zoneSummary.estimateTau !== 'function') return;
      const res = window.zoneSummary.estimateTau(imp.hr, imp.t) || {};
      const mk = res.markers || {};
      const g = document.createElementNS(NS, 'g');
      g.setAttribute('class', 'tau-markers');
      const drawVLine = (tx, color, label) => {
        if (!Number.isFinite(tx)) return;
        const x = X(tx);
        const ln = document.createElementNS(NS, 'line');
        ln.setAttribute('x1', x);
        ln.setAttribute('x2', x);
        ln.setAttribute('y1', pt);
        ln.setAttribute('y2', h - pb);
        ln.setAttribute('stroke', color);
        ln.setAttribute('stroke-width', '1.5');
        ln.setAttribute('stroke-dasharray', '4,4');
        ln.setAttribute('opacity', '0.9');
        g.appendChild(ln);
        if (label) {
          const t = document.createElementNS(NS, 'text');
          t.setAttribute('x', x + 4);
          t.setAttribute('y', pt + 12);
          t.setAttribute('fill', color);
          t.setAttribute('font-size', '11');
          t.textContent = label;
          g.appendChild(t);
        }
      };
      // Minimal clutter: show cooldown start and τ_OFF line; optionally onset
      drawVLine(mk.coolStart, '#93c5fd', 'cool');
      drawVLine(mk.tau1e, '#fca5a5', 'τ_OFF');
      // Onset marker (subtle)
      drawVLine(mk.onset, '#86efac', 'onset');
      svg.appendChild(g);
    } catch (e) {
      console.warn('overlayTauMarkers error', e);
    }
  }

  function drawLegend(legendEl, series) {
    legendEl.innerHTML = '';
    const add = (name, cls, extra) => {
      const it = document.createElement('div');
      it.style.display = 'flex';
      it.style.alignItems = 'center';
      it.style.gap = '6px';
      const d = document.createElement('div'); d.className = `dot ${cls}`;
      const s = document.createElement('span'); s.textContent = name;
      it.appendChild(d); it.appendChild(s);
      if (extra) {
        const e = document.createElement('span');
        e.style.marginLeft = '8px';
        e.style.opacity = '.7';
        e.style.fontSize = '12px';
        e.textContent = extra;
        it.appendChild(e);
      }
      legendEl.appendChild(it);
    };
    const I18N = window.I18N || {}; const LANG = window.LANG || document.documentElement.lang || 'en';
    if (series.find(s => s.kind === 'SIT')) add(I18N[LANG]?.legend?.SIT || 'SIT', 'sit');
    if (series.find(s => s.kind === 'HIIT')) add(I18N[LANG]?.legend?.HIIT || 'HIIT', 'hiit');
  if (series.find(s => s.kind === 'SN')) add(I18N[LANG]?.legend?.SN || 'Snatch', 'sn');
  if (series.find(s => s.kind === 'SW')) add(I18N[LANG]?.legend?.SW || 'Swings', 'sw');
  if (series.find(s => s.kind === 'Z2')) add(I18N[LANG]?.legend?.Z2 || 'Z2', 'z2');
    if (series.find(s => s.kind === 'Z34')) add(I18N[LANG]?.legend?.Z34 || 'Z3–4', 'z34');
    if (series.find(s => s.kind === 'ZRB')) add(I18N[LANG]?.legend?.ZRB || 'Zaruba', 'zaruba');
    const p = (typeof window.getParams === 'function') ? window.getParams() : {};
    for (const s of series) {
      if (s.kind === 'CSV' || s.kind === 'FIT') {
        const avgHR = (Array.isArray(s.hr) && s.hr.length) ? (s.hr.reduce((a,b)=>a+b,0)/s.hr.length) : 0;
        const durMin = (Array.isArray(s.t) && s.t.length) ? ((s.t[s.t.length-1] - s.t[0]) / 60) : 0;
        const weight = Number.isFinite(p.bodyWeight) ? p.bodyWeight : 75;
        const age = Number.isFinite(p.age) ? p.age : 35;
        const sex = (p.trimpSex === 'f') ? 'f' : 'm';
        let calPerMin = 0;
        if (sex === 'm') calPerMin = (-55.0969 + 0.6309*avgHR + 0.1988*weight + 0.2017*age)/4.184;
        else calPerMin = (-20.4022 + 0.4472*avgHR - 0.1263*weight + 0.074*age)/4.184;
        const totalCal = Math.max(0, Math.round(calPerMin * durMin));
        add((LANG==='ru'?'Импорт':'Import'), s.kind==='CSV' ? 'csvimp' : 'fitimp', `${totalCal} kcal`);
      }
    }
  }

  // Expose
  window.Charting = { drawChart, overlayZones, overlayTauMarkers, drawLegend, computeKarvonenZones };
  window.drawChart = drawChart;
  window.overlayZones = overlayZones;
  window.overlayTauMarkers = overlayTauMarkers;
  window.drawLegend = drawLegend;
})();
