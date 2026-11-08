'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import type { StoreId } from '@repas/core';
import { chooseStoreAction } from '@/app/app/(main)/liste/actions';

/** Valide la semaine dans une enseigne puis ouvre la liste de courses. */
export function useChooseStore(planId: string) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const choose = (store: StoreId) => {
    setMessage(null);
    start(async () => {
      const res = await chooseStoreAction(planId, store);
      if (res.ok) router.push('/app/liste');
      else setMessage(res.error);
    });
  };
  return { choose, pending, message, clear: () => setMessage(null) };
}
