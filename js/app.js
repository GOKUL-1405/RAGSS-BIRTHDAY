/* ═══════════════════════════════════════════════════════════════
   Ragsss's Little World — Master Application Script
   Complete, offline-ready logic for Ragsss's Enchanted Birthday
   ═══════════════════════════════════════════════════════════════ */

// ─── 0. Gentle Web Audio Sound Engine ───
function playTone(freq, type = 'sine', duration = 0.15, gainVol = 0.035) {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(gainVol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (err) {}
}

function playSparkleChime() {
  [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
    setTimeout(() => playTone(freq, 'triangle', 0.4, 0.045), i * 75);
  });
}

// ─── 1. Navigation System ───
const sidebar = document.getElementById('sidebar');
const navToggle = document.getElementById('nav-toggle');
const overlay = document.getElementById('overlay');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section');

function navigateTo(sectionId) {
  if (!sectionId) return;
  playTone(520, 'sine', 0.1, 0.02);
  
  // Hide all sections, remove active classes
  sections.forEach(s => s.classList.remove('active'));
  navLinks.forEach(l => l.classList.remove('active'));
  
  // Check if target is a sub-anchor (like birthday-video-section or diamond-mosaic-banner)
  const target = document.getElementById(sectionId);
  let parentSec = null;
  if (target) {
    if (target.classList.contains('section')) {
      parentSec = target;
    } else {
      parentSec = target.closest('.section') || document.getElementById('home');
    }
  } else {
    parentSec = document.getElementById('home');
  }

  if (parentSec) {
    parentSec.classList.remove('active');
    void parentSec.offsetWidth; // Trigger reflow for animation
    parentSec.classList.add('active');
  }

  // Update active navigation link
  const activeId = parentSec ? parentSec.id : sectionId;
  const activeLink = document.querySelector(`[data-section="${activeId}"]`);
  if (activeLink) activeLink.classList.add('active');

  // Close mobile navigation drawer
  if (sidebar) sidebar.classList.remove('open');
  if (overlay) overlay.classList.remove('show');
  if (navToggle) {
    navToggle.setAttribute('aria-expanded', 'false');
  }

  // Smooth scroll to target element or top of page
  if (target && target !== parentSec) {
    setTimeout(() => {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 120);
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

window.navigateTo = navigateTo;

navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const sectionId = link.dataset.section;
    navigateTo(sectionId);
    if (history.pushState) {
      history.pushState(null, null, '#' + sectionId);
    }
  });
});

if (navToggle) {
  navToggle.addEventListener('click', () => {
    const isOpen = sidebar.classList.toggle('open');
    if (overlay) overlay.classList.toggle('show', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
}

if (overlay) {
  overlay.addEventListener('click', () => {
    if (sidebar) sidebar.classList.remove('open');
    overlay.classList.remove('show');
    if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
  });
}

// ─── 2. Floating Petals Animation ───
(function createFloatingPetals() {
  const container = document.getElementById('petals-container');
  if (!container) return;

  const colors = ['#f7d2e0', '#e27396', '#d8c7ff', '#f3c98b', '#ffd8be', '#ffdbe6'];
  const petalCount = 18;

  for (let i = 0; i < petalCount; i++) {
    const petal = document.createElement('div');
    petal.className = 'petal';
    const size = 10 + Math.random() * 16;
    petal.style.width = size + 'px';
    petal.style.height = (size * 1.35) + 'px';
    petal.style.left = (Math.random() * 100) + 'vw';
    petal.style.background = colors[Math.floor(Math.random() * colors.length)];
    petal.style.animationDuration = (8 + Math.random() * 10) + 's';
    petal.style.animationDelay = (Math.random() * 10) + 's';
    petal.style.opacity = 0.25 + Math.random() * 0.45;
    container.appendChild(petal);
  }
})();

// ─── 2.5 Generate Floating Stardust ───
(function createFloatingStardust() {
  const container = document.getElementById('stardust-container');
  if (!container) return;
  for (let i = 0; i < 26; i++) {
    const star = document.createElement('div');
    star.className = 'stardust-particle';
    star.style.left = Math.random() * 100 + 'vw';
    star.style.top = Math.random() * 100 + 'vh';
    star.style.animationDuration = (5 + Math.random() * 6) + 's';
    star.style.animationDelay = (Math.random() * 5) + 's';
    container.appendChild(star);
  }
})();

// ─── 3. Live Friendship Counter ───
// Base Date: May 7, 2026, 7:30 AM
const friendshipStartDate = new Date('2026-05-07T07:30:00');

function updateFriendshipCounter() {
  const now = new Date();
  const diff = now - friendshipStartDate;

  const dEl = document.getElementById('counter-days');
  const hEl = document.getElementById('counter-hours');
  const mEl = document.getElementById('counter-mins');
  const sEl = document.getElementById('counter-secs');

  if (diff < 0) {
    if (dEl) dEl.textContent = '0';
    if (hEl) hEl.textContent = '0';
    if (mEl) mEl.textContent = '0';
    if (sEl) sEl.textContent = '0';
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  if (dEl) dEl.textContent = days;
  if (hEl) hEl.textContent = hours;
  if (mEl) mEl.textContent = minutes;
  if (sEl) sEl.textContent = seconds;
}

updateFriendshipCounter();
setInterval(updateFriendshipCounter, 1000);

// ─── 4. Confetti & Celebration Fireworks ───
const confettiContainer = document.getElementById('confetti-container');

function launchCelebration() {
  if (!confettiContainer) return;
  const colors = ['#f7d2e0', '#e27396', '#d8c7ff', '#f3c98b', '#ffd8be', '#ffb5a7', '#fff', '#ffd166'];
  const count = 90;

  for (let i = 0; i < count; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.left = Math.random() * 100 + 'vw';
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDuration = (2.2 + Math.random() * 3) + 's';
    piece.style.animationDelay = (Math.random() * 1.5) + 's';
    const size = 7 + Math.random() * 9;
    piece.style.width = size + 'px';
    piece.style.height = (Math.random() > 0.5 ? size : size * 1.6) + 'px';
    piece.style.borderRadius = Math.random() > 0.4 ? '50%' : '3px';
    confettiContainer.appendChild(piece);
  }

  setTimeout(() => {
    confettiContainer.innerHTML = '';
  }, 6000);
}

window.launchCelebration = launchCelebration;

const cakeCelebrateBtn = document.getElementById('cake-celebrate');
const cakeActionBlow = document.getElementById('cake-action-blow');
const cakeHintText = document.getElementById('cake-hint-text');
const cakeSvg = document.querySelector('.grand-birthday-cake');

function toggleCakeCandles() {
  if (!cakeSvg) {
    launchCelebration();
    return;
  }
  const isBlown = cakeSvg.classList.toggle('candles-blown');
  if (isBlown) {
    launchCelebration();
    if (cakeActionBlow) cakeActionBlow.innerHTML = '<span>Relight Candles</span>';
    if (cakeHintText) cakeHintText.textContent = 'Wish made! May all your sweetest dreams come true, Ragsss!';
  } else {
    if (cakeActionBlow) cakeActionBlow.innerHTML = '<span>Blow Candles</span>';
    if (cakeHintText) cakeHintText.textContent = 'Candles glowing bright again! Tap cake or blow to make a wish';
  }
}

if (cakeActionBlow) {
  cakeActionBlow.addEventListener('click', toggleCakeCandles);
}

if (cakeCelebrateBtn) {
  cakeCelebrateBtn.addEventListener('click', toggleCakeCandles);
}

const finaleConfettiBtn = document.getElementById('confetti-btn');
if (finaleConfettiBtn) {
  finaleConfettiBtn.addEventListener('click', launchCelebration);
}

const birthdayWishCta = document.getElementById('birthday-wish-cta');
if (birthdayWishCta) {
  birthdayWishCta.addEventListener('click', () => {
    navigateTo('birthday-wish');
    launchCelebration();
  });
}

// ─── 5. Populate Birthday Wish Letter ───
(function initBirthdayWish() {
  const wishEl = document.getElementById('wish-content');
  if (wishEl && typeof window.birthdayWishContent === 'string') {
    wishEl.textContent = window.birthdayWishContent;
  }
})();

// ─── 6. Personal Letter Wax Seal Unlock ───
const letterKeyForm = document.getElementById('letter-key-form');
const letterKeyInput = document.getElementById('letter-key');
const letterKeyFeedback = document.getElementById('letter-key-feedback');
const letterLock = document.getElementById('letter-lock');
const letterView = document.getElementById('letter-view');
const letterContent = document.getElementById('letter-content');

if (letterKeyForm && letterKeyInput) {
  letterKeyForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const entered = letterKeyInput.value.trim().toLowerCase();

    if (entered === 'rags') {
      if (letterContent && typeof window.personalLetterContent === 'string') {
        letterContent.textContent = window.personalLetterContent;
      }
      letterLock.style.display = 'none';
      letterView.style.display = 'block';
      launchCelebration();
      window.scrollTo({ top: letterView.offsetTop - 40, behavior: 'smooth' });
    } else {
      letterKeyFeedback.textContent = 'That key didn\'t break the seal. Try "Rags"';
      letterKeyFeedback.className = 'envelope-feedback error';
      letterKeyInput.value = '';
      letterKeyInput.focus();
    }
  });
}

// ─── 7. Render Memories Polaroid Wall & Detailed Modal ───
let currentMemoryIndex = 0;

function openMemoryModal(idx) {
  const modal = document.getElementById('memory-modal');
  const memoriesData = window.memoryJarData ? window.memoryJarData.memories : [];
  if (!modal || !memoriesData.length) return;

  currentMemoryIndex = (idx + memoriesData.length) % memoriesData.length;
  const mem = memoriesData[currentMemoryIndex];

  const visualEl = document.getElementById('memory-modal-visual');
  const pillEl = document.getElementById('memory-modal-pill');
  const dateEl = document.getElementById('memory-modal-date');
  const titleEl = document.getElementById('memory-modal-title');
  const captionEl = document.getElementById('memory-modal-caption');
  const quoteEl = document.getElementById('memory-modal-quote');
  const quoteWrap = document.getElementById('memory-modal-quote-wrap');
  const counterEl = document.getElementById('memory-modal-counter');

  if (visualEl) {
    visualEl.style.background = mem.gradient || 'linear-gradient(135deg, #fff3e0, #fce4ec)';
    visualEl.innerHTML = mem.conceptSvg || '';
  }
  if (pillEl) pillEl.textContent = `✦ MEMORY #${mem.icon || '01'} · ${mem.tag || 'MOMENT'} ✦`;
  if (dateEl) dateEl.textContent = mem.date || '';
  if (titleEl) titleEl.textContent = mem.title || '';
  if (captionEl) captionEl.textContent = mem.caption || '';
  if (quoteEl && quoteWrap) {
    if (mem.quote) {
      quoteEl.textContent = `"${mem.quote}"`;
      quoteWrap.style.display = 'block';
    } else {
      quoteWrap.style.display = 'none';
    }
  }
  if (counterEl) counterEl.textContent = `Memory ${currentMemoryIndex + 1} of ${memoriesData.length}`;

  modal.removeAttribute('hidden');
  modal.style.display = 'flex';
  modal.classList.add('show');
  playTone(580, 'sine', 0.12, 0.03);
}

function closeMemoryModal() {
  const modal = document.getElementById('memory-modal');
  if (modal) {
    modal.classList.remove('show');
    modal.setAttribute('hidden', '');
    modal.style.display = 'none';
  }
}

(function renderMemories() {
  const grid = document.getElementById('memories-grid');
  if (!grid) return;

  const memoriesData = window.memoryJarData ? window.memoryJarData.memories : [];
  if (!memoriesData.length) return;

  grid.innerHTML = '';
  memoriesData.forEach((mem, idx) => {
    const card = document.createElement('article');
    card.className = 'memory-polaroid-card';
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', `View memory: ${mem.title}`);
    card.innerHTML = `
      <div class="polaroid-washi-tape" aria-hidden="true"></div>
      <div class="polaroid-concept-frame" style="background: ${mem.gradient || 'linear-gradient(135deg, #fff3e0, #fce4ec)'};">
        ${mem.conceptSvg}
      </div>
      <div class="polaroid-caption-area">
        <div class="polaroid-meta-row">
          <span class="polaroid-tag-chip">${mem.tag || 'Memory'}</span>
          <span class="polaroid-date-text">${mem.date}</span>
        </div>
        <div class="polaroid-num-badge">✦ MEMORY #${mem.icon || '01'} ✦</div>
        <h3 class="polaroid-card-title">${mem.title}</h3>
        <p class="polaroid-card-desc">${mem.caption}</p>
        ${mem.quote ? `<p class="polaroid-card-quote">"${mem.quote}"</p>` : ''}
        <div class="polaroid-tap-hint">
          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
          <span>Tap for full memory view</span>
        </div>
      </div>
    `;

    card.addEventListener('click', () => {
      openMemoryModal(idx);
    });

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openMemoryModal(idx);
      }
    });

    grid.appendChild(card);
  });

  const closeBtn = document.getElementById('memory-modal-close');
  const backdrop = document.getElementById('memory-modal-backdrop');
  const prevBtn = document.getElementById('memory-modal-prev');
  const nextBtn = document.getElementById('memory-modal-next');

  if (closeBtn) closeBtn.addEventListener('click', closeMemoryModal);
  if (backdrop) backdrop.addEventListener('click', closeMemoryModal);
  if (prevBtn) prevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    openMemoryModal(currentMemoryIndex - 1);
  });
  if (nextBtn) nextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    openMemoryModal(currentMemoryIndex + 1);
  });
})();

// ─── 8. Render Journey Timeline ───
(function renderTimeline() {
  const timelineEl = document.getElementById('timeline');
  if (!timelineEl || !Array.isArray(window.journeyStages)) return;

  timelineEl.innerHTML = '';
  window.journeyStages.forEach((stage, idx) => {
    const row = document.createElement('div');
    row.className = 'timeline-stage-row';
    row.innerHTML = `
      <div class="timeline-node-pin" aria-hidden="true">${stage.icon || ('0' + (idx + 1))}</div>
      <div class="timeline-card-col">
        <div class="timeline-stage-card">
          <span class="stage-badge-pill">Step 0${idx + 1}</span>
          <h3 class="stage-card-title">${stage.label}</h3>
          <p class="stage-period-text">${stage.period || ''}</p>
          <p class="stage-card-desc">${stage.desc || ''}</p>
        </div>
      </div>
    `;
    timelineEl.appendChild(row);
  });
})();

// ─── 9. Mood Magic ───
const moodResponses = {
  happy: {
    title: "Radiant Joy",
    text: "Your happiness makes my entire day brighter, en Ragsss! Seeing you smile is genuinely my favorite feeling in the world. Keep shining and laughing always!"
  },
  sad: {
    title: "Gentle Comfort",
    text: "Hey, it is completely okay to feel down sometimes. Please remember I am always here for you, no matter what. Sending you the warmest, biggest comfort right now. You are never alone."
  },
  miss: {
    title: "Always Close",
    text: "I miss you too, more than words could ever explain. Distance and busy days mean nothing when someone means everything to you — and you mean everything to me."
  },
  smile: {
    title: "Golden Smile",
    text: "A sweet reminder: Your smile can light up an entire room. You are officially the sweetest, kindest, and most wonderful person in the universe."
  },
  overthinking: {
    title: "Peace of Mind",
    text: "Take a deep breath, Ragsss. Inhale peace, exhale worries. You are strong, capable, deeply cared for, and everything is going to work out beautifully. Trust yourself."
  },
  moody: {
    title: "Sweet Remedy",
    text: "Uh oh, someone is in moody mode! Here is a huge virtual box of KitKats, your favorite fresh juice, and infinite patience from Gokul. Feeling lighter now?"
  }
};

document.querySelectorAll('.mood-pill-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const mood = btn.dataset.mood;
    const data = moodResponses[mood];
    const msgEl = document.getElementById('mood-message');
    if (!data || !msgEl) return;

    msgEl.style.animation = 'none';
    void msgEl.offsetHeight; // reflow
    msgEl.style.animation = 'popIn 0.4s ease';

    msgEl.innerHTML = `
      <span class="mood-bubble-text"><strong>${data.title}:</strong> ${data.text}</span>
    `;
    playTone(660, 'triangle', 0.15, 0.03);
  });
});

// ─── 10. Memory Jar ───
let availableJarMemories = [];
const usedJarMemoryIds = new Set();
const pickJarBtn = document.getElementById('pick-memory');
const jarDisplay = document.getElementById('memory-display');
const jarCompleteMsg = document.getElementById('jar-complete');
const glassJarElement = document.getElementById('glass-jar-element');

(function initJarData() {
  if (window.memoryJarData && Array.isArray(window.memoryJarData.memories)) {
    availableJarMemories = [...window.memoryJarData.memories];
  }
})();

if (pickJarBtn) {
  pickJarBtn.addEventListener('click', () => {
    if (glassJarElement) {
      glassJarElement.classList.remove('shake');
      void glassJarElement.offsetWidth;
      glassJarElement.classList.add('shake');
    }

    const unpicked = availableJarMemories.filter(m => !usedJarMemoryIds.has(m.id));

    if (unpicked.length === 0) {
      if (jarCompleteMsg) jarCompleteMsg.style.display = 'block';
      pickJarBtn.innerHTML = '<span>All Memories Picked! (Click to Restart)</span>';
      usedJarMemoryIds.clear();
      return;
    }

    if (jarCompleteMsg) jarCompleteMsg.style.display = 'none';

    const chosen = unpicked[Math.floor(Math.random() * unpicked.length)];
    usedJarMemoryIds.add(chosen.id);

    setTimeout(() => {
      if (jarDisplay) {
        jarDisplay.innerHTML = `
          <div class="revealed-parchment-note">
            <span class="revealed-note-star" aria-hidden="true" style="display:block;margin-bottom:0.5rem;">
              <svg viewBox="0 0 24 24" width="26" height="26" fill="#f3c98b">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
            </span>
            <div class="mem-date">${chosen.date} · ${chosen.tag || 'Cherished Memory'}</div>
            <div class="jar-concept-preview" style="max-width: 280px; height: 160px; margin: 0.8rem auto; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.12);">
              ${chosen.conceptSvg || ''}
            </div>
            <h3>${chosen.title}</h3>
            <p>${chosen.caption}</p>
            ${chosen.quote ? `<p class="polaroid-card-quote" style="margin-top:0.8rem;text-align:left;">"${chosen.quote}"</p>` : ''}
          </div>
        `;
      }
    }, 300);
  });
}

// ─── 11. Render Photo Gallery ───
(function renderGallery() {
  const grid = document.getElementById('gallery-grid');
  if (!grid || !window.galleryData) return;

  const faceMap = {
    "WhatsApp Image 2026-11-22 at 9.43.49 AM (1).jpeg": "21% 21%",
    "WhatsApp Image 2026-11-22 at 9.43.49 AM.jpeg": "38% 44%",
    "WhatsApp Image 2026-11-22 at 9.43.50 AM (1).jpeg": "64% 25%",
    "WhatsApp Image 2026-11-22 at 9.43.50 AM (2).jpeg": "55% 24%",
    "WhatsApp Image 2026-11-22 at 9.43.50 AM.jpeg": "46% 41%",
    "WhatsApp Image 2026-11-22 at 9.43.51 AM (1).jpeg": "59% 57%",
    "WhatsApp Image 2026-11-22 at 9.43.51 AM.jpeg": "64% 39%",
    "WhatsApp Image 2026-11-22 at 9.43.54 AM.jpeg": "45% 42%",
    "WhatsApp Image 2026-11-22 at 9.43.55 AM (1).jpeg": "41% 53%",
    "WhatsApp Image 2026-11-22 at 9.43.55 AM (2).jpeg": "27% 19%",
    "WhatsApp Image 2026-11-22 at 9.43.55 AM.jpeg": "61% 56%",
    "WhatsApp Image 2026-11-22 at 9.43.56 AM.jpeg": "45% 24%",
    "WhatsApp Image 2026-11-22 at 9.43.57 AM (1).jpeg": "32% 25%",
    "WhatsApp Image 2026-11-22 at 9.43.57 AM (2).jpeg": "51% 44%",
    "WhatsApp Image 2026-11-22 at 9.43.57 AM.jpeg": "54% 40%",
    "WhatsApp Image 2026-11-22 at 9.43.58 AM (1).jpeg": "50% 34%",
    "WhatsApp Image 2026-11-22 at 9.43.58 AM.jpeg": "63% 44%",
    "WhatsApp Image 2026-11-22 at 9.43.59 AM (1).jpeg": "23% 31%",
    "WhatsApp Image 2026-11-22 at 9.43.59 AM (2).jpeg": "45% 27%",
    "WhatsApp Image 2026-11-22 at 9.43.59 AM.jpeg": "29% 29%",
    "WhatsApp Image 2026-11-22 at 9.44.00 AM (1).jpeg": "49% 53%",
    "WhatsApp Image 2026-11-22 at 9.44.00 AM.jpeg": "50% 49%",
    "WhatsApp Image 2026-11-22 at 9.44.01 AM (1).jpeg": "47% 24%"
  };

  grid.innerHTML = '';
  window.galleryData.photos.forEach((photo, idx) => {
    const card = document.createElement('div');
    card.className = 'gallery-card-item';
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', `View photo: ${photo.title}`);

    const safeUrl = `../assets/images/gallery/${encodeURIComponent(photo.filename)}`;
    const objPos = faceMap[photo.filename] || 'center 22%';

    card.innerHTML = `
      <div class="gallery-card-photo-wrap">
        <span class="gallery-badge">${photo.category || 'Memory'}</span>
        <img class="gallery-card-img" src="${safeUrl}" alt="${photo.title || 'Ragsss'}" style="object-position: ${objPos};" loading="lazy" decoding="async" />
        <div class="gallery-card-hover-overlay">
          <span class="gallery-zoom-button">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
            Click for Full View
          </span>
        </div>
      </div>
      <div class="gallery-card-info">
        <div>
          <h4 class="gallery-card-title">${photo.title || 'Special Memory'}</h4>
          <p class="gallery-card-caption">${photo.caption || ''}</p>
        </div>
        <div class="gallery-card-hint-row">
          <span class="gallery-card-click-hint">
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
            Click to view full image
          </span>
          <span class="gallery-card-heart">♡</span>
        </div>
      </div>
    `;

    card.addEventListener('click', () => {
      openLightbox(idx);
    });

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(idx);
      }
    });

    grid.appendChild(card);
  });
})();

// Lightbox with Prev / Next full navigation
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption');
const lightboxCounter = document.getElementById('lightbox-counter');
const lightboxClose = document.getElementById('lightbox-close');
const lightboxPrev = document.getElementById('lightbox-prev');
const lightboxNext = document.getElementById('lightbox-next');

let currentLightboxIndex = 0;

function openLightbox(photoOrIndex) {
  if (!lightbox || !window.galleryData || !window.galleryData.photos) return;
  const photos = window.galleryData.photos;
  let idx = 0;
  if (typeof photoOrIndex === 'number') {
    idx = photoOrIndex;
  } else {
    idx = photos.findIndex(p => p.filename === photoOrIndex.filename || p.id === photoOrIndex.id);
    if (idx === -1) idx = 0;
  }
  currentLightboxIndex = (idx + photos.length) % photos.length;
  const photo = photos[currentLightboxIndex];

  if (lightboxImg) {
    lightboxImg.src = `../assets/images/gallery/${encodeURIComponent(photo.filename)}`;
    lightboxImg.alt = photo.title || 'Enlarged photo';
  }
  if (lightboxCaption) {
    lightboxCaption.textContent = photo.title ? `${photo.title} — ${photo.caption}` : (photo.caption || '');
  }
  if (lightboxCounter) {
    lightboxCounter.textContent = `Photo ${currentLightboxIndex + 1} of ${photos.length}`;
  }
  lightbox.classList.add('show');
}

function closeLightbox() {
  if (lightbox) lightbox.classList.remove('show');
}

if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
if (lightboxPrev) {
  lightboxPrev.addEventListener('click', (e) => {
    e.stopPropagation();
    openLightbox(currentLightboxIndex - 1);
  });
}
if (lightboxNext) {
  lightboxNext.addEventListener('click', (e) => {
    e.stopPropagation();
    openLightbox(currentLightboxIndex + 1);
  });
}
if (lightbox) {
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.classList.contains('lightbox-content')) closeLightbox();
  });
}
document.addEventListener('keydown', (e) => {
  if (!lightbox || !lightbox.classList.contains('show')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') openLightbox(currentLightboxIndex - 1);
  if (e.key === 'ArrowRight') openLightbox(currentLightboxIndex + 1);
});

// ─── Diamond Mosaic Lightbox Integration ───
(function initDiamondMosaic() {
  const items = document.querySelectorAll('.mosaic-diamond-item');
  if (!items.length || !window.galleryData) return;

  items.forEach(item => {
    const idx = parseInt(item.getAttribute('data-photo-idx'), 10);
    const photo = window.galleryData.photos[idx % window.galleryData.photos.length];
    if (!photo) return;

    item.setAttribute('role', 'button');
    item.setAttribute('tabindex', '0');
    item.setAttribute('aria-label', `View ${photo.title || 'photo'}`);

    item.addEventListener('click', () => {
      openLightbox(idx);
    });

    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(idx);
      }
    });
  });
})();

// ─── 12. Virtual Gifts Unwrap ───
const virtualGifts = [
  {
    title: 'A Thousand Roses',
    msg: 'A garden of 1,000 fragrant roses that will never wilt — representing the beauty, grace, and kindness you bring into my life every day.'
  },
  {
    title: 'Warm Teddy Hug',
    msg: 'A giant, super soft hug for the days you feel tired or need comfort. You always deserve unconditional care and happiness.'
  },
  {
    title: 'A Star Named "Ragsss"',
    msg: 'Registered a star in the night sky named Ragsss. Whenever you look up at night, remember you are the brightest light in my world.'
  },
  {
    title: 'Endless Box of KitKats',
    msg: 'An infinite supply of your favorite KitKats! Remembering August 7 when you gave me that sweet KitKat — the sweetest moment ever.'
  },
  {
    title: 'Friendship Promise',
    msg: 'A sacred lifelong promise: Whatever season of life comes, in your triumphs and in your worries, Gokul will always be right here in your corner.'
  },
  {
    title: 'Our Eternal Melody',
    msg: 'A timeless song dedicated to you — may your life always be filled with sweet music, peaceful nights, and boundless joy.'
  }
];

(function renderVirtualGifts() {
  const grid = document.getElementById('gifts-grid');
  if (!grid) return;

  grid.innerHTML = '';
  virtualGifts.forEach(gift => {
    const box = document.createElement('div');
    box.className = 'gift-unwrap-box';
    box.innerHTML = `
      <div class="gift-box-icon">
        <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" stroke-width="1.8">
          <polyline points="20 12 20 22 4 22 4 12"/>
          <rect x="2" y="7" width="20" height="5"/>
          <line x1="12" y1="22" x2="12" y2="7"/>
          <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/>
          <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
        </svg>
      </div>
      <h3 class="gift-box-title">${gift.title}</h3>
      <span class="gift-tap-hint">Tap to unwrap</span>
      <div class="gift-unwrapped-message">${gift.msg}</div>
    `;

    box.addEventListener('click', () => {
      const opened = box.classList.toggle('opened');
      if (opened) {
        launchCelebration();
        playTone(660, 'triangle', 0.2, 0.04);
      }
    });

    grid.appendChild(box);
  });
})();

// ─── 13. Music Player & Background Audio Sync ───
const bgMusic = document.getElementById('background-music');
const bgMusicToggle = document.getElementById('background-music-toggle');
const mobileMusicToggle = document.getElementById('mobile-music-toggle');
const sidebarMusicPlayToggle = document.getElementById('sidebar-play-toggle');
const sidebarMusicDisc = document.getElementById('sidebar-music-disc');
const sidebarMusicStatus = document.getElementById('sidebar-music-status');
const playerVinyl = document.getElementById('player-vinyl');
const audioEqualizer = document.getElementById('audio-equalizer');
const playerPlayBtn = document.getElementById('play-btn');
const progressFill = document.getElementById('progress-fill');
const currentTimeEl = document.getElementById('current-time');
const totalDurationEl = document.getElementById('total-duration');
const musicStatusEl = document.getElementById('music-status');

// Candidate audio paths for robust loading across directories & servers
const audioSourceCandidates = [
  '../assets/audio/Azhiyaadha_Oviyam.mp3',
  '../assets/audio/En_Ragsss_Song.mp3',
  '../assets/audio/special_song.mp3',
  '../assets/audio/ragsss_song.mp3',
  'assets/audio/Azhiyaadha_Oviyam.mp3',
  'assets/audio/En_Ragsss_Song.mp3'
];
let currentCandidateIdx = 0;
let isAudioBusy = false;

function formatAudioTime(seconds) {
  if (isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

function updateMusicInlineStatus(text, isPlaying = false) {
  if (!musicStatusEl) return;
  const textSpan = musicStatusEl.querySelector('.music-status-text');
  if (textSpan) {
    textSpan.textContent = text;
  } else {
    musicStatusEl.textContent = text;
  }
  musicStatusEl.classList.toggle('playing', isPlaying);
}

function syncMusicUI(isPlaying) {
  // SVG Play and Pause icons (100% linear SVG, zero emojis)
  const playSvg = '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><polygon points="6 4 20 12 6 20 6 4"/></svg>';
  const pauseSvg = '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>';

  // Hero button
  if (bgMusicToggle) {
    bgMusicToggle.setAttribute('aria-pressed', String(isPlaying));
    const btnIcon = document.getElementById('music-btn-icon');
    const btnText = document.getElementById('music-btn-text');
    if (btnIcon) btnIcon.innerHTML = isPlaying ? pauseSvg : playSvg;
    if (btnText) btnText.textContent = isPlaying ? 'Pause Song' : 'Play Song';
  }

  // Hero inline status pill
  if (isPlaying) {
    updateMusicInlineStatus('Now playing: En Ragsss · Azhiyaadha Oviyam ♫', true);
  } else {
    updateMusicInlineStatus('Music paused · Tap to continue playing', false);
  }

  // Sidebar mini widget
  const sidebarMusicCard = document.getElementById('sidebar-music-card');
  if (sidebarMusicCard) {
    sidebarMusicCard.classList.toggle('playing', isPlaying);
  }
  if (sidebarMusicPlayToggle) {
    sidebarMusicPlayToggle.innerHTML = isPlaying ? pauseSvg : playSvg;
  }
  if (sidebarMusicDisc) {
    sidebarMusicDisc.classList.toggle('playing', isPlaying);
  }
  if (sidebarMusicStatus) {
    sidebarMusicStatus.textContent = isPlaying ? 'Now playing for Ragsss' : 'Tap to play music';
  }

  // Mobile topbar button
  if (mobileMusicToggle) {
    mobileMusicToggle.innerHTML = isPlaying ? pauseSvg : playSvg;
  }

  // Dedicated Music Section Player
  if (playerPlayBtn) {
    playerPlayBtn.innerHTML = isPlaying ? pauseSvg : playSvg;
  }
  if (playerVinyl) {
    playerVinyl.classList.toggle('spinning', isPlaying);
  }
  if (audioEqualizer) {
    audioEqualizer.classList.toggle('active', isPlaying);
  }
}

async function playAudioSafe() {
  if (!bgMusic || isAudioBusy) return;
  if (!bgMusic.paused) {
    syncMusicUI(true);
    return;
  }

  isAudioBusy = true;
  try {
    // Explicitly un-mute and set volume to 100%
    bgMusic.muted = false;
    bgMusic.volume = 1.0;

    // If no source is attached yet, assign the primary candidate
    if (!bgMusic.src && (!bgMusic.currentSrc || bgMusic.currentSrc === '')) {
      bgMusic.src = audioSourceCandidates[currentCandidateIdx];
      bgMusic.load();
    }

    await bgMusic.play();
    try { sessionStorage.setItem('musicPlaying', 'true'); } catch (e) {}
    syncMusicUI(true);
  } catch (err) {
    console.warn('Audio play request issue, attempting fallback source:', err);
    if (currentCandidateIdx < audioSourceCandidates.length - 1) {
      currentCandidateIdx++;
      try {
        bgMusic.src = audioSourceCandidates[currentCandidateIdx];
        bgMusic.load();
        await bgMusic.play();
        try { sessionStorage.setItem('musicPlaying', 'true'); } catch (e) {}
        syncMusicUI(true);
      } catch (err2) {
        console.warn('Fallback audio candidate also failed:', err2);
        updateMusicInlineStatus('Tap "Play Song" to start music', false);
      }
    } else {
      updateMusicInlineStatus('Tap "Play Song" to start music', false);
    }
  } finally {
    isAudioBusy = false;
  }
}

function pauseAudioSafe() {
  if (!bgMusic) return;
  bgMusic.pause();
  try { sessionStorage.setItem('musicPlaying', 'false'); } catch (e) {}
  syncMusicUI(false);
}

function togglePlayMusic(e) {
  if (e) {
    e.stopPropagation();
  }
  if (!bgMusic) return;

  if (bgMusic.paused) {
    playAudioSafe();
  } else {
    pauseAudioSafe();
  }
}

if (bgMusicToggle) bgMusicToggle.addEventListener('click', togglePlayMusic);
if (mobileMusicToggle) mobileMusicToggle.addEventListener('click', togglePlayMusic);
if (sidebarMusicPlayToggle) sidebarMusicPlayToggle.addEventListener('click', togglePlayMusic);
if (playerPlayBtn) playerPlayBtn.addEventListener('click', togglePlayMusic);

if (bgMusic) {
  // Ensure unmuted & full volume upon initialization, and STRICTLY NO LOOPING
  bgMusic.muted = false;
  bgMusic.volume = 1.0;
  bgMusic.loop = false;

  bgMusic.addEventListener('play', () => syncMusicUI(true));
  bgMusic.addEventListener('pause', () => syncMusicUI(false));
  bgMusic.addEventListener('ended', () => {
    bgMusic.pause();
    bgMusic.currentTime = 0;
    syncMusicUI(false);
    updateMusicInlineStatus('Track finished · Tap "Play Song" to listen again', false);
    try { sessionStorage.setItem('musicPlaying', 'false'); } catch (e) {}
  });

  bgMusic.addEventListener('timeupdate', () => {
    if (bgMusic.duration) {
      const pct = (bgMusic.currentTime / bgMusic.duration) * 100;
      if (progressFill) progressFill.style.width = pct + '%';
      if (currentTimeEl) currentTimeEl.textContent = formatAudioTime(bgMusic.currentTime);
      if (totalDurationEl) totalDurationEl.textContent = formatAudioTime(bgMusic.duration);
    }
  });

  bgMusic.addEventListener('loadedmetadata', () => {
    if (totalDurationEl) totalDurationEl.textContent = formatAudioTime(bgMusic.duration);
  });
}

// Progress scrubber click
const progressTrack = document.getElementById('progress-track');
if (progressTrack && bgMusic) {
  progressTrack.addEventListener('click', (e) => {
    const rect = progressTrack.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = clickX / rect.width;
    if (bgMusic.duration) {
      bgMusic.currentTime = ratio * bgMusic.duration;
    }
  });
}

// Previous & Next controls
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
if (prevBtn) {
  prevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (bgMusic) {
      bgMusic.currentTime = 0;
      playAudioSafe();
    }
  });
}
if (nextBtn) {
  nextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (bgMusic) {
      bgMusic.currentTime = 0;
      playAudioSafe();
    }
  });
}

// Playlist Item Renderer
(function renderPlaylist() {
  const songList = document.getElementById('song-list');
  if (!songList) return;
  songList.innerHTML = `
    <div class="playlist-track-item active" style="display:flex;align-items:center;justify-content:space-between;padding:0.75rem 1.2rem;background:rgba(230,133,164,0.18);border:1px solid rgba(230,133,164,0.35);border-radius:100px;margin-top:1.2rem;cursor:pointer;">
      <div style="display:flex;align-items:center;gap:0.75rem;">
        <span style="display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;border-radius:50%;background:#e685a4;color:#fff;font-size:0.75rem;font-weight:700;">1</span>
        <div>
          <strong style="display:block;font-size:0.92rem;color:#fff;">En Ragsss · Azhiyaadha Oviyam</strong>
          <span style="font-size:0.78rem;color:rgba(255,255,255,0.7);">Our Friendship Anthem · Dedicated to Ragsss</span>
        </div>
      </div>
      <span style="font-size:0.8rem;font-weight:600;color:#f3c98b;">3:01</span>
    </div>
  `;
  const item = songList.querySelector('.playlist-track-item');
  if (item) item.addEventListener('click', togglePlayMusic);
})();

// Song policy: strictly NO autoplay on page load or background gesture; plays ONLY when user clicks play button
(function initMusicPolicy() {
  if (!bgMusic) return;
  bgMusic.loop = false;
  try {
    sessionStorage.setItem('musicPlaying', 'false');
  } catch (e) {}
})();

// ─── 14. Render Calls Section ───
const callMemories = [
  {
    iconSvg: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>`,
    title: 'The Very First Call',
    desc: 'May 2026 · Nervous heartbeats, sweet introductions, and hours that slipped by in minutes.',
    date: 'May 2026 · 48 mins'
  },
  {
    iconSvg: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`,
    title: 'Sweet Afternoon Long Call',
    desc: 'Talking through a peaceful afternoon… losing track of time while sharing our day, thoughts, and sweetest laughter.',
    date: 'July 2026 · Afternoon · 1 hr 35 mins'
  },
  {
    iconSvg: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`,
    title: 'Midnight 12:00 AM Birthday Wish',
    desc: 'October 14, 2026 · Being the very first person to wish you, hearing that sweet voice note and call!',
    date: 'Oct 14, 2026 · Precious Call'
  },
  {
    iconSvg: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>`,
    title: 'Uncontrollable Laughter Call',
    desc: 'Laughing so hard our stomachs hurt about the silliest little inside jokes!',
    date: 'August 2026 · Pure Joy'
  },
  {
    iconSvg: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`,
    title: 'Heart-to-Heart Real Talk',
    desc: 'When we got real about how much we genuinely care, respect, and treasure our connection.',
    date: 'September 2026 · Special'
  }
];

(function renderCalls() {
  const list = document.getElementById('calls-list');
  if (!list) return;

  list.innerHTML = '';
  callMemories.forEach(call => {
    const card = document.createElement('div');
    card.className = 'call-memory-card';
    card.innerHTML = `
      <div class="call-icon-avatar">${call.iconSvg}</div>
      <div class="call-details">
        <h4 class="call-title">${call.title}</h4>
        <p class="call-desc">${call.desc}</p>
        <span class="call-date-tag">${call.date}</span>
      </div>
    `;
    list.appendChild(card);
  });
})();

// ─── 15. Memory Bot Companion ───
const chatWidgetPanel = document.getElementById('chat-widget-panel');
const chatWidgetLauncher = document.getElementById('chat-widget-launcher');
const chatWidgetClose = document.getElementById('chat-widget-close');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const chatMessages = document.getElementById('chat-messages');

const botKnowledge = {
  'hi': "Hii en Ragsss! How is your special birthday going? You look radiant today!",
  'hello': "Hello most beautiful person in the world! What would you like to know about our story?",
  'memories': "Our memories are pure gold! From our first chat on May 7th to the café breakfast and KitKat day, every second with you is precious!",
  'journey': "We started as classmates, became friends, best friends, close friends, favorite persons, and now you are Gokul's everything!",
  'kitkat': "August 7th! You gave Gokul a KitKat. It was a small treat, but it made him the happiest person alive!",
  'café': "July 31st at 10:45 AM! Sharing bread omelette and fresh juice together — first café outing was unforgettable!",
  'yellow': "September 21st! You wore that stunning yellow dress and looked absolutely breathtaking!",
  'birthday': "HAPPY BIRTHDAY RAGSSS! May all your dreams come true, may your heart always be peaceful, and may you smile endlessly!",
  'murugan': "On August 15, Gokul did 108 rounds around Murugan temple praying for your happiness. And on Sept 1, you gave him that sacred Murugan statue!",
  'miss': "Gokul misses you all the time! Even a single day without talking to you feels incomplete.",
  'secret': "Shhh… tap the little butterfly in the bottom corner 5 times or enter PIN 073101 in the Secret Vault!",
  'love': "You are loved and treasured beyond words, Ragsss. Always remember that!",
  'call': "From that nervous first call in May to the 12:00 AM midnight birthday call, talking to you is always the best part of the day!"
};

function getBotAnswer(query) {
  const lower = query.toLowerCase().trim();
  for (const [key, answer] of Object.entries(botKnowledge)) {
    if (lower.includes(key)) return answer;
  }
  return "You are Gokul's absolute favorite person! Ask me about 'memories', 'kitkat', 'yellow dress', 'murugan', 'birthday', or just ask for cheer!";
}

function appendChatBubble(text, isUser) {
  if (!chatMessages) return;
  const bubble = document.createElement('div');
  bubble.className = `chat-bubble ${isUser ? 'user' : 'bot'}`;
  bubble.textContent = text;
  chatMessages.appendChild(bubble);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function handleChatSubmit() {
  if (!chatInput) return;
  const text = chatInput.value.trim();
  if (!text) return;

  appendChatBubble(text, true);
  chatInput.value = '';

  setTimeout(() => {
    appendChatBubble(getBotAnswer(text), false);
  }, 400);
}

if (chatForm) {
  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    handleChatSubmit();
  });
}

function setChatWidgetOpen(isOpen) {
  if (!chatWidgetPanel || !chatWidgetLauncher) return;
  if (isOpen) {
    chatWidgetPanel.removeAttribute('hidden');
    chatWidgetPanel.hidden = false;
    chatWidgetPanel.classList.remove('is-hidden');
    chatWidgetPanel.style.display = 'flex';
    chatWidgetLauncher.setAttribute('aria-expanded', 'true');
    if (chatInput) {
      setTimeout(() => chatInput.focus(), 80);
    }
  } else {
    chatWidgetPanel.setAttribute('hidden', '');
    chatWidgetPanel.hidden = true;
    chatWidgetPanel.classList.add('is-hidden');
    chatWidgetPanel.style.display = 'none';
    chatWidgetLauncher.setAttribute('aria-expanded', 'false');
  }
}

function openChatWidget() {
  setChatWidgetOpen(true);
}
window.openChatWidget = openChatWidget;

function triggerBotQuery(keyword) {
  openChatWidget();
  setTimeout(() => {
    appendChatBubble(keyword, true);
    setTimeout(() => {
      appendChatBubble(getBotAnswer(keyword), false);
    }, 400);
  }, 200);
}
window.triggerBotQuery = triggerBotQuery;

if (chatWidgetLauncher) {
  chatWidgetLauncher.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    const isCurrentlyClosed = chatWidgetPanel.hidden || 
                              chatWidgetPanel.style.display === 'none' || 
                              chatWidgetPanel.classList.contains('is-hidden');
    setChatWidgetOpen(isCurrentlyClosed);
  });
}

if (chatWidgetClose) {
  chatWidgetClose.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    setChatWidgetOpen(false);
  });
}

// Close Memory Bot when clicking anywhere outside
document.addEventListener('click', (e) => {
  if (!chatWidgetPanel) return;
  const isWidgetOpen = !chatWidgetPanel.hidden && 
                       chatWidgetPanel.style.display !== 'none' && 
                       !chatWidgetPanel.classList.contains('is-hidden');
  if (!isWidgetOpen) return;

  const widgetContainer = document.getElementById('chat-widget');
  if (widgetContainer && !widgetContainer.contains(e.target)) {
    setChatWidgetOpen(false);
  }
});

// Close Memory Bot on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && chatWidgetPanel && !chatWidgetPanel.hidden && chatWidgetPanel.style.display !== 'none') {
    setChatWidgetOpen(false);
  }
});

// Initial state: guarantee chat starts closed
setChatWidgetOpen(false);

// ─── 16. Secret Memories Vault ───
const secretSubmitBtn = document.getElementById('secret-submit');
const secretPassInput = document.getElementById('secret-pass');
const secretFeedback = document.getElementById('secret-feedback');
const secretLock = document.getElementById('secret-lock');
const secretContent = document.getElementById('secret-content');
const secretLetterEl = document.getElementById('secret-letter');

if (secretSubmitBtn && secretPassInput) {
  secretSubmitBtn.addEventListener('click', () => {
    if (secretPassInput.value.trim() === '073101') {
      if (secretLock) secretLock.style.display = 'none';
      if (secretContent) {
        secretContent.style.display = 'block';
        secretContent.style.animation = 'popIn 0.6s ease';
      }
      if (secretLetterEl && typeof window.secretLetterContent === 'string') {
        secretLetterEl.textContent = window.secretLetterContent;
      }
      launchCelebration();
    } else {
      if (secretFeedback) {
        secretFeedback.textContent = 'Incorrect key. Try again';
        secretFeedback.style.color = '#d90429';
      }
    }
  });
}

// ─── 17. Easter Egg Hidden Butterfly ───
let butterflyTaps = 0;
const butterflyBtn = document.getElementById('hidden-butterfly');
if (butterflyBtn) {
  butterflyBtn.addEventListener('click', () => {
    butterflyTaps++;
    if (butterflyTaps >= 5) {
      butterflyTaps = 0;
      navigateTo('secret-memories');
      launchCelebration();
    }
  });
}

// ─── 18. Handle URL Hash Navigation ───
if (window.location.hash) {
  const hash = window.location.hash.replace('#', '');
  navigateTo(hash);
}

// ─── 19. Fairy Dust Sparkling Cursor Trail ───
(function initCursorMagic() {
  const sparkSymbols = ['✦', '★', '•', '·', '✧'];
  let lastSpawn = 0;

  function spawnSparkle(x, y) {
    const now = Date.now();
    if (now - lastSpawn < 40) return; // limit density for silky 60fps
    lastSpawn = now;

    const sparkle = document.createElement('span');
    sparkle.className = 'fairy-dust-spark';
    sparkle.textContent = sparkSymbols[Math.floor(Math.random() * sparkSymbols.length)];
    sparkle.style.left = x + 'px';
    sparkle.style.top = y + 'px';
    const offsetX = (Math.random() - 0.5) * 35;
    const offsetY = -20 - Math.random() * 35;
    sparkle.style.setProperty('--tx', offsetX + 'px');
    sparkle.style.setProperty('--ty', offsetY + 'px');

    document.body.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 750);
  }

  window.addEventListener('mousemove', (e) => {
    spawnSparkle(e.clientX, e.clientY);
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches[0]) {
      spawnSparkle(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });
})();

// ═══════════════════════════════════════════════════════════════
// FEATURE 1: INTERACTIVE GOLD FOIL SCRATCH CARD
// ═══════════════════════════════════════════════════════════════
(function initScratchCard() {
  const canvas = document.getElementById('scratch-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const container = document.getElementById('scratch-promise-container');
  const progressLabel = document.getElementById('scratch-progress-label');
  const revealAllBtn = document.getElementById('scratch-reveal-all-btn');
  const revealedBadge = document.getElementById('scratch-revealed-badge');

  let isScratching = false;
  let isRevealed = false;
  let lastX = 0;
  let lastY = 0;
  let checkThrottle = 0;

  function setupFoil() {
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = (rect.width || 560) * dpr;
    canvas.height = (rect.height || 320) * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width || 560;
    const h = rect.height || 320;

    // Rich metallic gold gradient
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#fce2aa');
    grad.addColorStop(0.25, '#dfa95c');
    grad.addColorStop(0.5, '#e685a4');
    grad.addColorStop(0.75, '#f3c98b');
    grad.addColorStop(1, '#b8863b');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Decorative inner gold border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.lineWidth = 2;
    ctx.strokeRect(12, 12, w - 24, h - 24);

    // Subtle gold glitter specks
    ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
    for (let i = 0; i < 45; i++) {
      const rx = 15 + Math.random() * (w - 30);
      const ry = 15 + Math.random() * (h - 30);
      const size = 1 + Math.random() * 2.5;
      ctx.beginPath();
      ctx.arc(rx, ry, size, 0, Math.PI * 2);
      ctx.fill();
    }

    // Centered foil typography & crest
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Monogram Circle
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.beginPath();
    ctx.arc(w / 2, h / 2 - 38, 26, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px "Playfair Display", Georgia, serif';
    ctx.fillText('R', w / 2, h / 2 - 37);

    ctx.font = 'bold 15px "Plus Jakarta Sans", sans-serif';
    ctx.letterSpacing = '2px';
    ctx.fillText('GOKUL’S SECRET PROMISE', w / 2, h / 2 + 10);

    ctx.font = 'italic 13px "Playfair Display", Georgia, serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.88)';
    ctx.fillText('Scratch with your finger or mouse to reveal ♡', w / 2, h / 2 + 36);
  }

  // Initial draw
  setTimeout(setupFoil, 100);
  window.addEventListener('resize', () => {
    if (!isRevealed) setupFoil();
  });

  function getCoords(e) {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  }

  function scratchLine(x1, y1, x2, y2) {
    if (isRevealed) return;
    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineWidth = 42;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    checkThrottle++;
    if (checkThrottle % 18 === 0) {
      checkScratchedPercentage();
    }
  }

  function checkScratchedPercentage() {
    if (isRevealed) return;
    try {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      const sampleW = Math.floor(rect.width * dpr);
      const sampleH = Math.floor(rect.height * dpr);
      if (sampleW <= 0 || sampleH <= 0) return;

      const imgData = ctx.getImageData(0, 0, sampleW, sampleH);
      const data = imgData.data;
      let transparentCount = 0;
      const step = 32; // Sample every 32nd pixel for instant 60fps calculation
      let totalSampled = 0;

      for (let i = 3; i < data.length; i += step * 4) {
        totalSampled++;
        if (data[i] === 0) transparentCount++;
      }

      const percent = Math.min(100, Math.round((transparentCount / totalSampled) * 100));
      if (progressLabel) {
        progressLabel.textContent = `Scratching... (${percent}% revealed)`;
      }

      if (percent >= 48) {
        revealEntireCard();
      }
    } catch (err) {}
  }

  function revealEntireCard() {
    if (isRevealed) return;
    isRevealed = true;
    canvas.style.transition = 'opacity 0.7s cubic-bezier(0.25, 1, 0.5, 1)';
    canvas.style.opacity = '0';
    setTimeout(() => {
      canvas.style.pointerEvents = 'none';
      canvas.style.display = 'none';
    }, 700);

    if (progressLabel) {
      progressLabel.textContent = '100% revealed · Promise unlocked forever ♡';
    }
    if (revealedBadge) {
      revealedBadge.classList.add('active');
    }
    if (typeof createConfettiBurst === 'function') {
      createConfettiBurst();
    }
    playSparkleChime();
  }

  // Mouse & Touch events
  canvas.addEventListener('mousedown', (e) => {
    isScratching = true;
    const { x, y } = getCoords(e);
    lastX = x;
    lastY = y;
    scratchLine(x, y, x, y);
    playTone(680, 'sine', 0.08, 0.02);
  });

  window.addEventListener('mousemove', (e) => {
    if (!isScratching) return;
    const { x, y } = getCoords(e);
    scratchLine(lastX, lastY, x, y);
    lastX = x;
    lastY = y;
  });

  window.addEventListener('mouseup', () => {
    if (isScratching) {
      isScratching = false;
      checkScratchedPercentage();
    }
  });

  // Touch Events
  canvas.addEventListener('touchstart', (e) => {
    isScratching = true;
    const { x, y } = getCoords(e);
    lastX = x;
    lastY = y;
    scratchLine(x, y, x, y);
    playTone(680, 'sine', 0.08, 0.02);
  }, { passive: true });

  canvas.addEventListener('touchmove', (e) => {
    if (!isScratching) return;
    const { x, y } = getCoords(e);
    scratchLine(lastX, lastY, x, y);
    lastX = x;
    lastY = y;
  }, { passive: true });

  canvas.addEventListener('touchend', () => {
    if (isScratching) {
      isScratching = false;
      checkScratchedPercentage();
    }
  });

  if (revealAllBtn) {
    revealAllBtn.addEventListener('click', () => {
      revealEntireCard();
    });
  }
})();



// ═══════════════════════════════════════════════════════════════
// FEATURE 3: CINEMATIC STORY SLIDESHOW MODAL (STORY MODE)
// ═══════════════════════════════════════════════════════════════
(function initCinemaStory() {
  const openCinemaBtn = document.getElementById('open-cinema-btn');
  const modal = document.getElementById('cinema-story-modal');
  if (!modal) return;

  const closeBtn = document.getElementById('cinema-close-btn');
  const backdrop = document.getElementById('cinema-backdrop');
  const playPauseBtn = document.getElementById('cinema-play-pause-btn');
  const playSvg = document.getElementById('cinema-play-svg');
  const progressRow = document.getElementById('cinema-progress-row');

  const counterEl = document.getElementById('cinema-slide-counter');
  const badgeEl = document.getElementById('cinema-slide-badge');
  const crestEl = document.getElementById('cinema-slide-crest');
  const dateEl = document.getElementById('cinema-slide-date');
  const titleEl = document.getElementById('cinema-slide-title');
  const textEl = document.getElementById('cinema-slide-text');
  const quoteEl = document.getElementById('cinema-slide-quote');
  const activeSlideEl = document.getElementById('cinema-active-slide');

  const prevArrow = document.getElementById('cinema-prev-arrow');
  const nextArrow = document.getElementById('cinema-next-arrow');

  const storySlides = [
    {
      badge: "CHAPTER 01 · THE GENESIS",
      date: "May 7, 2026 · 7:30 AM",
      title: "Where Two Worlds Collided",
      text: "It started with a simple morning message at 7:30 AM. Neither of us could have guessed that a casual chat would evolve into the deepest, sweetest, most unbreakable friendship of our lives.",
      quote: "Some meetings are written in the stars, but ours felt like coming home."
    },
    {
      badge: "CHAPTER 02 · SWEET GESTURE",
      date: "The KitKat Moment",
      title: "A Sweet Touch That Melted Distance",
      text: "That day you handed me a KitKat, it wasn't just chocolate. It was your natural warmth, your radiant smile, and the genuine care behind it that turned an ordinary afternoon into an unforgettable memory.",
      quote: "The sweetest gifts aren't wrapped in gold — they are wrapped in pure thoughtfulness."
    },
    {
      badge: "CHAPTER 03 · SACRED BLESSING",
      date: "Divine Prayers",
      title: "The Golden Murugan Statue",
      text: "Presenting that beautiful Murugan statue to you was a silent prayer: may peace, happiness, and supreme divine grace walk with Ragsss through every crossroad of her journey.",
      quote: "Whenever you smile, a thousand silent prayers are answered."
    },
    {
      badge: "CHAPTER 04 · UNFORGETTABLE SIGHT",
      date: "A Day of Radiance",
      title: "Grace in the Yellow Dress",
      text: "The day you wore that yellow dress, you looked so breathtakingly graceful and bright. You were like a gentle beam of golden dawn, bringing warmth and elegance into the room.",
      quote: "Some visions stay preserved in the mind forever, untouched by time."
    },
    {
      badge: "CHAPTER 05 · SHARED TRIUMPH",
      date: "SIH Hackathon Days",
      title: "Teammates in Code, Partners in Laughter",
      text: "Long preparation nights, debugging bugs, panic moments, and shared laughs. Through the intensity of SIH, we proved how strong we are together. You turned hard work into pure joy.",
      quote: "With the right person beside you, any mountain feels like a gentle hill."
    },
    {
      badge: "CHAPTER 06 · MIDNIGHT SANCTUARY",
      date: "Countless Late Nights",
      title: "When Hours Vanished in Whispers",
      text: "Those late-night phone calls where midnight melted into 2:00 AM in the blink of an eye. Talking about everything and nothing, sharing secrets, fears, and laughter without a care in the world.",
      quote: "Silence was never awkward, and words were never enough."
    },
    {
      badge: "CHAPTER 07 · THE UNBREAKABLE BRIDGE",
      date: "Growing Closer Each Season",
      title: "From Classmates to Soul Friends",
      text: "Step by step, chapter by chapter: from classmates to friends, to best friends, to my absolute favorite person in the entire world. A bond built on respect, care, and laughter.",
      quote: "A true friendship doesn't need daily meetings — it is anchored deep in the soul."
    },
    {
      badge: "CHAPTER 08 · FOREVER & ALWAYS",
      date: "Celebrating You Today",
      title: "Happy Birthday, En Precious Ragsss!",
      text: "Today and always, I celebrate your kindness, your pure heart, your brilliant mind, and the light you bring to everyone around you. Thank you for being the most incredible part of my life.",
      quote: "Always your safe space, your greatest cheerleader, and your loyal friend — Gokul ♡"
    }
  ];

  let currentSlide = 0;
  let isPaused = false;
  let slideTimer = null;
  let progressStep = 0;
  const slideDurationMs = 5500;
  const tickIntervalMs = 50;

  // Build segmented progress bars
  if (progressRow) {
    progressRow.innerHTML = '';
    storySlides.forEach((_, i) => {
      const seg = document.createElement('div');
      seg.className = 'cinema-segment';
      seg.innerHTML = '<div class="cinema-segment-fill"></div>';
      progressRow.appendChild(seg);
    });
  }

  function updateSlide(idx) {
    currentSlide = idx;
    const slide = storySlides[idx];
    if (!slide) return;

    if (counterEl) counterEl.textContent = `Milestone ${idx + 1} of ${storySlides.length}`;
    if (badgeEl) badgeEl.textContent = slide.badge;
    if (dateEl) dateEl.textContent = slide.date;
    if (titleEl) titleEl.textContent = slide.title;
    if (textEl) textEl.textContent = slide.text;
    if (quoteEl) quoteEl.textContent = `"${slide.quote}"`;

    if (activeSlideEl) {
      activeSlideEl.style.animation = 'none';
      activeSlideEl.offsetHeight;
      activeSlideEl.style.animation = 'fadeIn 0.45s ease';
    }

    // Update progress bar fills
    const segments = progressRow ? progressRow.querySelectorAll('.cinema-segment') : [];
    segments.forEach((seg, sIdx) => {
      const fill = seg.querySelector('.cinema-segment-fill');
      if (sIdx < idx) {
        seg.classList.add('completed');
        if (fill) fill.style.width = '100%';
      } else if (sIdx === idx) {
        seg.classList.remove('completed');
        if (fill) fill.style.width = '0%';
      } else {
        seg.classList.remove('completed');
        if (fill) fill.style.width = '0%';
      }
    });

    progressStep = 0;
    playTone(520 + idx * 30, 'sine', 0.12, 0.02);
  }

  function startSlideTimer() {
    clearInterval(slideTimer);
    slideTimer = setInterval(() => {
      if (isPaused) return;

      progressStep += tickIntervalMs;
      const pct = Math.min(100, (progressStep / slideDurationMs) * 100);
      const segments = progressRow ? progressRow.querySelectorAll('.cinema-segment') : [];
      if (segments[currentSlide]) {
        const fill = segments[currentSlide].querySelector('.cinema-segment-fill');
        if (fill) fill.style.width = pct + '%';
      }

      if (progressStep >= slideDurationMs) {
        if (currentSlide < storySlides.length - 1) {
          updateSlide(currentSlide + 1);
        } else {
          // Finished all slides
          updateSlide(0);
        }
      }
    }, tickIntervalMs);
  }

  function openCinema() {
    modal.removeAttribute('hidden');
    modal.style.display = 'flex';
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';

    // Start background music safely if not playing
    if (typeof playAudioSafe === 'function') {
      playAudioSafe();
    }

    updateSlide(0);
    isPaused = false;
    startSlideTimer();
  }

  function closeCinema() {
    clearInterval(slideTimer);
    modal.classList.remove('show');
    modal.setAttribute('hidden', '');
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }

  if (openCinemaBtn) openCinemaBtn.addEventListener('click', openCinema);
  if (closeBtn) closeBtn.addEventListener('click', closeCinema);
  if (backdrop) backdrop.addEventListener('click', closeCinema);

  if (prevArrow) {
    prevArrow.addEventListener('click', () => {
      const prev = currentSlide > 0 ? currentSlide - 1 : storySlides.length - 1;
      updateSlide(prev);
    });
  }

  if (nextArrow) {
    nextArrow.addEventListener('click', () => {
      const next = currentSlide < storySlides.length - 1 ? currentSlide + 1 : 0;
      updateSlide(next);
    });
  }

  if (playPauseBtn) {
    playPauseBtn.addEventListener('click', () => {
      isPaused = !isPaused;
      if (playSvg) {
        playSvg.innerHTML = isPaused 
          ? '<polygon points="5 3 19 12 5 21 5 3"/>'
          : '<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>';
      }
    });
  }

  // Pause on hover
  if (activeSlideEl) {
    activeSlideEl.addEventListener('mouseenter', () => { isPaused = true; });
    activeSlideEl.addEventListener('mouseleave', () => { isPaused = false; });
  }

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('show')) return;
    if (e.key === 'Escape') closeCinema();
    if (e.key === 'ArrowRight') {
      const next = currentSlide < storySlides.length - 1 ? currentSlide + 1 : 0;
      updateSlide(next);
    }
    if (e.key === 'ArrowLeft') {
      const prev = currentSlide > 0 ? currentSlide - 1 : storySlides.length - 1;
      updateSlide(prev);
    }
    if (e.key === ' ') {
      e.preventDefault();
      if (playPauseBtn) playPauseBtn.click();
    }
  });

  window.openCinemaStory = openCinema;
})();

// ═══════════════════════════════════════════════════════════════
// FEATURE 4: "A SIP OF SUNSHINE" (DAILY COMFORT GENERATOR)
// ═══════════════════════════════════════════════════════════════
(function initSunshineComfort() {
  const brewBtn = document.getElementById('brew-comfort-btn');
  const messageEl = document.getElementById('tea-comfort-message');
  const cardEl = document.getElementById('tea-comfort-card');
  if (!brewBtn || !messageEl) return;

  const comfortNotes = [
    "Take a deep breath, en Ragsss. You don't have to carry the whole world on your shoulders today. Be gentle with yourself, drink some water, and remember: you have a friend who is always praying for your happiness and cheering for your dreams. ♡",
    "Hey, even the brightest flowers need a quiet rainy day to rest and grow. Be soft with yourself today. You are strong, but it's completely okay to just take a pause. Gokul is always one call away. ♡",
    "Did anyone tell you today how wonderful you are? If not, let me remind you: Your kindness is rare, your mind is brilliant, and you are so deeply valued. Keep shining, en precious friend! ♡",
    "Close your eyes for 10 seconds. Inhale slowly. Remember our laughs, the KitKat days, and how far you've come. You are capable of conquering anything, thangoooo! ♡",
    "Whenever you feel small or worried, look up at the sky. Under the same sky, your best friend is praying for your peace and sending you the warmest virtual hugs! ♡",
    "It's okay not to have everything figured out right now. You are doing so much better than you give yourself credit for. I believe in you, even on the days you doubt yourself. ♡",
    "A gentle reminder for today: Your worth is not defined by how productive you were. You are precious simply because you are Ragsss. Rest well, eat on time, and smile! ♡",
    "Whenever overthinking starts knocking on your door, tell it: 'Gokul said everything will be alright, so I am choosing peace today.' Trust me, you've got this! ♡",
    "Sending you a cup filled with 100% pure peace, 0% stress, and endless warm smiles. Drink it up, en Ragsss! ♡",
    "You have survived 100% of your hardest days so far, and you will walk through this season with grace too. I am right behind you, always cheering loudest! ♡",
    "Remember that 7:30 AM morning? How an ordinary day turned into something beautiful? Life has so many more wonderful surprises waiting for you. Keep your head high! ♡",
    "Never forget how much your genuine laugh means to the people around you. Protect your peace, forgive the little things, and let your heart rest today. ♡",
    "If you're feeling exhausted today, consider this your official permission to do absolutely nothing guilty-free for an hour. Put on your favorite music and just breathe. ♡",
    "No matter what challenges today brought, tomorrow is a brand new sunrise with endless possibilities. Sleep peacefully knowing you are deeply cherished. ♡",
    "En Ragsss, you are one of the rarest, purest souls on this earth. Thank you for existing. I will always be in your corner, today, tomorrow, and forever. ♡"
  ];

  let lastIndex = 0;

  brewBtn.addEventListener('click', () => {
    let rand = Math.floor(Math.random() * comfortNotes.length);
    if (rand === lastIndex) rand = (rand + 1) % comfortNotes.length;
    lastIndex = rand;

    if (cardEl) {
      cardEl.style.animation = 'none';
      cardEl.offsetHeight;
      cardEl.style.animation = 'popIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
    }

    messageEl.textContent = `"${comfortNotes[rand]}"`;
    playTone(740, 'sine', 0.22, 0.035);
  });
})();

// ═══════════════════════════════════════════════════════════════
// TRANSFORMED HOME PAGE ENHANCEMENTS
// ═══════════════════════════════════════════════════════════════
(function initHomePageEnhancements() {
  // 1. Personal Eyebrow Title
  const greetingEl = document.getElementById('home-greeting-text');
  if (greetingEl) {
    greetingEl.textContent = 'EN ULAGAME, EN RAGSSS EYYY';
  }

  // 2. Interactive Cake Ceremony (Blow & Relight Candles)
  const cakeBlowBtn = document.getElementById('cake-action-blow');
  const cakeRelightBtn = document.getElementById('cake-action-relight');
  const candleFlames = document.getElementById('cake-candle-flames');
  const cakeWishBanner = document.getElementById('cake-wish-banner');
  const cakeHintText = document.getElementById('cake-hint-text');

  function blowCandles() {
    if (candleFlames) candleFlames.classList.add('blown');
    if (cakeWishBanner) cakeWishBanner.style.display = 'block';
    if (cakeBlowBtn) cakeBlowBtn.style.display = 'none';
    if (cakeRelightBtn) cakeRelightBtn.style.display = 'inline-block';
    if (cakeHintText) cakeHintText.textContent = 'Candles blown! May your wish come true ♡';

    playTone(320, 'sine', 0.25, 0.04);
    setTimeout(() => {
      playSparkleChime();
      if (typeof createConfettiBurst === 'function') createConfettiBurst();
    }, 200);
  }

  function relightCandles() {
    if (candleFlames) candleFlames.classList.remove('blown');
    if (cakeWishBanner) cakeWishBanner.style.display = 'none';
    if (cakeBlowBtn) cakeBlowBtn.style.display = 'inline-block';
    if (cakeRelightBtn) cakeRelightBtn.style.display = 'none';
    if (cakeHintText) cakeHintText.textContent = 'Tap the cake or blow candles to make a wish';

    playTone(600, 'triangle', 0.15, 0.03);
  }

  if (cakeBlowBtn) cakeBlowBtn.addEventListener('click', blowCandles);
  if (cakeRelightBtn) cakeRelightBtn.addEventListener('click', relightCandles);
})();

// ═══════════════════════════════════════════════════════════════
// FEATURE: CELESTIAL STAR MAP (CONSTELLATION OF OUR DATES)
// ═══════════════════════════════════════════════════════════════
(function initCelestialStarMap() {
  const nodesLayer = document.getElementById('starmap-nodes-layer');
  const linesGroup = document.getElementById('starmap-lines-group');
  const statusText = document.getElementById('starmap-status-text');
  const drawer = document.getElementById('star-memory-drawer');
  const connectBtn = document.getElementById('connect-stars-btn');
  const resetBtn = document.getElementById('reset-stars-btn');
  const closeBtn = document.getElementById('star-drawer-close');

  const crestEl = document.getElementById('star-drawer-crest');
  const badgeEl = document.getElementById('star-drawer-badge');
  const titleEl = document.getElementById('star-drawer-title');
  const dateEl = document.getElementById('star-drawer-date');
  const storyEl = document.getElementById('star-drawer-story');
  const quoteEl = document.getElementById('star-drawer-quote');
  const counterEl = document.getElementById('star-counter-pill');
  const prevBtn = document.getElementById('star-prev-btn');
  const nextBtn = document.getElementById('star-next-btn');

  const dates = window.celestialDates || [];
  if (!nodesLayer || !dates.length) return;

  let activeIndex = -1;
  let isConnecting = false;

  // Render Star Nodes
  nodesLayer.innerHTML = '';
  dates.forEach((item, index) => {
    const node = document.createElement('div');
    node.className = 'star-node';
    node.id = `star-node-${index}`;
    node.style.left = `${item.x}%`;
    node.style.top = `${item.y}%`;
    node.innerHTML = `
      <div class="star-node-dot" style="background: radial-gradient(circle, #fff 0%, ${item.color} 55%, #e27396 100%);">
        <span class="star-node-symbol">${item.symbol}</span>
      </div>
      <span class="star-node-badge">${item.date.split('·')[0].trim()}</span>
    `;

    node.addEventListener('click', () => {
      openStar(index, true);
    });

    nodesLayer.appendChild(node);
  });

  function openStar(index, playSound = false) {
    if (index < 0 || index >= dates.length) return;
    activeIndex = index;
    const item = dates[index];

    // Highlight node
    document.querySelectorAll('.star-node').forEach((n, i) => {
      n.classList.toggle('active', i === index);
    });

    // Populate drawer
    if (crestEl) crestEl.textContent = item.symbol;
    if (badgeEl) badgeEl.textContent = item.name;
    if (titleEl) titleEl.textContent = item.title;
    if (dateEl) dateEl.textContent = item.date;
    if (storyEl) storyEl.textContent = item.story;
    if (quoteEl) quoteEl.textContent = `"${item.quote}"`;
    if (counterEl) counterEl.textContent = `Star ${index + 1} of ${dates.length}`;

    if (statusText) statusText.textContent = `Viewing: ${item.name} (${item.date})`;

    if (drawer) drawer.style.display = 'block';

    if (playSound) {
      playTone(520 + index * 45, 'sine', 0.18, 0.035);
    }
  }

  function closeStarDrawer() {
    if (drawer) drawer.style.display = 'none';
    document.querySelectorAll('.star-node').forEach(n => n.classList.remove('active'));
    if (statusText) statusText.textContent = 'Tap any star to illuminate its memory';
    activeIndex = -1;
  }

  // Draw Line between two coordinate percentages in SVG (1000x650 coordinate system)
  function drawLineBetween(starA, starB) {
    if (!linesGroup) return;
    const x1 = (starA.x / 100) * 1000;
    const y1 = (starA.y / 100) * 650;
    const x2 = (starB.x / 100) * 1000;
    const y2 = (starB.y / 100) * 650;

    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', x1);
    line.setAttribute('y1', y1);
    line.setAttribute('x2', x2);
    line.setAttribute('y2', y2);
    linesGroup.appendChild(line);
  }

  function connectAllStars() {
    if (isConnecting) return;
    isConnecting = true;
    if (linesGroup) linesGroup.innerHTML = '';

    let i = 0;
    if (statusText) statusText.textContent = 'Connecting our constellation across the night sky...';

    function step() {
      if (i < dates.length) {
        openStar(i, true);
        if (i > 0) {
          drawLineBetween(dates[i - 1], dates[i]);
        }
        i++;
        setTimeout(step, 550);
      } else {
        // Connect the Zenith star back to Alpha star to complete the celestial loop
        drawLineBetween(dates[dates.length - 1], dates[0]);
        isConnecting = false;
        if (statusText) statusText.textContent = 'Constellation aligned! All 8 sacred dates connected forever ♡';
        playSparkleChime();
        if (typeof createConfettiBurst === 'function') createConfettiBurst();
      }
    }
    step();
  }

  function resetSky() {
    if (linesGroup) linesGroup.innerHTML = '';
    closeStarDrawer();
    playTone(400, 'sine', 0.15, 0.02);
  }

  if (connectBtn) connectBtn.addEventListener('click', connectAllStars);
  if (resetBtn) resetBtn.addEventListener('click', resetSky);
  if (closeBtn) closeBtn.addEventListener('click', closeStarDrawer);

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      const prev = activeIndex > 0 ? activeIndex - 1 : dates.length - 1;
      openStar(prev, true);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const next = activeIndex < dates.length - 1 ? activeIndex + 1 : 0;
      openStar(next, true);
    });
  }
})();



