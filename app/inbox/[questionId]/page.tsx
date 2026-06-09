"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getInboxQuestionById } from "@/lib/api/inbox-questions";
import { createAnswer } from "@/lib/api/answers";
import { InboxQuestion } from "@/lib/api/types";
import { getStoredProfileId, getStoredClassId } from "@/lib/client-session";
import { useIsClient } from "@/lib/use-is-client";
import Button from "@/components/ui/button";
import Textarea from "@/components/ui/textarea";

const MIN_LENGTH = 10;

export default function InboxAnswerPage() {
  const { questionId } = useParams<{ questionId: string }>();
  const router = useRouter();
  const [question, setQuestion] = useState<InboxQuestion | null>(null);
  const [answerText, setAnswerText] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const isClient = useIsClient();

  useEffect(() => {
    if (!isClient) return;

    const profileId = getStoredProfileId();
    const classId = getStoredClassId();

    if (!profileId || !classId) {
      router.replace("/onboarding");
      return;
    }

    async function fetchQuestion() {
      try {
        const profileId = getStoredProfileId();
        const classId = getStoredClassId();
        const res = await getInboxQuestionById(questionId, classId!, profileId!);
        if (res.data) {
          setQuestion(res.data);
          if (res.data.isAnswered) {
            setError("이미 답변한 질문입니다.");
          }
        } else {
          setError(res.error?.message || "질문을 찾을 수 없습니다.");
        }
      } catch (err) {
        console.error("Failed to fetch question:", err);
        setError("질문을 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    }

    fetchQuestion();
  }, [isClient, questionId, router]);

  const isValid = answerText.trim().length >= MIN_LENGTH;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!question || !isValid || isSubmitting || question.isAnswered) return;

    const classId = getStoredClassId();
    const profileId = getStoredProfileId();

    if (!classId || !profileId) {
      setError("세션 정보를 찾을 수 없습니다. 다시 접속해 주세요.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const res = await createAnswer(classId, {
        targetProfileId: profileId,
        recorderProfileId: null, // 익명 질문은 기록자가 없음 (또는 시스템)
        inboxQuestionId: question.id,
        questionTemplateId: question.questionTemplateId,
        questionText: question.questionText,
        answerText: answerText.trim(),
        answerType: "online",
      });

      if (res.error) {
        setError(res.error.message);
        setIsSubmitting(false);
      } else {
        router.push("/answers");
      }
    } catch (err) {
      console.error("Failed to save answer:", err);
      setError("답변 저장에 실패했습니다.");
      setIsSubmitting(false);
    }
  }

  if (!isClient || loading) {
    return (
      <div className="page-container flex justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="page-container text-center py-16">
        <p className="text-gray-400">{error || "질문을 찾을 수 없습니다."}</p>
        <Link href="/inbox" className="btn-primary mt-4 max-w-xs mx-auto">
          받은 질문 목록으로
        </Link>
      </div>
    );
  }

  return (
    <div className="page-container">
      <Link
        href="/inbox"
        className="mb-4 inline-block text-sm text-gray-400 hover:text-gray-600"
      >
        ← 받은 질문 목록
      </Link>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">질문에 답변하기</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="rounded-lg bg-indigo-50 px-4 py-3">
          <p className="text-xs text-indigo-500 font-medium mb-1">질문</p>
          <p className="text-sm text-indigo-900">{question.questionText}</p>
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-gray-700">나의 답변</p>
          <Textarea
            placeholder="솔직하게 답변해보세요"
            value={answerText}
            onChange={(e) => setAnswerText(e.target.value)}
            error={answerText.length > 0 && !isValid}
            className="min-h-[120px]"
            disabled={isSubmitting || question.isAnswered}
          />
          <p className={`mt-1 text-right text-xs ${isValid ? "text-gray-400" : "text-red-400"}`}>
            {answerText.trim().length}자 {!isValid && `(최소 ${MIN_LENGTH}자)`}
          </p>
        </div>

        {error && <p className="text-sm text-red-500 text-center">{error}</p>}

        <Button type="submit" fullWidth disabled={!isValid || isSubmitting || question.isAnswered}>
          {isSubmitting ? "저장 중..." : "답변 저장"}
        </Button>
      </form>
    </div>
  );
}
