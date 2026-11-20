# NEOLINE — Visual motifs for future UI work

Date: 2026-11-20
Context: User-supplied reference images depicting a black/white halftone gradient, a cyan-on-navy curved dot wave, and green geometric diagonal planes. These are **visual studies**, not source assets or artwork to reproduce. Never copy the Shutterstock watermarks, embedded brand marks, full composition, or original image files.

## Three useful design ideas

### A. Halftone size field (reference 1)

- Use **one** underlying even grid of points.
- Convey illumination or depth by varying **dot diameter and opacity smoothly**, not with overlapping grids at several scales.
- Modulate the diameter with a low-amplitude continuous wave or eased curve: the silhouette appears flowing while the actual dots remain stable.
- Preserve enough empty space so the pattern never competes with headlines or controls.
- Avoid randomness, irregular overlaps, and discontinuous islands of unrelated dot sizes.

### B. Curved cyan halftone / optical wave (reference 2)

- Keep the overall panel deep navy or NEOLINE blue; use a restrained turquoise/ice-blue highlight.
- Organize the dots along a graceful density gradient across a diagonal or curved sweep.
- Brightest/largest values should be localized, not spread equally over the entire panel.
- Use dark negative space to bring forward the information hierarchy.
- Symmetry of *paired brand corner ornaments* is strict (rotated 180 degrees), even when the size field has a subtle wave.

### C. Layered diagonal color planes (reference 3)

- Combine 2–3 aligned diagonal planes with carefully related shades, not arbitrary saturated colors.
- Dot texture is secondary to the shape hierarchy and should fade out near text.
- For NEOLINE, adapt to blue/teal/white, NOT to the reference image's green palette.
- Best suited to promotion cards, category transitions and campaign banners, not data-heavy tables.

## Decisions for the news slider

- Top-left and bottom-right corners: fixed blue triangles with exactly mirrored dot lattices and restrained darker hairline diagonal edges.
- Dots: 14–20 px responsive spacing; approx. 1.5–7 px diameter; soft pearl cyan. A deterministic smooth two-dimensional halftone field, not three overlapping repeating gradients.
- Corners are STATIC. News backgrounds and TV-news transition masks move beneath them. Central pearl-blue glow drifts in two dimensions (up/down and across).
- Text does not participate in geometric masks. It separately fades or exits briefly.
- The accident graph, date labels, bottom navigation and mobile spacing must not be changed when refining ornamental patterns.
- Respect reduced-motion preferences.
- Keep the design light to render on Android mobile; do not animate hundreds of individual dots.

## Future quality bar

1. At a glance, confirm both corners are balanced and mirror each other.
2. Inspect 320px, 375px and desktop widths; ensure spacing does not collapse or clump.
3. No dotted textures in the headline's central reading area.
4. One point per grid intersection, smoothly graded and with controlled contrast.
5. Avoid external watermarked imagery: implement original CSS/SVG or mathematically generated patterns.
6. Keep accent hierarchy consistent across RU / HE / EN / AR.

## Maintenance

News implementation: `news-ui.js` (`layoutNewsCornerDots`) and `news-ui.css` (`.news-studio-dots`, `.news-studio-edges`, `newsPearlStudioFloat`). News smoke checks: `.github/workflows/test-news.yml`.
