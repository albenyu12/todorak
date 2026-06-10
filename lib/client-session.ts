/**
 * Supabase v2.0 Client Session Utilities
 * Handles localStorage for classCode, classId, and profileId.
 */

import { getClassByCode } from "@/lib/api/classes";
import type { Class } from "@/lib/api/types";

const KEYS = {
  CLASS_CODE: "todorak:classCode",
  CLASS_ID: "todorak:classId",
  PROFILE_ID: "todorak:profileId",
} as const;

const MOCK_CURRENT_USER_KEY = "todorak_current_user";
const DEFAULT_CLASS_CODE: Class["code"] = "WEBPROGRAMMING_2026";

export type ClassSession = {
  classCode: string;
  classId: string;
};

export type ClassSessionState =
  | { status: "missing" }
  | { status: "invalid"; classCode: string }
  | { status: "ready"; classInfo: Class; session: ClassSession };

type SearchParamsReader = {
  get(name: string): string | null;
};

function normalizeClassCode(code: string | null): string | null {
  const normalized = code?.trim();
  return normalized && normalized.length > 0 ? normalized : null;
}

export function getClassCodeFromSearchParams(searchParams: SearchParamsReader): string | null {
  return normalizeClassCode(searchParams.get("class"));
}

export function getStoredClassCode(): string | null {
  if (typeof window === "undefined") return null;
  return normalizeClassCode(localStorage.getItem(KEYS.CLASS_CODE));
}

export function setStoredClassCode(code: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEYS.CLASS_CODE, code);
}

export function getStoredClassId(): string | null {
  if (typeof window === "undefined") return null;
  return normalizeClassCode(localStorage.getItem(KEYS.CLASS_ID));
}

export function setStoredClassId(id: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEYS.CLASS_ID, id);
}

export function getStoredProfileId(): string | null {
  if (typeof window === "undefined") return null;
  return normalizeClassCode(localStorage.getItem(KEYS.PROFILE_ID));
}

export function setStoredProfileId(id: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEYS.PROFILE_ID, id);
}

export function clearSession(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEYS.CLASS_CODE);
  localStorage.removeItem(KEYS.CLASS_ID);
  localStorage.removeItem(KEYS.PROFILE_ID);
}

function clearMockCurrentUser(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(MOCK_CURRENT_USER_KEY);
}

function hasLegacyMockCurrentUser(): boolean {
  if (typeof window === "undefined") return false;

  const rawUser = localStorage.getItem(MOCK_CURRENT_USER_KEY);
  if (!rawUser) return false;

  try {
    const parsed = JSON.parse(rawUser) as { classId?: unknown };
    return typeof parsed.classId !== "string" || parsed.classId.length === 0;
  } catch {
    return true;
  }
}

export function getStoredClassSession(): ClassSession | null {
  const classCode = getStoredClassCode();
  const classId = getStoredClassId();
  if (!classCode || !classId) return null;
  return { classCode, classId };
}

export function saveClassSession(classInfo: Class): ClassSession {
  const previousClassId = getStoredClassId();
  const classChanged = previousClassId !== null && previousClassId !== classInfo.id;
  const legacyWithoutClassSession = previousClassId === null && hasLegacyMockCurrentUser();

  if (classChanged || legacyWithoutClassSession) {
    localStorage.removeItem(KEYS.PROFILE_ID);
    clearMockCurrentUser();
  }

  setStoredClassCode(classInfo.code);
  setStoredClassId(classInfo.id);
  return {
    classCode: classInfo.code,
    classId: classInfo.id,
  };
}

export async function resolveClassSession(classCode: string | null): Promise<ClassSessionState> {
  const targetClassCode = normalizeClassCode(classCode) ?? getStoredClassCode() ?? DEFAULT_CLASS_CODE;

  const classInfo = await getClassByCode(targetClassCode);
  if (!classInfo) {
    clearSession();
    clearMockCurrentUser();
    return { status: "invalid", classCode: targetClassCode };
  }

  return {
    status: "ready",
    classInfo,
    session: saveClassSession(classInfo),
  };
}

export function withClassCode(path: string, classCode: string): string {
  const [pathname, rawQuery = ""] = path.split("?");
  const params = new URLSearchParams(rawQuery);
  params.set("class", classCode);
  return `${pathname}?${params.toString()}`;
}
