# Design direction — v2

Working title: **"a terminal that learned typography."**
This is the north star for the next redesign. It is a design spec, not code — it
tells whoever builds v2 (a person or Claude) what the site should feel like and why.

---

## The brief

Portfolio for **Nick Nojiri**, a systems engineer whose through-line is *pipelines
that ship* — systems that take messy input (prompts, reels, resumes) and turn it into
a decision. The site's job: make a recruiter or engineer believe, in ten seconds of
scrolling, that this person builds real end-to-end systems and finishes them.

Two reference points, used for different reasons:

- **remix.run** — for *impact*. Near-black ground, glowing gradient auras, oversized
  confident type, a long single-scroll of full-height "scenario" acts, code shown as
  a hero element. We borrow its scale and its darkness.
- **Notion** — for *discipline*. Generous whitespace, restrained neutrals, calm
  readable type, nothing shouting. We borrow its rhythm and its restraint.

The synthesis is the tension between them: remix's drama held in check by Notion's
composure. A dark identity that reads as **engineered, not decorated**.

## Keep vs. change

**Keep:** zero-dependency / buildless, GitHub Pages hosting, the three interactive
demos, the per-project accent system, and the rule that every claim traces to real code.

**Change:** lift it from "clean dark template" to a distinctive identity — a real
display face, orchestrated load motion, scenario-scale sections, and two new content
pillars (below) the current three-card layout has no room for.

## Anti-goals — avoid the generic-AI look

- No warm-cream (#F4F1EA) + serif + terracotta editorial cliché.
- No lone acid-green pop on pure black.
- **Not Inter and not Space Grotesk** as the display face — they read as the safe default.
- No emoji section markers, no everything-centered, no `rounded-lg` on every surface.
- Numbered markers (01/02/03) **only** where content is a true sequence. The pipelines
  are a sequence — keep numbering there. The nav and project list are not — no numbers.

---

## Color

Dark is the primary world. Neutrals are biased cool-violet toward the accent — chosen,
not a default mid-grey.

| Token | Hex | Role |
|-------|-----|------|
| `--ink` | `#0A0A0F` | page ground (near-black, violet-biased — never pure #000) |
| `--raise` | `#14141D` | cards / demo panels |
| `--raise-2` | `#1A1A26` | hover, inset |
| `--line` | `rgba(255,255,255,.09)` | hairline borders |
| `--text` | `#ECEDF1` | body |
| `--dim` | `#A2A3AD` | secondary |

**Accents — categorical, one per project.** Never blended into a rainbow gradient
except the single hero signature line.

| Token | Hex | Owner |
|-------|-----|-------|
| `--violet` | `#8B83F0` | Relay + global accent |
| `--teal` | `#2FBF93` | SpotBot |
| `--coral` | `#E5713F` | Resume Improver |
| `--signal` | `#F5C451` | semantic only — "merged" / highlight (e.g. OSS). Not an accent. |

**Light world (Notion-grounded):** warm off-white ground `#F7F7F4`, white cards,
text `#16161A`, accents darkened one step for contrast (`--violet #534AB7`,
`--teal #0F6E56`, `--coral #993C1D`). Neutrals bias warm in light, cool in dark.
Both themes to equal standard — do not naively invert.

**Auras:** remix-style radial glows, one per section, tinted to that section's accent,
low opacity, drifting slowly with scroll and cursor. This is where the "glow" budget
is spent — keep everything else flat.

## Type — self-hosted woff2 (no CDN, no build step)

Ship three static font files in `/fonts`. No webfont CDN (the CSP and Nick's
TLS-intercepting network both make CDNs unreliable); static woff2 keeps it buildless.

- **Display — Bricolage Grotesque** (OFL). Characterful, slightly mechanical grotesque.
  Used big and tight for the thesis and section titles. Deliberately not Inter/Grotesk.
- **Body — IBM Plex Sans** (OFL). Humanist, engineered heritage, clean at 16–18px.
- **Mono — JetBrains Mono** (OFL). Pipeline nodes, code, labels, and every figure
  (with `font-variant-numeric: tabular-nums`).

Scale (px): 12 · 14 · 16 · 18 · 22 · 30 · 44 · 64, hero `clamp(2.6rem, 7vw, 5.2rem)`.
Headings get `text-wrap: balance`; body columns ~65ch; uppercase eyebrows `+0.08em`.

## Layout

A long single scroll of **acts**. The hero states the thesis at maximum scale with the
live pipeline motif animating on load. Each project is a full-width act with its own
aura and an asymmetric narrative/demo split. Two **new pillars** get their own acts:

1. **Open-source ledger.** 15 PRs across 6 repos (Lighthouse, lh-scorecalc,
   claude-code-action, AudioNotes, cve-bin-tool, garak) — one merged into an Anthropic
   repo. Grouped by repository, a `--signal` "merged" pill on the landed one. This is
   real proof-of-work and currently invisible on the site. Borrow the layout of Nick's
   own OSS ledger PDF (per-repo rows, honest OPEN/MERGED status).
2. **"Also built" strip.** Compact: WindowDash (C++/Win32 real-time monitor — a 4th
   language), the CSULB print-usage scraper (Python/Selenium, shipped in ops), and ICPC
   SoCal Regional 2025–26. One line each, no demo.

Sticky slim nav with scrollspy. Notion-grade vertical rhythm (96–128px between acts).
Max width ~1120px; text ~65ch.

## Components

- **Demo panels** — elevated cards, 16px radii, inner-glow border + cursor spotlight on
  hover (already built; refine). No rounded corners on single-sided accent borders.
- **Stat tiles** — mono digits, tabular-nums, count-up on reveal.
- **OSS rows** — per-repo group header, PR number + one-line what-it-does, status pill.
- **Pills/tags** — mono, accent-tinted background, text in the darkest stop of that
  accent family (never plain black/grey on a colored fill).

## Motion

One orchestrated load sequence beats scattered effects. On load: the hero thesis
mask-reveals while the pipeline pulses data end-to-end (the single deliberate "risk"
moment). On scroll: each act's aura fades in as it enters. Keep the existing reactive
layer (typewriter eyebrow, scramble-decode headings, panel tilt, gradient shimmer,
count-up). **Everything** gated behind `prefers-reduced-motion: reduce`.

## Budget & non-negotiables

- Zero runtime dependencies, no framework, **no build step** (fonts are static files).
- LCP < 2s, CLS 0. Content fully readable with JavaScript disabled; motion and the
  demos are progressive enhancement.
- Both themes to equal quality; body contrast ≥ 4.5:1.
- Every claim traceable to real code. No invented metrics; demo sample data stays
  labeled "sample."
- Deploys from `main` root on GitHub Pages. Pushes on Nick's network need
  `git -c http.sslVerify=false push`.

---

*Companion: `REDESIGN-PROMPT.md` turns this spec into a paste-ready brief for a coding
agent. `ROADMAP.md` tracks feature ideas.*
