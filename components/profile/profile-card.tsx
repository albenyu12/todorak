import { StudentProfile } from "@/lib/types";

interface ProfileCardProps {
  profile: StudentProfile;
}

export default function ProfileCard({ profile }: ProfileCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 text-xl font-bold">
          {profile.avatarInitial ?? profile.name[0]}
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900">{profile.name}</h2>
          <p className="text-sm text-gray-500">
            {profile.department} · {profile.year}학년
          </p>
          <div className="mt-1 flex flex-wrap gap-1.5">
            {profile.roles.map((role) => (
              <span key={role} className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700">
                {role}
              </span>
            ))}
          </div>
        </div>
      </div>

      {profile.bio && (
        <p className="mt-4 text-sm text-gray-700 leading-relaxed">{profile.bio}</p>
      )}

      <Section label="관심사">
        <TagList tags={profile.interests} color="indigo" />
      </Section>

      <Section label="보유 스킬">
        <TagList tags={profile.skills} color="gray" />
      </Section>

      <Section label="찾는 팀원">
        <TagList tags={profile.lookingFor} color="green" />
      </Section>
    </div>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mt-4">
      <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-gray-400">
        {label}
      </p>
      {children}
    </div>
  );
}

const colorMap = {
  indigo: "bg-indigo-50 text-indigo-700",
  gray: "bg-gray-100 text-gray-700",
  green: "bg-green-50 text-green-700",
};

function TagList({ tags, color }: { tags: string[]; color: keyof typeof colorMap }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.map((tag) => (
        <span
          key={tag}
          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${colorMap[color]}`}
        >
          {tag}
        </span>
      ))}
    </div>
  );
}
