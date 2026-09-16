insert into public.products (title, handle, description, thumbnail, price, currency_code) values
  ('Aurora Seat', 'aurora-seat', 'Comfort-first seating for a premium workspace setup.', null, 24900, 'eur'),
  ('Terra Desk', 'terra-desk', 'Minimal desk with cable-ready workspace design.', null, 39900, 'eur'),
  ('Nova Light', 'nova-light', 'Warm accent light for a polished studio feel.', null, 12900, 'eur')
on conflict (handle) do update set
  title = excluded.title,
  description = excluded.description,
  thumbnail = excluded.thumbnail,
  price = excluded.price,
  currency_code = excluded.currency_code,
  updated_at = now();
