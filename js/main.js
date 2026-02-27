/**
 * Main JavaScript for Portfolio
 * Handles navigation, dynamic content, and chat functionality
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    initNavigation();
    initMobileMenu();
    renderTimeline();
    renderAssessment();
    renderLocations();
    renderTechStack();
    initChat();
    initContactLinks();
    initContactCardClicks();
});

function initContactLinks() {
    const profile = careerData?.profile || {};
    const linkedInUrl = profile.linkedIn || 'https://linkedin.com';
    const githubUrl = profile.github || 'https://github.com';
    const emailAddress = profile.email || 'contact@example.com';
    const emailHref = `mailto:${emailAddress}`;

    const mapping = [
        ['contact-linkedin', linkedInUrl],
        ['footer-linkedin', linkedInUrl],
        ['contact-github', githubUrl],
        ['footer-github', githubUrl],
        ['contact-email', emailHref],
        ['footer-email', emailHref],
    ];

    mapping.forEach(([id, href]) => {
        const el = document.getElementById(id);
        if (el) el.setAttribute('href', href);
    });
}

function initContactCardClicks() {
    const cards = document.querySelectorAll('.contact-info .contact-item');
    cards.forEach((card) => {
        const link = card.querySelector('a[href]');
        if (!link) return;
        card.style.cursor = 'pointer';
        card.addEventListener('click', (event) => {
            if (event.target.closest('a')) return;
            link.click();
        });
    });
}

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
 * Render Employer-Ready Assessment
 */
function renderAssessment() {
    if (!careerData?.assessment) return;

    const summaryContainer = document.getElementById('assessment-summary');
    const employerContainer = document.getElementById('employer-assessment');
    const educationContainer = document.getElementById('education-assessment');
    const educationResearch = careerData.assessment.educationResearch || [];
    const mbaProfile = educationResearch.find(item => (item.degree || '').toLowerCase().includes('mba'));
    const undergradProfile = educationResearch.find(item => (item.degree || '').toLowerCase().includes('international/global'));

    const keyMetrics = [
        {
            label: 'MBA GPA',
            value: typeof mbaProfile?.cumulativeGpa === 'number' ? mbaProfile.cumulativeGpa.toFixed(2) : '—'
        },
        {
            label: 'Undergrad GPA',
            value: typeof undergradProfile?.cumulativeGpa === 'number' ? undergradProfile.cumulativeGpa.toFixed(2) : '—'
        },
        {
            label: 'Countries',
            value: `${careerData?.stats?.countries ?? 0}`
        },
        {
            label: 'Years',
            value: `${careerData?.stats?.years ?? 0}+`
        }
    ];

    if (summaryContainer) {
        const summary = careerData.assessment;
        const summaryMeta = [];

        if (summary.verificationNote) {
            summaryMeta.push(`<span class="assessment-verified"><i class="fas fa-shield-check"></i> ${summary.verificationNote}</span>`);
        }

        if (summary.lastUpdated) {
            const formattedDate = new Date(`${summary.lastUpdated}T00:00:00`).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
            summaryMeta.push(`<span class="assessment-updated">Last updated: ${formattedDate}</span>`);
        }

        summaryContainer.innerHTML = `
            <div class="assessment-summary-card">
                <div class="assessment-summary-meta">${summaryMeta.join('')}</div>
                <h3>${summary.title}</h3>
                <p>${summary.executiveSummary}</p>
                <div class="assessment-metrics">
                    ${keyMetrics.map(metric => `
                        <div class="assessment-metric">
                            <span class="assessment-metric-value">${metric.value}</span>
                            <span class="assessment-metric-label">${metric.label}</span>
                        </div>
                    `).join('')}
                </div>
                <div class="assessment-highlights">
                    ${summary.employerFitSignals.map(signal => `<span class="assessment-pill">${signal}</span>`).join('')}
                </div>
                <div class="assessment-actions">
                    <a class="btn btn-primary" href="#contact">Contact Ian</a>
                    <a class="btn btn-outline" href="${careerData?.profile?.linkedIn || '#'}" target="_blank" rel="noopener noreferrer">View Resume Profile</a>
                </div>
            </div>
        `;
    }

    if (employerContainer) {
        employerContainer.innerHTML = careerData.assessment.employerResearch.map(item => `
            <article class="assessment-card" onclick="toggleCard(this)">
                <h4>${item.company}</h4>
                <p class="assessment-meta">${item.period} • ${item.role}</p>
                <p class="card-preview">${summarizeText(item.companyContext, 120)}</p>
                <div class="card-details">
                    <p>${item.companyContext}</p>
                    <p><strong>Product Lines:</strong> ${item.productLines.join(' • ')}</p>
                    <p><strong>Role Impact:</strong> ${item.roleImpact}</p>
                </div>
            </article>
        `).join('');
    }

    if (educationContainer) {
        educationContainer.innerHTML = careerData.assessment.educationResearch.map(item => {
            const educationMetrics = [];

            if (typeof item.cumulativeGpa === 'number') {
                educationMetrics.push(`<p><strong>Cumulative GPA:</strong> ${item.cumulativeGpa.toFixed(2)}</p>`);
            }

            if (typeof item.cumulativeCredits === 'number') {
                educationMetrics.push(`<p><strong>Cumulative Credits:</strong> ${item.cumulativeCredits.toFixed(2)}</p>`);
            }

            if (item.degreeDate) {
                educationMetrics.push(`<p><strong>Degree Date:</strong> ${item.degreeDate}</p>`);
            }

            return `
                <article class="assessment-card" onclick="toggleCard(this)">
                    <h4>${item.institution}</h4>
                    <p class="assessment-meta">${item.degree} • ${item.years}</p>
                    <p class="card-preview">${summarizeText(item.institutionContext, 100)}</p>
                    <div class="card-details">
                        ${educationMetrics.join('')}
                        <p>${item.institutionContext}</p>
                        <p><strong>Career Relevance:</strong> ${item.careerRelevance}</p>
                    </div>
                </article>
            `;
        }).join('');
    }
}

function toggleCard(card) {
    card.classList.toggle('expanded');
}

function summarizeText(text, maxLength) {
    if (!text || text.length <= maxLength) return text || '';
    const clipped = text.slice(0, maxLength).trim();
    const lastSpace = clipped.lastIndexOf(' ');
    return `${clipped.slice(0, lastSpace > 0 ? lastSpace : clipped.length)}…`;
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
        ...(careerData.skills.technical || []).map(t => ({ name: t, icon: getIconForTech(t) })),
        ...(careerData.skills.devops || []).map(t => ({ name: t, icon: getIconForTech(t) })),
        ...(careerData.skills.ai || []).map(t => ({ name: t, icon: getIconForTech(t) })),
        ...(careerData.skills.methodologies || []).map(t => ({ name: t, icon: getIconForTech(t) })),
        ...(careerData.skills.industries || []).map(t => ({ name: t, icon: getIconForTech(t) }))
    ];

    const techHTML = allTech.map(tech => `
        <div class="tech-icon" title="${tech.name}">
            <i class="${tech.icon}"></i>
            <span class="tech-label">${tech.name}</span>
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
        'JavaScript': 'fab fa-js-square',
        'HTML/CSS': 'fab fa-html5',
        'TypeScript': 'fab fa-js-square',
        'C#': 'fab fa-microsoft',
        'Three.js': 'fas fa-cube',
        'ECharts': 'fas fa-chart-bar',
        'DOMO': 'fas fa-chart-pie',
        'Mobile Apps': 'fas fa-mobile-alt',
        'API Development': 'fas fa-plug',
        'Azure': 'fab fa-microsoft',
        'Azure DevOps': 'fab fa-microsoft',
        'CI/CD Pipelines': 'fas fa-rocket',
        'Git Repos': 'fab fa-git-alt',
        'GitHub Actions': 'fab fa-github',
        'Azure Static Web Apps': 'fas fa-cloud',
        'Release Governance': 'fas fa-clipboard-check',
        'GitHub Copilot': 'fab fa-github',
        'Azure OpenAI': 'fas fa-brain',
        'RAG Patterns': 'fas fa-project-diagram',
        'Bot Development': 'fas fa-robot',
        'AI-Assisted Workflows': 'fas fa-magic',
        'Scaled Agile Framework (SAFe)': 'fas fa-layer-group',
        'Scrum Master': 'fas fa-users',
        'Lean Startup': 'fas fa-seedling',
        'Release Management': 'fas fa-calendar-check',
        'A/B Testing': 'fas fa-flask',
        'Test & Learn': 'fas fa-lightbulb',
        'Fintech': 'fas fa-coins',
        'Blockchain': 'fas fa-link',
        'Fitness/Wellness': 'fas fa-heartbeat',
        'Insurance': 'fas fa-shield-alt',
        'Consumer Products': 'fas fa-shopping-cart',
        'Cryptocurrency': 'fab fa-bitcoin',
        'IoT/Smart Home': 'fas fa-home'
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

    let isSending = false;
    let backendChecked = false;
    let backendAvailable = false;
    let backendUnavailableNotified = false;

    const SWA_API_BASE = 'https://salmon-rock-093cc6a0f.6.azurestaticapps.net';
    const host = window.location.hostname;
    const isLocal = host === 'localhost' || host === '127.0.0.1';
    const isGitHubPages = host.endsWith('github.io');
    const API_BASE = (isLocal || isGitHubPages) ? SWA_API_BASE : '';

    const checkBackendAvailability = async () => {
        if (backendChecked) return backendAvailable;
        backendChecked = true;

        try {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 4000);
            const response = await fetch(`${API_BASE}/api/health`, {
                method: 'GET',
                signal: controller.signal
            });
            clearTimeout(timeout);
            backendAvailable = response.ok;
        } catch (error) {
            backendAvailable = false;
        }

        return backendAvailable;
    };

    // Send message
    const sendMessage = async () => {
        if (isSending) return;

        const message = chatInput?.value.trim();
        if (!message) return;

        isSending = true;
        if (sendBtn) sendBtn.disabled = true;

        // Add user message
        addChatMessage(message, 'user');
        chatInput.value = '';

        // Show typing indicator
        const typingDiv = document.createElement('div');
        typingDiv.className = 'chat-message bot typing';
        typingDiv.innerHTML = `
            <div class="message-avatar"><i class="fas fa-robot"></i></div>
            <div class="message-content"><p>Thinking...</p></div>
        `;
        chatMessages.appendChild(typingDiv);

        try {
            const canUseBackend = await checkBackendAvailability();
            if (!canUseBackend) {
                typingDiv.remove();

                if (!backendUnavailableNotified) {
                    backendUnavailableNotified = true;
                    addChatMessage('Live AI service is temporarily unavailable, so I’m using local portfolio responses for now.', 'bot');
                }

                addChatMessage(generateAIResponse(message), 'bot');
                return;
            }

            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 12000);

            let response;
            try {
                response = await fetch(`${API_BASE}/api/chat`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message }),
                    signal: controller.signal
                });
            } finally {
                clearTimeout(timeout);
            }

            typingDiv.remove();

            if (response.ok) {
                const data = await response.json();
                addChatMessage(data.response || generateAIResponse(message), 'bot');
            } else {
                // Fallback to local response if API fails
                addChatMessage(generateAIResponse(message), 'bot');
            }
        } catch (error) {
            typingDiv.remove();
            // Fallback to local response if API unavailable
            addChatMessage(generateAIResponse(message), 'bot');
        } finally {
            isSending = false;
            if (sendBtn) sendBtn.disabled = false;
            chatInput?.focus();
        }
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
            <p></p>
        </div>
    `;

    const textNode = messageDiv.querySelector('.message-content p');
    if (textNode) {
        textNode.textContent = message;
    }

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
        return `Based on the portfolio, Ian has ${careerData.stats.years}+ years of experience across ${careerData.stats.countries} countries, with strengths in product management, Scrum leadership, release delivery, and DevOps-focused execution. What area would you like to explore?`;
    }
    
    if (lowerQ.includes('ai') || lowerQ.includes('copilot') || lowerQ.includes('machine learning')) {
        return "Recent AI work includes building DevOps-focused tools such as dashboards, wiki automation, and bot workflows using Azure OpenAI and GitHub Copilot to improve delivery visibility and decision-making.";
    }
    
    if (lowerQ.includes('devops') || lowerQ.includes('cicd') || lowerQ.includes('pipeline')) {
        return "Experience includes Azure DevOps pipelines, release management, metrics dashboards, and workflow automation to support team delivery quality and release confidence.";
    }
    
    if (lowerQ.includes('product') || lowerQ.includes('leadership') || lowerQ.includes('management')) {
        return "Strong product management background across fitness technology, fintech, and IoT, including strategy, roadmap execution, and cross-functional delivery from concept through launch.";
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
        return "Great question. If you share the role scope and team needs, I can map relevant experience across product leadership, Scrum/release delivery, DevOps tooling, and global commercialization work.";
    }
    
    if (lowerQ.includes('contact') || lowerQ.includes('reach') || lowerQ.includes('connect')) {
        return "You can connect via LinkedIn (link in the contact section), or fill out the contact form below. For direct inquiries about opportunities, please include details about the role and team.";
    }

    return "That's a great question! I can help you explore the career history, technical expertise, products built, or discuss potential fit for opportunities. What would you like to know more about?";
}

/**
 * Contact Form Handler
 */
// Contact form removed - using direct links instead (LinkedIn, GitHub, Email)

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
    window.renderLocations = renderLocations;
}
