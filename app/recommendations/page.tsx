"use client";

import { getCurrentUser, getAnswers } from "@/lib/localStorage";
import { getRecommendations } from "@/lib/recommendation";
import { MOCK_STUDENTS } from "@/lib/mock-students";
import { useIsClient } from "@/lib/use-is-client";
import StudentList from "@/components/student/student-list";

export default function RecommendationsPage() {
  const isClient = useIsClient();
  const user = isClient ? getCurrentUser() : null;
  const exploredIds = user
    ? [...new Set(getAnswers().filter((a) => a.answererId === user.id).map((a) => a.targetStudentId))]
    : [];
  const recommendations = user
    ? getRecommendations(user, MOCK_STUDENTS, exploredIds)
    : MOCK_STUDENTS.map((s) => ({ student: s, score: 0, matchReasons: [] }));

  return (
    <div className="page-container">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">추천 학생</h1>
        <p className="text-sm text-gray-500 mt-0.5">클릭해서 프로필을 확인하세요</p>
      </div>
      <StudentList recommendations={recommendations} />
    </div>
  );
}
