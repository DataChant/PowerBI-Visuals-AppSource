const integer = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });
const oneDecimal = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});
const shortDate = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
});

export function formatInt(value: number | null | undefined): string {
  return value == null ? '-' : integer.format(value);
}

/** AppSource popularity is a 0 to 1 percentile. Shown as a score out of 100. */
export function formatScore(popularity: number | null | undefined): string {
  return popularity == null ? '-' : oneDecimal.format(popularity * 100);
}

/** A popularity change in score points, always signed. */
export function formatScoreChange(change: number | null | undefined): string {
  if (change == null) return '-';
  const points = change * 100;
  const text = oneDecimal.format(Math.abs(points));
  if (text === '0.0') return '0.0';
  return `${points > 0 ? '+' : '−'}${text}`;
}

export function formatRating(value: number | null | undefined): string {
  return value == null || value === 0 ? '-' : oneDecimal.format(value);
}

export function formatPercent(value: number | null | undefined): string {
  return value == null ? '-' : `${integer.format(value * 100)}%`;
}

export function formatDate(date: Date | null | undefined): string {
  return date ? shortDate.format(date) : '-';
}
