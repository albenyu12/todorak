/**
 * Supabase v2.0 API Types (based on SUPABASE_CONTRACT.md)
 */

export type Role = "개발자" | "디자이너" | "마케터" | "데이터분석가" | "PM";

export type ContactMethod = {
  type: "email" | "link";
  value: string;
};

export type Class = {
  id: string;
  code: "WEBPROGRAMMING_2026" | "DEMO_LONGTERM";
  name: string;
  createdAt: string;
};

export type StudentProfile = {
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
  createdAt: string;
  updatedAt: string;
};

export type InboxQuestion = {
  id: string;
  classId: string;
  targetProfileId: string;
  questionTemplateId: string | null;
  questionText: string;
  isAnswered: boolean;
  createdAt: string;
  answeredAt: string | null;
};

export type Answer = {
  id: string;
  classId: string;
  targetProfileId: string;
  recorderProfileId: string | null;
  inboxQuestionId: string | null;
  questionTemplateId: string | null;
  questionText: string;
  answerText: string;
  answerType: "first" | "inperson" | "online";
  createdAt: string;
};

export type ApiError = {
  message: string;
  code?: string;
  status?: number;
};

export type ApiResponse<T> = 
  | { data: T; error: null }
  | { data: null; error: ApiError };

// Database Row Types (Snake Case)
export type ClassRow = {
  id: string;
  code: string;
  name: string;
  created_at: string;
};

export type ProfileRow = {
  id: string;
  class_id: string;
  name: string;
  department: string;
  year: number;
  bio: string | null;
  role: string;
  interests: string[];
  skills: string[];
  looking_for: string[];
  contact_methods?: ContactMethod[];
  avatar_initial: string | null;
  created_at: string;
  updated_at: string;
};

export type InboxQuestionRow = {
  id: string;
  class_id: string;
  target_profile_id: string;
  question_template_id: string | null;
  question_text: string;
  is_answered: boolean;
  created_at: string;
  answered_at: string | null;
};

export type AnswerRow = {
  id: string;
  class_id: string;
  target_profile_id: string;
  recorder_profile_id: string | null;
  inbox_question_id: string | null;
  question_template_id: string | null;
  question_text: string;
  answer_text: string;
  answer_type: string;
  created_at: string;
};
