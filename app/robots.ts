import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/search?*',
          '/*?error=*',
          '/admin',
          '/admin/*',
          '/dashboard',
          '/dashboard/*',
          '/_next/',
          '/_vercel/',
        ],
      },
    ],
    sitemap: 'https://localpotteryclasses.com/sitemap.xml',
    host: 'https://localpotteryclasses.com',
  }
}