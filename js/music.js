/* ============================================
   ONI-Studio — music.js
   Bật/tắt nhạc nền. Nếu chưa có file nhạc trong
   assets/music/bgm.mp3, nút vẫn hoạt động nhưng sẽ
   báo nhẹ trong console thay vì báo lỗi cho người dùng.
   ============================================ */

(function () {
  const musicToggle = document.getElementById('musicToggle');
  const bgMusic = document.getElementById('bgMusic');

  if (!musicToggle || !bgMusic) return;

  let isPlaying = false;

  bgMusic.volume = 0.5;

  function updateIcon() {
    const icon = musicToggle.querySelector('.music-icon');
    if (icon) icon.textContent = isPlaying ? '🔊' : '🎵';
    musicToggle.classList.toggle('is-playing', isPlaying);
    musicToggle.setAttribute('aria-pressed', String(isPlaying));
  }

  musicToggle.addEventListener('click', () => {
    if (!isPlaying) {
      const playPromise = bgMusic.play();
      if (playPromise && typeof playPromise.then === 'function') {
        playPromise
          .then(() => {
            isPlaying = true;
            updateIcon();
          })
          .catch(() => {
            // Chưa có file nhạc thật trong assets/music/ — thêm bgm.mp3 vào đó để bật nhạc.
            console.info('ONI-Studio: chưa tìm thấy file nhạc tại assets/music/bgm.mp3');
          });
      } else {
        isPlaying = true;
        updateIcon();
      }
    } else {
      bgMusic.pause();
      isPlaying = false;
      updateIcon();
    }
  });
})();
