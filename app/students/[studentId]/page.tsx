"use client";

import { useEffect, useState, Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { getProfileById } from "@/lib/api/profiles";
import { StudentProfile } from "@/lib/api/types";
import { getStoredClassId, withClassCode } from "@/lib/client-session";
import { useIsClient } from "@/lib/use-is-client";
import ProfileCard from "@/components/profile/profile-card";
import StudentAnswers from "@/components/student/student-answers";

function StudentProfileContent() {
  const { studentId } = useParams<{ studentId: string }>();
  const searchParams = useSearchParams();
  const classCode = searchParams.get("class");
  const isClient = useIsClient();
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isClient) return;

    async function fetchStudent() {
      const classId = getStoredClassId();
      if (!classId) {
        setLoading(false);
        return;
      }

      try {
        const res = await getProfileById(studentId, classId);
        if (res.data) {
          setStudent(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch student profile:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchStudent();
  }, [isClient, studentId]);

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
        <Link href="/recommendations" className="btn-primary mt-4 max-w-xs mx-auto">
          목록으로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <div className="page-container">
      <Link
        href="/recommendations"
        className="mb-4 inline-block text-sm text-gray-400 hover:text-gray-600"
      >
        ← 목록으로
      </Link>
      <ProfileCard profile={student} />

      <div className="mt-4 flex flex-col gap-2">
        <Link
          href={withClassCode(`/students/${studentId}/ask?mode=inperson`, classCode || "")}
          className="btn-primary text-center"
        >
          대면으로 대화하기
        </Link>
        <Link
          href={withClassCode(`/students/${studentId}/ask?mode=online`, classCode || "")}
          className="btn-secondary text-center"
        >
          익명으로 질문 남기기
        </Link>
      </div>

      <StudentAnswers studentId={studentId} />
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
