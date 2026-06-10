"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getRecommendations } from "@/lib/recommendation";
import { getProfilesByClass, getProfileById } from "@/lib/api/profiles";
import { getAnswersRecordedByProfile } from "@/lib/api/answers";
import {
  getClassCodeFromSearchParams,
  getStoredProfileId,
  resolveClassSession,
  withClassCode,
  type ClassSession,
  type ClassSessionState,
} from "@/lib/client-session";
import { useIsClient } from "@/lib/use-is-client";
import StudentList from "@/components/student/student-list";
import { StudentProfile, RecommendationResult } from "@/lib/types";

function ClassMessage({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="page-container flex min-h-[60vh] flex-col items-center justify-center text-center">
      <h1 className="mb-3 text-2xl font-bold text-gray-900">{title}</h1>
      <p className="max-w-sm text-sm leading-6 text-gray-500">{description}</p>
    </div>
  );
}

function RecommendationsContent() {
  const searchParams = useSearchParams();
  const isClient = useIsClient();
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [user, setUser] = useState<StudentProfile | null>(null);
  const [exploredIds, setExploredIds] = useState<string[]>([]);
  const [classState, setClassState] = useState<ClassSessionState | { status: "loading" }>({
    status: "loading",
  });
  const [session, setSession] = useState<ClassSession | null>(null);
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isClient) return;
    let isActive = true;

    async function fetchData() {
      setLoading(true);
      setClassState({ status: "loading" });
      setStudents([]);
      setUser(null);
      setExploredIds([]);
      setSession(null);
      setHasProfile(null);

      const classCode = getClassCodeFromSearchParams(searchParams);
      const nextClassState = await resolveClassSession(classCode);
      if (!isActive) return;

      setClassState(nextClassState);

      if (nextClassState.status !== "ready") {
        setLoading(false);
        return;
      }

      setSession(nextClassState.session);
      const profileId = getStoredProfileId();

      if (!profileId) {
        setHasProfile(false);
        setLoading(false);
        return;
      }

      setHasProfile(true);

      try {
        const [profilesRes, profileRes, answers] = await Promise.all([
          getProfilesByClass(nextClassState.session.classId),
          getProfileById(profileId, nextClassState.session.classId),
          getAnswersRecordedByProfile(profileId, nextClassState.session.classId),
        ]);

        if (!isActive) return;
        setStudents(profilesRes);

        if (profileRes.data) setUser(profileRes.data);

        // TODO: Include sent question targets after inbox_questions stores sender_profile_id.
        // The current data model only supports explored profiles from recorded answers.
        const ids = [...new Set(answers.map((a) => a.targetProfileId))].filter((id): id is string => !!id);
        setExploredIds(ids);
      } catch (err) {
        console.error("Failed to fetch data for recommendations:", err);
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      isActive = false;
    };
  }, [isClient, searchParams]);

  const recommendations: RecommendationResult[] = user
    ? getRecommendations(user, students, exploredIds)
    : [];

  if (classState.status === "loading") {
    return (
      <ClassMessage
        title="수업 정보를 확인하고 있어요"
        description="잠시만 기다려주세요."
      />
    );
  }

  if (classState.status === "missing") {
    return (
      <ClassMessage
        title="수업 코드가 필요해요"
        description="QR 코드로 다시 접속하거나, 주소에 ?class=수업코드를 포함해 주세요."
      />
    );
  }

  if (classState.status === "invalid") {
    return (
      <ClassMessage
        title="유효하지 않은 수업 코드예요"
        description={`${classState.classCode} 수업을 찾을 수 없어요. QR 코드나 URL을 다시 확인해 주세요.`}
      />
    );
  }

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
      ) : hasProfile === false || !user ? (
        <div className="flex flex-col items-center gap-4 py-12 text-center">
          <p className="text-gray-500">
            추천을 보려면 프로필을 먼저 만들어주세요.
          </p>
          <Link
            href={withClassCode("/onboarding", session?.classCode ?? classState.session.classCode)}
            className="btn-primary max-w-xs"
          >
            프로필 만들기
          </Link>
        </div>
      ) : (
        <StudentList
          recommendations={recommendations}
          classCode={session?.classCode ?? classState.session.classCode}
        />
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
