export interface ProductImage {
  url: string;
  isMain: boolean;
  order: number;
}

export interface ProductSpecification {
  key: string;
  value: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  longDescription: string;
  price: number;
  compareAtPrice?: number;
  inventory: number;
  images: ProductImage[];
  specifications: ProductSpecification[];
  colors: string[];
  categories: string[];
  tags: string[];
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
  updatedAt: string;
  active: boolean;
}

export interface ProductUploadResult {
  extractedText: string;
  extractedImages: string[];
  mainImageIndex: number;
  generatedProduct: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  slug: string;
}

export interface ShopFilterState {
  categories: string[];
  minPrice: number | null;
  maxPrice: number | null;
  colors: string[];
  searchQuery: string;
  sortBy: 'price-asc' | 'price-desc' | 'name-asc' | 'newest';
}