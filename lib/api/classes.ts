import { supabase } from "../supabase/client";
import { Class } from "./types";

/**
 * getClassByCode
 * Fetches a class by its human-readable code.
 */
export async function getClassByCode(code: string): Promise<Class | null> {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("classes")
    .select("*")
    .eq("code", code)
    .single();

  if (error || !data) {
    console.error("Error fetching class by code:", error);
    return null;
  }

  return {
    id: data.id,
    code: data.code,
    name: data.name,
    createdAt: data.created_at,
  };
}
