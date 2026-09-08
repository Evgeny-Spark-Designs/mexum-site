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

  // ---- Dismiss the privacy banner (same fade-out-cookies class as the source) ----
  var cookiesPopup = document.querySelector('.cookies-popup');
  var cookiesAccept = document.querySelector('.cookies-button');
  if (cookiesPopup && cookiesAccept) {
    cookiesAccept.addEventListener('click', function () {
      cookiesPopup.classList.add('fade-out-cookies');
      setTimeout(function () { cookiesPopup.hidden = true; }, 500);
    });
  }

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

  var currentChatId = 'lesnoy'; // matches the thread rendered by default

  var chatItems = document.querySelectorAll('.cab-chat-item[data-chat]');
  chatItems.forEach(function (item) {
    item.addEventListener('click', function () {
      var id = item.getAttribute('data-chat');
      currentChatId = id;
      chatItems.forEach(function (c) { c.classList.remove('is-active'); });
      item.classList.add('is-active');
      renderChat(id);
      markRead(id);
    });
  });

  function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' Б';
    var kb = bytes / 1024;
    if (kb < 1024) return kb.toFixed(1).replace('.0', '') + ' КБ';
    return (kb / 1024).toFixed(1).replace('.0', '') + ' МБ';
  }

  // Attach-file button in the chat composer: pushes an outgoing message
  // with a file attachment into the currently open chat thread.
  var chatAttachInput = document.getElementById('chatAttachInput');
  var chatAttachTrigger = document.querySelector('[data-chat-attach-trigger]');
  if (chatAttachInput && chatAttachTrigger) {
    chatAttachTrigger.addEventListener('click', function () { chatAttachInput.click(); });
    chatAttachInput.addEventListener('change', function () {
      var file = chatAttachInput.files && chatAttachInput.files[0];
      var chat = CHATS[currentChatId];
      if (!file || !chat) return;
      chat.messages.push({
        type: 'out',
        text: 'Прикрепил документ.',
        time: 'Сейчас',
        file: file.name + ' • ' + formatFileSize(file.size)
      });
      renderChat(currentChatId);
      if (messagesEl) messagesEl.scrollTop = messagesEl.scrollHeight;
      chatAttachInput.value = '';
    });
  }

  // File picker wiring (same pattern as the landing page upload widget).
  var input = document.getElementById('cabUploadInput');
  var triggers = document.querySelectorAll('[data-cab-upload-trigger]');
  var status = document.querySelector('[data-cab-upload-status]');

  // ---- Mandatory tariff selection before the first upload ----
  var hasActivePlan = false;
  var activePlanName = '';
  var modal = document.querySelector('[data-tariff-modal]');
  var modalClose = document.querySelector('[data-tariff-modal-close]');
  var tariffButtons = document.querySelectorAll('[data-tariff-select]');

  function showStatus() {
    if (!status || !input.files) return;
    var count = input.files.length;
    if (count === 0) { status.textContent = ''; return; }
    var label = count === 1 ? 'Выбран файл: ' + input.files[0].name : 'Выбрано файлов: ' + count;
    if (hasActivePlan) label += ' • Тариф: ' + activePlanName;
    status.textContent = label;
  }

  function openTariffModal() {
    if (modal) modal.hidden = false;
  }

  function closeTariffModal(cancelled) {
    if (modal) modal.hidden = true;
    if (cancelled && input) input.value = '';
  }

  // Reflects the active tariff everywhere it's shown: nav badge, the
  // dedicated "Тарифы" tab status card, and every matching card/button
  // (both there and inside the mandatory-selection modal).
  var tariffStatusLabel = document.querySelector('[data-tariff-status-label]');
  var tariffStatusDesc = document.querySelector('[data-tariff-status-desc]');
  var tariffStatusBadge = document.querySelector('[data-tariff-status-badge]');
  var tariffNavBadge = document.querySelector('[data-tariff-nav-badge]');
  var tariffQuota = document.querySelector('[data-tariff-quota]');
  var tariffQuotaText = document.querySelector('[data-tariff-quota-text]');
  var tariffQuotaFill = document.querySelector('[data-tariff-quota-fill]');

  // Monthly project quota per subscription plan; one-off audits (ПД/РД, СД, ИД)
  // aren't in this map, so they show no quota bar. "Used" is the project count
  // from "Мои проекты" — the same real state the nav badge there is built from.
  var TARIFF_QUOTAS = {
    'Тариф «Старт»': 5,
    'Тариф «Бизнес»': 15,
    'Тариф «Профи»': Infinity
  };
  var usedProjects = document.querySelectorAll('.cab-table tbody tr').length;

  function applyTariffState() {
    tariffButtons.forEach(function (btn) {
      var isActive = hasActivePlan && btn.getAttribute('data-tariff-name') === activePlanName;
      var card = btn.closest('.pricing-card');
      if (card) card.classList.toggle('pricing-card--active', isActive);
      btn.disabled = isActive;
      btn.textContent = isActive ? 'Подключено' : btn.getAttribute('data-tariff-label');
    });
    if (tariffStatusLabel) {
      tariffStatusLabel.textContent = hasActivePlan ? 'Активный тариф: ' + activePlanName : 'Тариф не подключён';
    }
    if (tariffStatusDesc) {
      tariffStatusDesc.textContent = hasActivePlan
        ? 'Подключён • Оплата по оферте • Загрузка документов доступна'
        : 'Выберите тариф ниже — он понадобится перед загрузкой документов.';
    }
    if (tariffStatusBadge) {
      tariffStatusBadge.textContent = hasActivePlan ? 'Активен' : 'Не активен';
      tariffStatusBadge.classList.toggle('cab-tariff-status__badge--active', hasActivePlan);
    }
    if (tariffNavBadge) {
      tariffNavBadge.textContent = hasActivePlan ? 'Активен' : 'Не активен';
      tariffNavBadge.classList.toggle('cab-nav-item__badge--active', hasActivePlan);
    }
    if (tariffQuota) {
      var quota = hasActivePlan ? TARIFF_QUOTAS[activePlanName] : undefined;
      tariffQuota.hidden = quota === undefined;
      if (quota !== undefined && tariffQuotaText && tariffQuotaFill) {
        if (quota === Infinity) {
          tariffQuotaText.textContent = 'Использовано ' + usedProjects + ' проектов • Безлимит';
          tariffQuotaFill.style.width = '100%';
          tariffQuotaFill.classList.remove('cab-quota-bar__fill--full');
        } else {
          var remaining = Math.max(quota - usedProjects, 0);
          tariffQuotaText.textContent = 'Использовано ' + usedProjects + ' из ' + quota + ' проектов • Осталось ' + remaining;
          tariffQuotaFill.style.width = Math.min((usedProjects / quota) * 100, 100) + '%';
          tariffQuotaFill.classList.toggle('cab-quota-bar__fill--full', usedProjects >= quota);
        }
      }
    }
  }

  tariffButtons.forEach(function (btn) {
    btn.setAttribute('data-tariff-label', btn.textContent);
    btn.addEventListener('click', function () {
      hasActivePlan = true;
      activePlanName = btn.getAttribute('data-tariff-name') || '';
      closeTariffModal(false);
      showStatus();
      applyTariffState();
    });
  });
  applyTariffState();

  if (modalClose) {
    modalClose.addEventListener('click', function () { closeTariffModal(true); });
  }

  if (input && triggers.length) {
    triggers.forEach(function (trigger) {
      trigger.addEventListener('click', function () { input.click(); });
    });
    input.addEventListener('change', function () {
      var count = input.files ? input.files.length : 0;
      if (count > 0 && !hasActivePlan) {
        openTariffModal();
        return;
      }
      showStatus();
    });
  }
})();
