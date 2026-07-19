# Task 5 – User Dashboard Component

## File Created
- `/home/z/my-project/src/components/dashboard/user-dashboard.tsx`

## Summary

A comprehensive `'use client'` React component (`UserDashboard`) providing the full user dashboard experience with 4 tabs:

### Tab 1: My Projects
- Responsive grid (1/2/3 cols) of project cards belonging to `currentUser`
- Each card: thumbnail/icon header, status badge (color-coded for active/sold/paused/draft), name, category, offer count, date, price, revenue
- Clickable cards navigate via `goToProject()`
- Action bar per card: View, Edit, Delete
- Empty state with "List Your First Project" CTA → navigates to `create` view

### Tab 2: My Offers
- List layout of offers made by the current user (fetched from `/api/offers?buyerId=`)
- Each offer shows: project name, category, date, amount, status badge with icon (pending/accepted/rejected/withdrawn)
- Clickable to navigate to project detail
- Empty state with "Browse Projects" CTA

### Tab 3: Favorites
- Responsive grid of favorited projects (fetched from `/api/favorites?userId=`)
- Cards feature a filled heart icon overlay and rose-tinted header
- Empty state with "Start Exploring" CTA

### Tab 4: Valuation Tool
- Full AI valuation form with sections: Basic Info (name, category select, industry, country select, business stage select), Financial Metrics (annual/monthly revenue, net profit, EBITDA, total investment), Business Metrics (visitors, users, customers, subscribers, tech stack, competitive advantage textarea, growth opportunity textarea)
- POSTs to `/api/projects/valuation`
- Results displayed in beautiful cards: large estimated value, 4-column price breakdown (recommended, investor, wholesale, acquisition), confidence score with Progress bar, valuation details text, key factors as rounded badges
- Loading skeleton state, error state with retry

### General
- **Quick Stats Row**: 4 stat cards (My Projects count, Active Offers, Favorites, Total Portfolio Value) with color-coded icons
- **Sign-in Prompt**: Full centered prompt with icon when `currentUser` is null
- **Delete Dialog**: AlertDialog confirmation with loading state
- **Animations**: Framer Motion staggered container + item variants, card hover scale, AnimatePresence for tab content
- **Responsive**: Mobile-first, single column → multi-column grids, abbreviated tab labels on mobile
- **No blue/indigo** colors used (emerald, amber, rose, violet, red palette)