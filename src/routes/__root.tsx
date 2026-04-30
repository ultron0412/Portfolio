import {
  Outlet,
  createRootRoute,
  HeadContent,
  Link,
  Scripts,
  useRouterState,
} from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { FloatingBackground } from "@/components/FloatingBackground";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { useMotionPreference } from "@/hooks/useMotionPreference";
import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="layout-shell">
      <section className="section-card">
        <h2>404</h2>
        <p>Page not found.</p>
        <Link to="/">Return to portfolio</Link>
      </section>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Ayush Jung Kunwar | Portfolio" },
      {
        name: "description",
        content: "Portfolio of Ayush Jung Kunwar - AI/ML Engineer and Full-Stack Developer.",
      },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const { shouldReduceMotion } = useMotionPreference();

  return (
    <ThemeProvider>
      <AuthProvider>
        <FloatingBackground />
        <div className="layout-shell app-shell">
          <SiteHeader />
          <AnimatePresence mode="wait" initial={false}>
            <motion.main
              key={pathname}
              className="layout-main"
              initial={{ opacity: 0, y: shouldReduceMotion ? 8 : 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: shouldReduceMotion ? -6 : -14 }}
              transition={{ duration: shouldReduceMotion ? 0.2 : 0.34, ease: "easeOut" }}
            >
              <Outlet />
            </motion.main>
          </AnimatePresence>
          <SiteFooter />
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}
