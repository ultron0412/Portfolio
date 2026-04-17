import { createFileRoute } from "@tanstack/react-router";
import { cv } from "@/lib/cv";
import { Reveal } from "@/components/Reveal";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Projects — Ayush Jung Kunwar" },
      {
        name: "description",
        content:
          "Selected projects by Ayush Jung Kunwar — Jarvis voice assistant, heart disease prediction model, and AI resume generator.",
      },
      { property: "og:title", content: "Projects — Ayush Jung Kunwar" },
      {
        property: "og:description",
        content: "AI, ML and full-stack projects built by Ayush Jung Kunwar.",
      },
    ],
  }),
  component: ProjectsPage,
});

function ProjectsPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 pb-16 pt-12 sm:px-8 sm:pt-16">
      <Reveal>
        <p className="text-xs font-semibold uppercase tracking-widest text-ember">Portfolio</p>
        <h1 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          Things I've built.
        </h1>
        <p className="mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
          A mix of AI experiments, full-stack apps and data-driven tools — each shipped end-to-end.
        </p>
      </Reveal>

      <div className="mt-14 space-y-6">
        {cv.projects.map((p, i) => (
          <Reveal key={p.title} delay={i * 80}>
            <article className="group grid gap-6 rounded-2xl border border-border bg-surface p-6 transition-all hover:border-ember/60 sm:p-8 md:grid-cols-[1fr_2fr]">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-ember">
                  {p.period}
                </p>
                <h2 className="mt-2 font-display text-2xl font-bold leading-tight sm:text-3xl">
                  {p.title}
                </h2>
                {p.highlight && (
                  <span className="mt-3 inline-block rounded-full border border-ember/40 bg-ember/10 px-2.5 py-0.5 text-xs font-medium text-ember">
                    Featured
                  </span>
                )}
              </div>
              <div>
                <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {p.description}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {p.tech.map((t) => (
                    <span
                      key={t}
                      className="rounded-md border border-border bg-background/40 px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors group-hover:border-ember/30"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
