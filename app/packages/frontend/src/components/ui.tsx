import { BadgeCheck } from 'lucide-react';
import { useState, type ReactNode } from 'react';

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
        <header className="flex flex-wrap items-start justify-between gap-200 px-500 pt-400">
          <div className="min-w-0">
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
      <div className={cn('flex min-h-0 flex-1 flex-col p-400', bodyClassName)}>
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
        'flex min-w-0 flex-col gap-100 rounded-2xl border border-border bg-card px-400 py-300',
        className
      )}
    >
      <span className="text-200 font-medium text-muted-foreground">{label}</span>
      <span className="tabular font-heading text-hero-700 font-bold leading-hero-700">
        {value}
      </span>
      {hint && (
        <span className="text-200 leading-200 text-muted-foreground">{hint}</span>
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
              'min-h-[32px] rounded-full px-300 text-200 font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-ring',
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

/** A visual's AppSource icon, or its initials when the image cannot load. */
export function Thumb({
  src,
  name,
  size = 40,
  className,
}: {
  src: string;
  name: string;
  size?: number;
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
        'inline-flex shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-muted',
        className
      )}
      style={{ width: size, height: size }}
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

export function CertifiedBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-100 rounded-full bg-pbi px-200 py-[1px] text-100 font-bold uppercase tracking-wide text-pbi-foreground',
        className
      )}
    >
      <BadgeCheck className="icon-size-100" aria-hidden />
      Certified
    </span>
  );
}
