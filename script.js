/* =============================================
   PREMIUM CIVIL ENGINEER PORTFOLIO — JS
   Archana Sivan Pillai | 8+ Years Experience
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    initPageLoader();
    initCustomCursor();
    initMobileMenu();
    initNavbarScroll();
    initScrollReveal();
    initStatsCounter();
    initParticlesCanvas();
    initContactForm();
});

/**
 * 1. PAGE LOADER
 */
function initPageLoader() {
    const loader = document.getElementById('page-loader');
    if (!loader) return;

    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('loaded');
        }, 1200); // Allow loader progress animation to complete first
    });

    // Fallback if window load takes too long
    setTimeout(() => {
        loader.classList.add('loaded');
    }, 4000);
}

/**
 * 2. CUSTOM CURSOR
 */
function initCustomCursor() {
    const dot = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');
    if (!dot || !ring) return;

    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;
    let isHovering = false;

    // Track mouse position
    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Immediate position for dot
        dot.style.left = `${mouseX}px`;
        dot.style.top = `${mouseY}px`;
        dot.style.opacity = '1';
        ring.style.opacity = '1';
    });

    // Ring smooth tracking (Lerp)
    function updateRing() {
        // Linear interpolation formula: current + (target - current) * ease
        ringX += (mouseX - ringX) * 0.15;
        ringY += (mouseY - ringY) * 0.15;

        ring.style.left = `${ringX}px`;
        ring.style.top = `${ringY}px`;

        requestAnimationFrame(updateRing);
    }
    updateRing();

    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
        dot.style.opacity = '0';
        ring.style.opacity = '0';
    });

    // Hover states for interactive elements
    const interactives = document.querySelectorAll('a, button, input, textarea, .menu-icon, .tl-card, .skill-card, .project-card, .cred-card');
    interactives.forEach(el => {
        el.addEventListener('mouseenter', () => {
            ring.classList.add('cursor-hover');
        });
        el.addEventListener('mouseleave', () => {
            ring.classList.remove('cursor-hover');
        });
    });

    // Hide custom cursor on mobile/touch devices
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
        dot.style.display = 'none';
        ring.style.display = 'none';
        document.body.style.cursor = 'auto';
    }
}

/**
 * 3. MOBILE MENU
 */
function initMobileMenu() {
    const menuIcon = document.getElementById('menu-icon');
    const navLinks = document.getElementById('nav-links');
    if (!menuIcon || !navLinks) return;

    menuIcon.addEventListener('click', (e) => {
        e.stopPropagation();
        menuIcon.classList.toggle('open');
        navLinks.classList.toggle('open');
    });

    // Close menu when a link is clicked
    const links = navLinks.querySelectorAll('a');
    links.forEach(link => {
        link.addEventListener('click', () => {
            menuIcon.classList.remove('open');
            navLinks.classList.remove('open');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navLinks.contains(e.target) && !menuIcon.contains(e.target)) {
            menuIcon.classList.remove('open');
            navLinks.classList.remove('open');
        }
    });
}

/**
 * 4. STICKY NAVBAR SCROLL & BACK TO TOP BUTTON
 */
function initNavbarScroll() {
    const navbar = document.getElementById('navbar');
    const backToTop = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        // Sticky Navbar
        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Back to top visibility
        if (backToTop) {
            if (scrollY > 600) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        }
    });

    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

/**
 * 5. SCROLL REVEAL (Intersection Observer)
 */
function initScrollReveal() {
    const revealTargets = document.querySelectorAll(
        '.reveal-up, .reveal-left, .reveal-right, .skill-card'
    );

    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
    };

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Trigger counter function if this item has counter inside
                const counters = entry.target.querySelectorAll('.counter');
                if (counters.length > 0) {
                    counters.forEach(c => animateCounter(c));
                }
                obs.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealTargets.forEach(target => {
        observer.observe(target);
    });
}

/**
 * 6. STATS COUNTER ANIMATION
 */
function animateCounter(counterElement) {
    if (counterElement.classList.contains('counted')) return;
    counterElement.classList.add('counted');

    const target = parseInt(counterElement.getAttribute('data-target'), 10) || 0;
    const duration = 2000; // 2 seconds
    const startTime = performance.now();

    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (easeOutQuad)
        const easedProgress = progress * (2 - progress);
        
        const currentValue = Math.floor(easedProgress * target);
        counterElement.textContent = currentValue;

        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            counterElement.textContent = target;
        }
    }

    requestAnimationFrame(updateCounter);
}

function initStatsCounter() {
    // Trigger counters inside hero section immediately (no observer needed)
    const heroStats = document.querySelectorAll('.hstat-num');
    setTimeout(() => {
        heroStats.forEach(stat => animateCounter(stat));
    }, 1500); // Start after loader fades out
}

/**
 * 7. PARTICLES CANVAS (Engineering Grid/Structure Theme)
 */
function initParticlesCanvas() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particles = [];
    const maxParticles = 80;
    const connectionDist = 125;

    class Particle {
        constructor() {
            // Spawn uniformly across the entire screen area
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = (Math.random() - 0.5) * 0.4;
            this.r = Math.random() * 2 + 1;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Bounce off boundaries to keep them inside the screen area
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
            ctx.fill();
        }
    }

    // Populate particles
    for (let i = 0; i < maxParticles; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        // Update and draw particles
        particles.forEach(p => {
            p.update();
            p.draw();
        });

        // Draw connections (structural lattice look)
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < connectionDist) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    // Fade lines out as they get further apart
                    const alpha = (1 - dist / connectionDist) * 0.3;
                    ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
                    ctx.lineWidth = 0.85;
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(animate);
    }

    animate();

    // Resize listener
    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });
}

/**
 * 8. CONTACT FORM WITH FLOATING/GLOW LABELS & VALIDATION
 */
function initContactForm() {
    const form = document.getElementById('contact-form');
    const successMsg = document.getElementById('form-success');
    const submitBtn = document.getElementById('submit-btn');
    if (!form || !successMsg || !submitBtn) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Perform basic validation
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const messageInput = document.getElementById('message');

        let isValid = true;

        [nameInput, emailInput, messageInput].forEach(input => {
            if (!input.value.trim()) {
                input.style.borderColor = '#ef4444'; // Red alert border
                isValid = false;
            } else {
                input.style.borderColor = '';
            }
        });

        if (!isValid) return;

        // Animate button to sending state
        const originalText = submitBtn.querySelector('.btn-text').innerText;
        submitBtn.querySelector('.btn-text').innerText = 'Sending message...';
        submitBtn.querySelector('.btn-icon').innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
        submitBtn.style.opacity = '0.85';
        submitBtn.style.pointerEvents = 'none';

        // Mock network delay
        setTimeout(() => {
            // Restore button but with success check mark
            submitBtn.style.opacity = '1';
            submitBtn.style.pointerEvents = 'all';
            submitBtn.classList.add('success');
            submitBtn.querySelector('.btn-text').innerText = 'Sent Successfully';
            submitBtn.querySelector('.btn-icon').innerHTML = '<i class="fa-solid fa-check"></i>';
            
            // Show Success Notification Panel
            successMsg.classList.add('show');
            form.reset();

            // Clear success states after 4 seconds
            setTimeout(() => {
                submitBtn.classList.remove('success');
                submitBtn.querySelector('.btn-text').innerText = originalText;
                submitBtn.querySelector('.btn-icon').innerHTML = '<i class="fa-solid fa-paper-plane"></i>';
                successMsg.classList.remove('show');
            }, 4000);

        }, 1800);
    });
}
