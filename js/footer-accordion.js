(function () {
  var footer = document.querySelector('footer[data-framer-name="Desktop"]');
  if (!footer) return;

  var columns = [
    { col: '.framer-xvb52d', title: '.framer-wndy48', nav: '.framer-18if1yi' },
    { col: '.framer-coer0y', title: '.framer-mpf6ld', nav: '.framer-9vrhme' },
    { col: '.framer-1thy2j1', title: '.framer-1xqojxn', nav: '.framer-ux8lqz' }
  ];

  columns.forEach(function (c) {
    var col = footer.querySelector(c.col);
    if (!col) return;
    var title = col.querySelector(c.title);
    var nav = col.querySelector(c.nav);
    if (!title || !nav) return;

    col.classList.add('footer-accordion-col');
    title.classList.add('footer-accordion-title');
    nav.classList.add('footer-accordion-nav');
    title.setAttribute('role', 'button');
    title.setAttribute('tabindex', '0');
    title.setAttribute('aria-expanded', 'false');

    function toggle() {
      var isOpen = col.classList.toggle('is-open');
      title.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    }

    title.addEventListener('click', toggle);
    title.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle();
      }
    });
  });
})();
