
const API_URL = 'http://localhost:3000/api/tasks';

async function fetchTasks() {
    try {
        const response = await fetch(API_URL, {
            headers: {
                authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        const tasks = await response.json();
        renderTasks(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
    }
}

async function addTask() {
    const taskName = document.getElementById('taskName').value;

    if (!taskName) {
        alert('Task name is required');
        return;
    }

    const newTask = { title: taskName, checked: 0 };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(newTask)
        });
        const addedTask = await response.json();
        appendTask(addedTask);
        document.getElementById('taskName').value = '';
        document.getElementById('taskChecked').checked = false;
    } catch (error) {
        console.error('Error adding task:', error);
    }
}

async function updateTask(id, title, checked) {
    try {
        await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ title, checked })
        });
        fetchTasks();
    } catch (error) {
        console.error('Error updating task:', error);
    }
}

async function deleteTask(taskId) {
    try {
        await fetch(`${API_URL}/${taskId}`, {
            method: 'DELETE',
            headers: {
                authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        fetchTasks();
    } catch (error) {
        console.error('Error deleting task:', error);
    }
}

function renderTasks(tasks) {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';

    tasks.forEach(task => {
        const taskItem = document.createElement('div');
        taskItem.className = 'task-item';

        const taskName = document.createElement('input');
        taskName.type = 'text';
        taskName.value = task.title;
        taskName.onchange = () => updateTask(task.taskId, taskName.value, task.checked);

        const taskChecked = document.createElement('input');
        taskChecked.type = 'checkbox';
        taskChecked.checked = task.checked;
        taskChecked.onchange = () => updateTask(task.taskId, task.title, taskChecked.checked ? 1 : 0);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = () => deleteTask(task.taskId);

        taskItem.appendChild(taskName);
        taskItem.appendChild(taskChecked);
        taskItem.appendChild(deleteButton);
        taskList.appendChild(taskItem);
    });
}

function appendTask(task) {
    const taskList = document.getElementById('taskList');
    const taskItem = document.createElement('div');
    taskItem.className = 'task-item';

    const taskName = document.createElement('input');
    taskName.type = 'text';
    taskName.value = task.title;
    taskName.onchange = () => updateTask(task.taskId, taskName.value, task.checked);

    const taskChecked = document.createElement('input');
    taskChecked.type = 'checkbox';
    taskChecked.checked = task.checked;
    taskChecked.onchange = () => updateTask(task.taskId, task.title, taskChecked.checked ? 1 : 0);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.onclick = () => deleteTask(task.taskId);

    taskItem.appendChild(taskName);
    taskItem.appendChild(taskChecked);
    taskItem.appendChild(deleteButton);
    taskList.appendChild(taskItem);
}

fetchTasks();