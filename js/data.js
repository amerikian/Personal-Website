/**
 * Career Data Structure
 * Ian Cassiman - Product Leadership Portfolio
 * Data populated from LinkedIn profile research
 */

const careerData = {
    // Personal Info
    profile: {
        name: "Ian Cassiman",
        title: "Product Leadership & Innovation Expert",
        tagline: "20+ Years Driving Product Innovation Globally",
        summary: "Seasoned product leader with extensive international experience spanning fitness technology, fintech, blockchain, IoT, and enterprise innovation. Proven track record of launching award-winning products, managing $100M+ product lines, and leading cross-functional teams across North America, Southeast Asia, and Europe. PMP certified with expertise in Scaled Agile Framework and data-driven decision making.",
        linkedIn: "https://linkedin.com/in/iancassiman",
        github: "https://github.com/amerikian",
        email: "iancassiman@gmail.com"
    },

    // Career Timeline
    timeline: [
        {
            id: 1,
            year: "2022 - Present",
            title: "Scrum Master & Release Manager",
            company: "RSM US LLP",
            location: "Ironwood, Michigan",
            description: "Started as Project Manager on Audit Innovation Team, evolved to Scrum Master & Release Manager overseeing 2 scrum teams and releases across 2 Azure DevOps projects. Currently building DevOps AI tools (HTML dashboards, wiki integration, and bot) to improve SAFe Agile metrics & visibility—developed during personal time to fill critical organizational needs.",
            tags: ["Scrum Master", "Release Management", "Azure DevOps", "SAFe Agile", "AI Tools", "Audit Innovation"],
            icon: "chart-line"
        },
        {
            id: 2,
            year: "2017 - 2021",
            title: "Product Management Consultant (Owner)",
            company: "SKY CONSULTING LLC",
            location: "Global",
            description: "Founded consultancy delivering product and project management for fintech, blockchain, and cryptocurrency ventures. Notable: CEO of Swedish Fintech startup Sprinkle Group (blockchain platform on Stockholm exchange), Co-Founder of ProfitOps.com (Bitcoin investment), Project Manager for Digital Motorsports World Cup 2021.",
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
            location: "Seattle Area",
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
            description: "Led Bicycle Parts & Accessories line for iconic Schwinn & Mongoose brands. Worked directly with Target & Walmart buyers. Achieved 3 Patents including a Walmart exclusive product. Streamlined SKU portfolio and developed new packaging.",
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
                role: "CEO/Founder"
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
        }
    ],

    // Global Locations with coordinates for 3D globe
    locations: [
        { 
            country: "United States", 
            flag: "🇺🇸", 
            cities: ["Madison, WI", "Seattle", "Ironwood, MI"], 
            years: "18+",
            lat: 43.0731,
            lng: -89.4012,
            details: "Primary base - Johnson Health Tech, Pacific Cycle, American Family, RSM"
        },
        { 
            country: "Thailand", 
            flag: "🇹🇭", 
            cities: ["Bangkok"], 
            years: "2",
            lat: 13.7563,
            lng: 100.5018,
            details: "VP Commercial Sales - Johnson Health Tech SE Asia"
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
            country: "Sweden", 
            flag: "🇸🇪", 
            cities: ["Stockholm"], 
            years: "1",
            lat: 59.3293,
            lng: 18.0686,
            details: "CEO - Sprinkle Group (Stockholm Exchange listed)"
        },
        { 
            country: "Myanmar", 
            flag: "🇲🇲", 
            cities: ["Yangon"], 
            years: "<1",
            lat: 16.8661,
            lng: 96.1951,
            details: "Market expansion - First company deals"
        },
        { 
            country: "Cambodia", 
            flag: "🇰🇭", 
            cities: ["Phnom Penh"], 
            years: "<1",
            lat: 11.5564,
            lng: 104.9282,
            details: "Market expansion - First company deals"
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
        product: ["Product Strategy", "NPD (New Product Development)", "User Stories", "MVP Development", "Product Launch"],
        methodologies: ["Scaled Agile Framework", "Lean Startup", "Waterfall", "Test & Learn", "A/B Testing"],
        leadership: ["Cross-Functional Teams", "C-Level Sales", "Key Account Management", "Sales Training", "Team Development"],
        technical: ["Salesforce", "DOMO", "Business Intelligence", "IoT/Smart Home", "Mobile Apps"],
        industries: ["Fintech", "Blockchain", "Fitness/Wellness", "Insurance", "Consumer Products", "Cryptocurrency"]
    },

    // Certifications & Recognition
    certifications: [
        "Project Management Professional (PMP)",
        "Google Data Analytics Certificates",
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
            years: "2006 - 2008"
        },
        {
            degree: "BA, International/Global Studies",
            school: "University of Wisconsin-Stevens Point",
            years: "1997 - 2000",
            highlight: "Included studies abroad in Poland and Russia"
        }
    ],

    // Stats for hero section
    stats: {
        years: 20,
        countries: 8,
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
