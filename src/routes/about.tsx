import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  component: AboutRedirect,
});

function AboutRedirect() {
  return (
    <section className="section-card">
      <h2>About</h2>
      <p>This section is now part of the main single-page portfolio.</p>
      <a href="/#about_me">Go to About section</a>
    </section>
  );
}
