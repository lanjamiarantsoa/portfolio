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

// ==================== GESTION DE LA PHOTO DE PROFIL ====================
const profilePhoto = document.getElementById('profile-photo');
const avatarCircle = document.querySelector('.avatar-circle');
const photoPath = 'profil.jpg';

if (profilePhoto) {
    profilePhoto.src = photoPath;
    profilePhoto.onload = () => {
        avatarCircle.classList.add('has-photo');
    };
    profilePhoto.onerror = () => {
        avatarCircle.classList.remove('has-photo');
    };
}

// ==================== FORMULAIRE DE CONTACT ====================
const contactForm = document.getElementById('contactForm');
const formFeedback = document.getElementById('formFeedback');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();
        const submitBtn = document.getElementById('submitBtn');
        
        if (!name || !email || !message) {
            showFeedback('Veuillez remplir tous les champs.', 'error');
            return;
        }
        
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showFeedback('Veuillez entrer une adresse email valide.', 'error');
            return;
        }
        
        submitBtn.disabled = true;
        submitBtn.textContent = 'Envoi en cours...';
        
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            showFeedback('✅ Message envoyé avec succès ! Je vous répondrai rapidement.', 'success');
            contactForm.reset();
        } catch (error) {
            showFeedback('❌ Une erreur est survenue. Merci de réessayer.', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Envoyer le message';
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
        }, 5000);
    }
}

// ==================== ANNÉE DYNAMIQUE ====================
const yearSpan = document.getElementById('year');
if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
}

// ==================== HIGHLIGHT DES LIENS NAVIGATION AU SCROLL ====================
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-links a');
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (window.scrollY >= sectionTop - 150) {
            current = section.getAttribute('id');
        }
    });

    navItems.forEach(item => {
        const href = item.getAttribute('href').substring(1);
        if (href === current) {
            item.style.color = 'var(--primary-light)';
            item.style.fontWeight = '600';
        } else {
            item.style.color = '';
            item.style.fontWeight = '';
        }
    });
}

window.addEventListener('scroll', updateActiveNavLink);
window.addEventListener('load', updateActiveNavLink);
