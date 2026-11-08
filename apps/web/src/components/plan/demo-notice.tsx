import { Notice } from '@repas/ui';

/** Transparence : les prix du catalogue de départ sont fictifs tant que les relevés réels n'arrivent pas. */
export function DemoNotice() {
  return (
    <Notice tone="warning" title="Prix de démonstration.">
      Une partie des prix affichés sert d’exemple, en attendant les relevés Open Prices et les tickets de la
      communauté.
    </Notice>
  );
}
