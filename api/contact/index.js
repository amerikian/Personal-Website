module.exports = async function (context, req) {
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
    };

    if (req.method === 'OPTIONS') {
        context.res = { status: 204, headers: corsHeaders };
        return;
    }

    const name = (req.body?.name || '').trim();
    const email = (req.body?.email || '').trim();
    const message = (req.body?.message || '').trim();

    if (!name || !email || !message) {
        context.res = {
            status: 400,
            headers: corsHeaders,
            body: { error: 'Name, email, and message are required.' }
        };
        return;
    }

    const sendgridApiKey = process.env.SENDGRID_API_KEY;
    const toEmail = process.env.CONTACT_TO_EMAIL || process.env.SENDGRID_TO_EMAIL;
    const fromEmail = process.env.CONTACT_FROM_EMAIL || process.env.SENDGRID_FROM_EMAIL;

    if (!sendgridApiKey || !toEmail || !fromEmail) {
        context.log.warn('Contact API not configured: missing SENDGRID_API_KEY/CONTACT_TO_EMAIL/CONTACT_FROM_EMAIL');
        context.res = {
            status: 503,
            headers: corsHeaders,
            body: { error: 'Contact service is not configured yet.' }
        };
        return;
    }

    const safeName = name.replace(/[<>]/g, '');
    const safeEmail = email.replace(/[<>]/g, '');
    const safeMessage = message.replace(/[<>]/g, '');

    const payload = {
        personalizations: [
            {
                to: [{ email: toEmail }],
                subject: `Portfolio Contact: ${safeName}`
            }
        ],
        from: { email: fromEmail, name: 'Portfolio Contact Form' },
        reply_to: { email: safeEmail, name: safeName },
        content: [
            {
                type: 'text/plain',
                value: [
                    'New portfolio contact form submission',
                    '',
                    `Name: ${safeName}`,
                    `Email: ${safeEmail}`,
                    '',
                    'Message:',
                    safeMessage
                ].join('\n')
            }
        ]
    };

    try {
        const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sendgridApiKey}`
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errText = await response.text();
            context.log.error('SendGrid error', response.status, errText);
            context.res = {
                status: 502,
                headers: corsHeaders,
                body: { error: 'Failed to send message.' }
            };
            return;
        }

        context.res = {
            status: 200,
            headers: corsHeaders,
            body: { success: true }
        };
    } catch (error) {
        context.log.error('Contact API failure', error);
        context.res = {
            status: 500,
            headers: corsHeaders,
            body: { error: 'Unexpected error while sending message.' }
        };
    }
};
