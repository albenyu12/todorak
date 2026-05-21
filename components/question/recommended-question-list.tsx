"use client";

import { RecommendedQuestion, QuestionCategory } from "@/lib/types";
import Badge from "@/components/ui/badge";

interface RecommendedQuestionListProps {
  questions: RecommendedQuestion[];
  selectedQuestionId: string | null;
  onSelect: (question: RecommendedQuestion) => void;
}

// TODO (H): 카테고리 탭 필터 추가 (추후 확장)
// 입력값: questions 배열 (category 포함)
// 해야 할 일: "전체" + 카테고리별 탭 추가, activeCategory 상태로 필터링
// 완료 기준: 탭 클릭 시 질문 목록이 즉시 필터링됨

const CATEGORY_LABELS: Record<QuestionCategory, string> = {
  collaboration: "협업",
  role: "역할",
  conflict: "갈등",
  work_style: "작업 방식",
  interest: "관심사",
  goal: "목표",
};

export default function RecommendedQuestionList({
  questions,
  selectedQuestionId,
  onSelect,
}: RecommendedQuestionListProps) {
  const visible = questions.slice(0, 3);

  return (
    <div className="flex flex-col gap-2">
      {visible.map((q) => (
        <button
          key={q.id}
          type="button"
          onClick={() => onSelect(q)}
          className={`w-full rounded-lg border px-4 py-3 text-left text-sm transition-colors ${
            selectedQuestionId === q.id
              ? "border-indigo-500 bg-indigo-50 text-indigo-900"
              : "border-gray-200 bg-white text-gray-700 hover:border-indigo-200"
          }`}
        >
          <Badge variant="category" className="mr-2">
            {CATEGORY_LABELS[q.category]}
          </Badge>
          {q.text}
        </button>
      ))}
    </div>
  );
}
