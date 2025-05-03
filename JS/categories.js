// DOM Elements
const categoryNameInput = document.getElementById('category-name');
const categoryColorInput = document.getElementById('category-color');
const addCategoryBtn = document.getElementById('add-category-btn');
const categorySearchInput = document.getElementById('category-search');
const categoriesList = document.getElementById('categories-list');
const categoryTasksSection = document.getElementById('category-tasks-section');
const selectedCategoryName = document.getElementById('selected-category-name');
const selectedCategoryTitle = document.getElementById('selected-category-title');
const selectedCategoryHeader = document.getElementById('selected-category-header');
const selectedCategoryIcon = document.getElementById('selected-category-icon');
const categoryTaskInput = document.getElementById('category-task-input');
const categoryPriorityDropdown = document.getElementById('category-priority-dropdown');
const addCategoryTaskBtn = document.getElementById('add-category-task-btn');
const categoryTaskList = document.getElementById('category-task-list');
const backToCategoriesBtn = document.getElementById('back-to-categories-btn');
const logoutButton = document.querySelector('.logout-button');
const categorybox = document.getElementById('task-category-section');

// State variables
let categories = [];
let currentCategory = null;
let currentUser = null;
let users = {};
let tasks = [];

// Initialize the app
function init() {
    loadUser();
    loadCategories();
    loadTasks();
    renderCategories();
    setupEventListeners();
    updateUserInfo();
}

// Load current user from localStorage
function loadUser() {
    currentUser = localStorage.getItem('currentUser');
    users = JSON.parse(localStorage.getItem('users')) || {};

    // If no user or invalid user, redirect to login
    if (!currentUser || !users[currentUser]) {
        alert("No user logged in. Redirecting to login.");
        window.location.href = "login_signup.html";
        return;
    }
}

// Update user info in sidebar
function updateUserInfo() {
    const userNameElement = document.querySelector('.user-name');
    const userEmailElement = document.querySelector('.user-email');
    
    if (currentUser && users[currentUser]) {
        userNameElement.textContent = users[currentUser].username || "User";
        userEmailElement.textContent = users[currentUser].email || currentUser;
    }
}

// Load categories from localStorage
function loadCategories() {
    if (!currentUser || !users[currentUser]) return;
    
    // Initialize categories array if it doesn't exist
    if (!users[currentUser].categories) {
        users[currentUser].categories = [];
        saveCategories();
    }
    
    categories = users[currentUser].categories;
}

// Save categories to localStorage
function saveCategories() {
    if (!currentUser || !users[currentUser]) return;
    
    users[currentUser].categories = categories;
    localStorage.setItem('users', JSON.stringify(users));
}

// Save tasks to local storage (unified function)
function saveTasks() {
    if (!currentUser || !users[currentUser]) return;

    users[currentUser].tasks = tasks; // Update tasks for the current user
    localStorage.setItem('users', JSON.stringify(users)); // Save back to local storage
}

// Load tasks from local storage
function loadTasks() {
    if (!currentUser || !users[currentUser]) return;

    tasks = users[currentUser].tasks || [];
}

// Set up event listeners
function setupEventListeners() {
    // Add new category
    addCategoryBtn.addEventListener('click', addCategory);
    categoryNameInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addCategory();
        }
    });
    
    // Search categories
    categorySearchInput.addEventListener('input', function() {
        renderCategories(this.value.toLowerCase().trim());
    });
    
    // Back button
    backToCategoriesBtn.addEventListener('click', function() {
        showCategoriesView();
    });
    
    // Add task to category
    addCategoryTaskBtn.addEventListener('click', addTaskToCategory);
    categoryTaskInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addTaskToCategory();
        }
    });
    
    // Logout button
    logoutButton.addEventListener('click', function() {
        localStorage.removeItem('currentUser');
        window.location.href = 'login_signup.html';
    });
}

// Add a new category
function addCategory() {
    const name = categoryNameInput.value.trim();
    const color = categoryColorInput.value;
    
    if (name) {
        const newCategory = {
            id: Date.now().toString(),
            name: name,
            color: color,
            tasks: []
        };
        
        categories.push(newCategory);
        saveCategories();
        renderCategories();
        
        // Clear input fields
        categoryNameInput.value = '';
    }
}

// Render categories
function renderCategories(searchTerm = '') {
    categoriesList.innerHTML = '';
    
    // Filter categories by search term
    const filteredCategories = categories.filter(category => 
        category.name.toLowerCase().includes(searchTerm)
    );
    
    // Show empty state if no categories
    if (filteredCategories.length === 0) {
        const emptyState = document.createElement('div');
        emptyState.className = 'empty-categories';
        
        if (searchTerm) {
            emptyState.textContent = 'No categories match your search.';
        } else {
            emptyState.textContent = 'No categories yet. Add a category to get started!';
        }
        
        categoriesList.appendChild(emptyState);
        return;
    }
    
    // Render each category
    filteredCategories.forEach(category => {
        const categoryElement = document.createElement('div');
        categoryElement.className = 'category-item';
        categoryElement.style.borderLeftColor = category.color;
        
        // Get task count for this category
        const taskCount = tasks.filter(task => task.categoryId === category.id).length;
        
        categoryElement.innerHTML = `
            <div class="category-details">
                <div class="category-item-name">${category.name}</div>
                <div class="category-item-count">${taskCount} task${taskCount !== 1 ? 's' : ''}</div>
            </div>
            <div class="category-item-actions">
                <button class="edit-category-btn">✏️</button>
                <button class="delete-category-btn">🗑️</button>
            </div>
        `;
        
        // Add click event for viewing category tasks
        categoryElement.querySelector('.category-details').addEventListener('click', function() {
            viewCategoryTasks(category);
        });
        
        // Add edit button handler
        categoryElement.querySelector('.edit-category-btn').addEventListener('click', function(e) {
            e.stopPropagation();
            editCategory(category, categoryElement);
        });
        
        // Add delete button handler
        categoryElement.querySelector('.delete-category-btn').addEventListener('click', function(e) {
            e.stopPropagation();
            deleteCategory(category.id);
        });
        
        categoriesList.appendChild(categoryElement);
    });
}

// Edit category
function editCategory(category, categoryElement) {
    // Save original content to restore if cancelled
    const originalContent = categoryElement.innerHTML;
    
    // Replace with edit form
    categoryElement.innerHTML = `
        <div class="category-edit-form">
            <input type="text" class="edit-category-name" value="${category.name}">
            <div class="color-selector">
                <label>Color:</label>
                <input type="color" class="edit-category-color" value="${category.color}">
            </div>
            <div class="category-edit-buttons">
                <button class="save-category-btn">Save</button>
                <button class="cancel-edit-btn">Cancel</button>
            </div>
        </div>
    `;
    
    const nameInput = categoryElement.querySelector('.edit-category-name');
    const colorInput = categoryElement.querySelector('.edit-category-color');
    const saveBtn = categoryElement.querySelector('.save-category-btn');
    const cancelBtn = categoryElement.querySelector('.cancel-edit-btn');
    
    // Focus on name input
    nameInput.focus();
    
    // Save button handler
    saveBtn.addEventListener('click', function() {
        const newName = nameInput.value.trim();
        const newColor = colorInput.value;
        
        if (newName) {
            // Update category in array
            categories = categories.map(c => {
                if (c.id === category.id) {
                    return { ...c, name: newName, color: newColor };
                }
                return c;
            });
            
            saveCategories();
            renderCategories(categorySearchInput.value.toLowerCase().trim());
        }
    });
    
    // Cancel button handler
    cancelBtn.addEventListener('click', function() {
        categoryElement.innerHTML = originalContent;
        
        // Re-add event listeners
        categoryElement.querySelector('.category-details').addEventListener('click', function() {
            viewCategoryTasks(category);
        });
        
        categoryElement.querySelector('.edit-category-btn').addEventListener('click', function(e) {
            e.stopPropagation();
            editCategory(category, categoryElement);
        });
        
        categoryElement.querySelector('.delete-category-btn').addEventListener('click', function(e) {
            e.stopPropagation();
            deleteCategory(category.id);
        });
    });
}

// Delete category
function deleteCategory(categoryId) {
    if (confirm('Are you sure you want to delete this category? All tasks in this category will be deleted.')) {
        categories = categories.filter(category => category.id !== categoryId);
        tasks = tasks.filter(task => task.categoryId !== categoryId);
        saveCategories();
        saveTasks();
        renderCategories(categorySearchInput.value.toLowerCase().trim());
    }
}

// View tasks for a specific category
function viewCategoryTasks(category) {
    currentCategory = category;

    // Update UI
    selectedCategoryName.textContent = category.name.toUpperCase();
    selectedCategoryTitle.textContent = `${category.name} TASKS`;
    selectedCategoryHeader.style.backgroundColor = category.color;

    // Set the background color of the entire tasks container
    categoryTasksSection.style.backgroundColor = category.color;
    selectedCategoryTitle.style.color = category.color;
    backToCategoriesBtn.style.backgroundColor = category.color

    // Show category tasks section
    categoryTasksSection.style.display = 'block';
    categorybox.style.display = 'none';

    // Scroll to tasks section
    categoryTasksSection.scrollIntoView({ behavior: 'smooth' });

    // Render tasks for this category
    renderCategoryTasks();
}

// Show categories view (hide specific category tasks)
function showCategoriesView() {
    categoryTasksSection.style.display = 'none';
    categorybox.style.display = 'block';
    currentCategory = null;
}

// Add task to current category
function addTaskToCategory() {
    if (!currentCategory) return;

    const taskText = categoryTaskInput.value.trim();
    const priority = categoryPriorityDropdown.value;

    if (taskText) {
        const newTask = {
            id: Date.now().toString(),
            text: taskText,
            completed: false,
            priority: priority,
            categoryId: currentCategory.id // Link task to category
        };

        tasks.unshift(newTask); // Add task to centralized tasks array
        saveTasks(); // Save tasks to local storage
        renderCategoryTasks(); // Re-render tasks for the current category

        // Clear input
        categoryTaskInput.value = '';
        categoryTaskInput.focus();
    }
}

// Render tasks for current category
function renderCategoryTasks() {
    if (!currentCategory) return;

    categoryTaskList.innerHTML = '';

    // Filter tasks for the current category
    const categoryTasks = tasks.filter(task => task.categoryId === currentCategory.id);

    // Show empty state if no tasks
    if (categoryTasks.length === 0) {
        const emptyState = document.createElement('div');
        emptyState.className = 'empty-state';
        emptyState.textContent = `No tasks in ${currentCategory.name} yet. Add a task to get started!`;
        categoryTaskList.appendChild(emptyState);
        return;
    }

    // Render each task
    categoryTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `task-item priority-${task.priority}`;
        li.id = `category-task-${task.id}`;

        li.innerHTML = `
            <div class="task-content">
                <div class="priority-indicator ${task.priority}"></div>
                <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
                <span class="task-text ${task.completed ? 'completed' : ''}">${task.text}</span>
            </div>
            <div class="task-actions">
                <button class="edit-btn">✏️</button>
                <button class="delete-btn">🗑️</button>
            </div>
        `;

        categoryTaskList.appendChild(li);
    });

    // Add event listeners for tasks
    document.querySelectorAll('.task-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            const taskId = this.closest('.task-item').id.replace('category-task-', '');
            toggleTaskCompletion(taskId);
        });
    });

    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', function () {
            const taskId = this.closest('.task-item').id.replace('category-task-', '');
            editTask(taskId);
        });
    });

    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', function () {
            const taskId = this.closest('.task-item').id.replace('category-task-', '');
            deleteTask(taskId);
        });
    });
}

// Toggle task completion status
function toggleTaskCompletion(taskId) {
    tasks = tasks.map(task => {
        if (task.id === taskId) {
            return { ...task, completed: !task.completed };
        }
        return task;
    });

    saveTasks();
    renderCategoryTasks();
}

// Edit task
function editTask(taskId) {
    const taskElement = document.getElementById(`category-task-${taskId}`);
    const task = tasks.find(t => t.id === taskId);

    if (!taskElement || !task) return;

    // Replace task HTML with editable version
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
        saveTaskEdit(taskId, editInput.value.trim(), editPriorityDropdown.value);
    });

    cancelBtn.addEventListener('click', () => {
        renderCategoryTasks();
    });

    editInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            saveTaskEdit(taskId, editInput.value.trim(), editPriorityDropdown.value);
        }
    });
}

// Save edited task
function saveTaskEdit(taskId, newText, newPriority) {
    if (!newText) return;

    tasks = tasks.map(task => {
        if (task.id === taskId) {
            return { ...task, text: newText, priority: newPriority };
        }
        return task;
    });

    saveTasks();
    renderCategoryTasks();
}

// Delete task
function deleteTask(taskId) {
    tasks = tasks.filter(task => task.id !== taskId);

    saveTasks();
    renderCategoryTasks();
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);