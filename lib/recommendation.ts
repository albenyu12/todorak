import { StudentProfile, RecommendationResult } from "@/lib/types";

export function getRecommendations(
  currentUser: StudentProfile,
  profiles: StudentProfile[],
  exploredProfileIds: string[] = []
): RecommendationResult[] {
  const others = profiles.filter((profile) => profile.id !== currentUser.id);

  const safeExploredProfileIds = Array.isArray(exploredProfileIds) ? exploredProfileIds : [];

  const scored = others.map((profile) => {
    let score = 0;
    const matchReasons: string[] = [];

    const sharedInterests = (currentUser.interests || []).filter((i) =>
      (profile.interests || []).includes(i)
    );
    if (sharedInterests.length > 0) {
      const interestScore = sharedInterests.length * 10;
      score += interestScore;
      matchReasons.push(`공통 관심사가 있습니다: ${sharedInterests.join(", ")}`);
    }

    const wantsFromStudent = (currentUser.lookingFor || []).includes(profile.role);
    if (wantsFromStudent) {
      score += 20;
      matchReasons.push("내가 찾고 있는 역할을 가진 프로필입니다");
    }

    const studentWantsMe = (profile.lookingFor || []).includes(currentUser.role);
    if (studentWantsMe) {
      score += 15;
      matchReasons.push("상대방이 내 역할을 찾고 있습니다");
    }

    const complementarySkills = (profile.skills || []).filter(
      (skill) => !(currentUser.skills || []).includes(skill)
    );

    if (complementarySkills.length > 0) {
      const skillScore = complementarySkills.length * 5;
      score += skillScore;
      matchReasons.push(
        `내 스킬셋을 보완할 수 있는 역량이 있습니다: ${complementarySkills.join(", ")}`
      );
    }

    return { student: profile, score, matchReasons };
  });

  return scored.sort((a, b) => {
    const aExplored = safeExploredProfileIds.includes(a.student.id);
    const bExplored = safeExploredProfileIds.includes(b.student.id);
    if (aExplored !== bExplored) {
      return aExplored ? 1 : -1;
    }

    if (a.score !== b.score) {
      return b.score - a.score;
    }

    return a.student.name.localeCompare(b.student.name, "ko-KR");
  });
}
