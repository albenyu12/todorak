import Link from "next/link";
import { MOCK_STUDENTS } from "@/lib/mock-students";
import QuestionForm from "@/components/question/question-form";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ studentId: string }>;
}

export default async function AskPage({ params }: Props) {
  const { studentId } = await params;
  const student = MOCK_STUDENTS.find((s) => s.id === studentId);

  if (!student) notFound();

  return (
    <div className="page-container">
      <Link
        href={`/students/${studentId}`}
        className="mb-4 inline-block text-sm text-gray-400 hover:text-gray-600"
      >
        ← {student.name}님 프로필
      </Link>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">질문 선택</h1>
      <p className="text-sm text-gray-500 mb-6">
        {student.name}님에게 물어볼 질문을 선택하거나 직접 입력하세요.
      </p>
      <QuestionForm studentId={studentId} />
    </div>
  );
}
