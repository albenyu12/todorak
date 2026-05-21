// TODO (Y): role 정확 매칭으로 교체
// 입력값: currentUser.lookingFor (Role[]), student.role (Role)
// 해야 할 일: 현재 skills 문자열 포함 비교를 role 정확 일치로 변경
//             currentUser.lookingFor.includes(student.role) 방식으로 교체
// 완료 기준: lookingFor에 "디자이너"가 있고 student.role이 "디자이너"이면 매칭됨

// TODO (Y): collaborationStyle 궁합 점수 추가
// 입력값: currentUser.collaborationStyle, student.collaborationStyle
// 해야 할 일: 궁합 매트릭스 정의 (예: 리더형 + 서포터형 → +20, 리더형 + 리더형 → -5)
//             COLLABORATION_AFFINITY 객체로 관리
// 완료 기준: collaborationStyle 조합에 따라 점수가 달라지고 matchReasons에 반영됨

// TODO (Y): 차이 기반 추천 (보완성 강화)
// 입력값: currentUser.skills, student.skills
// 해야 할 일: 겹치는 스킬이 적을수록 보완 가능성이 높다고 판단,
//             스킬 차집합 크기에 비례해 점수 추가
// 완료 기준: 비슷한 사람보다 보완적인 사람이 더 높은 점수를 받음

// TODO (Y): 미탐색 학생 우선 부스트
// 입력값: exploredStudentIds (getAnswers()에서 targetStudentId 추출)
// 해야 할 일: 이미 답변이 기록된 학생 ID 목록을 받아서 해당 학생 점수에 패널티 적용
//             (완전 제외 대신 패널티로 구현하면 나중에 조정 용이)
// 완료 기준: 대화한 적 없는 학생이 같은 매칭 점수일 때 우선 노출됨

// TODO (Y): 약간의 랜덤성 추가
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

  const scored = others.map((student) => {
    let score = 0;
    const matchReasons: string[] = [];

    // 공통 관심사
    const sharedInterests = currentUser.interests.filter((i) =>
      student.interests.includes(i)
    );
    if (sharedInterests.length > 0) {
      score += sharedInterests.length * 10;
      matchReasons.push(`공통 관심사: ${sharedInterests.join(", ")}`);
    }

    // TODO (Y): 아래 두 블록을 role 정확 매칭으로 교체
    const wantsFromStudent = currentUser.lookingFor.some((role) =>
      student.skills.some((skill) => skill.includes(role) || role.includes(skill))
    );
    if (wantsFromStudent) {
      score += 20;
      matchReasons.push("찾고 있는 역할 보유");
    }

    const studentWantsMe = student.lookingFor.some((role) =>
      currentUser.skills.some((skill) => skill.includes(role) || role.includes(skill))
    );
    if (studentWantsMe) {
      score += 15;
      matchReasons.push("상대방이 찾는 역할 보유");
    }

    // 미탐색 학생 부스트 (TODO Y: 패널티 방식으로 전환)
    if (!exploredStudentIds.includes(student.id)) {
      score += 5;
    }

    return { student, score, matchReasons };
  });

  // TODO (Y): 동점 처리 시 랜덤 셔플 추가
  return scored.sort((a, b) => b.score - a.score);
}
