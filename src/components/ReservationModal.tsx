'use client';

import { useState } from 'react';
import { X, Shield, CreditCard, Check, Loader2 } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { HouseModel, formatPrice } from '@/lib/houses';
import { supabase } from '@/lib/supabase';

interface Props {
  house: HouseModel;
  onClose: () => void;
}

export default function ReservationModal({ house, onClose }: Props) {
  const { t } = useI18n();
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const model = t.models[house.key];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // First save pending reservation to Supabase
      const { error: dbError } = await supabase.from('reservations').insert({
        name: form.name,
        email: form.email,
        phone: form.phone,
        model: house.slug,
        status: 'pending_payment',
        amount: 100000,
      });
      if (dbError) throw dbError;

      // Create Stripe checkout session
      const response = await fetch('/api/create-stripe-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          houseName: model.name,
          customerName: form.name,
          customerEmail: form.email,
          customerPhone: form.phone,
        }),
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('Failed to create payment session');
      }
    } catch (err) {
      console.error('Reservation error:', err);
      setError(t.contact.form.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md animate-scaleIn overflow-hidden">
        {/* Header */}
        <div className="bg-[#0F172A] px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-syne font-bold text-xl text-white">{t.forms.reservation.title}</h2>
              <p className="text-white/60 text-sm mt-0.5">{model.name} · {house.size} m²</p>
            </div>
            <button onClick={onClose} className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-white hover:bg-white/20 transition-colors">
              <X size={16} />
            </button>
          </div>
        </div>

          <form onSubmit={handleSubmit} className="p-6">
            {/* Deposit Info */}
            <div className="bg-blue-50 rounded-xl p-4 mb-5 flex items-center gap-4">
              <div className="w-12 h-12 bg-[#2563EB] rounded-xl flex items-center justify-center flex-shrink-0">
                <CreditCard size={22} className="text-white" />
              </div>
              <div>
                <p className="font-syne font-bold text-lg text-[#0F172A]">{t.forms.reservation.amount}</p>
                <p className="text-xs text-gray-500">{t.forms.reservation.deposit}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1.5">{t.forms.quote.name} *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-all"
                  placeholder="Jean Dupont"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1.5">{t.forms.quote.email} *</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-all"
                  placeholder="jean@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1.5">{t.forms.quote.phone}</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-all"
                  placeholder="+32 xxx xx xx xx"
                />
              </div>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm">{error}</div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-5 flex items-center justify-center gap-2 bg-[#2563EB] text-white py-3.5 rounded-xl font-semibold text-sm hover:bg-[#1D4ED8] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <CreditCard size={16} />}
              {t.forms.reservation.pay}
            </button>

            <div className="flex items-center gap-2 mt-3 justify-center">
              <Shield size={13} className="text-green-500" />
              <p className="text-xs text-gray-400">{t.forms.reservation.secure}</p>
            </div>
          </form>
      </div>
    </div>
  );
}