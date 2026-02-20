-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles Table (to store user metadata in public schema)
create table if not exists public.profiles (
    id uuid references auth.users(id) on delete cascade primary key,
    full_name text,
    updated_at timestamptz default now()
);

-- Resumes Table
create table if not exists public.resumes (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references public.profiles(id) on delete cascade not null,
    name text not null,
    content jsonb not null default '{}'::jsonb,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Job Descriptions Table
create table if not exists public.job_descriptions (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references public.profiles(id) on delete cascade not null,
    content text not null,
    extracted_keywords jsonb not null default '{}'::jsonb,
    created_at timestamptz default now()
);

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.resumes enable row level security;
alter table public.job_descriptions enable row level security;

-- Policies for Profiles
create policy "Users can view and edit their own profile"
    on public.profiles
    for all
    using (auth.uid() = id)
    with check (auth.uid() = id);

-- Policies for Resumes
create policy "Users can manage their own resumes"
    on public.resumes
    for all
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

-- Policies for Job Descriptions
create policy "Users can manage their own job descriptions"
    on public.job_descriptions
    for all
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

-- Sync Trigger for Profiles
create or replace function public.handle_new_user()
returns trigger as $$
begin
    insert into public.profiles (id, full_name)
    values (new.id, new.raw_user_meta_data->>'full_name');
    return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
    after insert on auth.users
    for each row execute function public.handle_new_user();

-- Indexes
create index if not exists resumes_user_id_idx on public.resumes(user_id);
create index if not exists job_descriptions_user_id_idx on public.job_descriptions(user_id);

-- Trigger for updated_at in resumes
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create trigger set_updated_at
    before update on public.resumes
    for each row
    execute function public.handle_updated_at();
