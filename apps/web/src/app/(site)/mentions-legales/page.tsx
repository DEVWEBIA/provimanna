import type { Metadata } from 'next';
import Link from 'next/link';
import { LegalPage } from '@/components/site/legal-page';
import { href, ROUTES } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Mentions légales',
  alternates: { canonical: ROUTES.mentionsLegales },
};

export default function MentionsLegalesPage() {
  return (
    <LegalPage path={ROUTES.mentionsLegales} title="Mentions légales">
      <h2>Éditeur du site</h2>
      <p>
        [Raison sociale ou nom], [forme juridique], immatriculée sous le numéro SIRET [numéro], dont le siège
        est situé [adresse]. Contact : [email].
      </p>
      <h2>Directeur de la publication</h2>
      <p>[Prénom Nom]</p>
      <h2>Hébergement</h2>
      <p>
        Site et application hébergés par [hébergeur web], [adresse]. Données stockées par [fournisseur de base
        de données], dans l’Union européenne.
      </p>
      <h2>Prix affichés</h2>
      <p>
        Les prix affichés sont indicatifs. Ils proviennent de relevés publics et de tickets envoyés par les
        utilisateurs, et peuvent différer des prix pratiqués en magasin. Les noms d’enseignes sont cités à
        titre de comparaison, sans affiliation.
      </p>
      <h2>Propriété intellectuelle</h2>
      <p>
        Les textes, illustrations et recettes du site sont la propriété de [éditeur], sauf mention contraire.
        Les données de prix agrégées sont réutilisables selon les conditions décrites dans la{' '}
        <Link href={href(ROUTES.methodologie)} className="text-brand underline underline-offset-2">
          méthodologie
        </Link>
        .
      </p>
      <h2>Signaler un contenu</h2>
      <p>Pour signaler un prix erroné ou un contenu illicite : [email de contact].</p>
    </LegalPage>
  );
}
