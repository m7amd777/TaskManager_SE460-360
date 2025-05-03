document.addEventListener('DOMContentLoaded', function() {
    // Set current date
    updateDate();
    
    // Calculate and update progress
    calculateTaskProgress();
    
    // Initialize carousel for journal prompts and quotes
    initCarousels();
    
    // Add click events for category cards
    initCategoryCards();
});

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



// Update the current date in the header
function updateDate() {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const now = new Date();
    const dayName = daysOfWeek[now.getDay()];
    const dateFormatted = `${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()}`;
    
    document.getElementById('day').textContent = dayName;
    document.getElementById('date').textContent = dateFormatted;
}

// Calculate and display task progress
function calculateTaskProgress() {
    // Get current user and their tasks
    const currentUser = localStorage.getItem('currentUser');
    const users = JSON.parse(localStorage.getItem('users')) || {};
    
    if (!currentUser || !users[currentUser]) {
        console.error("No user logged in or user data not found");
        // Set default value
        updateProgressBar(0);
        return;
    }
    
    const tasks = users[currentUser].tasks || [];
    
    if (tasks.length === 0) {
        updateProgressBar(0);
        return;
    }
    
    // Calculate percentage of completed tasks
    const completedTasks = tasks.filter(task => task.completed).length;
    const totalTasks = tasks.length;
    const progressPercentage = Math.round((completedTasks / totalTasks) * 100);
    
    // Update progress bar
    updateProgressBar(progressPercentage);
}

// Update the progress bar UI
function updateProgressBar(percentage) {
    const progressFill = document.getElementById('progress-fill');
    const progressPercentage = document.getElementById('progress-percentage');
    
    // Animate the progress bar
    progressFill.style.width = percentage + '%';
    progressPercentage.textContent = percentage + '%';
}

// Initialize carousels for journal prompts and quotes
function initCarousels() {
    // Journal prompts array
    const journalPrompts = [
        "What's the most memorable trip you've ever taken?",
        "What's one thing you're looking forward to this week?", 
        "What's a small win you had recently that made you proud?",
        "If you could learn any skill instantly, what would it be and why?"
    ];
    
    // Quotes array
    const quotes = [
        "If you've already started, don't give up until you get what you want.",
        "The secret of getting ahead is getting started.",
        "The best way to predict the future is to create it."
    ];
    
    // Initialize journal carousel
    initJournalCarousel(journalPrompts);
    
    // Initialize quote carousel
    initQuoteCarousel(quotes);
    
    // Add click event to dots for journal carousel navigation
    document.querySelectorAll('.dot').forEach(dot => {
        dot.addEventListener('click', function() {
            const index = this.getAttribute('data-index');
            showJournalSlide(parseInt(index));
        });
    });
}

// Initialize journal carousel
function initJournalCarousel(prompts) {
    // Create slides dynamically if needed
    const journalCarousel = document.querySelector('.journal-carousel');
    
    // Auto-rotate slides
    let currentJournalIndex = 0;
    
    // Function to show specific journal slide
    window.showJournalSlide = function(index) {
        const slides = document.querySelectorAll('.journal-slide');
        const dots = document.querySelectorAll('.dot');
        
        // Hide all slides
        slides.forEach(slide => {
            slide.classList.remove('active');
        });
        
        // Remove active class from all dots
        dots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        // Show specific slide
        currentJournalIndex = index;
        slides[currentJournalIndex].classList.add('active');
        dots[currentJournalIndex].classList.add('active');
    };
    
    // Auto rotate journal prompts every 10 seconds
    setInterval(() => {
        currentJournalIndex = (currentJournalIndex + 1) % prompts.length;
        showJournalSlide(currentJournalIndex);
    }, 2000);
}

// Initialize quote carousel
function initQuoteCarousel(quotes) {
    // Create slides dynamically if needed
    const quoteCarousel = document.querySelector('.quote-carousel');
    
    // Auto-rotate quotes
    let currentQuoteIndex = 0;
    
    // Function to show specific quote slide
    function showQuoteSlide(index) {
        const slides = document.querySelectorAll('.quote-slide');
        
        // Hide all slides
        slides.forEach(slide => {
            slide.classList.remove('active');
        });
        
        // Show specific slide
        currentQuoteIndex = index;
        slides[currentQuoteIndex].classList.add('active');
    }
    
    // Auto rotate quotes every 15 seconds
    setInterval(() => {
        currentQuoteIndex = (currentQuoteIndex + 1) % quotes.length;
        showQuoteSlide(currentQuoteIndex);
    }, 15000);
}

// Initialize category cards
function initCategoryCards() {
    const categoryCards = document.querySelectorAll('.category-card');
    
    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            const category = this.querySelector('h3').textContent;
            // Store selected category in localStorage for use in task_categories.html
            localStorage.setItem('selectedCategory', category);
            // Navigate to task categories page
            window.location.href = 'task_categories.html';
        });
    });
}