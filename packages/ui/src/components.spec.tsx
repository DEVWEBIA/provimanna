import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import {
  AccentTitle,
  AppShell,
  Button,
  Field,
  Plat,
  PLAT_VARIANTS,
  Price,
  Reliability,
  SavingBadge,
  StoreChip,
  TabBar,
  TicketCard,
} from './index.ts';

const html = (el: React.ReactElement) => renderToStaticMarkup(el);

describe('Price', () => {
  it('formate en euros, chiffres tabulaires', () => {
    const out = html(<Price cents={6010} />);
    expect(out).toContain('60,10 €');
    expect(out).toContain('tabular-nums');
    expect(out).not.toContain('≈');
  });
  it('préfixe les estimations par ≈', () => {
    expect(html(<Price cents={6890} estimate />)).toMatch(/≈ .*68,90/);
  });
  it('affiche « prix inconnu » sans montant', () => {
    expect(html(<Price cents={null} />)).toContain('prix inconnu');
  });
});

describe('Reliability', () => {
  it.each([
    ['high', '●●●', 'élevée'],
    ['medium', '●●○', 'moyenne'],
    ['low', '●○○', 'estimation'],
  ] as const)('%s → %s avec libellé accessible', (level, dots, label) => {
    const out = html(<Reliability level={level} />);
    expect(out).toContain(dots);
    expect(out).toContain(`Fiabilité ${label}`);
  });
});

describe('Orange réservé aux économies, toujours avec texte foncé', () => {
  it('SavingBadge et bouton saving n’utilisent jamais de texte blanc', () => {
    for (const out of [
      html(<SavingBadge cents={1150} />),
      html(<Button variant="saving">Économie</Button>),
    ]) {
      expect(out).toContain('bg-saving');
      expect(out).toContain('text-raw-encre');
      expect(out).not.toMatch(/text-white|text-brand-on/);
    }
    expect(html(<SavingBadge cents={1150} />)).toContain('− 11,50 €');
  });
});

describe('StoreChip', () => {
  it('deux lettres sur pastel + nom en clair, sans image', () => {
    const out = html(<StoreChip storeId="leclerc" name="E.Leclerc" initials="EL" />);
    expect(out).toContain('EL');
    expect(out).toContain('E.Leclerc');
    expect(out).toContain('bg-chip-3');
    expect(out).not.toMatch(/<img|<svg/);
  });
});

describe('Plat', () => {
  it('rend les 12 variantes avec un libellé accessible', () => {
    expect(PLAT_VARIANTS).toHaveLength(12);
    for (const v of PLAT_VARIANTS) {
      const out = html(<Plat variant={v} size={64} />);
      expect(out).toMatch(/role="img" aria-label="[^"]+"/);
      expect(out).toContain('width="64"');
    }
  });
  it('peut être décoratif', () => {
    expect(html(<Plat variant="soupe" decorative />)).toContain('aria-hidden="true"');
  });
});

describe('Navigation', () => {
  it('TabBar : 5 onglets, l’actif porte aria-current', () => {
    const out = html(<TabBar active="liste" />);
    expect(out.match(/<a /g)).toHaveLength(5);
    expect(out).toMatch(/<a href="\/app\/liste"[^>]*aria-current="page"/);
    expect(out.match(/aria-current="page"/g)).toHaveLength(1);
  });
  it('AppShell : 8 entrées desktop + badge de notifications', () => {
    const out = html(
      <AppShell active="accueil" unreadNotifications={3} trial={{ daysLeft: 9, elapsed: 0.36 }}>
        contenu
      </AppShell>,
    );
    const desktopNav = out.split('aria-label="Web app"')[1]?.split('</nav>')[0] ?? '';
    expect(desktopNav.match(/<a /g)).toHaveLength(8);
    expect(out).toContain('Mes économies');
    expect(out).toContain('9 jours restants');
  });
});

describe('Accessibilité des contrôles', () => {
  it('Field relie le libellé, l’erreur et aria-invalid', () => {
    const out = html(<Field id="email" label="Email" error="Il manque le domaine après le @." />);
    expect(out).toContain('for="email"');
    expect(out).toContain('aria-invalid="true"');
    expect(out).toContain('aria-describedby="email-err"');
  });
  it('Button est un vrai <button type="button">', () => {
    expect(html(<Button>Principal</Button>)).toMatch(/^<button type="button"/);
  });
  it('TicketCard dessine le bord dentelé en radial-gradient', () => {
    expect(html(<TicketCard>60,10 €</TicketCard>)).toContain('radial-gradient(circle, var(--surface-50) 7px');
  });
});

describe('AccentTitle', () => {
  const accented = (out: string) => [...out.matchAll(/font-accent[^>]*>([^<]*)</g)].map((m) => m[1]);
  it('met le dernier mot en italique à partir de 2 mots', () => {
    expect(accented(html(<AccentTitle title="Ma liste de courses" />))).toEqual(['courses']);
    expect(accented(html(<AccentTitle title="Vue d’ensemble" />))).toEqual(['d’ensemble']);
    expect(accented(html(<AccentTitle title="Utilisateurs" />))).toEqual([]);
  });
  it('rattache la ponctuation isolée et évite les chiffres', () => {
    expect(accented(html(<AccentTitle title="Qu’est-ce qui t’amène ?" />))).toEqual(['t’amène ?']);
    expect(accented(html(<AccentTitle title="Plan de la semaine 46" />))).toEqual([]);
  });
  it('accepte une fin de titre choisie, ou aucune', () => {
    expect(accented(html(<AccentTitle title="Où ta semaine coûte le moins" accent="le moins" />))).toEqual([
      'le',
      'moins',
    ]);
    expect(accented(html(<AccentTitle title="Ma liste de courses" accent={false} />))).toEqual([]);
  });
  it('garde le texte exact du titre (lecteurs d’écran, tests)', () => {
    const out = html(<AccentTitle title="Qu’est-ce qui t’amène ?" animate />).replace(/<[^>]+>/g, '');
    expect(out).toBe('Qu’est-ce qui t’amène ?');
  });
});
