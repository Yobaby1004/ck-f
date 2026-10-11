/* ㉟ 어사이드35 (2026-10-03 사용자 지시) = 손절매매법7(주도주 매일 1등 · 대형주 제외) · 🏅 베스트 달력에 묶음을 더한다(기존 자료·함수는 그대로).
   스킬 /어사이드35 · 빌더 = 주도주\_베스트_어사이드35_빌드.py (→ 매매법\손절매매법\v7_대형주제외\_08_달력.py · 아침 러너 _v7_아침.py 와 같은 계산) · 자료 = dashboard/data/베스트_어사이드35(_과거).js
   한마디로: 빨간 점 주도 테마 주도주 중 MA120 우상향 · 20일 고점 대비 0~−20% · 대형주(그날 시총 상위 100위) 아님 → 20일 거래대금 큰 순 1등(공식) · 2·3등(참고) · 최근 5일 1·2등 종목 건너뜀
   칸 = 매수일(8시 목록) · 결과는 규칙대로 샀다고 가정한 계산(매수일 시가 → +20% 지정가 · 종가 −10% 아래면 그 종가 · 20거래일 만기 · 비용 0.3%)
   관찰용 · 매수추천 아님 · 학습 구간(2022-07~2024)에서 시장 무작위보다 나빴다
   감싸는 함수 = buildBestCell · renderBestMonthStrip · renderBestMeta · openBestDetail (어사이드23·34_뷰.js 와 같은 방식 · 그 뒤에 읽는다) */
(function () {
  'use strict';
  if (window.__aside35Installed) return;
  const originals = ['buildBestCell', 'renderBestMonthStrip', 'renderBestMeta', 'openBestDetail'];
  if (originals.some(n => typeof window[n] !== 'function')) { console.error('어사이드35: 베스트 달력 함수가 없습니다'); return; }
  window.__aside35Installed = true;
  const color = '#ff4f7b', line = '#5a2333';
  const arch = () => window.어사이드35_ARCHIVE || {};
  const NM = () => window.어사이드35_NAMES || {};
  const I = {};
  (window.어사이드35_COLS || ['c', 'r', 'th', 'tr', 'sr', 'ap', 's1', 'pc', 'chg', 'dd', 'a20', 'cap', 'b', 'bd', 's', 'p', 'k', 'ed', 'w', 'mx', 'mae', 'lb']).forEach((c, i) => { I[c] = i; });
  const g = (x, key) => x[I[key]];
  const esc = v => String(v == null ? '' : v).replace(/[&<>"']/g, ch => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[ch]));
  const pct = (v, dg) => v == null ? '—' : `<span style="color:${v >= 0 ? '#ff8a8a' : '#7ea6ff'}">${v >= 0 ? '+' : ''}${Number(v).toFixed(dg == null ? 1 : dg)}%</span>`;
  const won = v => v == null ? '—' : Number(v).toLocaleString('ko-KR', {maximumFractionDigits: 0});
  const ymd = s => { s = String(s || ''); return s.length === 8 ? `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6)}` : s; };
  const md = s => { s = String(s || ''); return s.length === 8 ? `${s.slice(4, 6)}/${s.slice(6)}` : s; };
  const name = x => (NM()[g(x, 'c')] || [g(x, 'c')])[0];
  const mkt = x => (NM()[g(x, 'c')] || ['', ''])[1];
  const ST = {C: '확정', H: '결과대기', P: '예정(목록만)', L: '봉 늦음(천프정 미수집)', S: '자료끊김(정지·폐지)'};
  const WHY = {1: '익절 +20%', 2: '손절(종가 −10% 아래)', 3: '20일 만기'};
  const SHORT = {1: '익절', 2: '손절', 3: '만기'};
  const RK = {1: '1등', 2: '2등', 3: '3등'};
  const res = x => {
    const s = g(x, 's');
    if (s === 'C') return `${pct(g(x, 'p'))} <span style="color:#8487bd">${SHORT[g(x, 'w')] || ''}</span>`;
    if (s === 'H') return `<span style="color:#ffc454">대기 ${g(x, 'k')}일</span> ${pct(g(x, 'p'))}${g(x, 'lb') ? ` <span style="color:#8487bd">${md(g(x, 'lb'))}봉까지</span>` : ''}`;
    if (s === 'L') return '<span style="color:#ffc454">봉 늦음</span>';
    if (s === 'P') return '<span style="color:#7ee8ff">예정</span>';
    return `<span style="color:#8487bd">${ST[s] || s}</span>`;
  };
  const late = (x, k) => g(x, 'bd') && String(g(x, 'bd')) !== String(k).replace(/-/g, '') ? ` · ★실제 매수 ${md(g(x, 'bd'))}(거래정지 등으로 늦음)` : '';
  const tipOf = (x, k) => `${RK[g(x, 'r')]} · 주도 테마 ${g(x, 'th')}(${g(x, 'tr')}위)${g(x, 's1') ? ' · 2주+ 상위3' : ''} · 테마 안 ${g(x, 'sr')}위 · 20카드일 ${g(x, 'ap')}번 · 신호일 종가 ${won(g(x, 'pc'))}(${g(x, 'chg')}%) · 20일 고점 대비 ${g(x, 'dd')}% · 시총 ${g(x, 'cap') == null ? '—' : g(x, 'cap') + '조'} · 20일 대금 ${won(g(x, 'a20'))}억 · 매수가 ${won(g(x, 'b'))}${late(x, k)} · ${ST[g(x, 's')] || ''}${g(x, 'ed') ? ' ' + md(g(x, 'ed')) + ' ' + (WHY[g(x, 'w')] || '') : ''} · 20일 안 최고 ${g(x, 'mx') == null ? '—' : g(x, 'mx') + '%'} 최저 ${g(x, 'mae') == null ? '—' : g(x, 'mae') + '%'}${(g(x, 's') === 'H' || g(x, 's') === 'L') && g(x, 'lb') ? ` · 천프정 이 종목 봉이 ${md(g(x, 'lb'))} 까지(수집 늦음)` : ''}`;

  const oldCell = window.buildBestCell;
  window.buildBestCell = function (d, k, rec, other, dow) {
    let html = oldCell.apply(this, arguments);
    const row = arch()[k]; if (!row) return html;
    let layer = `<div class="aside35-layer" style="border-top:1px dashed ${line};margin-top:4px;padding-top:3px;color:${color};font-size:10px" title="㉟ 어사이드35(손절매매법7 · 주도주 매일 1등 · 대형주 제외) · 신호일 ${ymd(row.sd)} 장마감까지 보고 고름 · 무리 ${row.u}종목 · 눌러서 자세히"><b>㉟ 어사이드35</b> <span style="color:#8487bd">무리 ${row.u}</span>${row.e ? ' <span style="color:#8487bd" title="2022-07 전 = 월간 카드 20일 창이 덜 참 · 분석(학습 2022-07~) 밖">앞</span>' : ''}`;
    if (!row.n) layer += `<div style="color:#8487bd">없음(무리 전부 최근 5일 안 뽑힘)</div>`;
    row.a.forEach(x => {
      const r = g(x, 'r');
      layer += `<div title="${esc(tipOf(x, k))}" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;${r === 1 ? '' : 'opacity:.72;font-size:9.5px'}">${r === 1 ? '🥇' : r + '.'} <b>${esc(name(x))}</b> ${res(x)}</div>`;
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
      const n = Object.entries(arch()).reduce((s, [k, r]) => s + (k.startsWith(pre) ? r.a.filter(x => g(x, 'r') === 1).length : 0), 0);
      if (n) { if (i + 1 !== bestM) btn.classList.add('has-data'); btn.title += ` · 어사이드35 1등 ${n}`; }
    });
    return result;
  };

  const sline = T => T && T.n ? `${Number(T.n).toLocaleString('ko-KR')}건 평균 ${pct(T.rr, 2)} 중앙 ${pct(T.med, 2)} 승률 ${T.win}% 평균손실 ${pct(T.loss, 1)} · +20% 익절 ${T.tgt}% · 손절 ${T.stop}%` : '—';
  const oldMeta = window.renderBestMeta;
  window.renderBestMeta = function () {
    const result = oldMeta.apply(this, arguments);
    const el = document.getElementById('best-meta'), m = window.어사이드35_META;
    if (!el) return result;
    if (!m) { el.innerHTML += '<br><span style="color:#ff9aaa">❌ 베스트_어사이드35.js 가 안 읽혔다 = 주도주\\_베스트_어사이드35_빌드.py 실행</span>'; return result; }
    const E = m.예정 || {}, Y = (m.연도 || []).find(r => typeof bestY !== 'undefined' && r.y === bestY);
    const pl = (E.종목 || []).map(x => `${x[1]}등 ${x[0]}(${x[2]})`).join(', ');
    el.innerHTML += `<div class="aside35-meta" style="margin-top:5px;color:${color}"><b>㉟ 어사이드35</b>(손절매매법7 · 주도주 매일 1등 · 대형주 제외) ${esc(m.첫칸)}~${esc(m.끝칸)} · ${Number(m.칸).toLocaleString('ko-KR')}칸 · 무리 하루 ${m.무리하루}종목`
      + ` · 1등 확정 ${sline(m.전체1)} · 결과대기 ${m.결과대기}${m.봉늦음 ? ` · 천프정 봉 늦음 ${m.봉늦음}` : ''}`
      + (Y && Y.n ? ` · ${bestY}년 1등 ${Y.n}건 평균 ${pct(Y.rr, 2)} 중앙 ${pct(Y.med, 2)}` : '')
      + `<br>${E.막힘 ? `<span style="color:#ffc454">${esc(E.막힘)}</span>` : `${ymd(E.매수일)} 8시 = ${esc(pl)}`}`
      + (m.기준 && m.들어옴 / m.기준 < 0.97 ? ` · <span style="color:#ffc454">천프정 ${ymd(m.마지막봉)} 봉이 직전 5거래일 거래 종목 ${m.기준} 중 ${m.들어옴}만 들어옴</span>` : '')
      + `<br><span style="color:#ff9aaa">${esc(m.판정)}</span> · 학습(2022-07~2024) 1등 ${sline(m.학습1)}(시장 무작위 ${pct(m.시장 && m.시장.학습, 2)}) · 시험(2025~2026-08 · 반쯤 본 구간) ${sline(m.시험1)}(시장 ${pct(m.시장 && m.시장.시험, 2)}) · 9월~ ${sline(m.이후1)} · 참고 2등 ${sline(m.전체2)} · 3등 ${sline(m.전체3)}`
      + ` · ${esc(m.대조)} · ${esc(m.재현)} · ${esc(m.지난판)}`
      + `<br><span style="color:#8487bd">무리 = 빨간 점 주도 테마(10개)의 주도주(20카드일 월간 칸 등장 상위 3) · 일반 주식(스팩·우선주·리츠·펀드 제외) · 종가 1,000원+ · 20일 대금 5억+ · MA120 우상향 · 20일 고점 대비 0~−20% · 대형주(그날 시총 전체 상위 100위) 제외 → 20일 평균 거래대금 큰 순 · 최근 5일 1·2등 종목 건너뜀 · 칸 = 매수일 시가 → +20% 지정가 · 종가 −10% 아래 손절 · 20거래일 만기 · 비용 0.3% · 「앞」 = 2022-07 전(카드 창 덜 참) · 월간 카드가 있어야 계산(2022-06 부터) · 평균손실 −13% 안팎(손절 −10% 에 갭) · 지금 상장 종목만이라 생존편향</span></div>`;
    return result;
  };

  const oldDetail = window.openBestDetail;
  window.openBestDetail = function (k) {
    const row = arch()[k];
    const body = document.getElementById('stock-modal-body'), ov = document.getElementById('stock-modal-overlay');
    if (!row || !body || !ov) return oldDetail.apply(this, arguments);
    ov.style.display = 'none';
    const result = oldDetail.apply(this, arguments);
    if (ov.style.display !== 'flex') body.innerHTML = `<div style="font-size:18px;font-weight:bold">🏅 베스트 · ${esc(k)}</div>`;
    const prev = body.querySelector('[data-aside35-detail]'); if (prev) prev.remove();
    let html = `<section data-aside35-detail style="margin-top:20px;color:${color}"><h3 style="margin:0">㉟ 어사이드35 · 매수일 ${esc(k)} · 무리 ${row.u}종목 중 ${row.n} <span style="font-size:12px;color:#ff9aaa;font-weight:600">관찰용 · 매수추천 아님</span></h3>`
      + `<p style="color:#8487bd;font-size:12px;line-height:1.6;margin:6px 0">손절매매법7(주도주 매일 1등 · 대형주 제외) · 신호일 <b style="color:#c9cbe8">${ymd(row.sd)}</b> 장마감 자료 + 그날까지 월간 카드만 보고 고름${row.e ? ' · <b style="color:#ffc454">2022-07 전 = 카드 20일 창이 덜 참 · 분석 밖</b>' : ''} · 1등 = 공식 · 2·3등 = 참고 · 순서 = 20일 평균 거래대금 큰 순(최근 5일 1·2등 종목 건너뜀)<br>`
      + `<b style="color:#c9cbe8">결과는 규칙대로 샀다고 가정한 계산(실제 매매와 무관)</b> · 매수일 시가 → +20% 지정가(둘째 날부터 시가가 +20% 위면 시가) · 종가가 매수가 −10% 아래면 그 종가 · 20거래일 만기 · 비용 0.3%</p>`;
    if (!row.n) html += '<p>없음 = 그날 무리가 전부 최근 5일 안에 1·2등으로 뽑힌 종목이었다.</p>';
    else {
      html += `<div style="overflow-x:auto"><table style="border-collapse:collapse;color:#e4e6ff;font-size:12px"><tr>`;
      ['순위', '종목', '주도 테마(순위)', '테마 안 순위 · 20카드일 등장', '신호일 종가(등락)', '20일 고점 대비', '시총', '20일 대금(억)', '매수가(시가)', '결과', '수익', '보유일', '청산일·사유', '20일 안 최고', '20일 안 최저'].forEach(t => html += `<th style="padding:5px 7px;border-bottom:1px solid ${line};color:#8487bd;white-space:nowrap;text-align:left">${t}</th>`);
      html += '</tr>';
      row.a.forEach(x => {
        const nmEl = `<span style="cursor:pointer;font-weight:bold;color:${color}" onclick="_openStock(this,function(){openBestDetail('${k}')})" data-code="${esc(g(x, 'c'))}" data-name="${esc(name(x))}" data-rate="0" data-amount="0" data-meta="㉟어사이드35 ${k}" data-catalyst="">${esc(name(x))}</span> <small style="color:#6b6e9c">${esc(g(x, 'c'))} ${esc(mkt(x))}</small>`;
        const s = g(x, 's'), done = s === 'C' || s === 'H';
        const vals = [RK[g(x, 'r')], nmEl, `${esc(g(x, 'th'))}(${g(x, 'tr')})${g(x, 's1') ? ' · 2주+ 상위3' : ''}`, `${g(x, 'sr')} · ${g(x, 'ap')}번`, `${won(g(x, 'pc'))} (${pct(g(x, 'chg'))})`, pct(g(x, 'dd')),
          g(x, 'cap') == null ? '—' : g(x, 'cap') + '조', won(g(x, 'a20')), won(g(x, 'b')) + (late(x, k) ? ` <small style="color:#ffc454">${md(g(x, 'bd'))} 매수</small>` : ''),
          ST[s] || s, done ? pct(g(x, 'p'), 2) : '—', done ? g(x, 'k') + '일' : '—', g(x, 'ed') ? `${ymd(g(x, 'ed'))} ${WHY[g(x, 'w')] || ''}` : '—',
          done ? pct(g(x, 'mx')) : '—', done ? pct(g(x, 'mae')) : '—'];
        html += '<tr>' + vals.map(v => `<td style="padding:5px 7px;border-bottom:1px solid #3a2430;white-space:nowrap">${v}</td>`).join('') + '</tr>';
      });
      html += '</table></div>';
    }
    body.insertAdjacentHTML('beforeend', html + '</section>');
    ov.style.display = 'flex';
    window.__배지복귀 = function () { window.openBestDetail(k); };
    return result;
  };
  if (typeof bestY !== 'undefined' && typeof window.renderBestCalendar === 'function') {
    try { window.renderBestCalendar(); } catch (e) { console.warn('어사이드35 다시 그리기 실패', e); }
  }
})();
