"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { getCurrentUser } from "@/lib/localStorage";

// TODO (B): 레이아웃 / 반응형 개선
// TODO (B): 활성 링크 스타일 개선
// TODO (B): 스크롤 시 헤더 고정 / shadow 처리

const NAV_LINKS = [
  { href: "/recommendations", label: "추천" },
  { href: "/answers", label: "Q&A" },
  { href: "/profile", label: "프로필" },
];

function HeaderNav() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isEditMode = pathname === "/onboarding" && searchParams.get("edit") === "true";

  if (pathname === "/") {
    return (
      <Link href="/onboarding" className="btn-primary text-sm px-4 py-1.5">
        로그인
      </Link>
    );
  }

  if (pathname === "/onboarding" && !isEditMode) {
    return null;
  }

  return (
    <>
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
    </>
  );
}

export default function Header() {
  const [logoHref, setLogoHref] = useState("/");
  const [hasScroll, setHasScroll] = useState(false);

  useEffect(() => {
    const user = getCurrentUser();
    if (user) setLogoHref("/recommendations");
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setHasScroll(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-10 border-b border-gray-200 bg-white px-4 py-3 transition-shadow duration-200 ${
        hasScroll ? "shadow-sm" : ""
      }`}
    >
      <div className="mx-auto flex max-w-2xl items-center justify-between">
        <Link href={logoHref} className="text-lg font-bold text-indigo-600">
          토도락
        </Link>
        <nav className="hidden md:flex gap-4">
          <Suspense>
            <HeaderNav />
          </Suspense>
        </nav>
      </div>
    </header>
  );
}
