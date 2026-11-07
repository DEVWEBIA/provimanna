// Généré depuis design/maquettes/Plat.dc.html — 12 illustrations de plats (vue de dessus, assiette blanche).
// Ne pas retoucher les tracés à la main : régénérer depuis la maquette si elle change.
import type { ReactElement } from 'react';

export const PLAT_VARIANTS = [
  'curry',
  'salade',
  'soupe',
  'pates',
  'gratin',
  'poisson',
  'dahl',
  'omelette',
  'riz',
  'tarte',
  'lasagnes',
  'soupeverte',
] as const;
export type PlatVariant = (typeof PLAT_VARIANTS)[number];

export const PLAT_LABELS: Record<PlatVariant, string> = {
  curry: 'Curry de pois chiches',
  salade: 'Salade de lentilles et feta',
  soupe: 'Velouté de potimarron',
  pates: 'Pâtes à la tomate',
  gratin: 'Gratin de potimarron',
  poisson: 'Saumon, haricots verts et citron',
  dahl: 'Dahl de lentilles corail',
  omelette: 'Omelette aux herbes et salade',
  riz: 'Riz sauté aux légumes',
  tarte: 'Tarte aux poireaux',
  lasagnes: 'Lasagnes végétariennes',
  soupeverte: 'Soupe de poireaux',
};

export const PLAT_SHAPES: Record<PlatVariant, ReactElement> = {
  curry: (
    <>
      <circle cx="60" cy="60" r="57" fill="#FFFFFF" />
      <circle cx="60" cy="60" r="57" fill="none" stroke="#E3DDD0" strokeWidth="2" />
      <circle cx="60" cy="60" r="45" fill="#F7EEE8" />
      <path d="M22 66c0-20 17-33 38-33s38 13 38 33c0 15-17 25-38 25S22 81 22 66z" fill="#E9A23B" />
      <path
        d="M30 70c8 6 20 9 30 9s22-3 30-9"
        stroke="#D2862A"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      <ellipse cx="44" cy="52" rx="19" ry="12" fill="#FFFCF4" />
      <circle cx="40" cy="50" r="1.6" fill="#E9DFC9" />
      <circle cx="49" cy="53" r="1.6" fill="#E9DFC9" />
      <circle cx="45" cy="47" r="1.6" fill="#E9DFC9" />
      <circle cx="68" cy="58" r="5" fill="#F6D58E" stroke="#C9893A" strokeWidth="1.2" />
      <circle cx="80" cy="66" r="5" fill="#F6D58E" stroke="#C9893A" strokeWidth="1.2" />
      <circle cx="62" cy="72" r="5" fill="#F6D58E" stroke="#C9893A" strokeWidth="1.2" />
      <circle cx="74" cy="78" r="5" fill="#F6D58E" stroke="#C9893A" strokeWidth="1.2" />
      <circle cx="86" cy="55" r="5" fill="#F6D58E" stroke="#C9893A" strokeWidth="1.2" />
      <path d="M36 76c6-9 17-9 22 0-6 7-15 7-22 0z" fill="#4E7A2B" />
      <path d="M78 44c4-8 14-9 19-2-5 7-13 8-19 2z" fill="#5E8F33" />
      <circle cx="56" cy="62" r="1.5" fill="#4A2545" />
      <circle cx="90" cy="72" r="1.5" fill="#4A2545" />
    </>
  ),
  salade: (
    <>
      <circle cx="60" cy="60" r="57" fill="#FFFFFF" />
      <circle cx="60" cy="60" r="57" fill="none" stroke="#E3DDD0" strokeWidth="2" />
      <path d="M26 58c4-20 22-32 40-28 20 4 30 20 28 36-3 18-22 28-40 25-18-3-31-16-28-33z" fill="#7DB043" />
      <path d="M34 48c10-4 18 2 20 10-10 3-18-2-20-10z" fill="#5E8F2E" />
      <path d="M72 82c6-8 16-6 20 0-6 6-14 6-20 0z" fill="#5E8F2E" />
      <circle cx="50" cy="62" r="3" fill="#6B4A2E" />
      <circle cx="57" cy="70" r="3" fill="#6B4A2E" />
      <circle cx="64" cy="60" r="3" fill="#6B4A2E" />
      <circle cx="46" cy="72" r="3" fill="#6B4A2E" />
      <circle cx="70" cy="70" r="3" fill="#6B4A2E" />
      <circle cx="60" cy="52" r="3" fill="#6B4A2E" />
      <circle cx="54" cy="80" r="3" fill="#6B4A2E" />
      <rect x="72" y="46" width="11" height="11" rx="2" fill="#FFFDF7" stroke="#EADFD3" />
      <rect x="38" y="80" width="10" height="10" rx="2" fill="#FFFDF7" stroke="#EADFD3" />
      <rect x="80" y="62" width="9" height="9" rx="2" fill="#FFFDF7" stroke="#EADFD3" />
      <circle cx="42" cy="44" r="7" fill="#E4572E" />
      <circle cx="42" cy="44" r="3.5" fill="#F28B6B" />
      <circle cx="86" cy="80" r="6" fill="#E4572E" />
      <circle cx="86" cy="80" r="3" fill="#F28B6B" />
    </>
  ),
  soupe: (
    <>
      <circle cx="60" cy="60" r="57" fill="#FFFFFF" />
      <circle cx="60" cy="60" r="57" fill="none" stroke="#E3DDD0" strokeWidth="2" />
      <circle cx="60" cy="60" r="44" fill="#E98A2E" />
      <circle cx="60" cy="60" r="44" fill="none" stroke="#D27420" strokeWidth="3" />
      <path
        d="M44 56c6-10 22-10 28 0 4 8-6 16-14 12"
        stroke="#FFF3E3"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />
      <rect x="74" y="70" width="9" height="9" rx="2" fill="#F0C982" transform="rotate(12 78 74)" />
      <rect x="40" y="72" width="9" height="9" rx="2" fill="#F0C982" transform="rotate(-10 44 76)" />
      <circle cx="66" cy="44" r="2" fill="#3F5A1E" />
      <circle cx="72" cy="48" r="2" fill="#3F5A1E" />
      <circle cx="52" cy="80" r="2" fill="#3F5A1E" />
      <circle cx="80" cy="58" r="2" fill="#3F5A1E" />
    </>
  ),
  pates: (
    <>
      <circle cx="60" cy="60" r="57" fill="#FFFFFF" />
      <circle cx="60" cy="60" r="57" fill="none" stroke="#E3DDD0" strokeWidth="2" />
      <circle cx="60" cy="60" r="40" fill="#F4CF6A" />
      <path
        d="M30 52c10-8 20 8 30 0s20 8 30 0M28 66c10-8 20 8 30 0s20 8 32 0M34 80c8-6 18 6 26 0s18 6 26 0M40 40c8-6 16 6 22 0s16 6 22 0"
        stroke="#E5B54A"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />
      <circle cx="60" cy="60" r="20" fill="#C8382B" />
      <circle cx="54" cy="56" r="4" fill="#A72A20" />
      <circle cx="66" cy="64" r="3" fill="#A72A20" />
      <path d="M62 46c5-6 13-5 15 1-6 4-12 4-15-1z" fill="#3E7A2B" />
      <path d="M48 66c3-6 10-7 13-2-4 5-10 6-13 2z" fill="#3E7A2B" />
      <circle cx="70" cy="56" r="1.8" fill="#FFF6D8" />
      <circle cx="52" cy="62" r="1.8" fill="#FFF6D8" />
      <circle cx="60" cy="70" r="1.8" fill="#FFF6D8" />
    </>
  ),
  gratin: (
    <>
      <circle cx="60" cy="60" r="57" fill="#FFFFFF" />
      <circle cx="60" cy="60" r="57" fill="none" stroke="#E3DDD0" strokeWidth="2" />
      <ellipse cx="60" cy="62" rx="44" ry="34" fill="#C8562B" />
      <ellipse cx="60" cy="60" rx="38" ry="28" fill="#E9A23B" />
      <circle cx="46" cy="54" r="6" fill="#B8672A" />
      <circle cx="66" cy="50" r="5" fill="#B8672A" />
      <circle cx="74" cy="66" r="6" fill="#B8672A" />
      <circle cx="52" cy="70" r="4" fill="#B8672A" />
      <circle cx="60" cy="60" r="3" fill="#F6D58E" />
      <circle cx="80" cy="54" r="3" fill="#F6D58E" />
      <circle cx="40" cy="64" r="3" fill="#F6D58E" />
    </>
  ),
  poisson: (
    <>
      <circle cx="60" cy="60" r="57" fill="#FFFFFF" />
      <circle cx="60" cy="60" r="57" fill="none" stroke="#E3DDD0" strokeWidth="2" />
      <rect x="30" y="44" width="44" height="26" rx="10" fill="#F28B6B" />
      <path
        d="M38 48v18M48 48v18M58 48v18M66 48v18"
        stroke="#FBD0BF"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path d="M34 80l40 6M36 86l38 4M40 76l34 8" stroke="#4E7A2B" strokeWidth="4" strokeLinecap="round" />
      <circle cx="86" cy="54" r="11" fill="#F6E06A" />
      <circle cx="86" cy="54" r="7" fill="#FFF6B8" />
      <path d="M86 47v14M79 54h14" stroke="#F6E06A" strokeWidth="1.5" />
    </>
  ),
  dahl: (
    <>
      <circle cx="60" cy="60" r="57" fill="#FFFFFF" />
      <circle cx="60" cy="60" r="57" fill="none" stroke="#E3DDD0" strokeWidth="2" />
      <circle cx="60" cy="60" r="44" fill="#E07A2E" />
      <circle cx="60" cy="60" r="44" fill="none" stroke="#C4651F" strokeWidth="3" />
      <circle cx="46" cy="50" r="2.4" fill="#F2A15A" />
      <circle cx="70" cy="46" r="2.4" fill="#F2A15A" />
      <circle cx="78" cy="68" r="2.4" fill="#F2A15A" />
      <circle cx="44" cy="74" r="2.4" fill="#F2A15A" />
      <circle cx="60" cy="80" r="2.4" fill="#F2A15A" />
      <path d="M48 62c6-8 18-8 24 0" stroke="#FFF3E3" strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M64 34c4-5 11-4 12 1-5 3-9 3-12-1zM72 38c4-5 11-4 12 1-5 3-9 3-12-1z" fill="#4E7A2B" />
    </>
  ),
  omelette: (
    <>
      <circle cx="60" cy="60" r="57" fill="#FFFFFF" />
      <circle cx="60" cy="60" r="57" fill="none" stroke="#E3DDD0" strokeWidth="2" />
      <path d="M24 64c0-18 16-30 36-30s36 12 36 30z" fill="#F6CE55" />
      <path d="M24 64h72" stroke="#E5B43A" strokeWidth="3" />
      <circle cx="44" cy="52" r="2" fill="#4E7A2B" />
      <circle cx="58" cy="46" r="2" fill="#4E7A2B" />
      <circle cx="72" cy="54" r="2" fill="#4E7A2B" />
      <circle cx="64" cy="58" r="2" fill="#4E7A2B" />
      <path d="M36 76c8-6 18-4 22 4-8 6-18 4-22-4z" fill="#7DB043" />
      <path d="M58 82c8-7 20-5 24 3-9 6-20 4-24-3z" fill="#5E8F2E" />
      <circle cx="84" cy="74" r="5" fill="#E4572E" />
    </>
  ),
  riz: (
    <>
      <circle cx="60" cy="60" r="57" fill="#FFFFFF" />
      <circle cx="60" cy="60" r="57" fill="none" stroke="#E3DDD0" strokeWidth="2" />
      <circle cx="60" cy="60" r="42" fill="#FBF4E2" />
      <g fill="#EADFC6">
        <ellipse cx="44" cy="48" rx="3" ry="1.6" />
        <ellipse cx="56" cy="42" rx="3" ry="1.6" />
        <ellipse cx="70" cy="50" rx="3" ry="1.6" />
        <ellipse cx="48" cy="66" rx="3" ry="1.6" />
        <ellipse cx="72" cy="72" rx="3" ry="1.6" />
        <ellipse cx="60" cy="78" rx="3" ry="1.6" />
      </g>
      <g fill="#6FAE3A">
        <circle cx="52" cy="54" r="3.4" />
        <circle cx="66" cy="62" r="3.4" />
        <circle cx="42" cy="58" r="3.4" />
        <circle cx="76" cy="58" r="3.4" />
      </g>
      <g fill="#EE8A2E">
        <rect x="58" y="48" width="6" height="6" rx="1.5" />
        <rect x="46" y="72" width="6" height="6" rx="1.5" />
        <rect x="64" y="70" width="6" height="6" rx="1.5" />
      </g>
      <circle cx="60" cy="62" r="6" fill="#F6CE55" />
    </>
  ),
  tarte: (
    <>
      <circle cx="60" cy="60" r="57" fill="#FFFFFF" />
      <circle cx="60" cy="60" r="57" fill="none" stroke="#E3DDD0" strokeWidth="2" />
      <circle cx="60" cy="60" r="44" fill="#D9963F" />
      <circle cx="60" cy="60" r="36" fill="#F3DFA4" />
      <g fill="none" stroke="#7DB043" strokeWidth="3">
        <circle cx="46" cy="50" r="6" />
        <circle cx="66" cy="46" r="6" />
        <circle cx="74" cy="66" r="6" />
        <circle cx="50" cy="72" r="6" />
        <circle cx="60" cy="60" r="5" />
      </g>
      <path d="M60 24v72M24 60h72" stroke="#C47F2E" strokeWidth="1.5" opacity="0.5" />
    </>
  ),
  lasagnes: (
    <>
      <circle cx="60" cy="60" r="57" fill="#FFFFFF" />
      <circle cx="60" cy="60" r="57" fill="none" stroke="#E3DDD0" strokeWidth="2" />
      <rect x="28" y="36" width="64" height="48" rx="8" fill="#C8382B" />
      <rect x="28" y="36" width="64" height="12" rx="6" fill="#F4CF6A" />
      <rect x="28" y="54" width="64" height="7" fill="#F8E2A0" />
      <rect x="28" y="68" width="64" height="7" fill="#F8E2A0" />
      <circle cx="42" cy="42" r="3" fill="#E9A23B" />
      <circle cx="62" cy="40" r="3" fill="#E9A23B" />
      <circle cx="80" cy="43" r="3" fill="#E9A23B" />
      <path d="M70 28c4-6 12-5 14 1-6 4-11 4-14-1z" fill="#3E7A2B" />
    </>
  ),
  soupeverte: (
    <>
      <circle cx="60" cy="60" r="57" fill="#FFFFFF" />
      <circle cx="60" cy="60" r="57" fill="none" stroke="#E3DDD0" strokeWidth="2" />
      <circle cx="60" cy="60" r="44" fill="#9CBF5A" />
      <circle cx="60" cy="60" r="44" fill="none" stroke="#7FA343" strokeWidth="3" />
      <path
        d="M44 58c6-10 22-10 28 0 4 8-6 16-14 12"
        stroke="#F4F7E8"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />
      <rect x="72" y="70" width="9" height="9" rx="2" fill="#E8C88A" transform="rotate(12 76 74)" />
      <rect x="38" y="72" width="9" height="9" rx="2" fill="#E8C88A" transform="rotate(-10 42 76)" />
      <rect x="64" y="38" width="8" height="8" rx="2" fill="#E8C88A" />
    </>
  ),
};
