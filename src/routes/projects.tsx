import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/projects")({
  component: ProjectsRedirect,
});

function ProjectsRedirect() {
  return (
    <section className="section-card">
      <h2>Projects</h2>
      <p>This section is now part of the main single-page portfolio.</p>
      <a href="/#portflio">Go to Projects section</a>
    </section>
  );
}
