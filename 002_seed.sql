INSERT INTO crops (name) VALUES ('Wheat'), ('Mustard'), ('Gram') ON CONFLICT (name) DO NOTHING;
INSERT INTO procurement_centres (code, name, district, latitude, longitude, location, capacity_per_hour) VALUES
  ('CTR-01', 'Jaipur APMC, Bassi', 'Jaipur', 26.838700, 75.851900, ST_SetSRID(ST_MakePoint(75.851900, 26.838700), 4326)::geography, 42), ('CTR-02', 'Chomu Procurement Centre', 'Jaipur', 27.166300, 75.714000, ST_SetSRID(ST_MakePoint(75.714000, 27.166300), 4326)::geography, 35), ('CTR-03', 'Dausa Krishi Mandi', 'Dausa', 26.894300, 76.334200, ST_SetSRID(ST_MakePoint(76.334200, 26.894300), 4326)::geography, 38)
ON CONFLICT (code) DO NOTHING;
INSERT INTO farm_supplies (sku, name, category, unit, price, stock_quantity) VALUES
  ('SEED-WHT-40', 'Certified wheat seed', 'Seeds', '40 kg bag', 1820, 130), ('FRT-DAP-50', 'DAP fertiliser', 'Fertiliser', '50 kg bag', 1350, 94), ('BIO-NEEM-1', 'Neem bio-pesticide', 'Crop protection', '1 litre', 485, 18)
ON CONFLICT (sku) DO NOTHING;
INSERT INTO market_rates (centre_id, crop_id, rate_per_quintal, quality_premium, source)
SELECT c.id, p.id, v.rate, v.premium, 'seed' FROM (VALUES
  ('CTR-01','Wheat',2275.00,0.00), ('CTR-02','Wheat',2320.00,30.00), ('CTR-03','Wheat',2295.00,20.00), ('CTR-01','Mustard',5890.00,25.00), ('CTR-02','Mustard',5950.00,20.00)
) AS v(centre_code,crop_name,rate,premium) JOIN procurement_centres c ON c.code=v.centre_code JOIN crops p ON p.name=v.crop_name;
