/**
 * 30-Second Cinematic Birthday Video Reel for Ragsss
 * Crafted with extreme care, romance, and visual elegance
 * Features:
 * - Ultra-impressive cinematic Ken Burns photo showcases with smart face-tracking
 * - Dual-layer depth: Atmospheric blurred background + glowing luxury portrait showcase
 * - Smooth 0.5s cross-dissolve transitions between scenes with warm golden light leaks
 * - Glowing floating hearts and twinkling stardust particles
 * - Prominent "HAPPY BIRTHDAY MY EVERYTHING" branding & luxury typography
 * - Celebration confetti fireworks grand finale
 * - Full audio sync with background music (play, pause, scrub, stop at 30s)
 * - 100% offline-ready & zero external dependencies
 */
(function() {
  'use strict';

  function initBirthdayVideo() {
    const canvas = document.getElementById('bday-video-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const wrapper = document.getElementById('bday-video-wrapper');
    const screen = document.getElementById('bday-video-screen');
    const bigPlayBtn = document.getElementById('bday-video-big-play');
    const ctrlPlayBtn = document.getElementById('bday-vctrl-play');
    const scrubTrack = document.getElementById('bday-vctrl-scrub');
    const scrubProg = document.getElementById('bday-vctrl-progress');
    const scrubHandle = document.getElementById('bday-vctrl-handle');
    const timeDisplay = document.getElementById('bday-vctrl-time');
    const muteBtn = document.getElementById('bday-vctrl-mute');
    const fullscreenBtn = document.getElementById('bday-vctrl-fullscreen');
    const bgAudio = document.getElementById('background-music');

    const DURATION = 30.0; // Exactly 30 seconds

    // Face coordinates map for perfect framing without cutting off Ragsss's face
    const FACE_MAP = {
      'WhatsApp Image 2026-11-22 at 9.43.49 AM.jpeg': { fx: 0.38, fy: 0.44 },
      'WhatsApp Image 2026-11-22 at 9.43.50 AM (1).jpeg': { fx: 0.64, fy: 0.25 },
      'WhatsApp Image 2026-11-22 at 9.43.51 AM.jpeg': { fx: 0.64, fy: 0.39 },
      'WhatsApp Image 2026-11-22 at 9.43.54 AM.jpeg': { fx: 0.45, fy: 0.42 },
      'WhatsApp Image 2026-11-22 at 9.43.56 AM.jpeg': { fx: 0.45, fy: 0.24 },
      'WhatsApp Image 2026-11-22 at 9.43.58 AM.jpeg': { fx: 0.63, fy: 0.44 },
      'WhatsApp Image 2026-11-22 at 9.44.00 AM.jpeg': { fx: 0.50, fy: 0.49 }
    };

    // Timeline Scenes with smooth 0.4s cross-fade overlaps
    const SCENES = [
      {
        id: 'intro',
        type: 'intro',
        start: 0.0,
        end: 4.2,
        previewSrc: '../assets/images/gallery/WhatsApp%20Image%202026-11-22%20at%209.43.49%20AM.jpeg',
        badge: '✦ SPECIAL BIRTHDAY TRIBUTE ✦',
        title: 'HAPPY BIRTHDAY',
        highlight: 'MY EVERYTHING',
        sub: 'To the most precious, kindest soul in my world',
        date: '28 · 11 · 2026'
      },
      {
        id: 'photo-1',
        type: 'photo',
        start: 3.8,
        end: 7.6,
        src: '../assets/images/gallery/WhatsApp%20Image%202026-11-22%20at%209.43.49%20AM.jpeg',
        tag: 'MY EVERYTHING',
        title: 'That Radiant Smile',
        sub: 'The smile that lights up my entire world ♡',
        pan: 'zoom-in'
      },
      {
        id: 'photo-2',
        type: 'photo',
        start: 7.2,
        end: 11.0,
        src: '../assets/images/gallery/WhatsApp%20Image%202026-11-22%20at%209.43.50%20AM%20(1).jpeg',
        tag: 'EN ANBANA RAGSSS',
        title: 'Purest Heart of Gold',
        sub: 'Your sweet kindness makes every day special ♡',
        pan: 'pan-up'
      },
      {
        id: 'photo-3',
        type: 'photo',
        start: 10.6,
        end: 14.5,
        src: '../assets/images/gallery/WhatsApp%20Image%202026-11-22%20at%209.43.51%20AM.jpeg',
        tag: 'NATURALLY STUNNING',
        title: 'Breathtaking Elegance',
        sub: 'Grace, charm, and beauty in every single look ♡',
        pan: 'zoom-out'
      },
      {
        id: 'photo-4',
        type: 'photo',
        start: 14.1,
        end: 18.0,
        src: '../assets/images/gallery/WhatsApp%20Image%202026-11-22%20at%209.43.54%20AM.jpeg',
        tag: 'OUR CHERISHED STORY',
        title: 'Every Moment With You',
        sub: 'May 7 to Forever — The sweetest blessing in my life ♡',
        pan: 'pan-left'
      },
      {
        id: 'photo-5',
        type: 'photo',
        start: 17.6,
        end: 21.6,
        src: '../assets/images/gallery/WhatsApp%20Image%202026-11-22%20at%209.43.56%20AM.jpeg',
        tag: 'PURE SUNSHINE',
        title: 'Joy & Sweetest Laughter',
        sub: 'Making every ordinary moment unforgettable ♡',
        pan: 'zoom-in'
      },
      {
        id: 'photo-6',
        type: 'photo',
        start: 21.2,
        end: 25.4,
        src: '../assets/images/gallery/WhatsApp%20Image%202026-11-22%20at%209.43.58%20AM.jpeg',
        tag: 'MY EVERYTHING',
        title: 'Forever Treasured',
        sub: 'Always protected, respected, and loved beyond words ♡',
        pan: 'pan-right'
      },
      {
        id: 'finale',
        type: 'finale',
        start: 25.0,
        end: 30.0,
        src: '../assets/images/gallery/WhatsApp%20Image%202026-11-22%20at%209.44.00%20AM.jpeg',
        badge: '✦ FOREVER & ALWAYS ✦',
        title: 'HAPPY BIRTHDAY',
        highlight: 'MY EVERYTHING',
        name: 'En Ragsss ♡',
        sub: 'May all your sweetest dreams come true!',
        signature: 'Always by your side — Gokul ♡',
        date: '28 · 11 · 2026'
      }
    ];

    // Player State
    let isPlaying = false;
    let currentTime = 0.0;
    let lastTimestamp = 0;
    let isMuted = false;
    let isScrubbing = false;

    // Preload Images
    const loadedImages = {};
    SCENES.forEach(scene => {
      const src = scene.src || scene.previewSrc;
      if (src && !loadedImages[src]) {
        const img = new Image();
        img.src = src;
        loadedImages[src] = img;
      }
    });

    // Particle System (Stardust + Floating Hearts + Fireworks)
    const stardust = [];
    for (let i = 0; i < 50; i++) {
      stardust.push({
        x: Math.random() * 1280,
        y: Math.random() * 720,
        r: Math.random() * 3.5 + 1.2,
        vx: (Math.random() - 0.5) * 0.35,
        vy: -Math.random() * 0.7 - 0.25,
        alpha: Math.random() * 0.6 + 0.2,
        pulse: Math.random() * Math.PI * 2,
        color: Math.random() > 0.4 ? '#f3c98b' : '#ffb6cb'
      });
    }

    const floatingHearts = [];
    for (let i = 0; i < 18; i++) {
      floatingHearts.push({
        x: Math.random() * 1280,
        y: Math.random() * 720 + 200,
        size: Math.random() * 12 + 10,
        vy: -Math.random() * 0.6 - 0.3,
        rot: (Math.random() - 0.5) * 0.4,
        rotSpeed: (Math.random() - 0.5) * 0.015,
        alpha: Math.random() * 0.45 + 0.15,
        pulse: Math.random() * Math.PI * 2,
        color: Math.random() > 0.5 ? '#f48fb1' : '#f3c98b'
      });
    }

    const confettiPieces = [];
    const CONFETTI_COLORS = ['#f3c98b', '#e685a4', '#ffd166', '#a8e6cf', '#d8c7ff', '#ffffff'];
    for (let i = 0; i < 65; i++) {
      confettiPieces.push({
        x: 640 + (Math.random() - 0.5) * 800,
        y: Math.random() * 720,
        w: Math.random() * 9 + 5,
        h: Math.random() * 6 + 3,
        vx: (Math.random() - 0.5) * 2.2,
        vy: Math.random() * 1.5 + 0.8,
        rot: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 6,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)]
      });
    }

    function formatTime(sec) {
      const s = Math.floor(sec);
      const m = Math.floor(s / 60);
      const rem = s % 60;
      return m + ':' + (rem < 10 ? '0' : '') + rem;
    }

    // Helper: Draw a glowing heart
    function drawHeart(x, y, size, color, alpha) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
      ctx.fillStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      const topCurveHeight = size * 0.3;
      ctx.moveTo(x, y + topCurveHeight);
      ctx.bezierCurveTo(x, y, x - size / 2, y, x - size / 2, y + topCurveHeight);
      ctx.bezierCurveTo(x - size / 2, y + (size + topCurveHeight) / 2, x, y + (size + topCurveHeight) / 1.4, x, y + size);
      ctx.bezierCurveTo(x, y + (size + topCurveHeight) / 1.4, x + size / 2, y + (size + topCurveHeight) / 2, x + size / 2, y + topCurveHeight);
      ctx.bezierCurveTo(x + size / 2, y, x, y, x, y + topCurveHeight);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    // Helper: Draw 4-point golden sparkle
    function drawSparkle(x, y, r, color, alpha) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.moveTo(x, y - r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.quadraticCurveTo(x, y, x, y + r);
      ctx.quadraticCurveTo(x, y, x - r, y);
      ctx.quadraticCurveTo(x, y, x, y - r);
      ctx.fill();
      ctx.restore();
    }

    // Cinematic Film Vignette & Light Leak
    function drawCinematicOverlays(time) {
      const cw = canvas.width;
      const ch = canvas.height;

      // Letterbox dark film gradient
      const vGrad = ctx.createLinearGradient(0, 0, 0, ch);
      vGrad.addColorStop(0, 'rgba(12, 4, 15, 0.75)');
      vGrad.addColorStop(0.18, 'rgba(12, 4, 15, 0.08)');
      vGrad.addColorStop(0.82, 'rgba(12, 4, 15, 0.15)');
      vGrad.addColorStop(1, 'rgba(10, 3, 12, 0.88)');
      ctx.fillStyle = vGrad;
      ctx.fillRect(0, 0, cw, ch);

      // Radial vignette
      const radGrad = ctx.createRadialGradient(cw / 2, ch / 2, ch * 0.38, cw / 2, ch / 2, cw * 0.78);
      radGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
      radGrad.addColorStop(1, 'rgba(10, 3, 12, 0.7)');
      ctx.fillStyle = radGrad;
      ctx.fillRect(0, 0, cw, ch);

      // Warm moving golden light leak / sun flare
      const flareX = cw * 0.82 + Math.sin(time * 0.8) * 80;
      const flareY = ch * 0.16 + Math.cos(time * 0.7) * 40;
      const flareGrad = ctx.createRadialGradient(flareX, flareY, 10, flareX, flareY, 320);
      flareGrad.addColorStop(0, 'rgba(255, 209, 102, 0.26)');
      flareGrad.addColorStop(0.4, 'rgba(230, 133, 164, 0.12)');
      flareGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = flareGrad;
      ctx.fillRect(0, 0, cw, ch);
    }

    // Particle Renderer
    function drawParticles(dt, isFinale = false) {
      const cw = canvas.width;
      const ch = canvas.height;

      // Stardust
      stardust.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.pulse += dt * 2.8;

        if (p.y < -20) { p.y = ch + 10; p.x = Math.random() * cw; }
        if (p.x < -20) p.x = cw + 10;
        if (p.x > cw + 20) p.x = -10;

        const alpha = p.alpha * (0.6 + 0.4 * Math.sin(p.pulse));
        ctx.save();
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        if (p.r > 2.8) {
          drawSparkle(p.x, p.y, p.r * 2.2, p.color, alpha * 0.8);
        }
      });

      // Floating Hearts
      floatingHearts.forEach(h => {
        h.y += h.vy;
        h.rot += h.rotSpeed;
        h.pulse += dt * 2.0;

        if (h.y < -40) {
          h.y = ch + 20;
          h.x = Math.random() * cw;
        }

        const alpha = h.alpha * (0.75 + 0.25 * Math.sin(h.pulse));
        ctx.save();
        ctx.translate(h.x, h.y);
        ctx.rotate(h.rot);
        drawHeart(0, 0, h.size, h.color, alpha);
        ctx.restore();
      });

      // Confetti Fireworks in Finale
      if (isFinale) {
        confettiPieces.forEach(c => {
          c.x += c.vx;
          c.y += c.vy;
          c.rot += c.rotSpeed;

          if (c.y > ch + 20) {
            c.y = -10;
            c.x = Math.random() * cw;
          }

          ctx.save();
          ctx.translate(c.x, c.y);
          ctx.rotate((c.rot * Math.PI) / 180);
          ctx.fillStyle = c.color;
          ctx.globalAlpha = 0.85;
          ctx.fillRect(-c.w / 2, -c.h / 2, c.w, c.h);
          ctx.restore();
        });
      }
    }

    // Draw Ambient Blurred Backdrop from image
    function drawBlurredBackdrop(img, progress, sceneAlpha = 1.0) {
      if (!img || !img.complete || img.naturalWidth === 0) {
        ctx.fillStyle = '#1e0a22';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        return;
      }

      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, sceneAlpha));

      const cw = canvas.width;
      const ch = canvas.height;
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;

      // Scale to cover completely + 15% for slow zoom
      const baseScale = Math.max(cw / iw, ch / ih);
      const scale = baseScale * (1.12 + Math.sin(progress * Math.PI) * 0.05);

      const dw = iw * scale;
      const dh = ih * scale;
      const dx = (cw - dw) / 2;
      const dy = (ch - dh) / 2;

      ctx.drawImage(img, dx, dy, dw, dh);

      // Deep romantic color wash over backdrop
      const overlayGrad = ctx.createLinearGradient(0, 0, cw, ch);
      overlayGrad.addColorStop(0, 'rgba(42, 13, 38, 0.78)');
      overlayGrad.addColorStop(0.5, 'rgba(24, 7, 26, 0.82)');
      overlayGrad.addColorStop(1, 'rgba(12, 3, 14, 0.88)');
      ctx.fillStyle = overlayGrad;
      ctx.fillRect(0, 0, cw, ch);

      ctx.restore();
    }

    // Draw Portrait Masterpiece Card with Face Tracking
    function drawPortraitShowcase(img, scene, progress, sceneAlpha = 1.0) {
      if (!img || !img.complete || img.naturalWidth === 0) return;

      const cw = canvas.width;
      const ch = canvas.height;
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;

      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, sceneAlpha));

      // Calculate luxury portrait frame size
      const maxCardH = 490;
      const aspect = iw / ih;
      let cardH = maxCardH;
      let cardW = cardH * aspect;
      if (cardW > 540) {
        cardW = 540;
        cardH = cardW / aspect;
      }
      if (cardW < 340) {
        cardW = 340;
        cardH = Math.min(maxCardH, cardW / aspect);
      }

      // Motion kinematics (smooth gentle zoom & float)
      let scaleMotion = 1.0;
      let rotMotion = 0.0;
      let yOffset = 0.0;

      if (scene.pan === 'zoom-in') {
        scaleMotion = 0.98 + progress * 0.06;
        rotMotion = (progress - 0.5) * 0.02;
      } else if (scene.pan === 'zoom-out') {
        scaleMotion = 1.04 - progress * 0.06;
        rotMotion = (0.5 - progress) * 0.02;
      } else if (scene.pan === 'pan-up') {
        scaleMotion = 1.0;
        yOffset = (1 - progress) * 16 - 8;
        rotMotion = 0.01;
      } else if (scene.pan === 'pan-left') {
        scaleMotion = 1.01;
        rotMotion = (progress - 0.5) * 0.025;
      } else {
        scaleMotion = 0.99 + Math.sin(progress * Math.PI) * 0.03;
        rotMotion = -0.01;
      }

      const cardCenterX = cw / 2;
      const cardCenterY = ch * 0.44 + yOffset;

      ctx.translate(cardCenterX, cardCenterY);
      ctx.rotate(rotMotion);
      ctx.scale(scaleMotion, scaleMotion);

      const halfW = cardW / 2;
      const halfH = cardH / 2;

      // Card Shadow & Ambient Glow
      ctx.shadowColor = 'rgba(0, 0, 0, 0.75)';
      ctx.shadowBlur = 32;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 16;

      // Rounded photo clip path
      ctx.beginPath();
      ctx.roundRect(-halfW, -halfH, cardW, cardH, 20);
      ctx.fillStyle = '#150618';
      ctx.fill();

      ctx.save();
      ctx.clip();

      // Render image inside card with face centering
      const fInfo = FACE_MAP[decodeURIComponent(scene.src.split('/').pop())] || { fx: 0.5, fy: 0.35 };
      const cardScale = Math.max(cardW / iw, cardH / ih);
      const imgDW = iw * cardScale;
      const imgDH = ih * cardScale;

      // Anchor face at ~32% from top of card
      let imgDY = (cardH * 0.32) - (fInfo.fy * ih * cardScale);
      imgDY = Math.min(0, Math.max(cardH - imgDH, imgDY));
      const imgDX = (cardW - imgDW) / 2;

      ctx.drawImage(img, -halfW + imgDX, -halfH + imgDY, imgDW, imgDH);

      // Soft bottom darkening inside the photo for elegance
      const innerVig = ctx.createLinearGradient(0, halfH - 120, 0, halfH);
      innerVig.addColorStop(0, 'rgba(0,0,0,0)');
      innerVig.addColorStop(1, 'rgba(15, 4, 18, 0.55)');
      ctx.fillStyle = innerVig;
      ctx.fillRect(-halfW, halfH - 120, cardW, 120);

      // Subtle light sheen sweep across the photo
      const sheenX = -cardW + progress * (cardW * 2.8);
      const sheenGrad = ctx.createLinearGradient(sheenX, -halfH, sheenX + 80, halfH);
      sheenGrad.addColorStop(0, 'rgba(255,255,255,0)');
      sheenGrad.addColorStop(0.5, 'rgba(255,255,255,0.14)');
      sheenGrad.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = sheenGrad;
      ctx.fillRect(-halfW, -halfH, cardW, cardH);

      ctx.restore();

      // Luxury Golden Champagne Border
      ctx.shadowColor = 'rgba(243, 201, 139, 0.45)';
      ctx.shadowBlur = 18;
      ctx.strokeStyle = 'rgba(243, 201, 139, 0.85)';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Outer delicate rose accent ring
      ctx.strokeStyle = 'rgba(230, 133, 164, 0.35)';
      ctx.lineWidth = 1.0;
      ctx.strokeRect(-halfW - 4, -halfH - 4, cardW + 8, cardH + 8);

      ctx.restore();
    }

    // Render Scene 1: Overture Intro (0.0s - 4.2s)
    function drawSceneIntro(scene, time, alpha = 1.0) {
      const cw = canvas.width;
      const ch = canvas.height;
      const progress = Math.max(0, Math.min(1, (time - scene.start) / (scene.end - scene.start)));
      const img = loadedImages[scene.previewSrc];

      // Draw faint ambient background
      if (img && img.complete) {
        drawBlurredBackdrop(img, progress, alpha * 0.9);
      } else {
        const bgGrad = ctx.createRadialGradient(cw / 2, ch * 0.45, 80, cw / 2, ch * 0.5, cw * 0.75);
        bgGrad.addColorStop(0, '#532549');
        bgGrad.addColorStop(0.5, '#2b1228');
        bgGrad.addColorStop(1, '#110514');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, cw, ch);
      }

      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, alpha));

      // Central Heartbeat Locket Preview of Ragsss
      const portalY = ch * 0.36;
      const portalRadius = 86;
      const heartPulse = 1.0 + Math.sin(progress * Math.PI * 5) * 0.035;

      // Rotating celestial rings
      ctx.save();
      ctx.translate(cw / 2, portalY);
      ctx.rotate(progress * 0.5);

      ctx.strokeStyle = 'rgba(243, 201, 139, 0.35)';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.arc(0, 0, portalRadius + 16, 0, Math.PI * 2);
      ctx.stroke();

      ctx.setLineDash([8, 14]);
      ctx.strokeStyle = 'rgba(230, 133, 164, 0.45)';
      ctx.beginPath();
      ctx.arc(0, 0, portalRadius + 26, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // Portrait Circle Clip with Golden Rim
      if (img && img.complete) {
        ctx.save();
        ctx.translate(cw / 2, portalY);
        ctx.scale(heartPulse, heartPulse);

        ctx.shadowColor = 'rgba(243, 201, 139, 0.7)';
        ctx.shadowBlur = 28;

        ctx.beginPath();
        ctx.arc(0, 0, portalRadius, 0, Math.PI * 2);
        ctx.fillStyle = '#220b24';
        ctx.fill();

        ctx.save();
        ctx.clip();
        const fInfo = FACE_MAP['WhatsApp Image 2026-11-22 at 9.43.49 AM.jpeg'] || { fx: 0.38, fy: 0.44 };
        const pScale = (portalRadius * 2.6) / Math.min(img.naturalWidth, img.naturalHeight);
        const pDW = img.naturalWidth * pScale;
        const pDH = img.naturalHeight * pScale;
        const pDX = -portalRadius - (fInfo.fx * pDW - portalRadius);
        const pDY = -portalRadius - (fInfo.fy * pDH - portalRadius);
        ctx.drawImage(img, pDX, pDY, pDW, pDH);
        ctx.restore();

        // Golden Frame
        ctx.strokeStyle = '#f3c98b';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.arc(0, 0, portalRadius, 0, Math.PI * 2);
        ctx.stroke();

        ctx.restore();
      }

      // Sparkles around portal
      drawSparkle(cw / 2 - portalRadius - 20, portalY - 30, 7, '#ffd166', alpha);
      drawSparkle(cw / 2 + portalRadius + 24, portalY + 25, 6, '#ffa8c5', alpha);

      // Intro Typography
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Top Tag Badge
      const badgeY = ch * 0.16;
      ctx.fillStyle = 'rgba(243, 201, 139, 0.15)';
      ctx.strokeStyle = 'rgba(243, 201, 139, 0.55)';
      ctx.lineWidth = 1.5;
      const badgeW = 310;
      const badgeH = 32;
      ctx.beginPath();
      ctx.roundRect(cw / 2 - badgeW / 2, badgeY - badgeH / 2, badgeW, badgeH, 16);
      ctx.fill();
      ctx.stroke();

      ctx.font = '700 12px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#f3c98b';
      ctx.letterSpacing = '3px';
      ctx.fillText(scene.badge, cw / 2, badgeY + 1);

      // Headline "HAPPY BIRTHDAY"
      ctx.font = '700 34px "Playfair Display", Georgia, serif';
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = 'rgba(230, 133, 164, 0.6)';
      ctx.shadowBlur = 18;
      ctx.fillText(scene.title, cw / 2, ch * 0.63);

      // Shimmering Calligraphy "MY EVERYTHING"
      ctx.font = '800 62px "Playfair Display", Georgia, serif';
      const textGrad = ctx.createLinearGradient(cw / 2 - 240, 0, cw / 2 + 240, 0);
      textGrad.addColorStop(0, '#ffd8a8');
      textGrad.addColorStop(0.5, '#f5c687');
      textGrad.addColorStop(1, '#ffa8c5');
      ctx.fillStyle = textGrad;
      ctx.shadowColor = 'rgba(243, 201, 139, 0.85)';
      ctx.shadowBlur = 32;
      ctx.fillText(scene.highlight, cw / 2, ch * 0.74);

      // Subtitle
      ctx.shadowBlur = 0;
      ctx.font = '500 18px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = 'rgba(255, 235, 245, 0.9)';
      ctx.fillText(scene.sub, cw / 2, ch * 0.84);

      // Date stamp
      ctx.font = '600 15px "Playfair Display", serif';
      ctx.fillStyle = '#f3c98b';
      ctx.letterSpacing = '4px';
      ctx.fillText('✦   ' + scene.date + '   ✦', cw / 2, ch * 0.91);

      ctx.restore();
    }

    // Render Scene 2-7: Photo Showcases (4.0s - 25.4s)
    function drawScenePhoto(scene, time, alpha = 1.0) {
      const cw = canvas.width;
      const ch = canvas.height;
      const progress = Math.max(0, Math.min(1, (time - scene.start) / (scene.end - scene.start)));
      const img = loadedImages[scene.src];

      // Draw Atmospheric Blurred Background
      drawBlurredBackdrop(img, progress, alpha);

      // Draw Main Portrait Subject Card with Face Centering
      drawPortraitShowcase(img, scene, progress, alpha);

      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, alpha));

      // Top Luxury Tag Banner: "HAPPY BIRTHDAY MY EVERYTHING"
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const topY = 46;

      ctx.fillStyle = 'rgba(18, 6, 20, 0.78)';
      ctx.strokeStyle = 'rgba(243, 201, 139, 0.5)';
      ctx.lineWidth = 1.5;
      const topW = 340;
      const topH = 32;
      ctx.beginPath();
      ctx.roundRect(cw / 2 - topW / 2, topY - topH / 2, topW, topH, 16);
      ctx.fill();
      ctx.stroke();

      ctx.font = '700 12px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#f3c98b';
      ctx.letterSpacing = '3px';
      ctx.fillText('✦  HAPPY BIRTHDAY MY EVERYTHING  ✦', cw / 2, topY + 1);

      // Bottom Glass Card with Photo Title & Romantic Caption
      const cardW = Math.min(cw * 0.68, 660);
      const cardH = 92;
      const cardX = (cw - cardW) / 2;
      const cardY = ch - cardH - 24;

      // Frosted Glass Background
      ctx.fillStyle = 'rgba(16, 5, 18, 0.88)';
      ctx.strokeStyle = 'rgba(243, 201, 139, 0.35)';
      ctx.lineWidth = 1.5;
      ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
      ctx.shadowBlur = 24;
      ctx.beginPath();
      ctx.roundRect(cardX, cardY, cardW, cardH, 18);
      ctx.fill();
      ctx.stroke();

      // Glass Content
      ctx.shadowBlur = 0;
      ctx.textAlign = 'center';

      // Scene Tag Pill
      const tagPillY = cardY + 22;
      ctx.font = '700 11px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#f3c98b';
      ctx.letterSpacing = '2px';
      ctx.fillText('✦ ' + scene.tag + ' ✦', cw / 2, tagPillY);

      // Title
      ctx.font = '700 24px "Playfair Display", Georgia, serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(scene.title, cw / 2, cardY + 48);

      // Subtitle
      ctx.font = '500 14px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#ffd4e2';
      ctx.fillText(scene.sub, cw / 2, cardY + 74);

      ctx.restore();
    }

    // Render Scene 8: Grand Golden Stardust Celebration Finale (25.0s - 30.0s)
    function drawSceneFinale(scene, time, alpha = 1.0) {
      const cw = canvas.width;
      const ch = canvas.height;
      const progress = Math.max(0, Math.min(1, (time - scene.start) / (scene.end - scene.start)));
      const img = loadedImages[scene.src];

      // Draw faint photo in background
      if (img && img.complete) {
        drawBlurredBackdrop(img, progress, alpha * 0.7);
      }

      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, alpha));

      // Deep celebration radial overlay
      const finGrad = ctx.createRadialGradient(cw / 2, ch / 2, 60, cw / 2, ch / 2, cw * 0.75);
      finGrad.addColorStop(0, 'rgba(74, 25, 68, 0.9)');
      finGrad.addColorStop(0.5, 'rgba(38, 12, 36, 0.95)');
      finGrad.addColorStop(1, 'rgba(14, 4, 16, 0.98)');
      ctx.fillStyle = finGrad;
      ctx.fillRect(0, 0, cw, ch);

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Top Golden Badge
      const topBadgeY = ch * 0.16;
      ctx.fillStyle = 'rgba(243, 201, 139, 0.16)';
      ctx.strokeStyle = 'rgba(243, 201, 139, 0.6)';
      ctx.lineWidth = 1.5;
      const bW = 280;
      const bH = 32;
      ctx.beginPath();
      ctx.roundRect(cw / 2 - bW / 2, topBadgeY - bH / 2, bW, bH, 16);
      ctx.fill();
      ctx.stroke();

      ctx.font = '700 12px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#f3c98b';
      ctx.letterSpacing = '3px';
      ctx.fillText(scene.badge, cw / 2, topBadgeY + 1);

      // "HAPPY BIRTHDAY"
      ctx.font = '700 36px "Playfair Display", Georgia, serif';
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = 'rgba(230, 133, 164, 0.6)';
      ctx.shadowBlur = 18;
      ctx.fillText(scene.title, cw / 2, ch * 0.28);

      // "MY EVERYTHING"
      ctx.font = '800 64px "Playfair Display", Georgia, serif';
      const textGrad = ctx.createLinearGradient(cw / 2 - 250, 0, cw / 2 + 250, 0);
      textGrad.addColorStop(0, '#fde2aa');
      textGrad.addColorStop(0.5, '#f7b2c7');
      textGrad.addColorStop(1, '#fde2aa');
      ctx.fillStyle = textGrad;
      ctx.shadowColor = 'rgba(243, 201, 139, 0.95)';
      ctx.shadowBlur = 34;
      ctx.fillText(scene.highlight, cw / 2, ch * 0.41);

      // Script Name: "En Ragsss ♡"
      ctx.shadowBlur = 16;
      ctx.shadowColor = 'rgba(230, 133, 164, 0.7)';
      ctx.font = '700 38px "Dancing Script", cursive, serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(scene.name, cw / 2, ch * 0.54);

      // Heartfelt Birthday Wishes
      ctx.shadowBlur = 0;
      ctx.font = '500 18px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#fce4ec';
      ctx.fillText(scene.sub, cw / 2, ch * 0.66);

      // Signature: "Always by your side — Gokul ♡"
      ctx.font = '600 20px "Dancing Script", cursive, serif';
      ctx.fillStyle = '#f3c98b';
      ctx.fillText(scene.signature, cw / 2, ch * 0.76);

      // Date
      ctx.font = '600 15px "Playfair Display", serif';
      ctx.fillStyle = '#f3c98b';
      ctx.letterSpacing = '4px';
      ctx.fillText('✦   ' + scene.date + '   ✦', cw / 2, ch * 0.86);

      ctx.restore();
    }

    // Helper to render any scene
    function renderScene(scene, time, alpha) {
      if (scene.type === 'intro') {
        drawSceneIntro(scene, time, alpha);
      } else if (scene.type === 'photo') {
        drawScenePhoto(scene, time, alpha);
      } else if (scene.type === 'finale') {
        drawSceneFinale(scene, time, alpha);
      }
    }

    // Main Frame Dispatcher with Smooth Cross-Dissolve
    function drawFrame(time) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const t = Math.max(0, Math.min(DURATION, time));
      const activeScenes = SCENES.filter(s => t >= s.start && t <= s.end);

      if (activeScenes.length === 1) {
        renderScene(activeScenes[0], t, 1.0);
      } else if (activeScenes.length >= 2) {
        // Cross-dissolve between outgoing and incoming scenes
        const s1 = activeScenes[0];
        const s2 = activeScenes[1];
        const overlapDuration = s1.end - s2.start;
        const blendProgress = Math.max(0, Math.min(1, (t - s2.start) / (overlapDuration || 0.4)));

        renderScene(s1, t, 1.0 - blendProgress);
        renderScene(s2, t, blendProgress);
      } else {
        // Fallback
        const lastScene = SCENES[SCENES.length - 1];
        renderScene(lastScene, t, 1.0);
      }

      // Draw Atmospheric Overlays & Particles
      drawCinematicOverlays(t);
      const isFinaleActive = t >= 25.0;
      drawParticles(0.016, isFinaleActive);
    }

    // UI Updates (Timecode & Scrubber)
    function updateUI() {
      if (timeDisplay) {
        timeDisplay.textContent = formatTime(currentTime) + ' / 0:30';
      }
      const pct = (currentTime / DURATION) * 100;
      if (scrubProg) scrubProg.style.width = pct + '%';
      if (scrubHandle) scrubHandle.style.left = pct + '%';
      if (scrubTrack) {
        scrubTrack.setAttribute('aria-valuenow', Math.floor(currentTime).toString());
      }
    }

    // Animation Render Loop
    function loop(timestamp) {
      if (!isPlaying) return;
      if (!lastTimestamp) lastTimestamp = timestamp;
      const dt = (timestamp - lastTimestamp) / 1000;
      lastTimestamp = timestamp;

      currentTime += dt;

      // When 30 seconds finish: STOP! Do NOT loop or replay audio!
      if (currentTime >= DURATION) {
        currentTime = DURATION;
        pauseVideo();
        if (bgAudio) {
          try {
            bgAudio.pause();
            bgAudio.currentTime = 0;
          } catch (e) {}
        }
        drawFrame(DURATION);
        updateUI();
        return;
      }

      drawFrame(currentTime);
      updateUI();
      requestAnimationFrame(loop);
    }

    function playVideo() {
      // If reaching the end and playing again, reset to start
      if (currentTime >= DURATION) {
        currentTime = 0.0;
      }
      isPlaying = true;
      lastTimestamp = 0;
      if (wrapper) wrapper.classList.add('is-playing');
      if (bigPlayBtn) bigPlayBtn.style.display = 'none';
      if (ctrlPlayBtn) {
        ctrlPlayBtn.innerHTML = `
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <rect x="6" y="4" width="4" height="16"></rect>
            <rect x="14" y="4" width="4" height="16"></rect>
          </svg>`;
      }
      if (bgAudio && !isMuted) {
        bgAudio.play().catch(() => {});
      }
      requestAnimationFrame(loop);
    }

    function pauseVideo() {
      isPlaying = false;
      if (wrapper) wrapper.classList.remove('is-playing');
      if (bigPlayBtn) bigPlayBtn.style.display = 'flex';
      if (ctrlPlayBtn) {
        ctrlPlayBtn.innerHTML = `
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <polygon points="6 4 20 12 6 20 6 4"></polygon>
          </svg>`;
      }
    }

    function togglePlay() {
      if (isPlaying) pauseVideo();
      else playVideo();
    }

    // Seek helper
    function seekTo(targetSec) {
      currentTime = Math.max(0, Math.min(DURATION, targetSec));
      drawFrame(currentTime);
      updateUI();
      if (bgAudio && !isMuted) {
        try {
          bgAudio.currentTime = currentTime % (bgAudio.duration || 30);
        } catch (e) {}
      }
    }

    // Event Listeners
    if (bigPlayBtn) bigPlayBtn.addEventListener('click', togglePlay);
    if (ctrlPlayBtn) ctrlPlayBtn.addEventListener('click', togglePlay);
    if (screen) {
      screen.addEventListener('click', (e) => {
        if (e.target === bigPlayBtn || bigPlayBtn.contains(e.target)) return;
        togglePlay();
      });
    }

    // Scrubber Interactions
    function handleScrub(e) {
      if (!scrubTrack) return;
      const rect = scrubTrack.getBoundingClientRect();
      const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      const offsetX = Math.max(0, Math.min(rect.width, clientX - rect.left));
      const targetSec = (offsetX / rect.width) * DURATION;
      seekTo(targetSec);
    }

    if (scrubTrack) {
      scrubTrack.addEventListener('mousedown', (e) => {
        isScrubbing = true;
        handleScrub(e);
      });
      window.addEventListener('mousemove', (e) => {
        if (isScrubbing) handleScrub(e);
      });
      window.addEventListener('mouseup', () => {
        isScrubbing = false;
      });

      // Touch events for mobile
      scrubTrack.addEventListener('touchstart', (e) => {
        isScrubbing = true;
        handleScrub(e);
      }, { passive: true });
      window.addEventListener('touchmove', (e) => {
        if (isScrubbing) handleScrub(e);
      }, { passive: true });
      window.addEventListener('touchend', () => {
        isScrubbing = false;
      });
    }

    // Audio & Fullscreen Buttons
    if (muteBtn) {
      muteBtn.addEventListener('click', () => {
        isMuted = !isMuted;
        if (isMuted) {
          if (bgAudio) bgAudio.pause();
          muteBtn.innerHTML = `
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor"></polygon>
              <line x1="23" y1="9" x2="17" y2="15"></line>
              <line x1="17" y1="9" x2="23" y2="15"></line>
            </svg>`;
        } else {
          if (bgAudio && isPlaying) bgAudio.play().catch(() => {});
          muteBtn.innerHTML = `
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor"></polygon>
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
            </svg>`;
        }
      });
    }

    if (fullscreenBtn && wrapper) {
      fullscreenBtn.addEventListener('click', () => {
        if (!document.fullscreenElement) {
          wrapper.requestFullscreen().catch(() => {});
        } else {
          document.exitFullscreen().catch(() => {});
        }
      });
    }

    // Initial draw frame 0
    setTimeout(() => {
      drawFrame(0);
      updateUI();
    }, 120);
  }

  // Auto-init on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBirthdayVideo);
  } else {
    initBirthdayVideo();
  }
})();
