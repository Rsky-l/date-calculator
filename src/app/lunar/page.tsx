"use client";

import { useState, useMemo } from "react";
import { parseDate } from "@/lib/date-utils";
import Header from "@/components/Header";
import TabNav from "@/components/TabNav";
import Footer from "@/components/Footer";
import DateInput from "@/components/DateInput";
import SeoSection from "@/components/SeoSection";

function chineseZodiac(year: number): string {
  const animals = ["鼠", "牛", "虎", "兔", "龙", "蛇", "马", "羊", "猴", "鸡", "狗", "猪"];
  const stems = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
  const branches = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
  const stemIndex = (year - 4) % 10;
  const branchIndex = (year - 4) % 12;
  return `${stems[stemIndex]}${branches[branchIndex]}年（${animals[branchIndex]}年）`;
}

// Approximate solar terms for 2026 (ISO dates)
const SOLAR_TERMS_2026: { name: string; date: string }[] = [
  { name: "小寒", date: "2026-01-05" },
  { name: "大寒", date: "2026-01-20" },
  { name: "立春", date: "2026-02-04" },
  { name: "雨水", date: "2026-02-19" },
  { name: "惊蛰", date: "2026-03-05" },
  { name: "春分", date: "2026-03-20" },
  { name: "清明", date: "2026-04-05" },
  { name: "谷雨", date: "2026-04-20" },
  { name: "立夏", date: "2026-05-05" },
  { name: "小满", date: "2026-05-21" },
  { name: "芒种", date: "2026-06-05" },
  { name: "夏至", date: "2026-06-21" },
  { name: "小暑", date: "2026-07-07" },
  { name: "大暑", date: "2026-07-23" },
  { name: "立秋", date: "2026-08-07" },
  { name: "处暑", date: "2026-08-23" },
  { name: "白露", date: "2026-09-07" },
  { name: "秋分", date: "2026-09-23" },
  { name: "寒露", date: "2026-10-08" },
  { name: "霜降", date: "2026-10-23" },
  { name: "立冬", date: "2026-11-07" },
  { name: "小雪", date: "2026-11-22" },
  { name: "大雪", date: "2026-12-07" },
  { name: "冬至", date: "2026-12-22" },
];

function findNearbySolarTerm(date: Date): string | null {
  const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  const input = parseDate(dateStr);
  for (const term of SOLAR_TERMS_2026) {
    const termDate = parseDate(term.date);
    const diff = Math.abs(input.getTime() - termDate.getTime()) / (1000 * 60 * 60 * 24);
    if (diff <= 3) {
      return term.name;
    }
  }
  return null;
}

const LUNAR_MONTH_NAMES = ["正月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "冬月", "腊月"];
const LUNAR_DAY_NAMES = ["初一", "初二", "初三", "初四", "初五", "初六", "初七", "初八", "初九", "初十",
  "十一", "十二", "十三", "十四", "十五", "十六", "十七", "十八", "十九", "二十",
  "廿一", "廿二", "廿三", "廿四", "廿五", "廿六", "廿七", "廿八", "廿九", "三十"];

// Simplified lunar date approximation using a known reference point:
// 2026-01-01 (Gregorian) ≈ 农历乙巳年冬月十二 (approximate)
// This provides a rough estimate for display purposes
function approximateLunarDate(date: Date): { year: number; month: number; day: number; monthName: string; dayName: string; leap: boolean } {
  const refDate = new Date(2026, 0, 1); // 2026-01-01
  const refLunarYear = 2025;
  const refLunarMonth = 11; // 冬月
  const refLunarDay = 12;

  const diffDays = Math.round((date.getTime() - refDate.getTime()) / (1000 * 60 * 60 * 24));

  // Simplified: assume lunar year ~ 354 days, lunar month ~ 29.5 days
  let totalDays = refLunarDay - 1 + diffDays;
  let lunarYear = refLunarYear;
  let lunarMonth = refLunarMonth;
  let lunarDay: number;

  // Adjust year
  while (totalDays >= 354) {
    totalDays -= 354;
    lunarYear++;
  }
  while (totalDays < 0) {
    lunarYear--;
    totalDays += 354;
  }

  // Adjust month (approximate)
  if (totalDays < 30) {
    lunarDay = totalDays + 1;
  } else {
    totalDays -= 29;
    lunarMonth++;
    if (lunarMonth > 12) {
      lunarMonth = 1;
      lunarYear++;
    }
    lunarDay = Math.min(totalDays + 1, 30);
  }

  // Bound check
  lunarDay = Math.max(1, Math.min(30, lunarDay));
  const monthName = LUNAR_MONTH_NAMES[(lunarMonth - 1 + 12) % 12];
  const dayName = LUNAR_DAY_NAMES[lunarDay - 1] || `${lunarDay}日`;

  return {
    year: lunarYear,
    month: lunarMonth,
    day: lunarDay,
    monthName,
    dayName,
    leap: false,
  };
}

export default function LunarPage() {
  const [gregorianDate, setGregorianDate] = useState("2026-06-06");

  const result = useMemo(() => {
    const date = parseDate(gregorianDate);
    if (isNaN(date.getTime())) return null;

    const lunar = approximateLunarDate(date);
    const zodiac = chineseZodiac(date.getFullYear());
    const solarTerm = findNearbySolarTerm(date);
    const yearZodiac = chineseZodiac(lunar.year);

    return { lunar, zodiac, solarTerm, yearZodiac, date };
  }, [gregorianDate]);

  const seoFaqs = [
    {
      question: "公历和农历有什么区别？",
      answer: "公历（阳历）以地球绕太阳公转周期为基础，一年约365天。农历（阴历）以月亮绕地球公转周期为基础，一个月约29.5天，一年约354天，因此农历比公历每年少约11天。为了与季节同步，农历会设置闰月。",
    },
    {
      question: "二十四节气是什么？",
      answer: "二十四节气是中国古代根据太阳在黄道上的位置划分的24个时间节点，每个节气约15天。包括立春、雨水、惊蛰、春分、清明、谷雨、立夏、小满、芒种、夏至、小暑、大暑、立秋、处暑、白露、秋分、寒露、霜降、立冬、小雪、大雪、冬至、小寒、大寒。",
    },
    {
      question: "生肖是怎么确定的？",
      answer: "生肖（属相）根据农历年份确定，每12年一个循环。2020年是鼠年，2021年牛年，2022年虎年，2023年兔年，2024年龙年，2025年蛇年，2026年马年。生肖年以农历正月初一为分界。",
    },
  ];

  return (
    <>
      <Header />
      <TabNav currentSlug="lunar" />

      <div className="max-w-3xl mx-auto px-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6">🌙 农历查询</h2>

        <div className="space-y-3 mb-4">
          <DateInput label="公历日期" value={gregorianDate} onChange={setGregorianDate} />
        </div>

        {result && (
          <div className="space-y-3">
            {/* Lunar result card */}
            <div className="text-center py-6 px-4 rounded-xl bg-slate-50 border border-slate-200 dark:bg-slate-800 dark:border-slate-700 mb-3">
              <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">农历日期（参考）</div>
              <div className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                {result.lunar.monthName} {result.lunar.dayName}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                农历{result.lunar.year}年 · {result.yearZodiac}
              </div>
              <div className="mt-2 text-xs text-amber-600 dark:text-amber-400">
                * 农历日期为近似值，仅供参考
              </div>
            </div>

            {/* Zodiac and solar term cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="rounded-lg px-3 py-2.5 text-center bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
                <div className="text-xs opacity-80">公历年生肖</div>
                <div className="text-lg font-bold">{result.zodiac}</div>
              </div>
              <div className="rounded-lg px-3 py-2.5 text-center bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300">
                <div className="text-xs opacity-80">农历年干支</div>
                <div className="text-lg font-bold">{result.yearZodiac}</div>
              </div>
            </div>

            {result.solarTerm && (
              <div className="rounded-lg px-3 py-2.5 text-center bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300">
                <div className="text-xs opacity-80">临近节气</div>
                <div className="text-lg font-bold">{result.solarTerm}</div>
              </div>
            )}

            {/* 24 Solar Terms reference */}
            <details className="group rounded-lg bg-slate-50 dark:bg-slate-800/50 p-4">
              <summary className="text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer list-none">
                2026年二十四节气表
              </summary>
              <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                {SOLAR_TERMS_2026.map((term) => (
                  <div key={term.name} className="text-xs text-slate-600 dark:text-slate-400">
                    <span className="font-medium text-slate-700 dark:text-slate-300">{term.name}</span> {term.date.slice(5)}
                  </div>
                ))}
              </div>
            </details>
          </div>
        )}

        <SeoSection
          title="农历查询 — 公历农历互转与二十四节气查询"
          description="免费在线农历查询工具，输入公历日期即可查询对应的农历日期、干支纪年、生肖属相，以及临近的二十四节气。帮助了解中国传统历法文化。"
          faqs={seoFaqs}
        />

        <Footer />
      </div>
    </>
  );
}
