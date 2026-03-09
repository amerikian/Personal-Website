/**
 * Azure Function - Chat API
 * Handles AI-powered questions about the portfolio
 * Enhanced with job description analysis capabilities
 * 
 * Supports multiple AI backends:
 * 1. GitHub Models (free) - Set GITHUB_TOKEN
 * 2. Azure OpenAI - Set AZURE_OPENAI_ENDPOINT, AZURE_OPENAI_KEY, AZURE_OPENAI_DEPLOYMENT_NAME
 */

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
const MAX_MESSAGE_LENGTH = 4000; // Increased for JD content
const MAX_HISTORY_MESSAGES = 10;

function normalizeHistory(history) {
    if (!Array.isArray(history)) return [];

    return history
        .filter(item => item && typeof item.content === 'string' && (item.role === 'user' || item.role === 'assistant'))
        .slice(-MAX_HISTORY_MESSAGES)
        .map(item => ({
            role: item.role,
            content: item.content.trim().slice(0, MAX_MESSAGE_LENGTH)
        }))
        .filter(item => item.content.length > 0);
}

function withTimeout(url, options = {}, timeoutMs = REQUEST_TIMEOUT_MS) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    return fetch(url, {
        ...options,
        signal: controller.signal
    }).finally(() => clearTimeout(timer));
}

module.exports = async function (context, req) {
    context.log('Chat API triggered');

    // CORS headers for GitHub Pages
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
    };

    // Handle preflight OPTIONS request
    if (req.method === 'OPTIONS') {
        context.res = { status: 204, headers: corsHeaders };
        return;
    }

    const message = (req.body?.message || '').trim();
    const history = normalizeHistory(req.body?.history);

    if (!message) {
        context.res = {
            status: 400,
            headers: corsHeaders,
            body: { error: 'Message is required' }
        };
        return;
    }

    if (message.length > MAX_MESSAGE_LENGTH) {
        context.res = {
            status: 400,
            headers: corsHeaders,
            body: { error: `Message must be ${MAX_MESSAGE_LENGTH} characters or less` }
        };
        return;
    }

    try {
        // Check for GitHub Models first (free)
        const githubToken = process.env.GITHUB_TOKEN;
        if (githubToken) {
            const response = await callGitHubModels(githubToken, message, history);
            context.res = {
                status: 200,
                headers: corsHeaders,
                body: { response, source: 'github-models' }
            };
            return;
        }

        // Check if Azure OpenAI is configured
        const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
        const apiKey = process.env.AZURE_OPENAI_KEY;
        const deploymentName = process.env.AZURE_OPENAI_DEPLOYMENT_NAME;

        if (endpoint && apiKey && deploymentName) {
            const response = await callAzureOpenAI(endpoint, apiKey, deploymentName, message, history);
            context.res = {
                status: 200,
                headers: corsHeaders,
                body: { response, source: 'azure-openai' }
            };
            return;
        }

        // Fallback to simple responses if no AI configured
        context.res = {
            status: 200,
            headers: corsHeaders,
            body: {
                response: generateFallbackResponse(message),
                source: 'fallback'
            }
        };

    } catch (error) {
        context.log.error('Chat API error:', error);
        context.res = {
            status: 500,
            headers: corsHeaders,
            body: { error: 'Failed to generate response' }
        };
    }
};

async function callGitHubModels(token, userMessage, history = []) {
    // Detect if this is a JD analysis request (longer content)
    const isJDAnalysis = userMessage.length > 500 || userMessage.toLowerCase().includes('job description');
    
    const response = await withTimeout('https://models.inference.ai.azure.com/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: careerContext },
                ...history,
                { role: 'user', content: userMessage }
            ],
            max_tokens: isJDAnalysis ? 1000 : 600,
            temperature: 0.3
        })
    });

    if (!response.ok) {
        throw new Error(`GitHub Models API error: ${response.status}`);
    }

    const data = await response.json();
    return data?.choices?.[0]?.message?.content || generateFallbackResponse(userMessage);
}

async function callAzureOpenAI(endpoint, apiKey, deploymentName, userMessage, history = []) {
    const url = `${endpoint}/openai/deployments/${deploymentName}/chat/completions?api-version=2024-02-15-preview`;
    const isJDAnalysis = userMessage.length > 500 || userMessage.toLowerCase().includes('job description');
    
    const response = await withTimeout(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'api-key': apiKey
        },
        body: JSON.stringify({
            messages: [
                { role: 'system', content: careerContext },
                ...history,
                { role: 'user', content: userMessage }
            ],
            max_tokens: isJDAnalysis ? 1000 : 600,
            temperature: 0.3
        })
    });

    if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    return data?.choices?.[0]?.message?.content || generateFallbackResponse(userMessage);
}

function generateFallbackResponse(question) {
    const lowerMessage = question.toLowerCase();
    const hasAny = (keywords) => keywords.some(kw => lowerMessage.includes(kw));

    // Job description analysis fallback
    if (question.length > 500 || hasAny(['job description', 'jd:', 'position:', 'responsibilities:', 'requirements:'])) {
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

For a detailed fit score and gap analysis, please ensure the AI service is available, or reach out directly via LinkedIn for a personalized discussion.`;
    }

    if (hasAny(['experience', 'years', 'background'])) {
        return "Ian brings 20+ years across product management, Scrum leadership, and release delivery. Key evidence: $100M product line at Johnson Health Tech, VP Commercial Sales in SE Asia, and current AI/DevOps innovation at RSM.";
    }
    
    if (hasAny(['ai', 'copilot', 'bot', 'automation'])) {
        return "At RSM, Ian built: (1) a DevOps dashboard with 12+ visualizations, (2) an automated wiki system generating 153 documentation pages, and (3) a Teams bot using RAG patterns. These tools improved visibility and decision speed for 2 scrum teams.";
    }
    
    if (hasAny(['strength', 'best', 'top'])) {
        return `**Top 3 Strengths:**

1. **Product-Line Ownership** - $100M global line, 3 innovation awards, 2 patents
2. **Delivery Leadership** - SAFe execution across 2 teams, release governance
3. **Global Business Acumen** - VP in SE Asia, CEO of Stockholm-listed fintech, 7+ countries`;
    }

    if (hasAny(['fit', 'hire', 'role', 'opportunity'])) {
        return "Profile fits roles requiring: product strategy + execution, Agile/SAFe delivery leadership, or technical product ownership. Strongest evidence: $100M product line, PMP/CSM/SAFe certifications, current AI tool development. Share a specific role or job description for targeted analysis.";
    }

    if (hasAny(['risk', 'gap', 'weak', 'concern', 'mitigate', 'mitigation'])) {
        return `**Potential Gap:** Breadth vs. single-domain depth—profile spans multiple industries.

**Mitigation:** Anchor on transferable outcomes:
• $100M product line (proves scale)
• 2 patents (proves innovation execution)
• VP/CEO leadership (proves accountability)
• Repeated pattern of entering new domains and delivering measurable results within 12-18 months`;
    }

    if (hasAny(['recruiter', 'summary', 'bullet', 'tldr'])) {
        return `**Recruiter Summary:**

• **Experience:** 20+ years product/delivery leadership with $100M P&L experience
• **Credentials:** MBA (3.41 GPA), PMP, CSM, SAFe 6.0, 2 patents, 3 awards
• **Current:** AI/DevOps tools at RSM; Prior: VP SE Asia, CEO Stockholm fintech
• **Best Fit:** Senior PM, Product Lead, Director of Product, Delivery Lead roles`;
    }

    if (hasAny(['patent', 'invention'])) {
        return `**2 U.S. Patents from Pacific Cycle (Schwinn/Mongoose):**

1. EASY-CONNECT ATTACHMENT HEAD AND ADAPTER
2. Modular accessory connector

One became a Walmart-exclusive product, demonstrating commercial viability.`;
    }

    if (hasAny(['education', 'degree', 'mba', 'school', 'certif'])) {
        return `**Education:**
• MBA International Business - UW-Whitewater (3.41 GPA)
• BA International Studies - UW-Stevens Point (3.13 GPA) with study abroad in Poland/Russia

**Certifications:**
• PMP (Project Management Professional)
• CSM (Certified Scrum Master)
• SAFe 6.0 Practitioner
• Product Management Professional
• Google Data Analytics`;
    }

    if (hasAny(['contact', 'connect', 'reach', 'email'])) {
        return "Best ways to connect: LinkedIn (linkedin.com/in/iancassiman) or the contact form on this site. Include role context and timeline for a focused response.";
    }

    if (hasAny(['salary', 'compensation', 'pay'])) {
        return "Compensation discussions are best handled directly. Please reach out via LinkedIn with the role details, location, and structure (base/bonus/equity) and Ian can provide relevant expectations based on the specific opportunity.";
    }

    if (hasAny(['available', 'start', 'notice', 'timeline'])) {
        return "For availability and start date discussions, please connect directly via LinkedIn or the contact form. Timeline flexibility depends on the specific opportunity and transition requirements.";
    }

    return `I can help with:
• **Career history** - 20+ years across 7+ countries
• **Achievements** - $100M product line, 2 patents, 3 awards
• **Role fit analysis** - Upload a job description for assessment
• **Strengths & gaps** - Honest evaluation with evidence
• **Interview prep** - Key talking points for your role

Try asking about a specific role, capability, or upload a job description for detailed fit analysis.`;
}
