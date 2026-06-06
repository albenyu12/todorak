create extension if not exists pgcrypto;

create table if not exists public.classes (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references public.classes(id) on delete cascade,
  name text not null,
  department text not null,
  year integer not null,
  bio text,
  role text not null check (role in ('개발자', '디자이너', '마케터', '데이터분석가', 'PM')),
  interests text[] not null default '{}',
  skills text[] not null default '{}',
  looking_for text[] not null default '{}',
  contact_methods jsonb not null default '[]'::jsonb,
  avatar_initial text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_contact_methods_array_check check (jsonb_typeof(contact_methods) = 'array')
);

create table if not exists public.inbox_questions (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references public.classes(id) on delete cascade,
  target_profile_id uuid not null references public.profiles(id) on delete cascade,
  question_template_id text,
  question_text text not null,
  is_answered boolean not null default false,
  created_at timestamptz not null default now(),
  answered_at timestamptz
);

create table if not exists public.answers (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references public.classes(id) on delete cascade,
  target_profile_id uuid not null references public.profiles(id) on delete cascade,
  recorder_profile_id uuid references public.profiles(id) on delete set null,
  inbox_question_id uuid references public.inbox_questions(id) on delete set null,
  question_template_id text,
  question_text text not null,
  answer_text text not null,
  answer_type text not null check (answer_type in ('first', 'inperson', 'online')),
  created_at timestamptz not null default now()
);

create index if not exists classes_code_idx on public.classes(code);
create index if not exists profiles_class_id_idx on public.profiles(class_id);
create index if not exists inbox_questions_class_id_idx on public.inbox_questions(class_id);
create index if not exists inbox_questions_target_profile_id_idx on public.inbox_questions(target_profile_id);
create index if not exists answers_class_id_created_at_idx on public.answers(class_id, created_at desc);
create index if not exists answers_target_profile_id_idx on public.answers(target_profile_id);
create index if not exists answers_recorder_profile_id_idx on public.answers(recorder_profile_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

alter table public.classes enable row level security;
alter table public.profiles enable row level security;
alter table public.inbox_questions enable row level security;
alter table public.answers enable row level security;

drop policy if exists "MVP anon read classes" on public.classes;
create policy "MVP anon read classes"
on public.classes for select
to anon
using (true);

drop policy if exists "MVP anon read profiles" on public.profiles;
create policy "MVP anon read profiles"
on public.profiles for select
to anon
using (true);

drop policy if exists "MVP anon insert profiles" on public.profiles;
create policy "MVP anon insert profiles"
on public.profiles for insert
to anon
with check (true);

drop policy if exists "MVP anon update profiles" on public.profiles;
create policy "MVP anon update profiles"
on public.profiles for update
to anon
using (true)
with check (true);

drop policy if exists "MVP anon read inbox questions" on public.inbox_questions;
create policy "MVP anon read inbox questions"
on public.inbox_questions for select
to anon
using (true);

drop policy if exists "MVP anon insert inbox questions" on public.inbox_questions;
create policy "MVP anon insert inbox questions"
on public.inbox_questions for insert
to anon
with check (true);

drop policy if exists "MVP anon update inbox questions" on public.inbox_questions;
create policy "MVP anon update inbox questions"
on public.inbox_questions for update
to anon
using (true)
with check (true);

drop policy if exists "MVP anon delete inbox questions" on public.inbox_questions;
create policy "MVP anon delete inbox questions"
on public.inbox_questions for delete
to anon
using (true);

drop policy if exists "MVP anon read answers" on public.answers;
create policy "MVP anon read answers"
on public.answers for select
to anon
using (true);

drop policy if exists "MVP anon insert answers" on public.answers;
create policy "MVP anon insert answers"
on public.answers for insert
to anon
with check (true);

insert into public.classes (code, name)
values
  ('WEBPROGRAMMING_2026', '웹프로그래밍 2026'),
  ('DEMO_LONGTERM', '토도락 장기 운영 데모')
on conflict (code) do update
set name = excluded.name;
