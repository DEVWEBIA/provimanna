import { describe, expect, it } from 'vitest';
import { formatEuro } from './index.ts';

describe('formatEuro (Vitest)', () => {
  it('formate des centimes en euros fr-FR avec une espace insécable', () => {
    expect(formatEuro(406)).toBe('4,06\u00a0€');
    expect(formatEuro(7160)).toBe('71,60\u00a0€');
  });
});
