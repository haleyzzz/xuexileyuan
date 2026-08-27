/* util.js —— 全站共享小工具：toast / localStorage 读写 / HTML 转义
 * 由所有页面通过 <script src="util.js"> 引入。
 * 依赖：页面内需有 <div id="toast"> 元素（toast 才会显示）。 */
(function(){
  function toast(msg){
    var t=document.getElementById('toast');
    if(!t) return;
    t.textContent=msg; t.classList.add('show');
    clearTimeout(toast._t);
    toast._t=setTimeout(function(){ t.classList.remove('show'); }, 2000);
  }
  function lsGet(k, def){
    try{ var v=localStorage.getItem(k); return v===null?def:JSON.parse(v); }catch(e){ return def; }
  }
  function lsSet(k, v){
    try{ localStorage.setItem(k, JSON.stringify(v)); return true; }catch(e){ return false; }
  }
  // HTML 转义：防止用户输入（自定义任务名等）注入脚本
  function esc(s){
    return String(s==null?'':s).replace(/[&<>"']/g, function(c){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
    });
  }
  window.Util = { toast:toast, lsGet:lsGet, lsSet:lsSet, esc:esc };
  window.toast = toast;   // 兼容直接调用 toast(...)
})();
