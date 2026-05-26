export type Role =
  | "개발자"
  | "디자이너"

  | "마케터"
  | "데이터분석가"
  | "PM";

export type CollaborationStyle = "리더형" | "서포터형" | "독립형" | "협력형";

export type QuestionCategory =
  | "collaboration"
  | "role"
  | "conflict"
  | "work_style"
  | "interest"
  | "goal";

export interface StudentProfile {
  id: string;
  name: string;
  department: string;
  year: number;
  bio?: string;
  role: Role;
  collaborationStyle?: CollaborationStyle;
  interests: string[];
  skills: string[];
  lookingFor: Role[];
  avatarInitial?: string;
}

export interface Question {
  id: string;
  text: string;
  category: QuestionCategory;
}

export interface RecommendedQuestion extends Question {}

export interface Answer {
  id: string;
  questionId: string;
  questionText: string;
  answerText: string;
  targetStudentId: string;
  answererId?: string;
  recordedAt: string;
  answerType: "inperson" | "online";
}

export interface AnonymousQuestion {
  id: string;
  questionId: string;
  questionText: string;
  targetStudentId: string;
  createdAt: string;
}

export interface RecommendationResult {
  student: StudentProfile;
  score: number;
  matchReasons: string[];
}

export interface OnboardingFormData {
  name: string;
  department: string;
  year: string;
  bio?: string;
  role: Role | "";
  collaborationStyle: CollaborationStyle | "";
  interests: string[];
  skills: string[];
  lookingFor: Role[];
}
