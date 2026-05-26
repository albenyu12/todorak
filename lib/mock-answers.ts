// ⚠️ 중요: 이 파일의 Answer 데이터에는 답변자 이름을 저장하지 않습니다.
// 학생 식별은 반드시 targetStudentId로만 합니다.
// 이름이 필요한 경우 MOCK_STUDENTS에서 id로 조회하세요.

// 1번 TODO (Y): mock 답변을 localStorage seed 데이터로 주입
// 입력값: MOCK_ANSWERS 배열
// 해야 할 일: 앱 초기 로드 시 localStorage에 MOCK_ANSWERS가 없으면
//             seed 데이터로 주입하는 initMockAnswers() 함수 추가
//             (예: lib/localStorage.ts에 initIfEmpty 함수 추가)
// 완료 기준: 첫 방문 시 /answers 페이지에 샘플 Q&A가 보임

// 2번 TODO (Y): mock 답변 내용 검수
// [2번 todo 해결 : 실제 대학생이나 주니어 개발자가 슬랙/인터뷰에서 말할 법한 자연스러운 구어체와 현실적인 표현으로 대화체 전면 수정]
// 완료 기준: 팀원 리뷰 후 어색한 답변 없음

import { Answer } from "@/lib/types";

export const MOCK_ANSWERS: Answer[] = [
  {
    id: "ans-mock-1",
    questionId: "q-col-1",
    questionText: "팀에서 소통할 때 가장 선호하는 방식은 무엇인가요?",
    answerText: "음.. 짧게 데일리 스탠드업 돌면서 싱크 맞추고, 남은 업무는 그냥 비동기로 텍스트 소통하는 게 편하더라고요.",
    targetStudentId: "student-01",
    recordedAt: "2026-05-10T10:30:00.000Z",
    answerType: "inperson",
  },
  {
    id: "ans-mock-2",
    questionId: "q-role-1",
    questionText: "팀 프로젝트에서 주로 어떤 역할을 맡는 편인가요?",
    answerText: "보통 디자인 시스템 구축을 많이 맡아요. 컴포넌트 미리 잘 짜두면 팀원들이 다 같이 편하게 쓸 수 있으니까 되게 뿌듯하더라고요.",
    targetStudentId: "student-02",
    recordedAt: "2026-05-10T11:00:00.000Z",
    answerType: "online",
  },
  {
    id: "ans-mock-3",
    questionId: "q-goal-1",
    questionText: "이번 학기 팀 프로젝트에서 가장 얻고 싶은 것은 무엇인가요?",
    answerText: "진짜 유저들이 쓰는 서비스를 만들어보고 싶어요! 매번 배포 직전에 프로젝트가 끝나서 아쉬웠는데 이번엔 꼭 배포까지 가보고 싶습니다.",
    targetStudentId: "student-03",
    recordedAt: "2026-05-11T09:00:00.000Z",
    answerType: "online",
  },
  {
    id: "ans-mock-4",
    questionId: "q-int-1",
    questionText: "요즘 가장 관심 있는 분야나 기술은 무엇인가요?",
    answerText: "LLM 파인튜닝 쪽이요. 요즘은 가벼운 모델 가져와서 특정 도메인에 맞게 성능 쥐어짜는 방법 위주로 찾아보고 있어요.",
    targetStudentId: "student-04",
    recordedAt: "2026-05-11T14:00:00.000Z",
    answerType: "inperson",
  },
  {
    id: "ans-mock-5",
    questionId: "q-ws-3",
    questionText: "혼자 작업하는 것과 같이 작업하는 것 중 어느 쪽이 더 편한가요?",
    answerText: "아이디어 막 던질 때는 같이 모여서 하고, 실제 코딩이나 작업은 혼자 집중해서 파는 게 제일 잘 맞는 것 같아요.",
    targetStudentId: "student-05",
    recordedAt: "2026-05-12T10:00:00.000Z",
    answerType: "inperson",
  },
  {
    id: "ans-mock-6",
    questionId: "q-con-1",
    questionText: "팀에서 의견 충돌이 생겼을 때 어떻게 해결하는 편인가요?",
    answerText: "일단 각자 왜 그렇게 생각하는지 근거부터 메모장에 쭉 적어봐요. 감정 빼고 데이터나 논리로만 얘기하면 생각보다 쉽게 풀리더라고요.",
    targetStudentId: "student-06",
    recordedAt: "2026-05-12T15:00:00.000Z",
    answerType: "online",
  },
  {
    id: "ans-mock-7",
    questionId: "q-int-2",
    questionText: "지금 진행 중이거나 해보고 싶은 사이드 프로젝트가 있나요?",
    answerText: "학교 안에서 쓸 수 있는 중고거래 앱 해보고 싶어요. 당근마켓 같은 느낌인데 학번이나 학교 메일 인증 넣어서 좀 더 안전하게 쓸 수 있게끔요.",
    targetStudentId: "student-07",
    recordedAt: "2026-05-13T11:00:00.000Z",
    answerType: "online",
  },
  {
    id: "ans-mock-8",
    questionId: "q-ws-2",
    questionText: "마감 기한이 촉박할 때 어떻게 대처하나요?",
    answerText: "할 일 리스트 쭉 뽑아서 진짜 중요한 것 빼고 다 쳐내요. 그리고 못 끝낼 것 같은 건 미리 팀원들한테 솔직하게 공유하는 편이에요.",
    targetStudentId: "student-08",
    recordedAt: "2026-05-13T16:00:00.000Z",
    answerType: "inperson",
  },
  {
    id: "ans-mock-9",
    questionId: "q-col-2",
    questionText: "협업할 때 가장 중요하게 생각하는 것은 무엇인가요?",
    answerText: "심리적 안정감이 제일 중요하죠. '이런 질문 해도 되나?' 싶은 생각이 안 들어야 조심 안 하고 좋은 아이디어가 마구 나오는 것 같아요.",
    targetStudentId: "student-01",
    recordedAt: "2026-05-14T09:30:00.000Z",
    answerType: "online",
  },
  {
    id: "ans-mock-10",
    questionId: "q-role-2",
    questionText: "본인이 팀에 가장 기여할 수 있는 강점은 무엇인가요?",
    answerText: "유저 리서치요! 무작정 디자인부터 들어가는 것보다 기획 단계에서 타겟 인터뷰 빡세게 해서 문제 정의 명확히 하는 걸 잘합니다.",
    targetStudentId: "student-02",
    recordedAt: "2026-05-14T13:00:00.000Z",
    answerType: "inperson",
  },
  {
    id: "ans-mock-11",
    questionId: "q-ws-1",
    questionText: "하루 중 가장 집중이 잘 되는 시간대와 환경이 어떻게 되나요?",
    answerText: "완전 밤눈이라 저녁 9시 이후부터 새벽에 제일 잘 달려요. 독서실처럼 너무 조용한 곳보단 카페나 집에서 플리 틀어놓고 하는 편이에요.",
    targetStudentId: "student-04",
    recordedAt: "2026-05-15T10:00:00.000Z",
    answerType: "inperson",
  },
  {
    id: "ans-mock-12",
    questionId: "q-goal-2",
    questionText: "이 팀에서 6개월 후 어떤 결과물을 만들고 싶으신가요?",
    answerText: "기능이 화려하지 않더라도 실제 유저 100명이 쓰는 서비스요. 완벽하게 만들려다 오픈 못 하는 것보다 MVP 빨리 내고 피드백 받아 고치고 싶어요.",
    targetStudentId: "student-03",
    recordedAt: "2026-05-15T14:30:00.000Z",
    answerType: "online",
  },
];
