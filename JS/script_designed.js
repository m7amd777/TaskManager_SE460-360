function updateDateDisplay() {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const now = new Date();
    const dayName = days[now.getDay()];
    const dateStr = now.toLocaleDateString();
    
    document.getElementById('day').textContent = dayName;
    document.getElementById('date').textContent = dateStr;
}

updateDateDisplay();



