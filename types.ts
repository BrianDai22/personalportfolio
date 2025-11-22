
export interface Project {
  id: string;
  title: string;
  description: string;
  tech: string[];
  image: string;
  link: string;
}

export interface SkillCategory {
  title: string;
  skills: string[];
  icon: string; // Identifying string for icon component
}

export interface Job {
  company: string;
  role: string;
  period: string;
  description: string;
}

export interface Education {
  school: string;
  degree: string;
  period: string;
  details: string[];
}

export interface PortfolioData {
  name: string;
  title: string;
  socials: {
    github: string;
    linkedin: string;
    email: string;
  };
  projects: Project[];
  skillsCategories: SkillCategory[];
  experience: Job[];
  leadership: Job[];
  education: Education[];
  interests: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isLoading?: boolean;
}
