// Extracted Big Chart modal controls from zone-comparator.js
(function(){
  'use strict';
  const $ = window.$ || (id => document.getElementById(id));

  function openBigChart() {
    const modal = $("modal");
    // Capture current scroll position to restore when closing
    try {
      const y = window.scrollY || document.documentElement.scrollTop || 0;
      if (modal) modal.dataset.scrollY = String(y);
    } catch(_){}
    if (modal && modal.parentElement !== document.body) {
      try { document.body.appendChild(modal); } catch(_){ }
    }
    // Disable background scroll only (no position/top hacks to keep layout sizing stable)
    try { document.documentElement.classList.add('modal-open'); document.body.classList.add('modal-open'); } catch(_){ }
    modal.classList.add("fullscreen");
    modal.classList.add("show");
    // Defer draw so modal sizing is applied before computing clientWidth/Height
    setTimeout(() => {
      try { drawBigChart(); } catch(_){}
      // Extra safety: re-render small chart to avoid transient blanking
      try { if (typeof window.render === 'function') window.render(); } catch(_){ }
    }, 60);
  }

  function closeBigChart() {
    const modal = $("modal");
    if (modal) { modal.classList.remove("show"); modal.classList.remove("fullscreen"); }
    // Restore background scroll state
    try { document.documentElement.classList.remove('modal-open'); document.body.classList.remove('modal-open'); } catch(_){ }
    // Cleanup big chart observer
    const host = $("bigChart");
    if (host && host._ro) { try { host._ro.disconnect(); } catch(_){} host._ro = null; }
    // Nudge layout to recalc on mobile devtools
    try { window.dispatchEvent(new Event('resize')); } catch(_){ }
  // Extra safety: refresh charts once the modal is closed
  try { if (typeof window.render === 'function') setTimeout(() => window.render(), 0); } catch(_){ }
    // Restore previous scroll position if captured
    try {
      const yStr = modal?.dataset?.scrollY;
      if (yStr != null) {
        const y = parseInt(yStr, 10);
        setTimeout(() => {
          try { window.scrollTo({ top: isNaN(y) ? 0 : y, left: 0, behavior: 'auto' }); }
          catch(_) { try { window.scrollTo(0, isNaN(y) ? 0 : y); } catch(_){} }
        }, 0);
      }
    } catch(_){ }
  }

  function drawBigChart() {
    const p = (typeof window.getParams === 'function') ? window.getParams() : null;
    const series = (typeof window.seriesFromParams === 'function') ? window.seriesFromParams(p || {}) : [];
    if (Array.isArray(series) && series.length) {
      if (typeof window.drawChart === 'function') window.drawChart($("bigChart"), series);
      if (typeof window.overlayZones === 'function') window.overlayZones($("bigChart"), series);
      if (typeof window.overlayTauMarkers === 'function') window.overlayTauMarkers($("bigChart"), series);
      if (typeof window.drawLegend === 'function') window.drawLegend($("bigLegend"), series);
    }
    if (window.t && typeof window.t === 'function') {
      $("bigTitle").textContent = window.t("bigTitle");
      $("bigCap").textContent = window.t("bigHint");
    }
    // Update zones chips in Big modal header area
    try {
      if (typeof window.updateZonesUI === 'function' && p) window.updateZonesUI(p.hrRest, p.hrMax, p.useHRR, $("bigZones"));
    } catch(_){ }

    // Observe container size and redraw when it changes (prevents narrow chart on mobile)
    try {
      const host = document.getElementById('bigChart');
      if (host && !host._ro) {
        const ro = new ResizeObserver(() => {
          try {
            const pp = (typeof window.getParams === 'function') ? window.getParams() : null;
            const ss = (typeof window.seriesFromParams === 'function') ? window.seriesFromParams(pp || {}) : [];
            if (Array.isArray(ss) && ss.length) {
              if (typeof window.drawChart === 'function') window.drawChart(host, ss);
              if (typeof window.overlayZones === 'function') window.overlayZones(host, ss);
              if (typeof window.overlayTauMarkers === 'function') window.overlayTauMarkers(host, ss);
              if (typeof window.drawLegend === 'function') window.drawLegend($("bigLegend"), ss);
            }
          } catch(_){ }
        });
        ro.observe(host);
        host._ro = ro;
      }
    } catch(_){ }
  }

  // expose globals
  window.openBigChart = openBigChart;
  window.closeBigChart = closeBigChart;
  window.drawBigChart = drawBigChart;
})();