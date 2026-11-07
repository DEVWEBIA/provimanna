import { z } from 'zod';

export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .pipe(z.email({ error: 'Vérifie l’adresse : il manque le @ ou le domaine.' }));

export const requestLinkSchema = z
  .object({
    email: emailSchema,
    mode: z.enum(['connexion', 'inscription']).default('connexion'),
    cgu: z.literal('on').optional(),
    suite: z.string().optional(),
  })
  .refine((v) => v.mode === 'connexion' || v.cgu === 'on', {
    path: ['cgu'],
    error: 'Coche la case pour accepter les conditions d’utilisation.',
  });

export const verifyCodeSchema = z.object({
  email: emailSchema,
  code: z
    .string()
    .transform((s) => s.replace(/\s/g, ''))
    .pipe(z.string().regex(/^\d{6}$/, { error: 'Le code fait 6 chiffres.' })),
  suite: z.string().optional(),
});

export const providerSchema = z.enum(['google', 'apple']);
