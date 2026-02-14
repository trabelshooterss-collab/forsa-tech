-- Forsa-Tech: Auctions (Real) schema
-- Run this in your InsForge SQL editor.

-- UUID generation (needed for gen_random_uuid()).
create extension if not exists pgcrypto;

-- ============================================================================
-- Tables
-- ============================================================================

create table if not exists public.auctions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  advertiser_id uuid not null,
  title text not null,
  description text,

  category_id text,
  city text,
  item_condition text,

  image_urls text[] not null default '{}'::text[],

  start_price numeric not null check (start_price >= 0),
  current_bid numeric not null default 0 check (current_bid >= 0),
  buy_now_price numeric,
  min_increment numeric not null default 0 check (min_increment >= 0),

  start_time timestamptz not null default now(),
  end_time timestamptz not null,

  status text not null default 'active'
    check (status in ('draft','scheduled','active','ended','sold','cancelled')),

  winner_id uuid,
  sold_at timestamptz,

  bid_count integer not null default 0,
  views_count integer not null default 0,
  is_featured boolean not null default false
);

create index if not exists auctions_end_time_idx on public.auctions(end_time);
create index if not exists auctions_start_time_idx on public.auctions(start_time);
create index if not exists auctions_status_idx on public.auctions(status);
create index if not exists auctions_category_idx on public.auctions(category_id);
create index if not exists auctions_featured_idx on public.auctions(is_featured);

create table if not exists public.bids (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  auction_id uuid not null references public.auctions(id) on delete cascade,
  user_id uuid not null,
  amount numeric not null check (amount > 0)
);

create index if not exists bids_auction_created_idx on public.bids(auction_id, created_at desc);
create index if not exists bids_auction_amount_idx on public.bids(auction_id, amount desc);

-- ============================================================================
-- Triggers
-- ============================================================================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_auctions_updated_at on public.auctions;
create trigger trg_auctions_updated_at
before update on public.auctions
for each row
execute function public.set_updated_at();

-- ============================================================================
-- Helpers + RPC
-- ============================================================================

-- Get current user id from PostgREST JWT claims.
create or replace function public.current_user_id()
returns uuid
language sql
stable
as $$
  select (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')::uuid;
$$;

-- Atomic bid placement with simple anti-sniping:
-- If a bid is placed in the last 120 seconds, extend the end_time to now + 120s.
create or replace function public.place_bid(p_auction_id uuid, p_amount numeric)
returns jsonb
language plpgsql
as $$
declare
  v_uid uuid := public.current_user_id();
  v_now timestamptz := now();
  v_a public.auctions%rowtype;
  v_min numeric;
  v_new_end timestamptz;
  v_bid_id uuid;
begin
  if v_uid is null then
    raise exception 'NOT_AUTHENTICATED';
  end if;

  select * into v_a
  from public.auctions
  where id = p_auction_id
  for update;

  if not found then
    raise exception 'AUCTION_NOT_FOUND';
  end if;

  if v_a.status in ('sold','ended','cancelled') then
    raise exception 'AUCTION_NOT_ACTIVE';
  end if;

  if v_now < v_a.start_time then
    raise exception 'AUCTION_NOT_STARTED';
  end if;

  if v_now >= v_a.end_time then
    update public.auctions set status = 'ended' where id = p_auction_id;
    raise exception 'AUCTION_ENDED';
  end if;

  v_min := greatest(v_a.current_bid, v_a.start_price) + greatest(v_a.min_increment, 0);

  if p_amount < v_min then
    raise exception 'BID_TOO_LOW';
  end if;

  if v_a.buy_now_price is not null and p_amount >= v_a.buy_now_price then
    raise exception 'USE_BUY_NOW';
  end if;

  insert into public.bids(auction_id, user_id, amount)
  values (p_auction_id, v_uid, p_amount)
  returning id into v_bid_id;

  v_new_end := v_a.end_time;
  if v_a.end_time - v_now <= interval '120 seconds' then
    v_new_end := v_now + interval '120 seconds';
  end if;

  update public.auctions
  set current_bid = p_amount,
      winner_id = v_uid,
      bid_count = bid_count + 1,
      end_time = v_new_end,
      status = 'active'
  where id = p_auction_id;

  return jsonb_build_object(
    'auction_id', p_auction_id,
    'bid_id', v_bid_id,
    'current_bid', p_amount,
    'winner_id', v_uid,
    'end_time', v_new_end
  );
end;
$$;

