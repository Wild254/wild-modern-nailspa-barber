-- Wild Modern booking requests: isolated from existing tables.
create table if not exists public.wm_bookings (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  phone text not null,
  appointment_date date not null,
  appointment_time text not null,
  notes text,
  items jsonb not null default '[]'::jsonb,
  total numeric not null default 0,
  status text not null default 'pending' check (status in ('pending','confirmed','completed','cancelled')),
  created_at timestamptz not null default now()
);
create table if not exists public.wm_admins (
  email text primary key
);
alter table public.wm_bookings enable row level security;
alter table public.wm_admins enable row level security;
drop policy if exists "Public can submit booking requests" on public.wm_bookings;
create policy "Public can submit booking requests" on public.wm_bookings
for insert to anon, authenticated with check (
  customer_name <> '' and phone <> '' and total >= 0
);
drop policy if exists "Admins can view booking requests" on public.wm_bookings;
create policy "Admins can view booking requests" on public.wm_bookings
for select to authenticated using (
  exists (select 1 from public.wm_admins a where lower(a.email)=lower(auth.jwt()->>'email'))
);
drop policy if exists "Admins can update booking requests" on public.wm_bookings;
create policy "Admins can update booking requests" on public.wm_bookings
for update to authenticated using (
  exists (select 1 from public.wm_admins a where lower(a.email)=lower(auth.jwt()->>'email'))
) with check (
  exists (select 1 from public.wm_admins a where lower(a.email)=lower(auth.jwt()->>'email'))
);
-- After creating the owner's Supabase Auth account, add that email:
-- insert into public.wm_admins(email) values ('YOUR_OWNER_EMAIL') on conflict do nothing;
-- Note: do not allow public reads of wm_admins.
