const API_URL = 'https://6aeda2b6a677fe0fc14f3375.mockapi.io/api/end/users';

const form = document.getElementById('todo-form');
const input = document.getElementById('task-input');
const addBtn = document.getElementById('add-btn');
const list = document.getElementById('task-list');
const loader = document.getElementById('loader');
const errorEl = document.getElementById('error');

function toggleLoading(isLoading) {
  loader.classList.toggle('hidden', !isLoading);
  addBtn.disabled = isLoading;
}

function showError(msg = '') {
  errorEl.textContent = msg;
  errorEl.classList.toggle('hidden', !msg);
}

async function fetchTasks() {
  showError();
  toggleLoading(true);
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error('Помилка завантаження даних');
    const tasks = await res.json();
    renderTasks(tasks);
  } catch (err) {
    showError(err.message);
  } finally {
    toggleLoading(false);
  }
}

function renderTasks(tasks) {
  list.innerHTML = '';
  tasks.forEach(task => {
    const li = document.createElement('li');
    if (task.completed) li.classList.add('completed');

    li.innerHTML = `
      <div class="task-left">
        <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTask('${task.id}', ${!task.completed})">
        <span>${task.name}</span>
      </div>
      <button class="delete-btn" onclick="deleteTask('${task.id}')">Видалити</button>
    `;
    list.appendChild(li);
  });
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = input.value.trim();
  if (!name) return;

  showError();
  toggleLoading(true);
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, completed: false })
    });
    if (!res.ok) throw new Error('Не вдалося додати завдання');
    input.value = '';
    await fetchTasks();
  } catch (err) {
    showError(err.message);
  } finally {
    toggleLoading(false);
  }
});

async function deleteTask(id) {
  showError();
  toggleLoading(true);
  try {
    const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Не вдалося видалити завдання');
    await fetchTasks();
  } catch (err) {
    showError(err.message);
  } finally {
    toggleLoading(false);
  }
}

async function toggleTask(id, completed) {
  showError();
  toggleLoading(true);
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed })
    });
    if (!res.ok) throw new Error('Не вдалося оновити статус');
    await fetchTasks();
  } catch (err) {
    showError(err.message);
  } finally {
    toggleLoading(false);
  }
}

fetchTasks();