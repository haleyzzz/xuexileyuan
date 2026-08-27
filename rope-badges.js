/*
 * rope-badges.js
 * 主题化里程碑勋章模块 —— 把 30天/50天/100天 等不同等级的勋章做成「参数化主题」，
 * 通过主题色（粒子颜色、光效色调、渐变、光环）、动画节奏（粒子数量/速度/时长）实现差异化视觉。
 *
 * 依赖：RopeParticles（通用粒子组件）、本文件提供的 #badgeOverlay 结构与其 CSS 变量。
 *
 * 调用：RopeBadges.show(day, stats)
 *   day   里程碑天数（30 / 50 / 100 …），对应 THEMES 的键
 *   stats 可选，预留扩展
 *
 * 新增一个里程碑勋章，只需在 THEMES 里加一项主题配置即可，无需改动画逻辑。
 */
(function (global) {
  'use strict';

  // 主题调色板：每个里程碑 = 一套完整视觉主题
  var THEMES = {
    30: {
      key: 'gold', emoji: '💎', title: '30天金牌跳绳侠', sub: '金光闪闪，绳技初成！', stars: 6,
      particleColors: ['#ffd166', '#ffb703', '#ffd700', '#fff3b0', '#f4a261', '#ffffff'],
      emojis: ['💎', '⭐', '🪢', '✨', '🏆'],
      // 光效 / 渐变 / 光环（CSS 变量注入）
      lightA: 'rgba(255,209,102,.28)', lightB: 'rgba(10,12,30,.78)',
      modalBg: 'linear-gradient(160deg,#1f2a4d,#3a1f57 70%,#4a234f)',
      border: 'rgba(255,209,102,.65)', glow: 'rgba(255,209,102,.45)',
      grad1: '#fff3b0', grad2: '#ffb703',
      ring: 'conic-gradient(from 0deg,#ffd166,#ff9f1c,#ff8fab,#4cc9f0,#06d6a0,#ffd166)',
      ray: 'conic-gradient(from 0deg,transparent 0 8deg,rgba(255,209,102,.22) 8deg 12deg,transparent 12deg 30deg)',
      // 动画节奏配置
      pcount: 90, pdur: 3600, pspread: 7, psize: 3, pshape: 'mixed'
    },
    50: {
      key: 'king', emoji: '👑', title: '50天跳绳王者', sub: '紫气东来，登顶绳王！', stars: 10,
      particleColors: ['#b5179e', '#7b2ff7', '#9d4edd', '#e0aaff', '#c77dff', '#ffffff'],
      emojis: ['👑', '💜', '🪢', '✨', '🌟'],
      lightA: 'rgba(157,78,221,.28)', lightB: 'rgba(20,8,40,.80)',
      modalBg: 'linear-gradient(160deg,#241043,#3a1f57 70%,#4a1f6e)',
      border: 'rgba(157,78,221,.70)', glow: 'rgba(157,78,221,.50)',
      grad1: '#e0aaff', grad2: '#7b2ff7',
      ring: 'conic-gradient(from 0deg,#9d4edd,#e0aaff,#7b2ff7,#c77dff,#9d4edd)',
      ray: 'conic-gradient(from 0deg,transparent 0 8deg,rgba(157,78,221,.24) 8deg 12deg,transparent 12deg 30deg)',
      pcount: 120, pdur: 4000, pspread: 8, psize: 3.4, pshape: 'mixed'
    },
    100: {
      key: 'century', emoji: '🏆', title: '100天百日跳绳侠', sub: '百日磨一剑，绳道大成！', stars: 20,
      particleColors: ['#00f5d4', '#00bbf9', '#9b5de5', '#fee440', '#f15bb5', '#ffffff'],
      emojis: ['💎', '🌈', '🪢', '✨', '⭐', '🏆'],
      lightA: 'rgba(0,245,212,.26)', lightB: 'rgba(6,20,40,.80)',
      modalBg: 'linear-gradient(160deg,#06243f,#1f2a6d 70%,#3a1f6e)',
      border: 'rgba(0,245,212,.70)', glow: 'rgba(0,245,212,.50)',
      grad1: '#aef9ff', grad2: '#00bbf9',
      ring: 'conic-gradient(from 0deg,#00f5d4,#00bbf9,#9b5de5,#f15bb5,#fee440,#00f5d4)',
      ray: 'conic-gradient(from 0deg,transparent 0 8deg,rgba(0,245,212,.24) 8deg 12deg,transparent 12deg 30deg)',
      pcount: 160, pdur: 4600, pspread: 9, psize: 3.8, pshape: 'mixed'
    }
  };

  function show(day, stats) {
    var t = THEMES[day];
    if (!t) return;
    var ov = document.getElementById('badgeOverlay');
    if (!ov) return;

    // 注入主题化 CSS 变量，驱动背景/光效/光环/渐变文字的整体换肤
    var set = function (k, v) { ov.style.setProperty(k, v); };
    set('--lightA', t.lightA); set('--lightB', t.lightB);
    set('--modalBg', t.modalBg); set('--border', t.border); set('--glow', t.glow);
    set('--grad1', t.grad1); set('--grad2', t.grad2);
    set('--ring', t.ring); set('--ray', t.ray);

    // 内容填充
    document.getElementById('badgeEmoji').textContent = t.emoji;
    document.getElementById('badgeTitle').textContent = t.title;
    document.getElementById('badgeSub').textContent = t.sub;
    document.getElementById('badgeStars').textContent = '+' + t.stars + '⭐';
    document.getElementById('badgeText').innerHTML =
      '你已<b>连续打卡 ' + day + ' 天</b>！<br>' + t.title + ' 诞生 ' + t.emoji +
      ' 奖励 <b>+' + t.stars + '⭐</b><br>每一跳都闪闪发光 ✨';

    // 光环 / 光线使用主题色
    var ring = ov.querySelector('.ring'); if (ring) ring.style.background = t.ring;
    var ray = ov.querySelector('.ray'); if (ray) ray.style.background = t.ray;

    ov.classList.add('show');

    // 触发与主题匹配的同款粒子动画（节奏由主题配置控制）
    if (global.RopeParticles) {
      global.RopeParticles.burst({
        count: t.pcount, colors: t.particleColors, emojis: t.emojis,
        gravity: 0.07, spread: t.pspread, upBias: -2.5,
        sizeMin: t.psize, sizeMax: t.psize + 4, duration: t.pdur,
        originY: 0.34, shape: t.pshape, zIndex: 85, fade: 0.009
      });
    }

    // 破纪录庆祝音效：仅在该里程碑尚未播放过且未静音时触发，避免重复
    celebrate(day);
  }

  /* ===== 破纪录庆祝音效 + 静音控制 + 防重复触发 ===== */
  var SND_KEY = 'rope_badge_sound_v1';   // 已播放音效的里程碑天数，防止重复触发
  var MUTE_KEY = 'rope_mute_v1';

  function getMuted() { return localStorage.getItem(MUTE_KEY) === '1'; }
  function setMuted(m) { localStorage.setItem(MUTE_KEY, m ? '1' : '0'); }

  var _audio = null;
  function playCelebration() {
    try {
      if (!_audio) { _audio = new Audio('celebrate.wav'); _audio.preload = 'auto'; }
      _audio.currentTime = 0;
      var p = _audio.play();
      if (p && p.catch) p.catch(function () {});
    } catch (e) {}
  }
  function hasPlayed(day) {
    try { var a = JSON.parse(localStorage.getItem(SND_KEY) || '[]'); return a.indexOf(day) >= 0; }
    catch (e) { return false; }
  }
  function markPlayed(day) {
    try { var a = JSON.parse(localStorage.getItem(SND_KEY) || '[]');
      if (a.indexOf(day) < 0) { a.push(day); localStorage.setItem(SND_KEY, JSON.stringify(a)); } }
    catch (e) {}
  }
  // 破纪录庆祝：未静音 + 该里程碑首次触发才播放（杜绝重复触发）
  function celebrate(day) {
    if (getMuted()) return;
    if (hasPlayed(day)) return;
    markPlayed(day);
    playCelebration();
  }
  // 在页面挂载一个音效开关按钮（🔊/🔇），两页面共用、状态写入 localStorage
  function mountMuteToggle() {
    if (document.getElementById('ropeMuteBtn')) return;
    var b = document.createElement('button');
    b.id = 'ropeMuteBtn';
    b.textContent = getMuted() ? '🔇' : '🔊';
    b.title = '打卡音效开关';
    b.setAttribute('aria-label', '打卡音效开关');
    b.style.cssText = 'position:fixed;right:14px;bottom:14px;z-index:96;width:48px;height:48px;' +
      'border-radius:50%;border:none;background:rgba(255,255,255,.92);font-size:22px;' +
      'box-shadow:0 2px 10px rgba(0,0,0,.22);cursor:pointer';
    b.onclick = function () {
      var m = !getMuted(); setMuted(m);
      b.textContent = m ? '🔇' : '🔊';
      if (!m) playCelebration();   // 取消静音时试播一次，确认有声
    };
    document.body.appendChild(b);
  }

  global.RopeBadges = {
    THEMES: THEMES, show: show,
    setMuted: setMuted, getMuted: getMuted, playCelebration: playCelebration,
    hasPlayed: hasPlayed, markPlayed: markPlayed, mountMuteToggle: mountMuteToggle
  };
})(window);
