import { Link } from "@tanstack/react-router";
import { Github, Linkedin, Mail } from "lucide-react";
import { cv } from "@/lib/cv";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-5 py-10 sm:px-8 md:flex-row md:items-center">
        <div>
          <Link to="/" className="font-display text-lg font-bold tracking-tight">
            {cv.name}
          </Link>
          <p className="mt-1 text-sm text-muted-foreground">
            © {new Date().getFullYear()} — Built with focus and ember.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={cv.github}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="grid h-10 w-10 place-items-center rounded-md border border-border text-muted-foreground transition-colors hover:border-ember hover:text-ember"
          >
            <Github className="h-4 w-4" />
          </a>
          <a
            href={cv.linkedin}
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
            className="grid h-10 w-10 place-items-center rounded-md border border-border text-muted-foreground transition-colors hover:border-ember hover:text-ember"
          >
            <Linkedin className="h-4 w-4" />
          </a>
          <a
            href={`mailto:${cv.email}`}
            aria-label="Email"
            className="grid h-10 w-10 place-items-center rounded-md border border-border text-muted-foreground transition-colors hover:border-ember hover:text-ember"
          >
            <Mail className="h-4 w-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}
