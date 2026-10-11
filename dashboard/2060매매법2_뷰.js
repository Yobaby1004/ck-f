// ════════ 🏹 2060 달력 + 2060매매법2 (2026-09-30 사용자 지시 "기본 2060에 넣는거 · 버튼을 추가하는게 아니고") ════════
//   2060매매법2 = 스킬 /2060매매법2 = 2060매매법 v1(유튜브 「차트는 불화살」 2060 영상 5편 · A 2060 복귀 · B 2060 수렴 반등 · C 저항 뒤 지지·돌파)
//   ★버튼·섹션을 따로 만들지 않는다. 기존 🏹 2060 달력(2060매매법1 · dashboard/2060_뷰.js)의 함수 4개를 감싸서
//     같은 칸 · 같은 상세 창 · 같은 요약 줄 · 같은 월 띠에 초록 「②」 묶음을 더한다. 2060_뷰.js 파일은 건드리지 않는다.
//     감싸는 함수 = buildR2060Cell · openR2060Detail · renderR2060Meta · renderR2060MonthStrip (이름이 바뀌면 이 파일은 조용히 아무것도 안 함)
//   자료 = dashboard/data/2060매매법2_과거.js + 2060매매법2.js (window.R2060_2_ARCHIVE / R2060_2_META · 칸 = 매수일 'YYYY-MM-DD')
//   빌더 = python 매매법\2060매매법\r2060_달력.py (/매매일 9.695 · /2060매매법2) · 숫자는 빌더가 잠긴 v1 규칙으로 계산한 것 그대로
//   p = [0이름, 1코드, 2시장(P/Q), 3자리, 4신호일종가, 5신호일등락%, 6대금억, 7목표가, 8목표까지%, 9손절가, 10손절까지%, 11매수가,
//        12상태(C 5일확정/H 결과대기/P 예정/S 자료끊김/N 매수불가/X 분할·병합), 13지난거래일수, 14 5일째수익%, 15 5일최고%, 16 5일최저%,
//        17 +20%도달, 18 -20%급락, 19 +20%도달일, 20 청산일, 21 목표가매도결과, 22 목표가매도수익%, 23 근거]
//   x = 회색 참고 = p + [24 구분('상한가' v2 에만 있는 상한가 날 신호 / '잘림' 10위 밖), 25 순위]
//   ★결과는 전부 규칙대로 샀다고 가정한 계산 = 실제 매매와 무관 · '보유'·'진행중' 같은 말 쓰지 않음 · 관찰전용 · 매수추천 아님
(function () {
  if (typeof buildR2060Cell !== 'function' || typeof openR2060Detail !== 'function') {
    console.warn('2060매매법2: 🏹 2060 달력 화면(2060_뷰.js)이 없어 ② 묶음을 안 붙임'); return;
  }
  const G = '#7ee8c0', GL = '#c8f5e2', GD = '#6fbfa8';                       // 초록 = 2060매매법2
  const A2 = () => window.R2060_2_ARCHIVE || {};
  const esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const pct = (v, dg) => { if (v == null || v !== v) return '—'; const n = Number(v); return `<span style="color:${n >= 0 ? '#ff8a8a' : '#7ea6ff'}">${n >= 0 ? '+' : ''}${n.toFixed(dg == null ? 1 : dg)}%</span>`; };
  const ymd = s => { s = String(s || ''); return s.length === 8 ? `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6)}` : s; };
  const md = s => { s = String(s || ''); return s.length === 8 ? `${s.slice(4, 6)}/${s.slice(6)}` : s; };
  const won = v => (v == null || v !== v) ? '—' : Number(v).toLocaleString('ko-KR');
  const grey = r => (r.x || []).filter(a => a[24] !== '잘림');              // 칸에는 상한가 참고만(잘림은 상세 창에만)
  const has2 = r => !!(r && (r.n || grey(r).length));
  const GS = { H: '결과대기', P: '예정', S: '자료끊김', N: '매수불가', X: '분할·병합' };
  const short = p => {                                                       // 칸 안 한 줄 결과
    const o = p[12], h = p[17] ? ' <span style="color:#ff8a8a">✓20</span>' : '';
    if (o === 'C') return pct(p[14]) + h;
    if (o === 'H') return `<span style="color:#ffc454">결과대기 ${p[13]}/5</span>${h}`;
    if (o === 'P') return '<span style="color:#7ee8ff">예정</span>';
    return `<span style="color:#8487bd">${GS[o] || '자료이상'}</span>`;
  };
  // ---- 칸: 2060매매법1 칸 그대로 + 아래에 ② 묶음
  function group(r) {
    let h = `<div style="margin-top:3px;border-top:1px dashed #2f5f55;padding-top:2px" title="② 2060매매법2 (2060 영상 5편 · A·B·C 자리) · 신호일 ${esc(r.s)} 종가까지 → 매수일 시가 · 결과는 규칙대로 샀다고 가정한 계산">`
      + `<div style="font-size:9.5px;color:${GD}">② 신호 ${md(r.s)} · <b style="color:${G}">${r.n}</b>종목</div>`;
    (r.p || []).forEach(p => {
      const tip = `② ${esc(p[0])} (${p[1]}) · 자리 ${esc(p[3])} · 신호일 ${p[5]}% · 목표 ${won(p[7])}(+${p[8]}%) · 손절 ${won(p[9])}(${p[10]}%) · ${esc(p[23])}`;
      h += `<div style="font-size:10px;line-height:1.35;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:${GL}" title="${tip}"><b>${esc(p[0])}</b> <span style="font-size:9px;color:#6b8f86">${esc(p[3])}</span> ${short(p)}</div>`;
    });
    grey(r).forEach(a => {
      const res = a[12] === 'C' ? (a[14] >= 0 ? '+' : '') + Number(a[14]).toFixed(1) + '%' + (a[17] ? ' ✓20' : '') : (GS[a[12]] || '');
      h += `<div style="font-size:9.5px;line-height:1.3;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:#6b6e9c" title="회색 참고 · v2(상한가 날도 포함)에만 있는 종목 · 신호일 ${a[5]}% · 본 명단 아님">${esc(a[0])} <span style="font-size:9px">상한가</span> ${res}</div>`;
    });
    return h + '</div>';
  }
  const _cell = buildR2060Cell;
  window.buildR2060Cell = function (d, k, rec, otherMonth, dow) {
    let html = _cell(d, k, rec, otherMonth, dow);
    const r = A2()[k];
    if (!has2(r)) return html;
    const i = html.lastIndexOf('</div>');
    html = html.slice(0, i) + group(r) + html.slice(i);
    if (!(rec && rec.n))                                                     // 2060매매법1 종목이 없는 날도 눌리게
      html = html.replace('<div class="cal-cell', `<div onclick="openR2060Detail('${k}')" style="cursor:pointer" class="cal-cell has-data`);
    return html;
  };
  // ---- 상세 창: 2060매매법1 표 아래에 ② 표
  function detail(k, r) {
    const TH = 'style="color:#8487bd;white-space:nowrap;padding:3px 7px;text-align:left"';
    const ST = { C: '5일째 종가', H: '결과대기', P: '예정(명단만 정해짐)', S: '자료끊김(거래정지·상장폐지 등)', N: '매수불가(매수일 거래 없음)', X: '분할·병합(결과 무의미)' };
    const row = (p, i, gr) => {
      const S = `style="white-space:nowrap;padding:3px 7px${gr ? ';color:#8487bd' : ''}"`;
      const clk = ` onclick="_openStock(this,function(){openR2060Detail('${k}')})" data-code="${p[1]}" data-name="${esc(p[0])}" data-rate="0" data-amount="0" data-meta="🏹2060② ${k}" data-catalyst="" title="클릭 → 종목 상세(차트·일봉)"`;
      const pend = p[12] === 'P' || p[12] === 'N' || p[12] === 'X';
      return `<tr style="border-top:1px solid ${gr ? '#23253d' : '#244a42'}"><td ${S}>${gr ? esc(p[24]) + ' ' + p[25] : i + 1}</td>`
        + `<td ${S}><span${clk} style="cursor:pointer;color:${gr ? '#a9abcf' : GL};font-weight:${gr ? 400 : 700}">${esc(p[0])}</span> <span style="color:#6b6e9c">${p[1]} ${p[2] === 'P' ? '코스피' : p[2] === 'Q' ? '코스닥' : ''}</span></td>`
        + `<td ${S}>${esc(p[3])}</td><td ${S}>${won(p[4])}</td><td ${S}>${pct(p[5], 1)}</td><td ${S}>${won(p[6])}</td>`
        + `<td ${S}>${won(p[7])} <span style="color:#ff8a8a">+${p[8]}%</span></td><td ${S}>${won(p[9])} <span style="color:#7ea6ff">${p[10]}%</span></td>`
        + `<td ${S}>${won(p[11])}</td><td ${S}>${(ST[p[12]] || '자료이상') + (p[12] === 'H' ? ` (5거래일 중 ${p[13]}일 지남)` : '')}</td>`
        + `<td ${S}>${pend ? '—' : pct(p[14], 2)}</td><td ${S}>${pend ? '—' : pct(p[15], 1)}</td><td ${S}>${pend ? '—' : pct(p[16], 1)}</td>`
        + `<td ${S}>${p[19] ? ymd(p[19]) : '—'}</td><td ${S}>${ymd(p[20]) || '—'}</td><td ${S}>${p[21] ? esc(p[21]) + ' ' + pct(p[22], 1) : '—'}</td>`
        + `<td ${S}><span style="color:#8487bd;font-size:11.5px">${esc(p[23])}</span></td></tr>`;
    };
    const hdr = `<tr><th ${TH}>순위</th><th ${TH}>종목</th><th ${TH}>자리</th><th ${TH}>신호일 종가</th><th ${TH}>신호일 등락</th><th ${TH}>대금(억)</th><th ${TH}>목표가(여유)</th><th ${TH}>손절가</th><th ${TH}>매수가(시가)</th><th ${TH}>결과</th><th ${TH}>5일째 수익</th><th ${TH}>5일 최고</th><th ${TH}>5일 최저</th><th ${TH}>+20% 닿은 날</th><th ${TH}>청산일</th><th ${TH}>목표가 매도(보조·10일)</th><th ${TH}>근거</th></tr>`;
    let h = `<div style="margin-top:18px;padding-top:12px;border-top:2px solid #244a42">
      <div style="font-size:17px;font-weight:700;color:${G}">② 2060매매법2 · 매수일 ${k}
        <span style="font-size:12px;font-weight:600;color:#ff9aaa;background:rgba(255,154,170,.1);border:1px solid rgba(255,154,170,.35);padding:2px 9px;border-radius:10px;margin-left:8px">관찰전용 · 매수추천 아님</span></div>
      <div style="font-size:12px;color:#8487bd;margin-top:6px;line-height:1.6">2060매매법 v1(유튜브 「차트는 불화살」 2060 영상 5편 · A 2060 복귀 · B 2060 수렴 반등 · C 저항 뒤 지지·돌파 · 목표까지 20% 이상 남은 자리) · 신호일 <b style="color:#c9cbe8">${ymd(r.s)}</b> 종가까지만 보고 고름 · 하루 최대 10종목(신호일 거래대금 순)<br>
        <b style="color:#c9cbe8">결과는 전부 규칙대로 샀다고 가정한 계산(실제 매매와 무관)</b> · 매수일 시가 → 5번째 거래일 종가(비용 0.35%p) · ✓20 = 5거래일 안 +20% 닿음 · 목표가 매도(보조) = 목표가 지정가 / 종가가 손절가 아래면 그 종가 / 10거래일째 종가</div>`;
    if ((r.p || []).length) {
      h += `<table style="margin-top:8px;border-collapse:collapse;font-size:12.5px;color:#e4e6ff">${hdr}`;
      r.p.forEach((p, i) => { h += row(p, i, false); });
      h += '</table>';
    } else h += '<div style="margin-top:6px;font-size:12px;color:#8487bd">이날 본 명단 종목 없음(아래는 참고만)</div>';
    const X = r.x || [];
    if (X.length) {
      h += `<div style="margin-top:10px;font-size:12px;color:#8487bd">회색 참고 = 본 명단 아님 · <b>상한가</b> = v2(신호일 상한가도 포함)에만 있는 종목(10년 재검증에서 +20% 는 자주 닿지만 -20% 급락도 많아 본 명단에서 뺌) · <b>잘림</b> = 기준에 걸렸지만 10위 밖</div>
      <table style="margin-top:4px;border-collapse:collapse;font-size:12px;color:#8487bd;opacity:.9">${hdr}`;
      X.forEach((a, i) => { h += row(a, i, true); });
      h += '</table>';
    }
    return h + '</div>';
  }
  const _open = openR2060Detail;
  window.openR2060Detail = function (k) {
    const r = A2()[k], rec1 = (window.R2060_1_ARCHIVE || {})[k];
    const ov = document.getElementById('stock-modal-overlay'), body = document.getElementById('stock-modal-body');
    if (rec1 && rec1.n) _open(k);
    else if (has2(r) && ov && body) {
      body.innerHTML = `<div style="padding:6px 2px 4px"><div style="font-size:19px;font-weight:700;color:#ff9f5a">🏹 2060 · 매수일 ${k}</div>`
        + `<div style="font-size:12px;color:#8487bd;margin-top:6px">이날 2060매매법1(불화살강의) 종목 없음</div></div>`;
      ov.style.display = 'flex';
      try { window.__배지복귀 = function () { openR2060Detail(k); }; } catch (e) { }
    }
    if (has2(r) && body) body.insertAdjacentHTML('beforeend', detail(k, r));
  };
  // ---- 요약 줄: 2060매매법1 요약 아래에 ② 한 줄
  if (typeof renderR2060Meta === 'function') {
    const _meta = renderR2060Meta;
    window.renderR2060Meta = function () {
      _meta();
      const el = document.getElementById('r2060-meta'), M = window.R2060_2_META;
      if (!el) return;
      if (!M) { el.insertAdjacentHTML('beforeend', '<br><span style="color:#ff9aaa">❌ 2060매매법2.js 가 안 읽혔다 = /2060매매법2 실행</span>'); return; }
      const T = M.전체 || {}, yy = (typeof r2060Y !== 'undefined') ? r2060Y : null, Y = (M.연도 || []).find(r => r.y === yy), E = M.예정, R = (M.참고 || {}).상한가;
      el.insertAdjacentHTML('beforeend', `<br><span style="color:${G}">②</span> <b style="color:${G}">2060매매법2</b>(2060 영상 5편 · A·B·C 자리 · 하루 최대 10) · 칸 ${Number(M.칸).toLocaleString('ko-KR')}개(${ymd(M.첫칸)}~) · 전체 확정 ${Number(T.n || 0).toLocaleString('ko-KR')}건 +20% 도달 <b>${T.up}%</b> · 5일째 평균 ${pct(T.rr, 2)} · 중앙 ${pct(T.med, 2)} · 승률 ${T.win}% · 결과대기 ${M.결과대기}`
        + (Y && Y.n ? ` · ${yy}년 ${Y.n}건 +20% ${Y.up}% 평균 ${pct(Y.rr, 2)}` : '')
        + (E ? ` · <span style="color:#7ee8ff">예정 ${ymd(E.매수일)} ${E.종목.length}종목(${E.종목.map(esc).join(', ') || '없음'})</span>` : '')
        + (R ? ` · <span style="color:#8487bd">회색 상한가 참고 ${R.n}건 +20% ${R.up}% 중앙 ${pct(R.med, 1)}</span>` : '')
        + ` · <span style="color:#ff9aaa">${esc(M.판정 || '관찰전용')}(관문 ${M.관문통과 == null ? '-' : M.관문통과}/5) · 매수추천 아님</span>`);
    };
  }
  // ---- 월 띠: 2060매매법2 만 있는 달도 표시
  if (typeof renderR2060MonthStrip === 'function') {
    const _strip = renderR2060MonthStrip;
    window.renderR2060MonthStrip = function () {
      _strip();
      const strip = document.getElementById('r2060-month-strip'); if (!strip || typeof r2060Y === 'undefined') return;
      const A = A2();
      [...strip.children].forEach((btn, i) => {
        const pre = `${r2060Y}-${String(i + 1).padStart(2, '0')}`;
        let n = 0; Object.keys(A).forEach(k => { if (k.startsWith(pre)) n += (A[k].n || 0); });
        if (!n) return;
        btn.title = (btn.title || '').replace(' 자료 없음', '') + ` · ② 2060매매법2 ${n}종목`;
        if (!btn.classList.contains('active')) btn.classList.add('has-data');
      });
    };
  }
  // ---- 설명 박스·버튼 설명에 한 줄
  function note() {
    const box = document.getElementById('r2060-desc');
    if (box && !box.querySelector('.r2060b-note'))
      box.insertAdjacentHTML('beforeend', `<div class="r2060b-note" style="margin-top:6px"><span style="color:${G}">②</span> 같은 칸의 초록 <b style="color:${G}">② 묶음</b> = <b>2060매매법2</b>(스킬 /2060매매법2 · 유튜브 「차트는 불화살」 2060 영상 5편 · A 2060 복귀 · B 2060 수렴 반등 · C 저항 뒤 지지·돌파 · 목표까지 20% 이상 남은 자리 · 하루 최대 10 · 신호일 거래대금 순) · 매수일 시가 → 5번째 거래일 종가 · 숫자 = 5일째 수익 · ✓20 = 5일 안 +20% 닿음 · 회색 = 상한가 날 신호(v2 참고 · 본 명단 아님) · <b style="color:#ff9aaa">관찰전용 · 매수추천 아님(관문 1/5)</b></div>`);
    const btn = [...document.querySelectorAll('.h-nav-btn')].find(b => (b.getAttribute('onclick') || '').includes("setView('r2060')"));
    if (btn && !(btn.title || '').includes('2060매매법2')) btn.title += ' ·· + ② 2060매매법2(2060 영상 5편 · A·B·C 자리 · 초록 묶음)';
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', note); else note();
  // 이미 그려져 있으면 다시 그림
  try { const v = document.getElementById('r2060-view'); if (v && v.innerHTML && typeof renderR2060Calendar === 'function') renderR2060Calendar(); } catch (e) { }
})();
