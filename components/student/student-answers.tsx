"use client";

import { useEffect, useState } from "react";
import { Answer } from "@/lib/types";
import { getAnswers } from "@/lib/localStorage";
import AnswerCard from "@/components/answer/answer-card";

interface StudentAnswersProps {
  studentId: string;
}

export default function StudentAnswers({ studentId }: StudentAnswersProps) {
  const [answers, setAnswers] = useState<Answer[]>([]);

  useEffect(() => {
    setAnswers(getAnswers().filter((a) => a.targetStudentId === studentId));
  }, [studentId]);

  if (answers.length === 0) return null;

  return (
    <div className="mt-8">
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
        이 학생의 답변
      </h2>
      <div className="flex flex-col gap-3">
        {answers.map((answer) => (
          <AnswerCard key={answer.id} answer={answer} />
        ))}
      </div>
    </div>
  );
}
