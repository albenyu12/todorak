import { supabase } from "../supabase/client";
import { Answer, AnswerRow, ApiResponse } from "./types";
import { markInboxQuestionAnswered, getInboxQuestionById } from "./inbox-questions";
import { getProfileById } from "./profiles";

function mapAnswer(data: AnswerRow): Answer {
  return {
    id: data.id,
    classId: data.class_id,
    targetProfileId: data.target_profile_id,
    recorderProfileId: data.recorder_profile_id,
    inboxQuestionId: data.inbox_question_id,
    questionTemplateId: data.question_template_id,
    questionText: data.question_text,
    answerText: data.answer_text,
    answerType: data.answer_type as "first" | "inperson" | "online",
    createdAt: data.created_at,
  };
}

export async function createAnswer(
  classId: string,
  data: {
    targetProfileId: string;
    recorderProfileId: string | null;
    inboxQuestionId: string | null;
    questionTemplateId: string | null;
    questionText: string;
    answerText: string;
    answerType: "first" | "inperson" | "online";
  }
): Promise<ApiResponse<Answer>> {
  if (!supabase) return { data: null, error: { message: "Supabase client not initialized" } };

  // 1. Data consistency and Business logic validation
  
  // Rule 1: Type-specific inboxQuestionId validation
  if (data.answerType === "online") {
    if (!data.inboxQuestionId) {
      return { data: null, error: { message: "inboxQuestionId is required for online answers" } };
    }
  } else {
    if (data.inboxQuestionId) {
      return { data: null, error: { message: `inboxQuestionId must be null for ${data.answerType} answers` } };
    }
  }

  // Rule 2: 'first' answer validation
  if (data.answerType === "first") {
    if (data.targetProfileId !== data.recorderProfileId) {
      return { data: null, error: { message: "For 'first' answers, targetProfileId must equal recorderProfileId" } };
    }
  }

  // 2. ID Existence and Class membership verification
  
  // Verify targetProfileId belongs to classId
  const targetProfileRes = await getProfileById(data.targetProfileId, classId);
  if (targetProfileRes.error || !targetProfileRes.data) {
    return { data: null, error: { message: "Target profile does not belong to the specified class or not found" } };
  }

  // Verify recorderProfileId belongs to classId if provided
  if (data.recorderProfileId) {
    const recorderProfileRes = await getProfileById(data.recorderProfileId, classId);
    if (recorderProfileRes.error || !recorderProfileRes.data) {
      return { data: null, error: { message: "Recorder profile does not belong to the specified class or not found" } };
    }
  }

  // Verify inboxQuestionId consistency and status if provided
  if (data.inboxQuestionId) {
    const inboxQuestionRes = await getInboxQuestionById(data.inboxQuestionId, classId);
    if (inboxQuestionRes.error || !inboxQuestionRes.data) {
      return { data: null, error: { message: "Inbox question not found or class mismatch" } };
    }
    const inboxQuestion = inboxQuestionRes.data;
    if (inboxQuestion.targetProfileId !== data.targetProfileId) {
      return { data: null, error: { message: "Inbox question target profile mismatch" } };
    }
    if (inboxQuestion.isAnswered) {
      return { data: null, error: { message: "Inbox question is already answered" } };
    }
  }

  // 3. Execution (Create Answer and Update Status)
  
  // For online answers, we try to mark as answered FIRST to prevent duplicate answers
  // This is a partial protection against race conditions without full RPC/transactions
  if (data.answerType === "online" && data.inboxQuestionId) {
    const markRes = await markInboxQuestionAnswered(data.inboxQuestionId, classId, data.targetProfileId);
    if (markRes.error) {
      return { 
        data: null, 
        error: { 
          message: `Failed to mark question as answered: ${markRes.error.message}`,
          code: "PRE_STATUS_UPDATE_FAILED"
        } 
      };
    }
  }

  // Create the answer record
  const { data: created, error: insertError } = await supabase
    .from("answers")
    .insert({
      class_id: classId,
      target_profile_id: data.targetProfileId,
      recorder_profile_id: data.recorderProfileId,
      inbox_question_id: data.inboxQuestionId,
      question_template_id: data.questionTemplateId,
      question_text: data.questionText,
      answer_text: data.answerText,
      answer_type: data.answerType,
    })
    .select()
    .single();

  if (insertError || !created) {
    // Note: If this fails for an online answer, the question is now marked as answered but no answer exists.
    // In a production app, we would use an RPC to handle this transactionally.
    return { data: null, error: { message: insertError?.message || "Error creating answer" } };
  }

  return { data: mapAnswer(created), error: null };
}

export async function getAnswersByClass(classId: string): Promise<Answer[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("answers")
    .select("*")
    .eq("class_id", classId)
    .order("created_at", { ascending: false });

  if (error || !data) {
    console.error("Error fetching answers by class:", error);
    return [];
  }

  return data.map(mapAnswer);
}

export async function getAnswerById(answerId: string, classId: string): Promise<ApiResponse<Answer>> {
  if (!supabase) return { data: null, error: { message: "Supabase client not initialized" } };

  const { data, error } = await supabase
    .from("answers")
    .select("*")
    .eq("id", answerId)
    .eq("class_id", classId)
    .single();

  if (error || !data) {
    return { data: null, error: { message: error?.message || "Answer not found" } };
  }

  return { data: mapAnswer(data), error: null };
}

export async function getAnswersForProfile(profileId: string, classId: string): Promise<Answer[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("answers")
    .select("*")
    .eq("target_profile_id", profileId)
    .eq("class_id", classId)
    .order("created_at", { ascending: false });

  if (error || !data) {
    console.error("Error fetching answers for profile:", error);
    return [];
  }

  return data.map(mapAnswer);
}
