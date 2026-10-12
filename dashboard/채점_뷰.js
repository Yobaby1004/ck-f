// 📝 채점 달력 (2026-10-07 사용자 "채점이라는 버튼 하나 만들고 거기에 연결된 달력도 만들어") · 맨 위 📺 유튜브 오른쪽 버튼 · setView('grade')
//   한마디로 = 🏅 베스트 달력에 걸린 매매법 전부(1위패턴 · 어사이드1~51 · 2060매매법1~8)의 명단을 '같은 자'로 채점해 날짜마다 보여 준다(천억 장부 0단계와 같은 자)
//   같은 자 = 아침 명단은 칸날짜 시가 · 그날 종가 신호는 칸날짜 종가에 산다 → +20% 익절 / −10% 손절 / 20거래일 종가 · 비용 0.35%p · 수정주가
//            20거래일이 안 지난 줄 = 지금까지(닿았으면 끝 · 아니면 마지막 종가 평가 = ⏳ 진행 중)
//   기준선 = 같은 날 시장(전 종목 같은 비중) · 대금10(전날 거래대금 위 10종목)을 같은 자로 · 🔒 = 장 시작 전에 봉인한 전진 장부 줄(진짜 시험)
//   자료 = dashboard/data/채점_요약.js(처음에) + dashboard/data/채점_월/YYYY-MM.js(그 달을 열 때만) · 빌더 = 주도주\_천억장부\장부_달력.py(천억_장부_전진_0850 · 평일 08:50·21:30)
//   🧠 추천주5 묶음(2026-10-07 Step 8) = dashboard/data/채점_추천주5.js(빌더 = 주도주\_천억장부\추천주5두뇌\알림판.py · 예약 천억_추천주5두뇌_봉인 평일 08:05·08:40)
//            = 🧠 패널 + 칸 🧠 줄 + 날짜 창 🧠 표 · 🔒 08:50 전 마지막 봉인 = 공식 · 표시 없음 = 과거 재생(연습)
//   머리(2026-10-07 사용자 "유튜브·채점 달력도 버튼순서와 달력순서 일치") = 다른 달력과 같은 cal-header(‹ 해 › + 📝 채점 이름표 | 최신 + 📖 설명) → 🧠·판정·들어간 것·달 성적 → 1~12월 → 달력
//   자리 = 늘 페이지 맨 아래(📺 유튜브 바로 아래 · keepLast) · 되돌리기 = 아래 Step 8 줄(1단계 직전 10/7 판은 y5A5 백업이 같은 이름으로 덮어써 남아 있지 않음)
//   🪨 1단계(2026-10-08 사용자 '1단계 진행' · 강화학습 영상 '몬테주마 = 보상이 멀면 AI 는 가만히 있기를 배운다' 반영) = 🧠 칸에 보기 전용 4가지
//            ① 🪨 두뇌 상태 계기판(최근 60거래일 · 상위5 적중 ÷ 무작위 · 얌전한 종목 비중 · 자리) ② 📈 학습 곡선(누르면 · 그림 3줄 + 해마다 표)
//            ③ 🔒 봉인 진행 막대(20·40거래일 중간 보고 · 60거래일 판정 예상 날짜) ④ 0단계 '표본 부족' 막대(거래 n/100 · 날 n/30) + 날짜 창 '고른 5의 자리' 한 줄
//            자료 = 채점_추천주5.js 날짜 줄 q·ew + META.계기판(기준 · 값 보기 전에 정함) = 알림판.py v1.1 · 두뇌 고르기·학습·채점 규칙 0 변경 · 오늘의 5 이름이 코드뿐이면 brName 으로
//   🧵 2단계(2026-10-08 사용자 '2단계 마무리' · 영상 '알파고의 크레딧' = 승리의 몫을 첫 수까지 거슬러 나눔) = 보기 전용 2가지
//            ① 날짜 창 🧵 황금 실 = 놓친 종목(후보 안 주간 정답5 · 시장 전체 주간 상위 5)마다 그날 아침~20거래일 전 어느 버튼이 짚었나(가까운 날 · 처음 짚은 날)
//               자료 = dashboard/data/채점_황금실.js(약 380KB · 날짜 창을 처음 열 때만 받음) · 빌더 = 알림판.py v1.2(gold_threads)
//            ② 🧠 칸 [🧵 황금 실 표] = 보물이 처음 보인 때(2023~24 · 2025~ · 최근 60거래일 · 🔒 봉인) + 버튼별 짚는 정도·함정·주간 평균(중앙)·크레딧(META.황금실 · 과거 = 황금실_분석.py)
//            되돌리기 = 채점_뷰_2단계전백업.js(2단계 붙이기 직전 = y5A5 '자료가 멈춘 달력' 수정 뒤 판) · 채점_뷰_직전백업.js = y5A5 수정 직전 판(그대로 둠)
//   📅 달력판 v4(2026-10-08 사용자 '진행' = 달력판 5종목과 성적을 지금 두뇌 옆에) = 보기 전용 4곳
//            🧠 칸 오늘의 5 아래 '📅 달력판 오늘의 5' · 🧠 칸 끝 '📅 달력판 봉인 누적' · 달력 칸 🧠 줄 아래 📅 줄 · 날짜 창 🧠 표 바로 아래 📅 표
//            자료 = 채점_추천주5.js 의 V4(알림판.py v1.3 · 전진\봉인_v4.jsonl · 성적_v4.json 읽기만) · 첫 봉인 2026-10-12
//   📓 Step 4 두뇌 일지(2026-10-08 사용자 '진행') = 🧠 칸 오늘의 5 아래 '📓 두뇌 일지' = 두 두뇌가 매일 아침 한 줄씩(어제 배운 것 = 판단 기준 변화 상위 3 · 맞힌·놓친 종목)
//            + [📓 지난 일지 보기] · 자료 = 채점_추천주5.js 의 '일지'(알림판 v1.4 · 두뇌일지.py · 전진\두뇌일지.json)
//   🪜 사다리판 v5(2026-10-08 사용자 '진행' = 실전 준비) = 달력판과 같은 4곳(오늘의 5 · 봉인 누적 · 칸 줄 · 날짜 창 표) + 일지 한 줄 · 노란색 · 첫 봉인 2026-11-02(그 전엔 '예정')
//            자료 = 채점_추천주5.js 의 V5(알림판 v1.5) · 공통 그리기 = XB 목록(xLine · xDayHTML · xTodayHTML · xSumHTML)
//   📊 Step 8 측정판 성적표(2026-10-08 사용자 '진행') = 🧠 칸 맨 아래 한 줄(결론 · 가장 가까운 보고 · 마지막 텔레그램) + [📊 표 보기] = 시험 중 목록 7개 × 똑똑함 측정판 6지표
//            자료 = 채점_추천주5.js 의 '보고'(알림판 v1.6 · 성적보고.py → 전진\성적보고.json · 칸 글자는 성적보고.py 가 만들고 여기선 그리기만)
//   되돌리기 = 채점_뷰_최근전백업.js(Step 8 전) · 채점_뷰_2단계전백업.js(1단계 뒤 · 2단계 전 = 남은 가장 오래된 판) · 중간 판 백업은 2026-10-08 정리함
//   관찰용 · 매수추천 아님
(function () {
  'use strict';
  var W = window;
  if (W.__gradeInstalled) return;
  W.__gradeInstalled = true;

  var G = {y: 0, m: 0, per: 'month', sort: 'cal', dir: 1, all: false, sel: null, ord: 'cal', list: false, curve: false, gold: false};   // sort/ord 'cal' = 맨 위 버튼 순서(🌅 주도3안 → 📉 월간눌림 → 🎯 첫터치5 → 🏅 베스트 → 🏹 2060 → 🗣 검사관 → 📺 유튜브 · 묶음 순서) · 2026-10-07 사용자 "달력 순서와 버튼순서와 맞게"
  // 채점에 들어간 달력 묶음 = 맨 위 버튼 순서대로(🌅 주도3안 → 📉 월간눌림 → 🎯 첫터치5 → 🏅 베스트 → 🏹 2060 → 🗣 검사관 → 📺 유튜브 · 📉🎯🗣📺 = 2026-10-11 장부_버튼더하기.py) · 묶음 안은 그 달력의 묶음 순서(🏅 1위패턴 → 🅰 어사이드1 → … → ㊀ 어사이드51 / 🏹1 → 🏹8) = 자료의 매매법 번호 순서
  var GRPS = [{k: '주도3안', name: '🌅 주도3안', color: '#ffb74d', bg: 'rgba(255,183,77,.08)', tip: '맨 위 🌅 주도3안 버튼 달력(2026-10-11 추가) · ① 1~3안 대표 → ② 관련주 → X① v2-X 대표 → X② v2-X 관련주 → 🏅 관찰 후보5(베스트52 P1) · 그날 아침 명단 = 그날 시가 · 🔒 = 그날 아침 자체 봉인 · 표시 없음 = 재현(같은 규칙으로 다시 계산)'},
    {k: '월간눌림', name: '📉 월간눌림', color: '#ff9e7a', bg: 'rgba(255,158,122,.07)', tip: '맨 위 📉 월간눌림 버튼 달력(2026-10-11 추가) · 📉월 월간 분류 → 📉급 급등 분류 · 그날 종가로 깊은 눌림(-35~-55%)에 처음 들어온 종목(달력 칸 🆕) → 다음 거래일 시가 · 재현(그날 자료로 다시 계산) · 깊은 눌림에 머무는 날(매일 같은 종목)은 안 셈'},
    {k: '첫터치5', name: '🎯 첫터치5', color: '#ff6b81', bg: 'rgba(255,107,129,.07)', tip: '맨 위 🎯 첫터치5 버튼 달력(2026-10-11 추가) · 🎯20 → 🎯60 → 🎯120 → 🎯240 → 🎯480 · 전날 종가로 그 선에 처음 닿은 종목 = 그날 칸 → 그날 시가 · 재현'},
    {k: '베스트', name: '🏅 베스트', color: '#ffd700', bg: 'rgba(255,215,0,.07)', tip: '맨 위 🏅 베스트 버튼 달력 · 1위패턴 → 🅰 어사이드1 → … → ㊀ 어사이드51(8·9 는 종가 타점·8시 명단 따로)'},
              {k: '2060', name: '🏹 2060', color: '#ff9f5a', bg: 'rgba(255,159,90,.08)', tip: '맨 위 🏹 2060 버튼 달력 · 2060매매법1 → … → 2060매매법8'},
    {k: '검사관', name: '🗣 검사관', color: '#9fd0ff', bg: 'rgba(159,208,255,.07)', tip: '맨 위 🗣 검사관 버튼 달력(2026-10-11 추가 · 2026-08-04~) · 🗣최종5 → 검사관마다(주도·순환·뉴스·일정·학습·수급·차트·눌림·신고·시간외·반등) · 그날 아침 토론 → 그날 시가 · 🔒 = 실전 토론(09:00 전 기록) · 표시 없음 = 소급(나중에 다시 만든 기록)'},
    {k: '유튜브', name: '📺 유튜브', color: '#ff5c5c', bg: 'rgba(255,92,92,.07)', tip: '맨 위 📺 유튜브 버튼 달력(2026-10-11 추가 · 2025-12~) · 영상이 말한 종목 → 올린 뒤 첫 시가(09:00 전에 올리면 그날 · 아니면 다음 거래일) · 같은 날 같은 종목 = 1줄 · 자체 = 채널 수·영상 수'}];
  var VCOL = {'통과 후보': '#22c55e', '관찰': '#fde047', '탈락': '#ff6b6b', '표본 부족': '#8a8fb0'};
  var STN = {T: '+20% 닿음(끝)', S: '−10% 손절(끝)', E: '20거래일 만기(끝)', H: '진행 중(지금 평가)', P: '예정(아직 봉 없음)', X: '가격 없음(거래정지·자료 끊김)'};
  var MIN_N = {month: 10, year: 30, all: 100, seal: 1};

  function E(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return {'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]; }); }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function META() { return W.채점_META || null; }
  function DAYS() { return W.채점_DAY || {}; }
  function STAT() { return W.채점_STAT || {}; }
  function MON(ym) { return (W.채점_MON || {})[ym]; }

  // ── 🧠 추천주5강화학습두뇌(2026-10-07 Step 8) = 모든 버튼·뉴스·일봉으로 매일 5종목 · 자료 dashboard/data/채점_추천주5.js(처음 열 때 받음)
  //    빌더 = 주도주\_천억장부\추천주5두뇌\알림판.py(예약 천억_추천주5두뇌_봉인 · 평일 08:05·08:40) · 연습 = 2022-06~10/7 과거 재생(봉인 아님) · 🔒 = 장 전 봉인
  function BR() { return W.채점_추천주5 || null; }
  var BR_LOAD = null, BR_MISS = false;
  var BR_ST = ['', '못 삼', '대기', '거래 없음', '청산 불가', '가격 의심', '일봉 없음', '없음'];
  function loadBrain(cb) {
    if (BR() || BR_MISS) { if (cb) cb(); return; }
    if (BR_LOAD) { if (cb) BR_LOAD.push(cb); return; }
    BR_LOAD = cb ? [cb] : [];
    var s = document.createElement('script');
    s.src = 'dashboard/data/채점_추천주5.js?v=' + Date.now();
    var done = function () { var L = BR_LOAD || []; BR_LOAD = null; L.forEach(function (f) { try { f(); } catch (e) { console.warn('🧠 추천주5', e); } }); };
    s.onload = done; s.onerror = function () { BR_MISS = true; done(); };
    document.head.appendChild(s);
  }
  function brName(c) { var B = BR(); return (B && B.N && B.N[c]) || c; }
  // ── 📅 달력판 v4 · 🪜 사다리판 v5(2026-10-08 · 도전자 나란히 보기) = 지금 두뇌 옆에 같은 모양으로 · 자료 = B.V4 · B.V5(알림판 v1.5 · 봉인·성적 읽기만)
  //    v4 = 2026-10-12~ 평일 08:05·08:40 봉인 · v5 = 2026-11-02~(Step 5 도전자 규칙 = 한 달 1개) · 그 전엔 '첫 봉인 예정'
  var V4C = '#5eead4';
  var XB = [{k: 'V4', icon: '📅', name: '달력판(v4)', short: '달력판', color: '#5eead4', rgb: '45,212,191', chip: '#0f2826', ink: '#e6fffb', desc: '같은 캘린더 5년치 · 그날 장전뉴스·유튜브는 다음 날부터'},
            {k: 'V5', icon: '🪜', name: '사다리판(v5)', short: '사다리판', color: '#fbbf24', rgb: '251,191,36', chip: '#2a2108', ink: '#fff7e0', desc: '달력판 + 크게 오른 종목에 큰 상(보상 사다리)'}];
  function XD(s) { var B = BR(); return (B && B[s.k]) || null; }
  function V4() { return XD(XB[0]); }
  function v4Same(k, c) { var B = BR(), r = B && (B.D || {})[k]; return !!(r && (r.p || []).some(function (x) { return x[0] === c; })); }
  function xLine(k, s) {
    var V = XD(s); if (!V) return ''; var r = (V.D || {})[k]; if (!r) return '';
    var bt = 'font-size:10.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis';
    if (r.k === 'N') return '<div title="' + E(s.short) + ' = 장 전 봉인했지만 자격 후보 0" style="' + bt + ';color:' + s.color + '">' + s.icon + '🔒 고르지 못함</div>';
    var nm = (r.p || []).map(function (x) { return brName(x[0]) + (v4Same(k, x[0]) ? '' : '*'); });
    var tip = s.icon + ' ' + s.name + ' ' + (r.k === 'L' ? '늦은 봉인(성적 밖)' : '장 전 봉인(공식)') + ' · ' + nm.join(', ') + ' (* = 지금 두뇌와 다른 종목) · 주간 ' + (r.dw == null ? '대기' : r.dw + '%') + ' · 1일 ' + (r.d1 == null ? '대기' : r.d1 + '%') + ' · 누르면 두뇌들 나란히';
    var wait = '<span style="color:#ffc454">⏳</span>';
    return '<div title="' + E(tip) + '" style="' + bt + ';color:' + s.color + '">' + s.icon + (r.k === 'L' ? '⚠' : '🔒') + ' 주 ' + (r.dw == null ? wait : pct(r.dw, 1)) + ' · 일 ' + (r.d1 == null ? wait : pct(r.d1, 1)) + '</div>';
  }
  function xDayHTML(k, s) {
    var V = XD(s); if (!V) return ''; var r = (V.D || {})[k]; if (!r) return '';
    var ff = r.ff || {};
    var head = r.k === 'L' ? '<span style="color:#ffc454">⚠ 늦은 봉인 ' + E(r.t || '') + '(성적 밖)</span>' : '<span>🔒 장 전 봉인 ' + E(r.t || '') + '</span>';
    var h = '<div style="margin:10px 0 2px;padding:8px 10px;border-radius:9px;background:rgba(' + s.rgb + ',.07);border:1px solid rgba(' + s.rgb + ',.38)">'
      + '<div style="font-size:13px;font-weight:700;color:' + s.color + '">' + s.icon + ' ' + s.name + ' ' + head + ' <span style="font-size:11px;font-weight:400;color:#8487bd">= ' + E(s.desc) + ' · 전날 장전뉴스 ' + (ff['전날_장전뉴스'] ? '✅ ' + (ff['전날_장전뉴스_종목수'] || 0) + '종목' : '❌') + (r.n ? ' · 자격 ' + r.n[1] : '') + '</span></div>';
    if (r.k === 'N') return h + '<div style="font-size:12px;color:#c9cbe8;margin-top:4px">이 날은 고르지 못함 = 자격 후보 0</div></div>';
    h += '<div style="font-size:12px;color:#c9cbe8;margin:4px 0">하루 값 = 주간 ' + (r.dw == null ? '⏳ 대기' : pct(r.dw, 2)) + ' · 1일 ' + (r.d1 == null ? '⏳ 대기' : pct(r.d1, 2))
      + (r.same != null ? ' · <span style="color:#8487bd">지금 두뇌와 같은 종목 ' + r.same + '/' + (r.p || []).length + '</span>' : '') + (r.hw != null ? ' · 후보 안 주간 정답5 적중 ' + r.hw + '개' : '') + '</div>';
    var th = 'padding:4px 8px;border-bottom:1px solid rgba(' + s.rgb + ',.35);color:#8487bd;text-align:left;white-space:nowrap', td = 'padding:4px 8px;border-bottom:1px solid #1e2a44;vertical-align:top;white-space:nowrap';
    h += '<div style="overflow-x:auto"><table style="border-collapse:collapse;font-size:12px;width:100%;margin-top:4px"><tr>' + ['#', '종목', '1일', '주간', s.short + '이 본 이유(위 3)'].map(function (t) { return '<th style="' + th + '">' + t + '</th>'; }).join('') + '</tr>';
    (r.p || []).forEach(function (x, i) {
      var c = x[0], n = brName(c), same = v4Same(k, c);
      var cell = function (v, st) { return (v == null ? (st === 2 ? '<span style="color:#ffc454">⏳</span>' : '—') : pct(v, 1)) + (st && st !== 2 ? ' <span style="color:#8487bd;font-size:10.5px">' + BR_ST[st] + '</span>' : ''); };
      h += '<tr><td style="' + td + '">' + (i + 1) + '</td><td style="' + td + '"><span onclick="gradeStock(this,\'' + k + '\')" data-code="' + E(c) + '" data-name="' + E(n) + '" data-rate="0" data-amount="0" data-meta="' + s.icon + ' ' + E(s.short) + ' ' + E(k) + '" style="cursor:pointer;color:' + s.ink + ';font-weight:700">' + E(n) + '</span> <span style="color:#6f72a8">' + E(c) + '</span>'
        + (same ? ' <span title="지금 두뇌(🧠)도 고른 종목" style="color:#8487bd;font-size:10.5px">🧠같음</span>' : ' <span title="지금 두뇌(🧠)는 안 고른 종목" style="color:' + s.color + ';font-size:10.5px">' + E(s.short) + '만</span>') + '</td>'
        + '<td style="' + td + '">' + cell(x[1], x[3]) + '</td><td style="' + td + '">' + cell(x[2], x[4]) + '</td><td style="' + td + ';white-space:normal;color:#b8bde6">' + E(((r.y || {})[c] || []).join(' · ')) + '</td></tr>';
    });
    return h + '</table></div></div>';
  }
  function xTodayHTML(s) {
    var V = XD(s); if (!V) return '';
    var T = V['오늘'], M = V.META || {};
    if (!T) return '<div style="font-size:12px;color:#c9cbe8;margin-top:6px"><b style="color:' + s.color + '">' + s.icon + ' ' + s.name + '</b> = ' + E(M['첫봉인'] || '') + ' 08:05·08:40 첫 봉인 예정 · <span style="color:#8487bd">' + E(M['규칙'] || '') + ' · 지금 두뇌와 나란히 매일 고름</span></div>';
    var f = T.fresh || {}, okb = function (v) { return (v === true || v === 0 || v === 1) ? '✅' : '❌'; };
    var h = '<div style="font-size:12.5px;color:#dce8ff;margin-top:8px"><b style="color:' + s.color + '">' + s.icon + ' ' + s.name + ' ' + E(T.day) + ' 오늘의 5</b> ' + (T.late ? '<span style="color:#ffc454">⚠ 늦은 봉인 ' + E(T.sealed_at) + '(성적 밖)</span>' : '🔒 ' + E(T.sealed_at) + ' 봉인')
      + ' · <span style="color:#8487bd">자료 전날 장전뉴스 ' + okb(f['전날_장전뉴스']) + (f['전날_장전뉴스_종목수'] ? '(' + f['전날_장전뉴스_종목수'] + '종목)' : '') + ' · 월간 칸 ' + okb(f['월간칸_전날']) + ' · 베스트·2060 ' + (f['베스트2060_기록있음'] || 0) + '/' + (f['베스트2060_전체'] || 0)
      + (T.n ? ' · 자격 ' + T.n[1] : '') + (T.same != null ? ' · 지금 두뇌와 같은 종목 ' + T.same + '/' + (T.picks || []).length : '') + '</span></div>';
    var P = T.picks || [], v1 = T.v1 || [];
    if (!P.length) return h + '<div style="font-size:12px;color:#ffb4b4;margin-top:3px">' + E(s.short) + '은 오늘 고르지 못함 = 자격 후보 0</div>';
    return h + '<div style="margin-top:4px">' + P.map(function (x, i) {
      var same = v1.indexOf(x[0]) >= 0;
      return '<span onclick="gradeStock(this,\'' + E(T.day) + '\')" data-code="' + E(x[0]) + '" data-name="' + E(brNm(x)) + '" data-rate="0" data-amount="0" data-meta="' + s.icon + ' ' + E(s.short) + ' ' + E(T.day) + '" title="' + E((same ? '🧠 지금 두뇌도 고름 · ' : s.short + '만 고름 · ') + ((T.why || {})[x[0]] || []).join(' · ')) + '" style="display:inline-block;background:' + s.chip + ';border:1px solid rgba(' + s.rgb + ',.6);color:' + s.ink + ';border-radius:9px;padding:2px 9px;margin:2px;cursor:pointer;font-size:12.5px"><b style="color:' + s.color + '">' + (i + 1) + '</b> ' + E(brNm(x)) + (same ? '' : ' <span style="color:' + s.color + ';font-size:10.5px">★' + E(s.short) + '만</span>') + '</span>';
    }).join('') + '</div>';
  }
  function xSumHTML(s) {
    var V = XD(s); if (!V) return '';
    var S = V['성적'] || {}, M = V.META || {}, mk = s.k === 'V5' ? 'main5' : 'main4', mm = S[mk] || {}, bl = S.baselines || {}, n = S['채점일'] || 0;
    return '<div style="font-size:11.5px;color:#8487bd;margin-top:4px;line-height:1.7"><b style="color:' + s.color + '">' + s.icon + ' ' + E(s.short) + ' 봉인 누적</b> = 공식 ' + (S['공식_봉인일'] || 0) + '일 · 주간 채점 ' + n + '일'
      + (n ? ' 평균 ' + pct(mm.mean, 2) + ' · 중앙 ' + pct(mm.median, 2) + ' (같은 날 지금 두뇌 ' + pct(bl.v1_main, 2) + (bl.v4_main != null ? ' · 달력판 ' + pct(bl.v4_main, 2) : '') + ' · 시장 대금10 ' + pct(bl.B3, 2) + ')' + (S['얌전_비중'] != null ? ' · 얌전 ' + Math.round(S['얌전_비중'] * 100) + '%' : '') : '')
      + ' · 입력 완성도 ' + (S['입력_완성도4'] == null ? '—' : Math.round(S['입력_완성도4'] * 100) + '%') + ' · ' + E(S['판정'] || ('표본 부족(0/' + (M['판정일수'] || 60) + '일)')) + ' · 첫 봉인 ' + E(M['첫봉인'] || '') + ' · 판정 ' + E(M['판정일'] || '') + ' 무렵(60거래일) · 관찰용 · 매수추천 아님</div>';
  }
  function v4Line(k) { return XB.map(function (s) { return xLine(k, s); }).join(''); }
  function v4DayHTML(k) { return XB.map(function (s) { return xDayHTML(k, s); }).join(''); }
  function v4TodayHTML() { return XB.map(function (s) { return xTodayHTML(s); }).join(''); }
  function v4SumHTML() { return XB.map(function (s) { return xSumHTML(s); }).join(''); }
  // ── 📓 두뇌 일지(2026-10-08 Step 4) = 두뇌마다 매일 아침 한 줄 · 자료 = B['일지'](알림판 v1.4~ · 전진\두뇌일지.json)
  function journalHTML() {
    var B = BR(); if (!B) return '';
    var J = B['일지'] || {}, L = [['v1', '🧠', '지금 두뇌', '#c4b5fd', '다음 봉인부터'], ['v4', '📅', '달력판', V4C, '2026-10-12 첫 봉인부터'], ['v5', '🪜', '사다리판', '#fbbf24', '2026-11-02 첫 봉인부터']];
    var md = function (s) { return E(String(s || '').slice(5).replace('-', '/')); };
    var line = function (e, icon, name, color) {
      return '<div style="font-size:11.8px;color:#c9cbe8;margin-top:3px;line-height:1.6"><b style="color:' + color + '">' + icon + ' ' + name + ' ' + md(e.day) + '</b> <span style="color:#8487bd">(' + md(e.from) + ' 뒤 · ' + (e.late ? '늦은 봉인' : '봉인 ' + E(e.sealed_at || '')) + ')</span> ' + E(e.text || '') + '</div>';
    };
    var h = '<div style="margin-top:8px;padding:7px 10px;border-radius:9px;background:rgba(255,255,255,.03);border:1px dashed rgba(167,139,250,.35)">'
      + '<div style="font-size:12.5px;font-weight:700;color:#e9d5ff">📓 두뇌 일지 <span style="font-size:11px;font-weight:400;color:#8487bd">= 매일 아침 두뇌마다 남기는 한 줄 · 배운 것 = 판단 기준이 가장 크게 바뀐 3개(↑ 그 쪽을 더 높게 봄 · ↓ 덜 높게 봄 · 괄호 = 바뀐 크기) · 새로 익은 정답 = 오늘 배운 날의 고른 5 성적 · 후보 안 정답5 맞힘 · 놓친 1위</span>'
      + ' <button onclick="gradeJournal()" style="margin-left:6px;background:#1c1838;border:1px solid rgba(167,139,250,.45);color:#dce8ff;border-radius:8px;padding:1px 9px;cursor:pointer;font-size:11px">' + (G.journal ? '📓 접기' : '📓 지난 일지 보기') + '</button></div>';
    L.forEach(function (z) {
      var a = J[z[0]] || [];
      h += a.length ? line(a[0], z[1], z[2], z[3]) : '<div style="font-size:11.8px;color:#8487bd;margin-top:3px">' + z[1] + ' ' + z[2] + ' = ' + z[4] + ' 일지가 쌓임</div>';
    });
    if (G.journal) {
      var rows = [];
      L.forEach(function (z) { (J[z[0]] || []).slice(1, 11).forEach(function (e) { rows.push([e.day, line(e, z[1], z[2], z[3])]); }); });
      rows.sort(function (x, y) { return x[0] < y[0] ? 1 : -1; });
      h += rows.length ? '<div style="margin-top:4px;border-top:1px solid #2a2850;padding-top:3px">' + rows.map(function (x) { return x[1]; }).join('') + '</div>' : '<div style="font-size:11.5px;color:#8487bd;margin-top:4px">지난 일지 없음(오늘이 첫 줄)</div>';
    }
    return h + '</div>';
  }
  // ── 📊 측정판 성적표(2026-10-08 Step 8) = 시험 중 목록 7개를 똑똑함 측정판 6지표로 나란히 · 자료 = B['보고'](알림판 v1.6 · 성적보고.py) · 기본 = 한 줄 · [📊 표 보기] = 표
  function reportHTML() {
    var B = BR(); if (!B) return '';
    var P = B['보고'];
    if (!P) return '<div style="font-size:11.5px;color:#8487bd;margin-top:6px">📊 측정판 성적표 = 아직 없음(평일 아침 봉인 뒤 성적보고.py 가 만듦)</div>';
    var last = P['마지막_보냄'];
    var h = '<div style="margin-top:8px;padding:7px 10px;border-radius:9px;background:rgba(255,209,102,.05);border:1px solid rgba(255,209,102,.35)">'
      + '<div style="font-size:12.5px;font-weight:700;color:#ffd166">📊 측정판 성적표 <span style="font-size:11px;font-weight:400;color:#8487bd">= 시험 중 목록 ' + E(P['목록수']) + '개를 똑똑함 측정판 6지표로 나란히(' + E(P['만든때']) + ') · 20·40번째 봉인 = 중간 보고(숫자만) · 60·120거래일 = 결론 · 보고날 텔레그램 자동 · 관찰용 · 매수추천 아님</span>'
      + ' <button onclick="gradeReport()" style="margin-left:6px;background:#2a2108;border:1px solid rgba(255,209,102,.45);color:#fff7e0;border-radius:8px;padding:1px 9px;cursor:pointer;font-size:11px">' + (G.report ? '📊 접기' : '📊 표 보기') + '</button></div>'
      + '<div style="font-size:11.8px;color:#dce8ff;margin-top:3px;line-height:1.6">결론 = <b style="color:#ffd166">' + E(P['결론'] || '') + '</b> · 가장 가까운 보고 = ' + E(P['다음_보고'] || '없음')
      + (last ? ' · 마지막 텔레그램 ' + E(last['때'] || '') + ' ' + E(last['결과'] || '') : '') + '</div>';
    if (G.report) {
      var th = 'padding:4px 7px;border-bottom:1px solid rgba(255,209,102,.35);color:#8487bd;text-align:left;white-space:nowrap;font-weight:600', td = 'padding:4px 7px;border-bottom:1px solid #1e2a44;vertical-align:top;color:#dce8ff';
      h += '<div style="overflow-x:auto;margin-top:5px"><table style="border-collapse:collapse;font-size:11.8px;width:100%"><tr>' + (P['칸이름'] || []).map(function (c) { return '<th style="' + th + '">' + E(c) + '</th>'; }).join('') + '</tr>'
        + (P['목록'] || []).map(function (m) { return '<tr>' + (m['칸'] || []).map(function (c, i) { return '<td style="' + td + (i === 0 ? ';white-space:nowrap;font-weight:700' : '') + '">' + E(c) + '</td>'; }).join('') + '</tr>'; }).join('')
        + '</table></div><div style="font-size:11px;color:#8487bd;margin-top:4px;line-height:1.6">' + E(P['설명'] || '') + '</div>';
    }
    return h + '</div>';
  }
  function brainLine(k) {
    var B = BR(); if (!B) return '';
    var r = (B.D || {})[k]; if (!r) return '';
    var bt = 'border-top:1px dashed rgba(167,139,250,.35);margin-top:2px;padding-top:1px;font-size:10.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis';
    if (r.k === 'N') return '<div title="장 전 봉인했지만 자격 후보 0 = 자료 미완(천프정 전날 봉 없음 등)" style="' + bt + ';color:#a78bfa">🧠🔒 고르지 못함</div>';
    var nm = (r.p || []).map(function (x) { return brName(x[0]); });
    var tip = '🧠 추천주5 ' + (r.k === 'R' ? '연습(과거 재생 · 봉인 아님)' : (r.k === 'L' ? '늦은 봉인(성적 밖)' : '장 전 봉인(공식)')) + ' · ' + nm.join(', ')
      + ' · 주간 ' + (r.dw == null ? '대기' : r.dw + '%') + ' · 1일 ' + (r.d1 == null ? '대기' : r.d1 + '%') + ((r.bw || [])[0] != null ? ' · 후보 평균(주간) ' + r.bw[0] + '%' : '') + ' · 누르면 5종목·이유·놓친 종목';
    var wait = '<span style="color:#ffc454">⏳</span>';
    return '<div title="' + E(tip) + '" style="' + bt + ';color:#c4b5fd">🧠' + (r.k === 'R' ? '' : (r.k === 'L' ? '⚠' : '🔒')) + ' 주 ' + (r.dw == null ? wait : pct(r.dw, 1)) + ' · 일 ' + (r.d1 == null ? wait : pct(r.d1, 1)) + '</div>';
  }
  function brainDayHTML(k) {
    var B = BR(); if (!B) return '';
    var r = (B.D || {})[k]; if (!r) return '';
    var head = r.k === 'R' ? '<span style="color:#8f86c9">연습(과거 재생 · 봉인 아님)</span>' : (r.k === 'L' ? '<span style="color:#ffc454">⚠ 늦은 봉인 ' + E(r.t || '') + '(성적 밖)</span>' : '<span>🔒 장 전 봉인 ' + E(r.t || '') + '</span>');
    var h = '<div style="margin:12px 0 4px;padding:10px 12px;border-radius:10px;background:rgba(167,139,250,.08);border:1px solid rgba(167,139,250,.35)">'
      + '<div style="font-size:13.5px;font-weight:700;color:#c4b5fd">🧠 추천주5 ' + head + (r.n ? ' <span style="font-size:11px;font-weight:400;color:#8487bd">후보 ' + r.n[0] + ' · 자격 ' + r.n[1] + '</span>' : '') + '</div>';
    if (r.k === 'N') return h + '<div style="font-size:12px;color:#c9cbe8;margin-top:4px">이 날은 고르지 못함 = 자격 후보 0(자료 미완 · 천프정 전날 봉 ' + (((r.ff || {})['천프정_전날봉']) ? '✅' : '❌') + ')</div></div>';
    var bw = r.bw || [], b1 = r.b1 || [];
    h += '<div style="font-size:12px;color:#c9cbe8;margin:4px 0">하루 값(5칸 같은 비중 · 비용 뺸 뒤) = 주간 ' + (r.dw == null ? '⏳ 대기' : pct(r.dw, 2)) + ' · 1일 ' + (r.d1 == null ? '⏳ 대기' : pct(r.d1, 2))
      + ' &nbsp;|&nbsp; <span style="color:#8487bd">자격 후보 평균 주간 ' + pct(bw[0], 2) + ' · 1일 ' + pct(b1[0], 2) + ' · 시장 대금10 주간 ' + pct(bw[1], 2) + ' · 1일 ' + pct(b1[1], 2) + '</span>'
      + (r.hw != null ? ' · 후보 안 주간 정답5 적중 ' + r.hw + '개' : '') + '</div>';
    if (r.q) h += '<div title="그날 자격 후보 안 백분위(50 = 가운데) · 얌전 = 20일 변동성 하위 절반 · 무작위 기대 = 자격 후보에서 같은 수를 무작위로 고를 때 · 🪨 1단계 계기판 자료" style="font-size:11.5px;color:#8487bd;margin:2px 0 4px">🪨 고른 5의 자리 = 얌전한 종목 <b style="color:#dce8ff">' + r.q[1] + '/' + r.q[0] + '</b> · 변동성 ' + (r.q[2] == null ? '—' : r.q[2]) + ' · 주가 ' + (r.q[3] == null ? '—' : r.q[3]) + ' · 거래대금 ' + (r.q[4] == null ? '—' : r.q[4]) + (r.ew != null ? ' · 상위5 적중 무작위 기대 ' + Number(r.ew).toFixed(2) + '개' + (r.hw != null ? ' / 실제 ' + r.hw + '개' : '') : '') + '</div>';
    var th = 'padding:4px 8px;border-bottom:1px solid #3a3460;color:#8487bd;text-align:left;white-space:nowrap', td = 'padding:4px 8px;border-bottom:1px solid #1e2a44;vertical-align:top;white-space:nowrap';
    h += '<div style="overflow-x:auto"><table style="border-collapse:collapse;font-size:12px;width:100%;margin-top:4px"><tr>' + ['#', '종목', '1일', '주간', '두뇌가 본 이유(위 3)'].map(function (t) { return '<th style="' + th + '">' + t + '</th>'; }).join('') + '</tr>';
    (r.p || []).forEach(function (x, i) {
      var c = x[0], n = brName(c);
      var cell = function (v, st) { return (v == null ? (st === 2 ? '<span style="color:#ffc454">⏳</span>' : '—') : pct(v, 1)) + (st && st !== 2 ? ' <span style="color:#8487bd;font-size:10.5px">' + BR_ST[st] + '</span>' : ''); };
      h += '<tr><td style="' + td + '">' + (i + 1) + '</td><td style="' + td + '"><span onclick="gradeStock(this,\'' + k + '\')" data-code="' + E(c) + '" data-name="' + E(n) + '" data-rate="0" data-amount="0" data-meta="🧠 추천주5 ' + E(k) + '" style="cursor:pointer;color:#efeaff;font-weight:700">' + E(n) + '</span> <span style="color:#6f72a8">' + E(c) + '</span></td>'
        + '<td style="' + td + '">' + cell(x[1], x[3]) + '</td><td style="' + td + '">' + cell(x[2], x[4]) + '</td><td style="' + td + ';white-space:normal;color:#b8bde6">' + E(((r.y || {})[c] || []).join(' · ')) + '</td></tr>';
    });
    h += '</table></div>';
    h += v4DayHTML(k);   // 📅 달력판(v4) 같은 날 5종목 = 지금 두뇌 표 바로 아래(나란히)
    if ((r.pw || []).length) h += '<div style="font-size:11.5px;color:#8487bd;margin-top:6px">후보 안 주간 정답 5(놓친 종목) = ' + r.pw.map(function (x) { return E(brName(x[0])) + ' ' + pct(x[1], 1); }).join(' · ') + '</div>';
    if ((r.mw || []).length) h += '<div style="font-size:11.5px;color:#8487bd;margin-top:2px">시장 전체 주간 상위 5 = ' + r.mw.map(function (x) { return E(brName(x[0])) + ' ' + pct(x[1], 1) + (x[2] ? '' : '<span title="그날 후보에 없었음" style="color:#6f72a8">(후보 밖)</span>'); }).join(' · ') + '</div>';
    h += goldDayHTML(k, r);   // 🧵 2단계 황금 실(놓친 종목마다 며칠 전 · 어느 버튼)
    if (r.g) h += '<div style="font-size:11px;color:#6f72a8;margin-top:4px">그림자① 큰 손실 거르개 ' + E((r.g.guard || []).map(function (c) { return brName(c); }).join(', ')) + ' · 그림자② 조합 특징 ' + E((r.g['int'] || []).map(function (c) { return brName(c); }).join(', ')) + ' · 관찰 대박5(사지 않음) ' + E((r.g.tail || []).map(function (c) { return brName(c); }).join(', ')) + '</div>';
    return h + '<div style="font-size:10.5px;color:#6a82a8;margin-top:6px;line-height:1.6">그날 시가 매수 → 1일 = 그날 종가 · 주간 = 5거래일째 종가(달력 7일 안) · 비용 0.35%p · 못 삼·거래 없음 = 현금 0 · 청산 불가 = 참고 평가 · ⏳ = 아직 봉 없음 · 이유 = 두뇌 점수에 크게 보탠 특징(높음/낮음 = 그날 후보 안 위치) · 관찰용 · 매수추천 아님</div></div>';
  }
  function brainModal(k) {
    var ov = modal(), box = document.getElementById('grade-modal-box');
    box.innerHTML = '<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px"><div style="font-size:18px;font-weight:800;color:#fff">📝 ' + E(k) + ' · 🧠 추천주5</div>'
      + '<button onclick="document.getElementById(\'grade-modal\').style.display=\'none\'" style="background:transparent;border:1px solid rgba(255,255,255,.2);color:#dce8ff;border-radius:8px;padding:4px 10px;cursor:pointer">✕</button></div>' + brainDayHTML(k);
    ov.style.display = 'flex'; box.scrollTop = 0;
  }
  // ── 🪨 1단계(2026-10-08) = 강화학습 영상(몬테주마: 보물이 멀고 드물면 AI 는 안 죽는 구석에 '가만히 있기'를 배운다)을 🧠 칸에 보기 전용으로
  //    자료 = 날짜 줄 q = [고른 수, 얌전 수(그날 자격 후보 안 20일 변동성 하위 절반), 변동성·주가·거래대금 평균 백분위×100] · ew = 무작위 기대 적중
  //    기준 = META.계기판(값을 보기 전에 정함 · 기본 창 60 · 적중 배수 0.5 미만 · 얌전 60% 넘음) · 사후 진단 · 매수신호 아님
  function brNm(x) { return (x[1] && x[1] !== x[0]) ? x[1] : brName(x[0]); }   // 봉인 이름이 코드뿐이면(예: 000640) 이름표 N
  function gaugeDef() {
    var B = BR(), g = (B && B.META && B.META['계기판']) || {};
    return {win: g['창'] || 60, hit: g['적중배수_기준'] || 0.5, calm: g['얌전_기준'] || 0.6};
  }
  var GA_MEMO = null;
  function gaugeData() {
    var B = BR(); if (!B) return null;
    var D = B.D || {}, keys = Object.keys(D).sort(), def = gaugeDef(), sig = keys.length + '|' + ((B.META || {})['만든때'] || '');
    if (GA_MEMO && GA_MEMO.sig === sig) return GA_MEMO;
    var S = [];
    keys.forEach(function (k) {
      var r = D[k];
      if ((r.k === 'R' || r.k === 'S') && (r.p || []).length) S.push({k: k, s: r.k === 'S', dw: num(r.dw), b0: num((r.bw || [])[0]), b1: num((r.bw || [])[1]), hw: num(r.hw), ew: num(r.ew), q: r.q || null});
    });
    var win = def.win, need = Math.min(win, 20), roll = [];
    var qa = [], qk = 0, qc = 0, ha = [], hh = 0, he = 0, wa = [], wd = 0, w0 = 0, w1 = 0;
    S.forEach(function (x) {
      var o;
      if (x.q && x.q[0]) { qa.push(x); qk += x.q[0]; qc += x.q[1]; if (qa.length > win) { o = qa.shift(); qk -= o.q[0]; qc -= o.q[1]; } }
      if (x.hw != null && x.ew != null && x.ew > 0) { ha.push(x); hh += x.hw; he += x.ew; if (ha.length > win) { o = ha.shift(); hh -= o.hw; he -= o.ew; } }
      if (x.dw != null && x.b0 != null && x.b1 != null) { wa.push(x); wd += x.dw; w0 += x.b0; w1 += x.b1; if (wa.length > win) { o = wa.shift(); wd -= o.dw; w0 -= o.b0; w1 -= o.b1; } }
      var wn = wa.length;
      roll.push({k: x.k, s: x.s, calm: qa.length >= need && qk ? qc / qk : null, hit: ha.length >= need && he > 0 ? hh / he : null,
                 dw: wn >= need ? wd / wn : null, b0: wn >= need ? w0 / wn : null, b1: wn >= need ? w1 / wn : null});
    });
    var last = roll.length ? roll[roll.length - 1] : {}, pv = [0, 0, 0], pn = [0, 0, 0], nSeal = 0;
    qa.forEach(function (x) { if (x.s) nSeal++; for (var j = 0; j < 3; j++) if (x.q[2 + j] != null) { pv[j] += x.q[2 + j] * x.q[0]; pn[j] += x.q[0]; } });
    var cur = {hit: last.hit == null ? null : last.hit, calm: last.calm == null ? null : last.calm, nSeal: nSeal, nWin: qa.length,
               pos: pv.map(function (v, j) { return pn[j] ? Math.round(v / pn[j]) : null; })};
    var lowHit = cur.hit != null && cur.hit < def.hit, calmHi = cur.calm != null && cur.calm > def.calm;
    var st = (cur.hit == null && cur.calm == null) ? '자료 부족' : (lowHit && calmHi ? '가만히 있기' : (lowHit || calmHi ? '주의' : '보통'));
    var Y = {}, order = [];   // 해마다(연습) + 🔒 봉인은 따로
    S.forEach(function (x) {
      var y = x.s ? '🔒 봉인' : x.k.slice(0, 4), a = Y[y];
      if (!a) { a = Y[y] = {n: 0, k: 0, c: 0, pv: [0, 0, 0], pn: [0, 0, 0], h: 0, e: 0, hn: 0, d: 0, b0: 0, b1: 0, wn: 0}; order.push(y); }
      a.n++;
      if (x.q && x.q[0]) { a.k += x.q[0]; a.c += x.q[1]; for (var j = 0; j < 3; j++) if (x.q[2 + j] != null) { a.pv[j] += x.q[2 + j] * x.q[0]; a.pn[j] += x.q[0]; } }
      if (x.hw != null && x.ew != null && x.ew > 0) { a.h += x.hw; a.e += x.ew; a.hn++; }
      if (x.dw != null && x.b0 != null && x.b1 != null) { a.d += x.dw; a.b0 += x.b0; a.b1 += x.b1; a.wn++; }
    });
    GA_MEMO = {sig: sig, def: def, roll: roll, cur: cur, st: st, Y: Y, order: order};
    return GA_MEMO;
  }
  function curveSVG(rows, lines, refs, yfmt, clamp) {   // 선 그림 1장(가로 = 날 순서 · 해 눈금 · 보라 칸 = 🔒 봉인 · 점선 = 기준선)
    var Wd = 1000, Ht = 116, L = 52, Rm = 8, T = 8, Bm = 18, n = rows.length;
    if (n < 2) return '';
    var lo = Infinity, hi = -Infinity;
    lines.forEach(function (ln) { rows.forEach(function (r) { var v = r[ln.f]; if (v != null) { if (v < lo) lo = v; if (v > hi) hi = v; } }); });
    if (lo === Infinity) return '<div style="font-size:11px;color:#6f72a8">자료 부족</div>';
    refs.forEach(function (rf) { if (rf.v < lo) lo = rf.v; if (rf.v > hi) hi = rf.v; });
    if (!(hi > lo)) hi = lo + 1;
    var padv = (hi - lo) * 0.08; lo -= padv; hi += padv;
    if (clamp && clamp.lo != null && lo < clamp.lo) lo = clamp.lo;   // 배수·비중은 0 밑·100% 위가 없다
    if (clamp && clamp.hi != null && hi > clamp.hi) hi = clamp.hi;
    var X = function (i) { return L + i * (Wd - L - Rm) / (n - 1); }, Yv = function (v) { return T + (hi - v) * (Ht - T - Bm) / (hi - lo); };
    var s = '<svg viewBox="0 0 ' + Wd + ' ' + Ht + '" style="width:100%;height:auto;display:block;background:rgba(255,255,255,.015);border-radius:6px" xmlns="http://www.w3.org/2000/svg">';
    var si = -1, i;
    for (i = 0; i < n; i++) if (rows[i].s) { si = i; break; }
    if (si >= 0) s += '<rect x="' + X(si).toFixed(1) + '" y="' + T + '" width="' + Math.max(3, Wd - Rm - X(si)).toFixed(1) + '" height="' + (Ht - T - Bm) + '" fill="rgba(167,139,250,.28)"><title>🔒 봉인(장 시작 전 · 진짜 시험) ' + E(rows[si].k) + '~</title></rect>';
    var ly = '';
    rows.forEach(function (r, j) {
      var y = r.k.slice(0, 4); if (y === ly) return; ly = y;
      if (j) s += '<line x1="' + X(j).toFixed(1) + '" y1="' + T + '" x2="' + X(j).toFixed(1) + '" y2="' + (Ht - Bm) + '" stroke="#2a2f52" stroke-width="1"/>';
      s += '<text x="' + (X(j) + 4).toFixed(1) + '" y="' + (Ht - 5) + '" fill="#6f72a8" font-size="11">' + y + '</text>';
    });
    refs.forEach(function (rf) {
      var yy = Yv(rf.v);
      s += '<line x1="' + L + '" y1="' + yy.toFixed(1) + '" x2="' + (Wd - Rm) + '" y2="' + yy.toFixed(1) + '" stroke="' + rf.c + '" stroke-width="1" stroke-dasharray="5 4"/>'
        + '<text x="' + (L + 6) + '" y="' + (yy - 3).toFixed(1) + '" fill="' + rf.c + '" font-size="10.5">' + E(rf.t) + '</text>';
    });
    s += '<text x="' + (L - 6) + '" y="' + (T + 9) + '" fill="#6f72a8" font-size="10.5" text-anchor="end">' + E(yfmt(hi)) + '</text>'
      + '<text x="' + (L - 6) + '" y="' + (Ht - Bm) + '" fill="#6f72a8" font-size="10.5" text-anchor="end">' + E(yfmt(lo)) + '</text>';
    lines.forEach(function (ln) {
      var d = '', pen = false;
      rows.forEach(function (r, j) { var v = r[ln.f]; if (v == null) { pen = false; return; } d += (pen ? 'L' : 'M') + X(j).toFixed(1) + ' ' + Yv(v).toFixed(1); pen = true; });
      if (d) s += '<path d="' + d + '" fill="none" stroke="' + ln.c + '" stroke-width="' + (ln.w || 1.5) + '" stroke-linejoin="round"/>';
    });
    return s + '</svg>';
  }
  function yearTableHTML(g) {
    var th = 'padding:3px 7px;border-bottom:1px solid #3a3460;color:#8487bd;text-align:right;white-space:nowrap', td = 'padding:3px 7px;border-bottom:1px solid #1e2a44;text-align:right;white-space:nowrap';
    var f2 = function (v, d) { return v == null || v !== v ? '—' : v.toFixed(d); };
    var r2v = function (v) { var x = Math.round(v * 100) / 100; return x === 0 ? 0 : x; };   // -0.00% 안 보이게
    var h = '<div style="overflow-x:auto;margin-top:9px"><table style="border-collapse:collapse;font-size:11.5px;color:#e4e6ff;min-width:760px"><tr>'
      + ['해', '고른 날', '상위5 적중(하루)', '무작위 기대(하루)', '적중 배수', '얌전 비중', '자리 변동성·주가·대금', '두뇌 주간', '자격 후보 평균', '시장 대금10'].map(function (t, j) { return '<th style="' + th + (j === 0 ? ';text-align:left' : '') + '">' + t + '</th>'; }).join('') + '</tr>';
    g.order.forEach(function (y) {
      var a = g.Y[y], ratio = a.e > 0 ? a.h / a.e : null, calm = a.k ? a.c / a.k : null;
      var pos = a.pn.map(function (n, j) { return n ? Math.round(a.pv[j] / n) : '—'; }).join(' · ');
      h += '<tr><td style="' + td + ';text-align:left;color:' + (y.indexOf('🔒') === 0 ? '#c4b5fd' : '#dce8ff') + '">' + E(y) + '</td><td style="' + td + '">' + a.n + '</td>'
        + '<td style="' + td + '">' + (a.hn ? f2(a.h / a.hn, 3) : '⏳') + '</td><td style="' + td + '">' + (a.hn ? f2(a.e / a.hn, 3) : '⏳') + '</td>'
        + '<td style="' + td + ';color:' + (ratio != null && ratio < g.def.hit ? '#ff9f5a' : '#dce8ff') + '">' + (ratio == null ? '⏳' : f2(ratio, 2) + '배') + '</td>'
        + '<td style="' + td + ';color:' + (calm != null && calm > g.def.calm ? '#ff9f5a' : '#dce8ff') + '">' + (calm == null ? '—' : Math.round(calm * 100) + '%') + '</td>'
        + '<td style="' + td + ';color:#b8bde6">' + pos + '</td>'
        + '<td style="' + td + '">' + (a.wn ? pct(r2v(a.d / a.wn), 2) : '⏳') + '</td><td style="' + td + '">' + (a.wn ? pct(r2v(a.b0 / a.wn), 2) : '⏳') + '</td><td style="' + td + '">' + (a.wn ? pct(r2v(a.b1 / a.wn), 2) : '⏳') + '</td></tr>';
    });
    return h + '</table></div>';
  }
  function curvesHTML(g) {
    var R = g.roll, def = g.def, cp = Math.round(def.calm * 100);
    var leg = function (a) { return a.map(function (x) { return '<span style="color:' + x[1] + ';white-space:nowrap">━ ' + E(x[0]) + '</span>'; }).join(' &nbsp;'); };
    var cap = function (t, l, note) { return '<div style="font-size:11.5px;color:#c9cbe8;margin:9px 0 3px"><b>' + t + '</b> ' + l + (note ? ' <span style="color:#8487bd">· ' + note + '</span>' : '') + '</div>'; };
    var pf = function (v) { return (v > 0 ? '+' : '') + v.toFixed(1) + '%'; };
    var h = '<div style="margin-top:6px;padding-top:4px;border-top:1px dashed rgba(167,139,250,.3)">';
    h += cap('① 고른 5의 주간 평균', leg([['두뇌', '#c4b5fd'], ['자격 후보 평균', '#9aa0c8'], ['시장 대금10', '#7ee8ff']]), def.win + '일 이동 · 비용 뺼 뒤 · 두뇌 선이 후보 평균보다 위 = "덜 잃기"는 배움');
    h += curveSVG(R, [{f: 'b0', c: '#9aa0c8', w: 1.2}, {f: 'b1', c: '#7ee8ff', w: 1.2}, {f: 'dw', c: '#c4b5fd', w: 2.2}], [{v: 0, c: '#555a86', t: '0%'}], pf);
    h += cap('② 상위5 적중 ÷ 무작위', leg([['두뇌', '#ffd166']]), def.win + '일 · 1배 = 무작위로 고른 만큼 · ' + def.hit + '배 밑 = 크게 오르는 종목을 무작위의 절반도 못 찾음');
    h += curveSVG(R, [{f: 'hit', c: '#ffd166', w: 2.2}], [{v: 1, c: '#9aa0c8', t: '무작위 1배'}, {v: def.hit, c: '#ff9f5a', t: '기준 ' + def.hit + '배'}], function (v) { return v.toFixed(1) + '배'; }, {lo: 0});
    h += cap('③ 얌전한 종목 비중', leg([['두뇌', '#5eead4']]), def.win + '일 · 얌전 = 그날 자격 후보 안 20일 변동성 하위 절반 · 50% = 무작위 · ' + cp + '% 위 = 얌전한 쪽으로 몰림');
    h += curveSVG(R, [{f: 'calm', c: '#5eead4', w: 2.2}], [{v: 0.5, c: '#9aa0c8', t: '무작위 50%'}, {v: def.calm, c: '#ff9f5a', t: '기준 ' + cp + '%'}], function (v) { return Math.round(v * 100) + '%'; }, {lo: 0, hi: 1});
    h += yearTableHTML(g);
    return h + '<div style="font-size:10.5px;color:#6f72a8;margin-top:5px;line-height:1.6">선 = 각 날까지 최근 ' + def.win + '거래일(값 있는 날이 20일 넘은 뒤부터) · 연습 = 2022-06~10/7 과거 재생(봉인 아님) · 보라 칸 = 🔒 봉인(진짜 시험) · 자리 = 그날 자격 후보 안 백분위(50 = 가운데) · 사후 진단 · 관찰용 · 매수추천 아님</div></div>';
  }
  function gaugeHTML() {
    var g = gaugeData(); if (!g) return '';
    var def = g.def, c = g.cur, col = {'가만히 있기': '#ff9f5a', '주의': '#fde047', '보통': '#22c55e', '자료 부족': '#8a8fb0'}[g.st] || '#8a8fb0', cp = Math.round(def.calm * 100);
    var tip = '강화학습 영상(몬테주마의 복수): 보물(보상)이 멀고 드물면 AI 는 안 죽는 구석에 가만히 있기를 배운다 → 두뇌가 덜 잃는 얌전한 종목에만 숨는지 본다'
      + ' · 가만히 있기 = 상위5 적중이 무작위의 ' + def.hit + '배 밑이고 얌전한 종목이 ' + cp + '% 넘음 · 주의 = 둘 중 하나 · 보통 = 둘 다 아님'
      + ' · 상위5 = 그 주 후보 안 주간 수익 위 5 · 무작위 = 자격 후보에서 같은 수를 무작위로 고를 때의 기대 · 기준은 이 값을 보기 전에 정함(META.계기판) · 사후 진단 · 매수신호 아님';
    var bad = function (on) { return on ? '#ff9f5a' : '#dce8ff'; };
    var pz = function (v) { return v == null ? '—' : v; };
    var h = '<div title="' + E(tip) + '" style="font-size:12.5px;color:#dce8ff;margin-top:8px;padding:6px 10px;border-radius:8px;background:rgba(0,0,0,.18);border:1px solid ' + col + '66;line-height:1.75">'
      + '<b>🪨 두뇌 상태</b> = <b style="color:' + col + '">' + E(g.st) + '</b> <span style="color:#8487bd">(최근 ' + c.nWin + '거래일 · ' + (c.nSeal ? '🔒 봉인 ' + c.nSeal + '일 + 연습 ' + (c.nWin - c.nSeal) + '일' : '전부 연습') + ')</span>'
      + ' · 상위5 적중 = 무작위의 <b style="color:' + bad(c.hit != null && c.hit < def.hit) + '">' + (c.hit == null ? '—' : c.hit.toFixed(2) + '배') + '</b> <span style="color:#8487bd">(1배 = 무작위 · 기준 ' + def.hit + '배)</span>'
      + ' · 얌전한 종목 <b style="color:' + bad(c.calm != null && c.calm > def.calm) + '">' + (c.calm == null ? '—' : Math.round(c.calm * 100) + '%') + '</b> <span style="color:#8487bd">(무작위 50% · 기준 ' + cp + '%)</span>'
      + ' · <span style="color:#8487bd">자리(자격 후보 안 · 50 = 가운데) 변동성 <b style="color:#dce8ff">' + pz(c.pos[0]) + '</b> · 주가 <b style="color:#dce8ff">' + pz(c.pos[1]) + '</b> · 거래대금 <b style="color:#dce8ff">' + pz(c.pos[2]) + '</b></span>'
      + ' <button class="today-btn" onclick="gradeCurve()" style="font-size:11px;padding:2px 10px;margin-left:4px">' + (G.curve ? '📈 학습 곡선 접기' : '📈 학습 곡선 보기') + '</button>'
      + ' <button class="today-btn" onclick="gradeGold()" style="font-size:11px;padding:2px 10px;margin-left:4px" title="🧵 2단계 = 보물(시장 주간 상위 5)이 며칠 전 어느 버튼에 떴나 · 버튼별 짚는 정도·함정">' + (G.gold ? '🧵 황금 실 표 접기' : '🧵 황금 실 표 보기') + '</button>';
    if (G.curve) h += curvesHTML(g);
    if (G.gold) h += goldTableHTML();   // 🧵 2단계
    return h + '</div>';
  }
  // 🔒 봉인 진행 막대 = "보상이 늦는 것과 없는 것은 다르다" · 예상 날짜 = 증시휴장_DATA(캘린더가 이미 읽음) + 주말 · 자료 없는 해는 고정 공휴일만
  function isoD(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  var HOL_YEARS = null;
  function isTrade(iso) {
    var d = new Date(iso + 'T00:00:00'), w = d.getDay();
    if (w === 0 || w === 6) return false;
    var H = W.증시휴장_DATA || {};
    if (H[iso]) return false;
    if (!HOL_YEARS) { HOL_YEARS = {}; Object.keys(H).forEach(function (k) { HOL_YEARS[k.slice(0, 4)] = 1; }); }
    if (!HOL_YEARS[iso.slice(0, 4)] && ['01-01', '03-01', '05-05', '06-06', '08-15', '10-03', '10-09', '12-25', '12-31'].indexOf(iso.slice(5)) >= 0) return false;
    return true;
  }
  function nextTradeDays(startIso, n) {   // startIso 포함 · 거래일 n 개
    var out = [], d = new Date(startIso + 'T00:00:00'), guard = 0, s;
    while (out.length < n && guard++ < 900) { s = isoD(d); if (isTrade(s)) out.push(s); d.setDate(d.getDate() + 1); }
    return out;
  }
  function fmtD(iso) { return iso ? (iso.slice(0, 4) === String(new Date().getFullYear()) ? (+iso.slice(5, 7)) + '/' + (+iso.slice(8, 10)) : iso) : '—'; }
  function sealProgressHTML() {
    var B = BR(); if (!B) return '';
    var D = B.D || {}, sd = [], late = 0, wdone = 0, goal = 60;
    Object.keys(D).sort().forEach(function (k) { var r = D[k]; if (r.k === 'S' && (r.p || []).length) { sd.push(k); if (r.dw != null) wdone++; } else if (r.k === 'L') late++; });
    var n = sd.length, today = isoD(new Date()), start = (B.META || {})['다음봉인'] || today;
    if (start < today) start = today;
    var fut = n < goal ? nextTradeDays(start, goal - n + 5) : [];
    var at = function (m) { return n >= m ? sd[m - 1] : fut[m - n - 1]; };
    var judge = n >= goal ? nextTradeDays(sd[goal - 1], 6)[5] : fut[goal - n + 4];
    var fr = Math.min(1, n / goal);
    var bar = '<span style="position:relative;display:inline-block;width:240px;height:9px;border-radius:5px;background:#2a2f52;vertical-align:middle;margin:0 6px;overflow:hidden">'
      + '<span style="position:absolute;left:0;top:0;bottom:0;width:' + (fr * 100).toFixed(1) + '%;background:linear-gradient(90deg,#8b5cf6,#c4b5fd)"></span>'
      + '<span style="position:absolute;left:33.33%;top:0;bottom:0;width:1px;background:#8487bd"></span><span style="position:absolute;left:66.66%;top:0;bottom:0;width:1px;background:#8487bd"></span></span>';
    var ms = function (m, icon, lab) { var d = at(m), done = n >= m; return '<span style="white-space:nowrap;color:' + (done ? '#22c55e' : '#c9cbe8') + '">' + icon + ' ' + m + '일째 ' + (done ? '✅ ' : '') + fmtD(d) + ' ' + lab + '</span>'; };
    var tip = '보상이 늦는 것과 없는 것은 다르다(강화학습 영상) · Step 7 약속 = 20·40거래일은 중간 보고만 · 60거래일 이상에서 G1·G2·G6 판정 · 몇 주 성적으로 판단하지 않는다'
      + ' · 셈 = 08:50 전 공식 봉인 중 5종목을 고른 날(늦은 봉인·고르지 못한 날 빼고) · 예상 날짜 = 다음 봉인 날부터 거래일마다 빠짐없이 봉인될 때(PC 꺼짐·늦음이면 밀림)'
      + ' · 판정 가능 = 60일째 봉인의 주간(5거래일째 종가)까지 채점된 다음 거래일 · 휴장 = 증시휴장 자료(자료 없는 해는 고정 공휴일만 · 설·추석 모름)';
    return '<div title="' + E(tip) + '" style="font-size:12px;color:#c9cbe8;margin-top:6px;line-height:1.8">'
      + '<b style="color:#dce8ff">🔒 봉인 진행</b> = 고른 공식 봉인 <b style="color:#dce8ff">' + n + '</b>/' + goal + '일' + bar
      + ms(20, '🗝', '중간 보고') + ' · ' + ms(40, '🚪', '중간 보고') + ' · ' + ms(60, '💎', '봉인') + ' → <b style="color:#ffd166">판정 ' + fmtD(judge) + ' 무렵</b>'
      + ' <span style="color:#8487bd">· 주간 채점 끝난 날 ' + wdone + ' · 늦은 봉인 ' + late + '일(성적 밖) · 날짜 = 앞으로 거래일마다 08:50 전 봉인이 빠짐없을 때</span></div>';
  }
  function shortBar(i) {   // 🪨 1단계 · 0단계 '표본 부족' = 문턱(끝난 거래 100건 · 명단 있던 날 30일 · 장부_채점.py)까지 얼마나 찼나
    var m = meth(i); if (m[4] !== '표본 부족') return '';
    var A = ((STAT().all || {}).m || {})[i], n = num(m[6]) || 0, d = A ? num(A[9]) : null, fr = Math.max(0, Math.min(1, n / 100));
    var tip = '0단계 판정 문턱 = 20거래일 다 지난 거래 100건 · 명단 있던 날 30일(둘 다 넘어야 판정) · 지금 거래 ' + n + '/100건' + (d != null ? ' · 날 ' + d + '/30(진행 중인 줄 포함)' : '') + ' · 보상이 늦는 것과 없는 것은 다르다 = 표본이 차기 전에는 판단하지 않는다';
    return ' <span title="' + E(tip) + '" style="font-size:9.5px;color:#a3a8d6;white-space:nowrap"><span style="display:inline-block;width:34px;height:5px;border-radius:3px;background:#2a2f52;vertical-align:middle;overflow:hidden"><span style="display:block;height:100%;width:' + Math.round(fr * 100) + '%;background:#8a8fb0"></span></span> ' + n + '/100건' + (d != null ? (d >= 30 ? ' · 날 ✓' : ' · 날 ' + d + '/30') : '') + '</span>';
  }
  // ── 🧵 2단계(2026-10-08) = 황금 실 · 영상 '알파고의 크레딧'(승리의 몫을 첫 수까지 거슬러 나눔)
  //    날짜 창 = 놓친 종목마다 그날 아침~20거래일 전 봉투에서 어느 버튼이 짚었나 · 자료 = 채점_황금실.js(날짜 창을 처음 열 때만 받음)
  //    🧠 칸 = [🧵 황금 실 표] = META.황금실(알림판.py v1.2) · 사후 집계 · 매수신호 아님
  function GD() { return W.채점_황금실 || null; }
  var GD_LOAD = null, GD_MISS = false;
  function loadGold(cb) {
    if (GD() || GD_MISS) { if (cb) cb(); return; }
    if (GD_LOAD) { if (cb) GD_LOAD.push(cb); return; }
    GD_LOAD = cb ? [cb] : [];
    var s = document.createElement('script');
    s.src = 'dashboard/data/채점_황금실.js?v=' + encodeURIComponent(((BR() || {}).META || {})['만든때'] || String(Date.now()));
    var done = function () { var L = GD_LOAD || []; GD_LOAD = null; L.forEach(function (f) { try { f(); } catch (e) { console.warn('🧵 황금 실', e); } }); };
    s.onload = done; s.onerror = function () { GD_MISS = true; done(); };
    document.head.appendChild(s);
  }
  var GF_NM = {'검사관최종5': '검사관 최종5', '월간칸': '월간 칸', '급등': '급등(전날)'};
  function gfName(f) { return GF_NM[f] || f; }
  function threadTxt(t, F) {   // [[버튼 번호, 가까운 지연, 처음 지연]...] → '베스트 그날 · 월간 칸 3일 전(처음 11일 전)'
    if (!t || !t.length) return '<span style="color:#6f72a8">20거래일 안 어느 버튼에도 없음</span>';
    return t.map(function (z) {
      return '<b style="color:#dce8ff">' + E(gfName(F[z[0]] || '?')) + '</b> ' + (z[1] === 0 ? '그날' : z[1] + '일 전')
        + (z[2] !== z[1] ? '<span style="color:#6f72a8">(처음 ' + z[2] + '일 전)</span>' : '');
    }).join(' · ');
  }
  function goldDayHTML(k, r) {
    if (!(r.pw || []).length && !(r.mw || []).length) return '';
    var g = GD();
    if (!g) {
      if (GD_MISS) return '<div style="font-size:11px;color:#ff9aaa;margin-top:6px">🧵 황금 실 자료 없음 = 알림판.py(v1.2) 실행</div>';
      loadGold(function () { var el = document.getElementById('gold-day'); if (el && el.getAttribute('data-k') === k) el.outerHTML = goldDayHTML(k, r); });
      return '<div id="gold-day" data-k="' + E(k) + '" style="font-size:11px;color:#8487bd;margin-top:6px">🧵 황금 실 불러오는 중…</div>';
    }
    var th = (g.D || {})[k], F = (g.META || {})['버튼'] || [];
    if (!th) return '<div style="font-size:11px;color:#8487bd;margin-top:6px">🧵 황금 실 = 이 날 자료 없음(주간 정답이 아직 안 익음)</div>';
    var tdl = 'padding:2px 10px 2px 0;white-space:nowrap;vertical-align:top', tdr = 'padding:2px 0;color:#b8bde6;line-height:1.6';
    var row = function (c, ret, extra) {
      return '<tr><td style="' + tdl + '"><span onclick="gradeStock(this,&#39;' + E(k) + '&#39;)" data-code="' + E(c) + '" data-name="' + E(brName(c)) + '" data-rate="0" data-amount="0" data-meta="🧵 황금 실 ' + E(k) + '" style="cursor:pointer;color:#efeaff;font-weight:700">' + E(brName(c)) + '</span> ' + pct(ret, 1) + (extra || '') + '</td>'
        + '<td style="' + tdr + '">← ' + threadTxt(th[c], F) + '</td></tr>';
    };
    var tip = '영상 알파고의 크레딧 = 승리의 몫을 첫 수까지 거슬러 나눔 · 그날 = 그날 아침 08:50 봉투(후보)에 있었음 · n일 전 = 그 버튼이 그만큼 앞서 짚었음(괄호 = 처음 짚은 날) · 버튼 = 봉투 원천 묶음 11개(베스트·2060·첫터치5·검사관 최종5·검사관별·월간눌림·급등눌림·유튜브·장전뉴스·월간 칸·급등) · 사후 집계 · 매수신호 아님';
    var h = '<div id="gold-day" data-k="' + E(k) + '" title="' + E(tip) + '" style="margin-top:8px;padding:7px 10px;border-radius:8px;background:rgba(255,209,102,.05);border:1px solid rgba(255,209,102,.3)">'
      + '<div style="font-size:12px;font-weight:700;color:#ffd166">🧵 황금 실 <span style="font-weight:400;color:#c9cbe8">= 놓친 종목을 그날 아침부터 20거래일 전까지 되감아, 어느 버튼이 먼저 짚었나</span> <span style="font-weight:400;color:#8487bd;font-size:11px">· 그날 = 그날 아침 후보에 있었음 · n일 전 = 그만큼 앞서 그 버튼에 떴음(괄호 = 처음 짚은 날) · 사후 집계 · 매수신호 아님</span></div>'
      + '<table style="border-collapse:collapse;font-size:11.5px;margin-top:4px">';
    if ((r.pw || []).length) { h += '<tr><td colspan="2" style="color:#8487bd;padding-top:4px">후보 안 주간 정답 5 = 그날 후보에 있었는데 두뇌가 안 고름</td></tr>'; r.pw.forEach(function (x) { h += row(x[0], x[1]); }); }
    if ((r.mw || []).length) { h += '<tr><td colspan="2" style="color:#8487bd;padding-top:6px">시장 전체 주간 상위 5 = 보물</td></tr>'; r.mw.forEach(function (x) { h += row(x[0], x[1], x[2] ? '' : ' <span style="color:#6f72a8;font-size:10.5px">(후보 밖)</span>'); }); }
    return h + '</table></div>';
  }
  function goldTableHTML() {
    var B = BR(), M = (B && B.META && B.META['황금실']) || null;
    if (!M) return '<div style="font-size:11.5px;color:#8487bd;margin-top:6px">🧵 황금 실 표 자료 없음 = 알림판.py(v1.2) 실행</div>';
    var F = M['버튼'] || [], PG = (M['과거'] || {})['구간'] || {}, A = PG['A2023-24'] || null, Bq = PG['B2025~'] || null, R = M['최근60'] || {}, S = M['봉인'] || {};
    var th = 'padding:3px 7px;border-bottom:1px solid #3a3460;color:#8487bd;text-align:right;white-space:nowrap', td = 'padding:3px 7px;border-bottom:1px solid #1e2a44;text-align:right;white-space:nowrap';
    var xb = function (v) { return v == null ? '—' : Number(v).toFixed(1) + '배'; }, p1 = function (v) { return v == null ? '—' : Number(v).toFixed(1) + '%'; };
    var sl = ' <span style="color:#555a86">/</span> ';
    var pair = function (a, b, f) { return f(a) + sl + f(b); };
    var mm = function (v) { return v == null ? '—' : pct(v, 2); };
    var cap = function (t, note) { return '<div style="font-size:11.5px;color:#c9cbe8;margin:9px 0 3px"><b>' + t + '</b>' + (note ? ' <span style="color:#8487bd">· ' + note + '</span>' : '') + '</div>'; };
    var h = '<div style="margin-top:6px;padding-top:4px;border-top:1px dashed rgba(255,209,102,.35)">';
    var cols = [['2023~24', A && A.cov], ['2025~', Bq && Bq.cov], ['최근 60거래일', R.cov], ['🔒 봉인', S.cov]];
    h += cap('① 보물(시장 주간 상위 5)이 우리 버튼에 처음 보인 때', '최근 60거래일 = ' + E(((R['처음'] || [])[0]) || '—') + '~' + E(((R['처음'] || [])[1]) || '—') + ' · 🔒 봉인 = 장 시작 전 봉인한 날(주간 채점이 끝난 날부터 셈)');
    h += '<div style="overflow-x:auto"><table style="border-collapse:collapse;font-size:11.5px;color:#e4e6ff"><tr><th style="' + th + ';text-align:left">처음 보인 때</th>' + cols.map(function (c) { return '<th style="' + th + '">' + c[0] + '</th>'; }).join('') + '</tr>';
    [['그날', '그날 아침 후보에 있었음'], ['1~5일 전', '1~5일 전에 떴다가 그날은 빠짐'], ['6~20일 전', '6~20일 전에만 떴음'], ['없음', '20일 안 어느 버튼에도 없음']].forEach(function (b) {
      h += '<tr><td style="' + td + ';text-align:left">' + b[1] + '</td>' + cols.map(function (c) { return '<td style="' + td + '">' + (c[1] ? p1(c[1][b[0]]) : '⏳') + '</td>'; }).join('') + '</tr>';
    });
    h += '</table></div>';
    if (A && Bq) {
      var good = function (f) { var a = A.fam[f] || [], b = Bq.fam[f] || []; return a[3] != null && b[3] != null && a[3] > 0 && b[3] > 0; };   // 두 구간 모두 짚은 종목 주간 평균 플러스 = 보물 이득이 함정 손해보다 컸음
      h += cap('② 버튼별(그날 아침 기준 · 앞 = 2023~24 / 뒤 = 2025~)', '짚는 정도 = 그 버튼 종목이 보물이 된 비율 ÷ 무작위 · 함정 = 그날 후보 안 주간 하위 5에 든 비율 ÷ 기준 · 크레딧 = 보물 1점을 γ ' + E(M['γ']) + '^지연으로 나눔 · 노란 굵은 = 두 구간 모두 짚은 종목 주간 평균 플러스');
      h += '<div style="overflow-x:auto"><table style="border-collapse:collapse;font-size:11.5px;color:#e4e6ff;min-width:900px"><tr>' + ['버튼', '보물 짚는 정도(그날)', '5일 안 짚는 정도', '함정', '짚은 종목 주간 평균', '주간 중앙', '크레딧 몫', '최근 60일 · 5일 안 짚은 보물'].map(function (t, j) { return '<th style="' + th + (j === 0 ? ';text-align:left' : '') + '">' + t + '</th>'; }).join('') + '</tr>';
      F.slice().sort(function (x, y) { return ((A.fam[y] || [])[0] || 0) - ((A.fam[x] || [])[0] || 0); }).forEach(function (f) {
        var a = A.fam[f] || [], b = Bq.fam[f] || [], gd = good(f);
        if (a[0] == null && b[0] == null) return;
        h += '<tr' + (gd ? ' style="background:rgba(255,209,102,.08)"' : '') + '><td style="' + td + ';text-align:left;' + (gd ? 'color:#ffd166;font-weight:700' : 'color:#dce8ff') + '">' + E(gfName(f)) + '</td>'
          + '<td style="' + td + '">' + pair(a[0], b[0], xb) + '</td><td style="' + td + '">' + pair(a[1], b[1], xb) + '</td>'
          + '<td style="' + td + ';color:' + ((a[2] || 0) >= 2 || (b[2] || 0) >= 2 ? '#ff9f5a' : '#dce8ff') + '">' + pair(a[2], b[2], xb) + '</td>'
          + '<td style="' + td + '">' + mm(a[3]) + sl + mm(b[3]) + '</td><td style="' + td + '">' + mm(a[7]) + sl + mm(b[7]) + '</td>'
          + '<td style="' + td + '">' + pair(a[4], b[4], p1) + '</td><td style="' + td + '">' + p1((R.fam5 || {})[f]) + '</td></tr>';
      });
      var pa = A.pool || {}, pb = Bq.pool || {}, ba = A.brain || {}, bb = Bq.brain || {};
      h += '<tr style="background:rgba(126,232,255,.05)"><td style="' + td + ';text-align:left;color:#7ee8ff">(기준) 후보 전체</td><td style="' + td + '">1.0배</td><td style="' + td + '"></td><td style="' + td + '">1.0배</td>'
        + '<td style="' + td + '">' + mm(pa['후보평균_주간']) + sl + mm(pb['후보평균_주간']) + '</td><td style="' + td + '"></td><td style="' + td + '">없음 ' + pair(A.cov['없음'], Bq.cov['없음'], p1) + '</td><td style="' + td + '">없음 ' + p1(R.cov ? R.cov['없음'] : null) + '</td></tr>';
      h += '<tr style="background:rgba(167,139,250,.06)"><td style="' + td + ';text-align:left;color:#c4b5fd">🧠 두뇌 5종목</td><td style="' + td + '">' + pair(ba.lift, bb.lift, xb) + '</td><td style="' + td + '"></td><td style="' + td + '"></td>'
        + '<td style="' + td + '">' + mm(ba.wk_mean) + sl + mm(bb.wk_mean) + '</td><td style="' + td + '"></td><td style="' + td + '"></td><td style="' + td + '"></td></tr>';
      h += '</table></div>';
    }
    return h + '<div style="font-size:10.5px;color:#6f72a8;margin-top:5px;line-height:1.6">읽는 법 = 짚는 정도가 높아도 함정이 같이 높고 평균이 마이너스면 "같은 얼굴"(크게 오르는 종목 = 크게 떨어지는 종목) · 두뇌가 그 얼굴을 피하다 보물도 같이 피함 = 가만히 있기 · 평균은 플러스인데 중앙이 0 근처면 대박 몇 개가 끌어올린 복권형 기미 · 과거 = 황금실_분석.py(' + E(((M['과거'] || {})['만든때']) || '') + ' · 2022-06~2026-09 이미 본 기간) · 최근 60일·봉인 = 날마다 다시 셈 · 결과를 보고 두뇌 규칙을 바꾸려면 v3 사전등록 · 관찰용 · 매수추천 아님</div></div>';
  }
  function brainPanelHTML(y, m) {
    var B = BR(), ym = y + '-' + pad(m + 1);
    var h = '<div id="grade-brain" style="margin:6px 0 10px;padding:10px 12px;border-radius:10px;background:rgba(167,139,250,.07);border:1px solid rgba(167,139,250,.35)">'
      + '<div style="font-size:14px;font-weight:700;color:#c4b5fd">🧠 추천주5강화학습두뇌 <span style="font-size:11px;font-weight:400;color:#8487bd">= 모든 버튼·뉴스·일봉을 보고 매일 5종목 · 칸의 🧠 줄 = 그날 5종목의 주간·1일 성적 · 🔒 장 시작 전 봉인(08:50 전 마지막 = 공식) · 표시 없음 = 2022-06~10/7 과거 재생(연습 · 봉인 아님) · 매수 판단은 주간 · 관찰용 · 매수추천 아님</span></div>';
    if (!B) return h + '<div style="font-size:12px;color:#8487bd;margin-top:4px">' + (BR_MISS ? '❌ dashboard/data/채점_추천주5.js 없음 = 주도주\\_천억장부\\추천주5두뇌\\알림판.py 실행' : '자료 받는 중…') + '</div></div>';
    var T = B['오늘'];
    if (T) {
      var f = T.fresh || {}, okb = function (v) { return (v === true || v === 0 || v === 1) ? '✅' : '❌'; };
      h += '<div style="font-size:12.5px;color:#dce8ff;margin-top:6px"><b>' + E(T.day) + ' 오늘의 5</b> ' + (T.late ? '<span style="color:#ffc454">⚠ 늦은 봉인 ' + E(T.sealed_at) + '(성적 밖)</span>' : '🔒 ' + E(T.sealed_at) + ' 봉인')
        + ' · <span style="color:#8487bd">자료 천프정 전날 봉 ' + okb(f['천프정_전날봉']) + ' · 장전뉴스 ' + okb(f['장전뉴스_오늘']) + ' · 월간 칸 ' + okb(f['월간칸_전날']) + ' · 베스트·2060 ' + (f['베스트2060_기록있음'] || 0) + '/' + (f['베스트2060_전체'] || 0) + ' · 후보 ' + T.n[0] + ' · 자격 ' + T.n[1] + '</span></div>';
      var main = (T.picks || {}).main || [];
      if (!main.length) h += '<div style="font-size:12px;color:#ffb4b4;margin-top:3px">오늘은 고르지 못함 = 자격 후보 0(대개 천프정 전날 봉이 아직 없음 → /매매일)</div>';
      else h += '<div style="margin-top:4px">' + main.map(function (x, i) {
        return '<span onclick="gradeStock(this,\'' + E(T.day) + '\')" data-code="' + E(x[0]) + '" data-name="' + E(brNm(x)) + '" data-rate="0" data-amount="0" data-meta="🧠 추천주5 ' + E(T.day) + '" title="' + E(((T.why || {})[x[0]] || []).join(' · ')) + '" style="display:inline-block;background:#1c1838;border:1px solid rgba(167,139,250,.55);color:#efeaff;border-radius:9px;padding:2px 9px;margin:2px;cursor:pointer;font-size:12.5px"><b style="color:#c4b5fd">' + (i + 1) + '</b> ' + E(brNm(x)) + '</span>';
      }).join('') + '</div>';
    } else {
      h += '<div style="font-size:12px;color:#c9cbe8;margin-top:6px">아직 공식 봉인 없음 · 첫 봉인 = <b>' + E((B.META || {})['다음봉인'] || (B.META || {})['첫봉인'] || '') + ' 08:05·08:40</b>(평일 자동) · 그 전에 /매매일(전날 장 마감 뒤)과 /장전뉴스(08:40 전)가 들어와야 5종목이 나온다</div>';
    }
    h += v4TodayHTML();   // 📅 달력판(v4) 오늘의 5 = 지금 두뇌 오늘의 5 바로 아래
    h += journalHTML();   // 📓 Step 4 두뇌 일지(두 두뇌 한 줄씩)
    h += gaugeHTML();   // 🪨 1단계 두뇌 상태 계기판(+ 📈 학습 곡선)
    var acc = function () { return {n: 0, w: 0, wn: 0, d: 0, dn: 0, b0: 0, b0n: 0, b3: 0, b3n: 0, h: 0, hn: 0}; }, st = {R: acc(), S: acc()};
    Object.keys(B.D || {}).forEach(function (k) {
      if (k.indexOf(ym) !== 0) return; var r = B.D[k], g = r.k === 'R' ? st.R : (r.k === 'S' ? st.S : null); if (!g) return;
      g.n++; if (r.dw != null) { g.w += r.dw; g.wn++; if (r.bw && r.bw[0] != null) { g.b0 += r.bw[0]; g.b0n++; } if (r.bw && r.bw[1] != null) { g.b3 += r.bw[1]; g.b3n++; } }
      if (r.d1 != null) { g.d += r.d1; g.dn++; } if (r.hw != null) { g.h += r.hw; g.hn++; }
    });
    [['S', '🔒 봉인'], ['R', '연습(과거 재생)']].forEach(function (z) {
      var g = st[z[0]]; if (!g.n) return;
      h += '<div style="font-size:12px;color:#c9cbe8;margin-top:4px"><b style="color:#dce8ff">' + (m + 1) + '월 ' + z[1] + '</b> ' + g.n + '일 · 주간 평균 ' + pct(g.wn ? g.w / g.wn : null, 2) + ' <span style="color:#8487bd">(자격 후보 평균 ' + pct(g.b0n ? g.b0 / g.b0n : null, 2) + ' · 시장 대금10 ' + pct(g.b3n ? g.b3 / g.b3n : null, 2) + ')</span> · 1일 평균 ' + pct(g.dn ? g.d / g.dn : null, 2)
        + (g.hn ? ' · 후보 안 주간 정답5 적중 하루 ' + (g.h / g.hn).toFixed(2) + '개' : '') + (g.wn < g.n ? ' · <span style="color:#ffc454">⏳ 주간 대기 ' + (g.n - g.wn) + '일</span>' : '') + '</div>';
    });
    h += sealProgressHTML();   // 🪨 1단계 🔒 봉인 진행 막대
    var Fw = (B['전진'] || {}).wk || {}, F1 = (B['전진'] || {})['1d'] || {}, R = B['연습'] || {}, Rw = R.wk || {}, R1 = R['1d'] || {};
    h += '<div style="font-size:11.5px;color:#8487bd;margin-top:4px;line-height:1.7">🔒 봉인 누적 = 공식 ' + (B['전진일수'] || 0) + '일 · 주간 ' + (Fw.days ? Fw.days + '일 평균 ' + pct((Fw.main || {}).mean, 2) + ' · ' + E(Fw.verdict || '') : '채점 전') + ' · 1일 ' + (F1.days ? F1.days + '일 평균 ' + pct((F1.main || {}).mean, 2) : '채점 전') + ' · 60거래일 뒤 판정'
      + ' &nbsp;|&nbsp; 연습 판정(잠긴 합격선) = 주간 ' + E(Rw.overall || '') + '(2023~24 평균 ' + pct((Rw.A || {}).mean, 2) + ' · 2025~ ' + pct((Rw.B || {}).mean, 2) + ' ' + E((Rw.B || {}).verdict || '') + ') · 1일 ' + E(R1.overall || '') + '</div>';
    h += v4SumHTML();   // 📅 달력판(v4) 봉인 누적
    h += reportHTML();   // 📊 Step 8 측정판 성적표(7개 목록 × 6지표 · 기본 한 줄)
    return h + '</div>';
  }
  function meth(i) { var M = META(); return (M && M.매매법[i]) || ['?', '?', '?', '#c9cbe8', '', null, null, null, null, null, null, '베스트']; }
  function grpOf(i) { var m = meth(i); return m[11] || (/^2060/.test(m[0]) ? '2060' : '베스트'); }
  function grpRow(gk, cnt, cols) {
    var gp = GRPS.filter(function (g) { return g.k === gk; })[0] || GRPS.filter(function (g) { return g.k === '베스트'; })[0];   // 맨 위 버튼 순서 7묶음(🌅 📉 🎯 🏅 🏹 🗣 📺 · 2026-10-11)
    return '<tr><td colspan="' + cols + '" style="padding:6px 8px;background:' + gp.bg + ';color:' + gp.color + ';font-weight:700;border-bottom:1px solid #2a3150;text-align:left;white-space:nowrap">' + gp.name + ' 달력 묶음 <span style="font-weight:400;color:#8487bd;font-size:11px">' + cnt + '개 · ' + E(gp.tip) + '</span></td></tr>';
  }
  function grpCnt(D, sep) {   // 날짜 칸 [17]~[23] = 🏅 · 🏹 · 🌅 · 📉 · 🎯 · 🗣 · 📺 매매법 수 → 맨 위 버튼 순서 글(2026-10-11)
    if (!D || D[17] == null) return '';
    var a = [['🌅 주도3안', D[19]], ['📉 월간눌림', D[20]], ['🎯 첫터치5', D[21]], ['🏅 베스트', D[17]], ['🏹 2060', D[18]], ['🗣 검사관', D[22]], ['📺 유튜브', D[23]]];
    return a.filter(function (x) { return x[1]; }).map(function (x) { return x[0] + ' ' + x[1]; }).join(sep || ' · ');
  }
  function daysBetween(a, b) { return Math.round((new Date(b + 'T00:00:00') - new Date(a + 'T00:00:00')) / 86400000); }
  function num(v) { return v == null || v !== v ? null : Number(v); }
  function pct(v, d) {
    v = num(v); if (v == null) return '<span style="color:#55597f">—</span>';
    var t = (v > 0 ? '+' : (v < 0 ? '−' : '')) + Math.abs(v).toFixed(d == null ? 1 : d) + '%';
    return '<span style="color:' + (v > 0 ? '#ff8a8a' : (v < 0 ? '#7ea6ff' : '#c9cbe8')) + '">' + t + '</span>';
  }
  function pp(v, d) {
    v = num(v); if (v == null) return '<span style="color:#55597f">—</span>';
    return '<span style="color:' + (v > 0 ? '#ff8a8a' : (v < 0 ? '#7ea6ff' : '#c9cbe8')) + '">' + (v > 0 ? '+' : (v < 0 ? '−' : '')) + Math.abs(v).toFixed(d == null ? 1 : d) + '%p</span>';
  }
  function vtag(v, small) {
    if (!v) return '';
    var c = VCOL[v] || '#8a8fb0';
    return '<span title="0단계 판정(2022-06~ · 20거래일 다 지난 줄 · 같은 자 · 운 할인)" style="display:inline-block;font-size:' + (small ? 9.5 : 10.5) + 'px;line-height:15px;padding:0 5px;border-radius:6px;border:1px solid ' + c + '66;color:' + c + ';white-space:nowrap">' + E(v) + '</span>';
  }
  function mname(i, withLabel) {
    var m = meth(i);
    return '<b style="color:' + m[3] + '">' + E(m[1]) + ' ' + E(m[0]) + '</b>' + (withLabel ? ' <span style="color:#b8bde6">' + E(m[2]) + '</span>' : '');
  }

  // ── 달 파일(그 달 종목 줄) = 그 달을 열 때만 받는다 · 받는 중이면 줄 세움
  var LOADING = {};
  function loadMon(ym, cb) {
    if (MON(ym)) { if (cb) cb(null); return; }
    if (LOADING[ym]) { if (cb) LOADING[ym].push(cb); return; }
    LOADING[ym] = cb ? [cb] : [];
    var s = document.createElement('script');
    s.src = 'dashboard/data/채점_월/' + ym + '.js?v=' + encodeURIComponent((META() || {}).만든때 || '');
    var done = function (err) { var L = LOADING[ym] || []; delete LOADING[ym]; L.forEach(function (f) { try { f(err); } catch (e) { console.warn('📝 채점', e); } }); };
    s.onload = function () { done(MON(ym) ? null : 'empty'); };
    s.onerror = function () { done('404'); };
    document.head.appendChild(s);
  }

  // 📝 채점 달력 = 늘 맨 아래(맨 위 버튼 순서의 맨 끝 · 2026-10-07 사용자 "채점 버튼은 맨끝인데 채점 달력은 맨아래가 아니야. 맨 아래로 내려")
  //   전엔 페이지가 다 읽히기 전에 📝 채점을 누르면 채점이 먼저 생기고 📺 유튜브가 그 뒤(맨 아래)에 붙었다 → 만들 때·그릴 때·다 읽힌 뒤 맨 끝으로
  function keepLast(sec) { var p = sec && sec.parentNode; if (p && p.lastElementChild !== sec) p.appendChild(sec); }
  function ensure() {
    var sec = document.getElementById('sec-grade'); if (sec) { keepLast(sec); return sec; }
    // 구역 = 🗣 검사관과 같은 모양(2026-10-07 사용자 "유튜브·채점 달력도 버튼순서와 달력순서 일치") · 큰 제목 막대(onepage-sec) 뺌 · 위 고정 메뉴줄에 안 가리게 80px
    sec = document.createElement('section'); sec.id = 'sec-grade'; sec.style.scrollMarginTop = '80px';
    var yt = document.getElementById('sec-yt'), a = document.getElementById('sec-eco');
    ((yt && yt.parentNode) || (a && a.parentNode) || document.body).appendChild(sec);   // 맨 끝(유튜브가 나중에 생기면 유튜브가 채점 앞에 끼어든다)
    return sec;
  }
  function latestYM() { var M = META(); var k = (M && M.끝칸) || ''; if (!k) { var t = new Date(); return [t.getFullYear(), t.getMonth()]; } return [+k.slice(0, 4), +k.slice(5, 7) - 1]; }

  // 그날 ★ 종목(+20% 닿음) = 달 파일에서 · 여러 매매법이 같이 고른 종목이 앞
  function dayHits(k) {
    var MD = MON(k.slice(0, 7)); if (!MD) return null;
    var L = MD.d[k] || [], o = {}, out = [];
    L.forEach(function (r) { if (r[3] !== 'T') return; var h = o[r[1]] || (o[r[1]] = {c: r[1], n: MD.n[r[1]] || r[1], ms: []}); if (h.ms.indexOf(r[0]) < 0) h.ms.push(r[0]); });
    Object.keys(o).forEach(function (c) { out.push(o[c]); });
    return out.sort(function (a, b) { return b.ms.length - a.ms.length || String(a.n).localeCompare(String(b.n)); });
  }

  function cellHTML(k, d) {
    var D = DAYS()[k], on = G.sel === k;
    if (!D) {
      var bl0 = brainLine(k) + v4Line(k);   // 📅 달력판 줄은 🧠 줄 바로 아래
      if (!bl0) return '<div style="min-height:84px;padding:5px 6px;border-radius:8px;background:#0e1424;border:1px solid rgba(255,255,255,.05)"><div style="font-size:11px;color:#55597f">' + d + '</div></div>';
      return '<div class="grade-cell" data-date="' + k + '" onclick="gradePick(\'' + k + '\')" style="min-height:84px;padding:5px 6px;border-radius:8px;cursor:pointer;background:#141a2e;border:1px solid ' + (on ? '#ffd166' : 'rgba(167,139,250,.3)') + ';overflow:hidden"><div style="font-size:11px;color:#c9cbe8">' + d + '</div>' + bl0 + '</div>';
    }
    var nm = D[0], n = D[1], nv = D[2], T = D[3], S = D[4], H = D[5], P = D[6], av = num(D[7]), seal = D[12], exd = num(D[13]);
    var bg = '#141a2e';
    if (nv && av != null) { var a = Math.min(0.05 + Math.abs(av) / 40, 0.30).toFixed(3); bg = av >= 0 ? 'rgba(255,90,90,' + a + ')' : 'rgba(90,140,255,' + a + ')'; }
    var gTxt = grpCnt(D), grpTxt = nm + '법';   // 칸이 좁아 묶음별 수는 풍선말로(2026-10-11 7묶음)
    var tip = k + ' · 매매법 ' + nm + '개' + (gTxt ? '(' + gTxt + ')' : '') + ' · 명단 ' + n + '줄 · ★ +20% 닿음 ' + T + ' · ✕ −10% 손절 ' + S + (H ? ' · ⏳ 진행 중 ' + H : '') + (P ? ' · 예정 ' + P : '') + (seal ? ' · 🔒 봉인 ' + seal : '')
      + ' · 평균 ' + (av == null ? '—' : av.toFixed(2) + '%') + (exd == null ? '' : ' · 대금10 대비 ' + exd.toFixed(2) + '%p') + ' · 누르면 매매법별 표';
    var h = '<div class="grade-cell" data-date="' + k + '" onclick="gradePick(\'' + k + '\')" title="' + E(tip) + '" style="min-height:84px;padding:5px 6px;border-radius:8px;cursor:pointer;background:' + bg + ';border:1px solid ' + (on ? '#ffd166' : 'rgba(255,209,102,.22)') + ';overflow:hidden">'
      + '<div style="font-size:11px;color:#8487bd;display:flex;justify-content:space-between;gap:4px;white-space:nowrap"><span style="color:#c9cbe8">' + d + (seal ? ' <span title="장 시작 전 봉인한 전진 장부 줄">🔒' + seal + '</span>' : '') + '</span><span style="color:#6f72a8" title="' + E('이 날 채점에 들어간 매매법 ' + nm + '개' + (gTxt ? ' = ' + gTxt : '') + ' · 맨 위 버튼 순서 · 뒤 숫자 = 명단 줄 수') + '">' + grpTxt + ' · ' + n + '</span></div>';
    if (nv) {
      h += '<div style="font-size:12px;margin-top:2px;white-space:nowrap"><b style="color:' + (T ? '#ffd166' : '#55597f') + '">★' + T + '</b> <span style="color:' + (S ? '#7ea6ff' : '#55597f') + '">✕' + S + '</span> ' + pct(av, 1) + (H ? ' <span style="color:#ffc454;font-size:10.5px">⏳' + H + '</span>' : '') + '</div>';
      if (exd != null) h += '<div style="font-size:10.5px;color:#8487bd;white-space:nowrap">대금10 대비 ' + pp(exd, 1) + '</div>';
      var hits = dayHits(k);
      if (hits && hits.length) {
        h += '<div style="font-size:10.5px;color:#ffe9a8;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">★ ' + hits.slice(0, 2).map(function (x) { return E(x.n) + (x.ms.length > 1 ? '<span style="color:#ffd166">×' + x.ms.length + '</span>' : ''); }).join(' · ') + (hits.length > 2 ? ' <span style="color:#8487bd">외 ' + (hits.length - 2) + '</span>' : '') + '</div>';
      }
    } else if (P) {
      h += '<div style="font-size:11px;margin-top:3px;color:#7ee8ff">예정 ' + P + ' <span style="color:#6f72a8">(아직 봉 없음)</span></div>';
    } else {
      h += '<div style="font-size:11px;margin-top:3px;color:#55597f">가격 없음 ' + n + '</div>';
    }
    // 2026-09 연구판: 채점의 그 날짜 칸에서 시장 전체 +20% 복기로 바로 이동(기존 채점 클릭은 그대로).
    var censusLink = k.slice(0, 7) === '2026-09' && W.censusDaily
      ? '<button type="button" class="cs-inline" onclick="event.stopPropagation();censusDaily(\'' + k + '\')" title="이 날 시장 전체 +20% 종목과 88개 채점 목록 비교">전수 복기</button>' : '';
    return h + brainLine(k) + v4Line(k) + censusLink + '</div>';
  }

  function monthTotals(y, m) {
    var pre = y + '-' + pad(m + 1), DD = DAYS(), t = {days: 0, n: 0, nv: 0, T: 0, S: 0, H: 0, P: 0, seal: 0, sv: 0, se: 0, ne: 0};
    Object.keys(DD).forEach(function (k) {
      if (k.indexOf(pre) !== 0) return; var D = DD[k];
      t.days++; t.n += D[1]; t.nv += D[2]; t.T += D[3]; t.S += D[4]; t.H += D[5]; t.P += D[6]; t.seal += D[12];
      if (D[7] != null) t.sv += D[7] * D[2];
      if (D[13] != null) { t.se += D[13] * D[2]; t.ne += D[2]; }
    });
    t.avg = t.nv ? t.sv / t.nv : null; t.exd = t.ne ? t.se / t.ne : null;
    return t;
  }

  // 머리 = 다른 달력(🏅 베스트 · 🏹 2060 · 🗣 검사관 …)과 같은 순서(2026-10-07 사용자 "버튼순서와 달력순서가 일치하게")
  //   왼쪽 = ‹ 해 › + 📝 채점 이름표(맨 위 버튼 이름 그대로) · 오른쪽 = 최신 + 📖 설명 보기 → (🧠 · 판정 · 들어간 것 · 달 성적) → 1~12월 → 달력
  function navHTML(y) {
    return '<div class="cal-nav">'
      + '<button class="nav-btn" onclick="gradeYear(-1)" title="이전 해">&#8249;</button>'
      + '<div class="cal-title" style="min-width:120px;text-align:center">' + y + '년</div>'
      + '<button class="nav-btn" onclick="gradeYear(1)" title="다음 해">&#8250;</button>'
      + '<span class="cal-badge-name" title="이 달력 = 맨 위 [📝 채점] 버튼 · 누르면 그 버튼처럼 이 달력 맨 위로" onclick="setView(\'grade\')">📝 채점</span></div>';
  }
  function headHTML(y) {
    var M = META(), maxA = 0, n2060 = 0;
    (M.매매법 || []).forEach(function (x) { var r = /^어사이드(\d+)/.exec(x[0]); if (r) maxA = Math.max(maxA, +r[1]); if (/^2060/.test(x[0])) n2060++; });
    var nMeth = (M.매매법 || []).length, gc = {};
    (M.매매법 || []).forEach(function (x) { var g = x[11] || (/^2060/.test(x[0]) ? '2060' : '베스트'); gc[g] = (gc[g] || 0) + 1; });
    var nJ3 = gc['주도3안'] || 0, nX = (gc['월간눌림'] || 0) + (gc['첫터치5'] || 0) + (gc['검사관'] || 0) + (gc['유튜브'] || 0);
    var h = '<div class="cal-header" style="margin-top:30px">' + navHTML(y)
      + '<div class="cal-right"><button class="today-btn" onclick="gradeLatest()">최신</button>'
      + (typeof W.descBtnHTML === 'function' ? W.descBtnHTML('grade') : '')
      + '<div class="cal-desc" data-desc="grade" style="font-size:11.5px;color:#8487bd;margin-left:10px;line-height:1.7">'
      + '📝 <b style="color:#b8bde6">채점</b> = ' + (nJ3 ? '<b style="color:#ffb74d">🌅 주도3안</b> 달력 종목 묶음 ' + nJ3 + '개(대표 · 관련주 · v2-X · 🏅 관찰 후보5) + ' : '') + (nX ? '<b style="color:#ff9e7a">📉 월간눌림</b> ' + (gc['월간눌림'] || 0) + ' · <b style="color:#ff6b81">🎯 첫터치5</b> ' + (gc['첫터치5'] || 0) + ' · <b style="color:#9fd0ff">🗣 검사관</b> ' + (gc['검사관'] || 0) + ' · <b style="color:#ff5c5c">📺 유튜브</b> ' + (gc['유튜브'] || 0) + ' 묶음(2026-10-11) + ' : '') + '🏅 베스트 · 🏹 2060 달력에 걸린 매매법 <b style="color:#dce8ff">' + (nMeth - nJ3 - nX) + '개</b>(1위패턴 · 어사이드1~' + maxA + ' · 2060매매법1~' + n2060 + ' · 어사이드8·9 는 종가 타점과 8시 명단을 따로)의 명단을 <b style="color:#ffd166">같은 자</b>로 잰 결과 · 칸 = 그 매매법들의 매수일(칸 날짜) · '
      + '같은 자 = 아침 명단은 그날 시가 · 그날 종가 신호는 그날 종가에 산다 → <b>+20% 익절 / −10% 손절 / 20거래일 종가</b> · 비용 0.35%p · 수정주가 · 20거래일이 안 지난 줄은 <b>지금까지</b>(닿았으면 끝 · 아니면 마지막 종가로 평가 = ⏳ 진행 중) · '
      + '★ = +20% 닿음 · ✕ = −10% 손절 · 칸 색 = 그날 줄 평균(빨강 + · 파랑 −) · <b>기준선</b> = 같은 날 시장(전 종목 같은 비중) · 대금10(전날 거래대금 위 10종목)을 같은 자로 잰 값 · 대금10 대비 = 줄마다 (값 − 같은 날 대금10) 의 평균 · '
      + '🔒 = 장 시작 전(09:00 전)에 봉인한 전진 장부 줄 = 진짜 시험 · 0단계 판정(2022-06~ · 20거래일 다 지난 줄 · 운 할인) = 통과 후보 · 관찰 · 탈락 · 표본 부족 · '
      + '매매법 자체 규칙(조건부 매수 · 다른 청산)의 수익은 종목에 마우스를 올리면 \'자체\'로 보임 · 같은 종목이 여러 매매법에 겹치면 각각 셈 · '
      + '<b style="color:#b8bde6">순서</b> = 맨 위 버튼 순서(🌅 주도3안 → 📉 월간눌림 → 🎯 첫터치5 → 🏅 베스트 → 🏹 2060 → 🗣 검사관 → 📺 유튜브) · 묶음 안은 그 달력 묶음 순서(🏅 1위패턴 → 🅰 어사이드1 → … → ㊀ 어사이드51 / 🏹1 → 🏹8) = 칸 오른쪽 위 🏅N 🏹N · 채점표 · 날짜 창 모두 같은 순서(표는 칸 머리를 누르면 성적 순) · '
      + '자료 = 주도주\\_천억장부\\장부_달력.py(평일 08:50·21:30 자동 · 마지막 ' + E(M.만든때) + ' · 천프정 ' + E(M.마지막봉) + ' 봉까지) · <b style="color:#ff9aaa">관찰용 · 매수추천 아님</b></div>'
      + '</div></div>';
    return h;
  }

  function verdictLine() {
    var M = META(), V = M.판정수 || {}, F = M.전진 || {};
    var h = '<div style="font-size:11.5px;color:#8487bd;margin:2px 0 8px;line-height:1.7">'
      + '<b style="color:#c9cbe8">0단계 판정</b>(2022-06~ · 20거래일 다 지난 줄 · ' + E(M.판정만든때 || '') + ') '
      + ['통과 후보', '관찰', '표본 부족', '탈락'].map(function (k) { return vtag(k) + ' <b style="color:#dce8ff">' + (V[k] || 0) + '</b>'; }).join(' &nbsp;')
      + ' &nbsp;·&nbsp; <span title="장 시작 전에 봉인한 줄만 = 만든 뒤 고를 수 없는 진짜 시험">🔒 전진 장부 <b style="color:#dce8ff">' + (F.봉인줄 || 0) + '줄</b>'
      + (F.봉인줄 ? ' (' + E(F.첫칸) + ' ~ ' + E(F.끝칸) + ')' : ' = 평일 08:50 장 시작 전에 그날 명단을 봉인해 쌓는다(첫 봉인 10/8)') + (F.늦음줄 ? ' · 늦게 들어와 뺀 ' + F.늦음줄 + '줄' : '') + '</span></div>';
    return h;
  }

  // 📋 들어간 것 = 맨 위 버튼 순서(🌅 주도3안 → 📉 월간눌림 → 🎯 첫터치5 → 🏅 베스트 → 🏹 2060 → 🗣 검사관 → 📺 유튜브) · 누르면 매매법 목록(그 달력 묶음 순서 · 0단계 판정 · 그 달력이 채워진 마지막 칸)
  // ★2026-10-08 Step 6(사용자 "멈췄는데 아무도 모르는 것") = '자료가 멈춘 달력' 을 끝 칸 3일(달력일)이 아니라 묶음 파일의 '계산 끝 날' vs 천프정 마지막 봉(D)으로 잰다
  //   자료 = W.버튼날짜(dashboard/data/버튼날짜.js · 주도주\_버튼날짜.py = 실행기 · /매매일 끝에 다시 씀) · 없으면 옛 기준(끝 칸이 가장 최신 칸보다 3일 넘게 늦음)
  //   판정 = 정상 / 신호 드묾(계산은 D 까지 했는데 고른 종목 칸이 4일 넘게 없음 · 회색 · 고칠 것 없음) / 멈춤 N거래일(주황) / 모름(도장 못 읽음 · 회색)
  //   이름 = 채점 줄 이름에서 (종가)·(8시) 를 떼면 묶음 이름(어사이드8(종가) → 어사이드8)
  var ST_X = {'월간눌림': '📉 월간눌림 달력 자료 = /매매일 때 월간눌림.js · 급등눌림.js 를 다시 계산(끝 = 그 묶음 마지막 칸 · 매수일 = 신호 다음 거래일)',
              '첫터치5': '🎯 첫터치5 달력 자료 = /매매일 때 첫터치5_아카이브.js(끝 = 그 묶음 마지막 칸 = 매수일)',
              '검사관': '🗣 검사관 달력 자료 = 그날 아침 토론 기록 검사관토론_아카이브.js(끝 = 마지막 토론 날)',
              '유튜브': '📺 유튜브 달력 자료 = 유튜브요약.js(/유튜브요약으로 쌓임 · 끝 = 마지막 매수일)'};   // 📉🎯🗣📺 묶음은 버튼날짜.js 도장 대상이 아님(2026-10-11)
  function stampOf(name) { var B = W.버튼날짜; return (B && B.묶음) ? (B.묶음[String(name).replace(/\(.*\)$/, '')] || null) : null; }
  function stState(i) {
    var B = W.버튼날짜, m = meth(i), end = m[10] || '';
    if (m[11] === '주도3안') return {k: 'ok', t: '', c: '#6f72a8', tip: '🌅 주도3안 달력 자료 = 평일 08:12 카드 봉인 · 08:40 관찰 후보5 봉인 · 08:56 무렵 v2-X(끝 = 그 묶음 마지막 칸)'};
    if (ST_X[m[11]]) return {k: 'ok', t: '', c: '#6f72a8', tip: ST_X[m[11]]};
    if (!B || !B.묶음) return null;
    var s = stampOf(m[0]);
    if (!s || !s.계산끝) return {k: 'unk', t: '모름', c: '#8487bd', tip: '묶음 파일의 계산 끝 날을 못 읽음'};
    if (s.밀림 > 0) return {k: 'stop', t: '멈춤 ' + s.밀림 + '거래일', c: '#ff9f5a', tip: '계산 끝 ' + s.계산끝 + ' < 천프정 마지막 봉 ' + B.일봉 + (s.이유 ? ' · ' + s.이유 : ' · 실행기(_달력따라잡기.py)가 아직 안 돌았거나 막힘')};
    if (end && B.일봉 && daysBetween(end, B.일봉) > 3) {
      var Mt = String((META() || {}).만든때 || '');   // 채점 자료(끝 칸)를 만든 때 · 묶음 파일이 그 뒤에 다시 계산됐으면 끝 칸이 옛것 = 신호 드묾이 아니다
      if (s.파일시각 && Mt && s.파일시각 > Mt) return {k: 'lagd', t: '채점 자료 옛것', c: '#8487bd', tip: '이 달력은 ' + s.파일시각 + ' 에 다시 계산됐는데 채점 자료는 ' + Mt + ' 판(끝 칸 ' + end + ') = 다음 장부 예약(평일 08:50 · 21:30) 때 맞춰짐'};
      return {k: 'rare', t: '신호 드묾', c: '#8487bd', tip: '계산은 ' + s.계산끝 + ' 까지 했는데 고른 종목 칸이 ' + end + ' 뒤로 없음(정상)'};
    }
    return {k: 'ok', t: '', c: '#6f72a8', tip: '계산 끝 ' + s.계산끝 + ' = 천프정 ' + B.일봉};
  }
  function includedHTML() {
    var M = META(), L = M.매매법 || [], cnt = {'주도3안': 0, '월간눌림': 0, '첫터치5': 0, '베스트': 0, '2060': 0, '검사관': 0, '유튜브': 0}, latest = '', B = W.버튼날짜, useSt = !!(B && B.묶음);
    L.forEach(function (x, i) { cnt[grpOf(i)]++; if (x[10] && x[10] > latest) latest = x[10]; });
    var stale = 0, rare = 0, unk = 0, lagd = 0;
    L.forEach(function (x, i) {
      if (useSt) { var s = stState(i); if (s.k === 'stop') stale++; else if (s.k === 'rare') rare++; else if (s.k === 'unk') unk++; else if (s.k === 'lagd') lagd++; }
      else if (x[10] && latest && daysBetween(x[10], latest) > 3) stale++;
    });
    var stTip = useSt ? '묶음 파일의 계산 끝 날 vs 천프정 마지막 봉 ' + B.일봉 + ' · 기준표 dashboard/data/버튼날짜.js 만든 때 ' + B.만든때 : '옛 기준 = 끝 칸이 가장 최신 칸보다 3일 넘게 늦음(버튼날짜.js 없음)';
    var h = '<div style="font-size:11.5px;color:#8487bd;margin:0 0 8px;line-height:1.7"><b style="color:#c9cbe8">📋 들어간 것</b>(맨 위 버튼 순서) = '
      + (cnt['주도3안'] ? '<b style="color:#ffb74d">🌅 주도3안</b> 달력 묶음 ' + cnt['주도3안'] + '개(대표 · 관련주 · v2-X 대표·관련주 · 🏅 관찰 후보5) → ' : '')
      + (cnt['월간눌림'] ? '<b style="color:#ff9e7a">📉 월간눌림</b> 달력 묶음 ' + cnt['월간눌림'] + '개(월간 · 급등 분류 = 깊은 눌림 처음 들어옴 🆕) → ' : '')
      + (cnt['첫터치5'] ? '<b style="color:#ff6b81">🎯 첫터치5</b> 달력 묶음 ' + cnt['첫터치5'] + '개(20·60·120·240·480선) → ' : '')
      + '<b style="color:#ffd700">🏅 베스트</b> 달력 묶음 ' + cnt['베스트'] + '개(1위패턴 · 어사이드1~51) → <b style="color:#ff9f5a">🏹 2060</b> 달력 묶음 ' + cnt['2060'] + '개(2060매매법1~8)'
      + (cnt['검사관'] ? ' → <b style="color:#9fd0ff">🗣 검사관</b> 달력 묶음 ' + cnt['검사관'] + '개(최종5 · 검사관마다)' : '')
      + (cnt['유튜브'] ? ' → <b style="color:#ff5c5c">📺 유튜브</b> 달력 묶음 ' + cnt['유튜브'] + '개(영상 언급 종목)' : '')
      + ' = <b style="color:#dce8ff">' + L.length + '개</b>의 고른 종목(칸 = 매수일)'
      + (stale ? ' · <span style="color:#ff9f5a" title="' + E(stTip + ' = 실행기(_달력따라잡기.py)가 아직 안 돌았거나 막힘 · 목록 보기에서 주황 줄') + '">자료가 멈춘 달력 ' + stale + '개</span>'
               : (useSt ? ' · <span style="color:#6f72a8" title="' + E(stTip) + '">멈춘 달력 0(계산 끝 = 천프정 ' + E(String(B.일봉 || '').slice(5)) + ')</span>' : ''))
      + (rare ? ' · <span style="color:#8487bd" title="계산은 천프정 마지막 봉까지 했는데 고른 종목 칸이 4일 넘게 없음 = 신호가 드문 것(고칠 것 없음)">신호 드묾 ' + rare + '</span>' : '')
      + (lagd ? ' · <span style="color:#8487bd" title="달력은 채점 자료를 만든 뒤에 다시 계산됨 = 다음 장부 예약(평일 08:50 · 21:30) 때 채점에 들어간다(멈춤 아님)">채점 자료 옛것 ' + lagd + '</span>' : '')
      + (unk ? ' · <span style="color:#8487bd" title="묶음 파일의 계산 끝 날을 못 읽음">모름 ' + unk + '</span>' : '')
      + ' · <span style="color:#6f72a8" title="월간 = 그날 테마 칸(종목을 고른 기계가 아님) · 📈 급등 = 이미 오른 결과 목록 · 🕸 생태계 · 🗺 테마맵 · 🗂 카드맵 = 지도">안 들어감 = 월간 · 📈 급등(결과 목록) · 🕸🗺🗂 지도</span> '
      + '<button class="today-btn" onclick="gradeList()" style="font-size:11px;padding:2px 10px;margin-left:4px">' + (G.list ? '📋 목록 접기' : '📋 ' + L.length + '개 목록 보기') + '</button></div>';
    if (G.list) {
      h += '<div style="margin:0 0 10px;padding:8px 10px;border:1px solid #232845;border-radius:8px;background:rgba(255,255,255,.02)">';
      GRPS.forEach(function (gp) {
        var items = []; L.forEach(function (x, i) { if (grpOf(i) === gp.k) items.push(i); });
        if (!items.length) return;
        h += '<div style="font-size:12.5px;margin:4px 0 4px"><b style="color:' + gp.color + '">' + gp.name + ' 달력 묶음</b> <span style="color:#6f72a8;font-size:11px">' + items.length + '개 · ' + E(gp.tip) + '</span></div>'
          + '<div style="column-width:320px;column-gap:16px;font-size:11.5px;line-height:1.8;margin-bottom:6px">';
        items.forEach(function (i) {
          var m = meth(i), end = m[10] || '', st = useSt ? stState(i) : null, old = st ? st.k === 'stop' : (end && latest && daysBetween(end, latest) > 3);
          h += '<div style="break-inside:avoid;white-space:nowrap;overflow:hidden;text-overflow:ellipsis" title="' + E(m[0] + ' ' + m[2] + (m[6] != null ? ' · 0단계 2022-06~ ' + m[6] + '건 평균 ' + m[7] + '% 중앙 ' + m[8] + '%' : '') + ' · 그 달력이 ' + end + ' 칸까지 채워짐' + (st ? ' · ' + st.tip : '')) + '">'
            + mname(i, true) + ' ' + vtag(m[4], true) + shortBar(i) + ' <span style="color:' + (st ? st.c : (old ? '#ff9f5a' : '#6f72a8')) + '">끝 ' + E(end.slice(5)) + (st && st.t ? ' · ' + E(st.t) : '') + '</span></div>';
        });
        h += '</div>';
      });
      h += '<div style="font-size:10.5px;color:#6f72a8">순서 = 맨 위 버튼 순서(🌅 주도3안 → 📉 월간눌림 → 🎯 첫터치5 → 🏅 베스트 → 🏹 2060 → 🗣 검사관 → 📺 유튜브) · 묶음 안은 그 달력 묶음 순서 · 끝 = 그 매매법 달력이 채워진 마지막 칸 · '
        + (useSt ? '주황 「멈춤 N거래일」 = 묶음 파일의 계산 끝 날이 천프정 마지막 봉(' + E(B.일봉) + ')보다 늦음 = 실행기가 아직 안 돌았거나 막힘 · 회색 「신호 드묾」 = 계산은 끝났는데 고른 종목 칸이 4일 넘게 없음(고칠 것 없음) · 회색 「채점 자료 옛것」 = 달력이 채점 자료보다 나중에 다시 계산됨(다음 장부 때 맞춰짐) · 기준표 버튼날짜.js ' + E(B.만든때)
                 : '주황 = 가장 최신 칸 ' + E(latest) + ' 보다 3일 넘게 늦음(옛 기준 · 버튼날짜.js 없음)')
        + ' · 관찰 줄·참고 줄은 뺀다(베스트 · 2060 달력에서 ‘고른 종목’만)</div></div>';
    }
    return h;
  }

  function render() {
    var M = META(), sec = ensure();
    if (!M) { sec.innerHTML = '<div class="cal-header" style="margin-top:30px">' + navHTML(G.y || new Date().getFullYear()) + '</div><div style="color:#ff9aaa;font-size:13px;padding:10px">❌ dashboard/data/채점_요약.js 가 없다 = 주도주\\_천억장부\\장부_달력.py 실행</div>'; return; }
    var y = G.y, m = G.m, ym = y + '-' + pad(m + 1);
    var first = new Date(y, m, 1).getDay(), days = new Date(y, m + 1, 0).getDate();
    var h = headHTML(y);
    h += brainPanelHTML(y, m);
    h += verdictLine() + includedHTML();
    var t = monthTotals(y, m), B = (STAT()[ym] || {}).b || [];
    if (t.days) {
      h += '<div style="font-size:12px;color:#c9cbe8;margin:4px 0 8px;line-height:1.7"><b style="color:#dce8ff">' + (m + 1) + '월</b> 명단 ' + t.n.toLocaleString() + '줄 · '
        + '<b style="color:#ffd166">★ +20% ' + t.T.toLocaleString() + '</b>(' + (t.nv ? (100 * t.T / t.nv).toFixed(1) : '—') + '%) · <span style="color:#7ea6ff">✕ −10% ' + t.S.toLocaleString() + '</span>(' + (t.nv ? (100 * t.S / t.nv).toFixed(1) : '—') + '%) · '
        + '평균 ' + pct(t.avg, 2) + (t.H ? ' · <span style="color:#ffc454">⏳ 진행 중 ' + t.H + '</span>' : '') + (t.P ? ' · <span style="color:#7ee8ff">예정 ' + t.P + '</span>' : '') + ' · 대금10 대비 ' + pp(t.exd, 2)
        + ' &nbsp;|&nbsp; <span style="color:#8487bd">기준선(같은 달 하루 평균) 시장 ' + pct(B[0], 2) + ' (+20% ' + (B[1] == null ? '—' : B[1] + '%') + ') · 대금10 ' + pct(B[2], 2) + ' (+20% ' + (B[3] == null ? '—' : B[3] + '%') + ')</span></div>';
    } else {
      h += '<div style="font-size:12px;color:#6f72a8;margin:4px 0 8px">' + (m + 1) + '월 = 채점 자료 없음(같은 자 공통 구간은 2022-06-02 부터)</div>';
    }
    // 1~12월 버튼 = 달력 바로 위(다른 달력과 같은 순서 · 그 달 설명 줄들은 머리와 달 버튼 사이)
    var months = M.달 || [];
    h += '<div class="month-strip">';
    for (var mi = 0; mi < 12; mi++) {
      var key = y + '-' + pad(mi + 1), has = months.indexOf(key) >= 0;
      h += '<button class="ms-btn' + (mi === m ? ' active' : '') + (has && mi !== m ? ' has-data' : '') + '" onclick="gradeGoMonth(' + mi + ')" title="' + (mi + 1) + '월 ' + (has ? '채점 자료 있음' : '자료 없음(2022-06 부터)') + '">' + (mi + 1) + '월</button>';
    }
    h += '</div>';
    if (ym === '2026-09' && W.censusGo) h += '<div style="display:flex;gap:6px;flex-wrap:wrap;margin:6px 0 8px"><button class="cs-btn" onclick="censusGo()">9월 전수 달력</button><button class="cs-btn" onclick="censusWeekly()">주간 보고서</button><button class="cs-btn" onclick="censusMonthly()">월간 보고서</button><span style="font-size:11px;color:#9aafc3;align-self:center">급등 전체와 채점 목록 대조 · 소급은 정시 포착 아님</span></div>';
    h += '<div style="display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:4px">';
    ['일', '월', '화', '수', '목', '금', '토'].forEach(function (w, i) { h += '<div style="text-align:center;font-size:11px;color:' + (i === 0 ? '#ff6b81' : i === 6 ? '#6bb7ff' : '#8487bd') + '"' + (i === 0 ? ' title="그 달 첫 일요일 칸 📆 = 그 달 결산(많이 나온 종목 · 테마)"' : (i === 6 ? ' title="토요일 칸 📅 = 그 주(월~금) 결산(많이 나온 종목 · 테마)"' : '')) + '>' + w + '</div>'; });
    for (var i = 0; i < first; i++) h += '<div></div>';
    for (var d = 1; d <= days; d++) {
      var kd = ym + '-' + pad(d);
      if ((first + d - 1) % 7 === 6 && !DAYS()[kd]) h += weekCellHTML(kd, d, false);
      else if ((first + d - 1) % 7 === 0 && d <= 7 && !DAYS()[kd]) h += monthCellHTML(kd, d, ym);   // 📆 월간 = 그 달 첫 일요일 칸(본 달력 월간 결산과 같은 자리)
      else h += cellHTML(kd, d);
    }
    var lw = (first + days - 1) % 7;   // 마지막 날 요일 · 토요일이 아니면 다음 달 토요일 칸까지 채워 그 주 🗓 칸을 단다
    if (lw !== 6) {
      for (var j = lw + 1; j < 6; j++) h += '<div></div>';
      var nsat = ymd(new Date(y, m, days + 6 - lw));
      h += weekCellHTML(nsat, md(nsat), true);
    }
    h += '</div>';
    h += '<div style="font-size:10.5px;color:#6f72a8;margin-top:6px;line-height:1.6">칸 = 매수일(칸 날짜) · <b style="color:#ffd166">★</b> +20% 닿음 · <span style="color:#7ea6ff">✕</span> −10% 손절 · 퍼센트 = 그날 줄 평균(비용 뺀 같은 자 · ⏳ 진행 중은 지금 평가) · 대금10 대비 = 같은 날 전날 거래대금 위 10종목을 같은 자로 산 것보다 나은 정도 · ×2 = 두 매매법이 같이 고른 종목 · 칸을 누르면 매매법별 표 · <span style="color:#c4b5fd">🧠</span> = 추천주5 그날 5종목(주 = 주간 · 일 = 1일 · 🔒 장 전 봉인 / 표시 없음 = 연습 재생 · ⏳ 대기)</div>';
    h += '<div id="grade-rank" style="margin-top:14px">' + rankHTML() + '</div>';
    sec.innerHTML = h;
    if (!BR() && !BR_MISS) loadBrain(function () { if (G.y === y && G.m === m) render(); });   // 🧠 추천주5 자료는 처음 한 번 받고 다시 그린다
    if ((M.달 || []).indexOf(ym) >= 0 && !MON(ym)) loadMon(ym, function (err) { if (!err && G.y === y && G.m === m) render(); });   // ★ 종목 이름은 달 파일이 오면 다시 그린다
  }

  // ── 순위표 = 이 달 · 올해 · 2022-06~ 전체 · 🔒 전진 ────────────────────────
  function perKey() { var ym = G.y + '-' + pad(G.m + 1); return G.per === 'month' ? ym : (G.per === 'year' ? String(G.y) : G.per); }
  function perName() { return G.per === 'month' ? G.y + '년 ' + (G.m + 1) + '월' : (G.per === 'year' ? G.y + '년' : (G.per === 'all' ? '2022-06~ 전체' : '🔒 전진(장 시작 전 봉인한 줄만)')); }
  function rankHTML() {
    var S = STAT()[perKey()], minN = MIN_N[G.per] || 10;
    var btn = function (v, t) { return '<button class="ms-btn' + (G.per === v ? ' active' : '') + '" onclick="gradePer(\'' + v + '\')" style="font-size:11px;padding:2px 10px">' + t + '</button>'; };
    var h = '<div style="display:flex;flex-wrap:wrap;align-items:center;gap:6px;margin-bottom:6px"><b style="color:#dce8ff;font-size:14px">📊 매매법 채점표 · ' + E(perName()) + '</b>'
      + btn('month', (G.m + 1) + '월') + btn('year', G.y + '년') + btn('all', '2022-06~ 전체') + btn('seal', '🔒 전진')
      + (G.sort === 'cal' ? '<span style="font-size:11px;color:#8487bd;margin-left:6px">순서 = 맨 위 버튼 순서(🌅 주도3안 → 📉 월간눌림 → 🎯 첫터치5 → 🏅 베스트 → 🏹 2060 → 🗣 검사관 → 📺 유튜브)</span>'
        : '<button class="today-btn" onclick="gradeSort(\'cal\')" style="font-size:11px;padding:2px 10px;margin-left:6px" title="맨 위 버튼 순서(🌅 주도3안 → 📉 월간눌림 → 🎯 첫터치5 → 🏅 베스트 → 🏹 2060 → 🗣 검사관 → 📺 유튜브) · 묶음 순서로 되돌림">↺ 버튼 순서로</button>') + '</div>';
    if (!S || !Object.keys(S.m || {}).length) {
      return h + '<div style="font-size:12px;color:#6f72a8;padding:6px 2px">' + (G.per === 'seal' ? '🔒 전진 장부에 아직 채점할 줄이 없다 = 평일 08:50 장 시작 전에 그날 명단을 봉인해 쌓는다(첫 봉인 10/8) · 쌓일수록 이 표가 진짜 성적이 된다' : '이 기간 채점 자료 없음') + '</div>';
    }
    var rows = Object.keys(S.m).map(function (i) {
      var a = S.m[i]; return {i: +i, n: a[0], T: a[1], S: a[2], H: a[3], avg: a[4], med: a[5], win: a[6], exm: a[7], exd: a[8], days: a[9], P: a[10], fin: a[11], hr: a[0] ? 100 * a[1] / a[0] : null, sr: a[0] ? 100 * a[2] / a[0] : null};
    }).filter(function (r) { return r.n || r.P; });
    var key = G.sort, dir = G.dir, cal = key === 'cal', RK = {};
    rows.filter(function (r) { return r.n >= minN && r.avg != null; }).sort(function (a, b) { return b.avg - a.avg || b.n - a.n; }).forEach(function (r, j) { RK[r.i] = j + 1; });   // 평균 순위 = 어떤 순서로 보든 같은 번호
    if (cal) rows.sort(function (a, b) { return a.i - b.i; });   // 맨 위 버튼 순서(🌅 주도3안 → 📉 월간눌림 → 🎯 첫터치5 → 🏅 베스트 → 🏹 2060 → 🗣 검사관 → 📺 유튜브) · 묶음 순서(매매법 번호)
    else rows.sort(function (a, b) {
      var ok = (b.n >= minN) - (a.n >= minN); if (ok) return ok;
      var A = a[key], B = b[key];
      if (A == null && B == null) return b.n - a.n;
      if (A == null) return 1;
      if (B == null) return -1;                                   // 빈 값은 늘 아래
      return (dir < 0 ? B - A : A - B) || b.n - a.n;
    });
    var th = function (k, t, tip) {
      var on = G.sort === k;
      return '<th onclick="gradeSort(\'' + k + '\')" title="' + E(tip || '누르면 이 칸으로 정렬(한 번 더 = 거꾸로)') + '" style="padding:5px 7px;border-bottom:1px solid #2a3150;color:' + (on ? '#ffd166' : '#8487bd') + ';white-space:nowrap;text-align:right;cursor:pointer;position:sticky;top:0;background:#12152a">' + t + (on ? (G.dir < 0 ? ' ▾' : ' ▴') : '') + '</th>';
    };
    var thl = function (t, tip) { return '<th' + (tip ? ' title="' + E(tip) + '"' : '') + ' style="padding:5px 7px;border-bottom:1px solid #2a3150;color:#8487bd;text-align:left;white-space:nowrap;position:sticky;top:0;background:#12152a">' + t + '</th>'; };
    var thc = '<th onclick="gradeSort(\'cal\')" title="누르면 맨 위 버튼 순서(🌅 주도3안 → 📉 월간눌림 → 🎯 첫터치5 → 🏅 베스트 → 🏹 2060 → 🗣 검사관 → 📺 유튜브) · 그 달력 묶음 순서(🏅 → 🅰 … ㊀ / 🏹1 → 🏹8)로" style="padding:5px 7px;border-bottom:1px solid #2a3150;color:' + (cal ? '#ffd166' : '#8487bd') + ';text-align:left;white-space:nowrap;cursor:pointer;position:sticky;top:0;background:#12152a">매매법' + (cal ? ' (버튼 순서) ▴' : '') + '</th>';
    var td = 'padding:4px 7px;border-bottom:1px solid #1e2a44;text-align:right;white-space:nowrap';
    h += '<div style="overflow:auto;max-height:620px;border:1px solid #232845;border-radius:8px"><table style="border-collapse:collapse;color:#e4e6ff;font-size:12px;width:100%;min-width:980px"><thead><tr>'
      + thl('평균 순위', '거래 ' + minN + '줄 이상 중 평균 높은 순(어떤 순서로 보든 같은 번호)') + thc + thl('0단계') + th('n', '거래', '같은 자로 값이 있는 줄(끝 + 진행 중)') + th('hr', '★ +20%', '+20% 닿은 줄(비율)') + th('sr', '✕ −10%', '−10% 손절된 줄(비율)')
      + th('avg', '평균', '비용 뺀 같은 자 평균(진행 중은 지금 평가)') + th('med', '중앙', '가운데 값 = 절반은 이보다 못함') + th('win', '이긴 %', '값 > 0 인 줄 비율') + th('exm', '시장 대비', '줄마다 (값 − 같은 날 시장) 평균')
      + th('exd', '대금10 대비', '줄마다 (값 − 같은 날 대금10) 평균 = 가장 쉬운 비교 대상보다 나은가') + th('H', '⏳ 진행 중', '20거래일이 안 지나 지금 평가인 줄') + th('days', '날', '명단이 있던 날 수') + '</tr></thead><tbody>';
    var bl = function (name, tip, avg, hit) {
      return '<tr style="background:rgba(126,232,255,.05)"><td style="' + td + ';text-align:left;color:#7ee8ff">기준</td><td style="' + td + ';text-align:left" title="' + E(tip) + '"><b style="color:#7ee8ff">📏 ' + name + '</b></td><td style="' + td + '"></td><td style="' + td + ';color:#6f72a8">' + (S.b[4] || 0) + '일</td>'
        + '<td style="' + td + ';color:#ffd166">' + (hit == null ? '—' : hit + '%') + '</td><td style="' + td + '"></td><td style="' + td + '">' + pct(avg, 2) + '</td><td style="' + td + '" colspan="6"><span style="color:#6f72a8;font-size:11px">같은 기간 하루 평균 · 매매법 행의 ‘대비’ 칸은 같은 날끼리 뺀 값</span></td></tr>';
    };
    if (S.b && S.b[4]) {
      h += bl('시장(전 종목)', '같은 날 캐시 전 종목을 같은 비중으로 같은 자(시가 진입)로 산 값', S.b[0], S.b[1]);
      h += bl('대금10(전날 거래대금 위 10)', '같은 날 전날 거래대금 위 10종목을 같은 자(시가 진입)로 산 값 = 가장 쉬운 비교 대상', S.b[2], S.b[3]);
    }
    var shown = (cal || G.all) ? rows : rows.slice(0, 15), lastG = null, gcnt = {};
    rows.forEach(function (r) { var g = grpOf(r.i); gcnt[g] = (gcnt[g] || 0) + 1; });
    shown.forEach(function (r) {
      var low = r.n < minN, m = meth(r.i), gk = grpOf(r.i);
      if (cal && gk !== lastG) { lastG = gk; h += grpRow(gk, gcnt[gk], 13); }
      h += '<tr style="' + (low ? 'opacity:.45' : '') + '" title="' + E(m[0] + ' ' + m[2] + (m[6] != null ? ' · 0단계 2022-06~ ' + m[6] + '건 평균 ' + m[7] + '% 중앙 ' + m[8] + '% · DSR ' + m[5] : '')) + '">'
        + '<td style="' + td + ';text-align:left;color:' + (RK[r.i] && RK[r.i] <= 3 ? '#ffd166' : '#8487bd') + '">' + (RK[r.i] || '-') + '</td>'
        + '<td style="' + td + ';text-align:left">' + mname(r.i, true) + '</td><td style="' + td + ';text-align:left">' + vtag(m[4], true) + shortBar(r.i) + '</td>'
        + '<td style="' + td + '">' + r.n.toLocaleString() + (r.P ? '<span style="color:#7ee8ff;font-size:10.5px"> +예정' + r.P + '</span>' : '') + '</td>'
        + '<td style="' + td + ';color:#ffd166">' + r.T + ' <span style="color:#a89060">(' + (r.hr == null ? '—' : r.hr.toFixed(0) + '%') + ')</span></td>'
        + '<td style="' + td + ';color:#7ea6ff">' + r.S + ' <span style="color:#5f7bb0">(' + (r.sr == null ? '—' : r.sr.toFixed(0) + '%') + ')</span></td>'
        + '<td style="' + td + '">' + pct(r.avg, 2) + '</td><td style="' + td + '">' + pct(r.med, 2) + '</td><td style="' + td + '">' + (r.win == null ? '—' : r.win.toFixed(0) + '%') + '</td>'
        + '<td style="' + td + '">' + pp(r.exm, 2) + '</td><td style="' + td + '">' + pp(r.exd, 2) + '</td>'
        + '<td style="' + td + ';color:#ffc454">' + (r.H || '') + '</td><td style="' + td + ';color:#8487bd">' + r.days + '</td></tr>';
    });
    h += '</tbody></table></div>';
    if (!cal && rows.length > 15) h += '<button class="today-btn" onclick="gradeAll()" style="margin-top:5px;font-size:11px">' + (G.all ? '15개만 보기' : '전체 ' + rows.length + '개 보기') + '</button>';
    h += '<span style="font-size:10.5px;color:#6f72a8;margin-left:8px">' + (cal ? '순서 = 맨 위 버튼 순서(🌅 주도3안 → 📉 월간눌림 → 🎯 첫터치5 → 🏅 베스트 → 🏹 2060 → 🗣 검사관 → 📺 유튜브) · 묶음 안은 그 달력 묶음 순서 · 거래·평균·대금10 대비 … 칸 머리를 누르면 그 칸 순서로' : '‘매매법’ 머리를 누르면 버튼 순서로') + ' · 평균 순위 = 거래 ' + minN + '줄 이상 중 평균 높은 순(미만은 흐림 · -) · 같은 자라서 매매법 자체 달력 숫자와 다를 수 있다(자체 규칙 = 조건부 매수 · 다른 청산) · 판정은 0단계(2022-06~ · 운 할인) 그대로</span>';
    return h;
  }

  // ── 날짜 창 = 그날 매매법별 표 + 종목별 결과 ─────────────────────────────
  function modal() {
    var ov = document.getElementById('grade-modal');
    if (!ov) {
      ov = document.createElement('div'); ov.id = 'grade-modal';
      ov.style.cssText = 'display:none;position:fixed;inset:0;background:rgba(0,0,0,.7);backdrop-filter:blur(3px);z-index:9990;align-items:center;justify-content:center;padding:24px';
      ov.innerHTML = '<div id="grade-modal-box" style="background:linear-gradient(180deg,rgba(26,24,12,.98),rgba(12,10,24,.98));border:1px solid rgba(255,209,102,.45);border-radius:16px;padding:20px 22px;max-width:1200px;width:100%;max-height:92vh;overflow:auto;color:#dce8ff;font-family:\'Noto Sans KR\',sans-serif"></div>';
      ov.onclick = function (e) { if (e.target === ov) ov.style.display = 'none'; };
      document.body.appendChild(ov);
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && ov.style.display === 'flex' && !(document.getElementById('stock-modal-overlay') || {}).offsetParent) ov.style.display = 'none'; });
    }
    return ov;
  }
  function chip(r, MD, k) {
    var c = r[1], n = MD.n[c] || c, st = r[3], v = r[4], m = meth(r[0]);
    var mark = st === 'T' ? '<b style="color:#ffd166">★</b>' : (st === 'S' ? '<span style="color:#7ea6ff">✕</span>' : (st === 'H' ? '<span style="color:#ffc454">⏳</span>' : ''));
    var val = (st === 'P') ? '<span style="color:#7ee8ff">예정</span>' : (st === 'X' ? '<span style="color:#6f72a8">가격 없음</span>' : pct(v, 1));
    var tip = n + ' (' + c + ') · ' + m[0] + ' · 진입 ' + (r[2] ? '그날 종가' : '그날 시가') + ' · ' + (STN[st] || st)
      + (r[6] != null && (st === 'T' || st === 'S' || st === 'E') ? ' · 끝난 날 D+' + r[6] : (st === 'H' ? ' · D+' + r[6] + ' 까지 봄' : ''))
      + (r[5] != null ? ' · 5일 종가 ' + (r[5] > 0 ? '+' : '') + r[5] + '%' : '') + ((r[8] || r[9] != null) ? ' · 자체: ' + (r[8] || '') + (r[9] != null ? ' ' + (r[9] > 0 ? '+' : '') + r[9] + '%' : '') : '')
      + (r[7] ? ' · 🔒 장 시작 전 봉인' : '') + ' · 누르면 종목 창';
    return '<span onclick="gradeStock(this,\'' + k + '\')" data-code="' + E(c) + '" data-name="' + E(n) + '" data-rate="0" data-amount="0" data-meta="📝 채점 ' + E(k) + ' ' + E(m[0]) + '" title="' + E(tip) + '" style="display:inline-block;background:#161c33;border:1px solid ' + (st === 'T' ? 'rgba(255,209,102,.55)' : 'rgba(255,255,255,.12)') + ';color:#dce8ff;border-radius:9px;padding:1px 7px;margin:2px;cursor:pointer;font-size:11.5px;white-space:nowrap">'
      + (r[7] ? '🔒' : '') + E(n) + ' ' + mark + val + '</span>';
  }
  // ── 🧮 이 날 모든 버튼 종목(2026-10-11 사용자 "채점 버튼 9월1일 클릭하면 … 기계가 걸러준 종목이 모두 · 월간눌림·첫터치5·2060·검사관 많이 언급된 종목 순서와 테마강도 순으로 맨위에 나열")
  //   센 것 = 이 날 📝 채점 줄(🌅 · 📉 · 🎯 · 🏅 · 🏹 · 🗣 · 📺 = 7버튼 모두 · 2026-10-11) + 채점 자료를 다시 만들기 전 날을 위한 원자료(📉 전날 깊은 눌림 처음 들어옴 🆕 · 🎯 그날 칸 · 🗣 그날 아침 토론 · 📺 전 거래일 09:00~그날 09:00 영상) = 채점 묶음과 같은 뜻이라 겹치면 1번
  //   ★2026-10-11 📉 뜻 바꿈 = '최근 20거래일 새 단계(①~⑤)' → '전날 종가로 깊은 눌림(-35~-55%)에 처음 들어옴(달력 칸 🆕)' = 📝 채점 📉 묶음과 같은 뜻(모든 언급에 채점이 붙게)
  //   날짜 규칙 = 🏅 베스트 겹침 v2(주도주\_천억장부\베스트겹침\규칙_v2.md 2·3장)와 같음 = 칸 날 아침 9시 전에 알 수 있던 것만
  //   언급 = 고른 기계·목록 수(🌅 묶음 · 🏅 기계(8·9 두 명단 = 1) · 🏹 판 · 🗣 검사관 명(최종5 = 표시만) · 📉 1 · 🎯 1 · 📺 1) · 버튼 = 7개 중 몇 곳
  //   테마강도 = _국면.종목(코드, _국면.하루전(칸)) = 그 종목 테마의 전날 국면(주도 1~10위 → 뜨는 1~10위 → 살아있음 → 죽음 → 국면 없음 → 섹터 없음 · 베스트 겹침 강한 섹터와 같음)
  //   관찰용 · 매수추천 아님 · 여러 곳이 같이 골랐다고 더 오른다는 증거는 아직 없음(베스트52 공통선택 시험)
  var ALL_BTN = [['j3', '🌅', '주도3안'], ['mn', '📉', '월간눌림'], ['f5', '🎯', '첫터치5'], ['be', '🏅', '베스트'], ['r6', '🏹', '2060'], ['ins', '🗣', '검사관'], ['yt', '📺', '유튜브']];   // 맨 위 버튼 순서
  var GRP_BTN = {'주도3안': 'j3', '월간눌림': 'mn', '첫터치5': 'f5', '2060': 'r6', '검사관': 'ins', '유튜브': 'yt'};   // 채점 묶음(매매법[11]) → 버튼
  var INS_SHORT = {'주도테마': '주도', '순환': '순환', '뉴스': '뉴스', '일정·정책': '일정', '학습': '학습', '수급': '수급', '차트 분석관': '차트', '눌림·종가': '눌림', '신고가': '신고', '시간외': '시간외', '대형주': '대형', '반등': '반등'}, INS_FULL = {};   // 장부_버튼더하기.py 와 같은 짧은 이름
  Object.keys(INS_SHORT).forEach(function (f) { INS_FULL[INS_SHORT[f]] = f; });
  var PH_ORD = {'주': 0, '급': 1, '살': 2, '죽': 3, '': 4}, MNL_WAIT = 0;
  function tdBackG(Ds, n) {   // Ds 앞 n 번째 거래일(평일 · 증시휴장_DATA 아님) = 베스트_겹침.js tdBack 과 같음
    var H = W.증시휴장_DATA || {}, p = Ds.split('-'), d = new Date(+p[0], +p[1] - 1, +p[2]), c = 0, s = Ds;
    var f = function (x) { var m = x.getMonth() + 1, dd = x.getDate(); return x.getFullYear() + '-' + (m < 10 ? '0' : '') + m + '-' + (dd < 10 ? '0' : '') + dd; };
    while (c < n) { d.setDate(d.getDate() - 1); s = f(d); var w = d.getDay(); if (w !== 0 && w !== 6 && !H[s]) c++; }
    return s;
  }
  function phaseOf(code, k) {
    var G2 = W._국면, X = +k.replace(/-/g, '');
    var basis = (G2 && typeof G2.하루전 === 'function') ? G2.하루전(X) : null;
    var p = (G2 && typeof G2.종목 === 'function' && basis != null) ? G2.종목(code, basis) : null;
    if (!p || !p.이름) return {th: null, c: '', rk: 0};
    return {th: String(p.이름), c: p.c || '', rk: p.rk || 0};
  }
  function phaseTxt(s) { return s.th === null ? '섹터 없음' : ({'주': '주도 ' + s.rk + '위', '급': '뜨는 ' + s.rk + '위', '살': '살아있음', '죽': '죽음'}[s.c] || '국면 없음'); }
  function phaseCol(c) { return {'주': '#ff8a8a', '급': '#ffd166', '살': '#9fd0ff', '죽': '#6f72a8'}[c] || '#8487bd'; }
  function allDay(k, L, MD, noPh, onlyRows) {   // onlyRows = 채점 줄만(📉🎯🗣📺 원자료 안 섞음 = 묶음 결산 · 2026-10-11)   // noPh = 국면을 안 셈(🗓 주간은 주 끝에 한 번만)
    var S = {}, pend = [], eco = W.ECO_INDEX && W.ECO_INDEX.stocks;
    var get = function (c, n) {
      c = String(c == null ? '' : c).trim().toUpperCase();
      if (!/^[0-9A-Z]{6}$/.test(c)) return null;
      var s = S[c] || (S[c] = {c: c, n: '', b: {}, cnt: 0, rs: [], f5: [], mn: '', mnTip: '', mnK: {}, ins5: false, yt: '', ytCh: {}});
      if (!s.n) s.n = n || (MD && MD.n[c]) || (eco && eco[c] && eco[c][0]) || '';
      return s;
    };
    var hit = function (s, btn, key, label) { var bb = s.b[btn] || (s.b[btn] = {}); if (bb[key]) return; bb[key] = label || key; s.cnt++; };   // 같은 버튼·같은 기계 = 1번
    var P = tdBackG(k, 1), CIR = ['', '①', '②', '③', '④', '⑤'];
    var MG = function (x) { return x >= 5 ? 3 : (x >= 3 ? 2 : (x >= 1 ? 1 : 0)); };   // 캘린더 _mnlG = 단계 ①~⑤ → 1 눌림 · 2 깊은 눌림 · 3 폭락
    (L || []).forEach(function (r) {   // 1) 📝 채점 줄 = 7버튼 모두(🌅 · 📉 · 🎯 · 🏅 · 🏹 · 🗣 · 📺 · 어사이드8·9 종가·8시 = 1기계 · 2026-10-11)
      var m = meth(r[0]), g = grpOf(r[0]), s = get(r[1], MD && MD.n[r[1]]), key = String(m[0]).replace(/\(.*\)$/, ''), bt = GRP_BTN[g] || 'be';
      if (!s) return;
      s.rs.push(r);
      if (bt === 'mn') {   // 📉 = 버튼 1번 · 자체상태 r[8] = 🆕③ -36.2%
        var q = /급등$/.test(key) ? '급' : '월';
        hit(s, 'mn', '📉', '📉');
        if (!s.mnK[q]) { s.mnK[q] = 1; s.mn = (s.mn ? s.mn + ' ' : '') + '📉' + q + String(r[8] || '').split(' ')[0]; s.mnTip = (s.mnTip ? s.mnTip + ' / ' : '') + key + ' ' + (r[8] || '') + ' · 전날 종가로 깊은 눌림(-35~-55%) 처음 들어옴 → 이 날 시가'; }
      } else if (bt === 'f5') {   // 🎯 = 버튼 1번 · 선은 표시
        hit(s, 'f5', '🎯', '🎯');
        var ln = +((/(\d+)선$/.exec(key) || [])[1] || 0);
        if (ln && s.f5.indexOf(ln) < 0) s.f5.push(ln);
      } else if (bt === 'ins') {   // 🗣 = 검사관마다 1번 · 최종5 = 표시만
        var sh = key.replace(/^검사관:/, '');
        if (sh === '최종5') s.ins5 = true; else hit(s, 'ins', sh, INS_FULL[sh] || sh);
      } else if (bt === 'yt') {   // 📺 = 버튼 1번 · 자체상태 r[8] = N채널 M편
        hit(s, 'yt', '📺', '📺');
        if (r[8]) s.yt = r[8];
      } else hit(s, bt, key, m[1] + ' ' + key);
    });
    [['월간눌림', '월', '테마 받은 날'], ['급등눌림', '급', '급등한 날']].forEach(function (q) {   // 2) 📉 원자료 = 전날(P) 종가로 깊은 눌림(-35~-55% · ③④)에 처음 들어온 종목(달력 칸 🆕 · 📝 채점 📉 묶음과 같은 뜻 · 채점 줄과 겹치면 1번)
      if (onlyRows) return;
      var A = W[q[0]];
      if (!A || !A.칸) { pend.push(q[0]); return; }
      (A.칸[P] || []).forEach(function (r) {
        if (!r || typeof r[2] !== 'number' || MG(r[2]) !== 2 || MG(r[3] || 0) === 2) return;
        var s = get(r[0], r[1]);
        if (!s) return;
        hit(s, 'mn', '📉', '📉');
        if (s.mnK[q[1]]) return;
        s.mnK[q[1]] = 1;
        s.mn = (s.mn ? s.mn + ' ' : '') + '📉' + q[1] + '🆕' + (CIR[r[2]] || r[2]);
        s.mnTip = (s.mnTip ? s.mnTip + ' / ' : '') + q[0] + ' ' + r[2] + '단계 · ' + q[2] + ' 대비 ' + r[7] + '% · ' + P.slice(5).replace('-', '/') + ' 종가로 깊은 눌림(-35~-55%) 처음 들어옴 → 이 날 시가';
      });
    });
    var F5 = onlyRows ? null : W.첫터치5_ARCHIVE, f5 = F5 && F5[k];   // 3) 🎯 원자료 = 그날 칸(매수일) · 선 20·60·120·240·480(📝 채점 🎯 묶음과 같은 뜻)
    if (f5) [20, 60, 120, 240, 480].forEach(function (Ln) {
      (f5['G' + Ln] || []).forEach(function (it) {
        var s = it && get(it.code, it.종목 || it.name);
        if (!s) return;
        hit(s, 'f5', '🎯', '🎯');
        if (s.f5.indexOf(Ln) < 0) s.f5.push(Ln);
      });
    });
    var INS = onlyRows ? null : W.검사관토론_ARCHIVE, iv = INS && INS[k];   // 4) 🗣 원자료 = 그날 아침 토론 · 검사관마다 1번(짧은 이름 = 채점 묶음과 같음) · 최종5 = 표시만
    if (iv) {
      (iv.inspectors || []).forEach(function (x) {
        var who = String(x.name || '').replace(' 검사관', ''), sh = INS_SHORT[who] || who;
        (x.picks || []).forEach(function (p) { var s = p && get(p.code, p.name); if (s) hit(s, 'ins', sh, who); });
      });
      (iv.final5 || []).forEach(function (p) { var s = p && get(p.code, p.name); if (s) s.ins5 = true; });
    }
    var YT = onlyRows ? null : W.YT_SUM, ytv = 0;   // 5) 📺 원자료 = 전 거래일 09:00 ~ 이 날 09:00 에 올라온 영상이 말한 종목(올린 뒤 첫 시가 = 이 날 · 📝 채점 📺 묶음과 같은 뜻)
    if (YT) {
      var t0 = Date.parse(P + 'T09:00:00+09:00'), t1 = Date.parse(k + 'T09:00:00+09:00');
      Object.keys(YT).forEach(function (d) {
        if (d < P || d > k) return;
        (YT[d] || []).forEach(function (v) {
          var t = Date.parse((v && v.uploaded) || (d + 'T18:00:00+09:00'));
          if (!(t >= t0 && t < t1)) return;
          ytv++;
          (v.stocks || []).forEach(function (g) {
            var nms = (g && g.names) || [];
            ((g && g.codes) || []).forEach(function (c, j) { var s = get(c, nms[j]); if (!s) return; hit(s, 'yt', '📺', '📺'); s.ytCh[v.channel || '?'] = 1; });
          });
        });
      });
    }
    var arr = Object.keys(S).map(function (c) { var s = S[c], ph = noPh ? {th: null, c: '', rk: 0} : phaseOf(c, k); if (s.ins5 && !s.b.ins) hit(s, 'ins', '최종5', '최종5'); s.code = c; s.th = ph.th; s.c = ph.c; s.rk = ph.rk; s.nb = Object.keys(s.b).length; return s; });   // s.code = 종목 코드 · s.c = 국면(주·급·살·죽 · phaseTxt·phaseCol 이 씀) · 2026-10-11 고침(전엔 코드가 국면으로 덮여 종목 창이 안 열렸음)
    return {list: arr, pend: pend, P: P, f5: !!f5, ins: !!iv, ytv: ytv};
  }
  function cmpAll(a, b) {
    return (b.cnt - a.cnt) || (b.nb - a.nb) || ((a.th === null ? 1 : 0) - (b.th === null ? 1 : 0)) || (PH_ORD[a.c] - PH_ORD[b.c]) || ((a.rk || 99) - (b.rk || 99)) || String(a.n || a.c).localeCompare(String(b.n || b.c));
  }
  function allRes(s) {
    if (!s.rs.length) return '<span style="color:#55597f" title="이 날 📝 채점 줄이 아직 없음 = 채점 자료를 다시 만들기 전(평일 08:50 · 21:30 장부 때 들어감) · 또는 그 종목 가격이 없음">채점 전</span>';
    var r = s.rs.filter(function (x) { return !x[2]; })[0] || s.rs[0], st = r[3];
    var mark = st === 'T' ? '<b style="color:#ffd166">★</b>' : (st === 'S' ? '<span style="color:#7ea6ff">✕</span>' : (st === 'H' ? '<span style="color:#ffc454">⏳</span>' : ''));
    return '<span title="' + E((STN[st] || st) + ' · 진입 ' + (r[2] ? '그날 종가' : '그날 시가') + (r[5] != null ? ' · 5일 종가 ' + (r[5] > 0 ? '+' : '') + r[5] + '%' : '')) + '">' + mark + (st === 'P' ? '<span style="color:#7ee8ff">예정</span>' : (st === 'X' ? '<span style="color:#6f72a8">가격 없음</span>' : pct(r[4], 1))) + '</span>';
  }
  function allBadges(s) {
    return ALL_BTN.map(function (bt) {
      var bb = s.b[bt[0]]; if (!bb) return '';
      var ks = Object.keys(bb), t, tip;
      if (bt[0] === 'mn') { t = s.mn; tip = s.mnTip; }
      else if (bt[0] === 'f5') { t = '🎯' + s.f5.slice().sort(function (x, y) { return x - y; }).join('·') + '선'; tip = '첫터치5 ' + s.f5.join('·') + '일선 첫 닿음(그날 칸)'; }
      else if (bt[0] === 'r6') { t = '🏹' + ks.map(function (x) { return x.replace('2060매매법', ''); }).join('·'); tip = ks.join(' · '); }
      else if (bt[0] === 'yt') { var chs = Object.keys(s.ytCh || {}); t = '📺' + (chs.length ? chs.length + '채널' : (s.yt || '')); tip = '유튜브 언급' + (s.yt ? ' ' + s.yt : '') + (chs.length ? ' · ' + chs.join(' · ') : '') + ' · 올린 뒤 첫 시가 = 이 날'; }
      else if (bt[0] === 'ins') { var kk = ks.filter(function (x) { return x !== '최종5'; }); t = '🗣' + kk.length + (s.ins5 ? '·최종5' : ''); tip = '검사관 ' + kk.length + '명: ' + kk.map(function (x) { return bb[x]; }).join(' · ') + (s.ins5 ? ' · 최종5에 듦(표시만 · 따로 안 셈)' : ''); }
      else { t = bt[1] + ks.length; tip = bt[2] + ' ' + ks.length + '개: ' + ks.map(function (x) { return bb[x]; }).join(' · '); }
      return '<span title="' + E(tip) + '" style="display:inline-block;background:#1a2340;border-radius:8px;padding:0 6px;margin:1px 3px 1px 0;font-size:11px;color:#dce8ff;white-space:nowrap">' + E(t) + '</span>';
    }).join('');
  }
  function allChip(s, k, faint) {
    return '<span onclick="gradeStock(this,\'' + k + '\')" data-code="' + E(s.code) + '" data-name="' + E(s.n || s.code) + '" data-rate="0" data-amount="0" data-meta="📝 채점 ' + E(k) + ' 🧮 모든 버튼" title="' + E((s.n || s.code) + ' (' + s.code + ') · 언급 ' + s.cnt + '곳 · 버튼 ' + s.nb + ' · ' + (s.th || '섹터 없음') + ' ' + phaseTxt(s) + ' · 누르면 종목 창') + '" style="display:inline-block;cursor:pointer;background:#161c33;border:1px solid rgba(126,232,255,' + (faint ? '.12' : '.35') + ');border-radius:9px;padding:1px 7px;margin:1px 3px 1px 0;font-size:12px;color:' + (faint ? '#8487bd' : '#fff') + '">' + E(s.n || s.code) + ' <b style="color:#7ee8ff">' + s.cnt + '</b></span>';
  }
  function allMnlLoad() {   // 📉 월간눌림·급등눌림 = 처음 한 번 받음(캘린더 _mnlLoad · 베스트 겹침과 같은 방법) → 다 받으면 이 칸만 다시 그림
    if (MNL_WAIT || typeof W._mnlLoad !== 'function') return;
    var need = [['월간눌림', '월간'], ['급등눌림', '급등']].filter(function (q) { return !(W[q[0]] && W[q[0]].칸); });
    if (!need.length) return;
    MNL_WAIT = need.length;
    need.forEach(function (q) { try { W._mnlLoad(function () { MNL_WAIT = Math.max(0, MNL_WAIT - 1); if (!MNL_WAIT) allRedraw(); }, true, q[1]); } catch (e) { MNL_WAIT = 0; console.warn('📝 채점 🧮 월간눌림 받기 실패', e); } });
  }
  function allRedraw() {
    var k = G.sel, el = document.getElementById('grade-all'); if (!k || !el) return;
    var MD = MON(k.slice(0, 7));
    try { el.outerHTML = allDayHTML(k, (MD && MD.d[k]) || [], MD); } catch (e) { console.warn('📝 채점 🧮 다시 그리기 실패', e); }
  }
  function allDayHTML(k, L, MD) {
    var R = allDay(k, L, MD), A = R.list, ord = G.allOrd || 'cnt', more = !!G.allMore;
    if (R.pend.length) allMnlLoad();
    A.sort(cmpAll);
    var n2 = A.filter(function (s) { return s.cnt >= 2; }).length, mx = A.length ? A[0].cnt : 0, bc = {};
    ALL_BTN.forEach(function (bt) { bc[bt[0]] = 0; });
    A.forEach(function (s) { Object.keys(s.b).forEach(function (b) { bc[b]++; }); });
    var tab = function (v, t) { return '<button class="ms-btn' + (ord === v ? ' active' : '') + '" onclick="gradeAllOrd(\'' + v + '\')" style="font-size:11px;padding:2px 10px;margin-left:4px">' + t + '</button>'; };
    var h = '<div id="grade-all" style="margin:12px 0 6px;padding:10px 12px;border:1px solid rgba(126,232,255,.35);border-radius:12px;background:rgba(126,232,255,.04)">'
      + '<div style="font-size:14px;font-weight:700;color:#7ee8ff">🧮 이 날 모든 버튼 종목 ' + A.length + '개 <span style="font-size:12px;font-weight:400;color:#c9cbe8">· 2곳 이상 언급 ' + n2 + ' · 최다 ' + mx + '곳</span>'
      + tab('cnt', '많이 언급된 순') + tab('th', '테마강도 순') + '<button class="today-btn" onclick="gradeWeek(\'' + satOf(k) + '\')" style="font-size:11px;padding:2px 10px;margin-left:8px" title="이 날이 든 주(월~금) 많이 나온 종목 + 테마">📅 이 주 결산</button><button class="today-btn" onclick="gradeMonth(\'' + k.slice(0, 7) + '\')" style="font-size:11px;padding:2px 10px;margin-left:4px" title="이 날이 든 달 많이 나온 종목 + 테마">📆 이 달 결산</button></div>'
      + '<div style="font-size:11px;color:#8487bd;margin-top:3px;line-height:1.6">센 곳(맨 위 버튼 순서 · 종목 수) = 🌅 주도3안 ' + bc.j3 + ' · 📉 월간눌림 ' + bc.mn + '(' + E(R.P.slice(5)) + ' 종가로 깊은 눌림 -35~-55% 처음 들어옴 🆕 · 월간·급등) · 🎯 첫터치5 ' + bc.f5 + (R.f5 ? '' : '(이 날 칸 없음)') + ' · 🏅 베스트 ' + bc.be + ' · 🏹 2060 ' + bc.r6 + ' · 🗣 검사관 ' + bc.ins + (R.ins ? '' : '(이 날 토론 없음 · 2026-08-04부터)') + ' · 📺 유튜브 ' + bc.yt + '(' + E(R.P.slice(5)) + ' 09:00 ~ 이 날 09:00 에 올라온 영상 ' + R.ytv + '편)'
      + ' · 언급 = 고른 기계·목록 수(🌅 묶음 · 🏅 기계 · 🏹 판 · 🗣 검사관 명(최종5는 표시만) · 📉 1 · 🎯 1 · 📺 1) · 테마강도 = 그 종목 테마의 전날 국면(주도 1~10위 → 뜨는 → 살아있음 → 죽음) · 칸 날 아침 9시 전 자료만 · 채점 = 같은 자(+20% / −10% / 20거래일 · 7버튼 모두 📝 채점 줄 · 2026-10-11)'
      + (R.pend.length ? ' · <b style="color:#ffc454">📉 ' + E(R.pend.join('·')) + ' 자료 받는 중(다 받으면 저절로 다시 그림)</b>' : '')
      + ' · 관찰용 · 매수추천 아님 · 여러 곳이 같이 골랐다고 더 오른다는 증거는 아직 없음</div>';
    var n1 = A.length - n2;
    if (ord === 'cnt') {
      var show = more ? A : A.filter(function (s) { return s.cnt >= 2; });
      var td = 'padding:3px 7px;border-bottom:1px solid #1e2a44;vertical-align:top;white-space:nowrap';
      h += '<div style="overflow:auto;max-height:430px;margin-top:6px"><table style="border-collapse:collapse;color:#e4e6ff;font-size:12px;width:100%"><tr>'
        + ['#', '종목', '언급', '어디서(버튼·기계)', '테마 · 강도(전날 국면)', '채점(같은 자)'].map(function (t) { return '<th style="padding:4px 7px;border-bottom:1px solid #2a3150;color:#8487bd;text-align:left;white-space:nowrap;position:sticky;top:0;background:#12152a">' + t + '</th>'; }).join('') + '</tr>';
      show.forEach(function (s, i) {
        h += '<tr><td style="' + td + ';color:#8487bd">' + (i + 1) + '</td><td style="' + td + '">' + allChip(s, k, s.cnt < 2) + '</td>'
          + '<td style="' + td + '"><b style="color:#7ee8ff">' + s.cnt + '곳</b> <span style="color:#8487bd;font-size:11px">버튼 ' + s.nb + '</span></td>'
          + '<td style="padding:3px 7px;border-bottom:1px solid #1e2a44;white-space:normal">' + allBadges(s) + '</td>'
          + '<td style="' + td + '">' + E(s.th || '—') + ' <span style="color:' + phaseCol(s.c) + ';font-size:11px">' + E(phaseTxt(s)) + '</span></td><td style="' + td + '">' + allRes(s) + '</td></tr>';
      });
      h += '</table></div>' + (n1 ? '<div style="margin-top:5px;font-size:11.5px;color:#8487bd">1곳만 언급 ' + n1 + '종목 <button class="today-btn" onclick="gradeAllMore()" style="font-size:11px;padding:1px 9px;margin-left:4px">' + (more ? '접기' : '더 보기') + '</button></div>' : '');
    } else {
      var GS = {}, gs = [];
      A.forEach(function (s) {
        var key = s.th === null ? '섹터 없음' : s.th, g = GS[key];
        if (!g) { g = GS[key] = {key: key, th: s.th, c: s.c, rk: s.rk, n: 0, votes: 0, multi: 0, list: []}; gs.push(g); }
        g.n++; g.votes += s.cnt; if (s.cnt >= 2) g.multi++; g.list.push(s);
      });
      gs.sort(function (a, b) { return ((a.th === null ? 1 : 0) - (b.th === null ? 1 : 0)) || (PH_ORD[a.c] - PH_ORD[b.c]) || ((a.rk || 99) - (b.rk || 99)) || (b.votes - a.votes) || (b.n - a.n) || String(a.key).localeCompare(String(b.key)); });
      var strong = gs.filter(function (g) { return g.c === '주' || g.c === '급'; }), rest = gs.filter(function (g) { return !(g.c === '주' || g.c === '급'); });
      var grp = function (g) {
        var sh = more ? g.list : g.list.filter(function (s) { return s.cnt >= 2; }), hid = g.list.length - sh.length;
        return '<div style="margin-top:6px;font-size:12px;line-height:1.75"><b style="color:' + phaseCol(g.c) + '">' + E(phaseTxt(g)) + '</b> <b style="color:#fff">' + E(g.key) + '</b> <span style="color:#8487bd;font-size:11px">' + g.n + '종목 · 언급 합 ' + g.votes + (g.multi ? ' · 2곳 이상 ' + g.multi : '') + '</span><br>'
          + sh.map(function (s) { return allChip(s, k, s.cnt < 2); }).join('') + (hid ? '<span style="color:#6f72a8;font-size:11px"> +' + hid + '종목(1곳만)</span>' : '') + '</div>';
      };
      h += '<div style="max-height:430px;overflow:auto;margin-top:4px">' + strong.map(grp).join('')
        + (rest.length ? (more ? rest.map(grp).join('') : '<div style="margin-top:6px;font-size:11.5px;color:#8487bd">살아있음·죽음·국면 없음·섹터 없음 ' + rest.length + '묶음(' + rest.reduce(function (t, g) { return t + g.n; }, 0) + '종목)</div>') : '')
        + '</div><div style="margin-top:5px;font-size:11.5px;color:#8487bd">주도·뜨는 테마는 바로 · 그 밖과 1곳만 언급 종목은 <button class="today-btn" onclick="gradeAllMore()" style="font-size:11px;padding:1px 9px;margin-left:2px">' + (more ? '접기' : '더 보기') + '</button> · 숫자 = 언급 수</div>';
    }
    return h + '</div>';
  }
  function dayModal(k, MD) {
    var L = (MD && MD.d[k]) || [], D = DAYS()[k] || [];
    if (!L.length) return;
    var by = {}, ord = [];
    L.forEach(function (r) { if (!by[r[0]]) { by[r[0]] = []; ord.push(r[0]); } by[r[0]].push(r); });
    var bo = num(D[8]), bdo = num(D[9]), bc = num(D[15]), bdc = num(D[16]);
    var per = ord.map(function (i) {
      var R = by[i], s = {i: i, R: R, n: R.length, nv: 0, T: 0, S: 0, H: 0, P: 0, sum: 0, se: 0, ne: 0, seal: 0};
      R.forEach(function (r) {
        if (r[7]) s.seal++;
        if (r[3] === 'P') { s.P++; return; } if (r[3] === 'X' || r[4] == null) return;
        s.nv++; s.sum += r[4]; if (r[3] === 'T') s.T++; if (r[3] === 'S') s.S++; if (r[3] === 'H') s.H++;
        var b = r[2] ? bdc : bdo; if (b != null) { s.se += r[4] - b; s.ne++; }
      });
      s.avg = s.nv ? s.sum / s.nv : null; s.exd = s.ne ? s.se / s.ne : null;
      return s;
    });
    if (G.ord === 'cal') per.sort(function (a, b) { return a.i - b.i; });   // 맨 위 버튼 순서(🌅 주도3안 → 📉 월간눌림 → 🎯 첫터치5 → 🏅 베스트 → 🏹 2060 → 🗣 검사관 → 📺 유튜브) · 묶음 순서
    else per.sort(function (a, b) { return (b.avg == null ? -1e9 : b.avg) - (a.avg == null ? -1e9 : a.avg) || b.n - a.n; });
    var gcnt = {}; per.forEach(function (s) { var g = grpOf(s.i); gcnt[g] = (gcnt[g] || 0) + 1; });
    var ordBtn = function (v, t) { return '<button class="ms-btn' + (G.ord === v ? ' active' : '') + '" onclick="gradeOrd(\'' + v + '\')" style="font-size:11px;padding:2px 10px;margin-left:4px">' + t + '</button>'; };
    var hits = dayHits(k) || [];
    var ov = modal(), box = document.getElementById('grade-modal-box');
    var h = '<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px"><div>'
      + '<div style="font-size:18px;font-weight:800;color:#fff">📝 ' + E(k) + ' 채점 · 매매법 ' + per.length + '개(' + GRPS.filter(function (g) { return gcnt[g.k]; }).map(function (g) { return g.name.split(' ')[0] + ' ' + gcnt[g.k]; }).join(' · ') + ') · 명단 ' + L.length + '줄 · <span style="color:#ffd166">★ ' + (D[3] || 0) + '</span> · <span style="color:#7ea6ff">✕ ' + (D[4] || 0) + '</span> · 평균 ' + pct(D[7], 2)
      + (D[5] ? ' · <span style="color:#ffc454">⏳ ' + D[5] + '</span>' : '') + (D[6] ? ' · <span style="color:#7ee8ff">예정 ' + D[6] + '</span>' : '') + (D[12] ? ' · 🔒 ' + D[12] : '') + '</div>'
      + '<div style="font-size:12px;color:#c9cbe8;margin-top:5px">기준선(같은 날 · 같은 자 · 시가 진입) = 📏 시장 ' + pct(bo, 2) + ' <span style="color:#8487bd">(+20% 닿음 ' + (D[10] == null ? '—' : D[10] + '%') + ')</span> · 📏 대금10 ' + pct(bdo, 2) + ' <span style="color:#8487bd">(+20% ' + (D[11] == null ? '—' : D[11] + '%') + ')</span>'
      + ' · 이 날 줄 평균의 대금10 대비 ' + pp(D[13], 2) + '</div>'
      + '<div style="font-size:11.5px;color:#8487bd;margin-top:3px">칸 날짜 = 매수일 · 같은 자 = 시가(또는 그날 종가) 매수 → +20% 익절 / −10% 손절 / 20거래일 · 비용 0.35%p' + (D[5] ? ' · ⏳ = 20거래일이 안 지나 지금 평가' : '') + ' · 종목에 마우스 = 자체 규칙 결과 · 관찰용 · 매수추천 아님</div></div>'
      + '<button onclick="document.getElementById(\'grade-modal\').style.display=\'none\'" style="background:transparent;border:1px solid rgba(255,255,255,.2);color:#dce8ff;border-radius:8px;padding:4px 10px;cursor:pointer">✕</button></div>';
    try { h += allDayHTML(k, L, MD); } catch (e) { console.warn('📝 채점 🧮 모든 버튼 종목 실패', e); }   // 🧮 맨 위 = 모든 버튼 종목(많이 언급된 순 · 테마강도 순 · 2026-10-11)
    h += brainDayHTML(k);   // 🧠 추천주5 그날 5종목
    if (hits.length) {
      h += '<div style="margin:12px 0 4px;font-size:12.5px;color:#ffd166">★ +20% 닿은 종목 ' + hits.length + '개 <span style="color:#8487bd;font-size:11px">(뒤 글자 = 그 종목을 고른 매매법 · 여러 개 = 같이 고름)</span></div><div>'
        + hits.map(function (x) {
          return '<span onclick="gradeStock(this,\'' + k + '\')" data-code="' + E(x.c) + '" data-name="' + E(x.n) + '" data-rate="0" data-amount="0" data-meta="📝 채점 ' + E(k) + '" title="' + E(x.n + ' · ' + x.ms.map(function (i) { return meth(i)[0]; }).join(', ')) + '" style="display:inline-block;background:#1d1a10;border:1px solid rgba(255,209,102,.5);color:#ffe9a8;border-radius:9px;padding:1px 8px;margin:2px;cursor:pointer;font-size:12px">★ ' + E(x.n) + ' '
            + x.ms.map(function (i) { var m = meth(i); return '<span style="color:' + m[3] + '">' + E(m[1]) + '</span>'; }).join('') + '</span>';
        }).join('') + '</div>';
    }
    var tdh = 'padding:5px 8px;border-bottom:1px solid #3a3420;color:#8487bd;text-align:left;white-space:nowrap';
    var tdc = 'padding:4px 8px;border-bottom:1px solid #1e2a44;vertical-align:top;white-space:nowrap';
    h += '<div style="margin-top:12px;font-size:11.5px;color:#8487bd">매매법 순서' + ordBtn('cal', '맨 위 버튼 순서(🌅 주도3안 → 📉 월간눌림 → 🎯 첫터치5 → 🏅 베스트 → 🏹 2060 → 🗣 검사관 → 📺 유튜브)') + ordBtn('avg', '이 날 평균 높은 순') + '</div>';
    h += '<div style="overflow-x:auto;margin-top:6px"><table style="border-collapse:collapse;color:#e4e6ff;font-size:12px;width:100%"><tr>'
      + ['매매법', '0단계', '명단', '★', '✕', '평균', '대금10 대비', '종목별 결과(같은 자)'].map(function (t) { return '<th style="' + tdh + '">' + t + '</th>'; }).join('') + '</tr>';
    var lastG = null;
    per.forEach(function (s) {
      var m = meth(s.i), gk = grpOf(s.i);
      if (G.ord === 'cal' && gk !== lastG) { lastG = gk; h += grpRow(gk, gcnt[gk], 8); }
      h += '<tr><td style="' + tdc + '">' + mname(s.i, false) + '<br><span style="color:#8487bd;font-size:11px">' + E(m[2]) + '</span></td>'
        + '<td style="' + tdc + '">' + vtag(m[4], true) + shortBar(s.i) + '</td><td style="' + tdc + '">' + s.n + (s.P ? '<br><span style="color:#7ee8ff;font-size:10.5px">예정 ' + s.P + '</span>' : '') + '</td>'
        + '<td style="' + tdc + ';color:#ffd166">' + (s.T || '') + '</td><td style="' + tdc + ';color:#7ea6ff">' + (s.S || '') + '</td>'
        + '<td style="' + tdc + '">' + pct(s.avg, 2) + (s.H ? '<br><span style="color:#ffc454;font-size:10.5px">⏳' + s.H + '</span>' : '') + '</td><td style="' + tdc + '">' + pp(s.exd, 2) + '</td>'
        + '<td style="padding:4px 8px;border-bottom:1px solid #1e2a44;white-space:normal">' + s.R.map(function (r) { return chip(r, MD, k); }).join('') + '</td></tr>';
    });
    h += '</table></div><div style="font-size:10.5px;color:#6a82a8;margin-top:8px;line-height:1.6">★ +20% 닿음(끝) · ✕ −10% 손절(끝) · 표시 없음 = 20거래일 만기 종가 · ⏳ 진행 중(지금 평가) · 🔒 = 장 시작 전 봉인한 전진 장부 줄 · 대금10 대비 = 줄마다 (값 − 같은 날 대금10) 평균 · 매매법 순서 = ' + (G.ord === 'cal' ? '맨 위 버튼 순서(🌅 주도3안 → 📉 월간눌림 → 🎯 첫터치5 → 🏅 베스트 → 🏹 2060 → 🗣 검사관 → 📺 유튜브) · 묶음 안은 그 달력 묶음 순서' : '이 날 평균 높은 순') + ' · 관찰용 · 매수추천 아님</div>';
    box.innerHTML = h; ov.style.display = 'flex'; box.scrollTop = 0;
  }

  // ── 📅 주간 · 📆 월간 결산(2026-10-11 사용자 "달력에 주 버튼을 주마다 만들어서 한주에 가장 많이 나오고 테마도 넣고" → "동그라미 버튼으로" → "버튼을 이렇게 작게 만들어. 주간, 월간 만들어") ─────
  //   자리 = 본 달력 결산 단추와 같은 규약(cell-bubble-btn = 18px 동그라미 · 칸 오른쪽 위) = 토요일 칸 📅 그 주 월~금 / 그 달 첫 일요일 칸 📆 그 달
  //   마지막 주는 다음 달 토요일 칸까지 채워 그 주 📅 를 단다 · 칸을 그릴 때는 집계 안 함(누를 때 계산 · 앞·뒤 달 파일도 누를 때 받음)
  //   언급 = 그 기간 매일 🧮(이 날 모든 버튼 종목) 언급 수의 합(같은 날 같은 기계 = 1 · 🌅 묶음 · 🏅 기계 · 🏹 판 · 🗣 검사관 명 · 📉 · 🎯 · 📺 각 1) · 나온 날 = 그 기간에 고른 날 수
  //   테마 = 그 기간 마지막 거래일의 전날 국면(_국면.종목 · 🧮 와 같음) · 많이 나온 테마 = 그 테마 종목들의 언급 합 순(섹터 없음은 맨 뒤)
  //   채점 = 그 기간에 처음 고른 날의 같은 자 결과(그날 시가 · +20% / −10% / 20거래일) · 새 자료 파일 없음 · 관찰용 · 매수추천 아님
  var PK_C = {}, WD = ['월', '화', '수', '목', '금'], WD7 = ['일', '월', '화', '수', '목', '금', '토'];
  function ymd(x) { return x.getFullYear() + '-' + pad(x.getMonth() + 1) + '-' + pad(x.getDate()); }
  function weekDays(sat) { var p = sat.split('-'), d = new Date(+p[0], +p[1] - 1, +p[2]), out = []; for (var i = 5; i >= 1; i--) { var x = new Date(+p[0], +p[1] - 1, +p[2]); x.setDate(d.getDate() - i); out.push(ymd(x)); } return out; }
  function monthDays(ym) { var y = +ym.slice(0, 4), m = +ym.slice(5, 7), n = new Date(y, m, 0).getDate(), out = []; for (var i = 1; i <= n; i++) out.push(ym + '-' + pad(i)); return out; }
  function satOf(k) { var p = k.split('-'), d = new Date(+p[0], +p[1] - 1, +p[2]); d.setDate(d.getDate() + (6 - d.getDay())); return ymd(d); }
  function isWkday(k) { var p = k.split('-'), w = new Date(+p[0], +p[1] - 1, +p[2]).getDay(); return w >= 1 && w <= 5; }
  function md(k) { return (+k.slice(5, 7)) + '/' + (+k.slice(8, 10)); }
  function wdl(k) { var p = k.split('-'); return WD7[new Date(+p[0], +p[1] - 1, +p[2]).getDay()] || ''; }   // 평일은 예전과 같음 · 📺 주간(일~토)이라 토 · 일도
  var FLT_DI = {j3: 19, mn: 20, f5: 21, be: 17, r6: 18, ins: 22, yt: 23, mnw: 20, mng: 20, ytu: 23}, FLT_NM = {r6: '🏹 2060', f5: '🎯 첫터치5', mnw: '📉 월간눌림', mng: '📈 급등눌림', be: '🏅 베스트', ytu: '📺 유튜브', j3: '🌅 주도3안'}, DAYOPEN = {r6: 'openR2060Detail', f5: 'openFt5Detail', mnw: 'openMnlDeep', mng: 'openMnlDeep', be: 'openBestDetail', ytu: 'ytPick', j3: 'js3Pick'}, SHIFT = {mnw: 1, mng: 1};   // mnw · mng = 📉 월간눌림 달력(월간 · 급등 분류 · 2026-10-11) · SHIFT = 그 달력 칸 = 신호일(그 날 종가)이라 채점 줄은 다음 거래일(매수일)에서 읽음   // DAYOPEN = 묶음 결산 창의 날짜 단추가 여는 그 달력 상세 창   // 결산을 한 버튼 묶음만 = pk 뒤 '|r6' 등(예: 'W2026-10-03|r6' = 🏹 2060 달력 📅) · 값 = DAY 칸 번호(그 묶음 매매법 수)
  function pBase(pk) { return pk.split('|')[0]; }
  function pFlt(pk) { return pk.split('|')[1] || ''; }
  function pDays(pk) { var b = pBase(pk); return b.charAt(0) === 'M' ? monthDays(b.slice(1)) : (pFlt(pk) === 'ytu' ? weekDays7(b.slice(1)) : weekDays(b.slice(1))); }
  function pHas(k, flt) { var D = DAYS()[k]; return !!(D && (!flt || D[FLT_DI[flt]])); }
  function tdNextG(Ds) {   // Ds 다음 거래일(평일 · 증시휴장_DATA 아님) = tdBackG 거꾸로
    var H = W.증시휴장_DATA || {}, p = Ds.split('-'), d = new Date(+p[0], +p[1] - 1, +p[2]);
    for (var i = 0; i < 30; i++) { d.setDate(d.getDate() + 1); var x = ymd(d), w = d.getDay(); if (w !== 0 && w !== 6 && !H[x]) return x; }
    return Ds;
  }
  function isTdG(k) { var H = W.증시휴장_DATA || {}; return isWkday(k) && !H[k]; }   // 거래일인가(날짜 창 = 휴장 · 아직 · 없음 구분)
  function kbOf(k, flt) { return SHIFT[flt] ? tdNextG(k) : k; }   // 칸 날짜 → 채점 줄 날짜(📉 = 신호일 다음 거래일 시가)
  function pHasS(k, flt) { return pHas(kbOf(k, flt), flt); }
  function fltRow(r, flt) {   // 채점 줄이 그 묶음인가(📉 mnw · mng = 월간 · 급등 분류까지)
    var g = grpOf(r[0]);
    if (flt === 'mnw' || flt === 'mng') return g === '월간눌림' && (/급등$/.test(String(meth(r[0])[0]).replace(/\(.*\)$/, '')) === (flt === 'mng'));
    return (GRP_BTN[g] || 'be') === flt;
  }
  // ── 📺 유튜브 묶음 창(ytu · 2026-10-11) = 달력 칸 = 올린 날(한국시간 · 주말 포함) → 일~토 한 주 · 채점 줄 = 올린 뒤 첫 시가 날(장부_버튼더하기.py 와 같음)
  function ytData() { return W.YT_SUM || {}; }
  function ytShort(c) { return String(c || '').replace(' 관심종목 TV', '').replace(' 김동석의 리얼주식', '').replace('의 주식전략실', '').replace('상한가추월차선', '상추').replace('캠퍼스', '').replace(' 주식', '').replace('주식', ''); }   // 유튜브_뷰.js SHORT 와 같음
  function ytCodes(v) { var o = []; ((v && v.stocks) || []).forEach(function (g) { var nms = (g && g.names) || []; ((g && g.codes) || []).forEach(function (c, j) { c = String(c == null ? '' : c).trim().toUpperCase(); if (/^[0-9A-Z]{6}$/.test(c)) o.push([c, nms[j] || '']); }); }); return o; }
  function ytHas(k) { return (ytData()[k] || []).some(function (v) { return ytCodes(v).length > 0; }); }   // 그날 국내 종목을 말한 영상이 있나
  function ytBuy(v, k) { var t = Date.parse((v && v.uploaded) || (k + 'T18:00:00+09:00')); return (isTdG(k) && t < Date.parse(k + 'T09:00:00+09:00')) ? k : tdNextG(k); }   // 올린 뒤 첫 시가 날 = 09:00 전 올리면 그날 · 아니면 다음 거래일
  function ytEnd() { var ks = Object.keys(ytData()).sort(); return ks.length ? ks[ks.length - 1] : ''; }
  function weekDays7(sat) { var p = sat.split('-'), out = []; for (var i = 6; i >= 0; i--) { var x = new Date(+p[0], +p[1] - 1, +p[2]); x.setDate(x.getDate() - i); out.push(ymd(x)); } return out; }   // 일~토(📺 = 주말에도 영상)
  function ytBuyMonths(days) { var ms = []; days.forEach(function (k) { (ytData()[k] || []).forEach(function (v) { if (!ytCodes(v).length) return; var m2 = ytBuy(v, k).slice(0, 7); if (ms.indexOf(m2) < 0) ms.push(m2); }); }); return ms; }
  function ytAgg(pk) {
    var M = META() || {}, Y = ytData(), all = pDays(pk), tds = all.filter(ytHas);
    var miss = ytBuyMonths(tds).filter(function (m2) { return !MON(m2); });
    var ck = (M.만든때 || '') + '|' + miss.join(',') + '|' + (W._국면 ? 1 : 0) + '|' + Object.keys(Y).length;
    if (PK_C[pk] && PK_C[pk].ck === ck) return PK_C[pk];
    var S = {}, last = '', nv = 0;
    tds.forEach(function (k) {
      var day = {};   // 그날 종목 → {n 이름, ch 채널(짧은 이름), b 가장 이른 매수일}
      (Y[k] || []).slice().sort(function (a, b) { return String(a.uploaded || '').localeCompare(String(b.uploaded || '')); }).forEach(function (v) {
        var cs = ytCodes(v); if (!cs.length) return;
        nv++;
        var b = ytBuy(v, k), ch = ytShort(v.channel || '?');
        cs.forEach(function (x) { var o = day[x[0]] || (day[x[0]] = {n: x[1], ch: {}, b: b}); if (!o.n && x[1]) o.n = x[1]; o.ch[ch] = 1; if (b < o.b) o.b = b; });
      });
      last = k;
      Object.keys(day).forEach(function (c) {
        var o = day[c], MD = MON(o.b.slice(0, 7));
        var rs = MD ? ((MD.d && MD.d[o.b]) || []).filter(function (r) { return r[1] === c && grpOf(r[0]) === '유튜브'; }) : [];
        var w = S[c] || (S[c] = {code: c, n: '', cnt: 0, days: [], b: {}, ds: [], first: null, mk: {}});
        if (!w.n) w.n = o.n || (MD && MD.n[c]) || '';
        var chs = Object.keys(o.ch), sd = {rs: rs, b: {yt: o.ch}, cnt: chs.length, kb: o.b};
        w.cnt += chs.length; w.days.push(k); w.ds.push({k: k, s: sd});
        w.b.yt = (w.b.yt || 0) + chs.length;
        chs.forEach(function (x) { w.mk[x] = (w.mk[x] || 0) + 1; });   // 판 = 채널 · 값 = 그 채널이 말한 날 수
        if (!w.first && rs.length) w.first = {k: k, s: sd};
      });
    });
    var lastB = last ? tdNextG(last) : '';   // 테마 = 마지막 올린 날까지의 마지막 거래일 종가 국면(phaseOf = 하루 전)
    var list = Object.keys(S).map(function (cd) { var w = S[cd], ph = last ? phaseOf(cd, lastB) : {th: null, c: '', rk: 0}; w.th = ph.th; w.c = ph.c; w.rk = ph.rk; w.nd = w.days.length; w.nb = Object.keys(w.b).length; return w; });
    list.sort(function (a, b) { return (b.cnt - a.cnt) || (b.nd - a.nd) || (b.nb - a.nb) || ((a.th === null ? 1 : 0) - (b.th === null ? 1 : 0)) || (PH_ORD[a.c] - PH_ORD[b.c]) || ((a.rk || 99) - (b.rk || 99)) || String(a.n || a.code).localeCompare(String(b.n || b.code)); });
    var TH = {}, themes = [];
    list.forEach(function (w) {
      var key = w.th === null ? '섹터 없음' : w.th, t = TH[key];
      if (!t) { t = TH[key] = {key: key, th: w.th, c: w.c, rk: w.rk, cnt: 0, n: 0, multi: 0, list: []}; themes.push(t); }
      t.cnt += w.cnt; t.n++; if (w.nd >= 2) t.multi++; t.list.push(w);
    });
    themes.sort(function (a, b) { return ((a.th === null ? 1 : 0) - (b.th === null ? 1 : 0)) || (b.cnt - a.cnt) || (b.n - a.n) || (PH_ORD[a.c] - PH_ORD[b.c]) || ((a.rk || 99) - (b.rk || 99)); });
    return (PK_C[pk] = {ck: ck, pk: pk, kind: pk.charAt(0), flt: 'ytu', all: all, tds: tds, miss: miss.length, last: last, lastB: lastB, list: list, themes: themes, upl: true, nv: nv, ytEnd: ytEnd()});
  }
  function mnStage(s) { var o = []; (s.rs || []).forEach(function (r) { var x = (/[①②③④⑤]/.exec(String(r[8] || '')) || ['?'])[0]; if (o.indexOf(x) < 0) o.push(x); }); return o; }   // 📉 들어온 날 단계(자체상태 r[8] = 🆕③ -36.2%)   // 그날 채점 자료(묶음이면 그 묶음 줄)가 있나
  function mkNum(x) { var m = /(\d+)\D*$/.exec(String(x)); return m ? +m[1] : 0; }
  var MKG = null;
  function mkMeta(x) {   // 매매법 이름(괄호 뺀 것) → {g: 달력 글자(🏅 🅰 ㉗ ㊀ …), i: 자료 순서 = 달력 묶음 순서} · 처음 한 번 만듦
    if (!MKG) { var M = META(); if (!M) return null; MKG = {}; (M.매매법 || []).forEach(function (m, i) { var nm = String(m[0]).replace(/\(.*\)$/, ''); if (!MKG[nm]) MKG[nm] = {g: m[1] || '', i: i}; }); }
    return MKG[String(x)] || null;
  }
  function mkKeys(o) { return Object.keys(o || {}).sort(function (a, b) { var A = mkMeta(a), B = mkMeta(b); return ((A ? A.i : 9999) - (B ? B.i : 9999)) || (mkNum(a) - mkNum(b)) || String(a).localeCompare(String(b)); }); }   // 자료 순서(= 달력 묶음 순서) → 숫자 → 이름
  function mkLab(x) { if (/^2060매매법/.test(x)) return '🏹' + x.replace('2060매매법', ''); if (/^첫터치5 \d+선/.test(x)) return '🎯' + mkNum(x); var q = mkMeta(x); return (q && q.g) ? q.g : x; }   // 🏅 베스트 = 달력 글자(풍선말 = 이름)
  function mkTotals(L) { var c = {}; L.forEach(function (w) { Object.keys(w.mk || {}).forEach(function (x) { c[x] = (c[x] || 0) + 1; }); }); var ks = mkKeys(c); return ks.length ? ks.map(function (x) { return mkLab(x) + ' ' + c[x]; }).join(' · ') : '—'; }
  function pProg(all) { var e = (META() || {}).끝칸 || ''; return all.some(function (k) { return k > e && isWkday(k); }); }   // 그 기간에 아직 안 온 평일이 있으면 = 진행 중
  function resTxt(s) {   // 풍선말용 글 결과(그날 시가 줄 먼저)
    if (!s || !s.rs || !s.rs.length) return '채점 전';
    var r = s.rs.filter(function (x) { return !x[2]; })[0] || s.rs[0], st = r[3];
    if (st === 'P') return '예정'; if (st === 'X') return '가격 없음';
    return (st === 'T' ? '★' : (st === 'S' ? '✕' : (st === 'H' ? '⏳' : ''))) + (r[4] > 0 ? '+' : '') + r[4] + '%';
  }
  function periodAgg(pk) {   // pk = 'W' + 토요일 · 'M' + YYYY-MM
    if (pFlt(pk) === 'ytu') return ytAgg(pk);   // 📺 = 올린 날 칸(일~토) · 위 ytAgg
    var M = META() || {}, flt = pFlt(pk), all = pDays(pk), tds = all.filter(function (k) { return pHasS(k, flt); });
    var miss = tds.filter(function (k) { return !MON(kbOf(k, flt).slice(0, 7)); });
    var ck = (M.만든때 || '') + '|' + miss.join(',') + '|' + (W._국면 ? 1 : 0);
    if (PK_C[pk] && PK_C[pk].ck === ck) return PK_C[pk];
    var S = {}, last = '', lastB = '';
    tds.forEach(function (k) {
      var kb = kbOf(k, flt), MD = MON(kb.slice(0, 7)); if (!MD) return;   // 📉 = 칸(신호일) k → 채점 줄 = 다음 거래일 kb · 다른 묶음은 kb = k
      last = k; lastB = kb;
      var Lk = (MD.d && MD.d[kb]) || [];
      if (flt) Lk = Lk.filter(function (r) { return fltRow(r, flt); });
      allDay(kb, Lk, MD, true, !!flt).list.forEach(function (s) {   // 국면은 기간 끝에 한 번만 · 코드 = s.code(s.c 는 국면) · 묶음(flt)이면 그 묶음 채점 줄만(📉🎯🗣📺 원자료 안 섞음)
        var w = S[s.code] || (S[s.code] = {code: s.code, n: '', cnt: 0, days: [], b: {}, ds: [], first: null, mk: {}});
        if (!w.n && s.n) w.n = s.n;
        var f5L = (flt === 'f5') ? (s.f5 || []) : null;   // 🎯 첫터치5 묶음 = 선(20·60·120·240·480)이 판
        w.cnt += f5L ? (f5L.length || 1) : s.cnt; w.days.push(k); w.ds.push({k: k, s: s});
        Object.keys(s.b).forEach(function (bt) { w.b[bt] = (w.b[bt] || 0) + Object.keys(s.b[bt]).length; });
        if (f5L) f5L.forEach(function (Ln) { var x = '첫터치5 ' + Ln + '선'; w.mk[x] = (w.mk[x] || 0) + 1; });
        else if (SHIFT[flt]) mnStage(s).forEach(function (x) { w.mk[x] = (w.mk[x] || 0) + 1; });   // 📉 = 들어온 날 단계(③ · ④)
        else if (flt && s.b[flt]) Object.keys(s.b[flt]).forEach(function (x) { w.mk[x] = (w.mk[x] || 0) + 1; });   // 묶음 안 어느 판(예: 2060매매법3)이 며칠 골랐나
        if (!w.first && s.rs.length) w.first = {k: k, s: s};
      });
    });
    var list = Object.keys(S).map(function (cd) { var w = S[cd], ph = last ? phaseOf(cd, lastB || last) : {th: null, c: '', rk: 0}; w.th = ph.th; w.c = ph.c; w.rk = ph.rk; w.nd = w.days.length; w.nb = Object.keys(w.b).length; return w; });   // w.c = 국면 · w.code = 코드
    list.sort(function (a, b) { return (b.cnt - a.cnt) || (b.nd - a.nd) || (b.nb - a.nb) || ((a.th === null ? 1 : 0) - (b.th === null ? 1 : 0)) || (PH_ORD[a.c] - PH_ORD[b.c]) || ((a.rk || 99) - (b.rk || 99)) || String(a.n || a.code).localeCompare(String(b.n || b.code)); });
    var TH = {}, themes = [];
    list.forEach(function (w) {
      var key = w.th === null ? '섹터 없음' : w.th, t = TH[key];
      if (!t) { t = TH[key] = {key: key, th: w.th, c: w.c, rk: w.rk, cnt: 0, n: 0, multi: 0, list: []}; themes.push(t); }
      t.cnt += w.cnt; t.n++; if (w.nd >= 2) t.multi++; t.list.push(w);
    });
    themes.sort(function (a, b) { return ((a.th === null ? 1 : 0) - (b.th === null ? 1 : 0)) || (b.cnt - a.cnt) || (b.n - a.n) || (PH_ORD[a.c] - PH_ORD[b.c]) || ((a.rk || 99) - (b.rk || 99)); });
    return (PK_C[pk] = {ck: ck, pk: pk, kind: pk.charAt(0), flt: flt, all: all, tds: tds, miss: miss.length, last: last, lastB: lastB, list: list, themes: themes});
  }
  function weekAgg(sat) { return periodAgg('W' + sat); }
  function monthAgg(ym) { return periodAgg('M' + ym); }
  var BUB_W = 'background:rgba(94,255,214,.16);border-color:rgba(94,255,214,.5);color:#5effd6', BUB_M = 'background:rgba(255,184,77,.16);border-color:rgba(255,184,77,.5);color:#ffb84d';   // 본 달력 📅 주간 · 📆 월간 결산 단추 색
  function weekCellHTML(sat, d, out) {   // 토요일 칸 = 날짜 + 📅 작은 동그라미(누르면 그 주 결산)
    var all = weekDays(sat), tds = all.filter(function (k) { return DAYS()[k]; }), on = G.pk === 'W' + sat;
    var base = 'position:relative;min-height:84px;padding:5px 6px;border-radius:8px;overflow:hidden;background:#0e1424;border:1px solid ';
    if (!tds.length) return '<div style="' + base + 'rgba(255,255,255,.05)"><div style="font-size:11px;color:#55597f">' + d + '</div></div>';
    var tip = '📅 주간 결산 ' + md(tds[0]) + '~' + md(tds[tds.length - 1]) + (pProg(all) ? ' 진행 중' : '') + '(월~금 · 거래일 ' + tds.length + '일) = 그 주 많이 나온 종목(🧮 언급 합) + 많이 나온 테마';
    return '<div class="grade-week" data-week="' + sat + '" style="' + base + (on ? '#5effd6' : 'rgba(255,255,255,.05)') + '">'
      + '<div style="font-size:11px;color:#55597f">' + d + '</div>'
      + '<button class="cell-bubble-btn" style="' + BUB_W + '" onclick="event.stopPropagation();gradeWeek(\'' + sat + '\')" title="' + E(tip) + '">📅</button></div>';
  }
  function monthCellHTML(k, d, ym) {   // 그 달 첫 일요일 칸 = 날짜 + 📆 작은 동그라미(누르면 그 달 결산) · 🧠 줄이 있으면 그대로 붙임
    var all = monthDays(ym), tds = all.filter(function (x) { return DAYS()[x]; }), on = G.pk === 'M' + ym, bl = brainLine(k) + v4Line(k), btn = '';
    var base = 'position:relative;min-height:84px;padding:5px 6px;border-radius:8px;overflow:hidden;';
    if (tds.length) {
      var tip = '📆 월간 결산 ' + (+ym.slice(5, 7)) + '월' + (pProg(all) ? ' 진행 중' : '') + '(거래일 ' + tds.length + '일) = 그 달 많이 나온 종목(🧮 언급 합) + 많이 나온 테마 · 첫 일요일 1개';
      btn = '<button class="cell-bubble-btn" style="' + BUB_M + '" onclick="event.stopPropagation();gradeMonth(\'' + ym + '\')" title="' + E(tip) + '">📆</button>';
    }
    if (bl) return '<div class="grade-cell grade-month" data-date="' + k + '" data-month="' + ym + '" onclick="gradePick(\'' + k + '\')" style="' + base + 'cursor:pointer;background:#141a2e;border:1px solid rgba(167,139,250,.3)"><div style="font-size:11px;color:#c9cbe8">' + d + '</div>' + btn + bl + '</div>';
    return '<div class="grade-month" data-month="' + ym + '" style="' + base + 'background:#0e1424;border:1px solid ' + (on ? '#ffb84d' : 'rgba(255,255,255,.05)') + '"><div style="font-size:11px;color:#55597f">' + d + '</div>' + btn + '</div>';
  }
  function wkChip(w, pk) {
    return '<span onclick="gradeStockW(this,\'' + pk + '\')" data-code="' + E(w.code) + '" data-name="' + E(w.n || w.code) + '" data-rate="0" data-amount="0" data-meta="📝 채점 ' + (pk.charAt(0) === 'M' ? '📆 월간 ' : '📅 주간 ') + E(pBase(pk).slice(1)) + '" title="' + E((w.n || w.code) + ' (' + w.code + ') · 언급 ' + w.cnt + '곳 · ' + w.nd + '일 · ' + (w.th || '섹터 없음') + ' ' + phaseTxt(w) + ' · 누르면 종목 창') + '" style="display:inline-block;cursor:pointer;background:#161c33;border:1px solid rgba(126,232,255,' + (w.nd >= 2 ? '.4' : '.15') + ');border-radius:9px;padding:1px 7px;margin:1px 3px 1px 0;font-size:12px;color:' + (w.nd >= 2 ? '#fff' : '#a9acd6') + '">' + E(w.n || w.code) + ' <b style="color:#7ee8ff">' + w.cnt + '</b></span>';
  }
  function wkDays(w, A) {
    if (A.kind === 'M') return '<b style="color:#c9cbe8">' + w.nd + '일</b><span style="color:#8487bd;font-size:11px"> / ' + A.tds.length + '일</span>';
    return A.all.map(function (k) { var on = w.days.indexOf(k) >= 0; return '<span title="' + E(k + (on ? ' 나옴' : '')) + '" style="display:inline-block;width:16px;text-align:center;font-size:11px;border-radius:4px;margin-right:1px;' + (on ? 'background:rgba(126,232,255,.28);color:#fff' : 'color:#3c4166') + '">' + wdl(k) + '</span>'; }).join('') + ' <span style="color:#8487bd;font-size:11px">' + w.nd + '일</span>';
  }
  function wkBadges(w, A) {
    var per = A.kind === 'M' ? '그 달' : '그 주';
    if (A.flt) return mkKeys(w.mk).map(function (x) { return '<span title="' + E(x + ' · ' + per + ' ' + w.mk[x] + '일 고름') + '" style="display:inline-block;background:#1a2340;border-radius:8px;padding:0 6px;margin:1px 3px 1px 0;font-size:11px;color:#dce8ff;white-space:nowrap">' + mkLab(x) + (w.mk[x] > 1 ? '×' + w.mk[x] : '') + '</span>'; }).join('');
    return ALL_BTN.map(function (bt) { var v = w.b[bt[0]]; if (!v) return ''; return '<span title="' + E(bt[2] + ' · ' + per + ' ' + v + '번(날마다 고른 기계 수의 합)') + '" style="display:inline-block;background:#1a2340;border-radius:8px;padding:0 6px;margin:1px 3px 1px 0;font-size:11px;color:#dce8ff;white-space:nowrap">' + bt[1] + v + '</span>'; }).join('');
  }
  function wkRes(w) {
    var tip = '날마다(그날 시가 · 같은 자): ' + w.ds.map(function (x) { return md(x.k) + ' ' + resTxt(x.s); }).join(' · ');
    if (!w.first) return '<span style="color:#55597f" title="' + E(tip) + '">채점 전</span>';
    return '<span title="' + E(tip) + '"><span style="color:#8487bd;font-size:11px">' + md(w.first.k) + '</span> ' + allRes(w.first.s) + '</span>';
  }
  function wkFirstVal(w) { if (!w.first) return null; var s = w.first.s, r = s.rs.filter(function (x) { return !x[2]; })[0] || s.rs[0]; return (r[3] === 'P' || r[3] === 'X' || r[4] == null) ? null : r[4]; }
  function pSum(L) {   // 묶음 창 채점 모음 = 종목마다 처음 고른 날 줄 1번
    var T = 0, S = 0, H = 0, P = 0, X = 0, v = [];
    L.forEach(function (w) {
      if (!w.first) return;
      var s = w.first.s, r = s.rs.filter(function (x) { return !x[2]; })[0] || s.rs[0], st = r[3];
      if (st === 'T') T++; else if (st === 'S') S++; else if (st === 'H') H++; else if (st === 'P') P++; else if (st === 'X') X++;
      if (st !== 'P' && st !== 'X' && r[4] != null) v.push(r[4]);
    });
    var sv = v.slice().sort(function (a, b) { return a - b; });
    return {n: v.length, T: T, S: S, H: H, P: P, X: X, avg: v.length ? v.reduce(function (a, b) { return a + b; }, 0) / v.length : null, med: sv.length ? sv[Math.floor(sv.length / 2)] : null};
  }
  function pSumHTML(L, per, isMn) {
    var q = pSum(L);
    if (!q.n && !q.P) return '';
    return '<div style="margin-top:8px;padding:5px 10px;border-radius:8px;background:rgba(126,232,255,.05);border:1px solid rgba(126,232,255,.22);font-size:12px;color:#c9cbe8" title="' + E('종목마다 ' + (isMn === 'mn' ? '처음 들어온 날 다음 거래일 시가' : isMn === 'yt' ? '처음 말한 영상 뒤 첫 시가(09:00 전 올리면 그날 · 아니면 다음 거래일)' : '처음 고른 날 시가') + '에 샀다면(같은 자 +20% 익절 / −10% 손절 / 20거래일 · 비용 0.35%p) · ★ = +20% 닿음 · ✕ = −10% 손절 · ⏳ = 아직 20거래일 안 지남(지금 평가로 평균에 넣음) · 예정 = 아직 살 날이 안 옴 · 가격 없음 = 장부에 일봉이 없어 채점 못 함 · 중앙 = 가운데 값(평균이 큰 몇 종목에 끌리는지 보기)') + '">📊 <b>' + per + ' 채점 모음</b> = 값 있는 ' + q.n + '종목 · <b style="color:#ffd166">★' + q.T + '</b> · <span style="color:#7ea6ff">✕' + q.S + '</span>' + (q.H ? ' · <span style="color:#ffc454">⏳' + q.H + '</span>' : '') + (q.P ? ' · <span style="color:#7ee8ff">예정 ' + q.P + '</span>' : '') + (q.X ? ' · <span style="color:#8487bd" title="장부에 그 종목 일봉이 없어 채점 못 한 줄(거래정지 · 관리 · 자료 빠짐 등)">가격 없음 ' + q.X + '</span>' : '') + ' · 평균 ' + (q.avg != null ? pct(q.avg, 2) : '—') + ' · 중앙 ' + (q.med != null ? pct(q.med, 2) : '—') + '</div>';
  }
  function ytLegend(A, L, per) {   // 📺 묶음 창 글귀
    return '<div style="font-size:11px;color:#8487bd;margin-top:3px;line-height:1.6">채널마다 말한 종목 수 = ' + mkTotals(L) + ' · 언급 = ' + per + ' 날마다 그 종목을 말한 채널 수의 합(같은 날 같은 채널 = 1 · 영상의 국내 관련주 코드) · 나온 날 = 영상 올린 날(한국시간 · 달력 칸 날짜 · 일~토) · 테마 = ' + E(md(A.last)) + ' 기준 국면 · 채점 = 처음 말한 영상 뒤 첫 시가(09:00 전 올리면 그날 · 아니면 다음 거래일 = 📝 채점 📺 줄)의 같은 자(+20% / −10% / 20거래일 · 풍선말 = 날마다) · 관찰용 · 매수추천 아님 · 여러 채널이 말했다고 더 오른다는 증거는 아직 없음</div>';
  }
  function mnLegend(A, L, per, fnm) {   // 📉 묶음 창 글귀
    return '<div style="font-size:11px;color:#8487bd;margin-top:3px;line-height:1.6">단계마다 종목 수(들어온 날 단계 · ③ -35~-45% · ④ -45~-55%) = ' + mkTotals(L) + ' · 들어온 수 = ' + per + ' 깊은 눌림(-35~-55%)에 처음 들어온 날 수(' + fnm + '채점 줄만 = 달력 칸 🆕) · 들어온 날 = 신호일(그 날 종가로 들어옴 = 달력 칸 날짜) · 테마 = ' + E(md(A.last)) + ' 종가 국면 · 채점 = 처음 들어온 날 다음 거래일 시가의 같은 자(+20% / −10% / 20거래일 · 풍선말 = 날마다) · 관찰용 · 매수추천 아님</div>';
  }
  function periodHTML(pk) {
    var A = periodAgg(pk), M = META() || {}, isM = A.kind === 'M', ord = G.wkOrd || 'cnt', more = !!G.wkMore, L = A.list, LIM = isM ? 60 : 40, per = isM ? '그 달' : '그 주', flt = A.flt, sfx = flt ? '|' + flt : '', fnm = flt ? (FLT_NM[flt] || flt) + ' ' : '';
    if (!A.tds.length) return '<div id="grade-week" style="color:#8487bd">' + (isM ? '📆 이 달' : '📅 이 주') + '은 ' + fnm + '채점 자료가 없다</div>';
    var isMn = !!SHIFT[flt];   // 📉 월간눌림 달력 결산(신호일 칸 · 다음 거래일 시가)
    var n2 = L.filter(function (w) { return w.nd >= 2; }).length, mx = L.length ? L[0].cnt : 0, bc = {}, prog = pProg(isMn ? A.all.map(function (k) { return isWkday(k) ? kbOf(k, flt) : k; }) : A.all);
    ALL_BTN.forEach(function (bt) { bc[bt[0]] = 0; });
    L.forEach(function (w) { Object.keys(w.b).forEach(function (b) { bc[b]++; }); });
    var tab = function (v, t) { return '<button class="ms-btn' + (ord === v ? ' active' : '') + '" onclick="gradeWeekOrd(\'' + v + '\')" style="font-size:11px;padding:2px 10px;margin-left:4px">' + t + '</button>'; };
    var t0 = A.tds[0], t1 = A.tds[A.tds.length - 1], ym = pBase(pk).slice(1), nav, title;
    if (isM) {   // 그 달의 주 단추(누르면 그 주 결산)
      var sats = []; A.tds.forEach(function (k) { var s = satOf(k); if (sats.indexOf(s) < 0) sats.push(s); });
      nav = '주간 ' + sats.map(function (s) { var ds = flt === 'ytu' ? weekDays7(s).filter(ytHas) : weekDays(s).filter(function (k) { return pHasS(k, flt); }); return '<button class="today-btn" onclick="gradePeriod(\'W' + s + sfx + '\')" style="font-size:11px;padding:1px 8px;margin:0 3px 0 0" title="' + E(md(ds[0]) + '~' + md(ds[ds.length - 1]) + ' 주간 결산') + '">📅 ' + md(ds[0]) + '~' + md(ds[ds.length - 1]) + '</button>'; }).join('');
      title = '📆 ' + fnm + ym.slice(0, 4) + '년 ' + (+ym.slice(5, 7)) + '월 월간 결산';
    } else {
      nav = '날짜 창 ' + A.all.map(function (k) {
        if (A.tds.indexOf(k) >= 0) return DAYOPEN[flt]
          ? '<button class="today-btn" onclick="document.getElementById(\'grade-modal\').style.display=\'none\';' + DAYOPEN[flt] + '(\'' + k + '\')" style="font-size:11px;padding:1px 8px;margin:0 3px 0 0" title="' + k + ' ' + fnm + '칸 상세(그날 전부)">' + wdl(k) + ' ' + md(k) + '</button>'
          : '<button class="today-btn" onclick="gradePick(\'' + k + '\')" style="font-size:11px;padding:1px 8px;margin:0 3px 0 0" title="' + k + ' 날짜 창(🧮 이 날 모든 버튼 종목)">' + wdl(k) + ' ' + md(k) + '</button>';
        return '<span style="font-size:11px;color:#55597f;margin-right:6px">' + wdl(k) + ' ' + md(k) + (A.upl ? (k > (A.ytEnd || '') ? ' 아직' : ' 없음') : (!isTdG(k) ? ' 휴장' : (kbOf(k, flt) > (M.끝칸 || '') ? ' 아직' : ' 없음'))) + '</span>';
      }).join('') + ' <button class="today-btn" onclick="gradePeriod(\'M' + t1.slice(0, 7) + sfx + '\')" style="font-size:11px;padding:1px 8px;margin-left:4px" title="이 주가 든 달 결산">📆 ' + (+t1.slice(5, 7)) + '월 결산</button>';
      title = '📅 ' + fnm + E(t0) + '(' + wdl(t0) + ') ~ ' + E(t1.slice(5)) + '(' + wdl(t1) + ') 주간 결산';
    }
    var h = '<div id="grade-week">'
      + '<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px"><div>'
      + '<div style="font-size:18px;font-weight:800;color:#fff">' + title + (prog ? ' <span style="font-size:13px;color:#ffc454">진행 중(남은 날은 자료가 오면 더해짐)</span>' : '') + (isMn ? ' · 깊은 눌림에 처음 들어온 종목 ' : ' · 많이 나온 종목 ') + L.length + '개</div>'
      + '<div style="font-size:12px;color:#c9cbe8;margin-top:4px;line-height:1.9">' + (isMn ? '신호일 ' + A.tds.length + '일(그 날 종가 → 다음 거래일 시가) · 2번 이상 들어온 종목 ' + n2 : A.upl ? '올린 날 ' + A.tds.length + '일 · 종목 말한 영상 ' + A.nv + '편 · 2일 이상 나온 종목 ' + n2 + ' · 최다 ' + mx + '곳' : '거래일 ' + A.tds.length + '일 · 2일 이상 나온 종목 ' + n2 + ' · 최다 ' + mx + '곳') + ' · ' + nav + '</div>'
      + '</div><button class="today-btn" onclick="document.getElementById(\'grade-modal\').style.display=\'none\'" style="font-size:12px;padding:2px 10px" title="닫기(Esc)">✕</button></div>';
    if (flt) h += pSumHTML(L, per, isMn ? 'mn' : (A.upl ? 'yt' : ''));   // 📊 묶음 창 채점 모음(2026-10-11)
    var TT = A.themes.filter(function (t) { return t.th !== null; });
    h += '<div style="margin:10px 0 6px;font-size:12px;line-height:2">' + (isMn ? '<b style="color:#ff9e7a">📉 ' + per + ' 깊은 눌림에 많이 들어온 테마</b> ' : '<b style="color:#ffd166">🔥 ' + per + '에 많이 나온 테마</b> ')
      + (TT.length ? TT.slice(0, 10).map(function (t, i) {
          var vs = t.list.map(wkFirstVal).filter(function (v) { return v != null; }), av = vs.length ? vs.reduce(function (a, b) { return a + b; }, 0) / vs.length : null;
          return '<span title="' + E(t.key + ' · 언급 합 ' + t.cnt + ' · ' + t.n + '종목(2일 이상 ' + t.multi + ') · ' + phaseTxt(t) + (av != null ? ' · 처음 고른 날 평균 ' + av.toFixed(1) + '%' : '') + ' · 많이 나온 종목: ' + t.list.slice(0, 5).map(function (w) { return (w.n || w.code) + ' ' + w.cnt; }).join(', ')) + '" style="display:inline-block;background:#1a2340;border-radius:8px;padding:0 7px;margin:1px 4px 1px 0;color:#dce8ff">'
            + '<span style="color:#8487bd">' + (i + 1) + '</span> ' + E(t.key) + ' <b style="color:#ffd166">' + t.cnt + '</b> <span style="color:' + phaseCol(t.c) + ';font-size:11px">' + E(phaseTxt(t)) + '</span></span>';
        }).join('') : '<span style="color:#6f72a8">테마 국면 자료 없음</span>') + '</div>';
    h += '<div style="font-size:13px;font-weight:700;color:#7ee8ff">종목 ' + tab('cnt', '많이 나온 순') + tab('th', '테마 순') + '</div>'
      + (isMn ? mnLegend(A, L, per, fnm) : A.upl ? ytLegend(A, L, per) : '<div style="font-size:11px;color:#8487bd;margin-top:3px;line-height:1.6">' + (flt ? '판마다 고른 종목 수 = ' + mkTotals(L) : '센 곳(종목 수) = ' + ALL_BTN.map(function (bt) { return bt[1] + ' ' + bt[2] + ' ' + bc[bt[0]]; }).join(' · '))
      + ' · 언급 = ' + per + (flt ? ' 매일 그 종목을 고른 ' + fnm + '판 수의 합(같은 날 같은 판 = 1 · ' + fnm + '채점 줄만)' : ' 매일 🧮(이 날 모든 버튼 종목) 언급 수의 합(같은 날 같은 기계 = 1)') + ' · 나온 날 = ' + per + '에 고른 날 · 테마 = ' + E(md(A.last)) + ' 기준 전날 국면 · 채점 = ' + per + '에 처음 고른 날 시가의 같은 자(+20% / −10% / 20거래일 · 풍선말 = 날마다) · 관찰용 · 매수추천 아님 · 여러 번 나왔다고 더 오른다는 증거는 아직 없음</div>');
    if (ord === 'cnt') {
      var show = more ? L : L.slice(0, LIM), td = 'padding:3px 7px;border-bottom:1px solid #1e2a44;vertical-align:top;white-space:nowrap';
      h += '<div style="overflow:auto;max-height:520px;margin-top:6px"><table style="border-collapse:collapse;color:#e4e6ff;font-size:12px;width:100%"><tr>'
        + ['#', '종목', isMn ? '들어온 수' : '언급 합', isMn ? '들어온 날(신호일)' : (A.upl ? '말한 날(올린 날)' : '나온 날'), flt ? (isMn ? '단계(들어온 날)' : (A.upl ? '어느 채널(말한 날)' : '어느 판(고른 날)')) : '어디서(버튼별 합)', '테마 · 강도', isMn ? '채점(다음 날 시가)' : (A.upl ? '채점(첫 영상 뒤 시가)' : '채점(처음 고른 날)')].map(function (t) { return '<th style="padding:4px 7px;border-bottom:1px solid #2a3150;color:#8487bd;text-align:left;white-space:nowrap;position:sticky;top:0;background:#12152a">' + t + '</th>'; }).join('') + '</tr>';
      show.forEach(function (w, i) {
        h += '<tr><td style="' + td + ';color:#8487bd">' + (i + 1) + '</td><td style="' + td + '">' + wkChip(w, pk) + '</td>'
          + '<td style="' + td + '"><b style="color:#7ee8ff">' + w.cnt + (isMn ? '번</b>' : '곳</b> <span style="color:#8487bd;font-size:11px">' + (flt ? (A.upl ? '채널 ' : '판 ') + Object.keys(w.mk || {}).length : '버튼 ' + w.nb) + '</span>') + '</td>'
          + '<td style="' + td + '">' + wkDays(w, A) + '</td>'
          + '<td style="padding:3px 7px;border-bottom:1px solid #1e2a44;white-space:normal">' + wkBadges(w, A) + '</td>'
          + '<td style="' + td + '">' + E(w.th || '—') + ' <span style="color:' + phaseCol(w.c) + ';font-size:11px">' + E(phaseTxt(w)) + '</span></td>'
          + '<td style="' + td + '">' + wkRes(w) + '</td></tr>';
      });
      h += '</table></div>' + (L.length > LIM ? '<div style="margin-top:5px;font-size:11.5px;color:#8487bd">' + (more ? '전부 ' + L.length + '종목' : (LIM + 1) + '위 아래 ' + (L.length - LIM) + '종목') + ' <button class="today-btn" onclick="gradeWeekMore()" style="font-size:11px;padding:1px 9px;margin-left:4px">' + (more ? '접기' : '더 보기') + '</button></div>' : '');
    } else {
      h += '<div style="margin-top:6px;max-height:560px;overflow:auto">';
      A.themes.forEach(function (t, i) {
        var vs = t.list.map(wkFirstVal).filter(function (v) { return v != null; }), av = vs.length ? vs.reduce(function (a, b) { return a + b; }, 0) / vs.length : null;
        h += '<div style="margin:6px 0;padding:6px 8px;border-left:3px solid ' + phaseCol(t.c) + ';background:rgba(255,255,255,.02);border-radius:0 8px 8px 0">'
          + '<div style="font-size:12.5px"><b style="color:#fff">' + (i + 1) + '. ' + E(t.key) + '</b> <span style="color:' + phaseCol(t.c) + ';font-size:11px">' + E(phaseTxt(t)) + '</span>'
          + ' <span style="color:#c9cbe8;font-size:11.5px">· 언급 합 <b style="color:#ffd166">' + t.cnt + '</b> · ' + t.n + '종목(2일 이상 ' + t.multi + ')' + (av != null ? ' · 처음 고른 날 평균 ' + pct(av, 1) : '') + '</span></div>'
          + '<div style="margin-top:3px">' + t.list.map(function (w) { return wkChip(w, pk); }).join('') + '</div></div>';
      });
      h += '</div>';
    }
    return h + '</div>';
  }
  function periodModal(pk, errs) {
    var ov = modal(), box = document.getElementById('grade-modal-box');
    try { box.innerHTML = periodHTML(pk) + (errs && errs.length ? '<div style="color:#ff9aaa;font-size:12px;margin-top:6px">❌ 달 파일 못 읽음: ' + E(errs.join(' · ')) + ' = 주도주\\_천억장부\\장부_달력.py 실행</div>' : ''); }
    catch (e) { box.innerHTML = '<div style="color:#ff9aaa;font-size:13px">결산 창 그리기 실패: ' + E(e && e.message) + '</div>'; console.warn('📝 채점 📅📆 결산', e); }
    ov.style.display = 'flex'; box.scrollTop = 0;
  }
  function periodRedraw() { var el = document.getElementById('grade-week'); if (!el || !G.pk) return; try { el.outerHTML = periodHTML(G.pk); } catch (e) { console.warn('📝 채점 결산 다시 그리기 실패', e); } }
  function openPeriod(pk) {
    var flt = pFlt(pk), tds = pDays(pk).filter(function (k) { return flt === 'ytu' ? ytHas(k) : pHasS(k, flt); });
    if (!tds.length) return;
    G.pk = pk; G.wkMore = false;
    document.querySelectorAll('#sec-grade .grade-week').forEach(function (c) { c.style.borderColor = ('W' + c.getAttribute('data-week')) === pk ? '#5effd6' : 'rgba(255,255,255,.05)'; });
    document.querySelectorAll('#sec-grade .grade-month').forEach(function (c) { if (!c.classList.contains('grade-cell')) c.style.borderColor = ('M' + c.getAttribute('data-month')) === pk ? '#ffb84d' : 'rgba(255,255,255,.05)'; });
    var ms = [];
    if (flt === 'ytu') ms = ytBuyMonths(tds).filter(function (m2) { return ((META() || {}).달 || []).indexOf(m2) >= 0; });   // 📺 = 매수일(올린 뒤 첫 시가) 달 파일
    else tds.forEach(function (k) { var m2 = kbOf(k, flt).slice(0, 7); if (ms.indexOf(m2) < 0) ms.push(m2); });
    if (!ms.length) { periodModal(pk, []); return; }   // 받을 달 파일이 없음(📺 그 주 영상이 다 아직 채점 안 된 달에 삼) → 채점 전으로 바로 엶
    var left = ms.length, errs = [];
    ms.forEach(function (m2) { loadMon(m2, function (err) { if (err) errs.push(m2 + '(' + err + ')'); if (--left === 0) periodModal(pk, errs); }); });
  }
  W.gradeWeek = function (sat) { openPeriod('W' + sat); };   // 📅 그 주(월~금) 결산
  W.gradeMonth = function (ym) { openPeriod('M' + ym); };    // 📆 그 달 결산
  W.gradePeriod = function (pk) { openPeriod(pk); };          // 묶음 결산(예: 'W2026-10-03|r6' = 🏹 2060 달력 📅 · 'M2026-10|r6' = 📆)
  W.gradeWeekOrd = function (v) { G.wkOrd = v; periodRedraw(); };   // 많이 나온 순('cnt') · 테마 순('th') · 주간·월간 같이 씀
  W.gradeWeekMore = function () { G.wkMore = !G.wkMore; periodRedraw(); };
  W.gradeStockW = function (el, pk) {   // 결산 창에서 종목 창 → 닫으면 그 결산 창으로
    if (typeof W._openStock === 'function' && el.getAttribute('data-code')) W._openStock(el, function () { openPeriod(pk); });
    else if (typeof W.showStockDetail === 'function') W.showStockDetail(el);
  };

  W.gradeGo = function () {
    if (!G.y) { var l = latestYM(); G.y = l[0]; G.m = l[1]; }
    render(); var sec = document.getElementById('sec-grade'); if (sec) sec.scrollIntoView({behavior: 'smooth', block: 'start'});
  };
  W.gradeYear = function (dy) { G.y += dy; render(); };
  W.gradeGoMonth = function (mi) { G.m = mi; render(); };
  W.gradeLatest = function () { G.y = 0; W.gradeGo(); };
  W.gradePer = function (p) { G.per = p; G.all = false; var el = document.getElementById('grade-rank'); if (el) el.innerHTML = rankHTML(); else render(); };
  W.gradeSort = function (k) {
    if (k === 'cal') { G.sort = 'cal'; G.dir = 1; }                  // 맨 위 버튼 순서로 되돌림
    else if (G.sort === k) G.dir = -G.dir; else { G.sort = k; G.dir = -1; }
    var el = document.getElementById('grade-rank'); if (el) el.innerHTML = rankHTML();
  };
  W.gradeOrd = function (v) { G.ord = v; if (G.sel) W.gradePick(G.sel); };   // 날짜 창 매매법 순서 = 'cal' 버튼 순서 · 'avg' 평균 높은 순
  W.gradeList = function () { G.list = !G.list; render(); };
  W.gradeAllOrd = function (v) { G.allOrd = v; allRedraw(); };   // 🧮 많이 언급된 순('cnt') · 테마강도 순('th')
  W.gradeAllMore = function () { G.allMore = !G.allMore; allRedraw(); };
  W.gradeCurve = function () {   // 🪨 1단계 📈 학습 곡선 펼치기·접기 = 🧠 칸만 다시 그림(스크롤 안 튀게)
    G.curve = !G.curve;
    var el = document.getElementById('grade-brain');
    if (el) el.outerHTML = brainPanelHTML(G.y, G.m); else render();
  };
  W.gradeGold = function () {   // 🧵 2단계 황금 실 표 펼치기·접기 = 🧠 칸만 다시 그림
    G.gold = !G.gold;
    var el = document.getElementById('grade-brain');
    if (el) el.outerHTML = brainPanelHTML(G.y, G.m); else render();
  };
  W.gradeReport = function () {   // 📊 Step 8 측정판 성적표 펼치기·접기 = 🧠 칸만 다시 그림
    G.report = !G.report;
    var el = document.getElementById('grade-brain');
    if (el) el.outerHTML = brainPanelHTML(G.y, G.m); else render();
  };
  W.gradeJournal = function () {   // 📓 Step 4 지난 일지 펼치기·접기 = 🧠 칸만 다시 그림
    G.journal = !G.journal;
    var el = document.getElementById('grade-brain');
    if (el) el.outerHTML = brainPanelHTML(G.y, G.m); else render();
  };
  W.gradeAll = function () { G.all = !G.all; var el = document.getElementById('grade-rank'); if (el) el.innerHTML = rankHTML(); };
  W.gradePick = function (k) {
    if (!DAYS()[k]) {   // 채점 자료가 없는 날(예: 앞으로의 봉인 날)은 🧠 추천주5 창만
      if (BR() && (BR().D || {})[k]) { G.sel = k; brainModal(k); }
      return;
    }
    G.sel = k;
    document.querySelectorAll('#sec-grade .grade-cell').forEach(function (c) { c.style.borderColor = c.getAttribute('data-date') === k ? '#ffd166' : 'rgba(255,209,102,.22)'; });
    loadMon(k.slice(0, 7), function (err) {
      if (err) { var ov = modal(); document.getElementById('grade-modal-box').innerHTML = '<div style="color:#ff9aaa;font-size:13px">❌ 채점_월/' + E(k.slice(0, 7)) + '.js 를 못 읽었다(' + E(err) + ') = 주도주\\_천억장부\\장부_달력.py 실행</div>'; ov.style.display = 'flex'; return; }
      dayModal(k, MON(k.slice(0, 7)));
    });
  };
  W.gradeStock = function (el, k) {
    if (typeof W._openStock === 'function' && el.getAttribute('data-code')) W._openStock(el, function () { W.gradePick(k); });
    else if (typeof W.showStockDetail === 'function') W.showStockDetail(el);
  };
  // ── 🏹 2060 달력 📅 주간 · 📆 월간(2026-10-11 사용자 "2060 버튼 달력도 넣어줘, 주간, 월간") ─────────────────────
  //   🏹 2060 칸(2060_뷰.js · ②~⑧ 뷰가 차례로 감싼 buildR2060Cell)을 이 파일(맨 나중에 읽힘)에서 맨 바깥으로 한 번 더 감싸
  //   토요일 칸 📅 · 그 달 첫 일요일 칸 📆 작은 동그라미(본 달력 · 📝 채점과 같은 cell-bubble-btn)를 단다 · ⑧만 보기 모드는 자체 칸이라 없음
  //   누르면 📝 채점 결산 창 = 🏹 2060 묶음(2060매매법1~8) 채점 줄만 · 같은 자(+20% / −10% / 20거래일) · 테마 · 판마다 고른 날
  function r6WeekBtn(sat) {
    var w = weekDays(sat).filter(function (k) { return pHas(k, 'r6'); });
    if (!w.length) return '';
    return '<button class="cell-bubble-btn" style="' + BUB_W + '" onclick="event.stopPropagation();gradePeriod(\'W' + sat + '|r6\')" title="' + E('📅 주간 결산 ' + md(w[0]) + '~' + md(w[w.length - 1]) + ' = 그 주 🏹 2060매매법1~8 이 고른 종목(많이 나온 순) · 테마 · 같은 자 채점') + '">📅</button>';
  }
  function r6MonthBtn(ym) {
    var m = monthDays(ym).filter(function (k) { return pHas(k, 'r6'); });
    if (!m.length) return '';
    return '<button class="cell-bubble-btn" style="' + BUB_M + '" onclick="event.stopPropagation();gradePeriod(\'M' + ym + '|r6\')" title="' + E('📆 월간 결산 ' + (+ym.slice(5, 7)) + '월 = 그 달 🏹 2060매매법1~8 이 고른 종목 · 테마 · 같은 자 채점 · 첫 일요일 1개') + '">📆</button>';
  }
  // ── 🏹 2060 달력 칸 = 간략(2026-10-11 사용자 "내용이 너무 길잖아. 클릭하면 자세하게 보이는 창이 뜨게하고, 달력에는 간략하게 보이게") ──────
  //   칸 = 날짜 · 신호일 · 종목 수(①~⑧ 겹친 것 1번) · 판마다 종목 수(①5 ②6 …) · 같은 자 채점(📝 채점 🏹 2060 줄 · 종목마다 1번 · ★ +20% · ✕ −10% · 평균 · ⏳) · ★ 종목 2
  //   누르면 = 원래 상세 창(openR2060Detail · ①~⑧ 표 · 이유 전부) · 토요일 📅 · 첫 일요일 📆 작은 동그라미는 그대로
  //   예전 긴 칸 = 창 콘솔에서 R2060_FULL = true; renderR2060Calendar() · ⑧만 보기 모드는 원래 칸(자체 그리기)
  var R6C = ['', '①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧'], R6_MON_WAIT = {};
  function r6Recs(k) { var out = []; for (var i = 1; i <= 8; i++) { var A = W['R2060_' + i + '_ARCHIVE'], r = A && A[k]; if (r && r.p && r.p.length) out.push([i, r]); } return out; }
  function r6Score(k) {   // 그날 🏹 2060 채점 줄(같은 자) = 종목마다 1번(시가 줄 먼저)
    var MD = MON(k.slice(0, 7)); if (!MD) return null;
    var L = (MD.d && MD.d[k]) || [], by = {};
    L.forEach(function (r) { if (grpOf(r[0]) !== '2060') return; var o = by[r[1]]; if (!o || (o[2] && !r[2])) by[r[1]] = r; });
    var T = 0, S = 0, H = 0, P = 0, v = [], hits = [];
    Object.keys(by).forEach(function (c) {
      var r = by[c], st = r[3];
      if (st === 'T') { T++; hits.push(MD.n[c] || c); } else if (st === 'S') S++; else if (st === 'H') H++; else if (st === 'P') P++;
      if (r[4] != null && st !== 'P' && st !== 'X') v.push(r[4]);
    });
    return {n: Object.keys(by).length, T: T, S: S, H: H, P: P, avg: v.length ? v.reduce(function (a, b) { return a + b; }, 0) / v.length : null, hits: hits};
  }
  function r6NeedMon(ym) {   // 그 달 채점 줄이 아직 없으면 한 번 받고 2060 달력을 다시 그림
    var M = META(); if (R6_MON_WAIT[ym] || !M || (M.달 || []).indexOf(ym) < 0) return;
    R6_MON_WAIT[ym] = 1;
    loadMon(ym, function (err) { if (err) return; try { var v = document.getElementById('r2060-view'); if (v && v.innerHTML && typeof W.renderR2060Calendar === 'function') W.renderR2060Calendar(); } catch (e) { } });
  }
  function r6Cell(d, k, otherMonth, dow) {
    var recs = r6Recs(k), today = (typeof TODAY !== 'undefined') ? TODAY : '';
    var cls = 'cal-cell' + (otherMonth ? ' other-month' : '') + (k === today ? ' today' : '') + (dow === 0 ? ' sunday' : '') + (dow === 6 ? ' saturday' : '') + (recs.length ? ' has-data' : '');
    var inner = '<div class="cell-day">' + d + '</div>';
    if (recs.length) {
      var codes = {}, sg = '';
      recs.forEach(function (x) { var r = x[1]; if (!sg && r.s) sg = String(r.s); r.p.forEach(function (p) { if (p && p[1]) codes[p[1]] = 1; }); });
      inner += '<div style="font-size:10px;color:#8487bd;margin:1px 0 2px">신호 ' + (sg.length === 8 ? sg.slice(4, 6) + '/' + sg.slice(6) : '') + ' · <b style="color:#ff9f5a">' + Object.keys(codes).length + '</b>종목</div>'
        + '<div style="font-size:10.5px;line-height:1.5;color:#ffd2b0">' + recs.map(function (x) { return '<span style="white-space:nowrap;margin-right:5px">' + R6C[x[0]] + '<b>' + x[1].p.length + '</b></span>'; }).join('') + '</div>';
      var sc = r6Score(k);
      if (sc && sc.n) {
        inner += '<div style="font-size:11px;margin-top:2px;white-space:nowrap" title="📝 채점 🏹 2060 줄(같은 자 +20% / −10% / 20거래일 · 종목마다 1번)"><b style="color:' + (sc.T ? '#ffd166' : '#55597f') + '">★' + sc.T + '</b> <span style="color:' + (sc.S ? '#7ea6ff' : '#55597f') + '">✕' + sc.S + '</span> ' + pct(sc.avg, 1)
          + (sc.H ? ' <span style="color:#ffc454;font-size:10px">⏳' + sc.H + '</span>' : '') + (sc.P ? ' <span style="color:#7ee8ff;font-size:10px">예정 ' + sc.P + '</span>' : '') + '</div>';
        if (sc.hits.length) inner += '<div style="font-size:10.5px;color:#ffe9a8;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">★ ' + sc.hits.slice(0, 2).map(E).join(' · ') + (sc.hits.length > 2 ? ' <span style="color:#8487bd">외 ' + (sc.hits.length - 2) + '</span>' : '') + '</div>';
      } else if (!MON(k.slice(0, 7))) r6NeedMon(k.slice(0, 7));
    }
    var b = '';
    try { if (dow === 6) b = r6WeekBtn(k); else if (dow === 0 && !otherMonth && d <= 7) b = r6MonthBtn(k.slice(0, 7)); } catch (e) { }
    var click = recs.length ? ' onclick="openR2060Detail(\'' + k + '\')" style="cursor:pointer" title="' + E(k + ' · 누르면 ①~⑧ 자세히(종목 · 결과 · 이유)') + '"' : '';
    return '<div class="' + cls + '"' + click + '>' + inner + b + '</div>';
  }
  (function () {
    if (typeof W.buildR2060Cell !== 'function') return;
    var prev = W.buildR2060Cell;
    if (W.R2060_FULL == null) W.R2060_FULL = false;   // true = 예전 긴 칸(①~⑧ 종목 전부 · 📅📆 단추는 붙임)
    W.buildR2060Cell = function (d, k, rec, otherMonth, dow) {
      if (!W.R2060_FULL) { try { return r6Cell(d, k, otherMonth, dow); } catch (e) { console.warn('📝 채점 🏹 2060 간략 칸', e); } }
      var html = prev(d, k, rec, otherMonth, dow), b = '';
      try { if (dow === 6) b = r6WeekBtn(k); else if (dow === 0 && !otherMonth && d <= 7) b = r6MonthBtn(k.slice(0, 7)); } catch (e) { console.warn('📝 채점 🏹 2060 결산 단추', e); }
      if (!b) return html;
      var i = html.lastIndexOf('</div>');
      return i < 0 ? html : html.slice(0, i) + b + html.slice(i);
    };
    try { var v = document.getElementById('r2060-view'); if (v && v.innerHTML && typeof W.renderR2060Calendar === 'function') W.renderR2060Calendar(); } catch (e) { }
  })();
  // ── 🎯 첫터치5 달력 = 간략 칸 + 📅 주간 · 📆 월간(2026-10-11 사용자 "첫터치5 버튼에 연결된 달력도, 2060 한것처럼, 주간, 월간 버튼 만들고, 달력화면 간략하게") ──
  //   칸 = 날짜 · 신호일 · 종목 수 · 날 구분(조용한 날 등) · ↻ 또 닿음 수 · 기계마다 종목 수(🟠G240 1 · 🟢G120 2 … · 흐린 기계 = 그날 28년 우위 없음) · 대표 종목 2(흐리지 않은 기계 · 대금분위 순) · 🔍 찾는 종목 줄 그대로
  //   ★결과는 칸에 안 넣음 = 이 달력은 '채점 없음(전방 가격 안 읽음)' 원칙 · 결과는 📅·📆 창(📝 채점 🎯 첫터치5 줄 · 같은 자)에서
  //   누르면 = 원래 상세 창(openFt5Detail · 기계별 종목 전부 · 재료 · 국면) · 예전 긴 칸 = 창 콘솔 FT5_FULL = true; renderFt5Calendar()
  function f5WeekBtn(sat) {
    var w = weekDays(sat).filter(function (k) { return pHas(k, 'f5'); });
    if (!w.length) return '';
    return '<button class="cell-bubble-btn" style="' + BUB_W + '" onclick="event.stopPropagation();gradePeriod(\'W' + sat + '|f5\')" title="' + E('📅 주간 결산 ' + md(w[0]) + '~' + md(w[w.length - 1]) + ' = 그 주 🎯 첫터치5 가 고른 종목(많이 나온 순) · 테마 · 같은 자 채점') + '">📅</button>';
  }
  function f5MonthBtn(ym) {
    var m = monthDays(ym).filter(function (k) { return pHas(k, 'f5'); });
    if (!m.length) return '';
    return '<button class="cell-bubble-btn" style="' + BUB_M + '" onclick="event.stopPropagation();gradePeriod(\'M' + ym + '|f5\')" title="' + E('📆 월간 결산 ' + (+ym.slice(5, 7)) + '월 = 그 달 🎯 첫터치5 가 고른 종목 · 테마 · 같은 자 채점 · 첫 일요일 1개') + '">📆</button>';
  }
  function f5Cell(d, k, rec, otherMonth, dow) {
    var today = (typeof TODAY !== 'undefined') ? TODAY : '', MACH = (typeof _FT5_MACH !== 'undefined') ? _FT5_MACH : [];
    var rt = (typeof _ft5RtCell === 'function') ? _ft5RtCell(k) : null, rtn = rt ? (rt.n || 0) : 0, has = !!(rec && rec.n);
    var cls = 'cal-cell' + (otherMonth ? ' other-month' : '') + (k === today ? ' today' : '') + (dow === 0 ? ' sunday' : '') + (dow === 6 ? ' saturday' : '') + (has ? ' has-data' : '');
    var inner = '<div class="cell-day">' + d + '</div>';
    if (has || rtn) {
      var r = has ? rec : {신호일: rt.신호일, n: 0, 종목수: 0};
      var sg = r.신호일 ? r.신호일.slice(4, 6) + '/' + r.신호일.slice(6) : '';
      var day = (typeof _ft5Day === 'function') ? _ft5Day(r) : {t: 0};
      inner += '<div style="font-size:10px;color:#8487bd;margin:1px 0 2px">신호 ' + sg + ' · <b style="color:#c9cbe8">' + (r.종목수 || 0) + '</b>종목' + (day.t ? ' · <span style="color:' + day.c + '">' + E(day.lab) + '</span>' : '') + (rtn ? ' · <span style="color:#6b6e9c" title="↻ 또 닿음 = 신호 아님">↻' + rtn + '</span>' : '') + '</div>';
      if (typeof _ft5PinLine === 'function') inner += _ft5PinLine(k);
      var parts = [], names = [], seen = {};
      MACH.forEach(function (G) {
        var Q = r[G.key] || []; if (!Q.length) return;
        var why = (typeof _ft5Dim === 'function') ? _ft5Dim(G.key, day) : '';
        parts.push('<span style="white-space:nowrap;margin-right:6px;color:' + G.color + (why ? ';opacity:.45' : '') + '" title="' + E(G.icon + G.key + ' ' + (G.line || '') + ' 첫터치 ' + Q.length + '종목 · 들고 있을 기간 ' + (G.hold || '') + (why ? ' · 흐림 = ' + why : '')) + '">' + G.icon + G.key + ' <b>' + Q.length + '</b></span>');
        if (!why) Q.forEach(function (p) { var c = p.code || p.종목; if (names.length < 2 && !seen[c]) { seen[c] = 1; names.push(p); } });   // 같은 종목 두 선(◆) = 1번
      });
      if (parts.length) inner += '<div style="font-size:10.5px;line-height:1.55">' + parts.join('') + '</div>';
      var more = Math.max(0, (r.종목수 || 0) - names.length);   // 외 N = 그날 고유 종목 − 보인 종목
      if (names.length) inner += '<div style="font-size:10.5px;color:#ffe9a8;white-space:nowrap;overflow:hidden;text-overflow:ellipsis" title="흐리지 않은 기계의 종목(대금분위 높은 순) · 전부는 칸을 누르면">' + names.map(function (p) { return (p.대금분위 >= 60 ? '<b>' : '') + E(p.종목 || p.code) + (p.대금분위 >= 60 ? '</b>' : ''); }).join(' · ') + (more ? ' <span style="color:#8487bd">외 ' + more + '</span>' : '') + '</div>';
      else if (parts.length) inner += '<div style="font-size:10px;color:#6b6e9c" title="이 날 종목을 고른 기계가 전부 흐림(28년 우위 없음) · 종목은 칸을 누르면">흐린 기계만 · 28년 우위 없음</div>';
    }
    var b = '';
    try { if (dow === 6) b = f5WeekBtn(k); else if (dow === 0 && !otherMonth && d <= 7) b = f5MonthBtn(k.slice(0, 7)); } catch (e) { }
    var hl = (typeof _ft5CellHl === 'function') ? _ft5CellHl(k) : '';
    var click = (has || rtn) ? ' onclick="openFt5Detail(\'' + k + '\')" style="cursor:pointer' + hl + '" title="' + E(k + ' · 누르면 기계별 종목 전부 · 재료 · 국면') + '"' : '';
    return '<div class="' + cls + '" data-date="' + k + '"' + click + '>' + inner + b + '</div>';
  }
  (function () {
    if (typeof W.buildFt5Cell !== 'function') return;
    var prev = W.buildFt5Cell;
    if (W.FT5_FULL == null) W.FT5_FULL = false;   // true = 예전 긴 칸(기계별 종목 전부 · 📅📆 단추는 붙임)
    W.buildFt5Cell = function (d, k, rec, otherMonth, dow) {
      if (!W.FT5_FULL) { try { return f5Cell(d, k, rec, otherMonth, dow); } catch (e) { console.warn('📝 채점 🎯 첫터치5 간략 칸', e); } }
      var html = prev(d, k, rec, otherMonth, dow), b = '';
      try { if (dow === 6) b = f5WeekBtn(k); else if (dow === 0 && !otherMonth && d <= 7) b = f5MonthBtn(k.slice(0, 7)); } catch (e) { }
      if (!b) return html;
      var i = html.lastIndexOf('</div>');
      return i < 0 ? html : html.slice(0, i) + b + html.slice(i);
    };
    try { var v = document.getElementById('ft5-view'); if (v && v.innerHTML && typeof W.renderFt5Calendar === 'function') W.renderFt5Calendar(); } catch (e) { }
  })();
  // ── 📉 월간눌림 달력 = 간략 칸 + 📅 주간 · 📆 월간(2026-10-11 사용자 "진행" = 2060 · 첫터치5 와 같은 방식) ──
  //   칸 = 날짜 · 깊은 눌림(-35~-55% · ③④) 종목 수 · ③ · ④ · ⤴ · 🆕 처음 들어온 수 · 🆕 채점(다음 거래일 시가 · 📝 채점 📉 줄 · 같은 자 · 종목마다 1번) · 🆕 종목 2(★ 먼저)
  //   누르면 = 원래 창(openMnlDeep = 📌 머무는 전부 · 깊은 눌림 고른 채) · 분류(📉 월간 · 📈 급등) = 달력에서 고른 대로 · 예전 긴 칸 = 창 콘솔 MNL_FULL = true; renderMnlCalendar()
  //   📅 · 📆 = gradePeriod('W<토>|mnw') · ('M<YYYY-MM>|mng') 등 = 칸 날짜(신호일)로 모으고 채점 줄은 다음 거래일에서 읽음(SHIFT)
  var MN_MON_WAIT = {};
  // 🚨 폭락일(2026-10-11 사용자 "A" = 폭락일반등검증 v2 전진 기록) = 그날 급등 뒤 -35~-55% 첫 진입 10개+ · 자료 dashboard/data/폭락일_봉인.js(전진.py 채점 = 장부 08:50·21:30 끝)
  //   칸 맨 위 한 줄 = 🚨 폭락일 N · ● 봉인 시각(정시 = 다음 날 09:00 전) / ◐ 늦은 봉인 / 지난 날(2026-10-08 전 = 전진 기록 전) · 결과(끝나면 평균) · 폭락일 아닌 봉인 날 = 작은 ● 봉인 N
  var FL_WAIT = false;
  function flData() { return W.폭락일_DATA || null; }
  function flNeed() {
    if (flData() || FL_WAIT) return;
    FL_WAIT = true;
    var s = document.createElement('script'); s.src = 'dashboard/data/폭락일_봉인.js?v=' + Date.now();
    s.onload = function () { mnRedraw(); }; s.onerror = function () { console.warn('📝 채점 🚨 폭락일_봉인.js 없음 = 전진.py 채점'); };
    document.head.appendChild(s);
  }
  function flLine(k) {
    var F = flData(); if (!F) { flNeed(); return ''; }
    var sl = (F.봉인 || {})[k], n = sl ? sl.n : ((F.역사 || {})[k] || 0), M = F.META || {};
    if (n < 10) return sl ? '<div style="font-size:9.5px;color:#55597f" title="' + E('🚨 전진 기록 ● 봉인 ' + sl.시각 + ' · 지문 ' + sl.지문 + ' · 그날 급등 뒤 -35~-55% 첫 진입 ' + sl.n + '개 = 폭락일 아님(10개+ 만) · 판정 ' + (M.판정 || '')) + '">● 봉인 ' + sl.n + '</div>' : '';
    var col = n >= 40 ? '#ff1744' : (n >= 20 ? '#ff5252' : '#ff8a80'), tier = n >= 40 ? '40+' : (n >= 20 ? '20+' : '10+');
    var st = sl ? (sl.정시 ? '● 봉인 ' + String(sl.시각).slice(6) : '◐ 늦은 봉인') : '지난 날';
    var res = (sl && sl.평균 != null) ? ' · ' + (sl.평균 > 0 ? '+' : '') + Number(sl.평균).toFixed(1) + '%' : '';
    var tip = '🚨 폭락일 = 그날 급등(+20~35%) 뒤 -35~-55% 첫 진입 ' + n + '개(' + tier + ') · 다음 날 시가 · +20% / -10% / 20일 · 폭락일반등검증 v2(2008~2015 관문 5/5 · 조건부 매수후보) · '
      + (sl ? (sl.정시 ? '정시 봉인 ' + sl.시각 + ' · 지문 ' + sl.지문 + ' · 매수일 ' + sl.매수일 + ' · 끝난 거래 ' + sl.끝 + (sl.평균 != null ? ' · 평균 ' + sl.평균 + '% · 중앙 ' + sl.중앙 + '% · 대금10 대비 ' + sl.대금10 + '%p' : '') : '늦은 봉인(장 시작 뒤 · 판정 제외)') : '전진 기록 전 날(2026-10-08 전) = 지난 자료 · 판정에 안 씀')
      + ' · 판정 ' + (M.판정 || '') + (M.판정까지 ? '(끝난 폭락일 ' + (M.끝난폭락일 || 0) + ' / 20)' : '') + ' · 판정 전 실제 매수 금지';
    return '<div style="font-size:10.5px;font-weight:700;color:' + col + ';white-space:nowrap;overflow:hidden" title="' + E(tip) + '">🚨 폭락일 ' + n + ' <span style="font-weight:400;font-size:9.5px;color:#c9cbe8">' + st + res + '</span></div>';
  }
  function mnKind() { try { return (typeof _mnlK !== 'undefined' && _mnlK === '급등') ? '급등' : '월간'; } catch (e) { return '월간'; } }
  function mnFlt(K) { return (K || mnKind()) === '급등' ? 'mng' : 'mnw'; }
  function mnRedraw() { try { var v = document.getElementById('mnl-view'); if (v && v.querySelector('.cal-grid') && typeof W.renderMnlCalendar === 'function') W.renderMnlCalendar(); } catch (e) { } }   // 달력이 그려져 있을 때만(처음엔 자료 2MB 를 받지 않게)
  function mnNeedMon(ym) {   // 그 달 채점 줄이 아직 없으면 한 번 받고 📉 달력을 다시 그림
    var M = META(); if (MN_MON_WAIT[ym] || !M || (M.달 || []).indexOf(ym) < 0) return;
    MN_MON_WAIT[ym] = 1;
    loadMon(ym, function (err) { if (!err) mnRedraw(); });
  }
  function mnScore(k, flt) {   // 칸(신호일) k 의 🆕 → 다음 거래일 시가 채점 줄(그 분류 · 종목마다 1번 · 시가 줄 먼저)
    var kb = tdNextG(k), MD = MON(kb.slice(0, 7));
    if (!MD) { mnNeedMon(kb.slice(0, 7)); return null; }
    var L = (MD.d && MD.d[kb]) || [], by = {};
    L.forEach(function (r) { if (!fltRow(r, flt)) return; var o = by[r[1]]; if (!o || (o[2] && !r[2])) by[r[1]] = r; });
    var T = 0, S = 0, H = 0, P = 0, v = [], st = {};
    Object.keys(by).forEach(function (c) {
      var r = by[c], x = r[3]; st[c] = x;
      if (x === 'T') T++; else if (x === 'S') S++; else if (x === 'H') H++; else if (x === 'P') P++;
      if (r[4] != null && x !== 'P' && x !== 'X') v.push(r[4]);
    });
    return {kb: kb, n: Object.keys(by).length, T: T, S: S, H: H, P: P, avg: v.length ? v.reduce(function (a, b) { return a + b; }, 0) / v.length : null, st: st};
  }
  function mnWeekBtn(sat) {
    var flt = mnFlt(), w = weekDays(sat).filter(function (k) { return pHasS(k, flt); });
    if (!w.length) return '';
    return '<button class="cell-bubble-btn" style="' + BUB_W + '" onclick="event.stopPropagation();gradePeriod(\'W' + sat + '|' + flt + '\')" title="' + E('📅 주간 결산 ' + md(w[0]) + '~' + md(w[w.length - 1]) + ' = 그 주 ' + FLT_NM[flt] + ' 깊은 눌림(-35~-55%)에 처음 들어온 종목 · 테마 · 같은 자 채점(다음 거래일 시가)') + '">📅</button>';
  }
  function mnMonthBtn(ym) {
    var flt = mnFlt(), m = monthDays(ym).filter(function (k) { return pHasS(k, flt); });
    if (!m.length) return '';
    return '<button class="cell-bubble-btn" style="' + BUB_M + '" onclick="event.stopPropagation();gradePeriod(\'M' + ym + '|' + flt + '\')" title="' + E('📆 월간 결산 ' + (+ym.slice(5, 7)) + '월 = 그 달 ' + FLT_NM[flt] + ' 깊은 눌림에 처음 들어온 종목 · 테마 · 같은 자 채점 · 첫 일요일 1개') + '">📆</button>';
  }
  function mnBtn(k, d, otherMonth, dow) { try { if (dow === 6) return mnWeekBtn(k); if (dow === 0 && !otherMonth && d <= 7) return mnMonthBtn(k.slice(0, 7)); } catch (e) { console.warn('📝 채점 📉 결산 단추', e); } return ''; }
  function mnCell(d, k, list, otherMonth, dow) {
    var today = (typeof TODAY !== 'undefined') ? TODAY : '', K = mnKind(), flt = mnFlt(K);
    var L = ((typeof _mnlDeepRows === 'function') ? _mnlDeepRows(k) : null) || [];
    var cls = 'cal-cell' + (otherMonth ? ' other-month' : '') + (k === today ? ' today' : '') + (dow === 0 ? ' sunday' : '') + (dow === 6 ? ' saturday' : '') + (L.length ? ' has-data' : '');
    var inner = '<div class="cell-day">' + d + '</div>';
    try { inner += flLine(k); } catch (e) { }   // 🚨 폭락일(2026-10-11)
    if (L.length) {
      var DG = (typeof _MNL_DG !== 'undefined') ? _MNL_DG : 2, gOf = (typeof _mnlG === 'function') ? _mnlG : function (x) { return x >= 5 ? 3 : x >= 3 ? 2 : x >= 1 ? 1 : 0; };
      var n3 = L.filter(function (r) { return r[2] === 3; }).length, nw = L.filter(function (r) { return r[11]; }), nIn = L.filter(function (r) { return r[10] === 1; }).length, nUp = L.filter(function (r) { return gOf(r[3]) > DG; }).length;
      inner += '<div style="font-size:10px;color:#8487bd;margin:1px 0 2px" title="' + E('깊은 눌림 = ' + (K === '급등' ? '급등한 날' : '테마 받은 날') + ' 종가보다 -35~-55% 안에 있는 종목 전부(이 날 종가 · 벗어나면 빠진다) · ③ -35~-45% ' + n3 + ' · ④ -45~-55% ' + (L.length - n3) + ' · 이 날 들어온(1일째) ' + nIn + ' = 🆕 처음 ' + nw.length + ' + 벗어났다가 다시 ' + Math.max(0, nIn - nw.length) + ' · ⤴ 폭락까지 갔다가 되올라 와 있는 ' + nUp) + '">깊은 눌림 <b style="color:#f87171">' + L.length + '</b> · <span style="color:#f87171">③' + n3 + '</span> <span style="color:#dc2626">④' + (L.length - n3) + '</span>' + (nUp ? ' <span style="color:#c084fc">⤴' + nUp + '</span>' : '') + '</div>';
      var sc = nw.length ? mnScore(k, flt) : null;
      var line = '<span style="color:#ffcf8a" title="🆕 = 이 날 종가로 깊은 눌림에 처음 들어온 종목(📝 채점 📉 줄 = 다음 거래일 시가에 산다고 보고 채점)">🆕 <b>' + nw.length + '</b></span>';
      if (sc && sc.n) line += ' <span title="' + E('🆕 ' + sc.n + '종목을 ' + md(sc.kb) + ' 시가에 샀다면(📝 채점 ' + FLT_NM[flt] + ' 줄 · 같은 자 +20% / −10% / 20거래일 · 종목마다 1번)') + '">· <b style="color:' + (sc.T ? '#ffd166' : '#55597f') + '">★' + sc.T + '</b> <span style="color:' + (sc.S ? '#7ea6ff' : '#55597f') + '">✕' + sc.S + '</span> ' + (sc.avg != null ? pct(sc.avg, 1) : '') + (sc.H ? ' <span style="color:#ffc454;font-size:10px">⏳' + sc.H + '</span>' : '') + (sc.P ? ' <span style="color:#7ee8ff;font-size:10px">예정 ' + sc.P + '</span>' : '') + '</span>';
      inner += '<div style="font-size:11px;margin-top:2px;white-space:nowrap;overflow:hidden">' + line + '</div>';
      if (nw.length) {
        var stv = (sc && sc.st) || {}, ord = nw.slice().sort(function (a, b) { return (stv[b[0]] === 'T' ? 1 : 0) - (stv[a[0]] === 'T' ? 1 : 0); });
        inner += '<div style="font-size:10.5px;color:#ffe9a8;white-space:nowrap;overflow:hidden;text-overflow:ellipsis" title="🆕 종목(★ = +20% 닿음 먼저 · 그다음 깊은 순) · 전부는 칸을 누르면">' + ord.slice(0, 2).map(function (r) { var x = stv[r[0]]; return (x === 'T' ? '★' : (x === 'S' ? '<span style="color:#7ea6ff">✕</span>' : '')) + E(r[1] || r[0]); }).join(' · ') + (nw.length > 2 ? ' <span style="color:#8487bd">외 ' + (nw.length - 2) + '</span>' : '') + '</div>';
      }
    }
    var b = mnBtn(k, d, otherMonth, dow);
    var click = L.length ? ' onclick="openMnlDeep(\'' + k + '\')" style="cursor:pointer" title="' + E(k + ' · 누르면 깊은 눌림 종목 전부(📌 머무는 전부 창)') + '"' : '';
    return '<div class="' + cls + '" data-date="' + k + '"' + click + '>' + inner + b + '</div>';
  }
  (function () {
    if (typeof W.buildMnlCell !== 'function') return;
    var prev = W.buildMnlCell;
    if (W.MNL_FULL == null) W.MNL_FULL = false;   // true = 예전 긴 칸(깊은 눌림 종목 8줄 + ▾ 더 · 📅📆 단추는 붙임)
    W.buildMnlCell = function (d, k, list, otherMonth, dow) {
      if (!W.MNL_FULL) { try { return mnCell(d, k, list, otherMonth, dow); } catch (e) { console.warn('📝 채점 📉 월간눌림 간략 칸', e); } }
      var html = prev(d, k, list, otherMonth, dow), b = mnBtn(k, d, otherMonth, dow);
      if (!b) return html;
      var i = html.lastIndexOf('</div>');
      return i < 0 ? html : html.slice(0, i) + b + html.slice(i);
    };
    mnRedraw();
  })();
  // ── 🏅 베스트 달력 = 📅 주간 · 📆 월간(2026-10-11 사용자 "베스트 달력에도 주간, 월간 버튼 넣어줘") ──
  //   칸 = 매수일 = 📝 채점 🏅 줄과 같은 날(2026-10-11 확인 = 1위패턴 10/1 · 10/6 · 어사이드1 10/1 종목 같음) → gradePeriod('W<토>|be') · ('M<YYYY-MM>|be') · 날짜 단추 = openBestDetail
  //   이 달력 칸은 어사이드16~52_뷰.js · 베스트_간략보기.js(이 파일 뒤에 읽힘)가 여러 겹 감싸고 간략 보기 CSS 가 칸 안 다른 줄을 숨김 → 칸 함수를 감싸지 않고
  //   그려진 칸의 날짜 글자(.cell-day) 안에 단추를 넣는다(MutationObserver · 간략 보기 켬/끔 둘 다 보임 · 간략 보기 묶음 칩으로 안 셈)
  function beWeekBtn(sat) {
    var w = weekDays(sat).filter(function (k) { return pHas(k, 'be'); });
    if (!w.length) return '';
    return '<button class="cell-bubble-btn be-gw" style="' + BUB_W + '" onclick="event.stopPropagation();gradePeriod(\'W' + sat + '|be\')" title="' + E('📅 주간 결산 ' + md(w[0]) + '~' + md(w[w.length - 1]) + ' = 그 주 🏅 베스트 매매법(1위패턴 · 어사이드1~51)이 고른 종목(많이 나온 순) · 테마 · 같은 자 채점') + '">📅</button>';
  }
  function beMonthBtn(ym) {
    var m = monthDays(ym).filter(function (k) { return pHas(k, 'be'); });
    if (!m.length) return '';
    return '<button class="cell-bubble-btn be-gw" style="' + BUB_M + '" onclick="event.stopPropagation();gradePeriod(\'M' + ym + '|be\')" title="' + E('📆 월간 결산 ' + (+ym.slice(5, 7)) + '월 = 그 달 🏅 베스트 매매법이 고른 종목 · 테마 · 같은 자 채점 · 첫 일요일 1개') + '">📆</button>';
  }
  function beDecorate() {
    var v = document.getElementById('best-view'); if (!v) return;
    v.querySelectorAll('.cal-cell[data-date]').forEach(function (c) {
      if (c.getAttribute('data-gw') || c.querySelector('.be-gw')) return;
      var k = c.getAttribute('data-date') || '', p = k.split('-'); if (p.length !== 3) return;
      var dt = new Date(+p[0], +p[1] - 1, +p[2]), dow = dt.getDay(), b = '';
      if (dow === 6) b = beWeekBtn(k); else if (dow === 0 && !c.classList.contains('other-month') && dt.getDate() <= 7) b = beMonthBtn(k.slice(0, 7));
      c.setAttribute('data-gw', b ? '1' : '0');
      if (!b) return;
      var host = c.querySelector(':scope > .cell-day') || c;
      host.insertAdjacentHTML('beforeend', b);
    });
  }
  (function () {
    var v = document.getElementById('best-view'); if (!v || typeof MutationObserver === 'undefined') return;
    var pend = false;
    var go = function () { if (pend) return; pend = true; setTimeout(function () { pend = false; try { beDecorate(); } catch (e) { console.warn('📝 채점 🏅 베스트 결산 단추', e); } }, 0); };
    new MutationObserver(go).observe(v, {childList: true, subtree: true});
    go();
  })();
  // ── 📺 유튜브 달력 = 📅 주간 · 📆 월간(2026-10-11 사용자 "유튜부 달력에도 주간, 월간 버튼 넣어줘") ──
  //   유튜브_뷰.js render 가 칸마다 window.ytCellBtn(날짜, 일, 요일) 를 부른다 · 토요일 = 📅 그 주(일~토) · 첫 일요일 = 📆 그 달 · 그 기간에 종목 말한 영상이 있을 때만
  //   창 = gradePeriod('W<토>|ytu') · ('M<YYYY-MM>|ytu') = 위 ytAgg(올린 날 칸 · 채널 = 판 · 채점 = 올린 뒤 첫 시가 줄) · 날짜 단추 = ytPick(그날 영상 창)
  W.ytCellBtn = function (k, d, dow) {
    try {
      if (dow === 6) {
        var w = weekDays7(k).filter(ytHas); if (!w.length) return '';
        return '<button class="cell-bubble-btn" style="' + BUB_W + '" onclick="event.stopPropagation();gradePeriod(\'W' + k + '|ytu\')" title="' + E('📅 주간 결산 ' + md(w[0]) + '~' + md(w[w.length - 1]) + ' = 그 주(일~토) 📺 영상이 말한 국내 종목(많이 나온 순) · 채널 · 테마 · 같은 자 채점(올린 뒤 첫 시가)') + '">📅</button>';
      }
      if (dow === 0 && d <= 7) {
        var ym = k.slice(0, 7), m = monthDays(ym).filter(ytHas); if (!m.length) return '';
        return '<button class="cell-bubble-btn" style="' + BUB_M + '" onclick="event.stopPropagation();gradePeriod(\'M' + ym + '|ytu\')" title="' + E('📆 월간 결산 ' + (+ym.slice(5, 7)) + '월 = 그 달 📺 영상이 말한 국내 종목 · 채널 · 테마 · 같은 자 채점 · 첫 일요일 1개') + '">📆</button>';
      }
    } catch (e) { console.warn('📝 채점 📺 결산 단추', e); }
    return '';
  };
  try { var syt = document.getElementById('sec-yt'); if (syt && syt.innerHTML && typeof W.ytYear === 'function') W.ytYear(0); } catch (e) { }   // 이미 그려졌으면 단추 붙여 다시(상태 그대로)
  // ── 🌅 주도3안 달력 = 📅 주간 · 📆 월간(2026-10-11 사용자 "진행" = 채점에 연결된 달력 중 결산 단추가 없는 마지막 하나) ──
  //   주도섹터3안_뷰.js render 가 칸마다 window.js3CellBtn(날짜, 일, 요일) 를 부른다 · 칸 = 카드 날 = 📝 채점 🌅 줄과 같은 날(2026-10-11 확인 = 10/1 · 10/6 · 10/8 대표 3종목 같음 · 밀기 없음)
  //   토요일 = 📅 그 주(월~금) · 첫 일요일 = 📆 그 달 · 그 기간에 🌅 채점 줄이 있을 때만 · 창 = gradePeriod('W<토>|j3') · ('M<YYYY-MM>|j3') · 판 = 🌅① 대표 · 🌅② 관련주 · 🌅X① · 🌅X② · 🌅🏅 관찰후보5 · 날짜 단추 = js3Pick
  W.js3CellBtn = function (k, d, dow) {
    try {
      if (dow === 6) {
        var w = weekDays(k).filter(function (x) { return pHas(x, 'j3'); }); if (!w.length) return '';
        return '<button class="cell-bubble-btn" style="' + BUB_W + '" onclick="event.stopPropagation();gradePeriod(\'W' + k + '|j3\')" title="' + E('📅 주간 결산 ' + md(w[0]) + '~' + md(w[w.length - 1]) + ' = 그 주 🌅 주도3안 카드 종목(대표 · 관련주 · X · 🏅 관찰후보5 · 많이 나온 순) · 테마 · 같은 자 채점') + '">📅</button>';
      }
      if (dow === 0 && d <= 7) {
        var ym = k.slice(0, 7), m = monthDays(ym).filter(function (x) { return pHas(x, 'j3'); }); if (!m.length) return '';
        return '<button class="cell-bubble-btn" style="' + BUB_M + '" onclick="event.stopPropagation();gradePeriod(\'M' + ym + '|j3\')" title="' + E('📆 월간 결산 ' + (+ym.slice(5, 7)) + '월 = 그 달 🌅 주도3안 카드 종목 · 테마 · 같은 자 채점 · 첫 일요일 1개') + '">📆</button>';
      }
    } catch (e) { console.warn('📝 채점 🌅 결산 단추', e); }
    return '';
  };
  try { var sj3 = document.getElementById('sec-js3'); if (sj3 && sj3.innerHTML && typeof W.js3Year === 'function') W.js3Year(0); } catch (e) { }   // 이미 그려졌으면 단추 붙여 다시(상태 그대로)
  W.__grade = {render: render, rankHTML: rankHTML, monthTotals: monthTotals, dayHits: dayHits, weekAgg: weekAgg, monthAgg: monthAgg, G: G};
  function boot() {
    if (!G.y) { var l = latestYM(); G.y = l[0]; G.m = l[1]; }
    try { render(); } catch (e) { console.warn('📝 채점 달력 그리기 실패', e); }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { setTimeout(boot, 0); }); else setTimeout(boot, 0);
  W.addEventListener('load', function () { var s = document.getElementById('sec-grade'); if (s) keepLast(s); });   // 페이지가 다 읽힌 뒤에도 맨 아래 한 번 더 확인
})();
