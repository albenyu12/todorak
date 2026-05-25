import { InputHTMLAttributes } from "react";

// TODO (B): focus 상태 ring 스타일 개선
// 입력값: CSS focus-visible, 현재 focus:ring-2 focus:ring-indigo-100
// 해야 할 일: ring 색상과 두께를 디자인 토큰과 통일, 에러 상태일 때 ring-red-300 적용
// 완료 기준: 포커스 시 명확한 시각 피드백, 에러 상태가 색상으로 구분됨

// TODO (B): 모바일 터치 영역 확인
// 입력값: 현재 py-2 padding
// 해야 할 일: 최소 높이 44px 보장 (py-2.5 이상 또는 min-h 적용)
// 완료 기준: 모바일에서 입력 필드 탭이 용이함

// TODO (B): 에러 / disabled 상태 시각화
// 입력값: error?: boolean, disabled prop
// 해야 할 일: error 시 border-red-400, disabled 시 bg-gray-50 + opacity
// 완료 기준: 폼 검증 에러가 인풋 테두리 색으로 즉시 인지됨

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export default function Input({ error = false, className = "", ...props }: InputProps) {
  return (
    <input
      className={[
        "w-full rounded-lg border px-3 py-2 text-sm outline-none transition-colors",
        "focus:ring-2 focus:ring-indigo-100 focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-1",
        "disabled:bg-gray-50 disabled:cursor-not-allowed",
        error
          ? "border-red-400 focus:border-red-400 focus-visible:ring-red-300"
          : "border-gray-300 focus:border-indigo-400",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
}
