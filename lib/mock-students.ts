// TODO (Y): 학생 데이터 다양성 검토
// 입력값: MOCK_STUDENTS 배열
// 해야 할 일: 전공/role/collaborationStyle 조합이 고르게 분포되어 있는지 확인,
//             추천 알고리즘 테스트 시 다양한 매칭 케이스가 나오도록 데이터 보완
// 완료 기준: 어떤 프로필로 온보딩해도 점수 차이가 있는 추천 결과가 나옴

// TODO (Y): 데이터 확장성 확보
// 입력값: 추가될 학생 데이터
// 해야 할 일: 현재 배열 방식은 유지하되, 나중에 API fetch로 교체 가능하도록
//             MOCK_STUDENTS를 import하는 파일들이 동일한 인터페이스를 사용 중인지 확인
// 완료 기준: MOCK_STUDENTS를 fetch 기반으로 교체해도 import하는 파일 수정 불필요

// TODO (Y): 실제 API 연동 시 이 파일 교체
// 입력값: 없음 (정적 mock 데이터)
// 해야 할 일: 서버 API 또는 DB 연동 준비되면 MOCK_STUDENTS를 fetch 함수로 교체
// 완료 기준: MOCK_STUDENTS를 import하던 파일들이 fetch 기반 데이터 소스로 전환됨

import { StudentProfile } from "@/lib/types";

export const MOCK_STUDENTS: StudentProfile[] = [
  {
    id: "student-1",
    name: "김민준",
    department: "컴퓨터공학과",
    year: 3,
    bio: "풀스택 개발에 관심 많고, 사이드 프로젝트 좋아해요. 커피 마시며 코드 얘기하는 거 좋아합니다.",
    role: "개발자",
    collaborationStyle: "협력형",
    interests: ["웹개발", "오픈소스", "게임", "독서"],
    skills: ["React", "Node.js", "TypeScript"],
    lookingFor: ["PM", "디자이너"],
    avatarInitial: "김",
  },
  {
    id: "student-2",
    name: "이서연",
    department: "산업디자인학과",
    year: 2,
    bio: "UI/UX 디자인을 배우고 있어요. 사용자 중심 디자인에 관심이 많고 개발자와 협업 경험을 쌓고 싶어요.",
    role: "디자이너",
    collaborationStyle: "서포터형",
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
    role: "PM",
    collaborationStyle: "리더형",
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
    role: "데이터분석가",
    collaborationStyle: "독립형",
    interests: ["AI", "데이터", "수학", "체스"],
    skills: ["Python", "R", "SQL", "PyTorch"],
    lookingFor: ["PM", "개발자"],
    avatarInitial: "최",
  },
  {
    id: "student-5",
    name: "정하은",
    department: "시각디자인학과",
    year: 2,
    bio: "브랜딩과 그래픽 디자인을 공부 중이에요. 감각적인 디자인으로 팀에 기여하고 싶어요.",
    role: "디자이너",
    collaborationStyle: "협력형",
    interests: ["브랜딩", "타이포그래피", "영화", "음악"],
    skills: ["Figma", "After Effects", "Premiere"],
    lookingFor: ["개발자", "PM"],
    avatarInitial: "정",
  },
  {
    id: "student-6",
    name: "강준혁",
    department: "컴퓨터공학과",
    year: 2,
    bio: "모바일 앱 개발에 관심이 많아요. iOS/Android 모두 공부 중이고 혼자 집중하는 걸 좋아합니다.",
    role: "개발자",
    collaborationStyle: "독립형",
    interests: ["모바일", "게임개발", "음악", "운동"],
    skills: ["Swift", "Kotlin", "Flutter"],
    lookingFor: ["디자이너", "PM"],
    avatarInitial: "강",
  },
  {
    id: "student-7",
    name: "윤채원",
    department: "경영학과",
    year: 3,
    bio: "SNS 마케팅과 콘텐츠 기획을 좋아해요. 브랜드 스토리텔링으로 팀 프로젝트를 알리고 싶어요.",
    role: "마케터",
    collaborationStyle: "리더형",
    interests: ["마케팅", "콘텐츠", "트렌드", "여행"],
    skills: ["콘텐츠기획", "SNS운영", "카피라이팅"],
    lookingFor: ["개발자", "디자이너"],
    avatarInitial: "윤",
  },
  {
    id: "student-8",
    name: "오승민",
    department: "산업공학과",
    year: 4,
    bio: "팀 프로세스 최적화와 일정 관리에 강점이 있어요. 모두가 편하게 일할 수 있는 환경을 만드는 걸 좋아합니다.",
    role: "PM",
    collaborationStyle: "서포터형",
    interests: ["프로젝트관리", "생산성", "독서", "보드게임"],
    skills: ["Notion", "Jira", "일정관리", "회의진행"],
    lookingFor: ["개발자", "디자이너", "PM"],
    avatarInitial: "오",
  },
];
