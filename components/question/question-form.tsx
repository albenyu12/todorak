"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { RecommendedQuestion } from "@/lib/types";
import { QUESTIONS } from "@/lib/questions";
import { saveAnonymousQuestion } from "@/lib/localStorage";
import { useIsClient } from "@/lib/use-is-client";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import RecommendedQuestionList from "./recommended-question-list";

interface QuestionFormProps {
  studentId: string;
  mode: "inperson" | "online";
}

export default function QuestionForm({ studentId, mode }: QuestionFormProps) {
  const router = useRouter();
  const isClient = useIsClient();
  const [selectedQuestion, setSelectedQuestion] = useState<RecommendedQuestion | null>(null);
  const [customText, setCustomText] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const isOnline = mode === "online";

  // 하이드레이션 오류 해결: 클라이언트 사이드에서만 질문을 랜덤하게 추출
  const randomQuestions = useMemo(() => {
    if (!isClient || mode === "online") return [];
    // eslint-disable-next-line react-hooks/purity
    return [...QUESTIONS].sort(() => Math.random() - 0.5).slice(0, 3);
  }, [isClient, mode]);

  const finalText = customText.trim() || selectedQuestion?.text || "";

  /**
   * BACKEND COLLABORATION: Submit Handler
   * 이 영역은 백엔드 협업자가 API 연결 시 수정할 부분입니다.
   * 현재는 localStorage를 사용하거나 query parameter로 넘기는 임시 로직입니다.
   */
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!finalText) {
      setError("질문을 선택하거나 직접 입력해주세요.");
      return;
    }
    setError("");

    if (isOnline) {
      // 온라인(익명) 질문 저장 로직 (임시: localStorage)
      saveAnonymousQuestion({
        id: `aq-${Date.now()}`,
        questionId: selectedQuestion?.id ?? `custom-${Date.now()}`,
        questionText: finalText,
        targetStudentId: studentId,
        createdAt: new Date().toISOString(),
      });
      setSubmitted(true);
      return;
    }

    // 대면 질문 로직 (임시: 다음 페이지로 데이터 전달)
    const params = new URLSearchParams({
      qid: selectedQuestion?.id ?? `custom-${Date.now()}`,
      qtext: finalText,
    });
    router.push(`/students/${studentId}/record?${params.toString()}`);
  }
  // END OF SUBMIT HANDLER

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
      {/* 1. 익명 질문 페이지에서는 추천 질문 섹션을 표시하지 않음 */}
      {!isOnline && (
        <div>
          <p className="mb-2 text-sm font-medium text-gray-700">추천 질문 선택</p>
          <RecommendedQuestionList
            questions={randomQuestions}
            selectedQuestionId={selectedQuestion?.id ?? null}
            showCategories={false} // 대면 질문에서는 카테고리 선택 버튼 제거
            showBadge={false}      // 대면 질문에서는 문장 앞 카테고리 태그 제거
            onSelect={(q) => {
              setSelectedQuestion(q);
              setCustomText("");
              setError("");
            }}
          />
        </div>
      )}

      <div>
        {!isOnline && (
          <p className="mb-2 text-sm font-medium text-gray-700">직접 질문 입력</p>
        )}
        <Input
          placeholder="질문을 직접 입력하세요"
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
