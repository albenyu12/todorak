# Supabase Contract

이 문서는 Todorak Supabase 전환 작업의 공통 데이터 계약이다. B/H/Y는 이 문서의 필드명, URL, localStorage key, API 함수명을 기준으로 구현한다.

이번 계약은 문서화만 확정한다. Supabase 설치, client 생성, 타입 교체, API 구현, 기존 타입 제거는 후속 이슈에서 처리한다.

## Contract Change Policy

이 문서에 없는 DB column, TypeScript field, localStorage key, URL query, API 함수, API 파라미터는 임의로 추가하지 않는다.

정책:

- 새 필드, 테이블, key, URL, API 함수가 필요하면 구현 전에 이 문서를 먼저 수정한다.
- 문서 수정 없이 화면이나 Supabase 코드에서 임의 이름을 만들지 않는다.
- B/H/Y가 서로 다른 이름을 쓰지 않도록 GitHub Issue의 완료 기준은 이 문서와 일치해야 한다.

## Term Glossary

헷갈리기 쉬운 식별자는 아래 의미로만 사용한다.

| term | meaning |
| --- | --- |
| `classCode` | URL query와 `classes.code`에 쓰는 사람이 읽을 수 있는 class 코드 |
| `classId` | `classes.id` uuid. DB row 연결과 `class_id` 필터에 사용 |
| `profileId` | 현재 브라우저 사용자의 `profiles.id` uuid |
| `targetProfileId` | 질문이나 답변의 대상이 되는 프로필 id |
| `recorderProfileId` | 답변을 기록한 브라우저 사용자의 프로필 id |
| `inboxQuestionId` | 답변으로 처리할 `inbox_questions.id` uuid |
| `questionTemplateId` | `QUESTIONS` 코드 상수의 질문 id. DB row id가 아님 |

정책:

- `classCode`와 `classId`를 혼용하지 않는다.
- URL의 `class` 값은 항상 `classCode`다.
- Supabase query의 `class_id` 조건에는 항상 `classId`를 사용한다.

## Class Code

클래스는 `code`로 접근한다. 초기 MVP에서 허용하는 classCode는 아래 두 개다.

| code | 목적 |
| --- | --- |
| `WEBPROGRAMMING_2026` | 실제 수업/팀원이 사용하는 live class |
| `DEMO_LONGTERM` | 발표, QA, 장기 데모용 demo class |

정책:

- URL에 classCode가 있으면 그 값을 우선 사용한다.
- URL에 classCode가 없으면 localStorage의 `todorak:classCode`를 사용한다.
- 둘 다 없으면 `WEBPROGRAMMING_2026`을 기본값으로 사용한다.
- Supabase에는 `classes.code`가 unique로 저장되어야 한다.
- live/demo 데이터는 class row를 다르게 두는 방식으로 분리한다. 테이블을 복제하거나 코드에서 mock 분기하지 않는다.

## URL Policy

classCode는 query string의 `class`로 전달한다.

| URL | 의미 |
| --- | --- |
| `/?class=WEBPROGRAMMING_2026` | live class 홈 |
| `/onboarding?class=WEBPROGRAMMING_2026` | live class 프로필 생성/수정 |
| `/?class=DEMO_LONGTERM` | demo class 홈 |
| `/onboarding?class=DEMO_LONGTERM` | demo class 프로필 생성/수정 |

정책:

- `class` query 값은 classCode다. DB의 `classes.id`가 아니다.
- 앱 내부 이동 시 현재 classCode를 유지한다.
- 프로필 생성 이후에는 `classCode`, `classId`, `profileId`를 localStorage에 저장한다.
- 잘못된 classCode면 class lookup 실패 상태를 보여주고, 임의로 새 class를 만들지 않는다.

## localStorage Policy

Supabase 전환 후 사용하는 localStorage key는 아래 세 개로 고정한다.

| key | value | 목적 |
| --- | --- | --- |
| `todorak:classCode` | string | 현재 접속한 class code |
| `todorak:classId` | string uuid | 현재 접속한 class row id |
| `todorak:profileId` | string uuid | 현재 브라우저 사용자의 profile row id |

정책:

- 기존 mock 단계의 `todorak_current_user`, `todorak_answers`, `todorak_anonymous_questions`는 Supabase 전환 후 계약 key가 아니다.
- `profileId`는 인증 정보가 아니라 브라우저에 저장된 식별자다.
- 같은 사용자가 다른 브라우저나 시크릿 창을 사용하면 같은 사람임을 보장할 수 없다.
- localStorage 값이 DB에 없으면 온보딩으로 보내 새 프로필을 만들게 한다.

## Shared Types

아래 타입 이름과 필드명을 기준으로 API와 화면을 맞춘다. DB column은 snake_case, TypeScript 타입은 camelCase를 사용한다.

### Class

```ts
type Class = {
  id: string;
  code: "WEBPROGRAMMING_2026" | "DEMO_LONGTERM";
  name: string;
  createdAt: string;
};
```

### Role

```ts
type Role =
  | "개발자"
  | "디자이너"
  | "마케터"
  | "데이터분석가"
  | "PM";
```

### ContactMethod

초기 MVP의 연락 수단은 `email`과 `link`만 지원한다.

```ts
type ContactMethod = {
  type: "email" | "link";
  value: string;
};
```

정책:

- 인스타그램, 카카오 오픈채팅, 개인 웹사이트, GitHub, Notion 등 URL로 열 수 있는 연락 수단은 모두 `type: "link"`로 저장한다.
- `type: "instagram"`, `type: "kakao"`, `type: "website"` 같은 세부 타입은 만들지 않는다.
- `value` 검증은 `email`이면 이메일 형식, `link`면 URL 형식으로 한다.

### StudentProfile

```ts
type StudentProfile = {
  id: string;
  classId: string;
  name: string;
  department: string;
  year: number;
  bio: string | null;
  role: Role;
  interests: string[];
  skills: string[];
  lookingFor: Role[];
  contactMethods: ContactMethod[];
  avatarInitial: string | null;
  createdAt: string;
  updatedAt: string;
};
```

정책:

- 기존 `CollaborationStyle`은 Supabase 계약에 포함하지 않는다.
- 기존 코드에서도 `collaborationStyle`을 사용하지 않는다.
- `classId`는 반드시 포함한다. 모든 profile 조회는 class boundary 안에서 이뤄져야 한다.
- `contactMethods`는 배열이다. 연락처가 없으면 빈 배열을 저장한다.

### InboxQuestion

`InboxQuestion`은 특정 프로필에게 도착한 익명 질문이다.

```ts
type InboxQuestion = {
  id: string;
  classId: string;
  targetProfileId: string;
  questionTemplateId: string | null;
  questionText: string;
  isAnswered: boolean;
  createdAt: string;
  answeredAt: string | null;
};
```

정책:

- 질문을 보낸 사람은 저장하지 않는다. 익명성을 유지한다.
- 추천 질문을 골랐으면 `questionTemplateId`에 `QUESTIONS` 상수의 id를 저장한다.
- 직접 입력 질문이면 `questionTemplateId`는 `null`이고 `questionText`만 저장한다.
- 답변이 생성되면 `isAnswered = true`, `answeredAt`을 기록한다.

### Answer

`Answer`는 Q&A 피드에 노출되는 답변이다.

```ts
type Answer = {
  id: string;
  classId: string;
  targetProfileId: string;
  recorderProfileId: string | null;
  inboxQuestionId: string | null;
  questionTemplateId: string | null;
  questionText: string;
  answerText: string;
  answerType: "first" | "inperson" | "online";
  createdAt: string;
};
```

정책:

- `targetProfileId`는 답변의 주인이다. 프로필 상세와 개인 답변 목록에서 이 값을 사용한다.
- `recorderProfileId`는 답변을 기록한 브라우저 사용자의 profile id다.
- 익명 질문 답변은 `answerType = "online"`이고 `inboxQuestionId`가 존재한다.
- 대면 대화 기록은 `answerType = "inperson"`이고 `inboxQuestionId = null`이다.
- 첫 답변은 `answerType = "first"`이고 자기소개성 public answer로만 사용한다.

## Database Tables

테이블명은 아래 네 개로 고정한다.

| table | 역할 |
| --- | --- |
| `classes` | classCode와 class metadata |
| `profiles` | class에 속한 학생 프로필 |
| `inbox_questions` | 프로필에게 도착한 익명 질문 |
| `answers` | class public Q&A 피드에 노출되는 답변 |

### classes

| column | type | rule |
| --- | --- | --- |
| `id` | uuid | primary key |
| `code` | text | unique, not null |
| `name` | text | not null |
| `created_at` | timestamptz | not null |

### profiles

| column | type | rule |
| --- | --- | --- |
| `id` | uuid | primary key |
| `class_id` | uuid | references `classes.id`, not null |
| `name` | text | not null |
| `department` | text | not null |
| `year` | int | not null |
| `bio` | text | nullable |
| `role` | text | not null |
| `interests` | text[] | not null, default `[]` |
| `skills` | text[] | not null, default `[]` |
| `looking_for` | text[] | not null, default `[]` |
| `contact_methods` | jsonb | not null, default `[]` |
| `avatar_initial` | text | nullable |
| `created_at` | timestamptz | not null |
| `updated_at` | timestamptz | not null |

### inbox_questions

| column | type | rule |
| --- | --- | --- |
| `id` | uuid | primary key |
| `class_id` | uuid | references `classes.id`, not null |
| `target_profile_id` | uuid | references `profiles.id`, not null |
| `question_template_id` | text | nullable |
| `question_text` | text | not null |
| `is_answered` | boolean | not null, default `false` |
| `created_at` | timestamptz | not null |
| `answered_at` | timestamptz | nullable |

### answers

| column | type | rule |
| --- | --- | --- |
| `id` | uuid | primary key |
| `class_id` | uuid | references `classes.id`, not null |
| `target_profile_id` | uuid | references `profiles.id`, not null |
| `recorder_profile_id` | uuid | references `profiles.id`, nullable |
| `inbox_question_id` | uuid | references `inbox_questions.id`, nullable |
| `question_template_id` | text | nullable |
| `question_text` | text | not null |
| `answer_text` | text | not null |
| `answer_type` | text | one of `first`, `inperson`, `online` |
| `created_at` | timestamptz | not null |

DB 제약 정책:

- `classes.code`는 DB unique constraint로 강제한다.
- `answer_type`은 DB check constraint를 우선 사용해 `first`, `inperson`, `online`만 허용한다.
- `interests`, `skills`, `looking_for`, `contact_methods`는 앱 코드만 믿지 않고 DB default를 빈 배열로 둔다.
- create/update API도 DB 제약과 같은 값을 검증한다.

## QUESTIONS Constant

`QUESTIONS`는 DB 테이블이 아니다. `lib/questions.ts`의 추천 질문 템플릿 코드 상수로 유지한다.

역할 분리:

- `QUESTIONS`: 화면에서 추천 질문을 보여주기 위한 정적 템플릿 목록
- `inbox_questions`: 특정 학생에게 실제로 전송된 익명 질문 row
- `answers.question_template_id`: 어떤 추천 질문에서 출발했는지 추적하는 optional id
- `answers.question_text`: 답변 생성 시점의 질문 문구 snapshot

정책:

- DB에 `questions` 테이블을 만들지 않는다.
- 실제 질문 테이블명은 `inbox_questions`로 한다.
- `QUESTIONS`의 문구가 나중에 바뀌어도 기존 `inbox_questions.question_text`와 `answers.question_text`는 바꾸지 않는다.

## First Answer

첫 답변은 익명 질문 답변이 아니라 Q&A 피드 콜드 스타트를 줄이는 자기소개성 public answer다.

생성 시점:

- 온보딩에서 프로필을 처음 생성한 뒤 첫 답변 입력을 받는다.
- 사용자가 건너뛰면 생성하지 않는다.

저장 규칙:

```ts
answer_type = "first";
target_profile_id = currentProfileId;
recorder_profile_id = currentProfileId;
inbox_question_id = null;
question_template_id = null;
```

기본 질문 문구:

```ts
question_text = "팀 프로젝트에서 나를 어떤 동료로 소개하고 싶나요?";
```

정책:

- 첫 답변은 익명 질문 인박스에 들어가지 않는다.
- 첫 답변 생성 때문에 `inbox_questions` row를 만들지 않는다.
- 첫 답변도 `answers`에 저장되므로 `/answers` 피드와 프로필 상세에 노출할 수 있다.

## API Function Signatures

화면 컴포넌트에서 Supabase query를 직접 작성하지 않는다. 화면은 아래 API 함수만 호출한다.

### Class

```ts
getClassByCode(code: string): Promise<Class | null>;
```

### API Response

생성, 수정, 단건 조회처럼 실패 사유를 화면에서 구분해야 하는 API는 공통 응답 형태를 사용한다.

```ts
type ApiResponse<T> =
  | { data: T; error: null }
  | { data: null; error: { message: string; code?: string; status?: number } };
```

### Profile

```ts
createProfile(
  classId: string,
  data: Omit<
    StudentProfile,
    "id" | "classId" | "createdAt" | "updatedAt"
  >
): Promise<ApiResponse<StudentProfile>>;

updateProfile(
  profileId: string,
  data: Partial<
    Omit<StudentProfile, "id" | "classId" | "createdAt" | "updatedAt">
  >
): Promise<ApiResponse<StudentProfile>>;

getProfilesByClass(classId: string): Promise<StudentProfile[]>;

getProfileById(profileId: string, classId: string): Promise<ApiResponse<StudentProfile>>;
```

### Inbox Question

```ts
createInboxQuestion(
  classId: string,
  data: {
    targetProfileId: string;
    questionTemplateId: string | null;
    questionText: string;
  }
): Promise<ApiResponse<InboxQuestion>>;

getInboxQuestions(profileId: string, classId: string): Promise<InboxQuestion[]>;

getInboxQuestionById(questionId: string, classId: string): Promise<ApiResponse<InboxQuestion>>;

markInboxQuestionAnswered(
  questionId: string,
  classId: string,
  targetProfileId: string
): Promise<ApiResponse<InboxQuestion>>;
```

### Answer

```ts
createAnswer(
  classId: string,
  data: {
    targetProfileId: string;
    recorderProfileId: string | null;
    inboxQuestionId: string | null;
    questionTemplateId: string | null;
    questionText: string;
    answerText: string;
    answerType: "first" | "inperson" | "online";
  }
): Promise<ApiResponse<Answer>>;

getAnswersByClass(classId: string): Promise<Answer[]>;

getAnswerById(answerId: string, classId: string): Promise<ApiResponse<Answer>>;

getAnswersForProfile(profileId: string, classId: string): Promise<Answer[]>;
```

구현 정책:

- `updateProfile`은 전달된 `profileId`가 현재 localStorage의 `todorak:profileId`와 같을 때만 수정한다. 다르면 수정하지 않는다.
- `createInboxQuestion`은 `targetProfileId`가 같은 `classId`에 속할 때만 생성한다.
- `createAnswer`는 `targetProfileId`, `recorderProfileId`가 전달된 경우 모두 같은 `classId`에 속할 때만 생성한다.
- `createAnswer`에서 `inboxQuestionId`가 전달된 경우, 해당 질문이 같은 `classId`와 `targetProfileId`에 속하고 `isAnswered = false`인 경우에만 생성한다.
- `createAnswer`가 `answerType = "online"`이고 `inboxQuestionId`가 있으면, 답변 생성과 `markInboxQuestionAnswered` 처리는 RPC 또는 transaction으로 묶는 방식을 우선한다.
- RPC 또는 transaction을 쓰지 못하고 API helper로 묶는 경우에는 중복 답변 방지(`is_answered=false` 체크)와 실패 복구를 helper 안에서 처리한다.
- `getAnswersByClass`는 최신순 정렬을 기본값으로 한다.
- `getInboxQuestions`는 전달된 `profileId`가 현재 localStorage의 `todorak:profileId`와 같을 때만 조회한다. 다르면 빈 배열을 반환한다.
- `getInboxQuestions`는 `isAnswered = false`를 우선 보여주고, 필요하면 완료된 질문을 별도 UI에서 보여준다.
- `getInboxQuestions`는 반드시 `class_id` 필터를 포함해야 한다.
- `markInboxQuestionAnswered`는 `id`, `class_id`, `target_profile_id`가 모두 일치하고 `is_answered = false`인 경우에만 `true`로 업데이트한다.
- `getProfileById`, `getInboxQuestionById`, `getAnswerById`, `getAnswersForProfile`처럼 단건/목록 조회 함수는 인자로 받은 `classId`를 Supabase query에 `class_id` 조건으로 함께 건다.
- 예: `getAnswerById(answerId, classId)`는 `id = answerId AND class_id = classId`로 조회한다.
- id 기반 단건 조회는 `id`와 `class_id`가 모두 일치할 때만 반환하고, 아니면 `null`을 반환한다.
- id 기반 목록 조회는 `class_id`가 인자로 받은 `classId`와 같은 row만 반환하고, 다른 class row는 반환하지 않는다.
- API 함수는 Supabase row의 snake_case를 화면 타입의 camelCase로 변환해서 반환한다.

## No Auth Limitation

초기 MVP는 Supabase Auth를 쓰지 않는다. 사용자는 익명이고, 현재 사용자는 localStorage의 `todorak:profileId`로만 판단한다.

명확한 한계:

- 진짜 소유권을 보장할 수 없다.
- 사용자가 브라우저 개발자 도구에서 `todorak:profileId`를 바꾸면 다른 프로필처럼 행동할 수 있다.
- 다른 기기, 다른 브라우저, 시크릿 창에서는 같은 사람임을 알 수 없다.
- Row Level Security로 사용자별 권한을 강하게 막을 수 없다.
- 발표/시연에서는 "로그인 없는 MVP라서 profileId 기반으로 흐름만 시뮬레이션한다"고 설명한다.

최소 노출 정책:

- `answers`와 프로필 기본 정보는 class 안에서 public feed와 탐색 화면에 노출될 수 있다.
- `contact_methods`는 프로필 상세나 연락 목적 UI에서만 노출하고, 프로필 목록 조회의 기본 select에는 포함하지 않는다.
- `inbox_questions`는 현재 `profileId`와 같은 `targetProfileId` 기준으로만 조회한다.
- 위 정책은 강한 보안 경계가 아니라 Auth 없는 MVP의 최소 노출 규칙이다.

MVP에서 허용하는 이유:

- 수업 발표용 팀빌딩 흐름 검증이 우선이다.
- 계정 생성 마찰 없이 온보딩, 질문, 답변 피드를 빠르게 보여준다.
- 실제 서비스 전환 시 Supabase Auth와 RLS를 별도 이슈로 추가해야 한다.

## Live/Demo Class Separation

live와 demo는 같은 schema를 공유하고 `classes` row만 다르게 둔다.

정책:

- live class: `WEBPROGRAMMING_2026`
- demo class: `DEMO_LONGTERM`
- demo seed 데이터는 `DEMO_LONGTERM` class에만 넣는다.
- live class 데이터를 발표 리셋 용도로 삭제하지 않는다.
- URL query의 `class` 값을 바꿔 같은 앱에서 live/demo를 전환한다.

## Implementation Checklist

GitHub Issue 완료 기준으로 사용할 체크리스트다.

- [ ] `classes` 테이블을 만들고 `WEBPROGRAMMING_2026`, `DEMO_LONGTERM` row를 seed한다.
- [ ] `profiles` 테이블을 만들고 `contact_methods` jsonb 필드를 포함한다.
- [ ] `inbox_questions` 테이블을 만든다. `questions` 테이블은 만들지 않는다.
- [ ] `answers` 테이블을 만들고 `answer_type`에 `first`, `inperson`, `online`만 허용한다.
- [ ] `classes.code` unique, `answer_type` DB check constraint, 배열/json 기본값을 DB constraint/default로 강제한다.
- [ ] `lib/questions.ts`의 `QUESTIONS`는 추천 질문 템플릿 상수로 유지한다.
- [ ] `classCode`와 `classId`를 혼용하지 않는다.
- [ ] 화면에서 사용할 localStorage key를 `todorak:classCode`, `todorak:classId`, `todorak:profileId`로 맞춘다.
- [ ] `/?class=...`, `/onboarding?class=...` URL 정책을 적용한다.
- [ ] 화면 컴포넌트에서 Supabase query를 직접 쓰지 않고 계약 API 함수만 호출한다.
- [ ] 계약 문서에 없는 DB column, TypeScript field, localStorage key, URL query, API 함수/파라미터를 추가하지 않는다.
- [ ] 모든 조회 query는 API 내부에서 현재 `todorak:classId` 기준 `class_id` 필터를 적용한다.
- [ ] id 기반 조회는 `id`와 `class_id` 조건을 함께 사용한다.
- [ ] `updateProfile`은 현재 `todorak:profileId`와 같은 프로필만 수정한다.
- [ ] `getInboxQuestions`는 현재 `todorak:profileId`와 같은 프로필 대상만 조회한다.
- [ ] create/update 시 전달된 profile/question/answer id가 같은 class에 속하는지 검증한다.
- [ ] online answer 생성과 inbox answered 처리는 RPC/transaction 우선으로 묶고, helper 사용 시 중복 방지와 실패 복구를 구현한다.
- [ ] `contact_methods`는 프로필 목록 조회의 기본 select에서 제외한다.
- [ ] `inbox_questions`는 현재 `profileId` 대상만 조회한다.
- [x] `ContactMethod`는 `email`과 `link`만 허용한다.
- [x] 인스타그램, 오픈채팅, 개인 웹사이트는 모두 `type: "link"`로 저장한다.
- [ ] 첫 답변은 `answers`에 `answer_type = "first"`로 저장하고 `inbox_questions` row를 만들지 않는다.
- [x] `CollaborationStyle`과 `collaborationStyle`은 Supabase 계약 타입에서 제거한다.
- [ ] Auth 없음 한계를 README 또는 발표 자료에 그대로 옮긴다.
- [ ] demo seed 데이터는 `DEMO_LONGTERM` class에만 넣고 live class와 섞지 않는다.
