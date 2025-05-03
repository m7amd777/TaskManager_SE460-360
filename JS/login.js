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

document.addEventListener('DOMContentLoaded', () => {
    if (window.location.hash === '#signup') {
        togglePages();
    }
});
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
        window.location.href = 'dashboard.html';
    } else {
        alert('Invalid username or password!');
    }
});


//Function to make sure password meets common regulations
function isValidPassword(password) {
    const lengthCheck = /^.{8,32}$/;
    const lowercaseCheck = /[a-z]/;
    const uppercaseCheck = /[A-Z]/;
    const numberCheck = /[0-9]/;
    const specialCharCheck = /[!@#$%^&*(),.?":{}|<>]/;

    return (
        lengthCheck.test(password) &&
        lowercaseCheck.test(password) &&
        uppercaseCheck.test(password) &&
        numberCheck.test(password) &&
        specialCharCheck.test(password)
    );
}

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

    if (!isValidPassword(password)) {
        alert('Password must be 8-32 characters long and include uppercase, lowercase, number, and special character.');
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

//Dyanmic password validation to show which rules are met during registration
const passwordInput = document.querySelector('#signup-form input[placeholder="Enter Password"]');
const rules = {
    length: document.getElementById('rule-length'),
    upper: document.getElementById('rule-upper'),
    lower: document.getElementById('rule-lower'),
    number: document.getElementById('rule-number'),
    special: document.getElementById('rule-special')
};

if (passwordInput) {
    passwordInput.addEventListener('input', () => {
        const val = passwordInput.value;

        toggleRule(rules.length, val.length >= 8 && val.length <= 32);
        toggleRule(rules.upper, /[A-Z]/.test(val));
        toggleRule(rules.lower, /[a-z]/.test(val));
        toggleRule(rules.number, /[0-9]/.test(val));
        toggleRule(rules.special, /[!@#$%^&*(),.?":{}|<>]/.test(val));
    });
}

function toggleRule(element, isValid) {
    element.classList.toggle('valid', isValid);
}