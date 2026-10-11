/* ㊀ 어사이드51 (2026-10-07 사용자 지시) = 20일주도주매매법 v1.1 고정(Aside판 · 여의도호랑이 '20일선+주도섹터' 키움 검색식) · 🏅 베스트 달력에 묶음을 더한다(기존 자료·함수는 그대로).
   표시 글자 = ㊀(동그라미 한자 一 = 50+1) · 동그라미 숫자는 유니코드에 ㊿(50)까지만 있어서 51번부터는 ㊀ ㊁ ㊂ … (50+1, 50+2, …)로 이어 간다.
   스킬 /어사이드51 · 빌더 = 주도주\_베스트_어사이드51_빌드.py (→ 매매법\20일주도주매매법_Aside\j20_달력.py · 잠긴 j20_core·j20_eval·j20_v11) · 자료 = dashboard/data/베스트_어사이드51(_과거).js
   한마디로: 키움 검색식 A 시총 3,000억+ · B 최근 10일 안 거래대금 500억(원본 1,000억)+ · C 최근 5일 안 종가가 20일 지수이평의 90~120% · D 어제까지 10일 중 거래대금 최대 봉(기준봉)이 500억+ · 시가 대비 +10%+ · 지금 종가 ≥ 기준봉 저가
            → 같은 날 검색 종목 중 같은 테마(천억 캘린더 [월간] 칸 대분류) 2종목+ & 같이 움직이는(60일 시장 뺀 수익률 상관 0.35+) 종목 2개+ → 20일선 가까운 순 하루 최대 5(같은 종목 10거래일 안 다시 안 냄)
   칸 = 명단일(신호일 다음 거래일) · 그날 하루 '어제 종가' 지정가로 삼(시가가 기준봉 저가 아래면 취소) → +20% 지정가 익절 · 종가가 20일선 아래면 그날 종가 손절 · 5거래일째 종가 · 비용 0.35%
   · 결과는 규칙대로 샀다고 가정한 계산 · 관찰용 · 매수추천 아님 · 평일 08:00 텔레그램(천억_20일주도주매매법_Aside_아침_0800)과 같은 판
   감싸는 함수 = buildBestCell · renderBestMonthStrip · renderBestMeta · openBestDetail (어사이드42~50_뷰.js 와 같은 방식 · 그 뒤에 읽는다) */
(function () {
  'use strict';
  if (window.__aside51Installed) return;
  const originals = ['buildBestCell', 'renderBestMonthStrip', 'renderBestMeta', 'openBestDetail'];
  if (originals.some(n => typeof window[n] !== 'function')) { console.error('어사이드51: 베스트 달력 함수가 없습니다'); return; }
  window.__aside51Installed = true;
  const color = '#aed581', line = '#2c3d1c', BADGE = '㊀', SHOW = 6;
  const arch = () => window.어사이드51_ARCHIVE || {};
  const NM = () => window.어사이드51_NAMES || {};
  const I = {};
  (window.어사이드51_COLS || ['c', 'r', 'lab', 'lab2', 'th', 'dz', 'pc', 'chg', 'gap', 'bd', 'bret', 'ba', 'bl', 'e20', 'lim', 'b', 's', 'p', 'k', 'ed', 'w', 'mx', 'mn', 'lbar']).forEach((c, i) => { I[c] = i; });
  const g = (x, key) => x[I[key]];
  const esc = v => String(v == null ? '' : v).replace(/[&<>"']/g, ch => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[ch]));
  const pct = (v, dg) => v == null ? '—' : `<span style="color:${v >= 0 ? '#ff8a8a' : '#7ea6ff'}">${v >= 0 ? '+' : ''}${Number(v).toFixed(dg == null ? 1 : dg)}%</span>`;
  const won = v => v == null ? '—' : Number(v).toLocaleString('ko-KR', {maximumFractionDigits: 0});
  const ymd = s => { s = String(s || ''); return s.length === 8 ? `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6)}` : s; };
  const md = s => { s = String(s || ''); return s.length === 8 ? `${s.slice(4, 6)}/${s.slice(6)}` : s; };
  const name = x => (NM()[g(x, 'c')] || [g(x, 'c')])[0];
  const mkt = x => (NM()[g(x, 'c')] || ['', ''])[1];
  const ST = {C: '확정', H: '결과대기', N: '안 삼(명단일 어제 종가 지정가가 안 닿음 · 또는 시가가 기준봉 저가 아래)', P: '예정(명단일 하루 어제 종가 지정가 · 시가가 기준봉 저가 위일 때)',
    Q: '매수 불가(명단일 거래 없음)', L: '봉 늦음(천프정 미수집 또는 거래정지)', S: '자료끊김(정지·폐지 의심)', X: '분할·병합 의심(성적 밖)'};
  const WHY = {1: '익절 +20%', 2: '손절(종가 20일선 아래)', 3: '만기 5일'};
  const SHORT = {1: '익절', 2: '손절', 3: '만기'};
  const bought = x => ['C', 'H', 'S', 'X'].includes(g(x, 's'));
  const res = x => {
    const s = g(x, 's');
    if (s === 'C') return `${pct(g(x, 'p'))} <span style="color:#8487bd">${SHORT[g(x, 'w')] || ''}</span>`;
    if (s === 'H') return `<span style="color:#ffc454">대기 ${g(x, 'k')}일</span> ${pct(g(x, 'p'))}${g(x, 'lbar') ? ` <span style="color:#8487bd">${md(g(x, 'lbar'))}봉까지</span>` : ''}`;
    if (s === 'N') return '<span style="color:#8487bd">안 삼(지정가 안 닿음)</span>';
    if (s === 'P') return `<span style="color:#d7ffb0">예정 · ${won(g(x, 'lim'))} 지정가</span>`;
    if (s === 'Q') return '<span style="color:#8487bd">거래 없음</span>';
    if (s === 'L') return '<span style="color:#ffc454">봉 늦음</span>';
    if (s === 'S') return `<span style="color:#ffc454">자료끊김</span> ${pct(g(x, 'p'))}`;
    return `<span style="color:#8487bd">${ST[s] || s}</span>`;
  };
  const tipOf = x => `${g(x, 'r')}순위 · 테마 ${g(x, 'lab') || '-'}(${g(x, 'lab2') || '-'}) 같은 날 검색 ${g(x, 'th')}종목 · 같이 움직임 ${g(x, 'dz')} · 신호일 종가 ${won(g(x, 'pc'))}(${g(x, 'chg')}%)`
    + ` · 20일선 ${won(g(x, 'e20'))}(이격 ${g(x, 'gap')}%) · 기준봉 ${md(g(x, 'bd'))} 시가대비 +${g(x, 'bret')}% · ${won(g(x, 'ba'))}억 · 기준봉 저가 ${won(g(x, 'bl'))} · 지정가(어제 종가) ${won(g(x, 'lim'))}`
    + `${g(x, 'b') != null ? ' · 매수가 ' + won(g(x, 'b')) : ''} · ${ST[g(x, 's')] || ''}${g(x, 'ed') ? ' ' + md(g(x, 'ed')) + ' ' + (WHY[g(x, 'w')] || '') : ''}`
    + `${g(x, 'mx') != null ? ' · 매수 뒤(명단일 포함) 최고 ' + g(x, 'mx') + '% 최저 ' + g(x, 'mn') + '%' : ''}`;

  const oldCell = window.buildBestCell;
  window.buildBestCell = function (d, k, rec, other, dow) {
    let html = oldCell.apply(this, arguments);
    const row = arch()[k]; if (!row) return html;
    let layer;
    if (!row.n) {
      layer = `<div class="aside51-layer" style="border-top:1px dashed ${line};margin-top:4px;padding-top:2px;color:${color};font-size:9.5px;opacity:.6" title="${BADGE} 어사이드51(20일주도주매매법) · 신호일 ${ymd(row.sd)} · 같은 테마 2종목+ & 같이 움직이는 검색 종목 없음(또는 10거래일 안 이미 나온 종목) · 그날 검색식 원본(1,000억) ${row.z1} · 500억까지 ${row.z} · 같은 테마 2종목+ ${row.zt} · 테마+같이 움직임 ${row.zd}"><b>${BADGE}</b> 없음 · 검색 ${row.z1}/${row.z}</div>`;
    } else {
      const nb = row.a.filter(bought).length;
      layer = `<div class="aside51-layer" style="border-top:1px dashed ${line};margin-top:4px;padding-top:3px;color:${color};font-size:10px" title="${BADGE} 어사이드51(20일주도주매매법 · 20일선+주도섹터 검색식) · 신호일 ${ymd(row.sd)} 장마감까지 보고 고름 · 이날 하루 어제 종가 지정가 · 후보 ${row.u} · 산 것 ${nb} · 눌러서 자세히"><b>${BADGE} 어사이드51</b> <span style="color:#8487bd">후보 ${row.u}${nb ? ' · 삼 ' + nb : ''}</span>`;
      row.a.slice(0, SHOW).forEach(x => {
        layer += `<div title="${esc(tipOf(x))}" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis${bought(x) ? '' : ';opacity:.7'}">${g(x, 'r')}. <b>${esc(name(x))}</b> <span style="color:#8487bd">${esc(g(x, 'lab') || '-')}${g(x, 'th')}</span> ${res(x)}</div>`;
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
      if (n) { if (i + 1 !== bestM) btn.classList.add('has-data'); btn.title += ` · 어사이드51 ${n}종목`; }
    });
    return result;
  };

  const sline = T => T && T.n ? `${Number(T.n).toLocaleString('ko-KR')}건 평균 ${pct(T.rr, 2)} 중앙 ${pct(T.med, 2)} 이긴 ${T.win}% · 익절 ${T.tgt}% · 손절 ${T.stop}% · 만기 ${T.exp}% · 상위5% 뺀 ${pct(T.trim, 2)}` : '—';
  const oldMeta = window.renderBestMeta;
  window.renderBestMeta = function () {
    const result = oldMeta.apply(this, arguments);
    const el = document.getElementById('best-meta'), m = window.어사이드51_META;
    if (!el) return result;
    if (!m) { el.innerHTML += '<br><span style="color:#ff9aaa">❌ 베스트_어사이드51.js 가 안 읽혔다 = 주도주\\_베스트_어사이드51_빌드.py 실행</span>'; return result; }
    const E = m.예정 || {}, W = m.주 || {}, Y = (m.연도 || []).find(r => typeof bestY !== 'undefined' && r.y === bestY);
    const pl = (E.종목 || []).map(x => `${x[0]}(${x[2] || '-'} ${x[3]}종목 · ${won(x[1])} 지정가)`).join(', ');
    el.innerHTML += `<div class="aside51-meta" style="margin-top:5px;color:${color}"><b>${BADGE} 어사이드51</b>(20일주도주매매법 v1.1 고정 · 20일선+주도섹터 검색식 · 같은 테마 2종목+ & 같이 움직임 · 어제 종가 지정가 · +20% · 20일선 손절 · 5일 · 하루 최대 5) ${esc(m.첫칸)}~${esc(m.끝칸)} · ${Number(m.칸).toLocaleString('ko-KR')}칸 · 후보 ${Number(m.명단).toLocaleString('ko-KR')}(주 ${W.명단}) · 산 것 ${Number(m.체결).toLocaleString('ko-KR')}(${m.체결률}% · 주 ${W.체결}) · 빈 칸 ${m.빈칸}`
      + ` · 확정 ${sline(m.전체)} · 결과대기 ${m.결과대기}${m.봉늦음 ? ' · 봉 늦음 ' + m.봉늦음 : ''}`
      + (Y && Y.n ? ` · ${bestY}년 ${Y.n}건 평균 ${pct(Y.rr, 2)} 중앙 ${pct(Y.med, 2)}` : '')
      + `<br>${E.막힘 ? `<span style="color:#ffc454">${esc(E.막힘)}</span>` : (E.미래 ? `${ymd(E.명단일)} 8시 명단 = ${esc(pl) || '없음'}` : `마지막 칸 ${ymd(E.명단일)} = ${esc(pl) || '없음'}`)}`
      + (m.테마경고 ? ` · <span style="color:#ffc454">${esc(m.테마경고)}</span>` : '')
      + (m.경고 ? ` · <span style="color:#ffc454">천프정 ${ymd(m.천프정)} 봉이 직전 5거래일 거래 종목 ${m.기준} 중 ${m.들어옴}만 들어옴</span>` : '')
      + `<br><span style="color:#ff9aaa">${esc(m.판정)}</span> · 설계에 쓴 구간(신호 2022-06~2024 · 부풀려짐) ${sline(m.학습)} · 달마다 봉인 채점(2025-01~2026-08) ${sline(m.봉인)} · 2026-09~ ${sline(m.이후)}`
      + ` · [대조] ${esc(m.대조)} · [재현] ${esc(m.재현)}`
      + `<br><span style="color:#8487bd">규칙 ${esc(m.규칙)} · 키움 검색식 A~D(유튜브 여의도호랑이 2026-10-06 · 고정 댓글 엑셀 '20일선주도주검색기') · 테마 = 천억 캘린더 [월간] 칸 대분류(신호일까지 붙은 이름표 · 2022-06-02 부터라 그 앞 칸 없음) · 같이 움직임 = 최근 60거래일 시장 뺀 수익률 상관 0.35+ · 일반 주식(스팩·우선주·리츠 제외) · 칸 = 명단일 · 하루 어제 종가 지정가(시가가 기준봉 저가 아래면 취소) → +20% 지정가 · 종가 20일선 아래면 손절 · 5거래일 · 비용 0.35% · 상장폐지 종목까지 넣어 계산 · 잠금 ${esc(m.잠금)} · 규칙 코드 ${esc(m.규칙코드)} · 표시 글자 ㊀ = 50+1(동그라미 숫자는 ㊿ 까지)</span></div>`;
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
    const prev = body.querySelector('[data-aside51-detail]'); if (prev) prev.remove();
    let html = `<section data-aside51-detail style="margin-top:20px;color:${color}"><h3 style="margin:0">${BADGE} 어사이드51 · 명단일 ${esc(k)} · 후보 ${row.u}종목 · 산 것 ${row.a.filter(bought).length} <span style="font-size:12px;color:#ff9aaa;font-weight:600">관찰용 · 매수추천 아님</span></h3>`
      + `<p style="color:#8487bd;font-size:12px;line-height:1.6;margin:6px 0">20일주도주매매법 v1.1 고정 · 신호일 <b style="color:#c9cbe8">${ymd(row.sd)}</b> 장마감 자료 + 그날까지 붙은 테마 이름표만 보고 고름 · 그날 검색식 원본(1,000억) ${row.z1} · 500억까지 ${row.z} · 같은 테마 2종목+ ${row.zt} · 테마+같이 움직임 ${row.zd}<br>`
      + `<b style="color:#c9cbe8">결과는 규칙대로 샀다고 가정한 계산(실제 매매와 무관)</b> · 명단일 하루 '어제 종가' 지정가(시가가 기준봉 저가 아래면 취소 · 20일선 가까운 순 최대 5) · +20% 지정가 익절(시가가 +20% 위면 시가) · 종가가 20일선 아래면 그날 종가 손절 · 5거래일째 종가 · 비용 0.35%</p>`;
    html += `<div style="overflow-x:auto"><table style="border-collapse:collapse;color:#e4e6ff;font-size:12px"><tr>`;
    ['순서', '종목', '테마(세부)', '같은 테마 수', '같이 움직임 수', '신호일 종가(등락)', '20일선(이격)', '기준봉(날·시가대비·대금)', '기준봉 저가', '지정가(어제 종가)', '매수가', '결과', '수익', '보유일', '청산일·사유', '매수 뒤 최고', '매수 뒤 최저'].forEach(t => html += `<th style="padding:5px 7px;border-bottom:1px solid ${line};color:#8487bd;white-space:nowrap;text-align:left">${t}</th>`);
    html += '</tr>';
    row.a.forEach(x => {
      const nmEl = `<span style="cursor:pointer;font-weight:bold;color:${color}" onclick="_openStock(this,function(){openBestDetail('${k}')})" data-code="${esc(g(x, 'c'))}" data-name="${esc(name(x))}" data-rate="0" data-amount="0" data-meta="㊀어사이드51 ${k}" data-catalyst="">${esc(name(x))}</span> <small style="color:#6b6e9c">${esc(g(x, 'c'))} ${esc(mkt(x))}</small>`;
      const s = g(x, 's'), done = s === 'C' || s === 'H' || s === 'S';
      const vals = [`${g(x, 'r')}/${row.u}`, nmEl, esc(`${g(x, 'lab') || '-'}(${g(x, 'lab2') || '-'})`), `${g(x, 'th')}종목`, `${g(x, 'dz')}`, `${won(g(x, 'pc'))} (${pct(g(x, 'chg'))})`,
        `${won(g(x, 'e20'))} (${pct(g(x, 'gap'))})`, `${md(g(x, 'bd'))} · ${pct(g(x, 'bret'))} · ${won(g(x, 'ba'))}억`, won(g(x, 'bl')), won(g(x, 'lim')), won(g(x, 'b')),
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
    try { window.renderBestCalendar(); } catch (e) { console.warn('어사이드51 다시 그리기 실패', e); }
  }
})();
