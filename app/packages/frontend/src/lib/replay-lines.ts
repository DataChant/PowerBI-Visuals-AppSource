import { formatDate, formatInt, formatScore } from '@/lib/format';
import {
  CERTIFIED,
  lastReading,
  LISTED,
  modeStart,
  type Replay,
  type ReplayMode,
} from '@/lib/replay';
import type { Who } from '@/lib/replay-who';

export function formatStars(stars: number) {
  const value = Number.isInteger(stars) ? String(stars) : stars.toFixed(1);
  return `${value} star${stars === 1 ? '' : 's'} on average`;
}

/**
 * What the card for a visual the pointer rests on says about it on day `at`,
 * the same in the 3D view and the flat one: whether it is certified, and a few
 * lines on its popularity, or on its listing, and its new versions.
 */
export function describeVisual(
  replay: Replay,
  mode: ReplayMode,
  at: number,
  v: number,
  who: Who
): { certified: boolean; lines: string[] } {
  const frame = replay.frames[at];
  if (!frame) return { certified: false, lines: [] };
  const certified = (frame.state[v] & CERTIFIED) !== 0;
  if ((frame.state[v] & LISTED) === 0) return { certified, lines: ['Not listed on this day'] };

  let first = at;
  while (first > 0 && (replay.frames[first - 1].state[v] & LISTED) !== 0) first--;
  // New versions count from the start of the view, or from the day the visual
  // was listed when that came later, so no visual is dated before it existed.
  const since = Math.max(modeStart(replay, mode), first);
  const sinceDay = formatDate(replay.frames[since].day);
  const versions = frame.versions[v] - (replay.frames[since]?.versions[v] ?? 0);
  const versionLine =
    versions > 0
      ? `${formatInt(versions)} new version${versions === 1 ? '' : 's'} since ${sinceDay}`
      : `No new version since ${sinceDay}`;

  if (mode === 'scores') {
    const read = lastReading(replay, at, v);
    if (!read) return { certified, lines: ['No popularity recorded yet', versionLine] };
    // The leaderboard records a visual only when its figures change, so a
    // reading that does not record it still holds them. They are as of the
    // latest reading.
    const readOn = replay.readings[frame.reading].frame;
    return {
      certified,
      lines: [
        readOn === at
          ? `Popularity ${formatScore(read.score)}`
          : `Popularity ${formatScore(read.score)} as of ${formatDate(replay.frames[readOn].day)}`,
        read.raters > 0
          ? `${formatInt(read.raters)} rating${read.raters === 1 ? '' : 's'}, ${formatStars(read.stars)}`
          : 'No ratings yet',
        versionLine,
      ],
    };
  }

  return {
    certified,
    lines: [
      who.publisher,
      first === 0
        ? 'Listed since the replay began'
        : `Listed since ${formatDate(replay.frames[first].day)}`,
      versionLine,
    ].filter(Boolean),
  };
}
