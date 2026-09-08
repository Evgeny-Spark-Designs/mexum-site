(function () {
  if (window.innerWidth < 768) return;
  if (typeof gsap === 'undefined') return;

  function getLabelEl(el) {
    var explicit = el.querySelector('[data-button-hover-text]');
    if (explicit) return explicit;
    var p = el.querySelector('p');
    if (p) return p;
    var span = el.querySelector('span:not(.cab-nav-item__badge)');
    if (span) return span;
    if (!el.firstChild) return null;
    var wrapper = document.createElement('span');
    while (el.firstChild) wrapper.appendChild(el.firstChild);
    el.appendChild(wrapper);
    return wrapper;
  }

  function wrap(el) {
    var textEl = getLabelEl(el);
    if (!textEl) return;

    var h = Math.ceil(textEl.getBoundingClientRect().height);

    var mask = document.createElement('span');
    mask.className = 'btn-hover-mask';
    mask.style.height = h + 'px';
    textEl.parentNode.insertBefore(mask, textEl);
    mask.appendChild(textEl);
    textEl.classList.add('btn-hover-original');

    var clone = textEl.cloneNode(true);
    clone.classList.add('btn-hover-clone');
    mask.appendChild(clone);

    gsap.set(clone, { y: h });

    var showingOriginal = true;
    var tl;

    el.addEventListener('mouseenter', function () {
      if (tl) tl.kill();
      tl = gsap.timeline();
      var leaving = showingOriginal ? textEl : clone;
      var entering = showingOriginal ? clone : textEl;
      tl.to(leaving, { y: -h, duration: 0.5, ease: 'power2.out' });
      tl.fromTo(entering, { y: h }, { y: 0, duration: 0.5, ease: 'power2.out' }, '<');
      showingOriginal = !showingOriginal;
    });
  }

  document.querySelectorAll('[data-button-hover]').forEach(function (el) {
    if (el.disabled) return;
    wrap(el);
  });
})();
