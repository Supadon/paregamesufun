---
name: Translating Games to Dreams
description: A premium cosmic showcase for Thai PC game translations
colors:
  primary: "#2B5FFF"
  primary-deep: "#0C1340"
  neutral-bg: "#04071A"
  neutral-surface: "#070D28"
  text-primary: "#EEF4FF"
  text-secondary: "#8BA8D8"
  text-muted: "#4A6499"
  border: "rgba(100, 150, 255, 0.12)"
  border-low: "rgba(100, 150, 255, 0.07)"
typography:
  display:
    fontFamily: "Noto Sans Thai, Sarabun, sans-serif"
    fontSize: "clamp(2rem, 5vw, 3.5rem)"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Noto Sans Thai, Sarabun, sans-serif"
    fontSize: "clamp(1.5rem, 4vw, 2.25rem)"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Sarabun, Noto Sans Thai, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "normal"
  body:
    fontFamily: "Sarabun, Noto Sans Thai, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  label:
    fontFamily: "Sarabun, Noto Sans Thai, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 700
    lineHeight: 1.5
    letterSpacing: "0.05em"
rounded:
  sm: "10px"
  md: "16px"
  lg: "22px"
  xl: "28px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.xl}"
    padding: "10px 24px"
  button-secondary:
    backgroundColor: "rgba(255, 255, 255, 0.05)"
    textColor: "{colors.text-secondary}"
    rounded: "{rounded.xl}"
    padding: "10px 20px"
  card-container:
    backgroundColor: "{colors.neutral-surface}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.md}"
    padding: "24px"
---

# Design System: Translating Games to Dreams

## 1. Overview

**Creative North Star: "The Cosmic Observatory" (หอดูดาวชวนฝันชวนนำทาง)**

The visual system is designed to evoke a dreamy, high-end immersive experience. It takes inspiration from a deep night sky filled with distant stars and cosmic nebulae, mirroring the excitement of escaping into another world through translation. It rejects flat SaaS-like corporate environments and generic layouts in favor of deep-hued glassmorphic layers and glowing elements.

### Key Characteristics:
- **Deep space backdrop**: Dark blue-indigo foundations layered with soft neon-blue glow effects.
- **Glassmorphism surfaces**: Semitransparent containers that create depth over a flowing background.
- **Micro-interactions**: High-contrast, tactile hover feedback that makes the interface feel responsive and premium.

---

## 2. Colors

The color palette reflects a high-contrast cosmic atmosphere where brilliant primary blue hues cut through the deep space background.

### Primary
- **Royal Blue Accent** (#2B5FFF / oklch(50.31% 0.269 261.26)): Used for primary buttons, highlights, and active status indicators. Representing high energy and premium quality.
- **Blue Medium** (#4A7FFF / oklch(60.12% 0.22 261.26)): Middle color for gradients and interactive focus bounds.
- **Blue Light** (#6FA0FF / oklch(71.45% 0.17 261.26)): Hover states, highlighting important stats and active tags.

### Neutral
- **Deep Space Background** (#04071A / oklch(10.15% 0.045 272.2)): The root canvas color representing the endless cosmos.
- **Deep Navy Container** (#070D28 / oklch(14.2% 0.06 272.2)): Elevated surface background used for cards and main modules.
- **Slate Blue Low** (#0C1340 / oklch(18.5% 0.08 272.2)): Used for form fields and inner table headings.
- **Ice White Text** (#EEF4FF / oklch(95.4% 0.02 261.26)): Primary content text, offering crisp contrast against dark surfaces.
- **Muted Blue Text** (#8BA8D8 / oklch(72.5% 0.06 261.26)): Secondary labels, descriptive text, and details.

### Named Rules
**The 10% Blue Glow Rule.** Saturated royal blue should occupy less than 10% of any screen. Its rarity makes it a powerful signpost for actions.

---

## 3. Typography

**Display Font:** Noto Sans Thai (with Sarabun, sans-serif)
**Body Font:** Sarabun (with Noto Sans Thai, sans-serif)
**Label/Mono Font:** Sarabun, monospace

Typography features clean, highly readable geometric Thai letterforms that balance the traditional Sarabun body face with modern, bold Noto Sans Thai headers.

### Hierarchy
- **Display** (Bold (700), clamp(2rem, 5vw, 3.5rem), 1.2): Hero display, page titles.
- **Headline** (Bold (700), clamp(1.5rem, 4vw, 2.25rem), 1.3): Major page sections.
- **Title** (Semi-Bold (600), 1.25rem, 1.4): Game names inside cards, modal titles.
- **Body** (Regular (400), 0.875rem, 1.6): Descriptions, specs, guides. Max line length: (75ch).
- **Label** (Bold (700), 0.75rem, 1.5, uppercase): Tags, buttons, subtitles, section headers.

---

## 4. Elevation

The system relies on glassmorphism and card overlays using transparent borders and background blurs to express depth instead of heavy drop shadows.

### Shadow Vocabulary
- **Interactive Accent Glow** (`box-shadow: 0 4px 15px rgba(43,95,255,0.25)`): Applied on primary action buttons at rest.
- **Hover Ambient Glow** (`box-shadow: 0 6px 25px rgba(43,95,255,0.45)`): Applied on hover states to give a floating feedback.

### Named Rules
**The Glass Border Rule.** Depth is conveyed by light borders (`border: 1px solid rgba(255,255,255,0.1)`) combined with backdrop blurs (`backdrop-filter: blur(16px)`). Shadows should not be used as decoration on cards.

---

## 5. Components

### Buttons
- **Shape:** Full pill radius (28px).
- **Primary:** Gradient from-blue via-blue2 to-blue3, high-contrast white text, px-5 py-2.5, tracking-wide.
- **Hover / Focus:** Hover scale up (`scale-[1.02]`), transition duration (300ms) with ease-out curve.

### Cards / Containers
- **Corner Style:** Medium radius (16px).
- **Background:** Semitransparent navy (`bg-bg1/40` or `bg-bg1`).
- **Border:** Low contrast thin border (`border border-white/10` or `rgba(100,150,255,0.07)`).

### Inputs / Fields
- **Style:** Background dark navy (`bg-bg2/40`), corner radius (12px), border `border-white/5`.
- **Focus:** Highlighted border transition `focus:border-blue2/40` with no outline.

---

## 6. Do's and Don'ts

### Do:
- **Do** use OKLCH/hex colors matching the cosmic navy and ice white palette.
- **Do** clamp Display headings so they remain readable at smaller breakpoints.
- **Do** center stage status cards symmetrically on the game detail page.

### Don't:
- **Don't** use generic flat grey borders or SaaS neutral-beige backgrounds.
- **Don't** use text gradients (e.g. `bg-gradient-to-r background-clip: text`) for normal headings.
- **Don't** round cards or blocks excessively past 22px (radius-lg).
