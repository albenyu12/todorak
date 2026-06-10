"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { getStoredClassCode, getStoredProfileId, withClassCode } from "@/lib/client-session";
import { useIsClient } from "@/lib/use-is-client";

// TODO (B): 레이아웃 / 반응형 개선
// TODO (B): 활성 링크 스타일 개선
// TODO (B): 스크롤 시 헤더 고정 / shadow 처리

const NAV_LINKS = [
  { href: "/recommendations", label: "추천" },
  { href: "/answers", label: "Q&A" },
  { href: "/inbox", label: "인박스" },
  { href: "/profile", label: "프로필" },
];

function HeaderNav() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isClient = useIsClient();
  const classCode = searchParams.get("class") ?? (isClient ? getStoredClassCode() : null);
  const profileId = isClient ? getStoredProfileId() : null;
  const isEditMode = pathname === "/onboarding" && searchParams.get("edit") === "true";
  const hrefWithClass = (href: string) => classCode ? withClassCode(href, classCode) : href;

  if (pathname === "/") {
    return (
      <Link href={hrefWithClass("/onboarding")} className="btn-primary text-sm px-4 py-1.5">
        로그인
      </Link>
    );
  }

  if (pathname === "/onboarding" && !isEditMode) {
    return null;
  }

  if (!profileId) {
    return null;
  }

  return (
    <>
      {NAV_LINKS.map((link) => {
        const isActive = pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={hrefWithClass(link.href)}
            className={`px-2 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
              isActive
                ? "text-indigo-600 bg-indigo-50"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </>
  );
}

export default function Header() {
  const pathname = usePathname();
  const [hasScroll, setHasScroll] = useState(false);
  const isClient = useIsClient();
  const classCode = isClient ? getStoredClassCode() : null;
  const logoPath = pathname && isClient && getStoredProfileId() ? "/recommendations" : "/";
  const logoHref = classCode ? withClassCode(logoPath, classCode) : logoPath;

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
        <nav className="hidden md:flex items-center gap-2">
          <Suspense>
            <HeaderNav />
          </Suspense>
        </nav>
      </div>
    </header>
  );
}
