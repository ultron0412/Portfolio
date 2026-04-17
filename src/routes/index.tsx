import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Award, Briefcase, Cpu, Sparkles } from "lucide-react";
import { cv } from "@/lib/cv";
import { Reveal } from "@/components/Reveal";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ayush Jung Kunwar — AI/ML & Systems Engineer" },
      {
        name: "description",
        content:
          "Portfolio of Ayush Jung Kunwar. AI/ML projects, systems engineering work, and Oracle-certified expertise.",
      },
      { property: "og:title", content: "Ayush Jung Kunwar — Portfolio" },
      {
        property: "og:description",
        content: "AI/ML engineer building voice assistants, predictive models and reliable systems.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const featured = cv.projects[0];

  return (
    <div className="mx-auto max-w-6xl px-5 pb-16 pt-12 sm:px-8 sm:pt-16">
      {/* Hero */}
      <section className="grain relative">
        <Reveal>
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ember opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-ember" />
            </span>
            Available for new projects
          </div>
        </Reveal>

        <Reveal delay={80}>
          <h1 className="mt-6 font-display text-5xl font-bold leading-[0.95] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
            {cv.name.split(" ").slice(0, 2).join(" ")}
            <br />
            <span className="text-ember">{cv.name.split(" ").slice(2).join(" ")}</span>
          </h1>
        </Reveal>

        <Reveal delay={160}>
          <div className="mt-6 flex flex-wrap items-center gap-2">
            {cv.roles.map((r) => (
              <span
                key={r}
                className="rounded-full border border-border bg-surface/40 px-3 py-1 text-xs font-medium text-muted-foreground"
              >
                {r}
              </span>
            ))}
          </div>
        </Reveal>

        <Reveal delay={220}>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {cv.tagline}
          </p>
        </Reveal>

        <Reveal delay={280}>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              to="/projects"
              className="group inline-flex items-center gap-2 rounded-md bg-ember px-5 py-3 text-sm font-semibold text-primary-foreground shadow-lg transition-all hover:scale-[1.02] hover:shadow-[0_12px_40px_-10px_var(--ember)]"
            >
              View projects
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-md border border-border bg-surface/40 px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:border-ember hover:text-ember"
            >
              Get in touch
            </Link>
          </div>
        </Reveal>
      </section>

      {/* Bento grid */}
      <section className="mt-20">
        <Reveal>
          <div className="mb-6 flex items-end justify-between">
            <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
              Selected work
            </h2>
            <Link
              to="/projects"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-ember"
            >
              All projects →
            </Link>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-6 md:auto-rows-[180px]">
          {/* Featured large */}
          <Reveal className="md:col-span-4 md:row-span-2">
            <Link
              to="/projects"
              className="group relative flex h-full min-h-[320px] flex-col justify-between overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-surface to-background p-6 transition-all hover:border-ember/60 hover:ember-glow sm:p-8"
            >
              <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-ember/20 blur-3xl transition-opacity group-hover:opacity-100" />
              <div className="relative">
                <span className="text-xs font-semibold uppercase tracking-widest text-ember">
                  Featured · {featured.period}
                </span>
                <h3 className="mt-3 font-display text-3xl font-bold leading-tight sm:text-4xl">
                  {featured.title}
                </h3>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
                  {featured.description}
                </p>
              </div>
              <div className="relative mt-6 flex flex-wrap gap-2">
                {featured.tech.map((t) => (
                  <span
                    key={t}
                    className="rounded-md border border-border bg-background/40 px-2.5 py-1 text-xs font-medium text-muted-foreground"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </Link>
          </Reveal>

          {/* Avatar / identity tile */}
          <Reveal delay={60} className="md:col-span-2">
            <div className="flex h-full min-h-[160px] flex-col justify-between rounded-2xl border border-border bg-surface p-6">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-ember font-display text-lg font-bold text-primary-foreground">
                {cv.initials}
              </div>
              <div>
                <p className="font-display text-lg font-semibold leading-tight">{cv.name}</p>
                <p className="mt-1 text-xs text-muted-foreground">{cv.location}</p>
              </div>
            </div>
          </Reveal>

          {/* Stat tile */}
          <Reveal delay={120} className="md:col-span-2">
            <div className="flex h-full min-h-[160px] flex-col justify-between rounded-2xl border border-border bg-surface p-6">
              <Award className="h-6 w-6 text-ember" />
              <div>
                <p className="font-display text-4xl font-bold text-foreground">
                  {cv.certifications.length}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">Oracle certifications</p>
              </div>
            </div>
          </Reveal>

          {/* Experience tile */}
          <Reveal delay={180} className="md:col-span-3">
            <Link
              to="/about"
              className="group flex h-full min-h-[160px] flex-col justify-between rounded-2xl border border-border bg-surface p-6 transition-colors hover:border-ember/60"
            >
              <Briefcase className="h-6 w-6 text-ember" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Currently
                </p>
                <p className="mt-1 font-display text-xl font-semibold leading-tight">
                  {cv.experience[0].role} · {cv.experience[0].company}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{cv.experience[0].period}</p>
              </div>
            </Link>
          </Reveal>

          {/* Skills snapshot */}
          <Reveal delay={240} className="md:col-span-3">
            <div className="flex h-full min-h-[160px] flex-col justify-between rounded-2xl border border-border bg-surface p-6">
              <Cpu className="h-6 w-6 text-ember" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Core stack
                </p>
                <p className="mt-1 font-display text-base font-medium leading-snug text-foreground">
                  Python · scikit-learn · LLMs · Oracle · React · Linux
                </p>
              </div>
            </div>
          </Reveal>

          {/* CTA tile */}
          <Reveal delay={300} className="md:col-span-6">
            <Link
              to="/contact"
              className="group relative flex h-full min-h-[140px] items-center justify-between overflow-hidden rounded-2xl border border-ember/40 bg-gradient-to-r from-ember/15 via-surface to-surface p-6 transition-all hover:border-ember sm:p-8"
            >
              <div className="flex items-center gap-4">
                <Sparkles className="h-6 w-6 text-ember" />
                <div>
                  <p className="font-display text-xl font-bold sm:text-2xl">
                    Have an idea worth building?
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Let's turn it into something real.
                  </p>
                </div>
              </div>
              <ArrowUpRight className="h-6 w-6 text-ember transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
