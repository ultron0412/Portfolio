import { createFileRoute } from "@tanstack/react-router";
import { Check, Copy, Github, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import { useState } from "react";
import { cv } from "@/lib/cv";
import { Reveal } from "@/components/Reveal";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Ayush Jung Kunwar" },
      {
        name: "description",
        content: "Get in touch with Ayush Jung Kunwar for AI/ML, systems and full-stack projects.",
      },
      { property: "og:title", content: "Contact — Ayush Jung Kunwar" },
      {
        property: "og:description",
        content: "Reach out via email, phone, LinkedIn or GitHub.",
      },
    ],
  }),
  component: ContactPage,
});

function CopyField({
  label,
  value,
  href,
  icon: Icon,
}: {
  label: string;
  value: string;
  href?: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="group flex items-center justify-between gap-3 rounded-2xl border border-border bg-surface p-5 transition-colors hover:border-ember/50">
      <div className="flex min-w-0 items-center gap-4">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-ember/15 text-ember">
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {label}
          </p>
          {href ? (
            <a
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              className="block truncate font-medium text-foreground transition-colors hover:text-ember"
            >
              {value}
            </a>
          ) : (
            <p className="truncate font-medium text-foreground">{value}</p>
          )}
        </div>
      </div>
      <button
        type="button"
        onClick={onCopy}
        aria-label={`Copy ${label}`}
        className="grid h-9 w-9 shrink-0 place-items-center rounded-md border border-border text-muted-foreground transition-colors hover:border-ember hover:text-ember"
      >
        {copied ? <Check className="h-4 w-4 text-ember" /> : <Copy className="h-4 w-4" />}
      </button>
    </div>
  );
}

function ContactPage() {
  return (
    <div className="mx-auto max-w-4xl px-5 pb-16 pt-12 sm:px-8 sm:pt-16">
      <Reveal>
        <p className="text-xs font-semibold uppercase tracking-widest text-ember">Contact</p>
        <h1 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          Let's build <span className="text-ember">something.</span>
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          Whether it's an AI experiment, a systems project, or a full product — I'd love to hear
          about it. Best reached by email or LinkedIn.
        </p>
      </Reveal>

      <div className="mt-12 grid gap-3">
        <Reveal>
          <CopyField label="Email" value={cv.email} href={`mailto:${cv.email}`} icon={Mail} />
        </Reveal>
        <Reveal delay={60}>
          <CopyField label="Phone" value={cv.phone} href={`tel:${cv.phone}`} icon={Phone} />
        </Reveal>
        <Reveal delay={120}>
          <CopyField label="Location" value={cv.location} icon={MapPin} />
        </Reveal>
        <Reveal delay={180}>
          <CopyField label="LinkedIn" value={cv.linkedin} href={cv.linkedin} icon={Linkedin} />
        </Reveal>
        <Reveal delay={240}>
          <CopyField label="GitHub" value={cv.github} href={cv.github} icon={Github} />
        </Reveal>
      </div>

      <Reveal delay={300}>
        <a
          href={`mailto:${cv.email}`}
          className="mt-10 inline-flex items-center gap-2 rounded-md bg-ember px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg transition-all hover:scale-[1.02] hover:shadow-[0_12px_40px_-10px_var(--ember)]"
        >
          <Mail className="h-4 w-4" />
          Send me an email
        </a>
      </Reveal>
    </div>
  );
}
