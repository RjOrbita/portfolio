/**
 * particles.js — Canvas-based interactive particle constellation background
 * Used in the Hero section of Roland Jay Orbita's portfolio
 */
(function () {
  'use strict';

  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  // Configuration
  const CONFIG = {
    particleCount: 80,
    maxDistance: 130,
    particleRadius: 1.8,
    speed: 0.4,
    colors: {
      dark: {
        particle: 'rgba(124, 58, 237, ',   // purple with alpha
        particle2: 'rgba(6, 182, 212, ',    // cyan with alpha
        line: 'rgba(124, 58, 237, ',
      },
      light: {
        particle: 'rgba(124, 58, 237, ',
        particle2: 'rgba(6, 182, 212, ',
        line: 'rgba(124, 58, 237, ',
      }
    }
  };

  let particles = [];
  let animationId;
  let mouse = { x: null, y: null, radius: 120 };

  // Resize canvas
  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  // Particle class
  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x  = Math.random() * canvas.width;
      this.y  = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * CONFIG.speed;
      this.vy = (Math.random() - 0.5) * CONFIG.speed;
      this.radius = Math.random() * CONFIG.particleRadius + 0.8;
      this.type   = Math.random() > 0.5 ? 'purple' : 'cyan';
      this.alpha  = Math.random() * 0.5 + 0.3;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;

      // Mouse repulsion
      if (mouse.x !== null && mouse.y !== null) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.x += dx * force * 0.03;
          this.y += dy * force * 0.03;
        }
      }

      // Bounce off edges
      if (this.x < 0 || this.x > canvas.width)  this.vx *= -1;
      if (this.y < 0 || this.y > canvas.height)  this.vy *= -1;

      // Clamp
      this.x = Math.max(0, Math.min(canvas.width, this.x));
      this.y = Math.max(0, Math.min(canvas.height, this.y));
    }
    draw() {
      const colorStr = this.type === 'purple'
        ? 'rgba(124, 58, 237, '
        : 'rgba(6, 182, 212, ';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = colorStr + this.alpha + ')';
      ctx.fill();
    }
  }

  // Init particles
  function init() {
    particles = [];
    const count = Math.min(
      CONFIG.particleCount,
      Math.floor((canvas.width * canvas.height) / 12000)
    );
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }

  // Draw connecting lines
  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONFIG.maxDistance) {
          const alpha = (1 - dist / CONFIG.maxDistance) * 0.35;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = 'rgba(124, 58, 237, ' + alpha + ')';
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
  }

  // Animation loop
  function animate() {
    animationId = requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    drawLines();
  }

  // Mouse interaction
  window.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  // Handle resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      cancelAnimationFrame(animationId);
      resize();
      init();
      animate();
    }, 200);
  });

  // Start
  resize();
  init();
  animate();
})();
