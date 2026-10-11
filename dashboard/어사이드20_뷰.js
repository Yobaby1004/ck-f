/* 🆃 어사이드20 (2026-10-02 사용자 지시) = 실타래매매법(바치올 실타래 매듭 풀림) · 🏅 베스트 달력에 묶음을 더한다(기존 자료·함수는 그대로).
   스킬 /어사이드20 · 빌더 = 주도주\_베스트_어사이드20_빌드.py (→ 매매법\실타래매매법\_07_달력.py · 동결 엔진 _실타래_엔진.py) · 자료 = dashboard/data/베스트_어사이드20(_과거).js
   한마디로: 이평 10올(5~60일 지수평균)이 좁게 꼬인 노랑 매듭 상자(큰실 25>100>300 정배열 · 고점 근처 · 덜 오름) + 에너지 ≥ 20 → 양봉 종가가 상자 윗선 위 + 주황띠(5·8·12)가 갈라짐
   칸 = 매수일(8시 명단) · 결과는 규칙대로 샀다고 가정한 계산(매수일 시가 → 종가 < 상자 아랫선(손절) 또는 주황띠 다시 겹침(엉킴) 그날 종가 · 60거래일 만기 · 비용 0.3%)
   사전등록 E 통과 · 그러나 같은 날 노랑(상승추세) 종목 대비는 구간 0 포함 = 관찰용 · 매수추천 아님
   감싸는 함수 = buildBestCell · renderBestMonthStrip · renderBestMeta · openBestDetail (어사이드19_뷰.js 와 같은 방식 · 그 뒤에 읽는다) */
(function () {
  'use strict';
  if (window.__aside20Installed) return;
  const originals = ['buildBestCell', 'renderBestMonthStrip', 'renderBestMeta', 'openBestDetail'];
  if (originals.some(n => typeof window[n] !== 'function')) { console.error('어사이드20: 베스트 달력 함수가 없습니다'); return; }
  window.__aside20Installed = true;
  const color = '#f2c46d', line = '#5c4a22', SHOW = 6;
  const arch = () => window.어사이드20_ARCHIVE || {};
  const NM = () => window.어사이드20_NAMES || {};
  const I = {};
  (window.어사이드20_COLS || ['c', 'chg', 'pc', 'top', 'bot', 'sdist', 'en', 'nn', 'bw', 'r60', 'h250', 'am', 'a20', 'b', 's', 'p', 'k', 'ed', 'why', 'h20', 'mx']).forEach((c, i) => { I[c] = i; });
  const g = (x, key) => x[I[key]];
  const esc = v => String(v == null ? '' : v).replace(/[&<>"']/g, ch => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[ch]));
  const pct = (v, dg) => v == null ? '—' : `<span style="color:${v >= 0 ? '#ff8a8a' : '#7ea6ff'}">${v >= 0 ? '+' : ''}${Number(v).toFixed(dg == null ? 1 : dg)}%</span>`;
  const won = v => v == null ? '—' : Number(v).toLocaleString('ko-KR', {maximumFractionDigits: 0});
  const ymd = s => { s = String(s || ''); return s.length === 8 ? `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6)}` : s; };
  const md = s => { s = String(s || ''); return s.length === 8 ? `${s.slice(4, 6)}/${s.slice(6)}` : s; };
  const name = x => (NM()[g(x, 'c')] || [g(x, 'c')])[0];
  const mkt = x => (NM()[g(x, 'c')] || ['', ''])[1];
  const ST = {C: '확정', H: '결과대기', P: '예정(명단만)', S: '자료끊김'};
  const WHY = {1: '손절(상자 아랫선)', 2: '엉킴 청산', 3: '60일 만기', 4: '청산 전'};
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
    let layer = `<div class="aside20-layer" style="border-top:1px dashed ${line};margin-top:4px;padding-top:3px;color:${color};font-size:10px" title="🆃 어사이드20(실타래매매법 · 매듭 풀림) · 신호일 ${ymd(row.sd)} 종가까지 보고 고름 · 눌러서 전부 보기"><b>🆃 어사이드20 · ${row.n}종목</b>${row.e ? ' <span style="color:#8487bd" title="2011-03 전 칸 = 계산 시작을 천프정 첫 봉으로 당겨 채움 · 검증 밖 · 지금 상장 종목만이라 좋게 보일 수 있음">앞</span>' : ''}`;
    row.a.slice(0, SHOW).forEach(x => {
      const tip = `신호일 종가 ${won(g(x, 'pc'))}(${g(x, 'chg')}%) · 어제 상자 ${won(g(x, 'bot'))}~${won(g(x, 'top'))} · 손절선까지 ${g(x, 'sdist')}% · 에너지 ${g(x, 'en')} · 매수가 ${won(g(x, 'b'))} · ${ST[g(x, 's')] || ''}${g(x, 'ed') ? ' ' + md(g(x, 'ed')) + ' ' + (WHY[g(x, 'why')] || '') : ''}`;
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
      if (n) { if (i + 1 !== bestM) btn.classList.add('has-data'); btn.title += ` · 어사이드20 ${n}종목`; }
    });
    return result;
  };

  const dtxt = v => Array.isArray(v) ? `${(v[0] * 100).toFixed(2)}%p [${(v[1] * 100).toFixed(2)}~${(v[2] * 100).toFixed(2)}]` : '—';
  const vtxt = v => v && v.n ? `신호 ${Number(v.n).toLocaleString('ko-KR')} · 10일 +20% lift ${v.lift != null ? v.lift.toFixed(2) : '—'} · 규칙 매매 평균 ${pct(v.rr != null ? v.rr * 100 : null, 2)}(같은 보유일 무작위 ${pct(v.c3 != null ? v.c3 * 100 : null, 2)} · 차이 ${v.diff != null ? (v.diff * 100).toFixed(2) : '—'}%p [${v.dlo != null ? (v.dlo * 100).toFixed(2) : '—'}~${v.dhi != null ? (v.dhi * 100).toFixed(2) : '—'}]) · 평균손실 ${pct(v.loss != null ? v.loss * 100 : null, 1)}` : '—';
  const oldMeta = window.renderBestMeta;
  window.renderBestMeta = function () {
    const result = oldMeta.apply(this, arguments);
    const el = document.getElementById('best-meta'), m = window.어사이드20_META;
    if (!el) return result;
    if (!m) { el.innerHTML += '<br><span style="color:#ff9aaa">❌ 베스트_어사이드20.js 가 안 읽혔다 = 주도주\\_베스트_어사이드20_빌드.py 실행</span>'; return result; }
    const T = m.전체 || {}, L = m.동결구간 || {}, E = m.예정 || {}, V = m.검증 || {}, P = m.사후 || {}, W = m.대기 || [];
    const Y = (m.연도 || []).find(r => typeof bestY !== 'undefined' && r.y === bestY);
    const names = E.종목 || [];
    el.innerHTML += `<div class="aside20-meta" style="margin-top:5px;color:${color}"><b>🆃 어사이드20</b>(실타래매매법 · 바치올 실타래 매듭 풀림) ${ymd(m.첫칸.replace(/-/g, ''))}~${ymd(m.끝칸.replace(/-/g, ''))} · ${Number(m.칸).toLocaleString('ko-KR')}칸 · 신호 ${Number(m.신호).toLocaleString('ko-KR')} · 확정 ${Number(T.n || 0).toLocaleString('ko-KR')}건 평균 ${pct(T.rr, 2)} 중앙 ${pct(T.med, 2)} 승률 ${T.win}% 평균손실 ${pct(T.loss, 1)} · ${ymd(m.CUT).slice(0, 7)}~ 확정 ${Number(L.n || 0).toLocaleString('ko-KR')}건 평균 ${pct(L.rr, 2)} · 결과대기 ${m.결과대기}`
      + (Y && Y.n ? ` · ${bestY}년 ${Y.n}건 평균 ${pct(Y.rr, 2)} 중앙 ${pct(Y.med, 2)}` : '')
      + ` · ${ymd(E.매수일)} 8시 예정 ${names.length}종목${names.length ? '(' + esc(names.slice(0, 12).join(', ')) + (names.length > 12 ? ' 외 ' + (names.length - 12) : '') + ')' : ''}`
      + ` · 노랑 매듭 상자 대기 ${W.length}${W.length ? '(' + esc(W.slice(0, 10).map(w => `${w[0]} 윗선까지 ${w[4] >= 0 ? '+' : ''}${w[4]}%`).join(', ')) + ')' : ''}`
      + (m.빠짐 > 0 && m.들어옴 / m.기준 < 0.97 ? ` · <span style="color:#ffc454">천프정 ${ymd(m.마지막봉)} 봉이 ${m.들어옴}/${m.기준}종목만 들어옴(빠진 ${m.빠짐}종목은 그 전 봉까지)</span>` : '')
      + `<br><span style="color:#ff9aaa">${esc(m.판정)} · 매수추천 아님</span> · 검증 IS(2015-06~2024) ${vtxt(V.IS)} · HOLDOUT(2025~2026-07) ${vtxt(V.HO)}`
      + ` · ★같은 날 노랑+양봉+갈라짐 종목 대비 IS ${dtxt(P.IS)} · HOLDOUT ${dtxt(P.HOLDOUT)} · ${esc(m.대조)} · ${esc(m.재현)} · ${esc(m.지난판)}`
      + `<br><span style="color:#8487bd">신호 = 어제 노랑 매듭 상자(10올 폭 1년 하위 10% · 6% 이하 · 30봉 중 좁음 10+ · 교차 12+ · 큰실 25>100>300 +8% · 250일 고점 17% 안 · 60일 15% 이하) + 에너지 ≥ 20 → 오늘 양봉 종가 > 상자 윗선 · 주황띠(5·8·12) 하단 > 초록·파랑띠 상단 · 칸 = 매수일 시가 → 종가 < 어제 상자 아랫선(손절) 또는 주황띠 다시 겹침 그날 종가 · 60거래일 만기 · 「앞」 = 2011-03 전(검증 밖) · 지금 상장 종목만이라 옛 칸은 좋게 보일 수 있음 · 신호가 드물다(하루 평균 0.26건)</span></div>`;
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
    const prev = body.querySelector('[data-aside20-detail]'); if (prev) prev.remove();
    let html = `<section data-aside20-detail style="margin-top:20px;color:${color}"><h3 style="margin:0">🆃 어사이드20 · 매수일 ${esc(k)} · ${row.n}종목 <span style="font-size:12px;color:#ff9aaa;font-weight:600">관찰용 · 매수추천 아님</span></h3>`
      + `<p style="color:#8487bd;font-size:12px;line-height:1.6;margin:6px 0">실타래매매법(바치올 실타래 매듭 풀림) · 신호일 <b style="color:#c9cbe8">${ymd(row.sd)}</b> 종가까지만 보고 고름${row.e ? ' · <b style="color:#ffc454">2011-03 전 칸 = 검증 밖</b>' : ''} · 순서 = 신호일 거래대금 큰 순(검증 안 한 순서)<br>`
      + `<b style="color:#c9cbe8">결과는 규칙대로 샀다고 가정한 계산(실제 매매와 무관)</b> · 매수일 시가 → 종가 < 어제 상자 아랫선(손절) 또는 주황띠 다시 겹침(엉킴) 그날 종가 · 60거래일 만기 · 비용 0.3% · +20✓ = 매수일 포함 10거래일 안 고가가 매수가 +20% 에 닿음</p><div style="overflow-x:auto"><table style="border-collapse:collapse;color:#e4e6ff;font-size:12px"><tr>`;
    ['#', '종목', '신호일 종가(등락)', '어제 상자(아랫선~윗선)', '손절선까지', '에너지', '30봉 좁음', '큰실 25/300', '60일 상승', '250일 고점 대비', '20일 대금(억)', '매수가(시가)', '결과', '수익', '보유일', '청산일·사유', '10일 +20%', '10일 최고'].forEach(t => html += `<th style="padding:5px 7px;border-bottom:1px solid ${line};color:#8487bd;white-space:nowrap;text-align:left">${t}</th>`);
    html += '</tr>';
    row.a.forEach((x, i) => {
      const nmEl = `<span style="cursor:pointer;font-weight:bold;color:${color}" onclick="_openStock(this,function(){openBestDetail('${k}')})" data-code="${esc(g(x, 'c'))}" data-name="${esc(name(x))}" data-rate="0" data-amount="0" data-meta="🆃어사이드20 ${k}" data-catalyst="">${esc(name(x))}</span> <small style="color:#6b6e9c">${esc(g(x, 'c'))} ${esc(mkt(x))}</small>`;
      const s = g(x, 's'), done = s === 'C' || s === 'H';
      const vals = [i + 1, nmEl, `${won(g(x, 'pc'))} (${pct(g(x, 'chg'))})`, `${won(g(x, 'bot'))}~${won(g(x, 'top'))}`, pct(g(x, 'sdist')), g(x, 'en') == null ? '—' : g(x, 'en'),
        g(x, 'nn') == null ? '—' : g(x, 'nn'), pct(g(x, 'bw')), pct(g(x, 'r60')), pct(g(x, 'h250')), g(x, 'a20') == null ? '—' : won(g(x, 'a20')), won(g(x, 'b')),
        ST[s] || s, done ? pct(g(x, 'p'), 2) : '—', done ? g(x, 'k') + '일' : '—', g(x, 'ed') ? `${ymd(g(x, 'ed'))} ${WHY[g(x, 'why')] || ''}` : '—',
        g(x, 'h20') ? `<span style="color:#ff8a8a">${g(x, 'h20')}일째</span>` : (done ? '—' : ''), done ? pct(g(x, 'mx')) : '—'];
      html += '<tr>' + vals.map(v => `<td style="padding:5px 7px;border-bottom:1px solid #3a3020;white-space:nowrap">${v}</td>`).join('') + '</tr>';
    });
    body.insertAdjacentHTML('beforeend', html + '</table></div></section>');
    ov.style.display = 'flex';
    window.__배지복귀 = function () { window.openBestDetail(k); };
    return result;
  };
  if (typeof bestY !== 'undefined' && typeof window.renderBestCalendar === 'function') {
    try { window.renderBestCalendar(); } catch (e) { console.warn('어사이드20 다시 그리기 실패', e); }
  }
})();
