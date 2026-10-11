// ════════ 🏹 2060 달력 + 2060매매법4 (2026-09-30 사용자 지시 "2060버튼에 네가 걸러준 종목 추가 · 2060매매법4 · /매매일 하면 같이 · 천프정 일봉 가능한대로 모두") ════════
//   2060매매법4 = 스킬 /2060매매법4 = 사용자 프롬프트판 2060 (조건 10개 = A1 2060 동시돌파 기준봉 · A2 돌파자리 지킴 · B1 샌드위치 20선 지지 ·
//                 B2 샌드위치 뒤 60선 재돌파 · C20/C60 지지이탈 → 저항돌파 · D 원투쓰(해석) · E 5일선 중심 캔들(해석) · F20/F60 역배열 눌림 반등)
//                 규칙 = 매매법\2060_아침8시\r2060.py signals_at() · 빌더 = 매매법\2060_아침8시\_2060매매법4_달력.py
//   ★버튼·섹션을 따로 만들지 않는다(②·③과 같은 방식). 🏹 2060 달력 함수 4개(2060_뷰.js · ② · ③ 이 감싼 것)를 한 번 더 감싸
//     같은 칸 · 같은 상세 창 · 같은 요약 줄 · 같은 월 띠에 분홍 「④」 묶음을 더한다. 앞 세 파일은 건드리지 않는다.
//     ★이 파일은 2060매매법3_뷰.js 뒤에 읽혀야 한다.
//   자료 = dashboard/data/2060매매법4_과거.js + 2060매매법4.js (window.R2060_4_ARCHIVE / R2060_4_META · 칸 = 매수일 'YYYY-MM-DD')
//   칸 r = {d 매수일, s 신호일, n 이날 걸린 종목 전부 수, c 조건별 수[A1,A2,B1,B2,C20,C60,D,E,F20,F60], f3 조건 가족 3개+ 수, p 순위 5종목}
//   p = [0이름, 1코드, 2가족수, 3조건, 4신호일등락%, 5신호일대금억, 6신호일종가(원본), 7매수가(시가), 8상태(R 확정/L 시가상한가/X 자료이상/P 예정/S 자료끊김),
//        9당일종가등락%(신호일 종가 대비), 10당일고가%(신호일 종가 대비), 11규칙수익%, 12 +20도달(시가 대비), 13시가갭%, 14근거(올해만 · 지난해는 null)]
//   ★결과는 전부 규칙대로 샀다고 가정한 계산(매수일 시가 → 시가 +20% 닿으면 익절 · 아니면 그날 종가 · 비용 0.3%) = 실제 매매와 무관 · 관찰전용 · 매수추천 아님
(function () {
  if (typeof buildR2060Cell !== 'function' || typeof openR2060Detail !== 'function') {
    console.warn('2060매매법4: 🏹 2060 달력 화면(2060_뷰.js)이 없어 ④ 묶음을 안 붙임'); return;
  }
  const G = '#ff8fd0', GL = '#ffd3ee', GD = '#cf8fb5', GB = '#6b3f5c';      // 분홍 = 2060매매법4
  const LABS = ['A1', 'A2', 'B1', 'B2', 'C20', 'C60', 'D', 'E', 'F20', 'F60'];
  const A4 = () => window.R2060_4_ARCHIVE || {};
  const esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const pct = (v, dg) => { if (v == null || v !== v) return '—'; const n = Number(v); return `<span style="color:${n >= 0 ? '#ff8a8a' : '#7ea6ff'}">${n >= 0 ? '+' : ''}${n.toFixed(dg == null ? 1 : dg)}%</span>`; };
  const ymd = s => { s = String(s || ''); return s.length === 8 ? `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6)}` : s; };
  const md = s => { s = String(s || ''); return s.length === 8 ? `${s.slice(4, 6)}/${s.slice(6)}` : s; };
  const won = v => (v == null || v !== v) ? '—' : Number(v).toLocaleString('ko-KR');
  const has4 = r => !!(r && r.n);
  const GS = { L: '시가상한가', X: '자료이상', P: '예정', S: '자료끊김' };
  const short = p => {                                                       // 칸 안 한 줄 결과
    const o = p[8];
    if (o === 'R') return p[12] ? '<span style="color:#ff8a8a">+20✓</span>' : pct(p[11]);
    if (o === 'P') return '<span style="color:#7ee8ff">예정</span>';
    return `<span style="color:#8487bd">${GS[o] || '자료이상'}</span>`;
  };
  // ---- 칸: 앞(①·②·③) 칸 그대로 + 아래에 ④ 묶음
  function group(r) {
    const P = r.p || [], more = (r.n || 0) - P.length;
    let h = `<div style="margin-top:3px;border-top:1px dashed ${GB};padding-top:2px" title="④ 2060매매법4 (사용자 프롬프트판) · 신호일 ${esc(r.s)} 종가까지 → 매수일 시가 · 시가 +20% 닿으면 익절 아니면 그날 종가 · 규칙대로 샀다고 가정한 계산 · 순위 = 조건 가족 수 → 거래대금">`
      + `<div style="font-size:9.5px;color:${GD}">④ 신호 ${md(r.s)} · <b style="color:${G}">${P.length}</b>종목${more > 0 ? ` <span style="color:#6b6e9c" title="이날 조건에 걸린 종목 전부 ${r.n}개 중 순위 5만 칸에 · 누르면 조건별 수">+${more} 걸림</span>` : ''}</div>`;
    P.forEach(p => {
      const tip = `④ ${esc(p[0])} (${p[1]}) · ${esc(p[3])} · 조건 가족 ${p[2]}개 · 신호일 ${p[4] >= 0 ? '+' : ''}${p[4]}% · 대금 ${p[5]}억 · 매수가 ${won(p[7])} · 당일 종가 ${p[9] == null ? '—' : p[9] + '%'} 고가 ${p[10] == null ? '—' : p[10] + '%'}`;
      h += `<div style="font-size:10px;line-height:1.35;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:${GL}" title="${tip}"><b>${esc(p[0])}</b> ${short(p)} <span style="font-size:9px;color:${GD}">${esc(p[3])}</span></div>`;
    });
    return h + '</div>';
  }
  const _cell = window.buildR2060Cell;
  window.buildR2060Cell = function (d, k, rec, otherMonth, dow) {
    let html = _cell(d, k, rec, otherMonth, dow);
    const r = A4()[k];
    if (!has4(r)) return html;
    const i = html.lastIndexOf('</div>');
    html = html.slice(0, i) + group(r) + html.slice(i);
    if (!html.includes('openR2060Detail('))                                  // ①·②·③ 종목이 없는 날도 눌리게
      html = html.replace('<div class="cal-cell', `<div onclick="openR2060Detail('${k}')" style="cursor:pointer" class="cal-cell has-data`);
    return html;
  };
  // ---- 상세 창: ①·②·③ 아래에 ④ 표
  function detail(k, r) {
    const TH = 'style="color:#8487bd;white-space:nowrap;padding:3px 7px;text-align:left"';
    const ST = { R: '확정', L: '시가상한가(사기 어려움 · 통계 제외)', X: '자료이상(분할·재개 · 통계 제외)', P: '예정(명단만 정해짐)', S: '자료끊김(거래정지 등)' };
    const clk = (code, name) => ` onclick="_openStock(this,function(){openR2060Detail('${k}')})" data-code="${code}" data-name="${esc(name)}" data-rate="0" data-amount="0" data-meta="🏹2060④ ${k}" data-catalyst="" title="클릭 → 종목 상세(차트·일봉)"`;
    const C = r.c || [];
    let h = `<div style="margin-top:18px;padding-top:12px;border-top:2px solid ${GB}">
      <div style="font-size:17px;font-weight:700;color:${G}">④ 2060매매법4 · 매수일 ${k}
        <span style="font-size:12px;font-weight:600;color:#ff9aaa;background:rgba(255,154,170,.1);border:1px solid rgba(255,154,170,.35);padding:2px 9px;border-radius:10px;margin-left:8px">관찰전용 · 매수추천 아님</span></div>
      <div style="font-size:12px;color:#8487bd;margin-top:6px;line-height:1.6">사용자 프롬프트판 2060 = 조건 10개 중 하나라도 걸린 종목 · 신호일 <b style="color:#c9cbe8">${ymd(r.s)}</b> 종가까지만 보고 판정 ·
        이날 걸린 종목 전부 <b style="color:#c9cbe8">${Number(r.n).toLocaleString('ko-KR')}</b>개 (조건 가족 3개 이상 ${r.f3 || 0}개) · 조건별 ${LABS.map((a, i) => `${a} ${C[i] || 0}`).join(' · ')}<br>
        아래는 순위 5 = 걸린 조건 가족(A~F) 수 많은 순 → 신호일 거래대금 큰 순 · <b style="color:#c9cbe8">결과는 규칙대로 샀다고 가정한 계산(실제 매매와 무관)</b> = 매수일 시가 → 시가 +20% 닿으면 익절 · 아니면 그날 종가 · 비용 0.3% · 과거 평균은 음수(같은 날 전 종목보다 나쁨)</div>`;
    const P = r.p || [];
    h += `<table style="margin-top:8px;border-collapse:collapse;font-size:12.5px;color:#e4e6ff"><tr><th ${TH}>순</th><th ${TH}>종목</th><th ${TH}>조건</th><th ${TH}>가족</th><th ${TH}>신호일 등락</th><th ${TH}>대금(억)</th><th ${TH}>신호일 종가</th><th ${TH}>매수가(시가)</th><th ${TH}>결과</th><th ${TH}>규칙수익</th><th ${TH}>당일 종가</th><th ${TH}>당일 고가</th></tr>`;
    P.forEach((p, i) => {
      const S = 'style="white-space:nowrap;padding:3px 7px"', pend = p[8] === 'P' || p[8] === 'S';
      h += `<tr style="border-top:1px solid ${GB}"><td ${S}>${i + 1}</td>`
        + `<td ${S}><span${clk(p[1], p[0])} style="cursor:pointer;color:${GL};font-weight:700">${esc(p[0])}</span> <span style="color:#6b6e9c">${p[1]}</span></td>`
        + `<td ${S}>${esc(p[3])}</td><td ${S}>${p[2]}</td><td ${S}>${pct(p[4], 1)}</td><td ${S}>${won(p[5])}</td><td ${S}>${won(p[6])}</td>`
        + `<td ${S}>${won(p[7])}${p[13] == null ? '' : ' <span style="color:#8487bd">갭 ' + (p[13] >= 0 ? '+' : '') + p[13] + '%</span>'}</td>`
        + `<td ${S}>${(ST[p[8]] || '') + (p[8] === 'R' && p[12] ? ' · 시가 +20% 닿음' : '')}</td>`
        + `<td ${S}>${p[11] == null ? '—' : pct(p[11], 2)}</td><td ${S}>${pend ? '—' : pct(p[9], 1)}</td><td ${S}>${pend ? '—' : pct(p[10], 1)}</td></tr>`;
      if (p[14]) h += `<tr><td></td><td colspan="11" style="padding:0 7px 5px;font-size:11.5px;color:#9a9cc4;white-space:normal;line-height:1.5">${esc(p[14]).split(' | ').join('<br>')}</td></tr>`;
    });
    h += '</table>';
    if (!P.some(p => p[14])) h += '<div style="margin-top:6px;font-size:11.5px;color:#6b6e9c">근거 문장은 올해 칸에만 싣는다(지난해 칸은 조건 기호만 · 용량)</div>';
    h += `<div style="margin-top:8px;font-size:11.5px;color:#6b6e9c;line-height:1.6">A1 2060 동시돌파 기준봉(+5%·거래량 2배) · A2 1~5일 전 기준봉의 돌파선을 종가로 지킴 · B1 하락 60선 저항 뒤 상승 20선 지지 양봉 · B2 샌드위치 20선 지지 뒤 60선 종가 재돌파 · C20/C60 선 이탈 뒤 선 아래 버팀 → 종가 돌파 · D 원투쓰(해석 = 3연속 양봉·20/60선에 걸친 봉) · E 5일선 중심 캔들(해석 = 5일선을 가로지른 양봉 몸통 절반 지킴) · F20/F60 역배열에서 +30% 뒤 눌림 → 20/60선 근처 반등 양봉</div>`;
    return h + '</div>';
  }
  const _open = window.openR2060Detail;
  window.openR2060Detail = function (k) {
    const r = A4()[k];
    const ov = document.getElementById('stock-modal-overlay'), body = document.getElementById('stock-modal-body');
    if (!has4(r) || !ov || !body) { _open(k); return; }
    body.insertAdjacentHTML('beforeend', '<i id="r2060d-sentinel" hidden></i>');   // 앞(①·②·③)이 창을 새로 그리면 사라진다
    _open(k);
    const sen = document.getElementById('r2060d-sentinel');
    if (sen) {                                                                // ①·②·③ 자료 없는 날 = 창을 여기서 연다
      sen.remove();
      body.innerHTML = `<div style="padding:6px 2px 4px"><div style="font-size:19px;font-weight:700;color:#ff9f5a">🏹 2060 · 매수일 ${k}</div>`
        + `<div style="font-size:12px;color:#8487bd;margin-top:6px">이날 2060매매법1·2·3 종목 없음</div></div>`;
      ov.style.display = 'flex';
      try { window.__배지복귀 = function () { openR2060Detail(k); }; } catch (e) { }
    }
    body.insertAdjacentHTML('beforeend', detail(k, r));
  };
  // ---- 요약 줄: 앞 요약 아래에 ④ 한 줄
  if (typeof renderR2060Meta === 'function') {
    const _meta = window.renderR2060Meta;
    window.renderR2060Meta = function () {
      _meta();
      const el = document.getElementById('r2060-meta'), M = window.R2060_4_META;
      if (!el) return;
      if (!M) { el.insertAdjacentHTML('beforeend', '<br><span style="color:#ff9aaa">❌ 2060매매법4.js 가 안 읽혔다 = /2060매매법4 실행</span>'); return; }
      const T = M.전체 || {}, yy = (typeof r2060Y !== 'undefined') ? r2060Y : null, Y = (M.연도 || []).find(r => r.y === yy), E = M.예정;
      el.insertAdjacentHTML('beforeend', `<br><span style="color:${G}">④</span> <b style="color:${G}">2060매매법4</b>(사용자 프롬프트판 · 조건 10개 · 칸엔 순위 5) · 칸 ${Number(M.칸).toLocaleString('ko-KR')}개(${ymd(M.첫칸)}~) · 순위 5 확정 ${Number(T.n || 0).toLocaleString('ko-KR')}건 시가 +20% 닿음 <b>${T.up}%</b>(같은 날 전 종목 ${T.bup}%) · 평균 ${pct(T.rr, 2)}(전 종목 ${pct(T.brr, 2)}) · 중앙 ${pct(T.med, 2)} · 승률 ${T.win}% · 평균손실 ${pct(T.loss, 2)}`
        + (Y && Y.n ? ` · ${yy}년 ${Y.n}건 +20% ${Y.up}% 평균 ${pct(Y.rr, 2)}` : '')
        + (E ? ` · <span style="color:#7ee8ff">예정 ${ymd(E.매수일)} ${E.종목.length}종목(${E.종목.map(esc).join(', ') || '없음'})</span>` : '')
        + ` · <span style="color:#ff9aaa">${esc(M.판정 || '관찰전용')} · 매수추천 아님</span>`);
    };
  }
  // ---- 월 띠: 2060매매법4 만 있는 달도 표시
  if (typeof renderR2060MonthStrip === 'function') {
    const _strip = window.renderR2060MonthStrip;
    window.renderR2060MonthStrip = function () {
      _strip();
      const strip = document.getElementById('r2060-month-strip'); if (!strip || typeof r2060Y === 'undefined') return;
      const A = A4();
      [...strip.children].forEach((btn, i) => {
        const pre = `${r2060Y}-${String(i + 1).padStart(2, '0')}`;
        let n = 0; Object.keys(A).forEach(k => { if (k.startsWith(pre) && A[k].n) n += 1; });
        if (!n) return;
        btn.title = (btn.title || '').replace(' 자료 없음', '') + ` · ④ 2060매매법4 ${n}일`;
        if (!btn.classList.contains('active')) btn.classList.add('has-data');
      });
    };
  }
  // ---- 설명 박스·버튼 설명에 한 줄
  function note() {
    const box = document.getElementById('r2060-desc');
    if (box && !box.querySelector('.r2060d-note'))
      box.insertAdjacentHTML('beforeend', `<div class="r2060d-note" style="margin-top:6px"><span style="color:${G}">④</span> 같은 칸의 분홍 <b style="color:${G}">④ 묶음</b> = <b>2060매매법4</b>(스킬 /2060매매법4 · 사용자 프롬프트판 = 2060 동시돌파·돌파자리 지킴·샌드위치·지지이탈 저항돌파·원투쓰·5일선 캔들·역배열 눌림 · 하루 수백 종목이 걸려 칸엔 조건이 많이 겹친 순위 5 · +N 걸림 = 나머지) · 매수일 시가 → 시가 +20% 닿으면 익절 아니면 그날 종가 · +20✓ = 그날 시가 +20% 닿음 · <b style="color:#ff9aaa">관찰전용 · 매수추천 아님(9월 검증 = 신호일 등락 맞추면 +20% 1.5배 · 사면 중앙값 손해)</b></div>`);
    const btn = [...document.querySelectorAll('.h-nav-btn')].find(b => (b.getAttribute('onclick') || '').includes("setView('r2060')"));
    if (btn && !(btn.title || '').includes('2060매매법4')) btn.title += ' ·· + ④ 2060매매법4(사용자 프롬프트판 · 분홍 묶음)';
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', note); else note();
  try { const v = document.getElementById('r2060-view'); if (v && v.innerHTML && typeof renderR2060Calendar === 'function') renderR2060Calendar(); } catch (e) { }
})();
