// ════════ 🏹 2060 달력 + 2060매매법6 (2026-09-30 사용자 지시 "2060버튼에 네가 걸러준 종목 추가 · 2060매매법6 · /매매일 하면 같이 · 천프정 일봉 가능한대로 모두") ════════
//   2060매매법6 = 스킬 /2060매매법6 = 2060 노트북lm (NotebookLM 명세 7단계 = ① 2060 데드·바닥 ② 기준봉(2060 찌름) ③ 눌림 지지(기준봉 몸통 하단 종가) ④ 20일선 돌리기(+5일선 보안캔들 유무)
//                 ⑤ 같은 선상 2060 수렴·골든 ⑥ 매수 = 5일선 재돌파가 / 기준봉 상단 ⑦ 손절 = 기준봉 몸통 하단 종가 이탈)
//                 규칙 = 매매법\2060_노트북lm\_2060nb_엔진.py (사전등록 _사전등록.md · SHA256 동결) · 빌더 = 매매법\2060_노트북lm\_2060매매법6_달력.py
//   ★버튼·섹션을 따로 만들지 않는다(②~⑤와 같은 방식). 🏹 2060 달력 함수(2060_뷰.js · ② · ③ · ④ · ⑤ 가 감싼 것)를 한 번 더 감싸
//     같은 칸 · 같은 상세 창 · 같은 요약 줄 · 같은 월 띠에 연두 「⑥」 묶음을 더한다. 앞 다섯 파일은 건드리지 않는다.
//     ★이 파일은 2060매매법5_뷰.js 뒤에 읽혀야 한다.
//   자료 = dashboard/data/2060매매법6_과거.js + 2060매매법6.js (window.R2060_6_ARCHIVE / R2060_6_META · 칸 = 매수일 'YYYY-MM-DD')
//   칸 r = {d 매수일, s 신호일, n 이날 걸린 종목 전부 수, p 걸린 종목 전부(아침 러너 순서 · 앞 10 = 아침 TOP10)}
//   p = [0이름, 1코드, 2타점(5 = 5일선 재돌파가 · K = 기준봉 상단), 3수렴도%, 4보안캔들(1/0), 5기준봉일, 6신호일종가(원본), 7권장매수가, 8손절가,
//        9상태(R 확정 / W 결과대기 / N 미체결 / P 예정 / S 자료끊김), 10명세매매%, 11청산(T 목표 · G 목표갭 · S 손절 · E 20봉 만료 · O 평가),
//        12 ✓20(10봉 안 고가 ≥ 신호일 종가×1.2 · 1/0/null), 13 10봉 최고%, 14근거(올해만), 15 20일 평균대금억, 16진입가, 17 TOP10(1/0)]
//   ★결과는 전부 규칙대로 샀다고 가정한 계산 = 실제 매매와 무관 · 관찰전용 · 매수추천 아님(사전등록 검증 기각)
(function () {
  if (typeof buildR2060Cell !== 'function' || typeof openR2060Detail !== 'function') {
    console.warn('2060매매법6: 🏹 2060 달력 화면(2060_뷰.js)이 없어 ⑥ 묶음을 안 붙임'); return;
  }
  const G = '#b5e853', GL = '#e3f7c2', GD = '#9ab86a', GB = '#44562a';      // 연두 = 2060매매법6
  const CELLN = 5;                                                            // 칸 안에는 아침 순서 앞 5 · 나머지는 상세 창
  const A6 = () => window.R2060_6_ARCHIVE || {};
  const esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const pct = (v, dg) => { if (v == null || v !== v) return '—'; const n = Number(v); return `<span style="color:${n >= 0 ? '#ff8a8a' : '#7ea6ff'}">${n >= 0 ? '+' : ''}${n.toFixed(dg == null ? 1 : dg)}%</span>`; };
  const ymd = s => { s = String(s || ''); return s.length === 8 ? `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6)}` : s; };
  const md = s => { s = String(s || ''); return s.length === 8 ? `${s.slice(4, 6)}/${s.slice(6)}` : s; };
  const won = v => (v == null || v !== v) ? '—' : Number(v).toLocaleString('ko-KR');
  const has6 = r => !!(r && r.n);
  const TJ = { '5': '5일선 재돌파', K: '기준봉 상단' };
  const ST = { R: '확정', W: '결과대기(20봉 안 됨)', N: '미체결(매수가 안 닿음)', P: '예정(명단만 정해짐)', S: '자료끊김(거래정지 등)' };
  const EX = { T: '목표 +20%', G: '목표(갭)', S: '손절(기준봉 몸통 하단 종가 이탈)', E: '20봉 만료', O: '평가(아직 안 끝남)' };
  const short = p => {                                                       // 칸 안 한 줄 결과
    if (p[12] === 1) return '<span style="color:#ff8a8a">+20✓</span>';
    const o = p[9];
    if (o === 'R') return pct(p[10]);
    if (o === 'P') return '<span style="color:#7ee8ff">예정</span>';
    if (o === 'W') return '<span style="color:#8487bd">대기</span>';
    if (o === 'N') return '<span style="color:#8487bd">미체결</span>';
    return '<span style="color:#8487bd">자료끊김</span>';
  };
  // ---- 칸: 앞(①~⑤) 칸 그대로 + 아래에 ⑥ 묶음
  function group(r) {
    const P = (r.p || []).slice(0, CELLN), more = (r.n || 0) - P.length;
    let h = `<div style="margin-top:3px;border-top:1px dashed ${GB};padding-top:2px" title="⑥ 2060매매법6 (노트북lm) · 신호일 ${esc(r.s)} 종가까지 → 매수일 · +20✓ = 10봉 안 고가가 신호일 종가 +20% 닿음 · 숫자 = 명세 매매(매수가 도달 진입 · 기준봉 몸통 하단 종가 손절 · +20% 목표 · 20봉) 결과 · 규칙대로 샀다고 가정한 계산 · 순서 = 수렴 타이트 → 보안캔들 → 매수가까지 가까운 순">`
      + `<div style="font-size:9.5px;color:${GD}">⑥ 신호 ${md(r.s)} · <b style="color:${G}">${r.n}</b>종목${more > 0 ? ` <span style="color:#6b6e9c" title="이날 걸린 종목 전부 ${r.n}개 중 앞 ${P.length}개만 칸에 · 누르면 전부">+${more} 걸림</span>` : ''}</div>`;
    P.forEach(p => {
      const tip = `⑥ ${esc(p[0])} (${p[1]}) · 권장매수가 ${won(p[7])}(${TJ[p[2]] || p[2]}) · 손절 ${won(p[8])} · 수렴도 ${p[3]}% · 보안캔들 ${p[4] ? '있음' : '없음'} · 기준봉 ${md(p[5])} · 10봉 최고 ${p[13] == null ? '—' : p[13] + '%'} · ${ST[p[9]] || ''}`;
      h += `<div style="font-size:10px;line-height:1.35;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:${GL}" title="${tip}"><b>${esc(p[0])}</b> ${short(p)} <span style="font-size:9px;color:${GD}">${p[3]}%</span></div>`;
    });
    return h + '</div>';
  }
  const _cell = window.buildR2060Cell;
  window.buildR2060Cell = function (d, k, rec, otherMonth, dow) {
    let html = _cell(d, k, rec, otherMonth, dow);
    const r = A6()[k];
    if (!has6(r)) return html;
    const i = html.lastIndexOf('</div>');
    html = html.slice(0, i) + group(r) + html.slice(i);
    if (!html.includes('openR2060Detail('))                                  // ①~⑤ 종목이 없는 날도 눌리게
      html = html.replace('<div class="cal-cell', `<div onclick="openR2060Detail('${k}')" style="cursor:pointer" class="cal-cell has-data`);
    return html;
  };
  // ---- 상세 창: ①~⑤ 아래에 ⑥ 표(걸린 종목 전부)
  function detail(k, r) {
    const TH = 'style="color:#8487bd;white-space:nowrap;padding:3px 7px;text-align:left"';
    const clk = (code, name) => ` onclick="_openStock(this,function(){openR2060Detail('${k}')})" data-code="${code}" data-name="${esc(name)}" data-rate="0" data-amount="0" data-meta="🏹2060⑥ ${k}" data-catalyst="" title="클릭 → 종목 상세(차트·일봉)"`;
    let h = `<div style="margin-top:18px;padding-top:12px;border-top:2px solid ${GB}">
      <div style="font-size:17px;font-weight:700;color:${G}">⑥ 2060매매법6 · 매수일 ${k}
        <span style="font-size:12px;font-weight:600;color:#ff9aaa;background:rgba(255,154,170,.1);border:1px solid rgba(255,154,170,.35);padding:2px 9px;border-radius:10px;margin-left:8px">관찰전용 · 매수추천 아님</span></div>
      <div style="font-size:12px;color:#8487bd;margin-top:6px;line-height:1.6">2060 노트북lm = 데드크로스 뒤 바닥 → 2060 찌른 기준봉 → 기준봉 몸통 하단 종가 지지 → 20일선 돌리기 → 같은 선상 2060 수렴·골든 → 매수가 = 5일선 재돌파가 또는 기준봉 상단 ·
        신호일 <b style="color:#c9cbe8">${ymd(r.s)}</b> 종가까지만 보고 판정 · 이날 걸린 종목 전부 <b style="color:#c9cbe8">${Number(r.n).toLocaleString('ko-KR')}</b>개(아래 전부 · ★ = 아침 TOP10)<br>
        <b style="color:#c9cbe8">결과는 규칙대로 샀다고 가정한 계산(실제 매매와 무관)</b> · 명세 매매 = 매수일 장중 권장매수가 닿으면 진입(시가가 위면 시가) · 기준봉 몸통 하단 종가 이탈 손절 · 진입가 +20% 목표 · 최대 20봉 · 비용 0.3% ·
        ✓20 = 신호일 다음 10봉 안 고가가 신호일 종가 +20% 닿음 · 검증 결론 = 사전등록 기각(판정 구간 10봉 +20% 조정 lift 0.95 · 같은 날 무작위보다 −0.27%p)</div>`;
    const P = r.p || [];
    h += `<table style="margin-top:8px;border-collapse:collapse;font-size:12.5px;color:#e4e6ff"><tr><th ${TH}>순</th><th ${TH}>종목</th><th ${TH}>권장매수가</th><th ${TH}>손절가</th><th ${TH}>수렴도</th><th ${TH}>보안캔들</th><th ${TH}>기준봉</th><th ${TH}>신호일 종가</th><th ${TH}>20일 평균(억)</th><th ${TH}>10봉 최고</th><th ${TH}>명세 매매</th></tr>`;
    P.forEach((p, i) => {
      const S = 'style="white-space:nowrap;padding:3px 7px"';
      const trade = p[9] === 'R' || p[9] === 'W'
        ? `${won(p[16])} 진입 → ${pct(p[10], 1)} <span style="color:#8487bd">${EX[p[11]] || ''}</span>` : `<span style="color:#8487bd">${ST[p[9]] || ''}</span>`;
      h += `<tr style="border-top:1px solid ${GB}"><td ${S}>${i + 1}${p[17] ? ' <span style="color:' + G + '">★</span>' : ''}</td>`
        + `<td ${S}><span${clk(p[1], p[0])} style="cursor:pointer;color:${GL};font-weight:700">${esc(p[0])}</span> <span style="color:#6b6e9c">${p[1]}</span></td>`
        + `<td ${S}>${won(p[7])} <span style="color:#8487bd">${TJ[p[2]] || ''}</span></td>`
        + `<td ${S}>${won(p[8])} <span style="color:#8487bd">(${p[7] ? '−' + ((1 - p[8] / p[7]) * 100).toFixed(1) + '%' : '—'})</span></td>`
        + `<td ${S}>${p[3]}%</td><td ${S}>${p[4] ? '있음' : '없음'}</td><td ${S}>${ymd(p[5])}</td><td ${S}>${won(p[6])}</td>`
        + `<td ${S}>${p[15] == null ? '—' : p[15]}</td>`
        + `<td ${S}>${p[13] == null ? '—' : pct(p[13], 1)}${p[12] === 1 ? ' <span style="color:#ff8a8a">✓20</span>' : (p[12] == null && p[13] != null ? ' <span style="color:#8487bd">(10봉 안 됨)</span>' : '')}</td>`
        + `<td ${S}>${trade}</td></tr>`;
      if (p[14]) h += `<tr><td></td><td colspan="10" style="padding:0 7px 5px;font-size:11.5px;color:#9a9cc4;white-space:normal;line-height:1.5">${esc(p[14])}</td></tr>`;
    });
    h += '</table>';
    if (!P.some(p => p[14])) h += '<div style="margin-top:6px;font-size:11.5px;color:#6b6e9c">근거 문장은 올해 칸에만 싣는다(지난해 칸은 숫자만 · 용량)</div>';
    h += `<div style="margin-top:8px;font-size:11.5px;color:#6b6e9c;line-height:1.6">문턱(명세에 숫자가 없어 클로드가 정해 결과 보기 전에 고정) = 데드 120봉 안 · 고점→바닥 −20%↓ · 기준봉 = 역배열 · 바닥 +5% 안 · 종가 ≥ 5일선 · 고가 ≥ 20일선 · 양봉 +5%↑ 또는 위꼬리 40%↑ · 거래량 20일 평균 2배↑ · 2~40봉 전 ·
      눌림 3%↑ · 20일선 5봉 기울기 ≥ −0.5% · 20/60 이격 3% 안(골든 전 또는 골든 5봉 안) · 데드 때 60선 높이 ±10% · 20일 평균대금 5억↑ · 2015-06-15 전은 가격제한 ±15%</div>`;
    return h + '</div>';
  }
  const _open = window.openR2060Detail;
  window.openR2060Detail = function (k) {
    const r = A6()[k];
    const ov = document.getElementById('stock-modal-overlay'), body = document.getElementById('stock-modal-body');
    if (!has6(r) || !ov || !body) { _open(k); return; }
    body.insertAdjacentHTML('beforeend', '<i id="r2060d6-sentinel" hidden></i>');  // 앞(①~⑤)이 창을 새로 그리면 사라진다
    _open(k);
    const sen = document.getElementById('r2060d6-sentinel');
    if (sen) {                                                                // ①~⑤ 자료 없는 날 = 창을 여기서 연다
      sen.remove();
      body.innerHTML = `<div style="padding:6px 2px 4px"><div style="font-size:19px;font-weight:700;color:#ff9f5a">🏹 2060 · 매수일 ${k}</div>`
        + `<div style="font-size:12px;color:#8487bd;margin-top:6px">이날 2060매매법1~5 종목 없음</div></div>`;
      ov.style.display = 'flex';
      try { window.__배지복귀 = function () { openR2060Detail(k); }; } catch (e) { }
    }
    body.insertAdjacentHTML('beforeend', detail(k, r));
  };
  // ---- 요약 줄: 앞 요약 아래에 ⑥ 한 줄
  if (typeof renderR2060Meta === 'function') {
    const _meta = window.renderR2060Meta;
    window.renderR2060Meta = function () {
      _meta();
      const el = document.getElementById('r2060-meta'), M = window.R2060_6_META;
      if (!el) return;
      if (!M) { el.insertAdjacentHTML('beforeend', '<br><span style="color:#ff9aaa">❌ 2060매매법6.js 가 안 읽혔다 = /2060매매법6 실행</span>'); return; }
      const T = M.제한30 || {}, yy = (typeof r2060Y !== 'undefined') ? r2060Y : null, Y = (M.연도 || []).find(r => r.y === yy), E = M.예정;
      el.insertAdjacentHTML('beforeend', `<br><span style="color:${G}">⑥</span> <b style="color:${G}">2060매매법6</b>(노트북lm · 데드→기준봉→눌림 지지→20일선 돌리기→같은 선상 수렴 · 칸엔 아침 순서 앞 5 · 상세 창에 전부) · 칸 ${Number(M.칸).toLocaleString('ko-KR')}개(${ymd(M.첫칸)}~) · 걸림 ${Number(M.걸림).toLocaleString('ko-KR')}건 · 2015-06-15~ 아침 TOP10 ${Number(T.nl || 0).toLocaleString('ko-KR')}건 10봉 안 +20% <b>${T.up}%</b>(같은 날 풀 ${T.bup}%) · 명세 매매 확정 ${Number(T.nt || 0).toLocaleString('ko-KR')}건 평균 ${pct(T.rr, 2)} · 중앙 ${pct(T.med, 2)} · 승률 ${T.win}% · 평균손실 ${pct(T.loss, 2)}`
        + (Y && Y.n ? ` · ${yy}년 ${Y.n}건 +20% ${Y.up}% 매매 평균 ${pct(Y.rr, 2)}` : '')
        + (E ? ` · <span style="color:#7ee8ff">예정 ${ymd(E.매수일)} ${E.종목.length}종목(${E.종목.map(esc).join(', ') || '없음'})</span>` : '')
        + ` · <span style="color:#ff9aaa">${esc(M.판정 || '관찰전용')} · 매수추천 아님</span>`);
    };
  }
  // ---- 월 띠: 2060매매법6 만 있는 달도 표시
  if (typeof renderR2060MonthStrip === 'function') {
    const _strip = window.renderR2060MonthStrip;
    window.renderR2060MonthStrip = function () {
      _strip();
      const strip = document.getElementById('r2060-month-strip'); if (!strip || typeof r2060Y === 'undefined') return;
      const A = A6();
      [...strip.children].forEach((btn, i) => {
        const pre = `${r2060Y}-${String(i + 1).padStart(2, '0')}`;
        let n = 0; Object.keys(A).forEach(k => { if (k.startsWith(pre) && A[k].n) n += 1; });
        if (!n) return;
        btn.title = (btn.title || '').replace(' 자료 없음', '') + ` · ⑥ 2060매매법6 ${n}일`;
        if (!btn.classList.contains('active')) btn.classList.add('has-data');
      });
    };
  }
  // ---- 설명 박스·버튼 설명에 한 줄
  function note() {
    const box = document.getElementById('r2060-desc');
    if (box && !box.querySelector('.r2060d6-note'))
      box.insertAdjacentHTML('beforeend', `<div class="r2060d6-note" style="margin-top:6px"><span style="color:${G}">⑥</span> 같은 칸의 연두 <b style="color:${G}">⑥ 묶음</b> = <b>2060매매법6</b>(스킬 /2060매매법6 · 노트북lm = NotebookLM 명세 7단계 · 칸엔 아침 러너 순서 앞 5 · +N 걸림 = 나머지(눌러서 상세 창에 전부) · 숫자 = 수렴도) · +20✓ = 10봉 안 고가가 신호일 종가 +20% 닿음 · 칸의 % = 명세 매매 결과 · <b style="color:#ff9aaa">관찰전용 · 매수추천 아님(사전등록 검증 기각 = 판정 구간 10봉 +20% 조정 lift 0.95 · 같은 날 무작위보다 −0.27%p)</b></div>`);
    const btn = [...document.querySelectorAll('.h-nav-btn')].find(b => (b.getAttribute('onclick') || '').includes("setView('r2060')"));
    if (btn && !(btn.title || '').includes('2060매매법6')) btn.title += ' ·· + ⑥ 2060매매법6(노트북lm · 연두 묶음)';
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', note); else note();
  try { const v = document.getElementById('r2060-view'); if (v && v.innerHTML && typeof renderR2060Calendar === 'function') renderR2060Calendar(); } catch (e) { }
})();
