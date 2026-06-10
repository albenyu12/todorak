"use client";

import { useEffect, useState, Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { getProfileById } from "@/lib/api/profiles";
import { getAnswerById } from "@/lib/api/answers";
import { StudentProfile, Answer } from "@/lib/api/types";
import { getStoredClassCode, getStoredClassId, withClassCode } from "@/lib/client-session";
import { useIsClient } from "@/lib/use-is-client";
import ProfileCard from "@/components/profile/profile-card";
import StudentAnswers from "@/components/student/student-answers";
import AnswerCard from "@/components/answer/answer-card";

function StudentProfileContent() {
  const { studentId } = useParams<{ studentId: string }>();
  const searchParams = useSearchParams();
  const contextAnswerId = searchParams.get("contextAnswerId");
  const isClient = useIsClient();
  const classCode = searchParams.get("class") ?? (isClient ? getStoredClassCode() : null);
  const recommendationsHref = classCode ? withClassCode("/recommendations", classCode) : "/recommendations";
  const withCurrentClassCode = (path: string) => classCode ? withClassCode(path, classCode) : path;
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [contextAnswer, setContextAnswer] = useState<Answer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isClient) return;
    let isActive = true;

    async function fetchData() {
      const classId = getStoredClassId();
      setLoading(true);
      setStudent(null);
      setContextAnswer(null);

      if (!classId) {
        if (isActive) {
          setLoading(false);
        }
        return;
      }

      try {
        const profileRes = await getProfileById(studentId, classId);
        if (!isActive) return;

        if (!profileRes.data) {
          return;
        }

        setStudent(profileRes.data);

        if (!contextAnswerId) return;

        try {
          const answerRes = await getAnswerById(contextAnswerId, classId);
          if (!isActive) return;

          if (answerRes.data?.targetProfileId === studentId) {
            setContextAnswer(answerRes.data);
          }
        } catch (err) {
          console.error("Failed to fetch context answer:", err);
        }
      } catch (err) {
        console.error("Failed to fetch student profile:", err);
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      isActive = false;
    };
  }, [isClient, studentId, contextAnswerId]);

  if (!isClient) return null;

  if (loading) {
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

  return (
    <div className="page-container">
      <Link
        href={recommendationsHref}
        className="mb-4 inline-block text-sm text-gray-400 hover:text-gray-600"
      >
        ← 목록으로
      </Link>

      {contextAnswer && (
        <div className="mb-6 animate-in fade-in slide-in-from-top-4 duration-700">
          <p className="mb-2 text-xs font-bold text-indigo-600 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
            이 Q&A를 통해 이 학생을 발견하셨나요?
          </p>
          <AnswerCard answer={contextAnswer} isHighlighted />
        </div>
      )}

      <ProfileCard profile={student} />

      <div className="mt-4 flex flex-col gap-2">
        <Link
          href={withCurrentClassCode(`/students/${studentId}/ask?mode=inperson`)}
          className="btn-primary text-center"
        >
          대면으로 대화하기
        </Link>
        <Link
          href={withCurrentClassCode(`/students/${studentId}/ask?mode=online`)}
          className="btn-secondary text-center"
        >
          익명으로 질문 남기기
        </Link>
      </div>

      <StudentAnswers studentId={studentId} excludeAnswerId={contextAnswer?.id ?? null} />
    </div>
  );
}

export default function StudentProfilePage() {
  return (
    <Suspense fallback={
      <div className="page-container flex justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    }>
      <StudentProfileContent />
    </Suspense>
  );
}
