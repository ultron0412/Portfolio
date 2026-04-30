import { Link } from "@tanstack/react-router";
import {
  BadgeCheck,
  BookOpen,
  BriefcaseBusiness,
  FolderKanban,
  Github,
  GraduationCap,
  House,
  Linkedin,
  Menu,
  Moon,
  Shield,
  Sparkles,
  Sun,
  X,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { usePortfolio } from "@/hooks/usePortfolio";

const sections = [
  { id: "about", label: "About", icon: House },
  { id: "experience", label: "Experience", icon: BriefcaseBusiness },
  { id: "projects", label: "Projects", icon: FolderKanban },
  { id: "skills", label: "Skills", icon: Sparkles },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "certifications", label: "Certifications", icon: BadgeCheck },
  { id: "contact", label: "Contact", icon: BookOpen },
] as const;

function sanitizeLink(rawLink: string) {
  if (!rawLink) return "";
  return rawLink.startsWith("http://") || rawLink.startsWith("https://")
    ? rawLink
    : `https://${rawLink}`;
}

export function SiteHeader() {
  const { portfolio } = usePortfolio();
  const { theme, toggleTheme } = useTheme();
  const shouldReduceMotion = useReducedMotion();

  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("about");
  const [isScrolled, setIsScrolled] = useState(false);

  const socialLinks = useMemo(
    () => ({
      linkedin: sanitizeLink(portfolio.personal.linkedin),
      github: sanitizeLink(portfolio.personal.github),
    }),
    [portfolio.personal.github, portfolio.personal.linkedin],
  );

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 22);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible.length > 0) {
          setActiveSection(visible[0].target.id);
        }
      },
      { rootMargin: "-36% 0px -50% 0px", threshold: [0.18, 0.45, 0.8] },
    );

    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="site-header">
      <motion.div
        className="profile-head"
        initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
        animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
      >
        <h1 className="profile-name">{portfolio.personal.name}</h1>
        <p className="profile-title">{portfolio.personal.title}</p>
        <div className="profile-meta">
          <span>{portfolio.personal.phone}</span>
          <span>{portfolio.personal.email}</span>
          <span>{portfolio.personal.location}</span>
        </div>
        <div className="profile-links">
          <a
            href={socialLinks.linkedin}
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn profile"
          >
            <Linkedin size={14} />
            LinkedIn
          </a>
          <a href={socialLinks.github} target="_blank" rel="noreferrer" aria-label="GitHub profile">
            <Github size={14} />
            GitHub
          </a>
          <Link to="/admin" aria-label="Open admin dashboard">
            <Shield size={14} />
            Admin
          </Link>
        </div>
      </motion.div>

      <motion.div
        className={`sticky-nav ${isScrolled ? "is-scrolled" : ""}`}
        animate={shouldReduceMotion ? {} : { y: isScrolled ? -2 : 0, opacity: 1 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
      >
        <button
          type="button"
          className="menu-toggle"
          onClick={() => setMenuOpen((current) => !current)}
          aria-label="Toggle section menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>

        <nav className={`section-nav ${menuOpen ? "open" : ""}`} aria-label="Page sections">
          {sections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className={activeSection === section.id ? "active" : ""}
              onClick={closeMenu}
            >
              <section.icon size={15} />
              {section.label}
            </a>
          ))}
        </nav>

        <button
          type="button"
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </motion.div>
    </header>
  );
}
