/* ── LOCALSTORAGE & STORE CONFIGURATION ───────── */
const STORAGE_KEY = 'espe_emprendimientos';

// Mapas de visualización (Emojis y colores de categorías)
const catEmoji = {
  'Tecnología':'💻','Alimentos':'🍽️','Servicios':'🤝','Educación':'📚',
  'Ambiente':'🌿','Artesanías':'🎨','Salud':'🏥','Otro':'📦'
};
const catColor = {
  'Tecnología':'#1a73e8','Alimentos':'#e67e22','Servicios':'#27ae60','Educación':'#8e44ad',
  'Ambiente':'#16a085','Artesanías':'#d35400','Salud':'#c0392b','Otro':'#7f8c8d'
};

// Función para cargar datos desde LocalStorage
function loadData() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error al cargar desde LocalStorage:", error);
    return [];
  }
}

// Función para guardar datos en LocalStorage
function saveData(arr) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
  } catch (error) {
    console.error("Error al guardar en LocalStorage:", error);
  }
}

// Inicializar el arreglo con lo que haya en LocalStorage
let emprendimientos = loadData();

// Si LocalStorage está vacío, cargamos datos de prueba iniciales
if (emprendimientos.length === 0) {
  emprendimientos = [
    { codigo:'EMP-001', nombre:'AgroTech ESPE', responsable:'Carlos Mendoza', carrera:'Ing. Agropecuaria', categoria:'Tecnología', estado:'En marcha', producto:'Sistema IoT para riego inteligente', ventas:1200, descripcion:'Solución tecnológica para optimizar el riego agrícola mediante sensores IoT y análisis de datos en tiempo real.' },
    { codigo:'EMP-002', nombre:'NutriBox', responsable:'Ana Suárez', carrera:'Ing. en Alimentos', categoria:'Alimentos', estado:'En crecimiento', producto:'Cajas de alimentos nutritivos personalizados', ventas:3500, descripcion:'Servicio de suscripción mensual de cajas con alimentos saludables seleccionados por nutricionistas.' },
    { codigo:'EMP-003', nombre:'EduCode', responsable:'Miguel Torres', carrera:'Ingeniería en Software', categoria:'Educación', estado:'Prototipo', producto:'Plataforma de aprendizaje de programación', ventas:800, descripcion:'App gamificada para niños de 8-14 años que enseña lógica y programación básica mediante retos interactivos.' },
    { codigo:'EMP-004', nombre:'EcoTextil', responsable:'Paola Ríos', carrera:'Diseño Textil', categoria:'Ambiente', estado:'En marcha', producto:'Ropa a partir de materiales reciclados', ventas:2100, descripcion:'Marca de moda sostenible que transforma botellas PET y textiles en desuso en prendas de vestir de alta calidad.' },
    { codigo:'EMP-005', nombre:'MediLink', responsable:'Diego Vásquez', carrera:'Ing. Biomédica', categoria:'Salud', estado:'Idea', producto:'App de gestión de citas médicas', ventas:0, descripcion:'Aplicación móvil que conecta pacientes con médicos y facilita el agendamiento, historial y seguimiento médico.' }
  ];
  saveData(emprendimientos); // Guardar los datos demo iniciales
}

/* ── NAVIGATION (SPA) ─────────────────────────── */
function showSection(id) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  
  document.getElementById(id).classList.add('active');
  const targetLink = document.querySelector(`[data-section="${id}"]`);
  if (targetLink) targetLink.classList.add('active');
  
  // Cerrar menú móvil si está abierto
  document.getElementById('nav-list').classList.remove('open');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  
  // Renderizado dinámico y actualización según sección activa
  if (id === 'inicio')          updateHomeStats();
  if (id === 'emprendimientos') renderCards();
  if (id === 'dashboard')       { renderTable(); updateKPIs(); }
}

// Asignar eventos de click a los enlaces de navegación
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    showSection(link.dataset.section);
  });
});

document.getElementById('hamburger').addEventListener('click', () => {
  document.getElementById('nav-list').classList.toggle('open');
});

/* ── STATS & CALCULATIONS ─────────────────────── */
function calcStats() {
  const total = emprendimientos.length;
  const cats = new Set(emprendimientos.map(e => e.categoria)).size;
  const ventas = emprendimientos.reduce((s, e) => s + (parseFloat(e.ventas) || 0), 0);
  const promedio = total ? ventas / total : 0;
  const top = total ? emprendimientos.reduce((a, b) => (parseFloat(b.ventas) || 0) > (parseFloat(a.ventas) || 0) ? b : a) : null;
  return { total, cats, ventas, promedio, top };
}

function fmt(n) { 
  return '$' + Number(n).toLocaleString('es-EC', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); 
}

function updateHomeStats() {
  const s = calcStats();
  document.getElementById('stat-total').textContent = s.total;
  document.getElementById('stat-categorias').textContent = s.cats;
  document.getElementById('stat-ventas').textContent = fmt(s.ventas);
  document.getElementById('stat-promedio').textContent = fmt(s.promedio);
}

function updateKPIs() {
  const s = calcStats();
  document.getElementById('kpi-total').textContent = s.total;
  document.getElementById('kpi-ventas').textContent = fmt(s.ventas);
  document.getElementById('kpi-promedio').textContent = fmt(s.promedio);
  
  const kpiTop = document.getElementById('kpi-top');
  const kpiTopVentas = document.getElementById('kpi-top-ventas');
  
  if (s.top && (parseFloat(s.top.ventas) > 0)) {
    kpiTop.textContent = s.top.nombre;
    kpiTopVentas.textContent = fmt(s.top.ventas) + '/mes';
  } else {
    kpiTop.textContent = '—';
    kpiTopVentas.textContent = 'sin datos';
  }
}

/* ── CARDS (CATÁLOGO) ─────────────────────────── */
function estadoBadge(estado) {
  const map = { 'Idea':'estado-idea','Prototipo':'estado-prototipo','En marcha':'estado-marcha','En crecimiento':'estado-crecimiento' };
  return `<span class="badge-estado ${map[estado]||''}">${estado}</span>`;
}

function renderCards() {
  const q = (document.getElementById('catalog-search').value || '').toLowerCase();
  const cat = document.getElementById('catalog-filter').value;
  const grid = document.getElementById('cards-grid');
  
  const filtered = emprendimientos.filter(e =>
    (!q || e.nombre.toLowerCase().includes(q) || e.codigo.toLowerCase().includes(q)) &&
    (!cat || e.categoria === cat)
  );
  
  if (!filtered.length) {
    grid.innerHTML = `<div class="empty-state">
      <div class="empty-icon">🔍</div>
      <h3>No se encontraron emprendimientos</h3>
      <p>Intenta con otros filtros o <a href="#" onclick="showSection('registro');return false;" style="color:var(--verde);font-weight:600">registra el primero</a>.</p>
    </div>`;
    return;
  }
  
  const bg = { 'Tecnología':'#e8f0fe','Alimentos':'#fef3e2','Servicios':'#e6f4ea','Educación':'#f3e8fd','Ambiente':'#e6f9f5','Artesanías':'#fef0e7','Salud':'#fce8e6','Otro':'#f1f3f4' };
  
  grid.innerHTML = filtered.map(e => `
    <div class="emp-card">
      <div class="card-img" style="background:${bg[e.categoria]||'#f5f5f5'}">
        ${catEmoji[e.categoria]||'📦'}
      </div>
      <div class="card-body">
        <div class="card-code">${e.codigo}</div>
        <div class="card-name">${e.nombre}</div>
        <span class="card-category">
          <span>${catEmoji[e.categoria]||'📦'}</span> ${e.categoria}
        </span>
        <p class="card-desc">${e.descripcion}</p>
      </div>
      <div class="card-footer">
        <span class="card-responsable">👤 ${e.responsable}</span>
        ${estadoBadge(e.estado)}
      </div>
    </div>
  `).join('');
}

/* ── TABLE (DASHBOARD) ────────────────────────── */
function renderTable() {
  const q = (document.getElementById('dash-search').value || '').toLowerCase();
  const cat = document.getElementById('dash-filter-cat').value;
  const est = document.getElementById('dash-filter-est').value;
  const tbody = document.getElementById('table-body');
  
  const filtered = emprendimientos.map((e, i) => ({ ...e, originalIndex: i })).filter(e => 
    (!q || e.nombre.toLowerCase().includes(q) || e.codigo.toLowerCase().includes(q)) &&
    (!cat || e.categoria === cat) &&
    (!est || e.estado === est)
  );

  if (!filtered.length) {
    tbody.innerHTML = `<tr><td colspan="8" class="no-records">📋 No hay registros que coincidan con la búsqueda.</td></tr>`;
    return;
  }
  
  tbody.innerHTML = filtered.map(e => `
    <tr>
      <td><span class="td-code">${e.codigo}</span></td>
      <td><strong>${e.nombre}</strong></td>
      <td>${e.responsable}</td>
      <td style="font-size:.82rem">${e.carrera}</td>
      <td>${catEmoji[e.categoria]||''} ${e.categoria}</td>
      <td>${estadoBadge(e.estado)}</td>
      <td>${e.ventas ? fmt(e.ventas) : '—'}</td>
      <td>
        <div class="td-actions">
          <button class="btn btn-edit btn-sm" onclick="openModal(${e.originalIndex})">✏️</button>
          <button class="btn btn-danger btn-sm" onclick="deleteRecord(${e.originalIndex})">🗑️</button>
        </div>
      </td>
    </tr>
  `).join('');
}

/* ── FORM VALIDATION & SUBMIT ─────────────────── */
const formFields = [
  { id:'f-codigo', err:'err-codigo' },
  { id:'f-nombre', err:'err-nombre' },
  { id:'f-responsable', err:'err-responsable' },
  { id:'f-carrera', err:'err-carrera' },
  { id:'f-categoria', err:'err-categoria' },
  { id:'f-estado', err:'err-estado' },
  { id:'f-producto', err:'err-producto' },
  { id:'f-descripcion', err:'err-descripcion' }
];

function validate(fields) {
  let ok = true;
  fields.forEach(f => {
    const el = document.getElementById(f.id);
    const em = document.getElementById(f.err);
    if (!el.value.trim()) {
      el.classList.add('error'); em.classList.add('show'); ok = false;
    } else {
      el.classList.remove('error'); em.classList.remove('show');
    }
  });
  return ok;
}

function submitForm() {
  if (!validate(formFields)) { showToast('⚠️ Completa los campos requeridos.', true); return; }
  
  const codeInput = document.getElementById('f-codigo');
  const targetCode = codeInput.value.trim();
  
  // Validación de código duplicado
  if (emprendimientos.some(e => e.codigo.toLowerCase() === targetCode.toLowerCase())) {
    showToast('⚠️ Ya existe un emprendimiento con ese código.', true);
    codeInput.classList.add('error');
    return;
  }
  
  const obj = {
    codigo:      targetCode,
    nombre:      document.getElementById('f-nombre').value.trim(),
    responsable: document.getElementById('f-responsable').value.trim(),
    carrera:     document.getElementById('f-carrera').value.trim(),
    categoria:   document.getElementById('f-categoria').value,
    estado:      document.getElementById('f-estado').value,
    producto:    document.getElementById('f-producto').value.trim(),
    ventas:      parseFloat(document.getElementById('f-ventas').value) || 0,
    descripcion: document.getElementById('f-descripcion').value.trim()
  };
  
  emprendimientos.push(obj);
  saveData(emprendimientos); // Guardar en LocalStorage automáticamente
  resetForm();
  showToast('✅ Emprendimiento registrado exitosamente.');
}

function resetForm() {
  formFields.forEach(f => {
    const el = document.getElementById(f.id);
    const em = document.getElementById(f.err);
    el.value = ''; el.classList.remove('error'); em.classList.remove('show');
  });
  document.getElementById('f-ventas').value = '';
  document.getElementById('f-edit-index').value = '';
  document.getElementById('form-title').textContent = 'Nuevo Emprendimiento';
}

/* ── CRUD OPERATIONS: DELETE ──────────────────── */
function deleteRecord(i) {
  if (!confirm(`¿Eliminar "${emprendimientos[i].nombre}"? Esta acción no se puede deshacer.`)) return;
  
  emprendimientos.splice(i, 1);
  saveData(emprendimientos); // Guardar cambios en LocalStorage
  
  renderTable(); 
  updateKPIs();
  showToast('🗑️ Registro eliminado correctamente.');
}

/* ── CRUD OPERATIONS: EDIT MODAL ──────────────── */
const modalFields = [
  { id:'m-codigo', err:'m-err-codigo' },
  { id:'m-nombre', err:'m-err-nombre' },
  { id:'m-responsable', err:'m-err-responsable' },
  { id:'m-carrera', err:'m-err-carrera' },
  { id:'m-categoria', err:'m-err-categoria' },
  { id:'m-estado', err:'m-err-estado' },
  { id:'m-producto', err:'m-err-producto' },
  { id:'m-descripcion', err:'m-err-descripcion' }
];

function openModal(i) {
  const e = emprendimientos[i];
  document.getElementById('m-codigo').value       = e.codigo;
  document.getElementById('m-nombre').value       = e.nombre;
  document.getElementById('m-responsable').value  = e.responsable;
  document.getElementById('m-carrera').value      = e.carrera;
  document.getElementById('m-categoria').value    = e.categoria;
  document.getElementById('m-estado').value       = e.estado;
  document.getElementById('m-producto').value     = e.producto;
  document.getElementById('m-ventas').value       = e.ventas || '';
  document.getElementById('m-descripcion').value  = e.descripcion;
  document.getElementById('m-index').value        = i;
  
  modalFields.forEach(f => { 
    document.getElementById(f.id).classList.remove('error'); 
    document.getElementById(f.err).classList.remove('show'); 
  });
  document.getElementById('modal-overlay').classList.add('open');
}

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('open');
}

function saveEdit() {
  if (!validate(modalFields)) { showToast('⚠️ Completa los campos requeridos.', true); return; }
  
  const i = parseInt(document.getElementById('m-index').value);
  const newCode = document.getElementById('m-codigo').value.trim();
  
  // Validar colisión de código con otros elementos ya existentes
  if (emprendimientos.some((e, idx) => e.codigo.toLowerCase() === newCode.toLowerCase() && idx !== i)) {
    showToast('⚠️ Ya existe otro emprendimiento con ese código.', true); 
    return;
  }
  
  emprendimientos[i] = {
    codigo:      newCode,
    nombre:      document.getElementById('m-nombre').value.trim(),
    responsable: document.getElementById('m-responsable').value.trim(),
    carrera:     document.getElementById('m-carrera').value.trim(),
    categoria:   document.getElementById('m-categoria').value,
    estado:      document.getElementById('m-estado').value,
    producto:    document.getElementById('m-producto').value.trim(),
    ventas:      parseFloat(document.getElementById('m-ventas').value) || 0,
    descripcion: document.getElementById('m-descripcion').value.trim()
  };
  
  saveData(emprendimientos); // Sincronizar cambios en LocalStorage
  closeModal(); 
  renderTable(); 
  updateKPIs();
  showToast('✅ Emprendimiento actualizado con éxito.');
}

// Cerrar modal clickeando fuera del contenedor principal
document.getElementById('modal-overlay').addEventListener('click', function(e) {
  if (e.target === this) closeModal();
});

/* ── CONTACT FORM LOGIC ───────────────────────── */
function sendContact() {
  const fields = [
    { id:'c-nombre',  err:'c-err-nombre',  check: v => v.trim() !== '' },
    { id:'c-email',   err:'c-err-email',   check: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) },
    { id:'c-asunto',  err:'c-err-asunto',  check: v => v.trim() !== '' },
    { id:'c-mensaje', err:'c-err-mensaje', check: v => v.trim() !== '' }
  ];
  
  let ok = true;
  fields.forEach(f => {
    const el = document.getElementById(f.id);
    const em = document.getElementById(f.err);
    if (!f.check(el.value)) { el.classList.add('error'); em.classList.add('show'); ok = false; }
    else { el.classList.remove('error'); em.classList.remove('show'); }
  });
  
  if (!ok) { showToast('⚠️ Revisa los campos del formulario.', true); return; }
  
  fields.forEach(f => document.getElementById(f.id).value = '');
  showToast('📤 Mensaje enviado. ¡Gracias por contactarnos!');
}

/* ── NOTIFICATIONS (TOAST) ────────────────────── */
let toastTimer;
function showToast(msg, isError = false) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'toast' + (isError ? ' error' : '');
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 3200);
}

/* ── APP INITIALIZATION ───────────────────────── */
// Inicializar la pestaña inicial con estadísticas frescas de la base persistente
updateHomeStats();
renderCards();