"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ProfileForm from "@/components/profile/profile-form";

function BackButton() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const isEdit = searchParams.get("edit") === "true";

  if (!isEdit) return null;

  return (
    <button
      onClick={() => router.back()}
      className="mb-4 flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 transition-colors"
    >
      ← 뒤로
    </button>
  );
}

export default function OnboardingPage() {
  return (
    <div className="page-container">
      <Suspense>
        <BackButton />
      </Suspense>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">프로필 작성</h1>
      <p className="text-sm text-gray-500 mb-6">
        나를 소개하고 맞는 팀원을 추천받으세요.
      </p>
      <Suspense>
        <ProfileForm />
      </Suspense>
    </div>
  );
}
