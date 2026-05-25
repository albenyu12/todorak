"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// TODO (B): 데스크탑에서 숨기기
// 입력값: Tailwind 반응형 클래스
// 해야 할 일: md:hidden 적용해 데스크탑에서는 Header의 nav만 보이도록
// 완료 기준: 데스크탑에서 하단 nav가 노출되지 않음

// TODO (B): spacing / 터치 영역 확인
// 입력값: 현재 py-2 padding
// 해야 할 일: 각 탭 터치 영역 최소 44px 확보
// 완료 기준: 모바일에서 탭 전환 시 정확하게 탭됨

const NAV_ITEMS = [
  { 
    href: "/recommendations", 
    label: "추천", 
    icon: (active: boolean) => (
      <svg className="w-6 h-6" fill={active ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    )
  },
  { 
    href: "/answers", 
    label: "Q&A", 
    icon: (active: boolean) => (
      <svg className="w-6 h-6" fill={active ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
      </svg>
    )
  },
  { 
    href: "/profile", 
    label: "프로필", 
    icon: (active: boolean) => (
      <svg className="w-6 h-6" fill={active ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    )
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  if (pathname === "/" || pathname === "/onboarding") return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-10 border-t border-gray-200 bg-white md:hidden pb-[env(safe-area-inset-bottom)]">
      <div className="flex">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-1 flex-col items-center justify-center min-h-[3rem] pb-1 pt-2 text-xs transition-colors ${
                isActive ? "text-indigo-600" : "text-gray-400"
              }`}
            >
              {item.icon(isActive)}
              <span className={isActive ? "font-semibold" : ""}>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
