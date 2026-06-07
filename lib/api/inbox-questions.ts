import { supabase } from "../supabase/client";
import { InboxQuestion, InboxQuestionRow, ApiResponse } from "./types";
import { getStoredProfileId } from "../client-session";
import { getProfileById } from "./profiles";

function mapInboxQuestion(data: InboxQuestionRow): InboxQuestion {
  return {
    id: data.id,
    classId: data.class_id,
    targetProfileId: data.target_profile_id,
    questionTemplateId: data.question_template_id,
    questionText: data.question_text,
    isAnswered: data.is_answered,
    createdAt: data.created_at,
    answeredAt: data.answered_at,
  };
}

export async function createInboxQuestion(
  classId: string,
  data: {
    targetProfileId: string;
    questionTemplateId: string | null;
    questionText: string;
  }
): Promise<ApiResponse<InboxQuestion>> {
  if (!supabase) return { data: null, error: { message: "Supabase client not initialized" } };

  // Verify targetProfileId belongs to classId
  const profileRes = await getProfileById(data.targetProfileId, classId);
  if (profileRes.error || !profileRes.data) {
    return { data: null, error: { message: "Target profile does not belong to the specified class or not found" } };
  }

  const { data: created, error } = await supabase
    .from("inbox_questions")
    .insert({
      class_id: classId,
      target_profile_id: data.targetProfileId,
      question_template_id: data.questionTemplateId,
      question_text: data.questionText,
      is_answered: false,
    })
    .select()
    .single();

  if (error || !created) {
    return { data: null, error: { message: error?.message || "Error creating inbox question" } };
  }

  return { data: mapInboxQuestion(created), error: null };
}

export async function getInboxQuestions(profileId: string, classId: string): Promise<InboxQuestion[]> {
  if (!supabase) return [];

  // Security check: only allow viewing own inbox
  const currentProfileId = getStoredProfileId();
  if (profileId !== currentProfileId) {
    console.warn("Permission denied: Cannot view another user's inbox");
    return [];
  }

  const { data, error } = await supabase
    .from("inbox_questions")
    .select("*")
    .eq("target_profile_id", profileId)
    .eq("class_id", classId)
    .order("is_answered", { ascending: true })
    .order("created_at", { ascending: false });

  if (error || !data) {
    console.error("Error fetching inbox questions:", error);
    return [];
  }

  return data.map(mapInboxQuestion);
}

export async function getInboxQuestionById(questionId: string, classId: string): Promise<ApiResponse<InboxQuestion>> {
  if (!supabase) return { data: null, error: { message: "Supabase client not initialized" } };

  const { data, error } = await supabase
    .from("inbox_questions")
    .select("*")
    .eq("id", questionId)
    .eq("class_id", classId)
    .single();

  if (error || !data) {
    return { data: null, error: { message: error?.message || "Inbox question not found" } };
  }

  return { data: mapInboxQuestion(data), error: null };
}

export async function markInboxQuestionAnswered(
  questionId: string,
  classId: string,
  targetProfileId: string
): Promise<ApiResponse<InboxQuestion>> {
  if (!supabase) return { data: null, error: { message: "Supabase client not initialized" } };

  const { data: updated, error } = await supabase
    .from("inbox_questions")
    .update({
      is_answered: true,
      answered_at: new Date().toISOString(),
    })
    .eq("id", questionId)
    .eq("class_id", classId)
    .eq("target_profile_id", targetProfileId)
    .eq("is_answered", false)
    .select()
    .single();

  if (error || !updated) {
    return { 
      data: null, 
      error: { 
        message: error ? error.message : "Error marking inbox question as answered (already answered or mismatch)",
        code: "UPDATE_FAILED"
      } 
    };
  }

  return { data: mapInboxQuestion(updated), error: null };
}
