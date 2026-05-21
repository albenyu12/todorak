"use client";

import { useEffect, useState } from "react";
import { RecommendationResult } from "@/lib/types";
import { getCurrentUser } from "@/lib/localStorage";
import { getRecommendations } from "@/lib/recommendation";
import { MOCK_STUDENTS } from "@/lib/mock-students";
import StudentList from "@/components/student/StudentList";

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState<RecommendationResult[]>([]);

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setRecommendations(getRecommendations(user, MOCK_STUDENTS));
    } else {
      setRecommendations(
        MOCK_STUDENTS.map((s) => ({ student: s, score: 0, matchReasons: [] }))
      );
    }
  }, []);

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
