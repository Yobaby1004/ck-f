/* ㊷ 어사이드42 (2026-10-05 사용자 지시) = 매수타점매매법 v3(Aside판 · L1-Q1-AB-M0-XB · 주도주 + 진짜 우상향 + 도지 박스 타점) · 🏅 베스트 달력에 묶음을 더한다(기존 자료·함수는 그대로).
   스킬 /어사이드42 · 빌더 = 주도주\_베스트_어사이드42_빌드.py (→ 매매법\매수타점매매법_Aside\mt3_달력.py · 잠긴 mt3_core·mt3_rules) · 자료 = dashboard/data/베스트_어사이드42(_과거).js
   한마디로: 영상 검색기 도지 박스(장대봉 ±7% 뒤 ±3% 도지 1~3개) · 120·240일선 진짜 우상향 · 월간 칸 20일 1번+ & 마지막 등장 5거래일 안 · 박스 최저가 ≥ 10일선
            · 일반 주식(스팩·우선주·리츠 제외) · 그날 시총 상위 100위 제외 · 들고 있는 종목 제외 · 순서 = 월간 칸 많은 순 → 20일 고점에 가까운 순
   칸 = 명단일(신호일 다음 거래일) · 15:20 값이 트리거(어제 고가 · 의심봉이면 그 봉 고가) 위 + 양봉이면 종가에 삼(위에서부터 최대 5) → +20% 지정가 익절(다음 날부터)
   · 종가 < 도지 박스 최저가 손절 · 20거래일 · 비용 0.35% · 결과는 규칙대로 샀다고 가정한 계산 · 관찰용 · 매수추천 아님
   감싸는 함수 = buildBestCell · renderBestMonthStrip · renderBestMeta · openBestDetail (어사이드40·41_뷰.js 와 같은 방식 · 그 뒤에 읽는다) */
(function () {
  'use strict';
  if (window.__aside42Installed) return;
  const originals = ['buildBestCell', 'renderBestMonthStrip', 'renderBestMeta', 'openBestDetail'];
  if (originals.some(n => typeof window[n] !== 'function')) { console.error('어사이드42: 베스트 달력 함수가 없습니다'); return; }
  window.__aside42Installed = true;
  const color = '#1de9b6', line = '#0d4a3e', BADGE = '㊷', SHOW = 6;
  const arch = () => window.어사이드42_ARCHIVE || {};
  const NM = () => window.어사이드42_NAMES || {};
  const I = {};
  (window.어사이드42_COLS || ['c', 'r', 'ap', 'dl', 'pc', 'chg', 'dd', 'tg', 'bx', 'lb', 'lg', 'q', 'b', 's', 'p', 'k', 'ed', 'w', 'mx', 'mn', 'lbar']).forEach((c, i) => { I[c] = i; });
  const g = (x, key) => x[I[key]];
  const esc = v => String(v == null ? '' : v).replace(/[&<>"']/g, ch => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[ch]));
  const pct = (v, dg) => v == null ? '—' : `<span style="color:${v >= 0 ? '#ff8a8a' : '#7ea6ff'}">${v >= 0 ? '+' : ''}${Number(v).toFixed(dg == null ? 1 : dg)}%</span>`;
  const won = v => v == null ? '—' : Number(v).toLocaleString('ko-KR', {maximumFractionDigits: 0});
  const ymd = s => { s = String(s || ''); return s.length === 8 ? `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6)}` : s; };
  const md = s => { s = String(s || ''); return s.length === 8 ? `${s.slice(4, 6)}/${s.slice(6)}` : s; };
  const name = x => (NM()[g(x, 'c')] || [g(x, 'c')])[0];
  const mkt = x => (NM()[g(x, 'c')] || ['', ''])[1];
  const ST = {C: '확정', H: '결과대기', N: '안 삼(15:20 트리거 아래 · 음봉 · 상한가 마감 = 확인 실패)', Y: '안 삼(이미 들고 있는 종목)', F: '안 삼(그날 5종목 다 참)',
    Q: '매수 불가(명단일 거래 없음)', P: '예정(명단일 15:20 확인 전 = 트리거 위 + 양봉이면 종가에 삼)', L: '봉 늦음(천프정 미수집 또는 거래정지)',
    S: '자료끊김(정지·폐지 의심)', X: '분할·병합 의심(성적 밖)'};
  const WHY = {1: '익절 +20%', 2: '손절(종가 < 박스 최저가)', 3: '만기 20일'};
  const SHORT = {1: '익절', 2: '손절', 3: '만기'};
  const bought = x => ['C', 'H', 'S', 'X'].includes(g(x, 's'));
  const res = x => {
    const s = g(x, 's');
    if (s === 'C') return `${pct(g(x, 'p'))} <span style="color:#8487bd">${SHORT[g(x, 'w')] || ''}</span>`;
    if (s === 'H') return `<span style="color:#ffc454">대기 ${g(x, 'k')}일</span> ${pct(g(x, 'p'))}${g(x, 'lbar') ? ` <span style="color:#8487bd">${md(g(x, 'lbar'))}봉까지</span>` : ''}`;
    if (s === 'N') return `<span style="color:#8487bd">안 삼${g(x, 'q') != null ? '(' + (g(x, 'q') >= 0 ? '+' : '') + g(x, 'q') + '%)' : ''}</span>`;
    if (s === 'Y') return '<span style="color:#8487bd">보유 중</span>';
    if (s === 'F') return '<span style="color:#8487bd">5개 참</span>';
    if (s === 'P') return `<span style="color:#7ee8ff">예정 · ${won(g(x, 'tg'))} 위 양봉이면 삼</span>`;
    if (s === 'Q') return '<span style="color:#8487bd">거래 없음</span>';
    if (s === 'L') return '<span style="color:#ffc454">봉 늦음</span>';
    if (s === 'S') return `<span style="color:#ffc454">자료끊김</span> ${pct(g(x, 'p'))}`;
    return `<span style="color:#8487bd">${ST[s] || s}</span>`;
  };
  const tipOf = x => `${g(x, 'r')}순위 · 월간 칸 20일 ${g(x, 'ap')}번(마지막 ${g(x, 'dl')}일 전) · 신호일 종가 ${won(g(x, 'pc'))}(${g(x, 'chg')}%) · 20일 고점 대비 ${g(x, 'dd')}%`
    + ` · 트리거(어제 고가) ${won(g(x, 'tg'))} · 박스 최저(손절선) ${won(g(x, 'bx'))} · 장대봉 ${g(x, 'lb')}%(${g(x, 'lg')}봉전)${g(x, 'q') != null ? ' · 명단일 종가 ' + g(x, 'q') + '%' : ''}`
    + `${g(x, 'b') != null ? ' · 매수가(명단일 종가) ' + won(g(x, 'b')) : ''} · ${ST[g(x, 's')] || ''}${g(x, 'ed') ? ' ' + md(g(x, 'ed')) + ' ' + (WHY[g(x, 'w')] || '') : ''}`
    + `${g(x, 'mx') != null ? ' · 매수 뒤 최고 ' + g(x, 'mx') + '% 최저 ' + g(x, 'mn') + '%' : ''}`;

  const oldCell = window.buildBestCell;
  window.buildBestCell = function (d, k, rec, other, dow) {
    let html = oldCell.apply(this, arguments);
    const row = arch()[k]; if (!row) return html;
    let layer;
    if (!row.n) {
      layer = `<div class="aside42-layer" style="border-top:1px dashed ${line};margin-top:4px;padding-top:2px;color:${color};font-size:9.5px;opacity:.6" title="${BADGE} 어사이드42(매수타점매매법 v3) · 신호일 ${ymd(row.sd)} · 조건 맞는 도지 박스 없음 · 그날 진짜 우상향(대형주 제외) ${row.z}종목"><b>${BADGE}</b> 없음 · 우상향 ${row.z}</div>`;
    } else {
      const nb = row.a.filter(bought).length;
      layer = `<div class="aside42-layer" style="border-top:1px dashed ${line};margin-top:4px;padding-top:3px;color:${color};font-size:10px" title="${BADGE} 어사이드42(매수타점매매법 v3 · 주도주 도지 박스) · 신호일 ${ymd(row.sd)} 장마감까지 보고 고름 · 이날 15:20 트리거 위 + 양봉이면 종가에 삼 · 후보 ${row.u} · 산 것 ${nb} · 눌러서 자세히"><b>${BADGE} 어사이드42</b> <span style="color:#8487bd">후보 ${row.u}${nb ? ' · 삼 ' + nb : ''}</span>`;
      row.a.slice(0, SHOW).forEach(x => {
        layer += `<div title="${esc(tipOf(x))}" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis${bought(x) ? '' : ';opacity:.7'}">${g(x, 'r')}. <b>${esc(name(x))}</b> ${res(x)}</div>`;
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
      if (n) { if (i + 1 !== bestM) btn.classList.add('has-data'); btn.title += ` · 어사이드42 ${n}종목`; }
    });
    return result;
  };

  const sline = T => T && T.n ? `${Number(T.n).toLocaleString('ko-KR')}건 평균 ${pct(T.rr, 2)} 중앙 ${pct(T.med, 2)} 이긴 ${T.win}% · 익절 ${T.tgt}% · 손절 ${T.stop}% · 평균손실 ${pct(T.loss, 1)}` : '—';
  const oldMeta = window.renderBestMeta;
  window.renderBestMeta = function () {
    const result = oldMeta.apply(this, arguments);
    const el = document.getElementById('best-meta'), m = window.어사이드42_META;
    if (!el) return result;
    if (!m) { el.innerHTML += '<br><span style="color:#ff9aaa">❌ 베스트_어사이드42.js 가 안 읽혔다 = 주도주\\_베스트_어사이드42_빌드.py 실행</span>'; return result; }
    const E = m.예정 || {}, W = m.주 || {}, Y = (m.연도 || []).find(r => typeof bestY !== 'undefined' && r.y === bestY);
    const pl = (E.종목 || []).map(x => `${x[0]}(트리거 ${won(x[1])} 위 + 양봉이면 종가에 삼)`).join(', ');
    el.innerHTML += `<div class="aside42-meta" style="margin-top:5px;color:${color}"><b>${BADGE} 어사이드42</b>(매수타점매매법 v3 · 주도주 + 진짜 우상향 + 도지 박스 · 종가확인 매수 · 하루 최대 5) ${esc(m.첫칸)}~${esc(m.끝칸)} · ${Number(m.칸).toLocaleString('ko-KR')}칸 · 후보 ${Number(m.명단).toLocaleString('ko-KR')}(주 ${W.명단}) · 산 것 ${Number(m.체결).toLocaleString('ko-KR')}(${m.체결률}% · 주 ${W.체결}) · 빈 칸 ${m.빈칸}`
      + ` · 확정 ${sline(m.전체)} · 결과대기 ${m.결과대기}${m.봉늦음 ? ' · 봉 늦음 ' + m.봉늦음 : ''}`
      + (Y && Y.n ? ` · ${bestY}년 ${Y.n}건 평균 ${pct(Y.rr, 2)} 중앙 ${pct(Y.med, 2)}` : '')
      + `<br>${E.막힘 ? `<span style="color:#ffc454">${esc(E.막힘)}</span>` : (E.미래 ? `${ymd(E.명단일)} 8시 명단 = ${esc(pl) || '없음'}` : `마지막 칸 ${ymd(E.명단일)} = ${esc(pl) || '없음'}`)}`
      + (m.경고 ? ` · <span style="color:#ffc454">천프정 ${ymd(m.천프정)} 봉이 직전 5거래일 거래 종목 ${m.기준} 중 ${m.들어옴}만 들어옴</span>` : '')
      + `<br><span style="color:#ff9aaa">${esc(m.판정)}</span> · 학습(신호 2022-06~2024) ${sline(m.학습)} · 확인(2025) ${sline(m.확인)} · 시험(2026-01~08) ${sline(m.시험)} · 2026-09~ ${sline(m.이후)}`
      + ` · ${esc(m.대조)} · ${esc(m.재현)}`
      + `<br><span style="color:#8487bd">규칙 ${esc(m.규칙)} · 영상 검색기 도지 박스(장대봉 시가 대비 ±7% 뒤 ±3% 도지·단봉 1~3개 · 1봉전 거래량 − 장대봉 거래량 ≤ 10만주) · 진짜 우상향(120·240일선 60거래일 +3%↑ · 60>120>240 · 60일선 상승 · 종가 ≥ 240일선 · 1년 고가 ×0.75 위) · 일반 주식(스팩·우선주·리츠 제외) · 그날 시총 상위 100위 제외 · 종가 1,000원+ · 20일 대금 10억+ · 칸 = 명단일 · 15:20 트리거 위 + 양봉이면 종가에 삼(순서대로 최대 5 · 들고 있는 종목 제외) → +20% 지정가 익절(다음 날부터) · 종가 < 박스 최저가 손절 · 20거래일 · 비용 0.35% · 상장폐지 종목까지 넣어 계산 · 잠금 ${esc(m.잠금)} · 규칙 코드 ${esc(m.규칙코드)}</span></div>`;
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
    const prev = body.querySelector('[data-aside42-detail]'); if (prev) prev.remove();
    let html = `<section data-aside42-detail style="margin-top:20px;color:${color}"><h3 style="margin:0">${BADGE} 어사이드42 · 명단일 ${esc(k)} · 후보 ${row.u}종목 · 산 것 ${row.a.filter(bought).length} <span style="font-size:12px;color:#ff9aaa;font-weight:600">관찰용 · 매수추천 아님</span></h3>`
      + `<p style="color:#8487bd;font-size:12px;line-height:1.6;margin:6px 0">매수타점매매법 v3 · 신호일 <b style="color:#c9cbe8">${ymd(row.sd)}</b> 장마감 자료 + 그날까지 월간 칸만 보고 고름 · 도지 박스 · 진짜 우상향 · 월간 칸 주도주 · 박스 최저가 ≥ 10일선<br>`
      + `<b style="color:#c9cbe8">결과는 규칙대로 샀다고 가정한 계산(실제 매매와 무관)</b> · 명단일 15:20 값이 트리거(어제 고가) 위 + 양봉이면 종가에 삼(순서대로 최대 5 · 들고 있는 종목 제외) · +20% 지정가 익절(다음 날부터 · 시가가 +20% 위면 시가) · 종가가 도지 박스 최저가 아래면 그 종가 손절 · 20거래일 · 비용 0.35%</p>`;
    html += `<div style="overflow-x:auto"><table style="border-collapse:collapse;color:#e4e6ff;font-size:12px"><tr>`;
    ['순서', '종목', '월간 칸 20일', '신호일 종가(등락)', '20일 고점 대비', '트리거(어제 고가)', '박스 최저(손절선)', '장대봉', '명단일 종가', '매수가', '결과', '수익', '보유일', '청산일·사유', '매수 뒤 최고', '매수 뒤 최저'].forEach(t => html += `<th style="padding:5px 7px;border-bottom:1px solid ${line};color:#8487bd;white-space:nowrap;text-align:left">${t}</th>`);
    html += '</tr>';
    row.a.forEach(x => {
      const nmEl = `<span style="cursor:pointer;font-weight:bold;color:${color}" onclick="_openStock(this,function(){openBestDetail('${k}')})" data-code="${esc(g(x, 'c'))}" data-name="${esc(name(x))}" data-rate="0" data-amount="0" data-meta="㊷어사이드42 ${k}" data-catalyst="">${esc(name(x))}</span> <small style="color:#6b6e9c">${esc(g(x, 'c'))} ${esc(mkt(x))}</small>`;
      const s = g(x, 's'), done = s === 'C' || s === 'H' || s === 'S';
      const vals = [`${g(x, 'r')}/${row.u}`, nmEl, `${g(x, 'ap')}번 · ${g(x, 'dl')}일 전`, `${won(g(x, 'pc'))} (${pct(g(x, 'chg'))})`, pct(g(x, 'dd')), won(g(x, 'tg')), won(g(x, 'bx')),
        `${pct(g(x, 'lb'))} · ${g(x, 'lg')}봉전`, g(x, 'q') != null ? pct(g(x, 'q')) : '—', won(g(x, 'b')),
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
    try { window.renderBestCalendar(); } catch (e) { console.warn('어사이드42 다시 그리기 실패', e); }
  }
})();
