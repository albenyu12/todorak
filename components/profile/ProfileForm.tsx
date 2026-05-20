"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { OnboardingFormData, StudentProfile } from "@/types";
import { validateOnboardingForm } from "@/lib/validators/profile";
import { saveCurrentUser } from "@/lib/localStorage";

const INTEREST_OPTIONS = [
  "웹개발", "모바일", "AI", "데이터", "디자인", "마케팅",
  "스타트업", "게임개발", "오픈소스", "브랜딩", "기획", "독서", "운동",
];

const SKILL_OPTIONS = [
  "React", "Node.js", "TypeScript", "Python", "Swift", "Kotlin",
  "Flutter", "Figma", "Illustrator", "After Effects", "기획", "데이터분석", "SQL",
];

const LOOKING_FOR_OPTIONS = ["개발자", "디자이너", "기획자", "마케터", "데이터분석가"];

export default function ProfileForm() {
  const router = useRouter();
  const [form, setForm] = useState<Partial<OnboardingFormData>>({
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
      bio: form.bio!,
      interests: form.interests ?? [],
      skills: form.skills ?? [],
      lookingFor: form.lookingFor ?? [],
      avatarInitial: form.name?.[0],
    };

    saveCurrentUser(profile);
    router.push("/recommendations");
  }

  function toggleTag(field: "interests" | "skills" | "lookingFor", value: string) {
    const current = form[field] ?? [];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    setForm((prev) => ({ ...prev, [field]: updated }));
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <Field label="이름" error={errors.name}>
        <input
          className="input"
          placeholder="홍길동"
          value={form.name ?? ""}
          onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
        />
      </Field>

      <Field label="학과" error={errors.department}>
        <input
          className="input"
          placeholder="컴퓨터공학과"
          value={form.department ?? ""}
          onChange={(e) => setForm((p) => ({ ...p, department: e.target.value }))}
        />
      </Field>

      <Field label="학년" error={errors.year}>
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

      <Field label="자기소개" error={errors.bio}>
        <textarea
          className="input min-h-[80px] resize-none"
          placeholder="간단하게 본인을 소개해주세요"
          value={form.bio ?? ""}
          onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))}
        />
      </Field>

      <Field label="관심사 (복수 선택)">
        <TagPicker
          options={INTEREST_OPTIONS}
          selected={form.interests ?? []}
          onToggle={(v) => toggleTag("interests", v)}
        />
      </Field>

      <Field label="보유 스킬 (복수 선택)">
        <TagPicker
          options={SKILL_OPTIONS}
          selected={form.skills ?? []}
          onToggle={(v) => toggleTag("skills", v)}
        />
      </Field>

      <Field label="찾는 팀원 유형 (복수 선택)">
        <TagPicker
          options={LOOKING_FOR_OPTIONS}
          selected={form.lookingFor ?? []}
          onToggle={(v) => toggleTag("lookingFor", v)}
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
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>
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
          className={`rounded-full border px-3 py-1 text-sm transition-colors ${
            selected.includes(opt)
              ? "border-indigo-500 bg-indigo-500 text-white"
              : "border-gray-300 text-gray-600 hover:border-indigo-300"
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}
