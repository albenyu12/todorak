import Link from "next/link";

export default function HomePage() {
  return (
    <div className="page-container flex flex-col items-center justify-center min-h-[70vh] text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-3">토도락</h1>
      <p className="text-lg text-gray-500 mb-8 max-w-sm">
        질문으로 시작하는 팀 탐색.<br />
        대화 전에 서로를 알아가세요.
      </p>
      <Link href="/onboarding" className="btn-primary max-w-xs">
        프로필 만들고 시작하기
      </Link>
      <Link
        href="/recommendations"
        className="mt-3 text-sm text-gray-400 hover:text-gray-600 underline"
      >
        프로필 없이 둘러보기
      </Link>
    </div>
  );
}
