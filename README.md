# nicknojiri.dev — portfolio

A zero-dependency portfolio site that presents each project as its real data
pipeline — one you can push data through. No framework, no build step: plain
HTML, CSS, and vanilla JS, so it deploys anywhere static.

## Projects featured

| # | Project | What it does |
|---|---------|--------------|
| 01 | [Relay](https://github.com/NickNojiri/relay) | Author, A/B-test, and cost/latency-track AI prompts in production. Polyglot: Rust flag engine + Python gateway + TS dashboard. |
| 02 | [SpotBot](https://github.com/NickNojiri/SocialAgent-Team10) | Turns shared Instagram reels into votable Discord outing cards. Local-first (Ollama + OpenStreetMap), 143 offline tests. |
| 03 | Resume Improver *(in progress)* | Scores a resume, then streams grounded rewrites of weak bullets. FastAPI + SSE + React. |

## Interactive demos

Each project card has a live, self-contained demo (no backend calls):

- **Relay** — flip the `prompt_v2` feature flag and watch traffic shift between
  version A and B, with cost and p95 latency updating.
- **SpotBot** — "paste a reel" and watch the ingestion stages light up, then a
  Discord-style votable spot card appears.
- **Resume Improver** — stream a grounded bullet rewrite token-by-token while a
  strength score climbs.

## Run locally

Any static file server works. With Python:

```bash
python -m http.server 4321
# open http://localhost:4321
```

## Deploy

Push to any static host — Vercel, Netlify, GitHub Pages, Cloudflare Pages.
No configuration needed; the site is fully static.

## Structure

```
index.html    all markup + content
styles.css    dark-first design system, light-mode toggle
script.js     demos + reactive effects (typewriter, scramble headings,
              tilt/spotlight panels, scrollspy, scroll progress, count-up)
ROADMAP.md    ideas for future versions
```

## Live

Hosted free on GitHub Pages: **https://nicknojiri.github.io/portfolio/**
(auto-redeploys on every push to `main`)
