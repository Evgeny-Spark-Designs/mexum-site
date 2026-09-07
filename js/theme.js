(function () {
  var KEY = 'mexum-theme';
  var root = document.documentElement;
  try {
    if (localStorage.getItem(KEY) === 'light') root.classList.add('theme-light');
  } catch (e) {}

  function init() {
    var btn = document.getElementById('themeToggle');
    if (!btn) return;
    function sync() {
      btn.setAttribute('aria-pressed', root.classList.contains('theme-light') ? 'true' : 'false');
    }
    sync();
    btn.addEventListener('click', function () {
      root.classList.toggle('theme-light');
      var isLight = root.classList.contains('theme-light');
      try { localStorage.setItem(KEY, isLight ? 'light' : 'dark'); } catch (e) {}
      sync();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
