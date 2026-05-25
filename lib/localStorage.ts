"use client";

import { StudentProfile, Answer, AnonymousQuestion } from "@/lib/types";
import { MOCK_ANSWERS } from "@/lib/mock-answers";

function safeParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

const KEYS = {
  CURRENT_USER: "todorak_current_user",
  ANSWERS: "todorak_answers",
  ANONYMOUS_QUESTIONS: "todorak_anonymous_questions",
} as const;

export function saveCurrentUser(profile: StudentProfile): void {
  localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(profile));
}

export function getCurrentUser(): StudentProfile | null {
  if (typeof window === "undefined") return null;
  return safeParse<StudentProfile>(localStorage.getItem(KEYS.CURRENT_USER));
}

export function clearCurrentUser(): void {
  localStorage.removeItem(KEYS.CURRENT_USER);
}

export function saveAnswer(answer: Answer): void {
  const existing = getAnswers();
  existing.push(answer);
  localStorage.setItem(KEYS.ANSWERS, JSON.stringify(existing));
}

export function getAnswers(): Answer[] {
  if (typeof window === "undefined") return [];
  
  // [1번 todo 해결 : getAnswers 호출 시점에 initMockAnswers를 트리거하여 첫 방문자가 /answers 페이지에 진입했을 때 데이터가 자동으로 심기도록 보장]
  initMockAnswers();
  
  return safeParse<Answer[]>(localStorage.getItem(KEYS.ANSWERS)) ?? [];
}

export function getAnswerById(id: string): Answer | null {
  return getAnswers().find((a) => a.id === id) ?? null;
}

export function initMockAnswers(): void {
  if (typeof window === "undefined") return;
  const parsed = safeParse<Answer[]>(localStorage.getItem(KEYS.ANSWERS));
  if (parsed) {
    // 구버전 데이터(answerType 없음)면 재시딩
    // [빌드 에러 해결: parsed는 배열이므로 첫 번째 아이템인 parsed[0].answerType의 유무를 체크하도록 정상 수정]
    if (parsed.length > 0 && !parsed[0].answerType) {
      localStorage.removeItem(KEYS.ANSWERS);
    } else {
      return;
    }
  }
  localStorage.setItem(KEYS.ANSWERS, JSON.stringify(MOCK_ANSWERS));
}

export function saveAnonymousQuestion(q: AnonymousQuestion): void {
  const all = getAllAnonymousQuestions();
  all.push(q);
  localStorage.setItem(KEYS.ANONYMOUS_QUESTIONS, JSON.stringify(all));
}

function getAllAnonymousQuestions(): AnonymousQuestion[] {
  if (typeof window === "undefined") return [];
  return safeParse<AnonymousQuestion[]>(localStorage.getItem(KEYS.ANONYMOUS_QUESTIONS)) ?? [];
}

export function getAnonymousQuestionsFor(studentId: string): AnonymousQuestion[] {
  return getAllAnonymousQuestions().filter((q) => q.targetStudentId === studentId);
}

export function deleteAnonymousQuestion(id: string): void {
  const updated = getAllAnonymousQuestions().filter((q) => q.id !== id);
  localStorage.setItem(KEYS.ANONYMOUS_QUESTIONS, JSON.stringify(updated));
}
