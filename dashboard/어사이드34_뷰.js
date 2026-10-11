/* Separate 어사이드34 layer: existing Best calendar and strategies retained. */
(function () {
  'use strict';
  if (window.__aside34Installed) return;
  if (['buildBestCell','renderBestMonthStrip','renderBestMeta','openBestDetail'].some(n => typeof window[n] !== 'function')) {
    console.error('어사이드34: 베스트 달력 함수 누락'); return;
  }
  window.__aside34Installed = true;
  const color = '#a6dcff', arch = () => window.어사이드34_ARCHIVE || {};
  const esc = v => String(v == null ? '' : v).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const name = c => (window.어사이드34_NAMES || {})[c] || c;
  const pct = v => v == null ? '—' : (v >= 0 ? '+' : '') + Number(v).toFixed(2) + '%';
  const won = v => v == null ? '—' : Number(v).toLocaleString('ko-KR',{maximumFractionDigits:2});
  const states = {target:'+20% 익절 가정',stop:'다음 시가 손절 가정',timeout:'20거래일 기한 청산',pending:'결과 대기',unverifiable:'자료 확인 불가',cancelled:'조건 미충족 · 진입 취소',pending_entry:'조건부 진입 예정',invalid_entry:'진입일 자료 불명',unverifiable_gap:'중간 자료 불명'};
  const status = p => (p.s === 'pending' && p.entry == null ? '조건부 진입 예정' : (states[p.s] || p.s)) + (p.fill ? ' · 청산 체결 확인 불가' : '');
  const source = k => k <= '2024-12-31' ? '2024년말 학습모델 과거 재적용 · 당시 정보 명단 아님' : (k <= '2026-08-31' ? '과거 재적용' : (k <= '2026-09-24' ? '9월 고정 명단' : '후행 규칙 재계산'));
  const oldCell = window.buildBestCell;
  window.buildBestCell = function (d,k,rec,other,dow) {
    let html = oldCell.apply(this,arguments); const row = arch()[k]; if (!row || !row.all.length) return html;
    const nc = row.all.filter(x => x[1]).length;
    let layer = `<div class="aside34-layer" style="border-top:1px dashed #476477;margin-top:4px;padding-top:3px;color:${color};font-size:10px"><b>㉞ 어사이드34 · 상위 ${row.a.length}</b><div style="color:#899fb4">전체 ${row.all.length} · 2번 적격 ${nc} · 조건 미충족 ${row.all.length-nc}</div>`;
    row.a.forEach(p => {
      const tip = `캔들위매매법2 · ${p.sig} · ${p.new} · 점화가 ${won(p.ig)} · 손절폭 ${pct(p.risk)} · 과거평균 ${pct(p.mean)} · ${p.note || ""} · ${status(p)} · 신호별 모의채점`;
      layer += `<div title="${esc(tip)}" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis"><b>${p.r}. ${esc(name(p.c))} <small>${esc(p.sig)}</small></b> ${pct(p.p)}${p.hit?' +20✓':''} <span style="color:#899fb4">${esc(p.new)}</span></div><div style="white-space:normal;font-size:9px;color:${p.mean<0?"#ffaaa0":"#899fb4"}">과거평균 ${pct(p.mean)}${p.mean<0?" · 음수 주의":""}</div>`;
    });
    if (!row.a.length) layer += '<div>2번 적격구간 없음 · 전체 보존</div>';
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
      if (n) { if(i+1!==bestM)btn.classList.add('has-data'); btn.title+=` · 어사이드34 전체 ${n}건`; }
    }); return result;
  };
  const oldMeta = window.renderBestMeta;
  window.renderBestMeta = function () {
    const result=oldMeta.apply(this,arguments), el=document.getElementById('best-meta'), m=window.어사이드34_META;
    if (!el || !m) return result;
    const s=m.september;
    el.innerHTML+=`<div class="aside34-meta" style="margin-top:6px;color:${color}"><b>㉞ 어사이드34 · 캔들위매매법2</b> ${esc(m.period[0])}~${esc(m.period[1])} · ${m.days.toLocaleString()}칸 · 전체 ${m.all_candidates.toLocaleString()}건 · 상위 ${m.selected.toLocaleString()}건(하루 최대5)<br><span style="color:#ffaaa0">관찰용 · 검증문턱 미통과(검증33건/목표12건,36.36%)</span> · 9월 전체214/상위${m.frozen_september.selected} 일치 · 9월 선정 신호별 모의채점: 완료 ${s.completed}건 · +20% ${s.target20}건 · 평균 ${pct(s.mean_net_pct)}<br>${m.latest_blocked?`<span style="color:#ffc454">${esc(m.next_date)} 새 후보 게시 중단 · ${esc(m.cutoff)} 갱신 ${m.fresh}/${m.recent}(${(m.freshness*100).toFixed(2)}%) · 95% 이상 및 전일자료 확인 필요</span>`:`${esc(m.next_date)} 예정 ${m.planned.length}종목 (${esc(m.planned.join(', ')||'없음')})`}<br><span style="color:#899fb4">2025년 이전은 2024년말 학습모델 재적용이며 당시 정보 명단이 아닙니다. 과거 재적용은 새 맹검이 아닙니다. 다음 시가 조건부 진입 · +20% 익절 · 최대20거래일 · 비용0.45%p · 점화가93% 손절 · 겹치는 신호별 채점 · 실제 계좌 아님</span></div>`;
    return result;
  };
  const oldDetail = window.openBestDetail;
  const stock = (c,k) => `<span style="cursor:pointer;font-weight:bold;color:${color}" onclick="_openStock(this,function(){openBestDetail('${k}')})" data-code="${esc(c)}" data-name="${esc(name(c))}" data-rate="0" data-amount="0" data-meta="어사이드34 ${k}" data-catalyst="">${esc(name(c))}</span> <small>${esc(c)}</small>`;
  const cells = vals => '<tr>'+vals.map(v=>`<td style="padding:6px;border-bottom:1px solid #293b4a;white-space:nowrap">${v}</td>`).join('')+'</tr>';
  const table = headings => '<table style="border-collapse:collapse;color:#e4e6ff;font-size:12px">'+cells(headings.map(esc));
  window.openBestDetail = function (k) {
    const row=arch()[k], body=document.getElementById('stock-modal-body'), ov=document.getElementById('stock-modal-overlay');
    if (!row || !body || !ov) return oldDetail.apply(this,arguments);
    ov.style.display='none'; const result=oldDetail.apply(this,arguments);
    if (ov.style.display!=='flex')body.innerHTML=`<div style="font-size:18px;font-weight:bold">🏅 베스트 · ${esc(k)}</div>`;
    const previous=body.querySelector('[data-aside34-detail]');if(previous)previous.remove();
    const nc=row.all.filter(x=>x[1]).length;
    let html=`<section data-aside34-detail style="margin-top:20px;color:${color}"><h3>㉞ 어사이드34 · 캔들위매매법2 · ${esc(k)}</h3><p>정보 기준 ${esc(row.signal)} 종가 · ${esc(source(k))}<br>전체 ${row.all.length}종목 · 2번 적격 ${nc} · 상위 ${row.a.length}종목.</p><p style="color:#ffaaa0">관찰용 · +20% 확정 예측이 아닙니다. 검증표본33건 중 목표달성12건(36.36%)으로 최소100건 문턱을 통과하지 못했습니다.</p><p style="color:#899fb4">원문 점화·가격표지지·계단재점화. 보통주·종가1000원·20일평균대금10억원·상한가근접 제외. 2024년말 동결표본100건 이상 구간에서 표본100건 이상·평균순손익 양수·보정 +20%빈도가 학습 전체기준 초과인 구간만 선정. 적격구간에서 +20%익절 Wilson하한→거래대금 순 최대5.<br>다음시가 조건부 진입(+6%초과갭·점화가93%이하 시가·단일가격봉 취소) · +20% 익절 · 고정점화가93% 종가이탈 또는 중심선 하단이탈 후 다음시가손절 · 20거래일 · 비용0.45%p.<br>동결모델을 2025년 이전에 적용한 칸은 당시 정보로 선정한 기록이 아닙니다. 반복/겹치는 신호별 모의채점이며 실제 계좌·독립 거래가 아닙니다. 결과 대기·자료 불명은 0%로 계산하지 않습니다. 손절 손실은 갭·체결로 확대될 수 있습니다.</p><div style="overflow-x:auto">`;
    html+=table(['순위','종목','신호','신규/관찰중','전일종가','점화가','학습표본','과거 평균순손익','Wilson 하한','가정 진입가','고정손절','+20% 목표','모의 순손익','상태']);
    row.a.forEach(p=>{html+=cells([p.r,stock(p.c,k),esc(p.sig),esc(p.new),won(p.pc),won(p.ig),p.tn,pct(p.mean)+(p.mean<0?' · 음수주의':''),p.wilson==null?'—':(p.wilson*100).toFixed(2)+'%',won(p.entry),won(p.stop),won(p.target),pct(p.p),esc(status(p))+(p.exit?' · '+esc(p.exit):'')]);});
    html+='</table></div><details style="margin-top:12px"><summary>전체 후보 '+row.all.length+'종목 보기 · 선정 제외 후보도 보존</summary><div style="overflow-x:auto">';
    html+=table(['종목','신호','종가','점화가','고정손절','학습표본','과거 평균순손익','Wilson 하한','20일 평균대금','순위대상']);
    row.all.forEach(x=>{html+=cells([stock(x[0],k),esc(x[2]),won(x[3]),won(x[4]),won(x[5]),x[6],pct(x[7])+(x[7]<0?' · 과거 평균 음수':''),x[8]==null?'—':(x[8]*100).toFixed(2)+'%',won(x[9]/1e8)+'억원',x[1]?'2번 적격':'조건 미충족 · 선정 제외']);});
    body.insertAdjacentHTML('beforeend',html+'</table></div></details></section>');ov.style.display='flex';
    window.__배지복귀=function(){window.openBestDetail(k);};return result;
  };
  if(typeof bestY!=='undefined'&&typeof window.renderBestCalendar==='function')window.renderBestCalendar();
})();
