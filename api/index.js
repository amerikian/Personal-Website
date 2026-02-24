const { app } = require('@azure/functions');

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
