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
