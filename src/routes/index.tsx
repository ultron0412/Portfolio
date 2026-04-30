import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import {
  Copy,
  Download,
  ExternalLink,
  Github,
  Linkedin,
  Mail,
  MapPin,
  MoveUpRight,
  Phone,
  X,
} from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";
import { MotionSection } from "@/components/MotionSection";
import { useMotionPreference } from "@/hooks/useMotionPreference";
import { usePortfolio } from "@/hooks/usePortfolio";
import { type ProjectItem } from "@/lib/cv";
import { sendContactMessage } from "@/services/portfolioApi";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function normalizeLink(value: string) {
  if (!value) return "";
  if (value.startsWith("/") || value.startsWith("./")) return value;
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

const projectImageByOrder: Record<number, string> = {
  0: "/project-images/jarvis-assistant.svg",
  1: "/project-images/heart-disease-prediction.svg",
  2: "/project-images/ai-resume-generator.svg",
  3: "/project-images/personal-expense-tracker.svg",
};

function resolveProjectImage(project: ProjectItem, index: number) {
  const directImage = String(project.imageUrl || "").trim();
  if (directImage) return directImage;
  return projectImageByOrder[project.order ?? index] || "";
}

type ContactErrors = Partial<Record<"name" | "email" | "subject" | "message", string>>;
type RadarAxis = {
  label: string;
  value: number;
};

function validateForm(payload: Record<string, string>): ContactErrors {
  const errors: ContactErrors = {};

  if (!payload.name || payload.name.trim().length < 2) {
    errors.name = "Name should be at least 2 characters.";
  }
  if (!payload.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
    errors.email = "Provide a valid email address.";
  }
  if (!payload.subject || payload.subject.trim().length < 3) {
    errors.subject = "Subject should be at least 3 characters.";
  }
  if (!payload.message || payload.message.trim().length < 12) {
    errors.message = "Message should be at least 12 characters.";
  }

  return errors;
}

function buildRadarPoints(
  axes: RadarAxis[],
  centerX: number,
  centerY: number,
  radius: number,
  valueSelector: (axis: RadarAxis) => number,
) {
  return axes
    .map((axis, index) => {
      const angle = -Math.PI / 2 + (index * Math.PI * 2) / axes.length;
      const ratio = Math.max(0, Math.min(100, valueSelector(axis))) / 100;
      const x = centerX + Math.cos(angle) * radius * ratio;
      const y = centerY + Math.sin(angle) * radius * ratio;
      return `${x},${y}`;
    })
    .join(" ");
}

function splitTitle(value: string) {
  return value
    .split(/\u00B7|\|/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function HomePage() {
  const { portfolio, isLoading } = usePortfolio();
  const { shouldReduceMotion } = useMotionPreference();

  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [formErrors, setFormErrors] = useState<ContactErrors>({});
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});

  const titleParts = splitTitle(portfolio.personal.title);
  const primaryRole = titleParts[0] || "Full-Stack Developer";

  const summaryChunks = portfolio.summary
    .split(". ")
    .map((item) => item.trim())
    .filter(Boolean);
  const shortSummary = `${summaryChunks.slice(0, 2).join(". ")}.`.replace(/\.\./g, ".");

  const resumeLink = normalizeLink(portfolio.personal.resumeUrl || "");
  const linkedinLink = normalizeLink(portfolio.personal.linkedin);
  const githubLink = normalizeLink(portfolio.personal.github);
  const profileImage = "https://github.com/ultron0412.png?size=480";

  const primaryExperience = portfolio.experience[0];

  const skillGroups = useMemo(() => {
    const groups = Object.entries(portfolio.skills);
    const maxCount = Math.max(1, ...groups.map(([, values]) => values.length));

    return groups.map(([group, values]) => {
      return {
        group,
        values,
        coverage: Math.round(52 + (values.length / maxCount) * 36),
      };
    });
  }, [portfolio.skills]);

  const radarAxes = useMemo(() => {
    const coverageMap = new Map(
      skillGroups.map((group) => [group.group.toLowerCase(), group.coverage]),
    );

    const findCoverage = (keyword: string, fallback = 60) => {
      for (const [name, value] of coverageMap.entries()) {
        if (name.includes(keyword)) return value;
      }
      return fallback;
    };

    const ml = findCoverage("ml", findCoverage("ai", 72));
    const backend = findCoverage("backend", 70);
    const frontend = findCoverage("frontend", 68);
    const database = findCoverage("database", 64);
    const enterprise = findCoverage("enterprise", 60);

    return [
      { label: "ML/AI", value: ml },
      { label: "Backend", value: backend },
      { label: "Database", value: database },
      { label: "Version Control", value: Math.round((backend + frontend) / 2) - 4 },
      { label: "REST APIs", value: Math.round((backend + ml) / 2) },
      { label: "Architecture", value: Math.round((backend + enterprise) / 2) },
      { label: "Testing", value: Math.round((frontend + backend) / 2) - 6 },
      { label: "Frontend", value: frontend },
    ] satisfies RadarAxis[];
  }, [skillGroups]);

  const radarCenterX = 340;
  const radarCenterY = 245;
  const radarRadius = 172;
  const radarLevels = [25, 50, 75, 100];
  const radarBenchmarkPoints = buildRadarPoints(
    radarAxes,
    radarCenterX,
    radarCenterY,
    radarRadius,
    () => 100,
  );
  const radarCurrentPoints = buildRadarPoints(
    radarAxes,
    radarCenterX,
    radarCenterY,
    radarRadius,
    (axis) => axis.value,
  );

  const submitContact = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const payload = {
      name: String(formData.get("name") || ""),
      email: String(formData.get("email") || ""),
      subject: String(formData.get("subject") || ""),
      message: String(formData.get("message") || ""),
    };

    const errors = validateForm(payload);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      setStatus("error");
      setErrorMessage("Please resolve the highlighted form fields.");
      return;
    }

    setStatus("sending");
    setErrorMessage("");

    try {
      await sendContactMessage(payload);
      event.currentTarget.reset();
      setFormErrors({});
      setStatus("sent");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to send message.";
      setStatus("error");
      setErrorMessage(message);
    }
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(portfolio.personal.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      setStatus("error");
      setErrorMessage("Clipboard access is blocked in this browser.");
    }
  };

  if (isLoading) {
    return (
      <div className="section-stack">
        {Array.from({ length: 6 }).map((_, index) => (
          <section
            key={`skeleton-${index}`}
            className="section-card skeleton-card"
            aria-hidden="true"
          >
            <div className="skeleton-line skeleton-title" />
            <div className="skeleton-line" />
            <div className="skeleton-line" />
            <div className="skeleton-line skeleton-short" />
          </section>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="section-stack">
        <MotionSection id="home" className="section-card hero-section">
          <div className="hero-wrap">
            <motion.div
              className="hero-text"
              initial={{ opacity: 0, x: shouldReduceMotion ? 0 : -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: shouldReduceMotion ? 0.2 : 0.55, ease: "easeOut" }}
            >
              <p className="hero-kicker">
                Hello, <span>It&apos;s Me</span>
              </p>
              <h1>{portfolio.personal.name}</h1>
              <h3>
                And I&apos;m a <span>{primaryRole}</span>
              </h3>
              <p className="hero-summary">{shortSummary}</p>

              <div className="hero-cta-row">
                <a href="#contact" className="action-btn action-btn-primary">
                  Hire Me
                  <MoveUpRight size={15} />
                </a>
                <a href="#contact" className="action-btn">
                  Let&apos;s Talk
                </a>
                {resumeLink ? (
                  <a href={resumeLink} className="action-btn" download>
                    <Download size={14} />
                    Download CV
                  </a>
                ) : null}
              </div>

              <div className="hero-social-row" aria-label="Social links">
                <a href={githubLink} target="_blank" rel="noreferrer" className="hero-social-link">
                  <Github size={15} />
                </a>
                <a
                  href={linkedinLink}
                  target="_blank"
                  rel="noreferrer"
                  className="hero-social-link"
                >
                  <Linkedin size={15} />
                </a>
                <a href={`mailto:${portfolio.personal.email}`} className="hero-social-link">
                  <Mail size={15} />
                </a>
              </div>
            </motion.div>

            <motion.div
              className="hero-portrait-card"
              initial={shouldReduceMotion ? false : { opacity: 0, x: 18 }}
              whileInView={shouldReduceMotion ? {} : { opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
            >
              <div className="hero-portrait-frame">
                <img src={profileImage} alt={`${portfolio.personal.name} profile`} loading="lazy" />
              </div>
            </motion.div>
          </div>
        </MotionSection>

        <MotionSection id="about_me" className="section-card about-section" delay={0.04}>
          <h2 className="section-heading">
            About <span>Me</span>
          </h2>
          <div className="about-grid">
            <div className="about-image-wrap">
              <img src={profileImage} alt={`${portfolio.personal.name} portrait`} loading="lazy" />
            </div>

            <div className="about-content">
              <h3>{portfolio.personal.title}</h3>
              <p>{portfolio.summary}</p>

              {primaryExperience ? (
                <div className="about-experience-card">
                  <h4>{primaryExperience.company}</h4>
                  <p className="about-meta">
                    {primaryExperience.role} - {primaryExperience.duration}
                  </p>
                  <ul>
                    {primaryExperience.responsibilities.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </div>
        </MotionSection>

        <MotionSection id="services" className="section-card" delay={0.08}>
          <h2 className="section-heading">
            My <span>Education</span>
          </h2>
          <div className="education-grid">
            {portfolio.education.map((item) => (
              <article
                key={item._id || `${item.institution}-${item.order}`}
                className="education-card"
              >
                <h3>{item.institution}</h3>
                <p className="education-degree">{item.degree}</p>
                <p className="education-meta">
                  {item.location} - {item.duration}
                </p>
              </article>
            ))}
          </div>
        </MotionSection>

        <MotionSection id="skills" className="section-card" delay={0.12}>
          <h2 className="section-heading">
            My <span>Skills</span> - Tools
          </h2>
          <p className="skills-intro">
            Skill stack overview based on relative working depth across core engineering domains.
          </p>

          <div className="skills-radar-layout">
            <motion.div
              className="skills-radar-card"
              initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.98 }}
              whileInView={shouldReduceMotion ? {} : { opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.26 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <svg
                viewBox="0 0 680 500"
                className="skills-radar-svg"
                aria-label="Skill stack radar chart"
              >
                {radarLevels.map((level) => {
                  const points = buildRadarPoints(
                    radarAxes,
                    radarCenterX,
                    radarCenterY,
                    radarRadius,
                    () => level,
                  );
                  return <polygon key={level} points={points} className="radar-grid-level" />;
                })}

                {radarAxes.map((axis, index) => {
                  const angle = -Math.PI / 2 + (index * Math.PI * 2) / radarAxes.length;
                  const endX = radarCenterX + Math.cos(angle) * radarRadius * 1.08;
                  const endY = radarCenterY + Math.sin(angle) * radarRadius * 1.08;
                  const labelX = radarCenterX + Math.cos(angle) * radarRadius * 1.36;
                  const labelY = radarCenterY + Math.sin(angle) * radarRadius * 1.36;
                  const labelParts =
                    axis.label.length > 12 && axis.label.includes(" ")
                      ? axis.label.split(" ")
                      : [axis.label];

                  let anchor: "start" | "middle" | "end" = "middle";
                  if (Math.cos(angle) > 0.3) anchor = "start";
                  if (Math.cos(angle) < -0.3) anchor = "end";

                  return (
                    <g key={axis.label}>
                      <line
                        x1={radarCenterX}
                        y1={radarCenterY}
                        x2={endX}
                        y2={endY}
                        className="radar-axis-line"
                      />
                      <text x={labelX} y={labelY} textAnchor={anchor} className="radar-axis-label">
                        {labelParts.map((part, partIndex) => (
                          <tspan
                            key={`${axis.label}-${part}-${partIndex}`}
                            x={labelX}
                            dy={partIndex === 0 ? 0 : "1.1em"}
                          >
                            {part}
                          </tspan>
                        ))}
                      </text>
                    </g>
                  );
                })}

                <polygon points={radarBenchmarkPoints} className="radar-benchmark" />
                <motion.polygon
                  points={radarCurrentPoints}
                  className="radar-current"
                  initial={shouldReduceMotion ? false : { opacity: 0 }}
                  whileInView={shouldReduceMotion ? {} : { opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55, ease: "easeOut" }}
                />

                {radarAxes.map((axis, index) => {
                  const angle = -Math.PI / 2 + (index * Math.PI * 2) / radarAxes.length;
                  const x = radarCenterX + Math.cos(angle) * radarRadius * (axis.value / 100);
                  const y = radarCenterY + Math.sin(angle) * radarRadius * (axis.value / 100);
                  return (
                    <circle
                      key={`${axis.label}-dot`}
                      cx={x}
                      cy={y}
                      r="4.4"
                      className="radar-value-dot"
                    />
                  );
                })}
              </svg>
              <p className="skills-radar-note">
                Relative depth index based on your current stack, not absolute mastery.
              </p>
            </motion.div>

            <div className="skills-radar-legend">
              {radarAxes.map((axis, index) => (
                <motion.div
                  key={axis.label}
                  className="skills-radar-legend-item"
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
                  whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.26, delay: index * 0.05 }}
                >
                  <span>{axis.label}</span>
                  <strong>{axis.value}%</strong>
                </motion.div>
              ))}
            </div>
          </div>
        </MotionSection>

        <MotionSection id="portflio" className="section-card" delay={0.16}>
          <h2 className="section-heading">
            Latest <span>Project</span>
          </h2>
          <div className="project-grid">
            {portfolio.projects.map((project, index) => {
              const projectImage = resolveProjectImage(project, index);
              const projectLink = normalizeLink(project.demo || project.github);

              return (
                <motion.article
                  key={project._id || `${project.name}-${project.order}`}
                  className="project-card"
                  initial={{ opacity: 0, y: shouldReduceMotion ? 8 : 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.24 }}
                  transition={{ duration: shouldReduceMotion ? 0.2 : 0.42, delay: index * 0.05 }}
                  onClick={() => setSelectedProject(project)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setSelectedProject(project);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label={`Open project details for ${project.name}`}
                >
                  <div className="project-visual">
                    {projectImage ? (
                      <img
                        src={normalizeLink(projectImage)}
                        alt={`${project.name} visual`}
                        loading="lazy"
                        className={loadedImages[project.name] ? "loaded" : ""}
                        onLoad={() =>
                          setLoadedImages((current) => ({
                            ...current,
                            [project.name]: true,
                          }))
                        }
                      />
                    ) : (
                      <div className="project-fallback">Project Preview</div>
                    )}
                  </div>

                  <div className="portfolio-content">
                    <h3>{project.name}</h3>
                    <p>{project.description}</p>
                    <div className="tag-row">
                      {project.technologies.slice(0, 5).map((tech) => (
                        <span key={`${project.name}-${tech}`}>{tech}</span>
                      ))}
                    </div>
                    {projectLink ? (
                      <a
                        href={projectLink}
                        target="_blank"
                        rel="noreferrer"
                        className="project-link"
                      >
                        <ExternalLink size={15} />
                      </a>
                    ) : null}
                  </div>
                </motion.article>
              );
            })}
          </div>
        </MotionSection>

        <MotionSection id="certifications" className="section-card" delay={0.18}>
          <h2 className="section-heading">
            My <span>Certifications</span>
          </h2>
          <div className="certifications-grid">
            {portfolio.certifications.map((item, index) => {
              const credentialUrl = normalizeLink(item.credentialUrl || "");

              return (
                <motion.article
                  key={item._id || `${item.name}-${item.order}`}
                  className="certification-card"
                  initial={{ opacity: 0, y: shouldReduceMotion ? 8 : 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.28 }}
                  transition={{ duration: shouldReduceMotion ? 0.2 : 0.36, delay: index * 0.05 }}
                >
                  <div className="certification-head">
                    <h3>{item.name}</h3>
                    <span>{item.date}</span>
                  </div>
                  <p className="certification-issuer">{item.issuer}</p>

                  {credentialUrl ? (
                    <a
                      href={credentialUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="action-btn certification-link"
                    >
                      <ExternalLink size={14} />
                      View Credential
                    </a>
                  ) : (
                    <p className="certification-note">Credential link not available</p>
                  )}
                </motion.article>
              );
            })}
          </div>
        </MotionSection>

        <MotionSection id="contact" className="section-card" delay={0.2}>
          <h2 className="section-heading">
            Contact <span>Me!</span>
          </h2>
          <div className="contact-layout">
            <form onSubmit={submitContact} className="contact-form" noValidate>
              <label>
                Full Name
                <input
                  name="name"
                  required
                  aria-invalid={Boolean(formErrors.name)}
                  className={formErrors.name ? "field-error" : ""}
                />
                {formErrors.name ? (
                  <span className="field-error-text">{formErrors.name}</span>
                ) : null}
              </label>

              <label>
                Email Address
                <input
                  name="email"
                  type="email"
                  required
                  aria-invalid={Boolean(formErrors.email)}
                  className={formErrors.email ? "field-error" : ""}
                />
                {formErrors.email ? (
                  <span className="field-error-text">{formErrors.email}</span>
                ) : null}
              </label>

              <label>
                Subject
                <input
                  name="subject"
                  required
                  aria-invalid={Boolean(formErrors.subject)}
                  className={formErrors.subject ? "field-error" : ""}
                />
                {formErrors.subject ? (
                  <span className="field-error-text">{formErrors.subject}</span>
                ) : null}
              </label>

              <label>
                Message
                <textarea
                  name="message"
                  rows={6}
                  required
                  aria-invalid={Boolean(formErrors.message)}
                  className={formErrors.message ? "field-error" : ""}
                />
                {formErrors.message ? (
                  <span className="field-error-text">{formErrors.message}</span>
                ) : null}
              </label>

              <button
                type="submit"
                disabled={status === "sending"}
                className="action-btn action-btn-primary submit-btn"
              >
                {status === "sending" ? "Sending..." : "Send Message"}
              </button>

              {status === "sent" ? (
                <p className="status success">Message sent successfully.</p>
              ) : null}
              {status === "error" ? <p className="status error">{errorMessage}</p> : null}
            </form>

            <aside className="contact-details">
              <p>
                <Phone size={15} />
                <a href={`tel:${portfolio.personal.phone.replace(/\s+/g, "")}`}>
                  {portfolio.personal.phone}
                </a>
              </p>
              <p>
                <Mail size={15} />
                <a href={`mailto:${portfolio.personal.email}`}>{portfolio.personal.email}</a>
              </p>
              <p>
                <MapPin size={15} />
                <span>{portfolio.personal.location}</span>
              </p>
              <button type="button" className="action-btn" onClick={copyEmail}>
                <Copy size={14} />
                {copied ? "Copied" : "Copy Email"}
              </button>
            </aside>
          </div>
        </MotionSection>
      </div>

      <AnimatePresence>
        {selectedProject ? (
          <motion.div
            className="project-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProject(null)}
            role="dialog"
            aria-modal="true"
            aria-label={`${selectedProject.name} details`}
          >
            <motion.article
              className="project-modal-card"
              initial={shouldReduceMotion ? false : { opacity: 0, y: 18, scale: 0.98 }}
              animate={shouldReduceMotion ? {} : { opacity: 1, y: 0, scale: 1 }}
              exit={shouldReduceMotion ? {} : { opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: 0.24, ease: "easeOut" }}
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                className="modal-close"
                aria-label="Close project details"
                onClick={() => setSelectedProject(null)}
              >
                <X size={15} />
              </button>

              <h3>{selectedProject.name}</h3>
              <p>{selectedProject.description}</p>
              <div className="tag-row">
                {selectedProject.technologies.map((tech) => (
                  <span key={`${selectedProject.name}-modal-${tech}`}>{tech}</span>
                ))}
              </div>
              <div className="link-row">
                {selectedProject.github ? (
                  <a
                    href={normalizeLink(selectedProject.github)}
                    target="_blank"
                    rel="noreferrer"
                    className="action-btn"
                  >
                    GitHub
                  </a>
                ) : null}
                {selectedProject.demo ? (
                  <a
                    href={normalizeLink(selectedProject.demo)}
                    target="_blank"
                    rel="noreferrer"
                    className="action-btn action-btn-primary"
                  >
                    Live Demo
                  </a>
                ) : null}
              </div>
            </motion.article>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
