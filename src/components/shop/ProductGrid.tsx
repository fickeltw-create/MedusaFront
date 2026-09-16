import { memo, ReactNode } from 'react';
import ProductCard from './ProductCard';

type ProductLike = {
  id: string;
  title: string;
  handle: string;
  description: string;
  thumbnail: string;
  price: number;
  categories: string[];
};

type ProductGridProps = {
  products: ProductLike[];
  emptyState?: ReactNode;
};

const ProductGrid = memo(function ProductGrid({ products, emptyState }: ProductGridProps) {
  if (products.length === 0) {
    return <div className="rounded-[24px] border border-slate-200 bg-slate-50/70 p-8 text-center">{emptyState}</div>;
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
});

export default ProductGrid;
