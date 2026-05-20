"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const links = [
    { href: "/recommendations", label: "추천" },
    { href: "/answers", label: "Q&A" },
  ];

  return (
    <nav className="border-b border-gray-200 bg-white px-4 py-3">
      <div className="mx-auto flex max-w-2xl items-center justify-between">
        <Link href="/" className="text-lg font-bold text-indigo-600">
          토도락
        </Link>
        <div className="flex gap-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm ${
                pathname.startsWith(link.href)
                  ? "font-semibold text-indigo-600"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
