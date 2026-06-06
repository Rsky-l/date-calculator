import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "工作日计算器 — 在线计算工作天数 | 日期计算器",
  description: "免费在线工作日计算器，快速计算两个日期之间有多少个工作日（周一至周五），自动排除周末。适用于项目排期、休假计算。",
};

export default function WorkdaysLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
