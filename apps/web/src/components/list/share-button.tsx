'use client';

import { useState } from 'react';
import { Button, Toast } from '@repas/ui';

/** Partage de la liste par lien (lecture seule) : feuille de partage du téléphone, sinon copie du lien. */
export function ShareButton({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const share = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // Partage annulé par l'utilisateur : rien à faire.
    }
  };
  return (
    <>
      <Button variant="neutral" onClick={() => void share()} className="bg-white/80">
        Partager
      </Button>
      {copied ? (
        <div className="fixed inset-x-4 bottom-28 z-30 mx-auto max-w-[520px] lg:bottom-8" role="status">
          <Toast>Lien de la liste copié. Il s’ouvre sans compte, en lecture seule.</Toast>
        </div>
      ) : null}
    </>
  );
}
