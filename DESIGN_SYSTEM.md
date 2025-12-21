# Design System - Australian Financial Calculator

**Version:** 1.0.0
**Last Updated:** 2025-12-21
**Framework:** Tailwind CSS 3.4.x
**Supports:** Light & Dark Mode

---

## Table of Contents

1. [Design Principles](#design-principles)
2. [Color Palette](#color-palette)
3. [Typography](#typography)
4. [Spacing & Layout](#spacing--layout)
5. [Components](#components)
6. [Patterns & Best Practices](#patterns--best-practices)
7. [Accessibility](#accessibility)
8. [Mobile-First Guidelines](#mobile-first-guidelines)

---

## Design Principles

### Core Values
1. **Mobile-First** - Every design decision prioritizes mobile experience
2. **Clarity** - Financial data must be clear and unambiguous
3. **Consistency** - Predictable patterns across all pages
4. **Accessibility** - WCAG 2.1 AA compliance minimum
5. **Performance** - Fast, lightweight, minimal dependencies

### Design Goals
- Touch-friendly interactions (min 44px touch targets)
- High contrast for readability of financial data
- Professional appearance suitable for financial context
- Dark mode support for reduced eye strain
- Progressive disclosure of complex features

---

## Color Palette

### Brand Colors

#### Primary (Blue)
- **Purpose:** Interactive elements, CTAs, active states
- **Light Mode:** `blue-600` (#2563eb)
- **Dark Mode:** `blue-300` (#93c5fd)

```tsx
// Usage
className="text-blue-600 dark:text-blue-300"
className="bg-blue-600 hover:bg-blue-700"
```

#### Secondary (Amber/Sun)
- **Purpose:** Warnings, highlights, theme toggle
- **Light/Dark:** `amber-300` (#fcd34d)

```tsx
// Usage - Limited to sun icon
className="text-amber-300"
```

### Neutral Palette (Slate)

#### Background Colors

| Token | Light Mode | Dark Mode | Usage |
|-------|------------|-----------|-------|
| `bg-primary` | `slate-100` (#f1f5f9) | `slate-950` (#020617) | Main page background |
| `bg-surface` | `white` (#ffffff) | `slate-900` (#0f172a) | Cards, panels |
| `bg-elevated` | `white/95` | `slate-900/95` | Bottom nav, modals |
| `bg-subtle` | `white/70` | `slate-900/70` | Glassmorphic effects |

```tsx
// Standard background pattern
<body className="bg-slate-100 dark:bg-slate-950">
  <div className="bg-white dark:bg-slate-900"> {/* Card */}
  </div>
</body>
```

#### Text Colors

| Token | Light Mode | Dark Mode | Usage |
|-------|------------|-----------|-------|
| `text-primary` | `slate-900` (#0f172a) | `white` (#ffffff) | Main headings, important text |
| `text-body` | `slate-900` (#0f172a) | `slate-50` (#f8fafc) | Body text |
| `text-secondary` | `slate-700` (#334155) | `slate-200` (#e2e8f0) | Supporting text |
| `text-muted` | `slate-600` (#475569) | `slate-300` (#cbd5e1) | Helper text, labels |
| `text-subtle` | `slate-400` (#94a3b8) | `slate-500` (#64748b) | Disabled, de-emphasized |

```tsx
// Typography hierarchy
<h1 className="text-slate-900 dark:text-white">     {/* Primary */}
<p className="text-slate-700 dark:text-slate-200">  {/* Secondary */}
<span className="text-slate-600 dark:text-slate-300"> {/* Muted */}
<small className="text-slate-400 dark:text-slate-500"> {/* Subtle */}
```

#### Border Colors

| Token | Light Mode | Dark Mode | Usage |
|-------|------------|-----------|-------|
| `border-primary` | `slate-200` (#e2e8f0) | `slate-800` (#1e293b) | Card borders, dividers |
| `border-subtle` | `slate-200/80` | `slate-800/80` | Nested borders, secondary dividers |
| `border-focus` | `blue-500` (#3b82f6) | `blue-400` (#60a5fa) | Focus rings |

```tsx
// Border patterns
className="border border-slate-200 dark:border-slate-800"
className="border border-slate-200/80 dark:border-slate-800/80" // Subtle
```

### Special Colors

#### Header Gradient (Dark Blue)
- **Custom gradient** for `TitleHeading` component only
- Colors: `from-[#0f1f46] via-[#142f6e] to-[#08132d]`
- **Do not use elsewhere** - this is signature branding

```tsx
// Only in TitleHeading.tsx
className="bg-gradient-to-br from-[#0f1f46] via-[#142f6e] to-[#08132d]"
```

#### Transparency Levels

| Opacity | Value | Usage |
|---------|-------|-------|
| High | `/95` (0.95) | Bottom nav, sticky headers |
| Medium | `/70` (0.70) | Glassmorphic cards |
| Low | `/10` (0.10) | Subtle overlays, decorative elements |
| Minimal | `/5` (0.05) | Very subtle decorative elements |

---

## Typography

### Font Family
- **System Font Stack:** `system-ui, -apple-system, BlinkMacSystemFont, sans-serif`
- **Rationale:** Native appearance, optimal performance, no font loading

### Type Scale

| Name | Class | Size (rem) | px equivalent | Usage |
|------|-------|------------|---------------|-------|
| Display | `text-2xl` | 1.5rem | 24px | Page titles |
| Heading 1 | `text-xl` | 1.25rem | 20px | Section headings |
| Heading 2 | `text-lg` | 1.125rem | 18px | Card headings |
| Body | `text-base` | 1rem | 16px | Default body text |
| Small | `text-sm` | 0.875rem | 14px | Supporting text, descriptions |
| Tiny | `text-xs` | 0.75rem | 12px | Labels, captions |
| Micro | `text-[10px]` | 0.625rem | 10px | Badges, tiny labels |

### Font Weights

| Weight | Class | Usage |
|--------|-------|-------|
| Semibold | `font-semibold` (600) | Headings, emphasized text |
| Medium | `font-medium` (500) | Nav labels, buttons |
| Regular | `font-normal` (400) | Body text (default) |

### Special Typography Patterns

#### Badge/Label (Uppercase Micro)
```tsx
<p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">
  Badge Text
</p>
```
- **Size:** `text-xs` (12px) or `text-[10px]` (10px)
- **Weight:** `font-semibold`
- **Transform:** `uppercase`
- **Tracking:** `tracking-[0.3em]` or `tracking-[0.2em]`
- **Color:** `slate-400` / `slate-500` (dark)

#### Responsive Heading (Fluid)
```tsx
<h1 className="text-[clamp(1.25rem,3vw,1.85rem)]">
  Australian Financial Calculator
</h1>
```
- **Use case:** Main header that scales with viewport
- **Range:** 20px → 29.6px

---

## Spacing & Layout

### Spacing Scale

All spacing uses Tailwind's default 4px-based scale:

| Token | Value | Usage |
|-------|-------|-------|
| `gap-1` | 0.25rem (4px) | Tight icon spacing |
| `gap-2` | 0.5rem (8px) | Icon-to-text spacing |
| `gap-4` | 1rem (16px) | Card grids, component spacing |
| `gap-6` | 1.5rem (24px) | Section spacing |
| `p-4` | 1rem (16px) | Card padding |
| `p-6` | 1.5rem (24px) | Page padding |
| `p-8` | 2rem (32px) | Generous card padding |

### Layout Containers

#### Page Container
**Standard wrapper for all pages:**
```tsx
<div className="px-6 pb-32 pt-6">
  {/* Page content */}
</div>
```
- **Horizontal:** `px-6` (24px) - Consistent page margins
- **Top:** `pt-6` (24px) - Spacing below sticky header
- **Bottom:** `pb-32` (128px) - Extra space above bottom nav

**Usage:** Apply to every page component wrapper

#### Content Max Width
```tsx
<div className="mx-auto max-w-screen-sm">
  {/* Constrained content */}
</div>
```
- **Max width:** `640px` (Tailwind's `sm` breakpoint)
- **Centering:** `mx-auto`
- **Usage:** Main layout wrapper in `MainLayout.tsx`

### Safe Areas

#### Bottom Navigation Safe Area
```tsx
<nav className="safe-area-bottom ...">
```
- **Purpose:** iOS notch compatibility
- **Usage:** Only on `BottomNav` component
- **Ensures:** 16px additional padding on devices with home indicator

---

## Components

### Cards

#### Standard Card
```tsx
<div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition dark:border-slate-800 dark:bg-slate-900">
  {/* Card content */}
</div>
```

**Anatomy:**
- **Border Radius:** `rounded-2xl` (16px)
- **Border:** `border border-slate-200` / `slate-800`
- **Background:** `bg-white` / `slate-900`
- **Padding:** `p-4` (16px)
- **Shadow:** `shadow-sm` (subtle elevation)
- **Transition:** `transition` (smooth theme changes)

#### Glassmorphic Card (Special)
```tsx
<div className="rounded-3xl border border-dashed border-slate-300 bg-white/70 p-8 shadow-inner backdrop-blur dark:border-slate-700 dark:bg-slate-900/70">
  {/* Semi-transparent card */}
</div>
```

**When to use:**
- "Coming soon" / "Under construction" states
- Decorative, non-critical content
- Marketing/informational sections

**Anatomy:**
- **Border Radius:** `rounded-3xl` (24px) - More rounded than standard
- **Border:** `border-dashed` - Indicates incomplete/temporary
- **Background:** `bg-white/70` - Semi-transparent
- **Backdrop:** `backdrop-blur` - Frosted glass effect
- **Shadow:** `shadow-inner` - Inset depth

### Buttons & Interactive Elements

#### Bottom Navigation Button
```tsx
<NavLink
  className={({ isActive }) =>
    `flex h-full flex-1 flex-col items-center justify-center transition-colors ${
      isActive
        ? 'text-blue-600 dark:text-blue-300'
        : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
    }`
  }
>
  <Icon className="w-6 h-6 mb-1" />
  <span className="text-xs font-medium">{label}</span>
</NavLink>
```

**States:**
- **Active:** Blue (`blue-600` / `blue-300`)
- **Inactive:** Gray (`gray-600` / `gray-300`)
- **Hover:** Darkens (`gray-900` / `white`)
- **Icon Size:** `w-6 h-6` (24×24px)
- **Label:** `text-xs font-medium`

#### Icon Button (Circular)
```tsx
<button className="flex h-6 w-6 items-center justify-center rounded-full border border-white/25 bg-white/10">
  <Icon className="h-3.5 w-3.5" />
</button>
```

**Sizes:**
- **Small:** `h-6 w-6` (24×24px) with `h-3.5 w-3.5` icon
- **Medium:** `h-14 w-14` (56×56px) with `h-6 w-6` icon
- **Compact:** `h-[34px] w-[34px]` with `h-[15px] w-[15px]` icon

#### Theme Toggle Button
```tsx
<button className="flex flex-col items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur transition-all hover:bg-white/20">
  <Icon />
  <span className="text-[9px] font-semibold tracking-wide">LABEL</span>
</button>
```

**Unique to:** `TitleHeading.tsx`
**States:** Condenses when scrolling

### Accordion

#### Feature Accordion Pattern
```tsx
<FeatureAccordion items={[
  {
    badge: 'Category',
    title: 'Feature title',
    content: 'Feature description...',
  },
]} />
```

**Visual specs:**
- **Container:** Standard card styling
- **Spacing:** `space-y-4` between items
- **Indicator:** `+` symbol, rotates 45° when open
- **Animation:** `transition-[max-height,opacity] duration-300`
- **Badge:** Uppercase micro typography (see Typography)

### Header (Sticky)

#### Title Heading Component
```tsx
<header className="sticky top-0 z-40 mb-6 bg-gradient-to-br from-[#0f1f46] via-[#142f6e] to-[#08132d] px-6 shadow-xl transition-all">
  {/* Decorative circles */}
  <div className="pointer-events-none absolute -left-12 -top-10 h-48 w-48 rounded-full border border-white/10"></div>

  <h1>Australian Financial Calculator</h1>
  <div>{/* Disclaimer badge */}</div>
  <button>{/* Theme toggle */}</button>
</header>
```

**Behavior:**
- **Sticky:** `sticky top-0`
- **Z-index:** `z-40` (above content, below modals)
- **Padding:** `py-6` → `py-3` when scrolled (condensed)
- **Decorative:** Absolute positioned circles for depth
- **Responsive:** Text size uses `clamp()`

---

## Patterns & Best Practices

### Dark Mode Implementation

#### Global Toggle
- **Location:** `TitleHeading.tsx` component
- **Storage:** `localStorage` key: `calc-theme`
- **Default:** System preference via `prefers-color-scheme`
- **Application:** Adds/removes `dark` class on `documentElement`

```tsx
// Reading preference
const getInitialDarkMode = () => {
  const stored = window.localStorage.getItem('calc-theme');
  if (stored === 'dark') return true;
  if (stored === 'light') return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

// Applying theme
document.documentElement.classList.toggle('dark', isDarkMode);
```

#### Component Dark Mode Pattern
```tsx
// Always pair light and dark variants
className="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-50"

// Borders
className="border-slate-200 dark:border-slate-800"

// Transparent backgrounds
className="bg-white/95 dark:bg-slate-900/95"
```

**Rule:** Every color class must have a dark mode variant (except white-on-dark header)

### Transition Classes

#### Standard Transition
```tsx
className="transition-colors"
```
- **Use for:** Background, text, border color changes
- **Duration:** Default (150ms)

#### Custom Transitions
```tsx
className="transition-all"  // All properties
className="transition-[max-height,opacity]"  // Specific properties
className="duration-300"  // 300ms duration
```

### Responsive Design

#### Mobile-First Approach
```tsx
// Base styles are mobile
className="px-4 py-2"

// Add responsive variants for larger screens
className="px-4 py-2 sm:px-6 sm:py-3"
```

#### Current Breakpoint Strategy
- **Mobile:** Default (0-640px)
- **Desktop:** Future implementation
- **Max Width:** 640px (`max-w-screen-sm`)

**Note:** App is currently mobile-only. Desktop responsive classes (`sm:`, `md:`, etc.) are present but not primary focus.

### Z-Index Scale

| Layer | z-index | Usage |
|-------|---------|-------|
| Base | `z-0` | Default content |
| Sticky Header | `z-40` | `TitleHeading` |
| Bottom Nav | `z-50` | `BottomNav` (highest) |
| Modals | `z-50+` | Future use |

**Rule:** Never use arbitrary z-index values. Use scale above.

### Shadow Scale

| Token | Value | Usage |
|-------|-------|-------|
| `shadow-sm` | subtle | Cards, buttons |
| `shadow` | default | Elevated elements |
| `shadow-xl` | dramatic | Header, modals |
| `shadow-inner` | inset | Glassmorphic cards |

---

## Components Library

### Reusable Components

#### BottomNav
- **File:** `src/components/BottomNav.tsx`
- **Props:** None (uses static config)
- **Usage:** Include once in `MainLayout.tsx`

#### TitleHeading
- **File:** `src/components/TitleHeading.tsx`
- **Props:** None
- **State:** Dark mode toggle, scroll-based condensing
- **Usage:** Include once in `MainLayout.tsx`

#### FeatureAccordion
- **File:** `src/components/FeatureAccordion.tsx`
- **Props:**
  - `items: FeatureAccordionItem[]` - Array of accordion items
  - `initialOpen?: number | null` - Default: `0`
- **Usage:** Page-level component for feature roadmaps

#### Icons
- **File:** `src/components/icons.tsx`
- **Available:** `HomeIcon`, `CalculatorIcon`, `PiggyBankIcon`, `UserIcon`, `InfoIcon`, `MoonIcon`, `SunIcon`
- **Props:** `className?: string`
- **Size:** Inherit from parent via `className="w-6 h-6"`

### Layout Components

#### MainLayout
- **File:** `src/layouts/MainLayout.tsx`
- **Purpose:** Wrapper for all pages
- **Features:**
  - Contains `TitleHeading`
  - Contains `BottomNav`
  - Centers content with `max-w-screen-sm`
  - Adds bottom padding for nav clearance

### Page Structure

#### Standard Page Template
```tsx
import React from 'react';
import { FeatureAccordion, FeatureAccordionItem } from '../components/FeatureAccordion';

const items: FeatureAccordionItem[] = [
  {
    badge: 'Category',
    title: 'Feature name',
    content: 'Feature description',
  },
];

export const MyPage: React.FC = () => {
  return (
    <div className="px-6 pb-32 pt-6">
      <FeatureAccordion items={items} />
    </div>
  );
};
```

**Required elements:**
1. Page container: `px-6 pb-32 pt-6`
2. Content (accordion, custom UI, etc.)

---

## Accessibility

### Color Contrast

#### WCAG AA Compliance
- **Normal text (16px):** Minimum 4.5:1 contrast ratio
- **Large text (18px+):** Minimum 3:1 contrast ratio
- **Interactive elements:** Minimum 3:1 against background

**Current palette meets AA standards:**
- ✅ `slate-900` on `white` (21:1)
- ✅ `slate-600` on `white` (7.6:1)
- ✅ `blue-600` on `white` (8.6:1)
- ✅ Dark mode: `white` on `slate-950` (21:1)

### Interactive Elements

#### Touch Targets
- **Minimum size:** 44×44px
- **Bottom nav buttons:** `h-16` (64px height)
- **Icon buttons:** 34px minimum (small), 56px preferred

#### Focus States
```tsx
// Always include focus styles
className="focus:ring-2 focus:ring-blue-500 focus:border-transparent"
```

**Future:** Define consistent focus ring pattern across all interactive elements

#### ARIA Labels
```tsx
// Theme toggle example
<button
  aria-pressed={isDarkMode}
  aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
>
```

**Requirement:** All icon-only buttons must have `aria-label`

### Keyboard Navigation

- ✅ Bottom nav supports keyboard navigation (React Router)
- ✅ Accordions are keyboard accessible (button elements)
- ⚠️ **TODO:** Add skip-to-content link
- ⚠️ **TODO:** Test full keyboard flow

---

## Mobile-First Guidelines

### Touch Interactions

#### Minimum Touch Targets
- **Buttons:** 44×44px minimum (iOS HIG)
- **Bottom nav:** 64px height (`h-16`)
- **Spacing:** 8px minimum between interactive elements

#### Gestures
- **Tap:** Primary interaction
- **Scroll:** Vertical only (no horizontal scroll)
- **Swipe:** Not implemented (future: swipe between pages)

### Viewport Optimization

#### Safe Areas
```tsx
// iOS notch/home indicator
className="safe-area-bottom"  // Custom utility (if needed)
```

**Currently handled by:** `pb-32` bottom padding on pages

#### Maximum Width
- **Constrain content:** `max-w-screen-sm` (640px)
- **Rationale:** Optimal reading width, prevents over-stretching on tablets

### Performance

#### Minimize Reflows
- Use `transition-colors` instead of `transition-all` when possible
- Prefer `transform` over layout properties for animations

#### Lazy Loading
- **Future:** Implement for calculator pages
- **Future:** Code-split routes

---

## File Organization

### Design Token Location

#### Tailwind Config
- **File:** `frontend/tailwind.config.js`
- **Current:** Minimal config, using Tailwind defaults
- **Future:** Extend with custom colors/spacing if needed

#### CSS Global Styles
- **File:** `frontend/src/styles.css`
- **Contents:**
  - Tailwind directives (`@tailwind`)
  - Custom input spinner hiding
  - Global transitions on `body`

```css
@layer base {
  body {
    @apply m-0 min-h-screen bg-slate-100 text-slate-900
           transition-colors duration-300
           dark:bg-slate-950 dark:text-slate-100;
  }
}
```

### Component-Specific Styles

**Rule:** No component-specific CSS files. All styling via Tailwind utility classes.

**Exception:** Input number spinner removal (browser default override)

---

## Design Checklist

When creating new components, ensure:

- [ ] Uses defined color palette (no arbitrary colors except header gradient)
- [ ] Includes dark mode variants for all colors
- [ ] Follows spacing scale (no arbitrary spacing)
- [ ] Matches border radius hierarchy (`rounded-2xl` for cards)
- [ ] Includes transitions for color changes
- [ ] Meets minimum touch target size (44px)
- [ ] Has focus states for interactive elements
- [ ] Uses semantic HTML (`button`, `nav`, `header`, etc.)
- [ ] Includes ARIA labels for icon-only elements
- [ ] Follows mobile-first responsive approach
- [ ] Uses consistent typography patterns (uppercase badges, etc.)

---

## Future Enhancements

### Planned Additions

1. **Component Library Expansion**
   - Form inputs (text, number, select)
   - Buttons (primary, secondary, ghost)
   - Modals/dialogs
   - Toast notifications
   - Loading states

2. **Design Tokens**
   - Extract spacing scale to config
   - Define semantic color names
   - Animation duration constants

3. **Desktop Responsive**
   - 2-column layouts
   - Sidebar navigation (replace bottom nav)
   - Larger touch targets for mouse

4. **Accessibility**
   - Skip-to-content link
   - Focus trap in modals
   - Keyboard shortcuts documentation
   - High contrast mode

5. **Performance**
   - Animation performance testing
   - Reduced motion support (`prefers-reduced-motion`)
   - Lazy loading strategies

---

## Version History

### v1.0.0 (2025-12-21)
- Initial design system documentation
- Established color palette and typography
- Defined component patterns
- Mobile-first guidelines
- Dark mode standards

---

## References

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [iOS Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [Material Design - Touch Targets](https://material.io/design/usability/accessibility.html#layout-and-typography)

---

**Maintained by:** Aaron Chakerian
**For questions:** Reference this document first, then PROJECT_REFERENCE.md
