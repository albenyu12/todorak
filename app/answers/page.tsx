"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { getAnswersByClass } from "@/lib/api/answers";
import { Answer } from "@/lib/api/types";
import { getStoredClassCode, getStoredClassId, withClassCode } from "@/lib/client-session";
import { useIsClient } from "@/lib/use-is-client";
import AnonymousAnswerList from "@/components/answer/anonymous-answer-list";

function AnswersContent() {
  const isClient = useIsClient();
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(true);
  const classCode = isClient ? getStoredClassCode() : null;
  const inboxHref = classCode ? withClassCode("/inbox", classCode) : "/inbox";

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
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-bold text-gray-900">익명 Q&A</h1>
        <Link
          href={inboxHref}
          className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full hover:bg-indigo-100 transition-colors"
        >
          나의 질문함 →
        </Link>
      </div>
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

export default function AnswersPage() {
  return (
    <Suspense fallback={
      <div className="page-container flex justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    }>
      <AnswersContent />
    </Suspense>
  );
}
