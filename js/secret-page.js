// js/secret-page.js
// Handles secret memories password validation and reveals content

const correctSecret = '073101';
const passInput = document.getElementById('secret-pass');
const submitBtn = document.getElementById('secret-submit');
const feedback = document.getElementById('secret-feedback');
const passwordScreen = document.getElementById('password-screen');
const secretContent = document.getElementById('secret-content');

submitBtn.addEventListener('click', () => {
  if (passInput.value === correctSecret) {
    passwordScreen.style.display = 'none';
    secretContent.style.display = 'block';
    const secretLetter = document.getElementById('secret-letter');
    if (typeof window.secretLetterContent === 'string' && secretLetter) {
      secretLetter.textContent = window.secretLetterContent;
    } else {
      console.error('Unable to load secret letter content.');
      feedback.textContent = 'The secret letter could not be opened right now. Please try again.';
    }
  } else {
    feedback.textContent = 'Incorrect password.';
    feedback.style.color = 'crimson';
  }
});
