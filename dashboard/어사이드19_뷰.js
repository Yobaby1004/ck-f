/* 🆂 어사이드19 (2026-10-02 사용자 지시) = 캔들위매매법2(바치올 임펄스MACD리본 v3 · 날마다 매수 신호를 리본 두께 순으로 줄 세운 추천 5) · 🏅 베스트 달력에 묶음을 더한다(기존 자료·함수는 그대로).
   스킬 /어사이드19 · 빌더 = 주도주\_베스트_어사이드19_빌드.py (→ 매매법\캔들위매매법2\_07_달력.py · 동결 엔진 _캔들위2_엔진.py · 순위 _순위.py) · 자료 = dashboard/data/베스트_어사이드19(_과거).js
   한마디로: 힘선(중심 2중 지수평균 34)이 통로(고가·저가 67일 지수평균)를 뚫은 날 종가 = 가격표 · ①점화 ②가격표지지 ④계단재점화 신호 중 리본 두께 큰 5종목
   칸 = 매수일(8시 목록) · 결과는 규칙대로 샀다고 가정한 계산(매수일 시가 → +20% 지정가 · ③꺼짐 난 날 종가 · 20거래일 만기 · 비용 0.3%) · 사전등록 기각 · 관찰용 · 매수추천 아님
   감싸는 함수 = buildBestCell · renderBestMonthStrip · renderBestMeta · openBestDetail (어사이드18_뷰.js 와 같은 방식 · 그 뒤에 읽는다) */
(function () {
  'use strict';
  if (window.__aside19Installed) return;
  const originals = ['buildBestCell', 'renderBestMonthStrip', 'renderBestMeta', 'openBestDetail'];
  if (originals.some(n => typeof window[n] !== 'function')) { console.error('어사이드19: 베스트 달력 함수가 없습니다'); return; }
  window.__aside19Installed = true;
  const color = '#7fe0c4', line = '#2c5a4e';
  const arch = () => window.어사이드19_ARCHIVE || {};
  const NM = () => window.어사이드19_NAMES || {};
  const I = {};
  (window.어사이드19_COLS || ['c', 'r', 't', 'pc', 'chg', 'ig', 'stop', 'rw', 'vx', 'a20', 'b', 's', 'p', 'k', 'ed', 'w', 'h20', 'mx']).forEach((c, i) => { I[c] = i; });
  const g = (x, key) => x[I[key]];
  const esc = v => String(v == null ? '' : v).replace(/[&<>"']/g, ch => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[ch]));
  const pct = (v, dg) => v == null ? '—' : `<span style="color:${v >= 0 ? '#ff8a8a' : '#7ea6ff'}">${v >= 0 ? '+' : ''}${Number(v).toFixed(dg == null ? 1 : dg)}%</span>`;
  const won = v => v == null ? '—' : Number(v).toLocaleString('ko-KR', {maximumFractionDigits: 0});
  const ymd = s => { s = String(s || ''); return s.length === 8 ? `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6)}` : s; };
  const md = s => { s = String(s || ''); return s.length === 8 ? `${s.slice(4, 6)}/${s.slice(6)}` : s; };
  const TYL = {'①': '①점화', '②': '②가격표지지', '④': '④계단재점화', '①④': '①점화+④계단'};
  const WHY = {1: '익절', 2: '꺼짐', 3: '만기'};
  const name = x => (NM()[g(x, 'c')] || [g(x, 'c')])[0];
  const mkt = x => (NM()[g(x, 'c')] || ['', ''])[1];
  const far = x => g(x, 'pc') && g(x, 'stop') ? (1 - g(x, 'stop') / g(x, 'pc')) * 100 : null;
  const warn = x => {
    const w = [];
    if (g(x, 'chg') >= 29) w.push('신호일 상한가 마감 = 과거 규칙 매매 평균 IS −2.17% · HOLDOUT −4.82%(사후 관찰)');
    const f = far(x); if (f != null && f >= 20) w.push(`신호일 종가 → 꺼짐선 ${f.toFixed(0)}% = 손절이 멀다 · 과거 평균손실 −18~−22%(사후 관찰)`);
    return w.length ? ` <span style="color:#ffc454" title="${esc(w.join(' / '))}">⚠</span>` : '';
  };
  const ST = {C: '확정', H: '결과대기', P: '예정(목록만)', S: '자료끊김'};
  const res = x => {
    const s = g(x, 's'), h20 = g(x, 'h20') ? ' <span style="color:#ff8a8a">+20✓</span>' : '';
    if (s === 'C') return `${pct(g(x, 'p'))} <span style="color:#8487bd">${WHY[g(x, 'w')] || ''}</span>${h20}`;
    if (s === 'H') return `<span style="color:#ffc454">결과대기 ${g(x, 'k')}일</span> ${pct(g(x, 'p'))}${h20}`;
    if (s === 'P') return '<span style="color:#7ee8ff">예정</span>';
    return `<span style="color:#8487bd">${ST[s] || s}</span>`;
  };

  const oldCell = window.buildBestCell;
  window.buildBestCell = function (d, k, rec, other, dow) {
    let html = oldCell.apply(this, arguments);
    const row = arch()[k]; if (!row || !row.n) return html;
    let layer = `<div class="aside19-layer" style="border-top:1px dashed ${line};margin-top:4px;padding-top:3px;color:${color};font-size:10px" title="🆂 어사이드19(캔들위매매법2 · 임펄스MACD리본 · 추천5) · 신호일 ${ymd(row.sd)} 종가까지 보고 고름 · 그날 매수 신호 ${row.N}개 중 리본 두께 큰 5 · 눌러서 자세히"><b>🆂 어사이드19 · 추천${row.n}</b> <span style="color:#8487bd">(신호 ${row.N})</span>${row.e ? ' <span style="color:#8487bd" title="2014년 전 칸 = 계산 시작을 천프정 첫 봉으로 당겨 채움 · 검증 밖 · 2009-06 전은 분할 사건표 없음 · 지금 상장 종목만이라 좋게 보일 수 있음">앞</span>' : ''}`;
    row.a.forEach(x => {
      const tip = `${g(x, 'r')}위 · ${TYL[g(x, 't')] || g(x, 't')} · 신호일 종가 ${won(g(x, 'pc'))}(${g(x, 'chg')}%) · 가격표 ${won(g(x, 'ig'))} · 꺼짐선 ${won(g(x, 'stop'))} · 리본 두께 ${g(x, 'rw')}% · 매수가 ${won(g(x, 'b'))} · ${ST[g(x, 's')] || ''}${g(x, 'ed') ? ' ' + md(g(x, 'ed')) : ''}`;
      layer += `<div title="${esc(tip)}" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis"><span style="color:#8fbfb0">${g(x, 'r')}</span> <span style="color:#a9b9ee">${esc(g(x, 't'))}</span> <b>${esc(name(x))}</b>${warn(x)} ${res(x)}</div>`;
    });
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
      if (n) { if (i + 1 !== bestM) btn.classList.add('has-data'); btn.title += ` · 어사이드19 ${n}종목`; }
    });
    return result;
  };

  const p100 = (v, dg) => pct(v != null ? v * 100 : null, dg);
  const vtxt = v => v && v.n ? `추천5 ${Number(v.n).toLocaleString('ko-KR')}건 · 10일 +20% ${(v.hit * 100).toFixed(1)}%(같은 날 같은 등락·변동성 ${(v.exp * 100).toFixed(1)}% · lift ${v.lift.toFixed(2)} [${v.llo.toFixed(2)}~${v.lhi.toFixed(2)}]) · 규칙 매매 평균 ${p100(v.rr, 2)}(같은 손절 거리 무작위 ${p100(v.c3, 2)} · 차이 ${(v.diff * 100).toFixed(2)}%p [${(v.dlo * 100).toFixed(2)}~${(v.dhi * 100).toFixed(2)}]) · 승률 ${(v.win * 100).toFixed(0)}% · 평균손실 ${p100(v.loss, 1)}` : '—';
  const oldMeta = window.renderBestMeta;
  window.renderBestMeta = function () {
    const result = oldMeta.apply(this, arguments);
    const el = document.getElementById('best-meta'), m = window.어사이드19_META;
    if (!el) return result;
    if (!m) { el.innerHTML += '<br><span style="color:#ff9aaa">❌ 베스트_어사이드19.js 가 안 읽혔다 = 주도주\\_베스트_어사이드19_빌드.py 실행</span>'; return result; }
    const T = m.전체 || {}, L = m.검증구간 || {}, E = m.예정 || {}, V = m.검증 || {}, Y = (m.연도 || []).find(r => typeof bestY !== 'undefined' && r.y === bestY);
    const names = E.종목 || [];
    const part = m.빠짐 > 0 && m.들어옴 / m.기준 < 0.97;
    el.innerHTML += `<div class="aside19-meta" style="margin-top:5px;color:${color}"><b>🆂 어사이드19</b>(캔들위매매법2 · 바치올 임펄스MACD리본 v3 · 리본 두께 순 추천5) ${ymd(m.첫칸.replace(/-/g, ''))}~${ymd(m.끝칸.replace(/-/g, ''))} · ${Number(m.칸).toLocaleString('ko-KR')}칸 · 추천 ${Number(m.추천).toLocaleString('ko-KR')}줄 · 확정 ${Number(T.n || 0).toLocaleString('ko-KR')}건 평균 ${pct(T.rr, 2)} 중앙 ${pct(T.med, 2)} 승률 ${T.win}% 평균손실 ${pct(T.loss, 1)} · 2015-06-15~ 확정 ${Number(L.n || 0).toLocaleString('ko-KR')}건 평균 ${pct(L.rr, 2)} · 결과대기 ${m.결과대기}`
      + (Y && Y.n ? ` · ${bestY}년 ${Y.n}건 평균 ${pct(Y.rr, 2)} 중앙 ${pct(Y.med, 2)} 익절 ${Y.tgt}%` : '')
      + ` · ${ymd(E.매수일)} 8시 예정 ${names.length}종목${names.length ? '(' + esc(names.join(', ')) + ')' : ''}${E.신호 ? ' · 그날 신호 ' + E.신호 : ''}`
      + (part ? ` · <span style="color:#ffc454">⚠ 천프정 ${ymd(m.마지막봉)} 봉이 ${m.들어옴}/${m.기준}종목만 들어옴 = 그날 추천5·예정은 나머지가 들어오면 바뀔 수 있음(/매매일 로 채운 뒤 /어사이드19)</span>` : '')
      + `<br><span style="color:#ff9aaa">${esc(m.판정)} · 매수추천 아님</span> · 검증 IS(2015-06~2024) ${vtxt(V.IS)} · HOLDOUT(2025~2026-08) ${vtxt(V.HO)} · ${esc(m.대조)} · 재현 ${esc(m.재현)} · ${esc(m.지난판)}`
      + `<br><span style="color:#8487bd">신호 = ①점화(힘선이 통로를 처음 뚫음 · 거래량 1.5배 · 윗꼬리 짧은 양봉) · ②가격표지지(가격표 +2% 안 눌림 뒤 양봉 회복) · ④계단재점화(새 가격표 > 이전) · 그날 신호 전부를 리본 두께(가격 대비) 큰 순 → 상위 5 · 칸 = 매수일 시가 → +20% 지정가 · ③꺼짐(종가 < 가격표 −7% 또는 힘선 < 통로 하단) 그날 종가 · 20거래일 만기 · 「앞」 = 2014년 전(검증 밖) · 지금 상장 종목만이라 옛 칸은 좋게 보일 수 있음 · ⚠ = 신호일 상한가 또는 손절선이 20%+ 멀다(사후 관찰 · 과거 나빴음)</span></div>`;
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
    const prev = body.querySelector('[data-aside19-detail]'); if (prev) prev.remove();
    let html = `<section data-aside19-detail style="margin-top:20px;color:${color}"><h3 style="margin:0">🆂 어사이드19 · 매수일 ${esc(k)} · 추천 ${row.n}종목 (그날 신호 ${row.N}) <span style="font-size:12px;color:#ff9aaa;font-weight:600">기각 · 관찰용 · 매수추천 아님</span></h3>`
      + `<p style="color:#8487bd;font-size:12px;line-height:1.6;margin:6px 0">캔들위매매법2(바치올 임펄스MACD리본 v3) · 신호일 <b style="color:#c9cbe8">${ymd(row.sd)}</b> 종가까지만 보고 그날 매수 신호 ${row.N}개를 리본 두께(가격 대비) 큰 순으로 줄 세운 상위 ${row.n}${row.e ? ' · <b style="color:#ffc454">2014년 전 칸 = 검증 밖</b>' : ''}<br>`
      + `<b style="color:#c9cbe8">결과는 규칙대로 샀다고 가정한 계산(실제 매매와 무관)</b> · 매수일 시가 → +20% 지정가 · ③꺼짐(종가가 꺼짐선 아래 또는 힘선이 통로 하단 아래) 그날 종가 · 20거래일 만기 · 비용 0.3% · +20✓ = 매수일 포함 10거래일 안 고가가 매수가 +20% 에 닿음</p><div style="overflow-x:auto"><table style="border-collapse:collapse;color:#e4e6ff;font-size:12px"><tr>`;
    ['순위', '종목', '신호', '신호일 종가(등락)', '가격표', '꺼짐선', '리본 두께', '거래량 배수', '20일 대금(억)', '매수가(시가)', '결과', '수익', '보유일', '청산', '10일 +20%', '10일 최고'].forEach(t => html += `<th style="padding:5px 7px;border-bottom:1px solid ${line};color:#8487bd;white-space:nowrap;text-align:left">${t}</th>`);
    html += '</tr>';
    row.a.forEach(x => {
      const nmEl = `<span style="cursor:pointer;font-weight:bold;color:${color}" onclick="_openStock(this,function(){openBestDetail('${k}')})" data-code="${esc(g(x, 'c'))}" data-name="${esc(name(x))}" data-rate="0" data-amount="0" data-meta="🆂어사이드19 ${k}" data-catalyst="">${esc(name(x))}</span> <small style="color:#6b6e9c">${esc(g(x, 'c'))} ${esc(mkt(x))}</small>`;
      const s = g(x, 's'), done = s === 'C' || s === 'H';
      const vals = [g(x, 'r'), nmEl, (TYL[g(x, 't')] || g(x, 't')) + warn(x), `${won(g(x, 'pc'))} (${pct(g(x, 'chg'))})`, won(g(x, 'ig')), `${won(g(x, 'stop'))} <small style="color:#6b6e9c">${far(x) != null ? '−' + far(x).toFixed(1) + '%' : ''}</small>`,
        g(x, 'rw') == null ? '—' : g(x, 'rw') + '%', g(x, 'vx') == null ? '—' : g(x, 'vx') + '배', g(x, 'a20') == null ? '—' : won(g(x, 'a20')), won(g(x, 'b')),
        ST[s] || s, done ? pct(g(x, 'p'), 2) : '—', done ? g(x, 'k') + '일' : '—', s === 'C' ? `${WHY[g(x, 'w')] || ''} ${ymd(g(x, 'ed'))}` : '—',
        g(x, 'h20') ? `<span style="color:#ff8a8a">${g(x, 'h20')}일째</span>` : (done ? '—' : ''), done ? pct(g(x, 'mx')) : '—'];
      html += '<tr>' + vals.map(v => `<td style="padding:5px 7px;border-bottom:1px solid #22403a;white-space:nowrap">${v}</td>`).join('') + '</tr>';
    });
    body.insertAdjacentHTML('beforeend', html + '</table></div></section>');
    ov.style.display = 'flex';
    window.__배지복귀 = function () { window.openBestDetail(k); };
    return result;
  };
  if (typeof bestY !== 'undefined' && typeof window.renderBestCalendar === 'function') {
    try { window.renderBestCalendar(); } catch (e) { console.warn('어사이드19 다시 그리기 실패', e); }
  }
})();
