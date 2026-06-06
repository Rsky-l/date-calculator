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
