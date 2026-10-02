//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
//        Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>
//-----------------------------------------------------------------------

// Shared client side of the source-activity feed. The blueprint on the welcome page
// reads these observed edits while you build. In a production build there is no
// dev endpoint, so the hook stays idle and the page shows an illustrative
// walkthrough instead. The data reports observed edits only: it is never a
// completion percentage or proof that a deployed app works.

import { useEffect, useState } from 'react';

export const AREAS = [
  { family: 'screens', label: 'Screens', idea: 'A place for your work' },
  { family: 'reads', label: 'Live data', idea: 'Information in reach' },
  { family: 'logic', label: 'Calculations', idea: 'Ideas that add up' },
  { family: 'data', label: 'Saved entries', idea: 'A place to keep things' },
  { family: 'actions', label: 'Secure actions', idea: 'Helpful things to do' },
  {
    family: 'connections',
    label: 'Connections',
    idea: 'Bringing things together',
  },
  { family: 'styling', label: 'Look and feel', idea: 'A little personality' },
] as const;

export type AreaFamily = (typeof AREAS)[number]['family'];
export type ChangeKind = 'add' | 'update' | 'delete';

export interface ActivityChange {
  id: string;
  family: AreaFamily;
  kind: ChangeKind;
  at: string;
}

export interface ActivityArea {
  family: AreaFamily;
  count: number;
  lastChangedAt: string | null;
  names?: string[];
}

export interface SourceActivity {
  structure: ActivityArea[];
  changes: ActivityChange[];
  generatedAt: string;
}

const CHANGE_COPY: Record<AreaFamily, Record<ChangeKind, string>> = {
  screens: {
    add: 'Added a screen',
    update: 'Updated the screens',
    delete: 'Removed a screen',
  },
  reads: {
    add: 'Added a data view',
    update: 'Updated the live data',
    delete: 'Removed a data view',
  },
  logic: {
    add: 'Added a calculation',
    update: 'Updated the calculations',
    delete: 'Removed a calculation',
  },
  data: {
    add: 'Added a place for saved entries',
    update: 'Updated saved entries',
    delete: 'Removed a saved-entry area',
  },
  actions: {
    add: 'Added a secure action',
    update: 'Updated a secure action',
    delete: 'Removed a secure action',
  },
  connections: {
    add: 'Added connection settings',
    update: 'Updated connection settings',
    delete: 'Removed connection settings',
  },
  styling: {
    add: 'Added a visual detail',
    update: 'Refined the look and feel',
    delete: 'Simplified the look and feel',
  },
};

export function describeChange(change: ActivityChange) {
  return CHANGE_COPY[change.family][change.kind];
}

function record(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function timestamp(value: unknown): value is string {
  return (
    typeof value === 'string' &&
    value.length <= 40 &&
    Number.isFinite(Date.parse(value))
  );
}

function family(value: unknown): value is AreaFamily {
  return AREAS.some((area) => area.family === value);
}

// A plain dev server or a production build returns HTML or nothing here. Treat
// any incomplete or unfamiliar payload as illustration mode, not a broken page.
export function parseActivity(value: unknown): SourceActivity | null {
  if (
    !record(value) ||
    !timestamp(value.generatedAt) ||
    !Array.isArray(value.structure) ||
    !Array.isArray(value.changes)
  )
    return null;
  if (
    value.structure.length !== AREAS.length ||
    !value.structure.every(
      (area) =>
        record(area) &&
        family(area.family) &&
        Number.isSafeInteger(area.count) &&
        (area.count as number) >= 0 &&
        (area.lastChangedAt === null || timestamp(area.lastChangedAt)) &&
        (area.names === undefined ||
          (Array.isArray(area.names) &&
            area.names.length <= 100 &&
            area.names.every(
              (name) => typeof name === 'string' && name.length <= 100
            )))
    )
  )
    return null;
  if (
    new Set(value.structure.map((area: ActivityArea) => area.family)).size !==
    AREAS.length
  )
    return null;
  if (
    value.changes.length > 20 ||
    !value.changes.every(
      (change) =>
        record(change) &&
        typeof change.id === 'string' &&
        change.id.length <= 100 &&
        family(change.family) &&
        ['add', 'update', 'delete'].includes(change.kind as string) &&
        timestamp(change.at)
    )
  )
    return null;
  return value as unknown as SourceActivity;
}

// Poll the bounded, same-origin dev endpoint. Only ever runs under `vite dev`:
// a production bundle has `import.meta.env.DEV === false`, so this returns null
// immediately and never issues a request.
export function useSourceActivity(visible: boolean) {
  const [activity, setActivity] = useState<SourceActivity | null>(null);
  useEffect(() => {
    if (!import.meta.env.DEV || !visible) return;
    let stopped = false;
    let controller: AbortController | null = null;
    let deadline: number | undefined;
    async function poll() {
      if (controller) return;
      const request = new AbortController();
      controller = request;
      deadline = window.setTimeout(() => request.abort(), 2000);
      try {
        const response = await fetch(
          `${import.meta.env.BASE_URL}@fabric-app/source-activity`,
          {
            signal: request.signal,
            cache: 'no-store',
            headers: { Accept: 'application/json' },
          }
        );
        const next = response.ok ? parseActivity(await response.json()) : null;
        if (!stopped) setActivity(next);
      } catch {
        if (!stopped) setActivity(null);
      } finally {
        window.clearTimeout(deadline);
        controller = null;
      }
    }
    void poll();
    const timer = window.setInterval(() => {
      void poll();
    }, 2500);
    return () => {
      stopped = true;
      window.clearInterval(timer);
      window.clearTimeout(deadline);
      controller?.abort();
    };
  }, [visible]);
  return activity;
}
