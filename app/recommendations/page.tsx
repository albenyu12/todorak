"use client";

import { useEffect, useState } from "react";
import { RecommendationResult } from "@/types";
import { getCurrentUser } from "@/lib/localStorage";
import { getRecommendations } from "@/lib/recommendation/engine";
import { MOCK_STUDENTS } from "@/lib/data/mockData";
import StudentList from "@/components/student/StudentList";
import Link from "next/link";

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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">추천 학생</h1>
          <p className="text-sm text-gray-500 mt-0.5">클릭해서 프로필을 확인하세요</p>
        </div>
        <Link href="/onboarding" className="text-sm text-indigo-600 hover:underline">
          프로필 수정
        </Link>
      </div>
      <StudentList recommendations={recommendations} />
    </div>
  );
}
