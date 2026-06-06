"use client";

import { useState, useEffect, useMemo } from "react";
import { parseDate, formatDate } from "@/lib/date-utils";
import Header from "@/components/Header";
import TabNav from "@/components/TabNav";
import Footer from "@/components/Footer";
import DateInput from "@/components/DateInput";
import ResultDisplay from "@/components/ResultDisplay";
import SeoSection from "@/components/SeoSection";

export default function CountdownPage() {
  const [targetDate, setTargetDate] = useState("2027-01-01");
  const [eventName, setEventName] = useState("");
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const result = useMemo(() => {
    const target = parseDate(targetDate);
    if (isNaN(target.getTime())) return null;

    const diffMs = target.getTime() - now.getTime();
    if (diffMs <= 0) {
      return {
        expired: true,
        primaryValue: "已过期",
        primaryUnit: "",
        breakdowns: [
          { label: "状态", value: "已到达或已过期", unit: "", color: "amber" as const },
          { label: "目标日期", value: formatDate(target), unit: "", color: "blue" as const },
          { label: "当前时间", value: now.toLocaleString("zh-CN"), unit: "", color: "pink" as const },
        ],
      };
    }

    const totalSeconds = Math.floor(diffMs / 1000);
    const days = Math.floor(totalSeconds / (24 * 60 * 60));
    const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
    const seconds = totalSeconds % 60;

    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const endOfYear = new Date(now.getFullYear(), 11, 31, 23, 59, 59);
    const yearProgress = ((now.getTime() - startOfYear.getTime()) / (endOfYear.getTime() - startOfYear.getTime())) * 100;
    const weeksRemaining = Math.floor(days / 7);

    return {
      expired: false,
      displayDays: days,
      displayHours: hours,
      displayMinutes: minutes,
      displaySeconds: seconds,
      primaryValue: `${days}`,
      primaryUnit: "天",
      breakdowns: [
        { label: "天", value: days, unit: "天", color: "blue" as const },
        { label: "小时", value: hours, unit: "时", color: "green" as const },
        { label: "分钟", value: minutes, unit: "分", color: "amber" as const },
        { label: "秒", value: seconds, unit: "秒", color: "pink" as const },
        { label: "剩余周数", value: weeksRemaining, unit: "周", color: "blue" as const },
        { label: "年度进度", value: yearProgress.toFixed(1), unit: "%", color: "green" as const },
      ],
    };
  }, [targetDate, now]);

  const seoFaqs = [
    {
      question: "如何设置倒计时？",
      answer: "选择目标日期并可选输入事件名称，页面会自动实时显示距离该日期还有多少天、小时、分钟和秒。倒计时每秒自动更新。",
    },
    {
      question: "倒计时可以计算哪些场景？",
      answer: "可以用于计算距离生日、纪念日、假期、考试日、项目截止日、奥运会、春节等各种重要日子的剩余时间。",
    },
    {
      question: "倒计时的结果会实时更新吗？",
      answer: "是的，倒计时结果会每秒自动更新，实时显示剩余的天数、小时数、分钟数和秒数，让你随时掌握最新剩余时间。",
    },
  ];

  return (
    <>
      <Header />
      <TabNav currentSlug="countdown" />

      <div className="max-w-3xl mx-auto px-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6">⏳ 倒计时</h2>

        <div className="space-y-3 mb-4">
          <DateInput label="目标日期" value={targetDate} onChange={setTargetDate} />
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
              事件名称（可选）
            </label>
            <input
              type="text"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              placeholder="例如：春节、生日、项目截止日..."
              className="w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-800 dark:border-slate-600 dark:text-slate-100"
            />
          </div>
        </div>

        {result && !result.expired && (
          <>
            {eventName && (
              <div className="text-center mb-3">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  距离 <span className="font-semibold text-slate-700 dark:text-slate-300">{eventName}</span> 还有
                </p>
              </div>
            )}
            <div className="text-center py-6 px-4 rounded-xl bg-slate-50 border border-slate-200 dark:bg-slate-800 dark:border-slate-700 mb-3">
              <div className="flex justify-center gap-4 sm:gap-6">
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100">{result.displayDays}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">天</div>
                </div>
                <div className="text-3xl sm:text-4xl font-bold text-slate-400 dark:text-slate-500">:</div>
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100">{String(result.displayHours).padStart(2, "0")}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">时</div>
                </div>
                <div className="text-3xl sm:text-4xl font-bold text-slate-400 dark:text-slate-500">:</div>
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100">{String(result.displayMinutes).padStart(2, "0")}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">分</div>
                </div>
                <div className="text-3xl sm:text-4xl font-bold text-slate-400 dark:text-slate-500">:</div>
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100">{String(result.displaySeconds).padStart(2, "0")}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">秒</div>
                </div>
              </div>
            </div>
            <ResultDisplay
              primaryValue={result.primaryValue}
              primaryUnit={result.primaryUnit}
              breakdowns={result.breakdowns}
            />
          </>
        )}

        {result && result.expired && (
          <ResultDisplay
            primaryValue="已过期"
            primaryUnit=""
            breakdowns={result.breakdowns}
          />
        )}

        <SeoSection
          title="倒计时器 — 在线实时倒计时天数计算"
          description="免费在线倒计时工具，设置目标日期即可实时显示剩余天数、小时、分钟和秒。支持自定义事件名称，结果每秒自动更新。适用于生日、纪念日、假期、考试等重要日期的倒计时。"
          faqs={seoFaqs}
        />

        <Footer />
      </div>
    </>
  );
}
