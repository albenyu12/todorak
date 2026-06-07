"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createAnswer } from "@/lib/api/answers";
import { getStoredClassId, getStoredProfileId } from "@/lib/client-session";
import Button from "@/components/ui/button";
import Textarea from "@/components/ui/textarea";

interface AnswerRecordFormProps {
  questionId: string;
  questionText: string;
  targetStudentId: string;
  targetStudentName: string;
}

const MIN_ANSWER_LENGTH = 10;
const SUCCESS_REDIRECT_MS = 500;

export default function AnswerRecordForm({
  questionId,
  questionText,
  targetStudentId,
  targetStudentName,
}: AnswerRecordFormProps) {
  const router = useRouter();
  const [answerText, setAnswerText] = useState("");
  const [error, setError] = useState("");
  // 저장 완료 후 메시지 표시 → 잠시 뒤 목록으로 이동
  const [saved, setSaved] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 공백만 있는 입력은 0자로 취급 (trim 후 길이)
  const charCount = answerText.trim().length;
  // 최소 글자 수 충족 여부 — 저장 버튼·카운터 색상에 사용
  const isValid = charCount >= MIN_ANSWER_LENGTH;

  // 저장 성공 메시지를 잠시 보여 준 뒤 Q&A 목록으로 이동
  useEffect(() => {
    if (!saved) return;
    const timer = setTimeout(() => router.push("/answers"), SUCCESS_REDIRECT_MS);
    return () => clearTimeout(timer);
  }, [saved, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid || saved || isSubmitting) return;

    const classId = getStoredClassId();
    const recorderProfileId = getStoredProfileId();

    if (!classId) {
      setError("클래스 정보를 찾을 수 없습니다.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const res = await createAnswer(classId, {
        targetProfileId: targetStudentId,
        recorderProfileId: recorderProfileId,
        inboxQuestionId: null,
        questionTemplateId: questionId.startsWith("custom-") ? null : questionId,
        questionText: questionText,
        answerText: answerText.trim(),
        answerType: "inperson",
      });

      if (res.error) {
        setError(res.error.message);
      } else {
        setSaved(true);
      }
    } catch (err) {
      console.error("Save answer error:", err);
      setError("답변을 저장하는 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
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
          disabled={saved}
        />
        {/* 글자 수 카운터: 입력마다 갱신, 미충족 시 빨간색으로 경고 */}
        <p className={`mt-1 text-right text-xs ${isValid ? "text-gray-400" : "text-red-400"}`}>
          {charCount}자 / 최소 {MIN_ANSWER_LENGTH}자
        </p>
      </div>

      {/* 저장 성공 피드백: 이동 전 약 500ms 동안 표시 */}
      {saved && (
        <p className="text-center text-sm font-medium text-green-600" role="status">
          저장됐어요!
        </p>
      )}
      {error && (
        <p className="text-center text-sm font-medium text-red-600" role="alert">
          {error}
        </p>
      )}
      <Button type="submit" fullWidth disabled={!isValid || saved || isSubmitting}>
        {isSubmitting ? "저장 중..." : "답변 저장"}
      </Button>
    </form>
  );
}
