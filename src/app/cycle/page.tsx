"use client";

import { useState, useMemo } from "react";
import { parseDate, todayStr, addToDate, formatDate, dayOfWeek } from "@/lib/date-utils";
import Header from "@/components/Header";
import TabNav from "@/components/TabNav";
import Footer from "@/components/Footer";
import DateInput from "@/components/DateInput";
import ResultDisplay from "@/components/ResultDisplay";
import SeoSection from "@/components/SeoSection";

export default function CyclePage() {
  const [lastPeriod, setLastPeriod] = useState(todayStr());
  const [cycleLength, setCycleLength] = useState(28);

  const result = useMemo(() => {
    const last = parseDate(lastPeriod);
    if (isNaN(last.getTime()) || cycleLength < 21 || cycleLength > 45) return null;

    const nextPeriod = addToDate(last, cycleLength, "days");
    const ovulationDay = addToDate(last, 14, "days");
    const dueDate = addToDate(last, 280, "days");
    const ovulationStart = addToDate(ovulationDay, -3, "days");
    const ovulationEnd = addToDate(ovulationDay, 3, "days");

    return {
      primaryValue: formatDate(nextPeriod),
      primaryUnit: "",
      breakdowns: [
        { label: "下次经期", value: formatDate(nextPeriod), unit: dayOfWeek(nextPeriod), color: "blue" as const },
        { label: "排卵期开始", value: formatDate(ovulationStart), unit: dayOfWeek(ovulationStart), color: "green" as const },
        { label: "排卵期结束", value: formatDate(ovulationEnd), unit: dayOfWeek(ovulationEnd), color: "green" as const },
        { label: "预产期", value: formatDate(dueDate), unit: dayOfWeek(dueDate), color: "pink" as const },
      ],
    };
  }, [lastPeriod, cycleLength]);

  const seoFaqs = [
    {
      question: "周期计算器如何使用？",
      answer: "输入末次月经的开始日期和你的平均周期长度（默认28天），页面将自动推算下次经期日期、排卵期窗口和预产期（假设受孕）。",
    },
    {
      question: "预产期是怎么计算的？",
      answer: "预产期按末次月经第一天加280天（40周）计算，即Naegele规则。实际分娩日期可能提前或延后1-2周，请以医生诊断为准。",
    },
    {
      question: "计算结果准确吗？",
      answer: "本工具提供的是基于标准周期的估算结果，仅供参考。每个人的身体状况不同，周期长度可能有所变化。如有健康问题，请务必咨询专业医生。",
    },
  ];

  return (
    <>
      <Header />
      <TabNav currentSlug="cycle" />

      <div className="max-w-3xl mx-auto px-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6">📅 周期计算</h2>

        <div className="space-y-3 mb-4">
          <DateInput label="末次月经日期" value={lastPeriod} onChange={setLastPeriod} />
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
              周期长度（天）
            </label>
            <input
              type="number"
              min={21}
              max={45}
              value={cycleLength}
              onChange={(e) => setCycleLength(Math.max(21, Math.min(45, parseInt(e.target.value) || 28)))}
              className="w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-800 dark:border-slate-600 dark:text-slate-100"
            />
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">范围：21-45天，常见周期为28天</p>
          </div>
        </div>

        {result && (
          <ResultDisplay
            primaryValue={result.primaryValue}
            primaryUnit={result.primaryUnit}
            breakdowns={result.breakdowns}
          />
        )}

        {/* Medical disclaimer */}
        <div className="mt-4 p-4 rounded-lg bg-amber-50 border border-amber-200 dark:bg-amber-900/20 dark:border-amber-800 text-sm text-amber-700 dark:text-amber-400">
          <strong>免责声明：</strong>本工具提供的计算结果仅供参考，不构成医疗建议。每个人的身体状况不同，如有健康问题或怀孕相关疑问，请咨询专业医生。
        </div>

        <SeoSection
          title="周期计算器 — 在线推算经期与预产期"
          description="免费在线周期计算器，根据末次月经日期和周期长度，推算下次经期日期、排卵期窗口和预产期。结果仅供参考，请咨询专业医生获得准确诊断。"
          faqs={seoFaqs}
        />

        <Footer />
      </div>
    </>
  );
}
