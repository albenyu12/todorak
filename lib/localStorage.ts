// 1번 TODO (Y): mock 답변을 localStorage seed 데이터로 주입
// 입력값: MOCK_ANSWERS 배열
// 해야 할 일: 앱 초기 로드 시 localStorage에 MOCK_ANSWERS가 없으면
//             seed 데이터로 주입하는 initMockAnswers() 함수 추가
//             (예: lib/localStorage.ts에 initIfEmpty 함수 추가)
// 완료 기준: 첫 방문 시 /answers 페이지에 샘플 Q&A가 보임

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
  return safeParse<Answer[]>(localStorage.getItem(KEYS.ANSWERS)) ?? [];
}

export function getAnswerById(id: string): Answer | null {
  return getAnswers().find((a) => a.id === id) ?? null;
}

// [1번 TODO(Y) 해결 : 앱 초기 로드 시 localStorage에 MOCK_ANSWERS 데이터가 없거나 유효하지 않으면 seed 데이터로 주입하는 initMockAnswers 기능 완성]
export function initMockAnswers(): void {
  if (typeof window === "undefined") return;
  
  const parsed = safeParse<Answer[]>(localStorage.getItem(KEYS.ANSWERS));
  
  if (parsed) {
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
  return safeParse<AnonymousQuestion[]>(localStorage.getItem(KEYS.ANONYMOUS_QUESTIONS)) ?? [];
}

export function getAnonymousQuestionsFor(studentId: string): AnonymousQuestion[] {
  return getAllAnonymousQuestions().filter((q) => q.targetStudentId === studentId);
}

export function deleteAnonymousQuestion(id: string): void {
  const updated = getAllAnonymousQuestions().filter((q) => q.id !== id);
  localStorage.setItem(KEYS.ANONYMOUS_QUESTIONS, JSON.stringify(updated));
}

