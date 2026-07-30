'use client';

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, Image, X, Check, Loader2, Sparkles, Download, RefreshCw, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

// OCR Processing Status enum
enum ProcessingStatus {
  IDLE = 'idle',
  UPLOADING = 'uploading',
  EXTRACTING_IMAGES = 'extracting_images',
  RUNNING_OCR = 'running_ocr',
  TRANSLATING = 'translating',
  GENERATING_METADATA = 'generating_metadata',
  COMPLETE = 'complete',
  ERROR = 'error'
}

interface ExtractedImage {
  url: string;
  isMain: boolean;
  order: number;
}

interface ExtractedProduct {
  id: string;
  fileName: string;
  fileType: 'image' | 'pdf';
  status: ProcessingStatus;
  progress: number;
  extractedImages: ExtractedImage[];
  mainImageIndex: number;
  rawOcrText: string;
  translatedText: string;
  metadata: {
    title: string;
    shortDescription: string;
    longDescription: string;
    specifications: string[];
    colors: string[];
    categories: string[];
    tags: string[];
    price: number | null;
    compareAtPrice: number | null;
    sku: string;
    seoTitle: string;
    seoDescription: string;
  };
  error?: string;
}

const ProcessingMessages = {
  [ProcessingStatus.UPLOADING]: 'Uploading file...',
  [ProcessingStatus.EXTRACTING_IMAGES]: 'Extracting images...',
  [ProcessingStatus.RUNNING_OCR]: 'Running OCR text extraction...',
  [ProcessingStatus.TRANSLATING]: 'Translating content...',
  [ProcessingStatus.GENERATING_METADATA]: 'AI generating product metadata...',
  [ProcessingStatus.COMPLETE]: 'Processing complete!',
  [ProcessingStatus.ERROR]: 'Processing failed'
};

const StatusColors = {
  [ProcessingStatus.IDLE]: 'bg-gray-200',
  [ProcessingStatus.UPLOADING]: 'bg-blue-500',
  [ProcessingStatus.EXTRACTING_IMAGES]: 'bg-purple-500',
  [ProcessingStatus.RUNNING_OCR]: 'bg-amber-500',
  [ProcessingStatus.TRANSLATING]: 'bg-cyan-500',
  [ProcessingStatus.GENERATING_METADATA]: 'bg-pink-500',
  [ProcessingStatus.COMPLETE]: 'bg-green-500',
  [ProcessingStatus.ERROR]: 'bg-red-500'
};

export default function ProductUploadPage() {
  const [products, setProducts] = useState<ExtractedProduct[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [targetLanguage, setTargetLanguage] = useState('en');
  const [autoSave, setAutoSave] = useState(true);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newProducts: ExtractedProduct[] = acceptedFiles.map((file, index) => {
      const isPdf = file.type === 'application/pdf';
      return {
        id: `${Date.now()}-${index}`,
        fileName: file.name,
        fileType: isPdf ? 'pdf' : 'image',
        status: ProcessingStatus.IDLE,
        progress: 0,
        extractedImages: [],
        mainImageIndex: 0,
        rawOcrText: '',
        translatedText: '',
        metadata: {
          title: '',
          shortDescription: '',
          longDescription: '',
          specifications: [],
          colors: [],
          categories: [],
          tags: [],
          price: null,
          compareAtPrice: null,
          sku: '',
          seoTitle: '',
          seoDescription: ''
        }
      };
    });

    setProducts(prev => [...prev, ...newProducts]);
    
    // Auto-select the first uploaded product
    if (newProducts.length > 0 && !selectedProduct) {
      setSelectedProduct(newProducts[0].id);
    }

    toast.success(`${acceptedFiles.length} file(s) uploaded successfully`);
  }, [selectedProduct]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp']
    },
    maxFiles: 20,
    maxSize: 50 * 1024 * 1024 // 50MB
  });

  const simulateProcessing = async (productId: string) => {
    const processSteps = [
      { status: ProcessingStatus.UPLOADING, duration: 1500, progress: 20 },
      { status: ProcessingStatus.EXTRACTING_IMAGES, duration: 2000, progress: 40 },
      { status: ProcessingStatus.RUNNING_OCR, duration: 3000, progress: 60 },
      { status: ProcessingStatus.TRANSLATING, duration: 1500, progress: 75 },
      { status: ProcessingStatus.GENERATING_METADATA, duration: 3000, progress: 100 }
    ];

    for (const step of processSteps) {
      await new Promise(resolve => setTimeout(resolve, step.duration));
      setProducts(prev => prev.map(p => 
        p.id === productId 
          ? { ...p, status: step.status, progress: step.progress }
          : p
      ));
    }

    // Simulate extracted data
    setProducts(prev => prev.map(p => {
      if (p.id !== productId) return p;
      
      return {
        ...p,
        status: ProcessingStatus.COMPLETE,
        extractedImages: [
          { url: 'https://picsum.photos/800/800?random=1', isMain: true, order: 0 },
          { url: 'https://picsum.photos/800/800?random=2', isMain: false, order: 1 },
          { url: 'https://picsum.photos/800/800?random=3', isMain: false, order: 2 }
        ],
        rawOcrText: 'Premium Wireless Headphones\nModel: WH-1000XM5\nPrice: $399\nFeatures:\n- Noise cancellation\n- 30 hour battery\n- Bluetooth 5.2\nColors: Black, Silver\nCategory: Electronics > Audio',
        translatedText: 'Premium Wireless Headphones\nModel: WH-1000XM5\nPrice: $399\nFeatures:\n- Noise cancellation\n- 30 hour battery\n- Bluetooth 5.2\nColors: Black, Silver\nCategory: Electronics > Audio',
        metadata: {
          title: 'Premium Wireless Noise-Cancelling Headphones',
          shortDescription: 'Experience immersive audio with industry-leading noise cancellation and 30-hour battery life.',
          longDescription: 'Introducing our flagship wireless headphones featuring advanced noise cancellation technology that blocks out unwanted ambient sound. With Bluetooth 5.2 connectivity, you can enjoy seamless audio transmission from any compatible device. The 30-hour battery life ensures your music keeps playing throughout long journeys and workdays. The luxurious earcups provide all-day comfort, while the built-in microphones deliver crystal-clear calls. Available in sophisticated black and silver finishes.',
          specifications: [
            'Active Noise Cancellation',
            '30-hour battery life',
            'Bluetooth 5.2',
            '40mm drivers',
            'Quick charge 10min = 5hrs',
            'Voice assistant compatible'
          ],
          colors: ['Black', 'Silver'],
          categories: ['Electronics', 'Audio', 'Headphones'],
          tags: ['wireless', 'bluetooth', 'noise-cancelling', 'premium-audio'],
          price: 399,
          compareAtPrice: 449,
          sku: 'WH-1000XM5-BLK',
          seoTitle: 'Premium Wireless Noise-Cancelling Headphones | Your Store',
          seoDescription: 'Shop our premium wireless headphones with industry-leading noise cancellation. 30-hour battery, Bluetooth 5.2, available in black and silver.'
        }
      };
    }));

    toast.success('Product processing complete!');
  };

  const processAllFiles = async () => {
    setIsProcessing(true);
    const idleProducts = products.filter(p => p.status === ProcessingStatus.IDLE);
    
    for (const product of idleProducts) {
      await simulateProcessing(product.id);
    }
    
    setIsProcessing(false);
  };

  const removeProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    if (selectedProduct === productId) {
      const remaining = products.filter(p => p.id !== productId);
      setSelectedProduct(remaining.length > 0 ? remaining[0].id : null);
    }
  };

  const setMainImage = (productId: string, imageIndex: number) => {
    setProducts(prev => prev.map(p => {
      if (p.id !== productId) return p;
      return {
        ...p,
        mainImageIndex: imageIndex,
        extractedImages: p.extractedImages.map((img, idx) => ({
          ...img,
          isMain: idx === imageIndex
        }))
      };
    }));
  };

  const updateMetadata = (productId: string, field: string, value: any) => {
    setProducts(prev => prev.map(p => {
      if (p.id !== productId) return p;
      return {
        ...p,
        metadata: {
          ...p.metadata,
          [field]: value
        }
      };
    }));
  };

  const saveToDatabase = async (productId: string) => {
    toast.loading('Saving product to database...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    toast.success('Product saved successfully!');
  };

  const saveAllProducts = async () => {
    const completedProducts = products.filter(p => p.status === ProcessingStatus.COMPLETE);
    for (const product of completedProducts) {
      await saveToDatabase(product.id);
    }
  };

  const regenerateMetadata = async (productId: string) => {
    setProducts(prev => prev.map(p => 
      p.id === productId 
        ? { ...p, status: ProcessingStatus.GENERATING_METADATA }
        : p
    ));
    
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setProducts(prev => prev.map(p => 
      p.id === productId 
        ? { ...p, status: ProcessingStatus.COMPLETE }
        : p
    ));
    
    toast.success('Metadata regenerated successfully!');
  };

  const currentProduct = products.find(p => p.id === selectedProduct);

  const completedCount = products.filter(p => p.status === ProcessingStatus.COMPLETE).length;
  const totalCount = products.length;

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-neutral-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-xl font-bold text-neutral-900">Product Importer</h1>
              <p className="text-sm text-neutral-500">Upload images or PDFs, auto-extract product data with AI</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Label htmlFor="auto-save" className="text-sm">Auto-save</Label>
                <Switch id="auto-save" checked={autoSave} onCheckedChange={setAutoSave} />
              </div>
              <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="de">Deutsch</SelectItem>
                  <SelectItem value="it">Italiano</SelectItem>
                </SelectContent>
              </Select>
              {completedCount > 0 && (
                <Button onClick={saveAllProducts} className="bg-green-600 hover:bg-green-700">
                  <Save className="h-4 w-4 mr-2" />
                  Save All ({completedCount})
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Upload Zone */}
        {products.length === 0 && (
          <div className="max-w-3xl mx-auto">
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-3xl p-16 text-center transition-all cursor-pointer ${
                isDragActive 
                  ? 'border-neutral-900 bg-neutral-100 scale-[1.02]' 
                  : 'border-neutral-300 bg-white hover:border-neutral-400 hover:bg-neutral-50'
              }`}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mb-6">
                  <Upload className="h-10 w-10 text-neutral-500" />
                </div>
                <h3 className="text-2xl font-semibold mb-3">Drop your files here</h3>
                <p className="text-neutral-500 mb-8 max-w-md">
                  Upload PDFs, JPG, PNG, or WEBP files. Our AI will automatically extract images, run OCR, and generate complete product listings.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <Badge variant="secondary" className="px-4 py-1.5 text-sm">
                    <File className="h-4 w-4 mr-2" />
                    PDF
                  </Badge>
                  <Badge variant="secondary" className="px-4 py-1.5 text-sm">
                    <Image className="h-4 w-4 mr-2" />
                    JPG
                  </Badge>
                  <Badge variant="secondary" className="px-4 py-1.5 text-sm">
                    <Image className="h-4 w-4 mr-2" />
                    PNG
                  </Badge>
                  <Badge variant="secondary" className="px-4 py-1.5 text-sm">
                    <Image className="h-4 w-4 mr-2" />
                    WEBP
                  </Badge>
                </div>
                <p className="text-xs text-neutral-400 mt-6">Max file size: 50MB • Up to 20 files per batch</p>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-6 mt-12">
              <Card className="p-6 rounded-2xl">
                <Sparkles className="h-8 w-8 text-amber-500 mb-4" />
                <h4 className="font-semibold mb-2">AI-Powered OCR</h4>
                <p className="text-sm text-neutral-500">Tesseract OCR extracts text from all uploaded files automatically</p>
              </Card>
              <Card className="p-6 rounded-2xl">
                <RefreshCw className="h-8 w-8 text-blue-500 mb-4" />
                <h4 className="font-semibold mb-2">Auto-Translate</h4>
                <p className="text-sm text-neutral-500">LibreTranslate translates content to your store's language</p>
              </Card>
              <Card className="p-6 rounded-2xl">
                <Check className="h-8 w-8 text-green-500 mb-4" />
                <h4 className="font-semibold mb-2">Full Metadata</h4>
                <p className="text-sm text-neutral-500">Generates titles, descriptions, categories, tags, and SEO data</p>
              </Card>
            </div>
          </div>
        )}

        {products.length > 0 && (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* File Queue Sidebar */}
            <div className="lg:w-96 flex-shrink-0">
              <Card className="rounded-3xl overflow-hidden sticky top-24">
                <div className="p-6 bg-neutral-50 border-b border-neutral-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Upload Queue ({products.length})</h3>
                    <Button
                      {...getRootProps()}
                      variant="secondary"
                      size="sm"
                      className="rounded-full"
                    >
                      <input {...getInputProps()} />
                      <Upload className="h-4 w-4 mr-2" />
                      Add More
                    </Button>
                  </div>
                  {products.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-neutral-500">Overall Progress</span>
                        <span className="font-medium">{Math.round((completedCount / totalCount) * 100)}%</span>
                      </div>
                      <Progress value={(completedCount / totalCount) * 100} className="h-2" />
                    </div>
                  )}
                </div>
                <ScrollArea className="h-[500px] p-4">
                  <div className="space-y-3">
                    {products.map(product => (
                      <div
                        key={product.id}
                        onClick={() => setSelectedProduct(product.id)}
                        className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                          selectedProduct === product.id
                            ? 'border-neutral-900 bg-neutral-50'
                            : 'border-transparent hover:border-neutral-200 bg-white'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-3 h-3 rounded-full mt-1.5 ${StatusColors[product.status]}`} />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{product.fileName}</p>
                            <p className="text-xs text-neutral-500 mt-1">
                              {ProcessingMessages[product.status]}
                            </p>
                            {product.status !== ProcessingStatus.IDLE && 
                             product.status !== ProcessingStatus.COMPLETE && (
                              <Progress value={product.progress} className="h-1 mt-2" />
                            )}
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeProduct(product.id);
                            }}
                            className="p-1 hover:bg-neutral-100 rounded-full transition-colors"
                          >
                            <X className="h-4 w-4 text-neutral-400" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <div className="p-4 border-t border-neutral-200 bg-white">
                  <Button
                    onClick={processAllFiles}
                    disabled={isProcessing || products.every(p => p.status !== ProcessingStatus.IDLE)}
                    className="w-full bg-neutral-900 hover:bg-neutral-800 rounded-2xl py-6"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Process All Files
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            </div>

            {/* Detail Panel */}
            <div className="flex-1">
              {currentProduct ? (
                <Tabs defaultValue="preview" className="w-full">
                  <TabsList className="grid w-full grid-cols-4 mb-6 rounded-2xl p-1 bg-neutral-100">
                    <TabsTrigger value="preview" className="rounded-xl">Preview</TabsTrigger>
                    <TabsTrigger value="images" className="rounded-xl">Images</TabsTrigger>
                    <TabsTrigger value="raw-text" className="rounded-xl">Raw OCR</TabsTrigger>
                    <TabsTrigger value="edit" className="rounded-xl">Edit</TabsTrigger>
                  </TabsList>

                  <TabsContent value="preview" className="mt-0">
                    <Card className="rounded-3xl p-8">
                      <div className="grid lg:grid-cols-2 gap-8">
                        <div>
                          {currentProduct.extractedImages.length > 0 ? (
                            <div className="space-y-4">
                              <img
                                src={currentProduct.extractedImages[currentProduct.mainImageIndex]?.url}
                                alt={currentProduct.metadata.title}
                                className="w-full aspect-square object-cover rounded-2xl bg-neutral-100"
                              />
                              <div className="flex gap-3 overflow-x-auto pb-2">
                                {currentProduct.extractedImages.map((img, idx) => (
                                  <button
                                    key={idx}
                                    onClick={() => setMainImage(currentProduct.id, idx)}
                                    className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                                      currentProduct.mainImageIndex === idx
                                        ? 'border-neutral-900'
                                        : 'border-transparent opacity-60 hover:opacity-100'
                                    }`}
                                  >
                                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                                  </button>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <div className="aspect-square bg-neutral-100 rounded-2xl flex items-center justify-center">
                              <Image className="h-16 w-16 text-neutral-400" />
                              <span className="ml-3 text-neutral-500">No images extracted yet</span>
                            </div>
                          )}
                        </div>
                        <div className="space-y-6">
                          <div>
                            <Badge className="mb-3">{currentProduct.fileType.toUpperCase()}</Badge>
                            <h2 className="text-3xl font-bold mb-2">
                              {currentProduct.metadata.title || 'Processing...'}
                            </h2>
                            <p className="text-neutral-500">
                              {currentProduct.metadata.shortDescription || 'Waiting for data extraction...'}
                            </p>
                          </div>

                          <Separator />

                          <div className="flex items-baseline gap-4">
                            {currentProduct.metadata.price && (
                              <>
                                <span className="text-4xl font-bold">
                                  ${currentProduct.metadata.price}
                                </span>
                                {currentProduct.metadata.compareAtPrice && (
                                  <span className="text-xl text-neutral-400 line-through">
                                    ${currentProduct.metadata.compareAtPrice}
                                  </span>
                                )}
                              </>
                            )}
                          </div>

                          <Separator />

                          <div>
                            <h4 className="font-semibold mb-3">Categories</h4>
                            <div className="flex flex-wrap gap-2">
                              {currentProduct.metadata.categories.length > 0 ? (
                                currentProduct.metadata.categories.map((cat, idx) => (
                                  <Badge key={idx} variant="secondary">{cat}</Badge>
                                ))
                              ) : (
                                <span className="text-neutral-400 text-sm">No categories extracted</span>
                              )}
                            </div>
                          </div>

                          <div>
                            <h4 className="font-semibold mb-3">Tags</h4>
                            <div className="flex flex-wrap gap-2">
                              {currentProduct.metadata.tags.length > 0 ? (
                                currentProduct.metadata.tags.map((tag, idx) => (
                                  <Badge key={idx}>{tag}</Badge>
                                ))
                              ) : (
                                <span className="text-neutral-400 text-sm">No tags extracted</span>
                              )}
                            </div>
                          </div>

                          <div className="pt-4 flex gap-3">
                            <Button
                              onClick={() => saveToDatabase(currentProduct.id)}
                              className="bg-green-600 hover:bg-green-700 rounded-2xl py-6 px-8"
                              disabled={currentProduct.status !== ProcessingStatus.COMPLETE}
                            >
                              <Save className="h-4 w-4 mr-2" />
                              Save Product
                            </Button>
                            <Button
                              onClick={() => regenerateMetadata(currentProduct.id)}
                              variant="secondary"
                              className="rounded-2xl py-6 px-8"
                              disabled={currentProduct.status !== ProcessingStatus.COMPLETE}
                            >
                              <RefreshCw className="h-4 w-4 mr-2" />
                              Regenerate
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </TabsContent>

                  <TabsContent value="images" className="mt-0">
                    <Card className="rounded-3xl p-8">
                      <h3 className="text-xl font-semibold mb-6">Extracted Images</h3>
                      {currentProduct.extractedImages.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                          {currentProduct.extractedImages.map((img, idx) => (
                            <div key={idx} className="relative group">
                              <img
                                src={img.url}
                                alt=""
                                className="w-full aspect-square object-cover rounded-2xl"
                              />
                              {img.isMain && (
                                <Badge className="absolute top-3 left-3 bg-green-500">Main</Badge>
                              )}
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center">
                                <Button
                                  size="sm"
                                  onClick={() => setMainImage(currentProduct.id, idx)}
                                  className="bg-white text-neutral-900 hover:bg-neutral-100"
                                >
                                  Set as Main
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-20 text-neutral-500">
                          <Image className="h-16 w-16 mx-auto mb-4 text-neutral-400" />
                          <p>No images extracted yet. Process your file to extract images.</p>
                        </div>
                      )}
                    </Card>
                  </TabsContent>

                  <TabsContent value="raw-text" className="mt-0">
                    <Card className="rounded-3xl p-8">
                      <div className="grid lg:grid-cols-2 gap-8">
                        <div>
                          <h3 className="text-lg font-semibold mb-4">Raw OCR Text</h3>
                          <div className="bg-neutral-900 rounded-2xl p-6 min-h-[400px]">
                            <pre className="text-green-400 text-sm whitespace-pre-wrap font-mono">
                              {currentProduct.rawOcrText || 'Waiting for OCR processing...'}
                            </pre>
                          </div>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold mb-4">Translated Text ({targetLanguage})</h3>
                          <div className="bg-neutral-100 rounded-2xl p-6 min-h-[400px]">
                            <pre className="text-neutral-700 text-sm whitespace-pre-wrap font-mono">
                              {currentProduct.translatedText || 'Waiting for translation...'}
                            </pre>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </TabsContent>

                  <TabsContent value="edit" className="mt-0">
                    <Card className="rounded-3xl p-8">
                      <h3 className="text-xl font-semibold mb-6">Edit Product Metadata</h3>
                      <div className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <Label>Title</Label>
                            <Input
                              value={currentProduct.metadata.title}
                              onChange={(e) => updateMetadata(currentProduct.id, 'title', e.target.value)}
                              className="mt-2 rounded-xl"
                            />
                          </div>
                          <div>
                            <Label>SKU</Label>
                            <Input
                              value={currentProduct.metadata.sku}
                              onChange={(e) => updateMetadata(currentProduct.id, 'sku', e.target.value)}
                              className="mt-2 rounded-xl"
                            />
                          </div>
                        </div>

                        <div>
                          <Label>Short Description</Label>
                          <Textarea
                            value={currentProduct.metadata.shortDescription}
                            onChange={(e) => updateMetadata(currentProduct.id, 'shortDescription', e.target.value)}
                            className="mt-2 rounded-xl min-h-[80px]"
                          />
                        </div>

                        <div>
                          <Label>Long Description</Label>
                          <Textarea
                            value={currentProduct.metadata.longDescription}
                            onChange={(e) => updateMetadata(currentProduct.id, 'longDescription', e.target.value)}
                            className="mt-2 rounded-xl min-h-[150px]"
                          />
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <Label>Price</Label>
                            <Input
                              type="number"
                              value={currentProduct.metadata.price || ''}
                              onChange={(e) => updateMetadata(currentProduct.id, 'price', parseFloat(e.target.value))}
                              className="mt-2 rounded-xl"
                            />
                          </div>
                          <div>
                            <Label>Compare At Price (MSRP)</Label>
                            <Input
                              type="number"
                              value={currentProduct.metadata.compareAtPrice || ''}
                              onChange={(e) => updateMetadata(currentProduct.id, 'compareAtPrice', parseFloat(e.target.value))}
                              className="mt-2 rounded-xl"
                            />
                          </div>
                        </div>

                        <Separator />

                        <div>
                          <h4 className="font-semibold mb-4">SEO Metadata</h4>
                          <div className="space-y-4">
                            <div>
                              <Label>SEO Title</Label>
                              <Input
                                value={currentProduct.metadata.seoTitle}
                                onChange={(e) => updateMetadata(currentProduct.id, 'seoTitle', e.target.value)}
                                className="mt-2 rounded-xl"
                              />
                            </div>
                            <div>
                              <Label>SEO Description</Label>
                              <Textarea
                                value={currentProduct.metadata.seoDescription}
                                onChange={(e) => updateMetadata(currentProduct.id, 'seoDescription', e.target.value)}
                                className="mt-2 rounded-xl"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </TabsContent>
                </Tabs>
              ) : (
                <Card className="rounded-3xl p-16 text-center">
                  <p className="text-neutral-500">Select a product from the queue to view details</p>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}