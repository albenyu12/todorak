// TODO (H): 질문 카테고리별 색상 뱃지 추가
// TODO (H): 날짜 포맷 유틸 분리 (현재 toLocaleDateString 인라인)

import Link from "next/link";
import { Answer } from "@/types";

interface AnswerCardProps {
  answer: Answer;
}

export default function AnswerCard({ answer }: AnswerCardProps) {
  return (
    <Link href={`/answers/${answer.id}`}>
      <div className="rounded-xl border border-gray-200 bg-white p-4 hover:border-indigo-300 hover:shadow-sm transition-all">
        <p className="text-sm font-medium text-gray-800 line-clamp-2">
          Q. {answer.questionText}
        </p>
        <p className="mt-2 text-sm text-gray-600 line-clamp-2">
          A. {answer.answerText}
        </p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs text-gray-400">익명의 학생</span>
          <span className="text-xs text-gray-400">
            {new Date(answer.recordedAt).toLocaleDateString("ko-KR")}
          </span>
        </div>
      </div>
    </Link>
  );
}
