import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/contact")({
  component: ContactRedirect,
});

function ContactRedirect() {
  return (
    <section className="section-card">
      <h2>Contact</h2>
      <p>This section is now part of the main single-page portfolio.</p>
      <a href="/#contact">Go to Contact section</a>
    </section>
  );
}
