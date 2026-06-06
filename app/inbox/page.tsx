"use client";

import Link from "next/link";
import { getCurrentUser, getAnonymousQuestionsFor } from "@/lib/localStorage";
import { useIsClient } from "@/lib/use-is-client";

export default function InboxPage() {
  const isClient = useIsClient();
  const user = isClient ? getCurrentUser() : null;
  const questions = user ? [...getAnonymousQuestionsFor(user.id)].reverse() : [];

  if (!isClient) return null;

  if (!user) {
    return (
      <div className="page-container flex flex-col items-center text-center py-16 gap-4">
        <p className="text-gray-500">받은 질문을 보려면 프로필을 먼저 만들어주세요.</p>
        <Link href="/onboarding" className="btn-primary max-w-xs">
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
              href={`/inbox/${q.id}`}
              className="rounded-xl border border-gray-200 bg-white p-4 hover:border-indigo-300 hover:shadow-sm transition-all"
            >
              <p className="text-sm font-medium text-gray-800">{q.questionText}</p>
              <p className="mt-1 text-xs text-gray-400">
                {new Date(q.createdAt).toLocaleDateString("ko-KR")}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
