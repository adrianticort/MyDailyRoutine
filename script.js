// ================================
// My Daily Routine — Prototipo
// Sin backend: estado en localStorage.
// ================================

const STORAGE_KEY = 'mydailyroutine_proto_v1';

// 'rutina' eliminada de la lista
const CATEGORY_ORDER = ['desayunos', 'ejercicios', 'clase', 'meriendas', 'cenas'];

const CATEGORY_META = {
  desayunos:  { icon: '🍳', label: 'Desayunos',  subtitle: 'Tu desayuno del día' },
  ejercicios: { icon: '🏋️', label: 'Ejercicios', subtitle: 'Entrenamiento de hoy' },
  meriendas:  { icon: '🥤', label: 'Meriendas',  subtitle: 'Tu merienda del día' },
  clase:      { icon: '📚', label: 'Clase',       subtitle: 'Asignaturas de hoy' },
  cenas:      { icon: '🥗', label: 'Cenas',       subtitle: 'Tu cena del día' }
};

// ================================
// Estructura de Recetas
// ================================

const WEEKLY_RECIPES = {
  1: { // LUNES
    ejercicio: ['Entrenamiento: Casa, suave, 18:30 (~1 h)'],
    desayunos: {
      titulo: 'Avena con plátano y crema de cacahuete',
      ingredientes: '100g avena en seco + 300ml leche + 120g plátano + 20g crema de cacahuete',
      preparacion: 'Calienta la leche con la avena 4–5 minutos. Añade el plátano troceado y la crema de cacahuete.',
      tiempo: '7 min',
      porQue: 'Desayuno energético pero tienes muchas horas hasta entrenar, por lo que no necesitas limitar los carbohidratos.',
      sustituciones: ['Avena → 100g de pan integral', 'Crema de cacahuete → 20g de nueces'],
      macros: { prot: '33g', carbs: '112g', grasa: '27g', kcal: '800' }
    },
    meriendas: {
      titulo: 'Batido de proteína con plátano y cacahuete',
      ingredientes: '30g proteína en polvo + 250ml leche o bebida vegetal + 1 plátano + 10g crema de cacahuete',
      preparacion: 'Tritura todos los ingredientes en la batidora durante 30 segundos.',
      tiempo: '3 min',
      porQue: 'Merienda de rápida digestión ideal para cargar energía y proteína unas horas antes de entrenar en casa.',
      sustituciones: ['Proteína en polvo → 200g queso fresco batido 0%'],
      macros: { prot: '32g', carbs: '35g', grasa: '12g', kcal: '380' }
    },
    cenas: {
      titulo: 'Pollo con arroz y verduras',
      ingredientes: '100g arroz en crudo + 150g pechuga de pollo + 200g verduras + 10g aceite de oliva + 1 yogur natural + 1 fruta',
      preparacion: 'Cocina el arroz, prepara el pollo en sartén o air fryer y añade las verduras.',
      porQue: 'Cena completa después del entrenamiento, con carbohidratos para reponer energía y proteína para la recuperación.',
      sustituciones: ['Pollo → Pavo', 'Arroz → 350–400g de patata cocida/asada'],
      macros: { prot: '45g', carbs: '95g', grasa: '18g', kcal: '875' }
    }
  },
  2: { // MARTES
    ejercicio: ['Entrenamiento: Artes marciales, moderado-intenso, 18:30 (~1 h)'],
    desayunos: {
      titulo: 'Tostadas con huevo, aguacate y fruta',
      ingredientes: '100g pan + 2 huevos + 70g aguacate + 200g naranja + 10g aceite de oliva',
      tiempo: '10 min',
      porQue: 'Al ser artes marciales por la tarde, este desayuno no necesita estar diseñado como preentrenamiento.',
      sustituciones: ['Huevos → 100g de pavo', 'Aguacate → 20–25g de frutos secos'],
      macros: { prot: '25g', carbs: '79g', grasa: '24g', kcal: '600' }
    },
    meriendas: {
      titulo: 'Tostadas integrales con queso fresco y pavo',
      ingredientes: '60g pan integral + 60g pavo bajo en sal + 40g queso fresco 0%',
      preparacion: 'Tuesta el pan y añade las lonchas de queso fresco y pavo.',
      tiempo: '5 min',
      porQue: 'Snack ligero de baja carga grasa para no ir pesado a la clase de artes marciales.',
      sustituciones: ['Pavo → Atún al natural'],
      macros: { prot: '26g', carbs: '32g', grasa: '10g', kcal: '340' }
    },
    cenas: {
      titulo: 'Pasta con atún y tomate',
      ingredientes: '110g pasta en crudo + 120g atún al natural + 150g tomate + 15g aceite + 30g queso rallado + 1 fruta',
      preparacion: 'Cuece la pasta, mezcla con tomate, atún y aceite y termina con el queso.',
      porQue: 'Las artes marciales tienen una demanda energética superior, interesa una cena generosa en carbohidratos.',
      sustituciones: ['Atún → Pollo', 'Pasta → Arroz'],
      macros: { prot: '42g', carbs: '105g', grasa: '22g', kcal: '850' }
    }
  },
  3: { // MIÉRCOLES
    ejercicio: ['Entrenamiento: Casa, suave, 18:30 (~1 h)'],
    desayunos: {
      titulo: 'Yogur con avena, manzana y nueces',
      ingredientes: '250g yogur griego natural + 100g avena + 180g manzana + 20g nueces',
      tiempo: '5 min',
      sustituciones: ['Manzana → Pera', 'Nueces → Almendras'],
      macros: { prot: '30g', carbs: '102g', grasa: '24g', kcal: '730' }
    },
    meriendas: {
      titulo: 'Bowl de yogur proteico con frutos rojos y almendras',
      ingredientes: '200g yogur proteico + 80g frutos rojos congelados o frescos + 15g almendras',
      preparacion: 'Mezcla el yogur con los frutos rojos y corona con las almendras troceadas.',
      tiempo: '3 min',
      porQue: 'Aporta antioxidantes y proteína sin generar pesadez digestiva.',
      sustituciones: ['Almendras → Nueces o semillas de chía'],
      macros: { prot: '25g', carbs: '28g', grasa: '12g', kcal: '320' }
    },
    cenas: {
      titulo: 'Patata, ternera y verduras',
      ingredientes: '400g patata + 150g carne de ternera + 200g verduras + 15g aceite de oliva + 1 yogur natural',
      preparacion: 'Cocina la patata en air fryer y la carne en sartén.',
      porQue: 'Aporta hierro, proteínas, carbohidratos y micronutrientes.',
      macros: { prot: '40g', carbs: '90g', grasa: '25g', kcal: '850' }
    }
  },
  4: { // JUEVES
    ejercicio: ['Entrenamiento: Artes marciales, moderado-intenso, 18:30 (~1 h)'],
    desayunos: {
      titulo: 'Tostadas de pavo y queso + plátano',
      ingredientes: '100g pan + 80g pavo + 30g queso + 120g plátano + 300ml leche',
      tiempo: '8 min',
      sustituciones: ['Pavo → 2 huevos', 'Leche → 250g yogur natural + 1 fruta'],
      macros: { prot: '45g', carbs: '92g', grasa: '24g', kcal: '730' }
    },
    meriendas: {
      titulo: 'Tortitas rápidas de avena y claras con canela',
      ingredientes: '40g harina de avena + 120ml claras de huevo + canela al gusto',
      preparacion: 'Bate la harina con las claras y cuaja en sartén antiadherente vuelta y vuelta.',
      tiempo: '6 min',
      porQue: 'Excelente fuente de carbohidratos limpios de asimilación progresiva antes de entrenar.',
      macros: { prot: '28g', carbs: '42g', grasa: '8g', kcal: '360' }
    },
    cenas: {
      titulo: 'Arroz con pollo y verduras',
      ingredientes: '110g arroz en crudo + 160g pollo + 200g verduras + 15g aceite de oliva + 1 fruta',
      porQue: 'Comida alta en carbohidratos para recuperar de la sesión de artes marciales.',
      macros: { prot: '46g', carbs: '108g', grasa: '18g', kcal: '875' }
    }
  },
  5: { // VIERNES
    ejercicio: ['Entrenamiento: Gimnasio intenso, 16:30 (~1 h 30 min)'],
    desayunos: {
      titulo: 'Porridge de avena, yogur y plátano',
      ingredientes: '100g avena + 250g yogur griego + 120g plátano + 20g crema de cacahuete',
      tiempo: '7 min',
      porQue: 'Permite empezar el día con bastante energía sin depender de la comida para cubrir todo.',
      macros: { prot: '36g', carbs: '108g', grasa: '22g', kcal: '760' }
    },
    meriendas: {
      titulo: 'Batido post-gimnasio de fresas y avena',
      ingredientes: '30g proteína de suero + 40g copos de avena + 150g fresas + 250ml agua o leche',
      preparacion: 'Tritura todo hasta conseguir una textura homogénea.',
      tiempo: '3 min',
      porQue: 'Perfecto para tomar inmediatamente tras salir del gimnasio e iniciar la recuperación muscular.',
      macros: { prot: '30g', carbs: '52g', grasa: '10g', kcal: '410' }
    },
    cenas: {
      titulo: 'Salmón con patata y verduras',
      ingredientes: '150–180g salmón en crudo + 400g patata + 200g verduras + 10g aceite de oliva + 1 fruta',
      porQue: 'Buena cena de recuperación: pescado, carbohidratos, verduras y grasa saludable.',
      sustituciones: ['Salmón → Merluza + 10g aceite adicional', 'Patata → Arroz'],
      macros: { prot: '40g', carbs: '88g', grasa: '30g', kcal: '900' }
    }
  },
  6: { // SÁBADO
    ejercicio: ['Entrenamiento: Gimnasio intenso, 10:30 (~1 h 30 min)'],
    desayunos: {
      titulo: 'Tostadas + huevos + plátano + leche',
      ingredientes: '80g pan + 2 huevos + 120g plátano + 300ml leche',
      preparacion: 'Tomar el desayuno sobre las 09:00 (90 min antes de entrenar). Evitar grasas pesadas.',
      sustituciones: ['Huevos → 80–100g pavo', 'Pan → 70–80g avena cocida con leche'],
      macros: { prot: '31g', carbs: '82g', grasa: '23g', kcal: '630' }
    },
    meriendas: {
      titulo: 'Sandwich de atún al natural con canónigos',
      ingredientes: '60g pan integral + 80g atún al natural escurrido + 1 puñado de canónigos + 5g aceite',
      preparacion: 'Mezcla el atún con el aceite y monta el sandwich con los canónigos.',
      tiempo: '4 min',
      porQue: 'Merienda fácil y rápida de fin de semana rica en proteínas.',
      macros: { prot: '34g', carbs: '38g', grasa: '11g', kcal: '390' }
    },
    cenas: {
      titulo: 'Pasta con ternera',
      ingredientes: '110g pasta en crudo + 150g ternera + 200g tomate/verduras + 15g aceite + 30g queso + 1 fruta',
      porQue: 'Comida completa para terminar de cubrir tus necesidades diarias.',
      macros: { prot: '48g', carbs: '105g', grasa: '26g', kcal: '900' }
    }
  },
  0: { // DOMINGO
    ejercicio: ['Entrenamiento: Gimnasio intenso, 10:30 (~1 h)'],
    desayunos: {
      titulo: 'Cereales de avena, leche, yogur y plátano',
      ingredientes: '60g copos de avena + 300ml leche + 200g yogur natural + 120g plátano + 15g crema de cacahuete',
      preparacion: 'Sencillo y fácil de digerir antes del gimnasio.',
      sustituciones: ['Avena → 70–80g pan', 'Plátano → 1 pera madura'],
      macros: { prot: '28g', carbs: '90g', grasa: '20g', kcal: '675' }
    },
    meriendas: {
      titulo: 'Requesón con manzana y mantequilla de almendras',
      ingredientes: '150g requesón o queso cotage + 1 manzana troceada + 15g mantequilla de almendra',
      preparacion: 'Corta la manzana en dados y mézclala con el requesón y la mantequilla de almendras.',
      tiempo: '4 min',
      porQue: 'Excelente snack saciante y rico en caseína para el descanso dominical.',
      macros: { prot: '22g', carbs: '25g', grasa: '14g', kcal: '310' }
    },
    cenas: {
      titulo: 'Garbanzos con arroz, huevo y verduras',
      ingredientes: '150g garbanzos cocidos + 80g arroz en crudo + 2 huevos + 200g verduras + 10g aceite + 1 yogur natural',
      porQue: 'Combina legumbres, cereal y huevo para una cena completa y variada.',
      macros: { prot: '35g', carbs: '110g', grasa: '24g', kcal: '900' }
    }
  }
};

const CONTENT_POOL = {
  clase: [
    ['Matemáticas', 'Lengua', 'Historia'],
    ['Física', 'Inglés', 'Programación'],
    ['Química', 'Educación Física']
  ]
};

const QUOTES = [
  'Nadie viene a hacerlo por ti.',
  'Disciplina cuando la motivación desaparece.',
  'No necesitas ganas. Necesitas hacerlo.',
  'Tu futuro se construye con lo que haces hoy.',
  'Deja de esperar el momento perfecto.',
  'Hazlo por la persona en la que te quieres convertir.',
  'La motivación empieza. La disciplina continúa.',
  'No pares cuando estés cansado. Para cuando hayas terminado.',
  'Lo difícil de empezar es empezar.',
  'Un día o día uno. Tú decides.',
  'La única competencia que importa es la de ayer.',
  'No tienes que hacerlo perfecto. Tienes que hacerlo.',
  'Mientras otros hablan, tú trabaja.',
  'Tu esfuerzo de hoy será tu orgullo de mañana.',
  'No abandones por un mal día.',
  'Sigue. Incluso cuando nadie esté mirando.'
];

const MONTHS = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];

// ================================
// Utilidades
// ================================

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

function pad2(n) { return n < 10 ? '0' + n : '' + n; }
function dateKeyFromParts(y, m, d) { return `${y}-${pad2(m + 1)}-${pad2(d)}`; }
function dateFromKey(key) {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
}
function todayKey() {
  const t = new Date();
  return dateKeyFromParts(t.getFullYear(), t.getMonth(), t.getDate());
}
function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
function capitalize(str) { return str.charAt(0).toUpperCase() + str.slice(1); }
function formatLongDate(date) { return `${date.getDate()} de ${MONTHS[date.getMonth()]}`; }

// ================================
// Estado
// ================================

let state = {
  added: {},            
  statusOverrides: {},  
  calendarYear: null,
  calendarMonth: null,
  modalDateKey: null
};

let navStack = [{ screen: 'home' }];

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      state.added = parsed.added || {};
      state.statusOverrides = parsed.statusOverrides || {};
    }
  } catch (e) {
    console.warn('No se pudo leer el estado guardado', e);
  }
  const today = new Date();
  state.calendarYear = today.getFullYear();
  state.calendarMonth = today.getMonth();
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      added: state.added,
      statusOverrides: state.statusOverrides
    }));
  } catch (e) {
    console.warn('No se pudo guardar el estado', e);
  }
}

// ================================
// Generación de datos
// ================================

function getDayCategories(date) {
  const dow = date.getDay(); 
  // 'rutina' eliminada de la lista
  const cats = ['desayunos', 'ejercicios', 'meriendas', 'cenas'];
  if (dow !== 0 && dow !== 6) cats.push('clase'); 
  return CATEGORY_ORDER.filter(c => cats.includes(c));
}

function buildCategoryContent(cat, date) {
  const dow = date.getDay();
  const dayRecipe = WEEKLY_RECIPES[dow];
  const meta = CATEGORY_META[cat];

  if ((cat === 'desayunos' || cat === 'meriendas' || cat === 'cenas') && dayRecipe && dayRecipe[cat]) {
    return {
      icon: meta.icon,
      label: meta.label,
      subtitle: dayRecipe[cat].titulo,
      items: [dayRecipe[cat].ingredientes],
      status: 'pendiente'
    };
  }

  if (cat === 'ejercicios' && dayRecipe && dayRecipe.ejercicio) {
    return {
      icon: meta.icon,
      label: meta.label,
      subtitle: meta.subtitle,
      items: dayRecipe.ejercicio,
      status: 'pendiente'
    };
  }

  const pool = CONTENT_POOL[cat] || [['Tarea predeterminada']];
  const items = pool[date.getDate() % pool.length];
  return { icon: meta.icon, label: meta.label, subtitle: meta.subtitle, items: items.slice(), status: 'pendiente' };
}

function defaultStatusFor(date) {
  return 'pendiente';
}

function getDayData(dateKey) {
  const date = dateFromKey(dateKey);
  const data = {};
  getDayCategories(date).forEach(cat => {
    data[cat] = buildCategoryContent(cat, date);
    data[cat].status = defaultStatusFor(date);
  });
  const added = state.added[dateKey] || {};
  Object.keys(added).forEach(cat => {
    if (!data[cat]) data[cat] = Object.assign({}, added[cat]);
  });
  const overrides = state.statusOverrides[dateKey] || {};
  Object.keys(overrides).forEach(cat => {
    if (data[cat]) data[cat].status = overrides[cat];
  });
  return data;
}

function isDayFullyDone(dateKey) {
  const data = getDayData(dateKey);
  const cats = Object.keys(data);
  if (cats.length === 0) return false;
  return cats.every(c => data[c].status === 'completado');
}

// ================================
// Navegación
// ================================

const MAIN_TABS = ['home', 'stats', 'profile'];

function currentScreen() { return navStack[navStack.length - 1]; }

function navigateTo(screen, params = {}) {
  navStack.push(Object.assign({ screen }, params));
  render();
}

function goBack() {
  if (navStack.length > 1) {
    navStack.pop();
    render();
  }
}

function switchTab(tab) {
  navStack = [{ screen: tab }];
  render();
}

function render() {
  const top = currentScreen();

  $$('.screen').forEach(s => s.classList.remove('active'));
  const screenEl = $(`#screen${capitalize(top.screen)}`);
  if (screenEl) screenEl.classList.add('active');

  const showNav = MAIN_TABS.includes(top.screen);
  $('#bottomNav').classList.toggle('hidden', !showNav);   if (showNav) {     $$('.nav-item').forEach(b => b.classList.toggle('active', b.dataset.tab === top.screen));
  }

  if (top.screen === 'home') renderHome();
  if (top.screen === 'day') renderDay(top.dateKey);
  if (top.screen === 'objective') renderObjective(top.dateKey, top.category);
  if (top.screen === 'stats') renderStats();

  syncStreakDisplay();
  window.scrollTo(0, 0);
}

// ================================
// Pantalla: Inicio
// ================================

function renderHome() {
  renderCalendar();
}

function renderCalendar() {
  const year = state.calendarYear;
  const month = state.calendarMonth;
  const today = new Date();

  $('#calendarTitle').textContent = `${capitalize(MONTHS[month])} ${year}`;

  const firstDow = (new Date(year, month, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  let html = '';
  for (let i = 0; i < firstDow; i++) {
    html += `<div class="cal-day empty"></div>`;
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    const dateKey = dateKeyFromParts(year, month, d);
    const cats = getDayCategories(date);
    const hasAdded = state.added[dateKey] ? Object.keys(state.added[dateKey]).length : 0;
    const totalDots = Math.min(cats.length + hasAdded, 4);
    const isToday = isSameDay(date, today);
    const complete = totalDots > 0 && isDayFullyDone(dateKey);

    let classes = 'cal-day';
    if (isToday) classes += ' today';
    if (complete) classes += ' day-complete';

    html += `
      <button class="${classes}" data-date-key="${dateKey}">
        <span>${d}</span>
      </button>
    `;
  }

  $('#calendarGrid').innerHTML = html;   $$('#calendarGrid .cal-day:not(.empty)').forEach(btn => {
    btn.addEventListener('click', () => navigateTo('day', { dateKey: btn.dataset.dateKey }));
  });
}

function updateQuote() {
  const quote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
  $('#motivationText').textContent = quote;
}

// ================================
// Pantalla: Día
// ================================

function renderDay(dateKey) {
  const date = dateFromKey(dateKey);
  const isToday = dateKey === todayKey();

  $('#dayTitle').textContent = formatLongDate(date);
  const subtitle = document.querySelector('#screenDay .day-subtitle');
  if (subtitle) subtitle.textContent = isToday ? 'Objetivos de hoy' : 'Objetivos de ese día';

  const data = getDayData(dateKey);
  const cats = Object.keys(data).sort((a, b) => CATEGORY_ORDER.indexOf(a) - CATEGORY_ORDER.indexOf(b));

  if (cats.length === 0) {
    $('#dayCards').innerHTML = `
      <div class="day-empty">
        <svg class="icon" viewBox="0 0 24 24" style="margin:0 auto;"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
        <p>Todavía no hay objetivos para este día.<br>Pulsa el botón + para añadir uno.</p>
      </div>
    `;
    return;
  }

  $('#dayCards').innerHTML = cats.map(cat => {
    const c = data[cat];
    const done = c.status === 'completado';
    return `
      <div class="day-card ${done ? 'is-done' : ''}" data-category="${cat}">
        <div class="day-card-emoji">${c.icon}</div>
        <div class="day-card-body">
          <div class="day-card-title">${c.label.toUpperCase()}</div>
          <div class="day-card-sub">${c.subtitle}</div>
        </div>
        <div class="day-card-status">
          <div class="day-card-check">
            ${done ? '<svg class="icon" viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg>' : ''}
          </div>
          <svg class="icon" viewBox="0 0 24 24" style="width:16px;height:16px;"><path d="m9 18 6-6-6-6"/></svg>
        </div>
      </div>
    `;
  }).join('');

  $$('#dayCards .day-card').forEach(card => {
    card.addEventListener('click', () => {
      navigateTo('objective', { dateKey, category: card.dataset.category });
    });
  });
}

// ================================
// Pantalla: Detalle de objetivo
// ================================

function renderObjective(dateKey, category) {
  const data = getDayData(dateKey);
  const item = data[category];
  if (!item) { goBack(); return; }

  const date = dateFromKey(dateKey);
  const dow = date.getDay();
  const dayRecipe = WEEKLY_RECIPES[dow];
  
  const recipeData = (category === 'desayunos' || category === 'meriendas' || category === 'cenas') ? dayRecipe?.[category] : null;

  $('#objIcon').textContent = item.icon;
  $('#objTitle').textContent = item.label;
  $('#objDate').textContent = formatLongDate(date);

  const container = $('#objItems');

  if (recipeData) {
    container.outerHTML = `
      <div id="objItems" class="recipe-card-detail">
        <h3 class="recipe-title">${recipeData.titulo}</h3>
        <p class="recipe-ingredients">${recipeData.ingredientes}</p>
        
        ${recipeData.preparacion ? `<p class="recipe-prep"><strong>Preparación:</strong> ${recipeData.preparacion}</p>` : ''}
        ${recipeData.tiempo ? `<p class="recipe-time">⏱️ <strong>Tiempo:</strong> ${recipeData.tiempo}</p>` : ''}

        ${recipeData.macros ? `
          <div class="recipe-macros">
            <span class="macro-badge badge-prot">🥩 ${recipeData.macros.prot} prot</span>
            <span class="macro-badge badge-carbs">📦 ${recipeData.macros.carbs} carbs</span>
            <span class="macro-badge badge-fat">🥑 ${recipeData.macros.grasa} grasa</span>
            <span class="macro-badge badge-kcal">🔥 ${recipeData.macros.kcal} kcal</span>
          </div>
        ` : ''}

        ${recipeData.porQue ? `
          <div class="recipe-section">
            <div class="recipe-section-title">💡 ¿Por qué encaja?</div>
            <p>${recipeData.porQue}</p>
          </div>
        ` : ''}

        ${recipeData.sustituciones && recipeData.sustituciones.length ? `
          <div class="recipe-section">
            <div class="recipe-section-title">🔄 Sustituciones</div>
            <ul>
              ${recipeData.sustituciones.map(s => `<li>${s}</li>`).join('')}
            </ul>
          </div>
        ` : ''}
      </div>
    `;
  } else {
    container.outerHTML = `
      <ul id="objItems" class="objective-list">
        ${item.items.map(i => `<li>${i}</li>`).join('')}
      </ul>
    `;
  }

  $('#statusCompleted').classList.toggle('active', item.status === 'completado');
  $('#statusPending').classList.toggle('active', item.status === 'pendiente');
}

function setObjectiveStatus(dateKey, category, status) {
  if (!state.statusOverrides[dateKey]) state.statusOverrides[dateKey] = {};
  state.statusOverrides[dateKey][category] = status;
  saveState();

  const wasComplete = isDayFullyDone(dateKey);
  renderObjective(dateKey, category);
  const nowComplete = isDayFullyDone(dateKey);

  if (status === 'completado') {
    showToast('Objetivo marcado como completado', 'success');
  } else {
    showToast('Objetivo marcado como pendiente', 'info');
  }
  if (!wasComplete && nowComplete) {
    showToast('¡Día completado! 🔥', 'success');
  }
}

// ================================
// Pantalla: Estadísticas
// ================================

function calcStreak() {
  let streak = 0;
  const cursor = new Date();
  cursor.setDate(cursor.getDate() - 1);
  while (true) {
    const key = dateKeyFromParts(cursor.getFullYear(), cursor.getMonth(), cursor.getDate());
    if (isDayFullyDone(key)) {
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
    if (streak > 60) break;
  }
  return streak;
}

function syncStreakDisplay() {
  const streak = calcStreak();
  const streakEl = $('#streakCount');
  const statStreakEl = $('#statStreak');
  const profileStreakEl = $('#profileStreak');
  if (streakEl) streakEl.textContent = streak;
  if (statStreakEl) statStreakEl.textContent = streak;
  if (profileStreakEl) profileStreakEl.textContent = streak;
}

function renderStats() {
  const today = new Date();

  let diasCumplidos = 0;
  let totalObjetivos = 0;

  for (let d = 1; d <= today.getDate(); d++) {
    const key = dateKeyFromParts(today.getFullYear(), today.getMonth(), d);
    const data = getDayData(key);
    const cats = Object.keys(data);
    totalObjetivos += cats.length;
    if (cats.length > 0 && cats.every(c => data[c].status === 'completado')) diasCumplidos++;
  }

  const consistency = today.getDate() > 0 ? Math.round((diasCumplidos / today.getDate()) * 100) : 0;

  $('#statDone').textContent = diasCumplidos;
  $('#statObjectives').textContent = totalObjetivos;
  $('#statConsistency').textContent = `${consistency}%`;
}

// ================================
// Modal: añadir objetivo
// ================================

function openAddModal(dateKey) {
  state.modalDateKey = dateKey;
  const data = getDayData(dateKey);

  $('#categoryPicker').innerHTML = CATEGORY_ORDER.map(cat => {
    const meta = CATEGORY_META[cat];
    const already = !!data[cat];
    return `
      <button class="category-option ${already ? 'disabled' : ''}" data-category="${cat}">
        <span class="category-option-emoji">${meta.icon}</span>
        <span class="category-option-label">${already ? 'Ya añadido' : meta.label}</span>
      </button>
    `;
  }).join('');

  $$('#categoryPicker .category-option:not(.disabled)').forEach(btn => {
    btn.addEventListener('click', () => addObjective(state.modalDateKey, btn.dataset.category));
  });

  $('#addModal').classList.remove('hidden');
}

function closeAddModal() {
  $('#addModal').classList.add('hidden');
}

function addObjective(dateKey, category) {
  const date = dateFromKey(dateKey);
  if (!state.added[dateKey]) state.added[dateKey] = {};
  state.added[dateKey][category] = buildCategoryContent(category, date);
  saveState();
  closeAddModal();
  showToast('Objetivo añadido', 'success');
  renderDay(dateKey);
}

// ================================
// Toast
// ================================

let toastTimer = null;
function showToast(message, type = 'success') {
  const toast = $('#toast');
  const icon = toast.querySelector('.icon');
  icon.innerHTML = type === 'success'
    ? '<path d="M20 6 9 17l-5-5"/>'
    : '<path d="M12 8v4"/><path d="M12 16h.01"/><circle cx="12" cy="12" r="10"/>';
  $('#toastMsg').textContent = message;
  toast.classList.remove('hidden');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.add('hidden'), 2200);
}

// ================================
// Inicialización
// ================================

function init() {
  loadState();
  updateQuote();
  $('#newQuoteBtn').addEventListener('click', updateQuote);   render();    $$('.nav-item').forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });

  $('#prevMonth').addEventListener('click', () => {
    state.calendarMonth--;
    if (state.calendarMonth < 0) { state.calendarMonth = 11; state.calendarYear--; }
    renderCalendar();
  });
  $('#nextMonth').addEventListener('click', () => {
    state.calendarMonth++;
    if (state.calendarMonth > 11) { state.calendarMonth = 0; state.calendarYear++; }
    renderCalendar();
  });

  $('#dayBack').addEventListener('click', goBack);
  $('#objBack').addEventListener('click', goBack);

  $('#addObjectiveBtn').addEventListener('click', () => {
    const top = currentScreen();
    openAddModal(top.dateKey);
  });
  $('#closeModal').addEventListener('click', closeAddModal);
  $('.modal-backdrop').addEventListener('click', closeAddModal);

  $('#statusCompleted').addEventListener('click', () => {
    const top = currentScreen();
    setObjectiveStatus(top.dateKey, top.category, 'completado');
  });
  $('#statusPending').addEventListener('click', () => {
    const top = currentScreen();
    setObjectiveStatus(top.dateKey, top.category, 'pendiente');
  });
}

document.addEventListener('DOMContentLoaded', init);
