/* 어사이드54: 전날 상승률 상위3 일반주 관찰명단. 매수 수익률로 표시하지 않는다. */
(function () {
  'use strict';
  if (window.__aside54Installed) return;
  if (['buildBestCell', 'renderBestMonthStrip', 'renderBestMeta', 'openBestDetail'].some(k => typeof window[k] !== 'function')) { console.warn('어사이드54: 베스트 함수가 없습니다'); return; }
  window.__aside54Installed = true;
  const COLOR = '#8fcbb0', LINE = '#30483e', BADGE = '㊃';
  const arch = () => window.어사이드54_ARCHIVE || {};
  const names = () => window.어사이드54_NAMES || {};
  const esc = v => String(v == null ? '' : v).replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));
  const pct = v => v == null || !Number.isFinite(Number(v)) ? '미확인' : `${Number(v) >= 0 ? '+' : ''}${Number(v).toFixed(2)}%`;
  const ymd = v => /^\d{8}$/.test(String(v)) ? `${String(v).slice(0, 4)}-${String(v).slice(4, 6)}-${String(v).slice(6)}` : String(v || '');
  const nm = x => (names()[x[0]] || [x[0]])[0];
  const result = x => x[4] === 'P' ? '예정' : x[4] === 'U' ? '미확인' : `${x[6] === 1 ? '+20% 정답' : '오답'} ${pct(x[5])}`;
  const rowValid = r => r && Array.isArray(r.a);
  const oldCell = window.buildBestCell;
  window.buildBestCell = function (d, k) {
    let html = oldCell.apply(this, arguments); const r = arch()[k];
    if (!rowValid(r) || typeof html !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(k)) return html;
    let layer = `<div class="aside54-layer" style="border-top:1px dashed ${LINE};margin-top:4px;padding-top:3px;color:${COLOR};font-size:10px" title="전날 상승률 상위3 일반주 · 신호일 ${esc(ymd(r.sd))} · 관찰용·매수추천 아님"><b>${BADGE} 어사이드54</b> ${r.a.length}종목`;
    r.a.forEach(x => { layer += `<div style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis" title="전날 ${pct(x[3])} · 당일 ${pct(x[5])} · ${esc(result(x))}">${x[1]}. <b>${esc(nm(x))}</b> <span style="opacity:.8">${esc(result(x))}</span></div>`; });
    if (!r.a.length) layer += '<div>선정 없음 · 자료 부족과 구분 필요</div>';
    layer += '</div>';
    if (r.a.length) html = html.replace(/^\s*<div\b[^>]*>/, root => {
      if (/\bclass="/.test(root)) root = root.replace(/\bclass="([^"]*)"/, (all, cls) => `class="${cls}${/(^|\s)has-data(\s|$)/.test(cls) ? '' : ' has-data'}"`);
      if (!/\bonclick\s*=/.test(root)) root = root.replace('<div', `<div onclick="openBestDetail('${k}')"`);
      return root;
    });
    const end = html.lastIndexOf('</div>'); return end < 0 ? html : html.slice(0, end) + layer + html.slice(end);
  };
  const oldStrip = window.renderBestMonthStrip;
  window.renderBestMonthStrip = function () {
    const value = oldStrip.apply(this, arguments), strip = document.getElementById('best-month-strip');
    if (!strip || typeof bestY === 'undefined') return value;
    Array.from(strip.children).forEach((btn, i) => {
      const prefix = `${bestY}-${String(i + 1).padStart(2, '0')}-`;
      const n = Object.entries(arch()).reduce((s, [k, r]) => s + (k.startsWith(prefix) ? r.n || 0 : 0), 0);
      btn.title = btn.title.replace(/ · 어사이드54 \d+종목$/, '');
      if (n) { btn.title += ` · 어사이드54 ${n}종목`; if (typeof bestM === 'undefined' || i + 1 !== bestM) btn.classList.add('has-data'); }
    }); return value;
  };
  const oldMeta = window.renderBestMeta;
  window.renderBestMeta = function () {
    const value = oldMeta.apply(this, arguments), el = document.getElementById('best-meta'), m = window.어사이드54_META;
    if (!el) return value;
    const prior = el.querySelector('[data-aside54-meta]'); if (prior) prior.remove();
    if (!m) { el.insertAdjacentHTML('beforeend', '<div data-aside54-meta>어사이드54 자료 미로드</div>'); return value; }
    el.insertAdjacentHTML('beforeend', `<div data-aside54-meta style="color:${COLOR};margin-top:6px"><b>${BADGE} 어사이드54 · 전날 상승률 상위3 일반주</b> · ${esc(m.첫칸)}~${esc(m.끝칸)} · ${Number(m.칸).toLocaleString('ko-KR')}칸 · ${Number(m.명단).toLocaleString('ko-KR')}선택 · 기준봉 ${esc(ymd(m.마지막봉))} · 9월 대조 ${esc(m['9월대조'])}<br>${esc(m.판정)} · 확인 ${Number(m.확인).toLocaleString('ko-KR')}개 중 +20% ${Number(m.적중).toLocaleString('ko-KR')}개(${Number(m.적중률).toFixed(2)}%) · 미확인 ${m.미확인}개 · ${esc(ymd(m.예정일))} 예정은 미채점<br><span style="opacity:.75">${esc(m.자료한계)}</span></div>`);
    return value;
  };
  const oldDetail = window.openBestDetail;
  window.openBestDetail = function (k) {
    const r = arch()[k], body = document.getElementById('stock-modal-body'), ov = document.getElementById('stock-modal-overlay');
    if (!rowValid(r) || !r.a.length || !body || !ov || !/^\d{4}-\d{2}-\d{2}$/.test(k)) return oldDetail.apply(this, arguments);
    ov.style.display = 'none'; const value = oldDetail.apply(this, arguments);
    if (ov.style.display !== 'flex') body.innerHTML = `<h2>베스트 · ${esc(k)}</h2>`;
    const prior = body.querySelector('[data-aside54-detail]'); if (prior) prior.remove();
    let content = `<section data-aside54-detail style="margin-top:18px;color:${COLOR}"><h3>${BADGE} 어사이드54 · ${esc(k)} · 일반주 ${r.a.length}종목</h3><p style="font-size:12px">신호일 ${esc(ymd(r.sd))} 장마감까지만 보고 고름 · 전날 상승률 상위3 · 스팩·우선주·ETF·ETN·리츠 등 제외<br><b>관찰용·매수추천 아님. 당일 종가 +20% 라벨이며 매수 수익률이 아닙니다.</b> 당일 자료가 없거나 가격 이상이면 미확인. 현재 마스터의 과거분류 근사.</p><div style="overflow-x:auto"><table style="font-size:12px;border-collapse:collapse"><tr>`;
    ['순위', '종목', '전날 종가', '전날 상승률', '당일 등락률', '+20% 채점'].forEach(t => { content += `<th style="text-align:left;padding:6px 9px;border-bottom:1px solid ${LINE};white-space:nowrap">${t}</th>`; });
    content += '</tr>';
    r.a.forEach(x => {
      const stock = `<span style="cursor:pointer;font-weight:bold" onclick="_openStock(this,function(){openBestDetail('${k}')})" data-code="${esc(x[0])}" data-name="${esc(nm(x))}" data-rate="0" data-amount="0" data-meta="어사이드54 ${k}" data-catalyst="">${esc(nm(x))}</span> <small>${esc(x[0])}</small>`;
      const values = [x[1], stock, Number(x[2]).toLocaleString('ko-KR'), esc(pct(x[3])), esc(pct(x[5])), esc(result(x))];
      content += '<tr>' + values.map(v => `<td style="padding:6px 9px;border-bottom:1px solid ${LINE};white-space:nowrap">${v}</td>`).join('') + '</tr>';
    });
    body.insertAdjacentHTML('beforeend', content + '</table></div></section>'); ov.style.display = 'flex';
    window.__배지복귀 = function () { window.openBestDetail(k); }; return value;
  };
  if (typeof bestY !== 'undefined' && typeof window.renderBestCalendar === 'function') { try { window.renderBestCalendar(); } catch (e) { console.warn('어사이드54 렌더', e); } }
})();
