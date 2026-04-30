import { usePortfolio } from "@/hooks/usePortfolio";
import { Github, Linkedin, Mail } from "lucide-react";

function normalizeLink(value: string) {
  if (!value) return "";
  if (
    value.startsWith("http://") ||
    value.startsWith("https://") ||
    value.startsWith("mailto:") ||
    value.startsWith("tel:")
  ) {
    return value;
  }
  return `https://${value}`;
}

export function SiteFooter() {
  const { portfolio } = usePortfolio();
  const year = new Date().getFullYear();
  const linkedin = normalizeLink(portfolio.personal.linkedin);
  const github = normalizeLink(portfolio.personal.github);
  const mailLink = `mailto:${portfolio.personal.email}`;

  return (
    <footer className="site-footer">
      <div className="site-footer-primary">
        <p className="site-footer-title">{portfolio.personal.name}</p>
        <p className="site-footer-copy">
          (c) {year} {portfolio.personal.name}. Built with MERN and AI-focused workflows.
        </p>
      </div>

      <div className="site-footer-links" aria-label="Footer links">
        <a href={mailLink} className="site-footer-link">
          <Mail size={14} />
          Email
        </a>
        <a href={linkedin} target="_blank" rel="noreferrer" className="site-footer-link">
          <Linkedin size={14} />
          LinkedIn
        </a>
        <a href={github} target="_blank" rel="noreferrer" className="site-footer-link">
          <Github size={14} />
          GitHub
        </a>
      </div>
    </footer>
  );
}
