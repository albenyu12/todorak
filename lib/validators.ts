// 1번 TODO (Y): zod 스키마 기반 검증으로 전환
// 입력값: 각 validate 함수의 data 파라미터
// 해야 할 일: npm install zod 후 z.object({ ... }).safeParse(data)로 교체,
// 현재 반환 타입(ValidationError[])은 그대로 유지
// 완료 기준: 모든 validate 함수가 zod 스키마로 동작하고 타입 안정성이 높아짐

// 2번 TODO (Y): validateProfileForm — role / collaborationStyle 필수 검증 추가
// 입력값: data.role (Role | ""), data.collaborationStyle (CollaborationStyle | "")
// 해야 할 일: 빈 문자열이면 ValidationError push
// 완료 기준: role/collaborationStyle 미선택 시 폼에 에러 메시지 표시

// 3번 TODO (Y): validateProfileForm — 태그 최소 선택 수 검증
// 입력값: data.interests[], data.skills[], data.lookingFor[]
// 해야 할 일: 각 배열 length === 0이면 에러 추가 (최소 1개 이상)
// 완료 기준: 태그를 하나도 선택하지 않으면 해당 필드에 에러 표시

// 4번 TODO (Y): validateAnswerInput — 최소 글자 수 검증 세분화
// 입력값: text (string), minLength (number, 기본 10)
// 해야 할 일: 공백 제거 후 length 검사, 에러 메시지에 몇 자 더 필요한지 표시
// 완료 기준: "8자 더 입력해주세요" 형태의 메시지가 표시됨

import {z} from "zod"; // [1번 TODO (Y) 해결] zod 라이브러리 임포트
import { OnboardingFormData } from "@/lib/types";

export interface ValidationError {
  field: string;
  message: string;
}

// [1번 TODO (Y) 해결] Zod에게 이름은 필수인지, 글자 수는 몇 자여야 하는지 규격을 알려주는 설계도를 만드는 스키마
const profileFormSchema = z.object({
  // 1. 이름은 필수이고, 양쪽 공백을 제거(.trim)했을 때 최소 1자 이상이어야 함
  name: z.string().trim().min(1, { message: "이름을 입력해주세요." }),
  // 2. 학과도 필수이고, 공백 제거 후 최소 1자 이상
  department: z.string().trim().min(1, { message: "학과를 입력해주세요." }),
  // 3. 학년은 비어있으면 안 됨 (z.any()에서 string 또는 number만 받도록 안전하게 타입 수정)
  year: z.string().trim().min(1, { message: "학년을 선택해주세요." }).or(z.number()),
  // 4. 자기소개는 공백 제거 후 최소 10자 이상
  bio: z.string().trim().min(10, { message: "자기소개를 10자 이상 입력해주세요." }),
  // [2번, 3번 TODO (Y) 해결] 역할과 협업 스타일은 빈 문자열("") 통과 방지! 최소 1자 필수! 각 태그 주머니(배열, array)에 최소 1개(.min(1))의 알맹이는 들어있어야 통과!
  role: z.string().trim().min(1, { message: "역할을 선택해주세요." }),
  collaborationStyle: z.string().trim().min(1, { message: "협업 스타일을 선택해주세요." }),
  interests: z.array(z.string()).min(1, { message: "관심사를 최소 1개 이상 선택해주세요." }),
  skills: z.array(z.string()).min(1, { message: "기술 스택을 최소 1개 이상 선택해주세요." }),
  lookingFor: z.array(z.string()).min(1, { message: "찾는 팀원 조건을 최소 1개 이상 선택해주세요." }),
});

// 프로필 입력 검증
export function validateProfileForm(
  data: Partial<OnboardingFormData>,
  isFinalSubmit = false
): ValidationError[] {
  const errors: ValidationError[] = [];

  // [도우미 함수] TypeScript 에러를 완벽하게 방지하는 규격화된 추출 방식
  const addError = (field: string, result: any) => {
    if (!result.success && result.error && result.error.issues && result.error.issues.length > 0) {
      // 💡 issues[0].message 로 첫 번째 에러 메시지를 명확히 끄집어냅니다.
      errors.push({ field, message: result.error.issues[0].message });
    }
  };

  // 1. 이름 검사
  if (isFinalSubmit || data.name !== undefined) {
    // 💡 undefined가 주입되어 발생하는 Invalid input 에러를 방지하기 위해 빈 문자열로 치환합니다.
    const value = data.name ?? ""; 
    const result = profileFormSchema.shape.name.safeParse(value);
    addError("name", result);
  }

  // 2. 학과 검사
  if (isFinalSubmit || data.department !== undefined) {
    // 💡 학과도 초기 실시간 입력 단계에서 undefined일 때 한글 커스텀 메시지가 출력되도록 유도합니다.
    const value = data.department ?? "";
    const result = profileFormSchema.shape.department.safeParse(value);
    addError("department", result);
  }

  // 3. 학년 검사
  if (isFinalSubmit || data.year !== undefined) {
    // 학년은 undefined일 때 빈 문자열("")을 주어 스키마 검증에서 걸러지도록 유도합니다.
    const value = data.year ?? "";
    const result = profileFormSchema.shape.year.safeParse(value);
    addError("year", result);
  }

  // 4. 자기소개 검사
  if (isFinalSubmit || data.bio !== undefined) {
    const value = data.bio ?? "";
    const result = profileFormSchema.shape.bio.safeParse(value);
    addError("bio", result);
  }

  // 5. 역할 검사
  if (isFinalSubmit || data.role !== undefined) {
    const value = data.role ?? "";
    const result = profileFormSchema.shape.role.safeParse(value);
    addError("role", result);
  }

  // 6. 협업 스타일 검사
  if (isFinalSubmit || data.collaborationStyle !== undefined) {
    const value = data.collaborationStyle ?? "";
    const result = profileFormSchema.shape.collaborationStyle.safeParse(value);
    addError("collaborationStyle", result);
  }

  // 7. 관심사 태그 검사
  if (isFinalSubmit || data.interests !== undefined) {
    const value = data.interests ?? [];
    const result = profileFormSchema.shape.interests.safeParse(value);
    addError("interests", result);
  }

  // 8. 기술 스택 태그 검사
  if (isFinalSubmit || data.skills !== undefined) {
    const value = data.skills ?? [];
    const result = profileFormSchema.shape.skills.safeParse(value);
    addError("skills", result);
  }

  // 9. 찾는 팀원 조건 태그 검사
  if (isFinalSubmit || data.lookingFor !== undefined) {
    const value = data.lookingFor ?? [];
    const result = profileFormSchema.shape.lookingFor.safeParse(value);
    addError("lookingFor", result);
  }

  return errors;
}

// 기존 이름 유지 (ProfileForm.tsx 호환)
export const validateOnboardingForm = validateProfileForm;

// 질문 입력 검증
export function validateQuestionInput(text: string): ValidationError[] {
  const errors: ValidationError[] = [];

  // 6번 TODO (Y): 금지어 필터 추가
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
  const trimmed = text ? text.trim() : "";

  if (trimmed.length === 0) {
    errors.push({ field: "answerText", message: "답변을 입력해주세요." });
  } else if (trimmed.length < minLength) {
    const missingChars = minLength - trimmed.length;
    errors.push({
      field: "answerText",
      message: `${missingChars}자 더 입력해주세요.`,
    });
  }
  return errors;
}
