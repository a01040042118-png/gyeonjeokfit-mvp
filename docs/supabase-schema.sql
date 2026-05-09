-- 견적핏 MVP Supabase schema
-- 로그인 없는 서버 API 방식의 MVP입니다.
-- 클라이언트는 Supabase에 직접 접근하지 않고 Next.js API 라우트를 통해서만 접근합니다.
-- service role key는 서버 라우트에서만 사용해야 합니다.
-- RLS는 켜두고 익명/인증 사용자 정책을 만들지 않아 브라우저 직접 접근을 차단합니다.

create extension if not exists "pgcrypto";

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_id text unique not null,
  order_name text not null,
  amount integer not null,
  currency text not null default 'KRW',
  customer_name text,
  customer_email text,
  status text not null default 'READY' check (status in ('READY', 'IN_PROGRESS', 'DONE', 'FAILED', 'CANCELED')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  order_id text not null,
  payment_key text unique,
  amount integer not null,
  currency text not null default 'KRW',
  method text,
  status text not null check (status in ('DONE', 'FAILED', 'CANCELED', 'WAITING_FOR_DEPOSIT')),
  approved_at timestamptz,
  receipt_url text,
  raw_response jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.form_submissions (
  id uuid primary key default gen_random_uuid(),
  order_id text,
  customer_email text,
  service_type text,
  client_industry text,
  request_text text,
  page_count text,
  features jsonb,
  budget text,
  timeline text,
  included_scope text,
  excluded_scope text,
  revision_count text,
  payment_terms text,
  tone text,
  raw_input jsonb,
  created_at timestamptz default now()
);

create table if not exists public.generations (
  id uuid primary key default gen_random_uuid(),
  order_id text,
  form_submission_id uuid references public.form_submissions(id) on delete set null,
  status text not null default 'DONE',
  model text,
  output_markdown text,
  output_json jsonb,
  created_at timestamptz default now()
);

create index if not exists orders_order_id_idx on public.orders(order_id);
create index if not exists payments_order_id_idx on public.payments(order_id);
create index if not exists form_submissions_order_id_idx on public.form_submissions(order_id);
create index if not exists generations_order_id_idx on public.generations(order_id);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists orders_set_updated_at on public.orders;
create trigger orders_set_updated_at
before update on public.orders
for each row execute function public.set_updated_at();

drop trigger if exists payments_set_updated_at on public.payments;
create trigger payments_set_updated_at
before update on public.payments
for each row execute function public.set_updated_at();

alter table public.orders enable row level security;
alter table public.payments enable row level security;
alter table public.form_submissions enable row level security;
alter table public.generations enable row level security;

-- MVP 정책:
-- 별도 anon/auth 정책을 생성하지 않습니다.
-- Next.js 서버 라우트의 service role 클라이언트만 DB를 읽고 씁니다.
-- 로그인 기능을 도입하면 사용자 소유권 기준 select/insert 정책을 별도 추가하세요.
