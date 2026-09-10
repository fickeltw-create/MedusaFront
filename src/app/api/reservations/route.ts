import { NextResponse } from 'next/server'
import { createReservation } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    if (!body.name || !body.email || !body.model) {
      return NextResponse.json({ error: 'Données de réservation invalides' }, { status: 400 })
    }

    await createReservation({
      name: String(body.name),
      email: String(body.email),
      phone: body.phone ? String(body.phone) : undefined,
      model: String(body.model),
      status: 'pending',
      amount: Number(body.amount) || 100000,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Neon reservation creation error:', error)
    return NextResponse.json({ error: 'Impossible d’enregistrer la réservation' }, { status: 500 })
  }
}
