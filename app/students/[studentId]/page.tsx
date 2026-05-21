import Link from "next/link";
import { MOCK_STUDENTS } from "@/lib/mock-students";
import ProfileCard from "@/components/profile/ProfileCard";
import StudentAnswers from "@/components/student/student-answers";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ studentId: string }>;
}

export default async function StudentProfilePage({ params }: Props) {
  const { studentId } = await params;
  const student = MOCK_STUDENTS.find((s) => s.id === studentId);

  if (!student) notFound();

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
          href={`/students/${studentId}/ask?mode=inperson`}
          className="btn-primary text-center"
        >
          대면으로 대화하기
        </Link>
        <Link
          href={`/students/${studentId}/ask?mode=online`}
          className="btn-secondary text-center"
        >
          익명으로 질문 남기기
        </Link>
      </div>

      <StudentAnswers studentId={studentId} />
    </div>
  );
}
