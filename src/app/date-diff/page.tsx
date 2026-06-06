"use client";

import { useState, useMemo } from "react";
import { parseDate, todayStr, dateDiffBreakdown } from "@/lib/date-utils";
import Header from "@/components/Header";
import TabNav from "@/components/TabNav";
import Footer from "@/components/Footer";
import DateInput from "@/components/DateInput";
import ResultDisplay from "@/components/ResultDisplay";
import SeoSection from "@/components/SeoSection";

export default function DateDiffPage() {
  const [startDate, setStartDate] = useState("2026-01-01");
  const [endDate, setEndDate] = useState(todayStr());

  const result = useMemo(() => {
    const start = parseDate(startDate);
    const end = parseDate(endDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return null;
    const diff = dateDiffBreakdown(start, end);
    const prefix = diff.isNegative ? "-" : "";
    return {
      primaryValue: `${prefix}${diff.totalDays}`,
      primaryUnit: "天",
      breakdowns: [
        { label: "年/月/日", value: `${diff.years}年${diff.months}月${diff.remainingDays}日`, unit: "", color: "blue" as const },
        { label: "周", value: `${prefix}${diff.weeks}`, unit: `周 + ${diff.weekRemainder}天`, color: "green" as const },
        { label: "小时", value: `${prefix}${diff.hours}`, unit: "小时", color: "amber" as const },
        { label: "分钟", value: `${prefix}${diff.minutes}`, unit: "分钟", color: "pink" as const },
      ],
    };
  }, [startDate, endDate]);

  const seoFaqs = [
    {
      question: "如何计算两个日期之间相差多少天？",
      answer: "选择开始日期和结束日期，页面会自动计算并显示两个日期之间相隔的天数、周数、月数、小时数和分钟数。计算结果即时显示，无需点击任何按钮。",
    },
    {
      question: "日期差计算结果包含开始日期和结束日期吗？",
      answer: "日期差计算的是两个日期之间的间隔天数，不包含开始日期。例如，1月1日到1月2日相差1天。如果你需要计算包含头尾的天数，在结果上+1即可。",
    },
    {
      question: "这个工具有什么实际用途？",
      answer: "日期差计算器可以用于计算项目工期、请假天数、距离某个日期的天数、计算年龄差、合同剩余天数等各种需要计算日期间隔的场景。",
    },
  ];

  return (
    <>
      <Header />
      <TabNav currentSlug="date-diff" />

      <div className="max-w-3xl mx-auto px-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6">📆 日期差计算</h2>

        {/* Input area */}
        <div className="flex gap-3 mb-4">
          <DateInput label="开始日期" value={startDate} onChange={setStartDate} />
          <div className="flex items-end pb-2.5 text-slate-400 dark:text-slate-500 text-lg">→</div>
          <DateInput label="结束日期" value={endDate} onChange={setEndDate} />
        </div>

        {/* Result */}
        {result && (
          <ResultDisplay
            primaryValue={result.primaryValue}
            primaryUnit={result.primaryUnit}
            breakdowns={result.breakdowns}
          />
        )}

        {/* SEO section */}
        <SeoSection
          title="日期差计算器 — 在线计算两个日期间隔天数"
          description="日期差计算器是一个免费在线工具，帮助你快速计算两个日期之间相隔多少天。输入开始日期和结束日期，自动计算出间隔天数的同时，还会展示换算后的周数、月数、小时数和分钟数，满足你在工作、学习和生活中的各种日期计算需求。"
          faqs={seoFaqs}
        />

        <Footer />
      </div>
    </>
  );
}
