// Editable Zaruba scheme presets (loaded by zone-comparator-1.3.html)
// You can safely edit this file to add/remove presets.
// Each preset:
// - id: stable string key
// - title: { en, ru } (fallback: any string)
// - pattern: pattern string used in zpmodal input
// - tags: optional array of strings
//
// Notes:
// - Patterns use the same syntax as the scheme editor.
// - Prefer deterministic patterns ending with "#" if you want duration to be defined only by the pattern.

(function () {
  const PRESETS = [
    {
      id: 'emom-10min-20-40',
      title: { en: 'EMOM 10 min (20/40 ×10)', ru: 'EMOM 10 мин (20/40 ×10)' },
      pattern: '20/40*10@8#',
      tags: ['emom']
    },
    {
      id: 'tabata-8',
      title: { en: 'Tabata (20/10 ×8)', ru: 'Табата (20/10 ×8)' },
      pattern: '20/10*8@9.5#',
      tags: ['tabata']
    },
    {
      id: 'ladder-10-50',
      title: { en: 'Ladder 10→50s (10/10 20/10 ...)', ru: 'Лесенка 10→50с (10/10 20/10 ...)' },
      pattern: '10/10@8 20/10@8 30/10@8 40/10@8 50/10@8#',
      tags: ['ladder']
    },
    {
      id: 'classic-30-30-10',
      title: { en: 'Classic 30/30 ×10', ru: 'Классика 30/30 ×10' },
      pattern: '30/30*10@8.5',
      tags: ['intervals']
    }
  ];

  try {
    window.ZARUBA_PRESETS = PRESETS;
  } catch (_) {
    // ignore
  }
})();
