"use client";

import { StudentProfile, Answer, AnonymousQuestion } from "@/lib/types";
import { MOCK_ANSWERS } from "@/lib/mock-answers";

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
  const raw = localStorage.getItem(KEYS.CURRENT_USER);
  return raw ? (JSON.parse(raw) as StudentProfile) : null;
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
  const raw = localStorage.getItem(KEYS.ANSWERS);
  return raw ? (JSON.parse(raw) as Answer[]) : [];
}

export function getAnswerById(id: string): Answer | null {
  return getAnswers().find((a) => a.id === id) ?? null;
}

export function initMockAnswers(): void {
  if (typeof window === "undefined") return;
  const raw = localStorage.getItem(KEYS.ANSWERS);
  if (raw) {
    const parsed = JSON.parse(raw) as Answer[];
    // 구버전 데이터(answerType 없음)면 재시딩
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
  const raw = localStorage.getItem(KEYS.ANONYMOUS_QUESTIONS);
  return raw ? (JSON.parse(raw) as AnonymousQuestion[]) : [];
}

export function getAnonymousQuestionsFor(studentId: string): AnonymousQuestion[] {
  return getAllAnonymousQuestions().filter((q) => q.targetStudentId === studentId);
}

export function deleteAnonymousQuestion(id: string): void {
  const updated = getAllAnonymousQuestions().filter((q) => q.id !== id);
  localStorage.setItem(KEYS.ANONYMOUS_QUESTIONS, JSON.stringify(updated));
}
