import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI 效率工具箱 - 论文降重 | 简历优化 | 电商文案 | 合同审查",
  description: "AI智能论文降重、简历优化、电商文案生成、合同审查工具。每日免费使用3次。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
