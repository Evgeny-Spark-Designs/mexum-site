(function () {
  var MOBILE_QUERY = '(max-width: 809.98px)';
  var DESKTOP_SRC = 'images/panel-estimate-overcharges.png';
  var MOBILE_SRC = 'images/panel-estimate-overcharges-mobile.png';
  var img = document.querySelector('img.panel-img-estimate');
  if (!img) return;

  var mql = window.matchMedia(MOBILE_QUERY);

  function apply() {
    img.src = mql.matches ? MOBILE_SRC : DESKTOP_SRC;
  }

  mql.addEventListener('change', apply);
  apply();
})();
