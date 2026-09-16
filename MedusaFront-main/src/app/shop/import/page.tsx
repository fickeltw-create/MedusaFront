'use client';

import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { DEFAULT_PRODUCT_TEMPLATE, draftToProduct, ExtractionResult, formatPrice, PRODUCT_STORAGE_KEY, ProductDraft, ShopProduct, slugify } from '@/lib/shop';
import { ArrowRight, CheckCircle2, FileUp, Image, PackageSearch, ShieldCheck, Upload } from 'lucide-react';

const INITIAL_DRAFT: ProductDraft = {
  name: '',
  description: '',
  price: '',
  category: DEFAULT_PRODUCT_TEMPLATE.category,
  stock: String(DEFAULT_PRODUCT_TEMPLATE.stock),
  sku: '',
  sourceFileName: '',
  sourceType: 'manual',
  imagePreview: undefined,
  highlights: [...DEFAULT_PRODUCT_TEMPLATE.highlights],
};

function readSavedProducts(): ShopProduct[] {
  if (typeof window === 'undefined') return [];
  const raw = window.localStorage.getItem(PRODUCT_STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as ShopProduct[];
  } catch {
    return [];
  }
}

function titleFromFileName(fileName: string): string {
  return fileName.replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' ').trim() || 'Imported product';
}

function fallbackDraft(file: File): ExtractionResult {
  const title = titleFromFileName(file.name);
  const estimatedPrice = file.size > 0 ? Math.max(300, Math.round(file.size / 1500)) : 300;

  return {
    name: title,
    description: `Draft created from ${file.name}. Review and adjust the fields before publishing.`,
    price: estimatedPrice,
    category: 'General',
    sku: `${slugify(title).toUpperCase().slice(0, 10) || 'PROD'}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
    stock: 1,
    highlights: ['Imported from file', 'Manual review recommended'],
    confidence: 0.35,
    rawText: '',
    sourceFileName: file.name,
    sourceType: file.type.includes('pdf') ? 'pdf' : file.type.startsWith('image/') ? 'image' : 'excel',
  };
}

export default function ProductImportPage() {
  const [draft, setDraft] = useState<ProductDraft>(INITIAL_DRAFT);
  const [savedProducts, setSavedProducts] = useState<ShopProduct[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'extracting' | 'ready' | 'saving' | 'error'>('idle');
  const [feedback, setFeedback] = useState<string>('Upload a PDF, JPEG or spreadsheet to prepare a product sheet.');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setSavedProducts(readSavedProducts());
  }, []);

  useEffect(() => {
    const onStorage = () => setSavedProducts(readSavedProducts());
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const totalValue = useMemo(() => savedProducts.reduce((sum, item) => sum + item.price, 0), [savedProducts]);

  async function handleAnalyze(file: File) {
    setSelectedFile(file);
    setStatus('extracting');
    setError(null);
    setFeedback(`Reading ${file.name}...`);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/products/extract', { method: 'POST', body: formData });
      if (!response.ok) throw new Error('The extraction service returned an error.');

      const payload = (await response.json()) as { result: ExtractionResult };
      const result = payload.result;

      setDraft({
        name: result.name,
        description: result.description,
        price: result.price ? String(result.price) : '',
        category: result.category,
        stock: String(result.stock),
        sku: result.sku,
        sourceFileName: result.sourceFileName,
        sourceType: result.sourceType,
        imagePreview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
        highlights: result.highlights,
      });

      setStatus('ready');
      setFeedback(`Draft ready. Confidence: ${Math.round(result.confidence * 100)}%`);
    } catch (err) {
      const result = fallbackDraft(file);
      setDraft({
        name: result.name,
        description: result.description,
        price: result.price ? String(result.price) : '',
        category: result.category,
        stock: String(result.stock),
        sku: result.sku,
        sourceFileName: result.sourceFileName,
        sourceType: result.sourceType,
        imagePreview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
        highlights: result.highlights,
      });

      setStatus('error');
      setError(err instanceof Error ? err.message : 'Unexpected import error.');
      setFeedback('Automatic reading failed, so a draft was created from the file name. You can still publish after editing.');
    }
  }

  async function onFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    await handleAnalyze(file);
  }

  function saveProduct() {
    const product = draftToProduct(draft);
    const nextProducts = [product, ...savedProducts];
    window.localStorage.setItem(PRODUCT_STORAGE_KEY, JSON.stringify(nextProducts));
    setSavedProducts(nextProducts);
    setStatus('ready');
    setFeedback(`${product.name} was published to the shop.`);
  }

  function updateDraft<K extends keyof ProductDraft>(key: K, value: ProductDraft[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  return (
    <main className="min-h-screen bg-[#f8fafc] text-[#0f172a]">
      <Navbar />

      <section className="pt-28 pb-12 bg-[#0f172a] text-white">
        <div className="container-wide">
          <span className="label-badge bg-white/10 text-white/70 mb-4">Private intake</span>
          <h1 className="font-syne font-bold text-4xl md:text-5xl mb-4">Product import</h1>
          <p className="text-white/65 max-w-2xl text-lg">
            Upload a document, review the extracted fields and publish the validated product into the shop.
          </p>
        </div>
      </section>

      <section className="py-12 bg-[#f8fafc]">
        <div className="container-wide grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-6">
            <div className="rounded-3xl bg-white shadow-premium border border-gray-100 p-6 md:p-8">
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <h2 className="font-syne font-bold text-2xl md:text-3xl mb-2">Upload source file</h2>
                  <p className="text-gray-500">PDF, JPEG, PNG, XLSX or XLS.</p>
                </div>
                <div className="hidden sm:flex w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 items-center justify-center">
                  <Upload size={20} />
                </div>
              </div>

              <label className="group block cursor-pointer rounded-3xl border-2 border-dashed border-blue-200 bg-blue-50/40 hover:bg-blue-50 transition-colors p-8 text-center">
                <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png,.xlsx,.xls" onChange={onFileChange} />
                <div className="mx-auto mb-4 w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center text-blue-600">
                  <Image size={26} />
                </div>
                <p className="font-semibold text-lg mb-1">Choose a product file</p>
                <p className="text-sm text-gray-500 max-w-lg mx-auto">
                  We extract a starting draft, then you can correct the fiche before it appears in the shop.
                </p>
                <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm text-gray-600 border border-gray-100">
                  <PackageSearch size={14} />
                  {selectedFile ? selectedFile.name : 'No file selected yet'}
                </div>
              </label>

              <div className="mt-5 rounded-2xl bg-slate-50 border border-slate-200 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                  <FileUp size={15} />
                  Import status
                </div>
                <p className="text-sm text-slate-600">{feedback}</p>
                {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
              </div>
            </div>

            <div className="rounded-3xl bg-white shadow-premium border border-gray-100 p-6 md:p-8">
              <div className="flex items-center justify-between gap-3 mb-6">
                <div>
                  <h2 className="font-syne font-bold text-2xl md:text-3xl mb-2">Review product sheet</h2>
                  <p className="text-gray-500">Adjust the fields before publishing.</p>
                </div>
                <CheckCircle2 size={20} className="text-emerald-600" />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Product name" value={draft.name} onChange={(value) => updateDraft('name', value)} />
                <Field label="Category" value={draft.category} onChange={(value) => updateDraft('category', value)} />
                <Field label="Price (EUR)" value={draft.price} onChange={(value) => updateDraft('price', value)} />
                <Field label="Stock" value={draft.stock} onChange={(value) => updateDraft('stock', value)} />
                <Field label="SKU" value={draft.sku} onChange={(value) => updateDraft('sku', value)} />
                <Field label="Source file" value={draft.sourceFileName} onChange={(value) => updateDraft('sourceFileName', value)} />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea rows={6} value={draft.description} onChange={(event) => updateDraft('description', event.target.value)} className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition" />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Highlights</label>
                <div className="space-y-2">
                  {draft.highlights.map((highlight, index) => (
                    <input
                      key={`${highlight}-${index}`}
                      value={highlight}
                      onChange={(event) => {
                        const next = [...draft.highlights];
                        next[index] = event.target.value;
                        setDraft((current) => ({ ...current, highlights: next }));
                      }}
                      className="w-full rounded-xl border border-gray-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition"
                    />
                  ))}
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button type="button" onClick={saveProduct} disabled={!draft.name || !draft.price} className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed">
                  Publish to shop
                </button>
                <button type="button" onClick={() => setDraft(INITIAL_DRAFT)} className="px-5 py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
                  Reset draft
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl bg-[#0f172a] text-white shadow-premium overflow-hidden">
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-2 text-blue-300 text-sm font-semibold mb-4">
                  <ShieldCheck size={15} />
                  Preview
                </div>
                <h3 className="font-syne font-bold text-2xl md:text-3xl mb-2">{draft.name || 'Imported product'}</h3>
                <p className="text-white/65 mb-6">{draft.description || 'The extracted description will appear here.'}</p>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <Metric label="Price" value={draft.price ? formatPrice(Number(draft.price)) : 'Not set'} />
                  <Metric label="Stock" value={draft.stock || '0'} />
                  <Metric label="Category" value={draft.category || 'General'} />
                  <Metric label="SKU" value={draft.sku || 'Auto-generated'} />
                </div>
              </div>

              {draft.imagePreview ? (
                <img src={draft.imagePreview} alt={draft.name} className="w-full h-72 object-cover" />
              ) : (
                <div className="h-72 bg-gradient-to-br from-blue-500/20 to-emerald-400/10 flex items-center justify-center text-white/50">
                  <div className="text-center">
                    <Image size={34} className="mx-auto mb-3" />
                    <p>Image preview will appear here for image uploads.</p>
                  </div>
                </div>
              )}
            </div>

            <div className="rounded-3xl bg-white shadow-premium border border-gray-100 p-6 md:p-8">
              <h3 className="font-syne font-bold text-xl mb-3">Publishing</h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-600" />Validate the draft.</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-600" />Correct price, category and description.</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-600" />Publish to the shop so it appears in the public catalog.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white border-t border-gray-100">
        <div className="container-wide">
          <div className="flex items-end justify-between gap-4 mb-6">
            <div>
              <span className="label-badge bg-blue-50 text-blue-700 mb-3">Published products</span>
              <h2 className="font-syne font-bold text-3xl text-[#0f172a] mb-2">Products added from the private intake</h2>
              <p className="text-gray-500">These will also appear in the public shop after validation.</p>
            </div>
            <div className="hidden md:block text-right">
              <p className="text-sm text-gray-500">Total catalog value</p>
              <p className="font-syne font-bold text-2xl text-[#0f172a]">{formatPrice(totalValue)}</p>
            </div>
          </div>

          {savedProducts.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-gray-200 bg-gray-50 p-10 text-center text-gray-500">
              No imported product has been published yet.
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {savedProducts.map((product) => (
                <article key={product.id} className="rounded-3xl border border-gray-100 shadow-premium overflow-hidden bg-white">
                  <div className="h-48 bg-gradient-to-br from-slate-900 to-blue-900 flex items-end p-5 text-white">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-white/50 mb-2">{product.category}</p>
                      <h3 className="font-syne font-bold text-2xl">{product.name}</h3>
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="text-sm text-gray-500 line-clamp-3">{product.description}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="font-syne font-bold text-2xl text-[#0f172a]">{formatPrice(product.price)}</span>
                      <span className="text-sm text-gray-500">Stock: {product.stock}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}

function Field(props: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-gray-700 mb-2">{props.label}</span>
      <input value={props.value} onChange={(event) => props.onChange(event.target.value)} className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition" />
    </label>
  );
}

function Metric(props: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
      <p className="text-xs uppercase tracking-[0.2em] text-white/40 mb-1">{props.label}</p>
      <p className="font-semibold text-white">{props.value}</p>
    </div>
  );
}
