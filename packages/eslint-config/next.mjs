import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import base from './base.mjs';

/** Apps Next.js : règles Next (Core Web Vitals, a11y via jsx-a11y) + base stricte. */
export default [...nextVitals, ...nextTs, ...base, { ignores: ['next-env.d.ts'] }];
