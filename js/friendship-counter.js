/* js/friendship-counter.js */
// Calculates the elapsed time since the friendship start date and updates the UI

const startDate = new Date('2026-05-07T07:30:00'); // May 7, 2026 7:30 AM
const counterEl = document.getElementById('friendship-counter');

function updateCounter() {
  const now = new Date();
  const diff = now - startDate;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  counterEl.textContent = `Every Second Since You… ${days}d ${hours}h ${minutes}m ${seconds}s`;
}

if (counterEl) {
  updateCounter();
  setInterval(updateCounter, 1000);
}
