(function () {
  var highlights = document.querySelectorAll('.framer-dv0q2q');
  var panels = document.querySelectorAll('.framer-1yz5w5a');
  if (!highlights.length || !panels.length) return;

  var pairs = [];
  var count = Math.min(highlights.length, panels.length);
  for (var i = 0; i < count; i++) {
    pairs.push({ panel: panels[i], fill: highlights[i] });
  }

  var ticking = false;

  // progress = 0 when the panel's top just enters at the bottom of the
  // viewport, progress = 1 as soon as the panel's bottom reaches the
  // bottom of the viewport (i.e. the whole panel has become visible).
  function update() {
    var viewportHeight = window.innerHeight;
    pairs.forEach(function (p) {
      var rect = p.panel.getBoundingClientRect();
      if (rect.height === 0) return;
      var progress = (viewportHeight - rect.top) / rect.height;
      progress = Math.max(0, Math.min(1, progress));
      p.fill.style.setProperty('--fill', progress);
    });
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });
  window.addEventListener('resize', update);
  update();
})();
