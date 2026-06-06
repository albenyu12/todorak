import { supabase } from "../supabase/client";
import { Answer, AnswerRow } from "./types";
import { markInboxQuestionAnswered } from "./inbox-questions";

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
): Promise<Answer | null> {
  if (!supabase) return null;

  // 1. Create the answer
  const { data: created, error } = await supabase
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

  if (error || !created) {
    console.error("Error creating answer:", error);
    return null;
  }

  // 2. If it's an online answer, mark the inbox question as answered
  if (data.answerType === "online" && data.inboxQuestionId) {
    try {
      await markInboxQuestionAnswered(data.inboxQuestionId);
    } catch (e) {
      console.error("Failed to mark inbox question as answered, but answer was created:", e);
      // In a real production app, we might want more robust error handling/rollback here
    }
  }

  return mapAnswer(created);
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

export async function getAnswerById(answerId: string, classId: string): Promise<Answer | null> {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("answers")
    .select("*")
    .eq("id", answerId)
    .eq("class_id", classId)
    .single();

  if (error || !data) {
    console.error("Error fetching answer by id:", error);
    return null;
  }

  return mapAnswer(data);
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
