function setClockHands() {
  let date = new Date();
  let second = date.getSeconds();
  let minutes = date.getMinutes();
  let hours = date.getHours() % 12;

  let day = date.getDay();
  let month = date.getMonth();

  console.log(second, minutes, hours);

  const secondDegrees = (second / 60) * 360;
  const secondBackDegrees = (secondDegrees + 180) % 360;
  const minuteDegrees = ((minutes + second / 60) / 60) * 360;
  const hourDegrees = ((hours + minutes / 60) / 12) * 360;

  document.querySelector(
    ".second-hand"
  ).style.transform = `translateX(-50%) rotate(${secondDegrees}deg)`;
  document.querySelector(
    ".second-hand-back"
  ).style.transform = `translateX(-50%) rotate(${secondBackDegrees}deg)`;
  document.querySelector(
    ".minute-hand"
  ).style.transform = `translateX(-50%) rotate(${minuteDegrees}deg)`;
  document.querySelector(
    ".hour-hand"
  ).style.transform = `translateX(-50%) rotate(${hourDegrees}deg)`;
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

function addDayMonth() {
  const dateTime = document.querySelector(".date-time");
  const day = document.createElement("div");
  const month = document.createElement("div");
  day.classList.add("date-box");
  month.classList.add("month-box");
  let date = new Date();
  day.innerHTML = date.getDate();
  month.innerHTML = date.toLocaleString("default", { month: "short" });
  console.log(date);
  dateTime.appendChild(day);
  dateTime.appendChild(month);
}

function digitalClock() {
  const digitalClock = document.querySelector(".digital-clock");
  let date = new Date();
  let hours = date.getHours().toString().padStart(2, "0");
  let minutes = date.getMinutes().toString().padStart(2, "0");
  let seconds = date.getSeconds().toString().padStart(2, "0");

  // Combine into a time string
  let timeString = `${hours}:${minutes}:${seconds}`;

  digitalClock.innerHTML = timeString;
}

setNumbers();
addDayMonth();
setClockHands();
digitalClock();
setInterval(setClockHands, 1000);
setInterval(digitalClock, 1000);
