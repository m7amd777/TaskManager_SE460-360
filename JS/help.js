
const currentUser = localStorage.getItem("currentUser");
const users = JSON.parse(localStorage.getItem("users")) || {};

updateUserInfo();

function updateUserInfo() {
    const userNameElement = document.querySelector('.user-name');
    const userEmailElement = document.querySelector('.user-email');
    
    if (currentUser && users[currentUser]) {
        userNameElement.textContent = users[currentUser].username || "User";
        userEmailElement.textContent = users[currentUser].email || currentUser;
    }
}
