const storageKey = 'internship-todo-list';
let tasks = [];
try {
  const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
  if (Array.isArray(saved)) tasks = saved.filter(task => task && typeof task.text === 'string' && typeof task.done === 'boolean');
} catch { tasks = []; }

const list = document.querySelector('#task-list');
const input = document.querySelector('#task-input');

function save() {
  try { localStorage.setItem(storageKey, JSON.stringify(tasks)); }
  catch { document.querySelector('#storage-note').textContent = '浏览器无法保存数据，关闭页面后可能丢失。'; }
  render();
}

function render() {
  list.replaceChildren();
  tasks.forEach((task, index) => {
    const row = document.createElement('li');
    row.className = task.done ? 'completed' : '';
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = `task-${index}`;
    checkbox.checked = task.done;
    checkbox.addEventListener('change', () => { task.done = checkbox.checked; save(); });
    const label = document.createElement('label');
    label.htmlFor = checkbox.id;
    label.textContent = task.text;
    const remove = document.createElement('button');
    remove.type = 'button';
    remove.textContent = '删除';
    remove.setAttribute('aria-label', `删除任务：${task.text}`);
    remove.addEventListener('click', () => { tasks.splice(index, 1); save(); });
    row.append(checkbox, label, remove);
    list.append(row);
  });
  const finished = tasks.filter(task => task.done).length;
  document.querySelector('#summary').textContent = `共 ${tasks.length} 项，已完成 ${finished} 项`;
  document.querySelector('#empty').hidden = tasks.length > 0;
  document.querySelector('#clear').disabled = finished === 0;
}

document.querySelector('#task-form').addEventListener('submit', event => {
  event.preventDefault();
  const text = input.value.trim();
  if (!text) { input.focus(); return; }
  tasks.push({ text, done: false });
  input.value = '';
  save();
  input.focus();
});
document.querySelector('#clear').addEventListener('click', () => {
  tasks = tasks.filter(task => !task.done);
  save();
});
render();
