import ProfileForm from "@/components/profile/ProfileForm";

export default function OnboardingPage() {
  return (
    <div className="page-container">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">프로필 작성</h1>
      <p className="text-sm text-gray-500 mb-6">
        나를 소개하고 맞는 팀원을 추천받으세요.
      </p>
      <ProfileForm />
    </div>
  );
}
