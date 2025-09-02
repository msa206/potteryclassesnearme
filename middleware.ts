import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl
  const url = request.nextUrl.clone()

  // Normalize multiple slashes to single slash
  if (pathname.includes('//')) {
    url.pathname = pathname.replace(/\/+/g, '/')
    return NextResponse.redirect(url)
  }

  // Handle common URL variations and redirects
  const normalizations: Record<string, string> = {
    // Common pottery-related variations
    '/pottery-class': '/pottery-classes',
    '/pottery-studio': '/pottery-classes',
    '/ceramic-classes': '/pottery-classes',
    '/ceramic-studio': '/pottery-classes',
    '/clay-classes': '/pottery-classes',
    
    // Handle legacy URLs
    '/studios': '/pottery-classes',
    '/classes': '/pottery-classes',
    '/workshops': '/pottery-classes',
    
    // Handle search variations
    '/find': '/search',
    '/locate': '/search',
    '/directory': '/pottery-classes',
  }

  if (normalizations[pathname]) {
    url.pathname = normalizations[pathname]
    return NextResponse.redirect(url)
  }

  // Convert state abbreviations to lowercase in URLs
  const stateMatch = pathname.match(/^\/pottery-classes\/state\/([A-Z]{2})(\/|$)/)
  if (stateMatch) {
    const stateCode = stateMatch[1].toLowerCase()
    url.pathname = pathname.replace(/\/state\/[A-Z]{2}/, `/state/${stateCode}`)
    return NextResponse.redirect(url)
  }

  // Convert individual state/city paths to lowercase
  const pathMatch = pathname.match(/^\/pottery-classes\/([A-Z]{2})\//)
  if (pathMatch) {
    const stateCode = pathMatch[1].toLowerCase()
    url.pathname = pathname.replace(/^\/pottery-classes\/[A-Z]{2}\//, `/pottery-classes/${stateCode}/`)
    return NextResponse.redirect(url)
  }

  // Clean up query parameters
  const params = new URLSearchParams(search)
  let hasChanged = false

  // Remove empty parameters
  params.forEach((value, key) => {
    if (!value || value.trim() === '') {
      params.delete(key)
      hasChanged = true
    }
  })

  // Normalize common search parameters
  if (params.has('q') && !params.has('location')) {
    params.set('location', params.get('q') || '')
    params.delete('q')
    hasChanged = true
  }

  // Remove page=1 from URLs (it's the default)
  if (params.get('page') === '1') {
    params.delete('page')
    hasChanged = true
  }

  if (hasChanged) {
    const newSearch = params.toString()
    url.search = newSearch ? `?${newSearch}` : ''
    return NextResponse.redirect(url)
  }

  // Add security headers
  const response = NextResponse.next()
  
  // Security headers
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  
  // Cache headers for static assets
  if (pathname.startsWith('/_next/static/') || pathname.match(/\.(js|css|png|jpg|jpeg|gif|webp|svg|ico)$/)) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable')
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files (images, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
}