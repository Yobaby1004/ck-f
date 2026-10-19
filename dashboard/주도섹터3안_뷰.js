// 🌅 주도3안 = 주도섹터 단순 3안 아침 카드 달력 (2026-10-09 사용자 "메인은 캘린더야" · 맨 위 첫 버튼 · 첫 구역 = 🕸 생태계 위)
//   자료 = dashboard/data/주도섹터3안_과거.js + 주도섹터3안.js → window.JS3_DAYS {"YYYY-MM-DD": 칸} · window.JS3_META
//   빌더 = _천억장부\주도섹터3안\단순3안\달력.py (평일 08:12 아침.py 가 카드를 봉인한 뒤 build) · 관찰용 · 매수 추천 아님
//   칸 = 카드 날(그날 아침 · 전 거래일까지 자료) · ● 봉인(그날 아침 만든 것) · ○ 재현(같은 규칙으로 다시 계산 · 참고)
//   v2-X(2026-10-09 추가) = 08:55 예상체결 보정 줄 · 자료 dashboard/data/주도섹터3안_X.js(window.JS3X_DAYS · JS3X_META) · 빌더 _천억장부\주도섹터3안\v2\아침X.py
//     · 이 파일이 제 자리를 기준으로 불러옴(캘린더 HTML 본체는 안 고침) · v1 카드 바로 아래에 파란 칸 · 미래 관찰(60거래일 뒤 판정)
(function(){
  // 🏅 관찰 후보5(2026-10-11 사용자 "주도섹터 3안 달력에 관찰후보5로 걸러진 종목 넣어줘") = 맨 위 띠와 같은 것(베스트52 전진 봉인 P1)
  //   자료 dashboard/data/주도섹터3안_관찰5.js(window.JS3B5_DAYS · JS3B5_META · 빌더 단순3안\관찰5.py · 달력.py build 끝에서 갱신)
  //   오늘 08:40 봉인은 dashboard/data/베스트52_관찰후보.js(window.BEST52_WATCH)로 바로 덮어 보임 · 칸 아래 🏅 줄 + 날짜 상세 🏅 상자
  var S = { y: 0, m: 0, sel: null, wh: null, busy: false };   // wh = 마지막에 그린 🌾 줄(1분 갱신 때 바뀐 것만 다시 그림) · busy = 다시 읽는 중
  var ME = (document.currentScript && document.currentScript.src) || '';
  var WD = ['일', '월', '화', '수', '목', '금', '토'], NUM = ['①', '②', '③'];
  function E(s){ return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
  function D(){ return window.JS3_DAYS || {}; }
  function M(){ return window.JS3_META || {}; }
  function DX(){ return window.JS3X_DAYS || {}; }
  function MX(){ return window.JS3X_META || {}; }
  function DB(){ return window.JS3B5_DAYS || {}; }   // 🏅 관찰 후보5(2026-10-11 · 단순3안\관찰5.py)
  function MB(){ return window.JS3B5_META || {}; }
  // HERMES3 2026-10-18 · 과거재생 저장본만 표시(선정·모형·원자료 변경 없음)
  function DH(){ return window.HERMES3_DAYS || {}; }
  function MH(){ return window.HERMES3_META || {}; }
  function hKeys(){ return Object.keys(DH()).filter(function(k){ return /^\d{4}-\d{2}-\d{2}$/.test(k); }).sort(); }
  function hLatest(){ var ks = hKeys(); return ks.length ? ks[ks.length - 1] : null; }
  function hPicks(e){ return Array.isArray(e.selected) ? e.selected : []; }
  function num(x){ return typeof x === 'number' && isFinite(x) ? x : null; }
  function hScore(e){ return e && e.score && typeof e.score === 'object' ? e.score : null; }
  function hDetail(s, code){ var ds = s && Array.isArray(s.details) ? s.details : []; return ds.filter(function(x){ return String(x && x.code || '') === String(code || ''); })[0] || null; }
  function hOutcome(d){
    if (!d) return '미확정';
    if (d.Y === 1) return '+20 성공';
    if (d.Y === 0) return '+20 실패';
    return '미확정';
  }
  function hChip(p, k, s){
    var d = hDetail(s, p && p.code), r = d ? num(d.return_pct) : null;
    var tail = ' <small class="js3-hout ' + (d && d.Y === 1 ? 'ok' : d && d.Y === 0 ? 'fail' : 'wait') + '">' + E(hOutcome(d)) + ' · ' + (r == null ? '미확정' : '비용후 ' + pc(r)) + '</small>';
    return chip(p.name || p.code, p.code, k, tail, '헤르메스 추천주 3개 ' + k);
  }
  function hDayLine(s){
    if (!s) return '<div class="js3-hscore wait">채점 대기</div>';
    var hit = num(s.hit), unknown = num(s.unknown), cash = num(s.cash), r = num(s.return_pct);
    return '<div class="js3-hscore">+20 ' + (hit == null ? '미상' : hit) + '/' + (num(s.budget) == null ? '3' : s.budget) + ' · 불명 ' + (unknown == null ? '미상' : unknown) + ' · 현금 ' + (cash == null ? '미상' : cash) + ' · 비용후 ' + (r == null ? '미확정' : pc(r)) + '</div>';
  }
  function hCell(k){
    var e = DH()[k]; if (!e) return '';
    var names = hPicks(e).map(function(p){ return p.name || p.code; }).join(' · '), s = hScore(e);
    return '<div class="js3-hcell" title="' + E('헤르메스 추천주 3개 · ' + k + ' · ' + (e.status || 'UNKNOWN') + ' · ' + (names || '확인된 종목 없음') + ' · 과거재생(B)') + '"><b>헤르메스 추천주 3개</b><br>' + E(names || '확인된 종목 없음') + hDayLine(s) + '</div>';
  }
  function hReportHref(meta){
    var u = String(meta && meta.score_summary && meta.score_summary.report_url || '');
    return /^dashboard\/[A-Za-z0-9가-힣_\-]+\.html$/.test(u) ? u : '';
  }
  function hPct2(v){ return num(v) == null ? '미확정' : (v >= 0 ? '+' : '') + Number(v).toFixed(2) + '%'; }
  function hSummaryHTML(){
    var s = MH().score_summary; if (!s || typeof s !== 'object') return '';
    var href = hReportHref(MH()), mean = num(s.mean_return_pct), median = num(s.median_return_pct), base = num(s.baseline_amount3_mean_pct), diff = num(s.comparison_paired_diff_amount3_pct);
    return '<div class="js3-hsummary"><b>헤르메스3 과거저장 ' + E(s.planned_days == null ? '전체' : s.planned_days + '일') + ' 채점 요약</b><div class="js3-sm">적중 H ' + E(s.H == null ? '미상' : s.H) + ' / 전체 슬롯 ' + E(s.planned_slots == null ? '미상' : s.planned_slots) + ' · 미확정 ' + E(s.U == null ? '미상' : s.U) + '</div>'
      + '<div class="js3-sm">평균 ' + hPct2(mean) + ' · 중앙 ' + hPct2(median) + ' · 손익 확인 ' + E(s.known_return_days == null ? '미상' : s.known_return_days) + '/' + E(s.planned_days == null ? '미상' : s.planned_days) + '일 + 미확정 ' + E(s.unknown_return_days == null ? '미상' : s.unknown_return_days) + '일</div>'
      + '<div class="js3-sm">시장대금3 ' + hPct2(base) + (diff == null ? '' : ' · 같은 날 짝차이 ' + hPct2(diff).replace('%', '%p') + (num(s.comparison_paired_return_days_amount3) == null ? '' : ' (' + s.comparison_paired_return_days_amount3 + '일)')) + ' · <b style="color:#ff9aaa">' + E(s.verdict || '전체 관문 미평가') + '</b></div>'
      + (href ? '<a class="js3-hreport" href="' + E(href) + '" target="_blank" rel="noopener">전체 채점표</a>' : '') + '</div>';
  }
  function hHTML(k, recent){
    var e = DH()[k]; if (!e) return '';
    var meta = MH(), ps = hPicks(e), src = String(e.source_file || ''), hash = String(e.forecast_sha256 || ''), score = hScore(e);
    var h = '<div class="js3-hermes"' + (recent ? ' id="js3-hermes-latest"' : '') + '><div class="js3-hhd"><b>헤르메스 추천주 3개</b> · ' + E(recent ? '독립 최근저장본' : '날짜별 저장본') + ' <b>' + E(k) + '</b>';
    if (recent) h += ' <button class="js3-wbtn" onclick="js3HermesLatest()">해당날짜보기</button>';
    h += '</div><div class="js3-sm">' + E('명단 날짜 D ' + (e.D || k) + ' · 자료 기준 P ' + (e.P || '미상') + ' · ' + (e.kind || '과거재생') + ' · 상태 ' + (e.status || 'UNKNOWN')) + '</div>';
    h += '<div class="js3-hchips">' + ps.map(function(p){ return hChip(p, k, score); }).join('') + (ps.length ? '' : '<span>확인된 종목 없음</span>') + '</div>' + hDayLine(score);
    h += '<div class="js3-sm">' + E('현금 칸 ' + (e.cash_slots == null ? '미상' : e.cash_slots) + ' · 불명 칸 ' + (e.unknown_slots == null ? '미상' : e.unknown_slots) + ' · 버전 ' + (e.source_run || '미상') + ' · 방법 ' + (e.method || '미상')) + '</div>';
    h += '<div class="js3-sm i" title="' + E(src) + '">원저장경로 ' + E(short(src, 100) || '미상') + '</div><div class="js3-sm i" style="overflow-wrap:anywhere">SHA-256 ' + E(hash || '미상') + '</div>';
    h += '<div class="js3-sm i">' + E('원자료 시각 ' + (e.selected_at || '미상') + ' · 시점 유형 ' + (e.temporal_kind || '미상') + ' · 품질 ' + (e.quality || '미상')) + '</div>';
    h += '<div class="js3-sm">과거재생(B)·당시 실시간 발송 아님·관찰용 · 매수 추천 아님</div><div class="js3-sm i">당일고가/전일종가 +20 판정은 시가매수 +20 체결 보장이 아님 · 시가→종가 비용 0.35%p</div>';
    if (recent) h += '<div class="js3-sm i">' + E('현재 3안 날짜 ' + (latest() || '없음') + '와 별개인 저장본 · ' + (meta.run_status || '') + ' · 갱신 ' + (meta.updated_at || '미상')) + '</div>';
    return h + '</div>';
  }
  function hLatestBox(){
    var k = hLatest();
    return hSummaryHTML() + (k ? hHTML(k, true) : '<div class="js3-hermes"><b>헤르메스 추천주 3개</b><div class="js3-sm">저장본 없음 · 실시간 추천 아님</div><div class="js3-sm i">' + E(MH().run_status || '') + '</div></div>');
  }
  function DW(){ return window.JS3W || null; }   // 🌾 아침 일꾼(2026-10-09 · 단순3안\일꾼현황.py)
  function pad(n){ return (n < 10 ? '0' : '') + n; }
  function key(y, m, d){ return y + '-' + pad(m + 1) + '-' + pad(d); }
  function keys(){ return Object.keys(D()).sort(); }
  function latest(){ var ks = keys(); return ks.length ? ks[ks.length - 1] : null; }
  function fdk(k){ var t = new Date(k + 'T00:00:00'); return (t.getMonth() + 1) + '/' + t.getDate() + '(' + WD[t.getDay()] + ')'; }
  function fmd(n){ if (!n) return ''; var s = String(n); return Number(s.slice(4, 6)) + '/' + Number(s.slice(6, 8)); }
  function pc(x){ return x == null ? '-' : (x >= 0 ? '+' : '') + Number(x).toFixed(1) + '%'; }
  function col(x){ return x == null ? '#8487bd' : (x > 0 ? '#ff6b6b' : x < 0 ? '#6bb7ff' : '#c9cbe8'); }
  function short(s, n){ s = String(s || ''); return s.length > n ? s.slice(0, n) + '…' : s; }

  function css(){
    if (document.getElementById('js3-css')) return;
    var st = document.createElement('style'); st.id = 'js3-css';
    st.textContent = 'html:not(.desc-open-js3) .cal-desc[data-desc="js3"]{display:none !important}'
      + '#sec-js3 .js3-today{background:linear-gradient(180deg,rgba(255,183,77,.08),rgba(14,20,36,.6));border:1px solid rgba(255,183,77,.45);border-radius:14px;padding:12px 14px;margin:6px 0 4px}'
      + '.js3-tline{font-size:15px;color:#fff;margin-bottom:8px}.js3-kind{font-size:12px;border-radius:8px;padding:1px 8px;margin-left:6px}'
      + '.js3-kind.sl{background:rgba(255,183,77,.18);color:#ffcc80}.js3-kind.re{background:rgba(132,135,189,.18);color:#b8bde6}'
      + '.js3-row{display:flex;gap:10px;flex-wrap:wrap}.js3-card{flex:1;min-width:260px;background:#111830;border:1px solid rgba(255,255,255,.1);border-radius:12px;padding:10px 12px;font-size:12.5px;color:#dce8ff;line-height:1.55}'
      + '#sec-js3 .js3-hd,#js3-modal .js3-hd{font-size:15px;margin-bottom:4px}.js3-no{background:#ff9f43;color:#1a1200;border-radius:6px;padding:0 7px;font-size:12px;font-weight:800}'
      + '.js3-ok{color:#5effd6;font-weight:700;font-size:12px}.js3-no2{color:#7a8199;font-size:12px}.js3-risk{background:#c62828;color:#fff;border-radius:6px;padding:0 6px;font-size:11px}'
      + '.js3-chips span{display:inline-block;background:#1a2340;border-radius:9px;padding:0 7px;margin:1px 3px 1px 0;font-size:11px;color:#b8bde6}'
      + '.js3-mat{color:#ffd166;margin:3px 0}.js3-mat i,.js3-sm i,.js3-res i{color:#8487bd;font-style:normal}.js3-rep{font-size:15px;margin-top:6px}.js3-rep i{font-size:11px;color:#8487bd;font-style:normal}'
      + '.js3-sm{font-size:12px;color:#c9cbe8;margin-top:2px}.js3-sm.i{color:#9aa3c7}.js3-res{background:rgba(94,255,214,.07);border-radius:6px;padding:1px 8px;margin-top:4px}'
      + '.js3-ans{font-size:12.5px;color:#c9cbe8;margin-top:8px}.js3-ans b{color:#5effd6}.js3-watch{font-size:12px;color:#ffb74d;margin-top:6px}'
      + '.js3-warn{background:#3a1010;border:1px solid #ff6b6b;color:#ffd0d0;border-radius:8px;padding:6px 10px;margin-bottom:8px;font-size:13px}.js3-warn2{font-size:12px;color:#ff9aaa;margin-top:6px}'
      + '.js3-chip{display:inline-block;background:#161c33;border:1px solid rgba(255,183,77,.35);color:#fff;border-radius:9px;padding:1px 8px;margin:1px 2px;cursor:pointer}'
      + '.js3-rep .js3-chip{font-size:15px;font-weight:700;border-color:rgba(255,183,77,.6)}'
      + '#sec-js3 .js3-cell{position:relative;min-height:86px;padding:5px;border-radius:8px;cursor:pointer;font-size:10.5px;line-height:1.35;overflow:hidden}'
      + '#sec-js3 .js3-cell.sl{background:#1d1a2e;border:1px solid rgba(255,183,77,.55)}#sec-js3 .js3-cell.re{background:#0f1626;border:1px dashed rgba(132,135,189,.35)}'
      + '#sec-js3 .js3-cell.sel{border:1px solid #ff4d4d !important}#sec-js3 .js3-cell.empty{background:#0b101c;border:1px solid rgba(255,255,255,.04);cursor:default}'
      + '#sec-js3 .js3-cd{font-size:11px;color:#8487bd;margin-bottom:2px}#sec-js3 .js3-cd b{color:#5effd6}#sec-js3 .js3-cl{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:#9aa3c7}'
      + '#sec-js3 .js3-foot{font-size:11.5px;color:#8487bd;margin-top:8px;line-height:1.6}'
      + '.js3-x{margin-top:10px;background:rgba(94,180,255,.06);border:1px solid rgba(94,180,255,.38);border-radius:12px;padding:8px 10px}'
      + '.js3-xhd{font-size:13.5px;color:#cfe6ff;margin-bottom:6px}.js3-kind.xk{background:rgba(94,180,255,.18);color:#9fd0ff}'
      + '.js3-xrow{display:flex;gap:8px;flex-wrap:wrap}.js3-xcard{flex:1;min-width:220px;background:#0f1830;border:1px solid rgba(94,180,255,.25);border-radius:10px;padding:6px 10px;font-size:12px;color:#dce8ff;line-height:1.5}'
      + '.js3-xno{background:#4aa3ff;color:#06121f;border-radius:6px;padding:0 6px;font-size:11px;font-weight:800}.js3-xp{color:#9fd0ff;font-size:11.5px;margin-left:4px}'
      + '.js3-w{background:rgba(120,220,140,.05);border:1px solid rgba(120,220,140,.35);border-radius:12px;padding:7px 10px;margin:0 0 10px}'
      + '.js3-wt{font-size:13.5px;color:#c8f7d2;font-weight:700}.js3-wrow{display:flex;gap:6px;flex-wrap:wrap;margin-top:5px}'
      + '.js3-wi{font-size:12px;border-radius:9px;padding:2px 9px;background:#141c2e;border:1px solid rgba(255,255,255,.12);color:#dce8ff}'
      + '.js3-wi b{margin-right:4px}.js3-wi i{font-style:normal;color:#9aa3c7;margin-left:5px}'
      + '.js3-wi.ok{border-color:rgba(94,255,214,.45)}.js3-wi.ok b{color:#5effd6}.js3-wi.none b{color:#9fd0ff}'
      + '.js3-wi.turn{border-color:#ffb74d;background:rgba(255,183,77,.12)}.js3-wi.turn b{color:#ffb74d}'
      + '.js3-wi.bad{border-color:#ff6b6b;background:rgba(255,107,107,.12)}.js3-wi.bad b{color:#ff6b6b}'
      + '.js3-wturn{font-size:12.5px;color:#ffcc80;margin-top:6px}.js3-wbad{font-size:12.5px;color:#ff9aaa;margin-top:3px}'
      + '.js3-w.alarm{border-color:#ff6b6b;background:rgba(255,107,107,.07)}'
      + '.js3-walarm{background:#3a1010;border:1px solid #ff6b6b;color:#ffd0d0;border-radius:8px;padding:5px 10px;margin-top:6px;font-size:13px;line-height:1.55}'
      + '.js3-walarm b{color:#ff8a8a}.js3-walarm i{font-style:normal;color:#d9a3a3;font-size:12px}.js3-wnote{font-size:12px;color:#9aa3c7;margin-top:5px}.js3-wrow.old{opacity:.45}'
      + '.js3-wbtn{background:transparent;border:1px solid rgba(120,220,140,.5);color:#c8f7d2;border-radius:8px;padding:0 8px;margin-left:6px;font-size:11px;cursor:pointer}.js3-wbtn:hover{background:rgba(120,220,140,.15)}'
      + '.js3-wlate{color:#ff6b6b;font-weight:700}'
      + '#sec-js3 .js3-att{margin-top:2px;padding:1px 3px;font-size:10px;line-height:1.3;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;border-top:1px dashed rgba(255,255,255,.1);color:#9aa3c7}'
      + '#sec-js3 .js3-att.bad{background:rgba(255,107,107,.16);border-radius:4px;border-top-color:transparent}#sec-js3 .js3-att.wait{color:#7a8199}'
      + '#sec-js3 .js3-cell.empty.att{cursor:pointer;border:1px dashed rgba(120,220,140,.35)}#sec-js3 .js3-cell.empty.att.sel{border:1px solid #ff4d4d}'
      + '.js3-attbox{background:rgba(120,220,140,.05);border:1px solid rgba(120,220,140,.38);border-radius:12px;padding:8px 10px;margin:0 0 12px;font-size:12.5px;color:#dce8ff}'
      + '.js3-attbox.bad{border-color:#ff6b6b;background:rgba(255,107,107,.06)}.js3-attbox.wait{border-style:dashed;color:#9aa3c7}'
      + '.js3-atttb{border-collapse:collapse;margin-top:6px;font-size:12px;width:100%}.js3-atttb td{border-top:1px solid rgba(255,255,255,.07);padding:3px 6px;vertical-align:top;color:#c9cbe8;line-height:1.5}'
      + '.js3-atttb td:first-child{color:#9aa3c7;white-space:nowrap;width:150px}.js3-atttb i{font-style:normal;color:#8487bd}'
      + '#sec-js3 .js3-b5c{margin-top:1px;font-size:10px;color:#e6c76a;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}#sec-js3 .js3-b5c.none{color:#6f7690}'
      + '.js3-b5{margin-top:10px;background:rgba(214,170,40,.06);border:1px solid rgba(214,170,40,.45);border-radius:12px;padding:8px 10px}'
      + '.js3-b5hd{font-size:13.5px;color:#f3dc8a;margin-bottom:6px}.js3-kind.b5k{background:rgba(214,170,40,.18);color:#f3dc8a}'
      + '.js3-b5row{display:flex;gap:6px;flex-wrap:wrap;margin:4px 0}.js3-b5p{background:#151a2e;border:1px solid rgba(214,170,40,.28);border-radius:10px;padding:3px 8px;font-size:12px;color:#dce8ff}'
      + '.js3-b5p i,.js3-b5 .js3-sm i{font-style:normal;color:#8487bd;font-size:11px}.js3-b5no{background:#d6aa28;color:#1a1200;border-radius:6px;padding:0 6px;font-size:11px;font-weight:800}'
      // HERMES3 2026-10-18
      + '.js3-hermes,.js3-hsummary{margin:10px 0;padding:10px 12px;border:1px solid rgba(177,146,255,.55);border-radius:12px;background:rgba(177,146,255,.07);color:#dce8ff}.js3-hsummary{border-color:rgba(177,146,255,.8);background:rgba(177,146,255,.12)}.js3-hhd{font-size:14px;color:#dbcaff}.js3-hchips{display:flex;flex-wrap:wrap;gap:4px;margin:7px 0}.js3-hcell{margin-top:4px;padding-top:3px;border-top:1px dashed rgba(177,146,255,.4);font-size:10px;color:#dbcaff;white-space:normal;overflow-wrap:anywhere}.js3-hscore{font-size:10px;color:#d9cffb;margin-top:2px}.js3-hscore.wait{color:#9aa3c7}.js3-hout{font-size:10px;margin-left:2px}.js3-hout.ok{color:#5effd6}.js3-hout.fail{color:#ff9aaa}.js3-hout.wait{color:#9aa3c7}.js3-hreport{display:inline-block;margin-top:5px;color:#cbb6ff;font-size:12px}'
      + '.js3-b5 a{color:#9fd0ff}.js3-b5st{margin-top:5px;padding-top:4px;border-top:1px dashed rgba(214,170,40,.3)}';
    document.head.appendChild(st);
  }

  function ensure(){
    var sec = document.getElementById('sec-js3'); if (sec) return sec;
    sec = document.createElement('section'); sec.id = 'sec-js3'; sec.className = 'onepage-sec'; sec.style.scrollMarginTop = '80px';
    // 자리 = 🕸 생태계 바로 위(맨 위 버튼 순서 🌅 주도3안 → 🕸 생태계 … 와 같은 순서 · 2026-10-07 사용자 "버튼순서와 달력순서 일치")
    var eco = document.getElementById('sec-eco');
    if (eco && eco.parentNode) eco.parentNode.insertBefore(sec, eco);
    else (document.querySelector('main') || document.body).appendChild(sec);
    return sec;
  }

  function chip(n, c, k, tail, meta){
    if (!n) return '';
    return '<span class="js3-chip" onclick="js3Stock(this,\'' + k + '\')" data-code="' + E(c || '') + '" data-name="' + E(n) + '" data-rate="0" data-amount="0" data-meta="' + E(meta || ('🌅 주도3안 ' + k)) + (meta ? '" data-source="헤르메스" data-hermes-meta="' + E(meta) : '') + '" title="종목 창 열기">' + E(n) + (tail || '') + '</span>';
  }
  function kindLabel(e){ return e.k === '봉인' ? '● ' + (e.t || '') + ' 봉인' : e.k === '늦은봉인' ? '◐ ' + (e.t || '') + ' 늦은 봉인(장 시작 뒤)' : '○ 재현(그날 아침 봉인 아님)'; }

  function cardHTML(it, i, k){
    var r = it.r, h = '<div class="js3-card">';
    h += '<div class="js3-hd"><span class="js3-no">' + (i + 1) + '안</span> <b>' + E(it.s) + '</b>'
      + (it.hit === true ? ' <span class="js3-ok">✓ 정답 섹터</span>' : it.hit === false ? ' <span class="js3-no2">✗ 정답 아님</span>' : '') + '</div>';
    var ch = [];
    if (it.f != null) ch.push('최근 20일 ' + it.f + '회' + (it.f5 != null ? ' · 5일 ' + it.f5 + '회' : ''));
    if (it.x != null) ch.push('5일 새 돈 ' + Number(it.x).toLocaleString() + '억');
    if (it.n10) ch.push('어제 +10% ' + it.n10 + '종목');
    if (it.lu) ch.push('상한가 목록 ' + it.lu);
    if (it.ah) ch.push('시간외 상승 ' + it.ah);
    if (it.h52) ch.push('52주 신고가 ' + it.h52);
    if (it.nw) ch.push('어제 장전뉴스');
    if (it.ap) ch.push('어제 정답 섹터');
    if (ch.length) h += '<div class="js3-chips">' + ch.map(function(c){ return '<span>' + E(c) + '</span>'; }).join('') + '</div>';
    if (it.m) h += '<div class="js3-mat">재료 ' + E(it.m) + (it.md ? ' <i>(' + fmd(it.md) + ')</i>' : '') + '</div>';
    if (r){
      h += '<div class="js3-rep">' + chip(r.n, r.c, k, '') + (r.c ? ' <i>' + E(r.c) + (r.mk ? ' · ' + E(r.mk) : '') + '</i>' : '')
        + (r.lead === true ? ' <span class="js3-ok">★ 실제 대장</span>' : '')
        + (r.risk || []).map(function(x){ return ' <span class="js3-risk">' + E(x) + '</span>'; }).join('') + '</div>';
      if (r.r1 != null) h += '<div class="js3-sm">어제 <b style="color:' + col(r.r1) + '">' + pc(r.r1) + '</b> · 5일 ' + pc(r.r5)
        + (r.ma != null ? ' · 20일선 위 ' + pc(r.ma) : '') + (r.a != null ? ' · 어제 거래대금 ' + Number(r.a).toLocaleString() + '억' : '')
        + (r.l20 != null ? ' · 최근 20일 대장 ' + r.l20 + '번' : '') + (r.lp ? ' · 어제 대장' : '') + '</div>';
      if (r.m) h += '<div class="js3-sm i">종목 재료 ' + E(short(r.m, 90)) + (r.md ? ' (' + fmd(r.md) + ')' : '') + '</div>';
      if (r.res) h += '<div class="js3-res">그날 <b style="color:' + col(r.res.d) + '">' + pc(r.res.d) + '</b> <i>(시가 갭 ' + pc(r.res.g) + ' · 시가→종가 ' + pc(r.res.oc) + ')</i></div>';
    } else h += '<div class="js3-sm">관망: 어제 거래대금 20억 이상 자격 종목 없음</div>';
    if (it.rel && it.rel.length) h += '<div class="js3-sm">관련주 ' + it.rel.map(function(x){ return chip(x[0], x[1], k, x[2] != null ? ' <b style="color:' + col(x[2]) + '">' + pc(x[2]) + '</b>' : ''); }).join('') + '</div>';
    return h + '</div>';
  }
  function ansHTML(e){
    if (!e.ans) return '';
    return '<div class="js3-ans">그날 정답 ' + e.ans.map(function(a){ return a[0] + '위 <b>' + E((a[1] || []).join('·')) + '</b>' + (a[2] && a[2].length ? ' (' + E(a[2].join(', ')) + ')' : ''); }).join(' · ')
      + (e.S != null ? ' · 섹터 맞힘 ' + Math.round(e.S * 3) + '/3' : '') + (e.L ? ' · 대장 맞힘 ' + Math.round(e.L * 3) + '/3' : '') + '</div>';
  }
  function watchHTML(){
    var oc = M().관찰조건;
    return '<div class="js3-watch">관찰 조건: 시가가 어제 종가보다 +5% 이상 높게 시작하면 지켜보기만'
      + (oc ? ' (확인 구간 이런 시작 ' + oc.건 + '건의 시가→종가 평균 ' + pc(oc.시가종가) + ')' : '') + ' · 장 초반 대표·관련주가 같이 오르는지 확인(같이 안 오르면 오늘 주도 섹터가 아닐 수 있음)</div>';
  }
  function fkD(n){ var s = String(n || ''); return s.slice(0, 4) + '-' + s.slice(4, 6) + '-' + s.slice(6, 8); }
  // ⏰ '안 왔음' 경보(2026-10-10 사용자 "Step 2 진행") · 🌾 줄 자료(JS3W)는 일꾼이 와야만 바뀌므로, 캘린더를 연 '지금 시각'으로 '마감이 지났는데 소식 없음'을 빨갛게 표시
  //   거래일만(주말·window.증시휴장_DATA 제외) · 08:20 = 오늘 v1 흔적(현황판이 오늘 08:10 뒤 갱신됨 또는 오늘 칸 봉인) · 08:40 = v1 봉인·텔레그램 · 09:00 = X·예상체결
  //   화면만 바꿈(자료·봉인·텔레그램 파일은 안 건드림) · 캘린더를 켜 두면 거래일 08:05~09:40 1분마다 일꾼·X 자료를 새로 읽음(↻ 다시 보기 = 손으로 바로)
  function nowInfo(){
    var t = new Date(), k = key(t.getFullYear(), t.getMonth(), t.getDate()), s = pad(t.getHours()) + ':' + pad(t.getMinutes());
    return { k: k, hm: t.getHours() * 100 + t.getMinutes(), s: s, f: k + ' ' + s };
  }
  function isTrading(k){ var d = new Date(k + 'T00:00:00').getDay(); return d > 0 && d < 6 && !(window.증시휴장_DATA || {})[k]; }
  function nextTrading(k){ var t = new Date(k + 'T00:00:00'); for (var i = 0; i < 20; i++){ t.setDate(t.getDate() + 1); var kk = key(t.getFullYear(), t.getMonth(), t.getDate()); if (isTrading(kk)) return kk; } return k; }
  function sealOf(k){ var e = D()[k]; return e && (e.k === '봉인' || e.k === '늦은봉인') ? e : null; }
  // 칸 출석 표시·증거 상자(2026-10-10 사용자 "Step 4 진행") · 자료 = JS3W '출석'(단순3안\일꾼_출석부.jsonl 최근 60거래일 · 일꾼현황.py 가 싣음)
  //   칸 아래 = v1 · 예(예상체결) · X · 📨(텔레그램) 표시(✓ 됨 · ✗ 안 됨 · ◐ 늦음/일부 · ○ X 없음 · ! 사용자 차례) · 결석이 있으면 빨간 바탕
  //   칸을 누르면 창 맨 위 = 그날 일꾼 6칸 + 결석·차례 + 증거(온 시각 · 봉인 시각·지문 · 예상체결 값 시각 · 텔레그램 보낸 시각 · 예약 결과)
  var ATT_COL = { '✓': '#5effd6', '✗': '#ff6b6b', '!': '#ffb74d', '◐': '#ffb74d', '○': '#9fd0ff', '-': '#6f7690' };
  var ATT_NM = { cal: '캘린더 입력', bar: '천프정 일봉', exp: '예상체결', v1: 'v1 카드', x: 'v2-X', tg: '텔레그램' };
  function attOf(k){
    var w = DW(), ar = w && w.출석;
    if (!ar) return null;
    if (S.attV !== ar){ S.attV = ar; S.att = {}; ar.forEach(function(r){ if (r && r.D) S.att[fkD(r.D)] = r; }); }
    return S.att[k] || null;
  }
  function attPending(k){   // 닫힌 거래일인데 출석 줄이 아직 없음(다음 일꾼 실행 때 채워짐)
    var w = DW(), ab = w && w.출석부, ar = (w && w.출석) || [];
    if (!ab || attOf(k) || !isTrading(k) || k >= nowInfo().k) return false;
    return k >= fkD(ab.줄 > ar.length && ar.length ? ar[0].D : ab.시작);
  }
  function attTitle(r){
    if (!r) return '출석 기록 전(다음 일꾼 실행 때 채워짐)';
    var c = r.칸 || {}, t = function(id){ return (c[id] || ['-', ''])[1]; };
    return '출석: v1 ' + t('v1') + ' / 예상체결 ' + t('exp') + ' / X ' + t('x') + ' / 텔레그램 ' + t('tg') + ((r.결석 || []).length ? ' / 결석 ' + r.결석.map(function(i){ return ATT_NM[i] || i; }).join('·') : '');
  }
  function attSym(r, id){   // ✗ 인데 일꾼 탓(결석)이 아니면 = 사용자 차례로 생긴 일(예: 캘린더 늦어 카드 없음) → 주황 !
    var s = ((r.칸 || {})[id] || ['-'])[0];
    return s === '✗' && (r.결석 || []).indexOf(id) < 0 ? '!' : s;
  }
  function attMarks(r){
    return '<div class="js3-att' + ((r.결석 || []).length ? ' bad' : '') + '">' + [['v1', 'v1'], ['exp', '예'], ['x', 'X'], ['tg', '📨']].map(function(p){   // 예 = 예상체결(2026-10-10 Step 5 고장 흉내에서 찾음: 예상체결만 빠진 날에도 ✗ 가 보이게)
      var s = attSym(r, p[0]); return '<span style="color:' + (ATT_COL[s] || '#9aa3c7') + '">' + E(p[1] + s) + '</span>';
    }).join(' ') + '</div>';
  }
  function attWait(){ return '<div class="js3-att wait">출석 기록 전</div>'; }
  function fts(s){ s = String(s || ''); return s.length >= 6 ? s.slice(0, 2) + ':' + s.slice(2, 4) + ':' + s.slice(4, 6) : s; }
  function attBox(k){
    var r = attOf(k);
    if (!r) return attPending(k) ? '<div class="js3-attbox wait"><b>출석 · ' + fdk(k) + ' 아침 일꾼</b> · 기록 전 <span class="js3-sm" style="display:inline">(다음 일꾼 실행 때 채워짐: 저녁 /매매일 뒤 또는 다음 거래일 08:12)</span></div>' : '';
    var c = r.칸 || {}, ev = r.증거 || {}, ab = r.결석 || [], tn = r.차례 || [];
    var cls = function(s){ return s === '✓' ? 'ok' : (s === '!' || s === '◐') ? 'turn' : s === '✗' ? 'bad' : s === '○' ? 'none' : ''; };
    var nm = function(l){ return l.map(function(i){ return ATT_NM[i] || i; }).join(' · '); };
    var h = '<div class="js3-attbox' + (ab.length ? ' bad' : '') + '"><b>출석 · ' + fdk(k) + ' 아침 일꾼</b> <span class="js3-sm" style="display:inline">'
      + E(String(r.적음 || '').slice(5)) + ' 적음' + (r.보충 ? ' · 나중 보충(그날 아침엔 못 적어 예약 결과 없음)' : '') + ' · 고쳐 쓰지 않는 기록</span>';
    h += '<div class="js3-wrow">' + ['cal', 'bar', 'exp', 'v1', 'x', 'tg'].map(function(id){ var x = c[id] || ['-', ''], s = attSym(r, id); return '<span class="js3-wi ' + cls(s) + '"><b>' + E(s) + '</b>' + E(ATT_NM[id]) + '<i>' + E(x[1]) + '</i></span>'; }).join('') + '</div>';
    h += '<div class="js3-sm" style="margin-top:4px">' + (ab.length ? '<b style="color:#ff6b6b">결석: ' + E(nm(ab)) + '</b>' : '<b style="color:#5effd6">결석 없음</b>')
      + (tn.length ? ' · <b style="color:#ffb74d">사용자 차례: ' + E(nm(tn)) + '</b>' : '') + '</div>';
    var v = ev.v1 || {}, x = ev.x || {}, tg = ev.텔레그램 || {}, tk = ev.예약 || {};
    var kind = function(z){ return { 카드: '카드', 캘린더늦음: '늦음 알림', 자료늦음: '늦음 알림', 오류: '오류 알림', X: '카드' }[z] || z; };
    var rows = [
      ['v1 카드(08:12 일꾼)', [v.온때 ? '온 시각 ' + v.온때 : '온 기록 없음', v.봉인 ? '봉인 ' + v.봉인 + (v.상태 ? ' (' + v.상태 + ')' : '') : (v.상태 ? ({ 캘린더늦음: '캘린더 늦음 알림', 자료늦음: '자료 늦음 알림' }[v.상태] || v.상태) : '봉인 없음'), v.지문 ? '지문 ' + v.지문 : ''].filter(Boolean).join(' · ')],
      ['v2-X(08:45 일꾼)', [x.온때 ? '온 시각 ' + x.온때 : '온 기록 없음', x.봉인 ? (x.상태 === '없음' ? '기록 ' + x.봉인 + ' (X 없음)' : '봉인 ' + x.봉인 + (x.상태 ? ' (' + x.상태 + ')' : '')) : '봉인 없음', x.지문 ? '지문 ' + x.지문 : '', x.스냅숏 ? '예상체결 ' + fts(x.스냅숏) + ' 기준' : '', x.없음사유 ? 'X 없음 사유: ' + x.없음사유 : ''].filter(Boolean).join(' · ')],
      ['예상체결(08:20 수집기)', ev.예상체결 ? '08:55 전 마지막 값 ' + fts(ev.예상체결) : '08:55 전 값 없음'],
      ['텔레그램', [tg.v1 ? 'v1 ' + kind(tg.v1[0]) + ' ' + tg.v1[1] : 'v1 보낸 기록 없음', tg.x ? (tg.x[0] === 'X' ? (x.상태 === '없음' ? 'X 없음 알림 ' : 'X 카드 ') : 'X ' + kind(tg.x[0]) + ' ') + tg.x[1] : 'X 보낸 기록 없음'].join(' · ')],
      ['예약 작업', Object.keys(tk).length ? Object.keys(tk).map(function(n){ return n + ' 마지막 ' + String(tk[n].마지막 || '').slice(5) + ' ' + (tk[n].결과 || ''); }).join(' · ') : (r.보충 ? '나중 보충이라 그날 예약 결과 없음' : '그날 예약 결과 기록 없음')]
    ];
    h += '<table class="js3-atttb">' + rows.map(function(rw){ return '<tr><td>' + E(rw[0]) + '</td><td>' + E(rw[1]) + (rw[0] === '텔레그램' ? ' <i>(폰에서 받은 시각과 같아야 함)</i>' : '') + '</td></tr>'; }).join('') + '</table>';
    h += '<div class="js3-sm i" style="margin-top:4px">원본: 단순3안\\일꾼_출석부.jsonl · 봉인기록.jsonl · 보낸기록.jsonl · 아침_로그.txt 머리말 · v2\\봉인기록_X.jsonl · 보낸기록_X.jsonl · 아침X_로그.txt 머리말 · 예상체결 rank.csv</div>';
    return h + '</div>';
  }
  function watchdog(w, items){
    // 반환 = { lines: 빨간 경보 줄(HTML) · extra: 항목에 안 걸린 경보 수 · old: 현황판이 지난 카드 것인가 · note: 회색 안내 · now }
    var nw = nowInfo(), tk = nw.k, kx = fkD(w.D), wm = String(w.만든때 || ''), out = { lines: [], extra: 0, old: kx < tk, note: '', now: nw };
    var want = isTrading(tk) && nw.hm < 1530 ? tk : nextTrading(tk);   // 지금 기다리는 카드 날(일꾼현황.py card_day 와 같은 뜻)
    var tn = function(id, d){ var t = (w.tasks || {})[id]; return (t && t.이름) || d; };
    var T1 = tn('v1', '천억_주도섹터단순3안_아침_0812'), TX = tn('X', '천억_주도섹터X_아침_0845'), last = E(wm.slice(5) || '-');
    if (isTrading(tk) && nw.hm >= 820){
      var s1 = sealOf(tk), wHM = Number(wm.slice(11, 13) + wm.slice(14, 16)) || 0;
      var fresh = wm.slice(0, 10) === tk && wHM >= 810, came = !!s1 || fresh, xt = DX()[tk], who = [];
      if (kx === tk){   // 현황판 = 오늘 카드 · '…'(기다림·예정)이 마감을 넘기면 ✗
        items.forEach(function(it){
          if (it.s !== '…') return;
          if (it.id === 'v1'){
            if (s1){ it.s = '✓'; it.t = (s1.t || '') + (s1.k === '봉인' ? ' 봉인' : ' 늦은 봉인'); }
            else if (!came){ it.s = '✗'; it.t = '08:20 지나도 소식 없음'; it.a = 'PC 꺼짐·잠자기·예약 실패 의심 → 작업 스케줄러 ' + T1 + ' 결과 확인'; who.push('08:12 v1 일꾼이 안 왔어요'); }
            else if (nw.hm >= 840){ it.s = '✗'; it.t = '08:40 지나도 봉인 없음'; it.a = '일꾼이 중간에 멈췄을 수 있음 → 단순3안\\아침_로그.txt 확인'; who.push('08:12 v1 일꾼이 카드를 못 끝냈어요'); }
          } else if (it.id === 'tg' && nw.hm >= 840){
            it.s = '✗'; it.t = came ? '08:40 지나도 보낸 기록 확인 안 됨' : 'v1 일꾼이 안 와서 안 감';
            if (came) it.a = '단순3안\\보낸기록.jsonl · 폰 텔레그램 확인';
          } else if (it.id === 'x' && nw.hm >= 900 && !xt){
            it.s = '✗'; it.t = '09:00 지나도 소식 없음'; it.a = 'PC 꺼짐·예약 실패 의심 → 작업 스케줄러 ' + TX + ' · v2\\아침X_로그.txt 확인'; who.push('08:45 X 일꾼이 안 왔어요');
          } else if (it.id === 'exp' && nw.hm >= 900){
            if (xt && xt.k === '없음'){ it.s = '○'; it.t = '확인 안 함(X 없음 날)'; }
            else { it.s = '✗'; it.t = '09:00 지나도 확인 안 됨'; it.a = 'X 일꾼이 08:55 값을 확인함 · 08:20 수집기(천억_장전예상체결_0820)도 확인'; }
          }
        });
        if (who.length) out.lines.push('<b>⚠ 안 왔음</b> ' + E(who.join(' · ')) + ' <i>(지금 ' + nw.s + ' · 현황판 마지막 ' + last + ')</i>');
      } else if (kx < tk){   // 현황판 = 지난 카드 것 · 오늘 아침은 봉인·X 기록으로만 판단
        if (!s1){ out.lines.push('<b>⚠ 안 왔음</b> 오늘 ' + fdk(tk) + ' 08:12 v1 일꾼 소식 없음(오늘 봉인 없음 · 현황판 마지막 ' + last + ') → PC 꺼짐·잠자기·예약 실패 의심 · 작업 스케줄러 ' + E(T1) + ' 결과 확인'); out.extra++; }
        if (nw.hm >= 900 && !xt){ out.lines.push('<b>⚠ 안 왔음</b> 오늘 08:45 X 일꾼 소식 없음 → 작업 스케줄러 ' + E(TX) + ' · v2\\아침X_로그.txt 확인'); out.extra++; }
      } else {   // 현황판 = 다음 카드 준비(저녁 /매매일 뒤) · 오늘 아침은 봉인·X 기록으로만 판단
        if (!s1){ out.lines.push('<b>⚠ 오늘 ' + fdk(tk) + ' 아침 v1 카드 봉인 없음</b> <i>(일꾼이 안 왔거나 자료가 늦었음 → 단순3안\\아침_로그.txt)</i>'); out.extra++; }
        else if (!xt){ out.lines.push('<b>⚠ 오늘 ' + fdk(tk) + ' X 기록 없음</b> <i>(08:45 일꾼 · v2\\아침X_로그.txt)</i>'); out.extra++; }
      }
    }
    if (out.old) out.note = '아래는 지난 ' + fdk(kx) + ' 카드 기록(오늘 것 아님)' + (out.lines.length ? '' : want === tk ? ' · 오늘 카드 일꾼은 08:12 시작' : ' · ' + fdk(want) + ' 카드 일꾼은 그날 08:12 시작');
    else if (kx === tk && want !== tk) out.note = '오늘 아침 기록 · 다음 ' + fdk(want) + ' 카드 준비 상태는 /매매일 뒤 보임';
    return out;
  }
  function workHTML(){
    var w = DW(); if (!w || !w.D) return '';
    var kx = fkD(w.D), x = DX()[kx];
    var items = (w.items || []).map(function(it){ var c = {}; for (var p in it) c[p] = it[p]; return c; });
    if (x){   // X 자료가 현황보다 새것이면 X·예상체결 칸을 그것으로
      items.forEach(function(it){
        if (it.id === 'x'){ it.s = x.k === '없음' ? '○' : '✓'; it.t = x.k === '없음' ? 'X 없음 · ' + (x.why || '') + ' → v1 그대로' : (x.t || '') + ' 봉인' + (x.k === '정시' ? '' : ' (' + x.k + ')'); delete it.a; }
        if (it.id === 'exp'){
          if (x.ts){ it.s = '✓'; it.t = '08:55 값 ' + x.ts.slice(0, 2) + ':' + x.ts.slice(2, 4) + ':' + x.ts.slice(4, 6); }
          else if ((x.why || '').indexOf('예상체결') >= 0){ it.s = '✗'; it.t = x.why; }
        }
      });
    }
    var g = watchdog(w, items);   // ⏰ 시각 경보(항목을 ✗로 바꿀 수 있어 차례·문제를 세기 전에)
    var cls = function(s){ return s === '✓' ? 'ok' : s === '!' ? 'turn' : s === '✗' ? 'bad' : s === '○' ? 'none' : ''; };
    var turn = g.old ? [] : items.filter(function(it){ return it.s === '!'; }), bad = g.old ? [] : items.filter(function(it){ return it.s === '✗'; }), nBad = bad.length + g.extra;
    var h = '<div id="js3-work" class="js3-w' + (g.lines.length ? ' alarm' : '') + '"><span class="js3-wt">🌾 아침 일꾼</span> <span class="js3-sm" style="display:inline">' + fdk(kx) + ' 카드를 만드는 일꾼 · ' + E(String(w.만든때 || '').slice(5)) + ' 기준'
      + (turn.length ? ' · <b style="color:#ffb74d">사용자 차례 ' + turn.length + '</b>' : '') + (nBad ? ' · <b style="color:#ff6b6b">문제 ' + nBad + '</b>' : '')
      + (!turn.length && !nBad && !g.old ? ' · 이상 없음' : '') + ' · 지금 ' + g.now.s + ' 확인</span>'
      + '<button class="js3-wbtn" onclick="js3Refresh(true)" title="일꾼·X·카드 자료를 지금 새로 읽기">↻ 다시 보기</button>';
    g.lines.forEach(function(l){ h += '<div class="js3-walarm">' + l + '</div>'; });
    if (g.note) h += '<div class="js3-wnote">' + E(g.note) + '</div>';
    h += '<div class="js3-wrow' + (g.old ? ' old' : '') + '">' + items.map(function(it){ return '<span class="js3-wi ' + cls(it.s) + '"><b>' + E(it.s) + '</b>' + E(it.n) + '<i>' + E(it.t) + '</i></span>'; }).join('') + '</div>';
    if (turn.length) h += '<div class="js3-wturn">! 사용자 차례: ' + turn.map(function(it){ return E(it.a || it.t); }).join(' · ') + '</div>';
    bad.forEach(function(it){ if (it.a) h += '<div class="js3-wbad">✗ ' + E(it.n) + ': ' + E(it.a) + '</div>'; });
    var tk = w.tasks || {}, tl = [], nf = g.now.f;
    var mins = function(a, b){ return (new Date(b.replace(' ', 'T') + ':00') - new Date(a.replace(' ', 'T') + ':00')) / 60000; };
    [['v1', 'v1 08:12', 8], ['X', 'X 08:45', 15]].forEach(function(p){   // p[2] = 이만큼(분) 지나도 '다음' 그대로면 빨강
      var t = tk[p[0]]; if (!t) return;
      var late = !!t.다음 && mins(t.다음, nf) >= p[2];
      tl.push(E(p[1] + (t.상태 && t.상태 !== '대기' ? ' ' + t.상태 : '') + ' · 다음 ' + (t.다음 ? t.다음.slice(5) : '-'))
        + (late ? ' <span class="js3-wlate">(이 시각이 지났는데 현황판이 그 뒤로 안 바뀜)</span>' : '')
        + E(t.마지막 ? ' · 지난번 ' + t.마지막.slice(5) + ' ' + (t.결과 || '') : ''));
    });
    if (tl.length) h += '<div class="js3-sm">예약 작업: ' + tl.join(' / ') + '</div>';
    // 출석부(2026-10-10 Step 3 · 단순3안\일꾼_출석부.jsonl → JS3W '출석' 최근 60거래일) · 여기는 한 줄 요약만
    var ab = w.출석부, ar = w.출석 || [];
    if (ab){
      var NM = { v1: 'v1', x: 'X', exp: '예상체결', tg: '텔레그램' }, la = ar.length ? ar[ar.length - 1] : null;
      var nAbs = ar.filter(function(r){ return (r.결석 || []).length; }).length;
      h += '<div class="js3-sm">출석부: ' + (ab.줄
          ? E(ab.줄 + '일 기록') + (la ? ' · 마지막 ' + E(fdk(fkD(la.D))) + ' ' + ['v1', 'x', 'exp', 'tg'].map(function(id){ var c = (la.칸 || {})[id] || ['-']; return E(c[0] + NM[id]); }).join(' ') + (la.보충 ? ' <i>(나중 보충)</i>' : '') : '')
            + (nAbs ? ' · <b style="color:#ff6b6b">결석 있는 날 ' + nAbs + '일</b> (최근 ' + ar.length + '일)' : ' · 결석 없음 (최근 ' + ar.length + '일)')
          : '아직 기록 없음 · 첫 줄은 ' + E(fdk(fkD(ab.시작))) + ' 아침 일이 끝나면(08:56 무렵) 생김')
        + (ab.오류 ? ' · <b style="color:#ff6b6b">출석부 오류 ' + E(ab.오류) + '</b>' : '') + '</div>';
    }
    return h + '</div>';
  }
  function xKind(x){
    return x.k === '정시' ? '● ' + (x.t || '') + ' 봉인' : x.k === '조금늦음' ? '◐ ' + (x.t || '') + ' 봉인(조금 늦음)'
      : x.k === '늦은봉인' ? '◐ ' + (x.t || '') + ' 늦은 봉인(판정 제외)' : x.k === '시험' ? '시험 화면(봉인 아님)' : '○ X 없음';
  }
  function xHTML(k){
    var x = DX()[k]; if (!x) return '';
    var h = '<div class="js3-x"><div class="js3-xhd"><b>v2-X · 08:55 예상체결 보정</b> <span class="js3-kind xk">' + E(xKind(x)) + '</span>'
      + ' <span class="js3-sm" style="display:inline">위 v1 카드에 그날 아침 예상체결을 더한 판 · 미래 관찰(60거래일 뒤 판정) · 관찰용 · 매수 추천 아님</span></div>';
    if (x.k === '없음' || !x.c) return h + '<div class="js3-sm">X 없음: ' + E(x.why || '') + ' → 위 v1 카드 그대로</div></div>';
    h += '<div class="js3-xrow">' + x.c.map(function(it, i){
      var r = it.r, s = '<div class="js3-xcard"><span class="js3-xno">' + (i + 1) + '안</span> <b>' + E(it.s) + '</b><span class="js3-xp">아침 힘 ' + (it.p || 0) + '</span>';
      if (r) s += '<div style="margin-top:3px">' + chip(r.n, r.c, k, r.x != null ? ' <b style="color:' + col(r.x) + '">예상 ' + pc(r.x) + '</b>' : '')
        + (it.how === '예상체결' ? '' : ' <i style="color:#8487bd;font-style:normal;font-size:11px">(' + (it.how === 'v1그대로' ? 'v1 대표 · 예상 목록에 없음' : it.how === 'v1관련주' ? 'v1 관련주' : E(it.how)) + ')</i>') + '</div>';
      else s += '<div class="js3-sm">관망</div>';
      if (it.rel && it.rel.length) s += '<div class="js3-sm">관련 ' + it.rel.map(function(z){ return chip(z[0], z[1], k, z[2] != null ? ' <b style="color:' + col(z[2]) + '">' + pc(z[2]) + '</b>' : ''); }).join('') + '</div>';
      return s + '</div>';
    }).join('') + '</div>';
    var ch = [];
    if ((x.ev || []).indexOf('순서') >= 0) ch.push('아침 힘 2 이상 섹터를 앞으로');
    if (x.sw) ch.push('3안 교체 ' + E(x.sw[0]) + ' → <b>' + E(x.sw[1]) + '</b>');
    if ((x.ev || []).indexOf('대표') >= 0) ch.push('대표를 예상 등락 1등으로');
    h += '<div class="js3-sm" style="margin-top:4px">바뀐 것: ' + (ch.length ? ch.join(' · ') : 'v1과 같음')
      + (x.ts ? ' · 예상체결 ' + x.ts.slice(0, 2) + ':' + x.ts.slice(2, 4) + ':' + x.ts.slice(4, 6) + ' 기준' : '') + (x.nw ? ' · 그날 뉴스 종목 포함' : '')
      + ' · 예상 등락은 09:00 시가 전 값</div>';
    return h + '</div>';
  }
  // 🏅 관찰 후보5(2026-10-11) · 칸 = 그날 아침 · ● 08:40 봉인 > ○ 재현 · p = [이름, 코드, 5일 결과%, 상태(ok·cash·wait·unres), +20% 닿음, 전일 거래대금(억), 기계 순위]
  //   오늘 봉인은 build(다음 날 08:12) 전이라도 베스트52_관찰후보.js(window.BEST52_WATCH · 08:40 갱신 · 맨 위 띠 자료)로 바로 보임
  function b5Of(k){
    var e = DB()[k], w = window.BEST52_WATCH;
    if (w && w.kind === 'seal' && (w.status === 'ok' || w.status === '지각') && w.date && fkD(w.date) === k && (!e || e.k === '재현')){
      var old = e, ps = (w.picks || []).map(function(p){
        var o = null; ((old && old.p) || []).forEach(function(x){ if (x[1] === p.code) o = x; });
        return [p.name || (o && o[0]) || p.code, p.code, o ? o[2] : null, o ? o[3] : 'wait', o ? o[4] : null, o ? o[5] : null];
      });
      e = { k: w.official ? '봉인' : (w.status === '지각' ? '지각' : '비공식'), t: String(w.updated_at || '').slice(11, 16), m: w.machine, s: w.skill, n: w.skill_days, p: ps,
            why: w.machine ? '상위 5 안에 종목 유형 불명(빈자리)' : '후보를 낸 기계 중 실력이 0보다 큰 기계 없음' };
      if (old && old.p) e.rp = old.p.map(function(x){ return x[1]; });
    }
    return e || null;
  }
  function b5Kind(b){
    return b.k === '봉인' ? '● ' + (b.t || '08:40') + ' 장전 봉인' : b.k === '지각' ? '◐ ' + (b.t || '') + ' 봉인 지각(공식 제외)'
      : b.k === '비공식' ? '◐ ' + (b.t || '') + ' 봉인(비공식' + (b.why2 ? ' · ' + b.why2 : '') + ')' : '○ 재현(그날 아침 봉인 아님)';
  }
  function b5Res(x){
    if (x[3] === 'ok') return '<b style="color:' + col(x[2]) + '">5일 ' + pc(x[2]) + '</b>' + (x[4] ? ' <span title="5거래일 안에 +20% 닿음">🎯</span>' : '');
    if (x[3] === 'cash') return '<i>못 삼(시가 상한가·거래 없음 = 0)</i>';
    if (x[3] === 'unres') return '<i>결과 불명</i>';
    return '<i>결과 대기</i>';
  }
  function b5Cell(k){
    var b = b5Of(k); if (!b) return '';
    var ps = b.p || [], tt = '🏅 관찰 후보5 · ' + b5Kind(b) + (b.m ? ' · ' + b.m : '');
    if (!ps.length) return '<div class="js3-b5c none" title="' + E(tt + ' · 빈자리: ' + (b.why || '')) + '">🏅 빈자리</div>';
    tt += ' · ' + ps.map(function(x){ return x[0] + (x[3] === 'ok' ? ' ' + pc(x[2]) : ''); }).join(', ') + (b.v != null ? ' · 5칸 평균 ' + pc(b.v) : '');
    return '<div class="js3-b5c" title="' + E(tt) + '">🏅 ' + E(short(ps[0][0], 6)) + (ps.length > 1 ? ' 외' + (ps.length - 1) : '')
      + (b.v != null ? ' <b style="color:' + col(b.v) + '">' + pc(b.v) + '</b>' : '') + '</div>';
  }
  // 08:40 작업 상태·전진 채점·판정·근거 (2026-10-11 맨 위 띠를 여기로 합침 · 띠에만 있던 것) · 자료 = window.BEST52_WATCH
  function b5Status(){
    var w = window.BEST52_WATCH, fm = function(d){ d = String(d || ''); return d.length === 8 ? Number(d.slice(4, 6)) + '/' + Number(d.slice(6, 8)) : d; };
    var links = ' · 근거 <a href="_천억장부/베스트52검증/보고서/베스트52_기계성적표.html" target="_blank">기계 성적표</a> · <a href="_천억장부/베스트52검증/보고서/베스트52_공통선택시험.html" target="_blank">공통선택 시험</a>'
      + ' · <a href="_천억장부/베스트52검증/보고서/베스트52_베스트5방식시험.html" target="_blank">베스트5 방식 시험</a> · <a href="_천억장부/베스트52검증/전진규칙_v1.md" target="_blank">전진 규칙</a>';
    if (!w) return '<div class="js3-sm i js3-b5st">08:40 봉인 자료(베스트52_관찰후보.js) 없음' + links + '</div>';
    var ck = w.checked_day || w.date, cs = w.checked_status || w.status, t = [];
    var NM = { ok: '장전 봉인', '지각': '봉인 지각(08:50 뒤 · 공식 제외)', '휴장': '휴장', '자료미갱신': '가격자료 미갱신으로 봉인 없음', '봉인실패': '봉인 실패' };
    if (w.kind === 'dryrun') t.push(fm(w.date) + ' 시험 계산(봉인 아님)');
    else {
      var s = '08:40 작업 마지막 ' + fm(ck) + ' ' + (NM[cs] || cs || '-') + (cs === 'ok' && !w.official ? '(비공식)' : '');
      if (cs === '봉인실패' && ck && !isTrading(fkD(ck))) s += '(휴장일이라 놓친 봉인 없음)';
      if (cs === '휴장' && w.status === 'ok' && w.date) s += ' · 최근 봉인 ' + fm(w.date);
      t.push(s);
    }
    var f = w.forward || {}, j = w.judgements || {};
    t.push('전진 채점 ' + (f.graded_days || 0) + '/' + ((w.judge_at || [60])[0]) + '일(첫 공식 ' + fm(w.start_day) + ')');
    if (j['60']) t.push('60일 판정: ' + j['60']);
    if (j['120']) t.push('120일 판정: ' + j['120']);
    var nw = nowInfo(), warn = w.kind !== 'dryrun' && Number(ck || 0) < Number(nw.k.replace(/-/g, '')) && isTrading(nw.k) && nw.hm >= 850;
    return '<div class="js3-sm' + (warn ? '' : ' i') + ' js3-b5st">' + E(t.join(' · ')) + (warn ? ' <b style="color:#ff6b6b">⚠ 오늘 아침 08:40 작업 기록 없음(PC 꺼짐·예약 실패 의심 → 작업 스케줄러 천억_베스트52_전진봉인_0840)</b>' : '') + links + '</div>';
  }
  function b5HTML(k, e3){
    var b = b5Of(k), nm = MB().기계이름 || {}, isL = k === latest();
    var hd0 = ' <span class="js3-sm" style="display:inline">베스트52 전진 봉인 P1 · 검증 안 됨 · 그날 아침까지 성적이 가장 나은 🏅 베스트 기계 1개의 상위 5 · 관찰용 · 매수 추천 아님</span></div>';
    if (!b){   // 맨 앞(오늘) 카드 날인데 아직 08:40 봉인 전이면 상태 줄만
      if (!isL || !(Object.keys(DB()).length || window.BEST52_WATCH)) return '';
      return '<div class="js3-b5"><div class="js3-b5hd"><b>🏅 관찰 후보5</b> <span class="js3-kind b5k">평일 08:40 봉인 전</span>' + hd0
        + '<div class="js3-sm">' + E(fdk(k)) + ' 관찰 후보5는 그날 08:40 에 봉인되면 여기에 나옴(캘린더를 켜 두면 1분 안 · 아니면 새로고침)</div>' + b5Status() + '</div>';
    }
    var h = '<div class="js3-b5"><div class="js3-b5hd"><b>🏅 관찰 후보5</b> <span class="js3-kind b5k">' + E(b5Kind(b)) + '</span>' + hd0;
    if (b.m) h += '<div class="js3-sm">고른 기계 <b style="color:#f3dc8a">' + E(b.m) + '</b>' + (nm[b.m] && nm[b.m] !== b.m ? ' <i>' + E(short(String(nm[b.m]).replace(/^[^=·]*[=·]\s*/, ''), 70)) + '</i>' : '')
      + ' · 최근 120거래일 실력 ' + (b.s != null ? (b.s >= 0 ? '+' : '') + Number(b.s).toFixed(2) + '%p' : '-')
      + (b.n != null ? ' <i>(' + b.n + '일 비교 · 같은 날 시장대금5 대비 5거래일 결과 차이 평균)</i>' : '') + (b.na != null ? ' · 그날 후보 낸 기계 ' + b.na + '개' : '') + '</div>';
    if (b.top && b.top.length > 1) h += '<div class="js3-sm i">그날 실력 순위(후보 낸 기계 중 0 초과): ' + b.top.map(function(t, i){ return (i + 1) + '위 ' + E(t[0]) + ' ' + (t[1] >= 0 ? '+' : '') + Number(t[1]).toFixed(2); }).join(' · ') + '</div>';
    var ps = b.p || [];
    if (!ps.length) h += '<div class="js3-sm">빈자리: ' + E(b.why || '조건 맞는 기계 없음') + '</div>';
    else {
      var mine = {};   // 같은 날 3안 대표·관련주와 같은 종목
      ((e3 && e3.c) || []).forEach(function(it, i){ if (it.r && it.r.c) mine[it.r.c] = (i + 1) + '안 대표'; (it.rel || []).forEach(function(x){ if (x[1] && !mine[x[1]]) mine[x[1]] = (i + 1) + '안 관련주'; }); });
      h += '<div class="js3-b5row">' + ps.map(function(x, i){
        return '<span class="js3-b5p"><span class="js3-b5no">' + (i + 1) + '</span> ' + chip(x[0], x[1], k, '') + ' ' + b5Res(x)
          + (x[5] != null ? ' <i title="전 거래일 거래대금">어제 ' + Number(x[5]).toLocaleString() + '억</i>' : '')
          + (mine[x[1]] ? ' <span class="js3-ok">🌅 ' + E(mine[x[1]]) + '와 같음</span>' : '') + '</span>';
      }).join('') + (ps.length < 5 ? '<span class="js3-b5p" style="opacity:.6">' + (5 - ps.length) + '칸 빈자리(그 기계 자격 후보가 ' + ps.length + '개뿐)</span>' : '') + '</div>';
      h += '<div class="js3-sm">5칸 평균(빈칸·못 산 칸 = 0) ' + (b.v != null ? '<b style="color:' + col(b.v) + '">' + pc(b.v) + '</b>' : '<i>결과 대기</i>')
        + (b.b != null ? ' · 같은 날 시장대금5(어제 거래대금 상위 5) <b style="color:' + col(b.b) + '">' + pc(b.b) + '</b>' : '')
        + ' <i>(그날 시가 매수 → 5거래일 안 마지막 종가 · 비용 0.35%p)</i></div>';
    }
    if (b.sn) h += '<div class="js3-warn2">그날 08:40 봉인: ' + E(b.sn) + ' → 위는 재현(참고)</div>';
    if (b.rp && ps.length && b.rp.join() !== ps.map(function(x){ return x[1]; }).join()) h += '<div class="js3-warn2">같은 날 재현 명단과 다름(봉인 기준으로 보임)</div>';
    if (isL) h += b5Status();
    return h + '</div>';
  }
  function dayHTML(k, e){
    var h = '<div class="js3-tline"><b>' + fdk(k) + ' 아침 3안</b> <span class="js3-kind ' + (e.k === '재현' ? 're' : 'sl') + '">' + E(kindLabel(e)) + '</span>'
      + ' <span class="js3-sm" style="display:inline">자료 ' + E(e.P || '') + '까지 · 관찰용 · 매수 추천 아님</span></div>';
    h += '<div class="js3-row">' + (e.c || []).map(function(it, i){ return cardHTML(it, i, k); }).join('') + '</div>';
    h += xHTML(k);
    h += b5HTML(k, e);
    h += ansHTML(e);
    if (e.w && e.w.length) h += '<div class="js3-warn2">주의: ' + e.w.map(E).join(' / ') + '</div>';
    return h + watchHTML();
  }
  function todayBox(){
    var lk = latest();
    if (!lk) return '<div class="js3-today"><div class="js3-warn">자료 없음 · 단순3안\\달력.py replay 를 실행하세요</div></div>';
    var st = M().상태, h = '<div class="js3-today">';
    if (st && st.D && Number(st.D) > Number(lk.replace(/-/g, '')) && st.글) h += '<div class="js3-warn">' + E(st.글) + '</div>';
    var wh = workHTML(); S.wh = wh; h += wh;
    return h + dayHTML(lk, D()[lk]) + '</div>';
  }

  function footHTML(){
    var m = M(), c = m.확인구간 || {}, r = (m.재현성적 || {}).전체, ys = (m.재현성적 || {}).연도별 || {}, s = m.봉인성적, h = '<div class="js3-foot">';
    var pc2 = function(x){ return x == null ? '-' : (x >= 0 ? '+' : '') + Number(x).toFixed(2) + '%'; };
    h += '<b style="color:#b8bde6">이 방법(v1) 확인 구간(2025-01~2026-10-07)</b> 하루 3칸 중 정답 섹터 ' + (c.S != null ? c.S + '%' : '-') + ' (무작위 ' + (c.B0 != null ? c.B0 + '%' : '-') + ') · 대표가 실제 대장 ' + (c.L != null ? c.L + '%' : '-')
      + ' (같은 섹터 무작위 ' + (c.S4 != null ? c.S4 + '%' : '-') + ') · 대표를 시가에 사서 5일 보유 하루 ' + pc2(c.T)
      + (c.T3 != null ? ' (같은 기간 어제 거래대금 상위 3: ' + pc2(c.T3) + (c.T같은섹터무작위 != null ? ' · 같은 섹터 무작위: ' + pc2(c.T같은섹터무작위) : '') + ')' : '')
      + (c.출처 ? ' · <i style="color:#8487bd">' + E(c.출처) + '</i>' : '') + ' → 관찰용 · 매수 추천 아님<br>';
    if (r) h += '<b style="color:#b8bde6">재현(참고)</b> ' + r.날 + '일 · 섹터 적중 ' + r.S + '% · 하나라도 맞은 날 ' + r.하나라도 + '% · 대장 적중 ' + r.L + '% · 연도별 '
      + Object.keys(ys).map(function(y){ var v = ys[y]; return v ? y + ' ' + v.S + '%/' + v.L + '%' : ''; }).join(' · ') + ' (섹터/대장)<br>';
    h += '<b style="color:#b8bde6">봉인(그날 아침 만든 것)</b> ' + (m.봉인수 || 0) + '일' + (s ? ' · 채점 ' + s.날 + '일 · 섹터 ' + s.S + '% · 대장 ' + s.L + '%' : ' · 아직 채점 없음') + ' · 판정은 봉인 60거래일·대표 120건 뒤<br>';
    var mx = MX();
    if (mx.상태) h += '<b style="color:#9fd0ff">v2-X(08:55 예상체결 보정)</b> ' + E(mx.상태) + ' · 봉인 ' + (mx.봉인수 || 0) + '일' + (mx.없음수 ? ' · X 없음 ' + mx.없음수 + '일' : '') + ' · ' + E(mx.판정 || '') + '<br>';
    var mb = MB(), rs = mb.재현, bs = mb.봉인 || {}, s5 = mb.Step5 || {};
    if (rs) h += '<b style="color:#f3dc8a">🏅 관찰 후보5(베스트52 전진 봉인 P1 · 2026-10-11 맨 위 띠를 이 달력으로 합침)</b> 재현 ' + E(rs.처음 || '') + '~ · 고른 날 ' + rs.고른날 + '/' + rs.날 + '일 · 5칸 평균(5거래일) ' + pc2(rs.날평균) + ' (중앙 ' + pc2(rs.날중앙) + ')'
      + ' · 같은 날 시장대금5 ' + pc2(rs.시장대금5) + ' · 이긴 날 ' + (rs.이긴날 != null ? rs.이긴날 + '%' : '-') + ' · 종목 ' + rs.종목 + '개 중 오른 비율 ' + (rs.오른비율 != null ? rs.오른비율 + '%' : '-') + ' · +20% 닿음 ' + (rs.닿음20 != null ? rs.닿음20 + '%' : '-')
      + (s5.판정 ? ' · 개발 시험 판정 ' + E(s5.판정) : '') + ' · 08:40 봉인 ' + (bs.수 || 0) + '일(첫 공식 ' + fmd(bs.첫공식) + ' · 60·120거래일 뒤에만 판정) → 관찰용 · 매수 추천 아님<br>';
    (m.주의 || []).forEach(function(x){ h += '· ' + E(x) + '<br>'; });
    return h + '자료 ' + E(m.만든때 || '-') + ' 만듦 · 칸 ' + (m.칸수 || 0) + '개</div>';
  }

  function render(){
    css();
    var sec = ensure(), data = D(), y = S.y, m = S.m, m0 = M();
    var first = new Date(y, m, 1).getDay(), days = new Date(y, m + 1, 0).getDate();
    var h = '<div class="onepage-sec-head">🌅 주도섹터 3안 <span class="cal-desc" data-desc="js3" style="font-size:11px;font-weight:400;color:#8487bd">'
      + '<b style="color:#b8bde6">오늘</b> = 캘린더에 최근 20거래일 가장 자주 나온 섹터 3개 + 섹터마다 대장 가능성 1등 종목 + 관련주 2 · 평일 08:12 자동 봉인(텔레그램도) · 관찰용 · 매수 추천 아님</span>'
      + (typeof descBtnHTML === 'function' ? descBtnHTML('js3', '설명', 'margin-left:8px;font-size:11px;padding:3px 10px;vertical-align:middle;font-weight:600') : '') + '</div>';
    h += '<div id="js3-desc" style="display:' + (document.documentElement.classList.contains('desc-open-js3') ? '' : 'none') + ';font-size:12px;color:#c9cbe8;line-height:1.65;margin:4px 0 8px">'
      + '규칙: ' + E(m0.규칙 || '') + '<br>순서: 08:12 시작 → 전 거래일 캘린더(/매매일)·천프정 일봉이 들어올 때까지 08:33까지 기다림 → 카드 봉인(처음 만든 내용을 바꾸지 않음) → 이 달력 + 텔레그램 · 캘린더가 늦으면 지난 카드를 대신 보이지 않고 \'늦음\'만 알림'
      + '<br>채점: 그날 캘린더가 들어오면 다음 아침에 ✓(정답 섹터) · ★(실제 대장) · 대표 그날 등락을 붙임(정답 = 그날 +10% 종목 수와 새 돈으로 고른 1~3위 섹터 · 대장 = 정답 섹터의 +10%·거래대금 100억 이상 상위 2)'
      + '<br>🌾 아침 일꾼 경보: 거래일 08:20 이 지나도 08:12 일꾼 흔적(현황판 갱신·오늘 칸 봉인)이 없으면 빨간 ⚠ 안 왔음 · 08:40 = v1 봉인·텔레그램 마감 · 09:00 = X·예상체결 마감 · 캘린더를 켜 두면 거래일 08:05~09:40 1분마다 새로 읽음(↻ 다시 보기 = 지금 바로) · 주말·휴장일은 경보 없음'
      + '<br>출석부: 아침 일이 끝난 거래일마다 한 줄(일꾼 6칸 + 증거 · 단순3안\\일꾼_출석부.jsonl) · 고쳐 쓰지 않음 · 그때를 놓친 날은 다음 실행 때 보충 · 2026-10-12부터'
      + '<br>달력 칸 아래 v1·예(예상체결)·X·📨 = 그날 아침 출석(✓ 됨 · ✗ 안 됨 · ◐ 늦음·일부 · ○ X 없음) · 결석이 있으면 빨간 바탕 · 칸을 누르면 맨 위에 증거 상자(온 시각 · 봉인 시각·지문 · 예상체결 값 시각 · 텔레그램 보낸 시각 · 예약 결과)'
      + '<br>🏅 관찰 후보5 = 베스트52 전진 봉인 P1(2026-10-11 맨 위 띠를 이 달력으로 합침 · 오늘 카드 🏅 상자 끝 줄 = 08:40 작업 상태·전진 채점·판정·근거): 🏅 베스트 기계(시점등급 R 40개) 중 그날 후보가 있고 최근 120거래일 실력(같은 날 시장대금5 대비 5거래일 결과 차이 평균 · 40일 이상)이 0보다 큰 1등 기계의 상위 5(전 거래일 거래대금 5억 이상 보통주)'
      + ' · 칸 아래 🏅 줄 = 첫 종목 외 n · 5칸 평균(그날 시가 → 5거래일 종가 · 비용 0.35%p) · 날짜를 누르면 종목·기계·결과 · ● 08:40 봉인(10/12부터) · ○ 재현(같은 식으로 그날 전 거래일까지 자료만 써서 다시 계산 · 참고) · 개발 시험에서 탈락 · 관찰용 · 매수 추천 아님</div>';
    // HERMES3 2026-10-18 · 3안 날짜와 독립된 최근 저장본
    h += hLatestBox();
    h += todayBox();
    h += '<div class="cal-header" style="margin-top:14px"><div class="cal-nav">'
      + '<button class="nav-btn" onclick="js3Year(-1)" title="이전 해">&#8249;</button>'
      + '<div class="cal-title" style="min-width:120px;text-align:center">' + y + '년</div>'
      + '<button class="nav-btn" onclick="js3Year(1)" title="다음 해">&#8250;</button>'
      + '<span class="cal-badge-name" title="이 달력 = 맨 위 [🌅 주도3안] 버튼" onclick="js3Go()">🌅 주도3안</span></div>'
      + '<div class="cal-right"><button class="today-btn" onclick="js3Latest()">최신</button>'
      + '<div class="cal-desc" data-desc="js3" style="font-size:11.5px;color:#8487bd;margin-left:10px;line-height:1.55">● 봉인 = 그날 아침 만든 것 · ○ 재현 = 같은 규칙으로 다시 계산(참고) · <b style="color:#5effd6">초록</b> = 정답 섹터 · ★ = 실제 대장 · n/3 = 섹터 맞힘 · <span style="color:#e6c76a">🏅 = 관찰 후보5(베스트52 08:40 봉인 · 첫 종목 외 n · 5칸 평균 5거래일 결과)</span> · 칸 아래 v1·예·X·📨 = 그날 아침 출석(예 = 예상체결 · 누르면 증거)</div></div></div>';
    h += '<div class="month-strip">';
    for (var mi = 0; mi < 12; mi++){
      var pre = y + '-' + pad(mi + 1), nv = 0, ns = 0, sv = 0, nh = hKeys().filter(function(k){ return k.indexOf(pre) === 0; }).length; // HERMES3 2026-10-18
      Object.keys(data).forEach(function(k){ if (k.indexOf(pre) === 0){ nv++; if (data[k].S != null){ ns++; sv += data[k].S; } } });
      h += '<button class="ms-btn' + (mi === m ? ' active' : '') + ((nv || nh) && mi !== m ? ' has-data' : '') + '" onclick="js3GoMonth(' + mi + ')" title="' + (mi + 1) + '월 ' + (nv ? nv + '일' + (ns ? ' · 섹터 적중 ' + Math.round(100 * sv / ns) + '%' : '') : '3안 카드 없음') + (nh ? ' · 헤르메스 저장본 ' + nh + '일' : '') + '">' + (mi + 1) + '월</button>';
    }
    h += '</div><div style="display:grid;grid-template-columns:repeat(7,1fr);gap:4px">';
    WD.forEach(function(w, i){ h += '<div style="text-align:center;font-size:11px;color:' + (i === 0 ? '#ff6b81' : i === 6 ? '#6bb7ff' : '#8487bd') + '">' + w + '</div>'; });
    for (var i = 0; i < first; i++) h += '<div></div>';
    var nMon = 0, sMon = 0, cMon = 0, nAtt = 0, nAbs = 0;
    for (var d = 1; d <= days; d++){
      var k = key(y, m, d), e = data[k], ar = attOf(k), ap = !ar && attPending(k), he = DH()[k]; // HERMES3 2026-10-18
      var xb = (typeof window.js3CellBtn === 'function') ? window.js3CellBtn(k, d, new Date(y, m, d).getDay()) : '';   // 📅 토요일 · 📆 첫 일요일 결산 단추 = 채점_뷰.js(2026-10-11)
      if (ar){ nAtt++; if ((ar.결석 || []).length) nAbs++; }
      if (!e){   // 카드 칸이 없어도 출석 기록이 있거나 기록 전이면 눌러서 볼 수 있게
        h += (ar || ap || he) ? '<div class="js3-cell empty att' + (S.sel === k ? ' sel' : '') + '" data-date="' + k + '" onclick="js3Pick(\'' + k + '\')" title="' + E(fdk(k) + (he ? ' · 헤르메스 추천주 3개 · 과거재생(B)' : '') + (ar || ap ? ' · ' + attTitle(ar) : '')) + '"><div class="js3-cd">' + d + '</div>' + (ar ? attMarks(ar) : ap ? attWait() : '') + hCell(k) + xb + '</div>'
          : '<div class="js3-cell empty" data-date="' + k + '"><div class="js3-cd">' + d + '</div>' + xb + '</div>';
        continue;
      }
      nMon++; if (e.S != null){ cMon++; sMon += e.S; }
      h += '<div class="js3-cell ' + (e.k === '재현' ? 're' : 'sl') + (S.sel === k ? ' sel' : '') + '" data-date="' + k + '" onclick="js3Pick(\'' + k + '\')" title="' + E(fdk(k) + ' · ' + kindLabel(e) + (ar || ap ? ' · ' + attTitle(ar) : '')) + '">'
        + '<div class="js3-cd">' + d + ' ' + (e.k === '재현' ? '○' : '●') + (e.S != null ? ' <b>' + Math.round(e.S * 3) + '/3</b>' : '') + '</div>'
        + (e.c || []).map(function(it, j){
            var sc = it.hit === true ? 'color:#5effd6;font-weight:700' : it.hit === false ? 'color:#6f7690' : 'color:#dce8ff';
            return '<div class="js3-cl">' + NUM[j] + ' <span style="' + sc + '">' + E(short(it.s, 6)) + '</span>' + (it.r ? ' <span style="color:#c9cbe8">' + E(short(it.r.n, 6)) + (it.r.lead ? '★' : '') + '</span>' : '') + '</div>';
          }).join('') + b5Cell(k) + hCell(k) + (ar ? attMarks(ar) : ap ? attWait() : '') + xb + '</div>';
    }
    h += '</div><div class="js3-foot">이번 달 ' + nMon + '일' + (cMon ? ' · 섹터 적중 ' + Math.round(100 * sMon / cMon) + '% (' + cMon + '일 채점)' : '')
      + (nAtt ? ' · 출석 기록 ' + nAtt + '일' + (nAbs ? ' · <b style="color:#ff6b6b">결석 있는 날 ' + nAbs + '일</b>' : ' · 결석 없음') : '') + '</div>';
    h += footHTML();
    sec.innerHTML = h;
  }

  function modal(){
    var ov = document.getElementById('js3-modal');
    if (!ov){
      ov = document.createElement('div'); ov.id = 'js3-modal';
      ov.style.cssText = 'display:none;position:fixed;inset:0;background:rgba(0,0,0,.7);backdrop-filter:blur(3px);z-index:9990;align-items:center;justify-content:center;padding:24px';
      ov.innerHTML = '<div id="js3-modal-box" style="background:linear-gradient(180deg,rgba(30,22,10,.98),rgba(12,10,24,.98));border:1px solid rgba(255,183,77,.5);border-radius:16px;padding:18px 20px;max-width:1180px;width:100%;max-height:92vh;overflow:auto;color:#dce8ff;font-family:\'Noto Sans KR\',sans-serif"></div>';
      ov.onclick = function(ev){ if (ev.target === ov) ov.style.display = 'none'; };
      document.body.appendChild(ov);
      document.addEventListener('keydown', function(ev){ if (ev.key === 'Escape' && ov.style.display === 'flex' && !(document.getElementById('stock-modal-overlay') || {}).offsetParent) ov.style.display = 'none'; });
    }
    return ov;
  }
  function dayModal(k){
    var e = D()[k], ab = attBox(k); if (!e && !ab && !DH()[k]) return; // HERMES3 2026-10-18
    css();
    var ov = modal(), box = document.getElementById('js3-modal-box');
    box.innerHTML = '<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px"><div id="js3-mbody" style="flex:1">' + ab
      + (e ? dayHTML(k, e) : '<div class="js3-tline"><b>' + fdk(k) + '</b> <span class="js3-sm" style="display:inline">이 날 카드 칸은 달력 자료에 아직 없음(단순3안\\달력.py replay 뒤 생김)</span></div>') + hHTML(k, false) + '</div>'
      + '<button onclick="document.getElementById(\'js3-modal\').style.display=\'none\'" style="background:transparent;border:1px solid rgba(255,255,255,.2);color:#dce8ff;border-radius:8px;padding:4px 10px;cursor:pointer">✕</button></div>'
      + (e && e.fp ? '<div style="font-size:10.5px;color:#6a82a8;margin-top:8px">봉인 지문 ' + E(e.fp) + '</div>' : '');
    ov.style.display = 'flex';
  }

  function init(){ if (!S.y){ var l = latest(), t = l ? new Date(l + 'T00:00:00') : new Date(); S.y = t.getFullYear(); S.m = t.getMonth(); S.sel = l; } }
  window.js3Go = function(){
    init(); render();
    var sec = document.getElementById('sec-js3'); if (sec) sec.scrollIntoView({behavior: 'smooth', block: 'start'});
    document.querySelectorAll('.h-nav-btn, .vt-btn').forEach(function(b){ b.classList.toggle('active', b.textContent.indexOf('주도3안') >= 0); });
  };
  window.js3Year = function(dy){ init(); S.y += dy; render(); };
  window.js3GoMonth = function(mi){ init(); S.m = mi; render(); };
  window.js3Latest = function(){ S.y = 0; init(); render(); };
  window.js3Pick = function(k){ if (!D()[k] && !attOf(k) && !attPending(k) && !DH()[k]) return; S.sel = k; render(); dayModal(k); };
  // HERMES3 2026-10-18 · 기존 js3Latest의 3안 최신 정책은 바꾸지 않음
  window.js3HermesLatest = function(){
    var k = hLatest(); if (!k) return;
    var t = new Date(k + 'T00:00:00'); S.y = t.getFullYear(); S.m = t.getMonth(); S.sel = k; render(); dayModal(k);
  };
  window.js3Stock = function(el, k){
    if (typeof window._openStock === 'function' && el.getAttribute('data-code')) window._openStock(el, function(){ window.js3Pick(k); });
  };
  function loadData(id, file, what){
    if (!ME || document.getElementById(id)) return;
    var s = document.createElement('script'); s.id = id;
    s.src = ME.slice(0, ME.lastIndexOf('/') + 1) + 'data/' + encodeURIComponent(file) + '?t=' + Date.now();
    s.onload = function(){ try { render(); } catch (err){ console.warn('🌅 ' + what + ' 화면 오류', err); } };
    s.onerror = function(){ console.warn('🌅 ' + file + ' 없음(' + what + ' 아직 없음)'); };
    document.head.appendChild(s);
  }
  function loadX(){
    // HERMES3 2026-10-18
    loadData('js3h-data', '주도섹터3안_헤르메스3.js', '헤르메스 추천주 3개');
    loadData('js3x-data', '주도섹터3안_X.js', 'v2-X');
    loadData('js3w-data', '주도섹터3안_일꾼.js', '🌾 아침 일꾼');
    loadData('js3b5-data', '주도섹터3안_관찰5.js', '🏅 관찰 후보5');
    loadData('js3b52-data', '베스트52_관찰후보.js', '🏅 오늘 08:40 봉인');
  }
  // ↻ 새로 읽기(2026-10-10 Step 2) · 일꾼·X 자료는 작아서 1분마다 · 카드 자료(주도섹터3안.js 368KB)는 일꾼·X 자료가 바뀌었거나 손으로 누를 때만
  function reloadData(id, file, done){
    if (!ME){ if (done) done(); return; }
    var o = document.getElementById(id); if (o && o.parentNode) o.parentNode.removeChild(o);
    var s = document.createElement('script'); s.id = id;
    s.src = ME.slice(0, ME.lastIndexOf('/') + 1) + 'data/' + encodeURIComponent(file) + '?t=' + Date.now();
    s.onload = s.onerror = function(){ if (done) done(); };
    document.head.appendChild(s);
  }
  function paintWork(){   // 🌾 줄만 다시 그림(바뀐 경우만 · 달력 나머지는 그대로)
    var el = document.getElementById('js3-work'); if (!el) return;
    var h = workHTML(); if (h && h !== S.wh){ S.wh = h; el.outerHTML = h; }
  }
  window.js3Refresh = function(all){
    if (S.busy && Date.now() - (S.busyAt || 0) < 20000) return;   // 읽는 중이면 건너뜀(20초 넘게 안 끝나면 다시 읽음)
    S.busy = true; S.busyAt = Date.now();
    var pw = (DW() || {}).만든때, px = MX().만든때, pb = (window.BEST52_WATCH || {}).updated_at, ph = MH().updated_at, n = 4; // HERMES3 2026-10-18
    var fin = function(){
      if (--n) return;
      var changed = !!all || (DW() || {}).만든때 !== pw || MX().만든때 !== px || (window.BEST52_WATCH || {}).updated_at !== pb || MH().updated_at !== ph;   // 🏅 08:40 봉인이 오면 다시 그림
      var end = function(){ S.busy = false; try { if (changed) render(); else paintWork(); } catch (err){ console.warn('🌅 다시 보기 오류', err); } };
      if (changed) reloadData('js3d-data', '주도섹터3안.js', function(){ if (all) reloadData('js3b5-data', '주도섹터3안_관찰5.js', end); else end(); }); else end();
    };
    reloadData('js3h-data', '주도섹터3안_헤르메스3.js', fin); // HERMES3 2026-10-18
    reloadData('js3w-data', '주도섹터3안_일꾼.js', fin);
    reloadData('js3x-data', '주도섹터3안_X.js', fin);
    reloadData('js3b52-data', '베스트52_관찰후보.js', fin);
  };
  // HERMES3 2026-10-18 · 장전 이외에도 저장본 updated_at만 1분마다 확인(모델 호출 없음)
  function refreshHermes(){
    if (S.hbusy && Date.now() - (S.hbusyAt || 0) < 20000) return;
    S.hbusy = true; S.hbusyAt = Date.now(); var before = MH().updated_at;
    reloadData('js3h-data', '주도섹터3안_헤르메스3.js', function(){
      S.hbusy = false; try { if (MH().updated_at !== before) render(); else paintWork(); } catch (err){ console.warn('헤르메스 화면 오류', err); }
    });
  }
  function tick(){
    if (document.hidden || !document.getElementById('sec-js3')) return;
    var nw = nowInfo();
    if (isTrading(nw.k) && nw.hm >= 805 && nw.hm <= 940) window.js3Refresh(false); else refreshHermes();
  }
  function boot(){
    try { init(); render(); loadX(); } catch (err){ console.warn('🌅 주도3안 화면 오류', err); }
    setInterval(function(){ try { tick(); } catch (err){ console.warn('🌅 1분 확인 오류', err); } }, 60000);
    document.addEventListener('visibilitychange', function(){ if (!document.hidden) try { tick(); } catch (err){} });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else setTimeout(boot, 0);
})();
