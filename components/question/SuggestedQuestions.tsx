// TODO (H): 카테고리 탭 필터 UI 구현 (icebreaker / work-style / values / skills)
// TODO (H): 질문 선택 시 QuestionForm의 custom input 초기화 처리

import { Question } from "@/types";
import QuestionCard from "./QuestionCard";

interface SuggestedQuestionsProps {
  questions: Question[];
  selectedQuestionId: string | null;
  onSelect: (question: Question) => void;
}

export default function SuggestedQuestions({
  questions,
  selectedQuestionId,
  onSelect,
}: SuggestedQuestionsProps) {
  return (
    <div>
      <p className="mb-2 text-sm font-medium text-gray-700">추천 질문 선택</p>
      <div className="flex flex-col gap-2">
        {questions.map((q) => (
          <QuestionCard
            key={q.id}
            question={q}
            isSelected={selectedQuestionId === q.id}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
}
