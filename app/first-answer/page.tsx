"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createAnswer } from "@/lib/api/answers";
import { getStoredClassId, getStoredProfileId, withClassCode } from "@/lib/client-session";
import { useIsClient } from "@/lib/use-is-client";
import Button from "@/components/ui/button";
import Textarea from "@/components/ui/textarea";

const MIN_LENGTH = 10;
const FIRST_QUESTION = "팀 프로젝트에서 나를 어떤 동료로 소개하고 싶나요?";
const DEFAULT_ANSWER = "열심히 소통하고 맡은 바 최선을 다하는 동료가 되겠습니다!";

function FirstAnswerContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const classCode = searchParams.get("class");
  const isClient = useIsClient();
  const [answerText, setAnswerText] = useState(DEFAULT_ANSWER);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const charCount = answerText.trim().length;
  const isValid = charCount >= MIN_LENGTH;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid || isSubmitting) return;

    const classId = getStoredClassId();
    const profileId = getStoredProfileId();

    if (!classId || !profileId) {
      setError("세션 정보가 없습니다. 다시 로그인해주세요.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const res = await createAnswer(classId, {
        targetProfileId: profileId,
        recorderProfileId: profileId,
        inboxQuestionId: null,
        questionTemplateId: null,
        questionText: FIRST_QUESTION,
        answerText: answerText.trim(),
        answerType: "first",
      });

      if (res.error) {
        setError(res.error.message);
      } else {
        router.push(withClassCode("/recommendations", classCode || ""));
      }
    } catch (err) {
      console.error("First answer error:", err);
      setError("답변 저장 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!isClient) return null;

  return (
    <div className="page-container flex flex-col items-center py-10">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">첫 번째 답변 남기기</h1>
        <p className="text-sm text-gray-500 mb-8">
          팀원들에게 보여질 나의 첫 인상이에요.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="rounded-xl bg-indigo-50 p-5">
            <p className="text-xs text-indigo-500 font-bold mb-1 uppercase tracking-wider">공통 질문</p>
            <p className="text-lg font-medium text-indigo-900 leading-snug">
              {FIRST_QUESTION}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">나의 답변</label>
            <Textarea
              placeholder="자유롭게 답변을 남겨주세요"
              value={answerText}
              onChange={(e) => setAnswerText(e.target.value)}
              className="min-h-[140px] text-base"
              disabled={isSubmitting}
            />
            <div className="mt-2 flex justify-between items-center">
              <p className="text-xs text-gray-400">최소 {MIN_LENGTH}자 이상 입력해주세요.</p>
              <p className={`text-xs font-medium ${isValid ? "text-indigo-500" : "text-red-400"}`}>
                {charCount}자
              </p>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-100">
              <p className="text-sm text-red-600 text-center">{error}</p>
            </div>
          )}

          <Button 
            type="submit" 
            fullWidth 
            size="lg"
            disabled={!isValid || isSubmitting}
            className="mt-2"
          >
            {isSubmitting ? "저장 중..." : "답변 완료하고 추천 받기"}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default function FirstAnswerPage() {
  return (
    <Suspense fallback={
      <div className="page-container flex justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    }>
      <FirstAnswerContent />
    </Suspense>
  );
}
