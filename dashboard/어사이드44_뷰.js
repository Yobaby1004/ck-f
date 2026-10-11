/* ㊹ 어사이드44 (2026-10-05 사용자 지시) = 부자매매법 v3.2(Aside판 · 합의판 + ★1등 판 · 진짜 우상향 + 대체 주도주 + 부자 셋업) · 🏅 베스트 달력에 묶음을 더한다(기존 자료·함수는 그대로).
   스킬 /어사이드44 · 빌더 = 주도주\_베스트_어사이드44_빌드.py (→ 매매법\부자매매법_Aside\bj32_달력.py · 잠긴 bj32_core·bj32_rules) · 자료 = dashboard/data/베스트_어사이드44(_과거).js
   한마디로: 120·240일선 진짜 우상향 종목 중 '대체 주도주'(최근 20일 +7%·+10% 이상 & 그날 거래대금 200위 안 날이 있음)와 부자 셋업(5일선 재돌파 · 정배열 전환 · 하락 종언기 · 피봇 돌파 · 20일 신고가)을
            자격 상위 10판의 고르기 조합 8개 중 2개 이상이 같이 고른 종목(합의판) · ★ = 1등 판(A2-Q1-M0-N0 = 5일선 재돌파 + 강한 대체 주도주)도 고른 종목
            · 일반 주식(스팩·우선주·리츠 제외) · 그날 시총 상위 100위 제외 · 종가 1,500원+ · 들고 있는 종목 제외 · 순서 = 대체 주도주 20일 등장 많은 순 → 20일 고점에 가까운 순
   칸 = 명단일(신호일 다음 거래일) · 시가에 삼(위에서부터 최대 5) → 장중 -10% 손절 주문 · +20% 지정가 익절 · 20거래일 · 비용 0.35% · 결과는 규칙대로 샀다고 가정한 계산 · 관찰용 · 매수추천 아님
   x=1 칸 = 확장(신호 2003~2015 · 규칙 고를 때 안 본 앞 구간 · 시장 20일선 2013-03 앞 다시 계산 · 시총 100위 2014 앞 근사)
   감싸는 함수 = buildBestCell · renderBestMonthStrip · renderBestMeta · openBestDetail (어사이드40~43_뷰.js 와 같은 방식 · 그 뒤에 읽는다) */
(function () {
  'use strict';
  if (window.__aside44Installed) return;
  const originals = ['buildBestCell', 'renderBestMonthStrip', 'renderBestMeta', 'openBestDetail'];
  if (originals.some(n => typeof window[n] !== 'function')) { console.error('어사이드44: 베스트 달력 함수가 없습니다'); return; }
  window.__aside44Installed = true;
  const color = '#ffd700', line = '#5c4b00', BADGE = '㊹', SHOW = 6;
  const arch = () => window.어사이드44_ARCHIVE || {};
  const NM = () => window.어사이드44_NAMES || {};
  const I = {};
  (window.어사이드44_COLS || ['c', 'r', 's1', 'st', 'p7', 'p10', 'ns', 'mk', 'pc', 'chg', 'dd', 'at', 'b', 's', 'p', 'k', 'ed', 'w', 'mx', 'mn', 'lbar']).forEach((c, i) => { I[c] = i; });
  const g = (x, key) => x[I[key]];
  const esc = v => String(v == null ? '' : v).replace(/[&<>"']/g, ch => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[ch]));
  const pct = (v, dg) => v == null ? '—' : `<span style="color:${v >= 0 ? '#ff8a8a' : '#7ea6ff'}">${v >= 0 ? '+' : ''}${Number(v).toFixed(dg == null ? 1 : dg)}%</span>`;
  const won = v => v == null ? '—' : Number(v).toLocaleString('ko-KR', {maximumFractionDigits: 0});
  const ymd = s => { s = String(s || ''); return s.length === 8 ? `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6)}` : s; };
  const md = s => { s = String(s || ''); return s.length === 8 ? `${s.slice(4, 6)}/${s.slice(6)}` : s; };
  const name = x => (NM()[g(x, 'c')] || [g(x, 'c')])[0];
  const mkt = x => (NM()[g(x, 'c')] || ['', ''])[1];
  const STN = {A1: '정배열 전환', A2: '5일선 재돌파', A5: '하락 종언기', B: '피봇 돌파', NH: '20일 신고가', '': '셋업 없음(주도 우상향)'};
  const ST = {C: '확정', H: '결과대기', Y: '안 삼(이미 들고 있는 종목)', F: '안 삼(그날 5종목 다 참)', N: '안 삼',
    Q: '못 삼(명단일 거래 없음 · 시가가 신호일 종가 +29.5% 이상)', P: '예정(명단일 시가에 삼 · 위에서부터 최대 5 · 들고 있는 종목 제외)',
    L: '봉 늦음(천프정 미수집 또는 거래정지)', S: '자료끊김(정지·폐지 의심)', X: '분할·병합 의심(성적 밖)'};
  const WHY = {1: '익절 +20%', 2: '손절(장중 -10%)', 3: '만기 20일'};
  const SHORT = {1: '익절', 2: '손절', 3: '만기'};
  const bought = x => ['C', 'H', 'S', 'X'].includes(g(x, 's'));
  const star = x => g(x, 's1') ? '<span style="color:#fff59d" title="1등 판(5일선 재돌파 + 강한 대체 주도주)도 고른 종목">★</span>' : '';
  const res = x => {
    const s = g(x, 's');
    if (s === 'C') return `${pct(g(x, 'p'))} <span style="color:#8487bd">${SHORT[g(x, 'w')] || ''}</span>`;
    if (s === 'H') return `<span style="color:#ffc454">대기 ${g(x, 'k')}일</span> ${pct(g(x, 'p'))}${g(x, 'lbar') ? ` <span style="color:#8487bd">${md(g(x, 'lbar'))}봉까지</span>` : ''}`;
    if (s === 'Y') return '<span style="color:#8487bd">보유 중</span>';
    if (s === 'F') return '<span style="color:#8487bd">5개 참</span>';
    if (s === 'P') return '<span style="color:#7ee8ff">예정 · 시가에 삼</span>';
    if (s === 'Q') return '<span style="color:#8487bd">못 삼</span>';
    if (s === 'L') return '<span style="color:#ffc454">봉 늦음</span>';
    if (s === 'S') return `<span style="color:#ffc454">자료끊김</span> ${pct(g(x, 'p'))}`;
    return `<span style="color:#8487bd">${ST[s] || s}</span>`;
  };
  const tipOf = x => `${g(x, 'r')}순위${g(x, 's1') ? ' · ★1등 판도 고름' : ''} · 셋업 ${STN[g(x, 'st')] || g(x, 'st')} · 대체 주도주(+7%·대금 200위) 20일 ${g(x, 'p7')}번 · 강한 대체 주도주(+10%) ${g(x, 'p10')}번`
    + ` · 정답지 급등(+20~35%) 20일 ${g(x, 'ns')}번 · 시장 ${g(x, 'mk') ? '20일선 위' : '20일선 아래'} · 신호일 종가 ${won(g(x, 'pc'))}(${g(x, 'chg')}%) · 20일 고점 대비 ${g(x, 'dd')}% · 흔들림(20일 평균 진폭) ${g(x, 'at')}%`
    + `${g(x, 'b') != null ? ' · 매수가(명단일 시가) ' + won(g(x, 'b')) + ' · 손절가(-10%) ' + won(g(x, 'b') * 0.9) + ' · 목표(+20%) ' + won(g(x, 'b') * 1.2) : ''} · ${ST[g(x, 's')] || ''}`
    + `${g(x, 'ed') ? ' ' + md(g(x, 'ed')) + ' ' + (WHY[g(x, 'w')] || '') : ''}${g(x, 'mx') != null ? ' · 매수 뒤 최고 ' + g(x, 'mx') + '% 최저 ' + g(x, 'mn') + '%' : ''}`;

  const oldCell = window.buildBestCell;
  window.buildBestCell = function (d, k, rec, other, dow) {
    let html = oldCell.apply(this, arguments);
    const row = arch()[k]; if (!row) return html;
    const ext = row.x ? ' · 확장 구간(규칙 고를 때 안 본 앞 구간 · 시총·시장 근사)' : '';
    let layer;
    if (!row.u) {
      layer = `<div class="aside44-layer" style="border-top:1px dashed ${line};margin-top:4px;padding-top:2px;color:${color};font-size:9.5px;opacity:.6" title="${BADGE} 어사이드44(부자매매법 v3.2 합의판) · 신호일 ${ymd(row.sd)} · 조건 맞는 종목 없음 · 그날 진짜 우상향(대형주 제외) ${row.z}종목${ext}"><b>${BADGE}</b> 없음 · 우상향 ${row.z}</div>`;
    } else {
      const nb = row.a.filter(bought).length;
      layer = `<div class="aside44-layer" style="border-top:1px dashed ${line};margin-top:4px;padding-top:3px;color:${color};font-size:10px" title="${BADGE} 어사이드44(부자매매법 v3.2 · 합의판 · ★ = 1등 판도 고름) · 신호일 ${ymd(row.sd)} 장마감까지 보고 고름 · 이날 시가에 삼(최대 5) · 후보 ${row.u} · 산 것 ${nb}${ext} · 눌러서 자세히"><b>${BADGE} 어사이드44</b> <span style="color:#8487bd">후보 ${row.u}${nb ? ' · 삼 ' + nb : ''}${row.x ? ' · 확장' : ''}</span>`;
      row.a.slice(0, SHOW).forEach(x => {
        layer += `<div title="${esc(tipOf(x))}" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis${bought(x) ? '' : ';opacity:.7'}">${g(x, 'r')}. ${star(x)}<b>${esc(name(x))}</b> ${res(x)}</div>`;
      });
      if (row.u > SHOW) layer += `<div style="color:#8487bd">… 외 ${row.u - Math.min(SHOW, row.a.length)}</div>`;
      layer += '</div>';
    }
    if (!html.match(/^<div[^>]*\bhas-data\b/) && row.u) html = html.replace('class="cal-cell', 'class="cal-cell has-data');
    if (!html.match(/^<div[^>]*\bonclick=/) && row.u) html = html.replace('data-date="' + k + '"', 'data-date="' + k + '" onclick="openBestDetail(\'' + k + '\')" style="cursor:pointer"');
    const end = html.lastIndexOf('</div>');
    return html.slice(0, end) + layer + html.slice(end);
  };

  const oldStrip = window.renderBestMonthStrip;
  window.renderBestMonthStrip = function () {
    const result = oldStrip.apply(this, arguments);
    const strip = document.getElementById('best-month-strip'); if (!strip || typeof bestY === 'undefined') return result;
    Array.from(strip.children).forEach((btn, i) => {
      const pre = `${bestY}-${String(i + 1).padStart(2, '0')}`;
      const n = Object.entries(arch()).reduce((s, [k, r]) => s + (k.startsWith(pre) ? (r.u || 0) : 0), 0);
      if (n) { if (i + 1 !== bestM) btn.classList.add('has-data'); btn.title += ` · 어사이드44 ${n}종목`; }
    });
    return result;
  };

  const sline = T => T && T.n ? `${Number(T.n).toLocaleString('ko-KR')}건 평균 ${pct(T.rr, 2)} 중앙 ${pct(T.med, 2)} 이긴 ${T.win}% · 익절 ${T.tgt}% · 손절 ${T.stop}% · 평균손실 ${pct(T.loss, 1)}` : '—';
  const oldMeta = window.renderBestMeta;
  window.renderBestMeta = function () {
    const result = oldMeta.apply(this, arguments);
    const el = document.getElementById('best-meta'), m = window.어사이드44_META;
    if (!el) return result;
    if (!m) { el.innerHTML += '<br><span style="color:#ff9aaa">❌ 베스트_어사이드44.js 가 안 읽혔다 = 주도주\\_베스트_어사이드44_빌드.py 실행</span>'; return result; }
    const E = m.예정 || {}, W = m.주 || {}, Y = (m.연도 || []).find(r => typeof bestY !== 'undefined' && r.y === bestY), B1 = m.일등 || {};
    const pl = (E.종목 || []).map(x => `${x[3] ? '★' : ''}${x[0]}`).join(', ');
    el.innerHTML += `<div class="aside44-meta" style="margin-top:5px;color:${color}"><b>${BADGE} 어사이드44</b>(부자매매법 v3.2 · 진짜 우상향 + 대체 주도주 + 부자 셋업 합의판 · ★ = 1등 판도 고름 · 시가 매수 · 장중 -10% 손절 · +20% · 20일 · 하루 최대 5) ${esc(m.첫칸)}~${esc(m.끝칸)} · ${Number(m.칸).toLocaleString('ko-KR')}칸(본 ${esc(m.본첫칸)}~ · 앞은 확장) · 후보 ${Number(m.명단).toLocaleString('ko-KR')}(주 ${W.명단}) · 산 것 ${Number(m.체결).toLocaleString('ko-KR')}(${m.체결률}% · 주 ${W.체결}) · 빈 칸 ${m.빈칸}`
      + ` · 확정(본 2016~) ${sline(m.전체)} · 결과대기 ${m.결과대기}${m.봉늦음 ? ' · 봉 늦음 ' + m.봉늦음 : ''}`
      + (Y && Y.n ? ` · ${bestY}년 ${Y.n}건 평균 ${pct(Y.rr, 2)} 중앙 ${pct(Y.med, 2)}` : '')
      + `<br>${E.막힘 ? `<span style="color:#ffc454">${esc(E.막힘)}</span> · ` : ''}${E.미래 ? `${ymd(E.명단일)} 8시 명단(시가에 삼) = ${esc(pl) || '없음'}` : `마지막 칸 ${ymd(E.명단일)} = ${esc(pl) || '없음'}`}`
      + (m.경고 ? ` · <span style="color:#ffc454">천프정 ${ymd(m.천프정)} 봉이 직전 5거래일 거래 종목 ${m.기준} 중 ${m.들어옴}만 들어옴</span>` : '')
      + `<br><span style="color:#ff9aaa">${esc(m.판정)}</span> · 학습(신호 2016~2021) ${sline(m.학습)} · 확인(2022~2024) ${sline(m.확인)} · 시험(2025-01~2026-08) ${sline(m.시험)} · 2026-09~ ${sline(m.이후)}`
      + ` · 확장(2003~2015) ${sline(m.확장)} · ★1등 판 따로 사면 2016~ ${B1.n || 0}건 도달 ${B1.hit == null ? '—' : B1.hit + '%'} 평균 ${pct(B1.rr, 2)} · ${esc(m.대조)} · ${esc(m.재현)}`
      + `<br><span style="color:#8487bd">규칙 ${esc(m.규칙)} · 진짜 우상향(120·240일선 60거래일 +3%↑ · 60>120>240 · 60일선 상승 · 종가 ≥ 240일선 · 1년 고가 ×0.75 위) · 대체 주도주 = 그날 종가 +7%(강 +10%)↑ & 그날 거래대금 200위 안(월간 칸이 없는 해에도 같은 계산) · 일반 주식(스팩·우선주·리츠 제외) · 그날 시총 상위 100위 제외 · 종가 1,500원+ · 20일 대금 10억+ · 칸 = 명단일 · 시가에 삼(순서대로 최대 5 · 들고 있는 종목 제외) → 장중 -10% 손절 주문 · +20% 지정가 익절 · 20거래일 · 비용 0.35% · 상장폐지 종목까지 넣어 계산 · ${esc(m.확장설명)} · 잠금 ${esc(m.잠금)} · 규칙 코드 ${esc(m.규칙코드)}</span></div>`;
    return result;
  };

  const oldDetail = window.openBestDetail;
  window.openBestDetail = function (k) {
    const row = arch()[k];
    const body = document.getElementById('stock-modal-body'), ov = document.getElementById('stock-modal-overlay');
    if (!row || !row.u || !body || !ov) return oldDetail.apply(this, arguments);
    ov.style.display = 'none';
    const result = oldDetail.apply(this, arguments);
    if (ov.style.display !== 'flex') body.innerHTML = `<div style="font-size:18px;font-weight:bold">🏅 베스트 · ${esc(k)}</div>`;
    const prev = body.querySelector('[data-aside44-detail]'); if (prev) prev.remove();
    let html = `<section data-aside44-detail style="margin-top:20px;color:${color}"><h3 style="margin:0">${BADGE} 어사이드44 · 명단일 ${esc(k)} · 후보 ${row.u}종목 · 산 것 ${row.a.filter(bought).length}${row.x ? ' · 확장 구간' : ''} <span style="font-size:12px;color:#ff9aaa;font-weight:600">관찰용 · 매수추천 아님</span></h3>`
      + `<p style="color:#8487bd;font-size:12px;line-height:1.6;margin:6px 0">부자매매법 v3.2 합의판 · 신호일 <b style="color:#c9cbe8">${ymd(row.sd)}</b> 장마감 자료만 보고 고름 · ★ = 1등 판(5일선 재돌파 + 강한 대체 주도주)도 고른 종목${row.u > row.a.length ? ` · 저장 = 위 ${row.a.length}개(상위 10 + 산 것) · 외 ${row.u - row.a.length}` : ''}<br>`
      + `<b style="color:#c9cbe8">결과는 규칙대로 샀다고 가정한 계산(실제 매매와 무관)</b> · 명단일 시가에 삼(순서대로 최대 5 · 들고 있는 종목 제외) · 장중 -10% 손절 주문(시가가 그 아래면 시가) · +20% 지정가 익절 · 같은 날 둘 다 닿으면 손절로 셈 · 20거래일 · 비용 0.35%${row.x ? ' · 확장 구간 = 규칙 고를 때 안 본 2003~2015 · 시장 20일선 2013-03 앞 다시 계산 · 시총 100위 2014 앞 근사' : ''}</p>`;
    html += `<div style="overflow-x:auto"><table style="border-collapse:collapse;color:#e4e6ff;font-size:12px"><tr>`;
    ['순서', '★', '종목', '셋업', '대체주도 20일', '강주도 20일', '급등 20일', '시장', '신호일 종가(등락)', '20일 고점 대비', '흔들림', '매수가(시가)', '손절가(-10%)', '결과', '수익', '보유일', '청산일·사유', '매수 뒤 최고', '매수 뒤 최저'].forEach(t => html += `<th style="padding:5px 7px;border-bottom:1px solid ${line};color:#8487bd;white-space:nowrap;text-align:left">${t}</th>`);
    html += '</tr>';
    row.a.forEach(x => {
      const nmEl = `<span style="cursor:pointer;font-weight:bold;color:${color}" onclick="_openStock(this,function(){openBestDetail('${k}')})" data-code="${esc(g(x, 'c'))}" data-name="${esc(name(x))}" data-rate="0" data-amount="0" data-meta="㊹어사이드44 ${k}" data-catalyst="">${esc(name(x))}</span> <small style="color:#6b6e9c">${esc(g(x, 'c'))} ${esc(mkt(x))}</small>`;
      const s = g(x, 's'), done = s === 'C' || s === 'H' || s === 'S';
      const vals = [`${g(x, 'r')}/${row.u}`, g(x, 's1') ? '★' : '', nmEl, STN[g(x, 'st')] || g(x, 'st'), `${g(x, 'p7')}번`, `${g(x, 'p10')}번`, `${g(x, 'ns')}번`, g(x, 'mk') ? '20일선 위' : '아래',
        `${won(g(x, 'pc'))} (${pct(g(x, 'chg'))})`, pct(g(x, 'dd')), `${g(x, 'at')}%`, won(g(x, 'b')), g(x, 'b') != null ? won(g(x, 'b') * 0.9) : '—',
        ST[s] || s, done ? pct(g(x, 'p'), 2) : '—', done ? g(x, 'k') + '일' : '—', g(x, 'ed') ? `${ymd(g(x, 'ed'))} ${WHY[g(x, 'w')] || ''}` : (s === 'H' ? '결과대기' : '—'),
        g(x, 'mx') != null ? pct(g(x, 'mx')) : '—', g(x, 'mn') != null ? pct(g(x, 'mn')) : '—'];
      html += `<tr style="${bought(x) ? '' : 'opacity:.65'}">` + vals.map(v => `<td style="padding:5px 7px;border-bottom:1px solid #2a2a14;white-space:nowrap">${v}</td>`).join('') + '</tr>';
    });
    html += '</table></div>';
    body.insertAdjacentHTML('beforeend', html + '</section>');
    ov.style.display = 'flex';
    window.__배지복귀 = function () { window.openBestDetail(k); };
    return result;
  };
  if (typeof bestY !== 'undefined' && typeof window.renderBestCalendar === 'function') {
    try { window.renderBestCalendar(); } catch (e) { console.warn('어사이드44 다시 그리기 실패', e); }
  }
})();
