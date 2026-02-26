document.addEventListener('DOMContentLoaded', () => {
    initPortfolioNavigation();
    renderProductPortfolioMeta();
    renderProductMap();
    renderProductCards();
    renderDomainSummary();
    bindDomainFilters();
    init3DPortfolioExperience();
});

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
                <div class="map-company">${item.company}</div>
                <div class="map-product">${item.productName}</div>
                <div class="map-type">${item.productType}</div>
                <div class="map-stage">${item.stage}</div>
                <div class="map-role">${item.role}</div>
            </article>
        `)
        .join('');

    mapContainer.innerHTML = rows;
}

function renderProductCards() {
    const cardsContainer = document.getElementById('product-portfolio-grid');
    if (!cardsContainer || !productPortfolioData?.mappedProducts) return;

    cardsContainer.innerHTML = productPortfolioData.mappedProducts
        .map((item, index) => {
            const visuals = getVisualsForProduct(item);
            const carouselId = `carousel-${index}`;

            return `
            <article class="product-card portfolio-card" data-domain="${item.domain}" data-tilt-item data-depth="14">
                <div class="product-logo">
                    <i class="fas fa-${item.icon}"></i>
                </div>
                <h3 class="product-name">${item.productName}</h3>
                <p class="product-company">${item.company} • ${item.period}</p>
                <p class="portfolio-role"><strong>Role:</strong> ${item.role}</p>
                <p class="portfolio-domain"><strong>Domain:</strong> ${item.domain}</p>
                <p class="product-description">${item.delivery}</p>
                <div class="visual-carousel" data-carousel-id="${carouselId}">
                    <div class="carousel-track">
                        ${visuals.map((visual, visualIndex) => `
                            <figure class="carousel-slide ${visualIndex === 0 ? 'active' : ''}">
                                <img src="${visual.src}" alt="${visual.alt}">
                                <figcaption>${visual.caption}</figcaption>
                            </figure>
                        `).join('')}
                    </div>
                    <div class="carousel-controls">
                        <button class="carousel-btn" data-carousel-nav="prev" aria-label="Previous image">
                            <i class="fas fa-chevron-left"></i>
                        </button>
                        <div class="carousel-dots">
                            ${visuals.map((_, visualIndex) => `
                                <button class="carousel-dot ${visualIndex === 0 ? 'active' : ''}" data-carousel-dot="${visualIndex}" aria-label="Go to image ${visualIndex + 1}"></button>
                            `).join('')}
                        </div>
                        <button class="carousel-btn" data-carousel-nav="next" aria-label="Next image">
                            <i class="fas fa-chevron-right"></i>
                        </button>
                    </div>
                </div>
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

    initVisualCarousels();
}

function getVisualsForProduct(item) {
    const id = item?.id || '';
    const domain = item?.domain || '';
    const ideas = item?.visualIdeas || [
        'Product snapshot',
        'Feature walkthrough',
        'Outcome or launch artifact'
    ];

    const imageSet = (() => {
        if (id.startsWith('rsm-')) return [
            'images/products/devops-dashboard.svg',
            'images/products/audit-pilot.svg',
            'images/products/global-portfolio.svg'
        ];

        if (id.startsWith('sky-')) return [
            'images/products/fintech-platform.svg',
            'images/products/global-portfolio.svg',
            'images/products/devops-dashboard.svg'
        ];

        if (id.startsWith('amfam-')) return [
            'images/products/iot-innovation.svg',
            'images/products/partner-ecosystem.svg',
            'images/products/devops-dashboard.svg'
        ];

        if (id.startsWith('sportsart-')) return [
            'images/products/fitness-launch.svg',
            'images/products/global-portfolio.svg',
            'images/products/award-product.svg'
        ];

        if (id.startsWith('pacific-')) return [
            'images/products/patent-product.svg',
            'images/products/global-portfolio.svg',
            'images/products/fitness-launch.svg'
        ];

        if (id.startsWith('jht-award-')) return [
            'images/products/award-product.svg',
            'images/products/fitness-launch.svg',
            'images/products/global-portfolio.svg'
        ];

        if (id.startsWith('jht-')) return [
            'images/products/fitness-launch.svg',
            'images/products/global-portfolio.svg',
            'images/products/award-product.svg'
        ];

        if (domain.includes('Fintech')) return [
            'images/products/fintech-platform.svg',
            'images/products/global-portfolio.svg',
            'images/products/devops-dashboard.svg'
        ];

        if (domain.includes('IoT') || domain.includes('Insurance')) return [
            'images/products/iot-innovation.svg',
            'images/products/partner-ecosystem.svg',
            'images/products/devops-dashboard.svg'
        ];

        if (domain.includes('Fitness')) return [
            'images/products/fitness-launch.svg',
            'images/products/global-portfolio.svg',
            'images/products/award-product.svg'
        ];

        return [
            'images/products/global-portfolio.svg',
            'images/products/devops-dashboard.svg',
            'images/products/fitness-launch.svg'
        ];
    })();

    return ideas.slice(0, 3).map((caption, index) => ({
        src: imageSet[index] || imageSet[0],
        caption,
        alt: `${item.productName} visual ${index + 1}`
    }));
}

function initVisualCarousels() {
    document.querySelectorAll('.visual-carousel').forEach((carousel) => {
        const slides = carousel.querySelectorAll('.carousel-slide');
        const dots = carousel.querySelectorAll('.carousel-dot');
        const prevBtn = carousel.querySelector('[data-carousel-nav="prev"]');
        const nextBtn = carousel.querySelector('[data-carousel-nav="next"]');

        if (!slides.length) return;

        let activeIndex = 0;

        const setActiveSlide = (nextIndex) => {
            activeIndex = ((nextIndex % slides.length) + slides.length) % slides.length;

            slides.forEach((slide, index) => {
                slide.classList.toggle('active', index === activeIndex);
            });

            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === activeIndex);
            });
        };

        prevBtn?.addEventListener('click', () => setActiveSlide(activeIndex - 1));
        nextBtn?.addEventListener('click', () => setActiveSlide(activeIndex + 1));

        dots.forEach((dot) => {
            dot.addEventListener('click', () => {
                const nextIndex = Number(dot.getAttribute('data-carousel-dot'));
                if (!Number.isNaN(nextIndex)) setActiveSlide(nextIndex);
            });
        });
    });
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
