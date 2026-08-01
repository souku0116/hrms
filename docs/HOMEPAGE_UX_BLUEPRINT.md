# WorkSync Homepage UX Blueprint

## Scope and guardrails

This is a composition plan for the existing WorkSync design system. It does not create a route, assemble a homepage, define marketing copy, or introduce page-specific components.

The eventual homepage sequence is:

1. Sticky Navigation
2. Hero
3. Trust Indicators
4. Core Services
5. Industries
6. Why WorkSync
7. Recruitment Process
8. HR Technology Vision
9. Statistics
10. Testimonials
11. FAQ
12. Final CTA
13. Footer

## Global composition rules

- Use `PageLayout` as the single page frame, with `Navbar` passed to `header` and `Footer` passed to `footer`.
- Use one `h1` only: the `Hero` title. Every following section title is an `h2`; card titles are `h3` or `h4` through `Heading`.
- Use `SectionLayout` for every horizontal content band. It provides the semantic section and `Container` pairing.
- Prefer the existing `plain`, `surface`, `secondary`, and `primary` section tones to create hierarchy without inventing visual variants.
- Use `Button` for every interactive CTA. A marketing action uses `href`; a future application flow may use `onClick` after its behavior is approved.
- Use a `<picture>` or responsive `<img>` node through a component's existing `media` prop. Images require meaningful `alt` text; decorative images must use empty alt text.
- Do not autoplay motion, video, sliders, or testimonial carousels. Existing entrance motion and card hover motion already respect `prefers-reduced-motion`.
- All spacing, color, typography, radius, shadow, and timing values must come from the `--ws-*` token system.

## Responsive and spacing baseline

| Context             | Desktop                                        | Tablet                             | Mobile                                                   |
| ------------------- | ---------------------------------------------- | ---------------------------------- | -------------------------------------------------------- |
| Page container      | `content-xl` token                             | `content-lg` or `content-md` token | Full width with `spacing-16` gutters                     |
| Major sections      | `spacing-80` or `spacing-120` vertical rhythm  | `spacing-64`                       | `spacing-48` or `spacing-64`                             |
| Section intro width | `content-md` maximum                           | `content-md` maximum               | Full container width                                     |
| Standard card grid  | 3–4 columns when content permits               | 2 columns                          | 1 column                                                 |
| Action groups       | Inline and left-aligned unless CTA is centered | Wrap naturally                     | Full-width or stacked when actions cannot remain legible |

`SectionLayout` currently accepts a single semantic spacing value. At assembly, responsive token-backed `className` overrides may be used where needed. A future `responsiveSpacing` prop is listed under gaps below.

## 1. Sticky Navigation

**Purpose**

Provide consistent brand recognition, primary navigation, and access to the highest-priority action before a visitor enters the content flow.

**Existing components and expected props**

- `Navbar`
  - `brand`: approved brand label or future brand-mark node strategy.
  - `brandHref`: homepage route.
  - `links`: array of `{ label, href, items? }`; `items` is the future dropdown array of `{ label, href }`.
  - `actions`: one or two `Button` nodes.
  - `transparent`: `true` for hero-adjacent composition.
- `Button`
  - `variant`: primary for the priority action, ghost or outline for an optional secondary action.
  - `size`: `md` on desktop and tablet; retain accessible minimum target size on mobile.
  - `href`: approved destination only.

**Layout and grid**

- Use the built-in `Container` around a three-area flex layout: brand, links, actions.
- Desktop: brand left, links centered or adjacent, actions right.
- Tablet: retain compact desktop links until the existing `lg` breakpoint, then use the mobile trigger.
- Mobile: the existing menu trigger opens a full-width panel; nested links are indented beneath their parent.

**CTA and image placement**

- Place the primary CTA in the right action area; do not duplicate it in the link group.
- Navigation contains no image. A future `BrandLogo` may replace the text label.

**Accessibility and animation**

- Keep `nav` landmark and primary-navigation label supplied by `Navbar`.
- Dropdown labels must identify the disclosure purpose; items must have unambiguous destinations.
- Preserve visible focus treatment and accessible mobile-menu state.
- Use the existing background, border, and shadow transition when a transparent nav becomes solid after scrolling.

**Known composition gap**

`Navbar` supports transparent visual treatment and sticky behavior, but it does not yet expose an explicit `overlay` positioning prop. If the final hero requires the header to sit physically on top of hero media rather than directly above it, add that generic prop before assembly.

## 2. Hero

**Purpose**

Establish the value proposition, orient the visitor, and present the first conversion opportunity.

**Existing components and expected props**

- `Hero`
  - `eyebrow`: approved category or audience label.
  - `title`: the sole page-level `h1`.
  - `description`: concise supporting text.
  - `actions`: a `Button` group.
  - `media`: responsive image, product visual, or approved illustration node.
- `Button`: primary and optional outline action, using `href` values only after route approval.

**Layout and grid**

- Desktop: two equal visual columns within `SectionLayout` using the existing `lg:grid-cols-2` behavior; content is left and media is right.
- Tablet: retain two columns only when the media remains readable; otherwise collapse to content followed by media.
- Mobile: single column, text first, then media; actions wrap and may become full-width.

**CTA and image placement**

- Place CTAs immediately after supporting text, before media on mobile.
- Place one purposeful hero visual in the right column on desktop. It must demonstrate people, technology, or a real workplace; it must not be a generic decorative stock montage.

**Accessibility, animation, spacing**

- The media needs meaningful alt text when it conveys information; decorative treatment uses empty alt text.
- Respect one `h1`; the Hero component already renders that semantic level.
- Use the existing `xl` section rhythm, reducing through token-backed responsive spacing at tablet and mobile.
- Use no autoplayed media. The optional section entrance animation remains subtle and is disabled for reduced motion.

## 3. Trust Indicators

**Purpose**

Reduce perceived risk by presenting approved customer, certification, partnership, or security signals without distracting from the hero CTA.

**Existing components and expected props**

- `SectionLayout`: `tone="plain"` or `tone="surface"`, compact spacing.
- `Container`: standard content width.
- `Paragraph`: an optional short, non-promotional label.
- `Badge` or `Tag`: only for text-based standards or certifications.
- A reusable `LogoCloud` is missing and is recommended below for repeated logo items.

**Layout and grid**

- Desktop: horizontal logo row or five-column logo grid.
- Tablet: three-column grid with consistent logo bounds.
- Mobile: two-column grid, never shrinking logos below recognition size.

**CTA and image placement**

- No CTA in this section; avoid competing with the hero action.
- Use monochrome or restrained partner/customer marks. Each logo is an image with an accurate alt value when it is a meaningful linked endorsement; decorative repeated marks use empty alt text.

**Accessibility, animation, spacing**

- Do not use auto-scrolling marquees.
- Treat the group as a labelled list when logos have meaning.
- Use `spacing-32` to `spacing-48` vertical rhythm and `spacing-16` to `spacing-24` grid gaps.
- No entrance animation is necessary; a gentle opacity reveal is acceptable only if it remains reduced-motion safe.

## 4. Core Services

**Purpose**

Help visitors understand the highest-level service categories and navigate to the next relevant step without building a services page in this phase.

**Existing components and expected props**

- `Services`
  - `title`, `description`.
  - `items`: array matching `ServiceCard` props: `{ title, description, icon, meta?, action? }`.
- `ServiceCard`
  - `icon`: Lucide component.
  - `meta`: optional `Badge`, `Tag`, or `Pill` node.
  - `action`: a `Button` or approved text link.

**Layout and grid**

- Desktop: three-card grid.
- Tablet: two-card grid.
- Mobile: single-column stack with equal card padding and no horizontal scrolling.

**CTA and image placement**

- Put a low-emphasis action inside each card only; do not add a second section-level CTA unless the information architecture requires one destination.
- Do not use photography. Use Lucide icons within `IconWrapper` for a focused, product-ready visual system.

**Accessibility, animation, spacing**

- Cards with actions must not become nested interactive elements.
- Icon-only meaning must be reinforced by title and description.
- Use `spacing-32` after the intro and `spacing-24` between cards.
- Preserve existing tokenized card hover lift; reduced-motion users receive no movement.

## 5. Industries

**Purpose**

Show that the platform adapts across verticals while maintaining a concise, scannable taxonomy.

**Existing components and expected props**

- `Industries`
  - `title`, `description`.
  - `items`: `{ title, description?, icon? }`.
- `Card`, `IconWrapper`, `Heading`, and `Paragraph` are composed internally.

**Layout and grid**

- Desktop: four-column industry grid.
- Tablet: two-column grid.
- Mobile: single-column stack.

**CTA and image placement**

- No image or CTA by default; use icons for recognition and keep the section exploratory rather than conversion-heavy.
- If a dedicated industry destination is approved later, add one section-level `Button` below the grid rather than actions in every card.

**Accessibility, animation, spacing**

- Use the section title as the grid context and card titles as subordinate headings.
- Keep icons decorative (`aria-hidden`) when the text names the industry.
- Use `spacing-32` intro-to-grid rhythm and `spacing-16` card gaps.
- Optional card hover behavior only; no looping visual treatment.

## 6. Why WorkSync

**Purpose**

Explain durable product and service differentiators in a compact, reusable benefit pattern.

**Existing components and expected props**

- `WhyWorkSync`
  - `title`, `description`.
  - `features`: array matching `FeatureCard` props: `{ title, description?, icon?, action? }`.
- `FeatureCard`: tokenized card with optional `IconWrapper` and caller-owned action node.

**Layout and grid**

- Desktop: three-column benefit grid.
- Tablet: two columns.
- Mobile: one column.

**CTA and image placement**

- Prefer no action in individual feature cards. If a next step is needed, place one primary CTA below the grid, aligned with the intro.
- No photography required; use product-relevant Lucide icons.

**Accessibility, animation, spacing**

- Card titles follow the section `h2` in heading order.
- Use `spacing-32` from intro to grid and `spacing-24` between cards.
- Retain the existing restrained hover state; use section entrance motion only once.

## 7. Recruitment Process

**Purpose**

Make the operating model understandable through an ordered, low-cognitive-load workflow narrative.

**Existing components and expected props**

- `RecruitmentProcess`
  - `title`, `description`.
  - `steps`: `{ title, description? }` in the approved order.
- Internal `Card`, `Heading`, and `Paragraph` composition supplies the visual step treatment.

**Layout and grid**

- Desktop: four ordered cards in a row.
- Tablet: two-by-two grid that retains ordered reading through DOM order.
- Mobile: one ordered vertical list.

**CTA and image placement**

- A process section is explanatory; do not place a CTA inside every step.
- Put one optional next-step `Button` after the ordered list.
- Do not use a separate image unless a single process artifact is approved; avoid decorative workflow diagrams.

**Accessibility, animation, spacing**

- Preserve the semantic ordered list supplied by the section.
- Step number, title, and description must be readable without color or icon interpretation.
- Use `spacing-32` before the list and `spacing-16` between cards.
- Optional one-time entrance animation; no per-step stagger that delays reading.

## 8. HR Technology Vision

**Purpose**

Communicate the platform's long-term technology direction while keeping the homepage anchored in credible, human-centered outcomes.

**Existing components and expected props**

- `SectionLayout`: `tone="surface"` or `tone="secondary"`.
- `Container`, `Heading`, `Paragraph`, and a `Button` action group.
- `Card` or `FeatureCard` for any supporting capabilities.
- A generic `MediaSplit` section-level component is recommended below; it should own the repeated content-and-media arrangement without duplicating Hero's `h1` semantics.

**Layout and grid**

- Desktop: asymmetrical two-column split, copy on the left and product, technology, or workplace image on the right.
- Tablet: retain the split when media is legible; otherwise stack copy first and media second.
- Mobile: single column with media below the action group.

**CTA and image placement**

- Place a single secondary or outline CTA after supporting copy.
- Use a real product-interface crop, approved modern workplace image, or restrained illustration in the media column. It should be rounded and contained by tokenized radius/shadow, not treated as a background decoration.

**Accessibility, animation, spacing**

- Use a section `h2`, never another `h1`.
- Media must have contextual alt text if it communicates product information.
- Use `spacing-80` desktop vertical rhythm, `spacing-64` tablet, and `spacing-48` mobile.
- Use a single fade-and-slide entrance for the content/media group; no parallax.

## 9. Statistics

**Purpose**

Offer proof points in a scannable format after the vision section has established context.

**Existing components and expected props**

- `Statistics`
  - `title`, `description`.
  - `items`: array matching `StatCard` props: `{ value, label, trend? }`.
- `StatCard`: renders value, label, and optional trend node.

**Layout and grid**

- Desktop: four equal cards.
- Tablet: two-by-two cards.
- Mobile: single-column cards, or a two-column layout only if values remain easy to scan.

**CTA and image placement**

- No CTA or image by default. This is evidence, not a navigation block.

**Accessibility, animation, spacing**

- Text must include enough context that a number is meaningful without visual styling.
- Do not use count-up animation unless a later accessibility review confirms a reduced-motion-safe, non-disruptive implementation.
- Use `spacing-32` from intro to grid and `spacing-16` gaps.

## 10. Testimonials

**Purpose**

Present qualitative validation after quantitative proof, using a stable, readable layout instead of an inaccessible carousel.

**Existing components and expected props**

- `Testimonials`
  - `title`, `description`.
  - `items`: `{ quote, name, role?, avatar?, initials? }`.
- `Avatar`: `src`, `alt`, `initials`, and size default.
- `Card` and `Paragraph` are composed internally.

**Layout and grid**

- Desktop: three-card grid.
- Tablet: two-card grid.
- Mobile: one-card stack.

**CTA and image placement**

- No CTA inside the testimonial group. If needed, place a single CTA after the grid, before FAQ.
- Use only approved customer portraits or initials fallbacks. Avatar alt text is the person's name; do not use generic image descriptions.

**Accessibility, animation, spacing**

- Keep quotes as readable text, not text baked into images.
- Do not auto-rotate or animate cards horizontally.
- Use `spacing-32` before the grid and `spacing-24` card gaps.
- Existing card hover is optional; it must not imply that a static quote is interactive.

## 11. FAQ

**Purpose**

Resolve predictable decision blockers near the end of the page without forcing a support journey.

**Existing components and expected props**

- `FAQ`
  - `title`, `description`.
  - `items`: array matching `Accordion` items: `{ id, title, content, disabled? }`.
- `Accordion`: optional `allowMultiple`, `defaultOpenIds`, and `onValueChange` when required by a future analytics or state layer.

**Layout and grid**

- Desktop: two-column composition with intro left and FAQ disclosure list right.
- Tablet: preserve two columns only where the question list remains usable; otherwise stack intro then list.
- Mobile: single-column stack.

**CTA and image placement**

- No image.
- Place a quiet support CTA below the accordion only if there is an approved destination; do not use a CTA inside each FAQ item.

**Accessibility, animation, spacing**

- The existing Accordion supplies button, `aria-expanded`, `aria-controls`, and labelled region relationships.
- Question strings must remain unique and concise for assistive-technology users.
- Use `spacing-32` between intro and disclosure group.
- Use the existing height/opacity transition; reduced-motion settings must disable movement.

## 12. Final CTA

**Purpose**

Provide a final, unambiguous conversion opportunity after visitors have seen evidence and resolved common questions.

**Existing components and expected props**

- `CTA`
  - `title`, `description`.
  - `actions`: one primary `Button`, with an optional secondary action.
  - `className`: only for token-backed composition adjustments.
- `Button`: primary action should use a light or outline-on-dark treatment when placed on the primary section tone.

**Layout and grid**

- Desktop, tablet, and mobile: centered single-column copy block, constrained to `content-md`.
- Actions are inline and centered on desktop/tablet; wrap or stack on mobile.

**CTA and image placement**

- This is the final CTA location. Avoid adding competing card-level CTAs immediately above it.
- No image by default. If an image is approved, it must be supportive and below the action hierarchy, not compete with it.

**Accessibility, animation, spacing**

- Keep contrast appropriate to the primary tone and preserve Button focus visibility.
- Use `spacing-80` desktop, reducing to `spacing-64`/`spacing-48` on smaller screens.
- No high-attention animation; a single entrance fade is sufficient.

## 13. Footer

**Purpose**

Close the page with stable navigation, legal information, and brand reinforcement.

**Existing components and expected props**

- `Footer`
  - `brand`: current approved text brand until a visual mark exists.
  - `tagline`: approved brand tagline.
  - `linkGroups`: `{ title, links: [{ label, href }] }`.
  - `legal`: approved legal text.
- `Container` and `Paragraph` are composed internally.

**Layout and grid**

- Desktop: brand column plus up to three link-group columns.
- Tablet: two-column grid.
- Mobile: one-column stack with groups following the brand.

**CTA and image placement**

- Do not repeat the final conversion CTA; keep footer links informational.
- No image required. A future `BrandLogo` may replace the text brand.

**Accessibility, animation, spacing**

- Footer remains a semantic footer landmark.
- Link-group titles must describe their link collection.
- Preserve visible focus states against the dark background.
- Use `spacing-64` top/bottom rhythm and `spacing-48` grid gaps. No motion is required.

## Reusable gaps to resolve before assembly

The following are generic design-system additions. They are deliberately **not implemented** in this phase.

| Missing reusable item                          | Why it is needed                                                                                                                                      | Suggested public props                                                         |
| ---------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| `LogoCloud`                                    | Trust indicators need a consistent, accessible repeated-logo treatment; generic cards or arbitrary image markup would duplicate layout logic.         | `label`, `items: [{ src, alt, href? }]`, `columns`, `tone`                     |
| `MediaSplit`                                   | Hero owns an `h1`; the technology-vision section needs the same responsive media/content pattern with flexible heading semantics.                     | `eyebrow`, `title`, `description`, `actions`, `media`, `mediaPosition`, `tone` |
| `SectionIntro`                                 | Most sections repeat a constrained eyebrow/title/description group. A generic composition primitive would keep headings, widths, and spacing uniform. | `eyebrow`, `title`, `description`, `align`, `as`                               |
| `BrandLogo`                                    | Navbar and Footer currently support a text brand. A reusable brand-mark component is needed once approved logo assets exist.                          | `variant`, `size`, `href?`, `label`                                            |
| `Navbar` `overlay` prop                        | Transparent styling exists, but explicit over-hero positioning should be a generic layout option rather than page-specific CSS.                       | `overlay`, `transparent`, `sticky`                                             |
| `SectionLayout` responsive spacing enhancement | Major sections need token-based spacing that can scale by viewport without repeating `className` overrides.                                           | `spacing: { base, md, lg }` or equivalent semantic scale                       |

No carousel, generic illustration component, testimonial slider, or business-specific section is recommended. The existing grid and disclosure patterns are more accessible, lighter, and appropriate for the enterprise product direction.
