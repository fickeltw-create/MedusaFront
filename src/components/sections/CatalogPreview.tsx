'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import { HOUSES, formatPrice } from '@/lib/houses';
import { ArrowRight, Maximize2 } from 'lucide-react';

export default function CatalogPreview() {
  const { t } = useI18n();
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.05 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const preview = HOUSES.slice(0, 3);

  return (
    <section className="section-padding bg-white" ref={ref}>
      <div className="container-wide">
        <div className={`mb-12 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <span className="label-badge bg-blue-50 text-[#2563EB] mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
            {t.catalog.previewBadge}
          </span>
          <h2 className="font-syne font-bold text-3xl md:text-4xl lg:text-5xl text-[#0F172A]">
            {t.catalog.previewTitle}
          </h2>
          <p className="text-[#6B7280] text-base mt-2 max-w-2xl">
            {t.catalog.catalogSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {preview.map((house, i) => {
            const model = t.models[house.key];
            return (
              <Link
                key={house.slug}
                href={`/catalogue/${house.slug}`}
                className={`group block bg-white rounded-[1.5rem] overflow-hidden shadow-premium card-hover border border-gray-100 transition-all duration-700 ${
                  visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="relative h-72 overflow-hidden bg-gradient-to-b from-[#EAF0F8] to-[#F5F8FC]">
                  {house.badge && (
                    <span className="absolute top-3 left-3 z-10 label-badge bg-[#2563EB] text-white text-xs">
                      {house.badge}
                    </span>
                  )}
                  {house.isNew && (
                    <span className="absolute top-3 right-3 z-10 label-badge bg-green-500 text-white text-xs">{t.catalog.newLabel}</span>
                  )}
                  <img src={house.image} alt={model.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-black/30 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-lg opacity-90">
                    <Maximize2 size={10} />{house.size} m²
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="font-syne font-bold text-lg text-[#0F172A] mb-1">{model.name}</h3>
                  <p className="text-[#6B7280] text-sm mb-4 line-clamp-2">{model.tagline}</p>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {model.features.slice(0, 3).map((f: string, fi: number) => (
                      <span key={fi} className="text-xs bg-gray-50 text-gray-600 px-2.5 py-1 rounded-lg border border-gray-100">
                        {f}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-end justify-between pt-4 border-t border-gray-100">
                    <div>
                      <p className="text-xs text-gray-400 line-through">{formatPrice(house.marketPrice)}</p>
                      <p className="font-syne font-bold text-xl text-[#0F172A]">{formatPrice(house.price)}</p>
                      <p className="text-xs text-[#6B7280]">{formatPrice(house.monthlyPayment)}{t.catalog.perMonth}</p>
                    </div>
                    <div className="text-right">
                      <span className="label-badge bg-green-50 text-green-700 text-xs">
                        -{house.discount}%
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className={`mt-12 transition-all duration-700 delay-400 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            <div className="col-span-full flex justify-center">
              <Link
                href="/catalogue"
                className="btn-primary group"
              >
                {t.catalog.exploreModels}
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
