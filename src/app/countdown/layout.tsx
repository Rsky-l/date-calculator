import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "倒计时器 — 在线倒计时天数计算 | 日期计算器",
  description: "免费在线倒计时工具，设置目标日期即可实时显示剩余天数、小时、分钟、秒。适用于重要日期提醒、活动倒计时。",
};

export default function CountdownLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
