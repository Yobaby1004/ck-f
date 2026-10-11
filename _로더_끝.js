/* 📱 천억 캘린더 폰 전체판 · 끝 로더 (</body> 바로 앞 · 규칙_v1.md §2-3 · v1.3) · 원본 = 주도주\_모바일전체\_로더_끝.js
   모든 화면 코드(뷰 js)가 자기 감싸기를 끝낸 뒤에 실행된다.
   ① 큰 화면 6개 그리기 함수를 감싸 '그린 뒤 → 모자란 조각 받기 → 같은 함수로 다시 그리기'
      (모자란 조각이 있거나 · 마지막으로 그린 뒤 다른 길로 새로 들어온 조각이 있으면)
   ② 보이는 해 12개월(베스트·2060) · 첫터치5 전 기간+또닿음은 그 화면이 보일 때만(처음 화면을 가볍게)
   ③ 처음 묶음에서 뺀 자료를 쓰는 기능 = 다 받은 뒤 원래 함수 실행
      (월간눌림 깊은 상세·첫터치5 종목 찾기 = 첫터치5 전 기간 · 흐름판 창 4개 = THEMEFLOW · 주도3안 다른 해 = JS3_DAYS 전 기간)
   ④ 서비스워커 등록(https 또는 이 PC 시험 주소일 때)
   PC 함수는 바꾸지 않고 앞뒤에만 끼운다. ★매수신호 아님. */
(function () {
  'use strict';
  var L = window.__조각로더; if (!L || !L.색인) return;
  var IX = L.색인;
  function ym(y, m) { return y + '-' + (m < 10 ? '0' : '') + m; }
  function 더하기(y, m, d) { var t = y * 12 + (m - 1) + d; return [Math.floor(t / 12), (t % 12) + 1]; }
  function 앞뒤(y, m) { var o = []; for (var d = -1; d <= 1; d++) { var a = 더하기(y, m, d); o.push(ym(a[0], a[1])); } return o; }
  function 그해(y) { var o = []; for (var m = 1; m <= 12; m++) o.push(ym(y, m)); return o; }
  function 있는가(p) { return p[1] === '_전체' ? !!IX.늦게[p[0]] : !!(IX.g[p[0]] && IX.g[p[0]].s[p[1]]); }
  function 전기간(g) { var gi = IX.g[g]; return gi ? gi.m.map(function (m) { return [g, m]; }) : []; }
  /* eslint-disable no-undef */
  var VIEWS = {
    best:  { 상태: function () { return [bestY, bestM]; },     그림: 'renderBestCalendar',  칸: 'best-view',  해: true },
    ft5:   { 상태: function () { return [ft5Y, ft5M]; },       그림: 'renderFt5Calendar',   칸: 'ft5-view',   전체: ['첫터치5_ARCHIVE'], 늦게: ['첫터치5_또닿음'] },
    r2060: { 상태: function () { return [r2060Y, r2060M]; },   그림: 'renderR2060Calendar', 칸: 'r2060-view', 해: true },
    month: { 상태: function () { return [curYear, curMonth]; }, 그림: 'renderAll',           칸: 'cal-view' },
    mnl:   { 상태: function () { return [mnlY, mnlM]; },       그림: 'renderMnlCalendar',   칸: 'mnl-view' },
    clean: { 상태: function () { return [cleanY, cleanM]; },   그림: 'renderCleanCalendar', 칸: 'clean-view' }
  };
  /* eslint-enable no-undef */
  var 원래 = {}, 본적 = {}, 그린순번 = {};
  function 보임(v) {
    var el = document.getElementById(VIEWS[v].칸); if (!el) return false;
    var r = el.getBoundingClientRect(); return r.bottom > -300 && r.top < (window.innerHeight || 800) + 300;
  }
  function 필요(v, 무거움) {
    var cfg = VIEWS[v], gs = IX.뷰[v] || [], st;
    try { st = cfg.상태(); } catch (e) { return []; }
    var y = +st[0], m = +st[1]; if (!y || !m) return [];
    var ms = 앞뒤(y, m); if (무거움 && cfg.해) ms = ms.concat(그해(y));
    var pairs = [];
    for (var i = 0; i < gs.length; i++) {
      var g = gs[i], gi = IX.g[g]; if (!gi) continue;
      if (무거움 && cfg.전체 && cfg.전체.indexOf(g) >= 0) { pairs = pairs.concat(전기간(g)); continue; }
      for (var j = 0; j < ms.length; j++) pairs.push([g, ms[j]]);
    }
    if (무거움 && cfg.늦게) for (var k = 0; k < cfg.늦게.length; k++) pairs.push([cfg.늦게[k], '_전체']);
    return pairs;
  }
  function 확인(v, 무거움) {
    if (무거움) 본적[v] = true;
    var pairs = 필요(v, 무거움 || 본적[v]), miss = [], fresh = false, since = 그린순번[v] || 0;
    for (var i = 0; i < pairs.length; i++) {
      if (!있는가(pairs[i])) continue;
      var id = pairs[i][0] + '|' + pairs[i][1];
      if (!L.받음[id]) miss.push(pairs[i]); else if ((L.순번[id] || 0) > since) fresh = true;
    }
    if (!miss.length && !fresh) return Promise.resolve(false);
    L.재그림++;
    return L.불러(miss).then(function () {
      try { 그린순번[v] = L.seq; 원래[v].call(window); } catch (e) { L.오류.push(v + ' 다시 그리기: ' + e.message); }
      L.재그림--; return true;
    }, function (e) { L.재그림--; L.오류.push(v + ' 받기: ' + e); });
  }
  L.확인 = 확인;
  Object.keys(VIEWS).forEach(function (v) {
    var name = VIEWS[v].그림, f = window[name];
    if (typeof f !== 'function') { L.오류.push('그리기 함수 없음 ' + name); return; }
    원래[v] = f;
    window[name] = function () { var r = f.apply(this, arguments); 그린순번[v] = L.seq; 확인(v, 보임(v)); return r; };
    그린순번[v] = L.seq;   // 처음 그림(이 줄 전에 이미 끝남) = 첫 화면 묶음까지 받은 상태
  });
  var SV = { month: 'month', best: 'best', ft5: 'ft5', r2060: 'r2060', mnl: 'mnl', clean: 'clean' };
  if (typeof window.setView === 'function') {
    var sv = window.setView;
    window.setView = function (v) { var r = sv.apply(this, arguments); if (SV[v]) 확인(SV[v], true); return r; };
  }
  // ③ 처음 묶음에서 뺀 자료를 쓰는 기능 = 다 받은 뒤 원래 함수 실행
  function 먼저받고(names, 무엇) {
    names.forEach(function (name) {
      var f = window[name]; if (typeof f !== 'function') return;
      window[name] = function () {
        var self = this, args = arguments;
        var miss = 무엇.apply(null, args).filter(function (p) { return 있는가(p) && !L.받음[p[0] + '|' + p[1]]; });
        if (!miss.length) return f.apply(self, args);
        L.재그림++;
        L.불러(miss).then(function () { try { f.apply(self, args); } catch (e) { L.오류.push(name + ': ' + e.message); } L.재그림--; });
      };
    });
  }
  먼저받고(['openMnlDetail', 'openMnlStay', 'ft5Search', 'ft5Pick'], function () { return 전기간('첫터치5_ARCHIVE').concat([['첫터치5_또닿음', '_전체']]); });
  먼저받고(['_themeFlowModal', 'detailDR', '_pick25MonthlyModal', '_pick25WeeklyModal'], function () { return [['THEMEFLOW', '_전체']]; });
  먼저받고(['js3Year'], function (dy) { return +dy ? 전기간('JS3_DAYS') : []; });
  먼저받고(['js3Pick', 'js3CellBtn'], function () { return 전기간('JS3_DAYS'); });
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting && e.target.__조각뷰) 확인(e.target.__조각뷰, true); });
    }, { rootMargin: '300px' });
    Object.keys(VIEWS).forEach(function (v) { var el = document.getElementById(VIEWS[v].칸); if (el) { el.__조각뷰 = v; io.observe(el); } });
  }
  Object.keys(VIEWS).forEach(function (v) { 확인(v, 보임(v)); });
  // ④ 서비스워커 = 오프라인·다시 열 때 빠르게(조각은 내용 해시 주소라 바뀐 것만 새로 받음)
  if ('serviceWorker' in navigator && (location.protocol === 'https:' || /^(127\.0\.0\.1|localhost)$/.test(location.hostname))) {
    navigator.serviceWorker.register('sw.js').catch(function (e) { L.오류.push('서비스워커: ' + e.message); });
  }
  // ⑤ 폰 실측 상자 = 주소 끝에 ?측정 을 붙였을 때만(평소엔 안 보임) · 첫 그림·준비·load 시간 · 받은 양(압축 기준) · 조각 수 · 메모리
  L.준비ms = performance.now();
  if (/측정|%EC%B8%A1%EC%A0%95/.test(location.search)) {
    var box = document.createElement('div');
    box.style.cssText = 'position:fixed;left:6px;right:6px;bottom:6px;z-index:2147483647;background:rgba(0,0,0,.86);color:#7ee8ff;font:12px/1.45 monospace;padding:7px 9px;border-radius:9px;pointer-events:none;white-space:pre-wrap';
    document.body.appendChild(box);
    var 한가때 = null;
    var 갱신 = function () {
      var nav = performance.getEntriesByType('navigation')[0] || {}, res = performance.getEntriesByType('resource');
      var fcp = (performance.getEntriesByType('paint').filter(function (e) { return e.name === 'first-contentful-paint'; })[0] || {}).startTime;
      var bytes = (nav.transferSize || 0) + res.reduce(function (s, e) { return s + (e.transferSize || 0); }, 0);
      var cached = res.filter(function (e) { return !e.transferSize && e.decodedBodySize > 0; }).length;   // 기억(서비스워커·브라우저 캐시)에서 꺼낸 파일 = 전송 0
      var mem = performance.memory ? Math.round(performance.memory.usedJSHeapSize / 1048576) + 'MB' : '-';
      if (L.한가() && 한가때 === null && nav.loadEventEnd) 한가때 = performance.now();
      box.textContent = '⏱ 첫 그림 ' + (fcp ? (fcp / 1000).toFixed(1) : '-') + '초 · 준비 ' + (L.준비ms / 1000).toFixed(1) + '초 · load ' + (nav.loadEventEnd ? (nav.loadEventEnd / 1000).toFixed(1) : '…') + '초'
        + (한가때 ? ' · 다 그림 ' + (한가때 / 1000).toFixed(1) + '초' : '')
        // 문서가 서비스워커를 거쳐 왔으면(=다시 방문) 전송량 숫자가 압축 전 크기로 부풀려 보여서 MB 대신 '기억에서 꺼낸 수'만 보인다
        + (nav.workerStart > 0 ? '\n다시 방문 · 파일 ' + (res.length + 1) + '개 중 기억(서비스워커)에서 ' + cached + '개'
                               : '\n첫 방문 · 망으로 받은 양 ' + (bytes / 1048576).toFixed(1) + 'MB(압축) · 파일 ' + (res.length + 1) + '개')
        + ' · 조각 ' + Object.keys(L.받음).length
        + ' · 메모리 ' + mem + ' · ' + (L.한가() ? '✅ 한가' : '⏳ 받는 중') + (L.오류.length ? ' · ⚠ 오류 ' + L.오류.length : '');
    };
    setInterval(갱신, 1000); 갱신();
  }
  L.끝 = true;
})();
