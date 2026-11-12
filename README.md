# Portfolio

One-page portfolio laid out like a printed sheet. The whole page shows at once;
tap, scroll, swipe, pinch or use the arrow keys to zoom into one section at a time.

Live: **https://nicknojiri.github.io/portfolio/** (GitHub Pages, redeploys on push to `main`)

## Sections

| # | Section | Link |
|---|---------|------|
| 00 | Intro | `#intro` |
| 01 | Open source: merged and in-review PRs | `#open-source` |
| 02 | SpotBot: results, tests, live site, evaluation report | `#spotbot` |
| 03 | Current work | `#current-work` |
| 04 | Background | `#background` |
| 05 | Contact | `#contact` |

Each section has its own hash, so `…/portfolio/#spotbot` opens zoomed into SpotBot.

## Controls

- **Click / tap** a section to zoom in. Tap a blurred neighbor to jump to it.
- **Scroll, swipe, arrow keys, Page Up/Down** move between sections.
- **Esc, pinch in, double-tap** or the center button return to the whole page.
- `prefers-reduced-motion` turns off the motion and blur.
- Without JavaScript it falls back to a normal scrolling page.

## Run locally

```bash
python -m http.server 4321
# open http://localhost:4321
```

## Structure

```
index.html   content
styles.css   layout, type, zoom mode (html.zoom)
script.js    camera, gestures, deep links
fonts/       self-hosted woff2: Inter, Inter Tight, IBM Plex Mono (OFL, via Fontsource)
```

No framework, no build step, no third-party requests.
