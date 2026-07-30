'use client';

import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, X, ChevronDown, ShoppingCart } from 'lucide-react';
import Link from 'next/link';

type Product = {
  id: string;
  title: string;
  handle: string;
  description: string;
  thumbnail: string;
  price: number;
  categories: string[];
  tags: string[];
};

type ShopClientProps = {
  products: Product[];
  categories: string[];
  minPrice: number;
  maxPrice: number;
};

export default function ShopClient({ products, categories, minPrice, maxPrice }: ShopClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([minPrice, maxPrice]);
  const [sortBy, setSortBy] = useState('featured');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  // Toggle category selection
  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.title.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query) ||
        p.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Category filter
    if (selectedCategories.length > 0) {
      result = result.filter(p => 
        p.categories?.some(c => selectedCategories.includes(c))
      );
    }

    // Price filter
    result = result.filter(p => 
      p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    // Sorting
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'name-desc':
        result.sort((a, b) => b.title.localeCompare(a.title));
        break;
      default: // featured
        break;
    }

    return result;
  }, [products, searchQuery, selectedCategories, priceRange, sortBy]);

  const sortOptions = [
    { value: 'featured', label: 'Featured' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'name-asc', label: 'Name: A to Z' },
    { value: 'name-desc', label: 'Name: Z to A' },
  ];

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategories([]);
    setPriceRange([minPrice, maxPrice]);
    setSortBy('featured');
  };

  const activeFiltersCount = selectedCategories.length + 
    (priceRange[0] !== minPrice || priceRange[1] !== maxPrice ? 1 : 0) +
    (searchQuery ? 1 : 0);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* Mobile filter dialog */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setMobileFiltersOpen(false)} />
          <div className="fixed inset-y-0 right-0 z-50 w-full max-w-xs overflow-y-auto bg-white px-4 py-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
              <button onClick={() => setMobileFiltersOpen(false)} className="p-2">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="mt-6 space-y-8">
              {/* Categories */}
              <div>
                <h3 className="block text-sm font-medium text-gray-900">Categories</h3>
                <div className="mt-4 space-y-3">
                  {categories.map(category => (
                    <label key={category} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category)}
                        onChange={() => toggleCategory(category)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-3 text-sm text-gray-600">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="block text-sm font-medium text-gray-900">Price Range</h3>
                <div className="mt-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                      placeholder="Min"
                    />
                    <span className="text-gray-500">-</span>
                    <input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                      placeholder="Max"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={clearFilters}
                className="w-full rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Clear all filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">Shop</h1>
          <p className="mt-4 max-w-2xl text-xl text-gray-500">
            Discover our collection of premium products designed for modern life.
          </p>
        </div>
      </div>

      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          {/* Filters bar */}
          <div className="flex items-center justify-between gap-4">
            {/* Search */}
            <div className="flex flex-1 items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-full border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Mobile filters button */}
              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="inline-flex items-center gap-2 rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 lg:hidden"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters
                {activeFiltersCount > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs text-white">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
            </div>

            {/* Sort dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                className="inline-flex items-center gap-2 rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Sort by: {sortOptions.find(o => o.value === sortBy)?.label}
                <ChevronDown className="h-4 w-4" />
              </button>
              {showSortDropdown && (
                <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-xl bg-white py-2 shadow-lg ring-1 ring-black/10">
                  {sortOptions.map(option => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSortBy(option.value);
                        setShowSortDropdown(false);
                      }}
                      className={`block w-full px-4 py-2 text-left text-sm ${sortBy === option.value ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Desktop Sidebar Filters */}
          <aside className="hidden w-64 flex-shrink-0 lg:block">
            <div className="sticky top-28 space-y-8 rounded-2xl bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Filters</h3>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    Clear all
                  </button>
                )}
              </div>

              {/* Categories */}
              <div>
                <h4 className="text-sm font-medium text-gray-900">Categories</h4>
                <div className="mt-3 space-y-2">
                  {categories.map(category => (
                    <label key={category} className="flex cursor-pointer items-center">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category)}
                        onChange={() => toggleCategory(category)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-3 text-sm text-gray-600">{category}</span>
                    </label>
                  ))}
                  {categories.length === 0 && (
                    <p className="text-xs text-gray-400">No categories available</p>
                  )}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h4 className="text-sm font-medium text-gray-900">Price Range</h4>
                <div className="mt-3">
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">€</span>
                      <input
                        type="number"
                        value={priceRange[0]}
                        onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                        className="w-24 rounded-lg border border-gray-300 py-2 pl-7 pr-3 text-sm"
                        min={minPrice}
                        max={maxPrice}
                      />
                    </div>
                    <span className="text-gray-400">—</span>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">€</span>
                      <input
                        type="number"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                        className="w-24 rounded-lg border border-gray-300 py-2 pl-7 pr-3 text-sm"
                        min={minPrice}
                        max={maxPrice}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {/* Results count */}
            <p className="mb-6 text-sm text-gray-500">
              Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
            </p>

            {filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl bg-white py-16 text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-lg font-semibold text-gray-900">No products found</h3>
                <p className="mt-2 text-sm text-gray-500">Try adjusting your filters or search query</p>
                <button
                  onClick={clearFilters}
                  className="btn-primary mt-4 px-6 py-2"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
                {filteredProducts.map((product) => (
                  <article
                    key={product.id}
                    className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:shadow-xl"
                  >
                    <Link href={`/products/${product.handle}`} className="aspect-square overflow-hidden bg-gray-100">
                      {product.thumbnail ? (
                        <img
                          src={product.thumbnail}
                          alt={product.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-200 to-slate-300">
                          <span className="text-4xl">📦</span>
                        </div>
                      )}
                      {/* Quick add overlay */}
                      <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/20" />
                      <button className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-gray-900 opacity-0 shadow-lg transition-opacity group-hover:opacity-100 hover:bg-gray-100">
                        <ShoppingCart className="h-4 w-4" />
                        Add to cart
                      </button>
                    </Link>
                    
                    <div className="flex flex-1 flex-col p-5">
                      {/* Category */}
                      {product.categories?.[0] && (
                        <p className="text-xs font-medium uppercase tracking-wide text-blue-600">
                          {product.categories[0]}
                        </p>
                      )}
                      
                      <Link href={`/products/${product.handle}`}>
                        <h3 className="mt-1 text-lg font-semibold text-gray-900 line-clamp-1 group-hover:underline">
                          {product.title}
                        </h3>
                      </Link>
                      
                      <p className="mt-2 text-sm text-gray-500 line-clamp-2 flex-1">
                        {product.description || 'Premium quality product for your everyday needs.'}
                      </p>
                      
                      <div className="mt-4 flex items-center justify-between">
                        <p className="text-xl font-bold text-gray-900">
                          €{product.price.toFixed(2)}
                        </p>
                        <button 
                          className="inline-flex items-center justify-center rounded-full bg-gray-100 p-2 text-gray-600 transition-colors hover:bg-blue-100 hover:text-blue-600"
                          title="Add to cart"
                        >
                          <ShoppingCart className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}