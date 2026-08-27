// 跨页面改动追踪器：记录同步键的最后写时间戳，供 sync.js 做字段级合并（自动静默同步）
// 仅在已连接（localStorage 存在 gist_id）时启用，避免无谓开销。
(function(){
  'use strict';
  // 语数科每日打卡现按孩子隔离（chineseCheckIn_<uid>_v1 等）；英语每日打卡走 engci 隔离键，由 daily_eng_history_v1 兼容同步
  function syncUserCheckinKeys(){
    var users = (window.Accounts && Accounts.USERS) ? Accounts.USERS.map(function(u){return u.id;}) : ['zachary','zoran'];
    var out=[];
    users.forEach(function(u){
      out.push('chineseCheckIn_'+u+'_v1');
      out.push('mathCheckIn_'+u+'_v1');
      out.push('scienceCheckIn_'+u+'_v1');
    });
    return out;
  }
  var SYNC_KEYS = syncUserCheckinKeys().concat([
    'rise3to4_checkin_v1',
    'skip_rope_checkin_v1','rope_trend_best_v1','parent_checklist_v1','parent_reminder_v1',
    'parent_custom_tasks_v1','parent_custom_progress_v1','rope_badge_sound_v1','rope_mute_v1',
    'wordcard_mastered_v1','daily_eng_checkin_v1','daily_eng_history_v1'
  ]);
  var TS_KEY = 'gist_ts_v1';
  if(!window.localStorage){ return; }
  var proto = Object.getPrototypeOf(window.localStorage) || Storage.prototype;
  var orig = proto.setItem;
  // 启动即判断：若之前已连接，则启用追踪（跨页面持久）
  var enabled = !!window.localStorage.getItem('gist_id');

  function mark(k){
    if(!enabled) return;
    if(SYNC_KEYS.indexOf(k) < 0) return;
    var ts;
    try { ts = JSON.parse(window.localStorage.getItem(TS_KEY) || '{}') || {}; } catch(e){ ts = {}; }
    ts[k] = Date.now();
    try { orig.call(window.localStorage, TS_KEY, JSON.stringify(ts)); } catch(e){}
  }

  proto.setItem = function(k, v){
    var r = orig.apply(this, arguments);
    try { mark(k); } catch(e){}
    return r;
  };

  window.__syncTracker = {
    enable: function(){ enabled = true; },
    disable: function(){ enabled = false; },
    enabled: function(){ return enabled; },
    SYNC_KEYS: SYNC_KEYS,
    TS_KEY: TS_KEY
  };
})();
