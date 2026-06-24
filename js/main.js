/* ============================================
   main.js — Lógica de la landing page
   ============================================ */

// ─── NAVBAR SCROLL ───────────────────────────
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// ─── HAMBURGER MENU ──────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('open');
});

// Cerrar menú al hacer click en un link
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
  });
});

// ─── SCROLL ANIMATIONS (cards) ───────────────
const animatedCards = document.querySelectorAll('.card');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, parseInt(delay));
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

animatedCards.forEach(card => observer.observe(card));

// ─── FORM VALIDATION ─────────────────────────
const form       = document.getElementById('contactForm');
const submitBtn  = document.getElementById('submitBtn');
const btnText    = submitBtn.querySelector('.btn-text');
const btnLoader  = submitBtn.querySelector('.btn-loader');
const formSuccess = document.getElementById('formSuccess');

// Reglas de validación
const rules = {
  nombre:  { min: 2,   msg: 'Ingresá al menos 2 caracteres.' },
  email:   { regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, msg: 'Ingresá un email válido.' },
  asunto:  { min: 4,   msg: 'Ingresá al menos 4 caracteres.' },
  mensaje: { min: 10,  msg: 'Ingresá al menos 10 caracteres.' },
};

function validateField(field) {
  const value  = field.value.trim();
  const rule   = rules[field.name];
  const errEl  = document.getElementById(`error-${field.name}`);
  let   isValid = true;
  let   msg = '';

  if (!value) {
    isValid = false;
    msg = 'Este campo es obligatorio.';
  } else if (rule.min && value.length < rule.min) {
    isValid = false;
    msg = rule.msg;
  } else if (rule.regex && !rule.regex.test(value)) {
    isValid = false;
    msg = rule.msg;
  }

  if (isValid) {
    field.classList.remove('invalid');
    field.classList.add('valid');
    errEl.textContent = '';
  } else {
    field.classList.remove('valid');
    field.classList.add('invalid');
    errEl.textContent = msg;
  }

  return isValid;
}

// Validación en tiempo real al salir del campo
Object.keys(rules).forEach(name => {
  const field = form.querySelector(`[name="${name}"]`);
  field.addEventListener('blur', () => validateField(field));
  field.addEventListener('input', () => {
    if (field.classList.contains('invalid')) validateField(field);
  });
});

// Submit
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const fields = Object.keys(rules).map(name => form.querySelector(`[name="${name}"]`));
  const allValid = fields.every(field => validateField(field));

  if (!allValid) return;

  // Simular envío
  btnText.hidden = true;
  btnLoader.hidden = false;
  submitBtn.disabled = true;

  setTimeout(() => {
    btnText.hidden = false;
    btnLoader.hidden = true;
    submitBtn.disabled = false;

    form.reset();
    fields.forEach(f => f.classList.remove('valid', 'invalid'));
    formSuccess.hidden = false;

    setTimeout(() => { formSuccess.hidden = true; }, 5000);
  }, 1500);
});

// ─── SMOOTH SCROLL OFFSET ────────────────────
// Compensar la altura del navbar fijo
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = navbar.offsetHeight + 16;
    window.scrollTo({
      top: target.getBoundingClientRect().top + window.scrollY - offset,
      behavior: 'smooth',
    });
  });
});
