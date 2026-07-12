# Roadmap

Ideas for future versions, roughly ordered by impact-per-effort.
The site stays zero-dependency and buildless unless an item says otherwise.

## v1.x — quick wins

- [ ] **More projects.** Add a card for WindowDash (C++/Win32 real-time system
  monitor — adds a 4th language and a systems-programming angle), plus a compact
  "also built" strip: the CSULB print-usage analytics scraper (Python/Selenium,
  shipped in a real support-ops context) and ICPC SoCal Regional 2025–26.
- [ ] **OG image.** A 1200×630 social card so the link unfurls nicely on
  LinkedIn/Discord instead of showing nothing. Static PNG in `assets/`.
- [ ] **`sitemap.xml` + `robots.txt`** for basic SEO hygiene.
- [ ] **Analytics.** GoatCounter or Plausible free tier — one `<script>` tag,
  privacy-friendly, see whether recruiters actually visit.
- [ ] **Resume download button** once the polished PDF exists.

## v2 — bigger swings

- [ ] **Live GitHub stats.** Fetch repo stars, language bytes, and last-commit
  dates client-side from the GitHub REST API (no key needed for public repos,
  60 req/hr is plenty) so the stat chips are real numbers that update themselves.
- [ ] **Wire the Relay demo to the real deployed gateway.** Once Relay's Phase 6
  deploy is live, the flag-flip demo can hit the actual `/flags` endpoint —
  a portfolio demo backed by real production infrastructure.
- [ ] **Case-study pages.** One page per project (`/relay.html`, …) with the
  full story: problem → architecture diagram → decisions → results. The
  homepage cards link into them.
- [ ] **Command palette (Ctrl+K).** Fuzzy-jump to any section/link. Very
  dev-portfolio, still zero-dependency (~100 lines).
- [ ] **CI smoke test.** A Playwright test that loads the page, runs all three
  demos, and asserts the DOM outcomes — run in GitHub Actions on every push.
  On-brand: the portfolio itself gets the same test discipline as the projects.

## v3 — infrastructure

- [ ] **Custom domain** (`nicknojiri.dev`, ~$10/yr) — hosting stays free;
  add CNAME + DNS, GitHub Pages handles SSL.
- [ ] **Blog/notes section.** Short engineering writeups (the SpotBot
  transcription pipeline is a ready-made first post). Doubles as SEO.
- [ ] **Lighthouse 100s.** Audit pass for performance/accessibility/SEO;
  badge the score in the README.
- [ ] **Contact form** via a free Formspree endpoint instead of bare mailto.

## Non-goals

- Frameworks, bundlers, or a build step — the buildless constraint is a feature.
- Auto-generated content — every claim on the site stays traceable to real code.
