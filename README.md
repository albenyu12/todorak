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
app/
components/
  ├─ ui/
  │   ├─ button.tsx
  │   ├─ card.tsx
  │   ├─ input.tsx
  │   ├─ textarea.tsx
  │   └─ badge.tsx
  ├─ layout/
  │   ├─ header.tsx
  │   └─ bottom-nav.tsx
  ├─ question/
  │   ├─ recommended-question-list.tsx
  │   ├─ question-form.tsx
  │   └─ answer-record-form.tsx
  ├─ answer/
  │   ├─ answer-card.tsx
  │   ├─ anonymous-answer-list.tsx
  │   └─ empty-answer-state.tsx
  ├─ profile/
  └─ student/
lib/
  ├─ types.ts
  ├─ recommendation.ts
  ├─ validators.ts
  ├─ questions.ts
  ├─ mock-students.ts
  ├─ mock-answers.ts
  └─ localStorage.ts
```

## 개발 컨벤션

브랜치 전략, 커밋 규칙, 파일 오너십, 핵심 코드 규칙은 [CONVENTIONS.md](./CONVENTIONS.md)를 참고하세요.
