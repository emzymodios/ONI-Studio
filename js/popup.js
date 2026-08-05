/* ============================================
   ONI-Studio — popup.js
   Popup chào mừng: hiện lần đầu ghé thăm, nhớ lựa chọn
   trong phiên trình duyệt (sessionStorage)
   ============================================ */

(function () {
  const overlay = document.getElementById('popupOverlay');
  const closeBtn = document.getElementById('popupClose');
  const enterBtn = document.getElementById('popupEnter');

  if (!overlay) return;

  const STORAGE_KEY = 'oniStudioWelcomeSeen';

  function hidePopup() {
    overlay.classList.add('is-hidden');
    document.body.style.overflow = '';
    try {
      sessionStorage.setItem(STORAGE_KEY, '1');
    } catch (e) {
      /* sessionStorage có thể bị chặn — bỏ qua, popup vẫn đóng bình thường */
    }
  }

  function showPopup() {
    overlay.classList.remove('is-hidden');
    document.body.style.overflow = 'hidden';
  }

  let alreadySeen = false;
  try {
    alreadySeen = sessionStorage.getItem(STORAGE_KEY) === '1';
  } catch (e) {
    alreadySeen = false;
  }

  if (alreadySeen) {
    overlay.classList.add('is-hidden');
  } else {
    showPopup();
  }

  closeBtn && closeBtn.addEventListener('click', hidePopup);
  enterBtn && enterBtn.addEventListener('click', hidePopup);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) hidePopup();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !overlay.classList.contains('is-hidden')) {
      hidePopup();
    }
  });
})();
