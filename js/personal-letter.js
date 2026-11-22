// Unlocks the personal letter on the home section and standalone page.
const letterKeyForm = document.getElementById('letter-key-form');
const letterKeyInput = document.getElementById('letter-key');
const letterKeyFeedback = document.getElementById('letter-key-feedback');
const letterLock = document.getElementById('letter-lock');
const personalLetter = document.getElementById('letter-view') || document.getElementById('letter');
const personalLetterKey = 'Rags';

if (letterKeyForm && letterKeyInput && letterKeyFeedback && letterLock && personalLetter) {
  letterKeyForm.addEventListener('submit', (event) => {
    event.preventDefault();

    if (letterKeyInput.value.trim().toLowerCase() !== personalLetterKey.toLowerCase()) {
      letterKeyFeedback.textContent = 'That key did not open the letter. Try again';
      letterKeyFeedback.classList.add('error');
      letterKeyInput.focus();
      return;
    }

    const letterContent = personalLetter.querySelector('#letter-content');
    if (typeof window.personalLetterContent !== 'string' || !letterContent) {
      console.error('Unable to open the personal letter: letter content or display element is missing.');
      letterKeyFeedback.textContent = 'The letter could not be opened right now. Please try again.';
      letterKeyFeedback.classList.add('error');
      return;
    }

    letterContent.textContent = window.personalLetterContent;
    letterKeyFeedback.textContent = '';
    letterKeyFeedback.classList.remove('error');
    letterLock.style.display = 'none';
    personalLetter.style.display = 'block';
    personalLetter.style.animation = 'popIn 0.6s ease';
  });
}
