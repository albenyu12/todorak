"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RecommendedQuestion } from "@/lib/types";
import { QUESTIONS } from "@/lib/questions";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import RecommendedQuestionList from "./recommended-question-list";

interface QuestionFormProps {
  studentId: string;
}

// TODO (H): 추천 질문 선택 ↔ 직접 입력 전환 UX
// 입력값: selectedQuestion (RecommendedQuestion | null), customText (string)
// 해야 할 일:
//   1. 추천 질문 선택 시 customText를 "" 로 초기화
//   2. customText 입력 시 selectedQuestion을 null로 초기화
//   3. 둘 다 비어있을 때 제출 시 에러 메시지 표시
// 완료 기준: 한 번에 하나의 입력만 활성화되고, 빈 상태 제출 방지

// TODO (H): 제출 전 미리보기
// 입력값: finalText (선택된 질문 or 직접 입력 텍스트)
// 해야 할 일: 제출 버튼 위에 "선택된 질문: ..." 미리보기 표시
// 완료 기준: 사용자가 제출 전 어떤 질문이 전달될지 확인 가능

export default function QuestionForm({ studentId }: QuestionFormProps) {
  const router = useRouter();
  const [selectedQuestion, setSelectedQuestion] = useState<RecommendedQuestion | null>(null);
  const [customText, setCustomText] = useState("");
  const [error, setError] = useState("");

  const finalText = customText.trim() || selectedQuestion?.text || "";

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!finalText) {
      setError("질문을 선택하거나 직접 입력해주세요.");
      return;
    }
    setError("");
    const params = new URLSearchParams({
      qid: selectedQuestion?.id ?? `custom-${Date.now()}`,
      qtext: finalText,
    });
    router.push(`/students/${studentId}/record?${params.toString()}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div>
        <p className="mb-2 text-sm font-medium text-gray-700">추천 질문 선택</p>
        <RecommendedQuestionList
          questions={QUESTIONS}
          selectedQuestionId={selectedQuestion?.id ?? null}
          onSelect={(q) => {
            setSelectedQuestion(q);
            setCustomText("");
            setError("");
          }}
        />
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-gray-700">또는 직접 입력</p>
        <Input
          placeholder="직접 질문을 입력하세요"
          value={customText}
          error={!!error && !finalText}
          onChange={(e) => {
            setCustomText(e.target.value);
            if (e.target.value) setSelectedQuestion(null);
            setError("");
          }}
        />
      </div>

      {/* TODO (H): 선택된 질문 미리보기 영역 */}
      {error && <p className="text-xs text-red-500">{error}</p>}

      <Button type="submit" fullWidth disabled={!finalText}>
        이 질문으로 대화하기
      </Button>
    </form>
  );
}
