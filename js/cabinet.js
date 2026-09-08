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

  // ---- Chat thread switching ----
  var CHATS = {
    lesnoy: {
      title: 'Чат по проекту «ЖК Лесной», корп. 2',
      meta: 'Шифрование • Удаление по запросу • По оферте',
      messages: [
        { type: 'system', text: 'Документы по проекту «ЖК Лесной» получены. Менеджер назначен автоматически.' },
        { type: 'in', text: 'Добрый день! Я — ведущий менеджер проекта. Проверили разделы АР, КЖ, ОВ. Нашли 14 замечаний, критичных для экспертизы.', time: '11:42' },
        { type: 'in', text: 'Протокол замечаний + ведомость исправлений приложил. Отчёт подпишем после согласования.', time: '11:43', file: 'Протокол_ЖК-Лесной_14зам.pdf • 2.4 МБ' },
        { type: 'out', text: 'Спасибо, смотрим. По разделу КЖ — узлы перепроверите?', time: '11:47' }
      ]
    },
    galereya: {
      title: 'Чат по проекту «ТЦ Галерея» — смета',
      meta: 'Шифрование • Удаление по запросу • По оферте',
      messages: [
        { type: 'system', text: 'Смета по проекту «ТЦ Галерея» получена. Менеджер назначен автоматически.' },
        { type: 'in', text: 'Смета проверена. Замечаний нет — расценки и объёмы подтверждены обмерами и актуальной нормативной базой.', time: '09:15' },
        { type: 'in', text: 'Итоговый отчёт и протокол проверки во вложении.', time: '09:16', file: 'Отчёт_ТЦ-Галерея_смета.pdf • 1.1 МБ' },
        { type: 'out', text: 'Спасибо! Закрываем проект.', time: '09:20' }
      ]
    },
    school: {
      title: 'Чат по проекту «Школа на 1100 мест», ИД',
      meta: 'Шифрование • Удаление по запросу • По оферте',
      messages: [
        { type: 'system', text: 'Документы по проекту «Школа на 1100 мест» получены. Менеджер назначен автоматически.' },
        { type: 'in', text: 'Проверили исполнительную документацию. Не хватает актов АОСР по осям 5–7 — без них раздел не закрыть.', time: 'Вчера, 16:04' },
        { type: 'in', text: 'Как только пришлёте акты — пересчитаем сроки и закроем замечания.', time: 'Вчера, 16:05' }
      ]
    }
  };

  var titleEl = document.querySelector('[data-chat-title]');
  var metaEl = document.querySelector('[data-chat-meta]');
  var messagesEl = document.querySelector('[data-chat-messages]');

  // ---- Unread badges (per-chat, chat-list total, sidebar nav total) ----
  // Starting counts match what's shown in the client's reference screenshot;
  // opening a chat clears its own count and every badge that sums it
  // recomputes, so this is real state rather than a fixed label.
  var UNREAD = { lesnoy: 3, galereya: 0, school: 1 };

  var chatUnreadNavBadge = document.querySelector('[data-badge="chat-unread"]');
  var chatTotalBadge = document.querySelector('[data-badge="chat-total"]');
  var projectsBadge = document.querySelector('[data-badge="projects-count"]');

  function updateUnreadUI() {
    var total = 0;
    Object.keys(UNREAD).forEach(function (id) {
      total += UNREAD[id];
      var badge = document.querySelector('[data-chat-badge="' + id + '"]');
      if (!badge) return;
      badge.textContent = UNREAD[id];
      badge.hidden = UNREAD[id] === 0;
    });
    if (chatTotalBadge) {
      chatTotalBadge.textContent = total + ' нов' + (total === 1 ? 'ый' : total >= 2 && total <= 4 ? 'ых' : 'ых');
      chatTotalBadge.hidden = total === 0;
    }
    if (chatUnreadNavBadge) {
      chatUnreadNavBadge.textContent = total;
      chatUnreadNavBadge.hidden = total === 0;
    }
  }

  function markRead(id) {
    if (UNREAD[id]) {
      UNREAD[id] = 0;
      updateUnreadUI();
    }
  }

  if (projectsBadge) {
    projectsBadge.textContent = document.querySelectorAll('.cab-table tbody tr').length;
  }
  updateUnreadUI();
  markRead('lesnoy'); // it's the chat already open by default

  function escapeHtml(s) {
    return s.replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  function renderChat(id) {
    var chat = CHATS[id];
    if (!chat || !titleEl || !metaEl || !messagesEl) return;
    titleEl.textContent = chat.title;
    metaEl.textContent = chat.meta;
    messagesEl.innerHTML = chat.messages.map(function (m) {
      if (m.type === 'system') {
        return '<div class="cab-msg cab-msg--system"><div class="cab-msg__label">СИСТЕМА</div>' + escapeHtml(m.text) + '</div>';
      }
      var label = m.type === 'in' ? '<div class="cab-msg__label">МЕНЕДЖЕР ПРОЕКТА</div>' : '';
      var file = m.file ? '<div class="cab-msg__file"><span class="cab-msg__file-icon">PDF</span><span>' + escapeHtml(m.file) + '</span></div>' : '';
      return '<div class="cab-msg cab-msg--' + m.type + '">' + label +
        '<div class="cab-msg__bubble">' + escapeHtml(m.text) + file + '</div>' +
        '<div class="cab-msg__time">' + escapeHtml(m.time || '') + '</div></div>';
    }).join('');
  }

  var chatItems = document.querySelectorAll('.cab-chat-item[data-chat]');
  chatItems.forEach(function (item) {
    item.addEventListener('click', function () {
      var id = item.getAttribute('data-chat');
      chatItems.forEach(function (c) { c.classList.remove('is-active'); });
      item.classList.add('is-active');
      renderChat(id);
      markRead(id);
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
