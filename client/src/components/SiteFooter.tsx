import { usePortfolio } from "@/hooks/usePortfolio";
import { ArrowUp, Github, Linkedin, Mail } from "lucide-react";

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
    <footer className="site-footer" id="footer">
      <div className="site-footer-primary">
        <p className="site-footer-copy">
          Copyright (c) {year} by {portfolio.personal.name}. All rights reserved.
        </p>
        <p className="site-footer-thanks">Thanks for visiting.</p>
      </div>

      <div className="site-footer-links" aria-label="Footer links">
        <a href={mailLink} className="site-footer-link">
          <Mail size={14} />
        </a>
        <a href={linkedin} target="_blank" rel="noreferrer" className="site-footer-link">
          <Linkedin size={14} />
        </a>
        <a href={github} target="_blank" rel="noreferrer" className="site-footer-link">
          <Github size={14} />
        </a>
      </div>

      <a href="#home" className="site-footer-top" aria-label="Back to top">
        <ArrowUp size={16} />
      </a>
    </footer>
  );
}
