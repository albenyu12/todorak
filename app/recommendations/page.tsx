"use client";

import { useEffect, useState, Suspense } from "react";
import { getRecommendations } from "@/lib/recommendation";
import { getProfilesByClass, getProfileById } from "@/lib/api/profiles";
import { getAnswersRecordedByProfile } from "@/lib/api/answers";
import { getStoredClassId, getStoredProfileId } from "@/lib/client-session";
import { useIsClient } from "@/lib/use-is-client";
import StudentList from "@/components/student/student-list";
import { StudentProfile, RecommendationResult } from "@/lib/types";

function RecommendationsContent() {
  const isClient = useIsClient();
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [user, setUser] = useState<StudentProfile | null>(null);
  const [exploredIds, setExploredIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isClient) return;

    async function fetchData() {
      const classId = getStoredClassId();
      const profileId = getStoredProfileId();

      if (!classId) {
        setLoading(false);
        return;
      }

      try {
        const profilesRes = await getProfilesByClass(classId);

        setStudents(profilesRes);

        if (!profileId) {
          return;
        }

        const [profileRes, answers] = await Promise.all([
          getProfileById(profileId, classId),
          getAnswersRecordedByProfile(profileId, classId),
        ]);

        if (profileRes.data) setUser(profileRes.data);

        // TODO: Include sent question targets after inbox_questions stores sender_profile_id.
        // The current data model only supports explored profiles from recorded answers.
        const ids = [...new Set(answers.map((a) => a.targetProfileId))].filter((id): id is string => !!id);
        setExploredIds(ids);
      } catch (err) {
        console.error("Failed to fetch data for recommendations:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [isClient]);

  const recommendations: RecommendationResult[] = user
    ? getRecommendations(user, students, exploredIds)
    : [];

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
      ) : !user ? (
        <p className="text-center text-gray-400 py-12">
          내 프로필을 찾을 수 없어 추천을 표시할 수 없습니다.
        </p>
      ) : (
        <StudentList recommendations={recommendations} />
      )}
    </div>
  );
}

export default function RecommendationsPage() {
  return (
    <Suspense fallback={
      <div className="page-container flex justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    }>
      <RecommendationsContent />
    </Suspense>
  );
}
