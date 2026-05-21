// ⚠️ 중요: 이 파일의 Answer 데이터에는 답변자 이름을 저장하지 않습니다.
// 학생 식별은 반드시 targetStudentId로만 합니다.
// 이름이 필요한 경우 MOCK_STUDENTS에서 id로 조회하세요.

// TODO (Y): mock 답변을 localStorage seed 데이터로 주입
// 입력값: MOCK_ANSWERS 배열
// 해야 할 일: 앱 초기 로드 시 localStorage에 MOCK_ANSWERS가 없으면
//             seed 데이터로 주입하는 initMockAnswers() 함수 추가
//             (예: lib/localStorage.ts에 initIfEmpty 함수 추가)
// 완료 기준: 첫 방문 시 /answers 페이지에 샘플 Q&A가 보임

// TODO (Y): mock 답변 내용 검수
// 입력값: MOCK_ANSWERS 배열의 answerText
// 해야 할 일: 실제 사용자가 기록할 법한 자연스러운 대화체로 수정,
//             너무 완성된 문장보다 구어체에 가깝게 다듬기
// 완료 기준: 팀원 리뷰 후 어색한 답변 없음

import { Answer } from "@/lib/types";

export const MOCK_ANSWERS: Answer[] = [
  {
    id: "ans-mock-1",
    questionId: "q-col-1",
    questionText: "팀에서 소통할 때 가장 선호하는 방식은 무엇인가요?",
    answerText: "짧은 데일리 스탠드업으로 진행 상황을 공유하고, 나머지는 비동기로 처리하는 걸 좋아해요.",
    targetStudentId: "student-1",
    recordedAt: "2026-05-10T10:30:00.000Z",
    answerType: "inperson",
  },
  {
    id: "ans-mock-2",
    questionId: "q-role-1",
    questionText: "팀 프로젝트에서 주로 어떤 역할을 맡는 편인가요?",
    answerText: "주로 디자인 시스템 구축을 맡아요. 컴포넌트를 만들어두면 팀 전체가 일관성 있게 쓸 수 있어서 좋아합니다.",
    targetStudentId: "student-2",
    recordedAt: "2026-05-10T11:00:00.000Z",
    answerType: "online",
  },
  {
    id: "ans-mock-3",
    questionId: "q-goal-1",
    questionText: "이번 학기 팀 프로젝트에서 가장 얻고 싶은 것은 무엇인가요?",
    answerText: "실제로 사용자가 쓰는 서비스를 만들어보고 싶어요. 배포까지 끝낸 경험이 없어서 이번엔 꼭 해보고 싶습니다.",
    targetStudentId: "student-3",
    recordedAt: "2026-05-11T09:00:00.000Z",
    answerType: "online",
  },
  {
    id: "ans-mock-4",
    questionId: "q-int-1",
    questionText: "요즘 가장 관심 있는 분야나 기술은 무엇인가요?",
    answerText: "LLM 파인튜닝이요. 특히 작은 모델로 특정 도메인에서 좋은 성능을 내는 방법을 연구하고 있어요.",
    targetStudentId: "student-4",
    recordedAt: "2026-05-11T14:00:00.000Z",
    answerType: "inperson",
  },
  {
    id: "ans-mock-5",
    questionId: "q-ws-3",
    questionText: "혼자 작업하는 것과 같이 작업하는 것 중 어느 쪽이 더 편한가요?",
    answerText: "아이디어 발산은 같이 하고, 실제 작업은 혼자 하는 게 제일 좋아요. 집중이 잘 되거든요.",
    targetStudentId: "student-5",
    recordedAt: "2026-05-12T10:00:00.000Z",
    answerType: "inperson",
  },
  {
    id: "ans-mock-6",
    questionId: "q-con-1",
    questionText: "팀에서 의견 충돌이 생겼을 때 어떻게 해결하는 편인가요?",
    answerText: "일단 각자 의견의 근거를 정리해서 공유해요. 감정보다 데이터나 논리로 이야기하면 보통 잘 풀리더라고요.",
    targetStudentId: "student-6",
    recordedAt: "2026-05-12T15:00:00.000Z",
    answerType: "online",
  },
  {
    id: "ans-mock-7",
    questionId: "q-int-2",
    questionText: "지금 진행 중이거나 해보고 싶은 사이드 프로젝트가 있나요?",
    answerText: "캠퍼스 내 중고거래 앱을 만들어보고 싶어요. 당근마켓처럼 동네 기반인데, 학교 인증을 넣어서 더 신뢰도 있게.",
    targetStudentId: "student-7",
    recordedAt: "2026-05-13T11:00:00.000Z",
    answerType: "online",
  },
  {
    id: "ans-mock-8",
    questionId: "q-ws-2",
    questionText: "마감 기한이 촉박할 때 어떻게 대처하나요?",
    answerText: "먼저 할 일 목록을 다시 정리해서 우선순위를 매겨요. 그리고 팀원들에게 상황을 투명하게 공유하는 게 제일 중요하다고 생각해요.",
    targetStudentId: "student-8",
    recordedAt: "2026-05-13T16:00:00.000Z",
    answerType: "inperson",
  },
  {
    id: "ans-mock-9",
    questionId: "q-col-2",
    questionText: "협업할 때 가장 중요하게 생각하는 것은 무엇인가요?",
    answerText: "심리적 안전감이요. 틀린 말을 해도 괜찮은 분위기여야 좋은 아이디어가 나온다고 생각해요.",
    targetStudentId: "student-1",
    recordedAt: "2026-05-14T09:30:00.000Z",
    answerType: "online",
  },
  {
    id: "ans-mock-10",
    questionId: "q-role-2",
    questionText: "본인이 팀에 가장 기여할 수 있는 강점은 무엇인가요?",
    answerText: "사용자 리서치예요. 디자인하기 전에 실제 사용자 인터뷰를 해서 문제를 검증하는 과정을 중요하게 생각해요.",
    targetStudentId: "student-2",
    recordedAt: "2026-05-14T13:00:00.000Z",
    answerType: "inperson",
  },
  {
    id: "ans-mock-11",
    questionId: "q-ws-1",
    questionText: "하루 중 가장 집중이 잘 되는 시간대와 환경이 어떻게 되나요?",
    answerText: "저녁 9시 이후가 제일 잘 돼요. 도서관보다는 카페나 집이 편하고, 음악 틀어놓고 일하는 걸 좋아합니다.",
    targetStudentId: "student-4",
    recordedAt: "2026-05-15T10:00:00.000Z",
    answerType: "inperson",
  },
  {
    id: "ans-mock-12",
    questionId: "q-goal-2",
    questionText: "이 팀에서 6개월 후 어떤 결과물을 만들고 싶으신가요?",
    answerText: "실제 유저가 100명 이상 쓰는 서비스요. 완성도보다 실제로 쓰이는 게 더 중요하다고 생각해서, MVP를 빠르게 내고 피드백을 받고 싶어요.",
    targetStudentId: "student-3",
    recordedAt: "2026-05-15T14:30:00.000Z",
    answerType: "online",
  },
];
