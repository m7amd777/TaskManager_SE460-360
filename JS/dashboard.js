// Update current day and date
function updateDateTime() {
    const now = new Date();
    
    // Update day name
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayName = days[now.getDay()];
    document.getElementById('day').textContent = dayName;
    
    // Update date in MM/DD/YYYY format
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const year = now.getFullYear();
    document.getElementById('date').textContent = `${month}/${day}/${year}`;
}

// Task category carousel navigation
let currentSlide = 0;
const taskCards = document.querySelectorAll('.task-category-card');
const maxSlide = Math.ceil(taskCards.length / 3) - 1;

function showSlide(slideIndex) {
    if (slideIndex < 0) slideIndex = 0;
    if (slideIndex > maxSlide) slideIndex = maxSlide;
    
    currentSlide = slideIndex;
    const offset = -slideIndex * 100;
    document.querySelector('.task-carousel').style.transform = `translateX(${offset}%)`;
}

function nextSlide() {
    showSlide(currentSlide + 1);
}

function prevSlide() {
    showSlide(currentSlide - 1);
}

// Journal prompts carousel
let currentJournalSlide = 0;
const journalSlides = document.querySelectorAll('.journal-slide');
const journalDots = document.querySelectorAll('.carousel-dots .dot');

function showJournalSlide(slideIndex) {
    if (slideIndex < 0) slideIndex = journalSlides.length - 1;
    if (slideIndex >= journalSlides.length) slideIndex = 0;
    
    // Remove active class from all slides and dots
    journalSlides.forEach(slide => slide.classList.remove('active'));
    journalDots.forEach(dot => dot.classList.remove('active'));
    
    // Add active class to current slide and dot
    journalSlides[slideIndex].classList.add('active');
    journalDots[slideIndex].classList.add('active');
    
    currentJournalSlide = slideIndex;
}

function nextJournalSlide() {
    showJournalSlide(currentJournalSlide + 1);
}

function jumpToJournalSlide(slideIndex) {
    showJournalSlide(slideIndex);
}

// Quote carousel
let currentQuoteSlide = 0;
const quoteSlides = document.querySelectorAll('.quote-slide');

function showQuoteSlide(slideIndex) {
    if (slideIndex < 0) slideIndex = quoteSlides.length - 1;
    if (slideIndex >= quoteSlides.length) slideIndex = 0;
    
    // Remove active class from all slides
    quoteSlides.forEach(slide => slide.classList.remove('active'));
    
    // Add active class to current slide
    quoteSlides[slideIndex].classList.add('active');
    
    currentQuoteSlide = slideIndex;
}

function nextQuoteSlide() {
    showQuoteSlide(currentQuoteSlide + 1);
}

// Navigation to task categories
function navigateToCategory(category) {
    window.location.href = `taskcategories.html?category=${category}`;
}

// Initialize the carousels with automatic sliding
function initCarousels() {
    // Set intervals for automatic sliding
    setInterval(nextJournalSlide, 5000); // Journal slides every 5 seconds
    setInterval(nextQuoteSlide, 7000);   // Quotes every 7 seconds
}

// Execute when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    updateDateTime();
    initCarousels();
    
    // Update date and time every minute
    setInterval(updateDateTime, 60000);
});
