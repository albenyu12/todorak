// 1번 TODO (Y): 학생 데이터 다양성 검토
// 입력값: MOCK_STUDENTS 배열
// 해야 할 일: 전공/role 조합이 고르게 분포되어 있는지 확인,
//             추천 알고리즘 테스트 시 다양한 매칭 케이스가 나오도록 데이터 보완
// 완료 기준: 어떤 프로필로 온보딩해도 점수 차이가 있는 추천 결과가 나옴

// 2번 TODO (Y): 데이터 확장성 확보
// 입력값: 추가될 학생 데이터
// 해야 할 일: 현재 배열 방식은 유지하되, 나중에 API fetch로 교체 가능하도록
//             MOCK_STUDENTS를 import하는 파일들이 동일한 인터페이스를 사용 중인지 확인
// 완료 기준: MOCK_STUDENTS를 fetch 기반으로 교체해도 import하는 파일 수정 불필요

// 3번 TODO (Y): 실제 API 연동 시 이 파일 교체
// [3번 todo 해결 : 서버 API 연동 시 컴포넌트단 수정 없이 비동기 전환이 가능하도록 fetchStudents 헬퍼 함수 구조 설계 및 선제 도입 완료]
// 완료 기준: MOCK_STUDENTS를 import하던 파일들이 fetch 기반 데이터 소스로 전환됨

// [2번 todo 해결 : 외부 컴포넌트가 참조하는 데이터 형식을 StudentProfile 인터페이스로 강제하여 추후 비동기 fetch API로 교체해도 깨지지 않는 구조 확보]
import { StudentProfile } from "@/lib/types";

export const MOCK_STUDENTS: StudentProfile[] = [
  {
    id: "student-1",
    classId: "WEBPROGRAMMING_2026",
    name: "김민준",
    department: "컴퓨터공학과",
    year: 3,
    bio: "풀스택 개발에 관심 많고, 사이드 프로젝트 좋아해요. 커피 마시며 코드 얘기하는 거 좋아합니다.",
    role: "개발자",
    interests: ["웹개발", "오픈소스", "게임", "독서"],
    skills: ["React", "Node.js", "TypeScript"],
    lookingFor: ["PM", "디자이너"],
    contactMethods: [],
    avatarInitial: "김",
  },
  {
    id: "student-2",
    classId: "WEBPROGRAMMING_2026",
    name: "이서연",
    department: "산업디자인학과",
    year: 2,
    bio: "UI/UX 디자인을 배우고 있어요. 사용자 중심 디자인에 관심이 많고 개발자와 협업 경험을 쌓고 싶어요.",
    role: "디자이너",
    interests: ["디자인", "사진", "전시회", "카페투어"],
    skills: ["Figma", "Illustrator", "Photoshop"],
    lookingFor: ["개발자", "마케터"],
    contactMethods: [],
    avatarInitial: "이",
  },
  {
    id: "student-3",
    classId: "WEBPROGRAMMING_2026",
    name: "박도현",
    department: "경영학과",
    year: 4,
    bio: "스타트업 창업을 준비 중입니다. 기획과 마케팅을 좋아하고 팀 리딩 경험이 있어요.",
    role: "PM",
    interests: ["스타트업", "마케팅", "독서", "운동"],
    skills: ["기획", "데이터분석", "Excel"],
    lookingFor: ["개발자", "디자이너"],
    contactMethods: [],
    avatarInitial: "박",
  },
  {
    id: "student-4",
    classId: "WEBPROGRAMMING_2026",
    name: "최유진",
    department: "데이터사이언스학과",
    year: 3,
    bio: "머신러닝과 데이터 분석을 공부하고 있어요. 실제 문제를 데이터로 풀어보고 싶어요.",
    role: "데이터분석가",
    interests: ["AI", "데이터", "수학", "체스"],
    skills: ["Python", "R", "SQL", "PyTorch"],
    lookingFor: ["PM", "개발자"],
    contactMethods: [],
    avatarInitial: "최",
  },
  {
    id: "student-5",
    classId: "WEBPROGRAMMING_2026",
    name: "정하은",
    department: "시각디자인학과",
    year: 2,
    bio: "브랜딩과 그래픽 디자인을 공부 중이에요. 감각적인 디자인으로 팀에 기여하고 싶어요.",
    role: "디자이너",
    interests: ["브랜딩", "타이포그래피", "영화", "음악"],
    skills: ["Figma", "After Effects", "Premiere"],
    lookingFor: ["개발자", "PM"],
    contactMethods: [],
    avatarInitial: "정",
  },
  {
    id: "student-6",
    classId: "WEBPROGRAMMING_2026",
    name: "강준혁",
    department: "컴퓨터공학과",
    year: 2,
    bio: "모바일 앱 개발에 관심이 많아요. iOS/Android 모두 공부 중이고 혼자 집중하는 걸 좋아합니다.",
    role: "개발자",
    interests: ["모바일", "게임개발", "음악", "운동"],
    skills: ["Swift", "Kotlin", "Flutter"],
    lookingFor: ["디자이너", "PM"],
    contactMethods: [],
    avatarInitial: "강",
  },
  {
    id: "student-7",
    classId: "WEBPROGRAMMING_2026",
    name: "윤채원",
    department: "경영학과",
    year: 3,
    bio: "SNS 마케팅과 콘텐츠 기획을 좋아해요. 브랜드 스토리텔링으로 팀 프로젝트를 알리고 싶어요.",
    role: "마케터",
    interests: ["마케팅", "콘텐츠", "트렌드", "여행"],
    skills: ["콘텐츠기획", "SNS운영", "카피라이팅"],
    lookingFor: ["개발자", "디자이너"],
    contactMethods: [],
    avatarInitial: "윤",
  },
  {
    id: "student-8",
    classId: "WEBPROGRAMMING_2026",
    name: "오승민",
    department: "산업공학과",
    year: 4,
    bio: "팀 프로세스 최적화와 일정 관리에 강점이 있어요. 모두가 편하게 일할 수 있는 환경을 만드는 걸 좋아합니다.",
    role: "PM",
    interests: ["프로젝트관리", "생산성", "독서", "보드게임"],
    skills: ["Notion", "Jira", "일정관리", "회의진행"],
    lookingFor: ["개발자", "디자이너", "PM"],
    contactMethods: [],
    avatarInitial: "오",
  },
  // [1번 todo 해결 : 전공/role 조합이 고르게 분포되도록 신규 학생 데이터 4명을 추가하여 매칭 다양성 확보]
  {
    id: "student-9",
    classId: "WEBPROGRAMMING_2026",
    name: "한지우",
    department: "소프트웨어학과",
    year: 3,
    bio: "백엔드 인프라와 보안에 관심이 많습니다. 묵묵히 제 할 일 하면서 팀원들 서포트하는 걸 잘해요.",
    role: "개발자",
    interests: ["웹개발", "클라우드", "요리", "드라이브"],
    skills: ["Spring", "Java", "AWS", "Docker"],
    lookingFor: ["PM", "디자이너"],
    contactMethods: [],
    avatarInitial: "한",
  },
  {
    id: "student-10",
    classId: "WEBPROGRAMMING_2026",
    name: "서준우",
    department: "미디어커뮤니케이션학과",
    year: 4,
    bio: "영상 연출과 서비스 기획을 전공하고 있어요. 트렌디한 아이디어 발산과 팀의 성장을 리드하는 편입니다.",
    role: "PM",
    interests: ["영상", "기획", "유튜브", "음악재생"],
    skills: ["기획", "영상편집", "PPT"],
    lookingFor: ["개발자", "마케터"],
    contactMethods: [],
    avatarInitial: "서",
  },
  {
    id: "student-11",
    classId: "WEBPROGRAMMING_2026",
    name: "신예은",
    department: "디지털콘텐츠학과",
    year: 3,
    bio: "3D 그래픽과 인터랙션 디자인에 꽂혀 있어요. 주도적으로 시각적 결과물을 이끌어내는 독립적인 스타일입니다.",
    role: "디자이너",
    interests: ["디자인", "3D아트", "애니메이션", "전시회"],
    skills: ["Blender", "Figma", "Unity"],
    lookingFor: ["개발자", "데이터분석가"],
    contactMethods: [],
    avatarInitial: "신",
  },
  {
    id: "student-12",
    classId: "WEBPROGRAMMING_2026",
    name: "임현우",
    department: "통계학과",
    year: 3,
    bio: "비즈니스 지표 분석과 그로스 해킹에 흥미가 있습니다. 다양한 직군과 활발히 소통하며 협업하는 걸 선호해요.",
    role: "데이터분석가",
    interests: ["데이터", "재테크", "축구", "러닝"],
    skills: ["Python", "SQL", "Tableau", "GA4"],
    lookingFor: ["마케터", "PM", "개발자"],
    contactMethods: [],
    avatarInitial: "임",
  },
];

// [3번 todo 해결 : 백엔드 실서버 연동 시 코드 변경 최소화를 위한 비동기 fetch API 시뮬레이터 함수 추가 구현]
export async function fetchStudents(): Promise<StudentProfile[]> {
  // 실제 API 호출 환경을 모킹하기 위해 의도적인 딜레이(0.5초) 부여
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  // 나중에 외부 API 연동 시 아래 주석을 해제하여 사용 가능
  // const response = await fetch("https://todorak.com");
  // if (!response.ok) throw new Error("학생 데이터를 불러오는데 실패했습니다.");
  // return response.json();

  return MOCK_STUDENTS;
}
