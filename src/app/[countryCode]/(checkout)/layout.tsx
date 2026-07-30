import Navbar from "@/components/Navbar" // Ta navigation principale
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ChevronDown from "@modules/common/icons/chevron-down"

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="min-h-screen bg-white">
      {/* Utilisation de ta navigation principale MODURA sur le checkout aussi */}
      <Navbar />
      
      {/* Sous-navigation spécifique au checkout */}
      <div className="h-16 bg-gray-50 border-b">
        <nav className="flex h-full items-center max-w-7xl mx-auto px-4 justify-between">
          <LocalizedClientLink
            href="/be/cart"
            className="text-small-semi text-gray-700 flex items-center gap-x-2 uppercase"
            data-testid="back-to-cart-link"
          >
            <ChevronDown className="rotate-90" size={16} />
            <span className="mt-px">Retour au panier</span>
          </LocalizedClientLink>
          <div className="font-bold text-xl">MODURA - Checkout</div>
          <div className="flex-1 basis-0" />
        </nav>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 py-8" data-testid="checkout-container">
        {children}
      </div>
    </main>
  )
}