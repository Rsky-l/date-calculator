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
