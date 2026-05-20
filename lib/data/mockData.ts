// TODO (Y): 실제 서비스 연동 시 이 파일의 mock 데이터를 API 호출로 교체
// TODO (Y): 학과/관심사/스킬 태그 목록을 별도 constants 파일로 분리

import { StudentProfile, Question } from "@/types";

export const MOCK_STUDENTS: StudentProfile[] = [
  {
    id: "student-1",
    name: "김민준",
    department: "컴퓨터공학과",
    year: 3,
    bio: "풀스택 개발에 관심 많고, 사이드 프로젝트 좋아해요. 커피 마시며 코드 얘기하는 거 좋아합니다.",
    interests: ["웹개발", "오픈소스", "게임", "독서"],
    skills: ["React", "Node.js", "TypeScript"],
    lookingFor: ["기획자", "디자이너"],
    avatarInitial: "김",
  },
  {
    id: "student-2",
    name: "이서연",
    department: "산업디자인학과",
    year: 2,
    bio: "UI/UX 디자인을 배우고 있어요. 사용자 중심 디자인에 관심이 많고 개발자와 협업 경험을 쌓고 싶어요.",
    interests: ["디자인", "사진", "전시회", "카페투어"],
    skills: ["Figma", "Illustrator", "Photoshop"],
    lookingFor: ["개발자", "마케터"],
    avatarInitial: "이",
  },
  {
    id: "student-3",
    name: "박도현",
    department: "경영학과",
    year: 4,
    bio: "스타트업 창업을 준비 중입니다. 기획과 마케팅을 좋아하고 팀 리딩 경험이 있어요.",
    interests: ["스타트업", "마케팅", "독서", "운동"],
    skills: ["기획", "데이터분석", "Excel"],
    lookingFor: ["개발자", "디자이너"],
    avatarInitial: "박",
  },
  {
    id: "student-4",
    name: "최유진",
    department: "데이터사이언스학과",
    year: 3,
    bio: "머신러닝과 데이터 분석을 공부하고 있어요. 실제 문제를 데이터로 풀어보고 싶어요.",
    interests: ["AI", "데이터", "수학", "체스"],
    skills: ["Python", "R", "SQL", "PyTorch"],
    lookingFor: ["기획자", "개발자"],
    avatarInitial: "최",
  },
  {
    id: "student-5",
    name: "정하은",
    department: "시각디자인학과",
    year: 2,
    bio: "브랜딩과 그래픽 디자인을 공부 중이에요. 감각적인 디자인으로 팀에 기여하고 싶어요.",
    interests: ["브랜딩", "타이포그래피", "영화", "음악"],
    skills: ["Figma", "After Effects", "Premiere"],
    lookingFor: ["개발자", "기획자"],
    avatarInitial: "정",
  },
  {
    id: "student-6",
    name: "강준혁",
    department: "컴퓨터공학과",
    year: 2,
    bio: "모바일 앱 개발에 관심이 많아요. iOS/Android 모두 공부 중입니다.",
    interests: ["모바일", "게임개발", "음악", "운동"],
    skills: ["Swift", "Kotlin", "Flutter"],
    lookingFor: ["디자이너", "기획자"],
    avatarInitial: "강",
  },
];

export const MOCK_QUESTIONS: Question[] = [
  // icebreaker
  { id: "q-1", text: "팀 프로젝트에서 본인의 역할을 한 마디로 표현하면?", category: "icebreaker" },
  { id: "q-2", text: "가장 기억에 남는 프로젝트 경험은 무엇인가요?", category: "icebreaker" },
  { id: "q-3", text: "지금 가장 배우고 싶은 것은?", category: "icebreaker" },

  // work-style
  { id: "q-4", text: "혼자 작업하는 것과 함께 작업하는 것 중 어느 쪽이 더 편한가요?", category: "work-style" },
  { id: "q-5", text: "마감 기한이 촉박할 때 어떻게 대처하나요?", category: "work-style" },
  { id: "q-6", text: "팀에서 의견 충돌이 생기면 어떻게 해결하는 편인가요?", category: "work-style" },

  // values
  { id: "q-7", text: "좋은 팀이란 어떤 팀이라고 생각하나요?", category: "values" },
  { id: "q-8", text: "이번 학기 프로젝트에서 가장 중요하게 생각하는 것은?", category: "values" },

  // skills
  { id: "q-9", text: "본인이 팀에 가장 기여할 수 있는 역량은?", category: "skills" },
  { id: "q-10", text: "지금 가장 자신 있는 기술 스택이나 도구는?", category: "skills" },
];
