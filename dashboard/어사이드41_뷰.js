/* ㊶ 어사이드41 (2026-10-05 사용자 지시) = 매수타점매매법3(주도주 재돌파 · 신호일 고가 돌파 매수 · 하루 2 · −7% 종가 손절 · +20% · 10일) · 🏅 베스트 달력에 묶음을 더한다(기존 자료·함수는 그대로).
   스킬 /어사이드41 · 빌더 = 주도주\_베스트_어사이드41_빌드.py (→ 매매법\매수타점매매법\v3_청산전수\_v3_달력41.py · 아침 러너 _v3_아침.py 와 같은 계산) · 자료 = dashboard/data/베스트_어사이드41(_과거).js
   한마디로: 월간 주도주 · MA120·MA240 우상향 · 종가 ≥ MA60 · 그날 시총 상위 100위 아님 무리에서 재돌파(20일 고점에서 −8% 넘게 눌렸다가 종가가 다시 직전 20일 고점 위 · MA20 위)
            · 60봉 +20% 날 많은 순 → 20일 대금 하루 2종목 · 매수일 고가가 신호일 고가(트리거)에 닿으면 max(시가, 트리거)에 삼(상한가 잠김 제외) · 같은 종목 보유 중엔 안 삼
   칸 = 매수일 · 결과는 규칙대로 샀다고 가정한 계산(종가 < 매수가×0.93 손절 · +20% 지정가 · 10거래일 · 비용 0.3%) · 판 F4_B_K2_S7_T20_10 고정(업그레이드 없음)
   관찰용 · 매수추천 아님 · 약한 후보(HOLDOUT 0 포함) · 감싸는 함수 = buildBestCell · renderBestMonthStrip · renderBestMeta · openBestDetail (어사이드40_뷰.js 와 같은 방식 · 그 뒤에 읽는다) */
(function () {
  'use strict';
  if (window.__aside41Installed) return;
  const originals = ['buildBestCell', 'renderBestMonthStrip', 'renderBestMeta', 'openBestDetail'];
  if (originals.some(n => typeof window[n] !== 'function')) { console.error('어사이드41: 베스트 달력 함수가 없습니다'); return; }
  window.__aside41Installed = true;
  const color = '#ffb300', line = '#5a4310', BADGE = '㊶';
  const arch = () => window.어사이드41_ARCHIVE || {};
  const NM = () => window.어사이드41_NAMES || {};
  const I = {};
  (window.어사이드41_COLS || ['c', 'r', 'th', 'tr', 'pc', 'chg', 'dd', 'bk', 'm20', 'm60', 'a20', 'a60', 'tg', 'b', 'bd', 's', 'p', 'k', 'ed', 'w', 'mx', 'mae', 'lb', 'sd', 'hd']).forEach((c, i) => { I[c] = i; });
  const g = (x, key) => x[I[key]];
  const esc = v => String(v == null ? '' : v).replace(/[&<>"']/g, ch => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[ch]));
  const pct = (v, dg) => v == null ? '—' : `<span style="color:${v >= 0 ? '#ff8a8a' : '#7ea6ff'}">${v >= 0 ? '+' : ''}${Number(v).toFixed(dg == null ? 1 : dg)}%</span>`;
  const won = v => v == null ? '—' : Number(v).toLocaleString('ko-KR', {maximumFractionDigits: 0});
  const ymd = s => { s = String(s || ''); return s.length === 8 ? `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6)}` : s; };
  const md = s => { s = String(s || ''); return s.length === 8 ? `${s.slice(4, 6)}/${s.slice(6)}` : s; };
  const name = x => (NM()[g(x, 'c')] || [g(x, 'c')])[0];
  const mkt = x => (NM()[g(x, 'c')] || ['', ''])[1];
  const off = x => g(x, 'r') < 10;
  const ST = {C: '확정', H: '결과대기', N: '안 닿음(매수일 고가 < 트리거)', K: '상한가 잠김(못 삼)', X: '보유 중이라 안 삼', P: '예정(목록만)',
    L: '봉 늦음(천프정 미수집)', S: '자료끊김(정지·폐지)', R: '참고(다음 후보 · 성적 밖)'};
  const WHY = {1: '익절 +20%', 2: '손절(종가 −7%)', 3: '만기(10일)'};
  const SHORT = {1: '익절', 2: '손절', 3: '만기'};
  const res = x => {
    const s = g(x, 's');
    if (s === 'C') return `${pct(g(x, 'p'))} <span style="color:#8487bd">${SHORT[g(x, 'w')] || ''}</span>`;
    if (s === 'H') return `<span style="color:#ffc454">대기 ${g(x, 'k')}일</span> ${pct(g(x, 'p'))}${g(x, 'lb') ? ` <span style="color:#8487bd">${md(g(x, 'lb'))}봉까지</span>` : ''}`;
    if (s === 'N') return '<span style="color:#8487bd">안 닿음</span>';
    if (s === 'K') return '<span style="color:#8487bd">잠김</span>';
    if (s === 'X') return '<span style="color:#8487bd">보유 중</span>';
    if (s === 'P') return `<span style="color:#7ee8ff">예정 · ${won(g(x, 'tg'))} 돌파면 삼</span>`;
    if (s === 'L') return '<span style="color:#ffc454">봉 늦음</span>';
    if (s === 'R') return '<span style="color:#8487bd">참고</span>';
    return `<span style="color:#8487bd">${ST[s] || s}</span>`;
  };
  const late = (x, k) => g(x, 'bd') && String(g(x, 'bd')) !== String(k).replace(/-/g, '') ? ` · ★실제 매수 ${md(g(x, 'bd'))}(거래정지 등으로 늦음)` : '';
  const tipOf = (x, k) => `${off(x) ? '공식' : '참고(성적 밖)'} · 주도 테마 ${g(x, 'th')}${g(x, 'tr') != null ? '(' + g(x, 'tr') + '위)' : ''} · 신호일 종가 ${won(g(x, 'pc'))}(${g(x, 'chg')}%)`
    + ` · 직전 20일 고점 위 ${g(x, 'bk')}% · 그 전 눌림 ${g(x, 'dd')}% · MA20 대비 ${g(x, 'm20')}% · MA60 대비 ${g(x, 'm60')}% · 20일 대금 ${won(g(x, 'a20'))}억 · 최근 60일 +20% 날 ${g(x, 'a60')}번`
    + ` · 트리거(신호일 고가) ${won(g(x, 'tg'))} · −7% 손절선 ${won(g(x, 'tg') * 0.93)}${g(x, 'b') != null ? ' · 매수가 ' + won(g(x, 'b')) : ''}${late(x, k)}${g(x, 'hd') ? ' · 이 종목 보유 중' : ''}`
    + ` · ${ST[g(x, 's')] || ''}${g(x, 'ed') ? ' ' + md(g(x, 'ed')) + ' ' + (WHY[g(x, 'w')] || '') : ''}${g(x, 'mx') != null ? ' · 보유 중 최고 ' + g(x, 'mx') + '% 최저 ' + g(x, 'mae') + '%' : ''}`;

  const oldCell = window.buildBestCell;
  window.buildBestCell = function (d, k, rec, other, dow) {
    let html = oldCell.apply(this, arguments);
    const row = arch()[k]; if (!row) return html;
    let layer = `<div class="aside41-layer" style="border-top:1px dashed ${line};margin-top:4px;padding-top:3px;color:${color};font-size:10px" title="${BADGE} 어사이드41(매수타점매매법3 · 주도주 재돌파 · 신호일 고가 돌파 매수) · 신호일 ${ymd(row.sd)} 장마감까지 보고 고름 · 무리 ${row.u}종목 · 눌러서 자세히"><b>${BADGE} 어사이드41</b> <span style="color:#8487bd">무리 ${row.u}</span>`;
    row.a.forEach(x => {
      layer += `<div title="${esc(tipOf(x, k))}" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;${off(x) ? '' : 'opacity:.6;font-size:9.5px'}">${off(x) ? '🎯' : '·'} <b>${esc(name(x))}</b> ${res(x)}</div>`;
    });
    layer += '</div>';
    if (!html.match(/^<div[^>]*\bhas-data\b/) && row.n) html = html.replace('class="cal-cell', 'class="cal-cell has-data');
    if (!html.match(/^<div[^>]*\bonclick=/) && row.n) html = html.replace('data-date="' + k + '"', 'data-date="' + k + '" onclick="openBestDetail(\'' + k + '\')" style="cursor:pointer"');
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
      if (n) { if (i + 1 !== bestM) btn.classList.add('has-data'); btn.title += ` · 어사이드41 ${n}종목`; }
    });
    return result;
  };

  const sline = T => T && T.n ? `${Number(T.n).toLocaleString('ko-KR')}건 평균 ${pct(T.rr, 2)} 중앙 ${pct(T.med, 2)} 승률 ${T.win}% 평균손실 ${pct(T.loss, 1)} · +20% 익절 ${T.tgt}% · 손절 ${T.stop}%` : '—';
  const oldMeta = window.renderBestMeta;
  window.renderBestMeta = function () {
    const result = oldMeta.apply(this, arguments);
    const el = document.getElementById('best-meta'), m = window.어사이드41_META;
    if (!el) return result;
    if (!m) { el.innerHTML += '<br><span style="color:#ff9aaa">❌ 베스트_어사이드41.js 가 안 읽혔다 = 주도주\\_베스트_어사이드41_빌드.py 실행</span>'; return result; }
    const E = m.예정 || {}, S = m.상태 || {}, Y = (m.연도 || []).find(r => typeof bestY !== 'undefined' && r.y === bestY);
    const pl = (E.종목 || []).map(x => `${x[0]}(${x[1]} · ${won(x[2])} 돌파면 삼)`).join(', ');
    el.innerHTML += `<div class="aside41-meta" style="margin-top:5px;color:${color}"><b>${BADGE} 어사이드41</b>(매수타점매매법3 · 주도주 재돌파 · 신호일 고가 돌파 매수 · 하루 2) ${esc(m.첫칸)}~${esc(m.끝칸)} · ${Number(m.칸).toLocaleString('ko-KR')}칸 · 공식 ${Number(m.공식).toLocaleString('ko-KR')}건 · 체결 ${m.체결}건(주 ${m.주당체결}) · 안 닿음 ${S.N || 0} · 잠김 ${S.K || 0} · 보유 중이라 안 삼 ${S.X || 0}`
      + ` · 확정 ${sline(m.전체)} · 결과대기 ${m.결과대기}${m.봉늦음 ? ` · 천프정 봉 늦음 ${m.봉늦음}` : ''}`
      + (Y && Y.n ? ` · ${bestY}년 ${Y.n}건 평균 ${pct(Y.rr, 2)} 중앙 ${pct(Y.med, 2)}` : '')
      + `<br>${E.막힘 ? `<span style="color:#ffc454">${esc(E.막힘)}</span>` : `${ymd(E.매수일)} 8시 = ${esc(pl)}`}`
      + `<br><span style="color:#ff9aaa">${esc(m.판정)}</span> · 2022-07~2024 ${sline(m.학습)} · 2025~2026-08 ${sline(m.시험)} · 9월~ ${sline(m.이후)}`
      + ` · ${esc(m.대조)} · ${esc(m.재현)} · ${esc(m.지난판)}`
      + `<br><span style="color:#8487bd">무리 = 월간 카드 빨간 점 주도 테마(10개) 주도주(20카드일 등장 상위 3) · 일반 주식(스팩·우선주·리츠 제외) · 종가 1,000원+ · 20일 대금 5억+ · MA120·MA240 둘 다 20일 전보다 위 · 종가 ≥ MA60 · 그날 시총 전체 상위 100위 제외`
      + ` → 재돌파(직전 20봉 고점 뒤 −8% 넘게 눌렸다가 종가가 그 고점 위 · MA20 위) · 60봉 +20% 날 많은 순 → 20일 대금 하루 2 · 매수일 고가 ≥ 트리거(신호일 고가)면 max(시가, 트리거)에 삼 · 상한가 잠김 못 삼 · 같은 종목 보유 중엔 안 삼`
      + ` · 종가 < 매수가×0.93 손절 · +20% 지정가(둘째 날부터 시가가 위면 시가) · 10거래일 · 비용 0.3% · 판 고정(업그레이드 없음) · 2022-07 전은 월간 카드가 없어 못 만듦 · 평균손실 −10~−12.5%(갭) · 지금 상장 종목만이라 생존편향</span></div>`;
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
    const prev = body.querySelector('[data-aside41-detail]'); if (prev) prev.remove();
    let html = `<section data-aside41-detail style="margin-top:20px;color:${color}"><h3 style="margin:0">${BADGE} 어사이드41 · 매수일 ${esc(k)} · 무리 ${row.u}종목 · 공식 ${row.n} <span style="font-size:12px;color:#ff9aaa;font-weight:600">관찰용 · 매수추천 아님</span></h3>`
      + `<p style="color:#8487bd;font-size:12px;line-height:1.6;margin:6px 0">매수타점매매법3 · 신호일 <b style="color:#c9cbe8">${ymd(row.sd)}</b> 장마감 자료 + 그날까지 월간 카드만 보고 고름 · 판 F4_B_K2_S7_T20_10 · 🎯 공식 · 「참고」 = 같은 순서 다음 후보(성적 밖)<br>`
      + `<b style="color:#c9cbe8">결과는 규칙대로 샀다고 가정한 계산(실제 매매와 무관)</b> · 매수일 고가가 트리거(신호일 고가)에 닿으면 max(시가, 트리거)에 삼 · 종가가 매수가 −7% 아래면 그 종가 · +20% 지정가(둘째 날부터 시가가 +20% 위면 시가) · 10거래일 만기 · 비용 0.3%</p>`;
    html += `<div style="overflow-x:auto"><table style="border-collapse:collapse;color:#e4e6ff;font-size:12px"><tr>`;
    ['구분', '종목', '주도 테마(순위)', '신호일 종가(등락)', '20일 고점 위', '그 전 눌림', 'MA20 · MA60 대비', '20일 대금(억)', '60일 +20% 날', '트리거(신호일 고가)', '매수가', '결과', '수익', '보유일', '청산일·사유', '보유 중 최고', '보유 중 최저'].forEach(t => html += `<th style="padding:5px 7px;border-bottom:1px solid ${line};color:#8487bd;white-space:nowrap;text-align:left">${t}</th>`);
    html += '</tr>';
    row.a.forEach(x => {
      const nmEl = `<span style="cursor:pointer;font-weight:bold;color:${color}" onclick="_openStock(this,function(){openBestDetail('${k}')})" data-code="${esc(g(x, 'c'))}" data-name="${esc(name(x))}" data-rate="0" data-amount="0" data-meta="㊶어사이드41 ${k}" data-catalyst="">${esc(name(x))}</span> <small style="color:#6b6e9c">${esc(g(x, 'c'))} ${esc(mkt(x))}</small>`;
      const s = g(x, 's'), done = s === 'C' || s === 'H';
      const vals = [off(x) ? '공식' : '참고', nmEl, `${esc(g(x, 'th'))}${g(x, 'tr') != null ? '(' + g(x, 'tr') + ')' : ''}`, `${won(g(x, 'pc'))} (${pct(g(x, 'chg'))})`, pct(g(x, 'bk')), pct(g(x, 'dd')),
        `${pct(g(x, 'm20'))} · ${pct(g(x, 'm60'))}`, won(g(x, 'a20')), `${g(x, 'a60')}번`, won(g(x, 'tg')), won(g(x, 'b')) + (late(x, k) ? ` <small style="color:#ffc454">${md(g(x, 'bd'))} 매수</small>` : ''),
        (ST[s] || s) + (g(x, 'hd') && s !== 'X' ? ' <small style="color:#8487bd">(보유 중)</small>' : ''), done ? pct(g(x, 'p'), 2) : '—', done ? g(x, 'k') + '일' : '—', g(x, 'ed') ? `${ymd(g(x, 'ed'))} ${WHY[g(x, 'w')] || ''}` : '—',
        done ? pct(g(x, 'mx')) : '—', done ? pct(g(x, 'mae')) : '—'];
      html += `<tr style="${off(x) ? '' : 'opacity:.65'}">` + vals.map(v => `<td style="padding:5px 7px;border-bottom:1px solid #2a2410;white-space:nowrap">${v}</td>`).join('') + '</tr>';
    });
    html += '</table></div>';
    body.insertAdjacentHTML('beforeend', html + '</section>');
    ov.style.display = 'flex';
    window.__배지복귀 = function () { window.openBestDetail(k); };
    return result;
  };
  if (typeof bestY !== 'undefined' && typeof window.renderBestCalendar === 'function') {
    try { window.renderBestCalendar(); } catch (e) { console.warn('어사이드41 다시 그리기 실패', e); }
  }
})();
