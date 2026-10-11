/* Additive Best-calendar layer for the frozen 부자120240 주도눌림 v2. */
(function () {
  'use strict';
  if (window.__aside47Installed) return;
  if (['buildBestCell', 'renderBestMonthStrip', 'renderBestMeta', 'openBestDetail']
      .some(n => typeof window[n] !== 'function')) {
    console.error('어사이드47: 베스트 달력 함수가 없습니다'); return;
  }
  window.__aside47Installed = true;
  const color = '#f7cf78', muted = '#9aa7bc', archive = () => window.어사이드47_ARCHIVE || {};
  const esc = v => String(v == null ? '' : v).replace(/[&<>"']/g,
    c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const pct = v => v == null ? '—' : `${Number(v)>=0?'+':''}${Number(v).toFixed(1)}%`;
  const won = v => v == null ? '—' : Number(v).toLocaleString('ko-KR',{maximumFractionDigits:0});
  const paper = p => {
    if (!p) return '미채점';
    if (p.status === 'completed') return `모의 ${pct(p.net_pct)}${p.hit20?' · +20% 목표':' · 손절/기한'}`;
    return ({pending:'진입 전', incomplete:'결과 대기', cancelled:'진입 취소',
      unverifiable:'가격 확인 불가'}[p.status] || '자료 확인 불가');
  };
  const stock = (r,k) => `<span style="cursor:pointer;font-weight:bold;color:${color}" `+
    `onclick="_openStock(this,function(){openBestDetail('${k}')})" data-code="${esc(r.c)}" `+
    `data-name="${esc(r.n)}" data-rate="0" data-amount="0" `+
    `data-meta="어사이드47 ${k}" data-catalyst="">${esc(r.n)}</span> <small>${esc(r.c)}</small>`;
  const row = cells => `<tr>${cells.map(v=>`<td style="padding:5px 7px;border-bottom:1px solid #555066;white-space:nowrap">${v}</td>`).join('')}</tr>`;
  const table = heads => `<table style="border-collapse:collapse;color:#e4e6ff;font-size:12px">${row(heads.map(esc))}`;

  const oldCell = window.buildBestCell;
  window.buildBestCell = function(d,k,rec,other,dow) {
    let html = oldCell.apply(this,arguments), cell = archive()[k];
    if (!cell || !cell.all.length) return html;
    let layer = `<div class="aside47-layer" style="border-top:1px dashed #8e7b50;margin-top:4px;padding-top:4px;color:${color};font-size:10px">`+
      `<b>㊼ 어사이드47</b> <span style="color:${muted}">전체 ${cell.all.length} · 확인 ${cell.a.length} · 관찰 ${cell.w.length}</span>`;
    if (!cell.posting_ok) layer += `<div style="color:#ffaf86">과거 자료 검사 차단 · ${esc(cell.blocking_reasons.join(' · '))}</div>`;
    cell.a.forEach((p,i) => {
      layer += `<div title="${esc(`${p.s} · ${p.theme} · 상승 ${pct(p.rise)}/${p.rise_days}일 · 눌림 ${pct(-p.depth)}/${p.down_days}일 · ${p.support} · ${paper(p.paper)}`)}" `+
        `style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis"><b>${i+1}. ${esc(p.n)}</b> `+
        `<span style="color:${muted}">${esc(p.s)} · ${esc(paper(p.paper))}</span></div>`;
    });
    if (!cell.a.length) layer += `<div style="color:${muted}">반등확인 없음 · 관찰 ${cell.w.length}</div>`;
    layer += '</div>';
    if (!html.match(/^<div[^>]*\bhas-data\b/)) html = html.replace('class="cal-cell','class="cal-cell has-data');
    if (!html.match(/^<div[^>]*\bonclick=/)) html = html.replace('data-date="'+k+'"',
      'data-date="'+k+'" onclick="openBestDetail(\''+k+'\')" style="cursor:pointer"');
    const end=html.lastIndexOf('</div>'); return html.slice(0,end)+layer+html.slice(end);
  };

  const oldStrip = window.renderBestMonthStrip;
  window.renderBestMonthStrip = function() {
    const result=oldStrip.apply(this,arguments), strip=document.getElementById('best-month-strip');
    if (!strip || typeof bestY==='undefined') return result;
    Array.from(strip.children).forEach((btn,i)=>{
      const prefix=`${bestY}-${String(i+1).padStart(2,'0')}`;
      const count=Object.entries(archive()).reduce((n,[k,v])=>n+(k.startsWith(prefix)?v.all.length:0),0);
      if (count) { if (i+1!==bestM) btn.classList.add('has-data'); btn.title+=` · 어사이드47 전체 ${count}건`; }
    }); return result;
  };

  const oldMeta=window.renderBestMeta;
  window.renderBestMeta=function() {
    const result=oldMeta.apply(this,arguments), el=document.getElementById('best-meta'), m=window.어사이드47_META;
    if (!el || !m) return result;
    el.innerHTML+=`<div class="aside47-meta" style="margin-top:7px;color:${color}"><b>㊼ 어사이드47 · 부자120240 주도눌림 v2</b> `+
      `${esc(m.first_date)}~${esc(m.last_date)} · ${m.days.toLocaleString()}칸 · 전체 ${m.all_candidates.toLocaleString()} · 반등확인 상위 ${m.selected.toLocaleString()} · 관찰 ${m.watch.toLocaleString()}<br>`+
      `<span style="color:#ffaf86">연구 관찰용 · 1~8월 하루20% ${Number(m.primary_2026_pct).toFixed(2)}% · 20일 모의 평균 ${pct(m.paper_mean_2026_pct)} · 완벽/확정예측 아님</span> · 9월 동결 전체 ${m.september.core}/290 · 확인 ${m.september.confirmed}/53 · 관찰 ${m.september.watch}/85<br>`+
      (m.latest_blocked?`<span style="color:#ffc454">최신 예정 게시중단: ${esc(m.block_reasons.join(' · '))}</span>`:
        `${esc(m.next_date)} 확인목록: ${esc(m.planned.join(', ') || '적격 없음')}`)+
      `<br><span style="color:${muted}">120·240일선 각각 5/20봉 상승 · 당시 상위5 주도테마 · 반등확인/미확인 분리 · 과거 날짜는 시간순 재현이며 실제 오전8시 게시 기록이 아닙니다.</span></div>`;
    return result;
  };

  const oldDetail=window.openBestDetail;
  window.openBestDetail=function(k) {
    const cell=archive()[k],body=document.getElementById('stock-modal-body'),ov=document.getElementById('stock-modal-overlay');
    if (!cell || !cell.all.length || !body || !ov) return oldDetail.apply(this,arguments);
    ov.style.display='none'; const result=oldDetail.apply(this,arguments);
    if (ov.style.display!=='flex') body.innerHTML=`<div style="font-size:18px;font-weight:bold">🏅 베스트 · ${esc(k)}</div>`;
    const prev=body.querySelector('[data-aside47-detail]'); if (prev) prev.remove();
    const warn=cell.posting_ok?'':`<p style="color:#ffaf86">그날 자료 검사 차단: ${esc(cell.blocking_reasons.join(' · '))}. 조건상 목록이며 실제 알림 가능 명단으로 보지 않습니다.</p>`;
    let html=`<section data-aside47-detail style="margin-top:20px;color:${color}"><h3>㊼ 어사이드47 · ${esc(k)}</h3>`+
      `<p>전 거래일 ${esc(cell.signal)} 종가까지 · 전체 ${cell.all.length} · 반등확인 상위 ${cell.a.length} · 미확인 관찰 상위 ${cell.w.length}. 신규/관찰중은 검색 이력이며 실제 보유가 아닙니다.</p>`+
      `<p style="color:#ffaf86">연구 관찰용. 확정 상승이나 검증된 수익 전략이 아닙니다. 과거 시간순 재현이며 당시 오전8시 발행시각은 확인되지 않았습니다. 모의 손익은 실제 계좌 손익과 다릅니다.</p>${warn}`+
      `<p style="color:${muted}">일반 보통주 · 120일선과240일선 각각5·20거래일 상승 · 120&gt;240 · 종가≥120 · 당시 최근5/20일 상위5 주도테마 · 최근10일 안 종목 등장. 선행저점→고점 상승률/기간과 고점→눌림저점 하락률/기간은 그날까지의 봉만 사용합니다. 반등확인은 양봉·전일종가상회와 직전고가 돌파 또는20일선 재진입입니다. 미확인은 별도 관찰입니다. 다음 시가 조건부 진입·실제 진입가+20% 목표·눌림저점98%/진입가93% 손절 기준 종가이탈 다음시가·20거래일·거래비용 반영. 다음시가 청산은 손실 상한을 보장하지 않습니다. 미완료·불명·진입취소는 실패0%로 계산하지 않습니다.</p>`+
      `<div style="overflow-x:auto">${table(['순위','종목','단계','주도테마','선행상승/기간','최대눌림/기간','현재하락','이평선 근접','전일종가','모의상태'])}`;
    cell.a.forEach((p,i)=>html+=row([i+1,stock(p,k),esc(p.s),esc(p.theme),`${pct(p.rise)} / ${p.rise_days}일`,
      `${pct(-p.depth)} / ${p.down_days}일`,pct(-p.now_depth),esc(p.support),won(p.pc),esc(paper(p.paper))]));
    html+='</table></div><details style="margin-top:12px"><summary>미확인 관찰 상위 '+cell.w.length+'종목 보기</summary><div style="overflow-x:auto">'+
      table(['종목','단계','주도테마','선행상승/기간','최대눌림/기간','이평선 근접']);
    cell.w.forEach(p=>html+=row([stock(p,k),esc(p.s),esc(p.theme),`${pct(p.rise)} / ${p.rise_days}일`,
      `${pct(-p.depth)} / ${p.down_days}일`,esc(p.support)]));
    html+='</table></div></details><details style="margin-top:12px"><summary>전체 조건 통과 '+cell.all.length+'종목 보기</summary><div style="overflow-x:auto">'+
      table(['종목','확인/관찰','주도테마','상승/기간','눌림/기간','현재하락','지지선','120일선','240일선','기울기5/20']);
    cell.all.forEach(p=>html+=row([stock(p,k),p.ok?'반등확인':'미확인 관찰',esc(p.theme),
      `${pct(p.rise)} / ${p.rise_days}일`,`${pct(-p.depth)} / ${p.down_days}일`,pct(-p.now_depth),
      esc(p.support),won(p.ma120),won(p.ma240),p.slopes.map(pct).join(' / ')]));
    html+='</table></div></details></section>';
    body.insertAdjacentHTML('beforeend',html); ov.style.display='flex';
    window.__배지복귀=function(){window.openBestDetail(k);}; return result;
  };
  if (typeof bestY!=='undefined' && typeof window.renderBestCalendar==='function') window.renderBestCalendar();
})();
