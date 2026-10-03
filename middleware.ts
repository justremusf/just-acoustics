import { NextResponse, type NextRequest } from 'next/server'
import { CONSENT_REGION_COOKIE, isStrictConsentCountry } from '@/lib/consentRegion'

// Tags each visitor with the consent rules for their country (EEA/UK/CH need opt-in; elsewhere,
// e.g. Singapore, cookies are on by default with a notice). Done here, not in a layout, so every
// page stays statically cached.
export function middleware(request: NextRequest) {
  const country = request.headers.get('x-vercel-ip-country')
  const region = isStrictConsentCountry(country) ? 'strict' : 'standard'
  const response = NextResponse.next()
  if (request.cookies.get(CONSENT_REGION_COOKIE)?.value !== region) {
    response.cookies.set(CONSENT_REGION_COOKIE, region, { path: '/', maxAge: 60 * 60 * 24 * 30, sameSite: 'lax', secure: true })
  }
  return response
}

export const config = {
  // Pages only: skip static files, images, API routes and the Sanity studio.
  matcher: ['/((?!_next/|api/|studio|favicon.ico|robots.txt|sitemap.xml|assets/|media/|.*\\.[a-zA-Z0-9]+$).*)'],
}
