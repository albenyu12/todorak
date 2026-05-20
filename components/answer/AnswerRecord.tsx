"use client";

// TODO (H): 답변 저장 후 성공 토스트 메시지 추가
// TODO (H): 답변 최소 글자 수 검증 (현재 미구현)

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Answer } from "@/types";
import { saveAnswer } from "@/lib/localStorage";

interface AnswerRecordProps {
  questionId: string;
  questionText: string;
  askedToStudentId: string;
  askedToStudentName: string;
}

export default function AnswerRecord({
  questionId,
  questionText,
  askedToStudentId,
  askedToStudentName,
}: AnswerRecordProps) {
  const router = useRouter();
  const [answerText, setAnswerText] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!answerText.trim()) return;

    const answer: Answer = {
      id: `ans-${Date.now()}`,
      questionId,
      questionText,
      answerText: answerText.trim(),
      askedToStudentId,
      askedToStudentName,
      recordedAt: new Date().toISOString(),
    };

    saveAnswer(answer);
    router.push("/answers");
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="rounded-lg bg-indigo-50 px-4 py-3">
        <p className="text-xs text-indigo-500 font-medium mb-1">질문</p>
        <p className="text-sm text-indigo-900">{questionText}</p>
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-gray-700">
          {askedToStudentName}님의 답변을 기록해주세요
        </p>
        <textarea
          className="input min-h-[120px] resize-none"
          placeholder="대면으로 들은 답변을 기록하세요"
          value={answerText}
          onChange={(e) => setAnswerText(e.target.value)}
        />
      </div>

      <button
        type="submit"
        disabled={!answerText.trim()}
        className="btn-primary disabled:opacity-40"
      >
        답변 저장
      </button>
    </form>
  );
}
