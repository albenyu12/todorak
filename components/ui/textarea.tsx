import { TextareaHTMLAttributes } from "react";

// TODO (B): Input과 스타일 일관성 맞추기
// 입력값: 현재 border/focus/padding 클래스
// 해야 할 일: Input 컴포넌트와 동일한 border/focus ring 스타일 적용
// 완료 기준: Input과 Textarea가 나란히 있을 때 시각적으로 통일됨

// TODO (B): resize 핸들 스타일 개선
// 입력값: resize="none" 여부
// 해야 할 일: resize 허용 시 핸들이 자연스럽게 보이도록 처리
// 완료 기준: 사용자가 텍스트에어리어를 자연스럽게 확장할 수 있음

// TODO (B): 모바일에서 최소 높이 확인
// 입력값: minRows 또는 min-h 클래스
// 해야 할 일: 모바일에서 충분한 입력 공간 확보 (최소 120px)
// 완료 기준: 모바일에서 답변 입력 시 편안한 영역 제공

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
  resizable?: boolean;
}

export default function Textarea({ error = false, resizable = false, className = "", ...props }: TextareaProps) {
  return (
    <textarea
      className={[
        "w-full rounded-lg border px-3 py-2 text-sm outline-none transition-colors min-h-[120px]",
        resizable ? "resize-y" : "resize-none",
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
