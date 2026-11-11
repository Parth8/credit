// ============================================================
// DECODING CREDIT CARDS — Engine v3  (window.DCC)
// region lens · progress memory · page chrome · shared interactions
// ============================================================
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const store = {
    get(k, d) { try { const v = localStorage.getItem('dcc.' + k); return v === null ? d : JSON.parse(v); } catch { return d; } },
    set(k, v) { try { localStorage.setItem('dcc.' + k, JSON.stringify(v)); } catch { /* private mode */ } }
  };

  // ---------- chapters ----------
  const CH = [
    ['01-the-handshake', 'The Handshake', 'Tap a card. Watch a transaction happen. Meet the five players who get paid every time.', 5],
    ['02-getting-a-card', 'Getting a Card', 'Fill in an application and watch the lender’s model decide — and see which answers moved it.', 6],
    ['03-the-anatomy', 'The Anatomy of a Card', 'Poke every chip, stripe and digit. Learn what each part does and why it is still there.', 5],
    ['04-types-of-cards', 'Types of Cards', 'Secured, charge, prepaid, co-branded, business. Match six people to the card that fits them.', 6],
    ['05-the-billing-cycle', 'The Billing Cycle', 'Move a purchase around the calendar and see how many interest-free days it earns.', 6],
    ['06-the-trap', 'The Minimum Payment Trap', 'A live debt simulator. Drag the sliders and watch the minimum payment eat a decade.', 7],
    ['07-fees', 'Every Fee Explained', 'Trigger each fee yourself and watch exactly when and how it lands on the statement.', 9],
    ['08-the-score', 'Your Credit Score', 'Change your habits and watch the score react. See which factors really move it.', 7],
    ['09-rewards', 'The Rewards Game', 'Six purchases, six cards. Pick the one that pays best — and see what it really cost.', 7],
    ['10-fraud', 'Spot the Fraud', 'Six scams that are running right now. Decide what to do before you see the answer.', 8],
    ['11-fraud-defense', 'Your Defense System', 'The invisible layers that guard every payment — and the switches you control yourself.', 6],
    ['12-disputes', 'Disputes & Chargebacks', 'Something went wrong. Walk the exact steps that get your money back.', 6],
    ['13-international', 'Going International', 'Plan a trip, choose how to pay, and see what the “pay in your own currency” button costs.', 6],
    ['14-management', 'Managing Like a Pro', 'Six months of real life. Every decision moves your score and your savings.', 8],
    ['15-protections', 'Hidden Protections', 'The cover that comes with your card that most people never claim.', 5],
    ['16-customer-service', 'Talking to Your Bank', 'Practise the call. Learn the words that get a fee reversed or a complaint escalated.', 6],
    ['17-alternatives', 'Cards vs Everything Else', 'Instant bank payments, debit, pay-later, wallets. Pick the right tool for each job.', 6],
    ['18-taxes', 'Taxes & Your Card', 'Where tax quietly touches your card — and the myths that are simply wrong.', 5],
    ['19-students', 'Your First Card, Right', 'A five-step playbook for a first card, with commitments you tick off yourself.', 6],
    ['20-relationship', 'Your Relationship With Money', 'Six ways a card bends your judgement, and the fix for each.', 6],
    ['21-future', 'What’s Coming Next', 'Wallets, pay-by-bank, stablecoins and AI agents that shop for you.', 6],
    ['22-graduation', 'Graduation', 'Ten questions across everything you have learned. Earn the diploma.', 10]
  ].map(([slug, title, desc, mins], i) => ({ n: i + 1, slug, title, desc, mins, roman: roman(i + 1) }));
  function roman(n) { const m = [[10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']]; let s = ''; for (const [v, r] of m) while (n >= v) { s += r; n -= v; } return s; }

  const chN = parseInt(document.body.dataset.ch || '0', 10);
  const base = chN ? '../' : '';
  const href = c => `${base}chapters/${c.slug}.html`;

  // ---------- region ----------
  const REG = window.DCC_REGIONS;
  function guessRegion() {
    let tz = '';
    try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch { /* ignore */ }
    if (/^Asia\/(Kolkata|Calcutta)/.test(tz)) return 'in';
    if (/^(Australia|Pacific\/Auckland)/.test(tz)) return 'au';
    if (/^(Europe|Africa)|Asia\/(Dubai|Riyadh|Qatar)/.test(tz)) return 'uk';
    if (/^America/.test(tz)) return 'us';
    return 'in';
  }
  const urlR = new URLSearchParams(location.search).get('r');
  let stored = store.get('region', null);
  let guessed = false;
  let rid = REG[urlR] ? urlR : REG[stored] ? stored : (guessed = true, guessRegion());
  if (REG[urlR]) store.set('region', urlR);
  const R = REG[rid];
  document.documentElement.dataset.edition = rid;

  const nf = new Intl.NumberFormat(R.locale, { maximumFractionDigits: 0 });
  const nf2 = new Intl.NumberFormat(R.locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const money = (n, dec) => (n < 0 ? '−' : '') + R.cur + (dec ? nf2 : nf).format(Math.abs(n));
  const num = n => nf.format(n);
  // {issuer} → region value, {$debt} → formatted amount from R.a
  const t = s => String(s).replace(/\{(\$?)([a-zA-Z_]+)\}/g, (m, d, k) => d ? (k in R.a ? money(R.a[k]) : m) : (k in R ? R[k] : m));
  const pick = v => (v && typeof v === 'object' && !Array.isArray(v) && ('in' in v || 'us' in v || 'uk' in v || 'au' in v)) ? (v[rid] ?? (rid === 'in' ? v.in : v.us) ?? v.in ?? v.us) : v;
  function setRegion(id) {
    if (!REG[id]) return;
    store.set('region', id);
    const u = new URL(location.href); u.searchParams.delete('r');
    if (id === rid && !urlR) { closeSheets(); return; }
    location.replace(u.toString());
  }
  function localize(root = document.body) {
    $$('[data-r]', root).forEach(el => { if (!el.dataset.r.split(/\s+/).includes(rid)) el.remove(); });
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const hits = [];
    while (w.nextNode()) { const p = w.currentNode.parentNode; if (p && !/^(SCRIPT|STYLE)$/.test(p.nodeName) && w.currentNode.nodeValue.includes('{')) hits.push(w.currentNode); }
    hits.forEach(nd => { nd.nodeValue = t(nd.nodeValue); });
  }

  // ---------- progress ----------
  const doneSet = new Set(store.get('done', []));
  const isDone = n => doneSet.has(n);
  function markDone(n = chN) {
    if (!n || doneSet.has(n)) return;
    doneSet.add(n); store.set('done', [...doneSet]);
    $$(`.toc a[data-n="${n}"]`).forEach(a => a.classList.add('done'));
  }

  // ---------- sound + haptics ----------
  let muted = store.get('mute', false), actx;
  function tone(freqs, vol, len) {
    if (muted) return;
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      freqs.forEach((f, i) => {
        const o = actx.createOscillator(), g = actx.createGain(), at = actx.currentTime + i * .08;
        o.connect(g); g.connect(actx.destination); o.frequency.value = f;
        g.gain.setValueAtTime(0, at); g.gain.linearRampToValueAtTime(vol, at + .015); g.gain.exponentialRampToValueAtTime(.001, at + len);
        o.start(at); o.stop(at + len + .05);
      });
    } catch { /* no audio */ }
  }
  const buzz = p => { if (!muted && navigator.vibrate) try { navigator.vibrate(p); } catch { /* ignore */ } };
  const playClick = () => { tone([620], .035, .07); buzz(8); };
  const playSuccess = () => { tone([523, 659, 784], .05, .25); buzz([12, 40, 18]); };
  const playError = () => { tone([220, 180], .04, .16); buzz(30); };

  // ---------- effects ----------
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  function burstConfetti(x = innerWidth / 2, y = innerHeight / 2, count = 26) {
    if (calm) return;
    const colors = ['#2563EB', '#EA580C', '#16A34A', '#B45309', '#DC2626'];
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'confetti'; p.style.cssText = `left:${x}px;top:${y}px;background:${colors[i % 5]}`;
      document.body.appendChild(p);
      const a = (Math.PI * 2 * i) / count + Math.random() * .5, v = 90 + Math.random() * 220;
      p.animate([{ transform: 'translate(0,0) rotate(0)', opacity: 1 },
        { transform: `translate(${Math.cos(a) * v}px,${Math.sin(a) * v + 180}px) rotate(${Math.random() > .5 ? 720 : -720}deg)`, opacity: 0 }],
        { duration: 1100 + Math.random() * 700, easing: 'cubic-bezier(.25,.46,.45,.94)' }).onfinish = () => p.remove();
    }
  }
  function animateNumber(el, to, { from = 0, dur = 900, fmt = v => num(Math.round(v)) } = {}) {
    if (calm) { el.textContent = fmt(to); return; }
    const s = performance.now();
    (function tick(now) {
      const p = Math.min((now - s) / dur, 1), e = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(from + (to - from) * e);
      if (p < 1) requestAnimationFrame(tick);
    })(s);
  }
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } }), { threshold: .12 });
  const observe = (root = document) => $$('.reveal:not(.visible)', root).forEach(el => io.observe(el));
  // slider fill + card tilt, delegated so injected markup works too
  const fill = el => el.style.setProperty('--fill', ((el.value - el.min) / (el.max - el.min) * 100) + '%');
  document.addEventListener('input', e => { if (e.target.type === 'range') fill(e.target); });
  const fillAll = (root = document) => $$('input[type=range]', root).forEach(fill);
  if (matchMedia('(hover: hover)').matches && !calm) {
    document.addEventListener('pointermove', e => {
      const c = e.target.closest && e.target.closest('.cc[data-tilt]'); if (!c) return;
      const b = c.getBoundingClientRect(), px = (e.clientX - b.left) / b.width, py = (e.clientY - b.top) / b.height;
      c.style.setProperty('--ry', (px - .5) * 16 + 'deg'); c.style.setProperty('--rx', (.5 - py) * 12 + 'deg');
      c.style.setProperty('--mx', px * 100 + '%'); c.style.setProperty('--my', py * 100 + '%');
    });
    document.addEventListener('pointerout', e => { const c = e.target.closest && e.target.closest('.cc[data-tilt]'); if (c && !c.contains(e.relatedTarget)) { c.style.setProperty('--rx', '0deg'); c.style.setProperty('--ry', '0deg'); } });
  }

  // ---------- chrome ----------
  function sheet(cls, title, body) {
    const s = document.createElement('div');
    s.className = 'sheet ' + cls; s.setAttribute('role', 'dialog'); s.setAttribute('aria-label', title);
    s.innerHTML = `<div class="sheet-head"><b>${title}</b><button class="nav-btn" data-close aria-label="Close">✕</button></div>${body}`;
    document.body.appendChild(s); return s;
  }
  let scrim, picker, drawer, lastFocus;
  function openSheet(s) { closeSheets(); lastFocus = document.activeElement; scrim.classList.add('open'); s.classList.add('open'); const f = $('button, a', s); f && f.focus({ preventScroll: true }); }
  function closeSheets() { $$('.sheet.open').forEach(s => s.classList.remove('open')); scrim && scrim.classList.remove('open'); lastFocus && lastFocus.focus && lastFocus.focus({ preventScroll: true }); lastFocus = null; }
  const openRegions = () => openSheet(picker), openChapters = () => openSheet(drawer);
  const tocHtml = () => `<nav class="toc">${CH.map(c => `<a href="${href(c)}" data-n="${c.n}" class="${c.n === chN ? 'here' : ''} ${isDone(c.n) ? 'done' : ''}"><span class="n">${c.roman}</span><span class="t">${c.title}</span><span class="s">✓</span></a>`).join('')}</nav>`;

  function toast(html, ms = 7000) {
    const el = document.createElement('div'); el.className = 'toast'; el.setAttribute('role', 'status'); el.innerHTML = html;
    document.body.appendChild(el); requestAnimationFrame(() => el.classList.add('show'));
    const kill = () => { el.classList.remove('show'); setTimeout(() => el.remove(), 500); };
    setTimeout(kill, ms); el.addEventListener('click', kill); return el;
  }

  function buildChrome() {
    const nav = document.createElement('header');
    nav.className = 'nav';
    nav.innerHTML = `<a class="nav-brand" href="${base}index.html" aria-label="Decoding Credit Cards — home">Decoding<i> · Credit Cards</i> <span>※</span></a>
      <div class="nav-actions">
        <button class="nav-btn region" data-open="regions" aria-label="Region: ${R.name}. Change">${R.flag} <span>${R.label}</span> ▾</button>
        <button class="nav-btn" data-mute aria-label="Toggle sound">${muted ? '🔇' : '🔊'}</button>
        <button class="nav-btn" data-open="chapters" aria-label="All chapters">☰ <span class="lbl">Chapters</span></button>
      </div>`;
    document.body.prepend(nav);
    const line = document.createElement('div'); line.className = 'progress-line'; document.body.prepend(line);
    addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', scrollY > 24);
      const max = document.documentElement.scrollHeight - innerHeight;
      line.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
    }, { passive: true });

    scrim = document.createElement('div'); scrim.className = 'scrim'; document.body.appendChild(scrim);
    picker = sheet('picker', 'Choose your edition', Object.values(REG).map(r =>
      `<button class="region-opt ${r.id === rid ? 'on' : ''}" data-region="${r.id}"><span class="flag">${r.flag}</span><span><b>${r.name}</b><small>${r.sub}</small></span></button>`).join('') +
      `<p class="small muted" style="padding:14px 20px">Every example, amount, law and regulator on the site switches to the edition you pick.</p>`);
    drawer = sheet('drawer', 'All chapters', tocHtml());

    document.addEventListener('click', e => {
      const b = e.target.closest('[data-open],[data-close],button[data-region],[data-mute]');
      if (e.target === scrim) return closeSheets();
      if (!b) return;
      if (b.dataset.open === 'regions') openRegions();
      else if (b.dataset.open === 'chapters') openChapters();
      else if ('close' in b.dataset) closeSheets();
      else if (b.dataset.region) setRegion(b.dataset.region);
      else if ('mute' in b.dataset) { muted = !muted; store.set('mute', muted); $$('[data-mute]').forEach(x => x.textContent = muted ? '🔇' : '🔊'); if (!muted) playClick(); }
    });
    addEventListener('keydown', e => { if (e.key === 'Escape') closeSheets(); });

    const foot = document.createElement('footer');
    foot.className = 'footer';
    foot.innerHTML = `<div class="footer-brand">Decoding · Credit Cards <span>※</span></div>
      <p>No tracking · No ads · No card recommendations · Free forever</p>
      <p>${R.flag} ${R.name} edition · figures checked ${R.asOf}. General education, not financial advice — rules and rates change, so confirm with your issuer.</p>
      <div class="hand">Built with love, coffee (and Claude) by <a href="https://parth8.github.io/portfolio/" target="_blank" rel="noopener">Parth</a></div>
      <div class="footer-links"><a href="https://linkedin.com/in/aggarwalparth" target="_blank" rel="noopener">LinkedIn ↗</a><a href="https://parth8.github.io/portfolio/" target="_blank" rel="noopener">Portfolio ↗</a><a href="https://parthaggarwal8.medium.com/" target="_blank" rel="noopener">Medium ↗</a></div>`;
    document.body.appendChild(foot);

    if (chN) buildChapter();
    if (guessed) { store.set('region', rid); setTimeout(() => toast(`${R.flag} Showing the ${R.name} edition <button data-open="regions">Change</button>`), 900); }
  }

  function buildChapter() {
    const c = CH[chN - 1], prev = CH[chN - 2], next = CH[chN];
    const head = $('.ch-head');
    head && head.insertAdjacentHTML('afterbegin', `<div class="ch-meta"><b>Chapter ${c.roman}</b><span>${c.n} of ${CH.length} · ~${c.mins} min · ${R.flag} ${R.label}</span></div>`);
    const cp = $('.checkpoint');
    if (cp) {
      cp.classList.add('reveal');
      cp.insertAdjacentHTML('afterbegin', `<div class="icon">${cp.dataset.icon || '※'}</div>`);
      cp.insertAdjacentHTML('beforeend', `<div class="row"><a class="btn btn--ghost" href="${base}index.html#chapters">← all chapters</a>${next
        ? `<a class="btn btn--primary btn--lg" href="${next.slug}.html">Chapter ${next.roman}: ${next.title} →</a>`
        : `<a class="btn btn--primary btn--lg" href="${base}index.html">Back to the start →</a>`}</div>`);
      new IntersectionObserver((es, o) => es.forEach(e => { if (e.isIntersecting) { markDone(); o.disconnect(); } }), { threshold: .6 }).observe(cp);
    }
    const wrap = $('main .wrap') || $('main');
    wrap.insertAdjacentHTML('beforeend', `<nav class="ch-nav" aria-label="Chapter navigation">
      <a href="${prev ? prev.slug + '.html' : base + 'index.html'}"><small>← ${prev ? 'Previous' : 'Back'}</small><b>${prev ? prev.title : 'Home'}</b></a>
      ${next ? `<a href="${next.slug}.html"><small>Next →</small><b>${next.title}</b></a>` : ''}</nav>`);
    document.body.classList.add('has-bar');
    document.body.insertAdjacentHTML('beforeend', `<div class="thumb-bar">
      <a href="${prev ? prev.slug + '.html' : base + 'index.html'}">‹ ${prev ? 'Prev' : 'Home'}</a>
      <button data-open="chapters">${c.roman} · ${c.n}/${CH.length}</button>
      ${next ? `<a href="${next.slug}.html">Next ›</a>` : `<a href="${base}index.html">Home ›</a>`}</div>`);
  }

  // ---------- shared quiz runner ----------
  // items: [{ kicker, title, body, opts:[{t, ok, why}], explain }]
  function quiz(el, { items, label = 'Round', nextLabel = 'Next →', endLabel = 'See result →', onEnd, onAnswer, shuffle }) {
    let i = 0, score = 0; const marks = [];
    if (shuffle) items.forEach(q => { for (let k = q.opts.length - 1; k > 0; k--) { const j = Math.floor(Math.random() * (k + 1)); [q.opts[k], q.opts[j]] = [q.opts[j], q.opts[k]]; } });
    const show = () => {
      if (i >= items.length) return onEnd(score, items.length, () => { i = 0; score = 0; marks.length = 0; show(); });
      const q = items[i];
      el.innerHTML = `<div class="row row--between" style="margin-bottom:18px"><span class="mono faint">${label} ${i + 1} of ${items.length}</span>
          <span class="dots">${items.map((_, k) => `<i class="${k === i ? 'on' : marks[k] === true ? 'done' : marks[k] === false ? 'bad' : ''}"></i>`).join('')}</span></div>
        ${q.kicker ? `<div class="eyebrow c-accent">${q.kicker}</div>` : ''}<h3 class="h3">${q.title}</h3>${q.body ? `<div class="quiz-body">${q.body}</div>` : ''}
        <div class="quiz-opts" style="margin-top:20px" role="group" aria-label="Answers">${q.opts.map((o, k) => `<button class="opt" data-k="${k}"><b>${'ABCDEF'[k]}</b><span>${o.t}</span></button>`).join('')}</div>
        <div aria-live="polite" class="quiz-fb"></div>`;
      el.scrollIntoView({ block: 'nearest', behavior: calm ? 'auto' : 'smooth' });
    };
    el.addEventListener('click', e => {
      const b = e.target.closest('.opt'); const nx = e.target.closest('[data-next]');
      if (nx) { i++; show(); return; }
      if (!b || b.classList.contains('locked')) return;
      const q = items[i], k = +b.dataset.k, o = q.opts[k];
      $$('.opt', el).forEach((x, j) => { x.classList.add('locked'); x.classList.add(q.opts[j].ok ? 'right' : j === k ? 'wrong' : 'dim'); });
      marks[i] = !!o.ok; if (o.ok) { score++; playSuccess(); } else playError();
      onAnswer && onAnswer(q, o, i);
      $('.quiz-fb', el).innerHTML = `<div class="fb ${o.ok ? 'good' : 'bad'}"><div class="fb-title">${o.ok ? '✓ ' + (q.yes || 'Right.') : '✗ ' + (q.no || 'Not quite.')}</div>
        ${o.why ? `<p>${o.why}</p>` : ''}${q.explain ? `<div class="quiz-explain">${q.explain}</div>` : ''}
        <div class="row"><button class="btn btn--primary" data-next>${i < items.length - 1 ? nextLabel : endLabel}</button></div></div>`;
      $('[data-next]', el).focus({ preventScroll: true });
    });
    show();
  }
  const grade = (s, n) => { const p = s / n; return p === 1 ? 'A+' : p >= .8 ? 'A' : p >= .6 ? 'B' : p >= .4 ? 'C' : 'D'; };

  // ---------- boot ----------
  window.DCC = { $, $$, R, rid, regions: REG, chapters: CH, money, num, t, pick, setRegion, openRegions, openChapters, localize, observe, fillAll,
    isDone, markDone, playClick, playSuccess, playError, burstConfetti, animateNumber, quiz, grade, toast, store, href, calm };
  localize();
  buildChrome();
  fillAll(); observe();
  // run after the page's own script so injected content is caught too
  addEventListener('DOMContentLoaded', () => { fillAll(); observe(); document.body.classList.add('ready'); });
})();
