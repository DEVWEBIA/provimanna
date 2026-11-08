'use client';

import { useTransition } from 'react';
import { Button } from '@repas/ui';
import { toggleChallenge } from './actions';

export function ChallengeToggle({ id, active }: { id: string; active: boolean }) {
  const [pending, start] = useTransition();
  return (
    <Button
      variant={active ? 'neutral' : 'secondary'}
      size="sm"
      disabled={pending}
      onClick={() => start(() => toggleChallenge(id, !active))}
    >
      {active ? 'Suspendre' : 'Activer'}
    </Button>
  );
}
