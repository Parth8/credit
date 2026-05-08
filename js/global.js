// ========================================
// DECODING CREDIT CARDS — Engine v2
// ========================================

// NAV SCROLL STATE
const nav = document.querySelector('.site-nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  });
}

// REVEAL ON SCROLL
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = parseInt(entry.target.dataset.delay) || 0;
      setTimeout(() => entry.target.classList.add('visible'), delay);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// CONFETTI BURST (used for completions)
function burstConfetti(x, y) {
  const colors = ['#2563EB', '#EA580C', '#16A34A', '#B45309', '#DC2626'];
  const count = 24;

  for (let i = 0; i < count; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.left = x + 'px';
    piece.style.top = y + 'px';
    piece.style.transform = `rotate(${Math.random() * 360}deg)`;
    document.body.appendChild(piece);

    const angle = (Math.PI * 2 * i) / count + (Math.random() * 0.5);
    const velocity = 100 + Math.random() * 200;
    const dx = Math.cos(angle) * velocity;
    const dy = Math.sin(angle) * velocity - 100;

    piece.animate([
      { transform: `translate(0, 0) rotate(0deg)`, opacity: 1 },
      { transform: `translate(${dx}px, ${dy + 200}px) rotate(${720 * (Math.random() > 0.5 ? 1 : -1)}deg)`, opacity: 0 }
    ], {
      duration: 1200 + Math.random() * 600,
      easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      fill: 'forwards'
    }).onfinish = () => piece.remove();
  }
}

// COMPLETION MODAL
function showCompletion(title, body, ctaText, ctaHref) {
  const burst = document.createElement('div');
  burst.className = 'completion-burst active';
  burst.innerHTML = `
    <div class="completion-inner">
      <div style="font-size:64px;margin-bottom:16px;">✦</div>
      <h2 style="font-family:var(--font-display);font-size:48px;font-weight:900;letter-spacing:-0.02em;margin-bottom:16px;">${title}</h2>
      <p style="font-size:16px;color:var(--ink-muted);max-width:480px;margin:0 auto 32px;line-height:1.6;">${body}</p>
      <div style="display:flex;gap:12px;justify-content:center;">
        <button class="btn btn--ghost" onclick="this.closest('.completion-burst').remove()">Stay here</button>
        <a href="${ctaHref}" class="btn btn--primary btn--lg">${ctaText} →</a>
      </div>
    </div>
  `;
  document.body.appendChild(burst);

  // Confetti
  setTimeout(() => {
    burstConfetti(window.innerWidth / 2, window.innerHeight / 2);
    burstConfetti(window.innerWidth / 3, window.innerHeight / 2);
    burstConfetti(window.innerWidth * 2/3, window.innerHeight / 2);
  }, 200);
}

// NUMBER COUNTER
function animateNumber(el, target, duration = 1200, prefix = '', suffix = '', decimals = 0) {
  const start = performance.now();
  const startVal = 0;
  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = startVal + (target - startVal) * eased;
    el.textContent = prefix + value.toFixed(decimals) + suffix;
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.dataset.counted) {
      entry.target.dataset.counted = '1';
      const target = parseFloat(entry.target.dataset.target);
      const prefix = entry.target.dataset.prefix || '';
      const suffix = entry.target.dataset.suffix || '';
      const decimals = parseInt(entry.target.dataset.decimals) || 0;
      animateNumber(entry.target, target, 1400, prefix, suffix, decimals);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-target]').forEach(el => counterObserver.observe(el));

// SMOOTH HASH SCROLL
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const href = anchor.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// HAPTIC-LIKE FEEDBACK SOUND (optional, very subtle)
function playClick() {
  // Web Audio API tap sound — extremely subtle
  try {
    const ctx = window._audioCtx || (window._audioCtx = new (window.AudioContext || window.webkitAudioContext)());
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.05);
    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  } catch (e) { /* silently fail */ }
}

function playSuccess() {
  try {
    const ctx = window._audioCtx || (window._audioCtx = new (window.AudioContext || window.webkitAudioContext)());
    [523, 659, 784].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.08);
      gain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + i * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.08 + 0.25);
      osc.start(ctx.currentTime + i * 0.08);
      osc.stop(ctx.currentTime + i * 0.08 + 0.3);
    });
  } catch (e) { /* fail silently */ }
}

// Make available globally
window.DCC = { burstConfetti, showCompletion, playClick, playSuccess, animateNumber };

// ============================================================
// CUSTOM CURSOR
// Small dot tracks pointer exactly. Larger ring chases smoothly.
// On interactive elements, ring expands.
// Skip entirely on touch / mobile.
// Whole block wrapped in try so cursor failures never break the page.
// ============================================================
try {
  // Skip on touch devices entirely
  const mm = (q) => (typeof window.matchMedia === 'function') && window.matchMedia(q).matches;
  const isTouch = mm('(hover: none)') || mm('(pointer: coarse)');
  if (!isTouch) {
    // Inject cursor elements if not already present
    let dot = document.getElementById('cursor-dot');
    let trail = document.getElementById('cursor-trail');
    if (!dot) {
      dot = document.createElement('div');
      dot.id = 'cursor-dot';
      dot.className = 'cursor-dot';
      dot.setAttribute('aria-hidden', 'true');
      document.body.appendChild(dot);
    }
    if (!trail) {
      trail = document.createElement('div');
      trail.id = 'cursor-trail';
      trail.className = 'cursor-trail';
      trail.setAttribute('aria-hidden', 'true');
      document.body.appendChild(trail);
    }

    let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
    let trailX = mouseX, trailY = mouseY;
    let active = false;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!active) {
        active = true;
        document.body.classList.add('cursor-active');
        trailX = mouseX;
        trailY = mouseY;
      }
      // Dot follows exactly
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    });

    document.addEventListener('mouseleave', () => {
      document.body.classList.remove('cursor-active');
      active = false;
    });

    document.addEventListener('mousedown', () => document.body.classList.add('cursor-down'));
    document.addEventListener('mouseup', () => document.body.classList.remove('cursor-down'));

    // Hover detection — interactive elements expand the ring
    const hoverSelector = 'a, button, [onclick], input[type="range"], input[type="checkbox"], input[type="radio"], select, textarea, [role="button"], .chapter-item, label';
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest && e.target.closest(hoverSelector)) document.body.classList.add('cursor-hover');
    });
    document.addEventListener('mouseout', (e) => {
      if (e.target.closest && e.target.closest(hoverSelector) && (!e.relatedTarget || !e.relatedTarget.closest || !e.relatedTarget.closest(hoverSelector))) {
        document.body.classList.remove('cursor-hover');
      }
    });

    // Smoothly chase the dot
    function animateCursor() {
      trailX += (mouseX - trailX) * 0.18;
      trailY += (mouseY - trailY) * 0.18;
      trail.style.transform = `translate(${trailX}px, ${trailY}px) translate(-50%, -50%)`;
      requestAnimationFrame(animateCursor);
    }
    animateCursor();
  }
} catch (e) {
  console.warn('Custom cursor disabled:', e.message);
}
