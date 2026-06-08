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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function getStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

const ROLES: Role[] = ["개발자", "디자이너", "마케터", "데이터분석가", "PM"];

function getRoleArray(value: unknown): Role[] {
  return getStringArray(value).filter((item): item is Role => ROLES.includes(item as Role));
}

function normalizeContactMethods(value: unknown): ContactMethod[] {
  if (!Array.isArray(value)) return [];

  return value.flatMap((item) => {
    if (!isRecord(item)) return [];

    const contactType = item.type ?? item.method;
    const contactValue = item.value;

    const allowedTypes = ["email", "link", "instagram", "openchat"]; // instagram, openchat은 link로 변환 대상
    if (!allowedTypes.includes(contactType as string) || typeof contactValue !== "string") {
      return [];
    }
    
    // DB 계약 준수: email이 아니면 모두 link로 정규화
    const finalType = (contactType === "email" ? "email" : "link") as ContactMethod["type"];
    return [{ type: finalType, value: contactValue }];
  });
}

function normalizeStudentProfile(value: unknown): StudentProfile | null {
  if (!value || typeof value !== "object") return null;

  const data = value as Record<string, unknown>;
  const { id, name, department, year, bio, avatarInitial, classId } = data;
  
  // roles(배열) 또는 role(단수) 대응
  let role: Role | null = null;
  if (typeof data.role === "string" && ROLES.includes(data.role as Role)) {
    role = data.role as Role;
  } else if (Array.isArray(data.roles) && data.roles.length > 0 && ROLES.includes(data.roles[0] as Role)) {
    role = data.roles[0] as Role;
  }

  if (
    typeof id !== "string" ||
    typeof name !== "string" ||
    typeof department !== "string" ||
    typeof year !== "number" ||
    !role
  ) {
    return null;
  }

  return {
    id,
    name,
    department,
    year,
    bio: typeof bio === "string" && bio.length > 0 ? bio : null,
    role,
    interests: getStringArray(data.interests),
    skills: getStringArray(data.skills),
    lookingFor: getRoleArray(data.lookingFor),
    contactMethods: normalizeContactMethods(data.contactMethods ?? data.contacts),
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
