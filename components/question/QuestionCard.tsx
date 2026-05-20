// TODO (H): 선택된 질문 하이라이트 스타일 개선
// TODO (H): 카테고리별 아이콘 추가

import { Question } from "@/types";

interface QuestionCardProps {
  question: Question;
  isSelected: boolean;
  onSelect: (question: Question) => void;
}

export default function QuestionCard({ question, isSelected, onSelect }: QuestionCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(question)}
      className={`w-full rounded-lg border px-4 py-3 text-left text-sm transition-colors ${
        isSelected
          ? "border-indigo-500 bg-indigo-50 text-indigo-900"
          : "border-gray-200 bg-white text-gray-700 hover:border-indigo-200"
      }`}
    >
      <span className="mr-2 text-xs text-gray-400">[{question.category}]</span>
      {question.text}
    </button>
  );
}
