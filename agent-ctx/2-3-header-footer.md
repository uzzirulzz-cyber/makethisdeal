# Task 2-3: Update Header and Footer to F5 Studio Theme

## Agent: Style Updater

## Work Done:

### Header (`src/components/layout/header.tsx`)
- Replaced transparent/glass classes with `.f5-navbar` (default) and `.f5-glass` (scrolled state)
- Logo "MTD" box: violet bg (#8A2BE2) with white text
- "This" in logo: violet (#8A2BE2) text
- Main text color: #333333, muted text: #6B7280
- Active nav items: solid violet (#8A2BE2) bg with white text
- Inactive nav items: #6B7280, hover to violet with subtle violet bg
- Search bar: #F0F0F0 border, #F9FAFB bg, focus ring in violet
- Sign In button: uses `.f5-btn-primary` class (violet solid)
- Mobile sheet: white background (#FFFFFF) with #F0F0F0 left border
- Mobile nav items: same active/inactive pattern as desktop
- User avatar pill: violet tinted bg, violet avatar circle
- All hover states use inline style handlers for precise color control
- Removed unused imports (Link, ArrowRight, ChevronDown, User, motion/AnimatePresence)

### Footer (`src/components/layout/footer.tsx`)
- Applied `.f5-footer` class (dark navy #0A1128 bg)
- "MTD" logo box: violet (#8A2BE2) bg with white text
- "This" in logo: violet (#A855F7)
- Description text: #A8B2D1 muted
- Column headings: white (#FFFFFF)
- Email icon: violet bg circle (rgba(138,43,226,0.2)) with violet icon
- WhatsApp icon: emerald bg circle (rgba(16,185,129,0.2)) with green (#34D399) icon
- Location icon: subtle white/8% bg circle with gray icon
- Social icons: white/8% bg, hover to violet (#A855F7) with violet tinted bg
- All links: #A8B2D1, hover to #A855F7 (violet)
- Bottom bar border: #1A2342
- Bottom bar email: #A8B2D1, hover violet
- Bottom bar WhatsApp: #34D399 (green), hover #6EE7B7
- Copyright: #A8B2D1
- Contact info preserved: playbeatdigital@proton.me, +923318333368, Karachi Pakistan
- All link columns and click handlers preserved
- Removed unused Phone import

## Verification:
- ESLint: clean (no errors or warnings)
- Dev server: compiled successfully, no errors in log
