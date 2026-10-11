// 📺 유튜브 달력 (2026-10-01 사용자 지시) = 스킬 /유튜브요약 · 칸 = 유튜브 업로드 날짜(한국시간)
//   자료 = dashboard/data/유튜브요약.js (window.YT_SUM = {"YYYY-MM-DD":[영상,...]}) · 추가 = skills\user\유튜브요약\scripts\add_entry.py
//   종목 칩 누르기 = 맨 위 🕸 주식 생태계에서 그 종목 열기 · 관찰용 · 매수추천 아님
(function(){
  var S = { y: 0, m: 0, sel: null };
  function E(s){ return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
  function D(){ return window.YT_SUM || {}; }
  function pad(n){ return (n < 10 ? '0' : '') + n; }
  function key(y, m, d){ return y + '-' + pad(m + 1) + '-' + pad(d); }
  function latest(){ var ks = Object.keys(D()).sort(); return ks.length ? ks[ks.length - 1] : null; }

  function ensure(){
    var sec = document.getElementById('sec-yt'); if (sec) return sec;
    // 구역 = 🗣 검사관과 같은 모양(2026-10-07 사용자 "유튜브·채점 달력도 버튼순서와 달력순서 일치") · 큰 제목 막대(onepage-sec) 뺌 · 위 고정 메뉴줄에 안 가리게 80px
    sec = document.createElement('section'); sec.id = 'sec-yt'; sec.style.scrollMarginTop = '80px';
    // 자리 = 📝 채점 달력 바로 위(맨 위 버튼 순서 … 🗣 검사관 → 📺 유튜브 → 📝 채점 = 채점이 맨 아래 · 2026-10-07 사용자 "채점 달력은 맨 아래로")
    //   페이지가 다 읽히기 전에 📝 채점을 누르면 채점 달력이 먼저 생겨서, 전엔 유튜브 달력이 그 뒤(맨 아래)에 붙었다
    var g = document.getElementById('sec-grade');
    if (g && g.parentNode) g.parentNode.insertBefore(sec, g);
    else { var a = document.getElementById('sec-eco'); (a && a.parentNode ? a.parentNode : document.body).appendChild(sec); }
    return sec;
  }

  function render(){
    var sec = ensure(), data = D(), y = S.y, m = S.m;
    var first = new Date(y, m, 1).getDay(), days = new Date(y, m + 1, 0).getDate();
    var nAll = 0; Object.keys(data).forEach(function(k){ nAll += data[k].length; });
    var nMon = 0;
    // 머리 = 다른 달력(🏅 베스트 · 🏹 2060 · 🗣 검사관 …)과 같은 순서(2026-10-07 사용자 "버튼순서와 달력순서가 일치하게")
    //   왼쪽 = ‹ 해 › + 📺 유튜브 이름표(맨 위 버튼 이름 그대로) · 오른쪽 = 최신 + 📖 설명 보기 → 1~12월 → 달력
    var h = '<div class="cal-header" style="margin-top:30px"><div class="cal-nav">'
      + '<button class="nav-btn" onclick="ytYear(-1)" title="이전 해">&#8249;</button>'
      + '<div class="cal-title" style="min-width:120px;text-align:center">' + y + '년</div>'
      + '<button class="nav-btn" onclick="ytYear(1)" title="다음 해">&#8250;</button><span class="cal-badge-name" title="이 달력 = 맨 위 [📺 유튜브] 버튼 · 누르면 그 버튼처럼 이 달력 맨 위로" onclick="setView(\'yt\')">📺 유튜브</span></div>'
      + '<div class="cal-right"><button class="today-btn" onclick="ytLatest()">최신</button>'
      + (typeof descBtnHTML === 'function' ? descBtnHTML('yt') : '')
      + '<div class="cal-desc" data-desc="yt" style="font-size:11.5px;color:#8487bd;margin-left:10px;line-height:1.55">📺 <b style="color:#b8bde6">/유튜브요약 (주소)</b> = 영상 요약 + 국내 관련주 · 칸 = 업로드 날짜(한국시간) · 종목 칩 누르면 🕸 생태계로 · 관찰용 · 매수추천 아님 · 전체 ' + nAll + '편</div>'
      + '</div></div>';
    // 1~12월 버튼 = 다른 달력과 같은 ms-btn (2026-10-01 사용자 "달력마다 달이 다 보이게 통일" · 전엔 ‹ › 로 한 달씩만)
    h += '<div class="month-strip">';
    for (var mi = 0; mi < 12; mi++){
      var pre = y + '-' + pad(mi + 1), nv = 0;
      Object.keys(data).forEach(function(k){ if (k.indexOf(pre) === 0) nv += data[k].length; });
      h += '<button class="ms-btn' + (mi === m ? ' active' : '') + (nv && mi !== m ? ' has-data' : '') + '" onclick="ytGoMonth(' + mi + ')" title="' + (mi + 1) + '월 ' + (nv ? nv + '편' : '영상 없음') + '">' + (mi + 1) + '월</button>';
    }
    h += '</div>';
    h += '<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:4px">';
    ['일','월','화','수','목','금','토'].forEach(function(w, i){ h += '<div style="text-align:center;font-size:11px;color:' + (i === 0 ? '#ff6b81' : i === 6 ? '#6bb7ff' : '#8487bd') + '">' + w + '</div>'; });
    for (var i = 0; i < first; i++) h += '<div></div>';
    for (var d = 1; d <= days; d++){
      var k = key(y, m, d), L = data[k] || []; nMon += L.length;
      var on = S.sel === k;
      h += '<div data-date="' + k + '" onclick="ytPick(\'' + k + '\')" style="position:relative;min-height:74px;padding:5px;border-radius:8px;cursor:' + (L.length ? 'pointer' : 'default') + ';background:' + (L.length ? '#1b1530' : '#0e1424') + ';border:1px solid ' + (on ? '#ff4d4d' : L.length ? 'rgba(255,77,77,.35)' : 'rgba(255,255,255,.06)') + '">'
        + '<div style="font-size:11px;color:#8487bd">' + d + (L.length ? ' <b style="color:#ff6b6b">▶' + L.length + '</b>' : '') + '</div>';
      if (L.length > 2){
        var chs = []; L.forEach(function(v){ if (chs.indexOf(v.channel) < 0) chs.push(v.channel); });
        h += '<div style="font-size:10.5px;color:#ff9f5a;line-height:1.45;margin-top:3px">' + chs.length + '채널 · ' + chs.map(function(c){ return E(SHORT(c)); }).join(' · ') + '</div>';
      } else L.forEach(function(v){
        h += '<div style="font-size:10.5px;color:#dce8ff;line-height:1.3;margin-top:3px;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical">'
          + '<span style="color:#ff9f5a">' + E(v.channel) + '</span> ' + E(v.title) + '</div>';
      });
      h += (typeof window.ytCellBtn === 'function' ? window.ytCellBtn(k, d, new Date(y, m, d).getDay()) : '') + '</div>';   // 📅 토요일 · 📆 첫 일요일 결산 단추 = 채점_뷰.js(2026-10-11)
    }
    h += '</div><div style="font-size:11px;color:#6f72a8;margin-top:6px">이번 달 ' + nMon + '편</div>';
    sec.innerHTML = h;
  }

  // 📺 채널 12곳 (유튜브브리핑 채널목록.json 과 같은 순서) · 날짜 창에서 '안 올린 채널' 표시용
  var CH = ['심플 관심종목 TV','주덕','개미대학','금나무 주식','소수몽키','상한가추월차선','마르스 김동석의 리얼주식','설춘환캠퍼스','이재진의 주식전략실','수익맨','시윤주식','부자티비'];
  function SHORT(c){ return String(c || '').replace(' 관심종목 TV', '').replace(' 김동석의 리얼주식', '').replace('의 주식전략실', '').replace('상한가추월차선', '상추').replace('캠퍼스', '').replace(' 주식', '').replace('주식', ''); }
  function same(a, b){ return SHORT(a).replace(/\s/g, '') === SHORT(b).replace(/\s/g, ''); }

  function modal(){
    var ov = document.getElementById('yt-modal');
    if (!ov){
      ov = document.createElement('div'); ov.id = 'yt-modal';
      ov.style.cssText = 'display:none;position:fixed;inset:0;background:rgba(0,0,0,.7);backdrop-filter:blur(3px);z-index:9990;align-items:center;justify-content:center;padding:24px';
      ov.innerHTML = '<div id="yt-modal-box" style="background:linear-gradient(180deg,rgba(28,14,30,.98),rgba(12,8,24,.98));border:1px solid rgba(255,77,77,.45);border-radius:16px;padding:20px 22px;max-width:1080px;width:100%;max-height:92vh;overflow:auto;color:#dce8ff;font-family:\'Noto Sans KR\',sans-serif"></div>';
      ov.onclick = function(e){ if (e.target === ov) ov.style.display = 'none'; };
      document.body.appendChild(ov);
      document.addEventListener('keydown', function(e){ if (e.key === 'Escape' && ov.style.display === 'flex' && !(document.getElementById('stock-modal-overlay') || {}).offsetParent) ov.style.display = 'none'; });
    }
    return ov;
  }

  function dayModal(k, openId){
    var L = (D()[k] || []).slice().sort(function(a, b){ return String(a.uploaded || '').localeCompare(String(b.uploaded || '')); });
    if (!L.length) return;
    var ov = modal(), box = document.getElementById('yt-modal-box');
    var posted = [], cnt = {};
    L.forEach(function(v){ if (posted.indexOf(v.channel) < 0) posted.push(v.channel);
      (v.stocks || []).forEach(function(g){ (g.names || []).forEach(function(n, j){ var c = (g.codes || [])[j] || n; cnt[c] = cnt[c] || {n: n, c: (g.codes || [])[j] || '', ch: []}; if (cnt[c].ch.indexOf(v.channel) < 0) cnt[c].ch.push(v.channel); }); }); });
    var miss = CH.filter(function(c){ return !posted.some(function(p){ return same(p, c); }); });
    var multi = Object.keys(cnt).map(function(c){ return cnt[c]; }).filter(function(x){ return x.ch.length >= 2; }).sort(function(a, b){ return b.ch.length - a.ch.length; });
    var h = '<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px"><div>'
      + '<div style="font-size:18px;font-weight:800;color:#fff">📺 ' + E(k) + ' 유튜브 ' + L.length + '편 <span style="font-size:12px;font-weight:400;color:#8487bd">(한국시간 업로드 · 관찰용 · 매수추천 아님)</span></div>'
      + '<div style="font-size:12px;color:#c9cbe8;margin-top:4px">올린 채널 <b style="color:#ff9f5a">' + posted.length + '</b>/' + CH.length + (miss.length ? ' · <span style="color:#6f72a8">안 올림: ' + miss.map(function(c){ return E(SHORT(c)); }).join(', ') + '</span>' : '') + '</div></div>'
      + '<button onclick="document.getElementById(\'yt-modal\').style.display=\'none\'" style="background:transparent;border:1px solid rgba(255,255,255,.2);color:#dce8ff;border-radius:8px;padding:4px 10px;cursor:pointer">✕</button></div>';
    if (multi.length){
      h += '<div style="margin:10px 0 4px;font-size:12px;color:#5effd6">여러 채널이 같이 말한 종목 (채널 수)</div><div>'
        + multi.slice(0, 20).map(function(x){ return chip(x.n, x.c, k, '', '<b style="color:#ffd166">' + x.ch.length + '</b>', x.ch.map(SHORT).join(', ')); }).join('') + '</div>';
    }
    h += '<div style="font-size:11px;color:#6f72a8;margin:10px 0 6px">제목을 누르면 펼칩니다 · 종목 칩 = 종목 창(유튜브 언급·우리 확인 포함)</div>';
    h += L.map(function(v){ return card(v, k, openId ? v.id === openId : L.length === 1); }).join('');
    box.innerHTML = h; ov.style.display = 'flex';
  }

  function chip(n, c, k, meta, tail, tip){
    return '<span onclick="ytStock(this,\'' + k + '\')" data-code="' + E(c) + '" data-name="' + E(n) + '" data-rate="0" data-amount="0" data-meta="' + E(meta || ('📺 ' + k)) + '" title="' + E(tip || '종목 창 열기') + '" style="display:inline-block;background:#161c33;border:1px solid rgba(94,255,214,.3);color:#dce8ff;border-radius:9px;padding:2px 8px;margin:2px;cursor:pointer;font-size:12px">' + E(n) + (tail ? ' ' + tail : '') + '</span>';
  }

  function card(v, k, open){
      var cl = v.claims || [], ok = cl.filter(function(x){ return x.v === '✅'; }).length, q = cl.filter(function(x){ return x.v === '❓'; }).length, bad = cl.length - ok - q;
      var ns = 0; (v.stocks || []).forEach(function(g){ ns += (g.names || []).length; });
      var t = String(v.uploaded || '').slice(11, 16);
      var h = '<details' + (open ? ' open' : '') + ' style="background:#111830;border:1px solid rgba(255,255,255,.1);border-radius:12px;padding:10px 14px;margin-bottom:8px">'
        + '<summary style="cursor:pointer;list-style:none"><div style="font-size:12px;color:#8487bd">' + E(t) + ' · <b style="color:#ff9f5a">' + E(v.channel) + '</b>' + (v.kind === '쇼츠' ? ' · <span style="color:#ff6bd6">쇼츠</span>' : '') + (v.duration ? ' · ' + Math.max(1, Math.round(v.duration / 60)) + '분' : '') + ' · 종목 ' + ns + (cl.length ? ' · 확인 ✅' + ok + ' ❓' + q + (bad ? ' ⚠️' + bad : '') : '') + '</div>'
        + '<div style="font-size:14.5px;font-weight:700;color:#fff;margin:3px 0">▸ ' + E(v.title) + '</div>'
        + (v.oneLine ? '<div style="font-size:12.5px;color:#ffd166">' + E(v.oneLine) + '</div>' : '') + '</summary>'
        + '<div style="margin-top:8px"><a href="' + E(v.url) + '" target="_blank" rel="noopener" style="color:#7ecbff;font-size:12px">▶ 유튜브에서 보기</a></div>';
      if (v.summary && v.summary.length) h += '<ul style="margin:6px 0 6px 18px;padding:0;font-size:12.5px;color:#c9cbe8;line-height:1.6">' + v.summary.map(function(s){ return '<li>' + E(s) + '</li>'; }).join('') + '</ul>';
      if (v.risk) h += '<div style="font-size:12px;color:#ff8a8a;margin:6px 0">⚠ ' + E(v.risk) + '</div>';
      if (v.stocks && v.stocks.length){
        h += '<div style="font-size:12px;color:#5effd6;margin:10px 0 4px">국내 관련주 ' + (v.stockSource ? '<span style="color:#6f72a8">(' + E(v.stockSource) + ')</span>' : '') + '</div>';
        v.stocks.forEach(function(g){
          h += '<div style="margin:3px 0;font-size:12px"><span style="color:#b8bde6;display:inline-block;min-width:120px">' + E(g.sector) + '</span>'
            + (g.names || []).map(function(n, j){ var c = (g.codes || [])[j] || '', p = (v.px || {})[c], r = p ? p.r : null;
                return '<span onclick="ytStock(this,\'' + k + '\')" data-code="' + E(c) + '" data-name="' + E(n) + '" data-rate="0" data-amount="0" data-meta="📺 ' + E(v.channel) + ' ' + E(k) + '" title="종목 창 열기 (유튜브 언급·우리 확인 포함)" style="display:inline-block;background:#161c33;border:1px solid rgba(94,255,214,.3);color:#dce8ff;border-radius:9px;padding:2px 8px;margin:2px;cursor:pointer">' + E(n)
                  + (r != null && p.ld !== p.bd ? ' <b style="color:' + (r >= 0 ? '#ff6b6b' : '#6bb7ff') + '">' + (r >= 0 ? '+' : '') + r + '%</b>' : '') + '</span>'; }).join('')
            + (g.note ? ' <span style="color:#6f72a8">' + E(g.note) + '</span>' : '') + '</div>';
        });
      }
      if (v.claims && v.claims.length){
        h += '<div style="font-size:12px;color:#ffd166;margin:10px 0 4px">우리 확인 (영상 주장 → 뉴스·공시 대조' + (v.claimsDate ? ' · ' + E(v.claimsDate) : '') + ')</div>';
        v.claims.forEach(function(c){ h += '<div style="font-size:12px;color:#c9cbe8;margin:2px 0">' + E(c.v) + ' <b style="color:#fff">' + E(c.t) + '</b> · <span style="color:#8487bd">' + E(c.src) + '</span></div>'; });
      }
      if (v.check && v.check.length){
        h += '<div style="font-size:12px;color:#ffd166;margin:10px 0 4px">병목 점검' + (v.checkDate ? ' (' + E(v.checkDate) + ')' : '') + '</div>';
        v.check.forEach(function(c){ h += '<div style="font-size:12px;color:#c9cbe8;margin:2px 0"><b style="color:#fff">' + E(c.name) + '</b> · <span style="color:' + (/유지/.test(c.verdict) ? '#5effd6' : '#ff8a8a') + '">' + E(c.verdict) + '</span> · ' + E(c.note) + '</div>'; });
      }
      return h + '<div style="font-size:10.5px;color:#6a82a8;margin-top:8px">추가 ' + E(v.added || '') + ' · 관찰용 · 매수추천 아님</div></details>';
  }

  window.ytGo = function(){
    if (!S.y){ var l = latest(), t = l ? new Date(l + 'T00:00:00') : new Date(); S.y = t.getFullYear(); S.m = t.getMonth(); S.sel = l; }
    render(); var sec = document.getElementById('sec-yt'); if (sec) sec.scrollIntoView({behavior: 'smooth', block: 'start'});
  };
  window.ytMonth = function(dm){ S.m += dm; if (S.m < 0){ S.m = 11; S.y--; } if (S.m > 11){ S.m = 0; S.y++; } render(); };
  window.ytYear = function(dy){ S.y += dy; render(); };
  window.ytGoMonth = function(mi){ S.m = mi; render(); };
  window.ytLatest = function(){ S.y = 0; window.ytGo(); };
  window.ytPick = function(k, id){ if (!(D()[k] || []).length) return; S.sel = k; render(); dayModal(k, id); };
  window.ytStock = function(el, k){
    if (typeof window._openStock === 'function' && el.getAttribute('data-code')) window._openStock(el, function(){ window.ytPick(k); });
    else window.ytEco(el.getAttribute('data-name'));
  };
  // 종목 창(모든 달력 공통 showStockDetail) 맨 위에 📺 유튜브 언급 + 우리 확인 + 언급 후 주가를 붙인다(악재경고와 같은 방식)
  function mentions(code, name){
    var out = [], data = D();
    Object.keys(data).sort().reverse().forEach(function(k){ (data[k] || []).forEach(function(v){
      (v.stocks || []).forEach(function(g){ (g.names || []).forEach(function(n, j){
        var c = (g.codes || [])[j] || '';
        if ((code && c === code) || (!c && n === name)) out.push({k: k, v: v, g: g, c: c});
      }); });
    }); });
    return out;
  }
  function ytLine(code, name){
    var body = document.getElementById('stock-modal-body');
    if (!body || body.querySelector('.yt-line')) return;
    var M = mentions(code, name); if (!M.length) return;
    var h = '<div class="yt-line" style="margin:0 0 10px;padding:9px 12px;border-radius:9px;background:rgba(255,77,77,.06);border:1px solid rgba(255,77,77,.45);font-size:12px;line-height:1.6;color:#e8e2f0">'
      + '<b style="color:#ff6b6b">📺 유튜브 언급 ' + M.length + '회</b> <span style="color:#8487bd">(관찰용 · 매수추천 아님 · 날짜 누르면 📺 달력)</span>';
    M.slice(0, 5).forEach(function(m){
      var v = m.v, p = (v.px || {})[m.c], cl = v.claims || [];
      var ok = cl.filter(function(x){ return x.v === '✅'; }).length, q = cl.filter(function(x){ return x.v === '❓'; }).length, bad = cl.filter(function(x){ return x.v === '⚠️' || x.v === '⚠'; }).length;
      var mine = (v.check || []).filter(function(x){ return x.name === name; })[0];
      h += '<div style="margin-top:7px;padding-top:6px;border-top:1px dashed rgba(255,255,255,.1)">'
        + '<a onclick="closeStockDetail&&closeStockDetail();ytGo();ytPick(\'' + m.k + '\',\'' + E(v.id) + '\')" style="color:#7ecbff;cursor:pointer">' + E(m.k) + '</a> · <span style="color:#ff9f5a">' + E(v.channel) + '</span> · <a href="' + E(v.url) + '" target="_blank" rel="noopener" style="color:#fff">' + E(v.title) + '</a><br>'
        + '<span style="color:#b8bde6">분야</span> ' + E(m.g.sector) + ' · <span style="color:' + (/없음|사용자/.test(v.stockSource || '') ? '#ffd166' : '#5effd6') + '">' + (/사용자/.test(v.stockSource || '') ? '사용자 요약 기준 · 영상 직접 언급 여부 미확인' : /없음/.test(v.stockSource || '') ? '영상은 분야만 말함 · 종목은 우리가 고름' : '영상이 직접 언급') + '</span><br>'
        + '<span style="color:#b8bde6">이슈</span> ' + E(v.oneLine || '') + '<br>';
      if (cl.length) h += '<span style="color:#b8bde6">우리 확인</span> 영상 주장 ' + cl.length + '개 중 ✅' + ok + ' ❓' + q + (bad ? ' ⚠️' + bad : '') + '<br>';
      if (mine) h += '<span style="color:#b8bde6">종목 점검</span> <b style="color:' + (/유지/.test(mine.verdict) ? '#5effd6' : '#ff8a8a') + '">' + E(mine.verdict) + '</b> · ' + E(mine.note) + '<br>';
      if (p) h += '<span style="color:#b8bde6">언급 후 주가</span> ' + p.bd.slice(4, 6) + '/' + p.bd.slice(6) + ' 종가 ' + Math.round(p.b).toLocaleString() + ' → ' + p.ld.slice(4, 6) + '/' + p.ld.slice(6) + ' ' + Math.round(p.l).toLocaleString() + ' <b style="color:' + (p.r >= 0 ? '#ff6b6b' : '#6bb7ff') + '">' + (p.r >= 0 ? '+' : '') + p.r + '%</b>' + (p.ld === p.bd ? ' <span style="color:#6f72a8">(아직 다음 거래일 자료 없음)</span>' : '');
      h += '</div>';
    });
    body.insertAdjacentHTML('afterbegin', h + '</div>');
  }
  function hook(){
    var _sd = window.showStockDetail; if (typeof _sd !== 'function' || _sd.__yt) return;
    var w = function(el){ var ret = _sd.apply(this, arguments);
      try { var c = el && el.dataset ? String(el.dataset.code || '') : '', n = el && el.dataset ? String(el.dataset.name || '') : '';
        if (c || n){ setTimeout(function(){ ytLine(c, n); }, 0); setTimeout(function(){ ytLine(c, n); }, 900); } } catch(e){}
      return ret; };
    w.__yt = 1; window.showStockDetail = w;
  }
  window.ytEco = function(name){
    var q = document.getElementById('eco-top-q'), b = document.getElementById('eco-top-btn');
    if (!q && window._생태계_상단){ window._생태계_상단(); q = document.getElementById('eco-top-q'); b = document.getElementById('eco-top-btn'); }
    if (q && b){ q.value = name; b.click(); }
    var sec = document.getElementById('sec-eco'); if (sec) sec.scrollIntoView({behavior: 'smooth', block: 'start'});
  };
  function boot(){ hook(); if (!S.y){ var l = latest(), t = l ? new Date(l + 'T00:00:00') : new Date(); S.y = t.getFullYear(); S.m = t.getMonth(); S.sel = l; } render(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else setTimeout(boot, 0);
})();
