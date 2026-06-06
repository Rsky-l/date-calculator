# Date Calculator Website — Design Spec

**Date:** 2026-06-06
**Status:** Approved

---

## Overview

A comprehensive date calculator tool website built as an SEO-driven passive income tool site. Users can perform various date calculations with a clean, instant-response interface.

**Stack:** Next.js (SSG) + Tailwind CSS + Vercel hosting
**Target Users:** General public who need date calculations (developers, office workers, students, expecting parents, etc.)
**Monetization:** Google AdSense (short-term) → Mediavine/Ezoic (mid-term) → affiliate links (long-term)

---

## Visual Design

### Color Scheme
- **Primary background:** White (#ffffff) 
- **Card background:** Slate-50 (#f8fafc)
- **Card border:** Slate-200 (#e2e8f0)
- **Accent/CTA:** Blue-600 (#2563eb)
- **Text primary:** Slate-900 (#0f172a)
- **Text secondary:** Slate-500 (#64748b)
- **Text muted:** Slate-400 (#94a3b8)

### Dark Mode
- Toggle button in header (sun/moon icon)
- Persist preference in localStorage
- Dark scheme: #0f172a body, #1e293b cards, #38bdf8 accent

### Typography
- System font stack: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
- No external font loading for maximum speed
- Sizes: 11px (micro), 12-13px (body), 14-16px (subtitle), 18-20px (heading), 28-36px (result)

### Spacing & Rounding
- Generous whitespace throughout
- Card border-radius: 8-12px
- Button/chip border-radius: 20px (pills), 10px (CTA buttons)

---

## Site Architecture

### URL Structure
```
/                       → Homepage (tool grid)
/date-diff              → Date difference calculator
/date-add-sub           → Date add/subtract calculator
/workdays               → Working days calculator
/age                    → Age calculator
/countdown              → Countdown timer
/cycle                  → Period/cycle calculator
/lunar                  → Lunar calendar converter
```

### Page Structure

#### Homepage (`/`)
- **Header:** Logo "📅 日期计算器" + tagline + dark mode toggle
- **Body:** 3-column responsive grid of tool cards (2 cols on mobile)
  - Each card: large emoji icon + short name
  - Click navigates to tool page
- **Footer:** Minimal — copyright + privacy link
- **SEO:** Page title, meta description, intro text (200+ words), FAQ structured data

#### Tool Pages (6 individual pages)
Each tool page follows this layout:

1. **Top navigation bar:**
   - "←" back-to-home link
   - Horizontal scrollable pill tabs for all tools (current tool highlighted)
   - Dark mode toggle

2. **Calculator area (instant response):**
   - Input fields change → result updates immediately (no submit button)
   - Date inputs: native `<input type="date">` or custom date picker
   - Main result: large prominent number + unit
   - Secondary results: multi-perspective breakdown cards (weeks/months/hours/minutes)

3. **SEO content section (below calculator):**
   - 300+ words explaining the tool and use cases
   - FAQ with structured data (JSON-LD)
   - Internal links to related tools

---

## Individual Tool Specifications

### 1. Date Difference (`/date-diff`)
- **Inputs:** Start date, End date (date pickers)
- **Outputs:**
  - Total days (primary, large)
  - Breakdown: X years Y months Z days / X weeks Y days / X hours / X minutes
- **Edge cases:** Same day = 0 days; end before start = negative result with clear indication

### 2. Date Add/Subtract (`/date-add-sub`)
- **Inputs:** Base date, operation (+ or -), number, unit (days/weeks/months/years)
- **Outputs:** Result date, day of week, breakdown
- **Edge cases:** Month-end rollover (Jan 31 + 1 month → Feb 28/29)

### 3. Working Days (`/workdays`)
- **Inputs:** Start date, End date, weekend definition (Sat-Sun default)
- **Outputs:** Total calendar days, working days, weekend days
- **Future:** Holiday exclusion (require a holiday data source)

### 4. Age Calculator (`/age`)
- **Inputs:** Birth date, reference date (defaults to today)
- **Outputs:** Age in years/months/days, total days lived, next birthday countdown
- **Bonus:** Zodiac sign (Eastern + Western)

### 5. Countdown (`/countdown`)
- **Inputs:** Target date, event name (optional)
- **Outputs:** Days/hours/minutes/seconds remaining (live updating), percentage of year elapsed/remaining
- **Persistence:** Option to save countdown in localStorage

### 6. Cycle Calculator (`/cycle`)
- **Inputs:** Last period date, cycle length (default 28 days)
- **Outputs:** Next period date, ovulation window, estimated due date (if pregnancy)
- **Disclaimer:** Medical disclaimer text (SEO liability protection)

### 7. Lunar Calendar (`/lunar`)
- **Inputs:** Gregorian date
- **Outputs:** Lunar date (year/month/day), zodiac year (生肖), solar term if applicable
- **Reverse:** Lunar → Gregorian conversion
- **Data:** Static lunar lookup table (covers 1900-2100)

---

## Component Architecture

### Layout Components
```
Layout (shared shell)
├── Header (Logo + tagline + dark toggle, only on tool pages)
├── TabNav (horizontal scrollable pill tabs)
│   └── TabItem (emoji + label, active state)
├── PageContent (max-w-3xl mx-auto px-4)
└── Footer (minimal)
```

### Calculator Components (per tool)
```
DateDiffPage
├── TabNav
├── DateInput (date picker, controlled)
├── ResultDisplay
│   ├── PrimaryResult (large number + unit)
│   └── BreakdownCards (grid of small cards: weeks, months, hours, etc.)
└── SeoSection
    ├── ExplanationText
    └── FaqAccordion (structured data)
```

### Shared UI Components
```
- DateInput: styled native date input or custom picker
- ResultCard: colored background card with icon + value
- PillTab: horizontal scroll capsule buttons
- DarkToggle: sun/moon icon button
- SeoSection: reusable prose content block
- FaqItem: collapsible Q&A with JSON-LD schema
```

---

## Data Flow

### Instant Response Pattern
```
1. User changes any input
2. useState updates input value
3. useMemo / useCallback triggers recalculation
4. Result components re-render with new values
5. No loading state needed (pure computation, <1ms)
```

### Dark Mode
```
1. On mount: read localStorage('theme') or system preference
2. Toggle: add/remove 'dark' class on <html>
3. Persist: write to localStorage on change
4. Tailwind: use 'dark:' variant throughout
```

### SEO Content
```
- Static content rendered at build time (SSG)
- JSON-LD structured data per page
- FAQ schema for each tool page
- Sitemap generated at build time via next-sitemap
```

---

## SEO Strategy

### On-Page
- Each tool has unique `<title>` and `<meta description>`
- H1 on homepage, H2 for tool titles
- 300+ words of unique content below each calculator
- FAQ section with HowTo/FAQ schema markup
- Internal links between related tools
- Image alt text, semantic HTML

### Technical
- Next.js Static Site Generation (SSG) — fast, SEO-friendly
- Sitemap.xml auto-generated
- robots.txt allowing all crawling
- Core Web Vitals optimized: no heavy JS, no external fonts, minimal CSS
- Mobile-friendly (responsive Tailwind)

### Content Strategy
1. **Launch (Month 0):** All 7 tools live, basic SEO content on each page
2. **Growth (Month 1-3):** Add blog section with date-related articles
3. **Mature (Month 3-6):** Add more tools based on Search Console data

---

## Non-Functional Requirements

### Performance
- Lighthouse score target: 95+ (Performance), 100 (SEO), 90+ (Accessibility)
- First Contentful Paint < 1.5s
- Time to Interactive < 2s
- Total page weight < 100KB (excluding ads)

### Accessibility
- Semantic HTML (landmarks, headings hierarchy)
- Keyboard navigable
- Focus indicators visible
- Sufficient color contrast (WCAG AA)
- Screen reader friendly labels

### Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge — last 2 versions)
- Mobile Safari and Chrome
- IE not supported

### Analytics
- Google Analytics or Plausible (privacy-friendly)
- Google Search Console integration
- Track: page views, tool usage, time on page, bounce rate

---

## Development Roadmap

### Phase 1: MVP (Week 1-2)
- [ ] Project scaffold (Next.js + Tailwind + TypeScript)
- [ ] Layout shell: Header, TabNav, Footer, dark mode
- [ ] Homepage with tool grid
- [ ] Date Diff calculator page
- [ ] Date Add/Subtract calculator page
- [ ] Deploy to Vercel (staging)

### Phase 2: Core Tools (Week 2-3)
- [ ] Working Days calculator
- [ ] Age calculator
- [ ] Countdown timer
- [ ] SEO content for first 5 pages
- [ ] Sitemap, robots.txt, meta tags
- [ ] Analytics integration

### Phase 3: Extended Tools (Week 3-4)
- [ ] Cycle calculator
- [ ] Lunar calendar converter (with lookup table)
- [ ] Complete SEO content for all pages
- [ ] FAQ schema for all pages
- [ ] Polish & Lighthouse audit
- [ ] Production launch

### Phase 4: Growth (Month 2+)
- [ ] Blog section (/blog)
- [ ] Additional tools based on data
- [ ] Holiday data for workday calculator
- [ ] AdSense integration
- [ ] Performance optimization based on real-user data
