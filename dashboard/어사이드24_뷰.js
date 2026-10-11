/* 🆇 어사이드24 (2026-10-02 사용자 지시) = 캔들위매매법2 v1 Aside판(바추올 제이크 「임펄스MACD리본 v3」 · 리본 두께(힘) 상위 5) · 🏅 베스트 달력에 묶음을 더한다(기존 자료·함수는 그대로).
   스킬 /어사이드24 · 빌더 = 주도주\_베스트_어사이드24_빌드.py (→ 매매법\캔들위매매법2_Aside\cw2_달력.py · 잠긴 규칙 cw2_core.py) · 자료 = dashboard/data/베스트_어사이드24(_과거).js
   한마디로: 힘선(전형가격 34일 이중지수평균)이 통로(고가·저가 67일 지수평균)를 뚫은 날 종가 = 가격표 · 매수 신호 ①점화 ②가격표 지지 ④계단 재점화가 뜬 일반 주식 중 리본이 가장 두꺼운 5종목
   칸 = 매수일(8시 명단) · 결과는 규칙대로 샀다고 가정한 계산(매수일 시가 → 5번째 거래일 종가 · 비용 0.35%p · +20✓ = 5거래일 안 +20%) · 관찰용 · 매수추천 아님(관문 2/5)
   ※ 🆂 어사이드19(Claude Code 판 캔들위매매법2 · +20% 지정가·꺼짐 청산)와는 다른 판
   감싸는 함수 = buildBestCell · renderBestMonthStrip · renderBestMeta · openBestDetail (어사이드23_뷰.js 와 같은 방식 · 그 뒤에 읽는다) */
(function () {
  'use strict';
  if (window.__aside24Installed) return;
  const originals = ['buildBestCell', 'renderBestMonthStrip', 'renderBestMeta', 'openBestDetail'];
  if (originals.some(n => typeof window[n] !== 'function')) { console.error('어사이드24: 베스트 달력 함수가 없습니다'); return; }
  window.__aside24Installed = true;
  const color = '#8ecbff', line = '#2f4a66', SHOW = 5;
  const arch = () => window.어사이드24_ARCHIVE || {};
  const NM = () => window.어사이드24_NAMES || {};
  const I = {};
  (window.어사이드24_COLS || ['c', 'r', 't', 'th', 'pc', 'chg', 'tg', 'igd', 'stp', 'vx', 'nc', 'b', 's', 'p', 'mx', 'mn', 'hd', 'ed', 'kd', 'r20']).forEach((c, i) => { I[c] = i; });
  const g = (x, key) => x[I[key]];
  const esc = v => String(v == null ? '' : v).replace(/[&<>"']/g, ch => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[ch]));
  const pct = (v, dg) => v == null ? '—' : `<span style="color:${v >= 0 ? '#ff8a8a' : '#7ea6ff'}">${v >= 0 ? '+' : ''}${Number(v).toFixed(dg == null ? 1 : dg)}%</span>`;
  const won = v => v == null ? '—' : Number(v).toLocaleString('ko-KR', {maximumFractionDigits: 0});
  const ymd = s => { s = String(s || ''); return s.length === 8 ? `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6)}` : s; };
  const md = s => { s = String(s || ''); return s.length === 8 ? `${s.slice(4, 6)}/${s.slice(6)}` : s; };
  const name = x => (NM()[g(x, 'c')] || [g(x, 'c')])[0];
  const mkt = x => (NM()[g(x, 'c')] || ['', ''])[1];
  const TYP = {1: '①점화', 2: '②지지', 4: '④계단', 5: '①점화+④계단'};
  const ST = {C: '5일째 종가', H: '결과대기', P: '예정(8시 명단)', S: '자료끊김', N: '매수불가', X: '분할·병합'};
  const res = x => {
    const s = g(x, 's'), h20 = g(x, 'hd') ? ' <span style="color:#ff8a8a">+20✓</span>' : '';
    if (s === 'C') return pct(g(x, 'p')) + h20;
    if (s === 'H') return `<span style="color:#ffc454">결과대기 ${g(x, 'kd')}/5</span>${g(x, 'p') != null ? ' ' + pct(g(x, 'p')) : ''}${h20}`;
    if (s === 'P') return '<span style="color:#7ee8ff">예정</span>';
    return `<span style="color:#8487bd">${ST[s] || s}</span>`;
  };

  const oldCell = window.buildBestCell;
  window.buildBestCell = function (d, k, rec, other, dow) {
    let html = oldCell.apply(this, arguments);
    const row = arch()[k]; if (!row || !row.n) return html;
    let layer = `<div class="aside24-layer" style="border-top:1px dashed ${line};margin-top:4px;padding-top:3px;color:${color};font-size:10px" title="🆇 어사이드24(캔들위매매법2 Aside판 · 임펄스MACD리본 · 힘 상위 5) · 신호일 ${ymd(row.sd)} 종가까지 보고 고름 · 눌러서 자세히"><b>🆇 어사이드24 · ${row.n}종목</b>${row.e ? ' <span style="color:#8487bd" title="2015 전 칸 = 검증 밖 · 지금 상장 종목만이라 좋게 보일 수 있음">앞</span>' : ''}`;
    row.a.slice(0, SHOW).forEach(x => {
      const tip = `${TYP[g(x, 't')] || ''} · 힘(리본 두께) ${g(x, 'th')}% · 신호일 종가 ${won(g(x, 'pc'))}(${g(x, 'chg')}%) · 가격표 ${won(g(x, 'tg'))}(${md(g(x, 'igd'))} 점화) · 꺼짐선 ${won(g(x, 'stp'))} · 거래량 ${g(x, 'vx') == null ? '—' : g(x, 'vx') + '배'} · 매수가 ${won(g(x, 'b'))} · 5일 최고 ${g(x, 'mx') == null ? '—' : g(x, 'mx') + '%'} · 최저 ${g(x, 'mn') == null ? '—' : g(x, 'mn') + '%'} · ${ST[g(x, 's')] || ''}`;
      layer += `<div title="${esc(tip)}" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis"><b>${esc(name(x))}</b> ${res(x)}</div>`;
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
      if (n) { if (i + 1 !== bestM) btn.classList.add('has-data'); btn.title += ` · 어사이드24 ${n}종목`; }
    });
    return result;
  };

  const st = s => s && s.n ? `확정 ${Number(s.n).toLocaleString('ko-KR')}건 +20% ${s.up}% · 5일째 평균 ${pct(s.rr, 2)} 중앙 ${pct(s.med, 2)}` : '확정 0건';
  const oldMeta = window.renderBestMeta;
  window.renderBestMeta = function () {
    const result = oldMeta.apply(this, arguments);
    const el = document.getElementById('best-meta'), m = window.어사이드24_META;
    if (!el) return result;
    if (!m) { el.innerHTML += '<br><span style="color:#ff9aaa">❌ 베스트_어사이드24.js 가 안 읽혔다 = 주도주\\_베스트_어사이드24_빌드.py 실행</span>'; return result; }
    const E = m.예정 || {}, H = m.HO || {}, Y = (m.연도 || []).find(r => typeof bestY !== 'undefined' && r.y === bestY);
    const names = E.종목 || [];
    el.innerHTML += `<div class="aside24-meta" style="margin-top:5px;color:${color}"><b>🆇 어사이드24</b>(캔들위매매법2 Aside판 · 임펄스MACD리본 · 힘 상위 5) ${esc(m.첫칸)}~${esc(m.끝칸)} · ${Number(m.칸).toLocaleString('ko-KR')}칸 · ${st(m.전체)} · 결과대기 ${m.결과대기}`
      + ` · 검증구간(2015~2026-08) ${st(m.검증구간)} · 2015 전 「앞」 ${st(m.앞구간)}`
      + (Y && Y.n ? ` · ${bestY}년 ${Y.n}건 +20% ${Y.up}% 평균 ${pct(Y.rr, 2)} 중앙 ${pct(Y.med, 2)}` : '')
      + ` · ${ymd(E.매수일)} 8시 예정 ${names.length}종목${names.length ? '(' + esc(names.join(', ')) + ')' : ''}`
      + (m.경고 ? ` · <span style="color:#ffc454">천프정 ${ymd(m.마지막봉)} 봉이 직전 5거래일 거래 종목 ${Number(m.기준).toLocaleString('ko-KR')} 중 ${Number(m.들어옴).toLocaleString('ko-KR')}만 들어옴(빠진 종목은 그 전 봉까지 · 예정이 덜 나올 수 있음)</span>` : '')
      + `<br><span style="color:#ff9aaa">${esc(m.판정)}(관문 ${m.관문통과}/5) · 매수추천 아님</span> · 검증 2023~2026-08 +20% ${H.hit != null ? (H.hit * 100).toFixed(1) : '—'}%(같은 거래대금 무작위의 ${H.lift != null ? H.lift.toFixed(2) : '—'}배 · 변동성까지 맞추면 ${H.lift_v != null ? H.lift_v.toFixed(2) : '—'}배) · -20% 급락도 ${H.dlift != null ? H.dlift.toFixed(2) : '—'}배 · 5일째 중앙 ${H.med != null ? pct(H.med * 100, 2) : '—'} · [대조] ${esc(m.대조)} · [검증 재현] ${esc(m.재현)} · ${esc(m.아침)}`
      + `<br><span style="color:#8487bd">힘선(전형가격 34일 이중지수평균)이 통로(고가·저가 67일 지수평균)를 뚫은 날 종가 = 가격표 · ①점화(거래량 1.5배 · 윗꼬리 짧은 양봉 · 통로 위 10% 안) · ②가격표 지지(가격표 +2% 까지 눌렸다가 양봉으로 위 마감) · ④계단 재점화(새 가격표 > 이전) 중 리본 두께(힘) 큰 5종목 · 직전 5봉 안 신호 종목 제외 · 일반 주식(스팩·우선주·리츠 제외) · 종가 1,000원+ · 20일 평균 대금 10억+ · 매수일 시가 → 5번째 거래일 종가(비용 0.35%p) · +20✓ = 5거래일 안 +20% · 꺼짐선 = 가격표 −7% · 「앞」 = 2015 전(검증 밖 · 지금 상장 종목만이라 좋게 보일 수 있음) · 🆂 어사이드19(Claude Code 판)와 다른 판</span></div>`;
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
    const prev = body.querySelector('[data-aside24-detail]'); if (prev) prev.remove();
    let html = `<section data-aside24-detail style="margin-top:20px;color:${color}"><h3 style="margin:0">🆇 어사이드24 · 매수일 ${esc(k)} · ${row.n}종목 <span style="font-size:12px;color:#ff9aaa;font-weight:600">관찰용 · 매수추천 아님</span></h3>`
      + `<p style="color:#8487bd;font-size:12px;line-height:1.6;margin:6px 0">캔들위매매법2 Aside판(임펄스MACD리본 v3) · 신호일 <b style="color:#c9cbe8">${ymd(row.sd)}</b> 종가까지만 보고 고름${row.e ? ' · <b style="color:#ffc454">2015 전 칸 = 검증 밖</b>' : ''} · 순서 = 리본 두께(힘 = 두께 ÷ 종가) 큰 순 · 꺼짐선 = 가격표 −7%(종가가 그 아래거나 힘선이 통로 아래로 빠지면 꺼짐 = 손절 기준)<br>`
      + `<b style="color:#c9cbe8">결과는 규칙대로 샀다고 가정한 계산(실제 매매와 무관)</b> · 매수일 시가 → 5번째 거래일 종가(비용 0.35%p) · +20✓ = 매수일 포함 5거래일 안 고가가 매수가 +20% 에 닿음 · 20일 안 +20% = 참고</p><div style="overflow-x:auto"><table style="border-collapse:collapse;color:#e4e6ff;font-size:12px"><tr>`;
    ['순위', '종목', '셋업', '힘', '신호일 종가(등락)', '가격표(점화일) · 꺼짐선', '거래량 배수', '매수가(시가)', '5일 최고', '5일 최저', '+20% 닿은 날', '결과', '5일째 수익', '20일 안 +20%', '그날 후보'].forEach(t => html += `<th style="padding:5px 7px;border-bottom:1px solid ${line};color:#8487bd;white-space:nowrap;text-align:left">${t}</th>`);
    html += '</tr>';
    row.a.forEach(x => {
      const nmEl = `<span style="cursor:pointer;font-weight:bold;color:${color}" onclick="_openStock(this,function(){openBestDetail('${k}')})" data-code="${esc(g(x, 'c'))}" data-name="${esc(name(x))}" data-rate="0" data-amount="0" data-meta="🆇어사이드24 ${k}" data-catalyst="">${esc(name(x))}</span> <small style="color:#6b6e9c">${esc(g(x, 'c'))} ${esc(mkt(x))}</small>`;
      const s = g(x, 's'), done = s === 'C' || s === 'H';
      const vals = [g(x, 'r'), nmEl, TYP[g(x, 't')] || g(x, 't'), g(x, 'th') + '%', `${won(g(x, 'pc'))} (${pct(g(x, 'chg'))})`, `${won(g(x, 'tg'))}(${md(g(x, 'igd'))}) · ${won(g(x, 'stp'))}`,
        g(x, 'vx') == null ? '—' : g(x, 'vx') + '배', won(g(x, 'b')), done ? pct(g(x, 'mx')) : '—', done ? pct(g(x, 'mn')) : '—', g(x, 'hd') ? ymd(g(x, 'hd')) : '—',
        (ST[s] || s) + (s === 'H' ? ` (${g(x, 'kd')}/5일)` : '') + (g(x, 'ed') ? ` · ${ymd(g(x, 'ed'))}` : ''), done ? pct(g(x, 'p'), 2) : '—',
        g(x, 'r20') == null ? '—' : (g(x, 'r20') ? '<span style="color:#ff8a8a">O</span>' : 'X'), g(x, 'nc')];
      html += '<tr>' + vals.map(v => `<td style="padding:5px 7px;border-bottom:1px solid #22344a;white-space:nowrap">${v}</td>`).join('') + '</tr>';
    });
    body.insertAdjacentHTML('beforeend', html + '</table></div></section>');
    ov.style.display = 'flex';
    window.__배지복귀 = function () { window.openBestDetail(k); };
    return result;
  };
  if (typeof bestY !== 'undefined' && typeof window.renderBestCalendar === 'function') {
    try { window.renderBestCalendar(); } catch (e) { console.warn('어사이드24 다시 그리기 실패', e); }
  }
})();
