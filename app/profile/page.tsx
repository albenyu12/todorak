"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  getCurrentUser,
  getAnswers,
  getAnonymousQuestionsFor,
} from "@/lib/localStorage";
import { useIsClient } from "@/lib/use-is-client";
import AnswerCard from "@/components/answer/answer-card";

export default function ProfilePage() {
  const router = useRouter();
  const isClient = useIsClient();
  const user = isClient ? getCurrentUser() : null;
  const myAnswers = user
    ? getAnswers().filter((a) => a.targetStudentId === user.id)
    : [];
  const pendingQuestions = user ? getAnonymousQuestionsFor(user.id) : [];

  useEffect(() => {
    if (!isClient) return;
    if (!getCurrentUser()) {
      router.replace("/onboarding");
    }
  }, [isClient, router]);

  if (!isClient || !user) return null;

  return (
    <div className="page-container">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">내 프로필</h1>
        <Link href="/onboarding?edit=true" className="text-sm text-indigo-600 hover:underline">
          수정
        </Link>
      </div>

      {/* 내 정보 */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 text-lg font-bold">
            {user.avatarInitial ?? user.name[0]}
          </div>
          <div>
            <p className="font-bold text-gray-900">{user.name}</p>
            <p className="text-sm text-gray-500">{user.department} · {user.year}학년</p>
            <div className="mt-1 flex flex-wrap gap-1.5">
              {user.roles.map((role) => (
                <span key={role} className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700">
                  {role}
                </span>
              ))}
            </div>
          </div>
        </div>
        {user.bio && (
          <p className="mt-3 text-sm text-gray-600 leading-relaxed">{user.bio}</p>
        )}
      </div>

      {/* 받은 질문 요약 */}
      <Link href="/inbox">
        <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-4 mb-6 flex items-center justify-between hover:bg-indigo-100 transition-colors">
          <div>
            <p className="text-sm font-semibold text-indigo-800">받은 질문</p>
            <p className="text-xs text-indigo-500 mt-0.5">
              {pendingQuestions.length > 0
                ? `${pendingQuestions.length}개 답변 대기 중`
                : "새로운 질문이 없어요"}
            </p>
          </div>
          <span className="text-indigo-400 text-lg">›</span>
        </div>
      </Link>

      {/* 내가 답변한 질문 */}
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
        내가 답변한 질문
      </h2>
      {myAnswers.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-8">아직 답변한 질문이 없어요.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {myAnswers.map((answer) => (
            <AnswerCard key={answer.id} answer={answer} />
          ))}
        </div>
      )}
    </div>
  );
}
