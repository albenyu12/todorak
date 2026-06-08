export type Role =
  | "개발자"
  | "디자이너"
  | "마케터"
  | "데이터분석가"
  | "PM";

export interface ContactMethod {
  type: "email" | "link";
  value: string;
}

export type QuestionCategory =
  | "collaboration"
  | "role"
  | "conflict"
  | "work_style"
  | "interest"
  | "goal";

export interface StudentProfile {
  id: string;
  classId: string;
  name: string;
  department: string;
  year: number;
  bio: string | null;
  role: Role;
  interests: string[];
  skills: string[];
  lookingFor: Role[];
  contactMethods: ContactMethod[];
  avatarInitial: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface Question {
  id: string;
  text: string;
  category: QuestionCategory;
}

export type RecommendedQuestion = Question;

export interface Answer {
  id: string;
  classId?: string;
  targetProfileId?: string;
  recorderProfileId?: string | null;
  inboxQuestionId?: string | null;
  questionTemplateId?: string | null;
  questionText: string;
  answerText: string;
  answerType: "first" | "inperson" | "online";
  createdAt?: string;
  // Legacy fields for compatibility during transition
  questionId?: string;
  targetStudentId?: string;
  recordedAt?: string;
  answererId?: string;
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
  bio: string | null;
  role: Role | "";
  interests: string[];
  skills: string[];
  lookingFor: Role[];
  contactMethods: ContactMethod[];
}
