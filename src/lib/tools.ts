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
