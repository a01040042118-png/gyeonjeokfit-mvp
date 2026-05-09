import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "웹 제작 문서 자동화 키트",
  description:
    "웹 제작 프리랜서를 위한 견적서, 제안서, 계약 초안 자동 생성 MVP 랜딩페이지",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
