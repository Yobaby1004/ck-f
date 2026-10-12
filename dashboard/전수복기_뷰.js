// 2026-09 +20% 전수 복기 연구판. 기존 채점·봉인은 읽기만 하며, 9월 밖에는 자료 없음.
(function(){
'use strict';
var W=window, D=W.전수복기_9월;
if(W.__censusSepInstalled)return; W.__censusSepInstalled=true;
var state={mode:'calendar',day:'2026-09-01',week:'2026-08-31',filter:'전체',query:''};
function E(x){return String(x==null?'':x).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function n(x){return Number(x||0).toLocaleString('ko-KR');}
function card(title,body){return '<div class="cs-card"><h3>'+E(title)+'</h3>'+body+'</div>';}
function button(label,fn,active){return '<button type="button" class="cs-btn'+(active?' active':'')+'" onclick="'+fn+'">'+E(label)+'</button>';}
function counts(ds){var a={h:0,c:0,s:0,all:0};ds.forEach(function(d){var x=D.daily[d];if(x){a.h+=x.high_n;a.c+=x.close_n;a.s+=x.same_open_seal;a.all+=x.same_any;}});return a;}
function sentence(a){return '장중 +20% '+n(a.h??a.high_n)+'건 · 종가 +20% '+n(a.c??a.close_n)+'건 · 당일 정시 봉인 '+n(a.s??a.sealed_n??a.same_open_seal)+'건 · 채점에 줄 있음 '+n(a.all??a.any_n??a.same_any)+'건(소급 포함)';}
function header(){return '<div class="cs-head"><h2>전수 복기 · 2026년 9월</h2>'+button('일간 달력','censusCalendar()',state.mode==='calendar')+button('주간 보고서','censusWeekly()',state.mode==='weekly')+button('월간 보고서','censusMonthly()',state.mode==='monthly')+button('채점 달력으로','censusGrade()',false)+'</div><p class="cs-warning">'+E(D.warning)+' 기준: '+E(D.basis)+' · 한 종목이 여러 날 오르면 날짜마다 1건. 관련 테마는 당일 장마감 자료이므로 아침 예측 근거가 아닙니다.</p>';}
function dailyButton(day){var r=D.daily[day];return '<button class="cs-day-btn" type="button" onclick="censusDaily(\''+day+'\')">일간 보고서</button><div class="cs-mini">장중 '+n(r.high_n)+' · 종가 '+n(r.close_n)+'<br>정시 '+n(r.same_open_seal)+' · 목록 '+n(r.same_any)+'</div>';}
function calendar(){var dates=Object.keys(D.daily).sort(), shift=(new Date('2026-09-01T12:00:00Z').getUTCDay()+6)%7, h='<div class="cs-calendar">';['월','화','수','목','금','토','일'].forEach(function(x){h+='<div class="cs-weekday">'+x+'</div>';});for(var i=0;i<shift;i++)h+='<div class="cs-empty"></div>';for(var d=1;d<=30;d++){var date='2026-09-'+('0'+d).slice(-2);h+='<div class="cs-date"><b>'+d+'</b>'+(D.daily[date]?dailyButton(date):'<small>휴장/주말</small>')+'</div>';}h+='</div>';return card('9월 거래일 '+dates.length+'일 · '+sentence(D.totals),h)+'<p class="cs-note">정시 포착은 봉인과 시가 신호가 둘 다 확인된 경우만 표시합니다. 이 달의 과거 재현 목록은 정시 포착에 넣지 않았습니다.</p>';}
function detail(w){var h='<p><b>놓친 경로:</b> '+E(w.why)+'</p><p><b>확인한 힌트:</b> '+E(w.hint)+'</p>';
if(w.today.length)h+='<p><b>당일 채점 목록:</b> '+w.today.map(function(x){return E(x[0])+' ('+(x[1]?'종가':'시가')+', '+(x[2]?'정시':'소급/미봉인')+')';}).join(' · ')+'</p>';
if(w.prior.length)h+='<p><b>지난 5거래일 목록:</b> '+w.prior.map(function(x){return E(x[0]+' '+x[1])+' ('+(x[2]?'정시':'소급/미봉인')+')';}).join(' · ')+'</p>';
if(w.events.length)h+='<p><b>전 거래일 매매일 흔적:</b> '+w.events.map(function(x){return E(x[0]+' '+x[1]+(x[2]?' / '+x[2]:'')+(x[3]?' / '+x[3]:''));}).join('<br>')+'</p>';
if(w.news.length)h+='<p><b>장전뉴스 파일 언급(원문 시각 미검증, 포착 판정 제외):</b> '+w.news.map(function(x){return E(x[0]+' '+x[2]+' · '+x[1]);}).join(' · ')+'</p>';
if(w.inspector.length)h+='<p><b>검사관 기록:</b> '+w.inspector.map(function(x){return E(x[0]+' ['+x[2]+'] '+x[1]);}).join('<br>')+'</p>';
if(w.after.length)h+='<p><b>당일 장마감 설명(사전 힌트 아님):</b> '+w.after.map(function(x){return E(x[0]+' '+x[1]+(x[2]?' / '+x[2]:'')+(x[3]?' / '+x[3]:''));}).join('<br>')+'</p>';
h+='<p class="cs-note">개선 실험 후보: 같은 단서가 있던 비급등 종목까지 비교. 선별조건·추천 수·진입가격·비용을 고정하기 전에는 효과 미확정.</p>';return h;}
function clueTable(days){var items={};days.forEach(function(d){var day=D.daily[d];if(!day)return;(day.clue_tests||[]).forEach(function(x){var y=items[x.source]||(items[x.source]={n:0,h:0});y.n+=x.candidate_n;y.h+=x.hit_n;});});var h='<div class="cs-table-wrap"><table class="cs-table"><thead><tr><th>전날 흔적(연구 분모)</th><th>전체 후보</th><th>다음 날 +20%</th><th>오르지 않은 후보</th><th>비율</th></tr></thead><tbody>';Object.keys(items).forEach(function(k){var x=items[k];h+='<tr><td>'+E(k)+'</td><td>'+n(x.n)+'</td><td>'+n(x.h)+'</td><td>'+n(x.n-x.h)+'</td><td>'+(x.n?(100*x.h/x.n).toFixed(1)+'%':'—')+'</td></tr>';});return '<p class="cs-note">아래는 전날 언급 종목 전체를 분모로 셈한 사후 연구입니다. 원천 입력 시각·매수 가능성·비용 미검증, 신호로 사용 금지.</p>'+h+'</tbody></table></div>';}
function dayView(day){var a=D.daily[day];if(!a)return card('자료 없음','9월 거래일 자료가 없습니다.');var options=['전체','채점 목록 미포착','5거래일 안 과거 목록에 흔적','당일 소급/미봉인','당일 종가 신호(아침 아님)','당일 정시 봉인'];
var hs='<div class="cs-toolbar">'+button('9월 달력','censusCalendar()',false)+'<select id="cs-filter" onchange="censusFilter()">'+options.map(function(x){return '<option value="'+E(x)+'"'+(state.filter===x?' selected':'')+'>'+E(x)+'</option>';}).join('')+'</select><input id="cs-search" placeholder="종목·코드·테마 찾기" value="'+E(state.query)+'" oninput="censusFilter()"></div>';
var rows=a.w.filter(function(w){return (state.filter==='전체'||w.status===state.filter)&&(!state.query||[w.n,w.c,w.status].concat(w.themes).join(' ').toLowerCase().includes(state.query.toLowerCase()));});
hs+='<p class="cs-note">가격 확인 '+n(a.price_n)+'종목 · 캐시 내 이날 봉 없음 '+n(a.unpriced_cache_n)+'종목(거래봉 종료 '+n((a.coverage||{})['거래봉 종료']||0)+' · 중간 결측/정지 '+n((a.coverage||{})['중간 결측/정지']||0)+' · 상장전 '+n((a.coverage||{})['상장전']||0)+') · 시가부터 +20% '+n(a.gap20_n)+'건(정시 명단 중 '+n(a.sealed_gap20_n)+'건) · 전일 거래봉이 전 시장거래일이 아닌 대상 '+n(a.stale_n)+'건 · 화면 '+n(rows.length)+'/'+n(a.w.length)+'건. 시가부터 오른 종목은 체결 가능성 미확인, 가격 없는 종목을 ‘오르지 않음’으로 세지 않습니다.</p>';
hs+='<h3>전날 힌트의 전체 후보 대조</h3>'+clueTable([day]);
hs+='<h3>당일 +20% 전종목</h3><div class="cs-table-wrap"><table class="cs-table"><thead><tr><th>종목</th><th>테마</th><th>고가/전일종가</th><th>종가/전일종가</th><th>시가/전일종가</th><th>포착 구분·근거</th></tr></thead><tbody>';
rows.forEach(function(w){hs+='<tr><td><b>'+E(w.n)+'</b><br><small>'+E(w.c)+' · '+E(w.t)+'</small></td><td>'+E(w.themes.join(' · '))+'</td><td>+'+E(w.h)+'%</td><td>'+(w.r>=20?'<b>':'')+(w.r>=0?'+':'')+E(w.r)+'%'+(w.r>=20?'</b>':'')+'</td><td>'+(w.o>=0?'+':'')+E(w.o)+'%</td><td><details><summary>'+E(w.status)+(w.stale?' · 이전 봉 날짜 주의':'')+'</summary><div class="cs-detail">'+detail(w)+'</div></details></td></tr>';});hs+='</tbody></table></div>';
return card(day+' · '+sentence({h:a.high_n,c:a.close_n,s:a.same_open_seal,all:a.same_any}),hs);}
function themeSummary(days){var c={},statuses={};days.forEach(function(d){(D.daily[d]||{w:[]}).w.forEach(function(w){(w.themes||[]).forEach(function(t){c[t]=(c[t]||0)+1;});statuses[w.status]=(statuses[w.status]||0)+1;});});
var top=Object.entries(c).sort(function(a,b){return b[1]-a[1];}).slice(0,12);return '<p><b>포착 경로:</b> '+Object.entries(statuses).map(function(x){return E(x[0])+' '+n(x[1])+'건';}).join(' · ')+'</p><p><b>장마감 테마 분류 상위:</b> '+top.map(function(x){return E(x[0])+' '+n(x[1])+'건';}).join(' · ')+'</p><p class="cs-note">테마는 장마감 자료의 종목 연결이 있는 경우만 사용합니다. 미분류는 20% 전수에서 빼지 않았습니다.</p>';}
function weekly(){var keys=Object.keys(D.weekly).sort(),h='<p>주간 합계는 9월 안에 들어온 거래일만 합칩니다. 8월 31일 시작 주는 9월 1일부터 집계합니다.</p>';
keys.forEach(function(k){var w=D.weekly[k], a=counts(w.days);h+='<div class="cs-week"><h3>'+E(w.days[0])+' ~ '+E(w.days[w.days.length-1])+' ('+w.days.length+'거래일)</h3><p>'+E(sentence(a))+' · 서로 다른 종목 '+n(w.codes)+'개</p>'+themeSummary(w.days)+clueTable(w.days)+'<div class="cs-toolbar">'+w.days.map(function(d){return button(d.slice(5)+' 일간','censusDaily(\''+d+'\')',false);}).join('')+'</div></div>';});return card('주간 보고서 · 9월 5개 주',h);}
function monthly(){var ds=Object.keys(D.daily).sort(),h='<div class="cs-highlight">'+E(sentence(D.totals))+' · 서로 다른 종목 '+n(D.totals.unique_codes)+'개 · 비교한 매매법 '+n(D.totals.methods)+'개 · 시가부터 +20% '+n(D.totals.gap20_n)+'건(정시 명단 중 '+n(D.totals.sealed_gap20_n)+'건, 체결 미확인)</div>'+themeSummary(ds)+clueTable(ds);
h+='<div class="cs-table-wrap"><table class="cs-table"><thead><tr><th>거래일</th><th>장중 +20%</th><th>종가 +20%</th><th>정시 봉인</th><th>당일 채점 줄(소급 포함)</th><th>보고서</th></tr></thead><tbody>';
ds.forEach(function(d){var a=D.daily[d];h+='<tr><td>'+E(d)+'</td><td>'+n(a.high_n)+'</td><td>'+n(a.close_n)+'</td><td>'+n(a.same_open_seal)+'</td><td>'+n(a.same_any)+'</td><td>'+button('일간 보기','censusDaily(\''+d+'\')',false)+'</td></tr>';});
h+='</tbody></table></div><p class="cs-note">개선 검증: ① 기존 목록에서 강한 신호가 최종 선택에서 빠진 날, ② 전날 테마에서 후발주를 잇지 못한 날, ③ 후보 자체에 없던 날을 따로 묶어 같은 신호의 비급등 종목까지 대조. 9월 자료만으로 규칙 채택 금지.</p>';return card('월간 보고서 · '+n(ds.length)+'거래일',h);}
function ensure(){var sec=document.getElementById('sec-census');if(!sec){sec=document.createElement('section');sec.id='sec-census';sec.className='cs-section';var grade=document.getElementById('sec-grade');if(grade)grade.insertAdjacentElement('afterend',sec);else (document.querySelector('main')||document.body).appendChild(sec);}return sec;}
function paint(){var s=ensure();s.innerHTML=header()+(state.mode==='daily'?dayView(state.day):state.mode==='weekly'?weekly():state.mode==='monthly'?monthly():calendar());s.style.display='block';return s;}
W.censusGo=function(){document.querySelectorAll('.h-nav-btn').forEach(function(b){b.classList.remove('active');});var b=document.getElementById('nav-census');if(b)b.classList.add('active');var s=paint();s.scrollIntoView({behavior:'smooth',block:'start'});};
W.censusCalendar=function(){state.mode='calendar';state.filter='전체';state.query='';W.censusGo();};
W.censusDaily=function(d){state.mode='daily';state.day=d;state.filter='전체';state.query='';W.censusGo();};
W.censusWeekly=function(){state.mode='weekly';W.censusGo();};
W.censusMonthly=function(){state.mode='monthly';W.censusGo();};
W.censusGrade=function(){if(typeof W.gradeGo==='function')W.gradeGo();};
W.censusFilter=function(){state.filter=document.getElementById('cs-filter').value;state.query=document.getElementById('cs-search').value;var sec=ensure(),start=sec.scrollTop;sec.innerHTML=header()+dayView(state.day);sec.scrollTop=start;var input=document.getElementById('cs-search');if(input){input.focus();input.setSelectionRange(input.value.length,input.value.length);}};
if(!D)W.censusGo=function(){alert('9월 전수 복기 자료가 없습니다. _천억장부/전수복기_9월.py 확인');};
})();
