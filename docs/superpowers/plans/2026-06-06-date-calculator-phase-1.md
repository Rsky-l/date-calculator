# Date Calculator Website — Phase 1 MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a working date calculator site with homepage + 2 tools (date-diff, date-add-sub), shared layout with dark mode, deployed to Vercel staging.

**Architecture:** Next.js 14 App Router with Static Site Generation. Pure client-side date computation via `useMemo` — no backend. Shared layout shell (Header with TabNav + Footer) wraps each tool page. All 7 tool tabs visible but only 2 pages implemented in Phase 1.

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS 3, Vercel hosting

---

## File Map

```
date-calculator/
├── src/
│   ├── app/
│   │   ├── layout.tsx              Root layout — HTML shell, dark mode script, metadata
│   │   ├── page.tsx                Homepage — 3-col grid of ToolCards
│   │   ├── globals.css             Tailwind directives + base layer custom styles
│   │   ├── date-diff/
│   │   │   └── page.tsx            Date Difference calculator page
│   │   └── date-add-sub/
│   │       └── page.tsx            Date Add/Subtract calculator page
│   ├── components/
│   │   ├── Header.tsx              Logo + tagline + DarkToggle (tool pages only)
│   │   ├── Footer.tsx              Minimal copyright footer
│   │   ├── DarkToggle.tsx          Sun/moon icon button, persists to localStorage
│   │   ├── TabNav.tsx              Horizontal scrollable pill tabs (all 7 tools)
│   │   ├── ToolCard.tsx            Icon + name card for homepage grid
│   │   ├── DateInput.tsx           Styled native date input with label
│   │   ├── ResultDisplay.tsx       Primary large result + breakdown grid cards
│   │   └── SeoSection.tsx          Tool explanation + FAQ accordion
│   └── lib/
│       ├── date-utils.ts           Pure date computation functions
│       └── tools.ts                Tool definitions (name, icon, slug, description)
├── tailwind.config.ts
├── next.config.js
├── tsconfig.json
├── package.json
├── postcss.config.js
└── .gitignore
```

**Separation of concerns:**
- `src/lib/` — pure logic, zero JSX, independently testable
- `src/components/` — presentational UI, each file one component
- `src/app/` — Next.js pages, thin wrappers composing components + lib
- Components never import pages; pages import components + lib

---

### Task 1: Project Scaffold

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.js`, `tailwind.config.ts`, `postcss.config.js`, `.gitignore`

- [ ] **Step 1: Create Next.js project**

```bash
cd C:\Users\30354\date-calculator
npx create-next-app@14 . --typescript --tailwind --eslint --app --src-dir --no-import-alias --use-npm
```
Wait for installation (~30-60s).

- [ ] **Step 2: Verify scaffold works**

```bash
npm run dev
```
Open http://localhost:3000 — should show Next.js default page with Tailwind styling. Kill the dev server after confirming.

- [ ] **Step 3: Clean up defaults**

Remove the default content from `src/app/page.tsx` (keep file, clear its return JSX to just `<main></main>`). Delete `src/app/favicon.ico` if present (we'll use emoji favicon via layout).

- [ ] **Step 4: Add .gitignore entries**

Add these lines to `.gitignore`:
```
.superpowers/
node_modules/
.next/
```

- [ ] **Step 5: Commit**

```bash
git init
git add -A
git commit -m "chore: scaffold Next.js 14 + Tailwind + TypeScript"
```

---

### Task 2: Tailwind Config & Global Styles

**Files:**
- Modify: `tailwind.config.ts`
- Modify: `src/app/globals.css`

- [ ] **Step 1: Configure Tailwind with dark mode**

Read `tailwind.config.ts`, then replace its content:

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          '"Helvetica Neue"',
          "Arial",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};
export default config;
```

- [ ] **Step 2: Write global CSS with base layer styles**

Read `src/app/globals.css`, then replace its content:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-white text-slate-900 antialiased;
  }
  .dark body,
  body:has(.dark) {
    background-color: #0f172a;
    color: #f1f5f9;
  }
  html.dark body {
    @apply bg-slate-900 text-slate-100;
  }
}
```

- [ ] **Step 3: Verify styles compile**

```bash
npm run dev
```
Open http://localhost:3000 — page should be white background with no default Next.js content. Kill dev server.

- [ ] **Step 4: Commit**

```bash
git add tailwind.config.ts src/app/globals.css
git commit -m "style: configure Tailwind dark mode and base styles"
```

---

### Task 3: Tool Definitions & Date Utility Library

**Files:**
- Create: `src/lib/tools.ts`
- Create: `src/lib/date-utils.ts`

- [ ] **Step 1: Write tool definitions**

```typescript
// src/lib/tools.ts
export interface Tool {
  slug: string;
  name: string;
  icon: string;
  description: string;
}

export const tools: Tool[] = [
  {
    slug: "date-diff",
    name: "日期差",
    icon: "📆",
    description: "计算两个日期间隔多少天",
  },
  {
    slug: "date-add-sub",
    name: "日期加减",
    icon: "➕",
    description: "某天加减N天后的日期",
  },
  {
    slug: "workdays",
    name: "工作日",
    icon: "🏢",
    description: "计算工作日天数，排除周末",
  },
  {
    slug: "age",
    name: "年龄计算",
    icon: "🎂",
    description: "精确到天的年龄计算",
  },
  {
    slug: "countdown",
    name: "倒计时",
    icon: "⏳",
    description: "距离重要日子还有多久",
  },
  {
    slug: "cycle",
    name: "周期计算",
    icon: "📅",
    description: "经期周期与预产期推算",
  },
  {
    slug: "lunar",
    name: "农历查询",
    icon: "🌙",
    description: "公历农历互转、节气查询",
  },
];
```

- [ ] **Step 2: Write date utility functions**

```typescript
// src/lib/date-utils.ts

/** Difference in days between two dates (can be negative) */
export function daysBetween(a: Date, b: Date): number {
  const ms = b.getTime() - a.getTime();
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

/** Absolute difference in various units */
export function dateDiffBreakdown(start: Date, end: Date) {
  const totalDays = Math.abs(daysBetween(start, end));

  let remaining = totalDays;
  const years = Math.floor(remaining / 365);
  remaining = remaining % 365;
  const months = Math.floor(remaining / 30);
  remaining = remaining % 30;
  const weeks = Math.floor(totalDays / 7);
  const weekRemainder = totalDays % 7;
  const hours = totalDays * 24;
  const minutes = hours * 60;

  const isNegative = daysBetween(start, end) < 0;

  return { totalDays, years, months, remainingDays: remaining, weeks, weekRemainder, hours, minutes, isNegative };
}

/** Add a quantity of a unit to a date */
export function addToDate(date: Date, amount: number, unit: "days" | "weeks" | "months" | "years"): Date {
  const result = new Date(date);
  switch (unit) {
    case "days":
      result.setDate(result.getDate() + amount);
      break;
    case "weeks":
      result.setDate(result.getDate() + amount * 7);
      break;
    case "months":
      result.setMonth(result.getMonth() + amount);
      break;
    case "years":
      result.setFullYear(result.getFullYear() + amount);
      break;
  }
  return result;
}

/** Format a Date as YYYY-MM-DD string (local timezone) */
export function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Parse YYYY-MM-DD as local Date (avoids timezone shift from ISO parsing) */
export function parseDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d);
}

/** Day-of-week name in Chinese */
export function dayOfWeek(date: Date): string {
  const names = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
  return names[date.getDay()];
}

/** Today as YYYY-MM-DD */
export function todayStr(): string {
  return formatDate(new Date());
}
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/tools.ts src/lib/date-utils.ts
git commit -m "feat: add tool definitions and date utility functions"
```

---

### Task 4: DarkToggle Component

**Files:**
- Create: `src/components/DarkToggle.tsx`

- [ ] **Step 1: Write DarkToggle**

```typescript
// src/components/DarkToggle.tsx
"use client";

import { useState, useEffect } from "react";

export default function DarkToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored === "dark" || (!stored && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      setDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    if (next) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }

  return (
    <button
      onClick={toggle}
      aria-label={dark ? "切换到浅色模式" : "切换到深色模式"}
      className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
    >
      {dark ? "☀️" : "🌙"}
    </button>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/DarkToggle.tsx
git commit -m "feat: add dark mode toggle component"
```

---

### Task 5: Header, Footer, TabNav Components

**Files:**
- Create: `src/components/Header.tsx`
- Create: `src/components/Footer.tsx`
- Create: `src/components/TabNav.tsx`

- [ ] **Step 1: Write Header**

```typescript
// src/components/Header.tsx
import DarkToggle from "./DarkToggle";

export default function Header() {
  return (
    <header className="flex items-center justify-between py-4 px-4 max-w-3xl mx-auto">
      <a href="/" className="text-lg font-bold text-slate-900 dark:text-slate-100 no-underline hover:opacity-80 transition-opacity">
        ← 日期计算器
      </a>
      <DarkToggle />
    </header>
  );
}
```

- [ ] **Step 2: Write TabNav**

```typescript
// src/components/TabNav.tsx
"use client";

import { tools, Tool } from "@/lib/tools";

interface TabNavProps {
  currentSlug: string;
}

export default function TabNav({ currentSlug }: TabNavProps) {
  return (
    <nav className="max-w-3xl mx-auto px-4 mb-6 overflow-x-auto" aria-label="工具导航">
      <div className="flex gap-2 pb-2 min-w-max">
        {tools.map((tool: Tool) => {
          const isActive = tool.slug === currentSlug;
          return (
            <a
              key={tool.slug}
              href={`/${tool.slug}`}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors no-underline ${
                isActive
                  ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
              }`}
            >
              <span>{tool.icon}</span>
              <span>{tool.name}</span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}
```

- [ ] **Step 3: Write Footer**

```typescript
// src/components/Footer.tsx
export default function Footer() {
  return (
    <footer className="max-w-3xl mx-auto px-4 py-8 text-center text-xs text-slate-400 dark:text-slate-600">
      <p>© {new Date().getFullYear()} 日期计算器 — 免费在线日期计算工具</p>
    </footer>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add src/components/Header.tsx src/components/Footer.tsx src/components/TabNav.tsx
git commit -m "feat: add Header, Footer, and TabNav layout components"
```

---

### Task 6: ToolCard Component

**Files:**
- Create: `src/components/ToolCard.tsx`

- [ ] **Step 1: Write ToolCard**

```typescript
// src/components/ToolCard.tsx
import Link from "next/link";
import { Tool } from "@/lib/tools";

export default function ToolCard({ tool }: { tool: Tool }) {
  return (
    <Link
      href={`/${tool.slug}`}
      className="block p-5 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-300 hover:shadow-sm dark:bg-slate-800 dark:border-slate-700 dark:hover:border-blue-600 transition-all no-underline text-center group"
    >
      <div className="text-3xl mb-2">{tool.icon}</div>
      <div className="font-semibold text-sm text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
        {tool.name}
      </div>
    </Link>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ToolCard.tsx
git commit -m "feat: add ToolCard component for homepage grid"
```

---

### Task 7: DateInput & ResultDisplay Components

**Files:**
- Create: `src/components/DateInput.tsx`
- Create: `src/components/ResultDisplay.tsx`

- [ ] **Step 1: Write DateInput**

```typescript
// src/components/DateInput.tsx
interface DateInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export default function DateInput({ label, value, onChange }: DateInputProps) {
  return (
    <div className="flex-1">
      <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
        {label}
      </label>
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-800 dark:border-slate-600 dark:text-slate-100 dark:focus:ring-blue-400 transition-colors"
      />
    </div>
  );
}
```

- [ ] **Step 2: Write ResultDisplay**

```typescript
// src/components/ResultDisplay.tsx
interface BreakdownItem {
  label: string;
  value: number | string;
  unit: string;
  color: "blue" | "green" | "amber" | "pink";
}

interface ResultDisplayProps {
  primaryValue: number | string;
  primaryUnit: string;
  breakdowns: BreakdownItem[];
}

const colorMap = {
  blue: "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300",
  green: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300",
  amber: "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300",
  pink: "bg-pink-50 text-pink-700 dark:bg-pink-900/20 dark:text-pink-300",
};

export default function ResultDisplay({ primaryValue, primaryUnit, breakdowns }: ResultDisplayProps) {
  return (
    <div>
      {/* Primary result */}
      <div className="text-center py-6 px-4 rounded-xl bg-slate-50 border border-slate-200 dark:bg-slate-800 dark:border-slate-700 mb-3">
        <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">计算结果</div>
        <div className="text-4xl font-bold text-slate-900 dark:text-slate-100">
          {primaryValue}
          <span className="text-lg font-normal text-slate-500 dark:text-slate-400 ml-1">{primaryUnit}</span>
        </div>
      </div>

      {/* Breakdown grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {breakdowns.map((item, i) => (
          <div key={i} className={`rounded-lg px-3 py-2.5 text-center ${colorMap[item.color]}`}>
            <div className="text-xs opacity-80">{item.label}</div>
            <div className="text-lg font-bold">
              {item.value}
              <span className="text-xs font-normal ml-0.5">{item.unit}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/DateInput.tsx src/components/ResultDisplay.tsx
git commit -m "feat: add DateInput and ResultDisplay shared components"
```

---

### Task 8: SeoSection Component

**Files:**
- Create: `src/components/SeoSection.tsx`

- [ ] **Step 1: Write SeoSection**

```typescript
// src/components/SeoSection.tsx
interface FaqItem {
  question: string;
  answer: string;
}

interface SeoSectionProps {
  title: string;
  description: string;
  faqs: FaqItem[];
}

export default function SeoSection({ title, description, faqs }: SeoSectionProps) {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  };

  return (
    <section className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-800">
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">{title}</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">{description}</p>

      <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200 mb-3">常见问题</h3>
      <dl className="space-y-3">
        {faqs.map((faq, i) => (
          <details key={i} className="group rounded-lg bg-slate-50 dark:bg-slate-800/50 p-4">
            <summary className="text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer list-none">
              {faq.question}
            </summary>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{faq.answer}</p>
          </details>
        ))}
      </dl>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/SeoSection.tsx
git commit -m "feat: add SeoSection component with FAQ structured data"
```

---

### Task 9: Root Layout

**Files:**
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Read current layout.tsx, then replace**

Read `src/app/layout.tsx`, then replace with:

```typescript
// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "日期计算器 — 免费在线日期计算工具",
  description: "日期差计算、日期加减、工作日计算、年龄计算、倒计时、农历查询等一站式日期计算工具，完全免费，即输即算。",
  keywords: "日期计算器,日期差,日期加减,工作日计算,年龄计算,倒计时,农历,在线工具",
  robots: "index, follow",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        {/* Prevent FOUC (flash of unstyled content) for dark mode */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var t = localStorage.getItem('theme');
                  if (t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col font-sans">
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Verify layout renders**

```bash
npm run dev
```
Open http://localhost:3000 — page should be white, no errors in console. Kill dev server.

- [ ] **Step 3: Commit**

```bash
git add src/app/layout.tsx
git commit -m "feat: configure root layout with SEO metadata and dark mode FOUC prevention"
```

---

### Task 10: Homepage

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Read current page.tsx, then replace**

Read `src/app/page.tsx`, then replace with:

```typescript
// src/app/page.tsx
import { tools } from "@/lib/tools";
import ToolCard from "@/components/ToolCard";
import DarkToggle from "@/components/DarkToggle";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <header className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">📅 日期计算器</h1>
        <DarkToggle />
      </header>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">你需要的日期计算，一站搞定</p>

      {/* Tool grid */}
      <div className="grid grid-cols-3 sm:grid-cols-3 gap-3">
        {tools.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </div>

      {/* Intro SEO text */}
      <section className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-800">
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-3">关于日期计算器</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          日期计算器是一个免费的一站式在线日期计算工具平台。无论你需要计算两个日期之间相隔多少天，
          还是想知道某个日期加上N天后的结果，抑或是需要计算工作日的天数、精确到天的年龄、设置重要日子的倒计时——
          这里都能帮你快速搞定。所有工具均为纯前端计算，无需等待服务器响应，输入即出结果，完全免费使用。
        </p>
      </section>

      <Footer />
    </div>
  );
}
```

- [ ] **Step 2: Verify homepage**

```bash
npm run dev
```
Open http://localhost:3000 — should show:
- Title, tagline, dark mode toggle
- 3-column grid with 7 tool cards
- Intro text at bottom
- Clicking a tool card should navigate to `/[slug]` (shows 404 for now — expected)
- Toggle dark mode — page should switch, persist on reload

Kill dev server.

- [ ] **Step 3: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: add homepage with tool grid and dark mode"
```

---

### Task 11: Date Difference Calculator Page

**Files:**
- Create: `src/app/date-diff/page.tsx`

- [ ] **Step 1: Write date-diff page**

```typescript
// src/app/date-diff/page.tsx
"use client";

import { useState, useMemo } from "react";
import { parseDate, todayStr, daysBetween, dateDiffBreakdown } from "@/lib/date-utils";
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
```

- [ ] **Step 2: Verify date-diff page**

```bash
npm run dev
```
Open http://localhost:3000/date-diff — should show:
- Header with back link + dark toggle
- TabNav with "日期差" highlighted
- Two date inputs (start: 2026-01-01, end: today)
- Instant result displaying days + breakdown cards
- Change dates → result updates immediately
- SEO section with 3 FAQ accordions at bottom
- Navigate via TabNav to /date-add-sub → 404 expected

Kill dev server.

- [ ] **Step 3: Commit**

```bash
git add src/app/date-diff/page.tsx
git commit -m "feat: add date difference calculator page"
```

---

### Task 12: Date Add/Subtract Calculator Page

**Files:**
- Create: `src/app/date-add-sub/page.tsx`

- [ ] **Step 1: Write date-add-sub page**

```typescript
// src/app/date-add-sub/page.tsx
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
```

- [ ] **Step 2: Verify date-add-sub page**

```bash
npm run dev
```
Open http://localhost:3000/date-add-sub — should show:
- Header + TabNav with "日期加减" highlighted
- Date input (defaults to today)
- +/- toggle button, amount input (default 30), unit dropdown
- Result: computed date + breakdown cards (星期, 操作, etc.)
- Change any input → result updates immediately
- Test edge case: Jan 31 + 1 month → Feb 28 (or 29 in leap year)
- Navigate to /date-diff via TabNav → should load correctly
- Navigate to unimplemented tools via TabNav → 404 expected

Kill dev server.

- [ ] **Step 3: Commit**

```bash
git add src/app/date-add-sub/page.tsx
git commit -m "feat: add date add/subtract calculator page"
```

---

### Task 13: SEO Metadata for Tool Pages

**Files:**
- Modify: `src/app/date-diff/page.tsx` (add metadata export)
- Modify: `src/app/date-add-sub/page.tsx` (add metadata export)

- [ ] **Step 1: Add metadata to date-diff page**

Read `src/app/date-diff/page.tsx`, add this after the imports (before the component):

```typescript
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "日期差计算 — 在线计算两个日期间隔天数 | 日期计算器",
  description: "免费在线日期差计算器，快速计算两个日期之间相差多少天。同时展示周数、月数、小时数、分钟数换算结果。即输即算，完全免费。",
};
```

- [ ] **Step 2: Add metadata to date-add-sub page**

Read `src/app/date-add-sub/page.tsx`, add this after the imports:

```typescript
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "日期加减计算 — 计算N天/周/月/年后的日期 | 日期计算器",
  description: "免费在线日期加减计算器，计算某个日期加或减N天、N周、N月、N年后的结果日期和星期。即输即算，完全免费。",
};
```

- [ ] **Step 3: Verify metadata**

```bash
npm run dev
```
Open http://localhost:3000/date-diff → view page source → check `<title>` tag shows the custom title. Repeat for /date-add-sub. Kill dev server.

- [ ] **Step 4: Commit**

```bash
git add src/app/date-diff/page.tsx src/app/date-add-sub/page.tsx
git commit -m "seo: add per-page metadata for date-diff and date-add-sub"
```

---

### Task 14: Deploy to Vercel

- [ ] **Step 1: Initialize git and push to GitHub**

```bash
cd C:\Users\30354\date-calculator
git remote add origin <your-github-repo-url>
git branch -M main
git push -u origin main
```

(If you don't have a GitHub repo yet, create one at https://github.com/new named "date-calculator")

- [ ] **Step 2: Deploy to Vercel**

```bash
npx vercel --prod
```

Follow the prompts:
- Log in to Vercel
- Link to the GitHub repo
- Framework: Next.js (auto-detected)
- Build command: `next build` (default)
- Output directory: `.next` (default)

Expected: deployment URL like `https://date-calculator.vercel.app`

- [ ] **Step 3: Verify production deployment**

Open the Vercel deployment URL:
- Homepage renders, tool grid visible
- `/date-diff` works, calculations correct
- `/date-add-sub` works, calculations correct
- Dark mode toggle works, persists on reload
- TabNav switches between implemented tools
- Mobile responsive (test with Chrome DevTools mobile view)

- [ ] **Step 4: Run Lighthouse audit**

In Chrome DevTools → Lighthouse tab:
- Generate report for homepage and each tool page
- Target: Performance 95+, SEO 100, Accessibility 90+
- Fix any issues that drop scores below targets

- [ ] **Step 5: Commit any deployment fixes**

```bash
git add -A
git commit -m "chore: vercel deployment configuration"
git push
```

---

## Phase 1 Complete Checklist

After Task 14, verify all of these before moving to Phase 2:

- [ ] `npm run build` succeeds with no errors
- [ ] Homepage renders 7 tool cards in a responsive grid
- [ ] Dark mode: toggle works, persists on page reload, no FOUC
- [ ] `/date-diff`: two date inputs, instant result with breakdown cards
- [ ] `/date-add-sub`: date input, +/- toggle, amount input, unit dropdown, instant result
- [ ] TabNav switches between implemented pages
- [ ] SEO section with FAQ accordion on both tool pages
- [ ] JSON-LD structured data in page source
- [ ] Mobile-responsive (375px width looks good)
- [ ] Production URL live on Vercel
