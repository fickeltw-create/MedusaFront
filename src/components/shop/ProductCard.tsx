import Link from 'next/link';
import { memo } from 'react';
import { ShoppingBag } from 'lucide-react';

type ProductCardProps = {
  product: {
    id: string;
    title: string;
    handle: string;
    description: string;
    thumbnail: string;
    price: number;
    categories: string[];
  };
};

const ProductCard = memo(function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_10px_30px_-12px_rgba(15,23,42,0.18)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_38px_-16px_rgba(2,132,199,0.28)]">
      <Link href={`/products/${product.handle}`} className="block" aria-label={`View ${product.title}`}>
        <div className="aspect-square overflow-hidden bg-slate-100">
          {product.thumbnail ? (
            <img
              src={product.thumbnail}
              alt={product.title}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-200 via-slate-100 to-sky-100 text-4xl">
              ✦
            </div>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col px-4 py-4 sm:px-5">
        {product.categories?.[0] ? (
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-600">{product.categories[0]}</p>
        ) : null}
        <Link href={`/products/${product.handle}`} className="mt-2" aria-label={`View ${product.title}`}>
          <h3 className="line-clamp-2 text-base font-semibold leading-6 text-slate-950 transition group-hover:text-sky-700">
            {product.title}
          </h3>
        </Link>
        <p className="mt-2 line-clamp-2 flex-1 text-sm leading-6 text-slate-600">
          {product.description || 'Premium quality product designed for modern living.'}
        </p>
        <div className="mt-4 flex items-center justify-between">
          <p className="text-lg font-semibold text-slate-950">€{product.price.toFixed(2)}</p>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:border-sky-500 hover:bg-sky-50 hover:text-sky-700"
            aria-label={`Add ${product.title} to cart`}
          >
            <ShoppingBag className="h-4 w-4" />
          </button>
        </div>
      </div>
    </article>
  );
});

export default ProductCard;
