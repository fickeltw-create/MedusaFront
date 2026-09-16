import { NextResponse } from "next/server"

// Middleware vide : pas de redirections, toutes les routes fonctionnent nativement
export function middleware() {
  return NextResponse.next()
}

export const config = {
  matcher: [] // N'applique le middleware sur aucune route, tout est géré par Next.js
}