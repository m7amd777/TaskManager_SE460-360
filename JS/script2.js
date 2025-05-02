// DOM elements
const taskInput = document.getElementById('task-input'); //Input field for new task text
const priorityDropdown = document.getElementById('priority-dropdown'); //Dropdown box to select task priority
const addTaskBtn = document.getElementById('add-task-btn'); //Button to add a new task
const searchInput = document.getElementById('search-input'); //Input field to search and filter tasks
const taskList = document.getElementById('task-list'); //UI element to display the list of tasks
const filterButtons = document.querySelectorAll('.filter-btn'); //Buttons for filtering by priority
const logoutButton = document.querySelector('.logout-button'); // Select the logout button

// Task array to store all tasks
let tasks = [];
let currentFilter = 'all'; //Default filter as the page loads
const currentUser = localStorage.getItem("currentUser");
const users = JSON.parse(localStorage.getItem("users")) || {};


if (!currentUser || !users[currentUser]) {
  // No valid user logged in, redirect to login
  window.location.href = "login_signup.html";
} else {
  // Valid user logged in
  const userData = users[currentUser];
  const tasks = userData.tasks;

  // Proceed with showing user's tasks
  console.log("Tasks for", currentUser, ":", tasks);
}



// Load tasks from local storage
function loadTasks() {
    const currentUser = localStorage.getItem('currentUser');
    const users = JSON.parse(localStorage.getItem('users')) || {};

    if (!currentUser || !users[currentUser]) {
        alert("No user logged in. Redirecting to login.");
        window.location.href = "login_signup.html";
        return;
    }

    tasks = users[currentUser].tasks || [];
}


// Initialize the app
loadTasks(); //Load tasks when page is loaded
renderTasks(); //display the loaded tasks

// Event listeners
addTaskBtn.addEventListener('click', addTask); //Add task on button click
taskInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addTask(); //Add the task when ENTER is pressed
    }
});

searchInput.addEventListener('input', function() {
    filterAndRenderTasks(); //Filter tasks as the user is typing in search box
});

// Filter buttons
filterButtons.forEach(button => {
    button.addEventListener('click', function() {
        filterButtons.forEach(btn => btn.classList.remove('active')); //Remove active class from all buttons
        this.classList.add('active'); //Add active class to clicked button
        currentFilter = this.getAttribute('data-filter'); //Get the filter type
        filterAndRenderTasks(); //Redisplay tasks with new filter
    });
});

// Add task function
function addTask() {
    const taskText = taskInput.value.trim(); //Get input from user and trim it
    if (taskText) {
        const newTask = {
            id: Date.now().toString(), //Generate a unique task ID by using current timestamp and using at as the ID
            text: taskText, //Task description
            completed: false, //Mark task as incomplete
            priority: priorityDropdown.value //Set priority from dropdown box
        };
        
        tasks.unshift(newTask); // Add new task to start of the array
        saveTasks(); // Save to localStorage
        filterAndRenderTasks(); //Re-render tasks
        
        taskInput.value = ''; //Clear input
        taskInput.focus(); //Focus input again
    }
}

// Remove task function
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id); //Filter out tasks by ID
    saveTasks(); //Save changes made to tasks
    filterAndRenderTasks();
}

// Toggle task completion
function toggleTaskCompletion(id) {
    tasks = tasks.map(task => {
        if (task.id === id) {
            return { ...task, completed: !task.completed }; //Toggle completion status (complete / incomplete)
        }
        return task;
    });
    
    saveTasks();
    filterAndRenderTasks();
}

// Edit task function
function editTask(id) {
    const taskElement = document.getElementById(`task-${id}`); //Get DOM element of task
    const task = tasks.find(t => t.id === id); //Find a task in array
    
    if (!taskElement || !task) return; //Exit if a task is not found
    
    //Replace task HTML with editable version
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
    
    const editInput = taskElement.querySelector('.edit-input'); //Text input for editing
    const editPriorityDropdown = taskElement.querySelector('.edit-priority-dropdown'); //Dropdown box for priority editing
    const saveBtn = taskElement.querySelector('.save-btn'); //Save button
    const cancelBtn = taskElement.querySelector('.cancel-btn'); //Cancel button
    
    editInput.focus(); //Focus on input field
    
    saveBtn.addEventListener('click', () => {
        saveTaskEdit(id, editInput.value.trim(), editPriorityDropdown.value); //Save edited task
    });
    
    cancelBtn.addEventListener('click', () => {
        filterAndRenderTasks(); //Cancel edit and redisplay task
    });
    
    editInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            saveTaskEdit(id, editInput.value.trim(), editPriorityDropdown.value); //Save when ENTER is pressed
        }
    });
}

// Save edited task
function saveTaskEdit(id, newText, newPriority) {
    if (newText) {
        tasks = tasks.map(task => {
            if (task.id === id) {
                return { ...task, text: newText, priority: newPriority }; //Update task
            }
            return task;
        });
        
        saveTasks();
    }
    filterAndRenderTasks();
}

// Filter and render tasks
function filterAndRenderTasks() {
    const searchTerm = searchInput.value.toLowerCase().trim(); //Get search input from user
    renderTasks(searchTerm); //display tasks that match the search term
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
            toggleTaskCompletion(taskId); //Toggle completion status (complete / incomplete)
        });
    });
    
    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', function() {
            const taskId = this.closest('.task-item').id.replace('task-', '');
            editTask(taskId); // Enter edit mode
        });
    });
    
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', function() {
            const taskId = this.closest('.task-item').id.replace('task-', '');
            deleteTask(taskId); //Delete task
        });
    });
}

// Save tasks to local storage
function saveTasks() {
    try {
        const currentUser = localStorage.getItem('currentUser');
        const users = JSON.parse(localStorage.getItem('users')) || {};

        if (!currentUser || !users[currentUser]) {
            console.error("Cannot save: No user or user data found.");
            return;
        }

        users[currentUser].tasks = tasks;
        localStorage.setItem('users', JSON.stringify(users));
    } catch (e) {
        console.error('Error saving tasks to local storage:', e);
    }
}


// Add event listener for logout
logoutButton.addEventListener('click', function () {
    // Clear the current user from local storage
    localStorage.removeItem('currentUser');

    // Redirect to the login page
    window.location.href = 'login_signup.html';
});
