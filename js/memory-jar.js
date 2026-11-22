/* js/memory-jar.js */
// Handles the Memory Jar interaction – picks a unique memory each time
import { fetchJSON } from './main.js';
import { registerMemory, getUnusedMemories } from './memory-registry.js';

const pickBtn = document.getElementById('pick-memory');
const displayDiv = document.getElementById('memory-display');
const memoryCard = document.getElementById('memory-card');
const jarCompleteMsg = document.getElementById('jar-complete');
let allMemories = [];

async function initJar() {
  allMemories = await fetchJSON('../data/memory-jar.json');
  pickBtn.addEventListener('click', () => {
    const unused = getUnusedMemories(allMemories.memories);
    if (unused.length === 0) {
      // All memories shown – reset
      jarCompleteMsg.style.display = 'block';
      pickBtn.disabled = true;
      return;
    }
    const randomIdx = Math.floor(Math.random() * unused.length);
    const mem = unused[randomIdx];
    registerMemory(mem.id);
    // Render memory card
    memoryCard.innerHTML = `
      <img src="../assets/images/gallery/${mem.image || 'placeholder.png'}" alt="${mem.title}" loading="lazy" style="width:100%;" />
      <p class="mt-1"><strong>${mem.title}</strong></p>
      <p class="mb-1">${mem.date}</p>
      <p>${mem.caption}</p>
    `;
    displayDiv.style.display = 'block';
    memoryCard.classList.add('pop-in');
  });
}

if (pickBtn) initJar();
