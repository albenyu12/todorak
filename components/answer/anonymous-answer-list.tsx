// ⚠️ 중요: 이 컴포넌트와 하위 AnswerCard는 답변자 이름을 절대 노출하지 않습니다.
// Answer 타입에는 targetStudentId만 있고, 이름은 답변 상세 페이지에서만 조회합니다.
// 이 파일에 answer.targetStudentName 또는 학생 이름을 렌더링하는 코드를 추가하지 마세요.

import { Answer } from "@/lib/types";
import AnswerCard from "./answer-card";
import EmptyAnswerState from "./empty-answer-state";

interface AnonymousAnswerListProps {
  answers: Answer[];
}

// TODO (H): 정렬 기능 추가
// 입력값: answers 배열, sortOrder 상태 ("latest" | "oldest")
// 해야 할 일: 최신순/오래된 순 토글 버튼 추가, recordedAt 기준으로 정렬
// 완료 기준: 정렬 버튼 클릭 시 리스트 순서가 즉시 바뀜

// TODO (H): 카테고리 필터 추가 (선택)
// 입력값: answers 배열, activeCategory 상태
// 해야 할 일: QUESTIONS에서 각 answer의 questionId로 category 조회 후 필터링
// 완료 기준: 카테고리 탭 클릭 시 해당 카테고리 답변만 표시

export default function AnonymousAnswerList({ answers }: AnonymousAnswerListProps) {
  if (answers.length === 0) {
    return <EmptyAnswerState />;
  }

  return (
    <div className="flex flex-col gap-3">
      {/* TODO (H): 정렬/필터 컨트롤 UI */}
      {answers.map((answer) => (
        <AnswerCard key={answer.id} answer={answer} />
      ))}
    </div>
  );
}
