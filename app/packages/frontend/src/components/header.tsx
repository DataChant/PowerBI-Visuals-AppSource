import { BarChart3, ExternalLink, Moon, Sun } from 'lucide-react';

import pixieLogo from '@/assets/bipixie-logo-color-dark.svg';
import { useTheme } from '@/hooks/theme.context';
import { TABS, type Tab } from '@/lib/tabs';
import { cn } from '@/lib/utils';

const PIXIE_LINKS = [
  { label: 'Website', name: 'BI Pixie website', href: 'https://bipixie.com' },
  {
    label: 'Fabric workload',
    name: 'BI Pixie Fabric workload',
    href: 'https://app.fabric.microsoft.com/workloadhub/detail/DataChant.BIPixie.Product?experience=fabric-developer',
  },
];

/** The promo for BI Pixie, from the same team. It scrolls away with the page instead of sticking. */
function PixieRibbon() {
  // The ribbon is BI Pixie's own ground, so it keeps the brand's dark purple
  // and gold in both themes instead of following the page.
  return (
    <aside
      aria-label="BI Pixie"
      className="border-b border-[#F8CF70]/40 bg-[#2B1549] text-[#E4D9F0] fit:shrink-0"
    >
      <div className="mx-auto flex max-w-[1280px] flex-wrap items-center gap-x-500 gap-y-100 px-400 py-400 text-300 leading-300 sm:text-400 sm:leading-400">
        <a
          href="https://bipixie.com"
          target="_blank"
          rel="noreferrer"
          aria-label="BI Pixie website, opens in a new tab"
          className="inline-flex min-h-[44px] shrink-0 items-center focus-visible:outline-2 focus-visible:outline-[#F8CF70]"
        >
          <img
            src={pixieLogo}
            alt="BI Pixie"
            className="h-[40px] w-auto sm:h-[48px]"
          />
        </a>
        <p className="min-w-0 flex-1 basis-[320px]">
          <span className="block text-400 font-bold leading-400 text-white sm:text-500 sm:leading-500">
            This app is sponsored by BI Pixie, AI Readiness for Power BI.
          </span>{' '}
          {/* The phone keeps the sponsor line and the offer, and drops this sentence. */}
          <span className="hidden sm:inline">
            BI Pixie assesses your semantic models, optimizes them for AI, and
            benchmarks whether Copilot and Fabric data agents answer
            correctly.{' '}
          </span>
          Start free and assess AI Readiness for up to 500 semantic models.
        </p>
        {/* Where a page fits the window, the offer sits above the two links instead of beside them. */}
        <ul className="flex flex-wrap items-center gap-x-400 gap-y-100 fit:grid fit:grid-cols-[auto_auto] fit:gap-y-100">
          <li className="fit:col-span-2">
            <a
              href="https://app.bipixie.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Start free with BI Pixie, opens in a new tab"
              className="inline-flex min-h-[44px] items-center rounded-full bg-[#F8CF70] px-400 font-bold fit:min-h-[32px] text-[#2B1549] hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F8CF70]"
            >
              Start free
            </a>
          </li>
          {PIXIE_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                target="_blank"
                rel="noreferrer"
                aria-label={`${link.name}, opens in a new tab`}
                className="inline-flex min-h-[44px] items-center gap-100 font-semibold text-white underline fit:min-h-[28px] underline-offset-2 hover:text-[#F8CF70] focus-visible:outline-2 focus-visible:outline-[#F8CF70]"
              >
                {link.label}
                <ExternalLink className="icon-size-200" aria-hidden />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

export function Header({
  tab,
  onTab,
}: {
  tab: Tab;
  onTab: (tab: Tab) => void;
}) {
  const { isDark, toggleTheme } = useTheme();
  return (
    <>
    <PixieRibbon />
    <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur fit:shrink-0">
      {/* The title sits in the centre so its mark does not stack under the BI Pixie logo. */}
      <div className="relative mx-auto flex max-w-[1280px] items-center justify-center px-[60px] pt-200">
        <div className="flex min-w-0 items-center gap-300">
          <span className="inline-flex size-[32px] shrink-0 items-center justify-center rounded-xl bg-pbi text-pbi-foreground shadow-sm">
            <BarChart3 className="icon-size-300" aria-hidden />
          </span>
          {/* On a wide window the description follows the title on the same line. */}
          <div className="min-w-0 lg:flex lg:items-baseline lg:gap-300">
            <p className="truncate font-heading text-400 font-extrabold leading-400 sm:text-500 sm:leading-500">
              Custom Visuals Marketplace
            </p>
            <p className="truncate text-200 text-muted-foreground">
              The Power BI visuals on Microsoft Marketplace, ranked and explored.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
          className="absolute right-400 inline-flex size-[40px] items-center fit:size-[32px] max-sm:size-[44px] justify-center rounded-full border border-border bg-card hover:bg-accent focus-visible:outline-2 focus-visible:outline-ring"
        >
          {isDark ? (
            <Sun className="icon-size-200" aria-hidden />
          ) : (
            <Moon className="icon-size-200" aria-hidden />
          )}
        </button>
      </div>
      <nav
        aria-label="Sections"
        data-scroll-x
        className="mx-auto flex max-w-[1280px] gap-100 overflow-x-auto px-400 pt-100 fit:pt-0"
      >
        {TABS.map((t) => {
          const active = t.id === tab;
          return (
            <button
              key={t.id}
              type="button"
              aria-current={active ? 'page' : undefined}
              onClick={() => onTab(t.id)}
              className={cn(
                'relative min-h-[44px] shrink-0 px-300 text-300 font-semibold transition-colors fit:min-h-[36px] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring',
                active
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {t.label}
              {active && (
                <span
                  aria-hidden
                  className="absolute inset-x-200 bottom-0 h-[3px] rounded-full bg-pbi-mark"
                />
              )}
            </button>
          );
        })}
      </nav>
    </header>
    </>
  );
}
