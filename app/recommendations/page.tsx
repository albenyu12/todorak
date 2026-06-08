"use client";

import { useEffect, useState } from "react";
import { getCurrentUser, getAnswers } from "@/lib/localStorage";
import { getRecommendations } from "@/lib/recommendation";
import { getProfilesByClass } from "@/lib/api/profiles";
import { getStoredClassId } from "@/lib/client-session";
import { useIsClient } from "@/lib/use-is-client";
import StudentList from "@/components/student/student-list";
import { StudentProfile, RecommendationResult } from "@/lib/types";

export default function RecommendationsPage() {
  const isClient = useIsClient();
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [loading, setLoading] = useState(true);

  const user = isClient ? getCurrentUser() : null;
  const classId = isClient ? getStoredClassId() : null;

  useEffect(() => {
    if (!isClient) return;

    if (!classId) {
      // Use setTimeout to avoid synchronous setState in effect body lint error
      const timer = setTimeout(() => setLoading(false), 0);
      return () => clearTimeout(timer);
    }

    async function fetchStudents() {
      try {
        const data = await getProfilesByClass(classId!);
        setStudents(data);
      } catch (err) {
        console.error("Failed to fetch students:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchStudents();
  }, [isClient, classId]);

  const exploredIds = user
    ? [...new Set((getAnswers() || []).filter((a) => a?.answererId === user.id).map((a) => a?.targetStudentId || a?.targetProfileId))].filter((id): id is string => !!id)
    : [];

  const recommendations: RecommendationResult[] = user
    ? getRecommendations(user, students, exploredIds)
    : students.map((s) => ({ student: s, score: 0, matchReasons: [] }));

  return (
    <div className="page-container">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">추천 학생</h1>
        <p className="text-sm text-gray-500 mt-0.5">클릭해서 프로필을 확인하세요</p>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
        </div>
      ) : (
        <StudentList recommendations={recommendations} />
      )}
    </div>
  );
}
