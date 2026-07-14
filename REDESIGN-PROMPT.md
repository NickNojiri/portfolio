# Redesign brief — paste into Claude Opus (high reasoning)

Copy everything below the line into a fresh Claude Code session, opened in
`C:\Users\17143\Projects\portfolio`. Set the model to Opus and reasoning to high.

---

You are the design lead redesigning my personal portfolio. Make it feel like
**remix.run** — near-black, glowing, oversized confident type, a long scroll of
full-height "scenario" acts — but held in check by **Notion's** restraint (whitespace,
calm neutrals, nothing shouting). The identity is "a terminal that learned typography":
engineered, not decorated.

## Read these first (do not skip)

1. **`DESIGN.md`** in this repo — the full design spec. It is the source of truth for
   palette, type, layout, motion, and anti-goals. Follow it exactly; where it and I
   disagree, ask.
2. **`README.md`** and **`ROADMAP.md`** — what the site is and where it's going.
3. The current `index.html` / `styles.css` / `script.js` — what exists today. The three
   interactive demos work; **keep them working**.

## Skills to use (invoke these, in this order)

- Start in **high reasoning**; if `fable-mode` is available, use it — this ships to
  recruiters, so plan → build → verify, and never fabricate content.
- Let the **design-lead / artifact-design** guidance drive the visual work: make
  deliberate, subject-specific choices; take one real aesthetic risk (the hero); avoid
  the generic-AI look enumerated in `DESIGN.md`.
- Use the **browser preview + verification workflow** to *see your work*: `preview_start`
  the "Portfolio site" launch config, then `read_page` / `read_console_messages` /
  screenshots after every meaningful change. Do not claim it looks good without looking.
- Use the **dataviz** skill for the demo metrics/charts (Relay cost-latency, the score
  gauge) so they read as one considered system in both themes.
- When the build is done, run **/simplify** then **/code-review** to clean up, and the
  **verify** skill to confirm all three demos still work end-to-end.

## What the site must showcase (my real proof-of-work)

Ground every claim in real code — nothing invented. The pillars, strongest first:

1. **Relay** — polyglot prompt-deployment platform (Rust flag engine + Python/FastAPI
   gateway + TypeScript dashboard). A/B-test prompts in production, track cost & latency
   per version. Featured. Keep the flag-flip demo.
2. **SpotBot** — local-first (Ollama + OpenStreetMap) pipeline turning shared Instagram
   reels into votable Discord outing cards; reads caption *and* audio; 143 offline tests.
   Keep the staged-pipeline demo.
3. **Resume Improver** *(in progress)* — MIT resume-to-score pipeline extended into a
   grounded rewriter (FastAPI + SSE + React). Keep the streaming-rewrite demo; keep the
   sample bullet labeled "sample."
4. **Open-source ledger (NEW act)** — 15 PRs across 6 repos: GoogleChrome/lighthouse,
   paulirish/lh-scorecalc, anthropics/claude-code-action, harry0703/AudioNotes,
   ossf/cve-bin-tool, NVIDIA/garak. **One merged into an Anthropic repo**
   (claude-code-action #1502, redacting `ghu_` tokens). Group by repo, honest OPEN/MERGED
   status, a `--signal` pill on the merged one. This is the biggest missing pillar.
5. **"Also built" strip (NEW)** — WindowDash (C++/Win32 monitor, a 4th language), the
   CSULB print-usage scraper (Python/Selenium), ICPC SoCal Regional 2025–26.

Meta-thesis to land: builds end-to-end, polyglot (Rust · TypeScript · Python · C++),
tests everything, and *finishes and ships*.

## Hard constraints

- **Zero runtime dependencies. No framework. No build step.** Fonts are static woff2
  files in `/fonts` (Bricolage Grotesque, IBM Plex Sans, JetBrains Mono — all OFL). If
  you can't fetch them on this network, add the `@font-face` rules + a system-stack
  fallback and leave a note listing the three files to drop in.
- Ship both light and dark themes to equal quality; respect `prefers-reduced-motion`.
- Content must be readable with JavaScript disabled; motion + demos are enhancement.
- It deploys on GitHub Pages from `main` root. **Pushing on this network needs**
  `git -c http.sslVerify=false push origin main`. Don't change visibility or Pages config.
- Don't break the live site: verify locally, then one clean commit, then push.

## Definition of done

- Homepage reimagined per `DESIGN.md`: hero thesis at full scale, five acts (3 projects
  + OSS ledger + also-built), sticky scrollspy nav, orchestrated load motion.
- All three demos verified working in the preview; **zero console errors**; both themes
  checked; reduced-motion checked.
- `/simplify` and `/code-review` run and their findings addressed.
- One commit, pushed; GitHub Pages build green at
  https://nicknojiri.github.io/portfolio/.
- A short note back to me: what you changed, the one aesthetic risk you took, and
  anything you left for me (e.g. font files to drop in).
