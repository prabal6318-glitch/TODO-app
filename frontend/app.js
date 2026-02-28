/* ── TODO App — API integration ── */

const API = '/api/v1';

// ── DOM ──
const todoList      = document.getElementById('todoList');
const loadingState  = document.getElementById('loadingState');
const emptyState    = document.getElementById('emptyState');
const totalCount    = document.getElementById('totalCount');
const doneCount     = document.getElementById('doneCount');
const progressFill  = document.getElementById('progressFill');
const progressPct   = document.getElementById('progressPct');

const todoForm      = document.getElementById('todoForm');
const titleInput    = document.getElementById('titleInput');
const descInput     = document.getElementById('descInput');
const submitBtn     = document.getElementById('submitBtn');
const submitLabel   = document.getElementById('submitLabel');
const submitSpinner = document.getElementById('submitSpinner');
const formError     = document.getElementById('formError');

const modalOverlay  = document.getElementById('modalOverlay');
const editForm      = document.getElementById('editForm');
const editId        = document.getElementById('editId');
const editTitle     = document.getElementById('editTitle');
const editDesc      = document.getElementById('editDesc');
const editSubmitBtn = document.getElementById('editSubmitBtn');
const editLabel     = document.getElementById('editLabel');
const editSpinner   = document.getElementById('editSpinner');
const editError     = document.getElementById('editError');
const modalClose    = document.getElementById('modalClose');
const modalCancel   = document.getElementById('modalCancel');
const toast         = document.getElementById('toast');

// ── State ──
let todos  = [];
let doneIds = new Set(JSON.parse(localStorage.getItem('doneIds') || '[]'));
let currentFilter = 'all';
let toastTimer;

// ── Utils ──
function saveDone() {
  localStorage.setItem('doneIds', JSON.stringify([...doneIds]));
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;');
}

function formatDate(d) {
  if (!d) return '';
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function showToast(msg, type = 'success') {
  clearTimeout(toastTimer);
  const icons = { success: '✅', error: '❌', info: 'ℹ️' };
  toast.innerHTML = `<span>${icons[type] || ''}</span><span>${msg}</span>`;
  toast.className = `toast ${type}`;
  toast.classList.remove('hidden');
  toastTimer = setTimeout(() => toast.classList.add('hidden'), 3000);
}

function setLoading(btn, labelEl, spinnerEl, on) {
  btn.disabled = on;
  labelEl.classList.toggle('hidden', on);
  spinnerEl.classList.toggle('hidden', !on);
}

function showErr(el, msg) { el.textContent = msg; el.classList.remove('hidden'); }
function clearErr(el) { el.classList.add('hidden'); el.textContent = ''; }

// ── Progress & Stats ──
function updateStats() {
  const done  = todos.filter(t => doneIds.has(t._id)).length;
  const total = todos.length;
  const pct   = total ? Math.round((done / total) * 100) : 0;

  totalCount.textContent = total;
  doneCount.textContent  = done;
  progressFill.style.width = pct + '%';
  progressPct.textContent  = pct + '%';
}

// ── Render ──
function getFiltered() {
  if (currentFilter === 'done')    return todos.filter(t => doneIds.has(t._id));
  if (currentFilter === 'pending') return todos.filter(t => !doneIds.has(t._id));
  return todos;
}

function renderTodos() {
  updateStats();
  const filtered = getFiltered();

  if (filtered.length === 0) {
    todoList.classList.add('hidden');
    emptyState.classList.remove('hidden');
    return;
  }
  emptyState.classList.add('hidden');
  todoList.classList.remove('hidden');
  todoList.innerHTML = '';

  filtered.forEach((todo, i) => {
    const done = doneIds.has(todo._id);
    const li = document.createElement('li');
    li.className = `todo-item${done ? ' done' : ''}`;
    li.style.animationDelay = `${i * 0.04}s`;
    li.innerHTML = `
      <div class="todo-check ${done ? 'checked' : ''}" data-check="${todo._id}" title="${done ? 'Mark pending' : 'Mark done'}"></div>
      <div class="todo-content">
        <div class="todo-title">${escapeHtml(todo.title)}</div>
        <div class="todo-desc">${escapeHtml(todo.description)}</div>
      </div>
      <div class="todo-meta">
        <span class="todo-date">${formatDate(todo.createdAt)}</span>
      </div>
      <div class="todo-actions">
        <button class="btn-icon edit-btn" data-id="${todo._id}" title="Edit">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        </button>
        <button class="btn-icon delete-btn" data-id="${todo._id}" title="Delete">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
        </button>
      </div>
    `;
    todoList.appendChild(li);
  });
}

// ── API ──
async function fetchTodos() {
  loadingState.classList.remove('hidden');
  emptyState.classList.add('hidden');
  todoList.classList.add('hidden');
  try {
    const res  = await fetch(`${API}/todos`);
    const data = await res.json();
    if (data.success) { todos = data.data; renderTodos(); }
    else throw new Error(data.message);
  } catch {
    showToast('Could not connect to server', 'error');
    emptyState.classList.remove('hidden');
  } finally {
    loadingState.classList.add('hidden');
  }
}

async function createTodo(title, description) {
  const res  = await fetch(`${API}/createTodo`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, description })
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.data;
}

async function updateTodo(id, title, description) {
  const res  = await fetch(`${API}/updateTodo/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, description })
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
}

async function deleteTodo(id) {
  const res  = await fetch(`${API}/deleteTodo/${id}`, { method: 'DELETE' });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
}

// ── Events ──

// CREATE
todoForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  clearErr(formError);
  const title       = titleInput.value.trim();
  const description = descInput.value.trim();
  if (!title || !description) return;

  setLoading(submitBtn, submitLabel, submitSpinner, true);
  try {
    const newTodo = await createTodo(title, description);
    todos.unshift(newTodo);
    renderTodos();
    todoForm.reset();
    showToast('Task added!', 'success');
    titleInput.focus();
  } catch (err) {
    showErr(formError, err.message);
    showToast(err.message, 'error');
  } finally {
    setLoading(submitBtn, submitLabel, submitSpinner, false);
  }
});

// CHECK / EDIT / DELETE via delegation
todoList.addEventListener('click', async (e) => {
  // Toggle done
  const checkEl = e.target.closest('[data-check]');
  if (checkEl) {
    const id = checkEl.dataset.check;
    if (doneIds.has(id)) { doneIds.delete(id); showToast('Marked as pending', 'info'); }
    else                  { doneIds.add(id);    showToast('Marked as done! 🎉', 'success'); }
    saveDone();
    renderTodos();
    return;
  }

  // Edit
  const editBtn = e.target.closest('.edit-btn');
  if (editBtn) {
    const id   = editBtn.dataset.id;
    const todo = todos.find(t => t._id === id);
    if (!todo) return;
    editId.value    = id;
    editTitle.value = todo.title;
    editDesc.value  = todo.description;
    clearErr(editError);
    openModal();
    return;
  }

  // Delete
  const delBtn = e.target.closest('.delete-btn');
  if (delBtn) {
    const id = delBtn.dataset.id;
    delBtn.disabled = true;
    try {
      await deleteTodo(id);
      todos    = todos.filter(t => t._id !== id);
      doneIds.delete(id);
      saveDone();
      renderTodos();
      showToast('Task deleted', 'info');
    } catch (err) {
      showToast(err.message, 'error');
      delBtn.disabled = false;
    }
  }
});

// UPDATE
editForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  clearErr(editError);
  const id          = editId.value;
  const title       = editTitle.value.trim();
  const description = editDesc.value.trim();
  if (!title || !description) return;

  setLoading(editSubmitBtn, editLabel, editSpinner, true);
  try {
    await updateTodo(id, title, description);
    const idx = todos.findIndex(t => t._id === id);
    if (idx !== -1) todos[idx] = { ...todos[idx], title, description };
    renderTodos();
    closeModal();
    showToast('Task updated!', 'success');
  } catch (err) {
    showErr(editError, err.message);
  } finally {
    setLoading(editSubmitBtn, editLabel, editSpinner, false);
  }
});

// Filter tabs
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    currentFilter = tab.dataset.filter;
    renderTodos();
  });
});

// Modal
function openModal()  { modalOverlay.classList.remove('hidden'); setTimeout(() => editTitle.focus(), 60); }
function closeModal() { modalOverlay.classList.add('hidden'); }
modalClose.addEventListener('click', closeModal);
modalCancel.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', e => { if (e.target === modalOverlay) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// ── Boot ──
fetchTodos();
