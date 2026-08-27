/* accounts.js — 双账户(Zachary/Zoran)共享登录与隔离存储模块
 * ---------------------------------------------------------------------------
 * 用法：
 *   1) 在应用脚本前引入：<script src="accounts.js"></script>
 *   2) 存储：Accounts.get(app, user, sub, fallback) / Accounts.set(app, user, sub, val)
 *           内部键名格式： app + '_' + user + '_' + sub
 *   3) 登录：Accounts.gate(app, { onLogin: function(user){ ...启动应用... } })
 *   4) 切换：Accounts.mountSwitch(app)  // 注入右上角“当前孩子·切换”浮标
 *   5) 可选 PIN：window.ACCOUNTS_PINS = { zachary:'1234', zoran:'' } （引入本文件后设置）
 * 数据按「应用 + 孩子」严格隔离，Zachary 与 Zoran 互不可见。
 * ------------------------------------------------------------------------- */
(function () {
  'use strict';
  var A = window.Accounts || (window.Accounts = {});

  A.USERS = [
    { id: 'zachary', name: 'Zachary', role: '哥哥', emoji: '🦊', color: '#ff8c42', stage: '小学', grade: 4 },
    { id: 'zoran',   name: 'Zoran',   role: '弟弟', emoji: '🐰', color: '#4cc9f0', stage: '学前', grade: 0 }
  ];
  A.byId = function (id) {
    for (var i = 0; i < A.USERS.length; i++) if (A.USERS[i].id === id) return A.USERS[i];
    return null;
  };
  /* =========================================================================
   * 阶段化课程表（核心能力：哥哥 / 弟弟的课程分开设置）
   * -------------------------------------------------------------------------
   * 哥哥 Zachary（小学四年级）：开放全部小学应用。
   * 弟弟 Zoran（学前 → 中班 → 大班 → 小学一年级）：
   *   - 升入小学前（中班 / 大班阶段）仅开放「中班适龄」应用集合（覆盖英语/语文/数学/
   *     科学四科的基础内容）；
   *   - 到 2028-09-01 自动升入小学一年级，开放全部小学应用（无需改代码/部署）；
   *   - 两兄弟的进度均按 child id 隔离（Accounts.get/set 键名含 child），互不影响。
   * ========================================================================= */
  // 弟弟升学阈值（一年级开学日）
  var ZORAN_PROMOTE_DATE = new Date(2028, 8, 1); // JS 月份 8 = 九月
  // 按真实时间线推算弟弟当前所处阶段
  // 注：真实时间线为 2026-09 中班 → 2027-09 大班 → 2028-09 一年级。
  // 升小学前（含当前「即将中班」）统一按「中班」阶段呈现，内容即中班基础集，
  // 避免家长看到「学前」字样与「中班内容」表述不一致；大班/小学切换保持不变。
  function zoranPhase(d) {
    if (d >= ZORAN_PROMOTE_DATE) return '小学';        // 一年级起
    if (d >= new Date(2027, 8, 1)) return '大班';
    return '中班';
  }
  // 自动升学：把弟弟的阶段 / 年级写入用户对象（浏览器按当前日期判断）
  (function promoteZoranIfDue() {
    try {
      var z = A.byId('zoran'); if (!z) return;
      var ph = zoranPhase(new Date());
      if (ph === '小学') { z.stage = '小学'; z.grade = 1; z.phase = '小学一年级'; }
      else { z.stage = '学前'; z.grade = 0; z.phase = ph; } // 学前/中班/大班 统一归为「学前」阶段
    } catch (e) {}
  })();
  /* 年龄阶段：'小学' / '学前'。用于门户按年龄分流与幼儿模式。 */
  A.stage = function (id) { var u = A.byId(id); return (u && u.stage) ? u.stage : '小学'; };
  A.isToddler = function (id) { return A.stage(id) === '学前'; };
  /* 孩子所属年级（7 级体系：k / g1 ~ g6），用于阅读/单词按年级筛选 */
  A.gradeOf = function (id) { var u = A.byId(id); return (u && u.grade != null) ? u.grade : 1; };
  A.gradeLabel = function (id) { return window.gradeLabel ? window.gradeLabel(A.gradeOf(id)) : A.gradeOf(id); };
  /* 是否为小学阶段（开放全部科目） */
  A.isPrimary = function (id) { var u = A.byId(id); return !!(u && u.stage === '小学'); };
  /* 阶段展示文案：小学四年级 / 中班 / 大班 / 小学一年级 ... */
  A.phaseLabel = function (id) {
    var u = A.byId(id); if (!u) return '';
    if (u.stage === '小学') return '小学' + (u.grade ? u.grade + '年级' : '');
    return u.phase || '中班';
  };
  /* 中班（及大班）阶段可学应用：覆盖英语 / 语文 / 数学 / 科学 四科的基础内容。
   * 仅这一集合对弟弟（升小学前）可见；升入小学后开放全部应用。 */
  A.MIDDLE_CLASS_APPS = [
    'read', 'wordtrain', 'engci', 'companion', 'song-sing',   // 英语：分级阅读 / 单词认读 / 每日打卡 / 家长陪读 / 儿歌听唱
    'chinese-poem',                              // 语文：古诗词听读启蒙
    'math-checkin', 'math-mental',               // 数学：每日打卡 / 基础口算
    'science-checkin', 'science-observe'         // 科学：每日打卡 / 自然观察
  ];
  /* 兼容旧引用（门户老代码可能用到 A.TODDLER_APPS） */
  A.TODDLER_APPS = A.MIDDLE_CLASS_APPS;
  /* 返回某孩子当前可学应用 id 列表；返回 null 表示「全部应用」（小学阶段）。 */
  A.curriculumFor = function (id) {
    var u = A.byId(id); if (!u) return null;
    if (u.stage === '小学') return null;          // 小学：全部科目
    return A.MIDDLE_CLASS_APPS.slice();           // 学前/中班/大班：仅中班基础集
  };

  A.PINS = window.ACCOUNTS_PINS || {};
  A.current = null;

  A.key = function (app, user, sub) { return app + '_' + user + (sub ? '_' + sub : ''); };
  A.get = function (app, user, sub, fallback) {
    try {
      var v = localStorage.getItem(A.key(app, user, sub));
      return v == null ? (fallback === undefined ? null : fallback) : JSON.parse(v);
    } catch (e) { return fallback === undefined ? null : fallback; }
  };
  A.set = function (app, user, sub, val) {
    try { localStorage.setItem(A.key(app, user, sub), JSON.stringify(val)); } catch (e) {}
  };

  /* ---------- 注入样式 ---------- */
  var CSS = [
    '.acc-overlay{position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;',
    'background:linear-gradient(160deg,#eaf2ff,#f6f1ff,#fff6ec);padding:20px;',
    'font-family:-apple-system,BlinkMacSystemFont,"PingFang SC","Microsoft YaHei",sans-serif}',
    '.acc-title{position:absolute;top:9%;width:100%;text-align:center;font-size:20px;font-weight:800;color:#1f2a44}',
    '.acc-card-wrap{display:flex;gap:18px;flex-wrap:wrap;justify-content:center;max-width:560px}',
    '.acc-card{flex:1 1 200px;max-width:240px;min-width:160px;background:#fff;border-radius:22px;padding:28px 18px;',
    'box-shadow:0 10px 30px rgba(31,42,68,.12);cursor:pointer;text-align:center;transition:transform .12s;border:3px solid transparent}',
    '.acc-card:active{transform:scale(.97)}',
    '.acc-card .ava{font-size:56px;line-height:1}',
    '.acc-card .nm{font-size:21px;font-weight:800;margin-top:10px;color:#1f2a44}',
    '.acc-card .rl{font-size:13px;color:#7b87a3;margin-top:4px}',
    '.acc-card.zachary{border-color:#ffd9bf}.acc-card.zoran{border-color:#cdeeff}',
    '.acc-switch{position:fixed;top:10px;right:10px;z-index:9998;background:#fff;border:1px solid #e6ecf5;',
    'border-radius:999px;padding:6px 12px;font-size:13px;font-weight:700;color:#1f2a44;cursor:pointer;',
    'box-shadow:0 4px 12px rgba(31,42,68,.1);font-family:inherit}',
    '.acc-pinmask{position:fixed;inset:0;z-index:10000;background:rgba(20,28,48,.45);display:flex;align-items:center;justify-content:center}',
    '.acc-pk{background:#fff;border-radius:22px;padding:26px 22px;width:300px;max-width:90%;text-align:center;box-shadow:0 12px 40px rgba(0,0,0,.2)}',
    '.acc-pk .ava{font-size:48px}.acc-pk .nm{font-size:18px;font-weight:800;margin-top:6px}',
    '.acc-dots{display:flex;gap:8px;justify-content:center;margin:16px 0}',
    '.acc-dots i{width:12px;height:12px;border-radius:50%;background:#e0e6f0;display:inline-block}',
    '.acc-dots i.on{background:#4cc9f0}',
    '.acc-keys{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:6px}',
    '.acc-keys button{border:none;background:#f1f5fb;border-radius:12px;padding:14px 0;font-size:20px;font-weight:800;cursor:pointer;font-family:inherit}',
    '.acc-keys button:active{background:#e2e9f5}.acc-keys button.del{color:#e5484d}',
    '@media(max-width:420px){.acc-title{font-size:17px}}',
    /* ---------- 幼儿模式底栏（时长护栏 + 集贴纸） ---------- */
    'body.has-tbar{padding-bottom:60px}',
    '.acc-tbar{position:fixed;left:0;right:0;bottom:0;z-index:9990;display:flex;align-items:center;gap:12px;',
    'padding:9px 14px;background:#fff;border-top:2px solid #ffd9bf;box-shadow:0 -4px 14px rgba(31,42,68,.10);',
    'font-family:inherit;font-size:14px}',
    '.acc-tbar .atb-timer{font-weight:800;color:#1f2a44;font-variant-numeric:tabular-nums}',
    '.acc-tbar .atb-timer.warn{color:#ff8fab}',
    '.acc-tbar .atb-stk{margin-left:auto;font-weight:800;color:#ffb703}',
    '.acc-tbar .atb-done{border:none;background:#ffd166;color:#5a4b00;border-radius:12px;padding:8px 14px;font-weight:800;cursor:pointer;font-family:inherit}',
    '.acc-tbar .atb-done:active{transform:scale(.96)}',
    '.acc-toast{position:fixed;left:50%;top:16%;transform:translateX(-50%);z-index:9995;background:rgba(31,42,68,.92);color:#fff;',
    'padding:12px 18px;border-radius:14px;font-size:15px;font-weight:700;box-shadow:0 8px 24px rgba(0,0,0,.25)}',
    '.acc-burst{position:fixed;z-index:9994;pointer-events:none;font-size:22px;animation:accFall 1.4s ease-in forwards}',
    '@keyframes accFall{from{opacity:1;transform:translateY(-10px) rotate(0)}to{opacity:0;transform:translateY(82vh) rotate(360deg)}}'
  ].join('');
  (function () {
    var s = document.createElement('style'); s.textContent = CSS;
    (document.head || document.documentElement).appendChild(s);
  })();

  /* ---------- 登录入口（仅 Zachary / Zoran） ---------- */
  A.gate = function (app, opts) {
    opts = opts || {};
    var onLogin = opts.onLogin || function () {};
    // [安全修复 v81] 移除 ?auto=<uid> 自动登录：uid 可枚举（zachary/zoran），可绕过登录浮层与 PIN；
    // 原「单词训练页 iframe 透传」功能已无任何页面使用（全项目检索无 auto= 调用点），直接删除。
    showOverlay(app, function (user) {
      A.current = user;
      try { localStorage.setItem('accounts_last_' + app, user); } catch (e) {}
      removeOverlay();
      onLogin(user);
    });
  };

  function showOverlay(app, done) {
    removeOverlay();
    var ov = document.createElement('div');
    ov.className = 'acc-overlay'; ov.id = 'accOverlay';
    var title = document.createElement('div'); title.className = 'acc-title';
    title.textContent = '请选择是谁在学习 👇';
    var wrap = document.createElement('div'); wrap.className = 'acc-card-wrap';
    A.USERS.forEach(function (u) {
      var c = document.createElement('div'); c.className = 'acc-card ' + u.id;
      c.innerHTML = '<div class="ava">' + u.emoji + '</div><div class="nm">' + u.name + '</div><div class="rl">' + u.role + '</div>';
      c.onclick = function () { pick(u, app, done); };
      wrap.appendChild(c);
    });
    ov.appendChild(title); ov.appendChild(wrap);
    document.body.appendChild(ov);
  }
  function removeOverlay() { var o = document.getElementById('accOverlay'); if (o && o.parentNode) o.parentNode.removeChild(o); }

  function pick(u, app, done) {
    var pin = (A.PINS && A.PINS[u.id]) || '';
    if (pin) showPin(u, app, done); else done(u.id);
  }

  function showPin(u, app, done) {
    var mask = document.createElement('div'); mask.className = 'acc-pinmask'; mask.id = 'accPinMask';
    var pinInput = '';
    var pk = document.createElement('div'); pk.className = 'acc-pk';
    pk.innerHTML = '<div class="ava">' + u.emoji + '</div><div class="nm">' + u.name + '</div>' +
      '<div class="acc-dots" id="accDots"><i></i><i></i><i></i><i></i></div><div class="acc-keys" id="accKeys"></div>';
    mask.appendChild(pk); document.body.appendChild(mask);
    function renderDots() {
      var d = document.getElementById('accDots').children;
      for (var i = 0; i < 4; i++) d[i].classList.toggle('on', i < pinInput.length);
    }
    var keys = document.getElementById('accKeys');
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '⌫', '0', '✓'].forEach(function (k) {
      var b = document.createElement('button'); b.textContent = k;
      if (k === '⌫') b.className = 'del';
      b.onclick = function () {
        if (k === '⌫') pinInput = pinInput.slice(0, -1);
        else if (k === '✓') {
          if (pinInput === ((A.PINS && A.PINS[u.id]) || '')) { if (mask.parentNode) mask.parentNode.removeChild(mask); done(u.id); }
          else { pinInput = ''; renderDots(); }
        } else if (/^[0-9]$/.test(k) && pinInput.length < 4) pinInput += k;
        renderDots();
      };
      keys.appendChild(b);
    });
  }

  /* ---------- 切换账户浮标 ---------- */
  A.mountSwitch = function (app) {
    var old = document.getElementById('accSwitch'); if (old && old.parentNode) old.parentNode.removeChild(old);
    var u = A.byId(A.current); if (!u) return;
    var b = document.createElement('button'); b.className = 'acc-switch'; b.id = 'accSwitch';
    b.innerHTML = u.emoji + ' ' + u.name + ' · 切换';
    b.onclick = function () {
      A.current = null;
      var s = document.getElementById('accSwitch'); if (s && s.parentNode) s.parentNode.removeChild(s);
      A.gate(app, { onLogin: function () { A.mountSwitch(app); } });
    };
    document.body.appendChild(b);
  };
  A.logout = function (app) { A.current = null; A.mountSwitch(app); A.gate(app, {}); };

  /* ---------- 幼儿模式底栏：8 分钟时长护栏 + 集贴纸 + 撒花 ---------- */
  A.toddler = (function () {
    var BAR_ID = 'accToddlerBar', MAX = 8 * 60; // 8 分钟
    var t0 = null, timerInt = null, user = null;

    function ensureBar(u) {
      user = u;
      var old = document.getElementById(BAR_ID); if (old && old.parentNode) old.parentNode.removeChild(old);
      var bar = document.createElement('div'); bar.id = BAR_ID; bar.className = 'acc-tbar';
      bar.innerHTML =
        '<span class="atb-timer" id="atbTimer">⏱ 00:00</span>' +
        '<span class="atb-stk">🌟 <span id="atbStkN">0</span></span>' +
        '<button class="atb-done" id="atbDone">我完成啦 🌟</button>';
      (document.body || document.documentElement).appendChild(bar);
      document.body.classList.add('has-tbar');
      document.getElementById('atbDone').onclick = function () {
        addSticker(u); burst(); flash('太棒了！贴纸 +1 🌟');
      };
      refreshStk(u); startTimer();
      return bar;
    }
    function startTimer() { t0 = Date.now(); tick(); timerInt = setInterval(tick, 1000); }
    function tick() {
      var el = document.getElementById('atbTimer'); if (!el) return;
      var s = Math.floor((Date.now() - t0) / 1000);
      var mm = String(Math.floor(s / 60)).padStart(2, '0'), ss = String(s % 60).padStart(2, '0');
      el.textContent = '⏱ ' + mm + ':' + ss;
      if (s >= MAX) { el.classList.add('warn'); if (s === MAX) { flash('该休息一下啦 🎉 喝口水，等会儿再玩～'); burst(); } }
    }
    function addSticker(u) { var n = (A.get('toddler', u, 'stickers', 0) || 0) + 1; A.set('toddler', u, 'stickers', n); refreshStk(u); }
    function refreshStk(u) { var n = A.get('toddler', u, 'stickers', 0) || 0; var el = document.getElementById('atbStkN'); if (el) el.textContent = n; }
    function flash(msg) {
      var t = document.getElementById('accToast');
      if (!t) { t = document.createElement('div'); t.id = 'accToast'; t.className = 'acc-toast'; (document.body || document.documentElement).appendChild(t); }
      t.textContent = msg; t.style.display = 'block';
      clearTimeout(t._h); t._h = setTimeout(function () { t.style.display = 'none'; }, 2200);
    }
    function burst() {
      var emo = ['🌟', '🎉', '💛', '🐰', '⭐'];
      for (var i = 0; i < 14; i++) {
        (function () {
          var s = document.createElement('div'); s.className = 'acc-burst';
          s.textContent = emo[Math.floor(Math.random() * emo.length)];
          s.style.left = (8 + Math.random() * 84) + 'vw'; s.style.top = '8vh';
          (document.body || document.documentElement).appendChild(s);
          setTimeout(function () { if (s.parentNode) s.parentNode.removeChild(s); }, 1500);
        })();
      }
    }
    return {
      start: function (u) { ensureBar(u); },
      addSticker: addSticker,
      count: function (u) { return A.get('toddler', u, 'stickers', 0) || 0; },
      burst: burst,
      flash: flash
    };
  })();

  window.ACCOUNTS_PINS = A.PINS;
})();
