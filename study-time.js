// study-time.js —— 轻量「有效学习时长」计时器
// 累计到 Accounts，按「孩子 uid × 模块 key」隔离；只在页面可见时计时。
(function(){
  // 与 rewards.js TIME_MODS、进度看板 _tl 保持一致：覆盖所有 StudyTime.track 实际使用的模块
  var KEYS = ['word','spell','dictation','story','reader','engci','phonics','pep','grammar','wordtrain-read'];
  var _uid=null, _mod=null, _start=0, _timer=null, _flushTimer=null;
  function now(){ return Date.now(); }
  function active(){ return (typeof document!=='undefined' && document.visibilityState==='visible'); }
  function flush(){
    if(!_uid || !_mod) return;
    var el = Math.floor((now()-_start)/1000);
    if(el>0){
      try{
        var prev = Number(Accounts.get('time', _uid, _mod, 0))||0;
        Accounts.set('time', _uid, _mod, prev+el);
      }catch(e){}
      _start = now();
    }
  }
  function tick(){
    if(!active()){ _start = now(); }   // 页面隐藏时不计，回到前台重置起点
  }
  window.StudyTime = {
    // 开始为一个孩子的一个模块计时（应在登录拿到 ME 后调用）
    track: function(uid, mod){
      if(!uid || !mod) return;
      _uid = uid; _mod = mod;
      if(_timer) clearInterval(_timer);
      if(_flushTimer) clearInterval(_flushTimer);
      _start = now();
      _timer = setInterval(tick, 1000);
      _flushTimer = setInterval(flush, 10000);   // 每 10s 落盘，防意外丢失
      try{ window.addEventListener('pagehide', flush); window.addEventListener('beforeunload', flush); }catch(e){}
      if(typeof document!=='undefined'){
        document.addEventListener('visibilitychange', function(){
          if(document.visibilityState==='hidden') flush(); else _start = now();
        });
      }
    },
    // 汇总某孩子全部模块累计秒数
    total: function(uid){
      var s=0;
      for(var i=0;i<KEYS.length;i++){ try{ s += Number(Accounts.get('time', uid, KEYS[i], 0))||0; }catch(e){} }
      return s;
    },
    // 取某孩子某模块累计秒数
    get: function(uid, mod){ try{ return Number(Accounts.get('time', uid, mod, 0))||0; }catch(e){ return 0; } }
  };
})();
