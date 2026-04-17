
## Portfolio Website for Ayush Jung Kunwar

A bold, premium multi-page portfolio with Charcoal & Ember palette, Space Grotesk + DM Sans typography, and a hero + bento grid layout.

### Pages (separate routes)
- **/** — Home: hero (name, roles, tagline), bento grid highlighting featured projects, skills snapshot, CTA
- **/projects** — All 3 projects in detail (Jarvis, Heart Disease Prediction, AI Resume Generator) with tech stacks, dates, and descriptions
- **/about** — Profile bio, full technical skills grid, professional experience (Bizhub), education, certifications table
- **/contact** — Email, phone, location, LinkedIn, GitHub with copy-to-clipboard and mailto links

### Design System
- Background `#1a1a1a`, surface `#2d2d2d`, muted `#4a4a4a`, accent ember `#e85d3a`
- Headings: Space Grotesk (bold, tight tracking). Body: DM Sans
- Subtle ember glow on hover, animated underlines, grain/noise texture optional
- Smooth fade/slide-in on scroll (Intersection Observer)

### Home page bento grid
Mixed-size cards: large featured project, name/avatar tile, role tags tile, "6 Oracle certs" stat tile, latest experience tile, contact CTA tile.

### Shared
- Sticky header with logo "AJK" + nav (Home / Projects / About / Contact) and active-link ember underline
- Footer with social links + copyright
- Per-route SEO meta (title, description, og:title, og:description)
- 404 + error boundaries already in place

### Tech
- TanStack Start file-based routes
- Tailwind v4 tokens updated in `src/styles.css` for Charcoal & Ember + Space Grotesk/DM Sans via Google Fonts
- Lucide icons for skills/contact
- Fully responsive (mobile-first, tested at narrow widths)
