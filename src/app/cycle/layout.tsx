import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "周期计算器 — 经期周期与预产期推算 | 日期计算器",
  description: "免费在线周期计算器，根据末次月经日期推算下次经期、排卵期和预产期。结果仅供参考，请咨询专业医生。",
};

export default function CycleLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
