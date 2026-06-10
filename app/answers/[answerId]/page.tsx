"use client";

import { useEffect, useState, Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { getAnswerById } from "@/lib/api/answers";
import { Answer } from "@/lib/api/types";
import { withClassCode } from "@/lib/client-session";
import {
  resolveProtectedProfileSession,
  type ProtectedProfileSessionState,
} from "@/lib/protected-session";
import { useIsClient } from "@/lib/use-is-client";

function AnswerDetailContent() {
  const { answerId } = useParams<{ answerId: string }>();
  const searchParams = useSearchParams();
  const isClient = useIsClient();
  const [sessionState, setSessionState] = useState<
    ProtectedProfileSessionState | { status: "loading" }
  >({ status: "loading" });
  const classCode = sessionState.status === "ready" || sessionState.status === "missingProfile"
    ? sessionState.session.classCode
    : searchParams.get("class");
  const answersHref = classCode ? withClassCode("/answers", classCode) : "/answers";
  const onboardingHref = classCode ? withClassCode("/onboarding", classCode) : "/onboarding";
  const [answer, setAnswer] = useState<Answer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isClient) return;
    let isActive = true;

    async function fetchAnswer() {
      setLoading(true);
      setAnswer(null);

      const nextSessionState = await resolveProtectedProfileSession(searchParams);
      if (!isActive) return;

      setSessionState(nextSessionState);

      if (nextSessionState.status !== "ready") {
        setLoading(false);
        return;
      }

      try {
        const res = await getAnswerById(answerId, nextSessionState.session.classId);
        if (isActive && res.data) {
          setAnswer(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch answer:", err);
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    }

    fetchAnswer();

    return () => {
      isActive = false;
    };
  }, [isClient, searchParams, answerId]);

  if (!isClient) return null;

  if (sessionState.status === "invalid") {
    return (
      <div className="page-container text-center py-16">
        <p className="text-gray-400">
          {sessionState.classCode} 수업을 찾을 수 없습니다.
        </p>
      </div>
    );
  }

  if (loading || sessionState.status === "loading") {
    return (
      <div className="page-container flex justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  if (sessionState.status === "missingProfile") {
    return (
      <div className="page-container flex flex-col items-center gap-4 py-16 text-center">
        <p className="text-gray-500">
          Q&amp;A를 보려면 프로필을 먼저 만들어주세요.
        </p>
        <Link href={onboardingHref} className="btn-primary max-w-xs">
          프로필 만들기
        </Link>
      </div>
    );
  }

  if (!answer) {
    return (
      <div className="page-container text-center py-16">
        <p className="text-gray-400">답변을 찾을 수 없습니다.</p>
        <Link href={answersHref} className="btn-primary mt-4 max-w-xs mx-auto">
          Q&A 목록으로
        </Link>
      </div>
    );
  }

  const profileHref = classCode
    ? withClassCode(`/students/${answer.targetProfileId}?contextAnswerId=${answer.id}`, classCode)
    : `/students/${answer.targetProfileId}?contextAnswerId=${answer.id}`;

  return (
    <div className="page-container">
      <Link
        href={answersHref}
        className="mb-4 inline-block text-sm text-gray-400 hover:text-gray-600"
      >
        ← Q&A 목록
      </Link>

      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <div className="rounded-lg bg-indigo-50 px-4 py-3 mb-4">
          <p className="text-xs text-indigo-500 font-medium mb-1">질문</p>
          <p className="text-sm text-indigo-900">{answer.questionText}</p>
        </div>

        <div>
          <p className="text-xs text-gray-400 font-medium mb-1">익명의 학생이 답했습니다</p>
          <p className="text-sm text-gray-800 leading-relaxed">{answer.answerText}</p>
        </div>

        <p className="mt-4 text-xs text-gray-300">
          {new Date(answer.createdAt).toLocaleString("ko-KR")}
        </p>
      </div>

      {answer.targetProfileId && (
        <Link
          href={profileHref}
          className="btn-primary mt-4 text-center"
        >
          이 학생 프로필 보기
        </Link>
      )}
    </div>
  );
}

export default function AnswerDetailPage() {
  return (
    <Suspense fallback={
      <div className="page-container flex justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    }>
      <AnswerDetailContent />
    </Suspense>
  );
}
