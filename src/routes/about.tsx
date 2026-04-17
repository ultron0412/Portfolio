import { createFileRoute } from "@tanstack/react-router";
import { cv } from "@/lib/cv";
import { Reveal } from "@/components/Reveal";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Ayush Jung Kunwar" },
      {
        name: "description",
        content:
          "About Ayush Jung Kunwar — background, technical skills, professional experience and Oracle certifications.",
      },
      { property: "og:title", content: "About — Ayush Jung Kunwar" },
      {
        property: "og:description",
        content: "Background, skills and certifications of Ayush Jung Kunwar.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 pb-16 pt-12 sm:px-8 sm:pt-16">
      <Reveal>
        <p className="text-xs font-semibold uppercase tracking-widest text-ember">About</p>
        <h1 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          Engineer at heart, <span className="text-ember">builder by craft.</span>
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          I'm {cv.name}, based in {cv.location}. I work where AI meets infrastructure — building
          intelligent products on top of systems that actually stay up. My background spans machine
          learning, voice interfaces, Oracle-grade data systems and modern web stacks.
        </p>
      </Reveal>

      {/* Skills */}
      <section className="mt-16">
        <Reveal>
          <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
            Technical skills
          </h2>
        </Reveal>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {Object.entries(cv.skills).map(([group, items], i) => (
            <Reveal key={group} delay={i * 60}>
              <div className="rounded-2xl border border-border bg-surface p-6">
                <p className="text-xs font-semibold uppercase tracking-widest text-ember">
                  {group}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {items.map((s) => (
                    <span
                      key={s}
                      className="rounded-md border border-border bg-background/40 px-2.5 py-1 text-xs font-medium text-foreground"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Experience */}
      <section className="mt-16">
        <Reveal>
          <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">Experience</h2>
        </Reveal>
        <div className="mt-6 space-y-4">
          {cv.experience.map((e, i) => (
            <Reveal key={e.company} delay={i * 60}>
              <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-display text-xl font-bold">
                    {e.role} <span className="text-ember">· {e.company}</span>
                  </h3>
                  <span className="text-xs font-medium text-muted-foreground">{e.period}</span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{e.summary}</p>
                <ul className="mt-4 space-y-2">
                  {e.bullets.map((b) => (
                    <li
                      key={b}
                      className="flex gap-3 text-sm text-muted-foreground before:mt-2 before:h-1 before:w-1 before:shrink-0 before:rounded-full before:bg-ember"
                    >
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Education */}
      <section className="mt-16">
        <Reveal>
          <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">Education</h2>
        </Reveal>
        <div className="mt-6 space-y-4">
          {cv.education.map((e) => (
            <Reveal key={e.school}>
              <div className="rounded-2xl border border-border bg-surface p-6">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-display text-lg font-semibold">{e.school}</h3>
                  <span className="text-xs font-medium text-muted-foreground">{e.period}</span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{e.degree}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Certifications */}
      <section className="mt-16">
        <Reveal>
          <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
            Certifications
          </h2>
        </Reveal>
        <Reveal delay={60}>
          <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-surface">
            <ul className="divide-y divide-border">
              {cv.certifications.map((c) => (
                <li
                  key={c.name}
                  className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 transition-colors hover:bg-surface-2/50 sm:px-6"
                >
                  <div>
                    <p className="font-medium text-foreground">{c.name}</p>
                    <p className="text-xs text-muted-foreground">{c.issuer}</p>
                  </div>
                  <span className="text-xs font-semibold text-ember">{c.year}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
