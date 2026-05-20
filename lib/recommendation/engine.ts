// TODO (Y): 현재는 interests 겹치는 수 기반 단순 점수 계산 — 더 정교한 알고리즘으로 개선 필요
// TODO (Y): lookingFor ↔ skills 매칭 가중치 조정
// TODO (Y): 이미 대화한 학생은 추천 목록에서 제외하는 로직 추가

import { StudentProfile, RecommendationResult } from "@/lib/types";

export function getRecommendations(
  currentUser: StudentProfile,
  allStudents: StudentProfile[]
): RecommendationResult[] {
  const others = allStudents.filter((s) => s.id !== currentUser.id);

  const scored = others.map((student) => {
    let score = 0;
    const matchReasons: string[] = [];

    // TODO (Y): 겹치는 interests 수 → 점수 반영 로직 구현
    const sharedInterests = currentUser.interests.filter((i) =>
      student.interests.includes(i)
    );
    if (sharedInterests.length > 0) {
      score += sharedInterests.length * 10;
      matchReasons.push(`공통 관심사: ${sharedInterests.join(", ")}`);
    }

    // TODO (Y): lookingFor ↔ skills 매칭 로직 구현
    const wantsFromStudent = currentUser.lookingFor.some((role) =>
      student.skills.some((skill) => skill.includes(role) || role.includes(skill))
    );
    if (wantsFromStudent) {
      score += 20;
      matchReasons.push("찾고 있는 역량 보유");
    }

    const studentWantsMe = student.lookingFor.some((role) =>
      currentUser.skills.some((skill) => skill.includes(role) || role.includes(skill))
    );
    if (studentWantsMe) {
      score += 15;
      matchReasons.push("상대방이 찾는 역량 보유");
    }

    return { student, score, matchReasons };
  });

  return scored.sort((a, b) => b.score - a.score);
}
