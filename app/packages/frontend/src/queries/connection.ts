/** The semantic model connector declared in rayfin/rayfin.yml. */
export const connection = 'visuals';

/**
 * AppSource IDs and visual GUIDs are letters, digits, dots, dashes and
 * underscores. Anything else is refused before it can reach a DAX string literal.
 */
export function assertSafeKey(value: string, label: string): string {
  if (!/^[A-Za-z0-9._-]{1,200}$/.test(value)) {
    throw new Error(`${label} "${value}" contains characters a ${label} never has.`);
  }
  return value;
}
