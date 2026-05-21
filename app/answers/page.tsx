"use client";

import { useEffect, useState } from "react";
import { Answer } from "@/lib/types";
import { getAnswers } from "@/lib/localStorage";
import AnonymousAnswerList from "@/components/answer/anonymous-answer-list";

export default function AnswersPage() {
  const [answers, setAnswers] = useState<Answer[]>([]);

  useEffect(() => {
    setAnswers(getAnswers().reverse());
  }, []);

  return (
    <div className="page-container">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">익명 Q&A</h1>
      <p className="text-sm text-gray-500 mb-6">기록된 대화들을 확인하세요.</p>
      <AnonymousAnswerList answers={answers} />
    </div>
  );
}
