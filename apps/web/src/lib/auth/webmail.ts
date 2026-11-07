/** Lien vers la messagerie web selon le domaine de l'adresse (« Ouvrir ma messagerie »). */
const WEBMAILS: [RegExp, string][] = [
  [/^(gmail|googlemail)\.com$/, 'https://mail.google.com/'],
  [/^(outlook|hotmail|live|msn)\.(com|fr)$/, 'https://outlook.live.com/mail/'],
  [/^yahoo\.(com|fr)$/, 'https://mail.yahoo.com/'],
  [/^(orange|wanadoo)\.fr$/, 'https://messagerie.orange.fr/'],
  [/^free\.fr$/, 'https://webmail.free.fr/'],
  [/^(sfr|neuf)\.fr$/, 'https://webmail.sfr.fr/'],
  [/^laposte\.net$/, 'https://www.laposte.net/accueil'],
  [/^(icloud|me|mac)\.com$/, 'https://www.icloud.com/mail'],
  [/^proton(mail)?\.(me|com)$/, 'https://mail.proton.me/'],
];

export function webmailUrl(email: string): string | null {
  const domain = email.split('@')[1]?.toLowerCase() ?? '';
  return WEBMAILS.find(([re]) => re.test(domain))?.[1] ?? null;
}
