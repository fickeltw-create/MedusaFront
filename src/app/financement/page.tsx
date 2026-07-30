'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useI18n } from '@/lib/i18n';
import { HOUSES, formatPrice, calculateMonthlyPayment } from '@/lib/houses';
import { Calculator, TrendingDown, Shield, Check, Loader2, ArrowRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { supabase } from '@/lib/supabase';

const DURATIONS = [60, 120, 180, 240, 360, 420];

export default function FinancementPage() {
  const { t } = useI18n();
  const [selectedModel, setSelectedModel] = useState(2);
  const [deposit, setDeposit] = useState(20000);
  const [months, setMonths] = useState(120);
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const house = HOUSES[selectedModel];
  const model = t.models[house.key];
  const principal = Math.max(0, house.price - deposit);
  const monthly = calculateMonthlyPayment(principal, months);
  const totalCost = monthly * months + deposit;
  const totalInterest = totalCost - house.price;

  const chartData = DURATIONS.map((m) => ({
    duration: `${m >= 12 ? m / 12 + 'a' : m + 'm'}`,
    monthly: calculateMonthlyPayment(Math.max(0, house.price - deposit), m),
    months: m,
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 1. Save to Supabase database
      await supabase.from('leads').insert({
        type: 'financing',
        name: form.name,
        email: form.email,
        phone: form.phone,
        model: house.slug,
        budget: `${formatPrice(deposit)} apport - ${months} mois - ${formatPrice(monthly)}/mois`,
      });

      // 2. Send email to info@modura.be
      const emailResponse = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'financement',
          name: form.name,
          email: form.email,
          phone: form.phone,
          model: model.name,
          details: `${formatPrice(deposit)} apport - ${months} mois - ${formatPrice(monthly)}/mois`,
          message: `Demande de financement pour ${model.name} avec ${formatPrice(deposit)} d'apport sur ${months} mois, mensualité de ${formatPrice(monthly)}/mois`,
        }),
      });
      
      const emailResult = await emailResponse.json();
      console.log('Email sent:', emailResult);

      setSuccess(true);
    } catch (err) {
      console.error('Error submitting financing request:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="bg-[#0F172A] pt-28 pb-16">
        <div className="container-wide">
          <div className="max-w-2xl">
            <span className="label-badge bg-white/10 text-white/60 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
              {t.financing.title}
            </span>
            <h1 className="font-syne font-bold text-4xl md:text-5xl text-white mb-3">{t.financing.title}</h1>
            <p className="text-white/60 text-lg">{t.financing.subtitle}</p>
          </div>
        </div>
      </section>

      <div className="container-wide py-12">
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Left: Calculator */}
          <div className="lg:col-span-2 space-y-6">
            {/* Model Selector */}
            <div className="bg-[#F8FAFC] rounded-2xl p-6 border border-gray-100">
              <h3 className="font-syne font-bold text-lg text-[#0F172A] mb-4">{t.financing.selectHouse}</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {HOUSES.map((h, i) => {
                  const m = t.models[h.key];
                  return (
                    <button
                      key={h.slug}
                      onClick={() => { setSelectedModel(i); setDeposit(0); }}
                      className={`text-left p-3.5 rounded-xl border-2 transition-all ${
                        selectedModel === i ? 'border-[#2563EB] bg-blue-50' : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-0.5">
                        <p className={`font-semibold text-sm ${selectedModel === i ? 'text-[#2563EB]' : 'text-[#0F172A]'}`}>{m.name}</p>
                        {selectedModel === i && <Check size={14} className="text-[#2563EB]" />}
                      </div>
                      <p className="text-xs text-gray-500">{formatPrice(h.price)}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sliders */}
            <div className="bg-[#F8FAFC] rounded-2xl p-6 border border-gray-100">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Deposit */}
                <div>
                  <div className="flex justify-between mb-3">
                    <label className="text-sm font-semibold text-[#0F172A]">{t.financing.deposit}</label>
                    <span className="font-syne font-bold text-[#2563EB]">{formatPrice(deposit)}</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={house.price * 0.6}
                    step={1000}
                    value={deposit}
                    onChange={(e) => setDeposit(Number(e.target.value))}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer accent-[#2563EB]"
                    style={{ background: `linear-gradient(to right, #2563EB ${(deposit / (house.price * 0.6)) * 100}%, #E5E7EB ${(deposit / (house.price * 0.6)) * 100}%)` }}
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>0€</span>
                    <span>{formatPrice(house.price * 0.6)}</span>
                  </div>
                </div>

                {/* Duration */}
                <div>
                  <div className="flex justify-between mb-3">
                    <label className="text-sm font-semibold text-[#0F172A]">{t.financing.duration}</label>
                    <span className="font-syne font-bold text-[#2563EB]">{months} {t.financing.months}</span>
                  </div>
                  <input
                    type="range"
                    min={60}
                    max={420}
                    step={60}
                    value={months}
                    onChange={(e) => setMonths(Number(e.target.value))}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer accent-[#2563EB]"
                    style={{ background: `linear-gradient(to right, #2563EB ${((months - 60) / 360) * 100}%, #E5E7EB ${((months - 60) / 360) * 100}%)` }}
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>5 ans</span>
                    <span>35 ans</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: t.financing.monthlyPayment, value: formatPrice(monthly), highlight: true, icon: Calculator },
                { label: t.financing.totalCost, value: formatPrice(totalCost), icon: TrendingDown },
                { label: t.financing.totalInterest, value: formatPrice(totalInterest), icon: Shield },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className={`rounded-2xl p-5 text-center ${item.highlight ? 'bg-[#0F172A] text-white' : 'bg-[#F8FAFC] border border-gray-100'}`}>
                    <Icon size={18} className={`mx-auto mb-2 ${item.highlight ? 'text-white/50' : 'text-gray-400'}`} />
                    <p className={`font-syne font-bold text-xl ${item.highlight ? 'text-white' : 'text-[#0F172A]'}`}>{item.value}</p>
                    <p className={`text-xs mt-0.5 ${item.highlight ? 'text-white/50' : 'text-gray-500'}`}>{item.label}</p>
                  </div>
                );
              })}
            </div>

            {/* Chart */}
            <div className="bg-[#F8FAFC] rounded-2xl p-6 border border-gray-100">
              <h3 className="font-syne font-bold text-base text-[#0F172A] mb-5">{t.financing.monthlyByDuration || "Mensualité selon la durée"}</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={chartData} barSize={28}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="duration" tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}€`} />
                  <Tooltip
                    formatter={(value: number) => [formatPrice(value), t.financing.summaryMonthly]}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 24px rgba(0,0,0,0.1)', fontSize: '12px' }}
                  />
                  <Bar
                    dataKey="monthly"
                    fill="#2563EB"
                    radius={[6, 6, 0, 0]}
                    fillOpacity={0.9}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Right: Form */}
          <div>
            <div className="bg-[#F8FAFC] rounded-2xl p-6 border border-gray-100 sticky top-24">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-[#2563EB]/10 rounded-xl flex items-center justify-center">
                  <Calculator size={18} className="text-[#2563EB]" />
                </div>
                <div>
                  <h3 className="font-syne font-bold text-base text-[#0F172A]">{t.financing.requestFinancing}</h3>
                  <p className="text-xs text-gray-400">Réponse sous 24h</p>
                </div>
              </div>

              {/* Summary */}
              <div className="bg-white rounded-xl p-4 mb-5 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">{t.financing.summaryHouse}</span>
                  <span className="font-medium text-[#0F172A]">{model.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">{t.financing.summaryPrice}</span>
                  <span className="font-medium">{formatPrice(house.price)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">{t.financing.summaryDeposit}</span>
                  <span className="font-medium text-green-600">{formatPrice(deposit)}</span>
                </div>
                <div className="flex justify-between text-sm border-t border-gray-100 pt-2">
                  <span className="font-semibold text-[#0F172A]">{t.financing.summaryMonthly}</span>
                  <span className="font-syne font-bold text-[#2563EB]">{formatPrice(monthly)}{t.financing.monthly}</span>
                </div>
              </div>

              {success ? (
                <div className="text-center py-6">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Check size={20} className="text-green-600" />
                  </div>
                  <p className="font-semibold text-[#0F172A] text-sm mb-1">Demande envoyée !</p>
                  <p className="text-xs text-gray-500">Nous vous contacterons sous 24h.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3">
                  {[
                    { placeholder: t.forms.quote.name, type: 'text', key: 'name' as const, label: t.forms.quote.name },
                    { placeholder: t.forms.quote.email, type: 'email', key: 'email' as const, label: t.forms.quote.email },
                    { placeholder: t.forms.quote.phone, type: 'tel', key: 'phone' as const, label: t.forms.quote.phone },
                  ].map((field) => (
                    <div key={field.key}>
                      <label className="block text-xs font-medium text-gray-600 mb-1">{field.label}</label>
                      <input
                        required={field.key !== 'phone'}
                        type={field.type}
                        placeholder={field.placeholder}
                        value={form[field.key]}
                        onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] bg-white transition-all"
                      />
                    </div>
                  ))}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#2563EB] text-white py-3 rounded-xl font-semibold text-sm hover:bg-[#1D4ED8] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {loading ? <Loader2 size={14} className="animate-spin" /> : <ArrowRight size={14} />}
                    {t.financing.requestFinancing}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Info Boxes */}
        <div className="grid md:grid-cols-3 gap-5 mt-10">
          {[
            { title: t.financing.annualRate, value: t.financing.rate, desc: t.financing.aprNote },
            { title: t.financing.maxDuration, value: t.financing.maxYears, desc: t.financing.maxPayments },
            { title: t.financing.minDeposit, value: t.financing.minDepositAmount, desc: t.financing.reserveText },
          ].map((info, i) => (
            <div key={i} className="bg-[#F8FAFC] rounded-2xl p-5 border border-gray-100 text-center">
              <p className="font-syne font-bold text-2xl text-[#0F172A] mb-1">{info.value}</p>
              <p className="font-semibold text-sm text-[#374151] mb-1">{info.title}</p>
              <p className="text-xs text-gray-400">{info.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </main>
  );
}