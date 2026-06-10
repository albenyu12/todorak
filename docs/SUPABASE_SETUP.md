# Supabase Setup

토도락 MVP는 로그인 없이 같은 수업 참여자들이 하나의 Supabase DB를 공유하는 구조입니다.
현재 단계에서는 Auth를 사용하지 않기 때문에 사용자 소유권을 강하게 보장하지 못합니다.

## Project

- Supabase project name: `todorak`
- Project ref: `doxjsvbquzmnlgidrjsm`
- Live class code: `WEBPROGRAMMING_2026`
- Demo class code: `DEMO_LONGTERM`

## Local CLI Setup

```bash
brew install supabase/tap/supabase
supabase login
supabase init
supabase link --project-ref doxjsvbquzmnlgidrjsm
```

`supabase login`은 브라우저 로그인이 안 되면 Supabase account token을 만들어 아래처럼 실행합니다.
토큰은 채팅, 문서, 커밋에 남기지 않습니다.

```bash
supabase login --token <SUPABASE_ACCESS_TOKEN>
```

## Environment Variables

Next.js 앱에는 아래 값을 `.env.local`에 설정합니다.

```bash
NEXT_PUBLIC_SUPABASE_URL=<PROJECT_URL>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<ANON_KEY>
```

값은 Supabase dashboard의 Project Settings > API에서 확인합니다.
`.env.local`은 커밋하지 않습니다.

## Schema

스키마 원본은 `supabase/schema.sql`에 있습니다.
Supabase CLI 적용용 migration은 `supabase/migrations/` 아래에 있으며, 파일명 timestamp 순서대로 적용됩니다.

원격 DB 적용:

```bash
supabase db push
```

Dashboard SQL Editor에서 수동 실행해야 할 때는 `supabase/schema.sql` 전체를 실행합니다.
이 SQL은 `create table if not exists`, `on conflict`를 사용해 재실행 가능하게 작성되어 있습니다.

## Tables

- `classes`: 수업/데모 class 관리
- `profiles`: 학생 프로필
- `inbox_questions`: 익명 질문
- `answers`: 첫 답변, 대면 답변, 온라인 답변

## MVP RLS Policy

현재 MVP는 Auth 없이 QR/class code로 접근합니다.
그래서 `anon` role에 다음 권한을 열어둡니다.

- `classes`: select
- `profiles`: select, insert, update
- `inbox_questions`: select, insert, update
- `answers`: select, insert

이 정책은 발표용 MVP에는 단순하고 빠르지만, `anon` key만으로 다음 작업이 가능한 한계가 있습니다.

- 다른 사람의 `profiles` row를 update할 수 있습니다.
- 다른 사람의 `inbox_questions` row를 update할 수 있습니다.
- 모든 profile의 `contact_methods`를 조회할 수 있습니다.

실서비스로 확장할 때는 Supabase Auth를 추가하고 profile 소유권 기반 RLS로 교체해야 합니다.

## Manual Test

SQL 적용 후 Supabase Table Editor 또는 SQL Editor에서 확인합니다.

```sql
select code, name
from public.classes
order by code;
```

기대 결과:

- `WEBPROGRAMMING_2026`
- `DEMO_LONGTERM`

프로필 insert 테스트:

```sql
insert into public.profiles (
  class_id,
  name,
  department,
  year,
  role,
  interests,
  skills,
  looking_for,
  contact_methods,
  avatar_initial
)
select
  id,
  '테스트 사용자',
  '컴퓨터공학과',
  3,
  '개발자',
  array['웹개발', '팀빌딩'],
  array['React', 'TypeScript'],
  array['디자이너', 'PM']::text[],
  '[{"type":"email","value":"test@example.com"}]'::jsonb,
  '테'
from public.classes
where code = 'WEBPROGRAMMING_2026'
returning id;
```

테스트 row는 확인 후 삭제합니다.

```sql
delete from public.profiles
where name = '테스트 사용자';
```

## Demo Seed

장기 운영 예시 데이터는 `supabase/seed-demo.sql`에 있습니다.
이 seed는 `DEMO_LONGTERM` class만 대상으로 하며, 발표 표현은 "수업 초반 탐색이 누적된 예시 데이터"로 통일합니다.

Dashboard SQL Editor에서 수동 실행하거나, 로컬 CLI로 원격 DB에 연결한 뒤 아래처럼 실행합니다.

```bash
supabase db query --linked --file supabase/seed-demo.sql
```

재실행하면 `DEMO_LONGTERM` class의 demo profile, inbox question, answer row를 다시 구성합니다.
`WEBPROGRAMMING_2026` live class 데이터는 건드리지 않습니다.

적용 후 확인:

```sql
select
  (select count(*)
   from public.profiles p
   join public.classes c on c.id = p.class_id
   where c.code = 'DEMO_LONGTERM') as demo_profiles,
  (select count(*)
   from public.inbox_questions q
   join public.classes c on c.id = q.class_id
   where c.code = 'DEMO_LONGTERM') as demo_inbox_questions,
  (select count(*)
   from public.answers a
   join public.classes c on c.id = a.class_id
   where c.code = 'DEMO_LONGTERM') as demo_answers;
```

기대 결과:

- `demo_profiles`: 12
- `demo_inbox_questions`: 10
- `demo_answers`: 30

## Handoff

팀원에게 전달할 값:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- class codes: `WEBPROGRAMMING_2026`, `DEMO_LONGTERM`

database password와 Supabase account token은 전달하지 않습니다.
