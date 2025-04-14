//Function to update the date and day on the page
function updateDateDisplay() {
    //Array of days to assign index numbers to their respective day
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    //Create a new date constant for the current date and time and assign it to (now)
    const now = new Date();
    
    //Get the current day name using the days index and assign it to (dayName)
    const dayName = days[now.getDay()];
    
    //Get a date string and assign it to (dateStr)
    const dateStr = now.toLocaleDateString();
    
    // Update the content of the UI element {day} to show the current day
    document.getElementById('day').textContent = dayName;
    
    //Update the content of the UI element {date} to show the current date
    document.getElementById('date').textContent = dateStr;
}

//Call the function once to set the initial date display
updateDateDisplay();
