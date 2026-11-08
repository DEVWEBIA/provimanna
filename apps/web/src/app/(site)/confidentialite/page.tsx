import type { Metadata } from 'next';
import { LegalPage } from '@/components/site/legal-page';
import { ROUTES } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Politique de confidentialité',
  alternates: { canonical: ROUTES.confidentialite },
};

export default function ConfidentialitePage() {
  return (
    <LegalPage path={ROUTES.confidentialite} title="Confidentialité">
      <h2>Responsable du traitement</h2>
      <p>[Raison sociale], [adresse], [email du contact données personnelles].</p>
      <h2>Données collectées</h2>
      <ul>
        <li>Compte : adresse email, prénom affiché.</li>
        <li>
          Foyer : nombre d’adultes et d’enfants, régime et aliments à éviter, temps de cuisine, enseigne
          habituelle, code postal.
        </li>
        <li>
          Usage : plans de repas, listes de courses, tickets de caisse envoyés (photos supprimées après
          lecture).
        </li>
        <li>
          Paiement : géré par [prestataire de paiement] ; aucune donnée de carte n’est stockée par nos soins.
        </li>
      </ul>
      <h2>Finalités et bases légales</h2>
      <p>
        Fournir le service (exécution du contrat), calculer les prix près de chez toi, améliorer le service
        avec des mesures d’audience (consentement), envoyer les emails liés au compte.
      </p>
      <h2>Durées de conservation</h2>
      <p>
        [À préciser] : données du compte jusqu’à sa suppression, puis [durée] pour les obligations légales.
      </p>
      <h2>Destinataires et hébergement</h2>
      <p>Données hébergées dans l’Union européenne par [hébergeurs]. Elles ne sont jamais revendues.</p>
      <h2>Tes droits</h2>
      <p>
        Accès, rectification, effacement, portabilité, opposition et limitation : écris à [email]. Tu peux
        aussi saisir la CNIL (cnil.fr).
      </p>
      <h2>Cookies</h2>
      <p>
        Cookies nécessaires à la connexion uniquement. Les mesures d’audience ne sont activées qu’avec ton
        accord.
      </p>
    </LegalPage>
  );
}
