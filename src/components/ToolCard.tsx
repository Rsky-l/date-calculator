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
