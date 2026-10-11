/* 🆆 어사이드23 (2026-10-02 사용자 지시) = 합침매매법2(바치올 실타래 매듭 풀림 + 임펄스MACD리본 점화 · 5봉 안 두 번째 다리 날) · 🏅 베스트 달력에 묶음을 더한다(기존 자료·함수는 그대로).
   스킬 /어사이드23 · 빌더 = 주도주\_베스트_어사이드23_빌드.py (→ 매매법\합침매매법2\_08_달력.py · 동결 엔진 _합침2_엔진.py md5 fbb20635) · 자료 = dashboard/data/베스트_어사이드23(_과거).js
   한마디로: 실타래 노랑 매듭 상자 윗선을 양봉 종가로 처음 넘은 날(매듭 풀림)과 임펄스 힘선이 통로 상단을 처음 넘은 날(점화)이 5봉 안에 같이 · 두 번째 다리가 들어온 날 양봉·리본 빨강·가격표 살아 있음·띠 순서·윗선 위
   칸 = 매수일(8시 목록) · 결과는 규칙대로 샀다고 가정한 계산(매수일 시가 → +20% 지정가 · 가격표 꺼진 날 종가 · 20거래일 만기 · 비용 0.3%)
   사전등록 기각 · 관찰용 · 매수추천 아님 · 합쳐도 실타래만보다 안 나음
   감싸는 함수 = buildBestCell · renderBestMonthStrip · renderBestMeta · openBestDetail (어사이드21·22_뷰.js 와 같은 방식 · 그 뒤에 읽는다) */
(function () {
  'use strict';
  if (window.__aside23Installed) return;
  const originals = ['buildBestCell', 'renderBestMonthStrip', 'renderBestMeta', 'openBestDetail'];
  if (originals.some(n => typeof window[n] !== 'function')) { console.error('어사이드23: 베스트 달력 함수가 없습니다'); return; }
  window.__aside23Installed = true;
  const color = '#ff9ad5', line = '#5a2a48', SHOW = 6;
  const arch = () => window.어사이드23_ARCHIVE || {};
  const NM = () => window.어사이드23_NAMES || {};
  const I = {};
  (window.어사이드23_COLS || ['c', 'chg', 'pc', 'leg', 'bk', 'bi', 'ig', 'stp', 'top', 'bot', 'sdist', 'en', 'vx', 'a20', 'b', 's', 'p', 'k', 'ed', 'w', 'h20', 'mx']).forEach((c, i) => { I[c] = i; });
  const g = (x, key) => x[I[key]];
  const esc = v => String(v == null ? '' : v).replace(/[&<>"']/g, ch => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[ch]));
  const pct = (v, dg) => v == null ? '—' : `<span style="color:${v >= 0 ? '#ff8a8a' : '#7ea6ff'}">${v >= 0 ? '+' : ''}${Number(v).toFixed(dg == null ? 1 : dg)}%</span>`;
  const won = v => v == null ? '—' : Number(v).toLocaleString('ko-KR', {maximumFractionDigits: 0});
  const ymd = s => { s = String(s || ''); return s.length === 8 ? `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6)}` : s; };
  const md = s => { s = String(s || ''); return s.length === 8 ? `${s.slice(4, 6)}/${s.slice(6)}` : s; };
  const name = x => (NM()[g(x, 'c')] || [g(x, 'c')])[0];
  const mkt = x => (NM()[g(x, 'c')] || ['', ''])[1];
  const ST = {C: '확정', H: '결과대기', P: '예정(목록만)', S: '자료끊김'};
  const WHY = {1: '익절 +20%', 2: '청산(가격표 꺼짐)', 3: '20일 만기'};
  const LEG = {K: '매듭 풀림 먼저 → 오늘 점화', I: '점화 먼저 → 오늘 매듭 풀림', '=': '같은 날'};
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
    let layer = `<div class="aside23-layer" style="border-top:1px dashed ${line};margin-top:4px;padding-top:3px;color:${color};font-size:10px" title="🆆 어사이드23(합침매매법2 · 실타래 매듭 풀림 + 임펄스 점화) · 신호일 ${ymd(row.sd)} 종가까지 보고 고름 · 눌러서 자세히"><b>🆆 어사이드23 · ${row.n}종목</b>${row.e ? ' <span style="color:#8487bd" title="2005-07 전 칸 = 계산 시작을 천프정 첫 봉으로 당겨 채움 · 검증 밖 · 지금 상장 종목만이라 좋게 보일 수 있음">앞</span>' : ''}`;
    row.a.slice(0, SHOW).forEach(x => {
      const tip = `${LEG[g(x, 'leg')] || ''} · 신호일 종가 ${won(g(x, 'pc'))}(${g(x, 'chg')}%) · 점화가 ${won(g(x, 'ig'))} · 꺼짐선 ${won(g(x, 'stp'))}(${g(x, 'sdist')}%) · 매듭 상자 ${won(g(x, 'bot'))}~${won(g(x, 'top'))} · 매듭 에너지 ${g(x, 'en')} · 매수가 ${won(g(x, 'b'))} · ${ST[g(x, 's')] || ''}${g(x, 'ed') ? ' ' + md(g(x, 'ed')) + ' ' + (WHY[g(x, 'w')] || '') : ''}`;
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
      if (n) { if (i + 1 !== bestM) btn.classList.add('has-data'); btn.title += ` · 어사이드23 ${n}종목`; }
    });
    return result;
  };

  const ci = v => Array.isArray(v) && v[0] != null ? `${v[0] >= 0 ? '+' : ''}${(v[0] * 100).toFixed(2)}%p [${(v[1] * 100).toFixed(2)}~${(v[2] * 100).toFixed(2)}]` : '—';
  const vtxt = v => v && v.n ? `H ${Number(v.n).toLocaleString('ko-KR')}건 · 10일 +20% lift ${v.lift != null ? v.lift.toFixed(2) : '—'} [${v.llo != null ? v.llo.toFixed(2) : '—'}~${v.lhi != null ? v.lhi.toFixed(2) : '—'}] · 규칙 매매 평균 ${pct(v.rr != null ? v.rr * 100 : null, 2)}(같은 꺼짐 거리 무작위 ${pct(v.c3 != null ? v.c3 * 100 : null, 2)} · 차이 ${ci([v.diff, v.dlo, v.dhi])}) · 평균손실 ${pct(v.loss != null ? v.loss * 100 : null, 1)}` : '—';
  const oldMeta = window.renderBestMeta;
  window.renderBestMeta = function () {
    const result = oldMeta.apply(this, arguments);
    const el = document.getElementById('best-meta'), m = window.어사이드23_META;
    if (!el) return result;
    if (!m) { el.innerHTML += '<br><span style="color:#ff9aaa">❌ 베스트_어사이드23.js 가 안 읽혔다 = 주도주\\_베스트_어사이드23_빌드.py 실행</span>'; return result; }
    const T = m.전체 || {}, L = m.동결구간 || {}, E = m.예정 || {}, V = m.검증 || {}, G = m.합침값 || {}, WK = m.대기K || [], WI = m.대기I || [];
    const Y = (m.연도 || []).find(r => typeof bestY !== 'undefined' && r.y === bestY);
    const names = E.종목 || [];
    el.innerHTML += `<div class="aside23-meta" style="margin-top:5px;color:${color}"><b>🆆 어사이드23</b>(합침매매법2 · 실타래 매듭 풀림 + 임펄스 점화) ${esc(m.첫칸)}~${esc(m.끝칸)} · ${Number(m.칸).toLocaleString('ko-KR')}칸 · H ${Number(m.신호).toLocaleString('ko-KR')} · 확정 ${Number(T.n || 0).toLocaleString('ko-KR')}건 평균 ${pct(T.rr, 2)} 중앙 ${pct(T.med, 2)} 승률 ${T.win}% 평균손실 ${pct(T.loss, 1)} · ${ymd(m.CUT).slice(0, 7)}~ 확정 ${Number(L.n || 0).toLocaleString('ko-KR')}건 평균 ${pct(L.rr, 2)} · 결과대기 ${m.결과대기}`
      + (Y && Y.n ? ` · ${bestY}년 ${Y.n}건 평균 ${pct(Y.rr, 2)} 중앙 ${pct(Y.med, 2)}` : '')
      + ` · ${ymd(E.매수일)} 8시 예정 ${names.length}종목${names.length ? '(' + esc(names.slice(0, 12).join(', ')) + (names.length > 12 ? ' 외 ' + (names.length - 12) : '') + ')' : ''}`
      + ` · 대기K(매듭 풀림 뒤 점화 기다림) ${WK.length}${WK.length ? '(' + esc(WK.slice(0, 8).map(w => `${w[0]} 점화까지 ${w[4] >= 0 ? '+' : ''}${w[4]}%`).join(', ')) + ')' : ''}`
      + ` · 대기I(점화 뒤 윗선 돌파 기다림) ${WI.length}${WI.length ? '(' + esc(WI.slice(0, 8).map(w => `${w[0]} 윗선 ${won(w[2])} 까지 ${w[4] >= 0 ? '+' : ''}${w[4]}%`).join(', ')) + ')' : ''}`
      + (m.기준 && m.들어옴 / m.기준 < 0.97 ? ` · <span style="color:#ffc454">천프정 ${ymd(m.마지막봉)} 봉이 직전 5거래일 거래 종목 ${m.기준} 중 ${m.들어옴}만 들어옴(빠진 종목은 그 전 봉까지 · 예정·대기가 덜 나올 수 있음)</span>` : '')
      + `<br><span style="color:#ff9aaa">${esc(m.판정)} · 매수추천 아님</span> · 검증 IS(2015-06~2024) ${vtxt(V.IS)} · HOLDOUT(2025~2026-08) ${vtxt(V.HO)} · OOS(PRE∪HOLDOUT) ${vtxt(V.OOS)}`
      + ` · ★합침의 값 = H − 실타래만(어사이드21 신호 A) 10일 초과수익 IS ${ci(G.IS)} · OOS ${ci(G.OOS)}(점 추정 전 구간 음수) · ${esc(m.대조)} · ${esc(m.재현)} · ${esc(m.지난판)}`
      + `<br><span style="color:#8487bd">H = 실타래 매듭 풀림(어제 노랑 매듭 상자 + 어제 에너지 ≥ 20 → 오늘 양봉 종가가 어제 상자 윗선을 처음 넘음 · 세 띠 순서 · 폭 증가)과 임펄스 점화(힘선 = 2중 지수평균 34 가 통로 상단 = 고가 67일 지수평균을 처음 넘음)가 5거래일 안에 같이 · 두 번째 다리가 들어온 날 양봉 · 리본 빨강 · 가격표 살아 있음 · 띠 순서 · 종가 > 그 매듭 윗선 · 칸 = 매수일 시가 → +20% 지정가 · 가격표 꺼진 날(종가 < 점화가 −7% 또는 힘선 < 통로 하단) 종가 · 20거래일 만기 · 「앞」 = 2005-07 전(검증 밖) · 지금 상장 종목만이라 옛 칸은 좋게 보일 수 있음 · 신호가 드물다(하루 평균 0.05 · 빈 칸이 정상) · +20% 를 노리는 도구 아님(10일 +20% IS 12.6%)</span></div>`;
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
    const prev = body.querySelector('[data-aside23-detail]'); if (prev) prev.remove();
    let html = `<section data-aside23-detail style="margin-top:20px;color:${color}"><h3 style="margin:0">🆆 어사이드23 · 매수일 ${esc(k)} · ${row.n}종목 <span style="font-size:12px;color:#ff9aaa;font-weight:600">기각 · 관찰용 · 매수추천 아님</span></h3>`
      + `<p style="color:#8487bd;font-size:12px;line-height:1.6;margin:6px 0">합침매매법2(실타래 매듭 풀림 + 임펄스 점화 · 5봉 안) · 신호일 <b style="color:#c9cbe8">${ymd(row.sd)}</b> 종가까지만 보고 고름${row.e ? ' · <b style="color:#ffc454">2005-07 전 칸 = 검증 밖</b>' : ''} · 순서 = 그 매듭 에너지 큰 순<br>`
      + `<b style="color:#c9cbe8">결과는 규칙대로 샀다고 가정한 계산(실제 매매와 무관)</b> · 매수일 시가 → +20% 지정가 · 가격표 꺼진 날(종가 < 점화가 −7% 또는 힘선 < 통로 하단) 종가 · 20거래일 만기 · 비용 0.3% · +20✓ = 매수일 포함 10거래일 안 고가가 매수가 +20% 에 닿음</p><div style="overflow-x:auto"><table style="border-collapse:collapse;color:#e4e6ff;font-size:12px"><tr>`;
    ['#', '종목', '완성(먼저 → 오늘)', '신호일 종가(등락)', '점화가 · 꺼짐선', '꺼짐선까지', '매듭 상자(아랫선~윗선)', '매듭 에너지', '거래량 배수', '20일 대금(억)', '매수가(시가)', '결과', '수익', '보유일', '청산일·사유', '10일 +20%', '10일 최고'].forEach(t => html += `<th style="padding:5px 7px;border-bottom:1px solid ${line};color:#8487bd;white-space:nowrap;text-align:left">${t}</th>`);
    html += '</tr>';
    row.a.forEach((x, i) => {
      const nmEl = `<span style="cursor:pointer;font-weight:bold;color:${color}" onclick="_openStock(this,function(){openBestDetail('${k}')})" data-code="${esc(g(x, 'c'))}" data-name="${esc(name(x))}" data-rate="0" data-amount="0" data-meta="🆆어사이드23 ${k}" data-catalyst="">${esc(name(x))}</span> <small style="color:#6b6e9c">${esc(g(x, 'c'))} ${esc(mkt(x))}</small>`;
      const s = g(x, 's'), done = s === 'C' || s === 'H';
      const vals = [i + 1, nmEl, `${LEG[g(x, 'leg')] || g(x, 'leg')} (매듭 ${g(x, 'bk')}봉 전 · 점화 ${g(x, 'bi')}봉 전)`, `${won(g(x, 'pc'))} (${pct(g(x, 'chg'))})`, `${won(g(x, 'ig'))} · ${won(g(x, 'stp'))}`, pct(g(x, 'sdist')),
        `${won(g(x, 'bot'))}~${won(g(x, 'top'))}`, g(x, 'en') == null ? '—' : g(x, 'en'),
        g(x, 'vx') == null ? '—' : g(x, 'vx') + '배', g(x, 'a20') == null ? '—' : won(g(x, 'a20')), won(g(x, 'b')),
        ST[s] || s, done ? pct(g(x, 'p'), 2) : '—', done ? g(x, 'k') + '일' : '—', g(x, 'ed') ? `${ymd(g(x, 'ed'))} ${WHY[g(x, 'w')] || ''}` : '—',
        g(x, 'h20') ? `<span style="color:#ff8a8a">${g(x, 'h20')}일째</span>` : (done ? '—' : ''), done ? pct(g(x, 'mx')) : '—'];
      html += '<tr>' + vals.map(v => `<td style="padding:5px 7px;border-bottom:1px solid #3a2434;white-space:nowrap">${v}</td>`).join('') + '</tr>';
    });
    body.insertAdjacentHTML('beforeend', html + '</table></div></section>');
    ov.style.display = 'flex';
    window.__배지복귀 = function () { window.openBestDetail(k); };
    return result;
  };
  if (typeof bestY !== 'undefined' && typeof window.renderBestCalendar === 'function') {
    try { window.renderBestCalendar(); } catch (e) { console.warn('어사이드23 다시 그리기 실패', e); }
  }
})();
