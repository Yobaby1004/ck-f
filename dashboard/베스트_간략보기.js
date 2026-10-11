/* 🏅 베스트 달력 간략 보기 (2026-10-06 사용자 지시 = "베스트 버튼에 연결된 달력 내용이 너무 길어서 아래로 스크롤을 너무 내려야 해 · 달력에는 간략하게 보이고 클릭하면 해당 내용이 다 제대로 보이도록")
   한마디로: 칸에는 매매법 묶음 글자 + 종목 수만 작게 보이고, 칸을 누르면 상세창 맨 위에 ① 묶음 바로가기 ② 그 칸 내용 전체(여러 단)가 나온 뒤 기존 매매법별 자세한 표가 이어진다.
   - 기존 자료·함수(renderBestCalendar · buildBestCell · openBestDetail · 어사이드16~50 감싸기)는 그대로다. 다 그려진 칸(DOM)에 요약 줄을 더하고 나머지를 CSS 로 접는다.
   - 📦 버튼 = 간략 보기 켬/끔(끄면 예전 그대로 칸에 전부) · 캘린더를 열 때마다 켬으로 시작(2026-10-06 사용자 "기본적으로 간략하게" · 끔은 이번 창에서만).
   - 칩(묶음 글자)을 누르면 상세창의 그 매매법 표로 바로 간다. 표가 없는 묶음(예: '없음')은 상세창 위 '칸 내용 전체'의 그 묶음으로 간다.
   - 칩 숫자 = 칸에 적힌 종목 수다(매매법마다 산 것·후보·관찰 뜻이 다르다 → 칩에 마우스를 올리면 그 묶음 첫 줄이 그대로 보인다). 흐린 칩 = 종목 0 · 없음·막힘·관찰만.
   - 이 파일은 어사이드50_뷰.js 뒤에 읽는다. 뒤에 다른 감싸기가 붙어도 그려진 칸·열린 상세창을 직접 보고 처리하므로 그대로 동작한다. */
(function () {
  'use strict';
  if (window.__bestCompactInstalled) return;
  if (['renderBestCalendar', 'buildBestCell', 'openBestDetail'].some(n => typeof window[n] !== 'function')) {
    console.error('베스트 간략 보기: 베스트 달력 함수가 없습니다'); return;
  }
  window.__bestCompactInstalled = true;

  const KEY = 'best_compact_v1';
  let _on = true;                                                    // ★2026-10-06 사용자 "캘린더 창을 열면 기본적으로 간략하게" = 열 때마다 간략 보기 켬(끔을 기억하지 않음)
  try { localStorage.removeItem(KEY); } catch (e) { /* 옛 기억 지움 */ }
  const isOn = () => _on;
  const setOn = v => { _on = !!v; };
  const esc = v => String(v == null ? '' : v).replace(/[&<>"']/g, ch => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[ch]));
  const LAYER = /\baside\d+-layer\b/;

  const css = `
#best-view.bz-on .cal-cell[data-bz] > :not(.cell-day):not(.bz-sum){display:none !important}
#best-view:not(.bz-on) .cal-cell > .bz-sum{display:none}
.bz-sum{margin-top:2px}
.bz-head{font-size:9.5px;color:#8487bd;margin:1px 0 3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.bz-head b{color:#e4e6ff;font-weight:700}
.bz-chips{display:flex;flex-wrap:wrap;gap:2px}
.bz-chip{display:inline-flex;align-items:center;font-size:10.5px;line-height:15px;padding:0 3px 0 2px;border-radius:6px;background:rgba(255,255,255,.045);border:1px solid rgba(255,255,255,.08);white-space:nowrap;cursor:pointer;user-select:none}
.bz-chip:hover{background:rgba(255,255,255,.15);border-color:rgba(255,255,255,.3)}
.bz-chip i{font-style:normal;font-weight:700;font-size:9.5px;color:#e4e6ff;margin-left:1px}
.bz-chip.z{opacity:.36}
#bz-top{margin:0 0 18px;padding:0 2px 14px;border-bottom:1px solid #2a2d4a}
#bz-top .bz-title{font-size:19px;font-weight:700;color:#ffd700}
#bz-top .bz-sub{font-size:12px;color:#8487bd;margin:4px 0 9px;line-height:1.5}
#bz-top .bz-chips{gap:5px;margin-bottom:12px}
#bz-top .bz-chip{font-size:14px;line-height:22px;padding:0 8px 0 6px;border-radius:10px}
#bz-top .bz-chip i{font-size:12.5px;margin-left:3px}
#bz-top .bz-grid{column-width:236px;column-gap:12px;zoom:1.12}
#bz-top .bz-block{break-inside:avoid;margin:0 0 6px;padding:3px 6px 4px;border-radius:6px;background:rgba(255,255,255,.028);border:1px solid rgba(255,255,255,.06);cursor:pointer}
#bz-top .bz-block:hover{border-color:rgba(255,215,0,.35)}
#bz-top .bz-block > div:first-child{border-top:0 !important;margin-top:0 !important;padding-top:0 !important}
#bz-top .bz-more{font-size:12px;color:#8487bd;margin-top:10px}
.bz-flash{outline:2px solid #ffd700 !important;outline-offset:3px;border-radius:4px}
`;
  const st = document.createElement('style'); st.id = 'bz-style'; st.textContent = css; document.head.appendChild(st);

  // ── 칸 안 묶음 나누기: 기본 묶음(1위패턴 · 🅰~🅾) = 머리 줄 + .cell-themes · 어사이드16~ = .asideN-layer 한 덩어리
  function groupsOf(nodes) {
    const out = [];
    let cur = null;
    nodes.forEach(el => {
      if (!el || el.nodeType !== 1 || el.classList.contains('bz-sum')) return;
      if (LAYER.test(el.className || '')) { cur = null; out.push({kind: 'layer', els: [el]}); return; }
      if (el.classList.contains('cell-themes')) {
        if (!el.textContent.trim()) { cur = null; return; }
        if (cur && cur.els.length === 1) { cur.els.push(el); cur = null; return; }
        out.push({kind: 'base', els: [el]}); cur = null; return;
      }
      if (!el.textContent.trim()) return;
      cur = {kind: 'base', els: [el]}; out.push(cur);
    });
    return out.map(describe).filter(Boolean);
  }
  function headLine(g) {
    const h = g.els[0];
    if (g.kind === 'base') return h.textContent.replace(/\s+/g, ' ').trim();
    const c = h.cloneNode(true);
    Array.from(c.children).forEach(ch => { if (ch.tagName === 'DIV') ch.remove(); });
    const t = c.textContent.replace(/\s+/g, ' ').trim();
    return t || h.textContent.replace(/\s+/g, ' ').trim().slice(0, 80);
  }
  function describe(g) {
    const h = g.els[0];
    const text = (h.textContent || '').replace(/\s+/g, ' ').trim();
    if (!text) return null;
    const badge = /^신호/.test(text) ? '🏅' : (Array.from(text)[0] || '•');
    let n;
    if (g.kind === 'base') {
      const b = h.querySelector('b');
      const bt = b ? b.textContent.trim() : '';
      n = /^\d+$/.test(bt) ? +bt : (g.els[1] ? g.els[1].querySelectorAll('b').length : 0);
    } else {
      const m = headLine(g).match(/(\d+)\s*종목/);           // 묶음 첫 줄에 'N종목'이 있으면 그 숫자(칸에는 일부만 적힌 묶음도 있음)
      n = m ? +m[1] : h.querySelectorAll('b').length - 1;     // 없으면 굵은 글씨 수 − 1(첫 굵은 글씨 = 묶음 이름)
      if (n < 0) n = 0;
    }
    let color = '#c9cbe8', op = 1;
    try { const cs = getComputedStyle(h); color = cs.color || color; op = parseFloat(cs.opacity || '1'); } catch (e) { /* 계산 못 하면 기본색 */ }
    return {kind: g.kind, els: g.els, badge, n, color, dim: n === 0 || op < 0.95, first: headLine(g)};
  }
  function chipsHTML(gs) {
    return gs.map((g, i) => `<span class="bz-chip${g.dim ? ' z' : ''}" data-i="${i}" data-badge="${esc(g.badge)}" style="color:${esc(g.color)}" title="${esc(g.first)} · 누르면 이 묶음 자세히">${esc(g.badge)}${g.n ? `<i>${g.n}</i>` : ''}</span>`).join('');
  }
  function totals(gs) {
    return {tot: gs.reduce((s, g) => s + (g.n || 0), 0), live: gs.filter(g => !g.dim).length};
  }

  // ── 달력 칸 접기 (그려진 칸에 요약 줄만 더함 · 원래 내용은 그대로 두고 CSS 로 숨김 = 다른 스크립트 영향 없음)
  function compactCell(cell) {
    if (cell.hasAttribute('data-bz')) return;
    cell.setAttribute('data-bz', '1');
    const kids = Array.from(cell.children).filter(el => !el.classList.contains('cell-day'));
    const gs = groupsOf(kids);
    if (!gs.length) return;
    const {tot, live} = totals(gs);
    const sum = document.createElement('div');
    sum.className = 'bz-sum';
    sum.innerHTML = `<div class="bz-head" title="종목 있는 묶음 ${live} / 전체 묶음 ${gs.length} · 칸에 적힌 종목 ${tot} · 칸을 누르면 전체 · 글자를 누르면 그 묶음">📦 <b>${live}</b>/${gs.length}묶음 · <b>${tot}</b>종목</div><div class="bz-chips">${chipsHTML(gs)}</div>`;
    const day = cell.querySelector(':scope > .cell-day');
    if (day) day.insertAdjacentElement('afterend', sum); else cell.insertBefore(sum, cell.firstChild);
  }
  function compactAll() {
    const view = document.getElementById('best-view'); if (!view) return;
    view.classList.toggle('bz-on', isOn());
    if (!isOn()) return;                                             // 끔 = 예전 그대로(요약 줄을 만들지도 않음)
    view.querySelectorAll('.cal-cell:not([data-bz])').forEach(cell => {
      try { compactCell(cell); } catch (e) { console.warn('베스트 간략 보기: 칸 접기 실패', cell.dataset.date, e); }
    });
  }

  // ── 상세창 위 '칸 내용 전체' + 묶음 바로가기
  function freshCell(k) {
    const dt = new Date(k + 'T00:00:00');
    if (isNaN(dt)) return null;
    let html = '';
    try {
      const A = typeof window._bestArch === 'function' ? window._bestArch() : {};
      html = window.buildBestCell(dt.getDate(), k, (A || {})[k], false, dt.getDay());
    } catch (e) { console.warn('베스트 간략 보기: 칸 만들기 실패', k, e); return null; }
    const host = document.createElement('div');
    host.style.cssText = 'position:absolute;left:-12000px;top:0;width:260px;visibility:hidden;pointer-events:none';
    host.innerHTML = html;
    document.body.appendChild(host);
    return host;
  }
  function decorate(k) {
    const body = document.getElementById('stock-modal-body'); if (!body) return;
    const prev = document.getElementById('bz-top'); if (prev) prev.remove();
    const host = freshCell(k); if (!host) return;
    try {
      const cell = host.firstElementChild;
      const gs = cell ? groupsOf(Array.from(cell.children).filter(el => !el.classList.contains('cell-day'))) : [];
      if (!gs.length) return;
      const {tot, live} = totals(gs);
      const blocks = gs.map((g, i) => `<div class="bz-block" data-i="${i}" data-badge="${esc(g.badge)}" title="누르면 이 묶음 자세한 표로">${g.els.map(el => el.outerHTML).join('')}</div>`).join('');
      const top = document.createElement('div');
      top.id = 'bz-top';
      top.innerHTML = `<div class="bz-title">📅 ${esc(k)} 칸 전체 · 종목 있는 묶음 ${live}/${gs.length} · 종목 ${tot}</div>`
        + `<div class="bz-sub">글자를 누르면 그 매매법의 자세한 표로 바로 갑니다(표가 없는 묶음은 아래 칸 내용으로) · 아래 칸 내용은 달력 칸에 있던 그대로 · <b style="color:#ff9aaa">관찰용 · 매수추천 아님</b></div>`
        + `<div class="bz-chips">${chipsHTML(gs)}</div>`
        + `<div class="bz-grid">${blocks}</div>`
        + `<div class="bz-more">▼ 아래 = 매매법별 자세한 표(기존 상세창 그대로)</div>`;
      body.insertBefore(top, body.firstChild);
      const box = document.getElementById('stock-modal-box'); if (box) box.scrollTop = 0;
    } finally { host.remove(); }
  }
  function sectionOf(badge) {
    const body = document.getElementById('stock-modal-body'); if (!body) return null;
    const top = document.getElementById('bz-top');
    const cands = body.querySelectorAll('h1,h2,h3,h4,div[style*="font-size:16px"],div[style*="font-size:17px"],div[style*="font-size:18px"],div[style*="font-size:19px"],div[style*="font-size:20px"]');
    for (const el of cands) {
      if (top && top.contains(el)) continue;
      if ((el.textContent || '').trim().startsWith(badge)) return el;
    }
    return null;
  }
  function jump(badge, i) {
    let el = sectionOf(badge);
    if (!el) el = document.querySelector(`#bz-top .bz-block[data-i="${i}"]`);
    if (!el) return;
    el.scrollIntoView({block: 'start', behavior: 'smooth'});
    el.classList.add('bz-flash');
    setTimeout(() => el.classList.remove('bz-flash'), 1500);
  }

  // ── 감싸기 (맨 바깥 · 원래 함수는 그대로 부름)
  const oldRender = window.renderBestCalendar;
  window.renderBestCalendar = function () {
    const r = oldRender.apply(this, arguments);
    try { compactAll(); } catch (e) { console.warn('베스트 간략 보기: 칸 접기 실패', e); }
    return r;
  };
  const oldDetail = window.openBestDetail;
  window.openBestDetail = function (k) {
    const r = oldDetail.apply(this, arguments);
    try {
      const ov = document.getElementById('stock-modal-overlay');
      if (isOn() && ov && ov.style.display !== 'none' && getComputedStyle(ov).display !== 'none') decorate(k);
    } catch (e) { console.warn('베스트 간략 보기: 상세창 꾸미기 실패', e); }
    return r;
  };

  // ── 클릭: 달력 칩 = 그 묶음으로 바로(칸 클릭보다 먼저 받음) · 상세창 칩/칸 덩어리 = 그 묶음 표로
  const view = document.getElementById('best-view');
  if (view) {
    view.addEventListener('click', e => {
      const chip = e.target && e.target.closest ? e.target.closest('.bz-chip') : null; if (!chip) return;
      const cell = chip.closest('.cal-cell'); const k = cell && cell.dataset.date; if (!k) return;
      e.stopPropagation(); e.preventDefault();
      window.openBestDetail(k);
      const badge = chip.dataset.badge, i = chip.dataset.i;
      setTimeout(() => jump(badge, i), 60);
    }, true);
    new MutationObserver(() => { try { compactAll(); } catch (e) { /* 다음 그리기 때 다시 */ } }).observe(view, {childList: true});
  }
  document.addEventListener('click', e => {
    const t = e.target && e.target.closest ? e.target : null; if (!t) return;
    const chip = t.closest('#bz-top .bz-chip');
    if (chip) { e.preventDefault(); jump(chip.dataset.badge, chip.dataset.i); return; }
    const blk = t.closest('#bz-top .bz-block');
    if (blk && !t.closest('[onclick]')) { const el = sectionOf(blk.dataset.badge); if (el) { el.scrollIntoView({block: 'start', behavior: 'smooth'}); el.classList.add('bz-flash'); setTimeout(() => el.classList.remove('bz-flash'), 1500); } }
  });

  // ── 📦 켬/끔 버튼 (📖 설명 보기 옆)
  function addToggle() {
    if (document.getElementById('bz-toggle')) return;
    const ref = document.getElementById('best-desc-btn'); if (!ref) return;
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'today-btn'; b.id = 'bz-toggle'; b.style.marginLeft = '6px';
    const paint = () => {
      b.textContent = isOn() ? '📦 간략 보기 켬' : '📦 간략 보기 끔';
      b.title = isOn() ? '지금 = 칸에 묶음 글자·종목 수만 · 칸을 누르면 전체 · 누르면 예전처럼 칸에 전부 보이기'
                       : '지금 = 칸에 전부(예전 그대로) · 누르면 칸을 간략하게';
    };
    paint();
    b.addEventListener('click', () => { setOn(!isOn()); paint(); compactAll(); });
    ref.insertAdjacentElement('afterend', b);
  }
  addToggle();
  compactAll();                                                      // 이미 그려진 칸이 있으면 바로 접기
})();
