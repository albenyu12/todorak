import { supabase } from "../supabase/client";
import { InboxQuestion, InboxQuestionRow } from "./types";
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
): Promise<InboxQuestion | null> {
  if (!supabase) return null;

  // Verify targetProfileId belongs to classId
  const targetProfile = await getProfileById(data.targetProfileId, classId);
  if (!targetProfile) {
    console.error("Target profile does not belong to the specified class");
    return null;
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
    console.error("Error creating inbox question:", error);
    return null;
  }

  return mapInboxQuestion(created);
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

export async function getInboxQuestionById(questionId: string, classId: string): Promise<InboxQuestion | null> {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("inbox_questions")
    .select("*")
    .eq("id", questionId)
    .eq("class_id", classId)
    .single();

  if (error || !data) {
    console.error("Error fetching inbox question by id:", error);
    return null;
  }

  return mapInboxQuestion(data);
}

export async function markInboxQuestionAnswered(
  questionId: string,
  classId: string,
  targetProfileId: string
): Promise<InboxQuestion | null> {
  if (!supabase) return null;

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
    console.error("Error marking inbox question as answered (not found, already answered, or class/profile mismatch):", error);
    return null;
  }

  return mapInboxQuestion(updated);
}
