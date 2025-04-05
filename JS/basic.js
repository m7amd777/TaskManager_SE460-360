
// DOM elements
const taskInput = document.getElementById('task-input');
const addTaskBtn = document.getElementById('add-task-btn');
const searchInput = document.getElementById('search-input');
const taskList = document.getElementById('task-list');

// Task array to store all tasks
let tasks = [];

// Load tasks from local storage
try {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
    }
} catch (e) {
    console.error('Error loading tasks from local storage:', e);
    tasks = [];
}

// Initialize the app
renderTasks();

// Event listeners
addTaskBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addTask();
    }
});

searchInput.addEventListener('input', searchTasks);

// Add task function
function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText) {
        const newTask = {
            id: Date.now().toString(),
            text: taskText,
            completed: false
        };
        
        tasks.unshift(newTask);
        saveTasks();
        renderTasks();
        
        taskInput.value = '';
        taskInput.focus();
    }
}

// Remove task function
function deleteTask(id) {
    console.log('Deleting task with ID:', id);
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
}

// Toggle task completion
function toggleTaskCompletion(id) {
    tasks = tasks.map(task => {
        if (task.id === id) {
            return { ...task, completed: !task.completed };
        }
        return task;
    });
    
    saveTasks();
    renderTasks();
}

// Edit task function
function editTask(id) {
    const taskElement = document.getElementById(`task-${id}`);
    const task = tasks.find(t => t.id === id);
    
    if (!taskElement || !task) return;
    
    taskElement.innerHTML = `
        <div class="task-content edit-mode">
            <input type="text" class="edit-input" value="${task.text}">
            <button class="save-btn">Save</button>
            <button class="cancel-btn">Cancel</button>
        </div>
    `;
    
    const editInput = taskElement.querySelector('.edit-input');
    const saveBtn = taskElement.querySelector('.save-btn');
    const cancelBtn = taskElement.querySelector('.cancel-btn');
    
    editInput.focus();
    
    saveBtn.addEventListener('click', () => {
        saveTaskEdit(id, editInput.value.trim());
    });
    
    cancelBtn.addEventListener('click', () => {
        renderTasks();
    });
    
    editInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            saveTaskEdit(id, editInput.value.trim());
        }
    });
}

// Save edited task
function saveTaskEdit(id, newText) {
    if (newText) {
        tasks = tasks.map(task => {
            if (task.id === id) {
                return { ...task, text: newText };
            }
            return task;
        });
        
        saveTasks();
    }
    renderTasks();
}

// Search tasks
function searchTasks() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    renderTasks(searchTerm);
}

// Render tasks to DOM
function renderTasks(searchTerm = '') {
    // Clear current list
    taskList.innerHTML = '';
    
    // Filter tasks based on search
    const filteredTasks = tasks.filter(task => 
        task.text.toLowerCase().includes(searchTerm)
    );
    
    // Show empty state if no tasks
    if (filteredTasks.length === 0) {
        const emptyState = document.createElement('div');
        emptyState.className = 'empty-state';
        
        if (searchTerm) {
            emptyState.textContent = 'No tasks match your search.';
        } else {
            emptyState.textContent = 'No tasks yet. Add a task to get started!';
        }
        
        taskList.appendChild(emptyState);
        return;
    }
    
    // Render each task
    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = 'task-item';
        li.id = `task-${task.id}`;
        
        // Highlight matching text if searching
        let taskText = task.text;
        if (searchTerm) {
            const regex = new RegExp(`(${searchTerm})`, 'gi');
            taskText = taskText.replace(regex, '<span class="highlighted">$1</span>');
            li.classList.add('search-result');
        }
        
        li.innerHTML = `
            <div class="task-content">
                <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
                <span class="task-text ${task.completed ? 'completed' : ''}">${taskText}</span>
            </div>
            <div class="task-actions">
                <button class="edit-btn">✏️</button>
                <button class="delete-btn" data-id="${task.id}">🗑️</button>
                <button class="delete-btn" data-id="${task.id}">🗑️  </button>
            </div>
        `;
        
        taskList.appendChild(li);
    });
    
    // Add event listeners after DOM is updated
    document.querySelectorAll('.task-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const taskId = this.closest('.task-item').id.replace('task-', '');
            toggleTaskCompletion(taskId);
        });
    });
    
    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', function() {
            const taskId = this.closest('.task-item').id.replace('task-', '');
            editTask(taskId);
        });
    });
    
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', function() {
            const taskId = this.getAttribute('data-id');
            deleteTask(taskId);
        });
    });
}

// Save tasks to local storage
function saveTasks() {
    try {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    } catch (e) {
        console.error('Error saving tasks to local storage:', e);
    }
}