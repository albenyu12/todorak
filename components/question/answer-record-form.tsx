"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Answer } from "@/lib/types";
import { saveAnswer } from "@/lib/localStorage";
import Button from "@/components/ui/button";
import Textarea from "@/components/ui/textarea";

interface AnswerRecordFormProps {
  questionId: string;
  questionText: string;
  targetStudentId: string;
  targetStudentName: string;
}

// TODO (H): 저장 성공 피드백
// 입력값: 저장 완료 상태
// 해야 할 일: 저장 완료 후 /answers 이동 전 "저장됐어요!" 인라인 메시지 표시 (500ms 정도)
// 완료 기준: 저장 후 사용자가 완료 여부를 즉시 인지함

const MIN_ANSWER_LENGTH = 10;

export default function AnswerRecordForm({
  questionId,
  questionText,
  targetStudentId,
  targetStudentName,
}: AnswerRecordFormProps) {
  const router = useRouter();
  const [answerText, setAnswerText] = useState("");

  // 공백만 있는 입력은 0자로 취급 (trim 후 길이)
  const charCount = answerText.trim().length;
  // 최소 글자 수 충족 여부 — 저장 버튼·카운터 색상에 사용
  const isValid = charCount >= MIN_ANSWER_LENGTH;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid) return;

    const answer: Answer = {
      id: `ans-${Date.now()}`,
      questionId,
      questionText,
      answerText: answerText.trim(),
      targetStudentId,
      recordedAt: new Date().toISOString(),
      answerType: "inperson",
    };

    saveAnswer(answer);
    router.push("/answers");
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* 질문 표시 */}
      <div className="rounded-lg bg-indigo-50 px-4 py-3">
        <p className="text-xs text-indigo-500 font-medium mb-1">질문</p>
        <p className="text-sm text-indigo-900">{questionText}</p>
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-gray-700">
          {targetStudentName}님의 답변을 기록해주세요
        </p>
        <Textarea
          placeholder="대면으로 들은 답변을 기록하세요"
          value={answerText}
          onChange={(e) => setAnswerText(e.target.value)}
          error={answerText.length > 0 && !isValid}
          className="min-h-[120px]"
        />
        {/* 글자 수 카운터: 입력마다 갱신, 미충족 시 빨간색으로 경고 */}
        <p className={`mt-1 text-right text-xs ${isValid ? "text-gray-400" : "text-red-400"}`}>
          {charCount}자 / 최소 {MIN_ANSWER_LENGTH}자
        </p>
      </div>

      {/* TODO (H): 저장 성공 메시지 영역 */}
      <Button type="submit" fullWidth disabled={!isValid}>
        답변 저장
      </Button>
    </form>
  );
}
