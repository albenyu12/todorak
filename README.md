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
app/                  # 페이지 (App Router)
components/
  ├─ answer/          # 호중 담당
  ├─ question/        # 호중 담당
  ├─ profile/
  ├─ student/
  └─ layout/
lib/
  ├─ data/            # 용현 담당
  ├─ recommendation/  # 용현 담당
  └─ validators/      # 용현 담당
types/                # 공유 타입
```

## 팀 역할

| 팀원 | 담당 |
|------|------|
| 지원 (J) | 프로젝트 셋업, 전체 구조, 페이지 연결 |
| 호중 (H) | `components/question/`, `components/answer/` |
| 용현 (Y) | `lib/data/`, `lib/recommendation/`, `lib/validators/` |
| 봄이 (B) | 디자인 polish |
