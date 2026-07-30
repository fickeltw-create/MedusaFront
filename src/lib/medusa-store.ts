import { DEFAULT_FEATURED_PRODUCTS, ShopProduct, guessCategory, slugify, normalizePrice } from './shop';

export type MedusaCatalogResponse = {
  products: ShopProduct[];
  source: 'medusa' | 'fallback';
  error?: string;
};

function getMedusaBaseUrl(): string {
  return (process.env.MEDUSA_BACKEND_URL || process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || '').replace(/\/$/, '');
}

function getMedusaPublishableKey(): string {
  return process.env.MEDUSA_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || '';
}

function firstString(value: unknown): string {
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) {
    const found = value.find((item) => typeof item === 'string' && item.trim().length > 0);
    return typeof found === 'string' ? found : '';
  }
  return '';
}

function asArray(value: unknown): any[] {
  return Array.isArray(value) ? value : [];
}

function extractMedusaPrice(product: any): number {
  const variants = asArray(product?.variants);
  for (const variant of variants) {
    const candidates = [
      variant?.calculated_price?.calculated_amount,
      variant?.calculated_price?.calculatedPrice?.calculated_amount,
      variant?.calculated_price?.amount,
      variant?.price,
      variant?.prices?.[0]?.amount,
      variant?.original_price,
    ];
    for (const candidate of candidates) {
      const value = Number(candidate);
      if (Number.isFinite(value) && value >= 0) {
        return normalizePrice(value / (value > 10000 ? 100 : 1));
      }
    }
  }

  const fallback = Number(product?.price ?? product?.amount ?? product?.price_amount);
  return Number.isFinite(fallback) ? normalizePrice(fallback / (fallback > 10000 ? 100 : 1)) : 0;
}

function extractMedusaStock(product: any): number {
  const variants = asArray(product?.variants);
  const stocks = variants
    .map((variant) => Number(variant?.inventory_quantity ?? variant?.inventoryQuantity ?? variant?.stock ?? 0))
    .filter((value) => Number.isFinite(value));
  if (stocks.length > 0) return Math.max(...stocks);
  const fallback = Number(product?.stock ?? 0);
  return Number.isFinite(fallback) ? Math.max(0, Math.round(fallback)) : 0;
}

function extractMedusaCategory(product: any): string {
  const category = firstString(product?.categories?.[0]?.name || product?.categories?.[0]?.title || product?.category?.name);
  if (category) return category.toLowerCase();
  const collection = firstString(product?.collection?.title || product?.collection?.name);
  if (collection) return collection.toLowerCase();
  return guessCategory(`${product?.title ?? ''} ${product?.description ?? ''}`);
}

function extractMedusaImages(product: any): string[] {
  const direct = firstString(product?.thumbnail);
  const images = asArray(product?.images)
    .map((image) => (typeof image === 'string' ? image : image?.url || image?.src || image?.original_url || ''))
    .filter(Boolean);
  return Array.from(new Set([direct, ...images].filter(Boolean)));
}

function extractMedusaHighlights(product: any): string[] {
  const tags = asArray(product?.tags)
    .map((tag) => (typeof tag === 'string' ? tag : tag?.value || tag?.name || ''))
    .filter(Boolean)
    .slice(0, 3);
  const category = extractMedusaCategory(product);
  const subtitle = firstString(product?.subtitle || product?.description_short);
  return Array.from(new Set([subtitle, category, ...tags].filter(Boolean))).slice(0, 4);
}

function medusaHandle(product: any): string {
  return slugify(firstString(product?.handle || product?.slug || product?.title || product?.name));
}

function medusaName(product: any): string {
  return firstString(product?.title || product?.name || product?.handle) || 'Product';
}

function medusaDescription(product: any): string {
  return firstString(product?.description || product?.subtitle) || 'Product imported from Medusa.';
}

export function normalizeMedusaProduct(product: any): ShopProduct {
  const id = firstString(product?.id) || medusaHandle(product) || crypto.randomUUID();
  const name = medusaName(product);
  const slug = medusaHandle(product) || slugify(name);
  const highlights = extractMedusaHighlights(product);
  const images = extractMedusaImages(product);

  return {
    id,
    name,
    slug,
    description: medusaDescription(product),
    price: extractMedusaPrice(product),
    currency: 'EUR',
    category: extractMedusaCategory(product),
    stock: extractMedusaStock(product),
    sku: firstString(product?.variants?.[0]?.sku || product?.sku || product?.code || name),
    sourceType: 'manual',
    origin: 'medusa',
    imagePreview: images[0],
    images,
    highlights: highlights.length > 0 ? highlights : ['Medusa product', 'Ready for storefront'],
    createdAt: firstString(product?.created_at || product?.createdAt) || new Date().toISOString(),
  };
}

export async function fetchMedusaCatalog(): Promise<MedusaCatalogResponse> {
  const baseUrl = getMedusaBaseUrl();

  if (!baseUrl) {
    return { products: DEFAULT_FEATURED_PRODUCTS, source: 'fallback' };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 7000);

  try {
    const headers: Record<string, string> = { accept: 'application/json' };
    const publishableKey = getMedusaPublishableKey();
    if (publishableKey) {
      headers['x-publishable-api-key'] = publishableKey;
    }

    const response = await fetch(`${baseUrl}/store/products`, {
      method: 'GET',
      headers,
      cache: 'no-store',
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Medusa returned ${response.status}`);
    }

    const payload = await response.json();
    const rawProducts = asArray(payload?.products ?? payload?.data ?? payload ?? []);
    const products = rawProducts.map(normalizeMedusaProduct);

    return {
      products: products.length > 0 ? products : DEFAULT_FEATURED_PRODUCTS,
      source: products.length > 0 ? 'medusa' : 'fallback',
    };
  } catch (error) {
    return {
      products: DEFAULT_FEATURED_PRODUCTS,
      source: 'fallback',
      error: error instanceof Error ? error.message : 'Unable to load Medusa catalog',
    };
  } finally {
    clearTimeout(timeout);
  }
}
