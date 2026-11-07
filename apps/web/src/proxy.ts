import type { NextRequest } from 'next/server';
import { redirectWithSession, updateSession } from './lib/supabase/proxy';

// /app/* exige une session ; une personne déjà connectée qui ouvre /connexion part vers /app.
// La redirection vers l'onboarding (foyer incomplet) se fait dans le layout de /app (lecture du foyer).
export async function proxy(request: NextRequest) {
  const { response, user } = await updateSession(request);
  const { pathname } = request.nextUrl;
  if (!user && pathname.startsWith('/app')) return redirectWithSession(request, response, '/connexion');
  if (user && pathname === '/connexion') return redirectWithSession(request, response, '/app');
  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|llms.txt|.*\\.(?:svg|png|jpg|jpeg|webp|avif|ico)$).*)',
  ],
};
