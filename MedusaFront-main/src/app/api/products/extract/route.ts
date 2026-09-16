import { NextResponse } from 'next/server';
import { createWorker } from 'tesseract.js';
import { inferDraftFromText, ProductSourceType } from '@/lib/shop';
import * as XLSX from 'xlsx';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';

export const runtime = 'nodejs';

function getSourceType(file: File): ProductSourceType {
  if (file.type.includes('pdf')) return 'pdf';
  if (file.type.startsWith('image/')) return 'image';
  return 'excel';
}

function withTimeout<T>(promise: Promise<T>, ms: number, fallback: T): Promise<T> {
  return new Promise((resolve) => {
    const timer = setTimeout(() => resolve(fallback), ms);
    promise
      .then((value) => {
        clearTimeout(timer);
        resolve(value);
      })
      .catch(() => {
        clearTimeout(timer);
        resolve(fallback);
      });
  });
}

async function extractPdfText(buffer: ArrayBuffer): Promise<string> {
  try {
    const loadingTask = getDocument({ data: new Uint8Array(buffer) });
    const pdf = await loadingTask.promise;
    const maxPages = Math.min(pdf.numPages, 2);
    const parts: string[] = [];

    for (let pageNumber = 1; pageNumber <= maxPages; pageNumber += 1) {
      const page = await pdf.getPage(pageNumber);
      const content = await page.getTextContent();
      const pageText = content.items
        .map((item) => ('str' in item ? item.str : ''))
        .join(' ')
        .trim();
      if (pageText) parts.push(pageText);
    }

    return parts.join('\n');
  } catch {
    return '';
  }
}

async function extractImageText(buffer: ArrayBuffer): Promise<string> {
  try {
    const worker = await createWorker('eng+fra');
    try {
      const result = await withTimeout(worker.recognize(Buffer.from(buffer)), 15000, { data: { text: '' } } as any);
      return result.data.text || '';
    } finally {
      await worker.terminate();
    }
  } catch {
    return '';
  }
}

async function extractExcelText(buffer: ArrayBuffer): Promise<string> {
  try {
    const workbook = XLSX.read(Buffer.from(buffer), { type: 'buffer' });
    const firstSheetName = workbook.SheetNames[0];
    if (!firstSheetName) return '';

    const sheet = workbook.Sheets[firstSheetName];
    const rows = XLSX.utils.sheet_to_json<Array<string | number | null>>(sheet, { header: 1, raw: false });
    return rows
      .map((row) => row.filter(Boolean).join(' | '))
      .filter(Boolean)
      .join('\n');
  } catch {
    return '';
  }
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('file');

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'Missing file' }, { status: 400 });
  }

  const sourceType = getSourceType(file);
  const buffer = await file.arrayBuffer();
  let rawText = '';

  if (sourceType === 'pdf') {
    rawText = await withTimeout(extractPdfText(buffer), 6000, '');
  } else if (sourceType === 'image') {
    rawText = await withTimeout(extractImageText(buffer), 15000, '');
  } else {
    rawText = await withTimeout(extractExcelText(buffer), 6000, '');
  }

  const result = inferDraftFromText({
    rawText,
    fileName: file.name,
    sourceType,
  });

  return NextResponse.json({
    result,
    detectedRows: rawText.split('\n').filter(Boolean).length,
    fileName: file.name,
    mimeType: file.type,
  });
}
