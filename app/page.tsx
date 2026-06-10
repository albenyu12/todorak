"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  getClassCodeFromSearchParams,
  resolveClassSession,
  withClassCode,
  type ClassSessionState,
} from "@/lib/client-session";

function ClassMessage({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="page-container flex flex-col items-center justify-center min-h-[70vh] text-center">
      <h1 className="text-2xl font-bold text-gray-900 mb-3">{title}</h1>
      <p className="text-sm text-gray-500 leading-6 max-w-sm">{description}</p>
    </div>
  );
}

function HomeContent() {
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

  const onboardingHref = withClassCode("/onboarding", state.session.classCode);

  return (
    <div className="page-container flex flex-col items-center justify-center min-h-[70vh] text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-3">토도락</h1>
      <p className="text-lg text-gray-500 mb-8 max-w-sm">
        질문으로 시작하는 팀 탐색.<br />
        대화 전에 서로를 알아가세요.
      </p>
      <Link href={onboardingHref} className="btn-primary max-w-xs">
        프로필 만들고 시작하기
      </Link>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <ClassMessage
          title="수업 정보를 확인하고 있어요"
          description="잠시만 기다려주세요."
        />
      }
    >
      <HomeContent />
    </Suspense>
  );
}
