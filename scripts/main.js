const stopwatchElement = document.querySelector('[data-js-stopwatch]')
const stopwatchDaysElement = document.querySelector('[data-js-stopwatch-days]')
const stopwatchHoursElement = document.querySelector('[data-js-stopwatch-hours]')
const stopwatchMinutesElement = document.querySelector('[data-js-stopwatch-minutes]')
const stopwatchSecondsElement = document.querySelector('[data-js-stopwatch-seconds]')

async function findLastWin() {
  let year = new Date().getFullYear()
  let found = false;
  let lastDate;

  while (!found && year >= 1950) {
    const seasonResult = await fetch(`https://ergast.com/api/f1/${year}.json`);
    const seasonData = await seasonResult.json();
    const races = seasonData.MRData.RaceTable.Races;

    for (let i = races.length - 1; i >= 0; i--) {
      const round = races[i].round;
      const resultsRes = await fetch(`https://ergast.com/api/f1/${year}/${round}/results.json`);
      const resultsData = await resultsRes.json();
      const race = resultsData.MRData.RaceTable.Races[0];
      if (!race) continue;
      const results = race.Results || [];

      for (let r of results.slice(0, 1)) {
        if (r.Constructor.name.toLowerCase().includes('ferrari')) {
          lastDate = race.date;
          found = true;
          break;
        }
      }

      if (found) break;
    }

    year--;
  }

  return lastDate ? new Date(lastDate) : null;
}

async function getDriverStats(driverId) {
  const response = await fetch(`https://ergast.com/api/f1/drivers/${driverId}/results.json?limit=1000`);
  const data = await response.json();
  const races = data.MRData.RaceTable.Races;

  const totalRaces = races.length;
  let wins = 0;
  let podiums = 0;
  let lastWin = null;

  for (let i = races.length - 1; i >= 0; i--) {
    const result = races[i].Results[0];
    const position = parseInt(result.position);
    
    if (position === 1) {
      wins++;
      if (!lastWin) {
        lastWin = {
          raceName: races[i].raceName,
          date: races[i].date,
          location: races[i].Circuit.Location.country.toUpperCase()
        };
      }
    }

    if (position >= 1 && position <= 3) {
      podiums++;
    }
  }

  return {
    totalRaces,
    wins,
    podiums,
    lastWin
  };
}

(async () => {
  const stats = await getDriverStats('hamilton');

  document.querySelector('[data-js-statistic-races]').textContent = stats.totalRaces;
  document.querySelector('[data-js-statistic-wins]').textContent = stats.wins;
  document.querySelector('[data-js-statistic-podiums]').textContent = stats.podiums;

  if (stats.lastWin) {
    const formattedDate = new Date(stats.lastWin.date).toLocaleDateString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric'
    }).toUpperCase();

    document.querySelector('[data-js-statistic-last-win]').textContent =
      `${stats.lastWin.location} (${formattedDate})`;
  } else {
    document.querySelector('.team__card-stat-value[data-stat="last-win"]').textContent = 'Нет побед 😢';
  }
})();

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

(async () => {
  const winDate = await findLastWin();
  if (winDate) {
    updateTimer(winDate);
  } else {
    stopwatchElement.textContent = "Ferrari давно не было на подиуме 🥲";
  }
})();