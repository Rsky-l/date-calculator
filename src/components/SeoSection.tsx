interface FaqItem {
  question: string;
  answer: string;
}

interface SeoSectionProps {
  title: string;
  description: string;
  faqs: FaqItem[];
}

export default function SeoSection({ title, description, faqs }: SeoSectionProps) {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  };

  return (
    <section className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-800">
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">{title}</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">{description}</p>

      <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200 mb-3">常见问题</h3>
      <dl className="space-y-3">
        {faqs.map((faq, i) => (
          <details key={i} className="group rounded-lg bg-slate-50 dark:bg-slate-800/50 p-4">
            <summary className="text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer list-none">
              {faq.question}
            </summary>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{faq.answer}</p>
          </details>
        ))}
      </dl>
    </section>
  );
}
