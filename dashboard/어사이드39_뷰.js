/* ㊴ 어사이드39 (2026-10-04 사용자 지시) = 이평매매법3(주도주 재돌파 우선 + 얕은 쉼 채움 · 하루 1종목 · 주 3~4) · 🏅 베스트 달력에 묶음을 더한다(기존 자료·함수는 그대로).
   스킬 /어사이드39 · 빌더 = 주도주\_베스트_어사이드39_빌드.py (→ 매매법\이평매매법\v3_주2이상\_v3_08_달력.py · 아침 러너 _v3_아침.py 와 같은 계산) · 자료 = dashboard/data/베스트_어사이드39(_과거).js
   한마디로: 월간 주도주 · MA120·MA240 우상향 · 종가 ≥ MA60 · 그날 시총 상위 100위 아님 무리에서 ① 재돌파(20일 고점에서 −8% 넘게 눌렸다가 종가가 다시 20일 고점 위 · MA20 위) → ② 없으면 얕은 쉼(20일 고점 0~−10% · MA20 위) · 20일 대금 큰 순 1종목
   판 = 그달 첫 거래일 아침까지 끝난 매매로 고른 것(업그레이드 M) · 칸 = 매수일 · 결과는 규칙대로 샀다고 가정한 계산(매수일 시가 → +20% 지정가 · 종가 < 매수가×0.9 손절 · 20 또는 40거래일 · 비용 0.3%)
   관찰용 · 매수추천 아님 · 사전등록 v0 기각 · 감싸는 함수 = buildBestCell · renderBestMonthStrip · renderBestMeta · openBestDetail (어사이드35_뷰.js 와 같은 방식 · 그 뒤에 읽는다) */
(function () {
  'use strict';
  if (window.__aside39Installed) return;
  const originals = ['buildBestCell', 'renderBestMonthStrip', 'renderBestMeta', 'openBestDetail'];
  if (originals.some(n => typeof window[n] !== 'function')) { console.error('어사이드39: 베스트 달력 함수가 없습니다'); return; }
  window.__aside39Installed = true;
  const color = '#4f8cff', line = '#20345a';
  const arch = () => window.어사이드39_ARCHIVE || {};
  const NM = () => window.어사이드39_NAMES || {};
  const I = {};
  (window.어사이드39_COLS || ['c', 'r', 'cl', 'th', 'tr', 'pc', 'chg', 'dd', 'm20', 'm60', 'a20', 'a60', 'b', 'bd', 's', 'p', 'k', 'ed', 'w', 'mx', 'mae', 'lb', 'sd']).forEach((c, i) => { I[c] = i; });
  const g = (x, key) => x[I[key]];
  const esc = v => String(v == null ? '' : v).replace(/[&<>"']/g, ch => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[ch]));
  const pct = (v, dg) => v == null ? '—' : `<span style="color:${v >= 0 ? '#ff8a8a' : '#7ea6ff'}">${v >= 0 ? '+' : ''}${Number(v).toFixed(dg == null ? 1 : dg)}%</span>`;
  const won = v => v == null ? '—' : Number(v).toLocaleString('ko-KR', {maximumFractionDigits: 0});
  const ymd = s => { s = String(s || ''); return s.length === 8 ? `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6)}` : s; };
  const md = s => { s = String(s || ''); return s.length === 8 ? `${s.slice(4, 6)}/${s.slice(6)}` : s; };
  const name = x => (NM()[g(x, 'c')] || [g(x, 'c')])[0];
  const mkt = x => (NM()[g(x, 'c')] || ['', ''])[1];
  const ST = {C: '확정', H: '결과대기', P: '예정(목록만)', L: '봉 늦음(천프정 미수집)', S: '자료끊김(정지·폐지)', R: '참고(다음 후보 · 성적 밖)'};
  const WHY = {1: '익절 +20%', 2: '손절(종가)', 3: '만기'};
  const SHORT = {1: '익절', 2: '손절', 3: '만기'};
  const CELL = {B: '재돌파', D1Z1: '얕은 쉼', D2Z1: '눌림 −10~−20%', U: '무리'};
  const VAR = v => { v = String(v || ''); const ex = v.endsWith('_E3') ? '40일' : v.endsWith('_E2') ? '60일선 손절' : '20일'; const o = v.slice(0, 2); const od = {O1: '재돌파만', O2: '재돌파→얕은 쉼', O3: '재돌파→얕은 쉼→−10~−20%', O4: '재돌파→무리'}[o] || o; return `${od} · ${v.includes('_R1_') ? '대금 순' : '정답지 이력 순'} · ${v.includes('_K2_') ? '하루 2' : '하루 1'} · ${ex}`; };
  const res = x => {
    const s = g(x, 's');
    if (s === 'C') return `${pct(g(x, 'p'))} <span style="color:#8487bd">${SHORT[g(x, 'w')] || ''}</span>`;
    if (s === 'H') return `<span style="color:#ffc454">대기 ${g(x, 'k')}일</span> ${pct(g(x, 'p'))}${g(x, 'lb') ? ` <span style="color:#8487bd">${md(g(x, 'lb'))}봉까지</span>` : ''}`;
    if (s === 'L') return '<span style="color:#ffc454">봉 늦음</span>';
    if (s === 'P') return '<span style="color:#7ee8ff">예정</span>';
    if (s === 'R') return '<span style="color:#8487bd">참고</span>';
    return `<span style="color:#8487bd">${ST[s] || s}</span>`;
  };
  const late = (x, k) => g(x, 'bd') && String(g(x, 'bd')) !== String(k).replace(/-/g, '') ? ` · ★실제 매수 ${md(g(x, 'bd'))}(거래정지 등으로 늦음)` : '';
  const tipOf = (x, k) => `${g(x, 'r') < 10 ? '공식' : '참고(성적 밖)'} · ${CELL[g(x, 'cl')] || g(x, 'cl')} · 주도 테마 ${g(x, 'th')}(${g(x, 'tr')}위) · 신호일 종가 ${won(g(x, 'pc'))}(${g(x, 'chg')}%) · 20일 고점 대비 ${g(x, 'dd')}% · MA20 대비 ${g(x, 'm20')}% · MA60 대비 ${g(x, 'm60')}% · 20일 대금 ${won(g(x, 'a20'))}억 · 최근 60일 +20% 날 ${g(x, 'a60')}번${g(x, 'b') != null ? ' · 매수가 ' + won(g(x, 'b')) : ''}${late(x, k)} · ${ST[g(x, 's')] || ''}${g(x, 'ed') ? ' ' + md(g(x, 'ed')) + ' ' + (WHY[g(x, 'w')] || '') : ''}${g(x, 'mx') != null ? ' · 보유 창 안 최고 ' + g(x, 'mx') + '% 최저 ' + g(x, 'mae') + '%' : ''}`;

  const oldCell = window.buildBestCell;
  window.buildBestCell = function (d, k, rec, other, dow) {
    let html = oldCell.apply(this, arguments);
    const row = arch()[k]; if (!row) return html;
    let layer = `<div class="aside39-layer" style="border-top:1px dashed ${line};margin-top:4px;padding-top:3px;color:${color};font-size:10px" title="㊴ 어사이드39(이평매매법3 · 주도주 재돌파 우선 + 얕은 쉼) · 신호일 ${ymd(row.sd)} 장마감까지 보고 고름 · 판 ${esc(row.v)} = ${esc(VAR(row.v))} · 무리 ${row.u}종목 · 눌러서 자세히"><b>㊴ 어사이드39</b> <span style="color:#8487bd">무리 ${row.u}</span>`;
    if (!row.n) layer += `<div style="color:#8487bd">없음(재돌파·얕은 쉼 없음 또는 최근 5일 안 뽑힘)</div>`;
    row.a.forEach(x => {
      const off = g(x, 'r') < 10;
      layer += `<div title="${esc(tipOf(x, k))}" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;${off ? '' : 'opacity:.6;font-size:9.5px'}">${off ? (g(x, 'cl') === 'B' ? '🚀' : '🌿') : '·'} <b>${esc(name(x))}</b> ${res(x)}</div>`;
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
      const n = Object.entries(arch()).reduce((s, [k, r]) => s + (k.startsWith(pre) ? r.a.filter(x => g(x, 'r') < 10).length : 0), 0);
      if (n) { if (i + 1 !== bestM) btn.classList.add('has-data'); btn.title += ` · 어사이드39 ${n}종목`; }
    });
    return result;
  };

  const sline = T => T && T.n ? `${Number(T.n).toLocaleString('ko-KR')}건 평균 ${pct(T.rr, 2)} 중앙 ${pct(T.med, 2)} 승률 ${T.win}% 평균손실 ${pct(T.loss, 1)} · +20% 익절 ${T.tgt}% · 손절 ${T.stop}%` : '—';
  const oldMeta = window.renderBestMeta;
  window.renderBestMeta = function () {
    const result = oldMeta.apply(this, arguments);
    const el = document.getElementById('best-meta'), m = window.어사이드39_META;
    if (!el) return result;
    if (!m) { el.innerHTML += '<br><span style="color:#ff9aaa">❌ 베스트_어사이드39.js 가 안 읽혔다 = 주도주\\_베스트_어사이드39_빌드.py 실행</span>'; return result; }
    const E = m.예정 || {}, Y = (m.연도 || []).find(r => typeof bestY !== 'undefined' && r.y === bestY);
    const pl = (E.종목 || []).map(x => `${x[0]}(${CELL[x[1]] || x[1]} · ${x[2]})`).join(', ');
    const C = m.칸구성 || {};
    el.innerHTML += `<div class="aside39-meta" style="margin-top:5px;color:${color}"><b>㊴ 어사이드39</b>(이평매매법3 · 주도주 재돌파 우선 + 얕은 쉼 · 하루 1종목) ${esc(m.첫칸)}~${esc(m.끝칸)} · ${Number(m.칸).toLocaleString('ko-KR')}칸 · 공식 ${Number(m.공식).toLocaleString('ko-KR')}건(주 ${m.주당}) · 재돌파 ${C.B || 0} · 얕은 쉼 ${C.D1Z1 || 0}${C.D2Z1 ? ' · 눌림 ' + C.D2Z1 : ''}`
      + ` · 확정 ${sline(m.전체)} · 결과대기 ${m.결과대기}${m.봉늦음 ? ` · 천프정 봉 늦음 ${m.봉늦음}` : ''}`
      + (Y && Y.n ? ` · ${bestY}년 ${Y.n}건 평균 ${pct(Y.rr, 2)} 중앙 ${pct(Y.med, 2)}` : '')
      + `<br>${E.막힘 ? `<span style="color:#ffc454">${esc(E.막힘)}</span>` : `${ymd(E.매수일)} 8시 = ${esc(pl)}`}`
      + (m.기준 && m.들어옴 / m.기준 < 0.97 ? ` · <span style="color:#ffc454">천프정 ${ymd(m.마지막봉)} 봉이 직전 5거래일 거래 종목 ${m.기준} 중 ${m.들어옴}만 들어옴</span>` : '')
      + `<br><span style="color:#ff9aaa">${esc(m.판정)}</span> · 2022-07~2024 ${sline(m.학습)} · 2025~2026-08 ${sline(m.시험)} · 9월~ ${sline(m.이후)}`
      + ` · ${esc(m.대조)} · ${esc(m.재현)} · ${esc(m.지난판)}`
      + `<br><span style="color:#8487bd">무리 = 월간 카드 빨간 점 주도 테마(10개) 주도주(20카드일 등장 상위 3) · 일반 주식(스팩·우선주·리츠 제외) · 종가 1,000원+ · 20일 대금 5억+ · MA120·MA240 둘 다 20일 전보다 위 · 종가 ≥ MA60 · 그날 시총 전체 상위 100위 제외 → ① 재돌파 ② 얕은 쉼 · 20일 대금 큰 순 · 같은 종목 5거래일 안 다시 안 뽑음 · 판 = 그달 첫 거래일 아침까지 끝난 매매로 고른 것(2026 전 칸은 같은 업그레이드를 그때 자료로 거꾸로 돌림 = 당시 추천 아님) · 칸 = 매수일 시가 → +20% 지정가 · 종가 < 매수가×0.9 손절 · 20 또는 40거래일 · 비용 0.3% · 평균손실 −13~−14% · 지금 상장 종목만이라 생존편향</span></div>`;
    return result;
  };

  const oldDetail = window.openBestDetail;
  window.openBestDetail = function (k) {
    const row = arch()[k];
    const body = document.getElementById('stock-modal-body'), ov = document.getElementById('stock-modal-overlay');
    if (!row || !body || !ov) return oldDetail.apply(this, arguments);
    ov.style.display = 'none';
    const result = oldDetail.apply(this, arguments);
    if (ov.style.display !== 'flex') body.innerHTML = `<div style="font-size:18px;font-weight:bold">🏅 베스트 · ${esc(k)}</div>`;
    const prev = body.querySelector('[data-aside39-detail]'); if (prev) prev.remove();
    let html = `<section data-aside39-detail style="margin-top:20px;color:${color}"><h3 style="margin:0">㊴ 어사이드39 · 매수일 ${esc(k)} · 무리 ${row.u}종목 · 공식 ${row.n} <span style="font-size:12px;color:#ff9aaa;font-weight:600">관찰용 · 매수추천 아님</span></h3>`
      + `<p style="color:#8487bd;font-size:12px;line-height:1.6;margin:6px 0">이평매매법3 · 신호일 <b style="color:#c9cbe8">${ymd(row.sd)}</b> 장마감 자료 + 그날까지 월간 카드만 보고 고름 · 판 <b style="color:#c9cbe8">${esc(row.v)}</b> = ${esc(VAR(row.v))} · 🚀 재돌파 · 🌿 얕은 쉼 · 「참고」 = 같은 순서 다음 후보(성적 밖)<br>`
      + `<b style="color:#c9cbe8">결과는 규칙대로 샀다고 가정한 계산(실제 매매와 무관)</b> · 매수일 시가 → +20% 지정가(둘째 날부터 시가가 +20% 위면 시가) · 종가가 매수가 −10% 아래면 그 종가 · 20(E1)·40(E3)거래일 만기 · 비용 0.3%</p>`;
    html += `<div style="overflow-x:auto"><table style="border-collapse:collapse;color:#e4e6ff;font-size:12px"><tr>`;
    ['구분', '종목', '자리', '주도 테마(순위)', '신호일 종가(등락)', '20일 고점 대비', 'MA20 · MA60 대비', '20일 대금(억)', '60일 +20% 날', '매수가(시가)', '결과', '수익', '보유일', '청산일·사유', '창 안 최고', '창 안 최저'].forEach(t => html += `<th style="padding:5px 7px;border-bottom:1px solid ${line};color:#8487bd;white-space:nowrap;text-align:left">${t}</th>`);
    html += '</tr>';
    row.a.forEach(x => {
      const nmEl = `<span style="cursor:pointer;font-weight:bold;color:${color}" onclick="_openStock(this,function(){openBestDetail('${k}')})" data-code="${esc(g(x, 'c'))}" data-name="${esc(name(x))}" data-rate="0" data-amount="0" data-meta="㊴어사이드39 ${k}" data-catalyst="">${esc(name(x))}</span> <small style="color:#6b6e9c">${esc(g(x, 'c'))} ${esc(mkt(x))}</small>`;
      const s = g(x, 's'), done = s === 'C' || s === 'H';
      const vals = [g(x, 'r') < 10 ? '공식' : '참고', nmEl, CELL[g(x, 'cl')] || g(x, 'cl'), `${esc(g(x, 'th'))}(${g(x, 'tr')})`, `${won(g(x, 'pc'))} (${pct(g(x, 'chg'))})`, pct(g(x, 'dd')),
        `${pct(g(x, 'm20'))} · ${pct(g(x, 'm60'))}`, won(g(x, 'a20')), `${g(x, 'a60')}번`, won(g(x, 'b')) + (late(x, k) ? ` <small style="color:#ffc454">${md(g(x, 'bd'))} 매수</small>` : ''),
        ST[s] || s, done ? pct(g(x, 'p'), 2) : '—', done ? g(x, 'k') + '일' : '—', g(x, 'ed') ? `${ymd(g(x, 'ed'))} ${WHY[g(x, 'w')] || ''}` : '—',
        done ? pct(g(x, 'mx')) : '—', done ? pct(g(x, 'mae')) : '—'];
      html += `<tr style="${g(x, 'r') < 10 ? '' : 'opacity:.65'}">` + vals.map(v => `<td style="padding:5px 7px;border-bottom:1px solid #1e2a44;white-space:nowrap">${v}</td>`).join('') + '</tr>';
    });
    html += '</table></div>';
    if (!row.n) html += '<p>공식 종목 없음 = 그날 무리 안에 재돌파·얕은 쉼 종목이 없었거나 최근 5거래일 안에 이미 뽑은 종목뿐이었다.</p>';
    body.insertAdjacentHTML('beforeend', html + '</section>');
    ov.style.display = 'flex';
    window.__배지복귀 = function () { window.openBestDetail(k); };
    return result;
  };
  if (typeof bestY !== 'undefined' && typeof window.renderBestCalendar === 'function') {
    try { window.renderBestCalendar(); } catch (e) { console.warn('어사이드39 다시 그리기 실패', e); }
  }
})();
