(function () {
  var toggle = document.querySelector('[data-mobile-nav-toggle]');
  var panel = document.querySelector('[data-mobile-nav-panel]');
  if (!toggle || !panel) return;

  // Move the panel out from inside <nav> to a direct child of <body>.
  // The nav has backdrop-filter (its own glass background), which forms
  // a stacking/backdrop-root context — a fixed-position descendant
  // inside that context can fail to composite (renders invisible,
  // clicks land nowhere) in real browsers. Fixed positioning doesn't
  // depend on DOM parentage, so this is a no-op visually, just escapes
  // the broken context.
  document.body.appendChild(panel);

  function setOpen(open) {
    toggle.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    panel.hidden = !open;
    panel.classList.toggle('is-open', open);
  }

  toggle.addEventListener('click', function () {
    setOpen(!panel.classList.contains('is-open'));
  });

  panel.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () { setOpen(false); });
  });

  document.addEventListener('click', function (e) {
    if (!panel.classList.contains('is-open')) return;
    if (panel.contains(e.target) || toggle.contains(e.target)) return;
    setOpen(false);
  });
})();
