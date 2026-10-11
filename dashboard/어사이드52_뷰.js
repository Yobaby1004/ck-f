/* ㊁ 어사이드52 (2026-10-11 사용자 지시) = 주가급등매매법 v2.1(Aside판 · 유튜브 오버솔드 '장양조양' 패턴 · 진짜 우상향 주도주 눌림 + 주 3종목 바닥) · 🏅 베스트 달력에 묶음을 더한다(기존 자료·함수는 그대로).
   표시 글자 = ㊁(동그라미 한자 二 = 50+2) · 동그라미 숫자는 유니코드에 ㊿(50)까지만 있어서 51번부터는 ㊀ ㊁ ㊂ … (50+1, 50+2, …)로 이어 간다.
   스킬 /어사이드52 · 빌더 = 주도주\_베스트_어사이드52_빌드.py (→ 매매법\주가급등매매법_Aside\jy21_달력.py · 잠긴 jy21_core·jy21_rules) · 자료 = dashboard/data/베스트_어사이드52(_과거).js
   한마디로: 120·240일선 진짜 우상향 + 월간 칸 주도주(최근 20거래일 1번+ & 마지막 등장 5거래일 안) 중
            핵심 = +10% 장대양봉(거래대금 전날 3배) 뒤 장대 저가를 지킨 첫 조정 음봉 + 20일 고점 대비 눌림 바닥 -10% 안
            주 3종목 바닥 = 그 주에 핵심이 모자라면 날마다 ceil((3 - 이번 주 나간 수) / 남은 거래일)개를 보충
              (F3 밀린 주도주 = 오늘 종가가 20일 최고 종가보다 3%+ 아래 · 직전 눌림 바닥이 20일선 위 → 모자라면 F4 주도 우상향 전체 · 주도주 아닌 종목으로는 안 채움)
   칸 = 명단일(신호일 다음 거래일) · 그날 시가에 삼(핵심은 시가 ≤ 장대 저가면 안 삼 · 신호일 종가 +29.5% 이상이면 안 삼) → +20% 지정가 익절 · 보충만 종가 < 20일선이면 그날 종가 손절
   · 20거래일째 종가 · 하루 최대 5 · 들고 있는 종목 제외 · 비용 0.35% · 결과는 규칙대로 샀다고 가정한 계산 · 관찰용 · 매수추천 아님
   감싸는 함수 = buildBestCell · renderBestMonthStrip · renderBestMeta · openBestDetail (어사이드42~51_뷰.js 와 같은 방식 · 그 뒤에 읽는다) */
(function () {
  'use strict';
  if (window.__aside52Installed) return;
  const originals = ['buildBestCell', 'renderBestMonthStrip', 'renderBestMeta', 'openBestDetail'];
  if (originals.some(n => typeof window[n] !== 'function')) { console.error('어사이드52: 베스트 달력 함수가 없습니다'); return; }
  window.__aside52Installed = true;
  const color = '#a1887f', line = '#3e2f2a', BADGE = '㊁', SHOW = 6;
  const arch = () => window.어사이드52_ARCHIVE || {};
  const NM = () => window.어사이드52_NAMES || {};
  const I = {};
  (window.어사이드52_COLS || ['c', 'r', 'ro', 'pl', 'st', 'ap', 'dl', 'pc', 'chg', 'dd', 'pd', 'pm', 'gap', 'zd', 'zr', 'ln', 'b', 'tg', 's', 'p', 'k', 'ed', 'w', 'mx', 'mn', 'lbar']).forEach((c, i) => { I[c] = i; });
  const g = (x, key) => x[I[key]];
  const esc = v => String(v == null ? '' : v).replace(/[&<>"']/g, ch => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[ch]));
  const pct = (v, dg) => v == null ? '—' : `<span style="color:${v >= 0 ? '#ff8a8a' : '#7ea6ff'}">${v >= 0 ? '+' : ''}${Number(v).toFixed(dg == null ? 1 : dg)}%</span>`;
  const won = v => v == null ? '—' : Number(v).toLocaleString('ko-KR', {maximumFractionDigits: 0});
  const ymd = s => { s = String(s || ''); return s.length === 8 ? `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6)}` : s; };
  const md = s => { s = String(s || ''); return s.length === 8 ? `${s.slice(4, 6)}/${s.slice(6)}` : s; };
  const name = x => (NM()[g(x, 'c')] || [g(x, 'c')])[0];
  const mkt = x => (NM()[g(x, 'c')] || ['', ''])[1];
  const ST = {C: '확정', H: '결과대기', N: '안 삼(명단일 시가가 장대 저가 이하 · 또는 신호일 종가 +29.5% 이상)', P: '예정(명단일 시가에 삼)', F: '안 삼(그날 5종목 다 참)',
    Q: '매수 불가(명단일 거래 없음)', L: '봉 늦음(천프정 미수집 또는 거래정지)', S: '자료끊김(정지·폐지 의심)', X: '오염(보유 중 ±31% 봉 · 성적 밖)'};
  const WHY = {1: '익절 +20%', 2: '손절(종가 20일선 아래 · 보충만)', 3: '만기 20일', 4: '자료끝(상장폐지·오래 정지 → 마지막 종가)'};
  const SHORT = {1: '익절', 2: '손절', 3: '만기', 4: '자료끝'};
  const SETW = {A: 'A +20% 장대', B: 'B 변동폭 장대', C: 'C +10% 장대', D: 'D 몸통 안 음봉', E: 'E 조정 끝 첫 양봉'};
  const ROLE = x => g(x, 'ro') === '핵' ? '핵심' : `보충${g(x, 'pl') || ''}`;
  const roleLong = x => g(x, 'ro') === '핵' ? '핵심(장양조양 눌림)' : (g(x, 'pl') === 'F3' ? '보충 F3(밀린 주도주)' : '보충 F4(주도 우상향)');
  const bought = x => ['C', 'H', 'S', 'X'].includes(g(x, 's'));
  const res = x => {
    const s = g(x, 's');
    if (s === 'C') return `${pct(g(x, 'p'))} <span style="color:#8487bd">${SHORT[g(x, 'w')] || ''}</span>`;
    if (s === 'H') return `<span style="color:#ffc454">대기 ${g(x, 'k')}일</span> ${pct(g(x, 'p'))}${g(x, 'lbar') ? ` <span style="color:#8487bd">${md(g(x, 'lbar'))}봉까지</span>` : ''}`;
    if (s === 'N') return '<span style="color:#8487bd">안 삼</span>';
    if (s === 'F') return '<span style="color:#8487bd">5종목 참</span>';
    if (s === 'P') return '<span style="color:#ffe0b2">예정 · 시가</span>';
    if (s === 'Q') return '<span style="color:#8487bd">거래 없음</span>';
    if (s === 'L') return '<span style="color:#ffc454">봉 늦음</span>';
    if (s === 'S') return `<span style="color:#ffc454">자료끊김</span> ${pct(g(x, 'p'))}`;
    return `<span style="color:#8487bd">${ST[s] || s}</span>`;
  };
  const tipOf = x => `${g(x, 'r')}순위 · ${roleLong(x)}${g(x, 'st') ? ' · 셋업 ' + (SETW[g(x, 'st')] || g(x, 'st')) : ''} · 월간 칸 20일 ${g(x, 'ap')}번(마지막 ${g(x, 'dl')}거래일 전)`
    + ` · 신호일 종가 ${won(g(x, 'pc'))}(${g(x, 'chg')}%) · 20일 최고 종가 대비 ${g(x, 'dd')}% · 직전 눌림 ${g(x, 'pd')}%(바닥 20일선 대비 ${g(x, 'pm')}%) · 20일선 이격 ${g(x, 'gap')}%`
    + `${g(x, 'zd') ? ' · 장대양봉 ' + md(g(x, 'zd')) + ' +' + g(x, 'zr') + '% · 장대 저가 ' + won(g(x, 'ln')) : ''}`
    + `${g(x, 'b') != null ? ' · 매수가(시가) ' + won(g(x, 'b')) + ' · 목표 ' + won(g(x, 'tg')) : ''} · ${ST[g(x, 's')] || ''}${g(x, 'ed') ? ' ' + md(g(x, 'ed')) + ' ' + (WHY[g(x, 'w')] || '') : ''}`
    + `${g(x, 'mx') != null ? ' · 매수 뒤(명단일 포함) 최고 ' + g(x, 'mx') + '% 최저 ' + g(x, 'mn') + '%' : ''}`;

  const oldCell = window.buildBestCell;
  window.buildBestCell = function (d, k, rec, other, dow) {
    let html = oldCell.apply(this, arguments);
    const row = arch()[k]; if (!row) return html;
    let layer;
    if (!row.n) {
      layer = `<div class="aside52-layer" style="border-top:1px dashed ${line};margin-top:4px;padding-top:2px;color:${color};font-size:9.5px;opacity:.6" title="${BADGE} 어사이드52(주가급등매매법 v2.1) · 신호일 ${ymd(row.sd)} · 진짜 우상향 ${row.z} · 주도 우상향 ${row.ld} · 이번 주 3종목이 이미 찼거나(오늘 필요 ${row.nd}) 걸린 주도주 없음${row.sh ? ' · 못 채움 ' + row.sh : ''}"><b>${BADGE}</b> 없음 · 주도 ${row.ld}${row.sh ? ' · 못 채움' : ''}</div>`;
    } else {
      const nb = row.a.filter(bought).length;
      layer = `<div class="aside52-layer" style="border-top:1px dashed ${line};margin-top:4px;padding-top:3px;color:${color};font-size:10px" title="${BADGE} 어사이드52(주가급등매매법 v2.1 · 진짜 우상향 주도주 장양조양 눌림 + 주 3종목 바닥) · 신호일 ${ymd(row.sd)} 장마감까지 보고 고름 · 이날 시가에 삼 · 후보 ${row.u} · 산 것 ${nb} · 눌러서 자세히"><b>${BADGE} 어사이드52</b> <span style="color:#8487bd">후보 ${row.u}${nb ? ' · 삼 ' + nb : ''}${row.sh ? ' · 못 채움 ' + row.sh : ''}</span>`;
      row.a.slice(0, SHOW).forEach(x => {
        layer += `<div title="${esc(tipOf(x))}" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis${bought(x) ? '' : ';opacity:.7'}">${g(x, 'r')}. <b>${esc(name(x))}</b> <span style="color:#8487bd">${ROLE(x)}</span> ${res(x)}</div>`;
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
      if (n) { if (i + 1 !== bestM) btn.classList.add('has-data'); btn.title += ` · 어사이드52 ${n}종목`; }
    });
    return result;
  };

  const sline = T => T && T.n ? `${Number(T.n).toLocaleString('ko-KR')}건 평균 ${pct(T.rr, 2)} 중앙 ${pct(T.med, 2)} 이긴 ${T.win}% · 익절 ${T.tgt}% · 손절 ${T.stop}% · 만기 ${T.exp}%${T.trim != null ? ' · 상위5% 뺀 ' + pct(T.trim, 2) : ''}` : '—';
  const oldMeta = window.renderBestMeta;
  window.renderBestMeta = function () {
    const result = oldMeta.apply(this, arguments);
    const el = document.getElementById('best-meta'), m = window.어사이드52_META;
    if (!el) return result;
    if (!m) { el.innerHTML += '<br><span style="color:#ff9aaa">❌ 베스트_어사이드52.js 가 안 읽혔다 = 주도주\\_베스트_어사이드52_빌드.py 실행</span>'; return result; }
    const E = m.예정 || {}, W = m.주 || {}, Y = (m.연도 || []).find(r => typeof bestY !== 'undefined' && r.y === bestY);
    const pl = (E.종목 || []).map(x => `${x[0]}(${x[1]} · 신호일 종가 ${won(x[2])})`).join(', ');
    el.innerHTML += `<div class="aside52-meta" style="margin-top:5px;color:${color}"><b>${BADGE} 어사이드52</b>(주가급등매매법 v2.1 · 진짜 우상향 주도주 장양조양 눌림 + 주 3종목 바닥 · 시가 매수 · +20% · 보충만 20일선 손절 · 20일 · 하루 최대 5) ${esc(m.첫칸)}~${esc(m.끝칸)} · ${Number(m.칸).toLocaleString('ko-KR')}칸 · 후보 ${Number(m.명단).toLocaleString('ko-KR')}(핵심 ${m.핵심} · 보충 ${m.보충} · 주 ${W.명단}건 · 3종목 채운 주 ${W.세건}%) · 산 것 ${Number(m.체결).toLocaleString('ko-KR')}(${m.체결률}%) · 빈 칸 ${m.빈칸}`
      + ` · 확정 ${sline(m.전체)} · 핵심만 ${sline(m.핵심성적)} · 보충만 ${sline(m.보충성적)} · 결과대기 ${m.결과대기}${m.봉늦음 ? ' · 봉 늦음 ' + m.봉늦음 : ''}`
      + (Y && Y.n ? ` · ${bestY}년 ${Y.n}건 평균 ${pct(Y.rr, 2)} 중앙 ${pct(Y.med, 2)}` : '')
      + `<br>${E.막힘 ? `<span style="color:#ffc454">${esc(E.막힘)}</span>` : (E.미래 ? `${ymd(E.명단일)} 8시 명단 = ${esc(pl) || '없음(이번 주 3종목이 찼거나 걸린 주도주 없음)'}` : `마지막 칸 ${ymd(E.명단일)} = ${esc(pl) || '없음'}`)}`
      + (m.경고 ? ` · <span style="color:#ffc454">천프정 ${ymd(m.천프정)} 봉이 직전 5거래일 거래 종목 ${m.기준} 중 ${m.들어옴}만 들어옴</span>` : '')
      + `<br><span style="color:#ff9aaa">${esc(m.판정)}</span> · 학습(2022-06~2024) ${sline(m.학습)} · 확인(2025) ${sline(m.확인)} · 시험(2026-01~08) ${sline(m.시험)} · 2026-09~ ${sline(m.이후)}`
      + ` · [대조] ${esc(m.대조)} · [재현] ${esc(m.재현)}`
      + `<br><span style="color:#8487bd">규칙 ${esc(m.규칙)} · 진짜 우상향 = 120·240일선 60일 전보다 +3%↑ · 60>120>240 · 60일선 상승 · 종가 ≥ 240일선 · 1년 고가의 75% 이상 · 주도주 = 천억 캘린더 [월간] 칸(2022-06-02 부터라 그 앞 칸 없음) · 그날 시총 100위 제외 · 일반 주식(스팩·우선주·리츠·코넥스 제외 · 상장폐지 종목까지 넣어 계산) · 칸 = 명단일 · 잠금 ${esc(m.잠금)} · 규칙 코드 ${esc(m.규칙코드)} · 표시 글자 ㊁ = 50+2(동그라미 숫자는 ㊿ 까지)</span></div>`;
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
    const prev = body.querySelector('[data-aside52-detail]'); if (prev) prev.remove();
    let html = `<section data-aside52-detail style="margin-top:20px;color:${color}"><h3 style="margin:0">${BADGE} 어사이드52 · 명단일 ${esc(k)} · 후보 ${row.u}종목 · 산 것 ${row.a.filter(bought).length} <span style="font-size:12px;color:#ff9aaa;font-weight:600">관찰용 · 매수추천 아님</span></h3>`
      + `<p style="color:#8487bd;font-size:12px;line-height:1.6;margin:6px 0">주가급등매매법 v2.1 · 신호일 <b style="color:#c9cbe8">${ymd(row.sd)}</b> 장마감 자료 + 그날까지 붙은 월간 칸만 보고 고름 · 진짜 우상향 ${row.z} · 주도 우상향 ${row.ld} · 이 주 3종목 바닥 오늘 필요 ${row.nd}${row.sh ? ' · 못 채움 ' + row.sh : ''}<br>`
      + `<b style="color:#c9cbe8">결과는 규칙대로 샀다고 가정한 계산(실제 매매와 무관)</b> · 명단일 시가에 삼(핵심은 시가 ≤ 장대 저가면 안 삼 · 신호일 종가 +29.5% 이상이면 안 삼) · +20% 지정가 익절(시가가 +20% 위면 시가) · 보충만 종가가 20일선 아래면 그날 종가 손절 · 20거래일째 종가 · 비용 0.35%</p>`;
    html += `<div style="overflow-x:auto"><table style="border-collapse:collapse;color:#e4e6ff;font-size:12px"><tr>`;
    ['순서', '종목', '역할', '셋업', '월간 20일(마지막)', '신호일 종가(등락)', '20일 고점 대비', '직전 눌림(바닥·20일선)', '20일선 이격', '장대양봉(날·등락·저가)', '매수가(시가)', '목표가', '결과', '수익', '보유일', '청산일·사유', '매수 뒤 최고', '매수 뒤 최저'].forEach(t => html += `<th style="padding:5px 7px;border-bottom:1px solid ${line};color:#8487bd;white-space:nowrap;text-align:left">${t}</th>`);
    html += '</tr>';
    row.a.forEach(x => {
      const nmEl = `<span style="cursor:pointer;font-weight:bold;color:${color}" onclick="_openStock(this,function(){openBestDetail('${k}')})" data-code="${esc(g(x, 'c'))}" data-name="${esc(name(x))}" data-rate="0" data-amount="0" data-meta="㊁어사이드52 ${k}" data-catalyst="">${esc(name(x))}</span> <small style="color:#6b6e9c">${esc(g(x, 'c'))} ${esc(mkt(x))}</small>`;
      const s = g(x, 's'), done = s === 'C' || s === 'H' || s === 'S';
      const vals = [`${g(x, 'r')}/${row.u}`, nmEl, esc(roleLong(x)), esc(g(x, 'st') ? (SETW[g(x, 'st')] || g(x, 'st')) : '—'), `${g(x, 'ap')}번(${g(x, 'dl')}일 전)`,
        `${won(g(x, 'pc'))} (${pct(g(x, 'chg'))})`, pct(g(x, 'dd')), `${pct(g(x, 'pd'))} · ${pct(g(x, 'pm'))}`, pct(g(x, 'gap')),
        g(x, 'zd') ? `${md(g(x, 'zd'))} · ${pct(g(x, 'zr'))} · ${won(g(x, 'ln'))}` : '—', won(g(x, 'b')), won(g(x, 'tg')),
        ST[s] || s, done ? pct(g(x, 'p'), 2) : '—', done ? g(x, 'k') + '일' : '—', g(x, 'ed') ? `${ymd(g(x, 'ed'))} ${WHY[g(x, 'w')] || ''}` : (s === 'H' ? '결과대기' : '—'),
        g(x, 'mx') != null ? pct(g(x, 'mx')) : '—', g(x, 'mn') != null ? pct(g(x, 'mn')) : '—'];
      html += `<tr style="${bought(x) ? '' : 'opacity:.65'}">` + vals.map(v => `<td style="padding:5px 7px;border-bottom:1px solid #2a2320;white-space:nowrap">${v}</td>`).join('') + '</tr>';
    });
    html += '</table></div>';
    body.insertAdjacentHTML('beforeend', html + '</section>');
    ov.style.display = 'flex';
    window.__배지복귀 = function () { window.openBestDetail(k); };
    return result;
  };
  if (typeof bestY !== 'undefined' && typeof window.renderBestCalendar === 'function') {
    try { window.renderBestCalendar(); } catch (e) { console.warn('어사이드52 다시 그리기 실패', e); }
  }
})();
