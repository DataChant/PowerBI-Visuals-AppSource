import { describe, expect, it } from 'vitest';

import { cn } from './utils';

describe('cn', () => {
  it('keeps a token font size beside a text colour', () => {
    expect(cn('text-300 text-foreground')).toBe('text-300 text-foreground');
    expect(cn('text-hero-800', 'text-muted-foreground')).toBe('text-hero-800 text-muted-foreground');
  });

  it('still lets a later size replace an earlier one', () => {
    expect(cn('text-200', 'text-500')).toBe('text-500');
  });
});
