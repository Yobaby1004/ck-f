/* ㊽ 어사이드48 (2026-10-06 사용자 지시) = 골드타겟매매법 v2 F(120·240 우상향 · 60일 고점 −5% 안 · 정배열 검색기 · 20일 대금 순 하루 2개 · 신호봉 고가 역지정가 · −7% 종가 손절 · +20% · 20일) · 🏅 베스트 달력에 묶음을 더한다(기존 자료·함수는 그대로).
   스킬 /어사이드48 · 빌더 = 주도주\_베스트_어사이드48_빌드.py (→ 매매법\골드타겟매매법\v2_정답지주도주\_v2_달력48.py · 백테스트·아침 러너 _v2_아침.py 와 같은 계산) · 자료 = dashboard/data/베스트_어사이드48(_과거).js
   한마디로: 일반 주식 · 그날 시총 상위 100위 아님 · 시총 500억+ · MA120·MA240 둘 다 20일 전보다 위 · 60일 고점 −5% 안 · 그날 「정배열 검색기」(5>20>120>240 · 5봉 안 거래량 5배 · +5%↑ · 40봉 최고 종가 · 일목 구름 위)
            · 20일 대금 큰 순 2개(보유 중이면 건너뜀) · 매수일 장중 신호봉 고가를 넘으면 max(시가, 신호봉 고가)에 삼(상한가 잠김 제외)
   칸 = 매수일 · 결과는 규칙대로 샀다고 가정한 계산(종가 < 매수가 −7% → 그 종가 · +20% 지정가 · 20거래일 · 비용 0.3%) · 판 고정(업그레이드 없음) · 2015-06 전 칸은 화면만 이어 붙인 구간(검증 안 함)
   관찰용 · 매수추천 아님 · 감싸는 함수 = buildBestCell · renderBestMonthStrip · renderBestMeta · openBestDetail (어사이드45_뷰.js 와 같은 방식 · 그 뒤에 읽는다) */
(function () {
  'use strict';
  if (window.__aside48Installed) return;
  const originals = ['buildBestCell', 'renderBestMonthStrip', 'renderBestMeta', 'openBestDetail'];
  if (originals.some(n => typeof window[n] !== 'function')) { console.error('어사이드48: 베스트 달력 함수가 없습니다'); return; }
  window.__aside48Installed = true;
  const color = '#c9a227', line = '#4a3d12', BADGE = '㊽';
  const arch = () => window.어사이드48_ARCHIVE || {};
  const NM = () => window.어사이드48_NAMES || {};
  const I = {};
  (window.어사이드48_COLS || ['c', 'r', 'dd', 'dsh', 'm60', 'hot', 'a20', 'pc', 'chg', 'tg', 'ld', 'al', 'b', 'bd', 's', 'p', 'k', 'ed', 'w', 'mx', 'mae', 'lb', 'sd']).forEach((c, i) => { I[c] = i; });
  const g = (x, key) => x[I[key]];
  const esc = v => String(v == null ? '' : v).replace(/[&<>"']/g, ch => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[ch]));
  const pct = (v, dg) => v == null ? '—' : `<span style="color:${v >= 0 ? '#ff8a8a' : '#7ea6ff'}">${v >= 0 ? '+' : ''}${Number(v).toFixed(dg == null ? 1 : dg)}%</span>`;
  const won = v => v == null ? '—' : Number(v).toLocaleString('ko-KR', {maximumFractionDigits: 0});
  const ymd = s => { s = String(s || ''); return s.length === 8 ? `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6)}` : s; };
  const md = s => { s = String(s || ''); return s.length === 8 ? `${s.slice(4, 6)}/${s.slice(6)}` : s; };
  const name = x => (NM()[g(x, 'c')] || [g(x, 'c')])[0];
  const mkt = x => (NM()[g(x, 'c')] || ['', ''])[1];
  const kind = x => { const r = g(x, 'r'); return (r === 1 || r === 2) ? 'off' : (r === 9 ? 'held' : 'next'); };
  const KIND = {off: '공식(하루 2개)', held: '순위 안 · 보유 중이라 건너뜀', next: '참고 · 다음 후보(성적 밖)'};
  const ICON = {off: '🎯', held: '⏸', next: '·'};
  const LEAD = {2: '주도 테마', 3: '월간 주도주'};
  const ALIGN = ['완전정배열(5>20>60>120>240)', '정배열 속 짧은 눌림(5<20)', '20일선 아래 눌림(20<60)', '60일선 아래(60<120)', '그 밖'];
  const ST = {C: '확정', H: '결과대기', N: '안 닿음(매수일 고가 < 신호봉 고가)', K: '상한가 잠김(못 삼)', X: '보유 중이라 안 삼', P: '예정(목록만)',
    L: '봉 늦음(천프정 미수집)', S: '자료끊김(정지·폐지)', R: '참고 후보(성적 밖)'};
  const WHY = {1: '익절 +20%', 2: '손절(종가 < 매수가 −7%)', 3: '만기(20일)'};
  const SHORT = {1: '익절', 2: '손절', 3: '만기'};
  const res = x => {
    const s = g(x, 's');
    if (s === 'C') return `${pct(g(x, 'p'))} <span style="color:#8487bd">${SHORT[g(x, 'w')] || ''}</span>`;
    if (s === 'H') return `<span style="color:#ffc454">대기 ${g(x, 'k')}일</span> ${pct(g(x, 'p'))}${g(x, 'lb') ? ` <span style="color:#8487bd">${md(g(x, 'lb'))}봉까지</span>` : ''}`;
    if (s === 'N') return '<span style="color:#8487bd">안 닿음</span>';
    if (s === 'K') return '<span style="color:#8487bd">잠김</span>';
    if (s === 'X') return '<span style="color:#8487bd">보유 중</span>';
    if (s === 'P') return `<span style="color:#ffe08a">예정 · ${won(g(x, 'tg'))} 넘으면 삼</span>`;
    if (s === 'L') return '<span style="color:#ffc454">봉 늦음</span>';
    if (s === 'R') return '<span style="color:#8487bd">참고</span>';
    return `<span style="color:#8487bd">${ST[s] || s}</span>`;
  };
  const late = (x, k) => g(x, 'bd') && String(g(x, 'bd')) !== String(k).replace(/-/g, '') ? ` · ★실제 매수 ${md(g(x, 'bd'))}(거래정지 등으로 늦음)` : '';
  const tipOf = (x, k) => `${KIND[kind(x)]} · 정배열 검색기 · 60일 고점 대비 ${g(x, 'dd')}%${g(x, 'dsh') != null ? ' · 고점 뒤 ' + g(x, 'dsh') + '봉' : ''} · 종가/MA60 ${g(x, 'm60')}% · ${ALIGN[g(x, 'al')] || ''}`
    + ` · 최근 60봉 +20% 날 ${g(x, 'hot')}번 · 20일 대금 ${won(g(x, 'a20'))}억${LEAD[g(x, 'ld')] ? ' · ' + LEAD[g(x, 'ld')] : ''} · 신호일 종가 ${won(g(x, 'pc'))}(${g(x, 'chg')}%)`
    + ` · 신호봉 고가(주문가) ${won(g(x, 'tg'))}${g(x, 'b') != null ? ' · 매수가 ' + won(g(x, 'b')) + ' · 손절선(종가) ' + won(g(x, 'b') * 0.93) : ''}${late(x, k)}`
    + ` · ${ST[g(x, 's')] || ''}${g(x, 'ed') ? ' ' + md(g(x, 'ed')) + ' ' + (WHY[g(x, 'w')] || '') : ''}${g(x, 'mx') != null ? ' · 보유 중 최고 ' + g(x, 'mx') + '% 최저 ' + g(x, 'mae') + '%' : ''}`;

  const oldCell = window.buildBestCell;
  window.buildBestCell = function (d, k, rec, other, dow) {
    let html = oldCell.apply(this, arguments);
    const row = arch()[k]; if (!row) return html;
    let layer = `<div class="aside48-layer" style="border-top:1px dashed ${line};margin-top:4px;padding-top:3px;color:${color};font-size:10px" title="${BADGE} 어사이드48(골드타겟매매법 v2 F · 120·240 우상향 · 고점 −5% 안 · 정배열 검색기 · 대금 순 하루 2개 · 신호봉 고가 돌파 매수 · −7% · +20% · 20일) · 신호일 ${ymd(row.sd)} 장마감까지 보고 고름 · 후보 ${row.u}종목 · 눌러서 자세히"><b>${BADGE} 어사이드48</b> <span style="color:#8487bd">후보 ${row.u}</span>`;
    row.a.forEach(x => {
      const kd = kind(x);
      layer += `<div title="${esc(tipOf(x, k))}" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;${kd === 'off' ? '' : 'opacity:.6;font-size:9.5px'}">${ICON[kd]} <b>${esc(name(x))}</b> ${res(x)}</div>`;
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
      if (n) { if (i + 1 !== bestM) btn.classList.add('has-data'); btn.title += ` · 어사이드48 ${n}종목`; }
    });
    return result;
  };

  const sline = T => T && T.n ? `${Number(T.n).toLocaleString('ko-KR')}건 평균 ${pct(T.rr, 2)} 깎은 ${pct(T.tr, 2)} 중앙 ${pct(T.med, 2)} 승률 ${T.win}% 평균손실 ${pct(T.loss, 1)}` : '—';
  const oldMeta = window.renderBestMeta;
  window.renderBestMeta = function () {
    const result = oldMeta.apply(this, arguments);
    const el = document.getElementById('best-meta'), m = window.어사이드48_META;
    if (!el) return result;
    if (!m) { el.innerHTML += '<br><span style="color:#ff9aaa">❌ 베스트_어사이드48.js 가 안 읽혔다 = 주도주\\_베스트_어사이드48_빌드.py 실행</span>'; return result; }
    const E = m.예정 || {}, S = m.상태 || {}, Y = (m.연도 || []).find(r => typeof bestY !== 'undefined' && r.y === bestY), P = m.시기 || {};
    const pl = (E.종목 || []).map(x => `${x[0]}(${x[1]}${x[3] ? ' · ' + x[3] : ''} · 신호봉 고가 ${won(x[2])} 넘으면 삼)`).join(', ');
    el.innerHTML += `<div class="aside48-meta" style="margin-top:5px;color:${color}"><b>${BADGE} 어사이드48</b>(골드타겟매매법 v2 F · 120·240 우상향 · 고점 −5% 안 · 정배열 검색기 · 대금 순 하루 2개 · 신호봉 고가 돌파 매수 · −7% 종가 손절 · +20% · 20일) ${esc(m.첫칸)}~${esc(m.끝칸)} · ${Number(m.칸).toLocaleString('ko-KR')}칸 · 공식 ${Number(m.공식).toLocaleString('ko-KR')}건 · 체결 ${m.체결}건(주 ${m.주당체결}) · 안 닿음 ${S.N || 0} · 잠김 ${S.K || 0}`
      + ` · 확정 ${sline(m.전체)} · 결과대기 ${m.결과대기}${m.봉늦음 ? ` · 천프정 봉 늦음 ${m.봉늦음}` : ''}`
      + (Y && Y.n ? ` · ${bestY}년 ${Y.n}건 평균 ${pct(Y.rr, 2)} 중앙 ${pct(Y.med, 2)}` : '')
      + `<br>${E.막힘 ? `<span style="color:#ffc454">${esc(E.막힘)}</span>` : `${ymd(E.매수일)} 8시 = ${esc(pl)}`}`
      + `<br><span style="color:#ff9aaa">${esc(m.판정)}</span>`
      + `<br>` + Object.entries(P).map(([en, T]) => `${esc(en)} ${sline(T)}`).join(' · ') + ` · 9월~ ${sline(m.이후)} · 2015-06 전(화면만 · 검증 안 함) ${sline(m.이전)}`
      + `<br>${esc(m.대조)} · ${esc(m.재현)}`
      + `<br><span style="color:#8487bd">무리 = 일반 주식(스팩·우선주·리츠 제외) · 원본 종가 1,200~50만 원 · 시총 500억+ · 20일 대금 5억+ · 판 첫 300봉 지남 · 최근 500봉 자료 튐 없음 · 그날 시총 전체 상위 100위 제외 · MA120·MA240 둘 다 20일 전보다 위`
      + ` → 60일 고점 −5% 안 · 정배열 검색기(5>20>120>240 · 5봉 안 거래량 전봉 5배 · 오늘 +5%↑ · 40봉 최고 종가 · 일목 7·22·44 구름 위) · 20일 대금 큰 순 2개(보유 중이면 건너뜀 · 안 닿아도 자리 씀)`
      + ` · 매수일 고가 ≥ 신호봉 고가면 max(시가, 신호봉 고가)에 삼 · 상한가 잠김 못 삼 · 종가 < 매수가 −7% 면 그 종가에 팜 · +20% 지정가 · 20거래일 · 비용 0.3% · 판 고정(업그레이드 없음) · 지금 상장 종목만이라 생존편향</span></div>`;
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
    const prev = body.querySelector('[data-aside48-detail]'); if (prev) prev.remove();
    let html = `<section data-aside48-detail style="margin-top:20px;color:${color}"><h3 style="margin:0">${BADGE} 어사이드48 · 매수일 ${esc(k)} · 후보 ${row.u}종목 · 공식 ${row.n} <span style="font-size:12px;color:#ff9aaa;font-weight:600">관찰용 · 매수추천 아님</span></h3>`
      + `<p style="color:#8487bd;font-size:12px;line-height:1.6;margin:6px 0">골드타겟매매법 v2 F · 신호일 <b style="color:#c9cbe8">${ymd(row.sd)}</b> 장마감 자료만 보고 고름 · 🎯 공식(20일 대금 순 2개) · ⏸ 순위 안이지만 보유 중이라 건너뜀 · 「·」 다음 후보(성적 밖)<br>`
      + `<b style="color:#c9cbe8">결과는 규칙대로 샀다고 가정한 계산(실제 매매와 무관)</b> · 매수일 고가가 신호봉 고가를 넘으면 max(시가, 신호봉 고가)에 삼 · 종가가 매수가 −7% 아래면 그 종가 · +20% 지정가 · 20거래일 만기 · 비용 0.3%</p>`;
    html += `<div style="overflow-x:auto"><table style="border-collapse:collapse;color:#e4e6ff;font-size:12px"><tr>`;
    ['구분', '종목', '60일 고점 대비', '고점 뒤', '종가/MA60', '이평 배열', '60봉 +20% 날', '주도', '20일 대금(억)', '신호일 종가(등락)', '신호봉 고가(주문가)', '매수가', '결과', '수익', '보유일', '청산일·사유', '보유 중 최고', '보유 중 최저'].forEach(t => html += `<th style="padding:5px 7px;border-bottom:1px solid ${line};color:#8487bd;white-space:nowrap;text-align:left">${t}</th>`);
    html += '</tr>';
    row.a.forEach(x => {
      const nmEl = `<span style="cursor:pointer;font-weight:bold;color:${color}" onclick="_openStock(this,function(){openBestDetail('${k}')})" data-code="${esc(g(x, 'c'))}" data-name="${esc(name(x))}" data-rate="0" data-amount="0" data-meta="㊽어사이드48 ${k}" data-catalyst="">${esc(name(x))}</span> <small style="color:#6b6e9c">${esc(g(x, 'c'))} ${esc(mkt(x))}</small>`;
      const s = g(x, 's'), done = s === 'C' || s === 'H', kd = kind(x);
      const vals = [KIND[kd], nmEl, pct(g(x, 'dd')), g(x, 'dsh') != null ? g(x, 'dsh') + '봉' : '—', pct(g(x, 'm60')), ALIGN[g(x, 'al')] || '—', `${g(x, 'hot')}번`, LEAD[g(x, 'ld')] || '—', won(g(x, 'a20')),
        `${won(g(x, 'pc'))} (${pct(g(x, 'chg'))})`, won(g(x, 'tg')), won(g(x, 'b')) + (late(x, k) ? ` <small style="color:#ffc454">${md(g(x, 'bd'))} 매수</small>` : ''),
        ST[s] || s, done ? pct(g(x, 'p'), 2) : '—', done ? g(x, 'k') + '일' : '—', g(x, 'ed') ? `${ymd(g(x, 'ed'))} ${WHY[g(x, 'w')] || ''}` : '—',
        done ? pct(g(x, 'mx')) : '—', done ? pct(g(x, 'mae')) : '—'];
      html += `<tr style="${kd === 'off' ? '' : 'opacity:.65'}">` + vals.map(v => `<td style="padding:5px 7px;border-bottom:1px solid #2a2410;white-space:nowrap">${v}</td>`).join('') + '</tr>';
    });
    html += '</table></div>';
    body.insertAdjacentHTML('beforeend', html + '</section>');
    ov.style.display = 'flex';
    window.__배지복귀 = function () { window.openBestDetail(k); };
    return result;
  };
  if (typeof bestY !== 'undefined' && typeof window.renderBestCalendar === 'function') {
    try { window.renderBestCalendar(); } catch (e) { console.warn('어사이드48 다시 그리기 실패', e); }
  }
})();
