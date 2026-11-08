import { describe, expect, it } from 'vitest';
import { challengeProgress, displayedStreak, nextStreak } from './engagement.ts';

describe('série', () => {
  const s0 = { current_weeks: 0, best_weeks: 0, last_validated_week: null };
  it('commence à 1, continue d’une semaine sur l’autre, repart à 1 après un trou', () => {
    const a = nextStreak(s0, '2026-11-02');
    expect(a.current_weeks).toBe(1);
    const b = nextStreak(a, '2026-11-09');
    expect(b).toEqual({ current_weeks: 2, best_weeks: 2, last_validated_week: '2026-11-09' });
    expect(nextStreak(b, '2026-11-09')).toBe(b); // revalider la même semaine ne compte pas deux fois
    expect(nextStreak(b, '2026-11-30')).toEqual({
      current_weeks: 1,
      best_weeks: 2,
      last_validated_week: '2026-11-30',
    });
  });
  it('affichage : la série tient jusqu’à la fin de la semaine suivante', () => {
    const s = { current_weeks: 6, best_weeks: 6, last_validated_week: '2026-11-02' };
    expect(displayedStreak(s, '2026-11-09')).toBe(6);
    expect(displayedStreak(s, '2026-11-16')).toBe(0);
  });
});

describe('défis', () => {
  const v = '2026-11-10T00:00:00Z';
  const plans = [
    { week_start: '2026-10-19', total_cents: 6900, reference_cents: 7000, validated_at: v },
    { week_start: '2026-10-26', total_cents: 7200, reference_cents: 7300, validated_at: v },
    { week_start: '2026-11-02', total_cents: 6500, reference_cents: 7000, validated_at: v },
    { week_start: '2026-11-09', total_cents: 6000, reference_cents: 7000, validated_at: null },
  ];
  const data = { plans, streak: 3, tickets: 0, currentWeek: '2026-11-09' };
  it('moins de 70 € 3 semaines sur 4 (plans validés seulement)', () => {
    expect(challengeProgress({ id: 'sous_70_3_sur_4', target: 3, window_weeks: 4 }, data)).toEqual({
      id: 'sous_70_3_sur_4',
      done: 2,
      target: 3,
      completed: false,
    });
  });
  it('série et premier ticket', () => {
    expect(challengeProgress({ id: 'serie_8', target: 8, window_weeks: 8 }, data).done).toBe(3);
    expect(
      challengeProgress({ id: 'premier_ticket', target: 1, window_weeks: 52 }, { ...data, tickets: 2 })
        .completed,
    ).toBe(true);
  });
});
