import {
  useState,
  type ComponentProps,
  type CSSProperties,
  type ReactNode,
} from 'react';

import { useMoreBelow } from '@/hooks/use-more-below';
import { cn } from '@/lib/utils';

export function Card({
  title,
  subtitle,
  icon,
  actions,
  children,
  className,
  bodyClassName,
}: {
  title?: string;
  subtitle?: ReactNode;
  icon?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section
      className={cn(
        'flex min-w-0 flex-col rounded-3xl border border-border bg-card shadow-[0_1px_0_rgba(0,0,0,0.03)]',
        className
      )}
    >
      {(title || actions) && (
        <header className="flex flex-wrap items-start justify-between gap-200 px-400 pt-300">
          <div className="min-w-0 flex-1 basis-[180px]">
            {title && (
              <h2 className="flex items-center gap-200 text-400 font-bold leading-400">
                {icon}
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="mt-100 text-200 leading-200 text-muted-foreground">
                {subtitle}
              </p>
            )}
          </div>
          {actions}
        </header>
      )}
      <div className={cn('flex min-h-0 flex-1 flex-col p-300', bodyClassName)}>
        {children}
      </div>
    </section>
  );
}

export function Kpi({
  label,
  value,
  hint,
  className,
}: {
  label: string;
  value: string;
  hint?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        // Where a page fits the window, a figure is one line: label, value, hint.
        'flex min-w-0 flex-col gap-100 rounded-2xl border border-border bg-card px-400 py-200 fit:flex-row fit:items-baseline fit:gap-200 fit:rounded-xl fit:px-300 fit:py-100',
        className
      )}
    >
      <span className="text-200 font-medium text-muted-foreground fit:whitespace-nowrap">
        {label}
      </span>
      <span className="tabular font-heading text-600 font-bold leading-600 fit:whitespace-nowrap fit:text-500 fit:leading-500">
        {value}
      </span>
      {hint && (
        <span className="text-200 leading-200 text-muted-foreground fit:whitespace-nowrap">
          {hint}
        </span>
      )}
    </div>
  );
}

export function Segmented<T extends string | number>({
  label,
  value,
  options,
  onChange,
  className,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
  className?: string;
}) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={cn(
        'inline-flex rounded-full border border-border bg-muted p-100',
        className
      )}
    >
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={String(o.value)}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(o.value)}
            className={cn(
              'min-h-[32px] whitespace-nowrap rounded-full px-300 text-200 font-semibold transition-colors fit:min-h-[28px] focus-visible:outline-2 focus-visible:outline-ring',
              active
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

/**
 * An ordered list that may scroll inside its panel. While rows wait below the
 * last one in view, the foot of the list fades out, so a list that happens to
 * end on a whole row does not read as finished.
 */
export function ScrollList({
  className,
  children,
  ...props
}: ComponentProps<'ol'>) {
  const [ref, more] = useMoreBelow<HTMLOListElement>();
  return (
    <ol
      {...props}
      ref={ref}
      data-more-below={more || undefined}
      className={cn(className, more && 'mask-b-from-[calc(100%-32px)]')}
    >
      {children}
    </ol>
  );
}

/**
 * A visual's Microsoft Marketplace icon, or its initials when the image cannot
 * load. `fitSize` is its size where a page fits the window without scrolling.
 */
export function Thumb({
  src,
  name,
  size = 40,
  fitSize,
  className,
}: {
  src: string;
  name: string;
  size?: number;
  fitSize?: number;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('');
  return (
    <span
      className={cn(
        'inline-flex size-(--thumb) shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-muted fit:size-(--thumb-fit)',
        className
      )}
      style={
        { '--thumb': `${size}px`, '--thumb-fit': `${fitSize ?? size}px` } as CSSProperties
      }
    >
      {src && !failed ? (
        <img
          src={src}
          alt=""
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={() => setFailed(true)}
          className="h-full w-full object-contain"
        />
      ) : (
        <span
          aria-hidden
          className="font-heading text-200 font-bold text-muted-foreground"
        >
          {initials || '?'}
        </span>
      )}
    </span>
  );
}

/**
 * The seal itself: yellow, with nothing behind it. It is drawn filled, with a
 * dark check, because a yellow outline alone is too faint on the light page.
 */
function CertifiedSeal({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={cn('shrink-0', className)}>
      <path
        d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"
        className="fill-pbi stroke-pbi"
        strokeWidth={2}
        strokeLinejoin="round"
      />
      <path
        d="m9 12 2 2 4-4"
        fill="none"
        className="stroke-pbi-foreground"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * The mark a certified visual carries wherever visuals are listed. In a list
 * it is the seal alone, and the legend at the foot of the page says what the
 * seal means. `label` adds the word, for a hover card or the details pane.
 */
export function CertifiedBadge({
  className,
  label = false,
}: {
  className?: string;
  label?: boolean;
}) {
  if (label)
    return (
      <span
        className={cn(
          'inline-flex shrink-0 items-center gap-100 text-200 font-semibold',
          className
        )}
      >
        <CertifiedSeal className="size-[16px]" />
        Certified
      </span>
    );
  return (
    <span
      role="img"
      aria-label="Certified"
      title="Certified"
      className={cn('inline-flex size-[16px] shrink-0', className)}
    >
      <CertifiedSeal className="size-full" />
    </span>
  );
}

/** Narrows a page to the certified visuals, or shows them all. */
export function CertifiedToggle({
  certifiedOnly,
  onChange,
  className,
}: {
  certifiedOnly: boolean;
  onChange: (certifiedOnly: boolean) => void;
  className?: string;
}) {
  return (
    <Segmented<'all' | 'certified'>
      label="Certification"
      value={certifiedOnly ? 'certified' : 'all'}
      onChange={(value) => onChange(value === 'certified')}
      options={[
        { value: 'all', label: 'All visuals' },
        { value: 'certified', label: 'Certified' },
      ]}
      className={className}
    />
  );
}
