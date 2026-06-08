"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { OnboardingFormData, StudentProfile, Role, ContactMethod } from "@/lib/types";
import { validateOnboardingForm } from "@/lib/validators";
import { saveCurrentUser, getCurrentUser, initMockAnonymousQuestions } from "@/lib/localStorage";
import { useIsClient } from "@/lib/use-is-client";

const ROLE_OPTIONS: Role[] = ["개발자", "디자이너", "PM", "마케터", "데이터분석가"];
const INTEREST_OPTIONS = [
  "웹개발", "모바일", "AI", "데이터", "디자인", "마케팅", "스타트업", "게임개발", "오픈소스", "브랜딩", "기획", "독서", "운동",
];
const SKILL_OPTIONS = [
  "React", "Node.js", "TypeScript", "Python", "Swift", "Kotlin", "Flutter", "Figma", "Illustrator", "After Effects", "기획", "데이터분석", "SQL",
];
const LOOKING_FOR_OPTIONS: Role[] = ["개발자", "디자이너", "PM", "마케터", "데이터분석가"];
const EMPTY_FORM: Partial<OnboardingFormData> = {
  role: "",
  interests: [],
  skills: [],
  lookingFor: [],
  contactMethods: [],
};

// UI 내부에서만 사용하는 임시 연락처 상태 구조
interface ContactUIState {
  email: string;
  instagram: string;
  openchat: string;
  link: string;
}

function getInitialForm(user: StudentProfile | null): Partial<OnboardingFormData> {
  if (!user) return EMPTY_FORM;

  return {
    name: user.name,
    department: user.department,
    year: String(user.year),
    bio: user.bio ?? "",
    role: user.role,
    interests: user.interests,
    skills: user.skills,
    lookingFor: user.lookingFor,
    contactMethods: user.contactMethods ?? [],
  };
}

// StudentProfile.contactMethods의 실제 데이터에서 UI 상태로 변환
function getContactUIFromMethods(methods: ContactMethod[] = []): ContactUIState {
  const uiState: ContactUIState = { email: "", instagram: "", openchat: "", link: "" };
  
  methods.forEach(m => {
    if (m.type === "email") uiState.email = m.value;
    else {
      if (m.value.includes("instagram.com")) uiState.instagram = m.value;
      else if (m.value.includes("open.kakao.com")) uiState.openchat = m.value;
      else uiState.link = m.value;
    }
  });
  
  return uiState;
}

function buildProfilePayload(
  form: Partial<OnboardingFormData>,
  existingId: string | null
): StudentProfile {
  return {
    id: existingId ?? `user-${Date.now()}`,
    name: form.name!,
    department: form.department!,
    year: parseInt(form.year!),
    bio: form.bio || undefined,
    role: form.role as Role,
    interests: form.interests ?? [],
    skills: form.skills ?? [],
    lookingFor: form.lookingFor ?? [],
    contactMethods: form.contactMethods ?? [],
    avatarInitial: form.name?.[0],
  };
}

export default function ProfileForm() {
  const searchParams = useSearchParams();
  const isEdit = searchParams.get("edit") === "true";
  const isClient = useIsClient();
  const initialUser = isEdit && isClient ? getCurrentUser() : null;

  if (isEdit && !isClient) return null;

  return (
    <ProfileFormFields
      key={initialUser?.id ?? "new"}
      isEdit={isEdit}
      initialUser={initialUser}
    />
  );
}

function ProfileFormFields({
  isEdit,
  initialUser,
}: {
  isEdit: boolean;
  initialUser: StudentProfile | null;
}) {
  const router = useRouter();
  const [form, setForm] = useState<Partial<OnboardingFormData>>(() => getInitialForm(initialUser));
  const [contactUI, setContactUI] = useState<ContactUIState>(() => getContactUIFromMethods(initialUser?.contactMethods));
  const [existingId] = useState<string | null>(() => initialUser?.id ?? null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    // UI 상태(contactUI)를 payload용 contactMethods로 변환
    const methods: ContactMethod[] = [];
    if (contactUI.email.trim()) methods.push({ type: "email", value: contactUI.email.trim() });
    if (contactUI.instagram.trim()) methods.push({ type: "link", value: contactUI.instagram.trim() });
    if (contactUI.openchat.trim()) methods.push({ type: "link", value: contactUI.openchat.trim() });
    if (contactUI.link.trim()) methods.push({ type: "link", value: contactUI.link.trim() });

    const currentForm = { ...form, contactMethods: methods };

    const validationErrors = validateOnboardingForm(currentForm, true);
    if (validationErrors.length > 0) {
      setErrors(Object.fromEntries(validationErrors.map((err) => [err.field, err.message])));
      return;
    }

    const profile = buildProfilePayload(currentForm, existingId);

    saveCurrentUser(profile);
    if (!isEdit) initMockAnonymousQuestions(profile.id);
    router.push(isEdit ? "/profile" : "/recommendations");
  }

  function toggleTag(field: "interests" | "skills" | "lookingFor", value: string) {
    const current = (form[field] as string[]) ?? [];
    const updated = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
    setErrors((prev) => ({ ...prev, [field]: "" }));
    setForm((prev) => ({ ...prev, [field]: updated }));
  }

  const handleContactChange = (type: keyof ContactUIState, value: string) => {
    setContactUI(prev => ({ ...prev, [type]: value }));
    setErrors(prev => ({ ...prev, contactMethods: "" }));
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <Field label="이름" required error={errors.name}>
        <input
          className={`input ${errors.name ? "border-red-400 focus:border-red-400 focus:ring-red-100" : ""}`}
          placeholder="홍길동"
          value={form.name ?? ""}
          onChange={(e) => { setErrors((p) => ({ ...p, name: "" })); setForm((p) => ({ ...p, name: e.target.value })); }}
        />
      </Field>

      <Field label="학과" required error={errors.department}>
        <input
          className={`input ${errors.department ? "border-red-400 focus:border-red-400 focus:ring-red-100" : ""}`}
          placeholder="컴퓨터공학과"
          value={form.department ?? ""}
          onChange={(e) => { setErrors((p) => ({ ...p, department: "" })); setForm((p) => ({ ...p, department: e.target.value })); }}
        />
      </Field>

      <Field label="학년" required error={errors.year}>
        <select
          className={`input ${errors.year ? "border-red-400 focus:border-red-400 focus:ring-red-100" : ""}`}
          value={form.year ?? ""}
          onChange={(e) => { setErrors((p) => ({ ...p, year: "" })); setForm((p) => ({ ...p, year: e.target.value })); }}
        >
          <option value="">선택</option>
          {[1, 2, 3, 4].map((y) => (
            <option key={y} value={String(y)}>{y}학년</option>
          ))}
        </select>
      </Field>

      <Field label="연락처 (최소 1개 입력)" required error={errors.contactMethods}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-400 w-16 text-center">이메일</span>
            <input
              className="input text-sm py-1.5"
              placeholder="example@email.com"
              value={contactUI.email}
              onChange={(e) => handleContactChange("email", e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-400 w-16 text-center">인스타</span>
            <input
              className="input text-sm py-1.5"
              placeholder="https://instagram.com/..."
              value={contactUI.instagram}
              onChange={(e) => handleContactChange("instagram", e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-400 w-16 text-center">오픈채팅</span>
            <input
              className="input text-sm py-1.5"
              placeholder="https://open.kakao.com/..."
              value={contactUI.openchat}
              onChange={(e) => handleContactChange("openchat", e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-400 w-16 text-center">기타링크</span>
            <input
              className="input text-sm py-1.5"
              placeholder="https://..."
              value={contactUI.link}
              onChange={(e) => handleContactChange("link", e.target.value)}
            />
          </div>
        </div>
      </Field>

      <Field label="역할" required error={errors.role}>
        <div className="flex flex-wrap gap-2">
          {ROLE_OPTIONS.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => { setForm((p) => ({ ...p, role: opt })); setErrors((p) => ({ ...p, role: "" })); }}
              className={`rounded-full px-3 py-1 text-sm transition-colors ${
                form.role === opt
                  ? "border border-indigo-500 bg-indigo-50 text-indigo-600 font-medium"
                  : "border border-gray-300 text-gray-600 hover:border-indigo-300"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </Field>

      <Field label="보유 스킬" required error={errors.skills}>
        <TagPicker
          options={SKILL_OPTIONS}
          selected={form.skills ?? []}
          onToggle={(v) => toggleTag("skills", v)}
        />
      </Field>

      <Field label="관심사" error={errors.interests}>
        <TagPicker
          options={INTEREST_OPTIONS}
          selected={form.interests ?? []}
          onToggle={(v) => toggleTag("interests", v)}
        />
      </Field>

      <Field label="찾는 팀원 유형" error={errors.lookingFor}>
        <TagPicker
          options={LOOKING_FOR_OPTIONS}
          selected={form.lookingFor ?? []}
          onToggle={(v) => toggleTag("lookingFor", v)}
        />
      </Field>

      <Field label="자기소개" error={errors.bio}>
        <textarea
          className={`input min-h-[80px] resize-none ${errors.bio ? "border-red-400 focus:border-red-400 focus:ring-red-100" : ""}`}
          placeholder="간단하게 본인을 소개해주세요"
          value={form.bio ?? ""}
          onChange={(e) => { setErrors((p) => ({ ...p, bio: "" })); setForm((p) => ({ ...p, bio: e.target.value })); }}
        />
      </Field>

      <button type="submit" className="btn-primary mt-2">
        {isEdit ? "수정 완료" : "추천 받기"}
      </button>
    </form>
  );
}

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

function TagPicker({
  options,
  selected,
  onToggle,
}: {
  options: string[];
  selected: string[];
  onToggle: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onToggle(opt)}
          className={`rounded-full px-3 py-1 text-sm transition-colors ${
            selected.includes(opt)
              ? "border border-indigo-500 bg-indigo-50 text-indigo-600 font-medium"
              : "border border-gray-300 text-gray-600 hover:border-indigo-300"
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}
