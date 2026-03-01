/**
 * Azure Function - Chat API
 * Handles AI-powered questions about the portfolio
 * 
 * Supports multiple AI backends:
 * 1. GitHub Models (free) - Set GITHUB_TOKEN
 * 2. Azure OpenAI - Set AZURE_OPENAI_ENDPOINT, AZURE_OPENAI_KEY, AZURE_OPENAI_DEPLOYMENT_NAME
 */

const careerContext = `
You are Ian Cassiman's AI assistant on his professional portfolio website.

About Ian:
- 20+ years of product leadership and innovation experience
- Currently Scrum Master & Release Manager at RSM US LLP - building DevOps AI tools
- Founded SKY CONSULTING - product management consultancy
- Former VP Commercial Sales at Johnson Health Tech (SE Asia) - frequent factory visits to Taiwan & China
- Innovation Project Manager at American Family Insurance (IoT/Smart Home)
- Senior Product Manager at SportsArt, Product Manager at Pacific Cycle (Schwinn/Mongoose)
- 2 Patents including a Walmart exclusive product
- Global experience across 9 countries (USA, Thailand, Taiwan, China, Sweden, Myanmar, Cambodia, Poland, Russia)
- Expertise: Product Management, Scrum/SAFe Agile, Azure DevOps, AI Tools (GitHub Copilot, Azure OpenAI), JavaScript, Python, Fintech, Blockchain, IoT

Your role: Answer questions about Ian's background, skills, and experience.
Be helpful, professional, and encourage visitors to connect for opportunities.
Keep responses concise (2-4 sentences) unless asked for detail.
Reason at a basic level: give a direct answer, briefly explain why based on profile evidence, then suggest a next step when relevant.
If information is missing, say so clearly and avoid guessing.
`;

const REQUEST_TIMEOUT_MS = 12000;
const MAX_MESSAGE_LENGTH = 1200;
const MAX_HISTORY_MESSAGES = 8;

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
            max_tokens: 350,
            temperature: 0.4
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
            max_tokens: 350,
            temperature: 0.4
        })
    });

    if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    return data?.choices?.[0]?.message?.content || generateFallbackResponse(userMessage);
}

function generateFallbackResponse(question) {
    const lowerQ = question.toLowerCase();
    const hasAny = (terms) => terms.some(term => lowerQ.includes(term));

    if (hasAny(['experience', 'years'])) {
        return "Ian brings 20+ years across product management, Scrum leadership, and release delivery with global exposure. This is relevant for roles that need both strategy and execution discipline. If useful, share a role and I can map experience by company and outcomes.";
    }
    
    if (hasAny(['ai', 'copilot', 'bot'])) {
        return "Recent AI work includes DevOps dashboards, wiki automation, and chat workflows. The value is practical: better visibility, faster decisions, and improved delivery alignment. I can break this down by tool and business outcome.";
    }
    
    if (hasAny(['fit', 'hire', 'role', 'opportunity'])) {
        return "Basic fit reasoning: strong in product strategy, Agile execution, and release governance across multiple industries. This profile fits teams needing roadmap ownership plus delivery reliability. Share your role scope and I can provide a concise fit summary.";
    }

    if (hasAny(['risk', 'gap', 'mitigate', 'mitigation'])) {
        return "A likely risk in some searches is perception of broad versus single-domain depth. Mitigation is to anchor on role-relevant outcomes: $100M product-line leadership, enterprise release governance, and measurable cross-functional delivery execution.";
    }

    if (hasAny(['recruiter summary', '3-bullet', 'three bullet', 'summary'])) {
        return "• 20+ years of product and delivery leadership across enterprise and consumer domains.\n• Evidence-backed profile: MBA 3.41 GPA (39 grad credits), BA 3.13 GPA, plus certification strength including PMP and Agile credentials.\n• Proven outcomes across RSM, Johnson Health Tech, and innovation programs with global commercialization and release governance impact.";
    }

    if (hasAny(['contact', 'connect', 'reach'])) {
        return "Great interest. Please connect through the contact section or LinkedIn, and include role scope, team context, and timeline for a focused follow-up.";
    }

    return "I can help with career history, certifications, technical strengths, and role fit using basic evidence-based reasoning. Ask about a specific role or domain and I’ll provide a concise assessment.";
}
