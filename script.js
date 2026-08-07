// ==================== BARRE DE PROGRESSION (SIGNAL) ====================
const signalBar = document.getElementById('signal-bar');
const navbarEl = document.querySelector('.navbar');

function updateSignalBar() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (signalBar) {
        signalBar.style.width = progress + '%';
    }
    if (navbarEl) {
        navbarEl.classList.toggle('scrolled', scrollTop > 12);
    }
}

window.addEventListener('scroll', updateSignalBar, { passive: true });
updateSignalBar();

// ==================== LIEN DE NAVIGATION ACTIF ====================
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
const trackedSections = Array.from(navAnchors)
    .map(a => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

if (trackedSections.length) {
    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navAnchors.forEach(a => {
                    a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
                });
            }
        });
    }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });

    trackedSections.forEach(section => navObserver.observe(section));
}

// ==================== MENU MOBILE ====================
const menuToggle = document.getElementById('mobile-menu');
const navLinks = document.getElementById('nav-links');
if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
            navLinks.classList.remove('active');
        }
    });
});

// ==================== INTERSECTION OBSERVER (ANIMATIONS AU SCROLL) ====================
const observerOptions = {
    threshold: 0.15
};
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);
document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
});

// ==================== PHOTO DE PROFIL ====================
const profilePhoto = document.getElementById('profile-photo');
const avatarCircle = document.querySelector('.avatar-circle');
if (profilePhoto) {
    profilePhoto.src = 'profil.jpg';
    profilePhoto.onload = () => {
        avatarCircle.classList.add('has-photo');
    };
    profilePhoto.onerror = () => {
        avatarCircle.classList.remove('has-photo');
    };
}

// ==================== HASH DE COMMIT (TIMELINE) ====================
function hashFromText(text) {
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
        hash = (hash << 5) - hash + text.charCodeAt(i);
        hash |= 0;
    }
    return Math.abs(hash).toString(16).padStart(7, '0').slice(0, 7);
}

document.querySelectorAll('.timeline-item').forEach(item => {
    const title = item.querySelector('h3');
    const hashSpan = item.querySelector('.commit-hash');
    if (title && hashSpan) {
        hashSpan.textContent = hashFromText(title.textContent.trim());
    }
});

// ==================== TERMINAL HERO (EFFET DE FRAPPE) ====================
const terminalLinesEl = document.getElementById('terminal-lines');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Chaque entrée : une ligne de commande (prompt) suivie de lignes de sortie (out/accent)
const terminalScript = [
    { type: 'prompt', text: 'whoami' },
    { type: 'out', text: 'LANJAMIARANTSOA Edson Landry' },
    { type: 'prompt', text: 'cat role.txt' },
    { type: 'out', text: 'Étudiant L3 Informatique — EMIT' },
    { type: 'accent', text: 'Développeur Full-Stack & Réseaux' },
    { type: 'prompt', text: 'ls competences/' },
    { type: 'out', text: 'Java  Spring-Boot  React  Flutter  PostgreSQL  Réseaux' },
    { type: 'prompt', text: 'status --check' },
    { type: 'accent', text: '● En ligne — ouvert aux stages et projets freelance' }
];

function renderStaticTerminal() {
    const html = terminalScript.map(line => {
        if (line.type === 'prompt') {
            return `<span class="prompt">$ ${escapeHtml(line.text)}</span>`;
        }
        const cls = line.type === 'accent' ? 'accent' : 'out';
        return `<span class="${cls}">${escapeHtml(line.text)}</span>`;
    }).join('\n');
    terminalLinesEl.innerHTML = html + '<span class="term-cursor"></span>';
}

function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

async function typeTerminal() {
    for (const line of terminalScript) {
        const lineSpan = document.createElement('span');
        if (line.type === 'prompt') {
            lineSpan.className = 'prompt';
        } else if (line.type === 'accent') {
            lineSpan.className = 'accent';
        } else {
            lineSpan.className = 'out';
        }
        terminalLinesEl.appendChild(lineSpan);

        const prefix = line.type === 'prompt' ? '$ ' : '';
        const fullText = prefix + line.text;
        let shown = '';

        for (let i = 0; i < fullText.length; i++) {
            shown += fullText[i];
            lineSpan.textContent = shown;
            await sleep(line.type === 'prompt' ? 28 : 12);
        }

        terminalLinesEl.appendChild(document.createTextNode('\n'));
        await sleep(line.type === 'prompt' ? 160 : 260);
    }

    const cursor = document.createElement('span');
    cursor.className = 'term-cursor';
    terminalLinesEl.appendChild(cursor);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

if (terminalLinesEl) {
    if (prefersReducedMotion) {
        renderStaticTerminal();
    } else {
        // Démarre l'effet de frappe une fois le hero visible
        const heroTerminal = document.querySelector('.hero-terminal');
        let started = false;
        const termObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !started) {
                    started = true;
                    typeTerminal();
                    termObserver.disconnect();
                }
            });
        }, { threshold: 0.2 });

        if (heroTerminal) {
            termObserver.observe(heroTerminal);
        } else {
            typeTerminal();
        }
    }
}

// ==================== TILT 3D DU TERMINAL ====================
const terminalWindowEl = document.getElementById('terminal-window');
if (terminalWindowEl && !prefersReducedMotion && window.matchMedia('(hover: hover)').matches) {
    const maxTilt = 5;

    terminalWindowEl.addEventListener('mousemove', (e) => {
        const rect = terminalWindowEl.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        const tiltX = (0.5 - y) * maxTilt * 2;
        const tiltY = (x - 0.5) * maxTilt * 2;
        terminalWindowEl.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    });

    terminalWindowEl.addEventListener('mouseleave', () => {
        terminalWindowEl.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    });
}

// ==================== CANVAS RÉSEAU (HERO) ====================
const networkCanvas = document.getElementById('network-canvas');
if (networkCanvas && !prefersReducedMotion) {
    const ctx = networkCanvas.getContext('2d');
    const heroSection = document.querySelector('.hero');
    let nodes = [];
    let animationId = null;
    let running = false;

    function resizeCanvas() {
        const rect = heroSection.getBoundingClientRect();
        networkCanvas.width = rect.width;
        networkCanvas.height = rect.height;
    }

    function initNodes() {
        const count = Math.max(18, Math.floor((networkCanvas.width * networkCanvas.height) / 45000));
        nodes = Array.from({ length: count }, () => ({
            x: Math.random() * networkCanvas.width,
            y: Math.random() * networkCanvas.height,
            vx: (Math.random() - 0.5) * 0.25,
            vy: (Math.random() - 0.5) * 0.25
        }));
    }

    function drawFrame() {
        ctx.clearRect(0, 0, networkCanvas.width, networkCanvas.height);
        const linkDistance = 150;

        nodes.forEach(node => {
            node.x += node.vx;
            node.y += node.vy;
            if (node.x < 0 || node.x > networkCanvas.width) node.vx *= -1;
            if (node.y < 0 || node.y > networkCanvas.height) node.vy *= -1;
        });

        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const dx = nodes[i].x - nodes[j].x;
                const dy = nodes[i].y - nodes[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < linkDistance) {
                    ctx.strokeStyle = `rgba(52, 209, 196, ${0.12 * (1 - dist / linkDistance)})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(nodes[i].x, nodes[i].y);
                    ctx.lineTo(nodes[j].x, nodes[j].y);
                    ctx.stroke();
                }
            }
        }

        nodes.forEach(node => {
            ctx.fillStyle = 'rgba(233, 162, 59, 0.45)';
            ctx.beginPath();
            ctx.arc(node.x, node.y, 1.6, 0, Math.PI * 2);
            ctx.fill();
        });

        animationId = requestAnimationFrame(drawFrame);
    }

    function startAnimation() {
        if (running) return;
        running = true;
        resizeCanvas();
        initNodes();
        drawFrame();
    }

    function stopAnimation() {
        running = false;
        if (animationId) cancelAnimationFrame(animationId);
    }

    const canvasObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                startAnimation();
            } else {
                stopAnimation();
            }
        });
    }, { threshold: 0.05 });

    canvasObserver.observe(heroSection);

    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            resizeCanvas();
            initNodes();
        }, 200);
    });
}

// ==================== ENVOI DIRECT D'EMAIL (WEB3FORMS) ====================
const contactForm = document.getElementById('contactForm');
const formFeedback = document.getElementById('formFeedback');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = document.getElementById('submitBtn');
        const formData = new FormData(contactForm);
        const originalLabel = submitBtn.innerHTML;

        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>$ sending...</span>';

        try {
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData
            });
            const result = await response.json();
            if (result.success) {
                showFeedback('✅ Message envoyé avec succès ! Il arrivera directement sur ma boîte Gmail.', 'success');
                contactForm.reset();
            } else {
                showFeedback('❌ Erreur lors de l\u2019envoi. Réessaie dans quelques instants.', 'error');
            }
        } catch (error) {
            showFeedback('❌ Erreur de connexion réseau. Veuillez réessayer.', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalLabel;
        }
    });
}

function showFeedback(message, type) {
    if (formFeedback) {
        formFeedback.textContent = message;
        formFeedback.className = `feedback-msg ${type}`;
        setTimeout(() => {
            formFeedback.textContent = '';
            formFeedback.className = 'feedback-msg';
        }, 6000);
    }
}

// ==================== ANNÉE DYNAMIQUE ====================
const yearSpan = document.getElementById('year');
if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
}
