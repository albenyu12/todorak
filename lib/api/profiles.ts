import { supabase } from "../supabase/client";
import { StudentProfile, ProfileRow, Role, ApiResponse } from "./types";
import { getStoredProfileId } from "../client-session";

function mapProfile(data: ProfileRow): StudentProfile {
  return {
    id: data.id,
    classId: data.class_id,
    name: data.name,
    department: data.department,
    year: data.year,
    bio: data.bio,
    role: data.role as Role,
    interests: data.interests || [],
    skills: data.skills || [],
    lookingFor: (data.looking_for || []) as Role[],
    contactMethods: data.contact_methods || [],
    avatarInitial: data.avatar_initial,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

export async function createProfile(
  classId: string,
  data: Omit<StudentProfile, "id" | "classId" | "createdAt" | "updatedAt">
): Promise<ApiResponse<StudentProfile>> {
  if (!supabase) return { data: null, error: { message: "Supabase client not initialized" } };

  const { data: created, error } = await supabase
    .from("profiles")
    .insert({
      class_id: classId,
      name: data.name,
      department: data.department,
      year: data.year,
      bio: data.bio,
      role: data.role,
      interests: data.interests,
      skills: data.skills,
      looking_for: data.lookingFor,
      contact_methods: data.contactMethods,
      avatar_initial: data.avatarInitial,
    })
    .select()
    .single();

  if (error || !created) {
    return { data: null, error: { message: error?.message || "Error creating profile" } };
  }

  return { data: mapProfile(created), error: null };
}

export async function updateProfile(
  profileId: string,
  data: Partial<Omit<StudentProfile, "id" | "classId" | "createdAt" | "updatedAt">>
): Promise<ApiResponse<StudentProfile>> {
  if (!supabase) return { data: null, error: { message: "Supabase client not initialized" } };

  // Security check: only allow updating own profile
  const currentProfileId = getStoredProfileId();
  if (profileId !== currentProfileId) {
    return { data: null, error: { message: "Permission denied: Cannot update another user's profile" } };
  }

  const updateData: Record<string, unknown> = {};
  if (data.name !== undefined) updateData.name = data.name;
  if (data.department !== undefined) updateData.department = data.department;
  if (data.year !== undefined) updateData.year = data.year;
  if (data.bio !== undefined) updateData.bio = data.bio;
  if (data.role !== undefined) updateData.role = data.role;
  if (data.interests !== undefined) updateData.interests = data.interests;
  if (data.skills !== undefined) updateData.skills = data.skills;
  if (data.lookingFor !== undefined) updateData.looking_for = data.lookingFor;
  if (data.contactMethods !== undefined) updateData.contact_methods = data.contactMethods;
  if (data.avatarInitial !== undefined) updateData.avatar_initial = data.avatarInitial;
  
  updateData.updated_at = new Date().toISOString();

  const { data: updated, error } = await supabase
    .from("profiles")
    .update(updateData)
    .eq("id", profileId)
    .select()
    .single();

  if (error || !updated) {
    return { data: null, error: { message: error?.message || "Error updating profile" } };
  }

  return { data: mapProfile(updated), error: null };
}

export async function getProfilesByClass(classId: string): Promise<StudentProfile[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("profiles")
    .select("id, class_id, name, department, year, bio, role, interests, skills, looking_for, avatar_initial, created_at, updated_at")
    .eq("class_id", classId);

  if (error || !data) {
    console.error("Error fetching profiles by class:", error);
    return [];
  }

  return data.map(mapProfile);
}

export async function getProfileById(profileId: string, classId: string): Promise<ApiResponse<StudentProfile>> {
  if (!supabase) return { data: null, error: { message: "Supabase client not initialized" } };

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", profileId)
    .eq("class_id", classId)
    .single();

  if (error || !data) {
    return { data: null, error: { message: error?.message || "Profile not found" } };
  }

  return { data: mapProfile(data), error: null };
}
