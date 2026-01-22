export async function GET() {
  const robotsTxt = `
User-agent: *
Allow: /
Allow: /jobs$
Disallow: /jobs/*
Disallow: /admin
Disallow: /employer
Disallow: /api
Disallow: /login

Sitemap: ${process.env.NEXT_PUBLIC_SITE_URL}/sitemap.xml
  `.trim()

  return new Response(robotsTxt, {
    headers: { 'Content-Type': 'text/plain' }
  })
}
