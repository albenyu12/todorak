import Link from "next/link";
import { MOCK_STUDENTS } from "@/lib/data/mockData";
import ProfileCard from "@/components/profile/ProfileCard";
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
        <Link href={`/students/${studentId}/ask`} className="btn-primary text-center">
          질문하기
        </Link>
      </div>
    </div>
  );
}
