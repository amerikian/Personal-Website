/**
 * GSAP Animations for Portfolio
 * Scroll-triggered animations and interactive effects
 */

// Wait for DOM and GSAP to be ready
document.addEventListener('DOMContentLoaded', () => {
    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger);

    // Initialize all animations
    initHeroAnimations();
    initScrollAnimations();
    initCounterAnimations();
    initSkillBarAnimations();
    initHoverEffects();
});

/**
 * Hero Section Animations
 */
function initHeroAnimations() {
    const heroTimeline = gsap.timeline({ defaults: { ease: 'power3.out' } });

    heroTimeline
        .from('.hero-badge', {
            opacity: 0,
            y: -30,
            duration: 0.8
        })
        .from('.hero-title .line-1', {
            opacity: 0,
            y: 30,
            duration: 0.6
        }, '-=0.4')
        .from('.hero-title .line-2', {
            opacity: 0,
            y: 30,
            duration: 0.8
        }, '-=0.3')
        .from('.hero-subtitle', {
            opacity: 0,
            y: 20,
            duration: 0.6
        }, '-=0.4')
        .from('.hero-stats', {
            opacity: 0,
            y: 30,
            duration: 0.6
        }, '-=0.3')
        .from('.stat-item', {
            opacity: 0,
            y: 20,
            stagger: 0.1,
            duration: 0.4
        }, '-=0.3')
        .from('.hero-cta', {
            opacity: 0,
            y: 20,
            duration: 0.5
        }, '-=0.2')
        .from('.scroll-indicator', {
            opacity: 0,
            y: 20,
            duration: 0.5
        }, '-=0.1');
}

/**
 * Scroll-Triggered Animations
 */
function initScrollAnimations() {
    // Section headers
    gsap.utils.toArray('.section-header').forEach(header => {
        gsap.from(header, {
            scrollTrigger: {
                trigger: header,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            },
            opacity: 0,
            y: 50,
            duration: 0.8,
            ease: 'power3.out'
        });
    });

    // Timeline items with stagger
    gsap.utils.toArray('.timeline-item').forEach((item, index) => {
        const direction = index % 2 === 0 ? -50 : 50;
        
        gsap.from(item, {
            scrollTrigger: {
                trigger: item,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            },
            opacity: 0,
            x: direction,
            duration: 0.8,
            ease: 'power3.out'
        });
    });

    // Expertise cards
    gsap.from('.expertise-card', {
        scrollTrigger: {
            trigger: '.expertise-grid',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        y: 50,
        stagger: 0.1,
        duration: 0.6,
        ease: 'power3.out'
    });

    // Product cards
    gsap.from('.product-card', {
        scrollTrigger: {
            trigger: '.products-showcase',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        y: 60,
        stagger: 0.15,
        duration: 0.8,
        ease: 'power3.out'
    });

    // Location cards
    gsap.from('.location-card', {
        scrollTrigger: {
            trigger: '.location-cards',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        x: 50,
        stagger: 0.1,
        duration: 0.6,
        ease: 'power3.out'
    });

    // Tech icons
    gsap.from('.tech-icon', {
        scrollTrigger: {
            trigger: '.tech-orbit',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        scale: 0,
        stagger: {
            each: 0.05,
            from: 'random'
        },
        duration: 0.5,
        ease: 'back.out(1.7)'
    });

    // Contact section
    gsap.from('.contact-item', {
        scrollTrigger: {
            trigger: '.contact-info',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        x: -30,
        stagger: 0.1,
        duration: 0.6,
        ease: 'power3.out'
    });

    gsap.from('.contact-form', {
        scrollTrigger: {
            trigger: '.contact-form',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        x: 30,
        duration: 0.8,
        ease: 'power3.out'
    });
}

/**
 * Counter Animations for Stats
 */
function initCounterAnimations() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.dataset.target);
        
        ScrollTrigger.create({
            trigger: counter,
            start: 'top 80%',
            onEnter: () => animateCounter(counter, target),
            once: true
        });
    });
}

function animateCounter(element, target) {
    const duration = 2;
    const start = 0;
    let startTime = null;
    
    function formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(0) + 'M+';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(0) + 'K+';
        }
        return num.toString() + '+';
    }

    function animate(currentTime) {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
        
        // Easing function (ease out quad)
        const easeProgress = 1 - (1 - progress) * (1 - progress);
        const current = Math.floor(easeProgress * target);
        
        element.textContent = formatNumber(current);
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            element.textContent = formatNumber(target);
        }
    }
    
    requestAnimationFrame(animate);
}

/**
 * Skill Bar Animations
 */
function initSkillBarAnimations() {
    const skillBars = document.querySelectorAll('.skill-bar');
    
    skillBars.forEach(bar => {
        const skill = parseInt(bar.dataset.skill);
        
        ScrollTrigger.create({
            trigger: bar,
            start: 'top 85%',
            onEnter: () => {
                gsap.to(bar, {
                    width: skill + '%',
                    duration: 1.5,
                    ease: 'power3.out'
                });
            },
            once: true
        });
    });
}

/**
 * Hover Effects
 */
function initHoverEffects() {
    // Magnetic button effect
    const magneticButtons = document.querySelectorAll('.btn-primary');
    
    magneticButtons.forEach(button => {
        button.addEventListener('mousemove', (e) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            gsap.to(button, {
                x: x * 0.2,
                y: y * 0.2,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        
        button.addEventListener('mouseleave', () => {
            gsap.to(button, {
                x: 0,
                y: 0,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });

    // Card tilt effect
    const cards = document.querySelectorAll('.expertise-card, .product-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            gsap.to(card, {
                rotateX: rotateX,
                rotateY: rotateY,
                transformPerspective: 1000,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                rotateX: 0,
                rotateY: 0,
                duration: 0.5,
                ease: 'power2.out'
            });
        });
    });
}

/**
 * Parallax Effects
 */
function initParallaxEffects() {
    gsap.to('.hero-content', {
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 1
        },
        y: 100,
        opacity: 0
    });
}

// Initialize parallax when ready
document.addEventListener('DOMContentLoaded', initParallaxEffects);
