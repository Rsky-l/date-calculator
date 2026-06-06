"use client";

import { useState, useMemo } from "react";
import { parseDate, todayStr } from "@/lib/date-utils";
import Header from "@/components/Header";
import TabNav from "@/components/TabNav";
import Footer from "@/components/Footer";
import DateInput from "@/components/DateInput";
import ResultDisplay from "@/components/ResultDisplay";
import SeoSection from "@/components/SeoSection";

function countWorkdays(start: Date, end: Date): { total: number; workdays: number; weekends: number } {
  let workdays = 0;
  let weekends = 0;
  const current = new Date(start);
  while (current <= end) {
    const dow = current.getDay();
    if (dow === 0 || dow === 6) weekends++;
    else workdays++;
    current.setDate(current.getDate() + 1);
  }
  return { total: workdays + weekends, workdays, weekends };
}

export default function WorkdaysPage() {
  const [startDate, setStartDate] = useState("2026-01-01");
  const [endDate, setEndDate] = useState(todayStr());

  const result = useMemo(() => {
    const start = parseDate(startDate);
    const end = parseDate(endDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return null;
    if (end < start) return null;
    const counts = countWorkdays(start, end);
    return {
      primaryValue: counts.workdays,
      primaryUnit: "个工作日",
      breakdowns: [
        { label: "总天数", value: counts.total, unit: "天", color: "blue" as const },
        { label: "工作日", value: counts.workdays, unit: "天", color: "green" as const },
        { label: "周末", value: counts.weekends, unit: "天", color: "amber" as const },
      ],
    };
  }, [startDate, endDate]);

  const seoFaqs = [
    {
      question: "如何计算两个日期之间的工作日天数？",
      answer: "选择开始日期和结束日期，页面自动计算两个日期之间有多少个工作日（周一至周五），同时也会显示总日历天数和周末天数。计算结果即时显示，无需点击任何按钮。",
    },
    {
      question: "工作日计算包含法定节假日吗？",
      answer: "本工具仅排除周末（周六和周日），不包含法定节假日。如需更精确的工作日计算（排除法定假日），建议参考政府发布的年度假期安排。",
    },
    {
      question: "工作日计算有什么实际用途？",
      answer: "工作日计算常用于项目排期、工时估算、请假天数计算、合同履行期限计算等场景。在商务和法律领域，许多期限是以工作日而非自然日计算的。",
    },
  ];

  return (
    <>
      <Header />
      <TabNav currentSlug="workdays" />

      <div className="max-w-3xl mx-auto px-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6">🏢 工作日计算</h2>

        {result === null && startDate && endDate && parseDate(startDate) > parseDate(endDate) ? (
          <div className="mb-4 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
            开始日期不能晚于结束日期，请重新选择。
          </div>
        ) : null}

        <div className="flex gap-3 mb-4">
          <DateInput label="开始日期" value={startDate} onChange={setStartDate} />
          <div className="flex items-end pb-2.5 text-slate-400 dark:text-slate-500 text-lg">→</div>
          <DateInput label="结束日期" value={endDate} onChange={setEndDate} />
        </div>

        {result && (
          <ResultDisplay
            primaryValue={result.primaryValue}
            primaryUnit={result.primaryUnit}
            breakdowns={result.breakdowns}
          />
        )}

        <SeoSection
          title="工作日计算器 — 在线计算两个日期之间的工作天数"
          description="免费在线工作日计算器，快速计算两个日期之间有多少个工作日（周一至周五），自动排除周末。输入开始日期和结束日期即可获得精确的工作日天数统计，适用于项目排期、工时管理、休假计算等场景。"
          faqs={seoFaqs}
        />

        <Footer />
      </div>
    </>
  );
}
