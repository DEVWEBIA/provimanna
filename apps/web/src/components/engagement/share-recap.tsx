'use client';

import { useState } from 'react';
import { Toast } from '@repas/ui';

/** « Partager mon récap » : feuille de partage du téléphone, sinon copie du texte. */
export function ShareRecap({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const share = async () => {
    try {
      if (navigator.share) return void (await navigator.share({ text }));
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // Partage annulé.
    }
  };
  return (
    <>
      <button
        type="button"
        onClick={() => void share()}
        className="rounded-pill text-brand min-h-14 bg-white px-7 text-[17px] font-black transition-transform hover:-translate-y-0.5 motion-reduce:transition-none"
      >
        Partager mon récap
      </button>
      {copied ? (
        <div className="fixed inset-x-4 bottom-28 z-30 mx-auto max-w-[480px] lg:bottom-8" role="status">
          <Toast>Récap copié, prêt à être collé.</Toast>
        </div>
      ) : null}
    </>
  );
}
