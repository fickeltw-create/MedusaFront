'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
// static image previews — no 3D viewer or color controls on catalogue
import { useI18n } from '@/lib/i18n';
import { HOUSES, formatPrice } from '@/lib/houses';
import { ArrowRight, Maximize2, SlidersHorizontal, Check } from 'lucide-react';

const FILTERS = ['all', 'small', 'medium', 'large'] as const;
const FILTER_LABELS = (t: any) => ({
  all: t.configurator.sizeFilters.all,
  small: t.configurator.sizeFilters.compact,
  medium: t.configurator.sizeFilters.medium,
  large: t.configurator.sizeFilters.large,
});

// removed DEFAULT_EXTERIOR / DEFAULT_ROOF since colors aren't selectable here

export default function CataloguePage() {
  const { t } = useI18n();
  const [filter, setFilter] = useState<typeof FILTERS[number]>('all');
  const labels = FILTER_LABELS(t);

  const filtered = HOUSES.filter(h => {
    if (filter === 'small')  return h.size <= 20;
    if (filter === 'medium') return h.size > 20 && h.size <= 60;
    if (filter === 'large')  return h.size > 60;
    return true;
  });

  // color swatches removed from catalogue cards

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="bg-[#0F172A] pt-28 pb-16">
        <div className="container-wide">
          <div className="max-w-2xl">
            <span className="label-badge bg-white/10 text-white/60 mb-4"><span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />{t.catalog.catalogTitle}</span>
            <h1 className="font-syne font-bold text-4xl md:text-5xl lg:text-6xl text-white mb-4">{t.catalog.catalogTitle}</h1>
            <p className="text-white/60 text-lg">{t.catalog.catalogSubtitle}</p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-white border-b border-gray-100 sticky top-16 z-30 shadow-sm">
        <div className="container-wide py-4">
          <div className="flex items-center gap-3 overflow-x-auto">
            <SlidersHorizontal size={16} className="text-gray-400 flex-shrink-0" />
            {FILTERS.map((f: typeof FILTERS[number]) => (
              <button key={f} onClick={() => setFilter(f)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${filter === f ? 'bg-[#0F172A] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {filter === f && <Check size={13} />}
                {labels[f]}
              </button>
            ))}
            <div className="ml-auto text-sm text-gray-400 whitespace-nowrap flex-shrink-0">
              {filtered.length} {t.catalog.models}
            </div>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-14">
        <div className="container-wide">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((house) => {
              const model = t.models[house.key];
              return (
                <div key={house.slug} className="group bg-white rounded-2xl overflow-hidden shadow-premium hover:shadow-premium-hover border border-gray-100 transition-all duration-300 hover:-translate-y-1 flex flex-col">
                  {/* SVG House Preview */}
                    <div className="relative bg-gradient-to-b from-[#EAF0F8] to-[#F5F8FC] overflow-hidden">
                    {house.badge && (
                      <span className="absolute top-3 left-3 z-10 label-badge bg-[#2563EB] text-white text-xs">{house.badge}</span>
                    )}
                    {house.isNew && (
                      <span className="absolute top-3 right-3 z-10 label-badge bg-green-500 text-white text-xs">{t.catalog.newLabel}</span>
                    )}
                    <img src={house.image} alt={model.name} className="h-56 w-full object-cover" />
                    {/* Size badge */}
                    <div className="absolute top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-black/30 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                      <Maximize2 size={10} />{house.size} m²
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-syne font-bold text-xl text-[#0F172A]">{model.name}</h3>
                      <span className="label-badge bg-green-50 text-green-700 text-xs flex-shrink-0 ml-2">-{house.discount}%</span>
                    </div>
                    <p className="text-[#6B7280] text-sm mb-4 leading-relaxed">{model.tagline}</p>

                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {model.features.map((f: string, fi: number) => (
                        <span key={fi} className="flex items-center gap-1 text-xs bg-gray-50 text-gray-600 px-2.5 py-1 rounded-lg border border-gray-100">
                          <Check size={10} className="text-green-500" />{f}
                        </span>
                      ))}
                    </div>

                    {/* Pricing */}
                    <div className="bg-[#F8FAFC] rounded-xl p-4 mb-4 mt-auto">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs text-gray-400">{t.catalog.marketPriceLabel}</span>
                        <span className="text-sm text-gray-400 line-through">{formatPrice(house.marketPrice)}</span>
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-[#0F172A]">{t.catalog.ourPriceLabel}</span>
                        <span className="font-syne font-bold text-xl text-[#0F172A]">{formatPrice(house.price)}</span>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        <span className="text-xs text-gray-500">Prix catalogue</span>
                        <span className="text-sm font-semibold text-[#2563EB]">{formatPrice(house.price)}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Link href={`/catalogue/${house.slug}`}
                        className="flex-1 btn-dark flex items-center justify-center gap-2 text-sm font-semibold">
                        {t.catalog.discover}
                        <ArrowRight size={14} className="ml-1" />
                      </Link>
                      {/* configurator removed: link intentionally omitted to focus on models */}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#F8FAFC] py-16 border-t border-gray-100">
        <div className="container-wide text-center">
          <h2 className="font-syne font-bold text-3xl text-[#0F172A] mb-3">{t.catalog.boutiqueTitle}</h2>
          <p className="text-[#6B7280] mb-6">{t.catalog.boutiqueSubtitle}</p>
          <Link href="/shop" className="btn-primary group">
            {t.catalog.visitShop} <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}