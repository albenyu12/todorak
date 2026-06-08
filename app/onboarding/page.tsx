"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ProfileForm from "@/components/profile/profile-form";
import {
  getClassCodeFromSearchParams,
  resolveClassSession,
  type ClassSessionState,
} from "@/lib/client-session";

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

function ClassMessage({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="page-container min-h-[60vh] flex flex-col justify-center text-center">
      <h1 className="text-2xl font-bold text-gray-900 mb-3">{title}</h1>
      <p className="text-sm text-gray-500 leading-6">{description}</p>
    </div>
  );
}

function OnboardingContent() {
  const searchParams = useSearchParams();
  const [state, setState] = useState<ClassSessionState | { status: "loading" }>({
    status: "loading",
  });

  useEffect(() => {
    let ignore = false;

    async function loadClassSession() {
      setState({ status: "loading" });
      const classCode = getClassCodeFromSearchParams(searchParams);
      const nextState = await resolveClassSession(classCode);
      if (!ignore) setState(nextState);
    }

    loadClassSession();

    return () => {
      ignore = true;
    };
  }, [searchParams]);

  if (state.status === "loading") {
    return (
      <ClassMessage
        title="수업 정보를 확인하고 있어요"
        description="잠시만 기다려주세요."
      />
    );
  }

  if (state.status === "missing") {
    return (
      <ClassMessage
        title="수업 코드가 필요해요"
        description="QR 코드로 다시 접속하거나, 주소에 ?class=수업코드를 포함해 주세요."
      />
    );
  }

  if (state.status === "invalid") {
    return (
      <ClassMessage
        title="유효하지 않은 수업 코드예요"
        description={`${state.classCode} 수업을 찾을 수 없어요. QR 코드나 URL을 다시 확인해 주세요.`}
      />
    );
  }

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

export default function OnboardingPage() {
  return (
    <Suspense
      fallback={
        <ClassMessage
          title="수업 정보를 확인하고 있어요"
          description="잠시만 기다려주세요."
        />
      }
    >
      <OnboardingContent />
    </Suspense>
  );
}
