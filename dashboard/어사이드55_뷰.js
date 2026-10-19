/* 어사이드55 v1: 20일 고점돌파 관찰명단. 진입·청산·수익률을 임의로 만들지 않는다. */
(function(){
'use strict';
if(window.__aside55Installed)return;
if(['buildBestCell','renderBestMonthStrip','renderBestMeta','openBestDetail'].some(k=>typeof window[k]!=='function')){console.error('어사이드55: 베스트 함수 없음');return;}
window.__aside55Installed=true;
const color='#69c3d0',badge='㊄',A=()=>window.어사이드55_ARCHIVE||{},N=()=>window.어사이드55_NAMES||{};
const esc=v=>String(v==null?'':v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const nm=x=>(N()[x[0]]||[x[0]])[0],num=x=>Number(x).toLocaleString('ko-KR',{maximumFractionDigits:2});
const ymd=x=>{x=String(x);return x.length===8?x.slice(0,4)+'-'+x.slice(4,6)+'-'+x.slice(6):x;};
window.aside55Go=function(k,detail){if(typeof bestY==='undefined')return;bestY=+k.slice(0,4);bestM=+k.slice(5,7);window.renderBestCalendar();if(detail)window.openBestDetail(k);};
const oldCell=window.buildBestCell;
window.buildBestCell=function(d,k,rec,other,dow){
 let h=oldCell.apply(this,arguments),r=A()[k];if(!r)return h;
 let layer='<div class="aside55-layer" style="border-top:1px dashed '+color+'55;margin-top:4px;padding-top:3px;color:'+color+';font-size:10px" title="어사이드55 · 신호일 '+ymd(r.sd)+' · 후보 '+r.q+' · '+(r.cal||'005930기준일')+' · 매수추천 아님"><b>'+badge+' 어사이드55</b>';
 if(!r.n)layer+=' <span style="opacity:.65">확인된 신호 없음</span>';
 r.a.forEach(x=>{layer+='<div style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis" title="'+esc(nm(x))+' · 20일 고점 돌파 '+num(x[3])+'% · 거래량 '+num(x[4])+'배 · 관찰명단, 수익률 아님">'+x[1]+'. <b>'+esc(nm(x))+'</b> <span style="opacity:.75">돌파 '+num(x[3])+'%</span></div>';});
 layer+='</div>';
 if(r.n&&!/^<div[^>]*\bhas-data\b/.test(h))h=h.replace('class="cal-cell','class="cal-cell has-data');
 if(r.n&&!/^<div[^>]*\bonclick=/.test(h))h=h.replace('data-date="'+k+'"','data-date="'+k+'" onclick="openBestDetail(\''+k+'\')" style="cursor:pointer"');
 const end=h.lastIndexOf('</div>');return h.slice(0,end)+layer+h.slice(end);
};
const oldStrip=window.renderBestMonthStrip;
window.renderBestMonthStrip=function(){const ret=oldStrip.apply(this,arguments),s=document.getElementById('best-month-strip');if(!s||typeof bestY==='undefined')return ret;Array.from(s.children).forEach((b,i)=>{const pre=bestY+'-'+String(i+1).padStart(2,'0');let n=0;for(const k of Object.keys(A()))if(k.startsWith(pre))n+=A()[k].n;if(n){if(i+1!==bestM)b.classList.add('has-data');b.title+=' · 어사이드55 '+n+'선택';}});return ret;};
const oldMeta=window.renderBestMeta;
window.renderBestMeta=function(){
 const ret=oldMeta.apply(this,arguments),e=document.getElementById('best-meta'),m=window.어사이드55_META;if(!e)return ret;
 if(!m){e.insertAdjacentHTML('beforeend','<div style="color:'+color+'">어사이드55 자료 없음: _베스트_어사이드55_빌드.py 확인</div>');return ret;}
 const controls='<button onclick="aside55Go(\''+m.첫칸+'\')">55 첫 달</button> <button onclick="aside55Go(\''+m.끝칸+'\',true)">55 최근 명단</button>';
 e.insertAdjacentHTML('beforeend','<div class="aside55-meta" style="margin-top:8px;color:'+color+'"><b>'+badge+' 어사이드55 · 20일 고점 돌파</b> '+esc(m.첫칸)+'~'+esc(m.끝칸)+' · '+num(m.칸)+'칸 · '+num(m.명단)+'선택 · 일반주 '+num(m.대상)+'종목 · 신호봉 '+ymd(m.마지막봉)+' · '+controls+'<br>전일 종가 &gt; 직전20일 최고가, 양봉, 거래량 직전20일 평균의2배 이상 → 돌파율순 최대3 · <b>관찰 전용 · 매수추천 아님</b><br>사후 재현 명단이며 실제08시 발송·수익성 검증이 아님. 매수·청산 미정: 수익률·공유 매수장부로 내보내지 않음. 종류는 보관마스터 이름·ISIN 기준(과거시점 완전성 미입증). 9월 원명단 '+m.회귀.matched_codes+'/51 대조 · 생성 '+esc(m.생성)+'<br>기준거래일 '+ymd(m.기준일시작||'20020125')+' 전후 초기창의 더 오래된 칸은 <b>장기관측근사·공식달력 미확정</b>입니다. 관측일 합집합은 시장 전체 거래일 완전성을 보장하지 않습니다.</div>');return ret;
};
const oldDetail=window.openBestDetail;
window.openBestDetail=function(k){
 const r=A()[k],body=document.getElementById('stock-modal-body'),overlay=document.getElementById('stock-modal-overlay');if(!r||!r.n||!body||!overlay)return oldDetail.apply(this,arguments);
 overlay.style.display='none';const ret=oldDetail.apply(this,arguments);if(overlay.style.display!=='flex')body.innerHTML='<h2>베스트 · '+esc(k)+'</h2>';
 const existing=body.querySelector('[data-aside55-detail]');if(existing)existing.remove();
 let h='<section data-aside55-detail style="margin-top:18px;color:'+color+'"><h3>'+badge+' 어사이드55 · 20일 고점 돌파</h3><p style="font-size:12px;line-height:1.7">관찰일 <b>'+esc(k)+'</b> · 입력은 신호일 <b>'+ymd(r.sd)+'</b> 종가까지 · 조건통과 '+r.q+'개 중 상위 '+r.n+'개 · '+esc(r.cal||'005930기준일')+'<br><b>관찰용 · 매수추천 아님. 돌파율은 수익률이 아닙니다.</b> 진입·청산·보유기간·실제체결을 가정하지 않았습니다.</p><div style="overflow-x:auto"><table style="border-collapse:collapse;font-size:12px"><tr>';
 ['순위','종목','시장','신호일 종가','직전20일 최고가','돌파율','거래량 배수','구분'].forEach(t=>h+='<th style="text-align:left;padding:7px;border-bottom:1px solid '+color+'55">'+t+'</th>');h+='</tr>';
 r.a.forEach(x=>{const name=nm(x),mk=(N()[x[0]]||[])[1]||'';const chip='<span style="cursor:pointer;font-weight:bold" onclick="_openStock(this,function(){openBestDetail(\''+k+'\')})" data-code="'+esc(x[0])+'" data-name="'+esc(name)+'" data-rate="0" data-amount="0" data-meta="어사이드55 '+esc(k)+' 관찰" data-catalyst="">'+esc(name)+'</span><small style="display:block;opacity:.65">'+x[0]+'</small>';h+='<tr>'+[x[1],chip,esc(mk),num(x[5]),num(x[6]),num(x[3])+'%',num(x[4])+'배','관찰'].map(v=>'<td style="padding:7px;border-bottom:1px solid '+color+'33;white-space:nowrap">'+v+'</td>').join('')+'</tr>';});
 body.insertAdjacentHTML('beforeend',h+'</table></div></section>');overlay.style.display='flex';window.__배지복귀=function(){window.openBestDetail(k);};return ret;
};
if(typeof bestY!=='undefined'&&typeof window.renderBestCalendar==='function'){try{window.renderBestCalendar();}catch(e){console.warn('어사이드55 초기화',e);}}
})();
