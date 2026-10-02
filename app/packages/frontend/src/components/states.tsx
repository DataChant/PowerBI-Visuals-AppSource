import { AlertTriangle, RotateCw, Sparkles } from 'lucide-react';
import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn('animate-pulse rounded-lg bg-muted', className)}
    />
  );
}

export function LoadingBlock({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  return (
    <div
      role="status"
      aria-label={label}
      className={cn('flex flex-col gap-200 p-400', className)}
    >
      <Skeleton className="h-400 w-1/3" />
      <Skeleton className="h-full min-h-[80px] w-full flex-1" />
    </div>
  );
}

export function EmptyState({
  title,
  children,
  className,
}: {
  title: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-200 p-600 text-center',
        className
      )}
    >
      <Sparkles className="icon-size-400 text-brand-foreground" aria-hidden />
      <p className="text-400 font-semibold">{title}</p>
      {children && (
        <p className="max-w-[44ch] text-300 text-muted-foreground">{children}</p>
      )}
    </div>
  );
}

export function ErrorState({
  title,
  message,
  onRetry,
  className,
}: {
  title: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <div
      role="alert"
      className={cn(
        'flex flex-col items-start gap-200 rounded-xl border border-destructive/40 bg-destructive/5 p-400',
        className
      )}
    >
      <p className="flex items-center gap-200 text-300 font-semibold text-destructive">
        <AlertTriangle className="icon-size-200" aria-hidden />
        {title}
      </p>
      <p className="text-200 break-words text-muted-foreground">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-100 rounded-lg border border-border bg-card px-300 py-100 text-200 font-medium hover:bg-accent focus-visible:outline-2 focus-visible:outline-ring"
        >
          <RotateCw className="icon-size-100" aria-hidden />
          Try again
        </button>
      )}
    </div>
  );
}
