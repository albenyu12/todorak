"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getAnswersByClass } from "@/lib/api/answers";
import { Answer } from "@/lib/api/types";
import {
  getClassCodeFromSearchParams,
  getStoredClassCode,
  getStoredClassId,
  getStoredProfileId,
  withClassCode,
} from "@/lib/client-session";
import { useIsClient } from "@/lib/use-is-client";
import AnonymousAnswerList from "@/components/answer/anonymous-answer-list";

function AnswersContent() {
  const searchParams = useSearchParams();
  const isClient = useIsClient();
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const classCode = getClassCodeFromSearchParams(searchParams) ?? (isClient ? getStoredClassCode() : null);
  const inboxHref = classCode ? withClassCode("/inbox", classCode) : "/inbox";
  const onboardingHref = classCode ? withClassCode("/onboarding", classCode) : "/onboarding";

  useEffect(() => {
    if (!isClient) return;
    let isActive = true;

    async function fetchAnswers() {
      const classId = getStoredClassId();
      const profileId = getStoredProfileId();

      setLoading(true);
      setHasProfile(null);

      if (!classId || !profileId) {
        if (isActive) {
          setHasProfile(false);
          setLoading(false);
        }
        return;
      }

      setHasProfile(true);

      try {
        const data = await getAnswersByClass(classId!);
        if (isActive) {
          setAnswers(data);
        }
      } catch (err) {
        console.error("Failed to fetch answers:", err);
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    }

    fetchAnswers();

    return () => {
      isActive = false;
    };
  }, [isClient]);

  if (!isClient) return null;

  return (
    <div className="page-container">
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-bold text-gray-900">익명 Q&A</h1>
        {hasProfile === true && (
          <Link
            href={inboxHref}
            className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full hover:bg-indigo-100 transition-colors"
          >
            나의 질문함 →
          </Link>
        )}
      </div>
      <p className="text-sm text-gray-500 mb-6">기록된 대화들을 확인하세요.</p>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
        </div>
      ) : hasProfile === false ? (
        <div className="flex flex-col items-center gap-4 py-12 text-center">
          <p className="text-gray-500">
            Q&amp;A를 보려면 프로필을 먼저 만들어주세요.
          </p>
          <Link href={onboardingHref} className="btn-primary max-w-xs">
            프로필 만들기
          </Link>
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
