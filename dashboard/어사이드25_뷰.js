/* 🆈 어사이드25 (2026-10-02 사용자 지시) = 캔들위매매법 v1 Aside판(바치올 「MACD 보조창 지우세요 — 캔들 위에 올리면 지켜야 할 가격이 찍힙니다」 · 키움 임펄스MACD리본v3) · 🏅 베스트 달력에 묶음을 더한다(기존 자료·함수는 그대로).
   스킬 /어사이드25 · 빌더 = 주도주\_베스트_어사이드25_빌드.py (→ 매매법\캔들위매매법_Aside\cw_달력.py · 잠긴 규칙 cw_core.py) · 자료 = dashboard/data/베스트_어사이드25(_과거).js
   한마디로: 힘선(전형가격 34일 이중지수평균)이 통로(고가·저가 67일 지수평균)를 처음 뚫은 날 종가 = 가격표. 그 가격표를 지키는 동안 추세가 살아 있다.
   지지(가격표까지 눌렸다가 양봉으로 가격표 위 마감 = 원문 '핵심 신호') · 점화(거래량 실은 강한 양봉 돌파) · 계단(더 높은 가격표로 재점화) · 하루 상한 없음
   칸 = 매수일(8시 명단) · 결과는 규칙대로 샀다고 가정한 계산 = 5일(매수일 시가 → 5번째 거래일 종가 · 비용 0.35%p · +20✓ = 5거래일 안 +20%)
   + 영상대로(리본 색 바뀜 또는 꺼짐 → 그날 종가 · 최대 60일) · 관찰용 · 매수추천 아님(10년 관문 2/6)
   ※ 🆁 어사이드18(Claude Code 판 캔들위매매법) · 🆇 어사이드24(캔들위매매법2 Aside판 · 힘 상위 5)와는 다른 판
   감싸는 함수 = buildBestCell · renderBestMonthStrip · renderBestMeta · openBestDetail (어사이드24_뷰.js 와 같은 방식 · 그 뒤에 읽는다) */
(function () {
  'use strict';
  if (window.__aside25Installed) return;
  const originals = ['buildBestCell', 'renderBestMonthStrip', 'renderBestMeta', 'openBestDetail'];
  if (originals.some(n => typeof window[n] !== 'function')) { console.error('어사이드25: 베스트 달력 함수가 없습니다'); return; }
  window.__aside25Installed = true;
  const color = '#ffe57f', line = '#5c5326', SHOW = 5;
  const arch = () => window.어사이드25_ARCHIVE || {};
  const NM = () => window.어사이드25_NAMES || {};
  const I = {};
  (window.어사이드25_COLS || ['c', 'r', 't', 'pc', 'chg', 'tg', 'igd', 'stp', 'vx', 'b', 's', 'p', 'mx', 'mn', 'hd', 'kd', 'ed', 'sa', 'pa', 'da', 'ya', 'na']).forEach((c, i) => { I[c] = i; });
  const g = (x, key) => x[I[key]];
  const esc = v => String(v == null ? '' : v).replace(/[&<>"']/g, ch => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[ch]));
  const pct = (v, dg) => v == null ? '—' : `<span style="color:${v >= 0 ? '#ff8a8a' : '#7ea6ff'}">${v >= 0 ? '+' : ''}${Number(v).toFixed(dg == null ? 1 : dg)}%</span>`;
  const won = v => v == null ? '—' : Number(v).toLocaleString('ko-KR', {maximumFractionDigits: 0});
  const ymd = s => { s = String(s || ''); return s.length === 8 ? `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6)}` : s; };
  const md = s => { s = String(s || ''); return s.length === 8 ? `${s.slice(4, 6)}/${s.slice(6)}` : s; };
  const name = x => (NM()[g(x, 'c')] || [g(x, 'c')])[0];
  const mkt = x => (NM()[g(x, 'c')] || ['', ''])[1];
  const TYP = {2: '지지', 1: '점화', 4: '계단', 5: '점화+계단'};
  const TS = {2: '지', 1: '점', 4: '계', 5: '점계'};
  const WHY = {1: '리본 색 바뀜', 2: '꺼짐', 3: '60일 만기'};
  const ST = {C: '5일째 종가', H: '결과대기', P: '예정(8시 명단)', S: '자료끊김', N: '매수불가', X: '분할·병합'};
  const res = x => {
    const s = g(x, 's'), h20 = g(x, 'hd') ? ' <span style="color:#ff8a8a">+20✓</span>' : '';
    if (s === 'C') return pct(g(x, 'p')) + h20;
    if (s === 'H') return `<span style="color:#ffc454">결과대기 ${g(x, 'kd')}/5</span>${g(x, 'p') != null ? ' ' + pct(g(x, 'p')) : ''}${h20}`;
    if (s === 'P') return '<span style="color:#7ee8ff">예정</span>';
    return `<span style="color:#8487bd">${ST[s] || s}</span>`;
  };
  const resA = x => {
    const s = g(x, 'sa');
    if (s === 'C') return `${pct(g(x, 'pa'), 2)} · ${md(g(x, 'da'))} ${WHY[g(x, 'ya')] || ''} · ${g(x, 'na')}일`;
    if (s === 'H') return `<span style="color:#ffc454">규칙상 계속 ${g(x, 'na')}일째</span> · 지금 ${pct(g(x, 'pa'), 2)}`;
    if (s === 'P') return '<span style="color:#7ee8ff">예정</span>';
    return `<span style="color:#8487bd">${ST[s] || s || '—'}</span>`;
  };

  const oldCell = window.buildBestCell;
  window.buildBestCell = function (d, k, rec, other, dow) {
    let html = oldCell.apply(this, arguments);
    const row = arch()[k]; if (!row || !row.n) return html;
    let layer = `<div class="aside25-layer" style="border-top:1px dashed ${line};margin-top:4px;padding-top:3px;color:${color};font-size:10px" title="🆈 어사이드25(캔들위매매법 Aside판 · 캔들 위 MACD 가격표) · 신호일 ${ymd(row.sd)} 종가까지 보고 고름 · 지=지지 점=점화 계=계단 · 눌러서 자세히"><b>🆈 어사이드25 · ${row.n}종목</b>${row.e ? ' <span style="color:#8487bd" title="2016 전 칸 = 검증 밖 · 지금 상장 종목 위주라 좋게 보일 수 있음">앞</span>' : ''}`;
    row.a.slice(0, SHOW).forEach(x => {
      const tip = `${TYP[g(x, 't')] || ''} · 신호일 종가 ${won(g(x, 'pc'))}(${g(x, 'chg')}%) · 가격표 ${won(g(x, 'tg'))}(${md(g(x, 'igd'))} 점화) · 손절선 ${won(g(x, 'stp'))} · 거래량 ${g(x, 'vx') == null ? '—' : g(x, 'vx') + '배'} · 매수가 ${won(g(x, 'b'))} · 5일 최고 ${g(x, 'mx') == null ? '—' : g(x, 'mx') + '%'} · 최저 ${g(x, 'mn') == null ? '—' : g(x, 'mn') + '%'} · ${ST[g(x, 's')] || ''} · 영상대로 ${g(x, 'sa') === 'C' ? (g(x, 'pa') + '% ' + (WHY[g(x, 'ya')] || '')) : (g(x, 'sa') === 'H' ? '규칙상 계속 ' + g(x, 'pa') + '%' : '—')}`;
      layer += `<div title="${esc(tip)}" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis"><b>${esc(name(x))}</b><small style="color:#a89f6a">${TS[g(x, 't')] || ''}</small> ${res(x)}</div>`;
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
      if (n) { if (i + 1 !== bestM) btn.classList.add('has-data'); btn.title += ` · 어사이드25 ${n}종목`; }
    });
    return result;
  };

  const st = s => s && s.n ? `5일 확정 ${Number(s.n).toLocaleString('ko-KR')}건 +20% ${s.up}% · 5일째 평균 ${pct(s.rr, 2)} 중앙 ${pct(s.med, 2)}`
    + (s.na ? ` · 영상대로 ${Number(s.na).toLocaleString('ko-KR')}건 평균 ${pct(s.ra, 2)} 중앙 ${pct(s.ma, 2)}` : '') : '확정 0건';
  const oldMeta = window.renderBestMeta;
  window.renderBestMeta = function () {
    const result = oldMeta.apply(this, arguments);
    const el = document.getElementById('best-meta'), m = window.어사이드25_META;
    if (!el) return result;
    if (!m) { el.innerHTML += '<br><span style="color:#ff9aaa">❌ 베스트_어사이드25.js 가 안 읽혔다 = 주도주\\_베스트_어사이드25_빌드.py 실행</span>'; return result; }
    const E = m.예정 || {}, T = m.십년 || {}, Y = (m.연도 || []).find(r => typeof bestY !== 'undefined' && r.y === bestY);
    const names = E.종목 || [];
    const nm10 = names.slice(0, 10).join(', ') + (names.length > 10 ? ` 외 ${names.length - 10}` : '');
    el.innerHTML += `<div class="aside25-meta" style="margin-top:5px;color:${color}"><b>🆈 어사이드25</b>(캔들위매매법 Aside판 · 캔들 위 MACD 가격표) ${esc(m.첫칸)}~${esc(m.끝칸)} · ${Number(m.칸).toLocaleString('ko-KR')}칸 · 신호 ${Number(m.종목수).toLocaleString('ko-KR')} · ${st(m.전체)} · 결과대기 ${m.결과대기}`
      + ` · 검증구간(2016~2026-08) ${st(m.검증구간)} · 2016 전 「앞」 ${st(m.앞구간)}`
      + (Y && Y.n ? ` · ${bestY}년 ${Y.n}건 +20% ${Y.up}% 평균 ${pct(Y.rr, 2)} 중앙 ${pct(Y.med, 2)}` : '')
      + ` · ${ymd(E.매수일)} 8시 예정 ${names.length}종목${names.length ? '(' + esc(nm10) + ')' : ''}`
      + (m.경고 ? ` · <span style="color:#ffc454">천프정 ${ymd(m.마지막봉)} 봉이 직전 5거래일 거래 종목 ${Number(m.기준).toLocaleString('ko-KR')} 중 ${Number(m.들어옴).toLocaleString('ko-KR')}만 들어옴(빠진 종목은 그 전 봉까지 · 예정이 덜 나올 수 있음)</span>` : '')
      + `<br><span style="color:#ff9aaa">${esc(m.판정)} · 10년 관문 ${m.관문통과}/6</span> · 10년(2016~2026-08) 5일 안 +20% ${T.hit != null ? (T.hit * 100).toFixed(1) : '—'}%(같은 날 거래대금×변동성 같은 칸 무작위의 ${T.lift != null ? T.lift.toFixed(2) : '—'}배 · 월묶음 z ${T.zb != null ? T.zb.toFixed(1) : '—'}) · -20% 급락도 ${T.dlift != null ? T.dlift.toFixed(2) : '—'}배 · 영상대로 평균 ${T.A평균 != null ? pct(T.A평균 * 100, 2) : '—'} 중앙 ${T.A중앙 != null ? pct(T.A중앙 * 100, 2) : '—'} · [대조] ${esc(m.대조)} · [10년 재현] ${esc(m.재현)} · ${esc(m.아침)}`
      + `<br><span style="color:#8487bd">힘선(전형가격 34일 이중지수평균)이 통로(고가·저가 67일 지수평균)를 처음 뚫은 날 종가 = 가격표 · 지(지지 = 가격표 +2% 까지 눌렸다가 양봉으로 가격표 위 마감 · 리본 빨강) · 점(점화 = 통로 첫 돌파 + 거래량 1.5배 + 윗꼬리 짧은 양봉 + 통로 위 10% 안) · 계(계단 = 이전보다 높은 가격표로 재점화) · 같은 종목·같은 셋업 10봉 재신호 무시 · 보통주 · 종가 1,000원+ · 20일 평균 대금 10억+ · 상한가 제외 · 하루 상한 없음 · 5일 = 매수일 시가 → 5번째 거래일 종가(비용 0.35%p) · +20✓ = 5거래일 안 +20% · 영상대로 = 리본 색 바뀜 또는 꺼짐(종가 < 가격표 −7% · 힘선 < 통로 하단) 그날 종가 · 「앞」 = 2016 전(검증 밖) · 🆁 어사이드18 · 🆇 어사이드24 와 다른 판</span></div>`;
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
    const prev = body.querySelector('[data-aside25-detail]'); if (prev) prev.remove();
    let html = `<section data-aside25-detail style="margin-top:20px;color:${color}"><h3 style="margin:0">🆈 어사이드25 · 매수일 ${esc(k)} · ${row.n}종목 <span style="font-size:12px;color:#ff9aaa;font-weight:600">관찰용 · 매수추천 아님</span></h3>`
      + `<p style="color:#8487bd;font-size:12px;line-height:1.6;margin:6px 0">캔들위매매법 Aside판(바치올 캔들 위 MACD) · 신호일 <b style="color:#c9cbe8">${ymd(row.sd)}</b> 종가까지만 보고 고름${row.e ? ' · <b style="color:#ffc454">2016 전 칸 = 검증 밖</b>' : ''} · 순서 = 지지 → 점화+계단 → 계단 → 점화, 같은 셋업은 거래대금 큰 순 · 손절선 = 가격표 −7%(종가가 그 아래거나 힘선이 통로 아래로 빠지면 꺼짐)<br>`
      + `<b style="color:#c9cbe8">결과는 규칙대로 샀다고 가정한 계산(실제 매매와 무관)</b> · 5일 = 매수일 시가 → 5번째 거래일 종가(비용 0.35%p) · +20✓ = 매수일 포함 5거래일 안 고가가 매수가 +20% 에 닿음 · 영상대로 = 같은 매수가 → 리본 색 바뀜 또는 꺼짐 난 날 종가(최대 60일)</p><div style="overflow-x:auto"><table style="border-collapse:collapse;color:#e4e6ff;font-size:12px"><tr>`;
    ['순위', '종목', '셋업', '신호일 종가(등락)', '가격표(점화일) · 손절선', '거래량 배수', '매수가(시가)', '5일 최고', '5일 최저', '+20% 닿은 날', '5일 결과', '5일째 수익', '영상대로 매매'].forEach(t => html += `<th style="padding:5px 7px;border-bottom:1px solid ${line};color:#8487bd;white-space:nowrap;text-align:left">${t}</th>`);
    html += '</tr>';
    row.a.forEach(x => {
      const nmEl = `<span style="cursor:pointer;font-weight:bold;color:${color}" onclick="_openStock(this,function(){openBestDetail('${k}')})" data-code="${esc(g(x, 'c'))}" data-name="${esc(name(x))}" data-rate="0" data-amount="0" data-meta="🆈어사이드25 ${k}" data-catalyst="">${esc(name(x))}</span> <small style="color:#6b6e9c">${esc(g(x, 'c'))} ${esc(mkt(x))}</small>`;
      const s = g(x, 's'), done = s === 'C' || s === 'H';
      const vals = [g(x, 'r'), nmEl, TYP[g(x, 't')] || g(x, 't'), `${won(g(x, 'pc'))} (${pct(g(x, 'chg'))})`, `${won(g(x, 'tg'))}(${md(g(x, 'igd'))}) · ${won(g(x, 'stp'))}`,
        g(x, 'vx') == null ? '—' : g(x, 'vx') + '배', won(g(x, 'b')), done ? pct(g(x, 'mx')) : '—', done ? pct(g(x, 'mn')) : '—', g(x, 'hd') ? ymd(g(x, 'hd')) : '—',
        (ST[s] || s) + (s === 'H' ? ` (${g(x, 'kd')}/5일)` : '') + (g(x, 'ed') ? ` · ${ymd(g(x, 'ed'))}` : ''), done ? pct(g(x, 'p'), 2) : '—', resA(x)];
      html += '<tr>' + vals.map(v => `<td style="padding:5px 7px;border-bottom:1px solid #3a3620;white-space:nowrap">${v}</td>`).join('') + '</tr>';
    });
    body.insertAdjacentHTML('beforeend', html + '</table></div></section>');
    ov.style.display = 'flex';
    window.__배지복귀 = function () { window.openBestDetail(k); };
    return result;
  };
  if (typeof bestY !== 'undefined' && typeof window.renderBestCalendar === 'function') {
    try { window.renderBestCalendar(); } catch (e) { console.warn('어사이드25 다시 그리기 실패', e); }
  }
})();
