import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Connexion' };

// Page d'attente : la connexion staff (lien magique + contrôle has_role) arrive au lot 9.
export default function AdminConnexionPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-3 px-4">
      <h1 className="font-display text-title text-ink">Connexion à l’espace staff</h1>
      <p className="text-body text-ink-muted">La connexion du back-office sera disponible au lot 9.</p>
    </main>
  );
}
