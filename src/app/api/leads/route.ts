import { NextResponse } from 'next/server'
import { createLead, type Lead } from '@/lib/supabase'

const leadTypes: Lead['type'][] = ['quote', 'financing', 'distributor', 'installer', 'contact']

export async function POST(request: Request) {
  try {
    const body = await request.json()
    if (!body.name || !body.email || !leadTypes.includes(body.type)) {
      return NextResponse.json({ error: 'Données de contact invalides' }, { status: 400 })
    }

    await createLead({
      type: body.type,
      name: String(body.name),
      email: String(body.email),
      phone: body.phone ? String(body.phone) : undefined,
      company: body.company ? String(body.company) : undefined,
      model: body.model ? String(body.model) : undefined,
      region: body.region ? String(body.region) : undefined,
      message: body.message ? String(body.message) : undefined,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Neon lead creation error:', error)
    return NextResponse.json({ error: 'Impossible d’enregistrer la demande' }, { status: 500 })
  }
}
