/* ㊲ 어사이드37 (2026-10-03 사용자 지시) = 주도섹터 눌림 v3 Aside판(등급제 · "일주일에 최소 2~3종목") · 🏅 베스트 달력에 묶음을 더한다(기존 자료·함수는 그대로).
   스킬 /어사이드37 · 빌더 = 주도주\_베스트_어사이드37_빌드.py (→ 매매법\주도섹터눌림_Aside\js3_달력.py · 잠긴 규칙 js3_rules.py · _잠금_v3.json) · 자료 = dashboard/data/베스트_어사이드37(_과거).js
   한마디로: 이번 달(20거래일)·이번 주(5거래일) 주도 섹터(월간 칸 테마 버블 강도) 안에서, 최근 20거래일 월간 칸에 자주 나온 주도주가 잠깐 눌린 날을 고른다.
   A = v1(20일 3번↑ 주도주 · 이번 달·이번 주 top3 섹터 · 고점 -10~-20% · 10일선 아래·20일선 위) · B = v2(같은 주도주·섹터 · 고점 -5~-25% · 20일선 위)
   C = 채움(20일 2번↑ 주도주 · 이번 달 top5 섹터 · 고점 -5~-30% · 60일선 위 · A·B 없는 날만 1종목) · 하루 최대 5(A→B) · 같은 종목 5거래일 재등장 금지
   칸 = 매수일(8시 명단) · 결과는 규칙대로 샀다고 가정한 계산 = 매수일 시가 → +20% 지정가 익절 · 종가가 20일선 아래면 손절 · 못 닿으면 20거래일째 종가(비용 0.35%p)
   관찰용 · 매수추천 아님(2026-01~08 시험 관문 1/4)
   감싸는 함수 = buildBestCell · renderBestMonthStrip · renderBestMeta · openBestDetail (어사이드29·36 뷰와 같은 방식 · 어사이드36_뷰.js 뒤에 읽는다) · 37번 = ㊲ */
(function () {
  'use strict';
  if (window.__aside37Installed) return;
  const originals = ['buildBestCell', 'renderBestMonthStrip', 'renderBestMeta', 'openBestDetail'];
  if (originals.some(n => typeof window[n] !== 'function')) { console.error('어사이드37: 베스트 달력 함수가 없습니다'); return; }
  window.__aside37Installed = true;
  const color = '#00e676', line = '#0d4f2e', SHOW = 5, BADGE = '㊲';
  const GC = {A: '#ffd740', B: '#69f0ae', C: '#90a4ae'};
  const arch = () => window.어사이드37_ARCHIVE || {};
  const NM = () => window.어사이드37_NAMES || {};
  const I = {};
  (window.어사이드37_COLS || ['c', 'r', 'nc', 'g', 'sec', 'pc', 'chg', 'ap', 'dd', 'p20', 'p60', 'b', 's', 'p', 'k', 'ed', 'mx', 'mn']).forEach((c, i) => { I[c] = i; });
  const g = (x, key) => x[I[key]];
  const esc = v => String(v == null ? '' : v).replace(/[&<>"']/g, ch => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[ch]));
  const pct = (v, dg) => v == null ? '—' : `<span style="color:${v >= 0 ? '#ff8a8a' : '#7ea6ff'}">${v >= 0 ? '+' : ''}${Number(v).toFixed(dg == null ? 1 : dg)}%</span>`;
  const sp = (v, dg) => v == null ? '—' : `${v >= 0 ? '+' : ''}${Number(v).toFixed(dg == null ? 1 : dg)}%`;
  const won = v => v == null ? '—' : Number(v).toLocaleString('ko-KR', {maximumFractionDigits: 0});
  const ymd = s => { s = String(s || ''); return s.length === 8 ? `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6)}` : s; };
  const md = s => { s = String(s || ''); return s.length === 8 ? `${s.slice(4, 6)}/${s.slice(6)}` : s; };
  const name = x => (NM()[g(x, 'c')] || [g(x, 'c')])[0];
  const mkt = x => (NM()[g(x, 'c')] || ['', ''])[1];
  const GT = {A: 'A급 = 20일 3번↑ 주도주 · 이번 달·이번 주 top3 섹터 · 고점 -10~-20% · 10일선 아래·20일선 위', B: 'B급 = 같은 주도주·섹터 · 고점 -5~-25% · 20일선 위',
              C: 'C급(채움) = 20일 2번↑ 주도주 · 이번 달 top5 섹터 · 고점 -5~-30% · 60일선 위 · A·B 없는 날만 1종목'};
  const ST = {T: '익절(+20%)', L: '손절(종가 20일선 아래)', E: '20일 만기', H: '결과대기', P: '예정(8시 명단)', S: '자료끊김', X: '분할·병합 의심(결과 뺌)', N: '매수불가'};
  const res = x => {
    const s = g(x, 's');
    if (s === 'T') return `<span style="color:#ff8a8a">익절 ${sp(g(x, 'p'))}</span>`;
    if (s === 'L') return `<span style="color:#7ea6ff">손절 ${sp(g(x, 'p'))}</span>`;
    if (s === 'E') return `20일 ${pct(g(x, 'p'))}`;
    if (s === 'H') return `<span style="color:#ffc454">결과대기 ${g(x, 'k')}/20</span> ${pct(g(x, 'p'))}`;
    if (s === 'P') return '<span style="color:#b9f6ca">예정</span>';
    return `<span style="color:#8487bd">${ST[s] || s}</span>`;
  };
  const tops = row => `이번 달 top3 ${(row.t3 || []).join('·') || '—'} · 이번 주 top3 ${(row.w3 || []).join('·') || '—'}`;

  const oldCell = window.buildBestCell;
  window.buildBestCell = function (d, k, rec, other, dow) {
    let html = oldCell.apply(this, arguments);
    const row = arch()[k]; if (!row || !row.n) return html;
    const cnt = {A: 0, B: 0, C: 0}; row.a.forEach(x => { cnt[g(x, 'g')] = (cnt[g(x, 'g')] || 0) + 1; });
    const gs = ['A', 'B', 'C'].filter(t => cnt[t]).map(t => `${t}${cnt[t]}`).join(' ');
    let layer = `<div class="aside37-layer" style="border-top:1px dashed ${line};margin-top:4px;padding-top:3px;color:${color};font-size:10px" title="${BADGE} 어사이드37(주도섹터 눌림 v3 · 등급제) · 신호일 ${ymd(row.sd)} 종가까지 보고 고름 · ${esc(tops(row))} · ${esc(GT.A)} · ${esc(GT.B)} · ${esc(GT.C)} · 눌러서 자세히"><b>${BADGE} 어사이드37 · ${row.n}종목</b> <span style="color:#8fbf9f">${gs}</span>${row.e ? ' <span style="color:#8487bd" title="월간 칸 자료 첫 20거래일 = 20일 창이 덜 참">앞</span>' : ''}`;
    row.a.slice(0, SHOW).forEach(x => {
      const tip = `${GT[g(x, 'g')] || ''} · 섹터 ${g(x, 'sec')} · 순위 ${g(x, 'r')}/${g(x, 'nc')} · 신호일 종가 ${won(g(x, 'pc'))}(${sp(g(x, 'chg'))}) · 월간 칸 20일 ${g(x, 'ap')}번 · 20일 고점 대비 ${sp(g(x, 'dd'))} · 20일선 대비 ${sp(g(x, 'p20'))} · 60일선 대비 ${sp(g(x, 'p60'))} · 매수가 ${won(g(x, 'b'))} · 익절가 ${g(x, 'b') == null ? '—' : won(g(x, 'b') * 1.2)} · ${ST[g(x, 's')] || ''}${g(x, 'ed') ? ' ' + md(g(x, 'ed')) : ''} · 20일 안 최고 ${sp(g(x, 'mx'))} 최저 ${sp(g(x, 'mn'))}`;
      layer += `<div title="${esc(tip)}" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis"><b>${esc(name(x))}</b><small style="color:${GC[g(x, 'g')] || '#ccc'}">${esc(g(x, 'g'))}급</small> ${res(x)}</div>`;
    });
    if (row.n > SHOW) layer += `<div style="color:#8487bd">외 ${row.n - SHOW}종목 (눌러서 전부)</div>`;
    layer += '</div>';
    if (!html.match(/^<div[^>]*\bhas-data\b/)) html = html.replace('class="cal-cell', 'class="cal-cell has-data');
    if (!html.match(/^<div[^>]*\bonclick=/)) html = html.replace('data-date="' + k + '"', 'data-date="' + k + '" onclick="openBestDetail(\'' + k + '\')" style="cursor:pointer"');
    const end = html.lastIndexOf('</div>');
    return html.slice(0, end) + layer + html.slice(end);
  };

  const oldStrip = window.renderBestMonthStrip;
  window.renderBestMonthStrip = function () {
    const result = oldStrip.apply(this, arguments);
    const strip = document.getElementById('best-month-strip'); if (!strip || typeof bestY === 'undefined') return result;
    Array.from(strip.children).forEach((btn, i) => {
      const pre = `${bestY}-${String(i + 1).padStart(2, '0')}`;
      const n = Object.entries(arch()).reduce((s, [k, r]) => s + (k.startsWith(pre) ? r.n : 0), 0);
      if (n) { if (i + 1 !== bestM) btn.classList.add('has-data'); btn.title += ` · 어사이드37 ${n}종목`; }
    });
    return result;
  };

  const st = s => s && s.n ? `끝난 매매 ${Number(s.n).toLocaleString('ko-KR')}건 평균 ${pct(s.rr, 2)} 중앙 ${pct(s.med, 2)} · 익절 ${s.tp}% 손절 ${s.sl}%` : '끝난 매매 0건';
  const tf = v => v == null ? '—' : pct(v * 100, 2);
  const oldMeta = window.renderBestMeta;
  window.renderBestMeta = function () {
    const result = oldMeta.apply(this, arguments);
    const el = document.getElementById('best-meta'), m = window.어사이드37_META;
    if (!el) return result;
    if (!m) { el.innerHTML += '<br><span style="color:#ff9aaa">❌ 베스트_어사이드37.js 가 안 읽혔다 = 주도주\\_베스트_어사이드37_빌드.py 실행</span>'; return result; }
    const E = m.예정 || {}, W = m.주 || {}, G = m.등급 || {}, Tz = (m.시험 || {})['2026'] || {}, Ho = (m.시험 || {}).HO || {};
    const Y = (m.연도 || []).find(r => typeof bestY !== 'undefined' && r.y === bestY);
    const names = (E.종목 || []).map((n, i) => `${n}(${(E.등급 || [])[i] || ''}급 · ${(E.섹터 || [])[i] || ''})`);
    const nxt = E.미래 ? `${ymd(E.매수일)} 8시 예정 ${names.length}종목${names.length ? '(' + esc(names.join(', ')) + ')' : '(신호 없음)'}` : `마지막 칸 ${ymd(E.매수일)} ${names.length}종목${names.length ? '(' + esc(names.join(', ')) + ')' : ''}`;
    el.innerHTML += `<div class="aside37-meta" style="margin-top:5px;color:${color}"><b>${BADGE} 어사이드37</b>(주도섹터 눌림 v3 · 등급제 A·B·C · 하루 최대 5 · 후보가 있을 때 최소 1) ${esc(m.첫칸)}~${esc(m.끝칸)} · ${Number(m.칸).toLocaleString('ko-KR')}칸(그 사이 거래일 ${Number(m.거래일).toLocaleString('ko-KR')}) · 명단 ${Number(m.종목수).toLocaleString('ko-KR')}(A ${m.등급수.A} · B ${m.등급수.B} · C ${m.등급수.C}) · 주 평균 ${W.평균}건(2건↑ 주 ${W.두건}% · 3건↑ ${W.세건}%) · ${st(m.전체)} · 등급별 A ${pct((G.A || {}).rr, 2)} · B ${pct((G.B || {}).rr, 2)} · C ${pct((G.C || {}).rr, 2)} · 결과대기 ${m.결과대기}`
      + (Y && Y.n ? ` · ${bestY}년 ${Y.n}건 평균 ${pct(Y.rr, 2)} 중앙 ${pct(Y.med, 2)} 익절 ${Y.tp}%` : '')
      + ` · ${nxt}`
      + (m.월간대기 ? ` · <span style="color:#ffc454">월간 칸이 ${ymd(m.월간)}까지라 그 뒤 명단은 아직 없음(/매매일 9.6 자료화 뒤 다시 채워짐 · 천프정 ${ymd(m.천프정)})</span>` : '')
      + `<br><span style="color:#ff9aaa">${esc(m.판정)} · 매수추천 아님 · 2026-01~08 시험 관문 ${m.관문통과}/4</span> · 시험 2026-01~08 평균 ${tf(Tz.평균)} 중앙 ${tf(Tz.중앙)}(같은 날 시장 ${tf(Tz.시장)}) · 2024-07~2025-12 평균 ${tf(Ho.평균)} · [대조] ${esc(m.대조)} · [재현] ${esc(m.재현)}`
      + (m.경고 ? `<br><span style="color:#ffc454">천프정 ${ymd(m.천프정)}: 최근 거래 종목 ${Number(m.기준).toLocaleString('ko-KR')}개 중 ${Number(m.들어옴).toLocaleString('ko-KR')}개 준비. 빠진 종목 결과는 마지막 확보 봉까지만 계산.</span>` : '')
      + `<br><span style="color:#8487bd">${esc(m.이음 || '')} · 연결 달력 통계는 원래 시험 통계와 표본이 다름 · 일부 9월 결과를 본 뒤 설계한 사후 연구로 미래 검증 필요.</span>`
      + `<br><span style="color:#8487bd">주도 섹터 = 월간 칸 테마(묶음) 버블 강도(나온 날 × 종목 수 × (1 + 평균 등락/10)) 순위 · A급 = 최근 20거래일 월간 칸 3번↑ 주도주 · 섹터가 이번 달(20거래일)·이번 주(5거래일) 모두 top3 · 20일 고점 대비 -10~-20% · 종가 10일선 아래·20일선 위 · B급 = 같은 주도주·섹터 · 고점 -5~-25% · 20일선 위 · C급(채움) = 20일 2번↑ · 이번 달 top5 · 고점 -5~-30% · 60일선 위 · A·B 없는 날만 1종목 · 순서 = A → B(그 안은 월간 칸 등장 많은 순 → 20일 거래대금) · 하루 최대 5 · 같은 종목 5거래일 재등장 금지 · 일반 주식(스팩·우선주·리츠 제외) · 매수 = 명단 날 시가 · 매도 = +20% 지정가 익절 / 종가가 20일선 아래면 그 종가 손절 / 20거래일째 종가 · 비용 0.35%p · 「앞」 = 월간 칸 자료 첫 20거래일(창 덜 참) · 칸 명단 = 검증 때 명단(2022-06~2026-08) + 9월 봉인 명단 그대로 이어 붙임</span></div>`;
    return result;
  };

  const oldDetail = window.openBestDetail;
  window.openBestDetail = function (k) {
    const row = arch()[k];
    const body = document.getElementById('stock-modal-body'), ov = document.getElementById('stock-modal-overlay');
    if (!row || !row.n || !body || !ov) return oldDetail.apply(this, arguments);
    ov.style.display = 'none';
    const result = oldDetail.apply(this, arguments);
    if (ov.style.display !== 'flex') body.innerHTML = `<div style="font-size:18px;font-weight:bold">🏅 베스트 · ${esc(k)}</div>`;
    const prev = body.querySelector('[data-aside37-detail]'); if (prev) prev.remove();
    let html = `<section data-aside37-detail style="margin-top:20px;color:${color}"><h3 style="margin:0">${BADGE} 어사이드37 · 매수일 ${esc(k)} · ${row.n}종목 <span style="font-size:12px;color:#ff9aaa;font-weight:600">관찰용 · 매수추천 아님</span></h3>`
      + `<p style="color:#8487bd;font-size:12px;line-height:1.6;margin:6px 0">주도섹터 눌림 v3(등급제) · 신호일 <b style="color:#c9cbe8">${ymd(row.sd)}</b> 종가까지만 보고 고름${row.e ? ' · <b style="color:#ffc454">월간 칸 첫 20거래일 = 창 덜 참</b>' : ''}<br>`
      + `<b style="color:#c9cbe8">그날 주도 섹터</b>: 이번 달(20거래일) top3 <b style="color:#c9cbe8">${esc((row.t3 || []).join(' · ') || '—')}</b> · 이번 주(5거래일) top3 <b style="color:#c9cbe8">${esc((row.w3 || []).join(' · ') || '—')}</b> · 이번 달 top5 ${esc((row.t5 || []).join(' · ') || '—')}<br>`
      + `${esc(GT.A)}<br>${esc(GT.B)}<br>${esc(GT.C)}<br>`
      + `<b style="color:#c9cbe8">결과는 규칙대로 샀다고 가정한 계산(실제 매매와 무관)</b> · 매수 = 명단 날 시가 · +20% 지정가 익절 · 종가가 20일선 아래면 그 종가 손절 · 못 닿으면 20거래일째 종가 · 비용 0.35%p · 20일 안 최고/최저 = 판 뒤도 포함한 20거래일 창</p><div style="overflow-x:auto"><table style="border-collapse:collapse;color:#e4e6ff;font-size:12px"><tr>`;
    ['순위/후보', '등급', '종목', '섹터', '신호일 종가(등락)', '월간 칸 20일', '20일 고점 대비', '20일선 대비', '60일선 대비', '매수가(시가)', '익절가(+20%)', '결과', '수익', '보유일', '끝난 날', '20일 안 최고', '20일 안 최저'].forEach(t => html += `<th style="padding:5px 7px;border-bottom:1px solid ${line};color:#8487bd;white-space:nowrap;text-align:left">${t}</th>`);
    html += '</tr>';
    row.a.forEach(x => {
      const nmEl = `<span style="cursor:pointer;font-weight:bold;color:${color}" onclick="_openStock(this,function(){openBestDetail('${k}')})" data-code="${esc(g(x, 'c'))}" data-name="${esc(name(x))}" data-rate="0" data-amount="0" data-meta="${BADGE}어사이드37 ${k}" data-catalyst="">${esc(name(x))}</span> <small style="color:#6b6e9c">${esc(g(x, 'c'))} ${esc(mkt(x))}</small>`;
      const s = g(x, 's'), has = s === 'T' || s === 'L' || s === 'E' || s === 'H';
      const vals = [`${g(x, 'r')}/${g(x, 'nc')}`, `<b style="color:${GC[g(x, 'g')] || '#ccc'}">${esc(g(x, 'g'))}급</b>`, nmEl, esc(g(x, 'sec')), `${won(g(x, 'pc'))} (${pct(g(x, 'chg'))})`, `${g(x, 'ap')}번`,
        pct(g(x, 'dd')), pct(g(x, 'p20')), pct(g(x, 'p60')), won(g(x, 'b')), g(x, 'b') == null ? '—' : won(g(x, 'b') * 1.2),
        (ST[s] || s) + (s === 'H' ? ` (${g(x, 'k')}/20일)` : ''), has ? pct(g(x, 'p'), 2) : '—', has ? `${g(x, 'k')}일` : '—', g(x, 'ed') ? ymd(g(x, 'ed')) : '—',
        g(x, 'b') == null ? '—' : pct(g(x, 'mx')), g(x, 'b') == null ? '—' : pct(g(x, 'mn'))];
      html += '<tr>' + vals.map(v => `<td style="padding:5px 7px;border-bottom:1px solid #1d3326;white-space:nowrap">${v}</td>`).join('') + '</tr>';
    });
    body.insertAdjacentHTML('beforeend', html + '</table></div></section>');
    ov.style.display = 'flex';
    window.__배지복귀 = function () { window.openBestDetail(k); };
    return result;
  };
  if (typeof bestY !== 'undefined' && typeof window.renderBestCalendar === 'function') {
    try { window.renderBestCalendar(); } catch (e) { console.warn('어사이드37 다시 그리기 실패', e); }
  }
})();
