/* Additive Best calendar layer for the sealed weekly leader study. */
(function () {
  'use strict';
  function publishRecoveryNote(k) {
    const m=window.어사이드36_META, d=m&&(m.cutoff||m.D);
    if(!d||String(d).replace(/-/g,'')<'20261021')return '';
    const late=(!k||k==='2026-10-22')?' · 2026-10-22 복구분은 장 시작 후 사후 재구성, 실제 아침 봉인 아님':'';
    return '<div data-publish-recovery="36" style="margin:8px 0;padding:7px;border-left:3px solid #c59a58;color:#cbb48b;font-size:12px">채점판: 현재 정정가격 기준 · 정보기준 '+esc(String(d))+' · 원 게시 명단/선정 입력 보존 · 당시 원시가격 재현 아님 · 복구 전 채점판 별도 보관'+late+'</div>';
  }

  if(window.__aside36Installed)return;
  if(['buildBestCell','renderBestMonthStrip','renderBestMeta','openBestDetail'].some(n=>typeof window[n]!=='function')){console.error('어사이드36: 베스트 함수 누락');return;}
  window.__aside36Installed=true;
  const color='#ffd28c',archive=()=>window.어사이드36_ARCHIVE||{};
  const esc=v=>String(v==null?'':v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const name=c=>(window.어사이드36_NAMES||{})[c]||c;
  const pct=v=>v==null?'—':(v>=0?'+':'')+Number(v).toFixed(2)+'%';
  const won=v=>v==null?'—':Number(v).toLocaleString('ko-KR',{maximumFractionDigits:0});
  const status=p=>({observation:'관찰단계 · 매수 채점 없음',complete:p.hit?'+20% 익절 가정':'손절/기한 청산 가정',incomplete:'20거래일 결과 대기',cancelled:'조건 미충족 · 진입 취소',unverifiable:'자료 확인 불가'}[p.s]||p.s);
  const source=k=>k<'2026-01-01'?'2025년까지 선택한 설계의 과거 재적용 · 당시 추천 아님':(k<='2026-09-24'?'이미 본 과거 · 독립 맹검 아님':'후행 고정규칙 재계산');
  const oldCell=window.buildBestCell;
  window.buildBestCell=function(d,k,rec,other,dow){
    let html=oldCell.apply(this,arguments);const row=archive()[k];if(!row||!row.all.length)return html;
    const confirmed=row.all.filter(x=>x[2]).length;
    let layer=`<div class="aside36-layer" style="border-top:1px dashed #947346;margin-top:5px;padding-top:4px;color:${color};font-size:10px"><b>㊱ 어사이드36 · 상위 ${row.a.length}</b><div style="color:#9da7b8">전체 ${row.all.length} · 확인 ${confirmed} · 정보 ${esc(row.signal.slice(5))}</div>`;
    row.a.forEach(p=>{
      const tip=`${p.stage} · ${p.theme} · 최근5/20일 섹터순위 ${p.wr}/${p.mr} · 고점 조정 ${p.dd.toFixed(1)}% · ${p.new} · ${status(p)}`;
      layer+=`<div title="${esc(tip)}" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis"><b>${p.r}. ${esc(name(p.c))}</b> <span style="color:${p.confirmed?'#ffa69c':'#a7cbdc'}">${esc(p.stage)}</span> ${p.confirmed?pct(p.p):''} <span style="color:#9da7b8">${esc(p.new)}</span></div>`;
    });
    if(!row.a.length)layer+='<div>상위 적격 없음 · 전체 목록 보존</div>';
    layer+='</div>';
    if(!html.match(/^<div[^>]*\bhas-data\b/))html=html.replace('class="cal-cell','class="cal-cell has-data');
    if(!html.match(/^<div[^>]*\bonclick=/))html=html.replace('data-date="'+k+'"','data-date="'+k+'" onclick="openBestDetail(\''+k+'\')" style="cursor:pointer"');
    const i=html.lastIndexOf('</div>');return html.slice(0,i)+layer+html.slice(i);
  };
  const oldStrip=window.renderBestMonthStrip;
  window.renderBestMonthStrip=function(){
    const result=oldStrip.apply(this,arguments),el=document.getElementById('best-month-strip');if(!el||typeof bestY==='undefined')return result;
    Array.from(el.children).forEach((btn,i)=>{const pre=`${bestY}-${String(i+1).padStart(2,'0')}`,n=Object.entries(archive()).reduce((a,[k,v])=>a+(k.startsWith(pre)?v.all.length:0),0);if(n){if(i+1!==bestM)btn.classList.add('has-data');btn.title+=` · 어사이드36 전체 ${n}건`;}});return result;
  };
  const oldMeta=window.renderBestMeta;
  window.renderBestMeta=function(){
    const result=oldMeta.apply(this,arguments),el=document.getElementById('best-meta'),m=window.어사이드36_META;if(!el||!m)return result;
    const g=m.diagnostic2026,s=m.september;
    el.innerHTML+=`<div class="aside36-meta" style="margin-top:8px;color:${color}"><b>㊱ 어사이드36 · 주도주 주간 확대</b> ${esc(m.period[0])}~${esc(m.period[1])} · ${m.days.toLocaleString()}칸 · 전체 ${m.all_candidates.toLocaleString()} · 상위 ${m.selected.toLocaleString()}행(하루 최대5)<br><span style="color:#ffa69c">관찰용 · 수익성 검증 부족</span> · 9월 전체 ${s.all}/192 · 상위 ${s.selected}/84 일치(${s.unique}종목 · 확인 ${s.confirmed_rows} / 관찰 ${s.watch_rows}) · 2026년1~8월 모의장부 완료 ${g.complete}건 · +20% ${(g.frequency20*100).toFixed(1)}% · 평균 ${pct(g.mean_net_pct)}<br>${m.latest_blocked?`<span style="color:#ffc454">최신 후보 게시 중단 · ${esc(m.block_reasons.join(' · '))}</span>`:`${esc(m.next_date)} 조건부 예정 ${esc(m.planned.join(', ')||'없음')}`}<br><span style="color:#9da7b8">120·240선 상승 · 주도섹터 · 돌파/눌림반등 확인과 관찰 구분 · 과거 재적용/새 맹검 아님 · 다음시가 조건부 진입 · +20%/최대20거래일/비용0.45%p · 실제 계좌 아님</span>${publishRecoveryNote()}</div>`;return result;
  };
  const oldDetail=window.openBestDetail;
  const stock=(c,k)=>`<span style="cursor:pointer;font-weight:bold;color:${color}" onclick="_openStock(this,function(){openBestDetail('${k}')})" data-code="${esc(c)}" data-name="${esc(name(c))}" data-rate="0" data-amount="0" data-meta="어사이드36 ${k}" data-catalyst="">${esc(name(c))}</span> <small>${esc(c)}</small>`;
  const cells=vals=>'<tr>'+vals.map(v=>`<td style="padding:6px;border-bottom:1px solid #344354;white-space:nowrap">${v}</td>`).join('')+'</tr>';
  const table=heads=>'<table style="border-collapse:collapse;color:#e4e6ff;font-size:12px">'+cells(heads.map(esc));
  window.openBestDetail=function(k){
    const row=archive()[k],body=document.getElementById('stock-modal-body'),ov=document.getElementById('stock-modal-overlay');if(!row||!body||!ov)return oldDetail.apply(this,arguments);
    ov.style.display='none';const result=oldDetail.apply(this,arguments);
    if(ov.style.display!=='flex')body.innerHTML=`<div style="font-size:18px;font-weight:bold">🏅 베스트 · ${esc(k)}</div>`;
    const previous=body.querySelector('[data-aside36-detail]');if(previous)previous.remove();
    let html=`<section data-aside36-detail style="margin-top:20px;color:${color}"><h3>㊱ 어사이드36 · 주도주 주간 확대 · ${esc(k)}</h3>${publishRecoveryNote(k)}<p>정보 기준 ${esc(row.signal)} 종가 · ${esc(source(k))}<br>전체 기본 후보 ${row.all.length}종목 · 확인 조건 ${row.all.filter(x=>x[2]).length}종목 · 상위 ${row.a.length}종목. 원문 기록률 ${(row.coverage*100).toFixed(0)}%.</p><p style="color:#ffa69c">관찰용 · 수익성 검증 부족 · +20% 확정 예측이 아닙니다. 관찰단계는 확인 매수로 채점하지 않습니다.</p><p style="color:#9da7b8">120·240선 각각20거래일 전 대비 상승 · 120선&gt;240선 · 종가≥120선 · 60일 상대수익 상위30% · 종가1000원/20일평균대금10억원 · 일반 보통주만.<br>최근5/20거래일 당시 기록 주도섹터 상위5. 돌파확인=전일까지20일 고가 돌파·양봉·거래량1.1배 이상. 눌림반등확인=고점 조정2~25%·60선97% 이상·양봉상승·전일고가 또는20선 재돌파. 눌림관찰=3~25%조정·20/60선 근처 또는20선 위 거래량축소.<br>확인 단계만 다음시가 조건부 진입(+6%초과갭·구조손절가이하시가·단일가격봉 취소) · 실제진입가+20% · 고정손절=max(신호일까지10일최저가98%,실제진입가93%) 종가이탈 후 다음시가청산 · 최대20거래일 · 비용0.45%p. 손실7% 상한 없음.<br>화면은 겹치는 확인신호별 가정 채점이며 동시보유 제한 모의장부/실제 계좌수익이 아닙니다. 결과대기·자료불명·취소는 실패/0%로 계산하지 않습니다. 신규/관찰중은 검색이력이며 실제 보유가 아닙니다. 2026년 이전은 미래에 선택한 설계의 재적용이므로 당시 추천이 아닙니다.</p><div style="overflow-x:auto">`;
    html+=table(['순위','종목','단계','신규/관찰중','주도섹터','5일/20일순위','고점 조정','60일 상대순위','전일종가','참고목표/손절','가정진입','가정목표/손절','모의순손익','상태']);
    row.a.forEach(p=>{html+=cells([p.r,stock(p.c,k),esc(p.stage),esc(p.new),esc(p.theme),`${p.wr}/${p.mr}`,pct(-p.dd),p.rs.toFixed(1)+'%',won(p.pc),won(p.ref_target)+' / '+won(p.ref_stop),p.confirmed?won(p.entry):'—',p.confirmed?won(p.target)+' / '+won(p.stop):'—',p.confirmed?pct(p.p):'—',esc(status(p))+(p.exit?' · '+esc(p.exit):'')]);});
    html+='</table></div><details style="margin-top:12px"><summary>전체 기본 후보 '+row.all.length+'종목 보기 · 상위 제외 후보도 보존</summary><div style="overflow-x:auto">';
    html+=table(['종목','단계','주도섹터','5일/20일순위','고점조정','20선','60선','120선','240선','120/240선 기울기','20일평균대금','60일 상대순위','순위대상']);
    row.all.forEach(x=>{html+=cells([stock(x[0],k),esc(x[1]),esc(x[7]),`${x[8]}/${x[9]}`,pct(-x[10]),won(x[12]),won(x[13]),won(x[14]),won(x[15]),pct(x[16])+' / '+pct(x[17]),won(x[6]/1e8)+'억원',x[5].toFixed(1)+'%',x[3]?'적격 · 상위5 우선순위':'단계/상대강도 조건외']);});
    body.insertAdjacentHTML('beforeend',html+'</table></div></details></section>');ov.style.display='flex';window.__배지복귀=function(){window.openBestDetail(k);};return result;
  };
  if(typeof bestY!=='undefined'&&typeof window.renderBestCalendar==='function')window.renderBestCalendar();
})();
