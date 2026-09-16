'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown, Globe } from 'lucide-react';
import { useI18n, Language } from '@/lib/i18n';

const LANG_FLAGS: Record<Language, string> = {
  fr: 'FR',
  nl: 'BE',
  en: 'EN',
};

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const { t, lang, setLang } = useI18n();
  const pathname = usePathname();

  const isHome = pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const links = [
    { href: '/catalogue', label: t.nav.catalogue, external: false },
    { href: '/boutique', label: 'Boutique', external: false },
    { href: '/financement', label: t.nav.financement, external: false },
    { href: '/energie', label: t.nav.energie, external: false },
    { href: '/distributeurs', label: t.nav.distributeurs, external: false },
    { href: '/faq', label: t.nav.faq, external: false },
    { href: '/contact', label: t.nav.contact, external: false },
    { href: '/promotion', label: '+', external: false },
  ];

  const isScrolledOrNotHome = scrolled || !isHome;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolledOrNotHome ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100' : 'bg-transparent'}`}>
      <div className="container-wide">
        <div className="flex items-center justify-between h-16 md:h-18">
          <Link href="/" className="flex items-center gap-2 group">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${isScrolledOrNotHome ? 'bg-[#0F172A]' : 'bg-white/20'}`}>
              <span className={`font-syne font-bold text-sm ${isScrolledOrNotHome ? 'text-white' : 'text-white'}`}>M</span>
            </div>
            <span className={`font-syne font-bold text-xl tracking-tight transition-colors duration-300 ${isScrolledOrNotHome ? 'text-[#0F172A]' : 'text-white'}`}>MODURA</span>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {links.map((link) => (
              link.external ? (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isScrolledOrNotHome ? 'text-[#374151] hover:text-[#0F172A] hover:bg-gray-50' : 'text-white/80 hover:text-white hover:bg-white/10'}`}
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${pathname === link.href ? (isScrolledOrNotHome ? 'text-[#2563EB] bg-blue-50' : 'text-white bg-white/20') : (isScrolledOrNotHome ? 'text-[#374151] hover:text-[#0F172A] hover:bg-gray-50' : 'text-white/80 hover:text-white hover:bg-white/10')}`}
                >
                  {link.label}
                </Link>
              )
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <div className="relative">
              <button onClick={() => setLangOpen(!langOpen)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${isScrolledOrNotHome ? 'text-[#374151] hover:bg-gray-50' : 'text-white/80 hover:text-white hover:bg-white/10'}`}>
                <Globe size={14} />
                <span className="uppercase">{lang}</span>
                <ChevronDown size={12} className={`transition-transform ${langOpen ? 'rotate-180' : ''}`} />
              </button>
              {langOpen && (
                <div className="absolute right-0 top-full mt-2 w-40 bg-white rounded-xl shadow-premium border border-gray-100 overflow-hidden animate-scaleIn">
                  {(['fr', 'nl', 'en'] as Language[]).map((l) => (
                    <button
                      key={l}
                      onClick={() => { setLang(l); setLangOpen(false); }}
                      className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm transition-colors hover:bg-gray-50 ${lang === l ? 'text-[#2563EB] font-semibold bg-blue-50/50' : 'text-[#374151]'}`}
                    >
                      <span>{LANG_FLAGS[l]}</span>
                      <span>{t.nav[`lang${l.charAt(0).toUpperCase() + l.slice(1)}` as keyof typeof t.nav]}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <button onClick={() => setMobileOpen(!mobileOpen)} className={`lg:hidden p-2 rounded-lg transition-colors ${isScrolledOrNotHome ? 'text-[#0F172A] hover:bg-gray-100' : 'text-white hover:bg-white/10'}`}>
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-xl animate-fadeInUp">
          <div className="container-wide py-4 space-y-1">
            {links.map((link) => (
              link.external ? (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors text-[#374151] hover:bg-gray-50 hover:text-[#0F172A]`}
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${pathname === link.href ? 'text-[#2563EB] bg-blue-50' : 'text-[#374151] hover:bg-gray-50 hover:text-[#0F172A]'}`}
                >
                  {link.label}
                </Link>
              )
            ))}
            <div className="pt-3 flex items-center justify-between border-t border-gray-100 mt-3">
              <div className="flex gap-2">
                {(['fr', 'nl', 'en'] as Language[]).map((l) => (
                  <button
                    key={l}
                    onClick={() => setLang(l)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase transition-all ${lang === l ? 'bg-[#0F172A] text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                  >
                    {LANG_FLAGS[l]} {l}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {langOpen && <div className="fixed inset-0 z-[-1]" onClick={() => setLangOpen(false)} />}
    </nav>
  );
}