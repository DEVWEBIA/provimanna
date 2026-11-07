import type { ReactNode } from 'react';
import {
  Badge,
  Button,
  EmptyState,
  Field,
  Icon,
  ICON_NAMES,
  Notice,
  Plat,
  PLAT_LABELS,
  PLAT_VARIANTS,
  Price,
  Reliability,
  SavingBadge,
  Skeleton,
  StoreChip,
  TabBar,
  TicketCard,
  Toast,
  ToastAction,
} from '@repas/ui';
import type { StoreId } from '@repas/core';
import { AppLink } from '@/components/app-link';

// Données de démo cohérentes avec supabase/seed.sql.
const STORES: {
  id: StoreId;
  name: string;
  initials: string;
  cents: number;
  level: 'high' | 'medium' | 'low';
}[] = [
  { id: 'lidl', name: 'Lidl', initials: 'LI', cents: 6010, level: 'high' },
  { id: 'aldi', name: 'Aldi', initials: 'AL', cents: 6140, level: 'high' },
  { id: 'leclerc', name: 'E.Leclerc', initials: 'EL', cents: 6420, level: 'high' },
  { id: 'intermarche', name: 'Intermarché', initials: 'IN', cents: 6890, level: 'low' },
  { id: 'carrefour', name: 'Carrefour', initials: 'CA', cents: 7030, level: 'medium' },
  { id: 'auchan', name: 'Auchan', initials: 'AU', cents: 7160, level: 'medium' },
];

function Section({ title, caption, children }: { title: string; caption: string; children: ReactNode }) {
  return (
    <section className="border-line bg-surface-0 rounded-[26px] border p-7">
      <h2 className="font-display mb-1 text-[28px] font-extrabold tracking-[-0.6px]">{title}</h2>
      <p className="text-ink-muted mb-5 text-[15px]">{caption}</p>
      {children}
    </section>
  );
}

const Lab = ({ children }: { children: ReactNode }) => (
  <span className="text-ink-muted mb-2 block text-[12px] font-black tracking-[0.8px]">{children}</span>
);

export function Gallery({ theme }: { theme: 'light' | 'dark' }) {
  const p = theme; // préfixe des id pour qu'ils restent uniques entre les deux thèmes
  return (
    <div className="flex flex-col gap-6">
      <Section
        title="Typographie"
        caption="Bricolage Grotesque pour les titres du site et les grands chiffres, Nunito pour l'interface."
      >
        <div className="flex flex-col gap-3.5">
          <span className="font-display text-[72px] font-extrabold leading-none tracking-[-2.5px]">
            Six prix.
          </span>
          <span className="font-display text-[48px] font-extrabold leading-none tracking-[-1.4px]">
            Ma liste de courses
          </span>
          <Price cents={7160} size="xl" />
          <span className="text-[22px] font-black">Tu compares, tu choisis</span>
          <span className="max-w-[640px] text-[17px] leading-[26px]">
            On planifie tes repas de la semaine et on te montre ce que coûte ta liste dans six enseignes.
          </span>
          <span className="text-ink-muted text-[13px] font-black tracking-[1.2px]">
            SEMAINE 47 · 4 PERSONNES
          </span>
        </div>
      </Section>

      <Section title="Boutons et filtres" caption="Un seul bouton plein par écran. Hauteur minimale 44 px.">
        <Lab>BOUTONS</Lab>
        <div className="flex flex-wrap items-center gap-3">
          <Button>Principal</Button>
          <Button variant="secondary">Secondaire</Button>
          <Button variant="neutral">Neutre</Button>
          <Button variant="saving">Économie</Button>
          <Button variant="link">Lien</Button>
          <Button variant="danger">Danger (BO)</Button>
          <Button disabled>Désactivé</Button>
        </div>
      </Section>

      <Section title="Champs et contrôles" caption="Toujours un libellé visible. L'erreur dit quoi corriger.">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-5">
          <Field id={`${p}-c1`} label="Champ" placeholder="ton@email.fr" type="email" />
          <Field
            id={`${p}-c2`}
            label="Champ en erreur"
            defaultValue="marion@"
            error="Il manque le domaine après le @."
          />
        </div>
      </Section>

      <Section
        title="Badges, pastilles et fiabilité"
        caption="Enseignes : jamais de logo ni de couleur officielle, deux lettres sur fond pastel et le nom en clair."
      >
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="cheapest">Le moins cher</Badge>
          <Badge variant="mine">Ton enseigne</Badge>
          <Badge variant="premium">PREMIUM</Badge>
          <Badge variant="success">Validé</Badge>
          <Badge variant="draft">Brouillon</Badge>
          <Badge variant="rejected">Rejeté</Badge>
          <Reliability level="high" showLabel />
          <Reliability level="medium" showLabel />
          <Reliability level="low" showLabel />
          <SavingBadge cents={1150} />
        </div>
        <div className="mt-[18px] flex flex-wrap items-center gap-3">
          {STORES.map((s) => (
            <StoreChip key={s.id} storeId={s.id} name={s.name} initials={s.initials} />
          ))}
        </div>
        <Lab>
          <span className="mt-6 block">COMPARATIF (DONNÉES DU SEED)</span>
        </Lab>
        <ul className="divide-line flex max-w-md flex-col divide-y">
          {STORES.map((s) => (
            <li key={s.id} className="min-h-tap flex items-center justify-between gap-3 py-2">
              <StoreChip storeId={s.id} name={s.name} initials={s.initials} size="sm" />
              <span className="flex items-center gap-3">
                <Price cents={s.cents} estimate={s.level === 'low'} />
                <Reliability level={s.level} />
              </span>
            </li>
          ))}
        </ul>
        <p className="text-ink-muted mt-2 text-[13px] font-bold">
          Prix relevés le 06/11 · ● relevé de moins de 7 jours · ○ estimation
        </p>
      </Section>

      <Section
        title="Cartes"
        caption="Rayon 18 à 30 px, bordure fine plutôt qu'ombre. Le ticket dentelé est la signature de marque."
      >
        <div className="bg-surface-50 grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] items-start gap-4 rounded-[20px] p-4">
          <div className="border-line bg-surface-0 flex items-center gap-3 rounded-[20px] border-2 p-3">
            <Plat variant="dahl" size={72} decorative />
            <span>
              <span className="text-ink-muted block text-[12px] font-black">SOIR</span>
              <span className="block font-black">Dahl de lentilles</span>
              <Price cents={88} size="sm" suffix="/ part" className="text-saving-ink" />
            </span>
          </div>
          <div className="border-line bg-surface-0 rounded-[16px] border p-4">
            <p className="text-ink-muted text-[12px] font-black tracking-[0.8px]">ACTIFS HEBDO</p>
            <p className="font-display mt-1.5 text-[30px] font-extrabold tabular-nums">1 912</p>
            <p className="text-success mt-0.5 text-[13px] font-extrabold">+6,8 % vs S45</p>
          </div>
          <TicketCard edge="surface-50">
            <p className="text-ink-muted text-[12px] font-black tracking-[1px]">TICKET</p>
            <Price cents={6010} size="lg" className="mt-1 block" />
          </TicketCard>
          <div className="bg-brand text-brand-on rounded-lg p-5">
            <p className="text-brand-soft text-[12px] font-black">CARTE MISE EN AVANT</p>
            <p className="font-display mt-1.5 text-[24px] font-extrabold">Ton menu est prêt</p>
          </div>
        </div>
      </Section>

      <Section title="Retours et états" caption="Messages positifs et utiles, jamais culpabilisants.">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-3.5">
          <Toast action={<ToastAction>Annuler</ToastAction>}>Pâtes à la tomate ajoutées mardi soir</Toast>
          <Notice tone="warning" title="Prix incomplets">
            chez Intermarché : total estimé.
          </Notice>
          <Notice tone="error" title="Le plan n'a pas pu être généré.">
            Réessaie dans un instant.
          </Notice>
          <div className="flex flex-col gap-2">
            <Skeleton className="h-[18px] w-3/5" />
            <Skeleton className="h-[46px]" />
            <Skeleton className="h-[46px]" />
          </div>
        </div>
        <EmptyState
          className="mt-5"
          overline="Semaine 48 · 23 – 29 nov."
          title="Ta semaine n'est pas encore planifiée."
          description="On compose 14 repas de saison pour ton foyer en quelques secondes. Tu pourras tout remplacer ensuite."
          illustration={<Plat variant="soupe" size={96} decorative />}
          actions={
            <>
              <Button>Générer mon plan</Button>
              <Button variant="link">Choisir mes recettes moi-même</Button>
            </>
          }
        />
      </Section>

      <Section
        title="Illustrations de plats"
        caption="Vue de dessus, sur assiette blanche. Composant Plat : 12 variantes."
      >
        <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-4">
          {PLAT_VARIANTS.map((v) => (
            <div
              key={v}
              className="bg-surface-50 flex flex-col items-center gap-2 rounded-[20px] px-2 py-3.5"
            >
              <Plat variant={v} size={110} decorative />
              <span className="text-center text-[13px] font-extrabold">{PLAT_LABELS[v]}</span>
              <span className="text-ink-muted text-[11px] font-extrabold">{v}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Icônes" caption="Trait de 2 px, coins arrondis, jamais d'emoji.">
        <div className="text-brand flex flex-wrap gap-[18px]">
          {ICON_NAMES.map((n) => (
            <Icon key={n} name={n} size={28} label={n} />
          ))}
        </div>
      </Section>

      <Section
        title="Barre d'onglets mobile"
        caption="5 entrées, cible ≥ 44 px, onglet actif signalé par aria-current."
      >
        <div className="border-line max-w-[390px] overflow-hidden rounded-[20px] border">
          <TabBar active="accueil" Link={AppLink} />
        </div>
      </Section>
    </div>
  );
}
