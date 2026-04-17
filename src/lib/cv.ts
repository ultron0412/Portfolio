export const cv = {
  name: "Ayush Jung Kunwar",
  initials: "AJK",
  roles: ["AI/ML Engineer", "System Engineer", "Builder"],
  tagline:
    "Building intelligent systems where AI meets reliable engineering — from voice assistants to predictive healthcare models.",
  location: "Kathmandu, Nepal",
  email: "ayush.jung.kunwar@example.com",
  phone: "+977-98XXXXXXXX",
  linkedin: "https://linkedin.com/in/ayushjungkunwar",
  github: "https://github.com/ayushjungkunwar",

  experience: [
    {
      company: "Bizhub",
      role: "System Engineer",
      period: "2023 — Present",
      summary:
        "Designing, deploying and maintaining enterprise infrastructure. Automating workflows and supporting Oracle-based systems at scale.",
      bullets: [
        "Maintained mission-critical systems with high uptime SLAs.",
        "Automated provisioning and monitoring pipelines.",
        "Collaborated cross-functionally to resolve complex production incidents.",
      ],
    },
  ],

  projects: [
    {
      title: "Jarvis — Voice AI Assistant",
      period: "2024",
      tech: ["Python", "Speech Recognition", "LLMs", "TTS"],
      description:
        "A modular voice assistant that listens, reasons and responds in real time. Integrates wake-word detection, LLM-powered intent parsing and natural speech synthesis to handle everyday tasks hands-free.",
      highlight: true,
    },
    {
      title: "Heart Disease Prediction",
      period: "2024",
      tech: ["Python", "scikit-learn", "Pandas", "Streamlit"],
      description:
        "ML pipeline that predicts cardiovascular risk from clinical features. Includes data cleaning, feature engineering, model selection and an interactive demo for clinicians.",
    },
    {
      title: "AI Resume Generator",
      period: "2024",
      tech: ["Next.js", "OpenAI API", "Tailwind"],
      description:
        "Generates tailored, role-specific resumes from a short profile and job description. Outputs ATS-friendly markdown and PDF in seconds.",
    },
  ],

  skills: {
    "AI / ML": ["Python", "scikit-learn", "Pandas", "NumPy", "LLM Integration", "Prompt Engineering"],
    "Systems": ["Oracle Database", "Linux", "Networking", "Bash", "Monitoring"],
    "Web": ["React", "Next.js", "TypeScript", "Tailwind", "Node.js"],
    "Tools": ["Git", "Docker", "Figma", "VS Code"],
  } as Record<string, string[]>,

  education: [
    {
      school: "Tribhuvan University",
      degree: "BSc. Computer Science & Information Technology",
      period: "2019 — 2023",
    },
  ],

  certifications: [
    { name: "Oracle Cloud Infrastructure Foundations Associate", issuer: "Oracle", year: "2024" },
    { name: "Oracle Database SQL Certified Associate", issuer: "Oracle", year: "2024" },
    { name: "Oracle Autonomous Database Cloud Specialist", issuer: "Oracle", year: "2024" },
    { name: "Oracle Cloud Data Management Foundations", issuer: "Oracle", year: "2023" },
    { name: "Oracle AI Foundations Associate", issuer: "Oracle", year: "2024" },
    { name: "Oracle Generative AI Professional", issuer: "Oracle", year: "2024" },
  ],
};
