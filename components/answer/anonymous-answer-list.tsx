// ⚠️ 중요: 이 컴포넌트와 하위 AnswerCard는 답변자 이름을 절대 노출하지 않습니다.
// Answer 타입에는 targetStudentId만 있고, 이름은 답변 상세 페이지에서만 조회합니다.
// 이 파일에 answer.targetStudentName 또는 학생 이름을 렌더링하는 코드를 추가하지 마세요.

"use client";

import { useState } from "react";
import { Answer, QuestionCategory } from "@/lib/types";
import { QUESTIONS } from "@/lib/questions";
import AnswerCard from "./answer-card";
import EmptyAnswerState from "./empty-answer-state";

interface AnonymousAnswerListProps {
  answers: Answer[];
}

type SortOrder = "latest" | "oldest";
type CategoryFilter = "all" | QuestionCategory;

const CATEGORY_LABELS: Record<QuestionCategory, string> = {
  collaboration: "협업",
  role: "역할",
  conflict: "갈등",
  work_style: "작업 방식",
  interest: "관심사",
  goal: "목표",
};

const tabClass = (active: boolean) =>
  `rounded-lg px-3 py-1.5 text-xs ${
    active
      ? "bg-indigo-100 font-medium text-indigo-700"
      : "text-gray-500 hover:bg-gray-100"
  }`;

// questionId로 QUESTIONS에서 카테고리 조회 (직접 입력 질문은 null)
function getAnswerCategory(answer: Answer): QuestionCategory | null {
  const qid = answer.questionTemplateId || answer.questionId;
  if (!qid) return null;
  return QUESTIONS.find((q) => q.id === qid)?.category ?? null;
}

export default function AnonymousAnswerList({ answers }: AnonymousAnswerListProps) {
  const [sortOrder, setSortOrder] = useState<SortOrder>("latest");
  // "all"이면 전체, 특정 카테고리면 해당 답변만 표시
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("all");

  if (answers.length === 0) {
    return <EmptyAnswerState />;
  }

  const filteredAnswers =
    activeCategory === "all"
      ? answers
      : answers.filter(
          (answer) => getAnswerCategory(answer) === activeCategory,
        );

  const sortedAnswers = [...filteredAnswers].sort((a, b) => {
    const timeA = new Date(a.createdAt || a.recordedAt || 0).getTime();
    const timeB = new Date(b.createdAt || b.recordedAt || 0).getTime();
    const diff = timeA - timeB;
    return sortOrder === "latest" ? -diff : diff;
  });

  return (
    <div className="flex flex-col gap-3">
      {/* 카테고리 탭: QUESTIONS 기준으로 필터 */}
      <div className="flex flex-wrap gap-2">
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

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={() => setSortOrder("latest")}
          className={tabClass(sortOrder === "latest")}
        >
          최신순
        </button>
        <button
          type="button"
          onClick={() => setSortOrder("oldest")}
          className={tabClass(sortOrder === "oldest")}
        >
          오래된순
        </button>
      </div>

      {sortedAnswers.length === 0 ? (
        <p className="py-12 text-center text-sm text-gray-400">
          이 카테고리에 해당하는 답변이 없어요.
        </p>
      ) : (
        sortedAnswers.map((answer) => (
          <AnswerCard key={answer.id} answer={answer} />
        ))
      )}
    </div>
  );
}
