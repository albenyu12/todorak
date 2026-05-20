export type QuestionCategory =
  | "icebreaker"
  | "work-style"
  | "values"
  | "skills"
  | "custom";

export interface StudentProfile {
  id: string;
  name: string;
  department: string;
  year: number;
  bio: string;
  interests: string[];
  skills: string[];
  lookingFor: string[];
  avatarInitial?: string;
}

export interface Question {
  id: string;
  text: string;
  category: QuestionCategory;
}

export interface Answer {
  id: string;
  questionId: string;
  questionText: string;
  answerText: string;
  askedToStudentId: string;
  askedToStudentName: string;
  recordedAt: string;
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
  bio: string;
  interests: string[];
  skills: string[];
  lookingFor: string[];
}
