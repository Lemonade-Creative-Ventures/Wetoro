/* ════════════════════════════════════════════════════
   The Clearing — app.js
   ════════════════════════════════════════════════════ */

'use strict';

/* ── Constants ─────────────────────────────────────── */

const TONES = [
  /* Circles - Mixed */
  { id: 'grief',          label: 'Grief',          shape: 'circle',   color: '#3a5a8c' },
  { id: 'happy',          label: 'Happy',          shape: 'circle',   color: '#e8b84d' },
  { id: 'worry',          label: 'Worry',          shape: 'circle',   color: '#b8973a' },
  { id: 'hopeful',        label: 'Hopeful',        shape: 'circle',   color: '#7ab88f' },
  /* Squares - Mixed */
  { id: 'anger',          label: 'Anger',          shape: 'square',   color: '#c0392b' },
  { id: 'grateful',       label: 'Grateful',       shape: 'square',   color: '#6b9c7a' },
  { id: 'frustration',    label: 'Frustration',    shape: 'square',   color: '#d97f3a' }, /* changed from #cc5522 - more distinct orange */
  { id: 'content',        label: 'Content',        shape: 'square',   color: '#8fb88a' },
  /* Diamonds - Mixed */
  { id: 'sadness',        label: 'Sadness',        shape: 'diamond',  color: '#5575a8' },
  { id: 'peaceful',       label: 'Peaceful',       shape: 'diamond',  color: '#6dd4c5' }, /* changed from #87bcb5 - more turquoise */
  { id: 'exhaustion',     label: 'Exhaustion',     shape: 'diamond',  color: '#6b6b6b' },
  { id: 'relieved',       label: 'Relieved',       shape: 'diamond',  color: '#98d4b3' }, /* changed from #a5c9b3 - more saturated green-teal */
  /* Triangles - Mixed */
  { id: 'anxiety',        label: 'Anxiety',        shape: 'triangle', color: '#c9851a' },
  { id: 'excited',        label: 'Excited',        shape: 'triangle', color: '#f0a650' },
  { id: 'overwhelm',      label: 'Overwhelm',      shape: 'triangle', color: '#d4621a' },
  { id: 'calm',           label: 'Calm',           shape: 'triangle', color: '#a0d9af' }, /* changed from #a0c9af - brighter green */
  /* Stars - Mixed */
  { id: 'loneliness',     label: 'Loneliness',     shape: 'star',     color: '#1e7a62' },
  { id: 'joyful',         label: 'Joyful',         shape: 'star',     color: '#f5c76d' },
  { id: 'heartache',      label: 'Heartache',      shape: 'star',     color: '#b84d9a' },
  { id: 'loved',          label: 'Loved',          shape: 'star',     color: '#e5a5d9' }, /* changed from #d4a5c9 - more pink */
  /* Hexagons - Mixed */
  { id: 'fear',           label: 'Fear',           shape: 'hexagon',  color: '#6b2d8a' },
  { id: 'proud',          label: 'Proud',          shape: 'hexagon',  color: '#8a9fc9' },
  { id: 'loss',           label: 'Loss',           shape: 'hexagon',  color: '#1e3a60' },
  { id: 'inspired',       label: 'Inspired',       shape: 'hexagon',  color: '#c9a8d4' },
];

const STORAGE_KEY = 'wetoro-release';
const LEGACY_STORAGE_KEY = 'the-clearing-release';
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
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
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

function startRelease() {
  const textarea = document.getElementById('release-text');
  const text     = textarea ? textarea.value.trim() : '';

  /* Save to localStorage before text is lost */
  if (state.selectedTone) {
    saveRelease(state.selectedTone, state.stoneLabel);
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

  /* ── Only show actual user stone (no fake stones) ── */
  const saved = getSavedRelease();
  let totalCount = 0;

  if (saved && saved.tone) {
    totalCount = 1;
    const userTone = saved.tone;
    const userLabel = saved.label || '';

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
    
    /* Add hover functionality if there's a label */
    if (userLabel) {
      userStone.setAttribute('data-label', userLabel);
      userStone.style.cursor = 'pointer';
      userStone.addEventListener('mouseenter', function(e) {
        showTooltip(e, userLabel);
      });
      userStone.addEventListener('mouseleave', hideTooltip);
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
    const hasPastReleases = getStoredReleaseDates().length > 1;
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

function renderTimelineDates() {
  const picker = document.getElementById('timeline-picker');
  if (!picker) return;
  
  picker.innerHTML = '';
  
  /* Get dates that actually have releases stored */
  const storedDates = getStoredReleaseDates();
  
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
  /* Get all dates with stored releases from localStorage */
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

function renderClearingForDate(dateStr) {
  /* This would load clearing data for the specified date */
  /* For now, only today's data is available in localStorage */
  if (dateStr === todayString()) {
    renderClearing(false);
  } else {
    /* Show empty clearing for past dates (no data stored) */
    const svg = document.getElementById('clearing-svg');
    if (!svg) return;
    
    /* Clear and show ground only */
    Array.from(svg.childNodes).forEach(function (node) {
      if (node.nodeName !== 'defs') svg.removeChild(node);
    });
    
    const cx = 250, cy = 250;
    const clearingR = 218;
    
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
    
    const countEl = document.getElementById('clearing-count');
    if (countEl) {
      countEl.textContent = 'No data for this date';
    }
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

  if (storyElements.length === 0) return;

  /* Respect reduced-motion preference — reveal everything immediately */
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    storyElements.forEach(function(el) { el.style.opacity = '1'; });
    if (enterButton) {
      enterButton.style.opacity = '1';
      enterButton.style.transition = 'none';
    }
    return;
  }

  const FADE_MS    = 1200;  /* spotlight fade-in / fade-out duration (ms)  */
  const HOLD_MS    = 2600;  /* time shorter sections are fully visible (ms) */
  const HOLD_MS_LONG = 3400; /* extended hold for longer paragraphs (2, 4) */
  const GAP_MS     = 400;   /* pause between sections before next starts   */
  const INITIAL_MS = 1000;  /* delay before the first section appears      */

  /* Phase 1 — flash each section one at a time through the spotlight */
  let cumulativeDelay = INITIAL_MS;
  
  storyElements.forEach(function(el, index) {
    const isLongerParagraph = (index === 1 || index === 3); /* paragraphs 2 and 4 */
    const holdDuration = isLongerParagraph ? HOLD_MS_LONG : HOLD_MS;
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

  /* Phase 3 — show the enter button after the story block has settled */
  if (enterButton) {
    setTimeout(function() {
      enterButton.style.opacity = '1';
      enterButton.style.transition = 'opacity 800ms ease-in';
    }, revealStart + 1400);
  }
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
}

/* ── Bootstrap ──────────────────────────────────────── */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
