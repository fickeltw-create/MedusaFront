'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { ShoppingCart, Heart, Share2, Check, ChevronLeft } from 'lucide-react';

type Variant = {
  id: string;
  title: string;
  prices?: Array<{
    amount: number;
    currency_code: string;
  }>;
};

type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  categories: string[];
  tags: string[];
  variants: Variant[];
};

type RelatedProduct = {
  id: string;
  title: string;
  handle: string;
  thumbnail: string;
  price: number;
};

type ProductClientProps = {
  product: Product;
  relatedProducts: RelatedProduct[];
  handle: string;
};

export default function ProductClient({ product, relatedProducts, handle }: ProductClientProps) {
  const { addItem } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.title,
      price: variantPrice,
      quantity: quantity,
      image: product.images[0] || '',
      slug: handle,
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const currentVariant = product.variants[selectedVariant];
  const variantPrice = currentVariant?.prices?.[0]?.amount 
    ? currentVariant.prices[0].amount / 100 
    : product.price;

  return (
    <div className="pt-24">
      {/* Breadcrumb */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex items-center gap-2 text-sm text-gray-500">
          <Link href="/shop" className="flex items-center hover:text-gray-900 transition-colors">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to shop
          </Link>
        </nav>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-24">
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
          {/* Image gallery */}
          <div className="flex flex-col-reverse">
            <div className="mx-auto mt-6 hidden w-full max-w-2xl sm:block lg:max-w-none">
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((image, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative flex aspect-square cursor-pointer items-center justify-center rounded-xl overflow-hidden border-2 transition-all ${selectedImage === idx ? 'border-gray-900' : 'border-transparent hover:border-gray-300'}`}
                  >
                    {image ? (
                      <img
                        src={image}
                        alt={`${product.title} image ${idx + 1}`}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full bg-gray-100 flex items-center justify-center">
                        <span className="text-2xl">📦</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="aspect-square w-full overflow-hidden rounded-3xl bg-gray-100">
              {product.images[selectedImage] ? (
                <img
                  src={product.images[selectedImage]}
                  alt={product.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                  <span className="text-8xl">📦</span>
                </div>
              )}
            </div>
          </div>

          {/* Product info */}
          <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
            <div className="lg:sticky lg:top-32">
              {/* Category */}
              {product.categories[0] && (
                <p className="text-sm font-medium uppercase tracking-wide text-blue-600">
                  {product.categories[0]}
                </p>
              )}
              
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                {product.title}
              </h1>

              {/* Price */}
              <div className="mt-4">
                <p className="text-3xl font-bold text-gray-900">
                  €{variantPrice.toFixed(2)}
                </p>
              </div>

              {/* Description */}
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-900">Description</h3>
                <p className="mt-2 text-base text-gray-600 leading-relaxed">
                  {product.description || 'This premium product is designed to exceed your expectations. Crafted with high-quality materials and attention to detail, it delivers exceptional value for everyday use.'}
                </p>
              </div>

              {/* Variants */}
              {product.variants.length > 1 && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-900">Options</h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {product.variants.map((variant, idx) => (
                      <button
                        key={variant.id}
                        onClick={() => setSelectedVariant(idx)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedVariant === idx ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                      >
                        {variant.title}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity selector */}
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-900">Quantity</h3>
                <div className="mt-2 flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50"
                  >
                    -
                  </button>
                  <span className="text-lg font-semibold w-8 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action buttons */}
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleAddToCart}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-full px-8 py-4 text-base font-semibold transition-all ${addedToCart ? 'bg-green-600 text-white' : 'bg-gray-900 text-white hover:bg-gray-800'}`}
                >
                  {addedToCart ? (
                    <>
                      <Check className="h-5 w-5" />
                      Added to cart!
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="h-5 w-5" />
                      Add to cart
                    </>
                  )}
                </button>
                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={`flex h-14 w-14 items-center justify-center rounded-full border transition-all ${isWishlisted ? 'border-red-200 bg-red-50 text-red-500' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}
                >
                  <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
                <button className="flex h-14 w-14 items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50 transition-all">
                  <Share2 className="h-5 w-5" />
                </button>
              </div>

              {/* Tags */}
              {product.tags.length > 0 && (
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map(tag => (
                      <span key={tag} className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related products */}
        {relatedProducts.length > 0 && (
          <section className="mt-24 border-t border-gray-200 pt-16">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">You may also like</h2>
            <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map(related => (
                <Link key={related.id} href={`/products/${related.handle}`} className="group">
                  <div className="aspect-square w-full overflow-hidden rounded-2xl bg-gray-100">
                    {related.thumbnail ? (
                      <img
                        src={related.thumbnail}
                        alt={related.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                        <span className="text-4xl">📦</span>
                      </div>
                    )}
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-gray-900 group-hover:underline">
                    {related.title}
                  </h3>
                  <p className="mt-1 text-lg font-bold text-gray-900">
                    €{related.price.toFixed(2)}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}