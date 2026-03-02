/**
 * Azure Function - Chat API
 * Handles AI-powered questions about the portfolio
 * 
 * Supports multiple AI backends:
 * 1. GitHub Models (free) - Set GITHUB_TOKEN
 * 2. Azure OpenAI - Set AZURE_OPENAI_ENDPOINT, AZURE_OPENAI_KEY, AZURE_OPENAI_DEPLOYMENT_NAME
 */

const careerContext = `
You are Ian Cassiman's Career Intelligence Assistant. Help recruiters and hiring managers quickly assess fit and surface evidence.

PROFILE:
- Name: Ian Cassiman | Current: Scrum Master & Release Manager, RSM US LLP (2022-Present)
- Experience: 20+ years product leadership, delivery management, innovation
- Education: MBA UW-Whitewater (3.41 GPA), BA International Studies UW-Stevens Point (3.13 GPA)
- Certifications: PMP, CSM, SAFe 6.0, Product Management Professional, Google Data Analytics

KEY ACHIEVEMENTS:
• $100M Product Line — Johnson Health Tech, Vision/Matrix Fitness cardiovascular (2006-2012)
• 2 U.S. Patents — Pacific Cycle (Schwinn/Mongoose), one Walmart-exclusive
• 3 Product Innovation Awards — Johnson Health Tech, including industry-first iPod dock
• 153 Auto-Generated Wiki Pages — RSM, DevOps AI documentation system
• VP Commercial Sales SE Asia — Johnson Health Tech Thailand, first Marriott deal, expanded to Myanmar/Cambodia
• CEO Stockholm-Listed Fintech — Sprinkle Group via SKY Consulting

EMPLOYER HISTORY:
• RSM US LLP (2022-Present): Scrum Master/Release Manager, 2 teams, AI tools, DevOps dashboards
• SKY CONSULTING (2017-2021): Owner/CEO, fintech, blockchain, CEO Sprinkle Group
• Johnson Health Tech Thailand (2015-2017): VP Commercial Sales, SE Asia expansion
• American Family Insurance (2014-2015): Innovation PM, IoT/Smart Home, Lean Startup
• SportsArt (2014): Senior PM, global commercial fitness, rebranding
• Pacific Cycle (2012-2014): PM, 2 patents, Target/Walmart
• Johnson Health Tech NA (2006-2012): Global PM, $100M line, 3 awards

SKILLS: Product Strategy, SAFe/Scrum, Azure DevOps, JavaScript, Python, GitHub Copilot, RAG patterns
INDUSTRIES: Fintech, blockchain, fitness, insurance, IoT, consumer products
GLOBAL: USA (18+ yrs), Thailand (7 yrs), Taiwan, China, Sweden, Poland, Russia

RESPONSE STYLE:
1. Lead with a direct answer
2. Cite specific evidence (companies, metrics, outcomes)
3. For role questions, map requirements to profile evidence
4. Flag gaps honestly if info is missing
5. Keep to 2-5 sentences unless detail requested
6. Encourage connecting via LinkedIn or contact form when appropriate

Be helpful, accurate, and professional. You represent Ian.
`;

const REQUEST_TIMEOUT_MS = 15000;
const MAX_MESSAGE_LENGTH = 1500;
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
            max_tokens: 500,
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
            max_tokens: 500,
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

    if (hasAny(['experience', 'years', 'background'])) {
        return "Ian brings 20+ years across product management, Scrum leadership, and release delivery. Key evidence: $100M product line at Johnson Health Tech, VP Commercial Sales in SE Asia, and current AI/DevOps innovation at RSM.";
    }
    
    if (hasAny(['ai', 'copilot', 'bot', 'automation'])) {
        return "At RSM, Ian built: (1) a DevOps dashboard with 12+ visualizations, (2) an automated wiki system generating 153 documentation pages, and (3) a Teams bot using RAG patterns. These tools improved visibility and decision speed for 2 scrum teams.";
    }
    
    if (hasAny(['strength', 'best', 'top'])) {
        return "Top 3 strengths:\n1. Product-Line Ownership - $100M global line, 3 innovation awards, 2 patents\n2. Delivery Leadership - SAFe execution across 2 teams, release governance\n3. Global Business Acumen - VP in SE Asia, CEO of Stockholm-listed fintech, 7+ countries";
    }

    if (hasAny(['fit', 'hire', 'role', 'opportunity'])) {
        return "Profile fits roles requiring: product strategy + execution, Agile/SAFe delivery leadership, or technical product ownership. Strongest evidence: $100M product line, PMP/CSM/SAFe certifications, current AI tool development. Share a specific role for targeted analysis.";
    }

    if (hasAny(['risk', 'gap', 'weak', 'concern', 'mitigate', 'mitigation'])) {
        return "A reasonable concern is breadth vs. single-domain depth. Mitigation: anchor on outcomes ($100M product line, 2 patents, VP leadership). Profile shows repeated pattern of entering new domains and delivering measurable results.";
    }

    if (hasAny(['recruiter', 'summary', 'bullet', 'tldr'])) {
        return "Recruiter Summary:\n- 20+ years product/delivery leadership with $100M P&L experience\n- Credentials: MBA (3.41 GPA), PMP, CSM, SAFe 6.0, 2 patents, 3 awards\n- Current: AI/DevOps tools at RSM; Prior: VP SE Asia, CEO Stockholm fintech";
    }

    if (hasAny(['patent', 'invention'])) {
        return "2 U.S. patents from Pacific Cycle (Schwinn/Mongoose):\n1. EASY-CONNECT ATTACHMENT HEAD AND ADAPTER\n2. Modular accessory connector\nOne became a Walmart-exclusive product.";
    }

    if (hasAny(['education', 'degree', 'mba', 'school', 'certif'])) {
        return "Education: MBA International Business - UW-Whitewater (3.41 GPA); BA International Studies - UW-Stevens Point (3.13 GPA) with study abroad in Poland/Russia.\nCertifications: PMP, CSM, SAFe 6.0, Product Management Professional, Google Data Analytics.";
    }

    if (hasAny(['contact', 'connect', 'reach', 'email'])) {
        return "Best ways to connect: LinkedIn (linkedin.com/in/iancassiman) or the contact form on this site. Include role context and timeline for a focused response.";
    }

    return "I can help with: career history, achievements, education, role fit assessment, strengths/gaps, or recruiter summaries. Try asking about a specific role or capability.";
}
