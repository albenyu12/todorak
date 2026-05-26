"use client";

import { useState } from "react";
import { RecommendedQuestion, QuestionCategory } from "@/lib/types";
import Badge from "@/components/ui/badge";

interface RecommendedQuestionListProps {
  questions: RecommendedQuestion[];
  selectedQuestionId: string | null;
  onSelect: (question: RecommendedQuestion) => void;
}

const CATEGORY_LABELS: Record<QuestionCategory, string> = {
  collaboration: "협업",
  role: "역할",
  conflict: "갈등",
  work_style: "작업 방식",
  interest: "관심사",
  goal: "목표",
};

type CategoryFilter = "all" | QuestionCategory;

export default function RecommendedQuestionList({
  questions,
  selectedQuestionId,
  onSelect,
}: RecommendedQuestionListProps) {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("all");

  const filteredQuestions =
    activeCategory === "all"
      ? questions
      : questions.filter((q) => q.category === activeCategory);

  const visible = filteredQuestions.slice(0, 3);

  const tabClass = (active: boolean) =>
    `rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
      active
        ? "bg-indigo-100 text-indigo-700"
        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
    }`;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        {/* TODO: 카테고리 변경 시 이미 선택된 질문을 해제할지 UX 정책 결정 필요 */}
        <button
          type="button"
          onClick={() => setActiveCategory("all")}
          className={tabClass(activeCategory === "all")}
        >
          전체
        </button>
        {(Object.keys(CATEGORY_LABELS) as QuestionCategory[]).map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setActiveCategory(category)}
            className={tabClass(activeCategory === category)}
          >
            {CATEGORY_LABELS[category]}
          </button>
        ))}
      </div>
      <div className="flex flex-col gap-2">
        {visible.length === 0 ? (
          <p className="py-4 text-center text-sm text-gray-400">
            해당 카테고리의 질문이 없습니다.
          </p>
        ) : (
          visible.map((q) => (
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
          ))
        )}
      </div>
    </div>
  );
}
