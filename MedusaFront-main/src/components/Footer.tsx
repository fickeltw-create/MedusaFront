'use client';

import Link from 'next/link';
import { useI18n } from '@/lib/i18n';

export default function Footer() {
  const { t } = useI18n();
  
  const footerLinks = [
    { href: '/shop', label: t.footer.links.catalog },
    { href: '/catalogue', label: t.footer.links.catalog },
    { href: '/contact', label: t.nav.contact },
  ];

  return (
    <footer className="border-t border-gray-100 bg-white">
      <div className="container-wide py-12 md:py-16">
        <div className="grid gap-10 md:grid-cols-[1.4fr_0.6fr]">
          <div>
            <p className="font-syne font-bold text-2xl text-[#0f172a] mb-3">MODURA</p>
            <p className="max-w-xl text-gray-500">
              {t.footer.slogan}
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-[#0f172a] mb-4">{t.footer.quickLinks}</p>
            <ul className="space-y-3">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-500 hover:text-[#2563eb] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}