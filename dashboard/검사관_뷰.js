// 🗣 검사관 토론 섹션 (2026-09-24) = 주도주\_검사관\05_토론엔진\엔진.py 가 만든 dashboard/data/검사관토론_아카이브.js 를 그린다.
// 다른 달력과 완전 분리(자체 컨테이너 #sec-insp · 자체 월 이동 · 자체 상세창). 손으로 데이터 고치지 말 것.
(function(){
  var Y, M, SEL = null;
  // 📚 4년 백테스트 909일(2023-01-03~2026-09-23 · 2026-10-01 사용자 "4년 제대로 채워") = dashboard/data/검사관_백테스트/{YYYY-MM}.js
  //   만든 곳 = _검사관\05_토론엔진\_달력_백테스트_내보내기.py · 기록 하나도 안 줄인 원본 그대로 · 보는 달 파일만 그때 읽는다
  //   같은 날 _기록(●실전·🧪소급)이 있으면 칸은 _기록 · 백테스트는 상세 창 아래 접힌 칸(BTof)
  var BTDIR = 'dashboard/data/검사관_백테스트/', _btBusy = {}, _AC = null, _ACn = -1;
  function A(){
    var R = window.검사관토론_ARCHIVE || {}, B = window.검사관토론_BT || {};
    var n = Object.keys(R).length * 100000 + Object.keys(B).length;
    if (_AC && n === _ACn) return _AC;
    var o = {}, k; for (k in B) o[k] = B[k]; for (k in R) o[k] = R[k];
    _AC = o; _ACn = n; return o;
  }
  function BTof(k){ var R = window.검사관토론_ARCHIVE || {}, B = window.검사관토론_BT || {}; return (R[k] && B[k]) ? B[k] : null; }
  function btLoad(name, src){                                  // 같은 파일은 한 번만 · 실패해도 다시 안 부름(무한 반복 방지)
    if (_btBusy[name]) return; _btBusy[name] = 1;
    var s = document.createElement('script'); s.src = src;
    s.onload = function(){ _btBusy[name] = 2; window.renderInspCalendar(); };
    s.onerror = function(){ _btBusy[name] = 'fail'; console.warn('검사관 백테스트 파일을 못 읽음', src); };
    document.head.appendChild(s);
  }
  function btNeed(y, m){                                       // 목록 → 그 달 파일 순서로 필요한 것만 읽는다
    var L = window.검사관토론_BT_목록;
    if (!L){ btLoad('_목록', BTDIR + '_목록.js?t=' + new Date().getTime()); return; }
    var ym = y + '-' + String(m).padStart(2, '0');
    if (L[ym] && !(window.검사관토론_BT_읽음 || {})[ym]) btLoad(ym, BTDIR + ym + '.js?v=' + encodeURIComponent((window.검사관토론_BT_META || {}).built || ''));
  }
  function esc(s){ return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
  function pct(v, d){ if (v==null || v!==v) return '—'; var n=Number(v); return '<span style="color:'+(n>=0?'#ff8a8a':'#7ea6ff')+'">'+(n>=0?'+':'')+n.toFixed(d==null?2:d)+'%</span>'; }
  function ymd(s){ s=String(s||''); return s.length===8 ? s.slice(0,4)+'-'+s.slice(4,6)+'-'+s.slice(6) : s; }
  function key(y,m,d){ return y+'-'+String(m).padStart(2,'0')+'-'+String(d).padStart(2,'0'); }
  function resOf(rec, code){ var r = rec.result; if(!r) return null; for (var i=0;i<(r.final5||[]).length;i++) if (r.final5[i].code===code) return r.final5[i]; return null; }
  function mark(x){ if(!x) return '<span title="결과 대기">⏳</span>'; if(x.na) return '<span title="거래 없음">∅</span>'; return x.hit ? '<span title="시가 대비 고가 +25% 적중">✅</span>' : '<span style="color:#6b6e9c" title="미적중">·</span>'; }
  function tagIcon(rec){
    if (rec.tag==='백테스트') return '<span title="📚 4년 백테스트 = 같은 엔진을 그날 전날 종가까지 자료로 과거에 다시 돌린 토론 기록('+esc(rec._src||'')+' · 만든 때 '+esc(rec.created||'')+') · 실전 아님" style="color:#ffd166">📚백테스트</span>';
    return rec.tag==='실전' ?'<span title="실전 = 그날 아침 봉인한 예측" style="color:#ff6b81">●실전</span>' : '<span title="소급 = 과거 자료로 다시 만든 참고 기록" style="color:#8487bd">🧪소급</span>'; }
  // 종목 클릭 → 종목 상세창(showStockDetail = 절대값 차트·네이버 차트·기업개요). 증시일정 _chip 과 같은 방식 (2026-09-29)
  function stkAttr(code, name, meta, rank){
    return ' onclick="event.preventDefault();event.stopPropagation();showStockDetail(this)" data-code="'+esc(code)+'" data-name="'+esc(name)+'"'
      +(rank?' data-rank="'+esc(rank)+'"':'')+' data-rate="0" data-amount="0" data-meta="'+esc(meta)+'" data-catalyst="" title="클릭 → 종목 상세(차트·기업개요)"';
  }
  // 🕸 테마 이름 = 맨 위 생태계 구와 같은 국면 점·색 · 누르면 구(2026-09-29 캘린더 검토 ⑦ · 전엔 글자만)
  //   날짜 = 그 예측의 자료일(rec.D = 그날 종가까지 = 미래 안 봄) · _국면 에 없는 이름이면 예전처럼 굵은 글자만
  function thm(name, d){
    var t = esc(name), G = window._국면;
    if (!G || !name) return '<b>' + t + '</b>';
    var p = G.테마(name, d) || G.원문(name, d);
    if (!p || !p.이름) return '<b>' + t + '</b>';
    return (p.c ? G.점(p, 9) : '') + '<b data-th="' + esc(p.이름) + '" onclick="event.stopPropagation();_국면.구로(this.dataset.th)" style="cursor:pointer;border-bottom:1px dotted rgba(255,215,0,.45)" title="🕸 ' + esc(p.이름) + (p.c ? ' · 자료일 ' + esc(ymd(d)) + ' ' + G.글(p) : '') + ' · 누르면 맨 위 생태계 구">' + t + '</b>';
  }
  function stk(code, name, meta, rank){ return '<span'+stkAttr(code, name, meta, rank)+' style="cursor:pointer;border-bottom:1px dotted rgba(255,233,168,.45)">'+esc(name)+'</span>'; }

  function ensureRoot(){
    var root = document.getElementById('sec-insp'); if (!root) return null;
    if (!root.dataset.built){
      root.dataset.built = '1';
      root.style.scrollMarginTop = '80px';   // 위 고정 메뉴줄에 「최근」·📖 버튼이 가리지 않게(2026-10-01 · 📺유튜브 칸과 같은 80px)
      root.innerHTML =
        '<div class="cal-header" style="margin-top:30px"><div class="cal-nav">'
        +'<button class="nav-btn" onclick="inspYear(-1)" title="이전 해">&#8249;</button>'
        +'<div class="cal-title" id="insp-title" style="min-width:120px;text-align:center"></div>'
        +'<button class="nav-btn" onclick="inspYear(1)" title="다음 해">&#8250;</button><span class="cal-badge-name" title="이 달력 = 맨 위 [🗣 검사관] 버튼 · 누르면 그 버튼처럼 이 달력 맨 위로" onclick="setView(\'insp\')">🗣 검사관</span></div>'
        +'<div class="cal-right"><button class="today-btn" onclick="inspToday()">최근</button>'
        +'<button class="today-btn" id="insp-pred-btn" onclick="inspFold(\'pred\')" style="margin-left:6px" title="최근 예측 5종목 · 주도테마 모델 예측을 펼치거나 접는다"></button>'
        +'<button class="today-btn" id="insp-board-btn" onclick="inspFold(\'board\')" style="margin-left:6px" title="4년 백테스트 · 실전/소급 성적표 · 주도테마 조건표를 펼치거나 접는다"></button>'
        +'<button class="today-btn" id="insp-det-btn" onclick="inspFold(\'det\')" style="margin-left:6px" title="날짜별 토론 기록(토론판 · 검사관 12명 의견 · 주도테마 결과)을 펼치거나 접는다 · 달력 칸을 누르면 자동으로 펼친다"></button>'
        +(typeof descBtnHTML === 'function' ? descBtnHTML('insp') : '')+'<div class="cal-desc" data-desc="insp" style="font-size:11.5px;color:#8487bd;margin-left:10px;line-height:1.55">🗣 <b style="color:#5effd6">검사관 토론</b> = 검사관 12명이 전날 종가까지 자료로 후보를 내고 토론 → 의장이 <b>5종목 채택</b> + 이번주·이번달 주도테마 예측 · 칸 = <b style="color:#c9cbe8">예측 대상일(T)</b><br>'
        +'주지표 = <b>T 시가 대비 고가 +25%</b> ✅ · 목표가매도 = 시가 매수 후 +25% 닿으면 매도, 아니면 종가(비용 0.35%p) · ●실전 = 그날 아침 봉인 · 🧪소급 = 과거로 다시 만든 참고 · <span style="color:#ffd166">📚백테스트</span> = 2022-10~2026-09 전 거래일을 같은 엔진으로 과거에 다시 돌린 기록(실전 아님 · 같은 날 소급·실전이 있으면 상세 창 아래) · '
        +'<b style="color:#ff9aaa">매수추천 아님(뼈대 v0.1, 검증 중)</b></div></div></div>'
        +'<div id="insp-top"></div>'
        +'<div class="month-strip" id="insp-month-strip"></div>'   // 1~12월 버튼 = 다른 달력과 같은 ms-btn (2026-10-01 사용자 "달력마다 달이 다 보이게 통일")
        +'<div class="dow-row">'+['일','월','화','수','목','금','토'].map(function(d){return '<div class="dow">'+d+'</div>';}).join('')+'</div>'
        +'<div class="cal-grid" id="insp-grid"></div><div id="insp-detail" style="margin-top:12px"></div>';
    }
    return root;
  }

  function board(){
    var sb = window.검사관성적표 || {}, tb = window.검사관테마성적 || {};
    var h = '';
    var BT = window.검사관백테스트;
    if (BT){
      var ks0 = Object.keys(BT).sort(function(a,b){ return ((BT[b].HO||{}).r5_mean||-99)-((BT[a].HO||{}).r5_mean||-99); });
      h += '<div style="margin:4px 0;font-size:12px;color:#c9cbe8"><b>📚 4년 백테스트 v3 (2022-10~2026-09, '+(((BT['최종5']||{}).ALL||{}).days||'?')+'거래일 · 일봉 이력 2021~ · 과거 수급 포함 · 달력 칸 📚 = 이 기록)</b> <span style="color:#8487bd">학습 ~2025-06 / 확인 2025-07~ · 다음날: 하루적중 = 5개 중 1개 이상 시가대비 +25%, 목표가매도 = +25% 또는 종가 · <b style="color:#ffd166">일주일</b>: 시가 매수 → 5거래일 안 +30% 닿으면 +30%, 아니면 5일째 종가(비용 0.35%p) · 일주일 5일수익 순 정렬</span></div>'
        +'<div style="overflow:auto"><table style="border-collapse:collapse;font-size:11.5px;width:100%"><tr style="color:#8487bd;text-align:right"><th style="text-align:left;padding:3px 6px">누가</th><th>학습 하루적중</th><th>확인 하루적중</th><th>확인 일수</th><th>무작위5</th><th>확인 목표가매도 평균</th><th>중앙값</th><th>상위5%제거</th><th style="color:#ffd166">확인 5일 +30% 종목</th><th style="color:#ffd166">5일 +30% 하루</th><th style="color:#ffd166">확인 5일수익</th><th style="color:#ffd166">중앙값</th><th style="color:#ffd166">학습 5일수익</th></tr>';
      ks0.forEach(function(k){
        var i=BT[k].IS||{}, o=BT[k].HO||{}, nm = k==='B2'?'B2 거래대금상위':(k==='B3'?'B3 전날상한가5':k);
        h += '<tr style="border-top:1px solid rgba(255,255,255,.06);text-align:right;'+(k==='최종5'?'background:rgba(94,255,214,.08);font-weight:700':'')+'"><td style="text-align:left;padding:3px 6px">'+esc(nm)+'</td><td>'+i.day+'%</td><td><b>'+o.day+'%</b></td><td>'+o.days+'</td><td>'+o.B1+'%</td><td>'+pct(o.rtp_mean)+'</td><td>'+pct(o.rtp_med)+'</td><td>'+pct(o.rtp_trim)+'</td><td>'+(o.w30==null?'—':o.w30+'%')+'</td><td>'+(o.w_day30==null?'—':o.w_day30+'%')+'</td><td><b>'+(o.r5_mean==null?'—':pct(o.r5_mean))+'</b></td><td>'+(o.r5_med==null?'—':pct(o.r5_med))+'</td><td>'+(i.r5_mean==null?'—':pct(i.r5_mean))+'</td></tr>';
      });
      h += '</table></div><div style="font-size:10.5px;color:#8487bd;margin:3px 0 8px"><b style="color:#ffd166">이 설명의 괄호 숫자는 옛 v2(2026-09-25 · 909일) 기준 · 위 표 숫자가 v3(2026-10-01)</b> · 시간외 검사관 ="상한가인데 시간외에서 밀린 종목"만 고름(96일·120종목뿐). 이 가설은 전체 기간을 보고 찾은 것이라 앞으로의 실전 기록으로 확인 필요. 차트 분석관 = 상승 뒤 중간(50%) 지킴 + 이평 4쌍 정배열 + 20일선 지지(일주일 신호). 11년 천프정(2015-06~2026-09) 단독: 5일 +30% 6.14%(기대 2.64%, 12/12년 기대 초과) · 5일수익 -0.86% · 다음날 +25%는 0.94%로 약함. 5일수익 종목평균과 날짜평균이 다름(확인 +0.93% vs +0.06%). 매수신호 아님.</div>';
    }
    ['실전','소급'].forEach(function(tag){
      var o = sb[tag]; if (!o) return;
      var ks = Object.keys(o).sort(function(a,b){ return (o[b].day_hit||0)-(o[a].day_hit||0); });
      h += '<div style="margin:8px 0 4px;font-size:12px;color:#c9cbe8"><b>'+(tag==='실전'?'●실전':'🧪소급(참고)')+' 성적표</b> <span style="color:#8487bd">하루적중 = 5개 중 1개 이상 시가대비 +25% · 일주일 = 5거래일 지난 기록만 채점</span></div>'
        +'<div style="overflow:auto"><table style="border-collapse:collapse;font-size:11.5px;width:100%"><tr style="color:#8487bd;text-align:right">'
        +'<th style="text-align:left;padding:3px 6px">누가</th><th>일수</th><th>하루적중</th><th>종목적중</th><th>목표가매도 평균</th><th>중앙값</th><th style="color:#ffd166">일주일 채점일</th><th style="color:#ffd166">5일 +30% 종목</th><th style="color:#ffd166">5일수익 평균</th><th style="color:#ffd166">중앙값</th></tr>';
      ks.forEach(function(k){
        var v=o[k], isB = /^B\d/.test(k), nm = k==='B1'?'B1 무작위5':(k==='B2'?'B2 거래대금상위':(k==='B3'?'B3 전날상한가5':k));
        h += '<tr style="border-top:1px solid rgba(255,255,255,.06);text-align:right;'+(k==='최종5'?'background:rgba(94,255,214,.08);font-weight:700':'')+(isB?'color:#9aa0c8':'')+'">'
          +'<td style="text-align:left;padding:3px 6px">'+esc(nm)+'</td><td>'+v.days+'</td><td>'+(v.day_hit==null?'—':v.day_hit+'%')+'</td><td>'+(v.pick_hit==null?'—':v.pick_hit+'%')+'</td>'
          +'<td>'+(v.rtp_mean==null?'—':pct(v.rtp_mean))+'</td><td>'+(v.rtp_med==null?'—':pct(v.rtp_med))+'</td><td>'+(v.w_days==null?'⏳':v.w_days)+'</td><td>'+(v.w30==null?'—':v.w30+'%')+'</td><td>'+(v.r5_mean==null?'—':pct(v.r5_mean))+'</td><td>'+(v.r5_med==null?'—':pct(v.r5_med))+'</td></tr>';
      });
      h += '</table></div>';
      if (tag==='소급') h += '<div style="font-size:10.5px;color:#8487bd;margin-top:2px">소급 기록(2026-08~09)은 2026-09-25 전에 만들어져 차트 분석관 줄이 옛 규칙(정배열+거래량 2배) 성적임. 새 규칙 성적은 위 4년 백테스트와 9/28부터 쌓이는 실전 기록 참고.</div>';
      var t = tb[tag];
      if (t) h += '<div style="font-size:11px;color:#8487bd;margin-top:4px">주도테마 예측: '
        + (t.week ? '주간 '+t.week.n+'회 · 예측 테마가 실제 상위10 안 '+Math.round(100*t.week.pred_top10/Math.max(1,t.week.pred_k))+'% (기준 "지난5일 상위 그대로" '+Math.round(100*t.week.base_top10/Math.max(1,t.week.base_k))+'%)' : '')
        + (t.month ? ' · 월간 '+t.month.n+'회 · '+Math.round(100*t.month.pred_top10/Math.max(1,t.month.pred_k))+'% (기준 '+Math.round(100*t.month.base_top10/Math.max(1,t.month.base_k))+'%)' : '') + '</div>';
    });
    return h || '<div style="color:#8487bd;font-size:12px">아직 채점된 기록이 없습니다.</div>';
  }

  function leadNote(){
    var lv = ((window.검사관_테마모델||{}).leader_valid||{}).lead; if (!lv) return '';
    return '<br>돈 대장 맞히기(확인구간): 1등 '+lv['모델 1등 적중']+'% · 상위3 '+lv['모델 상위3 적중']+'% (지난주 대장 그대로 '+lv['지난주 대장 1등']+'%, 무작위 '+lv['무작위 1등']+'%)'
      +' · <b style="color:#ff9aaa">대장 = 돈이 몰릴 종목이지 매수추천 아님 (월요일 시가 매수→금요일 종가 평균 +0.2%, 중앙값 -0.8%, 시장평균 +0.4%)</b>';
  }

  function topPanel(){
    var ks = Object.keys(A()).sort(); if (!ks.length) return '<div style="color:#8487bd">기록 없음</div>';
    var rec = A()[ks[ks.length-1]];
    var h = '<div id="insp-pred"><div style="display:grid;grid-template-columns:minmax(300px,1.3fr) minmax(260px,1fr);gap:12px;margin:10px 0 14px">';
    h += '<div style="background:rgba(94,255,214,.06);border:1px solid rgba(94,255,214,.25);border-radius:10px;padding:10px 12px">'
      +'<div style="font-size:13px;font-weight:800;color:#5effd6">최근 예측 '+ymd(rec.T)+' '+tagIcon(rec)+' <span style="font-weight:400;color:#8487bd;font-size:11px">(자료 '+ymd(rec.D)+' 종가까지 · 시장 '+(rec.market.regime_R1?'상승국면':'약세국면')+')</span></div>';
    (rec.debate||[]).slice(0,5).forEach(function(x){
      var r = resOf(rec, x.code);
      h += '<div style="margin-top:6px;font-size:12px;cursor:pointer"'+stkAttr(x.code, x.name, '검사관 토론 '+ymd(rec.T), x.rank)+'>'
        +mark(r)+' <b style="color:#ffe9a8">'+x.rank+'. '+esc(x.name)+'</b> <span style="color:#8487bd">최종 '+x.final+' · 찬성 '+x.n_pro+'명'+(x.con.length?' · <span style="color:#ff9aaa">경고 '+x.con.length+'</span>':'')+'</span>'
        +(r && !r.na ? ' <span style="font-size:11px">시가대비고가 '+pct(r.o_h,1)+' · 목표가매도 '+pct(r.rtp,1)+'</span>' : '')
        +'<div style="font-size:10.5px;color:#9aa0c8;margin-left:18px">'+esc((x.pro[0]||{}).why||'')+'</div></div>';
    });
    h += '<div style="font-size:10.5px;color:#8487bd;margin-top:6px">대형주: '+esc(rec.market.large)+'</div></div>';
    var th = rec.themes||{};
    h += '<div style="background:rgba(255,215,0,.05);border:1px solid rgba(255,215,0,.22);border-radius:10px;padding:10px 12px">';
    var md = th.model || window.검사관_테마모델;
    if (md){
      var vw = (md.valid||{}).week||{}, vm = (md.valid||{}).month||{};
      h += '<div style="font-size:13px;font-weight:800;color:#ffd700">주도테마 모델 예측 <span style="font-size:10.5px;font-weight:400;color:#8487bd">(대상 주 '+esc(md.target_week||'')+' · 4년 검증통과)</span></div>'
        +'<div style="font-size:11px;color:#c9cbe8;margin-top:2px"><b>다음 주 3위 안 확률</b></div>';
      var LD = (window.검사관_테마모델||{}).leaders; LD = (LD && LD.themes) ? LD.themes : {};
      (md.week||[]).forEach(function(t,i){
        h += '<div style="font-size:12px;margin-top:2px">'+(i+1)+'. '+thm(t.t, rec.D)+' <b style="color:#5effd6">'+t.p+'%</b> <span style="font-size:10.5px;color:#9aa0c8">지난주 '+(t['지난주순위']>8?'순위밖':t['지난주순위']+'위')+' · 최근4주 주도기록 '+t['최근4주기록일']+'일 · 과거 주도 '+t['과거주도횟수']+'회 · 상한가·급등 '+t['상한가급등']+'</span></div>';
        var L = LD[t.t]; if (L && L.length) h += '<div style="font-size:10.5px;color:#ffe9a8;margin-left:14px">돈 대장 후보: '+L.map(function(x){ return stk(x.code, x.name, '검사관 돈 대장 후보')+' '+x.p+'%'; }).join(' · ')+'</div>';
      });
      h += '<div style="font-size:11px;color:#c9cbe8;margin-top:6px"><b>한달 주도(4주 중 2주+ 3위 안) 확률</b></div>';
      (md.month||[]).forEach(function(t,i){ h += '<div style="font-size:12px;margin-top:2px">'+(i+1)+'. '+thm(t.t, rec.D)+' <b style="color:#5effd6">'+t.p+'%</b></div>'; });
      h += '<div style="font-size:10.5px;color:#8487bd;margin-top:5px">확인구간(2025~) 적중: 주간 '+(vw['모델 precision@3']||'-')+'% vs 지난주 그대로 '+(vw['지난주top3 그대로']||'-')+'% · 한달 '+(vm['모델 precision@3']||'-')+'% vs '+(vm['지난주top3 그대로']||'-')+'%'+leadNote()+'</div><hr style="border:0;border-top:1px solid rgba(255,255,255,.08);margin:8px 0">';
    }
    h += '<div style="font-size:13px;font-weight:800;color:#ffd700">이번주 주도테마 (검사관 임시규칙)</div>';
    (th.week||[]).forEach(function(t,i){ h += '<div style="font-size:12px;margin-top:3px">'+(i+1)+'. '+thm(t.t, rec.D)+' <span style="font-size:10.5px;color:#9aa0c8">'+esc(t.why)+'</span></div>'; });
    h += '<div style="font-size:13px;font-weight:800;color:#ffd700;margin-top:8px">이번달 주도테마 예측</div>';
    (th.month||[]).forEach(function(t,i){ h += '<div style="font-size:12px;margin-top:3px">'+(i+1)+'. '+thm(t.t, rec.D)+' <span style="font-size:10.5px;color:#9aa0c8">'+esc(t.why)+'</span></div>'; });
    h += '<div style="font-size:10.5px;color:#8487bd;margin-top:6px">'+esc(th.note||'')+'</div></div></div></div>';
    h += '<div id="insp-board"><div style="background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);border-radius:10px;padding:8px 12px;margin-bottom:12px">'+board()+'</div>';
    var TM = window.검사관_테마모델;
    if (TM && TM.conds && TM.conds.length){
      h += '<details style="background:rgba(255,215,0,.04);border:1px solid rgba(255,215,0,.2);border-radius:10px;padding:8px 12px;margin-bottom:12px"><summary style="cursor:pointer;font-size:13px;font-weight:800;color:#ffd700">주도테마가 되는 조건 (캘린더 4년 검증 · 다음 주 3위 안 확률)</summary>'
        +'<div style="font-size:10.5px;color:#8487bd;margin:4px 0">학습 2022-07~2024-12 / 확인 2025-01~ · 배율 = 평소 대비 몇 배 · 한달 = 4주 중 2주 이상 3위 안 · 두 구간 모두 배율 2 이상이면 초록</div>'
        +'<table style="border-collapse:collapse;font-size:11.5px;width:100%"><tr style="color:#8487bd;text-align:right"><th style="text-align:left">조건</th><th>학습 확률</th><th>배율</th><th>확인 확률</th><th>배율</th><th>확인 한달</th><th>확인 건수</th></tr>';
      TM.conds.forEach(function(c){
        var good = (c.IS_lift||0) >= 2 && (c.HO_lift||0) >= 2, bad = (c.IS_lift||9) < 0.7 && (c.HO_lift||9) < 0.7;
        h += '<tr style="border-top:1px solid rgba(255,255,255,.06);text-align:right;'+(good?'color:#5effd6':(bad?'color:#7ea6ff':''))+'"><td style="text-align:left;padding:2px 4px">'+esc(c['조건'])+'</td><td>'+c.IS_p+'%</td><td>'+c.IS_lift+'배</td><td>'+c.HO_p+'%</td><td><b>'+c.HO_lift+'배</b></td><td>'+(c.HO_pm==null?'-':c.HO_pm+'%')+'</td><td>'+c.HO_n+'</td></tr>';
      });
      h += '</table></details>';
    }
    return h + '</div>';
  }

  // 📖 접기·펴기 (2026-10-01 사용자 "검사관 내용이 너무 길어서 보고 싶을 때 볼 수 있게") = 처음엔 접힘 · 이 브라우저에 기억
  //   pred = 최근 예측·주도테마 · board = 성적표 · det = 날짜별 토론 기록 · ★상태는 변수가 진짜(저장소가 막혀도 접기·펴기는 된다)
  var FOLD = {pred:'최근 예측', board:'성적표', det:'토론 기록'}, OPEN = {};
  Object.keys(FOLD).forEach(function(k){ OPEN[k] = false; try { localStorage.removeItem('insp_'+k+'_open'); } catch(e){} });   // ★2026-10-06 사용자 "캘린더 창을 열면 접힌 상태가 기본" = 열 때마다 접힘(펼친 상태를 기억하지 않음)
  function foldSet(k, v){ OPEN[k] = v; }
  function foldApply(){
    Object.keys(FOLD).forEach(function(k){
      var box = document.getElementById(k==='det' ? 'insp-detail' : 'insp-'+k), btn = document.getElementById('insp-'+k+'-btn');
      if (box) box.style.display = OPEN[k] ? '' : 'none';
      if (btn) btn.textContent = (OPEN[k] ? '📕 ' : '📖 ') + FOLD[k] + (OPEN[k] ? ' 접기' : ' 보기');
    });
  }

  function cell(d, k, rec, other, dow){
    var cls='cal-cell'; if(other) cls+=' other-month'; if(dow===0) cls+=' sunday'; if(dow===6) cls+=' saturday';
    var inner = '<div class="cell-day">'+d+'</div>';
    if (rec){
      var hits = 0; ((rec.result||{}).final5||[]).forEach(function(x){ if(x.hit) hits++; });
      inner += '<div style="font-size:9.5px;margin:1px 0 2px">'+tagIcon(rec)+(BTof(k)?' <span title="같은 날 📚백테스트 기록도 있음 = 누르면 상세 창 아래">📚</span>':'')+(rec.result?' <b style="color:'+(hits?'#5effd6':'#6b6e9c')+'">'+hits+'/5</b>':' ⏳')+'</div>';
      (rec.final5||[]).forEach(function(p){
        var r = resOf(rec, p.code);
        inner += '<div style="font-size:10px;line-height:1.35;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:#ffe9a8">'+mark(r)+' '+stk(p.code, p.name, '검사관 토론 '+k)+'</div>';
      });
      var w = ((rec.themes||{}).week||[])[0];
      if (w) inner += '<div style="font-size:9.5px;color:#ffd700;margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">주: '+thm(w.t, rec.D)+'</div>';
    }
    if (!other && dow===6) inner += wkBtn(k);                          // 📅 주간 결산(2026-10-11)
    if (!other && dow===0 && d<=7) inner += moBtn(k.slice(0,7));       // 📆 월간 결산 = 그 달 첫 일요일 1개
    return '<div class="'+cls+'" onclick="inspShow(\''+k+'\')">'+inner+'</div>';
  }

  function detail(k){
    var rec = A()[k], el = document.getElementById('insp-detail'); if (!el) return;
    if (!rec){ el.innerHTML = '<div style="color:#8487bd;font-size:12px">'+k+' 기록 없음</div>'; return; }
    var h = body(k, rec), bt = BTof(k);
    // 같은 날 📚백테스트 기록도 있으면(소급 8/4~9/23 · 실전 9/28~30) = 아래 접힌 칸으로 전부 보인다 · 같은 날이라도 만든 때·자료·규칙이 달라 최종5가 다를 수 있다
    if (bt) h += '<details style="margin-top:10px;background:rgba(255,209,102,.04);border:1px solid rgba(255,209,102,.3);border-radius:10px;padding:8px 10px">'
      +'<summary style="cursor:pointer;font-size:13px;font-weight:800;color:#ffd166">📚 같은 날 4년 백테스트 기록도 있음 — 펼치기 <span style="font-size:11px;font-weight:400;color:#8487bd">(위 기록과 따로 '+esc((bt.created||'').slice(0,10))+' 에 과거로 다시 돌린 것 · 최종5: '
      +(bt.final5||[]).map(function(p){ return esc(p.name); }).join(', ')+')</span></summary><div style="margin-top:8px">'+body(k, bt)+'</div></details>';
    el.innerHTML = h;
  }
  function body(k, rec){
    var h = '<div style="background:rgba(255,255,255,.03);border:1px solid rgba(94,255,214,.25);border-radius:10px;padding:10px 12px">'
      +'<div style="font-size:14px;font-weight:800;color:#5effd6">'+k+' 토론 기록 '+tagIcon(rec)+' <span style="font-size:11px;color:#8487bd;font-weight:400">자료 '+ymd(rec.D)+' · 후보 '+rec.market.pool+'종목 · 봉인 '+esc((rec.sha256||'').slice(0,10))+'… · '+esc(rec.created)+'</span></div>';
    h += '<div style="font-size:12.5px;font-weight:700;margin:8px 0 4px;color:#c9cbe8">① 토론판 (찬성 = 그 종목을 추천한 검사관 · 반대 = 반대 검사관의 경고, 과거 검증 숫자 근거)</div>';
    (rec.debate||[]).forEach(function(x){
      var r = resOf(rec, x.code);
      h += '<details style="margin:3px 0;font-size:12px"'+(x.rank<=5?' open':'')+'><summary style="cursor:pointer">'
        +(x.rank<=5?mark(r)+' ':'')+'<b style="color:'+(x.rank<=5?'#ffe9a8':'#9aa0c8')+'">'+x.rank+'. '+stk(x.code, x.name, '검사관 토론 '+k, x.rank)+'</b> <span style="color:#8487bd">'+esc(x.chair)+'</span>'
        +(r && !r.na ? ' · 결과: 갭 '+pct(r.gap,1)+' 시가대비고가 '+pct(r.o_h,1)+' 목표가매도 '+pct(r.rtp,1) : '')+'</summary>'
        +'<div style="margin-left:16px;font-size:11px;line-height:1.55">';
      x.pro.forEach(function(p){ h += '<div>👍 <b>'+esc(p.who)+'</b> ('+p.score+') '+esc(p.why)+'</div>'; });
      x.con.forEach(function(c){ h += '<div style="color:#ff9aaa">👎 반대 검사관 [-'+c.pen+'] '+esc(c.flag)+': '+esc(c.why)+'</div>'; });
      h += '</div></details>';
    });
    h += '<div style="font-size:12.5px;font-weight:700;margin:10px 0 4px;color:#c9cbe8">② 검사관 12명 각자 의견</div><div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:8px">';
    (rec.inspectors||[]).forEach(function(i){
      h += '<div style="background:rgba(255,255,255,.03);border-radius:8px;padding:6px 8px;font-size:11px;line-height:1.5">'
        +'<b style="color:#5effd6">'+esc(i.name)+'</b> <span style="color:#8487bd">가중 '+i.weight+' · '+esc(i.status)+'</span><div style="color:#8487bd">'+esc(i.role)+'</div>';
      if (i.abstain && !(i.picks||[]).length) h += '<div style="color:#9aa0c8">기권: '+esc(i.abstain)+'</div>';
      (i.picks||[]).slice(0,5).forEach(function(p){ h += '<div>· <b>'+stk(p.code, p.name, '검사관 토론 '+k)+'</b> ('+p.score+') <span style="color:#9aa0c8">'+esc(p.why)+'</span></div>'; });
      var ex = i.extra||{};
      if (ex.note) h += '<div style="color:#9aa0c8">'+esc(ex.note)+'</div>';
      if (ex.data_note) h += '<div style="color:#8487bd">'+esc(ex.data_note)+'</div>';
      (ex.notes||[]).slice(0,4).forEach(function(n){ h += '<div style="color:#9aa0c8">📅 '+esc(n)+'</div>'; });
      h += '</div>';
    });
    h += '</div>';
    var th = rec.themes||{}, tr = rec.theme_result||{};
    h += '<div style="font-size:12.5px;font-weight:700;margin:10px 0 4px;color:#c9cbe8">③ 주도테마 예측과 결과</div><div style="font-size:11.5px;line-height:1.6">';
    ['week','month'].forEach(function(hz){
      var lab = hz==='week'?'이번주(5거래일)':'이번달(20거래일)', res = tr[hz];
      h += '<div><b style="color:#ffd700">'+lab+'</b>: '+(th[hz]||[]).map(function(t,i){
        var rr = res ? (res.pred[i]||{}) : null;
        return thm(t.t, rec.D)+(rr?(' <span style="color:'+(rr.top10?'#5effd6':'#8487bd')+'">['+(rr.rank?rr.rank+'위/'+res.n_themes:'-')+' '+pct(rr.ret,1)+']</span>'):'');
      }).join(' · ')+(res?'<br><span style="color:#8487bd">실제 1~5위: '+res.actual_top5.map(function(a){return thm(a.t, rec.D)+' '+pct(a.ret,1);}).join(' · ')+'</span>':' <span style="color:#8487bd">(결과 대기)</span>')+'</div>';
    });
    h += '</div><div style="font-size:11px;color:#8487bd;margin-top:6px">기준 B2 거래대금상위: '+(rec.baselines.B2_names||[]).map(function(n,i){ return stk((rec.baselines.B2||[])[i], n, '검사관 기준 B2'); }).join(', ')+' · B3 전날상한가5: '+(rec.baselines.B3_names||[]).map(function(n,i){ return stk((rec.baselines.B3||[])[i], n, '검사관 기준 B3'); }).join(', ')+'</div></div>';
    return h;
  }

  // ── 📅 주간 · 📆 월간 결산(2026-10-11 사용자 "검사관 버튼에 연결된 달력에도 넣어줘. 주간, 월간") ──────────────────
  //   자리 = 본 달력 · 📝 채점과 같은 규약(cell-bubble-btn 18px 동그라미 · 칸 오른쪽 위) = 토요일 칸 📅 그 주 월~금 / 그 달 첫 일요일 칸 📆 그 달
  //   마지막 주는 다음 달 토요일 칸(빈 칸)에 📅 를 단다 · 결과는 #insp-detail(칸을 누를 때와 같은 자리)
  //   내용 = 그 기간 칸 기록(A() = ●실전·🧪소급 먼저 · 없으면 📚백테스트)만 · 이 달력의 자 = 최종5 그날(T) 시가 대비 고가 +25% ✅ · 목표가매도(+25% 닿으면 팔고 아니면 종가 · 비용 0.35%p)
  //   ① 최종5 성적(날마다) ② 많이 나온 테마(검사관이 고른 종목의 테마 · 주간 주도테마 예측 1~3위) ③ 검사관이 많이 고른 종목(날마다 그 종목을 고른 검사관 수의 합) · 매수추천 아님
  var PER = null, PER_MORE = false, PER_ORD = 'ni', WDL = ['일','월','화','수','목','금','토'], PHO = {'주':0,'급':1,'살':2,'죽':3,'':4};
  function hasRec(x){ return !!A()[x] || ((window.검사관토론_BT_목록 || {})[x.slice(0,7)] || []).indexOf(x) >= 0; }
  function wkDays(sat){ var p = sat.split('-'), out = []; for (var i=5; i>=1; i--){ var t = new Date(+p[0], +p[1]-1, +p[2]-i); out.push(key(t.getFullYear(), t.getMonth()+1, t.getDate())); } return out; }
  function moDays(ym){ var y = +ym.slice(0,4), m = +ym.slice(5,7), n = new Date(y, m, 0).getDate(), out = []; for (var d=1; d<=n; d++) out.push(key(y, m, d)); return out; }
  function satOf(k){ var p = k.split('-'), t = new Date(+p[0], +p[1]-1, +p[2]); t.setDate(t.getDate() + (6 - t.getDay())); return key(t.getFullYear(), t.getMonth()+1, t.getDate()); }
  function md(k){ return (+k.slice(5,7)) + '/' + (+k.slice(8,10)); }
  function wdOf(k){ var p = k.split('-'); return WDL[new Date(+p[0], +p[1]-1, +p[2]).getDay()]; }
  function phaseOf(code, k){   // 그 종목 테마의 전날 국면(_국면.종목 · 📝 채점 🧮 와 같음)
    var G = window._국면, X = +String(k).replace(/-/g,''), b = (G && typeof G.하루전 === 'function') ? G.하루전(X) : null;
    var p = (G && typeof G.종목 === 'function' && b != null) ? G.종목(code, b) : null;
    return (p && p.이름) ? {th: String(p.이름), c: p.c || '', rk: p.rk || 0} : {th: null, c: '', rk: 0};
  }
  function phTxt(s){ return s.th === null ? '섹터 없음' : ({'주':'주도 '+s.rk+'위','급':'뜨는 '+s.rk+'위','살':'살아있음','죽':'죽음'}[s.c] || '국면 없음'); }
  function phCol(c){ return {'주':'#ff8a8a','급':'#ffd166','살':'#9fd0ff','죽':'#6f72a8'}[c] || '#8487bd'; }
  function avg(a){ return a.length ? a.reduce(function(x,y){ return x+y; }, 0) / a.length : null; }
  function med(a){ if (!a.length) return null; var s = a.slice().sort(function(x,y){ return x-y; }), m = s.length >> 1; return s.length % 2 ? s[m] : (s[m-1] + s[m]) / 2; }
  function bubble(kind, arg, tip){
    return '<button class="cell-bubble-btn" style="' + (kind === 'W' ? 'background:rgba(94,255,214,.16);border-color:rgba(94,255,214,.5);color:#5effd6' : 'background:rgba(255,184,77,.16);border-color:rgba(255,184,77,.5);color:#ffb84d')
      + '" onclick="event.stopPropagation();' + (kind === 'W' ? 'inspWeek' : 'inspMonth') + '(\'' + arg + '\')" title="' + esc(tip) + '">' + (kind === 'W' ? '📅' : '📆') + '</button>';
  }
  function wkBtn(sat){ var w = wkDays(sat); return w.some(hasRec) ? bubble('W', sat, '📅 주간 결산 ' + md(w[0]) + '~' + md(w[4]) + '(월~금) = 검사관 최종5 성적 · 많이 나온 테마 · 많이 고른 종목') : ''; }
  function moBtn(ym){ return moDays(ym).some(hasRec) ? bubble('M', ym, '📆 월간 결산 ' + (+ym.slice(5,7)) + '월 = 검사관 최종5 성적 · 많이 나온 테마 · 많이 고른 종목 · 첫 일요일 1개') : ''; }
  function newS(code, name){ return {code: code, name: name || code, cnt: 0, days: {}, insp: {}, f5: {}, first: null}; }
  function perAgg(P){
    var days = P.kind === 'W' ? wkDays(P.key) : moDays(P.key), recs = [];
    days.forEach(function(k){ var r = A()[k]; if (r) recs.push([k, r]); });
    var tags = {}, F = {days: 0, picks: 0, na: 0, hits: 0, dayHit: 0, rtp: [], pend: 0}, S = {}, PT = {}, TR = {n: 0, top10: 0};
    recs.forEach(function(kr){
      var k = kr[0], rec = kr[1], t = rec.tag || '?', res = (rec.result || {}).final5;
      tags[t] = (tags[t] || 0) + 1;
      if (res && res.length){
        F.days++; var hh = 0;
        res.forEach(function(x){ if (x.na){ F.na++; return; } F.picks++; if (x.hit){ F.hits++; hh++; } if (typeof x.rtp === 'number') F.rtp.push(x.rtp); });
        if (hh) F.dayHit++;
      } else F.pend++;
      (rec.inspectors || []).forEach(function(i){
        (i.picks || []).forEach(function(p){
          if (!p || !p.code) return;
          var s = S[p.code] || (S[p.code] = newS(p.code, p.name));
          s.cnt++; s.days[k] = 1; s.insp[i.name] = (s.insp[i.name] || 0) + 1;
        });
      });
      (rec.final5 || []).forEach(function(p){
        var s = S[p.code] || (S[p.code] = newS(p.code, p.name));
        s.f5[k] = 1; s.days[k] = 1;
        if (!s.first) s.first = {k: k, r: resOf(rec, p.code)};
      });
      ((rec.themes || {}).week || []).slice(0, 3).forEach(function(x, i){ var q = PT[x.t] || (PT[x.t] = {t: x.t, top1: 0, top3: 0}); q.top3++; if (i === 0) q.top1++; });
      var wr = (rec.theme_result || {}).week;
      if (wr && wr.pred) wr.pred.slice(0, 3).forEach(function(x){ TR.n++; if (x && x.top10) TR.top10++; });
    });
    var last = recs.length ? recs[recs.length - 1][0] : null;
    var list = Object.keys(S).map(function(c){ var s = S[c], ph = last ? phaseOf(c, last) : {th: null, c: '', rk: 0}; s.th = ph.th; s.c = ph.c; s.rk = ph.rk; s.nd = Object.keys(s.days).length; s.nf5 = Object.keys(s.f5).length; s.ni = Object.keys(s.insp).length; return s; });
    list.sort(function(a, b){ return (b.cnt - a.cnt) || (b.nf5 - a.nf5) || (b.nd - a.nd) || String(a.name).localeCompare(String(b.name)); });
    var TH = {}, themes = [];
    list.forEach(function(s){ if (s.th === null) return; var t = TH[s.th]; if (!t){ t = TH[s.th] = {th: s.th, c: s.c, rk: s.rk, cnt: 0, ni: 0, n: 0, list: []}; themes.push(t); } t.cnt += s.cnt; t.ni += s.ni; t.n++; t.list.push(s); });
    themes.sort(function(a, b){ return (b.ni - a.ni) || (b.cnt - a.cnt) || (b.n - a.n) || (PHO[a.c] - PHO[b.c]); });   // 테마 = 종목마다 고른 서로 다른 검사관 수의 합 순
    var pt = Object.keys(PT).map(function(t){ return PT[t]; }).sort(function(a, b){ return (b.top1 - a.top1) || (b.top3 - a.top3); });
    return {days: days, recs: recs, tags: tags, F: F, list: list, themes: themes, pt: pt, TR: TR, last: last};
  }
  function perHTML(P){
    var R = perAgg(P), isM = P.kind === 'M', F = R.F, per = isM ? '그 달' : '그 주', lbl = isM ? '월간' : '주간';
    var title = isM ? ('📆 ' + P.key.slice(0,4) + '년 ' + (+P.key.slice(5,7)) + '월 월간 결산') : ('📅 ' + md(R.days[0]) + '(월) ~ ' + md(R.days[4]) + '(금) 주간 결산');
    var close = '<button class="today-btn" onclick="inspPerClose()" style="font-size:12px;padding:2px 10px" title="닫기(Esc · 바깥 누르기)">✕</button>';
    if (!R.recs.length) return '<div style="background:rgba(255,255,255,.03);border:1px solid rgba(94,255,214,.3);border-radius:10px;padding:10px 12px;color:#8487bd;display:flex;justify-content:space-between;gap:10px"><span>🗣 검사관 ' + title + ' · 이 기간 토론 기록이 없다</span>' + close + '</div>';
    var tg = ['실전', '소급', '백테스트'].filter(function(t){ return R.tags[t]; }).map(function(t){ return (t === '실전' ? '●실전 ' : (t === '소급' ? '🧪소급 ' : '📚백테스트 ')) + R.tags[t]; }).join(' · ');
    var nav;
    if (isM){
      var sats = []; R.recs.forEach(function(kr){ var s = satOf(kr[0]); if (sats.indexOf(s) < 0) sats.push(s); });
      nav = '주간 ' + sats.map(function(s){ var w = wkDays(s).filter(function(k){ return A()[k]; }); return '<button class="today-btn" onclick="inspWeek(\'' + s + '\')" style="font-size:11px;padding:1px 8px;margin:0 3px 0 0" title="' + esc(md(w[0]) + '~' + md(w[w.length - 1]) + ' 주간 결산') + '">📅 ' + md(w[0]) + '~' + md(w[w.length - 1]) + '</button>'; }).join('');
    } else {
      nav = '날마다 ' + R.days.map(function(k){ return A()[k] ? '<button class="today-btn" onclick="inspShow(\'' + k + '\')" style="font-size:11px;padding:1px 8px;margin:0 3px 0 0" title="' + k + ' 토론 기록">' + wdOf(k) + ' ' + md(k) + '</button>' : '<span style="font-size:11px;color:#55597f;margin-right:6px">' + wdOf(k) + ' ' + md(k) + ' 기록 없음</span>'; }).join('')
        + ' <button class="today-btn" onclick="inspMonth(\'' + R.last.slice(0,7) + '\')" style="font-size:11px;padding:1px 8px;margin-left:4px" title="이 주가 든 달 결산">📆 ' + (+R.last.slice(5,7)) + '월 결산</button>';
    }
    var h = '<div style="background:rgba(255,255,255,.03);border:1px solid rgba(94,255,214,.3);border-radius:10px;padding:10px 12px">'
      + '<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px"><div style="font-size:15px;font-weight:800;color:#5effd6">🗣 검사관 ' + title + ' <span style="font-size:11.5px;font-weight:400;color:#8487bd">토론 ' + R.recs.length + '일(' + tg + ')</span></div>' + close + '</div>'
      + '<div style="font-size:11.5px;color:#c9cbe8;margin-top:4px;line-height:1.9">' + nav + '</div>';
    var hp = F.picks ? (100 * F.hits / F.picks).toFixed(1) : null;
    h += '<div style="font-size:12.5px;font-weight:700;margin:8px 0 4px;color:#c9cbe8">① 최종5 성적 <span style="font-weight:400;color:#8487bd;font-size:11px">(이 달력의 자 = 그날 시가 대비 고가 +25% ✅ · 목표가매도 = +25% 닿으면 팔고 아니면 종가 · 비용 0.35%p)</span></div>'
      + '<div style="font-size:12px;line-height:1.7">채점된 날 ' + F.days + '일 · 종목 ' + F.picks + '개' + (F.na ? '(거래 없음 ' + F.na + ')' : '') + ' · <b style="color:#5effd6">✅ ' + F.hits + '개</b>' + (hp != null ? '(' + hp + '%)' : '') + ' · 하루적중(5개 중 1개 이상) ' + F.dayHit + '/' + F.days + '일 · 목표가매도 평균 ' + pct(avg(F.rtp), 2) + ' · 중앙 ' + pct(med(F.rtp), 2) + (F.pend ? ' · ⏳ 결과 대기 ' + F.pend + '일' : '') + '</div>';
    h += '<div style="overflow:auto;' + (isM ? 'max-height:300px;' : '') + 'margin-top:4px"><table style="border-collapse:collapse;font-size:11.5px;width:100%"><tr style="color:#8487bd;text-align:left"><th style="padding:3px 6px">날</th><th>기록</th><th>✅</th><th>목표가매도 평균</th><th>최종5</th><th>주간 주도테마 예측 1위</th></tr>';
    R.recs.forEach(function(kr){
      var k = kr[0], rec = kr[1], res = (rec.result || {}).final5, hh = 0, rv = [], w = ((rec.themes || {}).week || [])[0];
      (res || []).forEach(function(x){ if (x.hit) hh++; if (!x.na && typeof x.rtp === 'number') rv.push(x.rtp); });
      h += '<tr style="border-top:1px solid rgba(255,255,255,.06)"><td style="padding:3px 6px;white-space:nowrap"><span onclick="inspShow(\'' + k + '\')" style="cursor:pointer;color:#c9cbe8;border-bottom:1px dotted #6f72a8">' + wdOf(k) + ' ' + md(k) + '</span></td>'
        + '<td style="white-space:nowrap">' + tagIcon(rec) + '</td><td>' + (res && res.length ? '<b style="color:' + (hh ? '#5effd6' : '#6b6e9c') + '">' + hh + '/5</b>' : '⏳') + '</td><td>' + (rv.length ? pct(avg(rv), 1) : '—') + '</td>'
        + '<td>' + (rec.final5 || []).map(function(p){ return mark(resOf(rec, p.code)) + ' ' + stk(p.code, p.name, '검사관 ' + lbl + ' 결산 ' + k); }).join(' · ') + '</td><td style="white-space:nowrap">' + (w ? thm(w.t, rec.D) : '—') + '</td></tr>';
    });
    h += '</table></div>';
    var lastD = R.recs[R.recs.length - 1][1].D;
    h += '<div style="font-size:12.5px;font-weight:700;margin:10px 0 4px;color:#c9cbe8">② ' + per + '에 많이 나온 테마</div>'
      + '<div style="font-size:11.5px;line-height:2"><b style="color:#ffd166">검사관이 고른 종목의 테마</b><span style="color:#8487bd">(숫자 = 종목마다 고른 서로 다른 검사관 수의 합)</span> ' + (R.themes.length ? R.themes.slice(0, 10).map(function(t, i){
          return '<span title="' + esc(t.th + ' · 검사관 수 합 ' + t.ni + ' · 고른 수 합 ' + t.cnt + ' · ' + t.n + '종목 · ' + phTxt(t) + ' · 많이 고른 종목: ' + t.list.slice().sort(function(a, b){ return (b.ni - a.ni) || (b.cnt - a.cnt); }).slice(0, 5).map(function(s){ return s.name + ' ' + s.ni + '명'; }).join(', ')) + '" style="display:inline-block;background:#1a2340;border-radius:8px;padding:0 7px;margin:1px 4px 1px 0"><span style="color:#8487bd">' + (i + 1) + '</span> ' + esc(t.th) + ' <b style="color:#ffd166">' + t.ni + '</b> <span style="color:' + phCol(t.c) + ';font-size:10.5px">' + phTxt(t) + '</span></span>';
        }).join('') : '<span style="color:#6f72a8">테마 국면 자료 없음</span>') + '</div>'
      + '<div style="font-size:11.5px;line-height:2"><b style="color:#ffd700">주간 주도테마 예측</b>(날마다 1~3위에 든 횟수) ' + (R.pt.length ? R.pt.slice(0, 8).map(function(q){ return '<span style="display:inline-block;background:#1a2340;border-radius:8px;padding:0 7px;margin:1px 4px 1px 0">' + thm(q.t, lastD) + ' <b style="color:#ffd700">1위 ' + q.top1 + '</b> <span style="color:#8487bd">· 3위 안 ' + q.top3 + '</span></span>'; }).join('') : '<span style="color:#6f72a8">예측 없음</span>')
      + (R.TR.n ? ' <span style="color:#8487bd">· 예측 1~3위가 실제 주간 상위10 안 ' + R.TR.top10 + '/' + R.TR.n + '(' + Math.round(100 * R.TR.top10 / R.TR.n) + '%)</span>' : '') + '</div>';
    var L = R.list.slice().sort(PER_ORD === 'cnt' ? function(a, b){ return (b.cnt - a.cnt) || (b.ni - a.ni) || (b.nf5 - a.nf5) || (b.nd - a.nd) || String(a.name).localeCompare(String(b.name)); }
                                                    : function(a, b){ return (b.ni - a.ni) || (b.cnt - a.cnt) || (b.nf5 - a.nf5) || (b.nd - a.nd) || String(a.name).localeCompare(String(b.name)); });
    var LIM = isM ? 40 : 30, show = PER_MORE ? L : L.slice(0, LIM);
    var otab = function(v, t){ return '<button class="ms-btn' + (PER_ORD === v ? ' active' : '') + '" onclick="inspPerOrd(\'' + v + '\')" style="font-size:11px;padding:1px 9px;margin-left:4px">' + t + '</button>'; };
    h += '<div style="font-size:12.5px;font-weight:700;margin:10px 0 4px;color:#c9cbe8">③ 검사관이 많이 고른 종목 ' + L.length + '개' + otab('ni', '여러 검사관 순') + otab('cnt', '많이 나온 순') + ' <span style="font-weight:400;color:#8487bd;font-size:11px">(여러 검사관 = 그 종목을 고른 서로 다른 검사관 수 · 많이 나온 = 날마다 고른 검사관 수의 합 · 일정·정책 검사관처럼 매일 같은 목록을 내면 많이 나온 쪽이 커짐 · 최종5 = 의장 5종목에 든 날 · 결과 = 최종5에 처음 든 날의 ✅ · 목표가매도)</span></div>'
      + '<div style="overflow:auto;max-height:420px"><table style="border-collapse:collapse;font-size:11.5px;width:100%"><tr style="color:#8487bd;text-align:left"><th style="padding:3px 6px">#</th><th>종목</th><th>검사관 · 고른 수</th><th>나온 날</th><th>최종5</th><th>고른 검사관</th><th>테마 · 강도</th><th>최종5 결과</th></tr>';
    show.forEach(function(s, i){
      var ins = Object.keys(s.insp).sort(function(a, b){ return s.insp[b] - s.insp[a]; }), fr = s.first ? s.first.r : null;
      h += '<tr style="border-top:1px solid rgba(255,255,255,.06)"><td style="padding:3px 6px;color:#8487bd">' + (i + 1) + '</td><td style="white-space:nowrap">' + stk(s.code, s.name, '검사관 ' + lbl + ' 결산 ' + P.key) + '</td>'
        + '<td style="white-space:nowrap"><b style="color:#7ee8ff">' + s.ni + '명</b> <span style="color:#8487bd;font-size:10.5px">· ' + s.cnt + '번</span></td><td>' + s.nd + '일</td><td>' + (s.nf5 ? '<b style="color:#ffe9a8">' + s.nf5 + '일</b>' : '<span style="color:#55597f">—</span>') + '</td>'
        + '<td style="font-size:10.5px;color:#9aa0c8">' + esc(ins.slice(0, 4).map(function(n){ return n.replace(' 검사관', '') + (s.insp[n] > 1 ? '×' + s.insp[n] : ''); }).join(' · ') + (ins.length > 4 ? ' 외 ' + (ins.length - 4) : '')) + '</td>'
        + '<td style="white-space:nowrap">' + esc(s.th || '—') + ' <span style="color:' + phCol(s.c) + ';font-size:10.5px">' + phTxt(s) + '</span></td>'
        + '<td style="white-space:nowrap">' + (s.first ? '<span style="color:#8487bd;font-size:10.5px">' + md(s.first.k) + '</span> ' + mark(fr) + (fr && !fr.na && typeof fr.rtp === 'number' ? ' ' + pct(fr.rtp, 1) : '') : '<span style="color:#55597f">—</span>') + '</td></tr>';
    });
    h += '</table></div>' + (L.length > LIM ? '<div style="margin-top:4px;font-size:11.5px;color:#8487bd">' + (PER_MORE ? '전부 ' + L.length + '종목' : (LIM + 1) + '위 아래 ' + (L.length - LIM) + '종목') + ' <button class="today-btn" onclick="inspPerMore()" style="font-size:11px;padding:1px 9px;margin-left:4px">' + (PER_MORE ? '접기' : '더 보기') + '</button></div>' : '')
      + '<div style="font-size:10.5px;color:#8487bd;margin-top:6px">관찰용 · 매수추천 아님 · 칸 기록 기준(●실전·🧪소급이 있으면 그것 · 없으면 📚백테스트) · 같은 자 채점(+20% / −10% / 20거래일)은 📝 채점의 🗣 검사관 묶음</div></div>';
    return h;
  }
  function pmodal(){   // 📝 채점 날짜 창과 같은 모양의 떠 있는 창(2026-10-11 사용자 "주간, 월간 클릭하면 창이 뜨게 · 채점 달력처럼") · 바깥 누르기·Esc·✕ = 닫기
    var ov = document.getElementById('insp-modal');
    if (!ov){
      ov = document.createElement('div'); ov.id = 'insp-modal';
      ov.style.cssText = 'display:none;position:fixed;inset:0;background:rgba(0,0,0,.7);backdrop-filter:blur(3px);z-index:9990;align-items:center;justify-content:center;padding:24px';
      ov.innerHTML = '<div id="insp-modal-box" style="background:linear-gradient(180deg,rgba(12,26,24,.98),rgba(10,12,24,.98));border:1px solid rgba(94,255,214,.45);border-radius:16px;padding:20px 22px;max-width:1200px;width:100%;max-height:92vh;overflow:auto;color:#dce8ff;font-family:\'Noto Sans KR\',sans-serif"></div>';
      ov.onclick = function(e){ if (e.target === ov) window.inspPerClose(); };
      document.body.appendChild(ov);
      document.addEventListener('keydown', function(e){ if (e.key === 'Escape' && ov.style.display === 'flex' && !(document.getElementById('stock-modal-overlay') || {}).offsetParent) window.inspPerClose(); });
    }
    return ov;
  }
  function pmodalOpen(){ var ov = document.getElementById('insp-modal'); return !!(ov && ov.style.display === 'flex'); }
  function perShow(keepScroll){
    if (!PER) return;
    var ov = pmodal(), box = document.getElementById('insp-modal-box'), st = box.scrollTop;
    try { box.innerHTML = perHTML(PER); } catch(e){ box.innerHTML = '<div style="color:#ff9aaa;font-size:12px">결산 그리기 실패: ' + esc(e && e.message) + '</div>'; console.warn('🗣 검사관 결산', e); }
    ov.style.display = 'flex'; box.scrollTop = keepScroll ? st : 0;
  }
  window.inspPerClose = function(){ var ov = document.getElementById('insp-modal'); if (ov) ov.style.display = 'none'; PER = null; };
  function perOpen(P){   // 📚 그 기간 백테스트 달 파일을 먼저 읽고(같은 파일 한 번만 · 8초 넘으면 있는 것으로) 그린다
    PER = P; PER_MORE = false;
    var ov0 = pmodal(); document.getElementById('insp-modal-box').innerHTML = '<div style="color:#8487bd;font-size:13px">🗣 검사관 ' + (P.kind === 'M' ? '📆 월간' : '📅 주간') + ' 결산 여는 중… (그 기간 📚 백테스트 자료를 받는 중이면 몇 초)</div>'; ov0.style.display = 'flex';
    var days = P.kind === 'W' ? wkDays(P.key) : moDays(P.key), ms = [], t0 = Date.now();
    days.forEach(function(k){ var ym = k.slice(0,7); if (ms.indexOf(ym) < 0) ms.push(ym); });
    (function tick(){
      var BL = window.검사관토론_BT_목록, RD = window.검사관토론_BT_읽음 || {};
      if (!BL) btLoad('_목록', BTDIR + '_목록.js?t=' + new Date().getTime());
      else ms.forEach(function(ym){ if ((BL[ym] || []).length && !RD[ym]) btLoad(ym, BTDIR + ym + '.js?v=' + encodeURIComponent((window.검사관토론_BT_META || {}).built || '')); });
      var done = !!BL && ms.every(function(ym){ return !(BL[ym] || []).length || RD[ym] || _btBusy[ym] === 'fail'; });
      if (done || _btBusy['_목록'] === 'fail' || Date.now() - t0 > 8000) perShow(); else setTimeout(tick, 250);
    })();
  }
  window.inspWeek = function(sat){ perOpen({kind: 'W', key: sat}); };   // 📅 그 주(월~금) 결산
  window.inspMonth = function(ym){ perOpen({kind: 'M', key: ym}); };    // 📆 그 달 결산
  window.inspPerMore = function(){ PER_MORE = !PER_MORE; perShow(true); };
  window.inspPerOrd = function(v){ PER_ORD = v; perShow(true); };   // ③ 여러 검사관 순('ni') · 많이 나온 순('cnt')
  window.renderInspCalendar = function(){
    var root = ensureRoot(); if (!root) return;
    var ks = Object.keys(A()).sort();
    if (Y==null){ if (ks.length){ Y=+ks[ks.length-1].slice(0,4); M=+ks[ks.length-1].slice(5,7); } else { var n=new Date(); Y=n.getFullYear(); M=n.getMonth()+1; } }
    document.getElementById('insp-title').textContent = Y+'년';
    btNeed(Y, M);                                               // 📚 이 달 백테스트 파일이 아직이면 읽고 다시 그린다
    var st = document.getElementById('insp-month-strip');
    if (st){
      var sh = '', BL = window.검사관토론_BT_목록 || {}, R0 = window.검사관토론_ARCHIVE || {};
      for (var mm=1; mm<=12; mm++){
        var pre = Y+'-'+String(mm).padStart(2,'0'), seen = {};
        Object.keys(R0).forEach(function(k){ if (k.indexOf(pre)===0) seen[k] = 1; });
        (BL[pre]||[]).forEach(function(k){ seen[k] = 1; });     // 아직 안 읽은 달도 목록으로 센다
        var n = Object.keys(seen).length, nb = (BL[pre]||[]).length;
        sh += '<button class="ms-btn'+(mm===M?' active':'')+(n&&mm!==M?' has-data':'')+'" onclick="inspGoMonth('+mm+')" title="'+mm+'월 '+(n?n+'일 토론 기록'+(nb?' (📚백테스트 '+nb+'일 포함)':''):'기록 없음')+'">'+mm+'월</button>';
      }
      st.innerHTML = sh;
    }
    document.getElementById('insp-top').innerHTML = topPanel();
    var first = new Date(Y, M-1, 1).getDay(), dim = new Date(Y, M, 0).getDate(), h='';
    for (var i=0;i<first;i++) h += '<div class="cal-cell other-month"></div>';
    for (var d=1; d<=dim; d++){ var k = key(Y,M,d); h += cell(d, k, A()[k], false, new Date(Y,M-1,d).getDay()); }
    var tot = first+dim, nc = tot%7===0?0:7-tot%7; for (var j=0;j<nc;j++){
      if (j === nc-1){ var ns = new Date(Y, M-1, dim+nc), nk = key(ns.getFullYear(), ns.getMonth()+1, ns.getDate()); h += '<div class="cal-cell other-month" style="opacity:.6"><div class="cell-day" style="color:#55597f">'+(ns.getMonth()+1)+'/'+ns.getDate()+'</div>'+wkBtn(nk)+'</div>'; }   // 마지막 주 📅(다음 달 토요일 칸)
      else h += '<div class="cal-cell other-month"></div>';
    }
    document.getElementById('insp-grid').innerHTML = h;
    if (!SEL && ks.length) SEL = ks[ks.length-1];
    if (SEL) detail(SEL); if (PER && pmodalOpen()) perShow(true);   // 📅📆 결산 창이 떠 있으면 창만 다시 그림(📚 파일이 와서 다시 그릴 때)
    foldApply();
  };
  window.inspFold = function(k){ foldSet(k, !OPEN[k]); foldApply(); };
  window.inspYear = function(s){ Y += s; window.renderInspCalendar(); };
  window.inspGoMonth = function(m){ M = m; window.renderInspCalendar(); };
  window.inspMove = function(s){ M += s; if (M<1){M=12;Y--;} if (M>12){M=1;Y++;} window.renderInspCalendar(); };
  window.inspToday = function(){ Y=null; SEL=null; window.inspPerClose(); window.renderInspCalendar(); };
  window.inspShow = function(k){ window.inspPerClose(); SEL = k; detail(k); foldSet('det', true); foldApply(); var el=document.getElementById('insp-detail'); if (el) el.scrollIntoView({behavior:'smooth', block:'start'}); };
  window.inspGo = function(){ window.renderInspCalendar(); var el=document.getElementById('sec-insp'); if (el) el.scrollIntoView({behavior:'smooth', block:'start'}); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function(){ window.renderInspCalendar(); });
  else window.renderInspCalendar();
})();
