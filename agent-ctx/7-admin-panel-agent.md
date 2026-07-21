---
Task ID: 7
Agent: Admin Panel Agent
Task: Build admin panel component

Work Log:
- Read worklog.md, types.ts, use-app-store.ts, use-currency.ts for project context
- Read existing API routes: /api/orders, /api/payment/list, /api/payment/verify, /api/payment-methods
- Created `/src/components/admin/admin-panel.tsx` (~570 lines)
- Updated `/src/app/page.tsx` — wired AdminPanel into SPA router, hidden header/footer on admin view
- Ran `bun run lint` — zero new errors

Stage Summary:
- Admin panel with auth gate, Orders tab (stats + expandable table), Payments tab (filterable cards + confirm/reject), Gateways tab (read-only method cards)
- All F5 Studio themed, responsive, framer-motion animations, sonner toasts