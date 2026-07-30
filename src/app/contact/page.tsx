'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useI18n } from '@/lib/i18n';
import { HOUSES } from '@/lib/houses';
import { MapPin, Phone, Mail, Clock, Send, Check, Loader2, MessageCircle, FileText, Users, Wrench } from 'lucide-react';
import { supabase } from '@/lib/supabase';

type FormType = 'contact' | 'quote' | 'distributor' | 'installer';

function ContactPageContent() {
  const searchParams = useSearchParams();
  const { t } = useI18n();
  const FORM_TYPES: { key: FormType; label: string; icon: typeof Send; desc: string }[] = [
    { key: 'contact', label: t.contact.formTypes.contact.label, icon: MessageCircle, desc: t.contact.formTypes.contact.desc },
    { key: 'quote', label: t.contact.formTypes.quote.label, icon: FileText, desc: t.contact.formTypes.quote.desc },
    { key: 'distributor', label: t.contact.formTypes.distributor.label, icon: Users, desc: t.contact.formTypes.distributor.desc },
    { key: 'installer', label: t.contact.formTypes.installer.label, icon: Wrench, desc: t.contact.formTypes.installer.desc },
  ];
  const [formType, setFormType] = useState<FormType>('contact');
  const [form, setForm] = useState({
    name: '', email: '', phone: '', company: '',
    subject: '', message: '', model: '', region: '',
  });

  // Auto-select quote form and pre-fill model if coming from house page
  useEffect(() => {
    const quoteSlug = searchParams.get('quote');
    if (quoteSlug) {
      setFormType('quote');
      // Map house slugs to select option values to match the dropdown options
      const slugToModelValue: Record<string, string> = {
        'modura-etudiante': 'maison-etudiante',
        'modura-tiny': 'tiny-house',
        'modura-apartment': 'maison-appartement',
        'modura-family': 'maison-familiale',
        'modura-foldable': 'maison-depliable',
        'modura-space': 'space-capsule',
      };
      const modelValue = slugToModelValue[quoteSlug];
      if (modelValue) {
        setForm(prev => ({
          ...prev,
          model: modelValue
        }));
      }
    }
  }, [searchParams]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // 1. Save to Supabase database
      await supabase.from('leads').insert({
        type: formType === 'contact' ? 'contact' : formType === 'quote' ? 'quote' : formType === 'distributor' ? 'distributor' : 'installer',
        name: form.name,
        email: form.email,
        phone: form.phone,
        company: form.company,
        model: form.model,
        region: form.region,
        message: form.subject ? `${form.subject}: ${form.message}` : form.message,
      });

      // 2. Send email to info@modura.be
      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: formType,
          name: form.name,
          email: form.email,
          phone: form.phone,
          model: form.model,
          subject: form.subject,
          message: form.subject ? `${form.subject}: ${form.message}` : form.message,
        }),
      });

      setSuccess(true);
    } catch (err) {
      console.error('Error submitting contact form:', err);
      setError(t.contact.form.error);
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
              {t.contact.title}
            </span>
            <h1 className="font-syne font-bold text-4xl md:text-5xl text-white mb-3">{t.contact.title}</h1>
            <p className="text-white/60 text-lg">{t.contact.subtitle}</p>
          </div>
        </div>
      </section>

      <div className="container-wide py-12">
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Left: Info */}
          <div>
            {/* Contact Cards */}
            <div className="space-y-3 mb-8">
              {[
                { icon: MapPin, label: t.contact.info.addressLabel, value: t.contact.info.address },
                { icon: Phone, label: t.contact.info.phoneLabel, value: t.contact.info.phone },
                { icon: Mail, label: t.contact.info.emailLabel, value: t.contact.info.email },
                { icon: Clock, label: t.contact.info.hoursLabel, value: t.contact.info.hours },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="flex items-center gap-4 bg-[#F8FAFC] rounded-xl p-4 border border-gray-100">
                    <div className="w-10 h-10 bg-[#2563EB]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon size={18} className="text-[#2563EB]" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{item.label}</p>
                      <p className="text-sm font-semibold text-[#0F172A]">{item.value}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Map placeholder */}
            <div className="rounded-2xl overflow-hidden border border-gray-100 h-52 bg-gray-100 relative">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1257680.9399745456!2d3.0609868729498657!3d50.503887!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c17d64b48c8e4d%3A0x108ffc98bb91b2ce!2sBelgium!5e0!3m2!1sen!2sbe!4v1704000000000!5m2!1sen!2sbe"
                className="w-full h-full"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            {/* Countries */}
            <div className="mt-5 bg-[#F8FAFC] rounded-2xl p-5 border border-gray-100">
              <p className="font-semibold text-sm text-[#0F172A] mb-3">Zones de livraison</p>
              <div className="flex flex-wrap gap-2">
                {['🇧🇪 Belgique', '🇫🇷 France', '🇳🇱 Pays-Bas'].map((country) => (
                  <span key={country} className="label-badge bg-blue-50 text-[#2563EB] text-xs">{country}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <div className="lg:col-span-2">
            {/* Form Type Selector */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {FORM_TYPES.map((ft) => {
                const Icon = ft.icon;
                return (
                  <button
                    key={ft.key}
                    onClick={() => { setFormType(ft.key); setSuccess(false); }}
                    className={`flex flex-col items-center text-center gap-2 p-3.5 rounded-xl border-2 transition-all duration-200 ${
                      formType === ft.key
                        ? 'border-[#2563EB] bg-blue-50'
                        : 'border-gray-100 hover:border-gray-300 bg-[#F8FAFC]'
                    }`}
                  >
                    <Icon size={18} className={formType === ft.key ? 'text-[#2563EB]' : 'text-gray-500'} />
                    <div>
                      <p className={`text-xs font-semibold ${formType === ft.key ? 'text-[#2563EB]' : 'text-gray-700'}`}>{ft.label}</p>
                      <p className="text-xs text-gray-400 hidden md:block mt-0.5 leading-tight">{ft.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="bg-[#F8FAFC] rounded-2xl p-7 border border-gray-100">
              {success ? (
                <div className="text-center py-10">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check size={28} className="text-green-600" />
                  </div>
                  <h3 className="font-syne font-bold text-xl text-[#0F172A] mb-2">{t.contact.form.successTitle}</h3>
                  <p className="text-gray-500 text-sm max-w-xs mx-auto">{t.contact.form.success}</p>
                  <button
                    onClick={() => { setSuccess(false); setForm({ name: '', email: '', phone: '', company: '', subject: '', message: '', model: '', region: '' }); }}
                    className="mt-5 btn-primary"
                  >
                    {t.contact.form.newMessage}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h3 className="font-syne font-bold text-lg text-[#0F172A] mb-1">
                    {FORM_TYPES.find((f) => f.key === formType)?.label}
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#374151] mb-1.5">{t.contact.form.name} *</label>
                      <input
                        required
                        type="text"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full border border-gray-200 bg-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
                        placeholder="Jean Dupont"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#374151] mb-1.5">{t.contact.form.email} *</label>
                      <input
                        required
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full border border-gray-200 bg-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
                        placeholder="jean@email.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#374151] mb-1.5">{t.contact.form.phone}</label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="w-full border border-gray-200 bg-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
                        placeholder="+32 xxx xx xx xx"
                      />
                    </div>
                    {(formType === 'distributor' || formType === 'installer') && (
                      <div>
                        <label className="block text-sm font-medium text-[#374151] mb-1.5">{t.distributeurs.form.company}</label>
                        <input
                          type="text"
                          value={form.company}
                          onChange={(e) => setForm({ ...form, company: e.target.value })}
                          className="w-full border border-gray-200 bg-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
                          placeholder="Votre société"
                        />
                      </div>
                    )}
                    {formType === 'quote' && (
                      <div>
                        <label className="block text-sm font-medium text-[#374151] mb-1.5">{t.forms.quote.model}</label>
                        <select
                          value={form.model}
                          onChange={(e) => setForm({ ...form, model: e.target.value })}
                          className="w-full border border-gray-200 bg-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
                        >
                          <option value="">{t.forms.quote.model}</option>
                          <option value="maison-etudiante">Maison Étudiante (15 m²)</option>
                          <option value="tiny-house">Tiny House (40 m²)</option>
                          <option value="maison-appartement">Maison Appartement (60 m²)</option>
                          <option value="maison-familiale">Maison Familiale (120 m²)</option>
                          <option value="maison-depliable">Maison Dépliable (40 m²)</option>
                          <option value="space-capsule">Space Capsule (40 m²)</option>
                        </select>
                      </div>
                    )}
                  </div>

                  {formType === 'contact' && (
                    <div>
                      <label className="block text-sm font-medium text-[#374151] mb-1.5">{t.contact.form.subject}</label>
                      <input
                        type="text"
                        value={form.subject}
                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                        className="w-full border border-gray-200 bg-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
                        placeholder={t.contact.form.subject}
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-[#374151] mb-1.5">{t.contact.form.message}</label>
                    <textarea
                      required
                      rows={5}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full border border-gray-200 bg-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] resize-none"
                      placeholder={t.contact.form.message}
                    />
                  </div>

                  {error && <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm">{error}</div>}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-[#2563EB] text-white py-4 rounded-xl font-semibold hover:bg-[#1D4ED8] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                    {t.contact.form.send}
                  </button>
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

export default function ContactPage() {
  return (
    <Suspense fallback={null}>
      <ContactPageContent />
    </Suspense>
  );
}