/* ============================================================
 * 全部模块打卡（按“实际完成一轮”循环，不按天）
 * - 数据按 child 隔离：module_checkin_<uid>
 * - 结构：{ round:N, done:{ [appId]: true } }
 * - 完成一轮（可见模块全部打卡）→ 自动清空 done、round+1（即“设置成未打卡，开始新一轮”）
 * 依赖：window.Portal（getSession / APPS）、window.Accounts（curriculumFor / isToddler）
 * ============================================================ */
(function(){
  function sess(){ return (window.Portal && Portal.getSession) ? Portal.getSession() : null; }
  // 只有“学生且已选娃”才记录打卡；家长/未选娃不记录
  function uid(){
    var s = sess();                       // 门户走 Portal SSO
    if (s && s.child) return s.child;
    if (window.ME) return window.ME;      // 统一打卡中心走 Accounts.gate（全局 ME=child id）
    return null;
  }
  // 当前孩子可见的应用 id（复用门户的可见性规则：role + curriculumFor + toddlerOnly）
  function visibleIds(){
    var s = sess(); if (!s) return [];
    var apps = (window.Portal && Portal.APPS) ? Portal.APPS.slice() : [];
    apps = apps.filter(function(a){ return a.roles && a.roles.indexOf(s.role) >= 0; });
    if (s.role === 'student' && s.child && window.Accounts){
      var allow = window.Accounts.curriculumFor(s.child);   // null = 全部（小学阶段）
      if (allow) apps = apps.filter(function(a){ return allow.indexOf(a.id) >= 0; });
    }
    apps = apps.filter(function(a){
      return !(a.toddlerOnly && !(s.role==='student' && s.child && window.Accounts && window.Accounts.isToddler(s.child)));
    });
    return apps.map(function(a){ return a.id; });
  }
  function key(){ return 'module_checkin_' + uid(); }
  function load(){
    if (!uid()) return { round:1, done:{} };
    var raw = null; try { raw = localStorage.getItem(key()); } catch(e){}
    if (!raw) return { round:1, done:{} };
    try {
      var o = JSON.parse(raw);
      if (!o || typeof o !== 'object') o = {};
      o.round = o.round || 1; o.done = o.done || {};
      return o;
    } catch(e){ return { round:1, done:{} }; }
  }
  function save(o){ try { localStorage.setItem(key(), JSON.stringify(o)); } catch(e){} }

  function isDone(id){ var o = load(); return !!(o.done && o.done[id]); }
  function progress(){
    var ids = visibleIds(), o = load(), done = 0;
    if (o.done) ids.forEach(function(id){ if (o.done[id]) done++; });
    return { done:done, total:ids.length, round:o.round };
  }
  function firstUndone(){
    var ids = visibleIds(), o = load();
    for (var i=0;i<ids.length;i++){ if (!(o.done && o.done[ids[i]])) return ids[i]; }
    return null;
  }
  /* 切换某模块打卡：返回 false(取消) / true(标记) / 'newround'(刚完成一轮) */
  function toggle(id){
    if (!uid()) return false;
    var o = load(), wasDone = !!(o.done && o.done[id]);
    if (wasDone){ delete o.done[id]; save(o); return false; }
    o.done[id] = true;
    var p = progress();
    if (p.total > 0 && p.done >= p.total){
      o.done = {};                 // 全部完成 → 设置成未打卡
      o.round = (o.round || 1) + 1; // 进入新一轮
      save(o); return 'newround';
    }
    save(o); return true;
  }
  function reset(){ var o = load(); o.done = {}; o.round = (o.round||1)+1; save(o); }
  function allDone(){ var p = progress(); return p.total>0 && p.done>=p.total; }

  window.ModuleCheckin = {
    uid:uid, visibleIds:visibleIds, isDone:isDone, progress:progress,
    firstUndone:firstUndone, toggle:toggle, reset:reset, allDone:allDone
  };
})();
