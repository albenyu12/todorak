"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { OnboardingFormData, StudentProfile, Role, CollaborationStyle } from "@/lib/types";
import { validateOnboardingForm } from "@/lib/validators";
import { saveCurrentUser } from "@/lib/localStorage";

const ROLE_OPTIONS: Role[] = ["개발자", "디자이너", "PM", "마케터", "데이터분석가"];
const COLLABORATION_STYLE_OPTIONS: CollaborationStyle[] = ["리더형", "서포터형", "독립형", "협력형"];
const INTEREST_OPTIONS = [
  "웹개발", "모바일", "AI", "데이터", "디자인", "마케팅",
  "스타트업", "게임개발", "오픈소스", "브랜딩", "기획", "독서", "운동",
];
const SKILL_OPTIONS = [
  "React", "Node.js", "TypeScript", "Python", "Swift", "Kotlin",
  "Flutter", "Figma", "Illustrator", "After Effects", "기획", "데이터분석", "SQL",
];
const LOOKING_FOR_OPTIONS: Role[] = ["개발자", "디자이너", "PM", "마케터", "데이터분석가"];

export default function ProfileForm() {
  const router = useRouter();
  const [form, setForm] = useState<Partial<OnboardingFormData>>({
    role: "",
    collaborationStyle: "",
    interests: [],
    skills: [],
    lookingFor: [],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validationErrors = validateOnboardingForm(form);
    if (validationErrors.length > 0) {
      setErrors(Object.fromEntries(validationErrors.map((err) => [err.field, err.message])));
      return;
    }

    const profile: StudentProfile = {
      id: `user-${Date.now()}`,
      name: form.name!,
      department: form.department!,
      year: parseInt(form.year!),
      bio: form.bio || undefined,
      role: form.role as Role,
      collaborationStyle: form.collaborationStyle ? form.collaborationStyle as CollaborationStyle : undefined,
      interests: form.interests ?? [],
      skills: form.skills ?? [],
      lookingFor: form.lookingFor ?? [],
      avatarInitial: form.name?.[0],
    };

    saveCurrentUser(profile);
    router.push("/recommendations");
  }

  function toggleTag(field: "interests" | "skills" | "lookingFor", value: string) {
    const current = (form[field] as string[]) ?? [];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    setForm((prev) => ({ ...prev, [field]: updated }));
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <Field label="이름" required error={errors.name}>
        <input
          className="input"
          placeholder="홍길동"
          value={form.name ?? ""}
          onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
        />
      </Field>

      <Field label="학과" required error={errors.department}>
        <input
          className="input"
          placeholder="컴퓨터공학과"
          value={form.department ?? ""}
          onChange={(e) => setForm((p) => ({ ...p, department: e.target.value }))}
        />
      </Field>

      <Field label="학년" required error={errors.year}>
        <select
          className="input"
          value={form.year ?? ""}
          onChange={(e) => setForm((p) => ({ ...p, year: e.target.value }))}
        >
          <option value="">선택</option>
          {[1, 2, 3, 4].map((y) => (
            <option key={y} value={y}>{y}학년</option>
          ))}
        </select>
      </Field>

      <Field label="역할" required error={errors.role}>
        <div className="flex flex-wrap gap-2">
          {ROLE_OPTIONS.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => setForm((p) => ({ ...p, role: opt }))}
              className={`rounded-full px-3 py-1 text-sm transition-colors ${
                form.role === opt
                  ? "border-2 border-indigo-500 bg-indigo-50 text-indigo-600 font-medium"
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

      <Field label="협업 스타일" error={errors.collaborationStyle}>
        <div className="flex flex-wrap gap-2">
          {COLLABORATION_STYLE_OPTIONS.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => setForm((p) => ({ ...p, collaborationStyle: opt }))}
              className={`rounded-full px-3 py-1 text-sm transition-colors ${
                form.collaborationStyle === opt
                  ? "border-2 border-indigo-500 bg-indigo-50 text-indigo-600 font-medium"
                  : "border border-gray-300 text-gray-600 hover:border-indigo-300"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </Field>

      <Field label="관심사">
        <TagPicker
          options={INTEREST_OPTIONS}
          selected={form.interests ?? []}
          onToggle={(v) => toggleTag("interests", v)}
        />
      </Field>

      <Field label="찾는 팀원 유형">
        <TagPicker
          options={LOOKING_FOR_OPTIONS}
          selected={form.lookingFor ?? []}
          onToggle={(v) => toggleTag("lookingFor", v)}
        />
      </Field>

      <Field label="자기소개" error={errors.bio}>
        <textarea
          className="input min-h-[80px] resize-none"
          placeholder="간단하게 본인을 소개해주세요"
          value={form.bio ?? ""}
          onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))}
        />
      </Field>

      <button type="submit" className="btn-primary mt-2">
        추천 받기
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
              ? "border-2 border-indigo-500 bg-indigo-50 text-indigo-600 font-medium"
              : "border border-gray-300 text-gray-600 hover:border-indigo-300"
          }`}
        >
          {selected.includes(opt) ? `✓ ${opt}` : opt}
        </button>
      ))}
    </div>
  );
}
