// 🕸 테마 생태계 지도 = 전체 테마를 같은 두 구(球)에(왼쪽 한 색 · 오른쪽 국면 색 · 2026-09-29) → 테마 누르면 그 안 종목으로 파고들기 · Canvas 구형 배치·드래그 회전·휠 확대·자동회전(호두 대시보드 graph.js 방식을 우리 자료로)
(function () {
  'use strict';
  var LABEL_H = 17, PAD = 4;
  function esc(s){ return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
  function cut(s, n){ s = String(s == null ? '' : s); return s.length > n ? s.slice(0, n - 1) + '…' : s; }
  function ym(d){ return d ? d.slice(2, 7).replace('-', '/') : ''; }
  function clamp(v, a, b){ return Math.min(b, Math.max(a, v)); }
  function assigned(f){ return f && f !== '미배정(역할표 밖)' && f !== '원문 테마'; }
  function fib(i, n){                                   // 구 표면에 고르게 흩은 점 (보기 위한 배치일 뿐)
    var y = 1 - (2 * (i + 0.5)) / n, r = Math.sqrt(Math.max(0, 1 - y * y)), t = i * 2.399963229728653;
    return [Math.cos(t) * r, y, Math.sin(t) * r];
  }
  function cross(a, b){ return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; }
  function norm(v){ var l = Math.hypot(v[0], v[1], v[2]) || 1; return [v[0] / l, v[1] / l, v[2] / l]; }
  function scale3(v, s){ return [v[0] * s, v[1] * s, v[2] * s]; }

  // ───────── 상태 하나(한 화면에 지도 하나) ─────────
  var S = {box: null, cv: null, ctx: null, mode: 'overview', theme: '', nodes: [], edges: [], byId: {},
           rotX: -0.35, rotY: 0.5, zoom: 1, auto: false, drag: null, hover: null, sel: null,
           w: 0, h: 0, dpr: 1, raf: 0, view: 'map', filter: 'all', all: false,
           layers: {}, hideGuess: false, panelOpen: true};   // 층 거르개 · 추정(점선) 숨기기 · 상세 패널 펼침
  S.hist = []; S.restoring = false; S.pendingSel = null;     // ◀ 뒤로 = 누르기·들어가기 전 상태 쌓기(2026-09-23 사용자)
  try { S.layers = JSON.parse(localStorage.getItem('te_layers') || '{}') || {}; S.hideGuess = localStorage.getItem('te_hide_guess') === '1'; S.panelOpen = localStorage.getItem('te_panel') !== '0'; } catch (e) {}

  function TE(){ return (window.__TE && window.__TE.themes) || {}; }
  // 테마생태계.js 가 도착하면 「te-ready」 한 번 = 🗺 마인드맵·🗂 카드가 같은 국면으로 다시 그린다(어느 로더가 불러도 같다 · 2026-09-23 세 화면 통일 A)
  (function(){
    var v = window.__TE, fire = function(){ setTimeout(function(){ try { document.dispatchEvent(new Event('te-ready')); } catch (e) {} }, 0); };
    try { Object.defineProperty(window, '__TE', {configurable: true, get: function(){ return v; }, set: function(x){ v = x; if (x && x.themes) fire(); }}); } catch (e) {}
    if (v && v.themes) fire();
  })();
  // D = 구 기본은 🗺·🗂 와 같은 88메타 · 메타로 안 묶인 원문 이름(240)은 「켜기」 · 옛 파일(메타 표시 없음)이면 전부
  try { S.raw = localStorage.getItem('te_raw') === '1'; } catch (e) { S.raw = false; }
  // ◎ 한 번 누르면 그 점과 바로 이어진 것만 남긴다(사용자 2026-09-23 「반도체만 누르면 거기 연결된 것만」) · 빈 곳 누르면 전부 · 「누르면 연결만」 칸으로 끔
  try { S.focus = localStorage.getItem('te_focus') !== '0'; } catch (e) { S.focus = true; }
  // ◎ 안에서 한 번 누르면 그 점과 바로 이어진 것만 + 가운데(어디 속한지) · 가운데를 누르면 전부 · 빈 곳 누르면 전부
  //   ★전체 구에서 테마를 누르면 겹치는 다른 테마가 아니라 그 테마 안(세부분야 + 종목)으로 들어간다(사용자 2026-09-23 「로봇을 클릭했으면 로봇만」)
  function focusSet(){
    if (!S.focus || !S.sel || !S.byId[S.sel] || S.byId[S.sel].center) return null;
    var f = {}; f[S.sel] = 1;
    S.nodes.forEach(function(n){ if (n.center) f[n.id] = 1; });
    S.edges.forEach(function(e){ if (S.hideGuess && e.k === 'dash') return; if (e.a === S.sel) f[e.b] = 1; else if (e.b === S.sel) f[e.a] = 1; });
    return f;
  }
  function shown(){ var T = TE(), ks = Object.keys(T), meta = ks.filter(function(k){ return T[k].메타; }); return (S.raw || !meta.length) ? ks : meta; }
  function rawN(){ var T = TE(); return Object.keys(T).filter(function(k){ return !T[k].메타; }).length; }
  function strTxt(k){ return String(k || '').replace(/[🔴🟡🟢]/g, '').trim(); }   // B = 강도 등급은 글자만(빨강·초록은 국면만 쓴다)

  // ───────── 색 = 국면(지금 돈이 도는가) · 빌더가 테마마다 「국면」 칸을 싣는다 · 정의·측정 = _생태계\_국면색_측정.py ─────────
  // ★전에는 이름 해시(328 중 240테마는 색에 뜻 0)·분야 순서 번호였다(2026-09-23 사용자 「색을 의미 있게 바꿔」)
  // ★눈에 띄는 색은 둘뿐 = 주도 빨강 · 급증 초록(🗺 테마 마인드맵의 주도 #ef4444 · 후보⚡ #22c55e 와 같은 뜻 같은 색) · 나머지는 밝기 = 밝을수록 최근
  //   (처음엔 급증 주황 · 20일 노랑 · 60일 하늘로 칠했다가 마인드맵 「조용」 주황 · 종목 구 뉴스 노랑 · 동행 하늘과 부딪혀 바꿈)
  var ST = {'주도': ['#ef4444', '주도'], '급증': ['#22c55e', '급증'], '20일': ['#eef1ff', '20일 안'], '60일': ['#a3add9', '60일 안'],
            '1년': ['#6b7280', '1년 안'], '오래': ['#474d68', '그 전'], '없음': ['#2f3450', '카드 없음'], '테마아님': ['#8d7b68', '테마 아님']};
  var HEAT = ['20일', '60일', '1년', '오래', '없음'];      // 종목 쪽 뜨거운 순
  // ★두 구(2026-09-29 사용자 「같은 것인데 하나는 색 없음 · 하나는 주도·뜨는·죽은 테마를 색으로 · 두 생태계가 같아야」) = 점·자리·크기·선·회전·누르기가 같고 색만 다르다
  //   왼쪽 = 한 색 · 오른쪽 = 4단계(6단계 국면을 화면에서만 합친다 = 자료·🗺·🗂·폰 · _테마국면색 은 그대로) · 살아있음 = 마지막 등장이 d60(60거래일) 안 · 죽음 = 그 전
  var C_PLAIN = '#8fa8ff';
  var ST4 = {'주도': ['#ef4444', '주도'], '급증': ['#22c55e', '뜨는'], '살아있음': ['#e3e7fb', '살아있음'], '죽음': ['#4a5070', '죽음'], '테마아님': ['#8d7b68', '개별(테마 아님)']};
  function st4(s){ return (s === '주도' || s === '급증' || s === '테마아님') ? s : (s === '20일' || s === '60일') ? '살아있음' : '죽음'; }
  function dot4(k){ return '<span style="color:' + ST4[k][0] + '">●</span>'; }
  function isIndiv(k){ return phOf(k).상태 === '테마아님'; }   // 개별이슈·일부·특징주 = 빌더 EXCL 이 준 상태(이름을 여기 따로 적지 않는다)
  function y1Of(k){                                     // 크기 = 최근 1년(국면 d250 이후) 이 테마로 카드에 오른 종목 수 · 옛 파일(d250 없음)이면 4년 종목 수
    var t = TE()[k], d = PH().d250; if (!t) return 0; if (!d) return t.n종목 || 0;
    return (t.종목 || []).filter(function(x){ return x[4] && x[4] >= d; }).length;
  }
  // 🎯 국면 거르개(2026-09-29 사용자 「주도 누르면 아래 생태계 2개에서 그것만 · 뜨는·살아있음·죽음도」) = 전체 구에서만 · ★자리는 그대로(점만 숨김) · 같은 칸 다시 누르면 전부
  S.stFilter = null;
  function stHidden(n){ return !!(S.stFilter && S.mode === 'overview' && n.type === 'theme' && (n.fix2d != null || st4(n.st) !== S.stFilter)); }
  // 👑 테마 안 종목 강도(2026-09-29 사용자 「종목도 강한 순으로 색 · 대장주가 무엇인지 · 캘린더에 정답이 있다」) = 빌더 leaders() 순위
  //   = 캘린더 결산 🚀 규칙(출현일 등락률 누적 · 같은 날 최고 1개)을 테마 안에서 · 기간 = 테마가 카드에 마지막 오른 날까지 20거래일 · 오른쪽 구만 색(왼쪽은 한 색)
  var LV = [['#ef4444', '👑 대장(1위)'], ['#f97316', '2~3위'], ['#facc15', '4~10위'], ['#e3e7fb', '11위~'], ['#4a5070', '기간 안 카드 없음']];
  var RKC = {};
  function ldOf(th){ var t = TE()[th]; return (t && t.대장) || null; }
  function rkMap(th){ if (!RKC[th]) { var L = ldOf(th), m = {}; if (L) L.순위.forEach(function(r, i){ m[r[0]] = i + 1; }); RKC[th] = m; } return RKC[th]; }
  function lvOfRank(k){ return !k ? 4 : k === 1 ? 0 : k <= 3 ? 1 : k <= 10 ? 2 : 3; }
  function dotL(lv){ return '<span style="color:' + LV[lv][0] + '">●</span>'; }
  function pctS(v){ return (v >= 0 ? '+' : '') + Number(v).toFixed(1) + '%'; }
  function leaderTable(th){                               // 패널 = 강한 순 표(15개) · 줄을 누르면 그 종목(테마 안이면 두 구에서 고르기 · 밖이면 종목 구)
    var L = ldOf(th);
    if (!L) return '<div style="margin-top:8px;color:#8487bd">👑 강한 순 = 이 테마 카드 기록 없음</div>';
    if (!L.순위.length) return '<div style="margin-top:8px;color:#8487bd">👑 강한 순 = 순위 없음 <span style="color:#6f72a8">(' + esc(L.기간[0]) + ' ~ ' + esc(L.기간[1]) + ' 카드 행에서 종목 코드나 등락률을 못 찾음)</span></div>';
    var when = L.전 ? '<b style="color:#ffbe8c">' + L.전 + '거래일 전에 끝난 마지막 사이클</b>' : '지금', top = L.순위.slice(0, 15);
    return '<div style="margin-top:10px;color:#8487bd;line-height:1.5">👑 강한 순 <span style="color:#6f72a8">(' + esc(L.기간[0]) + ' ~ ' + esc(L.기간[1]) + ' = ' + when + ' · 테마 ' + L.테마일 + '일 · 종목 ' + L.종목수 + ' · 출현일 등락률 누적 = 캘린더 결산 🚀 규칙)</span></div>'
      + top.map(function(r, i){
          var lv = lvOfRank(i + 1), inMap = S.mode === 'theme' && S.theme === th && S.byId['S:' + r[0]];
          return '<div class="te-pa" data-a="' + (inMap ? 'sel' : 'stock') + '" data-v="' + esc(inMap ? 'S:' + r[0] : r[0]) + '" title="누르면 ' + (inMap ? '두 구에서 이 종목 고르기' : '이 종목 구로') + '" style="display:flex;gap:6px;align-items:baseline;cursor:pointer;padding:3px 0;border-bottom:1px solid rgba(255,255,255,.04)">'
            + '<span style="min-width:24px;color:' + LV[lv][0] + ';font-weight:800">' + (i === 0 ? '👑' : (i + 1)) + '</span>'
            + '<span style="flex:1;min-width:0;color:#f2f4ff;font-weight:' + (i < 3 ? 700 : 400) + '">' + esc(r[1]) + (r[0] === L.최다 ? ' <span title="출현일 최다(캘린더 결산 📊)" style="font-size:10px;color:#7ee8ff;font-weight:400">📊최다</span>' : '') + '</span>'
            + '<span style="color:' + (r[2] >= 0 ? '#ff7a7a' : '#6ea0ff') + ';font-weight:700">' + pctS(r[2]) + '</span>'
            + '<span style="color:#8b8fb5;font-size:10.5px;white-space:nowrap">' + r[3] + '일 · 최고 ' + Number(r[4]).toFixed(1) + (r[4] > 30.5 ? '<span title="일일 상한가(+30%) 초과 = 신규상장 첫날 등 · 입력 기준이 다를 수 있음(캘린더 결산과 같은 표시)">⚠</span>' : '') + ' · ' + esc(String(r[5]).slice(5)) + '</span></div>';
        }).join('')
      + (L.순위.length > top.length ? '<div style="color:#6f72a8">… 그 밖 ' + (L.순위.length - top.length) + '종목(오른쪽 구 흰 점)</div>' : '')
      + '<div style="color:#6f72a8;font-size:10.5px;margin-top:4px">등락률 = 카드 입력값(천프정 종가 아님) · 누적 = 출현일마다 그날 최고 1개를 더함 · 표본이 작으면(1~3일) 상한가 한 번에 순위가 바뀐다 · 매수신호 아님</div>';
  }
  function PH(){ return (window.__TE && window.__TE.meta && window.__TE.meta.국면) || {}; }
  function phOf(th){ var t = TE()[th]; return (t && t.국면) || {상태: '없음'}; }
  function stCol(s){ return (ST[s] || ST['없음'])[0]; }
  function stLab(s){ return (ST[s] || ST['없음'])[1]; }
  function recency(d){                                  // 종목이 이 테마로 카드에 마지막 오른 날 → 칸(기준 = 빌더가 적은 20·60·250 거래일 전 날짜)
    var B = PH(); if (!d) return '없음'; if (!B.d20) return '오래';
    return d >= B.d20 ? '20일' : d >= B.d60 ? '60일' : d >= B.d250 ? '1년' : '오래';
  }
  function dot(s){ return '<span style="color:' + stCol(s) + '">●</span>'; }
  function phText(th){                                  // 패널·머리줄 한 줄 = 상태 · 20일 중 며칠 · 5일 · 마지막
    var g = phOf(th), s = g.상태;
    if (s === '없음') return dot(s) + ' 카드 없음(역할표에만 있음)';
    return dot(s) + ' <b style="color:' + stCol(s) + '">' + stLab(s) + (g.순위 ? ' ' + g.순위 + '위' : '') + '</b> · 20거래일 중 ' + (g.r20 || 0) + '일 · 최근 5일 ' + (g.r5 || 0) + '일(직전 15일 ' + (g.p15 || 0) + '일) · 마지막 ' + esc(g.마지막 || '-') + (g.전 ? '(' + g.전 + '거래일 전)' : '(기준일)');
  }

  // ★자리 = 메가 묶음별 고정(2026-09-29 · 전엔 종목 수 순위로 3겹이라 순위가 바뀌면 자리가 바뀌었다) · 묶음 이름순 → 구 위 자리 · 묶음 안은 테마 이름순
  //   묶음 = 작은 공(가운데 0.7 · 반지름 0.1×∛테마수 · 8개 넘으면 20% 는 안쪽 0.45) · 시험(9/28 자료) = 같은 묶음 최소 26px · 다른 묶음 최소 54px(폭 480 기준) · 바깥 끝 1.0 = 옛 구와 같은 크기
  //   개별(테마 아님) = 구 밖 왼쪽 아래 칸(fix2d) · 크기 경쟁·겹침 선 없음 · 원문 이름(메가 없음 · 켜기 칸) = 바깥 껍질 1.0
  function byName(a, b){ return a < b ? -1 : a > b ? 1 : 0; }
  function buildOverview(){
    var T = TE(), ks = shown().sort(byName), nodes = [], groups = {}, gnames = [], raw = [], indiv = [];
    ks.forEach(function(k){
      if (isIndiv(k)) { indiv.push(k); return; }
      if (!T[k].메타) { raw.push(k); return; }
      var m = T[k].메가 || '메가 없음';
      if (!groups[m]) { groups[m] = []; gnames.push(m); }
      groups[m].push(k);
    });
    gnames.sort(byName);
    var mk = function(k, p, extra){
      var y1 = y1Of(k), o = {id: 'T:' + k, type: 'theme', name: k, n: y1, n4: T[k].n종목, 배정: T[k].n배정, 메가: T[k].메가 || '',
                             st: phOf(k).상태, col: stCol(phOf(k).상태), p: p, r0: 3 + Math.sqrt(y1) * 0.75};
      for (var q in extra) o[q] = extra[q];
      nodes.push(o);
    };
    S.anchors = [];                                     // 묶음 이름표 = 묶음 공 위에 흐리게(누르는 점 아님)
    gnames.forEach(function(m, gi){
      var c = scale3(fib(gi, gnames.length), 0.7), arr = groups[m], n = arr.length, R = 0.1 * Math.cbrt(n);
      var nin = n >= 8 ? Math.round(n * 0.2) : 0, nout = n - nin;
      arr.forEach(function(k, i){
        var inner = i < nin, j = inner ? i : i - nin, cnt = inner ? nin : nout, d = cnt === 1 ? [0, 0, 0] : fib(j, cnt), rr = inner ? R * 0.45 : R;
        mk(k, [c[0] + d[0] * rr, c[1] + d[1] * rr, c[2] + d[2] * rr], {묶음: m});
      });
      S.anchors.push({name: m, p: c, R: R});
    });
    raw.forEach(function(k, i){ mk(k, fib(i, raw.length), {원문: 1}); });
    indiv.forEach(function(k, i){ mk(k, [0, 0, 0], {fix2d: i, r0: 5}); });
    S.nodes = nodes;
    S.byId = {}; S.nodes.forEach(function(n){ S.byId[n.id] = n; });
    var E = (window.__TE && window.__TE.edges) || [];
    // ★선 종류 = k 'solid'(확정 · 저장된 관계) / 'dash'(추정) · 테마끼리 선은 「같은 종목이 두 테마에 다 올랐다」는 ★통계라 추정
    // ★개별 칸 점은 선 없음(사용자 「개별은 개별로 따로」 · 9/28 선 474 중 87 이 개별에 걸려 구 전체를 가로질렀다)
    S.edges = E.filter(function(e){ var a = S.byId['T:' + e[0]], b = S.byId['T:' + e[1]]; return a && b && a.fix2d == null && b.fix2d == null; })
                .map(function(e){ return {a: 'T:' + e[0], b: 'T:' + e[1], n: e[2], k: 'dash', why: '겹치는 종목 ' + e[2] + '개(통계 · 추정)'}; });
  }

  function rowsOf(T){
    var r = T.종목 || [];
    if (S.filter === 'role') return r.filter(function(x){ return assigned(x[2]); });
    if (S.filter === 'card') return r.filter(function(x){ return x[3] > 0; });
    if (S.filter === 'y1') { var c = new Date(Date.now() - 365 * 864e5).toISOString().slice(0, 10); return r.filter(function(x){ return x[4] && x[4] >= c; }); }
    return r;
  }

  // 테마 안 = ★호두 overview 구조 그대로 = 세부분야가 허브(안쪽 구 0.55) · 그 분야 종목이 허브 둘레(바깥 1.0)에 접선 링으로. 가운데는 테마.
  function fieldsOf(x){ return assigned(x[2]) ? x[2].split(' · ').filter(function(f){ return f; }) : ['카드로만 엮임']; }
  // 분야 순서 = 본업 분야 → 「실제 공급(본업 20% 미만·비중 미공개)」 → 기타·카드로만 엮임(2026-09-23 세 번째 칸)
  function fieldRank(k){ return (k === '카드로만 엮임' || k === '기타') ? 2 : k.indexOf('실제 공급(') === 0 ? 1 : 0; }
  function buildTheme(th){
    var T = TE()[th]; if (!T) { buildOverview(); return; }
    var list = rowsOf(T), order = [], bag = {}, home = {}, RK = rkMap(th);   // RK = 코드 → 이 테마 안 강한 순위(👑)
    // ★여러 분야에 든 종목(두산에너빌리티 = SMR + 주기기 등)은 모든 분야 허브에 잇고 점은 첫 분야 자리에 한 번(2026-09-23 사용자 「로봇도 분야가 많은데」 · 전엔 첫 분야에만 붙었다)
    list.forEach(function(x){
      fieldsOf(x).forEach(function(k, fi){
        if (!bag[k]) { bag[k] = []; home[k] = []; order.push(k); }
        bag[k].push(x); if (fi === 0) home[k].push(x);
      });
    });
    order.sort(function(a, b){
      return fieldRank(a) - fieldRank(b) || bag[b].length - bag[a].length;
    });
    var center = {id: 'T:' + th, type: 'theme', name: th, n: T.n종목, 메가: T.메가 || '', st: phOf(th).상태, col: stCol(phOf(th).상태), p: [0, 0, 0], r0: 17, center: 1};
    var nodes = [center], edges = [], hubOf = {};
    order.forEach(function(k, gi){
      // 분야 허브 색 = 그 분야에서 가장 최근에 이 테마로 오른 종목의 칸(「이 분야가 지금 움직이나」)
      // 분야 허브 색 = 그 분야에서 가장 강한 종목의 칸(👑 강도 · 2026-09-29 · 전엔 가장 최근 종목의 밝기)
      var arr = bag[k], place = home[k], hot = HEAT[Math.min.apply(null, arr.map(function(x){ return HEAT.indexOf(recency(x[4])); }))];
      var hlv = Math.min.apply(null, arr.map(function(x){ return lvOfRank(RK[x[0]]); })), col = LV[hlv][0];
      var d = fib((gi * 7 + 3) % order.length, order.length);
      var hub = {id: 'F:' + k, type: 'field', name: k, n: arr.length, st: hot, lv: hlv, col: col, p: scale3(d, 0.55), r0: 5 + Math.sqrt(arr.length) * 0.9, hub: 1, theme: th};
      var cardOnly = k === '카드로만 엮임';
      hub.guess = cardOnly; hubOf[k] = hub;
      nodes.push(hub); edges.push({a: center.id, b: hub.id, n: arr.length, k: cardOnly ? 'dash' : 'solid', why: cardOnly ? '역할표 밖 = 4년 카드로만 엮임(추정)' : '역할표 세부분야(확정)'});
      var t1 = norm(Math.abs(d[1]) < 0.9 ? cross(d, [0, 1, 0]) : cross(d, [1, 0, 0])), t2 = cross(d, t1);
      var m = place.length, rings = Math.max(1, Math.min(4, Math.round(Math.sqrt(m / 6))));   // 145개가 한 링에 몰리면 떡이 되므로 여러 겹
      var per = Math.max(1, Math.ceil(m / rings));
      place.forEach(function(x, i){
        var ring = Math.floor(i / per), inR = Math.min(per, m - ring * per), j = i % per;
        var a = 2 * Math.PI * (j + (ring % 2) * 0.5) / inR, off = 0.2 + ring * 0.13;
        var p = norm([d[0] + off * (Math.cos(a) * t1[0] + Math.sin(a) * t2[0]),
                      d[1] + off * (Math.cos(a) * t1[1] + Math.sin(a) * t2[1]),
                      d[2] + off * (Math.cos(a) * t1[2] + Math.sin(a) * t2[2])]);
        var nd = {id: 'S:' + x[0], type: 'stock', code: x[0], name: x[1] || x[0], 분야: x[2], n: x[3], 최근: x[4],
                  st: recency(x[4]), rk: RK[x[0]] || 0, lv: lvOfRank(RK[x[0]]), col: LV[lvOfRank(RK[x[0]])][0], p: p, r0: 3.6 + Math.sqrt(x[3] || 0) * 0.85, theme: th};
        nd.guess = !assigned(x[2]);
        nodes.push(nd);
      });
    });
    // 선 = 분야 허브 → 그 분야 종목 전부(여러 분야면 허브마다 한 줄)
    order.forEach(function(k){
      var hub = hubOf[k];
      bag[k].forEach(function(x){
        var sure = assigned(x[2]), many = fieldsOf(x).length > 1;
        edges.push({a: hub.id, b: 'S:' + x[0], n: x[3], k: sure ? 'solid' : 'dash', why: sure ? '역할표 배정 = ' + k + (many ? '(여러 분야 중 하나 · 확정)' : '(확정)') : '4년 카드에 이 테마로 ' + x[3] + '회 올랐을 뿐 · 역할표 밖(추정)'});
      });
    });
    S.nodes = nodes; S.edges = edges;
    S.byId = {}; S.nodes.forEach(function(n){ S.byId[n.id] = n; });
  }

  // ───────── 📄 공시 지도 · 📌 종목 구 = 호두 overview/focus 를 우리 자료로 ─────────
  // 호두 규칙(app/main.py 직독) = 한 쪽에 기업 24곳 · 기업마다 최근 공시 8건(접수일 최신순) · 이전/다음 = 24곳씩. 같은 숫자를 쓴다.
  var PAGE = 24, PER = 8, C_STOCK = '#2dd4bf', C_FILING = '#a78bfa';
  function stockE(code){ return window['__E_' + code] || null; }
  function loadStocks(codes, cb){                       // 종목 생태계 파일을 한 번씩만 · 실패도 「끝남」으로 센다(하나 실패로 그림이 영영 안 뜨는 것 방지)
    var left = 0, fail = [];
    codes.forEach(function(c){
      if (stockE(c)) return;
      left++;
      var s = document.createElement('script'); s.src = 'dashboard/data/생태계/' + c + '.js';
      s.onload = function(){ if (--left === 0) cb(fail); };
      s.onerror = function(){ fail.push(c); if (--left === 0) cb(fail); };
      document.head.appendChild(s);
    });
    if (left === 0) cb(fail);
  }
  function ring(d, arr, off0, mk){                      // 허브 d 둘레 접선 링(호두 방식) · 많으면 겹을 늘린다
    var t1 = norm(Math.abs(d[1]) < 0.9 ? cross(d, [0, 1, 0]) : cross(d, [1, 0, 0])), t2 = cross(d, t1);
    var m = arr.length, rings = Math.max(1, Math.min(4, Math.round(Math.sqrt(m / 6)))), per = Math.ceil(m / rings);
    return arr.map(function(x, i){
      var rg = Math.floor(i / per), inR = Math.min(per, m - rg * per), j = i % per;
      var a = 2 * Math.PI * (j + (rg % 2) * 0.5) / inR, off = off0 + rg * 0.12;
      return mk(x, norm([d[0] + off * (Math.cos(a) * t1[0] + Math.sin(a) * t2[0]), d[1] + off * (Math.cos(a) * t1[1] + Math.sin(a) * t2[1]), d[2] + off * (Math.cos(a) * t1[2] + Math.sin(a) * t2[2])]), i);
    });
  }
  function buildFilings(th){                            // 테마 안 종목 24곳 = 안쪽 허브 · 각 종목 최근 공시 8건 = 바깥
    var T = TE()[th], list = rowsOf(T), codes = list.slice(S.page * PAGE, S.page * PAGE + PAGE).map(function(x){ return x[0]; });
    var nodes = [], edges = [], shown = 0, total = 0;
    codes.forEach(function(c, i){
      var E = stockE(c), d = fib((i * 7 + 3) % codes.length, codes.length);
      var nm = (E && E.name) || (list.find(function(x){ return x[0] === c; }) || [c, c])[1];
      var hub = {id: 'S:' + c, type: 'stock', code: c, name: nm, n: E ? (E.공시원문n || (E.공시 || []).length) : 0, col: C_STOCK, p: scale3(d, 0.55), r0: 7, hub: 1};
      nodes.push(hub);
      var F = ((E && E.공시) || []).filter(function(x){ return x.u; }).slice(0, PER);
      total += E ? (E.공시원문n || (E.공시 || []).length) : 0; shown += F.length;
      ring(d, F, 0.2, function(x, p, j){ return {id: 'P:' + c + ':' + j, type: 'filing', name: x.t, d: x.d, u: x.u, col: C_FILING, p: p, r0: 3.4}; })
        .forEach(function(f){ f.stock = nm; nodes.push(f); edges.push({a: hub.id, b: f.id, n: 1, k: 'solid', why: 'DART 공시 제출 법인(확정)'}); });
    });
    S.nodes = nodes; S.edges = edges; S.fcount = {stocks: codes.length, all: list.length, shown: shown, total: total};
    S.byId = {}; S.nodes.forEach(function(n){ S.byId[n.id] = n; });
  }
  function buildStock(code){                            // 종목 하나 = 가운데 · 공시·뉴스·자리·동행·사건 허브 · 각 허브 최근 8
    var E = stockE(code); if (!E) { S.nodes = []; S.edges = []; S.byId = {}; return; }
    // 📉 월간눌림 허브(2026-09-29) = 캘린더 공용 함수가 달력과 같은 자료(월간눌림.js)를 준다 · 아직 안 받았으면 받고 나서 이 종목 구를 다시 그린다(한 번만)
    var MN = (typeof window._월간눌림_동기 === 'function') ? window._월간눌림_동기(code) : [];
    if (MN === null) {
      MN = [];
      if (typeof window._월간눌림_종목 === 'function' && S.mnlWait !== code) {
        S.mnlWait = code;
        window._월간눌림_종목(code, function(){ if (S.mode === 'stock' && S.stock === code) { buildStock(code); render(); redraw(); } });
      }
    }
    // 📈 급등눌림 허브(2026-09-30 사용자 「🕸 종목 구 허브에도 급등눌림 넣어」) = 같은 방식 · 자료 = 급등눌림.js(📈 급등 +20% 이상 · 급등일 종가 대비)
    var MG = (typeof window._급등눌림_동기 === 'function') ? window._급등눌림_동기(code) : [];
    if (MG === null) {
      MG = [];
      if (typeof window._급등눌림_종목 === 'function' && S.gdnWait !== code) {
        S.gdnWait = code;
        window._급등눌림_종목(code, function(){ if (S.mode === 'stock' && S.stock === code) { buildStock(code); render(); redraw(); } });
      }
    }
    var MST = window._월간눌림_단계 || [];
    var center = {id: 'S:' + code, type: 'stock', code: code, name: E.name || code, col: C_STOCK, p: [0, 0, 0], r0: 16, center: 1};   // n 없음 = 라벨에 「 0」 안 붙게
    // 허브 = [층 키, 이름, 색, 전체 목록, 잎 만들기, 선 종류(확정 solid / 추정 dash), 선 이유]
    var newsSure = function(x){ return /^(네이버뉴스|웹근거)/.test(x.src || ''); };   // 제목에 종목명·공급 계약 원문 = 확정 · 장전뉴스 테마 묶음·도구 기사 = 추정
    var ALL = [
      ['공시', '📄 공시', C_FILING, E.공시 || [], function(x){ return {type: 'filing', name: x.t, d: x.d, u: x.u, src: x.src}; },
        function(){ return 'solid'; }, function(){ return 'DART 공시 제출 법인(확정)'; }],
      ['뉴스', '📰 뉴스', '#ffd27a', E.뉴스 || [], function(x){ return {type: 'news', name: x.t, d: x.d, u: x.u, src: x.src, theme: x.테마}; },
        function(x){ return newsSure(x) ? 'solid' : 'dash'; }, function(x){ return newsSure(x) ? (x.src || '') + ' = 제목에 종목명(확정)' : (x.src || '') + (x.테마 ? ' [' + x.테마 + ']' : '') + ' = 테마 관련주로 적혔을 뿐(추정)'; }],
      ['자리', '🗂 테마', '#5effd6', (E.자리 || []), function(x){ return {type: 'seat', name: x.테마, n: x.n, theme: x.테마, 분야: x.분야, 최근: x.최근}; },
        function(x){ return assigned(x.분야) ? 'solid' : 'dash'; }, function(x){ return assigned(x.분야) ? '역할표 배정 = ' + x.분야 + '(확정)' : '4년 카드에 ' + x.n + '회 · 역할표 밖(추정)'; }],
      ['동행', '🤝 동행 종목', '#7ee8ff', E.동행 || [], function(x){ return {type: 'peer', name: x.name || x.code, code: x.code, n: x.n, 최근: x.최근, theme: x.테마}; },
        function(){ return 'dash'; }, function(x){ return '같은 날 같은 카드에 ' + x.n + '회 같이 오름(관찰 · 추정)'; }],
      ['사건', '📅 사건', '#ff9ad2', E.사건 || [], function(x){ return {type: 'event', name: x[0].slice(5) + ' ' + (x[2] > 0 ? '+' : '') + Number(x[2]).toFixed(1) + '% ' + (x[3] || x[1]), d: x[0], 이슈: x[4], 채널: x[1]}; },
        function(){ return 'solid'; }, function(x){ return x[1] === '급등' ? '📈 급등 = 천프정 일봉 +20~35%(그날 카드에 없음 · 확정)' : x[1] + ' 카드 기록(확정)'; }],
      ['기사', '🔗 같은 기사 종목', '#ffb07a', E.기사동행 || [], function(x){ return {type: 'peer2', name: x.name || x.code, code: x.code, n: x.n, 최근: x.최근, 기사: x.기사, u: x.u}; },
        function(){ return 'dash'; }, function(x){ return '같은 장전뉴스 기사에 ' + x.n + '회 같이 나옴(추정)'; }],
      ['눌림', '📉 월간눌림', '#fb923c', MN, function(x){
          var last = x.도달[x.도달.length - 1], st = MST[x.최대];
          return {type: 'mnl', name: x.테마일.slice(2).replace(/-/g, '/') + ' ' + (x.원문[0] || '') + (st ? ' → ' + st.n + ' ' + (last ? last.ret + '%' : '') : ' (① 전)') + (x.지금 ? ' · 지금 ' + x.지금[3] + '%' : ''),
                  d: last ? last.d : '', 테마일: x.테마일, ep: x, mcol: st ? st.c : '#8fd6a8', K: '월간'}; },
        function(){ return 'solid'; }, function(x){ return '월간 칸 테마일 ' + x.테마일 + ' 종가 대비 ' + (x.최대 ? (MST[x.최대] || {}).n + ' 단계까지' : '아직 -15% 전') + '(가격 계산 = 확정)'; }],
      ['급눌', '📈 급등눌림', '#ffd33a', MG, function(x){          // 잎 K = '급등' = 누르면 급등 분류 칸 · 급등일 누르면 📈 급등 창
          var last = x.도달[x.도달.length - 1], st = MST[x.최대];
          return {type: 'mnl', name: x.테마일.slice(2).replace(/-/g, '/') + ' 급등' + (x.그날 != null ? ' +' + x.그날 + '%' : '') + (st ? ' → ' + st.n + ' ' + (last ? last.ret + '%' : '') : ' (① 전)') + (x.지금 ? ' · 지금 ' + x.지금[3] + '%' : ''),
                  d: last ? last.d : '', 테마일: x.테마일, ep: x, mcol: st ? st.c : '#8fd6a8', K: '급등'}; },
        function(){ return 'solid'; }, function(x){ return '📈 급등일 ' + x.테마일 + ' 종가 대비 ' + (x.최대 ? (MST[x.최대] || {}).n + ' 단계까지' : '아직 -15% 전') + '(가격 계산 = 확정)'; }]
    ];
    S.layerCount = {}; ALL.forEach(function(h){ S.layerCount[h[0]] = h[3].length; });
    var hubs = ALL.filter(function(h){ return h[3].length && S.layers[h[0]] !== false; });
    var nodes = [center], edges = [];
    hubs.forEach(function(h, gi){
      var items = h[3].slice(0, h[0] === '자리' ? 12 : PER);
      var d = fib(gi, hubs.length), hub = {id: 'H:' + h[0], type: 'hubl', key: h[0], name: h[1], n: h[3].length, col: h[2], p: scale3(d, 0.55), r0: 8, hub: 1};
      nodes.push(hub); edges.push({a: center.id, b: hub.id, n: 1, k: 'solid', why: '종목 → ' + h[1] + ' 묶음'});
      // ★잎 표지는 guess(참/거짓) = n.k 는 project() 가 매 프레임 원근 배율로 덮어쓰는 칸이라 쓰면 안 된다
      // 🗂 테마 잎 색 = 그 테마 국면(전체 구와 같은 색) · 나머지 잎 = 층 색
      ring(d, items, 0.22, function(x, p, j){ var o = h[4](x); o.id = 'I:' + h[0] + ':' + j; if (h[0] === '자리') { o.st = phOf(x.테마).상태; o.col = stCol(o.st); } else o.col = o.mcol || h[2]; o.p = p; o.r0 = 3.6; o.lk = h[5](x); o.guess = o.lk === 'dash'; o.why = h[6](x); o.layer = h[0]; return o; })
        .forEach(function(o){ nodes.push(o); edges.push({a: hub.id, b: o.id, n: 1, k: o.lk, why: o.why}); });
    });
    S.nodes = nodes; S.edges = edges;
    S.byId = {}; S.nodes.forEach(function(n){ S.byId[n.id] = n; });
  }

  // ───────── 그리기 ─────────
  function project(){
    var ib = indivBox(), cx = S.w / 2, cy = S.h / 2 - (ib ? 22 : 0), scale = Math.min(S.w, S.h) * 0.36 * S.zoom, D = 3.2;   // 개별 칸이 있으면 구를 22px 위로(칸과 안 겹치게)
    var cY = Math.cos(S.rotY), sY = Math.sin(S.rotY), cX = Math.cos(S.rotX), sX = Math.sin(S.rotX);
    var P = function(n){
      var x = n.p[0], y = n.p[1], z = n.p[2], t;
      t = x * cY + z * sY; z = -x * sY + z * cY; x = t;
      t = y * cX - z * sX; z = y * sX + z * cX; y = t;
      var k = D / (D - z);
      n.sx = cx + x * scale * k; n.sy = cy + y * scale * k; n.depth = z; n.k = k;
    };
    S.scale = scale;
    S.nodes.forEach(function(n){
      if (n.fix2d != null && ib) {                       // 개별 칸 점 = 화면 고정(돌리기·확대 안 탐) · 글자까지 누르는 칸(hit)
        var cw = ib.w / ib.m, x0 = ib.x + n.fix2d * cw;
        n.sx = x0 + 12; n.sy = ib.y + 32; n.depth = 1; n.k = 1; n.r = n.r0 * (n.id === S.sel ? 1.35 : 1);
        n.hit = {x: x0 + 2, y: ib.y + 20, w: cw - 4, h: 24}; return;
      }
      P(n);
      n.r = n.r0 * n.k * (n.id === S.sel ? 1.35 : 1);
    });
    if (S.mode === 'overview') (S.anchors || []).forEach(P);
  }
  function indivBox(){                                    // 개별 칸 = 전체 구에서만 · 왼쪽 아래 고정
    if (S.mode !== 'overview') return null;
    var m = 0; S.nodes.forEach(function(n){ if (n.fix2d != null) m++; });
    return m ? {x: 8, y: S.h - 54, w: Math.min(S.w - 16, 330), h: 46, m: m} : null;
  }
  function boxHit(a, b){ return a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h; }
  function circHit(n, b){ var dx = n.sx - clamp(n.sx, b.x, b.x + b.w), dy = n.sy - clamp(n.sy, b.y, b.y + b.h); return dx * dx + dy * dy < n.r * n.r; }
  // 라벨 자리는 한 번만 계산(placeLabels) → 캔버스마다 칠하기(paintLabels) = 두 구의 글자 자리도 같다
  function placeLabels(order){
    var focusId = S.sel || S.hover, nearL = {}, out = [];
    if (focusId) S.edges.forEach(function(e){ if (e.a === focusId) nearL[e.b] = 1; else if (e.b === focusId) nearL[e.a] = 1; });
    // 공시 지도에서는 공시 라벨을 가리키거나 고른 종목 둘레만(호두와 같음) = 192개 라벨이 한꺼번에 뜨면 떡
    var leafQuiet = S.mode === 'filings';
    var ctx = S.ctx, want = order.filter(function(n){
      if (n.fix2d != null) return false;                  // 개별 칸은 칸 안에 글자를 따로 쓴다
      if (leafQuiet && n.type === 'filing') return n.id === S.sel || n.id === S.hover || nearL[n.id];
      return n.center || n.depth > -0.2 || n.id === S.sel || n.id === S.hover || !!(S.stFilter && S.mode === 'overview') || (n.lv != null && n.lv <= 2 && n.type === 'stock');   // 👑 1~10위는 뒤쪽이어도 이름   // 거르개 켜면 뒤쪽 점도 이름(주도 10개 중 뒤쪽 2개가 이름 없이 남았다 · 9/29)
    });
    var rank = function(n){ return n.id === S.sel ? 0 : n.id === S.hover ? 1 : (n.center || n.hub) ? 0 : 2; };   // 가운데 테마·분야 허브 라벨은 늘 먼저
    want.sort(function(a, b){ return rank(a) - rank(b) || (a.lv == null ? 9 : a.lv) - (b.lv == null ? 9 : b.lv) || b.n - a.n || b.depth - a.depth; });   // 테마 안 = 강한 종목 라벨 먼저
    var ib = S.stFilter ? null : indivBox(), placed = ib ? [{x: ib.x, y: ib.y, w: ib.w, h: ib.h}] : [], max = focusSet() ? 160 : (S.mode === 'overview' ? 70 : 46), done = 0;
    var strong = {}; order.forEach(function(x){ if (x.type === 'stock' && x.lv != null && x.lv <= 2) strong[x.id] = 1; });   // 보이는 1~10위 종목 점
    // 묶음 이름표 자리를 먼저 잡는다(앞쪽 묶음만) = 테마 라벨이 피해 간다 · 뒤쪽 묶음은 흐리게만(자리 안 잡음) · 9/29 화면에서 이름표가 테마 라벨에 가려 읽히지 않았다
    ctx.font = 'bold 11.5px system-ui, "Malgun Gothic", sans-serif';
    (S.mode === 'overview' ? S.anchors || [] : []).forEach(function(a){
      a.box = null; if (a.sx == null || a.depth <= -0.35 || !(S.gOn || {})[a.name]) return;   // 보이는 점이 없는 묶음은 이름표도 없음(거르개)
      var w = ctx.measureText(a.name).width + 10, y = a.sy - a.R * S.scale * a.k - 4 - LABEL_H;
      a.box = {x: clamp(a.sx - w / 2, 2, S.w - w - 2), y: clamp(y, 2, S.h - LABEL_H - 2), w: w, h: LABEL_H};
      placed.push(a.box);
    });
    ctx.font = '12px system-ui, "Malgun Gothic", sans-serif'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    for (var i = 0; i < want.length && done < max; i++) {
      // 숫자 꼬리는 숫자가 있을 때만(공시·뉴스·사건 잎에는 n 이 없어 「undefined」가 붙던 것 · 2026-09-23 화면에서 적발)
      var n = want[i];
      var lenMax = n.type === 'stock' ? 10 : (n.type === 'filing' || n.type === 'news' || n.type === 'mnl' ? 18 : 13);
      var text = (n.rk === 1 ? '👑 ' : '') + cut(n.name, lenMax) + (typeof n.n === 'number' && n.type !== 'filing' && n.type !== 'news' && n.type !== 'event' ? ' ' + n.n : '');
      var w = Math.min(ctx.measureText(text).width + PAD * 2, S.w - 4), g = n.r + 5;
      var cands = [[n.sx + g, n.sy - LABEL_H / 2], [n.sx - g - w, n.sy - LABEL_H / 2], [n.sx - w / 2, n.sy + g], [n.sx - w / 2, n.sy - g - LABEL_H]];
      var best = null;
      for (var c = 0; c < 4; c++) {
        var b = {x: clamp(cands[c][0], 2, S.w - w - 2), y: clamp(cands[c][1], 2, S.h - LABEL_H - 2), w: w, h: LABEL_H};
        var bad = circHit(n, b);                             // 자기 점을 덮는 자리는 안 쓴다(가장자리에서 밀려 들어온 이름표가 👑 대장 점을 가렸다 · 9/29)
        for (var q = 0; !bad && q < placed.length; q++) if (boxHit(placed[q], b)) { bad = true; break; }
        if (bad) continue;
        var cost = c * 0.25;
        for (var m = 0; m < S.nodes.length; m++) if (S.nodes[m] !== n && circHit(S.nodes[m], b)) {
          if (strong[S.nodes[m].id]) { bad = true; break; }   // 👑 1~10위 점은 다른 이름표가 덮지 않는다(엑스게이트 2위 점을 「플랜티넷」 이름표가 가렸다 · 9/29)
          cost += 3;
        }
        if (bad) continue;
        if (!best || cost < best.cost) { b.cost = cost; best = b; }
      }
      if (!best) { if (rank(n) > 1) continue; best = {x: clamp(cands[0][0], 2, S.w - w - 2), y: clamp(cands[0][1], 2, S.h - LABEL_H - 2), w: w, h: LABEL_H}; }
      placed.push(best); done++;
      out.push({b: best, text: text, stock: n.type === 'stock'});
    }
    return out;
  }
  function paintLabels(ctx, L){
    ctx.font = '12px system-ui, "Malgun Gothic", sans-serif'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    L.forEach(function(x){
      var best = x.b;
      ctx.fillStyle = 'rgba(7,11,31,.78)';
      ctx.beginPath(); if (ctx.roundRect) ctx.roundRect(best.x, best.y, best.w, best.h, 5); else ctx.rect(best.x, best.y, best.w, best.h); ctx.fill();
      ctx.fillStyle = x.stock ? '#dce8ff' : '#e6fffb';
      ctx.fillText(x.text, best.x + PAD, best.y + LABEL_H / 2 + 0.5, best.w - PAD * 2);
    });
  }
  // 점 색 = 왼쪽(plain) 한 색 · 오른쪽 = 테마 점은 4단계 · 나머지 점(종목·분야·공시…)은 원래 색 · 개별 칸 갈색은 양쪽 같다(상태가 아니라 「테마 아님」 표시)
  function colOf(n, plain){
    if (n.type === 'theme' && n.st === '테마아님') return stCol('테마아님');
    if (plain) return C_PLAIN;
    return n.type === 'theme' ? ST4[st4(n.st)][0] : n.col;
  }
  function draw(){
    if (!S.ctx || !S.w) return;
    var cvs = (S.cvs && S.cvs.length) ? S.cvs : [{ctx: S.ctx, plain: false}];
    if (!S.nodes.length) {
      cvs.forEach(function(c){ var ctx = c.ctx; ctx.setTransform(S.dpr, 0, 0, S.dpr, 0, 0); ctx.clearRect(0, 0, S.w, S.h); ctx.fillStyle = '#8b96c4'; ctx.font = '14px system-ui'; ctx.textAlign = 'center'; ctx.fillText('불러오는 중…', S.w / 2, S.h / 2); });
      return;
    }
    project();                                            // ★자리 계산은 한 번 = 두 구가 같은 좌표를 쓴다
    var sel = S.sel || S.hover, near = {};
    if (sel) S.edges.forEach(function(e){ if (e.a === sel) near[e.b] = 1; else if (e.b === sel) near[e.a] = 1; });
    var fs = focusSet();                                  // ◎ 누른 점이 있으면 그 점과 바로 이어진 것만
    var order = S.nodes.filter(function(n){ return !(S.hideGuess && n.guess) && !(fs && !fs[n.id]) && !stHidden(n); }).sort(function(a, b){ return a.depth - b.depth; });
    S.gOn = {}; order.forEach(function(n){ if (n.묶음) S.gOn[n.묶음] = 1; });   // 묶음 이름표 = 보이는 점이 있는 묶음만
    var L = placeLabels(order);
    cvs.forEach(function(c){ paint(c.ctx, c.plain, sel, near, fs, order, L); });
  }
  function paint(ctx, plain, sel, near, fs, order, L){
    ctx.setTransform(S.dpr, 0, 0, S.dpr, 0, 0); ctx.clearRect(0, 0, S.w, S.h);
    if (S.mode === 'overview') {                           // 뒤쪽 묶음 이름표 = 점 밑에 흐리게(앞쪽은 점 위에 · 아래 paintAnchors)
      ctx.font = 'bold 11.5px system-ui, "Malgun Gothic", sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
      (S.anchors || []).forEach(function(a){
        if (a.sx == null || a.box || !(S.gOn || {})[a.name]) return;
        ctx.fillStyle = 'rgba(184,189,230,' + (0.14 + 0.2 * ((a.depth + 1) / 2)).toFixed(3) + ')';
        ctx.fillText(a.name, a.sx, a.sy - a.R * S.scale * a.k - 4);
      });
    }
    // ★선 두 종류 = 실선(확정 · 저장된 관계) · 점선(추정). 같은 종류끼리 묶어 두 번에 그린다(선마다 setLineDash 를 바꾸면 느리다)
    ['solid', 'dash'].forEach(function(kind){
      if (kind === 'dash' && S.hideGuess) return;
      ctx.setLineDash(kind === 'dash' ? [3, 3] : []);
      S.edges.forEach(function(e){
        if ((e.k || 'solid') !== kind) return;
        if (fs && !(fs[e.a] && fs[e.b])) return;           // 양 끝이 다 보이는 선만(숨긴 점으로 가는 선 = 끝에 아무것도 없는 선)
        var a = S.byId[e.a], b = S.byId[e.b]; if (!a || !b) return;
        if (S.hideGuess && (a.guess || b.guess)) return;
        if (stHidden(a) || stHidden(b)) return;            // 거르개로 숨긴 점에 닿는 선도 숨김
        var hot = sel && (e.a === sel || e.b === sel);
        var al = hot ? 0.85 : (kind === 'dash' ? 0.1 : 0.07) + 0.18 * (((a.depth + b.depth) / 2 + 1) / 2);
        ctx.strokeStyle = hot ? 'rgba(230,236,255,' + al + ')' : (kind === 'dash' ? 'rgba(255,190,140,' + al + ')' : 'rgba(140,160,255,' + al + ')');
        ctx.lineWidth = hot ? 1.3 : (kind === 'dash' ? 0.7 : 0.55);
        ctx.beginPath(); ctx.moveTo(a.sx, a.sy); ctx.lineTo(b.sx, b.sy); ctx.stroke();
      });
    });
    ctx.setLineDash([]);
    var dotOne = function(n){
      var dim = sel && n.id !== sel && !near[n.id], col = colOf(n, plain);
      ctx.globalAlpha = dim ? 0.28 : Math.min(1, 0.55 + 0.45 * ((n.depth + 1) / 2));
      ctx.shadowColor = col; ctx.shadowBlur = dim ? 0 : 12 * n.k; ctx.fillStyle = col;
      ctx.beginPath(); ctx.arc(n.sx, n.sy, Math.max(1, n.r), 0, Math.PI * 2); ctx.fill();
      if (n.id === S.sel || n.id === S.hover) {
        ctx.shadowBlur = 0; ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(n.sx, n.sy, n.r + 3, 0, Math.PI * 2); ctx.stroke();
      }
    };
    order.forEach(function(n){ if (n.fix2d == null) dotOne(n); });
    ctx.shadowBlur = 0; ctx.globalAlpha = 1;
    var ib = S.stFilter ? null : indivBox();                // 거르개 켜면 개별 칸은 안 그림(칸 자리 계산은 project 에 남아 구가 움직이지 않는다)
    if (ib) {                                              // 개별 칸 = 구 위에 덮는다(칸 뒤 구 점이 비치지 않게) · 글자 = 이름 + 1년 종목 수
      ctx.fillStyle = 'rgba(14,20,36,.92)'; ctx.strokeStyle = 'rgba(141,123,104,.55)'; ctx.lineWidth = 1;
      ctx.beginPath(); if (ctx.roundRect) ctx.roundRect(ib.x, ib.y, ib.w, ib.h, 7); else ctx.rect(ib.x, ib.y, ib.w, ib.h); ctx.fill(); ctx.stroke();
      ctx.font = '10.5px system-ui, "Malgun Gothic", sans-serif'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillStyle = '#b3a38f';
      ctx.fillText('개별 = 테마 아님 · 구 밖 · 크기·선 없음 · 숫자 = 1년 종목', ib.x + 8, ib.y + 11, ib.w - 16);
      ctx.font = '12px system-ui, "Malgun Gothic", sans-serif'; ctx.fillStyle = '#e8ddd0';
      order.forEach(function(n){ if (n.fix2d != null) { dotOne(n); ctx.shadowBlur = 0; ctx.globalAlpha = 1; ctx.fillStyle = '#e8ddd0'; ctx.fillText(cut(n.name, 8) + ' ' + n.n, n.sx + 10, n.sy, n.hit.w - 22); } });
    }
    if (S.mode === 'overview') {                           // 앞쪽 묶음 이름표 = 점 위에 · 어두운 바탕(자리는 placeLabels 가 먼저 잡았다)
      ctx.font = 'bold 11.5px system-ui, "Malgun Gothic", sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      (S.anchors || []).forEach(function(a){
        var b = a.box; if (!b) return;
        ctx.fillStyle = 'rgba(7,11,31,.62)';
        ctx.beginPath(); if (ctx.roundRect) ctx.roundRect(b.x, b.y, b.w, b.h, 5); else ctx.rect(b.x, b.y, b.w, b.h); ctx.fill();
        ctx.fillStyle = 'rgba(170,180,235,' + (0.55 + 0.4 * ((a.depth + 1) / 2)).toFixed(3) + ')';
        ctx.fillText(a.name, b.x + b.w / 2, b.y + LABEL_H / 2 + 0.5);
      });
    }
    paintLabels(ctx, L);
  }
  function tick(){ S.raf = 0; if (S.auto && !S.drag) S.rotY += 0.004; draw(); if (S.auto) S.raf = requestAnimationFrame(tick); }
  // 걸린 예약은 취소하고 새로 건다 = 창이 숨김일 때 첫 예약이 안 불리면 「이미 예약됨」에 막혀 그 뒤 그리기가 전부 멈추던 것(2026-09-23 시험에서 적발)
  function redraw(){ if (S.raf) cancelAnimationFrame(S.raf); S.raf = requestAnimationFrame(tick); }
  function resize(){
    if (!S.cv) return;
    var r = S.cv.getBoundingClientRect(); if (!r.width) return;
    S.dpr = window.devicePixelRatio || 1; S.w = r.width; S.h = r.height;
    // 두 구 = 같은 크기의 그림판(첫 캔버스 크기) · 화면 폭이 1px 달라도 누르기 좌표는 ptr() 가 배율로 맞춘다
    ((S.cvs && S.cvs.length) ? S.cvs : [{cv: S.cv}]).forEach(function(c){ c.cv.width = Math.round(r.width * S.dpr); c.cv.height = Math.round(r.height * S.dpr); });
    redraw();
  }

  // ───────── 목록(지도 대신) ─────────
  function chips(){
    var T = TE();
    if (S.mode === 'filings') {                        // 목록 = 종목마다 최근 공시 8건(원문 링크)
      var hubs = S.nodes.filter(function(n){ return n.type === 'stock'; });
      if (!hubs.length) return '<span style="font-size:11px;color:#8487bd">불러오는 중…</span>';
      return hubs.map(function(h){
        var fs = S.edges.filter(function(e){ return e.a === h.id; }).map(function(e){ return S.byId[e.b]; });
        return '<div style="margin-bottom:8px"><span class="te-pick" data-c="' + esc(h.code) + '" data-n="' + esc(h.name) + '" style="color:' + C_STOCK + ';font-weight:700;cursor:pointer;font-size:12px">📌 ' + esc(h.name) + '</span> <span style="color:#6f72a8;font-size:10.5px">공시 ' + (h.n || 0).toLocaleString('ko-KR') + '건 중 최근 ' + fs.length + '</span>'
          + fs.map(function(f){ return '<div class="te-url" data-u="' + esc(f.u) + '" style="font-size:11px;color:#c9c2ff;cursor:pointer;padding-left:14px;line-height:1.55">' + esc(f.d) + ' · ' + esc(f.name) + ' ↗</div>'; }).join('') + '</div>';
      }).join('');
    }
    if (S.mode === 'stock') return '<div id="te-stock-list"></div>';
    if (S.mode === 'overview') {
      var ks = shown().sort(function(a, b){ return T[b].n종목 - T[a].n종목; });
      var show = S.all ? ks : ks.slice(0, 60);
      return show.map(function(k){ return '<span class="te-pick" data-t="' + esc(k) + '" title="' + esc(stLab(phOf(k).상태)) + '" style="display:inline-block;background:#141a2e;border:1px solid rgba(255,255,255,.1);border-radius:9px;padding:3px 9px;margin:0 5px 6px 0;font-size:12px;color:#5effd6;cursor:pointer">' + dot(phOf(k).상태) + ' ' + esc(k) + '<span style="color:#6f76a8;font-size:10.5px"> ' + T[k].n종목 + '</span></span>'; }).join('')
        + (!S.all && ks.length > 60 ? '<span class="te-more" style="display:inline-block;font-size:12px;color:#f5b342;cursor:pointer;padding:3px 9px">+ 나머지 ' + (ks.length - 60) + '개</span>' : '');
    }
    var Tt = T[S.theme]; if (!Tt) return '';
    var list = rowsOf(Tt), show = S.all ? list : list.slice(0, 150);
    return show.map(function(x){
      return '<span class="te-pick" data-c="' + esc(x[0]) + '" data-n="' + esc(x[1] || x[0]) + '" title="' + esc((x[1] || '') + ' · 4년 ' + x[3] + '회 · ' + (x[2] || '')) + '" style="display:inline-block;background:#161c33;border:1px solid rgba(255,255,255,.1);border-radius:9px;padding:3px 9px;margin:0 5px 6px 0;font-size:12px;color:' + (assigned(x[2]) ? '#7ee8ff' : '#9aa0cc') + ';cursor:pointer">' + dot(recency(x[4])) + ' ' + esc(x[1] || x[0]) + '<span style="color:#6f76a8;font-size:10.5px"> ' + (x[3] > 0 ? x[3] + '회' : '배정') + (x[4] ? ' · ' + ym(x[4]) : '') + '</span></span>';
    }).join('') + (!S.all && list.length > 150 ? '<span class="te-more" style="display:inline-block;font-size:12px;color:#f5b342;cursor:pointer;padding:3px 9px">+ 나머지 ' + (list.length - 150) + '개</span>' : '');
  }

  // ───────── 껍데기 ─────────
  function btn(cls, attr, label, on){
    return '<button class="' + cls + '" ' + attr + ' style="background:' + (on ? 'rgba(94,255,214,.2)' : 'rgba(255,255,255,.06)') + ';border:1px solid rgba(255,255,255,.14);color:#dce8ff;font-size:11.5px;border-radius:7px;padding:4px 11px;margin-right:5px;cursor:pointer">' + label + '</button>';
  }
  function crumbFilings(T, t){
    var f = S.fcount || {stocks: 0, all: t ? t.n종목 : 0, shown: 0, total: 0}, a = S.page * PAGE + 1, b = Math.min((S.page + 1) * PAGE, f.all);
    return '<span class="te-home" style="color:#7ee8ff;cursor:pointer">전체 테마</span> <span style="color:#6f72a8">›</span> <span class="te-back-theme" style="color:#7ee8ff;cursor:pointer">' + esc(S.theme) + '</span> <span style="color:#6f72a8">›</span> <b style="color:' + C_FILING + '">📄 공시 지도</b>'
      + ' <span style="color:#6f72a8">· 종목 ' + a + '~' + b + ' / ' + f.all + ' · 공시 ' + f.shown + ' / ' + f.total.toLocaleString('ko-KR') + '건 (종목별 최근 ' + PER + '건 · 4년 카드 등장 많은 종목부터)'
      + (S.fail && S.fail.length ? ' · <b style="color:#ff9a9a">파일 없는 종목 ' + S.fail.length + '</b>' : '') + ' · 청록 = 종목(누르면 그 종목 구) · 보라 = 공시(누르면 DART 원문)</span>';
  }
  function crumbStock(T){
    var E = stockE(S.stock), nm = (E && E.name) || S.stock;
    return '<span class="te-home" style="color:#7ee8ff;cursor:pointer">전체 테마</span>'
      + (S.theme ? ' <span style="color:#6f72a8">›</span> <span class="te-back-theme" style="color:#7ee8ff;cursor:pointer">' + esc(S.theme) + '</span>' : '')
      + ' <span style="color:#6f72a8">›</span> <b style="color:' + C_STOCK + '">📌 ' + esc(nm) + '</b> <span style="color:#6f72a8">' + esc(S.stock)
      + (E ? ' · 공시 ' + (E.공시원문n || (E.공시 || []).length).toLocaleString('ko-KR') + ' · 뉴스 ' + (E.뉴스 || []).length + ' · 테마 ' + (E.자리 || []).length + ' · 동행 ' + (E.동행 || []).length : ' · 불러오는 중…')
      + ' · 허브마다 최근 ' + PER + '건 · 보라 = 공시(DART 원문) · 노랑 = 뉴스 · 테마 잎 = 그 테마 국면 색 · 하늘 = 그 종목 구로</span>';
  }
  function modeRow(){
    if (S.mode === 'theme') return '<div style="margin-bottom:6px">' + ['all', 'role', 'card', 'y1'].map(function(k){
        var lab = {all: '전부', role: '역할표 배정', card: '카드 등장', y1: '최근 1년'}[k];
        return btn('te-b-flt', 'data-f="' + k + '"', lab, S.filter === k); }).join('') + btn('te-b-fil', '', '📄 공시 지도(종목 24곳 × 최근 공시 8건)', false) + '</div>';
    if (S.mode === 'filings') {
      var all = (S.fcount && S.fcount.all) || 0;
      return '<div style="margin-bottom:6px">' + btn('te-b-prev', S.page > 0 ? '' : 'disabled', '◀ 이전 24곳', false) + btn('te-b-next', (S.page + 1) * PAGE < all ? '' : 'disabled', '다음 24곳 ▶', false) + '</div>';
    }
    if (S.mode === 'stock') return '<div style="margin-bottom:6px">' + btn('te-b-open', '', '📌 종목창 열기', false) + (S.theme ? btn('te-b-fil', '', '📄 ' + esc(S.theme) + ' 공시 지도', false) : '') + '</div>';
    return '';
  }
  function head(){
    var T = TE(), t = (S.mode === 'theme' || S.mode === 'filings') ? T[S.theme] : null;
    if (S.mode === 'filings' || S.mode === 'stock') {
      return '<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px;margin-bottom:6px">'
        + '<div style="font-size:12.5px">' + (S.mode === 'filings' ? crumbFilings(T, t) : crumbStock(T)) + '</div>'
        + '<div>' + btn('te-b-back', S.hist.length ? '' : 'disabled', '◀ 뒤로', false) + btn('te-b-all', '', '🌐 전체 보기', false) + btn('te-b-rot', '', S.auto ? '⟳ 자동회전 켜짐' : '⟳ 자동회전 꺼짐', S.auto) + btn('te-b-view', 'data-v="map"', '🕸 지도', S.view === 'map') + btn('te-b-view', 'data-v="list"', '☰ 목록', S.view !== 'map') + '</div></div>'
        + modeRow();
    }
    var crumb = S.mode === 'overview'
      ? '<b style="color:#5effd6">테마 ' + shown().length + '</b>' + (S.raw ? ' <span style="color:#6f72a8">(메타 + 원문 이름)</span>' : ' <span style="color:#6f72a8">(🗺·🗂 와 같은 메타 · 원문 이름 ' + rawN() + ' 꺼짐)</span>') + ' <label style="font-size:11px;color:#9aa0cc;cursor:pointer;margin-left:6px"><input type="checkbox" class="te-raw-cb"' + (S.raw ? ' checked' : '') + '> 원문 이름 ' + rawN() + ' 켜기</label>' + ' <span style="color:#6f72a8">· 선 = 겹치는 종목 8개 이상 · 크기·숫자 = 최근 1년 이 테마로 카드에 오른 종목 수 · 자리 = 메가 묶음(날마다 같은 자리) · 점 클릭 = 그 테마 안으로</span>'
      : '<span class="te-home" style="color:#7ee8ff;cursor:pointer">전체 테마</span> <span style="color:#6f72a8">›</span> <b style="color:#5effd6">' + esc(S.theme) + '</b> <span style="color:#6f72a8">· ' + (t ? t.n종목 + '종목(역할표 배정 ' + t.n배정 + ') · ' + esc(t.메가 || '') + ' · ' + phText(S.theme) : '') + ' · 점 클릭 = 그 종목 생태계</span>';
    return '<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px;margin-bottom:6px">'
      + '<div style="font-size:12.5px">' + crumb + '</div>'
      + '<div>' + btn('te-b-back', S.hist.length ? '' : 'disabled', '◀ 뒤로', false) + btn('te-b-all', '', '🌐 전체 보기', false) + btn('te-b-rot', '', S.auto ? '⟳ 자동회전 켜짐' : '⟳ 자동회전 꺼짐', S.auto) + btn('te-b-view', 'data-v="map"', '🕸 지도', S.view === 'map') + btn('te-b-view', 'data-v="list"', '☰ 목록', S.view === 'list') + '</div></div>'
      + modeRow();
  }
  // 색 범례 = 화면마다 무엇을 칠했는지 + 측정값(구 단위 재측정 · 봉인 2026) · 「예측·매수신호 아님」
  function legend(){
    var B = PH(), M = B.측정 || {};
    if (!B.기준일) return '<div style="font-size:10.5px;color:#ff9a9a;margin-top:6px">색 기준(국면) 없음 = _생태계\\_테마생태계_빌드.py 다시 실행</div>';
    var themeKeys = ['주도', '급증', '20일', '60일', '1년', '오래'];
    var sw = function(ks){ return ks.map(function(s){ return dot(s) + ' ' + stLab(s); }).join(' &nbsp;'); };
    var sw4 = ['주도', '급증', '살아있음', '죽음'].map(function(k){ return dot4(k) + ' ' + ST4[k][1] + (k === '급증' ? '(급증)' : k === '살아있음' ? '(60거래일 안에 카드에 나옴)' : k === '죽음' ? '(60거래일 넘게 없음)' : ''); }).join(' &nbsp;');
    var what = S.mode === 'theme' ? '왼쪽 구 = 한 색 · 오른쪽 구 = 가운데 테마 ' + dot4(st4(phOf(S.theme).상태)) + ' ' + ST4[st4(phOf(S.theme).상태)][1] + ' · 종목 점 = <b style="color:#b8bde6">이 테마 안 강한 순</b> ' + LV.map(function(x, i){ return dotL(i) + ' ' + x[1]; }).join(' &nbsp;') + ' (기간 = 테마가 카드에 마지막 오른 날까지 20거래일 · 출현일 등락률 누적 = 캘린더 결산 🚀 규칙) · 분야 허브 = 그 분야에서 가장 강한 종목의 색 · 점 크기 = 4년 카드 횟수(강도와 다른 잣대)'
      : S.mode === 'stock' ? '🗂 테마 잎 = 그 테마 국면 ' + sw(themeKeys) + ' · 나머지 잎 = 층 색(공시 보라 · 뉴스 노랑 · 동행 하늘 · 사건 분홍 · 같은 기사 주황)'
      : S.mode === 'filings' ? '공시 지도 색 = 청록 종목 · 보라 공시(국면 색 없음)'
      : '<b style="color:#b8bde6">두 구는 점·자리·크기·선이 같고 색만 다르다</b> · 왼쪽 = <span style="color:' + C_PLAIN + '">●</span> 한 색 · 오른쪽 = ' + sw4 + ' · <b style="color:#b8bde6">오른쪽 구 위 칸을 누르면 두 구에서 그것만(자리 그대로 · 다시 누르면 전부)</b> · ' + dot('테마아님') + ' 개별이슈·일부·특징주 = 테마 아님 → 구 밖 왼쪽 아래 칸 ·빨강·초록은 🗺 테마 마인드맵과 같은 뜻(마인드맵은 84메타 단위라 목록이 조금 다를 수 있다)';
    var num = M.측정일 ? ' · <span style="color:#8a90c0">잰 값(' + esc(M.측정일) + ' · 2026 봉인 구간) = 주도가 다음 10거래일에도 상위 10에 남음 ' + M.주도_지속_봉인 + '%(무작위 ' + M.주도_무작위_봉인 + '%) · 급증이 새 상위 10을 잡음 ' + M.급증_recall_봉인 + '%(무작위의 ' + M.급증_배수_봉인 + '배 · 급증 5개 중 ' + Math.round(M.급증_정밀도_봉인 / 20) + '개꼴로만 실제로 올라섬)</span>' : '';
    return '<div class="cal-desc" data-desc="eco" style="font-size:10.5px;color:#9aa0cc;margin-top:6px;line-height:1.6">🎨 ' + what + '<br><span style="color:#6f72a8">주도 = 최근 20거래일 카드 등장일수 상위 10 · 급증 = 최근 5일 등장 − 직전 15일/3 상위 10(주도 밖) · 나머지 = 마지막 등장(살아있음 = ' + esc(B.d60 || '-') + ' 이후) · 기준 ' + esc(B.기준일) + '(정규장 카드) · <b>카드 등장이지 주가 상승폭·매수신호가 아니다</b></span>' + num + '</div>';
  }
  function foot(){
    return legend() + '<div class="cal-desc" data-desc="eco" style="font-size:10px;color:#6f72a8;margin-top:4px">드래그 = 돌리기(두 구 함께) · 휠 = 확대 · 방향키 = 돌리기 · 크기 = 전체 구는 최근 1년 종목 수 · 테마 안은 종목의 4년 카드 등장 횟수(급등 빈도지 대장 여부가 아니다) · 테마를 누르면 그 테마 안 · 안에서 누르면 그 점과 이어진 것만(빈 곳 = 전부) · ◀ 뒤로(Backspace) = 누르기 전으로 · 두 번 누르면 들어가기 · <span style="color:#9fb3ff">── 확정</span> <span style="color:#ffbe8c">┄┄ 추정</span> · <b style="color:#8a90c0">선은 자료 연결이지 상승 원인·추천이 아니다</b></div>';
  }
  // ③ 층 거르개(종목 구) + 추정 숨기기(모든 화면) = 호두 CONNECTED SOURCES 체크박스를 우리 층으로 · 층마다 전체 개수
  var LAYERS = [['공시', '📄 공시', C_FILING], ['뉴스', '📰 뉴스', '#ffd27a'], ['자리', '🗂 테마', '#5effd6'], ['동행', '🤝 동행', '#7ee8ff'], ['사건', '📅 사건', '#ff9ad2'], ['기사', '🔗 같은 기사', '#ffb07a'], ['눌림', '📉 월간눌림', '#fb923c'], ['급눌', '📈 급등눌림', '#ffd33a']];
  function layerBar(){
    var box = '<label style="display:inline-flex;align-items:center;gap:4px;font-size:11px;color:#dce8ff;margin-right:12px;cursor:pointer"><input type="checkbox" class="te-focus-cb"' + (S.focus ? ' checked' : '') + '> ◎ 누르면 연결된 것만(빈 곳 누르면 전부)</label>'
      + '<label class="te-guess" style="display:inline-flex;align-items:center;gap:4px;font-size:11px;color:#ffbe8c;margin-right:12px;cursor:pointer"><input type="checkbox" class="te-guess-cb"' + (S.hideGuess ? ' checked' : '') + '> ┄ 추정(점선) 숨기기</label>';
    if (S.mode === 'stock') {
      var c = S.layerCount || {};
      box += LAYERS.map(function(L){
        var on = S.layers[L[0]] !== false, n = c[L[0]] || 0;
        return '<label style="display:inline-flex;align-items:center;gap:4px;font-size:11px;color:' + (n ? L[2] : '#555a80') + ';margin-right:10px;cursor:pointer"><input type="checkbox" class="te-layer" data-l="' + L[0] + '"' + (on ? ' checked' : '') + (n ? '' : ' disabled') + '> ' + L[1] + ' <span style="color:#6f72a8">' + n.toLocaleString('ko-KR') + '</span></label>';
      }).join('');
      var onN = LAYERS.filter(function(L){ return S.layers[L[0]] !== false && (S.layerCount || {})[L[0]]; }).length;
      if (!onN) box += '<span style="font-size:11px;color:#ff9a9a">켜진 층 0 = 가운데만 남는다</span>';
    }
    return '<div style="margin:0 0 6px;padding:5px 8px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);border-radius:8px">' + box + '</div>';
  }
  // 두 구 = 전체 구·테마 안(국면 색이 뜻 있는 화면) · 공시 지도·종목 구는 색이 층 구분이라 한 구
  function dualMode(){ return S.mode === 'overview' || S.mode === 'theme'; }
  function caps(){                                       // 두 구 머리 한 줄 = 무엇을 칠했나 · 오른쪽은 칸마다 개수(지금 구에 있는 테마 점만 셈 · 개별 칸 제외)
    if (S.mode === 'theme') {                            // 테마 안 = 오른쪽 머리줄에 👑 대장 이름 + 강도 5칸
      var L0 = ldOf(S.theme), top0 = L0 && L0.순위[0];
      return ['🌐 「' + esc(S.theme) + '」 안 · 한 색',
              '🎨 ' + (top0 ? '👑 대장 <b style="color:#ff8a8a">' + esc(top0[1]) + '</b>' + (L0.전 ? ' <span style="color:#ffbe8c">(' + L0.전 + '거래일 전 사이클)</span>' : '') + ' · ' : '대장 기록 없음 · ')
              + ['1위', '2~3', '4~10', '11~', '없음'].map(function(t, i){ return dotL(i) + t; }).join(' ')];
    }
    var c = {'주도': 0, '급증': 0, '살아있음': 0, '죽음': 0}, tot = 0;
    S.nodes.forEach(function(n){ if (n.type !== 'theme' || n.fix2d != null) return; var k = st4(n.st); if (k in c) { c[k]++; tot++; } });
    // 🎯 칸을 누르면 두 구에서 그것만(te-stf) · 켜진 칸 = 테두리 · 나머지 칸 = 흐리게 · ✕ 전부 = 맨 앞(좁은 화면에서 줄임표로 잘리지 않게)
    var chip = function(k){
      var on = S.stFilter === k, off = S.stFilter && !on;
      return '<span class="te-stf" data-k="' + k + '" title="누르면 두 구에서 ' + ST4[k][1] + '만 · 다시 누르면 전부" style="cursor:pointer;padding:0 4px;border-radius:8px;border:1px solid ' + (on ? ST4[k][0] : 'transparent') + ';background:' + (on ? 'rgba(255,255,255,.08)' : 'transparent') + ';opacity:' + (off ? '.45' : '1') + '">' + dot4(k) + ' ' + ST4[k][1] + ' <b style="color:#f2f4ff">' + c[k] + '</b></span>';
    };
    return ['🌐 테마 ' + tot + ' · 한 색 · ' + (S.stFilter ? '<b style="color:' + ST4[S.stFilter][0] + '">' + ST4[S.stFilter][1] + '만 보는 중</b> · ' : '') + '자리 = 메가 묶음(날마다 같은 자리) · 크기 = 1년 종목 수',
            '🎨 ' + (S.stFilter ? '<span class="te-stf" data-k="" title="거르개 끄기" style="cursor:pointer;color:#f5b342;padding:0 4px">✕ 전부</span> ' : '')
            + ['주도', '급증', '살아있음', '죽음'].map(chip).join(' ') + (S.stFilter ? '' : ' <span style="color:#6f72a8">· 누르면 그것만</span>')];
  }
  function render(){
    var b = S.box; if (!b) return;
    var dual = dualMode(), cp = dual ? caps() : null, H = 'height:min(66vh,620px)';
    var cvHtml = function(cls, cap, withBtn){
      return '<div style="flex:1 1 ' + (dual ? '360px' : '520px') + ';min-width:280px;display:flex;flex-direction:column;gap:4px">'
        + (cap ? '<div style="font-size:11.5px;color:#b8bde6;line-height:18px;min-height:18px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + cap + '</div>' : '')
        + '<div style="position:relative;' + H + '"><canvas class="te-cv ' + cls + '" tabindex="0" style="width:100%;height:100%;display:block;background:#0b1020;border:1px solid rgba(255,255,255,.08);border-radius:10px;cursor:grab"></canvas>'
        + (withBtn ? '<button class="te-b-panel" style="position:absolute;top:6px;right:6px;background:rgba(14,20,36,.85);border:1px solid rgba(255,255,255,.14);color:#dce8ff;font-size:11px;border-radius:7px;padding:3px 9px;cursor:pointer">' + (S.panelOpen ? '패널 접기 ▶' : '◀ 패널') + '</button>' : '')
        + '</div></div>';
    };
    b.innerHTML = '<div style="background:rgba(10,14,30,.5);border:1px solid rgba(255,255,255,.1);border-radius:10px;padding:10px 12px">'
      + head()
      + (S.view === 'map' ? layerBar() : '')
      + (S.view === 'map'
        ? '<div style="display:flex;gap:8px;align-items:flex-end;flex-wrap:wrap">'
          + (dual ? cvHtml('te-cv-plain', cp[0], false) : '')
          + cvHtml('te-cv-state', dual ? cp[1] : '', true)
          + (S.panelOpen ? '<div class="te-panel" style="flex:0 1 310px;min-width:240px;max-height:min(66vh,620px);' + H + ';overflow:auto;background:#0e1424;border:1px solid rgba(255,255,255,.1);border-radius:10px;padding:10px 12px;font-size:11.5px;color:#cfd2ff;box-sizing:border-box">' + panelHtml() + '</div>' : '')
          + '</div>'
        : '<div class="te-list">' + chips() + '</div>')
      + foot() + '</div>';
    if (S.view === 'map') {
      S.cvs = Array.prototype.map.call(b.querySelectorAll('canvas.te-cv'), function(cv){ return {cv: cv, ctx: cv.getContext('2d'), plain: cv.classList.contains('te-cv-plain')}; });
      S.cv = S.cvs[0].cv; S.ctx = S.cvs[0].ctx; bindCanvas(); setTimeout(resize, 0);
    }
    else {
      S.cv = null; S.ctx = null; S.cvs = [];
      if (S.mode === 'stock' && typeof window._생태계_채우기 === 'function') window._생태계_채우기(S.stock, 'te-stock-list');   // 종목 목록 = 기존 종목 생태계 목록 그대로
    }
  }

  function goTheme(th){ pushHist(); S.mode = 'theme'; S.theme = th; S.sel = null; S.all = false; buildTheme(th); render(); redraw(); }
  function goFilings(th, page){
    pushHist(); S.mode = 'filings'; S.theme = th; S.page = page || 0; S.sel = null; S.all = false;
    var T = TE()[th]; if (!T) { goAll(); return; }
    var codes = rowsOf(T).slice(S.page * PAGE, S.page * PAGE + PAGE).map(function(x){ return x[0]; });
    S.nodes = []; S.edges = []; S.byId = {}; render(); redraw();
    loadStocks(codes, function(fail){ if (S.mode !== 'filings' || S.theme !== th) return; S.fail = fail; buildFilings(th); takePending(); render(); redraw(); });
  }
  function goStock(code, fromTheme){
    pushHist(); S.mode = 'stock'; S.stock = code; S.sel = null; if (fromTheme) S.theme = fromTheme;
    S.nodes = []; S.edges = []; S.byId = {}; render(); redraw();
    loadStocks([code], function(fail){ if (S.mode !== 'stock' || S.stock !== code) return; S.fail = fail; buildStock(code); takePending(); render(); redraw(); });
  }
  function goAll(){ pushHist(); S.mode = 'overview'; S.theme = ''; S.sel = null; S.all = false; buildOverview(); render(); redraw(); }
  // ◀ 뒤로 = 화면(구·테마·공시·종목)과 고른 점을 함께 적는다 · 되돌리는 동안은 안 적는다
  function snap(){ return {mode: S.mode, theme: S.theme, stock: S.stock, page: S.page || 0, sel: S.sel}; }
  function pushHist(){
    if (S.restoring || !S.nodes.length) return;
    var x = snap(), l = S.hist[S.hist.length - 1];
    if (l && l.mode === x.mode && l.theme === x.theme && l.stock === x.stock && l.page === x.page && l.sel === x.sel) return;
    S.hist.push(x); if (S.hist.length > 60) S.hist.shift();
  }
  function takePending(){ if (S.pendingSel) { if (S.byId[S.pendingSel]) S.sel = S.pendingSel; S.pendingSel = null; } }
  function goBack(){
    var h = S.hist.pop(); if (!h) return;
    S.restoring = true;
    try {
      var same = h.mode === S.mode && h.theme === S.theme && h.stock === S.stock && (h.page || 0) === (S.page || 0);
      if (!same) {
        if (h.mode === 'overview') goAll();
        else if (h.mode === 'theme') goTheme(h.theme);
        else if (h.mode === 'filings') { S.pendingSel = h.sel; goFilings(h.theme, h.page); }
        else if (h.mode === 'stock') { S.pendingSel = h.sel; goStock(h.stock, h.theme); }
      }
      if (h.mode === 'overview' || h.mode === 'theme' || same) S.sel = (h.sel && S.byId[h.sel]) ? h.sel : null;
    } finally { S.restoring = false; }
    refreshPanel(); redraw();
  }
  function selectId(id){ if (id && !S.byId[id]) return; if (id !== S.sel) { pushHist(); S.sel = id; } refreshPanel(); redraw(); }   // 없는 점 id 는 무시
  function openStock(code, name){
    if (typeof _cmStock === 'function') _cmStock(code, name);
    else if (typeof showStockFromData === 'function') showStockFromData({entry: {krStockCode: code, displayName: name || code}});
  }

  function pick(x, y){
    // ★점 안을 누르면 = 그 점들 중 가장 앞 · 점 밖(여유 6px)이면 = 가장 가까운 점(전엔 여유 안의 가장 앞 점이 옆 점을 가로챘다 = 로봇을 눌렀는데 상법개정으로 · 2026-09-23)
    var inside = null, near = null, nd = 1e9, fs = focusSet(), ib = S.stFilter ? null : indivBox();
    if (ib && x >= ib.x && x <= ib.x + ib.w && y >= ib.y && y <= ib.y + ib.h) {   // 개별 칸 안 = 칸 점(글자까지)만 · 칸 뒤 구 점은 안 잡는다
      var hit = null;
      S.nodes.forEach(function(n){ if (n.hit && n.fix2d != null && x >= n.hit.x && x <= n.hit.x + n.hit.w && y >= n.hit.y && y <= n.hit.y + n.hit.h) hit = n; });
      return hit;
    }
    S.nodes.forEach(function(n){
      if (n.sx == null || (S.hideGuess && n.guess) || (fs && !fs[n.id]) || stHidden(n)) return;   // 거르개로 숨긴 점은 안 잡힌다
      var dd = Math.hypot(n.sx - x, n.sy - y);
      if (dd <= Math.max(n.r, 3) && (!inside || n.depth > inside.depth)) inside = n;
      if (dd <= n.r + 6 && dd - n.r < nd) { nd = dd - n.r; near = n; }
    });
    return inside || near;
  }
  // 들어가기 = 점마다 갈 곳(패널 「들어가기」 단추 · 두 번 누르기가 같은 길을 쓴다)
  function enter(n){
    if (!n) return;
    if (n.type === 'theme' && !n.center) goTheme(n.name);
    else if (n.type === 'theme' && n.center) goFilings(n.name, 0);
    else if (n.type === 'stock' && !n.center) goStock(n.code, S.theme);
    else if (n.type === 'stock' && n.center) openStock(n.code, n.name);
    else if ((n.type === 'filing' || n.type === 'news') && n.u) window.open(n.u, '_blank', 'noopener');
    else if (n.type === 'seat' && n.theme) goTheme(n.theme);
    else if ((n.type === 'peer' || n.type === 'peer2') && n.code) goStock(n.code, S.theme);
    else if (n.type === 'event' && n.d) { if (typeof showDayBubble === 'function') showDayBubble(n.d); }
    else if (n.type === 'mnl') {                          // K = 분류(월간 · 급등) = 그 분류 칸 · 단계 없으면 기준일(월간 칸 · 📈 급등 창)
      if (n.d && typeof window._월간눌림_열기 === 'function') window._월간눌림_열기(n.d, n.K || '월간');
      else if (n.K === '급등') { if (typeof window._급등눌림_급등 === 'function') window._급등눌림_급등(n.테마일); }
      else if (typeof window._월간눌림_월간 === 'function') window._월간눌림_월간(n.테마일);
    }
  }

  // ───────── ① 오른쪽 상세 패널(호두 SYNAPSE 방식) = 무엇 · 원천 · 기준일 · 연결 수 · 직접 연결 목록(선 종류와 이유) · 들어가기 ─────────
  function asofOf(){ return (window.__TE && window.__TE.meta && window.__TE.meta.만든날) || ''; }
  function pa(act, val, label, col){ return '<button class="te-pa" data-a="' + act + '" data-v="' + esc(val || '') + '" style="background:rgba(94,255,214,.12);border:1px solid ' + (col || 'rgba(94,255,214,.35)') + ';color:#dce8ff;font-size:11px;border-radius:7px;padding:4px 10px;margin:0 5px 5px 0;cursor:pointer">' + label + '</button>'; }
  function row(k, v){ return '<div style="display:flex;gap:8px;margin:2px 0"><span style="color:#6f72a8;min-width:52px">' + k + '</span><span style="color:#dce8ff">' + v + '</span></div>'; }
  function linksOf(n){
    var out = [];
    S.edges.forEach(function(e){
      var o = e.a === n.id ? e.b : (e.b === n.id ? e.a : null); if (!o) return;
      var m = S.byId[o]; if (!m || (S.hideGuess && (m.guess || e.k === 'dash'))) return;
      out.push({m: m, k: e.k || 'solid', why: e.why || '', n: e.n || 0});
    });
    if (S.mode === 'overview') out.sort(function(a, b){ return b.n - a.n; });   // 전체 구 = 겹침 많은 순
    return out;
  }
  function linkList(n){
    var L = linksOf(n); if (!L.length) return '';
    var solid = L.filter(function(x){ return x.k !== 'dash'; }).length;
    var show = L.slice(0, 40);
    return '<div style="margin-top:8px;color:#8487bd">직접 연결 ' + L.length + '개 · <span style="color:#9fb3ff">── 확정 ' + solid + '</span> · <span style="color:#ffbe8c">┄┄ 추정 ' + (L.length - solid) + '</span></div>'
      + show.map(function(x){
        return '<div class="te-pa" data-a="sel" data-v="' + esc(x.m.id) + '" title="' + esc(x.why) + '" style="cursor:pointer;padding:3px 0;border-bottom:1px solid rgba(255,255,255,.04);line-height:1.45">'
          + '<span style="color:' + (x.k === 'dash' ? '#ffbe8c' : '#9fb3ff') + '">' + (x.k === 'dash' ? '┄ ' : '─ ') + '</span>'
          + '<span style="color:' + x.m.col + '">' + esc(cut(x.m.name, 30)) + '</span>'
          + (x.m.d ? ' <span style="color:#6f72a8">' + esc(x.m.d) + '</span>' : '')
          + '<div style="color:#6f72a8;font-size:10.5px;padding-left:14px">' + esc(x.why) + '</div></div>';
      }).join('') + (L.length > show.length ? '<div style="color:#6f72a8">… 그 밖 ' + (L.length - show.length) + '개</div>' : '');
  }
  // 패널 목록 = 크게(12px 칩) · 누르면 그 점을 고른다(테마 안) · 종목은 이 테마로 카드에 오른 횟수 순
  function chip(label, act, val, col, sub){ return '<span class="te-pa" data-a="' + act + '" data-v="' + esc(val) + '" style="display:inline-block;background:#161c33;border:1px solid rgba(255,255,255,.12);border-radius:8px;padding:3px 8px;margin:0 4px 5px 0;font-size:12px;color:' + (col || '#dce8ff') + ';cursor:pointer">' + label + (sub ? '<span style="color:#6f72a8;font-size:10.5px"> ' + sub + '</span>' : '') + '</span>'; }
  function rowsByField(th){
    var T = TE()[th]; if (!T) return {};
    var g = {};
    (T.종목 || []).forEach(function(x){ fieldsOf(x).forEach(function(k){ (g[k] = g[k] || []).push(x); }); });
    return g;
  }
  function stockChips(arr, th){                          // 칩 = 강한 순(👑 순위 · 없으면 뒤) → 4년 카드 횟수 · 점 색 = 오른쪽 구와 같은 강도 칸(2026-09-29)
    var RK = rkMap(th);
    return arr.slice().sort(function(a, b){ return (RK[a[0]] || 1e9) - (RK[b[0]] || 1e9) || (b[3] || 0) - (a[3] || 0); }).map(function(x){
      var inMap = S.mode === 'theme' && S.byId['S:' + x[0]], k = RK[x[0]];
      return chip(dotL(lvOfRank(k)) + ' ' + (k === 1 ? '👑 ' : '') + esc(x[1] || x[0]), inMap ? 'sel' : 'stock', inMap ? 'S:' + x[0] : x[0], '#dce8ff', (k ? k + '위 · ' : '') + (x[3] || 0) + '회');
    }).join('');
  }
  function fieldList(th){
    var g = rowsByField(th), ks = Object.keys(g).sort(function(a, b){ return fieldRank(a) - fieldRank(b) || g[b].length - g[a].length; });
    if (!ks.length) return '';
    return '<div style="margin-top:8px;color:#8487bd">세부분야 ' + ks.length + '개 · 종목 칩 = 강한 순(N위) · 4년 카드 횟수 · 점 색 = 오른쪽 구와 같은 강도</div>'
      + ks.map(function(k){
        var inMap = S.mode === 'theme' && S.byId['F:' + k];
        return '<div style="margin-top:6px"><span class="te-pa" data-a="' + (inMap ? 'sel' : 'theme') + '" data-v="' + esc(inMap ? 'F:' + k : th) + '" style="font-size:12.5px;font-weight:700;color:#b8bde6;cursor:pointer">▸ ' + esc(k) + ' <span style="color:#6f72a8;font-weight:400">' + g[k].length + '</span></span><div style="margin-top:4px">' + stockChips(g[k], th) + '</div></div>';
      }).join('');
  }
  function fieldStocks(th, k){ var g = rowsByField(th)[k] || []; return g.length ? '<div style="margin-top:8px;color:#8487bd">이 분야 종목 ' + g.length + '개</div><div style="margin-top:4px">' + stockChips(g, th) + '</div>' : ''; }
  function relThemes(th){                                // 겹치는 종목 많은 테마 10개 = 누르면 그 테마 안으로(뒤로로 돌아옴)
    var E = (window.__TE && window.__TE.edges) || [], T = TE();
    var r = E.filter(function(e){ return (e[0] === th || e[1] === th) && T[e[0] === th ? e[1] : e[0]]; }).map(function(e){ return [e[0] === th ? e[1] : e[0], e[2]]; })
             .sort(function(a, b){ return b[1] - a[1]; }).slice(0, 10);
    return r.length ? '<div style="margin-top:10px;color:#8487bd">겹치는 종목 많은 테마 10 <span style="color:#6f72a8">(통계 · 누르면 그 테마 안으로)</span></div><div style="margin-top:4px">' + r.map(function(x){ return chip(dot(phOf(x[0]).상태) + ' ' + esc(x[0]), 'theme', x[0], '#dce8ff', x[1] + '개'); }).join('') + '</div>' : '';
  }
  // 🕸 전체 구 개요(2026-09-29 사용자 "개요도 맞게 수정해줘 · 뭘 보여줘야겠어?") = ★지금 돈이 도는 곳
  //   ① 칸 수(오른쪽 구 머리줄 칩과 같은 셈) ② 🔴 주도 10 · 🟢 뜨는 표 = 테마 누르면 그 테마 안 · 👑 대장 누르면 그 종목 구
  //   ③ 잰 값(legend() 와 같은 문장) ④ 옛 긴 설명은 📖 읽는 법(<details> = 처음엔 접힘)
  function overviewPanel(txt){
    var B = PH(), M = B.측정 || {};
    if (!B.기준일) return '<div style="color:#ff9a9a">국면 기준 없음 = _생태계\\_테마생태계_빌드.py 다시 실행</div>';
    var c = {'주도': 0, '급증': 0, '살아있음': 0, '죽음': 0};
    S.nodes.forEach(function(n){ if (n.type !== 'theme' || n.fix2d != null) return; var k = st4(n.st); if (k in c) c[k]++; });
    var line = function(th, i, kind){
      var g = phOf(th), L = ldOf(th), top = L && L.순위 && L.순위[0], col = ST4[kind][0];
      var sub = kind === '주도' ? '20일 중 ' + (g.r20 || 0) + '일' : '5일 ' + (g.r5 || 0) + '일 · 직전 15일 ' + (g.p15 || 0) + '일';
      return '<div style="display:flex;gap:6px;align-items:baseline;padding:3px 0;border-bottom:1px solid rgba(255,255,255,.04)">'
        + '<span style="min-width:18px;color:' + col + ';font-weight:800">' + (i + 1) + '</span>'
        + '<span class="te-pa" data-a="theme" data-v="' + esc(th) + '" title="누르면 이 테마 안으로(세부분야 + 종목 · 👑 강한 순)" style="color:#f2f4ff;font-weight:700;cursor:pointer;white-space:nowrap">' + esc(th) + '</span>'
        + '<span style="color:#8b8fb5;font-size:10.5px;white-space:nowrap">' + sub + '</span>'
        + (top ? '<span class="te-pa" data-a="stock" data-v="' + esc(top[0]) + '" title="👑 이 테마 대장 = ' + esc(L.기간[0]) + ' ~ ' + esc(L.기간[1]) + ' 출현일 등락률 누적 1위 · 누르면 그 종목 구" style="margin-left:auto;color:#ffd5d5;cursor:pointer;white-space:nowrap">👑 ' + esc(top[1]) + ' <b style="color:' + (top[2] >= 0 ? '#ff7a7a' : '#6ea0ff') + '">' + pctS(top[2]) + '</b></span>' : '')
        + '</div>';
    };
    var lead = B.주도 || [], surge = B.급증 || [];
    return '<div style="font-size:10px;letter-spacing:.14em;color:#5effd6;margin-bottom:6px">● 개요 · 지금 돈이 도는 곳</div>'
      + '<div style="color:#8487bd;margin-bottom:6px">기준 <b style="color:#dce8ff">' + esc(B.기준일) + '</b> 정규장 카드 · ' + ['주도', '급증', '살아있음', '죽음'].map(function(k){ return dot4(k) + ' ' + ST4[k][1] + ' <b style="color:#f2f4ff">' + c[k] + '</b>'; }).join(' · ') + '</div>'
      + '<div style="margin-top:6px;font-weight:800;color:' + ST4['주도'][0] + '">● 주도 ' + lead.length + ' <span style="color:#6f72a8;font-weight:400;font-size:10.5px">최근 20거래일 카드 등장일수 순 · 테마 누르면 안으로 · 👑 = 그 테마 대장</span></div>'
      + lead.map(function(th, i){ return line(th, i, '주도'); }).join('')
      + '<div style="margin-top:10px;font-weight:800;color:' + ST4['급증'][0] + '">● 뜨는 ' + surge.length + ' <span style="color:#6f72a8;font-weight:400;font-size:10.5px">최근 5일 − 직전 15일/3 순(주도 밖)</span></div>'
      + (surge.length ? surge.map(function(th, i){ return line(th, i, '급증'); }).join('') : '<div style="color:#6f72a8">없음</div>')
      + (M.측정일 ? '<div style="margin-top:10px;line-height:1.55;color:#8a90c0">잰 값(' + esc(M.측정일) + ' · 2026 봉인 구간) = 주도가 다음 10거래일에도 상위 10에 남음 <b style="color:#dce8ff">' + M.주도_지속_봉인 + '%</b>(무작위 ' + M.주도_무작위_봉인 + '%) · 급증이 새 상위 10을 잡음 <b style="color:#dce8ff">' + M.급증_recall_봉인 + '%</b>(무작위의 ' + M.급증_배수_봉인 + '배 · 급증 5개 중 ' + Math.round(M.급증_정밀도_봉인 / 20) + '개꼴로만 실제로 올라섬)</div>' : '')
      + '<div style="margin-top:4px;color:#ff9aaa;font-size:10.5px">카드 등장이지 주가 상승폭·매수신호가 아니다 · 대장 누적 = 카드 입력 등락률(천프정 종가 아님)</div>'
      + '<details style="margin-top:10px"><summary style="cursor:pointer;color:#8487bd">📖 읽는 법(두 구·색·크기·선)</summary><div style="margin-top:6px;line-height:1.55">' + esc(txt) + '</div>'
      + '<div style="margin-top:8px;line-height:1.6;color:#8487bd"><span style="color:#9fb3ff">── 실선</span> = 저장된 관계(역할표 배정 · DART 공시 · 카드 사건 · 제목에 종목명인 뉴스)<br><span style="color:#ffbe8c">┄┄ 점선</span> = 추정(테마끼리 겹침 통계 · 카드로만 엮임 · 같은 날 동행 · 같은 기사 · 장전뉴스 테마 묶음)<br>거리·크기는 보기 위한 배치일 뿐 주가 상관이 아니다.</div></details>'
      + '<div style="margin-top:8px;color:#6f72a8">기준일 ' + esc(asofOf()) + '</div>';
  }
  // 📅 달력으로(2026-09-29 캘린더 검토 ⑧ · 전엔 테마 패널에서 달력으로 가는 길이 없었다) = ① 이 테마가 나온 월간 날짜 ② 이 테마로 뜬 종목의 지금 📉 월간눌림 단계 ③ 🎯 첫터치5 에 이 테마 종목
  //   ①은 테마국면_DATA(구 색과 같은 카드 자료) · ②는 캘린더 공용 _월간눌림_테마(월간눌림.js = 달력과 같은 값 · 처음 한 번 받으면 패널을 다시 그린다) · ③은 첫터치5_ARCHIVE 의 메타(🕸 이름)
  function calLinks(th){
    var h = '<div style="margin-top:10px;padding-top:8px;border-top:1px solid rgba(255,255,255,.08)"><div style="font-size:10px;letter-spacing:.14em;color:#ffcf8a;margin-bottom:4px">● 📅 달력으로</div>';
    var link = function(a, v, t){ return '<span class="te-pa" data-a="' + a + '" data-v="' + esc(v) + '" style="cursor:pointer;color:#7ee8ff;text-decoration:underline;margin-right:6px">' + esc(t) + '</span>'; };
    var R = window.테마국면_DATA, ti = R ? R.T.indexOf(th) : -1;
    if (ti >= 0) {
      var L = R.등장[ti] || [], n20 = L.filter(function(i){ return i >= R.D.length - 20; }).length;
      var ds = L.slice(-8).reverse().map(function(i){ var d = String(R.D[i]); return d.slice(0, 4) + '-' + d.slice(4, 6) + '-' + d.slice(6); });
      h += row('월간', ds.length ? ds.map(function(d){ return link('mnlday', d, d.slice(5)); }).join('') + '<span style="color:#6f72a8">· 4년 ' + L.length + '일 · 최근 20거래일 ' + n20 + '일</span>' : '<span style="color:#6f72a8">월간 카드에 나온 적 없음</span>');
    }
    var M = (S.mnlTheme && S.mnlTheme.th === th) ? S.mnlTheme.list : null;
    if (M === null && typeof window._월간눌림_테마 === 'function' && S.mnlThemeWait !== th) {
      // ★자료가 이미 있으면 콜백이 ★지금 이 자리에서 바로 불린다 → 그때 refreshPanel 을 부르면 바깥 그리기가 「불러오는 중」으로 덮는다(2026-09-29 로봇 실측) ⇒ 바로 불렸으면 결과를 그대로 쓴다
      var sync = true; S.mnlThemeWait = th;
      window._월간눌림_테마(th, function(list){ S.mnlTheme = {th: th, list: list}; S.mnlThemeWait = null; if (!sync) refreshPanel(); });
      sync = false;
      M = (S.mnlTheme && S.mnlTheme.th === th) ? S.mnlTheme.list : null;
    }
    if (M === null) {
      h += row('📉 눌림', '<span style="color:#6f72a8">불러오는 중…</span>');
    } else {
      var MS = window._월간눌림_단계 || [], cnt = [0, 0, 0, 0, 0, 0]; M.forEach(function(x){ cnt[x.지금]++; });
      var deep = M.filter(function(x){ return x.지금 >= 1; });
      h += row('📉 눌림', '이 테마로 뜬 뒤 250거래일 안 <b>' + M.length + '</b>종목 · 지금 ' + [1, 2, 3, 4, 5].map(function(s){ return '<span style="color:' + (MS[s] || {}).c + '">' + (MS[s] || {}).n + cnt[s] + '</span>'; }).join(' ') + ' · ① 전 ' + cnt[0]
        + '<div style="color:#6f72a8;font-size:10px">기준 = 그 종목이 마지막으로 월간에 나온 날 종가(그날 테마가 이 테마) · 누르면 종목창</div>')
        + deep.slice(0, 12).map(function(x){ return '<div class="te-pa" data-a="modal" data-v="' + esc(x.code + '|' + x.name) + '" style="cursor:pointer;font-size:11px;margin:1px 0 1px 60px"><span style="color:' + (MS[x.지금] || {}).c + '">' + (MS[x.지금] || {}).n + '</span> ' + esc(x.name) + ' <span style="color:#8487bd">' + x.ret + '% · ' + x.n + '일째 · 테마일 ' + esc(x.테마일.slice(5)) + '</span></div>'; }).join('')
        + (deep.length > 12 ? '<div style="color:#6f72a8;font-size:10.5px;margin-left:60px">… ' + (deep.length - 12) + '종목 더(📉 월간눌림 달력)</div>' : '');
    }
    var F = window.첫터치5_ARCHIVE || {}, ks = Object.keys(F).sort().reverse(), got = [];
    for (var i = 0; i < ks.length && i < 60 && got.length < 6; i++) {
      var rec = F[ks[i]] || {}, nm = [];
      ['G20', 'G60', 'G120', 'G240', 'G480'].forEach(function(G){ (rec[G] || []).forEach(function(p){ if (p && p.메타 === th && nm.indexOf(p.종목) < 0) nm.push(p.종목); }); });
      if (nm.length) got.push([ks[i], nm]);
    }
    h += row('🎯 첫터치5', got.length ? got.map(function(g){ return link('ft5', g[0], g[0].slice(5)) + '<span style="color:#c9cbe8">' + esc(g[1].slice(0, 4).join('·')) + (g[1].length > 4 ? ' 외 ' + (g[1].length - 4) : '') + '</span>'; }).join('<br>') : '<span style="color:#6f72a8">최근 60칸 안에 이 테마 첫터치 없음</span>');
    return h + '</div>';
  }
  function panelDefault(){
    var T = TE(), txt = {
      overview: '테마 ' + shown().length + '개' + (S.raw ? '(원문 이름 포함 · 원문 이름은 메가가 없어 바깥 껍질)' : '(메타 · 원문 이름 ' + rawN() + '개는 위 「원문 이름 켜기」)') + '. 두 구는 같은 테마 · 같은 자리 · 같은 크기이고 색만 다르다 = 왼쪽 한 색 · 오른쪽 빨강 주도 · 초록 뜨는(급증) · 흰색 살아있음(60거래일 안에 카드에 나옴) · 어두운 회색 죽음(60거래일 넘게 없음). 크기 = 최근 1년 이 테마로 카드에 오른 종목 수 · 자리 = 메가 묶음(이름순 고정 = 날마다 같은 자리 · 묶음 이름이 공 위에 흐리게). 개별이슈·일부·특징주는 테마가 아니라서 구 밖 왼쪽 아래 칸(크기 경쟁·선 없음). 오른쪽 구 위 주도·뜨는·살아있음·죽음 칸을 누르면 두 구에서 그것만 남는다(자리 그대로 · 같은 칸이나 ✕ 전부를 누르면 전부). 어느 쪽 구든 테마를 누르면 두 구가 같이 그 테마 안(세부분야 + 종목)으로 · ◀ 뒤로 = 누르기 전으로.',
      theme: '「' + S.theme + '」 안. 가운데 = 테마 · 안쪽 허브 = 세부분야 · 바깥 = 종목. 분야를 누르면 그 분야 종목만 · 종목을 누르면 그 종목과 분야만 · 가운데나 빈 곳 = 전부 · 두 번 누르면 그 종목 구로 · ◀ 뒤로 = 누르기 전으로.',
      filings: '「' + S.theme + '」 공시 지도. 청록 = 종목(24곳씩) · 보라 = 그 종목 최근 공시 8건. 공시를 누르면 제목·날짜, 두 번 누르면 DART 원문.',
      stock: '종목 구. 가운데 = 종목 · 허브 = 공시·뉴스·테마·동행·사건·같은 기사 종목·📉 월간눌림(테마 받은 날 → 몇 단계까지 빠졌나)·📈 급등눌림(+20% 급등한 날 → 몇 단계까지 빠졌나). 위 층 거르개로 켜고 끈다.'
    }[S.mode] || '';
    if (S.mode === 'overview') return overviewPanel(txt);            // 🕸 전체 구 = 지금 돈이 도는 곳(2026-09-29) · 긴 설명은 📖 읽는 법으로
    return '<div style="font-size:10px;letter-spacing:.14em;color:#5effd6;margin-bottom:6px">● 개요</div><div style="line-height:1.55">' + esc(txt) + '</div>'
      + (S.mode === 'theme' ? leaderTable(S.theme) + calLinks(S.theme) : '')                  // 👑 테마 안 = 아무것도 안 골라도 강한 순 표(2026-09-29 사용자 「맨 오른쪽에도 보여주고」)
      + '<div style="margin-top:10px;line-height:1.6;color:#8487bd"><span style="color:#9fb3ff">── 실선</span> = 저장된 관계(역할표 배정 · DART 공시 · 카드 사건 · 제목에 종목명인 뉴스)<br><span style="color:#ffbe8c">┄┄ 점선</span> = 추정(테마끼리 겹침 통계 · 카드로만 엮임 · 같은 날 동행 · 같은 기사 · 장전뉴스 테마 묶음)<br>거리·크기는 보기 위한 배치일 뿐 주가 상관이 아니다.</div>'
      + '<div style="margin-top:8px;color:#6f72a8">기준일 ' + esc(asofOf()) + '</div>';
  }
  function panelHtml(){
    var n = S.sel && S.byId[S.sel];
    if (!n) return panelDefault();
    var T = TE(), h = '', kind = '', src = '', acts = '';
    if (n.type === 'theme') {
      var t = T[n.name] || {};
      kind = n.center ? '테마 · 지금 보는 곳' : '테마';
      h = row('종목', (t.n종목 || n.n || 0) + '개(역할표 배정 ' + (t.n배정 || 0) + ')') + row('1년', y1Of(n.name) + '종목 <span style="color:#6f72a8">(최근 1년 이 테마로 카드에 오름 = 전체 구 크기)</span>') + (t.메가 ? row('메가', esc(t.메가)) : '') + row('국면', phText(n.name) + ' <span style="color:#6f72a8">· 오른쪽 구 = ' + dot4(st4(phOf(n.name).상태)) + ' ' + ST4[st4(phOf(n.name).상태)][1] + '</span>') + (t.강중약 ? row('강도', esc(strTxt(t.강중약)) + ' <span style="color:#6f72a8">테마강도 표 등급(84메타만 · 국면과 다른 잣대)</span>') : '')
        + leaderTable(n.name) + calLinks(n.name) + fieldList(n.name) + relThemes(n.name);
      src = '4년 카드(정규장 테마 열) + 역할표';
      acts = n.center ? pa('filings', n.name, '📄 이 테마 공시 지도') : pa('theme', n.name, '🕸 이 테마 안으로') + pa('filings', n.name, '📄 공시 지도');
    } else if (n.type === 'field') {
      kind = '세부분야 허브'; h = row('종목', n.n + '개') + row('테마', esc(n.theme || S.theme)) + row('색', dotL(n.lv == null ? 4 : n.lv) + ' ' + LV[n.lv == null ? 4 : n.lv][1] + ' = 이 분야에서 가장 강한 종목의 칸') + fieldStocks(n.theme || S.theme, n.name); src = n.guess ? '4년 카드(역할표 밖)' : '역할표 세부분야';
    } else if (n.type === 'stock') {
      var E = stockE(n.code);
      kind = n.center ? '종목 · 지금 보는 곳' : '종목';
      h = row('코드', esc(n.code)) + (n.분야 ? row('분야', esc(n.분야)) : '') + (typeof n.n === 'number' && !n.hub ? row('4년 카드', n.n + '회' + (n.최근 ? ' · 최근 ' + esc(n.최근) : '')) : '')
        + (S.mode === 'theme' && n.st ? row('이 테마', dot(n.st) + ' ' + stLab(n.st) + ' <span style="color:#6f72a8">(이 테마로 카드에 마지막 오른 때)</span>') : '')
        + (S.mode === 'theme' && n.lv != null ? row('강도', (function(){                   // 👑 이 테마 안 순위 = 패널 강한 순 표와 같은 값
            var L = ldOf(S.theme), r = n.rk && L ? L.순위[n.rk - 1] : null;
            return dotL(n.lv) + ' ' + (r ? '<b style="color:' + LV[n.lv][0] + '">' + (n.rk === 1 ? '👑 대장' : n.rk + '위') + '</b> / ' + L.종목수 + ' · 누적 ' + pctS(r[2]) + ' · ' + r[3] + '일 · 최고 ' + pctS(r[4]) + ' · 마지막 ' + esc(r[5]) : '기간(' + esc(L ? L.기간[0] + ' ~ ' + L.기간[1] : '-') + ') 안 이 테마 카드 없음');
          })()) : '')
        + (E ? row('공시', (E.공시원문n || (E.공시 || []).length).toLocaleString('ko-KR') + '건') + row('뉴스', (E.뉴스 || []).length + '건') + row('최근 공시', (E.공시 || []).slice(0, 3).map(function(x){ return '<div class="te-pa" data-a="url" data-v="' + esc(x.u || '') + '" style="cursor:pointer;color:#c9c2ff">' + esc(x.d) + ' ' + esc(cut(x.t, 28)) + ' ↗</div>'; }).join('') || '-') : row('자료', '종목 구로 들어가면 공시·뉴스가 붙는다'));
      src = E ? '종목 생태계 파일(기준 ' + esc(E.asof || '') + ')' : '테마생태계';
      acts = (n.center ? '' : pa('stock', n.code, '📌 이 종목 구로')) + pa('modal', n.code + '|' + n.name, '종목창 열기') + (E && E.기업 && E.기업.DART ? pa('url', E.기업.DART, 'DART 공시 목록 ↗') : '');
    } else if (n.type === 'filing') {
      kind = 'DART 공시'; h = row('제목', esc(n.name)) + row('접수일', esc(n.d || '')) + (n.stock ? row('종목', esc(n.stock)) : ''); src = n.src || 'DART 목록'; acts = n.u ? pa('url', n.u, 'DART 원문 ↗') : '';
    } else if (n.type === 'news') {
      kind = '뉴스'; h = row('제목', esc(n.name)) + row('날짜', esc(n.d || '')) + (n.theme ? row('테마', esc(n.theme)) : ''); src = n.src || '뉴스'; acts = n.u ? pa('url', n.u, '기사 원문 ↗') : '<span style="color:#6f72a8">링크 없음</span>';
    } else if (n.type === 'seat') {
      kind = '이 종목의 테마'; h = row('테마', esc(n.theme)) + row('분야', esc(n.분야 || '-')) + row('4년 카드', (n.n || 0) + '회' + (n.최근 ? ' · 최근 ' + esc(n.최근) : '')) + row('국면', phText(n.theme)); src = '역할표 + 4년 카드'; acts = pa('theme', n.theme, '🕸 이 테마 안으로');
    } else if (n.type === 'peer' || n.type === 'peer2') {
      kind = n.type === 'peer' ? '같은 날 같은 카드 종목' : '같은 기사 종목';
      h = row('종목', esc(n.name) + ' <span style="color:#6f72a8">' + esc(n.code || '') + '</span>') + row('같이', (n.n || 0) + '회' + (n.최근 ? ' · 최근 ' + esc(n.최근) : '')) + (n.기사 ? row('기사', esc(n.기사)) : '') + (n.theme ? row('테마', esc(n.theme)) : '');
      src = n.type === 'peer' ? '4년 카드(정규장·상한가·52주·시간외)' : '장전뉴스 「테마관련주」(종목 20개 이하 기사만)';
      acts = pa('stock', n.code, '📌 그 종목 구로') + (n.u ? pa('url', n.u, '기사 원문 ↗') : '');
    } else if (n.type === 'event') {
      kind = '카드 사건'; h = row('날짜', esc(n.d)) + row('카드', esc(n.채널 || '')) + (n.이슈 ? row('이슈', esc(n.이슈)) : ''); src = '4년 카드'; acts = pa('date', n.d, '📅 달력 그 날짜');
    } else if (n.type === 'mnl') {                        // 📉 월간눌림 · 📈 급등눌림 한 번 = 기준일 → 단계 도달 경로 · 지금(달력과 같은 자료) · n.K = 분류
      var ep = n.ep || {}, MS = window._월간눌림_단계 || [], GD = n.K === '급등';
      kind = GD ? '📈 급등눌림' : '📉 월간눌림';
      h = row(GD ? '급등한 날' : '테마 받은 날', esc(ep.테마일 || '')) + row(GD ? '🕸 테마' : '월간 테마', esc((ep.원문 || []).join(' / ') || '-')) + (ep.그날 != null ? row('그날 등락', pctS(ep.그날)) : '')
        + row('단계', (ep.도달 || []).length ? ep.도달.map(function(x){ return '<span style="color:' + (MS[x.s] || {}).c + '">' + (MS[x.s] || {}).n + ' ' + esc(x.d.slice(5)) + '</span> <span style="color:#8487bd">(' + x.n + '일 ' + x.ret + '%)</span>'; }).join(' → ') : '아직 -15% 전')
        + (ep.지금 ? row('지금', ep.지금[3] + '% · ' + (ep.지금[2] ? (MS[ep.지금[2]] || {}).n : '① 전') + ' · ' + ep.지금[4] + '거래일째 · 고점 대비 ' + ep.지금[5] + '%') : row('지금', '<span style="color:#6f72a8">끝남(' + (GD ? '다시 급등해 새 기준' : '다시 테마에 나와 새 기준') + ' · 또는 250거래일 지남)</span>'));
      src = GD ? '급등눌림.js(📈 급등 +20% 이상 · 급등일 종가 대비 · 수정주가 · 달력 📉 월간눌림의 📈 급등 분류와 같은 자료)' : '월간눌림.js(월간 칸 테마일 종가 대비 · 수정주가 · 달력 📉 월간눌림과 같은 자료)';
      acts = GD ? (n.d ? pa('mnl', n.d + '|급등', '📈 그 날 급등눌림 칸') : '') + pa('gdnday', ep.테마일 || '', '📈 급등한 날 📈 급등 창')
                : (n.d ? pa('mnl', n.d, '📉 그 날 월간눌림 칸') : '') + pa('mnlday', ep.테마일 || '', '📅 테마 받은 날 월간 칸');
    } else if (n.type === 'hubl') {
      kind = '묶음'; h = row('개수', (n.n || 0).toLocaleString('ko-KR') + '개(지도엔 최근 ' + (n.key === '자리' ? 12 : PER) + ')'); src = '종목 생태계 파일';
    }
    var L = linksOf(n);
    return '<div style="font-size:10px;letter-spacing:.14em;color:' + n.col + ';margin-bottom:4px">● ' + esc(kind) + '</div>'
      + '<div style="font-size:16px;font-weight:800;color:#f2f4ff;margin-bottom:8px;line-height:1.3">' + esc(n.name) + '</div>'
      + row('기준일', esc(asofOf()) || '-') + row('원천', esc(src) || '-') + row('연결', L.length + '개')
      + h + (acts ? '<div style="margin-top:8px">' + acts + '</div>' : '')
      + (n.guess ? '<div style="margin-top:6px;color:#ffbe8c;font-size:10.5px">┄ 이 점은 추정 관계로만 이어졌다</div>' : '')
      + linkList(n);
  }
  function refreshPanel(){
    var p = S.box && S.box.querySelector('.te-panel'); if (p) p.innerHTML = panelHtml();
    var bk = S.box && S.box.querySelector('.te-b-back'); if (bk) { bk.disabled = !S.hist.length; bk.style.opacity = S.hist.length ? '1' : '.4'; }
  }
  // 캔버스 좌표 = 그림판 크기(S.w·S.h) 기준으로 배율 보정 = 두 구 화면 폭이 조금 달라도 같은 점을 집는다
  function ptr(cv, e){ var r = cv.getBoundingClientRect(); return [(e.clientX - r.left) * (S.w / (r.width || S.w)), (e.clientY - r.top) * (S.h / (r.height || S.h))]; }
  function bindCanvas(){
    var list = (S.cvs && S.cvs.length) ? S.cvs.map(function(c){ return c.cv; }) : (S.cv ? [S.cv] : []);
    if (!list.length) return;
    list.forEach(bindOne);                                // ★두 구 = 같은 처리 · 같은 상태(S) = 한쪽을 돌리거나 누르면 다른 쪽도 같이
    if (window.ResizeObserver && !S.ro) { S.ro = new ResizeObserver(resize); }
    if (S.ro) { try { S.ro.disconnect(); list.forEach(function(cv){ S.ro.observe(cv); }); } catch (e) {} }
  }
  function bindOne(cv){
    cv.addEventListener('pointerdown', function(e){ cv.setPointerCapture(e.pointerId); S.drag = {x: e.clientX, y: e.clientY, sx: e.clientX, sy: e.clientY, moved: false}; });
    cv.addEventListener('pointermove', function(e){
      if (S.drag) {
        var dx = e.clientX - S.drag.x, dy = e.clientY - S.drag.y;
        S.drag.x = e.clientX; S.drag.y = e.clientY;
        if (Math.hypot(e.clientX - S.drag.sx, e.clientY - S.drag.sy) > 4) S.drag.moved = true;
        if (S.drag.moved) { S.rotY += dx * 0.008; S.rotX = clamp(S.rotX + dy * 0.008, -1.4, 1.4); redraw(); }
        return;
      }
      var q = ptr(cv, e), n = pick(q[0], q[1]), id = n ? n.id : null;
      if (id !== S.hover) { S.hover = id; cv.style.cursor = id ? 'pointer' : 'grab'; redraw(); }
    });
    cv.addEventListener('pointerleave', function(){ if (!S.drag && S.hover) { S.hover = null; cv.style.cursor = 'grab'; redraw(); } });   // 다른 구로 옮겨가면 가리킴 풀기
    // ★한 번 누르면 = 고르기 + 오른쪽 패널(호두 방식) · 두 번 누르면 = 바로 들어가기(옛 흐름) · 빈 곳 = 고르기 풀기
    cv.addEventListener('pointerup', function(e){
      var d = S.drag; S.drag = null;
      if (d && !d.moved) {
        var q = ptr(cv, e), n = pick(q[0], q[1]);
        if (n && S.mode === 'overview' && n.type === 'theme') { goTheme(n.name); return; }   // 로봇을 누르면 로봇만 = 그 테마 안으로
        selectId(n ? n.id : null);
      }
    });
    cv.addEventListener('dblclick', function(e){
      var q = ptr(cv, e), n = pick(q[0], q[1]);
      if (n) enter(n);
    });
    cv.addEventListener('pointercancel', function(){ S.drag = null; });
    cv.addEventListener('wheel', function(e){ e.preventDefault(); S.zoom = clamp(S.zoom * Math.exp(-e.deltaY * 0.0015), 0.5, 3.5); redraw(); }, {passive: false});
    cv.addEventListener('keydown', function(e){
      var st = 0.12, m = {ArrowLeft: [0, -st], ArrowRight: [0, st], ArrowUp: [-st, 0], ArrowDown: [st, 0]}[e.key];
      if (e.key === 'Backspace') { e.preventDefault(); goBack(); return; }
      if (e.key === 'Escape') { e.preventDefault(); selectId(null); return; }
      if (!m) return; e.preventDefault(); S.rotX = clamp(S.rotX + m[0], -1.4, 1.4); S.rotY += m[1]; redraw();
    });
  }

  function bindBox(b){
    // ③ 체크박스 = change 로 받는다(click 으로 받으면 체크 상태가 바뀌기 전에 읽힌다)
    b.onchange = function(ev){
      var t = ev.target;
      if (t.classList.contains('te-guess-cb')) {
        S.hideGuess = !!t.checked; try { localStorage.setItem('te_hide_guess', S.hideGuess ? '1' : '0'); } catch (e) {}
        if (S.sel && S.byId[S.sel] && S.byId[S.sel].guess && S.hideGuess) S.sel = null;
        refreshPanel(); redraw(); return;
      }
      if (t.classList.contains('te-focus-cb')) {
        S.focus = !!t.checked; try { localStorage.setItem('te_focus', S.focus ? '1' : '0'); } catch (e) {}
        redraw(); return;
      }
      if (t.classList.contains('te-raw-cb')) {
        S.raw = !!t.checked; try { localStorage.setItem('te_raw', S.raw ? '1' : '0'); } catch (e) {}
        if (S.mode === 'overview') { S.sel = null; buildOverview(); render(); redraw(); }
        return;
      }
      if (t.classList.contains('te-layer')) {
        S.layers[t.getAttribute('data-l')] = !!t.checked; try { localStorage.setItem('te_layers', JSON.stringify(S.layers)); } catch (e) {}
        if (S.mode === 'stock') { S.sel = null; buildStock(S.stock); render(); redraw(); }
      }
    };
    b.onclick = function(ev){
      var t = ev.target.closest ? ev.target.closest('.te-b-back, .te-b-all, .te-b-rot, .te-b-view, .te-b-flt, .te-pick, .te-more, .te-home, .te-back-theme, .te-b-fil, .te-b-prev, .te-b-next, .te-b-open, .te-url, .te-pa, .te-b-panel, .te-stf') : null;
      if (!t) return;
      if (t.disabled) return;
      if (t.classList.contains('te-b-back')) { goBack(); return; }
      if (t.classList.contains('te-b-panel')) { S.panelOpen = !S.panelOpen; try { localStorage.setItem('te_panel', S.panelOpen ? '1' : '0'); } catch (e) {} render(); redraw(); return; }
      if (t.classList.contains('te-pa')) {                                     // 패널 단추 · 패널 연결 목록 한 줄
        var a = t.getAttribute('data-a'), v = t.getAttribute('data-v') || '';
        if (a === 'sel') selectId(v);
        else if (a === 'theme') goTheme(v);
        else if (a === 'filings') goFilings(v, 0);
        else if (a === 'stock') goStock(v, S.theme);
        else if (a === 'url') { if (v) window.open(v, '_blank', 'noopener'); }
        else if (a === 'modal') { var pp = v.split('|'); openStock(pp[0], pp[1] || pp[0]); }
        else if (a === 'date') { if (typeof showDayBubble === 'function') showDayBubble(v); }
        else if (a === 'mnl') { var mp = v.split('|'); if (typeof window._월간눌림_열기 === 'function') window._월간눌림_열기(mp[0], mp[1] || '월간'); }      // 📉 월간눌림(2026-09-29) · 「날짜|급등」 = 📈 급등 분류(2026-09-30)
        else if (a === 'mnlday') { if (typeof window._월간눌림_월간 === 'function') window._월간눌림_월간(v); }
        else if (a === 'gdnday') { if (typeof window._급등눌림_급등 === 'function') window._급등눌림_급등(v); }                 // 📈 급등한 날 = 그 날 📈 급등 창(2026-09-30)
        else if (a === 'ft5') { if (typeof window._첫터치5_열기 === 'function') window._첫터치5_열기(v); }                 // 🎯 첫터치5 그 칸(2026-09-29 검토 ⑧)
        return;
      }
      if (t.classList.contains('te-stf')) {                                    // 🎯 국면 칸 = 그것만 · 같은 칸 또는 ✕ = 전부
        var k = t.getAttribute('data-k') || null;
        S.stFilter = (k && S.stFilter !== k) ? k : null; S.hover = null;
        if (S.sel && S.byId[S.sel] && stHidden(S.byId[S.sel])) S.sel = null;
        render(); redraw(); return;
      }
      if (t.classList.contains('te-b-all')) S.stFilter = null;                // 🌐 전체 보기 = 거르개도 끈다(◀ 뒤로·「전체 테마」 글자는 거르개 유지)
      if (t.classList.contains('te-b-all') || t.classList.contains('te-home')) { goAll(); return; }
      if (t.classList.contains('te-back-theme')) { goTheme(S.theme); return; }
      if (t.classList.contains('te-b-fil')) { goFilings(S.theme, 0); return; }
      if (t.classList.contains('te-b-prev')) { goFilings(S.theme, Math.max(0, S.page - 1)); return; }
      if (t.classList.contains('te-b-next')) { goFilings(S.theme, S.page + 1); return; }
      if (t.classList.contains('te-b-open')) { var E0 = stockE(S.stock); openStock(S.stock, (E0 && E0.name) || S.stock); return; }
      if (t.classList.contains('te-url')) { var u = t.getAttribute('data-u'); if (u) window.open(u, '_blank', 'noopener'); return; }
      if (t.classList.contains('te-b-rot')) { S.auto = !S.auto; render(); redraw(); return; }
      if (t.classList.contains('te-b-view')) { S.view = t.getAttribute('data-v'); try { localStorage.setItem('te_view', S.view); } catch (e) {} render(); redraw(); return; }
      if (t.classList.contains('te-b-flt')) { S.filter = t.getAttribute('data-f'); S.all = false; if (S.mode === 'theme') buildTheme(S.theme); render(); redraw(); return; }
      if (t.classList.contains('te-more')) { S.all = true; render(); return; }
      if (t.classList.contains('te-pick')) {
        if (t.getAttribute('data-t')) goTheme(t.getAttribute('data-t'));
        else goStock(t.getAttribute('data-c'), S.theme);          // 목록에서도 지도와 같게 = 그 종목 구로
      }
    };
  }

  function start(box, theme){
    S.box = box; bindBox(box);
    try { S.view = localStorage.getItem('te_view') || 'map'; } catch (e) {}
    if (theme && TE()[theme]) goTheme(theme); else goAll();
  }
  function withData(box, theme){
    if (window.__TE && window.__TE.themes) { start(box, theme); return; }
    box.innerHTML = '<div style="font-size:11px;color:#8487bd;padding-top:10px">🕸 테마 생태계 불러오는 중…</div>';
    var s = document.createElement('script'); s.src = 'dashboard/data/테마생태계.js';
    s.onload = function(){ (window.__TE && window.__TE.themes) ? start(box, theme) : (box.innerHTML = '<div style="font-size:11px;color:#8487bd">테마생태계.js 형식이 다릅니다</div>'); };
    s.onerror = function(){ box.innerHTML = '<div style="font-size:11px;color:#8487bd">테마생태계.js 미생성 — _생태계\\_테마생태계_빌드.py 실행</div>'; };
    document.head.appendChild(s);
  }

  window._테마생태계_채우기 = function (theme, id) {           // 테마 하나로 들어가기(자리 고리 클릭·검색)
    var box = document.getElementById(id); if (!box) return;
    withData(box, theme);
  };
  // 점검용(읽기 전용) = 지금 모드 · 고른 점 · 실선/점선 개수 · 앞쪽 점 화면 좌표(브라우저 검증에서 클릭 위치를 알려고)
  window.__TE_점검 = function (type, nm) {
    var vis = S.nodes.filter(function(n){ return n.sx != null && !(S.hideGuess && n.guess) && (!type || n.type === type) && (!nm || n.name === nm); }).sort(function(a, b){ return b.depth - a.depth; });
    return {mode: S.mode, sel: S.sel, nodes: S.nodes.length, solid: S.edges.filter(function(e){ return (e.k || 'solid') === 'solid'; }).length,
            dash: S.edges.filter(function(e){ return e.k === 'dash'; }).length, guessNodes: S.nodes.filter(function(n){ return n.guess; }).length,
            front: vis.slice(0, 6).map(function(n){ return {id: n.id, type: n.type, name: n.name, x: Math.round(n.sx), y: Math.round(n.sy)}; }),
            보임: (function(){ var fs = focusSet(); return S.nodes.filter(function(n){ return !(S.hideGuess && n.guess) && !(fs && !fs[n.id]) && !stHidden(n); }).length; })(),
            거르개: S.stFilter,
            색: S.nodes.reduce(function(o, n){ var k = (n.st || '-') + ' ' + n.col; o[k] = (o[k] || 0) + 1; return o; }, {}),
            구: (S.cvs || []).map(function(c){ return c.plain ? '왼쪽(한 색)' : '오른쪽(국면)'; }),
            색4: S.nodes.reduce(function(o, n){ if (n.type === 'theme' && n.fix2d == null) { var k = st4(n.st); o[k] = (o[k] || 0) + 1; } return o; }, {}),
            개별칸: S.nodes.filter(function(n){ return n.fix2d != null; }).map(function(n){ return n.name + ' ' + n.n; })};
  };
  window.__TE_구조 = function () {                      // 점검용 = 지금 화면의 점·선·보이는 점
    var fs = focusSet();
    return {mode: S.mode, theme: S.theme, sel: S.sel, hist: S.hist.length,
            nodes: S.nodes.map(function(n){ return {id: n.id, type: n.type, name: n.name, center: !!n.center, hub: !!n.hub, ok: isFinite(n.p[0]) && isFinite(n.p[1]) && isFinite(n.p[2]), code: n.code || '', sx: n.sx, sy: n.sy, r: n.r, depth: n.depth, 오른쪽색: colOf(n, false), 왼쪽색: colOf(n, true), rk: n.rk || 0}; }),
            edges: S.edges.map(function(e){ return [e.a, e.b, e.k || 'solid']; }),
            visible: fs ? Object.keys(fs) : null};
  };
  window.__TE_고르기 = function (id) { selectId(id); };
  window.__TE_뒤로 = function () { goBack(); };
  window._테마국면색 = function (th) { return stCol(phOf(th).상태); };   // 맨 위 칸 테마 칩이 같은 색을 쓴다
  // 종목창 모달(생태계_뷰.js) 자리 줄 = 같은 국면 · 테마생태계.js 에 없는 테마면 null(「카드 없음」으로 잘못 칠하지 않게)
  window._테마국면 = function (th) {
    var t = TE()[th]; if (!t || !t.국면) return null;
    var g = t.국면, s = g.상태;
    var plain = s === '없음' ? '카드 없음(역할표에만 있음)' : stLab(s) + (g.순위 ? ' ' + g.순위 + '위' : '') + ' · 20거래일 중 ' + (g.r20 || 0) + '일 · 최근 5일 ' + (g.r5 || 0) + '일(직전 15일 ' + (g.p15 || 0) + '일) · 테마 마지막 ' + (g.마지막 || '-') + (g.전 ? '(' + g.전 + '거래일 전)' : '(기준일)');
    return {상태: s, 이름: stLab(s), 색: stCol(s), 순위: g.순위 || 0, 글: plain, 기준일: PH().기준일 || ''};
  };
  window._생태계지도_종목 = function (code, id) {               // 종목 하나 구(맨 위 칸 검색) = 가운데 종목 · 공시·뉴스·테마·동행·사건 허브
    var box = document.getElementById(id); if (!box || !/^[0-9A-Z]{6}$/.test(String(code || ''))) return;
    var go = function(){ S.box = box; bindBox(box); try { S.view = localStorage.getItem('te_view') || 'map'; } catch (e) {} goStock(String(code), ''); };
    if (window.__TE && window.__TE.themes) { go(); return; }
    var s = document.createElement('script'); s.src = 'dashboard/data/테마생태계.js'; s.onload = go; s.onerror = go; document.head.appendChild(s);
  };
  window._생태계지도_전체 = function (id) {                     // 전체 테마 구(맨 위 칸 기본)
    var box = document.getElementById(id); if (!box) return;
    withData(box, '');
  };
})();
