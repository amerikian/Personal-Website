const { app } = require('@azure/functions');

// ================== CHAT FUNCTION ==================

const careerContext = `
You are Ian Cassiman's Career Intelligence Assistant. You help recruiters, hiring managers, and HR professionals quickly assess candidate fit and surface evidence-based insights.

PROFILE SUMMARY:
- Name: Ian Cassiman | Current: Scrum Master & Release Manager, RSM US LLP (2022-Present)
- Experience: 20+ years product leadership, delivery management, innovation
- Education: MBA UW-Whitewater (3.41 GPA), BA International Studies UW-Stevens Point (3.13 GPA)
- Certifications: PMP, CSM, SAFe 6.0, Product Management Professional, Google Data Analytics

KEY QUANTIFIED ACHIEVEMENTS:
• $100M Product Line Ownership — Johnson Health Tech, Vision/Matrix Fitness cardiovascular (2006-2012)
• 2 U.S. Patents — Pacific Cycle (Schwinn/Mongoose), one Walmart-exclusive
• 3 Product Innovation Awards — Johnson Health Tech, including industry-first iPod dock
• 153 Auto-Generated Wiki Pages — RSM, DevOps AI documentation system
• VP Commercial Sales SE Asia — Johnson Health Tech Thailand, first Marriott deal, expanded to Myanmar/Cambodia
• CEO Stockholm-Listed Fintech — Sprinkle Group via SKY Consulting

EMPLOYER HISTORY (chronological):
• RSM US LLP (2022-Present): Scrum Master/Release Manager, 2 teams, AI tools, DevOps dashboards
• SKY CONSULTING (2017-2021): Owner/CEO, fintech, blockchain, CEO Sprinkle Group
• Johnson Health Tech Thailand (2015-2017): VP Commercial Sales, SE Asia expansion
• American Family Insurance (2014-2015): Innovation PM, IoT/Smart Home, Lean Startup
• SportsArt (2014): Senior PM, global commercial fitness, rebranding
• Pacific Cycle (2012-2014): PM, 2 patents, Target/Walmart
• Johnson Health Tech NA (2006-2012): Global PM, $100M line, 3 awards

TECHNICAL & LEADERSHIP SKILLS:
Product: Strategy, Roadmapping, P&L Ownership, Launch Planning, Cross-functional Leadership
Delivery: SAFe/Scrum, Release Management, Azure DevOps, CI/CD, Agile Coaching
Technical: JavaScript, Python, GitHub Copilot, RAG patterns, Dashboard Development, API Integration
Industries: Fintech, Blockchain, Fitness Tech, Insurance, IoT, Consumer Products, Consulting

GLOBAL EXPERIENCE:
USA (18+ years), Thailand (7 years), Taiwan, China, Sweden, Poland, Russia
Languages: English (native), Thai (conversational)

JOB DESCRIPTION ANALYSIS MODE:
When a user shares a job description, analyze it against Ian's profile and provide:
1. FIT SCORE (0-100): Overall alignment with role requirements
2. STRENGTHS MATCH: Specific requirements Ian exceeds with evidence
3. TRANSFERABLE SKILLS: Adjacent experience that applies
4. POTENTIAL GAPS: Honest assessment of missing requirements
5. TALKING POINTS: Key interview discussion areas
6. RED FLAGS: Any concerns the hiring team might raise
7. RECOMMENDATION: Hire/Consider/Pass with reasoning

RESPONSE GUIDELINES:
1. Lead with a direct, actionable answer
2. Cite specific evidence (companies, metrics, outcomes)
3. For role questions, map requirements to profile evidence
4. Flag gaps honestly if info is missing
5. Keep responses to 3-6 sentences unless detail is requested
6. Use bullet points for clarity when listing items
7. Encourage connecting via LinkedIn or contact form when appropriate

Be helpful, accurate, candid, and professional. You represent Ian to potential employers.
`;

const REQUEST_TIMEOUT_MS = 25000;
const MAX_MESSAGE_LENGTH = 4000;
const MAX_HISTORY_MESSAGES = 10;

function normalizeHistory(history) {
    if (!Array.isArray(history)) return [];
    return history
        .filter(item => item && typeof item.content === 'string' && (item.role === 'user' || item.role === 'assistant'))
        .slice(-MAX_HISTORY_MESSAGES)
        .map(item => ({ role: item.role, content: item.content.trim().slice(0, MAX_MESSAGE_LENGTH) }))
        .filter(item => item.content.length > 0);
}

function withTimeout(url, options = {}, timeoutMs = REQUEST_TIMEOUT_MS) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    return fetch(url, { ...options, signal: controller.signal }).finally(() => clearTimeout(timer));
}

async function callGitHubModels(token, userMessage, history = []) {
    const isJDAnalysis = userMessage.length > 500 || userMessage.toLowerCase().includes('job description');
    const response = await withTimeout('https://models.inference.ai.azure.com/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [{ role: 'system', content: careerContext }, ...history, { role: 'user', content: userMessage }],
            max_tokens: isJDAnalysis ? 1000 : 600,
            temperature: 0.3
        })
    });
    if (!response.ok) throw new Error(`GitHub Models API error: ${response.status}`);
    const data = await response.json();
    return data?.choices?.[0]?.message?.content || generateFallbackResponse(userMessage);
}

async function callAzureOpenAI(endpoint, apiKey, deploymentName, userMessage, history = []) {
    const url = `${endpoint}/openai/deployments/${deploymentName}/chat/completions?api-version=2024-02-15-preview`;
    const isJDAnalysis = userMessage.length > 500 || userMessage.toLowerCase().includes('job description');
    const response = await withTimeout(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'api-key': apiKey },
        body: JSON.stringify({
            messages: [{ role: 'system', content: careerContext }, ...history, { role: 'user', content: userMessage }],
            max_tokens: isJDAnalysis ? 1000 : 600,
            temperature: 0.3
        })
    });
    if (!response.ok) throw new Error(`OpenAI API error: ${response.status}`);
    const data = await response.json();
    return data?.choices?.[0]?.message?.content || generateFallbackResponse(userMessage);
}

function generateFallbackResponse(question) {
    const lowerMessage = question.toLowerCase();
    const hasAny = (keywords) => keywords.some(kw => lowerMessage.includes(kw));

    if (question.length > 500 || hasAny(['job description', 'jd:', 'position:', 'responsibilities:', 'requirements:'])) {
        return `**Job Description Analysis**\n\nI've received your job description. Here's a quick assessment:\n\n**Likely Strong Fit Areas:**\n• Product/Delivery Leadership - 20+ years with $100M P&L experience\n• Agile/Scrum - PMP, CSM, SAFe 6.0 certified, currently leading 2 scrum teams\n• Cross-functional Execution - Global experience across 7+ countries\n• Technical Product Work - Recent AI/DevOps tools, dashboard development\n\n**Recommended Interview Focus:**\n• Specific domain knowledge requirements for your industry\n• Team size and reporting structure expectations\n• Technical depth vs. leadership breadth balance\n\nFor a detailed fit score and gap analysis, please ensure the AI service is available, or reach out directly via LinkedIn for a personalized discussion.`;
    }
    if (hasAny(['experience', 'years', 'background'])) return "Ian brings 20+ years across product management, Scrum leadership, and release delivery. Key evidence: $100M product line at Johnson Health Tech, VP Commercial Sales in SE Asia, and current AI/DevOps innovation at RSM.";
    if (hasAny(['ai', 'copilot', 'bot', 'automation'])) return "At RSM, Ian built: (1) a DevOps dashboard with 12+ visualizations, (2) an automated wiki system generating 153 documentation pages, and (3) a Teams bot using RAG patterns. These tools improved visibility and decision speed for 2 scrum teams.";
    if (hasAny(['strength', 'best', 'top'])) return `**Top 3 Strengths:**\n\n1. **Product-Line Ownership** - $100M global line, 3 innovation awards, 2 patents\n2. **Delivery Leadership** - SAFe execution across 2 teams, release governance\n3. **Global Business Acumen** - VP in SE Asia, CEO of Stockholm-listed fintech, 7+ countries`;
    if (hasAny(['fit', 'hire', 'role', 'opportunity'])) return "Profile fits roles requiring: product strategy + execution, Agile/SAFe delivery leadership, or technical product ownership. Strongest evidence: $100M product line, PMP/CSM/SAFe certifications, current AI tool development. Share a specific role or job description for targeted analysis.";
    if (hasAny(['risk', 'gap', 'weak', 'concern', 'mitigate', 'mitigation'])) return `**Potential Gap:** Breadth vs. single-domain depth—profile spans multiple industries.\n\n**Mitigation:** Anchor on transferable outcomes:\n• $100M product line (proves scale)\n• 2 patents (proves innovation execution)\n• VP/CEO leadership (proves accountability)\n• Repeated pattern of entering new domains and delivering measurable results within 12-18 months`;
    if (hasAny(['recruiter', 'summary', 'bullet', 'tldr'])) return `**Recruiter Summary:**\n\n• **Experience:** 20+ years product/delivery leadership with $100M P&L experience\n• **Credentials:** MBA (3.41 GPA), PMP, CSM, SAFe 6.0, 2 patents, 3 awards\n• **Current:** AI/DevOps tools at RSM; Prior: VP SE Asia, CEO Stockholm fintech\n• **Best Fit:** Senior PM, Product Lead, Director of Product, Delivery Lead roles`;
    if (hasAny(['patent', 'invention'])) return `**2 U.S. Patents from Pacific Cycle (Schwinn/Mongoose):**\n\n1. EASY-CONNECT ATTACHMENT HEAD AND ADAPTER\n2. Modular accessory connector\n\nOne became a Walmart-exclusive product, demonstrating commercial viability.`;
    if (hasAny(['education', 'degree', 'mba', 'school', 'certif'])) return `**Education:**\n• MBA International Business - UW-Whitewater (3.41 GPA)\n• BA International Studies - UW-Stevens Point (3.13 GPA) with study abroad in Poland/Russia\n\n**Certifications:**\n• PMP (Project Management Professional)\n• CSM (Certified Scrum Master)\n• SAFe 6.0 Practitioner\n• Product Management Professional\n• Google Data Analytics`;
    if (hasAny(['contact', 'connect', 'reach', 'email'])) return "Best ways to connect: LinkedIn (linkedin.com/in/iancassiman) or the contact form on this site. Include role context and timeline for a focused response.";
    if (hasAny(['salary', 'compensation', 'pay'])) return "Compensation discussions are best handled directly. Please reach out via LinkedIn with the role details, location, and structure (base/bonus/equity) and Ian can provide relevant expectations based on the specific opportunity.";
    if (hasAny(['available', 'start', 'notice', 'timeline'])) return "For availability and start date discussions, please connect directly via LinkedIn or the contact form. Timeline flexibility depends on the specific opportunity and transition requirements.";
    return `I can help with:\n• **Career history** - 20+ years across 7+ countries\n• **Achievements** - $100M product line, 2 patents, 3 awards\n• **Role fit analysis** - Upload a job description for assessment\n• **Strengths & gaps** - Honest evaluation with evidence\n• **Interview prep** - Key talking points for your role\n\nTry asking about a specific role, capability, or upload a job description for detailed fit analysis.`;
}

// Chat function
app.http('chat', {
    methods: ['POST', 'OPTIONS'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        const corsHeaders = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        };

        if (request.method === 'OPTIONS') {
            return { status: 204, headers: corsHeaders };
        }

        try {
            const body = await request.json();
            const message = (body?.message || '').trim();
            const history = normalizeHistory(body?.history);

            if (!message) {
                return { status: 400, headers: corsHeaders, jsonBody: { error: 'Message is required' } };
            }
            if (message.length > MAX_MESSAGE_LENGTH) {
                return { status: 400, headers: corsHeaders, jsonBody: { error: `Message must be ${MAX_MESSAGE_LENGTH} characters or less` } };
            }

            // Check for GitHub Models first (free)
            const githubToken = process.env.GITHUB_TOKEN;
            if (githubToken) {
                try {
                    const response = await callGitHubModels(githubToken, message, history);
                    return { status: 200, headers: corsHeaders, jsonBody: { response, source: 'github-models' } };
                } catch (err) {
                    context.warn('GitHub Models failed, trying fallback:', err.message);
                }
            }

            // Check for Azure OpenAI
            const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
            const apiKey = process.env.AZURE_OPENAI_KEY;
            const deploymentName = process.env.AZURE_OPENAI_DEPLOYMENT_NAME;
            if (endpoint && apiKey && deploymentName) {
                try {
                    const response = await callAzureOpenAI(endpoint, apiKey, deploymentName, message, history);
                    return { status: 200, headers: corsHeaders, jsonBody: { response, source: 'azure-openai' } };
                } catch (err) {
                    context.warn('Azure OpenAI failed, trying fallback:', err.message);
                }
            }

            // Fallback response
            return { status: 200, headers: corsHeaders, jsonBody: { response: generateFallbackResponse(message), source: 'fallback' } };

        } catch (error) {
            context.error('Chat API error:', error);
            return { status: 500, headers: corsHeaders, jsonBody: { error: 'Failed to generate response' } };
        }
    }
});

// ================== CONTACT FUNCTION ==================

// Contact function
app.http('contact', {
    methods: ['POST', 'OPTIONS'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        const corsHeaders = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        };

        if (request.method === 'OPTIONS') {
            return { 
                status: 204,
                headers: corsHeaders
            };
        }

        try {
            const body = await request.json();
            const { name, email, message } = body || {};

            if (!name || !email || !message) {
                return {
                    status: 400,
                    headers: corsHeaders,
                    jsonBody: { error: 'Name, email, and message are required.' }
                };
            }

            const sendgridApiKey = process.env.SENDGRID_API_KEY;
            const toEmail = process.env.CONTACT_TO_EMAIL;
            const fromEmail = process.env.CONTACT_FROM_EMAIL;

            if (!sendgridApiKey || !toEmail || !fromEmail) {
                return {
                    status: 503,
                    headers: corsHeaders,
                    jsonBody: { error: 'Contact service is not configured yet.' }
                };
            }

            const payload = {
                personalizations: [{ to: [{ email: toEmail }], subject: `Portfolio Contact: ${name}` }],
                from: { email: fromEmail, name: 'Portfolio Contact Form' },
                reply_to: { email, name },
                content: [{ type: 'text/plain', value: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}` }]
            };

            const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${sendgridApiKey}` },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                return { status: 502, headers: corsHeaders, jsonBody: { error: 'Failed to send message.' } };
            }

            return { status: 200, headers: corsHeaders, jsonBody: { success: true } };
        } catch (error) {
            context.error('Contact API error', error);
            return { status: 500, headers: corsHeaders, jsonBody: { error: 'Unexpected error.' } };
        }
    }
});

// Health check function
app.http('health', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        return { 
            status: 200,
            jsonBody: { status: 'ok', message: 'API is reachable' }
        };
    }
});
