# KisanSetu backend architecture

The running application is a **modular-monolith development gateway**. Its routes and modules deliberately follow the planned service boundaries, so each module can be extracted behind the API gateway without changing client contracts.

| Planned service | Current module / route contract | Production extraction |
| --- | --- | --- |
| Identity/Auth | `/api/auth/*` | OTP provider, short-lived access tokens, refresh-token store |
| Farmer | `/api/farmers/me`, `/api/farm-supplies` | farmer/profile service |
| Mandi Discovery | `/api/nearby-mandis`, `/api/market-rates` | PostGIS query and authorised rate-ingestion worker |
| Booking | `/api/bookings` | slot capacity and idempotency service |
| Queue Engine | `/api/queues/:centreId`, `src/services/queue-engine.js` | Redis-backed counters and workers |
| Procurement | `/api/procurement/lots` | weighing/QC adapter plus receipt service |
| Notifications | `/api/notifications` | SMS, WhatsApp and push provider adapters |
| Payments | `/api/payments` | payment webhook reconciliation service |

## Infrastructure

`docker-compose.yml` provisions PostGIS and Redis. Apply `db/001_init.sql`, then `db/002_seed.sql`, to initialise the database. The local prototype continues to use a JSON store so it can run without Docker; this is a development fallback, not the production persistence path.

## Realtime queue feed

Authenticated clients can open `ws://localhost:3000/ws/queue?token=<session-token>`. A check-in broadcasts a `queue.updated` event. Production deployments should terminate TLS at the gateway and use Redis pub/sub for cross-instance fan-out.

## Gateway safety controls to add before launch

- Use an OTP identity provider; do not retain password-only authentication as the primary farmer login.
- Add request rate limiting in the API gateway and provider webhooks.
- Store secrets in a secret manager; never commit `.env`.
- Validate all input with schemas and make write endpoints idempotent.
- Add audit logs for grade, weight, payment and operator actions.
