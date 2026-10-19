// 전수복기 후보·저장 차트 UI. 집계/모형/주문/채점 원본을 변경하지 않는다.
(function () {
  'use strict';
  var W = window, DOC = document;
  if (W.__censusExtraInstalled) return;
  W.__censusExtraInstalled = true;
  var months = W.CENSUS_EXTRA_MONTHS = W.CENSUS_EXTRA_MONTHS || {};
  var pending = Object.create(null), mountTokens = new WeakMap(), serial = 0;
  var candidates = null, chartDialog = null;
  var ROOT = 'dashboard/data/전수복기_보강/';
  function str(v) { return v == null ? '' : String(v); }
  function el(tag, cls, text) {
    var x = DOC.createElement(tag);
    if (cls) x.className = cls;
    if (text !== undefined) x.textContent = str(text);
    return x;
  }
  function add(parent, tag, cls, text) { var x = el(tag, cls, text); parent.appendChild(x); return x; }
  function btn(label, fn, cls) { var x = el('button', cls || 'csx-btn', label); x.type = 'button'; x.addEventListener('click', fn); return x; }
  function validDay(d) { return /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/.test(d); }
  function num(v) { return typeof v === 'number' && Number.isFinite(v) ? v : null; }
  function rate(v) { var n = num(v); return n === null ? '미확인' : (n >= 0 ? '+' : '') + n.toLocaleString('ko-KR', { maximumFractionDigits: 2 }) + '%'; }
  function hit(v) { return v === true ? '적중' : v === false ? '비급등' : '미확인'; }
  function installStyle() {
    if (DOC.getElementById('csx-style')) return;
    var style = el('style'); style.id = 'csx-style';
    style.textContent = '.csx-overlay{position:fixed;inset:0;z-index:8000;background:rgba(3,8,16,.78);display:flex;align-items:center;justify-content:center;padding:16px;box-sizing:border-box;color:#dbe4ee;font:14px/1.55 system-ui,sans-serif}.csx-overlay.csx-chart-overlay{z-index:8001}.csx-dialog{background:#15202e;border:1px solid #42546a;border-radius:12px;width:min(1280px,100%);max-height:92vh;max-height:92dvh;overflow:auto;overscroll-behavior:contain;box-shadow:0 16px 64px #0008;padding:18px;box-sizing:border-box}.csx-head{display:flex;align-items:flex-start;gap:12px;justify-content:space-between;position:sticky;top:-18px;background:#15202e;z-index:2;padding:8px 0}.csx-title{font-size:18px;margin:0}.csx-sub,.csx-note{color:#aebdce;font-size:12px;white-space:pre-wrap;overflow-wrap:anywhere}.csx-tools{display:flex;flex-wrap:wrap;gap:8px;margin:12px 0}.csx-input,.csx-select{border:1px solid #52657b;background:#0c1623;color:#e5edf5;border-radius:6px;padding:8px;max-width:100%;box-sizing:border-box}.csx-input{min-width:190px;flex:1}.csx-btn,.csx-stock{border:1px solid #52657b;background:#23344a;color:#dfebf8;border-radius:6px;cursor:pointer;padding:6px 10px;font:inherit}.csx-btn:focus-visible,.csx-stock:focus-visible,.csx-input:focus-visible,.csx-select:focus-visible,.csx-link:focus-visible{outline:2px solid #a5c9ef;outline-offset:3px}.csx-stock{padding:2px 4px;background:transparent;text-decoration:underline;text-underline-offset:3px}.csx-warning{border:1px solid #9a794c;background:#3b3021;color:#f1d2a6;padding:10px;border-radius:6px;margin:10px 0;white-space:pre-wrap;overflow-wrap:anywhere}.csx-error{color:#f0b6b0;white-space:pre-wrap;overflow-wrap:anywhere}.csx-counts{padding:10px;background:#1d2c3f;border-radius:6px;white-space:pre-wrap}.csx-table-wrap{overflow:auto;max-height:53vh;overscroll-behavior:contain;border:1px solid #3b4c62}.csx-table{border-collapse:collapse;width:100%;font-size:13px;min-width:880px}.csx-table th,.csx-table td{text-align:left;vertical-align:top;padding:9px;border-bottom:1px solid #34445a;overflow-wrap:anywhere}.csx-table th{position:sticky;top:0;background:#233247;z-index:1;white-space:nowrap}.csx-table td.csx-reason{min-width:220px;max-width:480px;white-space:pre-wrap}.csx-hit{color:#b3d7ba}.csx-unknown{color:#dfc99f}.csx-chart-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}.csx-chart-card{min-width:0;background:#101b29;padding:12px;border:1px solid #35485e;border-radius:8px}.csx-chart-card h4{margin:0 0 8px;color:#dce7f5}.csx-img{display:block;width:auto;max-width:100%;height:auto;margin:8px auto}.csx-link{color:#a9cdf2}.csx-empty{padding:14px;color:#b7c5d5;white-space:pre-wrap}.csx-block{margin-top:12px}.csx-excluded{white-space:pre-wrap;overflow-wrap:anywhere}.csx-caption{white-space:pre-wrap;overflow-wrap:anywhere}@media(max-width:700px){.csx-overlay{padding:6px}.csx-dialog{padding:12px;max-height:96dvh}.csx-head{top:-12px}.csx-chart-grid{grid-template-columns:1fr}.csx-title{font-size:16px}.csx-table-wrap{max-height:56vh}}';
    (DOC.head || DOC.documentElement).appendChild(style);
  }
  function loadMonth(ym) {
    if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(ym)) return Promise.reject(new Error('월 형식이 올바르지 않습니다.'));
    function good(d) { return d && d.version === 1 && d.month === ym && d.days && typeof d.days === 'object'; }
    if (good(months[ym])) return Promise.resolve(months[ym]);
    if (pending[ym]) return pending[ym];
    var promise = new Promise(function (resolve, reject) {
      var script = DOC.createElement('script'), done = false;
      function finish(error) {
        if (done) return; done = true; clearTimeout(timer); script.remove();
        script.onload = script.onerror = null;
        if (error) reject(error);
        else if (!good(months[ym])) reject(new Error(ym + ' 보강 파일의 version/month/days가 맞지 않습니다.'));
        else resolve(months[ym]);
      }
      var timer = setTimeout(function () { finish(new Error(ym + ' 자료 읽기 20초 초과. 다시 시도할 수 있습니다.')); }, 20000);
      script.src = ROOT + ym + '.js'; script.async = true;
      script.onload = function () { finish(); };
      script.onerror = function () { finish(new Error(ym + ' 보강 자료를 읽지 못했습니다. 파일 없음 또는 연결 오류입니다.')); };
      (DOC.head || DOC.documentElement).appendChild(script);
    });
    pending[ym] = promise;
    promise.then(function () { if (pending[ym] === promise) delete pending[ym]; }, function () { if (pending[ym] === promise) delete pending[ym]; });
    return promise;
  }
  function popup(title, isChart) {
    installStyle();
    var previous = DOC.activeElement, sx = W.scrollX, sy = W.scrollY;
    var overlay = el('div', 'csx-overlay' + (isChart ? ' csx-chart-overlay' : ''));
    var panel = add(overlay, 'div', 'csx-dialog');
    panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-modal', 'true'); panel.tabIndex = -1;
    var headingId = 'csx-heading-' + (++serial);
    panel.setAttribute('aria-labelledby', headingId);
    var head = add(panel, 'div', 'csx-head'); var heading = add(head, 'h2', 'csx-title', title); heading.id = headingId;
    var closed = false, controller;
    function close(restore) {
      if (closed) return; closed = true;
      DOC.removeEventListener('keydown', keydown, true); overlay.remove();
      if (isChart && chartDialog === controller) chartDialog = null;
      if (!isChart && candidates === controller) { if (chartDialog) chartDialog.close(false); candidates = null; }
      if (restore !== false && previous && previous.isConnected) { try { previous.focus({ preventScroll: true }); } catch (_) {} }
      if (restore !== false && (W.scrollX !== sx || W.scrollY !== sy)) W.scrollTo(sx, sy);
    }
    function keydown(e) {
      if ((!isChart && chartDialog) || closed) return;
      // 기존 종목 상세창이 이 overlay 위에서 열렸다면 그 창의 키 처리를 보존한다.
      var legacy = DOC.getElementById('stock-modal-overlay');
      if (legacy && legacy.style.display && legacy.style.display !== 'none') return;
      var active = DOC.activeElement;
      if (active && !overlay.contains(active) && active !== DOC.body) return;
      if (e.key === 'Escape') { e.preventDefault(); e.stopImmediatePropagation(); close(); }
      if (e.key === 'Tab') {
        var nodes = Array.from(panel.querySelectorAll('button,input,select,a[href],[tabindex="0"]')).filter(function (x) { return !x.disabled && x.getClientRects().length; });
        if (!nodes.length) { e.preventDefault(); panel.focus({ preventScroll: true }); return; }
        if (e.shiftKey && (active === nodes[0] || active === panel)) { e.preventDefault(); nodes[nodes.length - 1].focus({ preventScroll: true }); }
        else if (!e.shiftKey && (active === nodes[nodes.length - 1] || active === panel)) { e.preventDefault(); nodes[0].focus({ preventScroll: true }); }
      }
    }
    var closer = btn('닫기', function () { close(); }); head.appendChild(closer);
    overlay.addEventListener('wheel', function (e) { if (e.target === overlay) e.preventDefault(); }, { passive: false });
    overlay.addEventListener('touchmove', function (e) { if (e.target === overlay) e.preventDefault(); }, { passive: false });
    DOC.body.appendChild(overlay); DOC.addEventListener('keydown', keydown, true);
    closer.focus({ preventScroll: true });
    controller = { panel: panel, overlay: overlay, close: close, alive: function () { return !closed && overlay.isConnected; } };
    return controller;
  }
  function oldExpected(day, source) {
    var m = (W.전수복기_MONTHS || {})[day.slice(0, 7)] || (day.slice(0, 7) === '2026-09' ? W.전수복기_9월 : null);
    var d = m && m.daily && m.daily[day];
    return d && Array.isArray(d.clue_tests) ? d.clue_tests.find(function (x) { return x.source === source; }) : null;
  }
  function imageURL(src) {
    var s = str(src);
    // 상대 경로만 허용. javascript:/data:/외부 호스트/상위 폴더 이동 차단.
    if (!/^dashboard\/data\/전수복기_보강\/이미지\/[A-Za-z0-9_-]+\.(?:webp|png)$/.test(s)) return null;
    return s;
  }
  W.censusMountCharts = function (day, code, targetId) {
    installStyle(); targetId = targetId || 'cs-chart-panel'; day = str(day); code = str(code);
    var target = DOC.getElementById(targetId);
    if (!target) return Promise.resolve({ ok: false, error: '차트 대상 DOM 없음: ' + targetId });
    var token = {}; mountTokens.set(target, token); target.replaceChildren();
    function current() { return target.isConnected && DOC.getElementById(targetId) === target && mountTokens.get(target) === token; }
    function error(message) { if (current()) { target.replaceChildren(); add(target, 'p', 'csx-error', message); } return { ok: false, error: message }; }
    if (!validDay(day) || !/^[A-Za-z0-9_-]+$/.test(code)) return Promise.resolve(error('차트 날짜 또는 종목코드 형식 오류입니다.'));
    add(target, 'p', 'csx-note', '저장 차트 자료를 읽고 있습니다.');
    return loadMonth(day.slice(0, 7)).then(function (m) {
      if (!current()) return { ok: false, stale: true };
      var d = m.days[day], stock = d && d.stocks && d.stocks[code];
      if (!d) return error(day + ' 보강 일자 자료가 없습니다.');
      if (!stock) return error(day + ' / ' + code + ' 저장 차트 항목이 없습니다. 이미지 생성·등록 여부를 확인해야 합니다.');
      target.replaceChildren();
      add(target, 'h3', 'csx-caption', str(stock.n || code) + ' (' + code + ') · 대상 ' + day);
      add(target, 'p', 'csx-note', '당시 원본이 아닌 현재 수정주가로 재현된 차트입니다. 사전은 대상일 D 미포함, 사후는 D까지만 표시합니다. 매수추천이 아니며 이미지 AI 학습 완료를 뜻하지 않습니다.');
      add(target, 'p', 'csx-note', '차트 상태: ' + (str(stock.chart_status) || '미기록') + (stock.note ? '\n메모: ' + str(stock.note) : ''));
      var grid = add(target, 'div', 'csx-chart-grid');
      ['pre', 'post'].forEach(function (kind) {
        var info = stock[kind], before = kind === 'pre', card = add(grid, 'div', 'csx-chart-card');
        add(card, 'h4', '', before ? '사전 · D 미포함' : '사후 · D까지만');
        if (!info || !info.src) { add(card, 'p', 'csx-empty', '저장 이미지 없음 · 상태: ' + (str(stock.chart_status) || '미기록') + '\n' + (str(stock.note) || '이 구간 이미지 경로가 등록되지 않았습니다.')); return; }
        add(card, 'p', 'csx-note', '기준일: ' + (str(info.asof) || '미기록') + ' · 봉 수: ' + (str(info.bars) || '미기록') + ' · 품질: ' + (typeof info.quality === 'object' ? JSON.stringify(info.quality) : str(info.quality) || '미기록'));
        var asof = str(info.asof), temporalValid = validDay(asof) && (before ? asof < day : asof === day);
        if (!temporalValid) { add(card, 'p', 'csx-warning', '날짜 무결성 오류: ' + (before ? '사전 asof는 대상일보다 이전이어야 합니다.' : '사후 asof는 대상일과 같아야 합니다.') + ' 이미지를 표시하지 않습니다.'); return; }
        var url = imageURL(info.src);
        if (!url) { add(card, 'p', 'csx-error', '허용된 저장 이미지 상대 경로가 아닙니다. ' + str(info.src)); return; }
        var img = add(card, 'img', 'csx-img'); img.alt = str(stock.n || code) + ' ' + (before ? '사전' : '사후') + ' 차트 · ' + asof; img.decoding = 'async';
        img.addEventListener('error', function () { if (!current() || !img.isConnected) return; img.hidden = true; add(card, 'p', 'csx-error', '저장 이미지 파일을 읽지 못했습니다. 파일 누락 또는 경로 오류입니다.\n' + url); });
        img.src = url;
        var link = add(card, 'a', 'csx-link', '새 탭에서 원본 보기'); link.href = url; link.target = '_blank'; link.rel = 'noopener noreferrer';
      });
      return { ok: true, day: day, code: code };
    }, function (e) {
      if (!current()) return { ok: false, stale: true };
      var result = error(e.message);
      target.appendChild(btn('차트 다시 읽기', function () { W.censusMountCharts(day, code, targetId); })); return result;
    });
  };
  function showChart(day, code, name) {
    if (chartDialog) chartDialog.close(false);
    chartDialog = popup(str(name || code) + ' · 저장 차트', true);
    var slot = add(chartDialog.panel, 'div', 'csx-block'); slot.id = 'cs-candidate-chart-dialog';
    return W.censusMountCharts(day, code, 'cs-candidate-chart-dialog');
  }
  W.censusShowCandidates = function (daysArray, source) {
    if (candidates) candidates.close(false);
    var days = Array.isArray(daysArray) ? Array.from(new Set(daysArray.map(str))).filter(validDay).sort() : [];
    source = str(source);
    var modal = candidates = popup(source + ' · 실제 후보 목록', false);
    var sub = add(modal.panel, 'p', 'csx-sub', '원천날짜 → 대상날짜별로 표시합니다. 서로 다른 날의 같은 종목은 날짜마다 별도 1건입니다.');
    add(modal.panel, 'p', 'csx-note', '이 목록과 원문 이슈는 기록된 데이터입니다. 원문 묶음은 기업별 상승 원인을 입증하지 않습니다. 사후 연구용이며 원문 시각·체결 가능성·매수추천 또는 AI 학습 완료를 보증하지 않습니다.');
    var body = add(modal.panel, 'div', 'csx-block');
    if (!days.length || !source) { add(body, 'p', 'csx-error', '날짜 배열 또는 원천 구분이 비어 있거나 형식이 잘못됐습니다.'); return Promise.resolve({ ok: false }); }
    var attempt = 0;
    function run() {
      var request = ++attempt;
      if (chartDialog) chartDialog.close(false);
      body.replaceChildren(); add(body, 'p', 'csx-note', '선택 날짜에 필요한 월 자료만 읽고 있습니다.');
      var keys = Array.from(new Set(days.map(function (d) { return d.slice(0, 7); })));
      return Promise.all(keys.map(function (k) { return loadMonth(k).then(function (m) { return { key: k, data: m }; }, function (e) { return { key: k, error: e.message }; }); })).then(function (results) {
        if (!modal.alive() || candidates !== modal || request !== attempt) return { ok: false, stale: true };
        body.replaceChildren();
        var loaded = Object.create(null), rows = [], issues = [], excluded = [], dateLabels = [];
        results.forEach(function (r) { if (r.error) issues.push(r.error); else loaded[r.key] = r.data; });
        days.forEach(function (day) {
          var m = loaded[day.slice(0, 7)], d = m && m.days[day], g = d && d.groups && d.groups[source];
          if (!m) return;
          if (!g || !Array.isArray(g.rows)) { issues.push(day + ' / ' + source + ' 후보 자료가 없습니다. 0건이나 비급등으로 판정하지 않습니다.'); return; }
          dateLabels.push((str(g.source_date || d.prev_day) || '원천일 미기록') + ' → ' + day);
          var nHit = g.rows.filter(function (r) { return r && r.hit === true; }).length;
          if (num(g.expected_n) !== null && g.expected_n !== g.rows.length) issues.push(day + ' 전체 불일치: 기존집계 ' + g.expected_n + ' / 실제 목록 ' + g.rows.length);
          if (num(g.expected_hit) !== null && g.expected_hit !== nHit) issues.push(day + ' 적중 불일치: 기존집계 ' + g.expected_hit + ' / 실제 목록 ' + nHit);
          if (g.reconciled !== true) issues.push(day + ' 집계 대조 상태: ' + (g.reconciled === false ? '불일치' : '미확인') + '. 실제 목록을 숨기지 않고 표시합니다.');
          var old = oldExpected(day, source);
          if (old && (num(old.candidate_n) !== null && old.candidate_n !== g.rows.length || num(old.hit_n) !== null && old.hit_n !== nHit)) issues.push(day + ' 현재 기존 화면 집계와 불일치: 전체 ' + str(old.candidate_n) + ' / 적중 ' + str(old.hit_n) + ', 실제 목록 전체 ' + g.rows.length + ' / 적중 ' + nHit);
          g.rows.forEach(function (r, i) { rows.push({ day: day, sourceDate: str(g.source_date || d.prev_day) || '미기록', row: r || {}, order: i }); });
          (Array.isArray(g.excluded_unpriced) ? g.excluded_unpriced : []).forEach(function (r) { excluded.push({ day: day, row: r }); });
        });
        sub.textContent = source + '\n' + dateLabels.join(' · ');
        if (issues.length) add(body, 'div', 'csx-warning', issues.join('\n'));
        var h = rows.filter(function (x) { return x.row.hit === true; }).length;
        var no = rows.filter(function (x) { return x.row.hit === false; }).length;
        add(body, 'div', 'csx-counts', '전체 ' + rows.length + '건 · 적중 ' + h + '건 · 비급등 ' + no + '건 · 판정 미확인 ' + (rows.length - h - no) + '건\n가격 미확인 별도 제외 ' + excluded.length + '건 (비급등에 포함하지 않음)');
        var tools = add(body, 'div', 'csx-tools');
        var search = add(tools, 'input', 'csx-input'); search.type = 'search'; search.placeholder = '종목명·코드·원문 이슈·날짜 검색'; search.setAttribute('aria-label', '실제 후보 검색');
        var sort = add(tools, 'select', 'csx-select'); sort.setAttribute('aria-label', '후보 정렬');
        [['date', '날짜 순'], ['name', '종목 이름 순'], ['high', '고가 등락 높은 순'], ['highAsc', '고가 등락 낮은 순']].forEach(function (v) { var o = add(sort, 'option', '', v[1]); o.value = v[0]; });
        var filter = add(tools, 'select', 'csx-select'); filter.setAttribute('aria-label', '적중 구분');
        [['all', '전체'], ['hit', '적중'], ['no', '비급등'], ['unknown', '미확인']].forEach(function (v) { var o = add(filter, 'option', '', v[1]); o.value = v[0]; });
        tools.appendChild(btn('자료 다시 읽기', run));
        var visible = add(body, 'p', 'csx-note'); visible.setAttribute('aria-live', 'polite');
        var wrap = add(body, 'div', 'csx-table-wrap'), table = add(wrap, 'table', 'csx-table');
        var trh = add(add(table, 'thead'), 'tr'); ['종목', '원천날짜 → 대상날짜', '구분', '고가 등락 h', '종가 등락 r', '원문 이슈', '저장 차트'].forEach(function (s) { add(trh, 'th', '', s); });
        var tbody = add(table, 'tbody');
        function renderRows() {
          var q = search.value.trim().toLocaleLowerCase('ko-KR');
          var view = rows.filter(function (x) { var r = x.row; return (!q || [r.n, r.c, r.reason, x.day, x.sourceDate].map(str).join(' ').toLocaleLowerCase('ko-KR').includes(q)) && (filter.value === 'all' || filter.value === 'hit' && r.hit === true || filter.value === 'no' && r.hit === false || filter.value === 'unknown' && r.hit !== true && r.hit !== false); });
          view.sort(function (a, b) {
            if (sort.value === 'name') return str(a.row.n).localeCompare(str(b.row.n), 'ko') || a.day.localeCompare(b.day);
            if (sort.value === 'high' || sort.value === 'highAsc') { var ah = num(a.row.h), bh = num(b.row.h); if (ah === null || bh === null) return ah === bh ? a.day.localeCompare(b.day) : ah === null ? 1 : -1; return (sort.value === 'high' ? bh - ah : ah - bh) || a.day.localeCompare(b.day); }
            return a.day.localeCompare(b.day) || a.order - b.order;
          });
          tbody.replaceChildren(); visible.textContent = '현재 표시 ' + view.length + ' / 전체 ' + rows.length + '건';
          view.forEach(function (x) {
            var r = x.row, tr = add(tbody, 'tr'), td = add(tr, 'td');
            var stockButton = btn(str(r.n || r.c) || '이름 미기록', function (e) { e.preventDefault(); e.stopPropagation(); if (typeof W.showStockDetail === 'function') W.showStockDetail(stockButton); else add(td, 'p', 'csx-error', '기존 종목 상세 함수 showStockDetail이 없습니다.'); }, 'csx-stock');
            stockButton.dataset.code = str(r.c); stockButton.dataset.name = str(r.n); stockButton.dataset.rate = str(num(r.r) === null ? 0 : r.r); stockButton.dataset.amount = '0'; stockButton.dataset.meta = '전수복기 ' + x.day; stockButton.dataset.catalyst = str(r.reason);
            td.appendChild(stockButton); add(td, 'div', 'csx-note', str(r.c));
            add(tr, 'td', '', x.sourceDate + ' → ' + x.day);
            add(tr, 'td', r.hit === true ? 'csx-hit' : r.hit === false ? '' : 'csx-unknown', hit(r.hit) + (r.stale ? '\n이전 봉 날짜 주의' : ''));
            add(tr, 'td', '', rate(r.h)); add(tr, 'td', '', rate(r.r));
            add(tr, 'td', 'csx-reason', str(r.reason) || '원문 이슈 미기록');
            add(tr, 'td').appendChild(btn('차트 이미지', function () { showChart(x.day, str(r.c), str(r.n)); }));
          });
          if (!view.length) { var empty = add(add(tbody, 'tr'), 'td', 'csx-empty', rows.length ? '검색·필터에 맞는 후보가 없습니다.' : '실제 후보 목록이 비어 있습니다. 누락 경고와 기존집계 대조를 확인하세요.'); empty.colSpan = 7; }
        }
        search.addEventListener('input', renderRows); sort.addEventListener('change', renderRows); filter.addEventListener('change', renderRows); renderRows();
        if (excluded.length) {
          var details = add(body, 'details', 'csx-block'); add(details, 'summary', '', '가격 미확인으로 별도 제외된 종목 ' + excluded.length + '건');
          excluded.forEach(function (x) { add(details, 'p', 'csx-excluded', x.day + ' · ' + (typeof x.row === 'object' ? JSON.stringify(x.row) : str(x.row))); });
        }
        var inlineCharts = add(body, 'div', 'csx-block'); inlineCharts.id = 'cs-candidate-chart';
        if (rows.length) { var first = rows[0]; W.censusMountCharts(first.day, str(first.row.c), 'cs-candidate-chart'); }
        return { ok: issues.length === 0, rows: rows.length, hits: h, nonhits: no, unknown: rows.length - h - no, warnings: issues };
      });
    }
    return run();
  };
}());
