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

// Função de Troca de Temas
function changeTheme(themeName) {
    document.body.classList.remove('theme-cyber', 'theme-emerald', 'theme-light');
    document.querySelectorAll('.theme-chip').forEach(btn => btn.classList.remove('active'));

    if (themeName !== 'default') {
        document.body.classList.add(`theme-${themeName}`);
    }

    event.currentTarget.classList.add('active');
}






const canvas = document.getElementById('teiaCanvas');
const canvasHint = document.getElementById('canvasHint');

if (canvas) {
    const ctx = canvas.getContext('2d');

    let width, height;
    let particles = [];
    let mouse = { x: null, y: null, active: false };
    let currentTeiaColor = '#ff3b94';
    let hintTimeout = null;

    function resizeCanvas() {
        width = canvas.width = canvas.parentElement.clientWidth;
        height = canvas.height = canvas.parentElement.clientHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
        constructor(x, y) {
            this.x = x || Math.random() * width;
            this.y = y || Math.random() * height;
            this.vx = (Math.random() - 0.5) * 1.5;
            this.vy = (Math.random() - 0.5) * 1.5;
            this.radius = 3;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = currentTeiaColor;
            ctx.shadowBlur = 12;
            ctx.shadowColor = currentTeiaColor;
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    }

    function initTeia(num = 55) {
        particles = [];
        for (let i = 0; i < num; i++) {
            particles.push(new Particle());
        }
    }
    initTeia();

    function hexToRgba(hex, alpha) {
        let c = hex.replace('#', '');
        if (c.length === 3) c = c.split('').map(x => x + x).join('');
        const num = parseInt(c, 16);
        return `rgba(${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}, ${alpha})`;
    }

    function connectParticles() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 130) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = hexToRgba(currentTeiaColor, 1 - dist / 130);
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }

            if (mouse.active) {
                const mdx = particles[i].x - mouse.x;
                const mdy = particles[i].y - mouse.y;
                const mdist = Math.sqrt(mdx * mdx + mdy * mdy);

                if (mdist < 160) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.strokeStyle = `rgba(255, 255, 255, ${1 - mdist / 160})`;
                    ctx.lineWidth = 1.2;
                    ctx.stroke();
                }
            }
        }
    }

    function animateCanvas() {
        ctx.clearRect(0, 0, width, height);

        particles.forEach(p => {
            p.update();
            p.draw();
        });

        connectParticles();
        requestAnimationFrame(animateCanvas);
    }
    animateCanvas();

    function showClickNotice(message) {
        if (!canvasHint) return;
        
        canvasHint.innerText = message;
        canvasHint.classList.remove('hidden');

        clearTimeout(hintTimeout);

        hintTimeout = setTimeout(() => {
            if (mouse.active) {
                canvasHint.classList.add('hidden');
            } else {
                canvasHint.innerText = "✨ Toque ou passe o mouse na tela";
            }
        }, 1500);
    }

    function updatePointer(x, y) {
        const rect = canvas.getBoundingClientRect();
        mouse.x = x - rect.left;
        mouse.y = y - rect.top;

        if (!mouse.active) {
            mouse.active = true;
            if (canvasHint && !hintTimeout) {
                canvasHint.classList.add('hidden');
            }
        }
    }

    function resetPointer() {
        mouse.active = false;
        clearTimeout(hintTimeout);
        hintTimeout = null;
        if (canvasHint) {
            canvasHint.innerText = " Toque ou passe o mouse na tela";
            canvasHint.classList.remove('hidden');
        }
    }

    // Eventos
    canvas.addEventListener('mousemove', (e) => updatePointer(e.clientX, e.clientY));
    canvas.addEventListener('mouseleave', resetPointer);

    canvas.addEventListener('click', () => {
        const notices = [
            " Conexão estabelecida!",
            " Partículas energizadas!",
            " Criatividade em código!",
            " Teia ativada!"
        ];
        const randomNotice = notices[Math.floor(Math.random() * notices.length)];
        showClickNotice(randomNotice);
    });

    canvas.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
            updatePointer(e.touches[0].clientX, e.touches[0].clientY);
        }
    });
    canvas.addEventListener('touchend', resetPointer);

    // Controles dos botões
    window.setTeiaColor = function(color) {
        currentTeiaColor = color;
        document.querySelectorAll('.color-btn').forEach(btn => btn.classList.remove('active'));
        if (event) event.target.classList.add('active');
    };

    window.triggerGlowBurst = function() {
        for (let i = 0; i < 20; i++) {
            const px = mouse.active ? mouse.x : width / 2;
            const py = mouse.active ? mouse.y : height / 2;
            particles.push(new Particle(px, py));
        }
    };

    window.resetTeia = function() {
        initTeia();
    };

    window.clearCanvas = function() {
        particles = [];
    };
}
