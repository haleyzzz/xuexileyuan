// 云同步模块：GitHub 私有 Gist（纯前端，无后端）
// 数据只存于用户自己的私有 Gist，token 仅存本机 localStorage。
// 自动静默同步：打开页面自动拉取合并；本页或子页有改动且离开/隐藏时自动上传合并（字段级 last-write-win，避免互覆盖）。
(function(){
  'use strict';
  // 同步范围：除 sync 控制键外的【所有】localStorage 用户数据键（自动覆盖全部模块，免逐个登记）
  var CONTROL_KEYS = { 'gist_token':1,'gist_id':1,'gist_ts_v1':1,'gist_last':1,'gist_last_push':1 };
  function userKeys(){
    var out=[];
    for(var i=0;i<localStorage.length;i++){
      var k=localStorage.key(i);
      if(!k) continue;
      if(CONTROL_KEYS[k]) continue;
      if(k.indexOf('gist_')===0) continue;
      out.push(k);
    }
    return out;
  }
  var GIST_FILE = 'summer-checkin-sync.json';
  var API = 'https://api.github.com';

  function $(id){ return document.getElementById(id); }
  function get(k){ try{ return localStorage.getItem(k); }catch(e){ return null; } }
  function set(k,v){ try{ localStorage.setItem(k,v); }catch(e){} }
  function del(k){ try{ localStorage.removeItem(k); }catch(e){} }

  function getTsMap(){
    try { return JSON.parse(get('gist_ts_v1') || '{}') || {}; } catch(e){ return {}; }
  }
  function maxTs(){
    var m = getTsMap(), mx = 0;
    for(var k in m){ if(Object.prototype.hasOwnProperty.call(m,k) && Number(m[k]) > mx) mx = Number(m[k]); }
    return mx;
  }

  function collect(){
    var data = {};
    var keys = userKeys();
    for(var i=0;i<keys.length;i++){
      var v = get(keys[i]);
      if(v!==null) data[keys[i]] = v;
    }
    return data;
  }
  // 字段级合并写入本地：仅当云端该 key 的 ts 不早于本地 ts 时才覆盖（last-write-win）
  function mergeIntoLocal(payload){
    if(!payload || !payload.data) return 0;
    // 类型/长度校验：拒绝损坏/超大载荷落盘（云端为用户私有 Gist，已排除控制键）
    var cloudTs = payload.ts || {};
    var localTs = getTsMap();
    var n = 0;
    for(var k in payload.data){
      if(!Object.prototype.hasOwnProperty.call(payload.data,k)) continue;
      var v = payload.data[k];
      if(typeof v!=='string') continue;     // 本地值均为字符串，类型不符丢弃
      if(v.length > 2000000) continue;      // 超长载荷丢弃（防存储放大/恶意填充）
      var c = Number(cloudTs[k]||0), l = Number(localTs[k]||0);
      if(c >= l){
        set(k, v);
        localTs[k] = c || Date.now();
        n++;
      }
    }
    try { set('gist_ts_v1', JSON.stringify(localTs)); } catch(e){}
    return n;
  }
  function headers(token){
    return {
      'Authorization':'Bearer '+token,
      'Accept':'application/vnd.github+json',
      'Content-Type':'application/json'
    };
  }
  function status(msg, isErr){
    var el = $('syncStatus');
    if(!el) return;
    el.textContent = msg;
    el.style.color = isErr ? '#e03131' : '#2f9e44';
  }
  function apiFail(e){
    if(e && e.status){
      if(e.status===401) return 'Token 无效或权限不足，请确认 Token 正确且含 gist 权限';
      if(e.status===403) return 'GitHub API 限流（每小时约60次），请稍后再试';
      if(e.status===404) return 'Gist 不存在或无权访问';
      return '同步失败（HTTP '+e.status+'）';
    }
    return '网络异常，无法连接 GitHub（国内可能不稳定，请检查网络或稍后重试）';
  }
  function makeFiles(contentStr){ var f = {}; f[GIST_FILE] = { content: contentStr }; return f; }
  function buildPayload(){
    return { _meta:{app:'summer-checkin',v:1,updatedAt:Date.now()}, data:collect(), ts:getTsMap() };
  }

  // 上传合并：拉取云端 → 字段级合并 → 写回，仅本地更新的字段会覆盖云端，云端更新的字段保留
  function pushMerged(showStatus){
    var token = get('gist_token'), gid = get('gist_id');
    if(!token || !gid) return Promise.reject('no-sync');
    if(showStatus) status('正在同步到云端…');
    return fetch(API+'/gists/'+gid, { headers:headers(token) })
      .then(function(r){ if(!r.ok) throw r; return r.json(); })
      .then(function(j){
        var cloud = { data:{}, ts:{} };
        var f = j.files && j.files[GIST_FILE];
        if(f && f.content){ try { var p = JSON.parse(f.content); cloud.data = p.data||{}; cloud.ts = p.ts||{}; } catch(e){} }
        var localData = collect(), localTs = getTsMap();
        var merged = {}, mergedTs = {}, keys = {};
        var k;
        for(k in localData){ keys[k]=1; }
        for(k in cloud.data){ keys[k]=1; }
        for(k in keys){
          var l = Number(localTs[k]||0), c = Number(cloud.ts[k]||0);
          if(localData.hasOwnProperty(k) && (!cloud.data.hasOwnProperty(k) || l >= c)){
            merged[k] = localData[k]; mergedTs[k] = l || Date.now();
          } else {
            merged[k] = cloud.data[k]; mergedTs[k] = c || Date.now();
          }
        }
        var body = JSON.stringify({ _meta:{app:'summer-checkin',v:1,updatedAt:Date.now()}, data:merged, ts:mergedTs });
        return fetch(API+'/gists/'+gid, {
          method:'PATCH', headers:headers(token),
          body: JSON.stringify({ files: makeFiles(body) })
        }).then(function(r){ if(!r.ok) throw r; return merged; });
      })
      .then(function(){
        set('gist_last', Date.now()); set('gist_last_push', Date.now());
        if(showStatus) status('已同步（'+Object.keys(collect()).length+' 项）');
      })
      .catch(function(e){ if(showStatus) status(apiFail(e), true); throw e; });
  }

  // 下载合并：字段级合并写入本地，不覆盖本地较新的字段
  function pullMerged(showStatus){
    var token = get('gist_token'), gid = get('gist_id');
    if(!token || !gid) return Promise.reject('no-sync');
    if(showStatus) status('正在从云端同步…');
    return fetch(API+'/gists/'+gid, { headers:headers(token) })
      .then(function(r){ if(!r.ok) throw r; return r.json(); })
      .then(function(j){
        var f = j.files && j.files[GIST_FILE];
        if(!f || !f.content) throw new Error('empty');
        var payload = JSON.parse(f.content);
        var n = mergeIntoLocal(payload);
        set('gist_last', Date.now());
        if(showStatus) status('已同步（'+n+' 项更新）');
        return n;
      })
      .catch(function(e){
        if(showStatus) status(e && e.message==='empty' ? '云端暂无数据' : apiFail(e), true);
        throw e;
      });
  }

  function pushData(){ pushMerged(true); }
  function pullData(){ pullMerged(true); }

  function initSync(){
    var token = ($('syncToken').value||'').trim();
    if(!token){ status('请粘贴 GitHub Token', true); return; }
    var gidInput = ($('syncGistId').value||'').trim();
    var payload = buildPayload();
    if(gidInput){
      // 连接已有 Gist（多设备共享同一份数据）
      status('正在连接已有 Gist…');
      fetch(API+'/gists/'+gidInput, { headers:headers(token) })
        .then(function(r){ if(!r.ok) throw r; return r.json(); })
        .then(function(j){
          set('gist_token', token); set('gist_id', j.id); set('gist_last', Date.now()); set('gist_last_push', Date.now());
          if(window.__syncTracker) window.__syncTracker.enable();
          render();
          pullMerged(false).then(function(){}, function(){});
          status('已连接已有 Gist（已拉取云端数据）');
        })
        .catch(function(e){ status(apiFail(e), true); });
      return;
    }
    // 新建私有 Gist
    status('正在创建私有 Gist…');
    fetch(API+'/gists', {
      method:'POST', headers:headers(token),
      body: JSON.stringify({ public:false, files: makeFiles(JSON.stringify(payload)) })
    })
      .then(function(r){ if(!r.ok) throw r; return r.json(); })
      .then(function(j){
        set('gist_token', token); set('gist_id', j.id); set('gist_last', Date.now()); set('gist_last_push', Date.now());
        if(window.__syncTracker) window.__syncTracker.enable();
        render();
        status('已连接（'+Object.keys(payload.data).length+' 项已存云端）');
      })
      .catch(function(e){ status(apiFail(e), true); });
  }

  function disconnect(){
    del('gist_token'); del('gist_id'); del('gist_last'); del('gist_last_push');
    if(window.__syncTracker) window.__syncTracker.disable();
    status('已断开（本机数据保留）');
    render();
  }

  // 打开页面自动静默拉取合并
  function autoSyncOnLoad(){
    if(!get('gist_id')) return;
    if(window.__syncTracker && !window.__syncTracker.enabled()) window.__syncTracker.enable();
    pullMerged(false).then(function(){
      if($('syncStatus') && !$('syncStatus').textContent) render();
    }, function(){});
  }
  // 离开/切后台时，若本机有未同步改动则自动上传合并
  function autoSyncOnLeave(){
    if(!get('gist_id')) return;
    var lastPush = Number(get('gist_last_push')||0);
    if(maxTs() > lastPush){
      pushMerged(false).then(function(){}, function(){});
    }
  }

  function render(){
    var has = !!get('gist_id');
    if($('syncForm')) $('syncForm').style.display = has ? 'none' : 'block';
    if($('syncReady')) $('syncReady').style.display = has ? 'block' : 'none';
    if(has && $('syncGid')) $('syncGid').textContent = get('gist_id') || '';
    if(has && !$('syncStatus').textContent){
      status(get('gist_last') ? ('上次同步：'+new Date(Number(get('gist_last'))).toLocaleString()) : '已连接');
    }
  }

  function copyGid(){
    var gid = get('gist_id'); if(!gid) return;
    var btn = $('syncCopy');
    function flash(){ if(btn){ btn.textContent='已复制✓'; setTimeout(function(){ btn.textContent='复制'; }, 1500); } }
    function fallback(){
      try{
        var ta=document.createElement('textarea'); ta.value=gid; ta.style.position='fixed'; ta.style.opacity='0';
        document.body.appendChild(ta); ta.focus(); ta.select();
        var ok = document.execCommand('copy'); document.body.removeChild(ta);
        if(ok) flash(); else status('复制失败，请手动长按选择 ID', true);
      }catch(e){ status('复制失败，请手动长按选择 ID', true); }
    }
    if(navigator.clipboard && navigator.clipboard.writeText){
      navigator.clipboard.writeText(gid).then(flash, fallback);
    } else { fallback(); }
  }

  function bind(){
    if(window.__syncBound) return; window.__syncBound = true;
    if($('syncInit')) $('syncInit').addEventListener('click', initSync);
    if($('syncPush')) $('syncPush').addEventListener('click', pushData);
    if($('syncPull')) $('syncPull').addEventListener('click', pullData);
    if($('syncDisconnect')) $('syncDisconnect').addEventListener('click', disconnect);
    if($('syncCopy')) $('syncCopy').addEventListener('click', copyGid);
    render();
    autoSyncOnLoad();
    window.addEventListener('beforeunload', autoSyncOnLeave);
    document.addEventListener('visibilitychange', function(){ if(document.visibilityState==='hidden') autoSyncOnLeave(); });
    // 周期兜底：每 60s 若有未同步改动则自动上传（避免离开未触发）
    setInterval(function(){ autoSyncOnLeave(); }, 60000);
  }

  if(document.readyState!=='loading') bind();
  else document.addEventListener('DOMContentLoaded', bind);
})();
