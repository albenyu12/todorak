"use client";

import { useEffect, useState } from "react";
import { getAnswersForProfile } from "@/lib/api/answers";
import { Answer } from "@/lib/api/types";
import { getStoredClassId } from "@/lib/client-session";
import { useIsClient } from "@/lib/use-is-client";
import AnswerCard from "@/components/answer/answer-card";

interface StudentAnswersProps {
  studentId: string;
  highlightAnswerId?: string | null;
  excludeAnswerId?: string | null;
}

export default function StudentAnswers({
  studentId,
  highlightAnswerId,
  excludeAnswerId,
}: StudentAnswersProps) {
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
        const data = await getAnswersForProfile(studentId, classId);
        const visibleAnswers = excludeAnswerId
          ? data.filter((answer) => answer.id !== excludeAnswerId)
          : data;

        // Reorder if highlightAnswerId is present
        if (highlightAnswerId) {
          const sorted = [...visibleAnswers].sort((a, b) => {
            if (a.id === highlightAnswerId) return -1;
            if (b.id === highlightAnswerId) return 1;
            return 0;
          });
          setAnswers(sorted);
        } else {
          setAnswers(visibleAnswers);
        }
      } catch (err) {
        console.error("Failed to fetch student answers:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchAnswers();
  }, [isClient, studentId, highlightAnswerId, excludeAnswerId]);

  if (!isClient || loading || answers.length === 0) return null;

  return (
    <div className="mt-8">
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
        이 학생의 답변
      </h2>
      <div className="flex flex-col gap-3">
        {answers.map((answer) => (
          <AnswerCard
            key={answer.id}
            answer={answer}
            isHighlighted={answer.id === highlightAnswerId}
          />
        ))}
      </div>
    </div>
  );
}
