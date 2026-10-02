# کلینیکی ڕۆژهەڵات — Interactive Demo (frontend-only)

A fully interactive, **backend-free** version of the clinic system, built
for demos/pitches. Every button works — adding patients, booking
appointments, running the queue, marking payments, managing inventory,
scheduling surgeries — but all the data lives in the browser (React state
+ `localStorage`), so there is nothing to host or configure. No database,
no API keys, no `.env` file.

## Run it

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## What's simulated vs real

- **Real**: every interaction (add/edit/delete patient, book an
  appointment, call the next patient, mark a visit paid, add inventory,
  issue a device key, etc.) actually updates the on-screen state and
  persists across a page refresh via `localStorage`.
- **Simulated for the demo**: the device-key screen accepts any input, and
  login accepts any email/password — there's no real backend to check
  credentials against. This still shows the exact same screens and flow
  the real product uses.
- **Not persisted anywhere real**: closing the browser in private/
  incognito mode, or clearing site data, resets everything back to the
  seed data. There's also a **"ڕیسێتکردنی دیمۆ" (reset demo)** button in
  the sidebar for exactly this, in case you want to hand the demo to
  someone else with a clean slate.

## Mobile

Fully responsive — the sidebar becomes a slide-in drawer (opened via a
floating button) on small screens, every table scrolls horizontally
instead of breaking the layout, and the page respects a phone's notch/
home-indicator safe areas. Good to go as-is once hosted for a mobile
audience.

## Structure

```
demo/
├── lib/store.tsx     A React Context that stands in for the entire
│                     backend — every mutation from the real API
│                     (find-or-create patient, day-scoped queue numbers,
│                     "N patients ahead" warnings, mark-paid → invoice,
│                     etc.) is reproduced here in plain client-side state.
├── lib/types.ts      Same shape as the real backend's data model.
├── components/       Same UI components as the real staff-app.
└── app/              One route per page, identical UI/UX to the real
                       system — dashboard, appointments, queue, finance,
                       patients, surgeries, schedule, inventory,
                       notifications, devices, plus the public booking
                       page at /book.
```

## Turning this into the real product

This demo intentionally mirrors `apps/staff-app`, `apps/patient-app`, and
`backend` in the rest of this repository — once a client is ready to go
live, swap `lib/store.tsx`'s in-memory functions for real `fetch` calls to
the actual backend (already built, in `../../backend`) and everything else
carries over unchanged.
