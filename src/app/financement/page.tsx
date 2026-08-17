'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useI18n } from '@/lib/i18n';
import { HOUSES, formatPrice, calculateMonthlyPayment } from '@/lib/houses';
import { Calculator, TrendingDown, Shield, Check, Loader2, ArrowRight, BadgePercent, BriefcaseBusiness, WalletCards, LineChart } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import { supabase } from '@/lib/supabase';

const DURATIONS = [60, 120, 180, 240, 360, 420];
type Mode = 'credit' | 'investment';
type InvestmentView = 'stats' | 'details';

export default function FinancementPage() {
  const { t } = useI18n();
  const [selectedModel, setSelectedModel] = useState(2);
  const [mode, setMode] = useState<Mode>('credit');
  const [investmentView, setInvestmentView] = useState<InvestmentView>('stats');
  const [deposit, setDeposit] = useState(20000);
  const [months, setMonths] = useState(120);
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const house = HOUSES[selectedModel];
  const model = t.models[house.key];
  const principal = Math.max(0, house.price - deposit);
  const creditMonthly = calculateMonthlyPayment(principal, months);
  const monthly = mode === 'credit' ? creditMonthly : house.monthlyPayment;
  const totalCost = creditMonthly * months + deposit;
  const totalInterest = totalCost - house.price;

  const financingPlans = [
    { label: 'Classique', months: house.financingMonths, monthly: house.monthlyPayment },
    ...(house.extendedMonthlyPayment && house.extendedMonths ? [{ label: 'Long terme', months: house.extendedMonths, monthly: house.extendedMonthlyPayment }] : []),
    ...(house.ecoMonthlyPayment && house.ecoMonths ? [{ label: 'Eco', months: house.ecoMonths, monthly: house.ecoMonthlyPayment }] : []),
  ];

  const creditChartData = DURATIONS.map((m) => ({ duration: `${m >= 12 ? `${m / 12}a` : `${m}m`}`, monthly: calculateMonthlyPayment(Math.max(0, house.price - deposit), m) }));

  const annualDividend = Math.round(house.price * 0.15);
  const annualGrowth = Math.round(house.price * 0.03);
  const investmentProjection = Array.from({ length: 10 }, (_, i) => {
    const year = i + 1;
    const cumulativeDividend = annualDividend * year;
    const appreciation = annualGrowth * year;
    const projectedValue = house.price + appreciation;
    const totalPotential = cumulativeDividend + appreciation;
    return { year, cumulativeDividend, appreciation, projectedValue, totalPotential };
  });

  const allocationData = [
    { name: 'Dividends', value: 58 },
    { name: 'Capital gain', value: 27 },
    { name: 'Reserve', value: 15 },
  ];
  const allocationColors = ['#A9824C', '#2563EB', '#CBD5E1'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await supabase.from('leads').insert({
        type: mode === 'credit' ? 'financing' : 'investment',
        name: form.name,
        email: form.email,
        phone: form.phone,
        model: house.slug,
      });
      setSuccess(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      <section className="bg-[#0F172A] pt-28 pb-16">
        <div className="container-wide">
          <div className="max-w-2xl">
            <span className="label-badge bg-white/10 text-white/60 mb-4"><span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />{t.financing.title}</span>
            <h1 className="font-syne font-bold text-4xl md:text-5xl text-white mb-3">{t.financing.title}</h1>
            <p className="text-white/60 text-lg">{t.financing.subtitle}</p>
          </div>
        </div>
      </section>

      <div className="container-wide py-12">
        <section className="mb-10">
          <div className="rounded-3xl border border-gray-100 bg-[#F8FAFC] p-4 md:p-6">
            <div className="grid gap-4 md:grid-cols-2">
              <button onClick={() => setMode('credit')} className={`rounded-2xl border p-5 text-left transition-all ${mode === 'credit' ? 'border-[#2563EB] bg-white shadow-sm' : 'border-gray-200 bg-transparent hover:bg-white/70'}`}>
                <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[#2563EB] font-mono"><WalletCards size={14} />{t.financing.modeCredit}</span>
                <h2 className="mt-3 text-2xl font-semibold text-[#0F172A]">{t.financing.modeCreditTitle}</h2>
                <p className="mt-2 text-sm text-gray-500">{t.financing.modeCreditDesc}</p>
              </button>
              <button onClick={() => setMode('investment')} className={`rounded-2xl border p-5 text-left transition-all ${mode === 'investment' ? 'border-[#A9824C] bg-white shadow-sm' : 'border-gray-200 bg-transparent hover:bg-white/70'}`}>
                <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[#A9824C] font-mono"><BadgePercent size={14} />{t.financing.modeInvestment}</span>
                <h2 className="mt-3 text-2xl font-semibold text-[#0F172A]">{t.financing.modeInvestmentTitle}</h2>
                <p className="mt-2 text-sm text-gray-500">{t.financing.modeInvestmentDesc}</p>
              </button>
            </div>
          </div>
        </section>

        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#F8FAFC] rounded-2xl p-6 border border-gray-100">
              <h3 className="font-syne font-bold text-lg text-[#0F172A] mb-4">{t.financing.selectHouse}</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {HOUSES.map((h, i) => {
                  const m = t.models[h.key];
                  return (
                    <button key={h.slug} onClick={() => { setSelectedModel(i); setDeposit(0); }} className={`text-left p-3.5 rounded-xl border-2 transition-all ${selectedModel === i ? 'border-[#2563EB] bg-blue-50' : 'border-gray-200 hover:border-gray-300 bg-white'}`}>
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

            {mode === 'credit' ? (
              <>
                <div className="bg-[#F8FAFC] rounded-2xl p-6 border border-gray-100">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <div className="flex justify-between mb-3"><label className="text-sm font-semibold text-[#0F172A]">{t.financing.deposit}</label><span className="font-syne font-bold text-[#2563EB]">{formatPrice(deposit)}</span></div>
                      <input type="range" min={0} max={house.price * 0.6} step={1000} value={deposit} onChange={(e) => setDeposit(Number(e.target.value))} className="w-full h-2 rounded-full appearance-none cursor-pointer accent-[#2563EB]" style={{ background: `linear-gradient(to right, #2563EB ${(deposit / (house.price * 0.6)) * 100}%, #E5E7EB ${(deposit / (house.price * 0.6)) * 100}%)` }} />
                      <div className="flex justify-between text-xs text-gray-400 mt-1"><span>0€</span><span>{formatPrice(house.price * 0.6)}</span></div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-3"><label className="text-sm font-semibold text-[#0F172A]">{t.financing.duration}</label><span className="font-syne font-bold text-[#2563EB]">{months} {t.financing.months}</span></div>
                      <input type="range" min={60} max={420} step={60} value={months} onChange={(e) => setMonths(Number(e.target.value))} className="w-full h-2 rounded-full appearance-none cursor-pointer accent-[#2563EB]" style={{ background: `linear-gradient(to right, #2563EB ${((months - 60) / 360) * 100}%, #E5E7EB ${((months - 60) / 360) * 100}%)` }} />
                      <div className="flex justify-between text-xs text-gray-400 mt-1"><span>5 ans</span><span>35 ans</span></div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[{ label: t.financing.monthlyPayment, value: formatPrice(creditMonthly), highlight: true, icon: Calculator }, { label: t.financing.totalCost, value: formatPrice(totalCost), icon: TrendingDown }, { label: t.financing.totalInterest, value: formatPrice(totalInterest), icon: Shield }].map((item, i) => {
                    const Icon = item.icon;
                    return <div key={i} className={`rounded-2xl p-5 text-center ${item.highlight ? 'bg-[#0F172A] text-white' : 'bg-[#F8FAFC] border border-gray-100'}`}><Icon size={18} className={`mx-auto mb-2 ${item.highlight ? 'text-white/50' : 'text-gray-400'}`} /><p className={`font-syne font-bold text-xl ${item.highlight ? 'text-white' : 'text-[#0F172A]'}`}>{item.value}</p><p className={`text-xs mt-0.5 ${item.highlight ? 'text-white/50' : 'text-gray-500'}`}>{item.label}</p></div>;
                  })}
                </div>
                <div className="bg-[#F8FAFC] rounded-2xl p-6 border border-gray-100">
                  <h3 className="font-syne font-bold text-base text-[#0F172A] mb-4">{t.financing.modelMonthlyTitle}</h3>
                  <div className="grid gap-4">{financingPlans.map((plan) => <div key={plan.label} className="flex items-center justify-between rounded-xl bg-white border border-gray-100 px-4 py-3"><div><p className="font-semibold text-sm text-[#0F172A]">{plan.label}</p><p className="text-xs text-gray-500">{plan.months} mois</p></div><p className="font-syne font-bold text-[#2563EB]">{formatPrice(plan.monthly)}/mois</p></div>)}</div>
                </div>
                <div className="bg-[#F8FAFC] rounded-2xl p-6 border border-gray-100">
                  <h3 className="font-syne font-bold text-base text-[#0F172A] mb-5">{t.financing.monthlyByDuration || 'Mensualite selon la duree'}</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={creditChartData} barSize={28}><CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" /><XAxis dataKey="duration" tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} /><YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}€`} /><Tooltip formatter={(value: number) => [formatPrice(value), t.financing.summaryMonthly]} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 24px rgba(0,0,0,0.1)', fontSize: '12px' }} /><Bar dataKey="monthly" fill="#2563EB" radius={[6, 6, 0, 0]} fillOpacity={0.9} /></BarChart>
                  </ResponsiveContainer>
                </div>
              </>
            ) : (
              <div className="space-y-6">
                <div className="bg-[#101C2C] text-white rounded-2xl p-6 border border-[#1E3554]">
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div><span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[#D7B47A] font-mono"><BriefcaseBusiness size={14} />{t.financing.investmentHeadline}</span><h3 className="mt-3 text-xl font-semibold">{t.financing.investmentHeadline}</h3></div>
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/80"><LineChart size={14} />{t.financing.investmentMode}</span>
                  </div>
                  <div className="mt-6 flex gap-2 rounded-full bg-white/5 p-1 w-fit">
                    <button onClick={() => setInvestmentView('stats')} className={`px-4 py-2 rounded-full text-sm transition-all ${investmentView === 'stats' ? 'bg-white text-[#101C2C] font-semibold' : 'text-white/70 hover:text-white'}`}>{t.financing.statsTab}</button>
                    <button onClick={() => setInvestmentView('details')} className={`px-4 py-2 rounded-full text-sm transition-all ${investmentView === 'details' ? 'bg-white text-[#101C2C] font-semibold' : 'text-white/70 hover:text-white'}`}>{t.financing.detailsTab}</button>
                  </div>
                  {investmentView === 'stats' ? (
                    <div className="grid gap-4 mt-6 md:grid-cols-2 xl:grid-cols-4">
                      <div className="rounded-2xl bg-white/5 border border-white/10 p-5"><p className="text-xs uppercase tracking-wider text-white/50">{t.financing.currentValue}</p><p className="mt-3 text-2xl font-semibold">{formatPrice(house.price)}</p></div>
                      <div className="rounded-2xl bg-white/5 border border-white/10 p-5"><p className="text-xs uppercase tracking-wider text-white/50">{t.financing.annualDividend}</p><p className="mt-3 text-2xl font-semibold">{formatPrice(annualDividend)}</p></div>
                      <div className="rounded-2xl bg-white/5 border border-white/10 p-5"><p className="text-xs uppercase tracking-wider text-white/50">{t.financing.annualGrowth}</p><p className="mt-3 text-2xl font-semibold">{formatPrice(annualGrowth)}</p></div>
                      <div className="rounded-2xl bg-white/5 border border-white/10 p-5"><p className="text-xs uppercase tracking-wider text-white/50">{t.financing.tenYearReturn}</p><p className="mt-3 text-2xl font-semibold">{formatPrice(investmentProjection[9].totalPotential)}</p></div>
                    </div>
                  ) : (
                    <div className="grid gap-4 mt-6 md:grid-cols-3">
                      <div className="rounded-xl bg-white/5 border border-white/10 p-4"><p className="text-xs uppercase tracking-wider text-white/50">{t.financing.modelPrice}</p><p className="mt-2 text-2xl font-semibold">{formatPrice(house.price)}</p><p className="text-xs text-white/60 mt-1">{model.name}</p></div>
                      <div className="rounded-xl bg-white/5 border border-white/10 p-4"><p className="text-xs uppercase tracking-wider text-white/50">{t.financing.annualDividend}</p><p className="mt-2 text-2xl font-semibold">{formatPrice(annualDividend)}</p><p className="text-xs text-white/60 mt-1">{t.financing.currentPayoutBase}</p></div>
                      <div className="rounded-xl bg-white/5 border border-white/10 p-4"><p className="text-xs uppercase tracking-wider text-white/50">{t.financing.annualGain}</p><p className="mt-2 text-2xl font-semibold">{formatPrice(annualGrowth)}</p><p className="text-xs text-white/60 mt-1">{t.financing.cautiousEstimate}</p></div>
                    </div>
                  )}
                </div>
                {investmentView === 'stats' ? (
                  <div className="grid lg:grid-cols-[1.3fr_0.7fr] gap-4">
                    <div className="rounded-2xl border border-gray-100 bg-[#F8FAFC] p-5">
                      <p className="text-xs uppercase tracking-[0.18em] text-[#A9824C] font-mono">{t.financing.curveTitle}</p>
                      <h4 className="mt-1 text-lg font-semibold text-[#0F172A]">{t.financing.curveTitle}</h4>
                      <ResponsiveContainer width="100%" height={280}>
                        <AreaChart data={investmentProjection}><defs><linearGradient id="returnGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#2563EB" stopOpacity={0.35} /><stop offset="95%" stopColor="#2563EB" stopOpacity={0.02} /></linearGradient></defs><CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" /><XAxis dataKey="year" tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} /><YAxis tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${Math.round(v / 1000)}k`} /><Tooltip formatter={(value: number) => [formatPrice(value), 'Montant']} labelFormatter={(label) => `${t.financing.yearLabel} ${label}`} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.12)' }} /><Area type="monotone" dataKey="totalPotential" stroke="#2563EB" strokeWidth={3} fill="url(#returnGradient)" /></AreaChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="rounded-2xl border border-gray-100 bg-[#F8FAFC] p-5">
                      <p className="text-xs uppercase tracking-[0.18em] text-[#A9824C] font-mono">{t.financing.allocationTitle}</p>
                      <h4 className="mt-1 text-lg font-semibold text-[#0F172A]">{t.financing.allocationTitle}</h4>
                      <ResponsiveContainer width="100%" height={220}>
                        <PieChart><Pie data={allocationData} dataKey="value" innerRadius={58} outerRadius={86} paddingAngle={4}>{allocationData.map((entry, index) => <Cell key={entry.name} fill={allocationColors[index]} />)}</Pie><Tooltip formatter={(value: number) => [`${value}%`, 'Part']} /></PieChart>
                      </ResponsiveContainer>
                      <div className="space-y-2 mt-2">{allocationData.map((item, idx) => <div key={item.name} className="flex items-center justify-between text-sm"><span className="inline-flex items-center gap-2 text-[#0F172A]"><span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: allocationColors[idx] }} />{item.name}</span><span className="text-gray-500">{item.value}%</span></div>)}</div>
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-4">{investmentProjection.map((row) => <div key={row.year} className="rounded-2xl border border-gray-100 bg-[#F8FAFC] p-5"><div className="flex items-center justify-between gap-4 flex-wrap"><div><p className="text-xs uppercase tracking-[0.18em] text-[#A9824C] font-mono">{t.financing.yearLabel} {row.year}</p><h4 className="mt-1 text-lg font-semibold text-[#0F172A]">{t.financing.projectionTitle}</h4></div><p className="font-syne font-bold text-[#2563EB]">{formatPrice(row.totalPotential)} potentiel</p></div><div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-4 text-sm"><div className="rounded-xl bg-white p-4 border border-gray-100"><p className="text-gray-500 text-xs">{t.financing.dividendsCumulative}</p><p className="mt-1 font-semibold text-[#0F172A]">{formatPrice(row.cumulativeDividend)}</p></div><div className="rounded-xl bg-white p-4 border border-gray-100"><p className="text-gray-500 text-xs">{t.financing.projectedValue}</p><p className="mt-1 font-semibold text-[#0F172A]">{formatPrice(row.projectedValue)}</p></div><div className="rounded-xl bg-white p-4 border border-gray-100"><p className="text-gray-500 text-xs">{t.financing.estimatedGain}</p><p className="mt-1 font-semibold text-[#0F172A]">{formatPrice(row.appreciation)}</p></div><div className="rounded-xl bg-white p-4 border border-gray-100"><p className="text-gray-500 text-xs">{t.financing.totalPotentialReturn}</p><p className="mt-1 font-semibold text-[#0F172A]">{formatPrice(row.totalPotential)}</p></div></div></div>)}</div>
                )}
              </div>
            )}
          </div>

          <div>
            <div className="bg-[#F8FAFC] rounded-2xl p-6 border border-gray-100 sticky top-24">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-[#2563EB]/10 rounded-xl flex items-center justify-center"><Calculator size={18} className="text-[#2563EB]" /></div>
                <div>
                  <h3 className="font-syne font-bold text-base text-[#0F172A]">{mode === 'credit' ? t.financing.requestFinancing : t.financing.requestInvestmentSim}</h3>
                  <p className="text-xs text-gray-400">{t.financing.responseUnder24h}</p>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 mb-5 space-y-2">
                <div className="flex justify-between text-sm"><span className="text-gray-500">{t.financing.modeLabel}</span><span className="font-medium text-[#0F172A]">{mode === 'credit' ? t.financing.creditLabel : t.financing.investmentLabel}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-500">{t.financing.summaryHouse}</span><span className="font-medium text-[#0F172A]">{model.name}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-500">{t.financing.summaryPrice}</span><span className="font-medium">{formatPrice(house.price)}</span></div>
                {mode === 'credit' ? (
                  <>
                    <div className="flex justify-between text-sm"><span className="text-gray-500">{t.financing.summaryDeposit}</span><span className="font-medium text-green-600">{formatPrice(deposit)}</span></div>
                    <div className="flex justify-between text-sm border-t border-gray-100 pt-2"><span className="font-semibold text-[#0F172A]">{t.financing.summaryMonthly}</span><span className="font-syne font-bold text-[#2563EB]">{formatPrice(creditMonthly)}{t.financing.monthly}</span></div>
                  </>
                ) : (
                  <div className="flex justify-between text-sm border-t border-gray-100 pt-2"><span className="font-semibold text-[#0F172A]">{t.financing.estimatedAnnualDividend}</span><span className="font-syne font-bold text-[#2563EB]">{formatPrice(annualDividend)}</span></div>
                )}
              </div>

              {success ? (
                <div className="text-center py-6"><div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3"><Check size={20} className="text-green-600" /></div><p className="font-semibold text-[#0F172A] text-sm mb-1">Demande envoyee !</p><p className="text-xs text-gray-500">Nous vous contacterons sous 24h.</p></div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3">
                  {[{ placeholder: t.forms.quote.name, type: 'text', key: 'name' as const, label: t.forms.quote.name }, { placeholder: t.forms.quote.email, type: 'email', key: 'email' as const, label: t.forms.quote.email }, { placeholder: t.forms.quote.phone, type: 'tel', key: 'phone' as const, label: t.forms.quote.phone }].map((field) => (
                    <div key={field.key}>
                      <label className="block text-xs font-medium text-gray-600 mb-1">{field.label}</label>
                      <input required={field.key !== 'phone'} type={field.type} placeholder={field.placeholder} value={form[field.key]} onChange={(e) => setForm({ ...form, [field.key]: e.target.value })} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] bg-white transition-all" />
                    </div>
                  ))}
                  <button type="submit" disabled={loading} className="w-full bg-[#2563EB] text-white py-3 rounded-xl font-semibold text-sm hover:bg-[#1D4ED8] transition-all flex items-center justify-center gap-2 disabled:opacity-70">{loading ? <Loader2 size={14} className="animate-spin" /> : <ArrowRight size={14} />}{mode === 'credit' ? t.financing.requestFinancing : t.financing.submitSimulation}</button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
