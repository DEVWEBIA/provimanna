import { getTranslations } from 'next-intl/server';
import {
  APP_NAME,
  GlassCard,
  Glow,
  Icon,
  IconTile,
  Logo,
  PageHeader,
  Reveal,
  type IconName,
} from '@repas/ui';

const NEXT: { icon: IconName; title: string; text: string }[] = [
  { icon: 'panier', title: 'Prix', text: 'Relevés, aberrants, fiabilité par enseigne.' },
  { icon: 'boite', title: 'Tickets', text: 'File de modération des tickets scannés.' },
  { icon: 'plan', title: 'Recettes', text: 'Catalogue, coût en direct, saisons.' },
];

// Page d'attente : la vue d'ensemble (maquette BOVue) arrive au lot 9.
export default async function AdminHomePage() {
  const t = await getTranslations('home');
  return (
    <div className="relative isolate min-h-screen overflow-x-clip">
      <Glow className="bg-raw-aubergine-clair -left-24 top-20 h-96 w-96" />
      <Glow className="bg-raw-peche right-0 top-1/2 h-80 w-80 opacity-70" />
      <main className="mx-auto flex min-h-screen max-w-[1080px] flex-col gap-12 px-6 py-10">
        <div className="anim-rise">
          <Logo />
        </div>
        <PageHeader eyebrow={`${APP_NAME} · staff`} title={t('title')} lead={t('lead')} />
        <ul className="grid gap-5 md:grid-cols-3">
          {NEXT.map((n, i) => (
            <Reveal as="li" key={n.title} delay={300 + i * 120}>
              <GlassCard className="h-full p-7">
                <IconTile>
                  <Icon name={n.icon} size={22} />
                </IconTile>
                <h2 className="mt-5 text-[19px] font-black">{n.title}</h2>
                <p className="text-ink-muted mt-1.5 text-[15px]">{n.text}</p>
              </GlassCard>
            </Reveal>
          ))}
        </ul>
      </main>
    </div>
  );
}
