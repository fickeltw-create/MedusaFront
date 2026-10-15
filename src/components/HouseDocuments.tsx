'use client';

import { FileText, ExternalLink } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

const copy = {
  fr: {
    title: 'Cahier des charges',
    open: 'Ouvrir le cahier des charges',
    newTab: 'PDF, nouvel onglet',
  },
  nl: {
    title: 'Lastenboek',
    open: 'Open het lastenboek',
    newTab: 'PDF, nieuw tabblad',
  },
  en: {
    title: 'Technical specification',
    open: 'Open the technical specification',
    newTab: 'PDF, new tab',
  },
};

const documents = [
  { lang: 'fr', label: 'FR', name: 'Français' },
  { lang: 'nl', label: 'NL', name: 'Nederlands' },
  { lang: 'en', label: 'EN', name: 'English' },
] as const;

export default function HouseDocuments() {
  const { lang } = useI18n();
  const text = copy[lang];

  return (
    <div className="my-5 space-y-3 text-sm">
      <img
        src="/images/peb-a-plus.png"
        alt="PEB A+"
        width={150}
        height={44}
        className="block h-auto w-[150px] shrink-0"
      />
      <div className="flex flex-wrap items-center gap-2">
        <span className="flex items-center gap-2 font-medium">
          <FileText size={17} aria-hidden="true" />{text.title}
        </span>
        <div className="flex gap-2" role="group" aria-label={text.title}>
          {documents.map(document => (
            <a
              key={document.lang}
              href={`/documents/cahier-des-charges-${document.lang}.pdf`}
              hrefLang={document.lang}
              type="application/pdf"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${text.open} — ${document.name} (${text.newTab})`}
              title={`${document.name} — ${text.newTab}`}
              className="inline-flex min-h-11 min-w-11 items-center justify-center gap-1 rounded-lg border border-current/20 px-2 text-xs font-semibold hover:bg-blue-50 hover:text-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              {document.label}<ExternalLink size={11} aria-hidden="true" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
