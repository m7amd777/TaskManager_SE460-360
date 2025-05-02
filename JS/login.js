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

// Login form submission handling
document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = this.elements[0].value.trim();
    const password = this.elements[1].value.trim();

    // Validate empty fields
    if (!username || !password) {
        alert('Please fill in both username and password.');
        return;
    }
    
    // Check if the user's credentials exist in local storage
    const users = JSON.parse(localStorage.getItem('users')) || {};
    const user = users[username];
    
    if (user && user.password === password) {
        // Store logged-in status
        localStorage.setItem('currentUser', username);
        
        // Redirect to tasks page
        alert('Login successful! Redirecting to dashboard...');
        window.location.href = 'index.html';
    } else {
        alert('Invalid username or password!');
    }
});

// Signup form submission handling
document.getElementById('signup-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form values
    const firstName = this.elements[0].value.trim();
    const lastName = this.elements[1].value.trim();
    const username = this.elements[2].value.trim();
    const email = this.elements[3].value.trim();
    const password = this.elements[4].value.trim();
    const confirmPassword = this.elements[5].value.trim();
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

    if (!username || !email || !password || !firstName || !lastName) {
        alert('All fields are required!');
        return;
    }

    // Store user data in local storage
    const users = JSON.parse(localStorage.getItem('users')) || {};

    // Check if the username or email already exists
    if (users[username]) {
        alert('Username already exists!');
        return;
    }

    if (Object.values(users).some(u => u.email === email)) {
        alert('Email already exists!');
        return;
    }

    // Add a new user
    users[username] = {
        firstName,
        lastName,
        username,
        email,
        password, // Note: Passwords should ideally be hashed
        tasks: []
    };

    localStorage.setItem('users', JSON.stringify(users));

    alert('Registration successful! Redirecting to login...');
    togglePages();
});