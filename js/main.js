/* js/main.js */
// Common utilities for the website

// Hidden butterfly 5‑tap trigger
let butterflyTapCount = 0;
const hiddenButterflyBtn = document.getElementById('hidden-butterfly');
if (hiddenButterflyBtn) {
  hiddenButterflyBtn.addEventListener('click', () => {
    butterflyTapCount++;
    if (butterflyTapCount >= 5) {
      // Reset count and navigate to secret password screen
      butterflyTapCount = 0;
      window.location.href = 'secret-memories.html';
    }
  });
}


// Helper to fetch JSON with error handling
export async function fetchJSON(path) {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`Failed to load ${path}`);
  return response.json();
}

// Simple function to add fade-in animation to an element
export function fadeIn(element) {
  element.classList.remove('fade-in');
  void element.offsetWidth; // trigger reflow
  element.classList.add('fade-in');
}

// Reduced motion check – add class to body if user prefers reduced motion
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.body.classList.add('reduced-motion');
}
