/**
 * Career Data Structure
 * This file contains placeholder data that will be populated with actual career information
 * from LinkedIn research and user input
 */

const careerData = {
    // Personal Info
    profile: {
        name: "Your Name",
        title: "Technology Executive & AI Architect",
        tagline: "25+ Years Building the Future of Technology",
        summary: "Visionary technology leader with extensive experience in AI/ML, Developer Experience, and Enterprise Architecture. Track record of scaling teams and products globally.",
        linkedIn: "https://linkedin.com/in/yourprofile",
        github: "https://github.com/yourusername",
        email: "contact@example.com"
    },

    // Career Timeline - Placeholder to be filled with research
    timeline: [
        {
            id: 1,
            year: "2024 - Present",
            title: "Principal Architect - AI/Copilot",
            company: "Microsoft",
            location: "Seattle, WA",
            description: "Leading AI Copilot architecture initiatives, driving innovation in developer experience and enterprise AI adoption.",
            tags: ["AI/ML", "Copilot", "DevOps", "Architecture"],
            icon: "brain"
        },
        {
            id: 2,
            year: "2020 - 2024",
            title: "Senior Director, Product",
            company: "Previous Company",
            location: "San Francisco, CA",
            description: "Scaled product organization from 10 to 50+, launched flagship products reaching millions of users.",
            tags: ["Product Strategy", "Team Leadership", "Go-to-Market"],
            icon: "rocket"
        },
        {
            id: 3,
            year: "2015 - 2020",
            title: "VP Engineering",
            company: "Growth Company",
            location: "New York, NY",
            description: "Built and scaled engineering organization, achieving 10x growth in platform capabilities.",
            tags: ["Engineering", "Scale", "Cloud Native"],
            icon: "code"
        },
        {
            id: 4,
            year: "2010 - 2015",
            title: "Director of Technology",
            company: "Enterprise Corp",
            location: "Chicago, IL",
            description: "Modernized legacy systems, introduced DevOps practices across organization.",
            tags: ["DevOps", "Modernization", "Enterprise"],
            icon: "server"
        },
        {
            id: 5,
            year: "2005 - 2010",
            title: "Senior Software Engineer",
            company: "Startup Inc",
            location: "Austin, TX",
            description: "Core contributor to breakthrough products, pioneering agile methodologies.",
            tags: ["Full Stack", "Agile", "Innovation"],
            icon: "laptop-code"
        },
        {
            id: 6,
            year: "2000 - 2005",
            title: "Software Developer",
            company: "Tech Corp",
            location: "Boston, MA",
            description: "Started career in enterprise software development, mastering fundamentals.",
            tags: ["Java", ".NET", "Enterprise"],
            icon: "terminal"
        }
    ],

    // Products & Projects
    products: [
        {
            id: 1,
            name: "AI Copilot Platform",
            company: "Microsoft",
            description: "Enterprise-grade AI assistant integrated across developer workflows, enabling natural language coding and documentation.",
            impact: {
                users: "10M+",
                efficiency: "40%",
                rating: "4.8"
            },
            icon: "robot",
            tags: ["AI", "LLM", "DevEx"]
        },
        {
            id: 2,
            name: "DevOps Pipeline Platform",
            company: "Previous Company",
            description: "Unified CI/CD platform supporting 1000+ development teams with automated testing and deployment.",
            impact: {
                pipelines: "50K",
                deployments: "1M/mo",
                teams: "1000+"
            },
            icon: "code-branch",
            tags: ["DevOps", "CI/CD", "Automation"]
        },
        {
            id: 3,
            name: "Cloud Migration Framework",
            company: "Enterprise Corp",
            description: "Comprehensive framework for migrating legacy applications to cloud-native architecture.",
            impact: {
                apps: "500+",
                savings: "35%",
                uptime: "99.99%"
            },
            icon: "cloud",
            tags: ["Cloud", "Migration", "Azure"]
        }
    ],

    // Global Locations
    locations: [
        { country: "United States", flag: "🇺🇸", cities: ["Seattle", "San Francisco", "New York", "Austin"], years: "20+" },
        { country: "United Kingdom", flag: "🇬🇧", cities: ["London", "Cambridge"], years: "3" },
        { country: "Germany", flag: "🇩🇪", cities: ["Berlin", "Munich"], years: "2" },
        { country: "Japan", flag: "🇯🇵", cities: ["Tokyo"], years: "1" },
        { country: "India", flag: "🇮🇳", cities: ["Bangalore", "Hyderabad"], years: "2" },
        { country: "Australia", flag: "🇦🇺", cities: ["Sydney"], years: "1" }
    ],

    // Technical Skills
    skills: {
        languages: ["Python", "TypeScript", "C#", "Go", "Java", "Rust"],
        cloud: ["Azure", "AWS", "GCP", "Kubernetes", "Docker"],
        ai: ["OpenAI", "Azure AI", "PyTorch", "TensorFlow", "LangChain"],
        devops: ["GitHub Actions", "Azure DevOps", "Jenkins", "Terraform", "Ansible"],
        databases: ["CosmosDB", "PostgreSQL", "MongoDB", "Redis", "Elasticsearch"]
    },

    // Stats for hero section
    stats: {
        years: 25,
        countries: 15,
        products: 50,
        users: 1000000
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
