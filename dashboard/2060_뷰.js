// ════════ 🏹 2060 (2026-09-30 사용자 지시) = 2060매매법1(스킬 /2060매매법1 · 불화살강의 v1) 종목 달력 ════════
//   버튼 = 🏅베스트와 🗣검사관 사이 · 칸 = 매수일 · 자료 = dashboard/data/2060매매법1.js (window.R2060_1_ARCHIVE / R2060_1_META)
//   빌더 = node 매매법\불화살강의\2060매매법1.js update (/매매일 9.695 · /2060매매법1) · 숫자는 빌더가 잠긴 v1 코드로 계산한 것 그대로(여기서 재계산 없음)
//   p = [0이름, 1코드, 2시장(P코스피/Q코스닥), 3채택셋업, 4같이걸린셋업, 5신호일종가, 6신호일등락%, 7대금억, 8매수가(시가), 9상태(T익절/C5일종가/H결과대기/P예정/S자료끊김/X자료이상 · 전부 규칙대로 샀다고 가정한 계산 = 실제 매매와 무관 · '보유'·'진행중' 같은 말 쓰지 않음 = 2026-09-30 사용자),
//        10익절일차, 11지난거래일수, 12규칙수익%, 13 5일최고%, 14 5일최저%, 15 +20도달, 16 -20급락, 17청산일, 18추격표시(v2 조건), 19시가갭%]
//   ★관찰용 · 매수추천 아님. 이름은 전부 r2060 / _r2060 접두사 = 다른 달력과 전역 충돌 없음.
//   본 파일이 쓰는 캘린더 공용 = DOWNAMES · MONTHS · dateKey · TODAY · _openStock · descToggle · #stock-modal-overlay / #stock-modal-body
let r2060Y = (new Date()).getFullYear(), r2060M = (new Date()).getMonth() + 1, _r2060First = true;
function _r2060Arch() { return window.R2060_1_ARCHIVE || {}; }
function _r2060Esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
function _r2060Pct(v, dg) { if (v == null || v !== v) return '—'; const n = Number(v); return `<span style="color:${n >= 0 ? '#ff8a8a' : '#7ea6ff'}">${n >= 0 ? '+' : ''}${n.toFixed(dg == null ? 1 : dg)}%</span>`; }
function _r2060Ymd(s) { s = String(s || ''); return s.length === 8 ? `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6)}` : s; }
function _r2060Won(v) { return (v == null || v !== v) ? '—' : Number(v).toLocaleString('ko-KR'); }
function _r2060State(p) {
  const o = p[9];
  if (o === 'T') return `<span style="color:#ff8a8a" title="5거래일 안 +20% 익절 · ${p[10]}일째">+20✓</span>`;
  if (o === 'C') return _r2060Pct(p[12]);
  if (o === 'H') return `<span style="color:#ffc454" title="규칙상 5거래일 중 ${p[11]}일 지남 · 지금까지 ${p[12]}% · 5번째 거래일 종가가 나오면 확정 · 실제로 샀는지와 상관없는 규칙 계산">결과대기</span>`;
  if (o === 'P') return `<span style="color:#7ee8ff">예정</span>`;
  if (o === 'S') return `<span style="color:#8487bd" title="천프정 일봉이 ${_r2060Ymd(p[17])} 에서 멈춤(거래정지·상장폐지 등) · 규칙상 5거래일 중 ${p[11]}일째에 멈춤 · 마지막 종가까지 ${p[12]}% · 자료가 다시 들어오면 /2060매매법1 이 다시 계산">자료끊김</span>`;
  return `<span style="color:#8487bd">자료이상</span>`;
}
function r2060Today() { const n = new Date(); r2060Y = n.getFullYear(); r2060M = n.getMonth() + 1; renderR2060Calendar(); }
function r2060Year(step) { r2060Y += step; renderR2060Calendar(); }
function r2060GoMonth(m) { r2060M = m; renderR2060Calendar(); }
function renderR2060MonthStrip() {
  const strip = document.getElementById('r2060-month-strip'); if (!strip) return;
  const A = _r2060Arch(); strip.innerHTML = '';
  MONTHS.forEach((mn, i) => {
    const m = i + 1, pre = `${r2060Y}-${String(m).padStart(2, '0')}`;
    let n = 0; Object.keys(A).forEach(k => { if (k.startsWith(pre)) n += (A[k].n || 0); });
    const btn = document.createElement('button');
    btn.className = 'ms-btn' + (m === r2060M ? ' active' : '') + (n && m !== r2060M ? ' has-data' : '');
    btn.textContent = mn; btn.title = n ? `${mn} ${n}종목` : `${mn} 자료 없음`;
    btn.onclick = () => r2060GoMonth(m); strip.appendChild(btn);
  });
}
function renderR2060Meta() {
  const el = document.getElementById('r2060-meta'); if (!el) return;
  const M = window.R2060_1_META;
  if (!M) { el.innerHTML = '<span style="color:#ff9aaa">❌ 2060매매법1.js 가 안 읽혔다 = /2060매매법1 실행(node 매매법\\불화살강의\\2060매매법1.js update)</span>'; return; }
  const T = M.전체 || {};
  const Y = (M.연도 || []).find(r => r.y === r2060Y);
  const X = M.잘림, XY = (M.연도잘림 || []).find(r => r.y === r2060Y);
  const pend = M.예정 ? ` · <span style="color:#7ee8ff">예정 ${_r2060Ymd(M.예정.매수일)} ${M.예정.종목.length}종목(${M.예정.종목.map(_r2060Esc).join(', ')})</span>` : '';
  el.innerHTML = `🏹 <b style="color:#ff9f5a">2060매매법1</b> · 천프정 마지막 봉 <b>${_r2060Ymd(M.마지막봉)}</b> · 칸 ${M.칸}개(${_r2060Ymd(M.첫칸)}~${_r2060Ymd(M.끝칸)})`
    + ` · 전체 확정 ${Number(T.n || 0).toLocaleString('ko-KR')}건 +20% 도달 <b>${T.up}%</b> · 평균 ${_r2060Pct(T.rr, 2)} · 중앙 ${_r2060Pct(T.med, 2)} · 승률 ${T.win}% · <span title="규칙상 5거래일이 아직 안 끝난 종목 수 · 실제로 샀는지와 상관없음">결과대기 ${M.결과대기 != null ? M.결과대기 : M.보유중}</span>${M.끊김 ? ` · <span title="천프정 일봉이 멈춘 종목(거래정지·상장폐지 등) · 결과대기에서 뺀다">자료끊김 ${M.끊김}</span>` : ''}`
    + (Y ? ` · <b>${r2060Y}년</b> ${Y.n}건 +20% ${Y.up}% 평균 ${_r2060Pct(Y.rr, 2)} 중앙 ${_r2060Pct(Y.med, 2)}` : '')
    + (X ? `<br><span style="color:#8487bd">잘린 6위 이하(회색 · 관찰용) 전체 확정 ${Number(X.n).toLocaleString('ko-KR')}건 +20% 도달 ${X.up}% · -20% 급락 ${X.dn}% · 평균 ${_r2060Pct(X.rr, 2)} · 중앙 ${_r2060Pct(X.med, 2)} · 승률 ${X.win}%`
      + (XY ? ` · ${r2060Y}년 ${XY.n}건 +20% ${XY.up}% 평균 ${_r2060Pct(XY.rr, 2)} 중앙 ${_r2060Pct(XY.med, 2)}` : '') + ` · 달력 5개(1~5위) -20% 급락 ${T.dn}%</span>` : '')
    + pend + ` · <span style="color:#ff9aaa">관찰용 · 매수추천 아님</span>`;
}
function renderR2060Calendar() {
  const view = document.getElementById('r2060-view'); if (!view) return;
  const A = _r2060Arch();
  if (_r2060First) {                                   // 처음 열 때 = 자료 있는 마지막 달로
    _r2060First = false;
    const ks = Object.keys(A).sort(); const cur = `${r2060Y}-${String(r2060M).padStart(2, '0')}`;
    if (ks.length && !ks.some(k => k.startsWith(cur))) { const L = ks[ks.length - 1]; r2060Y = +L.slice(0, 4); r2060M = +L.slice(5, 7); }
  }
  const t = document.getElementById('r2060-title'); if (t) t.textContent = r2060Y + '년';
  renderR2060Meta(); renderR2060MonthStrip();
  let html = '<div class="dow-row">'; DOWNAMES.forEach(d => html += `<div class="dow">${d}</div>`); html += '</div><div class="cal-grid">';
  const firstDay = new Date(r2060Y, r2060M - 1, 1).getDay(), dim = new Date(r2060Y, r2060M, 0).getDate(), prevDays = new Date(r2060Y, r2060M - 1, 0).getDate();
  for (let i = firstDay - 1; i >= 0; i--) { const d = prevDays - i, pm = r2060M === 1 ? 12 : r2060M - 1, py = r2060M === 1 ? r2060Y - 1 : r2060Y; const k = dateKey(py, pm, d); html += buildR2060Cell(d, k, A[k], true, new Date(py, pm - 1, d).getDay()); }
  for (let d = 1; d <= dim; d++) { const k = dateKey(r2060Y, r2060M, d); html += buildR2060Cell(d, k, A[k], false, new Date(r2060Y, r2060M - 1, d).getDay()); }
  const total = firstDay + dim, nc = total % 7 === 0 ? 0 : 7 - (total % 7);
  for (let d = 1; d <= nc; d++) { const nm = r2060M === 12 ? 1 : r2060M + 1, ny = r2060M === 12 ? r2060Y + 1 : r2060Y; const k = dateKey(ny, nm, d); html += buildR2060Cell(d, k, A[k], true, new Date(ny, nm - 1, d).getDay()); }
  view.innerHTML = html + '</div>';
}
// 칸 = 신호일 요약 1줄 + 종목마다 2줄(이름 · 추격표시 / 결과)
function buildR2060Cell(d, k, rec, otherMonth, dow) {
  let cls = 'cal-cell';
  if (otherMonth) cls += ' other-month';
  if (k === TODAY) cls += ' today';
  if (dow === 0) cls += ' sunday';
  if (dow === 6) cls += ' saturday';
  if (rec && rec.n) cls += ' has-data';
  let inner = `<div class="cell-day">${d}</div>`;
  if (rec && rec.n) {
    const sg = rec.s ? `${rec.s.slice(4, 6)}/${rec.s.slice(6)}` : '';
    inner += `<div style="font-size:9.5px;color:#8487bd;margin:1px 0 2px" title="신호일 ${rec.s} 종가까지 → 매수일 ${rec.d} 시가 매수">신호 ${sg} · <b style="color:#ff9f5a">${rec.n}</b>종목${rec.x && rec.x.length ? ` <span style="color:#6b6e9c" title="기준에 걸렸지만 순위 밖이라 잘린 종목 · 누르면 회색으로 보임">+${rec.x.length} 잘림</span>` : ''}</div><div class="cell-themes" style="display:block">`;
    (rec.p || []).forEach(p => {
      const tip = `🏹 ${_r2060Esc(p[0])} (${p[1]}) · ${_r2060Esc(p[3])}${p[4] ? ' (+' + _r2060Esc(p[4]) + ')' : ''} · 신호일 ${p[6]}% · 대금 ${p[7]}억 · 매수가 ${_r2060Won(p[8])} · 5일 최고 ${p[13]}% 최저 ${p[14]}% · 규칙수익 ${p[12]}%${p[18] ? ' · 추격: ' + _r2060Esc(p[18]) : ''}`;
      inner += `<div style="font-size:10px;line-height:1.35;margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:#ffd2b0" title="${tip}"><b>${_r2060Esc(p[0])}</b>${p[18] ? ' <span style="color:#ff9aaa;font-size:9px">추</span>' : ''}</div>`
        + `<div style="font-size:9.5px;line-height:1.3;white-space:nowrap" title="${tip}">${_r2060State(p)}</div>`;
    });
    inner += '</div>';
  }
  const click = (rec && rec.n) ? ` onclick="openR2060Detail('${k}')" style="cursor:pointer"` : '';
  return `<div class="${cls}"${click}>${inner}</div>`;
}
function openR2060Detail(k) {
  const rec = _r2060Arch()[k]; if (!rec || !rec.n) return;
  const ov = document.getElementById('stock-modal-overlay'), body = document.getElementById('stock-modal-body');
  if (!ov || !body) return;
  try { window.__배지복귀 = function () { openR2060Detail(k); }; } catch (e) { }
  const TH = 'style="color:#8487bd;white-space:nowrap;padding:3px 7px;text-align:left"', TD = 'style="white-space:nowrap;padding:3px 7px"';
  const ST = { T: '+20% 익절', C: '5일째 종가', H: '결과대기', P: '예정(명단만 정해짐 · 결과 계산 전)', S: '자료끊김(거래정지·상장폐지 등)', X: '자료이상' };
  let h = `<div style="padding:6px 2px 14px">
    <div style="font-size:19px;font-weight:700;color:#ff9f5a">🏹 2060매매법1 · 매수일 ${k}
      <span style="font-size:12px;font-weight:600;color:#ff9aaa;background:rgba(255,154,170,.1);border:1px solid rgba(255,154,170,.35);padding:2px 9px;border-radius:10px;margin-left:8px">관찰용 · 매수추천 아님</span></div>
    <div style="font-size:12px;color:#8487bd;margin-top:6px;line-height:1.6">불화살강의 v1 · 신호일 <b style="color:#c9cbe8">${_r2060Ymd(rec.s)}</b> 종가까지만 보고 고름 · <b style="color:#c9cbe8">결과는 전부 규칙대로 샀다고 가정한 계산(실제 매매와 무관)</b> · 매수일 시가 매수 → +20% 익절 · 못 닿으면 5번째 거래일 종가 · 비용 0.45% · 순위 = 학습 +20% 배수 높은 셋업 → 걸린 셋업 수 → 거래대금<br>
      추격 = v2 가 빼는 종목(직전 5일 +20% 초과 · 20일 안 +15% 급등 2번 이상) · 시가 갭 +6% 초과면 v2 는 사지 않음</div>
    <table style="margin-top:10px;border-collapse:collapse;font-size:12.5px;color:#e4e6ff">
      <tr><th ${TH}>순위</th><th ${TH}>종목</th><th ${TH}>셋업</th><th ${TH}>신호일 종가</th><th ${TH}>신호일 등락</th><th ${TH}>대금(억)</th><th ${TH}>매수가(시가)</th><th ${TH}>시가 갭</th><th ${TH}>결과</th><th ${TH}>규칙수익</th><th ${TH}>5일 최고</th><th ${TH}>5일 최저</th><th ${TH}>청산일</th><th ${TH}>추격</th></tr>`;
  (rec.p || []).forEach((p, i) => {
    const clk = ` onclick="_openStock(this,function(){openR2060Detail('${k}')})" data-code="${p[1]}" data-name="${_r2060Esc(p[0])}"`
      + ` data-rate="0" data-amount="0" data-meta="🏹2060 ${k}" data-catalyst="" title="클릭 → 종목 상세(차트·일봉)"`;
    const pending = p[9] === 'P';
    h += `<tr style="border-top:1px solid #2a2d4a"><td ${TD}>${i + 1}</td>`
      + `<td ${TD}><span${clk} style="cursor:pointer;color:#ffd2b0;font-weight:700">${_r2060Esc(p[0])}</span> <span style="color:#6b6e9c">${p[1]} ${p[2] === 'P' ? '코스피' : '코스닥'}</span></td>`
      + `<td ${TD}>${_r2060Esc(p[3])}${p[4] ? ' <span style="color:#6b6e9c">(' + _r2060Esc(p[4]) + ')</span>' : ''}</td>`
      + `<td ${TD}>${_r2060Won(p[5])}</td><td ${TD}>${_r2060Pct(p[6], 2)}</td><td ${TD}>${_r2060Won(p[7])}</td>`
      + `<td ${TD}>${_r2060Won(p[8])}</td><td ${TD}>${p[19] == null ? '—' : _r2060Pct(p[19], 1)}</td>`
      + `<td ${TD}>${ST[p[9]] || ''}${p[9] === 'T' ? ' (' + p[10] + '일째)' : ''}${p[9] === 'H' ? ' (5거래일 중 ' + p[11] + '일 지남)' : ''}${p[9] === 'S' ? ' (' + p[11] + '일째에 자료 멈춤)' : ''}</td>`
      + `<td ${TD}>${pending ? '—' : _r2060Pct(p[12], 2)}</td><td ${TD}>${pending ? '—' : _r2060Pct(p[13], 1)}</td><td ${TD}>${pending ? '—' : _r2060Pct(p[14], 1)}</td>`
      + `<td ${TD}>${_r2060Ymd(p[17]) || '—'}</td><td ${TD}><span style="color:#ff9aaa">${_r2060Esc(p[18])}</span></td></tr>`;
  });
  h += `</table>`;
  // 잘린 6위 이하 = 회색 (관찰용 · 같은 규칙로 샀다고 가정한 계산)
  const X = rec.x || [];
  const sum = a => { const f = a.filter(r => r.o === 'T' || r.o === 'C'); if (!f.length) return '확정 없음'; const m = f.reduce((s, r) => s + r.rr, 0) / f.length; return `확정 ${f.length}개 · +20% ${f.filter(r => r.u).length}개 · -20% ${f.filter(r => r.dn).length}개 · 평균 ${_r2060Pct(m, 2)}`; };
  const topS = sum((rec.p || []).map(p => ({ o: p[9], rr: p[12], u: p[15], dn: p[16] }))), cutS = sum(X.map(a => ({ o: a[6], rr: a[7], u: a[10], dn: a[11] })));
  h += `<div style="margin-top:14px;font-size:12.5px;color:#c9cbe8">이날 기준 통과 <b>${(rec.p || []).length + X.length}</b>종목 = 달력 ${(rec.p || []).length}개 + 잘림 ${X.length}개${rec.z ? ` (5거래일 안 이미 뽑힌 ${rec.z}개는 제외)` : ''}<br>
    <span style="color:#ffd2b0">달력 1~5위: ${topS}</span> · <span style="color:#8487bd">잘린 6위~: ${cutS}</span></div>`;
  if (X.length) {
    const TG = 'style="white-space:nowrap;padding:2px 7px;color:#8487bd"';
    h += `<div style="margin-top:8px;font-size:12px;color:#8487bd">회색 = 기준에는 걸렸지만 순위 밖이라 달력에 안 들어간 종목 · 결과는 같은 규칙(매수일 시가 → +20% 또는 5번째 거래일 종가)으로 샀다고 가정한 계산</div>
    <table style="margin-top:4px;border-collapse:collapse;font-size:12px;color:#8487bd;opacity:.85">
      <tr><th ${TG}>순위</th><th ${TG}>종목</th><th ${TG}>셋업</th><th ${TG}>대금(억)</th><th ${TG}>결과</th><th ${TG}>규칙수익</th><th ${TG}>5일 최고</th><th ${TG}>5일 최저</th><th ${TG}>청산일</th></tr>`;
    X.forEach(a => {
      const clk = ` onclick="_openStock(this,function(){openR2060Detail('${k}')})" data-code="${a[1]}" data-name="${_r2060Esc(a[0])}" data-rate="0" data-amount="0" data-meta="🏹2060 잘림 ${k}" data-catalyst="" title="클릭 → 종목 상세(차트·일봉)"`;
      const pend = a[6] === 'P';
      const res = a[6] === 'T' ? `+20% 익절 (${a[13]}일째)` : a[6] === 'C' ? '5일째 종가' : a[6] === 'H' ? `결과대기 (5거래일 중 ${a[12]}일 지남)` : a[6] === 'P' ? '예정' : a[6] === 'S' ? '자료끊김' : '자료이상';
      h += `<tr style="border-top:1px solid #23253d"><td ${TG}>${a[5]}</td><td ${TG}><span${clk} style="cursor:pointer;color:#a9abcf">${_r2060Esc(a[0])}</span> <span style="color:#5d6090">${a[1]}</span></td><td ${TG}>${_r2060Esc(a[3])}</td><td ${TG}>${_r2060Won(a[4])}</td><td ${TG}>${res}</td>`
        + `<td ${TG}>${pend ? '—' : _r2060Pct(a[7], 2)}</td><td ${TG}>${pend ? '—' : _r2060Pct(a[8], 1)}</td><td ${TG}>${pend ? '—' : _r2060Pct(a[9], 1)}</td><td ${TG}>${_r2060Ymd(a[14]) || '—'}</td></tr>`;
    });
    h += `</table>`;
  }
  h += `</div>`;
  body.innerHTML = h;
  ov.style.display = 'flex';
}
