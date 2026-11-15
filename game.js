// ===================================================================
//  CATCH THE PHISH – herní logika
// ===================================================================
const $ = (s) => document.querySelector(s);
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const STORE = 'catchthephish_save_v1';
const MODES = {
  normal: { label: 'Normal', pass: 0.66, timer: 0 },   // stačí 4 z 6
  hard: { label: 'Hard', pass: 0.85, timer: 30 }   // potřeba 7 z 8
};
const TIMES = ['8:02', '8:47', '9:15', '10:03', '10:41', '11:20', '12:08', '13:36'];
const COLORS = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6', '#6366f1'];

let save = loadSave();
let mode = 'normal';
let run = null;

// ------------------------------------------------------------ ukládání
function loadSave() {
  try {
    const s = JSON.parse(localStorage.getItem(STORE));
    if (s && s.normal && s.hard) return s;
  } catch (e) { /* nic */ }
  return { normal: { passed: [], best: [] }, hard: { passed: [], best: [] }, history: [], seenHowto: false };
}
function persist() { localStorage.setItem(STORE, JSON.stringify(save)); }

// Index 0–100: Normal levely dávají max 60 bodů, Hard levely max 40 bodů
function securityIndex() {
  const n = LEVELS.length;
  let s = 0;
  for (let i = 0; i < n; i++) {
    s += (save.normal.best[i] || 0) * (60 / n) + (save.hard.best[i] || 0) * (40 / n);
  }
  return Math.round(s);
}

// ------------------------------------------------------------ pomocné
function show(id) {
  document.querySelectorAll('.screen').forEach((s) => s.classList.toggle('active', s.id === id));
  window.scrollTo(0, 0);
  hideTip();
}
function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function colorFor(name) {
  let h = 0;
  for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) % 997;
  return COLORS[h % COLORS.length];
}
function fileIcon(name) {
  const ext = name.split('.').pop().toLowerCase();
  if (['jpg', 'jpeg', 'png'].includes(ext)) return '🖼️';
  if (ext === 'pdf') return '📕';
  if (['pptx', 'ppt'].includes(ext)) return '📙';
  if (['docx', 'docm', 'doc'].includes(ext)) return '📘';
  if (ext === 'zip') return '🗜️';
  return '📄';
}

// ------------------------------------------------------------ MENU
function renderMenu() {
  $('#mode-normal').classList.toggle('sel', mode === 'normal');
  $('#mode-hard').classList.toggle('sel', mode === 'hard');

  const p = save[mode];
  $('#levels').innerHTML = LEVELS.map((lv, i) => {
    const unlocked = i === 0 || p.passed[i - 1];
    const done = p.passed[i];
    const best = p.best[i];
    let status;
    if (done) status = `✔ Dokončeno · nejlépe ${Math.round(best * 100)} %`;
    else if (!unlocked) status = '🔒 Nejdřív dokonči předchozí level';
    else if (best != null) status = `▶ Zkus znovu (nejlépe ${Math.round(best * 100)} %)`;
    else status = '▶ Hrát';
    return `<button class="level-card ${done ? 'done' : ''} ${unlocked ? '' : 'locked'}" data-level="${i}" ${unlocked ? '' : 'disabled'}>
      <div class="lv-num">${i + 1}</div>
      <div class="lv-icon">${unlocked ? lv.icon : '🔒'}</div>
      <h3>Den ${i + 1}: ${lv.title}</h3>
      <p>${lv.subtitle}</p>
      <div class="lv-status">${status}</div>
    </button>`;
  }).join('');

  $('#menu-index').textContent = securityIndex();
  drawChart($('#menu-chart'), save.history.map((h) => h.index));
}

// ------------------------------------------------------------ HRA
function startLevel(i) {
  const lv = LEVELS[i];
  const list = [...lv.emails, ...(mode === 'hard' ? lv.hard : [])];
  run = { level: i, emails: shuffle(list.slice()), idx: 0, results: [], score: 0, inspected: new Set(), timer: null, timeLeft: 0, locked: false };

  $('#g-title').textContent = `Den ${i + 1}: ${lv.title}`;
  $('#g-mode').textContent = MODES[mode].label;
  $('#g-mode').classList.toggle('hard', mode === 'hard');
  $('#g-score').textContent = '0';
  $('#g-timer').classList.toggle('hidden', mode !== 'hard');
  show('game');
  openEmail();
}

function renderInbox() {
  $('#inbox-list').innerHTML = run.emails.map((e, i) => {
    const r = run.results[i];
    let cls = '', st = '';
    if (r) { cls = 'done'; st = r.correct ? '✅' : '❌'; }
    else if (i === run.idx) { cls = 'current'; st = '🔵'; }
    return `<li class="${cls}">
      <div class="avatar" style="background:${colorFor(e.name)}">${e.name[0]}</div>
      <div class="meta"><b>${e.name}</b><span>${e.subject}</span></div>
      <div class="st">${st}</div>
    </li>`;
  }).join('');
  $('#g-progress').textContent = `✉️ ${Math.min(run.idx + 1, run.emails.length)}/${run.emails.length}`;
}

function openEmail() {
  const e = run.emails[run.idx];
  run.locked = false;

  const atts = (e.att || []).map((a, k) => `
    <div class="att lupa" data-key="att${k}" data-real="${esc(a.real || a.show)}" data-bad="${a.bad}" data-hint="${esc(a.hint || '')}">
      ${fileIcon(a.show)} <span>${a.show}</span>
    </div>`).join('');

  $('#reader').innerHTML = `
    <h2>${e.subject}</h2>
    <div class="from-row">
      <div class="avatar" style="background:${colorFor(e.name)}">${e.name[0]}</div>
      <div>
        <div>Od: <span class="lupa sender" data-key="from" data-real="${esc(e.from)}" data-bad="${e.fromBad}" data-hint="${esc(e.fromHint || '')}">${e.name}</span></div>
        <div class="to">Komu: mně · dnes ${TIMES[run.idx] || '14:00'}</div>
      </div>
    </div>
    ${mode === 'normal' ? '<div class="lupa-tip">🔍 Najeď myší na odesílatele, odkazy a přílohy – lupa ti ukáže pravdu.</div>' : ''}
    <div class="mail-body">${e.body}</div>
    ${atts ? `<div class="atts">${atts}</div>` : ''}
    <div class="actions">
      <button class="btn safe" id="btn-safe">✅ Bezpečný</button>
      <button class="btn phish" id="btn-phish">🎣 Phishing</button>
    </div>
    <div id="feedback"></div>`;

  $('#btn-safe').onclick = () => decide('safe');
  $('#btn-phish').onclick = () => decide('phish');
  renderInbox();
  startTimer();
}

function startTimer() {
  clearInterval(run.timer);
  if (mode !== 'hard') return;
  run.timeLeft = MODES.hard.timer;
  updateTimer();
  run.timer = setInterval(() => {
    run.timeLeft--;
    updateTimer();
    if (run.timeLeft <= 0) decide('timeout');
  }, 1000);
}
function updateTimer() {
  const t = $('#g-timer');
  t.textContent = `⏱ ${Math.max(0, run.timeLeft)} s`;
  t.classList.toggle('low', run.timeLeft <= 10);
}

function decide(choice) {
  if (run.locked) return;
  run.locked = true;
  clearInterval(run.timer);
  hideTip();

  const e = run.emails[run.idx];
  const correct = choice !== 'timeout' && (choice === 'phish') === e.phish;
  if (correct) run.score += 100 + (mode === 'hard' ? run.timeLeft * 5 : 0);
  run.results.push({ e, choice, correct });
  $('#g-score').textContent = run.score;

  $('#btn-safe').disabled = true;
  $('#btn-phish').disabled = true;

  let title;
  if (choice === 'timeout') title = `⏰ Čas vypršel! Tohle byl ${e.phish ? 'phishing' : 'bezpečný e-mail'}.`;
  else if (correct && e.phish) title = '🎣 Chyceno! Správně – je to phishing.';
  else if (correct) title = '✅ Správně – e-mail je bezpečný.';
  else if (e.phish) title = '😱 Nachytal(a) ses! Tohle byl phishing.';
  else title = '🚨 Falešný poplach – tenhle e-mail byl v pořádku.';

  const last = run.idx === run.emails.length - 1;
  $('#feedback').innerHTML = `
    <div class="feedback ${correct ? 'ok' : 'bad'}">
      <h3>${title}</h3>
      <p><b>Čeho si všimnout:</b> ${e.explain}</p>
      <button class="btn" id="btn-next">${last ? '📊 Konec dne – výsledky' : 'Další e-mail →'}</button>
    </div>`;
  $('#btn-next').onclick = next;
  $('#btn-next').focus();
  renderInbox();
}

function next() {
  run.idx++;
  if (run.idx >= run.emails.length) finish();
  else openEmail();
}

// ------------------------------------------------------------ VÝSLEDKY
function finish() {
  const r = run.results;
  const total = r.length;
  const correctN = r.filter((x) => x.correct).length;
  const acc = correctN / total;
  const phishes = r.filter((x) => x.e.phish);
  const safes = r.filter((x) => !x.e.phish);
  const caught = phishes.filter((x) => x.correct).length;
  const safeOk = safes.filter((x) => x.correct).length;
  const fell = phishes.filter((x) => !x.correct);
  const falseAlarms = safes.filter((x) => !x.correct);

  const i = run.level;
  const p = save[mode];
  const oldIndex = securityIndex();
  const passed = acc >= MODES[mode].pass;
  p.best[i] = Math.max(p.best[i] || 0, acc);
  if (passed) p.passed[i] = true;
  const newIndex = securityIndex();
  save.history.push({ index: newIndex, label: `${MODES[mode].label} D${i + 1}` });
  persist();

  const need = Math.ceil(MODES[mode].pass * total);
  const hasNext = passed && i + 1 < LEVELS.length;
  const allDone = LEVELS.every((_, k) => p.passed[k]);

  const mistakeItem = (x, label) => `<li><b>${label}: ${x.e.subject}</b>
      <small>Od: ${esc(x.e.name)} &lt;${esc(x.e.from)}&gt;</small>
      ${x.e.explain}</li>`;

  $('#results-box').innerHTML = `
    <h1>📊 Konec dne ${i + 1}: ${LEVELS[i].title}</h1>
    <div class="banner ${passed ? 'win' : 'lose'}">
      ${passed
      ? (allDone ? `🏆 Paráda! Dokončil jsi všechny levely v režimu ${MODES[mode].label}! ${mode === 'normal' ? 'Zkus teď 😈 Hard mode.' : 'Jsi opravdový lovec phishingu!'}`
        : `🎉 Level splněn! ${hasNext ? 'Další level je odemčený.' : ''}`)
      : `😕 Tentokrát to nevyšlo. Potřebuješ aspoň ${need} z ${total} správně. Přečti si vysvětlení a zkus to znovu!`}
    </div>

    <div class="stats">
      <div class="stat c"><b>${Math.round(acc * 100)} %</b><span>Přesnost (${correctN}/${total})</span></div>
      <div class="stat g"><b>${caught}/${phishes.length}</b><span>🎣 Zachycené útoky</span></div>
      <div class="stat g"><b>${safeOk}/${safes.length}</b><span>✅ Správně propuštěné</span></div>
      <div class="stat r"><b>${fell.length}</b><span>😱 Nachytal ses</span></div>
      <div class="stat y"><b>${falseAlarms.length}</b><span>🚨 Falešné poplachy</span></div>
      <div class="stat"><b>${run.score}</b><span>⭐ Body</span></div>
      <div class="stat"><b>${run.inspected.size}</b><span>🔍 Prozkoumáno lupou</span></div>
    </div>

    ${fell.length || falseAlarms.length ? `
      <h3 class="sec">Kde ses spletl(a) a proč</h3>
      <ul class="mistakes">
        ${fell.map((x) => mistakeItem(x, '😱 Phishing')).join('')}
        ${falseAlarms.map((x) => mistakeItem(x, '🚨 Bezpečný e-mail')).join('')}
      </ul>` : '<p class="tipbox">🌟 Bez jediné chyby! Výborná práce.</p>'}

    <div class="tipbox">💡 <b>Pravidlo dne:</b> ${LEVELS[i].tip}</div>

    <h3 class="sec">📈 Index bezpečnostní gramotnosti: ${newIndex}/100
      ${newIndex > oldIndex ? `<span style="color:var(--green)">(+${newIndex - oldIndex})</span>` : ''}</h3>
    <canvas id="res-chart" class="chart"></canvas>

    <div class="res-actions">
      ${hasNext ? '<button class="btn primary" id="btn-nextlvl">Další level →</button>' : ''}
      <button class="btn ghost" id="btn-retry">🔁 Hrát znovu</button>
      <button class="btn ghost" id="btn-menu">🏠 Menu</button>
    </div>`;

  show('results');
  drawChart($('#res-chart'), save.history.map((h) => h.index));

  if (hasNext) $('#btn-nextlvl').onclick = () => startLevel(i + 1);
  $('#btn-retry').onclick = () => startLevel(i);
  $('#btn-menu').onclick = () => { renderMenu(); show('menu'); renderMenu(); };
}

// ------------------------------------------------------------ GRAF
function drawChart(cv, vals) {
  const dpr = window.devicePixelRatio || 1;
  const w = cv.clientWidth || 300, h = cv.clientHeight || 170;
  cv.width = w * dpr; cv.height = h * dpr;
  const c = cv.getContext('2d');
  c.scale(dpr, dpr);
  c.clearRect(0, 0, w, h);

  const pad = { l: 34, r: 16, t: 14, b: 22 };
  const pw = w - pad.l - pad.r, ph = h - pad.t - pad.b;
  c.font = '11px Segoe UI, sans-serif';

  // mřížka
  for (let v = 0; v <= 100; v += 25) {
    const y = pad.t + ph - (v / 100) * ph;
    c.strokeStyle = 'rgba(142,160,189,.2)';
    c.beginPath(); c.moveTo(pad.l, y); c.lineTo(w - pad.r, y); c.stroke();
    c.fillStyle = '#8ea0bd'; c.fillText(v, 6, y + 4);
  }

  const data = [0, ...vals].slice(-15);
  if (vals.length === 0) {
    c.fillStyle = '#8ea0bd';
    c.fillText('Zahraj si první level a graf začne růst 📈', pad.l + 10, pad.t + ph / 2);
    return;
  }
  const step = pw / Math.max(1, data.length - 1);
  const pt = (v, k) => [pad.l + k * step, pad.t + ph - (v / 100) * ph];

  // výplň
  const grad = c.createLinearGradient(0, pad.t, 0, pad.t + ph);
  grad.addColorStop(0, 'rgba(34,211,238,.35)');
  grad.addColorStop(1, 'rgba(34,211,238,0)');
  c.beginPath();
  data.forEach((v, k) => { const [x, y] = pt(v, k); k ? c.lineTo(x, y) : c.moveTo(x, y); });
  c.lineTo(pad.l + (data.length - 1) * step, pad.t + ph);
  c.lineTo(pad.l, pad.t + ph);
  c.fillStyle = grad; c.fill();

  // čára
  c.beginPath();
  data.forEach((v, k) => { const [x, y] = pt(v, k); k ? c.lineTo(x, y) : c.moveTo(x, y); });
  c.strokeStyle = '#22d3ee'; c.lineWidth = 3; c.stroke();

  // body
  data.forEach((v, k) => {
    const [x, y] = pt(v, k);
    c.beginPath(); c.arc(x, y, 4, 0, Math.PI * 2);
    c.fillStyle = '#fff'; c.fill();
  });
  const [lx, ly] = pt(data[data.length - 1], data.length - 1);
  c.fillStyle = '#22d3ee'; c.font = 'bold 13px Segoe UI, sans-serif';
  c.fillText(data[data.length - 1], Math.min(lx - 8, w - pad.r - 22), Math.max(ly - 10, 12));
  c.fillStyle = '#8ea0bd'; c.font = '11px Segoe UI, sans-serif';
  c.fillText('odehraná kola →', w - pad.r - 90, h - 6);
}

// ------------------------------------------------------------ LUPA (tooltip)
const tip = $('#tooltip');
function showTip(el, x, y) {
  const bad = el.dataset.bad;
  const hint = el.dataset.hint;
  const icon = { 0: '✔', 1: '⚠️', 2: '🤔' }[bad] || '';
  let html = `<div class="tip-title">🔍 Detektivní lupa</div><div class="tip-real">${esc(el.dataset.real)}</div>`;
  if (mode === 'normal' && hint) html += `<div class="tip-hint b${bad}">${icon} ${hint}</div>`;
  tip.innerHTML = html;
  tip.classList.remove('hidden');
  moveTip(x, y);
  if (run && el.dataset.key !== undefined) run.inspected.add(run.idx + ':' + el.dataset.key);
  else if (run) run.inspected.add(run.idx + ':' + el.dataset.real);
}
function moveTip(x, y) {
  const r = tip.getBoundingClientRect();
  let left = x + 16, top = y + 18;
  if (left + r.width > window.innerWidth - 8) left = window.innerWidth - r.width - 8;
  if (top + r.height > window.innerHeight - 8) top = y - r.height - 12;
  tip.style.left = Math.max(8, left) + 'px';
  tip.style.top = Math.max(8, top) + 'px';
}
function hideTip() { tip.classList.add('hidden'); }

document.addEventListener('mouseover', (ev) => {
  const el = ev.target.closest('.lupa');
  if (el) showTip(el, ev.clientX, ev.clientY);
});
document.addEventListener('mousemove', (ev) => {
  if (!tip.classList.contains('hidden') && ev.target.closest('.lupa')) moveTip(ev.clientX, ev.clientY);
});
document.addEventListener('mouseout', (ev) => {
  const el = ev.target.closest('.lupa');
  if (el && !el.contains(ev.relatedTarget)) hideTip();
});
// klepnutí (mobil) – odkazy nikam nevedou, jen se ukáže lupa
document.addEventListener('click', (ev) => {
  const el = ev.target.closest('.lupa');
  if (el) {
    ev.preventDefault();
    const r = el.getBoundingClientRect();
    showTip(el, r.left, r.bottom);
  } else if (!ev.target.closest('.tooltip')) hideTip();
});

// ------------------------------------------------------------ OVLÁDÁNÍ
document.querySelectorAll('.mode').forEach((b) => {
  b.onclick = () => { mode = b.dataset.mode; renderMenu(); };
});
$('#levels').addEventListener('click', (ev) => {
  const card = ev.target.closest('.level-card');
  if (card && !card.disabled) startLevel(+card.dataset.level);
});
$('#btn-quit').onclick = () => {
  if (confirm('Opravdu ukončit den? Postup v tomto levelu se neuloží.')) {
    clearInterval(run.timer);
    renderMenu(); show('menu'); renderMenu();
  }
};
$('#btn-howto').onclick = () => $('#howto').classList.remove('hidden');
$('#btn-howto-close').onclick = () => {
  $('#howto').classList.add('hidden');
  save.seenHowto = true; persist();
};
$('#btn-reset').onclick = () => {
  if (confirm('Opravdu smazat celý postup a statistiky?')) {
    localStorage.removeItem(STORE);
    save = loadSave();
    renderMenu();
  }
};
window.addEventListener('resize', () => {
  if ($('#menu').classList.contains('active')) drawChart($('#menu-chart'), save.history.map((h) => h.index));
  if ($('#results').classList.contains('active') && $('#res-chart')) drawChart($('#res-chart'), save.history.map((h) => h.index));
});

// start
renderMenu();
if (!save.seenHowto) $('#howto').classList.remove('hidden');
