import type { MetadataRoute } from 'next';

// Le back-office ne doit jamais être indexé.
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: '*', disallow: '/' } };
}
