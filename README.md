# DispatchOS

**Real-Time Logistics & Delivery Operations Dashboard**

DispatchOS is a production-style logistics management platform built for delivery companies. It gives operations managers a single interface to monitor active deliveries, track drivers in real time, manage orders and customers, and understand performance through analytics — all without refreshing the page.

---

## Table of Contents

1. [Project Aim & Objectives](#1-project-aim--objectives)
2. [Live Demo](#2-live-demo)
3. [Tech Stack](#3-tech-stack)
4. [Features](#4-features)
5. [How the Application Works](#5-how-the-application-works)
6. [Project Structure](#6-project-structure)
7. [Data Model](#7-data-model)
8. [State Management Architecture](#8-state-management-architecture)
9. [Real-Time Simulation](#9-real-time-simulation)
10. [Routing & Authentication](#10-routing--authentication)
11. [Design System](#11-design-system)
12. [Getting Started](#12-getting-started)
13. [Available Scripts](#13-available-scripts)
14. [Environment Variables](#14-environment-variables)
15. [Demo Credentials](#15-demo-credentials)
16. [Pages & What They Do](#16-pages--what-they-do)

---

## 1. Project Aim & Objectives

### The Problem

Delivery companies need a command centre — a place where an operations manager can see, at a glance, what is happening across every order, driver, and delivery in real time. Spreadsheets and disconnected tools cause delays, missed orders, and poor driver utilisation.

### What DispatchOS Solves

DispatchOS gives the operations team:

- **Instant situational awareness** — a live dashboard showing KPIs, active deliveries, and a real-time activity feed.
- **Order management** — a searchable, filterable, sortable table of all 130+ orders with URL-synced state so views can be bookmarked and shared.
- **Driver oversight** — status, ratings, completion rates, and individual delivery history for every driver in the fleet.
- **Live map** — simulated GPS positions of all 30 drivers across Nigeria, updating every 4 seconds with driver info panels on click.
- **Analytics** — date-range-selectable revenue charts, order volume, status breakdown, and driver performance metrics.
- **Notifications** — a live notification centre that receives new events every 15 seconds, with expandable messages, read/unread toggle, and toast pop-ups.

### Portfolio Objectives

This project demonstrates a complete range of frontend engineering skills:

| Skill | How it is demonstrated |
|---|---|
| React + TypeScript | Every component is typed; no `any` |
| Next.js App Router | File-based routing, route groups, dynamic segments |
| State management | Zustand for client state, TanStack Query ready for server state |
| Data visualisation | Recharts area, bar, and pie charts |
| Real-time UI | Simulated live updates via `setInterval` hooks |
| URL state | Filters, sorting, and pagination sync to the URL |
| Responsive design | Dedicated mobile bottom nav; tables become scrollable on small screens |
| Accessibility | `aria-*` attributes, keyboard navigation, focus management |
| Design system | CSS custom properties for every token; full dark mode |
| Component architecture | Reusable primitives with clear APIs |

---

## 2. Live Demo

```
Email:    demo@dispatchos.app
Password: DemoPassword123!
```

Click **"Fill in demo credentials"** on the login page for one-click access.

---

## 3. Tech Stack

| Category | Technology | Version | Why |
|---|---|---|---|
| Framework | Next.js | 16.3 | App Router, SSR, file-based routing |
| Language | TypeScript | 5 | Type safety across the entire codebase |
| Styling | Tailwind CSS | 4 | Utility-first; pairs cleanly with CSS variables |
| Client state | Zustand | 5 | Lightweight; no boilerplate; persists to localStorage |
| Server state | TanStack Query | 5 | Ready for real API integration; caching and staleness built in |
| Forms | React Hook Form | 7 | Performant, uncontrolled form handling |
| Validation | Zod | 3 | Runtime schema validation; pairs with React Hook Form |
| Charts | Recharts | 3 | Composable chart primitives built on D3 |
| Icons | Lucide React | 0.525 | Consistent, accessible SVG icons |
| Drag & Drop | dnd-kit | 6/8 | Modern, accessible drag-and-drop |
| Runtime | Node.js | ≥ 18 | Required by Next.js 16 |

---

## 4. Features

### Core Features

- **Authentication** — login/logout with demo credentials, session persisted to `localStorage` via Zustand
- **Protected routes** — unauthenticated users are redirected to `/login` with a hydration-safe guard
- **Dark mode** — full CSS variable token system; toggled via settings or topbar; persisted across sessions
- **Command palette** — `Cmd+K` / `Ctrl+K` opens a global search and action palette with keyboard navigation

### Dashboard

- 4 KPI cards: Total Revenue, Total Orders, Active Deliveries, Completed Today
- Active Deliveries count updates automatically every 8 seconds to simulate real-time changes
- Revenue area chart (last 14 days)
- Delivery status donut chart
- Recent orders table (7 most recent, links to detail pages)
- Live activity feed that prepends a new event every 12 seconds

### Orders

- Full data table with 130 seeded Nigerian orders
- Search by order ID, customer name, driver name, or city
- Filter by status (7 states) and priority (4 levels)
- Sort by date, amount, status, or customer name (ascending/descending)
- Pagination — 20 orders per page with page number buttons
- All filters, sort, and page are **synced to the URL** — bookmarkable and shareable
- Individual order detail page with customer card, driver card, route map, timing info, and visual delivery timeline

### Drivers

- Grid of all 30 drivers with status badge, rating, vehicle, and city
- Filter chips: Available / Busy / On Break / Offline
- Live-count stat row at the top
- Individual driver detail: profile, completion rate progress bar, performance stats, recent deliveries table

### Customers

- Searchable table of 40 customers with phone, city, order count, total spent
- Individual customer detail: profile, stats, full order history

### Live Map

- Custom SVG map grid representing Nigeria's geographic bounds
- 30 driver markers colour-coded by status (green = available, blue = busy, amber = on break, grey = offline)
- Markers animate to new positions every 4 seconds
- Click any marker to open an info panel: driver name, status, vehicle, rating, city, current order
- Status filter chips to show/hide driver categories
- Scrollable driver list below the map

### Analytics

- Date range selector: 7 days / 14 days / 30 days
- Summary KPI row: total revenue, total orders, daily averages
- Revenue trend area chart
- Daily orders bar chart
- Delivery status distribution pie chart
- Top driver performance horizontal bar chart
- Driver performance detail table with on-time rate progress bars

### Notifications

- Live notification centre receiving a new event every 15 seconds
- Unread count badge in sidebar nav and topbar bell, updated in real time
- Click any row to expand it and read the full message — auto-marks as read on open
- "Mark as unread" / "Mark as read" toggle inside the expanded row
- "Mark all read" button
- Filter tabs: All (N) / Unread (N)
- Toast pop-ups appear in the bottom-right corner when each notification arrives
- `aria-live="polite"` for screen reader announcements

### Settings

- Theme picker: Light / Dark / System
- Notification toggles (UI)
- Security section placeholders
- Sign out

---

## 5. How the Application Works

### Boot Sequence

1. Browser loads `/` → Next.js redirects to `/dashboard`
2. `DashboardLayout` mounts and waits one tick for Zustand's `persist` middleware to rehydrate `isAuthenticated` from `localStorage`
3. If unauthenticated → redirect to `/login`
4. If authenticated → shell renders: Sidebar + Topbar + main content area + MobileNav
5. `useRealtimeNotifications` hook starts its 15-second interval
6. `ThemeApplier` component reads `theme` from the store and adds/removes the `.dark` class on `<html>`

### Page Navigation

Navigation uses Next.js `<Link>` components for client-side transitions — no full page reloads. The sidebar highlights the active route using `usePathname()`. On mobile, a bottom navigation bar replaces the sidebar for the five most-used destinations.

### Data Flow

```
Mock data files (mocks/)
       │
       ▼
Zustand store (stores/app-store.ts)   ◄── useRealtimeNotifications hook
       │                                         │
       ▼                                         ▼
Page components read from store         New notifications prepended
       │                                New toasts fired
       ▼
UI updates re-render automatically
via Zustand subscriptions
```

Because all notification state lives in the Zustand store (not in component state), every subscriber — the sidebar badge, the topbar bell, the notifications page — updates simultaneously whenever a new event arrives or a notification is read/unread.

### URL-Synced Filters (Orders page)

The Orders table reads every filter from `useSearchParams()` and writes back using `router.push()`:

```
/orders?q=adebayo&status=in_transit&sort=amount&dir=desc&page=2
```

This means:
- Refreshing the page restores the exact same view
- The URL can be copied and sent to a colleague
- The browser back button works correctly

### Authentication Guard

```
DashboardLayout
  ├── useState(hydrated = false)
  ├── useEffect: setHydrated(true)   ← waits one render cycle for localStorage
  ├── useEffect: if hydrated && !isAuthenticated → router.replace('/login')
  └── if !hydrated || !isAuthenticated → <Spinner />
```

This two-phase guard prevents the flash-to-login bug that occurs when `isAuthenticated` is `false` on the first server render before the client store hydrates.

---

## 6. Project Structure

```
dispatch-os/
│
├── app/                          # Next.js App Router
│   ├── (auth)/
│   │   └── login/page.tsx        # Login page
│   ├── (dashboard)/
│   │   ├── layout.tsx            # Wraps every dashboard route in DashboardLayout
│   │   ├── dashboard/page.tsx    # Main dashboard
│   │   ├── orders/
│   │   │   ├── page.tsx          # Orders table
│   │   │   └── [orderId]/page.tsx# Order detail
│   │   ├── drivers/
│   │   │   ├── page.tsx          # Driver grid
│   │   │   └── [driverId]/page.tsx
│   │   ├── customers/
│   │   │   ├── page.tsx
│   │   │   └── [customerId]/page.tsx
│   │   ├── live-map/page.tsx
│   │   ├── analytics/page.tsx
│   │   ├── notifications/page.tsx
│   │   └── settings/page.tsx
│   ├── layout.tsx                # Root layout — wraps html/body, mounts Providers
│   ├── page.tsx                  # Redirects / → /dashboard
│   └── globals.css               # Design tokens + base styles
│
├── components/
│   ├── ui/                       # Reusable primitives
│   │   ├── button.tsx
│   │   ├── badge.tsx
│   │   ├── card.tsx
│   │   ├── avatar.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── skeleton.tsx
│   │   └── spinner.tsx
│   ├── feedback/
│   │   ├── empty-state.tsx
│   │   ├── error-state.tsx
│   │   └── toast.tsx             # Toast container (reads from store)
│   ├── command-palette.tsx       # Cmd+K global search & actions
│   └── providers.tsx             # QueryClient + ThemeApplier
│
├── features/                     # Page-specific components
│   └── dashboard/
│       ├── kpi-card.tsx
│       ├── revenue-chart.tsx
│       ├── status-chart.tsx
│       ├── activity-feed.tsx
│       └── recent-orders.tsx
│
├── layouts/
│   ├── dashboard-layout.tsx      # Auth guard + shell wrapper
│   ├── sidebar.tsx
│   ├── topbar.tsx
│   └── mobile-nav.tsx
│
├── hooks/
│   └── use-realtime-notifications.ts  # 15s interval notification generator
│
├── stores/
│   └── app-store.ts              # Single Zustand store for all client state
│
├── mocks/                        # Seeded Nigerian logistics data
│   ├── drivers.ts                # 30 drivers
│   ├── customers.ts              # 40 customers
│   ├── orders.ts                 # 130 orders (deterministically generated)
│   ├── notifications.ts          # 15 seed notifications
│   ├── activity.ts               # 20 activity feed items
│   ├── analytics.ts              # Revenue data, KPIs, driver performance
│   └── index.ts                  # Barrel export
│
├── types/
│   └── index.ts                  # All TypeScript interfaces
│
└── lib/
    ├── constants/index.ts        # Status labels, colours, nav items
    └── utils/
        ├── cn.ts                 # Class name utility
        └── format.ts             # formatNaira, formatDate, formatRelativeTime
```

---

## 7. Data Model

All data is seeded in `mocks/` and typed in `types/index.ts`. There is no backend — all reads are synchronous from in-memory arrays.

### Order

```ts
{
  id: string               // e.g. "ND-10042"
  customerId: string
  customerName: string
  driverId?: string
  driverName?: string
  pickupAddress: string
  deliveryAddress: string
  pickupCity: string
  deliveryCity: string
  pickupCoordinates: { lat, lng }
  deliveryCoordinates: { lat, lng }
  amount: number           // in Naira
  status: "pending" | "assigned" | "picked_up" | "in_transit" | "delivered" | "cancelled" | "failed"
  priority: "low" | "normal" | "high" | "urgent"
  createdAt: string        // ISO 8601
  updatedAt: string
  estimatedDeliveryTime?: string
  actualDeliveryTime?: string
  notes?: string
}
```

### Driver

```ts
{
  id: string
  name: string
  phone: string
  email: string
  status: "available" | "busy" | "offline" | "on_break"
  vehicleType: "motorcycle" | "car" | "van" | "truck"
  vehicleNumber: string    // e.g. "LAG-341-EK"
  rating: number           // 4.3 – 4.9
  totalDeliveries: number
  completedDeliveries: number
  cancelledDeliveries: number
  currentLocation: { lat, lng }
  city: string
  createdAt: string
}
```

### Customer

```ts
{
  id: string
  name: string             // e.g. "Adebayo Stores"
  phone: string
  email: string
  address: string
  city: string
  state: string
  totalOrders: number
  totalSpent: number       // in Naira
  createdAt: string
}
```

### Notification

```ts
{
  id: string
  type: "new_order" | "delivery_completed" | "delivery_delayed" | "driver_unavailable" | "system_update" | "driver_assigned"
  title: string
  message: string
  read: boolean
  createdAt: string
  orderId?: string
  driverId?: string
}
```

### Mock Data Generation

The 130 orders in `mocks/orders.ts` are generated programmatically using a seeded deterministic random function (`Math.sin(seed * n)`). This means the data is consistent across every run — the same order always has the same customer, driver, cities, amount, and status — while still being varied enough to properly test pagination, filters, and charts.

Nigerian cities used: Lagos, Abuja, Ibadan, Kano, Port Harcourt, Benin City, Akure, Enugu, Aba, Kaduna, Warri, Onitsha, Calabar, Owerri.

---

## 8. State Management Architecture

### What lives where

| State | Location | Reason |
|---|---|---|
| Auth (isAuthenticated, user) | Zustand — persisted | Needs to survive page refresh |
| Theme | Zustand — persisted | User preference |
| Sidebar open/closed | Zustand — persisted | UI preference |
| Notifications list | Zustand — not persisted | Regenerated fresh each session from mock data |
| Unread count | Zustand — not persisted | Derived from notifications list |
| Toasts | Zustand — not persisted | Transient, no need to survive refresh |
| Command palette open | Zustand — not persisted | Pure UI toggle |
| Orders filter/sort/page | URL search params | Bookmarkable, shareable |
| Expanded notification row | Local useState | Local UI state, no global concern |
| Active driver on map | Local useState | Page-scoped interaction |
| Analytics date range | Local useState | Page-scoped preference |

### Why not put everything in Zustand

Zustand is used only for state that genuinely needs to cross component boundaries (notifications count updating the sidebar badge) or survive navigation (theme, auth). Page-scoped interactions stay in local `useState`. URL params handle anything that should be shareable or survive a browser refresh.

### The Zustand store (`stores/app-store.ts`)

The single store is created with the `persist` middleware. Only `theme`, `sidebarOpen`, `isAuthenticated`, and `user` are written to `localStorage` — transient state like notifications, toasts, and UI toggles is excluded from persistence.

```ts
useAppStore.getState().addNotification(n)   // programmatic access
useAppStore((s) => s.unreadCount)           // selector in a component
```

---

## 9. Real-Time Simulation

DispatchOS simulates a live backend using three independent intervals:

### 1. Dashboard KPI — Active Deliveries (`dashboard/page.tsx`)

```
Every 8 seconds → active delivery count changes by -1, 0, or +1
```

The number visibly ticks up and down in the KPI card, demonstrating real-time data updates without a polling API.

### 2. Activity Feed (`features/dashboard/activity-feed.tsx`)

```
Every 12 seconds → a new activity item is prepended to the feed
```

Events like "Adaeze Nwosu completed delivery of ND-10044" appear at the top of the live feed card, and the newest item is highlighted with a background colour for one render cycle.

### 3. Notification Generator (`hooks/use-realtime-notifications.ts`)

```
Every 15 seconds → a new Notification object is created and dispatched
```

This hook is mounted once in `DashboardLayout` so it runs regardless of which page you are on. Each cycle:

1. Takes the next event from a rotating list of 10 realistic events
2. Calls `addNotification(n)` on the Zustand store
3. The store prepends the notification and increments `unreadCount`
4. Every subscriber re-renders: sidebar badge, topbar bell counter, notifications page list
5. Calls `addToast(...)` which appends a toast to the store
6. The `ToastContainer` component in the layout renders the toast with a 4-second auto-dismiss

### 4. Live Map Driver Positions (`live-map/page.tsx`)

```
Every 4 seconds → all non-offline driver lat/lng values nudge by ±0.015 degrees
```

Markers smoothly transition to new positions using CSS `transition-all duration-700`.

---

## 10. Routing & Authentication

### Route Groups

Next.js route groups (folders in parentheses) are used to apply different layouts to different sections without adding path segments to the URL:

```
app/
├── (auth)/login          → URL: /login       uses no shell
└── (dashboard)/          → URL: /dashboard   uses DashboardLayout
    ├── dashboard
    ├── orders
    ├── orders/[orderId]
    ├── drivers
    ├── drivers/[driverId]
    ├── customers
    ├── customers/[customerId]
    ├── live-map
    ├── analytics
    ├── notifications
    └── settings
```

### Authentication Flow

```
User visits /dashboard
      ↓
DashboardLayout renders with hydrated=false
      ↓
useEffect fires → setHydrated(true)
      ↓
Zustand store reads localStorage → isAuthenticated = true/false
      ↓
If false → router.replace('/login')
If true  → render the full dashboard shell
```

**Login flow:**

1. User enters `demo@dispatchos.app` / `DemoPassword123!`
2. 600ms simulated network delay
3. `login(email)` is called on the store → sets `isAuthenticated: true`, stores user object
4. `router.replace('/dashboard')` navigates into the app

**Logout:**

Available from the user menu in the topbar or the Settings page. Calls `logout()` on the store (clears `isAuthenticated` and `user`) then redirects to `/login`.

---

## 11. Design System

The entire visual language is defined as CSS custom properties in `app/globals.css`. No colour is hard-coded in a component — every component reads from these tokens.

### Colour Tokens

```css
/* Surfaces */
--background      /* page background */
--surface         /* card/panel background */
--foreground      /* primary text */
--muted           /* secondary text */
--muted-bg        /* subtle fills */
--border          /* dividers and outlines */

/* Brand */
--primary         /* blue — actions, links, active states */
--primary-hover
--primary-muted   /* light blue background for highlights */

/* Semantic */
--success / --success-bg / --success-text
--warning / --warning-bg / --warning-text
--danger  / --danger-bg  / --danger-text
--info    / --info-bg    / --info-text
```

Adding `.dark` to `<html>` overrides all tokens to dark-mode values. No component needs to know whether dark mode is active.

### Dark Mode Mechanism

```
useAppStore().theme  →  ThemeApplier component
                              ↓
                   document.documentElement.classList
                   .add('dark') / .remove('dark')
                              ↓
                   CSS :root becomes .dark overrides
                              ↓
                   All CSS variables update globally
                              ↓
                   Every component re-paints correctly
```

The `ThemeApplier` also listens to `prefers-color-scheme` media query changes when theme is set to `"system"`.

### Component API Pattern

Every UI primitive follows the same pattern: sensible defaults, explicit variants, no boolean-prop explosion.

```tsx
<Button variant="primary" size="md" loading={isPending}>
  Assign Driver
</Button>

<Badge variant="success" dot>
  Delivered
</Badge>

<Input
  label="Search orders"
  leftIcon={<Search size={14} />}
  placeholder="Order ID, customer…"
  value={q}
  onChange={(e) => setQ(e.target.value)}
/>
```

---

## 12. Getting Started

### Prerequisites

- **Node.js** 18 or higher
- **npm** 9 or higher (comes with Node.js)

Check your versions:

```bash
node --version   # should print v18.x.x or higher
npm --version    # should print 9.x.x or higher
```

### Installation

**Step 1 — Clone the repository**

```bash
git clone https://github.com/your-username/dispatch-os.git
cd dispatch-os
```

**Step 2 — Install dependencies**

```bash
npm install
```

This installs all packages listed in `package.json` including Next.js, React, Zustand, Recharts, Lucide React, TanStack Query, and all development tools.

**Step 3 — Start the development server**

```bash
npm run dev
```

Next.js will print something like:

```
▲ Next.js 16.3.0 (Turbopack)
- Local: http://localhost:3000
- Ready in 1.2s
```

**Step 4 — Open the app**

Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

You will be redirected to `/login`. Use the demo credentials or click **"Fill in demo credentials"**.

---

## 13. Available Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Starts the development server on port 3000 with hot-reload (Turbopack) |
| `npm run build` | Creates an optimised production build in `.next/` |
| `npm run start` | Runs the production build (requires `npm run build` first) |
| `npm run lint` | Runs ESLint across the codebase |

### Running in production mode

```bash
npm run build   # compile
npm run start   # serve on http://localhost:3000
```

---

## 14. Environment Variables

DispatchOS currently runs entirely on seeded mock data and requires no environment variables to function out of the box.

When you are ready to connect to a real backend (Supabase is recommended), create a `.env.local` file in the project root:

```bash
# .env.local  —  never commit this file
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_MAPBOX_TOKEN=pk.your-mapbox-public-token
```

A `.env.example` template with empty values should be committed to the repository:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_MAPBOX_TOKEN=
```

> Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser bundle. Never put secret or service-role keys in client-side code.

---

## 15. Demo Credentials

```
Email:    demo@dispatchos.app
Password: DemoPassword123!
```

These credentials are validated client-side only. There is no real server or database — this is a frontend demonstration project. Authentication state is stored in `localStorage` via Zustand's `persist` middleware.

---

## 16. Pages & What They Do

### `/login`

The entry point for unauthenticated users. Renders a centred card with email and password fields. Validates that both fields are non-empty before attempting auth. If credentials do not match the demo values, an inline error message explains the failure clearly rather than showing a raw error code. A demo credentials box below the card lets recruiters fill in the correct values with one click.

**Key files:** `app/(auth)/login/page.tsx`

---

### `/dashboard`

The first page an authenticated user sees. Designed to answer the question: *"What is happening right now?"*

- **KPI row** — four metric cards each showing a current value, a trend percentage, and a comparison label. The "Active Deliveries" count increments and decrements automatically every 8 seconds.
- **Revenue chart** — an area chart of the last 14 days of daily revenue, formatted in Naira.
- **Status chart** — a donut chart breaking down all orders by their current status.
- **Recent orders table** — the 7 most recently created orders with clickable order IDs linking to detail pages.
- **Live activity feed** — a scrollable list of driver and delivery events. A new event is prepended every 12 seconds, highlighted briefly, then fades into the list.

**Key files:** `app/(dashboard)/dashboard/page.tsx`, `features/dashboard/`

---

### `/orders`

A full-featured data management table for all 130 orders.

- **Search** — searches across order ID, customer name, driver name, and destination city simultaneously.
- **Status filter** — dropdown with all 7 order states.
- **Priority filter** — dropdown with all 4 priority levels.
- **Column sorting** — click any sortable column header to sort ascending; click again for descending. An icon indicates which column is active.
- **Pagination** — 20 rows per page. Page numbers are rendered as buttons, with previous/next controls disabled at the boundaries.
- **URL state** — every filter, sort key, sort direction, and page number is written into the URL query string. The page is fully bookmarkable and shareable.
- **Clear filters** button appears when any filter is active.
- **Results count** updates to reflect filtered results.

**Key files:** `app/(dashboard)/orders/page.tsx`, `features/orders/orders-table.tsx`

---

### `/orders/[orderId]`

The detail view for a single order, rendered as a server component that reads `params.orderId` from the URL.

- **Header** — order ID in monospace, status badge, priority badge, amount.
- **Customer card** — name, phone, email, address. Links to the customer's profile.
- **Driver card** — name, phone, vehicle type and number, star rating. Links to the driver's profile. Shows a placeholder when no driver is assigned.
- **Route card** — visual pickup → delivery route with address lines and city indicators.
- **Timing card** — created at, updated at, estimated delivery, actual delivery (if completed), and any order notes.
- **Delivery timeline** — a vertical stepper showing all 5 stages (Created → Assigned → Picked Up → In Transit → Delivered). Completed steps are filled in blue; the current step is highlighted; future steps are greyed. Cancelled and failed orders show a dedicated banner instead.

**Key files:** `app/(dashboard)/orders/[orderId]/page.tsx`

---

### `/drivers`

An overview of the full driver fleet.

- **Stats row** — four counters (Available, Busy, On Break, Offline) as mini cards at the top.
- **Search** — filters by driver name or city.
- **Status filter chips** — pill buttons that filter the grid by driver status. Each chip shows its live count.
- **Driver grid** — responsive card grid (1 col mobile, 2 col tablet, 3 col desktop). Each card shows avatar, name, city, status badge, completed deliveries, rating, vehicle type, vehicle number, and phone.
- Clicking a card navigates to the driver detail page.

**Key files:** `app/(dashboard)/drivers/page.tsx`

---

### `/drivers/[driverId]`

The individual driver profile.

- **Profile header** — avatar, name, status badge, contact details, vehicle info.
- **Stats row** — Total Deliveries, Completed, Cancelled, Rating.
- **Completion rate bar** — an animated progress bar showing the percentage of deliveries completed successfully.
- **Recent deliveries table** — up to 10 of the driver's most recent orders with order ID links, customer, route, amount, status badge, and date.

**Key files:** `app/(dashboard)/drivers/[driverId]/page.tsx`

---

### `/customers`

A searchable table of all 40 customers.

- Search filters by name, city, or email.
- Columns: customer name + email, phone, city and state, total orders, total spent (formatted in Naira), customer since date.
- Clicking a row navigates to the customer detail page.

**Key files:** `app/(dashboard)/customers/page.tsx`

---

### `/customers/[customerId]`

The individual customer profile.

- Profile card with contact details and address.
- Stats: total orders, total spent, customer since.
- Full order history table with the same columns as the orders page.

**Key files:** `app/(dashboard)/customers/[customerId]/page.tsx`

---

### `/live-map`

A simulated real-time map of Nigeria showing all driver positions.

- **Map area** — a proportionally-bounded grid representing Nigeria's geographic coordinates. Driver markers are positioned using `lat/lng → percentage` conversion against Nigeria's bounding box.
- **Marker colours** — green (available), blue (busy), amber (on break), grey (offline).
- **Animation** — non-offline driver positions update every 4 seconds with a smooth CSS transition.
- **Click a marker** — opens a side panel showing driver name, status badge, vehicle, rating, city, completed deliveries, and their current active order (if any). A "View Profile" link navigates to the driver detail page.
- **Status filter chips** — show/hide markers by driver status.
- **Driver list** — a grid below the map listing every driver in the current filter with a coloured status dot. Clicking a driver in this list selects them on the map and opens the same info panel.

**Key files:** `app/(dashboard)/live-map/page.tsx`

---

### `/analytics`

A dedicated performance and business intelligence page.

- **Date range selector** — a segmented control (7 days / 14 days / 30 days) that slices the revenue data. All charts and summary KPIs update immediately when the selection changes.
- **Summary KPIs** — total revenue, total orders, average daily revenue, average daily orders for the selected period.
- **Revenue trend** — area chart of daily revenue for the selected range.
- **Daily orders** — bar chart of daily order volume.
- **Delivery status distribution** — donut chart of all order statuses with percentage labels in the tooltip.
- **Top driver performance** — horizontal bar chart of the top 6 drivers by completed deliveries.
- **Driver performance table** — all tracked drivers with completed deliveries, on-time rate (with inline progress bar), average delivery time in minutes, and star rating.

**Key files:** `app/(dashboard)/analytics/page.tsx`

---

### `/notifications`

A live notification centre.

- **Unread count** is shown in the page subtitle, the sidebar nav badge, and the topbar bell — all updated from the same Zustand store value.
- **Filter tabs** — "All (N)" shows every notification; "Unread (N)" shows only unread ones. Counts update in real time.
- **Mark all read** button clears the unread count globally.
- **Clicking a row** expands it to show the full message in a readable block, and automatically marks the notification as read.
- Inside the expanded row, a **"Mark as unread"** button re-flags the notification and increments the badge back. Clicking **"Mark as read"** on an unread expanded row marks it read. Clicking **"Collapse"** closes the row without changing read state.
- **Live updates** — a new notification arrives every 15 seconds via `useRealtimeNotifications`. It is prepended to the top of the list, the unread badge increments everywhere, and a toast pop-up appears in the bottom-right corner.
- The list has `aria-live="polite"` so screen readers announce new items.

**Key files:** `app/(dashboard)/notifications/page.tsx`, `hooks/use-realtime-notifications.ts`

---

### `/settings`

User preferences and account management.

- **Profile section** — displays name, email, and role (read-only in demo).
- **Appearance section** — a segmented theme picker: Light, Dark, System. Selecting a theme applies it immediately across the entire app by toggling the `.dark` class on `<html>`. The choice persists across browser sessions via Zustand's `localStorage` persistence.
- **Notifications section** — toggle switches for notification categories (UI only in demo).
- **Security section** — two-factor authentication and active sessions placeholders.
- **Sign out** — a red button that clears auth state and redirects to `/login`.

**Key files:** `app/(dashboard)/settings/page.tsx`

---

### Command Palette (`Cmd+K` / `Ctrl+K`)

Available from any page once logged in.

- Triggered by the keyboard shortcut or clicking the search bar in the topbar.
- **Navigation commands** — go to any page instantly.
- **Search** — type 2 or more characters to search across orders (by ID or customer), drivers (by name or city), and customers (by name or city). Results appear as grouped sections with descriptions.
- **Action commands** — toggle dark/light mode, sign out.
- **Keyboard navigation** — `↑` / `↓` to move through results, `Enter` to select, `Escape` to close.
- Selected item is highlighted in primary blue. Hovering with the mouse also sets the active index.

**Key files:** `components/command-palette.tsx`

---

## Architecture Summary

```
Browser
  └── Next.js App Router
        ├── (auth) group  →  login page, no shell
        └── (dashboard) group  →  DashboardLayout
              ├── Sidebar  (reads: pathname, unreadCount)
              ├── Topbar   (reads: unreadCount, user, theme)
              ├── MobileNav
              ├── CommandPalette
              ├── ToastContainer
              └── <page content>
                    ├── reads mock data directly (synchronous)
                    └── reads/writes Zustand store

Zustand store (app-store.ts)
  ├── persisted: theme, sidebarOpen, isAuthenticated, user
  └── transient: notifications[], unreadCount, toasts[]

useRealtimeNotifications (mounted in DashboardLayout)
  └── every 15s → addNotification() + addToast()
```

---

*DispatchOS — built to demonstrate production-quality frontend engineering with React, TypeScript, and Next.js.*
