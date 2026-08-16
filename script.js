
// ===== LOADING SCREEN =====
window.addEventListener('load', () => {
    const loadingScreen = document.getElementById('loading-screen');
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
        setTimeout(() => { loadingScreen.style.display = 'none'; }, 700);
    }, 1100);
});

// ===== CURSOR GLOW FOLLOWER =====
const cursorGlow = document.getElementById('cursor-glow');
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let glowX  = mouseX;
let glowY  = mouseY;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// Smooth lag-follow for the glow
(function animateGlow() {
    glowX += (mouseX - glowX) * 0.08;
    glowY += (mouseY - glowY) * 0.08;
    cursorGlow.style.left = glowX + 'px';
    cursorGlow.style.top  = glowY + 'px';
    requestAnimationFrame(animateGlow);
})();

// ===== FLOATING BACKGROUND PARTICLES =====
function createFloatingParticles() {
    const defaultColors = [
        'rgba(78,205,196,0.3)', 'rgba(143,227,219,0.22)',
        'rgba(44,154,145,0.24)'
    ];
    const sizes = [2, 2, 3, 3, 4];
    const container = document.querySelector('.aurora-bg');

    for (let i = 0; i < 12; i++) {
        const dot   = document.createElement('div');
        dot.className = 'float-dot';
        const size  = sizes[Math.floor(Math.random() * sizes.length)];
        const color = defaultColors[Math.floor(Math.random() * defaultColors.length)];
        dot.style.cssText = `
            width: ${size}px; height: ${size}px;
            left: ${Math.random() * 100}%;
            background: ${color};
            box-shadow: 0 0 ${size * 2}px ${color};
            animation-duration: ${18 + Math.random() * 24}s;
            animation-delay: ${-Math.random() * 24}s;
        `;
        container.appendChild(dot);
    }
}
createFloatingParticles();

// ===== UPDATE PARTICLE COLORS ON THEME CHANGE =====
function updateParticleColors(isPlaying) {
    const dots = document.querySelectorAll('.float-dot');
    const playingColors = [
        'rgba(167,139,250,0.32)', 'rgba(211,194,255,0.22)',
        'rgba(111,83,204,0.24)'
    ];
    const defaultColors = [
        'rgba(78,205,196,0.3)', 'rgba(143,227,219,0.22)',
        'rgba(44,154,145,0.24)'
    ];
    const colors = isPlaying ? playingColors : defaultColors;
    dots.forEach(dot => {
        const color = colors[Math.floor(Math.random() * colors.length)];
        dot.style.background  = color;
        dot.style.boxShadow   = `0 0 6px ${color}`;
    });
}

// ===== THEME CHANGE RADIAL RIPPLE =====
function fireThemeRipple(toPlaying) {
    const overlay = document.getElementById('theme-overlay');
    // Start from center of screen
    overlay.style.background = toPlaying
        ? 'radial-gradient(circle, rgba(167,139,250,0.16) 0%, rgba(211,194,255,0.08) 35%, transparent 65%)'
        : 'radial-gradient(circle, rgba(78,205,196,0.14) 0%, rgba(143,227,219,0.07) 35%, transparent 65%)';
    overlay.classList.remove('expanding');
    // Force reflow so the animation restarts cleanly
    void overlay.offsetWidth;
    overlay.classList.add('expanding');
    overlay.addEventListener('animationend', () => {
        overlay.classList.remove('expanding');
    }, { once: true });
}

// ===== PAGE NAVIGATION =====
const pages = {
    landing:   document.getElementById('landing-page'),
    about:     document.getElementById('about-page'),
    services:  document.getElementById('services-page'),
    games:     document.getElementById('games-page'),
    favorites: document.getElementById('favorites-page'),
    social:    document.getElementById('social-page')
};

let currentPage = 'landing';

function navigateTo(pageName, originX, originY) {
    if (pageName === currentPage || !pages[pageName]) return;
    const currentPageEl = pages[currentPage];
    const nextPageEl    = pages[pageName];

    const vx = originX != null ? (originX / window.innerWidth) * 100 : 50;
    const vy = originY != null ? (originY / window.innerHeight) * 100 : 50;
    nextPageEl.style.setProperty('--wipe-x', vx + '%');
    nextPageEl.style.setProperty('--wipe-y', vy + '%');

    currentPageEl.classList.add('slide-out');
    setTimeout(() => {
        currentPageEl.classList.remove('active', 'slide-out');
        currentPageEl.style.display = 'none';
        nextPageEl.style.display    = 'flex';
        nextPageEl.classList.add('active');
        currentPage = pageName;
        updateMusicPlayerState();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        const pageTitles = {
            landing:   'Home | Md. Mursalin',
            about:     'About | Md. Mursalin',
            services:  'Services | Md. Mursalin',
            games:     'Games | Md. Mursalin',
            favorites: 'Favorites | Md. Mursalin',
            social:    'Social | Md. Mursalin'
        };
        if (typeof gtag === 'function') {
            gtag('event', 'page_view', {
                page_path:  '/' + (pageName === 'landing' ? '' : pageName),
                page_title: pageTitles[pageName] || pageName
            });
        }
    }, 300);
}

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        createCrystalBurst(e.clientX, e.clientY);
        createClickRipple(e.clientX, e.clientY);
        setTimeout(() => navigateTo(link.getAttribute('data-page'), e.clientX, e.clientY), 90);
    });
});

document.querySelectorAll('.back-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        createCrystalBurst(e.clientX, e.clientY);
        createClickRipple(e.clientX, e.clientY);
        setTimeout(() => navigateTo('landing', e.clientX, e.clientY), 90);
    });
});

document.querySelectorAll('.services-cta-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        createCrystalBurst(e.clientX, e.clientY);
        createClickRipple(e.clientX, e.clientY);
        setTimeout(() => navigateTo(btn.getAttribute('data-page'), e.clientX, e.clientY), 90);
    });
});

// ===== CLICK RIPPLE (double ring pulse at cursor) =====
function createClickRipple(x, y) {
    const container = document.getElementById('particle-container');

    const flash = document.createElement('div');
    flash.className = 'click-flash';
    flash.style.left = x + 'px';
    flash.style.top  = y + 'px';
    container.appendChild(flash);
    setTimeout(() => flash.remove(), 420);

    const inner = document.createElement('div');
    inner.className = 'click-ripple';
    inner.style.left = x + 'px';
    inner.style.top  = y + 'px';
    container.appendChild(inner);
    setTimeout(() => inner.remove(), 700);

    const outer = document.createElement('div');
    outer.className = 'click-ripple ripple-outer';
    outer.style.left = x + 'px';
    outer.style.top  = y + 'px';
    container.appendChild(outer);
    setTimeout(() => outer.remove(), 900);
}

// ===== CRYSTAL BURST PARTICLES — quiet, precise, with a bit of trail =====
function createCrystalBurst(x, y) {
    const container = document.getElementById('particle-container');
    const isPlaying = document.body.classList.contains('music-playing');
    const colors    = isPlaying
        ? ['#A78BFA', '#D3C2FF', '#6F53CC']
        : ['#4ECDC4', '#8FE3DB', '#2C9A91'];
    const count = 9;

    for (let i = 0; i < count; i++) {
        const p      = document.createElement('div');
        p.className  = 'particle';
        const angle  = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.35;
        const vel    = 30 + Math.random() * 30;
        const tx     = Math.cos(angle) * vel;
        const ty     = Math.sin(angle) * vel;
        const color  = colors[Math.floor(Math.random() * colors.length)];
        const size   = 3 + Math.random() * 2.5;
        const delay  = Math.random() * 40;
        p.style.cssText = `
            left: ${x}px; top: ${y}px;
            width: ${size}px; height: ${size}px;
            background: ${color};
            box-shadow: 0 0 ${size * 2}px ${color};
            --tx: ${tx}px; --ty: ${ty}px;
            animation-delay: ${delay}ms;
        `;
        container.appendChild(p);
        setTimeout(() => p.remove(), 800);
    }
}

// ===== MUSIC PLAYER =====
const tracks = [
    { title: 'Parano',         artist: 'Frozy',           src: 'paranoid.mp3'    },
    { title: 'No Friends',     artist: 'Cadmium',         src: 'no-friends.mp3'  },
    { title: 'Dead to Me',     artist: 'Fraxo & Whales',  src: 'dead-to-me.mp3'  },
    { title: 'Dream Lantern',  artist: 'RADWIMPS',        src: 'ocean-breeze.mp3' },
    { title: 'Shinunoga E-Wa', artist: 'Fujii Kaze',      src: 'shinunoga.mp3'   },
];

let currentTrackIndex = 0;
let isPlaying         = false;

const musicControlBtn     = document.getElementById('music-control-btn');
const audio               = document.getElementById('background-music');
const playIcon            = musicControlBtn.querySelector('.play-icon');
const pauseIcon           = musicControlBtn.querySelector('.pause-icon');
const floatingMusicPlayer = document.getElementById('floating-music-player');
const musicText           = document.getElementById('music-text');
const musicArtist         = document.getElementById('music-artist');
const prevBtn             = document.getElementById('prev-btn');
const nextBtn             = document.getElementById('next-btn');
const playlistToggleBtn   = document.getElementById('playlist-toggle-btn');
const playlistPanel       = document.getElementById('music-playlist-panel');
const playlistCloseBtn    = document.getElementById('playlist-close-btn');
const playlistItemsEl     = document.getElementById('playlist-items');

// ===== PLAYLIST =====
function buildPlaylist() {
    playlistItemsEl.innerHTML = '';
    tracks.forEach((track, i) => {
        const item = document.createElement('div');
        item.className   = 'playlist-item' + (i === currentTrackIndex ? ' active' : '');
        item.dataset.index = i;
        item.innerHTML   = `
            <span class="playlist-num">${i + 1}</span>
            <span class="playlist-playing-icon">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="8"/></svg>
            </span>
            <div class="playlist-track-info">
                <div class="playlist-title">${track.title}</div>
                <div class="playlist-artist-label">${track.artist}</div>
            </div>`;
        item.addEventListener('click', () => loadTrack(i, true));
        playlistItemsEl.appendChild(item);
    });
}

function updatePlaylistActive() {
    playlistItemsEl.querySelectorAll('.playlist-item').forEach((item, i) => {
        item.classList.toggle('active', i === currentTrackIndex);
    });
}

function loadTrack(index, autoPlay = false) {
    currentTrackIndex       = index;
    const track             = tracks[currentTrackIndex];
    audio.src               = track.src;
    musicText.textContent   = track.title;
    musicArtist.textContent = track.artist;
    updatePlaylistActive();
    if (autoPlay || isPlaying) playMusic();
}

// ===== PROFILE PHOTO CROSS-FADE SWAP =====
const pfpFront  = document.getElementById('pfp-front');
const pfpBack   = document.getElementById('pfp-back');
const pfpShimmer = document.getElementById('pfp-shimmer');
const pfpScan   = document.getElementById('pfp-scan');
const pfpBurstRing = document.getElementById('pfp-burst-ring');
const profilePictureEl = document.querySelector('.profile-picture');
let swapBusy = false;

function swapPhoto(toPlaying) {
    if (swapBusy) return;
    swapBusy = true;

    // Decide which src goes on which layer
    const nextSrc = toPlaying ? 'pfp2.png' : 'pfp.png';

    // Preload the incoming image silently
    const preloader = new Image();
    preloader.onload = () => doSwap(nextSrc);
    preloader.onerror = () => doSwap(nextSrc); // proceed anyway if missing
    preloader.src = nextSrc;
}

function doSwap(nextSrc) {
    // Set incoming image on the back layer (hidden)
    pfpBack.src = nextSrc;
    pfpBack.style.zIndex = 1;
    pfpFront.style.zIndex = 2;

    // Signal-glitch flicker + expanding burst ring, fired at the instant of swap
    profilePictureEl.classList.remove('glitching');
    pfpBurstRing.classList.remove('bursting');
    pfpScan.classList.remove('sweeping');
    void profilePictureEl.offsetWidth;
    profilePictureEl.classList.add('glitching');
    pfpBurstRing.classList.add('bursting');
    pfpScan.classList.add('sweeping');

    // Fire shimmer flash
    pfpShimmer.classList.remove('active');
    void pfpShimmer.offsetWidth;
    pfpShimmer.classList.add('active');

    // Begin cross-fade: front fades out, back wipes in top-to-bottom
    pfpFront.classList.add('fading-out');
    pfpBack.classList.add('fading-in');

    // After transition completes, swap the roles cleanly
    setTimeout(() => {
        // The back is now visually on top — make it the new "front"
        pfpFront.src         = nextSrc;
        pfpFront.style.opacity = '1';
        pfpFront.style.transform = 'scale(1)';
        pfpFront.style.filter = 'none';
        pfpFront.classList.remove('fading-out');

        pfpBack.classList.remove('fading-in');
        pfpBack.style.opacity  = '0';
        pfpBack.style.transform = 'scale(1.06)';
        pfpBack.style.clipPath = 'inset(0 0 100% 0)';

        pfpShimmer.classList.remove('active');
        profilePictureEl.classList.remove('glitching');
        pfpBurstRing.classList.remove('bursting');
        pfpScan.classList.remove('sweeping');
        swapBusy = false;
    }, 850);
}

// ===== PLAY / PAUSE =====
function playMusic(onSuccess) {
    const promise = audio.play();
    if (promise !== undefined) {
        promise.then(() => {
            isPlaying = true;
            playIcon.classList.add('hidden');
            pauseIcon.classList.remove('hidden');
            document.body.classList.add('music-playing');
            floatingMusicPlayer.classList.add('playing');
            const t = tracks[currentTrackIndex];
            musicText.textContent   = t.title;
            musicArtist.textContent = t.artist;
            updateMusicPlayerState();
            updateParticleColors(true);
            if (onSuccess) onSuccess();
        }).catch(err => console.log('Playback requires interaction:', err));
    }
}

function pauseMusic() {
    audio.pause();
    isPlaying = false;
    playIcon.classList.remove('hidden');
    pauseIcon.classList.add('hidden');
    document.body.classList.remove('music-playing');
    floatingMusicPlayer.classList.remove('playing');
    updateMusicPlayerState();
    updateParticleColors(false);
}

function nextTrack() {
    const ni = (currentTrackIndex + 1) % tracks.length;
    loadTrack(ni, isPlaying);
    const r  = nextBtn.getBoundingClientRect();
    createCrystalBurst(r.left + r.width / 2, r.top + r.height / 2);
    createClickRipple(r.left + r.width / 2, r.top + r.height / 2);
}

function prevTrack() {
    if (audio.currentTime > 3) {
        audio.currentTime = 0;
        if (isPlaying) audio.play();
    } else {
        const pi = (currentTrackIndex - 1 + tracks.length) % tracks.length;
        loadTrack(pi, isPlaying);
    }
    const r = prevBtn.getBoundingClientRect();
    createCrystalBurst(r.left + r.width / 2, r.top + r.height / 2);
    createClickRipple(r.left + r.width / 2, r.top + r.height / 2);
}

function updateMusicPlayerState() {
    if (currentPage === 'landing') {
        floatingMusicPlayer.classList.remove('compact', 'hidden');
    } else {
        if (isPlaying) {
            floatingMusicPlayer.classList.add('compact');
            floatingMusicPlayer.classList.remove('hidden');
        } else {
            floatingMusicPlayer.classList.add('hidden');
            closePlaylist();
        }
    }
}

// ===== PLAYLIST PANEL =====
function openPlaylist() {
    buildPlaylist();
    playlistPanel.classList.add('open');
    playlistToggleBtn.classList.add('active');
}

function closePlaylist() {
    playlistPanel.classList.remove('open');
    playlistToggleBtn.classList.remove('active');
}

function togglePlaylist() {
    playlistPanel.classList.contains('open') ? closePlaylist() : openPlaylist();
}

// Auto-advance when track ends
audio.addEventListener('ended', nextTrack);

// Skip unloadable tracks gracefully
audio.addEventListener('error', () => {
    if (tracks.length > 1) {
        const ni = (currentTrackIndex + 1) % tracks.length;
        if (ni !== currentTrackIndex) loadTrack(ni, isPlaying);
    }
});

// ===== MUSIC CONTROL BUTTON =====
musicControlBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    createCrystalBurst(e.clientX, e.clientY);
    createClickRipple(e.clientX, e.clientY);
    if (isPlaying) {
        fireThemeRipple(false);
        pauseMusic();
        swapPhoto(false);
    } else {
        fireThemeRipple(true);
        playMusic(() => swapPhoto(true));
    }
});

prevBtn.addEventListener('click', (e) => { e.stopPropagation(); prevTrack(); });
nextBtn.addEventListener('click', (e) => { e.stopPropagation(); nextTrack(); });

playlistToggleBtn.addEventListener('click', (e) => { e.stopPropagation(); togglePlaylist(); });
playlistCloseBtn.addEventListener('click',  (e) => { e.stopPropagation(); closePlaylist(); });

document.addEventListener('click', (e) => {
    if (!floatingMusicPlayer.contains(e.target)) closePlaylist();
});

// Init first track display
audio.src              = tracks[0].src;
musicText.textContent  = 'Click to play';

// ===== INTERACTIVE PROFILE RINGS =====
const pfpContainer = document.getElementById('pfp-container');

pfpContainer.addEventListener('click', (e) => {
    createCrystalBurst(e.clientX, e.clientY);
    createClickRipple(e.clientX, e.clientY);
    const rings = pfpContainer.querySelectorAll('.orbit-ring');
    rings.forEach((r, idx) => {
        setTimeout(() => {
            r.style.transition = 'all 0.25s ease';
            r.style.opacity    = '0.3';
            setTimeout(() => { r.style.opacity = ''; r.style.transition = ''; }, 250);
        }, idx * 40);
    });
});

// ===== PERFORMANCE HELPER: rAF-throttle a mousemove handler =====
// Collapses rapid-fire mousemove events down to one DOM write per frame.
function rafThrottle(fn) {
    let ticking = false;
    let lastEvent = null;
    return function (e) {
        lastEvent = e;
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            fn(lastEvent);
            ticking = false;
        });
    };
}

// Magnetic parallax on profile picture
const pfpPic   = pfpContainer.querySelector('.profile-picture');
const pfpRings = pfpContainer.querySelectorAll('.orbit-ring');
pfpContainer.addEventListener('mousemove', rafThrottle((e) => {
    const rect = pfpContainer.getBoundingClientRect();
    const cx   = rect.left + rect.width  / 2;
    const cy   = rect.top  + rect.height / 2;
    const dx   = (e.clientX - cx) / rect.width;
    const dy   = (e.clientY - cy) / rect.height;
    // Picture moves gently with cursor
    pfpPic.style.transform = `translate(calc(-50% + ${dx * 4}px), calc(-50% + ${dy * 4}px))`;
    // Rings move in opposite / reduced directions for depth
    pfpRings.forEach((r, i) => {
        const factor = (i + 1) * 0.9;
        r.style.marginLeft = `${-dx * factor}px`;
        r.style.marginTop  = `${-dy * factor}px`;
    });
}));

pfpContainer.addEventListener('mouseleave', () => {
    pfpPic.style.transform = 'translate(-50%, -50%)';
    pfpRings.forEach(r => {
        r.style.marginLeft = '';
        r.style.marginTop  = '';
    });
});

// ===== MAGNETIC HOVER ON NAV LINKS =====
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('mousemove', rafThrottle((e) => {
        const rect = link.getBoundingClientRect();
        const dx = (e.clientX - rect.left - rect.width  / 2) / rect.width;
        const dy = (e.clientY - rect.top  - rect.height / 2) / rect.height;
        link.style.transform = `translateY(-3px) translate(${dx * 3}px, ${dy * 2}px)`;
    }));
    link.addEventListener('mouseleave', () => {
        link.style.transform = '';
    });
});

// ===== CARD 3D TILT =====
document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mousemove', rafThrottle(function(e) {
        const rect = card.getBoundingClientRect();
        const x    = e.clientX - rect.left;
        const y    = e.clientY - rect.top;
        const cx   = rect.width  / 2;
        const cy   = rect.height / 2;
        const rotX = (y - cy) / 34;
        const rotY = (cx - x) / 34;
        card.style.transform = `translateY(-5px) perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    }));

    card.addEventListener('mouseleave', function() {
        this.style.transform = '';
    });

    card.addEventListener('click', (e) => {
        createCrystalBurst(e.clientX, e.clientY);
        createClickRipple(e.clientX, e.clientY);
    });
});


// ===== SOCIAL LINKS =====
document.querySelectorAll('.social-link').forEach(el => {
    el.addEventListener('click', (e) => {
        const rect = el.getBoundingClientRect();
        createCrystalBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);
        createClickRipple(rect.left + rect.width / 2, rect.top + rect.height / 2);
    });
});

// ===== KEYBOARD SHORTCUTS =====
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && currentPage !== 'landing') navigateTo('landing');
    if (e.key === ' ' && e.target.tagName !== 'BUTTON' && e.target.tagName !== 'INPUT') {
        e.preventDefault();
        if (isPlaying) {
            fireThemeRipple(false);
            pauseMusic();
            swapPhoto(false);
        } else {
            fireThemeRipple(true);
            playMusic(() => swapPhoto(true));
        }
    }
});

// ===== TOUCH FEEDBACK =====
document.querySelectorAll('button, a, .card, .service-card').forEach(el => {
    let t;
    el.addEventListener('touchstart', function() {
        t = setTimeout(() => { this.style.transform = 'scale(0.96)'; }, 80);
    }, { passive: true });
    el.addEventListener('touchend',    function() { clearTimeout(t); this.style.transform = ''; });
    el.addEventListener('touchcancel', function() { clearTimeout(t); this.style.transform = ''; });
});

// ===== STAGGERED CARD ENTRANCE =====
function staggerCards(selector) {
    document.querySelectorAll(selector).forEach((el, i) => {
        el.style.opacity   = '0';
        el.style.transform = 'translateY(22px)';
        el.style.transition = 'none';
        setTimeout(() => {
            el.style.transition = `opacity 0.55s ease, transform 0.55s cubic-bezier(0.22,1,0.36,1)`;
            el.style.opacity    = '1';
            el.style.transform  = 'translateY(0)';
        }, 80 + i * 80);
    });
}

// Re-run stagger when pages become active
const pageObserver = new MutationObserver((mutations) => {
    mutations.forEach(({ target }) => {
        if (target.classList.contains('active')) {
            staggerCards('#' + target.id + ' .card');
            staggerCards('#' + target.id + ' .about-card');
            staggerCards('#' + target.id + ' .social-link');
            staggerCards('#' + target.id + ' .service-card');
        }
    });
});
Object.values(pages).forEach(p => {
    pageObserver.observe(p, { attributes: true, attributeFilter: ['class'] });
});

updateMusicPlayerState();

// ===== NAME DECODE INTRO — characters scramble in before settling =====
(function decodeNameIntro() {
    const nameEl = document.querySelector('.animated-name');
    if (!nameEl) return;
    const aliasEl = nameEl.querySelector('.name-alias');
    const aliasHTML = aliasEl ? aliasEl.outerHTML : '';
    const finalText = 'Md. Mursalin';
    const glyphs = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#$%&01';

    nameEl.setAttribute('aria-label', finalText);
    let frame = 0;
    const totalFrames = 20;

    const timer = setInterval(() => {
        let out = '';
        for (let i = 0; i < finalText.length; i++) {
            const ch = finalText[i];
            if (ch === ' ' || ch === '.') { out += ch; continue; }
            const lockFrame = 8 + i * 1.1;
            out += frame >= lockFrame ? ch : glyphs[Math.floor(Math.random() * glyphs.length)];
        }
        nameEl.innerHTML = out + aliasHTML;
        frame++;
        if (frame > totalFrames) {
            nameEl.innerHTML = finalText + aliasHTML;
            clearInterval(timer);
        }
    }, 45);
})();

// ===== CARD SPOTLIGHT — cursor-follow glow on cards/rows =====
document.querySelectorAll('.card, .about-card, .social-link, .service-card').forEach(el => {
    el.addEventListener('mousemove', rafThrottle((e) => {
        const rect = el.getBoundingClientRect();
        el.style.setProperty('--spot-x', ((e.clientX - rect.left) / rect.width) * 100 + '%');
        el.style.setProperty('--spot-y', ((e.clientY - rect.top) / rect.height) * 100 + '%');
    }));
});

console.log('Md. Mursalin — Portfolio loaded');
