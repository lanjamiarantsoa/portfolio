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

// ==================== ENVOI DIRECT D'EMAIL (WEB3FORMS) ====================
const contactForm = document.getElementById('contactForm');
const formFeedback = document.getElementById('formFeedback');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = document.getElementById('submitBtn');
        const formData = new FormData(contactForm);
        
        submitBtn.disabled = true;
        submitBtn.textContent = 'Envoi en cours...';
        
        try {
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result.success) {
                showFeedback('✅ Message envoyé avec succès ! Il arrivera directement sur ta boîte Gmail.', 'success');
                contactForm.reset();
            } else {
                showFeedback('❌ Erreur lors de l’envoi. Pense à remplacer VOTRE_CLE_WEB3FORMS_ICI dans le HTML !', 'error');
            }
        } catch (error) {
            showFeedback('❌ Erreur de connexion réseau. Veuillez réessayer.', 'error');
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
        }, 6000);
    }
}

// ==================== ANNÉE DYNAMIQUE ====================
const yearSpan = document.getElementById('year');
if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
}
