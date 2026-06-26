/**
 * typing.js — Typing animation for the Hero section
 * Cycles through a list of roles with a realistic type/erase effect
 */
(function () {
  'use strict';

  const typingEl = document.getElementById('typing-text');
  if (!typingEl) return;

  const ROLES = [
    ' AI Assisted Coder',
    ' Esports Enthusiast',
    ' Learner',
    ' Team Player',
    ' Creative Problem Solver',
    ' Web and App Developer',
    'AI Enthusiast',
  ];

  const CONFIG = {
    typeSpeed: 85,   // ms per character typed
    eraseSpeed: 45,   // ms per character erased
    pauseAfterType: 1800, // ms to wait after fully typing
    pauseAfterErase: 400,  // ms to wait after fully erasing
  };

  let roleIndex = 0;
  let charIndex = 0;
  let isTyping = true;
  let timeoutId = null;

  function type() {
    const currentRole = ROLES[roleIndex];

    if (isTyping) {
      // --- TYPING phase ---
      typingEl.textContent = currentRole.slice(0, charIndex + 1);
      charIndex++;

      if (charIndex === currentRole.length) {
        // Finished typing — pause then erase
        isTyping = false;
        timeoutId = setTimeout(type, CONFIG.pauseAfterType);
      } else {
        timeoutId = setTimeout(type, CONFIG.typeSpeed);
      }
    } else {
      // --- ERASING phase ---
      typingEl.textContent = currentRole.slice(0, charIndex - 1);
      charIndex--;

      if (charIndex === 0) {
        // Finished erasing — move to next role
        isTyping = true;
        roleIndex = (roleIndex + 1) % ROLES.length;
        timeoutId = setTimeout(type, CONFIG.pauseAfterErase);
      } else {
        timeoutId = setTimeout(type, CONFIG.eraseSpeed);
      }
    }
  }

  // Start after a short delay for dramatic effect
  timeoutId = setTimeout(type, 800);
})();
