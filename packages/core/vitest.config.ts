import { defineConfig } from 'vitest/config';

// Les tests historiques (*.test.ts) tournent avec node:test ; les nouveaux tests utilisent Vitest (*.spec.ts).
export default defineConfig({
  test: { include: ['src/**/*.spec.ts'], passWithNoTests: true },
});
