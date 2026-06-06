import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "农历查询 — 公历农历互转、节气查询 | 日期计算器",
  description: "免费在线农历查询工具，公历日期与农历日期互转，查看二十四节气，了解生肖年份。中国传统历法查询。",
};

export default function LunarLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
