/* ㊵ 어사이드40 (2026-10-04 사용자 지시) = 우상향 주도주 v2 보완판(Aside판 · B-L1-M60-T0-EC-X1 · 종가 확인 매수) · 🏅 베스트 달력에 묶음을 더한다(기존 자료·함수는 그대로).
   스킬 /어사이드40 · 빌더 = 주도주\_베스트_어사이드40_빌드.py (→ 매매법\우상향주도눌림_Aside\ud2_달력.py · 잠긴 ud_core·ud_rules·ud2_rules·ud2_sim) · 자료 = dashboard/data/베스트_어사이드40(_과거).js
   한마디로: 일반 주식(스팩·우선주·리츠 제외) · 그날 시총 상위 100위 제외 · 120·240일선 진짜 우상향 · 월간 칸 20일 1번+ · 마지막 등장 5거래일 안 · 20일 고점 −3% 안 · 5일선 위
            · 일반 주식 등가지수 ≥ 60일선인 날만 · 월간 칸 20일 많은 순 → 20일 대금 순 하루 최대 5 · 같은 종목 5거래일 안 다시 안 뽑음
   칸 = 명단일(신호일 다음 거래일) · 그날 종가가 신호일 종가 이상이면 그 종가에 삼(아니면 안 삼) → +20% 지정가 익절(다음 날부터) · 종가 20일선 아래 손절 · 20거래일 · 비용 0.35%
   결과는 규칙대로 샀다고 가정한 계산 · 관찰용 · 매수추천 아님 · 감싸는 함수 = buildBestCell · renderBestMonthStrip · renderBestMeta · openBestDetail (어사이드39_뷰.js 와 같은 방식 · 그 뒤에 읽는다) */
(function () {
  'use strict';
  if (window.__aside40Installed) return;
  const originals = ['buildBestCell', 'renderBestMonthStrip', 'renderBestMeta', 'openBestDetail'];
  if (originals.some(n => typeof window[n] !== 'function')) { console.error('어사이드40: 베스트 달력 함수가 없습니다'); return; }
  window.__aside40Installed = true;
  const color = '#b388ff', line = '#3d2a66', BADGE = '㊵';
  const arch = () => window.어사이드40_ARCHIVE || {};
  const NM = () => window.어사이드40_NAMES || {};
  const I = {};
  (window.어사이드40_COLS || ['c', 'r', 'sec', 'ap', 'dl', 'pc', 'chg', 'dd', 'p5', 'p20', 'ru', 'a20', 'q', 'b', 's', 'p', 'k', 'ed', 'w', 'mx', 'mn', 'lb']).forEach((c, i) => { I[c] = i; });
  const g = (x, key) => x[I[key]];
  const esc = v => String(v == null ? '' : v).replace(/[&<>"']/g, ch => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[ch]));
  const pct = (v, dg) => v == null ? '—' : `<span style="color:${v >= 0 ? '#ff8a8a' : '#7ea6ff'}">${v >= 0 ? '+' : ''}${Number(v).toFixed(dg == null ? 1 : dg)}%</span>`;
  const won = v => v == null ? '—' : Number(v).toLocaleString('ko-KR', {maximumFractionDigits: 0});
  const ymd = s => { s = String(s || ''); return s.length === 8 ? `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6)}` : s; };
  const md = s => { s = String(s || ''); return s.length === 8 ? `${s.slice(4, 6)}/${s.slice(6)}` : s; };
  const name = x => (NM()[g(x, 'c')] || [g(x, 'c')])[0];
  const mkt = x => (NM()[g(x, 'c')] || ['', ''])[1];
  const ST = {C: '확정', H: '결과대기', N: '안 삼(명단일 종가가 신호일 종가 아래 = 확인 실패)', Q: '매수 불가(명단일 거래 없음)', P: '예정(명단일 종가 확인 전)',
    L: '봉 늦음(천프정 미수집 또는 거래정지)', S: '자료끊김(정지·폐지 의심)', X: '분할·병합 의심(성적 밖)'};
  const WHY = {1: '익절 +20%', 2: '손절(종가 20일선 아래)', 3: '만기 20일'};
  const SHORT = {1: '익절', 2: '손절', 3: '만기'};
  const res = x => {
    const s = g(x, 's');
    if (s === 'C') return `${pct(g(x, 'p'))} <span style="color:#8487bd">${SHORT[g(x, 'w')] || ''}</span>`;
    if (s === 'H') return `<span style="color:#ffc454">대기 ${g(x, 'k')}일</span> ${pct(g(x, 'p'))}${g(x, 'lb') ? ` <span style="color:#8487bd">${md(g(x, 'lb'))}봉까지</span>` : ''}`;
    if (s === 'N') return `<span style="color:#8487bd">안 삼${g(x, 'q') != null ? '(' + (g(x, 'q') >= 0 ? '+' : '') + g(x, 'q') + '%)' : ''}</span>`;
    if (s === 'P') return `<span style="color:#7ee8ff">예정 · 종가 ≥ ${won(g(x, 'pc'))}면 삼</span>`;
    if (s === 'Q') return '<span style="color:#8487bd">거래 없음</span>';
    if (s === 'L') return '<span style="color:#ffc454">봉 늦음</span>';
    if (s === 'S') return `<span style="color:#ffc454">자료끊김</span> ${pct(g(x, 'p'))}`;
    return `<span style="color:#8487bd">${ST[s] || s}</span>`;
  };
  const tipOf = x => `${g(x, 'r')}순위 · 업종 ${g(x, 'sec')} · 월간 칸 20일 ${g(x, 'ap')}번(마지막 ${g(x, 'dl')}일 전) · 신호일 종가 ${won(g(x, 'pc'))}(${g(x, 'chg')}%) · 20일 고점 대비 ${g(x, 'dd')}% · 5일선 대비 ${g(x, 'p5')}% · 20일선 대비 ${g(x, 'p20')}%`
    + ` · 60일 바닥에서 +${g(x, 'ru')}% · 20일 대금 ${won(g(x, 'a20'))}억${g(x, 'q') != null ? ' · 명단일 종가 ' + g(x, 'q') + '%' : ''}${g(x, 'b') != null ? ' · 체결가(명단일 종가) ' + won(g(x, 'b')) : ''}`
    + ` · ${ST[g(x, 's')] || ''}${g(x, 'ed') ? ' ' + md(g(x, 'ed')) + ' ' + (WHY[g(x, 'w')] || '') : ''}${g(x, 'mx') != null ? ' · 체결 뒤 최고 ' + g(x, 'mx') + '% 최저 ' + g(x, 'mn') + '%' : ''}`;

  const oldCell = window.buildBestCell;
  window.buildBestCell = function (d, k, rec, other, dow) {
    let html = oldCell.apply(this, arguments);
    const row = arch()[k]; if (!row) return html;
    let layer;
    if (!row.n) {
      const why = row.m === 0 ? `시장 쉼${row.z ? ' · 자리 ' + row.z : ''}` : (row.z ? `없음 · 자리 ${row.z}(최근 5일 안 뽑힘)` : '없음');
      layer = `<div class="aside40-layer" style="border-top:1px dashed ${line};margin-top:4px;padding-top:2px;color:${color};font-size:9.5px;opacity:.6" title="${BADGE} 어사이드40(우상향 주도주 v2) · 신호일 ${ymd(row.sd)} · ${row.m === 0 ? '일반 주식 등가지수가 60일선 아래 = 명단 안 냄' : '조건 맞는 종목 없음'}"><b>${BADGE}</b> ${why}</div>`;
    } else {
      layer = `<div class="aside40-layer" style="border-top:1px dashed ${line};margin-top:4px;padding-top:3px;color:${color};font-size:10px" title="${BADGE} 어사이드40(우상향 주도주 v2 보완판) · 신호일 ${ymd(row.sd)} 장마감까지 보고 고름 · 이날 종가가 신호일 종가 이상이면 그 종가에 삼 · 후보 ${row.u}종목 중 ${row.n} · 눌러서 자세히"><b>${BADGE} 어사이드40</b> <span style="color:#8487bd">후보 ${row.u}</span>`;
      row.a.forEach(x => {
        layer += `<div title="${esc(tipOf(x))}" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${g(x, 'r')}. <b>${esc(name(x))}</b> ${res(x)}</div>`;
      });
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
      if (n) { if (i + 1 !== bestM) btn.classList.add('has-data'); btn.title += ` · 어사이드40 ${n}종목`; }
    });
    return result;
  };

  const sline = T => T && T.n ? `${Number(T.n).toLocaleString('ko-KR')}건 평균 ${pct(T.rr, 2)} 중앙 ${pct(T.med, 2)} 이긴 ${T.win}% · 익절 ${T.tgt}% · 손절 ${T.stop}% · 평균손실 ${pct(T.loss, 1)}` : '—';
  const oldMeta = window.renderBestMeta;
  window.renderBestMeta = function () {
    const result = oldMeta.apply(this, arguments);
    const el = document.getElementById('best-meta'), m = window.어사이드40_META;
    if (!el) return result;
    if (!m) { el.innerHTML += '<br><span style="color:#ff9aaa">❌ 베스트_어사이드40.js 가 안 읽혔다 = 주도주\\_베스트_어사이드40_빌드.py 실행</span>'; return result; }
    const E = m.예정 || {}, W = m.주 || {}, Y = (m.연도 || []).find(r => typeof bestY !== 'undefined' && r.y === bestY);
    const pl = (E.종목 || []).map(x => `${x[0]}(${x[1]} · 종가 ≥ ${won(x[2])}면 삼)`).join(', ');
    el.innerHTML += `<div class="aside40-meta" style="margin-top:5px;color:${color}"><b>${BADGE} 어사이드40</b>(우상향 주도주 v2 보완판 · 종가 확인 매수 · 하루 최대 5) ${esc(m.첫칸)}~${esc(m.끝칸)} · ${Number(m.칸).toLocaleString('ko-KR')}칸 · 명단 ${Number(m.명단).toLocaleString('ko-KR')}(주 ${W.명단}) · 체결 ${Number(m.체결).toLocaleString('ko-KR')}(${m.체결률}% · 주 ${W.체결}) · 시장 쉼 ${m.시장쉼}칸`
      + ` · 확정 ${sline(m.전체)} · 결과대기 ${m.결과대기}${m.봉늦음 ? ' · 봉 늦음 ' + m.봉늦음 : ''}`
      + (Y && Y.n ? ` · ${bestY}년 ${Y.n}건 평균 ${pct(Y.rr, 2)} 중앙 ${pct(Y.med, 2)}` : '')
      + `<br>${E.막힘 ? `<span style="color:#ffc454">${esc(E.막힘)}</span>` : (E.미래 ? `${ymd(E.명단일)} 8시 명단 = ${esc(pl) || '없음'}` : `마지막 칸 ${ymd(E.명단일)} = ${esc(pl) || '없음'}`)}`
      + (m.경고 ? ` · <span style="color:#ffc454">천프정 ${ymd(m.천프정)} 봉이 직전 5거래일 거래 종목 ${m.기준} 중 ${m.들어옴}만 들어옴</span>` : '')
      + `<br><span style="color:#ff9aaa">${esc(m.판정)}</span> · 학습(신호 2022-06~2024) ${sline(m.학습)} · 확인(2025~2026-08) ${sline(m.확인)} · 2026-09~ ${sline(m.이후)}`
      + ` · ${esc(m.대조)} · ${esc(m.재현)}`
      + `<br><span style="color:#8487bd">규칙 ${esc(m.규칙)} · 일반 주식(스팩·우선주·리츠 제외) · 그날 시총 상위 100위 제외 · 진짜 우상향(120·240일선 60거래일 +3%↑ · 60>120>240 · 60일선 상승 · 종가 ≥ 240일선 · 1년 고가 ×0.75 위) · 종가 1,000원+ · 20일 대금 10억+ · 하루 최대 5(월간 칸 20일 많은 순 → 20일 대금) · 같은 종목 5거래일 안 다시 안 뽑음 · 칸 = 명단일 · 그날 종가 ≥ 신호일 종가면 그 종가에 삼 → +20% 지정가 익절(다음 날부터) · 종가 20일선 아래 손절 · 20거래일 · 비용 0.35% · 지금 상장 종목만이라 생존편향 · 잠금 ${esc(m.잠금)} · 규칙 코드 ${esc(m.규칙코드)}</span></div>`;
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
    const prev = body.querySelector('[data-aside40-detail]'); if (prev) prev.remove();
    let html = `<section data-aside40-detail style="margin-top:20px;color:${color}"><h3 style="margin:0">${BADGE} 어사이드40 · 명단일 ${esc(k)} · 후보 ${row.u}종목 중 ${row.n} <span style="font-size:12px;color:#ff9aaa;font-weight:600">관찰용 · 매수추천 아님</span></h3>`
      + `<p style="color:#8487bd;font-size:12px;line-height:1.6;margin:6px 0">우상향 주도주 v2 보완판 · 신호일 <b style="color:#c9cbe8">${ymd(row.sd)}</b> 장마감 자료 + 그날까지 월간 칸만 보고 고름 · 20일 고점 −3% 안 · 5일선 위 · 월간 칸 20일 1번+ · 등가지수 ≥ 60일선<br>`
      + `<b style="color:#c9cbe8">결과는 규칙대로 샀다고 가정한 계산(실제 매매와 무관)</b> · 명단일 종가가 신호일 종가 이상이면 그 종가에 삼(아니면 안 삼) · +20% 지정가 익절(다음 날부터 · 시가가 +20% 위면 시가) · 종가가 20일선 아래면 그 종가 손절 · 체결일 포함 20거래일 · 비용 0.35%</p>`;
    html += `<div style="overflow-x:auto"><table style="border-collapse:collapse;color:#e4e6ff;font-size:12px"><tr>`;
    ['순위', '종목', '업종', '월간 칸 20일', '신호일 종가(등락)', '20일 고점 대비', '5선 · 20선 대비', '60일 바닥에서', '20일 대금(억)', '명단일 종가', '체결가', '결과', '수익', '보유일', '청산일·사유', '체결 뒤 최고', '체결 뒤 최저'].forEach(t => html += `<th style="padding:5px 7px;border-bottom:1px solid ${line};color:#8487bd;white-space:nowrap;text-align:left">${t}</th>`);
    html += '</tr>';
    row.a.forEach(x => {
      const nmEl = `<span style="cursor:pointer;font-weight:bold;color:${color}" onclick="_openStock(this,function(){openBestDetail('${k}')})" data-code="${esc(g(x, 'c'))}" data-name="${esc(name(x))}" data-rate="0" data-amount="0" data-meta="㊵어사이드40 ${k}" data-catalyst="">${esc(name(x))}</span> <small style="color:#6b6e9c">${esc(g(x, 'c'))} ${esc(mkt(x))}</small>`;
      const s = g(x, 's'), done = s === 'C' || s === 'H' || s === 'S';
      const vals = [`${g(x, 'r')}/${row.u}`, nmEl, esc(g(x, 'sec')), `${g(x, 'ap')}번 · ${g(x, 'dl')}일 전`, `${won(g(x, 'pc'))} (${pct(g(x, 'chg'))})`, pct(g(x, 'dd')),
        `${pct(g(x, 'p5'))} · ${pct(g(x, 'p20'))}`, pct(g(x, 'ru'), 0), won(g(x, 'a20')), g(x, 'q') != null ? pct(g(x, 'q')) : '—', won(g(x, 'b')),
        ST[s] || s, done ? pct(g(x, 'p'), 2) : '—', done ? g(x, 'k') + '일' : '—', g(x, 'ed') ? `${ymd(g(x, 'ed'))} ${WHY[g(x, 'w')] || ''}` : (s === 'H' ? '결과대기' : '—'),
        g(x, 'mx') != null ? pct(g(x, 'mx')) : '—', g(x, 'mn') != null ? pct(g(x, 'mn')) : '—'];
      html += `<tr style="${s === 'N' || s === 'Q' ? 'opacity:.65' : ''}">` + vals.map(v => `<td style="padding:5px 7px;border-bottom:1px solid #1e2a44;white-space:nowrap">${v}</td>`).join('') + '</tr>';
    });
    html += '</table></div>';
    body.insertAdjacentHTML('beforeend', html + '</section>');
    ov.style.display = 'flex';
    window.__배지복귀 = function () { window.openBestDetail(k); };
    return result;
  };
  if (typeof bestY !== 'undefined' && typeof window.renderBestCalendar === 'function') {
    try { window.renderBestCalendar(); } catch (e) { console.warn('어사이드40 다시 그리기 실패', e); }
  }
})();
