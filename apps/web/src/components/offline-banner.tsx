'use client';

import { useSyncExternalStore } from 'react';

const subscribe = (cb: () => void) => {
  window.addEventListener('online', cb);
  window.addEventListener('offline', cb);
  return () => {
    window.removeEventListener('online', cb);
    window.removeEventListener('offline', cb);
  };
};

/** Bandeau hors ligne (maquette AppEtats). */
export function OfflineBanner() {
  const online = useSyncExternalStore(
    subscribe,
    () => navigator.onLine,
    () => true,
  );
  if (online) return null;
  return (
    <p
      role="status"
      className="bg-raw-encre sticky top-0 z-40 -mx-5 px-5 py-3 text-[14px] font-bold text-white lg:-mx-12 lg:px-12"
    >
      Tu es hors ligne. Tes cases cochées seront synchronisées au retour du réseau.
    </p>
  );
}
