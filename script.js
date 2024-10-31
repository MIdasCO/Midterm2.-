const taskInput = document.getElementById('task-input');
const addTaskBtn = document.getElementById('add-task-btn');
const taskList = document.getElementById('task-list');
const clearTasksBtn = document.getElementById('clear-tasks-btn');
let tasks = [];
loadTasks();

addTaskBtn.addEventListener('click', () => {
    const taskText = taskInput.value;
    if (taskText === '') {
        alert('Пожалуйста, введите задачу.');
        return;
    }
    if (taskText.length > 20) {
        alert('Задача не должна превышать 100 символов.');
        return;
    }
    const task = {
        id: Date.now(),
        text: taskText,
        completed: false
    };
    tasks.push(task);
    addTaskToDOM(task);
    saveTasks();
    taskInput.value = '';
});

taskList.addEventListener('click', (e) => {
    const target = e.target;
    const parentLi = target.closest('li');
    if (!parentLi) return;
    const taskId = parentLi.getAttribute('data-id');
    if (target.classList.contains('complete-btn')) {
        toggleTaskCompletion(taskId);
    }
    if (target.classList.contains('delete-btn')) {
        deleteTask(taskId);
    }
});

clearTasksBtn.addEventListener('click', () => {
    if (tasks.length === 0) {
        alert('Список задач уже пуст.');
        return;
    }
    if (confirm('Вы уверены, что хотите очистить весь список задач?')) {
        tasks = [];
        renderTasks();
        saveTasks();
    }
});

function addTaskToDOM(task) {
    const li = document.createElement('li');
    li.classList.add('task-item');
    li.setAttribute('data-id', task.id);

    const completeBtn = document.createElement('button');
    completeBtn.classList.add('complete-btn');
    completeBtn.textContent = task.completed ? 'Отменить' : 'Выполнено';

    const textSpan = document.createElement('span');
    textSpan.classList.add('task-text');
    textSpan.textContent = task.text;
    if (task.completed) {
        textSpan.classList.add('completed');
    }

    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('delete-btn');
    deleteBtn.textContent = 'Удалить';

    li.appendChild(completeBtn);
    li.appendChild(textSpan);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
        tasks.forEach(task => addTaskToDOM(task));
    }
}

function toggleTaskCompletion(id) {
    tasks = tasks.map(task => {
        if (task.id == id) {
            task.completed = !task.completed;
        }
        return task;
    });
    renderTasks();
    saveTasks();
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id != id);
    renderTasks();
    saveTasks();
}

function renderTasks() {
    taskList.innerHTML = '';
    tasks.forEach(task => addTaskToDOM(task));
}
