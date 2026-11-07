/** Chemin de retour après connexion : uniquement un chemin interne (évite les redirections ouvertes). */
export function safeNext(value: unknown, fallback = '/app'): string {
  if (typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//') || value.includes('\\')) {
    return fallback;
  }
  return value;
}
