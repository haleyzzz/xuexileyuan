/* =========================================================================
 * portal-common.js  —  统一门户 · 共享认证与集成接口（SSO 子系统）
 * -------------------------------------------------------------------------
 * 本文件被「门户页(门户.html)」与「所有被集成的应用」共同加载。
 * 它只负责两件事：单点登录(SSO) 会话 + 应用注册接口。
 * 无任何后端依赖，纯前端 localStorage 会话，适合家庭 / 个人离线场景。
 *
 * ★★★ 标准应用注册接口（可扩展性核心）★★★
 *   在门户页里调用 Portal.register({ ... })，即可接入一个新应用：
 *     Portal.register({
 *       id:       'word',                 // 唯一 ID（字母数字，建议英文）
 *       name:     '英语单词卡片',          // 展示名称
 *       desc:     '1000+词·音标朗读拼读写词', // 一句话描述
 *       icon:     '\u{1F504}',                  // emoji 图标
 *       color:    '#4cc9f0',             // 主题色
 *       url:      '英语单词卡片.html',     // 相对路径（与本文件同目录）
 *       category: '英语',                 // 分类（用于筛选）
 *       tags:     ['单词','音标'],        // 标签数组（用于筛选）
 *       roles:    ['student','parent']   // 可见角色：'student'=学生 'parent'=家长
 *     });
 *   新增应用 = ① 把应用 HTML 放进同目录；② 在门户页 APPS 数组追加一项（或调用
 *   Portal.register）。无需改动任何其它代码 —— 这就是标准化快速接入。
 * ========================================================================= */
(function () {
  'use strict';
  var KEY = 'portal_session_v1';          // 会话存储键
  var PORTAL = '门户.html';               // 门户入口（守卫回跳目标）
  var Portal = window.Portal || (window.Portal = {});

  /* ---------------- 单点登录(SSO) 会话 ---------------- */
  // 登录：写入会话（默认 7 天有效）；可选 child = 选中的孩子 id（用于按年龄分流）
  Portal.login = function (user, role, expDays, child) {
    expDays = expDays || 7;
    var s = { user: user, role: role, ts: Date.now(), exp: Date.now() + expDays * 864e5 };
    if (child) s.child = child;
    try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {}
    return s;
  };
  // 补丁式写入会话（用于选娃后把 child 写回当前会话）
  Portal.setSession = function (s) {
    try { if (s && s.role) localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {}
    return s;
  };
  // 读取会话（过期自动清除）
  Portal.getSession = function () {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return null;
      var s = JSON.parse(raw);
      if (s.exp && s.exp < Date.now()) { localStorage.removeItem(KEY); return null; }
      return s;
    } catch (e) { return null; }
  };
  Portal.isAuthed = function () { return !!Portal.getSession(); };
  Portal.logout = function () { try { localStorage.removeItem(KEY); } catch (e) {} };
  Portal.hasRole = function (role) { var s = Portal.getSession(); return !!(s && s.role === role); };

  /* ---------------- 应用守卫（被集成应用加载时调用） ----------------
   * requiredRoles : 允许访问的角色数组
   * returnUrl     : 当前页地址（登录后回跳）
   * 通过 -> 返回 session；未通过 -> 清空页面并跳门户登录，返回 null。
   * 注意：本函数由应用 <head> 内调用，此时门户.html 已写入会话即可放行，
   *        从而实现“登录一次，访问全部应用”的单点登录。                 */
  Portal.require = function (requiredRoles, returnUrl) {
    var s = Portal.getSession();
    if (s && (!requiredRoles || requiredRoles.indexOf(s.role) >= 0)) return s;
    try { document.documentElement.innerHTML = ''; } catch (e) {}
    var url = PORTAL + (returnUrl ? ('?redirect=' + encodeURIComponent(returnUrl)) : '');
    try { location.href = url; } catch (e) {}
    return null;
  };

  /* ---------------- 应用注册表接口 ---------------- */
  Portal.APPS = Portal.APPS || [];
  Portal.register = function (app) { if (app && app.id) Portal.APPS.push(app); };

  /* ---------------- 使用频率统计（门户调用） ---------------- */
  Portal.bumpUse = function (id) {
    try {
      var k = 'portal_uses';
      var m = JSON.parse(localStorage.getItem(k) || '{}');
      m[id] = (m[id] || 0) + 1;
      localStorage.setItem(k, JSON.stringify(m));
    } catch (e) {}
  };
  Portal.getUses = function () {
    try { return JSON.parse(localStorage.getItem('portal_uses') || '{}'); }
    catch (e) { return {}; }
  };

  /* ---------------- 个性化偏好（按「当前登录孩子」持久化，避免双账户串号） ----------------
   * 结构: { fav:[appId...], order:[appId...] }；已登录某孩子时用其 child uid 隔离，否则回退角色。 */
  function _prefsKey(role){
    var ch = (window.Portal && Portal.getSession && Portal.getSession().child) || '';
    return 'portal_prefs_' + (ch || role);
  }
  Portal.getPrefs = function (role) {
    try { return JSON.parse(localStorage.getItem(_prefsKey(role)) || '{"fav":[],"order":[]}'); }
    catch (e) { return { fav: [], order: [] }; }
  };
  Portal.setPrefs = function (role, p) {
    try { localStorage.setItem(_prefsKey(role), JSON.stringify(p)); } catch (e) {}
  };
})();

/* ---------------- 统一返回导航栏（全站子页面） ----------------
 * 由 portal-common.js 在每个加载它的页面自动注入，保证：
 *   · 所有「详情页 / 子页面 / 弹窗页」左上角统一出现一个固定顶栏；
 *   · 左侧「← 返回」清晰返回图标，中间显示页面标题；
 *   · 点击 = 返回上一个浏览的页面（history.back），无同源历史时兜底回门户；
 *   · 首页（门户 / index）与 iframe 内嵌页（如进度看板）不显示，避免重复/错位；
 *   · 自动清理各页原本零散的 .back / .back-btn / .fab-back，确保全站风格与行为一致。
 */
(function () {
  'use strict';
  try {
    if (window.self !== window.top) return;            // iframe 内嵌不显示
    var p = (location.pathname.split('/').pop() || '').toLowerCase();
    if (p === '门户.html' || p === 'index.html' || p === '') return;  // 首页不显示
    if (document.querySelector('.rope-backbar')) return;   // 防重复注入

    function goBack() {
      try {
        var ref = document.referrer;
        if (ref && (new URL(ref)).origin === location.origin && window.history.length > 1) {
          var url = location.href;
          history.back();
          // 兜底：若 400ms 后仍在原页（history.back 无效），跳门户
          setTimeout(function () { if (location.href === url) location.href = '门户.html'; }, 400);
        } else {
          location.href = '门户.html';
        }
      } catch (e) { location.href = '门户.html'; }
    }

    function inject() {
      if (document.querySelector('.rope-backbar')) return;
      // 清理原本零散的返回按钮，统一交给本导航栏
      ['.back', '.back-btn', '.fab-back'].forEach(function (sel) {
        var els = document.querySelectorAll(sel);
        for (var i = 0; i < els.length; i++) {
          if (els[i] && els[i].onclick) continue; // 跳过页内返回按钮（如口语跟读「返回短文列表」），保留其 onclick 行为
          if (els[i] && els[i].parentNode) els[i].parentNode.removeChild(els[i]);
        }
      });
      var css = ''
        + '.rope-backbar{position:fixed;top:0;left:0;right:0;height:52px;z-index:100000;'
        + 'display:flex;align-items:center;gap:10px;padding:0 12px;'
        + 'background:rgba(255,255,255,.95);box-shadow:0 2px 12px rgba(31,42,68,.16);'
        + 'font-family:inherit;-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);'
        + 'border-bottom:1px solid rgba(31,42,68,.06);touch-action:manipulation}'
        + '.rope-backbar .rk-back{border:0;color:#fff;position:relative;z-index:1;'
        + 'background:linear-gradient(135deg,#6a5ae0,#5747d6);'
        + 'border-radius:999px;padding:11px 18px;min-height:42px;font-size:16px;font-weight:800;'
        + 'cursor:pointer;font-family:inherit;white-space:nowrap;display:inline-flex;'
        + 'align-items:center;gap:7px;line-height:1;'
        + 'box-shadow:0 3px 10px rgba(87,71,214,.4);'
        + 'transition:transform .06s ease,box-shadow .12s ease,filter .12s ease;'
        + 'touch-action:manipulation;user-select:none;-webkit-user-select:none;'
        + '-webkit-tap-highlight-color:transparent}'
        + '.rope-backbar .rk-back:hover{filter:brightness(1.08);'
        + 'box-shadow:0 4px 14px rgba(87,71,214,.52)}'
        + '.rope-backbar .rk-back:active{transform:scale(.92);filter:brightness(.92)}'
        + '.rope-backbar .rk-title{flex:1;font-size:15px;font-weight:800;color:#3d3a4b;'
        + 'overflow:hidden;text-overflow:ellipsis;white-space:nowrap;padding-left:4px;'
        + 'user-select:none}';
      document.body.style.paddingTop = '52px';
      var st = document.createElement('style');
      st.textContent = css;
      document.head.appendChild(st);

      var bar = document.createElement('div');
      bar.className = 'rope-backbar';
      bar.innerHTML = '<button class="rk-back" aria-label="返回">&#8592; 返回</button>'
                    + '<span class="rk-title"></span>';
      bar.querySelector('.rk-back').addEventListener('click', goBack);
      var raw = (document.title || '').replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE00}-\u{FE0F}\u{2190}-\u{21FF}]/gu, '').trim();
      bar.querySelector('.rk-title').textContent = raw || '返回';
      document.body.appendChild(bar);
    }

    if (document.body) inject();
    else document.addEventListener('DOMContentLoaded', inject);
  } catch (e) {}
})();

/* 全局注入云同步模块（GitHub 私有 Gist 字段级同步，跨设备互通；无 Token 不生效） */
(function(){
  if(document.getElementById('__sync_injected')) return;
  var s=document.createElement('script');
  s.src='sync.js'; s.id='__sync_injected';
  (document.head||document.documentElement).appendChild(s);
})();
