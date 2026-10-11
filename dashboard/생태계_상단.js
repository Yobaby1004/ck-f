// 🕸 주식 생태계 = 캘린더 ★맨 위 칸(sec-eco) · 종목 이름·코드 또는 테마 이름 하나로 그 둘레 자료 전부 · 무거운 자료는 고른 뒤에 받는다(열 때는 테마 칩만)
(function () {
  'use strict';
  var TOPN = 40, idx = null, loading = {};
  function esc(s){ return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
  function box(){ return document.getElementById('eco-top-box'); }

  function load(src, test, cb){                       // 같은 파일 두 번 안 받는다
    if (test()) { cb(true); return; }
    if (loading[src]) { loading[src].push(cb); return; }
    loading[src] = [cb];
    var s = document.createElement('script'); s.src = src;
    s.onload = function(){ loading[src].forEach(function(f){ f(test()); }); loading[src] = null; };
    s.onerror = function(){ loading[src].forEach(function(f){ f(false); }); loading[src] = null; };
    document.head.appendChild(s);
  }
  var loadTE = function(cb){ load('dashboard/data/테마생태계.js', function(){ return !!(window.__TE && window.__TE.themes); }, cb); };
  var loadIdx = function(cb){ load('dashboard/data/생태계_색인.js', function(){ return !!(window.ECO_INDEX && window.ECO_INDEX.stocks); }, function(ok){ idx = ok ? window.ECO_INDEX.stocks : {}; cb(ok); }); };

  function showTheme(th){
    try { localStorage.setItem('eco_top_last', 'T:' + th); } catch (e) {}
    var b = box(); if (!b) return;
    b.innerHTML = '';
    if (typeof window._테마생태계_채우기 === 'function') window._테마생태계_채우기(th, 'eco-top-box');
    else b.innerHTML = '<div style="font-size:12px;color:#8487bd">테마생태계_뷰.js 없음</div>';
  }
  function showAll(){
    try { localStorage.removeItem('eco_top_last'); } catch (e) {}
    var b = box(); if (!b) return;
    if (typeof window._생태계지도_전체 === 'function') window._생태계지도_전체('eco-top-box');
    else b.innerHTML = '<div style="font-size:12px;color:#8487bd">테마생태계_뷰.js 없음</div>';
  }
  function showStock(code, name){
    try { localStorage.setItem('eco_top_last', 'S:' + code + '|' + (name || '')); } catch (e) {}
    var b = box(); if (!b) return;
    b.innerHTML = '<div style="font-size:13px;font-weight:700;color:#dce8ff;margin:6px 0 4px"><span id="eco-top-home" style="font-size:11.5px;font-weight:400;color:#7ee8ff;cursor:pointer">🌐 전체 테마 지도</span> <span style="color:#6f72a8">›</span> 📌 ' + esc(name || code) + ' <span style="font-size:11px;font-weight:400;color:#8487bd">' + esc(code) + ' · <span id="eco-top-open" style="color:#7ee8ff;cursor:pointer">종목창 열기 ↗</span></span></div><div id="eco-top-stock"></div>';
    var o = document.getElementById('eco-top-open');
    if (o) o.onclick = function(){ if (typeof showStockFromData === 'function') showStockFromData({entry: {krStockCode: code, displayName: name || code}}); };
    var hm = document.getElementById('eco-top-home');
    if (hm) hm.onclick = showAll;
    // 종목도 구(球)로 = 가운데 종목 · 공시(DART)·뉴스·테마·동행·사건 허브(호두 focus 와 같은 모양) · ☰ 목록을 누르면 기존 평면 목록
    if (typeof window._생태계지도_종목 === 'function') window._생태계지도_종목(code, 'eco-top-stock');
    else if (typeof window._생태계_채우기 === 'function') window._생태계_채우기(code, 'eco-top-stock');
  }

  function cands(q){                                   // 이름·코드·테마 후보 (테마 먼저)
    var out = [], TE = (window.__TE && window.__TE.themes) || {}, lq = q.toLowerCase();
    Object.keys(TE).forEach(function(t){ if (t === q) out.push({k: 'T', v: t, n: TE[t].n종목, exact: 1}); });
    if (/^[0-9A-Z]{6}$/.test(q)) out.push({k: 'S', v: q, name: (idx && idx[q] && idx[q][0]) || q, exact: 1});
    if (idx) Object.keys(idx).forEach(function(c){ if (idx[c][0] === q) out.push({k: 'S', v: c, name: idx[c][0], exact: 1}); });
    if (!out.length) {
      Object.keys(TE).forEach(function(t){ if (t.toLowerCase().indexOf(lq) >= 0) out.push({k: 'T', v: t, n: TE[t].n종목}); });
      if (idx) Object.keys(idx).forEach(function(c){ if (idx[c][0] && idx[c][0].toLowerCase().indexOf(lq) >= 0) out.push({k: 'S', v: c, name: idx[c][0]}); });
    }
    out.sort(function(a, b){ return (b.exact || 0) - (a.exact || 0) || (b.n || 0) - (a.n || 0); });
    return out.slice(0, 24);
  }

  function go(q){
    q = String(q || '').trim(); if (!q) return;
    var b = box(); if (b) b.innerHTML = '<div style="font-size:12px;color:#8487bd;padding:8px 0">🕸 찾는 중…</div>';
    loadTE(function(){ loadIdx(function(){
      var c = cands(q);
      if (!c.length) { if (b) b.innerHTML = '<div style="font-size:12px;color:#8487bd;padding:8px 0">「' + esc(q) + '」 = 테마에도 종목에도 없습니다. 아래 테마 칩에서 고르세요.</div>'; return; }
      if (c.length === 1 || c[0].exact) { c[0].k === 'T' ? showTheme(c[0].v) : showStock(c[0].v, c[0].name); return; }
      if (b) b.innerHTML = '<div style="font-size:12px;color:#8487bd;margin:6px 0">후보 ' + c.length + '개 — 고르세요</div>'
        + c.map(function(x){ return '<span class="eco-top-pick" data-k="' + x.k + '" data-v="' + esc(x.v) + '" data-n="' + esc(x.name || '') + '" style="display:inline-block;background:#161c33;border:1px solid rgba(255,255,255,.12);border-radius:9px;padding:4px 10px;margin:0 6px 6px 0;font-size:12px;color:' + (x.k === 'T' ? '#5effd6' : '#7ee8ff') + ';cursor:pointer">' + (x.k === 'T' ? (typeof window._테마국면색 === 'function' ? '<span style="color:' + window._테마국면색(x.v) + '">●</span> ' : '') + '🕸 ' : '📌 ') + esc(x.k === 'T' ? x.v + ' (' + x.n + ')' : x.name + ' ' + x.v) + '</span>'; }).join('');
    }); });
  }

  function chips(all){
    var TE = (window.__TE && window.__TE.themes) || {};
    var ks = Object.keys(TE).sort(function(a, b){ return TE[b].n종목 - TE[a].n종목; });
    var show = all ? ks : ks.slice(0, TOPN);
    return show.map(function(t){ return '<span class="eco-top-pick" data-k="T" data-v="' + esc(t) + '" style="display:inline-block;background:#141a2e;border:1px solid rgba(255,255,255,.1);border-radius:9px;padding:3px 9px;margin:0 5px 6px 0;font-size:12px;color:#5effd6;cursor:pointer">' + esc(t) + '<span style="color:#6f76a8;font-size:10.5px"> ' + TE[t].n종목 + '</span></span>'; }).join('')
      + (!all && ks.length > TOPN ? '<span class="eco-top-more" style="display:inline-block;font-size:12px;color:#f5b342;cursor:pointer;padding:3px 9px">+ 나머지 테마 ' + (ks.length - TOPN) + '개</span>' : '');
  }

  function shell(){
    return '<div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-bottom:8px">'
      + '<input id="eco-top-q" type="text" placeholder="종목 이름·코드 또는 테마 이름  (예: 반도체 / SK하이닉스 / 000660)" style="flex:1;min-width:280px;background:#0e1424;border:1px solid rgba(255,255,255,.14);border-radius:9px;padding:9px 12px;color:#dce8ff;font-size:13px;outline:none">'
      + '<button id="eco-top-btn" style="background:rgba(94,255,214,.18);border:1px solid rgba(94,255,214,.35);color:#5effd6;font-size:12px;border-radius:9px;padding:9px 16px;cursor:pointer">🕸 생태계 보기</button></div>'
      + '<div class="cal-desc" data-desc="eco" style="font-size:11px;color:#6f72a8;margin-bottom:6px">아래 두 구(球)는 <b style="color:#8a90c0">같은 테마 전부</b>다(자리·크기 같음 · 왼쪽 = 한 색 · 오른쪽 = 지금 돈이 도는가 · 빨강 주도 · 초록 뜨는 · 흰색 살아있음 · 어두운 회색 죽음 · 개별이슈는 구 밖 칸). 테마를 누르면 <b style="color:#8a90c0">그 테마로 4년간 오른 종목 전부</b>로 파고들고, 거기서 종목을 누르면 <b style="color:#8a90c0">그 종목 둘레 자료 전부</b>(자리·사건·뉴스·공시·재무·카드 뒤 성적·동행)가 열린다.</div>'
      + '<div id="eco-top-box"></div>';
  }

  function init(){
    var root = document.getElementById('sec-eco-body'); if (!root || root.__eco) return;
    root.__eco = 1; root.innerHTML = shell();
    var q = document.getElementById('eco-top-q'), btn = document.getElementById('eco-top-btn');
    if (q) q.addEventListener('keydown', function(e){ if (e.key === 'Enter') { e.preventDefault(); go(q.value); } });
    if (btn) btn.onclick = function(){ go(q ? q.value : ''); };
    root.addEventListener('click', function(ev){
      var t = ev.target.closest ? ev.target.closest('.eco-top-pick, .eco-top-more') : null; if (!t) return;
      if (t.classList.contains('eco-top-more')) { document.getElementById('eco-top-chips').innerHTML = chips(true); return; }
      if (t.getAttribute('data-k') === 'T') showTheme(t.getAttribute('data-v'));
      else showStock(t.getAttribute('data-v'), t.getAttribute('data-n'));
    });
    // ★2026-09-29 사용자 "창을 열면 반도체로 켜지는데 전체보기 모습으로" = 창을 열 때는 ★언제나 전체 테마 구.
    //   예전엔 마지막에 본 테마·종목(eco_top_last)을 되살렸다 → 한 번 누른 반도체가 매번 켜졌다. 되살리기만 끄고 기록은 남겨 둔다(다시 켜려면 아래 주석 세 줄).
    //   var last = ''; try { last = localStorage.getItem('eco_top_last') || ''; } catch (e) {}
    //   if (last.indexOf('T:') === 0) showTheme(last.slice(2));
    //   else if (last.indexOf('S:') === 0) { var p = last.slice(2).split('|'); loadIdx(function(){ showStock(p[0], p[1]); }); } else showAll();
    showAll();
  }
  window._생태계_상단 = init;
  // 🗂 카드·세부분야 화면 → 맨 위 🕸 구 하나로 보낸다(구를 두 번 띄우지 않는다 = 구 코드는 상태가 하나 · 2026-09-23 세 화면 통일 C·E)
  window._생태계구로 = function(th){
    init();
    loadTE(function(){ if (th && window.__TE && window.__TE.themes && window.__TE.themes[th]) showTheme(th); else showAll(); });
    var sec = document.getElementById('sec-eco'); if (sec) sec.scrollIntoView({behavior: 'smooth', block: 'start'});
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else setTimeout(init, 0);
})();
