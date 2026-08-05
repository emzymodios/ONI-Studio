/* ============================================
   ONI-Studio — menu.js
   Xử lý menu điện thoại: mở/đóng, đóng khi bấm link
   ============================================ */

(function () {
  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');

  if (!menuToggle || !mobileMenu) return;

  function openMenu() {
    mobileMenu.classList.add('is-open');
    menuToggle.classList.add('is-open');
    menuToggle.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    mobileMenu.classList.remove('is-open');
    menuToggle.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
  }

  function toggleMenu() {
    const isOpen = mobileMenu.classList.contains('is-open');
    isOpen ? closeMenu() : openMenu();
  }

  menuToggle.addEventListener('click', toggleMenu);

  // Đóng menu khi người dùng chọn một mục
  mobileMenu.querySelectorAll('.mobile-link').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  // Đóng menu khi mở rộng cửa sổ lên kích thước desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 600) closeMenu();
  });
})();
