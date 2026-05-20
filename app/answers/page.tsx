"use client";

import { useEffect, useState } from "react";
import { Answer } from "@/lib/types";
import { getAnswers } from "@/lib/localStorage";
import AnswerCard from "@/components/answer/AnswerCard";
import Link from "next/link";

export default function AnswersPage() {
  const [answers, setAnswers] = useState<Answer[]>([]);

  useEffect(() => {
    setAnswers(getAnswers().reverse());
  }, []);

  return (
    <div className="page-container">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">익명 Q&A</h1>
      <p className="text-sm text-gray-500 mb-6">기록된 대화들을 확인하세요.</p>

      {answers.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-400 mb-4">아직 기록된 대화가 없어요.</p>
          <Link href="/recommendations" className="btn-primary max-w-xs mx-auto">
            팀원 탐색하러 가기
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {answers.map((answer) => (
            <AnswerCard key={answer.id} answer={answer} />
          ))}
        </div>
      )}
    </div>
  );
}
