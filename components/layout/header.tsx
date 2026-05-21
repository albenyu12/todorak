"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// TODO (B): 레이아웃 / 반응형 개선
// 입력값: 현재 max-w-2xl 중앙 정렬 구조
// 해야 할 일: 모바일(~768px) / 태블릿 / 데스크탑 breakpoint별 레이아웃 확인,
//             로고와 nav 링크 간격 조정
// 완료 기준: 다양한 화면 크기에서 헤더가 자연스럽게 보임

// TODO (B): 활성 링크 스타일 개선
// 입력값: pathname 기반 isActive 여부
// 해야 할 일: 활성 탭이 더 명확하게 구분되도록 underline 또는 indicator 추가
// 완료 기준: 현재 어떤 페이지에 있는지 헤더만 봐도 알 수 있음

// TODO (B): 스크롤 시 헤더 고정 / shadow 처리
// 입력값: 스크롤 이벤트
// 해야 할 일: 스크롤 내릴 때 shadow 또는 backdrop-blur 추가 (선택)
// 완료 기준: 스크롤해도 헤더가 깔끔하게 유지됨

const NAV_LINKS = [
  { href: "/recommendations", label: "추천" },
  { href: "/answers", label: "Q&A" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-10 border-b border-gray-200 bg-white px-4 py-3">
      <div className="mx-auto flex max-w-2xl items-center justify-between">
        <Link href="/" className="text-lg font-bold text-indigo-600">
          토도락
        </Link>
        {/* TODO (B): 데스크탑 nav 링크 스타일 */}
        <nav className="hidden md:flex gap-4">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm transition-colors ${
                pathname.startsWith(link.href)
                  ? "font-semibold text-indigo-600"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
