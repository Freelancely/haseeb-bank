# Haseeb Bank Intelligence · Frontend Pilot

Financial intelligence platform embedded within Kuwait International Bank.  
Built with **React 18 + TypeScript + Zustand + React Router**.

---

## Project Structure

```
src/
├── components/
│   ├── common/          # Reusable UI primitives (Badge, Button, Toast, Skeleton)
│   ├── layout/          # App shell (Sidebar, PageHeader)
│   └── transactions/    # Domain-specific components (TransactionRow, CategorySelector, etc.)
│
├── constants/           # Design tokens, status configs, default categories
├── hooks/               # Custom hooks (useTransactions, useRules)
├── pages/               # Route-level page components
├── services/            # API layer (mock + real, swap via env var)
│   ├── apiClient.ts     # Base HTTP client
│   ├── transactionService.ts
│   ├── rulesService.ts
│   ├── dashboardService.ts
│   └── mockData.ts      # Seed data for mock mode
├── store/               # Zustand global state
├── styles/              # Global CSS variables and base styles
├── types/               # TypeScript interfaces and type definitions
└── utils/               # Formatting helpers
```

---

## Getting Started

```bash
npm install
npm run dev
```

The app runs at `http://localhost:5173` in **mock mode** by default.

---

## Environment Variables

Copy `.env.example` → `.env.local` and configure:

| Variable | Default | Description |
|---|---|---|
| `VITE_API_BASE_URL` | `/api/v1` | Backend API base URL |
| `VITE_USE_MOCK` | `true` | `false` to use real API |

---

## Switching to Real Backend

1. Set `VITE_USE_MOCK=false` in `.env.local`
2. Set `VITE_API_BASE_URL=https://your-api.kib.com.kw/api/v1`
3. Add auth token logic in `src/services/apiClient.ts` (see the commented `Authorization` header)

### Expected API Endpoints

| Method | Path | Description |
|---|---|---|
| `GET` | `/transactions` | List transactions (query params: status, search, sortField, sortDirection) |
| `GET` | `/transactions/:id` | Get single transaction |
| `PATCH` | `/transactions/:id/categorize` | Categorize a transaction |
| `POST` | `/transactions/bulk-categorize` | Bulk categorize |
| `POST` | `/transactions/:id/revert` | Revert to previous state |
| `GET` | `/rules` | List rules |
| `POST` | `/rules` | Create rule |
| `PATCH` | `/rules/:id` | Update rule |
| `DELETE` | `/rules/:id` | Delete rule |
| `GET` | `/dashboard/stats` | Dashboard statistics |

All endpoints should return `ApiResponse<T>` shape: `{ data: T, success: boolean, timestamp: string }`.

---

## Features

- **Transaction Feed** — filterable by status, searchable, sortable
- **Bulk Categorization** — detect repeated merchants, apply category to all at once
- **Detail View** — full transaction card, category selector, audit trail
- **Rule Registry** — auto-apply or ask-per-transaction rules
- **Smart Suggestions** — engine confidence scores with visual indicators
- **Undo** — 5-second window to revert any categorization
- **Recurring Pattern Detection** — prompts rule creation after 3+ same-merchant transactions
- **Custom Categories** — add new categories inline

---

## Tech Stack

| Library | Version | Purpose |
|---|---|---|
| React | 18.2 | UI framework |
| TypeScript | 5.3 | Type safety |
| React Router | 6.22 | Client-side routing |
| Zustand | 4.5 | Global state management |
| Vite | 5.1 | Build tool / dev server |
| Lucide React | 0.316 | Icons |
| date-fns | 3.3 | Date utilities |

---

## Design System

- **Fonts**: Syne (display) + Instrument Sans (body) + IBM Plex Mono (code/data)
- **Theme**: Warm off-white `#F5F4F0` background, dark `#0D0F0E` sidebar
- **Semantic colors**: Red (review), Amber (suggested), Green (auto), Blue (manual)
- **All values** via CSS custom properties in `src/styles/globals.css`
