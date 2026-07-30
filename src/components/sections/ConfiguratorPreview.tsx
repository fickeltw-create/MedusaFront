'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import { ArrowRight, Palette, Home, Zap, Wind } from 'lucide-react';
import { formatPrice, HOUSES } from '@/lib/houses';

export default function ConfiguratorPreview() {
  const { t } = useI18n();
  const [visible, setVisible] = useState(false);
  const [selectedModel, setSelectedModel] = useState(0);
  const currentHouse = HOUSES[selectedModel];
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="section-padding bg-[#0F172A] overflow-hidden" ref={ref}>
      <div className="container-wide">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Text */}
          <div className={`transition-all duration-700 ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
            <span className="label-badge bg-white/10 text-white/70 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
              {t.configurator.title}
            </span>
            <h2 className="font-syne font-bold text-3xl md:text-4xl lg:text-5xl text-white mb-6 leading-tight">
              {t.configurator.title}
            </h2>
            <p className="text-white/60 text-base leading-relaxed mb-8">
              {t.configurator.subtitle}
            </p>

            {/* Options Preview */}
            <div className="space-y-4 mb-8">
              {[
                { icon: Palette, label: 'Nos modèles :', value: `${HOUSES.length} modèles` },
                { icon: Home, label: t.configurator.roof, value: '3 types' },
                { icon: Zap, label: t.configurator.energy, value: '4 kits' },
                { icon: Wind, label: t.configurator.climate, value: '3 systèmes' },
              ].map((opt, i) => {
                const Icon = opt.icon;
                return (
                  <div key={i} className="flex items-center gap-4 bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="w-10 h-10 bg-[#2563EB]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon size={18} className="text-[#2563EB]" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium">{opt.label}</p>
                    </div>
                    <span className="text-white/40 text-xs">{opt.value}</span>
                  </div>
                );
              })}
            </div>

            <Link
              href="/configurateur"
              className="inline-flex items-center gap-2 bg-[#2563EB] text-white px-7 py-3.5 rounded-xl font-semibold text-sm hover:bg-[#1D4ED8] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/20 group"
            >
              {t.configurator.title}
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Right: Interactive Preview */}
          <div className={`transition-all duration-700 delay-200 ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
            {/* House Preview */}
            <div className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 overflow-hidden">
              {/* Image */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={currentHouse.images[1]}
                  alt={t.models[currentHouse.key]?.name || 'House preview'}
                  className="w-full h-full object-cover transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/60 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <span className="text-white/80 text-xs">{t.models[currentHouse.key]?.name || 'Maison'} · {currentHouse.size} m²</span>
                </div>
              </div>

              {/* Controls */}
              <div className="p-5">
                <p className="text-white/50 text-xs font-medium uppercase tracking-wider mb-3">Nos modèles :</p>
                <div className="flex items-center gap-2 mb-5">
                  {HOUSES.map((house, i) => (
                    <button
                      key={house.slug}
                      onClick={() => setSelectedModel(i)}
                      title={t.models[house.key]?.name || 'Model'}
                      className={`w-8 h-8 rounded-full border-2 transition-all duration-200 hover:scale-110 overflow-hidden ${
                        selectedModel === i ? 'ring-2 ring-[#2563EB] ring-offset-2 ring-offset-[#0F172A] scale-110' : 'border-transparent'
                      }`}
                    >
                      <img src={house.images[1]} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                  <span className="text-white/40 text-xs ml-2">{t.models[currentHouse.key]?.name || 'Modèle'}</span>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <div>
                    <p className="text-white/40 text-xs">{t.configurator.total}</p>
                    <p className="font-syne font-bold text-2xl text-white">{formatPrice(currentHouse.price)}</p>
                  </div>
                  <Link
                    href="/configurateur"
                    className="text-xs text-[#2563EB] font-semibold hover:underline flex items-center gap-1"
                  >
                    {t.configurator.getQuote} <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}