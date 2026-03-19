/* ════════════════════════════════════════════════════
   The Clearing — app.js
   ════════════════════════════════════════════════════ */

'use strict';

/* ── API Configuration ──────────────────────────────── */

/* 
 * IMPORTANT: After deploying your API, update this URL 
 * Replace with your deployed API URL (e.g., https://your-api.vercel.app)
 * Leave empty to use local storage only (original behavior)
 * 
 * INSTRUCTIONS:
 * 1. Deploy your API to Vercel (see DEPLOYMENT.md)
 * 2. Copy your API URL from Vercel dashboard
 * 3. Replace the empty string below with your URL
 * 4. Example: const API_URL = 'https://wetoro-api.vercel.app';
 * 
 * NOTE: An incorrect or unreachable URL will cause stones to not appear!
 */
const API_URL = '';  /* Set to your API URL after deployment */
const USE_API = API_URL && API_URL.length > 0;

/* ── Constants ─────────────────────────────────────── */

const TONES = [
  /* Circles - 4 distinct colors cycle */
  { id: 'grief',          label: 'Grief',          shape: 'circle',   color: '#4a7ac9' }, /* blue */
  { id: 'happy',          label: 'Happy',          shape: 'circle',   color: '#e8b84d' }, /* gold */
  { id: 'worry',          label: 'Worry',          shape: 'circle',   color: '#6dd4a5' }, /* green */
  { id: 'hopeful',        label: 'Hopeful',        shape: 'circle',   color: '#d97f9a' }, /* pink */
  /* Squares - same 4 colors */
  { id: 'anger',          label: 'Anger',          shape: 'square',   color: '#c0392b' }, /* red (special) */
  { id: 'grateful',       label: 'Grateful',       shape: 'square',   color: '#6dd4a5' }, /* green */
  { id: 'frustration',    label: 'Frustration',    shape: 'square',   color: '#d97f9a' }, /* pink */
  { id: 'content',        label: 'Content',        shape: 'square',   color: '#4a7ac9' }, /* blue */
  /* Diamonds - same 4 colors */
  { id: 'sadness',        label: 'Sadness',        shape: 'diamond',  color: '#4a7ac9' }, /* blue */
  { id: 'peaceful',       label: 'Peaceful',       shape: 'diamond',  color: '#6dd4a5' }, /* green */
  { id: 'exhaustion',     label: 'Exhaustion',     shape: 'diamond',  color: '#7a7a7a' }, /* gray (special) */
  { id: 'relieved',       label: 'Relieved',       shape: 'diamond',  color: '#e8b84d' }, /* gold */
  /* Triangles - same 4 colors */
  { id: 'anxiety',        label: 'Anxiety',        shape: 'triangle', color: '#d97f9a' }, /* pink */
  { id: 'excited',        label: 'Excited',        shape: 'triangle', color: '#e8b84d' }, /* gold */
  { id: 'overwhelm',      label: 'Overwhelm',      shape: 'triangle', color: '#c0392b' }, /* red (special) */
  { id: 'calm',           label: 'Calm',           shape: 'triangle', color: '#6dd4a5' }, /* green */
  /* Stars - same 4 colors */
  { id: 'loneliness',     label: 'Loneliness',     shape: 'star',     color: '#4a7ac9' }, /* blue */
  { id: 'joyful',         label: 'Joyful',         shape: 'star',     color: '#e8b84d' }, /* gold */
  { id: 'heartache',      label: 'Heartache',      shape: 'star',     color: '#d97f9a' }, /* pink */
  { id: 'loved',          label: 'Loved',          shape: 'star',     color: '#6dd4a5' }, /* green */
  /* Hexagons - same 4 colors */
  { id: 'fear',           label: 'Fear',           shape: 'hexagon',  color: '#7a7a7a' }, /* gray (special) */
  { id: 'proud',          label: 'Proud',          shape: 'hexagon',  color: '#4a7ac9' }, /* blue */
  { id: 'loss',           label: 'Loss',           shape: 'hexagon',  color: '#d97f9a' }, /* pink */
  { id: 'inspired',       label: 'Inspired',       shape: 'hexagon',  color: '#e8b84d' }, /* gold */
];

const STORAGE_KEY = 'wetoro-release';
const LEGACY_STORAGE_KEY = 'the-clearing-release';
const SKIP_VIGNETTE_KEY = 'wetoro-skip-vignette';
const SVG_NS      = 'http://www.w3.org/2000/svg';

/* ── State ─────────────────────────────────────────── */

const state = {
  selectedTone:    null,
  stoneLabel:      '',
  breathingActive: false,
  breathTimerId:   null,
  breathPhase:     0,    /* 0=inhale 1=hold 2=exhale */
  breathCycles:    0,
  currentDate:     todayString(),
  pastClearings:   {},
};

/* ── LocalStorage Helpers ───────────────────────────── */

function todayString() {
  /* Use UTC to ensure consistency with server timezone */
  const d = new Date();
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function getSavedRelease() {
  try {
    /* Try new key first */
    let raw = localStorage.getItem(STORAGE_KEY);
    
    /* Migrate from legacy key if needed */
    if (!raw) {
      raw = localStorage.getItem(LEGACY_STORAGE_KEY);
      if (raw) {
        /* Migrate to new key */
        localStorage.setItem(STORAGE_KEY, raw);
        localStorage.removeItem(LEGACY_STORAGE_KEY);
      }
    }
    
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (data.date !== todayString()) return null;
    return data;
  } catch (_) {
    return null;
  }
}

function saveRelease(tone, label) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      date: todayString(),
      tone: { id: tone.id, label: tone.label, shape: tone.shape, color: tone.color },
      label: label || '',
    }));
  } catch (_) { /* ignore storage errors */ }
}

/* ── API Helpers ────────────────────────────────────── */

/**
 * Save a stone to the backend API
 */
async function saveStoneToAPI(tone, label) {
  if (!USE_API) return { success: true };
  
  try {
    const response = await fetch(`${API_URL}/api/stones`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tone: {
          id: tone.id,
          label: tone.label,
          shape: tone.shape,
          color: tone.color
        },
        label: label || ''
      })
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to save stone to API:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Fetch all stones for today from the API
 */
async function fetchTodayStones() {
  if (!USE_API) return [];
  
  try {
    const response = await fetch(`${API_URL}/api/stones/today`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.stones || [];
  } catch (error) {
    console.error('Failed to fetch stones from API:', error);
    return [];
  }
}

/**
 * Fetch stones for a specific date from the API
 */
async function fetchStonesForDate(dateStr) {
  if (!USE_API) return [];
  
  try {
    const response = await fetch(`${API_URL}/api/stones/${dateStr}`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.stones || [];
  } catch (error) {
    console.error('Failed to fetch stones from API:', error);
    return [];
  }
}

/**
 * Fetch available dates from the API
 */
async function fetchAvailableDates() {
  if (!USE_API) {
    /* Fallback to local storage */
    const saved = getSavedRelease();
    return saved ? [todayString()] : [];
  }
  
  try {
    const response = await fetch(`${API_URL}/api/dates`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.dates || [];
  } catch (error) {
    console.error('Failed to fetch dates from API:', error);
    return [];
  }
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

  /* Show label input area */
  const labelArea = document.getElementById('label-area');
  if (labelArea) {
    labelArea.style.display = 'flex';
  }

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
  const labelArea  = document.getElementById('label-area');
  const labelInput = document.getElementById('stone-label');

  if (!textarea) return;

  /* Reset */
  textarea.value     = '';
  state.selectedTone = null;
  state.stoneLabel   = '';
  if (charNum) charNum.textContent = '0';
  if (labelInput) labelInput.value = '';
  if (labelArea) labelArea.style.display = 'none';

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

  if (labelInput) {
    labelInput.addEventListener('input', function () {
      state.stoneLabel = labelInput.value.trim();
    });
  }

  releaseBtn.addEventListener('click', startRelease, { once: true });
}

/* ── Release: Text Dissolve → Breathing ────────────── */

async function startRelease() {
  const textarea = document.getElementById('release-text');
  const text     = textarea ? textarea.value.trim() : '';

  /* Save to localStorage and API before text is lost */
  if (state.selectedTone) {
    saveRelease(state.selectedTone, state.stoneLabel);
    
    /* Also save to API if enabled */
    if (USE_API) {
      await saveStoneToAPI(state.selectedTone, state.stoneLabel);
    }
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

      /* After third complete cycle, reveal the continue button */
      if (state.breathCycles === 3 && continueBtn) {
        continueBtn.style.opacity       = '1';
        continueBtn.style.pointerEvents = 'auto';
        continueBtn.setAttribute('aria-hidden', 'false');
        continueBtn.removeAttribute('tabindex');
        /* Stop automatic progression - user must click */
        if (state.breathTimerId) {
          clearTimeout(state.breathTimerId);
          state.breathTimerId = null;
        }
        const circle = document.getElementById('breath-circle');
        if (circle) circle.classList.remove('is-breathing');
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

async function renderClearing(userJustReleased) {
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

  /* ── Fetch stones from API or use local storage ── */
  let allStones = [];
  
  if (USE_API) {
    /* Fetch all stones from API */
    allStones = await fetchTodayStones();
  } else {
    /* Fallback: use only local stone */
    const saved = getSavedRelease();
    if (saved && saved.tone) {
      allStones = [{
        tone_id: saved.tone.id,
        tone_label: saved.tone.label,
        tone_shape: saved.tone.shape,
        tone_color: saved.tone.color,
        label: saved.label || '',
        isUser: true
      }];
    }
  }
  
  const totalCount = allStones.length;
  
  /* ── Determine which stone is the user's ── */
  const saved = getSavedRelease();
  let userStoneId = null;
  if (saved && saved.tone) {
    userStoneId = saved.tone.id;
  }

  /* ── Render all stones ── */
  const rng = createRng(dateSeed());
  
  allStones.forEach(function(stone, index) {
    const tone = {
      id: stone.tone_id,
      label: stone.tone_label,
      shape: stone.tone_shape,
      color: stone.tone_color
    };
    const stoneLabel = stone.label || '';
    
    /* Check if this is the user's stone by comparing tone data and label */
    const isUserStone = stone.isUser || (
      userStoneId && 
      stone.tone_id === userStoneId && 
      saved && 
      stone.label === (saved.label || '')
    );
    
    /* Generate consistent position based on index */
    const pos = randomPositionInCircle(rng, cx, cy, 25, clearingR - 22);
    
    /* Add glow for user's stone */
    if (isUserStone) {
      const halo = document.createElementNS(SVG_NS, 'circle');
      halo.setAttribute('cx', pos.x);
      halo.setAttribute('cy', pos.y);
      halo.setAttribute('r', 10);
      halo.setAttribute('fill', tone.color);
      halo.setAttribute('opacity', '0.15');
      halo.classList.add('stone-glow--new');
      svg.appendChild(halo);
    }
    
    /* Create the stone */
    const stoneEl = makeStoneEl(
      tone.shape, pos.x, pos.y, 6.5, tone.color, 0.88, 0
    );
    
    /* Add animation for newly released user stone */
    if (isUserStone && userJustReleased) {
      stoneEl.classList.add('stone--new');
    }
    
    /* Add hover/tap functionality for labels */
    if (stoneLabel) {
      stoneEl.setAttribute('data-label', stoneLabel);
      stoneEl.setAttribute('data-stone-label', stoneLabel);
      stoneEl.style.cursor = 'pointer';
      stoneEl.addEventListener('mouseenter', function(e) {
        showTooltip(e, stoneLabel);
      });
      stoneEl.addEventListener('mouseleave', hideTooltip);
    } else {
      /* Add tone name for stones without custom label */
      const toneName = tone.label || '';
      if (toneName) {
        stoneEl.setAttribute('data-stone-label', toneName);
      }
    }
    
    svg.appendChild(stoneEl);
    
    /* Update "your stone" indicator */
    if (isUserStone) {
      const yourStoneRow  = document.getElementById('your-stone-row');
      const yourStoneIcon = document.getElementById('your-stone-icon');
      if (yourStoneRow && yourStoneIcon) {
        yourStoneIcon.innerHTML = stoneIconHtml(tone.shape, tone.color, 18);
        yourStoneRow.style.display = 'flex';
      }
    }
  });

  /* ── Count line ── */
  const countEl = document.getElementById('clearing-count');
  if (countEl) {
    countEl.textContent =
      totalCount === 0
        ? 'No stones placed yet today'
        : totalCount === 1
        ? '1 stone placed today'
        : `${totalCount} stones placed today`;
  }

  /* ── Legend ── */
  renderLegend();
  
  /* ── Show timeline navigation only if there are past releases ── */
  const timelineNav = document.getElementById('timeline-nav');
  if (timelineNav) {
    const dates = await fetchAvailableDates();
    const hasPastReleases = dates.length > 1;
    if (hasPastReleases) {
      timelineNav.style.display = 'flex';
    } else {
      timelineNav.style.display = 'none';
    }
  }
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

/* ── Tooltip for stone labels ──────────────────────── */
function showTooltip(event, label) {
  const tooltip = document.getElementById('stone-tooltip');
  if (!tooltip || !label) return;
  
  tooltip.textContent = label;
  tooltip.style.display = 'block';
  
  const svgRect = event.target.ownerSVGElement.getBoundingClientRect();
  
  /* Position tooltip near the stone */
  const x = event.clientX - svgRect.left;
  const y = event.clientY - svgRect.top;
  
  tooltip.style.left = x + 'px';
  tooltip.style.top = (y - 40) + 'px';
}

function hideTooltip() {
  const tooltip = document.getElementById('stone-tooltip');
  if (tooltip) {
    tooltip.style.display = 'none';
  }
}

/* ── Share functionality ───────────────────────────── */
function shareClearing() {
  const shareData = {
    title: 'Wetoro',
    text: 'A quiet space to release what you feel — one stone at a time.',
    url: window.location.href
  };
  
  if (navigator.share) {
    navigator.share(shareData).catch(function() {
      /* User cancelled or error - fallback to clipboard */
      fallbackShare();
    });
  } else {
    fallbackShare();
  }
}

function fallbackShare() {
  const url = window.location.href;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(url).then(function() {
      showToastMessage('Link copied to clipboard!');
    }).catch(function() {
      showToastMessage('Share: ' + url);
    });
  } else {
    showToastMessage('Share: ' + url);
  }
}

function showToastMessage(message) {
  /* Create temporary toast notification */
  const toast = document.createElement('div');
  toast.className = 'toast-notification';
  toast.textContent = message;
  document.body.appendChild(toast);
  
  setTimeout(function() {
    if (toast.parentNode === document.body) {
      document.body.removeChild(toast);
    }
  }, 3000);
}

/* ── Timeline navigation ───────────────────────────── */
function initTimeline() {
  const toggleBtn = document.getElementById('btn-timeline-toggle');
  const picker = document.getElementById('timeline-picker');
  
  if (!toggleBtn || !picker) return;
  
  toggleBtn.addEventListener('click', function() {
    const isOpen = picker.style.display === 'flex';
    if (isOpen) {
      picker.style.display = 'none';
    } else {
      picker.style.display = 'flex';
      renderTimelineDates();
    }
  });
}

async function renderTimelineDates() {
  const picker = document.getElementById('timeline-picker');
  if (!picker) return;
  
  picker.innerHTML = '';
  
  /* Get dates that actually have releases stored */
  const storedDates = await fetchAvailableDates();
  
  if (storedDates.length === 0) {
    const msg = document.createElement('p');
    msg.textContent = 'No past releases yet';
    msg.style.cssText = 'color:var(--text-faint);font-size:0.85rem;padding:0.5rem;';
    picker.appendChild(msg);
    return;
  }
  
  storedDates.forEach(function(dateStr) {
    const btn = document.createElement('button');
    btn.className = 'timeline-date-btn';
    btn.type = 'button';
    btn.textContent = formatDateDisplay(dateStr);
    
    if (dateStr === state.currentDate) {
      btn.classList.add('is-active');
    }
    
    btn.addEventListener('click', function() {
      state.currentDate = dateStr;
      document.querySelectorAll('.timeline-date-btn').forEach(function(b) {
        b.classList.remove('is-active');
      });
      btn.classList.add('is-active');
      renderClearingForDate(dateStr);
    });
    
    picker.appendChild(btn);
  });
}

function getStoredReleaseDates() {
  /* Deprecated - use fetchAvailableDates() instead */
  /* Keeping for backwards compatibility */
  const dates = [];
  const today = todayString();
  
  /* Check if there's a release for today */
  if (getSavedRelease()) {
    dates.push(today);
  }
  
  /* In a real implementation with a backend, this would query the database */
  /* For now, just show today if there's a release */
  return dates;
}

async function renderClearingForDate(dateStr) {
  const svg = document.getElementById('clearing-svg');
  if (!svg) return;
  
  const cx = 250, cy = 250;
  const clearingR = 218;
  
  /* Clear and show ground */
  Array.from(svg.childNodes).forEach(function (node) {
    if (node.nodeName !== 'defs') svg.removeChild(node);
  });
  
  function addCircle(r, fill, opacity) {
    const el = document.createElementNS(SVG_NS, 'circle');
    el.setAttribute('cx', cx);
    el.setAttribute('cy', cy);
    el.setAttribute('r', r);
    el.setAttribute('fill', fill);
    if (opacity !== undefined) el.setAttribute('opacity', opacity);
    svg.appendChild(el);
  }
  
  addCircle(248, '#0d1a09');
  addCircle(clearingR, '#1a2b16');
  addCircle(180, 'url(#groundGlow)');
  
  /* Subtle depth rings */
  [225, 180, 130, 80].forEach(function (r, i) {
    const ring = document.createElementNS(SVG_NS, 'circle');
    ring.setAttribute('cx', cx);
    ring.setAttribute('cy', cy);
    ring.setAttribute('r', r);
    ring.setAttribute('fill', 'none');
    ring.setAttribute('stroke', '#2e4828');
    ring.setAttribute('stroke-width', '0.5');
    ring.setAttribute('opacity', String(0.35 - i * 0.06));
    svg.appendChild(ring);
  });
  
  /* Fetch stones for the specified date */
  const stones = await fetchStonesForDate(dateStr);
  
  if (stones.length === 0) {
    const countEl = document.getElementById('clearing-count');
    if (countEl) {
      countEl.textContent = dateStr === todayString() 
        ? 'No stones placed yet today' 
        : 'No stones for this date';
    }
    return;
  }
  
  /* Render stones with consistent seed based on date */
  /* Use a simple hash of the date string to avoid overflow */
  const dateHash = dateStr.split('').reduce((acc, char) => {
    return ((acc << 5) - acc) + char.charCodeAt(0);
  }, 0);
  const rng = createRng(Math.abs(dateHash));
  
  stones.forEach(function(stone) {
    const tone = {
      id: stone.tone_id,
      label: stone.tone_label,
      shape: stone.tone_shape,
      color: stone.tone_color
    };
    const stoneLabel = stone.label || '';
    
    const pos = randomPositionInCircle(rng, cx, cy, 25, clearingR - 22);
    
    const stoneEl = makeStoneEl(
      tone.shape, pos.x, pos.y, 6.5, tone.color, 0.88, 0
    );
    
    if (stoneLabel) {
      stoneEl.setAttribute('data-label', stoneLabel);
      stoneEl.setAttribute('data-stone-label', stoneLabel);
      stoneEl.style.cursor = 'pointer';
      stoneEl.addEventListener('mouseenter', function(e) {
        showTooltip(e, stoneLabel);
      });
      stoneEl.addEventListener('mouseleave', hideTooltip);
    } else {
      const toneName = tone.label || '';
      if (toneName) {
        stoneEl.setAttribute('data-stone-label', toneName);
      }
    }
    
    svg.appendChild(stoneEl);
  });
  
  const countEl = document.getElementById('clearing-count');
  if (countEl) {
    const count = stones.length;
    countEl.textContent = count === 1 ? '1 stone placed' : `${count} stones placed`;
  }
}

function dateToString(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function formatDateDisplay(dateStr) {
  const today = todayString();
  if (dateStr === today) return 'Today';
  
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  if (dateStr === dateToString(yesterday)) return 'Yesterday';
  
  const parts = dateStr.split('-');
  const date = new Date(parts[0], parts[1] - 1, parts[2]);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/* ── Landing animation ─────────────────────────────── */
function animateLandingStory() {
  const storyElements = document.querySelectorAll('.story-fade');
  const enterButton   = document.getElementById('btn-enter');
  const spotlight     = document.getElementById('story-spotlight');
  const spotlightText = document.getElementById('story-spotlight-text');
  const skipVignetteContainer = document.querySelector('.skip-vignette');

  if (storyElements.length === 0) return;

  /* Check if user wants to skip vignette */
  const skipVignette = localStorage.getItem(SKIP_VIGNETTE_KEY) === 'true';

  /* Skip animation if user preference or reduced-motion */
  if (skipVignette || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    storyElements.forEach(function(el) { el.style.opacity = '1'; });
    if (enterButton) {
      enterButton.style.opacity = '1';
      enterButton.style.transition = 'none';
    }
    if (skipVignetteContainer) {
      skipVignetteContainer.style.opacity = '1';
      skipVignetteContainer.style.transition = 'none';
    }
    return;
  }

  const FADE_MS    = 1200;  /* spotlight fade-in / fade-out duration (ms)  */
  const HOLD_MS    = 2600;  /* time shorter sections are fully visible (ms) */
  const HOLD_MS_PARA2 = 5500; /* extended hold for paragraph 2 (longest) */
  const HOLD_MS_PARA4 = 4500; /* extended hold for paragraph 4 */
  const GAP_MS     = 400;   /* pause between sections before next starts   */
  const INITIAL_MS = 1000;  /* delay before the first section appears      */

  /* Phase 1 — flash each section one at a time through the spotlight */
  let cumulativeDelay = INITIAL_MS;
  
  storyElements.forEach(function(el, index) {
    /* Different hold durations for different paragraph lengths */
    let holdDuration = HOLD_MS;
    if (index === 1) holdDuration = HOLD_MS_PARA2; /* paragraph 2 - longest */
    else if (index === 3) holdDuration = HOLD_MS_PARA4; /* paragraph 4 - long */
    const sectionDuration = FADE_MS + holdDuration + FADE_MS + GAP_MS;

    /* Fade spotlight in with this section's text */
    setTimeout(function() {
      spotlightText.innerHTML = el.innerHTML;
      spotlight.setAttribute('aria-hidden', 'false');
      spotlight.style.opacity = '1';
    }, cumulativeDelay);

    /* Fade spotlight out after the hold period */
    setTimeout(function() {
      spotlight.style.opacity = '0';
      spotlight.setAttribute('aria-hidden', 'true');
    }, cumulativeDelay + FADE_MS + holdDuration);

    cumulativeDelay += sectionDuration;
  });

  /* Phase 2 — reveal the full story block once all sections have flashed */
  const revealStart = cumulativeDelay + 600;

  setTimeout(function() {
    storyElements.forEach(function(el) {
      el.style.opacity = '1';
    });
  }, revealStart);

  /* Phase 3 — show the enter button and skip checkbox after the story block has settled */
  if (enterButton) {
    setTimeout(function() {
      enterButton.style.opacity = '1';
      enterButton.style.transition = 'opacity 800ms ease-in';
    }, revealStart + 1400);
  }
  
  if (skipVignetteContainer) {
    setTimeout(function() {
      skipVignetteContainer.style.opacity = '1';
    }, revealStart + 1400);
  }
}

/* ── Voice Input ───────────────────────────────────── */
function initVoiceInput() {
  const voiceBtn = document.getElementById('voice-input-btn');
  const textarea = document.getElementById('release-text');
  
  if (!voiceBtn || !textarea) return;
  
  /* Check for Web Speech API support */
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  
  if (!SpeechRecognition) {
    voiceBtn.style.display = 'none';
    return;
  }
  
  const recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = 'en-US';
  
  let isListening = false;
  let finalTranscript = '';
  
  recognition.onstart = function() {
    isListening = true;
    voiceBtn.classList.add('is-listening');
    voiceBtn.setAttribute('aria-label', 'Stop listening');
  };
  
  recognition.onend = function() {
    isListening = false;
    voiceBtn.classList.remove('is-listening');
    voiceBtn.setAttribute('aria-label', 'Voice input');
  };
  
  recognition.onresult = function(event) {
    let interimTranscript = '';
    
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        finalTranscript += transcript + ' ';
      } else {
        interimTranscript += transcript;
      }
    }
    
    const maxLength = parseInt(textarea.getAttribute('maxlength'), 10);
    const newText = (finalTranscript + interimTranscript).slice(0, maxLength);
    
    textarea.value = newText;
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
  };
  
  recognition.onerror = function(event) {
    console.error('Speech recognition error:', event.error);
    isListening = false;
    voiceBtn.classList.remove('is-listening');
  };
  
  voiceBtn.addEventListener('click', function() {
    if (isListening) {
      recognition.stop();
    } else {
      finalTranscript = textarea.value ? textarea.value + ' ' : '';
      try {
        recognition.start();
      } catch (e) {
        console.error('Failed to start recognition:', e);
      }
    }
  });
}

/* ── Clearing Interactions (Zoom & Mobile Touch) ───── */
function initClearingInteractions() {
  const clearingStage = document.querySelector('.clearing-stage');
  const svg = document.getElementById('clearing-svg');
  
  if (!clearingStage || !svg) return;
  
  const VIEWBOX_HALF_SIZE = 250; /* Half of 500x500 viewBox */
  const MIN_SCALE = 1;
  const MAX_SCALE = 3;
  
  let scale = 1;
  let translateX = 0;
  let translateY = 0;
  let isPanning = false;
  let startX = 0;
  let startY = 0;
  let startTranslateX = 0;
  let startTranslateY = 0;
  let lastTouchDistance = 0;
  
  function updateTransform() {
    svg.style.transform = `scale(${scale}) translate(${translateX}px, ${translateY}px)`;
  }
  
  function constrainTranslation() {
    const maxTranslate = (scale - 1) * VIEWBOX_HALF_SIZE;
    translateX = Math.max(-maxTranslate, Math.min(maxTranslate, translateX));
    translateY = Math.max(-maxTranslate, Math.min(maxTranslate, translateY));
  }
  
  /* Desktop: Mouse wheel zoom */
  clearingStage.addEventListener('wheel', function(e) {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, scale * delta));
    
    if (newScale === MIN_SCALE) {
      scale = MIN_SCALE;
      translateX = 0;
      translateY = 0;
    } else {
      scale = newScale;
      constrainTranslation();
    }
    
    updateTransform();
  }, { passive: false });
  
  /* Desktop: Click and drag to pan when zoomed */
  clearingStage.addEventListener('mousedown', function(e) {
    if (scale <= MIN_SCALE) return;
    isPanning = true;
    startX = e.clientX;
    startY = e.clientY;
    startTranslateX = translateX;
    startTranslateY = translateY;
    clearingStage.classList.add('is-zooming');
  });
  
  document.addEventListener('mousemove', function(e) {
    if (!isPanning) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    translateX = startTranslateX + dx / scale;
    translateY = startTranslateY + dy / scale;
    constrainTranslation();
    updateTransform();
  });
  
  document.addEventListener('mouseup', function() {
    if (isPanning) {
      isPanning = false;
      clearingStage.classList.remove('is-zooming');
    }
  });
  
  /* Mobile: Pinch to zoom */
  clearingStage.addEventListener('touchstart', function(e) {
    if (e.touches.length === 2) {
      e.preventDefault();
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      lastTouchDistance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
    } else if (e.touches.length === 1 && scale > MIN_SCALE) {
      isPanning = true;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      startTranslateX = translateX;
      startTranslateY = translateY;
    }
  }, { passive: false });
  
  clearingStage.addEventListener('touchmove', function(e) {
    if (e.touches.length === 2) {
      e.preventDefault();
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
      
      if (lastTouchDistance > 0) {
        const delta = distance / lastTouchDistance;
        const newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, scale * delta));
        
        if (newScale === MIN_SCALE) {
          scale = MIN_SCALE;
          translateX = 0;
          translateY = 0;
        } else {
          scale = newScale;
          constrainTranslation();
        }
        
        updateTransform();
      }
      
      lastTouchDistance = distance;
    } else if (isPanning && e.touches.length === 1) {
      e.preventDefault();
      const dx = e.touches[0].clientX - startX;
      const dy = e.touches[0].clientY - startY;
      translateX = startTranslateX + dx / scale;
      translateY = startTranslateY + dy / scale;
      constrainTranslation();
      updateTransform();
    }
  }, { passive: false });
  
  clearingStage.addEventListener('touchend', function(e) {
    if (e.touches.length === 0) {
      isPanning = false;
      lastTouchDistance = 0;
    } else if (e.touches.length === 1) {
      lastTouchDistance = 0;
    }
  });
  
  /* Mobile: Tap stone to show label */
  svg.addEventListener('click', function(e) {
    /* Only on touch devices */
    if (!('ontouchstart' in window)) return;
    
    const target = e.target;
    const stoneGroup = target.closest('[data-stone-label]');
    
    if (stoneGroup) {
      e.stopPropagation();
      const label = stoneGroup.getAttribute('data-stone-label');
      showStoneTapLabel(stoneGroup, label);
    }
  });
}

function showStoneTapLabel(stoneElement, label) {
  /* Remove any existing tap labels */
  const existing = document.querySelectorAll('.stone-tap-label');
  existing.forEach(el => el.remove());
  
  const rect = stoneElement.getBoundingClientRect();
  const labelEl = document.createElement('div');
  labelEl.className = 'stone-tap-label';
  labelEl.textContent = label;
  labelEl.style.position = 'fixed';
  labelEl.style.left = rect.left + rect.width / 2 + 'px';
  labelEl.style.top = rect.top + 'px';
  
  document.body.appendChild(labelEl);
  
  /* Auto-remove after 2 seconds */
  setTimeout(function() {
    labelEl.remove();
  }, 2000);
}

function init() {
  /* Render tone grid once */
  renderToneGrid();

  /* Check daily release status */
  const saved = getSavedRelease();

  if (saved) {
    showAlreadyReleased(saved);
  } else {
    /* Animate landing story on first visit */
    animateLandingStory();
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
  
  /* Share button */
  const shareBtn = document.getElementById('btn-share-clearing');
  if (shareBtn) {
    shareBtn.addEventListener('click', shareClearing);
  }
  
  /* Timeline navigation */
  initTimeline();
  
  /* Skip vignette checkbox */
  const skipCheckbox = document.getElementById('skip-vignette-checkbox');
  if (skipCheckbox) {
    skipCheckbox.checked = localStorage.getItem(SKIP_VIGNETTE_KEY) === 'true';
    skipCheckbox.addEventListener('change', function() {
      localStorage.setItem(SKIP_VIGNETTE_KEY, this.checked ? 'true' : 'false');
    });
  }
  
  /* Voice input for textarea */
  initVoiceInput();
  
  /* Clearing zoom and mobile interactions */
  initClearingInteractions();
}

/* ── Bootstrap ──────────────────────────────────────── */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
