/* Separate 어사이드31 layer: existing Best calendar and strategies retained. */
(function () {
  'use strict';
  function publishRecoveryNote(k) {
    const m=window.어사이드31_META, d=m&&(m.cutoff||m.D);
    if(!d||String(d).replace(/-/g,'')<'20261021')return '';
    const late=(!k||k==='2026-10-22')?' · 2026-10-22 복구분은 장 시작 후 사후 재구성, 실제 아침 봉인 아님':'';
    return '<div data-publish-recovery="31" style="margin:8px 0;padding:7px;border-left:3px solid #c59a58;color:#cbb48b;font-size:12px">채점판: 현재 정정가격 기준 · 정보기준 '+esc(String(d))+' · 원 게시 명단/선정 입력 보존 · 당시 원시가격 재현 아님 · 복구 전 채점판 별도 보관'+late+'</div>';
  }

  if (window.__aside31Installed) return;
  if (['buildBestCell','renderBestMonthStrip','renderBestMeta','openBestDetail'].some(n => typeof window[n] !== 'function')) {
    console.error('어사이드31: 베스트 달력 함수 누락'); return;
  }
  window.__aside31Installed = true;
  const color = '#a6dcff', arch = () => window.어사이드31_ARCHIVE || {};
  const esc = v => String(v == null ? '' : v).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const name = c => (window.어사이드31_NAMES || {})[c] || c;
  const pct = v => v == null ? '—' : (v >= 0 ? '+' : '') + Number(v).toFixed(2) + '%';
  const won = v => v == null ? '—' : Number(v).toLocaleString('ko-KR',{maximumFractionDigits:2});
  const states = {target:'+20% 익절 가정',stop:'다음 시가 손절 가정',timeout:'20거래일 기한 청산',pending:'결과 대기',unverifiable:'자료 확인 불가',cancelled:'조건 미충족 · 진입 취소',observation:'매듭 관찰 · 진입 가정 없음'};
  const status = p => (p.s === 'pending' && p.entry == null ? '조건부 진입 예정' : (states[p.s] || p.s)) + (p.fill ? ' · 청산 체결 확인 불가' : '');
  const source = k => k < '2016-10-01' ? '검증기간 밖 · 과거 재적용' : (k <= '2026-08-31' ? '과거 재적용' : (k <= '2026-09-24' ? '9월 고정 명단' : '후행 규칙 재계산'));
  const oldCell = window.buildBestCell;
  window.buildBestCell = function (d,k,rec,other,dow) {
    let html = oldCell.apply(this,arguments); const row = arch()[k]; if (!row || !row.all.length) return html;
    const nc = row.all.filter(x => x[1]).length;
    let layer = `<div class="aside31-layer" style="border-top:1px dashed #476477;margin-top:4px;padding-top:3px;color:${color};font-size:10px"><b>㉛ 어사이드31 · 상위 ${row.a.length}</b><div style="color:#899fb4">전체 ${row.all.length} · 확인 ${nc} · 관찰 ${row.all.length-nc}</div>`;
    row.a.forEach(p => {
      const tip = `합침매매법 · ${p.sig} · ${p.new} · 점화가 ${won(p.ig)} · 손절폭 ${pct(p.risk)} · ${status(p)} · 신호별 모의채점`;
      layer += `<div title="${esc(tip)}" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis"><b>${p.r}. ${esc(name(p.c))} <small>${p.phase === "합침 확인" ? "확인" : "관찰"}</small></b> ${pct(p.p)}${p.hit?' +20✓':''} <span style="color:#899fb4">${esc(p.new)}</span></div>`;
    });
    if (!row.a.length) layer += '<div>매듭 관찰 · 확인 신호 없음</div>';
    layer += '</div>';
    if (!html.match(/^<div[^>]*\bhas-data\b/)) html = html.replace('class="cal-cell','class="cal-cell has-data');
    if (!html.match(/^<div[^>]*\bonclick=/)) html = html.replace('data-date="'+k+'"','data-date="'+k+'" onclick="openBestDetail(\''+k+'\')" style="cursor:pointer"');
    const i = html.lastIndexOf('</div>'); return html.slice(0,i)+layer+html.slice(i);
  };
  const oldStrip = window.renderBestMonthStrip;
  window.renderBestMonthStrip = function () {
    const result = oldStrip.apply(this,arguments), el=document.getElementById('best-month-strip');
    if (!el || typeof bestY==='undefined') return result;
    Array.from(el.children).forEach((btn,i) => {
      const pre=`${bestY}-${String(i+1).padStart(2,'0')}`;
      const n=Object.entries(arch()).reduce((s,[k,r]) => s+(k.startsWith(pre)?r.all.length:0),0);
      if (n) { if(i+1!==bestM)btn.classList.add('has-data'); btn.title+=` · 어사이드31 전체 ${n}건`; }
    }); return result;
  };
  const oldMeta = window.renderBestMeta;
  window.renderBestMeta = function () {
    const result=oldMeta.apply(this,arguments), el=document.getElementById('best-meta'), m=window.어사이드31_META;
    if (!el || !m) return result;
    const s=m.september;
    el.innerHTML+=`<div class="aside31-meta" style="margin-top:6px;color:${color}"><b>㉛ 어사이드31 · 합침매매법</b> ${esc(m.period[0])}~${esc(m.period[1])} · ${m.days.toLocaleString()}칸 · 전체 ${m.all_candidates.toLocaleString()}건 · 상위 ${m.selected.toLocaleString()}건(하루 최대5)<br><span style="color:#ffaaa0">관찰용 · 독립 수익검증 없음</span> · 9월 전체99/상위81 일치 · 9월 확인 신호별 모의채점: 완료 ${s.completed}건 · +20% ${s.target20}건 · 평균 ${pct(s.mean_net_pct)}<br>${m.latest_blocked?`<span style="color:#ffc454">${esc(m.next_date)} 새 후보 게시 중단 · ${esc(m.cutoff)} 갱신 ${m.fresh}/${m.recent}(${(m.freshness*100).toFixed(2)}%) · 95% 이상 및 전일자료 확인 필요</span>`:`${esc(m.next_date)} 예정 ${m.planned.length}종목 (${esc(m.planned.join(', ')||'없음')})`}<br><span style="color:#899fb4">과거 재적용은 당시 추천·새 맹검이 아닙니다. 다음 시가 조건부 진입 · +20% 익절 · 최대20거래일 · 비용0.45%p · 점화가93% 손절 · 겹치는 신호별 채점 · 실제 계좌 아님</span>${publishRecoveryNote()}</div>`;
    return result;
  };
  const oldDetail = window.openBestDetail;
  const stock = (c,k) => `<span style="cursor:pointer;font-weight:bold;color:${color}" onclick="_openStock(this,function(){openBestDetail('${k}')})" data-code="${esc(c)}" data-name="${esc(name(c))}" data-rate="0" data-amount="0" data-meta="어사이드31 ${k}" data-catalyst="">${esc(name(c))}</span> <small>${esc(c)}</small>`;
  const cells = vals => '<tr>'+vals.map(v=>`<td style="padding:6px;border-bottom:1px solid #293b4a;white-space:nowrap">${v}</td>`).join('')+'</tr>';
  const table = headings => '<table style="border-collapse:collapse;color:#e4e6ff;font-size:12px">'+cells(headings.map(esc));
  window.openBestDetail = function (k) {
    const row=arch()[k], body=document.getElementById('stock-modal-body'), ov=document.getElementById('stock-modal-overlay');
    if (!row || !body || !ov) return oldDetail.apply(this,arguments);
    ov.style.display='none'; const result=oldDetail.apply(this,arguments);
    if (ov.style.display!=='flex')body.innerHTML=`<div style="font-size:18px;font-weight:bold">🏅 베스트 · ${esc(k)}</div>`;
    const previous=body.querySelector('[data-aside31-detail]');if(previous)previous.remove();
    const nc=row.all.filter(x=>x[1]).length;
    let html=`<section data-aside31-detail style="margin-top:20px;color:${color}"><h3>㉛ 어사이드31 · 합침매매법 · ${esc(k)}</h3>${publishRecoveryNote(k)}<p>정보 기준 ${esc(row.signal)} 종가 · ${esc(source(k))}<br>전체 ${row.all.length}종목(합침 확인 ${nc} · 매듭 관찰 ${row.all.length-nc}) · 확인 우선·관찰 포함 상위 ${row.a.length}종목. 관찰단계는 매수 확인 신호가 아닙니다.</p><p style="color:#ffaaa0">독립 수익검증 없음 · 관찰용 · +20% 상승을 보장하지 않습니다.</p><p style="color:#899fb4">원문 지표를 조합한 별도 합침 규칙입니다. 확인 우선 → 원문 살매듭 → 에너지20 → 팬 정렬 → SilUp → 에너지 → 거래대금 순. 매수일 시가가 전일 종가 +6% 초과, 점화가93% 이하 또는 단일가격봉이면 취소.<br>시가 진입가 +20% 익절 · 손절=고정 점화가93% 종가 이탈 또는 MACD 중심선 하단 이탈 후 다음 시가 청산 · 최대20거래일 · 비용0.45%p.<br>아래 수익은 확인 신호별 반복·겹침을 포함한 모의채점입니다. 관찰단계는 진입·채점하지 않습니다. 독립 거래나 계좌 수익이 아닙니다. 결과 대기·자료 불명은 0%로 계산하지 않습니다. 점화가 기준 손절은 진입가 대비 7% 제한이 아니며 실제 체결은 확인되지 않았습니다.</p><div style="overflow-x:auto">`;
    html+=table(['순위','종목','신호','신규/관찰중','전일종가','점화가','원문 손절폭','에너지','상자 상단/하단','가정 진입가','손절가','+20% 목표가','모의 순수익','상태']);
    row.a.forEach(p=>{html+=cells([p.r,stock(p.c,k),esc(p.phase+' · '+p.sig),esc(p.new),won(p.pc),won(p.ig),pct(p.risk),won(p.e),won(p.bu)+' / '+won(p.bl),won(p.entry),won(p.stop),won(p.target),pct(p.p),esc(status(p))+(p.exit?' · '+esc(p.exit):'')]);});
    html+='</table></div><details style="margin-top:12px"><summary>전체 후보 '+row.all.length+'종목 보기 · 확인/관찰 분리</summary><div style="overflow-x:auto">';
    html+=table(['종목','단계','신호','신호일 종가','점화가','원문 손절폭','에너지','상자 상단/하단','원문 살매듭','20일 평균 거래대금']);
    row.all.forEach(x=>{html+=cells([stock(x[0],k),x[1]?'합침 확인':'매듭 관찰',esc(x[2]),won(x[3]),won(x[4]),pct(x[5]),won(x[6]),won(x[7])+' / '+won(x[8]),x[9]?'충족':'그 외 매듭',won(x[10]/1e8)+'억원'+(x[10]<1e9?' · 유동성 확인':'')]);});
    body.insertAdjacentHTML('beforeend',html+'</table></div></details></section>');ov.style.display='flex';
    window.__배지복귀=function(){window.openBestDetail(k);};return result;
  };
  if(typeof bestY!=='undefined'&&typeof window.renderBestCalendar==='function')window.renderBestCalendar();
})();
