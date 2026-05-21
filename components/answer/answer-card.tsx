import Link from "next/link";
import { Answer } from "@/lib/types";
import { QUESTIONS } from "@/lib/questions";
import Card from "@/components/ui/card";
import Badge from "@/components/ui/badge";
import { QuestionCategory } from "@/lib/types";

interface AnswerCardProps {
  answer: Answer;
}

// ⚠️ 중요: 이 컴포넌트는 전체 Q&A 리스트에서 사용됩니다.
// 답변자 이름(targetStudentName)을 절대 표시하지 마세요.
// targetStudentId는 링크(프로필 보기) 전용으로만 사용합니다.
// 리스트에서는 항상 "익명의 학생"으로만 표시해야 합니다.

// TODO (H): 카테고리 뱃지 표시
// 입력값: answer.questionId → QUESTIONS 배열에서 category 조회
// 해야 할 일: questionId로 QUESTIONS를 find해서 category를 찾고,
//             해당 카테고리에 맞는 Badge variant 적용
// 완료 기준: 카드 상단에 카테고리 뱃지가 표시되고 카테고리별 색상이 구분됨

// TODO (H): 날짜 포맷 유틸 분리
// 입력값: answer.recordedAt (ISO 8601 문자열)
// 해야 할 일: lib/utils.ts에 formatDate(iso: string): string 함수 만들고 교체
// 완료 기준: 날짜 포맷이 한 곳에서 관리됨

const CATEGORY_LABELS: Record<QuestionCategory, string> = {
  collaboration: "협업",
  role: "역할",
  conflict: "갈등",
  work_style: "작업 방식",
  interest: "관심사",
  goal: "목표",
};

export default function AnswerCard({ answer }: AnswerCardProps) {
  const question = QUESTIONS.find((q) => q.id === answer.questionId);

  return (
    <Link href={`/answers/${answer.id}`}>
      <Card className="hover:border-indigo-300 hover:shadow-sm transition-all">
        {/* TODO (H): 카테고리 뱃지 */}
        {question && (
          <Badge variant="category" className="mb-2">
            {CATEGORY_LABELS[question.category]}
          </Badge>
        )}
        <p className="text-sm font-medium text-gray-800 line-clamp-2">
          Q. {answer.questionText}
        </p>
        <p className="mt-2 text-sm text-gray-600 line-clamp-2">
          A. {answer.answerText}
        </p>
        <div className="mt-3 flex items-center justify-between">
          {/* ⚠️ 이름 노출 금지: 반드시 "익명의 학생"으로만 표시 */}
          <span className="text-xs text-gray-400">익명의 학생</span>
          <span className="text-xs text-gray-400">
            {new Date(answer.recordedAt).toLocaleDateString("ko-KR")}
          </span>
        </div>
      </Card>
    </Link>
  );
}
