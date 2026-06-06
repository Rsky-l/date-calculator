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
