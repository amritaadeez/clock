// Add these at the beginning of your script
const tickSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2909/2909-preview.mp3');
tickSound.volume = 0.2;
let isSoundEnabled = true;

function toggleSound() {
  isSoundEnabled = !isSoundEnabled;
  const soundButton = document.querySelector('.sound-control i');
  soundButton.className = isSoundEnabled ? 'fas fa-volume-up' : 'fas fa-volume-mute';
}

// Initialize with Indian Time
const INDIAN_TIMEZONE = 'Asia/Kolkata';
let currentTimezone = INDIAN_TIMEZONE;

function setClockHands(date = new Date()) {
  let second = date.getSeconds();
  let minutes = date.getMinutes();
  let hours = date.getHours() % 12;

  const secondDegrees = (second / 60) * 360;
  const secondBackDegrees = (secondDegrees + 180) % 360;
  const minuteDegrees = ((minutes + second / 60) / 60) * 360;
  const hourDegrees = ((hours + minutes / 60) / 12) * 360;

  const secondHand = document.querySelector(".second-hand");
  secondHand.style.transform = `translateX(-50%) rotate(${secondDegrees}deg)`;
  
  // Add tick sound and animation
  if (isSoundEnabled && second === 0) {
    tickSound.play();
    secondHand.classList.add('tick-animation');
    setTimeout(() => secondHand.classList.remove('tick-animation'), 100);
  }

  document.querySelector(".second-hand-back").style.transform = `translateX(-50%) rotate(${secondBackDegrees}deg)`;
  document.querySelector(".minute-hand").style.transform = `translateX(-50%) rotate(${minuteDegrees}deg)`;
  document.querySelector(".hour-hand").style.transform = `translateX(-50%) rotate(${hourDegrees}deg)`;
}

function setNumbers() {
  const clockFace = document.querySelector(".clock-face");
  for (let i = 1; i <= 12; i++) {
    const number = document.createElement("div");
    // number.className = "number";
    number.classList.add("number");
    number.textContent = i;

    const angle = (i - 3) * 30 * (Math.PI / 180);
    const x = 145 + 130 * Math.cos(angle);
    const y = 138 + 130 * Math.sin(angle);
    number.style.left = `${x}px`;
    number.style.top = `${y}px`;
    clockFace.appendChild(number);
  }
}

function updateDateDisplay(timezone) {
  const dateTime = document.querySelector(".date-time");
  const dateOptions = {
    timeZone: timezone,
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  
  const date = new Date().toLocaleDateString('en-US', dateOptions);
  dateTime.textContent = date;
}

function digitalClock(timezone = currentTimezone) {
  const digitalClock = document.querySelector(".digital-clock");
  const options = {
    timeZone: timezone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  };
  
  let timeString = new Date().toLocaleTimeString('en-US', options);
  digitalClock.innerHTML = timeString;
}

function updateWorldTimes() {
  const timeZones = document.querySelectorAll('.time-zone-item');
  
  timeZones.forEach(zone => {
    const timezone = zone.dataset.timezone;
    const timeElement = zone.querySelector('.time');
    const dateElement = zone.querySelector('.date');
    
    const options = {
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    };
    
    const dateOptions = {
      timeZone: timezone,
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    };
    
    const time = new Date().toLocaleTimeString('en-US', options);
    const date = new Date().toLocaleDateString('en-US', dateOptions);
    
    timeElement.textContent = time;
    dateElement.textContent = date;
  });
}

function updateClockToTimezone(timezone) {
  currentTimezone = timezone;
  const options = { timeZone: timezone };
  const date = new Date().toLocaleString('en-US', options);
  setClockHands(new Date(date));
  digitalClock(timezone);
  updateDateDisplay(timezone);
  
  // Update timezone display
  const cityName = document.querySelector(`[data-timezone="${timezone}"] .city`).textContent;
  document.querySelector('.current-timezone').textContent = cityName + ' Time';
  
  // Update active state of time zone items
  document.querySelectorAll('.time-zone-item').forEach(item => {
    item.classList.toggle('active', item.dataset.timezone === timezone);
  });
}

function resetToIndianTime() {
  const indianTimeZone = document.querySelector(`[data-timezone="${INDIAN_TIMEZONE}"]`);
  if (indianTimeZone) {
    document.querySelectorAll('.time-zone-item').forEach(z => z.classList.remove('active'));
    indianTimeZone.classList.add('active');
    updateClockToTimezone(INDIAN_TIMEZONE);
  }
}

function initializeWorldTime() {
  const timeZones = document.querySelectorAll('.time-zone-item');
  
  timeZones.forEach(zone => {
    zone.addEventListener('click', () => {
      timeZones.forEach(z => z.classList.remove('active'));
      zone.classList.add('active');
      updateClockToTimezone(zone.dataset.timezone);
    });
  });
  
  // Initial update
  updateDateDisplay(currentTimezone);
}

// Initialize everything
setNumbers();
initializeWorldTime();
resetToIndianTime(); // Start with Indian time

// Set up intervals
setInterval(() => {
  const options = { timeZone: currentTimezone };
  const date = new Date().toLocaleString('en-US', options);
  setClockHands(new Date(date));
  updateDateDisplay(currentTimezone);  // Add this line to update date regularly
}, 1000);

setInterval(() => {
  digitalClock(currentTimezone);
  updateWorldTimes();
}, 1000);
