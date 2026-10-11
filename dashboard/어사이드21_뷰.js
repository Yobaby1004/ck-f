/* 🆄 어사이드21 (2026-10-02 사용자 지시) = 실타래매매법2(바치올 실타래 · 노랑 매듭 상자 윗선 첫 돌파 신호 A) · 🏅 베스트 달력에 묶음을 더한다(기존 자료·함수는 그대로).
   스킬 /어사이드21 · 빌더 = 주도주\_베스트_어사이드21_빌드.py (→ 매매법\실타래매매법2\_08_달력.py · 동결 엔진 _실타래2_엔진.py md5 097d2763) · 자료 = dashboard/data/베스트_어사이드21(_과거).js
   한마디로: 어제 노랑 매듭 상자(이평 10올 좁게 꼬임 + 큰실 25>100>300 정배열 · 고점 근처 · 덜 오름) + 어제 에너지 ≥ 20 → 오늘 양봉 종가가 어제 상자 윗선을 처음 넘음 + 세 띠 순서대로 벌어짐
   칸 = 매수일(8시 목록) · 결과는 규칙대로 샀다고 가정한 계산(매수일 시가 → +20% 지정가 · 종가 < 어제 상자 아랫선이면 그 종가 · 20거래일 만기 · 비용 0.3%)
   사전등록 D 탈락 · E 통과(표에 없던 조합) → 매수 신호 확정 아님 · forward 기록 · 관찰용 · 매수추천 아님
   감싸는 함수 = buildBestCell · renderBestMonthStrip · renderBestMeta · openBestDetail (어사이드20_뷰.js 와 같은 방식 · 그 뒤에 읽는다) */
(function () {
  'use strict';
  if (window.__aside21Installed) return;
  const originals = ['buildBestCell', 'renderBestMonthStrip', 'renderBestMeta', 'openBestDetail'];
  if (originals.some(n => typeof window[n] !== 'function')) { console.error('어사이드21: 베스트 달력 함수가 없습니다'); return; }
  window.__aside21Installed = true;
  const color = '#cbe86b', line = '#4b5a22', SHOW = 6;
  const arch = () => window.어사이드21_ARCHIVE || {};
  const NM = () => window.어사이드21_NAMES || {};
  const I = {};
  (window.어사이드21_COLS || ['c', 'chg', 'pc', 'top', 'bot', 'sdist', 'en', 'vx', 'a20', 'b', 's', 'p', 'k', 'ed', 'w', 'h20', 'mx']).forEach((c, i) => { I[c] = i; });
  const g = (x, key) => x[I[key]];
  const esc = v => String(v == null ? '' : v).replace(/[&<>"']/g, ch => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[ch]));
  const pct = (v, dg) => v == null ? '—' : `<span style="color:${v >= 0 ? '#ff8a8a' : '#7ea6ff'}">${v >= 0 ? '+' : ''}${Number(v).toFixed(dg == null ? 1 : dg)}%</span>`;
  const won = v => v == null ? '—' : Number(v).toLocaleString('ko-KR', {maximumFractionDigits: 0});
  const ymd = s => { s = String(s || ''); return s.length === 8 ? `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6)}` : s; };
  const md = s => { s = String(s || ''); return s.length === 8 ? `${s.slice(4, 6)}/${s.slice(6)}` : s; };
  const name = x => (NM()[g(x, 'c')] || [g(x, 'c')])[0];
  const mkt = x => (NM()[g(x, 'c')] || ['', ''])[1];
  const ST = {C: '확정', H: '결과대기', P: '예정(목록만)', S: '자료끊김'};
  const WHY = {1: '익절 +20%', 2: '손절(상자 아랫선)', 3: '20일 만기'};
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
    let layer = `<div class="aside21-layer" style="border-top:1px dashed ${line};margin-top:4px;padding-top:3px;color:${color};font-size:10px" title="🆄 어사이드21(실타래매매법2 · 노랑 매듭 윗선 첫 돌파) · 신호일 ${ymd(row.sd)} 종가까지 보고 고름 · 눌러서 자세히"><b>🆄 어사이드21 · ${row.n}종목</b>${row.e ? ' <span style="color:#8487bd" title="2005-07 전 칸 = 계산 시작을 천프정 첫 봉으로 당겨 채움 · 검증 밖 · 지금 상장 종목만이라 좋게 보일 수 있음">앞</span>' : ''}`;
    row.a.slice(0, SHOW).forEach(x => {
      const tip = `신호일 종가 ${won(g(x, 'pc'))}(${g(x, 'chg')}%) · 어제 상자 ${won(g(x, 'bot'))}~${won(g(x, 'top'))} · 손절선까지 ${g(x, 'sdist')}% · 어제 에너지 ${g(x, 'en')} · 매수가 ${won(g(x, 'b'))} · ${ST[g(x, 's')] || ''}${g(x, 'ed') ? ' ' + md(g(x, 'ed')) + ' ' + (WHY[g(x, 'w')] || '') : ''}`;
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
      if (n) { if (i + 1 !== bestM) btn.classList.add('has-data'); btn.title += ` · 어사이드21 ${n}종목`; }
    });
    return result;
  };

  const ci = v => Array.isArray(v) ? `${v[0] >= 0 ? '+' : ''}${(v[0] * 100).toFixed(2)}%p [${(v[1] * 100).toFixed(2)}~${(v[2] * 100).toFixed(2)}]` : '—';
  const vtxt = v => v && v.n ? `신호 ${Number(v.n).toLocaleString('ko-KR')} · 10일 +20% lift ${v.lift != null ? v.lift.toFixed(2) : '—'} [${v.llo != null ? v.llo.toFixed(2) : '—'}~${v.lhi != null ? v.lhi.toFixed(2) : '—'}] · 규칙 매매 평균 ${pct(v.rr != null ? v.rr * 100 : null, 2)}(같은 손절 거리 무작위 ${pct(v.c3 != null ? v.c3 * 100 : null, 2)} · 차이 ${ci([v.diff, v.dlo, v.dhi])}) · 평균손실 ${pct(v.loss != null ? v.loss * 100 : null, 1)}` : '—';
  const oldMeta = window.renderBestMeta;
  window.renderBestMeta = function () {
    const result = oldMeta.apply(this, arguments);
    const el = document.getElementById('best-meta'), m = window.어사이드21_META;
    if (!el) return result;
    if (!m) { el.innerHTML += '<br><span style="color:#ff9aaa">❌ 베스트_어사이드21.js 가 안 읽혔다 = 주도주\\_베스트_어사이드21_빌드.py 실행</span>'; return result; }
    const T = m.전체 || {}, L = m.동결구간 || {}, E = m.예정 || {}, V = m.검증 || {}, P = m.사후 || {}, W = m.대기 || [];
    const Y = (m.연도 || []).find(r => typeof bestY !== 'undefined' && r.y === bestY);
    const names = E.종목 || [];
    el.innerHTML += `<div class="aside21-meta" style="margin-top:5px;color:${color}"><b>🆄 어사이드21</b>(실타래매매법2 · 노랑 매듭 윗선 첫 돌파) ${ymd(m.첫칸.replace(/-/g, ''))}~${ymd(m.끝칸.replace(/-/g, ''))} · ${Number(m.칸).toLocaleString('ko-KR')}칸 · 신호 ${Number(m.신호).toLocaleString('ko-KR')} · 확정 ${Number(T.n || 0).toLocaleString('ko-KR')}건 평균 ${pct(T.rr, 2)} 중앙 ${pct(T.med, 2)} 승률 ${T.win}% 평균손실 ${pct(T.loss, 1)} · ${ymd(m.CUT).slice(0, 7)}~ 확정 ${Number(L.n || 0).toLocaleString('ko-KR')}건 평균 ${pct(L.rr, 2)} · 결과대기 ${m.결과대기}`
      + (Y && Y.n ? ` · ${bestY}년 ${Y.n}건 평균 ${pct(Y.rr, 2)} 중앙 ${pct(Y.med, 2)}` : '')
      + ` · ${ymd(E.매수일)} 8시 예정 ${names.length}종목${names.length ? '(' + esc(names.slice(0, 12).join(', ')) + (names.length > 12 ? ' 외 ' + (names.length - 12) : '') + ')' : ''}`
      + ` · 노랑 매듭 상자 대기 ${W.length}${W.length ? '(' + esc(W.slice(0, 10).map(w => `${w[0]} 윗선 ${won(w[2])} 까지 ${w[4] >= 0 ? '+' : ''}${w[4]}%`).join(', ')) + ')' : ''}`
      + (m.기준 && m.들어옴 / m.기준 < 0.97 ? ` · <span style="color:#ffc454">천프정 ${ymd(m.마지막봉)} 봉이 전 거래일 거래 종목 ${m.기준} 중 ${m.들어옴}만 들어옴(빠진 종목은 그 전 봉까지)</span>` : '')
      + `<br><span style="color:#ff9aaa">${esc(m.판정)} · 매수추천 아님</span> · 검증 IS(2015-06~2024) ${vtxt(V.IS)} · HOLDOUT(2025~2026-08) ${vtxt(V.HO)}`
      + ` · ★약점: 종목 묶음으로 재면 HOLDOUT ${ci((P.HOLDOUT || {}).종목묶음)} · 같은 날 다른 노랑 상자 종목 대비 IS ${ci((P.IS || {}).노랑)} · HOLDOUT ${ci((P.HOLDOUT || {}).노랑)} = 우위 대부분은 「상승추세 속 매듭」 조건 · ${esc(m.대조)} · ${esc(m.재현)} · ${esc(m.지난판)}`
      + `<br><span style="color:#8487bd">신호 A = 어제 노랑 매듭 상자(10올 폭 1년 하위 10% · 6% 이하 · 30봉 중 좁음 10+ · 교차 12+ · 큰실 25>100>300 +8% · 250일 고점 17% 안 · 60일 15% 이하) + 어제 에너지 ≥ 20 → 오늘 양봉 종가가 어제 상자 윗선을 처음 넘음 · 세 띠 중심 빠름>중간>느림 · 실타래 폭 증가 · 칸 = 매수일 시가 → +20% 지정가 · 종가 < 어제 상자 아랫선(손절) · 20거래일 만기 · 「앞」 = 2005-07 전(검증 밖) · 지금 상장 종목만이라 옛 칸은 좋게 보일 수 있음 · 신호가 드물다(하루 평균 0.15 · 빈 칸이 정상) · +20% 를 노리는 도구 아님(10일 +20% 14~16%)</span></div>`;
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
    const prev = body.querySelector('[data-aside21-detail]'); if (prev) prev.remove();
    let html = `<section data-aside21-detail style="margin-top:20px;color:${color}"><h3 style="margin:0">🆄 어사이드21 · 매수일 ${esc(k)} · ${row.n}종목 <span style="font-size:12px;color:#ff9aaa;font-weight:600">관찰용 · 매수추천 아님</span></h3>`
      + `<p style="color:#8487bd;font-size:12px;line-height:1.6;margin:6px 0">실타래매매법2(노랑 매듭 윗선 첫 돌파 신호 A) · 신호일 <b style="color:#c9cbe8">${ymd(row.sd)}</b> 종가까지만 보고 고름${row.e ? ' · <b style="color:#ffc454">2005-07 전 칸 = 검증 밖</b>' : ''} · 순서 = 어제 에너지 큰 순<br>`
      + `<b style="color:#c9cbe8">결과는 규칙대로 샀다고 가정한 계산(실제 매매와 무관)</b> · 매수일 시가 → +20% 지정가 · 종가 < 어제 상자 아랫선이면 그 종가(손절) · 20거래일 만기 · 비용 0.3% · +20✓ = 매수일 포함 10거래일 안 고가가 매수가 +20% 에 닿음</p><div style="overflow-x:auto"><table style="border-collapse:collapse;color:#e4e6ff;font-size:12px"><tr>`;
    ['#', '종목', '신호일 종가(등락)', '어제 상자(아랫선~윗선)', '손절선까지', '어제 에너지', '거래량 배수', '20일 대금(억)', '매수가(시가)', '결과', '수익', '보유일', '청산일·사유', '10일 +20%', '10일 최고'].forEach(t => html += `<th style="padding:5px 7px;border-bottom:1px solid ${line};color:#8487bd;white-space:nowrap;text-align:left">${t}</th>`);
    html += '</tr>';
    row.a.forEach((x, i) => {
      const nmEl = `<span style="cursor:pointer;font-weight:bold;color:${color}" onclick="_openStock(this,function(){openBestDetail('${k}')})" data-code="${esc(g(x, 'c'))}" data-name="${esc(name(x))}" data-rate="0" data-amount="0" data-meta="🆄어사이드21 ${k}" data-catalyst="">${esc(name(x))}</span> <small style="color:#6b6e9c">${esc(g(x, 'c'))} ${esc(mkt(x))}</small>`;
      const s = g(x, 's'), done = s === 'C' || s === 'H';
      const vals = [i + 1, nmEl, `${won(g(x, 'pc'))} (${pct(g(x, 'chg'))})`, `${won(g(x, 'bot'))}~${won(g(x, 'top'))}`, pct(g(x, 'sdist')), g(x, 'en') == null ? '—' : g(x, 'en'),
        g(x, 'vx') == null ? '—' : g(x, 'vx') + '배', g(x, 'a20') == null ? '—' : won(g(x, 'a20')), won(g(x, 'b')),
        ST[s] || s, done ? pct(g(x, 'p'), 2) : '—', done ? g(x, 'k') + '일' : '—', g(x, 'ed') ? `${ymd(g(x, 'ed'))} ${WHY[g(x, 'w')] || ''}` : '—',
        g(x, 'h20') ? `<span style="color:#ff8a8a">${g(x, 'h20')}일째</span>` : (done ? '—' : ''), done ? pct(g(x, 'mx')) : '—'];
      html += '<tr>' + vals.map(v => `<td style="padding:5px 7px;border-bottom:1px solid #3a4020;white-space:nowrap">${v}</td>`).join('') + '</tr>';
    });
    body.insertAdjacentHTML('beforeend', html + '</table></div></section>');
    ov.style.display = 'flex';
    window.__배지복귀 = function () { window.openBestDetail(k); };
    return result;
  };
  if (typeof bestY !== 'undefined' && typeof window.renderBestCalendar === 'function') {
    try { window.renderBestCalendar(); } catch (e) { console.warn('어사이드21 다시 그리기 실패', e); }
  }
})();
