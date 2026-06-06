"use client";

import { getAnswers } from "@/lib/localStorage";
import { useIsClient } from "@/lib/use-is-client";
import AnonymousAnswerList from "@/components/answer/anonymous-answer-list";

export default function AnswersPage() {
  const isClient = useIsClient();
  const answers = isClient ? [...getAnswers()].reverse() : [];

  return (
    <div className="page-container">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">익명 Q&A</h1>
      <p className="text-sm text-gray-500 mb-6">기록된 대화들을 확인하세요.</p>
      <AnonymousAnswerList answers={answers} />
    </div>
  );
}
