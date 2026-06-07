// 1번 TODO (Y): role 정확 매칭으로 교체.
// 입력값: currentUser.lookingFor (Role[]), student.role (Role)
// 해야 할 일: 현재 skills 문자열 포함 비교를 role 정확 일치로 변경
//             currentUser.lookingFor.includes(student.role) 방식으로 교체
// 완료 기준: lookingFor에 "디자이너"가 있고 student.role이 "디자이너"이면 매칭됨

// 3번 TODO (Y): 차이 기반 추천 (보완성 강화)
// 입력값: currentUser.skills, student.skills
// 해야 할 일: 겹치는 스킬이 적을수록 보완 가능성이 높다고 판단,
//             스킬 차집합 크기에 비례해 점수 추가
// 완료 기준: 비슷한 사람보다 보완적인 사람이 더 높은 점수를 받음

// 4번 TODO (Y): 미탐색 학생 우선 부스트
// 입력값: exploredStudentIds (getAnswers()에서 targetStudentId 추출)
// 해야 할 일: 이미 답변이 기록된 학생 ID 목록을 받아서 해당 학생 점수에 패널티 적용
//             (완전 제외 대신 패널티로 구현하면 나중에 조정 용이)
// 완료 기준: 대화한 적 없는 학생이 같은 매칭 점수일 때 우선 노출됨

// 5번 TODO (Y): 약간의 랜덤성 추가
// 입력값: 동점 학생들 (score 동일)
// 해야 할 일: 동점 처리 시 Math.random() 기반 셔플 또는 소수점 노이즈 추가
// 완료 기준: 같은 프로필로 반복 방문해도 추천 순서가 매번 완전히 동일하지 않음

import { StudentProfile, RecommendationResult } from "@/lib/types";

export function getRecommendations(
  currentUser: StudentProfile,
  allStudents: StudentProfile[],
  exploredStudentIds: string[] = []
): RecommendationResult[] {
  const others = allStudents.filter((s) => s.id !== currentUser.id);

  // exploredStudentIds의 유효성 검증
  const safeExploredIds = Array.isArray(exploredStudentIds) ? exploredStudentIds : [];

  const scored = others.map((student) => {
    let score = 0;
    const matchReasons: string[] = [];

    // 공통 관심사
    const sharedInterests = (currentUser.interests || []).filter((i) =>
      (student.interests || []).includes(i)
    );
    if (sharedInterests.length > 0) {
      const interestScore = sharedInterests.length * 10;
      score += interestScore;
      matchReasons.push(`공통 관심사: ${sharedInterests.join(", ")} (+${interestScore}점)`);
    }

    // 1번 TODO (Y): role 정확 매칭 및 가산점 텍스트 명시
    const wantsFromStudent = (currentUser.lookingFor || []).includes(student.role);
    if (wantsFromStudent) {
      score += 20;
      matchReasons.push("내가 찾고 있는 역할 보유 (+20점)");
    }

    const studentWantsMe = (student.lookingFor || []).includes(currentUser.role);
    if (studentWantsMe) {
      score += 15;
      matchReasons.push("상대방이 찾는 역할 보유 (+15점)");
    }

    // 3번 TODO 해결(Y): 차이 기반 추천 (보완성 강화)
    const complementarySkills = (student.skills || []).filter(
      (skill) => !(currentUser.skills || []).includes(skill)
    );

    if (complementarySkills.length > 0) {
      const skillScore = complementarySkills.length * 5;
      score += skillScore;
      matchReasons.push(
        `보유 스킬 보완 (${complementarySkills.join(", ")}) (+${skillScore}점)`
      );
    }

    // 🔥 [추가 기능] 사유 목록 맨 앞에 총점 줄바꿈 텍스트를 주입하여 카드 최상단에 노출시킵니다.
    matchReasons.unshift(`🔥 추천 총합 점수: ${Math.floor(score)}점`);

    // 5번 TODO 해결(Y): 동점 시 랜덤 순서를 위해 score에 소수점 노이즈 부여
    const noise = Math.random() * 0.001;
    return { student, score: score + noise, matchReasons };
  });

  // 4번 TODO & 5번 TODO 완벽 통합 정렬 로직
  return scored.sort((a, b) => {
    const aExplored = safeExploredIds.includes(a.student.id);
    const bExplored = safeExploredIds.includes(b.student.id);
    if (aExplored !== bExplored) {
      return aExplored ? 1 : -1;
    }

    return b.score - a.score;
  });
}
