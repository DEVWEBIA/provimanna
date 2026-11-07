import { describe, expect, it } from 'vitest';
import { safeNext } from './redirect';

describe('safeNext', () => {
  it('garde un chemin interne', () => expect(safeNext('/app/plan')).toBe('/app/plan'));
  it.each(['https://evil.example', '//evil.example', '/\\evil.example', '', null, 42])('refuse %s', (v) =>
    expect(safeNext(v)).toBe('/app'),
  );
});
