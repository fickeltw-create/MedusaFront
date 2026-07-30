create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  handle text unique,
  description text,
  thumbnail text,
  price integer,
  currency_code text default 'eur',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.products enable row level security;

create policy "Public read products"
  on public.products
  for select
  using (true);
