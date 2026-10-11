// 🕸 테마 국면 공용 함수 = 모든 달력(월간·급등·🎯첫터치5·🏅베스트)이 같은 테마 이름·그날 국면·색·구 이동을 쓴다(2026-09-29 사용자 "모든 것은 연결")
//   자료 = window.테마국면_DATA (주도주\_생태계\_테마국면_빌드.py) · 계산 규칙 = _국면_asof.py(PhaseAsOf) 그대로 옮김 · 색 = 테마생태계_뷰.js ST4 와 같다
//   _국면.테마(이름, 날짜) · _국면.원문(카드 원문 테마, 날짜) · _국면.종목(코드, 날짜) → {ti, 이름, c:'주'|'급'|'살'|'죽'|'', rk, 역할}
//   _국면.점(결과) · _국면.태그(결과) = HTML · 누르면 _국면.구로(이름) = 맨 위 🕸 구의 그 테마로(_생태계구로)
//   날짜 = YYYYMMDD 또는 YYYY-MM-DD · ★그 날짜까지의 카드만 본다(미래 안 봄)
(function(){
  var COL = {주: ['#ef4444', '주도'], 급: ['#22c55e', '뜨는'], 살: ['#e3e7fb', '살아있음'], 죽: ['#4a5070', '죽음']};
  var ORD = {주: 0, 급: 1, 살: 2, 죽: 3, '': 4};
  function D(){ return window.테마국면_DATA || null; }
  function ymd(x){ return +String(x == null ? '' : x).replace(/-/g, '').slice(0, 8); }
  function br(a, x){ var lo = 0, hi = a.length; while (lo < hi){ var m = (lo + hi) >> 1; if (a[m] <= x) lo = m + 1; else hi = m; } return lo; }   // bisect_right
  function dayIdx(x){ var R = D(); return R ? br(R.D, ymd(x)) - 1 : -1; }
  var EX = null;
  function phaseTi(ti, x){                              // _국면_asof.PhaseAsOf.state 와 같다(4단계로 합침 = 20·60일 → 살 · 1년·오래·없음 → 죽)
    var R = D(); if (!R || ti == null || ti < 0) return {c: '', rk: 0};
    if (!EX){ EX = {}; (R.EXCL || []).forEach(function(n){ EX[n] = 1; }); }
    if (EX[R.T[ti]]) return {c: '', rk: 0};
    var i = dayIdx(x); if (i < 0) return {c: '', rk: 0};
    var k = R.주[i].indexOf(ti); if (k >= 0) return {c: '주', rk: k + 1};
    k = R.급[i].indexOf(ti); if (k >= 0) return {c: '급', rk: k + 1};
    var L = R.등장[ti] || [], j = br(L, i) - 1;
    if (j < 0) return {c: '죽', rk: 0};
    return {c: L[j] >= i - 59 ? '살' : '죽', rk: 0};
  }
  function pack(ti, x, role){ var R = D(); var p = phaseTi(ti, x); return {ti: ti, 이름: (R && ti >= 0) ? R.T[ti] : '', c: p.c, rk: p.rk, 역할: !!role, 날짜: ymd(x)}; }
  var TI = null;
  function tiOf(name){ var R = D(); if (!R) return -1; if (!TI){ TI = {}; R.T.forEach(function(t, k){ TI[t] = k; }); } return (name in TI) ? TI[name] : -1; }
  var _국면 = {
    색: COL,
    기준일: function(){ var R = D(); return R ? R.기준일 : null; },
    하루전: function(x){                                   // 칸 = 매수일인 달력(🎯첫터치5·🏅베스트)용 = 매수일 전날까지 카드 = 신호일 기준(매수 전 정보)
      var s = String(ymd(x)); var dt = new Date(+s.slice(0, 4), +s.slice(4, 6) - 1, +s.slice(6, 8) - 1);
      return dt.getFullYear() * 10000 + (dt.getMonth() + 1) * 100 + dt.getDate();
    },
    테마: function(name, x){ var ti = tiOf(name); return ti < 0 ? null : pack(ti, x); },
    원문: function(raw, x){                               // 카드 원문 테마 → 테마(여럿이면 그날 국면이 가장 센 것)
      var R = D(); if (!R) return null;
      var L = R.원문[raw] || (tiOf(raw) >= 0 ? [tiOf(raw)] : []);
      if (!L.length) return null;
      var best = null;
      L.forEach(function(ti){ var p = pack(ti, x); if (!best || ORD[p.c] < ORD[best.c] || (ORD[p.c] === ORD[best.c] && (p.rk || 99) < (best.rk || 99))) best = p; });
      if (best && L.length > 1) best.여럿 = L.map(function(t){ return R.T[t]; });
      return best;
    },
    종목: function(code, x){                              // 종목의 1위 테마(그날까지 카드 행 수 · 동률 = 최근 → 이름) → 없으면 역할표
      var R = D(); if (!R || !code) return null;
      var rows = R.종목[code] || [], i = dayIdx(x), cnt = {}, last = {}, any = false;
      for (var r = 0; r < rows.length && rows[r][0] <= i; r++){ var t = rows[r][1]; cnt[t] = (cnt[t] || 0) + 1; last[t] = rows[r][0]; any = true; }
      if (any){
        var top = null;
        Object.keys(cnt).forEach(function(k){ k = +k; if (top === null || cnt[k] > cnt[top] || (cnt[k] === cnt[top] && (last[k] > last[top] || (last[k] === last[top] && R.T[k] < R.T[top])))) top = k; });
        return pack(top, x, false);
      }
      var ro = R.역할[code];
      return (ro != null) ? pack(ro, x, true) : null;
    },
    글: function(p){ return p && p.c ? COL[p.c][1] + (p.rk ? ' ' + p.rk + '위' : '') : ''; },
    점: function(p, px){                                  // 국면 점 = 누르면 🕸 구 · 국면이 없으면 빈 문자열
      if (!p || !p.c) return '';
      var e = String(p.이름).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
      return '<span data-th="' + e + '" onclick="event.stopPropagation();_국면.구로(this.dataset.th)" style="color:' + COL[p.c][0] + ';font-size:' + (px || 8) + 'px;cursor:pointer;margin-right:1px" '
           + 'title="🕸 ' + e + ' · 이 날 ' + _국면.글(p) + (p.역할 ? ' · 역할표 테마(이 날까지 카드엔 없음)' : '') + (p.여럿 ? ' · 원문 테마가 ' + p.여럿.join('/') + ' 에 걸침' : '') + ' · 누르면 맨 위 생태계 구의 이 테마로">●</span>';
    },
    태그: function(p, px){                                // "● 반도체 주도 1위" = 누르면 🕸 구
      if (!p || !p.이름) return '';
      var e = String(p.이름).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
      var col = p.c ? (p.c === '죽' ? '#8a8fb0' : COL[p.c][0]) : '#8487bd';
      return '<span data-th="' + e + '" onclick="event.stopPropagation();_국면.구로(this.dataset.th)" style="color:' + col + ';font-size:' + (px || 11) + 'px;font-weight:600;cursor:pointer;white-space:nowrap" title="🕸 맨 위 생태계 구에서 이 테마 보기' + (p.역할 ? ' · 역할표 테마' : '') + '">'
           + (p.c ? '● ' : '') + e + (p.c ? ' ' + _국면.글(p) : '') + (p.역할 ? '<span style="color:#6b6e9c;font-weight:400">(역할표)</span>' : '') + '</span>';
    },
    그날: function(x, what){                              // '🕸 이 날 국면' 상자 = 그날 주도 10 · 뜨는 10 칩(누르면 구) · what = 설명 꼬리
      var R = D(), i = dayIdx(x); if (!R || i < 0) return '';
      var chip = function(ti, c, k){ var e = String(R.T[ti]).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
        return '<span data-th="' + e + '" onclick="event.stopPropagation();_국면.구로(this.dataset.th)" style="display:inline-block;margin:2px 6px 2px 0;padding:1px 8px;border-radius:10px;border:1px solid ' + COL[c][0] + ';color:' + COL[c][0] + ';cursor:pointer;font-size:11.5px" title="🕸 맨 위 생태계 구에서 이 테마 보기">' + (k + 1) + '. ' + e + '</span>'; };
      var d = String(R.D[i]); d = d.slice(0, 4) + '-' + d.slice(4, 6) + '-' + d.slice(6);
      return '<div style="margin:8px 0;padding:8px 11px;border-radius:8px;background:rgba(239,68,68,.05);border:1px solid rgba(239,68,68,.25);font-size:12px;color:#c9cbe8;line-height:1.7">'
           + '🕸 <b>이 날 국면</b> <span style="color:#8487bd">(' + d + ' 카드까지 · 맨 위 생태계 구와 같은 정의·같은 색 · 누르면 구의 그 테마로' + (what ? ' · ' + what : '') + ')</span><br>'
           + '<b style="color:#ef4444">● 주도</b> ' + (R.주[i].length ? R.주[i].map(function(t, k){ return chip(t, '주', k); }).join('') : '<span style="color:#6b6e9c">없음</span>') + '<br>'
           + '<b style="color:#22c55e">● 뜨는</b> ' + (R.급[i].length ? R.급[i].map(function(t, k){ return chip(t, '급', k); }).join('') : '<span style="color:#6b6e9c">없음</span>') + '</div>';
    },
    구로: function(name){
      try { if (typeof closeStockDetail === 'function') closeStockDetail(); } catch (e) {}
      try { var sp = document.getElementById('side-panel'); if (sp && sp.classList.contains('open') && typeof closeSide === 'function') closeSide(); } catch (e) {}
      if (typeof window._생태계구로 === 'function') window._생태계구로(name || '');
    }
  };
  window._국면 = _국면;
})();
