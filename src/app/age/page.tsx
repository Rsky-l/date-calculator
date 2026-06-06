"use client";

import { useState, useMemo } from "react";
import { parseDate, todayStr, dateDiffBreakdown, daysBetween } from "@/lib/date-utils";
import Header from "@/components/Header";
import TabNav from "@/components/TabNav";
import Footer from "@/components/Footer";
import DateInput from "@/components/DateInput";
import ResultDisplay from "@/components/ResultDisplay";
import SeoSection from "@/components/SeoSection";

function chineseZodiac(year: number): string {
  const animals = ["鼠", "牛", "虎", "兔", "龙", "蛇", "马", "羊", "猴", "鸡", "狗", "猪"];
  return animals[(year - 4) % 12];
}

function westernZodiac(month: number, day: number): { sign: string; emoji: string } {
  const signs = [
    { sign: "摩羯座", emoji: "♑", end: [1, 19] },
    { sign: "水瓶座", emoji: "♒", end: [2, 18] },
    { sign: "双鱼座", emoji: "♓", end: [3, 20] },
    { sign: "白羊座", emoji: "♈", end: [4, 19] },
    { sign: "金牛座", emoji: "♉", end: [5, 20] },
    { sign: "双子座", emoji: "♊", end: [6, 21] },
    { sign: "巨蟹座", emoji: "♋", end: [7, 22] },
    { sign: "狮子座", emoji: "♌", end: [8, 22] },
    { sign: "处女座", emoji: "♍", end: [9, 22] },
    { sign: "天秤座", emoji: "♎", end: [10, 23] },
    { sign: "天蝎座", emoji: "♏", end: [11, 22] },
    { sign: "射手座", emoji: "♐", end: [12, 21] },
    { sign: "摩羯座", emoji: "♑", end: [12, 31] },
  ];
  for (const s of signs) {
    if (month < s.end[0] || (month === s.end[0] && day <= s.end[1])) {
      return s;
    }
  }
  return signs[0];
}

function daysUntilNextBirthday(birthDate: Date, today: Date): number {
  const nextBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
  if (nextBirthday < today) {
    nextBirthday.setFullYear(nextBirthday.getFullYear() + 1);
  }
  return daysBetween(today, nextBirthday);
}

export default function AgePage() {
  const [birthDate, setBirthDate] = useState("2000-01-01");
  const [referenceDate, setReferenceDate] = useState(todayStr());

  const result = useMemo(() => {
    const birth = parseDate(birthDate);
    const ref = parseDate(referenceDate);
    if (isNaN(birth.getTime()) || isNaN(ref.getTime())) return null;
    if (ref < birth) return null;

    const diff = dateDiffBreakdown(birth, ref);
    const totalDays = diff.totalDays;
    const nextBirthdayDays = daysUntilNextBirthday(birth, ref);
    const birthYear = birth.getFullYear();
    const zodiac = chineseZodiac(birthYear);
    const western = westernZodiac(birth.getMonth() + 1, birth.getDate());

    return {
      primaryValue: `${diff.years}`,
      primaryUnit: "岁",
      breakdowns: [
        { label: "年/月/日", value: `${diff.years}年${diff.months}月${diff.remainingDays}日`, unit: "", color: "blue" as const },
        { label: "总生存天数", value: totalDays, unit: "天", color: "green" as const },
        { label: "下次生日", value: nextBirthdayDays, unit: "天后", color: "amber" as const },
        { label: "生肖", value: zodiac, unit: "", color: "pink" as const },
        { label: "星座", value: `${western.emoji} ${western.sign}`, unit: "", color: "blue" as const },
      ],
    };
  }, [birthDate, referenceDate]);

  const seoFaqs = [
    {
      question: "如何计算自己的精确年龄？",
      answer: "输入出生日期，页面会自动计算出你的精确年龄（年/月/天）、总生存天数、下次生日倒计时等信息。你也可以选择一个参考日期来计算某个时点的年龄。",
    },
    {
      question: "生肖和星座是怎么计算的？",
      answer: "生肖根据出生年份计算，每12年一个循环（2020年鼠年、2021年牛年……）。星座根据公历出生月日划分，每个星座有固定的日期范围。",
    },
    {
      question: "年龄计算器能用在什么场景？",
      answer: "年龄计算器可以用于计算自己的精确年龄、为孩子计算年龄（适用于入托入学）、宠物年龄、合同年龄计算等各种需要精确到天数的年龄计算。",
    },
  ];

  return (
    <>
      <Header />
      <TabNav currentSlug="age" />

      <div className="max-w-3xl mx-auto px-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6">🎂 年龄计算</h2>

        {result === null && birthDate && referenceDate && parseDate(birthDate) > parseDate(referenceDate) ? (
          <div className="mb-4 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
            出生日期不能晚于参考日期，请重新选择。
          </div>
        ) : null}

        <div className="flex gap-3 mb-4">
          <DateInput label="出生日期" value={birthDate} onChange={setBirthDate} />
          <div className="flex items-end pb-2.5 text-slate-400 dark:text-slate-500 text-lg">→</div>
          <DateInput label="参考日期" value={referenceDate} onChange={setReferenceDate} />
        </div>

        {result && (
          <ResultDisplay
            primaryValue={result.primaryValue}
            primaryUnit={result.primaryUnit}
            breakdowns={result.breakdowns}
          />
        )}

        <SeoSection
          title="年龄计算器 — 在线精确计算年龄（年/月/天）"
          description="免费在线年龄计算器，输入出生日期即可精确计算你的年龄，显示年/月/天的详细结果。同时提供总生存天数、下次生日倒计时、生肖和星座等有趣信息。"
          faqs={seoFaqs}
        />

        <Footer />
      </div>
    </>
  );
}
