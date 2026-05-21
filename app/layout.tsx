import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/header";
import BottomNav from "@/components/layout/bottom-nav";
import ClientInit from "@/components/client-init";

export const metadata: Metadata = {
  title: "토도락 — 팀빌딩 탐색 서비스",
  description: "Q&A로 팀원을 찾아보세요",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-gray-50">
        <ClientInit />
        <Header />
        {/* pb-16: BottomNav 높이만큼 하단 여백 확보 (모바일) */}
        <main className="flex-1 pb-16 md:pb-0">{children}</main>
        <BottomNav />
      </body>
    </html>
  );
}
