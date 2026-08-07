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
