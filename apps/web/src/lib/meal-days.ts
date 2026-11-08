// Jours planifiés du foyer (1 = lundi … 7 = dimanche) : textes d'affichage, côté serveur ou client.

export const DAY_NAMES = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];

/** « Du lundi au vendredi », « Toute la semaine », « Lundi, mercredi et samedi »… */
export function daysSummary(days: readonly number[]): string {
  const sorted = [...days].sort((a, b) => a - b);
  if (sorted.length === 7) return 'Toute la semaine';
  if (sorted.length === 0) return 'Aucun jour';
  if (sorted.length === 1) return `Le ${DAY_NAMES[sorted[0]! - 1]}`;
  const contiguous = sorted.every((d, i) => i === 0 || d === sorted[i - 1]! + 1);
  if (contiguous) return `Du ${DAY_NAMES[sorted[0]! - 1]} au ${DAY_NAMES[sorted.at(-1)! - 1]}`;
  const names = sorted.map((d) => DAY_NAMES[d - 1]!);
  const text = `${names.slice(0, -1).join(', ')} et ${names.at(-1)}`;
  return text.charAt(0).toUpperCase() + text.slice(1);
}
