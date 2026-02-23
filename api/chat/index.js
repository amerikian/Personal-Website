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
- Founded SKY CONSULTING LLC - product management consultancy
- Former VP Commercial Sales at Johnson Health Tech (SE Asia) - frequent factory visits to Taiwan & China
- Innovation Project Manager at American Family Insurance (IoT/Smart Home)
- Senior Product Manager at SportsArt, Product Manager at Pacific Cycle (Schwinn/Mongoose)
- 3 Patents including a Walmart exclusive product
- Global experience across 9 countries (USA, Thailand, Taiwan, China, Sweden, Myanmar, Cambodia, Poland, Russia)
- Expertise: Product Management, Scrum/SAFe Agile, Azure DevOps, AI Tools (GitHub Copilot, Azure OpenAI), JavaScript, Python, Fintech, Blockchain, IoT

Your role: Answer questions about Ian's background, skills, and experience.
Be helpful, professional, and encourage visitors to connect for opportunities.
Keep responses concise (2-3 sentences) unless asked for detail.
`;

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

    const message = req.body?.message;

    if (!message) {
        context.res = {
            status: 400,
            headers: corsHeaders,
            body: { error: 'Message is required' }
        };
        return;
    }

    try {
        // Check for GitHub Models first (free)
        const githubToken = process.env.GITHUB_TOKEN;
        if (githubToken) {
            const response = await callGitHubModels(githubToken, message);
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
            const response = await callAzureOpenAI(endpoint, apiKey, deploymentName, message);
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

async function callGitHubModels(token, userMessage) {
    const response = await fetch('https://models.inference.ai.azure.com/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: careerContext },
                { role: 'user', content: userMessage }
            ],
            max_tokens: 500,
            temperature: 0.7
        })
    });

    if (!response.ok) {
        throw new Error(`GitHub Models API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
}

async function callAzureOpenAI(endpoint, apiKey, deploymentName, userMessage) {
    const url = `${endpoint}/openai/deployments/${deploymentName}/chat/completions?api-version=2024-02-15-preview`;
    
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'api-key': apiKey
        },
        body: JSON.stringify({
            messages: [
                { role: 'system', content: careerContext },
                { role: 'user', content: userMessage }
            ],
            max_tokens: 500,
            temperature: 0.7
        })
    });

    if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
}

function generateFallbackResponse(question) {
    const lowerQ = question.toLowerCase();

    if (lowerQ.includes('experience') || lowerQ.includes('years')) {
        return "With over 25 years of experience spanning 15+ countries, the portfolio showcases deep expertise in AI/ML, DevOps, and enterprise architecture. What specific area interests you?";
    }
    
    if (lowerQ.includes('ai') || lowerQ.includes('copilot')) {
        return "The AI/Copilot expertise includes enterprise AI architecture, LLM implementation, RAG patterns, and developer productivity tools - particularly with Azure OpenAI and Copilot integration.";
    }
    
    if (lowerQ.includes('contact') || lowerQ.includes('hire')) {
        return "Great interest! Please use the contact form below or connect via LinkedIn to discuss opportunities. Include details about your role and team for the best response.";
    }

    return "I can help you explore the career history, technical expertise, and potential fit for opportunities. What would you like to know more about?";
}
