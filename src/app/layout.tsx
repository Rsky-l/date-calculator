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
      <body className="min-h-screen flex flex-col font-sans antialiased">
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
