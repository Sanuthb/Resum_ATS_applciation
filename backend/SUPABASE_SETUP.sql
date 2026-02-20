-- ==========================================
-- SUPABASE INITIALIZATION SCHEMA
-- Run this in the Supabase SQL Editor
-- ==========================================

-- 1. Enable UUID Extension
create extension if not exists "uuid-ossp";

-- 2. Profiles Table (Syncs with Auth)
create table if not exists public.profiles (
    id uuid references auth.users(id) on delete cascade primary key,
    full_name text,
    updated_at timestamptz default now()
);

-- 3. Resumes Table
create table if not exists public.resumes (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references public.profiles(id) on delete cascade not null,
    name text not null,
    content jsonb not null default '{}'::jsonb,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- 4. Job Descriptions Table
create table if not exists public.job_descriptions (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references public.profiles(id) on delete cascade not null,
    content text not null,
    extracted_keywords jsonb not null default '{}'::jsonb,
    created_at timestamptz default now()
);

-- 5. Enable Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.resumes enable row level security;
alter table public.job_descriptions enable row level security;

-- 6. RLS Policies
create policy "Users can manage own profile" on public.profiles for all using (auth.uid() = id);
create policy "Users can manage own resumes" on public.resumes for all using (auth.uid() = user_id);
create policy "Users can manage own jobs" on public.job_descriptions for all using (auth.uid() = user_id);

-- 7. Auth Sync Trigger
create or replace function public.handle_new_user()
returns trigger as $$
begin
    insert into public.profiles (id, full_name)
    values (new.id, new.raw_user_meta_data->>'full_name');
    return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
    after insert on auth.users
    for each row execute function public.handle_new_user();

-- 8. Updated At Trigger
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create or replace trigger set_updated_at
    before update on public.resumes
    for each row execute function public.handle_updated_at();

-- 9. Practical Indexes
create index if not exists resumes_user_id_idx on public.resumes(user_id);
create index if not exists job_descriptions_user_id_idx on public.job_descriptions(user_id);
