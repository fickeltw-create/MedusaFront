'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Clock3, BadgeDollarSign, Leaf, Factory, ShieldCheck, Sparkles } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

const ICONS = [Clock3, BadgeDollarSign, Leaf, Factory, ShieldCheck, Sparkles];

export default function WhyModura() {
  const { t } = useI18n();
  const [visible, setVisible] = useState(false);
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
    <section className="section-padding bg-[#F8FAFC]" ref={ref}>
      <div className="container-wide">
        <div className={`text-center mb-16 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <span className="label-badge bg-[#2563EB]/10 text-[#2563EB] mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
            MODURA
          </span>
          <h2 className="font-syne font-bold text-3xl md:text-4xl lg:text-5xl text-[#0F172A] mb-4">
            {t.why.title}
          </h2>
          <p className="text-[#6B7280] text-lg max-w-2xl mx-auto leading-relaxed">
            {t.why.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {t.why.items.map((item, i) => {
            const Icon = ICONS[i];
            return (
              <div
                key={i}
                className={`bg-white rounded-2xl p-7 shadow-premium card-hover transition-all duration-700 ${
                  visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#2563EB] text-white">
                    <Icon size={18} />
                  </div>
                  <div className="h-8 w-px bg-gray-200" />
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#2563EB]/30 text-sm font-semibold text-[#2563EB]">
                    0{i + 1}
                  </div>
                </div>
                <h3 className="font-syne font-bold text-lg text-[#0F172A] mb-2">{item.title}</h3>
                <p className="text-[#6B7280] text-sm leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
