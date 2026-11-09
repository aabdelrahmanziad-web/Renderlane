-- Renderlane: inquiries table
-- Run this once in Supabase: Dashboard -> SQL Editor -> New query -> paste -> Run

create extension if not exists "pgcrypto";

create table if not exists public.inquiries (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  name          text not null,
  company       text,
  email         text not null,
  phone         text not null,
  project_name  text not null,
  requirements  text not null,
  budget        text,
  timeline      text,
  services      text[],
  status        text not null default 'new'
                check (status in ('new', 'contacted', 'in_progress', 'won', 'lost')),
  notes         text
);

create index if not exists inquiries_created_at_idx on public.inquiries (created_at desc);
create index if not exists inquiries_status_idx on public.inquiries (status);

-- Lock the table down: with RLS on and no policies, the public "anon" key can't read
-- or write anything. The website writes through the server using the service role key.
alter table public.inquiries enable row level security;
