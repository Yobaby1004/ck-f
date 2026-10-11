/* 📱 천억 캘린더 폰 전체판 서비스워커 (규칙_v1.md §3) · 원본 = 주도주\_모바일전체\_sw.js (셸 변환기가 sw.js 로 복사)
   ① 조각(조각/<전역>/<달>.js?v=<내용 해시>) = 기억 먼저(주소가 내용마다 달라 낡을 수 없음) · 상한 약 200MB(오래된 것부터 지움)
   ② 그 밖(index.html · 첫 화면 묶음 · 색인 · 통째 · 화면 코드 · 봉/생태계 등) = 네트워크 먼저, 끊기면 기억(오프라인에서도 열림)
   ★맨 위 '자료 신선도'·각 달력의 날짜로 오늘 자료인지 확인한다. 매수신호 아님. */
const C_CHUNK = 'ckf-조각-v1', C_NET = 'ckf-망-v1';
const MAX_CHUNK = 7000;   // 조각 평균 약 29KB × 7000 ≈ 200MB
const MAX_NET = 3000;     // 봉·생태계 등(종목을 많이 열어도 무한정 쌓이지 않게)
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil((async () => {
  for (const k of await caches.keys()) if (k !== C_CHUNK && k !== C_NET) await caches.delete(k);   // 옛 판 기억 지움
  await self.clients.claim();
})()));
function 조각인가(u) {
  const p = decodeURIComponent(u.pathname);
  return p.includes('/조각/') && u.searchParams.has('v') && !/\/조각\/_(첫화면|색인)\.js$/.test(p);
}
self.addEventListener('fetch', (e) => {
  const r = e.request;
  if (r.method !== 'GET') return;
  const u = new URL(r.url);
  if (u.origin !== self.location.origin) return;          // CDN(d3 등)은 브라우저에 맡김
  e.respondWith(조각인가(u) ? 기억먼저(r) : 망먼저(r));
});
const 줄이는중 = {};
async function 줄이기(name, max) {
  if (줄이는중[name]) return; 줄이는중[name] = true;
  try {
    const c = await caches.open(name), ks = await c.keys();
    if (ks.length > max) for (const k of ks.slice(0, ks.length - Math.floor(max * 0.9))) await c.delete(k);
  } finally { 줄이는중[name] = false; }
}
async function 기억먼저(r) {
  const c = await caches.open(C_CHUNK);
  const hit = await c.match(r);
  if (hit) return hit;
  const res = await fetch(r);
  if (res.ok) { c.put(r, res.clone()); 줄이기(C_CHUNK, MAX_CHUNK); }
  return res;
}
async function 망먼저(r) {
  const c = await caches.open(C_NET);
  try {
    const res = await fetch(r);
    if (res.ok) { c.put(r, res.clone()); 줄이기(C_NET, MAX_NET); }
    return res;
  } catch (err) {
    const hit = (await c.match(r)) || (await c.match(r, { ignoreSearch: true }));
    if (hit) return hit;
    throw err;
  }
}
