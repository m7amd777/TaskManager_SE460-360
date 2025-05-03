const categoryNameInput = document.getElementById('category-name');
const categoryColorInput = document.getElementById('category-color');
const addCategoryBtn = document.getElementById('add-category-btn');
const categoriesList = document.getElementById('categories-list');

const currentUser = localStorage.getItem("currentUser");
const users = JSON.parse(localStorage.getItem("users")) || {};

if (!currentUser || !users[currentUser]) {
  window.location.href = "login_signup.html";
}

let categories = users[currentUser].categories || [];

function saveCategories() {
  users[currentUser].categories = categories;
  localStorage.setItem("users", JSON.stringify(users));
}

function renderCategories() {
  categoriesList.innerHTML = '';

  if (categories.length === 0) {
    categoriesList.innerHTML = `<div class="empty-categories">No categories added yet.</div>`;
    return;
  }

  categories.forEach(category => {
    const div = document.createElement('div');
    div.className = 'category-item';
    div.style.borderLeftColor = category.color;
    div.innerHTML = `
      <div class="category-item-name">${category.name}</div>
      <div class="category-item-count">${countTasksInCategory(category.name)} task(s)</div>
      <div class="category-item-actions">
        <button class="edit-category-btn" onclick="editCategory('${category.name}')">✏️</button>
        <button class="delete-category-btn" onclick="deleteCategory('${category.name}')">🗑️</button>
      </div>
    `;
    div.addEventListener('click', () => {
      localStorage.setItem("activeCategory", category.name);
      window.location.href = "index.html";
    });
    categoriesList.appendChild(div);
  });
}

function countTasksInCategory(name) {
  const userTasks = users[currentUser].tasks || [];
  return userTasks.filter(task => task.category === name).length;
}

function addCategory() {
  const name = categoryNameInput.value.trim();
  const color = categoryColorInput.value;

  if (!name) return alert("Please enter a category name.");

  if (categories.find(cat => cat.name === name)) {
    return alert("Category name already exists.");
  }

  categories.push({ name, color });
  saveCategories();
  renderCategories();

  categoryNameInput.value = '';
}

function deleteCategory(name) {
  if (!confirm(`Delete category "${name}"?`)) return;
  categories = categories.filter(cat => cat.name !== name);
  saveCategories();
  renderCategories();
}

function editCategory(name) {
  const newName = prompt("Enter new name:", name);
  if (!newName) return;
  const existing = categories.find(cat => cat.name === name);
  existing.name = newName;
  saveCategories();
  renderCategories();
}

addCategoryBtn.addEventListener('click', addCategory);
renderCategories();
