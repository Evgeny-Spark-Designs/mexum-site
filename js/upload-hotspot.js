(function () {
  var input = document.getElementById('uploadHotspotInput');
  var triggers = document.querySelectorAll('[data-upload-trigger]');
  var status = document.querySelector('[data-upload-status]');
  if (!input || !triggers.length) return;

  triggers.forEach(function (btn) {
    btn.addEventListener('click', function () {
      input.click();
    });
  });

  input.addEventListener('change', function () {
    if (!status) return;
    var count = input.files ? input.files.length : 0;
    if (count === 0) {
      status.textContent = '';
    } else if (count === 1) {
      status.textContent = 'Выбран файл: ' + input.files[0].name;
    } else {
      status.textContent = 'Выбрано файлов: ' + count;
    }
  });
})();
