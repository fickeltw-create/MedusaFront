'use client';

import { useState } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ExteriorColor, RoofType } from '@/components/HouseViewer';
import { useI18n } from '@/lib/i18n';
import { HOUSES, formatPrice } from '@/lib/houses';
import {
  ArrowRight, Check, ChevronLeft, ChevronRight,
  Download, Calendar, Truck, Factory, CreditCard, Shield,
  Palette, Home, Maximize2
} from 'lucide-react';
import ReservationModal from '@/components/ReservationModal';

const SWATCHES: { key: ExteriorColor; color: string; border: string; label: string }[] = [
  { key: 'white',    color: '#F2F0EB', border: '#C8C4BC', label: 'Blanc' },
  { key: 'black',    color: '#282828', border: '#282828', label: 'Noir' },
  { key: 'wood',     color: '#C2865A', border: '#9A6640', label: 'Bois' },
  { key: 'concrete', color: '#A2A4A7', border: '#828486', label: 'Béton' },
];

const ROOF_OPTIONS: { key: RoofType; label: string; icon: string }[] = [
  { key: 'flat',    label: 'Toit plat',     icon: '▬' },
  { key: 'pitched', label: 'Pente',         icon: '▲' },
  { key: 'metal',   label: 'Métal',         icon: '◆' },
];

export default function HouseDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const { t } = useI18n();

  const [activeTab, setActiveTab] = useState<'features' | 'specs' | 'delivery'>('features');
  const [showReservation, setShowReservation] = useState(false);
  const [exterior, setExterior] = useState<ExteriorColor>('white');
  const [roofType, setRoofType] = useState<RoofType>('flat');
  const [viewMode, setViewMode] = useState<'3d' | 'photo'>('3d');
  const [photoIndex, setPhotoIndex] = useState(0);

  const house = HOUSES.find(h => h.slug === slug);
  if (!house) notFound();
  const model = t.models[house.key];

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* Breadcrumb */}
      <div className="pt-20 bg-[#F8FAFC] border-b border-gray-100">
        <div className="container-wide py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-[#2563EB]">{t.nav.home}</Link>
            <span>/</span>
            <Link href="/catalogue" className="hover:text-[#2563EB]">{t.catalog.catalogTitle}</Link>
            <span>/</span>
            <span className="text-[#0F172A] font-medium">{model.name}</span>
          </nav>
        </div>
      </div>

      <div className="container-wide py-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* ── Left: Photos (static) ── */}
          <div>
            <div className="relative rounded-2xl overflow-hidden group aspect-[4/3] shadow-premium">
              <img src={house.images[photoIndex]} alt={model.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
              {house.badge && <span className="absolute top-4 left-4 label-badge bg-[#2563EB] text-white">{house.badge}</span>}
              <button onClick={() => setPhotoIndex(i => (i - 1 + house.images.length) % house.images.length)}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 backdrop-blur rounded-xl flex items-center justify-center hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronLeft size={18} />
              </button>
              <button onClick={() => setPhotoIndex(i => (i + 1) % house.images.length)}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 backdrop-blur rounded-xl flex items-center justify-center hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronRight size={18} />
              </button>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {house.images.map((_, i) => (
                  <button key={i} onClick={() => setPhotoIndex(i)}
                    className={`rounded-full transition-all ${i === photoIndex ? 'bg-white w-4 h-1.5' : 'bg-white/50 w-1.5 h-1.5'}`} />
                ))}
              </div>
            </div>
            <div className="flex gap-2 mt-2">
              {house.images.map((img, i) => (
                <button key={i} onClick={() => setPhotoIndex(i)}
                  className={`flex-1 aspect-square rounded-xl overflow-hidden border-2 transition-all ${photoIndex === i ? 'border-[#2563EB]' : 'border-transparent opacity-60 hover:opacity-80'}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
            {/* Quick config CTA */}
          </div>

          {/* ── Right: Details ── */}
          <div>
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="label-badge bg-[#0F172A] text-white">{house.size} m²</span>
                <span className="label-badge bg-green-50 text-green-700">-{house.discount}%</span>
                {house.isNew && <span className="label-badge bg-blue-50 text-blue-700">{t.catalog.newLabel}</span>}
              </div>
              <h1 className="font-syne font-extrabold text-3xl md:text-4xl text-[#0F172A] mb-2">{model.name}</h1>
              <p className="text-[#6B7280] text-base leading-relaxed">{model.description}</p>
            </div>

            {/* Pricing */}
            <div className="bg-[#F8FAFC] rounded-2xl p-6 mb-6 border border-gray-100">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-400 line-through mb-1">{formatPrice(house.marketPrice)} (marché)</p>
                  <p className="font-syne font-extrabold text-4xl text-[#0F172A]">{formatPrice(house.price)}</p>
                  <p className="text-[#6B7280] text-sm mt-0.5">excl. terrain</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Prix catalogue</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button onClick={() => setShowReservation(true)}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#2563EB] text-white py-3.5 rounded-xl font-semibold text-sm hover:bg-[#1D4ED8] transition-all hover:-translate-y-0.5 hover:shadow-lg">
                  <CreditCard size={16} />Réserver (1.000€)
                </button>
                <Link href={`/contact?quote=${house.slug}`}
                  className="flex-1 flex items-center justify-center gap-2 border border-[#0F172A] text-[#0F172A] py-3.5 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-all">
                  Demander un devis
                </Link>
              </div>
              <div className="flex items-center gap-2 mt-3 justify-center">
                <Shield size={13} className="text-green-500" />
                <p className="text-xs text-gray-400">Paiement sécurisé · Acompte remboursable</p>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 mb-5">
              {(['features', 'specs', 'delivery'] as const).map(tab => {
                const labels = { features: t.catalog.features, specs: t.catalog.specs, delivery: t.catalog.delivery };
                return (
                  <button key={tab} onClick={() => setActiveTab(tab)}
                    className={`pb-3 px-4 text-sm font-semibold border-b-2 transition-all ${activeTab === tab ? 'border-[#2563EB] text-[#2563EB]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                    {labels[tab]}
                  </button>
                );
              })}
            </div>

            {activeTab === 'features' && (
              <ul className="space-y-2">
                {model.features.map((f: string, i: number) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-[#374151]">
                    <div className="w-5 h-5 bg-green-50 rounded-full flex items-center justify-center flex-shrink-0"><Check size={11} className="text-green-600" /></div>
                    {f}
                  </li>
                ))}
              </ul>
            )}
            {activeTab === 'specs' && (
              <div className="space-y-2">
                {[
                  ['Surface habitable', `${house.size} m²`],
                  ['Structure', 'Acier galvanisé + isolation haute performance'],
                  ['Revêtement', '4 finitions disponibles (voir configurateur)'],
                  ['Classe énergétique', 'A+ (avec kit solaire)'],
                  ['Norme', 'EN 1090 / CE / NBN'],
                  ['Garantie structure', '10 ans'],
                  ['Garantie équipements', '2 ans'],
                ].map(([k, v], i) => (
                  <div key={i} className="flex justify-between items-center py-2 border-b border-gray-50">
                    <span className="text-sm text-gray-500">{k}</span>
                    <span className="text-sm font-medium text-[#0F172A]">{v}</span>
                  </div>
                ))}
              </div>
            )}
            {activeTab === 'delivery' && (
              <div className="space-y-3">
                {[
                  { icon: Truck,   color: 'bg-green-50 text-green-600', title: t.catalog.stockDelivery,   sub: 'Modèles disponibles en stock immédiat' },
                  { icon: Factory, color: 'bg-blue-50 text-[#2563EB]',  title: t.catalog.factoryDelivery, sub: 'Production en usine sur commande' },
                  { icon: Calendar,color: 'bg-orange-50 text-orange-500',title: 'Installation incluse',   sub: 'Pose par nos installateurs certifiés' },
                ].map((d, i) => {
                  const Icon = d.icon;
                  return (
                    <div key={i} className={`flex items-center gap-4 ${d.color.split(' ')[0]} rounded-xl p-4`}>
                      <Icon size={22} className={d.color.split(' ')[1] + ' flex-shrink-0'} />
                      <div>
                        <p className="font-semibold text-sm text-[#0F172A]">{d.title}</p>
                        <p className="text-xs text-gray-500">{d.sub}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}


          </div>
        </div>

        {/* Related */}
        <div className="mt-20 pt-12 border-t border-gray-100">
          <h2 className="font-syne font-bold text-2xl text-[#0F172A] mb-8">Autres modèles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {HOUSES.filter(h => h.slug !== slug).slice(0, 3).map(h => {
              const m = t.models[h.key];
              return (
                <Link key={h.slug} href={`/catalogue/${h.slug}`}
                  className="group bg-[#F8FAFC] rounded-2xl overflow-hidden hover:shadow-premium transition-all hover:-translate-y-0.5">
                  <div className="bg-gradient-to-b from-[#EAF0F8] to-[#F5F8FC]">
                    <img src={h.image} alt={m.name} className="w-full h-36 object-cover" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-syne font-bold text-base text-[#0F172A]">{m.name}</h3>
                    <p className="text-sm text-[#2563EB] font-semibold mt-0.5">{formatPrice(h.price)}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {showReservation && <ReservationModal house={house} onClose={() => setShowReservation(false)} />}
      <Footer />
    </main>
  );
}