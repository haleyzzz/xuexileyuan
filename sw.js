/* Service Worker —— 暑假英语打卡离线缓存（干净部署版 v13）
 * 策略：
 *  - install：预缓存全部本地静态资源（HTML/JS/图片/音频/验证文件）
 *  - fetch：
 *      · 跨域请求（B站视频、域名验证）直接走网络，不拦截
 *      · 页面导航（navigate）：network-first，离线时回退到缓存页面
 *      · 其它同源静态资源：stale-while-revalidate（先用缓存秒开，后台静默更新，告别忘升版本号导致旧版）
 *  - activate：清理旧版本缓存并立即接管所有页面
 */
const CACHE = 'summer-checkin-v105';
const PRECACHE = [
  './',
  'index.html',
  'offline.html',
  '门户.html',
  '积分商城.html',
  'rewards.js',
  'gloss.js',
  'resume.js',
  '统一打卡中心.html',
  '数学打卡.html',
  '科学打卡.html',
  '语文打卡.html',
  '单词训练.html',
  '英语每日打卡.html',
  '英语-听力填空.html',
  '英语-阅读理解.html',
  '英语语法学习卡.html',
  '英语-口语跟读.html',
  '英语-听写默写.html',
  '英语阅读.html',
  '分级阅读.html',
  '自然拼读串记卡.html',
  'PEP冲刺计划.html',
  'PEP同步课堂.html',
  '数学-竖式计算.html',
  '数学-单位换算.html',
  '数学-口算挑战.html',
  '数学-几何图形.html',
  '数学-解题引导.html',
  '数学-应用题进阶.html',
  '数学-应用题闯关.html',
  '语文-作文起步.html',
  '语文-阅读理解.html',
  '语文-语句诊治.html',
  '语文-近反义词.html',
  '语文-成语闯关.html',
  '语文-查字典.html',
  '语文-字词听写.html',
  '语文-古诗词.html',
  '语文-课文背诵.html',
  '科学-探究记录.html',
  '科学-自然观察记录.html',
  '科学-小实验.html',
  '科学-科学问答.html',
  '进度看板.html',
  'handwrite.js',
  'penpaint.js',
  'phonics-data.js',
  'grammar-data.js',
  'accounts.js',
  'speech.js',
  'util.js',
  '打卡中心.html',
  '跳绳打卡.html',
  '跳绳趋势图.html',
  '英语阅读.html',
  '分级阅读.html',
  '家长陪读.html',
  'readers-data.js',
  '家长查看.html',
  '域名配置.html',
  'portal-common.js',
  'words.js',
  'grades.js',
  'library-data.js',
  'sentences.js',
  'study-time.js',
  'story-data.js',
  'tracker.js',
  'sync.js',
  'qrcode.min.js',
  'rope-particles.js',
  'rope-badges.js',
  'apple-touch-icon.png',
  'icon-512.png',
  'celebrate.wav',
  '.well-known/rope-verify.txt',
  'manifest.webmanifest'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => Promise.all(
        PRECACHE.map(url => cache.add(url).catch(() => {}))
      ))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  // 跨域资源（B站 iframe、域名验证 fetch）交回网络，不缓存
  if (url.origin !== self.location.origin) return;

  // 页面导航：先尝试网络，失败回退缓存（保证离线可打开任意已缓存页面）
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then(res => {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(req, copy));
          return res;
        })
        .catch(() =>
          caches.match(req)
            .then(r => r || caches.match('门户.html'))
            .then(r => r || caches.match('index.html'))
            .then(r => r || caches.match('offline.html'))
            .then(r => r || caches.match('./'))
        )
    );
    return;
  }

  // 同源静态资源：stale-while-revalidate（先返回缓存秒开，后台静默更新）
  event.respondWith(
    caches.match(req).then(cached => {
      const network = fetch(req).then(res => {
        if (res && res.status === 200) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(req, copy));
        }
        return res;
      }).catch(() => cached);
      return cached || network;
    })
  );
});
