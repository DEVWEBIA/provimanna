import Link from 'next/link';
import { Gallery } from './gallery';

export default function DevUiPage() {
  return (
    <div className="bg-surface-50 text-ink min-h-screen px-4 pb-20 pt-10 sm:px-6">
      <div className="mx-auto flex max-w-[1240px] flex-col gap-6">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-saving-ink mb-2 text-[13px] font-black tracking-[1.4px]">
              DESIGN SYSTEM · AUBERGINE &amp; ORANGE
            </p>
            <h1 className="font-display text-[clamp(40px,5vw,64px)] font-extrabold leading-none tracking-[-2px]">
              Bibliothèque de composants
            </h1>
          </div>
          <p className="text-ink-muted max-w-[420px] text-[16px] leading-6">
            Les briques communes au site, à la web app et au back-office. Les valeurs viennent de tokens.css.{' '}
            <Link href="/dev/ui/shell" className="text-brand font-black underline">
              Voir l’AppShell
            </Link>
          </p>
        </header>
        <Gallery theme="light" />
        <div data-theme="dark" className="bg-surface-50 text-ink flex flex-col gap-6 rounded-xl p-4 sm:p-6">
          <h2 className="font-display text-display">Thème sombre</h2>
          <Gallery theme="dark" />
        </div>
      </div>
    </div>
  );
}
