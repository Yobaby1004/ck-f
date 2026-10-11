/* Additive Aside38 layer: preserve older Best strategies, expose all candidates and max5. */
(function(){
 'use strict';
 if(window.__aside38Installed)return;
 if(['buildBestCell','renderBestMonthStrip','renderBestMeta','openBestDetail'].some(n=>typeof window[n]!=='function')){console.error('어사이드38: 베스트 함수 누락');return;}
 window.__aside38Installed=true;
 const color='#85e3ce',archive=()=>window.어사이드38_ARCHIVE||{};
 const esc=v=>String(v==null?'':v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const name=c=>(window.어사이드38_NAMES||{})[c]||c;
 const pct=v=>v==null?'—':(v>=0?'+':'')+Number(v).toFixed(2)+'%';
 const won=v=>v==null?'—':Number(v).toLocaleString('ko-KR',{maximumFractionDigits:0});
 const support=['20일선','60일선','120일선','240일선','이평지지미확인'];
 const status=p=>({complete:p.hit?'+20% 목표 청산 가정':'손절/기한 청산 가정',incomplete:'결과 대기',cancelled:'진입 취소',unverifiable:'자료 확인 불가'}[p.s]||p.s);
 const oldCell=window.buildBestCell;
 window.buildBestCell=function(d,k,rec,other,dow){
  let html=oldCell.apply(this,arguments);const row=archive()[k];if(!row||!row.all.length)return html;
  let layer=`<div class="aside38-layer" style="border-top:1px dashed #518e80;margin-top:5px;padding-top:4px;color:${color};font-size:10px"><b>㊳ 어사이드38 · 상위 ${row.a.length}</b><div style="color:#aab9c5">전체 ${row.all.length} · 반등확인 ${row.all.filter(x=>x[1]).length} · 기준 ${esc(row.signal.slice(5))}</div>`;
  row.a.forEach(p=>{const tip=`${p.theme} · 상승 ${p.rise.toFixed(1)}%/${p.rise_days}거래일 → 조정 ${p.dd.toFixed(1)}%/${p.down_days}거래일 → 반등 ${p.rebound_days}거래일 · ${p.support} · ${p.pattern} · ${p.new} · ${status(p)}`;
   layer+=`<div title="${esc(tip)}" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis"><b>${p.r}. ${esc(name(p.c))}</b> ${pct(p.p)} <span style="color:${p.dd>30?'#ffba94':'#aab9c5'}">${p.dd>30?'깊은조정 · ':''}${esc(p.new)}</span></div>`;});
  if(!row.a.length)layer+='<div>반등확인 선정 없음 · 관찰 후보 보존</div>';
  layer+='</div>';
  if(!html.match(/^<div[^>]*\bhas-data\b/))html=html.replace('class="cal-cell','class="cal-cell has-data');
  if(!html.match(/^<div[^>]*\bonclick=/))html=html.replace('data-date="'+k+'"','data-date="'+k+'" onclick="openBestDetail(\''+k+'\')" style="cursor:pointer"');
  const i=html.lastIndexOf('</div>');return html.slice(0,i)+layer+html.slice(i);
 };
 const oldStrip=window.renderBestMonthStrip;
 window.renderBestMonthStrip=function(){const result=oldStrip.apply(this,arguments),el=document.getElementById('best-month-strip');if(!el||typeof bestY==='undefined')return result;
  Array.from(el.children).forEach((btn,i)=>{const pre=`${bestY}-${String(i+1).padStart(2,'0')}`,n=Object.entries(archive()).reduce((a,[k,v])=>a+(k.startsWith(pre)?v.all.length:0),0);if(n){if(i+1!==bestM)btn.classList.add('has-data');btn.title+=` · 어사이드38 전체 ${n}건`;}});return result;};
 const oldMeta=window.renderBestMeta;
 window.renderBestMeta=function(){const result=oldMeta.apply(this,arguments),el=document.getElementById('best-meta'),m=window.어사이드38_META;if(!el||!m)return result;
  const g=m.diagnostic2026,s=m.september;
  el.innerHTML+=`<div class="aside38-meta" style="margin-top:8px;color:${color}"><b>㊳ 어사이드38 · 주도주 상승·눌림 정밀</b> ${esc(m.period[0])}~${esc(m.period[1])} · ${m.days.toLocaleString()}칸 · 전체 ${m.all_candidates.toLocaleString()} · 상위 ${m.selected.toLocaleString()}행(하루 최대5)<br><span style="color:#ffba94">관찰용 · 확정20%예측 아님</span> · 9월 전체 ${s.all}/172 · 상위 ${s.selected}/40 일치(${s.unique}종목) · 원연구1~8월 비중복 모의완료 ${g.completed}건 · 목표 ${(g.hit_rate*100).toFixed(2)}% · 평균 ${pct(g.mean_net_pct)} · 최악 ${pct(g.worst_net_pct)}<br>${m.latest_blocked?`<span style="color:#ffc454">최신 후보 게시 중단 · ${esc(m.block_reasons.join(' · '))}</span>`:`${esc(m.next_date)} 조건부 예정 ${esc(m.planned.join(', ')||'없음')}`}<br><span style="color:#aab9c5">120·240선 우상향 · 당시 주도테마 · 상승/하락/반등 기간 분리 · 깊은조정 표시 · 과거 재적용/독립맹검 아님 · 화면은 신호별 겹침 모의채점 · 실제 계좌 아님</span></div>`;return result;};
 const oldDetail=window.openBestDetail;
 const stock=(c,k)=>`<span style="cursor:pointer;font-weight:bold;color:${color}" onclick="_openStock(this,function(){openBestDetail('${k}')})" data-code="${esc(c)}" data-name="${esc(name(c))}" data-rate="0" data-amount="0" data-meta="어사이드38 ${k}" data-catalyst="">${esc(name(c))}</span> <small>${esc(c)}</small>`;
 const cells=vals=>'<tr>'+vals.map(v=>`<td style="padding:6px;border-bottom:1px solid #344354;white-space:nowrap">${v}</td>`).join('')+'</tr>';
 const table=heads=>'<table style="border-collapse:collapse;color:#e4e6ff;font-size:12px">'+cells(heads.map(esc));
 window.openBestDetail=function(k){const row=archive()[k],body=document.getElementById('stock-modal-body'),ov=document.getElementById('stock-modal-overlay');if(!row||!body||!ov)return oldDetail.apply(this,arguments);
  ov.style.display='none';const result=oldDetail.apply(this,arguments);if(ov.style.display!=='flex')body.innerHTML=`<div style="font-size:18px;font-weight:bold">🏅 베스트 · ${esc(k)}</div>`;
  const prev=body.querySelector('[data-aside38-detail]');if(prev)prev.remove();
  let html=`<section data-aside38-detail style="margin-top:20px;color:${color}"><h3>㊳ 어사이드38 · 주도주 상승·눌림 정밀 · ${esc(k)}</h3><p>정보 기준 ${esc(row.signal)} 종가 · 전체 연구후보 ${row.all.length} · 반등확인 ${row.all.filter(x=>x[1]).length} · 상위 ${row.a.length}종목.</p><p style="color:#ffba94">관찰용 · 확정20%예측 아님. 30%초과 깊은조정후회복은 얕은눌림과 구분합니다. 신규/관찰중은 검색이력이며 실제 보유가 아닙니다.</p><p style="color:#aab9c5">120·240선은20거래일전보다상승 · 120선&gt;240선 · 종가≥120선 · 당시최근5/20일 주도테마 상위5 · 60일 상대수익 상위30% · 종가1000원/20일평균대금10억원 · 일반보통주.<br>선행상승=과거 고점전60봉 저점→고점. 눌림=고점→신호일까지 이미 나온 최저저점. 이평위치는 그 저점 당시 값입니다. 반등확인=양봉·전일종가상회·전일고가 또는20일선 재돌파. 반등0일은 저점과 신호가 같은 날이며 일봉만으로 장중 순서는 알 수 없습니다.<br>다음시가 조건부 진입(+6%초과갭·눌림저점98%이하시가·단일가격봉 취소). 실제목표=진입가120%,고정손절=max(눌림저점98%,진입가93%) 종가이탈후다음시가청산,최대20거래일,비용0.45%p. 손실7% 상한없음. 전일종가 목표/손절은 참고치입니다.<br>화면은 신호별 겹침 모의채점이며 원연구의 비중복 장부/실제계좌와 다릅니다. 미완료/확인불가/취소는 실패나0%로 계산하지 않습니다. 2026년 이전은 미래에 선택한 규칙/통계의 재적용이며 당시 추천이 아닙니다. 이미본9월은 독립맹검이 아닙니다.</p><div style="overflow-x:auto">`;
  html+=table(['순위','종목','신규/관찰중','당시테마','선행상승/기간','고점→저점/기간','반등일수','저점이평','눌림상태','전일종가','참고목표/손절','가정진입','가정목표/손절','모의순손익','상태']);
  row.a.forEach(p=>{html+=cells([p.r,stock(p.c,k),esc(p.new),esc(p.theme),pct(p.rise)+' / '+p.rise_days+'일',pct(-p.dd)+' / '+p.down_days+'일',p.rebound_days+'일',esc(p.support),esc(p.pattern),won(p.pc),won(p.ref_target)+' / '+won(p.ref_stop),won(p.entry),won(p.target)+' / '+won(p.stop),pct(p.p),esc(status(p))+(p.exit?' · '+esc(p.exit):'')]);});
  html+='</table></div><details style="margin-top:12px"><summary>전체 연구후보 '+row.all.length+'종목 보기 · 상위 외 관찰 후보도 보존</summary><div style="overflow-x:auto">';
  html+=table(['종목','확인/관찰','당시테마','5/20일순위','상승률/기간','하락률/기간','반등일수','저점이평','20선','60선','120선','240선','120/240선기울기','20일대금','상대순위']);
  row.all.forEach(x=>{html+=cells([stock(x[0],k),x[1]?'반등확인':'반등미확인 · 관찰',esc(x[5]),x[6]+'/'+x[7],pct(x[8])+' / '+x[9]+'일',pct(-x[10])+' / '+x[11]+'일',x[12]+'일',esc(support[x[13]]),won(x[15]),won(x[16]),won(x[17]),won(x[18]),pct(x[19])+' / '+pct(x[20]),won(x[4]/1e8)+'억원',x[3].toFixed(1)+'%']);});
  body.insertAdjacentHTML('beforeend',html+'</table></div></details></section>');ov.style.display='flex';window.__배지복귀=function(){window.openBestDetail(k);};return result;};
 if(typeof bestY!=='undefined'&&typeof window.renderBestCalendar==='function')window.renderBestCalendar();
})();
