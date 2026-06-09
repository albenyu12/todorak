import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Answer } from "@/lib/types";
import { QUESTIONS } from "@/lib/questions";
import { withClassCode } from "@/lib/client-session";
import Card from "@/components/ui/card";
import Badge from "@/components/ui/badge";
import { QuestionCategory } from "@/lib/types";
import { formatDate } from "@/lib/utils";

interface AnswerCardProps {
  answer: Answer;
  isHighlighted?: boolean;
}

// ⚠️ 중요: 이 컴포넌트는 전체 Q&A 리스트에서 사용됩니다.
// 답변자 이름(targetStudentName)을 절대 표시하지 마세요.
// targetStudentId는 링크(프로필 보기) 전용으로만 사용합니다.
// 리스트에서는 항상 "익명의 학생"으로만 표시해야 합니다.

const CATEGORY_LABELS: Record<QuestionCategory, string> = {
  collaboration: "협업",
  role: "역할",
  conflict: "갈등",
  work_style: "작업 방식",
  interest: "관심사",
  goal: "목표",
};

const ANSWER_TYPE_LABELS: Record<Answer["answerType"], string> = {
  first: "첫 답변",
  inperson: "대면",
  online: "온라인",
};

function buildAnswerContextHref(answer: Answer, classCode: string | null): string {
  const targetProfileId = answer.targetProfileId || answer.targetStudentId;
  if (!targetProfileId) return `/answers/${answer.id}`;

  const href = `/students/${targetProfileId}?contextAnswerId=${answer.id}`;
  return classCode ? withClassCode(href, classCode) : href;
}

export default function AnswerCard({ answer, isHighlighted }: AnswerCardProps) {
  const searchParams = useSearchParams();
  const classCode = searchParams.get("class");
  const question = QUESTIONS.find((q) => q.id === (answer.questionTemplateId || answer.questionId));
  const profileHref = buildAnswerContextHref(answer, classCode);

  return (
    <Link href={profileHref}>
      <Card
        className={`transition-all ${
          isHighlighted
            ? "border-indigo-500 bg-indigo-50/30 ring-1 ring-indigo-500"
            : "hover:border-indigo-300 hover:shadow-sm"
        }`}
      >
        <div className="flex items-center gap-1.5 mb-2">
          {question && (
            <Badge variant="category">
              {CATEGORY_LABELS[question.category]}
            </Badge>
          )}
          <Badge variant={answer.answerType === "inperson" ? "role" : "match"}>
            {ANSWER_TYPE_LABELS[answer.answerType]}
          </Badge>
        </div>
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
            {formatDate(answer.createdAt || answer.recordedAt)}
          </span>
        </div>
      </Card>
    </Link>
  );
}
