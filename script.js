// Zoom camera for the one-page portfolio.
// Overview shows the whole sheet. Tap, scroll, swipe, pinch or use the keys
// to zoom into one section at a time. Each section has its own #hash link.
(function () {
  'use strict';

  var root = document.documentElement;
  var vp = document.getElementById('vp');
  var drag = document.getElementById('drag');
  var cam = document.getElementById('cam');
  var sheet = document.getElementById('sheet');
  var bar = document.getElementById('bar');
  var label = document.getElementById('label');
  var live = document.getElementById('live');
  var secs = Array.prototype.slice.call(document.querySelectorAll('.sec'));
  var ids = secs.map(function (s) { return s.id; });
  var N = secs.length;

  if (!vp || !cam || !sheet || !N || !window.requestAnimationFrame) return;

  root.classList.add('zoom');
  bar.hidden = false;

  var focus = -1;
  var rects = [];
  var narrow = false;
  var moveTimer = null;

  function pad2(n) { return (n < 10 ? '0' : '') + n; }

  function measure() {
    var W = vp.clientWidth;
    var isNarrow = W < 760;
    if (isNarrow !== narrow) {
      narrow = isNarrow;
      root.classList.toggle('narrow', narrow);
    }
    var sr = sheet.getBoundingClientRect();
    var k = sheet.offsetWidth ? sr.width / sheet.offsetWidth : 1;
    rects = secs.map(function (el) {
      var r = el.getBoundingClientRect();
      return { x: (r.left - sr.left) / k, y: (r.top - sr.top) / k, w: r.width / k, h: r.height / k };
    });
    place();
  }

  function place() {
    var W = vp.clientWidth, H = vp.clientHeight;
    var SW = sheet.offsetWidth, SH = sheet.offsetHeight;
    var focused = focus >= 0 && rects[focus];
    var r = focused ? rects[focus] : { x: 0, y: 0, w: SW, h: SH };
    var m = narrow ? 12 : 48;
    var barH = 72;
    var cap = focused ? (narrow ? 1.25 : 1.8) : 1;
    var s = Math.max(0.05, Math.min((W - 2 * m) / r.w, (H - 2 * m - barH) / r.h, cap));
    var tx = (W - r.w * s) / 2 - r.x * s;
    var ty = (H - barH - r.h * s) / 2 - r.y * s + (narrow ? 4 : 0);
    cam.style.transform = 'translate(' + tx.toFixed(1) + 'px,' + ty.toFixed(1) + 'px) scale(' + s.toFixed(4) + ')';
  }

  function paint() {
    vp.classList.toggle('focused', focus >= 0);
    secs.forEach(function (el, i) { el.classList.toggle('is-focus', i === focus); });
    label.textContent = focus < 0 ? 'Overview' : pad2(focus + 1) + ' / ' + pad2(N);
    live.textContent = focus < 0 ? 'Whole page' : secs[focus].getAttribute('data-label');
    place();
  }

  function bounce(dir) {
    drag.classList.add('held');
    drag.style.transform = 'translateY(' + (-22 * dir) + 'px)';
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { drag.classList.remove('held'); drag.style.transform = ''; });
    });
  }

  function setFocus(n, opts) {
    var f = Math.max(-1, Math.min(N - 1, n));
    if (f === focus) { if (n !== focus) bounce(n > focus ? 1 : -1); return; }
    var zoomJump = focus === -1 || f === -1;
    focus = f;
    cam.classList.remove('moving-v', 'moving-z');
    if (!(opts && opts.instant)) {
      cam.classList.add(zoomJump ? 'moving-z' : 'moving-v');
      clearTimeout(moveTimer);
      moveTimer = setTimeout(function () { cam.classList.remove('moving-v', 'moving-z'); }, zoomJump ? 200 : 170);
    }
    paint();
    try {
      history.replaceState(null, '', location.pathname + location.search + (f >= 0 ? '#' + ids[f] : ''));
    } catch (e) {}
    var a = document.activeElement;
    if (!a || a === document.body || !vp.contains(a) || a.classList.contains('zoomhit')) vp.focus({ preventScroll: true });
  }

  // Taps on a section (overview, or a blurred neighbour)
  secs.forEach(function (el, i) {
    var hit = el.querySelector('.zoomhit');
    if (hit) hit.addEventListener('click', function () { setFocus(i); });
  });

  document.getElementById('prev').addEventListener('click', function () { setFocus(focus - 1); });
  document.getElementById('next').addEventListener('click', function () { setFocus(focus + 1); });
  label.addEventListener('click', function () { setFocus(-1); });

  // Keys
  vp.addEventListener('keydown', function (e) {
    var k = e.key;
    if (k === 'Escape') setFocus(-1);
    else if (k === 'ArrowRight' || k === 'ArrowDown' || k === 'PageDown' || k === ' ') { e.preventDefault(); setFocus(focus + 1); }
    else if (k === 'ArrowLeft' || k === 'ArrowUp' || k === 'PageUp') { e.preventDefault(); setFocus(focus - 1); }
    else if (k === 'Home') { e.preventDefault(); setFocus(0); }
    else if (k === 'End') { e.preventDefault(); setFocus(N - 1); }
  });

  // Wheel and trackpad: one step per gesture
  var lastStep = 0, prevWheel = 0;
  vp.addEventListener('wheel', function (e) {
    e.preventDefault();
    var dy = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
    if (Math.abs(dy) < 4) return;
    var now = Date.now();
    var gap = now - prevWheel;
    prevWheel = now;
    var since = now - lastStep;
    if (since < 320) return;
    if (gap < 140 && since < 900) return;
    lastStep = now;
    setFocus(focus + (dy > 0 ? 1 : -1));
  }, { passive: false });

  // Touch: swipe, pinch, double tap
  function hitSection(x, y) {
    for (var i = 0; i < secs.length; i++) {
      var r = secs[i].getBoundingClientRect();
      if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) return i;
    }
    return -1;
  }
  function dist(t) {
    var dx = t[0].clientX - t[1].clientX, dy = t[0].clientY - t[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }
  function mid(t) { return { x: (t[0].clientX + t[1].clientX) / 2, y: (t[0].clientY + t[1].clientY) / 2 }; }

  var g = null, lastTap = null;

  vp.addEventListener('touchstart', function (e) {
    var t = e.touches;
    drag.classList.add('held');
    if (t.length >= 2) {
      var c = mid(t);
      g = { mode: 'pinch', d0: dist(t), mx: c.x, my: c.y, ratio: 1 };
    } else {
      g = { mode: 'pan', x0: t[0].clientX, y0: t[0].clientY, dx: 0, dy: 0, t0: Date.now() };
    }
  }, { passive: true });

  vp.addEventListener('touchmove', function (e) {
    var t = e.touches;
    if (!g) return;
    if (t.length >= 2) {
      var c = mid(t);
      if (g.mode !== 'pinch') { g = { mode: 'pinch', d0: dist(t), mx: c.x, my: c.y, ratio: 1 }; return; }
      g.ratio = dist(t) / (g.d0 || 1);
      g.mx = c.x; g.my = c.y;
      var sc = Math.max(0.8, Math.min(1.2, 1 + (g.ratio - 1) * 0.5));
      drag.style.transformOrigin = g.mx + 'px ' + g.my + 'px';
      drag.style.transform = 'scale(' + sc.toFixed(4) + ')';
      return;
    }
    if (g.mode !== 'pan') return;
    g.dx = t[0].clientX - g.x0;
    g.dy = t[0].clientY - g.y0;
    var horiz = Math.abs(g.dx) > Math.abs(g.dy);
    var v = horiz ? g.dx : g.dy;
    var eased = (v < 0 ? -1 : 1) * Math.min(90, Math.abs(v) * 0.45);
    var shrink = 1 - Math.min(0.04, Math.abs(v) / 4000);
    drag.style.transformOrigin = '50% 50%';
    drag.style.transform = (horiz ? 'translateX(' : 'translateY(') + eased.toFixed(1) + 'px) scale(' + shrink.toFixed(4) + ')';
  }, { passive: true });

  function endTouch(e) {
    if (e.touches && e.touches.length > 0) return;
    drag.classList.remove('held');
    drag.style.transform = '';
    var gg = g;
    g = null;
    if (!gg) return;
    if (gg.mode === 'pinch') {
      if (gg.ratio < 0.85 && focus >= 0) setFocus(-1);
      else if (gg.ratio > 1.15) { var i = hitSection(gg.mx, gg.my); if (i >= 0 && i !== focus) setFocus(i); }
      return;
    }
    var ax = Math.abs(gg.dx), ay = Math.abs(gg.dy);
    if (ax < 10 && ay < 10) {
      var now = Date.now();
      var tch = e.changedTouches && e.changedTouches[0];
      var x = tch ? tch.clientX : gg.x0, y = tch ? tch.clientY : gg.y0;
      if (lastTap && now - lastTap.t < 300 && Math.abs(x - lastTap.x) < 30 && Math.abs(y - lastTap.y) < 30) {
        if (focus >= 0 && lastTap.f === focus) { if (e.cancelable) e.preventDefault(); setFocus(-1); }
        lastTap = null;
      } else {
        lastTap = { t: now, x: x, y: y, f: focus };
      }
      return;
    }
    var thresh = (Date.now() - gg.t0) < 250 ? 18 : 40;
    if (ax > ay && ax > thresh) setFocus(focus + (gg.dx < 0 ? 1 : -1));
    else if (ay >= ax && ay > thresh) setFocus(focus + (gg.dy < 0 ? 1 : -1));
  }
  vp.addEventListener('touchend', endTouch);
  vp.addEventListener('touchcancel', function () { g = null; drag.classList.remove('held'); drag.style.transform = ''; });

  // The browser scrolls to #hash targets and focused links even inside an
  // overflow:hidden box. The camera does all positioning, so pin scroll at 0.
  function unscroll() {
    if (vp.scrollTop || vp.scrollLeft) { vp.scrollTop = 0; vp.scrollLeft = 0; }
    if (window.scrollX || window.scrollY) window.scrollTo(0, 0);
  }
  vp.addEventListener('scroll', unscroll);
  window.addEventListener('scroll', unscroll);

  // Layout and deep links
  var resizeRaf = 0;
  window.addEventListener('resize', function () {
    cancelAnimationFrame(resizeRaf);
    resizeRaf = requestAnimationFrame(measure);
  });
  window.addEventListener('hashchange', function () {
    var i = ids.indexOf(location.hash.slice(1));
    if (i !== focus) setFocus(i);
  });

  cam.style.transition = 'none';
  unscroll();
  measure();
  var start = ids.indexOf(location.hash.slice(1));
  if (start >= 0) setFocus(start, { instant: true });
  else paint();
  requestAnimationFrame(function () { requestAnimationFrame(function () { cam.style.transition = ''; }); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
  setTimeout(measure, 400);
  vp.focus({ preventScroll: true });
})();
