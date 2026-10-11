// ════════ 🏹 2060 달력 + 2060매매법3 (2026-09-30 사용자 지시 "2060버튼에 네가 걸러준 종목 추가 · 2060매매법3") ════════
//   2060매매법3 = 스킬 /2060매매법3 = 기준봉판(20·60 동시 돌파 기준봉 +10%·거래량 2배 → 고점 뒤 −10% 눌림 → 2060 근처 지지
//                 → 5일선에 걸친 캔들·하락 멈춤 → 기준봉 저가 지킴 → 20일선 상승) · 규칙 = 매매법\불화살2060_기준봉\_2060기준봉.py
//   ★버튼·섹션을 따로 만들지 않는다(②와 같은 방식). 🏹 2060 달력 함수 4개(2060_뷰.js · 2060매매법2_뷰.js 가 감싼 것)를 한 번 더 감싸
//     같은 칸 · 같은 상세 창 · 같은 요약 줄 · 같은 월 띠에 보라 「③」 묶음을 더한다. 2060_뷰.js·2060매매법2_뷰.js 는 건드리지 않는다.
//     ★이 파일은 2060매매법2_뷰.js 뒤에 읽혀야 한다(②의 상세 창 감싸기가 ①·② 자료 없는 날엔 앞 함수를 안 부르기 때문).
//   자료 = dashboard/data/2060매매법3_과거.js + 2060매매법3.js (window.R2060_3_ARCHIVE / R2060_3_META · 칸 = 매수일 'YYYY-MM-DD')
//   빌더 = python 매매법\불화살2060_기준봉\_2060매매법3_달력.py (/매매일 9.695 · /2060매매법3) · 숫자는 빌더 계산 그대로
//   p(첫 신호) = [0이름, 1코드, 2기준봉일, 3기준봉등락%, 4기준봉거래량배, 5고점대비%, 6먼2060선까지%, 7대금20일억, 8신호일종가(원본),
//        9매수가(원본 시가), 10상태(T +20%익절/C 10일째종가/H 결과대기/P 예정/S 자료끊김/X 자료이상), 11지난거래일수(T는 닿은 날차),
//        12규칙수익%, 13 10일최고%, 14 10일최저%, 15 +20도달, 16 +20도달일, 17청산일(마지막일), 18시가갭%, 19신호일]
//   x(재신호 = 같은 기준봉으로 전에 이미 걸린 종목 · 통계 제외) = [0이름, 1코드, 2기준봉일, 3상태, 4규칙수익%, 5 +20도달, 6 10일최고%, 7 10일최저%, 8첫신호일]
//   ★결과는 전부 규칙대로 샀다고 가정한 계산 = 실제 매매와 무관 · '보유'·'진행중' 같은 말 쓰지 않음 · 관찰전용 · 매수추천 아님
(function () {
  if (typeof buildR2060Cell !== 'function' || typeof openR2060Detail !== 'function') {
    console.warn('2060매매법3: 🏹 2060 달력 화면(2060_뷰.js)이 없어 ③ 묶음을 안 붙임'); return;
  }
  const G = '#b9a2ff', GL = '#e3daff', GD = '#9a8ccf', GB = '#4a3f78';      // 보라 = 2060매매법3
  const A3 = () => window.R2060_3_ARCHIVE || {};
  const esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const pct = (v, dg) => { if (v == null || v !== v) return '—'; const n = Number(v); return `<span style="color:${n >= 0 ? '#ff8a8a' : '#7ea6ff'}">${n >= 0 ? '+' : ''}${n.toFixed(dg == null ? 1 : dg)}%</span>`; };
  const ymd = s => { s = String(s || ''); return s.length === 8 ? `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6)}` : s; };
  const md = s => { s = String(s || ''); return s.length === 8 ? `${s.slice(4, 6)}/${s.slice(6)}` : s; };
  const won = v => (v == null || v !== v) ? '—' : Number(v).toLocaleString('ko-KR');
  const has3 = r => !!(r && (r.n || (r.x || []).length));
  const GS = { H: '결과대기', P: '예정', S: '자료끊김', X: '자료이상' };
  const short = p => {                                                       // 칸 안 한 줄 결과
    const o = p[10];
    if (o === 'T') return `<span style="color:#ff8a8a">+20✓</span><span style="font-size:9px;color:#8487bd"> ${p[11]}일</span>`;
    if (o === 'C') return pct(p[12]);
    if (o === 'H') return `<span style="color:#ffc454">결과대기 ${p[11]}/10</span>`;
    if (o === 'P') return '<span style="color:#7ee8ff">예정</span>';
    return `<span style="color:#8487bd">${GS[o] || '자료이상'}</span>`;
  };
  // ---- 칸: 앞(①·②) 칸 그대로 + 아래에 ③ 묶음
  function group(r) {
    const X = r.x || [];
    let h = `<div style="margin-top:3px;border-top:1px dashed ${GB};padding-top:2px" title="③ 2060매매법3 (기준봉판) · 신호일 ${esc(r.s)} 종가까지 → 매수일 시가 · +20% 지정가 또는 10번째 거래일 종가 · 규칙대로 샀다고 가정한 계산">`
      + `<div style="font-size:9.5px;color:${GD}">③ 신호 ${md(r.s)} · <b style="color:${G}">${r.n || 0}</b>종목${X.length ? ` <span style="color:#6b6e9c" title="재신호 = 같은 기준봉으로 전에 이미 걸렸던 종목 · 누르면 전부 보임 · 통계 제외">+${X.length} 재신호</span>` : ''}</div>`;
    (r.p || []).forEach(p => {
      const tip = `③ ${esc(p[0])} (${p[1]}) · 기준봉 ${ymd(p[2])} +${p[3]}% 거래량 ${p[4]}배 · 고점 대비 ${p[5]}% · 먼 2060선까지 ${p[6]}% · 20일 대금 ${p[7]}억 · 매수가 ${won(p[9])} · 10일 최고 ${p[13] == null ? '—' : p[13] + '%'} 최저 ${p[14] == null ? '—' : p[14] + '%'}`;
      h += `<div style="font-size:10px;line-height:1.35;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:${GL}" title="${tip}"><b>${esc(p[0])}</b> ${short(p)}</div>`;
    });
    if (X.length)
      h += `<div style="font-size:9px;line-height:1.3;color:#6b6e9c;white-space:normal" title="재신호(같은 기준봉 · 통계 제외) · 누르면 결과까지 전부">재 ${X.slice(0, 6).map(a => esc(a[0])).join(' · ')}${X.length > 6 ? ` 외 ${X.length - 6}` : ''}</div>`;
    return h + '</div>';
  }
  const _cell = window.buildR2060Cell;
  window.buildR2060Cell = function (d, k, rec, otherMonth, dow) {
    let html = _cell(d, k, rec, otherMonth, dow);
    const r = A3()[k];
    if (!has3(r)) return html;
    const i = html.lastIndexOf('</div>');
    html = html.slice(0, i) + group(r) + html.slice(i);
    if (!html.includes('openR2060Detail('))                                  // ①·② 종목이 없는 날도 눌리게
      html = html.replace('<div class="cal-cell', `<div onclick="openR2060Detail('${k}')" style="cursor:pointer" class="cal-cell has-data`);
    return html;
  };
  // ---- 상세 창: ①·② 표 아래에 ③ 표
  function detail(k, r) {
    const TH = 'style="color:#8487bd;white-space:nowrap;padding:3px 7px;text-align:left"';
    const ST = { T: '+20% 익절', C: '10일째 종가', H: '결과대기', P: '예정(명단만 정해짐)', S: '자료끊김(거래정지·상장폐지 등)', X: '자료이상(창 안 분할·재개 · 통계 제외)' };
    const clk = (code, name) => ` onclick="_openStock(this,function(){openR2060Detail('${k}')})" data-code="${code}" data-name="${esc(name)}" data-rate="0" data-amount="0" data-meta="🏹2060③ ${k}" data-catalyst="" title="클릭 → 종목 상세(차트·일봉)"`;
    let h = `<div style="margin-top:18px;padding-top:12px;border-top:2px solid ${GB}">
      <div style="font-size:17px;font-weight:700;color:${G}">③ 2060매매법3 · 매수일 ${k}
        <span style="font-size:12px;font-weight:600;color:#ff9aaa;background:rgba(255,154,170,.1);border:1px solid rgba(255,154,170,.35);padding:2px 9px;border-radius:10px;margin-left:8px">관찰전용 · 매수추천 아님</span></div>
      <div style="font-size:12px;color:#8487bd;margin-top:6px;line-height:1.6">기준봉판 = 20·60일선 동시 돌파 기준봉(+10%·거래량 2배) → 고점 뒤 −10% 눌림 → 2060 근처 지지 → 5일선에 걸친 캔들·하락 멈춤 → 기준봉 저가 지킴 → 20일선 상승 · 신호일 <b style="color:#c9cbe8">${ymd(r.s)}</b> 종가까지만 보고 고름 · 걸린 종목 전부(순서 = 20일 평균 대금)<br>
        <b style="color:#c9cbe8">결과는 전부 규칙대로 샀다고 가정한 계산(실제 매매와 무관)</b> · 매수일 시가 → +20% 지정가(갭으로 넘으면 그날 시가) · 못 닿으면 10번째 거래일 종가 · 비용 0.3% · 과거 첫 신호 평균은 음수(무작위보다 나쁨)</div>`;
    const P = r.p || [];
    if (P.length) {
      h += `<table style="margin-top:8px;border-collapse:collapse;font-size:12.5px;color:#e4e6ff"><tr><th ${TH}>순</th><th ${TH}>종목</th><th ${TH}>기준봉</th><th ${TH}>고점 대비</th><th ${TH}>먼 2060선까지</th><th ${TH}>20일 대금(억)</th><th ${TH}>신호일 종가</th><th ${TH}>매수가(시가)</th><th ${TH}>결과</th><th ${TH}>규칙수익</th><th ${TH}>10일 최고</th><th ${TH}>10일 최저</th><th ${TH}>+20% 닿은 날</th><th ${TH}>청산일</th></tr>`;
      P.forEach((p, i) => {
        const S = 'style="white-space:nowrap;padding:3px 7px"', pend = p[10] === 'P';
        h += `<tr style="border-top:1px solid ${GB}"><td ${S}>${i + 1}</td>`
          + `<td ${S}><span${clk(p[1], p[0])} style="cursor:pointer;color:${GL};font-weight:700">${esc(p[0])}</span> <span style="color:#6b6e9c">${p[1]}</span></td>`
          + `<td ${S}>${ymd(p[2])} ${pct(p[3], 1)} <span style="color:#8487bd">${p[4]}배</span></td><td ${S}>${pct(p[5], 1)}</td><td ${S}>${pct(p[6], 1)}</td><td ${S}>${won(p[7])}</td>`
          + `<td ${S}>${won(p[8])}</td><td ${S}>${won(p[9])}${p[18] == null ? '' : ' <span style="color:#8487bd">갭 ' + (p[18] >= 0 ? '+' : '') + p[18] + '%</span>'}</td>`
          + `<td ${S}>${(ST[p[10]] || '') + (p[10] === 'T' ? ` (${p[11]}일째)` : '') + (p[10] === 'H' ? ` (10거래일 중 ${p[11]}일 지남)` : '')}</td>`
          + `<td ${S}>${pend ? '—' : pct(p[12], 2)}</td><td ${S}>${pend ? '—' : pct(p[13], 1)}</td><td ${S}>${pend ? '—' : pct(p[14], 1)}</td>`
          + `<td ${S}>${p[16] ? ymd(p[16]) : '—'}</td><td ${S}>${p[17] ? ymd(p[17]) : '—'}</td></tr>`;
      });
      h += '</table>';
    } else h += '<div style="margin-top:6px;font-size:12px;color:#8487bd">이날 첫 신호 종목 없음(아래 재신호만)</div>';
    const X = r.x || [];
    if (X.length) {
      const TG = 'style="white-space:nowrap;padding:2px 7px;color:#8487bd"';
      h += `<div style="margin-top:10px;font-size:12px;color:#8487bd">회색 재신호 = 같은 기준봉으로 전에 이미 걸렸던 종목이 이날도 조건을 채움 · 결과는 이날 신호로 샀다고 가정한 계산 · 통계(요약 줄)엔 안 넣음</div>
      <table style="margin-top:4px;border-collapse:collapse;font-size:12px;color:#8487bd;opacity:.9"><tr><th ${TG}>종목</th><th ${TG}>기준봉</th><th ${TG}>첫 신호일</th><th ${TG}>결과</th><th ${TG}>규칙수익</th><th ${TG}>10일 최고</th><th ${TG}>10일 최저</th></tr>`;
      X.forEach(a => {
        const pend = a[3] === 'P';
        h += `<tr style="border-top:1px solid #23253d"><td ${TG}><span${clk(a[1], a[0])} style="cursor:pointer;color:#a9abcf">${esc(a[0])}</span> <span style="color:#5d6090">${a[1]}</span></td>`
          + `<td ${TG}>${ymd(a[2])}</td><td ${TG}>${ymd(a[8])}</td><td ${TG}>${(ST[a[3]] || '') + (a[5] ? ' ✓20' : '')}</td>`
          + `<td ${TG}>${pend ? '—' : pct(a[4], 2)}</td><td ${TG}>${pend ? '—' : pct(a[6], 1)}</td><td ${TG}>${pend ? '—' : pct(a[7], 1)}</td></tr>`;
      });
      h += '</table>';
    }
    return h + '</div>';
  }
  const _open = window.openR2060Detail;
  window.openR2060Detail = function (k) {
    const r = A3()[k];
    const ov = document.getElementById('stock-modal-overlay'), body = document.getElementById('stock-modal-body');
    if (!has3(r) || !ov || !body) { _open(k); return; }
    body.insertAdjacentHTML('beforeend', '<i id="r2060c-sentinel" hidden></i>');   // 앞(①·②)이 창을 새로 그리면 사라진다
    _open(k);
    const sen = document.getElementById('r2060c-sentinel');
    if (sen) {                                                                // ①·② 자료 없는 날 = 창을 여기서 연다
      sen.remove();
      body.innerHTML = `<div style="padding:6px 2px 4px"><div style="font-size:19px;font-weight:700;color:#ff9f5a">🏹 2060 · 매수일 ${k}</div>`
        + `<div style="font-size:12px;color:#8487bd;margin-top:6px">이날 2060매매법1·2 종목 없음</div></div>`;
      ov.style.display = 'flex';
      try { window.__배지복귀 = function () { openR2060Detail(k); }; } catch (e) { }
    }
    body.insertAdjacentHTML('beforeend', detail(k, r));
  };
  // ---- 요약 줄: 앞 요약 아래에 ③ 한 줄
  if (typeof renderR2060Meta === 'function') {
    const _meta = window.renderR2060Meta;
    window.renderR2060Meta = function () {
      _meta();
      const el = document.getElementById('r2060-meta'), M = window.R2060_3_META;
      if (!el) return;
      if (!M) { el.insertAdjacentHTML('beforeend', '<br><span style="color:#ff9aaa">❌ 2060매매법3.js 가 안 읽혔다 = /2060매매법3 실행</span>'); return; }
      const T = M.전체 || {}, yy = (typeof r2060Y !== 'undefined') ? r2060Y : null, Y = (M.연도 || []).find(r => r.y === yy), E = M.예정;
      el.insertAdjacentHTML('beforeend', `<br><span style="color:${G}">③</span> <b style="color:${G}">2060매매법3</b>(기준봉판 · 20·60 동시 돌파 기준봉 눌림 · 걸린 종목 전부) · 칸 ${Number(M.칸).toLocaleString('ko-KR')}개(${ymd(M.첫칸)}~) · 첫 신호 확정 ${Number(T.n || 0).toLocaleString('ko-KR')}건 +20% 도달 <b>${T.up}%</b> · 평균 ${pct(T.rr, 2)} · 중앙 ${pct(T.med, 2)} · 승률 ${T.win}% · 평균손실 ${pct(T.loss, 2)} · 결과대기 ${M.결과대기}`
        + (Y && Y.n ? ` · ${yy}년 ${Y.n}건 +20% ${Y.up}% 평균 ${pct(Y.rr, 2)}` : '')
        + (E ? ` · <span style="color:#7ee8ff">예정 ${ymd(E.매수일)} ${E.종목.length}종목(${E.종목.map(esc).join(', ') || '없음'})</span>` : '')
        + ` · <span style="color:#ff9aaa">${esc(M.판정 || '관찰전용')} · 매수추천 아님</span>`);
    };
  }
  // ---- 월 띠: 2060매매법3 만 있는 달도 표시
  if (typeof renderR2060MonthStrip === 'function') {
    const _strip = window.renderR2060MonthStrip;
    window.renderR2060MonthStrip = function () {
      _strip();
      const strip = document.getElementById('r2060-month-strip'); if (!strip || typeof r2060Y === 'undefined') return;
      const A = A3();
      [...strip.children].forEach((btn, i) => {
        const pre = `${r2060Y}-${String(i + 1).padStart(2, '0')}`;
        let n = 0; Object.keys(A).forEach(k => { if (k.startsWith(pre)) n += (A[k].n || 0); });
        if (!n) return;
        btn.title = (btn.title || '').replace(' 자료 없음', '') + ` · ③ 2060매매법3 ${n}종목`;
        if (!btn.classList.contains('active')) btn.classList.add('has-data');
      });
    };
  }
  // ---- 설명 박스·버튼 설명에 한 줄
  function note() {
    const box = document.getElementById('r2060-desc');
    if (box && !box.querySelector('.r2060c-note'))
      box.insertAdjacentHTML('beforeend', `<div class="r2060c-note" style="margin-top:6px"><span style="color:${G}">③</span> 같은 칸의 보라 <b style="color:${G}">③ 묶음</b> = <b>2060매매법3</b>(스킬 /2060매매법3 · 기준봉판 = 20·60일선 동시 돌파 기준봉 +10%·거래량 2배 → 고점 뒤 −10% 눌림 → 2060 근처 지지 → 5일선에 걸친 캔들·하락 멈춤 → 기준봉 저가 지킴 → 20일선 상승 · 걸린 종목 전부) · 매수일 시가 → +20% 지정가 또는 10번째 거래일 종가 · +20✓ = 10일 안 +20% 닿음 · 회색 재신호 = 같은 기준봉 두 번째 이후(통계 제외) · <b style="color:#ff9aaa">관찰전용 · 매수추천 아님(과거 +20% 도달은 같은 날 무작위의 1.6배지만 같은 변동성 종목과 비교하면 0.91배 = 잘 흔들리는 종목을 고른 효과뿐 · 사면 평균 손해)</b></div>`);
    const btn = [...document.querySelectorAll('.h-nav-btn')].find(b => (b.getAttribute('onclick') || '').includes("setView('r2060')"));
    if (btn && !(btn.title || '').includes('2060매매법3')) btn.title += ' ·· + ③ 2060매매법3(기준봉판 · 보라 묶음)';
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', note); else note();
  try { const v = document.getElementById('r2060-view'); if (v && v.innerHTML && typeof renderR2060Calendar === 'function') renderR2060Calendar(); } catch (e) { }
})();
