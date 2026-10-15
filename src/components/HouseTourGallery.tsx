'use client';

import { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

const labels = {
  fr: { tour: 'Visite 3D', previous: 'Précédent', next: 'Suivant', fullscreen: 'Plein écran', open: 'Ouvrir la visite dans un nouvel onglet', photo: 'Photo' },
  nl: { tour: '3D-rondleiding', previous: 'Vorige', next: 'Volgende', fullscreen: 'Volledig scherm', open: 'Open de rondleiding in een nieuw tabblad', photo: 'Foto' },
  en: { tour: '3D tour', previous: 'Previous', next: 'Next', fullscreen: 'Full screen', open: 'Open tour in a new tab', photo: 'Photo' },
};

export default function HouseTourGallery({ images, tourUrl, name }: { images: string[]; tourUrl: string; name: string }) {
  const { lang } = useI18n();
  const copy = labels[lang];
  const [index, setIndex] = useState(0);
  const viewer = useRef<HTMLDivElement>(null);
  const items = [
    ...images.slice(0, 1).map(src => ({ kind: 'photo' as const, src })),
    { kind: 'tour' as const, src: tourUrl },
    ...images.slice(1).map(src => ({ kind: 'photo' as const, src })),
  ];
  const active = items[index];
  async function fullscreen() {
    try { await viewer.current?.requestFullscreen?.(); } catch { /* Keep the embedded viewer usable. */ }
  }

  return (
    <div className="w-full min-w-0 max-w-full">
      <div ref={viewer} className="relative aspect-[4/3] w-full min-w-0 max-w-full overflow-hidden rounded-2xl bg-[#F8FAFC] shadow-premium">
        {active.kind === 'tour' ? (
          <iframe
            src={active.src}
            title={name + ' — ' + copy.tour}
            allow="fullscreen; accelerometer; gyroscope; xr-spatial-tracking"
            allowFullScreen
            sandbox="allow-scripts allow-same-origin allow-pointer-lock"
            className="absolute inset-0 block h-full w-full max-w-full border-0"
          />
        ) : (
          <button type="button" onClick={fullscreen} aria-label={copy.fullscreen} className="block h-full w-full cursor-zoom-in">
            <img src={active.src} alt={name + ' — ' + copy.photo + ' ' + (index === 0 ? 1 : index)} className="h-full w-full object-cover" />
          </button>
        )}
      </div>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
        <button type="button" onClick={() => setIndex(i => (i - 1 + items.length) % items.length)} aria-label={copy.previous} className="rounded-lg border p-3 hover:bg-gray-50"><ChevronLeft size={18} /></button>
        <span className="text-sm text-gray-600" aria-live="polite">{index + 1} / {items.length}{active.kind === 'tour' ? ' · ' + copy.tour : ''}</span>
        <button type="button" onClick={fullscreen} aria-label={copy.fullscreen} className="rounded-lg border p-3 hover:bg-gray-50"><Maximize2 size={18} /></button>
        <button type="button" onClick={() => setIndex(i => (i + 1) % items.length)} aria-label={copy.next} className="rounded-lg border p-3 hover:bg-gray-50"><ChevronRight size={18} /></button>
      </div>
      <div className="mt-2 flex w-full min-w-0 max-w-full gap-2 overflow-x-auto pb-2">
        {items.map((item, i) => (
          <button key={i} type="button" onClick={() => setIndex(i)} aria-label={item.kind === 'tour' ? copy.tour : copy.photo + ' ' + (i === 0 ? 1 : i)} aria-pressed={index === i}
            className={`relative h-20 w-24 shrink-0 overflow-hidden rounded-xl border-2 ${index === i ? 'border-[#2563EB]' : 'border-transparent opacity-70 hover:opacity-100'}`}>
            <img src={item.kind === 'tour' ? images[0] : item.src} alt="" className="h-full w-full object-cover" />
            {item.kind === 'tour' && <span className="absolute inset-0 flex items-center justify-center bg-black/55 px-1 text-sm font-semibold text-white">{copy.tour}</span>}
          </button>
        ))}
      </div>
    </div>
  );
}
