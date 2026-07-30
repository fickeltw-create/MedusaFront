'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useI18n } from '@/lib/i18n';
import { ENERGY_PRODUCTS, formatPrice } from '@/lib/houses';
import { Zap, Thermometer, Wind, Droplets, ShoppingCart, Check, ArrowRight, Sun } from 'lucide-react';

const PRODUCT_ICONS = [Sun, Zap, Thermometer, Wind, Droplets];
const PRODUCT_COLORS = [
  'from-yellow-400 to-orange-500',
  'from-blue-500 to-cyan-500',
  'from-red-500 to-pink-500',
  'from-teal-500 to-emerald-500',
  'from-blue-400 to-blue-600',
];
const PRODUCT_BG = [
  '/Solutions%20%C3%89nerg%C3%A9tiques/KitSolaire5kW.jpg',
  '/Solutions%20%C3%89nerg%C3%A9tiques/Kit%20Solaire%2010kW.jpg',
  '/Solutions%20%C3%89nerg%C3%A9tiques/Syst%C3%A8meChauffage%26Climatisation.jpg',
  '/Solutions%20%C3%89nerg%C3%A9tiques/Syst%C3%A8me%20de%20Ventilation.jpg',
  '/Solutions%20%C3%89nerg%C3%A9tiques/R%C3%A9cup%C3%A9ration%20Eau%20de%20Pluie.jpg',
];
const PRODUCT_SLUGS = [
  'kit-solaire-5kw',
  'kit-solaire-10kw',
  'systeme-chauffage-climatisation',
  'systeme-ventilation',
  'recuperation-eau-pluie'
];

export default function EnergiePage() {
  const { t } = useI18n();
  const [cart, setCart] = useState<string[]>([]);

  const toggle = (id: string) => {
    setCart((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  const totalCart = ENERGY_PRODUCTS.filter((p) => cart.includes(p.id)).reduce((sum, p) => sum + p.price, 0);
  const products = t.energy.products;

  const productList = [
    { ...ENERGY_PRODUCTS[0], ...products.solar5, key: 'solar5' },
    { ...ENERGY_PRODUCTS[1], ...products.solar10, key: 'solar10' },
    { ...ENERGY_PRODUCTS[2], ...products.heating, key: 'heating' },
    { ...ENERGY_PRODUCTS[3], ...products.ventilation, key: 'ventilation' },
    { ...ENERGY_PRODUCTS[4], ...products.rainwater, key: 'rainwater' },
  ];

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="relative bg-[#0F172A] pt-28 pb-24 overflow-hidden">
        <div
          className="absolute inset-0 opacity-15 bg-cover bg-center"
          style={{ backgroundImage: `url('/Solutions%20%C3%89nerg%C3%A9tiques/HeroBanner(image%20de%20fond%20en%20haut).jpg')` }}
        />
        <div className="container-wide relative">
          <div className="max-w-3xl">
            <span className="label-badge bg-yellow-500/20 text-yellow-400 mb-4">
              <Zap size={12} />
              {t.energy.title}
            </span>
            <h1 className="font-syne font-bold text-4xl md:text-5xl lg:text-6xl text-white mb-5">{t.energy.title}</h1>
            <p className="text-white/60 text-xl leading-relaxed">{t.energy.subtitle}</p>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-16">
        <div className="container-wide">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
            {productList.map((product, i) => {
              const Icon = PRODUCT_ICONS[i];
              const inCart = cart.includes(product.id);
              return (
                <div
                  key={product.id}
                  className={`bg-white rounded-2xl overflow-hidden border-2 transition-all duration-300 shadow-premium ${
                    inCart ? 'border-[#2563EB] shadow-blue-100' : 'border-gray-100 hover:shadow-premium-hover'
                  }`}
                >
                  {/* Image */}
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={PRODUCT_BG[i]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-black/15 to-black/10" />
                    <div className={`absolute top-4 left-4 w-10 h-10 rounded-xl bg-gradient-to-br ${PRODUCT_COLORS[i]} flex items-center justify-center`}>
                      <Icon size={20} className="text-white" />
                    </div>
                    {product.id === 'solar5' && (
                      <span className="absolute top-4 right-4 label-badge bg-yellow-500 text-white text-xs">Populaire</span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="font-syne font-bold text-lg text-[#0F172A] mb-2">{product.name}</h3>
                    <p className="text-[#6B7280] text-sm leading-relaxed mb-5">{product.desc}</p>

                    {/* Price */}
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="font-syne font-bold text-2xl text-[#0F172A]">{formatPrice(product.price)}</p>
                        <p className="text-xs text-gray-400">Pose incluse</p>
                      </div>
                      {'watts' in product && product.watts && (
                        <div className="text-right">
                          <p className="font-bold text-[#2563EB]">{product.watts / 1000} kW</p>
                          <p className="text-xs text-gray-400">Puissance</p>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <Link
                      href={`/energie/${PRODUCT_SLUGS[i]}`}
                      className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
                        inCart
                          ? 'bg-[#2563EB] text-white hover:bg-[#1D4ED8]'
                          : 'border border-[#0F172A] text-[#0F172A] hover:bg-gray-50'
                      }`}
                    >
                      <ArrowRight size={15} />
                      {t.energy.learnMore}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Cart Summary */}
          {cart.length > 0 && (
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-md px-4">
              <div className="bg-[#0F172A] rounded-2xl p-4 shadow-2xl flex items-center justify-between">
                <div>
                  <p className="text-white font-semibold text-sm">{cart.length} option{cart.length > 1 ? 's' : ''} sélectionnée{cart.length > 1 ? 's' : ''}</p>
                  <p className="text-white/60 text-xs">{formatPrice(totalCart)}</p>
                </div>
                <button className="flex items-center gap-2 bg-[#2563EB] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#1D4ED8] transition-all">
                  Ajouter à mon devis
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* Info Section */}
          <div className="mt-16 bg-[#F8FAFC] rounded-3xl p-8 border border-gray-100">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              {t.energy.stats.map((info: any, i: number) => (
                <div key={i}>
                  <p className="font-syne font-bold text-3xl text-[#0F172A] mb-1">{info.value}</p>
                  <p className="font-semibold text-sm text-[#374151] mb-1">{info.title}</p>
                  <p className="text-xs text-gray-400">{info.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}