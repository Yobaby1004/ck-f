/* 🏅 베스트 겹침 · 강한 섹터 (2026-10-10 사용자 "베스트 버튼… 달력을 클릭하면 50개가 넘는 기계가 걸른 종목이 겹치는 순서로 나열하고, 강한 섹터 순으로 나열")
   규칙 = 주도주\_천억장부\베스트겹침\규칙_v1.md (다르면 그 문서가 맞다) · 검산 = 같은 폴더 베스트겹침.py check
   한마디로: 베스트 달력 칸을 누르면, 이미 실린 52개 기계 자료로 그 칸에서 '기계가 고른 종목'을 모아 상세창 맨 위에
     ① 겹침 순(계열 수 → 기계 수 → 섹터 국면 → 코드) ② 강한 섹터 순(주도 1~10위 → 뜨는 → 살아있음 → 죽음 → 섹터 없음)으로 보여 준다.
   - 세는 대상 = 천억 장부(_천억장부\장부_모으기.py)와 같은 '고른 종목'(관찰 줄 · 어사이드50 미확인 · 신호일이 칸보다 뒤인 줄은 뺌 · 어사이드8·9 종가·8시 두 명단 = 1기계)
   - 계열 = 베스트52검증\계열표_v1.json 의 dependency_family(닮은 기계끼리 같은 계열 = 1표)
   - 섹터 = _국면.종목(코드, _국면.하루전(칸)) = 칸 전날까지 카드의 1위 테마와 그 국면(미래 안 봄)
   - 새 자료 파일 · 예약 작업 없음. 기계 지도(SRC·FAM·KEYS)는 베스트겹침.py build 가 만든다(새 어사이드 기계를 붙이면 build 다시).
   - 이 파일은 베스트_간략보기.js 뒤에 읽는다(상세창 감싸기 맨 바깥).
   - 관찰용 · 매수추천 아님 · 겹침이 많다고 더 오른다는 증거 없음(베스트52 Step 4 공통선택 시험 · 베스트거래검증 Step 4 계좌 시험).
   v2(2026-10-10 · 규칙_v2.md) = 생태계(칸) → 종목마다 다른 버튼에서 본 위치·관점 배지 11종(악재경고 · 주도3안 · 월간 카드 · 급등 · 월간눌림 · 급등눌림 · 첫터치5 · 2060 · 검사관 · 추천주5 · 유튜브)
     · 칸 날 아침 9시 전에 알 수 있던 자료만(전날 P · 최근 20거래일 W20 · 5거래일 W5 · D 칸) · 배지마다 근거 날짜(ev)를 함께 낸다. */
(function (root) {
  'use strict';
  /* @@생성 시작 · 베스트겹침.py build 가 다시 씀 · 손으로 고치지 않음 */
  var SRC = {"1위패턴":{"a":["베스트_ARCHIVE"],"c":null,"n":[]},"어사이드1":{"a":["베스트2_ARCHIVE"],"c":null,"n":[]},"어사이드2":{"a":["베스트3_ARCHIVE"],"c":null,"n":[]},"어사이드3":{"a":["베스트4_ARCHIVE"],"c":null,"n":[]},"어사이드4":{"a":["베스트5_ARCHIVE"],"c":null,"n":[]},"어사이드5":{"a":["베스트6_ARCHIVE"],"c":null,"n":[]},"어사이드6":{"a":["베스트7_ARCHIVE"],"c":null,"n":[]},"어사이드7":{"a":["베스트8_ARCHIVE"],"c":null,"n":[]},"어사이드8":{"a":["베스트9_PAST","베스트9_ARCHIVE"],"c":null,"n":[]},"어사이드9":{"a":["베스트10_PAST","베스트10_ARCHIVE"],"c":null,"n":[]},"어사이드10":{"a":["베스트11_PAST","베스트11_ARCHIVE"],"c":null,"n":[]},"어사이드11":{"a":["베스트12_PAST","베스트12_ARCHIVE"],"c":null,"n":[]},"어사이드12":{"a":["베스트13_PAST","베스트13_ARCHIVE"],"c":null,"n":[]},"어사이드13":{"a":["베스트14_PAST","베스트14_ARCHIVE"],"c":null,"n":[]},"어사이드14":{"a":["베스트15_PAST","베스트15_ARCHIVE"],"c":null,"n":[]},"어사이드15":{"a":["베스트16_PAST","베스트16_ARCHIVE"],"c":null,"n":[]},"어사이드16":{"a":["어사이드16_PAST","어사이드16_ARCHIVE"],"c":null,"n":[]},"어사이드17":{"a":["어사이드17_ARCHIVE"],"c":null,"n":[]},"어사이드18":{"a":["어사이드18_ARCHIVE"],"c":"어사이드18_COLS","n":["어사이드18_NAMES"]},"어사이드19":{"a":["어사이드19_ARCHIVE"],"c":"어사이드19_COLS","n":["어사이드19_NAMES"]},"어사이드20":{"a":["어사이드20_ARCHIVE"],"c":"어사이드20_COLS","n":["어사이드20_NAMES"]},"어사이드21":{"a":["어사이드21_ARCHIVE"],"c":"어사이드21_COLS","n":["어사이드21_NAMES"]},"어사이드22":{"a":["어사이드22_ARCHIVE"],"c":"어사이드22_COLS","n":["어사이드22_NAMES"]},"어사이드23":{"a":["어사이드23_ARCHIVE"],"c":"어사이드23_COLS","n":["어사이드23_NAMES"]},"어사이드24":{"a":["어사이드24_ARCHIVE"],"c":"어사이드24_COLS","n":["어사이드24_NAMES"]},"어사이드25":{"a":["어사이드25_ARCHIVE"],"c":"어사이드25_COLS","n":["어사이드25_NAMES"]},"어사이드26":{"a":["어사이드26_ARCHIVE"],"c":"어사이드26_COLS","n":["어사이드26_NAMES"]},"어사이드27":{"a":["어사이드27_ARCHIVE"],"c":"어사이드27_COLS","n":["어사이드27_NAMES"]},"어사이드28":{"a":["어사이드28_ARCHIVE"],"c":"어사이드28_COLS","n":["어사이드28_NAMES"]},"어사이드29":{"a":["어사이드29_ARCHIVE"],"c":"어사이드29_COLS","n":["어사이드29_NAMES"]},"어사이드30":{"a":["어사이드30_PAST","어사이드30_ARCHIVE"],"c":null,"n":["어사이드30_NAMES"]},"어사이드31":{"a":["어사이드31_PAST","어사이드31_ARCHIVE"],"c":null,"n":["어사이드31_NAMES"]},"어사이드32":{"a":["어사이드32_PAST","어사이드32_ARCHIVE"],"c":null,"n":["어사이드32_NAMES"]},"어사이드33":{"a":["어사이드33_PAST","어사이드33_ARCHIVE"],"c":null,"n":["어사이드33_NAMES"]},"어사이드34":{"a":["어사이드34_PAST","어사이드34_ARCHIVE"],"c":null,"n":["어사이드34_NAMES"]},"어사이드35":{"a":["어사이드35_ARCHIVE"],"c":"어사이드35_COLS","n":["어사이드35_NAMES"]},"어사이드36":{"a":["어사이드36_PAST","어사이드36_ARCHIVE"],"c":null,"n":["어사이드36_NAMES"]},"어사이드37":{"a":["어사이드37_ARCHIVE"],"c":"어사이드37_COLS","n":["어사이드37_NAMES"]},"어사이드38":{"a":["어사이드38_PAST","어사이드38_ARCHIVE"],"c":null,"n":["어사이드38_NAMES"]},"어사이드39":{"a":["어사이드39_ARCHIVE"],"c":"어사이드39_COLS","n":["어사이드39_NAMES"]},"어사이드40":{"a":["어사이드40_ARCHIVE"],"c":"어사이드40_COLS","n":["어사이드40_NAMES"]},"어사이드41":{"a":["어사이드41_ARCHIVE"],"c":"어사이드41_COLS","n":["어사이드41_NAMES"]},"어사이드42":{"a":["어사이드42_ARCHIVE"],"c":"어사이드42_COLS","n":["어사이드42_NAMES"]},"어사이드43":{"a":["어사이드43_ARCHIVE"],"c":"어사이드43_COLS","n":["어사이드43_NAMES"]},"어사이드44":{"a":["어사이드44_ARCHIVE"],"c":"어사이드44_COLS","n":["어사이드44_NAMES"]},"어사이드45":{"a":["어사이드45_ARCHIVE"],"c":"어사이드45_COLS","n":["어사이드45_NAMES"]},"어사이드46":{"a":["어사이드46_ARCHIVE"],"c":"어사이드46_COLS","n":["어사이드46_NAMES"]},"어사이드47":{"a":["어사이드47_PAST","어사이드47_ARCHIVE"],"c":null,"n":[]},"어사이드48":{"a":["어사이드48_ARCHIVE"],"c":"어사이드48_COLS","n":["어사이드48_NAMES"]},"어사이드49":{"a":["어사이드49_ARCHIVE"],"c":"어사이드49_COLS","n":["어사이드49_NAMES"]},"어사이드50":{"a":["어사이드50_PAST","어사이드50_ARCHIVE"],"c":"어사이드50_COLS","n":["어사이드50_NAMES"]},"어사이드51":{"a":["어사이드51_ARCHIVE"],"c":"어사이드51_COLS","n":["어사이드51_NAMES"]},"어사이드52":{"a":["어사이드52_ARCHIVE"],"c":"어사이드52_COLS","n":["어사이드52_NAMES"]},"어사이드53":{"a":["어사이드53_ARCHIVE"],"c":"어사이드53_COLS","n":["어사이드53_NAMES"]},"어사이드54":{"a":["어사이드54_ARCHIVE"],"c":"어사이드54_COLS","n":["어사이드54_NAMES"]},"어사이드55":{"a":["어사이드55_ARCHIVE"],"c":"어사이드55_COLS","n":["어사이드55_NAMES"]},"어사이드56":{"a":["어사이드56_ARCHIVE"],"c":"어사이드56_COLS","n":["어사이드56_NAMES"]}};
  var FAM = {"1위패턴":"F09","어사이드1":"F12","어사이드2":"F13","어사이드3":"F13","어사이드4":"F12","어사이드5":"F07","어사이드6":"F08","어사이드7":"F08","어사이드8":"F02","어사이드9":"F02","어사이드10":"F11","어사이드11":"F11","어사이드12":"F11","어사이드13":"F10","어사이드14":"F11","어사이드15":"F02","어사이드16":"F15","어사이드17":"F04","어사이드18":"F03","어사이드19":"F03","어사이드20":"F03","어사이드21":"F03","어사이드22":"F03","어사이드23":"F03","어사이드24":"F03","어사이드25":"F03","어사이드26":"F03","어사이드27":"F03","어사이드28":"F03","어사이드29":"F03","어사이드30":"F03","어사이드31":"F03","어사이드32":"F03","어사이드33":"F03","어사이드34":"F03","어사이드35":"F07","어사이드36":"F07","어사이드37":"F07","어사이드38":"F07","어사이드39":"F07","어사이드40":"F07","어사이드41":"F05","어사이드42":"F05","어사이드43":"F14","어사이드44":"F07","어사이드45":"F07","어사이드46":"F01","어사이드47":"F07","어사이드48":"F01","어사이드49":"F01","어사이드50":"F01","어사이드51":"F06","어사이드52":"새:어사이드52","어사이드53":"새:어사이드53","어사이드54":"새:어사이드54","어사이드55":"새:어사이드55","어사이드56":"새:어사이드56"};
  var KEYS = ["1위패턴","어사이드1","어사이드2","어사이드3","어사이드4","어사이드5","어사이드6","어사이드7","어사이드8","어사이드9","어사이드10","어사이드11","어사이드12","어사이드13","어사이드14","어사이드15","어사이드16","어사이드17","어사이드18","어사이드19","어사이드20","어사이드21","어사이드22","어사이드23","어사이드24","어사이드25","어사이드26","어사이드27","어사이드28","어사이드29","어사이드30","어사이드31","어사이드32","어사이드33","어사이드34","어사이드35","어사이드36","어사이드37","어사이드38","어사이드39","어사이드40","어사이드41","어사이드42","어사이드43","어사이드44","어사이드45","어사이드46","어사이드47","어사이드48","어사이드49","어사이드50","어사이드51","어사이드52","어사이드53","어사이드54","어사이드55","어사이드56"];
  var BUILT = {"n":57,"families":20,"not_in_family_table":["어사이드52","어사이드53","어사이드54","어사이드55","어사이드56"],"family_table_only":[],"family_table":"베스트52검증\\계열표_v1.json"};
  /* @@생성 끝 */
  var VERSION = 'v2';
  var CODE_RE = /^[0-9A-Z]{6}$/;
  var ORD = {'주': 0, '급': 1, '살': 2, '죽': 3, '': 4};
  var own = function (o, k) { return Object.prototype.hasOwnProperty.call(o, k); };
  var ordOf = function (c) { return own(ORD, c) ? ORD[c] : 4; };
  var KIDX = {};
  KEYS.forEach(function (k, i) { KIDX[k] = i; });
  var cmpKey = function (a, b) { return KIDX[a] - KIDX[b]; };
  var cmpStr = function (a, b) { return a < b ? -1 : (a > b ? 1 : 0); };

  // ── 날짜 = 장부 dint 와 같음('-' 지우고 앞 8자가 숫자 8개면 그 날짜)
  function dint(x) {
    if (x === null || x === undefined) return null;
    var t = String(x).replace(/-/g, '').slice(0, 8);
    return /^[0-9]{8}$/.test(t) ? +t : null;
  }
  function prevDay(X) {
    var d = new Date(Math.floor(X / 10000), Math.floor(X / 100) % 100 - 1, X % 100 - 1);
    return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
  }

  // ── 기계마다 날짜 → 칸 목록(처음 한 번만 만든다 · _PAST 먼저, 같은 키는 뒤 것이 이김 = 장부 arch.update 와 같음)
  var IDX = null;
  function buildIdx() {
    IDX = {};
    KEYS.forEach(function (key) {
      var merged = {}, s = SRC[key] || {};
      (s.a || []).forEach(function (name) {
        var o = root[name];
        if (!o || typeof o !== 'object' || Array.isArray(o)) return;
        for (var kk in o) if (own(o, kk) && dint(kk)) merged[kk] = o[kk];
      });
      var idx = {};
      Object.keys(merged).sort().forEach(function (kk) { var X = dint(kk); (idx[X] = idx[X] || []).push(merged[kk]); });
      IDX[key] = idx;
    });
  }

  // ── 한 칸에서 기계가 고른 종목(장부_모으기.py 와 같은 규칙)
  function sigOf(cell) {
    var ks = ['신호일', 'sd', 'signal', 's'];
    for (var i = 0; i < ks.length; i++) {
      if (!own(cell, ks[i])) continue;
      var v = cell[ks[i]];
      if (v !== null && typeof v === 'object') continue;              // 목록·사전은 신호일이 아님
      var d = dint(v);
      if (d) return d;
    }
    return null;
  }
  function listsOf(key, cell) {
    if (key === '어사이드8' || key === '어사이드9') {                  // 종가 타점(t) · 8시 명단(a) = 같은 기계
      return ['t', 'a'].map(function (lk) { return Array.isArray(cell[lk]) ? cell[lk] : []; });
    }
    var ks = ['picks', 'p', 'a', 'r'];
    for (var i = 0; i < ks.length; i++) if (Array.isArray(cell[ks[i]])) return [cell[ks[i]]];
    return [];
  }
  function pickRows(key, cell, X, cols) {
    var out = [], sig = sigOf(cell);
    listsOf(key, cell).forEach(function (L) {
      L.forEach(function (it) {
        var code, name, st;
        if (it && typeof it === 'object' && !Array.isArray(it)) {
          code = it.code || it.c; name = it['종목'] || it.n || it.name; st = it['상태'] || it['결과'] || it.s;
        } else if (Array.isArray(it) && cols) {
          var m = {};
          for (var i = 0; i < Math.min(cols.length, it.length); i++) m[cols[i]] = it[i];
          if (key === '어사이드50' && !(m.o === 1 || m.o === true)) return;   // 확인 신호만(미확인 = 관찰)
          code = m.c; name = m.n || m.name; st = key === '어사이드50' ? m.ps : m.s;
        } else return;
        code = String(code || '').trim().toUpperCase();
        if (!CODE_RE.test(code)) return;
        if (typeof st === 'string' && (st.toLowerCase().indexOf('observ') === 0 || st.indexOf('관찰') === 0)) return;   // 관찰 줄
        if (sig !== null && sig > X) return;                            // 신호일이 칸보다 뒤 = 미래 섞임
        out.push({code: code, name: name});
      });
    });
    return out;
  }

  // ── 이름(보이기용 · 순서에는 안 씀) = 칸 줄 이름 → 기계 이름표(_NAMES) → 생태계 색인
  var NAMEMAP = null;
  function nameOf(code) {
    if (!NAMEMAP) {
      NAMEMAP = {};
      KEYS.forEach(function (key) {
        ((SRC[key] || {}).n || []).forEach(function (nm) {
          var o = root[nm];
          if (!o || typeof o !== 'object') return;
          for (var c in o) {
            if (!own(o, c) || own(NAMEMAP, c)) continue;
            var v = o[c];
            if (Array.isArray(v)) v = v.filter(function (x) { return typeof x === 'string' && x; })[0];
            if (typeof v === 'string' && v) NAMEMAP[c] = v;
          }
        });
      });
    }
    if (own(NAMEMAP, code)) return NAMEMAP[code];
    var E = root.ECO_INDEX && root.ECO_INDEX.stocks;
    if (E && E[code] && E[code][0]) return String(E[code][0]);
    return '';
  }

  // ── 섹터 = 칸 전날까지 카드의 1위 테마 · 국면(테마국면_공용.js 그대로)
  function sectorOf(code, basis) {
    var G = root._국면;
    var p = (G && typeof G.종목 === 'function') ? G.종목(code, basis) : null;
    if (!p || !p.이름) return {th: null, c: '', rk: 0, role: false};
    return {th: String(p.이름), c: p.c || '', rk: p.rk || 0, role: !!p.역할};
  }

  // ── 순서 규칙(규칙_v1 2장)
  function cmpStock(a, b) {
    return (b.nf - a.nf) || (b.nm - a.nm) || (ordOf(a.c) - ordOf(b.c)) || ((a.rk || 99) - (b.rk || 99)) || cmpStr(a.code, b.code);
  }
  function cmpSector(a, b) {
    return ((a.th === null ? 1 : 0) - (b.th === null ? 1 : 0)) || (ordOf(a.c) - ordOf(b.c)) || ((a.rk || 99) - (b.rk || 99))
      || (b.votes - a.votes) || (b.n - a.n) || cmpStr(a.key, b.key);
  }

  function 계산(Xin) {
    var X = dint(Xin);
    if (!X) return null;
    if (!IDX) buildIdx();
    var per = {}, machines = [];
    KEYS.forEach(function (key) {
      var cells = (IDX[key] || {})[X];
      if (!cells) return;
      var s = SRC[key] || {}, cv = s.c ? root[s.c] : null, cols = (Array.isArray(cv) && cv.length) ? cv : null, got = false;
      cells.forEach(function (cell) {
        if (!cell || typeof cell !== 'object' || Array.isArray(cell)) return;
        pickRows(key, cell, X, cols).forEach(function (r) {
          got = true;
          var d = per[r.code] || (per[r.code] = {code: r.code, name: '', m: {}});
          d.m[key] = 1;
          if (!d.name && r.name) d.name = String(r.name).slice(0, 30);
        });
      });
      if (got) machines.push(key);
    });
    var G = root._국면;
    var basis = (G && typeof G.하루전 === 'function') ? G.하루전(X) : prevDay(X);
    var stocks = Object.keys(per).map(function (code) {
      var d = per[code], ms = Object.keys(d.m).sort(cmpKey), fs = {};
      ms.forEach(function (m) { fs[own(FAM, m) ? FAM[m] : ('새:' + m)] = 1; });
      var sec = sectorOf(code, basis);
      return {code: code, name: d.name || nameOf(code), nm: ms.length, nf: Object.keys(fs).length, machines: ms, fams: Object.keys(fs).sort(cmpStr),
              th: sec.th, c: sec.c, rk: sec.rk, role: sec.role};
    });
    stocks.sort(cmpStock);
    var GS = {}, sectors = [];
    stocks.forEach(function (s) {
      var k = s.th === null ? '섹터 없음' : s.th;
      var g = GS[k];
      if (!g) { g = GS[k] = {key: k, th: s.th, c: s.c, rk: s.rk, n: 0, votes: 0, multi: 0, stocks: []}; sectors.push(g); }
      g.n += 1; g.votes += s.nm; g.multi += s.nm >= 2 ? 1 : 0; g.stocks.push(s);
    });
    sectors.sort(cmpSector);
    var maxm = 0, ge2 = 0, ge3 = 0;
    stocks.forEach(function (s) { if (s.nm > maxm) maxm = s.nm; if (s.nm >= 2) ge2++; if (s.nm >= 3) ge3++; });
    return {X: X, basis: basis, version: VERSION, n_keys: KEYS.length, machines: machines, stocks: stocks, sectors: sectors, maxm: maxm, ge2: ge2, ge3: ge3};
  }

  // ── 생태계 배지(v2 · 규칙_v2.md 2·3장) ── 다른 버튼에서 본 이 종목의 위치·관점 · 순서는 바꾸지 않는다
  var ECO_ORDER = ['악재경고', '주도3안', '월간', '급등', '월간눌림', '급등눌림', '첫터치5', '2060', '검사관', '추천주5', '유튜브'];
  var CIRC = ['', '①', '②', '③', '④', '⑤'];
  var pad2 = function (n) { return (n < 10 ? '0' : '') + n; };
  var fmtD = function (d) { return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate()); };
  var dashD = function (X) { var s = String(X); return s.slice(0, 4) + '-' + s.slice(4, 6) + '-' + s.slice(6, 8); };
  var md = function (s) { s = String(s).replace(/-/g, ''); return (+s.slice(4, 6)) + '/' + (+s.slice(6, 8)); };
  var rnd = function (x) { return Math.floor(Number(x) + 0.5); };
  function tdBack(Ds, n) {                                              // Ds 앞 n 번째 거래일(평일 · 증시휴장_DATA 아님)
    var H = root.증시휴장_DATA || {}, p = Ds.split('-'), d = new Date(+p[0], +p[1] - 1, +p[2]), k = 0, s = Ds;
    while (k < n) { d.setDate(d.getDate() - 1); s = fmtD(d); var w = d.getDay(); if (w !== 0 && w !== 6 && !H[s]) k++; }
    return s;
  }
  function keysIn(obj, a, b) { return Object.keys(obj || {}).filter(function (k) { return k >= a && k <= b; }).sort(); }
  var _rng = {};
  function 범위(name, obj, D) {                                        // 그 날 자료가 없을 때 이유 = 시작 전 · 아직 없음 · 그날 없음
    var r = _rng[name];
    if (!r) { var ks = Object.keys(obj || {}).sort(); r = _rng[name] = [ks[0] || '', ks[ks.length - 1] || '']; }
    return D < r[0] ? '시작 전' : (D > r[1] ? '아직 없음' : '그날 없음');
  }

  function 생태계(Xin) {
    var X = dint(Xin);
    if (!X) return null;
    var R0 = 계산(X);
    if (!R0) return null;
    var D = dashD(X), P = tdBack(D, 1), W20a = tdBack(D, 20), W5a = tdBack(D, 5);
    var st = {}, B = {}, extra = {}, codes = {};
    R0.stocks.forEach(function (s) { codes[s.code] = s; });
    var has = function (c) { return c != null && own(codes, String(c)); };
    var add = function (code, k, t, ev, det) { (B[code] = B[code] || {})[k] = {k: k, t: t, ev: ev, d: det}; };
    var note = function (code, line) { (extra[code] = extra[code] || []).push(line); };

    // 1 ⚠ 악재경고 = D 칸(악재가 있으면 악재 · 없으면 주의)
    var AK = root.악재경고_ARCHIVE;
    if (!AK) st.악재경고 = '자료 없음';
    else {
      var ak = AK[D];
      st.악재경고 = ak ? 'ok' : 범위('악재경고', AK, D);
      if (ak) (ak.picks || []).forEach(function (p) {
        if (!p || !has(p.c) || (p.lv !== '악재' && p.lv !== '주의')) return;
        var c = String(p.c), cur = B[c] && B[c].악재경고;
        if (cur && cur.t === '⚠악재') return;
        add(c, '악재경고', '⚠' + p.lv, [D], '악재경고 ' + p.lv + ' · ' + (p.why || []).slice(0, 2).join(' / ') + (ak.sealed ? ' · 봉인' : ' · 소급'));
      });
    }

    // 2 🌅 주도3안 = D 아침 카드 · 대표 > 관련 · 같으면 작은 안 번호 · 섹터만 같으면 펼친 글만
    var J3 = root.JS3_DAYS;
    if (!J3) st.주도3안 = '자료 없음';
    else {
      var c3 = J3[D];
      st.주도3안 = c3 ? 'ok' : 범위('주도3안', J3, D);
      if (c3 && Array.isArray(c3.c)) {
        var best = {};
        c3.c.forEach(function (s, i) {
          if (!s) return;
          var put = function (code, rank) {
            if (!has(code)) return;
            code = String(code);
            var b = best[code];
            if (!b || rank < b[0] || (rank === b[0] && i < b[1])) best[code] = [rank, i];
          };
          if (s.r && s.r.c) put(s.r.c, 0);
          (s.rel || []).forEach(function (r) { if (r && r[1]) put(r[1], 1); });
        });
        Object.keys(best).forEach(function (code) {
          var b = best[code], s = c3.c[b[1]];
          add(code, '주도3안', '🌅' + (b[1] + 1) + '안 ' + (b[0] ? '관련' : '대표'), [D],
              (b[1] + 1) + '안 ' + (s.s || '') + ' · 대표 ' + ((s.r && s.r.n) || '') + ' · 관련 ' + (s.rel || []).map(function (r) { return r[0]; }).join('·') + ' · ' + (c3.k === '재현' ? '재현 카드' : '봉인 카드'));
        });
        R0.stocks.forEach(function (s0) {
          if (best[s0.code] || !s0.th) return;
          for (var i = 0; i < c3.c.length; i++) if (c3.c[i] && c3.c[i].s === s0.th) { note(s0.code, '🌅 오늘 주도3안 ' + (i + 1) + '안 = 이 종목 섹터(' + s0.th + ')'); break; }
        });
      }
    }

    // 3 월간 카드 = P 이하 마지막 카드일 i 까지 20카드일(i-19 ~ i) 안 등장한 날 수
    var TR = root.테마국면_DATA;
    if (!TR || !TR.D) st.월간 = '자료 없음';
    else {
      var Pi = +P.replace(/-/g, ''), lo = 0, hi = TR.D.length;
      while (lo < hi) { var mid = (lo + hi) >> 1; if (TR.D[mid] <= Pi) lo = mid + 1; else hi = mid; }
      var ci = lo - 1;
      st.월간 = ci >= 0 ? 'ok' : '시작 전';
      if (ci >= 0) R0.stocks.forEach(function (s0) {
        var rows = TR.종목[s0.code];
        if (!rows) return;
        var seen = {}, n = 0, last = -1, lastT = null, ev = [];
        for (var j = 0; j < rows.length; j++) {
          var ix = rows[j][0];
          if (ix > ci) break;
          if (ix < ci - 19) continue;
          if (!seen[ix]) { seen[ix] = 1; n++; ev.push(dashD(TR.D[ix])); }
          if (ix > last) { last = ix; lastT = rows[j][1]; }
        }
        if (n) add(s0.code, '월간', '월간 ' + n + '일', ev, '최근 20카드일 ' + n + '일 · 마지막 ' + md(TR.D[last]) + ' ' + ((TR.T || [])[lastT] || ''));
      });
    }

    // 4 📈 급등 = W20 안 그날 +20~35% · 배지 = 가장 최근
    var PK = root.PICK25;
    if (!PK) st.급등 = '자료 없음';
    else {
      var pks = keysIn(PK, W20a, P), gm = {};
      st.급등 = pks.length ? 'ok' : 범위('급등', PK, P);
      pks.forEach(function (d) { ((PK[d] || {}).s || []).forEach(function (x) { if (!x || !has(x.c)) return; (gm[x.c] = gm[x.c] || []).push({d: d, r: x.r, t: x.t, b: x.b}); }); });
      Object.keys(gm).forEach(function (code) {
        var L = gm[code], z = L[L.length - 1];
        add(code, '급등', '📈' + md(z.d) + ' +' + rnd(z.r) + '%', L.map(function (x) { return x.d; }),
            '20거래일 ' + L.length + '번 · ' + L.slice(-3).reverse().map(function (x) { return md(x.d) + ' +' + x.r + '% ' + (x.t || '') + '(' + ({1: '20~25', 2: '25~29', 3: '상한권'}[x.b] || '') + ')'; }).join(' · '));
      });
    }

    // 5·6 📉 월간눌림 · 급등눌림 = W20 안 새 단계 도달(가장 최근 · 같은 날이면 더 깊은 단계)
    [['월간눌림', '📉월', '테마 받은 날'], ['급등눌림', '📉급', '급등한 날']].forEach(function (q) {
      var A = root[q[0]];
      if (!A || !A.칸) { st[q[0]] = '안 받음'; return; }
      st[q[0]] = 'ok';
      var mm = {};
      keysIn(A.칸, W20a, P).forEach(function (d) {
        (A.칸[d] || []).forEach(function (r) {
          if (!r || !has(r[0])) return;
          var cur = mm[r[0]];
          if (!cur || d > cur.d || (d === cur.d && r[2] > cur.r[2])) mm[r[0]] = {d: d, r: r};
        });
      });
      Object.keys(mm).forEach(function (code) {
        var x = mm[code], sg = x.r[2];
        add(code, q[0], q[1] + (CIRC[sg] || sg), [x.d],
            q[0] + ' ' + sg + '단계(' + (['', '-15', '-25', '-35', '-45', '-55'][sg] || '') + '%) 도달 ' + md(x.d) + ' · ' + q[2] + ' ' + md(x.r[4]) + ' 대비 ' + x.r[7] + '%');
      });
    });

    // 7 🎯 첫터치5 = D 칸(매수일) · 선 = 20·60·120·240·480
    var F5 = root.첫터치5_ARCHIVE;
    if (!F5) st.첫터치5 = '자료 없음';
    else {
      var f5 = F5[D];
      st.첫터치5 = f5 ? 'ok' : 범위('첫터치5', F5, D);
      if (f5) {
        var fm = {};
        [20, 60, 120, 240, 480].forEach(function (Ln) {
          (f5['G' + Ln] || []).forEach(function (it) {
            if (!it || !has(it.code)) return;
            var a = fm[it.code] = fm[it.code] || {L: [], it: it};
            if (a.L.indexOf(Ln) < 0) a.L.push(Ln);
          });
        });
        Object.keys(fm).forEach(function (code) {
          var a = fm[code];
          add(code, '첫터치5', '🎯' + a.L.join('·') + '선', [D], (f5.신호일 ? md(f5.신호일) + ' 신호 · ' : '') + a.L.join('·') + '일선 첫 닿음' + (a.it.테마 ? ' · 테마 ' + String(a.it.테마).slice(0, 40) : ''));
        });
      }
    }

    // 8 🏹 2060 = D 칸 아침 명단(1~7판 배열 2번째 칸 · 8판 사전 code · 관찰 x 는 뷸)
    var r6 = {}, n6 = 0, d6 = 0;
    for (var k6 = 1; k6 <= 8; k6++) {
      var A6 = root['R2060_' + k6 + '_ARCHIVE'];
      if (!A6) continue;
      n6++;
      var v6 = A6[D];
      if (!v6) continue;
      d6++;
      (v6.p || []).forEach(function (row) {
        var c = Array.isArray(row) ? row[1] : (row && row.code);
        if (!has(c)) return;
        c = String(c);
        var a = r6[c] = r6[c] || [];
        if (a.indexOf(k6) < 0) a.push(k6);
      });
    }
    st['2060'] = !n6 ? '자료 없음' : (d6 ? 'ok' : '그날 없음');
    Object.keys(r6).forEach(function (c) {
      var a = r6[c].sort(function (x, y) { return x - y; });
      add(c, '2060', '🏹' + a.join('·'), [D], a.map(function (k) { return '2060매매법' + k + (k === 1 ? '(불화살강의 v1)' : ''); }).join(' · '));
    });

    // 9 🗣 검사관 = D 아침 토론 · 검사관 수(한 검사관은 1번)
    var INS = root.검사관토론_ARCHIVE;
    if (!INS) st.검사관 = '자료 없음';
    else {
      var iv = INS[D];
      st.검사관 = iv ? 'ok' : 범위('검사관', INS, D);
      if (iv) {
        var im = {};
        (iv.inspectors || []).forEach(function (x) {
          var seen = {};
          (x.picks || []).forEach(function (p) {
            if (!p || !has(p.code) || seen[p.code]) return;
            seen[p.code] = 1;
            (im[p.code] = im[p.code] || []).push({n: String(x.name || '').replace(' 검사관', ''), s: x.status, w: p.why});
          });
        });
        Object.keys(im).forEach(function (c) {
          var L = im[c], nm = (codes[c] && codes[c].name) || '';
          var why = (nm && L.filter(function (x) { return String(x.w || '').indexOf(nm) >= 0; })[0]) || L[0];   // 그 종목 이름이 든 이유를 먼저
          add(c, '검사관', '🗣' + L.length, [D], L.map(function (x) { return x.n + '(' + (x.s || '') + ')'; }).join(' · ') + ' · ' + why.n + ': ' + String(why.w || '').slice(0, 60));
        });
      }
    }

    // 10 📝 추천주5 = D 아침 봉인(지난날 = 재현)
    var T5 = root.채점_추천주5 && root.채점_추천주5.D;
    if (!T5) st.추천주5 = '안 받음';
    else {
      var tv = T5[D];
      st.추천주5 = tv ? 'ok' : 범위('추천주5', T5, D);
      if (tv) (tv.p || []).forEach(function (row) {
        var c = row && row[0] != null ? String(row[0]) : null;
        if (!has(c) || (B[c] && B[c].추천주5)) return;
        add(c, '추천주5', '📝추천5', [D], '추천주5두뇌 ' + md(D) + ' 아침(' + (tv.k === 'S' ? '봉인' : '재현') + ') · ' + ((tv.y || {})[c] || []).join(' · '));
      });
    }

    // 11 📺 유튜브 = W5 첫날 0시 ≤ 올린 시각 < D 아침 9시 · 영상 수
    var YT = root.YT_SUM;
    if (!YT) st.유튜브 = '자료 없음';
    else {
      var t0 = Date.parse(W5a + 'T00:00:00+09:00'), t1 = Date.parse(D + 'T09:00:00+09:00'), ym = {};
      keysIn(YT, W5a, D).forEach(function (d) {
        (YT[d] || []).forEach(function (v) {
          if (!v) return;
          var tu = Date.parse(v.uploaded || (d + 'T00:00:00+09:00'));
          if (!(tu >= t0 && tu < t1)) return;
          var cs = {};
          (v.stocks || []).forEach(function (g) { ((g && g.codes) || []).forEach(function (c) { cs[c] = 1; }); });
          Object.keys(cs).forEach(function (c) { if (has(c)) (ym[c] = ym[c] || []).push(v); });
        });
      });
      st.유튜브 = 범위('유튜브', YT, D) === '시작 전' ? '시작 전' : 'ok';
      Object.keys(ym).forEach(function (c) {
        var L = ym[c];
        add(c, '유튜브', '📺' + L.length, L.map(function (v) { return v.uploaded || v.date; }),
            L.slice(-3).reverse().map(function (v) { return md(v.date || '') + ' ' + (v.channel || '') + ' · ' + String(v.title || '').slice(0, 30); }).join(' / '));
      });
    }

    var out = {};
    R0.stocks.forEach(function (s0) {
      var b = B[s0.code] || {};
      out[s0.code] = ECO_ORDER.filter(function (k) { return b[k]; }).map(function (k) { return b[k]; });
    });
    return {D: D, P: P, w20: [W20a, P], w5: [W5a, P], 상태: st, 배지: out, 덧: extra, base: R0};
  }

  function 빠진기계() {                                                // 자료가 하나도 안 실린 기계
    if (!IDX) buildIdx();
    return KEYS.filter(function (k) { return !Object.keys(IDX[k] || {}).length; });
  }
  function 새기계() {                                                  // 지도에 없는 베스트 기계 자료(새 어사이드를 붙였는데 build 를 안 한 경우)
    var known = {};
    KEYS.forEach(function (k) { ((SRC[k] || {}).a || []).forEach(function (n) { known[n] = 1; }); });
    return Object.keys(root).filter(function (n) { return /^(베스트\d*|어사이드\d+)_(ARCHIVE|PAST)$/.test(n) && !known[n]; });
  }

  root.베스트겹침 = {계산: 계산, 생태계: 생태계, 배지순서: ECO_ORDER, 빠진기계: 빠진기계, 새기계: 새기계, 버전: VERSION, 빌드: BUILT, 기계수: KEYS.length};

  // ── 화면: 상세창 맨 위 블록(#bo-top) ─────────────────────────────────────
  if (typeof document === 'undefined' || typeof root.openBestDetail !== 'function') return;
  var esc = function (v) { return String(v == null ? '' : v).replace(/[&<>"']/g, function (ch) { return {'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[ch]; }); };
  var PH = {'주': ['주도', '#ef4444'], '급': ['뜨는', '#22c55e'], '살': ['살아있음', '#e3e7fb'], '죽': ['죽음', '#6b7096'], '': ['', '#6b6e9c']};
  var css = ''
    + '#bo-top{margin:0 0 18px;padding:0 2px 14px;border-bottom:1px solid #2a2d4a;color:#e4e6ff;font-size:13px}'
    + '#bo-top .bo-title{font-size:19px;font-weight:700;color:#ffd700}'
    + '#bo-top .bo-sub{font-size:12px;color:#8487bd;margin:4px 0 10px;line-height:1.55}'
    + '#bo-top .bo-sub b{color:#ff9aaa;font-weight:600}'
    + '#bo-top .bo-stats{display:flex;flex-wrap:wrap;gap:6px 22px;margin:2px 0 10px}'
    + '#bo-top .bo-stats div{font-size:12px;color:#8487bd}#bo-top .bo-stats b{display:block;font-size:20px;color:#e4e6ff;font-weight:700}'
    + '#bo-top .bo-tabs{display:inline-flex;gap:2px;padding:3px;border-radius:9px;background:rgba(255,255,255,.06);margin-bottom:8px}'
    + '#bo-top .bo-tabs button{border:0;background:transparent;color:#8487bd;font:inherit;font-size:13px;padding:5px 12px;border-radius:7px;cursor:pointer}'
    + '#bo-top .bo-tabs button.on{background:#2a2d4a;color:#fff;font-weight:700}'
    + '#bo-top table{width:100%;border-collapse:collapse}'
    + '#bo-top th{font-size:11px;color:#8487bd;font-weight:500;text-align:left;padding:4px 6px;border-bottom:1px solid #2a2d4a}'
    + '#bo-top td{padding:6px;border-bottom:1px solid #22253d;vertical-align:middle}'
    + '#bo-top td.n,#bo-top th.n{text-align:right;white-space:nowrap}'
    + '#bo-top tr.bo-r{cursor:pointer}#bo-top tr.bo-r:hover td{background:rgba(255,255,255,.04)}'
    + '#bo-top .bo-rk{color:#8487bd;width:22px}'
    + '#bo-top .bo-nm{color:#fff;font-weight:600;cursor:pointer}#bo-top .bo-nm:hover{text-decoration:underline}'
    + '#bo-top .bo-cd{color:#8487bd;font-size:11px;margin-left:5px}'
    + '#bo-top .bo-bar{display:inline-block;height:6px;border-radius:3px;background:#5ab8ff;vertical-align:middle;margin-right:6px}'
    + '#bo-top .bo-bar.f{background:#2f6a92}'
    + '#bo-top .bo-dot{display:inline-block;width:7px;height:7px;border-radius:50%;margin-right:5px;vertical-align:1px}'
    + '#bo-top .bo-ph i{font-style:normal;color:#8487bd}'
    + '#bo-top tr.bo-det td{color:#8487bd;font-size:12px;padding:0 6px 8px}'
    + '#bo-top .bo-more{border:0;background:transparent;color:#c9cbe8;font:inherit;font-size:12px;cursor:pointer;padding:6px 0 0;text-decoration:underline;text-underline-offset:3px}'
    + '#bo-top .bo-fold{color:#8487bd;font-size:12px;margin-top:4px}'
    + '#bo-top .bo-grp{color:#8487bd;font-size:11px;margin:10px 0 0}'
    + '#bo-top .bo-sec{padding:8px 0;border-bottom:1px solid #22253d}'
    + '#bo-top .bo-sh{display:flex;flex-wrap:wrap;align-items:baseline;gap:2px 10px}'
    + '#bo-top .bo-sn{font-size:14px;font-weight:700}#bo-top .bo-sm{color:#8487bd;font-size:12px}'
    + '#bo-top .bo-chips{display:flex;flex-wrap:wrap;gap:4px 6px;margin-top:6px}'
    + '#bo-top .bo-chip{font-size:12px;padding:1px 8px;border-radius:999px;background:rgba(255,255,255,.07);white-space:nowrap;cursor:pointer}'
    + '#bo-top .bo-chip b{margin-left:4px}#bo-top .bo-chip.one{background:transparent;color:#8487bd;padding:1px 3px}'
    + '#bo-top .bo-warn{color:#ffb86b;font-size:12px;margin:6px 0 0}'
    + '#bo-top .bo-eb{display:inline-block;font-size:11.5px;line-height:18px;padding:0 7px;margin:1px 4px 1px 0;border-radius:9px;background:rgba(120,140,255,.13);color:#dfe3ff;white-space:nowrap}'
    + '#bo-top .bo-eb.bad{background:rgba(255,80,80,.24);color:#ffb3b3}#bo-top .bo-eb.warn{background:rgba(255,170,60,.2);color:#ffd09a}'
    + '#bo-top .bo-eb.more{background:transparent;color:#8487bd}#bo-top .bo-none{color:#4f537a}'
    + '#bo-top td.bo-ec{white-space:normal;min-width:160px}'
    + '#bo-top .bo-dl{margin:2px 0;line-height:1.55}#bo-top .bo-dl b{color:#c9cbe8;font-weight:600;margin-right:6px}'
    + '#bo-top .bo-dl.now{color:#6f7399}'
    + '#bo-top .bo-legend{font-size:11.5px;color:#7f83b0;margin:-2px 0 10px;line-height:1.6}'
    + '#bo-top .bo-eb[data-go]{cursor:pointer}#bo-top .bo-eb[data-go]:hover{filter:brightness(1.35);box-shadow:inset 0 0 0 1px rgba(255,215,0,.6)}'
    + '#bo-top .bo-dl b.bo-go{cursor:pointer}#bo-top .bo-dl b.bo-go:hover{color:#ffd700;text-decoration:underline}'
    + '.bo-flash-t{outline:2px solid #ffd700 !important;outline-offset:2px;background-color:rgba(255,215,0,.16) !important;border-radius:6px}'
    + '#bo-back{position:fixed;left:50%;bottom:22px;transform:translateX(-50%);z-index:10050;display:flex;gap:2px;padding:4px;border-radius:12px;background:rgba(20,22,44,.97);border:1px solid rgba(255,215,0,.6);box-shadow:0 6px 24px rgba(0,0,0,.55)}'
    + '#bo-back[hidden]{display:none}'
    + '#bo-back button{border:0;background:transparent;color:#ffd700;font:inherit;font-size:13px;font-weight:700;padding:7px 12px;border-radius:9px;cursor:pointer}'
    + '#bo-back button:hover{background:rgba(255,215,0,.13)}#bo-back button[data-bo-back="x"]{color:#8487bd;font-weight:400;padding:7px 9px}';
  var stEl = document.createElement('style'); stEl.id = 'bo-style'; stEl.textContent = css; document.head.appendChild(stEl);

  function phaseHTML(th, c, rk, role) {
    if (th === null) return '<span class="bo-ph"><i>섹터 없음</i></span>';
    var p = PH[c] || PH[''];
    return '<span class="bo-ph"><span class="bo-dot" style="background:' + p[1] + '"></span>' + esc(th)
      + (p[0] ? ' <i>' + p[0] + (rk ? ' ' + rk + '위' : '') + '</i>' : '') + (role ? ' <i>(역할표)</i>' : '') + '</span>';
  }
  function famText(s) {                                                // 같은 계열은 괄호로 묶어 '닮은 기계 = 1표'가 보이게
    var g = {}, order = [];
    s.machines.forEach(function (m) { var f = own(FAM, m) ? FAM[m] : ('새:' + m); if (!g[f]) { g[f] = []; order.push(f); } g[f].push(m); });
    return order.map(function (f) {
      var ms = g[f], t = ms.map(function (m, i) { return i > 0 && /^어사이드/.test(m) && /^어사이드/.test(ms[0]) ? m.replace('어사이드', '') : m; }).join('·');
      return ms.length > 1 ? '(' + t + ')' : t;
    }).join(' · ');
  }
  // ── 생태계 배지 · 펼친 글(규칙_v2.md 1·3·4장)
  var EB_LAB = {'악재경고': '⚠ 악재경고', '주도3안': '🌅 주도3안', '월간': '🗓 월간 카드', '급등': '📈 급등', '월간눌림': '📉 월간눌림', '급등눌림': '📉 급등눌림',
                '첫터치5': '🎯 첫터치5', '2060': '🏹 2060', '검사관': '🗣 검사관', '추천주5': '📝 추천주5', '유튜브': '📺 유튜브'};
  function tipText(L) { return L && L.length ? L.map(function (b) { return b.t; }).join(' · ') : '생태계 표시 없음'; }
  // 배지를 누르면 옮겨 갈 곳(규칙_v2.md 9장) · 날 = 월간 · 급등 · 유튜브는 근거 날짜 중 가장 늦은 날, 나머지는 근거 날짜 하나(배지가 말하는 그 날)
  var GO_LAB = {'악재경고': '⚠ 악재경고 창', '주도3안': '🌅 주도3안 칸', '월간': '🗓 월간 칸', '급등': '📈 급등 창', '월간눌림': '📉 월간눌림 칸', '급등눌림': '📉 급등눌림 칸',
                '첫터치5': '🎯 첫터치5 칸', '2060': '🏹 2060 칸', '검사관': '🗣 검사관 토론', '추천주5': '📝 채점 칸', '유튜브': '📺 유튜브 칸'};
  function maxEv(b) { var m = ''; ((b && b.ev) || []).forEach(function (x) { x = String(x == null ? '' : x); if (x > m) m = x; }); return m; }
  function goDay(b) {
    var d = (b.k === '월간' || b.k === '급등' || b.k === '유튜브') ? maxEv(b) : String(((b.ev || [])[0]) == null ? '' : b.ev[0]);
    return /^\d{8}$/.test(d) ? dashD(d) : d.slice(0, 10);
  }
  function goTip(b) { var d = goDay(b); return GO_LAB[b.k] && /^\d{4}-\d{2}-\d{2}$/.test(d) ? '누르면 ' + GO_LAB[b.k] + ' ' + md(d) + ' 로 이동' : ''; }
  function badgesHTML(L, code) {
    if (!L || !L.length) return '<span class="bo-none">·</span>';
    var show = L.slice(0, 7), more = L.length - show.length;
    return show.map(function (b) {
      var cls = b.k === '악재경고' ? (b.t.indexOf('악재') >= 0 ? ' bad' : ' warn') : '', tip = goTip(b);
      return '<span class="bo-eb' + cls + '"' + (tip ? ' data-go="' + esc(b.k) + '" data-code="' + esc(code) + '"' : '') + ' title="' + esc((EB_LAB[b.k] || b.k) + ' · ' + (b.d || '') + (tip ? '\n' + tip : '')) + '">' + esc(b.t) + '</span>';
    }).join('') + (more > 0 ? '<span class="bo-eb more" title="' + esc(L.slice(7).map(function (b) { return b.t; }).join(' · ') + ' · 줄을 펼치면 전부(이름표를 누르면 이동)') + '">+' + more + '</span>' : '');
  }
  function nowLines(s) {                                               // 테마맵 · 카드맵 = 날짜 없는 자료 → 펼친 글에만 '지금 기준'
    var out = [], th = s.th, MM = root.MINDMAP_DATA, TC = root.THEMEMAP_CARDS;
    if (MM && th) {
      var nd = (MM.nodes || []).filter(function (n) { return n && n.meta === th; })[0];
      if (nd) out.push('🗺 테마맵(지금 기준) ' + th + ' 강도 ' + nd.강도 + (nd.phase2 ? ' · ' + nd.phase2 : '') + (nd.강중약 ? ' · ' + nd.강중약 : ''));
    }
    if (MM && s.name) (MM.edges2 || []).filter(function (e) { return e && (e.핵심 || []).indexOf(s.name) >= 0; }).slice(0, 2).forEach(function (e) { out.push('🗺 ' + e.a + '↔' + e.b + ' 잇는 핵심주(이름 기준 · 지금 기준)'); });
    if (TC && th) (TC.megas || []).some(function (m) {
      var c = (m.cards || []).filter(function (x) { return x && x.meta === th; })[0];
      if (!c) return false;
      var rk = -1;
      (c.stocks || []).some(function (x, i) { if (x && x.code === s.code) { rk = i; return true; } return false; });
      var tag = [c.conviction, c.강중약].filter(Boolean).join(' · ');
      out.push('🗂 카드맵(지금 기준) ' + m.title + ' › ' + th + (tag ? '(' + tag + ')' : '') + (rk >= 0 ? ' · 카드 안 ' + (rk + 1) + '위(' + c.stocks[rk].n + '회)' : ''));
      return true;
    });
    return out.map(function (t) { return '<div class="bo-dl now">' + esc(t) + '</div>'; }).join('');
  }
  function detHTML(s, E) {
    var L = (E.배지 || {})[s.code] || [], out = [];
    out.push('<div class="bo-dl"><b>🧮 기계</b>고른 기계 ' + s.nm + '개 · 계열 ' + s.nf + '개 = ' + esc(famText(s)) + ' · 괄호 = 닮은 기계(1표)</div>');
    L.forEach(function (b) {
      var tip = goTip(b);
      out.push('<div class="bo-dl"><b' + (tip ? ' class="bo-go" data-go="' + esc(b.k) + '" data-code="' + esc(s.code) + '" title="' + esc(tip) + '"' : '') + '>' + esc(EB_LAB[b.k] || b.k) + (tip ? ' ›' : '') + '</b>' + esc(b.d || b.t) + '</div>');
    });
    ((E.덧 || {})[s.code] || []).forEach(function (t) { out.push('<div class="bo-dl">' + esc(t) + '</div>'); });
    out.push(nowLines(s));
    out.push('<div class="bo-eco" data-code="' + esc(s.code) + '" data-p="' + esc(E.P) + '"><div class="bo-dl now">🕸 생태계 파일(사건 · 뉴스 · 공시)은 줄을 펼치면 받아 옵니다</div></div>');
    return out.join('');
  }
  function ecoHTML(E0, P) {                                            // 날짜 있는 것 = P 까지만 · 날짜 없는 것 = '지금 기준'
    var out = [], desc = function (a, b) { return a < b ? 1 : (a > b ? -1 : 0); };
    var sag = (E0.사건 || []).filter(function (x) { return x && String(x[0]) <= P; }).sort(function (a, b) { return desc(String(a[0]), String(b[0])); }).slice(0, 3);
    if (sag.length) out.push('🕸 사건(전날까지) ' + sag.map(function (x) { return md(x[0]) + ' ' + (x[1] || '') + ' ' + (x[3] || '') + ' ' + String(x[4] || '').replace(/^"|"$/g, '').slice(0, 40); }).join(' / '));
    var nw = (E0.뉴스 || []).filter(function (x) { return x && String(x.d) <= P; }).sort(function (a, b) { return desc(String(a.d), String(b.d)); }).slice(0, 2);
    if (nw.length) out.push('🕸 뉴스(전날까지) ' + nw.map(function (x) { return md(x.d) + ' ' + String(x.t || '').slice(0, 40); }).join(' / '));
    var gs = (E0.공시 || []).filter(function (x) { return x && String(x.d) <= P; }).sort(function (a, b) { return desc(String(a.d), String(b.d)); }).slice(0, 2);
    if (gs.length) out.push('🕸 공시(전날까지) ' + gs.map(function (x) { return md(x.d) + ' ' + String(x.t || '').slice(0, 40); }).join(' / '));
    var jr = (E0.자리 || []).slice(0, 2);
    if (jr.length) out.push('🕸 자리(지금 기준) ' + jr.map(function (x) { return [x.테마, x.메가, x.분야].filter(Boolean).join(' › '); }).join(' / '));
    var w = E0.기업 && E0.기업.WICS;
    if (w) out.push('🕸 업종(지금 기준) ' + (typeof w === 'string' ? w : JSON.stringify(w)).slice(0, 60));
    if (!out.length) out.push('🕸 생태계 파일: 전날까지 기록 없음');
    return out.map(function (t) { return '<div class="bo-dl now">' + esc(t) + '</div>'; }).join('');
  }
  var ECO_PEND = {};
  function fillEco(el) {                                               // 줄을 펼칠 때 그 종목 생태계 파일 1개만 받는다(한 번 받으면 다시 안 받음)
    if (!el || el.getAttribute('data-done')) return;
    var code = el.getAttribute('data-code'), P = el.getAttribute('data-p'), E0 = root['__E_' + code];
    if (E0) { el.innerHTML = ecoHTML(E0, P); el.setAttribute('data-done', '1'); return; }
    el.innerHTML = '<div class="bo-dl now">🕸 생태계 파일 받는 중…</div>';
    if (ECO_PEND[code]) { ECO_PEND[code].push(el); return; }
    ECO_PEND[code] = [el];
    var sc = document.createElement('script');
    sc.src = 'dashboard/data/생태계/' + code + '.js';
    sc.onload = function () { var L = ECO_PEND[code] || []; delete ECO_PEND[code]; L.forEach(function (x) { if (document.body.contains(x)) fillEco(x); }); };
    sc.onerror = function () { var L = ECO_PEND[code] || []; delete ECO_PEND[code]; L.forEach(function (x) { x.innerHTML = '<div class="bo-dl now">🕸 생태계 파일 없음</div>'; x.setAttribute('data-done', '1'); }); };
    document.head.appendChild(sc);
  }
  var T5_LOADING = false;
  function needLazy(E, k) {                                            // 나중에 받는 자료(월간눌림 · 급등눌림 · 추천주5) → 다 받으면 같은 칸이면 다시 그린다
    var st = E.상태 || {}, pend = 0;
    var redraw = function () { var cur = document.getElementById('bo-top'); if (cur && cur.getAttribute('data-k') === k) { try { decorate(k, true); } catch (e) { console.warn('베스트 겹침: 다시 그리기 실패', e); } } };
    if (typeof root._mnlLoad === 'function') {
      if (st.월간눌림 === '안 받음') { pend++; root._mnlLoad(redraw, true, '월간'); }
      if (st.급등눌림 === '안 받음') { pend++; root._mnlLoad(redraw, true, '급등'); }
    }
    if (st.추천주5 === '안 받음' && !T5_LOADING) {
      T5_LOADING = true; pend++;
      var sc = document.createElement('script');
      sc.src = 'dashboard/data/채점_추천주5.js?v=' + Date.now();
      sc.onload = redraw;
      sc.onerror = function () { T5_LOADING = false; };
      document.head.appendChild(sc);
    }
    return pend;
  }
  function rowHTML(s, i, E) {
    var mw = Math.max(4, Math.round(s.nm / 8 * 28)), fw = Math.max(4, Math.round(s.nf / 6 * 28));
    return '<tr class="bo-r" data-code="' + esc(s.code) + '"><td class="bo-rk">' + (i + 1) + '</td><td><span class="bo-nm" data-code="' + esc(s.code) + '" data-name="' + esc(s.name) + '">' + esc(s.name || s.code) + '</span><span class="bo-cd">' + esc(s.code) + '</span></td>'
      + '<td class="n"><span class="bo-bar f" style="width:' + fw + 'px"></span>' + s.nf + '</td><td class="n"><span class="bo-bar" style="width:' + mw + 'px"></span>' + s.nm + '</td>'
      + '<td>' + phaseHTML(s.th, s.c, s.rk, s.role) + '</td><td class="bo-ec">' + badgesHTML((E.배지 || {})[s.code], s.code) + '</td></tr>'
      + '<tr class="bo-det" hidden><td></td><td colspan="5">' + detHTML(s, E) + '</td></tr>';
  }
  function secHTML(g, E) {
    var multi = g.stocks.filter(function (s) { return s.nm >= 2; }), one = g.stocks.filter(function (s) { return s.nm < 2; }), show = one.slice(0, 8);
    var chip = function (s, cls) { return '<span class="bo-chip' + cls + ' bo-nm" data-code="' + esc(s.code) + '" data-name="' + esc(s.name) + '" title="' + esc(tipText((E.배지 || {})[s.code])) + '">' + esc(s.name || s.code) + (cls ? '' : '<b>' + s.nm + '</b>') + '</span>'; };
    return '<div class="bo-sec"><div class="bo-sh"><span class="bo-sn">' + phaseHTML(g.th, g.c, g.rk, false) + '</span><span class="bo-sm">' + g.n + '종목 · 기계 표 ' + g.votes + '</span></div>'
      + '<div class="bo-chips">' + multi.map(function (s) { return chip(s, ''); }).join('') + show.map(function (s) { return chip(s, ' one'); }).join('')
      + (one.length > show.length ? '<span class="bo-chip one">외 ' + (one.length - show.length) + '</span>' : '') + '</div></div>';
  }
  function blockHTML(E, k, pend) {
    var R = E.base;
    var top3 = R.stocks.filter(function (s) { return s.nm >= 3; }), two = R.stocks.filter(function (s) { return s.nm === 2; }), one = R.stocks.length - top3.length - two.length;
    var strong = R.sectors.filter(function (g) { return g.c === '주' || g.c === '급'; }), rest = R.sectors.filter(function (g) { return !(g.c === '주' || g.c === '급'); });
    var restLabel = [['살', '살아있음'], ['죽', '죽음'], ['', '국면 없음'], ['x', '섹터 없음']].map(function (p) {
      var n = rest.filter(function (g) { return (g.th === null ? 'x' : g.c) === p[0]; }).length;
      return n ? p[1] + ' ' + n : '';
    }).filter(Boolean).join(' · ') + ' 묶음 더 보기';
    var miss = 빠진기계(), fresh = 새기계();
    var o = '<div class="bo-title">🧮 ' + esc(k) + ' 칸 · 기계 겹침 · 강한 섹터</div>'
      + '<div class="bo-sub">기계가 실제로 고른 종목만 셈(관찰 줄 제외 · 천억 장부와 같은 기준) · 섹터 = 칸 전날까지 카드 국면 · 줄을 누르면 고른 기계, 이름을 누르면 종목 창<br>'
      + '<b>관찰용 · 매수추천 아님 · 겹침이 많다고 더 오른다는 증거는 아직 없음(베스트52 공통선택 시험) · 검증 통과한 매매법 없음(2026-10 기준 · 판 M 전진 시험 중)</b></div>'
      + '<div class="bo-stats"><div>명단 낸 기계<b>' + R.machines.length + ' / ' + R.n_keys + '</b></div><div>서로 다른 종목<b>' + R.stocks.length + '</b></div>'
      + '<div>2개 이상 기계가 고름<b>' + R.ge2 + '</b></div><div>최다 겹침<b>' + R.maxm + '기계</b></div></div>';
    if (miss.length || fresh.length) o += '<div class="bo-warn">⚠ ' + (miss.length ? '자료가 안 실린 기계 ' + miss.length + '개(' + esc(miss.join(' · ')) + ') ' : '') + (fresh.length ? '지도에 없는 새 기계 자료 ' + fresh.length + '개 = 베스트겹침.py build 다시' : '') + '</div>';
    var stLine = Object.keys(E.상태 || {}).filter(function (x) { return E.상태[x] !== 'ok' && E.상태[x] !== '안 받음'; }).map(function (x) { return (EB_LAB[x] || x) + '(' + E.상태[x] + ')'; }).join(' · ');
    o += '<div class="bo-legend">오른쪽 \'생태계 위치 · 관점\' = 다른 버튼에서 본 이 종목(칸 날 아침 9시 전 자료만 · 테마맵·카드맵·생태계 파일은 줄을 펼치면) · '
      + '⚠ 악재경고 · 🌅 주도3안 · 월간 = 카드 등장일(20카드일) · 📈 급등(20거래일) · 📉월/급 = 월간·급등눌림 단계 · 🎯 첫터치 · 🏹 2060 판 · 🗣 검사관 수 · 📝 추천주5 · 📺 유튜브(5거래일)'
      + (stLine ? '<br>이 칸에서 자료 없는 버튼: ' + esc(stLine) : '')
      + '<br>배지(또는 펼친 줄의 이름표 ›)를 누르면 그 버튼의 그 날 칸으로 옮겨 가 이 종목을 반짝 표시 · 옮겨 간 화면에는 그 뒤 결과도 보일 수 있음(배지는 9시 전 자료만) · 화면 아래 ↩ 단추로 이 칸에 돌아옴'
      + (pend ? '<br>📉 월간눌림 · 급등눌림 등 처음 한 번 받는 자료를 받는 중 · 다 받으면 저절로 다시 그림' : '') + '</div>';
    if (!R.stocks.length) return o + '<div class="bo-fold">이 칸에는 기계가 고른 종목이 없습니다(종가에 정하는 기계는 그날 장이 끝나야 명단이 생김).</div>';
    o += '<div class="bo-tabs"><button type="button" class="on" data-bo-tab="o">겹침 순</button><button type="button" data-bo-tab="s">강한 섹터 순</button></div>'
      + '<div data-bo-pane="o"><table><thead><tr><th></th><th>종목</th><th class="n">계열</th><th class="n">기계</th><th>섹터</th><th>생태계 위치 · 관점</th></tr></thead>'
      + '<tbody>' + top3.map(function (s, i) { return rowHTML(s, i, E); }).join('') + '</tbody><tbody data-bo-two hidden>' + two.map(function (s, i) { return rowHTML(s, top3.length + i, E); }).join('') + '</tbody></table>'
      + (two.length ? '<button type="button" class="bo-more" data-bo-more="two" data-on="2개 기계가 고른 ' + two.length + '종목 더 보기">2개 기계가 고른 ' + two.length + '종목 더 보기</button>' : '')
      + '<div class="bo-fold">1개 기계만 고른 ' + one + '종목은 접어 둠(강한 섹터 순 탭에 흐린 글씨로 있음) · 순서 = 계열 수 → 기계 수 → 섹터 국면</div></div>'
      + '<div data-bo-pane="s" hidden><div class="bo-grp">주도 · 뜨는 섹터(칸 전날까지 카드 기준 순위)</div>' + (strong.length ? strong.map(function (g) { return secHTML(g, E); }).join('') : '<div class="bo-fold">주도·뜨는 섹터에 든 종목 없음</div>')
      + (rest.length ? '<button type="button" class="bo-more" data-bo-more="rest" data-on="' + esc(restLabel) + '">' + esc(restLabel) + '</button><div data-bo-rest hidden>' + rest.map(function (g) { return secHTML(g, E); }).join('') + '</div>' : '')
      + '<div class="bo-fold">섹터 순서 = 주도 1~10위 → 뜨는 → 살아있음 → 죽음 → 섹터 없음 · 칩 숫자 = 그 종목을 고른 기계 수</div></div>';
    return o;
  }
  // ── Step 5(규칙_v2.md 9장) = 배지 → 그 버튼의 그 날 칸으로 옮겨 가고 이 종목을 반짝 · 화면 아래 ↩ 단추로 떠난 칸에 돌아옴
  //    옮겨 가기는 캘린더에 이미 있는 함수만 부른다(새 화면 없음 · 배지 계산 그대로) · 옮겨 간 화면에는 그 뒤 결과가 보일 수 있다
  var MNL_G = function (s) { return s >= 5 ? 3 : (s >= 3 ? 2 : (s >= 1 ? 1 : 0)); };   // 캘린더 _mnlG 와 같음(①② 눌림 · ③④ 깊은 눌림 · ⑤ 폭락)
  var GO_FN = {'악재경고': '_악재경고Modal', '주도3안': 'js3Pick', '월간': '_월간눌림_월간', '급등': '_급등눌림_급등', '월간눌림': '_월간눌림_열기', '급등눌림': '_월간눌림_열기',
               '첫터치5': '_첫터치5_열기', '2060': 'openR2060Detail', '검사관': 'inspShow', '추천주5': 'gradePick', '유튜브': 'ytPick'};
  function closeAll() {                                                // 열려 있는 창을 다 닫는다(상세창 · 주도3안 · 유튜브 · 채점 · 버블)
    try { if (typeof root.closeStockDetail === 'function') root.closeStockDetail(); } catch (e) {}
    ['js3-modal', 'yt-modal', 'grade-modal'].forEach(function (id) { var el = document.getElementById(id); if (el) el.style.display = 'none'; });
    try { if (typeof root.closeBubbleModal === 'function') root.closeBubbleModal(); } catch (e) {}
  }
  function ytFind(ts, code) {                                          // 📺 = 가장 늦게 올린 영상(이 종목 언급) → {day: YT_SUM 칸, id}
    var Y = root.YT_SUM || {}, keys = [String(ts).slice(0, 10)].concat(Object.keys(Y));
    for (var i = 0; i < keys.length; i++) {
      var L = (Y[keys[i]] || []).filter(function (v) { return v && (v.uploaded || v.date) === ts; });
      if (!L.length) continue;
      var v = L.filter(function (x) { return (x.stocks || []).some(function (s) { return (s.codes || []).indexOf(code) >= 0; }); })[0] || L[0];
      return {day: keys[i], id: v.id};
    }
    return null;
  }
  function openCard(d, name) {                                         // 🗓 그 날 옆판에서 이 종목이 든 카드(섹터)를 펼친다 = 옆판 섹터 칩 클릭과 같음
    var EA = null;
    try { EA = ENTRIES_ALL; } catch (e) { EA = root.ENTRIES_ALL || null; }
    var e0 = (EA || []).filter(function (x) { return x && x.date === d; })[0];
    if (!e0 || !e0.themeData || !name) return;
    var EX = (root.테마국면_DATA || {}).EXCL || ['개별이슈', '일부', '특징주'];
    var ks = Object.keys(e0.themeData).filter(function (t) { var c = e0.themeData[t] || {}; return String(c.stocks || '').indexOf(name) >= 0 || JSON.stringify(c.stocksData || '').indexOf(name) >= 0; });
    ks.sort(function (a, b) { return (EX.indexOf(a) >= 0 ? 1 : 0) - (EX.indexOf(b) >= 0 ? 1 : 0); });   // 센 카드 먼저(개별이슈 · 일부 · 특징주는 뒤)
    var sp = document.getElementById('side-panel');
    if (!sp || !ks.length) return;
    var chip = Array.prototype.filter.call(sp.querySelectorAll('span.sp-theme-sel'), function (el) { return (el.getAttribute('onclick') || '').indexOf("'" + ks[0] + "'") >= 0; })[0];
    if (!chip) return;
    try { root._selTheme = null; } catch (e) {}                       // toggleThemeDetail 은 마지막에 연 카드(_selTheme)와 같으면 닫는다 → 늘 열리게 비운다
    chip.click();
  }
  function shown(el) { return !!(el && el.getClientRects && el.getClientRects().length); }
  function pickIn(box, code, name) {                                   // 그 화면에서 이 종목 줄 = data-code → data-name → 이름이 든 글자(보이는 것만)
    var qs = function (v) { return root.CSS && root.CSS.escape ? root.CSS.escape(v) : String(v).replace(/["\\]/g, '\\$&'); };
    var q = function (sel) { try { return Array.prototype.filter.call(box.querySelectorAll(sel), shown)[0] || null; } catch (e) { return null; } };
    var el = (code && q('[data-code="' + qs(code) + '"]')) || (name && q('[data-name="' + qs(name) + '"]')) || null;
    if (el || !name) return el;
    var w = document.createTreeWalker(box, 4, null), n;                // 4 = NodeFilter.SHOW_TEXT
    while ((n = w.nextNode())) if (n.nodeValue && n.nodeValue.indexOf(name) >= 0 && shown(n.parentElement)) return n.parentElement;
    return null;
  }
  function flash(code, name, hint) {                                   // 옮겨 간 화면에서 이 종목을 찾아 가운데로 + 3초 반짝(늦게 받는 자료 = 최대 8초 기다림)
    var t0 = Date.now();
    (function tick() {
      var boxes = ['stock-modal-overlay', 'js3-modal', 'yt-modal', 'grade-modal'].map(function (id) { return document.getElementById(id); })
        .filter(function (el) { return el && getComputedStyle(el).display !== 'none'; });
      if (!boxes.length && hint) [].concat(hint).forEach(function (id) { var h = document.getElementById(id); if (h) boxes.push(h); });   // 창이 없는 화면 = 앞 칸부터(월간 = 펼친 카드 먼저)
      for (var i = 0; i < boxes.length; i++) {
        var el = pickIn(boxes[i], code, name);
        if (el) {
          try { el.scrollIntoView({block: 'center', behavior: 'smooth'}); } catch (e) {}
          el.classList.add('bo-flash-t');
          setTimeout(function () { el.classList.remove('bo-flash-t'); }, 3000);
          return;
        }
      }
      if (Date.now() - t0 < 8000) setTimeout(tick, 250);
    })();
  }
  function goTo(b, code, name) {                                       // → true = 옮겨 감
    var d = goDay(b), k = b.k, R = root, hint = null;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(d) || typeof R[GO_FN[k]] !== 'function') return false;
    closeAll();
    if (k === '악재경고') R._악재경고Modal(d);
    else if (k === '주도3안') { if (typeof R.js3Go === 'function') R.js3Go(); R.js3Pick(d); }
    else if (k === '월간') { R._월간눌림_월간(d); openCard(d, name); hint = ['theme-detail-box', 'side-panel']; }
    else if (k === '급등') R._급등눌림_급등(d);
    else if (k === '월간눌림' || k === '급등눌림') {
      var K = k === '월간눌림' ? '월간' : '급등';
      var run = function () {
        R._월간눌림_열기(d, K);
        var A = R[k], r = (((A || {}).칸 || {})[d] || []).filter(function (x) { return x && x[0] === code; })[0];
        if (!(r && MNL_G(r[2]) !== MNL_G(r[3] || 0)) && typeof R.openMnlStay === 'function') R.openMnlStay(d);   // 같은 묶음 안에서 단계만 오른 날 = 🆕 탭에 없음 → 📌 머무는 전부
      };
      if (typeof R._mnlLoad === 'function') R._mnlLoad(run, true, K); else run();
    }
    else if (k === '첫터치5') R._첫터치5_열기(d);
    else if (k === '2060') {
      try { r2060Y = +d.slice(0, 4); r2060M = +d.slice(5, 7); _r2060First = false; } catch (e) {}   // 2060 달력도 그 달로
      if (typeof R.setView === 'function') R.setView('r2060');
      R.openR2060Detail(d);
    }
    else if (k === '검사관') { if (typeof R.setView === 'function') R.setView('insp'); R.inspShow(d); hint = 'insp-detail'; }
    else if (k === '추천주5') { if (typeof R.setView === 'function') R.setView('grade'); R.gradePick(d); }
    else if (k === '유튜브') { var y = ytFind(maxEv(b), code); if (typeof R.setView === 'function') R.setView('yt'); R.ytPick(y ? y.day : d, y ? y.id : undefined); }
    flash(code, name, hint);
    return true;
  }
  var BACK_CUR = null, BACK_TO = null;                                // ↩ 단추가 돌아갈 칸 · 돌아가는 중인 칸(decorate 가 상태를 되살린다)
  function hideBack() { BACK_CUR = null; var el = document.getElementById('bo-back'); if (el) el.hidden = true; }
  function showBack(r) {
    BACK_CUR = r;
    var el = document.getElementById('bo-back');
    if (!el) {
      el = document.createElement('div'); el.id = 'bo-back';
      el.addEventListener('click', function (e) {
        var b = e.target && e.target.closest ? e.target.closest('[data-bo-back]') : null;
        if (!b) return;
        var r0 = BACK_CUR;
        hideBack();
        if (b.getAttribute('data-bo-back') !== 'go' || !r0) return;
        closeAll();
        try { bestY = +r0.k.slice(0, 4); bestM = +r0.k.slice(5, 7); _bestFirst = false; } catch (er) {}   // 베스트 달력도 그 달로
        if (typeof root.setView === 'function') root.setView('best');
        BACK_TO = r0;
        root.openBestDetail(r0.k);
      });
      document.body.appendChild(el);
    }
    el.innerHTML = '<button type="button" data-bo-back="go" title="베스트 ' + esc(r.k) + ' 칸 겹침 표로 돌아가기(열어 둔 탭 · 펼친 줄 그대로 · 이 종목 줄 반짝)">↩ 베스트 ' + esc(md(r.k)) + ' 칸 · ' + esc(r.name) + '</button>'
      + '<button type="button" data-bo-back="x" title="이 단추만 닫기">✕</button>';
    el.hidden = false;
  }
  function grabState(box) {                                            // 다시 그릴 때 열어 둔 탭 · 펼친 줄 · 더 보기를 그대로
    var on = box.querySelector('[data-bo-tab].on'), open = [];
    box.querySelectorAll('tr.bo-r').forEach(function (tr) { if (tr.nextElementSibling && !tr.nextElementSibling.hidden) open.push(tr.getAttribute('data-code')); });
    var two = box.querySelector('[data-bo-two]'), rest = box.querySelector('[data-bo-rest]');
    return {tab: on ? on.getAttribute('data-bo-tab') : 'o', open: open, two: !!(two && !two.hidden), rest: !!(rest && !rest.hidden)};
  }
  function putState(box, st) {
    var tab = box.querySelector('[data-bo-tab="' + st.tab + '"]');
    if (tab) { box.querySelectorAll('[data-bo-tab]').forEach(function (b) { b.classList.toggle('on', b === tab); }); box.querySelectorAll('[data-bo-pane]').forEach(function (p) { p.hidden = p.getAttribute('data-bo-pane') !== st.tab; }); }
    [['two', '[data-bo-two]'], ['rest', '[data-bo-rest]']].forEach(function (q) {
      var el = box.querySelector(q[1]), btn = box.querySelector('[data-bo-more="' + q[0] + '"]');
      if (el && st[q[0]]) { el.hidden = false; if (btn) btn.textContent = '접기'; }
    });
    st.open.forEach(function (code) {
      var tr = box.querySelector('tr.bo-r[data-code="' + code + '"]');
      if (tr && tr.nextElementSibling) { tr.nextElementSibling.hidden = false; fillEco(tr.nextElementSibling.querySelector('.bo-eco')); }
    });
  }
  function decorate(k, keep) {
    var body = document.getElementById('stock-modal-body'); if (!body) return;
    var prev = document.getElementById('bo-top'), state = null, focus = null;
    if (prev) { if (keep) state = grabState(prev); prev.remove(); }
    if (!keep) {                                                       // ↩ 로 돌아온 칸 = 떠날 때 상태 그대로 + 그 종목 줄 반짝 · 손으로 연 칸 = ↩ 단추 치움
      if (BACK_TO && BACK_TO.k === k) { state = BACK_TO.state; focus = BACK_TO.code; }
      BACK_TO = null;
      hideBack();
    }
    var t0 = Date.now(), E = 생태계(k); if (!E) return;
    var pend = needLazy(E, k);
    var box = document.createElement('div'); box.id = 'bo-top'; box.setAttribute('data-k', k); box._E = E;
    box.innerHTML = blockHTML(E, k, pend);
    box.setAttribute('data-ms', String(Date.now() - t0));
    box.addEventListener('click', onBoClick);                        // 상세창 상자가 클릭을 위로 안 올려보내므로(stock-modal-box 의 stopPropagation) 블록에 직접 붙인다
    body.insertBefore(box, body.firstChild);
    if (state) putState(box, state);
    else { var mb = document.getElementById('stock-modal-box'); if (mb) mb.scrollTop = 0; }
    var ftr = focus ? box.querySelector('tr.bo-r[data-code="' + focus + '"]') : null;
    if (ftr) {
      ftr.classList.add('bo-flash-t');
      setTimeout(function () { ftr.classList.remove('bo-flash-t'); }, 3000);
      try { ftr.scrollIntoView({block: 'center'}); } catch (e) {}
    }
  }
  function onBoClick(e) {
    var t = e.target && e.target.closest ? e.target : null; if (!t) return;
    var top = e.currentTarget;
    var go = t.closest('[data-go]');
    if (go) {                                                          // 배지 · 펼친 줄 이름표 → 그 버튼의 그 날 칸(줄 펼치기는 안 함)
      e.stopPropagation();
      var gc = go.getAttribute('data-code'), gk = go.getAttribute('data-go'), GE = top._E || {};
      var gb = ((GE.배지 || {})[gc] || []).filter(function (x) { return x.k === gk; })[0];
      var gs = (((GE.base || {}).stocks) || []).filter(function (x) { return x.code === gc; })[0] || {};
      if (!gb) return;
      var ret = {k: top.getAttribute('data-k'), code: gc, name: gs.name || gc, state: grabState(top)};
      if (goTo(gb, gc, gs.name || '')) showBack(ret);
      return;
    }
    var tab = t.closest('[data-bo-tab]');
    if (tab) {
      top.querySelectorAll('[data-bo-tab]').forEach(function (b) { b.classList.toggle('on', b === tab); });
      top.querySelectorAll('[data-bo-pane]').forEach(function (p) { p.hidden = p.getAttribute('data-bo-pane') !== tab.getAttribute('data-bo-tab'); });
      return;
    }
    var more = t.closest('[data-bo-more]');
    if (more) {
      var w = more.getAttribute('data-bo-more'), el = top.querySelector(w === 'two' ? '[data-bo-two]' : '[data-bo-rest]');
      if (el) { el.hidden = !el.hidden; more.textContent = el.hidden ? more.getAttribute('data-on') : '접기'; }
      return;
    }
    var nm = t.closest('.bo-nm');
    if (nm) {
      e.stopPropagation();
      if (typeof root.showStockFromData === 'function') root.showStockFromData({entry: {krStockCode: nm.getAttribute('data-code'), displayName: nm.getAttribute('data-name') || nm.getAttribute('data-code')}});
      return;
    }
    var tr = t.closest('tr.bo-r');
    if (tr && tr.nextElementSibling) {
      var det = tr.nextElementSibling;
      det.hidden = !det.hidden;
      if (!det.hidden) fillEco(det.querySelector('.bo-eco'));
    }
  }
  var oldDetail = root.openBestDetail;
  root.openBestDetail = function (k) {
    var r = oldDetail.apply(this, arguments);
    try { decorate(k); } catch (e) { console.warn('베스트 겹침: 상세창 블록 실패', e); }
    return r;
  };
})(typeof window !== 'undefined' ? window : this);
