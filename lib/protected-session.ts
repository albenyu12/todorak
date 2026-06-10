import { getProfileById } from "@/lib/api/profiles";
import type { StudentProfile } from "@/lib/api/types";
import {
  getClassCodeFromSearchParams,
  getStoredProfileId,
  resolveClassSession,
  type ClassSession,
  type ClassSessionState,
} from "@/lib/client-session";

type SearchParamsReader = {
  get(name: string): string | null;
};

export type ProtectedProfileSessionState =
  | { status: "missing" }
  | { status: "invalid"; classCode: string }
  | { status: "missingProfile"; session: ClassSession }
  | { status: "ready"; session: ClassSession; profile: StudentProfile };

export async function resolveProtectedProfileSession(
  searchParams: SearchParamsReader
): Promise<ProtectedProfileSessionState> {
  const classCode = getClassCodeFromSearchParams(searchParams);
  const classState: ClassSessionState = await resolveClassSession(classCode);

  if (classState.status === "missing") {
    return { status: "missing" };
  }

  if (classState.status === "invalid") {
    return { status: "invalid", classCode: classState.classCode };
  }

  const profileId = getStoredProfileId();
  if (!profileId) {
    return { status: "missingProfile", session: classState.session };
  }

  const profileRes = await getProfileById(profileId, classState.session.classId);
  if (!profileRes.data) {
    return { status: "missingProfile", session: classState.session };
  }

  return {
    status: "ready",
    session: classState.session,
    profile: profileRes.data,
  };
}
