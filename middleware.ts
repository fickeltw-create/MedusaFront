import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const DEFAULT_COUNTRY_CODE = process.env.NEXT_PUBLIC_DEFAULT_REGION || process.env.DEFAULT_COUNTRY_CODE || "be"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname === "/store" || pathname.startsWith("/store/")) {
    const url = request.nextUrl.clone()
    url.pathname = `/${DEFAULT_COUNTRY_CODE}${pathname}`
    return NextResponse.redirect(url)
  }

  if (pathname === "/shop" || pathname.startsWith("/shop/")) {
    const url = request.nextUrl.clone()
    url.pathname = pathname.replace(/^\/shop/, `/${DEFAULT_COUNTRY_CODE}/store`)
    return NextResponse.redirect(url)
  }

  if (pathname === "/boutique" || pathname.startsWith("/boutique/")) {
    const url = request.nextUrl.clone()
    url.pathname = pathname.replace(/^\/boutique/, `/${DEFAULT_COUNTRY_CODE}/store`)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/shop/:path*", "/store/:path*", "/boutique/:path*"],
}
