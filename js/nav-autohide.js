(function () {
  var container = document.querySelector('.framer-dpe114-container');
  if (!container) return;

  var TOP_OFFSET = 40;   // always show near the very top of the page
  var THRESHOLD = 60;    // distance to travel in one direction before toggling

  var lastY = window.scrollY;
  var directionStartY = lastY;
  var lastDirection = 0; // 1 = down, -1 = up
  var ticking = false;

  function update() {
    var y = window.scrollY;
    var delta = y - lastY;
    var direction = delta > 0 ? 1 : (delta < 0 ? -1 : lastDirection);

    if (y <= TOP_OFFSET) {
      document.documentElement.classList.remove('nav-hidden');
      directionStartY = y;
    } else {
      if (direction !== lastDirection) {
        directionStartY = lastY;
      }
      var traveled = Math.abs(y - directionStartY);
      if (direction === 1 && traveled > THRESHOLD) {
        document.documentElement.classList.add('nav-hidden');
      } else if (direction === -1 && traveled > THRESHOLD) {
        document.documentElement.classList.remove('nav-hidden');
      }
    }

    lastDirection = direction;
    lastY = y;
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });
})();
