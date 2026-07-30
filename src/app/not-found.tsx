'use client';

import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="font-syne font-bold text-8xl text-white/10 mb-4">404</div>
        <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Home size={28} className="text-white/50" />
        </div>
        <h1 className="font-syne font-bold text-2xl text-white mb-3">Page introuvable</h1>
        <p className="text-white/50 text-sm mb-8">Cette page n'existe pas ou a été déplacée.</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-[#2563EB] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#1D4ED8] transition-all"
        >
          <ArrowLeft size={16} />
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}
