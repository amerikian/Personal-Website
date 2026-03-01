#!/usr/bin/env node

const path = require('path');
const chatHandler = require(path.resolve(__dirname, '../api/chat/index.js'));

const defaultQuestions = [
    "For a Senior Product Lead role, what are Ian's top 3 strengths and why?",
    'Given those strengths, what is one likely risk or gap and how would you mitigate it?',
    'Write a 3-bullet recruiter summary with evidence from his profile.'
];

function parseQuestions() {
    const cliQuestions = process.argv.slice(2).filter(Boolean);
    return cliQuestions.length > 0 ? cliQuestions : defaultQuestions;
}

async function invokeChat(payload) {
    const context = {
        log: () => {}
    };
    context.log.error = (...args) => console.error(...args);

    const req = {
        method: 'POST',
        body: payload
    };

    await chatHandler(context, req);
    return context.res || {};
}

(async function run() {
    const questions = parseQuestions();
    const history = [];
    let allPassed = true;

    console.log(`Running Ask AI smoke test with ${questions.length} question(s)...`);

    for (let index = 0; index < questions.length; index += 1) {
        const question = questions[index];
        const response = await invokeChat({
            message: question,
            history: history.slice(-8)
        });

        const status = response.status;
        const source = response.body?.source || 'n/a';
        const answer = response.body?.response || response.body?.error || '[no response]';

        if (status !== 200) {
            allPassed = false;
        }

        console.log(`\nQ${index + 1}: ${question}`);
        console.log(`status=${status} source=${source}`);
        console.log(`A${index + 1}: ${String(answer).replace(/\n/g, ' ')}`);

        history.push({ role: 'user', content: question });
        history.push({ role: 'assistant', content: String(answer) });
    }

    console.log(`\nResult: ${allPassed ? 'PASS' : 'FAIL'}`);
    process.exitCode = allPassed ? 0 : 1;
})();
