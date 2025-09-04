// Simple Stopwatch Logic - Mins & Secs, Start, Pause, Reset, Lap
let timerInterval = null;
let elapsedMs = 0;
let running = false;
let laps = [];

const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const lapBtn = document.getElementById('lapBtn');
const lapsList = document.getElementById('lapsList');

function updateDisplay(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;

  minutesEl.textContent = mins.toString().padStart(2, '0');
  secondsEl.textContent = secs.toString().padStart(2, '0');
}

function startTimer() {
  if (!running) {
    running = true;
    startBtn.disabled = true;
    pauseBtn.disabled = false;
    lapBtn.disabled = false;
    resetBtn.disabled = false;
    let last = Date.now();
    timerInterval = setInterval(() => {
      const now = Date.now();
      elapsedMs += now - last;
      last = now;
      updateDisplay(elapsedMs);
    }, 150); // update ~6 times/sec (for button reactivity)
  }
}

function pauseTimer() {
  if (running) {
    running = false;
    clearInterval(timerInterval);
    timerInterval = null;
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    lapBtn.disabled = true;
  }
}

function resetTimer() {
  running = false;
  clearInterval(timerInterval);
  timerInterval = null;
  elapsedMs = 0;
  updateDisplay(0);
  laps = [];
  renderLaps();
  startBtn.disabled = false;
  pauseBtn.disabled = true;
  lapBtn.disabled = true;
  resetBtn.disabled = true;
}

function addLap() {
  if (elapsedMs > 0) {
    laps.push(elapsedMs);
    renderLaps();
  }
}

function renderLaps() {
  lapsList.innerHTML = '';
  laps.forEach((lapMs, idx) => {
    const ls = document.createElement('li');
    const totalSeconds = Math.floor(lapMs / 1000);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    ls.textContent = `Lap ${idx + 1}: ${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
    lapsList.appendChild(ls);
  });
}

// Event listeners
startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);
lapBtn.addEventListener('click', addLap);

// Accessibility: Keyboard shortcuts
startBtn.accessKey = 's';  // Start
document.addEventListener('keydown', (e) => {
  if (e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT') return;
  if (e.key === 's' || e.key === 'S') startTimer();
  if (e.key === 'p' || e.key === 'P') pauseTimer();
  if (e.key === 'r' || e.key === 'R') resetTimer();
  if (e.key === 'l' || e.key === 'L') addLap();
});

// Initial state:
updateDisplay(0);
startBtn.disabled = false;
pauseBtn.disabled = true;
lapBtn.disabled = true;
resetBtn.disabled = true;
