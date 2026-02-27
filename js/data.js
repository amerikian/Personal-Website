/**
 * Career Data Structure
 * Ian Cassiman - Product Leadership Portfolio
 * Data populated from LinkedIn profile research
 */

const careerData = {
    // Personal Info
    profile: {
        name: "Ian Cassiman",
        title: "Product & Delivery Leader",
        tagline: "20+ Years in Product Management and Agile Delivery",
        summary: "Product and delivery leader with international experience spanning fitness technology, fintech, blockchain, IoT, and professional services. Track record includes managing a $100M product line, launching award-winning products, and leading cross-functional teams across North America, Southeast Asia, and Europe. PMP certified with strong focus on Scrum, release management, and data-informed decision making.",
        linkedIn: "https://linkedin.com/in/iancassiman",
        github: "https://github.com/amerikian",
        email: "contact@example.com"
    },

    // Career Timeline
    timeline: [
        {
            id: 1,
            year: "2022 - Present",
            title: "Scrum Master & Release Manager",
            company: "RSM US LLP",
            location: "Ironwood, Michigan",
            description: "Started as a Project Manager on the Audit Innovation Team and evolved into Scrum Master & Release Manager, overseeing 2 scrum teams and releases across 2 Azure DevOps projects. Building DevOps AI tools (HTML dashboards, wiki integration, and bot workflows) to improve SAFe metrics visibility and delivery decision-making.",
            tags: ["Scrum Master", "Release Management", "Azure DevOps", "SAFe Agile", "AI Tools", "Audit Innovation"],
            icon: "chart-line"
        },
        {
            id: 2,
            year: "2017 - 2021",
            title: "Product Management Consultant (Owner)",
            company: "SKY CONSULTING LLC",
            location: "Global",
            description: "Founded a consultancy delivering product and project management for fintech, blockchain, and cryptocurrency ventures. Experience includes Acting CEO for Sprinkle Group (Stockholm-listed fintech venture), Co-Founder of ProfitOps.com (bitcoin investment platform), and Project Manager for Digital Motorsports World Cup 2021.",
            tags: ["Fintech", "Blockchain", "Cryptocurrency", "CEO", "Startup"],
            icon: "rocket"
        },
        {
            id: 3,
            year: "2015 - 2017",
            title: "Vice President of Commercial Sales",
            company: "Johnson Health Tech. Co., Ltd.",
            location: "Bangkok, Thailand",
            description: "Led commercial sales across Southeast Asia targeting hotels, resorts, gyms, and government. Closed first Marriott deal in SE Asia, expanded into Myanmar & Cambodia. Implemented MS Salesforce and led VIP seminar tours to Taiwan factory.",
            tags: ["VP Leadership", "SE Asia", "B2B Sales", "Key Accounts", "Salesforce"],
            icon: "globe-asia"
        },
        {
            id: 4,
            year: "2014 - 2015",
            title: "Innovation Project Manager",
            company: "American Family Insurance",
            location: "Madison, Wisconsin",
            description: "Pioneered Connected Home/IoT products for home insurance. Implemented Lean Startup methodology, ran MVP testing campaigns for smart home devices, deployed DOMO data visualization for real-time insights, developed A/B testing and digital marketing campaigns.",
            tags: ["IoT", "Smart Home", "Lean Startup", "Big Data", "Insurance Tech"],
            icon: "home"
        },
        {
            id: 5,
            year: "2014",
            title: "Senior Product Manager",
            company: "SportsArt",
            location: "San Francisco Area",
            description: "Managed global commercial fitness product line. Planned new product and rebranding launch at Europe's largest fitness trade show. Rationalized product line, finalized touchscreen console software and mobile apps.",
            tags: ["Commercial Fitness", "Global PM", "Rebranding", "Mobile Apps"],
            icon: "dumbbell"
        },
        {
            id: 6,
            year: "2012 - 2014",
            title: "Product Manager",
            company: "Pacific Cycle (Schwinn/Mongoose)",
            location: "Madison, Wisconsin",
            description: "Led the Bicycle Parts & Accessories line for Schwinn and Mongoose brands. Worked directly with Target and Walmart buyers, earned 3 patents (including a Walmart-exclusive product), streamlined the SKU portfolio, and led packaging updates.",
            tags: ["Consumer Products", "Retail", "Patents", "Target", "Walmart"],
            icon: "bicycle"
        },
        {
            id: 7,
            year: "2006 - 2012",
            title: "Global Product Manager",
            company: "Johnson Health Tech North America",
            location: "Madison, Wisconsin",
            description: "Managed $100M global product line for Vision Fitness & Matrix Fitness cardiovascular equipment. Implemented first iPod dock on home fitness product in industry. Won 3 Product Innovation Awards. Developed dozens of products for retail & commercial markets.",
            tags: ["$100M Product Line", "Innovation Awards", "Global Launch", "Fitness Tech"],
            icon: "heartbeat"
        }
    ],

    // Products & Notable Achievements
    products: [
        {
            id: 1,
            name: "Blockchain & Crypto Platforms",
            company: "SKY Consulting / Sprinkle Group",
            description: "Led development of multiple blockchain-based platforms including security tokenization (STOkenize), crypto investment platform (ProfitOps.com), and comprehensive fintech ecosystem at Sprinkle Group with crowdfunding ICO/IPO platform.",
            impact: {
                platforms: "5+",
                exchanges: "Stockholm",
                role: "CEO"
            },
            icon: "bitcoin",
            tags: ["Blockchain", "Fintech", "Security Tokens", "ICO"]
        },
        {
            id: 2,
            name: "IoT Smart Home Products",
            company: "American Family Insurance",
            description: "Developed and tested Connected Home/IoT products to reduce home insurance claims. Implemented data-driven MVP testing with DOMO visualization, measuring impact on smoke, fire, water, and burglary incident reduction.",
            impact: {
                campaigns: "Multiple",
                insights: "Real-time",
                methodology: "Lean Startup"
            },
            icon: "house-signal",
            tags: ["IoT", "Smart Home", "Insurance", "Big Data"]
        },
        {
            id: 3,
            name: "$100M Fitness Product Line",
            company: "Johnson Health Tech",
            description: "Global product manager for Vision Fitness & Matrix Fitness cardiovascular equipment. Launched industry-first iPod dock integration. Won 3 Product Innovation Awards. Implemented company-wide global product launch process.",
            impact: {
                revenue: "$100M",
                awards: "3",
                firstIndustry: "iPod Dock"
            },
            icon: "dumbbell",
            tags: ["Fitness Tech", "Global", "Innovation Awards"]
        },
        {
            id: 4,
            name: "Patented Bicycle Accessories",
            company: "Pacific Cycle",
            description: "Developed patented bicycle accessories for Schwinn & Mongoose brands. Created EASY-CONNECT ATTACHMENT HEAD, Data ADAPTER, and Modular accessory connector. One patent became Walmart exclusive product.",
            impact: {
                patents: "3",
                retailers: "Target, Walmart",
                exclusive: "Walmart"
            },
            icon: "bicycle",
            tags: ["Patents", "Consumer Products", "Retail"]
        },
        {
            id: 5,
            name: "DevOps AI Dashboard",
            company: "RSM US LLP",
            description: "Built interactive HTML dashboard visualizing SAFe Agile metrics across 2 Azure DevOps projects. Features ECharts visualizations, 8-node SAME architecture ring, tech stack donut chart, and real-time pipeline status. Developed during personal time to fill critical organizational visibility gaps.",
            impact: {
                projects: "2",
                architecture: "SAME v4.0",
                charts: "12+"
            },
            icon: "chart-line",
            tags: ["Azure DevOps", "ECharts", "SAFe Agile", "Data Visualization"]
        },
        {
            id: 6,
            name: "DevOps AI Wiki Integration",
            company: "RSM US LLP",
            description: "Developed automated wiki documentation system that crawls Azure DevOps data and generates structured knowledge base pages. Includes 153 documentation pages with hierarchical navigation, auto-generated from pipeline data, work items, and sprint metrics.",
            impact: {
                pages: "153",
                automation: "Full",
                sources: "Multi"
            },
            icon: "book",
            tags: ["Wiki", "Documentation", "Automation", "Python"]
        },
        {
            id: 7,
            name: "DevOps AI Bot v5.0",
            company: "RSM US LLP",
            description: "Created intelligent Teams bot that answers questions about sprint health, release status, and team velocity using natural language. Features RAG pattern with Azure DevOps API integration, knowledge synthesis, and contextual responses for 2 scrum teams.",
            impact: {
                version: "v5.0",
                teams: "2",
                sources: "8 KS"
            },
            icon: "robot",
            tags: ["AI Bot", "Teams", "RAG", "NLP"]
        }
    ],

    // Global Locations with coordinates for 3D globe
    locations: [
        { 
            country: "United States", 
            flag: "🇺🇸", 
            cities: ["Madison, WI", "San Francisco", "Ironwood, MI"], 
            years: "18+",
            lat: 43.0731,
            lng: -89.4012,
            details: "Primary base - Johnson Health Tech, Pacific Cycle, American Family, RSM"
        },
        { 
            country: "Thailand", 
            flag: "🇹🇭", 
            cities: ["Bangkok"], 
            years: "7",
            lat: 13.7563,
            lng: 100.5018,
            details: "VP Commercial Sales - Johnson Health Tech SE Asia + Sky Consulting base"
        },
        { 
            country: "Taiwan", 
            flag: "🇹🇼", 
            cities: ["Taichung"], 
            years: "Frequent",
            lat: 24.1477,
            lng: 120.6736,
            details: "Factory/HQ visits - Product development & VIP tours"
        },
        { 
            country: "China", 
            flag: "🇨🇳", 
            cities: ["Shanghai", "Shenzhen"], 
            years: "Frequent",
            lat: 31.2304,
            lng: 121.4737,
            details: "Factory visits - Johnson Health Tech manufacturing operations"
        },
        { 
            country: "Sweden", 
            flag: "🇸🇪", 
            cities: ["Stockholm"], 
            years: "1",
            lat: 59.3293,
            lng: 18.0686,
            details: "CEO - Sprinkle Group (Stockholm Exchange listed)"
        },
        { 
            country: "Poland", 
            flag: "🇵🇱", 
            cities: ["Krakow", "Warsaw"], 
            years: "<1",
            lat: 50.0647,
            lng: 19.9450,
            details: "Undergraduate studies abroad - International Studies"
        },
        { 
            country: "Russia", 
            flag: "🇷🇺", 
            cities: ["Moscow", "St. Petersburg"], 
            years: "<1",
            lat: 55.7558,
            lng: 37.6173,
            details: "Undergraduate studies abroad - International Studies"
        }
    ],

    // Skills & Expertise
    skills: {
        product: ["Product Strategy", "NPD (New Product Development)", "User Stories", "MVP Development", "Product Launch", "Roadmapping"],
        methodologies: ["Scaled Agile Framework (SAFe)", "Scrum Master", "Lean Startup", "Release Management", "A/B Testing", "Test & Learn"],
        devops: ["Azure DevOps", "CI/CD Pipelines", "Git Repos", "GitHub Actions", "Azure Static Web Apps", "Release Governance"],
        technical: ["JavaScript", "HTML/CSS", "Python", "Three.js", "ECharts", "DOMO", "Mobile Apps", "API Development"],
        ai: ["GitHub Copilot", "Azure OpenAI", "RAG Patterns", "Bot Development", "AI-Assisted Workflows"],
        leadership: ["Cross-Functional Teams", "C-Level Sales", "Key Account Management", "Sales Training", "Team Development"],
        industries: ["Fintech", "Blockchain", "Fitness/Wellness", "Insurance", "Consumer Products", "Cryptocurrency", "IoT/Smart Home"]
    },

    // Certifications & Recognition
    certifications: [
        "Project Management Professional (PMP)",
        "Google Data Analytics: Ask Questions to Make Data-Driven Decisions",
        "Google Data Analytics: Foundations: Data, Data, Everywhere",
        "Google Data Analytics: Prepare Data for Exploration",
        "3x Product Innovation Award Winner"
    ],

    // Patents
    patents: [
        "EASY-CONNECT ATTACHMENT HEAD",
        "Data ADAPTER",
        "Modular Accessory Connector"
    ],

    // Languages
    languages: [
        { lang: "English", level: "Native" },
        { lang: "Spanish", level: "Elementary" },
        { lang: "Polish", level: "Limited Working" },
        { lang: "Thai", level: "Limited Working" }
    ],

    // Education
    education: [
        {
            degree: "MBA, International Business",
            school: "University of Wisconsin-Whitewater",
            years: "Program completed 2011",
            degreeDate: "08/20/2011",
            cumulativeGpa: 3.41,
            cumulativeCredits: 39.0,
            highlight: "Official transcript indicates MBA (Business Administration) with 39.00 graduate credits"
        },
        {
            degree: "BA, International/Global Studies",
            school: "University of Wisconsin-Stevens Point",
            years: "1997 - 2000",
            cumulativeGpa: 3.13,
            highlight: "Included studies abroad in Poland and Russia, with transcript evidence of East/Central Europe coursework and Polish language study"
        }
    ],

    // Employer-ready diligence assessment
    assessment: {
        title: "Comprehensive Education & Career Assessment",
        executiveSummary: "Ian Cassiman combines international business academics with multi-industry product leadership across consulting, insurance, fitness technology, and consumer products. Transcript-backed education includes an MBA (3.41 GPA, 39 graduate credits) and undergrad International/Global Studies (3.13 GPA) with Poland/Russia immersion.",
        verificationNote: "Education metrics verified from official transcripts provided by candidate",
        lastUpdated: "2026-02-23",
        employerFitSignals: [
            "Cross-Industry Product Leadership",
            "Global Commercialization Experience",
            "Portfolio from Consumer to Enterprise",
            "Agile Delivery + Release Governance",
            "Data-Informed Innovation Mindset"
        ],
        educationResearch: [
            {
                institution: "University of Wisconsin-Whitewater",
                degree: "MBA, International Business",
                years: "Degree date: 08/20/2011",
                cumulativeGpa: 3.41,
                cumulativeCredits: 39.0,
                institutionContext: "Official transcript reflects MBA (Business Administration) completion at UW-Whitewater School of Graduate Studies, with 39.00 graduate credits and a 3.41 cumulative graduate GPA.",
                careerRelevance: "Supports evidence-based business decision making, portfolio economics, and strategic planning used in product-line ownership, international commercialization, and leadership roles."
            },
            {
                institution: "University of Wisconsin-Stevens Point",
                degree: "BA, International/Global Studies",
                years: "1997 - 2000",
                cumulativeGpa: 3.13,
                institutionContext: "Transcript and portfolio history align to international/regional coursework including comparative politics, East European politics, and international studies classes, combined with language study and field experience.",
                careerRelevance: "Built durable cross-cultural analysis and communication capability that later translated into Southeast Asia market expansion, multinational stakeholder management, and global product strategy execution."
            },
            {
                institution: "Study Abroad: Poland and Russia",
                degree: "Undergraduate International Studies Experience",
                years: "During BA Program",
                institutionContext: "Undergrad transcript context supports Central/Eastern Europe immersion through Poland-based academic activity and related regional studies, with Russia included in the international studies abroad experience profile.",
                careerRelevance: "Strengthened adaptability in multilingual environments and improved real-world readiness for international negotiations, market-entry collaboration, and globally distributed product teams."
            }
        ],
        employerResearch: [
            {
                company: "RSM US LLP",
                period: "2022 - Present",
                role: "Scrum Master & Release Manager",
                companyContext: "RSM is a middle-market focused assurance, tax, and consulting firm operating globally through the RSM network. Service model combines regulated delivery quality with growing digital and AI-enabled transformation capabilities.",
                productLines: ["Audit & Assurance Services", "Tax Services", "Consulting & Digital Transformation"],
                roleImpact: "Scaled Agile execution across two scrum teams and two Azure DevOps projects, improved release governance, and prototyped AI-enabled DevOps reporting assets to increase visibility and velocity."
            },
            {
                company: "Johnson Health Tech (North America / SE Asia)",
                period: "2006 - 2012, 2015 - 2017",
                role: "Global Product Manager / VP Commercial Sales",
                companyContext: "Johnson Health Tech is a global fitness equipment company with commercial and home fitness brands including Matrix Fitness and Vision Fitness.",
                productLines: ["Commercial Cardio & Strength", "Home Fitness Equipment", "Digital Console/Connected Fitness Experiences"],
                roleImpact: "Managed and expanded a $100M product line, launched industry-leading feature innovation, and drove regional growth in Southeast Asia through strategic key-account and channel execution."
            },
            {
                company: "American Family Insurance",
                period: "2014 - 2015",
                role: "Innovation Project Manager",
                companyContext: "American Family is a major U.S. insurer with core product lines in auto, home, life, and commercial insurance and a long-running focus on risk reduction and customer experience.",
                productLines: ["Property & Casualty Insurance", "Life Insurance", "Commercial/Business Coverage"],
                roleImpact: "Led connected-home IoT experimentation and MVP testing to explore claim-reduction opportunities, combining analytics, experimentation, and customer-centered insurance innovation."
            },
            {
                company: "SportsArt",
                period: "2014",
                role: "Senior Product Manager",
                companyContext: "SportsArt positions itself as a global fitness manufacturer with product families spanning cardio, strength, medical/rehabilitation, and energy-generating ECO-POWR systems.",
                productLines: ["Cardio Equipment", "Strength Equipment", "Medical/Rehabilitation", "ECO-POWR Energy-Producing Fitness"],
                roleImpact: "Directed global commercial line planning and launch readiness, including rebranding and software-console/mobile experience completion for market-facing releases."
            },
            {
                company: "Pacific Cycle (Schwinn/Mongoose)",
                period: "2012 - 2014",
                role: "Product Manager",
                companyContext: "Pacific Cycle manages widely recognized bicycle brands and accessory categories distributed through major North American retail channels.",
                productLines: ["Bicycles (Schwinn/Mongoose)", "Bicycle Parts & Accessories", "Mass Retail Channel Programs"],
                roleImpact: "Optimized accessory portfolio strategy, partnered with top retailers, and delivered patented accessory innovations including a retailer-exclusive outcome."
            },
            {
                company: "SKY CONSULTING LLC / Sprinkle Group",
                period: "2017 - 2021",
                role: "Consultant / CEO",
                companyContext: "Entrepreneurial portfolio spanning fintech, blockchain, and digital asset initiatives focused on emerging market models and platform-led growth.",
                productLines: ["Blockchain Platform Concepts", "Crypto Investment Platforms", "Tokenization/Fintech Ventures"],
                roleImpact: "Drove product strategy and execution in early-stage environments, balancing innovation velocity, stakeholder alignment, and commercialization readiness."
            }
        ]
    },

    // Stats for hero section
    stats: {
        years: 20,
        countries: 7,
        products: 50,
        users: 1000000  // Estimated product reach
    }
};

// Function to update placeholder data with actual research
function updateCareerData(newData) {
    Object.assign(careerData, newData);
    // Trigger re-render of affected sections
    if (typeof renderTimeline === 'function') renderTimeline();
    if (typeof renderProducts === 'function') renderProducts();
    if (typeof renderLocations === 'function') renderLocations();
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { careerData, updateCareerData };
}
