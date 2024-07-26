document.addEventListener('DOMContentLoaded', () => {
    const newTaskInput = document.getElementById('newTaskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');
    const clearCompletedBtn = document.getElementById('clearCompletedBtn');
    const taskCountSpan = document.getElementById('taskCount');
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function renderTasks() {
        taskList.innerHTML = '';
        tasks.forEach((task, index) => {
            const li = document.createElement('li');
            li.className = `list-group-item task-item ${task.completed ? 'completed' : ''}`;
            li.innerHTML = `
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" ${task.completed ? 'checked' : ''}>
                    <span class="task-text">${task.text}</span>
                </div>
                <div class="btn-group">
                    <button class="btn btn-info btn-sm edit-btn"><i class="fas fa-edit"></i></button>
                    <button class="btn btn-danger btn-sm delete-btn"><i class="fas fa-trash"></i></button>
                </div>
            `;

            const checkbox = li.querySelector('.form-check-input');
            const editBtn = li.querySelector('.edit-btn');
            const deleteBtn = li.querySelector('.delete-btn');

            checkbox.addEventListener('change', () => toggleComplete(index));
            editBtn.addEventListener('click', () => startEditing(li, task, index));
            deleteBtn.addEventListener('click', () => deleteTask(index));

            taskList.appendChild(li);
        });
        updateTaskCount();
    }

    function addTask() {
        const text = newTaskInput.value.trim();
        if (text !== '') {
            tasks.push({ text, completed: false });
            newTaskInput.value = '';
            saveTasks();
            renderTasks();
        }
    }

    function deleteTask(index) {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
    }

    function startEditing(li, task, index) {
        const taskText = li.querySelector('.task-text');
        const btnGroup = li.querySelector('.btn-group');
        
        li.innerHTML = `
            <input type="text" class="form-control edit-input" value="${task.text}">
            <button class="btn btn-success btn-sm save-btn"><i class="fas fa-check"></i></button>
        `;

        const editInput = li.querySelector('.edit-input');
        const saveBtn = li.querySelector('.save-btn');

        editInput.focus();

        saveBtn.addEventListener('click', () => saveEdit(index, editInput.value));
    }

    function saveEdit(index, newText) {
        tasks[index].text = newText.trim();
        saveTasks();
        renderTasks();
    }

    function toggleComplete(index) {
        tasks[index].completed = !tasks[index].completed;
        saveTasks();
        renderTasks();
    }

    function clearCompleted() {
        tasks = tasks.filter(task => !task.completed);
        saveTasks();
        renderTasks();
    }

    function updateTaskCount() {
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(task => task.completed).length;
        taskCountSpan.textContent = `${completedTasks}/${totalTasks} tasks completed`;
    }

    addTaskBtn.addEventListener('click', addTask);
    newTaskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });
    clearCompletedBtn.addEventListener('click', clearCompleted);

    renderTasks();
});