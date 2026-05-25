// ⚠️ 중요: 이 컴포넌트와 하위 AnswerCard는 답변자 이름을 절대 노출하지 않습니다.
// Answer 타입에는 targetStudentId만 있고, 이름은 답변 상세 페이지에서만 조회합니다.
// 이 파일에 answer.targetStudentName 또는 학생 이름을 렌더링하는 코드를 추가하지 마세요.

"use client";

import { useState } from "react";
import { Answer } from "@/lib/types";
import AnswerCard from "./answer-card";
import EmptyAnswerState from "./empty-answer-state";

interface AnonymousAnswerListProps {
  answers: Answer[];
}

type SortOrder = "latest" | "oldest";

// TODO (H): 카테고리 필터 추가 (선택)
// 입력값: answers 배열, activeCategory 상태
// 해야 할 일: QUESTIONS에서 각 answer의 questionId로 category 조회 후 필터링
// 완료 기준: 카테고리 탭 클릭 시 해당 카테고리 답변만 표시

export default function AnonymousAnswerList({ answers }: AnonymousAnswerListProps) {
  // recordedAt 기준 정렬 방향 (최신순 / 오래된순)
  const [sortOrder, setSortOrder] = useState<SortOrder>("latest");

  if (answers.length === 0) {
    return <EmptyAnswerState />;
  }

  const sortedAnswers = [...answers].sort((a, b) => {
    const diff =
      new Date(a.recordedAt).getTime() - new Date(b.recordedAt).getTime();
    return sortOrder === "latest" ? -diff : diff;
  });

  return (
    <div className="flex flex-col gap-3">
      {/* 정렬 토글: 클릭 시 recordedAt 기준으로 목록 순서 즉시 변경 */}
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={() => setSortOrder("latest")}
          className={`rounded-lg px-3 py-1.5 text-xs ${
            sortOrder === "latest"
              ? "bg-indigo-100 font-medium text-indigo-700"
              : "text-gray-500 hover:bg-gray-100"
          }`}
        >
          최신순
        </button>
        <button
          type="button"
          onClick={() => setSortOrder("oldest")}
          className={`rounded-lg px-3 py-1.5 text-xs ${
            sortOrder === "oldest"
              ? "bg-indigo-100 font-medium text-indigo-700"
              : "text-gray-500 hover:bg-gray-100"
          }`}
        >
          오래된순
        </button>
      </div>
      {sortedAnswers.map((answer) => (
        <AnswerCard key={answer.id} answer={answer} />
      ))}
    </div>
  );
}
