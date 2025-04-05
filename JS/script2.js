// DOM elements
const taskInput = document.getElementById('task-input');
const priorityDropdown = document.getElementById('priority-dropdown');
const addTaskBtn = document.getElementById('add-task-btn');
const searchInput = document.getElementById('search-input');
const taskList = document.getElementById('task-list');
const filterButtons = document.querySelectorAll('.filter-btn');

// Task array to store all tasks
let tasks = [];
let currentFilter = 'all';

// Load tasks from local storage
function loadTasks() {
    try {
        const savedTasks = localStorage.getItem('tasks');
        if (savedTasks) {
            tasks = JSON.parse(savedTasks);
        }
    } catch (e) {
        console.error('Error loading tasks from local storage:', e);
        tasks = [];
    }
}

// Initialize the app
loadTasks();
renderTasks();

// Event listeners
addTaskBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addTask();
    }
});

searchInput.addEventListener('input', function() {
    filterAndRenderTasks();
});

// Filter buttons
filterButtons.forEach(button => {
    button.addEventListener('click', function() {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        currentFilter = this.getAttribute('data-filter');
        filterAndRenderTasks();
    });
});

// Add task function
function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText) {
        const newTask = {
            id: Date.now().toString(),
            text: taskText,
            completed: false,
            priority: priorityDropdown.value
        };
        
        tasks.unshift(newTask);
        saveTasks();
        filterAndRenderTasks();
        
        taskInput.value = '';
        taskInput.focus();
    }
}

// Remove task function
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    filterAndRenderTasks();
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
    filterAndRenderTasks();
}

// Edit task function
function editTask(id) {
    const taskElement = document.getElementById(`task-${id}`);
    const task = tasks.find(t => t.id === id);
    
    if (!taskElement || !task) return;
    
    taskElement.innerHTML = `
        <div class="task-content edit-mode">
            <input type="text" class="edit-input" value="${task.text}">
            <select class="edit-priority-dropdown">
                <option value="low" class="priority-low" ${task.priority === 'low' ? 'selected' : ''}>Low</option>
                <option value="medium" class="priority-medium" ${task.priority === 'medium' ? 'selected' : ''}>Medium</option>
                <option value="high" class="priority-high" ${task.priority === 'high' ? 'selected' : ''}>High</option>
            </select>
            <button class="save-btn">Save</button>
            <button class="cancel-btn">Cancel</button>
        </div>
    `;
    
    const editInput = taskElement.querySelector('.edit-input');
    const editPriorityDropdown = taskElement.querySelector('.edit-priority-dropdown');
    const saveBtn = taskElement.querySelector('.save-btn');
    const cancelBtn = taskElement.querySelector('.cancel-btn');
    
    editInput.focus();
    
    saveBtn.addEventListener('click', () => {
        saveTaskEdit(id, editInput.value.trim(), editPriorityDropdown.value);
    });
    
    cancelBtn.addEventListener('click', () => {
        filterAndRenderTasks();
    });
    
    editInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            saveTaskEdit(id, editInput.value.trim(), editPriorityDropdown.value);
        }
    });
}

// Save edited task
function saveTaskEdit(id, newText, newPriority) {
    if (newText) {
        tasks = tasks.map(task => {
            if (task.id === id) {
                return { ...task, text: newText, priority: newPriority };
            }
            return task;
        });
        
        saveTasks();
    }
    filterAndRenderTasks();
}

// Filter and render tasks
function filterAndRenderTasks() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    renderTasks(searchTerm);
}

// Render tasks to DOM
function renderTasks(searchTerm = '') {
    // Clear current list
    taskList.innerHTML = '';
    
    // Filter tasks based on search and priority filter
    let filteredTasks = tasks.filter(task => 
        task.text.toLowerCase().includes(searchTerm)
    );
    
    // Apply priority filter if not showing all
    if (currentFilter !== 'all') {
        filteredTasks = filteredTasks.filter(task => task.priority === currentFilter);
    }
    
    // Show empty state if no tasks
    if (filteredTasks.length === 0) {
        const emptyState = document.createElement('div');
        emptyState.className = 'empty-state';
        
        if (searchTerm) {
            emptyState.textContent = 'No tasks match your search.';
        } else if (currentFilter !== 'all') {
            emptyState.textContent = `No ${currentFilter} priority tasks found.`;
        } else {
            emptyState.textContent = 'No tasks yet. Add a task to get started!';
        }
        
        taskList.appendChild(emptyState);
        return;
    }
    
    // Render each task
    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `task-item priority-${task.priority}`;
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
                <div class="priority-indicator ${task.priority}"></div>
                <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
                <span class="task-text ${task.completed ? 'completed' : ''}">${taskText}</span>
            </div>
            <div class="task-actions">
                <button class="edit-btn">✏️</button>
                <button class="delete-btn">🗑️</button>
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
            const taskId = this.closest('.task-item').id.replace('task-', '');
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