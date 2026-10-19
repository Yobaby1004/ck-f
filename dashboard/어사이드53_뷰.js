/* 어사이드53 표시 전용: 기존 4개 함수를 감싸며 외부 자료와 기존 동작을 바꾸지 않는다. */
(function () {
  'use strict';
  if (window.__aside53Installed) return;
  const hooks = ['buildBestCell', 'renderBestMonthStrip', 'renderBestMeta', 'openBestDetail'];
  if (hooks.some(k => typeof window[k] !== 'function')) { console.warn('어사이드53: 베스트 표시 함수 대기'); return; }
  window.__aside53Installed = true;
  const TITLE = '어사이드53 · 첫이탈 관찰', BADGE = '㊂', COLOR = '#87b5c8', LINE = '#30434c', SHOW = 6;
  const COLS = ['c', 'r', 'gr', 'a', 'age', 'Q', 'B0', 'burst', 'pc', 'ma5', 'risk', 'near', 'sus', 's', 'p', 'b', 'tg', 'ex'];
  const archive = () => window.어사이드53_ARCHIVE || {};
  const get = (x, k) => x[(window.어사이드53_COLS || COLS).indexOf(k)];
  const esc = v => String(v == null ? '' : v).replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));
  const text = v => esc(String(v == null ? '' : v).replace(/(?:[A-Za-z]:[\\/]|\\\\)[^\s<>]*/g, '[경로 생략]'));
  const num = v => Number.isFinite(Number(v)) && v != null && v !== '' ? Number(v) : null;
  const count = v => Math.max(0, Math.trunc(num(v) || 0));
  const fmt = v => num(v) == null ? '자료 없음' : num(v).toLocaleString('ko-KR', {maximumFractionDigits: 2});
  const pct = v => num(v) == null ? '미확정' : `${num(v) >= 0 ? '+' : ''}${num(v).toFixed(2)}%`;
  const date = v => /^\d{8}$/.test(String(v)) ? `${String(v).slice(0, 4)}-${String(v).slice(4, 6)}-${String(v).slice(6)}` : String(v || '');
  const rows = (r, k) => Array.isArray(r[k]) ? r[k].filter(Array.isArray).slice().sort((a, b) => String(get(a, 'c')).localeCompare(String(get(b, 'c')))) : [];
  const counts = r => [count(r.n), count(r.cn), count(r.hn), count(r.unk)];
  const active = r => counts(r).some(Boolean) || ['a', 'w', 'h'].some(k => rows(r, k).length);
  const identity = x => (window.어사이드53_NAMES || {})[get(x, 'c')] || [get(x, 'c'), ''];
  const status = x => ({C: '일봉 시가 → +3% / 당일 종가 모의채점', P: '예정(미래 명단일)', U: '미확정(가격·분류·과거 호가)'}[get(x, 's')] || '미확정(상태 확인 필요)');
  const result = x => get(x, 's') === 'C' ? `모의 ${pct(get(x, 'p'))}` : status(x);
  const list = v => Array.isArray(v) ? v.map(date).map(text).join(', ') || '없음' : '자료 없음';
  const risks = x => Array.isArray(get(x, 'risk')) ? get(x, 'risk').map(text).join(', ') || '기록 없음' : '자료 없음';
  const notes = '관찰용·매수추천아님, 9월아침모의기지26평균-0.95%·전체27미확정, 원저자종가매수와다름';
  const boundary = '과거당시상품분류미확인·관측달력범위별근사';
  const calendar = r => ['공식대조', '공용달력참고', '2026공식대조', '공용관측달력 참고'].includes(r.calq) ? r.calq : '달력근거 미확정';

  const oldCell = window.buildBestCell;
  window.buildBestCell = function (d, k) {
    let html = oldCell.apply(this, arguments);
    const r = archive()[k];
    if (!r || !/^\d{4}-\d{2}-\d{2}$/.test(k) || typeof html !== 'string') return html;
    const a = rows(r, 'a'), [n, cn, hn, unk] = counts(r);
    let layer = `<div class="aside53-layer" style="border-top:1px dashed ${LINE};margin-top:4px;padding-top:3px;color:${COLOR};font-size:10px" title="${esc(TITLE)} · 신호일 ${esc(date(r.sd))} · ${calendar(r)} · 코드순 표시(추천순위 아님)"><b>${BADGE} ${TITLE}</b> <span>A/B ${n}종목</span>`;
    layer += `<div>A/B ${n} · C경고 ${cn} · 분류보류 ${hn}</div>`;
    if (!n && !a.length) layer += `<div>관측0·입력보류${unk} (현금0 아님)</div>`;
    else if (unk) layer += `<div>입력보류${unk} · 관측 수와 별개</div>`;
    a.slice(0, SHOW).forEach(x => { layer += `<div style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis" title="${esc(status(x))}">${esc(get(x, 'r'))}. <b>${esc(identity(x)[0])}</b> ${esc(get(x, 'gr'))} · ${esc(result(x))}</div>`; });
    if (a.length > SHOW) layer += `<div>외 ${a.length - SHOW}개 · 상세에서 A/B 전체</div>`;
    layer += '</div>';
    if (active(r)) html = html.replace(/^\s*<div\b[^>]*>/, root => {
      if (/\bclass="/.test(root)) root = root.replace(/\bclass="([^"]*)"/, (all, cls) => `class="${cls}${/(^|\s)has-data(\s|$)/.test(cls) ? '' : ' has-data'}"`);
      else root = root.replace('<div', '<div class="has-data"');
      if (!/\bonclick\s*=/.test(root)) root = root.replace('<div', `<div onclick="openBestDetail('${k}')"`);
      return root;
    });
    const end = html.lastIndexOf('</div>');
    return end < 0 ? html : html.slice(0, end) + layer + html.slice(end);
  };

  const oldStrip = window.renderBestMonthStrip;
  window.renderBestMonthStrip = function () {
    const result = oldStrip.apply(this, arguments), strip = document.getElementById('best-month-strip');
    if (!strip || typeof bestY === 'undefined') return result;
    Array.from(strip.children).forEach((btn, i) => {
      const prefix = `${bestY}-${String(i + 1).padStart(2, '0')}-`, total = [0, 0, 0, 0];
      Object.entries(archive()).forEach(([k, r]) => { if (k.startsWith(prefix)) counts(r).forEach((v, j) => { total[j] += v; }); });
      btn.title = btn.title.replace(/ · 어사이드53 A\/B \d+ · C \d+ · 분류보류 \d+ · 입력보류 \d+$/, '');
      if (total.some(Boolean)) {
        if (typeof bestM === 'undefined' || i + 1 !== bestM) btn.classList.add('has-data');
        btn.title += ` · 어사이드53 A/B ${total[0]} · C ${total[1]} · 분류보류 ${total[2]} · 입력보류 ${total[3]}`;
      }
    });
    return result;
  };

  const oldMeta = window.renderBestMeta;
  window.renderBestMeta = function () {
    const result = oldMeta.apply(this, arguments), el = document.getElementById('best-meta');
    if (!el) return result;
    el.querySelectorAll('.aside53-meta').forEach(e => e.remove());
    const m = window.어사이드53_META, opening = `<div class="aside53-meta" style="margin-top:5px;color:${COLOR}"><b>${BADGE} ${TITLE}</b>`;
    if (!m) { el.insertAdjacentHTML('beforeend', opening + ' · 표시 자료 미수신</div>'); return result; }
    const e = m.예정 || {}, score = m.성적 || {};
    const next = (Array.isArray(e.종목) ? e.종목 : []).map(x => `${esc(x[0])}(${esc(x[1])} · ${esc(x[2])})`).join(', ');
    el.insertAdjacentHTML('beforeend', opening + ` · ${text(m.첫칸)} ~ ${text(m.끝칸)} · ${fmt(m.칸)}칸 · A/B ${fmt(m.명단)} · C경고 ${fmt(m.C경고)} · 분류보류 ${fmt(m.분류보류)} · 마지막봉 ${text(date(m.마지막봉))}`
      + `<br>${notes}<br>${boundary} · 순서는 코드순 표시이며 추천순위가 아닙니다. 입력UNKNOWN은 현금 또는 수익0이 아닙니다.`
      + `<br>제공 자료의 모의성적: ${fmt(score.n)}건 · 평균 ${pct(score.mean)} · 중앙 ${pct(score.median)} · 실제 체결 성적 아님`
      + `<br>예정 ${text(date(e.명단일))}: ${next || '제공 명단 없음'} · 판정 ${text(m.판정)} · 대조 ${text(typeof m.대조 === 'object' ? JSON.stringify(m.대조) : m.대조)} · 달력근거 ${text(m.달력근거)} · 출처: 제공 관측자료(원문 표기 생략)`
      + `<br>‘성공 4개 패턴 포착’은 과거 사례 포착이며 전체 성공률·미래 수익의 증명이 아닙니다. C 경고 뷰티스킨은 일반 A/B 후보가 아닙니다.</div>`);
    return result;
  };

  const table = (r, key, heading, k) => {
    const data = rows(r, key), heads = ['코드순 표시순서', '종목', '등급', '출발봉', '간격(거래일)', '최대대금(억원)', '기준대금(억원)', '대금 배수', '신호일 종가', '5일선', '위험기록', '급등 근사일', '반복대금일', '모의 상태', '순수익%', '가정진입', '목표', '사유'];
    let html = `<h4>${heading} · ${data.length}개</h4>`;
    if (!data.length) return html + '<p>제공 행 없음(입력보류·누락 여부와 별개)</p>';
    html += '<div style="overflow-x:auto;max-height:480px"><table style="border-collapse:collapse;font-size:12px"><thead><tr>';
    html += heads.map(h => `<th style="padding:6px;border-bottom:1px solid ${LINE};white-space:nowrap;text-align:left">${h}</th>`).join('') + '</tr></thead><tbody>';
    data.forEach(x => {
      const [name, market] = identity(x);
      const stock = `<span style="cursor:pointer;font-weight:bold" onclick="_openStock(this,function(){openBestDetail('${k}')})" data-code="${esc(get(x, 'c'))}" data-name="${esc(name)}" data-rate="0" data-amount="0" data-meta="${BADGE} 어사이드53 ${k}" data-catalyst="">${esc(name)}</span> <small>${esc(get(x, 'c'))} ${esc(market)}</small>`;
      const values = [esc(get(x, 'r')), stock, esc(get(x, 'gr')), text(date(get(x, 'a'))), fmt(get(x, 'age')), fmt(num(get(x, 'Q')) == null ? null : num(get(x, 'Q')) / 1e8), fmt(num(get(x, 'B0')) == null ? null : num(get(x, 'B0')) / 1e8), fmt(get(x, 'burst')), fmt(get(x, 'pc')), fmt(get(x, 'ma5')), risks(x), list(get(x, 'near')), list(get(x, 'sus')), esc(status(x)), get(x, 's') === 'C' ? pct(get(x, 'p')) : '미확정', fmt(get(x, 'b')), fmt(get(x, 'tg')), text(get(x, 'ex'))];
      html += '<tr>' + values.map(v => `<td style="padding:6px;border-bottom:1px solid ${LINE};white-space:nowrap">${v}</td>`).join('') + '</tr>';
    });
    return html + '</tbody></table></div>';
  };
  const oldDetail = window.openBestDetail;
  window.openBestDetail = function (k) {
    const r = archive()[k], body = document.getElementById('stock-modal-body'), overlay = document.getElementById('stock-modal-overlay');
    if (!r || !/^\d{4}-\d{2}-\d{2}$/.test(k) || !body || !overlay) return oldDetail.apply(this, arguments);
    overlay.style.display = 'none';
    const result = oldDetail.apply(this, arguments);
    if (overlay.style.display !== 'flex') body.innerHTML = `<div style="font-size:18px;font-weight:bold">베스트 · ${esc(k)}</div>`;
    body.querySelectorAll('[data-aside53-detail]').forEach(e => e.remove());
    const [n, cn, hn, unk] = counts(r);
    let html = `<section data-aside53-detail style="margin-top:20px;color:${COLOR}"><h3>${BADGE} ${TITLE} · ${esc(k)}</h3><p>${notes}<br>${boundary}</p>`;
    html += `<p>신호일 ${text(date(r.sd))} · ${calendar(r)} · A/B ${n} · C경고 ${cn} · 분류보류 ${hn} · 입력보류${unk}${!n ? ' · 관측0(현금0 아님)' : ''}<br>코드순 표시순서이며 추천순위가 아닙니다. 아래 세 표는 서로 별개입니다.</p>`;
    html += '<p>C 상태는 일봉 시가를 가정진입으로 +3% 또는 당일 종가로 계산한 모의채점입니다. 과거 호가·체결 가능성은 검증하지 않았습니다. P는 미래 명단일 예정, U는 가격·분류·과거 호가 미확정입니다. 원저자 종가매수와 다릅니다.</p>';
    html += '<p>‘성공 4개 패턴 포착’은 과거 사례 관찰일 뿐 전체 성공률의 증명이 아닙니다. C 경고 뷰티스킨은 경고 사례이며 일반 후보가 아닙니다. a·age·Q·B0·burst·ma5는 제공 열의 원값입니다.</p>';
    html += table(r, 'a', 'A/B 현재 참고 전체', k) + table(r, 'w', 'C 경고(일반 후보 아님)', k) + table(r, 'h', '분류보류(A/B와 별도)', k) + '</section>';
    body.insertAdjacentHTML('beforeend', html);
    overlay.style.display = 'flex';
    window.__배지복귀 = function () { window.openBestDetail(k); };
    return result;
  };
})();
