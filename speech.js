/* speech.js —— 共享英文发音（优选英文嗓音，排除中文引擎）
 * 由 英语单词卡片 / 英语每日打卡 / 英语短文学习卡 共用。
 * 依赖：util.js 的 toast()。
 * 各页如需“选音色后试听”，定义 window.__voicePreview() 即可。
 * 暴露：window.Speech{...} 以及兼容全局名 pickVoice / ensureEnVoice /
 *       buildVoiceSelector / enVoices / voiceScore / onVoiceChange。 */
(function(){
  var _voicePref='';
  try{ _voicePref=localStorage.getItem('eng_voice_pref')||''; }catch(e){}
  var _voiceWarned=false;
  var accent='us';   // 'us' | 'uk'，内部维护，页面用 Speech.setAccent 同步

  function setAccent(a){ accent=(a==='uk')?'uk':'us'; }
  function lang(){ return accent==='uk'?'en-GB':'en-US'; }

  // 只保留英文语音（lang 以 en 开头），从根本上排除中文引擎念英文
  function enVoices(){
    if(!window.speechSynthesis) return [];
    return (speechSynthesis.getVoices()||[]).filter(function(v){ return v.lang && /^en[-_]/i.test(v.lang); });
  }
  // 给英文语音打分：优先匹配口音 + 高质量音色（Google / 神经网络 / Apple 优质音）
  // 2026-08-25 升级：老旧机械音（Microsoft David/Zira Desktop 等）大幅降权，
  // 任何 Google/Natural/优质 Apple 音都排在前面，确保全站「最标准英语发音」。
  function voiceScore(v){
    var s=0, n=(v.name||'').toLowerCase();
    var l=(v.lang||'').toLowerCase().replace('_','-');
    var want= accent==='uk' ? 'en-gb' : 'en-us';
    if(l===want) s+=40;
    else if((accent==='uk'? l.indexOf('en-gb') : l.indexOf('en-us'))===0) s+=30;
    else s+=15;
    /* 顶级音色（发音最标准） */
    if(/google/.test(n)) s+=34;                                  // Google US/UK English（Chrome/安卓）
    if(/natural|neural/.test(n)) s+=32;                          // Microsoft/Apple 神经网络音色
    if(/online/.test(n)) s+=6;                                   // 在线版音色通常优于本地
    if(/samantha|daniel|karen|moira|serena|tessa|fiona|aaron|arthur|ava|allison|nicky|susan/.test(n)) s+=24;  // Apple 优质音
    if(/enhanced|premium/.test(n)) s+=15;
    if(/microsoft/.test(n)) s+=8;
    if(v.localService===false) s+=5;
    /* 老旧机械音降权（David/Zira/Hazel 等读单词生硬、元音不准） */
    if(/desktop/.test(n)) s-=25;
    if(/david|zira|hazel|george|heather|linda|mary\b|sam\b/.test(n) && !/natural|neural/.test(n)) s-=20;
    if(/espeak|festival|pico/.test(n)) s-=40;
    return s;
  }
  function pickVoice(){
    var list=enVoices();
    if(!list.length) return null;
    if(_voicePref){ var c=list.find(function(v){return (v.voiceURI||v.name)===_voicePref;}); if(c) return c; }
    return list.slice().sort(function(a,b){return voiceScore(b)-voiceScore(a);})[0];
  }
  // 提示：未检测到英文语音包时，iOS 仍可借 lang='en-US' 用系统默认英文发声，
  // 因此这里【只提示、不中止】，避免"点了没声音"。仅首次提示一次。
  function ensureEnVoice(){
    if(enVoices().length===0 && !_voiceWarned){
      _voiceWarned=true;
      if(window.toast) window.toast('未检测到英文语音包，将使用系统默认英文发音；若仍听不到，请在 iPad「设置-辅助功能-语音内容-嗓音」中下载英语嗓音');
    }
    return true;
  }
  // 动态生成“音色选择”下拉：优先挂到 #voiceHost，否则挂到口音按钮旁
  function buildVoiceSelector(){
    var list=enVoices();
    if(!list.length) return;
    var host=document.getElementById('voiceHost');
    if(!host){
      var b=document.getElementById('accentBtn');
      host=(b&&b.parentNode) ? b.parentNode : (document.querySelector('header')||document.body);
    }
    var sel=document.getElementById('voiceSel');
    if(!sel){
      sel=document.createElement('select');
      sel.id='voiceSel'; sel.title='选择发音音色';
      sel.style.cssText='max-width:160px;margin-left:8px;padding:6px 8px;border-radius:10px;border:1px solid #ddd;font-size:13px;vertical-align:middle';
      sel.addEventListener('change', onVoiceChange);
      host.appendChild(sel);
    }
    if(sel._n===list.length) return; sel._n=list.length;
    sel.innerHTML='<option value="">🔊 自动选最佳</option>'+list.map(function(v){
      var label=(v.name||'').replace(/[<>]/g,'')+' ('+v.lang+')';
      return '<option value="'+(v.voiceURI||v.name)+'">'+label+'</option>';
    }).join('');
    sel.value=_voicePref||'';
  }
  function onVoiceChange(){
    var sel=document.getElementById('voiceSel'); if(!sel) return;
    _voicePref=sel.value||'';
    try{ localStorage.setItem('eng_voice_pref', _voicePref); }catch(e){}
    if(window.__voicePreview) window.__voicePreview();
  }
  function loadVoices(){ if(window.speechSynthesis){ speechSynthesis.getVoices(); buildVoiceSelector(); } }
  // 通用朗读（各页可调用 Speech.speak(text, rate)）
  var _pendingTimer=null;   // 上一次朗读的"未发声检测"定时器
  var _speakTimer=null;     // cancel→speak 延迟定时器
  var _noSoundWarned=false; // 每页只提示一次"听不到声音"排查建议
  var _vtries=0;            // iOS 首屏 getVoices 异步为空的重试计数
  function speak(text, rate){
    if(!window.speechSynthesis){ if(window.toast) window.toast('当前浏览器不支持发音'); return; }
    ensureEnVoice();   // 仅提示，不中止：iOS 即使 getVoices 未列出 en 嗓音，设 lang 仍可用系统英文发声
    // iOS 首屏 getVoices 常异步为空 → 触发加载后最多重试 2 次；仍无则交由系统默认英文发音
    if(enVoices().length===0 && speechSynthesis.getVoices().length===0){
      if(_vtries < 2){ _vtries++; try{ speechSynthesis.getVoices(); }catch(e){} setTimeout(function(){ speak(text, rate); }, 280); return; }
    }
    try{ speechSynthesis.cancel(); }catch(e){}
    if(_pendingTimer){ clearTimeout(_pendingTimer); _pendingTimer=null; }
    if(_speakTimer){ clearTimeout(_speakTimer); _speakTimer=null; }
    var u=new SpeechSynthesisUtterance(text);
    u.lang=lang(); u.rate=rate||0.9; u.pitch=1;
    var v=pickVoice(); if(v) u.voice=v;
    window.__ttsUtt=u;                       // 保留全局引用，防止 iOS 下被 GC 回收导致静音
    try{ speechSynthesis.resume(); }catch(e){} // iOS 切后台/静音后需 resume() 才能继续播
    // 声音异常反馈：3 秒内未开始发声 → 提示检查设备静音键/音量（每页只提示一次）
    var started=false;
    u.onstart=function(){ started=true; };
    u.onerror=function(){
      if(_pendingTimer){ clearTimeout(_pendingTimer); _pendingTimer=null; }
      if(!_noSoundWarned && window.toast){
        _noSoundWarned=true;
        window.toast('朗读没成功：请检查设备音量 / iPad 侧边静音键是否关闭');
      }
    };
    _pendingTimer=setTimeout(function(){
      _pendingTimer=null;
      if(!started && !speechSynthesis.speaking && !_noSoundWarned && window.toast){
        _noSoundWarned=true;
        window.toast('点了没声音？请检查：① 设备音量 ② iPad 侧边静音键 ③ 系统设置里的语音朗读');
      }
    },3000);
    // iOS 已知竞态：cancel() 后立即 speak() 会被吞掉，延迟一拍再播
    _speakTimer=setTimeout(function(){
      _speakTimer=null;
      try{ speechSynthesis.speak(u); }catch(e){}
    },60);
  }
  // 自动初始化：异步嗓音到达后重建下拉
  if(window.speechSynthesis){
    speechSynthesis.onvoiceschanged=loadVoices;
    loadVoices();
    setTimeout(buildVoiceSelector, 300);
  }
  // 暴露 API
  window.Speech={
    setAccent:setAccent, lang:lang, enVoices:enVoices, voiceScore:voiceScore,
    pickVoice:pickVoice, ensureEnVoice:ensureEnVoice, buildVoiceSelector:buildVoiceSelector,
    onVoiceChange:onVoiceChange, loadVoices:loadVoices, speak:speak
  };
  // 兼容全局名（供现有页面无需改名即可调用）
  window.pickVoice=pickVoice;
  window.ensureEnVoice=ensureEnVoice;
  window.buildVoiceSelector=buildVoiceSelector;
  window.enVoices=enVoices;
  window.voiceScore=voiceScore;
  window.onVoiceChange=onVoiceChange;

  // 全局包装 speechSynthesis.speak：iOS 上若 utterance 没有全局引用会被垃圾回收，
  // 导致“点了不出声”；朗读前 resume() 可解决切后台/静音后停播。
  // 一次修好本页所有发音调用（含局部 speakOne/speakWord/rPlayPage 等）。
  // 关键增强：英文文本强制指派最佳英文嗓音（即使调用方只设了 lang 没设 voice），
  // 从根本上杜绝中文引擎把英文念成中文腔。
  if(window.speechSynthesis){
    (function(){
      if(window.__ttsPatched) return; window.__ttsPatched=true;
      var _sp=window.speechSynthesis.speak.bind(window.speechSynthesis);
      window.speechSynthesis.speak=function(u){
        try{ window.speechSynthesis.resume(); }catch(e){}
        try{
          if(u && typeof u.lang==='string' && /^en[-_]/i.test(u.lang)){
            var ev=enVoices();
            if(ev.length){ var v=pickVoice(); if(v) u.voice=v; }
          }
        }catch(e){}
        window.__ttsUtt=u;
        return _sp(u);
      };
    })();
  }
})();
