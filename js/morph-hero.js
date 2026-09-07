(function () {
  var card = document.getElementById('morphCard');
  var body = card ? card.querySelector('.morph-body') : null;
  if (!card || !body) return;

  var MAX_SCROLL = 420;
  var bodyNaturalHeight = null;

  function measure() {
    body.style.maxHeight = 'none';
    bodyNaturalHeight = body.scrollHeight;
  }

  function ease(t) { return 1 - Math.pow(1 - t, 3); }

  function update() {
    var raw = Math.min(1, Math.max(0, window.scrollY / MAX_SCROLL));
    var p = ease(raw);

    var vw = window.innerWidth;
    var vh = window.innerHeight;
    var isMobile = vw <= 700;

    var widthStart = Math.min(vw * 0.92, 680);
    var widthEnd = Math.min(vw * 0.96, 1180);
    var width = widthStart + (widthEnd - widthStart) * p;

    var topStart = vh / 2;
    var topEnd = isMobile ? 34 : 40;
    var top = topStart + (topEnd - topStart) * p;

    var radius = 28 - 14 * p;
    var padX = isMobile ? (22 - 6 * p) : (36 - 20 * p);
    var padY = (isMobile ? 20 : 28) - (isMobile ? 12 : 20) * p;

    card.style.width = width + 'px';
    card.style.top = top + 'px';
    card.style.borderRadius = radius + 'px';
    card.style.padding = padY + 'px ' + padX + 'px';

    if (bodyNaturalHeight === null) measure();
    body.style.maxHeight = Math.max(0, bodyNaturalHeight * (1 - p)) + 'px';
    body.style.opacity = String(Math.max(0, 1 - p * 1.4));
    body.style.marginTop = (1 - p) * 4 + 'px';

    card.style.boxShadow = p > 0.98
      ? '0 8px 30px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,0.6)'
      : '0 30px 80px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.8)';
  }

  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', function () { measure(); update(); });
  window.addEventListener('load', function () { measure(); update(); });
  measure();
  update();
})();
