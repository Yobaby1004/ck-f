/* 🆁 어사이드18 (2026-10-02 사용자 지시) = 캔들위매매법(바치올 임펄스MACD리본 v3) · 🏅 베스트 달력에 묶음을 더한다(기존 자료·함수는 그대로).
   스킬 /어사이드18 · 빌더 = 주도주\_베스트_어사이드18_빌드.py (→ 매매법\캔들위매매법\_07_달력.py · 동결 엔진 _캔들위_엔진.py) · 자료 = dashboard/data/베스트_어사이드18(_과거).js
   한마디로: 힘선(중심 ZLEMA 34)이 통로(고가·저가 67일 지수평균)를 뚫은 날 종가 = 가격표 · ①점화 ②가격표지지(원문 핵심 신호) ④계단재점화 매수 신호가 난 종목 전부
   칸 = 매수일(8시 명단) · 결과는 규칙대로 샀다고 가정한 계산(매수일 시가 → ③꺼짐 난 날 종가 · 60거래일 만기 · 비용 0.3%) · 사전등록 기각 · 관찰용 · 매수추천 아님
   감싸는 함수 = buildBestCell · renderBestMonthStrip · renderBestMeta · openBestDetail (어사이드17_뷰.js 와 같은 방식 · 그 뒤에 읽는다) */
(function () {
  'use strict';
  if (window.__aside18Installed) return;
  const originals = ['buildBestCell', 'renderBestMonthStrip', 'renderBestMeta', 'openBestDetail'];
  if (originals.some(n => typeof window[n] !== 'function')) { console.error('어사이드18: 베스트 달력 함수가 없습니다'); return; }
  window.__aside18Installed = true;
  const color = '#c5a3ff', line = '#4e3b72', SHOW = 6;
  const arch = () => window.어사이드18_ARCHIVE || {};
  const NM = () => window.어사이드18_NAMES || {};
  const I = {};
  (window.어사이드18_COLS || ['c', 't', 'chg', 'pc', 'tag', 'stop', 'ig', 'vx', 'gap', 'am', 'a20', 'b', 's', 'p', 'k', 'ed', 'h20', 'mx']).forEach((c, i) => { I[c] = i; });
  const g = (x, key) => x[I[key]];
  const esc = v => String(v == null ? '' : v).replace(/[&<>"']/g, ch => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[ch]));
  const pct = (v, dg) => v == null ? '—' : `<span style="color:${v >= 0 ? '#ff8a8a' : '#7ea6ff'}">${v >= 0 ? '+' : ''}${Number(v).toFixed(dg == null ? 1 : dg)}%</span>`;
  const won = v => v == null ? '—' : Number(v).toLocaleString('ko-KR', {maximumFractionDigits: 0});
  const ymd = s => { s = String(s || ''); return s.length === 8 ? `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6)}` : s; };
  const md = s => { s = String(s || ''); return s.length === 8 ? `${s.slice(4, 6)}/${s.slice(6)}` : s; };
  const TY = {'1': '①', '14': '①④', '4': '④', '2': '②'};
  const TYL = {'1': '①점화', '14': '①점화+④계단', '4': '④계단재점화', '2': '②가격표지지'};
  const name = x => (NM()[g(x, 'c')] || [g(x, 'c')])[0];
  const mkt = x => (NM()[g(x, 'c')] || ['', ''])[1];
  const warn = x => g(x, 'chg') >= 29 ? ' <span style="color:#ffc454" title="신호일 상한가 마감 = 과거 매매 평균이 무작위보다 나빴다(사후 관찰)">⚠</span>'
    : g(x, 'chg') >= 20 ? ' <span style="color:#ffc454" title="신호일 +20% 이상 = 과거 매매 평균이 무작위보다 나빴다(사후 관찰)">⚠</span>' : '';
  const ST = {C: '확정', H: '결과대기', P: '예정(명단만)', S: '자료끊김'};
  const res = x => {
    const s = g(x, 's'), h20 = g(x, 'h20') ? ' <span style="color:#ff8a8a">+20✓</span>' : '';
    if (s === 'C') return pct(g(x, 'p')) + h20;
    if (s === 'H') return `<span style="color:#ffc454">결과대기 ${g(x, 'k')}일</span> ${pct(g(x, 'p'))}${h20}`;
    if (s === 'P') return '<span style="color:#7ee8ff">예정</span>';
    return `<span style="color:#8487bd">${ST[s] || s}</span>`;
  };

  const oldCell = window.buildBestCell;
  window.buildBestCell = function (d, k, rec, other, dow) {
    let html = oldCell.apply(this, arguments);
    const row = arch()[k]; if (!row || !row.n) return html;
    let layer = `<div class="aside18-layer" style="border-top:1px dashed ${line};margin-top:4px;padding-top:3px;color:${color};font-size:10px" title="🆁 어사이드18(캔들위매매법 · 임펄스MACD리본) · 신호일 ${ymd(row.sd)} 종가까지 보고 고름 · ①점화 ②가격표지지 ④계단재점화 · 눌러서 전부 보기"><b>🆁 어사이드18 · ${row.n}종목</b>${row.e ? ' <span style="color:#8487bd" title="2011년 전 칸 = 계산 시작을 천프정 첫 봉으로 당겨 채움 · 검증 밖 · 지금 상장 종목만이라 좋게 보일 수 있음">앞</span>' : ''}`;
    row.a.slice(0, SHOW).forEach(x => {
      const tip = `${TYL[g(x, 't')] || g(x, 't')} · 신호일 종가 ${won(g(x, 'pc'))}(${g(x, 'chg')}%) · 가격표 ${won(g(x, 'tag'))} · 꺼짐선 ${won(g(x, 'stop'))} · 점화 ${md(g(x, 'ig'))} · 매수가 ${won(g(x, 'b'))} · ${ST[g(x, 's')] || ''}${g(x, 'ed') ? ' ' + md(g(x, 'ed')) : ''}`;
      layer += `<div title="${esc(tip)}" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis"><span style="color:#a9b9ee">${TY[g(x, 't')] || ''}</span> <b>${esc(name(x))}</b>${warn(x)} ${res(x)}</div>`;
    });
    if (row.n > SHOW) layer += `<div style="color:#8487bd">외 ${row.n - SHOW}종목 (눌러서 전부)</div>`;
    layer += '</div>';
    if (!html.match(/^<div[^>]*\bhas-data\b/)) html = html.replace('class="cal-cell', 'class="cal-cell has-data');
    if (!html.match(/^<div[^>]*\bonclick=/)) html = html.replace('data-date="' + k + '"', 'data-date="' + k + '" onclick="openBestDetail(\'' + k + '\')" style="cursor:pointer"');
    const end = html.lastIndexOf('</div>');
    return html.slice(0, end) + layer + html.slice(end);
  };

  const oldStrip = window.renderBestMonthStrip;
  window.renderBestMonthStrip = function () {
    const result = oldStrip.apply(this, arguments);
    const strip = document.getElementById('best-month-strip'); if (!strip || typeof bestY === 'undefined') return result;
    Array.from(strip.children).forEach((btn, i) => {
      const pre = `${bestY}-${String(i + 1).padStart(2, '0')}`;
      const n = Object.entries(arch()).reduce((s, [k, r]) => s + (k.startsWith(pre) ? r.n : 0), 0);
      if (n) { if (i + 1 !== bestM) btn.classList.add('has-data'); btn.title += ` · 어사이드18 ${n}종목`; }
    });
    return result;
  };

  const vtxt = v => v && v.n ? `신호 ${Number(v.n).toLocaleString('ko-KR')} · 10일 +20% lift ${v.lift != null ? v.lift.toFixed(2) : '—'} · 꺼짐 청산 평균 ${pct(v.rr != null ? v.rr * 100 : null, 2)}(같은 보유일 무작위 ${pct(v.c3 != null ? v.c3 * 100 : null, 2)} · 차이 ${v.diff != null ? (v.diff * 100).toFixed(2) : '—'}%p [${v.dlo != null ? (v.dlo * 100).toFixed(2) : '—'}~${v.dhi != null ? (v.dhi * 100).toFixed(2) : '—'}]) · 평균손실 ${pct(v.loss != null ? v.loss * 100 : null, 1)}` : '—';
  const oldMeta = window.renderBestMeta;
  window.renderBestMeta = function () {
    const result = oldMeta.apply(this, arguments);
    const el = document.getElementById('best-meta'), m = window.어사이드18_META;
    if (!el) return result;
    if (!m) { el.innerHTML += '<br><span style="color:#ff9aaa">❌ 베스트_어사이드18.js 가 안 읽혔다 = 주도주\\_베스트_어사이드18_빌드.py 실행</span>'; return result; }
    const T = m.전체 || {}, L = m.동결구간 || {}, E = m.예정 || {}, V = m.검증 || {}, Y = (m.연도 || []).find(r => typeof bestY !== 'undefined' && r.y === bestY);
    const names = E.종목 || [];
    el.innerHTML += `<div class="aside18-meta" style="margin-top:5px;color:${color}"><b>🆁 어사이드18</b>(캔들위매매법 · 바치올 임펄스MACD리본 v3) ${ymd(m.첫칸.replace(/-/g, ''))}~${ymd(m.끝칸.replace(/-/g, ''))} · ${Number(m.칸).toLocaleString('ko-KR')}칸 · 신호 ${Number(m.신호).toLocaleString('ko-KR')} · 확정 ${Number(T.n || 0).toLocaleString('ko-KR')}건 평균 ${pct(T.rr, 2)} 중앙 ${pct(T.med, 2)} 승률 ${T.win}% 평균손실 ${pct(T.loss, 1)} · 2011~ 확정 ${Number(L.n || 0).toLocaleString('ko-KR')}건 평균 ${pct(L.rr, 2)} · 결과대기 ${m.결과대기}`
      + (Y && Y.n ? ` · ${bestY}년 ${Y.n}건 평균 ${pct(Y.rr, 2)} 중앙 ${pct(Y.med, 2)}` : '')
      + ` · ${ymd(E.매수일)} 8시 예정 ${names.length}종목${names.length ? '(' + esc(names.slice(0, 12).join(', ')) + (names.length > 12 ? ' 외 ' + (names.length - 12) : '') + ')' : ''}`
      + (m.빠짐 > 0 && m.들어옴 / m.기준 < 0.97 ? ` · <span style="color:#ffc454">천프정 ${ymd(m.마지막봉)} 봉이 ${m.들어옴}/${m.기준}종목만 들어옴(빠진 ${m.빠짐}종목은 그 전 봉까지)</span>` : '')
      + `<br><span style="color:#ff9aaa">${esc(m.판정)} · 매수추천 아님</span> · 검증 IS(2015-06~2024) ${vtxt(V.IS_SU)} · HOLDOUT(2025~2026-07) ${vtxt(V.HO_SU)} · ${esc(m.대조)} · ${esc(m.지난판)}`
      + `<br><span style="color:#8487bd">신호 = ①점화(힘선이 통로를 처음 뚫음 · 거래량 1.5배 · 윗꼬리 짧은 양봉) · ②가격표지지(가격표 +2% 안 눌림 뒤 양봉 회복 · 원문 핵심) · ④계단재점화(새 가격표 > 이전) · 칸 = 매수일 시가 → ③꺼짐(종가 < 가격표 −7% 또는 힘선 < 통로 하단) 그날 종가 · 60거래일 만기 · 「앞」 = 2011년 전(검증 밖) · 지금 상장 종목만이라 옛 칸은 좋게 보일 수 있음 · ⚠ = 신호일 +20% 이상(과거 나빴음)</span></div>`;
    return result;
  };

  const oldDetail = window.openBestDetail;
  window.openBestDetail = function (k) {
    const row = arch()[k];
    const body = document.getElementById('stock-modal-body'), ov = document.getElementById('stock-modal-overlay');
    if (!row || !row.n || !body || !ov) return oldDetail.apply(this, arguments);
    ov.style.display = 'none';
    const result = oldDetail.apply(this, arguments);
    if (ov.style.display !== 'flex') body.innerHTML = `<div style="font-size:18px;font-weight:bold">🏅 베스트 · ${esc(k)}</div>`;
    const prev = body.querySelector('[data-aside18-detail]'); if (prev) prev.remove();
    let html = `<section data-aside18-detail style="margin-top:20px;color:${color}"><h3 style="margin:0">🆁 어사이드18 · 매수일 ${esc(k)} · ${row.n}종목 <span style="font-size:12px;color:#ff9aaa;font-weight:600">기각 · 관찰용 · 매수추천 아님</span></h3>`
      + `<p style="color:#8487bd;font-size:12px;line-height:1.6;margin:6px 0">캔들위매매법(바치올 임펄스MACD리본 v3) · 신호일 <b style="color:#c9cbe8">${ymd(row.sd)}</b> 종가까지만 보고 고름${row.e ? ' · <b style="color:#ffc454">2011년 전 칸 = 검증 밖</b>' : ''} · 순서 = ①→④→② · 신호일 거래대금 큰 순(검증 안 한 순서)<br>`
      + `<b style="color:#c9cbe8">결과는 규칙대로 샀다고 가정한 계산(실제 매매와 무관)</b> · 매수일 시가 → ③꺼짐(종가가 꺼짐선 아래 또는 힘선이 통로 하단 아래) 그날 종가 · 60거래일 만기 · 비용 0.3% · +20✓ = 매수일 포함 10거래일 안 고가가 매수가 +20% 에 닿음</p><div style="overflow-x:auto"><table style="border-collapse:collapse;color:#e4e6ff;font-size:12px"><tr>`;
    ['#', '종목', '신호', '신호일 종가(등락)', '가격표', '꺼짐선', '점화일', '거래량 배수', '상단 이격', '20일 대금(억)', '매수가(시가)', '결과', '수익', '보유일', '청산일', '10일 +20%', '10일 최고'].forEach(t => html += `<th style="padding:5px 7px;border-bottom:1px solid ${line};color:#8487bd;white-space:nowrap;text-align:left">${t}</th>`);
    html += '</tr>';
    row.a.forEach((x, i) => {
      const nmEl = `<span style="cursor:pointer;font-weight:bold;color:${color}" onclick="_openStock(this,function(){openBestDetail('${k}')})" data-code="${esc(g(x, 'c'))}" data-name="${esc(name(x))}" data-rate="0" data-amount="0" data-meta="🆁어사이드18 ${k}" data-catalyst="">${esc(name(x))}</span> <small style="color:#6b6e9c">${esc(g(x, 'c'))} ${esc(mkt(x))}</small>`;
      const s = g(x, 's'), done = s === 'C' || s === 'H';
      const vals = [i + 1, nmEl, (TYL[g(x, 't')] || g(x, 't')) + warn(x), `${won(g(x, 'pc'))} (${pct(g(x, 'chg'))})`, won(g(x, 'tag')), won(g(x, 'stop')), md(g(x, 'ig')),
        g(x, 'vx') == null ? '—' : g(x, 'vx') + '배', pct(g(x, 'gap')), g(x, 'a20') == null ? '—' : won(g(x, 'a20')), won(g(x, 'b')),
        ST[s] || s, done ? pct(g(x, 'p'), 2) : '—', done ? g(x, 'k') + '일' : '—', g(x, 'ed') ? ymd(g(x, 'ed')) : '—',
        g(x, 'h20') ? `<span style="color:#ff8a8a">${g(x, 'h20')}일째</span>` : (done ? '—' : ''), done ? pct(g(x, 'mx')) : '—'];
      html += '<tr>' + vals.map(v => `<td style="padding:5px 7px;border-bottom:1px solid #2e2540;white-space:nowrap">${v}</td>`).join('') + '</tr>';
    });
    body.insertAdjacentHTML('beforeend', html + '</table></div></section>');
    ov.style.display = 'flex';
    window.__배지복귀 = function () { window.openBestDetail(k); };
    return result;
  };
  if (typeof bestY !== 'undefined' && typeof window.renderBestCalendar === 'function') {
    try { window.renderBestCalendar(); } catch (e) { console.warn('어사이드18 다시 그리기 실패', e); }
  }
})();
