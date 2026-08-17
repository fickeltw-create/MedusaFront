'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useI18n } from '@/lib/i18n';
import { supabase } from '@/lib/supabase';
import { Users, ArrowRight, Loader2, Check, Star, Shield, Globe, Briefcase, TrendingUp, Download, BarChart2 } from 'lucide-react';

type Tab = 'info' | 'apply' | 'portal';

export default function DistributeursPage() {
  const { t } = useI18n();
  const [tab, setTab] = useState<Tab>('info');
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', region: '', type: 'Distributeur', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await supabase.from('leads').insert({
        type: form.type === 'Installateur' ? 'installer' : 'distributor',
        name: form.name,
        email: form.email,
        phone: form.phone,
        company: form.company,
        region: form.region,
        partnership_type: form.type,
        message: form.message,
      });
      setSuccess(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      <section className="relative bg-[#0F172A] pt-28 pb-20 overflow-hidden">
        <div className="absolute inset-0 opacity-15 bg-cover bg-center" style={{ backgroundImage: `url('/Distibuteur/Planner5d_AI_Studio_nano-banana-1-image-1.jpg')` }} />
        <div className="container-wide relative">
          <div className="max-w-3xl">
            <span className="label-badge bg-white/10 text-white/60 mb-4">
              <Users size={12} />
              {t.distributeurs.partners || 'Partenaires'}
            </span>
            <h1 className="font-syne font-bold text-4xl md:text-5xl lg:text-6xl text-white mb-5">{t.distributeurs.title}</h1>
            <p className="text-white/60 text-xl leading-relaxed mb-8">{t.distributeurs.subtitle}</p>
          </div>
        </div>
      </section>

      <div className="bg-white border-b border-gray-100 sticky top-16 z-30">
        <div className="container-wide">
          <div className="flex">
            {[{ key: 'info' as Tab, label: 'Programme', icon: Star }, { key: 'apply' as Tab, label: 'Candidater', icon: ArrowRight }].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.key}
                  onClick={() => setTab(item.key)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-semibold border-b-2 transition-all duration-200 ${tab === item.key ? 'border-[#2563EB] text-[#2563EB]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                  <Icon size={16} />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="container-wide py-12">
        {tab === 'info' && (
          <div>
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {[
                { title: "Apporteurs d'affaires", commission: '2 à 5%', desc: 'Apportez des leads qualifiés et touchez une commission sur chaque vente.', icon: Globe, color: 'bg-blue-50 text-[#2563EB]' },
                { title: 'Distributeurs', commission: '25 à 50%', desc: 'Développez votre réseau et distribuez les maisons MODURA dans votre région.', icon: Briefcase, color: 'bg-green-50 text-green-600', highlight: true },
                { title: 'Installateurs', commission: '10 à 25%', desc: 'Installez et maintenez les maisons MODURA avec formation complète.', icon: Shield, color: 'bg-purple-50 text-purple-600' },
              ].map((tier, i) => {
                const Icon = tier.icon;
                return (
                  <div key={i} className={`rounded-2xl p-6 border-2 transition-all ${tier.highlight ? 'border-[#2563EB] shadow-lg' : 'border-gray-100'}`}>
                    <div className={`w-12 h-12 rounded-xl ${tier.color} flex items-center justify-center mb-4`}>
                      <Icon size={22} />
                    </div>
                    {tier.highlight && <span className="label-badge bg-[#2563EB] text-white text-xs mb-3">Recommandé</span>}
                    <h3 className="font-syne font-bold text-xl text-[#0F172A] mb-1">{tier.title}</h3>
                    <p className="font-syne font-bold text-3xl text-[#2563EB] mb-3">{tier.commission}</p>
                    <p className="text-[#6B7280] text-sm leading-relaxed mb-5">{tier.desc}</p>
                    <button onClick={() => setTab('apply')} className={`w-full py-3 rounded-xl font-semibold text-sm transition-all ${tier.highlight ? 'bg-[#2563EB] text-white hover:bg-[#1D4ED8]' : 'border border-gray-200 text-gray-700 hover:border-gray-400'}`}>
                      Postuler
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="bg-[#F8FAFC] rounded-3xl p-8 border border-gray-100">
              <h2 className="font-syne font-bold text-2xl text-[#0F172A] mb-8 text-center">{t.distributeurs.howItWorks}</h2>
              <div className="grid md:grid-cols-4 gap-6">
                {t.distributeurs.steps.map((step: { number: string; title: string; desc: string }, i: number) => (
                  <div key={i} className="text-center">
                    <div className="w-12 h-12 bg-[#2563EB] rounded-xl flex items-center justify-center mx-auto mb-3">
                      <span className="font-syne font-bold text-white text-sm">{step.number}</span>
                    </div>
                    <h4 className="font-semibold text-[#0F172A] mb-1">{step.title}</h4>
                    <p className="text-xs text-gray-500 leading-relaxed">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === 'apply' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-[#F8FAFC] rounded-2xl p-8 border border-gray-100">
              <h2 className="font-syne font-bold text-2xl text-[#0F172A] mb-1">{t.distributeurs.form.submit}</h2>
              <p className="text-gray-500 text-sm mb-6">Nous examinerons votre candidature et vous répondrons sous 48h.</p>

              {success ? (
                <div className="text-center py-10">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check size={28} className="text-green-600" />
                  </div>
                  <h3 className="font-syne font-bold text-xl text-[#0F172A] mb-2">Candidature reçue !</h3>
                  <p className="text-gray-500 text-sm">Notre équipe partenariat vous contactera sous 48h.</p>
                </div>
              ) : (
                <form onSubmit={handleApply} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      { label: t.distributeurs.form.name, key: 'name' as const, type: 'text', placeholder: 'Jean Dupont', required: true },
                      { label: t.distributeurs.form.email, key: 'email' as const, type: 'email', placeholder: 'pro@email.com', required: true },
                      { label: t.distributeurs.form.phone, key: 'phone' as const, type: 'tel', placeholder: '+32 xxx', required: false },
                      { label: t.distributeurs.form.company, key: 'company' as const, type: 'text', placeholder: 'Société SA', required: false },
                      { label: t.distributeurs.form.region, key: 'region' as const, type: 'text', placeholder: 'Bruxelles, Wallonie...', required: false },
                    ].map((field) => (
                      <div key={field.key}>
                        <label className="block text-sm font-medium text-[#374151] mb-1.5">{field.label}{field.required && ' *'}</label>
                        <input
                          required={field.required}
                          type={field.type}
                          value={form[field.key]}
                          onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                          className="w-full border border-gray-200 bg-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
                          placeholder={field.placeholder}
                        />
                      </div>
                    ))}
                    <div>
                      <label className="block text-sm font-medium text-[#374151] mb-1.5">{t.distributeurs.form.type} *</label>
                      <select
                        value={form.type}
                        onChange={(e) => setForm({ ...form, type: e.target.value })}
                        className="w-full border border-gray-200 bg-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
                      >
                        {t.distributeurs.form.typeOptions.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#374151] mb-1.5">{t.distributeurs.form.message}</label>
                    <textarea
                      rows={4}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full border border-gray-200 bg-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] resize-none"
                      placeholder="Décrivez votre projet, votre expérience..."
                    />
                  </div>
                  <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 bg-[#2563EB] text-white py-4 rounded-xl font-semibold hover:bg-[#1D4ED8] transition-all disabled:opacity-70">
                    {loading ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={16} />}
                    {t.distributeurs.form.submit}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {tab === 'portal' && null}
      </div>

      <Footer />
    </main>
  );
}
