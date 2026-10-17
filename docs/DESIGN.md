---
name: design-system
description: Design specifications for the application UI. The system supports two visual contexts. Hero and display views use near-black canvases with thin display type and white-bordered outline pills. Analytical and transactional views use a cream-mint canvas with aloe and pistachio accents, dark text, and filled pill buttons. Both contexts share typographic rules and pill geometry.

colors:
  primary: "#000000"
  ink: "#000000"
  on-primary: "#ffffff"
  on-dark: "#ffffff"
  canvas-night: "#000000"
  canvas-night-elevated: "#0a0a0a"
  canvas-light: "#ffffff"
  canvas-cream: "#fbfbf5"
  surface-elevated-dark: "#1e2c31"
  shade-30: "#d4d4d8"
  shade-40: "#a1a1aa"
  shade-50: "#71717a"
  shade-60: "#52525b"
  shade-70: "#3f3f46"
  hairline-light: "#e4e4e7"
  hairline-dark: "#1e2c31"
  aloe-10: "#c1fbd4"
  pistachio-10: "#d4f9e0"
  link-cool-1: "#9dabad"
  link-cool-2: "#9797a2"
  link-cool-3: "#bdbdca"
  link-mint: "#99b3ad"

typography:
  display-xxl:
    fontFamily: "NeueHaasGrotesk Display, Helvetica, Arial, sans-serif"
    fontSize: 96px
    fontWeight: 330
    lineHeight: 1.0
    letterSpacing: 2.4px
    fontFeature: ss03
  display-xl:
    fontFamily: "NeueHaasGrotesk Display, Helvetica, Arial, sans-serif"
    fontSize: 70px
    fontWeight: 330
    lineHeight: 1.0
    letterSpacing: 0
    fontFeature: ss03
  display-lg:
    fontFamily: "NeueHaasGrotesk Display, Helvetica, Arial, sans-serif"
    fontSize: 55px
    fontWeight: 330
    lineHeight: 1.16
    letterSpacing: 0
    fontFeature: ss03
  display-md:
    fontFamily: "NeueHaasGrotesk Display, Helvetica, Arial, sans-serif"
    fontSize: 48px
    fontWeight: 330
    lineHeight: 1.14
    letterSpacing: 0
    fontFeature: ss03
  heading-xl:
    fontFamily: "NeueHaasGrotesk Display, Helvetica, Arial, sans-serif"
    fontSize: 28px
    fontWeight: 500
    lineHeight: 1.28
    letterSpacing: 0.42px
    fontFeature: ss03
  heading-lg:
    fontFamily: "NeueHaasGrotesk Display, Helvetica, Arial, sans-serif"
    fontSize: 24px
    fontWeight: 400
    lineHeight: 1.14
    letterSpacing: 0.36px
    fontFeature: ss03
  heading-md:
    fontFamily: "NeueHaasGrotesk Display, Helvetica, Arial, sans-serif"
    fontSize: 20px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0.3px
    fontFeature: ss03
  heading-sm:
    fontFamily: "NeueHaasGrotesk Display, Helvetica, Arial, sans-serif"
    fontSize: 18px
    fontWeight: 500
    lineHeight: 1.25
    letterSpacing: 0.72px
    fontFeature: ss03
  body-lg:
    fontFamily: "Inter Variable, Inter, Helvetica, Arial, sans-serif"
    fontSize: 18px
    fontWeight: 550
    lineHeight: 1.56
    letterSpacing: 0
    fontFeature: ss03
  body-md:
    fontFamily: "Inter Variable, Inter, Helvetica, Arial, sans-serif"
    fontSize: 16px
    fontWeight: 420
    lineHeight: 1.5
    letterSpacing: 0
    fontFeature: ss03
  body-strong:
    fontFamily: "Inter Variable, Inter, Helvetica, Arial, sans-serif"
    fontSize: 16px
    fontWeight: 550
    lineHeight: 1.5
    letterSpacing: 0
    fontFeature: ss03
  caption:
    fontFamily: "Inter Variable, Inter, Helvetica, Arial, sans-serif"
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.49
    letterSpacing: 0.28px
    fontFeature: ss03
  micro:
    fontFamily: "Inter Variable, Inter, Helvetica, Arial, sans-serif"
    fontSize: 13px
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: -0.13px
    fontFeature: ss03
  eyebrow-cap:
    fontFamily: "Inter Variable, Inter, Helvetica, Arial, sans-serif"
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: 0.72px
    fontFeature: ss03
  code:
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
    fontFeature: ss03

rounded:
  xs: 4px
  sm: 5px
  md: 8px
  lg: 12px
  xl: 20px
  pill: 9999px

spacing:
  xxs: 2px
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
  xxl: 32px
  huge: 64px

components:
  button-primary-pill:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.body-md}"
    rounded: "{rounded.pill}"
    padding: 12px 24px
  button-primary-pill-pressed:
    backgroundColor: "{colors.shade-70}"
    textColor: "{colors.on-primary}"
    typography: "{typography.body-md}"
    rounded: "{rounded.pill}"
    padding: 12px 24px
  button-outline-on-dark:
    backgroundColor: "{colors.canvas-night}"
    textColor: "{colors.on-primary}"
    typography: "{typography.body-md}"
    rounded: "{rounded.pill}"
    padding: 12px 24px
  button-outline-on-light:
    backgroundColor: "{colors.canvas-light}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.pill}"
    padding: 12px 24px
  button-aloe-pill:
    backgroundColor: "{colors.aloe-10}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.pill}"
    padding: 12px 24px
  card-pricing:
    backgroundColor: "{colors.canvas-light}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.lg}"
    padding: 32px
  card-pricing-featured:
    backgroundColor: "{colors.aloe-10}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.lg}"
    padding: 32px
  card-feature-cinematic:
    backgroundColor: "{colors.canvas-night-elevated}"
    textColor: "{colors.on-primary}"
    typography: "{typography.body-lg}"
    rounded: "{rounded.lg}"
    padding: 32px
  card-pistachio-band:
    backgroundColor: "{colors.pistachio-10}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.lg}"
    padding: 32px
  card-photo-frame:
    backgroundColor: "{colors.canvas-night}"
    textColor: "{colors.on-primary}"
    typography: "{typography.body-md}"
    rounded: "{rounded.xl}"
    padding: 0px
  pill-tag-mint:
    backgroundColor: "{colors.aloe-10}"
    textColor: "{colors.ink}"
    typography: "{typography.eyebrow-cap}"
    rounded: "{rounded.pill}"
    padding: 4px 12px
  pill-tag-shade:
    backgroundColor: "{colors.shade-30}"
    textColor: "{colors.ink}"
    typography: "{typography.eyebrow-cap}"
    rounded: "{rounded.pill}"
    padding: 4px 12px
  nav-bar-light:
    backgroundColor: "{colors.canvas-light}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.xs}"
    padding: 16px 24px
  nav-bar-dark:
    backgroundColor: "{colors.canvas-night}"
    textColor: "{colors.on-primary}"
    typography: "{typography.body-md}"
    rounded: "{rounded.xs}"
    padding: 16px 24px
  link-on-dark:
    backgroundColor: "{colors.canvas-night}"
    textColor: "{colors.on-primary}"
    typography: "{typography.body-md}"
    rounded: "{rounded.xs}"
    padding: 0px
  footer-dark:
    backgroundColor: "{colors.canvas-night}"
    textColor: "{colors.on-primary}"
    typography: "{typography.caption}"
    rounded: "{rounded.xs}"
    padding: 64px 24px
  footer-light:
    backgroundColor: "{colors.canvas-light}"
    textColor: "{colors.ink}"
    typography: "{typography.caption}"
    rounded: "{rounded.xs}"
    padding: 64px 24px
---

# UI design system specification

This guide documents the color palette, typography hierarchy, spacing scale, component geometry, and responsive behavior used across the web client.

## Color system

### Canvases

The interface uses distinct canvas backgrounds depending on the view context:

- Canvas night (`#000000`): Dark background for marketing heroes and visual showcases.
- Canvas night elevated (`#0a0a0a`): Slightly lighter surface for elevated dark cards.
- Canvas cream (`#fbfbf5`): Off-white background for analytical workspaces, tables, and settings.
- Canvas light (`#ffffff`): Pure white background for elevated cards on cream surfaces.

### Accent tones

- Aloe 10 (`#c1fbd4`): Light mint used for primary badges and featured cards.
- Pistachio 10 (`#d4f9e0`): Pastel green for subtle row highlights and callout bands.

### Shade ladder

- Shade-30 (`#d4d4d8`): Tag and chip background on light surfaces.
- Shade-40 (`#a1a1aa`): Muted secondary indicators.
- Shade-50 (`#71717a`): Secondary body and label text.
- Shade-60 (`#52525b`): Subtitle text and table column headers.
- Shade-70 (`#3f3f46`): Active state for dark pill buttons.

### Text colors

- Ink (`#000000`): Primary text on light and cream canvases.
- On primary (`#ffffff`): Text on dark canvases and inside filled black pills.

## Typography

### Font families

- Display: Neue Haas Grotesk Display or Inter Display at light weights (330 to 500).
- User interface: Inter Variable (weights 420 to 550) for dashboard controls, data tables, and body copy.
- Monospace: `ui-monospace`, SFMono-Regular, Menlo, Monaco, Consolas, or system monospace for JSON payloads and code snippets.

The OpenType `ss03` stylistic set is enabled across the interface to provide cleaner geometric forms for numerals and specific letterforms.

### Type scale

| Token | Size | Weight | Line height | Letter spacing | Usage |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `display-xxl` | 96px | 330 | 1.0 | 2.4px | Main hero headline |
| `display-xl` | 70px | 330 | 1.0 | 0 | Section opener |
| `display-lg` | 55px | 330 | 1.16 | 0 | View title |
| `display-md` | 48px | 330 | 1.14 | 0 | Subsection header |
| `heading-xl` | 28px | 500 | 1.28 | 0.42px | Card header |
| `heading-lg` | 24px | 400 | 1.14 | 0.36px | Compact card title |
| `heading-md` | 20px | 500 | 1.4 | 0.3px | Section subtitle |
| `heading-sm` | 18px | 500 | 1.25 | 0.72px | Group label |
| `body-lg` | 18px | 550 | 1.56 | 0 | Lead paragraph text |
| `body-md` | 16px | 420 | 1.5 | 0 | Default body text |
| `body-strong` | 16px | 550 | 1.5 | 0 | Emphasized body text |
| `caption` | 14px | 500 | 1.49 | 0.28px | Footnotes and meta labels |
| `micro` | 13px | 500 | 1.5 | -0.13px | Small captions |
| `eyebrow-cap` | 12px | 400 | 1.2 | 0.72px | Uppercase section eyebrow |
| `code` | 16px | 400 | 1.5 | 0 | Inline code and snippets |

## Layout and spacing

### Spacing scale

- Base unit: 8px (with 2px and 4px available for compact controls).
- Spacing values: `xxs` (2px), `xs` (4px), `sm` (8px), `md` (12px), `lg` (16px), `xl` (24px), `xxl` (32px), `huge` (64px).
- Card padding: 24px for standard analytical panels, 32px for featured cards.

### Container widths

- Wide screens: Maximum container width 1440px to 1600px.
- Analytical views: Centered readable columns between 720px and 1200px.

## Elevation and shadows

| Level | CSS shadow definition | Usage |
| :--- | :--- | :--- |
| Level 0 | None | Base background surfaces |
| Level 1 | `0 1px 2px rgba(255,255,255,0.05), inset 0 1px 0 rgba(255,255,255,0.04)` | Inset top-edge highlight on dark cards |
| Level 2 | `0 0 0 1px rgba(255,255,255,0.08), 0 1px 3px rgba(0,0,0,0.3)` | Elevated cards on dark canvas |
| Level 3 | `0 8px 8px rgba(0,0,0,0.03), 0 4px 4px rgba(0,0,0,0.03), 0 2px 2px rgba(0,0,0,0.03), 0 0 0 1px rgba(0,0,0,0.06)` | Layered soft paper shadow on cream canvas |
| Level 4 | `0 25px 50px -12px rgba(0,0,0,0.25)` | Modals and floating action drawers |

## Geometry and corner radius

| Token | Value | Usage |
| :--- | :--- | :--- |
| `rounded.xs` | 4px | Small code tags |
| `rounded.sm` | 5px | Small preview thumbs |
| `rounded.md` | 8px | Text inputs and status badges |
| `rounded.lg` | 12px | Analytical panels and card containers |
| `rounded.xl` | 20px | Asymmetrical card headers |
| `rounded.pill` | 9999px | All buttons, status chips, and tab selectors |

## Components

### Buttons

- `button-primary-pill`: Black background, white text, pill radius, 12px vertical by 24px horizontal padding.
- `button-primary-pill-pressed`: Pressed state shifting background to shade-70 (`#3f3f46`).
- `button-outline-on-dark`: Transparent background on dark canvas with 2px white outline.
- `button-outline-on-light`: White background on cream canvas with 1px border.
- `button-aloe-pill`: Mint green background (`#c1fbd4`) with black text for featured actions.

### Cards and panels

- `surface-card-base`: White background (`#ffffff`), 1px border (`#e4e4e7`), rounded 12px (`rounded-xl`), and Level 3 paper shadow.
- `card-pricing-featured`: Mint fill (`#c1fbd4`) with 1px dark border for highlighted items.

## Responsive design rules

- Touch targets: Buttons maintain at least 44px by 44px hit areas on mobile viewports.
- Typography scaling: Headings step down smoothly from 96px on desktop to 48px or 36px on mobile viewports.
- Navigation: Header navigation collapses into a mobile toggle below 768px screen width.
