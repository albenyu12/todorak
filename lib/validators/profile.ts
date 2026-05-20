// TODO (Y): zod 또는 yup 도입 시 이 파일을 schema 기반 validation으로 교체
// TODO (Y): 에러 메시지 국제화(i18n) 대응

import { OnboardingFormData } from "@/lib/types";

export interface ValidationError {
  field: keyof OnboardingFormData;
  message: string;
}

export function validateOnboardingForm(
  data: Partial<OnboardingFormData>
): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!data.name || data.name.trim().length === 0) {
    errors.push({ field: "name", message: "이름을 입력해주세요." });
  }

  if (!data.department || data.department.trim().length === 0) {
    errors.push({ field: "department", message: "학과를 입력해주세요." });
  }

  if (!data.year) {
    errors.push({ field: "year", message: "학년을 선택해주세요." });
  }

  if (!data.bio || data.bio.trim().length < 10) {
    errors.push({ field: "bio", message: "자기소개를 10자 이상 입력해주세요." });
  }

  // TODO (Y): interests / skills / lookingFor 최소 선택 수 검증 추가

  return errors;
}
