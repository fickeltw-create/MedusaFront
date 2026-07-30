'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { ChevronLeft, ShieldCheck, CheckCircle2 } from 'lucide-react';

type ShippingInfo = {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  apartment?: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
};

export default function CheckoutClient() {
  const { items, totalPrice, clearCart } = useCart();
  const [currentStep, setCurrentStep] = useState(1); // 1: shipping, 2: payment, 3: confirmation
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    apartment: '',
    city: '',
    postalCode: '',
    country: 'BE',
    phone: '',
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-BE', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  const updateShippingInfo = (field: keyof ShippingInfo, value: string) => {
    setShippingInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleShippingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep(2);
  };

  const placeOrder = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Clear cart after successful order
    clearCart();
    setIsProcessing(false);
    setCurrentStep(3);
  };

  // Empty cart state
  if (!items || items.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-32 text-center">
        <div className="bg-white rounded-3xl p-12 shadow-lg">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Votre panier est vide</h1>
          <p className="text-gray-600 mb-8">
            Vous ne pouvez pas passer de commande avec un panier vide.
          </p>
          <Link href="/shop">
            <button className="btn-primary px-8 py-3">
              Ajouter des produits
            </button>
          </Link>
        </div>
      </div>
    );
  }

  // Order confirmation step
  if (currentStep === 3) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <div className="bg-white rounded-3xl p-12 shadow-lg">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Commande confirmée !</h1>
          <p className="text-gray-600 mb-2">Merci pour votre achat.</p>
          <p className="text-gray-600 mb-8">
            Un email de confirmation a été envoyé à {shippingInfo.email}
          </p>
          <Link href="/shop">
            <button className="btn-primary px-8 py-3">
              Continuer les achats
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const shippingCost = totalPrice > 100 ? 0 : 9.99;
  const taxTotal = totalPrice * 0.21; // 21% VAT for Belgium
  const finalTotal = totalPrice + shippingCost + taxTotal;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <Link href="/shop/cart" className="flex items-center text-gray-600 hover:text-gray-900 mb-8">
        <ChevronLeft className="h-5 w-5 mr-1" />
        Retour au panier
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 mb-8">Paiement</h1>

      <div className="lg:grid lg:grid-cols-3 lg:gap-x-12">
        <div className="lg:col-span-2">
          {/* Progress steps */}
          <div className="flex items-center mb-8 bg-white rounded-2xl p-4 shadow-sm">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
              currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              1
            </div>
            <span className={`ml-3 font-medium ${currentStep >= 1 ? 'text-gray-900' : 'text-gray-500'}`}>
              Livraison
            </span>
            <div className={`flex-1 h-1 mx-4 rounded ${currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
              currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              2
            </div>
            <span className={`ml-3 font-medium ${currentStep >= 2 ? 'text-gray-900' : 'text-gray-500'}`}>
              Paiement
            </span>
          </div>

          {/* Shipping info form */}
          {currentStep === 1 && (
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h2 className="text-xl font-bold mb-6">Informations de livraison</h2>
              <form onSubmit={handleShippingSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Prénom *</label>
                    <input
                      type="text"
                      required
                      value={shippingInfo.firstName}
                      onChange={(e) => updateShippingInfo('firstName', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Jean"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nom *</label>
                    <input
                      type="text"
                      required
                      value={shippingInfo.lastName}
                      onChange={(e) => updateShippingInfo('lastName', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Dupont"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                  <input
                    type="email"
                    required
                    value={shippingInfo.email}
                    onChange={(e) => updateShippingInfo('email', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="jean.dupont@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Adresse *</label>
                  <input
                    type="text"
                    required
                    value={shippingInfo.address}
                    onChange={(e) => updateShippingInfo('address', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="123 Rue Principale"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Appartement, suite, etc. (optionnel)</label>
                  <input
                    type="text"
                    value={shippingInfo.apartment || ''}
                    onChange={(e) => updateShippingInfo('apartment', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Apt 4B"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ville *</label>
                    <input
                      type="text"
                      required
                      value={shippingInfo.city}
                      onChange={(e) => updateShippingInfo('city', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Bruxelles"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Code postal *</label>
                    <input
                      type="text"
                      required
                      value={shippingInfo.postalCode}
                      onChange={(e) => updateShippingInfo('postalCode', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="1000"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pays *</label>
                    <select
                      value={shippingInfo.country}
                      onChange={(e) => updateShippingInfo('country', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="BE">Belgique</option>
                      <option value="FR">France</option>
                      <option value="NL">Pays-Bas</option>
                      <option value="DE">Allemagne</option>
                      <option value="LU">Luxembourg</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone *</label>
                    <input
                      type="tel"
                      required
                      value={shippingInfo.phone}
                      onChange={(e) => updateShippingInfo('phone', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="+32 2 123 45 67"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn-primary mt-8 w-full py-4"
                >
                  Continuer vers le paiement
                </button>
              </form>
            </div>
          )}

          {/* Payment info form */}
          {currentStep === 2 && (
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h2 className="text-xl font-bold mb-6">Informations de paiement</h2>
              
              <div className="flex items-center gap-2 mb-6 text-sm text-gray-600 bg-green-50 p-4 rounded-xl">
                <ShieldCheck className="h-5 w-5 text-green-600" />
                <span>Vos informations de paiement sont sécurisées et cryptées</span>
              </div>

              {/* Stripe Elements integration placeholder - you can add real Stripe here */}
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 mb-6 text-center">
                <p className="text-gray-500">Intégration Stripe Elements</p>
                <p className="text-sm text-gray-400 mt-2">Les champs de carte bancaire apparaîtraient ici en production</p>
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="flex-1 border-2 border-gray-300 hover:border-gray-400 text-gray-700 py-4 rounded-full font-semibold transition-colors"
                >
                  Retour
                </button>
                <button
                  onClick={placeOrder}
                  disabled={isProcessing}
                  className="btn-primary flex-1 py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? 'Traitement...' : `Payer ${formatPrice(finalTotal)}`}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order summary */}
        <div className="mt-8 lg:mt-0">
          <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-32">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Récapitulatif</h3>
            
            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={item.productId} className="flex gap-3">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200"></div>
                    )}
                    <span className="absolute -top-1 -right-1 bg-gray-800 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 line-clamp-1">{item.name}</p>
                  </div>
                  <p className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Sous-total</span>
                <span className="font-medium">{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Livraison</span>
                <span className="font-medium">{shippingCost === 0 ? 'Gratuite' : formatPrice(shippingCost)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">TVA (21%)</span>
                <span className="font-medium">{formatPrice(taxTotal)}</span>
              </div>
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-lg font-bold">{formatPrice(finalTotal)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}