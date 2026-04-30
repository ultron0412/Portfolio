import { usePortfolio } from "@/hooks/usePortfolio";

export function SiteFooter() {
  const { portfolio } = usePortfolio();

  return (
    <footer className="site-footer">
      <p>
        (c) {new Date().getFullYear()} {portfolio.personal.name}
      </p>
      <p>Built with MERN Stack</p>
    </footer>
  );
}
