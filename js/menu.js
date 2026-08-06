/* ============================================
   ONI-Studio — app.js
   Xử lý: popup, điều hướng trang, đăng bài chia sẻ, nhạc
   ============================================ */

/* ===== POPUP ===== */
(function () {
  const overlay = document.getElementById('popupOverlay');
  const closeBtn = document.getElementById('popupClose');
  const enterBtn = document.getElementById('popupEnter');

  if (!overlay) return;

  function closePopup() {
    overlay.classList.add('is-hidden');
    document.body.style.overflow = '';
  }

  // Kiểm tra đã xem chưa trong phiên này
  try {
    if (sessionStorage.getItem('oniSeen') === '1') {
      overlay.classList.add('is-hidden');
    } else {
      document.body.style.overflow = 'hidden';
    }
  } catch(e) {
    document.body.style.overflow = 'hidden';
  }

  closeBtn && closeBtn.addEventListener('click', () => {
    closePopup();
    try { sessionStorage.setItem('oniSeen', '1'); } catch(e){}
  });

  enterBtn && enterBtn.addEventListener('click', () => {
    closePopup();
    try { sessionStorage.setItem('oniSeen', '1'); } catch(e){}
  });

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      closePopup();
      try { sessionStorage.setItem('oniSeen', '1'); } catch(e){}
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !overlay.classList.contains('is-hidden')) {
      closePopup();
      try { sessionStorage.setItem('oniSeen', '1'); } catch(e){}
    }
  });
})();

/* ===== ĐIỀU HƯỚNG TRANG ===== */
function showPage(pageId, linkEl) {
  // Ẩn tất cả page
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

  // Hiện page được chọn
  const target = document.getElementById('page-' + pageId);
  if (target) target.classList.add('active');

  // Cập nhật active link trên nav desktop
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  if (linkEl) {
    linkEl.classList.add('active');
  } else {
    // Tìm link tương ứng theo onclick
    document.querySelectorAll('.nav-link').forEach(l => {
      if (l.getAttribute('onclick') && l.getAttribute('onclick').includes("'" + pageId + "'")) {
        l.classList.add('active');
      }
    });
  }

  // Cuộn lên đầu trang
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Nếu vào trang share thì render lại bài
  if (pageId === 'share') renderPosts();

  return false;
}

/* ===== MOBILE MENU ===== */
const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');

function closeMobileMenu() {
  if (mobileMenu) mobileMenu.classList.remove('is-open');
  if (menuToggle) menuToggle.classList.remove('is-open');
}

if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('is-open');
    menuToggle.classList.toggle('is-open', isOpen);
  });
}

/* ===== DỮ LIỆU BÀI CHIA SẺ (lưu trong bộ nhớ phiên) ===== */
let posts = [];

try {
  const saved = sessionStorage.getItem('oniPosts');
  if (saved) posts = JSON.parse(saved);
} catch(e) { posts = []; }

function savePosts() {
  try { sessionStorage.setItem('oniPosts', JSON.stringify(posts)); } catch(e){}
}

const catLabel = {
  code: '📜 Code / Script',
  game: '🎮 Game / APK',
  tool: '🛠️ Tool / Web',
  other: '✨ Khác'
};
const catClass = {
  code: 'cat-code',
  game: 'cat-game',
  tool: 'cat-tool',
  other: 'cat-other'
};

/* ===== ĐĂNG BÀI ===== */
const shareForm = document.getElementById('shareForm');
const postImage = document.getElementById('postImage');
const imagePreview = document.getElementById('imagePreview');
const imagePreviewWrap = document.getElementById('imagePreviewWrap');
const removeImg = document.getElementById('removeImg');

let currentImageData = null;

// Preview ảnh trước khi đăng
if (postImage) {
  postImage.addEventListener('change', () => {
    const file = postImage.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('Ảnh quá lớn! Vui lòng chọn ảnh dưới 5MB.');
      postImage.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      currentImageData = e.target.result;
      imagePreview.src = currentImageData;
      imagePreviewWrap.style.display = 'inline-block';
    };
    reader.readAsDataURL(file);
  });
}

if (removeImg) {
  removeImg.addEventListener('click', () => {
    currentImageData = null;
    postImage.value = '';
    imagePreviewWrap.style.display = 'none';
    imagePreview.src = '';
  });
}

if (shareForm) {
  shareForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('postName').value.trim();
    const title = document.getElementById('postTitle').value.trim();
    const category = document.getElementById('postCategory').value;
    const content = document.getElementById('postContent').value.trim();

    if (!name || !title || !content) return;

    const post = {
      id: Date.now(),
      name,
      title,
      category,
      content,
      image: currentImageData || null,
      date: new Date().toLocaleDateString('vi-VN', { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit' })
    };

    posts.unshift(post);
    savePosts();
    updatePostCount();

    // Reset form
    shareForm.reset();
    currentImageData = null;
    imagePreviewWrap.style.display = 'none';
    imagePreview.src = '';

    renderPosts();
    renderPreview();

    // Cuộn xuống danh sách bài
    document.getElementById('postsList').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

/* ===== RENDER BÀI CHIA SẺ ===== */
function renderPosts(filterCat) {
  const list = document.getElementById('postsList');
  const totalEl = document.getElementById('totalPosts');
  if (!list) return;

  const cat = filterCat || (document.getElementById('filterCategory') ? document.getElementById('filterCategory').value : 'all');
  const filtered = cat === 'all' ? posts : posts.filter(p => p.category === cat);

  if (totalEl) totalEl.textContent = posts.length;

  if (filtered.length === 0) {
    list.innerHTML = `<div class="empty-state"><span>👻</span><p>${posts.length === 0 ? 'Chưa có bài nào. Hãy là người đầu tiên chia sẻ!' : 'Không có bài nào trong mục này.'}</p></div>`;
    return;
  }

  list.innerHTML = filtered.map(post => `
    <div class="post-card" id="post-${post.id}">
      <div class="post-header">
        <div class="post-meta">
          <span class="post-cat ${catClass[post.category]}">${catLabel[post.category]}</span>
          <span class="post-author">👤 ${escHtml(post.name)}</span>
        </div>
        <span class="post-date">${post.date}</span>
      </div>
      <div class="post-title">${escHtml(post.title)}</div>
      <div class="post-content">${escHtml(post.content)}</div>
      ${post.image ? `<div class="post-image"><img src="${post.image}" alt="ảnh bài viết" loading="lazy"></div>` : ''}
    </div>
  `).join('');
}

function filterPosts() {
  const cat = document.getElementById('filterCategory').value;
  renderPosts(cat);
}

/* ===== RENDER PREVIEW TRANG CHỦ ===== */
function renderPreview() {
  const grid = document.getElementById('previewGrid');
  if (!grid) return;

  const recent = posts.slice(0, 3);
  if (recent.length === 0) {
    grid.innerHTML = '<div class="empty-preview">Chưa có bài nào — hãy là người đầu tiên chia sẻ! 🎉</div>';
    return;
  }

  grid.innerHTML = recent.map(post => `
    <div class="preview-card" onclick="showPage('share', null)">
      <div class="p-cat">${catLabel[post.category]}</div>
      <h4>${escHtml(post.title)}</h4>
      <div class="p-author">👤 ${escHtml(post.name)} · ${post.date}</div>
    </div>
  `).join('');
}

function updatePostCount() {
  const el = document.getElementById('postCount');
  if (el) el.textContent = posts.length;
}

/* ===== ESCAPE HTML (bảo mật XSS) ===== */
function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/* ===== NHẠC NỀN ===== */
const musicToggle = document.getElementById('musicToggle');
const bgMusic = document.getElementById('bgMusic');
let isPlaying = false;

if (musicToggle && bgMusic) {
  bgMusic.volume = 0.5;
  musicToggle.addEventListener('click', () => {
    if (!isPlaying) {
      bgMusic.play()
        .then(() => { isPlaying = true; musicToggle.textContent = '🔊'; musicToggle.classList.add('is-playing'); })
        .catch(() => { console.info('Chưa có file nhạc tại assets/music/bgm.mp3'); });
    } else {
      bgMusic.pause();
      isPlaying = false;
      musicToggle.textContent = '🎵';
      musicToggle.classList.remove('is-playing');
    }
  });
}

/* ===== KHỞI TẠO ===== */
updatePostCount();
renderPreview();
