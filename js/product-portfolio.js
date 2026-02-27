document.addEventListener('DOMContentLoaded', () => {
    initPortfolioNavigation();
    renderProductPortfolioMeta();
    renderProductMap();
    renderProductCards();
    renderDomainSummary();
    bindDomainFilters();
    init3DPortfolioExperience();
});

const productCarouselState = {
    activeIndex: 0,
    drag: {
        activePointerId: null,
        isDragging: false,
        startX: 0,
        lastX: 0,
        moved: false,
        stepCount: 0
    }
};

function initPortfolioNavigation() {
    const navToggle = document.getElementById('portfolio-nav-toggle');
    const navMenu = document.getElementById('portfolio-nav-menu');
    const navLinks = document.querySelectorAll('#portfolio-nav-menu .nav-link');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }

    navLinks.forEach((link) => {
        link.addEventListener('click', (event) => {
            const href = link.getAttribute('href') || '';
            if (!href.startsWith('#')) return;

            event.preventDefault();
            const target = document.querySelector(href);
            if (target) target.scrollIntoView({ behavior: 'smooth' });

            navMenu?.classList.remove('active');
            navToggle?.classList.remove('active');
        });
    });
}

function renderProductPortfolioMeta() {
    const meta = productPortfolioData?.meta;
    if (!meta) return;

    const titleEl = document.getElementById('portfolio-meta-title');
    const summaryEl = document.getElementById('portfolio-meta-summary');
    const periodEl = document.getElementById('portfolio-meta-period');
    const countEl = document.getElementById('portfolio-count');

    if (titleEl) titleEl.textContent = meta.title;
    if (summaryEl) summaryEl.textContent = meta.summary;
    if (periodEl) periodEl.textContent = meta.period;
    if (countEl) countEl.textContent = String(productPortfolioData?.mappedProducts?.length || 0);
}

function renderProductMap() {
    const mapContainer = document.getElementById('product-map-grid');
    if (!mapContainer || !productPortfolioData?.mappedProducts) return;

    const rows = productPortfolioData.mappedProducts
        .map((item) => `
            <article class="product-map-row depth-row" data-domain="${item.domain}" data-tilt-item data-depth="8">
                <div class="map-main">
                    <p class="map-company">${item.company}</p>
                    <h3 class="map-product">${item.productName}</h3>
                </div>
                <div class="map-meta">
                    <div class="map-chip">
                        <span class="chip-label">Type</span>
                        <span class="chip-value map-type">${item.productType}</span>
                    </div>
                    <div class="map-chip">
                        <span class="chip-label">Stage</span>
                        <span class="chip-value map-stage">${item.stage}</span>
                    </div>
                    <div class="map-chip map-chip-role">
                        <span class="chip-label">Role</span>
                        <span class="chip-value map-role">${item.role}</span>
                    </div>
                    <div class="map-chip">
                        <span class="chip-label">Domain</span>
                        <span class="chip-value map-domain">${item.domain}</span>
                    </div>
                </div>
            </article>
        `)
        .join('');

    mapContainer.innerHTML = rows;
}

function renderProductCards() {
    const cardsContainer = document.getElementById('product-portfolio-grid');
    if (!cardsContainer || !productPortfolioData?.mappedProducts) return;

    cardsContainer.innerHTML = productPortfolioData.mappedProducts
        .map((item) => {
            return `
            <article class="product-card portfolio-card" data-domain="${item.domain}">
                <div class="product-logo">
                    <i class="fas fa-${item.icon}"></i>
                </div>
                <h3 class="product-name">${item.productName}</h3>
                <p class="product-company">${item.company} • ${item.period}</p>
                <p class="portfolio-role"><strong>Role:</strong> ${item.role}</p>
                <p class="portfolio-domain"><strong>Domain:</strong> ${item.domain}</p>
                <p class="product-description">${item.delivery}</p>
                <div class="portfolio-block">
                    <h4>Problem</h4>
                    <p>${item.problem}</p>
                </div>
                <div class="portfolio-block">
                    <h4>Outcomes</h4>
                    <ul class="portfolio-list">
                        ${item.outcomes.map((point) => `<li>${point}</li>`).join('')}
                    </ul>
                </div>
                <div class="portfolio-tags">
                    ${item.tags.map((tag) => `<span class="timeline-tag">${tag}</span>`).join('')}
                </div>
                <p class="portfolio-evidence"><strong>Evidence:</strong> ${item.evidence}</p>
            </article>
        `;
        })
        .join('');

    initProductCardCarousel();
}

function renderDomainSummary() {
    const summaryContainer = document.getElementById('domain-summary');
    if (!summaryContainer || !productPortfolioData?.mappedProducts) return;

    const counts = productPortfolioData.mappedProducts.reduce((acc, item) => {
        acc[item.domain] = (acc[item.domain] || 0) + 1;
        return acc;
    }, {});

    const summaryHtml = Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .map(([domain, count]) => `
            <button class="domain-pill" data-domain-filter="${domain}">
                <span>${domain}</span>
                <strong>${count}</strong>
            </button>
        `)
        .join('');

    summaryContainer.innerHTML = `
        <button class="domain-pill active" data-domain-filter="all">
            <span>All Domains</span>
            <strong>${productPortfolioData.mappedProducts.length}</strong>
        </button>
        ${summaryHtml}
    `;
}

function bindDomainFilters() {
    const summaryContainer = document.getElementById('domain-summary');
    if (!summaryContainer) return;

    summaryContainer.addEventListener('click', (event) => {
        const button = event.target.closest('[data-domain-filter]');
        if (!button) return;

        const filter = button.getAttribute('data-domain-filter');
        summaryContainer.querySelectorAll('[data-domain-filter]').forEach((el) => {
            el.classList.remove('active');
        });
        button.classList.add('active');

        applyDomainFilter(filter);
    });
}

function applyDomainFilter(filter) {
    const rows = document.querySelectorAll('#product-map-grid .product-map-row');
    const cards = document.querySelectorAll('#product-portfolio-grid .portfolio-card');

    [rows, cards].forEach((collection) => {
        collection.forEach((item) => {
            const isVisible = filter === 'all' || item.getAttribute('data-domain') === filter;
            item.classList.toggle('is-hidden', !isVisible);
        });
    });

    updateProductCardCarousel(true);
}

function initProductCardCarousel() {
    const carousel = document.getElementById('portfolio-3d-carousel');
    const viewport = carousel?.querySelector('.portfolio-3d-viewport');
    const prevButton = document.getElementById('portfolio-cards-prev');
    const nextButton = document.getElementById('portfolio-cards-next');

    if (!carousel || !viewport || !prevButton || !nextButton) return;

    if (!carousel.dataset.bound) {
        prevButton.addEventListener('click', () => shiftProductCardCarousel(-1));
        nextButton.addEventListener('click', () => shiftProductCardCarousel(1));
        bindProductCarouselDrag(carousel, viewport);
        window.addEventListener('resize', () => updateProductCardCarousel());
        carousel.dataset.bound = 'true';
    }

    updateProductCardCarousel(true);
}

function getVisibleProductCards() {
    const allCards = Array.from(document.querySelectorAll('#product-portfolio-grid .portfolio-card'));
    return allCards.filter((card) => !card.classList.contains('is-hidden'));
}

function shiftProductCardCarousel(direction) {
    const visibleCards = getVisibleProductCards();
    if (!visibleCards.length) return;

    productCarouselState.activeIndex = (productCarouselState.activeIndex + direction + visibleCards.length) % visibleCards.length;
    updateProductCardCarousel();
}

function bindProductCarouselDrag(carousel, viewport) {
    if (viewport.dataset.dragBound === 'true') return;

    const getDragThreshold = () => (window.innerWidth <= 768 ? 56 : 72);

    const shouldIgnoreDragStart = (target) => {
        return Boolean(target.closest('.visual-carousel button, .visual-carousel .carousel-dot, .portfolio-carousel-nav, a, input, textarea, select, label'));
    };

    const handlePointerDown = (event) => {
        if (event.pointerType === 'mouse' && event.button !== 0) return;
        if (shouldIgnoreDragStart(event.target)) return;

        productCarouselState.drag.activePointerId = event.pointerId;
        productCarouselState.drag.isDragging = true;
        productCarouselState.drag.startX = event.clientX;
        productCarouselState.drag.lastX = event.clientX;
        productCarouselState.drag.moved = false;
        productCarouselState.drag.stepCount = 0;

        carousel.classList.add('is-dragging');
        viewport.setPointerCapture(event.pointerId);
    };

    const handlePointerMove = (event) => {
        if (!productCarouselState.drag.isDragging) return;
        if (event.pointerId !== productCarouselState.drag.activePointerId) return;

        const deltaX = event.clientX - productCarouselState.drag.lastX;
        const totalDeltaX = event.clientX - productCarouselState.drag.startX;

        if (Math.abs(totalDeltaX) > 6) {
            productCarouselState.drag.moved = true;
        }

        if (Math.abs(deltaX) >= getDragThreshold()) {
            const direction = deltaX < 0 ? 1 : -1;
            shiftProductCardCarousel(direction);
            productCarouselState.drag.lastX = event.clientX;
            productCarouselState.drag.stepCount += 1;
        }
    };

    const handlePointerUp = (event) => {
        if (event.pointerId !== productCarouselState.drag.activePointerId) return;

        const totalDeltaX = event.clientX - productCarouselState.drag.startX;

        if (productCarouselState.drag.stepCount === 0 && Math.abs(totalDeltaX) >= 36) {
            const direction = totalDeltaX < 0 ? 1 : -1;
            shiftProductCardCarousel(direction);
        }

        productCarouselState.drag.activePointerId = null;
        productCarouselState.drag.isDragging = false;
        productCarouselState.drag.startX = 0;
        productCarouselState.drag.lastX = 0;
        productCarouselState.drag.stepCount = 0;

        carousel.classList.remove('is-dragging');
    };

    viewport.addEventListener('pointerdown', handlePointerDown);
    viewport.addEventListener('pointermove', handlePointerMove);
    viewport.addEventListener('pointerup', handlePointerUp);
    viewport.addEventListener('pointercancel', handlePointerUp);
    viewport.addEventListener('pointerleave', handlePointerUp);
    viewport.addEventListener('click', (event) => {
        if (!productCarouselState.drag.moved) return;
        event.preventDefault();
        event.stopPropagation();
        productCarouselState.drag.moved = false;
    }, true);

    viewport.dataset.dragBound = 'true';
}

function normalizedDistance(distance, length) {
    if (!length) return distance;
    let output = distance;
    const midpoint = Math.floor(length / 2);

    if (output > midpoint) output -= length;
    if (output < -midpoint) output += length;

    return output;
}

function updateProductCardCarousel(resetActive = false) {
    const track = document.getElementById('product-portfolio-grid');
    if (!track) return;

    const allCards = Array.from(track.querySelectorAll('.portfolio-card'));
    const visibleCards = getVisibleProductCards();

    allCards.forEach((card) => {
        card.classList.remove('is-active');
        card.classList.remove('is-left');
        card.classList.remove('is-right');
        card.style.transform = '';
        card.style.opacity = '';
        card.style.zIndex = '';
        card.style.pointerEvents = '';
        card.style.filter = '';
        card.style.display = card.classList.contains('is-hidden') ? 'none' : '';
    });

    if (!visibleCards.length) {
        track.style.height = '0px';
        return;
    }

    if (resetActive || productCarouselState.activeIndex >= visibleCards.length) {
        productCarouselState.activeIndex = 0;
    }

    const isMobile = window.innerWidth <= 768;
    const viewportWidth = window.innerWidth;
    const orbitRadiusX = Math.min(420, Math.max(300, viewportWidth * 0.34));
    const orbitRadiusY = 84;
    const depth = 340;

    visibleCards.forEach((card, index) => {
        const delta = normalizedDistance(index - productCarouselState.activeIndex, visibleCards.length);

        if (isMobile) {
            const isActive = delta === 0;
            card.style.display = isActive ? 'block' : 'none';
            card.style.transform = 'translate3d(-50%, 0, 0) rotateY(0deg) scale(1)';
            card.style.opacity = isActive ? '1' : '0';
            card.style.zIndex = isActive ? '40' : '1';
            card.style.pointerEvents = isActive ? 'auto' : 'none';
            card.classList.toggle('is-active', isActive);
            card.classList.remove('is-left');
            card.classList.remove('is-right');
            return;
        }

        if (Math.abs(delta) > 3) {
            card.style.opacity = '0';
            card.style.pointerEvents = 'none';
            card.style.transform = 'translate3d(-50%, 98px, -460px) scale(0.48)';
            card.style.zIndex = '1';
            return;
        }

        const angle = delta * 0.74;
        const distance = Math.abs(delta);
        const x = Math.sin(angle) * orbitRadiusX;
        const y = (1 - Math.cos(angle)) * orbitRadiusY;
        const z = Math.cos(angle) * depth - 280;
        const rotateY = -Math.sin(angle) * 52;
        const scale = 1 - distance * 0.16;
        const opacity = distance === 0 ? 1 : Math.max(0.18, 0.64 - (distance - 1) * 0.18);
        const zIndex = delta === 0 ? 80 : 28 - distance;

        card.style.transform = `translate3d(calc(-50% + ${x}px), ${y}px, ${z}px) rotateY(${rotateY}deg) scale(${scale})`;
        card.style.opacity = String(opacity);
        card.style.zIndex = String(zIndex);
        card.style.pointerEvents = delta === 0 ? 'auto' : 'none';
        card.style.filter = delta === 0 ? 'none' : 'saturate(0.78) blur(0.95px) brightness(0.92)';
        card.classList.toggle('is-active', delta === 0);
        card.classList.toggle('is-left', delta < 0);
        card.classList.toggle('is-right', delta > 0);
    });

    const activeCard = visibleCards[productCarouselState.activeIndex];
    const carouselHeight = isMobile
        ? Math.max(620, activeCard?.offsetHeight || 0)
        : Math.max(660, (activeCard?.offsetHeight || 0) + 92);
    track.style.height = `${carouselHeight}px`;
}

function init3DPortfolioExperience() {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const applyTilt = (element, event) => {
        const rect = element.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;
        const depth = Number(element.getAttribute('data-depth') || 10);
        const rotateY = (x - 0.5) * depth;
        const rotateX = (0.5 - y) * depth;

        element.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(0)`;
    };

    const clearTilt = (element) => {
        element.style.transform = '';
    };

    const bindTilt = (selector) => {
        document.querySelectorAll(selector).forEach((element) => {
            if (element.classList.contains('portfolio-card')) return;
            element.addEventListener('mousemove', (event) => applyTilt(element, event));
            element.addEventListener('mouseleave', () => clearTilt(element));
        });
    };

    bindTilt('[data-tilt]');
    bindTilt('[data-tilt-item]');

    const depthLayers = document.querySelectorAll('.hero-depth-layer');
    window.addEventListener('mousemove', (event) => {
        const xRatio = (event.clientX / window.innerWidth - 0.5) * 2;
        const yRatio = (event.clientY / window.innerHeight - 0.5) * 2;

        depthLayers.forEach((layer, index) => {
            const factor = (index + 1) * 10;
            layer.style.transform = `translate3d(${xRatio * factor}px, ${yRatio * factor}px, 0)`;
        });
    });
}
