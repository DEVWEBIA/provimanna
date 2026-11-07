import type { NextRequest } from 'next/server';
import { redirectWithSession, updateSession } from './lib/supabase/proxy';

const PUBLIC_PATHS = ['/connexion', '/auth'];

// Tout le back-office exige une session. Le contrôle des rôles staff (has_role) arrive au lot 9.
export async function proxy(request: NextRequest) {
  const { response, user } = await updateSession(request);
  const isPublic = PUBLIC_PATHS.some((p) => request.nextUrl.pathname.startsWith(p));
  if (!user && !isPublic) return redirectWithSession(request, response, '/connexion');
  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|.*\\.(?:svg|png|jpg|jpeg|webp|avif|ico)$).*)',
  ],
};
