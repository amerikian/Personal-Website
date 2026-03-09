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
 * AI Chat Widget Functionality - Enhanced for Recruiters & Hiring Managers
 */
function initChat() {
    const chatWidget = document.getElementById('chat-widget');
    const openChatBtn = document.getElementById('open-chat');
    const closeChatBtn = document.getElementById('close-chat');
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-message');
    const chatMessages = document.getElementById('chat-messages');
    const clearChatBtn = document.getElementById('clear-chat');
    const exportChatBtn = document.getElementById('export-chat');
    const uploadBtn = document.getElementById('upload-jd-btn');
    const fileInput = document.getElementById('jd-file-input');
    const filePreview = document.getElementById('file-preview');
    const fileName = document.getElementById('file-name');
    const removeFileBtn = document.getElementById('remove-file');
    const charCount = document.getElementById('char-count');

    if (!chatWidget || !openChatBtn) return;

    let isSending = false;
    let backendChecked = false;
    let backendAvailable = false;
    let backendUnavailableNotified = false;
    let uploadedFileContent = null;
    let uploadedFileName = null;
    const MAX_CLIENT_MESSAGE_LENGTH = 3500;
    const MAX_FILE_SIZE = 100 * 1024; // 100KB max file size
    const conversationHistory = [];

    const SWA_API_BASE = 'https://salmon-rock-093cc6a0f.6.azurestaticapps.net';
    const host = window.location.hostname;
    const isLocal = host === 'localhost' || host === '127.0.0.1';
    const isGitHubPages = host.endsWith('github.io');
    const API_BASE = (isLocal || isGitHubPages) ? SWA_API_BASE : '';

    // Open chat
    openChatBtn.addEventListener('click', () => {
        chatWidget.classList.add('active');
        chatInput?.focus();
    });

    // Close chat
    closeChatBtn?.addEventListener('click', () => {
        chatWidget.classList.remove('active');
    });

    // Character count
    chatInput?.addEventListener('input', () => {
        const len = chatInput.value.length;
        if (charCount) {
            charCount.textContent = `${len}/3500`;
            charCount.classList.toggle('warning', len > 3000);
            charCount.classList.toggle('error', len > 3500);
        }
    });

    // Clear chat functionality
    clearChatBtn?.addEventListener('click', () => {
        if (confirm('Clear conversation history?')) {
            const welcomeMsg = chatMessages?.querySelector('.chat-message.bot');
            if (chatMessages) {
                chatMessages.innerHTML = '';
                if (welcomeMsg) chatMessages.appendChild(welcomeMsg.cloneNode(true));
                attachSuggestionListeners();
            }
            conversationHistory.length = 0;
            clearUploadedFile();
        }
    });

    // Export chat functionality
    exportChatBtn?.addEventListener('click', () => {
        if (conversationHistory.length === 0) {
            alert('No conversation to export yet.');
            return;
        }
        
        const timestamp = new Date().toISOString().split('T')[0];
        let exportText = `Ian Cassiman - Career Assistant Conversation\nExported: ${timestamp}\n${'='.repeat(50)}\n\n`;
        
        conversationHistory.forEach((msg) => {
            const role = msg.role === 'user' ? 'You' : 'Career Assistant';
            exportText += `[${role}]\n${msg.content}\n\n`;
        });
        
        exportText += `${'='.repeat(50)}\nConnect: linkedin.com/in/iancassiman\n`;
        
        const blob = new Blob([exportText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ian-cassiman-chat-${timestamp}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    });

    // File upload functionality
    uploadBtn?.addEventListener('click', () => {
        fileInput?.click();
    });

    fileInput?.addEventListener('change', async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > MAX_FILE_SIZE) {
            alert('File too large. Please use a file under 100KB.');
            fileInput.value = '';
            return;
        }

        const ext = file.name.split('.').pop()?.toLowerCase();
        if (!['txt', 'pdf', 'doc', 'docx'].includes(ext)) {
            alert('Please upload a TXT, PDF, DOC, or DOCX file.');
            fileInput.value = '';
            return;
        }

        try {
            let content = '';
            
            if (ext === 'txt') {
                content = await file.text();
            } else {
                // For PDF/DOC/DOCX, prompt to paste content
                alert(
                    `${ext.toUpperCase()} detected: "${file.name}"\n\n` +
                    `For best results, please open the document, copy the job description text, ` +
                    `and paste it directly into the chat.`
                );
                fileInput.value = '';
                return;
            }

            if (content && content.trim().length > 50) {
                uploadedFileContent = content.trim();
                uploadedFileName = file.name;
                
                if (filePreview && fileName) {
                    fileName.textContent = file.name;
                    filePreview.style.display = 'flex';
                }
                
                // Auto-populate analysis prompt
                if (chatInput) {
                    chatInput.value = `Please analyze this job description for fit:\n\n${uploadedFileContent.substring(0, 2800)}`;
                    chatInput.dispatchEvent(new Event('input'));
                }
            } else {
                alert('Could not extract text. Please paste the job description directly.');
            }
        } catch (err) {
            console.error('File read error:', err);
            alert('Error reading file. Please paste the job description text directly.');
        }
        
        fileInput.value = '';
    });

    // Remove uploaded file
    removeFileBtn?.addEventListener('click', clearUploadedFile);

    function clearUploadedFile() {
        uploadedFileContent = null;
        uploadedFileName = null;
        if (filePreview) filePreview.style.display = 'none';
        if (chatInput) {
            chatInput.value = '';
            chatInput.dispatchEvent(new Event('input'));
        }
    }

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
            addChatMessage(`Please keep messages under ${MAX_CLIENT_MESSAGE_LENGTH} characters. Consider summarizing key requirements.`, 'bot');
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
                    addChatMessage('Live AI service is temporarily unavailable. Using local responses.', 'bot');
                }

                const fallbackResponse = generateAIResponse(message);
                addChatMessage(fallbackResponse, 'bot', true);
                recordHistory('assistant', fallbackResponse);
                return;
            }

            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 20000); // Longer for JD analysis

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
                addChatMessage(botResponse, 'bot', true);
                recordHistory('assistant', botResponse);
            } else {
                const fallbackResponse = generateAIResponse(message);
                addChatMessage(fallbackResponse, 'bot', true);
                recordHistory('assistant', fallbackResponse);
            }
        } catch (error) {
            typingDiv.remove();
            const fallbackResponse = generateAIResponse(message);
            addChatMessage(fallbackResponse, 'bot', true);
            recordHistory('assistant', fallbackResponse);
        } finally {
            isSending = false;
            if (sendBtn) sendBtn.disabled = false;
            chatInput?.focus();
        }
    };

    sendBtn?.addEventListener('click', sendMessage);
    chatInput?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // Suggestion chip handler
    function attachSuggestionListeners() {
        document.querySelectorAll('.suggestion-chip').forEach(chip => {
            chip.addEventListener('click', () => {
                const question = chip.dataset.question;
                if (question && chatInput) {
                    chatInput.value = question;
                    sendMessage();
                }
            });
        });

        // Upload prompt click handler
        document.querySelectorAll('.upload-prompt').forEach(prompt => {
            prompt.addEventListener('click', () => {
                uploadBtn?.click();
            });
        });
    }

    attachSuggestionListeners();
}

/**
 * Add message to chat with optional copy button and simple markdown
 */
function addChatMessage(message, type, showCopy = false) {
    const chatMessages = document.getElementById('chat-messages');
    if (!chatMessages) return;

    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${type}`;
    
    // Simple markdown-like rendering for bot messages
    let formattedMessage = message;
    if (type === 'bot') {
        formattedMessage = formatBotMessage(message);
    }

    messageDiv.innerHTML = `
        <div class="message-avatar">
            <i class="fas fa-${type === 'bot' ? 'robot' : 'user'}"></i>
        </div>
        <div class="message-content">
            ${type === 'bot' ? formattedMessage : '<p></p>'}
            ${showCopy && type === 'bot' ? `
                <button class="copy-response-btn" title="Copy response">
                    <i class="fas fa-copy"></i>
                </button>
            ` : ''}
        </div>
    `;

    // For user messages, set text content safely
    if (type === 'user') {
        const textNode = messageDiv.querySelector('.message-content p');
        if (textNode) {
            textNode.textContent = message;
        }
    }

    // Add copy functionality
    if (showCopy && type === 'bot') {
        const copyBtn = messageDiv.querySelector('.copy-response-btn');
        copyBtn?.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(message);
                copyBtn.innerHTML = '<i class="fas fa-check"></i>';
                copyBtn.classList.add('copied');
                setTimeout(() => {
                    copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
                    copyBtn.classList.remove('copied');
                }, 2000);
            } catch (err) {
                console.error('Copy failed:', err);
            }
        });
    }

    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

/**
 * Format bot message with simple markdown-like rendering
 */
function formatBotMessage(text) {
    // Escape HTML first
    let html = text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    
    // Headers (**text** -> bold)
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    
    // Bullet points
    html = html.replace(/^[•\-]\s+(.+)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>\n?)+/gs, '<ul>$&</ul>');
    
    // Numbered lists
    html = html.replace(/^\d+\.\s+(.+)$/gm, '<li>$1</li>');
    
    // Line breaks for paragraphs
    html = html.replace(/\n\n/g, '</p><p>');
    html = html.replace(/\n/g, '<br>');
    
    // Wrap in paragraph if not already structured
    if (!html.startsWith('<')) {
        html = `<p>${html}</p>`;
    }
    
    return html;
}

/**
 * Generate AI Response (Client-side fallback when backend is unavailable)
 */
function generateAIResponse(question) {
    const lowerQ = question.toLowerCase();
    const hasAny = (terms) => terms.some(term => lowerQ.includes(term));

    // Job description analysis (if message is long, assume it's a JD)
    if (question.length > 500 || hasAny(['job description', 'jd:', 'responsibilities:', 'requirements:', 'qualifications:'])) {
        return `**Job Description Analysis**

I've received your job description. Here's a quick assessment:

**Likely Strong Fit Areas:**
• Product/Delivery Leadership - 20+ years with $100M P&L experience
• Agile/Scrum - PMP, CSM, SAFe 6.0 certified, currently leading 2 scrum teams
• Cross-functional Execution - Global experience across 7+ countries
• Technical Product Work - Recent AI/DevOps tools, dashboard development

**Recommended Interview Focus:**
• Specific domain knowledge requirements for your industry
• Team size and reporting structure expectations
• Technical depth vs. leadership breadth balance

For a detailed fit score and gap analysis, please ensure the AI service is available, or connect directly via LinkedIn.`;
    }

    if (hasAny(['experience', 'years'])) {
        return `Ian brings ${careerData.stats.years}+ years across ${careerData.stats.countries} countries. The strongest throughline is product leadership + delivery execution + Agile governance, so teams usually place him where roadmap clarity and release reliability both matter.`;
    }
    
    if (hasAny(['ai', 'copilot', 'machine learning', 'bot'])) {
        return `**Recent AI Work:**
• DevOps dashboards with 12+ visualizations
• Wiki automation system generating 153 documentation pages
• Teams bot using RAG patterns for delivery teams

The focus is practical workflow impact—surface delivery signals, reduce reporting friction, and improve decision speed for Scrum and release leaders.`;
    }
    
    if (hasAny(['devops', 'cicd', 'ci/cd', 'pipeline', 'release'])) {
        return 'Experience includes Azure DevOps pipelines, release management, and metrics dashboards. Stronger visibility leads to earlier risk detection, which improves release predictability and team confidence.';
    }
    
    if (hasAny(['product', 'leadership', 'management', 'roadmap'])) {
        return 'The product leadership profile spans fitness technology, fintech, insurance innovation, and consulting. Core pattern: define clear value, align stakeholders, and execute launch plans with measurable outcomes across cross-functional teams.';
    }

    if (hasAny(['strength', 'best', 'top'])) {
        return `**Top 3 Strengths:**

**1. Product-Line Ownership** - $100M global line, 3 innovation awards, 2 patents

**2. Delivery Leadership** - SAFe execution across 2 teams, release governance

**3. Global Business Acumen** - VP in SE Asia, CEO of Stockholm-listed fintech, 7+ countries`;
    }

    if (hasAny(['education', 'university', 'study abroad', 'gpa', 'mba'])) {
        return `**Education:**
• MBA International Business - UW-Whitewater (3.41 GPA)
• BA International/Global Studies - UW-Stevens Point (3.13 GPA)
• Study abroad: Poland/Russia

This supports globally-facing roles: business rigor + cross-cultural fluency + practical commercialization experience.`;
    }

    if (hasAny(['certification', 'certifications', 'pmp', 'safe', 'scrum', 'csm'])) {
        return `**Certifications:**
• PMP (Project Management Professional)
• CSM (Certified Scrum Master)
• SAFe 6.0 Practitioner
• Product Management Professional
• Google Data Analytics

Practical impact: governance + delivery discipline for better planning quality and reliable multi-team execution.`;
    }

    if (hasAny(['company', 'employer', 'worked at', 'background'])) {
        return `**Career History:**
• RSM US LLP (2022-Present) - Scrum Master/Release Manager
• SKY Consulting (2017-2021) - Owner/CEO, Fintech
• Johnson Health Tech Thailand (2015-2017) - VP Commercial Sales
• American Family Insurance (2014-2015) - Innovation PM
• Pacific Cycle (2012-2014) - PM, 2 patents
• Johnson Health Tech NA (2006-2012) - Global PM, $100M line

Experience spans enterprise services, consumer products, and innovation programs.`;
    }
    
    if (hasAny(['location', 'global', 'remote', 'countries'])) {
        const locations = careerData.locations.map(l => l.country).join(', ');
        return `Global experience spans ${locations}. That background supports distributed-team collaboration, market adaptation, and communication across cultural and functional boundaries.`;
    }
    
    if (hasAny(['hire', 'fit', 'role', 'opportunity'])) {
        return `**Role Fit Assessment:**

Profile fits roles requiring:
• Product strategy + execution
• Agile/SAFe delivery leadership
• Technical product ownership

**Strongest Evidence:**
• $100M product line
• PMP/CSM/SAFe certifications
• Current AI tool development

Share a specific job description for targeted analysis.`;
    }

    if (hasAny(['risk', 'gap', 'mitigate', 'mitigation', 'weakness', 'concern'])) {
        return `**Potential Gap:** Breadth vs. single-domain depth—profile spans multiple industries.

**Mitigation Evidence:**
• $100M product line (proves scale)
• 2 patents (proves innovation execution)
• VP/CEO leadership (proves accountability)
• Repeated pattern of entering new domains and delivering measurable results within 12-18 months`;
    }

    if (hasAny(['recruiter summary', '3-bullet', 'three bullet', 'summary', 'tldr'])) {
        return `**Recruiter Summary:**

• **Experience:** 20+ years product/delivery leadership with $100M P&L
• **Credentials:** MBA (3.41 GPA), PMP, CSM, SAFe 6.0, 2 patents, 3 awards
• **Current:** AI/DevOps tools at RSM; Prior: VP SE Asia, CEO Stockholm fintech
• **Best Fit:** Senior PM, Product Lead, Director roles`;
    }

    if (hasAny(['patent', 'invention', 'intellectual property'])) {
        return `**2 U.S. Patents from Pacific Cycle (Schwinn/Mongoose):**

1. EASY-CONNECT ATTACHMENT HEAD AND ADAPTER
2. Modular accessory connector

One became a Walmart-exclusive product, demonstrating commercial viability.`;
    }
    
    if (hasAny(['contact', 'reach', 'connect', 'email', 'linkedin'])) {
        return `**Connect:**
• LinkedIn: linkedin.com/in/iancassiman
• Use the contact section on this site

For faster alignment, include role scope, team size, product stage, and timeline.`;
    }

    if (hasAny(['salary', 'compensation', 'pay'])) {
        return 'Compensation discussions are best handled directly. Please connect via LinkedIn with role details, location, and structure (base/bonus/equity) for relevant expectations.';
    }

    if (hasAny(['available', 'start', 'notice', 'timeline'])) {
        return 'For availability and start date discussions, please connect directly via LinkedIn or the contact form. Timeline flexibility depends on the specific opportunity.';
    }

    return `I can help with:
• **Career history** - 20+ years across 7+ countries
• **Achievements** - $100M product line, 2 patents, 3 awards
• **Role fit analysis** - Upload a job description for assessment
• **Strengths & gaps** - Honest evaluation with evidence
• **Recruiter summary** - Quick talking points

Try asking about a specific role, capability, or upload a job description for detailed fit analysis.`;
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
