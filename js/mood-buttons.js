/* js/mood-buttons.js */
// Handles Mood Buttons interactions, shows unique messages per button
import { fetchJSON } from './main.js';
import { isMemoryUsed, registerMemory } from './memory-registry.js';

const moodBtnContainer = document.getElementById('mood-buttons');
const messageDiv = document.getElementById('mood-message');

async function initMoodButtons() {
  const data = await fetchJSON('../data/mood-messages.json');
  const messages = data.messages; // array of {mood, id, text}
  moodBtnContainer.addEventListener('click', (e) => {
    if (e.target.tagName !== 'BUTTON') return;
    const mood = e.target.dataset.mood;
    const msgObj = messages.find(m => m.mood === mood && !isMemoryUsed(m.id));
    if (msgObj) {
      registerMemory(msgObj.id);
      messageDiv.textContent = msgObj.text;
      messageDiv.classList.add('pop-in');
    } else {
      // fallback generic supportive message
      messageDiv.textContent = "You are amazing, Ragsss! Keep shining.";
    }
  });
}

if (moodBtnContainer) initMoodButtons();
