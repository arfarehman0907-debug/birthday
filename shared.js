/* ============================================
   FOR FARAZ — Shared behaviors across pages
   ============================================ */

const PAGES = [
  { href: 'index.html',    num: 1, label: 'Welcome' },
  { href: 'notes.html',    num: 2, label: 'Our Notes' },
  { href: 'games.html',    num: 3, label: 'Play' },
  { href: 'surprises.html',num: 4, label: 'Surprises' },
  { href: 'gallery.html',  num: 5, label: 'For You' },
  { href: 'certificate.html', num: 6, label: 'Certificate' },
];

const NAME = 'Faraz';

/* ---------- Progress (per-visitor, local only) ---------- */
const Progress = {
  key: 'faraz_site_progress_v1',
  get() {
    try { return JSON.parse(localStorage.getItem(this.key)) || { visited: [], foundSurprises: [], gameStars: {} }; }
    catch { return { visited: [], foundSurprises: [], gameStars: {} }; }
  },
  save(data) { try { localStorage.setItem(this.key, JSON.stringify(data)); } catch {} },
  markVisited(page) {
    const d = this.get();
    if (!d.visited.includes(page)) d.visited.push(page);
    this.save(d);
  },
  markFound(id) {
    const d = this.get();
    if (!d.foundSurprises.includes(id)) d.foundSurprises.push(id);
    this.save(d);
    return d.foundSurprises.length;
  },
  setStars(game, stars) {
    const d = this.get();
    d.gameStars[game] = Math.max(d.gameStars[game] || 0, stars);
    this.save(d);
  }
};

/* ---------- Build top nav ---------- */
function buildNav(activeHref) {
  const nav = document.createElement('nav');
  nav.className = 'site-nav';
  PAGES.forEach(p => {
    const a = document.createElement('a');
    a.href = p.href;
    a.className = 'nav-pill' + (p.href === activeHref ? ' active' : '');
    a.innerHTML = `<span class="num">${p.num}.</span>${p.label}`;
    nav.appendChild(a);
  });
  document.body.prepend(nav);
  Progress.markVisited(activeHref);
}

/* ---------- Dynamic background: gradient blobs + falling petals ---------- */
function buildBackground(petalCount = 14) {
  const scene = document.createElement('div');
  scene.className = 'bg-scene';
  document.body.prepend(scene);

  const blobWrap = document.createElement('div');
  blobWrap.className = 'bg-blobs';
  const blobDefs = [
    { top: '5%', left: '8%', size: 260, color: 'var(--blush-200)', delay: '0s' },
    { top: '55%', left: '85%', size: 320, color: 'var(--lilac-200)', delay: '2s' },
    { top: '80%', left: '15%', size: 220, color: 'var(--sage-200)', delay: '4s' },
    { top: '20%', left: '70%', size: 180, color: 'var(--sky-200)', delay: '1s' },
  ];
  blobDefs.forEach(b => {
    const el = document.createElement('div');
    el.className = 'blob';
    el.style.cssText = `top:${b.top};left:${b.left};width:${b.size}px;height:${b.size}px;background:${b.color};animation-delay:${b.delay};`;
    blobWrap.appendChild(el);
  });
  document.body.prepend(blobWrap);

  const petalField = document.createElement('div');
  petalField.className = 'petal-field';
  const glyphs = ['🌸', '💗', '✨', '🩷'];
  for (let i = 0; i < petalCount; i++) {
    const p = document.createElement('div');
    p.className = 'petal';
    p.textContent = glyphs[i % glyphs.length];
    const left = Math.random() * 100;
    const dur = 10 + Math.random() * 10;
    const delay = Math.random() * -20;
    const size = 0.8 + Math.random() * 1.1;
    const drift = (Math.random() * 80 - 40) + 'px';
    p.style.cssText = `left:${left}vw;font-size:${size}rem;animation-duration:${dur}s;animation-delay:${delay}s;--drift:${drift};`;
    petalField.appendChild(p);
  }
  document.body.prepend(petalField);

  // keep stacking order: scene behind blobs behind petals behind content
  document.body.prepend(scene);
  document.body.insertBefore(blobWrap, petalField.nextSibling);
}

/* ---------- Bear SVGs (BUBU & DUDU-style rounded bears) ---------- */
function bearSVG(kind) {
  const bodyColor = kind === 'bubu' ? '#f3c8d1' : '#d9c7ec';
  const bellyColor = '#fff7f3';
  const cheek = '#f2a3ae';
  return `
  <svg class="bear-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <ellipse cx="50" cy="90" rx="26" ry="6" fill="#c98a9c" opacity="0.18"/>
    <circle cx="24" cy="26" r="12" fill="${bodyColor}"/>
    <circle cx="76" cy="26" r="12" fill="${bodyColor}"/>
    <circle cx="24" cy="26" r="6" fill="${cheek}" opacity="0.6"/>
    <circle cx="76" cy="26" r="6" fill="${cheek}" opacity="0.6"/>
    <circle cx="50" cy="52" r="38" fill="${bodyColor}"/>
    <ellipse cx="50" cy="62" rx="22" ry="19" fill="${bellyColor}"/>
    <circle cx="37" cy="46" r="4.2" fill="#5c3346"/>
    <circle cx="63" cy="46" r="4.2" fill="#5c3346"/>
    <circle cx="38.3" cy="44.5" r="1.2" fill="#fff"/>
    <circle cx="64.3" cy="44.5" r="1.2" fill="#fff"/>
    <ellipse cx="27" cy="55" rx="5.5" ry="4" fill="${cheek}" opacity="0.55"/>
    <ellipse cx="73" cy="55" rx="5.5" ry="4" fill="${cheek}" opacity="0.55"/>
    <path d="M43 56 Q50 62 57 56" stroke="#5c3346" stroke-width="2.4" fill="none" stroke-linecap="round"/>
    <ellipse cx="50" cy="50" rx="3" ry="2.2" fill="#5c3346"/>
    ${kind === 'bubu'
      ? '<path d="M20 20 Q24 14 30 18" stroke="#c98a9c" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.5"/>'
      : '<circle cx="50" cy="18" r="3.2" fill="#e8c887"/>'
    }
  </svg>`;
}

const BUBU_LINES = [
  `Faraz, close the distance one click at a time~ 🩷`,
  `Bubu says: he's about to smile SO hard.`,
  `I helped pick the stickers. You're welcome. 🐻`,
  `Somewhere far away, someone is thinking of you right now.`,
  `Careful — this page is full of love. Literally.`
];
const DUDU_LINES = [
  `Dudu here! I'm guarding the hidden surprises 👀`,
  `Psst... scroll slow, don't miss anything.`,
  `He picked every word on this page himself.`,
  `Happy birthday energy loading... 💫`,
  `I counted. There's a LOT of love on this site.`
];

function renderBearDuo(container, { bubuLine, duduLine } = {}) {
  const wrap = document.createElement('div');
  wrap.className = 'bear-row';
  const b = bubuLine || BUBU_LINES[Math.floor(Math.random() * BUBU_LINES.length)];
  const d = duduLine || DUDU_LINES[Math.floor(Math.random() * DUDU_LINES.length)];
  wrap.innerHTML = `
    <div class="bear-wrap bubu">${bearSVG('bubu')}</div>
    <div class="speech-bubble">${b}</div>
    <div class="speech-bubble" style="margin-left:auto;">${d}</div>
    <div class="bear-wrap dudu">${bearSVG('dudu')}</div>
  `;
  container.appendChild(wrap);
}

/* ---------- Journey dots ---------- */
function renderJourney(container, activeHref) {
  const track = document.createElement('div');
  track.className = 'journey-track';
  const visited = Progress.get().visited;
  PAGES.forEach(p => {
    const dot = document.createElement('div');
    let cls = 'journey-dot';
    if (p.href === activeHref) cls += ' current';
    else if (visited.includes(p.href)) cls += ' done';
    dot.className = cls;
    dot.textContent = p.num;
    dot.title = p.label;
    track.appendChild(dot);
  });
  container.appendChild(track);
}

/* ---------- Footer prev/next nav ---------- */
function renderFooterNav(container, currentHref) {
  const idx = PAGES.findIndex(p => p.href === currentHref);
  const prev = PAGES[idx - 1];
  const next = PAGES[idx + 1];
  const row = document.createElement('div');
  row.className = 'page-footer-nav';
  row.innerHTML = `
    ${prev ? `<a class="btn btn-ghost" href="${prev.href}">← ${prev.label}</a>` : '<span></span>'}
    ${next ? `<a class="btn btn-primary" href="${next.href}">${next.label} →</a>` : '<a class="btn btn-primary" href="index.html">Back to Start ↺</a>'}
  `;
  container.appendChild(row);
}

/* ---------- Confetti burst ---------- */
function confettiBurst(count = 60) {
  const colors = ['#e2a0af', '#d4ac5e', '#e6dcf0', '#dce8dc', '#cf7f95'];
  const shapes = ['🩷', '💗', '✨', '🌸', '💫'];
  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    const useEmoji = Math.random() > 0.5;
    el.className = 'confetti-piece';
    const left = Math.random() * 100;
    const dur = 1.8 + Math.random() * 1.6;
    const size = useEmoji ? (14 + Math.random() * 12) : (6 + Math.random() * 6);
    el.style.left = left + 'vw';
    el.style.animationDuration = dur + 's';
    if (useEmoji) {
      el.textContent = shapes[Math.floor(Math.random() * shapes.length)];
      el.style.fontSize = size + 'px';
    } else {
      el.style.width = size + 'px';
      el.style.height = size + 'px';
      el.style.borderRadius = Math.random() > 0.5 ? '50%' : '3px';
      el.style.background = colors[Math.floor(Math.random() * colors.length)];
    }
    document.body.appendChild(el);
    setTimeout(() => el.remove(), dur * 1000 + 100);
  }
}

/* ---------- Sticker helper ---------- */
const STICKER_EMOJI = {
  heart: '💗', bear: '🧸', star: '⭐', sparkle: '✨', flower: '🌸',
  ribbon: '🎀', note: '💌', balloon: '🎈', cake: '🎂', crown: '👑',
  moon: '🌙', gift: '🎁'
};
function placeStickers(container, list) {
  list.forEach(s => {
    const el = document.createElement('div');
    el.className = 'sticker';
    el.style.cssText = `top:${s.top};left:${s.left};font-size:${s.size || '2rem'};--rot:${s.rot || '-6deg'};animation-delay:${s.delay || '0s'};`;
    el.textContent = STICKER_EMOJI[s.type] || '✨';
    container.appendChild(el);
  });
}

/* ---------- Modal ---------- */
function openModal(html) {
  let overlay = document.getElementById('shared-modal');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'shared-modal';
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `<div class="modal-box"><button class="modal-close" aria-label="Close">✕</button><div class="modal-body"></div></div>`;
    document.body.appendChild(overlay);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
    overlay.querySelector('.modal-close').addEventListener('click', closeModal);
  }
  overlay.querySelector('.modal-body').innerHTML = html;
  requestAnimationFrame(() => overlay.classList.add('open'));
}
function closeModal() {
  const overlay = document.getElementById('shared-modal');
  if (overlay) overlay.classList.remove('open');
}

/* ---------- Init helper called by every page ---------- */
function initPage(activeHref, opts = {}) {
  buildBackground(opts.petals ?? 14);
  buildNav(activeHref);
}
