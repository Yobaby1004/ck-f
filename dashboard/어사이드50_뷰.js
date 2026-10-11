/* ㊿ 어사이드50 (2026-10-06 사용자 지시) = 골드타겟·바닥 주도눌림 v2(두 교정판 · C:\사용자\GPT천프\골드타겟_주도눌림v2 · 바닥_주도눌림v2) · 🏅 베스트 달력에 묶음을 더한다(기존 자료·함수는 그대로).
   스킬 /어사이드50 · 빌더 = 주도주\_베스트_어사이드50_빌드.py (→ C:\사용자\GPT천프\어사이드50\build_calendar.py) · 자료 = dashboard/data/베스트_어사이드50(_과거).js
   한마디로: 골드타겟매매법·바닥매매법의 원래 신호 가운데 120·240일선이 둘 다 올라가고(5·20봉 전보다 위 · 260봉 유효) 전 거래일까지 최근 5/20거래일 주도테마 상위5에 든 종목(마지막 언급 10거래일 안)만 남긴다.
            확인 신호는 과거 급등 빈도 점수 큰 순으로 매매법마다 하루 최대 5 · 미확인 신호는 관찰 목록(매수 아님) · 일반 주식만(스팩·우선주·ETF/ETN 제외)
   칸 = 명단일(신호일 다음 거래일) · 결과 = 명단일 시가에 샀다고 가정한 모의 계산(+20% 목표 · 골드타겟 종가 -7% 이탈 다음날 시가 · 바닥 지지 -2% · 40거래일 · 비용 0.45%p) · 관찰용 · 매수추천 아님
   감싸는 함수 = buildBestCell · renderBestMonthStrip · renderBestMeta · openBestDetail (어사이드42~49_뷰.js 와 같은 방식 · 그 뒤에 읽는다) */
(function () {
  'use strict';
  if (window.__aside50Installed) return;
  const originals = ['buildBestCell', 'renderBestMonthStrip', 'renderBestMeta', 'openBestDetail'];
  if (originals.some(n => typeof window[n] !== 'function')) { console.error('어사이드50: 베스트 달력 함수가 없습니다'); return; }
  window.__aside50Installed = true;
  const color = '#ff80ab', line = '#5a2a3c', MUTED = '#8487bd', BADGE = '㊿', SHOW = 6;
  const KN = {g: '골드타겟', b: '바닥'}, KS = {g: '골', b: '바'}, KC = {g: '#ffca28', b: '#4dd0e1'};
  const arch = () => window.어사이드50_ARCHIVE || {};
  const NM = () => window.어사이드50_NAMES || {};
  const I = {};
  (window.어사이드50_COLS || ['c', 'k', 'o', 'rk', 's', 't', 'wr', 'mr', 'mn', 'ag', 'ri', 'rd', 'dp', 'dd', 'cd', 'su', 'po', 'pc', 'chg', 's120', 's240', 'vr', 'sc',
    'ps', 'pw', 'pp', 'pk', 'pe', 'pb', 'pl', 'px', 'pmx', 'pmn', 'lb']).forEach((c, i) => { I[c] = i; });
  const g = (x, k) => { const v = x[I[k]]; return v === undefined ? null : v; };
  const esc = v => String(v == null ? '' : v).replace(/[&<>"']/g, ch => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[ch]));
  const pct = (v, dg) => v == null ? '—' : `<span style="color:${v >= 0 ? '#ff8a8a' : '#7ea6ff'}">${v >= 0 ? '+' : ''}${Number(v).toFixed(dg == null ? 1 : dg)}%</span>`;
  const plain = (v, dg) => v == null ? '—' : `${v >= 0 ? '+' : ''}${Number(v).toFixed(dg == null ? 1 : dg)}%`;
  const won = v => v == null ? '—' : Number(v).toLocaleString('ko-KR', {maximumFractionDigits: 0});
  const ymd = s => { s = String(s || ''); return s.length === 8 ? `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6)}` : s; };
  const md = s => { s = String(s || '').replace(/-/g, ''); return s.length === 8 ? `${s.slice(4, 6)}/${s.slice(6)}` : s; };
  const name = x => (NM()[g(x, 'c')] || [g(x, 'c')])[0];
  const mkt = x => (NM()[g(x, 'c')] || ['', ''])[1];
  const SUP = {MA20: '20일선', MA60: '60일선', MA120: '120일선', MA240: '240일선', none: '없음'};
  const POS = {above20_20above60: '20일선 위 · 20>60', above20_20below60: '20일선 위 · 20<60', below20_above60: '20일선 아래 · 60일선 위',
    below60_above120: '60일선 아래 · 120일선 위', below120: '120일선 아래'};
  const WHY = {T: '익절 +20%', S: '손절', E: '만기 40거래일'};
  const SHORT = {T: '익절', S: '손절', E: '만기'};
  const ST = {C: '확정', H: '결과대기', N: '안 삼(시가 갭 · 손절폭)', U: '가격 확인 불가', P: '예정(명단일 시가 매수)'};
  const picks = row => row.r.filter(x => g(x, 'rk') > 0);
  const obs = row => row.r.filter(x => !g(x, 'o'));
  const extra = row => row.r.filter(x => g(x, 'o') && !(g(x, 'rk') > 0));
  const count = (rows, k) => rows.filter(x => g(x, 'k') === k).length;
  const res = x => {
    const s = g(x, 'ps');
    if (s === 'C') return `${pct(g(x, 'pp'))} <span style="color:${MUTED}">${SHORT[g(x, 'pw')] || ''}</span>`;
    if (s === 'H') return `<span style="color:#ffc454">대기 ${g(x, 'pk')}일</span> ${pct(g(x, 'pp'))}`;
    if (s === 'N') return `<span style="color:${MUTED}">안 삼</span>`;
    if (s === 'U') return '<span style="color:#ffc454">가격 확인 불가</span>';
    if (s === 'P') return '<span style="color:#7ee8ff">예정 · 시가 매수</span>';
    return '';
  };
  const theme = x => `${g(x, 't') || '—'}(주간 ${g(x, 'wr') >= 99 ? '-' : g(x, 'wr')}위 · 월간 ${g(x, 'mr') >= 99 ? '-' : g(x, 'mr')}위 · 20일 ${g(x, 'mn')}번 · ${g(x, 'ag')}일 전)`;
  const tipOf = x => `${KN[g(x, 'k')]} ${g(x, 'rk') > 0 ? g(x, 'rk') + '순위' : (g(x, 'o') ? '확인(상위5 밖)' : '관찰')} · ${g(x, 's')} · 주도테마 ${theme(x)}`
    + ` · 직전 상승 ${plain(g(x, 'ri'))}(${g(x, 'rd')}일) · 눌림 ${plain(g(x, 'dp') == null ? null : -g(x, 'dp'))}(${g(x, 'dd')}일) · 지금 고점 대비 ${plain(g(x, 'cd') == null ? null : -g(x, 'cd'))}`
    + ` · 지지 ${SUP[g(x, 'su')] || g(x, 'su')} · 120일선 20봉 ${plain(g(x, 's120'))} · 240일선 20봉 ${plain(g(x, 's240'))} · 신호일 종가 ${won(g(x, 'pc'))}(${plain(g(x, 'chg'))})`
    + (g(x, 'pb') != null ? ` · 매수가(명단일 시가) ${won(g(x, 'pb'))} · 손절선 ${won(g(x, 'pl'))}` : '')
    + (g(x, 'ps') ? ` · ${ST[g(x, 'ps')] || ''}${g(x, 'px') ? ' ' + md(g(x, 'px')) + ' ' + (WHY[g(x, 'pw')] || '') : ''}` : '')
    + (g(x, 'pmx') != null ? ` · 매수 뒤 최고 ${plain(g(x, 'pmx'))} 최저 ${plain(g(x, 'pmn'))}` : '');
  const nmEl = (x, k) => `<span style="cursor:pointer;font-weight:bold;color:${KC[g(x, 'k')]}" onclick="_openStock(this,function(){openBestDetail('${k}')})" data-code="${esc(g(x, 'c'))}" data-name="${esc(name(x))}" data-rate="0" data-amount="0" data-meta="㊿어사이드50 ${k}" data-catalyst="">${esc(name(x))}</span> <small style="color:#6b6e9c">${esc(g(x, 'c'))} ${esc(mkt(x))}</small>`;
  const th = t => `<th style="padding:5px 7px;border-bottom:1px solid ${line};color:${MUTED};white-space:nowrap;text-align:left">${t}</th>`;
  const tr = (vals, dim) => `<tr style="${dim ? 'opacity:.7' : ''}">` + vals.map(v => `<td style="padding:5px 7px;border-bottom:1px solid #2a2440;white-space:nowrap">${v}</td>`).join('') + '</tr>';

  const oldCell = window.buildBestCell;
  window.buildBestCell = function (d, k, rec, other, dow) {
    let html = oldCell.apply(this, arguments);
    const row = arch()[k]; if (!row) return html;
    let layer, clickable = row.r.length > 0;
    const box = (body, dim, tip) => `<div class="aside50-layer" style="border-top:1px dashed ${line};margin-top:4px;padding-top:2px;color:${color};font-size:9.5px${dim ? ';opacity:.75' : ''}" title="${esc(tip)}">${body}</div>`;
    if (row.blk) {
      layer = box(`<b>${BADGE}</b> <span style="color:#ffc454">막힘 · ${esc(row.blk[0])}</span>`, true, `${BADGE} 어사이드50 · 명단일 ${k} · 신호일 ${ymd(row.sd)} · 오늘 명단을 안 냄 = ${row.blk.join(' · ')}`);
    } else if (row.wait) {
      layer = box(`<b>${BADGE}</b> <span style="color:#ffc454">대기 · 월간 칸 ${md(row.sd)} 원문 없음</span>`, true, `${BADGE} 어사이드50 · 명단일 ${k} · ${row.wait}`);
    } else if (!row.r.length) {
      layer = box(`<b>${BADGE}</b> 없음 · 확인 신호 없음`, true, `${BADGE} 어사이드50 · 명단일 ${k} · 신호일 ${ymd(row.sd)} · 우상향 주도주에서 골드타겟·바닥 신호 없음`);
    } else {
      const P = picks(row), O = obs(row), X = extra(row);
      const head = `<b>${BADGE} 어사이드50</b> <span style="color:${MUTED}">${P.length ? `골 ${count(P, 'g')} · 바 ${count(P, 'b')}` : '확인 없음'}${O.length ? ' · 관찰 ' + O.length : ''}${X.length ? ' · 밖 ' + X.length : ''}${row.plan ? ' · 8시 예정' : ''}</span>`;
      let body = head;
      P.slice(0, SHOW).forEach(x => {
        body += `<div title="${esc(tipOf(x))}" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis"><span style="color:${KC[g(x, 'k')]}">${KS[g(x, 'k')]}${g(x, 'rk')}</span> <b>${esc(name(x))}</b> <span style="color:${MUTED}">${esc(g(x, 's'))}</span> ${res(x)}</div>`;
      });
      if (P.length > SHOW) body += `<div style="color:${MUTED}">… 외 ${P.length - SHOW}</div>`;
      if (!P.length) body += `<div style="color:${MUTED};white-space:nowrap;overflow:hidden;text-overflow:ellipsis" title="${esc(O.map(x => KS[g(x, 'k')] + ' ' + name(x)).join(', '))}">관찰 ${O.slice(0, 3).map(x => esc(name(x))).join(', ')}${O.length > 3 ? ' 외 ' + (O.length - 3) : ''}</div>`;
      layer = `<div class="aside50-layer" style="border-top:1px dashed ${line};margin-top:4px;padding-top:3px;color:${color};font-size:10px${P.length ? '' : ';opacity:.75'}" title="${BADGE} 어사이드50(골드타겟·바닥 주도눌림 v2) · 신호일 ${ymd(row.sd)} 장마감까지 보고 고름 · 이날 시가에 삼(가정) · 확인 상위 ${P.length} · 관찰 ${O.length} · 눌러서 자세히">${body}</div>`;
    }
    if (clickable && !html.match(/^<div[^>]*\bhas-data\b/)) html = html.replace('class="cal-cell', 'class="cal-cell has-data');
    if (clickable && !html.match(/^<div[^>]*\bonclick=/)) html = html.replace('data-date="' + k + '"', 'data-date="' + k + '" onclick="openBestDetail(\'' + k + '\')" style="cursor:pointer"');
    const end = html.lastIndexOf('</div>');
    return html.slice(0, end) + layer + html.slice(end);
  };

  const oldStrip = window.renderBestMonthStrip;
  window.renderBestMonthStrip = function () {
    const result = oldStrip.apply(this, arguments);
    const strip = document.getElementById('best-month-strip'); if (!strip || typeof bestY === 'undefined') return result;
    Array.from(strip.children).forEach((btn, i) => {
      const pre = `${bestY}-${String(i + 1).padStart(2, '0')}`;
      const n = Object.entries(arch()).reduce((s, [k, row]) => s + (k.startsWith(pre) ? picks(row).length : 0), 0);
      if (n) { if (i + 1 !== bestM) btn.classList.add('has-data'); btn.title += ` · 어사이드50 확인 ${n}종목`; }
    });
    return result;
  };

  const sline = T => T && T.c ? `${Number(T.c).toLocaleString('ko-KR')}건 평균 ${pct(T.mean, 2)} 중앙 ${pct(T.med, 2)} · 이긴 ${T.win}% · 익절 ${T.tgt}% · 손절 ${T.stop}% · 만기 ${T.exp}%` : '확정 0건';
  const oldMeta = window.renderBestMeta;
  window.renderBestMeta = function () {
    const result = oldMeta.apply(this, arguments);
    const el = document.getElementById('best-meta'), m = window.어사이드50_META;
    if (!el) return result;
    if (!m) { el.innerHTML += '<br><span style="color:#ff9aaa">❌ 베스트_어사이드50.js 가 안 읽혔다 = 주도주\\_베스트_어사이드50_빌드.py 실행</span>'; return result; }
    const C = m.cnt || {}, A = m.all || {}, R = m.research || {}, S = m.sept || {};
    const plan = m.blocked ? `<span style="color:#ffc454">${esc(m.next)} 8시 명단 막힘 = ${esc((m.block || []).join(' · '))}</span>`
      : `${esc(m.next)} 8시 명단 = 골드타겟 ${esc(((m.plan || {}).g || []).join(', ') || '없음')} · 바닥 ${esc(((m.plan || {}).b || []).join(', ') || '없음')}`;
    const per = k => (m.periods || []).map(([p, label]) => `${esc(label.split(' · ')[0])} ${sline((m.perf || {})[k] && m.perf[k][p])}`).join(' / ');
    const kline = k => `<span style="color:${KC[k]}">${KN[k]}</span> 후보 ${Number((C[k] || {}).all || 0).toLocaleString('ko-KR')}(확인 ${(C[k] || {}).conf} · 관찰 ${(C[k] || {}).obs}) · 확인 상위 ${(C[k] || {}).pick} · 확정 ${sline(A[k])} · 결과대기 ${(A[k] || {}).h || 0}`;
    el.innerHTML += `<div class="aside50-meta" style="margin-top:5px;color:${color}"><b>${BADGE} 어사이드50</b>(골드타겟·바닥 주도눌림 v2 · 원래 신호 + 120·240일선 5·20봉 상승 + 그때 주도테마 상위5 · 확인 신호 매매법마다 하루 최대 5 · 명단일 시가 모의 매수) ${esc(m.first)}~${esc(m.last)} · ${Number(m.days).toLocaleString('ko-KR')}칸`
      + `<br>${kline('g')}<br>${kline('b')}`
      + `<br>${plan}${(m.wait || []).length ? ` · <span style="color:#ffc454">월간 칸 원문 기다리는 칸 ${esc(m.wait.map(md).join(', '))}</span>` : ''} · 천프정 ${esc(m.asof)} 봉 ${(m.fresh || [])[0]}/${(m.fresh || [])[1]} · 월간 칸 마지막 ${esc(m.theme_last)}`
      + `<br><span style="color:#ff9aaa">연구 판정 = 관찰용 · 매수추천 아님 · 1천만원 모의계좌 2025 골드타겟 ${plain((R.g || {}).acct2025, 2)}(최대낙폭 ${plain((R.g || {}).mdd2025, 2)}) · 바닥 ${plain((R.b || {}).acct2025, 2)} · 2026-01~08 골드타겟 ${plain((R.g || {}).acct2026, 2)} · 바닥 ${plain((R.b || {}).acct2026, 2)} · 9월 다음날 종가 +20% 골드타겟 ${((R.g || {}).sep_daily20 || []).join('/')} · 바닥 ${((R.b || {}).sep_daily20 || []).join('/')}</span>`
      + ` · [대조] 9월 봉인 골드타겟 전체 ${(S.g || []).slice(0, 2).join('/')} · 확인 상위 ${(S.g || []).slice(2).join('/')} · 바닥 전체 ${(S.b || []).slice(0, 2).join('/')} · 확인 상위 ${(S.b || []).slice(2).join('/')}`
      + `<br><span style="color:${MUTED}">기간별 골드타겟: ${per('g')}<br>기간별 바닥: ${per('b')}</span>`
      + `<br><span style="color:${MUTED}">규칙 = 일반 주식(스팩·우선주·ETF/ETN 제외) · 골드타겟 원신호(장기선돌파 · 중심눌림반등 · 정배열돌파 / 점화 = 관찰) · 바닥 원신호(초입지지확인 · 첫눌림확인 · 저점이탈회복 / 화면·황금봉·박스·스윕 = 관찰) · 120·240일선 각각 5·20봉 전보다 위 + 260봉 유효 · 전 거래일 기준 최근 5/20거래일 주도테마 상위5 & 그 종목 마지막 언급 10거래일 안(캘린더 월간 칸 · 2022-06-02~) · 순위 = 고정 구간 과거 다음날 급등 빈도 점수(2022-06~2025-01-02 그달 앞 달까지만 배운 모델 · 2025-01-03~2026-09-24 연구 봉인 명단 · 그 뒤 8월 말 봉인 모델) · 모의 = 명단일 시가 매수(시가 +6% 초과 갭 등은 안 삼) · +20% · 골드타겟 종가가 매수가 -7% 아래면 다음날 시가 · 바닥 지지 -2% · 40거래일 · 비용 0.45%p · 과거 칸은 시간순 재현이지 실제 8시 게시 기록이 아님 · 반복 신호 포함(실제 계좌 아님)</span></div>`;
    return result;
  };

  const oldDetail = window.openBestDetail;
  window.openBestDetail = function (k) {
    const row = arch()[k];
    const body = document.getElementById('stock-modal-body'), ov = document.getElementById('stock-modal-overlay');
    if (!row || !row.r.length || !body || !ov) return oldDetail.apply(this, arguments);
    ov.style.display = 'none';
    const result = oldDetail.apply(this, arguments);
    if (ov.style.display !== 'flex') body.innerHTML = `<div style="font-size:18px;font-weight:bold">🏅 베스트 · ${esc(k)}</div>`;
    const prev = body.querySelector('[data-aside50-detail]'); if (prev) prev.remove();
    const P = picks(row), O = obs(row), X = extra(row);
    let html = `<section data-aside50-detail style="margin-top:20px;color:${color}"><h3 style="margin:0">${BADGE} 어사이드50 · 명단일 ${esc(k)} · 골드타겟 확인 ${count(P, 'g')} · 바닥 확인 ${count(P, 'b')} · 관찰 ${O.length} <span style="font-size:12px;color:#ff9aaa;font-weight:600">관찰용 · 매수추천 아님</span></h3>`
      + `<p style="color:${MUTED};font-size:12px;line-height:1.6;margin:6px 0">골드타겟·바닥 주도눌림 v2 · 신호일 <b style="color:#c9cbe8">${ymd(row.sd)}</b> 장마감 자료 + 그날까지의 월간 칸만 보고 고름 · 원래 신호 + 120·240일선 5·20봉 상승 + 그때 주도테마 상위5(마지막 언급 10거래일 안) · 확인 신호는 매매법마다 점수 큰 순 최대 5<br>`
      + `<b style="color:#c9cbe8">결과는 규칙대로 샀다고 가정한 계산(실제 매매와 무관)</b> · 명단일 시가 매수 · +20% 목표 · 골드타겟 = 종가가 매수가 -7% 아래면 다음날 시가에 팜 · 바닥 = 원신호 지지 -2% 닿으면 팜 · 40거래일 · 비용 0.45%p${row.plan ? ' · <b style="color:#7ee8ff">이 칸은 8시 예정 명단</b>' : ''}</p>`;
    html += '<div style="overflow-x:auto"><table style="border-collapse:collapse;color:#e4e6ff;font-size:12px"><tr>'
      + ['순서', '매매법', '종목', '원래 신호', '주도테마(순위 · 언급)', '직전 상승(기간)', '눌림(기간)', '지금 고점 대비', '지지선', '이평 위치', '120·240일선 20봉', '신호일 종가(등락)', '매수가(시가)', '손절선', '결과', '수익', '보유일', '청산일·사유', '매수 뒤 최고', '매수 뒤 최저'].map(th).join('') + '</tr>';
    P.forEach(x => {
      const s = g(x, 'ps'), done = s === 'C' || s === 'H';
      html += tr([`${KS[g(x, 'k')]}${g(x, 'rk')}`, `<span style="color:${KC[g(x, 'k')]}">${KN[g(x, 'k')]}</span>`, nmEl(x, k), esc(g(x, 's')), esc(theme(x)),
        `${pct(g(x, 'ri'))} · ${g(x, 'rd')}일`, `${pct(g(x, 'dp') == null ? null : -g(x, 'dp'))} · ${g(x, 'dd')}일`, pct(g(x, 'cd') == null ? null : -g(x, 'cd')),
        esc(SUP[g(x, 'su')] || g(x, 'su')), esc(POS[g(x, 'po')] || g(x, 'po')), `${pct(g(x, 's120'))} / ${pct(g(x, 's240'))}`,
        `${won(g(x, 'pc'))} (${pct(g(x, 'chg'))})`, won(g(x, 'pb')), won(g(x, 'pl')), esc(ST[s] || s || '—'), done ? pct(g(x, 'pp'), 2) : '—', done ? g(x, 'pk') + '일' : '—',
        g(x, 'px') ? `${ymd(g(x, 'px'))} ${WHY[g(x, 'pw')] || ''}` : (s === 'H' ? '결과대기' + (g(x, 'lb') ? ` · ${md(g(x, 'lb'))}봉까지` : '') : '—'),
        g(x, 'pmx') != null ? pct(g(x, 'pmx')) : '—', g(x, 'pmn') != null ? pct(g(x, 'pmn')) : '—'], s === 'N' || s === 'U');
    });
    if (!P.length) html += tr(['—', '—', `<span style="color:${MUTED}">확인 신호 없음(관찰만)</span>`]);
    html += '</table></div>';
    const listTable = (rows, title, open) => {
      if (!rows.length) return '';
      let t = `<details${open ? ' open' : ''} style="margin-top:12px"><summary style="cursor:pointer">${title} ${rows.length}종목</summary><div style="overflow-x:auto"><table style="border-collapse:collapse;color:#e4e6ff;font-size:12px"><tr>`
        + ['매매법', '종목', '신호', '주도테마(순위 · 언급)', '직전 상승(기간)', '눌림(기간)', '지금 고점 대비', '지지선', '이평 위치', '120·240일선 20봉', '신호일 종가(등락)'].map(th).join('') + '</tr>';
      rows.forEach(x => {
        t += tr([`<span style="color:${KC[g(x, 'k')]}">${KN[g(x, 'k')]}</span>`, nmEl(x, k), esc(g(x, 's')), esc(theme(x)), `${pct(g(x, 'ri'))} · ${g(x, 'rd')}일`,
          `${pct(g(x, 'dp') == null ? null : -g(x, 'dp'))} · ${g(x, 'dd')}일`, pct(g(x, 'cd') == null ? null : -g(x, 'cd')), esc(SUP[g(x, 'su')] || g(x, 'su')),
          esc(POS[g(x, 'po')] || g(x, 'po')), `${pct(g(x, 's120'))} / ${pct(g(x, 's240'))}`, `${won(g(x, 'pc'))} (${pct(g(x, 'chg'))})`]);
      });
      return t + '</table></div></details>';
    };
    html += listTable(X, '확인 신호지만 그날 상위5 밖', false);
    html += listTable(O, '미확인 관찰(매수 신호 아님)', !P.length);
    body.insertAdjacentHTML('beforeend', html + '</section>');
    ov.style.display = 'flex';
    window.__배지복귀 = function () { window.openBestDetail(k); };
    return result;
  };
  if (typeof bestY !== 'undefined' && typeof window.renderBestCalendar === 'function') {
    try { window.renderBestCalendar(); } catch (e) { console.warn('어사이드50 다시 그리기 실패', e); }
  }
})();
