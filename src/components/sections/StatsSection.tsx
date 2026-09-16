'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

export default function StatsSection() {
  const { t } = useI18n();
  const { statsSection } = t;
  
  return (
    <section className="bg-white py-20 border-b border-gray-100">
      <div className="container-wide">
        <div className="rounded-[2rem] border border-gray-200 bg-[#F8FAFC] p-6 sm:p-8 shadow-premium text-center">
          <span className="label-badge bg-[#2563EB]/10 text-[#2563EB] mb-4 inline-flex items-center justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
            {statsSection.badge}
          </span>
          <h2 className="font-syne font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-[#0F172A] mb-4 sm:mb-5 leading-tight mx-auto max-w-4xl">
            {statsSection.title}
          </h2>
          <div className="space-y-4 text-[#4B5563] text-base sm:text-lg leading-relaxed mx-auto max-w-3xl">
            <p>{statsSection.paragraph1}</p>
            <p>{statsSection.paragraph2}</p>
            <p>{statsSection.paragraph3}</p>
            <p>{statsSection.paragraph4}</p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {statsSection.cards.map((card, index: number) => (
              <div key={index} className="rounded-2xl border border-gray-200 bg-white p-5">
                <h3 className="font-semibold text-[#0F172A] mb-1">{card.title}</h3>
                <p className="text-sm text-[#6B7280]">{card.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/catalogue" className="group inline-flex items-center justify-center gap-2 rounded-full border border-[#2563EB]/20 bg-[#2563EB] px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(37,99,235,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#1D4ED8] hover:shadow-[0_14px_34px_rgba(37,99,235,0.24)]">
              {statsSection.exploreModels}
              <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link href="/contact" className="group inline-flex items-center justify-center gap-2 rounded-full border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-[#0F172A] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#2563EB]/40 hover:text-[#2563EB] hover:shadow-sm">
              {statsSection.requestQuote}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}