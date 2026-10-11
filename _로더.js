/* 📱 천억 캘린더 폰 전체판 로더 (규칙_v1.md §2-3) · 원본 = 주도주\_모바일전체\_로더.js (셸 변환기가 복사)
   하는 일 = ① 조각 전역 자리표(빈 객체) ② window.__조각(전역, 달|_전체, 값) 으로 합치기 + 과거(PAST) → 짝(ARCHIVE) '없는 키만'
            ③ 필요한 달 조각을 <script> 로 받기(동시 12개) ④ 늦게 받은 달이 섞여도 원래 키 순서로 다시 맞추기
   PC 캘린더 코드는 한 줄도 바꾸지 않는다. ★매수신호 아님 · 관찰용. */
(function () {
  'use strict';
  var 줄 = [], 동시 = 0, 최대 = 12;
  var L = window.__조각로더 = {
    받음: Object.create(null),    // "전역|달" → true
    받는중: Object.create(null),  // "전역|달" → Promise
    키: Object.create(null),      // "전역|달" → 그 조각의 키 목록(원래 순서)
    더러움: Object.create(null),  // 순서를 다시 맞출 전역
    바쁨: 0, 재그림: 0, 오류: [], 색인: null, 첫화면: false, 받은수: 0,
    순번: Object.create(null), seq: 0   // "전역|달" → 받은 순번(화면을 그린 뒤 새로 들어온 조각인지 판단용 · 다른 길로 받아도 다시 그림)
  };
  window.__조각 = function (name, key, val) {
    if (key === '_전체') { window[name] = val; L.받음[name + '|_전체'] = true; L.순번[name + '|_전체'] = ++L.seq; return; }
    var t = window[name];
    if (!t || typeof t !== 'object') { t = {}; window[name] = t; }
    var ks = Object.keys(val);
    for (var i = 0; i < ks.length; i++) t[ks[i]] = val[ks[i]];
    L.키[name + '|' + key] = ks; L.받음[name + '|' + key] = true; L.더러움[name] = true; L.받은수++; L.순번[name + '|' + key] = ++L.seq;
    var gi = L.색인 && L.색인.g[name];
    if (gi && gi.p) {                       // PAST → 짝 ARCHIVE (PC 파일 꼬리 '없는 키만 넣기'와 같은 규칙)
      var A = window[gi.p];
      if (!A || typeof A !== 'object') { A = {}; window[gi.p] = A; }
      for (var j = 0; j < ks.length; j++) if (!(ks[j] in A)) A[ks[j]] = val[ks[j]];
      L.더러움[gi.p] = true;
    }
  };
  L.시작 = function (ix) {                    // 조각/_색인.js 가 부른다
    L.색인 = ix; ix.짝역 = {};
    ix.늦게 = ix.늦게 || {};                  // 처음 묶음에서 뺀 _전체 전역 = {전역: 해시} (그 기능을 쓸 때 받음)
    for (var g in ix.g) {
      var gi = ix.g[g]; gi.s = Object.create(null); gi.hm = Object.create(null);
      for (var i = 0; i < gi.m.length; i++) { gi.s[gi.m[i]] = true; if (gi.h) gi.hm[gi.m[i]] = gi.h[i]; }
      if (gi.p) ix.짝역[gi.p] = g;
      if (!window[g] || typeof window[g] !== 'object') window[g] = {};   // 자리표 = undefined 아닌 빈 객체(PC 코드의 typeof 검사 통과)
    }
  };
  function 달(k) { return k.indexOf('-') > 0 ? k.slice(0, 7) : k.slice(0, 4) + '-' + k.slice(4, 6); }
  function 순서목록(g, seen, order) {
    var gi = L.색인.g[g]; if (!gi) return;
    if (gi.k) {                               // 달이 섞인 전역 = 키 순서를 통째로 저장해 둠
      for (var i = 0; i < gi.k.length; i++) { var k = gi.k[i]; if (L.받음[g + '|' + 달(k)] && !seen[k]) { seen[k] = 1; order.push(k); } }
      return;
    }
    for (var a = 0; a < gi.m.length; a++) {
      var ks = L.키[g + '|' + gi.m[a]]; if (!ks) continue;
      for (var b = 0; b < ks.length; b++) if (!seen[ks[b]]) { seen[ks[b]] = 1; order.push(ks[b]); }
    }
  }
  function 순서맞춤(g) {
    var obj = window[g]; if (!obj || typeof obj !== 'object') return;
    var cur = Object.keys(obj); if (!cur.length || /^\d{8}$/.test(cur[0])) return;   // YYYYMMDD 키는 엔진이 숫자순으로 정렬 = 손댈 필요 없음
    var seen = Object.create(null), order = [];
    순서목록(g, seen, order);
    var past = L.색인.짝역[g]; if (past) 순서목록(past, seen, order);              // ARCHIVE 뒤에 PAST(원본 꼬리 합치기 순서)
    for (var c = 0; c < cur.length; c++) if (!seen[cur[c]]) { seen[cur[c]] = 1; order.push(cur[c]); }
    var same = order.length === cur.length;
    for (c = 0; same && c < cur.length; c++) if (cur[c] !== order[c]) same = false;
    if (same) return;
    var vals = {};
    for (c = 0; c < cur.length; c++) vals[cur[c]] = obj[cur[c]];
    for (c = 0; c < cur.length; c++) delete obj[cur[c]];
    for (c = 0; c < order.length; c++) obj[order[c]] = vals[order[c]];
  }
  L.정렬 = function () {
    var gs = Object.keys(L.더러움); L.더러움 = Object.create(null);
    for (var i = 0; i < gs.length; i++) { try { 순서맞춤(gs[i]); } catch (e) { L.오류.push('순서 ' + gs[i] + ': ' + e.message); } }
  };
  L.주소 = function (g, m) {        // ?v= 조각 내용 해시 = 바뀐 조각만 새 주소(서비스워커가 나머지는 기억에서)
    var gi = L.색인.g[g], v = m === '_전체' ? L.색인.늦게[g] : (gi && gi.hm[m]);
    return '조각/' + encodeURIComponent(g) + '/' + m + '.js' + (v ? '?v=' + v : (L.색인.v ? '?v=' + L.색인.v : ''));
  };
  function 다음() { while (동시 < 최대 && 줄.length) 줄.shift()(); }
  function 넣기(g, m, id) {
    return new Promise(function (ok) {
      줄.push(function () {
        L.바쁨++; 동시++;
        var s = document.createElement('script');
        s.src = L.주소(g, m);
        s.onload = 끝; s.onerror = function () { L.오류.push('조각 못 받음 ' + id); 끝(); };
        function 끝() { L.바쁨--; 동시--; delete L.받는중[id]; if (s.parentNode) s.parentNode.removeChild(s); ok(); 다음(); }
        document.head.appendChild(s);
      });
      다음();
    });
  }
  L.불러 = function (pairs) {                 // [[전역, 'YYYY-MM'], …] → Promise(받은 개수)
    var ps = [];
    for (var i = 0; i < pairs.length; i++) {
      var g = pairs[i][0], m = pairs[i][1], id = g + '|' + m, gi = L.색인 && L.색인.g[g];
      var ok = m === '_전체' ? !!(L.색인 && L.색인.늦게[g]) : !!(gi && gi.s[m]);
      if (L.받음[id] || !ok) continue;   // 이미 있음 · 없는 달은 안 받음(404 없음)
      if (!L.받는중[id]) L.받는중[id] = 넣기(g, m, id);
      ps.push(L.받는중[id]);
    }
    if (!ps.length) return Promise.resolve(0);
    return Promise.all(ps).then(function () { L.정렬(); return ps.length; });
  };
  L.한가 = function () { return L.바쁨 === 0 && 줄.length === 0 && L.재그림 === 0; };
})();
