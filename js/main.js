/* ============================================================
   FAREWELL — FOR ZARIN MA'AM
   main.js · Animations & Interactions
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. STAR FIELD ───────────────────────────────────────── */
  const starsContainer = document.getElementById('stars');
  const starCount = 90;

  for (let i = 0; i < starCount; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    const size = Math.random() * 2.5 + 0.5;
    star.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      --dur: ${Math.random() * 4 + 3}s;
      --delay: ${Math.random() * 6}s;
      --op: ${Math.random() * 0.5 + 0.2};
    `;
    starsContainer.appendChild(star);
  }

  /* ── 2. FALLING PETALS CANVAS ────────────────────────────── */
  const canvas  = document.getElementById('petals-canvas');
  const ctx     = canvas.getContext('2d');
  let W = canvas.width  = window.innerWidth;
  let H = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  });

  // Petal shapes & colours
  const petalColors = [
    'rgba(212,116,140,',   // rose
    'rgba(201,150,58,',    // gold
    'rgba(242,179,196,',   // rose-lt
    'rgba(78,158,166,',    // teal
    'rgba(232,185,106,',   // gold-lt
  ];

  class Petal {
    constructor () { this.reset(true); }

    reset (initial = false) {
      this.x    = Math.random() * W;
      this.y    = initial ? Math.random() * H : -20;
      this.r    = Math.random() * 6 + 4;
      this.vy   = Math.random() * 0.8 + 0.3;
      this.vx   = (Math.random() - 0.5) * 0.6;
      this.rot  = Math.random() * Math.PI * 2;
      this.vrot = (Math.random() - 0.5) * 0.02;
      this.alpha= Math.random() * 0.35 + 0.1;
      this.col  = petalColors[Math.floor(Math.random() * petalColors.length)];
      this.swing = Math.random() * Math.PI * 2; // phase
    }

    update () {
      this.swing += 0.012;
      this.x  += this.vx + Math.sin(this.swing) * 0.4;
      this.y  += this.vy;
      this.rot += this.vrot;
      if (this.y > H + 20) this.reset();
    }

    draw () {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rot);
      ctx.globalAlpha = this.alpha;
      ctx.fillStyle   = this.col + this.alpha + ')';
      ctx.beginPath();
      ctx.ellipse(0, 0, this.r, this.r * 0.55, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  const petals = Array.from({ length: 38 }, () => new Petal());

  function animatePetals () {
    ctx.clearRect(0, 0, W, H);
    petals.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animatePetals);
  }
  animatePetals();

  /* ── 3. SCROLL REVEAL ────────────────────────────────────── */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.12 }
  );

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  /* ── 4. LETTER PAPER — staggered paragraph reveal ───────── */
  const letterPapers = document.querySelectorAll('.letter-paper');
  const letterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const paras = entry.target.querySelectorAll('.letter-body p, .letter-salutation, .letter-date, .letter-closing, .letter-signature, .letter-class');
          paras.forEach((el, i) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = `opacity 0.7s ease ${i * 0.12}s, transform 0.7s ease ${i * 0.12}s`;
            setTimeout(() => {
              el.style.opacity = '1';
              el.style.transform = 'translateY(0)';
            }, 80 + i * 120);
          });
          letterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );
  letterPapers.forEach(lp => letterObserver.observe(lp));

  /* ── 5. HERO PARALLAX ────────────────────────────────────── */
  const hero     = document.querySelector('.hero');
  const heroGlow = document.querySelector('.hero-glow');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (hero) {
      hero.style.transform = `translateY(${scrollY * 0.3}px)`;
    }
    if (heroGlow) {
      heroGlow.style.transform = `translate(-50%, calc(-50% + ${scrollY * 0.15}px))`;
    }
  }, { passive: true });

  /* ── 6. CARD HOVER — subtle 3-D tilt ────────────────────── */
  document.querySelectorAll('.memory-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const cx   = rect.left + rect.width  / 2;
      const cy   = rect.top  + rect.height / 2;
      const dx   = (e.clientX - cx) / (rect.width  / 2);
      const dy   = (e.clientY - cy) / (rect.height / 2);
      card.style.transform = `translateY(-6px) rotateY(${dx * 5}deg) rotateX(${-dy * 5}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  /* ── 7. FLOWER BURST — triggered when farewell is visible ── */
  const farewellSection = document.querySelector('.farewell-section');
  const flowerBurst     = document.getElementById('flowerBurst');
  const flowerEmojis    = ['🌸','🌼','🌺','✨','💐','🌷','⭐','🌻','💛','🩷'];
  let   burstFired      = false;

  const farewellObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !burstFired) {
          burstFired = true;
          triggerBurst();
        }
      });
    },
    { threshold: 0.3 }
  );
  if (farewellSection) farewellObserver.observe(farewellSection);

  function triggerBurst () {
    const count = 30;
    for (let i = 0; i < count; i++) {
      const angle  = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.3;
      const dist   = Math.random() * 280 + 80;
      const emoji  = flowerEmojis[Math.floor(Math.random() * flowerEmojis.length)];
      const petal  = document.createElement('div');
      petal.className = 'flower-petal';
      petal.textContent = emoji;
      const tx = Math.cos(angle) * dist;
      const ty = -(Math.sin(angle) * dist + 80);
      const rot = `${(Math.random() - 0.5) * 720}deg`;
      const delay = `${Math.random() * 0.4}s`;
      const dur   = `${Math.random() * 1.2 + 0.8}s`;
      petal.style.cssText = `
        --tx: ${tx}px;
        --ty: ${ty}px;
        --rot: ${rot};
        --dur: ${dur};
        --delay: ${delay};
      `;
      flowerBurst.appendChild(petal);
      // Remove after animation
      setTimeout(() => petal.remove(), (parseFloat(dur) + parseFloat(delay)) * 1000 + 100);
    }
    // Repeat a second smaller burst
    setTimeout(() => {
      burstFired = false; // allow one more
      burstFired = true;
      const count2 = 16;
      for (let i = 0; i < count2; i++) {
        const angle  = (Math.PI * 2 * i) / count2 + (Math.random() - 0.5) * 0.5;
        const dist   = Math.random() * 160 + 40;
        const emoji  = flowerEmojis[Math.floor(Math.random() * flowerEmojis.length)];
        const petal  = document.createElement('div');
        petal.className = 'flower-petal';
        petal.textContent = emoji;
        const tx   = Math.cos(angle) * dist;
        const ty   = -(Math.sin(angle) * dist + 40);
        const rot  = `${(Math.random() - 0.5) * 540}deg`;
        petal.style.cssText = `
          --tx: ${tx}px;
          --ty: ${ty}px;
          --rot: ${rot};
          --dur: 1.1s;
          --delay: ${Math.random() * 0.3}s;
        `;
        flowerBurst.appendChild(petal);
        setTimeout(() => petal.remove(), 1500);
      }
    }, 900);
  }

  /* ── 8. SMOOTH ACTIVE CURSOR (subtle golden ring) ───────── */
  const cursor = document.createElement('div');
  cursor.style.cssText = `
    position: fixed;
    width: 28px; height: 28px;
    border: 1.5px solid rgba(201,150,58,0.5);
    border-radius: 50%;
    pointer-events: none;
    z-index: 9999;
    transition: transform 0.12s ease, opacity 0.3s ease;
    transform: translate(-50%, -50%);
    top: 0; left: 0;
    mix-blend-mode: multiply;
  `;
  document.body.appendChild(cursor);

  let mx = 0, my = 0;
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  });

  document.querySelectorAll('a, button, .memory-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(1.8)';
      cursor.style.borderColor = 'rgba(212,116,140,0.7)';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(1)';
      cursor.style.borderColor = 'rgba(201,150,58,0.5)';
    });
  });

  /* ── 9. PAGE LOAD — orchestrate initial stagger ─────────── */
  document.querySelectorAll('.fade-in-up').forEach(el => {
    el.style.animationPlayState = 'running';
  });

  /* ── 10. QUOTE section — text shimmer on scroll entry ───── */
  const bigQuote = document.querySelector('.big-quote');
  const quoteObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          bigQuote.style.transition = 'opacity 1.2s ease, transform 1.2s cubic-bezier(0.16,1,0.3,1)';
        }
      });
    },
    { threshold: 0.3 }
  );
  if (bigQuote) quoteObserver.observe(bigQuote);

});
