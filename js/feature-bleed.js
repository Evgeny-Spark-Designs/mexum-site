(function () {
  var MIN_WIDTH = 810;
  var cards = Array.prototype.slice.call(document.querySelectorAll('.framer-JNpes'));
  if (!cards.length) return;

  function apply() {
    if (window.innerWidth < MIN_WIDTH) {
      cards.forEach(function (card) {
        card.style.width = '';
        card.classList.remove('bleed-right');
      });
      return;
    }
    cards.forEach(function (card) {
      // Reset to the natural (100%) width before measuring — a fixed
      // pixel width from a previous pass would otherwise throw off the
      // gap calculation on resize.
      card.style.width = '';
      card.classList.remove('bleed-right');
      var section = card.closest('section');
      if (!section) return;
      var sectionPaddingRight = parseFloat(getComputedStyle(section).paddingRight) || 0;
      var sectionContentRight = section.getBoundingClientRect().right - sectionPaddingRight;
      var cardRect = card.getBoundingClientRect();
      var gap = sectionContentRight - cardRect.right;
      if (gap > 1) {
        // margin-right can't extend a box that has an explicit width:100%
        // (percentage widths don't grow to absorb negative margins), so
        // set the pixel width directly instead.
        card.style.width = (cardRect.width + gap) + 'px';
        card.classList.add('bleed-right');
      }
    });
  }

  var ticking = false;
  function scheduleApply() {
    if (!ticking) {
      requestAnimationFrame(function () {
        apply();
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('resize', scheduleApply);
  apply();
})();
