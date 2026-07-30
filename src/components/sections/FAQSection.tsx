'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import { ChevronDown, ArrowRight } from 'lucide-react';

export default function FAQSection() {
  const { t } = useI18n();
  const [visible, setVisible] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const preview = t.faq.items.slice(0, 5);

  return (
    <section className="section-padding bg-white" ref={ref}>
      <div className="container-wide">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className={`text-center mb-12 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <span className="label-badge bg-blue-50 text-[#2563EB] mb-4">FAQ</span>
            <h2 className="font-syne font-bold text-3xl md:text-4xl text-[#0F172A] mb-3">
              {t.faq.title}
            </h2>
            <p className="text-[#6B7280] text-base">{t.faq.subtitle}</p>
          </div>

          {/* Accordion */}
          <div className={`space-y-3 transition-all duration-700 delay-200 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {preview.map((item, i) => (
              <div
                key={i}
                className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
                  openIndex === i ? 'border-[#2563EB]/30 shadow-md' : 'border-gray-100 hover:border-gray-200'
                }`}
              >
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <span className={`font-semibold text-sm pr-4 transition-colors ${openIndex === i ? 'text-[#2563EB]' : 'text-[#0F172A]'}`}>
                    {item.q}
                  </span>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                    openIndex === i ? 'bg-[#2563EB] text-white rotate-180' : 'bg-gray-100 text-gray-500'
                  }`}>
                    <ChevronDown size={14} />
                  </div>
                </button>
                {openIndex === i && (
                  <div className="px-5 pb-5">
                    <p className="text-[#6B7280] text-sm leading-relaxed">{item.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className={`text-center mt-8 transition-all duration-700 delay-400 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <Link href="/faq" className="inline-flex items-center gap-2 text-[#2563EB] font-semibold text-sm hover:gap-3 transition-all duration-200">
              Voir toutes les questions
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
