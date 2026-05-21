# 토도락

질문으로 시작하는 팀빌딩 탐색 서비스

## 서비스 소개

프로필을 작성하면 관심사·스킬 기반으로 팀원 후보를 추천받고, 추천 질문을 골라 대면 대화를 유도합니다. 나눈 대화는 익명 Q&A로 기록되어 팀 탐색에 활용됩니다.

## 기술 스택

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4
- localStorage (로그인·DB 없음, mock data 기반)

## 시작하기

```bash
npm install
npm run dev
```

http://localhost:3000 에서 확인

## 주요 라우트

| 경로 | 설명 |
|------|------|
| `/` | 홈 |
| `/onboarding` | 프로필 작성 |
| `/recommendations` | 추천 학생 목록 |
| `/students/[id]` | 학생 프로필 상세 |
| `/students/[id]/ask` | 질문 선택 |
| `/students/[id]/record` | 답변 기록 |
| `/answers` | 익명 Q&A 목록 |
| `/answers/[id]` | 답변 상세 |

## 폴더 구조

```
app/                        # 페이지 (App Router) — 지원
components/
  ├─ ui/                    # 공통 UI 컴포넌트 — 봄이
  │   ├─ button.tsx
  │   ├─ card.tsx
  │   ├─ input.tsx
  │   ├─ textarea.tsx
  │   └─ badge.tsx
  ├─ layout/                # 레이아웃 — 봄이
  │   ├─ header.tsx
  │   └─ bottom-nav.tsx
  ├─ question/              # 질문/답변 기록 — 호중
  │   ├─ recommended-question-list.tsx
  │   ├─ question-form.tsx
  │   └─ answer-record-form.tsx
  ├─ answer/                # Q&A 리스트/카드 — 호중
  │   ├─ answer-card.tsx
  │   ├─ anonymous-answer-list.tsx
  │   └─ empty-answer-state.tsx
  ├─ profile/
  └─ student/
lib/
  ├─ types.ts               # 공유 타입
  ├─ recommendation.ts      # 추천 알고리즘 — 용현
  ├─ validators.ts          # 입력 검증 — 용현
  ├─ questions.ts           # 추천 질문 데이터 — 용현
  ├─ mock-students.ts       # mock 학생 데이터 — 용현
  ├─ mock-answers.ts        # mock 답변 데이터 — 용현
  └─ localStorage.ts        # 로컬 저장소 유틸
```

## 파일 오너십

| 팀원 | 역할 | 담당 파일 |
|------|------|-----------|
| 지원 (J) | app 라우팅, 핵심 플로우, 통합, 배포 | `app/`, `components/profile/`, `components/student/`, `lib/localStorage.ts` |
| 용현 (Y) | lib 데이터/추천/검증 로직 | `lib/recommendation.ts`, `lib/validators.ts`, `lib/questions.ts`, `lib/mock-students.ts`, `lib/mock-answers.ts` |
| 호중 (H) | Q&A 인터랙션 컴포넌트 | `components/question/`, `components/answer/` |
| 봄이 (B) | UI 컴포넌트 polish, 레이아웃 | `components/ui/`, `components/layout/`, `app/globals.css` |
