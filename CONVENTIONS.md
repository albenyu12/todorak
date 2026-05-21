# 협업 컨벤션

## 1. Branch

```
main          안정 배포 버전 (팀장만 머지)
dev           통합 개발 브랜치 (모든 PR 대상)
feat/<작업>-<담당>   기능 개발
fix/<작업>-<담당>    버그 수정
chore/<작업>-<담당>  설정/문서/구조
```

예시: `feat/question-form-h`, `fix/answer-card-h`, `chore/conventions-j`

## 2. PR

- 모든 PR은 `dev` 브랜치로 보낸다.
- `main` 머지는 팀장(J)만 한다.
- 하나의 PR에 하나의 기능 또는 작업만 포함한다.
- `lib/types.ts`, `app/layout.tsx`, `app/globals.css` 수정 시 PR 설명에 반드시 명시한다.

## 3. Commit

[Conventional Commits](https://www.conventionalcommits.org/) 스타일 사용.

| type | 용도 |
|------|------|
| `feat` | 새로운 기능 |
| `fix` | 버그 수정 |
| `style` | UI/스타일 변경 |
| `refactor` | 동작 변경 없는 구조 개선 |
| `chore` | 설정/빌드/패키지/구조 |
| `docs` | 문서 변경 |

예시: `feat: add recommended question list`, `fix: hide student name in answer list`

## 4. File Ownership

다른 담당자 파일 수정 시 사전 공유 필수.

| 담당 | 영역 |
|------|------|
| J (지원) | `app/`, `components/profile/`, `components/student/`, `lib/localStorage.ts` |
| Y (용현) | `lib/types.ts`, `lib/mock-*.ts`, `lib/questions.ts`, `lib/recommendation.ts`, `lib/validators.ts` |
| H (호중) | `components/question/`, `components/answer/` |
| B (봄이) | `components/ui/`, `components/layout/`, `app/globals.css` |

## 5. 핵심 규칙

**파일명은 kebab-case** — `answer-card.tsx` O, `AnswerCard.tsx` X

**공통 타입 import 경로** — `@/lib/types` 사용, `@/types` 사용 금지

**Answer에 이름 없음** — `Answer` 타입에 학생 이름 필드 추가 금지. 전체 Q&A 리스트에서 답변자 이름 노출 금지. 이름이 필요하면 `targetStudentId`로 `MOCK_STUDENTS`에서 조회.

## 6. MVP 범위

- 로그인/인증/DB/실시간 기능 구현 금지
- 새 라이브러리 추가 및 `package.json` 수정은 팀장(J) 승인 후 진행
