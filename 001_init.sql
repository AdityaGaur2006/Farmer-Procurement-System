-- KisanSetu PostgreSQL foundation. Run this before db/002_seed.sql.
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE farmers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), farmer_code TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL, phone VARCHAR(15) UNIQUE NOT NULL, password_hash TEXT NOT NULL,
  village TEXT, district TEXT, created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE procurement_centres (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), code TEXT UNIQUE NOT NULL, name TEXT NOT NULL,
  district TEXT NOT NULL, latitude NUMERIC(9,6) NOT NULL, longitude NUMERIC(9,6) NOT NULL,
  location GEOGRAPHY(POINT, 4326) NOT NULL, capacity_per_hour INTEGER NOT NULL CHECK (capacity_per_hour > 0), is_active BOOLEAN NOT NULL DEFAULT true
);
CREATE INDEX procurement_centres_location_idx ON procurement_centres USING GIST (location);
CREATE TABLE crops (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), name TEXT UNIQUE NOT NULL, unit TEXT NOT NULL DEFAULT 'quintal');
CREATE TABLE market_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), centre_id UUID NOT NULL REFERENCES procurement_centres(id), crop_id UUID NOT NULL REFERENCES crops(id),
  rate_per_quintal NUMERIC(10,2) NOT NULL CHECK (rate_per_quintal >= 0), quality_premium NUMERIC(10,2) NOT NULL DEFAULT 0, recorded_at TIMESTAMPTZ NOT NULL DEFAULT now(), source TEXT NOT NULL DEFAULT 'operator'
);
CREATE INDEX market_rates_lookup_idx ON market_rates (crop_id, centre_id, recorded_at DESC);
CREATE TABLE farm_supplies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), sku TEXT UNIQUE NOT NULL, name TEXT NOT NULL, category TEXT NOT NULL,
  unit TEXT NOT NULL, price NUMERIC(10,2) NOT NULL CHECK (price >= 0), stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0), updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), booking_code TEXT UNIQUE NOT NULL, farmer_id UUID NOT NULL REFERENCES farmers(id), centre_id UUID NOT NULL REFERENCES procurement_centres(id),
  crop_id UUID NOT NULL REFERENCES crops(id), quantity_quintals NUMERIC(10,2) NOT NULL CHECK (quantity_quintals > 0), slot_at TIMESTAMPTZ NOT NULL, token_number TEXT NOT NULL, status TEXT NOT NULL CHECK (status IN ('confirmed','checked_in','completed','cancelled')), created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE procurement_lots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), booking_id UUID REFERENCES bookings(id), accepted_quantity_quintals NUMERIC(10,2), grade TEXT, moisture_percent NUMERIC(5,2), status TEXT NOT NULL CHECK (status IN ('received','quality_checked','accepted','rejected'))
);
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), farmer_id UUID NOT NULL REFERENCES farmers(id), procurement_lot_id UUID REFERENCES procurement_lots(id), amount NUMERIC(12,2) NOT NULL CHECK (amount >= 0), status TEXT NOT NULL CHECK (status IN ('pending','processing','paid','failed')), reference TEXT UNIQUE, paid_at TIMESTAMPTZ
);
CREATE TABLE queue_states (
  centre_id UUID PRIMARY KEY REFERENCES procurement_centres(id), queue_count INTEGER NOT NULL DEFAULT 0 CHECK (queue_count >= 0),
  active_counters INTEGER NOT NULL DEFAULT 1 CHECK (active_counters > 0), updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), farmer_id UUID NOT NULL REFERENCES farmers(id), channel TEXT NOT NULL CHECK (channel IN ('sms','whatsapp','push')),
  message TEXT NOT NULL, status TEXT NOT NULL CHECK (status IN ('queued','sent','failed')), provider_message_id TEXT, created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE audit_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), actor_type TEXT NOT NULL, actor_id TEXT, action TEXT NOT NULL, entity_type TEXT NOT NULL, entity_id TEXT NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb, created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
