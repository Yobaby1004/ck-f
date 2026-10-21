// 💸 돈의출처 달력 (2026-10-12 Aside Step 7 · 사용자 "주도주의 돈의 흐름은 어디서 나오나? 일론머스크? 젠슨황? 미국증시?")
//   자료 = dashboard/data/돈의출처.js (window.MONEY_SRC) · 빌더 = 주도주\_돈의출처\build.py(후속 따라잡기 21:30·06:00 · /매매일 9.65)
//   칸 = 그날 캘린더 첫 테마의 출처(색 칩) + 그날 나온 다른 출처(점) · 누르면 테마마다 출처(주·부)·근거 단어·종목
//   위 = 최신 날 카드 · 최근 20/60일 출처별 주도주 돈(4년 평균 대비) · 사전등록 가설 3개 전진 기록 · 관찰용 · 매수추천 아님
(function(){
  var S = { y: 0, m: 0, sel: null, win: 'w20' };
  var COL = {'①':'#76b900','②':'#ff4d6d','③':'#4f8cff','④':'#ff9f43','⑤':'#22c3e6','⑥':'#a57cff','⑦':'#d9a441','⑧':'#ff7eb6','⑨':'#c8a27c','⑩':'#9aa5b1','⑪':'#7986cb','⑫':'#26a69a','⑬':'#ffd54f','⑭':'#e0e0e0','⓪':'#5b6178','⓪동':'#454a60'};
  function M(){ return window.MONEY_SRC || null; }
  function E(s){ return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
  function pad(n){ return (n < 10 ? '0' : '') + n; }
  function key(y, m, d){ return y + '-' + pad(m + 1) + '-' + pad(d); }
  function byId(id){ return document.getElementById(id); }
  function nm(k){ var m = M(); return (m && m.names && m.names[k]) || k; }
  function longNm(k){ var m = M(); return (m && m.long && m.long[k]) || nm(k); }
  function pct(v, d){ return v == null ? '-' : (Math.round(v * Math.pow(10, d == null ? 1 : d)) / Math.pow(10, d == null ? 1 : d)).toFixed(d == null ? 1 : d); }
  function sg(v, d){ return v == null ? '-' : (v > 0 ? '+' : v < 0 ? '−' : '') + pct(Math.abs(v), d); }
  function pv(p){ return p == null ? '-' : p < 0.001 ? '&lt;0.001' : pct(p, 3); }
  function chip(k, short){
    if (!k) return '';
    var c = COL[k] || '#888';
    return '<span class="mn-chip" title="' + E(longNm(k)) + '" style="border-color:' + c + ';color:' + c + '">' + E(k) + (short ? '' : ' ' + E(nm(k))) + '</span>';
  }
  function days(){ var m = M(); return (m && m.days) || {}; }
  function latest(){ var ks = Object.keys(days()).sort(); return ks.length ? ks[ks.length - 1] : null; }

  function css(){
    if (byId('mn-css')) return;
    var st = document.createElement('style'); st.id = 'mn-css';
    st.textContent = ''
      + '#sec-money .mn-chip,#mn-modal .mn-chip{display:inline-block;border:1px solid;border-radius:8px;padding:0 6px;margin:1px 2px 1px 0;font-size:11.5px;line-height:1.55;white-space:nowrap;background:rgba(255,255,255,.03)}'
      + '#sec-money .mn-row{display:grid;grid-template-columns:repeat(auto-fit,minmax(360px,1fr));gap:10px;margin:10px 0}'
      + '#sec-money .mn-box{background:linear-gradient(180deg,rgba(34,195,230,.06),rgba(14,20,36,.6));border:1px solid rgba(34,195,230,.35);border-radius:14px;padding:12px 14px;color:#dce8ff}'
      + '#sec-money .mn-hd{font-size:14.5px;font-weight:800;color:#fff;margin-bottom:6px}#sec-money .mn-sub{font-size:11.5px;color:#8487bd;line-height:1.55}'
      + '#sec-money .mn-ln{font-size:12.5px;line-height:1.5;padding:3px 0;border-top:1px dashed rgba(255,255,255,.07)}#sec-money .mn-ln:first-of-type{border-top:0}'
      + '#sec-money .mn-w{font-size:11px;color:#7f86a8}#sec-money .mn-bar{position:relative;height:12px;background:rgba(255,255,255,.05);border-radius:6px;overflow:visible}'
      + '#sec-money .mn-bar i{position:absolute;left:0;top:0;bottom:0;border-radius:6px;opacity:.85}#sec-money .mn-bar b{position:absolute;top:-3px;bottom:-3px;width:2px;background:#fff;opacity:.8}'
      + '#sec-money table.mn-t{width:100%;border-collapse:collapse;font-size:12px}#sec-money table.mn-t th{color:#8fa0d8;font-weight:600;text-align:left;padding:4px 6px;border-bottom:1px solid rgba(255,255,255,.12);position:sticky;top:0;background:#111830}'
      + '#sec-money table.mn-t td{padding:4px 6px;border-bottom:1px solid rgba(255,255,255,.06);vertical-align:top}'
      + '#sec-money .mn-cell{position:relative;min-height:70px;padding:5px;border-radius:8px;font-size:10.5px;line-height:1.35;overflow:hidden;background:#0e1424;border:1px solid rgba(255,255,255,.06)}'
      + '#sec-money .mn-cell.has{cursor:pointer;background:#101a2e;border-color:rgba(34,195,230,.28)}#sec-money .mn-cell.sel{border-color:#ff4d4d !important}#sec-money .mn-cell.fwd{box-shadow:inset 0 0 0 1px rgba(255,214,102,.35)}'
      + '#sec-money .mn-dot{display:inline-block;width:7px;height:7px;border-radius:50%;margin:0 2px 0 0}'
      + '#sec-money .mn-pill{display:inline-block;padding:1px 8px;border-radius:9px;font-size:11px;font-weight:700}'
      + '#sec-money .mn-tg{background:transparent;border:1px solid rgba(255,255,255,.18);color:#c9cbe8;border-radius:8px;padding:1px 8px;margin-left:4px;cursor:pointer;font-size:11px}#sec-money .mn-tg.on{border-color:#22c3e6;color:#22c3e6}';
    document.head.appendChild(st);
  }

  function ensure(){
    var sec = byId('sec-money');
    if (!sec){ sec = document.createElement('section'); sec.id = 'sec-money'; sec.style.scrollMarginTop = '80px'; }
    // 자리 = 맨 위 버튼 순서(… 📺 유튜브 → 💸 돈의출처 → 📝 채점) = 📝 채점 달력 바로 위 · 채점이 아직 없으면 📺 유튜브 바로 뒤
    var g = byId('sec-grade'), yt = byId('sec-yt');
    if (g && g.parentNode){ if (sec.nextElementSibling !== g) g.parentNode.insertBefore(sec, g); }
    else if (yt && yt.parentNode){ if (yt.nextElementSibling !== sec) yt.parentNode.insertBefore(sec, yt.nextSibling); }
    else if (!sec.parentNode){ var a = byId('sec-eco'); ((a && a.parentNode) || document.querySelector('main') || document.body).appendChild(sec); }
    return sec;
  }

  function todayCard(m){
    var k = latest(); if (!k) return '<div class="mn-box">자료 없음</div>';
    var D = days()[k], h = '<div class="mn-box"><div class="mn-hd">📅 ' + E(k) + ' 그날 돈을 켠 출처 <span class="mn-sub">(캘린더 최신 날 · 테마 ' + D.l.length + '줄)</span></div>';
    if (D.coverage === 'NO_GROUP_THEME_CONFIRMED') return h + '<div class="mn-sub" style="padding:10px 0">원본 ' + E(D.raw_rows || '') + '행 수신 확인. 전부 개별이슈여서 집계할 공통 테마가 없습니다. 자료 누락이나 수익 0을 뜻하지 않습니다.</div></div>';
    if (D.ai) h += '<div class="mn-sub" style="margin-bottom:4px">AI·반도체 테마 돈 몫 <b style="color:#76b900">' + pct(D.ai[0]) + '%</b> · 지난 20일 평균 ' + pct(D.ai[1]) + '% (' + sg(D.ai[0] - D.ai[1]) + '%p)</div>';
    D.l.forEach(function(L){
      h += '<div class="mn-ln">' + chip(L[1]) + (L[2] ? '<span style="color:#7f86a8;font-size:11px">+부</span> ' + chip(L[2]) : '') + ' <b>' + E(L[0]) + '</b>'
        + (L[3] ? '<div class="mn-w">근거 ' + E(String(L[3]).replace(/\|/g, ' · ')) + '</div>' : '') + (L[4] ? '<div class="mn-w">종목 ' + E(L[4]) + '</div>' : '') + '</div>';
    });
    return h + '<div class="mn-sub" style="margin-top:6px">꼬리표는 키워드 규칙(분류기 v3.1 · 5개 중 1개쯤 틀릴 수 있음) · 칩에 마우스를 올리면 출처 설명</div></div>';
  }

  function moneyBox(m){
    var R = m.recent || {}, rows = R[S.win] || [], mx = 0;
    rows.forEach(function(r){ mx = Math.max(mx, r[1], r[2] || 0); });
    mx = mx || 1;
    var h = '<div class="mn-box"><div class="mn-hd">💰 최근 출처별 주도주 돈'
      + '<button class="mn-tg' + (S.win === 'w20' ? ' on' : '') + '" onclick="moneyWin(\'w20\')">20일</button><button class="mn-tg' + (S.win === 'w60' ? ' on' : '') + '" onclick="moneyWin(\'w60\')">60일</button></div>'
      + '<div class="mn-sub">' + E(S.win === 'w20' ? R.from20 : R.from60) + ' ~ ' + E(R.to) + ' 캘린더 테마 종목 거래대금 ' + Number((S.win === 'w20' ? R.tot20 : R.tot60) || 0).toLocaleString() + '억 중 몫 · 흰 선 = 4년(2022-06~) 평균 · 원인이 둘이면 반씩</div>';
    h += '<div style="display:grid;grid-template-columns:150px 1fr 92px;gap:4px 8px;align-items:center;margin-top:8px">';
    rows.forEach(function(r){
      var c = COL[r[0]] || '#888', dv = r[2] == null ? null : r[1] - r[2];
      h += '<div>' + chip(r[0]) + '</div><div class="mn-bar"><i style="width:' + (100 * r[1] / mx).toFixed(1) + '%;background:' + c + '"></i>' + (r[2] != null ? '<b style="left:' + (100 * r[2] / mx).toFixed(1) + '%" title="4년 평균 ' + pct(r[2]) + '%"></b>' : '') + '</div>'
        + '<div style="font-size:12px;text-align:right"><b>' + pct(r[1]) + '%</b> <span style="color:' + (dv == null ? '#7f86a8' : dv >= 0 ? '#ff6b6b' : '#6bb7ff') + ';font-size:11px">' + (dv == null ? '' : sg(dv) + 'p') + '</span></div>';
    });
    return h + '</div></div>';
  }

  function hypBox(m){
    var H = m.hyp || {}, F = m.fwd || {}, R = m.ref || {}, me = m.meta || {};
    var h = '<div class="mn-box" style="margin:10px 0"><div class="mn-hd">🧪 사전등록 가설 3개 · 미래 자료로만 판정 <span class="mn-sub">(잠금 ' + E(me.lock_msg || '-') + ' · 전진 ' + E(me.fwd_start) + '부터 ' + (me.fwd_days || 0) + '거래일 · 기록 ' + (me.fwd_logged || 0) + '일 · 1차 점검 ' + E(me.check1_date || '60거래일') + ' = 방향만)</span></div>';
    h += '<div style="overflow:auto"><table class="mn-t"><thead><tr><th style="min-width:110px">가설</th><th style="min-width:230px">사건(전날 밤 미국) → 결과(그날 한국)</th><th style="min-width:200px">표본 안 ' + E(R.기간 || '') + '</th><th style="min-width:200px">전진(미래)</th><th style="min-width:150px">상태</th></tr></thead><tbody>';
    ['H1', 'H2', 'H3'].forEach(function(k){
      var h_ = H[k] || {}, f = F[k] || {}, r = R[k] || {}, need = h_.필요사건 || r.need_n, ref = '', fw = '';
      if (k === 'H1'){
        ref = '사건 ' + (r.n || 0) + '일 · 몫 차이 <b>' + sg(r.mean) + '%p</b> vs 평소 ' + sg(r.base_mean) + '%p · p ' + pv(r.p);
        fw = f.n ? ('평균 <b>' + sg(f.mean) + '%p</b> vs 평소 ' + sg(f.base_mean) + '%p · p ' + pv(f.p)) : '아직 사건 없음';
      } else if (k === 'H2'){
        ref = '사건 ' + (r.n || 0) + '일 · ② 나온 날 <b>' + pct(100 * (r.rate || 0)) + '%</b> vs 평소 ' + pct(100 * (r.base_rate || 0)) + '% (×' + pct(r.ratio, 2) + ')';
        fw = f.n ? ('② 나온 날 <b>' + f.hits + '/' + f.n + '</b> = ' + pct(100 * (f.rate || 0)) + '% vs 평소 ' + pct(100 * (f.base_rate || 0)) + '% · p ' + pv(f.p)) : '아직 사건 없음';
      } else {
        ref = '사건 ' + (r.n || 0) + '일 · 같은 방향 <b>' + pct(100 * (r.rate || 0)) + '%</b> (동전 50%) · 보조: 3일 합 ' + pct(100 * (r.rate3 || 0)) + '% · 다음 이틀만 ' + pct(100 * (r.rate_cont || 0)) + '%';
        fw = f.n ? ('같은 방향 <b>' + f.hits + '/' + f.n + '</b> = ' + pct(100 * (f.rate || 0)) + '% · p ' + pv(f.p) + (f.n3 ? ' · 보조 3일 ' + pct(100 * (f.rate3 || 0)) + '% · 다음 이틀 ' + pct(100 * (f.rate_cont || 0)) + '%' : '')) : '아직 사건 없음';
      }
      var stt = String(f.status || '-'), col = /^통과/.test(stt) ? '#5effd6' : /^불합격|불가/.test(stt) ? '#ff8a8a' : '#ffd166';
      h += '<tr><td><b>' + E(k) + '</b> ' + E(h_.이름 || '') + '</td><td>' + E(h_.사건 || '') + '<br><span style="color:#8fa0d8">→ ' + E(h_.결과 || '') + '</span><br><span class="mn-w">통과 = ' + E(h_.통과 || '') + '</span></td>'
        + '<td>' + ref + '<br><span class="mn-w">1년 사건 ' + pct(r.events_per_year) + '번 · 필요 ' + (need || '-') + '번 ≈ ' + pct(r.months_to_need) + '개월</span></td>'
        + '<td>사건 <b>' + (f.n || 0) + '/' + (need || '-') + '</b><br>' + fw + '</td><td><span class="mn-pill" style="background:rgba(255,255,255,.05);color:' + col + '">' + E(stt) + '</span></td></tr>';
    });
    h += '</tbody></table></div>';
    var evs = [];
    ['H1', 'H2', 'H3'].forEach(function(k){ ((F[k] || {}).events || []).forEach(function(e){ evs.push([e[0], k, e]); }); });
    evs.sort(function(a, b){ return a[0] < b[0] ? 1 : -1; });
    if (evs.length){
      h += '<div class="mn-sub" style="margin-top:6px">최근 전진 사건: ' + evs.slice(0, 8).map(function(x){
        var e = x[2], t = x[1] === 'H1' ? sg(e[2]) + '%p' : x[1] === 'H2' ? (e[2] ? '② 나옴' : '② 없음') : (e[4] ? '같은 방향' : '반대') + '(' + sg(e[2], 2) + '%)';
        return E(x[0]) + ' ' + x[1] + ' ' + E(t);
      }).join(' · ') + '</div>';
    }
    return h + '<div class="mn-sub" style="margin-top:6px">판정은 사건이 필요 수에 처음 닿은 날까지 자료로 한 번만 · 통과해도 "관찰 근거 확인"일 뿐 매수 규칙 아님 · 규칙 = 주도주\\_돈의출처\\사전등록_v1.md</div></div>';
  }

  function t4yBox(m){
    var T = m.t4y || {}, rows = (T.rows || []).slice().sort(function(a, b){ return a.rc - b.rc; });
    if (!rows.length) return '';
    var h = '<details style="margin:10px 0"><summary style="cursor:pointer;color:#8fa0d8;font-size:12.5px">📚 4년 종합표 펼치기 (Step 3~6 · ' + E(T.기간 || '') + ' · 힘·돈·영향 같은 무게 · 표본 안)</summary><div class="mn-box" style="margin-top:6px;max-height:420px;overflow:auto">'
      + '<table class="mn-t"><thead><tr><th>종합</th><th>출처</th><th>돈 몫</th><th>돈 순위</th><th>힘 순위</th><th>영향 순위</th><th>5일 초과(대금10 대비)</th><th>1위 확률</th></tr></thead><tbody>';
    rows.forEach(function(r){
      h += '<tr><td><b>' + r.rc + '</b></td><td>' + chip(r.src) + '</td><td>' + pct(r.money) + '%</td><td>' + r.rm + '</td><td>' + r.rf + '</td><td>' + r.ri + '</td><td style="color:' + (r.exc5 >= 0 ? '#ff6b6b' : '#6bb7ff') + '">' + sg(r.exc5, 2) + '%p</td><td>' + pct(r.p1) + '%</td></tr>';
    });
    var ch = (T.chain || [])[0];
    h += '</tbody></table>' + (ch ? '<div class="mn-sub" style="margin-top:6px">사슬: ' + E(ch.family) + ' 테마 = 주도주 돈의 ' + pct(ch.share_of_all) + '% · 그 돈을 켠 출처 ' + (ch.by_source || []).slice(0, 3).map(function(x){ return E(x[0]) + ' ' + pct(x[1]) + '%'; }).join(' · ') + '</div>' : '')
      + '<div class="mn-sub">상위 4개(⑪·⑭·⑤·①)는 통계로 순서를 못 가름 · ⑪ = 발원지 없는 업종 관성 · 돈 = 그 출처 테마 날 주도주에 들어온 거래대금(출처가 만든 돈 아님)</div></div></details>';
    return h;
  }

  function render(){
    css();
    var sec = ensure(), m = M();
    if (!m){ sec.innerHTML = '<div class="mn-box" style="margin-top:30px">💸 돈의출처 자료 없음 = 주도주\\_돈의출처\\build.py 를 한 번 돌리면 생깁니다</div>'; return; }
    var y = S.y, mo = S.m, data = days(), me = m.meta || {};
    var first = new Date(y, mo, 1).getDay(), nd = new Date(y, mo + 1, 0).getDate();
    var h = '<div class="cal-header" style="margin-top:30px"><div class="cal-nav">'
      + '<button class="nav-btn" onclick="moneyYear(-1)" title="이전 해">&#8249;</button>'
      + '<div class="cal-title" style="min-width:120px;text-align:center">' + y + '년</div>'
      + '<button class="nav-btn" onclick="moneyYear(1)" title="다음 해">&#8250;</button><span class="cal-badge-name" title="이 달력 = 맨 위 [💸 돈의출처] 버튼" onclick="moneyGo()">💸 돈의출처</span></div>'
      + '<div class="cal-right"><button class="today-btn" onclick="moneyLatest()">최신</button>'
      + '<div style="font-size:11.5px;color:#8487bd;margin-left:10px;line-height:1.55">💸 칸 = 그날 캘린더 첫 테마의 출처(칩) + 그날 나온 다른 출처(점) · 노란 테두리 = 전진 기록 날 · 자료 ' + E(me.made || '') + ' · 캘린더 ' + E(me.cal_last || '') + ' · 원문 수신 ' + E(me.source_last || me.cal_last || '') + ' · 미국 ' + E(me.us_last || '') + ' · 관찰용 · 매수추천 아님</div>'
      + '</div></div>';
    h += '<div class="mn-row">' + todayCard(m) + moneyBox(m) + '</div>' + hypBox(m);
    h += '<div class="month-strip">';
    for (var mi = 0; mi < 12; mi++){
      var pre = y + '-' + pad(mi + 1), nv = 0;
      Object.keys(data).forEach(function(k){ if (k.indexOf(pre) === 0) nv++; });
      h += '<button class="ms-btn' + (mi === mo ? ' active' : '') + (nv && mi !== mo ? ' has-data' : '') + '" onclick="moneyGoMonth(' + mi + ')" title="' + (mi + 1) + '월 ' + (nv ? nv + '일' : '자료 없음') + '">' + (mi + 1) + '월</button>';
    }
    h += '</div><div style="display:grid;grid-template-columns:repeat(7,1fr);gap:4px">';
    ['일','월','화','수','목','금','토'].forEach(function(w, i){ h += '<div style="text-align:center;font-size:11px;color:' + (i === 0 ? '#ff6b81' : i === 6 ? '#6bb7ff' : '#8487bd') + '">' + w + '</div>'; });
    for (var i = 0; i < first; i++) h += '<div></div>';
    var cnt = {}, nday = 0;
    for (var d = 1; d <= nd; d++){
      var k = key(y, mo, d), D = data[k];
      if (!D){ h += '<div class="mn-cell"><div style="color:#5b6178">' + d + '</div></div>'; continue; }
      nday++;
      var srcs = {}; D.l.forEach(function(L){ [L[1], L[2]].forEach(function(s){ if (s && s.charAt(0) !== '⓪'){ srcs[s] = 1; cnt[s] = (cnt[s] || 0) + 1; } }); });
      var others = Object.keys(srcs).filter(function(s){ return s !== D.f; });
      var fw = me.fwd_start && k >= me.fwd_start;
      h += '<div class="mn-cell has' + (S.sel === k ? ' sel' : '') + (fw ? ' fwd' : '') + '" onclick="moneyPick(\'' + k + '\')" title="' + E(k) + ' 테마 ' + D.l.length + '줄 · 눌러서 자세히">'
        + '<div style="color:#8487bd">' + d + ' <span style="color:#6f72a8">· ' + D.l.length + '줄</span></div>'
        + (D.f ? '<div style="margin-top:2px">' + chip(D.f) + '</div>' : '<div class="mn-w">분류 안 됨</div>')
        + '<div style="margin-top:2px">' + others.map(function(s){ return '<span class="mn-dot" title="' + E(s + ' ' + nm(s)) + '" style="background:' + (COL[s] || '#888') + '"></span>'; }).join('') + '</div></div>';
    }
    h += '</div><div style="font-size:11px;color:#6f72a8;margin-top:6px">이번 달 ' + nday + '일 · 출처가 나온 날 수: ' + Object.keys(cnt).sort(function(a, b){ return cnt[b] - cnt[a]; }).slice(0, 8).map(function(s){ return s + ' ' + nm(s) + ' ' + cnt[s]; }).join(' · ') + '</div>';
    h += t4yBox(m);
    sec.innerHTML = h;
  }

  function modal(){
    var ov = byId('mn-modal');
    if (!ov){
      ov = document.createElement('div'); ov.id = 'mn-modal';
      ov.style.cssText = 'display:none;position:fixed;inset:0;background:rgba(0,0,0,.7);backdrop-filter:blur(3px);z-index:9990;align-items:center;justify-content:center;padding:24px';
      ov.innerHTML = '<div id="mn-modal-box" style="background:linear-gradient(180deg,rgba(14,26,40,.98),rgba(8,12,24,.98));border:1px solid rgba(34,195,230,.45);border-radius:16px;padding:20px 22px;max-width:980px;width:100%;max-height:92vh;overflow:auto;color:#dce8ff;font-family:\'Noto Sans KR\',sans-serif"></div>';
      ov.onclick = function(e){ if (e.target === ov) ov.style.display = 'none'; };
      document.body.appendChild(ov);
      document.addEventListener('keydown', function(e){ if (e.key === 'Escape' && ov.style.display === 'flex') ov.style.display = 'none'; });
    }
    return ov;
  }

  function dayModal(k){
    var D = days()[k]; if (!D) return;
    var ov = modal(), box = byId('mn-modal-box');
    var h = '<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px"><div><div style="font-size:18px;font-weight:800;color:#fff">💸 ' + E(k) + ' 그날 돈을 켠 출처 <span style="font-size:12px;font-weight:400;color:#8487bd">(테마 ' + D.l.length + '줄 · 관찰용 · 매수추천 아님)</span></div>'
      + (D.ai ? '<div style="font-size:12px;color:#c9cbe8;margin-top:4px">AI·반도체 테마 돈 몫 <b style="color:#76b900">' + pct(D.ai[0]) + '%</b> · 지난 20일 평균 ' + pct(D.ai[1]) + '%</div>' : '')
      + '</div><button onclick="document.getElementById(\'mn-modal\').style.display=\'none\'" style="background:transparent;border:1px solid rgba(255,255,255,.2);color:#dce8ff;border-radius:8px;padding:4px 10px;cursor:pointer">✕</button></div>';
    if (D.coverage === 'NO_GROUP_THEME_CONFIRMED') h += '<div class="mn-sub" style="margin-top:10px">원본 ' + E(D.raw_rows || '') + '행 수신 확인. 개별이슈만 있는 날입니다. 공통 테마 몫은 계산 불가이며 수익 0이나 자료 누락이 아닙니다.</div>';
    h += '<div style="margin-top:10px">' + D.l.map(function(L, i){
      return '<div style="padding:6px 0;border-top:1px dashed rgba(255,255,255,.08);font-size:13px"><span style="color:#6f72a8">' + (i + 1) + '.</span> ' + chip(L[1]) + (L[2] ? ' <span style="color:#7f86a8;font-size:11px">+부</span> ' + chip(L[2]) : '') + ' <b>' + E(L[0]) + '</b>'
        + (L[3] ? '<div style="font-size:11.5px;color:#8fa0d8;margin-top:2px">근거 단어 ' + E(String(L[3]).replace(/\|/g, ' · ')) + '</div>' : '')
        + (L[4] ? '<div style="font-size:11.5px;color:#c9cbe8;margin-top:2px">종목 ' + E(L[4]) + '</div>' : '') + '</div>';
    }).join('') + '</div>';
    h += '<div style="font-size:11px;color:#6f72a8;margin-top:10px">근거 단어·종목은 최근 60일만 실림 · 출처 설명: ' + Object.keys(COL).filter(function(s){ return s.charAt(0) !== '⓪'; }).map(function(s){ return s + ' ' + E(nm(s)); }).join(' · ') + '</div>';
    box.innerHTML = h; ov.style.display = 'flex';
  }

  function init(){ if (!S.y){ var l = latest(), t = l ? new Date(l + 'T00:00:00') : new Date(); S.y = t.getFullYear(); S.m = t.getMonth(); S.sel = l; } }
  window.moneyGo = function(){
    init(); render();
    var sec = byId('sec-money'); if (sec) sec.scrollIntoView({behavior: 'smooth', block: 'start'});
    document.querySelectorAll('.h-nav-btn, .vt-btn').forEach(function(b){ b.classList.toggle('active', b.textContent.indexOf('돈의출처') >= 0); });
  };
  window.moneyYear = function(dy){ init(); S.y += dy; render(); };
  window.moneyGoMonth = function(mi){ init(); S.m = mi; render(); };
  window.moneyLatest = function(){ S.y = 0; init(); render(); };
  window.moneyWin = function(w){ S.win = w; render(); };
  window.moneyPick = function(k){ if (!days()[k]) return; S.sel = k; render(); dayModal(k); };
  // 처음 열 때도 한 번 그린다(2026-10-01 사용자 "달력마다 달이 다 보이게 통일" = 버튼을 안 눌러도 스크롤로 가면 보이게)
  function boot(){ try { if (M()){ init(); render(); } } catch (e){ console.warn('💸 돈의출처 그리기 실패', e); } }
  if (document.readyState === 'complete') boot(); else window.addEventListener('load', boot);
})();
