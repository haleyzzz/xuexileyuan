/*
 * rope-particles.js
 * 通用主题化粒子动画组件 —— 跳绳打卡项目共享的庆祝特效引擎。
 *
 * 设计目标：一套粒子系统，在「勋章弹窗」「趋势图破纪录」等不同场景统一调用，
 * 通过传入 theme / 配置参数控制粒子颜色、光效色调与动画节奏，实现差异化视觉风格。
 *
 * 统一调用接口：RopeParticles.burst(opts)
 *   opts.count      粒子数量（控制密度/动画节奏）
 *   opts.colors     粒子配色数组（主题色，循环取用）
 *   opts.emojis     混合 emoji 列表（shape 为 emoji/mixed 时使用）
 *   opts.gravity    重力（每帧下落加速度，控制下坠节奏）
 *   opts.spread     初速度大小（控制迸发范围）
 *   opts.upBias     初始向上偏移（让粒子先上冲再回落，更有「炸开」感）
 *   opts.sizeMin/Max 粒子半径范围
 *   opts.duration   动画持续毫秒（控制整体节奏）
 *   opts.originX/Y  爆发中心（屏幕比例 0..1）
 *   opts.shape      'circle' | 'emoji' | 'mixed'
 *   opts.zIndex     canvas 层级
 *   opts.fade       每帧透明度衰减（控制消散节奏）
 * 返回 { stop } 可手动停止。
 */
(function (global) {
  'use strict';

  function burst(opts) {
    opts = opts || {};
    var cfg = {
      count:   opts.count   != null ? opts.count   : 90,
      colors:  opts.colors  || ['#ffd166', '#06d6a0', '#ef476f', '#118ab2', '#f78c6b'],
      emojis:  opts.emojis  || null,
      gravity: opts.gravity != null ? opts.gravity : 0.07,
      spread:  opts.spread  != null ? opts.spread  : 7,
      upBias:  opts.upBias  != null ? opts.upBias  : -2.5,
      sizeMin: opts.sizeMin != null ? opts.sizeMin : 2,
      sizeMax: opts.sizeMax != null ? opts.sizeMax : 6,
      duration:opts.duration!= null ? opts.duration: 3600,
      originX: opts.originX!= null ? opts.originX : 0.5,
      originY: opts.originY!= null ? opts.originY : 0.34,
      shape:   opts.shape   || 'circle',
      zIndex:  opts.zIndex  != null ? opts.zIndex  : 80,
      fade:    opts.fade    != null ? opts.fade    : 0.011
    };

    var cv = document.createElement('canvas');
    cv.style.cssText = 'position:fixed;left:0;top:0;width:100%;height:100%;pointer-events:none;z-index:' + cfg.zIndex + ';';
    document.body.appendChild(cv);

    var dpr = global.devicePixelRatio || 1;
    var W = global.innerWidth, H = global.innerHeight;
    cv.width = W * dpr; cv.height = H * dpr;
    cv.style.width = W + 'px'; cv.style.height = H + 'px';
    var ctx = cv.getContext('2d');
    ctx.scale(dpr, dpr);

    var cx = W * cfg.originX, cy = H * cfg.originY;
    var EMO = cfg.emojis || ['🪢', '⭐', '🎉', '💪', '🏆', '🔥'];
    var ps = [];
    for (var i = 0; i < cfg.count; i++) {
      var a = Math.random() * Math.PI * 2;
      var sp = cfg.spread * (0.4 + Math.random() * 0.8);
      var isEmoji = cfg.shape === 'emoji' || (cfg.shape === 'mixed' && i % 3 === 0);
      ps.push({
        x: cx, y: cy,
        vx: Math.cos(a) * sp,
        vy: Math.sin(a) * sp + cfg.upBias,
        life: 1,
        r: cfg.sizeMin + Math.random() * (cfg.sizeMax - cfg.sizeMin),
        c: cfg.colors[i % cfg.colors.length],
        emoji: isEmoji ? EMO[i % EMO.length] : null,
        rot: Math.random() * Math.PI * 2,
        vr: (Math.random() - 0.5) * 0.3
      });
    }

    var t0 = Date.now();
    (function frame() {
      var el = Date.now() - t0;
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < ps.length; i++) {
        var p = ps[i];
        p.x += p.vx; p.y += p.vy; p.vy += cfg.gravity; p.rot += p.vr; p.life -= cfg.fade;
        if (p.life <= 0) continue;
        ctx.globalAlpha = Math.max(p.life, 0);
        if (p.emoji) {
          ctx.font = (p.r * 3.2) + 'px sans-serif';
          ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
          ctx.fillText(p.emoji, 0, 0); ctx.restore();
        } else {
          ctx.fillStyle = p.c;
          ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
          // 浅色粒子（马卡龙色等）在白底上对比弱，加一圈极淡描边提升可见度（线宽随粒子大小自适应）
          ctx.lineWidth = Math.max(0.6, p.r * 0.35);
          ctx.strokeStyle = 'rgba(45,45,65,0.30)';
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;
      if (el < cfg.duration) requestAnimationFrame(frame);
      else { ctx.clearRect(0, 0, W, H); if (cv.parentNode) cv.parentNode.removeChild(cv); }
    })();

    return {
      stop: function () { if (cv.parentNode) cv.parentNode.removeChild(cv); }
    };
  }

  global.RopeParticles = { burst: burst };
})(window);
