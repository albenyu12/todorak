/**
 * Mock LocalStorage Manager
 * Handles simulation of persistence using browser localStorage.
 * Legacy utility kept for backward compatibility during Step 08 migration.
 */

import { StudentProfile, Answer, AnonymousQuestion, Role, ContactMethod } from "./types";
import { MOCK_ANSWERS } from "./mock-answers";

const KEYS = {
  CURRENT_USER: "todorak_current_user",
  ANSWERS: "todorak_answers",
  ANONYMOUS_QUESTIONS: "todorak_anonymous_questions",
  SERVER_START_TIME: "todorak_server_start",
} as const;

function safeParse<T>(json: string | null): T | null {
  if (!json) return null;
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function getStringArray(val: unknown): string[] {
  return Array.isArray(val) ? val.filter((v): v is string => typeof v === "string") : [];
}

function getRoleArray(val: unknown): Role[] {
  const roles: Role[] = ["개발자", "디자이너", "마케터", "데이터분석가", "PM"];
  return Array.isArray(val) ? val.filter((v): v is Role => roles.includes(v as Role)) : [];
}

function normalizeContactMethods(val: unknown): ContactMethod[] {
  if (!Array.isArray(val)) return [];
  return val.filter((v): v is ContactMethod => 
    !!v && typeof v === "object" && "type" in v && "value" in v
  );
}

const ROLES: Role[] = ["개발자", "디자이너", "마케터", "데이터분석가", "PM"];

function normalizeStudentProfile(value: unknown): StudentProfile | null {
  if (!value || typeof value !== "object") return null;

  const data = value as Record<string, unknown>;
  const { id, name, department, year, bio, role, interests, skills, lookingFor, contactMethods, avatarInitial, classId } = data;

  if (
    typeof id !== "string" ||
    typeof name !== "string" ||
    typeof department !== "string" ||
    typeof year !== "number" ||
    !ROLES.includes(role as Role)
  ) {
    return null;
  }

  return {
    id,
    name,
    department,
    year,
    bio: typeof bio === "string" && bio.length > 0 ? bio : null,
    role: role as Role,
    interests: getStringArray(interests),
    skills: getStringArray(skills),
    lookingFor: getRoleArray(lookingFor),
    contactMethods: normalizeContactMethods(contactMethods),
    classId: typeof classId === "string" ? classId : "legacy-class",
    avatarInitial: typeof avatarInitial === "string" ? avatarInitial : null,
  };
}

export function resetIfServerRestarted(): void {
  if (typeof window === "undefined") return;
  const current = process.env.NEXT_PUBLIC_SERVER_START_TIME;
  const stored = localStorage.getItem(KEYS.SERVER_START_TIME);
  if (stored === current) return;
  localStorage.removeItem(KEYS.ANSWERS);
  localStorage.removeItem(KEYS.ANONYMOUS_QUESTIONS);
  localStorage.removeItem(KEYS.CURRENT_USER);
  localStorage.setItem(KEYS.SERVER_START_TIME, current ?? "");
}

export function saveCurrentUser(profile: StudentProfile): void {
  localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(profile));
}

export function getCurrentUser(): StudentProfile | null {
  if (typeof window === "undefined") return null;
  return normalizeStudentProfile(safeParse<unknown>(localStorage.getItem(KEYS.CURRENT_USER)));
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

const MOCK_ANONYMOUS_QUESTIONS_SEED = [
  { questionId: "q-col-1", questionText: "팀에서 소통할 때 가장 선호하는 방식은 무엇인가요?" },
  { questionId: "q-rol-1", questionText: "팀 프로젝트에서 주로 어떤 역할을 맡나요?" },
  { questionId: "q-int-1", questionText: "요즘 가장 관심 있는 분야나 기술이 있나요?" },
  { questionId: "q-wst-3", questionText: "작업할 때 혼자 집중하는 걸 선호하나요, 아니면 함께 하는 걸 선호하나요?" },
];

export function initMockAnonymousQuestions(userId: string): void {
  if (typeof window === "undefined") return;
  const existing = getAnonymousQuestionsFor(userId);
  if (existing.length > 0) return;

  const now = new Date("2026-05-20T10:00:00.000Z");
  const seeded: AnonymousQuestion[] = MOCK_ANONYMOUS_QUESTIONS_SEED.map((q, i) => ({
    id: `aq-mock-${i + 1}`,
    questionId: q.questionId,
    questionText: q.questionText,
    targetStudentId: userId,
    createdAt: new Date(now.getTime() + i * 3600000).toISOString(),
  }));

  const all = getAllAnonymousQuestions();
  localStorage.setItem(KEYS.ANONYMOUS_QUESTIONS, JSON.stringify([...all, ...seeded]));
}
