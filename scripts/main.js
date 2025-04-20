const ferrariTeam = {
  name: "Scuderia Ferrari",
  lastWin: {
    date: "2024-10-20", // Дата последней победы (формат: ГГГГ-ММ-ДД)
    race: "Australian Grand Prix",
    driver: "Charles Leclerc"
  }
};

// Элементы на странице для отображения времени
const stopwatchElement = document.querySelector('[data-js-stopwatch]');
const stopwatchDaysElement = document.querySelector('[data-js-stopwatch-days]');
const stopwatchHoursElement = document.querySelector('[data-js-stopwatch-hours]');
const stopwatchMinutesElement = document.querySelector('[data-js-stopwatch-minutes]');
const stopwatchSecondsElement = document.querySelector('[data-js-stopwatch-seconds]');

// Функция для обновления таймера
function updateTimer(fromDate) {
  setInterval(() => {
    const now = new Date();
    const diffMs = now - fromDate;

    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diffMs / (1000 * 60)) % 60);
    const seconds = Math.floor((diffMs / 1000) % 60);

    stopwatchDaysElement.textContent = `${days}`;
    stopwatchHoursElement.textContent = `${hours}`;
    stopwatchMinutesElement.textContent = `${minutes}`;
    stopwatchSecondsElement.textContent = `${seconds}`;
  }, 1000);
}

// Инициализация таймера с последней победы
(async () => {
  const winDate = new Date(ferrariTeam.lastWin.date);
  if (winDate) {
    updateTimer(winDate);
  } else {
    stopwatchElement.textContent = "Ferrari давно не было на подиуме 🥲";
  }
})();