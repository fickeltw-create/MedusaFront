'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import type { ExteriorColor, RoofType, ModelKey } from '@/components/HouseViewer';
import { useI18n } from '@/lib/i18n';
import { HOUSES, CONFIGURATOR_OPTIONS, formatPrice, calculateMonthlyPayment } from '@/lib/houses';
import { Check, ArrowRight, Loader2, Shield, RotateCcw, Zap, Home, Wind, Palette } from 'lucide-react';
import { supabase } from '@/lib/supabase';

type EnergyKey = keyof typeof CONFIGURATOR_OPTIONS.energy;
type ClimateKey = keyof typeof CONFIGURATOR_OPTIONS.climate;

const EXTERIOR_TEXTURES: { key: string; src: string; label: string; price: number }[] = [
  { key: 'blanc-mat', src: '/textures/BlancMat.png', label: 'Blanc Mat', price: 0 },
  { key: 'anthracite', src: '/textures/Anthracite.png', label: 'Anthracite', price: 1500 },
  { key: 'bois-brule', src: '/textures/Bois Brûlé.png', label: 'Bois Brûlé', price: 3500 },
  { key: 'chene-naturel', src: '/textures/Chêne Naturel.png', label: 'Chêne Naturel', price: 2500 },
];

const ROOF_OPTIONS: { key: RoofType; label: string; price: number; icon: string }[] = [
  { key: 'flat',    label: 'Toit plat',       price: 0,    icon: '▬' },
  { key: 'pitched', label: 'Pente moderne',   price: 4000, icon: '▲' },
  { key: 'metal',   label: 'Métal premium',   price: 7500, icon: '◆' },
];

export default function ConfigurateurPage() {
  const { t } = useI18n();
  const [selectedModel, setSelectedModel] = useState(1);
  const [exterior, setExterior] = useState<string>('blanc-mat');
  const [roofType, setRoofType] = useState<RoofType>('flat');
  const [energies, setEnergies] = useState<EnergyKey[]>([]);
  const [climates, setClimates] = useState<ClimateKey[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState(0);

  const house = HOUSES[selectedModel];
  const modelKey = house.key as ModelKey;

  const basePrice = house.price;
  const extPrice  = EXTERIOR_TEXTURES.find(t => t.key === exterior)?.price ?? 0;
  const rfPrice   = CONFIGURATOR_OPTIONS.roof[roofType as keyof typeof CONFIGURATOR_OPTIONS.roof]?.price ?? 0;
  const engPrice  = energies.reduce((s, e) => s + (CONFIGURATOR_OPTIONS.energy[e]?.price ?? 0), 0);
  const climPrice = climates.reduce((s, c) => s + (CONFIGURATOR_OPTIONS.climate[c]?.price ?? 0), 0);
  const total = basePrice + extPrice + rfPrice + engPrice + climPrice;
  const monthly = calculateMonthlyPayment(total, house.financingMonths);

  const toggleEnergy  = (k: EnergyKey)  => setEnergies(p  => p.includes(k) ? p.filter(x => x !== k) : [...p, k]);
  const toggleClimate = (k: ClimateKey) => setClimates(p  => p.includes(k) ? p.filter(x => x !== k) : [...p, k]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    try {
      const cfg = `${t.models[house.key].name} | ${exterior} | ${roofType} | ${energies.join(',')} | ${climates.join(',')} | ${formatPrice(total)}`;
      await supabase.from('leads').insert({ type: 'quote', name: form.name, email: form.email, phone: form.phone, model: house.slug, message: cfg });
      setSuccess(true);
    } finally { setLoading(false); }
  };

  const STEPS = [
    { label: t.configurator.steps.model, icon: Home },
    { label: t.configurator.steps.exterior, icon: Palette },
    { label: t.configurator.steps.energy, icon: Zap },
    { label: t.configurator.steps.quote, icon: ArrowRight },
  ];

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <Navbar />

      <section className="bg-[#0F172A] pt-28 pb-10">
        <div className="container-wide">
          <span className="label-badge bg-white/10 text-white/60 mb-3"><span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />{t.configurator.title}</span>
          <h1 className="font-syne font-bold text-4xl md:text-5xl text-white mb-2">{t.configurator.title}</h1>
          <p className="text-white/60 text-base">{t.configurator.subtitle}</p>
        </div>
      </section>

      {/* Step indicator */}
      <div className="bg-white border-b border-gray-100 sticky top-16 z-30">
        <div className="container-wide py-3">
          <div className="flex items-center gap-1 overflow-x-auto">
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              return (
                <button key={i} onClick={() => setStep(i)} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${step === i ? 'bg-[#0F172A] text-white' : step > i ? 'text-green-600 bg-green-50' : 'text-gray-400'}`}>
                  <Icon size={14} />
                  {i < step ? <Check size={12} /> : null}
                  {s.label}
                </button>
              );
            })}
            <div className="ml-auto text-sm font-syne font-bold text-[#2563EB] whitespace-nowrap flex-shrink-0">
              {formatPrice(total)}
            </div>
          </div>
        </div>
      </div>

      <div className="container-wide py-8">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* ── Left: Controls ── */}
          <div className="lg:col-span-3 space-y-5">

            {/* Step 0: Model */}
            {(step === 0 || step > 0) && (
              <div className={`bg-white rounded-2xl p-6 shadow-premium border-2 transition-all ${step === 0 ? 'border-[#2563EB]' : 'border-transparent'}`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-syne font-bold text-lg text-[#0F172A]">{t.configurator.ourModels}</h3>
                  {step > 0 && <button onClick={() => setStep(0)} className="text-xs text-[#2563EB] hover:underline flex items-center gap-1"><RotateCcw size={11} /> {t.configurator.edit}</button>}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {HOUSES.map((h, i) => {
                    const m = t.models[h.key];
                    const isSelected = selectedModel === i;
                    return (
                      <button
                        key={h.slug}
                        onClick={() => { setSelectedModel(i); if (step === 0) setStep(1); }}
                        className={`relative text-left p-4 rounded-xl border-2 transition-all duration-200 overflow-hidden ${isSelected ? 'border-[#2563EB] bg-blue-50' : 'border-gray-100 hover:border-gray-300 bg-gray-50'}`}
                      >
                        {isSelected && <div className="absolute top-3 right-3 w-5 h-5 bg-[#2563EB] rounded-full flex items-center justify-center z-10"><Check size={11} className="text-white" /></div>}
                        {/* Dollhouse preview image for each model */}
                        <div className="w-full h-32 rounded-lg overflow-hidden mb-3 bg-gray-100">
                          <img 
                            src={h.image} 
                            alt={m.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <p className={`font-semibold text-sm mb-0.5 ${isSelected ? 'text-[#2563EB]' : 'text-[#0F172A]'}`}>{m.name}</p>
                        <p className="text-xs text-gray-400">{h.size} m²</p>
                        <p className="text-xs font-semibold text-gray-600 mt-1">{formatPrice(h.price)}</p>
                        <p className="text-xs text-gray-400">{monthly} {t.configurator.perMonth}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 1: Exterior + Roof */}
            {step >= 1 && (
              <div className={`bg-white rounded-2xl p-6 shadow-premium border-2 transition-all ${step === 1 ? 'border-[#2563EB]' : 'border-transparent'}`}>
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-syne font-bold text-lg text-[#0F172A]">{t.configurator.exterior}</h3>
                  {step > 1 && <button onClick={() => setStep(1)} className="text-xs text-[#2563EB] hover:underline flex items-center gap-1"><RotateCcw size={11} /> {t.configurator.edit}</button>}
                </div>
                {/* Exterior color */}
                <div className="mb-6">
                  <p className="text-sm text-gray-500 mb-3">{t.configurator.exterior}</p>
                  <div className="grid grid-cols-4 gap-4">
                    {EXTERIOR_TEXTURES.map((s) => (
                      <button
                        key={s.key}
                        onClick={() => setExterior(s.key)}
                        title={s.label}
                        className={`relative aspect-square w-full rounded-xl border-2 overflow-hidden transition-all duration-200 hover:scale-105 focus:outline-none ${exterior === s.key ? 'ring-2 ring-[#2563EB] ring-offset-2 border-[#2563EB]' : 'border-gray-200'}`}
                      >
                        <img 
                          src={s.src} 
                          alt={s.label}
                          className="w-[110%] h-[110%] object-cover -translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2"
                        />
                        {exterior === s.key && (
                          <div className="absolute top-1 right-1 w-5 h-5 bg-[#2563EB] rounded-full flex items-center justify-center">
                            <Check size={11} className="text-white" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">{EXTERIOR_TEXTURES.find(s => s.key === exterior)?.label}</span>
                    <span className={`text-xs ${EXTERIOR_TEXTURES.find(s => s.key === exterior)?.price === 0 ? 'text-green-600' : 'text-gray-600'}`}>
                      {EXTERIOR_TEXTURES.find(s => s.key === exterior)?.price === 0 ? t.configurator.included : `+${formatPrice(EXTERIOR_TEXTURES.find(s => s.key === exterior)?.price || 0)}`}
                    </span>
                  </div>
                </div>
                {/* Roof */}
                <div>
                  <p className="text-sm text-gray-500 mb-3">{t.configurator.roof}</p>
                  <div className="grid grid-cols-3 gap-3">
                    {ROOF_OPTIONS.map((r) => (
                      <button
                        key={r.key}
                        onClick={() => { setRoofType(r.key); if (step === 1) setStep(2); }}
                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 ${roofType === r.key ? 'border-[#2563EB] bg-blue-50' : 'border-gray-100 hover:border-gray-300'}`}
                      >
                        <span className="text-lg">{r.icon}</span>
                        <div className="text-center">
                          <p className={`text-xs font-semibold ${roofType === r.key ? 'text-[#2563EB]' : 'text-gray-700'}`}>{r.label}</p>
                          <p className="text-xs text-gray-400">{r.price > 0 ? `+${formatPrice(r.price)}` : 'Inclus'}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Energy + Climate */}
            {step >= 2 && (
              <div className={`bg-white rounded-2xl p-6 shadow-premium border-2 transition-all ${step === 2 ? 'border-[#2563EB]' : 'border-transparent'}`}>
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-syne font-bold text-lg text-[#0F172A]">{t.configurator.energy}</h3>
                  {step > 2 && <button onClick={() => setStep(2)} className="text-xs text-[#2563EB] hover:underline flex items-center gap-1"><RotateCcw size={11} /> Modifier</button>}
                </div>
                <div className="grid grid-cols-2 gap-3 mb-5">
                  {(Object.entries(CONFIGURATOR_OPTIONS.energy) as [EnergyKey, { label: string; price: number }][]).map(([key, opt]) => (
                    <button
                      key={key}
                      onClick={() => toggleEnergy(key)}
                      className={`flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all duration-200 ${energies.includes(key) ? 'border-[#2563EB] bg-blue-50' : 'border-gray-100 hover:border-gray-300'}`}
                    >
                      <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${energies.includes(key) ? 'bg-[#2563EB] border-[#2563EB]' : 'border-gray-300'}`}>
                        {energies.includes(key) && <Check size={11} className="text-white" />}
                      </div>
                      <div>
                        <p className={`text-xs font-semibold ${energies.includes(key) ? 'text-[#2563EB]' : 'text-gray-700'}`}>{opt.label}</p>
                        <p className="text-xs text-gray-400">+{formatPrice(opt.price)}</p>
                      </div>
                    </button>
                  ))}
                </div>
                <p className="text-sm text-gray-500 mb-3">{t.configurator.climate}</p>
                <div className="grid grid-cols-3 gap-3">
                  {(Object.entries(CONFIGURATOR_OPTIONS.climate) as [ClimateKey, { label: string; price: number }][]).map(([key, opt]) => (
                    <button
                      key={key}
                      onClick={() => toggleClimate(key)}
                      className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${climates.includes(key) ? 'border-[#2563EB] bg-blue-50' : 'border-gray-100 hover:border-gray-300'}`}
                    >
                      <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${climates.includes(key) ? 'bg-[#2563EB] border-[#2563EB]' : 'border-gray-300'}`}>
                        {climates.includes(key) && <Check size={11} className="text-white" />}
                      </div>
                      <div className="text-center">
                        <p className={`text-xs font-semibold ${climates.includes(key) ? 'text-[#2563EB]' : 'text-gray-700'}`}>{opt.label}</p>
                        <p className="text-xs text-gray-400">+{formatPrice(opt.price)}</p>
                      </div>
                    </button>
                  ))}
                </div>
                {step === 2 && (
                  <button onClick={() => setStep(3)} className="w-full mt-5 btn-primary py-3 flex items-center justify-center gap-2 group">
                    Continuer vers le devis <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                )}
              </div>
            )}

            {/* Step 3: Form */}
            {step >= 3 && (
              <div className="bg-white rounded-2xl p-6 shadow-premium border-2 border-[#2563EB]">
                <h3 className="font-syne font-bold text-lg text-[#0F172A] mb-1">{t.configurator.getQuote}</h3>
                <p className="text-sm text-gray-400 mb-5">Recevez votre devis détaillé sous 24h.</p>
                {success ? (
                  <div className="text-center py-6">
                    <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3"><Check size={24} className="text-green-600" /></div>
                    <p className="font-semibold text-[#0F172A]">{t.forms.quote.success}</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-3">
                    {[
                      { placeholder: 'Nom complet', type: 'text', key: 'name' as const, required: true },
                      { placeholder: 'Email', type: 'email', key: 'email' as const, required: true },
                      { placeholder: 'Téléphone (optionnel)', type: 'tel', key: 'phone' as const, required: false },
                    ].map(f => (
                      <input key={f.key} required={f.required} type={f.type} placeholder={f.placeholder} value={form[f.key]}
                        onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]" />
                    ))}
                    <button type="submit" disabled={loading} className="w-full bg-[#2563EB] text-white py-3.5 rounded-xl font-semibold text-sm hover:bg-[#1D4ED8] transition-all flex items-center justify-center gap-2 disabled:opacity-70">
                      {loading && <Loader2 size={14} className="animate-spin" />}
                      {t.forms.quote.submit}
                    </button>
                    <div className="flex items-center gap-1.5 justify-center"><Shield size={11} className="text-green-500" /><span className="text-xs text-gray-400">Données protégées</span></div>
                  </form>
                )}
              </div>
            )}
          </div>

          {/* ── Right: Dollhouse Preview ── */}
          <div className="lg:col-span-2">
            <div className="sticky top-24">
              {/* Dollhouse Preview */}
              <div className="bg-white rounded-2xl overflow-hidden shadow-premium mb-4">
                <div className="flex items-center justify-center bg-gray-50">
                  <img 
                    src={house.images[1]} 
                    alt={t.models[house.key].name}
                    className="w-full max-w-md h-auto object-contain py-8"
                  />
                </div>
                {/* Current config summary */}
                <div className="px-4 pb-4 pt-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-syne font-bold text-base text-[#0F172A]">{t.models[house.key].name}</p>
                      <p className="text-xs text-gray-400">{house.size} m² · {EXTERIOR_TEXTURES.find(s => s.key === exterior)?.label} · {ROOF_OPTIONS.find(r => r.key === roofType)?.label}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-syne font-bold text-lg text-[#2563EB]">{formatPrice(total)}</p>
                      <p className="text-xs text-gray-400">{formatPrice(monthly)}/mois</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Texture quick access */}
              <div className="bg-white rounded-2xl p-4 shadow-premium mb-4">
                <p className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-3">Revêtement extérieur</p>
                <div className="flex items-center gap-2">
                  {EXTERIOR_TEXTURES.map(s => (
                    <button
                      key={s.key}
                      onClick={() => setExterior(s.key)}
                      title={s.label}
                      className={`relative w-9 h-9 rounded-xl border-2 overflow-hidden transition-all duration-200 ${exterior === s.key ? 'ring-2 ring-[#2563EB] ring-offset-2 scale-110' : 'opacity-60 hover:opacity-100'}`}
                    >
                      <img src={s.src} alt={s.label} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Price breakdown */}
              <div className="bg-[#0F172A] rounded-2xl p-5">
                <p className="text-white/40 text-xs uppercase tracking-wider mb-3">Récapitulatif</p>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-sm"><span className="text-white/60">Base ({t.models[house.key].name})</span><span className="text-white font-medium">{formatPrice(basePrice)}</span></div>
                  {extPrice > 0  && <div className="flex justify-between text-sm"><span className="text-white/40">Extérieur</span><span className="text-[#2563EB]">+{formatPrice(extPrice)}</span></div>}
                  {rfPrice > 0   && <div className="flex justify-between text-sm"><span className="text-white/40">Toit</span><span className="text-[#2563EB]">+{formatPrice(rfPrice)}</span></div>}
                  {energies.map(e => <div key={e} className="flex justify-between text-sm"><span className="text-white/40">{CONFIGURATOR_OPTIONS.energy[e].label}</span><span className="text-[#2563EB]">+{formatPrice(CONFIGURATOR_OPTIONS.energy[e].price)}</span></div>)}
                  {climates.map(c => <div key={c} className="flex justify-between text-sm"><span className="text-white/40">{CONFIGURATOR_OPTIONS.climate[c].label}</span><span className="text-[#2563EB]">+{formatPrice(CONFIGURATOR_OPTIONS.climate[c].price)}</span></div>)}
                </div>
                <div className="border-t border-white/10 mt-3 pt-3 flex justify-between items-end">
                  <div>
                    <p className="text-white/40 text-xs">Total</p>
                    <p className="font-syne font-bold text-2xl text-white">{formatPrice(total)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white/40 text-xs">{house.financingMonths} mois</p>
                    <p className="font-semibold text-[#2563EB]">{formatPrice(monthly)}/mois</p>
                  </div>
                </div>
                {step < 3 && (
                  <button onClick={() => setStep(3)} className="w-full mt-4 bg-[#2563EB] text-white py-3 rounded-xl font-semibold text-sm hover:bg-[#1D4ED8] transition-all flex items-center justify-center gap-2 group">
                    {t.configurator.getQuote}
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}