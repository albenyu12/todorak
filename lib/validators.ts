import { z } from "zod";
import { OnboardingFormData } from "@/lib/types";

export interface ValidationError {
  field: string;
  message: string;
}

const profileFormSchema = z.object({
  name: z.string().trim().min(1, { message: "이름을 입력해주세요." }),
  department: z.string().trim().min(1, { message: "학과를 입력해주세요." }),
  year: z.string().trim().min(1, { message: "학년을 선택해주세요." }).or(z.number()),
  bio: z.string().trim().superRefine((val, ctx) => {
    if (val.length === 0) return; // 선택 항목
    const bannedWords = ["바보", "멍청이"];
    const hasBannedWord = bannedWords.some((word) => val.includes(word));
    if (hasBannedWord) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "적절한 내용을 입력해주세요." });
    } else if (val.length < 10) {
      const missingChars = 10 - val.length;
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: `자기소개를 ${missingChars}자 더 입력해주세요.` });
    }
  }),
  role: z.string().trim().min(1, { message: "역할을 선택해주세요." }),
  interests: z.array(z.string()).min(1, { message: "관심사를 최소 1개 이상 선택해주세요." }),
  skills: z.array(z.string()).min(1, { message: "기술 스택을 최소 1개 이상 선택해주세요." }),
  lookingFor: z.array(z.string()).min(1, { message: "찾는 팀원 조건을 최소 1개 이상 선택해주세요." }),
  contactMethods: z.array(z.object({
    type: z.enum(["email", "link"]),
    value: z.string().trim().min(1, { message: "연락처를 입력해주세요." })
  })).min(1, { message: "최소 1개의 연락처를 입력해주세요." }).superRefine((val, ctx) => {
    val.forEach((contact, idx) => {
      if (contact.type === "email") {
        const emailResult = z.string().email().safeParse(contact.value);
        if (!emailResult.success) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "올바른 이메일 형식이 아닙니다.",
            path: [idx, "value"]
          });
        }
      } else if (contact.type === "link") {
        const urlResult = z.string().url().safeParse(contact.value);
        if (!urlResult.success) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "올바른 URL 형식이 아닙니다. (https:// 포함)",
            path: [idx, "value"]
          });
        }
      }
    });
  }),
});

export function validateProfileForm(
  data: Partial<OnboardingFormData>,
  isFinalSubmit = false
): ValidationError[] {
  const errors: ValidationError[] = [];

  const addError = (field: string, result: { success: boolean; error?: { issues: { message: string }[] } }) => {
    if (!result.success && result.error && result.error.issues.length > 0) {
      errors.push({ field, message: result.error.issues[0].message });
    }
  };

  if (isFinalSubmit || data.name !== undefined) {
    addError("name", profileFormSchema.shape.name.safeParse(data.name ?? ""));
  }
  if (isFinalSubmit || data.department !== undefined) {
    addError("department", profileFormSchema.shape.department.safeParse(data.department ?? ""));
  }
  if (isFinalSubmit || data.year !== undefined) {
    addError("year", profileFormSchema.shape.year.safeParse(data.year ?? ""));
  }
  if (isFinalSubmit || data.bio !== undefined) {
    addError("bio", profileFormSchema.shape.bio.safeParse(data.bio ?? ""));
  }
  if (isFinalSubmit || data.role !== undefined) {
    addError("role", profileFormSchema.shape.role.safeParse(data.role ?? ""));
  }
  if (isFinalSubmit || data.interests !== undefined) {
    addError("interests", profileFormSchema.shape.interests.safeParse(data.interests ?? []));
  }
  if (isFinalSubmit || data.skills !== undefined) {
    addError("skills", profileFormSchema.shape.skills.safeParse(data.skills ?? []));
  }
  if (isFinalSubmit || data.lookingFor !== undefined) {
    addError("lookingFor", profileFormSchema.shape.lookingFor.safeParse(data.lookingFor ?? []));
  }
  if (isFinalSubmit || data.contactMethods !== undefined) {
    addError("contactMethods", profileFormSchema.shape.contactMethods.safeParse(data.contactMethods ?? []));
  }

  return errors;
}

export const validateOnboardingForm = validateProfileForm;

export function validateQuestionInput(text: string): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!text || text.trim().length === 0) {
    errors.push({ field: "text", message: "질문을 입력해주세요." });
  } else if (text.trim().length < 5) {
    errors.push({ field: "text", message: "질문을 5자 이상 입력해주세요." });
  }
  return errors;
}

export function validateAnswerInput(
  text: string,
  minLength = 10
): ValidationError[] {
  const errors: ValidationError[] = [];
  const trimmed = text ? text.trim() : "";

  if (trimmed.length === 0) {
    errors.push({ field: "answerText", message: "답변을 입력해주세요." });
  } else if (trimmed.length < minLength) {
    const missingChars = minLength - trimmed.length;
    errors.push({ field: "answerText", message: `${missingChars}자 더 입력해주세요.` });
  }
  return errors;
}
