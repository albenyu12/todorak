// TODO (Y): 질문 수 보강
// 입력값: QUESTIONS 배열
// 해야 할 일: 각 카테고리당 최소 3개 이상이 되도록 질문 추가
// 완료 기준: 카테고리 탭 필터 시 항상 2개 이상의 질문이 표시됨

// TODO (Y): 프로필 기반 추천 질문 확장
// 입력값: StudentProfile (interests, role, collaborationStyle)
// 해야 할 일: getPersonalizedQuestions(profile: StudentProfile): RecommendedQuestion[]
//             함수를 추가해서 상대방 프로필에 따라 질문을 추천
//             예: role이 "디자이너"면 "어떤 디자인 툴을 주로 사용하나요?" 같은 질문 우선 노출
// 완료 기준: ask 페이지에서 상대 학생 프로필 기반으로 상위 N개 질문이 추천됨

// TODO (Y): 질문 텍스트 검수
// 입력값: 각 질문의 text 필드
// 해야 할 일: 팀원들과 리뷰 후 어색한 표현 수정, 중복 제거
// 완료 기준: 모든 질문이 자연스러운 한국어로 작성되고 중복이 없음

import { RecommendedQuestion } from "@/lib/types";

export const QUESTIONS: RecommendedQuestion[] = [
  // collaboration
  { id: "q-col-1", text: "팀에서 소통할 때 가장 선호하는 방식은 무엇인가요?", category: "collaboration" },
  { id: "q-col-2", text: "협업할 때 가장 중요하게 생각하는 것은 무엇인가요?", category: "collaboration" },

  // role
  { id: "q-role-1", text: "팀 프로젝트에서 주로 어떤 역할을 맡는 편인가요?", category: "role" },
  { id: "q-role-2", text: "본인이 팀에 가장 기여할 수 있는 강점은 무엇인가요?", category: "role" },

  // conflict
  { id: "q-con-1", text: "팀에서 의견 충돌이 생겼을 때 어떻게 해결하는 편인가요?", category: "conflict" },
  { id: "q-con-2", text: "다른 사람의 피드백을 받을 때 어떻게 받아들이나요?", category: "conflict" },

  // work_style
  { id: "q-ws-1", text: "하루 중 가장 집중이 잘 되는 시간대와 환경이 어떻게 되나요?", category: "work_style" },
  { id: "q-ws-2", text: "마감 기한이 촉박할 때 어떻게 대처하나요?", category: "work_style" },
  { id: "q-ws-3", text: "혼자 작업하는 것과 같이 작업하는 것 중 어느 쪽이 더 편한가요?", category: "work_style" },

  // interest
  { id: "q-int-1", text: "요즘 가장 관심 있는 분야나 기술은 무엇인가요?", category: "interest" },
  { id: "q-int-2", text: "지금 진행 중이거나 해보고 싶은 사이드 프로젝트가 있나요?", category: "interest" },

  // goal
  { id: "q-goal-1", text: "이번 학기 팀 프로젝트에서 가장 얻고 싶은 것은 무엇인가요?", category: "goal" },
  { id: "q-goal-2", text: "이 팀에서 6개월 후 어떤 결과물을 만들고 싶으신가요?", category: "goal" },
];

export const QUESTIONS_BY_CATEGORY = QUESTIONS.reduce<
  Record<string, RecommendedQuestion[]>
>((acc, q) => {
  if (!acc[q.category]) acc[q.category] = [];
  acc[q.category].push(q);
  return acc;
}, {});
