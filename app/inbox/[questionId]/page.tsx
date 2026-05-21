"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { AnonymousQuestion, Answer } from "@/lib/types";
import {
  getCurrentUser,
  getAnonymousQuestionsFor,
  saveAnswer,
  deleteAnonymousQuestion,
} from "@/lib/localStorage";
import Button from "@/components/ui/button";
import Textarea from "@/components/ui/textarea";

const MIN_LENGTH = 10;

export default function InboxAnswerPage() {
  const { questionId } = useParams<{ questionId: string }>();
  const router = useRouter();
  const [question, setQuestion] = useState<AnonymousQuestion | null>(null);
  const [answerText, setAnswerText] = useState("");

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      router.replace("/onboarding");
      return;
    }
    const found = getAnonymousQuestionsFor(user.id).find((q) => q.id === questionId) ?? null;
    setQuestion(found);
  }, [questionId, router]);

  const isValid = answerText.trim().length >= MIN_LENGTH;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!question || !isValid) return;

    const answer: Answer = {
      id: `ans-${Date.now()}`,
      questionId: question.questionId,
      questionText: question.questionText,
      answerText: answerText.trim(),
      targetStudentId: question.targetStudentId,
      recordedAt: new Date().toISOString(),
      answerType: "online",
    };

    saveAnswer(answer);
    deleteAnonymousQuestion(question.id);
    router.push("/answers");
  }

  if (!question) {
    return (
      <div className="page-container text-center py-16">
        <p className="text-gray-400">질문을 찾을 수 없습니다.</p>
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
          />
          <p className={`mt-1 text-right text-xs ${isValid ? "text-gray-400" : "text-red-400"}`}>
            {answerText.trim().length}자 {!isValid && `(최소 ${MIN_LENGTH}자)`}
          </p>
        </div>

        <Button type="submit" fullWidth disabled={!isValid}>
          답변 저장
        </Button>
      </form>
    </div>
  );
}
