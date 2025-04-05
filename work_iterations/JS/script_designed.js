
// Update date display
function updateDateDisplay() {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const now = new Date();
    const dayName = days[now.getDay()];
    const dateStr = now.toLocaleDateString();
    
    document.getElementById('day').textContent = dayName;
    document.getElementById('date').textContent = dateStr;
}

updateDateDisplay();

// Mobile menu toggle
// document.querySelector('.menu-button').addEventListener('click', function() {
//     document.querySelector('.sidebar').classList.toggle('open');
// });

// Task item functionality
document.querySelectorAll('.task-item input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', function() {
        if (this.checked) {
            this.parentElement.parentElement.style.opacity = '0.6';
        } else {
            this.parentElement.parentElement.style.opacity = '1';
        }
    });
});

// Add new task
document.querySelector('.add-task-button').addEventListener('click', function() {
    const taskList = document.querySelector('.task-list');
    const taskCount = taskList.querySelectorAll('.task-item').length + 1;
    
    const newTask = document.createElement('div');
    newTask.className = 'task-item';
    newTask.innerHTML = `
        <div>
            <input type="checkbox" id="task${taskCount}">
            <label for="task${taskCount}">New task</label>
        </div>
    `;
    
    taskList.appendChild(newTask);
    
    // Add event listener to new checkbox
    newTask.querySelector('input[type="checkbox"]').addEventListener('change', function() {
        if (this.checked) {
            this.parentElement.parentElement.style.opacity = '0.6';
        } else {
            this.parentElement.parentElement.style.opacity = '1';
        }
    });
    
    // Make the label editable on creation
    const label = newTask.querySelector('label');
    label.contentEditable = true;
    label.focus();
    
    // Save when clicking outside
    label.addEventListener('blur', function() {
        if (this.textContent.trim() === '') {
            this.textContent = 'New task';
        }
        this.contentEditable = false;
    });
    
    // Save when pressing Enter
    label.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            this.blur();
        }
    });
});

// Add task category
// document.querySelector('.add-button').addEventListener('click', function() {
//     const categoriesContainer = document.querySelector('.task-categories');
//     const categoryCount = categoriesContainer.querySelectorAll('.task-category').length + 1;
    
//     const categories = ['WORK', 'PERSONAL', 'SHOPPING', 'HEALTH', 'FINANCE'];
//     const icons = ['💼', '👤', '🛒', '❤️', '💰'];
    
//     const randomIndex = Math.floor(Math.random() * categories.length);
//     const categoryName = categories[randomIndex];
//     const categoryIcon = icons[randomIndex];
    
//     const newCategory = document.createElement('div');
//     newCategory.className = 'task-category';
//     newCategory.innerHTML = `
//         <div class="category-header">
//             <span>${categoryName}</span>
//             <div class="category-icon">${categoryIcon}</div>
//         </div>
//         <div class="task-list">
//             <div class="task-item">
//                 <div>
//                     <input type="checkbox" id="${categoryName.toLowerCase()}1">
//                     <label for="${categoryName.toLowerCase()}1">To do list</label>
//                 </div>
//             </div>
//         </div>
//         <button class="add-task-button">
//             <span>+</span> Add Task
//         </button>
//     `;
    
//     categoriesContainer.appendChild(newCategory);
    
//     // Add event listeners to new elements
//     newCategory.querySelector('.add-task-button').addEventListener('click', function() {
//         const taskList = this.previousElementSibling;
//         const taskCount = taskList.querySelectorAll('.task-item').length + 1;
//         const catId = categoryName.toLowerCase();
        
//         const newTask = document.createElement('div');
//         newTask.className = 'task-item';
//         newTask.innerHTML = `
//             <div>
//                 <input type="checkbox" id="${catId}${taskCount}">
//                 <label for="${catId}${taskCount}">New task</label>
//             </div>
//         `;
        
//         taskList.appendChild(newTask);
        
//         // Add event listener to new checkbox
//         newTask.querySelector('input[type="checkbox"]').addEventListener('change', function() {
//             if (this.checked) {
//                 this.parentElement.parentElement.style.opacity = '0.6';
//             } else {
//                 this.parentElement.parentElement.style.opacity = '1';
//             }
//         });
        
//         // Make the label editable on creation
//         const label = newTask.querySelector('label');
//         label.contentEditable = true;
//         label.focus();
        
//         // Save when clicking outside
//         label.addEventListener('blur', function() {
//             if (this.textContent.trim() === '') {
//                 this.textContent = 'New task';
//             }
//             this.contentEditable = false;
//         });
        
//         // Save when pressing Enter
//         label.addEventListener('keydown', function(e) {
//             if (e.key === 'Enter') {
//                 e.preventDefault();
//                 this.blur();
//             }
//         });
//     });
// });

// Make task items editable on double-click
document.querySelectorAll('.task-item label').forEach(label => {
    label.addEventListener('dblclick', function() {
        this.contentEditable = true;
        this.focus();
        
        // Save when clicking outside
        this.addEventListener('blur', function() {
            if (this.textContent.trim() === '') {
                this.textContent = 'To do list';
            }
            this.contentEditable = false;
        });
        
        // Save when pressing Enter
        this.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.blur();
            }
        });
    });
});