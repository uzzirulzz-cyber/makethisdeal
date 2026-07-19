# Task 3 — Landing Page Components

**Status:** ✅ Complete  
**Files Created:** 6  

## Files

| # | File | Description |
|---|------|-------------|
| 1 | `src/components/landing/hero-section.tsx` | Hero with gradient heading, subheading, 2 CTA buttons, animated stats bar, dot-pattern overlay, decorative gradient orbs, framer-motion stagger entrance |
| 2 | `src/components/landing/stats-section.tsx` | 4 stat cards (from `STATS` constant) in 2×2 / 4-col responsive grid, motion `whileInView` entrance |
| 3 | `src/components/landing/categories-section.tsx` | 18 category cards (from `CATEGORIES` + `CATEGORY_ICONS`) in 2/3/4/6-col responsive grid, click sets `searchFilters.category` and navigates to `browse` |
| 4 | `src/components/landing/featured-section.tsx` | Fetches `/api/projects?limit=6&sortBy=revenue_high`, displays 6 project cards with gradient thumbnail, category badge, country, price, revenue, ROI, seller info; loading skeletons; uses `renderCategoryIcon()` to avoid ESLint static-components error |
| 5 | `src/components/landing/how-it-works-section.tsx` | 4-step process (Create Account → List/Browse → Connect & Negotiate → Close the Deal) with numbered badges, icons, descriptions, connector arrows (vertical mobile, horizontal desktop) |
| 6 | `src/components/landing/cta-section.tsx` | "Ready to Make a Deal?" heading with subtext, 2 buttons (Get Started Free, Contact Sales), `bg-primary/5` background, motion entrance |

## Key Decisions
- **Emerald/green theme** throughout — no blue/indigo used
- All components are `'use client'` with TypeScript
- Used shadcn/ui `Button`, `Badge`, `Card`, `CardContent`, `Skeleton`
- `framer-motion` for all entrance animations (stagger variants, `whileInView`)
- Responsive: mobile-first with `sm:`, `md:`, `lg:`, `xl:` breakpoints
- `formatCurrency()` helper with $, M, K suffixes
- `renderCategoryIcon()` returns JSX directly (not a component reference) to satisfy the `react-hooks/static-components` ESLint rule
- Hero uses the existing `hero-gradient` and `gradient-text` CSS classes
- Store integration: `setCurrentView`, `goToProject`, `setSearchFilters` all properly wired

## Lint
All 6 files pass `eslint` with zero errors/warnings. Dev server compiles successfully.