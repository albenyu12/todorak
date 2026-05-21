// TODO (Y): zod 스키마 기반 검증으로 전환
// 입력값: 각 validate 함수의 data 파라미터
// 해야 할 일: npm install zod 후 z.object({ ... }).safeParse(data)로 교체,
//             현재 반환 타입(ValidationError[])은 그대로 유지
// 완료 기준: 모든 validate 함수가 zod 스키마로 동작하고 타입 안정성이 높아짐

// TODO (Y): validateProfileForm — role / collaborationStyle 필수 검증 추가
// 입력값: data.role (Role | ""), data.collaborationStyle (CollaborationStyle | "")
// 해야 할 일: 빈 문자열이면 ValidationError push
// 완료 기준: role/collaborationStyle 미선택 시 폼에 에러 메시지 표시

// TODO (Y): validateProfileForm — 태그 최소 선택 수 검증
// 입력값: data.interests[], data.skills[], data.lookingFor[]
// 해야 할 일: 각 배열 length === 0이면 에러 추가 (최소 1개 이상)
// 완료 기준: 태그를 하나도 선택하지 않으면 해당 필드에 에러 표시

// TODO (Y): validateAnswerInput — 최소 글자 수 검증 세분화
// 입력값: text (string), minLength (number, 기본 10)
// 해야 할 일: 공백 제거 후 length 검사, 에러 메시지에 몇 자 더 필요한지 표시
// 완료 기준: "8자 더 입력해주세요" 형태의 메시지가 표시됨

import { OnboardingFormData } from "@/lib/types";

export interface ValidationError {
  field: string;
  message: string;
}

// 프로필 입력 검증
export function validateProfileForm(
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
  // TODO (Y): role, collaborationStyle, interests, skills, lookingFor 검증 추가

  return errors;
}

// 기존 이름 유지 (ProfileForm.tsx 호환)
export const validateOnboardingForm = validateProfileForm;

// 질문 입력 검증
export function validateQuestionInput(text: string): ValidationError[] {
  const errors: ValidationError[] = [];

  // TODO (Y): 금지어 필터 추가
  // 입력값: text (사용자가 직접 입력한 질문)
  // 해야 할 일: 부적절한 단어 목록을 만들고 포함 여부 체크
  // 완료 기준: 금지어 포함 시 "적절한 질문을 입력해주세요" 에러 표시

  if (!text || text.trim().length === 0) {
    errors.push({ field: "text", message: "질문을 입력해주세요." });
  } else if (text.trim().length < 5) {
    errors.push({ field: "text", message: "질문을 5자 이상 입력해주세요." });
  }

  return errors;
}

// 답변 입력 검증
export function validateAnswerInput(
  text: string,
  minLength = 10
): ValidationError[] {
  const errors: ValidationError[] = [];
  const trimmed = text.trim();

  if (trimmed.length === 0) {
    errors.push({ field: "answerText", message: "답변을 입력해주세요." });
  } else if (trimmed.length < minLength) {
    // TODO (Y): 에러 메시지에 부족한 글자 수 표시 ("N자 더 입력해주세요")
    errors.push({
      field: "answerText",
      message: `답변을 ${minLength}자 이상 입력해주세요.`,
    });
  }

  return errors;
}
