const $ = id => document.getElementById(id), S = s => s.toString();
    // Add this helper to resolve CSS variables:
    const cssVar = (name, fallback) => {
    const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return v || fallback || "#ffffff";
};
    // ------------ i18n ------------
    const I18N = {
    en: {
    title: "Training Method Interactive Comparator (TMIC)", sub: "Compact panels · drift · Karvonen-linked sim · dynamic table · Zone3–4 & Strength · HR import (CSV/FIT) · AI brief · Presets · Share/Print · Big chart",
    language: "Language:", btnLang: "EN",
    help: "Help",
    helpTip: "Open user guide",
		helpPanel: "Help",
    inputs: "Inputs", age: "Age (y)", bodyWeight: "Body weight (kg)", maxCap: "Max HR defaults to ≈ 220 − Age.", rest: "Rest HR", max: "Max HR",
    hrMaxAutoInline: "If Max HR is empty, zones use an age-based HRmax. Real HRmax can differ a lot and shift your zones — consider determining your true max.",
    hrMaxAutoZoneBadge: "HRmax: age estimate (may be wrong) — zones may be off",
    fitHrMax: "Help estimate HRmax from this workout",
    fitHrMaxCap: "Off = keep my HRmax; on = show HRmax fitting details",
    zones: "Computed zones (bpm)", chart: "HR chart", capChart: "X = longest selected session. Y labeled. Drift applies to all series.",
    shown: "Displayed methods (check to overlay)", sit: "SIT", hiit: "HIIT", z2: "Zone 2", z34: "Zone 3–4",
    config: "Method settings",
    editMethod: "Method to edit",
    editHint: "Below, only the selected method’s controls are shown.",
    useHRR: "Use Karvonen (HRR) formula for zones & targets", useHRRShort: "Karvonen HRR", drift: "Global HR drift (bpm per 10 min)",
    adv: "Global kinetics (advanced)", tauOn: "Tau ON (sec)", tauOff: "Tau OFF (sec)", warm: "Warm-up (min)", cool: "Cool-down (min)", post: "Post-rest (min)",
    shown: "Displayed methods (check to overlay)", sit: "SIT", hiit: "HIIT", z2: "Zone 2", z34: "Zone 3–4",
    activity: "Activity", acts: { kb: "Kettlebells", run: "Running", bike: "Bike trainer" },
    work: "Work (s)", restS: "Rest (s)", intervals: "Intervals", effHRR: "Effort (% HRR)", effHRmax: "Effort (% HRmax)", effRPE: "Effort (RPE)",
    minutes: "Minutes",
    dur: "Duration (min)", tgtHRR: "Target (% HRR)", tgtHRmax: "Target (% HRmax)",
    csv1: "Export CSV (metrics)", csv2: "Export CSV (series)", share: "Copy state link", print: "Print table (PDF)",
    shareScheme: "Copy scheme link",
    presetName: "Preset name", save: "Save preset", load: "Load", del: "Delete", big: "Big chart", bigTitle: "Big chart", bigHint: "Click outside or press Esc to close",
    table: "Comparison (dynamic)",
    th: { Method: "Method", Typical: "Typical session", Time: "Total time", WR: "Work:Rest", HRR: "HRR (recovery)", Fast: "Fast fibers / neuro", BDNF: "BDNF", Cort: "Cortisol", Cardio: "Cardio risk", Injury: "Injury risk", Eff: "Time efficiency", Load: "Load (AU)", ZLoad: "Zonal load", Calories: "Calories" },
    th2: { Method: "Method", Typical: "Typical<br>session", Time: "Total<br>time", WR: "Work:<br>Rest", HRR: "HRR<br>(recovery)", Fast: "Fast fibers<br>/ neuro", BDNF: "BDNF", Cort: "Cortisol", Cardio: "Cardio<br>risk", Injury: "Injury<br>risk", Eff: "Time<br>efficiency", Load: "Load<br>(AU)", ZLoad: "Zonal<br>load", Calories: "Calories" },
    capPol: "Polarity colors: green = good, red = bad. Karvonen toggle affects simulation. Copyright Serega photoskiff, 2025",
    csvHdr: ["Method", "Typical session", "Total time (s)", "Work:Rest", "HRR", "Fast fibers", "BDNF", "Cortisol", "Cardio risk", "Injury risk", "Time efficiency"],
    csvMetrics: "tmic_metrics.csv", csvSeries: "tmic_series.csv",
    legend: { SIT: "SIT", HIIT: "HIIT", SN: "Snatch (KB)", SW: "Swings (KB)", Z2: "Zone 2", Z34: "Zone 3–4", ZRB: "Zaruba" },
    meth: { SIT: "SIT", HIIT: "HIIT", SN: "Snatch (KB)", SW: "Swings (KB)", Z2: "Zone 2 (easy aerobic)", Z34: "Zone 3–4 steady", STR: "Strength (weights)", ZRB: "Zaruba" },
    capLang: "EN", linkCopied: "Link copied!",
    copy: "Copy",
    copied: "Copied!",
    explain: "Explain",
    explainTitle: "Pattern explanation",
    explainLead: "Human-readable description of the current scheme.",
		explainUpdate: "Update",
        explainHint: "Auto-builds when you open the panel; updates only when you press Update.",
    saveNew: "Save as new",
    reset: "Reset to defaults",
    png: "Export chart (PNG)",
    aiBrief: "AI analysis brief",
    aiBriefTip: "Downloads a prompt + data file you can paste into ChatGPT or other LLM.",
    aiBriefDetailed: "Detailed",
    aiBriefDetailedTip: "More data: per-minute aggregates and larger samples.",
    aiMenuHint: "Prompt + data file (not AI-generated output)",
    showOnChart: "Show",
    hideOnChart: "Hide",
    hideOthers: "Hide others",
    btnImportHR: "Import HR (CSV/FIT)",
    btnClearImports: "Clear imports",
    impOffset: "Import offset (s)",
    grpCtlIntervals: "Intervals (SIT + HIIT + Zaruba)",
    grpCtlSteady: "Steady (Zone 2 + Zone 3–4)",
    btnZarEmom: "Preset 30/30",
    hiitRestFrac: "Rest target (% HRR)",
    sportLevel: "HRmax formula",
    slTip: "Used when Max HR is empty: Fox 220−age, Tanaka 208−0.7×age, Gellish 207−0.7×age.",
    optSL: {
        general: "220 − age (Fox)",
        tanaka: "Tanaka (208 − 0.7×age)",
        gellish: "Gellish (207 − 0.7×age)"
    },
    showSummary: "Show summary",
    summaryTitle: "Workout summary",
    summaryNotLoaded: "Summary logic not loaded.",
    impTrim: "Trim start (s)",
    impTrimAuto: "Auto",
    impTrimClear: "Clear",
    impTrimApply: "Apply to chart",
    impAlign0: "Align 0s"
},
    ru: {
    title: "Интерактивный компаратор тренировочных методик (ИКТМ)", sub: "Компактные панели · дрейф · симуляция с Карвоненом · динамическая таблица · Зона3–4 и Силовая · Импорт HR (CSV/FIT) · Сводка для ИИ анализа · Пресеты · Шеринг/Печать · Большой график",
    language: "Язык:", btnLang: "РУС",
    help: "Руководство",
    helpTip: "Открыть руководство",
		helpPanel: "Справка",
    inputs: "Вводные", age: "Возраст (лет)", bodyWeight: "Масса тела (кг)", maxCap: "Макс. пульс по умолчанию ≈ 220 − возраст.", rest: "Пульс в покое", max: "Макс. пульс",
    hrMaxAutoInline: "Если HRmax оставить пустым — зоны считаются от HRmax по возрасту. Реальный HRmax может сильно отличаться и сдвинуть зоны — лучше определить свой максимум.",
    hrMaxAutoZoneBadge: "HRmax: по возрасту (может быть неверно) — зоны могут быть смещены",
    fitHrMax: "Помочь оценить HRmax по этой тренировке",
    fitHrMaxCap: "Выкл = HRmax не трогаем; вкл = показываем подгонку и детали",
    maxOverride: "Чтобы переопределить, введите своё значение — оно заменит расчёт по формуле.",
    useHRR: "Использовать формулу Карвонена (HRR) для зон и целей", useHRRShort: "Карвонен HRR", drift: "Дрейф ЧСС (уд/10 мин)",
    adv: "Глобальная кинетика (продвинуто)", tauOn: "Tau ON (с)", tauOff: "Tau OFF (с)", warm: "Разминка (мин)", cool: "Заминка (мин)", post: "Отдых после (мин)",
    shown: "Показываемые методы (галочки = наложить)", sit: "SIT", hiit: "HIIT", z2: "Зона 2", z34: "Зона 3–4",
    config: "Настройки метода",
    editMethod: "Метод для редактирования",
    editHint: "Ниже показываются только элементы выбранного метода.",
    activity: "Вид активности", acts: { kb: "Гири", run: "Бег", bike: "Велотренажёр" },
    work: "Работа (с)", restS: "Отдых (с)", intervals: "Интервалы", effHRR: "Интенсивность (% HRR)", effHRmax: "Интенсивность (% HRmax)", effRPE: "Интенсивность (RPE)",
    minutes: "Минут",
    dur: "Длительность (мин)", tgtHRR: "Цель (% HRR)", tgtHRmax: "Цель (% HRmax)",
    zones: "Рассчитанные зоны (уд/мин)", chart: "График ЧСС", capChart: "Ось X = самая длинная выбранная сессия. Подписи по Y. Дрейф применяется ко всем рядам.",
    csv1: "Экспорт CSV (метрики)", csv2: "Экспорт CSV (ряды)", share: "Скопировать ссылку состояния", print: "Печать таблицы (PDF)", presetName: "Имя пресета", save: "Сохранить", load: "Загрузить", del: "Удалить", big: "Большой график", bigTitle: "Большой график", bigHint: "Кликните вне окна или Esc для закрытия",
    shareScheme: "Скопировать ссылку схемы",
    table: "Сравнение (динамическое)",
    th: { Method: "Метод", Typical: "Типовая сессия", Time: "Общее время", WR: "Работа:Отдых", HRR: "HRR (восстановление)", Fast: "Быстрые волокна / нейро", BDNF: "BDNF", Cort: "Кортизол", Cardio: "Кардио-риск", Injury: "Риск травм", Eff: "Эффективн. по времени", Load: "Нагрузка (AU)", ZLoad: "Зонная нагрузка", Calories: "Калории" },
    th2: { Method: "Метод", Typical: "Типовая<br>сессия", Time: "Общее<br>время", WR: "Работа:<br>Отдых", HRR: "HRR<br>(восстановл.)", Fast: "Быстрые волокна<br>/ нейро", BDNF: "BDNF", Cort: "Кортизол", Cardio: "Кардио-<br>риск", Injury: "Риск<br>травм", Eff: "Эффективн.<br>по времени", Load: "Нагрузка<br>(AU)", ZLoad: "Зонная<br>нагрузка", Calories: "Калории" },
    capPol: "Полярность цветов: зелёное = хорошо, красное = плохо. Переключатель Карвонена влияет на симуляцию. Copyright Серёга photoskiff, 2025-2026",
    csvHdr: ["Метод", "Типовая сессия", "Общее время (с)", "Работа:Отдых", "HRR", "Быстрые волокна", "BDNF", "Кортизол", "Кардио-риск", "Риск травм", "Эффективность по времени"],
    csvMetrics: "tmic_metrics_ru.csv", csvSeries: "tmic_series_ru.csv",
    legend: { SIT: "SIT", HIIT: "HIIT", SN: "Рывок (гири)", SW: "Махи (гири)", Z2: "Зона 2", Z34: "Зона 3–4", ZRB: "Заруба" },
    meth: { SIT: "SIT", HIIT: "HIIT", SN: "Рывок (гири)", SW: "Махи (гири)", Z2: "Зона 2 (лёгкая аэробная)", Z34: "Зона 3–4 (равномерно)", STR: "Силовая тренировка", ZRB: "Заруба" },
    capLang: "РУС", linkCopied: "Ссылка скопирована!",
    copy: "Скопировать",
    copied: "Скопировано!",
    explain: "Пояснить",
    explainTitle: "Пояснение схемы",
    explainLead: "Человеческое описание текущей схемы.",
		explainUpdate: "Обновить",
        explainHint: "Автоматически строится при открытии панели; дальше — только по кнопке «Обновить».",
    saveNew: "Сохранить как новый",
    reset: "Сбросить по умолчанию",
    png: "Экспорт графика (PNG)",
    aiBrief: "Сводка для ИИ анализа",
    aiBriefTip: "Скачивает файл с подсказкой и данными — вставьте в ChatGPT или другой ИИ.",
    aiBriefDetailed: "Подробная сводка",
    aiBriefDetailedTip: "Больше данных: поминутные агрегаты и крупнее выборка.",
    aiMenuHint: "Файл с подсказкой и данными для ИИ",
    showOnChart: "Показать",
    hideOnChart: "Убрать",
    hideOthers: "Убрать другие",
    btnImportHR: "Импорт ЧСС (CSV/FIT)",
    btnClearImports: "Очистить импорт",
    impOffset: "Сдвиг импорта (с)",
    grpCtlIntervals: "Интервалы (SIT + HIIT + Заруба)",
    grpCtlSteady: "Ровная работа (Зона 2 + Зона 3–4)",
    btnZarEmom: "Пресет 30/30",
    hiitRestFrac: "Цель в отдыхе (% HRR)",
    sportLevel: "Формула HRmax",
    slTip: "Используется, когда поле Макс. пульса пустое: Фокс 220−возраст, Танака 208−0.7×возраст, Геллиш 207−0.7×возраст.",
    optSL: {
        general: "220 − возраст (Фокс)",
        tanaka: "Танака (208 − 0.7×возраст)",
        gellish: "Геллиш (207 − 0.7×возраст)"
    },
    showSummary: "Показать сводку",
    summaryTitle: "Сводка тренировки",
    summaryNotLoaded: "Логика сводки не загружена.",
    impTrim: "Обрезать начало (с)",
    impTrimAuto: "Авто",
    impTrimClear: "Сброс",
    impTrimApply: "Применять к графику",
    impAlign0: "Совместить с 0с"
}
};

function setupEmptyToDefaultNumberInputs(){
    try {
        const els = Array.from(document.querySelectorAll('input[type="number"]'));
        for (const el of els) {
            if (el._emptyDefaultWired) continue;
            const fix = () => {
                const v = String(el.value ?? '').trim();
                if (v !== '') return;
                const def = String(el.defaultValue ?? '').trim();
                if (def !== '') {
                    el.value = def;
                } else {
                    const minAttr = el.getAttribute('min');
                    if (minAttr != null && String(minAttr).trim() !== '') el.value = String(minAttr);
                }
                try { render(); } catch(_) {}
            };
            el.addEventListener('blur', fix);
            el.addEventListener('change', fix);
            el._emptyDefaultWired = true;
        }
    } catch(_) {}
}

function _zarGetSelectedDurSec() {
    try {
        const mode = ($("zarMode")?.value === 'universal') ? 'universal' : 'classic';
        const id = (mode === 'universal') ? 'zarDurU' : 'zarDurC';
        return Math.max(30, Math.floor(+($(id)?.value || 300)));
    } catch (_) {
        return 300;
    }
}

function _zarFormatDurMin(sec) {
    const s = Math.max(0, Math.floor(+sec || 0));
    const min = s / 60;
    if (s % 60 === 0) return String(Math.round(min));
    // Slider step is 30s, so 1 decimal is enough (e.g. 7.5).
    return String(min.toFixed(1)).replace(/\.0$/, '');
}

function _zarUpdateOptimizeBtnLabel() {
    try {
        const btn = $("btnZarOptimize");
        if (!btn) return;
        const durSec = _zarGetSelectedDurSec();
        const mTxt = _zarFormatDurMin(durSec);
        btn.textContent = (LANG === 'ru') ? `Оптимизировать ${mTxt} мин` : `Optimize ${mTxt} min`;
    } catch (_) {}
}

    // --- info texts ---
    I18N.en.info = {
    tauHdr: "τ_ON / τ_OFF",
    tau: ["τ_ON = how fast HR rises at work onset (reaction speed)", "τ_OFF = how fast HR recovers when work stops (recovery speed)", "Smaller τ → faster response; key marker of fitness and fatigue"],
    hdrQuick: "Quick guide",
    hdrNotes: "Coach notes",
    hdrDisc: "Disclaimer",
    disc: "This tool is educational and heuristic. Consider your health status and consult a professional if unsure.",
    SIT: {
    quick: [
    "Two-bell swings = “safe sprint”: low impact, high posterior-chain drive.",
    "Deep thrusters = legs + shoulders + lungs; moderate load, crisp speed.",
    "Goblet squats = powerful but simple; keep form tight.",
    "Snatches = for experienced; explosive, whole-body."
    ], notes: [
    "Technique first: intensity multiplies your form.",
    "All-out ≠ reckless: maximal power with control.",
    "Auto-regulate: if HRR worsens, extend rest or reduce load.",
    "Rotate exercises to keep local fatigue low and output high."
    ]
},
    HIIT: {
    quick: ["Work bouts 1–4 min at Z4–Z5 power.", "Active recovery 1–3 min (Z2–Z3)."],
    notes: ["Keep intervals consistent; stop before form breaks.", "Long Z4 exposure → higher cortisol & cardio stress."]
},
    Z2: {
    quick: ["Steady aerobic base at Z2.", "Nasal breathing and full conversation test."],
    notes: ["Build volume gradually; consistency > hero workouts.", "Great for recovery days and mitochondrial base."]
},
    Z34: {
    quick: ["Tempo / steady Z3–Z4 for 20–45 min.", "Controlled, sustainable pace."],
    notes: ["Watch chronic Z3–4 load; periodize with easy days.", "Useful pre-race to lift LT without full HIIT."]
},
    STR: {
    quick: ["3–5 × 3–8 reps, full rest.", "Focus on big compounds; quality > fatigue."],
    notes: ["Technique governs safety; don’t chase failure daily.", "Pairs well with Z2 on separate days."]
},
    ZRB: {
    quick: [
    "EMOM: each minute do a short all-business effort, then recover until the next minute.",
    "Pick a crisp movement you can repeat cleanly (e.g., swings, thrusters, burpees)."
    ],
    notes: [
    "Set the 'on' window (e.g., 15–25s); the rest of the minute is recovery.",
    "Keep RPE high but technique perfect; stop if form degrades."
    ]
},
    TRIMP: {
    quick: [
    "Weighted HR load excluding warm-up/cool-down.",
    "Formula: TRIMP = ∫ f(t) · e^{b·f(t)} dt, where f(t) = (HR(t) − HRrest)/(HRmax − HRrest) if HRR is on, else f = HR(t)/HRmax.",
    "b ≈ 1.92 for males and 1.67 for females (set via selector)."
    ],
    notes: [
    "Interpretation: higher number → higher internal load.",
    "Units are arbitrary (AU) but comparable across sessions with same settings.",
    "Zonal load is a simpler step-weight alternative using Z2..Z5 buckets."
    ]
},
    TRIMP: {
    quick: [
    "Weighted HR load excluding warm-up/cool-down.",
    "Formula: TRIMP = ∫ f(t) · e^{b·f(t)} dt, where f(t) = (HR(t) − HRrest)/(HRmax − HRrest) if HRR is on, else f = HR(t)/HRmax.",
    "b ≈ 1.92 for males and 1.67 for females (set via selector)."
    ],
    notes: [
    "Interpretation: higher number → higher internal load.",
    "Units are arbitrary (AU) but comparable across sessions with same settings.",
    "Zonal load is a simpler step-weight alternative using Z2..Z5 buckets."
    ]
}
};
    I18N.ru.info = {
    tauHdr: "τ_ON / τ_OFF",
    tau: ["τ_ON = насколько быстро ЧСС растёт при начале работы (скорость реакции)", "τ_OFF = насколько быстро ЧСС восстанавливается после нагрузки (скорость восстановления)", "Меньше τ → быстрее реакция; важный маркер тренированности и усталости"],
    hdrQuick: "Краткое руководство",
    hdrNotes: "Заметки тренера",
    hdrDisc: "Дисклеймер",
    disc: "Инструмент образовательный и эвристический. Учитывайте своё состояние здоровья и при сомнениях консультируйтесь со специалистом.",
    SIT: {
    quick: [
    "Махи двумя гирями = «безопасный спринт»: низкая ударная нагрузка, мощная задняя цепь.",
    "Трастеры/швунги: ноги + плечи + дыхание; умеренный вес, чёткая скорость.",
    "Гоблет-присед: просто и мощно; следите за формой.",
    "Рывки: для опытных; взрывная, всё тело."
    ], notes: [
    "Сначала техника: интенсивность усилиет именно её.",
    "All-out ≠ безрассудно: максимальная мощность под контролем.",
    "Автоподстройка: если HRR ухудшается, добавьте отдых или снизьте нагрузку.",
    "Чередуйте упражнения, чтобы не «забивать» локально."
    ]
},
    HIIT: {
    quick: ["Работа 1–4 мин в Z4–Z5.", "Активный отдых 1–3 мин (Z2–З3)."],
    notes: ["Держите интервалы ровными; остановитесь до срыва техники.", "Долгая Z4 → выше кортизол и кардио-стресс."]
},
    Z2: {
    quick: ["Ровная аэробная база в Z2.", "Дыхание носом, «разговорный» тест."],
    notes: ["Наращивайте объём постепенно; регулярность важнее «подвигов».", "Хорошо для восстановления и митохондриальной базы."]
},
    Z34: {
    quick: ["Темповая / ровная Z3–Z4 на 20–45 мин.", "Контролируемый, устойчивый темп."],
    notes: ["Следите за хронической Z3–4; периодизируйте лёгкими днями.", "Полезно перед стартами, чтобы поднять ПАНО без жёсткого HIIT."]
},
    STR: {
    quick: ["3–5 × 3–8 повторов, полный отдых.", "Базовые многосуставные; качество > усталость."],
    notes: ["Техника = безопасность; не гоните отказ ежедневно.", "Хорошо сочетается с Z2 в разные дни."]
},
    ZRB: {
    quick: [
    "EMOM: каждую минуту короткий интенсивный отрезок, затем отдых до старта следующей минуты.",
    "Выберите понятное движение, которое можно повторять чисто (махи, трастеры, бёрпи)."
    ],
    notes: [
    "Задайте длительность работы в минуте (например, 15–25с); остальное — восстановление.",
    "Держите высокую RPE, но техника — безупречна; прекращайте при срыве формы."
    ]
},
    TRIMP: {
    quick: [
    "Взвешенная нагрузка по ЧСС без разминки/заминки.",
    "Формула: TRIMP = ∫ f(t) · e^{b·f(t)} dt, где f(t) = (HR(t) − HRrest)/(HRmax − HRrest) при HRR, иначе f = HR(t)/HRmax.",
    "b ≈ 1.92 для мужчин и 1.67 для женщин (выбирается в селекторе)."
    ],
    notes: [
    "Интерпретация: большее число → больше внутренняя нагрузка.",
    "Единицы условные (AU), но пригодны для сравнения при одинаковых настройках.",
    "Зонная нагрузка — простой аналог на ступенчатых весах зон Z2..Z5."
    ]
}
};
    // Language source of truth:
    // 1) URL param ?lang=ru|en (useful when localStorage is unavailable/unreliable, e.g. file://)
    // 2) localStorage sit_lang
    // 3) default 'ru'
    const _urlLang = (() => {
        try {
            const v = new URLSearchParams(window.location.search || '').get('lang');
            return (v === 'ru' || v === 'en') ? v : null;
        } catch (_) {
            return null;
        }
    })();
    let LANG = _urlLang || localStorage.getItem("sit_lang") || "ru";
    try { localStorage.setItem("sit_lang", LANG); } catch (_) {}
    // If URL explicitly requests a language, do not let presets/last-state override it.
    const URL_LANG_LOCKED = !!_urlLang;
    // Clean up the URL so a stale ?lang= does not override future toggles or reloads.
    if (URL_LANG_LOCKED) {
        try {
            const u = new URL(window.location.href);
            u.searchParams.delete('lang');
            const newUrl = u.pathname + (u.searchParams.toString() ? ('?' + u.searchParams.toString()) : '') + (u.hash || '');
            history.replaceState(null, '', newUrl);
        } catch (_) {}
    }
    let CURRENT_PRESET = null; // tracks the name of the last loaded/saved preset

    function t(k) { return I18N[LANG][k] ?? k }
        // ----- Methods dropdown helpers (global) -----
        function selectedMethods() {
            return {
                SIT: !!($("msit")?.checked),
                HIIT: !!($("mhiit")?.checked),
                ZRB: !!($("mzar")?.checked),
                SN: !!($("msn")?.checked),
                SW: !!($("msw")?.checked),
                Z2: !!($("mz2")?.checked),
                Z34: !!($("mz34")?.checked)
            };
        }
        function setSelectedMethods(sel) {
            if ($("msit")) $("msit").checked = !!sel.SIT;
            if ($("mhiit")) $("mhiit").checked = !!sel.HIIT;
            if ($("mzar")) $("mzar").checked = !!sel.ZRB;
            if ($("msn")) $("msn").checked = !!sel.SN;
            if ($("msw")) $("msw").checked = !!sel.SW;
            if ($("mz2")) $("mz2").checked = !!sel.Z2;
            if ($("mz34")) $("mz34").checked = !!sel.Z34;
        }
        function updateMethodDropdownLabels() {
            const btn = $("methodDropdownBtn");
            const hint = $("methodSelectedHint");
            if (!btn || !hint) return;
            const names = [];
            const S = selectedMethods();
            if (S.SIT) names.push(I18N[LANG].legend.SIT);
            if (S.HIIT) names.push(I18N[LANG].legend.HIIT);
            if (S.ZRB) names.push(I18N[LANG].legend.ZRB);
            if (S.SN) names.push(I18N[LANG].legend.SN);
            if (S.SW) names.push(I18N[LANG].legend.SW || (LANG==='ru'?'Махи (гири)':'Swings (KB)'));
            if (S.Z2) names.push(I18N[LANG].legend.Z2);
            if (S.Z34) names.push(I18N[LANG].legend.Z34);
            const cnt = names.length;
            btn.textContent = (LANG==='ru' ? 'Методы' : 'Methods') + (cnt ? ` (${cnt})` : '…');
            hint.textContent = cnt ? names.join(', ') : (LANG==='ru' ? 'ничего не выбрано' : 'none selected');
            // sync menu checkboxes
            if ($("msit")) $("msit").checked = !!S.SIT;
            if ($("mhiit")) $("mhiit").checked = !!S.HIIT;
            if ($("mzar")) $("mzar").checked = !!S.ZRB;
            if ($("msn")) $("msn").checked = !!S.SN;
            if ($("msw")) $("msw").checked = !!S.SW;
            if ($("mz2")) $("mz2").checked = !!S.Z2;
            if ($("mz34")) $("mz34").checked = !!S.Z34;
        }
        function setupMethodDropdown() {
            const btn = $("methodDropdownBtn");
            const menu = $("methodDropdownMenu");
            if (!btn || !menu) return;
            const toggle = () => {
                const open = menu.style.display !== 'none';
                menu.style.display = open ? 'none' : 'block';
                btn.setAttribute('aria-expanded', open ? 'false' : 'true');
            };
            btn.addEventListener('click', (e)=>{ e.stopPropagation(); toggle(); });
            const onChange = ()=>{
                const sel = {
                    SIT: !!($("msit")?.checked),
                    HIIT: !!($("mhiit")?.checked),
                    ZRB: !!($("mzar")?.checked),
                    SN: !!($("msn")?.checked),
                    SW: !!($("msw")?.checked),
                    Z2: !!($("mz2")?.checked),
                    Z34: !!($("mz34")?.checked)
                };
                setSelectedMethods(sel);
                updateMethodDropdownLabels();
                try { updateShowButtonsVisibility(); } catch(_){}
                if (typeof render === 'function') render();
            };
            ["msit","mhiit","mzar","msn","msw","mz2","mz34"].forEach(id => {
                const el = $(id);
                if (el) el.addEventListener('change', onChange);
            });
            document.addEventListener('click', (e)=>{
                if (!menu.contains(e.target) && e.target !== btn) {
                    menu.style.display = 'none';
                    btn.setAttribute('aria-expanded','false');
                }
            });
            updateMethodDropdownLabels();
        }
    window.addEventListener('DOMContentLoaded', setupMethodDropdown);
        // Ensure we have a sensible default selection on first load
        function ensureDefaultMethodSelection() {
            try {
                const S = selectedMethods();
                if (!S.SIT && !S.HIIT && !S.ZRB && !S.SN && !S.SW && !S.Z2 && !S.Z34) {
                    setSelectedMethods({ SIT: true, HIIT: true, ZRB: false, SN: false, SW: false, Z2: true, Z34: true });
                    updateMethodDropdownLabels();
                }
            } catch (_) { /* ignore */ }
        }
        // Wire 'Show on chart' buttons to select the current method
        function wireShowButtons() {
            document.querySelectorAll('.showMethodBtn').forEach(btn => {
                if (btn._wired) return;
                btn.addEventListener('click', () => {
                    const code = btn.dataset.m;
                    if (!code) return;
                    const S = selectedMethods();
                    S[code] = true;
                    setSelectedMethods(S);
                    updateMethodDropdownLabels();
                    try { updateShowButtonsVisibility(); } catch(_){}
                    if (typeof render === 'function') render();
                });
                btn._wired = true;
            });
        }
        // Wire 'Hide from chart' buttons to unselect the current method
        function wireHideButtons() {
            document.querySelectorAll('.hideMethodBtn').forEach(btn => {
                if (btn._wired) return;
                btn.addEventListener('click', () => {
                    const code = btn.dataset.m;
                    if (!code) return;
                    const S = selectedMethods();
                    S[code] = false;
                    setSelectedMethods(S);
                    updateMethodDropdownLabels();
                    try { updateShowButtonsVisibility(); } catch(_){ }
                    if (typeof render === 'function') render();
                });
                btn._wired = true;
            });
        }
        // Wire 'Hide others' buttons to keep only current method
        function onlyThisMethod(code, save = true){
            if (!code) return;
            const all = ['SIT','HIIT','ZRB','SN','SW','Z2','Z34'];
            const S = {};
            all.forEach(k => { S[k] = (k === code); });
            setSelectedMethods(S);
            updateMethodDropdownLabels();
            try { updateShowButtonsVisibility(); } catch(_){ }
            if (typeof render === 'function') render();
            if (save) {
                try { saveLastStateDebounced(); } catch(_){ }
            }
        }
        function wireOnlyButtons() {
            // Direct listeners (in case buttons exist now)
            document.querySelectorAll('.onlyMethodBtn').forEach(btn => {
                if (btn._wired) return;
                btn.addEventListener('click', () => { onlyThisMethod(btn.dataset.m); });
                btn._wired = true;
            });
            // Delegated listener as a safety net for any future dynamic DOM updates
            if (!document._onlyBtnDelegated) {
                document.addEventListener('click', (e) => {
                    const btn = e.target && e.target.closest ? e.target.closest('.onlyMethodBtn') : null;
                    if (!btn) return;
                    onlyThisMethod(btn.dataset.m);
                });
                document._onlyBtnDelegated = true;
            }
        }
        // Control Show/Hide buttons visibility per current selection and visible card
        function updateShowButtonsVisibility() {
            const S = selectedMethods();
            const visibleCard = (function(){
                const ids = ['SIT','HIIT','ZRB','SN','SW','Z2','Z34'];
                for (const id of ids) {
                    const el = document.getElementById('card'+id);
                    if (el && el.style.display !== 'none') return id;
                }
                return null;
            })();
            const cntShown = Object.values(S).filter(Boolean).length;
            document.querySelectorAll('.showMethodBtn').forEach(btn => {
                const code = btn.dataset.m;
                const isSelected = !!S[code];
                const isCurrent = (visibleCard === code);
                btn.style.display = (!isSelected && isCurrent) ? '' : 'none';
                btn.textContent = t('showOnChart');
            });
            document.querySelectorAll('.hideMethodBtn').forEach(btn => {
                const code = btn.dataset.m;
                const isSelected = !!S[code];
                const isCurrent = (visibleCard === code);
                btn.style.display = (isSelected && isCurrent) ? '' : 'none';
                btn.textContent = t('hideOnChart');
            });
            document.querySelectorAll('.onlyMethodBtn').forEach(btn => {
                const code = btn.dataset.m;
                const isSelected = !!S[code];
                const isCurrent = (visibleCard === code);
                btn.style.display = (isSelected && isCurrent && cntShown > 1) ? '' : 'none';
                btn.textContent = t('hideOthers');
            });
        }

        function _tmicGetLoadedJsBuildVersion() {
            try {
                const scripts = Array.from(document.scripts || []);
                const src = scripts.map(s => String(s?.src || '')).find(u => u.includes('zone-comparator.js')) || '';
                if (!src) return '';
                try {
                    const u = new URL(src, window.location.href);
                    return String(u.searchParams.get('v') || '');
                } catch (_) {
                    const m = src.match(/[?&]v=([^&#]+)/);
                    return m ? decodeURIComponent(m[1]) : '';
                }
            } catch (_) {
                return '';
            }
        }

        function _tmicUpdateBuildBadge() {
            try {
                const el = $("buildVer");
                if (!el) return;
                const v = _tmicGetLoadedJsBuildVersion();
                if (v) {
                    el.style.display = '';
                    el.textContent = ` · js ${v}`;
                    el.title = `zone-comparator.js?v=${v}`;
                } else {
                    el.textContent = '';
                    el.title = '';
                    el.style.display = 'none';
                }
            } catch (_) {}
        }

    function setText() {
    document.documentElement.lang = LANG;
    $("ttl").innerHTML = t("title") + " <span class='ver'>v2.0</span><span class='ver' id='buildVer'></span>";
    _tmicUpdateBuildBadge();
    $("subttl").textContent = t("sub"); $("langLab").textContent = t("language"); $("langBtn").textContent = t("capLang");
        // Help link should follow the current language (single entry point).
        if ($("helpLink")) {
            const base = (LANG === 'ru') ? "./help-ru.html" : "./help-en.html";
            let from = '';
            try { from = encodeURIComponent(String(location.href || '')); } catch (_) { from = ''; }
            $("helpLink").href = base + "?lang=" + (LANG === 'ru' ? 'ru' : 'en') + (from ? ("&from=" + from) : "");
            $("helpLink").title = t('helpTip');
        }
        if ($("helpLabel")) $("helpLabel").textContent = t('help');
    $("hInputs").textContent = t("inputs"); $("labAge").childNodes[0].nodeValue = t("age") + " "; $("capMax").textContent = t("maxCap");
    if ($("labBodyWeight")) { $("labBodyWeight").textContent = t("bodyWeight") + " "; }
    $("labRest").textContent = t("rest"); $("labMax").textContent = t("max"); if ($("capHrMaxAuto")) $("capHrMaxAuto").textContent = t("hrMaxAutoInline"); if ($("labFitHrMax")) $("labFitHrMax").textContent = t("fitHrMax"); if ($("capFitHrMax")) $("capFitHrMax").textContent = t("fitHrMaxCap"); if ($("capMaxOverride")) $("capMaxOverride").textContent = t("maxOverride"); $("labHRR").textContent = t("useHRR"); $("labHRRShort").textContent = t("useHRRShort");
    $("labDrift").childNodes[0].nodeValue = t("drift") + " "; $("sumAdv").innerHTML = `<span class="ctrlCaret">▾</span>${t("adv")}`;
    $("labTauOn").childNodes[0].nodeValue = t("tauOn") + " "; $("labTauOff").childNodes[0].nodeValue = t("tauOff") + " "; $("labWarm").childNodes[0].nodeValue = t("warm") + " "; $("labCool").childNodes[0].nodeValue = t("cool") + " "; if($("labPost")) $("labPost").childNodes[0].nodeValue = t("post") + " ";
    if ($("hZones")) $("hZones").textContent = t("zones");
    if ($("hChart")) $("hChart").textContent = t("chart");
    if ($("capChart")) $("capChart").textContent = t("capChart");
    $("hShown").textContent = t("shown");
    // Update dropdown labels and hint
    updateMethodDropdownLabels();
    // Methods dropdown: localize checkbox labels
    if ($("labMSIT")) { $("labMSIT").textContent = I18N[LANG].meth?.SIT || "SIT"; }
    if ($("labMHIIT")) { $("labMHIIT").textContent = I18N[LANG].meth?.HIIT || "HIIT"; }
    if ($("labMZRB")) { $("labMZRB").textContent = I18N[LANG].meth?.ZRB || "Zaruba"; }
    if ($("labMSN")) { $("labMSN").textContent = I18N[LANG].meth?.SN || (LANG==='ru' ? 'Рывок (гири)' : 'Snatch (KB)'); }
    if ($("labMSW")) { $("labMSW").textContent = (I18N[LANG].meth?.SW || (LANG==='ru' ? 'Махи (гири)' : 'Swings (KB)')); }
    if ($("labMZ2")) { $("labMZ2").textContent = I18N[LANG].meth?.Z2 || (LANG==='ru' ? 'Зона 2' : 'Zone 2'); }
    if ($("labMZ34")) { $("labMZ34").textContent = I18N[LANG].meth?.Z34 || (LANG==='ru' ? 'Зона 3–4' : 'Zone 3–4'); }
    $("hSIT").textContent = t("sit"); $("labSitW").childNodes[0].nodeValue = t("work") + " "; $("labSitR").childNodes[0].nodeValue = t("restS") + " "; $("labSitN").childNodes[0].nodeValue = t("intervals") + " ";
    $("hHIIT").textContent = t("hiit"); $("labHiitW").childNodes[0].nodeValue = t("work") + " "; $("labHiitR").childNodes[0].nodeValue = t("restS") + " "; $("labHiitN").childNodes[0].nodeValue = t("intervals") + " ";
    if ($("labHiitRestEff")) $("labHiitRestEff").childNodes[0].nodeValue = (I18N[LANG].hiitRestEff || (LANG==='ru' ? 'Интенсивность отдыха (RPE)' : 'Rest intensity (RPE)')) + " ";
    if ($("hZRB")) { $("hZRB").textContent = I18N[LANG].meth?.ZRB || "Zaruba"; }
    if ($("labZarMode")) { $("labZarMode").textContent = (LANG === 'ru' ? 'Режим' : 'Mode'); }
    if ($("optZarClassic")) { $("optZarClassic").textContent = (LANG === 'ru' ? 'Заруба (классика)' : 'Zaruba (Classic)'); }
    if ($("optZarUniversal")) { $("optZarUniversal").textContent = (LANG === 'ru' ? 'Заруба (универсал)' : 'Zaruba (Universal)'); }
    // Zaruba Classic labels
    if ($("labZarDurC")) { $("labZarDurC").childNodes[0].nodeValue = (LANG === "ru" ? "Длительность" : "Duration") + " "; }
    if ($("labZarOnC")) { $("labZarOnC").childNodes[0].nodeValue = (LANG === "ru" ? "Работа (с)" : "On (s)") + " "; }
    if ($("labZarOffC")) { $("labZarOffC").childNodes[0].nodeValue = (LANG === "ru" ? "Отдых (с)" : "Off (s)") + " "; }
    if ($("labZarEffC")) {
        const effLabelC = (I18N[LANG].effRPE || (LANG === 'ru' ? 'Интенсивность (RPE)' : 'Effort (RPE)'));
        $("labZarEffC").childNodes[0].nodeValue = effLabelC + " ";
    }

    // Zaruba Universal labels
    if ($("labZarDurU")) { $("labZarDurU").childNodes[0].nodeValue = (LANG === "ru" ? "Длительность" : "Duration") + " "; }
    if ($("labZarOnU")) { $("labZarOnU").childNodes[0].nodeValue = (LANG === "ru" ? "Работа (с)" : "On (s)") + " "; }
    if ($("labZarOffU")) { $("labZarOffU").childNodes[0].nodeValue = (LANG === "ru" ? "Отдых (с)" : "Off (s)") + " "; }
    if ($("labZarEffU")) {
        const kin = String($("zarKinU")?.value || 'hiit').toLowerCase();
        const sitLike = (kin === 'sit');
        const effLabelU = sitLike
            ? (LANG === 'ru' ? 'Усилие (0–10)' : 'Effort (0–10)')
            : (LANG === 'ru' ? 'Интенсивность (0–10)' : 'Intensity (0–10)');
        $("labZarEffU").childNodes[0].nodeValue = effLabelU + " ";
        if ($("zarEffU")) {
            $("zarEffU").min = "0";
            $("zarEffU").max = "10";
            const cur = +$("zarEffU").value;
            if (!Number.isFinite(cur)) $("zarEffU").value = "5";
        }
    }

    // Universal Zaruba: rest intensity is ignored in SIT-like kinetics
    syncZarUniversalRestEffUI();
    if ($("labZarKinU")) { $("labZarKinU").textContent = (LANG === 'ru' ? 'Кинетика' : 'Kinetics'); }
    if ($("optZarKinHiit")) { $("optZarKinHiit").textContent = (LANG === 'ru' ? 'как HIIT' : 'HIIT-like'); }
    if ($("optZarKinSit")) { $("optZarKinSit").textContent = (LANG === 'ru' ? 'как SIT' : 'SIT-like'); }
    if ($("labZarRestEffU")?.childNodes?.length) {
        $("labZarRestEffU").childNodes[0].nodeValue = (LANG === 'ru'
            ? 'Интенсивность отдыха (отн., 10=работа)'
            : 'Rest intensity (relative, 10=work)') + ' ';
    }
    {
    const zMode = $("zarMode")?.value || 'classic';
    if ($("zarHint")) {
        $("zarHint").textContent = (zMode === 'universal')
            ? (LANG === 'ru'
                ? 'Универсальный конструктор интервалов: длительность + работа/отдых + (опционально) своя схема'
                : 'Universal interval constructor: total duration + work/rest + (optional) custom pattern')
            : (LANG === 'ru'
                ? 'Соревновательный формат: задайте On/Off и количество раундов'
                : 'Competition-style intervals: configure On/Off and rounds');
    }
}
    $("hZ2").textContent = t("z2"); $("labZ2Min").childNodes[0].nodeValue = t("dur") + " "; $("hZ34").textContent = t("z34"); $("labZ34Min").childNodes[0].nodeValue = t("dur") + " ";
    // Snatch labels
    if ($("hSN")) { $("hSN").textContent = I18N[LANG].meth?.SN || (LANG==='ru' ? 'Рывок (гири)' : 'Snatch (KB)'); }
    if ($("labSnMin")?.childNodes?.length) { $("labSnMin").childNodes[0].nodeValue = (LANG==='ru' ? 'Длительность (мин)' : 'Duration (min)') + ' '; }
    if ($("labSnWeight")?.childNodes?.length) { $("labSnWeight").childNodes[0].nodeValue = (LANG==='ru' ? 'Вес гири (кг)' : 'Bell weight (kg)') + ' '; }
    if ($("labSnCad")?.childNodes?.length) { $("labSnCad").childNodes[0].nodeValue = (LANG==='ru' ? 'Темп (подъёмов/мин)' : 'Cadence (rpm)') + ' '; }
    if ($("labSnProt")) { $("labSnProt").textContent = (LANG==='ru' ? 'Протокол' : 'Protocol'); }
    if ($("optSnClassic")) { $("optSnClassic").textContent = (LANG==='ru' ? 'Классика (1 смена)' : 'Classical (1 change)'); }
    if ($("optSnArmy")) { $("optSnArmy").textContent = (LANG==='ru' ? 'Армейский (свободные смены)' : 'Army (free changes)'); }
    if ($("labSnChange")) { $("labSnChange").textContent = (LANG==='ru' ? 'Смена руки на (мин)' : 'Change at (min)'); }
    if ($("snHint")) { $("snHint").textContent = (LANG==='ru' ? 'Позже подстроим формулы по реальным данным. Сейчас — первый приближённый расчёт.' : 'We will tune coefficients later using real data. This is a first approximation.'); }
    // Swings labels
    if ($("hSW")) { $("hSW").textContent = (I18N[LANG].meth?.SW || (LANG==='ru' ? 'Махи (гири)' : 'Swings (KB)')); }
    if ($("labSwMin")?.childNodes?.length) { $("labSwMin").childNodes[0].nodeValue = (LANG==='ru' ? 'Длительность (мин)' : 'Duration (min)') + ' '; }
    if ($("labSwEff")?.childNodes?.length) { $("labSwEff").childNodes[0].nodeValue = (LANG==='ru'?'Интенсивность (2–10)':'Intensity (2–10)') + ' '; }
    if ($("labSwWeight")?.childNodes?.length) { $("labSwWeight").childNodes[0].nodeValue = (LANG==='ru' ? 'Вес гири (кг)' : 'Bell weight (kg)') + ' '; }
    if ($("labSwStyle")) { $("labSwStyle").textContent = (LANG==='ru' ? 'Стиль' : 'Style'); }
    if ($("optSwStyleUniversal")) { $("optSwStyleUniversal").textContent = (LANG==='ru' ? 'Универсальный (гибкий)' : 'Universal (flex)'); }
    if ($("optSwStyleChest1H")) { $("optSwStyleChest1H").textContent = (LANG==='ru' ? 'До груди (1 рука)' : 'Chest-height (1H)'); }
    if ($("optSwStyleOverhead2H")) { $("optSwStyleOverhead2H").textContent = (LANG==='ru' ? 'Над головой (2 руки)' : 'Overhead (2H)'); }
    if ($("labSwProt")) { $("labSwProt").textContent = (LANG==='ru' ? 'Протокол' : 'Protocol'); }
    if ($("optSwClassic")) { $("optSwClassic").textContent = (LANG==='ru' ? 'Классика (1 смена)' : 'Classical (1 change)'); }
    if ($("optSwArmy")) { $("optSwArmy").textContent = (LANG==='ru' ? 'Армейский (свободные смены)' : 'Army (free changes)'); }
    if ($("labSwChange")) { $("labSwChange").textContent = (LANG==='ru' ? 'Смена руки на (мин)' : 'Change at (min)'); }
    if ($("swHint")) { $("swHint").textContent = (LANG==='ru' ? 'Универсальная модель махов + частные стили. Универсальный режим — самый гибкий. Доработаем по данным.' : 'Unified swings model + style presets. Universal is the most flexible. We will refine with data.'); }
    if ($("labActivity")) {
    $("labActivity").textContent = t("activity");
    const acts = I18N[LANG].acts || { kb: "Kettlebells", run: "Running", bike: "Bike trainer" };
    if ($("optActKb")) $("optActKb").textContent = acts.kb;
    if ($("optActRun")) $("optActRun").textContent = acts.run;
    if ($("optActBike")) $("optActBike").textContent = acts.bike;
}
    
    // (selectedMethods and setSelectedMethods are defined above for msit/mhiit/... checkboxes)
    
    if ($("btnCSV1")) $("btnCSV1").textContent = t("csv1");
    if ($("btnCSV2")) $("btnCSV2").textContent = t("csv2");
    if ($("btnShare")) $("btnShare").textContent = t("share");
    if ($("btnShareScheme")) $("btnShareScheme").textContent = t("shareScheme");
    if ($("btnStateExport")) $("btnStateExport").textContent = (LANG==='ru' ? 'Сохранить состояние (JSON)' : 'Save state (JSON)');
    if ($("btnStateImport")) $("btnStateImport").textContent = (LANG==='ru' ? 'Загрузить состояние (JSON)' : 'Load state (JSON)');
    if ($("btnPrint")) $("btnPrint").textContent = t("print");
    if ($("btnBig")) $("btnBig").textContent = t("big");
    if ($("exportDropdownBtn")) $("exportDropdownBtn").textContent = (LANG==='ru' ? 'Экспорт' : 'Export');
    if ($("shareDropdownBtn")) $("shareDropdownBtn").textContent = (LANG==='ru' ? 'Шеринг' : 'Share');
    if ($("presetsDropdownBtn")) $("presetsDropdownBtn").textContent = (LANG==='ru' ? 'Пресеты' : 'Presets');
    if ($("btnPresetsExport")) $("btnPresetsExport").textContent = (LANG==='ru' ? 'Сохранить пресеты (JSON)' : 'Save presets (JSON)');
    if ($("btnPresetsImport")) $("btnPresetsImport").textContent = (LANG==='ru' ? 'Загрузить пресеты (JSON)' : 'Load presets (JSON)');
    if ($("btnPresetExportOne")) $("btnPresetExportOne").textContent = (LANG==='ru' ? 'Сохранить выбранный пресет' : 'Save selected preset');
    if ($("btnPresetImportOne")) $("btnPresetImportOne").textContent = (LANG==='ru' ? 'Загрузить пресет' : 'Load preset');
    if ($("importDropdownBtn")) $("importDropdownBtn").textContent = (LANG==='ru' ? 'Импорт' : 'Import');
    if ($("aiDropdownBtn")) $("aiDropdownBtn").textContent = (LANG==='ru' ? 'ИИ' : 'AI');
    if ($("btnAIBrief")) { $("btnAIBrief").textContent = t("aiBrief"); $("btnAIBrief").title = t("aiBriefTip"); }
    if ($("btnAIBriefDetailed")) { $("btnAIBriefDetailed").textContent = t("aiBriefDetailed"); $("btnAIBriefDetailed").title = t("aiBriefDetailedTip"); }
    if ($("aiMenuHint")) { $("aiMenuHint").textContent = t("aiMenuHint"); }
    if ($("btnImport")) $("btnImport").textContent = t("btnImportHR");
    if ($("btnClearImports")) $("btnClearImports").textContent = t("btnClearImports");
    if ($("impAlign0")) { $("impAlign0").textContent = t("impAlign0"); }
    document.querySelectorAll('.onlyMethodBtn').forEach(btn => { btn.textContent = t('hideOthers'); });
    $("presetName").placeholder = t("presetName"); $("btnSave").textContent = t("save"); $("btnLoad").textContent = t("load"); $("btnDel").textContent = t("del");
    $("hTable").textContent = t("table"); $("capPol").textContent = t("capPol");
    const H = I18N[LANG].th2;
    $("thMethod").innerHTML = H.Method;
    $("thTypical").innerHTML = H.Typical;
    $("thTime").innerHTML = H.Time;
    $("thWR").innerHTML = H.WR;
    $("thHRR").innerHTML = H.HRR;
    $("thFast").innerHTML = H.Fast;
    $("thBDNF").innerHTML = H.BDNF;
    $("thCort").innerHTML = H.Cort;
    $("thCardio").innerHTML = H.Cardio;
    $("thInjury").innerHTML = H.Injury;
    $("thEff").innerHTML = H.Eff;
    $("thLoad").innerHTML = H.Load;
    $("thZLoad").innerHTML = H.ZLoad;
    if ($("thCalories")) { $("thCalories").innerHTML = H.Calories; }
    $("bigTitle").textContent = t("bigTitle"); $("bigCap").textContent = t("bigHint");
    if ($("btnScheme")) $("btnScheme").textContent = (LANG === 'ru' ? 'Схема…' : 'Scheme…');
    if ($("btnTimer")) $("btnTimer").textContent = (LANG === 'ru' ? 'Таймер' : 'Timer');
    if ($("summaryTitle")) { $("summaryTitle").textContent = t("summaryTitle"); }
    if ($("showSummaryBtn")) { $("showSummaryBtn").textContent = t("showSummary"); }
    $("hDisc").textContent = I18N[LANG].info.hdrDisc;
    $("discText").textContent = I18N[LANG].info.disc;
    $("btnSaveNew").textContent = t("saveNew");
    $("btnReset").textContent = t("reset");
    $("btnPNG").textContent = t("png");
    if ($("hConfig")) $("hConfig").textContent = t("config");
    if ($("labEditMethod")) $("labEditMethod").textContent = t("editMethod");
    if ($("editHint")) $("editHint").textContent = t("editHint");
    if ($("impOffLab")) $("impOffLab").textContent = (t("impOffset") + ":");
    if ($("impTrimLab")) $("impTrimLab").textContent = (t("impTrim") + ":");
    if ($("impTrimAuto")) $("impTrimAuto").textContent = t("impTrimAuto");
    if ($("impTrimClear")) $("impTrimClear").textContent = t("impTrimClear");
    if ($("impTrimAffectsChartLab")) $("impTrimAffectsChartLab").textContent = t("impTrimApply");
    if ($("sumCtlIntervals")) $("sumCtlIntervals").innerHTML = `<span class="ctrlCaret">▾</span>${t("grpCtlIntervals")}`;
    if ($("sumCtlSteady")) $("sumCtlSteady").innerHTML = `<span class="ctrlCaret">▾</span>${t("grpCtlSteady")}`;
    $("sumInputs").innerHTML = `<span class="ctrlCaret">▾</span>${t("inputs")}`;
    if ($("btnZarEmom")) { $("btnZarEmom").textContent = t("btnZarEmom"); }
    if ($("labZarBeeper")) $("labZarBeeper").textContent = (LANG==='ru' ? 'Сигналы:' : 'Beeper:');
    if ($("btnZarBeepStart")) $("btnZarBeepStart").textContent = (LANG==='ru' ? 'Старт' : 'Start');
    if ($("btnZarBeepStop")) $("btnZarBeepStop").textContent = (LANG==='ru' ? 'Стоп' : 'Stop');
    if ($("btnZarBigScreen")) $("btnZarBigScreen").textContent = (LANG==='ru' ? 'Заруба таймер' : 'Zaruba Timer');
    if ($("labZarBeepVol")) $("labZarBeepVol").textContent = (LANG==='ru' ? 'Звук' : 'Sound');
    if ($("zarScreenTitle")) $("zarScreenTitle").textContent = (LANG==='ru' ? 'Заруба таймер' : 'Zaruba Timer');
    if ($("zarScreenStart")) $("zarScreenStart").textContent = (LANG==='ru' ? 'Старт' : 'Start');
    if ($("zarScreenPlan")) $("zarScreenPlan").textContent = (LANG==='ru' ? 'План' : 'Plan');
    if ($("zarScreenStop")) $("zarScreenStop").textContent = (LANG==='ru' ? 'Стоп' : 'Stop');
    if ($("labZarScreenCountUp")) $("labZarScreenCountUp").textContent = (LANG==='ru' ? 'Прямой таймер' : 'Count up');
    if ($("labZarScreenBarGrow")) $("labZarScreenBarGrow").textContent = (LANG==='ru' ? 'Полоска: прогресс' : 'Bar: progress');
    if ($("labZarScreenCountdownSec")) $("labZarScreenCountdownSec").textContent = (LANG==='ru' ? 'Отсчёт (сек)' : 'Countdown (sec)');
    if ($("labZarScreenVoice")) $("labZarScreenVoice").textContent = (LANG==='ru' ? 'Голос' : 'Voice');
    if ($("labZarScreenVoiceReps")) $("labZarScreenVoiceReps").textContent = (LANG==='ru' ? 'Х повторов' : 'X reps');
    if ($("labZarScreenSayReps")) $("labZarScreenSayReps").textContent = (LANG==='ru' ? 'Повторы' : 'Reps');
    if ($("labZarScreenSayTempo")) $("labZarScreenSayTempo").textContent = (LANG==='ru' ? 'Темп' : 'Tempo');
    if ($("labZarScreenSayIntensity")) $("labZarScreenSayIntensity").textContent = (LANG==='ru' ? 'Интенсивность' : 'Intensity');
    if ($("labZarScreenMetro")) $("labZarScreenMetro").textContent = (LANG==='ru' ? 'Метроном' : 'Metronome');
    if ($("labZarScreenMusic")) $("labZarScreenMusic").textContent = (LANG==='ru' ? 'Музыка' : 'Music');
    if ($("labZarScreenMusicFile")) $("labZarScreenMusicFile").textContent = (LANG==='ru' ? 'MP3' : 'MP3');
    if ($("labZarScreenMusicLoop")) $("labZarScreenMusicLoop").textContent = (LANG==='ru' ? 'Повтор' : 'Loop');
    if ($("zarScreenPresetSally")) {
        $("zarScreenPresetSally").textContent = (LANG==='ru' ? 'Салли' : 'Sally');
        try { $("zarScreenPresetSally").title = (LANG==='ru' ? 'Пресет: Салли (настроит схему + таймер)' : 'Preset: Sally (set scheme + timer)'); } catch (_) {}
    }
    if ($("labZarScreenMusicVol")) $("labZarScreenMusicVol").textContent = (LANG==='ru' ? 'Музыка' : 'Music');
    if ($("labZarScreenWake")) $("labZarScreenWake").textContent = (LANG==='ru' ? 'Не гасить экран' : 'Keep awake');
    if ($("labZarScreenVibrate")) $("labZarScreenVibrate").textContent = (LANG==='ru' ? 'Вибрация' : 'Vibrate');
    if ($("zarScreenVibrateTest")) $("zarScreenVibrateTest").textContent = (LANG==='ru' ? 'Тест' : 'Test');
    if ($("labZarScreenVibrateMul")) $("labZarScreenVibrateMul").textContent = (LANG==='ru' ? 'Сила вибрации' : 'Vibration strength');
    if ($("labZarScreenMetroRpm")) $("labZarScreenMetroRpm").textContent = (LANG==='ru' ? 'RPM (0=авто/0)' : 'RPM (0=auto/0)');
    if ($("labZarScreenMetroHz")) $("labZarScreenMetroHz").textContent = (LANG==='ru' ? 'Гц' : 'Hz');
    if ($("labZarScreenMetroVol")) $("labZarScreenMetroVol").textContent = (LANG==='ru' ? 'Клик' : 'Click');
    // Tooltips for Big Screen settings (override HTML defaults)
    try {
        const tWake = (LANG === 'ru')
            ? 'Не давать экрану гаснуть во время таймера (если поддерживается)'
            : 'Prevent screen from sleeping while timer is active (if supported)';
        const tBar = (LANG === 'ru')
            ? 'Полоска интервала: выкл = осталось (убывает справа налево), вкл = прогресс (растёт слева направо)'
            : 'Interval bar: off = remaining (shrinks right-to-left), on = progress (grows left-to-right)';
        const tCountdown = (LANG === 'ru')
            ? 'Обратный отсчёт перед стартом (секунды). 0 = старт без отсчёта.'
            : 'Countdown before start (seconds). 0 = start immediately.';
        const tVib = (LANG === 'ru')
            ? 'Вибрация на обратном отсчёте / смене фаз (если поддерживается)'
            : 'Vibrate on countdown / phase switches (if supported)';
        const tVibTest = (LANG === 'ru')
            ? 'Проверить вибрацию (зависит от устройства/браузера)'
            : 'Test vibration (depends on device/browser)';
        const tVibMul = (LANG === 'ru')
            ? 'Умножитель длительности вибро-импульсов. Полезно, если вибрация слишком слабая.'
            : 'Scales vibration pulse durations. Useful if vibration feels too weak.';
        const tVoiceReps = (LANG === 'ru')
            ? 'Озвучивать плановые повторы для текущего рабочего интервала'
            : 'Announce planned reps for the current work block';
        const tSayReps = (LANG === 'ru')
            ? 'Голос: говорить повторы (если доступны)'
            : 'Voice: say reps (if available)';
        const tSayTempo = (LANG === 'ru')
            ? 'Голос: говорить темп (RPM)'
            : 'Voice: say tempo (RPM)';
        const tSayIntensity = (LANG === 'ru')
            ? 'Голос: говорить интенсивность (0–10)'
            : 'Voice: say intensity (0–10)';
        const tRpm = (LANG === 'ru')
            ? 'RPM метронома: 0 = авто (если есть авто-темп), иначе 0 (без метронома)'
            : 'Metronome RPM: 0 = auto (if available), otherwise 0 (no metronome)';
        const tHz = (LANG === 'ru')
            ? 'Тон клика метронома (частота)'
            : 'Metronome click tone (frequency)';
        const tVol = (LANG === 'ru')
            ? 'Громкость клика метронома (относительная)'
            : 'Metronome click volume (relative)';
        const tMusic = (LANG === 'ru')
            ? 'Проигрывать выбранный mp3 вместе с таймером'
            : 'Play selected mp3 along with the timer';
        const tMusicLoop = (LANG === 'ru')
            ? 'Зациклить музыку'
            : 'Loop music';
        const tMusicVol = (LANG === 'ru')
            ? 'Громкость музыки'
            : 'Music volume';
        const tMasterVol = (LANG === 'ru')
            ? 'Общая громкость сигналов и метронома'
            : 'Master volume for beeps and metronome';

        const setTitle = (id, txt) => {
            const el = $(id);
            if (el) el.title = txt;
            const wrap = el?.closest ? el.closest('label') : null;
            if (wrap) wrap.title = txt;
        };
        setTitle('zarScreenWake', tWake);
        setTitle('zarScreenBarGrow', tBar);
        setTitle('zarScreenVibrate', tVib);
        setTitle('zarScreenVibrateTest', tVibTest);
        setTitle('zarScreenVibrateMul', tVibMul);
        setTitle('zarScreenVoiceReps', tVoiceReps);
        setTitle('zarScreenCountdownSec', tCountdown);
        setTitle('zarScreenSayReps', tSayReps);
        setTitle('zarScreenSayTempo', tSayTempo);
        setTitle('zarScreenSayIntensity', tSayIntensity);
        setTitle('zarScreenMetroRpm', tRpm);
        setTitle('zarScreenMetroHz', tHz);
        setTitle('zarScreenMetroVol', tVol);
        setTitle('zarScreenMusic', tMusic);
        setTitle('zarScreenMusicLoop', tMusicLoop);
        setTitle('zarScreenMusicVol', tMusicVol);
        setTitle('zarBeepVol', tMasterVol);
    } catch (_) {}
    if ($("zarRotateHintTitle")) $("zarRotateHintTitle").textContent = (LANG==='ru' ? 'Поверните телефон вертикально' : 'Rotate to portrait');
    if ($("zarRotateHintSub")) $("zarRotateHintSub").textContent = (LANG==='ru' ? 'Таймер — только вертикально' : 'Timer is portrait-only');
    try { _zarScreenUpdateVibrateMulLabel(); } catch (_) {}
    try { _zarScreenUpdateSysStatus(); } catch (_) {}

    if ($("zarPlanTitle")) $("zarPlanTitle").textContent = (LANG==='ru' ? 'План' : 'Plan');
    if ($("zarPlanThTime")) $("zarPlanThTime").textContent = (LANG==='ru' ? 'Время' : 'Time');
    if ($("zarPlanThInterval")) $("zarPlanThInterval").textContent = (LANG==='ru' ? 'Интервал' : 'Interval');
    if ($("zarPlanThTempo")) $("zarPlanThTempo").textContent = (LANG==='ru' ? 'Темп' : 'Tempo');
    if ($("zarPlanThReps")) $("zarPlanThReps").textContent = (LANG==='ru' ? 'Повт.' : 'Reps');
    if ($("zarPlanThTotal")) $("zarPlanThTotal").textContent = (LANG==='ru' ? 'Итого' : 'Total');
    if ($("zpPlanSum")) $("zpPlanSum").innerHTML = `<span class="ctrlCaret">▾</span>${(LANG === 'ru' ? 'План' : 'Plan')}`;
    if ($("zpPlanThTime")) $("zpPlanThTime").textContent = (LANG==='ru' ? 'Время' : 'Time');
    if ($("zpPlanThInterval")) $("zpPlanThInterval").textContent = (LANG==='ru' ? 'Интервал' : 'Interval');
    if ($("zpPlanThTempo")) $("zpPlanThTempo").textContent = (LANG==='ru' ? 'Темп' : 'Tempo');
    if ($("zpPlanThReps")) $("zpPlanThReps").textContent = (LANG==='ru' ? 'Повт.' : 'Reps');
    if ($("zpPlanThTotal")) $("zpPlanThTotal").textContent = (LANG==='ru' ? 'Итого' : 'Total');

    if ($("zpLibSum")) $("zpLibSum").innerHTML = `<span class="ctrlCaret">▾</span>${(LANG === 'ru' ? 'Библиотека' : 'Library')}`;
    if ($("zpLibPresetHdr")) $("zpLibPresetHdr").textContent = (LANG === 'ru' ? 'Готовые схемы' : 'Presets');
    if ($("zpLibMyHdr")) $("zpLibMyHdr").textContent = (LANG === 'ru' ? 'Мои схемы' : 'My schemes');
    if ($("zpLibSave")) $("zpLibSave").textContent = (LANG === 'ru' ? 'Сохранить' : 'Save');
    if ($("zpLibName")) $("zpLibName").placeholder = (LANG === 'ru' ? 'Название' : 'Name');
    if ($("zpLibHint")) $("zpLibHint").textContent = (LANG === 'ru'
        ? 'Сохранение локально в браузере (на этом устройстве)'
        : 'Saved locally in your browser (on this device)');
    if ($("zpLibXHdr")) $("zpLibXHdr").textContent = (LANG === 'ru' ? 'Перенос / бэкап' : 'Transfer / backup');
    if ($("zpLibExport")) $("zpLibExport").textContent = (LANG === 'ru' ? 'Экспорт' : 'Export');
    if ($("zpLibCopyJson")) $("zpLibCopyJson").textContent = (LANG === 'ru' ? 'Копировать' : 'Copy');
    if ($("zpLibImport")) $("zpLibImport").textContent = (LANG === 'ru' ? 'Импорт' : 'Import');
    if ($("zpLibJson")) $("zpLibJson").placeholder = (LANG === 'ru' ? 'JSON (одной строкой)…' : 'JSON (single line)…');
    _zarUpdateOptimizeBtnLabel();
    if ($("labZarTarget")) $("labZarTarget").textContent = (LANG==='ru' ? 'Цель (повт.):' : 'Target reps:');
    if ($("btnZarTarget")) $("btnZarTarget").textContent = (LANG==='ru' ? 'Схема под цель' : 'Plan for target');
    if ($("btnZarCopy")) $("btnZarCopy").textContent = t('copy');
    if ($("zpmCopy")) $("zpmCopy").textContent = t('copy');
    if ($("zpExplainSum")) $("zpExplainSum").innerHTML = `<span class="ctrlCaret">▾</span>${t('explain')}`;
    if ($("zpHelpSum")) $("zpHelpSum").innerHTML = `<span class="ctrlCaret">▾</span>${t('helpPanel')}`;
    if ($("zpExplainUpdate")) $("zpExplainUpdate").textContent = t('explainUpdate');
    if ($("zpExplainCopy")) $("zpExplainCopy").textContent = t('copy');
    if ($("zpExplainHint")) $("zpExplainHint").textContent = `${t('explainLead')} ${t('explainHint')}`;
    // Pattern UI labels (if present)
    if ($("btnZarPattern")) {
        $("btnZarPattern").textContent = (LANG==='ru'? 'Схема…' : 'Pattern…');
        try { $("btnZarPattern").title = (LANG==='ru' ? 'Открыть редактор схемы' : 'Open pattern editor'); } catch (_) {}
    }
    if ($("btnZarClear")) $("btnZarClear").textContent = (LANG==='ru'? 'Сброс схемы' : 'Clear pattern');
    if ($("labZarPattern")) $("labZarPattern").textContent = (LANG==='ru'? 'Схема:' : 'Pattern:');
    if ($("zarPatternHint")) $("zarPatternHint").textContent = '';
    // Optimizer UI labels (if present)
    if ($("labZarOpt")) $("labZarOpt").textContent = (LANG==='ru' ? 'Оптимизатор' : 'Optimizer');
    if ($("sumZarOpt")) $("sumZarOpt").innerHTML = `<span class="ctrlCaret">▾</span>${(LANG==='ru' ? 'Оптимизатор' : 'Optimizer')}`;
    if ($("labZarOptAllOut")) $("labZarOptAllOut").textContent = (LANG==='ru' ? 'Держу all-out (с)' : 'All-out sustain (sec)');
    if ($("labZarOptCad")) $("labZarOptCad").textContent = (LANG==='ru' ? 'Темп на максимуме (повт/мин)' : 'Cadence @ max (rpm)');
    if ($("labZarOptTempoMin")) $("labZarOptTempoMin").textContent = (LANG==='ru' ? 'Мин. темп (% от max)' : 'Tempo min (% of max)');
    if ($("labZarOptTempoSteps")) $("labZarOptTempoSteps").textContent = (LANG==='ru' ? 'Вариантов темпа' : 'Tempo variants');
    if ($("labZarOptRec")) $("labZarOptRec").textContent = (LANG==='ru' ? 'Восстановление tau (с)' : 'Recovery tau (sec)');
    if ($("labZarOptSwitch")) $("labZarOptSwitch").textContent = (LANG==='ru' ? 'Цена переключения (с)' : 'Switch cost (sec)');
    if ($("labZarOptTempoPow")?.childNodes?.length) {
        $("labZarOptTempoPow").childNodes[0].nodeValue = (LANG==='ru' ? 'Экспонента усталости по темпу' : 'Tempo fatigue exponent') + ' ';
        try {
            const v = +($("zarOptTempoPow")?.value || 1.4);
            if ($("zarOptTempoPowV")) $("zarOptTempoPowV").textContent = (Number.isFinite(v) ? v.toFixed(2) : '1.40');
        } catch (_) {}
    }
    if ($("labZarOptTempoSustainPow")?.childNodes?.length) {
        $("labZarOptTempoSustainPow").childNodes[0].nodeValue = (LANG==='ru' ? 'Экспонента лимита удержания темпа' : 'Tempo sustain cap exponent') + ' ';
        try {
            const v = +($("zarOptTempoSustainPow")?.value || 3.0);
            if ($("zarOptTempoSustainPowV")) $("zarOptTempoSustainPowV").textContent = (Number.isFinite(v) ? v.toFixed(2) : '3.00');
        } catch (_) {}
    }
    if ($("labZarOptCycles")) $("labZarOptCycles").textContent = (LANG==='ru' ? 'Циклы (0=авто)' : 'Cycles (0=auto)');
    if ($("labZarOptFinish")) $("labZarOptFinish").textContent = (LANG==='ru' ? 'Финишный рывок (с, 0=выкл)' : 'Finish sprint (sec, 0=off)');
    if ($("btnZarOptAuto")) {
        $("btnZarOptAuto").textContent = (LANG === 'ru' ? 'Авто' : 'Auto');
        try { $("btnZarOptAuto").title = (LANG === 'ru' ? 'Сбросить: Cycles=0 и Finish sprint=0' : 'Reset: Cycles=0 and Finish sprint=0'); } catch (_) {}
    }
    if ($("zpTitle")) $("zpTitle").textContent = (LANG==='ru' ? 'Своя схема Зарубы' : 'Zaruba custom plan');
    if ($("zpmCancel")) $("zpmCancel").textContent = (LANG==='ru' ? 'Отмена' : 'Cancel');
    if ($("zpmApply")) {
        $("zpmApply").textContent = (LANG==='ru' ? 'Применить' : 'Apply');
        try { $("zpmApply").title = (LANG==='ru' ? 'Применить, не закрывая окно' : 'Apply without closing'); } catch (_) {}
    }
    if ($("zpmConvertPT")) $("zpmConvertPT").textContent = (LANG==='ru' ? 'п↔т' : 'r↔t');
    if ($("zpmEditUniversal")) {
        $("zpmEditUniversal").textContent = (LANG==='ru' ? 'В Universal' : 'Edit in Universal');
        try {
            $("zpmEditUniversal").title = (LANG==='ru')
                ? 'Перенести схему в Universal Zaruba и редактировать там'
                : 'Transfer scheme into Universal Zaruba and edit there';
        } catch (_) {}
    }
    if ($("zpmSave")) {
        $("zpmSave").textContent = (LANG==='ru' ? 'Ввод' : 'Enter');
        try { $("zpmSave").title = (LANG==='ru' ? 'Применить и закрыть (Enter)' : 'Apply and close (Enter)'); } catch (_) {}
    }
    if ($("zpInput")) $("zpInput").placeholder = (LANG==='ru' ? 'напр., (30@8t20 20@8t15 0/10 30@8t20)*3 или 20/0*3' : 'e.g., (30@8t20 20@8t15 0/10 30@8t20)*3 or 20/0*3');
    if ($("zarPatMsg")) $("zarPatMsg").textContent = (LANG==='ru'
        ? 'Введите произвольную схему Работа/Отдых. Примеры: 30/30 x5, 30/30 *5, 20/40,25/35 или пары 30 30 20 40. Группы: ( ... )*N, напр. (30@8т20 20@8т15 0/10 30@8т20)*3. EMOM/вехи: 20/0*3 или просто 20/0 (повторяется по кругу до конца Duration). Маркеры конца: ";" — схема выполняется один раз, а оставшееся время (если оно есть) идёт обычными раундами On/Off (по ползункам On/Off). "#" — полный стоп: тренировка завершается сразу после схемы (Duration становится равной длине схемы). Важно: ";" и "#" — глобальные маркеры: всё, что написано после них, игнорируется. Для шаринга одной строкой схемы "#" — единственный способ гарантировать одинаковый график у другого человека (без полного JSON). Интенсивность на блок: 120/120*5@8.5/2 60/60*5@7 (формат @работа/отдых; @/2 — только отдых). Темп (метроном) на блок: тXX (или tXX), напр. 30/20@8т15/2т60. Или можно задать план повторов на работе: пNN (взаимоисключимо с тXX), напр. 20@8п12.' 
        : 'Enter free-form On/Off pattern. Examples: 30/30 x5, 30/30 *5, 20/40,25/35, or pairs 30 30 20 40. Groups: ( ... )*N, e.g. (30@8t20 20@8t15 0/10 30@8t20)*3. EMOM/milestones: 20/0*3 or just 20/0 (repeats until Duration ends). End markers: ";" runs the pattern once, then the remainder (if any) follows the default On/Off engine (from the On/Off sliders). "#" is a hard stop: workout ends right after the pattern (Duration becomes the pattern length). Important: ";" and "#" are global markers — anything written after them is ignored. If you share just a pattern string, "#" is the only way to guarantee the same chart for someone else (without sharing full JSON). Per-block intensity: 120/120*5@8.5/2 60/60*5@7 (format @work/rest; @/2 sets only rest). Per-block tempo override: tXX/тXX, e.g. 30/20@8t15/2t60. Or set a work reps target: rNN (mutually exclusive with tXX), e.g. 20@8r12.');
    if ($("zarPatMsg2")) $("zarPatMsg2").textContent = (LANG==='ru'
        ? 'Поддерживаются множители x/х (кириллица), × и *. Можно писать 5x30/30, 5*30/30, 30/30x5, 30/30*5. Скобки групп работают так же: ( ... )*3. Интенсивность/отдых можно писать суффиксом @8.5/2 или отдельным токеном: 30/30x5 @8.5/2. @8.5 — фиксирует только работу. @/2 — только отдых. @0 означает «нет работы» — время ON симулируется как отдых (хвост типа 0/180). Темп для метронома: тXX (или tXX). План повторов для работы: пNN (взаимоисключимо с тXX). Кнопка «п↔т» конвертирует между ними.'
        : 'Supports multipliers x (Latin), x (Cyrillic), × and *. You can write 5x30/30, 5*30/30, 30/30x5, or 30/30*5. Group parentheses also work: ( ... )*3. Work/rest intensities can be set via suffix @8.5/2 or a standalone token: 30/30x5 @8.5/2. @8.5 sets only work. @/2 sets only rest. @0 means “no work” — ON time is simulated as rest (tails like 0/180).');

    if ($("zarPatMiniSpec")) $("zarPatMiniSpec").textContent = (LANG === 'ru'
        ? [
            'Мини-спека директив @...:',
            '- тXX / tXX — темп метронома (rpm) для работы в этом блоке',
            '- .../2тYY — темп метронома (rpm) для отдыха в этом блоке (опционально)',
            '- пNN — цель повторов на работе: сделать N повторов за ON-время',
            '  (темп подбирается автоматически; пNN взаимоисключимо с тXX в этом же work-блоке)',
            '',
            'Примеры:',
            '30/20@8т15/2т60',
            '20@8п12'
        ].join('\n')
        : [
            'Mini spec for @... directives:',
            '- tXX / тXX — metronome tempo (rpm) for WORK in this block',
            '- .../2tYY — metronome tempo (rpm) for REST in this block (optional)',
            '- rNN — work reps target: do N reps during the ON time',
            '  (tempo is derived automatically; rNN is mutually exclusive with tXX for the same work block)',
            '',
            'Examples:',
            '30/20@8t15/2t60',
            '20@8r12'
        ].join('\n'));
    if ($("labZarScreenSettings")) $("labZarScreenSettings").textContent = (LANG==='ru' ? 'Настройки' : 'Settings');
    if ($("sumZarScreenSettings")) $("sumZarScreenSettings").innerHTML = `<span class="ctrlCaret">▾</span>${(LANG==='ru' ? 'Настройки' : 'Settings')}`;
    if ($("labTrimpSex")) $("labTrimpSex").textContent = (LANG==='ru' ? 'Нагрузка (TRIMP): пол' : 'HR Load (TRIMP): sex');
    if ($("optTrimpM")) $("optTrimpM").textContent = (LANG==='ru' ? 'Муж' : 'Male');
    if ($("optTrimpF")) $("optTrimpF").textContent = (LANG==='ru' ? 'Жен' : 'Female');
    // Localize 'Show/Hide on chart' buttons
    document.querySelectorAll('.showMethodBtn').forEach(btn => { btn.textContent = t('showOnChart'); });
    document.querySelectorAll('.hideMethodBtn').forEach(btn => { btn.textContent = t('hideOnChart'); });
}

function _zarVibrateTestClick() {
    try {
        if (!_zarScreen?.open) return;
        const vib = navigator?.vibrate;
        if (typeof vib !== 'function') {
            alert(LANG === 'ru' ? 'Вибрация (navigator.vibrate) не поддерживается в этом браузере.' : 'Vibration (navigator.vibrate) is not supported in this browser.');
            return;
        }
        // Use a distinct pattern so it is noticeable.
        const mul = _zarScreenVibrateMul();
        const scale = (x) => {
            const v = +x;
            if (!Number.isFinite(v)) return 0;
            return Math.max(0, Math.min(2500, Math.round(v * mul)));
        };
        vib.call(navigator, [scale(35), scale(40), scale(35)]);
    } catch (_) {}
}

// --- Zaruba beeper (audio cues for start/stop) ---
let _zarBeeper = {
    running: false,
    audioCtx: null,
    gain: null,
    timeouts: [],
    startedAt: 0,
    endsAt: 0
};

// --- Zaruba big screen (fullscreen timer + countdown) ---
let _zarScreen = {
    open: false,
    running: false,
    paused: false,
    pausedElapsedSec: 0,
    started: false,
    countdownActive: false,
    durSec: 300,
    phases: [],
    phaseIdx: 0,
    preSwitchWarnedIdx: -1,
    lastPhaseIdx: -1,
    startPerf: 0,
    audioStartTime: 0,
    tickId: 0,
    timeouts: [],
    endCountdownArmed: false,
    finishCountdownLast: -1,
    workPhaseCount: 0,
    clickPlan: null
};

// --- Zaruba Big Screen: settings persistence + wake lock + vibration ---
const _ZAR_SCREEN_SETTINGS_KEY = 'zarScreenSettings.v1';
let _zarWake = { lock: null, lastErr: '' };

function _zarScreenWakeEnabled() {
    try {
        const el = $("zarScreenWake");
        if (!el) return true; // default: on
        return !!el.checked;
    } catch (_) {
        return true;
    }
}

function _zarScreenVibrateEnabled() {
    try {
        const el = $("zarScreenVibrate");
        if (!el) return false;
        return !!el.checked;
    } catch (_) {
        return false;
    }
}

function _zarScreenVibrateMul() {
    try {
        const el = $("zarScreenVibrateMul");
        const v = +(el?.value);
        if (!Number.isFinite(v)) return 2.0;
        return Math.max(0.5, Math.min(6.0, v));
    } catch (_) {
        return 2.0;
    }
}

function _zarScreenUpdateVibrateMulLabel() {
    try {
        const el = $("zarScreenVibrateMulV");
        if (!el) return;
        el.textContent = `${_zarScreenVibrateMul().toFixed(1)}×`;
    } catch (_) {}
}

function _zarVibrate(pattern) {
    try {
        if (!_zarScreen?.open) return;
        if (!_zarScreenVibrateEnabled()) return;
        const vib = navigator?.vibrate;
        if (typeof vib !== 'function') return;

        const mul = _zarScreenVibrateMul();
        const scale = (x) => {
            const v = +x;
            if (!Number.isFinite(v)) return 0;
            return Math.max(0, Math.min(2500, Math.round(v * mul)));
        };
        const scaled = Array.isArray(pattern) ? pattern.map(scale) : scale(pattern);
        vib.call(navigator, scaled);
    } catch (_) {}
}

async function _zarWakeAcquireAsync() {
    try {
        if (_zarWake.lock) return true;
        const wl = navigator?.wakeLock;
        if (!wl || typeof wl.request !== 'function') return false;
        const lock = await wl.request('screen');
        _zarWake.lock = lock;
        _zarWake.lastErr = '';
        try {
            lock.addEventListener('release', () => {
                _zarWake.lock = null;
                try { _zarScreenUpdateSysStatus(); } catch (_) {}
            });
        } catch (_) {}
        return true;
    } catch (e) {
        _zarWake.lastErr = String(e && (e.name || e.message) || '');
        _zarWake.lock = null;
        return false;
    }
}

async function _zarWakeReleaseAsync() {
    try {
        const lock = _zarWake.lock;
        _zarWake.lock = null;
        if (!lock) return;
        if (typeof lock.release === 'function') await lock.release();
    } catch (_) {}
}

async function _zarWakeMaybeAsync() {
    const wants = !!(_zarScreen?.open)
        && _zarScreenWakeEnabled()
        && !!(_zarScreen?.running || _zarScreen?.paused || _zarScreen?.started || _zarScreen?.countdownActive);

    if (wants) await _zarWakeAcquireAsync();
    else await _zarWakeReleaseAsync();
}

function _zarWakeMaybe() {
    try {
        const p = _zarWakeMaybeAsync();
        if (p && typeof p.catch === 'function') p.catch(() => {});
    } catch (_) {}
}

function _zarScreenUpdateSysStatus() {
    try {
        const el = $("zarScreenSysStatus");
        if (!el) return;

        const wakeSupported = !!(navigator?.wakeLock && typeof navigator.wakeLock.request === 'function');
        const vibSupported = typeof navigator?.vibrate === 'function';
        const wakeOn = _zarScreenWakeEnabled();
        const vibOn = _zarScreenVibrateEnabled();
        const wakeActive = !!_zarWake.lock;
        const vibMul = _zarScreenVibrateMul();

        const wakeTxt = !wakeSupported
            ? (LANG === 'ru' ? 'экран: н/д' : 'awake: n/a')
            : (LANG === 'ru'
                ? `экран: ${wakeOn ? (wakeActive ? 'вкл' : 'ожид.') : 'выкл'}`
                : `awake: ${wakeOn ? (wakeActive ? 'on' : 'idle') : 'off'}`);
        const vibTxt = !vibSupported
            ? (LANG === 'ru' ? 'вибро: н/д' : 'vibrate: n/a')
            : (LANG === 'ru'
                ? (vibOn ? `вибро: вкл (${vibMul.toFixed(1)}×)` : 'вибро: выкл')
                : (vibOn ? `vibrate: on (${vibMul.toFixed(1)}×)` : 'vibrate: off'));

        el.textContent = `${wakeTxt} · ${vibTxt}`;
    } catch (_) {}
}

// --- Zaruba Big Screen: optional music (mp3) playback ---
const _ZAR_SCREEN_MUSIC_DB = 'zarScreenMusic.v1';
const _ZAR_SCREEN_MUSIC_STORE = 'kv';
const _ZAR_SCREEN_MUSIC_KEY = 'music';

let _zarMusic = {
    audio: null,
    url: '',
    name: '',
    type: '',
    size: 0,
    loaded: false,
    lastErr: ''
};

function _zarMusicEnsureAudioEl() {
    try {
        if (_zarMusic.audio) return _zarMusic.audio;
        const a = new Audio();
        a.preload = 'auto';
        a.loop = true;
        a.volume = _zarMusicVol01();
        _zarMusic.audio = a;
        return a;
    } catch (_) {
        return null;
    }
}

function _zarMusicEnabled() {
    try { return !!$("zarScreenMusic")?.checked; } catch (_) { return false; }
}

function _zarMusicLoopEnabled() {
    try { return !!$("zarScreenMusicLoop")?.checked; } catch (_) { return true; }
}

function _zarMusicVol01() {
    try {
        const v = +($("zarScreenMusicVol")?.value ?? 60);
        if (!Number.isFinite(v)) return 0.6;
        return Math.max(0, Math.min(1, v / 100));
    } catch (_) {
        return 0.6;
    }
}

function _zarMusicSetStatus(txt) {
    try {
        const el = $("zarScreenMusicStatus");
        if (!el) return;
        el.textContent = String(txt || '');
    } catch (_) {}
}

function _zarMusicUpdateUIStatus() {
    try {
        if (!_zarScreen?.open) return;
        const enabled = _zarMusicEnabled();
        if (!enabled) {
            _zarMusicSetStatus('');
            return;
        }
        const name = String(_zarMusic.name || '').trim();
        if (!name) {
            _zarMusicSetStatus(LANG === 'ru' ? 'Музыка: файл не выбран' : 'Music: no file selected');
            return;
        }
        const base = (LANG === 'ru' ? 'Музыка: ' : 'Music: ');
        const err = String(_zarMusic.lastErr || '').trim();
        _zarMusicSetStatus(base + name + (err ? ((LANG === 'ru' ? ' · ошибка: ' : ' · error: ') + err) : ''));
    } catch (_) {}
}

function _zarMusicRevokeUrl() {
    try {
        if (_zarMusic.url) URL.revokeObjectURL(_zarMusic.url);
    } catch (_) {}
    _zarMusic.url = '';
}

function _zarMusicApplyLoopVol() {
    try {
        const a = _zarMusicEnsureAudioEl();
        if (!a) return;
        a.loop = _zarMusicLoopEnabled();
        a.volume = _zarMusicVol01();
    } catch (_) {}
}

function _zarMusicSetUrl(url, name = '') {
    try {
        _zarMusic.lastErr = '';
        _zarMusic.loaded = false;
        const a = _zarMusicEnsureAudioEl();
        if (!a) return;

        // If we previously used an object URL, revoke it.
        _zarMusicRevokeUrl();

        const u = String(url || '').trim();
        if (!u) {
            try { a.pause(); } catch (_) {}
            try { a.removeAttribute('src'); a.load(); } catch (_) {}
            _zarMusic.name = '';
            _zarMusic.type = '';
            _zarMusic.size = 0;
            _zarMusicUpdateUIStatus();
            return;
        }

        _zarMusic.name = String(name || u.split('/').pop() || 'music.mp3');
        _zarMusic.type = _zarMusic.type || 'audio/mpeg';
        _zarMusic.size = 0;
        _zarMusic.url = '';
        a.src = u;
        _zarMusicApplyLoopVol();
        _zarMusic.loaded = true;
        _zarMusicUpdateUIStatus();
    } catch (e) {
        _zarMusic.lastErr = String(e && (e.name || e.message) || '');
        _zarMusicUpdateUIStatus();
    }
}

function _zarMusicSetFileObj(file) {
    try {
        _zarMusic.lastErr = '';
        _zarMusic.loaded = false;
        const a = _zarMusicEnsureAudioEl();
        if (!a) return;

        _zarMusicRevokeUrl();

        if (!file) {
            _zarMusic.name = '';
            _zarMusic.type = '';
            _zarMusic.size = 0;
            try { a.pause(); } catch (_) {}
            try { a.removeAttribute('src'); a.load(); } catch (_) {}
            _zarMusicUpdateUIStatus();
            return;
        }

        const inferredName = (file && typeof file === 'object' && 'name' in file) ? String(file.name || '') : '';
        _zarMusic.name = inferredName || _zarMusic.name || 'music.mp3';
        _zarMusic.type = String(file.type || _zarMusic.type || '');
        _zarMusic.size = Math.max(0, Math.floor(+file.size || 0));
        const url = URL.createObjectURL(file);
        _zarMusic.url = url;
        a.src = url;
        _zarMusicApplyLoopVol();
        _zarMusic.loaded = true;
        _zarMusicUpdateUIStatus();
    } catch (e) {
        _zarMusic.lastErr = String(e && (e.name || e.message) || '');
        _zarMusicUpdateUIStatus();
    }
}

function _zarMusicMaybeUnlockByGesture() {
    try {
        if (!_zarMusicEnabled()) return;
        const a = _zarMusicEnsureAudioEl();
        if (!a) return;
        if (!a.src) return;
        // Best-effort: attempt to get autoplay permission while we are inside a user gesture.
        const prevVol = a.volume;
        try { a.volume = 0; } catch (_) {}
        const p = a.play();
        if (p && typeof p.then === 'function') {
            p.then(() => {
                try {
                    a.pause();
                    a.currentTime = 0;
                    try { a.volume = prevVol; } catch (_) {}
                } catch (_) {}
            }).catch((e) => {
                try { a.volume = prevVol; } catch (_) {}
                _zarMusic.lastErr = String(e && (e.name || e.message) || '');
                _zarMusicUpdateUIStatus();
            });
        }
    } catch (_) {}
}

function _zarMusicPlay() {
    try {
        if (!_zarMusicEnabled()) return;
        const a = _zarMusicEnsureAudioEl();
        if (!a || !a.src) {
            _zarMusicUpdateUIStatus();
            return;
        }
        _zarMusicApplyLoopVol();
        const p = a.play();
        if (p && typeof p.catch === 'function') {
            p.catch((e) => {
                _zarMusic.lastErr = String(e && (e.name || e.message) || '');
                _zarMusicUpdateUIStatus();
            });
        }
    } catch (e) {
        _zarMusic.lastErr = String(e && (e.name || e.message) || '');
        _zarMusicUpdateUIStatus();
    }
}

function _zarMusicPause() {
    try {
        const a = _zarMusicEnsureAudioEl();
        if (!a) return;
        try { a.pause(); } catch (_) {}
    } catch (_) {}
}

function _zarMusicStopAndReset() {
    try {
        const a = _zarMusicEnsureAudioEl();
        if (!a) return;
        try { a.pause(); } catch (_) {}
        try { a.currentTime = 0; } catch (_) {}
    } catch (_) {}
}

function _zarMusicDBOpen() {
    return new Promise((resolve, reject) => {
        try {
            const req = indexedDB.open(_ZAR_SCREEN_MUSIC_DB, 1);
            req.onupgradeneeded = () => {
                try {
                    const db = req.result;
                    if (!db.objectStoreNames.contains(_ZAR_SCREEN_MUSIC_STORE)) db.createObjectStore(_ZAR_SCREEN_MUSIC_STORE);
                } catch (_) {}
            };
            req.onsuccess = () => resolve(req.result);
            req.onerror = () => reject(req.error);
        } catch (e) {
            reject(e);
        }
    });
}

async function _zarMusicSaveToDBAsync(file) {
    try {
        if (!file) return;
        if (!window.indexedDB) return;
        const buf = await file.arrayBuffer();
        const payload = {
            name: String(file.name || ''),
            type: String(file.type || ''),
            size: Math.max(0, Math.floor(+file.size || 0)),
            data: buf
        };
        const db = await _zarMusicDBOpen();
        await new Promise((resolve, reject) => {
            const tx = db.transaction(_ZAR_SCREEN_MUSIC_STORE, 'readwrite');
            const st = tx.objectStore(_ZAR_SCREEN_MUSIC_STORE);
            const r = st.put(payload, _ZAR_SCREEN_MUSIC_KEY);
            r.onsuccess = () => resolve(true);
            r.onerror = () => reject(r.error);
        });
        try { db.close(); } catch (_) {}
    } catch (_) {
        // Quota / permission errors are fine; just don't persist.
    }
}

async function _zarMusicLoadFromDBAsync() {
    try {
        if (!window.indexedDB) return;
        const db = await _zarMusicDBOpen();
        const payload = await new Promise((resolve, reject) => {
            const tx = db.transaction(_ZAR_SCREEN_MUSIC_STORE, 'readonly');
            const st = tx.objectStore(_ZAR_SCREEN_MUSIC_STORE);
            const r = st.get(_ZAR_SCREEN_MUSIC_KEY);
            r.onsuccess = () => resolve(r.result || null);
            r.onerror = () => reject(r.error);
        });
        try { db.close(); } catch (_) {}
        if (!payload || !payload.data) return;

        const blob = new Blob([payload.data], { type: payload.type || 'audio/mpeg' });
        // Some runtimes may not support File(); Blob works fine for <audio>.
        try {
            if (typeof File === 'function') {
                const f = new File([blob], payload.name || 'music.mp3', { type: payload.type || 'audio/mpeg' });
                _zarMusicSetFileObj(f);
            } else {
                _zarMusic.name = String(payload.name || 'music.mp3');
                _zarMusic.type = String(payload.type || 'audio/mpeg');
                _zarMusicSetFileObj(blob);
            }
        } catch (_) {
            _zarMusic.name = String(payload.name || 'music.mp3');
            _zarMusic.type = String(payload.type || 'audio/mpeg');
            _zarMusicSetFileObj(blob);
        }
        _zarMusicUpdateUIStatus();
    } catch (_) {
        // ignore
    }
}

function _zarMusicWireOnce() {
    try {
        if (_zarMusic._wired) return;
        const fileEl = $("zarScreenMusicFile");
        if (fileEl) {
            fileEl.addEventListener('change', () => {
                try {
                    const f = fileEl.files && fileEl.files[0] ? fileEl.files[0] : null;
                    _zarMusicSetFileObj(f);
                    const p = _zarMusicSaveToDBAsync(f);
                    if (p && typeof p.catch === 'function') p.catch(() => {});
                } catch (_) {}
            });
        }
        _zarMusic._wired = true;
    } catch (_) {}
}

function _zarScreenSettingsCollect() {
    const n = (id, minV, maxV, defV) => {
        try {
            const v = +($(id)?.value);
            if (!Number.isFinite(v)) return defV;
            return Math.max(minV, Math.min(maxV, v));
        } catch (_) { return defV; }
    };
    const b = (id, defV) => {
        try {
            const el = $(id);
            if (!el) return defV;
            return !!el.checked;
        } catch (_) { return defV; }
    };
    return {
        countUp: b('zarScreenCountUp', false),
        barGrow: b('zarScreenBarGrow', false),
        countdownSec: Math.round(n('zarScreenCountdownSec', 0, 30, 5)),
        voice: b('zarScreenVoice', false),
        voiceReps: b('zarScreenVoiceReps', false),
        sayReps: b('zarScreenSayReps', true),
        sayTempo: b('zarScreenSayTempo', true),
        sayIntensity: b('zarScreenSayIntensity', true),
        metro: b('zarScreenMetro', false),
        wake: b('zarScreenWake', false),
        vibrate: b('zarScreenVibrate', false),
        vibrateMul: n('zarScreenVibrateMul', 0.5, 6.0, 2.0),
        music: b('zarScreenMusic', false),
        musicLoop: b('zarScreenMusicLoop', true),
        musicVol: Math.round(n('zarScreenMusicVol', 0, 100, 60)),
        beepVol: Math.round(n('zarBeepVol', 0, 100, 40)),
        metroRpm: Math.round(n('zarScreenMetroRpm', 0, 240, 0)),
        metroHz: Math.round(n('zarScreenMetroHz', 200, 4000, 1650)),
        metroVol: Math.round(n('zarScreenMetroVol', 0, 200, 55))
    };
}

function _zarScreenSettingsApply(s) {
    try {
        if (!s || typeof s !== 'object') return;
        const setB = (id, v) => {
            const el = $(id);
            if (!el || !('checked' in el)) return;
            if (typeof v === 'boolean') el.checked = v;
        };
        const setN = (id, v, minV, maxV) => {
            const el = $(id);
            if (!el || !('value' in el)) return;
            if (!Number.isFinite(+v)) return;
            const vv = Math.max(minV, Math.min(maxV, +v));
            el.value = String(Math.round(vv));
        };
        const setF = (id, v, minV, maxV, digits = 1) => {
            const el = $(id);
            if (!el || !('value' in el)) return;
            if (!Number.isFinite(+v)) return;
            const vv = Math.max(minV, Math.min(maxV, +v));
            el.value = String((+vv.toFixed(digits)));
        };

        setB('zarScreenCountUp', s.countUp);
        setB('zarScreenBarGrow', s.barGrow);
        setN('zarScreenCountdownSec', s.countdownSec, 0, 30);
        setB('zarScreenVoice', s.voice);
        setB('zarScreenVoiceReps', s.voiceReps);
        setB('zarScreenSayReps', s.sayReps);
        setB('zarScreenSayTempo', s.sayTempo);
        setB('zarScreenSayIntensity', s.sayIntensity);
        setB('zarScreenMetro', s.metro);
        setB('zarScreenWake', s.wake);
        setB('zarScreenVibrate', s.vibrate);
        setF('zarScreenVibrateMul', s.vibrateMul, 0.5, 6.0, 1);
        setB('zarScreenMusic', s.music);
        setB('zarScreenMusicLoop', s.musicLoop);
        setN('zarScreenMusicVol', s.musicVol, 0, 100);
        setN('zarBeepVol', s.beepVol, 0, 100);
        setN('zarScreenMetroRpm', s.metroRpm, 0, 240);
        setN('zarScreenMetroHz', s.metroHz, 200, 4000);
        setN('zarScreenMetroVol', s.metroVol, 0, 200);

        try { _zarScreenUpdateAutoTempoStatus(); } catch (_) {}
        try { zarScreenTimerToggleChanged(); } catch (_) {}
        try { _zarScreenUpdateVibrateMulLabel(); } catch (_) {}
        try { _zarScreenUpdateSysStatus(); } catch (_) {}
        try { _zarMusicApplyLoopVol(); } catch (_) {}
        try { _zarMusicUpdateUIStatus(); } catch (_) {}
        try { _zarWakeMaybe(); } catch (_) {}
    } catch (_) {}
}

function _zarScreenSettingsSave() {
    try {
        const s = _zarScreenSettingsCollect();
        localStorage.setItem(_ZAR_SCREEN_SETTINGS_KEY, JSON.stringify(s));
    } catch (_) {}
}

function _zarScreenSettingsLoad() {
    try {
        const raw = localStorage.getItem(_ZAR_SCREEN_SETTINGS_KEY);
        if (!raw) return;
        const s = JSON.parse(raw);
        _zarScreenSettingsApply(s);
    } catch (_) {}
}

function _zarScreenSettingsWireOnce() {
    try {
        if (_zarScreen._settingsWired) return;
        const ids = [
            'zarScreenCountUp',
            'zarScreenBarGrow',
            'zarScreenCountdownSec',
            'zarScreenVoice',
            'zarScreenVoiceReps',
            'zarScreenSayReps',
            'zarScreenSayTempo',
            'zarScreenSayIntensity',
            'zarScreenMetro',
            'zarScreenWake',
            'zarScreenVibrate',
            'zarScreenVibrateMul',
            'zarScreenMusic',
            'zarScreenMusicLoop',
            'zarScreenMusicVol',
            'zarBeepVol',
            'zarScreenMetroRpm',
            'zarScreenMetroHz',
            'zarScreenMetroVol'
        ];
        const onAnyChange = (e) => {
            try {
                const id = String(e?.target?.id || '');
                if (id === 'zarScreenCountUp') {
                    try { zarScreenTimerToggleChanged(); } catch (_) {}
                }
                if (id === 'zarScreenMetroRpm') {
                    try { _zarScreenUpdateAutoTempoStatus(); } catch (_) {}
                }
                if (id === 'zarScreenVibrateMul') {
                    try { _zarScreenUpdateVibrateMulLabel(); } catch (_) {}
                }
                if (id === 'zarScreenMetroHz' || id === 'zarScreenMetroVol' || id === 'zarScreenMetro') {
                    _zarSoundPreviewDebounced('metro');
                }
                if (id === 'zarScreenMusicVol' || id === 'zarScreenMusicLoop') {
                    try { _zarMusicApplyLoopVol(); } catch (_) {}
                }
                if (id === 'zarScreenMusic') {
                    try {
                        if (!_zarMusicEnabled()) {
                            _zarMusicPause();
                        } else {
                            _zarMusicApplyLoopVol();
                            _zarMusicUpdateUIStatus();
                            // If timer is currently running (not paused), start music immediately.
                            try {
                                if (_zarScreen?.open && _zarScreen?.running && _zarScreen?.started && !_zarScreen?.paused) {
                                    _zarMusicPlay();
                                }
                            } catch (_) {}
                        }
                    } catch (_) {}
                }
                if (id === 'zarBeepVol') {
                    _zarSoundPreviewDebounced('beep');
                }
                if (id === 'zarScreenWake') {
                    try { _zarWakeMaybe(); } catch (_) {}
                }
                try { _zarMusicUpdateUIStatus(); } catch (_) {}
                try { _zarScreenUpdateSysStatus(); } catch (_) {}
                try { _zarScreenSettingsSave(); } catch (_) {}
            } catch (_) {}
        };

        for (const id of ids) {
            const el = $(id);
            if (!el) continue;
            el.addEventListener('change', onAnyChange);
            el.addEventListener('input', onAnyChange);
        }

        // WakeLock can be dropped by the UA; try to re-acquire when visible.
        document.addEventListener('visibilitychange', () => {
            try {
                if (document.visibilityState === 'visible') {
                    _zarWakeMaybe();
                }
            } catch (_) {}
        });

        // Presets
        try {
            const btnSally = $("zarScreenPresetSally");
            if (btnSally && !btnSally._wired) {
                btnSally.addEventListener('click', () => {
                    try { zarScreenApplySallyPreset(); } catch (_) {}
                });
                btnSally._wired = true;
            }
        } catch (_) {}

        _zarScreen._settingsWired = true;
    } catch (_) {}
}

function _zarSallyBuildPatternStr(opt = null) {
    // Sally training pattern: two tails + repeating down-holds sequence.
    // Core sequence matches the legacy judge bot categories:
    // 7S,1L,4S,1L,4S,1L,11S,1L (S=short, L=long) => 30 down holds.
    const o = (opt && typeof opt === 'object') ? opt : {};
    const lang = (String(o.lang || LANG).toLowerCase() === 'en') ? 'en' : 'ru';
    const tempoTok = (lang === 'ru') ? 'т' : 't';
    const pre = Number.isFinite(+o.pre) ? +o.pre : 0;
    const post = Number.isFinite(+o.post) ? +o.post : 0;
    const gap = Number.isFinite(+o.gap) ? +o.gap : 0;
    const up = Number.isFinite(+o.up) ? +o.up : 0.8;
    const lastUp = Number.isFinite(+o.lastUp) ? +o.lastUp : up;
    const shortDown = Number.isFinite(+o.shortDown) ? +o.shortDown : 4.5;
    const longDown = Number.isFinite(+o.longDown) ? +o.longDown : 10.5;
    const cycles = Number.isFinite(+o.cycles) ? Math.max(1, Math.min(50, Math.floor(+o.cycles))) : 1;
    const gapAfterLast = (o.gapAfterLast == null) ? true : !!o.gapAfterLast;
    const forceTails = !!o.forceTails;
    const forcePreTail = forceTails || !!o.forcePreTail;
    const forceGapTail = forceTails || !!o.forceGapTail;
    const forcePostTail = forceTails || !!o.forcePostTail;
    const tempo = Number.isFinite(+o.tempoRpm) ? +o.tempoRpm : 20;
    const eff = Number.isFinite(+o.eff10) ? +o.eff10 : 8.5;

    const sec01 = (v) => {
        const n = Number.isFinite(+v) ? +v : 0;
        const clamped = Math.max(0, Math.min(600, n));
        return Math.round(clamped * 100) / 100;
    };
    const fmtSec = (v) => {
        const x = sec01(v);
        return x.toFixed(2).replace(/\.00$/, '').replace(/(\.\d)0$/, '$1');
    };
    const fmtEff = (v) => {
        const x = Math.max(0, Math.min(10, Number.isFinite(+v) ? +v : 0));
        return x.toFixed(1).replace(/\.0$/, '');
    };
    const tempoRpmInt = (() => {
        const k = Math.round(tempo);
        return (Number.isFinite(k) && k > 0) ? Math.max(5, Math.min(240, k)) : 0;
    })();
    const tempoSuffix = tempoRpmInt ? `${tempoTok}${tempoRpmInt}` : '';

    // Force tempo both on WORK and REST so metronome is continuous.
    const suffix = `@${fmtEff(eff)}${tempoSuffix}/0${tempoSuffix}`;
    // Tail tokens are pure REST (on=0) but we keep rest tempo. Make it explicit as @0/0tXX.
    const tailSuffix = `@0/0${tempoSuffix}`;

    const downSeq = (() => {
        const seq = [
            ['s', 7],
            ['l', 1],
            ['s', 4],
            ['l', 1],
            ['s', 4],
            ['l', 1],
            ['s', 11],
            ['l', 1]
        ];
        const out = [];
        for (const [k, c] of seq) {
            const dur = (k === 'l') ? longDown : shortDown;
            for (let i = 0; i < c; i++) out.push(dur);
        }
        return out;
    })();

    const toks = [];
    if (forcePreTail || sec01(pre) > 0) toks.push(`0/${fmtSec(pre)}${tailSuffix}`);

    for (let c = 0; c < cycles; c++) {
        for (let i = 0; i < downSeq.length; i++) {
            const d = downSeq[i];
            const isLastDown = (i === downSeq.length - 1);
            const u = isLastDown ? lastUp : up;
            toks.push(`${fmtSec(d)}/${fmtSec(u)}${suffix}`);
        }
        const isLast = (c === cycles - 1);
        if (!isLast || gapAfterLast) {
            if (forceGapTail || sec01(gap) > 0) toks.push(`0/${fmtSec(gap)}${tailSuffix}`);
        }
    }

    if (forcePostTail || sec01(post) > 0) toks.push(`0/${fmtSec(post)}${tailSuffix}`);
    return toks.join(' ');
}

function _zarSallyBuildPatternStrFromDownStarts(downStartsSec, opt = null) {
    const o = (opt && typeof opt === 'object') ? opt : {};
    const lang = (String(o.lang || LANG).toLowerCase() === 'en') ? 'en' : 'ru';
    const tempoTok = (lang === 'ru') ? 'т' : 't';
    const pre = Number.isFinite(+o.pre) ? +o.pre : 0;
    const loopLenSec = Number.isFinite(+o.loopLenSec) ? +o.loopLenSec : 0;
    const anchorUpSec = Number.isFinite(+o.anchorUpSec) ? +o.anchorUpSec : 0;
    const shortDown = Number.isFinite(+o.shortDown) ? +o.shortDown : 4.5;
    const longDown = Number.isFinite(+o.longDown) ? +o.longDown : 10.5;
    const cycles = Number.isFinite(+o.cycles) ? Math.max(1, Math.min(50, Math.floor(+o.cycles))) : 1;
    const repeatPre = (o.repeatPre == null) ? false : !!o.repeatPre;
    const gap = Number.isFinite(+o.gap) ? +o.gap : 0;
    const lastUp = Number.isFinite(+o.lastUp) ? +o.lastUp : 0;
    const hardStop = (o.hardStop == null) ? true : !!o.hardStop;
    const tempo = Number.isFinite(+o.tempoRpm) ? +o.tempoRpm : 0;
    const eff = Number.isFinite(+o.eff10) ? +o.eff10 : 8.5;

    const sec01 = (v) => {
        const n = Number.isFinite(+v) ? +v : 0;
        const clamped = Math.max(0, Math.min(6000, n));
        return Math.round(clamped * 100) / 100;
    };
    const fmtSec = (v) => {
        const x = sec01(v);
        return x.toFixed(2).replace(/\.00$/, '').replace(/(\.\d)0$/, '$1');
    };
    const fmtEff = (v) => {
        const x = Math.max(0, Math.min(10, Number.isFinite(+v) ? +v : 0));
        return x.toFixed(1).replace(/\.0$/, '');
    };
    const tempoRpmInt = (() => {
        const k = Math.round(tempo);
        return (Number.isFinite(k) && k > 0) ? Math.max(5, Math.min(240, k)) : 0;
    })();
    const tempoSuffix = tempoRpmInt ? `${tempoTok}${tempoRpmInt}` : '';
    const repsTok = (Number.isFinite(+eff) && (+eff) > 1e-6) ? 'r1' : '';
    const suffix = `@${fmtEff(eff)}${repsTok}${tempoSuffix}/0${tempoSuffix}`;
    const tailSuffix = `@0/0${tempoSuffix}`;

    const downSeq = (() => {
        const seq = [
            ['s', 7],
            ['l', 1],
            ['s', 4],
            ['l', 1],
            ['s', 4],
            ['l', 1],
            ['s', 11],
            ['l', 1]
        ];
        const out = [];
        for (const [k, c] of seq) {
            const dur = (k === 'l') ? longDown : shortDown;
            for (let i = 0; i < c; i++) out.push(dur);
        }
        return out;
    })();

    const downs = Array.isArray(downStartsSec) ? downStartsSec.map(sec01).filter(v => Number.isFinite(v)) : [];
    if (!downs.length) throw new Error('No DOWN timestamps for Sally preset');
    const n = Math.max(1, Math.min(downs.length, downSeq.length));

    const pre01 = sec01(pre);
    const preTok = `0/${fmtSec(pre01)}${tailSuffix}`;

    // Work/rest segments for ONE cycle (derived from down-start gaps).
    const workSegs = [];

    const neg = [];

    for (let i = 0; i < n; i++) {
        const on = downSeq[i];
        const off = (i + 1 < n)
            ? (downs[i + 1] - downs[i] - on)
            : lastUp;
        const off01 = Math.round(off * 100) / 100;
        if (off01 < -1e-6) neg.push({ i: i + 1, off: off01 });
        workSegs.push(`${fmtSec(on)}/${fmtSec(Math.max(0, off01))}${suffix}`);
    }

    if (neg.length) {
        try {
            const msg = (LANG === 'ru')
                ? `Sally: найдены отрицательные паузы (${neg.length}). Проверьте таймкоды DOWN. Пример: #${neg[0].i} off=${neg[0].off}`
                : `Sally: negative rests found (${neg.length}). Check DOWN timestamps. Example: #${neg[0].i} off=${neg[0].off}`;
            alert(msg);
        } catch (_) {}
    }

    if (downs.length !== downSeq.length) {
        try {
            console.warn(`Sally preset: got ${downs.length} DOWN timestamps; canonical sequence is ${downSeq.length}. Using first ${n}.`);
        } catch (_) {}
    }

    // Produce a compact form:
    //   0/pre@0/0t20 (cycleTokens)*N#
    // where cycleTokens describe ONE cycle.
    const gap01 = sec01(gap);
    const cycleTokens = [];

    // Perfect loop mode:
    // - The audio is cut to `loopLenSec` and looped.
    // - The athlete stays DOWN across the loop boundary until `anchorUpSec` in the new loop,
    //   then continues the standard Sally pattern.
    // So we build:
    //   prefix (from 0 -> anchorUpSec, one-time)
    //   + (cycle from anchorUpSec -> next anchorUpSec)*N
    // The last DOWN inside the cycle is extended to land exactly on that anchor UP.
    const usePerfectLoop = (loopLenSec > 0 && anchorUpSec > 0 && anchorUpSec < loopLenSec);
    if (usePerfectLoop) {
        const prefixToks = [];

        // 0 -> first DOWN start
        const leadUp = Math.max(0, Math.min(anchorUpSec, downs[0]));
        if (leadUp > 0) prefixToks.push(`0/${fmtSec(leadUp)}${tailSuffix}`);

        // Build until anchorUpSec (ensure we end exactly at UP @ anchorUpSec).
        for (let i = 0; i < n; i++) {
            const downStart = downs[i];
            if (downStart >= anchorUpSec - 1e-9) break;
            let on = downSeq[i];

            // If this DOWN crosses the anchor UP, cut it to land exactly on anchorUpSec.
            if (downStart + on >= anchorUpSec - 1e-9) {
                on = Math.max(0, anchorUpSec - downStart);
                prefixToks.push(`${fmtSec(on)}/0${suffix}`);
                break;
            }

            const nextDown = (i + 1 < n) ? downs[i + 1] : Infinity;
            let off = Math.max(0, nextDown - downStart - on);

            // If the OFF crosses the anchor, cut OFF to end exactly at anchorUpSec.
            const downEnd = downStart + on;
            if (downEnd + off >= anchorUpSec - 1e-9) {
                off = Math.max(0, anchorUpSec - downEnd);
                prefixToks.push(`${fmtSec(on)}/${fmtSec(off)}${suffix}`);
                break;
            }

            prefixToks.push(`${fmtSec(on)}/${fmtSec(off)}${suffix}`);
        }

        // Cycle part: start from UP @ anchorUpSec, then follow all DOWN starts >= anchorUpSec,
        // and extend the last DOWN to reach anchorUpSec in the next loop.
        const cStart = anchorUpSec;
        const cEnd = anchorUpSec + loopLenSec;
        const startI = (() => {
            for (let i = 0; i < n; i++) if (downs[i] >= anchorUpSec - 1e-9) return i;
            return n; // no downs after anchor (shouldn't happen)
        })();

        const cycToks = [];
        let maxOffInCycle = 0;
        if (startI < n) {
            const upToFirstDown = Math.max(0, downs[startI] - cStart);
            if (upToFirstDown > 0) cycToks.push(`0/${fmtSec(upToFirstDown)}${tailSuffix}`);

            for (let i = startI; i < n; i++) {
                const downStart = downs[i];
                const isLast = (i === n - 1);
                if (!isLast) {
                    const on = downSeq[i];
                    const off = Math.max(0, (downs[i + 1] - downStart - on));
                    maxOffInCycle = Math.max(maxOffInCycle, off);
                    cycToks.push(`${fmtSec(on)}/${fmtSec(off)}${suffix}`);
                    continue;
                }

                // Last segment in the loop: keep canonical DOWN duration, extend OFF so that
                // the cycle ends exactly at the anchor UP in the next audio loop.
                const on = downSeq[i];
                const offExt = Math.max(0, cEnd - (downStart + on));
                maxOffInCycle = Math.max(maxOffInCycle, offExt);
                cycToks.push(`${fmtSec(on)}/${fmtSec(offExt)}${suffix}`);
            }
        }

        // Sanity guard: extremely large OFF usually means the anchor UP is mis-specified
        // (common: mixing 01:08.00 (68s) and 00:01.08 (1.08s)).
        if (maxOffInCycle > 20) {
            try {
                const msg = (LANG === 'ru')
                    ? `Sally: подозрительно большая пауза вверх (${fmtSec(maxOffInCycle)}с). Проверьте loopLenSec/anchorUpSec (частая ошибка: 68 vs 1.08).`
                    : `Sally: suspiciously long UP/rest (${fmtSec(maxOffInCycle)}s). Check loopLenSec/anchorUpSec (common mistake: 68 vs 1.08).`;
                alert(msg);
            } catch (_) {}
            try { console.warn('Sally perfect-loop: suspiciously long OFF', { maxOffInCycle, loopLenSec, anchorUpSec }); } catch (_) {}
        }

        // Preserve optional gap *inside* the repeated cycle (rarely needed).
        if (gap01 > 0) cycToks.push(`0/${fmtSec(gap01)}${tailSuffix}`);

        let out = '';
        if (prefixToks.length) out += `${prefixToks.join(' ')} `;

        if (cycles > 1) out += `(${cycToks.join(' ')})*${cycles}`;
        else out += cycToks.join(' ');

        if (hardStop && !/#\s*$/.test(out)) out += ' #';
        return out;
    }

    if (repeatPre && pre01 > 0) cycleTokens.push(preTok);
    for (const t of workSegs) cycleTokens.push(t);
    if (gap01 > 0) cycleTokens.push(`0/${fmtSec(gap01)}${tailSuffix}`);

    let out = '';
    if (!repeatPre && pre01 > 0) out = `${preTok} `;

    if (cycles > 1) out += `(${cycleTokens.join(' ')})*${cycles}`;
    else out += cycleTokens.join(' ');

    // IMPORTANT: keep '#' as a standalone token. If we emit "*5#" without whitespace,
    // the parser may treat "5#" as the group multiplier word and drop the '#'.
    if (hardStop && !/#\s*$/.test(out)) out += ' #';
    return out;
}

function zarScreenApplySallyPreset() {
    try {
        if (_zarScreen?.running) {
            alert(LANG==='ru' ? 'Остановите таймер перед применением пресета.' : 'Stop the timer before applying the preset.');
            return;
        }

        // Sally is a Zaruba-Universal preset. If the timer was opened for another method,
        // it may still be driven by a method timelineOverride.
        // Force-switch the Big Screen context back to Zaruba so the preset always works.
        try { _zarScreen.timelineOverride = null; } catch (_) {}
        try {
            if ('_prevAutoTempoRpm' in _zarScreen) {
                _zarAutoTempoRpm = _zarScreen._prevAutoTempoRpm;
                delete _zarScreen._prevAutoTempoRpm;
                try { _zarScreenUpdateAutoTempoStatus(); } catch (_) {}
            }
        } catch (_) {}
        try {
            const tEl = $("zarScreenTitle");
            if (tEl) tEl.textContent = (LANG === 'ru' ? 'Заруба таймер' : 'Zaruba Timer');
        } catch (_) {}
        try {
            const sel = $("editMethodSel");
            if (sel) {
                sel.value = 'ZRB';
                try { sel.dispatchEvent(new Event('change', { bubbles: true })); } catch (_) {
                    try { if (typeof showMethodCard === 'function') showMethodCard('ZRB'); } catch (_) {}
                }
            }
            try { localStorage.setItem('sit_last_edit_method', 'ZRB'); } catch (_) {}
        } catch (_) {}

        // Mark that the preset is in control (used to auto-stop Sally music when the user changes the scheme).
        _zarSallyPresetArmed = true;

        // 1) Scheme: force Universal + inject a Sally pattern.
        try {
            if ($('zarMode')) {
                $('zarMode').value = 'universal';
                try { $('zarMode').dispatchEvent(new Event('change', { bubbles: true })); } catch(_) {}
            }
        } catch (_) {}

        // Default duration: long enough for many cycles; user can adjust.
        try {
            const el = $('zarDurU');
            if (el && 'value' in el) {
                const min = Number.isFinite(+el.min) ? +el.min : 60;
                const max = Number.isFinite(+el.max) ? +el.max : 3600;
                el.value = String(Math.max(min, Math.min(max, 3600)));
            }
        } catch (_) {}
        try { if ($('zarKinU') && !$('zarKinU').value) $('zarKinU').value = 'hiit'; } catch (_) {}
        try { if ($('zarEffU')) $('zarEffU').value = '8.5'; } catch (_) {}
        try { if ($('zarRestEffU')) $('zarRestEffU').value = '0.0'; } catch (_) {}

        // Pattern: precomputed from the user's Audacity DOWN-start timestamps.
        // This yields correct variable OFF durations to sync with the audio,
        // while keeping judge/bot DOWN holds at 4.5 / 10.5 seconds.
        const downStarts = [
            2.55, 8.5, 14.45, 20.4, 26.35, 32.3, 38.3, 44.25, 56.2, 62.15,
            68.1, 74.07, 80, 92, 97.9, 103.85, 109.84, 115.8, 127.75, 133.7, 139.65,
            145.6, 151.6, 157.55, 163.5, 169.46, 175.45, 181.4, 187.4, 193.3
        ];
        const pat = _zarSallyBuildPatternStrFromDownStarts(downStarts, {
            pre: 2.55,
            // Perfect looping: the track is looped (duration fixed), but Sally ends on DOWN,
            // so we keep DOWN across the boundary until the first UP in the next loop.
            loopLenSec: 203.00,
            anchorUpSec: 1.08,
            cycles: 5,
            repeatPre: false,
            gap: 0,
            lastUp: 0,
            shortDown: 4.5,
            longDown: 10.5,
            tempoRpm: 0,
            eff10: 8.5,
            lang: LANG
        });
        try { if ($('zarPatternU')) $('zarPatternU').value = pat; } catch (_) {}
        try { if (typeof render === 'function') render(); } catch (_) {}
        try { if (typeof saveLastStateDebounced === 'function') saveLastStateDebounced(); } catch (_) {}

        // 2) Big Screen settings: metronome + music on.
        const setB = (id, v) => { try { const el = $(id); if (el && 'checked' in el) el.checked = !!v; } catch (_) {} };
        const setN = (id, v) => { try { const el = $(id); if (el && 'value' in el) el.value = String(v); } catch (_) {} };
        setB('zarScreenMetro', true);
        setN('zarScreenMetroRpm', '0');
        setB('zarScreenMusic', true);
        setB('zarScreenMusicLoop', true);
        setN('zarScreenMusicVol', '60');

        try { _zarMusicApplyLoopVol(); } catch (_) {}
        try { _zarMusicUpdateUIStatus(); } catch (_) {}
        try { _zarScreenUpdateAutoTempoStatus(); } catch (_) {}
        try { _zarScreenUpdateSysStatus(); } catch (_) {}
        try { _zarScreenSettingsSave(); } catch (_) {}
        try { _zarScreenUpdateStatic(); } catch (_) {}

        // 3) Music: if none is loaded yet, prompt for a file once.
        try {
            if (_zarMusicEnabled()) {
                // Prefer the bundled track so the user doesn't have to pick a file every time.
                const a = _zarMusicEnsureAudioEl();
                const hasSrc = !!String(a?.src || '').trim();
                const wantName = 'sally-up-with-no-click.mp3';
                if (!hasSrc || String(_zarMusic?.name || '').trim() !== wantName) {
                    _zarMusicSetUrl('./' + wantName, wantName);
                }
                _zarMusicMaybeUnlockByGesture();
            }
        } catch (_) {}
    } catch (_) {}
}

let _zarSallyPresetArmed = false;
function _zarMaybeExitSallyPresetMode(reason) {
    try {
        if (!_zarSallyPresetArmed) return;
        // Do not interrupt an active Big Screen session.
        if (_zarScreen && _zarScreen.open && (_zarScreen.running || _zarScreen.started || _zarScreen.countdownActive)) {
            _zarSallyPresetArmed = false;
            return;
        }

        _zarSallyPresetArmed = false;

        // UX requirement: music must NOT be auto-disabled.
        // This hook is only used to ensure the Sally preset does not stay "armed" after scheme changes.
        try { if (reason) console.log('Sally preset: disarmed on scheme change:', reason); } catch (_) {}
    } catch (_) {}
}

// Auto-tempo is allowed ONLY when the scheme was generated by the optimizer.
// When user manually edits the scheme (pattern editor Apply), this must be cleared.
let _zarAutoTempoRpm = null;

function _zarDefaultRestEff10FromUI() {
    try {
        const p = (typeof window.getParams === 'function') ? window.getParams() : null;
        const z = p?.zar;
        if (!z) return 0;
        if (String(z.mode || '').toLowerCase() !== 'universal') return 0;
        const kin = String($('zarKinU')?.value || 'hiit').toLowerCase();
        if (kin === 'sit') return 0;
        const v = +($('zarRestEffU')?.value || 0);
        return Number.isFinite(v) ? Math.max(0, Math.min(10, v)) : 0;
    } catch (_) {
        return 0;
    }
}

function _zarBuildNormalizedPatternForSim() {
    try {
        const p = (typeof window.getParams === 'function') ? window.getParams() : null;
        const z = p?.zar;
        const pat = Array.isArray(z?.pattern) ? z.pattern : null;
        if (pat && pat.length) {
            const defaultWorkEff10 = Number.isFinite(+z?.eff) ? (+z.eff) : 10;
            const defaultRestEff10 = _zarDefaultRestEff10FromUI();

            return pat.map((seg) => {
                const on = Math.max(0, Math.floor(+seg?.on || 0));
                const off = Math.max(0, Math.floor(+seg?.off || 0));
                const eff = Number.isFinite(+seg?.eff) ? (+seg.eff) : defaultWorkEff10;
                const restEff = Number.isFinite(+seg?.restEff) ? (+seg.restEff) : defaultRestEff10;
                const workTempoRpm = Number.isFinite(+seg?.workTempoRpm) ? (+seg.workTempoRpm) : undefined;
                const workReps = Number.isFinite(+seg?.workReps) ? Math.max(0, Math.floor(+seg.workReps)) : undefined;
                return { on, off, eff, restEff, workTempoRpm, workReps };
            });
        }

        // Fallback: build from the already-expanded Big Screen phases.
        // This enables deterministic click plans (and voice reps) for classic/universal modes
        // even when z.pattern is not present.
        const phs = Array.isArray(_zarScreen?.phases) ? _zarScreen.phases : null;
        if (!phs || phs.length === 0) return null;
        const defaultRestEff10 = _zarDefaultRestEff10FromUI();
        const out = [];

        for (let i = 0; i < phs.length; i++) {
            const ph = phs[i] || {};
            const kind = String(ph.kind || '');
            const start = Math.max(0, +ph.start || 0);
            const end = Math.max(start, +ph.end || 0);
            const dur = Math.max(0, Math.round(end - start));
            if (dur <= 0) continue;

            if (kind === 'work') {
                const eff = Number.isFinite(+ph.eff) ? (+ph.eff) : 10;
                const workTempoRpm = Number.isFinite(+ph.tempoRpm) ? (+ph.tempoRpm) : undefined;
                const workReps = Number.isFinite(+ph.repsTarget) ? Math.max(0, Math.floor(+ph.repsTarget)) : undefined;

                // Pair with the immediately following rest phase if present.
                let off = 0;
                let restEff = defaultRestEff10;
                const next = (i + 1 < phs.length) ? (phs[i + 1] || {}) : null;
                if (next && String(next.kind || '') !== 'work') {
                    const rs = Math.max(0, +next.start || 0);
                    const re = Math.max(rs, +next.end || 0);
                    off = Math.max(0, Math.round(re - rs));
                    restEff = Number.isFinite(+next.eff) ? (+next.eff) : defaultRestEff10;
                    i++; // consume rest
                }
                out.push({ on: dur, off, eff, restEff, workTempoRpm, workReps });
                continue;
            }

            // Pure rest phase
            const restEff = Number.isFinite(+ph.eff) ? (+ph.eff) : defaultRestEff10;
            out.push({ on: 0, off: dur, eff: 0, restEff, workTempoRpm: undefined, workReps: undefined });
        }

        return out.length ? out : null;
    } catch (_) {
        return null;
    }
}

function _zarScreenUpdateAutoTempoStatus() {
    try {
        const el = $("zarScreenAutoTempoStatus");
        if (!el) return;

        const rpmEl = $("zarScreenMetroRpm");
        const rpmVal = Number.isFinite(+(rpmEl?.value)) ? +(rpmEl.value) : 0;
        const manualRpm = (rpmVal > 0.5) ? Math.round(Math.max(0, Math.min(240, rpmVal))) : 0;
        const autoRpm = (Number.isFinite(+_zarAutoTempoRpm) && (+_zarAutoTempoRpm) > 0.5)
            ? Math.round(Math.max(5, Math.min(240, +_zarAutoTempoRpm)))
            : 0;

        if (manualRpm > 0) {
            el.textContent = (LANG === 'ru')
                ? `Авто-темп: выкл (ручной ${manualRpm})`
                : `Auto tempo: off (manual ${manualRpm})`;
            return;
        }

        if (autoRpm > 0) {
            el.textContent = (LANG === 'ru')
                ? `Авто-темп: ${autoRpm} (модель)`
                : `Auto tempo: ${autoRpm} (model)`;
            return;
        }

        el.textContent = (LANG === 'ru')
            ? 'Авто-темп: выкл'
            : 'Auto tempo: off';
    } catch (_) {}
}

// --- Zaruba Big Screen: fatigue-aware performance state ---
// Goal: if athlete follows metronome clicks (1 click = 1 rep), total clicks match the
// model-predicted reps (simulateZarubaReps) by making the metronome cadence fatigue-aware.
let _zarPerf = {
    active: false,
    f: 0,
    lastElapsedSec: 0,
    deadUntilElapsedSec: 0,
    lastKind: '',
    lastRestEff10: 0,
    model: {
        cadenceMaxRpmBase: 20,
        allOutSec: 45,
        recTauSec: 30,
        minCadenceFrac: 0.35,
        alpha: 1.25,
        beta: 1.0,
        fCrit: 0.85,
        tempoFatiguePow: 1.0
    }
};

function _zarPerfSyncModelFromUI() {
    const clamp01 = (x) => Math.max(0, Math.min(1, x));
    try {
        const cadenceMaxRpmBase = Math.max(1, +($('zarOptCad')?.value || 20));
        const allOutSec = Math.max(5, +($('zarOptAllOut')?.value || 45));
        const recTauSec = Math.max(5, +($('zarOptRec')?.value || 30));
        const tempoFatiguePow = Math.max(0.5, Math.min(3.0, +($('zarOptTempoPow')?.value || 1.0)));
        _zarPerf.model.cadenceMaxRpmBase = cadenceMaxRpmBase;
        _zarPerf.model.allOutSec = allOutSec;
        _zarPerf.model.recTauSec = recTauSec;
        _zarPerf.model.tempoFatiguePow = tempoFatiguePow;
        _zarPerf.model.minCadenceFrac = clamp01(Number.isFinite(+_zarPerf.model.minCadenceFrac) ? +_zarPerf.model.minCadenceFrac : 0.35);
        _zarPerf.model.alpha = Math.max(0.5, +_zarPerf.model.alpha || 1.25);
        _zarPerf.model.beta = Math.max(0.5, +_zarPerf.model.beta || 1.0);
        _zarPerf.model.fCrit = clamp01(Number.isFinite(+_zarPerf.model.fCrit) ? +_zarPerf.model.fCrit : 0.85);
    } catch (_) {
        _zarPerf.model.cadenceMaxRpmBase = 20;
        _zarPerf.model.allOutSec = 45;
        _zarPerf.model.recTauSec = 30;
        _zarPerf.model.tempoFatiguePow = 1.0;
        _zarPerf.model.minCadenceFrac = 0.35;
        _zarPerf.model.alpha = 1.25;
        _zarPerf.model.beta = 1.0;
        _zarPerf.model.fCrit = 0.85;
    }
}

function _zarPerfReset() {
    _zarPerf.active = false;
    _zarPerf.f = 0;
    _zarPerf.lastElapsedSec = 0;
    _zarPerf.deadUntilElapsedSec = 0;
    _zarPerf.lastKind = '';
    _zarPerf.lastRestEff10 = 0;
    _zarPerfSyncModelFromUI();
}

function _zarPerfOnPhaseBoundary(nextKind, nextEff10, elapsedSec, includeSwitch = true) {
    try {
        const t = Math.max(0, +elapsedSec || 0);
        _zarPerf.lastElapsedSec = t;
        _zarPerf.lastKind = String(nextKind || '');
        const nk = _zarPerf.lastKind;
        if (nk !== 'work') {
            _zarPerf.deadUntilElapsedSec = Infinity;
        } else {
            const sc = includeSwitch ? _zarSwitchCostSec() : 0;
            _zarPerf.deadUntilElapsedSec = t + Math.max(0, sc);
        }
        if (String(nk) === 'rest') {
            const v = Number.isFinite(+nextEff10) ? +nextEff10 : 0;
            _zarPerf.lastRestEff10 = Math.max(0, Math.min(10, v));
        }
    } catch (_) {}
}

function _zarPerfMulWorkFromFatigue() {
    const clamp01 = (x) => Math.max(0, Math.min(1, x));
    const m = _zarPerf.model || {};
    const f = clamp01(_zarPerf.f);
    const fCrit = clamp01(+m.fCrit || 0.85);
    const minCadenceFrac = clamp01(Number.isFinite(+m.minCadenceFrac) ? +m.minCadenceFrac : 0.35);
    const over = (f <= fCrit)
        ? 0
        : Math.max(0, Math.min(1, (f - fCrit) / Math.max(1e-6, (1 - fCrit))));
    const perf = (f <= fCrit)
        ? 1.0
        : (minCadenceFrac + (1 - minCadenceFrac) * (1 - over));
    return perf;
}

function _zarPerfEffectiveRpmWork(baseTempoRpm) {
    const rpm0 = +baseTempoRpm || 0;
    if (!(rpm0 > 0.5)) return 0;
    const mul = _zarPerfMulWorkFromFatigue();
    return Math.max(0, Math.min(240, rpm0 * mul));
}

function _zarPerfUpdate(phase, elapsedSec) {
    try {
        if (!_zarScreen.running) return;
        const ph = phase || { kind: 'rest', eff: 0, tempoRpm: null };
        const e = Math.max(0, +elapsedSec || 0);
        if (!_zarPerf.active) {
            _zarPerf.active = true;
            _zarPerf.lastElapsedSec = e;
            _zarPerf.lastKind = String(ph.kind || '');
        }
        let dt = e - (_zarPerf.lastElapsedSec || 0);
        if (!(dt > 1e-6)) return;
        // IMPORTANT: do not clamp away elapsed time.
        // If the render/update loop is throttled (background tab, mobile lockscreen),
        // clamping dt to a small value would under-estimate fatigue and make the metronome/reps too optimistic.
        // We still cap dt to avoid huge catch-up bursts after long pauses.
        dt = Math.max(0, Math.min(10.0, dt));
        _zarPerf.lastElapsedSec = e;

        const clamp01 = (x) => Math.max(0, Math.min(1, x));
        const m = _zarPerf.model || {};
        const cadenceMaxRpmBase = Math.max(1, +m.cadenceMaxRpmBase || 20);
        const allOutSec = Math.max(5, +m.allOutSec || 45);
        const recTauSec = Math.max(5, +m.recTauSec || 30);
        const fCrit = clamp01(+m.fCrit || 0.85);
        const tempoFatiguePow = Math.max(0.5, Math.min(3.0, +m.tempoFatiguePow || 1.0));

        // Keep latest rest effort for switch-cost recovery approximation.
        if (String(ph.kind) === 'rest') {
            const v = Number.isFinite(+ph.eff) ? +ph.eff : 0;
            _zarPerf.lastRestEff10 = Math.max(0, Math.min(10, v));
        }

        // Integrate in small steps for stability.
        let tCur = e - dt;
        let rem = dt;
        while (rem > 1e-9) {
            const step = Math.min(0.25, rem);
            rem -= step;

            const kind = String(ph.kind || '');
            const inSwitchDead = (kind === 'work') && (tCur < (_zarPerf.deadUntilElapsedSec || 0) - 1e-9);

            if (kind !== 'work' || inSwitchDead) {
                const restEff10 = (kind === 'rest')
                    ? (Number.isFinite(+ph.eff) ? +ph.eff : 0)
                    : (Number.isFinite(+_zarPerf.lastRestEff10) ? +_zarPerf.lastRestEff10 : 0);
                const r01 = clamp01((+restEff10 || 0) / 10);
                const tau = recTauSec * (1 + 1.5 * r01);
                const k = 1 / Math.max(1, tau);
                // Approximate discrete f += (-f)*k per second with continuous exponential decay.
                _zarPerf.f = clamp01(_zarPerf.f * Math.exp(-k * step));
                tCur += step;
                continue;
            }

            const eff10 = Number.isFinite(+ph.eff) ? +ph.eff : 0;

            const baseTempoRpm = _zarWorkBaseTempoRpm('work', eff10, ph.tempoRpm);
            const effRpm = _zarPerfEffectiveRpmWork(baseTempoRpm);

            const tempoFracEff = Math.max(0, effRpm / cadenceMaxRpmBase);
            const tempoScale = Math.pow(tempoFracEff, tempoFatiguePow);
            const baseDf = (fCrit / allOutSec) * tempoScale;
            const over = (_zarPerf.f <= fCrit)
                ? 0
                : Math.max(0, Math.min(1, (_zarPerf.f - fCrit) / Math.max(1e-6, (1 - fCrit))));
            const accel = (_zarPerf.f <= fCrit) ? 1.0 : (1.0 + 6.0 * over);
            _zarPerf.f = clamp01(_zarPerf.f + baseDf * accel * step);
            tCur += step;
        }
    } catch (_) {}
}

// Base tempo selection for legacy (no click plan) pacing.
// - Per-phase override (tXX/тXX) wins.
// - Otherwise use the metronome RPM override (manual or optimizer-provided auto).
// - If RPM resolves to 0, treat as "no tempo" (no metronome / no deterministic pacing).
function _zarWorkBaseTempoRpm(kind, eff10, phaseTempoRpm) {
    try {
        if (Number.isFinite(+phaseTempoRpm) && (+phaseTempoRpm) > 0.5) {
            return Math.max(5, Math.min(240, Math.round(+phaseTempoRpm)));
        }
        if (String(kind || '') !== 'work') return 0;
        const ovr = _zarMetroRpmOverride();
        if (ovr == null) return 0;
        const v = +ovr || 0;
        if (!(v > 0.5)) return 0;
        return Math.max(5, Math.min(240, v));
    } catch (_) {
        return 0;
    }
}

function _zarMetroComputeEffectiveRpm(kind, eff10, phaseTempoRpm) {
    try {
        const base = _zarWorkBaseTempoRpm(kind, eff10, phaseTempoRpm);
        if (!(base > 0.5)) return 0;
        if (String(kind) !== 'work') return base;
        // Explicit tempo override (tXX) is a forced metronome pace; do not reduce it by fatigue.
        if (Number.isFinite(+phaseTempoRpm) && (+phaseTempoRpm) > 0.5) return base;
        return _zarPerfEffectiveRpmWork(base);
    } catch (_) {
        return 0;
    }
}

// --- Zaruba metronome (optional tempo clicks in Big Screen) ---
let _zarMetro = {
    nextTickTime: 0,
    lastKey: '',
    active: false,
    deadUntilTime: 0,
    pendingTickTimes: []
};

function _zarMetroEnabled() {
    try { return !!$("zarScreenMetro")?.checked; } catch (_) { return false; }
}

function _zarMetroRpmOverride() {
    try {
        const v = +($("zarScreenMetroRpm")?.value ?? 0);
        if (!Number.isFinite(v)) return null;
        // 0 means: "use auto tempo" ONLY if optimizer set it; otherwise it's a real 0 (no tempo).
        if (v > 0) return Math.max(5, Math.min(240, v));
        if (v === 0) return (Number.isFinite(+_zarAutoTempoRpm) && (+_zarAutoTempoRpm) > 0.5)
            ? Math.max(5, Math.min(240, Math.round(+_zarAutoTempoRpm)))
            : 0;
        return 0;
    } catch (_) {
        return null;
    }
}

function _zarMetroComputeRpm(eff10, phaseTempoRpm) {
    // Phase override from pattern: tXX should win over everything.
    if (Number.isFinite(+phaseTempoRpm) && (+phaseTempoRpm) > 0) {
        return Math.max(5, Math.min(240, Math.round(+phaseTempoRpm)));
    }
    const ovr = _zarMetroRpmOverride();
    if (ovr != null) return Math.max(0, Math.min(240, +ovr || 0));
    return 0;
}

function _zarMetroClickHz() {
    try {
        const v = +($('zarScreenMetroHz')?.value || 0);
        if (!Number.isFinite(v)) return 1650;
        return Math.max(200, Math.min(4000, v));
    } catch (_) {
        return 1650;
    }
}

function _zarMetroClickVolMul() {
    try {
        // 0..200 => 0.00..2.00 multiplier of the global beeper volume.
        const v = +($('zarScreenMetroVol')?.value || 55);
        if (!Number.isFinite(v)) return 0.55;
        return Math.max(0, Math.min(2, v / 100));
    } catch (_) {
        return 0.55;
    }
}

function _zarSwitchCostSec() {
    const sc = +($("zarOptSwitch")?.value || 0);
    return Number.isFinite(sc) ? Math.max(0, sc) : 0;
}

function _zarMetroOnPhaseBoundary(phaseStartElapsedSec, eff10, includeSwitch = true) {
    try {
        const ctx = _ensureAudioCtx();
        if (!ctx) return;
        _audioTryResume(ctx);
        const tStart = Math.max(0, +phaseStartElapsedSec || 0);
        const sc = includeSwitch ? _zarSwitchCostSec() : 0;
        const boundaryAudioTime = (_zarScreen.audioStartTime || ctx.currentTime) + tStart;
        // If audio is not running, don't let deadUntilTime stall the metronome forever.
        _zarMetro.deadUntilTime = (ctx.state === 'running') ? (boundaryAudioTime + sc) : (ctx.currentTime || 0);
        _zarMetro.active = false;
        _zarMetro.lastKey = '';
        _zarMetro.nextTickTime = 0;
        _zarMetro.pendingTickTimes = [];
    } catch (_) {}
}

function _zarMetroReset() {
    _zarMetro.nextTickTime = 0;
    _zarMetro.lastKey = '';
    _zarMetro.active = false;
    _zarMetro.deadUntilTime = 0;
    _zarMetro.pendingTickTimes = [];
}

function _playMetroClick(whenSec = 0) {
    const ctx = _ensureAudioCtx();
    if (!ctx || !_zarBeeper.gain) return;
    try {
        _audioTryResume(ctx);
        const t0 = Math.max(ctx.currentTime, whenSec || ctx.currentTime);
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'square';
        osc.frequency.value = _zarMetroClickHz();
        const vol = Math.max(0.0002, _zarBeepVol() * _zarMetroClickVolMul());
        g.gain.setValueAtTime(0.0001, t0);
        g.gain.exponentialRampToValueAtTime(vol, t0 + 0.002);
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.035);
        osc.connect(g);
        g.connect(_zarBeeper.gain);
        osc.start(t0);
        osc.stop(t0 + 0.050);
    } catch (_) {}
}

let _zarSoundPreview = { timer: 0 };
function _zarSoundPreviewDebounced(kind) {
    try {
        if (!_zarScreen?.open) return;
        if (_zarScreen?.running || _zarScreen?.countdownActive) return;

        if (_zarSoundPreview.timer) clearTimeout(_zarSoundPreview.timer);
        _zarSoundPreview.timer = setTimeout(() => {
            try {
                if (!_zarScreen?.open) return;
                if (_zarScreen?.running || _zarScreen?.countdownActive) return;
                if (String(kind) === 'metro') _playMetroClick();
                else _playBeep(880, 90);
            } catch (_) {}
        }, 80);
    } catch (_) {}
}

function _zarMetroUpdate(kind, eff10, totalLeftSec, phaseTempoRpm) {
    try {
        const forced = (Number.isFinite(+phaseTempoRpm) && (+phaseTempoRpm) > 0.5);
        // User setting is authoritative: if metronome is OFF, do not tick even for explicit tempo overrides.
        if (!_zarScreen.running || !_zarMetroEnabled()) {
            _zarMetroReset();
            return 0;
        }

        // If we have a deterministic click plan from SimCore, use it.
        // This eliminates any drift/heuristics differences between Big Screen and simulateZarubaReps.
        // NOTE: For explicit-rest tempo overrides (tXX on REST), we keep the legacy mode.
        const isRestWithForcedTempo = forced && (String(kind) !== 'work');
        if (!isRestWithForcedTempo
            && _zarScreen.clickPlan
            && Array.isArray(_zarScreen.clickPlan.timesSec)
            && _zarScreen.clickPlan.timesSec.length > 0
        ) {
            const ctx = _ensureAudioCtx();
            if (!ctx) return 0;
            _audioTryResume(ctx);

            const plan = _zarScreen.clickPlan;
            const times = plan.timesSec;
            const lookahead = 0.15;
            const eps = 0.008;
            const t0 = +_zarScreen.audioStartTime || 0;

            // Count clicks that have actually happened.
            let occurred = 0;
            while ((plan.nextIdx || 0) < times.length
                && (t0 + (+times[plan.nextIdx] || 0)) <= (ctx.currentTime + eps)
            ) {
                plan.nextIdx = (plan.nextIdx || 0) + 1;
                occurred++;
                if (occurred > 50) break;
            }

            // Schedule upcoming clicks in the lookahead window (dedup via scheduledIdx).
            const until = ctx.currentTime + lookahead;
            while ((plan.scheduledIdx || 0) < times.length
                && (t0 + (+times[plan.scheduledIdx] || 0)) <= until
            ) {
                const when = t0 + (+times[plan.scheduledIdx] || 0);
                _playMetroClick(when);
                plan.scheduledIdx = (plan.scheduledIdx || 0) + 1;
                if ((plan.scheduledIdx || 0) - (plan.nextIdx || 0) > 2000) break;
            }

            return occurred;
        }

        // Default: only click during WORK.
        // If a phase has explicit tempo override (tXX), allow clicks even in REST.
        if (String(kind) !== 'work' && !forced) {
            _zarMetroReset();
            return 0;
        }
        const rpmBase = _zarMetroComputeRpm(eff10, phaseTempoRpm);
        const rpm = _zarMetroComputeEffectiveRpm(kind, eff10, phaseTempoRpm);
        if (!(rpm > 0.5)) {
            _zarMetroReset();
            return 0;
        }

        const ctx = _ensureAudioCtx();
        if (!ctx) return 0;
        _audioTryResume(ctx);
        const interval = 60 / rpm;

        // Count only ticks that have actually happened (based on AudioContext time),
        // not ticks merely scheduled in the lookahead window.
        let occurred = 0;
        try {
            const eps = 0.008;
            while (_zarMetro.pendingTickTimes && _zarMetro.pendingTickTimes.length > 0
                && _zarMetro.pendingTickTimes[0] <= (ctx.currentTime + eps)
            ) {
                _zarMetro.pendingTickTimes.shift();
                occurred++;
                if (occurred > 50) break;
            }
        } catch (_) {}

        // Respect switching dead-time (no clicks during the transition).
        if (ctx.state === 'running' && ctx.currentTime < (_zarMetro.deadUntilTime || 0) - 1e-6) {
            return 0;
        }

        // IMPORTANT: do not re-anchor on small effective-rpm changes caused by fatigue.
        // Use the *base* tempo (cap) as the stability key.
        const key = `${kind}|${Math.round(rpmBase * 10) / 10}`;
        if (!_zarMetro.active || _zarMetro.lastKey !== key) {
            _zarMetro.active = true;
            _zarMetro.lastKey = key;
            // IMPORTANT: do NOT click immediately at WORK start.
            // The phase-boundary beep already provides a start cue; metronome clicks represent the rep cadence.
            // Clicking at t=0 would effectively add ~+1 rep per work segment and diverge from the reps model.
            const tMin = Math.max(ctx.currentTime, (_zarMetro.deadUntilTime || ctx.currentTime));
            _zarMetro.nextTickTime = tMin + interval;
            _zarMetro.pendingTickTimes = [];
        }

        const lookahead = 0.15;
        let guard = 0;
        while (_zarMetro.nextTickTime <= ctx.currentTime + lookahead && guard < 12) {
            const t = _zarMetro.nextTickTime;
            _playMetroClick(t);
            _zarMetro.nextTickTime += interval;
            guard++;
            try {
                if (!_zarMetro.pendingTickTimes) _zarMetro.pendingTickTimes = [];
                _zarMetro.pendingTickTimes.push(t);
                if (_zarMetro.pendingTickTimes.length > 200) {
                    _zarMetro.pendingTickTimes = _zarMetro.pendingTickTimes.slice(-120);
                }
            } catch (_) {}
        }

        // Drain again: the loop above may schedule a tick for "now".
        try {
            const eps = 0.008;
            while (_zarMetro.pendingTickTimes && _zarMetro.pendingTickTimes.length > 0
                && _zarMetro.pendingTickTimes[0] <= (ctx.currentTime + eps)
            ) {
                _zarMetro.pendingTickTimes.shift();
                occurred++;
                if (occurred > 50) break;
            }
        } catch (_) {}

        // If we somehow fell behind (tab throttling), re-anchor.
        if (_zarMetro.nextTickTime < ctx.currentTime - 0.5) {
            _zarMetro.nextTickTime = ctx.currentTime + interval;
        }
        return occurred;
    } catch (_) {
        return 0;
    }
}

// --- Zaruba reps counter (Big Screen) ---
let _zarRepsCounter = {
    active: false,
    repsInt: 0,
    repsFrac: 0,
    lastElapsedSec: 0,
    lastShown: -1,
    lastKind: '',
    deadUntilElapsedSec: 0
};

let _zarRepsInterval = {
    active: false,
    baseRepsInt: 0,
    lastShown: -1,
    show: false
};

function _zarRepsCounterReset() {
    _zarRepsCounter.active = false;
    _zarRepsCounter.repsInt = 0;
    _zarRepsCounter.repsFrac = 0;
    _zarRepsCounter.lastElapsedSec = 0;
    _zarRepsCounter.lastShown = -1;
    _zarRepsCounter.lastKind = '';
    _zarRepsCounter.deadUntilElapsedSec = 0;
    _zarRepsInterval.active = false;
    _zarRepsInterval.baseRepsInt = 0;
    _zarRepsInterval.lastShown = -1;
    _zarRepsInterval.show = false;
    try {
        const box = $("zarScreenRepsBox");
        if (box) box.style.display = 'none';
        const el = $("zarScreenReps");
        if (el) el.textContent = '';
        const el2 = $("zarScreenRepsInterval");
        if (el2) { el2.style.display = 'none'; el2.textContent = ''; }
    } catch (_) {}
}

function _zarRepsIntervalOnPhaseBoundary(enteringKind, nextWorkIndex) {
    try {
        const k = String(enteringKind || '');
        const isWork = (k === 'work');
        const wi = Math.max(0, Math.floor(+nextWorkIndex || 0));
        _zarRepsInterval.show = (isWork && wi >= 2);
        if (isWork) {
            _zarRepsInterval.active = true;
            _zarRepsInterval.baseRepsInt = Math.max(0, Math.floor(_zarRepsCounter.repsInt + 1e-9));
            _zarRepsInterval.lastShown = -1;
            const el2 = $("zarScreenRepsInterval");
            if (el2) { el2.style.display = _zarRepsInterval.show ? '' : 'none'; el2.textContent = ''; }
        } else {
            const el2 = $("zarScreenRepsInterval");
            if (el2) { el2.style.display = 'none'; }
        }
    } catch (_) {}
}

function _zarScreenSetTempoLabel(kind, eff10, phaseTempoRpm, phaseStartSec, phaseEndSec) {
    try {
        const el = $("zarScreenTempo");
        if (!el) return;
        const mode = String(_zarScreen?.tokenMode?.mode || 'reps');
        if (mode === 'none') { el.textContent = ''; return; }
        const forced = (Number.isFinite(+phaseTempoRpm) && (+phaseTempoRpm) > 0.5);
        const metroOn = _zarMetroEnabled();
        const isWork = (String(kind || '') === 'work');

        // Planned reps from click plan (useful even without metronome/voice)
        const a = Number.isFinite(+phaseStartSec) ? +phaseStartSec : null;
        const b = Number.isFinite(+phaseEndSec) ? +phaseEndSec : null;
        let repsPlanned = (isWork && a != null && b != null) ? _zarClickPlanCountInRange(a, b) : null;
        if (repsPlanned == null && mode === 'reps') {
            const ph = _zarScreen?.phases?.[_zarScreen?.phaseIdx || 0];
            const rt = (ph?.repsTarget == null) ? null : (Number.isFinite(+ph?.repsTarget) ? Math.max(0, Math.floor(+ph.repsTarget)) : null);
            if (rt != null) repsPlanned = rt;
        }
        const repsTxt = (mode === 'reps' && repsPlanned != null)
            ? (LANG === 'ru' ? `План: ${repsPlanned} ${_zarRuRepWord(repsPlanned)}` : `Plan: ${repsPlanned} reps`)
            : '';

        // Token-aware visibility
        if (mode === 'tempo') {
            // Tempo token present: show tempo only.
            if (!(forced || (metroOn && isWork))) { el.textContent = ''; return; }
        } else {
            // Reps mode: if tempo is irrelevant, still show planned reps (when available).
            if (!(forced || (metroOn && isWork))) { el.textContent = repsTxt; return; }
        }

        // If we have a deterministic click plan, prefer it for display (matches what the timer actually does).
        // This also avoids depending on legacy tempo helpers when metronome is driven by click plan.
        const hasPlan = !!(_zarScreen?.clickPlan && Array.isArray(_zarScreen.clickPlan.timesSec) && _zarScreen.clickPlan.timesSec.length);
        let rpmFromPlan = null;
        if (!forced && hasPlan && isWork && a != null && b != null && b > a + 0.2) {
            const dur = Math.max(0, b - a);
            const reps = _zarClickPlanCountInRange(a, b);
            if (dur > 0.5 && Number.isFinite(+reps) && (+reps) > 0) {
                const avg = 60 * (+reps) / dur;
                if (Number.isFinite(avg) && avg > 0.5) rpmFromPlan = Math.max(0, Math.min(240, avg));
            }
        }

        const rpmBase = (rpmFromPlan != null) ? rpmFromPlan : _zarMetroComputeRpm(eff10, phaseTempoRpm);
        const rpm = (rpmFromPlan != null) ? rpmFromPlan : _zarMetroComputeEffectiveRpm(kind, eff10, phaseTempoRpm);
        const r = (rpm > 0.5) ? Math.round(rpm) : 0;
        const rb = (rpmBase > 0.5) ? Math.round(rpmBase) : 0;
        const tempoTxt = (LANG === 'ru')
            ? (rb > 0 && r > 0 && Math.abs(rb - r) >= 1 ? `Темп: ${r} повт/мин (макс ${rb})` : `Темп: ${r} повт/мин`)
            : (rb > 0 && r > 0 && Math.abs(rb - r) >= 1 ? `Tempo: ${r} rpm (cap ${rb})` : `Tempo: ${r} rpm`);
        el.textContent = repsTxt ? `${tempoTxt} · ${repsTxt}` : tempoTxt;
    } catch (_) {}
}

function _zarRepsCounterOnPhaseBoundary(nextKind, elapsedSec, includeSwitch = true) {
    try {
        // Drop partial rep progress at boundaries (you don't carry a half-rep through rest/switch).
        _zarRepsCounter.repsFrac = 0;
        const t = Math.max(0, +elapsedSec || 0);
        _zarRepsCounter.lastElapsedSec = t;
        const nk = String(nextKind || '');
        _zarRepsCounter.lastKind = nk;
        if (nk !== 'work') {
            _zarRepsCounter.deadUntilElapsedSec = Infinity;
        } else {
            const sc = includeSwitch ? _zarSwitchCostSec() : 0;
            _zarRepsCounter.deadUntilElapsedSec = t + Math.max(0, sc);
        }
    } catch (_) {}
}

function _zarRepsCounterUpdate(kind, eff10, elapsedSec, totalLeftSec, metronomeClicks, phaseTempoRpm) {
    try {
        if (!_zarScreen.running) { _zarRepsCounterReset(); return; }

        const tm = _zarScreen?.tokenMode || _zarScreenComputeTokenMode(_zarScreen?.phases);
        const mode = String(tm?.mode || 'reps');
        if (mode !== 'reps') {
            if (_zarRepsCounter.active) _zarRepsCounterReset();
            return;
        }

        const box = $("zarScreenRepsBox");
        const el = $("zarScreenReps");
        const el2 = $("zarScreenRepsInterval");
        if (!box || !el) return;

        const e = Math.max(0, +elapsedSec || 0);
        if (!_zarRepsCounter.active) {
            _zarRepsCounter.active = true;
            _zarRepsCounter.lastElapsedSec = e;
            _zarRepsCounter.repsInt = 0;
            _zarRepsCounter.repsFrac = 0;
            _zarRepsCounter.lastShown = -1;
            _zarRepsCounter.lastKind = String(kind || '');
            _zarRepsCounter.deadUntilElapsedSec = 0;
        }

        const planTimes = (_zarScreen.clickPlan && Array.isArray(_zarScreen.clickPlan.timesSec)) ? _zarScreen.clickPlan.timesSec : null;
        const hasClickPlan = !!(planTimes && planTimes.length > 0);
        if (hasClickPlan) {
            // Golden source: reps counter follows the click plan, even if metronome is OFF.
            _zarRepsCounter.lastElapsedSec = e;
            const n = _zarClickPlanCountToElapsed(e);
            if (n != null) {
                _zarRepsCounter.repsInt = Math.max(0, Math.floor(+n || 0));
                _zarRepsCounter.repsFrac = 0;
            }
        }

        if (!hasClickPlan) {
            // Fallback: only count during WORK (but keep the last value visible during REST).
            if (String(kind) !== 'work') {
                _zarRepsCounter.lastElapsedSec = e;
            } else {
                const dt = Math.max(0, Math.min(0.5, e - _zarRepsCounter.lastElapsedSec));
                _zarRepsCounter.lastElapsedSec = e;

                if (e >= _zarRepsCounter.deadUntilElapsedSec - 1e-9) {
                    const clicks = Math.floor(Math.max(0, +metronomeClicks || 0));
                    if (_zarWillMetronomeTick(kind, phaseTempoRpm)) {
                        // Sync to the metronome: only advance when the click time has actually passed.
                        if (clicks > 0) _zarRepsCounter.repsInt += clicks;
                        _zarRepsCounter.repsFrac = 0;
                    } else {
                        const rpm = _zarMetroComputeEffectiveRpm(kind, eff10, phaseTempoRpm);
                        if (rpm > 0.5 && dt > 0) {
                            _zarRepsCounter.repsFrac += (rpm / 60) * dt;
                            if (_zarRepsCounter.repsFrac >= 1) {
                                const add = Math.floor(_zarRepsCounter.repsFrac + 1e-9);
                                _zarRepsCounter.repsInt += Math.max(0, add);
                                _zarRepsCounter.repsFrac = _zarRepsCounter.repsFrac - add;
                            }
                        }
                    }
                }
            }
        }

        const shown = Math.max(0, Math.floor(_zarRepsCounter.repsInt + 1e-9));
        if (shown !== _zarRepsCounter.lastShown) {
            _zarRepsCounter.lastShown = shown;
            el.textContent = String(shown);
            box.style.display = '';
        }

        // Interval counter (per work block): show only from the 2nd work interval.
        if (el2) {
            if (String(kind) === 'work' && _zarRepsInterval.show) {
                const v = Math.max(0, shown - Math.max(0, Math.floor(_zarRepsInterval.baseRepsInt + 1e-9)));
                if (v !== _zarRepsInterval.lastShown) {
                    _zarRepsInterval.lastShown = v;
                    el2.style.display = '';
                    el2.textContent = String(v);
                }
            } else {
                el2.style.display = 'none';
                el2.textContent = '';
                _zarRepsInterval.lastShown = -1;
            }
        }
    } catch (_) {}
}

function _zarVoiceEnabled() {
    try { return !!$("zarScreenVoice")?.checked; } catch (_) { return false; }
}

function _zarVoiceRepsEnabled() {
    try { return !!$("zarScreenVoiceReps")?.checked; } catch (_) { return false; }
}

function _zarVoiceSayRepsEnabled() {
    try {
        const el = $("zarScreenSayReps");
        return el ? !!el.checked : true;
    } catch (_) { return true; }
}

function _zarVoiceSayTempoEnabled() {
    try {
        const el = $("zarScreenSayTempo");
        return el ? !!el.checked : true;
    } catch (_) { return true; }
}

function _zarVoiceSayIntensityEnabled() {
    try {
        const el = $("zarScreenSayIntensity");
        return el ? !!el.checked : true;
    } catch (_) { return true; }
}

function _zarSpeakCancel() {
    try { if (window.speechSynthesis) window.speechSynthesis.cancel(); } catch (_) {}
}

function _zarSpeak(text, opts) {
    try {
        if (!_zarVoiceEnabled()) return;
        if (!('speechSynthesis' in window) || typeof window.SpeechSynthesisUtterance !== 'function') return;
        const s = String(text || '').trim();
        if (!s) return;
        const cancel = (opts && typeof opts === 'object' && 'cancel' in opts) ? !!opts.cancel : true;
        if (cancel) {
            // Cancel queued utterances to keep it crisp
            try { window.speechSynthesis.cancel(); } catch (_) {}
        }
        const u = new SpeechSynthesisUtterance(s);
        u.lang = (LANG === 'ru') ? 'ru-RU' : 'en-US';
        u.rate = 1.05;
        u.pitch = 1.0;
        u.volume = Math.max(0, Math.min(1, _zarBeepVol()));
        window.speechSynthesis.speak(u);
    } catch (_) {}
}

let _zarVoiceState = { lastWorkIntensitySpoken: null, endCueWorkIdx: -1, endCue2Spoken: false };

function _zarSpeakIntensity(eff10) {
    try {
        if (!_zarVoiceEnabled()) return;
        if (!_zarVoiceSayIntensityEnabled()) return;
        const v = Number.isFinite(+eff10) ? (+eff10) : 8.5;
        if (v <= 0.0001) return;
        const n = Math.max(0, Math.min(10, Math.round(v)));
        _zarSpeak(LANG === 'ru' ? `Интенсивность ${n}` : `Intensity ${n}`);
    } catch (_) {}
}

function _zarRuSecWord(n) {
    const k = Math.abs(Math.floor(+n || 0));
    const m10 = k % 10;
    const m100 = k % 100;
    if (m100 >= 11 && m100 <= 14) return 'секунд';
    if (m10 === 1) return 'секунду';
    if (m10 >= 2 && m10 <= 4) return 'секунды';
    return 'секунд';
}

function _zarRuRepWord(n) {
    const k = Math.abs(Math.floor(+n || 0));
    const m10 = k % 10;
    const m100 = k % 100;
    if (m100 >= 11 && m100 <= 14) return 'повторов';
    if (m10 === 1) return 'повтор';
    if (m10 >= 2 && m10 <= 4) return 'повтора';
    return 'повторов';
}

function _zarClickPlanCountInRange(startSec, endSec) {
    try {
        const plan = _zarScreen?.clickPlan;
        const times = plan && Array.isArray(plan.timesSec) ? plan.timesSec : null;
        if (!times || times.length === 0) return null;
        const a = Math.max(0, +startSec || 0);
        const b = Math.max(a, +endSec || 0);

        // lower_bound for a
        let lo = 0, hi = times.length;
        while (lo < hi) {
            const mid = (lo + hi) >> 1;
            if ((+times[mid] || 0) < a) lo = mid + 1; else hi = mid;
        }
        const i0 = lo;

        // lower_bound for b
        lo = i0; hi = times.length;
        while (lo < hi) {
            const mid = (lo + hi) >> 1;
            if ((+times[mid] || 0) < b) lo = mid + 1; else hi = mid;
        }
        const i1 = lo;
        return Math.max(0, i1 - i0);
    } catch (_) {
        return null;
    }
}

function _zarClickPlanCountToElapsed(elapsedSec) {
    try {
        const plan = _zarScreen?.clickPlan;
        const times = plan && Array.isArray(plan.timesSec) ? plan.timesSec : null;
        if (!times || times.length === 0) return null;
        // Include clicks that happen exactly on the boundary.
        const b = Math.max(0, +elapsedSec || 0) + 1e-6;

        // lower_bound for b
        let lo = 0, hi = times.length;
        while (lo < hi) {
            const mid = (lo + hi) >> 1;
            if ((+times[mid] || 0) < b) lo = mid + 1; else hi = mid;
        }
        return Math.max(0, lo);
    } catch (_) {
        return null;
    }
}

function _zarClickPlanRangeIndices(startSec, endSec) {
    try {
        const plan = _zarScreen?.clickPlan;
        const times = plan && Array.isArray(plan.timesSec) ? plan.timesSec : null;
        if (!times || times.length === 0) return null;
        const a = Math.max(0, +startSec || 0);
        const b = Math.max(a, +endSec || 0);

        let lo = 0, hi = times.length;
        while (lo < hi) {
            const mid = (lo + hi) >> 1;
            if ((+times[mid] || 0) < a) lo = mid + 1; else hi = mid;
        }
        const i0 = lo;

        lo = i0; hi = times.length;
        while (lo < hi) {
            const mid = (lo + hi) >> 1;
            if ((+times[mid] || 0) < b) lo = mid + 1; else hi = mid;
        }
        const i1 = lo;
        return { i0, i1 };
    } catch (_) {
        return null;
    }
}

function _zarEstimateSpeakDurSec(text) {
    try {
        const s = String(text || '').trim();
        if (!s) return 0;
        const w = s.split(/\s+/g).filter(Boolean).length;
        // Rough heuristic for SpeechSynthesis at rate~1.05.
        // RU words are slightly longer on average.
        const perWord = (LANG === 'ru') ? 0.30 : 0.26;
        return Math.max(0.35, 0.18 + w * perWord);
    } catch (_) {
        return 0.8;
    }
}

function _zarModelCadenceCapRpm(phaseTempoRpm) {
    // This matches the *model* (SimCore click plan) tempo cap:
    // - per-segment override (tXX) wins
    // - otherwise cadence max from optimizer config (zarOptCad)
    try {
        if (Number.isFinite(+phaseTempoRpm) && (+phaseTempoRpm) > 0.5) {
            return Math.max(5, Math.min(240, Math.round(+phaseTempoRpm)));
        }
        const v = +($('zarOptCad')?.value || 20);
        if (!Number.isFinite(v)) return 20;
        return Math.max(5, Math.min(240, Math.round(v)));
    } catch (_) {
        return 20;
    }
}

function _zarWillMetronomeTick(kind, phaseTempoRpm) {
    // User setting is authoritative.
    if (!_zarMetroEnabled()) return false;
    const forced = (Number.isFinite(+phaseTempoRpm) && (+phaseTempoRpm) > 0.5);
    if (forced) return true;
    return (String(kind || '') === 'work');
}

function _zarAnnounceTempoRpm(kind, eff10, phaseTempoRpm, opts) {
    try {
        const k = String(kind || '');
        if (!_zarWillMetronomeTick(k, phaseTempoRpm)) return 0;

        const o = (opts && typeof opts === 'object') ? opts : null;
        const hasTempoOverride = (Number.isFinite(+phaseTempoRpm) && (+phaseTempoRpm) > 0.5);

        const hasPlan = !!(_zarScreen?.clickPlan && Array.isArray(_zarScreen.clickPlan.timesSec));
        if (hasPlan) {
            // If this WORK phase uses a reps target (rNN / пNN) and has no explicit t/т override,
            // announce the *average* tempo from the click plan (same logic as Plan modal).
            if (k === 'work' && !hasTempoOverride) {
                const repsTarget = (o?.repsTarget == null) ? null : (Number.isFinite(+o?.repsTarget) ? Math.max(0, Math.floor(+o.repsTarget)) : null);
                if (repsTarget != null) {
                    const a = Number.isFinite(+o?.phaseStartSec) ? +o.phaseStartSec : null;
                    const b = Number.isFinite(+o?.phaseEndSec) ? +o.phaseEndSec : null;
                    if (a != null && b != null && b > a + 0.2) {
                        const dur = Math.max(0, b - a);
                        const repsPlanned = Number.isFinite(+o?.repsPlanned)
                            ? Math.max(0, Math.floor(+o.repsPlanned))
                            : _zarClickPlanCountInRange(a, b);
                        if (dur > 0.5 && Number.isFinite(+repsPlanned) && (+repsPlanned) > 0) {
                            const avg = 60 * (+repsPlanned) / dur;
                            if (Number.isFinite(avg) && avg > 0.5) return Math.max(0, Math.min(240, avg));
                        }
                    }
                }
            }

            const cap = _zarModelCadenceCapRpm(phaseTempoRpm);
            if (k !== 'work') return cap;
            // Explicit tempo override (tXX) is an absolute metronome pace.
            // Do not scale it by intensity in voice announcements.
            if (hasTempoOverride) return cap;
            const frac = Math.max(0, Math.min(1, (+eff10 || 0) / 10));
            return Math.max(0, Math.min(240, cap * frac));
        }

        // Legacy (no click plan): use the metronome cap selection logic.
        return _zarWorkBaseTempoRpm(k, eff10, phaseTempoRpm);
    } catch (_) {
        return 0;
    }
}

function _zarScreenComputeTokenMode(phases) {
    try {
        const phs = Array.isArray(phases) ? phases : [];
        const hasReps = phs.some(ph => String(ph?.kind) === 'work' && Number.isFinite(+ph?.repsTarget) && (+ph.repsTarget) >= 1);
        const hasTempo = phs.some(ph => String(ph?.kind) === 'work' && Number.isFinite(+ph?.tempoRpm) && (+ph.tempoRpm) > 0.5);
        const hasIntensity = phs.some(ph => Number.isFinite(+ph?.eff) && (+ph.eff) > 0.0001);

        const ovr = _zarScreen?.timelineOverride;
        const methodKey = String(ovr?.methodKey || '').toUpperCase();
        const isOverride = !!ovr;

        // Default policy:
        // - Native Zaruba (no override): reps-oriented.
        // - External method override: no reps unless reps/tempo tokens exist.
        const defaultMode = (!isOverride || methodKey === 'ZRB') ? 'reps' : 'none';
        const mode = hasReps ? 'reps' : (hasTempo ? 'tempo' : defaultMode);
        return { mode, hasReps, hasTempo, hasIntensity, methodKey, isOverride };
    } catch (_) {
        return { mode: 'reps', hasReps: false, hasTempo: false, hasIntensity: false, methodKey: '', isOverride: false };
    }
}

function _zarApplyVoicePaddingToClickPlan(phases) {
    try {
        if (!_zarVoiceEnabled() || !_zarVoiceRepsEnabled()) return;
        const tm = _zarScreen?.tokenMode || _zarScreenComputeTokenMode(phases);
        const mode = String(tm?.mode || 'reps');
        if (mode === 'none') return;
        const sayReps = (mode === 'reps') && _zarVoiceSayRepsEnabled();
        const sayTempo = (mode === 'reps' || mode === 'tempo') && _zarVoiceSayTempoEnabled();
        if (!sayReps && !sayTempo) return;
        const plan = _zarScreen?.clickPlan;
        const times = plan && Array.isArray(plan.timesSec) ? plan.timesSec : null;
        if (!times || times.length === 0) return;
        const phs = Array.isArray(phases) ? phases : [];

        for (const ph of phs) {
            if (String(ph?.kind) !== 'work') continue;
            if (!_zarWillMetronomeTick('work', ph?.tempoRpm)) continue;
            const start = Math.max(0, +ph.start || 0);
            const end = Math.max(start, +ph.end || 0);
            if (!(end > start + 0.2)) continue;

            const ri = _zarClickPlanRangeIndices(start, end);
            if (!ri) continue;
            const { i0, i1 } = ri;
            const n = Math.max(0, i1 - i0);
            if (n <= 0) continue;

            const dur = Math.max(0, Math.round(end - start));
            const reps = n;
            const tempoRpm = _zarAnnounceTempoRpm('work', ph?.eff, ph?.tempoRpm, {
                repsTarget: ph?.repsTarget,
                phaseStartSec: start,
                phaseEndSec: end,
                repsPlanned: reps
            });
            const hasTempo = (Number.isFinite(+tempoRpm) && (+tempoRpm) > 0.5);
            const tempoInt = hasTempo ? Math.max(5, Math.min(240, Math.round(+tempoRpm))) : 0;

            // Padding is tuned to ensure the essential phrase fits.
            // Priority: reps -> tempo. Intensity is optional and may be omitted if time is tight.
            const phrase = (LANG === 'ru')
                ? [
                    (dur > 0 ? `Работа ${dur} ${_zarRuSecWord(dur)}` : 'Работа'),
                    (sayReps ? `${reps} ${_zarRuRepWord(reps)}` : ''),
                    (sayTempo && hasTempo ? `темп ${tempoInt}` : '')
                ].filter(Boolean).join(', ')
                : [
                    (dur > 0 ? `Work ${dur} seconds` : 'Work'),
                    (sayReps ? `${reps} reps` : ''),
                    (sayTempo && hasTempo ? `tempo ${tempoInt}` : '')
                ].filter(Boolean).join(', ');

            const lead = Math.min(2.1, Math.max(0.7, _zarEstimateSpeakDurSec(phrase) + 0.15));

            const t0 = +times[i0] || start;
            const firstWanted = start + lead;
            if (t0 >= firstWanted - 1e-6) continue;

            if (n === 1) {
                times[i0] = Math.min(end - 0.05, Math.max(firstWanted, t0));
                continue;
            }

            const iLast = i1 - 1;
            const tLast = +times[iLast] || (end - 0.01);
            const desiredFirst = Math.min(Math.max(start, firstWanted), Math.max(start, tLast - 0.05));
            const denom = Math.max(1e-6, (tLast - t0));
            const scale = (tLast - desiredFirst) / denom;

            // Warp times in [i0..iLast] so that:
            // - first click happens no earlier than desiredFirst
            // - last click time is preserved (no rep-count loss)
            for (let i = i0; i <= iLast; i++) {
                const tt = +times[i] || 0;
                const nw = desiredFirst + (tt - t0) * scale;
                // Keep ordering and boundaries sane.
                times[i] = Math.max(start, Math.min(tLast, nw));
            }
            // Ensure exact pinning.
            times[i0] = desiredFirst;
            times[iLast] = tLast;
        }
    } catch (_) {}
}

function _zarSpeakPhaseStart(kind, eff10, phaseDurSec, tempoRpm, phaseStartSec, phaseEndSec, repsTarget) {
    try {
        if (!_zarVoiceEnabled()) return;
        const tm = _zarScreen?.tokenMode || _zarScreenComputeTokenMode(_zarScreen?.phases);
        const mode = String(tm?.mode || 'reps');
        const sayIntensity = _zarVoiceSayIntensityEnabled();
        const sayReps = (mode === 'reps') && _zarVoiceSayRepsEnabled();
        const sayTempo = (mode === 'reps' || mode === 'tempo') && _zarVoiceSayTempoEnabled();
        const dur = Math.max(0, Math.round(+phaseDurSec || 0));
        const willMetro = _zarWillMetronomeTick(kind, tempoRpm);
        const a = Number.isFinite(+phaseStartSec) ? +phaseStartSec : null;
        const b = Number.isFinite(+phaseEndSec) ? +phaseEndSec : null;
        let repsPlanned = (a != null && b != null) ? _zarClickPlanCountInRange(a, b) : null;
        if (repsPlanned == null && sayReps && repsTarget != null && Number.isFinite(+repsTarget)) {
            repsPlanned = Math.max(0, Math.floor(+repsTarget));
        }
        const tempoAnnounceRpm = _zarAnnounceTempoRpm(kind, eff10, tempoRpm, {
            repsTarget,
            phaseStartSec: a,
            phaseEndSec: b,
            repsPlanned
        });
        const hasTempo = (sayTempo && Number.isFinite(+tempoAnnounceRpm) && (+tempoAnnounceRpm) > 0.5);
        const tempoInt = hasTempo ? Math.max(5, Math.min(240, Math.round(+tempoAnnounceRpm))) : 0;
        if (kind === 'work') {
            // Optional compact announcement: duration + planned reps + tempo.
            // This is intentionally a single utterance to fit into short switch windows.
            if (_zarVoiceRepsEnabled() && (sayReps || sayTempo)) {
                // Priority (if time is limited): reps -> tempo -> intensity.
                // If there's no time, omit the tail.
                const v = Number.isFinite(+eff10) ? (+eff10) : 8.5;
                const n = (v <= 0.0001) ? 0 : Math.max(0, Math.min(10, Math.round(v)));
                const sayIntensityCandidate = sayIntensity && (n > 0);

                // Estimate available lead time until the first metronome click in this phase.
                // If we can't compute it, assume plenty and speak full phrase.
                let leadBudgetSec = Infinity;
                try {
                    const plan = _zarScreen?.clickPlan;
                    const times = plan && Array.isArray(plan.timesSec) ? plan.timesSec : null;
                    if (times && a != null && b != null) {
                        const ri = _zarClickPlanRangeIndices(a, b);
                        if (ri && ri.i0 != null && ri.i0 < ri.i1 && ri.i0 >= 0 && ri.i0 < times.length) {
                            const tFirst = +times[ri.i0];
                            if (Number.isFinite(tFirst)) leadBudgetSec = Math.max(0, tFirst - a);
                        }
                    }
                } catch (_) {}

                const parts = [];
                const base = (LANG === 'ru')
                    ? (dur > 0 ? `Работа ${dur} ${_zarRuSecWord(dur)}` : 'Работа')
                    : (dur > 0 ? `Work ${dur} seconds` : 'Work');
                parts.push(base);

                const postSpeakQueue = [];

                const enqueuePostSpeak = (txt, delaySec) => {
                    if (!txt) return;
                    const d = Number.isFinite(+delaySec) ? Math.max(0, +delaySec) : 0;
                    postSpeakQueue.push({ txt: String(txt), delaySec: d });
                };

                const tryAdd = (txt) => {
                    if (!txt) return false;
                    const next = parts.concat([txt]).join(', ');
                    // Leave a small guard so the first click doesn't collide with TTS.
                    const guard = 0.12;
                    if (Number.isFinite(leadBudgetSec) && leadBudgetSec !== Infinity) {
                        if (_zarEstimateSpeakDurSec(next) > Math.max(0.20, leadBudgetSec - guard)) return false;
                    }
                    parts.push(txt);
                    return true;
                };

                // 1) reps
                if (sayReps && repsPlanned != null) {
                    const repsTxt = (LANG === 'ru')
                        ? `${repsPlanned} ${_zarRuRepWord(repsPlanned)}`
                        : `${repsPlanned} reps`;
                    const ok = tryAdd(repsTxt);
                    if (!ok) {
                        // If reps don't fit before the first click, still say them shortly after.
                        // This fixes cases like 6s@r2 where the lead window is small.
                        const phaseLen = Math.max(0, +phaseDurSec || 0);
                        let delay = 0;
                        if (Number.isFinite(leadBudgetSec) && leadBudgetSec !== Infinity) {
                            delay = leadBudgetSec + 0.06;
                            if (phaseLen > 0.4) delay = Math.min(delay, Math.max(0, phaseLen - 0.25));
                        }
                        enqueuePostSpeak(repsTxt, delay);
                    }
                }
                // 2) tempo
                if (sayTempo && hasTempo) {
                    tryAdd(LANG === 'ru' ? `темп ${tempoInt}` : `tempo ${tempoInt}`);
                }
                // 3) intensity (only when changed)
                if (sayIntensityCandidate) {
                    const intensityTxt = (LANG === 'ru' ? `интенсивность ${n}` : `intensity ${n}`);
                    const ok = tryAdd(intensityTxt);
                    if (ok) {
                        _zarVoiceState.lastWorkIntensitySpoken = n;
                    } else {
                        // If intensity doesn't fit before the first click, still speak it (separate utterance).
                        // This ensures token-aware behavior: if the scheme encodes intensity, we announce it.
                        _zarVoiceState.lastWorkIntensitySpoken = n;
                        enqueuePostSpeak(intensityTxt, 0);
                    }
                }

                _zarSpeak(parts.join(', '), { cancel: true });
                if (postSpeakQueue.length > 0) {
                    const timeouts = _zarScreen && Array.isArray(_zarScreen.timeouts) ? _zarScreen.timeouts : null;
                    for (const it of postSpeakQueue) {
                        const txt = it && it.txt ? String(it.txt) : '';
                        const d = it && Number.isFinite(+it.delaySec) ? Math.max(0, +it.delaySec) : 0;
                        if (!txt) continue;
                        if (d <= 0.01) {
                            _zarSpeak(txt, { cancel: false });
                            continue;
                        }
                        if (timeouts) {
                            const id = setTimeout(() => {
                                try {
                                    if (!_zarVoiceEnabled()) return;
                                    if (!_zarScreen?.open) return;
                                    _zarSpeak(txt, { cancel: false });
                                } catch (_) {}
                            }, d * 1000);
                            timeouts.push(id);
                        } else {
                            setTimeout(() => {
                                try {
                                    if (!_zarVoiceEnabled()) return;
                                    _zarSpeak(txt, { cancel: false });
                                } catch (_) {}
                            }, d * 1000);
                        }
                    }
                }
                return;
            }

            // Speak duration always.
            _zarSpeak(
                (dur > 0)
                    ? (LANG === 'ru' ? `Работа ${dur} ${_zarRuSecWord(dur)}` : `Work ${dur} seconds`)
                    : (LANG === 'ru' ? 'Работа' : 'Work'),
                { cancel: true }
            );

            if (sayReps && repsPlanned != null) {
                _zarSpeak(
                    (LANG === 'ru' ? `${repsPlanned} ${_zarRuRepWord(repsPlanned)}` : `${repsPlanned} reps`),
                    { cancel: false }
                );
            }

            if (hasTempo) {
                if (sayTempo) {
                    _zarSpeak(
                        (LANG === 'ru' ? `Темп ${tempoInt}` : `Tempo ${tempoInt} RPM`),
                        { cancel: false }
                    );
                }
            }
            // Speak intensity (token-aware): if the scheme encodes intensity and the option is enabled.
            // Keep it last.
            const v = Number.isFinite(+eff10) ? (+eff10) : 8.5;
            const n = (v <= 0.0001) ? 0 : Math.max(0, Math.min(10, Math.round(v)));
            if (sayIntensity && n > 0) {
                _zarVoiceState.lastWorkIntensitySpoken = n;
                _zarSpeak(LANG === 'ru' ? `Интенсивность ${n}` : `Intensity ${n}`, { cancel: false });
            }
            return;
        }

        // REST: if intensity is non-zero, say it every time (even if repeated)
        // and avoid the word "Rest" / "Отдых" (it's more like active recovery).
        const v = Number.isFinite(+eff10) ? (+eff10) : 0;
        const n = (v <= 0.0001) ? 0 : Math.max(0, Math.min(10, Math.round(v)));
        if (n > 0 && sayIntensity) {
            _zarSpeak(
                (dur > 0)
                    ? (LANG === 'ru'
                        ? `Снижаем до ${n} на ${dur} ${_zarRuSecWord(dur)}`
                        : `Down to ${n} for ${dur} seconds`)
                    : (LANG === 'ru' ? `Снижаем до ${n}` : `Down to ${n}`),
                { cancel: true }
            );
            if (hasTempo) {
                if (sayTempo) {
                    _zarSpeak(
                        (LANG === 'ru' ? `Темп ${tempoInt}` : `Tempo ${tempoInt} RPM`),
                        { cancel: false }
                    );
                }
            }
            return;
        }

        // True rest
        _zarSpeak(
            (dur > 0)
                ? (LANG === 'ru' ? `Отдых ${dur} ${_zarRuSecWord(dur)}` : `Rest ${dur} seconds`)
                : (LANG === 'ru' ? 'Отдых' : 'Rest'),
            { cancel: true }
        );
        if (hasTempo) {
            if (sayTempo) {
                _zarSpeak(
                    (LANG === 'ru' ? `Темп ${tempoInt}` : `Tempo ${tempoInt} RPM`),
                    { cancel: false }
                );
            }
        }
    } catch (_) {}
}

function _zarMaybeSpeakEndOfWorkCue(ph, elapsedSec, phaseLeftSec) {
    try {
        const mode = String(_zarScreen?.tokenMode?.mode || 'reps');
        if (mode !== 'reps') return;
        if (!_zarVoiceEnabled() || !_zarVoiceRepsEnabled()) return;
        if (!_zarVoiceSayRepsEnabled()) return;
        if (String(ph?.kind) !== 'work') return;

        const a0 = Number.isFinite(+ph.start) ? +ph.start : null;
        const b0 = Number.isFinite(+ph.end) ? +ph.end : null;
        if (a0 == null || b0 == null || !(b0 > a0 + 0.2)) return;

        const planned = _zarClickPlanCountInRange(a0, b0);
        if (!(planned >= 5)) return;

        const t = Math.max(a0, Number.isFinite(+elapsedSec) ? +elapsedSec : a0);
        const remain = _zarClickPlanCountInRange(t, b0);
        if (remain == null) return;

        // Speak only once per WORK phase.
        const idx = Math.max(0, Math.floor(+_zarScreen?.phaseIdx || 0));
        if (_zarVoiceState.endCueWorkIdx !== idx) {
            _zarVoiceState.endCueWorkIdx = idx;
            _zarVoiceState.endCue2Spoken = false;
        }

        if (_zarVoiceState.endCue2Spoken) return;
        if (remain !== 2) return;

        const phrase = (LANG === 'ru') ? `Ещё 2 ${_zarRuRepWord(2)}` : '2 reps left';
        const need = Math.max(0.35, _zarEstimateSpeakDurSec(phrase) + 0.12);
        const left = Math.max(0, +phaseLeftSec || 0);
        if (left < need) return;

        // Guard: only speak when cadence is slow enough for this phrase.
        // For reps-target phases, use average tempo from click plan.
        const tempoRpm = _zarAnnounceTempoRpm('work', ph?.eff, ph?.tempoRpm, {
            repsTarget: ph?.repsTarget,
            phaseStartSec: t,
            phaseEndSec: b0,
            repsPlanned: remain
        });
        if (Number.isFinite(+tempoRpm) && (+tempoRpm) > 0.5) {
            const repInterval = 60 / Math.max(1e-6, +tempoRpm);
            if (repInterval < need * 0.85) return;
        }

        _zarVoiceState.endCue2Spoken = true;
        _zarSpeak(phrase, { cancel: false });
    } catch (_) {}
}

function _zarScreenEffVisible() {
    // Keep the screen clean: intensity is already available via voice announcements.
    // Showing a large digit under the timer was confusing (e.g. 8.5 rounds to 9).
    return false;
}

function _zarScreenSetEff(kind, eff10) {
    const el = $("zarScreenEff");
    if (!el) return;
    const show = _zarScreenEffVisible();
    el.style.display = show ? '' : 'none';
    if (!show) {
        el.textContent = '';
        return;
    }
    const v = Number.isFinite(+eff10) ? (+eff10) : (kind === 'work' ? 8.5 : 0);
    const n = (v <= 0.0001) ? 0 : Math.max(0, Math.min(10, Math.round(v)));
    el.textContent = String(n);
}

function _zarFmtMMSS(sec) {
    const s = Math.max(0, Math.floor(sec));
    const mm = Math.floor(s / 60);
    const ss = s % 60;
    return `${String(mm).padStart(2,'0')}:${String(ss).padStart(2,'0')}`;
}

function _zarScreenCountUpEnabled() {
    try { return !!$("zarScreenCountUp")?.checked; } catch (_) { return false; }
}

function _zarScreenCountdownSec() {
    try {
        const v = +($("zarScreenCountdownSec")?.value ?? 5);
        if (!Number.isFinite(v)) return 5;
        return Math.max(0, Math.min(30, Math.round(v)));
    } catch (_) {
        return 5;
    }
}

function _zarScreenSetTimerTextByMode(elapsedSec, leftSec) {
    const el = $("zarScreenTimer");
    if (!el) return;
    const up = _zarScreenCountUpEnabled();
    const v = up ? elapsedSec : leftSec;
    el.textContent = _zarFmtMMSS(v);
}

function _zarScreenSetIntervalBar(kind, phaseStartSec, phaseEndSec, elapsedSec) {
    try {
        const wrap = $("zarScreenIntervalBar");
        const fill = $("zarScreenIntervalBarFill");
        if (!wrap || !fill) return;
        if (!_zarScreen?.open) { wrap.style.display = 'none'; return; }

        const start = Math.max(0, +phaseStartSec || 0);
        const end = Math.max(start, +phaseEndSec || 0);
        const dur = Math.max(0.001, end - start);
        const e = Math.max(0, +elapsedSec || 0);
        const left = Math.max(0, end - e);
        const done = Math.max(0, Math.min(dur, e - start));
        const grow = !!$("zarScreenBarGrow")?.checked;
        const frac = grow
            ? Math.max(0, Math.min(1, done / dur))
            : Math.max(0, Math.min(1, left / dur));

        wrap.style.display = '';
        fill.style.width = `${(frac * 100).toFixed(1)}%`;
    } catch (_) {}
}

function _zarScreenHideIntervalBar() {
    try {
        const wrap = $("zarScreenIntervalBar");
        if (wrap) wrap.style.display = 'none';
        const fill = $("zarScreenIntervalBarFill");
        if (fill) fill.style.width = '100%';
    } catch (_) {}
}

function zarScreenTimerToggleChanged() {
    try {
        if (!_zarScreen.open) return;
        if (_zarScreen.running) {
            const now = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
            const elapsed = (now - (_zarScreen.startPerf || now)) / 1000;
            const left = Math.max(0, (_zarScreen.durSec || 0) - elapsed);
            _zarScreenSetTimerTextByMode(elapsed, left);
        } else {
            _zarScreenUpdateStatic();
        }
    } catch (_) {}
}

function _zarScreenClearTimers() {
    try {
        if (_zarScreen.tickId) clearInterval(_zarScreen.tickId);
    } catch (_) {}
    _zarScreen.tickId = 0;
    try {
        for (const id of _zarScreen.timeouts) clearTimeout(id);
    } catch (_) {}
    _zarScreen.timeouts = [];
}

function _zarScreenSetCountdown(textOrNull) {
    const el = $("zarScreenCountdown");
    if (!el) return;
    if (textOrNull == null || textOrNull === '') {
        el.style.display = 'none';
        el.textContent = '';
    } else {
        el.style.display = '';
        el.textContent = String(textOrNull);
    }
}

function _zarScreenUpdateStatic() {
    try {
        const tl = _zarBuildTimelineFromCurrentZar();
        const root = $("zarScreen");
        if (root) {
            root.classList.remove('zs-pulse', 'zs-work', 'zs-rest');
        }
        _zarScreenHideIntervalBar();
        _zarScreen.durSec = tl.durSec;
        _zarScreenSetTimerTextByMode(0, tl.durSec);
        if ($("zarScreenTimer")) $("zarScreenTimer").style.color = '';
        if ($("zarScreenPhase")) $("zarScreenPhase").textContent = '—';
        _zarScreenSetEff('rest', 0);
        if ($("zarScreenSub")) $("zarScreenSub").textContent = (LANG==='ru' ? 'Готовность' : 'Ready');
        if ($("zarScreenSub")) $("zarScreenSub").style.color = '';
        // Show a short pattern hint
        if ($("zarScreenPattern")) {
            try {
                const ovr = _zarScreen?.timelineOverride;
                const patStr = String(ovr?.patternStr || '').trim();
                if (patStr) {
                    $("zarScreenPattern").textContent = (LANG==='ru' ? 'Схема: ' : 'Pattern: ') + patStr;
                } else {
                    const p = (typeof window.getParams === 'function') ? window.getParams() : null;
                    const hasPat = Array.isArray(p?.zar?.pattern) && p.zar.pattern.length;
                    if (hasPat && typeof window.formatZarPatternSegments === 'function') {
                        const s = window.formatZarPatternSegments(p.zar.pattern.slice(0, 10), { lang: LANG });
                        $("zarScreenPattern").textContent = (LANG==='ru' ? 'Схема: ' : 'Pattern: ') + s + (p.zar.pattern.length > 10 ? ' …' : '');
                    } else {
                        const z = p?.zar || {};
                        $("zarScreenPattern").textContent = (LANG==='ru' ? 'On/Off: ' : 'On/Off: ') + `${Math.floor(+z.on||30)}/${Math.floor(+z.off||30)} · ${Math.floor(+z.dur||300)}s`;
                    }
                }
            } catch (_) {
                // ignore
            }
        }

        // Ready screen should show only Start + Plan.
        try { _zarScreenSetButtons(false); } catch (_) {}
    } catch (_) {}
}

function openZarBigScreen() {
    const modal = $("zarScreenModal");
    if (!modal) return;
    // Capture current scroll position to restore when closing (mobile may jump to top).
    try {
        const y = window.scrollY || document.documentElement.scrollTop || 0;
        modal.dataset.scrollY = String(y);
    } catch(_) {}
    modal.classList.add('show');
    document.documentElement.classList.add('modal-open');
    document.body.classList.add('modal-open');
    _zarScreen.open = true;
    try {
        _zarScreenSettingsWireOnce();
        _zarScreenSettingsLoad();
        _zarScreenUpdateSysStatus();
    } catch (_) {}
    try {
        _zarMusicWireOnce();
        const p = _zarMusicLoadFromDBAsync();
        if (p && typeof p.catch === 'function') p.catch(() => {});
        _zarMusicApplyLoopVol();
        _zarMusicUpdateUIStatus();
    } catch (_) {}
    try { _zarWakeMaybe(); } catch (_) {}
    // Golden plan: ensure preview plan when opening the timer (but never rebuild during a run).
    try {
        if (!_zarScreen?.running) _zarEnsureGoldenPlan({ allowRebuildPhases: true, resetCursor: true, clearIfNoPlan: true });
    } catch (_) {}
    try {
        const el = $("zarScreenTempo");
        if (el) el.textContent = '';
    } catch (_) {}
    try { _zarScreenUpdateAutoTempoStatus(); } catch (_) {}
    _zarScreenUpdateStatic();
    try { if (_zarPlanIsOpen()) _zarPlanRender(); } catch (_) {}
    try { setText(); } catch(_) {}
}

function _zarOpenBigScreenForZaruba() {
    try {
        // If a Big Screen session is active, never mutate its scheme mid-run.
        if (_zarScreen && _zarScreen.open && (_zarScreen.running || _zarScreen.started || _zarScreen.countdownActive)) {
            openZarBigScreen();
            return;
        }

        // If the Big Screen was previously opened for another method, it may still hold a timelineOverride.
        // Opening the Zaruba timer must always reflect the Zaruba Duration slider semantics
        // (repeat-to-duration unless the pattern explicitly contains '#').
        try { _zarScreen.timelineOverride = null; } catch (_) {}
        try {
            if ('_prevAutoTempoRpm' in _zarScreen) {
                _zarAutoTempoRpm = _zarScreen._prevAutoTempoRpm;
                delete _zarScreen._prevAutoTempoRpm;
                try { _zarScreenUpdateAutoTempoStatus(); } catch (_) {}
            }
        } catch (_) {}

        // Restore default title (may have been changed by other-method timers).
        try {
            const tEl = $("zarScreenTitle");
            if (tEl) tEl.textContent = (LANG === 'ru' ? 'Заруба таймер' : 'Zaruba Timer');
        } catch (_) {}

        openZarBigScreen();
    } catch (_) {
        try { openZarBigScreen(); } catch (_) {}
    }
}

function closeZarBigScreen() {
    try { stopZarBigScreen(true); } catch(_) {}
    try { _zarSpeakCancel(); } catch(_) {}
    try { _zarPlanClose(); } catch(_) {}
    try { _zarScreen.timelineOverride = null; } catch (_) {}
    try {
        if ('_prevAutoTempoRpm' in _zarScreen) {
            _zarAutoTempoRpm = _zarScreen._prevAutoTempoRpm;
            delete _zarScreen._prevAutoTempoRpm;
            try { _zarScreenUpdateAutoTempoStatus(); } catch (_) {}
        }
    } catch (_) {}
    const modal = $("zarScreenModal");
    if (modal) modal.classList.remove('show');
    document.documentElement.classList.remove('modal-open');
    document.body.classList.remove('modal-open');
    _zarScreen.open = false;
    try { _zarWakeMaybe(); } catch (_) {}
    // Restore previous scroll position if captured.
    try {
        const yStr = modal?.dataset?.scrollY;
        if (yStr != null) {
            const y = parseInt(yStr, 10);
            setTimeout(() => {
                try { window.scrollTo({ top: isNaN(y) ? 0 : y, left: 0, behavior: 'auto' }); }
                catch(_) { try { window.scrollTo(0, isNaN(y) ? 0 : y); } catch(_){} }
            }, 0);
        }
    } catch(_) {}
}

// --- Scheme + Timer integration (method-aware) ---
function _tzActiveMethodKey() {
    // Prefer the chart's selection when unambiguous.
    try {
        if (typeof selectedMethods === 'function') {
            const sel = selectedMethods() || {};
            const keys = Object.keys(sel).filter(k => !!sel[k]);
            if (keys.length === 1) return String(keys[0]);
        }
    } catch (_) {}
    // Otherwise use the method currently being edited.
    try {
        const v = String($("editMethodSel")?.value || '').trim();
        if (v) return v;
    } catch (_) {}
    return 'ZRB';
}

function _tzIsCoarsePointerDevice() {
    try {
        if (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) return true;
    } catch (_) {}
    try {
        return (Number(navigator.maxTouchPoints || 0) > 0);
    } catch (_) {
        return false;
    }
}

function _tzMaybeFocus(el) {
    if (!el) return;
    // Mobile UX: never auto-focus text inputs, otherwise the on-screen keyboard pops up.
    if (_tzIsCoarsePointerDevice()) return;
    try { el.focus(); } catch (_) {}
}

function _tzMethodLabel(key) {
    const k = String(key || '').toUpperCase();
    if (LANG === 'ru') {
        if (k === 'ZRB') return 'Заруба';
        if (k === 'Z2') return 'Зона 2';
        if (k === 'Z34') return 'Зона 3–4';
        if (k === 'SN') return 'Рывок (гиря)';
        if (k === 'SW') return 'Махи (гиря)';
    }
    if (k === 'ZRB') return 'Zaruba';
    if (k === 'Z2') return 'Zone 2';
    if (k === 'Z34') return 'Zone 3–4';
    if (k === 'SN') return 'Snatch (KB)';
    if (k === 'SW') return 'Swings (KB)';
    return k || '—';
}

function _tzBuildPatternForMethod(methodKey, p) {
    const k = String(methodKey || '').toUpperCase();
    const out = [];
    const push = (on, off, eff, restEff, extra) => {
        const o = {
            on: Math.max(0, Math.floor(+on || 0)),
            off: Math.max(0, Math.floor(+off || 0)),
            eff: (Number.isFinite(+eff) ? (+eff) : undefined),
            restEff: (Number.isFinite(+restEff) ? (+restEff) : undefined)
        };
        try {
            if (extra && typeof extra === 'object') {
                if (Number.isFinite(+extra.workTempoRpm)) o.workTempoRpm = Math.max(5, Math.min(240, Math.round(+extra.workTempoRpm)));
                if (Number.isFinite(+extra.workReps)) o.workReps = Math.max(0, Math.floor(+extra.workReps));
                if (Number.isFinite(+extra.restTempoRpm)) o.restTempoRpm = Math.max(5, Math.min(240, Math.round(+extra.restTempoRpm)));
            }
        } catch (_) {}
        out.push(o);
    };
    if (!p || typeof p !== 'object') return out;

    if (k === 'SIT') {
        const W = Math.max(1, Math.floor(+p?.sit?.work || 30));
        const R = Math.max(0, Math.floor(+p?.sit?.rest || 180));
        const N = Math.max(1, Math.floor(+p?.sit?.n || 6));
        const eff = Number.isFinite(+p?.sit?.eff) ? (+p.sit.eff) : 9.5;
        for (let i = 0; i < N; i++) push(W, (i < N - 1 ? R : 0), eff, 0);
        return out;
    }
    if (k === 'HIIT') {
        const W = Math.max(1, Math.floor(+p?.hiit?.work || 60));
        const R = Math.max(0, Math.floor(+p?.hiit?.rest || 60));
        const N = Math.max(1, Math.floor(+p?.hiit?.n || 10));
        const eff = Number.isFinite(+p?.hiit?.eff) ? (+p.hiit.eff) : 8.5;
        const restEff = Number.isFinite(+p?.hiit?.restFrac) ? Math.max(0, Math.min(10, (+p.hiit.restFrac) * 20)) : 0;
        for (let i = 0; i < N; i++) push(W, (i < N - 1 ? R : 0), eff, restEff);
        return out;
    }
    if (k === 'Z2') {
        const durSec = Math.max(1, Math.floor((+p?.z2?.min || 40) * 60));
        const eff = Number.isFinite(+p?.z2?.frac) ? Math.max(0, Math.min(10, (+p.z2.frac) * 10)) : 6.5;
        push(durSec, 0, eff, 0);
        return out;
    }
    if (k === 'Z34') {
        const durSec = Math.max(1, Math.floor((+p?.z34?.min || 30) * 60));
        const eff = Number.isFinite(+p?.z34?.frac) ? Math.max(0, Math.min(10, (+p.z34.frac) * 10)) : 7.8;
        push(durSec, 0, eff, 0);
        return out;
    }
    if (k === 'SN' || k === 'SW') {
        const durSec = Math.max(1, Math.floor(((k === 'SN' ? +p?.sn?.min : +p?.sw?.min) || (k === 'SN' ? 10 : 14)) * 60));
        const cadenceRpm = (() => {
            if (k === 'SN') {
                const v = +p?.sn?.cad;
                if (Number.isFinite(v) && v > 0.5) return Math.max(5, Math.min(240, Math.round(v)));
            }
            // SW has no cadence param today; default to zar cadence max (usually 20) so reps-mode is usable.
            const z = +p?.zarOpt?.cadenceMaxRpm;
            if (Number.isFinite(z) && z > 0.5) return Math.max(5, Math.min(240, Math.round(z)));
            return 20;
        })();

        const full = Math.floor(durSec / 60);
        const rem = durSec - full * 60;
        for (let i = 0; i < full; i++) {
            push(60, 0, undefined, undefined, { workReps: cadenceRpm });
        }
        if (rem > 0) {
            const reps = Math.max(0, Math.round(cadenceRpm * (rem / 60)));
            push(rem, 0, undefined, undefined, { workReps: reps });
        }
        // Note: intensity is intentionally omitted from tokens here; SN/SW are reps-first.
        return out;
    }
    push(300, 0, 8.5, 0);
    return out;
}

function _tzBuildTimelineFromPattern(pat, methodKey) {
    const segments = [];
    const pushSeg = (kind, sec, eff, meta, extra) => {
        const s0 = Number.isFinite(+sec) ? Math.max(0, +sec) : 0;
        const s = Math.round(Math.min(600, s0) * 100) / 100;
        if (!(s > 1e-9)) return;
        const seg = { kind, sec: s, eff: Number.isFinite(+eff) ? (+eff) : 0, tempoRpm: null, repsTarget: null, meta: meta || null };
        try {
            if (extra && typeof extra === 'object') {
                if (Number.isFinite(+extra.tempoRpm)) seg.tempoRpm = Math.max(5, Math.min(240, Math.round(+extra.tempoRpm)));
                if (Number.isFinite(+extra.repsTarget)) seg.repsTarget = Math.max(0, Math.floor(+extra.repsTarget));
            }
        } catch (_) {}
        segments.push(seg);
    };
    let t = 0;
    let idx = 0;
    for (const seg of (pat || [])) {
        const on = Number.isFinite(+seg?.on) ? Math.max(0, +seg.on) : 0;
        const off = Number.isFinite(+seg?.off) ? Math.max(0, +seg.off) : 0;
        const eff = Number.isFinite(+seg?.eff) ? (+seg.eff) : 0;
        const restEff = Number.isFinite(+seg?.restEff) ? (+seg.restEff) : 0;
        const wTempo = Number.isFinite(+seg?.workTempoRpm) ? (+seg.workTempoRpm) : null;
        const wReps = Number.isFinite(+seg?.workReps) ? Math.max(0, Math.floor(+seg.workReps)) : null;
        const meta = { itemNoAbs: (++idx), itemInCycle: idx, patternLen: null, cycleNo: null, method: String(methodKey || '') };
        if (on > 0) { pushSeg('work', on, eff, meta, { tempoRpm: wTempo, repsTarget: wReps }); t += on; }
        if (off > 0) { pushSeg('rest', off, restEff, meta); t += off; }
        if (segments.length > 6000) break;
    }
    return { durSec: Math.max(0.01, Math.round((t || 0.01) * 100) / 100), segments };
}

function _tzPatternToString(pat) {
    try {
        if (typeof window.formatZarPatternSegments === 'function') {
            return window.formatZarPatternSegments(pat || [], { lang: LANG });
        }
    } catch (_) {}
    return '';
}

function _tzSchemeSummaryText(methodKey, p) {
    const k = String(methodKey || '').toUpperCase();
    const name = _tzMethodLabel(k);
    if (k === 'SIT') {
        const W = Math.max(1, Math.floor(+p?.sit?.work || 30));
        const R = Math.max(0, Math.floor(+p?.sit?.rest || 180));
        const N = Math.max(1, Math.floor(+p?.sit?.n || 6));
        const eff = Number.isFinite(+p?.sit?.eff) ? (+p.sit.eff) : 9.5;
        return `${name}: ${W}/${R} ×${N} · RPE ${eff}`;
    }
    if (k === 'HIIT') {
        const W = Math.max(1, Math.floor(+p?.hiit?.work || 60));
        const R = Math.max(0, Math.floor(+p?.hiit?.rest || 60));
        const N = Math.max(1, Math.floor(+p?.hiit?.n || 10));
        const eff = Number.isFinite(+p?.hiit?.eff) ? (+p.hiit.eff) : 8.5;
        const restEff = Number.isFinite(+p?.hiit?.restFrac) ? Math.max(0, Math.min(10, (+p.hiit.restFrac) * 20)) : 0;
        const re = restEff.toFixed(1).replace(/\.0$/, '');
        return (LANG === 'ru')
            ? `${name}: ${W}/${R} ×${N} · RPE ${eff} · отдых RPE ${re}`
            : `${name}: ${W}/${R} ×${N} · RPE ${eff} · rest RPE ${re}`;
    }
    if (k === 'Z2') {
        const m = Math.max(1, Math.floor(+p?.z2?.min || 40));
        const frac = Number.isFinite(+p?.z2?.frac) ? Math.round((+p.z2.frac) * 100) : 65;
        return (LANG === 'ru') ? `${name}: ${m} мин · цель ${frac}% HRR` : `${name}: ${m} min · target ${frac}% HRR`;
    }
    if (k === 'Z34') {
        const m = Math.max(1, Math.floor(+p?.z34?.min || 30));
        const frac = Number.isFinite(+p?.z34?.frac) ? Math.round((+p.z34.frac) * 100) : 75;
        return (LANG === 'ru') ? `${name}: ${m} мин · цель ${frac}% HRR` : `${name}: ${m} min · target ${frac}% HRR`;
    }
    if (k === 'SN') {
        const m = Math.max(1, Math.floor(+p?.sn?.min || 10));
        const w = Number.isFinite(+p?.sn?.weight) ? Math.round(+p.sn.weight) : 16;
        const cad = Number.isFinite(+p?.sn?.cad) ? Math.round(+p.sn.cad) : 20;
        return (LANG === 'ru') ? `${name}: ${m} мин · ${w} кг · ${cad} rpm` : `${name}: ${m} min · ${w} kg · ${cad} rpm`;
    }
    if (k === 'SW') {
        const m = Math.max(1, Math.floor(+p?.sw?.min || 14));
        const w = Number.isFinite(+p?.sw?.weight) ? Math.round(+p.sw.weight) : 20;
        const eff = Number.isFinite(+p?.sw?.eff) ? (+p.sw.eff) : 8.5;
        return (LANG === 'ru') ? `${name}: ${m} мин · ${w} кг · RPE ${eff}` : `${name}: ${m} min · ${w} kg · RPE ${eff}`;
    }
    return name;
}

let _tzZpContext = { methodKey: 'ZRB', readOnly: false };

function _tzZpmReadOnlyNotify() {
    try {
        if ($("zpExplainDet")) $("zpExplainDet").open = true;
        if ($("zpExplainHint")) {
            $("zpExplainHint").textContent = (LANG === 'ru')
                ? 'Read-only для этого метода. Нажмите «В Universal» чтобы редактировать.'
                : 'Read-only for this method. Click “Edit in Universal” to edit.';
        }
    } catch (_) {}
}

function _tzSanitizePatternForUniversalTransfer(patternStr, srcMethodKey) {
    try {
        const s = String(patternStr || '').trim();
        if (!s) return '';
        const k = String(srcMethodKey || '').toUpperCase();
        if (k === 'ZRB') return s;

        const parse = (typeof window !== 'undefined' && typeof window.parseZarPattern === 'function')
            ? window.parseZarPattern
            : (window.SimCore?.parseZarPattern);
        const fmt = (typeof window !== 'undefined' && typeof window.formatZarPatternSegments === 'function')
            ? window.formatZarPatternSegments
            : (window.SimCore?.formatZarPatternSegments);
        if (typeof parse !== 'function' || typeof fmt !== 'function') return s;

        // Use a stable offDefault for parsing bare "On" tokens (should be rare in our generated patterns).
        const offDefault = 30;
        const segs = parse(s, offDefault);
        if (!Array.isArray(segs) || segs.length === 0) return s;

        const keepIntensity = (k === 'SIT' || k === 'HIIT' || k === 'Z2' || k === 'Z34');
        const keepTempo = (k === 'SN' || k === 'SW');

        const out = segs.map((seg) => {
            const o = { ...seg };
            if (keepIntensity) {
                delete o.workTempoRpm;
                delete o.workTempoSoftRpm;
                delete o.restTempoRpm;
                delete o.restTempoSoftRpm;
                delete o.workReps;
                delete o.restReps;
                return o;
            }
            if (keepTempo) {
                delete o.eff;
                delete o.restEff;
                delete o.restTempoRpm;
                delete o.restTempoSoftRpm;
                delete o.restReps;
                // Convert reps targets into explicit tempo tokens.
                // For SN/SW we want a stable cadence (tXX) rather than minute-specific reps counts.
                try {
                    const on = Math.max(0, Math.floor(+o?.on || 0));
                    const reps = Number.isFinite(+o?.workReps) ? Math.max(0, Math.floor(+o.workReps)) : null;
                    const hasTempo = Number.isFinite(+o?.workTempoRpm);
                    if (on > 0 && reps != null && !hasTempo) {
                        const rpm = Math.round(60 * reps / on);
                        if (Number.isFinite(rpm) && rpm > 0) o.workTempoRpm = Math.max(5, Math.min(240, rpm));
                    }
                } catch (_) {}
                delete o.workReps;
                delete o.workTempoSoftRpm;
                return o;
            }
            // Fallback: keep as-is.
            return o;
        });

        try {
            if (segs._noCycle) out._noCycle = true;
            if (segs._hardStop) out._hardStop = true;
        } catch (_) {}

        let text = fmt(out, { lang: LANG });
        // Preserve end markers in string form.
        try {
            if (out._hardStop) text = `${text}#`;
            else if (out._noCycle) text = `${text};`;
        } catch (_) {}

        return String(text || '').trim() || s;
    } catch (_) {
        return String(patternStr || '').trim();
    }
}

function _tzEditInUniversalFromZpm() {
    try {
        let patStr = String($("zpInput")?.value || '').trim();
        if (!patStr) {
            _tzZpmReadOnlyNotify();
            return;
        }

        const srcK = String(_tzZpContext?.methodKey || '').toUpperCase();

        // Enforce transfer semantics:
        // - SIT/HIIT/Z2/Z34 => keep intensity tokens, do NOT lock tempo/reps
        // - SN/SW => keep reps tokens, do NOT lock intensity/tempo
        try {
            patStr = _tzSanitizePatternForUniversalTransfer(patStr, _tzZpContext?.methodKey);
        } catch (_) {}

        // When transferring from another method, we want a one-shot scheme that fully determines the effective duration.
        // Ensure a trailing hard-stop marker "#" so the chart/timeline is not limited by the current Duration slider.
        // For ZRB -> ZRB transfers, preserve exact user semantics (do NOT inject '#').
        if (srcK !== 'ZRB') {
            try {
                patStr = patStr.replace(/\s+$/g, '');
                if (/;\s*$/.test(patStr)) patStr = patStr.replace(/;\s*$/g, '');
                if (!/#\s*$/.test(patStr)) patStr = `${patStr}#`;
            } catch (_) {}
        }

        // If chart selection is a single non-ZRB method, add ZRB so "active method" becomes unambiguous.
        try {
            if (typeof selectedMethods === 'function' && typeof setSelectedMethods === 'function') {
                const S = selectedMethods() || {};
                const keys = Object.keys(S).filter(k => !!S[k]);
                if (keys.length === 1 && String(keys[0]).toUpperCase() !== 'ZRB') {
                    S.ZRB = true;
                    setSelectedMethods(S);
                    try { updateMethodDropdownLabels(); } catch (_) {}
                    try { updateShowButtonsVisibility(); } catch (_) {}
                }
            }
        } catch (_) {}

        // Switch editor context to Universal Zaruba.
        try { if ($("zarMode")) $("zarMode").value = 'universal'; } catch (_) {}

        // Kinetics mapping (best-effort).
        try {
            const kin = $("zarKinU");
            if (kin) {
                if (srcK === 'SIT') kin.value = 'sit';
                else if (srcK === 'HIIT') kin.value = 'hiit';
            }
        } catch (_) {}

        try { if ($("zarPatternU")) $("zarPatternU").value = patStr; } catch (_) {}

        // Make ZRB the visible editor card (same behavior as manual dropdown change).
        try {
            const sel = $("editMethodSel");
            if (sel) {
                sel.value = 'ZRB';
                try { sel.dispatchEvent(new Event('change', { bubbles: true })); } catch (_) {
                    try { if (typeof showMethodCard === 'function') showMethodCard('ZRB'); } catch (_) {}
                }
            } else {
                try { if (typeof showMethodCard === 'function') showMethodCard('ZRB'); } catch (_) {}
            }
            try { localStorage.setItem('sit_last_edit_method', 'ZRB'); } catch (_) {}
        } catch (_) {}

        // Show only the ZRB curve on the chart (user explicitly requested to disable other graphs).
        try { if (typeof onlyThisMethod === 'function') onlyThisMethod('ZRB'); } catch (_) {}

        try { if (typeof render === 'function') render(); } catch (_) {}
        try { openSchemeForActiveMethod(); } catch (_) {}
    } catch (_) {}
}

function openSchemeForActiveMethod() {
    try {
        const p = (typeof window.getParams === 'function') ? window.getParams() : null;
        const k = _tzActiveMethodKey();

        const zpm = $("zpmodal");
        const input = $("zpInput");
        if (!zpm || !input) return;

        try {
            if ($("zpExplainDet")) $("zpExplainDet").open = false;
            if ($("zpExplainPattern")) $("zpExplainPattern").textContent = '';
            if ($("zpExplainText")) $("zpExplainText").textContent = '';
            if ($("zpExplainHint")) $("zpExplainHint").textContent = '';
        } catch (_) {}

        try {
            if ($("zpPlanDet")) $("zpPlanDet").open = false;
            if ($("zpPlanTbody")) while ($("zpPlanTbody").firstChild) $("zpPlanTbody").removeChild($("zpPlanTbody").firstChild);
            if ($("zpPlanFooter")) $("zpPlanFooter").textContent = '';
        } catch (_) {}

        try {
            if ($("zpLibDet")) $("zpLibDet").open = false;
        } catch (_) {}

        const isZrb = String(k).toUpperCase() === 'ZRB';
        _tzZpContext = { methodKey: String(k || 'ZRB'), readOnly: !isZrb };

        const allowConvertInReadOnly = (() => {
            const kk = String(k || '').toUpperCase();
            // SN/SW are cadence-driven; user may want p↔t conversion before transferring to Universal.
            return (kk === 'SN' || kk === 'SW');
        })();

        try {
            input.readOnly = !isZrb;
        } catch (_) {}

        try {
            const b = $("zpmEditUniversal");
            if (b) b.style.display = isZrb ? 'none' : '';
        } catch (_) {}

        try {
            const title = $("zpTitle");
            if (title) {
                title.textContent = (LANG === 'ru')
                    ? `Схема: ${_tzMethodLabel(k)}`
                    : `Scheme: ${_tzMethodLabel(k)}`;
            }
        } catch (_) {}

        if (isZrb) {
            try {
                const mode = ($("zarMode")?.value === 'universal') ? 'universal' : 'classic';
                const src = (mode === 'universal' ? $("zarPatternU")?.value : $("zarPatternC")?.value) || "";
                input.value = src;
            } catch (_) {}
            try { $("zpmApply").disabled = false; } catch (_) {}
            try { $("zpmSave").disabled = false; } catch (_) {}
            try { $("zpmConvertPT").disabled = false; } catch (_) {}
            try {
                if ($("zpmApply")) $("zpmApply").style.display = '';
                if ($("zpmSave")) $("zpmSave").style.display = '';
                if ($("zpmConvertPT")) $("zpmConvertPT").style.display = '';
            } catch (_) {}
        } else {
            const pat = _tzBuildPatternForMethod(k, p);
            input.value = _tzPatternToString(pat);
            try {
                if ($("zpExplainHint")) {
                    $("zpExplainHint").textContent = (LANG === 'ru')
                        ? 'Автосхема по текущим параметрам (без разминки/заминки/хвоста). Изменяйте параметры в карточке метода.'
                        : 'Auto-scheme from current parameters (warm/cool/tail trimmed). Change parameters in the method card.';
                }
                if ($("zpExplainText")) {
                    $("zpExplainText").textContent = _tzSchemeSummaryText(k, p);
                }
            } catch (_) {}
            try {
                // Read-only pattern is a staging area for transfer.
                // - For SN/SW (cadence/reps/tempo): allow editing + conversion.
                // - For intensity-only methods: keep UI minimal (Copy + Edit in Universal).
                input.readOnly = !allowConvertInReadOnly;
            } catch (_) {}
            try { $("zpmApply").disabled = true; } catch (_) {}
            try { $("zpmSave").disabled = true; } catch (_) {}
            try { $("zpmConvertPT").disabled = !allowConvertInReadOnly; } catch (_) {}
            try {
                if ($("zpmApply")) $("zpmApply").style.display = allowConvertInReadOnly ? '' : 'none';
                if ($("zpmSave")) $("zpmSave").style.display = allowConvertInReadOnly ? '' : 'none';
                if ($("zpmConvertPT")) $("zpmConvertPT").style.display = allowConvertInReadOnly ? '' : 'none';
            } catch (_) {}
        }

        zpm.classList.add('show');
        try { if (typeof _tzZpmRenderLibrary === 'function') _tzZpmRenderLibrary(); } catch (_) {}
        setTimeout(() => { _tzMaybeFocus(input); }, 50);
    } catch (_) {}
}

function openTimerForActiveMethod() {
    try {
        const p = (typeof window.getParams === 'function') ? window.getParams() : null;
        const k = _tzActiveMethodKey();
        const isZrb = String(k).toUpperCase() === 'ZRB';

        if (!isZrb) {
            const pat = _tzBuildPatternForMethod(k, p);
            const tl = _tzBuildTimelineFromPattern(pat, k);
            // Provide a reasonable auto-tempo for reps-first methods so Big Screen can drive metronome when RPM=0.
            const autoTempoRpm = (() => {
                const kk = String(k || '').toUpperCase();
                if (kk === 'SN') {
                    const v = +p?.sn?.cad;
                    return (Number.isFinite(v) && v > 0.5) ? Math.max(5, Math.min(240, Math.round(v))) : null;
                }
                if (kk === 'SW') {
                    const z = +p?.zarOpt?.cadenceMaxRpm;
                    return (Number.isFinite(z) && z > 0.5) ? Math.max(5, Math.min(240, Math.round(z))) : 20;
                }
                return null;
            })();
            _zarScreen.timelineOverride = {
                durSec: tl.durSec,
                segments: tl.segments,
                methodKey: String(k),
                patternStr: _tzPatternToString(pat),
                summaryText: _tzSchemeSummaryText(k, p),
                autoTempoRpm
            };

            try {
                // Temporarily inject auto tempo for the Big Screen metronome when RPM=0.
                // Restore on close.
                if (Number.isFinite(+autoTempoRpm) && (+autoTempoRpm) > 0.5) {
                    if (!('_prevAutoTempoRpm' in _zarScreen)) _zarScreen._prevAutoTempoRpm = _zarAutoTempoRpm;
                    _zarAutoTempoRpm = Math.max(5, Math.min(240, Math.round(+autoTempoRpm)));
                    try { _zarScreenUpdateAutoTempoStatus(); } catch (_) {}
                }
            } catch (_) {}
        } else {
            try { _zarScreen.timelineOverride = null; } catch (_) {}
            try {
                if ('_prevAutoTempoRpm' in _zarScreen) {
                    _zarAutoTempoRpm = _zarScreen._prevAutoTempoRpm;
                    delete _zarScreen._prevAutoTempoRpm;
                    try { _zarScreenUpdateAutoTempoStatus(); } catch (_) {}
                }
            } catch (_) {}
        }

        try {
            const tEl = $("zarScreenTitle");
            if (tEl) {
                tEl.textContent = isZrb
                    ? (LANG === 'ru' ? 'Заруба таймер' : 'Zaruba Timer')
                    : ((LANG === 'ru' ? 'Таймер: ' : 'Timer: ') + _tzMethodLabel(k));
            }
        } catch (_) {}

        openZarBigScreen();
    } catch (_) {
        try { openZarBigScreen(); } catch (_) {}
    }
}

function _zarPlanIsOpen() {
    try { return !!($("zarPlanModal") && $("zarPlanModal").style.display !== 'none'); } catch (_) { return false; }
}

function _zarPlanClose() {
    try {
        const m = $("zarPlanModal");
        if (m) m.style.display = 'none';
    } catch (_) {}
}

function _zarPlanOpen() {
    try {
        if (!_zarScreen?.open) return;
        _zarPlanRender();
        const m = $("zarPlanModal");
        if (m) m.style.display = '';
    } catch (_) {}
}

function _zarPlanComputeClickTimesForView(built) {
    try {
        const SimCore = window.SimCore;
        if (!SimCore || typeof SimCore.simulateZarubaClickPlan !== 'function') return null;

        // Keep model parameters in sync with current UI.
        try { _zarPerfSyncModelFromUI(); } catch (_) {}

        const pat = _zarBuildNormalizedPatternForSim();
        if (!pat || !pat.length) return null;
        const model = {
            cadenceMaxRpm: Math.max(1, +($('zarOptCad')?.value || 20)),
            allOutSec: Math.max(5, +($('zarOptAllOut')?.value || 45)),
            recTauSec: Math.max(5, +($('zarOptRec')?.value || 30)),
            tempoFatiguePow: Math.max(0.5, Math.min(3.0, +($('zarOptTempoPow')?.value || 1.0))),
            minCadenceFrac: Math.max(0, Math.min(1, +(_zarPerf?.model?.minCadenceFrac ?? 0.35))),
            fCrit: Math.max(0, Math.min(1, +(_zarPerf?.model?.fCrit ?? 0.85))),
            switchCostSec: Math.max(0, Math.floor(_zarSwitchCostSec())),
            defaultEff10: 10,
            defaultRestEff10: _zarDefaultRestEff10FromUI()
        };
        const durSec = Math.max(1, Math.floor(+((built && built.durSec) || _zarScreen?.durSec || 300)));

        // If the scheme explicitly specifies reps targets (rNN / пNN), build the click plan
        // from the already-expanded Big Screen phases. This keeps click times aligned with
        // fractional durations (e.g. Sally) and makes reps counting deterministic.
        try {
            const phases = Array.isArray(built?.phases) ? built.phases : (Array.isArray(_zarScreen?.phases) ? _zarScreen.phases : []);
            const hasRepsTargets = phases.some(ph => (String(ph?.kind || '') === 'work') && Number.isFinite(+ph?.repsTarget) && (+ph.repsTarget) >= 1);
            if (hasRepsTargets) {
                const timesSec = [];
                for (const ph of phases) {
                    if (String(ph?.kind || '') !== 'work') continue;
                    const repsTarget = Number.isFinite(+ph?.repsTarget) ? Math.max(0, Math.floor(+ph.repsTarget)) : 0;
                    if (repsTarget <= 0) continue;
                    const start = Number.isFinite(+ph?.start) ? Math.max(0, +ph.start) : 0;
                    const end = Number.isFinite(+ph?.end) ? Math.max(start, +ph.end) : start;
                    const span = Math.max(0, end - start);
                    if (!(span > 1e-6)) continue;
                    const interval = span / repsTarget;
                    for (let k = 0; k < repsTarget; k++) {
                        const tClick = start + (k + 0.5) * interval;
                        if (tClick > start + 1e-9 && tClick < end - 1e-9) timesSec.push(tClick);
                    }
                }
                timesSec.sort((a, b) => a - b);
                return {
                    timesSec,
                    reps: timesSec.length || 0,
                    repsRaw: null,
                    fatigueEnd: null,
                    sig: null
                };
            }
        } catch (_) {}

        const _sig = (() => {
            try {
                const patSig = pat.map(s => {
                    const on = Math.max(0, Math.floor(+s?.on || 0));
                    const off = Math.max(0, Math.floor(+s?.off || 0));
                    const eff = Number.isFinite(+s?.eff) ? (+s.eff) : '';
                    const restEff = Number.isFinite(+s?.restEff) ? (+s.restEff) : '';
                    const wt = Number.isFinite(+s?.workTempoRpm) ? Math.round(+s.workTempoRpm) : 0;
                    const rt = Number.isFinite(+s?.restTempoRpm) ? Math.round(+s.restTempoRpm) : 0;
                    const wr = Number.isFinite(+s?.workReps) ? Math.round(+s.workReps) : 0;
                    return `${on},${off},${eff},${restEff},${wt},${rt},${wr}`;
                }).join('|');
                const m = model;
                const mSig = [
                    durSec,
                    m.cadenceMaxRpm, m.allOutSec, m.recTauSec, m.tempoFatiguePow,
                    m.minCadenceFrac, m.fCrit, m.switchCostSec,
                    m.defaultEff10, m.defaultRestEff10
                ].join(',');
                return `${mSig}::${patSig}`;
            } catch (_) { return null; }
        })();

        const existingPlan = _zarScreen?.clickPlan;
        const existing = existingPlan?.timesSec;
        if (Array.isArray(existing) && existing.length && _sig && existingPlan?.sig === _sig) {
            return { timesSec: existing, reps: (existing.length || 0), repsRaw: null, fatigueEnd: null, sig: _sig };
        }

        const sim = SimCore.simulateZarubaClickPlan(pat, durSec, model);
        const times = Array.isArray(sim?.clickTimesSec) ? sim.clickTimesSec : [];
        return {
            timesSec: times,
            reps: Number.isFinite(+sim?.reps) ? (+sim.reps) : (times.length || 0),
            repsRaw: Number.isFinite(+sim?.repsRaw) ? (+sim.repsRaw) : null,
            fatigueEnd: Number.isFinite(+sim?.fatigueEnd) ? (+sim.fatigueEnd) : null,
            sig: _sig
        };
    } catch (_) {
        return null;
    }
}

function _zarEnsureGoldenPlan(opts) {
    try {
        const o = (opts && typeof opts === 'object') ? opts : {};
        const resetCursor = !!o.resetCursor;
        const allowRebuildPhases = ('allowRebuildPhases' in o) ? !!o.allowRebuildPhases : true;
        const clearIfNoPlan = ('clearIfNoPlan' in o) ? !!o.clearIfNoPlan : true;

        // While running, never rebuild anything (timer must stay dumb).
        if (_zarScreen?.running) {
            return {
                built: { durSec: _zarScreen?.durSec, phases: _zarScreen?.phases },
                plan: (_zarScreen?.clickPlan && Array.isArray(_zarScreen.clickPlan.timesSec))
                    ? { timesSec: _zarScreen.clickPlan.timesSec, reps: _zarScreen.clickPlan.timesSec.length, repsRaw: _zarScreen.clickPlan.repsRaw ?? null, sig: _zarScreen.clickPlan.sig ?? null }
                    : null
            };
        }

        // Keep phases in sync with current UI (preview / plan mode).
        let built = null;
        if (allowRebuildPhases) {
            built = _zarScreenBuildPhases();
            _zarScreen.durSec = built.durSec;
            _zarScreen.phases = built.phases;
            _zarScreen.tokenMode = _zarScreenComputeTokenMode(_zarScreen.phases);
        } else {
            built = { durSec: _zarScreen?.durSec, phases: _zarScreen?.phases };
        }

        const plan = _zarPlanComputeClickTimesForView(built);
        if (plan && Array.isArray(plan.timesSec)) {
            const existing = _zarScreen?.clickPlan;
            const keepCursor = (!resetCursor && existing && Array.isArray(existing.timesSec) && existing.sig && plan.sig && existing.sig === plan.sig);
            _zarScreen.clickPlan = {
                timesSec: plan.timesSec,
                nextIdx: keepCursor ? (existing.nextIdx || 0) : 0,
                scheduledIdx: keepCursor ? (existing.scheduledIdx || 0) : 0,
                repsPred: Number.isFinite(+plan.reps) ? (+plan.reps) : (plan.timesSec.length || 0),
                repsRaw: Number.isFinite(+plan.repsRaw) ? (+plan.repsRaw) : null,
                sig: plan.sig || null
            };
        } else if (clearIfNoPlan) {
            _zarScreen.clickPlan = null;
        }

        return { built, plan };
    } catch (_) {
        return { built: null, plan: null };
    }
}

function _zarPlanRender() {
    try {
        const tbody = $("zarPlanTbody");
        const footer = $("zarPlanFooter");
        if (!tbody) return;

        const tm = _zarScreen?.tokenMode || _zarScreenComputeTokenMode(_zarScreen?.phases);
        const mode = String(tm?.mode || 'reps');
        const showReps = (mode === 'reps');
        try {
            const thReps = $("zarPlanThReps");
            const thTotal = $("zarPlanThTotal");
            if (thReps) thReps.style.display = showReps ? '' : 'none';
            if (thTotal) thTotal.style.display = showReps ? '' : 'none';
        } catch (_) {}

        // Golden plan: rebuild only when not running.
        let phases = Array.isArray(_zarScreen?.phases) ? _zarScreen.phases : [];
        let times = (_zarScreen?.clickPlan && Array.isArray(_zarScreen.clickPlan.timesSec)) ? _zarScreen.clickPlan.timesSec : [];
        if (!_zarScreen?.running) {
            const res = _zarEnsureGoldenPlan({ allowRebuildPhases: true, resetCursor: false, clearIfNoPlan: true });
            phases = Array.isArray(_zarScreen?.phases) ? _zarScreen.phases : (res?.built?.phases || []);
            times = (_zarScreen?.clickPlan && Array.isArray(_zarScreen.clickPlan.timesSec)) ? _zarScreen.clickPlan.timesSec : (res?.plan?.timesSec || []);
        }

        const countInRange = (a, b) => {
            if (!times.length) return null;
            const start = Math.max(0, +a || 0);
            const end = Math.max(start, +b || 0);
            // lower_bound(start)
            let lo = 0, hi = times.length;
            while (lo < hi) {
                const mid = (lo + hi) >> 1;
                if ((+times[mid] || 0) < start) lo = mid + 1; else hi = mid;
            }
            const i0 = lo;
            // lower_bound(end)
            lo = i0; hi = times.length;
            while (lo < hi) {
                const mid = (lo + hi) >> 1;
                if ((+times[mid] || 0) < end) lo = mid + 1; else hi = mid;
            }
            const i1 = lo;
            return Math.max(0, i1 - i0);
        };

        // Clear
        while (tbody.firstChild) tbody.removeChild(tbody.firstChild);

        let workIdx = 0;
        let total = 0;
        for (const ph of (phases || [])) {
            const kind = String(ph?.kind || '');
            if (kind !== 'work' && kind !== 'rest') continue;

            const start = Math.max(0, +ph.start || 0);
            const end = Math.max(start, +ph.end || 0);

            let repsN = 0;
            let label = '';
            let tempoTxt = '';

            if (kind === 'work') {
                workIdx++;
                const reps = countInRange(start, end);
                repsN = (reps == null) ? 0 : Math.max(0, Math.floor(reps));
                total += repsN;

                label = _zarScreenFmtIntervalLabel(ph)
                    || ((LANG === 'ru') ? `Интервал ${workIdx}` : `Interval ${workIdx}`);
                const durSec = Math.max(0, end - start);
                const hasTempoOverride = (Number.isFinite(+ph?.tempoRpm) && (+ph.tempoRpm) > 0.5);
                const hasRepsTarget = (ph?.repsTarget != null && Number.isFinite(+ph?.repsTarget) && (+ph.repsTarget) >= 1);
                if (hasTempoOverride) {
                    // tXX means an explicit metronome RPM cap; it must not be scaled by intensity in the Plan view.
                    const cap = _zarModelCadenceCapRpm(ph?.tempoRpm);
                    tempoTxt = (cap > 0.5) ? String(Math.round(cap)) : '';
                } else if (hasRepsTarget && durSec > 0.5 && repsN > 0) {
                    const avg = 60 * repsN / durSec;
                    tempoTxt = (Number.isFinite(avg) && avg > 0.5) ? String(Math.round(avg)) : '';
                } else {
                    const cap = _zarModelCadenceCapRpm(ph?.tempoRpm);
                    const frac = Math.max(0, Math.min(1, (+ph?.eff || 0) / 10));
                    const tempo = cap * frac;
                    tempoTxt = (Number.isFinite(+tempo) && (+tempo) > 0.5) ? String(Math.round(+tempo)) : '';
                }
            } else {
                // REST row
                label = (LANG === 'ru') ? 'Отдых' : 'Rest';
                repsN = 0;
                // Only show tempo on rest if there is an explicit per-phase override (tXX on rest)
                if (Number.isFinite(+ph?.tempoRpm) && (+ph.tempoRpm) > 0.5) {
                    const cap = _zarModelCadenceCapRpm(ph?.tempoRpm);
                    tempoTxt = (cap > 0.5) ? String(Math.round(cap)) : '';
                }
            }

            const tr = document.createElement('tr');
            const tdTime = document.createElement('td');
            tdTime.className = 'mono';
            tdTime.textContent = _zarFmtMMSS(start);
            const tdInt = document.createElement('td');
            tdInt.textContent = label;
            const tdTempo = document.createElement('td');
            tdTempo.className = 'mono';
            tdTempo.textContent = tempoTxt;
            const tdReps = document.createElement('td');
            tdReps.className = 'mono';
            tdReps.textContent = showReps ? String(repsN) : '';
            tdReps.style.display = showReps ? '' : 'none';
            const tdTotal = document.createElement('td');
            tdTotal.className = 'mono';
            tdTotal.textContent = showReps ? String(total) : '';
            tdTotal.style.display = showReps ? '' : 'none';
            tr.appendChild(tdTime);
            tr.appendChild(tdInt);
            tr.appendChild(tdTempo);
            tr.appendChild(tdReps);
            tr.appendChild(tdTotal);
            tbody.appendChild(tr);
        }

        if (footer) {
            const dur = Math.max(1, Math.floor(+(_zarScreen?.durSec || 300)));
            if (showReps) {
                const totTxt = (LANG === 'ru')
                    ? `Всего: ${total} ${_zarRuRepWord(total)} · длительность ${_zarFmtMMSS(dur)}`
                    : `Total: ${total} reps · duration ${_zarFmtMMSS(dur)}`;
                footer.textContent = totTxt;
            } else {
                footer.textContent = (LANG === 'ru')
                    ? `Длительность ${_zarFmtMMSS(dur)}`
                    : `Duration ${_zarFmtMMSS(dur)}`;
            }
        }
    } catch (e) {
        try {
            const footer = $("zarPlanFooter");
            if (footer) footer.textContent = (LANG === 'ru') ? 'Не удалось построить план.' : 'Failed to build plan.';
        } catch (_) {}
    }
}

function _zarScreenBuildPhases() {
    const tl = _zarBuildTimelineFromCurrentZar();
    const phases = [];
    let tCs = 0;
    for (const seg of tl.segments) {
        const sec0 = Number.isFinite(+seg?.sec) ? Math.max(0, +seg.sec) : 0;
        const secCs = Math.max(0, Math.min(60000, Math.round(Math.min(600, sec0) * 100)));
        if (!secCs) continue;
        const meta = (seg && typeof seg === 'object' && seg.meta && typeof seg.meta === 'object') ? seg.meta : null;
        const start = tCs / 100;
        const end = (tCs + secCs) / 100;
        phases.push({
            kind: seg.kind,
            start,
            end,
            eff: +seg.eff,
            tempoRpm: (seg.tempoRpm == null) ? null : (Number.isFinite(+seg.tempoRpm) ? (+seg.tempoRpm) : null),
            repsTarget: (seg.repsTarget == null) ? null : (Number.isFinite(+seg.repsTarget) ? Math.max(0, Math.floor(+seg.repsTarget)) : null),
            itemNoAbs: (meta && Number.isFinite(+meta.itemNoAbs)) ? (+meta.itemNoAbs) : null,
            itemInCycle: (meta && Number.isFinite(+meta.itemInCycle)) ? (+meta.itemInCycle) : null,
            patternLen: (meta && Number.isFinite(+meta.patternLen)) ? (+meta.patternLen) : null,
            cycleNo: (meta && Number.isFinite(+meta.cycleNo)) ? (+meta.cycleNo) : null
        });
        tCs += secCs;
        if (tCs / 100 >= tl.durSec) break;
        if (phases.length > 5000) break;
    }
    return { durSec: tl.durSec, phases };
}

function _zarScreenFmtIntervalLabel(ph) {
    try {
        const n = (ph && Number.isFinite(+ph.itemNoAbs) && (+ph.itemNoAbs) > 0) ? Math.floor(+ph.itemNoAbs) : null;
        if (!n) return '';
        const i = (ph && Number.isFinite(+ph.itemInCycle) && (+ph.itemInCycle) > 0) ? Math.floor(+ph.itemInCycle) : null;
        const m = (ph && Number.isFinite(+ph.patternLen) && (+ph.patternLen) > 0) ? Math.floor(+ph.patternLen) : null;
        if (i && m) return (LANG === 'ru') ? `Интервал ${n} · ${i}/${m}` : `Interval ${n} · ${i}/${m}`;
        return (LANG === 'ru') ? `Интервал ${n}` : `Interval ${n}`;
    } catch (_) {
        return '';
    }
}

function _zarScreenSetButtons(active) {
    // "active" means: countdown OR running OR stopped-to-continue (session in progress).
    const startBtn = $("zarScreenStart");
    const planBtn = $("zarScreenPlan");
    const stopBtn = $("zarScreenStop");

    // Be resilient: some callers may still pass a legacy "active" flag.
    // Derive the real active state from the current Big Screen runtime state.
    // Pre-start countdown: countdownActive is true while running is still false.
    // (We intentionally do NOT rely on `started` here to avoid any transient state races.)
    const inCountdown = !!(_zarScreen?.countdownActive) && !(_zarScreen?.running);
    const isStopped = !!(_zarScreen?.started && _zarScreen?.running && _zarScreen?.paused);
    const isRunning = !!((_zarScreen?.started && _zarScreen?.running) && !_zarScreen?.paused && !inCountdown);
    const isActive = !!active || inCountdown || isStopped || isRunning;

    const showPre = !isActive;
    const showCountdown = inCountdown;
    const showStopOnly = isRunning;
    const showContinueReset = isStopped;

    // Button texts (dynamic)
    if (startBtn) startBtn.textContent = showContinueReset
        ? (LANG === 'ru' ? 'Продолжить' : 'Continue')
        : (LANG === 'ru' ? 'Старт' : 'Start');
    if (planBtn) planBtn.textContent = showContinueReset
        ? (LANG === 'ru' ? 'Сбросить' : 'Reset')
        : (LANG === 'ru' ? 'План' : 'Plan');
    if (stopBtn) stopBtn.textContent = (LANG === 'ru' ? 'Стоп' : 'Stop');

    // Visibility
    if (startBtn) startBtn.style.display = (showPre || showContinueReset) ? '' : 'none';
    if (planBtn) planBtn.style.display = (showPre || showContinueReset) ? '' : 'none';
    if (stopBtn) stopBtn.style.display = (showCountdown || showStopOnly) ? '' : 'none';

    // Enable/disable
    if (startBtn) startBtn.disabled = !(showPre || showContinueReset);
    if (planBtn) planBtn.disabled = !(showPre || showContinueReset);
    if (stopBtn) stopBtn.disabled = !(showCountdown || showStopOnly);
}

function _zarScreenStopToContinueState() {
    try {
        if (!_zarScreen.open) return;
        if (!_zarScreen.started) return; // no stop during pre-start countdown
        if (!_zarScreen.running) return;
        if (_zarScreen.paused) return;

        const now = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
        const elapsedPerf = Math.max(0, (now - (_zarScreen.startPerf || now)) / 1000);
        let elapsed = elapsedPerf;
        // If music clock is active, prefer it so pause/resume stays locked to the track.
        try {
            const a = _zarMusic?.audio;
            const canUseMusicClock = _zarMusicEnabled()
                && a && typeof a.currentTime === 'number'
                && !!String(a.src || '').trim()
                && !a.paused;
            if (canUseMusicClock && Number.isFinite(+_zarScreen.musicClockBaseSec)) {
                const ct = Math.max(0, +a.currentTime || 0);
                const musicElapsed = Math.max(0, (+_zarScreen.musicClockLoopsBaseSec || 0) + ct);
                elapsed = Math.max(0, musicElapsed + (+_zarScreen.musicClockBaseSec || 0));
            }
        } catch (_) {}
        _zarScreen.paused = true;
        _zarScreen.pausedElapsedSec = elapsed;
        _zarScreen.finishCountdownLast = -1;
        _zarScreenSetCountdown(null);
        try { _zarSpeakCancel(); } catch (_) {}
        try { _zarMetroReset(); } catch (_) {}
        try { _zarMusicPause(); } catch (_) {}
        _zarScreenSetButtons(true);
        try { _zarWakeMaybe(); } catch (_) {}
        try {
            const left = Math.max(0, (_zarScreen.durSec || 0) - elapsed);
            _zarScreenSetTimerTextByMode(elapsed, left);
            if ($("zarScreenSub")) {
                $("zarScreenSub").textContent = (LANG === 'ru')
                    ? `Остановлено · осталось ${Math.ceil(left)}s`
                    : `Stopped · ${Math.ceil(left)}s left`;
            }
        } catch (_) {}
    } catch (_) {}
}

function zarScreenContinue() {
    try {
        if (!_zarScreen.open) return;
        if (!_zarScreen.started) return;
        if (!_zarScreen.running) return;
        if (!_zarScreen.paused) return;

        const now = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
        const elapsed = Math.max(0, +_zarScreen.pausedElapsedSec || 0);
        _zarScreen.paused = false;
        _zarScreen.startPerf = now - elapsed * 1000;
        _zarScreen.pausedElapsedSec = elapsed;
        _zarScreen.finishCountdownLast = -1;
        _zarScreenSetCountdown(null);
        try {
            const ctx = _ensureAudioCtx();
            if (ctx) _zarScreen.audioStartTime = ctx.currentTime - elapsed;
        } catch (_) {}
        try { _zarSpeakCancel(); } catch (_) {}
        try { _zarMetroReset(); } catch (_) {}
        try { _zarMusicMaybeUnlockByGesture(); } catch (_) {}
        try { _zarMusicPlay(); } catch (_) {}
        _zarScreenSetButtons(true);
        try { _zarWakeMaybe(); } catch (_) {}
    } catch (_) {}
}

function zarScreenStartOrContinue() {
    try {
        if (!_zarScreen?.open) return;
        if (_zarScreen?.running && _zarScreen?.started && _zarScreen?.paused) {
            zarScreenContinue();
            return;
        }
        // Only allow starting from the idle (pre-start) state.
        if (_zarScreen?.running || _zarScreen?.countdownActive || _zarScreen?.started) return;
        startZarBigScreen();
    } catch (_) {}
}

function zarScreenPlanOrReset() {
    try {
        if (!_zarScreen?.open) return;
        if (_zarScreen?.running && _zarScreen?.started && _zarScreen?.paused) {
            stopZarBigScreen(true);
            try { _zarScreenUpdateStatic(); } catch (_) {}
            return;
        }
        if (_zarScreen?.running || _zarScreen?.countdownActive || _zarScreen?.started) return;
        _zarPlanOpen();
    } catch (_) {}
}

function zarScreenStopPressed() {
    try {
        if (!_zarScreen?.open) return;
        // During pre-start countdown: Stop cancels.
        const inCountdown = !!(_zarScreen?.countdownActive) && !(_zarScreen?.running);
        if (inCountdown) {
            stopZarBigScreen(false);
            return;
        }
        // During running: Stop transitions to Continue/Reset state.
        if (_zarScreen?.running && _zarScreen?.started && !_zarScreen?.paused) {
            _zarScreenStopToContinueState();
            return;
        }
    } catch (_) {}
}

function startZarBigScreen() {
    try {
        // Portrait-only: landscape hides bottom controls on many phones.
        try {
            const isPhoneLike = !!(window.matchMedia
                && window.matchMedia('(pointer: coarse)')?.matches
                && window.matchMedia('(hover: none)')?.matches);
            if (isPhoneLike && window.matchMedia('(orientation: landscape)')?.matches) {
                alert(LANG === 'ru'
                    ? 'Заруба таймер работает только в вертикальном режиме. Поверните телефон.'
                    : 'Zaruba Timer is portrait-only. Please rotate your phone.');
                return;
            }
        } catch (_) {}

        // Avoid double-audio if the simple beeper is running
        try { stopZarBeeper(true); } catch(_) {}

        // Best-effort: unlock music playback (autoplay policy) inside this user gesture.
        try { _zarMusicWireOnce(); } catch (_) {}
        try { _zarMusicMaybeUnlockByGesture(); } catch (_) {}

        _zarMetroReset();

        const ctx = _ensureAudioCtx();
        if (!ctx) {
            alert(LANG==='ru' ? 'Ваш браузер не поддерживает Web Audio.' : 'Web Audio not supported in this browser.');
            return;
        }
        _audioTryResume(ctx);

        const built = _zarScreenBuildPhases();
        _zarScreen.durSec = built.durSec;
        _zarScreen.phases = built.phases;
        _zarScreen.tokenMode = _zarScreenComputeTokenMode(_zarScreen.phases);
        _zarScreen.phaseIdx = 0;
        _zarScreen.preSwitchWarnedIdx = -1;
        _zarScreen.endCountdownArmed = false;
        // Golden plan is computed once here (start button), then the timer just plays it.
        try {
            _zarEnsureGoldenPlan({ allowRebuildPhases: false, resetCursor: true, clearIfNoPlan: true });
        } catch (_) {
            _zarScreen.clickPlan = null;
        }
        _zarScreenClearTimers();

        const firstKind = _zarScreen.phases[0]?.kind || 'work';
        const firstEff = _zarScreen.phases[0]?.eff;
        const firstLabel = _zarScreenFmtIntervalLabel(_zarScreen.phases[0]);
        const root = $("zarScreen");
        if (root) {
            root.classList.remove('zs-pulse');
            root.classList.toggle('zs-work', firstKind === 'work');
            root.classList.toggle('zs-rest', firstKind !== 'work');
        }
        if ($("zarScreenPhase")) $("zarScreenPhase").textContent = (LANG==='ru' ? (firstKind === 'work' ? 'РАБОТА' : 'ОТДЫХ') : (firstKind === 'work' ? 'WORK' : 'REST'));
        _zarScreenSetEff(firstKind, firstEff);
        _zarScreenSetTimerTextByMode(0, _zarScreen.durSec);
        const countdownSec = _zarScreenCountdownSec();
        if ($("zarScreenSub")) {
            const base = (LANG==='ru'
                ? `${firstKind === 'work' ? 'Работа' : 'Отдых'} через ${countdownSec || 0}…`
                : `${firstKind === 'work' ? 'Work' : 'Rest'} in ${countdownSec || 0}…`);
            $("zarScreenSub").textContent = firstLabel ? `${firstLabel} · ${base}` : base;
        }

        // Countdown BEFORE the first phase (usually WORK)
        _zarScreen.paused = false;
        _zarScreen.pausedElapsedSec = 0;
        _zarScreen.started = false;
        _zarScreen.countdownActive = true;
        _zarScreen.lastPhaseIdx = -1;
        _zarScreen.finishCountdownLast = -1;
        _zarScreenSetButtons(true);
        _zarScreen.running = false;
        try { _zarWakeMaybe(); } catch (_) {}
        let n = countdownSec;
        if (!(n > 0)) {
            _zarScreenSetCountdown(null);
            _zarScreen.countdownActive = false;
            _zarScreenStartRun();
            return;
        }

        _zarScreenSetCountdown(n);
        _playBeep(660, 120);
        _zarVibrate(18);
        _zarSpeak(String(n));

        const tick = () => {
            n -= 1;
            if (n > 0) {
                _zarScreenSetCountdown(n);
                _playBeep(660, 120);
                _zarVibrate(18);
                _zarSpeak((LANG==='ru' ? String(n) : String(n)));
                if ($("zarScreenSub")) {
                    const base = (LANG==='ru'
                        ? `${firstKind === 'work' ? 'Работа' : 'Отдых'} через ${n}…`
                        : `${firstKind === 'work' ? 'Work' : 'Rest'} in ${n}…`);
                    $("zarScreenSub").textContent = firstLabel ? `${firstLabel} · ${base}` : base;
                }
            } else {
                _zarScreenSetCountdown(null);
                _zarScreenStartRun();
            }
        };
        for (let k = 1; k <= countdownSec; k++) {
            _zarScreen.timeouts.push(setTimeout(tick, k * 1000));
        }
    } catch (e) {
        console.error(e);
        stopZarBigScreen(true);
        alert(LANG==='ru' ? 'Не удалось запустить таймер.' : 'Failed to start timer.');
    }
}

function _zarScreenStartRun() {
    // Important: build phases + click plan first; while running, we must not rebuild.
    _zarScreen.running = false;
    _zarScreen.paused = false;
    _zarScreen.pausedElapsedSec = 0;
    _zarScreen.started = true;
    _zarScreen.countdownActive = false;
    _zarScreen.startPerf = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
    try {
        const ctx = _ensureAudioCtx();
        _zarScreen.audioStartTime = ctx ? ctx.currentTime : 0;
    } catch (_) {
        _zarScreen.audioStartTime = 0;
    }
    _zarScreen.phaseIdx = 0;
    _zarScreen.preSwitchWarnedIdx = -1;
    _zarScreen.lastPhaseIdx = -1;
    _zarScreen.workPhaseCount = 0;
    _zarScreen.finishCountdownLast = -1;

    // Optional sync source: when music is enabled and actually playing,
    // use the music playback clock to drive the timer (avoids drift vs the track).
    _zarScreen.musicClockBaseSec = null;
    _zarScreen.musicClockPrevCt = null;
    _zarScreen.musicClockLoopsBaseSec = 0;
    _zarScreenSetButtons(true);

    // Reset voice intensity de-dup for this attempt.
    try {
        _zarVoiceState.lastWorkIntensitySpoken = null;
        _zarVoiceState.endCueWorkIdx = -1;
        _zarVoiceState.endCue2Spoken = false;
    } catch (_) {}

    // Reset runtime counters before we generate the click plan.
    // (_zarPerfReset syncs model params used by voice/plan helpers.)
    _zarMetroReset();
    _zarRepsCounterReset();
    _zarPerfReset();

    // Golden click plan (single source of truth for timer/voice/metronome/reps).
    // Prefer the plan computed at countdown start; rebuild only if missing.
    try {
        const hasPlan = !!(_zarScreen?.clickPlan && Array.isArray(_zarScreen.clickPlan.timesSec) && _zarScreen.clickPlan.timesSec.length);
        _zarEnsureGoldenPlan({ allowRebuildPhases: !hasPlan, resetCursor: true, clearIfNoPlan: true });
    } catch (_) {
        _zarScreen.clickPlan = null;
    }

    // If voice announces planned reps, we may need a small lead-in so the phrase fits.
    // This effectively lowers tempo at the start of some work blocks (without changing total reps).
    try { _zarApplyVoicePaddingToClickPlan(_zarScreen.phases); } catch (_) {}

    // Timer starts now: from this point on, we must not rebuild phases or click plan.
    _zarScreen.running = true;
    // Now that `running` is true, ensure the UI shows the single Stop button.
    _zarScreenSetButtons(true);
    try { _zarWakeMaybe(); } catch (_) {}

    // Start cue (work/rest) — speak after click plan is ready so we can announce planned reps.
    const firstKind = _zarScreen.phases[0]?.kind || 'work';
    const firstEff = _zarScreen.phases[0]?.eff;
    const firstTempo = _zarScreen.phases[0]?.tempoRpm;
    const firstDur = Math.max(0, (_zarScreen.phases[0]?.end || 0) - (_zarScreen.phases[0]?.start || 0));
    _playBeep(firstKind === 'work' ? 880 : 440, 140);
    _zarVibrate(firstKind === 'work' ? 35 : 25);
    _zarSpeakPhaseStart(firstKind, firstEff, firstDur, firstTempo, 0, (_zarScreen.phases[0]?.end ?? firstDur), _zarScreen.phases[0]?.repsTarget);

    // Music starts together with the timer run (after countdown).
    try { _zarMusicPlay(); } catch (_) {}

    // Switch-cost applies only at the start of WORK, and not for the first WORK.
    _zarRepsCounterOnPhaseBoundary(firstKind, 0, false);
    _zarPerfOnPhaseBoundary(firstKind, firstEff, 0, false);
    _zarRepsIntervalOnPhaseBoundary(firstKind, (String(firstKind) === 'work') ? 1 : 0);
    {
        const isWork = (String(firstKind) === 'work');
        const willMetro = _zarWillMetronomeTick(firstKind, firstTempo);
        if (willMetro) _zarMetroOnPhaseBoundary(0, firstEff, false);
        if (isWork) _zarScreen.workPhaseCount = 1;
    }

    const update = () => {
        const now = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
        const elapsedPerf = _zarScreen.paused
            ? Math.max(0, +_zarScreen.pausedElapsedSec || 0)
            : (now - _zarScreen.startPerf) / 1000;

        // If music is playing, prefer its clock as the source of truth.
        // This keeps phase boundaries locked to the track even if the browser audio clock
        // runs slightly faster/slower than performance.now().
        let elapsed = elapsedPerf;
        try {
            const a = _zarMusic?.audio;
            const canUseMusicClock = !_zarScreen.paused
                && _zarMusicEnabled()
                && a && typeof a.currentTime === 'number'
                && !!String(a.src || '').trim()
                && !a.paused;

            if (canUseMusicClock) {
                const ct = Math.max(0, +a.currentTime || 0);
                const prev = (typeof _zarScreen.musicClockPrevCt === 'number') ? _zarScreen.musicClockPrevCt : null;
                if (prev != null && ct + 0.05 < prev) {
                    // Loop or seek detected. Prefer duration if known; otherwise use the previous ct.
                    const dur = (typeof a.duration === 'number' && Number.isFinite(a.duration) && a.duration > 1) ? a.duration : prev;
                    _zarScreen.musicClockLoopsBaseSec = Math.max(0, (+_zarScreen.musicClockLoopsBaseSec || 0) + Math.max(0, dur));
                }
                _zarScreen.musicClockPrevCt = ct;
                const musicElapsed = Math.max(0, (+_zarScreen.musicClockLoopsBaseSec || 0) + ct);

                // Initialize base offset on first successful music tick so elapsed stays continuous
                // even if audio starts slightly after the timer run begins.
                if (!Number.isFinite(+_zarScreen.musicClockBaseSec)) {
                    _zarScreen.musicClockBaseSec = elapsedPerf - musicElapsed;
                }
                elapsed = Math.max(0, musicElapsed + (+_zarScreen.musicClockBaseSec || 0));

                // Keep the AudioContext anchor aligned with the chosen elapsed clock,
                // so metronome click scheduling stays in sync with the timer phases.
                try {
                    const ctx = _ensureAudioCtx();
                    if (ctx) _zarScreen.audioStartTime = ctx.currentTime - elapsed;
                } catch (_) {}
            }
        } catch (_) {}
        const left = Math.max(0, _zarScreen.durSec - elapsed);

        // Determine current phase
        while (_zarScreen.phaseIdx + 1 < _zarScreen.phases.length && elapsed >= _zarScreen.phases[_zarScreen.phaseIdx].end) {
            _zarScreen.phaseIdx++;
        }
        const ph = _zarScreen.phases[_zarScreen.phaseIdx] || { kind: 'work', start: 0, end: _zarScreen.durSec };
        const phaseLeft = Math.max(0, ph.end - elapsed);
        const phaseDur = Math.max(0.001, (ph.end - ph.start));
        const intervalLabel = _zarScreenFmtIntervalLabel(ph);

        // Paused: freeze audio/counters, keep the visuals readable.
        if (_zarScreen.paused) {
            _zarScreenSetCountdown(null);
            _zarScreenSetTimerTextByMode(elapsed, left);
            _zarScreenSetIntervalBar(ph.kind, ph.start, ph.end, elapsed);
            if ($("zarScreenPhase")) $("zarScreenPhase").textContent = (LANG==='ru' ? (ph.kind === 'work' ? 'РАБОТА' : 'ОТДЫХ') : (ph.kind === 'work' ? 'WORK' : 'REST'));
            _zarScreenSetEff(ph.kind, ph.eff);
            _zarScreenSetTempoLabel(ph.kind, ph.eff, ph.tempoRpm, ph.start, ph.end);
            if ($("zarScreenSub")) {
                const base = (LANG==='ru')
                    ? `Остановлено · осталось ${Math.ceil(left)}s`
                    : `Stopped · ${Math.ceil(left)}s left`;
                $("zarScreenSub").textContent = intervalLabel ? `${intervalLabel} · ${base}` : base;
            }
            return;
        }

        const clamp01 = (x) => Math.max(0, Math.min(1, x));
        const hexToRgb = (hex) => {
            const s = String(hex).replace('#','').trim();
            if (s.length !== 6) return { r: 255, g: 255, b: 255 };
            return {
                r: parseInt(s.slice(0,2), 16),
                g: parseInt(s.slice(2,4), 16),
                b: parseInt(s.slice(4,6), 16)
            };
        };
        const lerp = (a,b,t) => a + (b-a)*t;
        const lerpRgb = (c1, c2, t) => ({
            r: Math.round(lerp(c1.r, c2.r, t)),
            g: Math.round(lerp(c1.g, c2.g, t)),
            b: Math.round(lerp(c1.b, c2.b, t))
        });
        const rgbCss = (c) => `rgb(${c.r}, ${c.g}, ${c.b})`;
        const triColor = (t01, cA, cB, cC) => {
            const t = clamp01(t01);
            if (t <= 0.5) return lerpRgb(cA, cB, t * 2);
            return lerpRgb(cB, cC, (t - 0.5) * 2);
        };

        // Proximity factor: 0 far from switch, 1 at the switch.
        // Use a dynamic window based on phase duration (short phases: faster ramp; long: slower ramp).
        const warnWin = Math.max(2.0, Math.min(12.0, phaseDur * 0.55));
        const prox = clamp01(1 - (phaseLeft / warnWin));
        const pulse = prox >= 0.92 && phaseLeft <= 2.0;

        // Visual cue: as we approach the phase switch, change color / pulse.
        try {
            const root = $("zarScreen");
            if (root) {
                root.classList.toggle('zs-work', ph.kind === 'work');
                root.classList.toggle('zs-rest', ph.kind !== 'work');
            }
            // Smooth color blend for timer/sub (normal -> amber -> red)
            const timerEl = $("zarScreenTimer");
            const subEl = $("zarScreenSub");
            const cNormalTimer = hexToRgb('#e5e7eb');
            const cNormalSub = hexToRgb('#cbd5e1');
            const cAmber = hexToRgb('#fbbf24');
            const cRed = hexToRgb('#ef4444');
            const cT = triColor(prox, cNormalTimer, cAmber, cRed);
            const cS = triColor(prox, cNormalSub, cAmber, cRed);
            if (timerEl) timerEl.style.color = rgbCss(cT);
            if (subEl) subEl.style.color = rgbCss(cS);
            if (root) root.classList.toggle('zs-pulse', !!pulse);
        } catch (_) {}

        // Pre-switch warning (once per phase): a short double-beep ~2s before switch.
        // Skip the last few seconds because the finish countdown already beeps.
        if (_zarScreen.preSwitchWarnedIdx !== _zarScreen.phaseIdx
            && phaseDur >= 4.0
            && phaseLeft <= 2.05
            && phaseLeft > 0.25
            && left > 3.5
        ) {
            _zarScreen.preSwitchWarnedIdx = _zarScreen.phaseIdx;
            _playBeep(990, 70);
            const ctx = _zarBeeper.audioCtx;
            _playBeep(990, 70, ctx ? (ctx.currentTime + 0.16) : 0);
            _zarVibrate([18, 55, 18]);
        }

        // Beep on phase boundary (except the initial beep already played)
        if (_zarScreen.phaseIdx !== _zarScreen.lastPhaseIdx) {
            if (_zarScreen.lastPhaseIdx >= 0) {
                _playBeep(ph.kind === 'work' ? 880 : 440, 120);
                _zarVibrate(ph.kind === 'work' ? 40 : 25);
                _zarSpeakPhaseStart(ph.kind, ph.eff, phaseDur, ph.tempoRpm, ph.start, ph.end, ph.repsTarget);
            }
            _zarScreen.lastPhaseIdx = _zarScreen.phaseIdx;
            // Re-anchor metronome on phase boundary.
            _zarMetroReset();
            const enteringWork = String(ph.kind) === 'work';
            const includeSwitch = enteringWork ? (_zarScreen.workPhaseCount > 0) : false;

            const nextWorkIndex = enteringWork ? (_zarScreen.workPhaseCount + 1) : _zarScreen.workPhaseCount;

            // Rep counter: drop partial rep + apply switch cost dead-time (only in WORK).
            _zarRepsCounterOnPhaseBoundary(ph.kind, ph.start, includeSwitch);
            _zarPerfOnPhaseBoundary(ph.kind, ph.eff, ph.start, includeSwitch);
            _zarRepsIntervalOnPhaseBoundary(ph.kind, nextWorkIndex);

            {
                const willMetro = _zarWillMetronomeTick(ph.kind, ph.tempoRpm);
                // Always respect switch-cost dead-time for pacing consistency (no reps during switch).
                if (willMetro) _zarMetroOnPhaseBoundary(ph.start, ph.eff, includeSwitch);
                if (enteringWork) _zarScreen.workPhaseCount += 1;
            }
        }

        // Update fatigue/performance state before metronome + rep counting.
        _zarPerfUpdate(ph, elapsed);

        // Metronome (tempo clicks)
        const metroClicks = _zarMetroUpdate(ph.kind, ph.eff, left, ph.tempoRpm);

        // Reps counter (works with or without metronome)
        _zarRepsCounterUpdate(ph.kind, ph.eff, elapsed, left, metroClicks, ph.tempoRpm);

        // Optional end-of-work voice cue (model-aligned via click plan)
        _zarMaybeSpeakEndOfWorkCue(ph, elapsed, phaseLeft);

        // UI
        _zarScreenSetTimerTextByMode(elapsed, left);
        _zarScreenSetIntervalBar(ph.kind, ph.start, ph.end, elapsed);
        if ($("zarScreenPhase")) $("zarScreenPhase").textContent = (LANG==='ru' ? (ph.kind === 'work' ? 'РАБОТА' : 'ОТДЫХ') : (ph.kind === 'work' ? 'WORK' : 'REST'));
        _zarScreenSetEff(ph.kind, ph.eff);
        _zarScreenSetTempoLabel(ph.kind, ph.eff, ph.tempoRpm, ph.start, ph.end);
        if ($("zarScreenSub")) {
            const countUp = _zarScreenCountUpEnabled();
            const rightPart = countUp
                ? (LANG==='ru' ? `Осталось: ${Math.ceil(left)}s` : `Left: ${Math.ceil(left)}s`)
                : (LANG==='ru' ? `Прошло: ${Math.floor(elapsed)}s` : `Elapsed: ${Math.floor(elapsed)}s`);
            const a = (LANG==='ru'
                ? `До смены: ${Math.ceil(phaseLeft)}s · ${rightPart}`
                : `Switch in: ${Math.ceil(phaseLeft)}s · ${rightPart}`);
            $("zarScreenSub").textContent = intervalLabel ? `${intervalLabel} · ${a}` : a;
        }

        // Countdown before finish: show 3..2..1 in the last 3 seconds.
        // No setTimeout scheduling (pause-safe and throttling-safe).
        if (left > 3.25) {
            if (_zarScreen.finishCountdownLast !== -1) {
                _zarScreen.finishCountdownLast = -1;
                _zarScreenSetCountdown(null);
            }
        } else if (left <= 3.05 && left > 0.2) {
            const k = Math.max(1, Math.min(3, Math.ceil(left)));
            if (_zarScreen.finishCountdownLast !== k) {
                _zarScreen.finishCountdownLast = k;
                _zarScreenSetCountdown(k);
                // If metronome is active, avoid double-audio. Metronome remains the pacing signal.
                const metroNow = _zarWillMetronomeTick(ph.kind, ph.tempoRpm);
                if (!metroNow) {
                    _playBeep(660, 100);
                    _zarSpeak(String(k));
                }
                _zarVibrate(14);
            }
        } else {
            _zarScreenSetCountdown(null);
        }

        if (elapsed >= _zarScreen.durSec - 0.02) {
            // End cue
            _playBeep(660, 200);
            const ctx = _zarBeeper.audioCtx;
            const t0 = ctx ? ctx.currentTime : 0;
            _playBeep(660, 200, t0 + 0.28);
            _playBeep(660, 260, t0 + 0.56);
            _zarVibrate([70, 60, 70, 60, 120]);
            _zarSpeak(LANG==='ru' ? 'Финиш' : 'Finish');
            stopZarBigScreen(true, { keepReps: true, finished: true });
        }
    };

    update();
    _zarScreen.tickId = setInterval(update, 120);
}

function stopZarBigScreen(silent, opts) {
    _zarScreenClearTimers();
    _zarScreen.running = false;
    _zarScreen.paused = false;
    _zarScreen.pausedElapsedSec = 0;
    _zarScreen.started = false;
    _zarScreen.countdownActive = false;
    _zarScreen.lastPhaseIdx = -1;
    _zarScreen.finishCountdownLast = -1;
    _zarMetroReset();
    _zarPerfReset();
    try { _zarMusicStopAndReset(); } catch (_) {}
    _zarScreen.clickPlan = null;
    const keepReps = !!opts?.keepReps;
    const finished = !!opts?.finished;
    if (!keepReps) _zarRepsCounterReset();
    try { _zarVoiceState.lastWorkIntensitySpoken = null; } catch (_) {}
    _zarScreenSetButtons(false);
    _zarScreenSetCountdown(null);
    try { _zarSpeakCancel(); } catch(_) {}
    if ($("zarScreenPhase")) $("zarScreenPhase").textContent = '—';
    _zarScreenSetEff('rest', 0);
    try {
        const el = $("zarScreenTempo");
        if (el) el.textContent = '';
    } catch (_) {}
    if ($("zarScreenSub")) {
        $("zarScreenSub").textContent = finished
            ? (LANG==='ru' ? 'Финиш' : 'Finish')
            : (silent ? '' : (LANG==='ru' ? 'Остановлено' : 'Stopped'));
    }
    try { _zarWakeMaybe(); } catch (_) {}
    try {
        if (!_zarScreen.open) return;
        const tl = _zarBuildTimelineFromCurrentZar();
        if ($("zarScreenTimer")) $("zarScreenTimer").textContent = _zarFmtMMSS(tl.durSec);
    } catch(_) {}
}

function _zarBeepVol() {
    const v = +($("zarBeepVol")?.value || 0);
    if (!Number.isFinite(v)) return 0.2;
    return Math.max(0, Math.min(1, v / 100));
}

function _ensureAudioCtx() {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    try {
        if (_zarBeeper.audioCtx && _zarBeeper.audioCtx.state !== 'closed') {
            if (!_zarBeeper.gain) {
                const g = _zarBeeper.audioCtx.createGain();
                g.gain.value = _zarBeepVol();
                g.connect(_zarBeeper.audioCtx.destination);
                _zarBeeper.gain = g;
            }
            return _zarBeeper.audioCtx;
        }
        const ctx = new AC();
        const g = ctx.createGain();
        g.gain.value = _zarBeepVol();
        g.connect(ctx.destination);
        _zarBeeper.audioCtx = ctx;
        _zarBeeper.gain = g;
        return ctx;
    } catch (_) {
        return null;
    }
}

function _audioTryResume(ctx) {
    try {
        if (!ctx || typeof ctx.resume !== 'function') return false;
        if (ctx.state !== 'suspended') return false;
        const p = ctx.resume();
        if (p && typeof p.catch === 'function') p.catch(() => {});
        return true;
    } catch (_) {
        return false;
    }
}

function _playBeep(freqHz, ms, whenSec = 0) {
    const ctx = _ensureAudioCtx();
    if (!ctx || !_zarBeeper.gain) return;
    try {
        _audioTryResume(ctx);
        const t0 = Math.max(ctx.currentTime, whenSec || ctx.currentTime);
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = Math.max(80, +freqHz || 440);
        // Soft attack/release to avoid clicks
        const vol = _zarBeepVol();
        g.gain.setValueAtTime(0.0001, t0);
        g.gain.exponentialRampToValueAtTime(Math.max(0.0002, vol), t0 + 0.01);
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + Math.max(0.03, (ms || 120) / 1000));
        osc.connect(g);
        g.connect(_zarBeeper.gain);
        osc.start(t0);
        osc.stop(t0 + Math.max(0.05, (ms || 120) / 1000));
    } catch (_) {}
}

function _clearZarBeeperTimers() {
    try {
        for (const id of _zarBeeper.timeouts) clearTimeout(id);
    } catch (_) {}
    _zarBeeper.timeouts = [];
}

function _zarBeeperSetStatus(txt) {
    if ($("zarBeepStatus")) $("zarBeepStatus").textContent = txt || '';
}

function _zarBuildTimelineFromCurrentZar() {
    // Optional method-aware override (Scheme/Timer opened for another method).
    try {
        const ovr = _zarScreen?.timelineOverride;
        if (ovr && typeof ovr === 'object' && Array.isArray(ovr.segments) && Number.isFinite(+ovr.durSec)) {
            const durSec = Math.max(0.01, Math.round((+ovr.durSec || 300) * 100) / 100);
            return { durSec, segments: ovr.segments };
        }
    } catch (_) {}

    const p = (typeof window.getParams === 'function') ? window.getParams() : null;
    const z = p?.zar;
    if (!z) return { durSec: 300, segments: [{ kind: 'work', sec: 30 }, { kind: 'rest', sec: 30 }] };

    // Base duration comes from the Duration slider.
    // We intentionally do NOT trust `z.dur` here because it may already include derived semantics
    // (e.g. hard-stop/no-cycle expansion). Big Screen should apply the same rules directly:
    // - no markers: repeat pattern until Duration
    // - ';': run pattern once, then continue default On/Off until Duration (and expand Duration if pattern > slider)
    // - '#': run pattern once and stop immediately after it
    const durUiSec = Math.max(1, Math.floor(_zarGetSelectedDurSec()));
    const durSec = Math.max(0.01, Math.round((durUiSec || 300) * 100) / 100);
    const segments = [];

    const pushSeg = (kind, sec, eff, tempoRpm, repsTarget, allowMerge = true, meta = null) => {
        const s0 = Number.isFinite(+sec) ? Math.max(0, +sec) : 0;
        const s = Math.round(Math.min(600, s0) * 100) / 100;
        if (!(s > 1e-9)) return;
        const e = Number.isFinite(+eff) ? (+eff) : (kind === 'work' ? (Number.isFinite(+z.eff) ? (+z.eff) : 8.5) : 0);
        const tr = (tempoRpm == null) ? null : ((Number.isFinite(+tempoRpm) && (+tempoRpm) > 0) ? Math.max(5, Math.min(240, Math.round(+tempoRpm))) : null);
        const rr = (repsTarget == null) ? null : (Number.isFinite(+repsTarget) ? Math.max(0, Math.floor(+repsTarget)) : null);
        const last = segments[segments.length - 1];
        const lastTempo = (last?.tempoRpm == null) ? null : ((Number.isFinite(+last?.tempoRpm) && (+last.tempoRpm) > 0) ? Math.max(5, Math.min(240, Math.round(+last.tempoRpm))) : null);
        const lastReps = (last?.repsTarget == null) ? null : (Number.isFinite(+last?.repsTarget) ? Math.max(0, Math.floor(+last.repsTarget)) : null);
        if (allowMerge && last && last.kind === kind && Math.abs((+last.eff || 0) - e) <= 1e-9 && (lastTempo === tr) && (lastReps === rr)) {
            last.sec += s;
            return;
        }
        segments.push({ kind, sec: s, eff: e, tempoRpm: tr, repsTarget: rr, meta: (meta && typeof meta === 'object') ? meta : null });
    };

    const readZarRestEff10 = () => {
        try {
            if (String(z.mode || '').toLowerCase() !== 'universal') return 0;
            const kin = String($('zarKinU')?.value || 'hiit').toLowerCase();
            if (kin === 'sit') return 0;
            const v = +($('zarRestEffU')?.value || 0);
            return Number.isFinite(v) ? Math.max(0, Math.min(10, v)) : 0;
        } catch (_) {
            return 0;
        }
    };
    const defaultWorkEff10 = Number.isFinite(+z.eff) ? (+z.eff) : 8.5;
    const defaultRestEff10 = readZarRestEff10();

    if (Array.isArray(z.pattern) && z.pattern.length) {
        // Marker semantics must come from the *actual* user-visible pattern string.
        // This prevents any accidental flag leakage from forcing hard-stop/no-cycle.
        const patStrUi = (() => {
            try {
                const mode = ($("zarMode")?.value === 'universal') ? 'universal' : 'classic';
                const el = $(mode === 'universal' ? 'zarPatternU' : 'zarPatternC');
                return String(el?.value || '').trim();
            } catch (_) {
                return '';
            }
        })();
        const uiHardStop = /#\s*$/.test(patStrUi);
        const uiNoCycle = /;\s*$/.test(patStrUi);

        const noCycle = !!z.pattern._noCycle && uiNoCycle;   // ';'
        const hardStop = !!z.pattern._hardStop && uiHardStop; // '#'
        const patternLenFixed = z.pattern.length;

        const patTotalSec = z.pattern.reduce((a, s) => {
            const on = Number.isFinite(+s?.on) ? Math.max(0, +s.on) : 0;
            const off = Number.isFinite(+s?.off) ? Math.max(0, +s.off) : 0;
            return a + on + off;
        }, 0);
        const targetDur = hardStop
            ? Math.max(0.01, Math.round((patTotalSec || durSec) * 100) / 100)
            : (noCycle ? Math.max(durSec, Math.round((patTotalSec || 0) * 100) / 100) : durSec);

        let t = 0;
        let idx = 0;
        let tailIdx = 0;
        while (t < targetDur) {
            // '#' stops immediately after the last pattern item.
            if (hardStop && idx >= patternLenFixed) break;

            // Pattern stage
            // - default (no markers): cycle the pattern via modulo until Duration
            // - ';': run pattern once, then go to Tail stage
            // - '#': run pattern once and stop
            const inPattern = (!hardStop && !noCycle) || (idx < patternLenFixed);
            if (inPattern) {
                if ((hardStop || noCycle) && idx >= patternLenFixed) {
                    // Pattern has ended; tail/stop handled below.
                } else {
                    const seg = z.pattern[(hardStop || noCycle) ? idx : (idx % patternLenFixed)];
                    const patternLen = patternLenFixed;
                    const itemNoAbs = idx + 1;
                    const itemInCycle = (idx % patternLen) + 1;
                    const cycleNo = Math.floor(idx / patternLen) + 1;
                    const itemMeta = { itemNoAbs, itemInCycle, patternLen, cycleNo };
                    const on = Number.isFinite(+seg.on) ? Math.max(0, +seg.on) : 0;
                    const off = Number.isFinite(+seg.off) ? Math.max(0, +seg.off) : 0;
                    const workEff10 = Number.isFinite(+seg.eff) ? (+seg.eff) : defaultWorkEff10;
                    const restEff10 = Number.isFinite(+seg.restEff) ? (+seg.restEff) : defaultRestEff10;
                    const workTempoRpm = Number.isFinite(+seg.workTempoRpm) ? (+seg.workTempoRpm) : null;
                    const restTempoRpm = Number.isFinite(+seg.restTempoRpm) ? (+seg.restTempoRpm) : null;
                    const workReps = Number.isFinite(+seg.workReps) ? Math.max(0, Math.floor(+seg.workReps)) : null;

                    let firstInItem = true;
                    const w = Math.min(on, targetDur - t);
                    if (w > 0) {
                        if (workEff10 <= 0.0001) pushSeg('rest', w, restEff10, restTempoRpm, null, !firstInItem, itemMeta);
                        else pushSeg('work', w, workEff10, workTempoRpm, workReps, !firstInItem, itemMeta);
                        t += w;
                        firstInItem = false;
                    }
                    const r = Math.min(off, targetDur - t);
                    if (r > 0) { pushSeg('rest', r, restEff10, restTempoRpm, null, !firstInItem, itemMeta); t += r; firstInItem = false; }
                    idx++;
                    if (idx > 10000) break;
                    continue;
                }
            }

            // Tail stage for ';': after scheme ends, follow the main On/Off engine.
            if (noCycle) {
                const baseOn = Math.max(1, Math.floor(+z.on || 30));
                const baseOff = Math.max(0, Math.floor(+z.off || 30));
                const itemMeta = { itemNoAbs: (idx + tailIdx + 1), itemInCycle: (tailIdx + 1), patternLen: null, cycleNo: null };
                const w = Math.min(baseOn, targetDur - t);
                if (w > 0) { pushSeg('work', w, defaultWorkEff10, null, null, false, itemMeta); t += w; }
                const r = Math.min(baseOff, targetDur - t);
                if (r > 0) { pushSeg('rest', r, defaultRestEff10, null, null, true, itemMeta); t += r; }
                tailIdx++;
                if (tailIdx > 10000) break;
                continue;
            }

            // Should not happen, but safety.
            break;
        }

        return { durSec: Math.max(0.01, Math.round(t * 100) / 100), segments };
    }

    // Fallback to uniform On/Off rounds
    const on = Math.max(1, Math.floor(+z.on || 30));
    const off = Math.max(0, Math.floor(+z.off || 30));
    let t = 0;
    let idx = 0;
    while (t < durSec) {
        const itemMeta = { itemNoAbs: (idx + 1), itemInCycle: (idx + 1), patternLen: null, cycleNo: null };
        const w = Math.min(on, durSec - t);
        if (w > 0) { pushSeg('work', w, defaultWorkEff10, null, null, false, itemMeta); t += w; }
        const r = Math.min(off, durSec - t);
        if (r > 0) { pushSeg('rest', r, defaultRestEff10, null, null, true, itemMeta); t += r; }
        idx++;
        if (segments.length > 2000) break;
    }
    return { durSec, segments };
}

function startZarBeeper() {
    try {
        if (_zarBeeper.running) return;
        const ctx = _ensureAudioCtx();
        if (!ctx) {
            alert(LANG==='ru' ? 'Ваш браузер не поддерживает Web Audio.' : 'Web Audio not supported in this browser.');
            return;
        }
        // Autoplay policy: resume must happen in a user gesture.
        _audioTryResume(ctx);

        const tl = _zarBuildTimelineFromCurrentZar();
        _clearZarBeeperTimers();
        _zarBeeper.running = true;
        _zarBeeper.startedAt = Date.now();
        _zarBeeper.endsAt = _zarBeeper.startedAt + tl.durSec * 1000;

        if ($("btnZarBeepStart")) $("btnZarBeepStart").disabled = true;
        if ($("btnZarBeepStop")) $("btnZarBeepStop").disabled = false;

        // Start cue: double-high beep
        _playBeep(880, 140);
        _playBeep(880, 140, ctx.currentTime + 0.22);

        let t = 0;
        let firstWorkPending = true;
        for (const seg of tl.segments) {
            const kind = seg.kind;
            const sec0 = Number.isFinite(+seg.sec) ? Math.max(0, +seg.sec) : 0;
            const sec = Math.round(Math.min(600, sec0) * 100) / 100;
            if (sec <= 0) continue;
            // At the boundary: work => high, rest => low.
            const fireAtMs = t * 1000;

            const id = setTimeout(() => {
                if (!_zarBeeper.running) return;
                if (kind === 'work') {
                    _playBeep(880, 120);
                    firstWorkPending = false;
                } else {
                    // rest
                    _playBeep(440, 120);
                }
                const elapsed = Math.round((Date.now() - _zarBeeper.startedAt) / 1000);
                const left = Math.max(0, tl.durSec - elapsed);
                _zarBeeperSetStatus((LANG==='ru' ? `Идёт… осталось ${left}s` : `Running… ${left}s left`));
            }, fireAtMs);
            _zarBeeper.timeouts.push(id);

            t += sec;
            if (t >= tl.durSec) break;
        }

        // End cue
        const endId = setTimeout(() => {
            if (!_zarBeeper.running) return;
            _playBeep(660, 200);
            _playBeep(660, 200, ctx.currentTime + 0.28);
            _playBeep(660, 260, ctx.currentTime + 0.56);
            stopZarBeeper(true);
        }, tl.durSec * 1000);
        _zarBeeper.timeouts.push(endId);

        _zarBeeperSetStatus(LANG==='ru' ? 'Идёт…' : 'Running…');
    } catch (e) {
        console.error(e);
        stopZarBeeper(true);
        alert(LANG==='ru' ? 'Не удалось запустить сигналы.' : 'Failed to start beeper.');
    }
}

function stopZarBeeper(silent) {
    try {
        _clearZarBeeperTimers();
        _zarBeeper.running = false;
        if ($("btnZarBeepStart")) $("btnZarBeepStart").disabled = false;
        if ($("btnZarBeepStop")) $("btnZarBeepStop").disabled = true;
        _zarBeeperSetStatus(silent ? '' : (LANG==='ru' ? 'Остановлено' : 'Stopped'));
        try {
            if (_zarBeeper.audioCtx && _zarBeeper.audioCtx.state === 'running') _zarBeeper.audioCtx.suspend();
        } catch (_) {}
    } catch (_) {}
}

// Keep beeper volume live
document.addEventListener('input', (e) => {
    if (e?.target?.id === 'zarBeepVol') {
        try {
            if (_zarBeeper.gain) _zarBeeper.gain.gain.value = _zarBeepVol();
        } catch (_) {}
    }
});



    // Generic dropdown setup for toolbar groups
    function setupDropdown(btnId, menuId) {
        const btn = $(btnId), menu = $(menuId);
        if (!btn || !menu || btn._wired) return;
        const adjustPosition = () => {
            const isNarrow = Math.min(window.innerWidth, screen.width || window.innerWidth) <= 640;
            const br = btn.getBoundingClientRect();
            // reset
            menu.style.right = '';
            menu.style.left = '';
            menu.style.top = '';
            menu.style.transform = '';
            if (isNarrow) {
                menu.style.position = 'fixed';
                menu.style.maxWidth = '92vw';
                menu.style.left = '50%';
                menu.style.transform = 'translateX(-50%)';
                const top = Math.min(Math.max(8, br.bottom + 8), window.innerHeight - 16);
                menu.style.top = `${top}px`;
            } else {
                menu.style.position = 'absolute';
                const mw = Math.max(menu.offsetWidth || 280, 240);
                const spaceRight = window.innerWidth - br.left;
                if (spaceRight < mw + 24) {
                    menu.style.right = '0';
                } else {
                    menu.style.left = '0';
                }
            }
        };
        const toggle = () => {
            const open = menu.style.display !== 'none';
            // Close any other open dropdowns
            document.querySelectorAll('.dropdown .card').forEach(el => { if (el !== menu) el.style.display = 'none'; });
            btn.setAttribute('aria-expanded', open ? 'false' : 'true');
            if (open) {
                menu.style.display = 'none';
            } else {
                menu.style.display = 'block';
                requestAnimationFrame(adjustPosition);
            }
        };
        btn.addEventListener('click', (e)=>{ e.stopPropagation(); toggle(); });
        document.addEventListener('click', (e)=>{
            if (!menu.contains(e.target) && e.target !== btn) {
                menu.style.display = 'none';
                btn.setAttribute('aria-expanded','false');
            }
        });
        window.addEventListener('resize', () => { if (menu.style.display !== 'none') adjustPosition(); });
        btn._wired = true;
    }
    // Global seriesFromParams (base) — delegated to Methods, with safe fallback
    function seriesFromParams(p) {
        if (window.Methods && typeof window.Methods.seriesFromParams === 'function') {
            return window.Methods.seriesFromParams(p);
        }
        // Fallback (used only if methods.js didn't load)
        const series = [];
        const SM = selectedMethods();
        try { if (SM.SIT) series.push(simulateHR({ kind: "SIT", hrRest: p.hrRest, hrMax: p.hrMax, work: p.sit.work, rest: p.sit.rest, n: p.sit.n, eff: p.sit.eff, drift10: p.drift10, useHRR: p.useHRR, tauOn: p.tauOn, tauOff: p.tauOff, warm: p.warmup, cool: p.cooldown, post: p.postRest })); } catch(_) {}
        try { if (SM.HIIT) series.push(simulateHR({ kind: "HIIT", hrRest: p.hrRest, hrMax: p.hrMax, work: p.hiit.work, rest: p.hiit.rest, n: p.hiit.n, eff: p.hiit.eff, drift10: p.drift10, useHRR: p.useHRR, tauOn: p.tauOn, tauOff: p.tauOff, warm: p.warmup, cool: p.cooldown, post: p.postRest, restFrac: p.hiit.restFrac })); } catch(_) {}
        try {
            if (SM.ZRB) {
                const hasPat = Array.isArray(p.zar?.pattern) && p.zar.pattern.length > 0;
                const effMin = (p.zar?.mode === 'universal') ? 2 : 6;
                if (hasPat) series.push(simulateHR({ kind: "ZRB", hrRest: p.hrRest, hrMax: p.hrMax, work: p.zar.on, rest: (p.zar.off ?? 0), n: 1, eff: p.zar.eff, effMin, drift10: p.drift10, useHRR: p.useHRR, tauOn: p.tauOn, tauOff: p.tauOff, warm: p.warmup, cool: p.cooldown, post: p.postRest, pattern: p.zar.pattern, dur: p.zar.dur }));
                else {
                    const restPerRound = Math.max(0, (p.zar?.off ?? 30));
                    const cycleSec = Math.max(1, (p.zar?.on ?? 30) + restPerRound);
                    const rounds = Math.max(1, Math.floor((p.zar?.dur ?? 300) / cycleSec));
                    series.push(simulateHR({ kind: "ZRB", hrRest: p.hrRest, hrMax: p.hrMax, work: p.zar.on, rest: restPerRound, n: rounds, eff: p.zar.eff, effMin, drift10: p.drift10, useHRR: p.useHRR, tauOn: p.tauOn, tauOff: p.tauOff, warm: p.warmup, cool: p.cooldown, post: p.postRest }));
                }
            }
        } catch(_) {}
        try { if (SM.Z2) series.push(simulateHR({ kind: "Z2", hrRest: p.hrRest, hrMax: p.hrMax, steadyMin: p.z2.min, steadyFrac: p.z2.frac, drift10: p.drift10, useHRR: p.useHRR, tauOn: p.tauOn, tauOff: p.tauOff, warm: p.warmup, cool: p.cooldown, post: p.postRest })); } catch(_) {}
        try { if (SM.Z34) series.push(simulateHR({ kind: "Z34", hrRest: p.hrRest, hrMax: p.hrMax, steadyMin: p.z34.min, steadyFrac: p.z34.frac, drift10: p.drift10, useHRR: p.useHRR, tauOn: p.tauOn, tauOff: p.tauOff, warm: p.warmup, cool: p.cooldown, post: p.postRest })); } catch(_) {}
        return series;
    }
    function currentState() {
        const p = getParams();
        const SM = selectedMethods();
        const snMin = (function(){
            const v = Number($("snMin")?.value);
            if (Number.isFinite(v)) return v;
            const pv = Number(p?.sn?.min);
            return Number.isFinite(pv) ? pv : 10;
        })();
        const st = {
            LANG,
            ...p,
            // Zaruba is now truly independent per mode (separate controls + separate fields)
            // getParams() provides: zarMode, zarClassic, zarUniversal, and zar (active)
            snMin,
            chkSIT: !!SM.SIT,
            chkHIIT: !!SM.HIIT,
            chkSN: !!SM.SN,
            chkSW: !!SM.SW,
            chkZ2: !!SM.Z2,
            chkZ34: !!SM.Z34,
            chkZRB: !!SM.ZRB,
            groups: {
                adv: !!$("detAdv")?.open,
                intervals: !!$("detCtlIntervals")?.open,
                steady: !!$("detCtlSteady")?.open,
                inputs: !!$("detInputs")?.open,
                zarOpt: !!$("detZarOpt")?.open
            },
            impOffset: (function(){
                const v = Number($("impOffset")?.value || IMPORT_OFFSET_SEC || 0);
                return Number.isFinite(v) ? v : 0;
            })(),
            impTrimStart: (function(){
                const v = Number($("impTrimStart")?.value || IMPORT_TRIM_START_SEC || 0);
                return Number.isFinite(v) ? Math.max(0, v) : 0;
            })(),
            impTrimApply: !!($("impTrimAffectsChart")?.checked ?? IMPORT_TRIM_APPLY_TO_CHART)
        };

        // Zaruba optimizer panel UI extras (not part of getParams())
        try {
            const v = +($("zarBeepVol")?.value ?? 40);
            st.zarBeepVol = Number.isFinite(v) ? Math.max(0, Math.min(100, v)) : 40;
        } catch(_) {}
        try {
            const v = +($("zarTargetReps")?.value ?? 100);
            st.zarTargetReps = Number.isFinite(v) ? Math.max(1, Math.min(999, Math.floor(v))) : 100;
        } catch(_) {}

        // Zaruba Big Screen settings (persisted in sit_last)
        try {
            st.zarScreen = {
                countUp: !!$("zarScreenCountUp")?.checked,
                voice: !!$("zarScreenVoice")?.checked,
                voiceReps: !!$("zarScreenVoiceReps")?.checked,
                countdownSec: (function(){
                    const v = +($("zarScreenCountdownSec")?.value ?? 5);
                    return Number.isFinite(v) ? Math.max(0, Math.min(30, Math.round(v))) : 5;
                })(),
                metro: !!$("zarScreenMetro")?.checked,
                metroRpm: (function(){
                    const v = +($("zarScreenMetroRpm")?.value ?? 0);
                    return Number.isFinite(v) ? v : 0;
                })(),
                metroHz: (function(){
                    const v = +($("zarScreenMetroHz")?.value ?? 1650);
                    return Number.isFinite(v) ? v : 1650;
                })(),
                metroVol: (function(){
                    const v = +($("zarScreenMetroVol")?.value ?? 55);
                    return Number.isFinite(v) ? v : 55;
                })()
            };
        } catch(_) {}

        // Keep Zaruba custom pattern compact for sharing/presets.
        // Storing arrays expands repeats (e.g. 60/60*10 becomes 10 segments), bloating URLs.
        try {
            const patC = String($("zarPatternC")?.value || '').trim();
            const patU = String($("zarPatternU")?.value || '').trim();
            if (st.zarClassic) {
                if (patC) st.zarClassic.pattern = patC;
                else delete st.zarClassic.pattern;
            }
            if (st.zarUniversal) {
                if (patU) st.zarUniversal.pattern = patU;
                else delete st.zarUniversal.pattern;
            }
            if (st.zar) {
                const pat = (st.zarMode === 'universal') ? patU : patC;
                if (pat) st.zar.pattern = pat;
                else delete st.zar.pattern;
            }
        } catch(_) {}
        return st;
    }

    function toggleLang() { LANG = (LANG === "en" ? "ru" : "en"); localStorage.setItem("sit_lang", LANG); $("langBtn").textContent = t("capLang"); setText(); render() }

        // (helper removed: Big Screen settings are persisted via currentState/saveLastStateDebounced)

    // ----- Compact editor: show only one method card (global) -----
    function showMethodCard(code) {
    const all = ["SIT","HIIT","ZRB","SN","SW","Z2","Z34"];
        all.forEach(k => {
            const el = document.getElementById("card"+k);
            if (el) el.style.display = (k === code ? '' : 'none');
        });
        // Open the relevant group and close the other for compactness
        if (code === 'SIT' || code === 'HIIT' || code === 'ZRB') {
            if ($("detCtlIntervals")) $("detCtlIntervals").open = true;
            if ($("detCtlSteady")) $("detCtlSteady").open = false;
        } else {
            if ($("detCtlIntervals")) $("detCtlIntervals").open = false;
            if ($("detCtlSteady")) $("detCtlSteady").open = true;
        }
        // Smoothly bring the active card into view on mobile/narrow screens
        // Update Show button visibility when switching cards
        try { if (typeof updateShowButtonsVisibility === 'function') updateShowButtonsVisibility(); } catch(_){}
        try {
            const card = document.getElementById('card' + code);
            if (card) {
                // Wait a frame so styles/layout settle before scrolling
                requestAnimationFrame(() => {
                    try { card.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); } catch(_){}
                });
            }
        } catch(_){}
    }
    function setupEditMethodDropdown(){
        const sel = document.getElementById('editMethodSel');
        if (!sel || sel._wired) return;
        // Localize options
        const optMap = {
            SIT: I18N[LANG].meth?.SIT || 'SIT',
            HIIT: I18N[LANG].meth?.HIIT || 'HIIT',
            ZRB: I18N[LANG].meth?.ZRB || 'Zaruba',
            SN: I18N[LANG].meth?.SN || 'Snatch (KB)',
            SW: I18N[LANG].meth?.SW || 'Swings (KB)',
            Z2: I18N[LANG].meth?.Z2 || 'Zone 2',
            Z34: I18N[LANG].meth?.Z34 || 'Zone 3–4'
        };
        [...sel.options].forEach(o => { if (o && optMap[o.value]) o.textContent = optMap[o.value]; });
        // Choose default: last saved, else first selected method by legacy checks, else SIT
        const saved = (function(){ try { return localStorage.getItem('sit_last_edit_method') || ''; } catch(_) { return ''; } })();
        const S = (typeof selectedMethods === 'function') ? selectedMethods() : { SIT:true };
    const order = ['SIT','HIIT','ZRB','SN','SW','Z2','Z34'];
        let def = order.find(k => k === saved) || order.find(k => S[k]) || 'SIT';
        if (![...sel.options].some(o => o.value === def)) def = 'SIT';
        sel.value = def;
        showMethodCard(def);
        // UX: on init, auto-focus the chart on the default method.
        // Do NOT persist this auto-selection to avoid overwriting a user's saved overlays just by opening the page.
        try { if (typeof onlyThisMethod === 'function') onlyThisMethod(def, false); } catch(_){ }
        sel.addEventListener('change', () => {
            const v = sel.value;
            showMethodCard(v);
            // UX: when switching the active method, auto-focus the chart on it.
            // Hide other method graphs (HR uploads, if any, stay intact as they are not part of selectedMethods).
            try { if (typeof onlyThisMethod === 'function') onlyThisMethod(v); } catch(_){ }
            try { localStorage.setItem('sit_last_edit_method', v); } catch(_){ }
        });
        sel._wired = true;
    }

    function setRange(id, min, max, step, preferredDefault) {
    const el = $(id);
    if (!el) return;
    el.min = String(min);
    el.max = String(max);
    el.step = String(step);
    let v = parseFloat(el.value);
    if (Number.isNaN(v)) v = preferredDefault ?? min;
    // clamp into range
    v = Math.max(min, Math.min(max, v));
    // snap to step
    const snapped = Math.round((v - min) / step) * step + min;
    el.value = String(+snapped.toFixed(5));
}

    // --- Realistic ranges based on HRR vs %HRmax
    function configureRecommendedRanges() {
    const useHRR = $("useHRR")?.checked;
    const zarMode = $("zarMode")?.value || 'classic';

    // Global
    setRange("drift10", 0, 10, 0.5, 2.0);
    setRange("warmup", 0, 15, 1, 0);
    setRange("cooldown", 0, 10, 1, 5);
    setRange("postRest", 0, 30, 1, 3);
    setRange("tauOn", 15, 35, 1, 25);
    setRange("tauOff", 25, 55, 1, 35);

    // SIT
    setRange("sitWork", 10, 40, 1, 20);
    setRange("sitRest", 90, 300, 5, 180);
    setRange("sitN", 4, 10, 1, 6);
    // Effort as RPE (scale 6–10; allow 6.0–10.0)
    setRange("sitEff", 0.0, 10.0, 0.1, 9.5);

    // HIIT
    setRange("hiitWork", 60, 240, 5, 90);
    setRange("hiitRest", 45, 180, 5, 90);
    setRange("hiitRestEff", 0, 10, 0.1, 0.0);
    setRange("hiitN", 4, 12, 1, 8);
    // Effort as RPE (scale 6–10; HIIT typical default ≈ 8.5)
    setRange("hiitEff", 6.0, 10.0, 0.1, 8.5);

    // Zaruba: independent Classic and Universal controls (no cross-mode clamping)
    // Classic (competition-style)
    setRange("zarDurC", 180, 480, 10, 300);
    setRange("zarOnC", 10, 50, 1, 30);
    setRange("zarOffC", 10, 40, 1, 30);
    setRange("zarEffC", 6.0, 10.0, 0.1, 8.5);
    // Universal constructor
    setRange("zarDurU", 60, 3600, 30, 300);
    setRange("zarOnU", 30, 600, 30, 30);
    setRange("zarOffU", 0, 360, 30, 30);
    setRange("zarEffU", 0.0, 10.0, 0.1, 5.0);
    setRange("zarRestEffU", 0, 10, 0.1, 0.0);

    // Snatch (KB)
    setRange("snMin", 1, 30, 1, 10);
    // Weight and hand-change time are numeric inputs; still clamp/snap via helper for consistency
    setRange("snWeight", 4, 50, 1, 16);
    setRange("snChangeMin", 1, 15, 0.5, 5);
    // Cadence (reps per minute)
    setRange("snCad", 5, 35, 1, 20);

    // Swings (KB)
    setRange("swMin", 1, 30, 1, 14);
    setRange("swEff", 2.0, 10.0, 0.1, 8.5);
    setRange("swWeight", 4, 50, 1, 20);
    setRange("swChangeMin", 1, 15, 0.5, 7);

    // Zone 2 (broadened downwards)
    setRange("z2Min", 30, 120, 5, 45);
    if (useHRR) setRange("z2Frac", 55, 68, 1, 62);
    else setRange("z2Frac", 62, 72, 1, 68);

    // Zone 3–4 (lower bound reduced so it does not start in Z4)
    setRange("z34Min", 20, 60, 5, 30);
    if (useHRR) setRange("z34Frac", 72, 88, 1, 78);
    else setRange("z34Frac", 78, 88, 1, 83);

    updatePercentLabels();
}

    // Sport-level aware HRmax prediction helper moved to sim-core.js

    function recommendZ2Frac({ hrRest, hrMax, useHRR, warmMin, steadyMin, drift10 }) {
    // Z2 upper bound in fraction
    const upper = useHRR ? 0.70 : 0.75;
    // Convert drift to fraction of the relevant denominator
    const denom = useHRR ? (hrMax - hrRest) : hrMax;
    const driftBpm = drift10 * ((warmMin + steadyMin) / 10); // bpm rise over warm+steady
    const bufferBpm = 1.5; // safety buffer
    const allowed = upper - (driftBpm + bufferBpm) / Math.max(1, denom);
    const low = useHRR ? 0.60 : 0.65;
    const high = upper - 0.01; // keep a little headroom
    return Math.max(low, Math.min(high, allowed)); // clamped
}

    // Run once per session on fresh load (no URL state), before first render
    function autoTuneZ2DefaultsIfFreshLoad() {
    try {
    if (sessionStorage.getItem("tz_autotune_done") === "1") return;
    // Skip if URL provided full state
    const hasState = new URLSearchParams(location.search).has("s");
    if (hasState) { sessionStorage.setItem("tz_autotune_done", "1"); return; }

    // Optionally set drift to 2 if still at HTML default 3
    const driftEl = $("drift10");
    if (driftEl && +driftEl.value === 3) driftEl.value = "2";

    // Build current params for sim-based recommendation
    const age = +$("age").value;
    const hrRest = +$("hrRest").value;
    const sportLevel = $("sportLevel")?.value || 'general';
    const hrMax = $("hrMax").value ? +$("hrMax").value : predictedMaxHRFromAge(age, sportLevel);
    const useHRR = $("useHRR").checked;
    const warmMin = +$("warmup").value;
    const coolMin = +$("cooldown").value;
    const steadyMin = +$("z2Min").value; // default 40
    const drift10 = +$("drift10").value;
    const tauOn = +$("tauOn").value, tauOff = +$("tauOff").value;

    const rec = recommendZ2FracSim({ hrRest, hrMax, useHRR, tauOn, tauOff, warmMin, coolMin, steadyMin, drift10 });
    const z2FracEl = $("z2Frac");
    if (z2FracEl) {
    // Only lower it if current value is above recommended; don't fight user
    const curFrac = +z2FracEl.value / 100;
    if (curFrac > rec) z2FracEl.value = String(Math.round(rec * 100));
}

    updatePercentLabels();
    sessionStorage.setItem("tz_autotune_done", "1");
} catch (e) {
    console.warn("autoTuneZ2DefaultsIfFreshLoad error", e);
}
}

    function recommendZ2FracSim({ hrRest, hrMax, useHRR, tauOn, tauOff, warmMin, coolMin, steadyMin, drift10 }) {
    const activity = $("activity")?.value || (("selActRun" in window ? $("selActRun")?.checked : false) ? 'run' : ($("selActBike")?.checked ? 'bike' : 'kb'));
    const af = activityZoneFractions(activity);
    const z2Lo = af.Z2[0], z2Hi = af.Z2[1];
    const BUFFER_BPM = 1.5;
    const z2HiBpm = asBpm(z2Hi, hrRest, hrMax, useHRR);
    const maxBpmAllowed = z2HiBpm - BUFFER_BPM;

    const tailLastFor = (frac) => {
    const s = simulateHR({
    kind: "Z2",
    hrRest, hrMax,
    steadyMin, steadyFrac: frac,
    drift10, useHRR, tauOn, tauOff, warm: warmMin, cool: coolMin
});
    const tail = zoneTailViolation(
    s.hr, hrRest, hrMax, useHRR,
    z2Lo, z2Hi,
    steadyMin * 60,
    warmMin * 60           // pass actual warmup seconds
    );
    return tail.last ?? Number.POSITIVE_INFINITY;
};

    // If even the lowest target spills over Z2, return the low bound
    if (tailLastFor(z2Lo) > maxBpmAllowed) return z2Lo;

    // Binary search highest target that keeps tail under the ceiling
    let lo = z2Lo, hi = z2Hi - 0.005;
    for (let i = 0; i < 12; i++) {
    const mid = (lo + hi) / 2;
    const last = tailLastFor(mid);
    if (last <= maxBpmAllowed) lo = mid; else hi = mid;
}

    // Snap to 1% steps
    const rec = Math.max(z2Lo, Math.min(z2Hi, lo));
    return Math.round(rec * 100) / 100;
}

    // ---------- helpers ----------
    const fmtTime = s => { const m = Math.floor(s / 60), ss = (s % 60).toString().padStart(2, "0"); return `${m}m ${ss}s` };
    function pill(lbl, pol) {
    if (!lbl || !lbl.trim()) return ''; // Fix: return nothing for empty labels
    const L = lbl.toLowerCase(),
    g = s => `<span class="pill good">${s}</span>`,
    m = s => `<span class="pill mid">${s}</span>`,
    b = s => `<span class="pill bad">${s}</span>`;
    // words that should be yellow
    const MID = /(med|borderline|fair|avg|average|moderate|ok|okay)/;

    if (pol === "high-good") {
    if (/(excellent|very good|very high|high|strong|good)/.test(L)) return g(lbl);
    if (MID.test(L)) return m(lbl);
    return b(lbl);
}
    if (pol === "low-good") {
    if (/(very low|low)/.test(L)) return g(lbl);
    if (MID.test(L)) return m(lbl);
    return b(lbl);
}
    if (/(good|excellent|strong|very good)/.test(L)) return g(lbl);
    if (MID.test(L)) return m(lbl);
    return b(lbl);
}
    function bucket(v, e, l) { for (let i = 0; i < e.length; i++)if (v < e[i]) return l[i]; return l.at(-1) }
    function download(name, data) { const a = document.createElement("a"); a.href = "data:text/csv;charset=utf-8," + encodeURIComponent(data); a.download = name; a.click() }

    // Zaruba pattern helpers moved to sim-core.js

    // ---------- labels reacting to HRR ----------
    function updatePercentLabels() {
    const useHRR = $("useHRR").checked; const sfx = useHRR ? "% HRR" : "% HRmax";
    // SIT/HIIT now use RPE scale, not %HR
    const effRPE = I18N[LANG].effRPE || (LANG === "ru" ? "Интенсивность (RPE)" : "Effort (RPE)");
    if ($("labSitEff")?.childNodes?.length) $("labSitEff").childNodes[0].nodeValue = effRPE + " ";
    if ($("labHiitEff")?.childNodes?.length) $("labHiitEff").childNodes[0].nodeValue = effRPE + " ";
    $("labZ2Frac").childNodes[0].nodeValue = (useHRR ? I18N[LANG].tgtHRR : I18N[LANG].tgtHRmax).replace(/\(.+\)/, `(${sfx})`) + " ";
    $("labZ34Frac").childNodes[0].nodeValue = (useHRR ? I18N[LANG].tgtHRR : I18N[LANG].tgtHRmax).replace(/\(.+\)/, `(${sfx})`) + " ";
}

    // Simulation moved to sim-core.js


    // asBpm moved to sim-core.js

    // ---------- zones ----------
    // activityZoneFractions moved to sim-core.js

    function updateZonesUI(hrRest, hrMax, useHRR, target) {
    const cont = target ? (typeof target === 'string' ? $(target) : target) : $("zones");
    if (!cont) return;
    cont.innerHTML = "";
        const add = (n, lo, hi) => {
    const loB = Math.round(asBpm(lo, hrRest, hrMax, useHRR));
    const hiB = Math.round(asBpm(hi, hrRest, hrMax, useHRR));
    const d = document.createElement("div");
            d.className = "zone";
            // apply zone-specific class for colored border
            const cls = (n||"").toString().toUpperCase();
            if (cls === 'Z2') d.classList.add('is-z2');
            else if (cls === 'Z3') d.classList.add('is-z3');
            else if (cls === 'Z4') d.classList.add('is-z4');
            else if (cls === 'Z5') d.classList.add('is-z5');
    d.textContent = `${n} ${loB}–${hiB} bpm`;
    cont.appendChild(d);
};
    const p = getParams?.();
    const act = p?.activity || 'kb';
    const f = activityZoneFractions(act);
    add("Z2", f.Z2[0], f.Z2[1]); add("Z3", f.Z3[0], f.Z3[1]); add("Z4", f.Z4[0], f.Z4[1]); add("Z5", f.Z5[0], f.Z5[1]);

    // HRmax reliability indicator: if Max HR is not explicitly entered, zones are based on age estimate.
    if (p && p.hrMaxUserProvided === false) {
        const w = document.createElement('div');
        w.className = 'zone is-warn';
        const txt = (I18N && I18N[LANG] && I18N[LANG].hrMaxAutoZoneBadge)
            || (LANG === 'ru' ? 'HRmax: по возрасту (может быть неверно) — зоны могут быть смещены' : 'HRmax: age estimate (may be wrong) — zones may be off');
        w.textContent = txt;
        cont.appendChild(w);
    }
}

    // ---------- chart/legend ----------

    // ---- Karvonen HRR zones and overlay ----
    // moved to chart.js: computeKarvonenZones, overlayZones, drawChart, drawLegend

    // AI Analysis Brief logic moved to ai-brief.js
    function getRiskForZ2(lastHR, hrRest, hrMax, useHRR) {
    const asBpm = p => useHRR ? (hrRest + p * (hrMax - hrRest)) : (p * hrMax);
    const pstate = getParams?.();
    const act = pstate?.activity || 'kb';
    const f = activityZoneFractions(act);
    const z2max = asBpm(f.Z2[1]);  // activity-aware Z2 upper limit
    const delta = lastHR - z2max;

    if (delta <= 0) {
    return delta > -3 ? "Borderline (approaching Z3)" : "Very low";
}

    // If above Z2, always "Med" regardless of how far above
    return `Med (above Z2, HR ${Math.round(lastHR)})`;
}

    function relativeEfficiencies(durations) {
    // Time-based model: multiple of the fastest method.
    // 1.00 = best (fastest). Larger = worse (takes longer).
    const effs = {};
    const otherDurations = Object.entries(durations)
    .filter(([k, v]) => k !== 'ZRB')
    .map(([k, v]) => v);
    const minDur = Math.min(...otherDurations);

    for (const k in durations) {
    if (k === 'ZRB') {
    effs[k] = ''; // Exclude Zaruba method
    continue;
}
    const m = durations[k] / minDur; // e.g., 1.00, 1.35, 2.10, ...
    effs[k] = m <= 1.05 ? "Excellent"
    : m <= 1.30 ? "Very good"
    : m <= 1.70 ? "Good"
    : m <= 2.50 ? "Fair"
    : "Low";
}
    return effs;
}

    // hrLoadAU and hrLoadZone moved to sim-core.js

    function buildMetrics(g) {
    // Helper for calories calculation
    function calcCalories(avgHR, durMin, weight, age, sex) {
        let calPerMin = 0;
        if (sex === 'm') {
            calPerMin = (-55.0969 + 0.6309*avgHR + 0.1988*weight + 0.2017*age)/4.184;
        } else {
            calPerMin = (-20.4022 + 0.4472*avgHR - 0.1263*weight + 0.074*age)/4.184;
        }
        return Math.max(0, Math.round(calPerMin * durMin));
    }
    const rows = [];

    // --- durations ---
    const sW = g.sit.work * g.sit.n, sR = g.sit.rest * g.sit.n;
    const sT = sW + sR + (g.warmup + g.cooldown) * 60;

    const hW = g.hiit.work * g.hiit.n, hR = g.hiit.rest * g.hiit.n;
    const hT = hW + hR + (g.warmup + g.cooldown) * 60;

    // Zaruba (competition-style intervals with configurable On/Off and total duration)
    const zarOnBase = (g.zar?.on ?? 30);
    const zarOffBase = (g.zar?.off ?? 30);
    const zarDur = (g.zar?.dur ?? (5 * 60));
    const pat = Array.isArray(g.zar?.pattern) && g.zar.pattern.length ? g.zar.pattern : null;
    let zrbN, zrbWork, zrbRest, zrbT;
    let zarOnEff = zarOnBase, zarOffEff = zarOffBase; // effective averages for metrics/risk
    if (pat) {
    // Sum free-form segments up to duration
    let remaining = zarDur, idx = 0; let work = 0, rest = 0; let segCount = 0;
    while (remaining > 0 && segCount < 9999) {
    const seg = pat[idx] || pat[pat.length - 1];
    const on = Math.max(0, Math.floor(+seg.on || 0));
    const off = Math.max(0, Math.floor(+seg.off || 0));
    if (on > 0) { const w = Math.min(on, remaining); work += w; remaining -= w; if (remaining <= 0) break; }
    if (off > 0) { const r = Math.min(off, remaining); rest += r; remaining -= r; }
    idx++; segCount++;
}
    zrbN = segCount > 0 ? segCount : 1;
    zrbWork = work; zrbRest = rest;
    zrbT = zarDur + (g.warmup + g.cooldown) * 60;
    zarOnEff = zrbN ? Math.round(work / zrbN) : zarOnBase;
    zarOffEff = zrbN ? Math.round(rest / zrbN) : zarOffBase;
} else {
    const zrbCycle = Math.max(1, zarOnBase + zarOffBase);
    zrbN = Math.max(1, Math.floor(zarDur / zrbCycle));
    zrbWork = zarOnBase * zrbN; zrbRest = zarOffBase * zrbN;
    zrbT = zrbWork + zrbRest + (g.warmup + g.cooldown) * 60;
    zarOnEff = zarOnBase; zarOffEff = zarOffBase;
}

    const z34T = g.z34.min * 60 + (g.warmup + g.cooldown) * 60;
    const z2T = g.z2.min * 60 + (g.warmup + g.cooldown) * 60;
    const strT = (g.warmup + g.cooldown) * 60 + 1500;

    // Common warm/cool window in seconds
    const warmSec = (g.warmup || 0) * 60;
    const coolSec = (g.cooldown || 0) * 60;
    const bTrimp = (g.trimpSex === 'f') ? 1.67 : 1.92;

    // Activity-specific zone fractions (must match chart overlay zones)
    const af = (typeof activityZoneFractions === 'function') ? activityZoneFractions(g.activity) : { Z2:[0.60,0.70], Z3:[0.70,0.80], Z4:[0.80,0.90], Z5:[0.90,1.00] };

    // --- BDNF heuristic (more sensitive than the old binary thresholds) ---
    // Goal: avoid giving almost-all-intervals "High"; make it respond to volume/intensity and actual time in Z4–Z5.
    function zoneMinutesFromSeries(series) {
    try {
        if (!series || !Array.isArray(series.hr) || !Array.isArray(series.t) || series.hr.length !== series.t.length) return null;
        const hrRest = Number(g.hrRest) || 55;
        const hrMax = Number(g.hrMax) || 185;
        const span = Math.max(1, hrMax - hrRest);
        const useHRR = !!g.useHRR;
        const startT = warmSec;
        const endT = Math.max(startT, (series.t[series.t.length - 1] || 0) - coolSec);
        const z2 = af.Z2[0], z3 = af.Z3[0], z4 = af.Z4[0], z5 = af.Z5[0];
        let z1s = 0, z2s = 0, z3s = 0, z4s = 0, z5s = 0;
        for (let i = 1; i < series.t.length; i++) {
            const t0 = Number(series.t[i - 1] || 0);
            const t1 = Number(series.t[i] || 0);
            if (!(t1 > t0)) continue;
            // segment overlap with [startT, endT]
            const a = Math.max(t0, startT);
            const b = Math.min(t1, endT);
            if (!(b > a)) continue;
            const dt = b - a;
            const h = Number(series.hr[i] ?? series.hr[i - 1]);
            if (!Number.isFinite(h)) continue;
            const f = useHRR ? ((h - hrRest) / span) : (h / Math.max(1, hrMax));
            if (f >= z5) z5s += dt;
            else if (f >= z4) z4s += dt;
            else if (f >= z3) z3s += dt;
            else if (f >= z2) z2s += dt;
            else z1s += dt;
        }
        return {
            z1: z1s / 60,
            z2: z2s / 60,
            z3: z3s / 60,
            z4: z4s / 60,
            z5: z5s / 60,
            total: (z1s + z2s + z3s + z4s + z5s) / 60
        };
    } catch (_) {
        return null;
    }
}
    function bdnfLabel(intensity01, workMin, z45Min) {
    const i = Number.isFinite(intensity01) ? Math.max(0, Math.min(1, intensity01)) : 0;
    const w = Number.isFinite(workMin) ? Math.max(0, workMin) : 0;
    const z = Number.isFinite(z45Min) ? Math.max(0, z45Min) : 0;
    // Diminishing returns: tanh keeps it bounded and sensitive in the typical range.
    const stim = 0.75 * i + 0.45 * Math.tanh(w / 8) + 0.80 * Math.tanh(z / 4);
    if (stim >= 1.35) return 'Very high';
    if (stim >= 1.05) return 'High';
    if (stim >= 0.75) return 'Medium';
    return 'Low';
}

    // --- efficiency labels ---
    // Snatch/Swings total time (steady minutes + warm/cool)
    const snT = (Math.max(0, +(g.sn?.min || 0)) * 60) + (g.warmup + g.cooldown) * 60;
    const swT = (Math.max(0, +(g.sw?.min || 0)) * 60) + (g.warmup + g.cooldown) * 60;

    const durations = { SIT: sT, HIIT: hT, SN: snT, SW: swT, Z34: z34T, Z2: z2T, STR: strT, ZRB: zrbT };
    const effs = relativeEfficiencies(durations);
    const otherDurations = Object.entries(durations)
    .filter(([k, v]) => k !== 'ZRB')
    .map(([k, v]) => v);
    const minDur = Math.min(...otherDurations);
    // Show as time multiple vs fastest (×1.00, ×1.35, ...)
    const effWithVal = (k) => {
    if (k === 'ZRB') return ''; // Exclude Zaruba method
    return `${effs[k]} <span style="opacity:.6;font-size:11px" class="mono">(×${(durations[k] / minDur).toFixed(2)})</span>`;
}

    // --- SIT ---
    const sHRR = "Strong";
    const sFast = g.sit.eff >= 9 && g.sit.work <= 45 ? "High" : "Medium";
    // Map RPE to intensity factor 0..1
    const sInt = Math.max(0, Math.min(1, (g.sit.eff - 6) / 4));
    let sRisk = (sInt * g.sit.work * g.sit.n) / 240; // tuned denominator for similar scale
    sRisk -= Math.min(.3, g.sit.rest / 240);
    sRisk = Math.max(0, sRisk);
    const sCard = bucket(sRisk, [.25, .5, .8], ["Low", "Med", "Med–High", "High"]);
{
    const sSeries = simulateHR({ kind: "SIT", hrRest: g.hrRest, hrMax: g.hrMax, work: g.sit.work, rest: g.sit.rest, n: g.sit.n, eff: g.sit.eff, drift10: g.drift10, useHRR: g.useHRR, tauOn: g.tauOn, tauOff: g.tauOff, warm: g.warmup, cool: g.cooldown });
    const sZm = zoneMinutesFromSeries(sSeries);
    const sWorkMin = (Math.max(0, Number(g.sit.work) || 0) * Math.max(1, Number(g.sit.n) || 1)) / 60;
    const sZ45 = sZm ? (sZm.z4 + sZm.z5) : NaN;
    const sBDNF = bdnfLabel(sInt, sWorkMin, sZ45);
    const sLoad = hrLoadAU(sSeries.hr, g.hrRest, g.hrMax, g.useHRR, warmSec, coolSec, bTrimp);
    const sZLoad = hrLoadZone(sSeries.hr, g.hrRest, g.hrMax, g.useHRR, warmSec, coolSec, undefined, af);
    const sAvgHR = (Array.isArray(sSeries.hr) && sSeries.hr.length) ? (sSeries.hr.reduce((a,b)=>a+b,0)/sSeries.hr.length) : 0;
    const sDurMin = (Array.isArray(sSeries.t) && sSeries.t.length) ? ((sSeries.t[sSeries.t.length-1] - sSeries.t[0]) / 60) : 0;
    const sWeight = Number.isFinite(g.bodyWeight) ? g.bodyWeight : 75;
    const sAge = Number.isFinite(g.age) ? g.age : 35;
    const sSex = (g.trimpSex === 'f') ? 'f' : 'm';
    const sCalories = calcCalories(sAvgHR, sDurMin, sWeight, sAge, sSex);
    rows.push({
        m: I18N[LANG].meth.SIT,
        typ: `${g.sit.n}×${g.sit.work}s / ${g.sit.rest}s @ RPE ${(+g.sit.eff).toFixed(1)}`,
        time: sT, wr: `${g.sit.work}:${g.sit.rest}`, hrr: sHRR, fast: sFast, bdnf: sBDNF,
        cort: "Low", cardio: sCard, inj: "Low–Med", eff: effWithVal("SIT"),
        load: Math.round(sLoad), zload: Math.round(sZLoad),
        calories: sCalories
    });
}

    // --- HIIT ---
    const hHRR = bucket(g.hiit.rest / g.tauOff, [1.0, 1.8, 2.5], ["Low", "Medium", "Good", "Strong"]);
    const hFast = g.hiit.eff >= 8 && g.hiit.work <= 90 ? "Medium" : "Low";
    const hInt = Math.max(0, Math.min(1, (g.hiit.eff - 6) / 4));
    let hRisk = (hInt * g.hiit.work * g.hiit.n) / 160;
    hRisk -= Math.min(.2, g.hiit.rest / 180);
    hRisk = Math.max(0, hRisk);
    const hCard = bucket(hRisk, [.3, .6, .9], ["Low", "Med", "Med–High", "High"]);
{
    const hSeries = simulateHR({ kind: "HIIT", hrRest: g.hrRest, hrMax: g.hrMax, work: g.hiit.work, rest: g.hiit.rest, n: g.hiit.n, eff: g.hiit.eff, drift10: g.drift10, useHRR: g.useHRR, tauOn: g.tauOn, tauOff: g.tauOff, warm: g.warmup, cool: g.cooldown, restFrac: g.hiit.restFrac });
    const hZm = zoneMinutesFromSeries(hSeries);
    const hWorkMin = (Math.max(0, Number(g.hiit.work) || 0) * Math.max(1, Number(g.hiit.n) || 1)) / 60;
    const hZ45 = hZm ? (hZm.z4 + hZm.z5) : NaN;
    const hBDNF = bdnfLabel(hInt, hWorkMin, hZ45);
    const hLoad = hrLoadAU(hSeries.hr, g.hrRest, g.hrMax, g.useHRR, warmSec, coolSec, bTrimp);
    const hZLoad = hrLoadZone(hSeries.hr, g.hrRest, g.hrMax, g.useHRR, warmSec, coolSec, undefined, af);
    const hAvgHR = (Array.isArray(hSeries.hr) && hSeries.hr.length) ? (hSeries.hr.reduce((a,b)=>a+b,0)/hSeries.hr.length) : 0;
    const hDurMin = (Array.isArray(hSeries.t) && hSeries.t.length) ? ((hSeries.t[hSeries.t.length-1] - hSeries.t[0]) / 60) : 0;
    const hWeight = Number.isFinite(g.bodyWeight) ? g.bodyWeight : 75;
    const hAge = Number.isFinite(g.age) ? g.age : 35;
    const hSex = (g.trimpSex === 'f') ? 'f' : 'm';
    const hCalories = calcCalories(hAvgHR, hDurMin, hWeight, hAge, hSex);
    rows.push({
        m: I18N[LANG].meth.HIIT,
        typ: `${g.hiit.n}×${g.hiit.work}s / ${g.hiit.rest}s @ RPE ${(+g.hiit.eff).toFixed(1)}`,
        time: hT, wr: `${g.hiit.work}:${g.hiit.rest}`, hrr: hHRR, fast: hFast, bdnf: hBDNF,
        cort: "Med–High", cardio: hCard, inj: "Med", eff: effWithVal("HIIT"),
        load: Math.round(hLoad), zload: Math.round(hZLoad),
        calories: hCalories
    });
}

    // --- Zaruba (EMOM) ---
    const zrbHRR = bucket((zarOffEff) / g.tauOff, [0.8, 1.4, 2.0], ["Low", "Medium", "Good", "Strong"]);
    const zrbFast = zarOnEff >= 20 ? "Medium" : "Low";
    const zEffMin = (g.zar?.mode === 'universal') ? 2 : 6;
    // If custom pattern has per-block intensity (@x), use a work-time weighted average eff.
    let zEffForMetrics = (Number.isFinite(+g.zar?.eff) ? (+g.zar.eff) : 8);
    if (pat && pat.some(s => Number.isFinite(+s.eff))) {
        try {
            let remaining = zarDur;
            let idx = 0;
            let wSum = 0;
            let wEff = 0;
            let guard = 0;
            while (remaining > 0 && guard++ < 9999) {
                const seg = pat[idx] || pat[pat.length - 1];
                const on = Math.max(0, Math.floor(+seg.on || 0));
                const off = Math.max(0, Math.floor(+seg.off || 0));
                const effSeg = Number.isFinite(+seg.eff) ? (+seg.eff) : zEffForMetrics;
                if (on > 0) {
                    const w = Math.min(on, remaining);
                    wSum += w;
                    wEff += w * effSeg;
                    remaining -= w;
                    if (remaining <= 0) break;
                }
                if (off > 0) {
                    const r = Math.min(off, remaining);
                    remaining -= r;
                }
                idx++;
            }
            if (wSum > 0) zEffForMetrics = (wEff / wSum);
        } catch(_){ }
    }
    const zInt = Math.max(0, Math.min(1, (((Number.isFinite(+zEffForMetrics) ? (+zEffForMetrics) : 8)) - zEffMin) / (10 - zEffMin)));
    let zRisk = (zInt * zarOnEff * zrbN) / 180; // between HIIT and SIT scaling
    zRisk -= Math.min(.15, (zarOffEff) / 120);
    zRisk = Math.max(0, zRisk);
    const zCard = bucket(zRisk, [.25, .5, .8], ["Low", "Med", "Med–High", "High"]);
{
    const zrbSeries = (function(){
        if (pat) {
            return simulateHR({ kind: "ZRB", hrRest: g.hrRest, hrMax: g.hrMax, work: 0, rest: 0, n: 1, eff: (Number.isFinite(+g.zar?.eff) ? (+g.zar.eff) : 8), effMin: zEffMin, drift10: g.drift10, useHRR: g.useHRR, tauOn: g.tauOn, tauOff: g.tauOff, warm: g.warmup, cool: g.cooldown, pattern: pat, dur: zarDur });
        } else {
            return simulateHR({ kind: "ZRB", hrRest: g.hrRest, hrMax: g.hrMax, work: zarOnBase, rest: zarOffBase, n: zrbN, eff: (Number.isFinite(+g.zar?.eff) ? (+g.zar.eff) : 8), effMin: zEffMin, drift10: g.drift10, useHRR: g.useHRR, tauOn: g.tauOn, tauOff: g.tauOff, warm: g.warmup, cool: g.cooldown });
        }
    })();
    const zrbZm = zoneMinutesFromSeries(zrbSeries);
    const zrbWorkMin = (Math.max(0, Number(zarOnEff) || 0) * Math.max(1, Number(zrbN) || 1)) / 60;
    const zrbZ45 = zrbZm ? (zrbZm.z4 + zrbZm.z5) : NaN;
    const zrbBDNF = bdnfLabel(zInt, zrbWorkMin, zrbZ45);
    const zrbLoad = hrLoadAU(zrbSeries.hr, g.hrRest, g.hrMax, g.useHRR, warmSec, coolSec, bTrimp);
    const zrbZLoad = hrLoadZone(zrbSeries.hr, g.hrRest, g.hrMax, g.useHRR, warmSec, coolSec, undefined, af);
    const zrbAvgHR = (Array.isArray(zrbSeries.hr) && zrbSeries.hr.length) ? (zrbSeries.hr.reduce((a,b)=>a+b,0)/zrbSeries.hr.length) : 0;
    const zrbDurMin = (Array.isArray(zrbSeries.t) && zrbSeries.t.length) ? ((zrbSeries.t[zrbSeries.t.length-1] - zrbSeries.t[0]) / 60) : 0;
    const zrbWeight = Number.isFinite(g.bodyWeight) ? g.bodyWeight : 75;
    const zrbAge = Number.isFinite(g.age) ? g.age : 35;
    const zrbSex = (g.trimpSex === 'f') ? 'f' : 'm';
    const zrbCalories = calcCalories(zrbAvgHR, zrbDurMin, zrbWeight, zrbAge, zrbSex);
    rows.push({
        m: I18N[LANG].meth.ZRB,
        typ: `${pat ? (LANG==='ru'?'Своя схема':'Custom pattern') : (zrbN + '×' + zarOnEff + 's/' + zarOffEff + 's')} @ ${(g.zar?.mode==='universal' ? (LANG==='ru'?'инт.':'int.') : 'RPE')} ${(+zEffForMetrics).toFixed(1)}`,
        time: zrbT, wr: `${pat ? (LANG==='ru'?'своя':'custom') : (zarOnEff + ':' + zarOffEff)}`, hrr: zrbHRR, fast: zrbFast, bdnf: zrbBDNF,
        cort: "Med", cardio: zCard, inj: "Low–Med", eff: effWithVal("ZRB"),
        load: Math.round(zrbLoad), zload: Math.round(zrbZLoad),
        calories: zrbCalories
    });
}

    // --- Snatch (KB) ---
{
    const prot = (g.sn?.prot || 'classic');
    const snDurSec = Math.max(1, Math.round((g.sn?.min || 10) * 60));
    const snSeries = simulateHR({
        kind: "SN",
        hrRest: g.hrRest, hrMax: g.hrMax,
        drift10: g.drift10, useHRR: g.useHRR,
        tauOn: g.tauOn, tauOff: g.tauOff,
        warm: g.warmup, cool: g.cooldown,
        dur: snDurSec,
        snProt: prot,
        snChangeMin: +(g.sn?.changeMin || 5),
        snWeight: +(g.sn?.weight || 16),
        snCad: +(g.sn?.cad || 20)
    });
    const snLoad = hrLoadAU(snSeries.hr, g.hrRest, g.hrMax, g.useHRR, warmSec, coolSec, bTrimp);
    const snZLoad = hrLoadZone(snSeries.hr, g.hrRest, g.hrMax, g.useHRR, warmSec, coolSec, undefined, af);
    const snAvgHR = (Array.isArray(snSeries.hr) && snSeries.hr.length) ? (snSeries.hr.reduce((a,b)=>a+b,0)/snSeries.hr.length) : 0;
    const snDurMin = (Array.isArray(snSeries.t) && snSeries.t.length) ? ((snSeries.t[snSeries.t.length-1] - snSeries.t[0]) / 60) : (snDurSec/60);
    const snBodyW = Number.isFinite(g.bodyWeight) ? g.bodyWeight : 75;
    const snAge = Number.isFinite(g.age) ? g.age : 35;
    const snSex = (g.trimpSex === 'f') ? 'f' : 'm';
    const snCalories = calcCalories(snAvgHR, snDurMin, snBodyW, snAge, snSex);
    // Heuristic labels
    const clamp01 = (x) => Math.max(0, Math.min(1, x));
    const cad = Math.max(5, Math.min(35, +(g.sn?.cad || 20)));
    const bell = Math.max(1, Math.min(50, +(g.sn?.weight || 16)));
    const bellRatio = bell / 8;
    const cadRatio = cad / 10;
    const load = Math.pow(bellRatio, 1.5) * Math.pow(cadRatio, 1.6);
    const intensity = clamp01(1 - Math.exp(-load / 7.5));
    let snRisk = (intensity * (g.sn?.min || 10)) / 18; // scale ~ similar to HIIT/SIT
    if (prot === 'classic') snRisk -= 0.05; // small relief for the single dip
    snRisk = Math.max(0, snRisk);
    const snCard = bucket(snRisk, [.25, .5, .8], ["Low", "Med", "Med–High", "High"]);
    const snHRR = "Med";
    const snFast = (intensity >= 0.60 ? "Medium" : "Low");
    const snZm = zoneMinutesFromSeries(snSeries);
    const snWorkMin = Math.max(0, Number(g.sn?.min || 10));
    const snZ45 = snZm ? (snZm.z4 + snZm.z5) : NaN;
    const snBDNF = bdnfLabel(intensity, snWorkMin, snZ45);
    const protLabel = (LANG==='ru'
        ? (prot === 'classic' ? 'Классика' : 'Армейский')
        : (prot === 'classic' ? 'Classic' : 'Army'));
    rows.push({
        m: I18N[LANG].meth.SN,
        typ: `${Math.round(g.sn?.min || 10)} min, ${Math.round(g.sn?.weight || 16)}kg, ${Math.round(g.sn?.cad || 20)} rpm, ${protLabel}`,
        time: snT, wr: "—", hrr: snHRR, fast: snFast, bdnf: snBDNF,
        cort: (intensity >= 0.72 || (g.sn?.min||10) >= 15) ? "Med–High" : "Med",
        cardio: snCard, inj: "Low–Med", eff: effWithVal("SN"),
        load: Math.round(snLoad), zload: Math.round(snZLoad),
        calories: snCalories
    });
}

    // --- Swings (KB) ---
{
    const prot = (g.sw?.prot || 'classic');
    const style = (g.sw?.style || 'universal');
    const swDurSec = Math.max(1, Math.round((g.sw?.min || 14) * 60));
    const swSeries = simulateHR({
        kind: "SW",
        hrRest: g.hrRest, hrMax: g.hrMax,
        eff: (Number.isFinite(+g.sw?.eff) ? (+g.sw.eff) : 8.5),
        drift10: g.drift10, useHRR: g.useHRR,
        tauOn: g.tauOn, tauOff: g.tauOff,
        warm: g.warmup, cool: g.cooldown,
        dur: swDurSec,
        swStyle: style,
        swProt: prot,
        swChangeMin: +(g.sw?.changeMin || Math.max(1, (g.sw?.min || 14)/2)),
        swWeight: +(g.sw?.weight || 20)
    });
    const swLoad = hrLoadAU(swSeries.hr, g.hrRest, g.hrMax, g.useHRR, warmSec, coolSec, bTrimp);
    const swZLoad = hrLoadZone(swSeries.hr, g.hrRest, g.hrMax, g.useHRR, warmSec, coolSec, undefined, af);
    const swAvgHR = (Array.isArray(swSeries.hr) && swSeries.hr.length) ? (swSeries.hr.reduce((a,b)=>a+b,0)/swSeries.hr.length) : 0;
    const swDurMin = (Array.isArray(swSeries.t) && swSeries.t.length) ? ((swSeries.t[swSeries.t.length-1] - swSeries.t[0]) / 60) : (swDurSec/60);
    const swBodyW = Number.isFinite(g.bodyWeight) ? g.bodyWeight : 75;
    const swAge = Number.isFinite(g.age) ? g.age : 35;
    const swSex = (g.trimpSex === 'f') ? 'f' : 'm';
    const swCalories = calcCalories(swAvgHR, swDurMin, swBodyW, swAge, swSex);
    const clamp01 = (x) => Math.max(0, Math.min(1, x));
    const effVal = (Number.isFinite(+g.sw?.eff) ? (+g.sw.eff) : 8.5);
    const iEff = clamp01((effVal - 2) / 8);
    const bell = Math.max(4, Math.min(50, +(g.sw?.weight || 20)));
    const iW = 1 / (1 + Math.exp(-0.30 * (bell - 18)));
    let wW = 0.70, wE = 0.30;
    if (style === 'chest1h') { wW = 0.62; wE = 0.38; }
    if (style === 'overhead2h') { wW = 0.74; wE = 0.26; }
    let intensity = clamp01(wW * iW + wE * iEff);
    if (style === 'overhead2h') intensity = clamp01(intensity * 1.06);
    let swRisk = (intensity * (g.sw?.min || 14)) / 20; // slightly gentler scale than SN
    if (prot === 'classic') swRisk -= 0.05;
    swRisk = Math.max(0, swRisk);
    const swCard = bucket(swRisk, [.25, .5, .8], ["Low", "Med", "Med–High", "High"]);
    const swHRR = "Med";
    const swFast = (intensity >= 0.60 ? "Medium" : "Low");
    const swZm = zoneMinutesFromSeries(swSeries);
    const swWorkMin = Math.max(0, Number(g.sw?.min || 14));
    const swZ45 = swZm ? (swZm.z4 + swZm.z5) : NaN;
    const swBDNF = bdnfLabel(intensity, swWorkMin, swZ45);
    const protLabel = (style === 'overhead2h')
        ? ''
        : (LANG==='ru'
            ? (prot === 'classic' ? 'Классика' : 'Армейский')
            : (prot === 'classic' ? 'Classic' : 'Army'));
    const styleLabel = (LANG==='ru'
        ? (style === 'chest1h' ? 'До груди (1 рука)' : (style === 'overhead2h' ? 'Над головой (2 руки)' : 'Универсальный'))
        : (style === 'chest1h' ? 'Chest (1H)' : (style === 'overhead2h' ? 'Overhead (2H)' : 'Universal')));
    rows.push({
        m: I18N[LANG].meth.SW,
        typ: `${Math.round(g.sw?.min || 14)} min, ${Math.round(g.sw?.weight || 20)}kg, ${styleLabel}${protLabel ? (', ' + protLabel) : ''} @ ${(+effVal).toFixed(1)}/10`,
        time: swT, wr: "—", hrr: swHRR, fast: swFast, bdnf: swBDNF,
        cort: (intensity >= 0.72 || (g.sw?.min||14) >= 20) ? "Med–High" : "Med",
        cardio: swCard, inj: "Low–Med", eff: effWithVal("SW"),
        load: Math.round(swLoad), zload: Math.round(swZLoad),
        calories: swCalories
    });
}

    // --- Zone 3–4 ---
    const seriesZ34 = simulateHR({
    kind: "Z34", hrRest: g.hrRest, hrMax: g.hrMax, steadyMin: g.z34.min, steadyFrac: g.z34.frac,
    drift10: g.drift10, useHRR: g.useHRR, tauOn: g.tauOn, tauOff: g.tauOff, warm: g.warmup, cool: g.cooldown
});
    const steadyZ34Sec = g.z34.min * 60;
    const tailZ34 = zoneTailViolation(seriesZ34.hr, g.hrRest, g.hrMax, g.useHRR, af.Z3[0], af.Z5[0], steadyZ34Sec, g.warmup * 60);
    let z34CardioRisk = "Med–High";
    if (tailZ34.frac > 0.5) {
    const lastHrTxt = Number.isFinite(tailZ34.last) ? Math.round(tailZ34.last) : 'n/a';
    z34CardioRisk = `High (tail out of zone, last HR ${lastHrTxt} > ${Math.round(tailZ34.maxBpm)})`;
} else if (tailZ34.frac > 0.1) {
    z34CardioRisk = `Med–High (tail partly out of zone)`;
}
    const z34Load = hrLoadAU(seriesZ34.hr, g.hrRest, g.hrMax, g.useHRR, warmSec, coolSec, bTrimp);
    const z34ZLoad = hrLoadZone(seriesZ34.hr, g.hrRest, g.hrMax, g.useHRR, warmSec, coolSec, undefined, af);
    const z34AvgHR = (Array.isArray(seriesZ34.hr) && seriesZ34.hr.length) ? (seriesZ34.hr.reduce((a,b)=>a+b,0)/seriesZ34.hr.length) : 0;
    const z34DurMin = (Array.isArray(seriesZ34.t) && seriesZ34.t.length) ? ((seriesZ34.t[seriesZ34.t.length-1] - seriesZ34.t[0]) / 60) : 0;
    const z34Weight = Number.isFinite(g.bodyWeight) ? g.bodyWeight : 75;
    const z34Age = Number.isFinite(g.age) ? g.age : 35;
    const z34Sex = (g.trimpSex === 'f') ? 'f' : 'm';
    const z34Calories = calcCalories(z34AvgHR, z34DurMin, z34Weight, z34Age, z34Sex);
    rows.push({
        m: I18N[LANG].meth.Z34, typ: `${g.z34.min} min @ ${Math.round(g.z34.frac * 100)}%`,
        time: z34T, wr: "—", hrr: "Low–Med", fast: "Low", bdnf: "Low",
        cort: g.z34.min >= 30 ? "High (chronic Z3–4 stress)" : "Med–High (Z3–4)",
        cardio: z34CardioRisk, inj: "Med", eff: effWithVal("Z34"), load: Math.round(z34Load), zload: Math.round(z34ZLoad),
        calories: z34Calories
    });

    // --- Zone 2 ---
    const seriesZ2 = simulateHR({
    kind: "Z2", hrRest: g.hrRest, hrMax: g.hrMax, steadyMin: g.z2.min, steadyFrac: g.z2.frac,
    drift10: g.drift10, useHRR: g.useHRR, tauOn: g.tauOn, tauOff: g.tauOff, warm: g.warmup, cool: g.cooldown
});
    const steadyZ2Sec = g.z2.min * 60;
    const tailZ2 = zoneTailViolation(seriesZ2.hr, g.hrRest, g.hrMax, g.useHRR, af.Z2[0], af.Z3[0], steadyZ2Sec, g.warmup * 60);
    let z2CardioRisk = "Very low";
    if (Number.isFinite(tailZ2.last)) {
    const asBP = p => g.useHRR ? (g.hrRest + p * (g.hrMax - g.hrRest)) : (p * g.hrMax);
    const z2max = asBP(af.Z3[0]), z3max = asBP(af.Z4[0]), z4max = asBP(af.Z5[0]);

    const tailInZ34 = tailZ2.last > z2max && tailZ2.last <= z4max;
    const mostlyOut = tailZ2.frac >= 0.5;

    // If Z2 tail is mostly in Z3–4, copy Z3–4 risk
    if (tailInZ34 && mostlyOut) {
    z2CardioRisk = z34CardioRisk;
} else {
    // Graded mapping
    if (tailZ2.last > z4max) z2CardioRisk = "High (in Z5)";
    else if (tailZ2.last > z3max) z2CardioRisk = "Med–High (in Z4)";
    else if (tailZ2.last > z2max) z2CardioRisk = "Med (in Z3)";
    else if (tailZ2.frac > 0.1) z2CardioRisk = "Med (tail partly out of zone)";
    else if (tailZ2.last > z2max - 3) z2CardioRisk = "Borderline (approaching Z3)";
}

    // If curves match closely, copy Z3–4 risk verbatim
    if (seriesZ34) {
        const L = Math.min(seriesZ2.hr.length, seriesZ34.hr.length);
    if (L > 0) {
        let mse = 0;
        for (let i = 0; i < L; i++) { const d = seriesZ2.hr[i] - seriesZ34.hr[i]; mse += d * d; }
        const rmse = Math.sqrt(mse / L);
        if (rmse <= 2) z2CardioRisk = z34CardioRisk;
    }   
}
}
    // --- Z2 cortisol: mirror Z3–4 if Z2 behaves like Z3–4 (same tail zone or curves match) ---
    let z2Cort = "Low";
    if (Number.isFinite(tailZ2.last)) {
    const asBpm = p => g.useHRR ? (g.hrRest + p * (g.hrMax - g.hrRest)) : (p * g.hrMax);
    const z2max = asBpm(af.Z3[0]), z3max = asBpm(af.Z4[0]), z4max = asBpm(af.Z5[0]);

    // 1) If tail sits in Z3–Z4 and is mostly out of Z2 → use Z3–4 duration rule
    const tailInZ34 = tailZ2.last > z2max && tailZ2.last <= z4max;
    const mostlyOut = tailZ2.frac >= 0.5; // last 5 min mostly out of Z2
    if (tailInZ34 && mostlyOut) {
    z2Cort = (g.z2.min >= 30) ? "High (chronic Z3–4 stress)" : "Med–High (Z3–4)";
} else {
    // 2) Otherwise keep graded scale
    if (tailZ2.last > z4max) z2Cort = "High";
    else if (tailZ2.last > z3max) z2Cort = "Med–High";
    else if (tailZ2.last > z2max) z2Cort = "Med";
    else if (tailZ2.last > z2max - 3) z2Cort = "Low–Med";
}

    // 3) If Z2 and Z3–4 curves overlap almost perfectly → copy Z3–4 cortisol verbatim
    if (seriesZ34) {
    const L = Math.min(seriesZ2.hr.length, seriesZ34.hr.length);
    if (L > 0) {
    let mse = 0;
    for (let i = 0; i < L; i++) { const d = seriesZ2.hr[i] - seriesZ34.hr[i]; mse += d * d; }
    const rmse = Math.sqrt(mse / L);
    if (rmse <= 2) {
    const z34C = (g.z34.min >= 30) ? "High (chronic Z3–4 stress)" : "Med–High (Z3–4)";
    z2Cort = z34C;
}
}
}
}

    const z2Load = hrLoadAU(seriesZ2.hr, g.hrRest, g.hrMax, g.useHRR, warmSec, coolSec, bTrimp);
    const z2ZLoad = hrLoadZone(seriesZ2.hr, g.hrRest, g.hrMax, g.useHRR, warmSec, coolSec, undefined, af);
    const z2AvgHR = (Array.isArray(seriesZ2.hr) && seriesZ2.hr.length) ? (seriesZ2.hr.reduce((a,b)=>a+b,0)/seriesZ2.hr.length) : 0;
    const z2DurMin = (Array.isArray(seriesZ2.t) && seriesZ2.t.length) ? ((seriesZ2.t[seriesZ2.t.length-1] - seriesZ2.t[0]) / 60) : 0;
    const z2Weight = Number.isFinite(g.bodyWeight) ? g.bodyWeight : 75;
    const z2Age = Number.isFinite(g.age) ? g.age : 35;
    const z2Sex = (g.trimpSex === 'f') ? 'f' : 'm';
    const z2Calories = calcCalories(z2AvgHR, z2DurMin, z2Weight, z2Age, z2Sex);
    rows.push({
        m: I18N[LANG].meth.Z2, typ: `${g.z2.min} min @ ${Math.round(g.z2.frac * 100)}%`,
        time: z2T, wr: "—", hrr: "High", fast: "Low", bdnf: "Low",
        cort: z2Cort,
        cardio: z2CardioRisk,
        inj: "Low", eff: effWithVal("Z2"), load: Math.round(z2Load), zload: Math.round(z2ZLoad),
        calories: z2Calories
    });

    // --- Strength ---
    rows.push({
        m: I18N[LANG].meth.STR, typ: `3–5 × 3–8 reps, full rest`,
        time: strT, wr: "—", hrr: "Low", fast: "High", bdnf: "Low",
        cort: "Low–Med (technique dependent)", cardio: "Very low", inj: "Med", eff: effWithVal("STR"), load: '',
        calories: ''
    });

    return rows;
}


    // ---------- metrics ----------

    // zoneTailViolation moved to sim-core.js

    // ---------- main render ----------
    // getParams now provided by params.js
    // CSV parser (rest of import helpers follow below)
    function parseCSV(text) {
        if (!text || !text.trim()) return { header: [], rows: [] };
        // drop BOM if present
        if (text.charCodeAt(0) === 0xFEFF) text = text.slice(1);
        const lines = text.split(/\r?\n/).filter(l => l.length);
        if (!lines.length) return { header: [], rows: [] };

        function splitCSVLine(line, sepCh) {
            const out = [];
            let cur = '';
            let inQuotes = false;
            let i = 0;
            while (i < line.length) {
                const ch = line[i];
                if (ch === '"') {
                    if (inQuotes && i+1 < line.length && line[i+1] === '"') {
                        // escaped quote
                        cur += '"'; i += 2; continue;
                    }
                    inQuotes = !inQuotes; i++; continue;
                }
                if (!inQuotes && ch === sepCh) { out.push(cur.trim()); cur = ''; i++; continue; }
                cur += ch; i++;
            }
            out.push(cur.trim());
            // strip surrounding quotes
            for (let k=0;k<out.length;k++) {
                let s = out[k];
                if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) s = s.slice(1,-1);
                out[k] = s.trim();
            }
            return out;
        }

        // sniff delimiter across multiple lines picking the most consistent
        const cands = [',',';','\t','|'];
        let bestSep = ','; let bestScore = -Infinity;
        for (const c of cands) {
            const cc = c === '\t' ? '\t' : c;
            const counts = [];
            for (let i=0; i<Math.min(10, lines.length); i++) {
                counts.push(splitCSVLine(lines[i], cc).length);
            }
            const mean = counts.reduce((a,b)=>a+b,0)/counts.length;
            const varr = counts.reduce((a,b)=>a+(b-mean)*(b-mean),0)/counts.length;
            const score = mean - varr; // prefer more columns, lower variance
            if (score > bestScore) { bestScore = score; bestSep = cc; }
        }
        const sep = bestSep;
        const splitter = (l) => splitCSVLine(l, sep);
        // Prefer a later header line that clearly contains time + hr columns (for "report + timeseries" CSVs)
        const hasTimeTok = (arr) => arr.some(x => /(\btime\b|timestamp|datetime|elapsed|secs?|seconds?)/i.test(x||''));
        const hasHRTok = (arr) => arr.some(x => /(^hr$|heart.?rate|bpm|pulse|пульс)/i.test((x||'').toLowerCase()));
        let headerIdx = -1;
        // Special-case Polar CSV: pick the timeseries header that starts with "Sample rate,Time,HR (bpm),..."
        for (let i=0; i<Math.min(200, lines.length); i++) {
            const toks = splitter(lines[i]).map(s => (s||'').toLowerCase());
            const hasSampleRate = toks.some(x => /^sample\s*rate/.test(x));
            if (hasSampleRate && hasTimeTok(toks) && hasHRTok(toks)) { headerIdx = i; break; }
        }
        // Generic fallback: first line that has both time and hr tokens
        if (headerIdx < 0) {
            for (let i=0; i<Math.min(50, lines.length); i++) {
                const toks = splitter(lines[i]);
                if (hasTimeTok(toks) && hasHRTok(toks)) { headerIdx = i; break; }
            }
        }
        let header = splitter(headerIdx >= 0 ? lines[headerIdx] : lines[0]);
        const tokenHasLetters = (s) => /[A-Za-zА-Яа-я]/.test(s);
        const tokenLooksTime = (s) => /^\d{1,2}:\d{2}(?::\d{2})?$/.test(s) || Number.isFinite(Date.parse(s));
        // detect header if any token has letters or typical header names present
        const looksHeader = header.some(x => tokenHasLetters(x)) || header.some(x => /(time|timestamp|heart|rate|bpm|hr)/i.test(x)) || !header.every(x => !isNaN(Number(x.replace(',','.'))) || tokenLooksTime(x));
        let startIdx = (headerIdx >= 0 ? headerIdx+1 : 1);
        if (!looksHeader) {
            header = header.map((_,i) => i===0? 'time' : (i===1? 'hr' : ('col'+i)));
            startIdx = (headerIdx >= 0 ? headerIdx+1 : 0);
        }
        // Slice rows from the detected header forward (skip any blank trailing noise lines)
        const rows = lines.slice(startIdx).filter(l => l.trim().length > 0).map(splitter);
        return { header, rows, sep };
    }

    // Fallback: direct Polar timeseries parser targeting header "Sample rate, Time, HR (bpm), ..."
    function tryParsePolarTimeseries(text) {
    if (!text || !text.trim()) return null;
    // drop BOM if present
    if (text.charCodeAt(0) === 0xFEFF) text = text.slice(1);
    const lines = text.split(/\r?\n/);
    if (!lines.length) return null;
    // Sniff delimiter same as main
    const cands = [',',';','\t','|'];
    let bestSep = ','; let bestScore = -Infinity;
    for (const c of cands) {
        const cc = c === '\t' ? '\t' : c;
        const counts = [];
        for (let i=0; i<Math.min(10, lines.length); i++) {
            const parts = (function split(l){
                const out=[];let cur='';let inQ=false;for(let j=0;j<l.length;j++){const ch=l[j];
                    if(ch==='"'){if(inQ && j+1<l.length && l[j+1]==='"'){cur+='"';j++;continue;} inQ=!inQ; continue;}
                    if(!inQ && ch===cc){out.push(cur.trim());cur='';continue;} cur+=ch;}
                out.push(cur.trim()); return out; })(lines[i]);
            counts.push(parts.length);
        }
        const mean = counts.reduce((a,b)=>a+b,0)/counts.length;
        const varr = counts.reduce((a,b)=>a+(b-mean)*(b-mean),0)/counts.length;
        const score = mean - varr;
        if (score > bestScore) { bestScore = score; bestSep = cc; }
    }
    const sep = bestSep;
    const split = (l) => {
        const out=[];let cur='';let inQ=false;for(let j=0;j<l.length;j++){const ch=l[j];
            if(ch==='"'){if(inQ && j+1<l.length && l[j+1]==='"'){cur+='"';j++;continue;} inQ=!inQ; continue;}
            if(!inQ && ch===sep){out.push(cur.trim());cur='';continue;} cur+=ch;}
        out.push(cur.trim());
        return out.map(s=>{s=s||''; if((s.startsWith('"')&&s.endsWith('"'))||(s.startsWith("'")&&s.endsWith("'"))) s=s.slice(1,-1); return s.trim();});
    };
    // Find the Polar header row
    let hdrIdx = -1;
    // 1) Token-based: look for Sample rate + Time + HR-like
    for (let i=0;i<Math.min(lines.length, 500);i++) {
        const toks = split(lines[i]).map(s => (s||'').toLowerCase());
        if (toks.some(x => /^sample\s*rate/.test(x)) &&
            (toks.some(x => x==='time') || toks.some(x => /(\btime\b|timestamp|datetime)/.test(x))) &&
            toks.some(x => /(^hr$|bpm|heart.?rate|pulse|пульс)/.test(x))) { hdrIdx = i; break; }
    }
    // 2) Generic token-based fallback: any header line with time + hr tokens
    if (hdrIdx < 0) {
        for (let i=0;i<Math.min(lines.length, 500);i++) {
            const toks = split(lines[i]);
            const low = toks.map(s => (s||'').toLowerCase());
            const hasTime = low.some(x => /(\btime\b|timestamp|datetime|elapsed|secs?|seconds?)/.test(x));
            const hasHR = low.some(x => /(^hr$|bpm|heart.?rate|pulse|пульс)/.test(x));
            if (hasTime && hasHR) { hdrIdx = i; break; }
        }
    }
    // 3) Raw-line fallback: match substrings regardless of delimiter splitting
    if (hdrIdx < 0) {
        for (let i=0;i<Math.min(lines.length, 500);i++) {
            const raw = (lines[i]||'').toLowerCase().replace(/\s+/g, '');
            const hasTime = raw.includes(',time,') || /time|timestamp|datetime/.test(raw);
            const hasHR = /\bhr\b|hr\(bpm\)|\bbpm\b|heartrate|pulse|пульс/.test(raw);
            if (hasTime && hasHR) { hdrIdx = i; break; }
        }
    }
    if (hdrIdx < 0) return null;
    const header = split(lines[hdrIdx]);
    const H = header.map(h => (h||'').toLowerCase());
    let timeIdx = (() => {
        let i = H.findIndex(h => h === 'time');
        if (i >= 0) return i;
        i = H.findIndex(h => /(\btime\b|timestamp|datetime|elapsed)/.test(h));
        return i;
    })();
    let hrIdx = (() => {
        let i = H.findIndex(h => h === 'hr' || h === 'hr (bpm)' || h === 'hr(bpm)');
        if (i >= 0) return i;
        i = H.findIndex(h => /(^hr$|hr\s*\(bpm\)|\bbpm\b|heart.?rate|pulse|пульс)/.test(h));
        return i;
    })();
    const isTimeLike = (s) => {
        if (!s) return false;
        const v = s.trim();
        if (/^\d{1,2}:\d{2}(?::\d{2})?$/.test(v)) return true;
        const n = Number(v.replace(',', '.'));
        return Number.isFinite(n) && n >= 0 && n <= 24*3600; // seconds
    };
    const isHrLike = (s) => {
        if (!s) return false;
        const n = Number(s.replace(',', '.'));
        return Number.isFinite(n) && n >= 30 && n <= 230;
    };
    if (timeIdx < 0 || hrIdx < 0) {
        // Headerless scanning fallback: pick time-like and HR-like per row
        const tScan = [], hScan = [];
        for (let i=hdrIdx+1; i<lines.length; i++) {
            const row = lines[i]; if (!row || !row.trim()) continue;
            const cells = split(row);
            let tCell = null, hCell = null;
            for (let c=0;c<cells.length;c++) if (isTimeLike(cells[c])) { tCell = cells[c]; break; }
            for (let c=0;c<cells.length;c++) if (isHrLike(cells[c])) { hCell = cells[c]; break; }
            if (!tCell || !hCell) continue;
            const sec = parseTimeToSeconds(tCell);
            const v = Number((hCell||'').replace(',', '.'));
            if (!Number.isFinite(sec) || !Number.isFinite(v)) continue;
            tScan.push(sec); hScan.push(v);
        }
        if (tScan.length) {
            const pairs = tScan.map((x,i)=>({t:x, h:hScan[i]})).sort((a,b)=>a.t-b.t);
            const t0 = pairs[0].t;
            return { t: pairs.map(p=>Math.max(0, p.t - t0)), hr: pairs.map(p=>p.h) };
        }
        return null;
    }
    const t = [], hr = [];
    for (let i=hdrIdx+1; i<lines.length; i++) {
        const row = lines[i];
        if (!row || !row.trim()) continue;
        const cells = split(row);
        let rawT = (cells[timeIdx]||'').trim();
        let rawH = (cells[hrIdx]||'').trim();
        // Per-row fallback if header-based indices fail for this line
        if ((!rawT || !isTimeLike(rawT)) || (!rawH || !isHrLike(rawH))) {
            // scan cells to find best candidates
            let tCand = rawT;
            let hCand = rawH;
            if (!isTimeLike(tCand)) {
                for (let c=0;c<cells.length;c++) { if (isTimeLike(cells[c])) { tCand = cells[c]; break; } }
            }
            if (!isHrLike(hCand)) {
                for (let c=0;c<cells.length;c++) { if (isHrLike(cells[c])) { hCand = cells[c]; break; } }
            }
            rawT = tCand || rawT;
            rawH = hCand || rawH;
        }
        if (!rawH) continue;
        const sec = parseTimeToSeconds(rawT);
        if (!Number.isFinite(sec)) continue;
        const v = Number(rawH.replace(',', '.'));
        if (!Number.isFinite(v)) continue;
        t.push(sec); hr.push(v);
    }
    if (!t.length) {
        // Last-resort fallback: detect a single HR-like column and synthesize 1 Hz time
        // Find most HR-like column by counting HR-like cells in the next ~300 lines
        let bestCol = -1, bestScore = -1;
        for (let c=0;c<(header.length||1);c++) {
            let score = 0;
            for (let i=hdrIdx+1; i<Math.min(lines.length, hdrIdx+1+300); i++) {
                const cc = split(lines[i]);
                const cell = (cc[c]||'').trim();
                if (isHrLike(cell)) score++;
            }
            if (score > bestScore) { bestScore = score; bestCol = c; }
        }
        if (bestCol >= 0 && bestScore > 0) {
            const hrArr = [];
            for (let i=hdrIdx+1; i<lines.length; i++) {
                const cc = split(lines[i]);
                const cell = (cc[bestCol]||'').trim();
                if (!isHrLike(cell)) continue;
                hrArr.push(Number(cell.replace(',', '.')));
            }
            if (hrArr.length) {
                const tArr = Array.from({length: hrArr.length}, (_,k)=>k);
                return { t: tArr, hr: hrArr };
            }
        }
        return null;
    }
    const pairs = t.map((x,i)=>({t:x, h:hr[i]})).sort((a,b)=>a.t-b.t);
    const t0 = pairs[0].t;
    return { t: pairs.map(p=>Math.max(0, p.t - t0)), hr: pairs.map(p=>p.h) };
}

    // Ultra-robust fallback: scan each line, find a time token (mm:ss or hh:mm:ss), then the first HR-like number (30..230)
    // after that time in the same line. Build (time, HR) tuples ignoring everything else.
    function tryParseTimeHrAnywhere(text) {
    if (!text || !text.trim()) return null;
    if (text.charCodeAt(0) === 0xFEFF) text = text.slice(1);
    const lines = text.split(/\r?\n/);
    const t = [], hr = [];
    const timeRe = /(\d{1,2}:\d{2}(?::\d{2})?)/; // captures mm:ss or hh:mm:ss
    // Try to locate the start of the timeseries
    let startIdx = 0;
    for (let i=0;i<lines.length;i++) {
        const raw = (lines[i]||'').toLowerCase();
        if (raw.includes('sample rate') && raw.includes('time')) { startIdx = i+1; break; }
    }
    if (startIdx === 0) {
        // look for the first strict 00:00:00 token as start
        for (let i=0;i<lines.length;i++) {
            if ((lines[i]||'').includes('00:00:00')) { startIdx = i; break; }
        }
    }
    if (startIdx === 0) {
        // fallback: first reasonable time token (<= 1 hour)
        for (let i=0;i<lines.length;i++) {
            const m = (lines[i]||'').match(timeRe);
            if (!m) continue;
            const sec = parseTimeToSeconds(m[1]);
            if (Number.isFinite(sec) && sec <= 3600) { startIdx = i; break; }
        }
    }
    for (let li=startIdx; li<lines.length; li++) {
        const lineRaw = lines[li];
        const line = (lineRaw || '').trim();
        if (!line) continue;
        const m = line.match(timeRe);
        if (!m) continue;
        const timeStr = m[1];
        const sec = parseTimeToSeconds(timeStr);
        // Ignore obviously non-elapsed timestamps like 18:38:04
        if (!Number.isFinite(sec) || sec > 6*3600) continue;
        const rest = line.slice(m.index + timeStr.length);
        // Tokenize rest by common separators and scan for HR-like values (30..230)
        const toks = rest.split(/[\s,;\t|]+/).filter(Boolean);
        let h = null;
        for (const tok of toks) {
            // Skip tokens that still look like a time
            if (/^\d{1,2}:\d{2}(?::\d{2})?$/.test(tok)) continue;
            const val = Number(tok.replace(',', '.'));
            if (Number.isFinite(val) && val >= 30 && val <= 230) { h = Math.round(val); break; }
        }
        if (h == null) continue;
        t.push(sec); hr.push(h);
    }
    if (!t.length) return null;
    const pairs = t.map((x,i)=>({t:x, h:hr[i]})).sort((a,b)=>a.t-b.t);
    const t0 = pairs[0].t;
    return { t: pairs.map(p=>Math.max(0, p.t - t0)), hr: pairs.map(p=>p.h) };
}

    // Robust time parser used across detection and conversion
    function parseTimeToSeconds(raw) {
    if (raw == null) return NaN;
    const s = String(raw).trim();
    if (!s) return NaN;
    // numeric seconds (accept decimal comma)
    const n = Number(s.replace(',', '.'));
    if (Number.isFinite(n)) return n;
    // hh:mm[:ss]
    const m = s.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
    if (m) {
        const hh = m[3] ? parseInt(m[1],10) : 0;
        const mm = m[3] ? parseInt(m[2],10) : parseInt(m[1],10);
        const ss = m[3] ? parseInt(m[3],10) : parseInt(m[2],10);
        return hh*3600 + mm*60 + ss;
    }
    // YYYY-MM-DD HH:mm[:ss] (treat as local time)
    const d1 = s.match(/^(\d{4})[-\/.](\d{2})[-\/.](\d{2})[ T](\d{2}):(\d{2})(?::(\d{2}))?$/);
    if (d1) {
        const y = parseInt(d1[1],10), mo = parseInt(d1[2],10)-1, d = parseInt(d1[3],10);
        const hh = parseInt(d1[4],10), mm = parseInt(d1[5],10), ss = parseInt(d1[6]||'0',10);
        return new Date(y, mo, d, hh, mm, ss).getTime() / 1000;
    }
    // Try ISO/RFC via Date.parse (e.g., 2025-08-23T16:46:43Z)
    const p = Date.parse(s.replace(' ', 'T'));
    if (Number.isFinite(p)) return p/1000;
    return NaN;
}

    function detectColumns(header, rows) {
    const H = header.map(h => (h||'').toString().toLowerCase());
    // candidate indices by name (prioritize true timestamps over generic *time* fields like stance_time)
    let timeIdx = -1;
    const pri = [
        /^(timestamp|datetime|record_timestamp|time_created|start_time)$/,
        /^(date)$/,
        /^(time|time_s|t|elapsed|elapsed_time|secs?|seconds?|sec)$/,
        /(timestamp|datetime)/
    ];
    for (const rx of pri) { const i = H.findIndex(h => rx.test(h)); if (i >= 0) { timeIdx = i; break; } }
    let hrIdx = H.findIndex(h => /(^hr$|heart.?rate|bpm|pulse|пульс)/.test(h));
    const cols = header.length;
    // fallback by data pattern: time monotonic, hr in [30..230]
    const scoreCol = (j) => {
        let n=0, monot=true, prev=null, hrLike=0;
        for (let i=0;i<Math.min(rows.length, 200);i++) {
            const v = (rows[i][j]||'');
            const num = parseTimeToSeconds(v);
            if (!Number.isFinite(num)) continue;
            if (prev!=null && num < prev) monot = false;
            prev = num;
            n++;
        }
        // hrLike score
        for (let i=0;i<Math.min(rows.length, 200);i++) {
            const v = Number((rows[i][j]||'').replace(',', '.'));
            if (Number.isFinite(v) && v>=30 && v<=230) hrLike++;
        }
        return { monot, n, hrLike };
    };
    if (timeIdx < 0 || hrIdx < 0) {
        // scan columns
        let bestTime = {idx:-1, score:-1};
        for (let j=0;j<cols;j++) {
            const s = scoreCol(j);
            const score = (s.monot?2:0) + s.n/200;
            if (score > bestTime.score) bestTime = {idx:j, score};
        }
        if (timeIdx < 0) timeIdx = bestTime.idx;
        if (hrIdx < 0) {
            let bestHr = {idx:-1, score:-1};
            for (let j=0;j<cols;j++) {
                const s = scoreCol(j);
                const score = s.hrLike;
                if (score > bestHr.score && j !== timeIdx) bestHr = {idx:j, score};
            }
            if (bestHr.idx >= 0) hrIdx = bestHr.idx;
            else if (cols > 1) hrIdx = (timeIdx === 0 ? 1 : 0);
            else hrIdx = 0;
        }
    }
    return { timeIdx: Math.max(0,timeIdx), hrIdx: Math.max(0,hrIdx) };
}

    function rowsToSeries(header, rows) {
    if (!rows || !rows.length) return null;
    const { timeIdx, hrIdx } = detectColumns(header, rows);
    const t = [], hr = [];
    for (const r of rows) {
        const rawT = ((r[timeIdx] ?? '') + '').trim();
        const rawHRs = ((r[hrIdx] ?? '') + '').trim();
        if (!rawHRs) continue;
        // parse time using shared helper
        const sec = parseTimeToSeconds(rawT);
        if (!Number.isFinite(sec)) continue;
        // parse HR (accept decimal comma)
        const v = Number(rawHRs.replace(',', '.'));
        if (!Number.isFinite(v)) continue;
        t.push(sec);
        hr.push(v);
    }
    if (!t.length && rows.length && header.length===1) {
        // Single-column HR fallback: assume 1 Hz
        for (let i=0;i<rows.length;i++) {
            const v = Number((rows[i][0]||'').toString().replace(',', '.'));
            if (Number.isFinite(v)) { t.push(i); hr.push(v); }
        }
    }
    if (!t.length) return null;
    // Normalize time start to 0 and sort by time if needed
    const pairs = t.map((x,i)=>({t:x, h:hr[i]})).sort((a,b)=>a.t-b.t);
    const t0 = pairs[0].t;
    const outT = new Array(pairs.length), outH = new Array(pairs.length);
    for (let i=0;i<pairs.length;i++) { outT[i] = Math.max(0, pairs[i].t - t0); outH[i] = pairs[i].h; }
    return { t: outT, hr: outH };
}

    // In-memory store of imported series and global offset (seconds)
    const IMPORTS = [];
    let IMPORT_OFFSET_SEC = (typeof window.IMPORT_OFFSET_SEC === 'number') ? window.IMPORT_OFFSET_SEC : 0;
    let IMPORT_TRIM_START_SEC = (typeof window.IMPORT_TRIM_START_SEC === 'number') ? window.IMPORT_TRIM_START_SEC : 0;
    let IMPORT_TRIM_APPLY_TO_CHART = (typeof window.IMPORT_TRIM_APPLY_TO_CHART === 'boolean') ? window.IMPORT_TRIM_APPLY_TO_CHART : true;

    // Append imported series (CSV/FIT) into the base series array, applying global offset
    function appendImportedSeries(base) {
        try {
            if (!Array.isArray(base)) return;
            const off = Number(IMPORT_OFFSET_SEC) || 0;
            const trim = Math.max(0, Number(IMPORT_TRIM_START_SEC) || 0);
            const applyTrim = !!IMPORT_TRIM_APPLY_TO_CHART;
            for (const imp of IMPORTS) {
                if (!imp || !Array.isArray(imp.t) || !Array.isArray(imp.hr) || imp.t.length !== imp.hr.length) continue;
                let tArr = imp.t;
                let hArr = imp.hr;
                if (applyTrim && trim > 0) {
                    let idx = 0;
                    while (idx < tArr.length && tArr[idx] < trim) idx++;
                    if (idx >= tArr.length) continue; // nothing to show
                    tArr = tArr.slice(idx);
                    hArr = hArr.slice(idx);
                    // normalize trimmed start to 0 for nicer X axis; then apply offset
                    const t0 = trim;
                    const tShifted = tArr.map(x => Math.max(0, (Number(x) || 0) - t0 + off));
                    base.push({ kind: imp.kind || 'CSV', t: tShifted, hr: hArr.slice() });
                } else {
                    const tShifted = off === 0 ? tArr.slice() : tArr.map(x => (Number(x) || 0) + off);
                    base.push({ kind: imp.kind || 'CSV', t: tShifted, hr: hArr.slice() });
                }
            }
        } catch (e) {
            console.warn('appendImportedSeries error', e);
        }
    }

    function importCSVText(name, text) {
    const { header, rows } = parseCSV(text);
    let ser = rowsToSeries(header, rows);
    // Fallback to Polar-specific timeseries parser if generic inference failed
    if (!ser) ser = tryParsePolarTimeseries(text);
    // Last fallback: headerless scan for time + hr anywhere
    if (!ser) ser = tryParseTimeHrAnywhere(text);
    if (!ser) return false;
    IMPORTS.push({ name: name || 'CSV', kind: 'CSV', t: ser.t, hr: ser.hr });
    window.realChart = ser.hr; 
    saveLastStateDebounced();
    return true;
}

    // FIT support: prefer local native parser (fit-import.js). Keep CDN parser as fallback.
    const ENABLE_FIT_IMPORT = true;
    const ENABLE_FIT_CDN_FALLBACK = false;
    function getFitParserCtor() {
    // Try common globals exported by different UMD builds
    const w = window;
    const tryFunc = (x) => (typeof x === 'function') ? x : null;
    const tryObjProp = (obj, prop) => (obj && typeof obj === 'object' && typeof obj[prop] === 'function') ? obj[prop] : null;
    let ctor = null;
    ctor = ctor || tryFunc(w.FitParser);
    ctor = ctor || tryFunc(w.FitFileParser);
    ctor = ctor || tryObjProp(w, 'fitFileParser');
    ctor = ctor || tryObjProp(w.fitFileParser, 'default');
    ctor = ctor || tryObjProp(w.fitFileParser, 'FitParser');
    ctor = ctor || tryFunc(w.fitFileParser);
    ctor = ctor || tryFunc(w.fit_file_parser);
    ctor = ctor || tryFunc(w.fitparser);
    return ctor || null;
}
    function loadScript(url) {
    return new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.src = url; s.async = true;
        s.onload = () => resolve();
        s.onerror = (e) => reject(e);
        document.head.appendChild(s);
    });
}
    async function ensureFitParserLoaded() {
    if (getFitParserCtor()) return true;
    try {
        // Try several CDNs/versions to improve chances in case of a transient failure
        const urls = [
            'https://cdn.jsdelivr.net/npm/fit-file-parser@1.10.0/dist/fit-file-parser.min.js',
            'https://cdn.jsdelivr.net/npm/fit-file-parser/dist/fit-file-parser.min.js',
            'https://unpkg.com/fit-file-parser@1.10.0/dist/fit-file-parser.min.js',
            'https://unpkg.com/fit-file-parser/dist/fit-file-parser.min.js'
        ];
        for (const u of urls) {
            try { await loadScript(u); if (getFitParserCtor()) return true; } catch (_) { /* keep trying */ }
        }
        return false;
    } catch (_) {
        return false;
    }
}
    async function importFITBuffer(name, arrayBuffer) {
    // 1) Prefer local native parser (fit-import.js)
    try {
        const p = window?.FitHrParser?.parseFitHr;
        if (typeof p === 'function') {
            const res = p(arrayBuffer);
            if (res && Array.isArray(res.t) && Array.isArray(res.hr) && res.t.length && res.t.length === res.hr.length) {
                IMPORTS.push({ name: name || 'FIT', kind: 'FIT', t: res.t, hr: res.hr });
                saveLastStateDebounced();
                return { ok: true, via: 'native' };
            }
        }
    } catch (e) {
        console.error('FIT native parse error', e);
        // fall through
    }

    // 2) Optional CDN fallback (disabled by default)
    if (!ENABLE_FIT_CDN_FALLBACK) return { ok: false, reason: 'native-failed' };
    const ok = await ensureFitParserLoaded();
    if (!ok) return { ok: false, reason: 'loader' };
    try {
        const Ctor = getFitParserCtor();
        if (!Ctor) return { ok: false, reason: 'no-global' };
        const parser = new Ctor({ force: true, speedUnit: 'm/s', lengthUnit: 'm', temperatureUnit: 'celsius', elapsedRecordField: true, mode: 'cascade' });
        const data = await new Promise((resolve, reject) => {
            try {
                parser.parse(arrayBuffer, (err, out) => err ? reject(err) : resolve(out));
            } catch (e) { reject(e); }
        });
        let recs = (data && (data.records || data.activityRecords)) || [];
        if (!Array.isArray(recs) || recs.length===0) {
            const laps = (((data||{}).activity||{}).sessions||[]).flatMap(s => (s.laps||[]));
            recs = laps.flatMap(l => l.records||[]);
        }
        const t = [], hr = [];
        let t0StartMs = null;
        for (const r of recs) {
            const h = r.heart_rate ?? r.heartRate ?? r.hr ?? null;
            const ts = r.timestamp || r.time_created || r.record_timestamp || null;
            if (h == null || ts == null) continue;
            const tsMs = (ts instanceof Date) ? ts.getTime() : (typeof ts === 'number' ? (ts*1000) : Date.parse(ts));
            if (!Number.isFinite(tsMs)) continue;
            if (t0StartMs === null) t0StartMs = tsMs;
            const sec = Math.max(0, (tsMs - t0StartMs) / 1000);
            t.push(sec);
            hr.push(+h);
        }
        if (t.length === 0) return { ok: false, reason: 'nohr' };
        const pairs = t.map((x,i)=>({t:x, h:hr[i]})).sort((a,b)=>a.t-b.t);
        const tStart = pairs[0].t;
        const outT = new Array(pairs.length), outH = new Array(pairs.length);
        for (let i=0;i<pairs.length;i++) { outT[i] = Math.max(0, pairs[i].t - tStart); outH[i] = pairs[i].h; }
        IMPORTS.push({ name: name || 'FIT', kind: 'FIT', t: outT, hr: outH });
        saveLastStateDebounced();
        return { ok: true, via: 'cdn' };
    } catch (e) {
        console.error('FIT parse error', e);
        return { ok: false, reason: 'parse' };
    }
}

    // Extend rendering to include imports
    const _seriesFromParams = seriesFromParams;
    seriesFromParams = function (p) {
    const base = _seriesFromParams(p);
    appendImportedSeries(base);
    return base;
}

    function syncZarUniversalRestEffUI() {
        try {
            const kin = String($("zarKinU")?.value || 'hiit').toLowerCase();
            const sitLike = (kin === 'sit');
            const el = $("zarRestEffU");
            const lab = $("labZarRestEffU");
            if (el) {
                el.disabled = sitLike;
                el.style.opacity = sitLike ? "0.45" : "1";
            }
            if (lab) lab.style.opacity = sitLike ? "0.55" : "1";
        } catch (_) {}
    }

    function render() {
    const p = getParams();
    syncZarUniversalRestEffUI();
    // Show dynamic placeholder for HRmax when auto (empty input): "auto 175" or "авто 175"
    const hrMaxEl = $("hrMax");
    if (hrMaxEl) {
        if (!hrMaxEl.value) {
            const age = +($("age")?.value || p.age || 35);
            const sportLevel = $("sportLevel")?.value || p.sportLevel || 'general';
            const auto = predictedMaxHRFromAge(age, sportLevel);
            hrMaxEl.placeholder = (LANG === 'ru' ? 'авто ' : 'auto ') + String(auto);
        } else {
            hrMaxEl.placeholder = '';
        }
    }

    // Inline reminder: show only when HRmax is not explicitly provided.
    const capHrMaxAuto = $("capHrMaxAuto");
    if (capHrMaxAuto && hrMaxEl) {
        capHrMaxAuto.style.display = (!hrMaxEl.value) ? 'block' : 'none';
    }
    $("ageV").textContent = p.age + " y"; $("tauOnV").textContent = p.tauOn + " s"; $("tauOffV").textContent = p.tauOff + " s"; $("warmV").textContent = p.warmup + " min"; $("coolV").textContent = p.cooldown + " min"; $("driftV").textContent = p.drift10 + " bpm/10min";
    if ($("postV")) $("postV").textContent = (Number.isFinite(+p.postRest) ? (+p.postRest) : 0) + " min";
    $("sitWorkV").textContent = p.sit.work + " s"; $("sitRestV").textContent = p.sit.rest + " s"; $("sitNV").textContent = p.sit.n; $("sitEffV").textContent = (+p.sit.eff).toFixed(1) + "/10";
    $("hiitWorkV").textContent = p.hiit.work + " s"; $("hiitRestV").textContent = p.hiit.rest + " s"; $("hiitNV").textContent = p.hiit.n; $("hiitEffV").textContent = (+p.hiit.eff).toFixed(1) + "/10";
    if ($("hiitRestEffV")) $("hiitRestEffV").textContent = (p.hiit.restFrac <= 0 ? "0.0" : (+(p.hiit.restFrac*20).toFixed(1))) + "/10";
    // Zaruba: show values for both sets (safe), active mode controls are visible
    const zMode = (p.zarMode === 'universal' || p.zar?.mode === 'universal') ? 'universal' : 'classic';
    const zC = p.zarClassic || (zMode === 'classic' ? p.zar : null) || {};
    const zU = p.zarUniversal || (zMode === 'universal' ? p.zar : null) || {};
    {
        const dC = (zC.dur ?? 300);
        const mC = Math.floor(dC/60), sC = dC%60;
        if ($("zarDurVC")) $("zarDurVC").textContent = `${mC}m ${String(sC).padStart(2,'0')}s`;
        if ($("zarOnVC")) $("zarOnVC").textContent = (zC.on ?? 30) + " s";
        if ($("zarOffVC")) $("zarOffVC").textContent = (zC.off ?? 30) + " s";
        if ($("zarEffVC")) $("zarEffVC").textContent = (Number.isFinite(+zC.eff) ? (+zC.eff) : 8).toFixed(1) + "/10";
    }
    {
        const dU = (zU.dur ?? 300);
        const mU = Math.floor(dU/60), sU = dU%60;
        if ($("zarDurVU")) $("zarDurVU").textContent = `${mU}m ${String(sU).padStart(2,'0')}s`;
        if ($("zarOnVU")) $("zarOnVU").textContent = (zU.on ?? 30) + " s";
        if ($("zarOffVU")) $("zarOffVU").textContent = (zU.off ?? 30) + " s";
        if ($("zarEffVU")) $("zarEffVU").textContent = (Number.isFinite(+zU.eff) ? (+zU.eff) : 8).toFixed(1) + "/10";
        if ($("zarRestEffVU")) $("zarRestEffVU").textContent = ((+zU.restFrac || 0) <= 0 ? "0.0" : (+(+zU.restFrac*20).toFixed(1))) + "/10";
    }

    // Keep Optimize button label in sync with current Duration.
    try { _zarUpdateOptimizeBtnLabel(); } catch (_) {}
    if ($("zarPatBadge") || $("zarPatHint") || $("zarPatPreview")) {
    const hasPat = Array.isArray(p.zar?.pattern) && p.zar.pattern.length > 0;
    if ($("zarPatBadge")) {
    const n = hasPat ? p.zar.pattern.length : 0;
    $("zarPatBadge").textContent = hasPat ? (LANG==='ru' ? 'Своя' : 'Custom') : "—";
    $("zarPatBadge").style.opacity = hasPat ? "1" : ".6";
    try {
        $("zarPatBadge").title = hasPat
            ? (LANG==='ru' ? `Своя схема (${n} сегм.)` : `Custom pattern (${n} seg)`)
            : (LANG==='ru' ? 'Схема не задана' : 'No custom pattern');
    } catch (_) {}
}
    if ($("zarPatHint")) {
    $("zarPatHint").textContent = hasPat ? (LANG==='ru' ? "Схема перекрывает On/Off" : "Pattern overrides On/Off") : "";
}
    if ($("zarPatPreview")) {
    if (hasPat) {
    const pairs = (typeof window.formatZarPatternSegments === 'function')
        ? window.formatZarPatternSegments(p.zar.pattern.slice(0,4), { lang: LANG }).split(' ').join(', ')
        : p.zar.pattern.slice(0,4).map(s=>`${s.on}/${s.off}`).join(', ');
    const more = p.zar.pattern.length > 4 ? (LANG==='ru' ? ' …ещё' : ' …more') : '';
    $("zarPatPreview").textContent = (LANG==='ru' ? 'Просмотр: ' : 'Preview: ') + `[${pairs}]` + more;
} else {
    $("zarPatPreview").textContent = '';
}
}

    // Zaruba predicted max reps (reps model)
    try {
        const hasSim = (typeof window.simulateZarubaReps === 'function') || (typeof window.SimCore?.simulateZarubaReps === 'function');
        const simFn = (typeof window.simulateZarubaReps === 'function') ? window.simulateZarubaReps : window.SimCore?.simulateZarubaReps;
        const modeNow = (p.zarMode === 'universal' || p.zar?.mode === 'universal') ? 'universal' : 'classic';
        const restEff10 = (modeNow === 'universal')
            ? ((String($("zarKinU")?.value || 'hiit').toLowerCase() === 'sit') ? 0 : (+($("zarRestEffU")?.value || 0)))
            : 0;
        const dur = (modeNow === 'universal')
            ? (Number.isFinite(+zU.dur) ? +zU.dur : 300)
            : (Number.isFinite(+zC.dur) ? +zC.dur : 300);
        const hasPat = Array.isArray(p.zar?.pattern) && p.zar.pattern.length > 0;
        const baseSeg = (modeNow === 'universal')
            ? { on: (zU.on ?? 30), off: (zU.off ?? 30), eff: (Number.isFinite(+zU.eff) ? +zU.eff : 5.0), restEff: restEff10 }
            : { on: (zC.on ?? 30), off: (zC.off ?? 30), eff: (Number.isFinite(+zC.eff) ? +zC.eff : 8.5), restEff: restEff10 };
        const pattern = hasPat ? p.zar.pattern : [baseSeg];

        const model = {
            allOutSec: +($("zarOptAllOut")?.value || 45),
            cadenceMaxRpm: +($("zarOptCad")?.value || 20),
            recTauSec: +($("zarOptRec")?.value || 30),
            switchCostSec: +($("zarOptSwitch")?.value || 1),
            tempoFatiguePow: +($("zarOptTempoPow")?.value || 1.4),
            defaultRestEff10: restEff10
        };

        if (!hasSim || typeof simFn !== 'function') {
            if ($("zarRepsEst")) $("zarRepsEst").textContent = '';
            if ($("zarOptPreview")) $("zarOptPreview").textContent = '';
        } else {
            const sim = simFn(pattern, dur, model);
            const modelReps = sim.reps;
            const label = (LANG === 'ru') ? 'Прогноз повторений' : 'Predicted reps';
            const unit = (LANG === 'ru') ? 'повторов' : 'reps';
            const durHint = (dur === 300)
                ? (LANG === 'ru' ? 'за 5:00' : 'for 5:00')
                : (LANG === 'ru' ? `за ${Math.round(dur)}s` : `for ${Math.round(dur)}s`);
            if ($("zarRepsEst")) {
                $("zarRepsEst").textContent = `${label}: ${modelReps} ${unit} (${durHint})`;
            }
        }
    } catch(_) {}
}
    // (zarEffVC/zarEffVU handled above)
    $("z2MinV").textContent = p.z2.min + " min"; $("z2FracV").textContent = Math.round(p.z2.frac * 100) + "%"; $("z34MinV").textContent = p.z34.min + " min"; $("z34FracV").textContent = Math.round(p.z34.frac * 100) + "%";
    if ($("snMinV")) $("snMinV").textContent = (p.sn?.min ?? 10) + " min";
    if ($("snWeightV")) $("snWeightV").textContent = (p.sn?.weight ?? 16) + " kg";
    if ($("snCadV")) $("snCadV").textContent = (p.sn?.cad ?? 20) + " rpm";
    if ($("swMinV")) $("swMinV").textContent = (p.sw?.min ?? 14) + " min";
    if ($("swEffV")) $("swEffV").textContent = (Number.isFinite(+p.sw?.eff) ? (+p.sw.eff) : 8.5).toFixed(1) + "/10";
    if ($("swWeightV")) $("swWeightV").textContent = (p.sw?.weight ?? 20) + " kg";
    // Toggle Change-at control for protocol
    try {
        const style = $("swStyle")?.value || 'universal';
        const prot = $("swProt")?.value || 'classic';
        const protWrap = $("swProtWrap");
        const changeWrap = $("swChangeWrap");
        const protEl = $("swProt");
        const changeEl = $("swChangeMin");

        if (style === 'overhead2h') {
            if (protWrap) protWrap.style.display = 'none';
            if (changeWrap) changeWrap.style.display = 'none';
            if (protEl) protEl.disabled = true;
            if (changeEl) changeEl.disabled = true;
        } else {
            if (protWrap) protWrap.style.display = '';
            if (protEl) protEl.disabled = false;
            if (changeEl) changeEl.disabled = false;
            if (changeWrap) changeWrap.style.display = (prot === 'classic' ? '' : 'none');
        }
    } catch(_){}
    updateZonesUI(p.hrRest, p.hrMax, p.useHRR);
    const series = seriesFromParams(p);
    if (series.length) {
        drawChart($("chart"), series);
        overlayZones($("chart"), series);
        try { if (typeof overlayTauMarkers === 'function') overlayTauMarkers($("chart"), series); } catch(_){ }
        drawLegend($("legend"), series)
    } else { $("chart").innerHTML = ""; $("legend").innerHTML = "<span class='caption'>—</span>" }
    const rows = buildMetrics(p);
    const colors = { [I18N[LANG].meth.SIT]: "var(--sit)", [I18N[LANG].meth.HIIT]: "var(--hiit)", [I18N[LANG].meth.SN]: "var(--sn)", [I18N[LANG].meth.SW]: "var(--sw)", [I18N[LANG].meth.Z2]: "var(--z2)", [I18N[LANG].meth.Z34]: "var(--z34)", [I18N[LANG].meth.STR]: "var(--str)", [I18N[LANG].meth.ZRB]: "var(--zaruba)" };
    const _tzMethCss = { SIT: "var(--sit)", HIIT: "var(--hiit)", SN: "var(--sn)", SW: "var(--sw)", Z2: "var(--z2)", Z34: "var(--z34)", STR: "var(--str)", ZRB: "var(--zaruba)" };
    const _tzMethCodeFromLabel = (label) => {
        try {
            const m = I18N?.[LANG]?.meth || {};
            for (const k of Object.keys(m)) {
                if (m[k] === label) return k;
            }
        } catch (_) {}
        return "";
    };
    const _tzShownMethods = (() => {
        try { return (typeof selectedMethods === 'function') ? (selectedMethods() || {}) : {}; } catch (_) { return {}; }
    })();
    const _tzActiveMeth = (() => {
        try { return (typeof _tzActiveMethodKey === 'function') ? (_tzActiveMethodKey() || "") : ""; } catch (_) { return ""; }
    })();
        const tb = $("tblBody"); tb.innerHTML = "";
        for (const r of rows) {
                const tr = document.createElement("tr");
                tr.innerHTML = `<td><span style="color:${colors[r.m] || '#cbd5e1'};font-weight:600">${r.m}</span></td>
                    <td class="mono">${r.typ}</td><td class="mono">${fmtTime(r.time)}</td><td class="mono">${r.wr}</td>
                    <td>${pill(r.hrr, "high-good")}</td><td>${pill(r.fast, "high-good")}</td><td>${pill(r.bdnf, "high-good")}</td>
                    <td>${pill(r.cort, "low-good")}</td><td>${pill(r.cardio, "low-good")}</td><td>${pill(r.inj, "low-good")}</td><td>${pill(r.eff, "high-good")}</td>
                    <td class="mono">${(r.load ?? '')}</td><td class="mono">${(r.zload ?? '')}</td><td class="mono">${(r.calories ?? '')}</td>`;

                // Mark row with method code and highlight if active / additionally shown
                (function(){
                    const code = _tzMethCodeFromLabel(r.m);
                    if (code) {
                        tr.dataset.m = code;
                        const css = _tzMethCss[code];
                        if (css) tr.style.setProperty('--tzMethColor', css);
                        const isShown = !!_tzShownMethods[code];
                        const isActive = (code === _tzActiveMeth);
                        if (isShown) tr.classList.add('tzMethShown');
                        if (isActive) tr.classList.add('tzMethActive');
                    }
                })();

                // append info icon safely via DOM
                (function () {
                        const td0 = tr.querySelector("td:first-child");
                        if (!td0) return;
                        const icon = document.createElement("span");
                        icon.className = "infoIcon";
                        icon.textContent = "ℹ";
                        icon.title = (LANG === "ru" ? "Подробнее" : "Info");
                        let code = "";
                        if (r.m === I18N[LANG].meth.SIT) code = "SIT";
                        else if (r.m === I18N[LANG].meth.HIIT) code = "HIIT";
                        else if (r.m === I18N[LANG].meth.SN) code = "SN";
            else if (r.m === I18N[LANG].meth.Z2) code = "Z2";
                        else if (r.m === I18N[LANG].meth.Z34) code = "Z34";
                        else if (r.m === I18N[LANG].meth.STR) code = "STR";
                        else if (r.m === I18N[LANG].meth.ZRB) code = "ZRB";
            else if (r.m === I18N[LANG].meth.SW) code = "SW";
                        icon.dataset.m = code;
                        td0.appendChild(icon);
                })();

                tb.appendChild(tr);
        }
    // if modal is open, refresh big chart too
    if ($("modal").classList.contains("show")) drawBigChart();
    // Ensure compact editor stays in sync with language (labels) and selection
    try { setupEditMethodDropdown(); } catch(_){}
    saveLastStateDebounced();
}

    (() => {
    const _origRender = render;
    let raf = 0;
    window.render = function throttledRender() {
    if (raf) return;
    raf = requestAnimationFrame(() => { raf = 0; _origRender(); });
};
})();

    // ---------- CSV / share / print ----------
    function exportMetricsCSV() {
    const p = getParams(), rows = buildMetrics(p), hdr = I18N[LANG].csvHdr; let csv = hdr.join(",") + "\n";
    // If load is present, extend header and rows with Load (AU)
    let hasLoad = rows.some(r => typeof r.load !== 'undefined');
    let hasZLoad = rows.some(r => typeof r.zload !== 'undefined');
    let header = hdr.slice();
    if (hasLoad && header.indexOf('Load (AU)') === -1 && header.indexOf('Нагрузка (AU)') === -1) {
    header.push(LANG==='ru' ? 'Нагрузка (AU)' : 'Load (AU)');
}
    if (hasZLoad && header.indexOf('Zonal load') === -1 && header.indexOf('Зонная нагрузка') === -1) {
    header.push(LANG==='ru' ? 'Зонная нагрузка' : 'Zonal load');
}
    csv = header.join(',') + '\n';
    rows.forEach(r => {
    const base = `${r.m},${r.typ},${r.time},${r.wr},${r.hrr},${r.fast},${r.bdnf},${r.cort},${r.cardio},${r.inj},${r.eff}`;
    let line = base;
    if (hasLoad) line += `,${r.load ?? ''}`;
    if (hasZLoad) line += `,${r.zload ?? ''}`;
    csv += line + "\n";
});
    download(I18N[LANG].csvMetrics, csv);
}
    function exportSeriesCSV() {
    const p = getParams(), series = seriesFromParams(p);
    const maxLen = Math.max(...series.map(s => s.t.length), 0);
    const timeBase = series.reduce((best, s) => (s.t.length > best.length ? s.t : best), (series[0]?.t || []));
    let header = "time_s";
    ["SIT", "HIIT", "SN", "SW", "Z2", "Z34", "ZRB"].forEach(code => { if (series.find(s => s.kind === code)) header += `,` + code + "_HR"; });
    let csv = header + "\n";
    for (let i = 0; i < maxLen; i++) {
    let row = S(timeBase[i] ?? (i || 0));
    ["SIT", "HIIT", "SN", "SW", "Z2", "Z34", "ZRB"].forEach(code => {
    const s = series.find(v => v.kind === code);
    row += "," + (s?.hr[i] !== undefined ? s.hr[i].toFixed(2) : "");
});
    csv += row + "\n";
}
    download(I18N[LANG].csvSeries, csv);
}
    
    function applyState(s) {
    if (!s) return;
    const setNum = (id, raw) => {
        const el = $(id);
        if (!el) return;
        const v = +raw;
        if (Number.isFinite(v)) { el.value = String(v); return; }
        const dv = +(el.defaultValue);
        if (Number.isFinite(dv)) el.value = String(dv);
    };
    if (s.LANG && !URL_LANG_LOCKED) { LANG = s.LANG; try { localStorage.setItem("sit_lang", LANG); } catch (_) {} }
    // Restore HRmax formula selection early so downstream fallbacks use the right formula
    if ($("sportLevel") && s.sportLevel) {
    try { $("sportLevel").value = s.sportLevel; } catch(_){}
}
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
    setNum("tauOn", s.tauOn);
    setNum("tauOff", s.tauOff);
    setNum("warmup", s.warmup);
    setNum("cooldown", s.cooldown);
    if ($("postRest")) setNum("postRest", (typeof s.postRest !== 'undefined' ? s.postRest : 3));
    setNum("drift10", s.drift10);
    $("useHRR").checked = !!s.useHRR;
    if ($("trimpSex")) { $("trimpSex").value = (s.trimpSex === 'f' ? 'f' : 'm'); }
    if ($("bodyWeight") && (typeof s.bodyWeight !== 'undefined' || typeof s.bodyWeightKg !== 'undefined')) {
        $("bodyWeight").value = String((typeof s.bodyWeight !== 'undefined') ? s.bodyWeight : s.bodyWeightKg);
    }
    // Back-compat: eff may be stored as fraction (0..1) or as RPE (6..10)
    const sitEffStored = s.sit.eff;
    const hiitEffStored = s.hiit.eff;
    const toRPE = (v) => (v <= 1.0 ? (6 + 4 * v) : v);
    $("sitWork").value = s.sit.work; $("sitRest").value = s.sit.rest; $("sitN").value = s.sit.n; $("sitEff").value = toRPE(sitEffStored);
    $("hiitWork").value = s.hiit.work; $("hiitRest").value = s.hiit.rest; if($("hiitRestEff")) $("hiitRestEff").value = String(Math.max(0, Math.min(10, +(s.hiit.restFrac||0)*20))); $("hiitN").value = s.hiit.n; $("hiitEff").value = toRPE(hiitEffStored);
    $("z2Min").value = s.z2.min; $("z2Frac").value = s.z2.frac * 100; $("z34Min").value = s.z34.min; $("z34Frac").value = s.z34.frac * 100;

    if (s.sn) {
        if($("snMin")) $("snMin").value = (s.sn?.min ?? s.snMin ?? 10);
        if($("snWeight")) $("snWeight").value = (s.sn.weight ?? 16);
        if($("snCad")) $("snCad").value = (s.sn.cad ?? 20);
        if($("snProt")) $("snProt").value = (s.sn.prot || 'classic');
        if($("snChangeMin")) $("snChangeMin").value = (s.sn.changeMin ?? 5);
    }
    // Back-compat: some older states may store snMin at top-level without sn{}
    if (!s.sn && typeof s.snMin !== 'undefined') {
        if($("snMin")) $("snMin").value = (s.snMin ?? 10);
    }
    if (s.sw) {
        if($("swMin")) $("swMin").value = (s.sw.min ?? 14);
            if($("swEff")) $("swEff").value = (s.sw.eff <= 1.0 ? (2 + 8 * s.sw.eff) : s.sw.eff);
            if($("swWeight")) $("swWeight").value = (s.sw.weight ?? 20);
        if($("swStyle")) $("swStyle").value = (s.sw.style || 'universal');
        if($("swProt")) $("swProt").value = (s.sw.prot || 'classic');
        if($("swChangeMin")) $("swChangeMin").value = (s.sw.changeMin ?? Math.max(1, (s.sw.min||14)/2));
    }

    // Restore Zaruba (Classic/Universal independent)
    try {
        const mode = (s.zarMode === 'universal' || s.zar?.mode === 'universal') ? 'universal' : 'classic';
        if($("zarMode")) $("zarMode").value = mode;
        const applyOne = (src, ids, effMode) => {
            if (!src || typeof src !== 'object') return;
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
                        ? window.formatZarPatternSegments(src.pattern, { lang: LANG })
                        : src.pattern.map(seg=>`${seg.on}/${seg.off}`).join(' ');
                } else {
                    $(ids.pat).value = '';
                }
            }
        };
        if (s.zarClassic) applyOne(s.zarClassic, { dur:'zarDurC', on:'zarOnC', off:'zarOffC', eff:'zarEffC', pat:'zarPatternC' }, 'classic');
        if (s.zarUniversal) applyOne(s.zarUniversal, { dur:'zarDurU', on:'zarOnU', off:'zarOffU', eff:'zarEffU', pat:'zarPatternU' }, 'universal');
        if (!s.zarClassic && !s.zarUniversal && s.zar) {
            const m = (s.zar.mode === 'universal') ? 'universal' : 'classic';
            if (m === 'universal') applyOne(s.zar, { dur:'zarDurU', on:'zarOnU', off:'zarOffU', eff:'zarEffU', pat:'zarPatternU' }, 'universal');
            else applyOne(s.zar, { dur:'zarDurC', on:'zarOnC', off:'zarOffC', eff:'zarEffC', pat:'zarPatternC' }, 'classic');
        }
    } catch(_) {}

    // Restore Zaruba optimizer (performance model tuning)
    try {
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
    } catch(_) {}

    // Restore Zaruba optimizer panel extras
    try {
        if (typeof s.zarTargetReps !== 'undefined' && $("zarTargetReps")) {
            const v = Math.max(1, Math.min(999, Math.floor(+s.zarTargetReps || 0)));
            $("zarTargetReps").value = String(v);
        }
    } catch(_) {}
    try {
        if (typeof s.zarBeepVol !== 'undefined' && $("zarBeepVol")) {
            const v = Math.max(0, Math.min(100, +s.zarBeepVol || 0));
            $("zarBeepVol").value = String(v);
            try { if (_zarBeeper?.gain) _zarBeeper.gain.gain.value = _zarBeepVol(); } catch(_) {}
        }
    } catch(_) {}

    // Safety: if URL requested lang explicitly, re-apply it after state restore.
    // (Some callers may apply language later; this ensures the visible UI follows the URL.)
    try {
        const v = new URLSearchParams(window.location.search || '').get('lang');
        if (v === 'ru' || v === 'en') {
            LANG = v;
            try { localStorage.setItem('sit_lang', LANG); } catch (_) {}
        }
    } catch (_) {}
    setSelectedMethods({ SIT: !!s.chkSIT, HIIT: !!s.chkHIIT, ZRB: !!s.chkZRB, SN: !!s.chkSN, SW: !!s.chkSW, Z2: !!s.chkZ2, Z34: !!s.chkZ34 });
    updateMethodDropdownLabels();
    // do NOT call setText/render here; initApp will do that once at the end
    if (s.groups) {
    if ($("detAdv")) $("detAdv").open = !!s.groups.adv;
    if ($("detCtlIntervals")) $("detCtlIntervals").open = !!s.groups.intervals;
    if ($("detCtlSteady")) $("detCtlSteady").open = !!s.groups.steady;
    if ($("detInputs")) $("detInputs").open = !!s.groups.inputs;
    if ($("detZarOpt")) $("detZarOpt").open = !!s.groups.zarOpt;
}
    updatePercentLabels();
        // Import offset (persisted)
        if (typeof s.impOffset !== 'undefined') {
            IMPORT_OFFSET_SEC = Number(s.impOffset) || 0;
            if ($("impOffset")) $("impOffset").value = String(IMPORT_OFFSET_SEC);
            if ($("impOffsetRange")) $("impOffsetRange").value = String(Math.max(+$("impOffsetRange").min, Math.min(+$("impOffsetRange").max, IMPORT_OFFSET_SEC)));
        }
        // Import trim (persisted)
        if (typeof s.impTrimStart !== 'undefined') {
            IMPORT_TRIM_START_SEC = Math.max(0, Number(s.impTrimStart) || 0);
            if ($("impTrimStart")) $("impTrimStart").value = String(IMPORT_TRIM_START_SEC);
            if ($("impTrimRange")) $("impTrimRange").value = String(Math.max(+$("impTrimRange").min, Math.min(+$("impTrimRange").max, IMPORT_TRIM_START_SEC)));
        }
        if (typeof s.impTrimApply !== 'undefined') {
            IMPORT_TRIM_APPLY_TO_CHART = !!s.impTrimApply;
            if ($("impTrimAffectsChart")) $("impTrimAffectsChart").checked = IMPORT_TRIM_APPLY_TO_CHART;
        }

        // Restore Zaruba Big Screen settings (persisted in sit_last)
        try {
            const bs = (s.zarScreen && typeof s.zarScreen === 'object') ? s.zarScreen : null;
            const get = (k, fb) => (bs && typeof bs[k] !== 'undefined') ? bs[k] : (typeof s[k] !== 'undefined' ? s[k] : fb);

            if ($("zarScreenCountUp") && typeof get('countUp', null) !== 'object') {
                const v = get('countUp', null);
                if (v !== null && typeof v !== 'undefined') $("zarScreenCountUp").checked = !!v;
            }
            if ($("zarScreenVoice") && typeof get('voice', null) !== 'object') {
                const v = get('voice', null);
                if (v !== null && typeof v !== 'undefined') $("zarScreenVoice").checked = !!v;
            }
            if ($("zarScreenVoiceReps") && typeof get('voiceReps', null) !== 'object') {
                const v = get('voiceReps', null);
                if (v !== null && typeof v !== 'undefined') $("zarScreenVoiceReps").checked = !!v;
            }
            if ($("zarScreenMetro") && typeof get('metro', null) !== 'object') {
                const v = get('metro', null);
                if (v !== null && typeof v !== 'undefined') $("zarScreenMetro").checked = !!v;
            }
            if ($("zarScreenCountdownSec")) {
                const v = get('countdownSec', get('zarScreenCountdownSec', undefined));
                if (typeof v !== 'undefined') $("zarScreenCountdownSec").value = String(v);
            }
            if ($("zarScreenMetroRpm")) {
                const v = get('metroRpm', get('zarScreenMetroRpm', undefined));
                if (typeof v !== 'undefined') $("zarScreenMetroRpm").value = String(v);
            }
            if ($("zarScreenMetroHz")) {
                const v = get('metroHz', get('zarScreenMetroHz', undefined));
                if (typeof v !== 'undefined') $("zarScreenMetroHz").value = String(v);
            }
            if ($("zarScreenMetroVol")) {
                const v = get('metroVol', get('zarScreenMetroVol', undefined));
                if (typeof v !== 'undefined') $("zarScreenMetroVol").value = String(v);
            }

            // Reflect voice setting immediately when the modal is open but not running.
            try {
                if (_zarScreen?.open && !_zarScreen?.running) _zarScreenSetEff('rest', 0);
            } catch(_) {}
        } catch(_) {}
}
    let _saveLastTimer = 0;
    function saveLastStateDebounced() {
    clearTimeout(_saveLastTimer);
    _saveLastTimer = setTimeout(() => {
    try { localStorage.setItem("sit_last", JSON.stringify(currentState())); } catch (_) { }
}, 150);
}

    // Load last state if no URL state/preset
    function tryLoadLastState() {
    try {
    const raw = localStorage.getItem("sit_last");
    if (!raw) return false;
    const st = JSON.parse(raw);
    applyState(st);
    AUTO_TUNE_Z2 = false;  // respect saved target
    return true;
} catch (_) { return false; }
}
    function copyStateLink() {
    const st = currentState();
    let url;
    try {
        if (typeof window.buildShareUrlForState === 'function') {
            url = window.buildShareUrlForState(st);
        } else {
            const b64 = btoa(unescape(encodeURIComponent(JSON.stringify(st))));
            const origin = (location.origin && location.origin !== 'null') ? location.origin : '';
            const base = origin ? `${origin}${location.pathname}` : location.href.split('?')[0].split('#')[0];
            url = `${base}#s=${encodeURIComponent(b64)}`;
        }
    } catch (_) {
        const b64 = btoa(unescape(encodeURIComponent(JSON.stringify(st))));
        const origin = (location.origin && location.origin !== 'null') ? location.origin : '';
        const base = origin ? `${origin}${location.pathname}` : location.href.split('?')[0].split('#')[0];
        url = `${base}#s=${encodeURIComponent(b64)}`;
    }

    navigator.clipboard?.writeText(url).then(() => { $("btnShare").textContent = I18N[LANG].linkCopied; setTimeout(() => { $("btnShare").textContent = t("share") }, 1500); })
    .catch(() => { prompt(LANG === "ru" ? "Скопируйте ссылку вручную:" : "Copy link manually:", url); });
}

function _shareBaseUrl() {
    const origin = (location.origin && location.origin !== 'null') ? location.origin : '';
    if (origin) return `${origin}${location.pathname}${location.search || ''}`;
    // file:// or other edge cases
    const noHash = location.href.split('#')[0];
    return noHash;
}

function _buildZarSchemeShareUrl() {
    const mode = (String($("zarMode")?.value || 'classic').toLowerCase() === 'universal') ? 'universal' : 'classic';
    const durId = (mode === 'universal') ? 'zarDurU' : 'zarDurC';
    const offId = (mode === 'universal') ? 'zarOffU' : 'zarOffC';
    const patId = (mode === 'universal') ? 'zarPatternU' : 'zarPatternC';

    const dur = Math.max(1, Math.floor(+($(durId)?.value || 300)));
    const off = Math.max(0, Math.floor(+($(offId)?.value || 30)));
    const pat = String($(patId)?.value || '').trim();

    const hp = new URLSearchParams();
    hp.set('zrb', '1');
    hp.set('mode', mode);
    hp.set('dur', String(dur));
    hp.set('off', String(off));
    hp.set('pat', pat);

    return `${_shareBaseUrl()}#${hp.toString()}`;
}

function copyZarSchemeLink() {
    let url = '';
    try {
        url = _buildZarSchemeShareUrl();
    } catch (_) {
        // last-resort fallback
        const base = _shareBaseUrl();
        url = `${base}#zrb=1`;
    }
    navigator.clipboard?.writeText(url).then(() => {
        if ($("btnShareScheme")) {
            $("btnShareScheme").textContent = I18N[LANG].linkCopied;
            setTimeout(() => { if ($("btnShareScheme")) $("btnShareScheme").textContent = t("shareScheme"); }, 1500);
        }
    }).catch(() => {
        prompt(LANG === "ru" ? "Скопируйте ссылку вручную:" : "Copy link manually:", url);
    });
}

function _tryLoadZarSchemeFromURL() {
    try {
        // If a full state is present in hash, ignore scheme.
        try {
            const hs = (location.hash || '').replace(/^#/, '');
            if (hs) {
                const hp0 = new URLSearchParams(hs);
                if (hp0.get('s')) return false;
                if (hs.startsWith('s=')) return false;
            }
        } catch (_) {}

        const hs = (location.hash || '').replace(/^#/, '');
        if (!hs) return false;
        const hp = new URLSearchParams(hs);
        if (!hp.get('zrb')) return false;
        const mode = (String(hp.get('mode') || 'classic').toLowerCase() === 'universal') ? 'universal' : 'classic';
        const dur = Math.max(1, Math.floor(+(hp.get('dur') || 300)));
        const off = Math.max(0, Math.floor(+(hp.get('off') || 30)));
        const pat = String(hp.get('pat') || '').trim();

        if ($("zarMode")) $("zarMode").value = mode;

        if (mode === 'universal') {
            if ($("zarDurU")) $("zarDurU").value = String(dur);
            if ($("zarOffU")) $("zarOffU").value = String(off);
            if ($("zarPatternU")) $("zarPatternU").value = pat;
        } else {
            if ($("zarDurC")) $("zarDurC").value = String(dur);
            if ($("zarOffC")) $("zarOffC").value = String(off);
            if ($("zarPatternC")) $("zarPatternC").value = pat;
        }

        // Make Zaruba visible by default for scheme links.
        try { if ($("chkZRB")) $("chkZRB").checked = true; } catch (_) {}

        return true;
    } catch (_) {
        return false;
    }
}

function _clearZarSchemeFromURL() {
    try {
        const base = _shareBaseUrl();
        let hash = '';
        try {
            const hs = (location.hash || '').replace(/^#/, '');
            if (hs) {
                const hp = new URLSearchParams(hs);
                hp.delete('zrb');
                hp.delete('mode');
                hp.delete('dur');
                hp.delete('off');
                hp.delete('pat');
                const rest = hp.toString();
                hash = rest ? `#${rest}` : '';
            }
        } catch (_) {}
        history.replaceState(null, '', `${base}${hash}`);
    } catch (_) {}
}

    function printTable() { window.print() }

    function _downloadJsonToFile(payloadObj, fileName) {
        const json = JSON.stringify(payloadObj, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
            try { URL.revokeObjectURL(a.href); } catch (_) {}
            try { a.remove(); } catch (_) {}
        }, 0);
    }

    function _fileStamp() {
        const dt = new Date();
        return `${dt.getFullYear()}${String(dt.getMonth() + 1).padStart(2,'0')}${String(dt.getDate()).padStart(2,'0')}-${String(dt.getHours()).padStart(2,'0')}${String(dt.getMinutes()).padStart(2,'0')}`;
    }

    function _safeFilePart(s) {
        return String(s || 'preset')
            .trim()
            .replace(/[\\/:*?"<>|]+/g, '_')
            .replace(/\s+/g, ' ')
            .slice(0, 80)
            .trim()
            .replace(/\s/g, '_');
    }

    function exportStateToDisk() {
        try {
            const st = currentState();
            const payload = { kind: 'tmic-state', version: 1, exportedAt: new Date().toISOString(), state: st };
            _downloadJsonToFile(payload, `tmic-state-${_fileStamp()}.json`);
        } catch (e) {
            console.error(e);
            alert(LANG === 'ru' ? 'Не удалось сохранить состояние.' : 'Failed to save state.');
        }
    }

    function importStateFromDisk() {
        try {
            const inp = $("stateFileInput");
            if (!inp) return;
            if (!inp._wiredStateImport) {
                inp.addEventListener('change', async () => {
                    try {
                        const f = inp.files && inp.files[0];
                        if (!f) return;
                        const txt = await f.text();
                        const parsed = JSON.parse(txt);
                        const st = (parsed && typeof parsed === 'object' && parsed.kind === 'tmic-state') ? parsed.state : parsed;
                        if (!st || typeof st !== 'object') throw new Error('bad state');
                        applyState(st);
                        setText();
                        configureRecommendedRanges();
                        updatePercentLabels();
                        render();
                        saveLastStateDebounced();
                    } catch (e) {
                        console.error(e);
                        alert(LANG === 'ru' ? 'Не удалось загрузить состояние.' : 'Failed to load state.');
                    }
                });
                inp._wiredStateImport = true;
            }
            inp.value = '';
            inp.click();
        } catch (e) {
            console.error(e);
            alert(LANG === 'ru' ? 'Не удалось открыть файл.' : 'Failed to open file.');
        }
    }

    // URL/state + Z2 auto-tune controls now provided by params.js: tryLoadStateFromURL, Z2_TARGET_TOUCHED, AUTO_TUNE_Z2, setZ2TargetIfAbove, maybeAutoTuneZ2
    // ---------- presets ----------
    let _PRESETS_MEM = null;

    function _presetDiskSetStatus(msg, isError = false) {
        try {
            const el = $("presetDiskStatus");
            if (!el) return;
            el.textContent = String(msg || '');
            el.style.color = isError ? '#fca5a5' : '';
        } catch (_) {}
    }

    function _presetsSafeGetRaw() {
        try { return localStorage.getItem("sit_presets"); } catch (_) { return null; }
    }

    function _presetsSafeWriteRaw(raw) {
        try { localStorage.setItem("sit_presets", raw); return true; } catch (_) { return false; }
    }

    function listPresets() {
        // If localStorage is broken or contains invalid JSON, fall back to in-memory presets.
        try {
            const raw = _presetsSafeGetRaw();
            if (!raw) {
                if (_PRESETS_MEM == null) _PRESETS_MEM = {};
                return _PRESETS_MEM;
            }
            const obj = JSON.parse(raw);
            if (!obj || typeof obj !== 'object' || Array.isArray(obj)) throw new Error('bad presets');
            _PRESETS_MEM = obj;
            return obj;
        } catch (_) {
            if (_PRESETS_MEM == null) _PRESETS_MEM = {};
            return _PRESETS_MEM;
        }
    }

    function writePresets(obj, pick) {
        try {
            const safeObj = (obj && typeof obj === 'object' && !Array.isArray(obj)) ? obj : {};
            _PRESETS_MEM = safeObj;
            const ok = _presetsSafeWriteRaw(JSON.stringify(safeObj));
            if (!ok) {
                _presetDiskSetStatus(LANG === 'ru'
                    ? 'LocalStorage недоступен: пресеты держатся в памяти (сохраните на диск).'
                    : 'LocalStorage unavailable: presets kept in memory (save to disk).', true);
            }
        } catch (_) {}
        refreshPresetList(pick);
    }

    function exportPresetsToDisk() {
        try {
            const presets = listPresets();
            const payload = {
                kind: 'tmic-presets',
                version: 1,
                exportedAt: new Date().toISOString(),
                presets
            };
            _downloadJsonToFile(payload, `tmic-presets-${_fileStamp()}.json`);

            const n = Object.keys(presets || {}).length;
            _presetDiskSetStatus(LANG === 'ru' ? `Сохранено пресетов: ${n}` : `Saved presets: ${n}`);
        } catch (e) {
            _presetDiskSetStatus(LANG === 'ru' ? 'Не удалось сохранить пресеты.' : 'Failed to save presets.', true);
            console.error(e);
        }
    }

    function exportPresetToDisk() {
        try {
            const all = listPresets();
            const selName = $("presetList")?.value;
            const name = (selName && all && all[selName]) ? selName : (CURRENT_PRESET || selName || 'Preset');
            const st = (name && all && all[name]) ? all[name] : currentState();
            const payload = { kind: 'tmic-preset', version: 1, exportedAt: new Date().toISOString(), name, state: st };
            _downloadJsonToFile(payload, `tmic-preset-${_safeFilePart(name)}-${_fileStamp()}.json`);
            _presetDiskSetStatus(LANG === 'ru' ? `Сохранён пресет: ${name}` : `Saved preset: ${name}`);
        } catch (e) {
            _presetDiskSetStatus(LANG === 'ru' ? 'Не удалось сохранить пресет.' : 'Failed to save preset.', true);
            console.error(e);
        }
    }

    function _coerceImportedPresets(obj) {
        if (!obj || typeof obj !== 'object') return null;
        if (obj.kind === 'tmic-presets' && obj.presets && typeof obj.presets === 'object') return obj.presets;
        if (obj.presets && typeof obj.presets === 'object') return obj.presets;
        if (!Array.isArray(obj)) return obj; // raw {name: state}
        return null;
    }

    function _mergePresetsNoOverwrite(existing, incoming) {
        const out = (existing && typeof existing === 'object' && !Array.isArray(existing)) ? { ...existing } : {};
        const src = (incoming && typeof incoming === 'object' && !Array.isArray(incoming)) ? incoming : {};
        let added = 0;
        let renamed = 0;
        for (const [nameRaw, state] of Object.entries(src)) {
            const base = String(nameRaw || '').trim();
            if (!base) continue;
            if (!state || typeof state !== 'object') continue;
            let name = base;
            if (Object.prototype.hasOwnProperty.call(out, name)) {
                // Avoid silent overwrite.
                let k = 2;
                while (Object.prototype.hasOwnProperty.call(out, `${base} (import ${k})`)) k++;
                name = `${base} (import ${k})`;
                renamed++;
            }
            out[name] = state;
            added++;
        }
        return { merged: out, added, renamed };
    }

    function importPresetsFromDisk() {
        try {
            const inp = $("presetsFileInput");
            if (!inp) return;
            if (!inp._wiredPresetsImport) {
                inp.addEventListener('change', async () => {
                    try {
                        const f = inp.files && inp.files[0];
                        if (!f) return;
                        const txt = await f.text();
                        const parsed = JSON.parse(txt);
                        const presetsObj = _coerceImportedPresets(parsed);
                        if (!presetsObj || typeof presetsObj !== 'object' || Array.isArray(presetsObj)) {
                            _presetDiskSetStatus(LANG === 'ru' ? 'Файл не похож на пресеты.' : 'File does not look like presets.', true);
                            return;
                        }
                        const cur = listPresets();
                        const res = _mergePresetsNoOverwrite(cur, presetsObj);
                        writePresets(res.merged);
                        _presetDiskSetStatus(LANG === 'ru'
                            ? `Импортировано: ${res.added} (переименовано: ${res.renamed})`
                            : `Imported: ${res.added} (renamed: ${res.renamed})`);
                    } catch (e) {
                        _presetDiskSetStatus(LANG === 'ru' ? 'Ошибка импорта пресетов.' : 'Failed to import presets.', true);
                        console.error(e);
                    }
                });
                inp._wiredPresetsImport = true;
            }
            inp.value = '';
            inp.click();
        } catch (e) {
            _presetDiskSetStatus(LANG === 'ru' ? 'Не удалось открыть файл.' : 'Failed to open file.', true);
            console.error(e);
        }
    }

    function importPresetFromDisk() {
        try {
            const inp = $("presetFileInput");
            if (!inp) return;
            if (!inp._wiredPresetImportOne) {
                inp.addEventListener('change', async () => {
                    try {
                        const f = inp.files && inp.files[0];
                        if (!f) return;
                        const txt = await f.text();
                        const parsed = JSON.parse(txt);
                        let name = null;
                        let st = null;
                        if (parsed && typeof parsed === 'object' && parsed.kind === 'tmic-preset') {
                            name = String(parsed.name || '').trim() || null;
                            st = parsed.state;
                        } else if (parsed && typeof parsed === 'object' && parsed.name && parsed.state) {
                            name = String(parsed.name || '').trim() || null;
                            st = parsed.state;
                        } else {
                            st = parsed;
                        }
                        if (!st || typeof st !== 'object') throw new Error('bad preset');
                        if (!name) {
                            const base = (f && f.name) ? String(f.name).replace(/\.json$/i, '') : 'Imported preset';
                            name = base;
                        }
                        const cur = listPresets();
                        const res = _mergePresetsNoOverwrite(cur, { [name]: st });
                        writePresets(res.merged, Object.keys(res.merged).find(k => res.merged[k] === st) || null);

                        // Auto-apply the imported preset for convenience.
                        const appliedName = (Object.keys(res.merged).find(k => res.merged[k] === st)) || name;
                        CURRENT_PRESET = appliedName;
                        try {
                            applyState(res.merged[appliedName]);
                            setText();
                            AUTO_TUNE_Z2 = false;
                            configureRecommendedRanges();
                            updatePercentLabels();
                            render();
                            saveLastStateDebounced();
                        } catch (_) {}

                        _presetDiskSetStatus(LANG === 'ru'
                            ? `Импортирован пресет: ${appliedName}${res.renamed ? ' (переименован)' : ''}`
                            : `Imported preset: ${appliedName}${res.renamed ? ' (renamed)' : ''}`);
                    } catch (e) {
                        _presetDiskSetStatus(LANG === 'ru' ? 'Ошибка импорта пресета.' : 'Failed to import preset.', true);
                        console.error(e);
                    }
                });
                inp._wiredPresetImportOne = true;
            }
            inp.value = '';
            inp.click();
        } catch (e) {
            _presetDiskSetStatus(LANG === 'ru' ? 'Не удалось открыть файл.' : 'Failed to open file.', true);
            console.error(e);
        }
    }

    function savePreset() {
    const all = listPresets();
    const typed = $("presetName").value.trim();
    let name = null;
    if (typed) {
    name = typed; // create/overwrite under typed name
} else if (CURRENT_PRESET) {
    name = CURRENT_PRESET; // overwrite current when no name typed
} else {
    const dt = new Date();
    name = `Preset ${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')} ${String(dt.getHours()).padStart(2, '0')}:${String(dt.getMinutes()).padStart(2, '0')}`;
}
    all[name] = currentState();
    writePresets(all, name);
    CURRENT_PRESET = name;
    $("presetName").value = "";
    $("presetList").value = name;
    updatePresetLabel();
}


    function savePresetNew() {
    const all = listPresets();
    let name = $("presetName").value.trim();
    if (!name) {
    const dt = new Date();
    name = `Preset ${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')} ${String(dt.getHours()).padStart(2, '0')}:${String(dt.getMinutes()).padStart(2, '0')}`;
}
    all[name] = currentState();
    writePresets(all, name);
    CURRENT_PRESET = name;
    $("presetName").value = "";
    $("presetList").value = name;
    updatePresetLabel();
}

    function loadPreset() {
    const all = listPresets();
    const name = $("presetList").value;
    if (!name || !all[name]) return;
    applyState(all[name]);

    // Apply language texts from the preset (updates labels and <html lang>)
    setText();
    CURRENT_PRESET = name;
    $("presetList").value = name;
    $("presetName").value = "";
    updatePresetLabel();
    // Disable auto-tune once a preset is applied
    AUTO_TUNE_Z2 = false;

    // Make sure UI reflects the preset (checkboxes, labels, ranges, chart)
    configureRecommendedRanges();
    updatePercentLabels();
    render();
    saveLastStateDebounced();
}

    function deletePreset() {
    const all = listPresets();
    const name = $("presetList").value;
    if (all[name]) { delete all[name]; writePresets(all); }
    if (CURRENT_PRESET === name) CURRENT_PRESET = null;
    $("presetName").value = "";
    refreshPresetList();
}
    function refreshPresetList(selected) {
    const sel = $("presetList");
    if (!sel) return;
    const all = listPresets();
    const keys = Object.keys(all);
    sel.innerHTML = keys.map(k => `<option>${k}</option>`).join("");
    const pick = selected || CURRENT_PRESET;
    if (pick && keys.includes(pick)) sel.value = pick;
}


    // ---------- Info popups ----------
    function openInfo(code) {
    const info = I18N[LANG].info;
    const nameMap = { SIT: I18N[LANG].meth.SIT, HIIT: I18N[LANG].meth.HIIT, SN: I18N[LANG].meth.SN, SW: I18N[LANG].meth.SW, Z2: I18N[LANG].meth.Z2, Z34: I18N[LANG].meth.Z34, STR: I18N[LANG].meth.STR, ZRB: I18N[LANG].meth.ZRB };
    const block = (info && info[code]) ? info[code] : { quick: [], notes: [] };
    $("infoTitle").textContent = nameMap[code] || "Info";
    $("infoQuickHdr").textContent = info.hdrQuick;
    $("infoNotesHdr").textContent = info.hdrNotes;
    $("infoQuick").innerHTML = "<ul>" + block.quick.map(x => "<li>" + x + "</li>").join("") + "</ul>";
    $("infoNotes").innerHTML = "<ul>" + block.notes.map(x => "<li>" + x + "</li>").join("") + "</ul>";
    $("infoTauHdr").textContent = info.tauHdr || "τ_ON / τ_OFF";
    $("infoTau").innerHTML = "<ul>" + (info.tau || []).map(x => "<li>" + x + "</li>").join("") + "</ul>";
    $("imodal").classList.add("show");
}
    function closeInfo() { $("imodal").classList.remove("show") }

    document.addEventListener("click", (e) => {
    const el = e.target.closest(".infoIcon");
    if (el && el.dataset.m) { openInfo(el.dataset.m); }
});
    document.addEventListener("click", (e) => { if (e.target && e.target.id === "iClose") closeInfo(); if (e.target && e.target.id === "imodal" && e.target === e.currentTarget) closeInfo(); });
    // Esc key is handled by the global keydown handler in init

    // ---------- BIG CHART (modal) moved to modals.js ----------
    function wireStaticDomHandlers() {
    const chart = $("chart");
    const closeBtn = $("closeModal");
    const modal = $("modal");
    if (chart && !chart._wiredOpenBigChart) {
        chart.addEventListener("click", openBigChart);
        chart._wiredOpenBigChart = true;
    }
    if (closeBtn && !closeBtn._wiredCloseBigChart) {
        closeBtn.addEventListener("click", closeBigChart);
        closeBtn._wiredCloseBigChart = true;
    }
    if (modal && !modal._wiredBackdropCloseBigChart) {
        modal.addEventListener("click", (e) => { if (e.target === e.currentTarget) closeBigChart(); });
        modal._wiredBackdropCloseBigChart = true;
    }
    // Redraw big chart on orientation changes to avoid narrow rendering
    if (!window._wiredBigChartOrientationRedraw) {
        window.addEventListener("orientationchange", () => {
            if ($("modal")?.classList.contains("show")) { try { drawBigChart(); } catch(_){} }
        });
        window._wiredBigChartOrientationRedraw = true;
    }
    if (!window._wiredGlobalResizeRedraw) {
        window.addEventListener("resize", () => {
            // Redraw visible charts on resize for correct 100% width behavior
            try {
                const p = getParams();
                const series = seriesFromParams(p);
                if ($("chart") && series.length) { drawChart($("chart"), series); overlayZones($("chart"), series); drawLegend($("legend"), series); }
            } catch(_){ }
            if ($("modal")?.classList.contains("show")) { try { drawBigChart(); } catch(_){} }
            if (typeof window.adjustCmpWrapHeight === 'function') { try { window.adjustCmpWrapHeight(); } catch(_){} }
        });
        window._wiredGlobalResizeRedraw = true;
    }
    // Esc key is handled by the global keydown handler in init
    ["detInputs", "detAdv", "detCtlIntervals", "detCtlSteady", "detZarOpt"].forEach(id => {
    const det = $(id);
    if (!det || det._wiredTogglePersist) return;
    det.addEventListener("toggle", () => { saveLastStateDebounced(); });
    det._wiredTogglePersist = true;
});

    // Zaruba optimizer: reset pinned options to "auto".
    const btnZarOptAuto = $("btnZarOptAuto");
    if (btnZarOptAuto && !btnZarOptAuto._wired) {
        btnZarOptAuto.addEventListener('click', () => {
            try {
                if ($("zarOptCycles")) $("zarOptCycles").value = '0';
                if ($("zarOptFinish")) $("zarOptFinish").value = '0';
                render();
                saveLastStateDebounced();
            } catch (_) {
                try { render(); } catch (_) {}
            }
        });
        btnZarOptAuto._wired = true;
    }

    // Import wiring
    const btnImport = $("btnImport");
    const inpFile = $("fileImport");
    const btnClearImports = $("btnClearImports");
    const importQuality = $("importQuality");
    const impOffset = $("impOffset");
    const impRange = $("impOffsetRange");
    const impTrimStart = $("impTrimStart");
    const impTrimRange = $("impTrimRange");
    const impTrimAuto = $("impTrimAuto");
    const impTrimClear = $("impTrimClear");
    const impTrimApply = $("impTrimAffectsChart");
    const bM10 = $("impMinus10");
    const bM1 = $("impMinus1");
    const bP1 = $("impPlus1");
    const bP10 = $("impPlus10");
    const bZero = $("impZero");

    const renderImportQuality = () => {
        try {
            if (!importQuality) return;
            if (!Array.isArray(IMPORTS) || IMPORTS.length === 0) {
                importQuality.style.display = 'none';
                importQuality.innerHTML = '';
                return;
            }
            const imp = IMPORTS[0];
            const hr = imp?.hr;
            const t = imp?.t;
            const qFn = window?.zoneSummary?.assessHrSeriesQuality;
            if (typeof qFn !== 'function' || !Array.isArray(hr) || !Array.isArray(t) || hr.length !== t.length) {
                importQuality.style.display = 'block';
                importQuality.innerHTML = (LANG === 'ru')
                    ? '<b>Качество данных:</b> недоступно (нет временной оси)'
                    : '<b>Data quality:</b> unavailable (no time axis)';
                return;
            }
            const q = qFn(hr, t);
            if (!q || !q.level || q.level === 'na') {
                importQuality.style.display = 'none';
                importQuality.innerHTML = '';
                return;
            }

            const label = (lvl) => {
                if (LANG === 'ru') {
                    if (lvl === 'good') return 'Хорошее';
                    if (lvl === 'ok') return 'Среднее';
                    if (lvl === 'bad') return 'Плохое';
                    return 'н/д';
                }
                if (lvl === 'good') return 'Good';
                if (lvl === 'ok') return 'OK';
                if (lvl === 'bad') return 'Poor';
                return 'n/a';
            };
            const color = (q.level === 'bad') ? 'var(--bad,#ef4444)' : (q.level === 'ok' ? 'var(--mid,#f59e0b)' : 'var(--good,#22c55e)');
            const parts = [];
            if (Number.isFinite(q.score)) parts.push(`${Math.round(q.score)}/100`);
            if (Number.isFinite(q.dtMedian)) parts.push(`dt~${q.dtMedian.toFixed(2)}s`);
            if (Number.isFinite(q.dtP95)) parts.push(`p95 ${q.dtP95.toFixed(2)}s`);
            if (Number.isFinite(q.outOfRange) && q.outOfRange > 0) parts.push(`${q.outOfRange} ${(LANG==='ru')?'вне 30–230':'out-of-range'}`);
            if (Number.isFinite(q.spikes) && q.spikes > 0) parts.push(`${q.spikes} ${(LANG==='ru')?'скачков':'spikes'}`);
            if (Number.isFinite(q.gaps10) && q.gaps10 > 0) parts.push(`${q.gaps10} ${(LANG==='ru')?'пробелов>10с':'gaps>10s'}`);

            const head = (LANG === 'ru') ? 'Качество данных' : 'Data quality';
            const msg = `<b>${head}:</b> <span style="color:${color}"><b>${label(q.level)}</b></span> (${parts.join(', ')})`;
            const advice = (q.level === 'bad')
                ? (LANG === 'ru'
                    ? '<div style="margin-top:6px; opacity:.9">Возможны артефакты датчика/экспорта. Подгонка HRmax и τ могут быть ненадёжны.</div>'
                    : '<div style="margin-top:6px; opacity:.9">Sensor/export artifacts likely. HRmax fit and τ may be unreliable.</div>')
                : '';
            importQuality.style.display = 'block';
            importQuality.innerHTML = msg + advice;
        } catch (e) {
            try {
                if (importQuality) {
                    importQuality.style.display = 'none';
                    importQuality.innerHTML = '';
                }
            } catch (_) {}
        }
    };

    if (btnImport && inpFile && !btnImport._wired) {
        btnImport.addEventListener("click", () => inpFile.click());
        inpFile.addEventListener("change", async (e) => {
            const f = e.target.files && e.target.files[0];
            if (!f) return;
            try {
                const ext = (f.name.split('.').pop() || '').toLowerCase();
                if (ext === 'fit') {
                                        if (!ENABLE_FIT_IMPORT) {
                                                const msg = (LANG==='ru')
                                                    ? 'Импорт FIT пока отключён (нестабилен). Конвертируйте FIT → CSV (fit-to-csv.py) и импортируйте CSV.'
                                                    : 'FIT import is currently disabled (unstable). Convert FIT → CSV (fit-to-csv.py) and import the CSV.';
                                                alert(msg);
                                                return;
                                        }
                                        const buf = await f.arrayBuffer();
                                        const res = await importFITBuffer(f.name, buf);
                                        if (!res.ok) {
                                                const msg = (LANG==='ru')
                                                    ? 'Не удалось импортировать FIT. Попробуйте конвертировать FIT → CSV (fit-to-csv.py) и импортировать CSV.'
                                                    : 'Could not import FIT. Convert FIT → CSV (fit-to-csv.py) and import the CSV.';
                                                alert(msg);
                                        }
                } else {
                    const text = await f.text();
                    const ok = importCSVText(f.name, text);
                    if (!ok) alert(LANG==='ru' ? 'Не удалось распознать CSV' : 'Could not parse CSV');
                }
                renderImportQuality();
                render();
            } catch (err) {
                console.error('import error', err);
                alert(LANG==='ru' ? 'Ошибка импорта' : 'Import error');
            } finally {
                e.target.value = '';
            }
        });
        btnImport._wired = true;
    }
    if (btnClearImports && !btnClearImports._wired) {
        btnClearImports.addEventListener('click', () => {
            IMPORTS.length = 0;
            renderImportQuality();
            render();
        });
        btnClearImports._wired = true;
    }
    // Offset controls wiring (number <-> range + step buttons)
    const setOffset = (v) => {
        const min = Number(impRange?.min ?? -3600), max = Number(impRange?.max ?? 3600);
        const clamped = Math.max(min, Math.min(max, Math.round(Number(v)||0)));
        IMPORT_OFFSET_SEC = clamped;
        try { window.IMPORT_OFFSET_SEC = clamped; } catch(_){}
        if (impOffset) impOffset.value = String(clamped);
        if (impRange) impRange.value = String(Math.max(min, Math.min(max, clamped)));
        render();
        saveLastStateDebounced();
    };
    if (impOffset && !impOffset._wired) {
        impOffset.addEventListener('input', () => setOffset(Number(impOffset.value)));
        impOffset._wired = true;
    }
    if (impRange && !impRange._wired) {
        impRange.addEventListener('input', () => setOffset(Number(impRange.value)));
        impRange._wired = true;
    }
    const bindBtn = (el, delta) => {
        if (!el || el._wired) return;
        el.addEventListener('click', () => setOffset((Number(impOffset?.value)||0) + delta));
        el._wired = true;
    };
    bindBtn(bM10, -10);
    bindBtn(bM1, -1);
    bindBtn(bP1, 1);
    bindBtn(bP10, 10);
    if (bZero && !bZero._wired) { bZero.addEventListener('click', () => setOffset(0)); bZero._wired = true; }

    // Trim controls wiring
    const setTrim = (v) => {
        const min = Number(impTrimRange?.min ?? 0), max = Number(impTrimRange?.max ?? 36000);
        const clamped = Math.max(min, Math.min(max, Math.round(Number(v)||0)));
        IMPORT_TRIM_START_SEC = clamped;
        try { window.IMPORT_TRIM_START_SEC = clamped; } catch(_){ }
        if (impTrimStart) impTrimStart.value = String(clamped);
        if (impTrimRange) impTrimRange.value = String(Math.max(min, Math.min(max, clamped)));
        render();
        saveLastStateDebounced();
    };
    if (impTrimStart && !impTrimStart._wired) { impTrimStart.addEventListener('input', () => setTrim(Number(impTrimStart.value))); impTrimStart._wired = true; }
    if (impTrimRange && !impTrimRange._wired) { impTrimRange.addEventListener('input', () => setTrim(Number(impTrimRange.value))); impTrimRange._wired = true; }
    if (impTrimApply && !impTrimApply._wired) { impTrimApply.addEventListener('change', () => { IMPORT_TRIM_APPLY_TO_CHART = !!impTrimApply.checked; try { window.IMPORT_TRIM_APPLY_TO_CHART = IMPORT_TRIM_APPLY_TO_CHART; } catch(_){} render(); saveLastStateDebounced(); }); impTrimApply._wired = true; }

    // Align 0s button: align displayed timeline to trim point
    const impAlign0 = $("impAlign0");
    if (impAlign0 && !impAlign0._wired) {
        impAlign0.addEventListener('click', () => {
            const trim = Math.max(0, Number($("impTrimStart")?.value || IMPORT_TRIM_START_SEC || 0));
            const applyTrim = !!($("impTrimAffectsChart")?.checked);
            // If trimming is applied to chart, time is already rebased to (t - trim + off), so set off=0.
            // If not applied, shift by -trim to place the trim point at 0 s.
            if (applyTrim) {
                const off = 0;
                const impRange = $("impOffsetRange");
                const impOffset = $("impOffset");
                const min = Number(impRange?.min ?? -3600), max = Number(impRange?.max ?? 3600);
                const clamped = Math.max(min, Math.min(max, Math.round(off)));
                IMPORT_OFFSET_SEC = clamped; try { window.IMPORT_OFFSET_SEC = clamped; } catch(_){ }
                if (impOffset) impOffset.value = String(clamped);
                if (impRange) impRange.value = String(Math.max(min, Math.min(max, clamped)));
                render(); saveLastStateDebounced();
            } else {
                const target = -trim;
                const impRange = $("impOffsetRange");
                const impOffset = $("impOffset");
                const min = Number(impRange?.min ?? -3600), max = Number(impRange?.max ?? 3600);
                const clamped = Math.max(min, Math.min(max, Math.round(target)));
                IMPORT_OFFSET_SEC = clamped; try { window.IMPORT_OFFSET_SEC = clamped; } catch(_){ }
                if (impOffset) impOffset.value = String(clamped);
                if (impRange) impRange.value = String(Math.max(min, Math.min(max, clamped)));
                render(); saveLastStateDebounced();
            }
        });
        impAlign0._wired = true;
    }

    const autoDetectTrimFromImport = () => {
        try {
            if (!Array.isArray(IMPORTS) || !IMPORTS.length) return 0;
            const imp = IMPORTS[0];
            const t = imp.t || [], hr = imp.hr || [];
            const N = Math.min(t.length, hr.length);
            if (N < 12) return 0;
            // light smooth
            const s = new Array(N);
            for (let i=0;i<N;i++){ const a=hr[Math.max(0,i-1)], b=hr[i], c=hr[Math.min(N-1,i+1)]; s[i]=(a+b+c)/3; }
            // baseline from first 20–40s
            const endT = Math.min(t[N-1], 40);
            const baseIdx = [];
            for (let i=0;i<N;i++){ if (t[i] <= endT) baseIdx.push(i); else break; }
            const baseSample = baseIdx.length ? baseIdx.map(i=>s[i]) : s.slice(0, Math.min(N, 30));
            const sorted = baseSample.slice().sort((a,b)=>a-b);
            const rest = sorted[Math.floor(sorted.length/2)] || hr[0];
            // 3-step slope
            const slope = new Array(N).fill(0);
            for (let i=3;i<N;i++) slope[i] = (s[i] - s[i-3]) / Math.max(1e-6, (t[i]-t[i-3]));
            const TH_SLOPE = 0.12; // bpm/s
            const TH_ABS = rest + 7; // bpm above rest
            let startIdx = 0;
            for (let i=3;i<N-3;i++){
                const sustained = (slope[i] > TH_SLOPE && slope[i+1] > TH_SLOPE) || (s[i] >= TH_ABS && s[i] > s[i-1]);
                if (sustained) { startIdx = i; break; }
            }
            return Math.max(0, Math.round(t[startIdx] || 0));
        } catch(_) { return 0; }
    };
    if (impTrimAuto && !impTrimAuto._wired) {
        impTrimAuto.addEventListener('click', () => { const guess = autoDetectTrimFromImport(); setTrim(guess); });
        impTrimAuto._wired = true;
    }

    // initial paint
    renderImportQuality();
    if (impTrimClear && !impTrimClear._wired) {
        impTrimClear.addEventListener('click', () => setTrim(0));
        impTrimClear._wired = true;
    }

    function _zarConvertPatternPTInZpInput() {
        try {
            const inputEl = $("zpInput");
            if (!inputEl) return;
            const src = String(inputEl.value || '').trim();
            if (!src) return;

            // Preserve scheme alphabet based on what the user typed.
            // RU scheme: use "п" and "т". EN scheme: use "r" and "t".
            const wantsCyr = /[пПтТ]/.test(src);

            const p = (typeof window.getParams === 'function') ? window.getParams() : null;
            const z = p?.zar;
            const offDefault = Math.max(0, Math.floor(+z?.off || 30));
            const defaultWorkEff10 = Number.isFinite(+z?.eff) ? (+z.eff) : 8.5;

            const parse = (typeof window.parseZarPattern === 'function') ? window.parseZarPattern : (window.SimCore?.parseZarPattern);
            const fmt = (typeof window.formatZarPatternSegments === 'function') ? window.formatZarPatternSegments : (window.SimCore?.formatZarPatternSegments);
            if (typeof parse !== 'function' || typeof fmt !== 'function') return;

            const segs = parse(src, offDefault);
            if (!Array.isArray(segs) || segs.length === 0) return;

            const clampTempo = (rpm) => {
                const v = Math.round(+rpm || 0);
                if (!Number.isFinite(v) || v <= 0) return undefined;
                return Math.max(5, Math.min(240, v));
            };
            // NOTE: Tempo override (tXX/тXX) in this scheme is treated as the *actual metronome RPM*.
            // Therefore conversion between reps and tempo must not scale by intensity.

            for (const s of segs) {
                const on = Math.max(0, Math.floor(+s?.on || 0));
                if (on <= 0) continue;

                const hasReps = Number.isFinite(+s?.workReps);
                const hasTempo = Number.isFinite(+s?.workTempoRpm);
                if (hasReps && !hasTempo) {
                    const reps = Math.max(0, Math.floor(+s.workReps || 0));
                    if (reps <= 0) continue;
                    const avgEffRpm = 60 * reps / on;
                    const tempoRpm = clampTempo(avgEffRpm);
                    if (tempoRpm != null) {
                        s.workTempoRpm = tempoRpm;
                        s.workReps = undefined;
                    }
                    continue;
                }
                if (hasTempo && !hasReps) {
                    const cap = clampTempo(+s.workTempoRpm);
                    if (cap == null) continue;
                    const reps = Math.max(0, Math.round(on * cap / 60));
                    s.workReps = reps;
                    s.workTempoRpm = undefined;
                    continue;
                }
            }

            let out = fmt(segs);
            try {
                if (segs._hardStop) out = `${out}#`;
                else if (segs._noCycle) out = `${out};`;
            } catch (_) {}

            // Normalize directive letters according to the user's scheme alphabet.
            // - Core formatter uses: pNN + tXX
            // - Spec wants: RU => пNN + тXX, EN => rNN + tXX
            try {
                out = wantsCyr
                    ? out.replace(/p(\d+)/g, 'п$1')
                    : out.replace(/p(\d+)/g, 'r$1');
                if (wantsCyr) out = out.replace(/t(\d+)/g, 'т$1');
            } catch (_) {}

            inputEl.value = out;
            try {
                if ($("zpExplainDet")?.open) {
                    // Refresh explain panels if user currently sees them.
                    if (typeof _zarExplainBuildFromZpInput === 'function') _zarExplainBuildFromZpInput();
                }
            } catch (_) {}
        } catch (_) {}
    }

    // Zaruba pattern mini-modal handlers
    const btnPat = $("btnZarPattern");
    const zpm = $("zpmodal");
    if (btnPat && zpm && !btnPat._wired) {
        btnPat.addEventListener("click", () => {
            // Explicit ZRB pattern editor: do NOT depend on "active method" (chart selection may point elsewhere).
            _tzZpContext = { methodKey: 'ZRB', readOnly: false };

            const input = $("zpInput");
            if (!input) return;

            const mode = ($("zarMode")?.value === 'universal') ? 'universal' : 'classic';
            const src = (mode === 'universal' ? $("zarPatternU")?.value : $("zarPatternC")?.value) || "";

            // Lazy default: if there is no explicit pattern yet, prefill with current base On/Off
            // (no intensity, no tempo, no hard stop) so it's easy to tweak.
            if (String(src).trim()) {
                input.value = String(src);
            } else {
                const baseOn = Math.max(1, Math.floor(+($(mode === 'universal' ? 'zarOnU' : 'zarOnC'))?.value || 30));
                const baseOff = Math.max(0, Math.floor(+($(mode === 'universal' ? 'zarOffU' : 'zarOffC'))?.value || 30));
                input.value = `${baseOn}/${baseOff}`;
            }

            try {
                const title = $("zpTitle");
                if (title) title.textContent = (LANG === 'ru') ? `Схема: ${_tzMethodLabel('ZRB')}` : `Scheme: ${_tzMethodLabel('ZRB')}`;
            } catch (_) {}

            try {
                input.readOnly = false;
                if ($("zpmApply")) $("zpmApply").disabled = false;
                if ($("zpmSave")) $("zpmSave").disabled = false;
                if ($("zpmConvertPT")) $("zpmConvertPT").disabled = false;
                const b = $("zpmEditUniversal");
                if (b) b.style.display = 'none';
            } catch (_) {}

            try {
                if ($("zpExplainDet")) $("zpExplainDet").open = false;
                if ($("zpExplainPattern")) $("zpExplainPattern").textContent = '';
                if ($("zpExplainText")) $("zpExplainText").textContent = '';
            } catch (_) {}

            $("zpmodal").classList.add("show");
            try { if (typeof _tzZpmRenderLibrary === 'function') _tzZpmRenderLibrary(); } catch (_) {}
            setTimeout(() => { _tzMaybeFocus(input); }, 50);
        });
        btnPat._wired = true;
    }
    const zpmClose = $("zpClose");
    if (zpmClose && !zpmClose._wiredCloseZpm) {
        zpmClose.addEventListener("click", () => $("zpmodal").classList.remove("show"));
        zpmClose._wiredCloseZpm = true;
    }
    const zpmCancel = $("zpmCancel");
    if (zpmCancel && !zpmCancel._wiredCloseZpm) {
        zpmCancel.addEventListener("click", () => $("zpmodal").classList.remove("show"));
        zpmCancel._wiredCloseZpm = true;
    }

    const _zarZpmCommit = (opts) => {
        if (_tzZpContext?.readOnly) {
            _tzZpmReadOnlyNotify();
            return;
        }

        // If the user changes the scheme manually, disarm the Sally preset mode.
        try { _zarMaybeExitSallyPresetMode('pattern-apply'); } catch (_) {}
        const close = !!opts?.close;
        const val = $("zpInput").value.trim();
        const mode = ($("zarMode")?.value === 'universal') ? 'universal' : 'classic';
        const tgt = (mode === 'universal') ? $("zarPatternU") : $("zarPatternC");
        if (tgt) tgt.value = val;

        // Manual edit => wipe all optimizer-derived auto settings (including auto tempo).
        _zarAutoTempoRpm = null;
        try { _zarScreenUpdateAutoTempoStatus(); } catch (_) {}

        if (close) $("zpmodal").classList.remove("show");
        render();

        try {
            // If Big Screen is open, do NOT interrupt an active session.
            // Only refresh the static preview when Big Screen is idle.
            if (_zarScreen && _zarScreen.open && !_zarScreen.running && !_zarScreen.started) {
                try { _zarScreen.clickPlan = null; } catch (_) {}
                try { _zarScreenUpdateStatic(); } catch (_) {}
                try {
                    const el = $("zarScreenTempo");
                    if (el) el.textContent = '';
                } catch (_) {}
                try { _zarScreenUpdateAutoTempoStatus(); } catch (_) {}
                try { if (_zarPlanIsOpen()) _zarPlanRender(); } catch (_) {}
            }
        } catch (_) {}

        saveLastStateDebounced();
        if (!close) {
            try { _tzMaybeFocus($("zpInput")); } catch (_) {}
        }
    };

    const zpmApply = $("zpmApply");
    if (zpmApply && !zpmApply._wiredApplyZpm) {
        zpmApply.addEventListener("click", () => _zarZpmCommit({ close: false }));
        zpmApply._wiredApplyZpm = true;
    }

    const zpmSave = $("zpmSave");
    if (zpmSave && !zpmSave._wiredSaveZpm) zpmSave.addEventListener("click", () => _zarZpmCommit({ close: true }));
    if (zpmSave) zpmSave._wiredSaveZpm = true;

    const zpInput = $("zpInput");
    if (zpInput && !zpInput._wiredEnterZpm) {
        zpInput.addEventListener('keydown', (e) => {
            // Enter = apply & close (common dialog behavior)
            if (e.key === 'Enter') {
                e.preventDefault();
                if (_tzZpContext?.readOnly) {
                    _tzZpmReadOnlyNotify();
                    return;
                }
                _zarZpmCommit({ close: true });
            }
        });
        zpInput._wiredEnterZpm = true;
    }

    const zpmConvertPT = $("zpmConvertPT");
    if (zpmConvertPT && !zpmConvertPT._wiredConvertPT) {
        zpmConvertPT.addEventListener('click', () => {
            if (_tzZpContext?.readOnly) {
                _tzZpmReadOnlyNotify();
                return;
            }
            _zarConvertPatternPTInZpInput();
            try { _tzMaybeFocus($("zpInput")); } catch (_) {}
        });
        zpmConvertPT._wiredConvertPT = true;
    }

    const zpmEditUniversal = $("zpmEditUniversal");
    if (zpmEditUniversal && !zpmEditUniversal._wiredEditUniversal) {
        zpmEditUniversal.addEventListener('click', () => {
            _tzEditInUniversalFromZpm();
        });
        zpmEditUniversal._wiredEditUniversal = true;
    }

    const zpmCopy = $("zpmCopy");
    if (zpmCopy && !zpmCopy._wiredCopyZpm) {
        zpmCopy.addEventListener('click', async () => {
            try {
                const val = String($("zpInput")?.value || '');
                const text = val.trim();
                if (!text) {
                    try { _tzMaybeFocus($("zpInput")); } catch (_) {}
                    return;
                }
                const okLabel = I18N[LANG]?.copied || (LANG === 'ru' ? 'Скопировано!' : 'Copied!');
                const baseLabel = I18N[LANG]?.copy || (LANG === 'ru' ? 'Скопировать' : 'Copy');

                const setBtn = (s) => { try { zpmCopy.textContent = s; } catch (_) {} };
                const done = () => { setBtn(okLabel); setTimeout(() => setBtn(baseLabel), 1200); };

                if (navigator.clipboard?.writeText) {
                    await navigator.clipboard.writeText(text);
                    done();
                } else {
                    prompt(LANG === 'ru' ? 'Скопируйте схему вручную:' : 'Copy pattern manually:', text);
                    done();
                }
            } catch (_) {
                try {
                    const text = String($("zpInput")?.value || '').trim();
                    if (text) prompt(LANG === 'ru' ? 'Скопируйте схему вручную:' : 'Copy pattern manually:', text);
                } catch (_) {}
            }
        });
        zpmCopy._wiredCopyZpm = true;
    }
    if (zpm && !zpm._wiredBackdropCloseZpm) {
        zpm.addEventListener("click", (e) => { if (e.target === e.currentTarget) e.currentTarget.classList.remove("show"); });
        zpm._wiredBackdropCloseZpm = true;
    }
    // Esc key is handled by the global keydown handler in init

    // Now that DOM is wired, set up auto-eff for Snatch


    // Clear pattern button
    const btnClear = document.getElementById('btnZarClear');
    if (btnClear && !btnClear._wired) {
    btnClear.addEventListener('click', () => {
    try { _zarMaybeExitSallyPresetMode('pattern-clear'); } catch (_) {}
    const mode = ($("zarMode")?.value === 'universal') ? 'universal' : 'classic';
    const inp = document.getElementById(mode === 'universal' ? 'zarPatternU' : 'zarPatternC');
    if (inp) inp.value = '';
    render();

    // If Big Screen is open, refresh the cached plan preview (when idle).
    try {
        if (_zarScreen && _zarScreen.open && !_zarScreen.running && !_zarScreen.started) {
            try { _zarScreen.clickPlan = null; } catch (_) {}
            try { _zarScreenUpdateStatic(); } catch (_) {}
            try {
                const el = $("zarScreenTempo");
                if (el) el.textContent = '';
            } catch (_) {}
            try { _zarScreenUpdateAutoTempoStatus(); } catch (_) {}
            try { if (_zarPlanIsOpen()) _zarPlanRender(); } catch (_) {}
        }
    } catch (_) {}

    saveLastStateDebounced();
});
    btnClear._wired = true;
}

    // Ensure the Zaruba Timer button always opens the true Zaruba timer (no stale overrides).
    try {
        const btnZarTimer = $("btnZarBigScreen");
        if (btnZarTimer && !btnZarTimer._wiredZarTimerOpen) {
            btnZarTimer.onclick = (e) => {
                try { if (e && typeof e.preventDefault === 'function') e.preventDefault(); } catch (_) {}
                _zarOpenBigScreenForZaruba();
                return false;
            };
            btnZarTimer._wiredZarTimerOpen = true;
        }
    } catch (_) {}

    // Copy pattern button (no modal)
    const btnCopy = document.getElementById('btnZarCopy');
    if (btnCopy && !btnCopy._wired) {
        btnCopy.addEventListener('click', async () => {
            try {
                const mode = ($("zarMode")?.value === 'universal') ? 'universal' : 'classic';
                const src = (mode === 'universal' ? $("zarPatternU")?.value : $("zarPatternC")?.value) || '';
                const text = String(src).trim();
                if (!text) {
                    // If empty, open the editor to help user.
                    try { document.getElementById('btnZarPattern')?.click(); } catch (_) {}
                    return;
                }

                const okLabel = I18N[LANG]?.copied || (LANG === 'ru' ? 'Скопировано!' : 'Copied!');
                const baseLabel = I18N[LANG]?.copy || (LANG === 'ru' ? 'Скопировать' : 'Copy');
                const done = () => {
                    try { btnCopy.textContent = okLabel; } catch (_) {}
                    setTimeout(() => { try { btnCopy.textContent = baseLabel; } catch (_) {} }, 1200);
                };

                if (navigator.clipboard?.writeText) {
                    await navigator.clipboard.writeText(text);
                    done();
                } else {
                    prompt(LANG === 'ru' ? 'Скопируйте схему вручную:' : 'Copy pattern manually:', text);
                    done();
                }
            } catch (_) {
                try {
                    const mode = ($("zarMode")?.value === 'universal') ? 'universal' : 'classic';
                    const src = (mode === 'universal' ? $("zarPatternU")?.value : $("zarPatternC")?.value) || '';
                    const text = String(src).trim();
                    if (text) prompt(LANG === 'ru' ? 'Скопируйте схему вручную:' : 'Copy pattern manually:', text);
                } catch (_) {}
            }
        });
        btnCopy._wired = true;
    }

    function _zarReadDefaultRestEff10(mode) {
        try {
            if (mode !== 'universal') return 0;
            const kin = String($('zarKinU')?.value || 'hiit').toLowerCase();
            if (kin === 'sit') return 0;
            const v = +($('zarRestEffU')?.value || 0);
            return Number.isFinite(v) ? Math.max(0, Math.min(10, v)) : 0;
        } catch (_) {
            return 0;
        }
    }

    function _fmtEff(v) {
        if (!Number.isFinite(+v)) return '';
        const n = +v;
        if (Math.abs(n - Math.round(n)) <= 1e-9) return String(Math.round(n));
        return String(n.toFixed(1)).replace(/\.0$/, '');
    }

    function _fmtTempo(rpm) {
        if (!Number.isFinite(+rpm)) return '';
        const k = Math.round(+rpm);
        if (!(k > 0)) return '';
        return `${Math.max(5, Math.min(240, k))} rpm`;
    }

    function _explainZarPatternToText(opts) {
        const mode = opts?.mode === 'universal' ? 'universal' : 'classic';
        const durSec = Math.max(1, Math.floor(+opts?.durSec || 300));
        const baseOnSec = Number.isFinite(+opts?.baseOnSec) ? Math.max(1, Math.floor(+opts.baseOnSec)) : null;
        const baseOffSec = Number.isFinite(+opts?.baseOffSec) ? Math.max(0, Math.floor(+opts.baseOffSec)) : null;
        const offDefault = Math.max(0, Math.floor(+opts?.offDefault || 30));
        const patternStr = String(opts?.patternStr || '').trim();
        let segsRaw = Array.isArray(opts?.segs) ? opts.segs : [];
        let noCycle = !!(opts?.segs && opts.segs._noCycle);
        let hardStop = !!(opts?.segs && opts.segs._hardStop);

        // Prefer parsing from the actual pattern string so the explanation matches the syntax
        // the user sees (and is not affected by any upstream truncation/normalization of segs).
        // Fallback to opts.segs if parsing is unavailable.
        try {
            if (patternStr && typeof window !== 'undefined' && typeof window.parseZarPattern === 'function') {
                const parsed = window.parseZarPattern(patternStr, offDefault);
                if (Array.isArray(parsed) && parsed.length) {
                    segsRaw = parsed;
                    noCycle = !!parsed._noCycle;
                    hardStop = !!parsed._hardStop;
                }
            }
        } catch (_) {
            // ignore
        }

        const workEffDef = Number.isFinite(+opts?.defaultWorkEff10)
            ? (+opts.defaultWorkEff10)
            : (mode === 'universal' ? 5.0 : 8.5);
        const restEffDef = Number.isFinite(+opts?.defaultRestEff10)
            ? (+opts.defaultRestEff10)
            : _zarReadDefaultRestEff10(mode);

        const norm = (s) => {
            const on = Math.max(0, Math.floor(+s?.on || 0));
            const off = Math.max(0, Math.floor(+s?.off || 0));
            const eff = Number.isFinite(+s?.eff) ? +s.eff : workEffDef;
            const restEff = Number.isFinite(+s?.restEff) ? +s.restEff : restEffDef;
            const wTempo = Number.isFinite(+s?.workTempoRpm) ? Math.max(5, Math.min(240, Math.round(+s.workTempoRpm))) : null;
            const rTempo = Number.isFinite(+s?.restTempoRpm) ? Math.max(5, Math.min(240, Math.round(+s.restTempoRpm))) : null;
            const wReps = Number.isFinite(+s?.workReps) ? Math.max(0, Math.round(+s.workReps)) : null;
            return { on, off, eff, restEff, wTempo, rTempo, wReps };
        };
        const segsAll = segsRaw.map(norm).filter(s => (s.on + s.off) > 0);

        const L = (LANG === 'ru');
        const lines = [];
        const push = (s='') => lines.push(String(s));

        push(L ? `Пояснение: как таймер выполнит эту схему` : `Explanation: how the timer will run this pattern`);
        push(L ? `Режим: ${mode === 'universal' ? 'универсальный' : 'классический'}` : `Mode: ${mode}`);
        push(L ? `Длительность (Duration): ${durSec}s` : `Duration: ${durSec}s`);
        if (baseOnSec != null && baseOffSec != null) {
            push(L
                ? `Обычные раунды (после схемы с ";" или если схема пустая): ${baseOnSec}s работы / ${baseOffSec}s отдыха`
                : `Default rounds (after a ";" pattern, or when pattern is empty): ${baseOnSec}s work / ${baseOffSec}s rest`);
        }
        push(L
            ? `Если в блоке не указано "/Off", используется Off по умолчанию = ${offDefault}s`
            : `If a block has no "/Off", it uses offDefault = ${offDefault}s`);
        push(L
            ? `Интенсивность по умолчанию: работа @${_fmtEff(workEffDef)}, отдых @${_fmtEff(restEffDef)}`
            : `Default intensity: work @${_fmtEff(workEffDef)}, rest @${_fmtEff(restEffDef)}`);

        if (!patternStr) {
            push('');
            push(L
                ? 'Схема пустая → будет обычный повторяющийся On/Off.'
                : 'Pattern is empty → using repeating default On/Off rounds.');
            return lines.join('\n');
        }

        if (!segsAll.length) {
            push('');
            push(L
                ? 'Не удалось разобрать схему (или все шаги нулевые).' 
                : 'Could not parse the pattern (or all steps are zero).');
            push(L
                ? 'Подсказка: используйте пробелы между блоками, проверьте скобки () и множители *N.'
                : 'Tip: put spaces between blocks, and check parentheses () and multipliers *N.');
            return lines.join('\n');
        }

        const patSec = segsAll.reduce((a, s) => a + s.on + s.off, 0);
        const effDurSec = hardStop ? Math.max(1, patSec) : (noCycle ? Math.max(durSec, patSec) : durSec);
        push('');
        push(L ? 'Как будет выполняться' : 'How it runs');
        if (hardStop) {
            push(L
                ? `- "#": схема выполняется 1 раз и тренировка завершается сразу после неё (фактическая длительность = ${effDurSec}s).`
                : `- "#": runs the pattern once, then stops immediately (effective duration = ${effDurSec}s).`);
        } else if (noCycle) {
            const rem = Math.max(0, effDurSec - patSec);
            push(L
                ? `- ";": схема выполняется 1 раз (всё после ";" игнорируется), затем продолжаются обычные раунды On/Off (по базовым On/Off) до конца Duration (остаток после схемы: ${rem}s).`
                : `- ";": runs the pattern once (anything after ";" is ignored), then continues with default On/Off rounds (base On/Off) until Duration ends (remainder after pattern: ${rem}s).`);
            if (patSec > durSec) {
                push(L
                    ? `  (схема длиннее Duration → Duration автоматически увеличится до ${effDurSec}s)`
                    : `  (pattern is longer than Duration → Duration expands to ${effDurSec}s)`);
            }
        } else {
            const full = (patSec > 0) ? Math.floor(durSec / Math.max(1, patSec)) : 0;
            const rem = durSec - full * patSec;
            push(L
                ? `- без ";" и "#": схема повторяется циклически до конца Duration. Один цикл = ${patSec}s · полных циклов = ${full} · остаток = ${rem}s.`
                : `- without ";" or "#": the pattern repeats cyclically until Duration ends. One cycle = ${patSec}s · full cycles = ${full} · remainder = ${rem}s.`);
            push(L
                ? '- Последний блок может быть обрезан, если на него не хватает времени в конце.'
                : '- The last block may be cut short if Duration ends mid-block.');
        }

        push('');
        push(L ? 'Синтаксис (коротко)' : 'Syntax (quick)');
        push(L
            ? '- Блок: `On/Off` или просто `On` (тогда Off берётся как Off по умолчанию).' 
            : '- A block: `On/Off` or just `On` (then Off uses offDefault).');
        push(L
            ? '- Интенсивность: `@work` или `@work/rest` (например `30@8.5/0`).'
            : '- Intensity: `@work` or `@work/rest` (e.g. `30@8.5/0`).');
        push(L
            ? '- Темп метронома на работу: `тNN` (или `tNN`), например `30@8т20`.'
            : '- Metronome tempo for work: `tNN` (or `тNN`), e.g. `30@8t20`.');
        push(L
            ? '- Цель по повторам на работу: `пNN` (или `rNN`). Не смешивать с `tNN` в одном блоке.'
            : '- Work reps target: `rNN` (or `пNN`). Do not mix with `tNN` in the same block.');
        push(L
            ? '- Повторы: `*N`, `xN`, `×N`. Группы: `( ... )*N`.'
            : '- Repeats: `*N`, `xN`, `×N`. Groups: `( ... )*N`.');

        // Detect a repeating multi-step block (common for `( ... )*N`), and explain a single block.
        const same = (a, b) => a.on === b.on
            && a.off === b.off
            && Math.abs(a.eff - b.eff) <= 1e-9
            && Math.abs(a.restEff - b.restEff) <= 1e-9
            && ((a.wTempo ?? null) === (b.wTempo ?? null))
            && ((a.rTempo ?? null) === (b.rTempo ?? null))
            && ((a.wReps ?? null) === (b.wReps ?? null));

        const _detectRepeatBlock = (arr) => {
            const n = arr.length;
            if (n < 2) return null;
            for (let p = 1; p <= Math.floor(n / 2); p++) {
                if (n % p !== 0) continue;
                let ok = true;
                for (let i = p; i < n; i++) {
                    if (!same(arr[i], arr[i % p])) { ok = false; break; }
                }
                if (ok) {
                    const r = n / p;
                    if (r >= 2) return { period: p, repeats: r, unit: arr.slice(0, p) };
                }
            }
            return null;
        };

        const rep = _detectRepeatBlock(segsAll);
        const segs = rep ? rep.unit : segsAll;

        // Run-length encode identical steps to keep explanation compact.
        const chunks = [];
        for (const s of segs) {
            const last = chunks[chunks.length - 1];
            if (last && same(last.seg, s)) last.n += 1;
            else chunks.push({ seg: s, n: 1 });
        }

        push('');
        push(L ? `Шаги (после раскрытия групп): ${segsAll.length}` : `Steps (after expanding groups): ${segsAll.length}`);
        if (rep) {
            const secUnit = rep.unit.reduce((a, s) => a + s.on + s.off, 0);
            push(L
                ? `Повторяющийся блок: ${rep.period} шаг(ов), ${secUnit}s · повторяем ×${rep.repeats}`
                : `Repeating block: ${rep.period} step(s), ${secUnit}s · repeat ×${rep.repeats}`);
            push(L
                ? 'Ниже показан один блок (без многократного дублирования).'
                : 'Showing a single block (without printing it many times).');
        }

        // Compact summary: show the pattern as N distinct blocks with repeats.
        // Helps quickly validate that multipliers and @-suffixes were interpreted correctly.
        {
            const tSym = (LANG === 'ru') ? 'т' : 't';
            const rSym = (LANG === 'ru') ? 'п' : 'r';
            const fmtTempoTok = (rpm) => {
                if (!Number.isFinite(+rpm)) return '';
                const k = Math.round(+rpm);
                return (k > 0) ? `${tSym}${Math.max(5, Math.min(240, k))}` : '';
            };
            const fmtRepsTok = (reps) => {
                if (!Number.isFinite(+reps)) return '';
                const k = Math.round(+reps);
                return (k > 0) ? `${rSym}${Math.max(1, k)}` : '';
            };
            const fmtChunkTok = (seg) => {
                const on = Math.max(0, Math.floor(+seg?.on || 0));
                const off = Math.max(0, Math.floor(+seg?.off || 0));
                const eff = Number.isFinite(+seg?.eff) ? +seg.eff : workEffDef;
                const restEff = Number.isFinite(+seg?.restEff) ? +seg.restEff : restEffDef;
                const wTempo = Number.isFinite(+seg?.wTempo) ? +seg.wTempo : null;
                const rTempo = Number.isFinite(+seg?.rTempo) ? +seg.rTempo : null;
                const wReps = Number.isFinite(+seg?.wReps) ? +seg.wReps : null;

                const left = `${_fmtEff(eff)}${fmtTempoTok(wTempo)}${fmtRepsTok(wReps)}`;
                let at = `@${left}`;
                if (off > 0) {
                    const right = `${_fmtEff(restEff)}${fmtTempoTok(rTempo)}`;
                    at = `@${left}/${right}`;
                }
                return `${on}/${off}${at}`;
            };

            const maxCompact = 12;
            const parts = [];
            for (let idx = 0; idx < chunks.length && idx < maxCompact; idx++) {
                const ch = chunks[idx];
                const tok = fmtChunkTok(ch.seg);
                parts.push(ch.n > 1 ? `${tok}×${ch.n}` : tok);
            }
            if (chunks.length > maxCompact) parts.push('…');

            const nBlocks = chunks.length;
            const totalSteps = segs.length;
            const totalSec = segs.reduce((a, s) => a + s.on + s.off, 0);
            push(L
                ? `Сжато: ${nBlocks} блок(ов) → ${totalSteps} шаг(ов), ${totalSec}s: ${parts.join(' ')}`
                : `Compact: ${nBlocks} block(s) → ${totalSteps} step(s), ${totalSec}s: ${parts.join(' ')}`);
        }

        push('');
        push(L ? 'Пошагово' : 'Step-by-step');

        const maxLines = 40;
        let stepNo = 0;
        const warnings = [];
        for (const ch of chunks) {
            const s = ch.seg;
            const n = ch.n;
            // Describe ON phase
            const onKind = (s.eff <= 0.0001) ? 'rest' : 'work';
            const onLabel = (LANG === 'ru')
                ? (onKind === 'work' ? 'Работа' : 'Отдых (вместо работы, @0)')
                : (onKind === 'work' ? 'Work' : 'Rest (instead of work, @0)');
            const onEffTxt = `@${_fmtEff(onKind === 'work' ? s.eff : s.restEff)}`;
            const onTempoTxt = (onKind === 'work' ? _fmtTempo(s.wTempo) : _fmtTempo(s.rTempo));
            const hasRepsTarget = (onKind === 'work' && Number.isFinite(+s.wReps) && +s.wReps > 0 && s.on > 0);
            const derivedTempoTxt = hasRepsTarget ? _fmtTempo((60 * (+s.wReps)) / Math.max(1, s.on)) : '';
            const onRepsTxt = hasRepsTarget
                ? (LANG === 'ru'
                    ? `, цель ${Math.round(+s.wReps)} повт.${derivedTempoTxt ? ` (~${derivedTempoTxt})` : ''}`
                    : `, target ${Math.round(+s.wReps)} reps${derivedTempoTxt ? ` (~${derivedTempoTxt})` : ''}`)
                : '';
            const bothSetWarn = (onKind === 'work' && (Number.isFinite(+s.wReps) && +s.wReps > 0) && (Number.isFinite(+s.wTempo) && +s.wTempo > 0));

            // Describe OFF phase
            const offIsMilestone = (s.off === 0 && s.on > 0);
            const offEffTxt = `@${_fmtEff(s.restEff)}`;
            const offTempoTxt = _fmtTempo(s.rTempo);
            const activeRest = (s.restEff > 0.0001);

            let text = L
                ? `${s.on}s: ${onLabel} ${onEffTxt}${onTempoTxt ? `, темп ${onTempoTxt}` : ''}${onRepsTxt}`
                : `${s.on}s: ${onLabel} ${onEffTxt}${onTempoTxt ? `, tempo ${onTempoTxt}` : ''}${onRepsTxt}`;

            if (s.off > 0) {
                text += L
                    ? ` → ${s.off}s отдых ${offEffTxt}${offTempoTxt ? `, темп ${offTempoTxt}` : ''}${activeRest ? ' (активный)' : ''}`
                    : ` → ${s.off}s rest ${offEffTxt}${offTempoTxt ? `, tempo ${offTempoTxt}` : ''}${activeRest ? ' (active)' : ''}`;
            } else if (offIsMilestone) {
                text += L
                    ? ` → Off=0 (без паузы между шагами)`
                    : ` → Off=0 (no pause between steps)`;
            }

            if (s.restEff > s.eff + 1e-9) {
                warnings.push(L
                    ? `Интенсивность отдыха выше работы в одном из шагов: ${_fmtEff(s.restEff)} > ${_fmtEff(s.eff)}`
                    : `Rest intensity is higher than work in a step: ${_fmtEff(s.restEff)} > ${_fmtEff(s.eff)}`);
            }
            if (bothSetWarn) {
                warnings.push(L
                    ? 'В одном блоке одновременно заданы и темп (tNN), и цель повторов (пNN/rNN) — это взаимоисключимо.'
                    : 'A block sets both tempo (tNN) and reps target (rNN/пNN) — these are mutually exclusive.');
            }

            const prefix = (n > 1) ? `×${n}: ` : '';
            push(`${prefix}${text}`);
            stepNo += n;
            if (lines.length >= (18 + maxLines)) {
                const left = segs.length - stepNo;
                if (left > 0) push(L ? `… и ещё ${left} шаг(ов)` : `… plus ${left} more step(s)`);
                break;
            }
        }

        if (warnings.length) {
            push('');
            push(L ? 'Предупреждения' : 'Warnings');
            const uniq = [...new Set(warnings)];
            for (const w of uniq.slice(0, 6)) push(`- ${w}`);
            if (uniq.length > 6) push(L ? `- … и ещё ${uniq.length - 6}` : `- … plus ${uniq.length - 6} more`);
        }

        return lines.join('\n');
    }

    // Unified Explain panel wiring (inside zpmodal)
    function _zarExplainBuildFromZpInput() {
        const pat = String($("zpInput")?.value || '').trim();
        if ($("zpExplainPattern")) $("zpExplainPattern").textContent = pat || '';
        if (!pat) {
            if ($("zpExplainText")) $("zpExplainText").textContent = '';
            return;
        }
        const mode = ($("zarMode")?.value === 'universal') ? 'universal' : 'classic';
        const offDefault = Math.max(0, Math.floor(+($(mode === 'universal' ? 'zarOffU' : 'zarOffC'))?.value || 30));
        const baseOnSec = Math.max(1, Math.floor(+($(mode === 'universal' ? 'zarOnU' : 'zarOnC'))?.value || 30));
        const baseOffSec = offDefault;
        const durSec = Math.max(1, Math.floor(+($(mode === 'universal' ? 'zarDurU' : 'zarDurC'))?.value || 300));
        const segs = (typeof window.parseZarPattern === 'function') ? window.parseZarPattern(pat, offDefault) : [];
        const workEffDef = +($(mode === 'universal' ? 'zarEffU' : 'zarEffC')?.value || (mode === 'universal' ? 5.0 : 8.5));
        const restEffDef = _zarReadDefaultRestEff10(mode);
        const txt = _explainZarPatternToText({ mode, durSec, baseOnSec, baseOffSec, offDefault, patternStr: pat, segs, defaultWorkEff10: workEffDef, defaultRestEff10: restEffDef });
        if ($("zpExplainText")) $("zpExplainText").textContent = txt;
    }

    function _tzZpmPlanClear() {
        try {
            const tbody = $("zpPlanTbody");
            if (tbody) while (tbody.firstChild) tbody.removeChild(tbody.firstChild);
        } catch (_) {}
        try {
            const footer = $("zpPlanFooter");
            if (footer) footer.textContent = '';
        } catch (_) {}
    }

    function _tzZpmPlanBuildAndRender() {
        try {
            const tbody = $("zpPlanTbody");
            const footer = $("zpPlanFooter");
            if (!tbody) return;

            const patStr = String($("zpInput")?.value || '').trim();
            if (!patStr) {
                _tzZpmPlanClear();
                return;
            }

            const parse = (typeof window !== 'undefined' && typeof window.parseZarPattern === 'function')
                ? window.parseZarPattern
                : (window.SimCore?.parseZarPattern);
            const SimCore = window.SimCore;
            if (typeof parse !== 'function') {
                _tzZpmPlanClear();
                if (footer) footer.textContent = (LANG === 'ru') ? 'Парсер схемы не загружен.' : 'Pattern parser is not loaded.';
                return;
            }

            const methodKey = String(_tzZpContext?.methodKey || 'ZRB').toUpperCase();
            const isZrb = (methodKey === 'ZRB');

            const mode = ($("zarMode")?.value === 'universal') ? 'universal' : 'classic';
            const offDefault = Math.max(0, Math.floor(+($(mode === 'universal' ? 'zarOffU' : 'zarOffC'))?.value || 30));
            const durUiSec = Math.max(1, Math.floor(+($(mode === 'universal' ? 'zarDurU' : 'zarDurC'))?.value || 300));
            const workEffDef = +($(mode === 'universal' ? 'zarEffU' : 'zarEffC')?.value || (mode === 'universal' ? 5.0 : 8.5));
            const restEffDef = _zarDefaultRestEff10FromUI();

            const parsed = parse(patStr, offDefault);
            const segsRaw = Array.isArray(parsed) ? parsed : [];
            const parsedNoCycle = !!(parsed && parsed._noCycle);
            const parsedHardStop = !!(parsed && parsed._hardStop);

            const forceOneShot = !isZrb;
            const noCycle = forceOneShot ? true : parsedNoCycle;
            const hardStop = forceOneShot ? true : parsedHardStop;

            const normSegs = segsRaw.map((s) => {
                const on = Math.max(0, Math.floor(+s?.on || 0));
                const off = Math.max(0, Math.floor(+s?.off || 0));
                const eff = Number.isFinite(+s?.eff) ? (+s.eff) : (+workEffDef);
                const restEff = Number.isFinite(+s?.restEff) ? (+s.restEff) : (+restEffDef);
                const workTempoRpm = Number.isFinite(+s?.workTempoRpm) ? Math.max(5, Math.min(240, Math.round(+s.workTempoRpm))) : null;
                const restTempoRpm = Number.isFinite(+s?.restTempoRpm) ? Math.max(5, Math.min(240, Math.round(+s.restTempoRpm))) : null;
                const workReps = Number.isFinite(+s?.workReps) ? Math.max(0, Math.floor(+s.workReps)) : null;
                return { on, off, eff, restEff, workTempoRpm, restTempoRpm, workReps };
            }).filter(s => (s.on + s.off) > 0);

            if (!normSegs.length) {
                _tzZpmPlanClear();
                if (footer) footer.textContent = (LANG === 'ru') ? 'Не удалось разобрать схему.' : 'Could not parse the pattern.';
                return;
            }

            const patSec = normSegs.reduce((a, s) => a + s.on + s.off, 0);
            const effDurSec = hardStop
                ? Math.max(1, Math.floor(patSec || 1))
                : (noCycle ? Math.max(durUiSec, Math.floor(patSec || 0)) : durUiSec);

            // Build phases (timeline expanded to effective duration)
            const phases = [];
            let t = 0;
            let itemNoAbs = 0;
            let cycleNo = 1;
            const patternLen = normSegs.length;
            const pushPhase = (o) => {
                try {
                    phases.push(o);
                } catch (_) {}
            };

            const maxPhases = 8000;
            const maxCycles = 2500;

            while (t < effDurSec - 1e-9) {
                for (let i = 0; i < normSegs.length; i++) {
                    if (t >= effDurSec - 1e-9) break;
                    const s = normSegs[i] || {};
                    itemNoAbs++;
                    const meta = { itemNoAbs, itemInCycle: i + 1, patternLen, cycleNo };

                    const onSec = Math.max(0, Math.floor(+s.on || 0));
                    if (onSec > 0 && t < effDurSec - 1e-9) {
                        const start = t;
                        const end = Math.min(effDurSec, start + onSec);
                        const isWork = Number.isFinite(+s.eff) && (+s.eff) > 0.0001;
                        if (isWork) {
                            pushPhase({
                                kind: 'work',
                                start,
                                end,
                                eff: +s.eff,
                                tempoRpm: (s.workTempoRpm == null) ? null : +s.workTempoRpm,
                                repsTarget: (s.workReps == null) ? null : Math.max(0, Math.floor(+s.workReps)),
                                ...meta
                            });
                        } else {
                            // @0 means: ON time is simulated as rest
                            pushPhase({
                                kind: 'rest',
                                start,
                                end,
                                eff: +s.restEff,
                                tempoRpm: (s.restTempoRpm == null) ? null : +s.restTempoRpm,
                                repsTarget: null,
                                ...meta
                            });
                        }
                        t = end;
                    }

                    const offSec = Math.max(0, Math.floor(+s.off || 0));
                    if (offSec > 0 && t < effDurSec - 1e-9) {
                        const start = t;
                        const end = Math.min(effDurSec, start + offSec);
                        pushPhase({
                            kind: 'rest',
                            start,
                            end,
                            eff: +s.restEff,
                            tempoRpm: (s.restTempoRpm == null) ? null : +s.restTempoRpm,
                            repsTarget: null,
                            ...meta
                        });
                        t = end;
                    }

                    if (phases.length > maxPhases) break;
                }

                if (hardStop || noCycle) break;
                cycleNo++;
                if (cycleNo > maxCycles) break;
                if (patternLen <= 0 || patSec <= 0) break;
            }

            // Compute click plan times for this pattern/duration (same model params as Big Screen plan)
            let times = [];
            try {
                if (SimCore && typeof SimCore.simulateZarubaClickPlan === 'function') {
                    try { _zarPerfSyncModelFromUI(); } catch (_) {}
                    const model = {
                        cadenceMaxRpm: Math.max(1, +($('zarOptCad')?.value || 20)),
                        allOutSec: Math.max(5, +($('zarOptAllOut')?.value || 45)),
                        recTauSec: Math.max(5, +($('zarOptRec')?.value || 30)),
                        tempoFatiguePow: Math.max(0.5, Math.min(3.0, +($('zarOptTempoPow')?.value || 1.0))),
                        minCadenceFrac: Math.max(0, Math.min(1, +(_zarPerf?.model?.minCadenceFrac ?? 0.35))),
                        fCrit: Math.max(0, Math.min(1, +(_zarPerf?.model?.fCrit ?? 0.85))),
                        switchCostSec: Math.max(0, Math.floor(_zarSwitchCostSec())),
                        defaultEff10: 10,
                        defaultRestEff10: _zarDefaultRestEff10FromUI()
                    };

                    const patForSim = normSegs.map(s => ({
                        on: Math.max(0, Math.floor(+s.on || 0)),
                        off: Math.max(0, Math.floor(+s.off || 0)),
                        eff: Number.isFinite(+s.eff) ? (+s.eff) : 10,
                        restEff: Number.isFinite(+s.restEff) ? (+s.restEff) : 0,
                        workTempoRpm: Number.isFinite(+s.workTempoRpm) ? (+s.workTempoRpm) : undefined,
                        workReps: Number.isFinite(+s.workReps) ? Math.max(0, Math.floor(+s.workReps)) : undefined
                    }));

                    const sim = SimCore.simulateZarubaClickPlan(patForSim, effDurSec, model);
                    times = Array.isArray(sim?.clickTimesSec) ? sim.clickTimesSec : [];
                }
            } catch (_) {
                times = [];
            }

            // Token mode policy (local, independent of _zarScreen.timelineOverride)
            const hasRepsTok = phases.some(ph => String(ph?.kind) === 'work' && Number.isFinite(+ph?.repsTarget) && (+ph.repsTarget) >= 1);
            const hasTempoTok = phases.some(ph => String(ph?.kind) === 'work' && Number.isFinite(+ph?.tempoRpm) && (+ph.tempoRpm) > 0.5);
            const defaultMode = isZrb ? 'reps' : 'none';
            const tokMode = hasRepsTok ? 'reps' : (hasTempoTok ? 'tempo' : defaultMode);
            const showReps = (tokMode === 'reps');

            try {
                const thReps = $("zpPlanThReps");
                const thTotal = $("zpPlanThTotal");
                if (thReps) thReps.style.display = showReps ? '' : 'none';
                if (thTotal) thTotal.style.display = showReps ? '' : 'none';
            } catch (_) {}

            const countInRange = (a, b) => {
                if (!times.length) return 0;
                const start = Math.max(0, +a || 0);
                const end = Math.max(start, +b || 0);
                // lower_bound(start)
                let lo = 0, hi = times.length;
                while (lo < hi) {
                    const mid = (lo + hi) >> 1;
                    if ((+times[mid] || 0) < start) lo = mid + 1; else hi = mid;
                }
                const i0 = lo;
                // lower_bound(end)
                lo = i0; hi = times.length;
                while (lo < hi) {
                    const mid = (lo + hi) >> 1;
                    if ((+times[mid] || 0) < end) lo = mid + 1; else hi = mid;
                }
                const i1 = lo;
                return Math.max(0, i1 - i0);
            };

            // Clear
            while (tbody.firstChild) tbody.removeChild(tbody.firstChild);

            let workIdx = 0;
            let total = 0;
            for (const ph of (phases || [])) {
                const kind = String(ph?.kind || '');
                if (kind !== 'work' && kind !== 'rest') continue;

                const start = Math.max(0, +ph.start || 0);
                const end = Math.max(start, +ph.end || 0);

                let repsN = 0;
                let label = '';
                let tempoTxt = '';

                if (kind === 'work') {
                    workIdx++;
                    repsN = Math.max(0, Math.floor(countInRange(start, end)));
                    total += repsN;

                    label = _zarScreenFmtIntervalLabel(ph)
                        || ((LANG === 'ru') ? `Интервал ${workIdx}` : `Interval ${workIdx}`);

                    const durSec = Math.max(0, end - start);
                    const hasTempoOverride = (Number.isFinite(+ph?.tempoRpm) && (+ph.tempoRpm) > 0.5);
                    const hasRepsTarget = (ph?.repsTarget != null && Number.isFinite(+ph?.repsTarget) && (+ph.repsTarget) >= 1);
                    if (hasTempoOverride) {
                        const cap = _zarModelCadenceCapRpm(ph?.tempoRpm);
                        tempoTxt = (cap > 0.5) ? String(Math.round(cap)) : '';
                    } else if (hasRepsTarget && durSec > 0.5 && repsN > 0) {
                        const avg = 60 * repsN / durSec;
                        tempoTxt = (Number.isFinite(avg) && avg > 0.5) ? String(Math.round(avg)) : '';
                    } else {
                        const cap = _zarModelCadenceCapRpm(ph?.tempoRpm);
                        const frac = Math.max(0, Math.min(1, (+ph?.eff || 0) / 10));
                        const tempo = cap * frac;
                        tempoTxt = (Number.isFinite(+tempo) && (+tempo) > 0.5) ? String(Math.round(+tempo)) : '';
                    }
                } else {
                    label = (LANG === 'ru') ? 'Отдых' : 'Rest';
                    repsN = 0;
                    if (Number.isFinite(+ph?.tempoRpm) && (+ph.tempoRpm) > 0.5) {
                        const cap = _zarModelCadenceCapRpm(ph?.tempoRpm);
                        tempoTxt = (cap > 0.5) ? String(Math.round(cap)) : '';
                    }
                }

                const tr = document.createElement('tr');
                const tdTime = document.createElement('td');
                tdTime.className = 'mono';
                tdTime.textContent = _zarFmtMMSS(start);
                const tdInt = document.createElement('td');
                tdInt.textContent = label;
                const tdTempo = document.createElement('td');
                tdTempo.className = 'mono';
                tdTempo.textContent = tempoTxt;
                const tdReps = document.createElement('td');
                tdReps.className = 'mono';
                tdReps.textContent = showReps ? String(repsN) : '';
                tdReps.style.display = showReps ? '' : 'none';
                const tdTotal = document.createElement('td');
                tdTotal.className = 'mono';
                tdTotal.textContent = showReps ? String(total) : '';
                tdTotal.style.display = showReps ? '' : 'none';

                tr.appendChild(tdTime);
                tr.appendChild(tdInt);
                tr.appendChild(tdTempo);
                tr.appendChild(tdReps);
                tr.appendChild(tdTotal);
                tbody.appendChild(tr);
            }

            if (footer) {
                if (showReps) {
                    footer.textContent = (LANG === 'ru')
                        ? `Всего: ${total} ${_zarRuRepWord(total)} · длительность ${_zarFmtMMSS(effDurSec)}`
                        : `Total: ${total} reps · duration ${_zarFmtMMSS(effDurSec)}`;
                } else {
                    footer.textContent = (LANG === 'ru')
                        ? `Длительность ${_zarFmtMMSS(effDurSec)}`
                        : `Duration ${_zarFmtMMSS(effDurSec)}`;
                }
            }
        } catch (e) {
            try {
                _tzZpmPlanClear();
                const footer = $("zpPlanFooter");
                if (footer) footer.textContent = (LANG === 'ru') ? 'Не удалось построить план.' : 'Failed to build plan.';
            } catch (_) {}
        }
    }

    // --- Scheme Library (presets + user saved) ---
    const _TZ_ZPM_CUSTOM_KEY = 'tz_zpm_custom_schemes_v1';

    function _tzZpmPresetTitle(p) {
        try {
            const t = p?.title;
            if (t && typeof t === 'object') {
                const s = (LANG === 'ru') ? (t.ru || t.en) : (t.en || t.ru);
                if (s) return String(s);
            }
            if (typeof t === 'string') return String(t);
            if (p?.id) return String(p.id);
        } catch (_) {}
        return (LANG === 'ru') ? 'Схема' : 'Scheme';
    }

    function _tzZpmReadCustomSchemes() {
        try {
            const raw = localStorage.getItem(_TZ_ZPM_CUSTOM_KEY);
            if (!raw) return [];
            const arr = JSON.parse(raw);
            if (!Array.isArray(arr)) return [];
            return arr
                .map(x => ({
                    id: String(x?.id || ''),
                    name: String(x?.name || ''),
                    pattern: String(x?.pattern || ''),
                    createdAt: Number.isFinite(+x?.createdAt) ? (+x.createdAt) : null
                }))
                .filter(x => x.id && x.pattern);
        } catch (_) {
            return [];
        }
    }

    function _tzZpmWriteCustomSchemes(list) {
        try {
            const arr = Array.isArray(list) ? list : [];
            localStorage.setItem(_TZ_ZPM_CUSTOM_KEY, JSON.stringify(arr));
        } catch (_) {}
    }

    function _tzZpmCustomSchemesToJson() {
        try {
            const list = _tzZpmReadCustomSchemes();
            // One-line JSON for easy sharing
            return JSON.stringify(list);
        } catch (_) {
            return '[]';
        }
    }

    function _tzZpmMergeImportedSchemes(imported) {
        const max = 60;
        const cur = _tzZpmReadCustomSchemes();
        const out = Array.isArray(cur) ? cur.slice() : [];

        const normName = (s) => String(s || '').trim().toLowerCase();
        const normPat = (s) => String(s || '').trim();
        const now = Date.now();

        const incoming = Array.isArray(imported) ? imported : [];
        for (const x of incoming) {
            const name = String(x?.name || '').trim();
            const pattern = String(x?.pattern || '').trim();
            if (!name || !pattern) continue;
            const createdAt = Number.isFinite(+x?.createdAt) ? (+x.createdAt) : now;
            const id = String(x?.id || `c_${createdAt}_${Math.random().toString(16).slice(2)}`);

            // Dedup: by name (case-insensitive) OR exact pattern
            const idxByName = out.findIndex(s => normName(s?.name) === normName(name));
            const idxByPat = out.findIndex(s => normPat(s?.pattern) === normPat(pattern));
            const idx = (idxByName >= 0) ? idxByName : idxByPat;
            if (idx >= 0) {
                out[idx] = { ...out[idx], id: out[idx].id || id, name, pattern, createdAt };
            } else {
                out.push({ id, name, pattern, createdAt });
            }
        }

        out.sort((a, b) => ((b.createdAt || 0) - (a.createdAt || 0)));
        if (out.length > max) out.length = max;
        _tzZpmWriteCustomSchemes(out);
        return out;
    }

    function _tzZpmApplyPatternFromLibrary(patternStr) {
        try {
            const input = $("zpInput");
            if (!input) return;
            input.value = String(patternStr || '');
            try {
                const det = $("zpPlanDet");
                if (det && det.open) _tzZpmPlanBuildAndRender();
            } catch (_) {}
            try {
                const det = $("zpExplainDet");
                if (det && det.open) {
                    det._forceBuildOnOpen = true;
                    det._lastPat = String(input.value || '').trim();
                    _zarExplainBuildFromZpInput();
                }
            } catch (_) {}
            setTimeout(() => { try { _tzMaybeFocus(input); } catch (_) {} }, 50);
        } catch (_) {}
    }

    function _tzZpmRenderLibrary() {
        try {
            const wrapPresets = $("zpLibPresets");
            const wrapCustom = $("zpLibCustom");
            if (!wrapPresets || !wrapCustom) return;

            // Clear
            while (wrapPresets.firstChild) wrapPresets.removeChild(wrapPresets.firstChild);
            while (wrapCustom.firstChild) wrapCustom.removeChild(wrapCustom.firstChild);

            const presets = Array.isArray(window.ZARUBA_PRESETS) ? window.ZARUBA_PRESETS : [];
            if (!presets.length) {
                const s = document.createElement('span');
                s.className = 'caption';
                s.style.opacity = '0.7';
                s.textContent = (LANG === 'ru')
                    ? 'Нет пресетов (проверьте zaruba-presets.js)'
                    : 'No presets (check zaruba-presets.js)';
                wrapPresets.appendChild(s);
            } else {
                for (const p of presets) {
                    const pat = String(p?.pattern || '').trim();
                    if (!pat) continue;
                    const b = document.createElement('button');
                    b.className = 'btn';
                    b.type = 'button';
                    b.textContent = _tzZpmPresetTitle(p);
                    try { b.title = pat; } catch (_) {}
                    b.addEventListener('click', () => _tzZpmApplyPatternFromLibrary(pat));
                    wrapPresets.appendChild(b);
                }
            }

            const custom = _tzZpmReadCustomSchemes();
            if (!custom.length) {
                const s = document.createElement('span');
                s.className = 'caption';
                s.style.opacity = '0.7';
                s.textContent = (LANG === 'ru')
                    ? 'Пока пусто. Нажмите «Сохранить». '
                    : 'Empty. Click “Save”.';
                wrapCustom.appendChild(s);
            } else {
                // newest first
                custom.sort((a, b) => ((b.createdAt || 0) - (a.createdAt || 0)));
                for (const it of custom) {
                    const row = document.createElement('span');
                    row.style.display = 'inline-flex';
                    row.style.gap = '6px';
                    row.style.alignItems = 'center';

                    const b = document.createElement('button');
                    b.className = 'btn';
                    b.type = 'button';
                    b.textContent = String(it.name || (LANG === 'ru' ? 'Моя схема' : 'My scheme'));
                    try { b.title = String(it.pattern || ''); } catch (_) {}
                    b.addEventListener('click', () => _tzZpmApplyPatternFromLibrary(it.pattern));

                    const del = document.createElement('button');
                    del.className = 'btn';
                    del.type = 'button';
                    del.textContent = '✕';
                    try {
                        del.title = (LANG === 'ru') ? 'Удалить' : 'Delete';
                        del.style.padding = '4px 8px';
                    } catch (_) {}
                    del.addEventListener('click', () => {
                        try {
                            const ok = confirm((LANG === 'ru')
                                ? `Удалить схему «${it.name}»?`
                                : `Delete scheme “${it.name}”?`);
                            if (!ok) return;
                            const left = _tzZpmReadCustomSchemes().filter(x => String(x?.id) !== String(it.id));
                            _tzZpmWriteCustomSchemes(left);
                            _tzZpmRenderLibrary();
                        } catch (_) {}
                    });

                    row.appendChild(b);
                    row.appendChild(del);
                    wrapCustom.appendChild(row);
                }
            }
        } catch (_) {}
    }

    try {
        const btnSave = $("zpLibSave");
        if (btnSave && !btnSave._wired) {
            btnSave.addEventListener('click', () => {
                try {
                    const pat = String($("zpInput")?.value || '').trim();
                    if (!pat) {
                        try {
                            const hint = $("zpLibHint");
                            if (hint) hint.textContent = (LANG === 'ru') ? 'Пустая схема — нечего сохранять.' : 'Pattern is empty.';
                            setTimeout(() => { try { if (hint) hint.textContent = (LANG === 'ru') ? 'Сохранение локально в браузере (на этом устройстве)' : 'Saved locally in your browser (on this device)'; } catch (_) {} }, 1400);
                        } catch (_) {}
                        return;
                    }

                    const defName = (LANG === 'ru') ? 'Моя схема' : 'My scheme';
                    let name = String($("zpLibName")?.value || '').trim();
                    if (!name) name = defName;

                    const list = _tzZpmReadCustomSchemes();
                    const now = Date.now();

                    // Upsert by name (simplest user mental model)
                    const existingIdx = list.findIndex(x => String(x?.name || '').toLowerCase() === name.toLowerCase());
                    if (existingIdx >= 0) {
                        list[existingIdx] = {
                            ...list[existingIdx],
                            name,
                            pattern: pat,
                            createdAt: now
                        };
                    } else {
                        const id = `c_${now}_${Math.random().toString(16).slice(2)}`;
                        list.push({ id, name, pattern: pat, createdAt: now });
                    }

                    // Keep it bounded
                    const max = 60;
                    if (list.length > max) {
                        list.sort((a, b) => ((b.createdAt || 0) - (a.createdAt || 0)));
                        list.length = max;
                    }

                    _tzZpmWriteCustomSchemes(list);
                    _tzZpmRenderLibrary();

                    try {
                        const hint = $("zpLibHint");
                        if (hint) hint.textContent = (LANG === 'ru') ? 'Сохранено.' : 'Saved.';
                        setTimeout(() => { try { if (hint) hint.textContent = (LANG === 'ru') ? 'Сохранение локально в браузере (на этом устройстве)' : 'Saved locally in your browser (on this device)'; } catch (_) {} }, 1200);
                    } catch (_) {}
                } catch (_) {}
            });
            btnSave._wired = true;
        }
    } catch (_) {}

    try {
        const btnExport = $("zpLibExport");
        if (btnExport && !btnExport._wired) {
            btnExport.addEventListener('click', () => {
                try {
                    const ta = $("zpLibJson");
                    if (!ta) return;
                    ta.value = _tzZpmCustomSchemesToJson();
                } catch (_) {}
            });
            btnExport._wired = true;
        }

        const btnCopy = $("zpLibCopyJson");
        if (btnCopy && !btnCopy._wired) {
            btnCopy.addEventListener('click', async () => {
                try {
                    const ta = $("zpLibJson");
                    const text = String(ta?.value || '').trim();
                    if (!text) return;
                    if (navigator.clipboard?.writeText) {
                        await navigator.clipboard.writeText(text);
                    } else {
                        prompt((LANG === 'ru') ? 'Скопируйте JSON:' : 'Copy JSON:', text);
                    }
                    try {
                        const hint = $("zpLibHint");
                        if (hint) hint.textContent = (LANG === 'ru') ? 'JSON скопирован.' : 'JSON copied.';
                        setTimeout(() => { try { if (hint) hint.textContent = (LANG === 'ru') ? 'Сохранение локально в браузере (на этом устройстве)' : 'Saved locally in your browser (on this device)'; } catch (_) {} }, 1200);
                    } catch (_) {}
                } catch (_) {}
            });
            btnCopy._wired = true;
        }

        const btnImport = $("zpLibImport");
        if (btnImport && !btnImport._wired) {
            btnImport.addEventListener('click', () => {
                try {
                    const ta = $("zpLibJson");
                    const raw = String(ta?.value || '').trim();
                    if (!raw) return;
                    const parsed = JSON.parse(raw);
                    if (!Array.isArray(parsed)) throw new Error('not array');
                    _tzZpmMergeImportedSchemes(parsed);
                    _tzZpmRenderLibrary();

                    try {
                        const hint = $("zpLibHint");
                        if (hint) hint.textContent = (LANG === 'ru') ? 'Импортировано.' : 'Imported.';
                        setTimeout(() => { try { if (hint) hint.textContent = (LANG === 'ru') ? 'Сохранение локально в браузере (на этом устройстве)' : 'Saved locally in your browser (on this device)'; } catch (_) {} }, 1200);
                    } catch (_) {}
                } catch (_) {
                    try {
                        const hint = $("zpLibHint");
                        if (hint) hint.textContent = (LANG === 'ru') ? 'Не удалось импортировать JSON.' : 'Failed to import JSON.';
                        setTimeout(() => { try { if (hint) hint.textContent = (LANG === 'ru') ? 'Сохранение локально в браузере (на этом устройстве)' : 'Saved locally in your browser (on this device)'; } catch (_) {} }, 1600);
                    } catch (_) {}
                }
            });
            btnImport._wired = true;
        }
    } catch (_) {}

    const _tzZpmPlanDebounced = (() => {
        let to = 0;
        return () => {
            try { if (to) clearTimeout(to); } catch (_) {}
            to = setTimeout(() => {
                try { _tzZpmPlanBuildAndRender(); } catch (_) {}
            }, 160);
        };
    })();

    try {
        const det = $("zpPlanDet");
        if (det && !det._wiredPlan) {
            det.addEventListener('toggle', () => {
                try {
                    if (!det.open) return;
                    _tzZpmPlanBuildAndRender();
                } catch (_) {}
            });
            det._wiredPlan = true;
        }
        const inp = $("zpInput");
        if (inp && !inp._wiredPlanInput) {
            inp.addEventListener('input', () => {
                try {
                    const d = $("zpPlanDet");
                    if (d && d.open) _tzZpmPlanDebounced();
                } catch (_) {}
            });
            inp._wiredPlanInput = true;
        }
    } catch (_) {}

    const zpExplainDet = $("zpExplainDet");
    if (zpExplainDet && !zpExplainDet._wiredAuto) {
        zpExplainDet.addEventListener('toggle', () => {
            try {
                if (!zpExplainDet.open) return;
                const pat = String($("zpInput")?.value || '').trim();
                if (zpExplainDet._forceBuildOnOpen) {
                    zpExplainDet._forceBuildOnOpen = false;
                    zpExplainDet._lastPat = pat;
                    _zarExplainBuildFromZpInput();
                    return;
                }
                const last = String(zpExplainDet._lastPat || '');
                const hasText = String($("zpExplainText")?.textContent || '').trim().length > 0;
                if (pat && (pat !== last || !hasText)) {
                    zpExplainDet._lastPat = pat;
                    _zarExplainBuildFromZpInput();
                }
            } catch (e) { console.error(e); }
        });
        zpExplainDet._wiredAuto = true;
    }

    const zpExplainUpdate = $("zpExplainUpdate");
    if (zpExplainUpdate && !zpExplainUpdate._wired) {
        zpExplainUpdate.addEventListener('click', () => {
            try {
                const det = $("zpExplainDet");
                const pat = String($("zpInput")?.value || '').trim();
                if (det && !det.open) {
                    det._forceBuildOnOpen = true;
                    det.open = true;
                    return;
                }
                try { if (det) det._lastPat = pat; } catch (_) {}
                _zarExplainBuildFromZpInput();
            } catch (e) { console.error(e); }
        });
        zpExplainUpdate._wired = true;
    }

    const zpExplainCopy = $("zpExplainCopy");
    if (zpExplainCopy && !zpExplainCopy._wired) {
        zpExplainCopy.addEventListener('click', async () => {
            try {
                const text = String($('zpExplainText')?.textContent || '').trim();
                if (!text) return;
                const okLabel = I18N[LANG]?.copied || (LANG === 'ru' ? 'Скопировано!' : 'Copied!');
                const baseLabel = I18N[LANG]?.copy || (LANG === 'ru' ? 'Скопировать' : 'Copy');
                const done = () => {
                    try { zpExplainCopy.textContent = okLabel; } catch (_) {}
                    setTimeout(() => { try { zpExplainCopy.textContent = baseLabel; } catch (_) {} }, 1200);
                };
                if (navigator.clipboard?.writeText) {
                    await navigator.clipboard.writeText(text);
                    done();
                } else {
                    prompt(LANG === 'ru' ? 'Скопируйте текст вручную:' : 'Copy text manually:', text);
                    done();
                }
            } catch (_) {
                try {
                    const text = String($('zpExplainText')?.textContent || '').trim();
                    if (text) prompt(LANG === 'ru' ? 'Скопируйте текст вручную:' : 'Copy text manually:', text);
                } catch (_) {}
            }
        });
        zpExplainCopy._wired = true;
    }

    // Floating Big Chart (mobile) setup
    (function setupFab(){
        const fab = document.getElementById('fabBig');
        if (!fab || fab._wired) return;
        fab.addEventListener('click', openBigChart);

        const fabScheme = document.getElementById('fabScheme');
        if (fabScheme && !fabScheme._wired) {
            fabScheme.addEventListener('click', () => {
                try { openSchemeForActiveMethod(); } catch (_) {}
                try { if (typeof _tzZpmRenderLibrary === 'function') _tzZpmRenderLibrary(); } catch (_) {}
            });
            fabScheme._wired = true;
        }

        const fabTimer = document.getElementById('fabTimer');
        if (fabTimer && !fabTimer._wired) {
            fabTimer.addEventListener('click', openTimerForActiveMethod);
            fabTimer._wired = true;
        }

        const btnScheme = document.getElementById('btnScheme');
        if (btnScheme && !btnScheme._wired) {
            btnScheme.addEventListener('click', openSchemeForActiveMethod);
            btnScheme._wired = true;
        }

        const btnTimer = document.getElementById('btnTimer');
        if (btnTimer && !btnTimer._wired) {
            btnTimer.addEventListener('click', openTimerForActiveMethod);
            btnTimer._wired = true;
        }

        // Update title per language
        const setLab = () => {
            fab.title = I18N[LANG].big || 'Big chart';
            try { fab.setAttribute('aria-label', I18N[LANG].big || 'Big chart'); } catch (_) {}
            if (fabScheme) {
                const s = (LANG === 'ru') ? 'Схема' : 'Scheme';
                fabScheme.title = s;
                try { fabScheme.setAttribute('aria-label', s); } catch (_) {}
            }
            if (fabTimer) {
                const s = (LANG === 'ru') ? 'Таймер' : 'Timer';
                fabTimer.title = s;
                try { fabTimer.setAttribute('aria-label', s); } catch (_) {}
            }
        };
        setLab();
        fab._wired = true;
        // Update on lang toggle
        const oldToggle = window.toggleLang;
        window.toggleLang = function(){ oldToggle(); try { setLab(); } catch(_){} };
    })();
}

    // --- add near helpers ---
    function effBucket(kind, score) {
    // общие лейблы
    const L = ["Low", "Fair", "Good", "Very good", "Excellent"];
    // пороги по видам (доля "полезной" интенсивной работы от общего времени)
    // подбирал так, чтобы при твоих дефолтах было: SIT ≈ Good, HIIT ≈ Very good
    const TH =
    kind === "SIT" ? [.06, .12, .20, .30] :
    kind === "HIIT" ? [.05, .10, .18, .28] :
    kind === "Z2" ? [.02, .04, .06, .10] :
    [.03, .06, .10, .16]; // Z3–4 / fallback
    return bucket(score, TH, L);
}

    function resetToDefaults() {
    try { _zarMaybeExitSallyPresetMode('reset-defaults'); } catch (_) {}
    CURRENT_PRESET = null;
    $("presetList").value = "";
    $("presetName").value = "";
    localStorage.removeItem("sit_last");

    // Force RU as default language on reset
    LANG = "ru";
    localStorage.setItem("sit_lang", "ru");
    document.documentElement.lang = LANG;

    // Core defaults
    $("age").value = 35; $("hrRest").value = 55; $("hrMax").value = "";
    $("useHRR").checked = true;
    if ($("selActKb")) { $("selActKb").checked = true; }
    if ($("selActRun")) { $("selActRun").checked = false; }
    if ($("selActBike")) { $("selActBike").checked = false; }
    $("drift10").value = "2";
    $("tauOn").value = "25"; $("tauOff").value = "35";
    $("warmup").value = "0"; $("cooldown").value = "5";
    if ($("postRest")) $("postRest").value = "3";
    if ($("sportLevel")) { $("sportLevel").value = "general"; }

    // Methods (default selection)
    setSelectedMethods({ SIT: true, HIIT: true, ZRB: false, Z2: true, Z34: true });

    $("sitWork").value = "30"; $("sitRest").value = "180"; $("sitN").value = "6"; $("sitEff").value = "9.5";
    $("hiitWork").value = "60"; $("hiitRest").value = "60"; $("hiitN").value = "10"; $("hiitEff").value = "8.5";
    if($("hiitRestEff")) $("hiitRestEff").value = "0.0";
    if($("zarMode")) $("zarMode").value = "classic";
    if($("zarDurC")) $("zarDurC").value = "300"; if($("zarOnC")) $("zarOnC").value = "30"; if($("zarOffC")) $("zarOffC").value = "30"; if($("zarEffC")) $("zarEffC").value = "8.5"; if($("zarPatternC")) $("zarPatternC").value = "";
    if($("zarDurU")) $("zarDurU").value = "300"; if($("zarOnU")) $("zarOnU").value = "30"; if($("zarOffU")) $("zarOffU").value = "30"; if($("zarEffU")) $("zarEffU").value = "5.0"; if($("zarPatternU")) $("zarPatternU").value = ""; if($("zarKinU")) $("zarKinU").value = "hiit"; if($("zarRestEffU")) $("zarRestEffU").value = "0.0";
    $("z2Min").value = "40"; $("z2Frac").value = "65";
    $("z34Min").value = "30"; $("z34Frac").value = "75";

    // Snatch defaults
    if ($("snMin")) $("snMin").value = "10";
    if ($("snWeight")) $("snWeight").value = "16";
    if ($("snCad")) $("snCad").value = "20";
    if ($("snProt")) $("snProt").value = "classic";
    if ($("snChangeMin")) $("snChangeMin").value = "5";

    if ($("detInputs")) $("detInputs").open = true;
    if ($("detAdv")) $("detAdv").open = false;
    // Legacy <details> groups have been removed; no-op

    Z2_TARGET_TOUCHED = false;
    AUTO_TUNE_Z2 = true;


    updatePercentLabels();
    setText();                  // re-apply RU texts
    configureRecommendedRanges();
    maybeAutoTuneZ2(true);
    // Ensure at least one method is selected
    ensureDefaultMethodSelection();
    render();

    // If Big Screen is open, refresh the cached plan preview (when idle).
    try {
        if (_zarScreen && _zarScreen.open && !_zarScreen.running && !_zarScreen.started) {
            try { _zarScreen.clickPlan = null; } catch (_) {}
            try { _zarScreenUpdateStatic(); } catch (_) {}
            try {
                const el = $("zarScreenTempo");
                if (el) el.textContent = '';
            } catch (_) {}
            try { _zarScreenUpdateAutoTempoStatus(); } catch (_) {}
            try { if (_zarPlanIsOpen()) _zarPlanRender(); } catch (_) {}
        }
    } catch (_) {}

    updatePresetLabel();
}

    function exportChartPNG() {
    const chart = $("chart");
    const svg = chart.querySelector("svg");
    if (!svg) return;
    const s = new XMLSerializer().serializeToString(svg);
    const img = new Image();
    const w = chart.clientWidth, h = chart.clientHeight;
    img.onload = () => {
    const c = document.createElement("canvas");
    c.width = w; c.height = h;
    const ctx = c.getContext("2d");
    ctx.fillStyle = getComputedStyle(chart).backgroundColor || "#0b1222";
    ctx.fillRect(0, 0, w, h);
    ctx.drawImage(img, 0, 0);
    const a = document.createElement("a");
    a.download = "hr_chart.png";
    a.href = c.toDataURL("image/png");
    a.click();
};
    img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(s);
}
    // Quick EMOM preset for Zaruba: 30s on, 30s off (keeps current Duration)
    function setZarEmomPreset() {
    const clampDurInPlace = (id, fallback) => {
        const el = $(id);
        if (!el) return;
        let v = Math.floor(+el.value);
        if (!Number.isFinite(v)) v = Math.floor(+fallback || 300);
        const min = Number.isFinite(+el.min) ? +el.min : null;
        const max = Number.isFinite(+el.max) ? +el.max : null;
        if (min != null) v = Math.max(min, v);
        if (max != null) v = Math.min(max, v);
        el.value = String(v);
    };

    const mode = ($("zarMode")?.value === 'universal') ? 'universal' : 'classic';
    if (mode === 'universal') {
        clampDurInPlace("zarDurU", 300);
        if ($("zarOnU")) $("zarOnU").value = "30";
        if ($("zarOffU")) $("zarOffU").value = "30";
        if ($("zarPatternU")) $("zarPatternU").value = "";
    } else {
        clampDurInPlace("zarDurC", 300);
        if ($("zarOnC")) $("zarOnC").value = "30";
        if ($("zarOffC")) $("zarOffC").value = "30";
        if ($("zarPatternC")) $("zarPatternC").value = "";
    }
    render();
    saveLastStateDebounced();
}

    // Generate an "optimal" custom Zaruba scheme for the currently selected Duration (heuristic reps model).

    function _zarBuildIntLinspace(minV, maxV, steps) {
        const a = Math.round(+minV);
        const b = Math.round(+maxV);
        const n = Math.max(1, Math.floor(+steps || 1));
        if (!Number.isFinite(a) || !Number.isFinite(b)) return [];
        if (n <= 1 || a === b) return [a];
        const lo = Math.min(a, b);
        const hi = Math.max(a, b);
        const out = [];
        for (let i = 0; i < n; i++) {
            const t = i / (n - 1);
            out.push(Math.round(lo + (hi - lo) * t));
        }
        return out;
    }

    function optimizeZarubaDur() {
        try {
            if (!window.SimCore || typeof window.SimCore.optimizeZarubaPattern !== 'function') {
                alert(LANG==='ru' ? 'Оптимизатор не загружен (SimCore.optimizeZarubaPattern).' : 'Optimizer not loaded (SimCore.optimizeZarubaPattern).');
                return;
            }

            // Force Universal mode (intensity 0..10 matches the optimizer model).
            // UX: optimize for the Duration the user currently sees/sets (Classic or Universal).
            const modeBefore = ($("zarMode")?.value === 'universal') ? 'universal' : 'classic';
            const durIdBefore = (modeBefore === 'universal') ? 'zarDurU' : 'zarDurC';
            const durWanted = Math.max(30, Math.floor(+($(durIdBefore)?.value || 300)));
            const effIdBefore = (modeBefore === 'universal') ? 'zarEffU' : 'zarEffC';
            const effWanted = (() => {
                const v = +($(effIdBefore)?.value || (modeBefore === 'universal' ? 5.0 : 8.5));
                return Number.isFinite(v) ? Math.max(0, Math.min(10, v)) : (modeBefore === 'universal' ? 5.0 : 8.5);
            })();
            if ($("zarMode")) {
                $("zarMode").value = 'universal';
                try { $("zarMode").dispatchEvent(new Event('change', { bubbles: true })); } catch(_) {}
            }
            if ($("zarDurU")) $("zarDurU").value = String(durWanted);
            if ($("zarEffU")) $("zarEffU").value = String(effWanted);
            if ($("zarKinU") && !$("zarKinU").value) $("zarKinU").value = 'hiit';

            const dur = durWanted;

            const allOutSec = Math.max(10, +($("zarOptAllOut")?.value || 45));
            const cadenceMaxRpm = Math.max(5, Math.round(+($("zarOptCad")?.value || 20)));
            const tempoMinPct = Math.max(40, Math.min(100, +($("zarOptTempoMin")?.value || 70)));
            const tempoSteps = Math.max(1, Math.min(9, Math.floor(+($("zarOptTempoSteps")?.value || 5))));
            const tempoFatiguePow = Math.max(0.5, Math.min(3.0, +($("zarOptTempoPow")?.value || 1.4)));
            const tempoSustainPow = Math.max(1.0, Math.min(8.0, +($("zarOptTempoSustainPow")?.value || 3.0)));
            const recTauSec = Math.max(5, +($("zarOptRec")?.value || 30));
            const switchCostSec = Math.max(0, Math.floor(+($("zarOptSwitch")?.value || 1)));
            const cyclesFixed = (() => {
                const v = Math.floor(+($("zarOptCycles")?.value || 0));
                return Math.max(0, Math.min(200, v));
            })();
            const finishSprintSec = (() => {
                const v = Math.floor(+($("zarOptFinish")?.value || 20));
                return Math.max(0, Math.min(120, v));
            })();

            // Tempo search space (rpm). The scheme language encodes tempo inside the @... suffix as tNN/тNN.
            const tempoMinRpm = Math.max(5, Math.round(cadenceMaxRpm * (tempoMinPct / 100)));
            const workTempoSetRpm = Array.from(new Set(_zarBuildIntLinspace(tempoMinRpm, cadenceMaxRpm, tempoSteps)));

            // Optimizer may imply a recommended tempo; for now it equals cadenceMaxRpm.
            _zarAutoTempoRpm = cadenceMaxRpm;
            // Force Big Screen tempo control back to 0 so it follows the optimizer-derived tempo.
            try { if ($("zarScreenMetroRpm")) $("zarScreenMetroRpm").value = '0'; } catch (_) {}
            try { _zarScreenUpdateAutoTempoStatus(); } catch (_) {}

            const kin = String($("zarKinU")?.value || 'hiit').toLowerCase();
            const restEff10 = (kin === 'sit') ? 0 : (+($("zarRestEffU")?.value || 0));
            const workEff10 = (() => {
                const v = +($("zarEffU")?.value || 5.0);
                return Number.isFinite(v) ? Math.max(0, Math.min(10, v)) : 5.0;
            })();

            // If user says "all-out" is small, proposing very long @10 is unrealistic.
            // But when cycles are pinned, we must keep long ON values available to make the duration fill feasible.
            const maxOn = (cyclesFixed > 0)
                ? dur
                : Math.max(15, Math.min(dur, Math.round(allOutSec * 1.15)));
            const onSetBase = (dur <= 600)
                ? [8, 10, 12, 15, 20, 25, 30, 35, 40, 45, 60, 75, 90, 120, 150, 180, 240, 300]
                : [10, 12, 15, 20, 25, 30, 40, 45, 60, 75, 90, 120, 150, 180, 240, 300, 360, 420, 480, 600];
            const onSet = onSetBase.filter(x => x <= maxOn);
            if (!onSet.includes(dur)) onSet.push(dur);

            // Always allow off=0 in the search space: lower-eff/tempo steady work can be optimal.
            const allowZeroOff = true;
            const offSet = (cyclesFixed === 1)
                ? [0]
                : [0, 5, 8, 10, 12, 15, 20, 25, 30, 40, 60, 90, 120, 180];

            // New semantics: work "intensity" is fixed; lower pace is expressed via tempo (tXX).
            // Keep effSet single-valued so the optimizer encodes pacing via workTempoRpm.
            const effSet = [workEff10];

            // DP cost grows ~linearly with duration; trade precision for speed on longer attempts.
            const fatigueStep = (dur <= 600) ? 0.02 : (dur <= 1200 ? 0.03 : 0.04);

            const res = window.SimCore.optimizeZarubaPattern({
                durSec: dur,
                restEff10,
                onSet,
                offSet,
                effSet,
                workTempoSetRpm,
                workTempoMode: 'tempo',
                minOnSec: 8,
                minOffSec: (cyclesFixed >= 2 ? 5 : 0),
                fatigueStep,
                fixedCycles: (cyclesFixed > 0 ? cyclesFixed : undefined),
                finishSprintSec,
                tempoSustainPow,
                // If the user explicitly pins cycle count, allow piecewise-constant pacing with no rest between work blocks.
                // This enables "steady + finish sprint" (e.g. 240/0 + 60/0) instead of forcing a rest separator.
                allowContinuousWorkSegments: (cyclesFixed > 0),
                model: {
                    allOutSec,
                    cadenceMaxRpm,
                    recTauSec,
                    switchCostSec,
                    // Defaults; can be exposed later
                    minCadenceFrac: 0.35,
                    alpha: 1.25,
                    beta: 1.0,
                    fCrit: 0.85,
                    tempoFatiguePow,
                    defaultRestEff10: restEff10
                }
            });

            let pattern = Array.isArray(res?.pattern) ? res.pattern.slice() : [];

            // If user pins cycles=1, prefer reps targets over tempo caps.
            // Reason: tempo caps can be misleading under fatigue (cadence downshifts), while reps targets
            // keep the timer deterministic and make the announced tempo match the derived average.
            // If "Finish sprint" is enabled, split the single continuous block into steady + finish (both /0).
            try {
                if (cyclesFixed === 1 && pattern.length === 1) {
                    const s0 = pattern[0] || {};
                    const on0 = Math.max(0, Math.floor(+s0.on || 0));
                    const off0 = Math.max(0, Math.floor(+s0.off || 0));
                    const eff0 = Number.isFinite(+s0.eff) ? +s0.eff : 0;
                    if (on0 === dur && off0 === 0 && eff0 > 0.0001) {
                        const repsFixed = Math.max(1, Math.round(Number.isFinite(+res?.reps) ? (+res.reps) : 0));
                        const sprintSec = Math.max(0, Math.min(on0 - 1, Math.floor(+($("zarOptFinish")?.value || 20))));
                        if (sprintSec > 0 && repsFixed >= 2) {
                            const steadySec = Math.max(1, on0 - sprintSec);
                            const cap = cadenceMaxRpm;
                            const maxSprintReps = Math.max(1, Math.floor((cap * sprintSec) / 60));
                            const desiredSprintReps = Math.max(1, Math.round((cap * sprintSec) / 60));
                            // Always keep both segments non-empty.
                            let sprintReps = Math.min(maxSprintReps, desiredSprintReps, repsFixed - 1);
                            if (sprintReps < 1) sprintReps = 1;
                            let steadyReps = repsFixed - sprintReps;
                            if (steadyReps < 1) { steadyReps = 1; sprintReps = repsFixed - 1; }

                            // Safety: if steady would exceed the cap, move reps to sprint.
                            const steadyRpm = () => (steadyReps * 60) / Math.max(1, steadySec);
                            let guard = 0;
                            while (guard++ < 500 && steadyReps > 1 && sprintReps < Math.min(maxSprintReps, repsFixed - 1) && steadyRpm() > cap + 1e-9) {
                                sprintReps += 1;
                                steadyReps -= 1;
                            }

                            // Use integer reps that sum exactly.
                            steadyReps = Math.max(1, Math.floor(steadyReps));
                            sprintReps = Math.max(1, repsFixed - steadyReps);
                            if (sprintReps > maxSprintReps) {
                                sprintReps = maxSprintReps;
                                steadyReps = Math.max(1, repsFixed - sprintReps);
                            }

                            pattern = [
                                { ...s0, on: steadySec, off: 0, workTempoRpm: undefined, workReps: steadyReps },
                                { ...s0, on: sprintSec, off: 0, workTempoRpm: undefined, workReps: sprintReps }
                            ];
                        } else {
                            pattern[0] = { ...s0, workTempoRpm: undefined, workReps: repsFixed };
                        }

                        // Use the derived average tempo as the auto tempo hint.
                        _zarAutoTempoRpm = (repsFixed * 60) / Math.max(1, on0);
                        try { _zarScreenUpdateAutoTempoStatus(); } catch (_) {}
                    }
                }
            } catch (_) {}

            // Use the optimized tempo (if any) as the optimizer-derived "auto" tempo.
            try {
                let wSum = 0;
                let tSum = 0;
                for (const s of pattern) {
                    const on = Math.max(0, Math.floor(+s?.on || 0));
                    const eff10 = Number.isFinite(+s?.eff) ? +s.eff : 0;
                    const rpm = Number.isFinite(+s?.workTempoRpm) ? +s.workTempoRpm : NaN;
                    if (on > 0 && eff10 > 0.0001 && Number.isFinite(rpm) && rpm > 0) {
                        wSum += on;
                        tSum += on * rpm;
                    }
                }
                if (wSum > 0) _zarAutoTempoRpm = tSum / wSum;
                try { _zarScreenUpdateAutoTempoStatus(); } catch (_) {}
            } catch (_) {}
            const filledSec = Number.isFinite(+res?.meta?.filledSec) ? +res.meta.filledSec : dur;
            if (filledSec < dur) {
                const tail = Math.max(0, Math.floor(dur - filledSec));
                if (tail > 0) {
                    // If exact-fill isn't possible under constraints, prefer an explicit REST tail.
                    // (Converting leftover time into forced-tempo work creates confusing last-block behavior.)
                    pattern.push({ on: 0, off: tail, eff: 0, restEff: restEff10 });
                }
            }

            // Derive auto tempo from the simulated click plan (works even without explicit tempo overrides).
            try {
                if (window.SimCore && typeof window.SimCore.simulateZarubaClickPlan === 'function') {
                    const model2 = {
                        allOutSec,
                        cadenceMaxRpm,
                        recTauSec,
                        switchCostSec,
                        minCadenceFrac: 0.35,
                        alpha: 1.25,
                        beta: 1.0,
                        fCrit: 0.85,
                        tempoFatiguePow,
                        defaultRestEff10: restEff10
                    };
                    const cp = window.SimCore.simulateZarubaClickPlan(pattern, dur, model2);
                    const clicks = Array.isArray(cp?.clickTimesSec) ? cp.clickTimesSec : [];

                    let t0 = 0;
                    let clickIdx = 0;
                    let totalWorkSec = 0;
                    let totalWorkClicks = 0;
                    let lastWorkClicks = 0;
                    let lastWorkSec = 0;
                    let workSegIdx = 0;
                    for (const s of pattern) {
                        const on = Math.max(0, Math.floor(+s?.on || 0));
                        const off = Math.max(0, Math.floor(+s?.off || 0));
                        const eff10 = Number.isFinite(+s?.eff) ? +s.eff : 0;
                        const isWork = (on > 0 && eff10 > 0.0001);
                        const t1 = t0 + on;
                        if (isWork) {
                            workSegIdx++;
                            const startIdx = clickIdx;
                            while (clickIdx < clicks.length && clicks[clickIdx] < t1 - 1e-9) clickIdx++;
                            const segClicks = Math.max(0, clickIdx - startIdx);
                            totalWorkSec += on;
                            totalWorkClicks += segClicks;
                            lastWorkClicks = segClicks;
                            lastWorkSec = on;
                        }
                        t0 = t1 + off;
                        if (t0 >= dur + 1e-9) break;
                        // Advance click index past any clicks that might fall into rest (shouldn't, but safe).
                        while (clickIdx < clicks.length && clicks[clickIdx] < t0 - 1e-9) clickIdx++;
                    }

                    const avgRpm = (totalWorkSec > 0) ? (totalWorkClicks * 60) / totalWorkSec : 0;
                    const lastRpm = (lastWorkSec > 0) ? (lastWorkClicks * 60) / lastWorkSec : 0;
                    if (avgRpm > 0.5) {
                        _zarAutoTempoRpm = avgRpm;
                        try { _zarScreenUpdateAutoTempoStatus(); } catch (_) {}

                        // Keep scheme language strict: do not inject annotations into the scheme string.
                        // Instead, surface details via the existing Auto Tempo status and diagnostics panel.
                        try {
                            if ($("zarOptPreview")) {
                                const L = (LANG === 'ru');
                                const extra = (L
                                    ? `\nтемп (по click-plan): средн≈${Math.round(avgRpm)}${(workSegIdx >= 2 && lastRpm > 0.5) ? ` · посл≈${Math.round(lastRpm)}` : ''}`
                                    : `\ntempo (from click-plan): avg≈${Math.round(avgRpm)}${(workSegIdx >= 2 && lastRpm > 0.5) ? ` · last≈${Math.round(lastRpm)}` : ''}`);
                                const curTxt = String($("zarOptPreview").textContent || '');
                                // Avoid stacking duplicates if user clicks optimize repeatedly.
                                $("zarOptPreview").textContent = curTxt.replace(/\n(?:темп \(по click-plan\):|tempo \(from click-plan\):)[^\n]*/g, '') + extra;
                            }
                        } catch (_) {}
                    }
                }
            } catch (_) {}

            if ($("zarPatternU")) {
                $("zarPatternU").value = (typeof window.formatZarPatternSegments === 'function')
                    ? window.formatZarPatternSegments(pattern, { lang: LANG })
                    : pattern.map(s => `${s.on}/${s.off}`).join(' ');
            }

            // Diagnostics: compare against simple baselines in the SAME performance model.
            try {
                if (typeof window.SimCore.simulateZarubaReps === 'function') {
                    const mk = (on, off, eff) => [{ on, off, eff, restEff: restEff10 }];
                    const model2 = {
                        allOutSec,
                        cadenceMaxRpm,
                        recTauSec,
                        switchCostSec,
                        minCadenceFrac: 0.35,
                        alpha: 1.25,
                        beta: 1.0,
                        fCrit: 0.85,
                        tempoFatiguePow,
                        defaultRestEff10: restEff10
                    };
                    const opt = window.SimCore.simulateZarubaReps(pattern, dur, model2);
                    const emom3030 = window.SimCore.simulateZarubaReps(mk(30, 30, workEff10), dur, model2);
                    const classic1515 = window.SimCore.simulateZarubaReps(mk(15, 15, workEff10), dur, model2);
                    const sprint1010 = window.SimCore.simulateZarubaReps(mk(10, 10, workEff10), dur, model2);
                    const cont = window.SimCore.simulateZarubaReps(mk(dur, 0, workEff10), dur, model2);

                    // Show sustain-cap parameters so user can see whether the cap is actually binding.
                    const capDiag = (() => {
                        try {
                            const pow = Math.max(1.0, Math.min(8.0, +tempoSustainPow || 3.0));
                            const tempoFracMin = Math.max(0.05, Math.min(1.0, (+tempoMinPct || 70) / 100));
                            const capAtMaxTempo = Math.max(5, Math.round(allOutSec));
                            const capAtMinTempo = Math.max(5, Math.round(allOutSec / Math.pow(Math.max(1e-6, tempoFracMin), pow)));
                            return { pow, tempoFracMin, capAtMaxTempo, capAtMinTempo };
                        } catch (_) { return null; }
                    })();

                    if ($("zarOptPreview")) {
                        const L = (LANG === 'ru');
                        const parts = [
                            (L ? `Прогноз (модель), повторы: OPT ${opt.reps} за ${dur}s` : `Predicted reps (model): OPT ${opt.reps} in ${dur}s`),
                            `30/30: ${emom3030.reps}`,
                            `15/15: ${classic1515.reps}`,
                            `10/10: ${sprint1010.reps}`,
                            (L ? `непрерывно ${dur}/0: ${cont.reps}` : `continuous ${dur}/0: ${cont.reps}`),
                            (L ? `темп: модель · exp=${tempoFatiguePow.toFixed(2)}` : `tempo: model · exp=${tempoFatiguePow.toFixed(2)}`),
                            (L
                                ? `лимит: pow=${capDiag ? capDiag.pow.toFixed(2) : (+tempoSustainPow).toFixed(2)} · cap@tMax≈${capDiag?.capAtMaxTempo ?? '?'}s · cap@tMin≈${capDiag?.capAtMinTempo ?? '?'}s`
                                : `cap: pow=${capDiag ? capDiag.pow.toFixed(2) : (+tempoSustainPow).toFixed(2)} · cap@tMax≈${capDiag?.capAtMaxTempo ?? '?'}s · cap@tMin≈${capDiag?.capAtMinTempo ?? '?'}s`),
                            (cyclesFixed > 0
                                ? (L ? `циклы: ${cyclesFixed}` : `cycles: ${cyclesFixed}`)
                                : (L ? `циклы: авто` : `cycles: auto`))
                        ];
                        $("zarOptPreview").textContent = parts.join(' · ');
                    }
                }
            } catch (_) {}

            // Make sure the user sees it's custom now
            render();
            try { saveLastStateDebounced(); } catch(_) {}
        } catch (e) {
            console.error(e);
            alert(LANG==='ru' ? 'Ошибка оптимизации схемы.' : 'Pattern optimization failed.');
        }
    }

    // Backward compatibility: older UI/hotkeys may still call this.
    function optimizeZaruba5Min() { return optimizeZarubaDur(); }

    // Build a custom Zaruba plan to HIT a target reps number (with minimal end fatigue in the model).
    function optimizeZarubaForTarget() {
        try {
            const fn = window.SimCore?.optimizeZarubaPatternForTarget;
            if (typeof fn !== 'function') {
                alert(LANG==='ru' ? 'Функция не загружена (SimCore.optimizeZarubaPatternForTarget).' : 'Function not loaded (SimCore.optimizeZarubaPatternForTarget).');
                return;
            }

            // UX consistency: optimize for the Duration the user currently sees/sets (Classic or Universal).
            const modeBefore = ($("zarMode")?.value === 'universal') ? 'universal' : 'classic';
            const durIdBefore = (modeBefore === 'universal') ? 'zarDurU' : 'zarDurC';
            const durWanted = Math.max(30, Math.floor(+($(durIdBefore)?.value || 300)));
            const effIdBefore = (modeBefore === 'universal') ? 'zarEffU' : 'zarEffC';
            const effWanted = (() => {
                const v = +($(effIdBefore)?.value || (modeBefore === 'universal' ? 5.0 : 8.5));
                return Number.isFinite(v) ? Math.max(0, Math.min(10, v)) : (modeBefore === 'universal' ? 5.0 : 8.5);
            })();

            // Force Universal mode for the reps model UI.
            if ($("zarMode")) {
                $("zarMode").value = 'universal';
                try { $("zarMode").dispatchEvent(new Event('change', { bubbles: true })); } catch(_) {}
            }
            if ($("zarDurU")) $("zarDurU").value = String(durWanted);
            if ($("zarEffU")) $("zarEffU").value = String(effWanted);
            if ($("zarKinU") && !$("zarKinU").value) $("zarKinU").value = 'hiit';

            const target = Math.max(1, Math.floor(+($("zarTargetReps")?.value || 0)));
            if (!Number.isFinite(target) || target <= 0) {
                if ($("zarTargetMsg")) $("zarTargetMsg").textContent = (LANG==='ru' ? 'Введите цель в повторах.' : 'Enter target reps.');
                return;
            }

            const dur = durWanted;
            const allOutSec = Math.max(10, +($("zarOptAllOut")?.value || 45));
            const cadenceMaxRpm = Math.max(5, Math.round(+($("zarOptCad")?.value || 20)));
            const tempoMinPct = Math.max(40, Math.min(100, +($("zarOptTempoMin")?.value || 70)));
            const tempoSteps = Math.max(1, Math.min(9, Math.floor(+($("zarOptTempoSteps")?.value || 5))));
            const tempoFatiguePow = Math.max(0.5, Math.min(3.0, +($("zarOptTempoPow")?.value || 1.4)));
            const tempoSustainPow = Math.max(1.0, Math.min(8.0, +($("zarOptTempoSustainPow")?.value || 3.0)));
            const recTauSec = Math.max(5, +($("zarOptRec")?.value || 30));
            const switchCostSec = Math.max(0, Math.floor(+($("zarOptSwitch")?.value || 1)));
            const cyclesFixed = (() => {
                const v = Math.floor(+($("zarOptCycles")?.value || 0));
                return Math.max(0, Math.min(200, v));
            })();
            const finishSprintSec = (() => {
                const v = Math.floor(+($("zarOptFinish")?.value || 20));
                return Math.max(0, Math.min(120, v));
            })();

            // Tempo search space (rpm). The scheme language encodes tempo inside the @... suffix as tNN/тNN.
            const tempoMinRpm = Math.max(5, Math.round(cadenceMaxRpm * (tempoMinPct / 100)));
            const workTempoSetRpm = Array.from(new Set(_zarBuildIntLinspace(tempoMinRpm, cadenceMaxRpm, tempoSteps)));

            // Optimizer-derived tempo (used when Big Screen RPM=0).
            _zarAutoTempoRpm = cadenceMaxRpm;
            // Force Big Screen tempo control back to 0 so it follows the optimizer-derived tempo.
            try { if ($("zarScreenMetroRpm")) $("zarScreenMetroRpm").value = '0'; } catch (_) {}
            try { _zarScreenUpdateAutoTempoStatus(); } catch (_) {}

            const kin = String($("zarKinU")?.value || 'hiit').toLowerCase();
            const restEff10 = (kin === 'sit') ? 0 : (+($("zarRestEffU")?.value || 0));
            const workEff10 = (() => {
                const v = +($("zarEffU")?.value || 5.0);
                return Number.isFinite(v) ? Math.max(0, Math.min(10, v)) : 5.0;
            })();

            // Hard impossibility check: even with perfect cadence and no fatigue limit, you can't exceed cadenceMaxRpm * minutes.
            const hardMax = Math.floor((cadenceMaxRpm * (dur / 60)) + 1e-9);
            if (target > hardMax) {
                if ($("zarTargetMsg")) {
                    $("zarTargetMsg").textContent = (LANG==='ru')
                        ? `Невозможно: при темпе ${cadenceMaxRpm} повт/мин за ${Math.round(dur)}s максимум ${hardMax}.`
                        : `Impossible: at ${cadenceMaxRpm} rpm for ${Math.round(dur)}s max is ${hardMax}.`;
                }
                return;
            }

            // When cycles are pinned, we must keep long ON values available to make exact-fill feasible.
            const maxOn = (cyclesFixed > 0)
                ? dur
                : Math.max(15, Math.min(dur, Math.round(allOutSec * 1.15)));
            const onSetBase = [8, 10, 12, 15, 20, 25, 30, 35, 40, 45, 60, 75, 90, 120, 150, 180, 240, 300];
            const onSet = onSetBase.filter(x => x <= Math.min(dur, maxOn));
            if (!onSet.includes(dur)) onSet.push(dur);
            const allowZeroOff = true;
            const offSet = (cyclesFixed === 1)
                ? [0]
                : [0, 5, 8, 10, 12, 15, 20, 25, 30, 40, 60, 90, 120, 180];
            // New semantics: work "intensity" is fixed; lower pace is expressed via tempo (tXX).
            const effSet = [workEff10];

            const res = fn({
                durSec: dur,
                targetReps: target,
                restEff10,
                onSet,
                offSet,
                effSet,
                workTempoSetRpm,
                workTempoMode: 'tempo',
                minOnSec: 8,
                minOffSec: (cyclesFixed >= 2 ? 5 : 0),
                fatigueStep: 0.02,
                fixedCycles: (cyclesFixed > 0 ? cyclesFixed : undefined),
                finishSprintSec,
                tempoSustainPow,
                allowContinuousWorkSegments: (cyclesFixed > 0),
                model: {
                    allOutSec,
                    cadenceMaxRpm,
                    recTauSec,
                    switchCostSec,
                    minCadenceFrac: 0.35,
                    alpha: 1.25,
                    beta: 1.0,
                    fCrit: 0.85,
                    tempoFatiguePow,
                    defaultRestEff10: restEff10
                }
            });

            if (res?.meta?.impossible) {
                const mx = Number.isFinite(+res.meta.maxReps) ? +res.meta.maxReps : 0;
                let mxOpt = null;
                try {
                    if (window.SimCore && typeof window.SimCore.optimizeZarubaPattern === 'function') {
                        const best = window.SimCore.optimizeZarubaPattern({
                            durSec: dur,
                            restEff10,
                            onSet,
                            offSet,
                            effSet,
                            workTempoSetRpm,
                            workTempoMode: 'tempo',
                            minOnSec: 8,
                            minOffSec: 0,
                            fatigueStep: 0.02,
                            fixedCycles: (cyclesFixed > 0 ? cyclesFixed : undefined),
                            finishSprintSec,
                            tempoSustainPow,
                            allowContinuousWorkSegments: (cyclesFixed > 0),
                            model: {
                                allOutSec,
                                cadenceMaxRpm,
                                recTauSec,
                                switchCostSec,
                                minCadenceFrac: 0.35,
                                alpha: 1.25,
                                beta: 1.0,
                                fCrit: 0.85,
                                tempoFatiguePow,
                                defaultRestEff10: restEff10
                            }
                        });
                        if (Number.isFinite(+best?.reps)) mxOpt = +best.reps;
                    }
                } catch (_) {}
                if ($("zarTargetMsg")) {
                    const extra = (mxOpt == null) ? '' : (LANG==='ru'
                        ? ` (через «Оптимизировать»: ≈ ${mxOpt})`
                        : ` (via “Optimize”: ≈ ${mxOpt})`);
                    $("zarTargetMsg").textContent = (LANG==='ru')
                        ? `Недостижимо в модели: цель ${target}, максимум ≈ ${mx}${extra}. Упростите цель или увеличьте темп/восстановление.`
                        : `Not achievable in model: target ${target}, max ≈ ${mx}${extra}. Lower target or increase cadence/recovery.`;
                }
                return;
            }

            let pattern = Array.isArray(res?.pattern) ? res.pattern.slice() : [];

            // Align with fixed-cycles behavior: if user pins cycles=1 and the result is a single continuous work block,
            // prefer deterministic reps targets (and optional steady+finish split).
            try {
                if (cyclesFixed === 1 && pattern.length === 1) {
                    const s0 = pattern[0] || {};
                    const on0 = Math.max(0, Math.floor(+s0.on || 0));
                    const off0 = Math.max(0, Math.floor(+s0.off || 0));
                    const eff0 = Number.isFinite(+s0.eff) ? +s0.eff : 0;
                    if (on0 === dur && off0 === 0 && eff0 > 0.0001) {
                        const repsFixed = Math.max(1, Math.round(Number.isFinite(+res?.reps) ? (+res.reps) : 0));
                        const sprintSec = Math.max(0, Math.min(on0 - 1, Math.floor(+($("zarOptFinish")?.value || 20))));
                        if (sprintSec > 0 && repsFixed >= 2) {
                            const steadySec = Math.max(1, on0 - sprintSec);
                            const cap = cadenceMaxRpm;
                            const maxSprintReps = Math.max(1, Math.floor((cap * sprintSec) / 60));
                            const desiredSprintReps = Math.max(1, Math.round((cap * sprintSec) / 60));
                            let sprintReps = Math.min(maxSprintReps, desiredSprintReps, repsFixed - 1);
                            if (sprintReps < 1) sprintReps = 1;
                            let steadyReps = repsFixed - sprintReps;
                            if (steadyReps < 1) { steadyReps = 1; sprintReps = repsFixed - 1; }
                            const steadyRpm = () => (steadyReps * 60) / Math.max(1, steadySec);
                            let guard = 0;
                            while (guard++ < 500 && steadyReps > 1 && sprintReps < Math.min(maxSprintReps, repsFixed - 1) && steadyRpm() > cap + 1e-9) {
                                sprintReps += 1;
                                steadyReps -= 1;
                            }
                            steadyReps = Math.max(1, Math.floor(steadyReps));
                            sprintReps = Math.max(1, repsFixed - steadyReps);
                            if (sprintReps > maxSprintReps) {
                                sprintReps = maxSprintReps;
                                steadyReps = Math.max(1, repsFixed - sprintReps);
                            }
                            pattern = [
                                { ...s0, on: steadySec, off: 0, workTempoRpm: undefined, workReps: steadyReps },
                                { ...s0, on: sprintSec, off: 0, workTempoRpm: undefined, workReps: sprintReps }
                            ];
                        } else {
                            pattern[0] = { ...s0, workTempoRpm: undefined, workReps: repsFixed };
                        }
                        _zarAutoTempoRpm = (repsFixed * 60) / Math.max(1, on0);
                        try { _zarScreenUpdateAutoTempoStatus(); } catch (_) {}
                    }
                }
            } catch (_) {}

            // Use the optimized tempo (if any) as the optimizer-derived "auto" tempo.
            try {
                let wSum = 0;
                let tSum = 0;
                for (const s of pattern) {
                    const on = Math.max(0, Math.floor(+s?.on || 0));
                    const eff10 = Number.isFinite(+s?.eff) ? +s.eff : 0;
                    const rpm = Number.isFinite(+s?.workTempoRpm) ? +s.workTempoRpm : NaN;
                    if (on > 0 && eff10 > 0.0001 && Number.isFinite(rpm) && rpm > 0) {
                        wSum += on;
                        tSum += on * rpm;
                    }
                }
                if (wSum > 0) _zarAutoTempoRpm = tSum / wSum;
                try { _zarScreenUpdateAutoTempoStatus(); } catch (_) {}
            } catch (_) {}
            const filledSec = Number.isFinite(+res?.meta?.filledSec) ? +res.meta.filledSec : dur;
            if (filledSec < dur) {
                const tail = Math.max(0, Math.floor(dur - filledSec));
                if (tail > 0) {
                    // If exact-fill isn't possible under constraints, prefer an explicit REST tail.
                    pattern.push({ on: 0, off: tail, eff: 0, restEff: restEff10 });
                }
            }

            // Derive auto tempo from the simulated click plan (works even without explicit tempo overrides).
            let tempoExtraMsg = '';
            try {
                if (window.SimCore && typeof window.SimCore.simulateZarubaClickPlan === 'function') {
                    const model2 = {
                        allOutSec,
                        cadenceMaxRpm,
                        recTauSec,
                        switchCostSec,
                        minCadenceFrac: 0.35,
                        alpha: 1.25,
                        beta: 1.0,
                        fCrit: 0.85,
                        tempoFatiguePow,
                        defaultRestEff10: restEff10
                    };
                    const cp = window.SimCore.simulateZarubaClickPlan(pattern, dur, model2);
                    const clicks = Array.isArray(cp?.clickTimesSec) ? cp.clickTimesSec : [];

                    let t0 = 0;
                    let clickIdx = 0;
                    let totalWorkSec = 0;
                    let totalWorkClicks = 0;
                    let lastWorkClicks = 0;
                    let lastWorkSec = 0;
                    let workSegIdx = 0;
                    for (const s of pattern) {
                        const on = Math.max(0, Math.floor(+s?.on || 0));
                        const off = Math.max(0, Math.floor(+s?.off || 0));
                        const eff10 = Number.isFinite(+s?.eff) ? +s.eff : 0;
                        const isWork = (on > 0 && eff10 > 0.0001);
                        const t1 = t0 + on;
                        if (isWork) {
                            workSegIdx++;
                            const startIdx = clickIdx;
                            while (clickIdx < clicks.length && clicks[clickIdx] < t1 - 1e-9) clickIdx++;
                            const segClicks = Math.max(0, clickIdx - startIdx);
                            totalWorkSec += on;
                            totalWorkClicks += segClicks;
                            lastWorkClicks = segClicks;
                            lastWorkSec = on;
                        }
                        t0 = t1 + off;
                        if (t0 >= dur + 1e-9) break;
                        while (clickIdx < clicks.length && clicks[clickIdx] < t0 - 1e-9) clickIdx++;
                    }

                    const avgRpm = (totalWorkSec > 0) ? (totalWorkClicks * 60) / totalWorkSec : 0;
                    const lastRpm = (lastWorkSec > 0) ? (lastWorkClicks * 60) / lastWorkSec : 0;
                    if (avgRpm > 0.5) {
                        _zarAutoTempoRpm = avgRpm;
                        try { _zarScreenUpdateAutoTempoStatus(); } catch (_) {}
                        tempoExtraMsg = (LANG === 'ru')
                            ? ` · темп≈${Math.round(avgRpm)}${(workSegIdx >= 2 && lastRpm > 0.5) ? ` (посл≈${Math.round(lastRpm)})` : ''}`
                            : ` · tempo≈${Math.round(avgRpm)}${(workSegIdx >= 2 && lastRpm > 0.5) ? ` (last≈${Math.round(lastRpm)})` : ''}`;
                    }
                }
            } catch (_) {}

            if ($("zarPatternU")) {
                $("zarPatternU").value = (typeof window.formatZarPatternSegments === 'function')
                    ? window.formatZarPatternSegments(pattern, { lang: LANG })
                    : pattern.map(s => `${s.on}/${s.off}`).join(' ');
            }

            if ($("zarTargetMsg")) {
                const got = Number.isFinite(+res?.reps) ? +res.reps : 0;
                const fEnd = Number.isFinite(+res?.meta?.fatigueEnd) ? (+res.meta.fatigueEnd) : null;
                const fTxt = (fEnd == null) ? '' : (LANG==='ru' ? ` · усталость ${fEnd.toFixed(2)}` : ` · fatigue ${fEnd.toFixed(2)}`);
                $("zarTargetMsg").textContent = (LANG==='ru')
                    ? `План построен: прогноз ${got} (цель ${target})${fTxt}${tempoExtraMsg}`
                    : `Plan built: predicted ${got} (target ${target})${fTxt}${tempoExtraMsg}`;
            }

            render();
            try { saveLastStateDebounced(); } catch(_) {}
        } catch (e) {
            console.error(e);
            if ($("zarTargetMsg")) $("zarTargetMsg").textContent = (LANG==='ru' ? 'Ошибка оптимизации под цель.' : 'Target optimization failed.');
        }
    }
    // ---------- init ----------
    document.addEventListener("keydown", (e) => {
        // Esc closes the top-most visible modal
        if (e.key === "Escape") {
            try {
                if (_zarPlanIsOpen()) { _zarPlanClose(); return; }
            } catch (_) {}
            try {
                if ($("zarScreenModal")?.classList.contains("show")) { closeZarBigScreen(); return; }
            } catch (_) {}
            try {
                if ($("zpmodal")?.classList.contains("show")) { $("zpmodal").classList.remove("show"); return; }
            } catch (_) {}
            try {
                if ($("summaryModal")?.classList.contains("show")) { $("summaryModal").classList.remove("show"); return; }
            } catch (_) {}
            try {
                if ($("imodal")?.classList.contains("show")) { closeInfo(); return; }
            } catch (_) {}
            try {
                if ($("modal")?.classList.contains("show")) { closeBigChart(); return; }
            } catch (_) {}
            return;
        }

        if (e.target && (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA")) return;
        const k = e.key.toLowerCase();
        if (k === "b") { openBigChart(); }
        else if (k === "l") { toggleLang(); }
        else if (k === "m") { exportMetricsCSV(); }
        else if (k === "e") { exportSeriesCSV(); }
    });

    function updatePresetLabel() {
    const el = $("currentPresetLabel");
    if (!el) return;
    const name = CURRENT_PRESET || "Default";
    el.textContent = (LANG === "ru" ? "Текущий пресет: " : "Current preset: ") + name;
}

    function initApp() {
    try {
    try { setupEmptyToDefaultNumberInputs(); } catch(_) {}
    // 1) Load state from URL (if any) – don’t render here
    const urlState = tryLoadStateFromURL();
    let schemeApplied = false;
    if (!urlState) {
    const d = $("drift10");
    if (d && +d.value === 3) d.value = "2";
    // Load last session if no URL state
    tryLoadLastState();

    // Scheme-only share URL (duration + pattern)
    try {
        schemeApplied = _tryLoadZarSchemeFromURL();
        if (schemeApplied) _clearZarSchemeFromURL();
    } catch(_) {}
} else {
    applyState(urlState);
    try { if (typeof window.clearStateFromURL === 'function') window.clearStateFromURL(); } catch(_) {}
}

    // 2) Text/UI
    setText();

    // 3) Ranges now that we know HRR mode; clamp but don’t fight loaded values
    configureRecommendedRanges();
    updatePercentLabels();
    refreshPresetList(CURRENT_PRESET);
    updatePresetLabel();
    // Seed default methods if none selected (fresh session)
    ensureDefaultMethodSelection();

    // 4) Enable auto-tune by default unless an explicit state was applied
    AUTO_TUNE_Z2 = !urlState;
    if (AUTO_TUNE_Z2) {
    // Force initial tune so Z2 tail stays inside Z2 on first render
    maybeAutoTuneZ2(true);
}

    // 5) Wire and render once
    wireStaticDomHandlers();
    // Toolbar dropdowns
    try {
        setupDropdown('exportDropdownBtn','exportDropdownMenu');
        setupDropdown('shareDropdownBtn','shareDropdownMenu');
        setupDropdown('presetsDropdownBtn','presetsDropdownMenu');
        setupDropdown('importDropdownBtn','importDropdownMenu');
        setupDropdown('aiDropdownBtn','aiDropdownMenu');
    } catch(_){}
    // Ensure offset UI reflects current offset
    if ($("impOffset")) { $("impOffset").value = String(IMPORT_OFFSET_SEC || 0); }
    if ($("impOffsetRange")) { $("impOffsetRange").value = String(Math.max(+$("impOffsetRange").min, Math.min(+$("impOffsetRange").max, IMPORT_OFFSET_SEC || 0))); }
    // Ensure trim UI reflects current trim
    if ($("impTrimStart")) { $("impTrimStart").value = String(IMPORT_TRIM_START_SEC || 0); }
    if ($("impTrimRange")) { $("impTrimRange").value = String(Math.max(+$("impTrimRange").min, Math.min(+$("impTrimRange").max, IMPORT_TRIM_START_SEC || 0))); }
    if ($("impTrimAffectsChart")) { $("impTrimAffectsChart").checked = !!IMPORT_TRIM_APPLY_TO_CHART; }
    // Wire 'Show/Hide/Only' buttons and set initial visibility
    try { wireShowButtons(); wireHideButtons(); wireOnlyButtons(); updateShowButtonsVisibility(); } catch(_){ }
    render();

    // Zaruba mode: independent Classic/Universal controls, just toggle visibility
    if ($("zarMode") && !$("zarMode")._wired) {
        const applyZarModeUi = () => {
            const mode = ($("zarMode").value === 'universal') ? 'universal' : 'classic';
            if ($("zarClassicBox")) $("zarClassicBox").style.display = (mode === 'classic') ? '' : 'none';
            if ($("zarUniversalBox")) $("zarUniversalBox").style.display = (mode === 'universal') ? '' : 'none';
        };
        // initial
        applyZarModeUi();
        $("zarMode").addEventListener("change", () => {
            applyZarModeUi();
            configureRecommendedRanges();
            setText();
            render();
            try { saveLastStateDebounced(); } catch(_) {}
        });
        $("zarMode")._wired = true;
    }

    // Zaruba big screen modal wiring
    try {
        const zsm = $("zarScreenModal");
        if (zsm && !zsm._wired) {
            $("zarScreenClose")?.addEventListener('click', closeZarBigScreen);
            zsm.addEventListener('click', (e) => { if (e.target === e.currentTarget) closeZarBigScreen(); });
            // Esc key is handled by the global keydown handler in init
            $("zarScreenStart")?.addEventListener('click', zarScreenStartOrContinue);
            $("zarScreenPlan")?.addEventListener('click', zarScreenPlanOrReset);
            $("zarScreenStop")?.addEventListener('click', zarScreenStopPressed);
            zsm._wired = true;
        }

        // Plan overlay wiring
        try {
            const pm = $("zarPlanModal");
            if (pm && !pm._wired) {
                $("zarPlanClose")?.addEventListener('click', _zarPlanClose);
                pm.addEventListener('click', (e) => { if (e.target === e.currentTarget) _zarPlanClose(); });
                pm._wired = true;
            }
        } catch (_) {}

        // Persist Big Screen settings immediately on change (these controls don't necessarily call render())
        const bsIds = [
            "zarScreenCountUp",
            "zarScreenBarGrow",
            "zarScreenVoice",
            "zarScreenVoiceReps",
            "zarScreenSayReps",
            "zarScreenSayTempo",
            "zarScreenSayIntensity",
            "zarScreenWake",
            "zarScreenVibrate",
            "zarScreenVibrateMul",
            "zarBeepVol",
            "zarScreenMetro",
            "zarScreenMetroRpm",
            "zarScreenMetroHz",
            "zarScreenMetroVol"
        ];
        const onBsInput = () => {
            try { saveLastStateDebounced(); } catch(_) {}
            try { if (_zarScreen?.open && !_zarScreen?.running) _zarScreenSetEff('rest', 0); } catch(_) {}
            try { _zarScreenUpdateAutoTempoStatus(); } catch (_) {}
            try { _zarScreenUpdateVibrateMulLabel(); } catch (_) {}
            try {
                // If tempo-related controls changed, re-anchor metronome immediately.
                const ae = document.activeElement;
                const id = String(ae?.id || '');
                const tempoRelated = (id === 'zarScreenMetro' || id === 'zarScreenMetroRpm' || id === 'zarScreenMetroHz' || id === 'zarScreenMetroVol');
                if (tempoRelated) {
                    _zarMetroReset();
                    if (_zarScreen?.running && Array.isArray(_zarScreen.phases) && _zarScreen.phases.length) {
                        const ph = _zarScreen.phases[_zarScreen.phaseIdx] || _zarScreen.phases[0];
                        if (ph) _zarScreenSetTempoLabel(ph.kind, ph.eff, ph.tempoRpm, ph.start, ph.end);
                    }
                }
            } catch (_) {}
        };
        for (const id of bsIds) {
            const el = $(id);
            if (!el || el._wiredPersist) continue;
            el.addEventListener('input', onBsInput);
            el.addEventListener('change', onBsInput);
            el._wiredPersist = true;
        }

        // One-click vibration test (for debugging browser support)
        try {
            const vb = $("zarScreenVibrateTest");
            if (vb && !vb._wiredVibTest) {
                vb.addEventListener('click', _zarVibrateTestClick);
                vb._wiredVibTest = true;
            }
        } catch (_) {}
    } catch(_) {}

    // Persist Zaruba optimizer settings immediately on change (these may not trigger render())
    try {
        const ids = ["zarOptAllOut", "zarOptCad", "zarOptTempoMin", "zarOptTempoSteps", "zarOptRec", "zarOptSwitch", "zarOptTempoPow", "zarOptTempoSustainPow", "zarOptCycles", "zarOptFinish"];
        const onOptInput = () => { try { saveLastStateDebounced(); } catch(_) {} };
        for (const id of ids) {
            const el = $(id);
            if (!el || el._wiredPersistOpt) continue;
            el.addEventListener('input', onOptInput);
            el.addEventListener('change', onOptInput);
            el._wiredPersistOpt = true;
        }
    } catch(_) {}

    // 6) Re-tune on HRR toggle if user didn’t touch Z2 target
    $("useHRR")?.addEventListener("change", () => { configureRecommendedRanges(); maybeAutoTuneZ2(); render(); });

    // Re-tune when factors that affect drift budget change (if not touched)
    ["z2Min", "drift10", "warmup", "cooldown", "tauOn", "tauOff", "age", "hrRest", "hrMax"].forEach(id => {
    $(id)?.addEventListener("change", () => { maybeAutoTuneZ2(); render(); });
});

    // Live render while editing these core inputs (keeps UI responsive while typing)
    ["age", "hrRest", "hrMax"].forEach(id => {
        const el = $(id);
        if (!el || el._wiredLiveRender) return;
        el.addEventListener("input", () => { try { render(); } catch (_) {} });
        el._wiredLiveRender = true;
    });
    // Re-tune when activity changes
    ["selActKb", "selActRun", "selActBike"].forEach(id => {
    $(id)?.addEventListener("change", () => { configureRecommendedRanges(); maybeAutoTuneZ2(true); render(); });
});
    if ($("activity") && !$("activity")._wired) {
        $("activity").addEventListener("change", () => { configureRecommendedRanges(); maybeAutoTuneZ2(true); render(); });
        $("activity")._wired = true;
    }
} catch (e) {
    console.error("Init error:", e);
}
}
    // Boot: run once whether DOM is already ready or not
    if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initApp, { once: true });
} else {
    initApp();
}

    // Optional: handle bfcache restores (back/forward)
    window.addEventListener("pageshow", (e) => { if (e.persisted) initApp(); });

    // JavaScript
    // --- Big Chart Tracer: self-contained, append-only module ---
    // Adds a cursor-following vertical line and a tooltip with current HR values.
    // Safe: does not override draw/render functions; initializes on Big modal open.

    (() => {
    // 1) CSS (inject once)
    (function injectCssOnce() {
        if (document.head.querySelector('style[data-injected="tracer-css"]')) return;
        const s = document.createElement("style");
        s.setAttribute("data-injected", "tracer-css");
        s.textContent = `
    .bigChart{position:relative}
    .bigChart .tracerLine{position:absolute;top:0;bottom:0;width:1px;background:#93c5fd;opacity:.65;pointer-events:none}
    .bigChart .tracerTip{position:absolute;min-width:160px;max-width:280px;background:#0c1221;border:1px solid #263241;border-radius:8px;padding:6px 8px;font-size:12px;color:#e5e7eb;pointer-events:none;box-shadow:0 6px 16px rgba(0,0,0,.35)}
    .bigChart .tracerRow{display:flex;align-items:center;gap:6px;margin:2px 0}
    .bigChart .trDot{width:8px;height:8px;border-radius:50%;display:inline-block}
    .mono{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace}
    /* Zaruba Pattern Mini Modal */
    .zpm{position:fixed;inset:0;display:none;background:rgba(0,0,0,.45);z-index:1000;overflow:auto;box-sizing:border-box;padding:16px}
    .zpm.show{display:flex;align-items:flex-start;justify-content:center}
    .zpm-card{width:min(520px,calc(100vw - 32px));background:#0c1221;border:1px solid #263241;border-radius:10px;box-shadow:0 10px 24px rgba(0,0,0,.45);display:flex;flex-direction:column;max-height:calc(100svh - 32px)}
    @supports (height: 100dvh){.zpm-card{max-height:calc(100dvh - 32px)}}
    .zpm-head{display:flex;align-items:center;justify-content:space-between;padding:10px 12px;border-bottom:1px solid #1f2937;flex:0 0 auto}
    .zpm-title{margin:0;font-size:16px;color:#e5e7eb}
    .zpm-close{background:#111827;border:1px solid #374151;color:#e5e7eb;border-radius:8px;padding:4px 8px;cursor:pointer}
    .zpm-body{padding:12px;overflow:auto;flex:1 1 auto;min-height:0}
    #zpInput{width:100%;padding:8px;border-radius:8px;border:1px solid #374151;background:#0b1222;color:#e5e7eb}
    #zpLibName{padding:8px;border-radius:8px;border:1px solid #374151;background:#0b1222;color:#e5e7eb}
    #zpLibJson{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace}
    .zpm-actions{display:flex;gap:10px;justify-content:flex-end;padding:10px 12px;border-top:1px solid #1f2937;flex:0 0 auto;flex-wrap:wrap}
    `;
        document.head.appendChild(s);
    })();

    // 2) Small helpers (guarded)
    const has = (x) => typeof x !== "undefined" && x !== null;
    const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
    const fmt = (typeof window.fmtTime === "function")
    ? window.fmtTime
    : (secs => {
    secs = Math.max(0, Math.round(secs|0));
    const m = Math.floor(secs / 60), s = secs % 60;
    return `${m}:${s.toString().padStart(2,"0")}`;
});
    const cssVar = (typeof window.cssVar === "function")
    ? window.cssVar
    : ((name, fallback) => getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback || "#999");

    function labelForKind(k) {
    const L = (window.I18N && window.LANG && I18N[LANG] && I18N[LANG].legend) ? I18N[LANG].legend : {};
    return L && L[k] ? L[k] : k;
}
    function colorForKind(k) {
    const map = {
        SIT: cssVar("--sit", "#60a5fa"),
        HIIT: cssVar("--hiit", "#f59e0b"),
        SN: cssVar("--sn", "#fb7185"),
        Z2: cssVar("--z2", "#34d399"),
        Z34: cssVar("--z34", "#a78bfa"),
        ZRB: cssVar("--zaruba", "#22d3ee"),
        CSV: "#f87171", // match legend dot
        FIT: "#22c55e"
    };
    return map[k] || "#9ca3af";
}

    // 3) Data adapter (uses your existing pipeline)
    function buildTracerSeries() {
    if (typeof window.getParams !== "function" || typeof window.seriesFromParams !== "function") {
    return { series: [], tMax: 0 };
}
    const p = getParams();
    const base = seriesFromParams(p) || []; // expect [{kind, t, hr}]
    const series = base
    .filter(s => Array.isArray(s.t) && Array.isArray(s.hr) && s.t.length && s.hr.length)
    .map(s => ({
    key: s.kind,
    name: labelForKind(s.kind),
    color: colorForKind(s.kind),
    t: s.t,
    y: s.hr
}));
    // Use max duration (last - first) to match chart's X-axis scaling (offsets shift without zooming)
    const tMax = series.length
        ? Math.max(
            ...series.map(s => {
                const first = (Array.isArray(s.t) && s.t.length) ? (s.t[0] || 0) : 0;
                const last = (Array.isArray(s.t) && s.t.length) ? (s.t[s.t.length - 1] || 0) : 0;
                return Math.max(0, last - first);
            })
          )
        : 0;
    return { series, tMax };
}

    // Interpolate by timestamp to support irregularly sampled imports (CSV/FIT)
    function valueAt(series, time) {
        if (!series || !Array.isArray(series.t) || !Array.isArray(series.y) || series.t.length === 0) return NaN;
        const t = series.t, y = series.y;
        // Clamp to bounds
        if (time <= t[0]) return y[0];
        const last = t.length - 1;
        if (time >= t[last]) return y[last];
        // Binary search for i such that t[i] <= time < t[i+1]
        let lo = 0, hi = last;
        while (lo + 1 < hi) {
            const mid = (lo + hi) >> 1;
            if (t[mid] <= time) lo = mid; else hi = mid;
        }
        const t0 = t[lo], t1 = t[hi];
        const y0 = y[lo], y1 = y[hi];
        const denom = (t1 - t0);
        const a = denom > 0 ? (time - t0) / denom : 0;
        return y0 * (1 - a) + y1 * a;
}

    // 4) Tracer core
    function initBigChartTracer() {
    const host = document.getElementById("bigChart");
    if (!host) return;

    // Ensure positioning
    const cs = getComputedStyle(host);
    if (cs.position === "static") host.style.position = "relative";

    // Clean previous overlays/listeners, if any
    if (host._tracerDispose) { try { host._tracerDispose(); } catch {} }
    [...host.querySelectorAll(".tracerLine,.tracerTip")].forEach(n => n.remove());

    // Create overlays
    const line = document.createElement("div");
    line.className = "tracerLine";
    line.style.display = "none";
    host.appendChild(line);

    const tip = document.createElement("div");
    tip.className = "tracerTip";
    tip.style.display = "none";
    host.appendChild(tip);

    // Data
    let { series, tMax } = buildTracerSeries();
    if (!series.length || tMax <= 0) {
    // Keep overlays but hide if no data; do not throw
    line.style.display = "none";
    tip.style.display = "none";
}

    // Geometry (match your chart paddings; allow overrides via data attributes)
    const width = () => host.clientWidth;
    const height = () => host.clientHeight;
    const pl = Number(host.dataset.pl || 44);
    const pr = Number(host.dataset.pr || 22);
    const plotW = () => Math.max(1, width() - pl - pr);

    function onMove(ev) {
    const rect = host.getBoundingClientRect();
    const xClient = ev.clientX - rect.left;
    const plotX = clamp(xClient, pl, width() - pr);
    const frac = (plotX - pl) / plotW();
    const time = clamp(frac * tMax, 0, tMax);

    line.style.display = "block";
    line.style.left = plotX + "px";

    let html = `<div class="tracerRow" style="opacity:.9"><strong>${fmt(Math.round(time))}</strong></div>`;
    for (const s of series) {
    const v = valueAt(s, time);
    if (!Number.isFinite(v)) continue;
    html += `<div class="tracerRow"><span class="trDot" style="background:${s.color}"></span><span>${s.name}</span><span class="mono" style="margin-left:auto">${Math.round(v)} bpm</span></div>`;
}
    tip.innerHTML = html;

    const tipW = tip.offsetWidth || 200;
    const tipH = tip.offsetHeight || 60;
    const pad = 8;
    let left = plotX + 12;
    if (left + tipW + pad > width()) left = plotX - tipW - 12;
    let top = 8;
    if (top + tipH + pad > height()) top = height() - tipH - pad;
    tip.style.display = "block";
    tip.style.left = clamp(left, pad, width() - tipW - pad) + "px";
    tip.style.top = top + "px";
}

    function onLeave() {
    line.style.display = "none";
    tip.style.display = "none";
}

    function recalc() {
    const out = buildTracerSeries();
    series = out.series;
    tMax = out.tMax;
}

    host.addEventListener("mousemove", onMove);
    host.addEventListener("mouseleave", onLeave);
    const onInput = () => recalc();
    document.addEventListener("input", onInput);
    document.addEventListener("change", onInput);

    // Auto-cleanup when modal closes
    const modal = host.closest(".modal") || document.getElementById("modal");
    let obs = null;
    if (modal && typeof MutationObserver !== "undefined") {
    obs = new MutationObserver(() => {
    if (!modal.classList.contains("show")) dispose();
});
    obs.observe(modal, { attributes: true, attributeFilter: ["class"] });
}

    function dispose() {
    host.removeEventListener("mousemove", onMove);
    host.removeEventListener("mouseleave", onLeave);
    document.removeEventListener("input", onInput);
    document.removeEventListener("change", onInput);
    if (obs) { try { obs.disconnect(); } catch {} obs = null; }
    [...host.querySelectorAll(".tracerLine,.tracerTip")].forEach(n => n.remove());
    host._tracerDispose = null;
}
    host._tracerDispose = dispose;
}

    // 5) Initialize on Big chart open (no overrides)
    function armInitHooks() {
    // Prefer hooking the Big button if present
    const btn = document.getElementById("btnBig");
    if (btn && !btn._tracerArmed) {
    btn.addEventListener("click", () => setTimeout(() => { try { initBigChartTracer(); } catch {} }, 80));
    btn._tracerArmed = true;
}

    // Also watch modal visibility if present
    const modal = document.getElementById("modal");
    if (modal && typeof MutationObserver !== "undefined" && !modal._tracerObs) {
    const obs = new MutationObserver(() => {
    if (modal.classList.contains("show")) {
    setTimeout(() => { try { initBigChartTracer(); } catch {} }, 80);
}
});
    obs.observe(modal, { attributes: true, attributeFilter: ["class"] });
    modal._tracerObs = obs;
}
}

    if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", armInitHooks);
} else {
    armInitHooks();
}
})();

// --- Summary Button Handler ---
document.addEventListener("DOMContentLoaded", function() {
    const btn = document.getElementById("showSummaryBtn");
    if (btn && !btn._summaryWired) {
        btn.addEventListener("click", function() {
            // Resolve modal elements lazily (may not exist at load time)
            const modal = document.getElementById("summaryModal");
            const summaryText = document.getElementById("summaryText");
            const closeBtn = document.getElementById("summaryClose");
            const age = +(document.getElementById('age')?.value || 30);
            const lang = (window.LANG || document.documentElement.lang || 'en');
            const i18n = (window.I18N && window.I18N[lang]) ? window.I18N[lang] : {};

            // Build fresh params and series snapshot
            const p = (typeof getParams === 'function') ? getParams() : null;
            const series = (typeof seriesFromParams === 'function') ? seriesFromParams(p || {}) : [];
            // Treat kettlebell models (SN, SW) as theoretical, too, so they can be compared to imports
            const isTheoKind = (k) => k === 'SIT' || k === 'HIIT' || k === 'Z2' || k === 'Z34' || k === 'ZRB' || k === 'SN' || k === 'SW';
            const theoSeries = series.filter(s => isTheoKind(s.kind));
            const impSeries = series.filter(s => s.kind === 'CSV' || s.kind === 'FIT');

            // Validate scenarios: only one theoretical, only one imported, or a pair (one + one)
            const okTheoreticalOnly = (theoSeries.length === 1 && impSeries.length === 0);
            const okImportedOnly = (theoSeries.length === 0 && impSeries.length === 1);
            const okPair = (theoSeries.length === 1 && impSeries.length >= 1);
            if (!okTheoreticalOnly && !okImportedOnly && !okPair) {
                const msg = (lang === 'ru')
                    ? `Для сводки выберите один вариант:\n• один теоретический график\n• один импортированный график\n• пара: один теоретический + один импортированный\nСейчас выбрано: теоретических = ${theoSeries.length}, импортированных = ${impSeries.length}.`
                    : `For the summary, choose one of:\n• one theoretical chart\n• one imported chart\n• a pair: one theoretical + one imported\nCurrently selected: theoretical = ${theoSeries.length}, imported = ${impSeries.length}.`;
                if (modal && summaryText) { summaryText.textContent = msg; modal.classList.add('show'); }
                else { alert(msg); }
                return;
            }

            // Prepare arrays according to scenario
            let theoretical = [];
            let theoreticalTime = [];
            let real = [];
            let realTime = [];
            if (okTheoreticalOnly || okPair) {
                theoretical = theoSeries[0].hr.slice();
                theoreticalTime = theoSeries[0].t.slice();
            }
            if (okImportedOnly || okPair) {
                const selImp = impSeries[0]; // take the first import when multiple are present
                real = selImp.hr.slice();
                realTime = selImp.t.slice(); // already includes offset via appendImportedSeries
                // Always apply trim to metrics/tau estimation even if chart isn't trimmed
                try {
                    const trim = Math.max(0, Number(window.IMPORT_TRIM_START_SEC || IMPORT_TRIM_START_SEC || 0));
                    const off = Number(window.IMPORT_OFFSET_SEC || IMPORT_OFFSET_SEC || 0);
                    if (trim > 0 && Array.isArray(realTime) && realTime.length === real.length) {
                        const thr = trim + off;
                        let i0 = 0; while (i0 < realTime.length && realTime[i0] < thr) i0++;
                        if (i0 > 0 && i0 < realTime.length) {
                            real = real.slice(i0);
                            realTime = realTime.slice(i0);
                            // normalize to 0-based to keep tau markers simple
                            const t0 = realTime[0];
                            for (let k=0;k<realTime.length;k++) realTime[k] = Math.max(0, realTime[k] - t0);
                        }
                    }
                } catch(_){ }
            }

            // Build settings (minimal but sufficient)
            const settings = {
                tau: false,
                hrRest: p?.hrRest,
                hrMax: p?.hrMax,
                hrMaxUserProvided: !!p?.hrMaxUserProvided,
                hrMaxUser: (Number.isFinite(p?.hrMaxUser) ? Number(p.hrMaxUser) : null),
                fitHrMax: !!p?.fitHrMax,
                sportLevel: p?.sportLevel,
                // Pass model taus so theoretical-only summary can show exact configured values
                tauOn: p?.tauOn,
                tauOff: p?.tauOff,
                effortFrac: 0.8, // default expectation for effort
                t: (theoreticalTime.length === theoretical.length ? theoreticalTime : undefined),
                realTime: (realTime.length === real.length ? realTime : undefined),
                // Preserve raw series/time bases for lag search and HRmax calibration.
                _theoreticalRaw: (theoreticalTime.length === theoretical.length ? theoretical.slice() : undefined),
                _theoreticalRawTime: (theoreticalTime.length === theoretical.length ? theoreticalTime.slice() : undefined),
                _realRaw: (realTime.length === real.length ? real.slice() : undefined),
                _realRawTime: (realTime.length === real.length ? realTime.slice() : undefined)
            };

            if (window.zoneSummary && typeof window.zoneSummary.generateSummary === 'function') {
                const summary = window.zoneSummary.generateSummary({ age, theoretical, real, settings, i18n, lang });
                // Prefer HTML if provided for better readability
                if (modal && summaryText) {
                    if (summary.summaryHtml) summaryText.innerHTML = summary.summaryHtml; else summaryText.textContent = summary.summaryText;
                    modal.classList.add("show");
                } else {
                    // Fallback: simple alert if modal not present in DOM
                    alert(summary.summaryText || (i18n.summaryNotLoaded || 'Summary logic not loaded.'));
                }
            } else {
                if (modal && summaryText) {
                    summaryText.textContent = i18n.summaryNotLoaded || 'Summary logic not loaded.';
                    modal.classList.add("show");
                } else {
                    alert(i18n.summaryNotLoaded || 'Summary logic not loaded.');
                }
            }
        });
        // Wire close handlers if present
        const modal = document.getElementById("summaryModal");
        const closeBtn = document.getElementById("summaryClose");
        if (closeBtn && modal && !closeBtn._wired) {
            closeBtn.addEventListener("click", function() { modal.classList.remove("show"); });
            closeBtn._wired = true;
        }
        if (modal && !modal._wired) {
            modal.addEventListener("click", function(e) { if (e.target === modal) modal.classList.remove("show"); });
            modal._wired = true;
        }
        btn._summaryWired = true;
    }
});

// Mobile: ensure the comparison table fills the active viewport on narrow (portrait) screens
function adjustCmpWrapHeight() { /* disabled by design: allow natural page scroll */ }
// Remove previous auto-height wiring to let table grow naturally
// (kept as comments for future reference)
// (function mobileCmpInit(){})();
