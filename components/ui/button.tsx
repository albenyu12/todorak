import { ButtonHTMLAttributes } from "react";

// TODO (B): 색상 일관성 정리
// 입력값: variant ("primary" | "secondary" | "ghost"), 현재 Tailwind 클래스
// 해야 할 일: primary/secondary/ghost 각 상태의 색상을 디자인 토큰 기반으로 통일
// 완료 기준: 세 variant가 전체 서비스에서 동일하게 보임

// TODO (B): hover / focus / disabled 상태 개선
// 입력값: disabled prop, CSS :focus-visible
// 해야 할 일: disabled 시 opacity + cursor-not-allowed, focus 시 ring 스타일 적용
// 완료 기준: 키보드 탐색 시 focus ring이 보이고, disabled 버튼이 시각적으로 구분됨

// TODO (B): 모바일 터치 영역 확인
// 입력값: size prop ("sm" | "md" | "lg")
// 해야 할 일: 최소 높이 44px 보장, 작은 버튼도 터치 영역 확보
// 완료 기준: 모바일에서 손가락으로 쉽게 탭 가능

// TODO (B): 교수님 시연 플로우 기준 visual polish
// 입력값: 주요 CTA 버튼 (추천 받기, 답변 저장, 이 질문으로 대화하기)
// 해야 할 일: 시연 플로우의 핵심 버튼에 강조 효과 적용
// 완료 기준: 시연 중 클릭해야 할 버튼이 한눈에 보임

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-indigo-600 text-white hover:bg-indigo-700",
  secondary: "border border-gray-300 text-gray-700 hover:bg-gray-50",
  ghost: "text-gray-500 hover:text-gray-900 hover:bg-gray-100",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2.5 text-sm",
  lg: "px-5 py-3 text-base",
};

export default function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={[
        "inline-flex items-center justify-center rounded-lg font-semibold transition-colors",
        "disabled:opacity-40 disabled:cursor-not-allowed",
        variantStyles[variant],
        sizeStyles[size],
        fullWidth ? "w-full" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </button>
  );
}
