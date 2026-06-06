import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "日期加减计算 — 计算N天/周/月/年后的日期 | 日期计算器",
  description: "免费在线日期加减计算器，计算某个日期加或减N天、N周、N月、N年后的结果日期和星期。即输即算，完全免费。",
};

export default function DateAddSubLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
