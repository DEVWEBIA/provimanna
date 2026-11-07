// Lecture de la boîte mail locale (Mailpit, lancé par `supabase start`).
const MAILPIT = process.env.MAILPIT_URL ?? 'http://127.0.0.1:55324';

interface Summary {
  ID: string;
  To: { Address: string }[];
  Created: string;
}

/** Attend le dernier email reçu par `to` et renvoie son texte. */
export async function waitForEmail(to: string, timeoutMs = 20_000): Promise<{ text: string; html: string }> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const res = await fetch(`${MAILPIT}/api/v1/search?query=${encodeURIComponent(`to:${to}`)}`);
    const { messages } = (await res.json()) as { messages: Summary[] };
    const last = messages[0];
    if (last) {
      const msg = (await (await fetch(`${MAILPIT}/api/v1/message/${last.ID}`)).json()) as {
        Text: string;
        HTML: string;
      };
      return { text: msg.Text, html: msg.HTML };
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`Aucun email reçu pour ${to}`);
}

export const extractLink = (html: string) => {
  const m = html.match(/href="([^"]+)"/);
  if (!m?.[1]) throw new Error('Lien introuvable dans l’email');
  return m[1].replace(/&amp;/g, '&');
};

export const extractCode = (text: string) => {
  const m = text.match(/\b(\d{6})\b/);
  if (!m?.[1]) throw new Error('Code introuvable dans l’email');
  return m[1];
};
