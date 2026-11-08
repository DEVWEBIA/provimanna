/** « 14 novembre 2026 » (heure de Paris). */
export function longDate(at: string | Date): string {
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Europe/Paris',
  }).format(new Date(at));
}

/** Date la plus récente d'une liste de dates ISO. */
export const latest = (dates: (string | null)[]) =>
  dates
    .filter((d): d is string => d !== null)
    .reduce<string | null>((a, b) => (!a || Date.parse(b) > Date.parse(a) ? b : a), null);
