import { describe, expect, it } from 'vitest';
import { addDays, isoWeek, shortDate, weekRangeLabel, weekStartOf, zonedDate } from './week.ts';

describe('semaines à l’heure de Paris', () => {
  it('lundi de la semaine en cours', () => {
    expect(weekStartOf(new Date('2026-11-12T18:00:00Z'))).toBe('2026-11-09'); // jeudi
    expect(weekStartOf(new Date('2026-11-15T22:30:00Z'))).toBe('2026-11-09'); // dimanche 23:30 à Paris
    expect(weekStartOf(new Date('2026-11-15T23:30:00Z'))).toBe('2026-11-16'); // lundi 00:30 à Paris
    expect(weekStartOf(new Date('2026-03-29T12:00:00Z'))).toBe('2026-03-23'); // jour du changement d'heure
  });

  it('numéro de semaine ISO (maquette : semaine 47 = 16 – 22 nov.)', () => {
    expect(isoWeek('2026-11-16')).toBe(47);
    expect(isoWeek('2026-01-01')).toBe(1);
    expect(isoWeek('2027-01-01')).toBe(53);
  });

  it('libellés', () => {
    expect(weekRangeLabel('2026-11-16')).toBe('16 – 22 nov.');
    expect(weekRangeLabel('2026-11-30')).toBe('30 nov. – 6 déc.');
    expect(addDays('2026-12-28', 7)).toBe('2027-01-04');
    expect(shortDate('2026-11-12T23:30:00Z')).toBe('13/11');
  });

  it('jour et heure locaux', () => {
    expect(zonedDate(new Date('2026-11-12T18:30:00Z'))).toEqual({ iso: '2026-11-12', weekday: 4, hour: 19 });
  });
});
