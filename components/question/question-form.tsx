"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RecommendedQuestion } from "@/lib/types";
import { QUESTIONS } from "@/lib/questions";
import { createInboxQuestion } from "@/lib/api/inbox-questions";
import { getStoredClassId } from "@/lib/client-session";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import RecommendedQuestionList from "./recommended-question-list";

interface QuestionFormProps {
  studentId: string;
  mode: "inperson" | "online";
}

export default function QuestionForm({ studentId, mode }: QuestionFormProps) {
  const router = useRouter();
  const [selectedQuestion, setSelectedQuestion] = useState<RecommendedQuestion | null>(null);
  const [customText, setCustomText] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const finalText = customText.trim() || selectedQuestion?.text || "";
  const isOnline = mode === "online";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!finalText || isSubmitting) {
      if (!finalText) setError("질문을 선택하거나 직접 입력해주세요.");
      return;
    }
    setError("");

    if (isOnline) {
      const classId = getStoredClassId();
      if (!classId) {
        setError("클래스 정보를 찾을 수 없습니다.");
        return;
      }

      setIsSubmitting(true);
      try {
        const res = await createInboxQuestion(classId, {
          targetProfileId: studentId,
          questionTemplateId: selectedQuestion?.id ?? null,
          questionText: finalText,
        });

        if (res.error) {
          setError(res.error.message);
        } else {
          setSubmitted(true);
        }
      } catch (err) {
        console.error("Create inbox question error:", err);
        setError("질문을 보내는 중 오류가 발생했습니다.");
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    const params = new URLSearchParams({
      qid: selectedQuestion?.id ?? `custom-${Date.now()}`,
      qtext: finalText,
    });
    router.push(`/students/${studentId}/record?${params.toString()}`);
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center text-center gap-4 py-8">
        <p className="text-gray-700 font-medium">질문을 남겼어요.</p>
        <p className="text-sm text-gray-400">상대방이 답변하면 Q&amp;A에서 확인할 수 있어요.</p>
        <Button variant="secondary" onClick={() => router.push(`/students/${studentId}`)}>
          프로필로 돌아가기
        </Button>
      </div>
    );
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
            setSelectedQuestion(null);
            setError("");
          }}
        />
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}

      <Button type="submit" fullWidth disabled={!finalText}>
        {isOnline ? "질문 남기기" : "이 질문으로 대화하기"}
      </Button>
    </form>
  );
}
