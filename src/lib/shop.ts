export type ProductSourceType = 'pdf' | 'image' | 'excel' | 'manual';

export interface ShopProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  currency: 'EUR';
  category: string;
  stock: number;
  sku: string;
  sourceFileName?: string;
  sourceType: ProductSourceType;
  imagePreview?: string;
  images?: string[];
  origin?: 'medusa' | 'local' | 'imported';
  highlights: string[];
  createdAt: string;
}

export interface ProductDraft {
  name: string;
  description: string;
  price: string;
  category: string;
  stock: string;
  sku: string;
  sourceFileName: string;
  sourceType: ProductSourceType;
  imagePreview?: string;
  images?: string[];
  origin?: 'medusa' | 'local' | 'imported';
  highlights: string[];
}

export interface ExtractionResult {
  name: string;
  description: string;
  price: number | null;
  category: string;
  sku: string;
  stock: number;
  highlights: string[];
  confidence: number;
  rawText: string;
  sourceFileName: string;
  sourceType: ProductSourceType;
}

const BUILD_TIMESTAMP = '2026-07-09T00:00:00.000Z';

function seedProduct(id: string, name: string, category: string, description: string, price: number, stock: number, sku: string, highlights: string[]): ShopProduct {
  return { id, name, slug: slugify(name), description, price, currency: 'EUR', category, stock, sku, sourceType: 'manual', origin: 'local', highlights, createdAt: BUILD_TIMESTAMP };
}

export const DEFAULT_PRODUCT_TEMPLATE = {
  currency: 'EUR' as const,
  category: 'General',
  stock: 1,
  highlights: ['Imported from document', 'Editable before publishing'],
};

export const PRODUCT_STORAGE_KEY = 'modura-shop-products';

export const SHOP_CATEGORIES = [
  { key: 'all', label: 'All products' },
  { key: 'furniture', label: 'Furniture' },
  { key: 'bathroom', label: 'Bathroom' },
  { key: 'kitchen', label: 'Kitchen' },
  { key: 'lighting', label: 'Lighting' },
  { key: 'materials', label: 'Materials' },
  { key: 'hardware', label: 'Hardware' },
  { key: 'decor', label: 'Decor' },
] as const;

export const PRICE_FILTERS = [
  { key: 'all', label: 'Any price', min: 0, max: null },
  { key: 'under-100', label: 'Under 100€', min: 0, max: 100 },
  { key: '100-500', label: '100€ - 500€', min: 100, max: 500 },
  { key: '500-2000', label: '500€ - 2k', min: 500, max: 2000 },
  { key: '2000-plus', label: '2k+', min: 2000, max: null },
] as const;

export const SORT_OPTIONS = [
  { key: 'featured', label: 'Featured' },
  { key: 'price-asc', label: 'Price: low to high' },
  { key: 'price-desc', label: 'Price: high to low' },
  { key: 'name', label: 'Name' },
  { key: 'stock', label: 'Stock' },
] as const;

export const DEFAULT_FEATURED_PRODUCTS: ShopProduct[] = [
  seedProduct('sofa-linen-3', 'Linen 3-Seater Sofa', 'furniture', 'Modern linen sofa for living rooms and apartment lounges.', 1290, 12, 'SOFA-LIN-03', ['Soft-touch fabric', 'Living room ready', 'Best seller']),
  seedProduct('armchair-curve', 'Curved Accent Armchair', 'furniture', 'Accent chair for living rooms, reading corners and boutique interiors.', 540, 20, 'ARM-CUR-01', ['Accent piece', 'Comfort seating', 'Easy style match']),
  seedProduct('coffee-table-oak', 'Oak Coffee Table', 'furniture', 'Low oak coffee table for contemporary living rooms.', 320, 15, 'TAB-OAK-01', ['Natural finish', 'Compact footprint', 'Residential use']),
  seedProduct('tv-cabinet-white', 'White TV Cabinet', 'furniture', 'Storage cabinet for TV setup and media organization.', 410, 18, 'TVCAB-WHT-01', ['Cable management', 'Storage shelves', 'Clean design']),
  seedProduct('dining-table-6', 'Dining Table 6 Seats', 'furniture', 'Dining table for family homes, apartments and hospitality spaces.', 890, 9, 'DIN-TBL-06', ['Family size', 'Dining space', 'Wood finish']),
  seedProduct('bath-mixer-chrome', 'Chrome Basin Faucet', 'bathroom', 'Chrome basin faucet for modern bathrooms and renovation projects.', 85, 120, 'FAUCET-CHR-01', ['Bathroom fit', 'Chrome finish', 'Low cost']),
  seedProduct('shower-set-black', 'Black Shower Set', 'bathroom', 'Wall-mounted shower set for contemporary bathroom interiors.', 190, 46, 'SHWR-BLK-01', ['Rain shower', 'Black finish', 'Complete set']),
  seedProduct('vanity-800', '800mm Vanity Unit', 'bathroom', 'Bathroom vanity with basin and storage drawer.', 470, 22, 'VANITY-800', ['Storage drawer', 'Wash basin', 'Bathroom core']),
  seedProduct('mirror-led', 'LED Bathroom Mirror', 'bathroom', 'Backlit mirror for bathrooms, dressing spaces and guest suites.', 160, 34, 'MIR-LED-01', ['LED light', 'Wall mounted', 'Modern look']),
  seedProduct('toilet-compact', 'Compact Ceramic Toilet', 'bathroom', 'Space-saving ceramic toilet for residential bathrooms and apartments.', 250, 19, 'TOIL-CMP-01', ['Ceramic body', 'Compact size', 'Easy clean']),
  seedProduct('kitchen-sink-double', 'Double Bowl Kitchen Sink', 'kitchen', 'Stainless steel sink with double bowl for apartment and villa kitchens.', 145, 55, 'SINK-DBL-01', ['Stainless steel', 'Double bowl', 'Kitchen essential']),
  seedProduct('mixer-tap-kitchen', 'Kitchen Mixer Tap', 'kitchen', 'Single lever mixer tap for sinks and kitchen countertops.', 78, 100, 'MIX-TAP-01', ['Single lever', 'Kitchen fit', 'Water saving']),
  seedProduct('kitchen-cabinet-set', 'Kitchen Cabinet Set', 'kitchen', 'Base and wall cabinet set for residential kitchens.', 1680, 8, 'KIT-CAB-01', ['Cabinet system', 'Modular fit', 'Home kitchen']),
  seedProduct('induction-hob', 'Induction Hob 4 Zones', 'kitchen', 'Built-in induction hob for modern homes and apartments.', 340, 26, 'HOB-4Z-01', ['Built-in', '4 zones', 'Modern kitchen']),
  seedProduct('range-hood', 'Wall Range Hood', 'kitchen', 'Kitchen range hood for odor extraction and ventilation.', 210, 29, 'HOOD-WL-01', ['Extraction hood', 'Wall mount', 'Kitchen airflow']),
  seedProduct('pendant-light', 'Pendant Light Cluster', 'lighting', 'Decorative pendant lighting for dining rooms and living areas.', 140, 60, 'LIGHT-PEN-01', ['Decor light', 'Indoor lighting', 'Warm tone']),
  seedProduct('floor-lamp', 'Modern Floor Lamp', 'lighting', 'Minimal floor lamp for living rooms and bedrooms.', 95, 48, 'LAMP-FLR-01', ['Standing lamp', 'Soft light', 'Interior decor']),
  seedProduct('led-panel', 'LED Ceiling Panel', 'lighting', 'Flat ceiling panel for homes, offices and renovations.', 65, 140, 'LED-PNL-01', ['Ceiling panel', 'Energy saving', 'Neutral white']),
  seedProduct('wall-sconce', 'Wall Sconce Pair', 'lighting', 'Pair of wall sconces for corridors and bedrooms.', 88, 70, 'SCONCE-01', ['Wall mounted', 'Pair pack', 'Soft lighting']),
  seedProduct('porcelain-tile', 'Porcelain Tile Pack', 'materials', 'Porcelain tile pack for floors and bathrooms.', 720, 21, 'TILE-POR-01', ['Floor finish', 'Tile pack', 'Durable']),
  seedProduct('laminate-floor', 'Laminate Flooring Pack', 'materials', 'Laminate floor pack for bedrooms and living rooms.', 510, 25, 'LAM-FLR-01', ['Quick lay', 'Residential finish', 'Warm look']),
  seedProduct('pvc-door', 'PVC Interior Door', 'materials', 'Interior PVC door for apartments and rooms.', 180, 38, 'PVC-DR-01', ['Interior door', 'Lightweight', 'Room divider']),
  seedProduct('window-unit', 'Aluminium Window Unit', 'materials', 'Aluminium window unit for modern housing and renovation.', 290, 44, 'WIN-ALU-01', ['Window unit', 'Aluminium frame', 'Home fit']),
  seedProduct('door-lock', 'Smart Door Lock', 'hardware', 'Smart lock for residential entry doors and rentals.', 480, 52, 'LOCK-SM-01', ['Security', 'Smart access', 'Residential use']),
  seedProduct('bath-towel-rack', 'Towel Rack Set', 'hardware', 'Bathroom towel rack set with wall mounting.', 36, 120, 'RACK-TWL-01', ['Bathroom accessory', 'Wall mounted', 'Affordable']),
];

export function slugify(value: string): string {
  return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 64) || 'product';
}

export function createSku(value: string): string {
  const base = slugify(value).toUpperCase().replace(/-/g, '');
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${base || 'PROD'}-${suffix}`;
}

export function normalizePrice(price: number): number { return Number.isFinite(price) ? Math.max(0, Math.round(price)) : 0; }

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-BE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(price);
}

export function buildDescriptionSnippet(text: string, maxLength = 260): string {
  const cleaned = text.replace(/\s+/g, ' ').replace(/[\u0000-\u001f]+/g, ' ').trim();
  if (!cleaned) return 'Description auto-generated from the imported file.';
  return cleaned.slice(0, maxLength);
}

export function guessCategory(text: string): string {
  const lower = text.toLowerCase();
  if (/(sofa|chair|table|cabinet|bed|shelf|drawer)/i.test(lower)) return 'furniture';
  if (/(bath|toilet|faucet|shower|sink|vanity|mirror)/i.test(lower)) return 'bathroom';
  if (/(kitchen|hob|hood|oven|cabinet|sink|mixer)/i.test(lower)) return 'kitchen';
  if (/(light|lamp|led|sconce|chandelier)/i.test(lower)) return 'lighting';
  if (/(tile|floor|window|door|panel|material|laminate|porcelain|pvc)/i.test(lower)) return 'materials';
  return 'hardware';
}

export function extractPriceCandidates(text: string): number[] {
  const matches = text.match(/(?:€|eur|euro)?\s*(\d[\d\s.,]{1,12})(?:\s*(?:€|eur|euro))?/gi) ?? [];
  const prices = matches.map((match) => {
    const normalized = match.replace(/(€|eur|euro)/gi, '').replace(/\s+/g, '').replace(/,/g, '.');
    const value = Number.parseFloat(normalized);
    return Number.isFinite(value) ? normalizePrice(value) : null;
  }).filter((value): value is number => value !== null);
  return Array.from(new Set(prices)).sort((a, b) => a - b);
}

export function inferProductName(text: string, fileName: string): string {
  const lines = text.split('\n').map((line) => line.trim()).filter(Boolean);
  const titleCandidate = lines.find((line) => line.length >= 4 && line.length <= 80 && /[A-Za-z]/.test(line));
  if (titleCandidate) return titleCandidate.slice(0, 80);
  const fallback = fileName.replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' ').trim();
  return fallback || 'New product';
}

export function inferDescription(text: string, name: string): string {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const withoutName = text.replace(new RegExp(escaped, 'gi'), ' ');
  return buildDescriptionSnippet(withoutName, 320);
}

export function inferHighlights(text: string): string[] {
  const bullets = text.split('\n').map((line) => line.trim()).filter((line) => /^[-*•]/.test(line) || line.toLowerCase().includes('feature') || line.toLowerCase().includes('benefit')).map((line) => line.replace(/^[-*•]\s*/, '').slice(0, 60));
  return Array.from(new Set(bullets)).slice(0, 4);
}

export function inferSku(fileName: string, name: string): string { return createSku(`${fileName}-${name}`); }

export function inferDraftFromText(params: { rawText: string; fileName: string; sourceType: ProductSourceType; imagePreview?: string; }): ExtractionResult {
  const { rawText, fileName, sourceType } = params;
  const name = inferProductName(rawText, fileName);
  const candidates = extractPriceCandidates(rawText);
  const price = candidates[candidates.length - 1] ?? null;
  const description = inferDescription(rawText, name);
  const highlights = inferHighlights(rawText);
  return { name, description, price, category: guessCategory(rawText), sku: inferSku(fileName, name), stock: DEFAULT_PRODUCT_TEMPLATE.stock, highlights: highlights.length > 0 ? highlights : DEFAULT_PRODUCT_TEMPLATE.highlights, confidence: Math.min(0.9, Math.max(0.35, rawText.trim().length / 700)), rawText, sourceFileName: fileName, sourceType };
}

export function productToDraft(product: ShopProduct): ProductDraft {
  return { name: product.name, description: product.description, price: String(product.price), category: product.category, stock: String(product.stock), sku: product.sku, sourceFileName: product.sourceFileName ?? '', sourceType: product.sourceType, imagePreview: product.imagePreview, highlights: product.highlights };
}

export function draftToProduct(draft: ProductDraft): ShopProduct {
  const price = normalizePrice(Number(draft.price));
  const stock = Math.max(0, Math.round(Number(draft.stock) || 0));
  return { id: crypto.randomUUID(), name: draft.name.trim(), slug: slugify(draft.name), description: draft.description.trim(), price, currency: 'EUR', category: draft.category.trim() || DEFAULT_PRODUCT_TEMPLATE.category, stock, sku: draft.sku.trim() || createSku(draft.name), sourceFileName: draft.sourceFileName || undefined, sourceType: draft.sourceType, origin: 'imported', imagePreview: draft.imagePreview, highlights: draft.highlights.filter(Boolean).slice(0, 5), createdAt: new Date().toISOString() };
}

export function mergeCatalogProducts(imported: ShopProduct[] = [], featured: ShopProduct[] = DEFAULT_FEATURED_PRODUCTS): ShopProduct[] {
  const map = new Map<string, ShopProduct>();
  [...featured, ...imported].forEach((product) => map.set(product.slug, product));
  return Array.from(map.values());
}

export function matchesPriceFilter(price: number, min: number, max: number | null): boolean {
  if (price < min) return false;
  if (max === null) return true;
  return price <= max;
}

export function sortProducts(products: ShopProduct[], sortKey: 'featured' | 'price-asc' | 'price-desc' | 'name' | 'stock'): ShopProduct[] {
  const list = [...products];
  switch (sortKey) {
    case 'price-asc': return list.sort((a, b) => a.price - b.price);
    case 'price-desc': return list.sort((a, b) => b.price - a.price);
    case 'name': return list.sort((a, b) => a.name.localeCompare(b.name));
    case 'stock': return list.sort((a, b) => b.stock - a.stock);
    default: return list.sort((a, b) => a.category.localeCompare(b.category) || a.price - b.price);
  }
}

