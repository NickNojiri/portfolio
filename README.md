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

## Open source

Open pull requests across production open-source projects, spanning AI security, LLM tooling, and web performance.

| Project | Contribution |
|---------|--------------|
| [claude-code-action](https://github.com/anthropics/claude-code-action) (Anthropic) | Three security-hardening PRs: redact leaked GitHub user-to-server (`ghu_`) tokens ([#1502](https://github.com/anthropics/claude-code-action/pull/1502)), require a trusted author before the `@claude` trigger fires ([#1503](https://github.com/anthropics/claude-code-action/pull/1503)), and strip HTML comments after entity decoding in the input sanitizer ([#1504](https://github.com/anthropics/claude-code-action/pull/1504)). |
| [garak](https://github.com/NVIDIA/garak) (NVIDIA — LLM vulnerability scanner) | Parametrized unit tests for the known-bad-signature detectors that flag when a model emits antivirus/spam/phishing test strings (EICAR / GTUBE / GTphish), covering case-insensitive matching and cross-signature distinctness — [PR #1956](https://github.com/NVIDIA/garak/pull/1956). |
| [Lighthouse](https://github.com/GoogleChrome/lighthouse) (Google) | Smoke-test coverage for CSS nesting in unused-css-rules ([#17127](https://github.com/GoogleChrome/lighthouse/pull/17127)), clamping negative wasted-bytes in the unused-CSS audit ([#17131](https://github.com/GoogleChrome/lighthouse/pull/17131)), and surfacing plugins in the report footer ([#17125](https://github.com/GoogleChrome/lighthouse/pull/17125)). |
| [lh-scorecalc](https://github.com/paulirish/lh-scorecalc) (Paul Irish) | Clamp metric values when switching device type ([#55](https://github.com/paulirish/lh-scorecalc/pull/55)). |
| [AudioNotes](https://github.com/harry0703/AudioNotes) (2.2k★ audio→notes app) | Six pull requests: root-caused an Ollama streaming crash, fixed Windows login, pinned breaking dependencies, and added a REST API plus optional NVIDIA-GPU Docker support. |
| [cve-bin-tool](https://github.com/ossf/cve-bin-tool) (OpenSSF) | Closed a three-year-open test-coverage gap: the Windows branch of the `inpath()` PATH lookup was invisible to Linux-only coverage CI. Added platform-independent tests that exercise both branches on any OS — [PR #5829](https://github.com/ossf/cve-bin-tool/pull/5829). |

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
index.html          five acts: 3 project demos + open-source ledger + also-built
styles.css          design system, self-hosted type, auras, light/dark
script.js           demos + reactive effects (typewriter, scramble headings,
                    tilt/spotlight panels, scrollspy, scroll progress, count-up)
fonts/              self-hosted woff2 — Bricolage Grotesque, IBM Plex Sans,
                    JetBrains Mono (OFL); no CDN, keeps the site buildless
ROADMAP.md          ideas for future versions
DESIGN.md           v2 visual direction (remix.run impact × Notion restraint)
REDESIGN-PROMPT.md  paste-ready brief to hand the v2 build to a coding agent
```

## Live

Hosted free on GitHub Pages: **https://nicknojiri.github.io/portfolio/**
(auto-redeploys on every push to `main`)
