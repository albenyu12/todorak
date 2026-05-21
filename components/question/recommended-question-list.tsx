"use client";

import { useState } from "react";
import { RecommendedQuestion, QuestionCategory } from "@/lib/types";
import Badge from "@/components/ui/badge";

interface RecommendedQuestionListProps {
  questions: RecommendedQuestion[];
  selectedQuestionId: string | null;
  onSelect: (question: RecommendedQuestion) => void;
}

// TODO (H): 카테고리 탭 필터 구현
// 입력값: questions 배열 (category 포함), activeCategory 상태
// 해야 할 일:
//   1. questions에서 중복 없이 category 목록 추출
//   2. "전체" 탭 포함, 탭 클릭 시 activeCategory 변경
//   3. activeCategory === "전체"이면 전체 질문, 아니면 해당 category만 필터링
// 완료 기준: 탭 클릭 시 질문 목록이 즉시 필터링됨

// TODO (H): 질문 선택 카드 스타일
// 입력값: selectedQuestionId와 각 question.id 비교
// 해야 할 일: 선택된 카드에 indigo border + 배경색 적용, 미선택 카드는 회색 테두리
// 완료 기준: 선택된 질문이 한눈에 구분되고, 클릭 시 onSelect 콜백 호출

const CATEGORY_LABELS: Record<QuestionCategory, string> = {
  collaboration: "협업",
  role: "역할",
  conflict: "갈등",
  work_style: "작업 방식",
  interest: "관심사",
  goal: "목표",
};

type FilterCategory = QuestionCategory | "all";

export default function RecommendedQuestionList({
  questions,
  selectedQuestionId,
  onSelect,
}: RecommendedQuestionListProps) {
  const [activeCategory, setActiveCategory] = useState<FilterCategory>("all");

  const categories = Array.from(new Set(questions.map((q) => q.category)));
  const filtered =
    activeCategory === "all"
      ? questions
      : questions.filter((q) => q.category === activeCategory);

  return (
    <div>
      {/* TODO (H): 카테고리 탭 UI — 스크롤 가능한 수평 탭으로 개선 */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-3">
        <button
          type="button"
          onClick={() => setActiveCategory("all")}
          className={`flex-shrink-0 rounded-full border px-3 py-1 text-xs transition-colors ${
            activeCategory === "all"
              ? "border-indigo-500 bg-indigo-500 text-white"
              : "border-gray-200 text-gray-500 hover:border-indigo-200"
          }`}
        >
          전체
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat)}
            className={`flex-shrink-0 rounded-full border px-3 py-1 text-xs transition-colors ${
              activeCategory === cat
                ? "border-indigo-500 bg-indigo-500 text-white"
                : "border-gray-200 text-gray-500 hover:border-indigo-200"
            }`}
          >
            {CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      {/* 질문 카드 목록 */}
      <div className="flex flex-col gap-2">
        {filtered.map((q) => (
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
    </div>
  );
}
