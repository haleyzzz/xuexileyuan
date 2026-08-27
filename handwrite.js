/* handwrite.js — 可复用手写输入组件
 * 用法：var hw = Handwrite.create({revealText:'...', placeholder:'...', height:120});
 *       container.appendChild(hw.el);   // 或某元素 appendChild(hw.el)
 * 返回的 hw 提供：isEmpty() / clear() / toDataURL() / reveal() / fit()
 * 特点：支持 Apple Pencil / 手指 / 鼠标；平滑笔迹(贝塞尔)；高 DPR 清晰；
 *       touch-action:none 防止 iPad 上书写时页面滚动；撤销/清除/对照答案。
 */
(function () {
  'use strict';
  if (window.Handwrite) return;

  var CSS = ''
    + '.hw-wrap{margin:10px 0;user-select:none;-webkit-user-select:none;}'
    + '.hw-label{font-size:13px;font-weight:800;color:#3a7bd5;margin:6px 0 4px;display:flex;align-items:center;gap:6px;}'
    + '.hw-stage{position:relative;background:#fff;border:2px dashed #b9d4f5;border-radius:14px;overflow:hidden;touch-action:none;-webkit-user-select:none;}'
    + '.hw-canvas{display:block;width:100%;height:120px;touch-action:none;-webkit-user-select:none;cursor:crosshair;background:#fff;}'
    + '.hw-ph{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:#b7c4d6;font-size:14px;pointer-events:none;padding:0 10px;text-align:center;}'
    + '.hw-tools{display:flex;gap:8px;margin-top:6px;align-items:center;flex-wrap:wrap;}'
    + '.hw-btn{border:2px solid #d8e2f0;background:#f4f9ff;color:#3a6ea5;border-radius:12px;padding:6px 12px;font-size:13px;font-weight:800;cursor:pointer;font-family:inherit;}'
    + '.hw-btn:active{transform:scale(.97);}'
    + '.hw-reveal{margin-top:8px;font-size:14px;font-weight:800;color:#1f8a4c;background:#eafaf0;border-radius:12px;padding:8px 12px;display:none;line-height:1.6;}'
    + '.hw-reveal.on{display:block;}'
    + '.hw-reveal b{color:#0a7d3c;font-size:16px;}';

  function injectCSS() {
    if (document.getElementById('hw-style')) return;
    var s = document.createElement('style');
    s.id = 'hw-style';
    s.textContent = CSS;
    document.head.appendChild(s);
  }
  injectCSS();

  function create(opts) {
    opts = opts || {};
    var placeholder = opts.placeholder || '✍️ 在这里用手写答案';
    var revealText = (opts.revealText === undefined ? '' : opts.revealText);
    var showRevealBtn = (opts.showRevealBtn === undefined) ? (revealText !== '') : !!opts.showRevealBtn;
    var width = opts.width || 0;      // 0 = 响应式占满
    var height = opts.height || 120;
    var onChange = opts.onChange || function () {};
    var onReveal = opts.onReveal || function () {};

    var wrap = document.createElement('div');
    wrap.className = 'hw-wrap';

    var label = document.createElement('div');
    label.className = 'hw-label';
    label.textContent = '✍️ 手写区（可用 Apple Pencil / 手指）';

    var stage = document.createElement('div');
    stage.className = 'hw-stage';
    if (width) stage.style.width = width + 'px';

    var canvas = document.createElement('canvas');
    canvas.className = 'hw-canvas';
    canvas.style.height = height + 'px';

    var ph = document.createElement('div');
    ph.className = 'hw-ph';
    ph.textContent = placeholder;

    stage.appendChild(canvas);
    stage.appendChild(ph);

    var tools = document.createElement('div');
    tools.className = 'hw-tools';
    var undoBtn = document.createElement('button');
    undoBtn.type = 'button'; undoBtn.className = 'hw-btn'; undoBtn.textContent = '↶ 撤销';
    var clearBtn = document.createElement('button');
    clearBtn.type = 'button'; clearBtn.className = 'hw-btn'; clearBtn.textContent = '🗑 清除';
    tools.appendChild(undoBtn);
    tools.appendChild(clearBtn);

    var revealBtn = null;
    if (showRevealBtn) {
      revealBtn = document.createElement('button');
      revealBtn.type = 'button'; revealBtn.className = 'hw-btn';
      revealBtn.textContent = '🔍 对照答案';
      tools.appendChild(revealBtn);
    }

    var revealBox = document.createElement('div');
    revealBox.className = 'hw-reveal';
    if (revealText) {
      revealBox.innerHTML = '正确答案：<b>' + revealText + '</b>';
    }

    wrap.appendChild(label);
    wrap.appendChild(stage);
    wrap.appendChild(tools);
    wrap.appendChild(revealBox);

    var dpr = window.devicePixelRatio || 1;
    var strokes = [];
    var cur = null;
    var ctx = canvas.getContext('2d');

    function fit() {
      var rect = stage.getBoundingClientRect();
      var w = rect.width || (width || 240);
      var h = height;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      redraw();
    }

    function getPos(e) {
      var r = canvas.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    }

    function strokeWidth(p) {
      var pr = (typeof p === 'number' && p > 0) ? p : 0.5;
      return 3.4 + pr * 2.8;
    }

    function drawStroke(s) {
      if (!s || !s.length) return;
      ctx.strokeStyle = '#15324d';
      ctx.fillStyle = '#15324d';
      if (s.length === 1) {
        ctx.beginPath();
        ctx.arc(s[0].x, s[0].y, strokeWidth(s[0].p) / 2, 0, Math.PI * 2);
        ctx.fill();
        return;
      }
      ctx.lineWidth = strokeWidth(s[0].p);
      ctx.beginPath();
      ctx.moveTo(s[0].x, s[0].y);
      for (var i = 1; i < s.length; i++) {
        var mx = (s[i - 1].x + s[i].x) / 2;
        var my = (s[i - 1].y + s[i].y) / 2;
        ctx.quadraticCurveTo(s[i - 1].x, s[i - 1].y, mx, my);
      }
      ctx.stroke();
    }

    function redraw() {
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.restore();
      for (var i = 0; i < strokes.length; i++) drawStroke(strokes[i]);
      if (cur) drawStroke(cur);
    }

    function down(e) {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      e.preventDefault();
      try { canvas.setPointerCapture(e.pointerId); } catch (_) {}
      cur = [];
      var p = getPos(e);
      cur.push({ x: p.x, y: p.y, p: e.pressure });
      ph.style.display = 'none';
    }

    function move(e) {
      if (!cur) return;
      e.preventDefault();
      var evs = (e.getCoalescedEvents && e.getCoalescedEvents().length)
        ? e.getCoalescedEvents() : [e];
      for (var i = 0; i < evs.length; i++) {
        var p = getPos(evs[i]);
        cur.push({ x: p.x, y: p.y, p: evs[i].pressure });
      }
      drawStroke(cur);
      onChange();
    }

    function up(e) {
      if (!cur) return;
      e.preventDefault();
      if (cur.length) strokes.push(cur);
      cur = null;
      onChange();
    }

    canvas.addEventListener('pointerdown', down);
    canvas.addEventListener('pointermove', move);
    canvas.addEventListener('pointerup', up);
    canvas.addEventListener('pointercancel', up);
    canvas.addEventListener('pointerleave', up);

    undoBtn.addEventListener('click', function () {
      strokes.pop(); redraw(); onChange();
    });
    clearBtn.addEventListener('click', function () {
      strokes = []; cur = null; redraw(); ph.style.display = 'flex'; onChange();
    });
    if (revealBtn) {
      revealBtn.addEventListener('click', function () {
        revealBox.classList.add('on');
        onReveal();
      });
    }

    requestAnimationFrame(fit);
    window.addEventListener('resize', fit);

    var api = {
      el: wrap,
      canvas: canvas,
      isEmpty: function () { return strokes.length === 0 && !cur; },
      clear: function () { strokes = []; cur = null; redraw(); ph.style.display = 'flex'; },
      toDataURL: function () { return canvas.toDataURL('image/png'); },
      reveal: function () { revealBox.classList.add('on'); },
      fit: fit
    };
    wrap._hw = api;
    return api;
  }

  window.Handwrite = { create: create };
})();
