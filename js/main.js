/**
 * Main JavaScript for Portfolio
 * Handles navigation, dynamic content, and chat functionality
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    initNavigation();
    initMobileMenu();
    renderTimeline();
    renderProducts();
    renderAssessment();
    renderLocations();
    renderTechStack();
    initChat();
    initContactForm();
});

/**
 * Navigation Scroll Effects
 */
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Update active nav link based on scroll position
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
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

    // Smooth scroll for nav links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }

            // Close mobile menu if open
            document.querySelector('.nav-menu')?.classList.remove('active');
        });
    });
}

/**
 * Mobile Menu Toggle
 */
function initMobileMenu() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }
}

/**
 * Render Timeline from Data
 */
function renderTimeline() {
    const timelineContainer = document.getElementById('timeline');
    if (!timelineContainer || !careerData?.timeline) return;

    const timelineHTML = careerData.timeline.map((item, index) => `
        <div class="timeline-item" data-aos="fade-${index % 2 === 0 ? 'right' : 'left'}">
            <div class="timeline-dot"></div>
            <div class="timeline-card">
                <span class="timeline-year">${item.year}</span>
                <h3 class="timeline-title">${item.title}</h3>
                <p class="timeline-company">${item.company} • ${item.location}</p>
                <p class="timeline-description">${item.description}</p>
                <div class="timeline-tags">
                    ${item.tags.map(tag => `<span class="timeline-tag">${tag}</span>`).join('')}
                </div>
            </div>
        </div>
    `).join('');

    timelineContainer.innerHTML = timelineHTML;
}

/**
 * Render Products Showcase
 */
function renderProducts() {
    const productsContainer = document.getElementById('products-showcase');
    if (!productsContainer || !careerData?.products) return;

    const productsHTML = careerData.products.map(product => `
        <div class="product-card">
            <div class="product-logo">
                <i class="fas fa-${product.icon}"></i>
            </div>
            <h3 class="product-name">${product.name}</h3>
            <p class="product-company">${product.company}</p>
            <p class="product-description">${product.description}</p>
            <div class="product-impact">
                ${Object.entries(product.impact).map(([key, value]) => `
                    <div class="impact-stat">
                        <span class="impact-number">${value}</span>
                        <span class="impact-label">${key}</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');

    productsContainer.innerHTML = productsHTML;
}

/**
 * Render Employer-Ready Assessment
 */
function renderAssessment() {
    if (!careerData?.assessment) return;

    const summaryContainer = document.getElementById('assessment-summary');
    const employerContainer = document.getElementById('employer-assessment');
    const educationContainer = document.getElementById('education-assessment');

    if (summaryContainer) {
        const summary = careerData.assessment;
        summaryContainer.innerHTML = `
            <div class="assessment-summary-card">
                <h3>${summary.title}</h3>
                <p>${summary.executiveSummary}</p>
                <div class="assessment-highlights">
                    ${summary.employerFitSignals.map(signal => `<span class="assessment-pill">${signal}</span>`).join('')}
                </div>
            </div>
        `;
    }

    if (employerContainer) {
        employerContainer.innerHTML = careerData.assessment.employerResearch.map(item => `
            <article class="assessment-card">
                <h4>${item.company}</h4>
                <p class="assessment-meta">${item.period} • ${item.role}</p>
                <p>${item.companyContext}</p>
                <p><strong>Product Lines:</strong> ${item.productLines.join(' • ')}</p>
                <p><strong>Role Impact:</strong> ${item.roleImpact}</p>
            </article>
        `).join('');
    }

    if (educationContainer) {
        educationContainer.innerHTML = careerData.assessment.educationResearch.map(item => `
            <article class="assessment-card">
                <h4>${item.institution}</h4>
                <p class="assessment-meta">${item.degree} • ${item.years}</p>
                <p>${item.institutionContext}</p>
                <p><strong>Career Relevance:</strong> ${item.careerRelevance}</p>
            </article>
        `).join('');
    }
}

/**
 * Render Global Locations
 */
function renderLocations() {
    const locationsContainer = document.getElementById('location-cards');
    if (!locationsContainer || !careerData?.locations) return;

    const locationsHTML = careerData.locations.map(location => `
        <div class="location-card">
            <span class="location-flag">${location.flag}</span>
            <div class="location-info">
                <h4>${location.country}</h4>
                <p>${location.cities.join(', ')} • ${location.years} years</p>
            </div>
        </div>
    `).join('');

    locationsContainer.innerHTML = locationsHTML;
}

/**
 * Render Tech Stack Icons
 */
function renderTechStack() {
    const techOrbit = document.getElementById('tech-orbit');
    if (!techOrbit || !careerData?.skills) return;

    const allTech = [
        ...careerData.skills.languages.map(t => ({ name: t, icon: getIconForTech(t) })),
        ...careerData.skills.cloud.map(t => ({ name: t, icon: getIconForTech(t) })),
        ...careerData.skills.ai.map(t => ({ name: t, icon: getIconForTech(t) })),
        ...careerData.skills.devops.map(t => ({ name: t, icon: getIconForTech(t) })),
        ...careerData.skills.databases.map(t => ({ name: t, icon: getIconForTech(t) }))
    ];

    const techHTML = allTech.map(tech => `
        <div class="tech-icon" title="${tech.name}">
            <i class="${tech.icon}"></i>
        </div>
    `).join('');

    techOrbit.innerHTML = techHTML;
}

/**
 * Get Font Awesome icon for tech
 */
function getIconForTech(tech) {
    const iconMap = {
        'Python': 'fab fa-python',
        'TypeScript': 'fab fa-js-square',
        'C#': 'fab fa-microsoft',
        'Go': 'fas fa-cube',
        'Java': 'fab fa-java',
        'Rust': 'fas fa-cog',
        'Azure': 'fab fa-microsoft',
        'AWS': 'fab fa-aws',
        'GCP': 'fab fa-google',
        'Kubernetes': 'fas fa-dharmachakra',
        'Docker': 'fab fa-docker',
        'OpenAI': 'fas fa-brain',
        'Azure AI': 'fas fa-robot',
        'PyTorch': 'fas fa-fire',
        'TensorFlow': 'fas fa-project-diagram',
        'LangChain': 'fas fa-link',
        'GitHub Actions': 'fab fa-github',
        'Azure DevOps': 'fab fa-microsoft',
        'Jenkins': 'fab fa-jenkins',
        'Terraform': 'fas fa-globe',
        'Ansible': 'fas fa-cogs',
        'CosmosDB': 'fas fa-database',
        'PostgreSQL': 'fas fa-database',
        'MongoDB': 'fas fa-leaf',
        'Redis': 'fas fa-bolt',
        'Elasticsearch': 'fas fa-search'
    };
    return iconMap[tech] || 'fas fa-code';
}

/**
 * AI Chat Widget Functionality
 */
function initChat() {
    const chatWidget = document.getElementById('chat-widget');
    const openChatBtn = document.getElementById('open-chat');
    const closeChatBtn = document.getElementById('close-chat');
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-message');
    const chatMessages = document.getElementById('chat-messages');

    if (!chatWidget || !openChatBtn) return;

    // Open chat
    openChatBtn.addEventListener('click', () => {
        chatWidget.classList.add('active');
    });

    // Close chat
    closeChatBtn?.addEventListener('click', () => {
        chatWidget.classList.remove('active');
    });

    // Send message
    const sendMessage = () => {
        const message = chatInput?.value.trim();
        if (!message) return;

        // Add user message
        addChatMessage(message, 'user');
        chatInput.value = '';

        // Simulate AI response (placeholder - to be connected to real AI)
        setTimeout(() => {
            const response = generateAIResponse(message);
            addChatMessage(response, 'bot');
        }, 1000);
    };

    sendBtn?.addEventListener('click', sendMessage);
    chatInput?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
}

/**
 * Add message to chat
 */
function addChatMessage(message, type) {
    const chatMessages = document.getElementById('chat-messages');
    if (!chatMessages) return;

    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${type}`;
    messageDiv.innerHTML = `
        <div class="message-avatar">
            <i class="fas fa-${type === 'bot' ? 'robot' : 'user'}"></i>
        </div>
        <div class="message-content">
            <p>${message}</p>
        </div>
    `;

    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

/**
 * Generate AI Response (Placeholder - to be replaced with real AI backend)
 */
function generateAIResponse(question) {
    const lowerQ = question.toLowerCase();

    // Simple keyword-based responses (placeholder for AI integration)
    if (lowerQ.includes('experience') || lowerQ.includes('years')) {
        return `Based on the portfolio, there's over ${careerData.stats.years}+ years of experience spanning ${careerData.stats.countries} countries, with expertise in AI/ML, DevOps, and enterprise architecture. What specific area would you like to know more about?`;
    }
    
    if (lowerQ.includes('ai') || lowerQ.includes('copilot') || lowerQ.includes('machine learning')) {
        return "The AI/Copilot expertise includes architecting enterprise AI solutions, working with LLMs, implementing RAG patterns, and building developer productivity tools. Recent focus has been on Azure OpenAI and Copilot architecture.";
    }
    
    if (lowerQ.includes('devops') || lowerQ.includes('cicd') || lowerQ.includes('pipeline')) {
        return "Deep expertise in DevOps practices including CI/CD pipelines (Azure DevOps, GitHub Actions), infrastructure as code (Terraform), containerization (Kubernetes, Docker), and platform engineering.";
    }
    
    if (lowerQ.includes('product') || lowerQ.includes('leadership') || lowerQ.includes('management')) {
        return `Strong product leadership background with ${careerData.stats.products}+ products shipped, including experience scaling teams, defining strategy, and executing go-to-market plans for enterprise software.`;
    }

    if (lowerQ.includes('education') || lowerQ.includes('university') || lowerQ.includes('study abroad')) {
        return "Education includes an MBA in International Business (UW-Whitewater) and a BA in International/Global Studies (UW-Stevens Point), with study abroad exposure in Poland and Russia. This combination directly supports global stakeholder alignment, cross-cultural communication, and market-entry work.";
    }

    if (lowerQ.includes('company') || lowerQ.includes('employer') || lowerQ.includes('worked at')) {
        return "Experience spans RSM, Johnson Health Tech, American Family Insurance, SportsArt, and Pacific Cycle, with product-line impact across assurance-tech workflows, commercial/home fitness equipment, insurance IoT pilots, and retail bicycle accessories with patented innovations.";
    }
    
    if (lowerQ.includes('location') || lowerQ.includes('global') || lowerQ.includes('remote')) {
        const locations = careerData.locations.map(l => l.country).join(', ');
        return `Global experience across ${locations}. Comfortable with distributed teams and cross-cultural collaboration.`;
    }
    
    if (lowerQ.includes('hire') || lowerQ.includes('fit') || lowerQ.includes('role') || lowerQ.includes('opportunity')) {
        return "Great question! To assess fit, could you share more about the role you're considering? Key areas of strength include: AI architecture, developer experience optimization, and technical leadership. What's your team looking for?";
    }
    
    if (lowerQ.includes('contact') || lowerQ.includes('reach') || lowerQ.includes('connect')) {
        return "You can connect via LinkedIn (link in the contact section), or fill out the contact form below. For direct inquiries about opportunities, please include details about the role and team.";
    }

    return "That's a great question! I can help you explore the career history, technical expertise, products built, or discuss potential fit for opportunities. What would you like to know more about?";
}

/**
 * Contact Form Handler
 */
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name')?.value;
        const email = document.getElementById('email')?.value;
        const message = document.getElementById('message')?.value;

        // Placeholder - would connect to backend/email service
        console.log('Form submitted:', { name, email, message });
        
        // Show success feedback
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
        submitBtn.disabled = true;

        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            form.reset();
        }, 3000);
    });
}

/**
 * Utility: Debounce function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Export for potential module usage
if (typeof window !== 'undefined') {
    window.renderTimeline = renderTimeline;
    window.renderProducts = renderProducts;
    window.renderLocations = renderLocations;
}
