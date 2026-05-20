"use client";

// TODO (H): 추천 질문 선택 ↔ 직접 입력 간 전환 UX 개선
// TODO (H): 질문 미선택 상태에서 제출 시 에러 메시지 표시

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Question } from "@/lib/types";
import SuggestedQuestions from "./SuggestedQuestions";
import { QUESTIONS } from "@/lib/questions";

interface QuestionFormProps {
  studentId: string;
}

export default function QuestionForm({ studentId }: QuestionFormProps) {
  const router = useRouter();
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [customText, setCustomText] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const finalText = customText.trim() || selectedQuestion?.text;
    if (!finalText) return;

    const questionId = selectedQuestion?.id ?? `custom-${Date.now()}`;
    const params = new URLSearchParams({
      qid: questionId,
      qtext: finalText,
    });
    router.push(`/students/${studentId}/record?${params.toString()}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <SuggestedQuestions
        questions={QUESTIONS}
        selectedQuestionId={selectedQuestion?.id ?? null}
        onSelect={(q) => {
          setSelectedQuestion(q);
          setCustomText("");
        }}
      />

      <div>
        <p className="mb-2 text-sm font-medium text-gray-700">또는 직접 입력</p>
        <input
          className="input"
          placeholder="직접 질문을 입력하세요"
          value={customText}
          onChange={(e) => {
            setCustomText(e.target.value);
            if (e.target.value) setSelectedQuestion(null);
          }}
        />
      </div>

      <button
        type="submit"
        disabled={!selectedQuestion && !customText.trim()}
        className="btn-primary disabled:opacity-40"
      >
        이 질문으로 대화하기
      </button>
    </form>
  );
}
