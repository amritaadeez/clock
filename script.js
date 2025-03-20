// Global interval ID
let globalClockInterval;

function setClockNumbers() {
  const clockFace = document.querySelector('.clock-face');
  
  // Remove existing numbers if any
  const existingNumbers = clockFace.querySelectorAll('.number');
  existingNumbers.forEach(num => num.remove());
  
  // Add numbers 1 to 12
  for (let i = 1; i <= 12; i++) {
    const number = document.createElement('div');
    number.className = 'number';
    number.textContent = i;
    
    // Calculate position
    const angle = (i * 30 - 90) * (Math.PI / 180); // Convert to radians
    const radius = 120; // Adjust this value to position numbers
    
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    
    // Position the number
    number.style.left = `${50 + (x / clockFace.offsetWidth) * 100}%`;
    number.style.top = `${50 + (y / clockFace.offsetHeight) * 100}%`;
    number.style.transform = 'translate(-50%, -50%)';
    
    clockFace.appendChild(number);
  }
}

function updateClockForTimezone(timezone) {
  function updateClock() {
    const date = new Date().toLocaleString('en-US', { timeZone: timezone });
    const localDate = new Date(date);
    
    const second = localDate.getSeconds();
    const minutes = localDate.getMinutes();
    const hours = localDate.getHours() % 12;

    // Calculate degrees
    const secondDegrees = (second / 60) * 360;
    const secondBackDegrees = (secondDegrees + 180) % 360;
    const minuteDegrees = ((minutes + second / 60) / 60) * 360;
    const hourDegrees = ((hours + minutes / 60) / 12) * 360;

    // Update analog clock hands
    document.querySelector('.second-hand').style.transform = 
      `translateX(-50%) rotate(${secondDegrees}deg)`;
    document.querySelector('.second-hand-back').style.transform = 
      `translateX(-50%) rotate(${secondBackDegrees}deg)`;
    document.querySelector('.minute-hand').style.transform = 
      `translateX(-50%) rotate(${minuteDegrees}deg)`;
    document.querySelector('.hour-hand').style.transform = 
      `translateX(-50%) rotate(${hourDegrees}deg)`;

    // Update digital clocks with complete date and time
    const digitalClocks = document.querySelectorAll('.digital-clock');
    const timeStr = localDate.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    
    const dateStr = localDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    digitalClocks.forEach(clock => {
      clock.innerHTML = `
        <div class="digital-date">${dateStr}</div>
        <div class="digital-time">${timeStr}</div>
      `;
    });

    // Update date boxes
    const dateTimes = document.querySelectorAll('.date-time');
    dateTimes.forEach(dateTime => {
      dateTime.innerHTML = '';
      const day = document.createElement('div');
      const month = document.createElement('div');
      day.classList.add('date-box');
      month.classList.add('month-box');
      day.innerHTML = localDate.getDate();
      month.innerHTML = localDate.toLocaleString("default", { month: "short" });
      dateTime.appendChild(day);
      dateTime.appendChild(month);
    });

    // Update all timezone list items
    const timeZoneItems = document.querySelectorAll('.time-zone-item');
    timeZoneItems.forEach(item => {
      const itemTimezone = item.dataset.timezone;
      const timeElement = item.querySelector('.time');
      const dateElement = item.querySelector('.date');
      
      const itemDate = new Date().toLocaleString('en-US', { timeZone: itemTimezone });
      const itemLocalDate = new Date(itemDate);
      
      // Update time
      const itemTimeStr = itemLocalDate.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit'
      });
      timeElement.textContent = itemTimeStr;
      
      // Update date
      const itemDateStr = itemLocalDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
      dateElement.textContent = itemDateStr;
    });
  }

  // Clear existing interval
  if (globalClockInterval) {
    clearInterval(globalClockInterval);
  }

  // Initial update
  updateClock();

  // Set new interval
  globalClockInterval = setInterval(updateClock, 1000);
}

function initializeTimeZones() {
  const timeZoneItems = document.querySelectorAll('.time-zone-item');
  
  timeZoneItems.forEach(item => {
    item.addEventListener('click', () => {
      // Remove active class from all items
      timeZoneItems.forEach(i => i.classList.remove('active'));
      
      // Add active class to clicked item
      item.classList.add('active');
      
      // Get timezone and city name
      const timezone = item.dataset.timezone;
      const cityName = item.querySelector('.city').textContent;
      
      // Update clock name
      document.querySelector('.clock-name').textContent = cityName;
      
      // Update clock for selected timezone
      updateClockForTimezone(timezone);
    });
  });
}

// Initialize everything when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  setClockNumbers();
  initializeTimeZones();
  
  // Initialize with default timezone (New Delhi)
  const defaultTimezone = document.querySelector('.time-zone-item.active').dataset.timezone;
  const defaultCityName = document.querySelector('.time-zone-item.active .city').textContent;
  document.querySelector('.clock-name').textContent = defaultCityName;
  updateClockForTimezone(defaultTimezone);
});
