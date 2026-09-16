import { Metadata } from "next"
import Navbar from "@/components/Navbar" // Ta navigation principale du site
import Footer from "@/components/Footer" // Ton footer principal du site
import Nav from "@modules/layout/templates/nav" // Navigation Medusa (store : Account / Cart)
import { listCartOptions, retrieveCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import { getBaseURL } from "@lib/util/env"
import { StoreCartShippingOption } from "@medusajs/types"
import CartMismatchBanner from "@modules/layout/components/cart-mismatch-banner"
import FreeShippingPriceNudge from "@modules/shipping/components/free-shipping-price-nudge"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
  title: "Boutique | MODURA",
  description: "Découvrez notre boutique de produits pour votre maison modulaire",
}

export default async function PageLayout(props: { children: React.ReactNode }) {
  const customer = await retrieveCustomer()
  const cart = await retrieveCart()
  let shippingOptions: StoreCartShippingOption[] = []

  if (cart) {
    const { shipping_options } = await listCartOptions()
    shippingOptions = shipping_options
  }

  return (
    // Ajouter un padding-top de 72px (la hauteur de ta navbar fixed : h-16 md:h-18 = ~72px)
    <main className="min-h-screen bg-white pt-[72px]">
      {/* 1. TON MENU PRINCIPAL TOUJOURS EN PREMIER (fixed, z-50) - il reste en haut */}
      <Navbar />
      
      {/* 2. MENU DU STORE MEDUSA JUSTE EN DESSOUS, pas de superposition */}
      <Nav />
      
      {/* Garder les fonctionnalités utiles de Medusa */}
      {customer && cart && (
        <CartMismatchBanner customer={customer} cart={cart} />
      )}

      {cart && (
        <FreeShippingPriceNudge
          variant="popup"
          cart={cart}
          shippingOptions={shippingOptions}
        />
      )}
      
      {/* Contenu du store */}
      {props.children}
      
      {/* Utilisation de ton footer principal MODURA (on garde TON footer, pas celui de Medusa) */}
      <Footer />
    </main>
  )
}