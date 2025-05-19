
function updateTime() {
  const cities = {
    KOREA: 'Asia/Seoul',
    LA: 'America/Los_Angeles',
    NEWYORK: 'America/New_York',
    DUBAI: 'Asia/Dubai',
    HAMBURG: 'Europe/Berlin',
    SINGPORE: 'Asia/Singapore'
  };

  for (const id in cities) {
    const now = new Date().toLocaleTimeString('en-US', {
      timeZone: cities[id],
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    const el = document.getElementById(id);
    if (el) el.textContent = now;
  }

  setTimeout(updateTime, 1000);
}

document.addEventListener('DOMContentLoaded', updateTime);
