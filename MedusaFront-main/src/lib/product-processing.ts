import { Product, ProductUploadResult } from '@/types/shop';
import { supabase } from './supabase';

// Tesseract.js is loaded dynamically to reduce bundle size
export async function extractTextFromFile(file: File): Promise<string> {
  try {
    // Dynamically import Tesseract to avoid increasing initial bundle size
    const Tesseract = (await import('tesseract.js')).default;
    
    const result = await Tesseract.recognize(file, 'eng+fra+nld', {
      logger: m => console.log(m),
    });
    
    return result.data.text;
  } catch (error) {
    console.error('OCR Error:', error);
    throw new Error('Failed to extract text from file');
  }
}

// Extract images from PDF using PDF.js
export async function extractImagesFromPDF(file: File): Promise<string[]> {
  try {
    const pdfjsLib = await import('pdfjs-dist');
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const images: string[] = [];
    
    for (let i = 1; i <= Math.min(pdf.numPages, 5); i++) {
      const page = await pdf.getPage(i);
      const operatorList = await page.getOperatorList();
      
      // Extract images from page
      for (let j = 0; j < operatorList.fnArray.length; j++) {
        if (operatorList.fnArray[j] === pdfjsLib.OPS.paintImageXObject) {
          const imgName = operatorList.argsArray[j][0];
          const img = page.objs.get(imgName);
          if (img && img.data) {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              const imageData = new ImageData(new Uint8ClampedArray(img.data), img.width, img.height);
              ctx.putImageData(imageData, 0, 0);
              images.push(canvas.toDataURL('image/jpeg', 0.9));
            }
          }
        }
      }
    }
    
    return images;
  } catch (error) {
    console.error('PDF Image Extraction Error:', error);
    return [];
  }
}

// Extract main image from image file or get first from PDF
export function detectMainImage(images: string[]): number {
  // For simplicity, return first image as main - can be enhanced with image analysis
  return 0;
}

// Simple in-browser translation using LibreTranslate API (free tier)
export async function translateText(text: string, targetLang: string = 'en'): Promise<string> {
  try {
    const response = await fetch('https://translate.argosopentech.com/translate', {
      method: 'POST',
      body: JSON.stringify({
        q: text,
        source: 'auto',
        target: targetLang,
        format: 'text'
      }),
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (response.ok) {
      const data = await response.json();
      return data.translatedText || text;
    }
    return text;
  } catch (error) {
    console.error('Translation Error:', error);
    return text;
  }
}

// Generate product metadata from extracted text
export function generateProductFromText(text: string, extractedImages: string[]): Omit<Product, 'id' | 'createdAt' | 'updatedAt'> {
  // Simple NLP extraction - in production you'd use a proper AI model
  const lines = text.split('\\n').filter(l => l.trim());
  
  // Extract potential name (first meaningful line)
  const name = lines.find(l => l.length > 3 && l.length < 100) || 'Untitled Product';
  
  // Extract price - look for currency symbols
  const priceMatch = text.match(/[$€£]?\s*(\d+(?:[.,]\d{2})?)/);
  const price = priceMatch ? parseFloat(priceMatch[1].replace(',', '.')) : 99.99;
  
  // Extract colors
  const colorKeywords = ['black', 'white', 'red', 'blue', 'green', 'yellow', 'purple', 'gray', 'brown', 'orange'];
  const colors = colorKeywords.filter(c => text.toLowerCase().includes(c));
  
  // Generate slug
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now().toString(36);
  
  // Extract categories
  const categories = ['Uncategorized'];
  
  // Generate simple descriptions
  const shortDescription = lines.slice(0, 2).join(' ').substring(0, 160);
  const longDescription = lines.slice(0, 10).join(' ').substring(0, 2000);
  
  // Process images for storage
  const productImages = extractedImages.map((url, index) => ({
    url,
    isMain: index === 0,
    order: index
  }));
  
  return {
    name,
    slug,
    shortDescription: shortDescription || 'Product description',
    longDescription: longDescription || 'Detailed product description',
    price,
    inventory: 100,
    images: productImages,
    specifications: [],
    colors: colors.length > 0 ? colors : ['standard'],
    categories,
    tags: ['new', 'featured'],
    seoTitle: name,
    seoDescription: shortDescription,
    active: true
  };
}

// Upload file to Supabase Storage
export async function uploadToSupabase(file: File, bucket: string = 'products'): Promise<string | null> {
  try {
    const fileName = `${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file);
    
    if (error) throw error;
    
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);
      
    return publicUrl;
  } catch (error) {
    console.error('Supabase Upload Error:', error);
    return null;
  }
}

// Save product to database
export async function saveProductToDatabase(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product | null> {
  try {
    const { data, error } = await supabase
      .from('products')
      .insert([product])
      .select()
      .single();
      
    if (error) throw error;
    return data as Product;
  } catch (error) {
    console.error('Database Save Error:', error);
    return null;
  }
}

// Get all active products
export async function getActiveProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('active', true)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data as Product[];
  } catch (error) {
    console.error('Fetch Products Error:', error);
    return [];
  }
}

// Get product by slug
export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .single();
      
    if (error) throw error;
    return data as Product;
  } catch (error) {
    console.error('Fetch Product Error:', error);
    return null;
  }
}

// Filter and sort products
export function filterAndSortProducts(
  products: Product[],
  filters: {
    categories?: string[];
    minPrice?: number;
    maxPrice?: number;
    colors?: string[];
    searchQuery?: string;
    sortBy?: string;
  }
): Product[] {
  let filtered = [...products];
  
  if (filters.categories && filters.categories.length > 0) {
    filtered = filtered.filter(p => 
      p.categories.some(c => filters.categories!.includes(c))
    );
  }
  
  if (filters.minPrice !== undefined && filters.minPrice !== null) {
    filtered = filtered.filter(p => p.price >= filters.minPrice!);
  }
  
  if (filters.maxPrice !== undefined && filters.maxPrice !== null) {
    filtered = filtered.filter(p => p.price <= filters.maxPrice!);
  }
  
  if (filters.colors && filters.colors.length > 0) {
    filtered = filtered.filter(p =>
      p.colors.some(c => filters.colors!.includes(c))
    );
  }
  
  if (filters.searchQuery) {
    const query = filters.searchQuery.toLowerCase();
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query) ||
      p.tags.some(t => t.toLowerCase().includes(query))
    );
  }
  
  switch (filters.sortBy) {
    case 'price-asc':
      filtered.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      filtered.sort((a, b) => b.price - a.price);
      break;
    case 'name-asc':
      filtered.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'newest':
    default:
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  
  return filtered;
}