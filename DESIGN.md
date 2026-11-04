# Design

Style brief distilled from the owner's reference board (2026-10-27), revised on 2026-11-04 to the tasteskill v2 house rules (github.com/Leonxlnx/taste-skill) at the owner's request. Rules, not moods: a designer, a developer or an AI tool can follow them without context.

## The feel

A quiet technical paper with one green accent: data that grew into a structure, read on a desk, not on a screen.

## Type

- Two faces only. Headlines: Inter Tight 600, size fills the width, line-height 0.92, letter-spacing -0.035em. Everything else: Public Sans, including article bodies.
- One face and one colour per headline: no italic, serif or coloured accent word.
- Body: Public Sans 400 at 16–17px (articles 18–20px), line-height 1.5–1.65, in full ink.
- Metadata (dates, counts, tools) in Public Sans, sentence case, tabular figures. No tiny uppercase tracked labels.
- JetBrains Mono only for real code: `pre`, `code`, commands.
- Nothing under 13px. One scale: 13 / 16 / 17 / 22 / 26 / 34 / 44, plus display sizes for the hero.

## Color

"Bone, green, chocolate" from the tasteskill palette library.

- Bone `#E5E1D8` (ground), a step darker `#DAD5CA` for panels, footer and the article header band, chocolate ink `#2A1D17`, dim ink `#5E5047`.
- Chocolate `#2A1D17` for dark sections, with text `#ECE9E2` and dim `#A89C8A`.
- Accent: green `#3D6333` for text and links on bone, `#A9CC98` for text on chocolate, `#456F3A` for dots, lines and highlights. Brick `#A8402A` only for "wrong" states, ochre `#6F4F0A` only for "in review".
- Surfaces are separated by a step in tone, never by a line or a shadow. Grain at 10–18% on the hero and dark sections. No gradients, no glass, no pure black or white.

## Layout and spacing

- One column of content up to 1360px (`max-w-page`); running text capped at about 70ch, 24px gutters on desktop, 16px on phones.
- No hairline rules or 1px outlined boxes. Separate with space, a tone step or a change of scale. Real tables, code blocks and interface fragments marked `data-ui` (the drift demo, the architecture diagrams) keep their own lines.
- Lists step down the page (stairs) by position, without index numbers.
- No eyebrow above a heading: the kind of a project goes under its title.
- Negative space is the hierarchy: one large object per screen.
- Microtext in the hero corners: name, role, updated date, in sentence case.

## Motion and pacing

- Motion tells one story: data accumulates, something misleads, it is fixed. Scroll drives it; nothing loops.
- Ease-out for entrances (400–600ms), stagger 80–120ms between siblings, parallax at 0.6 on one band only.
- Final frame is the base style: no JavaScript, reduced motion and phones show the finished state.

## Always do

1. Link every claim to its proof.
2. Keep the exact wording from PRODUCT.md.
3. Draw illustrations from the site's own schema data; real pictures are the tools' own output (reports, diagrams), never stock.
4. Keep the home page at 0 B JavaScript and within the Lighthouse budgets.
5. Test at 1440px and 390px before calling it done, and run `inspect.mjs` from tasteskill.

## Never do

1. Neon or lime accents, gradients, glassmorphism, drop shadows.
2. Notebook grids, dotted backgrounds, hairline dividers.
3. Stock photos, employer logos, testimonials, invented numbers.
4. Decorative motion that carries no story beat.
5. Generic AI look: centered hero, three feature cards, purple-to-blue, monospace labels, 01/02/03 numbering, a serif accent word.
