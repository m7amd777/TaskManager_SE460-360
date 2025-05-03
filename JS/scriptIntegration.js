// scriptintegration.js
// This script integrates tasks between categories and main task list

// Global variables
let allTasks = []; // Combined tasks from all sources

// Initialize integration
function initIntegration() {
    // Load user data
    const currentUser = localStorage.getItem('currentUser');
    const users = JSON.parse(localStorage.getItem('users')) || {};
    
    if (!currentUser || !users[currentUser]) {
        console.error("No valid user found.");
        return;
    }
    
    // Add event listeners to sync data whenever tasks are changed
    document.addEventListener('taskChanged', syncTasksData);
    document.addEventListener('categoryTaskChanged', syncTasksData);
    
    // Do initial sync
    syncTasksData();
}

// Sync tasks data between categories and main tasks
function syncTasksData() {
    const currentUser = localStorage.getItem('currentUser');
    const users = JSON.parse(localStorage.getItem('users')) || {};
    
    if (!currentUser || !users[currentUser]) {
        return;
    }
    
    // Initialize arrays if they don't exist
    if (!users[currentUser].tasks) {
        users[currentUser].tasks = [];
    }
    
    if (!users[currentUser].categories) {
        users[currentUser].categories = [];
    }
    
    // Get main tasks and category tasks
    const mainTasks = users[currentUser].tasks || [];
    const categories = users[currentUser].categories || [];
    
    // Extract tasks from categories
    let categoryTasks = [];
    categories.forEach(category => {
        if (category.tasks && Array.isArray(category.tasks)) {
            // Add category info to each task
            const tasksWithCategory = category.tasks.map(task => {
                return {
                    ...task,
                    fromCategory: true,
                    categoryId: category.id,
                    categoryName: category.name,
                    categoryColor: category.color
                };
            });
            categoryTasks = [...categoryTasks, ...tasksWithCategory];
        }
    });
    
    // Merge tasks (avoid duplicates based on ID)
    const taskIds = new Set();
    allTasks = [];
    
    // First add main tasks
    mainTasks.forEach(task => {
        if (!taskIds.has(task.id)) {
            allTasks.push(task);
            taskIds.add(task.id);
        }
    });
    
    // Then add category tasks that aren't already in main tasks
    categoryTasks.forEach(task => {
        if (!taskIds.has(task.id)) {
            // Add to main tasks list if not already there
            allTasks.push(task);
            taskIds.add(task.id);
            
            // Also add to user's main tasks array
            if (!users[currentUser].tasks.some(t => t.id === task.id)) {
                users[currentUser].tasks.push({
                    id: task.id,
                    text: task.text,
                    completed: task.completed,
                    priority: task.priority,
                    categoryId: task.categoryId,
                    categoryName: task.categoryName
                });
            }
        }
    });
    
    // Save combined tasks back to localStorage
    users[currentUser].tasks = allTasks;
    localStorage.setItem('users', JSON.stringify(users));
    
    // Trigger re-render if the functions exist
    if (typeof renderTasks === 'function') {
        renderTasks();
    }
    
    if (typeof renderCategories === 'function') {
        renderCategories();
    }
}

// Function to add event dispatchers to the original task functions
function patchTaskFunctions() {
    // Patch main task functions
    const originalAddTask = window.addTask;
    if (originalAddTask) {
        window.addTask = function() {
            originalAddTask.apply(this, arguments);
            document.dispatchEvent(new Event('taskChanged'));
        };
    }
    
    const originalDeleteTask = window.deleteTask;
    if (originalDeleteTask) {
        window.deleteTask = function() {
            originalDeleteTask.apply(this, arguments);
            document.dispatchEvent(new Event('taskChanged'));
        };
    }
    
    const originalToggleTaskCompletion = window.toggleTaskCompletion;
    if (originalToggleTaskCompletion) {
        window.toggleTaskCompletion = function() {
            originalToggleTaskCompletion.apply(this, arguments);
            document.dispatchEvent(new Event('taskChanged'));
        };
    }
    
    const originalSaveTaskEdit = window.saveTaskEdit;
    if (originalSaveTaskEdit) {
        window.saveTaskEdit = function() {
            originalSaveTaskEdit.apply(this, arguments);
            document.dispatchEvent(new Event('taskChanged'));
        };
    }
    
    // Patch category task functions
    const originalAddTaskToCategory = window.addTaskToCategory;
    if (originalAddTaskToCategory) {
        window.addTaskToCategory = function() {
            originalAddTaskToCategory.apply(this, arguments);
            document.dispatchEvent(new Event('categoryTaskChanged'));
        };
    }
    
    const originalToggleCategoryTaskCompletion = window.toggleCategoryTaskCompletion;
    if (originalToggleCategoryTaskCompletion) {
        window.toggleCategoryTaskCompletion = function() {
            originalToggleCategoryTaskCompletion.apply(this, arguments);
            document.dispatchEvent(new Event('categoryTaskChanged'));
        };
    }
    
    const originalSaveCategoryTaskEdit = window.saveCategoryTaskEdit;
    if (originalSaveCategoryTaskEdit) {
        window.saveCategoryTaskEdit = function() {
            originalSaveCategoryTaskEdit.apply(this, arguments);
            document.dispatchEvent(new Event('categoryTaskChanged'));
        };
    }
    
    const originalDeleteCategoryTask = window.deleteCategoryTask;
    if (originalDeleteCategoryTask) {
        window.deleteCategoryTask = function() {
            originalDeleteCategoryTask.apply(this, arguments);
            document.dispatchEvent(new Event('categoryTaskChanged'));
        };
    }
}

// Function to enhance task rendering to show category information
function enhanceTaskRendering() {
    const originalRenderTasks = window.renderTasks;
    if (originalRenderTasks) {
        window.renderTasks = function(searchTerm = '') {
            // Clear current list
            const taskList = document.getElementById('task-list');
            if (!taskList) return;
            
            taskList.innerHTML = '';
            
            // Get current user and data
            const currentUser = localStorage.getItem('currentUser');
            const users = JSON.parse(localStorage.getItem('users')) || {};
            
            if (!currentUser || !users[currentUser]) return;
            
            const tasks = users[currentUser].tasks || [];
            let filteredTasks = tasks.filter(task => 
                task.text.toLowerCase().includes(searchTerm.toLowerCase())
            );
            
            // Apply priority filter if active
            const currentFilter = window.currentFilter || 'all';
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
            
            // Render each task with category info if available
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
                
                // Add category badge if task is from a category
                let categoryBadge = '';
                if (task.categoryId && task.categoryName) {
                    const categoryColor = task.categoryColor || '#888';
                    categoryBadge = `
                        <div class="task-category-badge" style="background-color: ${categoryColor}">
                            ${task.categoryName}
                        </div>
                    `;
                }
                
                li.innerHTML = `
                    <div class="task-content">
                        <div class="priority-indicator ${task.priority}"></div>
                        <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
                        <span class="task-text ${task.completed ? 'completed' : ''}">${taskText}</span>
                        ${categoryBadge}
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
        };
    }
}

// Add new styles for category badges
function injectCategoryStyles() {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        .task-category-badge {
            display: inline-block;
            font-size: 11px;
            padding: 2px 6px;
            border-radius: 10px;
            color: white;
            margin-left: 8px;
            font-weight: bold;
        }
        
        /* Make task content flex to accommodate badge */
        .task-content {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
        }
    `;
    document.head.appendChild(styleElement);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add styles first
    injectCategoryStyles();
    
    // Patch functions to trigger sync events
    patchTaskFunctions();
    
    // Enhance task rendering
    enhanceTaskRendering();
    
    // Initialize the integration
    initIntegration();
    
    console.log('Task integration initialized!');
});