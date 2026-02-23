/**
 * Azure Function - Chat API
 * Handles AI-powered questions about the portfolio
 * 
 * To enable Azure OpenAI integration:
 * 1. Set AZURE_OPENAI_ENDPOINT in Azure Static Web Apps settings
 * 2. Set AZURE_OPENAI_KEY in Azure Static Web Apps settings
 * 3. Set AZURE_OPENAI_DEPLOYMENT_NAME in settings
 */

const careerContext = `
You are a helpful AI assistant for a professional portfolio website. 
Your role is to answer questions about the portfolio owner's:
- 25+ years of technology experience
- AI/ML and Copilot architecture expertise
- DevOps and developer experience leadership
- Product management background
- Global work experience across 15+ countries
- Enterprise architecture skills

Be helpful, professional, and encourage visitors to connect for opportunities.
If you don't know something specific, suggest they reach out directly.
`;

module.exports = async function (context, req) {
    context.log('Chat API triggered');

    const message = req.body?.message;

    if (!message) {
        context.res = {
            status: 400,
            body: { error: 'Message is required' }
        };
        return;
    }

    try {
        // Check if Azure OpenAI is configured
        const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
        const apiKey = process.env.AZURE_OPENAI_KEY;
        const deploymentName = process.env.AZURE_OPENAI_DEPLOYMENT_NAME;

        if (!endpoint || !apiKey || !deploymentName) {
            // Fallback to simple responses if not configured
            context.res = {
                status: 200,
                body: {
                    response: generateFallbackResponse(message),
                    source: 'fallback'
                }
            };
            return;
        }

        // Azure OpenAI API call
        const response = await callAzureOpenAI(endpoint, apiKey, deploymentName, message);
        
        context.res = {
            status: 200,
            body: {
                response: response,
                source: 'azure-openai'
            }
        };

    } catch (error) {
        context.log.error('Chat API error:', error);
        context.res = {
            status: 500,
            body: { error: 'Failed to generate response' }
        };
    }
};

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
