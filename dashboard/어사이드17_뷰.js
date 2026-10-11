/* 🆀 어사이드17 (2026-10-01 사용자 지시) = 상승전매매법6 v1 · 테마 후발주 · 🏅 베스트 달력에 묶음을 더한다(기존 자료·함수는 그대로).
   스킬 /어사이드17 · 빌더 = 주도주\_베스트_어사이드17_빌드.py (→ 매매법\상승전매매법6\s6_달력.py) · 자료 = dashboard/data/베스트_어사이드17(_과거).js
   한마디로: 지난 2년 같은 날 함께 +8% 급등하던 '짝'이 어제 +15%(50억+) 급등했는데 아직 안 오른 종목(어제 +3% 미만 · 20일 안 +15% 급등 없음 · 20일 바닥 +15% 이내) · 하루 최대 5
   칸 = 매수일(8시 명단) · 결과는 규칙대로 샀다고 가정한 계산(매수일 시가 → 5번째 거래일 종가 · 비용 0.35%p) · 관찰전용 · 매수추천 아님
   감싸는 함수 = buildBestCell · renderBestMonthStrip · renderBestMeta · openBestDetail (어사이드16_뷰.js 와 같은 방식 · 그 뒤에 읽는다) */
(function () {
  'use strict';
  if (window.__aside17Installed) return;
  const originals = ['buildBestCell', 'renderBestMonthStrip', 'renderBestMeta', 'openBestDetail'];
  if (originals.some(n => typeof window[n] !== 'function')) { console.error('어사이드17: 베스트 달력 함수가 없습니다'); return; }
  window.__aside17Installed = true;
  const color = '#ffab91', dim = '#c98d7a';
  const arch = () => window.어사이드17_ARCHIVE || {};
  const esc = v => String(v == null ? '' : v).replace(/[&<>"']/g, ch => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[ch]));
  const pct = (v, dg) => v == null ? '—' : `<span style="color:${v >= 0 ? '#ff8a8a' : '#7ea6ff'}">${v >= 0 ? '+' : ''}${Number(v).toFixed(dg == null ? 1 : dg)}%</span>`;
  const won = v => v == null ? '—' : Number(v).toLocaleString('ko-KR', {maximumFractionDigits: 0});
  const ymd = s => { s = String(s || ''); return s.length === 8 ? `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6)}` : s; };
  const ST = {C: '5일째 종가', H: '결과대기', P: '예정(명단만)', S: '자료끊김', N: '매수불가', X: '분할·병합'};
  const res = p => p.s === 'C' ? pct(p.p) + (p.h20 ? ' <span style="color:#ff8a8a">+20✓</span>' : '')
    : p.s === 'H' ? `<span style="color:#ffc454">결과대기 ${p.kd}/5</span>${p.h20 ? ' <span style="color:#ff8a8a">+20✓</span>' : ''}`
    : p.s === 'P' ? '<span style="color:#7ee8ff">예정</span>' : `<span style="color:#8487bd">${ST[p.s] || p.s}</span>`;

  const oldCell = window.buildBestCell;
  window.buildBestCell = function (d, k, rec, other, dow) {
    let html = oldCell.apply(this, arguments);
    const row = arch()[k]; if (!row || !row.n) return html;
    let layer = `<div class="aside17-layer" style="border-top:1px dashed #6b4436;margin-top:4px;padding-top:3px;color:${color};font-size:10px" title="🆀 어사이드17(상승전매매법6 · 테마 후발주) · 신호일 ${ymd(row.신호일)} 종가까지 보고 고름 · 짝이 급등했는데 아직 안 오른 종목"><b>🆀 어사이드17 · ${row.n}종목</b>`;
    row.a.forEach(p => {
      const tip = `짝 ${p.ld}(신호일 +${p.lr}%)과 지난 2년 같은 날 급등 ${p.C}번${p.k > 1 ? ' 외 ' + (p.k - 1) + '개' : ''} · 점수 ${p.S} · 신호일 ${p.chg}% · 20일 바닥 +${p.fl}% · 매수가 ${won(p.b)} · 5일 최고 ${p.mx == null ? '—' : p.mx + '%'}`;
      layer += `<div title="${esc(tip)}" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis"><b>${esc(p.n)}</b> ${res(p)}</div>`;
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
    const strip = document.getElementById('best-month-strip'); if (!strip || typeof bestY === 'undefined') return result;
    Array.from(strip.children).forEach((btn, i) => {
      const pre = `${bestY}-${String(i + 1).padStart(2, '0')}`;
      const n = Object.entries(arch()).reduce((s, [k, r]) => s + (k.startsWith(pre) ? r.n : 0), 0);
      if (n) { if (i + 1 !== bestM) btn.classList.add('has-data'); btn.title += ` · 어사이드17 ${n}종목`; }
    });
    return result;
  };

  const oldMeta = window.renderBestMeta;
  window.renderBestMeta = function () {
    const result = oldMeta.apply(this, arguments);
    const el = document.getElementById('best-meta'), m = window.어사이드17_META;
    if (!el) return result;
    if (!m) { el.innerHTML += '<br><span style="color:#ff9aaa">❌ 베스트_어사이드17.js 가 안 읽혔다 = 주도주\\_베스트_어사이드17_빌드.py 실행</span>'; return result; }
    const T = m.전체 || {}, H = m.HO || {}, E = m.예정 || {}, Y = (m.연도 || []).find(r => typeof bestY !== 'undefined' && r.y === bestY);
    el.innerHTML += `<div class="aside17-meta" style="margin-top:5px;color:${color}"><b>🆀 어사이드17</b>(상승전매매법6 · 테마 후발주) ${ymd(m.첫칸.replace(/-/g, ''))}~${ymd(m.끝칸.replace(/-/g, ''))} · ${Number(m.칸).toLocaleString('ko-KR')}칸 · 확정 ${Number(T.n || 0).toLocaleString('ko-KR')}건 +20% ${T.up}% · 5일째 평균 ${pct(T.rr, 2)} 중앙 ${pct(T.med, 2)} · 결과대기 ${m.결과대기}`
      + (Y && Y.n ? ` · ${bestY}년 ${Y.n}건 +20% ${Y.up}% 평균 ${pct(Y.rr, 2)}` : '')
      + ` · ${ymd(E.매수일)} 8시 예정 ${(E.종목 || []).length}종목${(E.종목 || []).length ? '(' + esc(E.종목.join(', ')) + ')' : ''}${m.마지막봉 !== m.삼성최신 ? ` · <span style="color:#ffc454">천프정 ${ymd(m.삼성최신)} 봉이 일부 종목만 들어와 ${ymd(m.마지막봉)} 까지만 계산</span>` : ''}`
      + `<br><span style="color:#ff9aaa">${esc(m.판정)}(관문 ${m.관문통과}/5) · 매수추천 아님</span> · 검증 2023~2026-08 +20% ${H.hit != null ? (H.hit * 100).toFixed(1) : '—'}%(상승 전 무작위의 ${H.lift != null ? H.lift.toFixed(2) : '—'}배 · 변동성 맞춰도 ${H.lift_v != null ? H.lift_v.toFixed(2) : '—'}배) · -20% 급락도 ${H.dlift != null ? H.dlift.toFixed(2) : '—'}배 · 중앙 ${H.med != null ? pct(H.med * 100, 2) : '—'} · ${esc(m.대조)}`
      + `<br><span style="color:#8487bd">짝 = 지난 2년 같은 날 함께 +8% 급등 3번+ · 어제 짝 +15%·50억 급등 · 나는 어제 +3% 미만 · 20일 안 +15% 없음 · 20일 바닥 +15% 이내 · 매수일 시가 → 5거래일 · 2015 이전 칸은 지금 상장 종목만이라 좋게 보일 수 있음</span></div>`;
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
    const prev = body.querySelector('[data-aside17-detail]'); if (prev) prev.remove();
    let html = `<section data-aside17-detail style="margin-top:20px;color:${color}"><h3 style="margin:0">🆀 어사이드17 · 매수일 ${esc(k)} <span style="font-size:12px;color:#ff9aaa;font-weight:600">관찰전용 · 매수추천 아님</span></h3>`
      + `<p style="color:#8487bd;font-size:12px;line-height:1.6;margin:6px 0">상승전매매법6(테마 후발주) · 신호일 <b style="color:#c9cbe8">${ymd(row.신호일)}</b> 종가까지만 보고 고름 · 지난 2년 같은 날 함께 +8% 급등하던 짝이 신호일에 +15%(50억+) 급등했는데 아직 안 오른 종목 · 점수 = 그날 급등한 짝들과 같이 급등한 횟수 합<br>`
      + `<b style="color:#c9cbe8">결과는 규칙대로 샀다고 가정한 계산(실제 매매와 무관)</b> · 매수일 시가 → 5번째 거래일 종가(비용 0.35%p) · +20✓ = 5거래일 안 고가가 매수가 +20% 에 닿음</p><div style="overflow-x:auto"><table style="border-collapse:collapse;color:#e4e6ff;font-size:12px"><tr>`;
    ['순위', '종목', '신호일 종가(등락)', '20일 바닥 대비', '신호일에 급등한 짝', '같이 급등', '점수', '매수가(시가)', '5일 최고', '5일 최저', '+20% 닿은 날', '결과', '5일째 수익'].forEach(t => html += `<th style="padding:5px 7px;border-bottom:1px solid #6b4436;color:#8487bd;white-space:nowrap;text-align:left">${t}</th>`);
    html += '</tr>';
    row.a.forEach(p => {
      const name = `<span style="cursor:pointer;font-weight:bold;color:${color}" onclick="_openStock(this,function(){openBestDetail('${k}')})" data-code="${esc(p.c)}" data-name="${esc(p.n)}" data-rate="0" data-amount="0" data-meta="🆀어사이드17 ${k}" data-catalyst="">${esc(p.n)}</span> <small style="color:#6b6e9c">${esc(p.c)} ${esc(p.m)}</small>`;
      const pend = !(p.s === 'C' || p.s === 'H');
      const vals = [p.r, name, `${won(p.pc)} (${pct(p.chg)})`, `+${p.fl}%`, `${esc(p.ld)} <span style="color:#ff8a8a">+${p.lr}%</span>${p.k > 1 ? ' 외 ' + (p.k - 1) + '개' : ''}`, `${p.C}번`, p.S,
        won(p.b), pend ? '—' : pct(p.mx), pend ? '—' : pct(p.mn), p.hd ? ymd(p.hd) : '—', ST[p.s] + (p.s === 'H' ? ` (${p.kd}/5일)` : '') + (p.ed ? ` · ${ymd(p.ed)}` : ''), pend ? '—' : pct(p.p, 2)];
      html += '<tr>' + vals.map(v => `<td style="padding:5px 7px;border-bottom:1px solid #3a2a24;white-space:nowrap">${v}</td>`).join('') + '</tr>';
    });
    body.insertAdjacentHTML('beforeend', html + '</table></div></section>');
    ov.style.display = 'flex';
    window.__배지복귀 = function () { window.openBestDetail(k); };
    return result;
  };
  if (typeof bestY !== 'undefined' && typeof window.renderBestCalendar === 'function') {
    try { window.renderBestCalendar(); } catch (e) { console.warn('어사이드17 다시 그리기 실패', e); }
  }
})();
