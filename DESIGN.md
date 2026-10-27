# Design

Style brief distilled from the owner's reference board (2026-10-27). Rules, not moods: a designer, a developer or an AI tool can follow them without context.

## The feel

A quiet technical paper with one warm accent: data that grew into a structure, read on a desk, not on a screen.

## Type

- Headlines: Inter Tight 600, size fills the width, line-height 0.92, letter-spacing -0.035em. Two-tone: the second half of a phrase in the dim ink.
- One serif accent only: Instrument Serif italic for the phrase that resolves the headline or a heading. Never for body copy.
- Body: Public Sans 400 at 16–17px, line-height 1.5. Reading pages stay in Newsreader.
- Metadata and numbering: JetBrains Mono 11–13px, uppercase, tracking 0.04em.

## Color

- Paper `#EFEAE0` (surface), ink `#1E1611`, dim ink `#5F584D`, rule `#D6CFBF`.
- Chocolate `#2A1A10` for dark sections, with paper text `#F3EDE2` and dim `#A89C8A`.
- Accent: ochre `#7D5A0B` for any text on paper, `#E3B52E` for text on chocolate. Bright mustard `#C9951E` only for dots, lines and highlights, never for text (2.25:1 on paper). Brick `#A8402A` only for "wrong" states.
- Dim text on chocolate `#A89C8A`.
- Grain at 10–18% on every section. No gradients, no glass, no pure black or white.

## Layout and spacing

- One column of content up to 1160px, 40px gutters on desktop, 16px on phones.
- Thin 1px rules and tables instead of cards. Numbered lists step down the page (stairs).
- Negative space is the hierarchy: one large object per screen.
- Microtext in the corners: name, role, updated date.

## Motion and pacing

- Motion tells one story: data accumulates, something misleads, it is fixed. Scroll drives it; nothing loops.
- Ease-out for entrances (400–600ms), stagger 80–120ms between siblings, parallax at 0.6 on one band only.
- Final frame is the base style: no JavaScript, reduced motion and phones show the finished state.

## Always do

1. Link every claim to its proof.
2. Keep the exact wording from PRODUCT.md.
3. Draw illustrations from the site's own schema data.
4. Keep the home page at 0 B JavaScript and within the Lighthouse budgets.
5. Test at 1440px and 390px before calling it done.

## Never do

1. Neon or lime accents, gradients, glassmorphism, drop shadows.
2. Notebook grids or dotted backgrounds.
3. Stock photos, employer logos, testimonials, invented numbers.
4. Decorative motion that carries no story beat.
5. Generic AI look: centered hero, three feature cards, purple-to-blue.
