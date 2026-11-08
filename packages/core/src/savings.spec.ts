import { describe, expect, it } from 'vitest';
import { savingsCents, weekSavingCents } from './savings.ts';

const v = '2026-11-12T10:00:00Z';
describe('économies', () => {
  it('écart enseigne habituelle − enseigne choisie, plans validés seulement, plancher à 0', () => {
    expect(weekSavingCents({ reference_cents: 7160, total_cents: 6010, validated_at: v })).toBe(1150);
    expect(weekSavingCents({ reference_cents: 7160, total_cents: 6010, validated_at: null })).toBe(0);
    expect(weekSavingCents({ reference_cents: 6000, total_cents: 6500, validated_at: v })).toBe(0);
  });
  it('total du seed de Marion : 58,30 €', () => {
    const weeks: [number, number][] = [
      [7020, 960],
      [7160, 1150],
      [6980, 1080],
      [7090, 940],
      [6890, 670],
      [7160, 1030],
    ];
    expect(
      savingsCents(
        weeks.map(([ref, s]) => ({ reference_cents: ref, total_cents: ref - s, validated_at: v })),
      ),
    ).toBe(5830);
  });
});
