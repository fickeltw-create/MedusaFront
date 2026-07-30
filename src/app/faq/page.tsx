'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useI18n } from '@/lib/i18n';
import { ChevronDown, Search, MessageCircle } from 'lucide-react';
import Link from 'next/link';



export default function FAQPage() {
  const { t } = useI18n();
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [search, setSearch] = useState('');
  const categories = Object.entries(t.faq.filters);
  const [category, setCategory] = useState(t.faq.filters.all);

  const filtered = t.faq.items.filter((item) =>
    search === '' ||
    item.q.toLowerCase().includes(search.toLowerCase()) ||
    item.a.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="bg-[#0F172A] pt-28 pb-20">
        <div className="container-wide text-center max-w-3xl mx-auto">
          <span className="label-badge bg-white/10 text-white/60 mb-4">FAQ</span>
          <h1 className="font-syne font-bold text-4xl md:text-5xl lg:text-6xl text-white mb-4">{t.faq.title}</h1>
          <p className="text-white/60 text-lg mb-8">{t.faq.subtitle}</p>
          {/* Search */}
          <div className="relative max-w-lg mx-auto">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={t.faq.search || "Rechercher une question..."}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/40 pl-11 pr-4 py-3.5 rounded-2xl text-sm focus:outline-none focus:bg-white/15 focus:border-white/30 transition-all"
            />
          </div>
        </div>
      </section>

      {/* Categories */}
      <div className="bg-white border-b border-gray-100 sticky top-16 z-30">
        <div className="container-wide py-4">
          <div className="flex items-center gap-2 overflow-x-auto">
            {categories.map(([key, cat]) => (
              <button
                key={key}
                onClick={() => setCategory(cat as string)}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  category === cat
                    ? 'bg-[#0F172A] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Accordion */}
      <section className="py-16">
        <div className="container-wide max-w-3xl">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <Search size={40} className="mx-auto mb-3 opacity-30" />
              <p>Aucun résultat pour « {search} »</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((item, i) => (
                <div
                  key={i}
                  className={`rounded-2xl border overflow-hidden transition-all duration-300 ${
                    openIndex === i
                      ? 'border-[#2563EB]/30 shadow-md bg-white'
                      : 'border-gray-100 bg-[#F8FAFC] hover:border-gray-200'
                  }`}
                >
                  <button
                    onClick={() => setOpenIndex(openIndex === i ? null : i)}
                    className="w-full flex items-center justify-between p-5 text-left"
                  >
                    <span className={`font-semibold text-sm pr-4 leading-snug transition-colors ${
                      openIndex === i ? 'text-[#2563EB]' : 'text-[#0F172A]'
                    }`}>
                      {item.q}
                    </span>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                      openIndex === i ? 'bg-[#2563EB] text-white rotate-180' : 'bg-white text-gray-400 border border-gray-200'
                    }`}>
                      <ChevronDown size={15} />
                    </div>
                  </button>
                  {openIndex === i && (
                    <div className="px-5 pb-5 pt-0">
                      <p className="text-[#6B7280] text-sm leading-relaxed">{item.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* CTA */}
          <div className="mt-12 bg-[#0F172A] rounded-3xl p-8 text-center">
            <MessageCircle size={28} className="text-[#2563EB] mx-auto mb-3" />
            <h3 className="font-syne font-bold text-xl text-white mb-2">{t.faq.noAnswer}</h3>
            <p className="text-white/60 text-sm mb-5">{t.faq.contactTeam}</p>
            <Link href="/contact" className="btn-primary">
              {t.faq.contactUs}
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}