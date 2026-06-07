"use client";

import { useEffect, useState } from "react";
import { getAnswersForProfile } from "@/lib/api/answers";
import { Answer } from "@/lib/api/types";
import { getStoredClassId } from "@/lib/client-session";
import { useIsClient } from "@/lib/use-is-client";
import AnswerCard from "@/components/answer/answer-card";

interface StudentAnswersProps {
  studentId: string;
}

export default function StudentAnswers({ studentId }: StudentAnswersProps) {
  const isClient = useIsClient();
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isClient) return;

    async function fetchAnswers() {
      const classId = getStoredClassId();
      if (!classId) {
        setLoading(false);
        return;
      }

      try {
        const data = await getAnswersForProfile(studentId, classId!);
        setAnswers(data);
      } catch (err) {
        console.error("Failed to fetch student answers:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchAnswers();
  }, [isClient, studentId]);

  if (!isClient || loading || answers.length === 0) return null;

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
