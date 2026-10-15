'use client';

import { useId, useRef, useState } from 'react';
import { ExternalLink, Maximize2, Play } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

const labels = {
  fr: {
    title: 'Visite virtuelle 3D',
    description: 'Explorez chaque pièce à votre rythme.',
    start: 'Démarrer la visite',
    fullscreen: 'Plein écran',
    open: 'Ouvrir dans un nouvel onglet',
    help: 'Si la visite ne s’affiche pas, ouvrez-la dans un nouvel onglet.',
  },
  nl: {
    title: 'Virtuele 3D-rondleiding',
    description: 'Ontdek elke ruimte op uw eigen tempo.',
    start: 'Start de rondleiding',
    fullscreen: 'Volledig scherm',
    open: 'Openen in een nieuw tabblad',
    help: 'Verschijnt de rondleiding niet? Open deze in een nieuw tabblad.',
  },
  en: {
    title: '3D virtual tour',
    description: 'Explore every room at your own pace.',
    start: 'Start the tour',
    fullscreen: 'Full screen',
    open: 'Open in a new tab',
    help: 'If the tour does not appear, open it in a new tab.',
  },
};

export default function VirtualTour({ url, name }: { url: string; name: string }) {
  const { lang } = useI18n();
  const copy = labels[lang];
  const headingId = useId();
  const frame = useRef<HTMLIFrameElement>(null);
  const [started, setStarted] = useState(false);

  async function enterFullscreen() {
    try {
      if (!frame.current?.requestFullscreen) return;
      await frame.current.requestFullscreen();
    } catch {
      // The direct link remains available when the browser denies fullscreen.
    }
  }

  return (
    <section aria-labelledby={headingId} className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
      <div className="p-5 sm:p-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 id={headingId} className="font-syne font-bold text-2xl text-[#0F172A]">{copy.title} · {name}</h2>
          <p className="mt-2 text-sm text-gray-600">{copy.description}</p>
        </div>
        {started && (
          <button type="button" onClick={enterFullscreen} className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-[#0F172A] hover:bg-gray-50">
            <Maximize2 size={16} aria-hidden="true" />{copy.fullscreen}
          </button>
        )}
      </div>
      {started ? (
        <iframe
          ref={frame}
          src={url}
          title={`${copy.title} — ${name}`}
          allow="fullscreen; accelerometer; gyroscope; xr-spatial-tracking"
          allowFullScreen
          className="block w-full h-[480px] sm:h-[640px] border-0 bg-[#F8FAFC]"
        />
      ) : (
        <div className="flex min-h-64 items-center justify-center bg-[#F8FAFC] p-6">
          <button type="button" onClick={() => setStarted(true)} className="inline-flex items-center gap-3 rounded-xl bg-[#2563EB] px-6 py-4 font-semibold text-white hover:bg-[#1D4ED8] transition-colors">
            <Play size={20} aria-hidden="true" />{copy.start}
          </button>
        </div>
      )}
      <div className="p-5 sm:p-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-gray-600">{copy.help}</p>
        <a href={url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 py-2 text-sm font-semibold text-[#2563EB] hover:underline">
          {copy.open}<ExternalLink size={16} aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
