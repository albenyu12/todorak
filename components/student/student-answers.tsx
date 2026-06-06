"use client";

import { getAnswers } from "@/lib/localStorage";
import { useIsClient } from "@/lib/use-is-client";
import AnswerCard from "@/components/answer/answer-card";

interface StudentAnswersProps {
  studentId: string;
}

export default function StudentAnswers({ studentId }: StudentAnswersProps) {
  const isClient = useIsClient();
  const answers = isClient
    ? getAnswers().filter((a) => a.targetStudentId === studentId)
    : [];

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
