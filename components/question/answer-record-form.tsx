"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createAnswer } from "@/lib/api/answers";
import { getStoredProfileId, getStoredClassId } from "@/lib/client-session";
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
  // 저장 완료 후 메시지 표시 → 잠시 뒤 목록으로 이동
  const [saved, setSaved] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

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

    const profileId = getStoredProfileId();
    const classId = getStoredClassId();

    if (!profileId || !classId) {
      setError("프로필 정보를 찾을 수 없습니다.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const res = await createAnswer(classId, {
        targetProfileId: targetStudentId,
        recorderProfileId: profileId,
        inboxQuestionId: null,
        questionTemplateId: questionId || null,
        questionText: questionText,
        answerText: answerText.trim(),
        answerType: "inperson",
      });

      if (res.error) {
        setError(res.error.message);
        setIsSubmitting(false);
      } else {
        setSaved(true);
      }
    } catch (err) {
      console.error("Failed to record answer:", err);
      setError("답변 기록에 실패했습니다.");
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
          disabled={saved || isSubmitting}
        />
        {/* 글자 수 카운터: 입력마다 갱신, 미충족 시 빨간색으로 경고 */}
        <p className={`mt-1 text-right text-xs ${isValid ? "text-gray-400" : "text-red-400"}`}>
          {charCount}자 / 최소 {MIN_ANSWER_LENGTH}자
        </p>
      </div>

      {error && <p className="text-sm text-red-500 text-center">{error}</p>}

      {/* 저장 성공 피드백: 이동 전 약 500ms 동안 표시 */}
      {saved && (
        <p className="text-center text-sm font-medium text-green-600" role="status">
          저장됐어요!
        </p>
      )}
      <Button type="submit" fullWidth disabled={!isValid || saved || isSubmitting}>
        {isSubmitting ? "저장 중..." : "답변 저장"}
      </Button>
    </form>
  );
}
