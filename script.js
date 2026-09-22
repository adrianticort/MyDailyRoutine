// ================================
// My Daily Routine — Prototipo
// Sin backend: estado en localStorage.
// ================================

const STORAGE_KEY = 'mydailyroutine_proto_v1';

const CATEGORY_ORDER = ['desayunos', 'ejercicios', 'rutina', 'clase'];

const CATEGORY_META = {
  desayunos:  { icon: '🍳', label: 'Desayunos',  subtitle: 'Tu desayuno del día' },
  ejercicios: { icon: '🏋️', label: 'Ejercicios', subtitle: 'Entrenamiento de hoy' },
  rutina:     { icon: '📋', label: 'Rutina',      subtitle: 'Tareas del día' },
  clase:      { icon: '📚', label: 'Clase',       subtitle: 'Asignaturas de hoy' }
};

// Contenido de ejemplo (rota según el día del mes para dar variedad)
const CONTENT_POOL = {
  desayunos: [
    ['Avena', 'Leche', 'Fruta', 'Yogur'],
    ['Tostadas integrales', 'Aguacate', 'Huevo', 'Zumo natural'],
    ['Yogur griego', 'Granola', 'Miel', 'Nueces'],
    ['Tortitas de avena', 'Plátano', 'Canela']
  ],
  ejercicios: [
    ['Calentamiento', 'Rutina de gimnasio', 'Ejercicios principales', 'Estiramientos'],
    ['Cardio suave 20 min', 'Movilidad de cadera', 'Core'],
    ['Empuje: press banca', 'Fondos', 'Flexiones'],
    ['Piernas: sentadillas', 'Zancadas', 'Gemelos']
  ],
  rutina: [
    ['Sacar al perro', 'Estiramientos', 'Skin care'],
    ['Orden de la habitación', 'Leer 15 min', 'Planificar el día'],
    ['Meditar 10 min', 'Beber 2L de agua', 'Skin care']
  ],
  clase: [
    ['Matemáticas', 'Lengua', 'Historia'],
    ['Física', 'Inglés', 'Programación'],
    ['Química', 'Educación Física']
  ]
};

const QUOTES = [
  'Pequeños pasos cada día.',
  'La constancia vence al talento.',
  'Hoy también cuenta.',
  'Un poco cada día es mucho en un año.',
  'Lo simple, bien hecho.',
  'Vas a tu ritmo, y eso ya es avanzar.',
  'La racha se construye hoy.'
];

const MONTHS = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
const WEEKDAY_SHORT = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];

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
  added: {},            // { dateKey: { categoria: {icon,label,subtitle,items,status} } }
  statusOverrides: {},  // { dateKey: { categoria: 'completado' | 'pendiente' } }
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
// Generación de datos de ejemplo
// ================================

function getDayCategories(date) {
  const dow = date.getDay(); // 0 domingo .. 6 sábado
  const cats = ['desayunos', 'rutina'];
  if (dow !== 0) cats.push('ejercicios');      // domingo: descanso de ejercicio
  if (dow !== 0 && dow !== 6) cats.push('clase'); // fin de semana: sin clase
  return CATEGORY_ORDER.filter(c => cats.includes(c));
}

function buildCategoryContent(cat, date) {
  const pool = CONTENT_POOL[cat];
  const items = pool[date.getDate() % pool.length];
  const meta = CATEGORY_META[cat];
  return { icon: meta.icon, label: meta.label, subtitle: meta.subtitle, items: items.slice(), status: 'pendiente' };
}

function defaultStatusFor(date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  if (d.getTime() >= today.getTime()) return 'pendiente';
  // días pasados: variedad determinista para que el prototipo no se vea vacío
  return (date.getDate() % 3 !== 0) ? 'completado' : 'pendiente';
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
// Navegación entre pantallas
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
  $('#bottomNav').classList.toggle('hidden', !showNav);
  if (showNav) {
    $$('.nav-item').forEach(b => b.classList.toggle('active', b.dataset.tab === top.screen));
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

  const firstDow = (new Date(year, month, 1).getDay() + 6) % 7; // lunes = 0
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

    let dots = '';
    for (let i = 0; i < totalDots; i++) dots += '<span></span>';

    html += `
      <button class="${classes}" data-date-key="${dateKey}">
        <span>${d}</span>
        <span class="cal-day-dots">${dots}</span>
      </button>
    `;
  }

  $('#calendarGrid').innerHTML = html;

  $$('#calendarGrid .cal-day:not(.empty)').forEach(btn => {
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

  $('#objIcon').textContent = item.icon;
  $('#objTitle').textContent = item.label.toUpperCase();
  $('#objDate').textContent = formatLongDate(date);

  $('#objItems').innerHTML = item.items.map(i => `<li>${i}</li>`).join('');

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
  cursor.setDate(cursor.getDate() - 1); // se cuenta desde ayer
  while (true) {
    const key = dateKeyFromParts(cursor.getFullYear(), cursor.getMonth(), cursor.getDate());
    if (isDayFullyDone(key)) {
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
    if (streak > 60) break; // salvaguarda
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
  render();

  // Navegación inferior
  $$('.nav-item').forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });

  // Calendario: cambio de mes
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

  // Volver atrás
  $('#dayBack').addEventListener('click', goBack);
  $('#objBack').addEventListener('click', goBack);

  // Añadir objetivo
  $('#addObjectiveBtn').addEventListener('click', () => {
    const top = currentScreen();
    openAddModal(top.dateKey);
  });
  $('#closeModal').addEventListener('click', closeAddModal);
  $('.modal-backdrop').addEventListener('click', closeAddModal);

  // Estado del objetivo
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
