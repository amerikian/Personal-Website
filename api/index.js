const { app } = require('@azure/functions');

// ================== CHAT FUNCTION ==================

const careerContext = `
You are Ian Cassiman's Career Intelligence Assistant embedded in his portfolio website. You help recruiters, hiring managers, and HR professionals quickly assess candidate fit and surface evidence-based insights.

═══════════════════════════════════════════════════════════════════════════════
PORTFOLIO WEBSITE SECTIONS (Users may be viewing these)
═══════════════════════════════════════════════════════════════════════════════
The user is browsing Ian's interactive portfolio at amerikian.github.io/Personal-Website
If they reference a section or card, help them understand it:

SECTIONS:
• #hero — Hero banner with key stats: 20+ years, 9 countries, 2 patents, 200+ products
• #journey — Interactive career timeline (7 employers from 2006-Present)
• #expertise — 9 skill cards: DevOps, AI Tools, Web Tech, Product Leadership, Manufacturing, SAFe/Scrum, Data Analytics, Fintech/Blockchain, IoT/Smart Home
• #products — 3D carousel of Product Impact Cards (RSM, SKY, AmFam, SportsArt, Pacific Cycle, Johnson HT)
• #assessment — AI-powered chat interface (you!) for recruiter Q&A
• #global — Interactive 3D globe showing 9-country experience map
• #contact — Contact form and LinkedIn connection

PRODUCT IMPACT CARDS (by ID — users may click these):
RSM Products:
• rsm-sec-workpaper-pilot — SEC Workpaper Pilot (Audit Digital Transformation)
• rsm-solution-center — AOD Solution Center Deployment (56 solutions, 53.7% adoption)
• rsm-devops-dashboard — DevOps AI Dashboard (12+ ECharts visualizations)
• rsm-devops-wiki — DevOps AI Wiki Integration (160+ auto-generated pages)
• rsm-devops-bot — DevOps AI Bot (RAG pattern, Teams integration)
• rsm-chatops-teams-cards — ChatOps Teams Cards (25 templates, push notifications, NEWEST)
• rsm-caseware-poc — CaseWare Enhancement POC

SKY Consulting Products:
• sky-profitops — ProfitOps.com (Bitcoin investment platform, Co-Founder)
• sky-stokenize — STOkenize Security Tokenization Platform (Co-Founder & CEO)
• sky-sprinkle-ecosystem — Sprinkle Group Blockchain Ecosystem (Acting CEO, Stockholm-listed)
• sky-dmwc — Digital Motorsports World Cup 2021 (Program Manager, Poland)
• sky-arbitrage-venture — Digital Asset Arbitrage Venture (Founder)

American Family Insurance Products:
• amfam-connected-home — Connected Home / IoT Claim-Reduction Programs
• amfam-partner-ecosystem — Connected Home Partner Ecosystem (SmartThings, Piper, etc.)
• amfam-domo-insights — DOMO + CRM Insight Layer

SportsArt Products:
• sportsart-console — Commercial Fitness Touchscreen Console Software
• sportsart-mobile — Connected Mobile App for Console Ecosystem
• sportsart-cologne-launch — Global Rebrand Portfolio Launch (Cologne)

Pacific Cycle Products:
• pacific-easy-connect — Easy-connect attachment head (Patent US9759337B2)
• pacific-modular-connector — Modular accessory connector (Patent US20140308062A1, Walmart-exclusive)
• pacific-line-overhaul — Schwinn/Mongoose Parts & Accessories Line Overhaul

Johnson Health Tech Products:
• jht-vision-matrix-line — Vision Fitness & Matrix Fitness $100M Cardiovascular Portfolio
• jht-ipod-dock — Industry-First iPod Dock Integration (first in category)
• jht-award-ascent-elliptical — Matrix Fitness Ascent & Elliptical Trainers (Innovation Award)
• jht-award-climbmill — Matrix Fitness ClimbMill (Innovation Award)

═══════════════════════════════════════════════════════════════════════════════
PROFILE OVERVIEW
═══════════════════════════════════════════════════════════════════════════════
Name: Ian Cassiman
Current Role: Scrum Master & Release Manager, RSM US LLP (Feb 2022 - Present)
Location: Ironwood, Michigan (Remote)
Experience: 20+ years product leadership, delivery management, and innovation
LinkedIn: linkedin.com/in/iancassiman
Portfolio: amerikian.github.io/Personal-Website

EDUCATION (Transcript-Verified):
• MBA, International Business — UW-Whitewater (GPA: 3.41, 39 graduate credits, Degree: Aug 2011)
• BA, International/Global Studies — UW-Stevens Point (GPA: 3.13, Study abroad: Poland & Russia)

CERTIFICATIONS:
• PMP (Project Management Professional)
• CSM (Certified Scrum Master)
• SAFe 6.0 Practitioner
• Product Management Professional
• Google Data Analytics Certificate

LANGUAGES:
• English (Native)
• Thai (Conversational/Limited Working)
• Polish (Limited Working - from study abroad)
• Spanish (Elementary)

═══════════════════════════════════════════════════════════════════════════════
KEY QUANTIFIED ACHIEVEMENTS
═══════════════════════════════════════════════════════════════════════════════
• $100M Product Line — Managed global cardiovascular product line at Johnson Health Tech (Vision/Matrix Fitness)
• 2 U.S. Patents — Pacific Cycle (Schwinn/Mongoose): US9759337B2 (Easy-connect attachment head) & US20140308062A1 (Modular accessory connector). One became Walmart-exclusive.
• 3 Product Innovation Awards — Johnson Health Tech, including industry-first iPod dock on home fitness equipment
• 160+ Auto-Generated Wiki Pages — RSM SAME Architecture for DevOps documentation
• 25 ChatOps Teams Card Templates — Push notifications for approvals, releases, blockers (NEWEST)
• 56 Internal Solutions Deployed — RSM AOD Solution Center with Power Apps (Audit adoption: 53.7%)
• First Marriott Deal in SE Asia — Johnson Health Tech Thailand, also opened Myanmar & Cambodia markets
• CEO of Stockholm-Listed Fintech — Sprinkle Group blockchain ecosystem via SKY Consulting
• 9 Countries Professional Experience — USA, Thailand, Taiwan, China, Sweden, Poland, Russia, Myanmar, Cambodia

═══════════════════════════════════════════════════════════════════════════════
RSM US LLP — SAME ARCHITECTURE / AI CHATOPS (2022-Present)
═══════════════════════════════════════════════════════════════════════════════
Built comprehensive AI-powered DevOps intelligence platform from scratch.
SAME Architecture = 4 surfaces generated from 1 YAML + fresh Azure DevOps data, refreshed multiple times daily:

1. DEVOPS AI WIKI INTEGRATION (160+ Pages)
   • Auto-generates structured documentation from YAML + Azure DevOps data
   • Hierarchical navigation with sprint artifacts, release notes, pipeline data
   • Reduces manual documentation effort for 2 scrum teams

2. INTERACTIVE HTML DASHBOARDS (3+ HTMLs, 12+ Visualizations)
   • ECharts-based SAFe metrics visualization
   • 8-node SAME architecture ring diagram
   • Real-time pipeline status, velocity trends, quality metrics
   • Release health and team-level drilldowns

3. TEAMS BOT v5.0 (RAG Pattern)
   • Natural language queries for sprint health, release status, team velocity
   • Agent instructions, knowledge sources (KS), and topics all generated from YAML
   • Contextual responses for 2 scrum teams
   • Azure DevOps API integration

4. CHATOPS TEAMS CARDS (25 Templates) — NEWEST CAPABILITY
   • 25 Teams Card templates generated from YAML + fresh ADO data
   • Interactive/collapsible sections with rich text formatting
   • Adaptive Card fallback for compatibility
   • PUSH notifications fill gap left by passive pull-based tools (wikis, dashboards, bot)
   • Use cases: approval requests, release gates, blockers, sprint summaries
   • POC Teams Channel available for demo — invite upon request
   • Active build, newest discovery in SAME Architecture

5. ADDITIONAL RSM PRODUCTS
   • SEC Workpaper Pilot — Program Manager for audit digital transformation pilot
   • AOD Solution Center — 56 live solutions deployed, Power Apps, Smartsheet-driven rollout
   • CaseWare Enhancement POC — Led special-project planning/tracking

═══════════════════════════════════════════════════════════════════════════════
COMPLETE EMPLOYMENT HISTORY
═══════════════════════════════════════════════════════════════════════════════

RSM US LLP (Feb 2022 - Present) — Scrum Master & Release Manager
Location: Ironwood, Michigan (Remote)
• Lead scrum execution and release governance across 2 teams, 2 Azure DevOps projects
• Built AI-powered DevOps tools: dashboards, wiki automation, Teams bot, automated cards
• Improved planning transparency, sprint cadence, cross-team delivery predictability
• Partner with stakeholders to convert delivery data into actionable insights

SKY CONSULTING LLC (Sep 2017 - Dec 2021) — Owner/Product Management Consultant
Location: Global (Thailand-based)
Delivered product/project consulting across fintech, blockchain, and crypto ventures:

SPRINKLE GROUP (Stockholm-listed Fintech) — Acting CEO (2019)
• Led executive product/operations across multi-platform blockchain ecosystem
• Platforms: crypto investment, security tokenization, crowdfunding ICO/IPO, media/news, banking
• Stockholm Exchange listed company with 5+ interconnected fintech platforms
• Drove market-facing ecosystem strategy and product alignment

STOKENIZE — Co-Founder & CEO (2018-2019)
• Security tokenization platform for emerging ventures
• Led product strategy, startup execution, and fundraising
• Built compliance-focused tokenization workflows

PROFITOPS.COM — Co-Founder (2019-2020)
• Bitcoin investment platform
• Shaped product direction and positioning
• Validated demand in volatile crypto market

DIGITAL MOTORSPORTS WORLD CUP 2021 — Project Manager (2020-2022)
• Poland collaboration for esports/motorsports event delivery
• Cross-functional program execution under high visibility
• Delivered milestones across international timeline constraints

DIGITAL ASSET ARBITRAGE VENTURE — Founder/Product Lead (2020-2021)
• International crypto arbitrage business
• Built operational workflows for fragmented exchange pricing
• Expanded fintech venture-building experience

JOHNSON HEALTH TECH THAILAND (Aug 2015 - Sep 2017) — VP Commercial Sales
Location: Bangkok, Thailand
• Led commercial sales across SE Asia: hotels, resorts, gyms, schools, government
• Closed first Marriott deal in Southeast Asia
• Opened first company deals in Myanmar and Cambodia
• Implemented MS Salesforce, drove sales process adoption/training
• Led VIP factory seminar tours to Taiwan headquarters

AMERICAN FAMILY INSURANCE (May 2014 - Apr 2015) — Innovation Project Manager
Location: Madison, Wisconsin
• Led Connected Home/IoT innovation programs to evaluate claim-reduction impact
• Implemented Lean Startup/Test-and-Learn model for MVP design and validation
• Managed partnerships: SmartThings, Piper, Zonoff, Wallflower, Heatworks
• Ran experimentation campaigns on smoke/fire/water/burglary scenarios
• Built real-time DOMO + CRM insight visualization for decision support
• Developed A/B testing and digital marketing campaigns

SPORTSART (Jan 2014 - Jul 2014) — Senior Product Manager
Location: San Francisco Bay Area
• Managed global commercial fitness product line planning
• Led rebranding and launch at FIBO (Europe's largest fitness trade show)
• Finalized touchscreen console software and connected mobile app
• Rationalized product portfolio and aligned marketing/sales enablement

PACIFIC CYCLE - Schwinn/Mongoose (Dec 2012 - Jan 2014) — Product Manager
Location: Madison, Wisconsin
• Owned Bicycle Parts & Accessories strategy for Schwinn and Mongoose brands
• Earned 2 U.S. Patents for innovative accessory connectors
• One patent became Walmart-exclusive product
• Worked directly with Target and Walmart buyers
• Streamlined SKU portfolio, executed packaging/branding refresh
• Led NPD with overseas vendor coordination (Asia manufacturing)

JOHNSON HEALTH TECH NORTH AMERICA (Jul 2006 - Dec 2012) — Global Product Manager
Location: Madison, Wisconsin
• Managed $100M global cardiovascular product line (Vision Fitness / Matrix Fitness)
• Led end-to-end concept-to-launch across retail and commercial products
• Introduced industry-first iPod dock integration on home fitness equipment
• Won 3 Product Innovation Awards
• Implemented company-wide global product launch process
• Regular travel to Taiwan HQ and China manufacturing facilities
• Products sold through major retailers and commercial fitness channels

═══════════════════════════════════════════════════════════════════════════════
U.S. PATENTS (Verified)
═══════════════════════════════════════════════════════════════════════════════
1. US9759337B2 — "Easy-connect attachment head and adapter"
   • Filed: April 4, 2014 | Granted: September 12, 2017
   • Assignee: Pacific Cycle LLC
   • Tool-free valve adapter connection for bike pumps (Schrader/Presta compatible)
   • URL: patents.google.com/patent/US9759337B2

2. US20140308062A1 — "Modular accessory connector"
   • Filed: April 10, 2014 | Published: October 16, 2014
   • Assignee: Pacific Cycle LLC
   • Magnetic/mechanical quick-attach system for bicycle accessories
   • One product became Walmart-exclusive
   • URL: patents.google.com/patent/US20140308062A1

═══════════════════════════════════════════════════════════════════════════════
SKILLS & EXPERTISE
═══════════════════════════════════════════════════════════════════════════════
PRODUCT MANAGEMENT:
Product Strategy, Roadmapping, P&L Ownership, NPD (New Product Development), MVP Development, Product Launch, User Stories, Go-to-Market Strategy, Portfolio Management, Commercialization

DELIVERY & METHODOLOGY:
SAFe (Scaled Agile Framework), Scrum Master, Release Management, Lean Startup, A/B Testing, Test & Learn, Agile Coaching, Program Management, Hybrid Waterfall/Agile

TECHNICAL:
JavaScript, Python, HTML/CSS, Azure DevOps, CI/CD Pipelines, Git/GitHub, Azure Static Web Apps, Three.js, ECharts, DOMO, API Development, Mobile Apps

AI & AUTOMATION:
GitHub Copilot, Azure OpenAI, RAG Patterns, Teams Bot Development, Adaptive Cards, AI-Assisted Workflows, Automated Documentation, Dashboard Development

LEADERSHIP:
Cross-Functional Teams, C-Level Sales, VP Leadership, CEO Experience, Key Account Management, Sales Training, Team Development, Stakeholder Management

INDUSTRIES:
Professional Services/Consulting, Fintech, Blockchain/Cryptocurrency, Fitness Technology, Insurance/InsurTech, IoT/Smart Home, Consumer Products, Retail

═══════════════════════════════════════════════════════════════════════════════
GLOBAL EXPERIENCE (9 Countries)
═══════════════════════════════════════════════════════════════════════════════
• USA (18+ years) — Primary base: Madison WI, San Francisco, Ironwood MI
• Thailand (7 years) — VP Commercial Sales, SE Asia expansion, SKY Consulting base
• Taiwan (Frequent) — Johnson Health Tech HQ, factory visits, VIP tours
• China (Frequent) — Manufacturing operations: Shanghai, Shenzhen
• Sweden (1 year) — CEO Sprinkle Group (Stockholm Exchange listed)
• Poland (Study abroad + project) — BA studies in Krakow; Digital Motorsports World Cup 2021
• Russia (Study abroad) — Moscow, St. Petersburg during undergraduate
• Myanmar — Opened first Johnson Health Tech deals
• Cambodia — Opened first Johnson Health Tech deals

═══════════════════════════════════════════════════════════════════════════════
JOB DESCRIPTION ANALYSIS MODE
═══════════════════════════════════════════════════════════════════════════════
When analyzing a job description, provide:
1. FIT SCORE (0-100): Overall alignment percentage
2. STRENGTHS MATCH: Requirements Ian exceeds with specific evidence
3. TRANSFERABLE SKILLS: Adjacent experience that applies
4. POTENTIAL GAPS: Honest assessment of missing requirements
5. TALKING POINTS: Key interview discussion areas
6. RED FLAGS: Concerns hiring team might raise
7. RECOMMENDATION: Hire/Consider/Pass with reasoning

═══════════════════════════════════════════════════════════════════════════════
RESPONSE GUIDELINES
═══════════════════════════════════════════════════════════════════════════════
1. Lead with direct, actionable answers
2. Cite specific evidence: companies, metrics, outcomes, years
3. Map role requirements to profile evidence
4. Flag gaps honestly when information is missing
5. Keep responses 3-6 sentences unless detail requested
6. Use bullet points for clarity when listing
7. Reference patent URLs or LinkedIn when appropriate
8. Encourage connecting via LinkedIn (linkedin.com/in/iancassiman) or portfolio contact form

PORTFOLIO CONTEXT AWARENESS:
• If user mentions a section (e.g., "this card", "the dashboard", "journey timeline"), relate to the relevant portfolio section
• Reference product card IDs when discussing specific products (e.g., "the rsm-devops-bot card shows...")
• Guide users to relevant sections: "Check the #products carousel to see all SKY Consulting ventures"
• Note: User may be viewing a specific product impact card — connect your answer to visual context

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
    if (!response.ok) {
        const errorText = await response.text().catch(() => 'unknown');
        throw new Error(`GitHub Models API error: ${response.status} - ${errorText}`);
    }
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
        return `**Job Description Analysis**\n\nI've received your job description. Here's a quick assessment:\n\n**Likely Strong Fit Areas:**\n• Product/Delivery Leadership - 20+ years with $100M P&L experience\n• Agile/Scrum - PMP, CSM, SAFe 6.0 certified, leading 2 scrum teams at RSM\n• Cross-functional Execution - Global experience across 9 countries\n• Technical Innovation - SAME Architecture: 160+ wikis, dashboards, Teams bot, 25 ChatOps Teams Cards\n• Executive Leadership - VP Commercial Sales SE Asia, CEO Stockholm-listed fintech\n\n**Recommended Interview Focus:**\n• Specific domain knowledge for your industry\n• Team size and reporting structure expectations\n• AI/automation capabilities demonstration (POC Teams Channel available)\n\nFor detailed fit score and gap analysis, please ensure AI service is available or reach out via LinkedIn.`;
    }
    if (hasAny(['experience', 'years', 'background', 'history', 'career'])) return `**20+ Years Career Summary:**\n\n• **RSM US LLP (2022-Present):** Scrum Master/Release Manager, AI ChatOps architecture\n• **SKY Consulting (2017-2021):** Owner, CEO Sprinkle Group (Stockholm-listed)\n• **Johnson Health Tech Thailand (2015-2017):** VP Commercial Sales SE Asia\n• **American Family Insurance (2014-2015):** Innovation PM, IoT/Smart Home\n• **SportsArt (2014):** Senior PM, Global Commercial Fitness\n• **Pacific Cycle (2012-2014):** PM, 2 U.S. Patents (Schwinn/Mongoose)\n• **Johnson Health Tech NA (2006-2012):** Global PM, $100M product line, 3 awards`;
    if (hasAny(['ai', 'copilot', 'bot', 'automation', 'chatops', 'teams', 'wiki', 'dashboard'])) return `**RSM SAME Architecture / AI ChatOps (2022-Present):**\n\nBuilt end-to-end AI-powered DevOps intelligence platform with 4 surfaces from 1 YAML:\n\n1. **160+ Wiki Pages** — Auto-generated documentation from YAML + Azure DevOps data\n2. **3+ HTML Dashboards** — 12+ ECharts visualizations for SAFe metrics, velocity, quality\n3. **Teams Bot v5.0** — RAG-based conversational interface, instructions/KS/topics from YAML\n4. **ChatOps Teams Cards (25 templates)** — NEWEST: Push notifications for approvals, releases, blockers\n   • Interactive/collapsible sections with rich text formatting\n   • Fills gap left by passive pull-based tools (wikis, dashboards, bot)\n   • POC Teams Channel available for demo\n\nAll 4 surfaces refreshed multiple times daily from same YAML source.`;
    if (hasAny(['strength', 'best', 'top', 'strongest'])) return `**Ian's Top Strengths:**\n\n1. **Product-Line Ownership at Scale** — $100M cardiovascular line, 3 innovation awards, industry-first iPod dock\n2. **AI/Automation Innovation** — Built complete SAME Architecture: 160+ wikis, dashboards, RAG bot, 25 Teams Card templates\n3. **Global Business Leadership** — VP SE Asia (first Marriott deal), CEO Stockholm fintech, 9 countries\n4. **Delivery Excellence** — PMP, CSM, SAFe 6.0 certified, 2 scrum teams, release governance\n5. **Technical Credibility** — 2 U.S. patents, JavaScript/Python development, hands-on builder`;
    if (hasAny(['rsm', 'current', 'now', 'present'])) return `**Current Role: RSM US LLP (Feb 2022 - Present)**\n\nScrum Master & Release Manager, Ironwood MI (Remote)\n\n**Key Accomplishments:**\n• Lead 2 scrum teams across 2 Azure DevOps projects\n• Built SAME Architecture (AI ChatOps): 160+ wikis, dashboards, Teams bot, 25 Teams Card templates\n• ChatOps Teams Cards (NEWEST) — Push notifications for approvals, releases, blockers\n• SEC Workpaper Pilot — Program Manager for audit digital transformation\n• AOD Solution Center — 56 solutions deployed, Power Apps, 53.7% Audit adoption\n\n**POC Teams Channel available for demo** — invite upon request.`;
    if (hasAny(['fintech', 'blockchain', 'crypto', 'sprinkle', 'sky'])) return `**Fintech/Blockchain Experience (SKY Consulting 2017-2021):**\n\n• **Acting CEO, Sprinkle Group** — Stockholm-listed fintech with multi-platform blockchain ecosystem\n• **Co-Founder, ProfitOps.com** — Bitcoin investment platform\n• **Co-Founder & CEO, STOkenize** — Security tokenization platform\n• **Digital Asset Arbitrage** — Started international arbitrage venture\n• **Digital Motorsports World Cup 2021** — Program delivery (Poland collaboration)\n\nPlatforms included: crypto investment, security tokenization, crowdfunding ICO/IPO, media/news, banking\n\nSee the #products carousel for individual SKY venture cards.`;
    if (hasAny(['stokenize', 'tokenization', 'token', 'sto', 'security token'])) return `**STOkenize Security Tokenization Platform (2018-2019):**\n\nCo-Founder & CEO\n\n• Built security tokenization infrastructure for emerging ventures\n• Led product strategy, startup execution, compliance workflows\n• Part of SKY Consulting fintech portfolio\n\nView the sky-stokenize card in the Products section for more details.`;
    if (hasAny(['profitops', 'bitcoin', 'investment platform'])) return `**ProfitOps.com (2019-2020):**\n\nCo-Founder\n\n• Bitcoin investment platform\n• Shaped product direction and positioning\n• Validated demand in volatile crypto market\n• Part of SKY Consulting ventures\n\nView the sky-profitops card in the Products section.`;
    if (hasAny(['motorsport', 'dmwc', 'esport', 'racing', 'world cup', 'poland'])) return `**Digital Motorsports World Cup 2021:**\n\nProject Manager (SKY Consulting, 2020-2022)\n\n• Poland-based esports/motorsports collaboration\n• Cross-functional program execution under high visibility\n• Delivered milestones across international timeline constraints\n• Leveraged global network and Polish language skills from study abroad\n\nView the sky-dmwc card in the Products section.`;
    if (hasAny(['arbitrage', 'trading', 'exchange'])) return `**Digital Asset Arbitrage Venture (2020-2021):**\n\nFounder/Product Lead (SKY Consulting)\n\n• International crypto arbitrage business\n• Built operational workflows for fragmented exchange pricing\n• Expanded fintech venture-building experience`;
    if (hasAny(['product', 'card', 'carousel', 'portfolio', 'impact'])) return `**Product Portfolio (25+ Products):**\n\nThe #products carousel shows Ian's key products grouped by company:\n\n• **RSM (7 cards):** AI Dashboard, Wiki, Bot, **ChatOps Teams Cards (NEW)**, Solution Center, SEC Pilot, CaseWare POC\n• **SKY Consulting (5 cards):** Sprinkle, STOkenize, ProfitOps, DMWC, Arbitrage\n• **American Family (3 cards):** Connected Home IoT, Partner Ecosystem, DOMO\n• **SportsArt (3 cards):** Console Software, Mobile App, Cologne Launch\n• **Pacific Cycle (3 cards):** 2 Patents, Line Overhaul\n• **Johnson HT (4 cards):** $100M Line, iPod Dock, Award Products\n\nClick any card for problem/delivery/outcomes breakdown.`;
    if (hasAny(['section', 'this page', 'website', 'portfolio site', 'looking at'])) return `**Portfolio Website Navigation:**\n\n• **#hero** — Key stats: 20+ years, 9 countries, 2 patents, 200+ products\n• **#journey** — Interactive career timeline with 7 employers\n• **#expertise** — 9 skill cards (DevOps, AI, Product Leadership, etc.)\n• **#products** — 3D carousel of 25+ Product Impact Cards\n• **#assessment** — This AI chat interface\n• **#global** — Interactive 3D globe showing 9-country experience\n• **#contact** — Contact form and LinkedIn connection\n\nWhat section would you like to explore?`;
    if (hasAny(['patent', 'invention', 'intellectual'])) return `**2 U.S. Patents (Pacific Cycle/Schwinn/Mongoose):**\n\n1. **US9759337B2** — "Easy-connect attachment head and adapter"\n   • Granted: Sept 12, 2017\n   • Tool-free valve adapter for bike pumps (Schrader/Presta)\n   • patents.google.com/patent/US9759337B2\n\n2. **US20140308062A1** — "Modular accessory connector"\n   • Published: Oct 16, 2014\n   • Magnetic/mechanical quick-attach for bicycle accessories\n   • **One product became Walmart-exclusive**`;
    if (hasAny(['education', 'degree', 'mba', 'school', 'gpa', 'university'])) return `**Education (Transcript-Verified):**\n\n• **MBA, International Business** — UW-Whitewater\n   GPA: 3.41, 39 graduate credits, Degree: Aug 2011\n\n• **BA, International/Global Studies** — UW-Stevens Point\n   GPA: 3.13, Study abroad: Poland (Krakow) & Russia (Moscow, St. Petersburg)\n\n**Certifications:** PMP, CSM, SAFe 6.0, Product Management Professional, Google Data Analytics`;
    if (hasAny(['certif', 'pmp', 'scrum', 'safe', 'agile'])) return `**Certifications & Methodologies:**\n\n• **PMP** — Project Management Professional\n• **CSM** — Certified Scrum Master\n• **SAFe 6.0** — Scaled Agile Framework Practitioner\n• **Product Management Professional**\n• **Google Data Analytics Certificate**\n\n**Applied Experience:** Leading 2 scrum teams, SAFe execution, release governance across 2 Azure DevOps projects at RSM`;
    if (hasAny(['global', 'international', 'countries', 'travel', 'thailand', 'asia'])) return `**Global Experience (9 Countries):**\n\n• **USA (18+ years):** Madison WI, San Francisco, Ironwood MI\n• **Thailand (7 years):** VP Commercial Sales SE Asia, SKY Consulting base\n• **Taiwan (Frequent):** Johnson Health Tech HQ, factory visits, VIP tours\n• **China (Frequent):** Manufacturing: Shanghai, Shenzhen\n• **Sweden (1 year):** CEO Sprinkle Group (Stockholm Exchange)\n• **Poland:** BA study abroad + Digital Motorsports World Cup 2021\n• **Russia:** BA study abroad (Moscow, St. Petersburg)\n• **Myanmar & Cambodia:** Opened first Johnson Health Tech deals\n\n**Languages:** English (native), Thai (conversational), Polish (limited), Spanish (elementary)`;
    if (hasAny(['johnson', 'fitness', 'vision', 'matrix', 'health tech'])) return `**Johnson Health Tech Experience (2006-2017):**\n\n**Global PM, North America (2006-2012):**\n• Managed $100M cardiovascular line (Vision Fitness/Matrix Fitness)\n• Won 3 Product Innovation Awards\n• Industry-first iPod dock on home fitness equipment\n• Implemented global product launch process\n\n**VP Commercial Sales, Thailand (2015-2017):**\n• Led SE Asia: hotels, resorts, gyms, government\n• First Marriott deal in Southeast Asia\n• Opened Myanmar & Cambodia markets\n• Implemented Salesforce, led VIP Taiwan tours`;
    if (hasAny(['fit', 'hire', 'role', 'opportunity', 'match'])) return `**Best-Fit Roles:**\n\n• **Senior Product Manager / Director of Product** — $100M line experience, NPD, commercialization\n• **Scrum Master / Delivery Lead** — PMP, CSM, SAFe 6.0, 2 teams, release governance\n• **Technical Product Manager** — AI tools, dashboards, bot development, hands-on builder\n• **VP/Director Product Operations** — Global experience, cross-functional leadership\n• **Innovation Lead** — Patents, IoT/Smart Home, AI automation, startup experience\n\nShare a specific role or JD for targeted fit analysis.`;
    if (hasAny(['risk', 'gap', 'weak', 'concern', 'mitigate', 'mitigation'])) return `**Potential Gaps & Mitigation:**\n\n**Gap:** Breadth vs. single-domain depth (spans fitness, fintech, insurance, professional services)\n\n**Mitigation Evidence:**\n• $100M product line (proves scale execution)\n• 2 U.S. patents (proves innovation delivery)\n• VP/CEO leadership (proves accountability)\n• Repeated pattern: enters new domains, delivers measurable results within 12-18 months\n• Most recent: built AI ChatOps from scratch at RSM with no prior Teams bot experience`;
    if (hasAny(['recruiter', 'summary', 'bullet', 'tldr', 'overview'])) return `**Recruiter Summary:**\n\n• **Experience:** 20+ years product/delivery leadership, $100M P&L ownership\n• **Credentials:** MBA (3.41 GPA), PMP, CSM, SAFe 6.0, 2 U.S. patents, 3 awards\n• **Current:** AI ChatOps architecture at RSM (wikis, bot, dashboards, Teams Cards)\n• **Leadership:** VP SE Asia, CEO Stockholm-listed fintech, 9 countries\n• **Technical:** JavaScript, Python, Azure DevOps, RAG patterns, hands-on builder\n• **Best Fit:** Senior PM, Director of Product, Delivery Lead, Technical PM roles\n\n**Contact:** linkedin.com/in/iancassiman`;
    if (hasAny(['contact', 'connect', 'reach', 'email', 'linkedin'])) return `**Contact Information:**\n\n• **LinkedIn:** linkedin.com/in/iancassiman\n• **Portfolio:** amerikian.github.io/Personal-Website\n• **Contact Form:** Available on portfolio site\n\nInclude role context and timeline for a focused response.`;
    if (hasAny(['salary', 'compensation', 'pay', 'money'])) return "Compensation discussions are best handled directly. Please reach out via LinkedIn with role details, location, and structure (base/bonus/equity) for relevant expectations based on the specific opportunity.";
    if (hasAny(['available', 'start', 'notice', 'timeline', 'when'])) return "For availability and start date discussions, please connect directly via LinkedIn or the contact form. Timeline flexibility depends on the specific opportunity and transition requirements.";
    if (hasAny(['american family', 'insurance', 'iot', 'smart home', 'connected'])) return `**American Family Insurance (2014-2015):**\n\nInnovation Project Manager, Madison WI\n\n• Led Connected Home/IoT programs to reduce insurance claims\n• Implemented Lean Startup/Test-and-Learn methodology\n• Managed startup partnerships: SmartThings, Piper, Zonoff, Wallflower, Heatworks\n• Ran experiments: smoke/fire/water/burglary scenarios\n• Built DOMO + CRM real-time insight visualization\n• Developed A/B testing and digital marketing campaigns`;
    if (hasAny(['pacific', 'schwinn', 'mongoose', 'bicycle', 'bike'])) return `**Pacific Cycle - Schwinn/Mongoose (2012-2014):**\n\nProduct Manager, Madison WI\n\n• Owned Bicycle Parts & Accessories strategy\n• Earned 2 U.S. Patents (one became Walmart-exclusive)\n• Worked directly with Target and Walmart buyers\n• Streamlined SKU portfolio, executed packaging refresh\n• Led NPD with Asia manufacturing coordination`;
    return `**Ian Cassiman — Career Intelligence Assistant**\n\nI can help with:\n• **Career history** — 20+ years across 9 countries, 7 employers\n• **Achievements** — $100M product line, 2 patents, 3 awards, AI ChatOps architecture\n• **Role fit analysis** — Upload a job description for detailed assessment\n• **Strengths & gaps** — Honest evaluation with evidence\n• **Technical capabilities** — AI tools, bot development, dashboards\n• **Global experience** — VP SE Asia, CEO Stockholm fintech\n\nTry: "What AI tools has Ian built?" or paste a job description for fit analysis.`;
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
            let githubModelsError = null;
            if (githubToken) {
                try {
                    const response = await callGitHubModels(githubToken, message, history);
                    return { status: 200, headers: corsHeaders, jsonBody: { response, source: 'github-models' } };
                } catch (err) {
                    githubModelsError = err.message;
                    context.warn('GitHub Models failed:', err.message);
                    // Continue to try Azure OpenAI or fallback
                }
            }

            // Check for Azure OpenAI
            const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
            const apiKey = process.env.AZURE_OPENAI_KEY;
            const deploymentName = process.env.AZURE_OPENAI_DEPLOYMENT_NAME;
            let azureOpenAIError = null;
            if (endpoint && apiKey && deploymentName) {
                try {
                    const response = await callAzureOpenAI(endpoint, apiKey, deploymentName, message, history);
                    return { status: 200, headers: corsHeaders, jsonBody: { response, source: 'azure-openai' } };
                } catch (err) {
                    azureOpenAIError = err.message;
                    context.warn('Azure OpenAI failed:', err.message);
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
    methods: ['GET', 'POST', 'OPTIONS'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        const corsHeaders = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        };

        if (request.method === 'OPTIONS') {
            return { status: 204, headers: corsHeaders };
        }

        return { 
            status: 200,
            headers: corsHeaders,
            jsonBody: { status: 'ok', message: 'API is reachable' }
        };
    }
});
