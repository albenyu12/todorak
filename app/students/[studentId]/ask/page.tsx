import Link from "next/link";
import { MOCK_STUDENTS } from "@/lib/mock-students";
import QuestionForm from "@/components/question/question-form";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ studentId: string }>;
  searchParams: Promise<{ mode?: string }>;
}

export default async function AskPage({ params, searchParams }: Props) {
  const { studentId } = await params;
  const { mode } = await searchParams;
  const student = MOCK_STUDENTS.find((s) => s.id === studentId);

  if (!student) notFound();

  const questionMode: "inperson" | "online" =
    mode === "online" ? "online" : "inperson";

  const modeLabel = questionMode === "online" ? "익명으로 질문 남기기" : "대면으로 대화하기";

  return (
    <div className="page-container">
      <Link
        href={`/students/${studentId}`}
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
