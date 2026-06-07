"use client";

import { useEffect, useState } from "react";
import { getAnswersByClass } from "@/lib/api/answers";
import { Answer } from "@/lib/api/types";
import { getStoredClassId } from "@/lib/client-session";
import { useIsClient } from "@/lib/use-is-client";
import AnonymousAnswerList from "@/components/answer/anonymous-answer-list";

export default function AnswersPage() {
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
        const data = await getAnswersByClass(classId!);
        setAnswers(data);
      } catch (err) {
        console.error("Failed to fetch answers:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchAnswers();
  }, [isClient]);

  if (!isClient) return null;

  return (
    <div className="page-container">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">익명 Q&A</h1>
      <p className="text-sm text-gray-500 mb-6">기록된 대화들을 확인하세요.</p>
      
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
        </div>
      ) : (
        <AnonymousAnswerList answers={answers} />
      )}
    </div>
  );
}
