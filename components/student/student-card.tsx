import Link from "next/link";
import { StudentProfile } from "@/lib/types";
import { withClassCode } from "@/lib/client-session";

interface StudentCardProps {
  student: StudentProfile;
  matchReasons?: string[];
  classCode?: string;
}

export default function StudentCard({ student, matchReasons, classCode }: StudentCardProps) {
  const profileHref = classCode
    ? withClassCode(`/students/${student.id}`, classCode)
    : `/students/${student.id}`;

  return (
    <Link href={profileHref}>
      <div className="rounded-xl border border-gray-200 bg-white p-4 hover:border-indigo-300 hover:shadow-sm transition-all">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 font-semibold">
            {student.avatarInitial ?? student.name[0]}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-gray-900">{student.name}</span>
              <span className="text-xs text-gray-400">
                {student.department} {student.year}학년
              </span>
              <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs text-indigo-600">
                {student.role}
              </span>
            </div>
            {student.bio && (
              <p className="mt-1 text-sm text-gray-600 line-clamp-2">{student.bio}</p>
            )}
            <div className="mt-2 flex flex-wrap gap-1">
              {student.skills?.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
                >
                  {skill}
                </span>
              ))}
            </div>
            {matchReasons && matchReasons.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {matchReasons.map((reason) => (
                  <span
                    key={reason}
                    className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs text-indigo-600"
                  >
                    {reason}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
