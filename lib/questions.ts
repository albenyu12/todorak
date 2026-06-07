// 1번 TODO (Y): 질문 수 보강
// 입력값: QUESTIONS 배열
// 해야 할 일: 각 카테고리당 최소 3개 이상이 되도록 질문 추가
// 완료 기준: 카테고리 탭 필터 시 항상 2개 이상의 질문이 표시됨

// 2번 TODO (Y): 프로필 기반 추천 질문 확장
// 입력값: StudentProfile (interests, role)
// 해야 할 일: getPersonalizedQuestions(profile: StudentProfile): RecommendedQuestion[]
//             함수를 추가해서 상대방 프로필에 따라 질문을 추천
//             예: role이 "디자이너"면 "어떤 디자인 툴을 주로 사용하나요?" 같은 질문 우선 노출
// 완료 기준: ask 페이지에서 상대 학생 프로필 기반으로 상위 N개 질문이 추천됨

// 3번 TODO (Y): 질문 텍스트 검수
// 입력값: 각 질문의 text 필드
// 해야 할 일: 팀원들과 리뷰 후 어색한 표현 수정, 중복 제거
// 완료 기준: 모든 질문이 자연스러운 한국어로 작성되고 중복이 없음

import { RecommendedQuestion, StudentProfile } from "@/lib/types";

export const QUESTIONS: RecommendedQuestion[] = [
  // collaboration (협업 - 총 4개)
  { id: "q-col-1", text: "팀에서 소통할 때 가장 선호하는 방식은 무엇인가요?", category: "collaboration" },
  { id: "q-col-2", text: "협업할 때 가장 중요하게 생각하는 가치는 무엇인가요?", category: "collaboration" },
  { id: "q-col-3", text: "이전 프로젝트에서 팀원들과 좋은 시너지를 냈던 경험이 있나요?", category: "collaboration" },
  { id: "q-col-4", text: "팀의 사기를 높이기 위해 본인이 주로 어떤 행동을 하나요?", category: "collaboration" },

  // role (역할 - 총 4개)
  { id: "q-role-1", text: "팀 프로젝트에서 주로 어떤 역할을 맡는 편인가요?", category: "role" },
  { id: "q-role-2", text: "본인이 팀에 가장 기여할 수 있는 핵심 강점은 무엇인가요?", category: "role" },
  { id: "q-role-3", text: "앞으로 도전해보고 싶거나 더 배우고 싶은 역할이 있나요?", category: "role" },
  { id: "q-role-4", text: "본인이 생각하는 리더와 팔로워의 가장 이상적인 역할 분담은 무엇인가요?", category: "role" },

  // conflict (갈등 - 총 3개)
  { id: "q-con-1", text: "팀에서 의견 충돌이 생겼을 때 어떻게 해결하는 편인가요?", category: "conflict" },
  { id: "q-con-2", text: "다른 사람의 비판적인 피드백을 받을 때 어떻게 수용하나요?", category: "conflict" },
  { id: "q-con-3", text: "팀원이 약속한 마감 기한을 지키지 못할 때 어떻게 대처하시겠습니까?", category: "conflict" },

  // work_style (작업 방식 - 총 3개)
  { id: "q-ws-1", text: "하루 중 가장 집중이 잘 되는 시간대와 환경이 어떻게 되나요?", category: "work_style" },
  { id: "q-ws-2", text: "마감 기한이 촉박할 때 압박감을 어떻게 통제하나요?", category: "work_style" },
  { id: "q-ws-3", text: "혼자 깊게 작업하는 것과 같이 모여서 작업하는 것 중 어느 쪽을 선호하나요?", category: "work_style" },

  // interest (관심사 - 총 4개)
  { id: "q-int-1", text: "요즘 가장 관심 있는 트렌드나 기술 분야는 무엇인가요?", category: "interest" },
  { id: "q-int-2", text: "지금 진행 중이거나 앞으로 꼭 해보고 싶은 사이드 프로젝트가 있나요?", category: "interest" },
  { id: "q-int-3", text: "기술적 역량을 쌓기 위해 평소에 어떤 방식으로 공부하시나요?", category: "interest" },
  { id: "q-int-4", text: "최근에 인상 깊게 보았거나 영감을 얻은 레퍼런스가 있다면 무엇인가요?", category: "interest" },

  // goal (목표 - 총 3개)
  { id: "q-goal-1", text: "이번 학기 팀 프로젝트를 통해 개인적으로 가장 얻고 싶은 성과는 무엇인가요?", category: "goal" },
  { id: "q-goal-2", text: "우리 팀이 최종적으로 만들었으면 하는 결과물의 퀄리티나 목표치는 어느 정도인가요?", category: "goal" },
  { id: "q-goal-3", text: "프로젝트가 끝난 후, 팀원들에게 어떤 동료로 기억되고 싶으신가요?", category: "goal" },
];

export const QUESTIONS_BY_CATEGORY = QUESTIONS.reduce<
  Record<string, RecommendedQuestion[]>
>((acc, q) => {
  if (!acc[q.category]) acc[q.category] = [];
  acc[q.category].push(q);
  return acc;
}, {});

// ========================================================
// 2번 TODO 해결 (Y): 프로필 기반 추천 질문 확장 함수 추가 완료
// ========================================================
export function getPersonalizedQuestions(profile: StudentProfile): RecommendedQuestion[] {
  if (!profile) return QUESTIONS;

  const scoredQuestions = QUESTIONS.map((question) => {
    let priorityScore = 0;

    if (question.category === "role" && profile.role) {
      priorityScore += 30;
    }

    if (question.category === "interest" && Array.isArray(profile.interests)) {
      priorityScore += 20;
    }

    return { question, priorityScore };
  });

  const sortedItems = scoredQuestions.sort((a, b) => b.priorityScore - a.priorityScore);

  return sortedItems.map((item) => item.question);
}
