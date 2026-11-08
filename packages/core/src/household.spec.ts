import { describe, expect, it } from 'vitest';
import { dietFromPreferences, householdFactor, preferencesFromHousehold, trialDaysLeft } from './index.ts';

describe('householdFactor', () => {
  it('foyer de référence 2 + 2 = 1', () => expect(householdFactor(2, 2)).toBeCloseTo(1));
  it('un adulte seul ≈ 0,29', () => expect(householdFactor(1, 0)).toBeCloseTo(0.294, 3));
  it('refuse 0 adulte', () => expect(() => householdFactor(0, 2)).toThrow());
});

describe('dietFromPreferences / preferencesFromHousehold', () => {
  it('sans choix → omnivore', () =>
    expect(dietFromPreferences([])).toEqual({ diet: 'omnivore', exclusions: [] }));
  it('végétarien prime, le reste va dans les exclusions', () => {
    expect(dietFromPreferences(['sans_gluten', 'vegetarien', 'sans_porc'])).toEqual({
      diet: 'vegetarien',
      exclusions: ['sans_porc', 'sans_gluten'],
    });
  });
  it('aller-retour sans perte', () => {
    const sel = ['sans_porc', 'sans_lactose', 'peu_epice'] as const;
    const { diet, exclusions } = dietFromPreferences(sel);
    expect(diet).toBe('sans_porc');
    expect(preferencesFromHousehold(diet, exclusions)).toEqual([...sel]);
  });
});

describe('trialDaysLeft', () => {
  const now = new Date('2026-11-07T12:00:00Z');
  it('compte les jours restants avec les bonus', () => {
    expect(trialDaysLeft('2026-11-16T12:00:00Z', 0, now)).toBe(9);
    expect(trialDaysLeft('2026-11-16T12:00:00Z', 3, now)).toBe(12);
  });
  it('jamais négatif', () => expect(trialDaysLeft('2026-11-01T00:00:00Z', 0, now)).toBe(0));
});
