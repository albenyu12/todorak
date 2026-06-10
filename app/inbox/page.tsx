"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getInboxQuestions } from "@/lib/api/inbox-questions";
import { InboxQuestion } from "@/lib/api/types";
import { getStoredClassCode, getStoredProfileId, getStoredClassId, withClassCode } from "@/lib/client-session";
import { useIsClient } from "@/lib/use-is-client";

export default function InboxPage() {
  const isClient = useIsClient();
  const [questions, setQuestions] = useState<InboxQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [profileId, setProfileId] = useState<string | null>(null);
  const classCode = isClient ? getStoredClassCode() : null;
  const onboardingHref = classCode ? withClassCode("/onboarding", classCode) : "/onboarding";

  useEffect(() => {
    if (!isClient) return;

    async function fetchQuestions() {
      const pid = getStoredProfileId();
      const cid = getStoredClassId();
      setProfileId(pid);

      if (!pid || !cid) {
        setLoading(false);
        return;
      }

      try {
        const data = await getInboxQuestions(pid!, cid!);
        // 답변하지 않은 질문을 먼저 보여주되, 답변 완료 질문도 함께 표시합니다.
        setQuestions(data);
      } catch (err) {
        console.error("Failed to fetch inbox questions:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchQuestions();
  }, [isClient]);

  if (!isClient) return null;

  if (loading) {
    return (
      <div className="page-container flex justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!profileId) {
    return (
      <div className="page-container flex flex-col items-center text-center py-16 gap-4">
        <p className="text-gray-500">받은 질문을 보려면 프로필을 먼저 만들어주세요.</p>
        <Link href={onboardingHref} className="btn-primary max-w-xs">
          프로필 만들기
        </Link>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">받은 질문</h1>
      <p className="text-sm text-gray-500 mb-6">나에게 온 익명 질문에 답변해보세요.</p>

      {questions.length === 0 ? (
        <div className="flex flex-col items-center text-center py-16 gap-2">
          <p className="text-gray-400">아직 받은 질문이 없어요.</p>
          <p className="text-sm text-gray-300">팀원이 질문을 남기면 여기서 확인할 수 있어요.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {questions.map((q) => (
            <Link
              key={q.id}
              href={classCode ? withClassCode(`/inbox/${q.id}`, classCode) : `/inbox/${q.id}`}
              className={`rounded-xl border p-4 transition-all ${
                q.isAnswered
                  ? "bg-gray-50 border-gray-100 opacity-60"
                  : "bg-white border-gray-200 hover:border-indigo-300 hover:shadow-sm"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <p className={`text-sm font-medium ${q.isAnswered ? "text-gray-500" : "text-gray-800"}`}>
                  {q.questionText}
                </p>
                {q.isAnswered && (
                  <span className="text-[10px] bg-gray-200 text-gray-500 px-1.5 py-0.5 rounded">답변완료</span>
                )}
              </div>
              <p className="text-xs text-gray-400">
                {new Date(q.createdAt).toLocaleDateString("ko-KR")}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
