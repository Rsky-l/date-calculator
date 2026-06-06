import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "日期差计算 — 在线计算两个日期间隔天数 | 日期计算器",
  description: "免费在线日期差计算器，快速计算两个日期之间相差多少天。同时展示周数、月数、小时数、分钟数换算结果。即输即算，完全免费。",
};

export default function DateDiffLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
