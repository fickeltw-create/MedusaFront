import './globals.css'
import '../styles/globals.css'
import type { Metadata } from 'next'
import { I18nProvider } from '@/lib/i18n'
import { CartProvider } from '@/contexts/CartContext'
import Script from 'next/script'

export const metadata: Metadata = {
  metadataBase: new URL('https://modura.be'),
  title: 'MODURA - Maisons Modulaires Modernes | Belgique',
  description:
    'Des maisons modulaires modernes accessibles a tous. Livraison rapide, prix transparents, financement disponible. Belgique, France, Pays-Bas.',
  keywords:
    'maison modulaire, maison prefabricquee, belgique, tiny house, maison abordable, financement maison',
  authors: [{ name: 'MODURA' }],
  openGraph: {
    title: 'MODURA - Maisons Modulaires Modernes',
    description: 'Des maisons modulaires modernes accessibles a tous.',
    type: 'website',
    locale: 'fr_BE',
    siteName: 'MODURA',
    images: [
      {
        url: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1200',
        width: 1200,
        height: 630,
        alt: 'MODURA - Maisons Modulaires',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MODURA - Maisons Modulaires Modernes',
    description: 'Des maisons modulaires modernes accessibles a tous.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr-BE" data-mode="light">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Syne:wght@400;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased">
        <I18nProvider>
          <CartProvider>
            <main className="relative">{children}</main>
          </CartProvider>
        </I18nProvider>

        {/* Google Analytics Scripts */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID || 'G-Q88CHCFZXW'}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID || 'G-Q88CHCFZXW'}');
          `}
        </Script>
        
      </body>
    </html>
  )
}
