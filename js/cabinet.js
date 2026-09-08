(function () {
  var navItems = document.querySelectorAll('.cab-nav-item[data-view]');
  var views = document.querySelectorAll('.cab-view');

  function showView(name) {
    views.forEach(function (v) {
      v.classList.toggle('is-active', v.getAttribute('data-view') === name);
    });
    navItems.forEach(function (n) {
      n.classList.toggle('is-active', n.getAttribute('data-view') === name);
    });
  }

  navItems.forEach(function (item) {
    item.addEventListener('click', function () {
      showView(item.getAttribute('data-view'));
    });
  });

  // Chat thread switching (all threads share the same demo content, just
  // highlights the clicked conversation like a real inbox would).
  var chatItems = document.querySelectorAll('.cab-chat-item');
  chatItems.forEach(function (item) {
    item.addEventListener('click', function () {
      chatItems.forEach(function (c) { c.classList.remove('is-active'); });
      item.classList.add('is-active');
    });
  });

  // File picker wiring (same pattern as the landing page upload widget).
  var input = document.getElementById('cabUploadInput');
  var trigger = document.querySelector('[data-cab-upload-trigger]');
  var status = document.querySelector('[data-cab-upload-status]');
  if (input && trigger) {
    trigger.addEventListener('click', function () { input.click(); });
    input.addEventListener('change', function () {
      if (!status) return;
      var count = input.files ? input.files.length : 0;
      if (count === 0) status.textContent = '';
      else if (count === 1) status.textContent = 'Выбран файл: ' + input.files[0].name;
      else status.textContent = 'Выбрано файлов: ' + count;
    });
  }
})();
