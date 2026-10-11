// ════════ 🏹 2060 달력 + 2060매매법5 (2026-09-30 사용자 지시 "2060버튼에 네가 걸러준 종목 추가 · 2060매매법5 · /매매일 하면 같이 · 천프정 일봉 가능한대로 모두") ════════
//   2060매매법5 = 스킬 /2060매매법5 = 2060 제미니2 (A 2060 동시 돌파 기준봉 · B 힘의 중심(샌드위치) 눌림 반등 · C 골든크로스 전후 지지 반등 · 영역 = 두 선 위)
//                 규칙 = 매매법\2060_제미니2\_2060_제미니2.py (사전등록 _사전등록.md) · 빌더 = 매매법\2060_제미니2\_2060매매법5_달력.py
//   ★버튼·섹션을 따로 만들지 않는다(②·③·④와 같은 방식). 🏹 2060 달력 함수 4개(2060_뷰.js · ② · ③ · ④ 가 감싼 것)를 한 번 더 감싸
//     같은 칸 · 같은 상세 창 · 같은 요약 줄 · 같은 월 띠에 노랑 「⑤」 묶음을 더한다. 앞 네 파일은 건드리지 않는다.
//     ★이 파일은 2060매매법4_뷰.js 뒤에 읽혀야 한다.
//   자료 = dashboard/data/2060매매법5_과거.js + 2060매매법5.js (window.R2060_5_ARCHIVE / R2060_5_META · 칸 = 매수일 'YYYY-MM-DD')
//   칸 r = {d 매수일, s 신호일, n 이날 걸린 종목 전부 수, c 규칙별 수[A,B,C], p 순위 5종목}
//   p = [0이름, 1코드, 2규칙, 3과거확률%, 4신호일등락%, 5신호일대금억, 6신호일종가(원본), 7매수가(시가 원본), 8상태(R 확정/X 자료이상/P 예정/S 자료끊김),
//        9당일종가%(신호일 종가 대비), 10당일고가%(신호일 종가 대비), 11시가매수%(당일 종가÷시가), 12 ✓20(당일 고가 ≥ 신호일 종가×1.2), 13시가갭%, 14근거(올해만), 15 20일 평균대금억]
//   ★결과는 전부 규칙대로 샀다고 가정한 계산(비용 전) = 실제 매매와 무관 · 관찰전용 · 매수추천 아님
(function () {
  if (typeof buildR2060Cell !== 'function' || typeof openR2060Detail !== 'function') {
    console.warn('2060매매법5: 🏹 2060 달력 화면(2060_뷰.js)이 없어 ⑤ 묶음을 안 붙임'); return;
  }
  const G = '#ffd166', GL = '#ffeab0', GD = '#c9aa5e', GB = '#5e4d26';      // 노랑 = 2060매매법5
  const RULE = { A: 'A 동시돌파', B: 'B 샌드위치', C: 'C 골든크로스' };
  const A5 = () => window.R2060_5_ARCHIVE || {};
  const esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const pct = (v, dg) => { if (v == null || v !== v) return '—'; const n = Number(v); return `<span style="color:${n >= 0 ? '#ff8a8a' : '#7ea6ff'}">${n >= 0 ? '+' : ''}${n.toFixed(dg == null ? 1 : dg)}%</span>`; };
  const ymd = s => { s = String(s || ''); return s.length === 8 ? `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6)}` : s; };
  const md = s => { s = String(s || ''); return s.length === 8 ? `${s.slice(4, 6)}/${s.slice(6)}` : s; };
  const won = v => (v == null || v !== v) ? '—' : Number(v).toLocaleString('ko-KR');
  const has5 = r => !!(r && r.n);
  const thin = p => p[15] != null && p[15] < 1;                               // 20일 평균대금 1억 미만 = 사기 어려움
  const GS = { X: '자료이상', P: '예정', S: '자료끊김' };
  const short = p => {                                                       // 칸 안 한 줄 결과
    const o = p[8];
    if (o === 'R') return p[12] ? '<span style="color:#ff8a8a">+20✓</span>' : pct(p[11]);
    if (o === 'P') return '<span style="color:#7ee8ff">예정</span>';
    return `<span style="color:#8487bd">${GS[o] || '자료이상'}</span>`;
  };
  // ---- 칸: 앞(①~④) 칸 그대로 + 아래에 ⑤ 묶음
  function group(r) {
    const P = r.p || [], more = (r.n || 0) - P.length;
    let h = `<div style="margin-top:3px;border-top:1px dashed ${GB};padding-top:2px" title="⑤ 2060매매법5 (제미니2) · 신호일 ${esc(r.s)} 종가까지 → 매수일 · +20✓ = 매수일 고가가 신호일 종가 +20% 닿음 · 숫자 = 매수일 시가에 사서 그날 종가(비용 전) · 규칙대로 샀다고 가정한 계산 · 순위 = 과거 확률표 → 거래대금">`
      + `<div style="font-size:9.5px;color:${GD}">⑤ 신호 ${md(r.s)} · <b style="color:${G}">${P.length}</b>종목${more > 0 ? ` <span style="color:#6b6e9c" title="이날 규칙에 걸린 종목 전부 ${r.n}개 중 순위 5만 칸에 · 누르면 규칙별 수">+${more} 걸림</span>` : ''}</div>`;
    P.forEach(p => {
      const tip = `⑤ ${esc(p[0])} (${p[1]}) · ${esc(p[2])} · 과거확률 ${p[3]}% · 신호일 ${p[4] >= 0 ? '+' : ''}${p[4]}% · 대금 ${p[5]}억 · 20일 평균 ${p[15]}억${thin(p) ? ' ⚠거래 적음' : ''} · 매수가 ${won(p[7])} · 당일 종가 ${p[9] == null ? '—' : p[9] + '%'} 고가 ${p[10] == null ? '—' : p[10] + '%'}`;
      h += `<div style="font-size:10px;line-height:1.35;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:${GL}" title="${tip}"><b>${esc(p[0])}</b>${thin(p) ? '<span style="color:#8487bd">⚠</span>' : ''} ${short(p)} <span style="font-size:9px;color:${GD}">${esc(p[2])}</span></div>`;
    });
    return h + '</div>';
  }
  const _cell = window.buildR2060Cell;
  window.buildR2060Cell = function (d, k, rec, otherMonth, dow) {
    let html = _cell(d, k, rec, otherMonth, dow);
    const r = A5()[k];
    if (!has5(r)) return html;
    const i = html.lastIndexOf('</div>');
    html = html.slice(0, i) + group(r) + html.slice(i);
    if (!html.includes('openR2060Detail('))                                  // ①~④ 종목이 없는 날도 눌리게
      html = html.replace('<div class="cal-cell', `<div onclick="openR2060Detail('${k}')" style="cursor:pointer" class="cal-cell has-data`);
    return html;
  };
  // ---- 상세 창: ①~④ 아래에 ⑤ 표
  function detail(k, r) {
    const TH = 'style="color:#8487bd;white-space:nowrap;padding:3px 7px;text-align:left"';
    const ST = { R: '확정', X: '자료이상(분할·재개 · 통계 제외)', P: '예정(명단만 정해짐)', S: '자료끊김(거래정지 등)' };
    const clk = (code, name) => ` onclick="_openStock(this,function(){openR2060Detail('${k}')})" data-code="${code}" data-name="${esc(name)}" data-rate="0" data-amount="0" data-meta="🏹2060⑤ ${k}" data-catalyst="" title="클릭 → 종목 상세(차트·일봉)"`;
    const C = r.c || [];
    let h = `<div style="margin-top:18px;padding-top:12px;border-top:2px solid ${GB}">
      <div style="font-size:17px;font-weight:700;color:${G}">⑤ 2060매매법5 · 매수일 ${k}
        <span style="font-size:12px;font-weight:600;color:#ff9aaa;background:rgba(255,154,170,.1);border:1px solid rgba(255,154,170,.35);padding:2px 9px;border-radius:10px;margin-left:8px">관찰전용 · 매수추천 아님</span></div>
      <div style="font-size:12px;color:#8487bd;margin-top:6px;line-height:1.6">2060 제미니2 = 종가가 20·60일선 둘 다 위 + A·B·C 중 하나 · 신호일 <b style="color:#c9cbe8">${ymd(r.s)}</b> 종가까지만 보고 판정 ·
        이날 걸린 종목 전부 <b style="color:#c9cbe8">${Number(r.n).toLocaleString('ko-KR')}</b>개 · A 동시돌파 ${C[0] || 0} · B 샌드위치 ${C[1] || 0} · C 골든크로스 ${C[2] || 0}<br>
        아래는 순위 5 = 과거 확률표(2016-01~2026-08) P(다음날 고가 +20%) 큰 순 → 신호일 거래대금 큰 순 · <b style="color:#c9cbe8">결과는 규칙대로 샀다고 가정한 계산(실제 매매와 무관 · 비용 전)</b> ·
        ✓ = 매수일 고가가 신호일 종가 +20% 닿음 · 시가매수 = 매수일 시가에 사서 그날 종가 · 검증 결론 = 신호일 등락을 맞추면 2060 효과 0.81배 · 시가매수 평균 음수</div>`;
    const P = r.p || [];
    h += `<table style="margin-top:8px;border-collapse:collapse;font-size:12.5px;color:#e4e6ff"><tr><th ${TH}>순</th><th ${TH}>종목</th><th ${TH}>규칙</th><th ${TH}>과거확률</th><th ${TH}>신호일 등락</th><th ${TH}>대금(억)</th><th ${TH}>20일 평균(억)</th><th ${TH}>신호일 종가</th><th ${TH}>매수가(시가)</th><th ${TH}>결과</th><th ${TH}>당일 고가</th><th ${TH}>당일 종가</th><th ${TH}>시가매수</th></tr>`;
    P.forEach((p, i) => {
      const S = 'style="white-space:nowrap;padding:3px 7px"', pend = p[8] !== 'R';
      h += `<tr style="border-top:1px solid ${GB}"><td ${S}>${i + 1}</td>`
        + `<td ${S}><span${clk(p[1], p[0])} style="cursor:pointer;color:${GL};font-weight:700">${esc(p[0])}</span> <span style="color:#6b6e9c">${p[1]}</span></td>`
        + `<td ${S}>${esc(String(p[2]).split('').map(x => RULE[x] || x).join(' · '))}</td><td ${S}>${p[3]}%</td><td ${S}>${pct(p[4], 1)}</td><td ${S}>${won(p[5])}</td>`
        + `<td ${S}>${p[15] == null ? '—' : p[15]}${thin(p) ? ' <span style="color:#ff9aaa">⚠거래 적음</span>' : ''}</td><td ${S}>${won(p[6])}</td>`
        + `<td ${S}>${won(p[7])}${p[13] == null ? '' : ' <span style="color:#8487bd">갭 ' + (p[13] >= 0 ? '+' : '') + p[13] + '%</span>'}</td>`
        + `<td ${S}>${(ST[p[8]] || '') + (p[8] === 'R' && p[12] ? ' · 고가 +20% 닿음' : '')}</td>`
        + `<td ${S}>${pend ? '—' : pct(p[10], 1)}</td><td ${S}>${pend ? '—' : pct(p[9], 1)}</td><td ${S}>${p[11] == null ? '—' : pct(p[11], 2)}</td></tr>`;
      if (p[14]) h += `<tr><td></td><td colspan="12" style="padding:0 7px 5px;font-size:11.5px;color:#9a9cc4;white-space:normal;line-height:1.5">${esc(p[14]).split(' / ').join('<br>')}</td></tr>`;
    });
    h += '</table>';
    if (!P.some(p => p[14])) h += '<div style="margin-top:6px;font-size:11.5px;color:#6b6e9c">근거 문장은 올해 칸에만 싣는다(지난해 칸은 규칙 기호만 · 용량)</div>';
    h += `<div style="margin-top:8px;font-size:11.5px;color:#6b6e9c;line-height:1.6">A 2060 동시 돌파 기준봉 = 전날 종가 두 선 아래 → 오늘 종가 두 선 위 · 역배열이나 선 간격 3% 안 · 양봉 +5% · 거래대금 20일 평균 2배 · B 힘의 중심(샌드위치) = 선 간격 3% 안 · 3~20일 전 고가가 선보다 15%+ 위 · 저가가 선까지(윗선 +2% 안 · 아랫선 −3% 안 깸) · 양봉으로 선 위 마감 · C 골든크로스 전후 = 10일 안 골든크로스(60선 하락 · 20선 상승) 또는 교차 직전(간격 1% 안) · 저가가 선까지 · 양봉으로 선 위 마감 · 2015-06-15 전은 가격제한 ±15% = 하루 +20% 불가</div>`;
    return h + '</div>';
  }
  const _open = window.openR2060Detail;
  window.openR2060Detail = function (k) {
    const r = A5()[k];
    const ov = document.getElementById('stock-modal-overlay'), body = document.getElementById('stock-modal-body');
    if (!has5(r) || !ov || !body) { _open(k); return; }
    body.insertAdjacentHTML('beforeend', '<i id="r2060d5-sentinel" hidden></i>');  // 앞(①~④)이 창을 새로 그리면 사라진다
    _open(k);
    const sen = document.getElementById('r2060d5-sentinel');
    if (sen) {                                                                // ①~④ 자료 없는 날 = 창을 여기서 연다
      sen.remove();
      body.innerHTML = `<div style="padding:6px 2px 4px"><div style="font-size:19px;font-weight:700;color:#ff9f5a">🏹 2060 · 매수일 ${k}</div>`
        + `<div style="font-size:12px;color:#8487bd;margin-top:6px">이날 2060매매법1~4 종목 없음</div></div>`;
      ov.style.display = 'flex';
      try { window.__배지복귀 = function () { openR2060Detail(k); }; } catch (e) { }
    }
    body.insertAdjacentHTML('beforeend', detail(k, r));
  };
  // ---- 요약 줄: 앞 요약 아래에 ⑤ 한 줄
  if (typeof renderR2060Meta === 'function') {
    const _meta = window.renderR2060Meta;
    window.renderR2060Meta = function () {
      _meta();
      const el = document.getElementById('r2060-meta'), M = window.R2060_5_META;
      if (!el) return;
      if (!M) { el.insertAdjacentHTML('beforeend', '<br><span style="color:#ff9aaa">❌ 2060매매법5.js 가 안 읽혔다 = /2060매매법5 실행</span>'); return; }
      const T = M.제한30 || {}, yy = (typeof r2060Y !== 'undefined') ? r2060Y : null, Y = (M.연도 || []).find(r => r.y === yy), E = M.예정;
      el.insertAdjacentHTML('beforeend', `<br><span style="color:${G}">⑤</span> <b style="color:${G}">2060매매법5</b>(제미니2 · A 동시돌파·B 샌드위치·C 골든크로스 · 칸엔 과거확률 순위 5) · 칸 ${Number(M.칸).toLocaleString('ko-KR')}개(${ymd(M.첫칸)}~) · 2015-06-15~ 순위 5 확정 ${Number(T.n || 0).toLocaleString('ko-KR')}건 다음날 고가 +20% <b>${T.up}%</b>(같은 날 전 종목 ${T.bup}%) · 시가매수 평균 ${pct(T.rr, 2)}(전 종목 ${pct(T.brr, 2)}) · 중앙 ${pct(T.med, 2)} · 승률 ${T.win}% · 평균손실 ${pct(T.loss, 2)}`
        + (Y && Y.n ? ` · ${yy}년 ${Y.n}건 +20% ${Y.up}% 평균 ${pct(Y.rr, 2)}` : '')
        + (E ? ` · <span style="color:#7ee8ff">예정 ${ymd(E.매수일)} ${E.종목.length}종목(${E.종목.map(esc).join(', ') || '없음'})</span>` : '')
        + ` · <span style="color:#ff9aaa">${esc(M.판정 || '관찰전용')} · 매수추천 아님</span>`);
    };
  }
  // ---- 월 띠: 2060매매법5 만 있는 달도 표시
  if (typeof renderR2060MonthStrip === 'function') {
    const _strip = window.renderR2060MonthStrip;
    window.renderR2060MonthStrip = function () {
      _strip();
      const strip = document.getElementById('r2060-month-strip'); if (!strip || typeof r2060Y === 'undefined') return;
      const A = A5();
      [...strip.children].forEach((btn, i) => {
        const pre = `${r2060Y}-${String(i + 1).padStart(2, '0')}`;
        let n = 0; Object.keys(A).forEach(k => { if (k.startsWith(pre) && A[k].n) n += 1; });
        if (!n) return;
        btn.title = (btn.title || '').replace(' 자료 없음', '') + ` · ⑤ 2060매매법5 ${n}일`;
        if (!btn.classList.contains('active')) btn.classList.add('has-data');
      });
    };
  }
  // ---- 설명 박스·버튼 설명에 한 줄
  function note() {
    const box = document.getElementById('r2060-desc');
    if (box && !box.querySelector('.r2060d5-note'))
      box.insertAdjacentHTML('beforeend', `<div class="r2060d5-note" style="margin-top:6px"><span style="color:${G}">⑤</span> 같은 칸의 노랑 <b style="color:${G}">⑤ 묶음</b> = <b>2060매매법5</b>(스킬 /2060매매법5 · 제미니2 = 두 선 위 영역에서 A 2060 동시 돌파 기준봉 · B 힘의 중심(샌드위치) 눌림 반등 · C 골든크로스 전후 지지 반등 · 칸엔 과거 확률표 순위 5 · +N 걸림 = 나머지 · ⚠ = 20일 평균대금 1억 미만) · +20✓ = 매수일 고가가 신호일 종가 +20% 닿음 · 숫자 = 매수일 시가에 사서 그날 종가 · <b style="color:#ff9aaa">관찰전용 · 매수추천 아님(검증 = 신호일 등락을 맞추면 2060 효과 0.81배 · 9월 순위 5 시가매수 평균 −1.10%)</b></div>`);
    const btn = [...document.querySelectorAll('.h-nav-btn')].find(b => (b.getAttribute('onclick') || '').includes("setView('r2060')"));
    if (btn && !(btn.title || '').includes('2060매매법5')) btn.title += ' ·· + ⑤ 2060매매법5(제미니2 · 노랑 묶음)';
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', note); else note();
  try { const v = document.getElementById('r2060-view'); if (v && v.innerHTML && typeof renderR2060Calendar === 'function') renderR2060Calendar(); } catch (e) { }
})();
