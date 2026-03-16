/* ════════════════════════════════════════════════════
   The Clearing — app.js
   ════════════════════════════════════════════════════ */

'use strict';

/* ── Constants ─────────────────────────────────────── */

const TONES = [
  /* Circles */
  { id: 'grief',          label: 'Grief',          shape: 'circle',   color: '#3a5a8c' },
  { id: 'shame',          label: 'Shame',          shape: 'circle',   color: '#8b2635' },
  { id: 'worry',          label: 'Worry',          shape: 'circle',   color: '#b8973a' },
  { id: 'uncertainty',    label: 'Uncertainty',    shape: 'circle',   color: '#4a8fa8' },
  /* Squares */
  { id: 'anger',          label: 'Anger',          shape: 'square',   color: '#c0392b' },
  { id: 'guilt',          label: 'Guilt',          shape: 'square',   color: '#2e6b35' },
  { id: 'frustration',    label: 'Frustration',    shape: 'square',   color: '#cc5522' },
  { id: 'burden',         label: 'Burden',         shape: 'square',   color: '#4d4d4d' },
  /* Diamonds */
  { id: 'sadness',        label: 'Sadness',        shape: 'diamond',  color: '#5575a8' },
  { id: 'exhaustion',     label: 'Exhaustion',     shape: 'diamond',  color: '#6b6b6b' },
  { id: 'disappointment', label: 'Disappointment', shape: 'diamond',  color: '#6688aa' },
  { id: 'despair',        label: 'Despair',        shape: 'diamond',  color: '#2a2a6e' },
  /* Triangles */
  { id: 'anxiety',        label: 'Anxiety',        shape: 'triangle', color: '#c9851a' },
  { id: 'overwhelm',      label: 'Overwhelm',      shape: 'triangle', color: '#d4621a' },
  { id: 'confusion',      label: 'Confusion',      shape: 'triangle', color: '#7a5ab0' },
  { id: 'resentment',     label: 'Resentment',     shape: 'triangle', color: '#a03030' },
  /* Stars */
  { id: 'loneliness',     label: 'Loneliness',     shape: 'star',     color: '#1e7a62' },
  { id: 'heartache',      label: 'Heartache',      shape: 'star',     color: '#b84d9a' },
  { id: 'regret',         label: 'Regret',         shape: 'star',     color: '#8a5c35' },
  { id: 'tension',        label: 'Tension',        shape: 'star',     color: '#9a7a20' },
  /* Hexagons */
  { id: 'fear',           label: 'Fear',           shape: 'hexagon',  color: '#6b2d8a' },
  { id: 'loss',           label: 'Loss',           shape: 'hexagon',  color: '#1e3a60' },
  { id: 'numbness',       label: 'Numbness',       shape: 'hexagon',  color: '#9e9e9e' },
  { id: 'emptiness',      label: 'Emptiness',      shape: 'hexagon',  color: '#aaaaaa' },
];

const STORAGE_KEY = 'the-clearing-release';
const SVG_NS      = 'http://www.w3.org/2000/svg';

/* ── State ─────────────────────────────────────────── */

const state = {
  selectedTone:    null,
  breathingActive: false,
  breathTimerId:   null,
  breathPhase:     0,    /* 0=inhale 1=hold 2=exhale */
  breathCycles:    0,
};

/* ── LocalStorage Helpers ───────────────────────────── */

function todayString() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function getSavedRelease() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (data.date !== todayString()) return null;
    return data;
  } catch (_) {
    return null;
  }
}

function saveRelease(tone) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      date: todayString(),
      tone: { id: tone.id, label: tone.label, shape: tone.shape, color: tone.color },
    }));
  } catch (_) { /* ignore storage errors */ }
}

/* ── Seeded RNG ─────────────────────────────────────── */

function createRng(seed) {
  let s = (seed >>> 0) || 1;
  return function () {
    s = (Math.imul(1664525, s) + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
}

function dateSeed() {
  const d = new Date();
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
}

/* ── SVG Shape Helpers ──────────────────────────────── */

/**
 * Create an SVG shape element (circle, square, diamond, triangle, star, hexagon)
 * centred at (x, y) with circumradius r.
 */
function makeStoneEl(shape, x, y, r, color, opacity, rotationDeg) {
  let el;

  switch (shape) {
    case 'circle': {
      el = document.createElementNS(SVG_NS, 'circle');
      el.setAttribute('cx', x);
      el.setAttribute('cy', y);
      el.setAttribute('r', r);
      break;
    }
    case 'square': {
      el = document.createElementNS(SVG_NS, 'rect');
      const s = r * 1.75;
      el.setAttribute('x', x - s / 2);
      el.setAttribute('y', y - s / 2);
      el.setAttribute('width', s);
      el.setAttribute('height', s);
      if (rotationDeg) {
        el.setAttribute('transform', `rotate(${rotationDeg}, ${x}, ${y})`);
      }
      break;
    }
    case 'diamond': {
      el = document.createElementNS(SVG_NS, 'polygon');
      el.setAttribute('points',
        `${x},${y - r} ${x + r},${y} ${x},${y + r} ${x - r},${y}`);
      break;
    }
    case 'triangle': {
      const h = r * 0.87;
      el = document.createElementNS(SVG_NS, 'polygon');
      el.setAttribute('points',
        `${x},${y - r} ${x + h},${y + r * 0.5} ${x - h},${y + r * 0.5}`);
      break;
    }
    case 'star': {
      const outer = r;
      const inner = r * 0.42;
      const pts = [];
      for (let i = 0; i < 5; i++) {
        const oa = (i * 72 - 90) * (Math.PI / 180);
        const ia = ((i + 0.5) * 72 - 90) * (Math.PI / 180);
        pts.push(`${x + outer * Math.cos(oa)},${y + outer * Math.sin(oa)}`);
        pts.push(`${x + inner * Math.cos(ia)},${y + inner * Math.sin(ia)}`);
      }
      el = document.createElementNS(SVG_NS, 'polygon');
      el.setAttribute('points', pts.join(' '));
      break;
    }
    case 'hexagon': {
      const pts = [];
      for (let i = 0; i < 6; i++) {
        const angle = (i * 60 - 30) * (Math.PI / 180);
        pts.push(`${x + r * Math.cos(angle)},${y + r * Math.sin(angle)}`);
      }
      el = document.createElementNS(SVG_NS, 'polygon');
      el.setAttribute('points', pts.join(' '));
      break;
    }
    default: {
      el = document.createElementNS(SVG_NS, 'circle');
      el.setAttribute('cx', x);
      el.setAttribute('cy', y);
      el.setAttribute('r', r);
    }
  }

  el.setAttribute('fill', color);
  el.setAttribute('opacity', opacity);
  return el;
}

/**
 * Render an inline SVG icon for a given shape/color.
 * Returns an HTML string.
 */
function stoneIconHtml(shape, color, size) {
  size = size || 22;
  const cx = size / 2;
  const cy = size / 2;
  const r  = size * 0.38;
  let inner;

  switch (shape) {
    case 'circle':
      inner = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${color}"/>`;
      break;
    case 'square': {
      const s = r * 1.75;
      inner = `<rect x="${cx - s/2}" y="${cy - s/2}" width="${s}" height="${s}" fill="${color}"/>`;
      break;
    }
    case 'diamond':
      inner = `<polygon points="${cx},${cy-r} ${cx+r},${cy} ${cx},${cy+r} ${cx-r},${cy}" fill="${color}"/>`;
      break;
    case 'triangle': {
      const h = r * 0.87;
      inner = `<polygon points="${cx},${cy-r} ${cx+h},${cy+r*0.5} ${cx-h},${cy+r*0.5}" fill="${color}"/>`;
      break;
    }
    case 'star': {
      const outer = r;
      const innR  = r * 0.42;
      const pts   = [];
      for (let i = 0; i < 5; i++) {
        const oa = (i * 72 - 90) * (Math.PI / 180);
        const ia = ((i + 0.5) * 72 - 90) * (Math.PI / 180);
        pts.push(`${cx + outer * Math.cos(oa)},${cy + outer * Math.sin(oa)}`);
        pts.push(`${cx + innR  * Math.cos(ia)},${cy + innR  * Math.sin(ia)}`);
      }
      inner = `<polygon points="${pts.join(' ')}" fill="${color}"/>`;
      break;
    }
    case 'hexagon': {
      const pts = [];
      for (let i = 0; i < 6; i++) {
        const angle = (i * 60 - 30) * (Math.PI / 180);
        pts.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
      }
      inner = `<polygon points="${pts.join(' ')}" fill="${color}"/>`;
      break;
    }
    default:
      inner = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${color}"/>`;
  }

  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" aria-hidden="true">${inner}</svg>`;
}

/* ── Screen Management ──────────────────────────────── */

function showScreen(nextId) {
  const current = document.querySelector('.screen.is-active');
  const next    = document.getElementById(nextId);
  if (!next || current === next) return;

  if (current) {
    current.classList.add('is-exiting');
    current.classList.remove('is-active');
    current.setAttribute('aria-hidden', 'true');
    setTimeout(function () {
      current.classList.remove('is-exiting');
    }, 500);
  }

  /* Slight delay so the fade-out begins before fade-in */
  setTimeout(function () {
    next.classList.add('is-active');
    next.setAttribute('aria-hidden', 'false');
    /* Move focus to the screen for keyboard users */
    const firstFocusable = next.querySelector('button, [href], input, textarea, select, details, [tabindex]:not([tabindex="-1"])');
    if (firstFocusable) firstFocusable.focus({ preventScroll: true });
  }, 200);
}

/* ── Tone Grid ──────────────────────────────────────── */

function renderToneGrid() {
  const grid = document.getElementById('tone-grid');
  if (!grid) return;

  grid.innerHTML = '';

  TONES.forEach(function (tone) {
    const btn = document.createElement('button');
    btn.type              = 'button';
    btn.className         = 'tone-btn';
    btn.dataset.toneId    = tone.id;
    btn.setAttribute('role',        'radio');
    btn.setAttribute('aria-checked','false');
    btn.setAttribute('aria-label',   tone.label);
    btn.innerHTML =
      `<span class="tone-icon">${stoneIconHtml(tone.shape, tone.color, 22)}</span>` +
      `<span class="tone-name">${tone.label}</span>`;

    btn.addEventListener('click', function () { selectTone(tone); });
    grid.appendChild(btn);
  });
}

function selectTone(tone) {
  state.selectedTone = tone;

  document.querySelectorAll('.tone-btn').forEach(function (btn) {
    const active = btn.dataset.toneId === tone.id;
    btn.classList.toggle('is-selected', active);
    btn.setAttribute('aria-checked', active ? 'true' : 'false');
  });

  updateReleaseButton();
}

/* ── Release Button State ───────────────────────────── */

function updateReleaseButton() {
  const textarea   = document.getElementById('release-text');
  const releaseBtn = document.getElementById('btn-release');
  const hint       = document.getElementById('release-hint');
  if (!textarea || !releaseBtn) return;

  const hasText = textarea.value.trim().length > 0;
  const hasTone = state.selectedTone !== null;
  const enabled = hasText && hasTone;

  releaseBtn.disabled = !enabled;
  releaseBtn.setAttribute('aria-disabled', String(!enabled));

  if (hint) {
    if (!hasText && !hasTone) {
      hint.textContent = 'Write something and choose a tone to continue.';
    } else if (!hasText) {
      hint.textContent = 'Write something to continue.';
    } else if (!hasTone) {
      hint.textContent = 'Choose an emotional tone to continue.';
    } else {
      hint.textContent = '';
    }
  }
}

/* ── Ritual Screen Init ─────────────────────────────── */

function initRitual() {
  const textarea   = document.getElementById('release-text');
  const charNum    = document.getElementById('char-num');
  const releaseBtn = document.getElementById('btn-release');

  if (!textarea) return;

  /* Reset */
  textarea.value     = '';
  state.selectedTone = null;
  if (charNum) charNum.textContent = '0';

  document.querySelectorAll('.tone-btn').forEach(function (btn) {
    btn.classList.remove('is-selected');
    btn.setAttribute('aria-checked', 'false');
  });

  releaseBtn.disabled = true;
  releaseBtn.setAttribute('aria-disabled', 'true');

  textarea.addEventListener('input', function () {
    if (charNum) charNum.textContent = textarea.value.length;
    updateReleaseButton();
  });

  releaseBtn.addEventListener('click', startRelease, { once: true });
}

/* ── Release: Text Dissolve → Breathing ────────────── */

function startRelease() {
  const textarea = document.getElementById('release-text');
  const text     = textarea ? textarea.value.trim() : '';

  /* Save to localStorage before text is lost */
  if (state.selectedTone) {
    saveRelease(state.selectedTone);
  }

  /* Seed the dissolving text onto the breathing screen */
  const dissolveEl = document.getElementById('dissolving-words');
  if (dissolveEl && text) {
    /* Show a short excerpt (first 80 chars) */
    dissolveEl.textContent = text.length > 80 ? text.slice(0, 80) + '…' : text;
    dissolveEl.classList.remove('is-dissolving');
  }

  showScreen('screen-breathing');
  startBreathing(dissolveEl);
}

/* ── Breathing Guide ────────────────────────────────── */

const BREATH_PHASES = [
  { label: 'Inhale', duration: 4000 },
  { label: 'Hold',   duration: 4000 },
  { label: 'Exhale', duration: 6000 },
];

function startBreathing(dissolveEl) {
  const circle     = document.getElementById('breath-circle');
  const labelEl    = document.getElementById('breath-label');
  const continueBtn = document.getElementById('btn-to-clearing');

  if (!circle || !labelEl) return;

  state.breathPhase  = 0;
  state.breathCycles = 0;

  /* Start dissolve animation shortly after screen appears */
  if (dissolveEl) {
    setTimeout(function () {
      dissolveEl.classList.add('is-dissolving');
    }, 400);
  }

  /* Start breathing animation */
  setTimeout(function () {
    circle.classList.add('is-breathing');
    tickBreath(labelEl, continueBtn);
  }, 800);
}

function tickBreath(labelEl, continueBtn) {
  const phase = BREATH_PHASES[state.breathPhase];
  if (labelEl) labelEl.textContent = phase.label;

  state.breathTimerId = setTimeout(function () {
    state.breathPhase++;
    if (state.breathPhase >= BREATH_PHASES.length) {
      state.breathPhase = 0;
      state.breathCycles++;

      /* After first complete cycle, reveal the continue button */
      if (state.breathCycles === 1 && continueBtn) {
        continueBtn.style.opacity       = '1';
        continueBtn.style.pointerEvents = 'auto';
        continueBtn.setAttribute('aria-hidden', 'false');
        continueBtn.removeAttribute('tabindex');
      }

      /* Auto-advance after 3 complete cycles */
      if (state.breathCycles >= 3) {
        goToClearing();
        return;
      }
    }
    tickBreath(labelEl, continueBtn);
  }, phase.duration);
}

function goToClearing() {
  if (state.breathTimerId) {
    clearTimeout(state.breathTimerId);
    state.breathTimerId = null;
  }
  const circle = document.getElementById('breath-circle');
  if (circle) circle.classList.remove('is-breathing');

  renderClearing(true);
  showScreen('screen-clearing');
}

/* ── Clearing Render ────────────────────────────────── */

/* Generate a position within the clearing circle */
function randomPositionInCircle(rng, cx, cy, minR, maxR) {
  const angle = rng() * 2 * Math.PI;
  /* Bias slightly toward centre for organic clustering */
  const r = minR + Math.pow(rng(), 0.7) * (maxR - minR);
  return {
    x: cx + r * Math.cos(angle),
    y: cy + r * Math.sin(angle),
  };
}

function renderClearing(userJustReleased) {
  const svg = document.getElementById('clearing-svg');
  if (!svg) return;

  const cx = 250, cy = 250;
  const clearingR = 218;

  /* ── Clear previous content (keep <defs>) ── */
  Array.from(svg.childNodes).forEach(function (node) {
    if (node.nodeName !== 'defs') svg.removeChild(node);
  });

  /* ── Ground layers ── */
  function addCircle(r, fill, opacity) {
    const el = document.createElementNS(SVG_NS, 'circle');
    el.setAttribute('cx', cx);
    el.setAttribute('cy', cy);
    el.setAttribute('r',  r);
    el.setAttribute('fill', fill);
    if (opacity !== undefined) el.setAttribute('opacity', opacity);
    svg.appendChild(el);
  }

  addCircle(248, '#0d1a09');               /* outer dark ring */
  addCircle(clearingR, '#1a2b16');         /* main ground     */
  addCircle(180, 'url(#groundGlow)');      /* soft glow       */

  /* Subtle depth rings */
  [225, 180, 130, 80].forEach(function (r, i) {
    const ring = document.createElementNS(SVG_NS, 'circle');
    ring.setAttribute('cx', cx);
    ring.setAttribute('cy', cy);
    ring.setAttribute('r',  r);
    ring.setAttribute('fill', 'none');
    ring.setAttribute('stroke', '#2e4828');
    ring.setAttribute('stroke-width', '0.5');
    ring.setAttribute('opacity', String(0.35 - i * 0.06));
    svg.appendChild(ring);
  });

  /* ── Seed stones (simulated other users) ── */
  const rng       = createRng(dateSeed());
  const baseCount = Math.floor(45 + rng() * 35); /* 45–80 stones */

  for (let i = 0; i < baseCount; i++) {
    const tone    = TONES[Math.floor(rng() * TONES.length)];
    const pos     = randomPositionInCircle(rng, cx, cy, 18, clearingR - 14);
    const radius  = 3 + rng() * 4.5;
    const opacity = 0.65 + rng() * 0.28;
    const rot     = rng() * 30 - 15;

    const stone = makeStoneEl(tone.shape, pos.x, pos.y, radius, tone.color, opacity, rot);
    svg.appendChild(stone);
  }

  /* ── User stone ── */
  const saved = getSavedRelease();
  let totalCount = baseCount;

  if (saved && saved.tone) {
    totalCount = baseCount + 1;
    const userTone = saved.tone;

    /* Glow halo (appears/pulses via CSS animation) */
    const haloRadius = 10;
    const userPos    = randomPositionInCircle(
      createRng(dateSeed() + 9999), cx, cy, 25, clearingR - 22
    );

    const halo = document.createElementNS(SVG_NS, 'circle');
    halo.setAttribute('cx',      userPos.x);
    halo.setAttribute('cy',      userPos.y);
    halo.setAttribute('r',       haloRadius);
    halo.setAttribute('fill',    userTone.color);
    halo.setAttribute('opacity', '0.15');
    halo.classList.add('stone-glow--new');
    svg.appendChild(halo);

    /* The stone itself */
    const userStone = makeStoneEl(
      userTone.shape, userPos.x, userPos.y, 6.5, userTone.color, 0.88, 0
    );
    if (userJustReleased) {
      userStone.classList.add('stone--new');
    }
    svg.appendChild(userStone);

    /* Update "your stone" row */
    const yourStoneRow  = document.getElementById('your-stone-row');
    const yourStoneIcon = document.getElementById('your-stone-icon');
    if (yourStoneRow && yourStoneIcon) {
      yourStoneIcon.innerHTML = stoneIconHtml(userTone.shape, userTone.color, 18);
      yourStoneRow.style.display = 'flex';
    }
  }

  /* ── Count line ── */
  const countEl = document.getElementById('clearing-count');
  if (countEl) {
    countEl.textContent =
      totalCount === 1
        ? '1 stone placed today'
        : `${totalCount} stones placed today`;
  }

  /* ── Legend ── */
  renderLegend();
}

function renderLegend() {
  const legend = document.getElementById('tone-legend');
  if (!legend) return;

  legend.innerHTML = TONES.map(function (tone) {
    return `<span class="legend-item" role="listitem">` +
      stoneIconHtml(tone.shape, tone.color, 14) +
      `<span>${tone.label}</span>` +
      `</span>`;
  }).join('');
}

/* ── Already Released Screen ────────────────────────── */

function showAlreadyReleased(saved) {
  const iconEl = document.getElementById('already-stone-icon');
  if (iconEl && saved.tone) {
    iconEl.innerHTML = stoneIconHtml(saved.tone.shape, saved.tone.color, 48);
  }
  showScreen('screen-already');
}

/* ── App Init ───────────────────────────────────────── */

function init() {
  /* Render tone grid once */
  renderToneGrid();

  /* Check daily release status */
  const saved = getSavedRelease();

  if (saved) {
    showAlreadyReleased(saved);
  }
  /* Otherwise, landing screen is already visible (is-active default) */

  /* ── Button bindings ── */

  /* Landing → Ritual */
  document.getElementById('btn-enter').addEventListener('click', function () {
    initRitual();
    showScreen('screen-ritual');
  });

  /* Already-released → Clearing */
  document.getElementById('btn-view-clearing').addEventListener('click', function () {
    renderClearing(false);
    showScreen('screen-clearing');
  });

  /* Breathing continue → Clearing */
  document.getElementById('btn-to-clearing').addEventListener('click', function () {
    goToClearing();
  });
}

/* ── Bootstrap ──────────────────────────────────────── */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
