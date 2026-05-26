import Link from "next/link";
import Button from "@/components/ui/button";

export default function EmptyAnswerState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-200 bg-gray-50 px-6 py-14 text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
        <svg
          aria-hidden="true"
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8 10h8M8 14h5m8-2c0 4.418-4.03 8-9 8a10.4 10.4 0 0 1-3.57-.62L4 20l1.1-3.3A7.36 7.36 0 0 1 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8Z"
          />
        </svg>
      </div>
      <p className="mb-1 text-base font-semibold text-gray-800">
        아직 받은 답변이 없어요
      </p>
      <p className="mb-6 text-sm text-gray-500">
        궁금한 팀원에게 첫 질문을 남기고 답변을 기다려보세요.
      </p>
      <Link href="/recommendations">
        <Button variant="primary">첫 질문 남기러 가기</Button>
      </Link>
    </div>
  );
}
