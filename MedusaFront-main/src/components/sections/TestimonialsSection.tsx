'use client';

import { useEffect, useRef, useState } from 'react';
import { useI18n } from '@/lib/i18n';
import { Star, Quote } from 'lucide-react';

export default function TestimonialsSection() {
  const { t } = useI18n();
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const testimonials = t.testimonials?.items || [];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="section-padding bg-[#F8FAFC] overflow-hidden" ref={ref}>
      <div className="container-wide">
        <div className={`text-center mb-14 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <span className="label-badge bg-yellow-50 text-yellow-700 mb-4">
            <Star size={12} className="fill-yellow-500 text-yellow-500" />
            98% {t.statsNumbers.satisfaction}
          </span>
          <h2 className="font-syne font-bold text-3xl md:text-4xl text-[#0F172A]">
            {t.testimonials?.title || 'Ce que disent nos clients'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {testimonials.map((item: any, i) => (
            <div
              key={i}
              className={`bg-white rounded-2xl p-6 shadow-premium card-hover transition-all duration-700 ${
                visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: item.rating }).map((_, si) => (
                  <Star key={si} size={13} className="fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <Quote size={20} className="text-gray-200 mb-3" />
              <p className="text-[#374151] text-sm leading-relaxed mb-5 italic">{item.text}</p>
              <div className="pt-4 border-t border-gray-100">
                <p className="font-semibold text-sm text-[#0F172A]">{item.name}</p>
                <p className="text-xs text-gray-400">{item.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}