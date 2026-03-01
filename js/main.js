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
    const certificationKeywords = /certification|certificate|pmp|safe|scrum|csm|practitioner/i;
    const assessedCertEntries = educationResearch.filter(item => {
        const institution = item.institution || '';
        const degree = item.degree || '';
        return certificationKeywords.test(institution) || certificationKeywords.test(degree);
    });
    const listedCertEntries = (careerData?.certifications || []).filter(item => certificationKeywords.test(item));
    const uniqueCredentialCount = new Set([
        ...assessedCertEntries.map(item => `${item.institution}|${item.degree}`),
        ...listedCertEntries
    ]).size;
    const certificationHighlights = Array.from(new Set([
        ...assessedCertEntries.map(item => item.institution || item.degree || ''),
        ...listedCertEntries
    ]))
        .map(item => item.trim())
        .filter(Boolean)
        .slice(0, 3)
        .map(item => `Credential: ${item}`);

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
            label: 'Grad Credits',
            value: typeof mbaProfile?.cumulativeCredits === 'number' ? `${Math.round(mbaProfile.cumulativeCredits)}` : '—'
        },
        {
            label: 'Cert Credentials',
            value: uniqueCredentialCount > 0 ? `${uniqueCredentialCount}+` : '—'
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
                    ${[
                        ...(summary.employerFitSignals || []),
                        ...certificationHighlights
                    ].map(signal => `<span class="assessment-pill">${signal}</span>`).join('')}
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

function formatLocationYears(years) {
    const value = `${years ?? ''}`.trim();
    if (!value) return '';
    if (/year/i.test(value)) return value;
    return `${value} years`;
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
                <p>${location.cities.join(' • ')} • ${formatLocationYears(location.years)}</p>
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
    const MAX_CLIENT_MESSAGE_LENGTH = 1200;
    const conversationHistory = [];

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

    const recordHistory = (role, content) => {
        if (!content) return;
        conversationHistory.push({ role, content: String(content).trim() });
        if (conversationHistory.length > 12) {
            conversationHistory.splice(0, conversationHistory.length - 12);
        }
    };

    // Send message
    const sendMessage = async () => {
        if (isSending) return;

        const message = chatInput?.value.trim();
        if (!message) return;

        if (message.length > MAX_CLIENT_MESSAGE_LENGTH) {
            addChatMessage(`Please keep messages under ${MAX_CLIENT_MESSAGE_LENGTH} characters so I can respond accurately.`, 'bot');
            return;
        }

        isSending = true;
        if (sendBtn) sendBtn.disabled = true;

        // Add user message
        addChatMessage(message, 'user');
        recordHistory('user', message);
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

                const fallbackResponse = generateAIResponse(message);
                addChatMessage(fallbackResponse, 'bot');
                recordHistory('assistant', fallbackResponse);
                return;
            }

            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 12000);

            let response;
            try {
                response = await fetch(`${API_BASE}/api/chat`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        message,
                        history: conversationHistory.slice(-8)
                    }),
                    signal: controller.signal
                });
            } finally {
                clearTimeout(timeout);
            }

            typingDiv.remove();

            if (response.ok) {
                const data = await response.json();
                const botResponse = data.response || generateAIResponse(message);
                addChatMessage(botResponse, 'bot');
                recordHistory('assistant', botResponse);
            } else {
                // Fallback to local response if API fails
                const fallbackResponse = generateAIResponse(message);
                addChatMessage(fallbackResponse, 'bot');
                recordHistory('assistant', fallbackResponse);
            }
        } catch (error) {
            typingDiv.remove();
            // Fallback to local response if API unavailable
            const fallbackResponse = generateAIResponse(message);
            addChatMessage(fallbackResponse, 'bot');
            recordHistory('assistant', fallbackResponse);
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
    const hasAny = (terms) => terms.some(term => lowerQ.includes(term));

    if (hasAny(['experience', 'years'])) {
        return `Ian brings ${careerData.stats.years}+ years across ${careerData.stats.countries} countries. The strongest throughline is product leadership + delivery execution + Agile governance, so teams usually place him where roadmap clarity and release reliability both matter. If helpful, I can break this down by company and outcomes.`;
    }
    
    if (hasAny(['ai', 'copilot', 'machine learning', 'bot'])) {
        return 'Recent AI work focuses on practical workflow impact: DevOps dashboards, wiki automation, and chat-style assistance for delivery teams. The reasoning pattern is simple—surface delivery signals, reduce reporting friction, and improve decision speed for Scrum and release leaders.';
    }
    
    if (hasAny(['devops', 'cicd', 'ci/cd', 'pipeline', 'release'])) {
        return 'Experience includes Azure DevOps pipelines, release management, and metrics dashboards. At a basic reasoning level: stronger visibility leads to earlier risk detection, which improves release predictability and team confidence.';
    }
    
    if (hasAny(['product', 'leadership', 'management', 'roadmap'])) {
        return 'The product leadership profile spans fitness technology, fintech, insurance innovation, and consulting. Core pattern: define clear value, align stakeholders, and execute launch plans with measurable outcomes across cross-functional teams.';
    }

    if (hasAny(['education', 'university', 'study abroad', 'gpa', 'mba'])) {
        return 'Education includes an MBA (3.41 GPA, 39 graduate credits) and BA International/Global Studies (3.13 GPA) with Poland/Russia study context. This supports basic hiring logic for globally-facing roles: business rigor + cross-cultural fluency + practical commercialization experience.';
    }

    if (hasAny(['certification', 'certifications', 'pmp', 'safe', 'scrum', 'csm'])) {
        return 'Certification evidence includes PMP and Agile-oriented credentials (including Scrum/SAFe coverage in the assessment). Practical impact is governance + delivery discipline: better planning quality, clearer risk control, and more reliable multi-team execution.';
    }

    if (hasAny(['company', 'employer', 'worked at', 'background'])) {
        return 'Experience spans RSM, Johnson Health Tech, American Family Insurance, SportsArt, Pacific Cycle, and entrepreneurial consulting. The range covers enterprise services, consumer products, and innovation programs, which is useful for roles needing both strategic and hands-on execution depth.';
    }
    
    if (hasAny(['location', 'global', 'remote', 'countries'])) {
        const locations = careerData.locations.map(l => l.country).join(', ');
        return `Global experience spans ${locations}. That background supports distributed-team collaboration, market adaptation, and communication across cultural and functional boundaries.`;
    }
    
    if (hasAny(['hire', 'fit', 'role', 'opportunity'])) {
        return 'Basic fit reasoning: (1) product strategy and portfolio ownership, (2) Agile + release execution, and (3) global commercialization exposure. Share your role scope and I can map strengths, potential gaps, and interview focus areas in a concise checklist.';
    }

    if (hasAny(['risk', 'gap', 'mitigate', 'mitigation'])) {
        return 'A likely gap for some roles is deep single-domain tenure if the team wants only one-industry specialists. Mitigation: frame transferability with concrete outcomes (e.g., $100M product-line ownership, release governance at RSM, and cross-market commercialization) and align examples to your domain priorities.';
    }

    if (hasAny(['recruiter summary', '3-bullet', 'three bullet', 'summary'])) {
        return '• 20+ years spanning product leadership, Agile delivery, and release governance across enterprise and consumer contexts.\n• Evidence-backed profile: MBA 3.41 GPA (39 grad credits), BA International/Global Studies 3.13 GPA, plus certification strength (PMP + Agile coverage).\n• Demonstrated impact includes $100M product-line ownership, global commercialization exposure, and cross-functional execution in RSM, Johnson Health Tech, and other major organizations.';
    }
    
    if (hasAny(['contact', 'reach', 'connect'])) {
        return 'You can connect via LinkedIn or the contact section. For faster alignment, include role scope, team size, product stage, and timeline so the response can be tailored to your hiring goals.';
    }

    return 'I can help with career history, product impact, certifications, and role-fit reasoning at a basic level. If you share a specific role or question, I’ll return a concise strengths-and-risks assessment.';
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
