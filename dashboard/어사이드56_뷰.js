/* 어사이드56 = 주도순환 하루3 v4. 모든행 관찰, 원형신호4/관찰47 회귀. */
(function(){
'use strict';
if(window.__aside56Installed)return;
if(['buildBestCell','renderBestMonthStrip','renderBestMeta','openBestDetail'].some(k=>typeof window[k]!=='function')){console.error('어사이드56: 베스트 함수 없음');return;}
window.__aside56Installed=true;
const color='#e2b36c',badge='㊅',A=()=>window.어사이드56_ARCHIVE||{},N=()=>window.어사이드56_NAMES||{};
const esc=v=>String(v==null?'':v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const nm=x=>(N()[x[0]]||[x[0]])[0],num=x=>x==null?'—':Number(x).toLocaleString('ko-KR',{maximumFractionDigits:2});
const ymd=x=>{x=String(x);return x.length===8?x.slice(0,4)+'-'+x.slice(4,6)+'-'+x.slice(6):x;};
const status=x=>x[4]===0?'원형 조건부신호':x[4]===1?'눌림 관찰':'추세 보충·대기';
window.aside56Go=function(k,detail){if(typeof bestY==='undefined')return;bestY=+k.slice(0,4);bestM=+k.slice(5,7);window.renderBestCalendar();if(detail)window.openBestDetail(k);};
const oldCell=window.buildBestCell;
window.buildBestCell=function(d,k,rec,other,dow){
 let h=oldCell.apply(this,arguments),r=A()[k];if(!r)return h;
 let layer='<div class="aside56-layer" style="border-top:1px dashed '+color+'55;margin-top:4px;padding-top:3px;color:'+color+';font-size:10px" title="어사이드56 · '+ymd(r.sd)+'까지 · 매수추천 아님"><b>'+badge+' 어사이드56 · 하루3</b>';
 if(r.status==='UNKNOWN')layer+=' <span style="opacity:.7">월간 자료 미확정</span>';
 else if(!r.n)layer+=' <span style="opacity:.7">조건 충족 없음</span>';
 else if(r.n<3)layer+=' <span style="opacity:.7">후보 부족 '+r.n+'/3</span>';
 r.a.forEach(x=>{layer+='<div style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis" title="'+esc(nm(x))+' · '+esc(x[5])+' · 고점대비 −'+num(x[6])+'% / '+x[7]+'일 · '+status(x)+'">'+x[1]+'. <b>'+esc(nm(x))+'</b> <span style="opacity:.75">'+(x[4]===0?'신호':x[4]===1?'관찰':'보충')+'</span></div>';});
 layer+='</div>';
 // UNKNOWN cells must also open so missing coverage is not mistaken for zero candidates.
 if(!/^<div[^>]*\bhas-data\b/.test(h))h=h.replace('class="cal-cell','class="cal-cell has-data');
 if(!/^<div[^>]*\bonclick=/.test(h))h=h.replace('data-date="'+k+'"','data-date="'+k+'" onclick="openBestDetail(\''+k+'\')" style="cursor:pointer"');
 const end=h.lastIndexOf('</div>');return h.slice(0,end)+layer+h.slice(end);
};
const oldStrip=window.renderBestMonthStrip;
window.renderBestMonthStrip=function(){const ret=oldStrip.apply(this,arguments),s=document.getElementById('best-month-strip');if(!s||typeof bestY==='undefined')return ret;Array.from(s.children).forEach((b,i)=>{const pre=bestY+'-'+String(i+1).padStart(2,'0');let n=0,u=0;for(const k of Object.keys(A()))if(k.startsWith(pre)){n+=A()[k].n;u+=A()[k].status==='UNKNOWN';}if(n||u){if(i+1!==bestM)b.classList.add('has-data');b.title+=' · 어사이드56 '+n+'관찰 / 미확정'+u+'일';}});return ret;};
const oldMeta=window.renderBestMeta;
window.renderBestMeta=function(){
 const ret=oldMeta.apply(this,arguments),e=document.getElementById('best-meta'),m=window.어사이드56_META;if(!e)return ret;
 if(!m){e.insertAdjacentHTML('beforeend','<div style="color:'+color+'">어사이드56 자료 없음: _베스트_어사이드56_빌드.py 확인</div>');return ret;}
 const controls='<button onclick="aside56Go(\''+m.첫칸+'\')">56 첫 달</button> <button onclick="aside56Go(\''+m.끝칸+'\',true)">56 최근 명단</button>';
 e.insertAdjacentHTML('beforeend','<div class="aside56-meta" style="margin-top:8px;color:'+color+'"><b>'+badge+' 어사이드56 · 주도순환 하루3 v4</b> '+esc(m.첫칸)+'~'+esc(m.끝칸)+' · '+num(m.칸)+'칸 · '+num(m.명단)+'관찰 · '+controls+'<br>일반주 · 120/240일선 5·20일 우상향+종가두선위 · 월간20일1회 · 테마20일 또는5일 상위5 · 고점후1~20일/30%이내눌림우선 · 하루3개(부족·누락예외)<br>원형신호→짧은눌림→부족시추세관찰; 단계내강한주도조건→고정모형순. <b>관찰 전용·실제매수/수익률/확률 보장 아님.</b> 원형신호 없는 행에는 매수가를 만들지 않습니다.<br>자료 미확정 '+num(m.상태.UNKNOWN||0)+'일 · 추세보충 '+num(m.추세보충)+'건 · 신호봉 '+ymd(m.마지막봉)+' · 9월 원명단 '+m.회귀.matched+'/51 대조 · 사후 재현(학습기간포함), 당시수집시각·종류/PIT·생존편향 미해소 · 생성 '+esc(m.생성)+'</div>');return ret;
};
const oldDetail=window.openBestDetail;
window.openBestDetail=function(k){
 const r=A()[k],body=document.getElementById('stock-modal-body'),overlay=document.getElementById('stock-modal-overlay');if(!r||!body||!overlay)return oldDetail.apply(this,arguments);
 overlay.style.display='none';const ret=oldDetail.apply(this,arguments);if(overlay.style.display!=='flex')body.innerHTML='<h2>베스트 · '+esc(k)+'</h2>';
 const existing=body.querySelector('[data-aside56-detail]');if(existing)existing.remove();
 let h='<section data-aside56-detail style="margin-top:18px;color:'+color+'"><h3>'+badge+' 어사이드56 · 주도순환 하루3 v4</h3><p style="font-size:12px;line-height:1.7">관찰일 <b>'+esc(k)+'</b> · 신호일 <b>'+ymd(r.sd)+'</b> 종가까지 · '+(r.status==='UNKNOWN'?'<b>월간20일창 자료 미확정: 후보를 0으로 판정하지 않음</b>':'핵심후보 '+r.q+'개 / 짧은눌림 '+r.short+'개 → '+r.n+'개 관찰')+'<br><b>명단은 매수 체결이나 추천이 아닙니다.</b> 원형신호만 기존 돌파매수/손절/직전고점목표를 보존하며, 관찰일 돌파와 실제체결가 최소2R 조건을 확인해야 합니다. 나머지는 신호 대기, 추세보충은 짧은눌림 조건 밖입니다. 같은 종목의 날짜별 재등장 허용. 과거 명단은 당시 실시간 선정 증거가 아닙니다.</p><div style="overflow-x:auto"><table style="border-collapse:collapse;font-size:12px"><tr>';
 ['순위','종목','테마','구분','고점대비 조정','고점후 거래일','월간20등장','테마20/5순위','돌파매수가','손절가','직전고점 목표'].forEach(t=>h+='<th style="text-align:left;padding:7px;border-bottom:1px solid '+color+'55">'+t+'</th>');h+='</tr>';
 r.a.forEach(x=>{const name=nm(x);const chip='<span style="cursor:pointer;font-weight:bold" onclick="_openStock(this,function(){openBestDetail(\''+k+'\')})" data-code="'+esc(x[0])+'" data-name="'+esc(name)+'" data-rate="0" data-amount="0" data-meta="어사이드56 '+esc(k)+' 관찰" data-catalyst="">'+esc(name)+'</span><small style="display:block;opacity:.65">'+x[0]+'</small>';h+='<tr>'+[x[1],chip,esc(x[5]),status(x),'−'+num(x[6])+'%',x[7],x[12],x[13]+'/'+x[14],x[8]?num(x[9]):'신호대기',x[8]?num(x[10]):'—',x[8]?num(x[11]):'—'].map(v=>'<td style="padding:7px;border-bottom:1px solid '+color+'33;white-space:nowrap">'+v+'</td>').join('')+'</tr>';});
 body.insertAdjacentHTML('beforeend',h+'</table></div></section>');overlay.style.display='flex';window.__배지복귀=function(){window.openBestDetail(k);};return ret;
};
if(typeof bestY!=='undefined'&&typeof window.renderBestCalendar==='function'){try{window.renderBestCalendar();}catch(e){console.warn('어사이드56 초기화',e);}}
})();
