import Link from "next/link";
import { MOCK_STUDENTS } from "@/lib/data/mockData";
import AnswerRecord from "@/components/answer/AnswerRecord";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ studentId: string }>;
  searchParams: Promise<{ qid?: string; qtext?: string }>;
}

export default async function RecordPage({ params, searchParams }: Props) {
  const { studentId } = await params;
  const { qid, qtext } = await searchParams;

  const student = MOCK_STUDENTS.find((s) => s.id === studentId);
  if (!student) notFound();

  if (!qid || !qtext) {
    return (
      <div className="page-container">
        <p className="text-gray-500">질문 정보가 없습니다.</p>
        <Link href={`/students/${studentId}/ask`} className="btn-primary mt-4 text-center">
          질문 선택하기
        </Link>
      </div>
    );
  }

  return (
    <div className="page-container">
      <Link
        href={`/students/${studentId}/ask`}
        className="mb-4 inline-block text-sm text-gray-400 hover:text-gray-600"
      >
        ← 질문 다시 선택
      </Link>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">답변 기록</h1>
      <p className="text-sm text-gray-500 mb-6">
        대면으로 들은 답변을 기록해두세요.
      </p>
      <AnswerRecord
        questionId={qid}
        questionText={decodeURIComponent(qtext)}
        askedToStudentId={studentId}
        askedToStudentName={student.name}
      />
    </div>
  );
}
