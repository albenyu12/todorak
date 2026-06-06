"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { getAnswerById } from "@/lib/localStorage";
import { MOCK_STUDENTS } from "@/lib/mock-students";
import { useIsClient } from "@/lib/use-is-client";

export default function AnswerDetailPage() {
  const { answerId } = useParams<{ answerId: string }>();
  const isClient = useIsClient();
  const answer = isClient ? getAnswerById(answerId) : null;

  const student = answer
    ? MOCK_STUDENTS.find((s) => s.id === answer.targetStudentId)
    : null;

  if (!isClient) return null;

  if (!answer) {
    return (
      <div className="page-container text-center py-16">
        <p className="text-gray-400">답변을 찾을 수 없습니다.</p>
        <Link href="/answers" className="btn-primary mt-4 max-w-xs mx-auto">
          Q&A 목록으로
        </Link>
      </div>
    );
  }

  return (
    <div className="page-container">
      <Link
        href="/answers"
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
          {new Date(answer.recordedAt).toLocaleString("ko-KR")}
        </p>
      </div>

      {student && (
        <Link
          href={`/students/${student.id}`}
          className="btn-primary mt-4 text-center"
        >
          이 학생 프로필 보기
        </Link>
      )}
    </div>
  );
}
