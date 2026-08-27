/* penpaint.js — 通用笔记画笔组件（面向"画示意图 / 画观察"而非答题）
 * 用法：var pen = PenPaint.create({height:180, placeholder:'...', saveText:'📥 保存笔迹', onSave:function(api){...}});
 *       parent.appendChild(pen.el);
 * 返回的 pen 提供：isEmpty() / clear() / toDataURL() / setColor() / fit() / destroy()
 * 特点：Apple Pencil / 手指 / 鼠标；平滑笔迹(贝塞尔)；高 DPR 清晰；
 *       touch-action:none 防 iPad 书写时页面滚动；换色 / 粗细 / 撤销 / 清除。
 * 注意：组件只负责"画"，保存逻辑由调用方的 onSave 回调决定（不同页面存法不同）。
 */
(function () {
  'use strict';
  if (window.PenPaint) return;

  var COLORS = [
    { n: '黑', v: '#15324d' },
    { n: '红', v: '#e23b3b' },
    { n: '蓝', v: '#2b6fe0' },
    { n: '绿', v: '#1f9d4d' },
    { n: '棕', v: '#8a5a2b' },
    { n: '橙', v: '#e8841a' }
  ];
  var WIDTHS = [5, 9, 15];
  var WNAMES = ['细', '中', '粗'];

  var CSS = ''
    + '.pp-wrap{margin:10px 0;user-select:none;-webkit-user-select:none;}'
    + '.pp-bar{display:flex;gap:6px;align-items:center;flex-wrap:wrap;margin:6px 0;}'
    + '.pp-sw{width:26px;height:26px;border-radius:50%;border:2px solid #fff;box-shadow:0 0 0 1px #cdd6e0;cursor:pointer;padding:0;}'
    + '.pp-sw.on{box-shadow:0 0 0 3px #3a7bd5;}'
    + '.pp-wbtn{width:30px;height:26px;border-radius:8px;border:2px solid #d8e2f0;background:#f4f9ff;cursor:pointer;font-weight:800;color:#3a6ea5;font-size:12px;padding:0;}'
    + '.pp-wbtn.on{background:#3a7bd5;color:#fff;border-color:#3a7bd5;}'
    + '.pp-stage{position:relative;background:#fff;border:2px dashed #9ec7a8;border-radius:14px;overflow:hidden;touch-action:none;-webkit-user-select:none;}'
    + '.pp-canvas{display:block;width:100%;height:180px;touch-action:none;-webkit-user-select:none;cursor:crosshair;background:#fff;}'
    + '.pp-ph{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:#9fb8a6;font-size:14px;pointer-events:none;text-align:center;padding:0 10px;}'
    + '.pp-tools{display:flex;gap:8px;margin-top:8px;align-items:center;flex-wrap:wrap;}'
    + '.pp-btn{border:2px solid #d8e2f0;background:#f4f9ff;color:#3a6ea5;border-radius:12px;padding:6px 12px;font-size:13px;font-weight:800;cursor:pointer;font-family:inherit;}'
    + '.pp-btn:active{transform:scale(.97);}'
    + '.pp-btn.save{background:#eafaf0;color:#1f8a4c;border-color:#bfe9cd;}'
    + '.pp-previews{display:flex;gap:8px;flex-wrap:wrap;margin-top:8px;}'
    + '.pp-pwrap{position:relative;width:84px;height:84px;border-radius:10px;overflow:hidden;border:1px solid #d8e2f0;background:#fff;}'
    + '.pp-pwrap img{width:100%;height:100%;object-fit:contain;}'
    + '.pp-pd{position:absolute;top:2px;right:2px;background:rgba(0,0,0,.55);color:#fff;border:none;border-radius:50%;width:20px;height:20px;font-size:12px;line-height:18px;cursor:pointer;padding:0;}';

  function injectCSS() {
    if (document.getElementById('pp-style')) return;
    var s = document.createElement('style');
    s.id = 'pp-style';
    s.textContent = CSS;
    document.head.appendChild(s);
  }
  injectCSS();

  function create(opts) {
    opts = opts || {};
    var height = opts.height || 180;
    var placeholder = opts.placeholder || '🖌 在这里画示意图 / 观察到的样子';
    var saveText = opts.saveText || '📥 保存笔迹';
    var onSave = (typeof opts.onSave === 'function') ? opts.onSave : null;

    var wrap = document.createElement('div');
    wrap.className = 'pp-wrap';

    var bar = document.createElement('div');
    bar.className = 'pp-bar';
    var colorBtns = [];
    var curColor = COLORS[0].v;
    COLORS.forEach(function (c, ci) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'pp-sw' + (ci === 0 ? ' on' : '');
      b.style.background = c.v; b.title = c.n;
      b.addEventListener('click', function () {
        curColor = c.v;
        colorBtns.forEach(function (x) { x.classList.remove('on'); });
        b.classList.add('on');
      });
      colorBtns.push(b); bar.appendChild(b);
    });

    var wbar = document.createElement('div');
    wbar.className = 'pp-bar';
    var wBtns = [];
    var curW = WIDTHS[1]; // 默认中粗档
    WIDTHS.forEach(function (w, wi) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'pp-wbtn' + (wi === 1 ? ' on' : '');
      b.textContent = WNAMES[wi];
      b.addEventListener('click', function () {
        curW = w;
        wBtns.forEach(function (x) { x.classList.remove('on'); });
        b.classList.add('on');
      });
      wBtns.push(b); wbar.appendChild(b);
    });

    var stage = document.createElement('div');
    stage.className = 'pp-stage';
    var canvas = document.createElement('canvas');
    canvas.className = 'pp-canvas';
    canvas.style.height = height + 'px';
    var ph = document.createElement('div');
    ph.className = 'pp-ph';
    ph.textContent = placeholder;
    stage.appendChild(canvas);
    stage.appendChild(ph);

    var tools = document.createElement('div');
    tools.className = 'pp-tools';
    var undoBtn = document.createElement('button');
    undoBtn.type = 'button'; undoBtn.className = 'pp-btn'; undoBtn.textContent = '↶ 撤销';
    var clearBtn = document.createElement('button');
    clearBtn.type = 'button'; clearBtn.className = 'pp-btn'; clearBtn.textContent = '🗑 清除';
    tools.appendChild(undoBtn);
    tools.appendChild(clearBtn);
    if (onSave) {
      var saveBtn = document.createElement('button');
      saveBtn.type = 'button'; saveBtn.className = 'pp-btn save'; saveBtn.textContent = saveText;
      tools.appendChild(saveBtn);
    }

    wrap.appendChild(bar);
    wrap.appendChild(wbar);
    wrap.appendChild(stage);
    wrap.appendChild(tools);

    var dpr = window.devicePixelRatio || 1;
    var strokes = [];        // 每笔: {color, w, pts:[{x,y,p}]}
    var cur = null;
    var ctx = canvas.getContext('2d');

    function fit() {
      var rect = stage.getBoundingClientRect();
      var w = rect.width || 300;
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

    function lwOf(p) {
      var pr = (typeof p === 'number' && p > 0) ? p : 0.5;
      return curW * (0.7 + 0.6 * pr);
    }

    function drawStroke(s) {
      if (!s || !s.pts || !s.pts.length) return;
      ctx.strokeStyle = s.color;
      ctx.fillStyle = s.color;
      if (s.pts.length === 1) {
        ctx.beginPath();
        ctx.arc(s.pts[0].x, s.pts[0].y, lwOf(s.pts[0].p) / 2, 0, Math.PI * 2);
        ctx.fill();
        return;
      }
      ctx.lineWidth = lwOf(s.pts[0].p);
      ctx.beginPath();
      ctx.moveTo(s.pts[0].x, s.pts[0].y);
      for (var i = 1; i < s.pts.length; i++) {
        var mx = (s.pts[i - 1].x + s.pts[i].x) / 2;
        var my = (s.pts[i - 1].y + s.pts[i].y) / 2;
        ctx.quadraticCurveTo(s.pts[i - 1].x, s.pts[i - 1].y, mx, my);
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
      cur = { color: curColor, w: curW, pts: [] };
      var p = getPos(e);
      cur.pts.push({ x: p.x, y: p.y, p: e.pressure });
      ph.style.display = 'none';
    }

    function move(e) {
      if (!cur) return;
      e.preventDefault();
      var evs = (e.getCoalescedEvents && e.getCoalescedEvents().length)
        ? e.getCoalescedEvents() : [e];
      for (var i = 0; i < evs.length; i++) {
        var p = getPos(evs[i]);
        cur.pts.push({ x: p.x, y: p.y, p: evs[i].pressure });
      }
      drawStroke(cur);
    }

    function up(e) {
      if (!cur) return;
      e.preventDefault();
      if (cur.pts.length) strokes.push(cur);
      cur = null;
    }

    canvas.addEventListener('pointerdown', down);
    canvas.addEventListener('pointermove', move);
    canvas.addEventListener('pointerup', up);
    canvas.addEventListener('pointercancel', up);
    canvas.addEventListener('pointerleave', up);

    undoBtn.addEventListener('click', function () {
      strokes.pop(); redraw();
    });
    clearBtn.addEventListener('click', function () {
      strokes = []; cur = null; redraw(); ph.style.display = 'flex';
    });
    if (onSave) {
      saveBtn.addEventListener('click', function () {
        if (onSave) onSave(api);
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
      setColor: function (v) { curColor = v; },
      fit: fit,
      destroy: function () {
        window.removeEventListener('resize', fit);
        if (wrap.parentNode) wrap.parentNode.removeChild(wrap);
      }
    };
    wrap._pp = api;
    return api;
  }

  window.PenPaint = { create: create };
})();
