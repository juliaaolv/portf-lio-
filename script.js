const customCursor = document.getElementById('custom-cursor');
const cursorFollower = document.getElementById('cursor-follower');
const cursorLight = document.getElementById('cursor-light');
const hoverTargets = document.querySelectorAll('.hover-target');

document.addEventListener('mousemove', (e) => {
    const { clientX: x, clientY: y } = e;

    customCursor.style.left = `${x}px`;
    customCursor.style.top = `${y}px`;
    cursorLight.style.left = `${x}px`;
    cursorLight.style.top = `${y}px`;

    cursorFollower.animate({
        left: `${x}px`,
        top: `${y}px`
    }, { duration: 200, fill: "forwards" });
});

hoverTargets.forEach(target => {
    target.addEventListener('mouseenter', () => document.body.classList.add('cursor-active'));
    target.addEventListener('mouseleave', () => document.body.classList.remove('cursor-active'));
});

const progressBar = document.getElementById('progress-bar');
const header = document.getElementById('main-header');
let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (currentScrollY / totalHeight) * 100;
    progressBar.style.width = `${progress}%`;

    if (currentScrollY > lastScrollY && currentScrollY > 100) {
        header.classList.add('header-hidden');
    } else {
        header.classList.remove('header-hidden');
    }
    lastScrollY = currentScrollY;
});

const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, { threshold: 0.15 });

revealElements.forEach(el => revealObserver.observe(el));

const cards = document.querySelectorAll('.project-card');

cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        const rotateX = (-y / rect.height) * 10;
        const rotateY = (x / rect.width) * 10;

        card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'rotateX(0deg) rotateY(0deg)';
    });
});

const parallaxElements = document.querySelectorAll('.parallax-element');

window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    parallaxElements.forEach(el => {
        const speed = el.dataset.speed || 0.1;
        el.style.transform = `translateY(${scrolled * speed}px)`;
    });
});
