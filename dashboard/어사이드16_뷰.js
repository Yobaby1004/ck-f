/* 어사이드16 adds a Best-calendar layer without replacing existing data/functions. */
(function () {
  'use strict';
  function publishRecoveryNote(k) {
    const m=window.어사이드16_META, d=m&&(m.cutoff||m.D);
    if(!d||String(d).replace(/-/g,'')<'20261021')return '';
    const late=(!k||k==='2026-10-22')?' · 2026-10-22 복구분은 장 시작 후 사후 재구성, 실제 아침 봉인 아님':'';
    return '<div data-publish-recovery="16" style="margin:8px 0;padding:7px;border-left:3px solid #c59a58;color:#cbb48b;font-size:12px">채점판: 현재 정정가격 기준 · 정보기준 '+esc(String(d))+' · 원 게시 명단/선정 입력 보존 · 당시 원시가격 재현 아님 · 복구 전 채점판 별도 보관'+late+'</div>';
  }

  if (window.__aside16Installed) return;
  const originals = ['buildBestCell', 'renderBestMonthStrip', 'renderBestMeta', 'openBestDetail'];
  if (originals.some(n => typeof window[n] !== 'function')) {
    console.error('어사이드16: 베스트 달력 함수가 없습니다'); return;
  }
  window.__aside16Installed = true;
  const color = '#85e6cb';
  const arch = () => window.어사이드16_ARCHIVE || {};
  const esc = v => String(v == null ? '' : v).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const pct = v => v == null ? '—' : (v >= 0 ? '+' : '') + Number(v).toFixed(2) + '%';
  const won = v => v == null ? '—' : Number(v).toLocaleString('ko-KR', {maximumFractionDigits: 2});
  const states = {target20:'+20% 익절 가정',close_support_stop_next_open:'종가 지지 이탈 → 다음 시가 손절',five_session_time_exit:'5거래일 종가 청산',cancel_gap:'갭 +6% 초과 · 진입 취소',cancel_below_support:'지지선 이하 시가 · 진입 취소',cancel_locked_entry:'단일가격 · 진입 취소',pending_entry:'예정',pending_exit:'청산 대기',pending_stop_next_open:'다음 시가 손절 대기',unresolved_entry_missing:'진입일 자료 없음',unresolved_intervening_missing:'중간 일봉 누락',unresolved_locked_stop:'단일가격 손절 미확정',unresolved_locked_time_exit:'단일가격 청산 미확정'};
  const state = p => p.s === 'P' ? '예정' : (states[p.ex] || p.ex || '미확정');
  const badge = p => p.h20 ? ' <span style="color:#8fd6a8">+20✓</span>' : '';
  const oldCell = window.buildBestCell;
  window.buildBestCell = function (d, k, rec, other, dow) {
    let html = oldCell.apply(this, arguments);
    const row = arch()[k]; if (!row || !row.n) return html;
    let layer = `<div class="aside16-layer" style="border-top:1px dashed #366d60;margin-top:4px;padding-top:3px;color:${color};font-size:10px"><b>🅿 어사이드16 · ${row.n}종목</b><span style="color:#8487bd"> · ${esc(row.구간)}</span>`;
    row.a.forEach(p => {
      const tip = `전일 종가 ${won(p.pc)} · 지지 ${won(p.st)} · 과거빈도 점수 ${p.score}% (미래 확률 아님) · ATR ${p.atr}% · 20일 상승 ${p.mom}% · 거래량 ${p.vr}배 · 5일 최고 ${pct(p.mx)} · ${state(p)}`;
      layer += `<div title="${esc(tip)}" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis"><span style="color:#a9b9ee">8시 ${p.r}</span> <b>${esc(p.n)}</b> ${p.p == null ? `<span style="color:#8487bd">${esc(state(p))}</span>` : pct(p.p)}${badge(p)}</div>`;
    });
    layer += '</div>';
    if (!html.match(/^<div[^>]*\bhas-data\b/)) html = html.replace('class="cal-cell', 'class="cal-cell has-data');
    if (!html.match(/^<div[^>]*\bonclick=/)) html = html.replace('data-date="' + k + '"', 'data-date="' + k + '" onclick="openBestDetail(\'' + k + '\')" style="cursor:pointer"');
    const end = html.lastIndexOf('</div>');
    return html.slice(0, end) + layer + html.slice(end);
  };
  const oldStrip = window.renderBestMonthStrip;
  window.renderBestMonthStrip = function () {
    const result = oldStrip.apply(this, arguments);
    const strip = document.getElementById('best-month-strip'); if (!strip) return result;
    Array.from(strip.children).forEach((btn, i) => {
      const pre = `${bestY}-${String(i + 1).padStart(2, '0')}`;
      const n = Object.entries(arch()).reduce((sum, [k, r]) => sum + (k.startsWith(pre) ? r.n : 0), 0);
      if (n) { if (i + 1 !== bestM) btn.classList.add('has-data'); btn.title += ` · 어사이드16 ${n}종목`; }
    });
    return result;
  };
  const oldMeta = window.renderBestMeta;
  window.renderBestMeta = function () {
    const result = oldMeta.apply(this, arguments);
    const el = document.getElementById('best-meta'), m = window.어사이드16_META;
    if (!el || !m) return result;
    const s = m['9월'] || {}, names = m.예정 || [];
    el.innerHTML += `<div class="aside16-meta" style="margin-top:5px;color:${color}"><b>🅿 어사이드16</b> ${esc(m.기간[0])}~${esc(m.D)} · ${m.칸}칸 · 명단 ${m.전체.명단}건 · ${esc(m.예정일)} 예정 ${names.length}종목${names.length ? '(' + esc(names.join(', ')) + ')' : ''}${m.최신신호대기 ? ' · ⚠ 최신 일봉 갱신 대기' : ''}<br><span style="color:#ff9aaa">관찰용 · 수익 목적 미달</span> · 9월 고정85건: 5일 관측완료 ${s.관측완료}건 +20% ${s.도달20 == null ? '—' : s.도달20.toFixed(2) + '%'} · 청산 ${s.확정}건 평균 ${pct(s.평균)} · ✅ 고정85건 일치<br><span style="color:#8487bd">${esc(m.과거주의)} · 전 거래일 종가까지 선정 · +20% 익절/종가 지지 이탈 다음 시가 손절/5거래일/비용0.45%p · ${esc(m.지난판)}</span>${publishRecoveryNote()}</div>`;
    return result;
  };
  const oldDetail = window.openBestDetail;
  function hasOld(k) {
    if (typeof _bestArch === 'function' && (_bestArch()[k] || {}).n) return true;
    for (let i = 2; i <= 16; i++) {
      const f = window['_best' + i + 'Arch']; if (typeof f === 'function' && (f()[k] || {}).n) return true;
    }
    return false;
  }
  window.openBestDetail = function (k) {
    const row = arch()[k]; const older = hasOld(k);
    const result = oldDetail.apply(this, arguments); if (!row || !row.n) return result;
    const body = document.getElementById('stock-modal-body'), ov = document.getElementById('stock-modal-overlay');
    if (!body || !ov) return result;
    if (!older) body.innerHTML = `<div style="font-size:18px;font-weight:bold">🏅 베스트 · ${esc(k)}</div>`;
    const previous = body.querySelector('[data-aside16-detail]'); if (previous) previous.remove();
    let html = `<section data-aside16-detail style="margin-top:20px;color:${color}"><h3>🅿 어사이드16 · ${esc(k)} · ${esc(row.구간)}</h3>${publishRecoveryNote(k)}<p style="color:#8487bd">신호일 ${esc(row.신호일)} 종가까지 선정. 점수는 과거 +20% 빈도이며 미래 확률이 아닙니다.<br>추천일 시가 진입 · +6% 초과 갭/지지 이하/단일가 진입 취소 · +20% 익절 · 지지선 종가 이탈 다음 시가 손절 · 최대5거래일 · 비용0.45%p.<br>과거재적용 칸은 2026-08-31 모델을 이전 날짜에 적용한 참고 자료입니다. 현재 수익성 미달 · 관찰용.</p><div style="overflow-x:auto"><table style="border-collapse:collapse;color:#e4e6ff;font-size:12px"><tr>`;
    ['순위','종목','전일종가','시가 진입가','손절 지지선','과거빈도 점수','ATR%','20일 상승%','거래량배수','5일 최고','순수익','상태'].forEach(t => html += `<th style="padding:6px;border-bottom:1px solid #47655e">${t}</th>`);
    html += '</tr>';
    row.a.forEach(p => {
      const name = `<span style="cursor:pointer;font-weight:bold;color:${color}" onclick="_openStock(this,function(){openBestDetail('${k}')})" data-code="${esc(p.c)}" data-name="${esc(p.n)}" data-rate="0" data-amount="0" data-meta="어사이드16 ${k}" data-catalyst="">${esc(p.n)}</span> <small>${esc(p.c)}</small>`;
      const vals = [p.r,name,won(p.pc),won(p.b),won(p.st),p.score+'%',p.atr,p.mom,p.vr,pct(p.mx)+badge(p),pct(p.p),esc(state(p)) + (p.hf ? '' : ' · 가격 관측 미완료')];
      html += '<tr>' + vals.map(v => `<td style="padding:6px;border-bottom:1px solid #253a34;white-space:nowrap">${v}</td>`).join('') + '</tr>';
    });
    body.insertAdjacentHTML('beforeend', html + '</table></div></section>');
    ov.style.display = 'flex';
    window.__배지복귀 = function () { window.openBestDetail(k); };
    return result;
  };
  if (typeof bestY !== 'undefined') {
    window.renderBestCalendar();
  }
})();

/* 봉인된 어사이드38 뷰는 원형 유지. 이 보조표시는 데이터·선정·채점 로직을 변경하지 않는다. */
(function(){
 'use strict';
 if(window.__publishRecovery38Bridge)return;window.__publishRecovery38Bridge=true;
 const esc=v=>String(v==null?'':v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function note(k){const m=window.어사이드38_META,d=m&&(m.cutoff||m.D);if(!d||String(d).replace(/-/g,'')<'20261021')return '';
  const late=(!k||k==='2026-10-22')?' · 2026-10-22 복구분은 장 시작 후 사후 재구성, 실제 아침 봉인 아님':'';
  return '<div data-publish-recovery="38" style="margin:8px 0;padding:7px;border-left:3px solid #c59a58;color:#cbb48b;font-size:12px">어사이드38 채점판: 현재 정정가격 기준 · 정보기준 '+esc(d)+' · 원 게시 명단/선정 입력 보존 · 당시 원시가격 재현 아님 · 복구 전 채점판 별도 보관'+late+'</div>';}
 const oldMeta=window.renderBestMeta;
 window.renderBestMeta=function(){const r=oldMeta.apply(this,arguments);queueMicrotask(()=>{const e=document.querySelector('#best-meta .aside38-meta');if(e&&!e.querySelector('[data-publish-recovery="38"]')){const html=note();if(html)e.insertAdjacentHTML('beforeend',html);}});return r;};
 const oldDetail=window.openBestDetail;
 window.openBestDetail=function(k){const r=oldDetail.apply(this,arguments);queueMicrotask(()=>{const e=document.querySelector('#stock-modal-body [data-aside38-detail]');if(e&&!e.querySelector('[data-publish-recovery="38"]')){const html=note(k);if(html)e.insertAdjacentHTML('afterbegin',html);}});return r;};
})();
