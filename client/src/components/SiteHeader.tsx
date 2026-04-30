import { Link } from "@tanstack/react-router";
import { Github, Linkedin, Menu, Moon, Shield, Sun, X, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useMotionPreference } from "@/hooks/useMotionPreference";
import { useTheme } from "@/context/ThemeContext";
import { usePortfolio } from "@/hooks/usePortfolio";

const sections = [
  { id: "home", label: "Home" },
  { id: "about_me", label: "About Me" },
  { id: "services", label: "Education" },
  { id: "skills", label: "Skills" },
  { id: "portflio", label: "Projects" },
  { id: "certifications", label: "Certifications" },
  { id: "contact", label: "Contact" },
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
  const { shouldReduceMotion, preference, toggleMotion } = useMotionPreference();

  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
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
      { rootMargin: "-38% 0px -48% 0px", threshold: [0.18, 0.44, 0.78] },
    );

    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const closeMenu = () => setMenuOpen(false);
  const brandName = useMemo(() => {
    const firstName = portfolio.personal.name.split(" ")[0]?.trim();
    return firstName ? `${firstName}.` : "Portfolio.";
  }, [portfolio.personal.name]);

  return (
    <header className="site-header">
      <motion.div
        className="header-row"
        initial={{ opacity: 0, y: shouldReduceMotion ? 8 : 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: shouldReduceMotion ? 0.25 : 0.55, ease: "easeOut" }}
      >
        <Link to="/" className="brand-mark" aria-label="Go to home">
          {brandName}
        </Link>

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
              {section.label}
            </a>
          ))}
        </nav>

        <div className={`header-utilities ${isScrolled ? "is-scrolled" : ""}`}>
          <a href={socialLinks.github} target="_blank" rel="noreferrer" aria-label="GitHub profile">
            <Github size={14} />
          </a>
          <a
            href={socialLinks.linkedin}
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn profile"
          >
            <Linkedin size={14} />
          </a>
          <Link to="/admin" aria-label="Open admin dashboard" className="admin-link">
            <Shield size={14} />
            Admin
          </Link>
          <button
            type="button"
            className={`theme-toggle motion-toggle ${preference === "reduced" ? "is-reduced" : "is-full"}`}
            onClick={toggleMotion}
            aria-label={`Toggle motion. Currently ${preference}`}
            title={`Motion: ${preference}`}
          >
            <Zap size={18} />
          </button>
          <button
            type="button"
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </motion.div>
    </header>
  );
}
