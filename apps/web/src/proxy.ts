import type { NextRequest } from 'next/server';
import { redirectWithSession, updateSession } from './lib/supabase/proxy';

// /app/* exige une session. (La redirection vers l'onboarding arrive au lot 4.)
export async function proxy(request: NextRequest) {
  const { response, user } = await updateSession(request);
  if (!user && request.nextUrl.pathname.startsWith('/app')) {
    return redirectWithSession(request, response, '/connexion');
  }
  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|llms.txt|.*\\.(?:svg|png|jpg|jpeg|webp|avif|ico)$).*)',
  ],
};
