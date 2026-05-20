import { RecommendationResult } from "@/types";
import StudentCard from "./StudentCard";

interface StudentListProps {
  recommendations: RecommendationResult[];
}

export default function StudentList({ recommendations }: StudentListProps) {
  if (recommendations.length === 0) {
    return (
      <p className="text-center text-gray-400 py-12">추천할 학생이 없습니다.</p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {recommendations.map(({ student, matchReasons }) => (
        <StudentCard key={student.id} student={student} matchReasons={matchReasons} />
      ))}
    </div>
  );
}
