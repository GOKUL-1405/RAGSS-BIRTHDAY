// js/login.js
// Handles login validation, password typing animation, and transition to home page

const passwordInput = document.getElementById('password');
const loginForm = document.getElementById('login-form');
const feedback = document.getElementById('login-feedback');
const correctPassword = '2811';

// Mapping of typed digits to letters for animation
const letterMap = ['R', 'RA', 'RAG', 'RAGSSS'];
let typedCount = 0;

passwordInput.addEventListener('input', (e) => {
  const value = e.target.value;
  typedCount = value.length;
  if (typedCount > 0 && typedCount <= 4) {
    const letters = letterMap[typedCount - 1];
    feedback.textContent = letters;
    feedback.classList.remove('fade-in');
    void feedback.offsetWidth; // trigger reflow
    feedback.classList.add('fade-in');
  } else {
    feedback.textContent = '';
  }
});

loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  if (passwordInput.value === correctPassword) {
    // Play gift box opening animation (placeholder)
    document.body.classList.add('gift-open');
    // After short delay, navigate to home page
    setTimeout(() => {
      window.location.href = 'pages/home.html';
    }, 1200);
  } else {
    feedback.textContent = 'Incorrect password. Try again.';
    feedback.style.color = 'crimson';
  }
});

// Reduced motion: disable animations if prefers-reduced-motion
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.body.classList.add('reduced-motion');
}
