'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import { ArrowRight, Calculator } from 'lucide-react';
import { HOUSES, formatPrice, calculateMonthlyPayment } from '@/lib/houses';

export default function FinancingPreview() {
  const { t } = useI18n();
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState(2);
  const [deposit, setDeposit] = useState(20000);
  const [months, setMonths] = useState(120);
  const ref = useRef<HTMLDivElement>(null);

  const house = HOUSES[selected];
  const principal = Math.max(0, house.price - deposit);
  const monthly = calculateMonthlyPayment(principal, months);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="section-padding bg-white" ref={ref}>
      <div className="container-wide">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Calculator */}
          <div className={`bg-[#F8FAFC] rounded-3xl p-8 border border-gray-100 shadow-premium transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="flex items-center gap-3 mb-7">
              <div className="w-10 h-10 bg-[#2563EB]/10 rounded-xl flex items-center justify-center">
                <Calculator size={20} className="text-[#2563EB]" />
              </div>
              <h3 className="font-syne font-bold text-lg text-[#0F172A]">{t.financing.title}</h3>
            </div>

            {/* House Selector */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-[#374151] mb-2">{t.financing.selectHouse}</label>
              <div className="grid grid-cols-2 gap-2">
                {HOUSES.slice(0, 4).map((h, i) => {
                  const model = t.models[h.key];
                  return (
                    <button
                      key={h.slug}
                      onClick={() => setSelected(i)}
                      className={`text-left px-3 py-2.5 rounded-xl border text-xs transition-all duration-200 ${
                        selected === i
                          ? 'border-[#2563EB] bg-blue-50 text-[#2563EB] font-semibold'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      <p className="font-semibold truncate">{model.name}</p>
                      <p className="text-xs opacity-70">{formatPrice(h.price)}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Deposit Slider */}
            <div className="mb-5">
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-[#374151]">{t.financing.deposit}</label>
                <span className="text-sm font-semibold text-[#0F172A]">{formatPrice(deposit)}</span>
              </div>
              <input
                type="range"
                min={0}
                max={house.price * 0.5}
                step={1000}
                value={deposit}
                onChange={(e) => setDeposit(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-[#2563EB]"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>0€</span>
                <span>{formatPrice(house.price * 0.5)}</span>
              </div>
            </div>

            {/* Duration Selector */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-[#374151] mb-2">{t.financing.duration}</label>
              <div className="flex gap-2">
                {[60, 120, 240, 360, 420].map((m) => (
                  <button
                    key={m}
                    onClick={() => setMonths(m)}
                    className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                      months === m
                        ? 'bg-[#0F172A] text-white'
                        : 'bg-white text-gray-500 border border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    {m >= 12 ? `${m / 12}a` : `${m}m`}
                  </button>
                ))}
              </div>
            </div>

            {/* Result */}
            <div className="bg-[#0F172A] rounded-2xl p-5 text-center">
              <p className="text-white/50 text-xs mb-1">{t.financing.monthlyPayment}</p>
              <p className="font-syne font-bold text-4xl text-white mb-0.5">{formatPrice(monthly)}</p>
              <p className="text-white/40 text-xs">{t.financing.monthly} · {months} {t.financing.months}</p>
            </div>
          </div>

          {/* Right: Text */}
          <div className={`transition-all duration-700 delay-200 ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
            <span className="label-badge bg-blue-50 text-[#2563EB] mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
              {t.financing.title}
            </span>
            <h2 className="font-syne font-bold text-3xl md:text-4xl lg:text-5xl text-[#0F172A] mb-6 leading-tight">
              {t.financing.title}
            </h2>
            <p className="text-[#6B7280] text-base leading-relaxed mb-6">
              {t.financing.subtitle}
            </p>
            <div className="space-y-3 mb-8">
              {[
                { label: t.financing.selectHouse, val: t.models[house.key].name },
                { label: t.financing.deposit, val: formatPrice(deposit) },
                { label: t.financing.duration, val: `${months} ${t.financing.months}` },
                { label: t.financing.monthlyPayment, val: formatPrice(monthly), highlight: true },
              ].map((row, i) => (
                <div key={i} className={`flex justify-between items-center py-2.5 px-4 rounded-xl ${row.highlight ? 'bg-blue-50 border border-blue-100' : 'bg-gray-50'}`}>
                  <span className="text-sm text-gray-600">{row.label}</span>
                  <span className={`text-sm font-semibold ${row.highlight ? 'text-[#2563EB]' : 'text-[#0F172A]'}`}>{row.val}</span>
                </div>
              ))}
            </div>
            <Link
              href="/financement"
              className="inline-flex items-center gap-2 btn-primary group"
            >
              {t.financing.requestFinancing}
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
