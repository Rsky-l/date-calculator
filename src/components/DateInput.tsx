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
