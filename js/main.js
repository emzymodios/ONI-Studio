/* ============================================
   ONI-Studio — main.js
   Chức năng chính: hiệu ứng cuộn hiện dần, header co lại
   khi cuộn, và xử lý gửi form liên hệ (demo phía client)
   ============================================ */

(function () {
  /* ---------- Hiện dần các khối khi cuộn tới ---------- */
  const revealTargets = document.querySelectorAll(
    '.about, .services, .portfolio, .contact, .service-card, .portfolio-card'
  );
  revealTargets.forEach((el) => el.classList.add('reveal'));

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealTargets.forEach((el) => observer.observe(el));
  } else {
    // Trình duyệt cũ không hỗ trợ IntersectionObserver: hiện luôn
    revealTargets.forEach((el) => el.classList.add('is-visible'));
  }

  /* ---------- Header co bóng khi cuộn ---------- */
  const header = document.getElementById('siteHeader');
  if (header) {
    window.addEventListener('scroll', () => {
      header.style.boxShadow = window.scrollY > 12
        ? '0 8px 24px rgba(64, 42, 46, 0.10)'
        : 'none';
    });
  }

  /* ---------- Form liên hệ (demo, chưa nối backend) ---------- */
  const form = document.getElementById('contactForm');
  const formNote = document.getElementById('formNote');

  if (form && formNote) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.querySelector('[name="name"]').value.trim();

      formNote.textContent = `Cảm ơn ${name || 'bạn'} 🏮 Tin nhắn đã được ghi nhận!`;
      form.reset();

      // Lưu ý cho nhà phát triển: đây là demo phía client.
      // Hãy nối endpoint thật (fetch/AJAX) để gửi dữ liệu tới email hoặc server.
    });
  }
})();
