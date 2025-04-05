// Toggle between login and signup pages
function togglePages() {
    const loginPage = document.getElementById('login-page');
    const signupPage = document.getElementById('signup-page');
    
    if (loginPage.style.display === 'none') {
        loginPage.style.display = 'block';
        signupPage.style.display = 'none';
    } else {
        loginPage.style.display = 'none';
        signupPage.style.display = 'block';
    }
}

// Login form submission handler
document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = this.elements[0].value;
    const password = this.elements[1].value;
    
    // Check if credentials exist in local storage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        // Store logged in status
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        // Redirect to tasks page
        alert('Login successful! Redirecting to dashboard...');
        // window.location.href = 'dashboard.html';
    } else {
        alert('Invalid username or password!');
    }
});

// Signup form submission handler
document.getElementById('signup-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form values
    const firstName = this.elements[0].value;
    const lastName = this.elements[1].value;
    const username = this.elements[2].value;
    const email = this.elements[3].value;
    const password = this.elements[4].value;
    const confirmPassword = this.elements[5].value;
    const agreeTerms = this.elements[6].checked;
    
    // Validate form
    if (!agreeTerms) {
        alert('You must agree to the terms to continue!');
        return;
    }
    
    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }
    
    // Store user data in local storage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Check if username already exists
    if (users.some(u => u.username === username)) {
        alert('Username already exists!');
        return;
    }
    
    // Add new user
    users.push({
        firstName,
        lastName,
        username,
        email,
        password,
        tasks: []
    });
    
    localStorage.setItem('users', JSON.stringify(users));
    
    alert('Registration successful! Please login.');
    togglePages();
});