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
