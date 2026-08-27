/* ===================================================================
 * resume.js —— 断点续学（跨天续接上次学习位置）
 * 纯前端、零联网，按 (app + 孩子 child + 子视图 mod) 存/取学习位置。
 * 各学习模块引入本文件后，用 window.Resume.get/set 即可实现
 * "学好一个，下次打开接下去学，不重头开始"。
 * =================================================================== */
(function () {
  function k(app, child) {
    return 'resume_' + (app || 'app') + '_' + (child || 'user');
  }
  function load(app, child) {
    try {
      var o = JSON.parse(localStorage.getItem(k(app, child)) || '{}');
      return (o && typeof o === 'object') ? o : {};
    } catch (e) { return {}; }
  }
  function save(app, child, obj) {
    try { localStorage.setItem(k(app, child), JSON.stringify(obj)); } catch (e) {}
  }
  // 读取某子视图的续接位置；不存在返回 null
  function get(app, child, mod) {
    var o = load(app, child);
    return (o && o[mod] !== undefined) ? o[mod] : null;
  }
  // 保存某子视图的续接位置
  function set(app, child, mod, val) {
    var o = load(app, child);
    o[mod] = val;
    save(app, child, o);
  }
  // 删除某个（或整个 app+child 的）续接记录
  function del(app, child, mod) {
    var o = load(app, child);
    if (mod) { delete o[mod]; } else { o = {}; }
    save(app, child, o);
  }
  window.Resume = { get: get, set: set, del: del };
})();
