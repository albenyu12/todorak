"use client";

import { useEffect, useState, Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { getProfileById } from "@/lib/api/profiles";
import { StudentProfile } from "@/lib/api/types";
import { withClassCode } from "@/lib/client-session";
import {
  resolveProtectedProfileSession,
  type ProtectedProfileSessionState,
} from "@/lib/protected-session";
import { useIsClient } from "@/lib/use-is-client";
import QuestionForm from "@/components/question/question-form";

function AskContent() {
  const { studentId } = useParams<{ studentId: string }>();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  const isClient = useIsClient();
  const [sessionState, setSessionState] = useState<
    ProtectedProfileSessionState | { status: "loading" }
  >({ status: "loading" });
  const classCode = sessionState.status === "ready" || sessionState.status === "missingProfile"
    ? sessionState.session.classCode
    : searchParams.get("class");
  const recommendationsHref = classCode ? withClassCode("/recommendations", classCode) : "/recommendations";
  const onboardingHref = classCode ? withClassCode("/onboarding", classCode) : "/onboarding";
  const profileHref = classCode ? withClassCode(`/students/${studentId}`, classCode) : `/students/${studentId}`;
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isClient) return;
    let isActive = true;

    async function fetchStudent() {
      setLoading(true);
      setStudent(null);

      const nextSessionState = await resolveProtectedProfileSession(searchParams);
      if (!isActive) return;

      setSessionState(nextSessionState);

      if (nextSessionState.status !== "ready") {
        setLoading(false);
        return;
      }

      try {
        const res = await getProfileById(studentId, nextSessionState.session.classId);
        if (isActive && res.data) {
          setStudent(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch student profile:", err);
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    }

    fetchStudent();

    return () => {
      isActive = false;
    };
  }, [isClient, searchParams, studentId]);

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

  if (sessionState.status === "missingProfile") {
    return (
      <div className="page-container flex flex-col items-center gap-4 py-16 text-center">
        <p className="text-gray-500">
          질문을 남기려면 프로필을 먼저 만들어주세요.
        </p>
        <Link href={onboardingHref} className="btn-primary max-w-xs">
          프로필 만들기
        </Link>
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

  if (!student) {
    return (
      <div className="page-container text-center py-16">
        <p className="text-gray-400">학생을 찾을 수 없습니다.</p>
        <Link href={recommendationsHref} className="btn-primary mt-4 max-w-xs mx-auto">
          목록으로 돌아가기
        </Link>
      </div>
    );
  }

  const questionMode: "inperson" | "online" =
    mode === "online" ? "online" : "inperson";

  const modeLabel = questionMode === "online" ? "익명으로 질문 남기기" : "대면으로 대화하기";

  return (
    <div className="page-container">
      <Link
        href={profileHref}
        className="mb-4 inline-block text-sm text-gray-400 hover:text-gray-600"
      >
        ← {student.name}님 프로필
      </Link>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">{modeLabel}</h1>
      <p className="text-sm text-gray-500 mb-6">
        {student.name}님에게 물어볼 질문을 선택하거나 직접 입력하세요.
      </p>
      <QuestionForm studentId={studentId} mode={questionMode} />
    </div>
  );
}

export default function AskPage() {
  return (
    <Suspense fallback={
      <div className="page-container flex justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    }>
      <AskContent />
    </Suspense>
  );
}
