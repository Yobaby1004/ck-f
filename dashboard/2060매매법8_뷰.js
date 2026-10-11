// 2060매매법8: 세 가지 고정 가설의 오전 8시 후보 달력. 수익/체결 계산 없음.
// 기존 ①~⑦ 달력과 설명을 기본으로 유지하고 같은 칸 아래에 ⑧을 추가한다.
(function () {
  'use strict';
  if (window.__r2060V8Installed) return;
  window.__r2060V8Installed = true;
  const C = '#d7a4ff', L = '#ebd7ff', DIM = '#9d88b9';
  const LABEL = {
    sandwich_2060: '① 2060 샌드위치',
    reference_ma5_hold: '② 기준봉·5일선 보항',
    support_break_reclaim: '③ 지지 이탈·저항 재돌파'
  };
  const SHORT = {sandwich_2060: '샌드위치', reference_ma5_hold: '기준봉·5일선', support_break_reclaim: '지지 재돌파'};
  let mode = 'all', first = true, legacyDescription = null;
  const archive = () => window.R2060_8_ARCHIVE || {};
  const meta = () => window.R2060_8_META || {};
  const esc = value => String(value == null ? '' : value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const ymd = value => { const s = String(value || ''); return /^\d{8}$/.test(s) ? `${s.slice(0,4)}-${s.slice(4,6)}-${s.slice(6,8)}` : s; };
  const md = value => ymd(value).slice(5).replace('-', '/');
  const num = value => value == null || !Number.isFinite(Number(value)) ? '—' : Number(value).toLocaleString('ko-KR', {maximumFractionDigits:2});
  const percent = value => value == null || !Number.isFinite(Number(value)) ? '—' : `${Number(value) >= 0 ? '+' : ''}${(Number(value)*100).toFixed(2)}%`;
  const year = () => typeof r2060Y !== 'undefined' ? r2060Y : new Date().getFullYear();
  const month = () => typeof r2060M !== 'undefined' ? r2060M : new Date().getMonth()+1;
  const key = (y,m,d) => `${y}-${String(m).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
  const allSignals = p => Array.isArray(p.signals) && p.signals.length ? p.signals : (p.patterns || []).map(method => ({method, entry_boundary:p.trigger, stop_boundary:p.stop_boundary}));
  const signalsText = p => allSignals(p).map(s => SHORT[s.method] || s.method).join(' · ');
  const has = r => !!(r && r.n && Array.isArray(r.p) && r.p.length);
  function conditions(s, p) {
    const a120 = s.sma120 == null ? p.ma120 : s.sma120, a240 = s.sma240 == null ? p.ma240 : s.sma240;
    const slope120 = s.sma120_slope20 == null && p.ma120_20ago ? a120/p.ma120_20ago-1 : s.sma120_slope20;
    const slope240 = s.sma240_slope20 == null && p.ma240_20ago ? a240/p.ma240_20ago-1 : s.sma240_slope20;
    return `120일 ${num(a120)} (${percent(slope120)}) · 240일 ${num(a240)} (${percent(slope240)})`;
  }
  function group(r) {
    if (!has(r)) return '';
    let h = `<div class="r2060-v8-group" style="margin-top:3px;border-top:1px dashed #624078;padding-top:3px"><div style="font-size:9.5px;color:${DIM}" title="오전 ${esc(ymd(r.d))} 08:00 · 입력은 ${esc(ymd(r.s))} 종가까지 · 조건부 후보 · 체결/수익 미평가">⑧ 신호 ${esc(md(r.s))} · <b style="color:${C}">${num(r.n)}</b>종목 · 후보</div>`;
    (r.p || []).forEach(p => {
      h += `<div style="font-size:10px;line-height:1.45;margin-top:2px;color:${L}" title="${esc(p.name)}(${esc(p.code)}) · ${esc(signalsText(p))} · 조건부 돌파 후보"><b>${esc(p.name)}</b><div style="font-size:9px;color:${DIM}">${esc(signalsText(p))}</div></div>`;
    });
    return h + '</div>';
  }
  function cell(d,k,r,other,dow) {
    let cls = 'cal-cell' + (other ? ' other-month' : '') + (dow === 0 ? ' sunday' : '') + (dow === 6 ? ' saturday' : '') + (has(r) ? ' has-data' : '');
    if (typeof TODAY !== 'undefined' && k === TODAY) cls += ' today';
    let h = `<div class="cell-day">${d}</div>`;
    if (has(r)) h += group(r);
    else if (r) h += `<div style="font-size:9px;color:#6b6e9c" title="${esc(ymd(r.s))}까지 검색 완료">⑧ ${esc(md(r.s))} · 해당 없음</div>`;
    return `<div class="${cls}"${r ? ` onclick="openR2060Detail('${k}')" style="cursor:pointer"` : ''}>${h}</div>`;
  }
  function detail(k,r) {
    const M = meta();
    let h = `<div class="r2060-v8-detail" style="padding:8px 2px 14px"><div style="font-size:19px;font-weight:700;color:${C}">⑧ 2060매매법8 · ${esc(k)} 오전 8시</div><div style="font-size:12px;color:${DIM};margin-top:7px;line-height:1.7">입력 마감 <b>${esc(ymd(r.s))} 종가</b> · 조건 통과 <b>${num(r.n)}</b>종목 · 3가지 수치 가설을 각각 검색 · <b>조건부 후보 · 체결과 수익은 미평가</b><br>120일선 &gt; 240일선 · 종가가 두 선 위 · 두 선이 20거래일 전보다 상승 · 이름·코드 기반 SPAC/우선주 제외 및 전일 상한가 근사 제외<br>종목 수 제한·수익률 순위 없음. 원문에 없는 수치가 포함된 가설이며 산업·테마 주도주 여부는 확인되지 않았습니다.</div>`;
    if (!has(r)) return h + '<div style="margin-top:12px;color:#c9cbe8">이날 고정 조건에 걸린 종목이 없습니다.</div></div>';
    h += '<table style="margin-top:12px;border-collapse:collapse;font-size:12px;color:#e4e6ff"><thead><tr><th>종목</th><th>패턴</th><th>조건부 돌파 경계</th><th>손절 경계(진단)</th><th>신호일 종가</th><th>120·240일선</th><th>20일 평균대금</th><th>패턴 근거일</th></tr></thead><tbody>';
    r.p.forEach(p => allSignals(p).forEach(s => {
      const evidence = [['기준봉',s.reference_date],['60선 저항',s.rejection_date],['지지 이탈',s.break_date],['첫 반등',s.first_reaction_date],['우측 저점',s.right_low_date]].filter(a=>a[1]).map(a=>`${a[0]} ${ymd(a[1])}`).join(' · ');
      const code = String(p.code || '').replace(/[^0-9A-Za-z]/g,'');
      const link = typeof window._openStock === 'function' ? `<span style="cursor:pointer;color:${L};font-weight:700" onclick="_openStock(this,function(){openR2060Detail('${k}')})" data-code="${esc(code)}" data-name="${esc(p.name)}" data-rate="0" data-amount="0" data-meta="2060매매법8 ${esc(k)}" data-catalyst="">${esc(p.name)}</span>` : `<b>${esc(p.name)}</b>`;
      const stopNote = s.method === 'sandwich_2060' ? '<div style="font-size:10px;color:#8487bd">신호 저가 / 돌파 경계 −5% 진단값</div>' : '';
      h += `<tr style="border-top:1px solid #624078"><td>${link}<div style="font-size:10px;color:#8487bd">${esc(code)}</div></td><td>${esc(LABEL[s.method] || s.method)}</td><td>${num(s.entry_boundary)} <b>초과</b></td><td>${num(s.stop_boundary)}${stopNote}</td><td>${num(s.previous_close == null ? p.close : s.previous_close)}</td><td>${esc(conditions(s,p))}</td><td>${num((s.mean_turnover20 == null ? p.turnover20 : s.mean_turnover20)/1e8)}억원</td><td>${esc(evidence || '—')}</td></tr>`;
    }));
    h += '</tbody></table><div style="margin-top:9px;font-size:11px;color:#8487bd;line-height:1.6">위 경계는 전일까지 정해진 조건입니다. 당일 시가·장중 돌파·취소 조건은 아직 확인하지 않았으며 실제 주문 가격이나 체결을 뜻하지 않습니다. 같은 종목이 여러 패턴에 걸리면 각 경계를 따로 표시합니다.</div>';
    if (M.protocol_sha256) h += `<div style="margin-top:7px;font-size:10px;color:#6b6e9c;overflow-wrap:anywhere">고정 규칙 SHA-256 ${esc(M.protocol_sha256)}</div>`;
    return h + '</div>';
  }
  function onlyMeta() {
    const el = document.getElementById('r2060-meta'); if (!el) return;
    const M = meta(), A = archive(), counts = M.pattern_counts || {};
    const days = Object.keys(A).filter(k=>k.startsWith(`${year()}-`));
    const yr = days.reduce((s,k)=>s+(A[k].n||0),0);
    el.innerHTML = `<span style="color:${C}">⑧ <b>2060매매법8</b></span> · 3개 수치 가설 · 입력 ${esc(ymd(M.last_bar))}까지 · 오전 달력 ${esc(ymd(M.first_morning))}~${esc(ymd(M.last_morning))} · ${num(Object.keys(A).length)}거래일 · 종목·일 후보 ${num(M.total_candidate_rows == null ? Object.values(A).reduce((s,r)=>s+(r.n||0),0) : M.total_candidate_rows)}건 · 패턴 신호 ${num(M.total_signal_rows)}건 · ${year()}년 후보 ${num(yr)}건<br><span style="color:${DIM}">${Object.keys(LABEL).map(id=>`${esc(LABEL[id])} ${num(counts[id]||0)}건`).join(' · ')} · 전일까지 정보로 검색 · 체결/수익 미평가</span>`;
  }
  function onlyStrip() {
    const el = document.getElementById('r2060-month-strip'); if (!el) return;
    el.innerHTML = '';
    const A = archive();
    for(let m=1;m<=12;m++) {
      const pre = `${year()}-${String(m).padStart(2,'0')}`;
      const days = Object.keys(A).filter(k=>k.startsWith(pre));
      const n = days.reduce((s,k)=>s+(A[k].n||0),0), b = document.createElement('button');
      b.className = 'ms-btn' + (m === month() ? ' active' : '') + (n && m !== month() ? ' has-data' : '');
      b.textContent = `${m}월`; b.title = days.length ? `⑧ ${days.length}거래일 검색 · 후보 ${n}건` : '⑧ 검색 자료 없음';
      b.onclick = () => { if (typeof r2060GoMonth === 'function') r2060GoMonth(m); };
      el.appendChild(b);
    }
  }
  function onlyCalendar() {
    const view = document.getElementById('r2060-view'); if (!view) return;
    const A = archive(), ks = Object.keys(A).sort();
    if (first) {
      first = false;
      const cur = `${year()}-${String(month()).padStart(2,'0')}`;
      if (ks.length && !ks.some(k=>k.startsWith(cur)) && typeof r2060Y !== 'undefined') {
        r2060Y = Number(ks[ks.length-1].slice(0,4)); r2060M = Number(ks[ks.length-1].slice(5,7));
      }
    }
    const y=year(), m=month(), t=document.getElementById('r2060-title'); if(t) t.textContent=`${y}년`;
    onlyMeta(); onlyStrip();
    const weekdays = typeof DOWNAMES !== 'undefined' ? DOWNAMES : ['일','월','화','수','목','금','토'];
    let h = '<div class="dow-row">'+weekdays.map(d=>`<div class="dow">${esc(d)}</div>`).join('')+'</div><div class="cal-grid">';
    const start = new Date(y,m-1,1).getDay(), dim = new Date(y,m,0).getDate();
    const cells = Math.ceil((start+dim)/7)*7;
    for (let i=0;i<cells;i++) {
      const d = new Date(y,m-1,i-start+1), k=key(d.getFullYear(),d.getMonth()+1,d.getDate());
      h += cell(d.getDate(),k,A[k],d.getMonth()+1!==m,d.getDay());
    }
    view.innerHTML=h+'</div>';
  }
  const previousRender = window.renderR2060Calendar;
  window.renderR2060Calendar = function () { if (mode === '8') onlyCalendar(); else if(typeof previousRender==='function') previousRender(); };
  const previousCell = window.buildR2060Cell;
  if(typeof previousCell==='function') window.buildR2060Cell = function(d,k,r,other,dow) {
    let h=previousCell(d,k,r,other,dow), r8=archive()[k]; if(!has(r8)) return h;
    const i=h.lastIndexOf('</div>'); h=h.slice(0,i)+group(r8)+h.slice(i);
    if(!h.includes('openR2060Detail(')) h=h.replace('<div class="cal-cell',`<div onclick="openR2060Detail('${k}')" style="cursor:pointer" class="cal-cell has-data`);
    return h;
  };
  const previousOpen = window.openR2060Detail;
  window.openR2060Detail = function(k) {
    const r=archive()[k], ov=document.getElementById('stock-modal-overlay'), body=document.getElementById('stock-modal-body');
    if(!r || !ov || !body) { if(mode!=='8' && typeof previousOpen==='function') previousOpen(k); return; }
    if(mode==='8') body.innerHTML=detail(k,r);
    else {
      body.insertAdjacentHTML('beforeend','<i id="r2060-v8-sentinel" hidden></i>');
      if(typeof previousOpen==='function') previousOpen(k);
      const sentinel=document.getElementById('r2060-v8-sentinel'); if(sentinel) body.innerHTML='';
      body.insertAdjacentHTML('beforeend',detail(k,r));
    }
    body.querySelectorAll('.r2060-v8-detail th,.r2060-v8-detail td').forEach(el=>{el.style.padding='5px 8px';el.style.textAlign='left';});
    ov.style.display='flex'; window.__배지복귀=function(){window.openR2060Detail(k);};
  };
  const previousMeta=window.renderR2060Meta;
  if(typeof previousMeta==='function') window.renderR2060Meta=function() {
    if(mode==='8') {onlyMeta();return;} previousMeta();
    const el=document.getElementById('r2060-meta'),M=meta();
    if(el) el.insertAdjacentHTML('beforeend',`<br><span style="color:${C}">⑧ <b>2060매매법8</b> · 3개 수치 가설 · ${num(M.total_signal_rows)}패턴 신호 · 입력 ${esc(ymd(M.last_bar))}까지 · 조건부 후보 · 체결/수익 미평가</span>`);
  };
  const previousStrip=window.renderR2060MonthStrip;
  if(typeof previousStrip==='function') window.renderR2060MonthStrip=function() {
    if(mode==='8') {onlyStrip();return;} previousStrip();
    const el=document.getElementById('r2060-month-strip');if(!el)return;
    Array.from(el.children).forEach((b,i)=>{const pre=`${year()}-${String(i+1).padStart(2,'0')}`,n=Object.keys(archive()).filter(k=>k.startsWith(pre)&&has(archive()[k])).length;if(n){b.title+=` · ⑧ ${n}일`;if(!b.classList.contains('active'))b.classList.add('has-data');}});
  };
  const description = `<div class="r2060-v8-note" style="margin-top:8px;color:${L}">⑧ <b>2060매매법8</b> = 이번 5종목을 검색한 고정 규칙의 3개 패턴(① 2060 샌드위치 · ② 기준봉·5일선 보항 · ③ 지지 이탈·저항 재돌파). 기본 화면은 기존 ①~⑦을 유지하고 같은 달력에 ⑧을 추가한 ‘전체 ①~⑧’입니다. 필요할 때만 ‘⑧만 보기’를 선택할 수 있습니다. ⑧ 칸은 오전 8시 검색일, 입력은 직전 거래일 종가까지입니다. 걸린 종목을 전부 표시하며 ⑧의 체결이나 사후 수익은 계산하지 않습니다. 장기선 상승은 20거래일 전 대비이며 샌드위치만 20일 연속 상승도 요구합니다. 수치 가설이며 산업·테마 주도주 여부는 아직 확인되지 않았습니다.</div>`;
  function setDescription() { const box=document.getElementById('r2060-desc');if(box&&legacyDescription!==null)box.innerHTML=(mode==='all'?legacyDescription:'')+description; }
  window.setR2060V8Mode=function(value){mode=value==='all'?'all':'8';const sel=document.getElementById('r2060-v8-mode');if(sel)sel.value=mode;setDescription();window.renderR2060Calendar();};
  function installControls() {
    const header=document.querySelector('#sec-r2060 .cal-right');
    if(header&&!document.getElementById('r2060-v8-mode')) {
      const box=document.createElement('label');box.style.cssText='margin-left:8px;color:#d7a4ff;font-size:12px';
      box.innerHTML='표시 <select id="r2060-v8-mode" style="background:#151223;color:#ebd7ff;border:1px solid #624078;border-radius:6px;padding:5px"><option value="all">전체 ①~⑧ (기본)</option><option value="8">⑧만 보기</option></select>';
      header.insertBefore(box,header.firstChild);const sel=document.getElementById('r2060-v8-mode');sel.value=mode;sel.addEventListener('change',e=>window.setR2060V8Mode(e.target.value));
    }
    const desc=document.getElementById('r2060-desc');
    if(desc&&legacyDescription===null)legacyDescription=desc.innerHTML;
    setDescription();
    const btn=Array.from(document.querySelectorAll('.h-nav-btn')).find(b=>(b.getAttribute('onclick')||'').includes("setView('r2060')"));
    if(btn&&!btn.title.includes('2060매매법8'))btn.title+=' · ⑧ 2060매매법8 = 전일까지 데이터로 3개 패턴 검색 · 전용 보기 가능';
    window.renderR2060Calendar();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',installControls);else installControls();
})();
