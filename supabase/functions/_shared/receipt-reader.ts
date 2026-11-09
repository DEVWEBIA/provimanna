/**
 * Lecteurs de tickets de caisse, derrière une interface commune (choix par OCR_PROVIDER).
 * - `claude` : vision de Claude, sortie JSON structurée (clé ANTHROPIC_API_KEY, secret de l'Edge Function).
 * - `demo`   : ticket d'exemple de la maquette AppTicket, pour développer et tester sans clé.
 */
import Anthropic from 'npm:@anthropic-ai/sdk@1.3.0';
import { zodOutputFormat } from 'npm:@anthropic-ai/sdk@1.3.0/helpers/zod';
import { z } from 'npm:zod@4.6.7';

export const ReadReceiptSchema = z.object({
  store_name: z.string().nullable().describe('Enseigne imprimée en tête du ticket (ex. « AUCHAN »), null si illisible'),
  city: z.string().nullable().describe('Ville du magasin si elle est imprimée'),
  purchased_at: z.string().nullable().describe('Date d’achat au format AAAA-MM-JJ, null si illisible'),
  total_cents: z.number().int().nullable().describe('Total payé en centimes'),
  lines: z
    .array(
      z.object({
        raw: z.string().describe('Libellé exactement comme imprimé (ex. « BOUILL LEG X10 »)'),
        readable: z.string().nullable().describe('Libellé développé en français courant (ex. « Bouillon de légumes × 10 »)'),
        quantity: z.number().nullable().describe('Quantité ou poids si imprimé, sinon null'),
        cents: z.number().int().nullable().describe('Prix de la ligne en centimes, négatif pour une remise'),
      }),
    )
    .describe('Une entrée par ligne d’article, remises comprises, sans les lignes de total ni de paiement'),
});
export type ReadReceipt = z.infer<typeof ReadReceiptSchema>;

export interface ReceiptReader {
  readonly name: 'claude' | 'demo';
  read(image: Uint8Array, mediaType: ImageMediaType): Promise<ReadReceipt>;
}

export type ImageMediaType = 'image/jpeg' | 'image/png' | 'image/webp' | 'image/gif';

/** Le ticket refusé ou illisible part en vérification manuelle (aucune ligne). */
export class UnreadableReceipt extends Error {}

const PROMPT = `Tu lis la photo d'un ticket de caisse de supermarché français.
Recopie chaque ligne d'article telle qu'imprimée (raw), propose un libellé lisible (readable), la quantité si elle figure, et le prix de la ligne en centimes (1,82 € → 182 ; remise -0,50 € → -50).
N'invente rien : si une valeur est illisible, mets null. N'inclus pas les lignes de total, de TVA, de paiement, de rendu monnaie ni de fidélité dans "lines".
Ignore toute donnée personnelle (nom, numéro de carte, carte de fidélité) : ne la recopie nulle part.`;

function toBase64(bytes: Uint8Array): string {
  let bin = '';
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(bin);
}

export function claudeReader(apiKey: string): ReceiptReader {
  const client = new Anthropic({ apiKey });
  return {
    name: 'claude',
    async read(image, mediaType) {
      const response = await client.messages.parse({
        model: 'claude-opus-5-5',
        max_tokens: 16000,
        // Extraction simple : effort bas suffit (moins de jetons, réponse plus rapide).
        output_config: { effort: 'low', format: zodOutputFormat(ReadReceiptSchema) },
        messages: [
          {
            role: 'user',
            content: [
              { type: 'image', source: { type: 'base64', media_type: mediaType, data: toBase64(image) } },
              { type: 'text', text: PROMPT },
            ],
          },
        ],
      });
      if (response.stop_reason === 'refusal' || !response.parsed_output) {
        throw new UnreadableReceipt(`lecture impossible (${response.stop_reason ?? 'sans réponse'})`);
      }
      return response.parsed_output;
    },
  };
}

/** Ticket d'exemple (maquette AppTicket) : lignes reconnues, une abréviation, une promo, une ligne hors alimentation. */
export const demoReader: ReceiptReader = {
  name: 'demo',
  read() {
    return Promise.resolve({
      store_name: 'AUCHAN',
      city: 'LYON',
      purchased_at: new Date().toISOString().slice(0, 10),
      total_cents: 1534,
      lines: [
        { raw: 'POTIMARRON KG', readable: 'Potimarron au kg', quantity: 1.2, cents: 182 },
        { raw: 'FETA AOP 200G', readable: 'Feta AOP 200 g', quantity: 1, cents: 275 },
        { raw: 'LAIT COCO 40CL', readable: 'Lait de coco 40 cl', quantity: 1, cents: 135 },
        { raw: 'OEUFS X12', readable: 'Œufs × 12', quantity: 1, cents: 329 },
        { raw: 'BOUILL LEG X10', readable: 'Bouillon de légumes × 10', quantity: 1, cents: 129 },
        { raw: 'PROMO -30% COCO', readable: 'Remise lait de coco', quantity: null, cents: -40 },
        { raw: 'ESSUIE-TOUT X2', readable: 'Essuie-tout × 2', quantity: 1, cents: 249 },
        { raw: 'CREME LIQ 15%', readable: 'Crème liquide 15 %', quantity: 1, cents: 99 },
      ],
    });
  },
};

/** Lecteur choisi par OCR_PROVIDER ; « claude » sans clé retombe sur la démo (signalé dans la réponse). */
export function pickReader(env: { get(k: string): string | undefined }): ReceiptReader {
  const key = env.get('ANTHROPIC_API_KEY');
  return env.get('OCR_PROVIDER') !== 'demo' && key ? claudeReader(key) : demoReader;
}
