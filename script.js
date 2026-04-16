// ==================== MENU MOBILE ====================
const menuToggle = document.getElementById('mobile-menu');
const navLinks = document.getElementById('nav-links');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}

const links = document.querySelectorAll('.nav-links a');
links.forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
            navLinks.classList.remove('active');
        }
    });
});

// ==================== GESTION DE LA PHOTO DE PROFIL ====================
const profilePhoto = document.getElementById('profile-photo');
const avatarCircle = document.querySelector('.avatar-circle');

// CHANGE ICI LE CHEMIN VERS TA PHOTO
// Exemple : "moi.jpg", "edson.png", "images/photo.jpg"
const photoPath = 'profil.jpg';

if (profilePhoto) {
    profilePhoto.src = photoPath;
    profilePhoto.onload = () => {
        avatarCircle.classList.add('has-photo');
    };
    profilePhoto.onerror = () => {
        console.log('📸 Photo non trouvée. Ajoute ton image au chemin : ' + photoPath);
        avatarCircle.classList.remove('has-photo');
    };
}

// ==================== TÉLÉCHARGEMENT CV ====================
// Le CV se télécharge directement depuis le lien dans le HTML
// Pas besoin de code supplémentaire car le bouton a déjà l'attribut download

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
        
        if (!isValidEmail(email)) {
            showFeedback('Veuillez entrer une adresse email valide.', 'error');
            return;
        }
        
        submitBtn.disabled = true;
        submitBtn.textContent = 'Envoi en cours...';
        
        // Simulation d'envoi (à remplacer par un vrai back-end si besoin)
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            console.log('Message de :', name, '|', email, '|', message);
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

function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function showFeedback(message, type) {
    if (formFeedback) {
        formFeedback.textContent = message;
        formFeedback.className = `feedback-msg ${type}`;
        setTimeout(() => {
            if (formFeedback) {
                formFeedback.textContent = '';
                formFeedback.className = 'feedback-msg';
            }
        }, 5000);
    }
}

// ==================== ANCRES DOUCES ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            e.preventDefault();
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ==================== ANNÉE DYNAMIQUE ====================
const footerYear = document.querySelector('footer p');
if (footerYear) {
    const currentYear = new Date().getFullYear();
    footerYear.innerHTML = footerYear.innerHTML.replace('2025', currentYear);
}

// ==================== NAV ACTIVE AU SCROLL ====================
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