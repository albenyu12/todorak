"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// TODO (B): 모바일 전용 하단 네비게이션 디자인
// 입력값: NAV_ITEMS 배열 (href, label, icon 자리)
// 해야 할 일:
//   1. 각 탭에 아이콘 추가 (lucide-react 또는 SVG inline)
//   2. safe-area-inset-bottom 대응 (iOS 홈 버튼 영역)
//   3. 활성 탭 indicator (색상 + 아이콘 변화)
// 완료 기준: 모바일에서 엄지손가락으로 쉽게 탭 전환 가능

// TODO (B): 데스크탑에서 숨기기
// 입력값: Tailwind 반응형 클래스
// 해야 할 일: md:hidden 적용해 데스크탑에서는 Header의 nav만 보이도록
// 완료 기준: 데스크탑에서 하단 nav가 노출되지 않음

// TODO (B): spacing / 터치 영역 확인
// 입력값: 현재 py-2 padding
// 해야 할 일: 각 탭 터치 영역 최소 44px 확보
// 완료 기준: 모바일에서 탭 전환 시 정확하게 탭됨

const NAV_ITEMS = [
  { href: "/recommendations", label: "추천" },
  { href: "/answers", label: "Q&A" },
  { href: "/onboarding", label: "프로필" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-10 border-t border-gray-200 bg-white md:hidden">
      <div className="flex">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-1 flex-col items-center py-2 text-xs transition-colors ${
                isActive ? "text-indigo-600 font-semibold" : "text-gray-400"
              }`}
            >
              {/* TODO (B): 아이콘 추가 */}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
