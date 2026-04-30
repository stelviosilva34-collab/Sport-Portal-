// ─── DARK / LIGHT MODE ────────────────────────────────────────────
const themeToggle = document.getElementById('themeToggle');
const themeLabel  = document.getElementById('themeLabel');
let isDark = true;

themeToggle.addEventListener('click', () => {
  isDark = !isDark;
  document.body.classList.toggle('light', !isDark);
  themeLabel.textContent = isDark ? '🌙' : '☀️';
});

// ─── NAV TABS ─────────────────────────────────────────────────────
const navBtns  = document.querySelectorAll('.nav-btn');
const tabPages = document.querySelectorAll('.tab-page');

navBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.tab;

    // Update buttons
    navBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // Update pages
    tabPages.forEach(p => {
      p.classList.remove('active');
      if (p.id === 'tab-' + target) p.classList.add('active');
    });

    // Close article if open
    closeArticle();

    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});

// ─── HERO SLIDER ──────────────────────────────────────────────────
const heroSlides = document.querySelectorAll('.hero-slide');
const heroDots   = document.querySelectorAll('.hero-dot');
let currentSlide = 0;
let sliderTimer  = null;

function goToSlide(idx) {
  heroSlides[currentSlide].classList.remove('active');
  heroDots[currentSlide].classList.remove('active');
  currentSlide = (idx + heroSlides.length) % heroSlides.length;
  heroSlides[currentSlide].classList.add('active');
  heroDots[currentSlide].classList.add('active');
}

function nextSlide() {
  goToSlide(currentSlide + 1);
}

function startSlider() {
  sliderTimer = setInterval(nextSlide, 5000);
}

function resetSlider() {
  clearInterval(sliderTimer);
  startSlider();
}

// Dot navigation
heroDots.forEach(dot => {
  dot.addEventListener('click', (e) => {
    e.stopPropagation();
    goToSlide(parseInt(dot.dataset.idx));
    resetSlider();
  });
});

// Click on slide opens article
heroSlides.forEach(slide => {
  slide.addEventListener('click', openArticle);
});

startSlider();

// Pause on hover
const heroSlider = document.getElementById('heroSlider');
heroSlider.addEventListener('mouseenter', () => clearInterval(sliderTimer));
heroSlider.addEventListener('mouseleave', startSlider);

// ─── STATS TABS ───────────────────────────────────────────────────
const stabs        = document.querySelectorAll('.stab');
const stabContents = document.querySelectorAll('.stab-content');

stabs.forEach(stab => {
  stab.addEventListener('click', () => {
    const target = stab.dataset.stab;

    stabs.forEach(s => s.classList.remove('active'));
    stabContents.forEach(c => c.classList.remove('active'));

    stab.classList.add('active');
    document.getElementById('stab-' + target).classList.add('active');
  });
});

// ─── ARTICLE OVERLAY ──────────────────────────────────────────────
const overlay = document.getElementById('articleOverlay');

function openArticle() {
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  overlay.scrollTop = 0;
}

function closeArticle() {
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}

// Close when clicking backdrop
overlay.addEventListener('click', (e) => {
  if (e.target === overlay) closeArticle();
});

// Close on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeArticle();
});

// ─── COMMENT LIKES ────────────────────────────────────────────────
function toggleLike(btn) {
  const countEl = btn.querySelector('.like-count');
  const iconEl  = btn.querySelector('.like-icon');
  const isLiked = btn.classList.toggle('liked');

  let count = parseInt(countEl.textContent);
  countEl.textContent = isLiked ? count + 1 : count - 1;
  iconEl.textContent  = isLiked ? '♥' : '♡';
}

// ─── ADD COMMENT ─────────────────────────────────────────────────
function addComment() {
  const nameInput = document.getElementById('commName');
  const textInput = document.getElementById('commText');
  const list      = document.getElementById('commentsList');
  const countEl   = document.getElementById('commCount');

  const name = nameInput.value.trim() || 'Anónimo';
  const text = textInput.value.trim();

  if (!text) {
    textInput.style.borderColor = 'var(--red)';
    textInput.style.boxShadow   = '0 0 0 2px #e8000d33';
    setTimeout(() => {
      textInput.style.borderColor = '';
      textInput.style.boxShadow   = '';
    }, 1500);
    return;
  }

  // Random avatar
  const avatarId = Math.floor(Math.random() * 70) + 1;

  const commentEl = document.createElement('div');
  commentEl.className = 'comment-item';
  commentEl.style.animation = 'fadeIn .3s ease';
  commentEl.innerHTML = `
    <img src="https://i.pravatar.cc/40?img=${avatarId}" alt="">
    <div class="comment-body">
      <div class="comment-top">
        <strong>${escapeHtml(name)}</strong>
        <span>Agora mesmo</span>
      </div>
      <p>${escapeHtml(text)}</p>
      <button class="like-btn" onclick="toggleLike(this)">
        <span class="like-icon">♡</span>
        <span class="like-count">0</span>
      </button>
    </div>
  `;

  // Prepend new comment
  list.insertBefore(commentEl, list.firstChild);

  // Update count
  countEl.textContent = parseInt(countEl.textContent) + 1;

  // Clear inputs
  nameInput.value = '';
  textInput.value = '';
}

function escapeHtml(str) {
  return str
    .replace(/&/g,  '&amp;')
    .replace(/</g,  '&lt;')
    .replace(/>/g,  '&gt;')
    .replace(/"/g,  '&quot;')
    .replace(/'/g,  '&#039;');
}

// ─── SEARCH BAR ───────────────────────────────────────────────────
const searchInput = document.getElementById('searchInput');

searchInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const q = searchInput.value.trim();
    if (!q) return;

    // Determine target tab based on keyword
    const q_lower = q.toLowerCase();
    let targetTab = 'noticias'; // default

    if (/futebol|football|liga|premier|laliga|champions|benfica|porto|sporting|madrid|barcel/i.test(q_lower)) {
      targetTab = 'futebol';
    } else if (/nba|lakers|celtics|warriors|curry|lebron|basketball/i.test(q_lower)) {
      targetTab = 'nba';
    } else if (/f1|formula|ferrari|redbull|verstappen|hamilton|mclaren/i.test(q_lower)) {
      targetTab = 'f1';
    } else if (/tenis|golf|atletismo|rugby|transfer|rumor/i.test(q_lower)) {
      targetTab = 'rumores';
    }

    // Activate the target tab
    navBtns.forEach(b => {
      b.classList.remove('active');
      if (b.dataset.tab === targetTab) b.classList.add('active');
    });
    tabPages.forEach(p => {
      p.classList.remove('active');
      if (p.id === 'tab-' + targetTab) p.classList.add('active');
    });

    // Flash feedback
    searchInput.style.borderColor = 'var(--red)';
    setTimeout(() => { searchInput.style.borderColor = ''; }, 800);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
});

// ─── GALLERY IMAGE ZOOM (lightweight lightbox) ────────────────────
document.querySelectorAll('.gallery-item img, .article-gallery img').forEach(img => {
  img.addEventListener('click', () => {
    const lightbox = document.createElement('div');
    lightbox.style.cssText = `
      position:fixed; inset:0; z-index:9999;
      background:rgba(0,0,0,.92);
      display:flex; align-items:center; justify-content:center;
      cursor:zoom-out; animation: fadeIn .2s ease;
    `;
    const imgEl = document.createElement('img');
    imgEl.src = img.src.replace('w=600', 'w=1200').replace('w=400', 'w=1200');
    imgEl.style.cssText = `max-width:90vw; max-height:88vh; border-radius:8px; box-shadow:0 8px 48px #000a;`;
    lightbox.appendChild(imgEl);
    lightbox.addEventListener('click', () => lightbox.remove());
    document.body.appendChild(lightbox);
  });
})