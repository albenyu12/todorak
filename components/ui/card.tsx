// TODO (B): shadow / border / rounded 일관성 정리
// 입력값: className prop, 현재 border-gray-200 + rounded-xl 조합
// 해야 할 일: 서비스 전체에서 카드 스타일을 이 컴포넌트 하나로 통일,
//             clickable 카드와 static 카드의 hover 스타일 분리
// 완료 기준: 모든 카드가 동일한 border/shadow 스타일을 사용함

// TODO (B): spacing 정리
// 입력값: padding 값 (현재 p-4 하드코딩)
// 해야 할 일: padding prop 또는 className으로 조정 가능하게 열어두기
// 완료 기준: 카드 안 콘텐츠 여백이 화면 크기에 관계없이 일관됨

// TODO (B): 모바일 터치 영역 확인 (clickable 카드)
// 입력값: onClick prop 유무
// 해야 할 일: onClick 있을 때 cursor-pointer + active:scale-[0.99] 등 터치 피드백 추가
// 완료 기준: 모바일에서 카드 탭 시 시각적 피드백이 있음

type CardPadding = "sm" | "md" | "lg";

const paddingStyles: Record<CardPadding, string> = {
  sm: "p-3",
  md: "p-4",
  lg: "p-6",
};

interface CardProps {
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  padding?: CardPadding;
}

export default function Card({ className = "", children, onClick, padding = "md" }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={[
        "rounded-xl border border-gray-200 bg-white shadow-sm",
        paddingStyles[padding],
        onClick
          ? "cursor-pointer hover:border-indigo-300 hover:shadow-md active:scale-[0.99] active:shadow-none transition-all select-none"
          : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}
