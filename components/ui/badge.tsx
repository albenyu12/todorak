// TODO (B): 색상 팔레트 정리
// 입력값: variant 값, 현재 Tailwind 색상 클래스
// 해야 할 일: role/category/collaboration 각 variant의 색상이 서비스 전체에서
//             일관되게 쓰이도록 variantStyles 값 확정
// 완료 기준: 같은 variant는 어디서 쓰여도 동일한 색상으로 보임

// TODO (B): 크기/padding spacing 정리
// 입력값: 현재 px-2.5 py-0.5 text-xs
// 완료 기준: 텍스트 길이에 관계없이 뱃지 모양이 일정하게 유지됨

// TODO (B): 교수님 시연 플로우 기준 visual polish
// 입력값: role 뱃지 (학생 카드에서 가장 눈에 띄는 요소)
// 해야 할 일: 역할 뱃지가 한눈에 읽히도록 font-weight, 색상 대비 확인
// 완료 기준: 학생 카드에서 role이 가장 먼저 인식됨

export type BadgeVariant = "default" | "role" | "collaboration" | "category" | "match";

interface BadgeProps {
  variant?: BadgeVariant;
  className?: string;
  children: React.ReactNode;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-gray-100 text-gray-700",
  role: "bg-indigo-100 text-indigo-800 font-semibold ring-1 ring-indigo-200",
  collaboration: "bg-amber-50 text-amber-700",
  category: "bg-gray-100 text-gray-500",
  match: "bg-green-50 text-green-700",
};

export default function Badge({ variant = "default", className = "", children }: BadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variantStyles[variant],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </span>
  );
}
