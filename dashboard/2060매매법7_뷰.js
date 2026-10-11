// ════════ 🏹 2060 달력 + 2060매매법7 (2026-09-30 사용자 지시 "2060버튼에 네가 걸러준 종목 추가 · 2060매매법7 · /매매일 하면 같이 · 천프정 일봉 가능한대로 모두") ════════
//   2060매매법7 = 스킬 /2060매매법7 = 불화살2060 (유튜브 「차트는 불화살」 2060 영상 5편 + 채널 자막 정의)
//                 A 2060 지지 눌림 = 60일 안 +30% 치고 올라감 → 고점 뒤 −10%↓ → 최근 3일 저가가 2060 구간 ±3% → 원투쓰 또는 5일선 올라탐 (목표 = 앞 고점)
//                 B 2060 아래 회복 = 60일 안 +30% → 종가가 20·60 둘 다 아래 → 최근 5일 저가가 전저점 ±3% → 5일선 올라탐 (목표 = 2060선)
//                 칸엔 신호일 등락률 큰 순 앞 5(= 하루 5개 · 사전등록 v2) · 상세 창에 그날 걸린 종목 전부
//                 규칙 = 매매법\불화살2060\_2060공통.py · 빌더 = 매매법\불화살2060\_2060매매법7_달력.py
//   ★버튼·섹션을 따로 만들지 않는다(②~⑥과 같은 방식). 🏹 2060 달력 함수(2060_뷰.js · ②~⑥이 감싼 것)를 한 번 더 감싸
//     같은 칸 · 같은 상세 창 · 같은 요약 줄 · 같은 월 띠에 하늘색 「⑦」 묶음을 더한다. 앞 여섯 파일은 건드리지 않는다.
//     ★이 파일은 2060매매법6_뷰.js 뒤에 읽혀야 한다.
//   자료 = dashboard/data/2060매매법7_과거.js + 2060매매법7.js (window.R2060_7_ARCHIVE / R2060_7_META · 칸 = 매수일 'YYYY-MM-DD')
//   칸 r = {d 매수일, s 신호일, n 이날 걸린 종목 전부 수, p 걸린 종목 전부(신호일 등락률 큰 순 · 앞 5 = 하루 5개)}
//   p(전체 칸 18) = [0이름, 1코드, 2갈래(A/B/AB), 3트리거(O 원투쓰 · 5 5일선), 4신호일 등락%, 5익절 목표가(원본), 6약속 목표%, 7손절가(신호봉 저가 · 원본),
//        8신호일 종가(원본), 9상태(R 확정 / W 결과대기 / N 진입 안 함 / P 예정 / S 자료끊김), 10원문 청산%, 11청산(T 익절 · S 손절 · E 10봉 만료 · O 평가 · G 시가<손절 · U 시가>목표),
//        12 ✓20(10봉 안 고가 ≥ 신호일 종가×1.2 · 1/0/null), 13 10봉 최고%, 14 20일 평균대금억, 15 진입가(원본), 16 하루5(1/0), 17 ⭐약속 목표 ≥ +20%(1/0)]
//   p(짧은 칸 7 · 지난해 칸의 앞 5 밖 · 용량) = [0이름, 1코드, 2갈래, 3상태, 4원문 청산%, 5 ✓20, 6 10봉 최고%]
//   ★결과는 전부 규칙대로 샀다고 가정한 계산 = 실제 매매와 무관 · 관찰전용 · 매수추천 아님(사전등록 v1·v2 기각)
(function () {
  if (typeof buildR2060Cell !== 'function' || typeof openR2060Detail !== 'function') {
    console.warn('2060매매법7: 🏹 2060 달력 화면(2060_뷰.js)이 없어 ⑦ 묶음을 안 붙임'); return;
  }
  const G = '#6fb8ff', GL = '#d2e9ff', GD = '#7fa6cc', GB = '#2f4a66';      // 하늘 = 2060매매법7
  const CELLN = 5;                                                            // 칸 안에는 하루 5개(신호일 등락률 순) · 나머지는 상세 창
  const A7 = () => window.R2060_7_ARCHIVE || {};
  const esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const pct = (v, dg) => { if (v == null || v !== v) return '—'; const n = Number(v); return `<span style="color:${n >= 0 ? '#ff8a8a' : '#7ea6ff'}">${n >= 0 ? '+' : ''}${n.toFixed(dg == null ? 1 : dg)}%</span>`; };
  const ymd = s => { s = String(s || ''); return s.length === 8 ? `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6)}` : s; };
  const md = s => { s = String(s || ''); return s.length === 8 ? `${s.slice(4, 6)}/${s.slice(6)}` : s; };
  const won = v => (v == null || v !== v) ? '—' : Number(v).toLocaleString('ko-KR');
  const has7 = r => !!(r && r.n);
  const AB = { A: 'A 2060 지지', B: 'B 2060 아래', AB: 'A+B' };
  const TR = { O: '원투쓰', '5': '5일선 올라탐' };
  const ST = { R: '확정', W: '결과대기(10봉 안 됨)', N: '진입 안 함', P: '예정(명단만 정해짐)', S: '자료끊김(거래정지 등)' };
  const EX = { T: '익절(목표 도달)', S: '손절(신호봉 저가 이탈)', E: '10봉 만료', O: '평가(아직 안 끝남)', G: '시가가 손절선 아래 = 진입 안 함', U: '시가가 목표 위 = 진입 안 함', X: '목표 계산 불가' };
  const norm = p => p.length > 7
    ? { nm: p[0], cd: p[1], ab: p[2], tr: p[3], r1: p[4], tg: p[5], pr: p[6], sp: p[7], cl: p[8], st: p[9], rr: p[10], ex: p[11], h20: p[12], mx: p[13], amt: p[14], ent: p[15], top: p[16], star: p[17], slim: 0 }
    : { nm: p[0], cd: p[1], ab: p[2], st: p[3], rr: p[4], h20: p[5], mx: p[6], top: 0, slim: 1 };
  const short = q => {                                                       // 칸 안 한 줄 결과
    if (q.h20 === 1) return '<span style="color:#ff8a8a">+20✓</span>';
    if (q.st === 'R') return pct(q.rr);
    if (q.st === 'P') return '<span style="color:#7ee8ff">예정</span>';
    if (q.st === 'W') return '<span style="color:#8487bd">대기</span>';
    if (q.st === 'N') return '<span style="color:#8487bd">진입안함</span>';
    return '<span style="color:#8487bd">자료끊김</span>';
  };
  // ---- 칸: 앞(①~⑥) 칸 그대로 + 아래에 ⑦ 묶음
  function group(r) {
    const P = (r.p || []).slice(0, CELLN).map(norm), more = (r.n || 0) - P.length;
    let h = `<div style="margin-top:3px;border-top:1px dashed ${GB};padding-top:2px" title="⑦ 2060매매법7 (불화살2060 · 영상 5편) · 신호일 ${esc(r.s)} 종가까지 → 매수일 · 칸 = 신호일 등락률 큰 순 앞 5(하루 5개) · +20✓ = 10봉 안 고가가 신호일 종가 +20% 닿음 · 숫자 = 원문 청산(매수일 시가 진입 · 신호봉 저가 손절 · 앞 고점/2060선 익절 · 10봉) 결과 · 규칙대로 샀다고 가정한 계산">`
      + `<div style="font-size:9.5px;color:${GD}">⑦ 신호 ${md(r.s)} · <b style="color:${G}">${r.n}</b>종목${more > 0 ? ` <span style="color:#6b6e9c" title="이날 걸린 종목 전부 ${r.n}개 중 앞 ${P.length}개만 칸에 · 누르면 전부">+${more} 걸림</span>` : ''}</div>`;
    P.forEach(q => {
      const tip = `⑦ ${esc(q.nm)} (${q.cd}) · ${AB[q.ab] || q.ab}${q.tr ? ' · ' + (TR[q.tr] || q.tr) : ''} · 신호일 등락 ${q.r1 == null ? '—' : q.r1 + '%'} · 익절 목표 ${won(q.tg)} · 손절 ${won(q.sp)} · 10봉 최고 ${q.mx == null ? '—' : q.mx + '%'} · ${ST[q.st] || ''}`;
      h += `<div style="font-size:10px;line-height:1.35;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:${GL}" title="${tip}"><b>${esc(q.nm)}</b> ${short(q)} <span style="font-size:9px;color:${GD}">${q.ab === 'B' ? 'B' : 'A'}${q.r1 == null ? '' : ' ' + (q.r1 >= 0 ? '+' : '') + q.r1 + '%'}</span></div>`;
    });
    return h + '</div>';
  }
  const _cell = window.buildR2060Cell;
  window.buildR2060Cell = function (d, k, rec, otherMonth, dow) {
    let html = _cell(d, k, rec, otherMonth, dow);
    const r = A7()[k];
    if (!has7(r)) return html;
    const i = html.lastIndexOf('</div>');
    html = html.slice(0, i) + group(r) + html.slice(i);
    if (!html.includes('openR2060Detail('))                                  // ①~⑥ 종목이 없는 날도 눌리게
      html = html.replace('<div class="cal-cell', `<div onclick="openR2060Detail('${k}')" style="cursor:pointer" class="cal-cell has-data`);
    return html;
  };
  // ---- 상세 창: ①~⑥ 아래에 ⑦ 표(걸린 종목 전부)
  function detail(k, r) {
    const TH = 'style="color:#8487bd;white-space:nowrap;padding:3px 7px;text-align:left"';
    const clk = (code, name) => ` onclick="_openStock(this,function(){openR2060Detail('${k}')})" data-code="${code}" data-name="${esc(name)}" data-rate="0" data-amount="0" data-meta="🏹2060⑦ ${k}" data-catalyst="" title="클릭 → 종목 상세(차트·일봉)"`;
    let h = `<div style="margin-top:18px;padding-top:12px;border-top:2px solid ${GB}">
      <div style="font-size:17px;font-weight:700;color:${G}">⑦ 2060매매법7 · 매수일 ${k}
        <span style="font-size:12px;font-weight:600;color:#ff9aaa;background:rgba(255,154,170,.1);border:1px solid rgba(255,154,170,.35);padding:2px 9px;border-radius:10px;margin-left:8px">관찰전용 · 매수추천 아님</span></div>
      <div style="font-size:12px;color:#8487bd;margin-top:6px;line-height:1.6">불화살2060 = 유튜브 「차트는 불화살」 2060 영상 5편 · A 2060 지지 눌림(치고 올라간 주가가 고점 찍고 2060 구간까지 내려와 원투쓰·5일선 올라탐 · 목표 앞 고점) ·
        B 2060 아래 회복(20·60선 아래 전저점에서 멈추고 5일선 올라탐 · 목표 2060선) · 신호일 <b style="color:#c9cbe8">${ymd(r.s)}</b> 종가까지만 보고 판정 · 이날 걸린 종목 전부 <b style="color:#c9cbe8">${Number(r.n).toLocaleString('ko-KR')}</b>개(★ = 칸에 보인 하루 5개 = 신호일 등락률 순)<br>
        <b style="color:#c9cbe8">결과는 규칙대로 샀다고 가정한 계산(실제 매매와 무관)</b> · 원문 청산 = 매수일 시가 진입(시가가 손절선 아래거나 목표 위면 안 삼) · 신호봉 저가 이탈 손절 · 익절 A 앞 고점 / B 가까운 2060선 · 최대 10봉 · 같은 봉 둘 다면 손절 먼저 · 비용 0.3% ·
        ✓20 = 신호일 다음 10봉 안 고가가 신호일 종가 +20% 닿음 · 검증 결론 = 사전등록 v1·v2 기각(v1 HOLDOUT 조정 lift 1.09~1.11 · v2 하루5 원문 청산 HOLDOUT −0.87·−1.41·−1.64% · 봉인2 2010~2015 −1.29·−1.23%)</div>`;
    const P = (r.p || []).map(norm);
    h += `<table style="margin-top:8px;border-collapse:collapse;font-size:12.5px;color:#e4e6ff"><tr><th ${TH}>순</th><th ${TH}>종목</th><th ${TH}>갈래·트리거</th><th ${TH}>신호일 등락</th><th ${TH}>신호일 종가</th><th ${TH}>익절 목표</th><th ${TH}>손절가</th><th ${TH}>20일 평균(억)</th><th ${TH}>10봉 최고</th><th ${TH}>원문 청산</th></tr>`;
    P.forEach((q, i) => {
      const S = 'style="white-space:nowrap;padding:3px 7px"';
      const trade = q.st === 'R' || q.st === 'W'
        ? `${q.slim ? '' : won(q.ent) + ' 진입 → '}${pct(q.rr, 1)} <span style="color:#8487bd">${q.slim ? (ST[q.st] || '') : (EX[q.ex] || '')}</span>`
        : `<span style="color:#8487bd">${q.st === 'N' && !q.slim ? (EX[q.ex] || ST.N) : (ST[q.st] || '')}</span>`;
      h += `<tr style="border-top:1px solid ${GB}"><td ${S}>${i + 1}${q.top ? ' <span style="color:' + G + '">★</span>' : ''}</td>`
        + `<td ${S}><span${clk(q.cd, q.nm)} style="cursor:pointer;color:${GL};font-weight:700">${esc(q.nm)}</span> <span style="color:#6b6e9c">${q.cd}</span>${q.star ? ' <span style="color:#ffd166" title="원문 약속 목표가 +20% 이상">⭐</span>' : ''}</td>`
        + `<td ${S}>${AB[q.ab] || q.ab}${q.tr ? ' <span style="color:#8487bd">' + (TR[q.tr] || '') + '</span>' : ''}</td>`
        + `<td ${S}>${q.r1 == null ? '—' : pct(q.r1, 1)}</td><td ${S}>${won(q.cl)}</td>`
        + `<td ${S}>${q.slim ? '—' : won(q.tg) + ' <span style="color:#8487bd">(약속 ' + (q.pr >= 0 ? '+' : '') + q.pr + '%)</span>'}</td>`
        + `<td ${S}>${q.slim ? '—' : won(q.sp) + ' <span style="color:#8487bd">(' + (q.cl ? ((q.sp / q.cl - 1) * 100).toFixed(1) + '%' : '—') + ')</span>'}</td>`
        + `<td ${S}>${q.amt == null ? '—' : q.amt}</td>`
        + `<td ${S}>${q.mx == null ? '—' : pct(q.mx, 1)}${q.h20 === 1 ? ' <span style="color:#ff8a8a">✓20</span>' : (q.h20 == null && q.mx != null ? ' <span style="color:#8487bd">(10봉 안 됨)</span>' : '')}</td>`
        + `<td ${S}>${trade}</td></tr>`;
    });
    h += '</table>';
    if (P.some(q => q.slim)) h += '<div style="margin-top:6px;font-size:11.5px;color:#6b6e9c">지난해 칸의 앞 5 밖 종목은 이름·결과만 싣는다(용량 · 올해 칸은 전부 자세히)</div>';
    h += `<div style="margin-top:8px;font-size:11.5px;color:#6b6e9c;line-height:1.6">문턱(원문에 숫자가 없어 클로드가 결과 보기 전에 고정 · 사전등록 db2e65b) = 60일 안 상승 +30%↑ · 고점 대비 −10%↓ · 2060 구간·전저점 ±3% · 원투쓰(①10일 최저 양봉/도지 ②그 저가 지킴 ③두 봉 고가 위 마감) ·
      20일 평균대금 5억↑ · 상장 130봉↑ · 스팩·우선주 제외 · 최근 130봉에 하루 ±30.5%(2015-06-15 전은 ±15.5%) 넘는 날 없음 · 가격 = 사건표로 분할·병합 보정</div>`;
    return h + '</div>';
  }
  const _open = window.openR2060Detail;
  window.openR2060Detail = function (k) {
    const r = A7()[k];
    const ov = document.getElementById('stock-modal-overlay'), body = document.getElementById('stock-modal-body');
    if (!has7(r) || !ov || !body) { _open(k); return; }
    body.insertAdjacentHTML('beforeend', '<i id="r2060d7-sentinel" hidden></i>');  // 앞(①~⑥)이 창을 새로 그리면 사라진다
    _open(k);
    const sen = document.getElementById('r2060d7-sentinel');
    if (sen) {                                                                // ①~⑥ 자료 없는 날 = 창을 여기서 연다
      sen.remove();
      body.innerHTML = `<div style="padding:6px 2px 4px"><div style="font-size:19px;font-weight:700;color:#ff9f5a">🏹 2060 · 매수일 ${k}</div>`
        + `<div style="font-size:12px;color:#8487bd;margin-top:6px">이날 2060매매법1~6 종목 없음</div></div>`;
      ov.style.display = 'flex';
      try { window.__배지복귀 = function () { openR2060Detail(k); }; } catch (e) { }
    }
    body.insertAdjacentHTML('beforeend', detail(k, r));
  };
  // ---- 요약 줄: 앞 요약 아래에 ⑦ 한 줄
  if (typeof renderR2060Meta === 'function') {
    const _meta = window.renderR2060Meta;
    window.renderR2060Meta = function () {
      _meta();
      const el = document.getElementById('r2060-meta'), M = window.R2060_7_META;
      if (!el) return;
      if (!M) { el.insertAdjacentHTML('beforeend', '<br><span style="color:#ff9aaa">❌ 2060매매법7.js 가 안 읽혔다 = /2060매매법7 실행</span>'); return; }
      const T = M.제한30 || {}, yy = (typeof r2060Y !== 'undefined') ? r2060Y : null, Y = (M.연도 || []).find(r => r.y === yy), E = M.예정;
      el.insertAdjacentHTML('beforeend', `<br><span style="color:${G}">⑦</span> <b style="color:${G}">2060매매법7</b>(불화살2060 · 영상 5편 · A 2060 지지 눌림 · B 2060 아래 전저점 · 칸엔 신호일 등락률 순 앞 5 · 상세 창에 전부) · 칸 ${Number(M.칸).toLocaleString('ko-KR')}개(${ymd(M.첫칸)}~) · 걸림 ${Number(M.걸림).toLocaleString('ko-KR')}건 · 2015-06-15~ 하루5 ${Number(T.nl || 0).toLocaleString('ko-KR')}건 10봉 안 +20% <b>${T.up}%</b>(같은 날 풀 ${T.bup}%) · 원문 청산 확정 ${Number(T.nt || 0).toLocaleString('ko-KR')}건 평균 ${pct(T.rr, 2)} · 중앙 ${pct(T.med, 2)} · 승률 ${T.win}% · 평균손실 ${pct(T.loss, 2)}`
        + (Y && Y.n ? ` · ${yy}년 ${Y.n}건 +20% ${Y.up}% 청산 평균 ${pct(Y.rr, 2)}` : '')
        + (E ? ` · <span style="color:#7ee8ff">예정 ${ymd(E.매수일)} ${E.종목.length}종목(${E.종목.map(esc).join(', ') || '없음'})</span>` : '')
        + ` · <span style="color:#ff9aaa">${esc(M.판정 || '관찰전용')} · 매수추천 아님</span>`);
    };
  }
  // ---- 월 띠: 2060매매법7 만 있는 달도 표시
  if (typeof renderR2060MonthStrip === 'function') {
    const _strip = window.renderR2060MonthStrip;
    window.renderR2060MonthStrip = function () {
      _strip();
      const strip = document.getElementById('r2060-month-strip'); if (!strip || typeof r2060Y === 'undefined') return;
      const A = A7();
      [...strip.children].forEach((btn, i) => {
        const pre = `${r2060Y}-${String(i + 1).padStart(2, '0')}`;
        let n = 0; Object.keys(A).forEach(k => { if (k.startsWith(pre) && A[k].n) n += 1; });
        if (!n) return;
        btn.title = (btn.title || '').replace(' 자료 없음', '') + ` · ⑦ 2060매매법7 ${n}일`;
        if (!btn.classList.contains('active')) btn.classList.add('has-data');
      });
    };
  }
  // ---- 설명 박스·버튼 설명에 한 줄
  function note() {
    const box = document.getElementById('r2060-desc');
    if (box && !box.querySelector('.r2060d7-note'))
      box.insertAdjacentHTML('beforeend', `<div class="r2060d7-note" style="margin-top:6px"><span style="color:${G}">⑦</span> 같은 칸의 하늘색 <b style="color:${G}">⑦ 묶음</b> = <b>2060매매법7</b>(스킬 /2060매매법7 · 불화살2060 = 2060 영상 5편 · A 2060 지지 눌림 · B 2060 아래 전저점 · 칸엔 신호일 등락률 순 앞 5 = 하루 5개 · +N 걸림 = 나머지(눌러서 상세 창에 전부) · 작은 글씨 = 갈래·신호일 등락) · +20✓ = 10봉 안 고가가 신호일 종가 +20% 닿음 · 칸의 % = 원문 청산 결과 · <b style="color:#ff9aaa">관찰전용 · 매수추천 아님(사전등록 v1·v2 기각)</b></div>`);
    const btn = [...document.querySelectorAll('.h-nav-btn')].find(b => (b.getAttribute('onclick') || '').includes("setView('r2060')"));
    if (btn && !(btn.title || '').includes('2060매매법7')) btn.title += ' ·· + ⑦ 2060매매법7(불화살2060 · 하늘색 묶음)';
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', note); else note();
  try { const v = document.getElementById('r2060-view'); if (v && v.innerHTML && typeof renderR2060Calendar === 'function') renderR2060Calendar(); } catch (e) { }
})();
