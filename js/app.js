// ═══════════════════════════════════════════
// ENDFIELD-STYLE PAGE TRANSITION
// ═══════════════════════════════════════════
function runPageTransition(callback) {
  const overlay = document.getElementById('pageTransition');
  overlay.classList.add('active');

  setTimeout(() => {
    if (callback) callback();
    overlay.classList.add('exit');
    setTimeout(() => {
      overlay.classList.remove('active', 'exit');
    }, 900);
  }, 700);
}

// ═══════════════════════════════════════════
// LOADING SCREEN (BUG-FIXED FOR MULTI-TAB)
// ═══════════════════════════════════════════
let loadPct = 0;
const loadStatuses = ["INITIALIZING...", "CONNECTING TO PROXY...", "SYNCING DATABASE...", "VERIFYING INTEGRITY...", "ACCESS GRANTED"];
let loadStatusIdx = 0;

function updateLoadStatus() {
  if (loadStatusIdx < loadStatuses.length) {
    document.getElementById('loadStatus').textContent = loadStatuses[loadStatusIdx];
    loadStatusIdx++;
  }
}

const loadInterval = setInterval(() => {
  loadPct += Math.floor(Math.random() * 12) + 3;
  if (loadPct >= 100) { loadPct = 100; clearInterval(loadInterval); }
  document.getElementById('loadPercent').textContent = loadPct + '%';
  if (loadPct > 20 && loadStatusIdx === 0) updateLoadStatus();
  if (loadPct > 45 && loadStatusIdx === 1) updateLoadStatus();
  if (loadPct > 70 && loadStatusIdx === 2) updateLoadStatus();
  if (loadPct > 90 && loadStatusIdx === 3) updateLoadStatus();
}, 100);

// BUG FIX: Handle case where page is already loaded (cached/second tab)
function finishLoading() {
  clearInterval(loadInterval);
  document.getElementById('loadPercent').textContent = '100%';
  document.getElementById('loadStatus').textContent = 'ACCESS GRANTED';
  setTimeout(() => {
    document.getElementById('loading-screen').classList.add('fade-out');
    initScrollReveal();
    startTypewriter();
  }, 800);
}

if (document.readyState === 'complete') {
  // Page already loaded (cached/second tab scenario)
  setTimeout(finishLoading, 500);
} else {
  window.addEventListener('load', () => {
    setTimeout(finishLoading, 1200);
  });
}

// ═══════════════════════════════════════════
// DIGITAL RAIN CANVAS
// ═══════════════════════════════════════════
const rainCanvas = document.getElementById('digitalRain');
const rainCtx = rainCanvas.getContext('2d');
let rainCols, rainDrops;
const rainChars = "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";

function initRain() {
  rainCanvas.width = window.innerWidth;
  rainCanvas.height = window.innerHeight;
  rainCols = Math.floor(rainCanvas.width / 14);
  rainDrops = [];
  for (let i = 0; i < rainCols; i++) {
    rainDrops[i] = Math.random() * -100;
  }
}
initRain();

function drawRain() {
  rainCtx.fillStyle = 'rgba(5, 6, 8, 0.08)';
  rainCtx.fillRect(0, 0, rainCanvas.width, rainCanvas.height);
  for (let i = 0; i < rainDrops.length; i++) {
    const text = rainChars[Math.floor(Math.random() * rainChars.length)];
    const x = i * 14;
    const y = rainDrops[i] * 14;
    const isHead = Math.random() > 0.95;
    rainCtx.font = '12px "JetBrains Mono", monospace';
    rainCtx.fillStyle = isHead ? '#00f0ff' : (Math.random() > 0.5 ? 'rgba(0, 240, 255, 0.3)' : 'rgba(255, 183, 3, 0.2)');
    rainCtx.fillText(text, x, y);
    if (y > rainCanvas.height && Math.random() > 0.975) {
      rainDrops[i] = 0;
    }
    rainDrops[i]++;
  }
  requestAnimationFrame(drawRain);
}
drawRain();
window.addEventListener('resize', initRain);

// ═══════════════════════════════════════════
// TYPEWRITER EFFECT
// ═══════════════════════════════════════════
const typeText = "SECURE PROXY DATABASE // ALL NODES SYNCHRONIZED";
let typeIdx = 0;
const typeEl = document.getElementById('typewriterText');

function startTypewriter() {
  if (typeIdx < typeText.length) {
    typeEl.textContent += typeText.charAt(typeIdx);
    typeIdx++;
    setTimeout(startTypewriter, 40 + Math.random() * 60);
  } else {
    typeEl.innerHTML = typeText + '<span class="cursor-blink">|</span>';
  }
}

// ═══════════════════════════════════════════
// HERO SLIDESHOW
// ═══════════════════════════════════════════
const slides = document.querySelectorAll('.hero-bg');
let currentSlide = 0;
setInterval(() => {
  slides[currentSlide].classList.remove('active');
  currentSlide = (currentSlide + 1) % slides.length;
  slides[currentSlide].classList.add('active');
}, 6000);



// ═══════════════════════════════════════════
// SCROLL & NAV STATE
// ═══════════════════════════════════════════
const topTaskbar = document.getElementById('topTaskbar');
const socialDock = document.getElementById('socialDock');
const heroSection = document.getElementById('heroSection');
const heroAccessBtn = document.getElementById('heroAccessBtn');
const catSidebar = document.getElementById('catSidebar');

function updateNavState() {
  const scrollY = window.scrollY;
  const inCategory = document.body.classList.contains('in-category');
  const inDrawer = document.body.classList.contains('in-drawer');
  const isScrolled = scrollY > 80 || inCategory || inDrawer;
  topTaskbar.classList.toggle('visible', isScrolled);
  socialDock.classList.toggle('hidden', !isScrolled && !inCategory);
  heroAccessBtn.style.opacity = scrollY > 100 ? '0' : '1';
  heroAccessBtn.style.pointerEvents = scrollY > 100 ? 'none' : 'all';
}

window.addEventListener('scroll', updateNavState, { passive: true });

// Smooth scroll
function smoothScrollTo(targetY, duration = 800) {
  const startY = window.scrollY;
  const diff = targetY - startY;
  let startTime = null;
  function step(t) {
    if (!startTime) startTime = t;
    const p = Math.min((t - startTime) / duration, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    window.scrollTo(0, startY + diff * ease);
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function scrollToContent() {
  smoothScrollTo(document.getElementById('mainContent').offsetTop - 20);
}

// Wheel snap
let wheelLock = false;
window.addEventListener('wheel', (e) => {
  if (window.scrollY < 50 && e.deltaY > 30 && !wheelLock && !document.body.classList.contains('in-category')) {
    wheelLock = true;
    e.preventDefault();
    scrollToContent();
    setTimeout(() => wheelLock = false, 1200);
  }
}, { passive: false });

// ═══════════════════════════════════════════
// VIEW SYSTEM
// ═══════════════════════════════════════════
function switchView(viewId) {
  document.querySelectorAll('.view-section').forEach(v => v.classList.remove('active'));
  const target = document.getElementById(viewId);
  target.classList.add('active');
  target.querySelectorAll('.reveal').forEach(el => {
    el.classList.remove('visible');
    setTimeout(() => el.classList.add('visible'), 100);
  });
}

function openCategory(cat) {
  runPageTransition(() => {
    document.body.classList.add('in-category');
    heroSection.classList.add('shrink');
    catSidebar.classList.add('active');
    document.querySelectorAll('.cat-item').forEach(item => {
      item.classList.toggle('active', item.dataset.cat === cat);
    });
    const items = database.filter(d => d.category === cat);
    const grid = document.getElementById('galleryGrid');
    grid.innerHTML = items.map((item, i) => `
      <div class="card-wrapper reveal" onclick="openDetail('${item.title}', '${item.meta}', '${item.desc.replace(/'/g, "\'")}', '${item.image}')" style="transition-delay: ${i * 0.1}s">
        <div class="card">
          <img class="card-img" src="${item.image}" alt="${item.title}">
          <div class="card-info">
            <div class="card-meta">${item.meta}</div>
            <h3 class="card-title">${item.title}</h3>
          </div>
        </div>
      </div>
    `).join('');
    document.getElementById('galleryTitle').innerHTML = categoryNames[cat] + ' <span class="arrow-group">➔ ➔</span>';
    switchView('view-gallery');
    smoothScrollTo(document.getElementById('mainContent').offsetTop - 20);
    updateNavState();

    setTimeout(() => {
      document.querySelectorAll('#view-gallery .reveal').forEach((el, i) => {
        setTimeout(() => el.classList.add('visible'), i * 100);
      });
      // Re-attach tilt to new gallery cards
      document.querySelectorAll('#view-gallery .card-wrapper').forEach(wrapper => {
        const card = wrapper.querySelector('.card');
        if (!card) return;
  
      });
    }, 50);
  });
}

function goHome() {
  runPageTransition(() => {
    document.body.classList.remove('in-category');
    heroSection.classList.remove('shrink');
    catSidebar.classList.remove('active');
    document.querySelectorAll('.cat-item').forEach(item => item.classList.remove('active'));
    switchView('view-lobby');
    smoothScrollTo(0);
    setTimeout(updateNavState, 100);
  });
}

// ═══════════════════════════════════════════
// DRAWER
// ═══════════════════════════════════════════
function openDrawer(type) {
  document.body.classList.add('in-drawer');
  const overlay = document.getElementById('drawerOverlay');
  document.querySelectorAll('.drawer-section').forEach(s => s.classList.remove('active'));
  document.getElementById('drawer-' + type).classList.add('active');
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
  updateNavState();
}

function closeDrawer(e) {
  if (e.target.id === 'drawerOverlay') closeDrawerDirect();
}

function closeDrawerDirect() {
  document.body.classList.remove('in-drawer');
  document.getElementById('drawerOverlay').classList.remove('active');
  document.body.style.overflow = '';
  updateNavState();
}

// ═══════════════════════════════════════════
// DETAIL MODAL
// ═══════════════════════════════════════════
function openDetail(title, meta, desc, img) {
  document.getElementById('detailTitle').textContent = title;
  document.getElementById('detailMeta').textContent = meta;
  document.getElementById('detailDesc').textContent = desc;
  document.getElementById('detailImg').src = img;
  document.getElementById('detailModal').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeDetail(e) {
  if (e.target.id === 'detailModal') closeDetailDirect();
}

function closeDetailDirect() {
  document.getElementById('detailModal').classList.remove('active');
  document.body.style.overflow = '';
}

// ═══════════════════════════════════════════
// MOBILE MENU
// ═══════════════════════════════════════════
function toggleMobileMenu() {
  document.getElementById('mobileMenu').classList.toggle('active');
}


// ═══════════════════════════════════════════
// SCROLL REVEAL
// ═══════════════════════════════════════════
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}


// ═══════════════════════════════════════════
// KEYBOARD NAV
// ═══════════════════════════════════════════
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeDrawerDirect();
    closeDetailDirect();
  }
});

// ═══════════════════════════════════════════
// GLITCH ACTIVATION ON INTERVAL
// ═══════════════════════════════════════════
setInterval(() => {
  document.querySelectorAll('.glitch-text').forEach(el => {
    el.classList.add('active');
    setTimeout(() => el.classList.remove('active'), 400);
  });
}, 8000);
