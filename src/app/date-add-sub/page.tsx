"use client";

import { useState, useMemo } from "react";
import { parseDate, todayStr, addToDate, formatDate, dayOfWeek } from "@/lib/date-utils";
import Header from "@/components/Header";
import TabNav from "@/components/TabNav";
import Footer from "@/components/Footer";
import DateInput from "@/components/DateInput";
import ResultDisplay from "@/components/ResultDisplay";
import SeoSection from "@/components/SeoSection";

export default function DateAddSubPage() {
  const [baseDate, setBaseDate] = useState(todayStr());
  const [operation, setOperation] = useState<"+" | "-">("+");
  const [amount, setAmount] = useState(30);
  const [unit, setUnit] = useState<"days" | "weeks" | "months" | "years">("days");

  const result = useMemo(() => {
    const base = parseDate(baseDate);
    if (isNaN(base.getTime())) return null;
    const multiplier = operation === "+" ? 1 : -1;
    const resultDate = addToDate(base, amount * multiplier, unit);
    return {
      resultDate,
      dow: dayOfWeek(resultDate),
    };
  }, [baseDate, operation, amount, unit]);

  const seoFaqs = [
    {
      question: "日期加减计算器怎么用？",
      answer: "选择基准日期，选择加或减操作，输入数字并选择单位（天/周/月/年），页面会自动计算出结果日期并显示是星期几。",
    },
    {
      question: "30天后是什么日期？",
      answer: `从今天起30天后是${formatDate(addToDate(new Date(), 30, "days"))}。你可以使用本工具输入任意日期和天数来计算。`,
    },
    {
      question: "月末加一个月会怎么处理？",
      answer: "遵循JavaScript的日期处理规则：例如1月31日加1个月会得到2月28日（或闰年的2月29日），3月31日减1个月会得到2月28日（或29日）。",
    },
  ];

  const unitOptions: { value: "days" | "weeks" | "months" | "years"; label: string }[] = [
    { value: "days", label: "天" },
    { value: "weeks", label: "周" },
    { value: "months", label: "月" },
    { value: "years", label: "年" },
  ];

  return (
    <>
      <Header />
      <TabNav currentSlug="date-add-sub" />

      <div className="max-w-3xl mx-auto px-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6">➕ 日期加减</h2>

        {/* Input area */}
        <div className="space-y-3 mb-4">
          <DateInput label="基准日期" value={baseDate} onChange={setBaseDate} />

          <div className="flex gap-2 items-end">
            {/* Operation toggle */}
            <div className="flex rounded-lg border border-slate-200 dark:border-slate-600 overflow-hidden">
              <button
                onClick={() => setOperation("+")}
                className={`px-4 py-2.5 text-sm font-medium transition-colors ${
                  operation === "+"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-slate-600 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
                }`}
              >
                +
              </button>
              <button
                onClick={() => setOperation("-")}
                className={`px-4 py-2.5 text-sm font-medium transition-colors ${
                  operation === "-"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-slate-600 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
                }`}
              >
                −
              </button>
            </div>

            {/* Amount input */}
            <div className="flex-1">
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">数量</label>
              <input
                type="number"
                min={0}
                max={99999}
                value={amount}
                onChange={(e) => setAmount(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-800 dark:border-slate-600 dark:text-slate-100"
              />
            </div>

            {/* Unit selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">单位</label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value as typeof unit)}
                className="px-3 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-100"
              >
                {unitOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Result */}
        {result && (
          <ResultDisplay
            primaryValue={formatDate(result.resultDate)}
            primaryUnit=""
            breakdowns={[
              { label: "星期", value: result.dow, unit: "", color: "blue" as const },
              { label: "操作", value: `${operation}${amount}`, unit, color: "green" as const },
              { label: "基准日", value: baseDate, unit: "", color: "amber" as const },
              { label: "年", value: result.resultDate.getFullYear(), unit: "年", color: "pink" as const },
            ]}
          />
        )}

        {/* SEO section */}
        <SeoSection
          title="日期加减计算器 — 在线计算N天/周/月/年后的日期"
          description="日期加减计算器帮助你快速计算出某个日期加上或减去一定天数、周数、月数、年数之后的结果日期。无论是计算合同到期日、项目截止日、还是重要纪念日，输入即可得到精确结果。"
          faqs={seoFaqs}
        />

        <Footer />
      </div>
    </>
  );
}
