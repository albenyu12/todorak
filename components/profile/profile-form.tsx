import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { OnboardingFormData, StudentProfile, Role } from "@/lib/types";
import { validateOnboardingForm } from "@/lib/validators";
import { useIsClient } from "@/lib/use-is-client";
import { getStoredClassId, setStoredProfileId } from "@/lib/client-session";
import { createProfile, updateProfile, getProfileById } from "@/lib/api/profiles";
import { createAnswer } from "@/lib/api/answers";

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
};

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
  };
}

export default function ProfileForm() {
  const searchParams = useSearchParams();
  const isEdit = searchParams.get("edit") === "true";
  const isClient = useIsClient();
  const [initialUser, setInitialUser] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    if (!isEdit || !isClient) return;

    async function fetchProfile() {
      const classId = getStoredClassId();
      const profileId = localStorage.getItem("todorak:profileId");

      if (!classId || !profileId) {
        setLoading(false);
        return;
      }

      try {
        const res = await getProfileById(profileId!, classId!);
        if (res.data) {
          setInitialUser(res.data);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [isEdit, isClient]);

  if (isClient && isEdit && loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

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
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validationErrors = validateOnboardingForm(form, true);
    if (validationErrors.length > 0) {
      setErrors(Object.fromEntries(validationErrors.map((err) => [err.field, err.message])));
      return;
    }

    const classId = getStoredClassId();
    if (!classId) {
      alert("클래스 정보를 찾을 수 없습니다. 다시 접속해주세요.");
      return;
    }

    setIsSubmitting(true);

    try {
      const profileData = {
        name: form.name!,
        department: form.department!,
        year: parseInt(form.year!),
        bio: form.bio || null,
        role: form.role as Role,
        interests: form.interests ?? [],
        skills: form.skills ?? [],
        lookingFor: form.lookingFor ?? [],
        contactMethods: initialUser?.contactMethods ?? [],
        avatarInitial: form.name?.[0] || null,
      };

      let resultProfile: StudentProfile | null = null;

      if (isEdit && initialUser) {
        const res = await updateProfile(initialUser.id, profileData);
        if (res.error) throw new Error(res.error.message);
        resultProfile = res.data;
      } else {
        const res = await createProfile(classId, profileData);
        if (res.error) throw new Error(res.error.message);
        resultProfile = res.data;
        
        if (resultProfile) {
          setStoredProfileId(resultProfile.id);
          
          await createAnswer(classId, {
            targetProfileId: resultProfile.id,
            recorderProfileId: resultProfile.id,
            inboxQuestionId: null,
            questionTemplateId: null,
            questionText: "팀 프로젝트에서 나를 어떤 동료로 소개하고 싶나요?",
            answerText: "열심히 소통하고 맡은 바 최선을 다하는 동료가 되겠습니다!",
            answerType: "first",
          });
        }
      }

      router.push(isEdit ? "/profile" : "/recommendations");
    } catch (err) {
      const message = err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.";
      alert(`저장에 실패했습니다: ${message}`);
    } finally {
      setIsSubmitting(false);
    }
  }

  function toggleTag(field: "interests" | "skills" | "lookingFor", value: string) {
    const current = (form[field] as string[]) ?? [];
    const updated = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
    setErrors((prev) => ({ ...prev, [field]: "" }));
    setForm((prev) => ({ ...prev, [field]: updated }));
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <Field label="이름" required error={errors.name}>
        <input
          className={`input ${errors.name ? "border-red-400 focus:border-red-400 focus:ring-red-100" : ""}`}
          placeholder="홍길동"
          disabled={isSubmitting}
          value={form.name ?? ""}
          onChange={(e) => { setErrors((p) => ({ ...p, name: "" })); setForm((p) => ({ ...p, name: e.target.value })); }}
        />
      </Field>

      <Field label="학과" required error={errors.department}>
        <input
          className={`input ${errors.department ? "border-red-400 focus:border-red-400 focus:ring-red-100" : ""}`}
          placeholder="컴퓨터공학과"
          disabled={isSubmitting}
          value={form.department ?? ""}
          onChange={(e) => { setErrors((p) => ({ ...p, department: "" })); setForm((p) => ({ ...p, department: e.target.value })); }}
        />
      </Field>

      <Field label="학년" required error={errors.year}>
        <select
          className={`input ${errors.year ? "border-red-400 focus:border-red-400 focus:ring-red-100" : ""}`}
          disabled={isSubmitting}
          value={form.year ?? ""}
          onChange={(e) => { setErrors((p) => ({ ...p, year: "" })); setForm((p) => ({ ...p, year: e.target.value })); }}
        >
          <option value="">선택</option>
          {[1, 2, 3, 4].map((y) => (
            <option key={y} value={String(y)}>{y}학년</option>
          ))}
        </select>
      </Field>

      <Field label="역할" required error={errors.role}>
        <div className="flex flex-wrap gap-2">
          {ROLE_OPTIONS.map((opt) => (
            <button
              key={opt}
              type="button"
              disabled={isSubmitting}
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
          disabled={isSubmitting}
        />
      </Field>

      <Field label="관심사" error={errors.interests}>
        <TagPicker
          options={INTEREST_OPTIONS}
          selected={form.interests ?? []}
          onToggle={(v) => toggleTag("interests", v)}
          disabled={isSubmitting}
        />
      </Field>

      <Field label="찾는 팀원 유형" error={errors.lookingFor}>
        <TagPicker
          options={LOOKING_FOR_OPTIONS}
          selected={form.lookingFor ?? []}
          onToggle={(v) => toggleTag("lookingFor", v)}
          disabled={isSubmitting}
        />
      </Field>

      <Field label="자기소개" error={errors.bio}>
        <textarea
          className={`input min-h-[80px] resize-none ${errors.bio ? "border-red-400 focus:border-red-400 focus:ring-red-100" : ""}`}
          placeholder="간단하게 본인을 소개해주세요"
          disabled={isSubmitting}
          value={form.bio ?? ""}
          onChange={(e) => { setErrors((p) => ({ ...p, bio: "" })); setForm((p) => ({ ...p, bio: e.target.value })); }}
        />
      </Field>

      <button 
        type="submit" 
        className="btn-primary mt-2 flex items-center justify-center gap-2"
        disabled={isSubmitting}
      >
        {isSubmitting && <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>}
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
  disabled,
}: {
  options: string[];
  selected: string[];
  onToggle: (v: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          disabled={disabled}
          onClick={() => onToggle(opt)}
          className={`rounded-full px-3 py-1 text-sm transition-colors ${
            selected.includes(opt)
              ? "border border-indigo-500 bg-indigo-50 text-indigo-600 font-medium"
              : "border border-gray-300 text-gray-600 hover:border-indigo-300"
          }`}
        >
          {selected.includes(opt) ? `✓ ${opt}` : opt}
        </button>
      ))}
    </div>
  );
}
