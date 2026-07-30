'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useI18n } from '@/lib/i18n';
import { supabase } from '@/lib/supabase';
import {
  Users, TrendingUp, Download, BarChart2, Check, ArrowRight,
  Loader2, Star, Shield, Globe, Briefcase
} from 'lucide-react';

type Tab = 'info' | 'apply' | 'portal';

export default function DistributeursPage() {
  const { t } = useI18n();
  const [tab, setTab] = useState<Tab>('info');
  const [form, setForm] = useState({
    name: '', email: '', phone: '', company: '',
    region: '', type: 'Distributeur', message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [portalEmail, setPortalEmail] = useState('');
  const [portalPassword, setPortalPassword] = useState('');

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
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="relative bg-[#0F172A] pt-28 pb-20 overflow-hidden">
        <div
          className="absolute inset-0 opacity-15 bg-cover bg-center"
          style={{ backgroundImage: `url('/Distibuteur/Planner5d_AI_Studio_nano-banana-1-image-1.jpg')` }}
        />
        <div className="container-wide relative">
          <div className="max-w-3xl">
            <span className="label-badge bg-white/10 text-white/60 mb-4">
              <Users size={12} />
              {t.distributeurs.partners || 'Partenaires'}
            </span>
            <h1 className="font-syne font-bold text-4xl md:text-5xl lg:text-6xl text-white mb-5">
              {t.distributeurs.title}
            </h1>
            <p className="text-white/60 text-xl leading-relaxed mb-8">{t.distributeurs.subtitle}</p>
            <div className="flex flex-wrap gap-3">
              {t.distributeurs.benefits.map((benefit: string, i: number) => (
                <span key={i} className="flex items-center gap-1.5 bg-white/10 text-white/80 text-sm px-3 py-1.5 rounded-full border border-white/10">
                  <Check size={12} className="text-[#2563EB]" />
                  {benefit}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-100 sticky top-16 z-30">
        <div className="container-wide">
          <div className="flex">
            {[
              { key: 'info' as Tab, label: 'Programme', icon: Star },
              { key: 'apply' as Tab, label: 'Candidater', icon: ArrowRight },
              // Portal tab hidden - will be enabled later when distributor portal is fully functional
              // { key: 'portal' as Tab, label: 'Portail Distributeur', icon: BarChart2 },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.key}
                  onClick={() => setTab(item.key)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-semibold border-b-2 transition-all duration-200 ${
                    tab === item.key
                      ? 'border-[#2563EB] text-[#2563EB]'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
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
        {/* Info Tab */}
        {tab === 'info' && (
          <div>
            {/* Commission Tiers */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {[
                { title: 'Apporteur d\'affaires', commission: '5–10%', desc: 'Apportez des leads qualifiés et touchez une commission sur chaque vente', icon: Globe, color: 'bg-blue-50 text-[#2563EB]' },
                { title: 'Distributeur', commission: '15–25%', desc: 'Vendez nos maisons dans votre région avec accès au portail exclusif', icon: Briefcase, color: 'bg-green-50 text-green-600', highlight: true },
                { title: 'Installateur Certifié', commission: '20–33%', desc: 'Installez et maintenez les maisons MODURA avec formation complète', icon: Shield, color: 'bg-purple-50 text-purple-600' },
              ].map((tier, i) => {
                const Icon = tier.icon;
                return (
                  <div key={i} className={`rounded-2xl p-6 border-2 transition-all ${tier.highlight ? 'border-[#2563EB] shadow-premium' : 'border-gray-100'}`}>
                    <div className={`w-12 h-12 rounded-xl ${tier.color} flex items-center justify-center mb-4`}>
                      <Icon size={22} />
                    </div>
                    {tier.highlight && <span className="label-badge bg-[#2563EB] text-white text-xs mb-3">Recommandé</span>}
                    <h3 className="font-syne font-bold text-xl text-[#0F172A] mb-1">{tier.title}</h3>
                    <p className="font-syne font-bold text-3xl text-[#2563EB] mb-3">{tier.commission}</p>
                    <p className="text-[#6B7280] text-sm leading-relaxed mb-5">{tier.desc}</p>
                    <button
                      onClick={() => setTab('apply')}
                      className={`w-full py-3 rounded-xl font-semibold text-sm transition-all ${
                        tier.highlight
                          ? 'bg-[#2563EB] text-white hover:bg-[#1D4ED8]'
                          : 'border border-gray-200 text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      Postuler
                    </button>
                  </div>
                );
              })}
            </div>

            {/* How It Works */}
            <div className="bg-[#F8FAFC] rounded-3xl p-8 border border-gray-100">
              <h2 className="font-syne font-bold text-2xl text-[#0F172A] mb-8 text-center">{t.distributeurs.howItWorks}</h2>
              <div className="grid md:grid-cols-4 gap-6">
                {t.distributeurs.steps.map((step: {number: string, title: string, desc: string}, i: number) => (
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

        {/* Apply Tab */}
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
                        {t.distributeurs.form.typeOptions.map((opt: string) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
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
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-[#2563EB] text-white py-4 rounded-xl font-semibold hover:bg-[#1D4ED8] transition-all disabled:opacity-70"
                  >
                    {loading ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={16} />}
                    {t.distributeurs.form.submit}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* Portal Tab */}
        {tab === 'portal' && (
          <div className="max-w-md mx-auto">
            <div className="bg-[#0F172A] rounded-3xl p-8 text-center">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <BarChart2 size={28} className="text-white" />
              </div>
              <h2 className="font-syne font-bold text-2xl text-white mb-2">{t.distributeurs.portal.title}</h2>
              <p className="text-white/50 text-sm mb-6">Accès réservé aux distributeurs certifiés MODURA</p>

              <div className="space-y-3 text-left mb-6">
                <div>
                  <label className="block text-xs text-white/50 mb-1.5 font-medium uppercase tracking-wide">{t.distributeurs.portal.email}</label>
                  <input
                    type="email"
                    value={portalEmail}
                    onChange={(e) => setPortalEmail(e.target.value)}
                    className="w-full bg-white/10 border border-white/10 text-white placeholder-white/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2563EB]/50 focus:bg-white/15 transition-all"
                    placeholder="votre@email.com"
                  />
                </div>
                <div>
                  <label className="block text-xs text-white/50 mb-1.5 font-medium uppercase tracking-wide">{t.distributeurs.portal.password}</label>
                  <input
                    type="password"
                    value={portalPassword}
                    onChange={(e) => setPortalPassword(e.target.value)}
                    className="w-full bg-white/10 border border-white/10 text-white placeholder-white/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2563EB]/50 focus:bg-white/15 transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                onClick={() => alert('Fonctionnalité réservée aux distributeurs. Postulez d\'abord.')}
                className="w-full bg-[#2563EB] text-white py-3.5 rounded-xl font-semibold hover:bg-[#1D4ED8] transition-all flex items-center justify-center gap-2 mb-4"
              >
                {t.distributeurs.portal.login}
              </button>
              <button
                onClick={() => setTab('apply')}
                className="text-white/50 text-xs hover:text-white/80 transition-colors"
              >
                Pas encore distributeur ? → Postuler
              </button>
            </div>

            {/* Portal Features Preview */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              {[
                { icon: BarChart2, label: 'Dashboard analytique' },
                { icon: Users, label: 'Gestion des leads' },
                { icon: TrendingUp, label: 'Suivi des commissions' },
                { icon: Download, label: 'Outils marketing' },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="flex items-center gap-3 bg-[#F8FAFC] rounded-xl p-3 border border-gray-100">
                    <div className="w-8 h-8 bg-[#2563EB]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon size={15} className="text-[#2563EB]" />
                    </div>
                    <p className="text-xs font-medium text-[#374151]">{item.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}