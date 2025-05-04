
const currentUser = localStorage.getItem("currentUser");
const users = JSON.parse(localStorage.getItem("users")) || {};
const logoutButton = document.querySelector('.logout-button'); // Select the logout button

updateUserInfo();

function updateUserInfo() {
    const userNameElement = document.querySelector('.user-name');
    const userEmailElement = document.querySelector('.user-email');
    
    if (currentUser && users[currentUser]) {
        userNameElement.textContent = users[currentUser].username || "User";
        userEmailElement.textContent = users[currentUser].email || currentUser;
    }
}

logoutButton.addEventListener('click', function () {
    // Clear the current user from local storage
    localStorage.removeItem('currentUser');

    // Redirect to the login page
    window.location.href = 'login_signup.html';
});