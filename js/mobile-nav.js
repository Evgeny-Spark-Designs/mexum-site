(function () {
  var toggle = document.querySelector('[data-mobile-nav-toggle]');
  var panel = document.querySelector('[data-mobile-nav-panel]');
  if (!toggle || !panel) return;

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
