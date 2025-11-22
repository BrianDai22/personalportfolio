
import { PortfolioData } from './types';

// Using high-quality remote assets to ensure the app works without missing local files
const ufcImg = "https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?q=80&w=1600&auto=format&fit=crop"; // Dramatic dark arena
const surveilensImg = "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1600&auto=format&fit=crop"; // Cyberpunk security HUD style
const codeDuelsImg = "https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=1600&auto=format&fit=crop"; // Dark code editor
const aithleteImg = "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1600&auto=format&fit=crop"; // Gym/Tech aesthetic

export const PORTFOLIO_DATA: PortfolioData = {
  name: "Brian Dai",
  title: "AI Architect & Full Stack Engineer",
  socials: {
    github: "https://github.com/BrianDai22",
    linkedin: "https://www.linkedin.com/in/brian-dai/",
    email: "brian.dai@stern.nyu.edu"
  },
  projects: [
    {
      id: "ufc-predictor",
      title: "UFC Fight Predictor",
      description: "Constructed predictive logistic models (Scikit-learn+Pandas) in 6,400+ UFC fights. Engineered features to identify win-probability drivers, achieving 72.2% AUC on test data and beating Vegas moneylines on UFC 310 (67% WR). Compounded ~$1K to ~$5K (~400% ROI).",
      tech: ["Python", "Scikit-learn", "Pandas", "Quant Trading"],
      image: ufcImg,
      link: "https://github.com/BrianDai22"
    },
    {
      id: "surveilens",
      title: "SurveiLens",
      description: "Edge CV security platform built for Meta Reality Labs Hackathon (3rd Place). Delivers ~30 FPS TensorFlow inference and multimodal LLM threat detection with parallel alert pipelines (Slack/Twilio/Gmail).",
      tech: ["React", "TypeScript", "TensorFlow", "ReactFlow"],
      image: surveilensImg,
      link: "https://github.com/BrianDai22"
    },
    {
      id: "code-duels",
      title: "CodeDuels",
      description: "Low-latency, real-time multiplayer coding arena. Orchestrates 1v1 execution battles via WebSockets and Supabase Edge Functions. Features live-scoring and sandboxed multi-language execution (Judge0).",
      tech: ["React", "Supabase", "WebSockets", "Judge0"],
      image: codeDuelsImg,
      link: "https://github.com/BrianDai22"
    },
    {
      id: "aithlete",
      title: "Aithlete",
      description: "AI fitness coach utilizing Google ML Kit's Pose Detection for real-time skeletal tracking. Trained custom exercise classification models for instant form deviation alerts without cloud latency.",
      tech: ["SwiftUI", "Google ML Kit", "TensorFlow", "Edge AI"],
      image: aithleteImg,
      link: "https://github.com/BrianDai22"
    }
  ],
  skillsCategories: [
    {
      title: "Languages",
      skills: [
        "Java", "Python", "Go", "C", "C#", "C++", 
        "JavaScript", "TypeScript", "PineV6", "HTML", "CSS", 
        "SQL", "R", "Kotlin", "Rust", "NLTK", "Ruby", "Shell"
      ],
      icon: "code"
    },
    {
      title: "Frameworks & Libraries",
      skills: [
        "React", "SwiftUI", "TensorFlow", "PyTorch", "Scikit-learn", 
        "Pandas", "HuggingFace", "Matplotlib", "Selenium", "Google ML Kit"
      ],
      icon: "cpu"
    },
    {
      title: "Developer Tools",
      skills: [
        "Git", "Docker", "Kubernetes", "Pinecone", "Supabase", 
        "Firebase", "Vercel", "Cursor", "Jupyter Notebook", 
        "LLMs (OpenAI, Jina API)"
      ],
      icon: "database"
    }
  ],
  interests: [
    "Entrepreneurship", "VibeCode", "Trading", "Bouldering", 
    "Calisthenics", "Tennis", "Hockey", "Psychology", 
    "Philosophy", "Brotherhood", "E-Sport"
  ],
  experience: [
    {
      company: "Project HolyGrail",
      role: "Founder & AI Architect",
      period: "Sep 2024 - Present",
      description: "Codified 10+ trading concepts (ICT, Orderflow) into an automated multi-strategy algorithm (Pine Script + Python). Implemented reinforcement learning (DQN) for adaptive entry/exit, achieving >70% backtested win rate. Shipped private SaaS with ~ $500 MRR."
    },
    {
      company: "Doppio Labs",
      role: "Software Engineer Intern",
      period: "May 2024 - Present",
      description: "Crawled/normalized 1M+ profiles in Pinecone vector DB for semantic retrieval. Scaled platform to 200+ active users and $2.4K+ in B2B revenue. Streamlined core AI search stack (RAG) using DeepSeek and Jina, reducing hallucinations by ~23%."
    },
    {
      company: "Omega Robotics LLC",
      role: "Co-Founder & Lead Programmer",
      period: "Jan 2021 - June 2023",
      description: "Led 5-person SDLC team with Agile/Scrum, boosting sprint velocity by 20%. Engineered latency-optimized control software reducing actuator response by 15.51%. Raised ~$120K in R&D/STEM funding impacting 250K+ students globally."
    }
  ],
  leadership: [
    {
      company: "Entrepreneurial Exchange Group",
      role: "Community Co-lead & Web Developer",
      period: "Sep 2024 - Present",
      description: "Drove 25% active-member growth and ran 20+ community events. Optimized Core Web Vitals (React & Vercel) improving performance by 27% and sign-ups by 17%."
    },
    {
      company: "Phi Gamma Delta",
      role: "Vice President & Treasurer",
      period: "Sep 2024 - Present",
      description: "Automated calendar ops for 60+ members with full-stack CRUD tooling. Managed ~$15K semester operating budget and allocated resources across chapter operations, external philanthropy, and tech infrastructure."
    }
  ],
  education: [
    {
      school: "New York University Stern School of Business",
      degree: "B.S. in Business (Finance) & B.A. in Computer Science",
      period: "Expected May 2027",
      details: [
        "GPA: 3.80/4.00",
        "Coursework: Data Structures & Algorithms, Computer System Organization, Linear Algebra, Discrete Mathematics",
        "Clubs: Entrepreneurial Exchange Group (Comm Lead), Phi Gamma Delta (VP, Treasurer), Business Analytics Club"
      ]
    },
    {
      school: "Great Neck South High School",
      degree: "High School Diploma",
      period: "Sep 2020 - Jun 2024",
      details: [
        "GPA: 4.00/4.00 | Top 8% of 316 Students",
        "Awards: USACO Gold Medalist, VEX World Championship Finalist (~16/1000), Gold PVSA, AP Scholar with Distinction"
      ]
    }
  ]
};
