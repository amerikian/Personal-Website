/**
 * Product Portfolio Map
 * Built from career timeline + LinkedIn profile extraction
 */

const productPortfolioData = {
    meta: {
        owner: "Ian Cassiman",
        title: "Product Portfolio Map",
        summary: "A product-level inventory of initiatives, platforms, and launches delivered across fitness tech, fintech/blockchain, IoT, and professional services, synthesized from portfolio research and resume detail.",
        period: "2006 - Present"
    },

    mappedProducts: [
        {
            id: "rsm-powerbi-ado-dashboard",
            productName: "Azure DevOps Leadership Status Dashboard (Power BI)",
            company: "RSM US LLP",
            period: "2022 - Present",
            role: "Project Manager / Scrum Master",
            domain: "Professional Services / DevOps",
            productType: "Internal Product",
            stage: "Operational",
            users: "Audit leadership + program stakeholders",
            problem: "Leadership needed a consolidated view of Azure DevOps status across active delivery work.",
            delivery: "Built and rolled out a Power BI status dashboard for delivery reporting and leadership visibility.",
            outcomes: [
                "Improved executive visibility into project progress",
                "Created repeatable reporting cadence for audit transformation"
            ],
            evidence: "Resume: Previous accomplishments cite Power BI dashboard for Azure DevOps project status.",
            tags: ["Power BI", "Azure DevOps", "Executive Reporting"],
            icon: "gauge-high",
            visualIdeas: [
                "Screenshot: leadership status dashboard home view",
                "Screenshot: sprint/release KPI panel",
                "Screenshot: executive summary tile layout"
            ]
        },
        {
            id: "rsm-sec-workpaper-pilot",
            productName: "SEC Workpaper Pilot (Audit Digital Transformation)",
            company: "RSM US LLP",
            period: "2022 - 2023",
            role: "Program Manager",
            domain: "Professional Services / Audit Transformation",
            productType: "Program Product",
            stage: "Pilot Launch",
            users: "Audit pilot teams + transformation stakeholders",
            problem: "Audit digital transformation required a validated pilot proving process and tooling viability.",
            delivery: "Planned and launched a SEC workpaper pilot with hybrid waterfall/agile execution and tracked workstreams.",
            outcomes: [
                "Hit first key milestone for SEC workpaper pilot kickoff",
                "Established working hybrid governance model across nine workstreams"
            ],
            evidence: "Resume: Program kickoff and first key milestone for SEC workpaper pilot are explicitly listed.",
            tags: ["Pilot", "Audit", "Hybrid Delivery", "Program Governance"],
            icon: "file-shield",
            visualIdeas: [
                "Screenshot: pilot timeline and milestone chart",
                "Screenshot: RAID log snapshot",
                "Screenshot: UAT plan structure"
            ]
        },
        {
            id: "rsm-solution-center",
            productName: "Solution Center (Enterprise Power Apps Deployment)",
            company: "RSM US LLP",
            period: "2023 - Present",
            role: "Program / Product Delivery Lead",
            domain: "Professional Services / Internal Platforms",
            productType: "Internal Product",
            stage: "Scaling",
            users: "Audit, Tax, and Consulting practices",
            problem: "Internal solutions lacked a centralized, scalable distribution and adoption channel.",
            delivery: "Proposed and deployed Solution Center using Power Apps and Smartsheet-driven rollout planning.",
            outcomes: [
                "50+ custom-built solutions deployed for Audit",
                "Adoption recorded: Audit 31.1%, Tax 3.7%, Consulting 6.3%"
            ],
            evidence: "Resume: Solution Center deployment and adoption rates are explicitly listed.",
            tags: ["Power Apps", "Adoption", "Internal Platform"],
            icon: "grid-2",
            visualIdeas: [
                "Screenshot: Solution Center landing page",
                "Screenshot: adoption trend by LOB",
                "Screenshot: catalog of deployed solutions"
            ]
        },
        {
            id: "rsm-devops-dashboard",
            productName: "DevOps AI Dashboard",
            company: "RSM US LLP",
            period: "2022 - Present",
            role: "Scrum Master & Release Manager",
            domain: "Professional Services / DevOps",
            productType: "Internal Product",
            stage: "Scaling",
            users: "2 scrum teams + delivery stakeholders",
            problem: "Low visibility into SAFe sprint and release health across multiple teams.",
            delivery: "Built an interactive HTML metrics dashboard to surface sprint and release signals for leadership and teams.",
            outcomes: [
                "Improved planning transparency and release governance visibility",
                "Converted delivery data into actionable team-health signals"
            ],
            evidence: "Profile OCR: RSM section references AI-powered DevOps dashboard and improved delivery predictability.",
            tags: ["Azure DevOps", "SAFe", "Metrics", "Visualization"],
            icon: "chart-line",
            visualIdeas: [
                "Screenshot: SAFe metrics dashboard overview",
                "Screenshot: release health component",
                "Screenshot: team-level drilldown"
            ]
        },
        {
            id: "rsm-devops-wiki",
            productName: "DevOps AI Wiki Integration",
            company: "RSM US LLP",
            period: "2022 - Present",
            role: "Scrum Master & Release Manager",
            domain: "Professional Services / DevOps",
            productType: "Internal Product",
            stage: "Scaling",
            users: "Engineering + delivery teams",
            problem: "Knowledge was fragmented across work items, pipelines, and sprint artifacts.",
            delivery: "Designed automation that transforms DevOps data into structured wiki documentation.",
            outcomes: [
                "Centralized delivery knowledge for easier decision making",
                "Reduced manual effort in sprint/release documentation"
            ],
            evidence: "Profile OCR + prior portfolio content references wiki integration workflows.",
            tags: ["Documentation", "Automation", "Knowledge Ops"],
            icon: "book",
            visualIdeas: [
                "Screenshot: wiki index and hierarchy",
                "Screenshot: auto-generated sprint documentation",
                "Screenshot: release notes template output"
            ]
        },
        {
            id: "rsm-devops-bot",
            productName: "DevOps AI Bot",
            company: "RSM US LLP",
            period: "2022 - Present",
            role: "Scrum Master & Release Manager",
            domain: "Professional Services / DevOps",
            productType: "Internal Product",
            stage: "Scaling",
            users: "Scrum teams + stakeholders",
            problem: "Stakeholders needed fast, contextual answers on sprint/release status.",
            delivery: "Built bot workflows to answer delivery questions and summarize operational signals.",
            outcomes: [
                "Faster access to release status context",
                "Higher consistency in sprint-health reporting"
            ],
            evidence: "Profile OCR: RSM section references AI bot workflows for SAFe metrics visibility.",
            tags: ["Bot", "AI Workflow", "Delivery Intelligence"],
            icon: "robot",
            visualIdeas: [
                "Screenshot: bot Q&A interaction in Teams",
                "Screenshot: sprint health response example",
                "Screenshot: release status summary response"
            ]
        },
        {
            id: "rsm-caseware-poc",
            productName: "CaseWare Enhancement POC",
            company: "RSM US LLP",
            period: "2022 - Present",
            role: "Project Manager",
            domain: "Professional Services / Audit Technology",
            productType: "POC Product",
            stage: "Proof of Concept",
            users: "Audit IT + innovation stakeholders",
            problem: "Potential platform enhancements required structured validation before larger investment.",
            delivery: "Led special-project POC planning/tracking using Smartsheet and hybrid delivery controls.",
            outcomes: [
                "Established decision-ready POC plan from scratch",
                "Enabled leadership review of enhancement viability"
            ],
            evidence: "Resume: CaseWare enhancement POC and Smartsheet plan creation are explicitly listed.",
            tags: ["POC", "Smartsheet", "Audit IT"],
            icon: "flask-vial",
            visualIdeas: [
                "Screenshot: POC roadmap",
                "Screenshot: dependency and risk view",
                "Screenshot: stakeholder status summary"
            ]
        },
        {
            id: "sky-profitops",
            productName: "ProfitOps.com",
            company: "SKY CONSULTING LLC",
            period: "2019 - 2020",
            role: "Co-Founder",
            domain: "Fintech / Crypto",
            productType: "External Product",
            stage: "MVP to Early Build",
            users: "Crypto investment users",
            problem: "Retail users needed a simpler way to access bitcoin investment strategies.",
            delivery: "Co-founded and shaped the bitcoin investment platform concept and product direction.",
            outcomes: [
                "Launched foundational product direction and positioning",
                "Validated demand in a fast-moving crypto market"
            ],
            evidence: "Profile OCR: SKY section explicitly lists Co-Founder of ProfitOps.com bitcoin investment platform.",
            tags: ["Fintech", "Crypto", "Co-Founder"],
            icon: "bitcoin",
            visualIdeas: [
                "Screenshot: product homepage and positioning",
                "Screenshot: investment workflow wireframe",
                "Screenshot: user onboarding concept"
            ]
        },
        {
            id: "sky-stokenize",
            productName: "STOkenize Security Tokenization Platform",
            company: "SKY CONSULTING LLC",
            period: "2018 - 2019",
            role: "Co-Founder & CEO",
            domain: "Fintech / Blockchain",
            productType: "External Product",
            stage: "Startup Build",
            users: "Token issuers + fintech partners",
            problem: "Emerging ventures lacked practical infrastructure for security tokenization.",
            delivery: "Co-founded and led STOkenize product strategy and startup execution.",
            outcomes: [
                "Established a focused platform proposition in tokenization",
                "Built a leadership track record in blockchain product creation"
            ],
            evidence: "Profile OCR: SKY section explicitly lists Co-Founder & CEO of STOkenize.",
            tags: ["Security Tokens", "Platform", "Startup"],
            icon: "coins",
            visualIdeas: [
                "Screenshot: tokenization platform concept",
                "Screenshot: issuer onboarding flow",
                "Screenshot: compliance workflow overview"
            ]
        },
        {
            id: "sky-sprinkle-ecosystem",
            productName: "Sprinkle Group Blockchain Ecosystem",
            company: "SKY CONSULTING LLC / Sprinkle Group",
            period: "2019",
            role: "Acting CEO",
            domain: "Fintech / Blockchain",
            productType: "Platform Ecosystem",
            stage: "Growth",
            users: "Investors, issuers, and fintech participants",
            problem: "Need for an integrated fintech ecosystem spanning investment, tokenization, and crowdfunding workflows.",
            delivery: "Led product and operating direction across interconnected blockchain-based platforms.",
            outcomes: [
                "Drove executive product alignment across multiple ventures",
                "Supported market-facing ecosystem strategy"
            ],
            evidence: "Profile OCR: lists crypto investment, security tokenization, crowdfunding ICO/IPO, media/news, and banking platforms under Sprinkle Group.",
            tags: ["Ecosystem", "Acting CEO", "Blockchain"],
            icon: "sitemap",
            visualIdeas: [
                "Diagram: ecosystem map across platform properties",
                "Screenshot: platform portfolio summary",
                "Screenshot: investment/tokenization/crowdfunding flow"
            ]
        },
        {
            id: "sky-dmwc",
            productName: "Digital Motorsports World Cup 2021 Program",
            company: "SKY CONSULTING LLC",
            period: "2020 - 2022",
            role: "Project Manager",
            domain: "Digital Platforms / Events",
            productType: "Program Product",
            stage: "Launch",
            users: "Event organizers + participants",
            problem: "Complex multi-stakeholder delivery required structured program execution.",
            delivery: "Managed cross-functional execution for Digital Motorsports World Cup delivery.",
            outcomes: [
                "Delivered program milestones across timeline constraints",
                "Coordinated product/project delivery under high visibility"
            ],
            evidence: "Profile OCR: SKY section explicitly lists Project Manager for Digital Motorsports World Cup 2021.",
            tags: ["Program Delivery", "Cross-functional", "Digital"],
            icon: "flag-checkered",
            visualIdeas: [
                "Screenshot: event program timeline",
                "Screenshot: delivery backlog snapshot",
                "Screenshot: launch readiness checklist"
            ]
        },
        {
            id: "sky-arbitrage-venture",
            productName: "Digital Asset Arbitrage Venture",
            company: "SKY CONSULTING LLC",
            period: "2020 - 2021",
            role: "Founder / Product Lead",
            domain: "Fintech / Crypto",
            productType: "Startup Product",
            stage: "Startup Build",
            users: "Digital asset traders",
            problem: "Fragmented exchange pricing created opportunity but required structured operational workflow.",
            delivery: "Initiated an international digital asset arbitrage business model and operating concept.",
            outcomes: [
                "Validated business concept and operating approach",
                "Expanded fintech venture-building experience"
            ],
            evidence: "Resume: lists startup of international digital asset arbitrage business.",
            tags: ["Arbitrage", "Venture Build", "Crypto"],
            icon: "arrows-left-right-to-line",
            visualIdeas: [
                "Diagram: exchange arbitrage workflow",
                "Screenshot: opportunity monitoring dashboard mock",
                "Screenshot: execution pipeline concept"
            ]
        },
        {
            id: "amfam-connected-home",
            productName: "Connected Home / IoT Claim-Reduction Programs",
            company: "American Family Insurance",
            period: "2014 - 2015",
            role: "Innovation Project Manager",
            domain: "Insurance / IoT",
            productType: "Innovation Program",
            stage: "MVP Testing",
            users: "Policyholders + insurance innovation teams",
            problem: "Insurance claims from smoke, fire, water, and burglary required earlier prevention signals.",
            delivery: "Led Lean Startup MVP iterations and experimentation campaigns for connected-home concepts.",
            outcomes: [
                "Built evidence on IoT product value for claim reduction",
                "Improved experiment-to-decision loop with real-time visibility"
            ],
            evidence: "Profile OCR: details MVP testing, iterative campaigns, and incident-reduction scenarios.",
            tags: ["IoT", "Lean Startup", "MVP", "Insurance"],
            icon: "house-signal",
            visualIdeas: [
                "Screenshot: campaign test matrix",
                "Screenshot: go/no-go decision dashboard",
                "Screenshot: partner device scenario map"
            ]
        },
        {
            id: "amfam-partner-ecosystem",
            productName: "Connected Home Partner Ecosystem",
            company: "American Family Insurance",
            period: "2014 - 2015",
            role: "Innovation Project Manager",
            domain: "Insurance / IoT",
            productType: "Partnership Product",
            stage: "Validation",
            users: "Innovation team + startup partners",
            problem: "Insurance innovation needed external startup collaboration to test smart-home service concepts quickly.",
            delivery: "Managed partner relationships and experiments with SmartThings, Piper, Zonoff, Wallflower, and Heatworks.",
            outcomes: [
                "Accelerated learning velocity through partner ecosystem",
                "Helped prove connected-home value leading to new products/services"
            ],
            evidence: "Resume: named startup partnerships and value proof are explicitly listed.",
            tags: ["Partnerships", "Smart Home", "Validation"],
            icon: "handshake",
            visualIdeas: [
                "Diagram: partner ecosystem landscape",
                "Screenshot: partner initiative tracker",
                "Screenshot: experiment outcomes summary"
            ]
        },
        {
            id: "amfam-domo-insights",
            productName: "DOMO + CRM Insight Layer",
            company: "American Family Insurance",
            period: "2014 - 2015",
            role: "Innovation Project Manager",
            domain: "Insurance Analytics",
            productType: "Internal Product",
            stage: "Operational",
            users: "Management + innovation team",
            problem: "Campaign metrics and customer behavior were hard to synthesize for decision-making.",
            delivery: "Implemented real-time visualization and reporting flows combining campaign and CRM data.",
            outcomes: [
                "Accelerated management decision cycles",
                "Improved visibility into NPS, usage, trends, and feature testing"
            ],
            evidence: "Profile OCR: explicitly references DOMO data visualization for real-time campaign insights.",
            tags: ["DOMO", "BI", "Experimentation"],
            icon: "chart-pie",
            visualIdeas: [
                "Screenshot: DOMO campaign status board",
                "Screenshot: NPS + usage trend panel",
                "Screenshot: feature test results"
            ]
        },
        {
            id: "sportsart-console",
            productName: "Commercial Fitness Touchscreen Console Software",
            company: "SportsArt",
            period: "2014",
            role: "Senior Product Manager",
            domain: "Fitness Technology",
            productType: "External Product",
            stage: "Launch Readiness",
            users: "Commercial gym operators + end users",
            problem: "Needed modernized console software and launch readiness for global rollout.",
            delivery: "Finalized touchscreen console software and prepared market launch assets.",
            outcomes: [
                "Strengthened launch readiness for global commercial line",
                "Aligned product, marketing, and sales enablement"
            ],
            evidence: "Profile OCR: explicitly references finalizing touchscreen console software.",
            tags: ["Fitness Tech", "Software", "Launch"],
            icon: "tablet-screen-button",
            visualIdeas: [
                "Screenshot: console UI concept",
                "Screenshot: key feature flow",
                "Screenshot: launch collateral sample"
            ]
        },
        {
            id: "sportsart-mobile",
            productName: "Connected Mobile App for Console Ecosystem",
            company: "SportsArt",
            period: "2014",
            role: "Senior Product Manager",
            domain: "Fitness Technology",
            productType: "External Product",
            stage: "Release",
            users: "Connected fitness users",
            problem: "Console users needed mobile connectivity and extended experience beyond equipment.",
            delivery: "Finalized mobile app release components linked to touchscreen console products.",
            outcomes: [
                "Expanded product value through connected user experience",
                "Supported product-line repositioning and launch narrative"
            ],
            evidence: "Profile OCR: explicitly references finalizing mobile app for connected touchscreen consoles.",
            tags: ["Mobile App", "Connected Fitness", "Release"],
            icon: "mobile-screen-button",
            visualIdeas: [
                "Screenshot: mobile app onboarding",
                "Screenshot: connected equipment pairing",
                "Screenshot: workout/usage summary screen"
            ]
        },
        {
            id: "sportsart-cologne-launch",
            productName: "Global Rebrand Portfolio Launch (Cologne)",
            company: "SportsArt",
            period: "2014",
            role: "Senior Product Manager",
            domain: "Fitness Technology",
            productType: "Portfolio Launch",
            stage: "Market Launch",
            users: "Global distributors + commercial buyers",
            problem: "Required coordinated launch of a new portfolio and brand narrative in a major global venue.",
            delivery: "Led launch preparation for a new product portfolio and branding event in Cologne, Germany.",
            outcomes: [
                "Delivered global launch readiness for flagship market event",
                "Aligned product, brand, and sales positioning for rollout"
            ],
            evidence: "Resume: explicitly states global product launch of new portfolio and branding in Cologne.",
            tags: ["Global Launch", "Rebranding", "Go-to-Market"],
            icon: "earth-europe",
            visualIdeas: [
                "Photo: event booth or launch setting",
                "Screenshot: launch lineup overview",
                "Screenshot: brand refresh before/after"
            ]
        },
        {
            id: "pacific-easy-connect",
            productName: "EASY-CONNECT Attachment Head",
            company: "Pacific Cycle (Schwinn/Mongoose)",
            period: "2012 - 2014",
            role: "Product Manager",
            domain: "Consumer Products",
            productType: "Patented Product",
            stage: "Commercialized",
            users: "Mass retail bicycle accessory customers",
            problem: "Accessory attachment experience lacked usability and differentiation.",
            delivery: "Led concept-through-commercialization of patented attachment mechanism.",
            outcomes: [
                "Contributed to 3-patent portfolio",
                "Drove differentiated retail product value"
            ],
            evidence: "Profile OCR patents section explicitly lists EASY-CONNECT ATTACHMENT HEAD.",
            tags: ["Patent", "Accessories", "Retail"],
            icon: "link",
            visualIdeas: [
                "Image: attachment head technical render",
                "Image: in-use mounting sequence",
                "Image: retail packaging presentation"
            ]
        },
        {
            id: "pacific-data-adapter",
            productName: "Data ADAPTER",
            company: "Pacific Cycle (Schwinn/Mongoose)",
            period: "2012 - 2014",
            role: "Product Manager",
            domain: "Consumer Products",
            productType: "Patented Product",
            stage: "Commercialized",
            users: "Retail bicycle accessory customers",
            problem: "Need for improved compatibility and adaptability in accessory systems.",
            delivery: "Co-developed patented adapter concept within parts and accessories portfolio.",
            outcomes: [
                "Expanded product portfolio differentiation",
                "Strengthened IP-backed product strategy"
            ],
            evidence: "Profile OCR patents section explicitly lists Data ADAPTER.",
            tags: ["Patent", "Product Architecture", "Retail"],
            icon: "puzzle-piece",
            visualIdeas: [
                "Image: adapter technical diagram",
                "Image: compatibility use-case board",
                "Image: feature explainer panel"
            ]
        },
        {
            id: "pacific-modular-connector",
            productName: "Modular Accessory Connector",
            company: "Pacific Cycle (Schwinn/Mongoose)",
            period: "2012 - 2014",
            role: "Product Manager",
            domain: "Consumer Products",
            productType: "Patented Product",
            stage: "Commercialized",
            users: "Retail bicycle accessory customers",
            problem: "Needed modularity across accessory SKUs while reducing portfolio complexity.",
            delivery: "Developed patented modular connector supporting expanded accessory options.",
            outcomes: [
                "Completed third patent in accessories innovation set",
                "Contributed to Walmart-exclusive patented product outcome"
            ],
            evidence: "Profile OCR patents section explicitly lists Modular accessory connector; experience notes Walmart-exclusive patent outcome.",
            tags: ["Patent", "Modularity", "Walmart"],
            icon: "diagram-project",
            visualIdeas: [
                "Image: connector system exploded view",
                "Image: accessory ecosystem grid",
                "Image: Walmart assortment mock"
            ]
        },
        {
            id: "pacific-line-overhaul",
            productName: "Schwinn/Mongoose Parts & Accessories Line Overhaul",
            company: "Pacific Cycle (Schwinn/Mongoose)",
            period: "2012 - 2014",
            role: "Product Manager",
            domain: "Consumer Products",
            productType: "Portfolio Transformation",
            stage: "Commercialized",
            users: "Walmart, Target, and retail consumers",
            problem: "Legacy parts and accessories line needed full redesign across packaging, innovation, and positioning.",
            delivery: "Led full line overhaul including design, packaging, POP, pricing, and key customer line reviews.",
            outcomes: [
                "Delivered end-to-end portfolio refresh",
                "Supported key account placement with Walmart and Target",
                "Filed five patents tied to new-to-the-world concepts"
            ],
            evidence: "Resume: line overhaul and five patent filings are explicitly listed.",
            tags: ["Portfolio Overhaul", "Packaging", "Walmart", "Target"],
            icon: "boxes-stacked",
            visualIdeas: [
                "Before/after: packaging redesign board",
                "Screenshot: retailer line review deck sample",
                "Image: POP and shelf presentation"
            ]
        },
        {
            id: "jht-vision-matrix-line",
            productName: "Vision Fitness & Matrix Fitness Cardiovascular Portfolio",
            company: "Johnson Health Tech North America",
            period: "2006 - 2012",
            role: "Global Product Manager",
            domain: "Fitness Technology",
            productType: "Global Product Line",
            stage: "Scaling",
            users: "Retail and commercial fitness markets",
            problem: "Needed sustained innovation and launch coordination across a large global portfolio.",
            delivery: "Managed end-to-end product lifecycle across a $100M cardiovascular line.",
            outcomes: [
                "Managed $100M revenue product line",
                "Won 3 Product Innovation Awards",
                "Led dozens of product launches"
            ],
            evidence: "Profile OCR: references Vision Fitness / Matrix Fitness $100M line and 3 innovation awards.",
            tags: ["$100M Portfolio", "Global Launch", "Awards"],
            icon: "dumbbell",
            visualIdeas: [
                "Screenshot: global portfolio roadmap",
                "Image: flagship product lineup",
                "Screenshot: launch process framework"
            ]
        },
        {
            id: "jht-ipod-dock",
            productName: "Industry-First iPod Dock Integration",
            company: "Johnson Health Tech North America",
            period: "2006 - 2012",
            role: "Global Product Manager",
            domain: "Fitness Technology",
            productType: "Feature Innovation",
            stage: "Launched",
            users: "Home fitness consumers",
            problem: "Home fitness equipment lacked integrated entertainment connectivity expected by consumers.",
            delivery: "Implemented first iPod dock integration in the category on a home fitness product.",
            outcomes: [
                "Delivered category-level first-mover feature",
                "Strengthened brand innovation position"
            ],
            evidence: "Profile OCR: explicitly references first iPod dock integration on home fitness product in category.",
            tags: ["First-to-Market", "Consumer Experience", "Feature Launch"],
            icon: "music",
            visualIdeas: [
                "Image: iPod dock integration hardware",
                "Image: user interaction scenario",
                "Screenshot: feature positioning in launch materials"
            ]
        },
        {
            id: "jht-award-ascent-elliptical",
            productName: "Matrix Fitness Ascent & Elliptical Trainers",
            company: "Johnson Health Tech North America",
            period: "2012",
            role: "Global Product Manager",
            domain: "Fitness Technology",
            productType: "Award-Winning Product",
            stage: "Launched",
            users: "Commercial fitness operators",
            problem: "Required differentiated cardio innovation in competitive commercial segment.",
            delivery: "Led product development and launch execution for Matrix Ascent and Elliptical Trainer line.",
            outcomes: [
                "Received Product Innovation Award (Jan 2012)",
                "Strengthened Matrix brand innovation profile"
            ],
            evidence: "Resume Product Innovation Awards section names Matrix Fitness Ascent and Elliptical Trainers.",
            tags: ["Product Innovation Award", "Matrix", "Cardio"],
            icon: "award",
            visualIdeas: [
                "Image: Ascent/Elliptical product photo",
                "Screenshot: award announcement",
                "Screenshot: feature comparison board"
            ]
        },
        {
            id: "jht-award-climbmill",
            productName: "Matrix Fitness ClimbMill",
            company: "Johnson Health Tech North America",
            period: "2012",
            role: "Global Product Manager",
            domain: "Fitness Technology",
            productType: "Award-Winning Product",
            stage: "Launched",
            users: "Commercial fitness operators",
            problem: "Need for distinctive cardio modality and commercial product competitiveness.",
            delivery: "Led delivery and market readiness efforts for Matrix ClimbMill product line.",
            outcomes: [
                "Received Product Innovation Award (Jul 2012)",
                "Expanded high-value commercial cardio portfolio"
            ],
            evidence: "Resume Product Innovation Awards section names Matrix Fitness ClimbMill.",
            tags: ["Product Innovation Award", "Matrix", "ClimbMill"],
            icon: "stairs",
            visualIdeas: [
                "Image: ClimbMill product shot",
                "Screenshot: launch spec summary",
                "Screenshot: trade-show presentation slide"
            ]
        },
        {
            id: "jht-award-vision-x20-x30",
            productName: "Vision Fitness X20 & X30 Ellipticals",
            company: "Johnson Health Tech North America",
            period: "2010",
            role: "Global Product Manager",
            domain: "Fitness Technology",
            productType: "Award-Winning Product",
            stage: "Launched",
            users: "Home and light commercial fitness users",
            problem: "Needed stronger product differentiation and user-value clarity in elliptical lineup.",
            delivery: "Directed product development and launch strategy for Vision Fitness X20/X30 Ellipticals.",
            outcomes: [
                "Received Product Innovation Award (Jan 2010)",
                "Elevated Vision product line competitiveness"
            ],
            evidence: "Resume Product Innovation Awards section names Vision Fitness X20 and X30 Ellipticals.",
            tags: ["Product Innovation Award", "Vision", "Elliptical"],
            icon: "medal",
            visualIdeas: [
                "Image: X20/X30 product visuals",
                "Screenshot: value proposition panel",
                "Screenshot: launch collateral sample"
            ]
        }
    ]
};
