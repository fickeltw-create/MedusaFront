import { NextResponse } from 'next/server';
import { fetchMedusaCatalog } from '@/lib/medusa-store';

export const dynamic = 'force-dynamic';

export async function GET() {
  const catalog = await fetchMedusaCatalog();
  return NextResponse.json(catalog, { status: 200 });
}
