/* ㉗ 어사이드27 (2026-10-02 사용자 지시) = 실타래매매법2 v1 Aside판(바치올 「오래 꼬인 실타래가 풀리는 순간… 바로 이때입니다! 키움 실타래 지표」 2026-09-22) · 🏅 베스트 달력에 묶음을 더한다(기존 자료·함수는 그대로).
   스킬 /어사이드27 · 빌더 = 주도주\_베스트_어사이드27_빌드.py (→ 매매법\실타래매매법2_Aside\st2_달력.py · 잠긴 규칙 st2_core.py) · 자료 = dashboard/data/베스트_어사이드27(_과거).js
   한마디로: 이동평균선 10개(5~60일 지수평균)를 실로 보고, 1년 중 가장 좁게 모여 여러 번 꼬인 자리 = 매듭. 에너지 게이지 = 꼬인 강도(기준 20).
   영상 "단단한 매듭은 풀리면 스프링처럼 급등" → 어제 에너지 20 이상(단단한 매듭)에서 나온 ①풀림(화살표) · ②검색식(AI 키움 조건식)만,
   어제 에너지 큰 순 → 30봉 교차 → 거래대금 순 하루 최대 5종목 · 같은 종목 10봉 재신호 무시
   칸 = 매수일(8시 명단) · 결과는 규칙대로 샀다고 가정한 계산 = 5일(매수일 시가 → 5번째 거래일 종가 · 비용 0.35%p · +20✓ = 5거래일 안 +20%)
   + 익절판(참고 · +20% 닿으면 그 값에 팔기) · 관찰전용 · 매수추천 아님(사전등록 관문 0/5)
   ※ 🆉 어사이드26(실타래매매법 v1 Aside판 · 신호 전부) · 🆄 어사이드21(Claude Code 판 실타래매매법2)과는 다른 판
   감싸는 함수 = buildBestCell · renderBestMonthStrip · renderBestMeta · openBestDetail (어사이드26_뷰.js 와 같은 방식 · 그 뒤에 읽는다)
   🅰~🆉 26자를 다 써서 27번은 ㉗(동그라미 27)로 표시한다. */
(function () {
  'use strict';
  if (window.__aside27Installed) return;
  const originals = ['buildBestCell', 'renderBestMonthStrip', 'renderBestMeta', 'openBestDetail'];
  if (originals.some(n => typeof window[n] !== 'function')) { console.error('어사이드27: 베스트 달력 함수가 없습니다'); return; }
  window.__aside27Installed = true;
  const color = '#00e5ff', line = '#1f5a63', SHOW = 5, BADGE = '㉗';
  const arch = () => window.어사이드27_ARCHIVE || {};
  const NM = () => window.어사이드27_NAMES || {};
  const I = {};
  (window.어사이드27_COLS || ['c', 'r', 'nc', 't', 'pc', 'chg', 'en', 'kx', 'la', 'bx', 'vx', 'b', 's', 'p', 'tp', 'mx', 'mn', 'hd', 'kd', 'ed']).forEach((c, i) => { I[c] = i; });
  const g = (x, key) => x[I[key]];
  const esc = v => String(v == null ? '' : v).replace(/[&<>"']/g, ch => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[ch]));
  const pct = (v, dg) => v == null ? '—' : `<span style="color:${v >= 0 ? '#ff8a8a' : '#7ea6ff'}">${v >= 0 ? '+' : ''}${Number(v).toFixed(dg == null ? 1 : dg)}%</span>`;
  const won = v => v == null ? '—' : Number(v).toLocaleString('ko-KR', {maximumFractionDigits: 0});
  const ymd = s => { s = String(s || ''); return s.length === 8 ? `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6)}` : s; };
  const name = x => (NM()[g(x, 'c')] || [g(x, 'c')])[0];
  const mkt = x => (NM()[g(x, 'c')] || ['', ''])[1];
  const TYP = {1: '풀림', 2: '검색식', 3: '풀림+검색식'};
  const TS = {1: '풀', 2: '검', 3: '풀검'};
  const ST = {C: '5일째 종가', H: '결과대기', P: '예정(8시 명단)', S: '자료끊김', N: '매수불가', X: '분할·병합'};
  const res = x => {
    const s = g(x, 's'), h20 = g(x, 'hd') ? ' <span style="color:#ff8a8a">+20✓</span>' : '';
    if (s === 'C') return pct(g(x, 'p')) + h20;
    if (s === 'H') return `<span style="color:#ffc454">결과대기 ${g(x, 'kd')}/5</span>${g(x, 'p') != null ? ' ' + pct(g(x, 'p')) : ''}${h20}`;
    if (s === 'P') return '<span style="color:#7ee8ff">예정</span>';
    return `<span style="color:#8487bd">${ST[s] || s}</span>`;
  };

  const oldCell = window.buildBestCell;
  window.buildBestCell = function (d, k, rec, other, dow) {
    let html = oldCell.apply(this, arguments);
    const row = arch()[k]; if (!row || !row.n) return html;
    let layer = `<div class="aside27-layer" style="border-top:1px dashed ${line};margin-top:4px;padding-top:3px;color:${color};font-size:10px" title="${BADGE} 어사이드27(실타래매매법2 Aside판 · 단단한 매듭 에너지 20+ · 에너지 상위 5) · 신호일 ${ymd(row.sd)} 종가까지 보고 고름 · 풀=풀림(화살표) 검=검색식 · 숫자=어제 에너지 · 눌러서 자세히"><b>${BADGE} 어사이드27 · ${row.n}종목</b>${row.e ? ' <span style="color:#8487bd" title="2016 전 칸 = 검증 밖 · 지금 상장 종목 위주라 좋게 보일 수 있음">앞</span>' : ''}`;
    row.a.slice(0, SHOW).forEach(x => {
      const tip = `${TYP[g(x, 't')] || ''} · 어제 에너지 ${g(x, 'en')} · 30봉 교차 ${g(x, 'kx')} · 순위 ${g(x, 'r')}/${g(x, 'nc')} · 신호일 종가 ${won(g(x, 'pc'))}(${g(x, 'chg')}%) · 참고 되감김선 ${won(g(x, 'la'))}${g(x, 'bx') != null ? ' · 상자 윗선 ' + won(g(x, 'bx')) : ''} · 거래량 ${g(x, 'vx') == null ? '—' : g(x, 'vx') + '배'} · 매수가 ${won(g(x, 'b'))} · 5일 최고 ${g(x, 'mx') == null ? '—' : g(x, 'mx') + '%'} · 최저 ${g(x, 'mn') == null ? '—' : g(x, 'mn') + '%'} · ${ST[g(x, 's')] || ''} · 익절판 ${g(x, 'tp') == null ? '—' : g(x, 'tp') + '%'}`;
      layer += `<div title="${esc(tip)}" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis"><b>${esc(name(x))}</b><small style="color:#7fb7c0">${TS[g(x, 't')] || ''}${g(x, 'en')}</small> ${res(x)}</div>`;
    });
    if (row.n > SHOW) layer += `<div style="color:#8487bd">외 ${row.n - SHOW}종목 (눌러서 전부)</div>`;
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
      const n = Object.entries(arch()).reduce((s, [k, r]) => s + (k.startsWith(pre) ? r.n : 0), 0);
      if (n) { if (i + 1 !== bestM) btn.classList.add('has-data'); btn.title += ` · 어사이드27 ${n}종목`; }
    });
    return result;
  };

  const st = s => s && s.n ? `5일 확정 ${Number(s.n).toLocaleString('ko-KR')}건 +20% ${s.up}% · 5일째 평균 ${pct(s.rr, 2)} 중앙 ${pct(s.med, 2)} · 익절판 ${pct(s.tp, 2)}` : '확정 0건';
  const oldMeta = window.renderBestMeta;
  window.renderBestMeta = function () {
    const result = oldMeta.apply(this, arguments);
    const el = document.getElementById('best-meta'), m = window.어사이드27_META;
    if (!el) return result;
    if (!m) { el.innerHTML += '<br><span style="color:#ff9aaa">❌ 베스트_어사이드27.js 가 안 읽혔다 = 주도주\\_베스트_어사이드27_빌드.py 실행</span>'; return result; }
    const E = m.예정 || {}, H = m.HO || {}, Y = (m.연도 || []).find(r => typeof bestY !== 'undefined' && r.y === bestY);
    const names = (E.종목 || []).map((n, i) => n + ((E.셋업 || [])[i] ? '(' + E.셋업[i] + ' · 에너지 ' + (E.에너지 || [])[i] + ')' : ''));
    const ho = H.N ? `HO(2023-01~2026-08) 명단 ${Number(H.N).toLocaleString('ko-KR')}건 5일 안 +20% ${(H.hit * 100).toFixed(1)}%(같은 날 거래대금 비슷한 무작위 ${(H.exp * 100).toFixed(1)}% · ${Number(H.lift).toFixed(2)}배 · z ${H.z >= 0 ? '+' : ''}${Number(H.z).toFixed(1)}) · 5일째 평균 ${pct(H.mean * 100, 2)} 중앙 ${pct(H.med * 100, 2)}` : 'HO —';
    el.innerHTML += `<div class="aside27-meta" style="margin-top:5px;color:${color}"><b>${BADGE} 어사이드27</b>(실타래매매법2 Aside판 · 단단한 매듭(에너지 20+)의 풀림·검색식 · 에너지 상위 5) ${esc(m.첫칸)}~${esc(m.끝칸)} · ${Number(m.칸).toLocaleString('ko-KR')}칸(그 사이 거래일 ${Number(m.거래일).toLocaleString('ko-KR')}) · 명단 ${Number(m.종목수).toLocaleString('ko-KR')}(풀림 ${Number(m.풀림수).toLocaleString('ko-KR')} · 검색식 ${Number(m.검색식수).toLocaleString('ko-KR')}) · ${st(m.전체)} · 결과대기 ${m.결과대기}`
      + ` · 검증구간(2016~2026-08) ${st(m.검증구간)} · 2016 전 「앞」 ${st(m.앞구간)} · 풀림만 ${st(m.풀림)}`
      + (Y && Y.n ? ` · ${bestY}년 ${Y.n}건 +20% ${Y.up}% 평균 ${pct(Y.rr, 2)} 중앙 ${pct(Y.med, 2)}` : '')
      + ` · ${ymd(E.매수일)} 8시 예정 ${names.length}종목${names.length ? '(' + esc(names.join(', ')) + ')' : '(단단한 매듭 신호 없음)'}`
      + (m.경고 ? ` · <span style="color:#ffc454">천프정 ${ymd(m.마지막봉)} 봉이 직전 5거래일 거래 종목 ${Number(m.기준).toLocaleString('ko-KR')} 중 ${Number(m.들어옴).toLocaleString('ko-KR')}만 들어옴(빠진 종목은 그 전 봉까지 · 예정이 덜 나올 수 있음)</span>` : '')
      + `<br><span style="color:#ff9aaa">${esc(m.판정)} · 매수추천 아님 · 사전등록 관문 ${m.관문통과}/5</span> · ${ho} · [대조] ${esc(m.대조)} · [10년 재현] ${esc(m.재현)} · ${esc(m.아침)}`
      + `<br><span style="color:#8487bd">실 10올 = 5·8·12·16·20·25·30·40·50·60일 지수평균 · 매듭 = 실 폭이 1년 범위 아래 10% · 6% 이하 · 종가가 60일선 ±5% 인 봉이 30봉 중 10봉+ · 30봉 교차 12+ · 에너지 = 60봉 좁은 봉 교차 합(기준 20) · 풀(풀림 = 어제 연노랑 매듭 + 에너지 20+ → 양봉 종가 > 상자 윗선 + 큰 실 25>100>300 + 색띠 벌어짐) · 검(검색식 = 1봉전 5/20일선 ±2% · 1봉전 20봉 변동폭 15%↓ · 볼린저(20,2) 상단 상향돌파 · 거래량 5봉 평균 2배+ · <b>+ 어제 에너지 20+</b>) · 이름 옆 숫자 = 어제 에너지 · 순서 = 에너지 → 30봉 교차 → 거래대금 · 하루 최대 5 · 같은 종목 10봉 재신호 무시 · 일반 주식(스팩·우선주·리츠 제외) · 300봉+ · 종가 1,000원+ · 20일 평균 대금 10억+ · 상한가 제외 · 5일 = 매수일 시가 → 5번째 거래일 종가(비용 0.35%p) · +20✓ = 5거래일 안 +20% · 익절판 = +20% 닿으면 팔기(참고) · 「앞」 = 2016 전(검증 밖) · 🆉 어사이드26(신호 전부) · 🆄 어사이드21(Claude Code 판)과 다른 판</span></div>`;
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
    const prev = body.querySelector('[data-aside27-detail]'); if (prev) prev.remove();
    let html = `<section data-aside27-detail style="margin-top:20px;color:${color}"><h3 style="margin:0">${BADGE} 어사이드27 · 매수일 ${esc(k)} · ${row.n}종목 <span style="font-size:12px;color:#ff9aaa;font-weight:600">관찰전용 · 매수추천 아님</span></h3>`
      + `<p style="color:#8487bd;font-size:12px;line-height:1.6;margin:6px 0">실타래매매법2 Aside판(바치올 실타래 지표) · 신호일 <b style="color:#c9cbe8">${ymd(row.sd)}</b> 종가까지만 보고 고름${row.e ? ' · <b style="color:#ffc454">2016 전 칸 = 검증 밖</b>' : ''} · 단단한 매듭(어제 에너지 20 이상)에서 나온 풀림·검색식만 · 순서 = 어제 에너지 → 30봉 교차 → 거래대금 · 하루 최대 5 · 참고 되감김선 = 풀림은 어제 매듭 상자 윗선 · 검색식은 돌파한 볼린저 상단 값(종가가 그 아래로 다시 들어오면 영상의 '되감김')<br>`
      + `<b style="color:#c9cbe8">결과는 규칙대로 샀다고 가정한 계산(실제 매매와 무관)</b> · 5일 = 매수일 시가 → 5번째 거래일 종가(비용 0.35%p) · +20✓ = 매수일 포함 5거래일 안 고가가 매수가 +20% 에 닿음 · 익절판 = +20% 닿은 날 그 값에 팔고 못 닿으면 5일째 종가(참고)</p><div style="overflow-x:auto"><table style="border-collapse:collapse;color:#e4e6ff;font-size:12px"><tr>`;
    ['순위/후보', '종목', '셋업', '에너지 · 30봉 교차', '신호일 종가(등락)', '참고 되감김선', '상자 윗선', '거래량 배수', '매수가(시가)', '5일 최고', '5일 최저', '+20% 닿은 날', '5일 결과', '5일째 수익', '익절판(참고)'].forEach(t => html += `<th style="padding:5px 7px;border-bottom:1px solid ${line};color:#8487bd;white-space:nowrap;text-align:left">${t}</th>`);
    html += '</tr>';
    row.a.forEach(x => {
      const nmEl = `<span style="cursor:pointer;font-weight:bold;color:${color}" onclick="_openStock(this,function(){openBestDetail('${k}')})" data-code="${esc(g(x, 'c'))}" data-name="${esc(name(x))}" data-rate="0" data-amount="0" data-meta="${BADGE}어사이드27 ${k}" data-catalyst="">${esc(name(x))}</span> <small style="color:#6b6e9c">${esc(g(x, 'c'))} ${esc(mkt(x))}</small>`;
      const s = g(x, 's'), done = s === 'C' || s === 'H';
      const vals = [`${g(x, 'r')}/${g(x, 'nc')}`, nmEl, TYP[g(x, 't')] || g(x, 't'), `${g(x, 'en')} · ${g(x, 'kx')}`, `${won(g(x, 'pc'))} (${pct(g(x, 'chg'))})`, won(g(x, 'la')),
        g(x, 'bx') != null ? won(g(x, 'bx')) : '—', g(x, 'vx') == null ? '—' : g(x, 'vx') + '배', won(g(x, 'b')), done ? pct(g(x, 'mx')) : '—', done ? pct(g(x, 'mn')) : '—',
        g(x, 'hd') ? ymd(g(x, 'hd')) : '—', (ST[s] || s) + (s === 'H' ? ` (${g(x, 'kd')}/5일)` : '') + (g(x, 'ed') ? ` · ${ymd(g(x, 'ed'))}` : ''),
        done ? pct(g(x, 'p'), 2) : '—', s === 'C' ? pct(g(x, 'tp'), 2) : '—'];
      html += '<tr>' + vals.map(v => `<td style="padding:5px 7px;border-bottom:1px solid #1f3a40;white-space:nowrap">${v}</td>`).join('') + '</tr>';
    });
    body.insertAdjacentHTML('beforeend', html + '</table></div></section>');
    ov.style.display = 'flex';
    window.__배지복귀 = function () { window.openBestDetail(k); };
    return result;
  };
  if (typeof bestY !== 'undefined' && typeof window.renderBestCalendar === 'function') {
    try { window.renderBestCalendar(); } catch (e) { console.warn('어사이드27 다시 그리기 실패', e); }
  }
})();
