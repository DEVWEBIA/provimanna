import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import type { Database } from '@repas/core/database.types';
import { publicEnv } from '../env';

/** Rafraîchit la session Supabase à chaque requête et renvoie l'utilisateur courant. */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });
  const supabase = createServerClient<Database>(
    publicEnv.NEXT_PUBLIC_SUPABASE_URL,
    publicEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (toSet) => {
          for (const { name, value } of toSet) request.cookies.set(name, value);
          response = NextResponse.next({ request });
          for (const { name, value, options } of toSet) response.cookies.set(name, value, options);
        },
      },
    },
  );
  // Ne rien intercaler entre createServerClient et getUser (recommandation @supabase/ssr).
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { response, user };
}

/** Redirection qui conserve les cookies de session rafraîchis. */
export function redirectWithSession(request: NextRequest, from: NextResponse, pathname: string) {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  url.search = '';
  if (pathname === '/connexion') url.searchParams.set('suite', request.nextUrl.pathname);
  const redirect = NextResponse.redirect(url);
  for (const cookie of from.cookies.getAll()) redirect.cookies.set(cookie);
  return redirect;
}
