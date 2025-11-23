
import React, { useState, useEffect, useRef } from 'react';
import { Github, Linkedin, Mail, Terminal, ArrowRight, Cpu, Code, Database, MessageSquare, GraduationCap, Users, Hash, Check, Menu, X, FileDown, Loader2 } from 'lucide-react';
import { PORTFOLIO_DATA } from './constants';
import { AIChat } from './components/AIChat';
import resumePdf from './resume.pdf';


// Icon mapping for skills
interface SkillIconProps {
  name: string;
}

const SkillIcon: React.FC<SkillIconProps> = ({ name }) => {
  switch (name) {
    case 'code': return <Code className="text-accent mb-4 group-hover:text-white transition-colors duration-500" size={32} />;
    case 'cpu': return <Cpu className="text-accent mb-4 group-hover:text-white transition-colors duration-500" size={32} />;
    case 'database': return <Database className="text-accent mb-4 group-hover:text-white transition-colors duration-500" size={32} />;
    default: return <Terminal className="text-accent mb-4 group-hover:text-white transition-colors duration-500" size={32} />;
  }
};

// Cyber Glitch Text Component
interface GlitchTextProps {
  text: string;
  className?: string;
}

const GlitchText: React.FC<GlitchTextProps> = ({ text, className = "" }) => (
  <div className={`glitch-wrapper ${className}`}>
    <span className="glitch-text" data-text={text}>
      {text}
    </span>
  </div>
);

// Nav Link with Scramble Effect
interface ScrambleLinkProps {
  href: string;
  text: string;
  isActive: boolean;
  onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  delay: number;
  className?: string;
}

const ScrambleLink: React.FC<ScrambleLinkProps> = ({ href, text, isActive, onClick, delay, className="" }) => {
  const [displayText, setDisplayText] = useState(text);
  const intervalRef = useRef<number | null>(null);
  const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890@#$%&";

  const onMouseEnter = () => {
    let iteration = 0;
    if (intervalRef.current) clearInterval(intervalRef.current);
    
    intervalRef.current = window.setInterval(() => {
      setDisplayText(prev => 
        text.split("").map((letter, index) => {
          if(index < iteration) return text[index];
          return CHARS[Math.floor(Math.random() * CHARS.length)];
        }).join("")
      );
      
      if(iteration >= text.length) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setDisplayText(text);
      }
      
      iteration += 1/2; // Faster scramble
    }, 20); // Faster refresh
  };

  const onMouseLeave = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setDisplayText(text);
  };

  return (
    <a 
      href={href}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`relative transition-colors uppercase tracking-widest py-2 hover:text-accent animate-fade-in-down ${isActive ? 'text-accent' : 'text-gray-400'} ${className}`}
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
    >
      {displayText}
      <span className={`absolute bottom-0 left-0 w-full h-[1px] bg-accent transform transition-transform duration-500 ease-expo origin-left ${isActive ? 'scale-x-100' : 'scale-x-0'}`}></span>
    </a>
  );
};

// Boot Sequence Preloader with Curtain Effect
const Preloader: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [lines, setLines] = useState<string[]>([]);
  const [isExiting, setIsExiting] = useState(false);
  const textLines = [
    "Initializing Core Systems...",
    "Establishing Neural Link...",
    "Optimizing V8 Runtime Engine...",
    "Loading Assets [||||||||||] 100%",
    "Access Granted."
  ];

  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < textLines.length) {
        setLines(prev => [...prev, textLines[currentIndex]]);
        currentIndex++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setIsExiting(true);
          setTimeout(onComplete, 800); // Wait for exit animation
        }, 600);
      }
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`fixed inset-0 bg-base z-[100] flex flex-col items-center justify-center font-mono text-accent text-sm md:text-base p-8 transition-transform duration-1000 ease-expo ${isExiting ? '-translate-y-full' : 'translate-y-0'}`}>
      <div className="w-full max-w-md">
        {lines.map((line, i) => (
          <div key={i} className="mb-2 animate-[fadeInDown_0.2s_ease-out]">
            <span className="mr-2 opacity-50">root@system:~#</span>
            {line}
          </div>
        ))}
        <div className="animate-pulse mt-4 bg-accent w-3 h-5 inline-block align-middle"></div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [showChat, setShowChat] = useState(false);
  const [emailCopied, setEmailCopied] = useState(false);
  const [heroEmailCopied, setHeroEmailCopied] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Scroll Spy & Reveal Observer
  useEffect(() => {
    if (isLoading) return;

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      
      const sections = ['home', 'projects', 'skills', 'experience', 'contact'];
      const scrollPosition = window.scrollY + 150; // Trigger point
      
      if ((window.innerHeight + Math.ceil(window.scrollY)) >= document.documentElement.scrollHeight - 50) {
        setActiveSection('contact');
      } else {
        for (const section of sections) {
          const element = document.getElementById(section);
          if (element) {
            const offsetTop = element.offsetTop;
            const offsetHeight = element.offsetHeight;
            if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
              setActiveSection(section);
            }
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Optimized Intersection Observer
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, observerOptions);

    const revealedElements = document.querySelectorAll('.reveal');
    revealedElements.forEach(el => observer.observe(el));

    return () => {
      window.removeEventListener('scroll', handleScroll);
      revealedElements.forEach(el => observer.unobserve(el));
    };
  }, [isLoading]);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({ top: offsetPosition, behavior: 'smooth' }); 
      
      window.history.pushState(null, '', `#${id}`);
      setActiveSection(id);
    }
  };

  const copyEmailToClipboard = async (): Promise<boolean> => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(PORTFOLIO_DATA.socials.email);
        return true;
      }
    } catch (err) {
      console.warn("Clipboard API failed, falling back", err);
    }

    // Fallback: temporary textarea selection
    try {
      const textarea = document.createElement('textarea');
      textarea.value = PORTFOLIO_DATA.socials.email;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      const success = document.execCommand('copy');
      document.body.removeChild(textarea);
      return success;
    } catch (err) {
      console.error('Clipboard fallback failed', err);
      return false;
    }
  };

  const handleContactClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    const copied = await copyEmailToClipboard();
    if (copied) {
      setEmailCopied(true);
      setTimeout(() => setEmailCopied(false), 3000);
    }
  };

  const handleHeroEmailClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    const copied = await copyEmailToClipboard();
    if (copied) {
      setHeroEmailCopied(true);
      setTimeout(() => setHeroEmailCopied(false), 2000);
    }
  };

  const handleDownloadResume = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDownloading(true);

    setTimeout(() => {
      const link = document.createElement('a');
      link.href = resumePdf;
      link.download = 'Brian_Dai_Resume.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setIsDownloading(false);
    }, 500);
  };

  return (
    <>
      {isLoading && <Preloader onComplete={() => setIsLoading(false)} />}
      
      {/* Main Content Wrapper */}
      <div className={`min-h-screen bg-base text-white selection:bg-accent selection:text-base overflow-x-hidden relative`}>
        
        {/* Atmosphere Layer */}
        <div className="noise-overlay"></div>
        <div className="scanlines"></div>
        
        {/* Navigation */}
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-expo ${isScrolled || mobileMenuOpen ? 'py-4 glass-panel' : 'py-8 bg-transparent'}`}>
          <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
            <a 
               href="#home" 
               onClick={(e) => scrollToSection(e, 'home')}
               className="font-display text-xl tracking-tighter font-bold text-white flex items-center gap-2 hover:opacity-80 transition-opacity group animate-fade-in-down relative z-50"
            >
              <span className="text-accent group-hover:translate-x-1 transition-transform duration-300">&lt;</span>
              BRIAN.DAI
              <span className="text-accent group-hover:-translate-x-1 transition-transform duration-300">/&gt;</span>
            </a>

            <div className="hidden md:flex items-center gap-8 font-mono text-sm">
              {['Projects', 'Skills', 'Experience', 'Contact'].map((item, idx) => {
                const id = item.toLowerCase();
                const isActive = activeSection === id;
                return (
                  <ScrambleLink
                    key={item}
                    href={`#${id}`}
                    text={item}
                    isActive={isActive}
                    onClick={(e) => scrollToSection(e, id)}
                    delay={(idx + 1) * 100}
                  />
                );
              })}
              <div className="animate-fade-in-down" style={{ animationDelay: '500ms', animationFillMode: 'forwards' }}>
                <button 
                  onClick={() => setShowChat(!showChat)}
                  className={`flex items-center gap-2 px-4 py-2 border transition-all duration-500 ease-expo uppercase tracking-widest font-bold text-xs group relative overflow-hidden
                  ${showChat ? 'bg-accent text-base border-accent' : 'border-accent text-accent'}`}
                >
                  <span className={`absolute inset-0 bg-accent transform origin-left transition-transform duration-500 ease-expo ${showChat ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
                  <span className={`relative z-10 flex items-center gap-2 ${showChat ? 'text-base' : 'group-hover:text-base'}`}>
                    <MessageSquare size={14} />
                    {showChat ? 'Close AI' : 'AI Agent'}
                  </span>
                </button>
              </div>
            </div>

            <div className="md:hidden relative z-50">
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-white hover:text-accent transition-colors">
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Nav */}
          <div className={`fixed inset-0 bg-base/95 backdrop-blur-xl z-40 flex flex-col items-center justify-center transition-all duration-700 ease-expo md:hidden ${mobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'}`}>
            <div className="flex flex-col gap-8 font-mono text-xl text-center">
              {['Projects', 'Skills', 'Experience', 'Contact'].map((item, idx) => (
                <ScrambleLink
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  text={item}
                  isActive={activeSection === item.toLowerCase()}
                  onClick={(e) => scrollToSection(e, item.toLowerCase())}
                  delay={idx * 50}
                  className="text-2xl"
                />
              ))}
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section id="home" className="min-h-screen flex items-center relative overflow-hidden pt-20">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-surface to-transparent opacity-40 -z-10"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent blur-[200px] opacity-10 -z-10 rounded-full animate-pulse-glow"></div>
          
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-10 reveal active">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-accent font-mono text-xs tracking-wider hover:bg-white/10 transition-colors cursor-default">
                <span className="w-2 h-2 rounded-full bg-accent animate-ping"></span>
                <span className="w-2 h-2 rounded-full bg-accent absolute"></span>
                OPEN FOR OPPORTUNITIES
              </div>
              
              <h1 className="font-display text-5xl md:text-7xl lg:text-8xl leading-[0.9] uppercase tracking-tight">
                <GlitchText text="AI Architect" className="mb-2 block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-300 to-gray-600 animate-gradient-x inline-block">
                   & Full Stack
                </span>
              </h1>
              
              <p className="font-sans text-lg md:text-xl text-gray-400 max-w-lg leading-relaxed reveal delay-200">
                Merging <span className="text-white">quantitative finance</span> with full-stack engineering. Specialized in AI agents, algorithmic trading, and high-performance web systems.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4 reveal delay-300">
                <a 
                  href="#projects" 
                  onClick={(e) => scrollToSection(e, 'projects')} 
                  className="group relative px-8 py-4 bg-white text-base font-display font-bold uppercase tracking-wide overflow-hidden text-center"
                >
                  <span className="relative z-10 group-hover:text-white transition-colors duration-500">View Works</span>
                  <div className="absolute inset-0 bg-accent transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500 ease-expo -z-0"></div>
                  <div className="absolute inset-0 bg-black transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500 delay-75 ease-expo -z-10"></div>
                </a>
                
                <button 
                  onClick={handleDownloadResume}
                  disabled={isDownloading}
                  className="group px-8 py-4 border border-white/20 text-white font-display font-bold uppercase tracking-wide hover:border-accent hover:text-accent transition-all duration-500 ease-expo text-center flex items-center justify-center gap-2"
                >
                  {isDownloading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <>
                        <span>CV</span>
                        <FileDown size={18} className="group-hover:-translate-y-1 transition-transform duration-500 ease-expo" />
                    </>
                  )}
                </button>
              </div>

              <div className="flex gap-6 pt-8 text-gray-500 reveal delay-400">
                <a href={PORTFOLIO_DATA.socials.github} target="_blank" rel="noreferrer" className="hover:text-white hover:scale-110 transition-all duration-300"><Github /></a>
                <a href={PORTFOLIO_DATA.socials.linkedin} target="_blank" rel="noreferrer" className="hover:text-white hover:scale-110 transition-all duration-300"><Linkedin /></a>
                <button onClick={handleHeroEmailClick} className="hover:text-white hover:scale-110 transition-all duration-300 relative group">
                   {heroEmailCopied ? <Check className="text-accent" /> : <Mail />}
                </button>
              </div>
            </div>

            {/* Floating 3D Code Object */}
            <div className="hidden lg:block relative reveal delay-500 animate-float perspective-1000">
              <div className="border border-white/10 bg-surface/80 p-8 relative z-10 backdrop-blur-md shadow-2xl hover:border-accent/40 transition-colors duration-700 group rotate-y-12 hover:rotate-y-0 transform-style-3d transition-transform ease-expo">
                <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                  <span className="ml-auto font-mono text-xs text-gray-500 group-hover:text-accent">architect.json</span>
                </div>
                <pre className="font-mono text-sm text-gray-300 overflow-x-auto custom-scrollbar">
                  <code>
                    <span className="text-purple-400">const</span> <span className="text-blue-400">engineer</span> = {'{'}
                    {'\n'}  name: <span className="text-green-400">"{PORTFOLIO_DATA.name}"</span>,
                    {'\n'}  role: <span className="text-green-400">"Founder & AI Architect"</span>,
                    {'\n'}  stack: [<span className="text-green-400">"Python"</span>, <span className="text-green-400">"React"</span>, <span className="text-green-400">"TensorFlow"</span>],
                    {'\n'}  interest: <span className="text-accent animate-pulse">"Quant Trading"</span>
                    {'\n'}{'}'};
                  </code>
                </pre>
                {/* Decorative Corners */}
                <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-accent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-accent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="py-32 bg-base relative">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-end justify-between mb-20 border-b border-white/10 pb-8 reveal">
              <div>
                <h2 className="font-display text-4xl md:text-5xl uppercase tracking-tight"><GlitchText text="Selected Works" /></h2>
                <p className="font-mono text-accent mt-3 text-sm tracking-widest">/// ENGINEERING & RESEARCH</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
              {PORTFOLIO_DATA.projects.map((project, idx) => (
                <div key={project.id} className={`reveal delay-${(idx % 2) * 200} group relative bg-surface border border-white/5 hover:border-accent/30 transition-all duration-700 ease-expo overflow-hidden`}>
                  
                  {/* Tech HUD Corners */}
                  <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-accent/50 opacity-0 group-hover:opacity-100 transition-all duration-500 z-20"></div>
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-accent/50 opacity-0 group-hover:opacity-100 transition-all duration-500 z-20"></div>

                  <div className="aspect-video w-full overflow-hidden bg-gray-800 relative">
                     <img 
                        src={project.image} 
                        alt={project.title}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover transition-transform duration-1000 ease-expo group-hover:scale-110 opacity-70 group-hover:opacity-100 grayscale group-hover:grayscale-0"
                     />
                     <div className="absolute inset-0 bg-base/40 group-hover:bg-transparent transition-colors duration-700"></div>
                     
                     <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10">
                        <div className="w-[95%] h-[90%] border border-white/10 scale-95 group-hover:scale-100 transition-transform duration-700 ease-expo flex flex-col justify-between p-4">
                           <div className="flex justify-between text-[10px] font-mono text-accent uppercase tracking-widest">
                              <span>IMG_SEQ_0{idx+1}</span>
                              <span className="animate-pulse">[LIVE_FEED]</span>
                           </div>
                        </div>
                     </div>
                  </div>
                  
                  <div className="p-8 relative z-10">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-display text-2xl uppercase group-hover:text-accent transition-colors duration-300">{project.title}</h3>
                      <a href={project.link} target="_blank" rel="noreferrer" className="p-3 bg-white/5 rounded-full hover:bg-accent hover:text-base transition-all duration-500 ease-expo hover:rotate-45">
                        <ArrowRight size={20} />
                      </a>
                    </div>
                    <p className="font-sans text-gray-400 mb-6 line-clamp-4 text-sm leading-relaxed group-hover:text-gray-300 transition-colors">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {project.tech.map(tech => (
                        <span key={tech} className="px-2 py-1 text-xs font-mono border border-white/10 text-gray-500 group-hover:text-accent group-hover:border-accent/30 transition-colors duration-300">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="py-32 bg-surface relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent"></div>
          
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-end justify-between mb-20 border-b border-white/10 pb-8 reveal">
              <div>
                <h2 className="font-display text-4xl md:text-5xl uppercase tracking-tight"><GlitchText text="Tech Arsenal" /></h2>
                <p className="font-mono text-accent mt-3 text-sm tracking-widest">/// FULL STACK MASTERY</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
               {PORTFOLIO_DATA.skillsCategories.map((category, idx) => (
                 <div key={category.title} className={`reveal delay-${idx * 100} p-8 border border-white/5 bg-base/30 hover:border-accent/50 transition-all duration-700 ease-expo group h-full hover:bg-base hover:-translate-y-2 hover:shadow-2xl relative overflow-hidden`}>
                    <div className="absolute top-0 right-0 w-20 h-20 bg-accent/5 rounded-bl-full -mr-10 -mt-10 transition-all duration-700 group-hover:bg-accent/10"></div>
                    
                    <div className="mb-8 transform group-hover:scale-110 transition-transform duration-700 ease-expo origin-left">
                      <SkillIcon name={category.icon} />
                    </div>
                    <h4 className="font-display text-xl mb-6 text-white group-hover:text-accent transition-colors duration-300">{category.title}</h4>
                    <div className="flex flex-wrap gap-2">
                       {category.skills.map(skill => (
                         <span key={skill} className="px-3 py-1.5 bg-surface rounded text-xs font-mono text-gray-400 border border-white/5 hover:border-accent hover:bg-accent hover:text-base transition-all duration-300 cursor-default">
                           {skill}
                         </span>
                       ))}
                    </div>
                 </div>
               ))}
            </div>

            {/* Interests Marquee */}
            <div className="border-t border-white/5 pt-16 reveal delay-300">
              <div className="flex items-center gap-4 mb-8 text-gray-500 font-mono text-sm uppercase tracking-widest justify-center md:justify-start">
                <Hash size={16} className="text-accent" />
                <span>Personal Interests & Hobbies</span>
              </div>
              
              <div className="relative overflow-hidden w-full py-4 mask-linear-fade group">
                 <div className="flex gap-12 animate-marquee whitespace-nowrap group-hover:[animation-play-state:paused]">
                    {[...Array(4)].flatMap(() => PORTFOLIO_DATA.interests).map((interest, i) => (
                      <span key={`${interest}-${i}`} className="text-3xl md:text-5xl font-display font-bold text-transparent font-outline-2 hover:text-accent transition-colors duration-500 cursor-default opacity-40 hover:opacity-100 hover:scale-105 transform ease-expo">
                        {interest}
                      </span>
                    ))}
                 </div>
                 <style>{`
                   @keyframes marquee {
                     0% { transform: translateX(0); }
                     100% { transform: translateX(-50%); }
                   }
                   .animate-marquee {
                     animation: marquee 60s linear infinite;
                   }
                   .mask-linear-fade {
                      mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
                      -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
                   }
                 `}</style>
              </div>
            </div>
          </div>
        </section>

        {/* Experience Section */}
        <section id="experience" className="py-32 bg-base">
           <div className="max-w-5xl mx-auto px-6">
             <div className="flex items-end justify-between mb-20 border-b border-white/10 pb-8 reveal">
               <div>
                 <h2 className="font-display text-4xl md:text-5xl uppercase tracking-tight"><GlitchText text="Trajectory" /></h2>
                 <p className="font-mono text-accent mt-3 text-sm tracking-widest">/// ACADEMIC & PROFESSIONAL TIMELINE</p>
               </div>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
               {PORTFOLIO_DATA.education.map((edu, idx) => (
                  <div key={idx} className={`reveal delay-${idx * 100} p-8 border border-white/10 bg-surface/50 hover:border-accent/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl group relative overflow-hidden`}>
                     <GraduationCap className="text-accent mb-4 group-hover:scale-110 transition-transform duration-500" size={32} />
                     <h3 className="font-display text-xl mb-1 group-hover:text-white transition-colors">{edu.school}</h3>
                     <p className="text-gray-400 text-sm mb-4">{edu.degree}</p>
                     <div className="font-mono text-xs text-accent mb-4 inline-block border border-accent/20 px-2 py-1 rounded">{edu.period}</div>
                     <ul className="space-y-2">
                       {edu.details.map((detail, i) => (
                         <li key={i} className="text-gray-500 text-xs border-l-2 border-white/10 pl-3 leading-relaxed group-hover:border-accent/50 group-hover:text-gray-400 transition-colors">
                           {detail}
                         </li>
                       ))}
                     </ul>
                  </div>
               ))}
             </div>

             <div className="space-y-16 relative">
               <div className="reveal">
                  <h3 className="font-display text-2xl uppercase border-b border-white/10 pb-4 mb-8 text-left text-gray-400">Professional Experience</h3>
               </div>
               
               {PORTFOLIO_DATA.experience.map((job, idx) => (
                 <div key={idx} className="relative pl-8 md:pl-0 reveal delay-100">
                   <div className="hidden md:block absolute left-[50%] top-0 bottom-0 w-px bg-white/10 -translate-x-1/2 origin-top transform scale-y-100"></div>
                   
                   <div className={`md:flex items-center justify-between gap-12 ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} group`}>
                     <div className={`md:w-1/2 ${idx % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                        <span className="font-mono text-accent text-sm tracking-wider block mb-2 opacity-70 group-hover:opacity-100 transition-opacity">{job.period}</span>
                        <h3 className="font-display text-xl md:text-3xl group-hover:text-accent transition-colors duration-500">{job.company}</h3>
                        <h4 className="font-sans text-base md:text-lg text-gray-400 mb-4">{job.role}</h4>
                     </div>
                     
                     <div className="absolute left-0 md:left-1/2 w-4 h-4 bg-base border-2 border-accent rounded-full -translate-x-[5px] md:-translate-x-1/2 z-10 group-hover:bg-accent group-hover:scale-150 transition-all duration-500 shadow-[0_0_10px_rgba(204,255,0,0.2)]"></div>

                     <div className={`md:w-1/2 ${idx % 2 !== 0 ? 'md:text-right' : 'md:text-left'} pl-8 md:pl-0`}>
                        <p className="font-sans text-gray-500 text-sm leading-relaxed group-hover:text-gray-300 transition-colors duration-500">
                          {job.description}
                        </p>
                     </div>
                   </div>
                 </div>
               ))}
             </div>
             
             {PORTFOLIO_DATA.leadership && PORTFOLIO_DATA.leadership.length > 0 && (
               <div className="mt-32 pt-16 border-t border-white/10 reveal">
                  <div className="flex items-end justify-between mb-12">
                      <div>
                          <h3 className="font-display text-2xl uppercase">Leadership & Community</h3>
                          <p className="font-mono text-accent mt-2 text-xs tracking-widest">/// IMPACT & OUTREACH</p>
                      </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {PORTFOLIO_DATA.leadership.map((role, idx) => (
                      <div key={idx} className={`flex gap-6 p-6 bg-surface/30 border border-white/5 hover:border-accent/30 hover:bg-surface/60 transition-all duration-500 ease-expo reveal delay-${idx * 100} group`}>
                        <div className="shrink-0">
                          <Users className="text-gray-500 group-hover:text-accent transition-colors duration-500" size={24} />
                        </div>
                        <div>
                          <h4 className="font-display text-lg group-hover:text-white transition-colors">{role.company}</h4>
                          <div className="text-accent font-mono text-xs mb-2">{role.role}</div>
                          <p className="text-gray-500 text-sm leading-relaxed">{role.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
               </div>
             )}

           </div>
        </section>

        {/* Contact / CTA */}
        <section id="contact" className="py-40 bg-surface relative overflow-hidden text-center">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
          <div className="max-w-3xl mx-auto px-6 relative z-10 reveal">
             <Terminal size={48} className="mx-auto text-accent mb-8 animate-pulse" />
             <h2 className="font-display text-5xl md:text-7xl uppercase mb-10 leading-none">
               Ready To <br/> <span className="font-outline-2 hover:text-accent transition-colors duration-700 ease-expo cursor-default">Deploy?</span>
             </h2>
             <p className="font-sans text-xl text-gray-400 mb-12">
               Currently architecting the future. Open to high-impact collaborations.
             </p>
             
             <button 
               onClick={handleContactClick}
               className={`group relative inline-flex items-center gap-3 px-12 py-6 text-base font-display font-bold text-lg uppercase tracking-widest transition-all duration-500 ease-expo border overflow-hidden ${
                 emailCopied 
                   ? 'bg-green-500 text-black border-green-500 shadow-[0_0_40px_rgba(34,197,94,0.5)]' 
                   : 'bg-accent text-black border-accent shadow-[0_0_20px_rgba(204,255,0,0.3)] hover:scale-105'
               }`}
             >
               <span className="relative z-10 flex items-center gap-3">
                  {emailCopied ? (
                    <>
                      <span className="w-2 h-2 bg-black rounded-full animate-pulse"></span>
                      SIGNAL LOCKED
                    </>
                  ) : (
                    <>
                      <span>INITIATE CONTACT</span>
                      <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
                    </>
                  )}
               </span>
               {/* Button shine effect */}
               {!emailCopied && <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>}
             </button>
             
             {emailCopied && (
                <p className="mt-8 font-mono text-green-500 text-xs tracking-widest animate-bounce">
                  [SYSTEM] EMAIL ADDRESS COPIED TO CLIPBOARD
                </p>
             )}
          </div>
        </section>

        <footer className="py-12 bg-base border-t border-white/10 relative z-10">
           <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-sm font-mono text-gray-500">
              <p>&copy; {new Date().getFullYear()} {PORTFOLIO_DATA.name}. System Online.</p>
              <p className="flex items-center gap-2">
                 <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                 v2.5.0
              </p>
           </div>
        </footer>

        {showChat && (
          <div className="fixed bottom-8 right-8 z-50 w-[90vw] md:w-[400px] h-[600px] animate-[fadeInUp_0.3s_ease-out]">
            <AIChat onClose={() => setShowChat(false)} />
          </div>
        )}
        
        {!showChat && (
          <button 
            onClick={() => setShowChat(true)}
            className="fixed bottom-8 right-8 z-40 p-4 bg-accent text-base rounded-full shadow-[0_0_20px_rgba(204,255,0,0.4)] hover:scale-110 transition-transform duration-300 ease-expo active:scale-90"
          >
            <MessageSquare size={24} />
          </button>
        )}
      </div>
    </>
  );
};

export default App;
