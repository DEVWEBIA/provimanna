import { PUBLIC_PAGES, urlsetXml, xmlResponse } from '@/lib/seo/sitemap';

export const dynamic = 'force-static';

export function GET() {
  return xmlResponse(urlsetXml(PUBLIC_PAGES));
}
