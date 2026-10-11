// 🕸 종목 생태계 뷰 = 종목창 아래 절 · dashboard/data/생태계/{코드}.js(window.__E_코드)를 클릭 때 읽어 고리 8개를 지도(SVG)·목록으로 그린다 · 선은 자료 연결이지 상승 원인·추천 아님 · 빌더 = 주도주\_생태계\_생태계_빌드.py
(function(){
  var RINGS = [
    ['자리', '🗂 자리', '테마 · 세부분야 · 4년 등장', '#7ee8ff'],
    ['사건', '📅 사건', '4년 카드(정규장·상한가·52신고·시간외) + 📈 급등(카드 밖 +20~35%)', '#ffd33a'],
    ['뉴스', '📰 뉴스', '장전뉴스 · 웹근거 · 도구 기사', '#ff8c4a'],
    ['공시', '📄 공시', 'DART 원문·목록', '#c4b5fd'],
    ['픽', '🎯 도구 기록', '검증 도구 아카이브가 이 종목을 적은 날', '#5effd6'],
    ['원장', '📒 원장', '검증 원장에 이 종목이 나온 문장', '#f9a8d4'],
    ['동행', '🤝 동행', '같은 날 같은 카드로 같이 오른 종목', '#34d399'],
    ['일정', '🗓 일정', '증시일정(지난 60일 + 예정)', '#9fa3d6']
  ];
  var CAP = {자리: 12, 사건: 24, 뉴스: 12, 공시: 12, 픽: 16, 원장: 8, 동행: 12, 일정: 8};
  function esc(s){ return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
  function cut(s, n){ s = String(s == null ? '' : s); return s.length > n ? s.slice(0, n - 1) + '…' : s; }
  function md(d){ return d ? d.slice(5).replace('-', '/') : ''; }
  function num(n){ return (n == null) ? '-' : Number(n).toLocaleString('ko-KR'); }
  function pct(n){ return (n == null) ? '-' : ((n > 0 ? '+' : '') + Number(n).toFixed(1) + '%'); }
  function tool(t){ return String(t || '').replace(/_아카이브|_채점|_BoB3/g, function(m){ return m === '_BoB3' ? ' BoB3' : (m === '_채점' ? ' 채점' : ''); }); }
  // 🎨 테마 국면 = 테마생태계.js 한 파일(/매매일마다 다시 계산)에서 읽는다(테마생태계_뷰.js 의 _테마국면 · 구와 같은 색)
  // ★종목 파일의 옛 국면 칸(자리 phase · 국면 = 순환시계 84메타 사분면을 옛 이름 강세·마감·올라옴·식는중·휴면으로 적은 것)은 빌더에서 뺐다(2026-09-23)
  //   88/328 테마에만 있었고, 우리 급증 7개 중 4개(우주항공·MLCC·방산·신재생)를 「식는중」으로 적어 정반대 말을 했다
  //   종목 파일에 새 국면을 적지 않는 이유 = 그날 안 움직인 종목 파일은 다시 안 써서 어제 국면이 남는다
  function ph(th){ return typeof window._테마국면 === 'function' ? window._테마국면(th) : null; }
  function phDot(p){ return p ? '<span style="color:' + p.색 + '">●</span> ' : ''; }
  var PH_ORDER = ['주도', '급증', '20일 안', '60일 안', '1년 안', '그 전', '카드 없음', '테마 아님'];
  var teWait = null;
  function withTE(cb){                                   // 테마생태계.js 가 아직 없으면 한 번만 불러 온 뒤 다시 그린다(실패해도 더 안 부른다)
    if ((window.__TE && window.__TE.themes) || teWait === 'done') return;
    if (teWait) { teWait.push(cb); return; }
    teWait = [cb];
    var s = document.createElement('script'); s.src = 'dashboard/data/테마생태계.js';
    s.onload = s.onerror = function(){ var w = teWait; teWait = 'done'; w.forEach(function(f){ try { f(); } catch (e) {} }); };
    document.head.appendChild(s);
  }

  // 항목 → {label(짧게), title(전체), act, arg}
  function item(ring, x, E){
    if (ring === '자리') { var p = ph(x.테마); return {label: cut(x.테마, 8) + (x.분야 && x.분야 !== '원문 테마' ? ' · ' + cut(x.분야, 8) : ''), title: x.테마 + ' / ' + (x.분야 || '-') + ' · 4년 ' + x.n + '회 · 이 종목 최근 ' + (x.최근 || '-') + (x.근거 ? '\n근거: ' + x.근거 + ' (' + x.출처 + ')' : '') + (p ? '\n테마 국면 ' + p.글 : '') + (x.강중약 ? '\n강도 ' + String(x.강중약).replace(/[🔴🟡🟢]/g, '').trim() + '(테마강도 표 등급)' : ''), act: 'theme', arg: x.테마, col: p ? p.색 : null}; }
    if (ring === '사건') return {label: md(x[0]) + ' ' + pct(x[2]) + (x[3] ? ' ' + cut(x[3], 6) : ''), title: x[0] + ' ' + x[1] + ' ' + pct(x[2]) + ' ' + (x[3] || '') + '\n' + (x[4] || '') + (x[5] === '이름매칭' ? '\n(이름매칭)' : ''), act: 'date', arg: x[0]};
    if (ring === '뉴스') return {label: md(x.d) + ' ' + cut(x.t, 12), title: x.d + ' ' + x.src + (x.테마 ? ' [' + x.테마 + ']' : '') + '\n' + x.t, act: x.u ? 'url' : 'none', arg: x.u};
    if (ring === '공시') return {label: md(x.d) + ' ' + cut(x.t, 12), title: x.d + ' ' + x.src + '\n' + x.t, act: x.u ? 'url' : 'none', arg: x.u};
    if (ring === '픽') { var f = x.f || {}; var ks = Object.keys(f).slice(0, 5).map(function(k){ return k + '=' + (typeof f[k] === 'object' ? JSON.stringify(f[k]) : f[k]); }).join(' · '); return {label: md(x.d) + ' ' + cut(tool(x.도구), 9), title: x.d + ' ' + tool(x.도구) + '\n' + ks, act: 'date', arg: x.d}; }
    if (ring === '원장') return {label: cut(x.제목 || x.파일, 14), title: x.파일 + ' · ' + x.제목 + '\n' + x.문장, act: 'none', arg: ''};
    if (ring === '동행') return {label: cut(x.name || x.code, 8) + ' ' + x.n, title: (x.name || x.code) + ' · 같이 ' + x.n + '회 · 최근 ' + (x.최근 || '-') + (x.테마 ? ' · ' + x.테마 : ''), act: 'stock', arg: x.code + '|' + (x.name || '')};
    if (ring === '일정') return {label: md(x.d) + ' ' + cut(x.t, 8), title: x.d + ' ' + x.t + (x.직접 ? ' (종목명 직접)' : ' (테마)') + '\n' + (x.s || ''), act: 'date', arg: x.d};
    return {label: '', title: '', act: 'none', arg: ''};
  }

  function won(v){ if (v == null) return '-'; var a = Math.abs(v), s = v < 0 ? '−' : ''; return s + (a >= 10000 ? (a / 10000).toFixed(1) + '조' : a >= 100 ? Math.round(a).toLocaleString('ko-KR') + '억' : a.toFixed(1) + '억'); }
  function finLine(E){
    var F = E.기업 && E.기업.재무; if (!F || !F.최근) return '';
    var g = F.지표 || {}, q4 = g.최근4분기, yo = g.분기YoY, bs = g.재무상태;
    var t = '💰 재무(' + esc(F.기준) + ') ' + esc(F.최근);
    if (q4) t += ' · 최근4분기 매출 ' + won(q4.매출) + ' 영업익 ' + won(q4.영업이익) + (q4.영업이익률 != null ? '(' + q4.영업이익률 + '%)' : '');
    if (yo) t += ' · ' + esc(yo.기) + ' YoY 매출 ' + pct(yo.매출) + ' 영업익 ' + pct(yo.영업이익);
    if (bs && bs.부채비율 != null) t += ' · 부채비율 ' + bs.부채비율 + '%';
    return '<div style="font-size:10.5px;color:#8487bd;margin-bottom:6px">' + t + '</div>';
  }
  function segHtml(G){
    if (!G) return '';
    var mix = G.구성 && G.구성.length ? G.구성.map(function(m){ return esc(m[0]) + ' <b>' + m[1] + '%</b>'; }).join(' · ') : '<span style="color:#8487bd">비율 열 없음 = 아래 원문 표</span>';
    return '<div style="font-size:11px;color:#ffd27a;margin:2px 0">🧩 매출 구성 <span style="color:#8487bd">' + esc(G.보고서) + '</span> ' + mix + '</div>'
      + (G.표 && G.표.length ? '<details style="margin:2px 0 4px"><summary style="cursor:pointer;font-size:10.5px;color:#8487bd">매출 표 원문 발췌 ' + G.표.length + '개 · <span class="eco-node" data-act="url" data-arg="' + esc(G.DART) + '" style="color:#7fb0ff">사업보고서 ↗</span></summary>'
        + G.표.map(function(t){ return '<div style="font-size:10.5px;color:#9fa3d6;line-height:1.45;white-space:pre-wrap;margin:3px 0;border-left:2px solid rgba(255,255,255,.1);padding-left:6px">' + esc(t) + '</div>'; }).join('') + '</details>' : '');
  }
  // 🔄 이 테마가 켜진 날 같이 켜진 테마(순환매 P2 연결표) · ★주 숫자는 ★층화 배수 = 그날 시장이 뜨거웠던 몫을 뺀 값
  // 단순 배수로 보면 「2차전지 → 전기차 15.45배」인데 층화는 0.89 = 시장 탓. 그래서 층화를 앞에 두고 1.2 미만은 회색으로 죽인다.
  function herdLine(x){
    var h = x.동행테마; if (!h || !h.length) return '';
    var items = h.map(function(m){
      var s = m.층화, strong = s != null && s >= 1.2;
      var col = strong ? '#5effd6' : (s != null && s >= 1.0 ? '#9fa3d6' : '#6f72a8');
      return '<span class="eco-node" data-act="theme" data-arg="' + esc(m.B) + '" title="' + esc(m.B + ' · 층화 ' + (s == null ? '-' : s) + '배(시장 교란 뺀 값) · 단순 ' + m.배수 + '배 · 같이 센 날 ' + m.n + '일 · P2 판정 ' + (m.판정 || '-') + ' · ' + m.정의 + ' 기준') + '" style="color:' + col + ';cursor:pointer;margin-right:7px">'
        + esc(m.B) + ' <b>' + (s == null ? '-' : s) + '배</b><span style="color:#6f72a8;font-size:10px">(단순 ' + m.배수 + '·' + m.n + '일)</span></span>';
    }).join('');
    return '<div style="color:#8487bd;font-size:10.5px;margin-top:2px">🔄 같이 켜진 테마 ' + items
      + '<span style="color:#6f72a8">· 층화 = 그날 시장이 뜨거웠던 몫을 뺀 배수 · <b style="color:#8a90c0">627쌍 중 통계로 유의한 건 2쌍뿐(나머지 「약함」)</b> · 같은 날 이야기지 내일 예측이 아니다</span></div>';
  }

  function anaLine(E){
    var A = E.분석; if (!A || !A.밟힘) return '';
    var b = A.밟힘, s = A.수익;
    return '<div style="font-size:10.5px;color:#8487bd;margin-bottom:6px">📊 카드 다음날 시가 매수 ' + A.n + '번 · <b style="color:#ff9a9a">5일 안 평균 ' + pct(b.MAE평균) + ' 밟힘</b>(−5% 당함 ' + b['5%밟힘률'] + '%) · +5% 닿음 ' + s['5%도달률'] + '% · D+5 ' + pct(s.D5평균) + '</div>';
  }
  function anaBlock(E){
    var A = E.분석; if (!A) return '';
    if (!A.밟힘) return '<details id="eco-ring-분석" style="margin-bottom:6px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);border-radius:8px;padding:6px 10px"><summary style="cursor:pointer;font-size:12px;font-weight:700;color:#ff9a9a">📊 카드 뒤 성적 <span style="font-weight:400;color:#8487bd;font-size:10.5px">' + esc(A.모자람 || '채점할 카드일 없음') + '</span></summary></details>';
    var b = A.밟힘, s = A.수익;
    var cell = function(t, v, c){ return '<div style="min-width:104px;margin:0 14px 6px 0"><div style="font-size:10px;color:#6f72a8">' + t + '</div><div style="font-size:15px;font-weight:700;color:' + c + '">' + v + '</div></div>'; };
    return '<details id="eco-ring-분석" open style="margin-bottom:6px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);border-radius:8px;padding:6px 10px">'
      + '<summary style="cursor:pointer;font-size:12px;font-weight:700;color:#ff9a9a">📊 카드 뒤 성적 <span style="font-weight:400;color:#8487bd;font-size:10.5px">' + A.n + '번 · ' + esc(A.기간 || '') + ' · 천프정 일봉 실측</span></summary>'
      + '<div style="display:flex;flex-wrap:wrap;margin:6px 0 2px">'
      + cell('5일 안 밟힘(평균)', pct(b.MAE평균), '#ff9a9a') + cell('밟힘(중앙)', pct(b.MAE중앙), '#ff9a9a') + cell('−5% 당함', b['5%밟힘률'] + '%', '#ff9a9a')
      + cell('+5% 닿음', s['5%도달률'] + '%', '#5effd6') + cell('+10% 닿음', s['10%도달률'] + '%', '#5effd6')
      + cell('D+1 종가', pct(s.D1평균), '#9fa3d6') + cell('D+5 종가', pct(s.D5평균), '#9fa3d6') + '</div>'
      + (A.재료 && A.재료.length ? '<div style="font-size:11px;color:#9fa3d6;margin:2px 0 4px">🔁 되풀이 재료 = ' + A.재료.map(function(w){ return esc(w[0]) + '<span style="color:#6f72a8">' + w[1] + '</span>'; }).join(' · ') + '</div>' : '')
      + '<div style="font-size:10px;color:#6f72a8;line-height:1.5">' + esc(A.읽는법 || '') + '</div></details>';
  }

  function finBlock(E){
    var K = E.기업 || {}, F = K.재무 || {}, G = K.부문; if (!F.최근 && !G) return '';
    if (!F.최근) return '<details id="eco-ring-재무" open style="margin-bottom:6px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);border-radius:8px;padding:6px 10px"><summary style="cursor:pointer;font-size:12px;font-weight:700;color:#ffd27a">💰 재무·기업 <span style="font-weight:400;color:#8487bd;font-size:10.5px">주요계정 없음</span></summary>' + segHtml(G) + '</details>';
    var TH = 'style="color:#8487bd;font-weight:400;text-align:right;padding:1px 6px"', TD = 'style="text-align:right;padding:1px 6px"', TL = 'style="text-align:left;padding:1px 6px"';
    function tbl(rows, cols){ return '<table style="border-collapse:collapse;font-size:11px;margin:2px 14px 4px 0;display:inline-table;vertical-align:top"><tr><th ' + TH + '>기</th>' + cols.map(function(c){ return '<th ' + TH + '>' + c + '</th>'; }).join('') + '</tr>'
      + rows.map(function(r){ return '<tr><td ' + TL + '>' + esc(r.기) + '</td>' + cols.map(function(c){ return '<td ' + TD + '>' + won(r[c]) + '</td>'; }).join('') + '</tr>'; }).join('') + '</table>'; }
    var note = [];
    if (F.매출명 && F.매출명 !== '매출액') note.push(esc(F.매출명));
    if (F.보통주법인) note.push('보통주 ' + esc(F.보통주법인) + ' 법인 기준');
    return '<details id="eco-ring-재무" open style="margin-bottom:6px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);border-radius:8px;padding:6px 10px"><summary style="cursor:pointer;font-size:12px;font-weight:700;color:#ffd27a">💰 재무·기업 <span style="font-weight:400;color:#8487bd;font-size:10.5px">' + esc(F.기준) + ' · ' + esc(F.최근) + ' · ' + esc(F.출처 || '') + '</span></summary>'
      + (K.개요 ? '<div style="font-size:11px;color:#9fa3d6;line-height:1.5;margin:4px 0">' + esc(K.WICS || '') + (K.WICS ? ' · ' : '') + esc(cut(K.개요, 300)) + '</div>' : '')
      + segHtml(G)
      + '<div>' + tbl(F.연간 || [], ['매출', '영업이익', '순이익', '자산', '부채', '자본']) + tbl(F.분기 || [], ['매출', '영업이익', '순이익']) + '</div>'
      + '<div style="font-size:10.5px;color:#6f72a8">' + note.join(' · ') + (note.length ? ' · ' : '') + (F.보고서 ? '<span class="eco-node" data-act="url" data-arg="' + esc(F.보고서) + '" style="color:#7fb0ff;cursor:pointer">DART 보고서 ↗</span>' : '') + '</div></details>';
  }

  function head(E){
    var s = E.시세 || {}; var sp = s.수급20;
    var chips = RINGS.map(function(r){ var n = (E[r[0]] || []).length; return '<span style="font-size:11px;color:' + r[3] + ';background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:10px;padding:2px 8px;margin-right:4px">' + r[1] + ' ' + n + '</span>'; }).join('');
    var seat = (E.자리 || []).filter(function(x){ return x.분야 && x.분야 !== '원문 테마' && x.분야.indexOf('미배정') < 0; }).slice(0, 3).map(function(x){ return phDot(ph(x.테마)) + esc(x.테마) + ' / ' + esc(x.분야); }).join(' · ');
    return '<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px;margin-bottom:6px">'
      + '<div style="font-size:13px;font-weight:800;color:#dce8ff">🕸 종목 생태계 <span style="font-size:10.5px;color:#8487bd;font-weight:400">· 기준 ' + esc(E.asof) + ' · ' + esc(E.기업 && E.기업.WICS || '') + (seat ? ' · ' + seat : '') + '</span></div>'
      + '<div><button class="eco-btn" data-mode="map" style="' + BTN + '">🕸 지도</button><button class="eco-btn" data-mode="list" style="' + BTN + '">☰ 목록</button></div></div>'
      + '<div style="margin-bottom:6px">' + chips + '</div>'
      + anaLine(E)
      + finLine(E)
      + '<div style="font-size:10.5px;color:#8487bd;margin-bottom:6px">봉 ' + (s.봉 ? esc(s.최근일) + ' 종가 ' + num(s.종가) + ' · 20일 ' + pct(s.r20) : '없음') + (sp ? ' · 수급20일 외인 ' + num(sp.외인대금억) + '억 / 기관 ' + num(sp.기관대금억) + '억 (' + esc(sp.기간) + ')' : '') + ' · <i>선은 자료 연결이지 상승 원인·추천이 아니다</i></div>';
  }
  var BTN = 'background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);color:#dce8ff;font-size:11px;border-radius:6px;padding:3px 9px;margin-left:4px;cursor:pointer';

  function mapSvg(E){
    var W = 960, H = 640, cx = 480, cy = 320;
    var rings = RINGS.map(function(r){ var all = E[r[0]] || []; return {k: r[0], t: r[1], c: r[3], items: all.slice(0, CAP[r[0]]), n: all.length}; });
    var tot = rings.reduce(function(a, r){ return a + r.items.length + 2; }, 0);
    var ang = -Math.PI / 2, out = [], lines = [], labels = [];
    rings.forEach(function(r){
      var span = (r.items.length + 2) / tot * Math.PI * 2, a0 = ang; ang += span;
      var mid = a0 + span / 2;
      labels.push('<text x="' + (cx + Math.cos(mid) * 300).toFixed(0) + '" y="' + (cy + Math.sin(mid) * 300).toFixed(0) + '" fill="' + r.c + '" font-size="12" font-weight="700" text-anchor="middle" class="eco-ring" data-ring="' + r.k + '" style="cursor:pointer">' + esc(r.t) + ' ' + r.n + (r.n > r.items.length ? ' (+' + (r.n - r.items.length) + ' 목록)' : '') + '</text>');
      r.items.forEach(function(x, i){
        var it = item(r.k, x, E); var a = a0 + span * (i + 1) / (r.items.length + 1); var rad = 215 + (i % 2) * 42;
        var px = cx + Math.cos(a) * rad, py = cy + Math.sin(a) * rad;
        lines.push('<line x1="' + cx + '" y1="' + cy + '" x2="' + px.toFixed(0) + '" y2="' + py.toFixed(0) + '" stroke="' + r.c + '" stroke-opacity=".28" stroke-width="1"/>');
        var anchor = Math.cos(a) >= 0 ? 'start' : 'end'; var lx = px + (Math.cos(a) >= 0 ? 7 : -7);
        out.push('<g class="eco-node" data-act="' + it.act + '" data-arg="' + esc(it.arg) + '" style="cursor:' + (it.act === 'none' ? 'default' : 'pointer') + '"><title>' + esc(it.title) + '</title>'
          + '<circle cx="' + px.toFixed(0) + '" cy="' + py.toFixed(0) + '" r="4.5" fill="' + (it.col || r.c) + '" fill-opacity=".9"/>'
          + '<text x="' + lx.toFixed(0) + '" y="' + (py + 4).toFixed(0) + '" fill="#cfd2ff" font-size="10.5" text-anchor="' + anchor + '">' + esc(it.label) + '</text></g>');
      });
    });
    var center = '<g><circle cx="' + cx + '" cy="' + cy + '" r="46" fill="#0e1117" stroke="#5effd6" stroke-width="2"/><text x="' + cx + '" y="' + (cy - 4) + '" fill="#dce8ff" font-size="14" font-weight="800" text-anchor="middle">' + esc(cut(E.name, 8)) + '</text><text x="' + cx + '" y="' + (cy + 14) + '" fill="#8487bd" font-size="10" text-anchor="middle">' + esc(E.code) + '</text></g>';
    return '<svg class="eco-svg" viewBox="0 0 ' + W + ' ' + H + '" style="width:100%;height:auto;background:#0e1117;border:1px solid rgba(255,255,255,.08);border-radius:10px;cursor:grab"><g class="eco-g">' + lines.join('') + center + out.join('') + labels.join('') + '</g></svg>'
      + '<div style="font-size:10.5px;color:#6f72a8;margin-top:4px">노드 클릭 = 사건·픽·일정 → 그 날짜 달력 / 자리 → 테마맵 세부분야 / 뉴스·공시 → 원문 / 동행 → 그 종목창 · 고리 이름 클릭 = 목록 · 휠 = 줌 · 🗂 자리 점 색 = 테마 국면(빨강 주도 · 초록 급증 · 나머지는 밝을수록 최근 · 위 🕸 구와 같은 색)</div>';
  }

  function listHtml(E){
    var h = anaBlock(E) + finBlock(E);
    RINGS.forEach(function(r){
      var all = E[r[0]] || [];
      h += '<details id="eco-ring-' + r[0] + '" ' + (all.length && all.length <= 12 ? 'open' : '') + ' style="margin-bottom:6px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);border-radius:8px;padding:6px 10px"><summary style="cursor:pointer;color:' + r[3] + ';font-weight:700;font-size:12px">' + esc(r[1]) + ' ' + all.length + ' <span style="color:#6f72a8;font-weight:400;font-size:10.5px">· ' + esc(r[2]) + '</span></summary><div style="max-height:260px;overflow:auto;margin-top:4px">';
      if (!all.length) h += '<div style="font-size:11px;color:#6f72a8">없음</div>';
      all.forEach(function(x){
        var it = item(r[0], x, E); var body;
        if (r[0] === '자리') body = phDot(ph(x.테마)) + '<b>' + esc(x.테마) + '</b> / ' + esc(x.분야 || '-') + ' <span style="color:#8487bd">· 4년 ' + x.n + '회 · 이 종목 최근 ' + esc(x.최근 || '-') + '</span>'
          + (ph(x.테마) ? '<div style="color:#b8bde6">🎨 테마 국면 = ' + esc(ph(x.테마).글) + '</div>' : '') + (x.근거 ? '<div style="color:#9fa3d6">근거 = ' + esc(x.근거) + ' <span style="color:#6f72a8">(' + esc(x.출처) + ')</span></div>' : '') + (x.원문 && x.원문.length ? '<div style="color:#6f72a8">원문 테마 = ' + esc(x.원문.join(' · ')) + '</div>' : '') + herdLine(x);
        else if (r[0] === '사건') body = '<b>' + esc(x[0]) + '</b> ' + esc(x[1]) + ' <span style="color:' + (x[2] >= 0 ? '#ff6b6b' : '#5b9cff') + '">' + pct(x[2]) + '</span> ' + esc(x[3] || '') + (x[5] === '이름매칭' ? ' <span style="color:#ffc454">이름매칭</span>' : '') + '<div style="color:#9fa3d6">' + esc(x[4] || '') + '</div>';
        else if (r[0] === '뉴스' || r[0] === '공시') body = '<b>' + esc(x.d) + '</b> <span style="color:#8487bd">' + esc(x.src) + (x.테마 ? ' [' + esc(x.테마) + ']' : '') + '</span> ' + esc(x.t) + (x.u ? ' <span style="color:#7fb0ff">↗</span>' : '');
        else if (r[0] === '픽') { var f = x.f || {}; body = '<b>' + esc(x.d) + '</b> ' + esc(tool(x.도구)) + ' <span style="color:#8487bd">' + esc(Object.keys(f).slice(0, 7).map(function(k){ return k + '=' + (typeof f[k] === 'object' ? JSON.stringify(f[k]) : f[k]); }).join(' · ')) + '</span>'; }
        else if (r[0] === '원장') body = '<b>' + esc(x.파일) + '</b> ' + esc(x.제목) + '<div style="color:#9fa3d6">' + esc(x.문장) + '</div>';
        else if (r[0] === '동행') body = '<b>' + esc(x.name || x.code) + '</b> <span style="color:#8487bd">같이 ' + x.n + '회 · 최근 ' + esc(x.최근 || '-') + (x.테마 ? ' · ' + esc(x.테마) : '') + '</span>';
        else body = '<b>' + esc(x.d) + '</b> ' + esc(x.t) + (x.직접 ? ' <span style="color:#ffc454">종목명</span>' : '') + '<div style="color:#9fa3d6">' + esc(x.s || '') + '</div>';
        h += '<div class="eco-node" data-act="' + it.act + '" data-arg="' + esc(it.arg) + '" style="font-size:11px;line-height:1.5;padding:3px 0;border-bottom:1px solid rgba(255,255,255,.04);cursor:' + (it.act === 'none' ? 'default' : 'pointer') + '">' + body + '</div>';
      });
      h += '</div></details>';
    });
    // 맨 아래 한 줄 = 이 종목 테마들의 국면 모음(옛 E.국면 줄을 바꿈)
    var bag = {}, col = {}, base = '';
    (E.자리 || []).forEach(function(x){ var p = ph(x.테마); if (!p) return; (bag[p.이름] = bag[p.이름] || []).push(x.테마); col[p.이름] = p.색; base = p.기준일; });
    var ks = PH_ORDER.filter(function(k){ return bag[k]; });
    if (ks.length) h += '<div style="font-size:11px;color:#8487bd;line-height:1.6">🎨 이 종목 테마 국면(기준 ' + esc(base) + ' · 정규장 카드) = ' + ks.map(function(k){
        return '<span style="color:' + col[k] + '">●</span> ' + k + ' ' + bag[k].length + (k === '주도' || k === '급증' ? '(' + esc(bag[k].join('·')) + ')' : '');
      }).join(' · ') + '<br><span style="color:#6f72a8">주도 = 최근 20거래일 카드 등장 상위 10 · 급증 = 최근 5일 늘어남 상위 10(주도 밖) · 카드 등장이지 주가 상승폭·매수신호가 아니다</span></div>';
    return h;
  }

  function act(a, arg, code){
    try {
      if (a === 'date' && arg) { if (typeof closeStockDetail === 'function') closeStockDetail(); if (typeof showDayBubble === 'function') showDayBubble(arg); }
      else if (a === 'theme' && arg) { if (typeof closeStockDetail === 'function') closeStockDetail(); if (typeof _mmGoFields === 'function') _mmGoFields(arg); }
      else if (a === 'url' && arg) window.open(arg, '_blank', 'noopener');
      else if (a === 'stock' && arg) { var p = arg.split('|'); if (p[0] && p[0] !== code && typeof showStockFromData === 'function') showStockFromData({entry: {krStockCode: p[0], displayName: p[1] || p[0]}}); }
    } catch (e) { console.warn('생태계 이동', e); }
  }

  function render(box, mode){
    var E = box.__E; if (!E) return;
    var body = box.querySelector('.eco-body'); if (!body) return;
    body.innerHTML = mode === 'list' ? listHtml(E) : mapSvg(E);
    box.querySelectorAll('.eco-btn').forEach(function(b){ b.style.background = b.getAttribute('data-mode') === mode ? 'rgba(94,255,214,.2)' : 'rgba(255,255,255,.06)'; });
    try { localStorage.setItem('eco_mode', mode); } catch (e) {}
    if (mode !== 'list' && window.d3 && d3.zoom) {
      try { var svg = d3.select(body.querySelector('svg.eco-svg')), g = svg.select('g.eco-g'); svg.call(d3.zoom().scaleExtent([0.6, 4]).on('zoom', function(ev){ g.attr('transform', ev.transform); })); } catch (e) {}
    }
  }

  // 📉 월간눌림 이력(2026-09-29 사용자 "모든 것은 연결") = 캘린더 공용 함수(_월간눌림_종목·_월간눌림_html)가 달력과 ★같은 자료(월간눌림.js)를 읽어 그린다
  //   지도·목록 어느 쪽이든 위에 한 상자 · 공용 함수가 없는 화면이면 조용히 빈칸
  function fillMnl(box, code){
    var el = box.querySelector('.eco-mnl'); if (!el || typeof window._월간눌림_종목 !== 'function' || typeof window._월간눌림_html !== 'function') return;
    el.innerHTML = '<div style="font-size:10.5px;color:#6f72a8;margin:4px 0">📉 월간눌림 이력 불러오는 중…</div>';
    var part = {m: '', g: ''}, put = function(){ if (box.__E && box.__E.code === code) el.innerHTML = part.m + part.g; };
    window._월간눌림_종목(code, function(eps){ part.m = window._월간눌림_html(eps, 6); put(); });
    if (typeof window._급등눌림_종목 === 'function') window._급등눌림_종목(code, function(eps){ part.g = window._월간눌림_html(eps, 6, '급등'); put(); });   // 📈 급등눌림 이력(2026-09-30 사용자 "급등 버튼 종목도 월간눌림 달력에") = 월간 상자 밑에 한 상자 더
  }

  function draw(E, box){
    box.__E = E; var m = 'map'; try { m = localStorage.getItem('eco_mode') || 'map'; } catch (e) {}
    box.innerHTML = '<div style="background:rgba(10,14,30,.5);border:1px solid rgba(255,255,255,.1);border-radius:10px;padding:10px 12px">' + head(E) + '<div class="eco-mnl"></div><div class="eco-body"></div></div>';
    fillMnl(box, E.code);
    box.onclick = function(ev){
      var t = ev.target.closest ? ev.target.closest('.eco-btn, .eco-node, .eco-ring') : null; if (!t) return;
      if (t.classList.contains('eco-btn')) { render(box, t.getAttribute('data-mode')); return; }
      if (t.classList.contains('eco-ring')) { render(box, 'list'); var d = box.querySelector('#eco-ring-' + t.getAttribute('data-ring')); if (d) { d.open = true; d.scrollIntoView({block: 'nearest'}); } return; }
      act(t.getAttribute('data-act'), t.getAttribute('data-arg'), E.code);
    };
    render(box, m);
    withTE(function(){ if (box.__E === E) draw(E, box); });   // 국면 파일이 늦게 오면 한 번 다시 그린다
  }

  function fallback(why){
    return '<div style="font-size:11px;color:#8487bd;line-height:1.55;background:rgba(10,14,30,.5);border:1px solid rgba(255,255,255,.1);border-radius:10px;padding:10px 12px">🕸 <b style="color:#9fa3d6">종목 생태계</b> — ' + esc(why) + '.<br><span style="font-size:10.5px">PC 에서 <code style="color:#5effd6">python -X utf8 주도주\\_생태계\\_생태계_빌드.py --codes 코드</code> (전체 = --all)</span></div>';
  }

  window._생태계_채우기 = function(code, id){
    var box = document.getElementById(id); if (!box) return;
    code = String(code || ''); if (!/^[0-9A-Z]{6}$/.test(code)) { box.innerHTML = fallback('종목 코드가 없어 생태계를 못 찾습니다'); return; }
    var E = window['__E_' + code]; if (E) { draw(E, box); return; }
    box.innerHTML = '<div style="font-size:11px;color:#8487bd">🕸 생태계 불러오는 중…</div>';
    var s = document.createElement('script'); s.src = 'dashboard/data/생태계/' + code + '.js';
    s.onload = function(){ var E2 = window['__E_' + code]; if (E2) draw(E2, box); else box.innerHTML = fallback('파일은 있는데 형식이 다릅니다'); };
    s.onerror = function(){ box.innerHTML = fallback('이 종목 생태계 파일이 아직 없습니다'); };
    document.head.appendChild(s);
  };
})();
