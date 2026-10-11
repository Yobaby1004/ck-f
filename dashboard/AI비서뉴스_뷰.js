/* AI비서 뉴스 표시 (2026-10-06 사용자 지시 · 와이스트릿 「AI비서 전쟁」 영상 → 캘린더 적용 A안)
   자료 = dashboard/data/AI비서뉴스.js (window.AI비서뉴스) · 빌더 = 주도주\_AI비서뉴스_빌드.py (/매매일 9.695 · 9.6 자료화 뒤)
   ① 월간 달력 칸 맨 아래 한 줄 = 그날 월간 칸 오른 이유에 AI 비서 낱말(A 에이전트·AI 비서·뮤즈·닷츠·인스팅트·스파크 / O 오픈AI)이 나온 종목 수 + AI비서 일정
   ② 그 줄을 누르면 그날 창 = 종목 · 테마 · 그날 등락 · 낱말 · 이유 · 5·20거래일 뒤 · 20일 안 최고/최저 · 기준(같은 날 다른 종목 · 같은 테마 다른 날)
   ③ 종목 창(showStockDetail) 맨 위에 'AI비서 뉴스 n번' 상자(유튜브·악재경고와 같은 방식)
   감싸는 함수 = buildCell · showStockDetail (원래 함수를 먼저 부르고 뒤에 덧붙임 · 다른 자료는 안 건드림) · 관찰용 · 매수추천 아님 */
(function () {
  'use strict';
  if (window.__aiAgentNewsInstalled) return;
  if (typeof window.buildCell !== 'function') { console.error('AI비서뉴스: 월간 달력 함수(buildCell)가 없습니다'); return; }
  window.__aiAgentNewsInstalled = true;
  const COLOR = '#ffd180', LINE = '#6b5a33', MUTED = '#8487bd';
  const DATA = () => window.AI비서뉴스 || {days: {}, events: [], cols: [], stats: {}, meta: {}};
  const I = {};
  (DATA().cols || []).forEach((c, i) => { I[c] = i; });
  const g = (x, k) => { const v = x[I[k]]; return v === undefined ? null : v; };
  const esc = v => String(v == null ? '' : v).replace(/[&<>"']/g, ch => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[ch]));
  const pct = (v, dg) => v == null ? '—' : `<span style="color:${v >= 0 ? '#ff8a8a' : '#7ea6ff'}">${v >= 0 ? '+' : ''}${Number(v).toFixed(dg == null ? 1 : dg)}%</span>`;
  const plain = v => v == null ? '—' : `${v >= 0 ? '+' : ''}${Number(v).toFixed(1)}%`;
  const md = s => { s = String(s || '').replace(/-/g, ''); return s.length === 8 ? `${s.slice(4, 6)}/${s.slice(6)}` : s; };
  const TIER = {A: 'AI 비서 직접', O: '오픈AI 소식'};
  const evOf = k => (DATA().events || []).filter(e => e.d === k);
  let byCode = null;
  const codeIndex = () => {
    if (byCode) return byCode;
    byCode = {};
    Object.entries(DATA().days || {}).forEach(([k, rows]) => rows.forEach(r => { (byCode[g(r, 'c')] = byCode[g(r, 'c')] || []).push([k, r]); }));
    Object.values(byCode).forEach(L => L.sort((a, b) => b[0].localeCompare(a[0])));
    return byCode;
  };
  const after = (r, key) => {
    const v = g(r, key);
    if (v != null) return pct(v);
    if (g(r, 'st') === 'L') return '<span style="color:#8487bd">봉 없음</span>';
    if (g(r, 'st') === 'X') return '<span style="color:#ffc454">가격 단절 의심</span>';
    const now = g(r, 'now'), held = g(r, 'held');
    return held ? `<span style="color:#ffc454">대기 ${held}일</span> ${pct(now)}` : '<span style="color:#ffc454">대기</span>';
  };
  const chip = (r, k) => `<span onclick="event.stopPropagation();_openStock(this,function(){_AI비서Modal('${k}')})" data-code="${esc(g(r, 'c'))}" data-name="${esc(g(r, 'n'))}" data-rate="${esc(g(r, 'chg') == null ? 0 : g(r, 'chg'))}" data-amount="0" data-meta="AI비서 뉴스 ${k}" data-catalyst="${esc(g(r, 'why'))}" style="cursor:pointer;font-weight:bold;color:${COLOR}">${esc(g(r, 'n'))}</span> <small style="color:#6b6e9c">${esc(g(r, 'c'))}</small>`;

  // ① 월간 달력 칸에 한 줄
  const oldCell = window.buildCell;
  window.buildCell = function (d, k, entry, otherMonth, dow) {
    let html = oldCell.apply(this, arguments);
    try {
      const rows = (DATA().days || {})[k], evs = evOf(k);
      if (!(rows && rows.length) && !evs.length) return html;
      let layer = `<div class="aian-layer" style="border-top:1px dashed ${LINE};margin-top:3px;padding-top:2px;font-size:9.5px;line-height:1.35">`;
      if (rows && rows.length) {
        const a = rows.filter(r => g(r, 'tier') === 'A').length, o = rows.length - a;
        const top = rows.slice().sort((x, y) => (g(y, 'chg') || 0) - (g(x, 'chg') || 0))[0];
        const label = (a ? `AI비서 ${a}` : '') + (a && o ? ' · ' : '') + (o ? `오픈AI ${o}` : '');
        const tip = `AI비서 뉴스 · ${k} · 월간 칸 오른 이유에 AI 비서 낱말이 나온 종목 ${rows.length}개 · ` + rows.slice(0, 8).map(r => `${g(r, 'n')} ${plain(g(r, 'chg'))}`).join(', ') + ' · 눌러서 그 뒤 성적 보기 · 관찰용';
        layer += `<div onclick="event.stopPropagation();_AI비서Modal('${k}')" title="${esc(tip)}" style="cursor:pointer;color:${COLOR};white-space:nowrap;overflow:hidden;text-overflow:ellipsis"><b>${esc(label)}</b> <span style="color:${MUTED}">${esc(g(top, 'n'))} ${esc(plain(g(top, 'chg')))}${rows.length > 1 ? ' 외 ' + (rows.length - 1) : ''}</span></div>`;
      }
      evs.forEach(e => {
        const future = e.k !== '지난 일';
        layer += `<div onclick="event.stopPropagation();_AI비서Modal('${k}')" title="${esc(`AI비서 일정 · ${e.d} · ${e.t} · ${e.n || ''}${e.ok === false ? ' · 회사 미확정 추정일' : ''}`)}" style="cursor:pointer;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:${future ? '#7ee8ff' : MUTED}">${future ? '◆' : '◇'} ${esc(e.t)}</div>`;
      });
      layer += '</div>';
      const end = html.lastIndexOf('</div>');
      return html.slice(0, end) + layer + html.slice(end);
    } catch (e) { console.warn('AI비서뉴스 칸 그리기 실패', e); return html; }
  };

  // ② 그날 창
  const line = (name, s) => {
    if (!s || !s.r5) return '';
    const p = s.r5, q = s.r20 || {};
    const part = (x, lab) => x && x.n ? `${lab} ${x.n}줄 평균 ${pct(x.mean)} 중앙 ${pct(x.med)} 오른 비율 ${x.win}% <span style="color:${MUTED}">(같은 날 다른 종목 ${pct(x.b1)} · 같은 테마 다른 날 ${pct(x.b2)})</span>` : `${lab} 0줄`;
    return `<div style="margin:3px 0"><b style="color:#c9cbe8">${esc(name)}</b> · ${part(p, '5거래일 뒤')} · ${part(q, '20거래일 뒤')}</div>`;
  };
  window._AI비서Modal = function (k) {
    try { window.__배지복귀 = function () { window._AI비서Modal(k); }; } catch (e) {}
    const ov = document.getElementById('stock-modal-overlay'), body = document.getElementById('stock-modal-body');
    if (!ov || !body) return;
    const D = DATA(), rows = (D.days || {})[k] || [], evs = evOf(k), S = D.stats || {}, M = D.meta || {};
    let h = `<div style="color:#e4e6ff"><h3 style="margin:0;color:${COLOR}">AI비서 뉴스 · ${esc(k)} · ${rows.length}종목 <span style="font-size:12px;color:#ff9aaa;font-weight:600">관찰용 · 매수추천 아님</span></h3>`
      + `<p style="color:${MUTED};font-size:12px;line-height:1.6;margin:6px 0">월간 칸 오른 이유 문장에 AI 비서 낱말이 나온 종목입니다(${esc(M.kwA || '')} / ${esc(M.kwO || '')}). 성적은 그날 종가 기준 5·20거래일 뒤 종가(천프정 원본 일봉)이고, 비교 기준은 ① ${esc(M.base1 || '')} ② ${esc(M.base2 || '')}의 평균입니다.</p>`;
    if (evs.length) {
      h += '<div style="margin:8px 0;padding:8px 10px;border-radius:8px;background:rgba(126,232,255,.06);border:1px solid rgba(126,232,255,.35);font-size:12px">';
      evs.forEach(e => { h += `<div><b style="color:#7ee8ff">AI비서 일정 (${esc(e.k)})</b> · ${esc(e.t)} · <span style="color:${MUTED}">${esc(e.n || '')}${e.ok === false ? ' · 회사 미확정 추정일' : ''}</span>${e.src ? ` · <a href="${esc(e.src)}" target="_blank" rel="noopener" style="color:#7ecbff">출처</a>` : ''}</div>`; });
      h += '</div>';
    }
    if (rows.length) {
      h += '<div style="overflow-x:auto"><table style="border-collapse:collapse;font-size:12px;color:#e4e6ff"><tr>'
        + ['종목', '테마', '그날', '낱말', '오른 이유(월간 칸)', '5거래일 뒤', '20거래일 뒤', '20일 안 최고', '20일 안 최저', '기준① 같은 날 다른 종목 5일', '기준② 같은 테마 다른 날 5일'].map(t => `<th style="padding:5px 7px;border-bottom:1px solid ${LINE};color:${MUTED};white-space:nowrap;text-align:left">${t}</th>`).join('') + '</tr>';
      rows.forEach(r => {
        const cells = [chip(r, k), esc(g(r, 't')), pct(g(r, 'chg')), `<span title="${esc(TIER[g(r, 'tier')] || '')}" style="color:${g(r, 'tier') === 'A' ? COLOR : MUTED}">${esc(g(r, 'kw'))}</span>`,
          `<span title="${esc(g(r, 'why'))}">${esc(String(g(r, 'why') || '').slice(0, 42))}</span>`, after(r, 'r5'), after(r, 'r20'), pct(g(r, 'mx')), pct(g(r, 'mn')),
          g(r, 'b1_5') == null ? '—' : `${pct(g(r, 'b1_5'))} <small style="color:${MUTED}">${g(r, 'b1n')}종목</small>`,
          g(r, 'b2_5') == null ? '—' : `${pct(g(r, 'b2_5'))} <small style="color:${MUTED}">${g(r, 'b2n')}종목</small>`];
        h += '<tr>' + cells.map(v => `<td style="padding:5px 7px;border-bottom:1px solid #2a2440;white-space:nowrap">${v}</td>`).join('') + '</tr>';
      });
      h += '</table></div>';
    }
    h += `<div style="margin-top:10px;padding:8px 10px;border-radius:8px;background:rgba(255,209,128,.05);border:1px solid ${LINE};font-size:12px;line-height:1.55">`
      + `<div style="color:${COLOR};font-weight:bold">전체 성적 (${esc(M.first || '')}~${esc(M.last || '')} · ${M.rows || 0}줄 · ${M.days || 0}일)</div>`
      + line('A AI 비서 직접', S.A) + line('O 오픈AI 소식', S.O) + line('합계', S.all)
      + `<div style="color:${MUTED};margin-top:4px">${esc(M.note || '')} · 월간 칸 마지막 ${esc(M.source_last || '')} · 천프정 마지막 ${esc(M.price_last || '')} · 만든 시각 ${esc(String(M.built || '').replace('T', ' ').slice(0, 16))}</div></div>`;
    const next = (D.events || []).filter(e => e.k !== '지난 일').slice(0, 6);
    if (next.length) {
      h += '<div style="margin-top:10px;font-size:12px"><b style="color:#7ee8ff">다가올 AI비서 일정</b> ' + next.map(e => `<span style="margin-left:8px">${md(e.d)} ${esc(e.t)}${e.ok === false ? '<small style="color:#ffc454">(추정)</small>' : ''}</span>`).join('') + '</div>';
    }
    body.innerHTML = h + '</div>';
    ov.style.display = 'flex';
  };

  // ③ 종목 창 상자
  function stockBox(code) {
    const body = document.getElementById('stock-modal-body');
    if (!body || body.querySelector('.aian-line') || !code) return;
    const L = codeIndex()[code];
    if (!L || !L.length) return;
    let h = `<div class="aian-line" style="margin:0 0 10px;padding:9px 12px;border-radius:9px;background:rgba(255,209,128,.06);border:1px solid rgba(255,209,128,.45);font-size:12px;line-height:1.6;color:#e8e2f0">`
      + `<b style="color:${COLOR}">AI비서 뉴스 ${L.length}번</b> <span style="color:${MUTED}">(월간 칸 오른 이유에 AI 비서 낱말 · 관찰용 · 매수추천 아님 · 날짜 누르면 그날 창)</span>`;
    L.slice(0, 5).forEach(([k, r]) => {
      h += `<div style="margin-top:5px;padding-top:4px;border-top:1px dashed rgba(255,255,255,.1)">`
        + `<a onclick="_AI비서Modal('${k}')" style="color:#7ecbff;cursor:pointer">${esc(k)}</a> · ${esc(g(r, 't'))} · 그날 ${pct(g(r, 'chg'))} · <span style="color:${g(r, 'tier') === 'A' ? COLOR : MUTED}">${esc(g(r, 'kw'))}</span>`
        + ` · 5일 뒤 ${after(r, 'r5')} · 20일 뒤 ${after(r, 'r20')}<br><span style="color:#b8bde6">이유</span> ${esc(String(g(r, 'why') || '').slice(0, 70))}</div>`;
    });
    body.insertAdjacentHTML('afterbegin', h + '</div>');
  }
  function hook() {
    const sd = window.showStockDetail;
    if (typeof sd !== 'function' || sd.__aian) return;
    const w = function (el) {
      const ret = sd.apply(this, arguments);
      try {
        const c = el && el.dataset ? String(el.dataset.code || '') : '';
        if (c) { setTimeout(() => stockBox(c), 0); setTimeout(() => stockBox(c), 900); }
      } catch (e) {}
      return ret;
    };
    w.__aian = 1;
    Object.keys(sd).forEach(key => { try { w[key] = sd[key]; } catch (e) {} });
    window.showStockDetail = w;
  }
  function boot() {
    hook();
    try { if (document.querySelector('#cal-view .cal-cell') && typeof window.renderMonthView === 'function') window.renderMonthView(); } catch (e) { console.warn('AI비서뉴스 다시 그리기 실패', e); }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else setTimeout(boot, 0);
})();
