import type { Metadata } from 'next';
import { LegalPage } from '@/components/site/legal-page';

export const metadata: Metadata = { title: 'Conditions d’utilisation', alternates: { canonical: '/cgu' } };

export default function CguPage() {
  return (
    <LegalPage path="/cgu" title="Conditions d’utilisation">
      <h2>Objet</h2>
      <p>
        Ces conditions encadrent l’utilisation de [Nom de l’appli], service de planification de repas et de
        comparaison du coût d’une liste de courses dans plusieurs enseignes.
      </p>
      <h2>Compte</h2>
      <p>
        La connexion se fait sans mot de passe, par lien ou code envoyé par email. Tu es responsable de
        l’accès à ta boîte mail.
      </p>
      <h2>Formules</h2>
      <p>
        Une formule gratuite sans limite de durée et une formule Premium (4,99 € par mois ou 39,99 € par an),
        avec un essai de 14 jours sans carte bancaire. À la fin de l’essai, le compte repasse en gratuit sans
        perte de données.
      </p>
      <h2>Prix affichés</h2>
      <p>
        Les prix sont des repères calculés à partir de relevés publics et de tickets de la communauté. Ils
        peuvent différer des prix en magasin ; aucune garantie de prix n’est donnée.
      </p>
      <h2>Contributions</h2>
      <p>
        En envoyant un ticket de caisse, tu autorises l’extraction des prix qu’il contient pour enrichir la
        base commune.
      </p>
      <h2>Résiliation</h2>
      <p>
        Tu peux supprimer ton compte à tout moment depuis ton profil. [Conditions détaillées à compléter.]
      </p>
      <h2>Droit applicable</h2>
      <p>Droit français. [Clause de médiation de la consommation à compléter.]</p>
    </LegalPage>
  );
}
