/* ㊻ 어사이드46 (2026-10-05 사용자 지시) = 골드타겟매매법 v2(Aside판 · G-L1-Q1-S-X0 · 진짜 우상향 + 주도주 + 골드타겟 셋업 눌림 타점) · 🏅 베스트 달력에 묶음을 더한다(기존 자료·함수는 그대로).
   스킬 /어사이드46 · 빌더 = 주도주\_베스트_어사이드46_빌드.py (→ 매매법\골드타겟매매법_Aside\gt2_달력.py · 잠긴 gt2_core·gt2_rules · 셋업 = v1 잠금 gt_core) · 자료 = dashboard/data/베스트_어사이드46(_과거).js
   한마디로: 유튜브 '골드타겟' 셋업 6개(A 120·240돌파 · B 정배열검색기 · C DMI+CCI · S MACD스윙 · D 몸통절반눌림 · E 상한가2일차) 중 하나 · 120·240일선 진짜 우상향
            · 월간 칸 20일 1번+ & 마지막 등장 5거래일 안(주도주) · 직전 눌림 바닥 ≥ 그날 20일선 · 일반 주식(스팩·우선주·리츠 제외) · 그날 시총 상위 100위 제외
            · 들고 있는 종목 제외 · 순서 = 월간 칸 많은 순 → 20일 고점에 가까운 순
   칸 = 명단일(신호일 다음 거래일) · 장중 돌파가(신호일 고가)를 넘으면 그 값에 삼(시가가 이미 위면 시가 · 위에서부터 최대 5 · 못 넘으면 안 삼) → +20% 지정가 익절
   · 손절 없음 · 20거래일째 종가 · 비용 0.35% · 결과는 규칙대로 샀다고 가정한 계산 · 관찰용 · 매수추천 아님
   감싸는 함수 = buildBestCell · renderBestMonthStrip · renderBestMeta · openBestDetail (어사이드42~45_뷰.js 와 같은 방식 · 그 뒤에 읽는다) */
(function () {
  'use strict';
  if (window.__aside46Installed) return;
  const originals = ['buildBestCell', 'renderBestMonthStrip', 'renderBestMeta', 'openBestDetail'];
  if (originals.some(n => typeof window[n] !== 'function')) { console.error('어사이드46: 베스트 달력 함수가 없습니다'); return; }
  window.__aside46Installed = true;
  const color = '#8c6bff', line = '#2e2360', BADGE = '㊻', SHOW = 6;
  const arch = () => window.어사이드46_ARCHIVE || {};
  const NM = () => window.어사이드46_NAMES || {};
  const I = {};
  (window.어사이드46_COLS || ['c', 'r', 'ap', 'dl', 'pc', 'chg', 'dd', 'st', 'tg', 'pd', 'pn', 'pm', 'q', 'b', 's', 'p', 'k', 'ed', 'w', 'mx', 'mn', 'lbar']).forEach((c, i) => { I[c] = i; });
  const g = (x, key) => x[I[key]];
  const esc = v => String(v == null ? '' : v).replace(/[&<>"']/g, ch => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[ch]));
  const pct = (v, dg) => v == null ? '—' : `<span style="color:${v >= 0 ? '#ff8a8a' : '#7ea6ff'}">${v >= 0 ? '+' : ''}${Number(v).toFixed(dg == null ? 1 : dg)}%</span>`;
  const won = v => v == null ? '—' : Number(v).toLocaleString('ko-KR', {maximumFractionDigits: 0});
  const ymd = s => { s = String(s || ''); return s.length === 8 ? `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6)}` : s; };
  const md = s => { s = String(s || ''); return s.length === 8 ? `${s.slice(4, 6)}/${s.slice(6)}` : s; };
  const name = x => (NM()[g(x, 'c')] || [g(x, 'c')])[0];
  const mkt = x => (NM()[g(x, 'c')] || ['', ''])[1];
  const SET = {A: 'A 120·240돌파', B: 'B 정배열검색기', C: 'C DMI+CCI', S: 'S MACD스윙', D: 'D 몸통절반눌림', E: 'E 상한가2일차'};
  const ST = {C: '확정', H: '결과대기', N: '안 삼(명단일 장중 돌파가 못 넘음)', Y: '안 삼(이미 들고 있는 종목)', F: '안 삼(그날 5종목 다 참)',
    Q: '매수 불가(명단일 거래 없음)', P: '예정(명단일 장중 돌파가 넘으면 그 값에 삼)', L: '봉 늦음(천프정 미수집 또는 거래정지)',
    S: '자료끊김(정지·폐지 의심)', X: '분할·병합 의심(성적 밖)'};
  const WHY = {1: '익절 +20%', 2: '손절', 3: '만기 20일'};
  const SHORT = {1: '익절', 2: '손절', 3: '만기'};
  const bought = x => ['C', 'H', 'S', 'X'].includes(g(x, 's'));
  const res = x => {
    const s = g(x, 's');
    if (s === 'C') return `${pct(g(x, 'p'))} <span style="color:#8487bd">${SHORT[g(x, 'w')] || ''}</span>`;
    if (s === 'H') return `<span style="color:#ffc454">대기 ${g(x, 'k')}일</span> ${pct(g(x, 'p'))}${g(x, 'lbar') ? ` <span style="color:#8487bd">${md(g(x, 'lbar'))}봉까지</span>` : ''}`;
    if (s === 'N') return `<span style="color:#8487bd">안 삼(돌파 못 함)</span>`;
    if (s === 'Y') return '<span style="color:#8487bd">보유 중</span>';
    if (s === 'F') return '<span style="color:#8487bd">5개 참</span>';
    if (s === 'P') return `<span style="color:#7ee8ff">예정 · ${won(g(x, 'tg'))} 넘으면 삼</span>`;
    if (s === 'Q') return '<span style="color:#8487bd">거래 없음</span>';
    if (s === 'L') return '<span style="color:#ffc454">봉 늦음</span>';
    if (s === 'S') return `<span style="color:#ffc454">자료끊김</span> ${pct(g(x, 'p'))}`;
    return `<span style="color:#8487bd">${ST[s] || s}</span>`;
  };
  const tipOf = x => `${g(x, 'r')}순위 · ${SET[g(x, 'st')] || g(x, 'st')} · 월간 칸 20일 ${g(x, 'ap')}번(마지막 ${g(x, 'dl')}일 전) · 신호일 종가 ${won(g(x, 'pc'))}(${g(x, 'chg')}%) · 20일 고점 대비 ${g(x, 'dd')}%`
    + ` · 직전 눌림 ${g(x, 'pd')}% · ${g(x, 'pn')}일 · 바닥 vs 20일선 ${g(x, 'pm')}% · 돌파가(신호일 고가) ${won(g(x, 'tg'))}${g(x, 'q') != null ? ' · 명단일 종가 ' + g(x, 'q') + '%' : ''}`
    + `${g(x, 'b') != null ? ' · 매수가 ' + won(g(x, 'b')) : ''} · ${ST[g(x, 's')] || ''}${g(x, 'ed') ? ' ' + md(g(x, 'ed')) + ' ' + (WHY[g(x, 'w')] || '') : ''}`
    + `${g(x, 'mx') != null ? ' · 매수 뒤(명단일 포함) 최고 ' + g(x, 'mx') + '% 최저 ' + g(x, 'mn') + '%' : ''}`;

  const oldCell = window.buildBestCell;
  window.buildBestCell = function (d, k, rec, other, dow) {
    let html = oldCell.apply(this, arguments);
    const row = arch()[k]; if (!row) return html;
    let layer;
    if (!row.n) {
      layer = `<div class="aside46-layer" style="border-top:1px dashed ${line};margin-top:4px;padding-top:2px;color:${color};font-size:9.5px;opacity:.6" title="${BADGE} 어사이드46(골드타겟매매법 v2) · 신호일 ${ymd(row.sd)} · 조건 맞는 주도주 눌림 셋업 없음 · 그날 진짜 우상향(대형주 제외) ${row.z}종목"><b>${BADGE}</b> 없음 · 우상향 ${row.z}</div>`;
    } else {
      const nb = row.a.filter(bought).length;
      layer = `<div class="aside46-layer" style="border-top:1px dashed ${line};margin-top:4px;padding-top:3px;color:${color};font-size:10px" title="${BADGE} 어사이드46(골드타겟매매법 v2 · 주도주 눌림 + 골드타겟 셋업) · 신호일 ${ymd(row.sd)} 장마감까지 보고 고름 · 이날 장중 돌파가 넘으면 그 값에 삼 · 후보 ${row.u} · 산 것 ${nb} · 눌러서 자세히"><b>${BADGE} 어사이드46</b> <span style="color:#8487bd">후보 ${row.u}${nb ? ' · 삼 ' + nb : ''}</span>`;
      row.a.slice(0, SHOW).forEach(x => {
        layer += `<div title="${esc(tipOf(x))}" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis${bought(x) ? '' : ';opacity:.7'}">${g(x, 'r')}. <b>${esc(name(x))}</b> <span style="color:#8487bd">${esc(g(x, 'st'))}</span> ${res(x)}</div>`;
      });
      if (row.a.length > SHOW) layer += `<div style="color:#8487bd">… 외 ${row.a.length - SHOW}</div>`;
      layer += '</div>';
    }
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
      if (n) { if (i + 1 !== bestM) btn.classList.add('has-data'); btn.title += ` · 어사이드46 ${n}종목`; }
    });
    return result;
  };

  const sline = T => T && T.n ? `${Number(T.n).toLocaleString('ko-KR')}건 평균 ${pct(T.rr, 2)} 중앙 ${pct(T.med, 2)} 이긴 ${T.win}% · 익절 ${T.tgt}% · 만기 ${T.exp}% · 평균손실 ${pct(T.loss, 1)}` : '—';
  const oldMeta = window.renderBestMeta;
  window.renderBestMeta = function () {
    const result = oldMeta.apply(this, arguments);
    const el = document.getElementById('best-meta'), m = window.어사이드46_META;
    if (!el) return result;
    if (!m) { el.innerHTML += '<br><span style="color:#ff9aaa">❌ 베스트_어사이드46.js 가 안 읽혔다 = 주도주\\_베스트_어사이드46_빌드.py 실행</span>'; return result; }
    const E = m.예정 || {}, W = m.주 || {}, Y = (m.연도 || []).find(r => typeof bestY !== 'undefined' && r.y === bestY);
    const pl = (E.종목 || []).map(x => `${x[0]}(돌파가 ${won(x[1])} 넘으면 그 값에 삼)`).join(', ');
    el.innerHTML += `<div class="aside46-meta" style="margin-top:5px;color:${color}"><b>${BADGE} 어사이드46</b>(골드타겟매매법 v2 · 진짜 우상향 + 주도주 + 골드타겟 셋업 눌림 · 돌파 매수 · 하루 최대 5) ${esc(m.첫칸)}~${esc(m.끝칸)} · ${Number(m.칸).toLocaleString('ko-KR')}칸 · 후보 ${Number(m.명단).toLocaleString('ko-KR')}(주 ${W.명단}) · 산 것 ${Number(m.체결).toLocaleString('ko-KR')}(${m.체결률}% · 주 ${W.체결}) · 빈 칸 ${m.빈칸}`
      + ` · 확정 ${sline(m.전체)} · 결과대기 ${m.결과대기}${m.봉늦음 ? ' · 봉 늦음 ' + m.봉늦음 : ''}`
      + (Y && Y.n ? ` · ${bestY}년 ${Y.n}건 평균 ${pct(Y.rr, 2)} 중앙 ${pct(Y.med, 2)}` : '')
      + `<br>${E.막힘 ? `<span style="color:#ffc454">${esc(E.막힘)}</span>` : (E.미래 ? `${ymd(E.명단일)} 8시 명단 = ${esc(pl) || '없음'}` : `마지막 칸 ${ymd(E.명단일)} = ${esc(pl) || '없음'}`)}`
      + (m.경고 ? ` · <span style="color:#ffc454">천프정 ${ymd(m.천프정)} 봉이 직전 5거래일 거래 종목 ${m.기준} 중 ${m.들어옴}만 들어옴</span>` : '')
      + `<br><span style="color:#ff9aaa">${esc(m.판정)}</span> · 학습(신호 2022-06~2024) ${sline(m.학습)} · 확인(2025) ${sline(m.확인)} · 시험(2026-01~08) ${sline(m.시험)} · 2026-09~ ${sline(m.이후)}`
      + ` · ${esc(m.대조)} · ${esc(m.재현)}`
      + `<br><span style="color:#8487bd">규칙 ${esc(m.규칙)} · 골드타겟 셋업 6개(유튜브 '골드타겟' 투자전략·검색기 영상 · v1 잠금 gt_core) · 진짜 우상향(120·240일선 60거래일 +3%↑ · 60>120>240 · 60일선 상승 · 종가 ≥ 240일선 · 1년 고가 ×0.75 위) · 일반 주식(스팩·우선주·리츠 제외) · 그날 시총 상위 100위 제외 · 종가 1,200원+ · 20일 대금 10억+ · 칸 = 명단일 · 장중 돌파가(신호일 고가) 넘으면 그 값에 삼(시가가 위면 시가 · 순서대로 최대 5 · 들고 있는 종목 제외) → +20% 지정가 · 손절 없음 · 20거래일 · 비용 0.35% · 상장폐지 종목까지 넣어 계산 · 월간 칸이 2022-06-02 부터라 그 앞 칸 없음 · 잠금 ${esc(m.잠금)} · 규칙 코드 ${esc(m.규칙코드)}</span></div>`;
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
    const prev = body.querySelector('[data-aside46-detail]'); if (prev) prev.remove();
    let html = `<section data-aside46-detail style="margin-top:20px;color:${color}"><h3 style="margin:0">${BADGE} 어사이드46 · 명단일 ${esc(k)} · 후보 ${row.u}종목 · 산 것 ${row.a.filter(bought).length} <span style="font-size:12px;color:#ff9aaa;font-weight:600">관찰용 · 매수추천 아님</span></h3>`
      + `<p style="color:#8487bd;font-size:12px;line-height:1.6;margin:6px 0">골드타겟매매법 v2 · 신호일 <b style="color:#c9cbe8">${ymd(row.sd)}</b> 장마감 자료 + 그날까지 월간 칸만 보고 고름 · 진짜 우상향 · 월간 칸 주도주(20일 1번+ & 5일 안) · 직전 눌림 바닥 ≥ 20일선 · 골드타겟 셋업<br>`
      + `<b style="color:#c9cbe8">결과는 규칙대로 샀다고 가정한 계산(실제 매매와 무관)</b> · 명단일 장중 돌파가(신호일 고가)를 넘으면 그 값에 삼(시가가 위면 시가 · 순서대로 최대 5 · 들고 있는 종목 제외) · +20% 지정가 익절(시가가 +20% 위면 시가) · 손절 없음 · 20거래일째 종가 · 비용 0.35%</p>`;
    html += `<div style="overflow-x:auto"><table style="border-collapse:collapse;color:#e4e6ff;font-size:12px"><tr>`;
    ['순서', '종목', '셋업', '월간 칸 20일', '신호일 종가(등락)', '20일 고점 대비', '직전 눌림(깊이·날수)', '눌림 바닥 vs 20일선', '돌파가(신호일 고가)', '명단일 종가', '매수가', '결과', '수익', '보유일', '청산일·사유', '매수 뒤 최고', '매수 뒤 최저'].forEach(t => html += `<th style="padding:5px 7px;border-bottom:1px solid ${line};color:#8487bd;white-space:nowrap;text-align:left">${t}</th>`);
    html += '</tr>';
    row.a.forEach(x => {
      const nmEl = `<span style="cursor:pointer;font-weight:bold;color:${color}" onclick="_openStock(this,function(){openBestDetail('${k}')})" data-code="${esc(g(x, 'c'))}" data-name="${esc(name(x))}" data-rate="0" data-amount="0" data-meta="㊻어사이드46 ${k}" data-catalyst="">${esc(name(x))}</span> <small style="color:#6b6e9c">${esc(g(x, 'c'))} ${esc(mkt(x))}</small>`;
      const s = g(x, 's'), done = s === 'C' || s === 'H' || s === 'S';
      const vals = [`${g(x, 'r')}/${row.u}`, nmEl, esc(SET[g(x, 'st')] || g(x, 'st')), `${g(x, 'ap')}번 · ${g(x, 'dl')}일 전`, `${won(g(x, 'pc'))} (${pct(g(x, 'chg'))})`, pct(g(x, 'dd')),
        `${pct(g(x, 'pd'))} · ${g(x, 'pn')}일`, pct(g(x, 'pm')), won(g(x, 'tg')), g(x, 'q') != null ? pct(g(x, 'q')) : '—', won(g(x, 'b')),
        ST[s] || s, done ? pct(g(x, 'p'), 2) : '—', done ? g(x, 'k') + '일' : '—', g(x, 'ed') ? `${ymd(g(x, 'ed'))} ${WHY[g(x, 'w')] || ''}` : (s === 'H' ? '결과대기' : '—'),
        g(x, 'mx') != null ? pct(g(x, 'mx')) : '—', g(x, 'mn') != null ? pct(g(x, 'mn')) : '—'];
      html += `<tr style="${bought(x) ? '' : 'opacity:.65'}">` + vals.map(v => `<td style="padding:5px 7px;border-bottom:1px solid #1e2a44;white-space:nowrap">${v}</td>`).join('') + '</tr>';
    });
    html += '</table></div>';
    body.insertAdjacentHTML('beforeend', html + '</section>');
    ov.style.display = 'flex';
    window.__배지복귀 = function () { window.openBestDetail(k); };
    return result;
  };
  if (typeof bestY !== 'undefined' && typeof window.renderBestCalendar === 'function') {
    try { window.renderBestCalendar(); } catch (e) { console.warn('어사이드46 다시 그리기 실패', e); }
  }
})();
