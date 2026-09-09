(function () {
  // Real-device (iOS Safari) bug: some glass buttons render solid black
  // instead of the intended light translucent pill, even though computed
  // styles in desktop browsers show the correct light values. Cause not
  // fully isolated (nested backdrop-filter was one contributing factor,
  // already fixed at the CSS level) — force the correct look directly
  // via inline styles with "important" priority, which nothing in the
  // stylesheets can outrank, as a guaranteed fix regardless of cascade.
  var targets = [
    { selector: '.btn-start-check .framer-6yhlt6', bg: 'rgba(0, 0, 0, 0.05)', border: 'rgba(0, 0, 0, 0.12)' },
    { selector: '.pricing-tag--solid', bg: 'rgba(0, 0, 0, 0.03)', border: null },
    { selector: '.pricing-card__cta', bg: 'rgba(0, 0, 0, 0.03)', border: 'rgba(0, 0, 0, 0.15)' }
  ];

  function apply() {
    targets.forEach(function (t) {
      document.querySelectorAll(t.selector).forEach(function (el) {
        el.style.setProperty('background', t.bg, 'important');
        el.style.setProperty('background-color', t.bg, 'important');
        el.style.setProperty('backdrop-filter', 'none', 'important');
        el.style.setProperty('-webkit-backdrop-filter', 'none', 'important');
        el.style.setProperty('filter', 'none', 'important');
        if (t.border) {
          el.style.setProperty('border-color', t.border, 'important');
        }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', apply);
  } else {
    apply();
  }
})();
