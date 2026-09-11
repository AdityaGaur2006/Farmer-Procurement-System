# KisanSetu — Farmer Procurement Platform

An accessible, mobile-first interface for reducing uncertainty and congestion at agricultural procurement centres.

## What is built now

- Farmer dashboard with a confirmed procurement slot and token number
- Live centre queue card, including capacity and refresh behaviour
- New slot booking flow with crop, quantity and time selection
- Procurement activity, quality-report and payment-status feedback
- ML-driven arrival suggestion surfaced as a simple, explainable farmer insight
- Responsive layout for desktop and mobile screens
- Login page and API-backed market recommendation table
- Node.js API with farmer registration/login, booking, market-rate, farm-supply and profit-recommendation endpoints
- PostgreSQL database schema and seed data for deployment

## Run locally

```bash
npm start
```

Open `http://localhost:3000`. Sign in with the prefilled demo farmer credentials:

```text
Mobile: 9876543210
Password: kisan@123
```

The local development API persists its sample data in `data/kisansetu.json`; this is created the first time the server starts and is intentionally excluded from source control. For PostgreSQL, apply `db/001_init.sql` and then `db/002_seed.sql` to the target database.

## Pages

- `/` — login and farmer dashboard
- `/bookings.html` — procurement slots and tokens
- `/procurement.html` — accepted quantity and quality journey
- `/payments.html` — settlement history
- `/support.html` — farmer help and FAQs

## API surface

- `POST /api/auth/login` — authenticate a farmer and return a session token
- `POST /api/auth/register` — create a farmer account
- `GET /api/market-rates?crop=Wheat` — current rates by centre
- `GET /api/recommendations?crop=Wheat&quantity=45` — rank centres by estimated net return
- `GET /api/nearby-mandis?lat=...&lng=...&crop=Wheat&quantity=45` — consent-based location comparison; coordinates are used only in-memory for the request
- `GET /api/queues/:centreId` — cached queue status and ETA (authenticated)
- `POST /api/queues/:centreId/check-in` — check a confirmed booking into the queue (authenticated)
- `GET /api/procurement/lots` and `GET /api/notifications` — farmer status records (authenticated)
- `POST /api/notifications/test` — queue an SMS, WhatsApp or push test message using the configured provider adapter
- `GET /api/admin/centres` — operator/admin centre overview; requires `x-admin-key`

See [ARCHITECTURE.md](ARCHITECTURE.md) for the service-boundary and infrastructure plan.
- `GET /api/farm-supplies` — current supply catalogue (authenticated)
- `GET` / `POST /api/bookings` — farmer booking records (authenticated)

## Product flow

1. Farmer registers their profile and farm/crop details.
2. Farmer books an available procurement slot and receives a token.
3. The queue engine continually recalculates expected wait time from arrivals, service rate and no-shows.
4. The farmer receives SMS/push updates before their token is due.
5. The procurement operator records weighing, grade and accepted quantity.
6. The payment service publishes settlement status and receipt data to the farmer.

## Target service architecture

```text
Farmer mobile app / operator portal
              │
         API gateway
 ┌────────────┼───────────────────────────┐
 │            │                           │
Farmer    Booking & Queue           Procurement
service       service                 service
 │            │                           │
 └────────────┴────────── PostgreSQL ─────┘
                            │
              ┌─────────────┼─────────────┐
              │             │             │
         Queue engine  Notification    Payment
                         service       service
                            │
                    ML prediction engine
       (ETA, demand forecasting, no-show and anomaly detection)
```

## Recommended implementation sequence

1. **Foundation:** API gateway, identity/OTP login, PostgreSQL schema, audit log and centre/crop master data.
2. **Core workflow:** slot inventory, booking rules, token issuance, operator check-in and procurement receipt.
3. **Real-time layer:** queue events, WebSocket updates, SMS/push notification adapter and payment-status webhook.
4. **Intelligence:** start with transparent ETA rules; train demand and no-show models only after enough centre data exists.
5. **Scale and safety:** Hindi/regional languages, low-connectivity mode, role-based access, rate limiting and privacy controls.

## Useful differentiators for the SIH solution

- Explainable wait estimate: show the farmer why an ETA changed, not only the new number.
- Arrive-later nudges: protect a farmer’s token while shifting arrival time to prevent crowding.
- Assisted booking: enable CSC/operator-mediated bookings for farmers without smartphones.
- Fairness guardrails: reserve a small share of capacity for walk-ins, distressed farmers and accessibility needs.
- Centre command view: show predicted demand, bottlenecks and anomalous weighment/payment patterns.

## Mandi Mitra location advisor

The in-app **Mandi Mitra** button uses the browser's native location-permission prompt only when the farmer selects **Find nearby mandis**. The API calculates distance in memory, does not store the submitted coordinates, and subtracts the configured transport cost before ranking the mandis. Seeded rates represent current platform-published rates; integrate an authorised government/APMC rate feed before describing them as external live rates in production.
