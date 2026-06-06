import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "年龄计算器 — 精确到天的年龄计算 | 日期计算器",
  description: "免费在线年龄计算器，精确计算你的年龄（年/月/天），同时显示总生存天数、下次生日倒计时、生肖和星座。",
};

export default function AgeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
