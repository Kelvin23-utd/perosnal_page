// ===== Particle Network Canvas =====
(function () {
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: null, y: null };
    let animId;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function getThemeColors() {
        const style = getComputedStyle(document.documentElement);
        return {
            particle: style.getPropertyValue('--particle-color').trim(),
            line: style.getPropertyValue('--particle-line').trim()
        };
    }

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = (Math.random() - 0.5) * 0.4;
            this.radius = Math.random() * 2 + 0.5;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

            // Subtle mouse attraction
            if (mouse.x !== null) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 200) {
                    this.vx += dx * 0.00005;
                    this.vy += dy * 0.00005;
                }
            }

            // Speed limit
            const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
            if (speed > 0.8) {
                this.vx *= 0.8 / speed;
                this.vy *= 0.8 / speed;
            }
        }

        draw(colors) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = colors.particle;
            ctx.fill();
        }
    }

    function isMobile() {
        return window.innerWidth <= 768 || ('ontouchstart' in window);
    }

    function init() {
        resize();
        particles = [];
        // Fewer particles on mobile for battery/performance
        const divisor = isMobile() ? 30000 : 15000;
        const maxCount = isMobile() ? 35 : 80;
        const count = Math.min(Math.floor((canvas.width * canvas.height) / divisor), maxCount);
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    }

    function drawLines(colors) {
        const maxDist = 150;
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < maxDist) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = colors.line;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const colors = getThemeColors();
        particles.forEach(p => {
            p.update();
            p.draw(colors);
        });
        drawLines(colors);
        animId = requestAnimationFrame(animate);
    }

    window.addEventListener('resize', () => {
        resize();
        // Reinitialize if particle count changed significantly
        const idealCount = Math.min(Math.floor((canvas.width * canvas.height) / 15000), 80);
        if (Math.abs(particles.length - idealCount) > 10) {
            init();
        }
    });

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    // Touch support for mobile — particles follow finger
    window.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
            mouse.x = e.touches[0].clientX;
            mouse.y = e.touches[0].clientY;
        }
    }, { passive: true });

    window.addEventListener('touchend', () => {
        mouse.x = null;
        mouse.y = null;
    });

    init();
    animate();
})();


// ===== Typing Effect =====
(function () {
    const el = document.getElementById('typing-text');
    const phrases = [
        'PhD Student in Computer Science',
        'Mobile Computing Researcher',
        'On-Device Intelligence',
        'Edge–Cloud Systems',
        'Acoustic Sensing & Privacy'
    ];

    let phraseIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let timeout;

    function type() {
        const current = phrases[phraseIdx];

        if (isDeleting) {
            el.textContent = current.substring(0, charIdx - 1);
            charIdx--;
        } else {
            el.textContent = current.substring(0, charIdx + 1);
            charIdx++;
        }

        let delay = isDeleting ? 35 : 65;

        if (!isDeleting && charIdx === current.length) {
            delay = 2200;
            isDeleting = true;
        } else if (isDeleting && charIdx === 0) {
            isDeleting = false;
            phraseIdx = (phraseIdx + 1) % phrases.length;
            delay = 400;
        }

        timeout = setTimeout(type, delay);
    }

    type();
})();


// ===== Navbar Scroll Effect =====
(function () {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('.section, .hero');

    window.addEventListener('scroll', () => {
        // Add shadow on scroll
        navbar.classList.toggle('scrolled', window.scrollY > 50);

        // Active section highlighting
        let current = '';
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= 150 && rect.bottom >= 150) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
})();


// ===== Mobile Nav Toggle =====
(function () {
    const toggle = document.getElementById('nav-toggle');
    const links = document.getElementById('nav-links');

    toggle.addEventListener('click', () => {
        links.classList.toggle('open');
        toggle.classList.toggle('active');
    });

    // Close menu on link click
    links.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
            links.classList.remove('open');
            toggle.classList.remove('active');
        });
    });
})();


// ===== Theme Toggle =====
(function () {
    const btn = document.getElementById('theme-toggle');
    const html = document.documentElement;

    // Check saved preference
    const saved = localStorage.getItem('theme');
    if (saved) {
        html.setAttribute('data-theme', saved);
    }

    btn.addEventListener('click', () => {
        const current = html.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
    });
})();


// ===== Scroll Reveal (IntersectionObserver) =====
(function () {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
})();


// ===== Smooth scroll for anchor links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});
