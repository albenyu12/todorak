alter table public.classes
  drop column if exists description,
  drop column if exists is_demo,
  drop column if exists updated_at;

drop trigger if exists set_classes_updated_at on public.classes;

do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = 'profiles'
      and column_name = 'contacts'
  ) and not exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = 'profiles'
      and column_name = 'contact_methods'
  ) then
    alter table public.profiles rename column contacts to contact_methods;
  end if;
end $$;

alter table public.profiles
  alter column role type text using role::text,
  alter column looking_for type text[] using looking_for::text[],
  alter column looking_for set default '{}'::text[],
  alter column contact_methods set default '[]'::jsonb;

update public.profiles
set contact_methods = '[]'::jsonb
where contact_methods = '{}'::jsonb;

alter table public.profiles
  drop constraint if exists profiles_role_check,
  drop constraint if exists profiles_contact_methods_array_check;

alter table public.profiles
  add constraint profiles_role_check check (role in ('개발자', '디자이너', '마케터', '데이터분석가', 'PM')),
  add constraint profiles_contact_methods_array_check check (jsonb_typeof(contact_methods) = 'array');

do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = 'inbox_questions'
      and column_name = 'question_id'
  ) and not exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = 'inbox_questions'
      and column_name = 'question_template_id'
  ) then
    alter table public.inbox_questions rename column question_id to question_template_id;
  end if;
end $$;

alter table public.inbox_questions
  drop column if exists sender_profile_id,
  add column if not exists is_answered boolean not null default false;

drop policy if exists "MVP anon delete inbox questions" on public.inbox_questions;

do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = 'answers'
      and column_name = 'answerer_profile_id'
  ) and not exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = 'answers'
      and column_name = 'recorder_profile_id'
  ) then
    alter table public.answers rename column answerer_profile_id to recorder_profile_id;
  end if;
end $$;

do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = 'answers'
      and column_name = 'question_id'
  ) and not exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = 'answers'
      and column_name = 'question_template_id'
  ) then
    alter table public.answers rename column question_id to question_template_id;
  end if;
end $$;

drop index if exists answers_class_id_recorded_at_idx;
drop index if exists answers_answerer_profile_id_idx;

alter table public.answers
  alter column answer_type type text using answer_type::text,
  drop column if exists recorded_at;

alter table public.answers
  drop constraint if exists answers_answer_type_check;

alter table public.answers
  add constraint answers_answer_type_check check (answer_type in ('first', 'inperson', 'online'));

create index if not exists answers_class_id_created_at_idx on public.answers(class_id, created_at desc);
create index if not exists answers_recorder_profile_id_idx on public.answers(recorder_profile_id);

drop type if exists public.profile_role;
drop type if exists public.answer_type;
