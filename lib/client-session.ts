/**
 * Supabase v2.0 Client Session Utilities
 * Handles localStorage for classCode, classId, and profileId.
 */

const KEYS = {
  CLASS_CODE: "todorak:classCode",
  CLASS_ID: "todorak:classId",
  PROFILE_ID: "todorak:profileId",
} as const;

export function getStoredClassCode(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(KEYS.CLASS_CODE);
}

export function setStoredClassCode(code: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEYS.CLASS_CODE, code);
}

export function getStoredClassId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(KEYS.CLASS_ID);
}

export function setStoredClassId(id: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEYS.CLASS_ID, id);
}

export function getStoredProfileId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(KEYS.PROFILE_ID);
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
