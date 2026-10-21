/* 원천·버튼·소비 경계를 함께 표시. 종목·봉인·매매규칙을 바꾸지 않는다. */
(function(){
'use strict';
function e(x){return String(x==null?'':x).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function render(){
 var d=window.DAILY_LINKAGE;if(!d)return;
 var root=document.getElementById('daily-linkage');
 if(!root){root=document.createElement('section');root.id='daily-linkage';root.setAttribute('aria-label','매일 원천과 연결 상태');var main=document.querySelector('main');if(!main)return;main.insertBefore(root,main.firstChild);}
 var r=d.readiness||{},cs=d.consumers||{},h=cs.hermes||{},o=cs.obsidian||{},dt=d.date_contract||{},issues=d.blocked||[],nr=d.note_delivery||[];
 var html='<details style="margin:12px 0;padding:12px 14px;border:1px solid #735b4d;border-radius:10px;background:rgba(120,88,40,.08);font-size:13px;line-height:1.65">';
 html+='<summary style="cursor:pointer;font-weight:700">일일 연결 · 장마감 '+e(d.D)+' → 장전 '+e(d.T)+' · 가격묶음 '+e(r.registered_price_groups_ready)+'/'+e(r.registered_price_groups_total)+' · '+(issues.length?'미해결 '+issues.length+'건':'현재 점검 대상 확인')+'</summary>';
 html+='<div style="margin-top:9px">원천: '+Object.keys(d.source_counts||{}).map(function(k){return e(k)+' '+e(d.source_counts[k])+'행';}).join(' · ')+' · 장전뉴스 '+(d.premarket_present?'있음':'미확인')+'</div>';
 var q=d.source_quality||{};
 if(dt.expected_closed_day&&dt.expected_closed_day!==d.D)html+='<div style="color:#e2ab83">사후 수리 범위 '+e(d.D)+' · 현재 기대 완료일 '+e(dt.expected_closed_day)+'와 구분합니다. 옛 자료를 새 다음날 준비로 표시하지 않습니다.</div>';
 html+='<div style="color:#e2ab83"><b>일봉 엄격검증</b>: '+(q.verified?'해당 날짜 행/명시 무거래 확인':'대기')+' · 날짜 행 '+e(q.local_target_rows==null?'미확인':q.local_target_rows)+' · 명시 거래량0 '+e(q.confirmed_no_trade==null?'미확인':q.confirmed_no_trade)+' · 공식 상폐 '+e(q.confirmed_inactive==null?'미확인':q.confirmed_inactive)+' · 미확정 '+e(q.unknown==null?'미확인':q.unknown)+'. 날짜가 최신이어도 자료 완전성과는 다릅니다.</div>';
 html+='<div style="color:#c7ae8a">등록 가격묶음 비율 '+e(r.price_group_percent)+'%는 진단값입니다. 전체 준비 95% 달성이나 선정 성능을 뜻하지 않습니다.</div>';
 html+='<div>마스터·급등 재사용 검증: '+Object.keys(r.compute_reuse_verified_now||{}).map(function(k){return e(k)+' '+(r.compute_reuse_verified_now[k]?'입출력 일치':'재검사 필요');}).join(' · ')+'</div>';
 html+='<div style="overflow:auto;max-height:410px;margin-top:8px"><table style="border-collapse:collapse;width:100%;min-width:660px;text-align:left"><thead><tr><th>기능</th><th>자료일</th><th>기대일</th><th>확인 상태와 한계</th></tr></thead><tbody>';
 (d.buttons||[]).forEach(function(x){html+='<tr style="border-top:1px solid rgba(255,255,255,.09)"><td style="padding:5px">'+e(x.k)+'</td><td>'+e(x.d||'미확인')+'</td><td>'+e(x.기대||'수동 입력')+'</td><td>'+e(x.판정)+' '+e(x.비고||'')+'</td></tr>';});
 html+='</tbody></table></div>';
 html+='<div style="margin-top:8px"><b>남은 문제</b><ul style="margin:3px 0">'+issues.map(function(x){return '<li>'+e(x.item)+': '+e(x.reason)+'</li>';}).join('')+'</ul></div>';
 html+='<div><b>기존 고정 연구</b>: '+e(h.latest||'미확인')+'까지 과거 재생 표시. 이 판의 일일 외부근거 학습 연결과 중단 연구는 그대로 보존합니다.</div>';
 var v2=window.DAILY_CONTEXT3;
 if(v2){
  var c=v2.current,s=c&&c.source||{};
  html+='<section id="daily-context3" aria-label="별도 근거 비교 3" style="margin:12px 0;padding:12px;border:1px solid #588570;border-radius:8px;overflow-wrap:anywhere">';
  html+='<b style="font-size:15px">별도 근거 비교 3 · '+e(v2.D)+' → '+e(v2.T)+'</b>';
  if(c){
   html+='<div>실자료 입력·독립 재독 확인 · 관찰 3개씩 봉인. 기존 고정 연구와 다른 새 판입니다.</div>';
   html+='<div>가격 '+e(c.D)+' · 장마감 원문 최신 '+e(s.latest_eod||'미수신')+' · 수신 장전원문 최신 '+e(s.latest_premarket||'미수신')+'. 예전 원문은 실제 날짜의 문맥이며 오늘 뉴스로 바꾸지 않습니다.</div>';
   html+='<div>등록 '+e(c.registered_count)+'개 중 명시 후보 '+e(c.eligible_count)+'개 · 제외 '+e(c.excluded_count)+'개. 시장 전체 포괄성 증명은 아닙니다.</div>';
   [['WITH_CONTEXT','출처문맥 추가'],['PRICE_ONLY','같은 가격만 비교'],['PRIOR_TURNOVER_TOP3','전일 거래대금 단순 비교']].forEach(function(a){
    html+='<div style="padding:5px 0"><b>'+a[1]+'</b>: '+((c.picks||{})[a[0]]||[]).map(function(x){return e(x.name)+' <span style="opacity:.7">('+e(x.code)+')</span>';}).join(' · ')+'</div>';
   });
   html+='<div>초기 하루 사후 학습 '+e(c.model_trained_rows)+'사례 · 음성/양성 '+e((c.classes||[]).join('/'))+' · 의미어 원문이 붙은 후보 '+e(s.eligible_rows_with_semantic_quotes||0)+'개.</div>';
   html+='<div style="color:#d6b381">'+(c.conditioned_two_class_model?'점수는 검증되지 않은 통계치입니다.':'양쪽 정답 사례가 아직 부족해 조건부 의미 점수를 주장하지 않습니다.')+' 선정 개선·매수 권고·실현 수익·전체 준비 95% 달성은 미검증입니다.</div>';
   html+='<div style="font-size:11px;opacity:.75">봉인 '+e(c.sealed_at)+' · 입력 '+e(c.input_sha256.slice(0,16))+' · 실제 벡터 '+e(c.actual_vector_sha256.slice(0,16))+' · 모형 '+e(c.model_sha256.slice(0,16))+'</div>';
  }else html+='<div>입력 대기. 빈칸을 정상 0이나 과거 명단으로 채우지 않습니다.</div><div>'+e(v2.reason||v2.state)+'</div>';
  html+='<div style="font-size:11px;opacity:.8;margin-top:4px">발행사 사실인증과 원문 문맥 신호는 다릅니다. 여러 회사가 섞인 문장은 의미어 전파를 보류합니다. 새 예약·유료 호출·주문 없음. 실제 다음 무인 실행과 성능 개선은 별도 확인 대상입니다.</div></section>';
 }
 html+='<div><b>옵시디언·공유기억</b>: '+(nr.length?e(nr.length)+'개 파일 전달·바이트 대조 영수증':'전달 영수증 확인 필요')+' · '+(o.workspace_open_path_ack===true?'날짜 노트의 앱 열린 경로 확인':'앱 열린 경로 미확인')+'. 특정 수정판 읽기·모델 학습 증거는 별도입니다.</div>';
 html+='<div style="font-size:11px;opacity:.8;margin-top:8px">관측 '+e(d.observed_at)+' · 원천 판본 '+e((d.source_revision_sha256||'').slice(0,16))+' · 당시 사용 가능시각은 별도 검증 · 관찰용, 매수추천 아님</div></details>';
 root.innerHTML=html;
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',render);else render();
window.renderDailyLinkage=render;
})();
