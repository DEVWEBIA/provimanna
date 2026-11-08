// Semaines et dates du plan, à l'heure de Paris. Fonctions pures (date courante injectable).

export const PLAN_TIME_ZONE = 'Europe/Paris';

const DAY_MS = 86_400_000;

/** Date civile (AAAA-MM-JJ) et jour de la semaine (1 = lundi) d'un instant, dans le fuseau donné. */
export function zonedDate(
  at: Date,
  timeZone: string = PLAN_TIME_ZONE,
): { iso: string; weekday: number; hour: number } {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'short',
    hour: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(at);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? '';
  const weekday = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].indexOf(get('weekday')) + 1;
  return { iso: `${get('year')}-${get('month')}-${get('day')}`, weekday, hour: Number(get('hour')) };
}

/** Ajoute n jours à une date civile AAAA-MM-JJ. */
export function addDays(iso: string, n: number): string {
  return new Date(Date.parse(`${iso}T00:00:00Z`) + n * DAY_MS).toISOString().slice(0, 10);
}

/** Lundi de la semaine en cours (heure de Paris), au format AAAA-MM-JJ. */
export function weekStartOf(at: Date, timeZone: string = PLAN_TIME_ZONE): string {
  const { iso, weekday } = zonedDate(at, timeZone);
  return addDays(iso, 1 - weekday);
}

/** Numéro de semaine ISO 8601 d'une date civile. */
export function isoWeek(iso: string): number {
  const d = new Date(`${iso}T00:00:00Z`);
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - day);
  const yearStart = Date.UTC(d.getUTCFullYear(), 0, 1);
  return Math.ceil(((d.getTime() - yearStart) / DAY_MS + 1) / 7);
}

/** Mois (1 à 12) d'une date civile. */
export function monthOf(iso: string): number {
  return Number(iso.slice(5, 7));
}

const MONTHS_SHORT = [
  'janv.',
  'févr.',
  'mars',
  'avr.',
  'mai',
  'juin',
  'juil.',
  'août',
  'sept.',
  'oct.',
  'nov.',
  'déc.',
];

/** « 16 – 22 nov. » ou « 30 nov. – 6 déc. ». */
export function weekRangeLabel(weekStart: string): string {
  const end = addDays(weekStart, 6);
  const [d1, m1] = [Number(weekStart.slice(8, 10)), monthOf(weekStart)];
  const [d2, m2] = [Number(end.slice(8, 10)), monthOf(end)];
  return m1 === m2
    ? `${d1} – ${d2} ${MONTHS_SHORT[m2 - 1]}`
    : `${d1} ${MONTHS_SHORT[m1 - 1]} – ${d2} ${MONTHS_SHORT[m2 - 1]}`;
}

/** « 12/11 » : date courte des relevés de prix. */
export function shortDate(at: string | Date, timeZone: string = PLAN_TIME_ZONE): string {
  const { iso } = zonedDate(new Date(at), timeZone);
  return `${iso.slice(8, 10)}/${iso.slice(5, 7)}`;
}
