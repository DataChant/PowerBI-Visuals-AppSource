// Builds scripts/listing-history.json from every commit of "Visuals Summary.csv",
// so the Replay page can show, one day at a time from January 2024, which
// visuals were listed, when each new version came out and when each visual
// became certified. listing-events.mjs explains how each change is dated.
//
// The result is committed, because the commits it reads never change.
// snapshot.mjs adds the commits made since, each time it runs, so the file only
// needs to be built again when that gap grows long:
//
//   node scripts/listing-history.mjs                 reads every commit from GitHub
//   node scripts/listing-history.mjs --update        adds the commits made since the file was built
//   node scripts/listing-history.mjs --from <folder> reads saved copies, named
//                                                    <YYYY-MM-DDTHHMMSS>_<sha>.csv
import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  advance,
  commitsSince,
  copyAt,
  emptyHistory,
  openStretch,
  readHistory,
  rowsOf,
  writeHistory,
} from './listing-events.mjs';

const out = join(dirname(fileURLToPath(import.meta.url)), 'listing-history.json');
const update = process.argv.includes('--update');
const history = update ? readHistory(JSON.parse(readFileSync(out, 'utf8'))) : emptyHistory();

/** The copies to read, oldest first, as { stamp, rows }. */
async function loadCopies() {
  const from = process.argv.indexOf('--from');
  if (from > 0) {
    const folder = process.argv[from + 1];
    return readdirSync(folder)
      .map((name) => {
        const m = /^(\d{4}-\d\d-\d\d)T(\d\d)(\d\d)(\d\d)_([0-9a-f]+)\.csv$/.exec(name);
        return m && { stamp: `${m[1]}T${m[2]}:${m[3]}:${m[4]}Z`, name };
      })
      .filter((s) => s && (history.through == null || s.stamp > history.through))
      .sort((a, b) => a.stamp.localeCompare(b.stamp))
      .map((s) => ({ stamp: s.stamp, rows: rowsOf(readFileSync(join(folder, s.name), 'utf8')) }));
  }
  const copies = [];
  for (const c of await commitsSince(history.through)) copies.push({ stamp: c.stamp, rows: rowsOf(await copyAt(c.sha)) });
  return copies;
}

const copies = await loadCopies();
if (copies.length === 0 && history.through == null) throw new Error('No copy of the file was found.');

// The first commits have no GUID, so a visual is recognised by its listing link,
// which every later commit pairs with a GUID.
const guidOfLink = new Map();
for (const c of copies)
  for (const r of c.rows) if (r.guid && r.link && !guidOfLink.has(r.link)) guidOfLink.set(r.link, r.guid);
let unmatched = 0;
for (const c of copies)
  for (const r of c.rows)
    if (!r.guid && r.link) {
      r.guid = guidOfLink.get(r.link) ?? `link:${r.link}`;
      if (r.guid.startsWith('link:')) unmatched++;
    }

// A copy that lists far fewer visuals than the one before it would read as a
// wave of departures, so it is reported for a person to look at.
let before = null;
for (const c of copies) {
  const listed = advance(history, c.stamp, c.rows);
  if (before != null && listed < before * 0.9)
    console.warn(`${c.stamp} lists ${listed} visuals, against ${before} in the commit before it.`);
  before = listed;
}
writeHistory(history, out);

const all = [...history.visuals.values()];
const count = (pick) => all.reduce((sum, v) => sum + pick(v), 0);
console.log(
  [
    `${copies.length} commits read, ${history.commits} in all, ${history.from} to ${history.through}`,
    `${history.visuals.size} visuals, ${all.filter(openStretch).length} listed in the last commit`,
    `${count((v) => v.listed.length)} stretches listed, ${count((v) => v.listed.filter((s) => s[1] != null).length)} departures`,
    `${count((v) => v.versions.length)} new versions, ${count((v) => v.certified.length)} certifications`,
    `${unmatched} rows without a GUID could not be matched by link`,
    `Wrote ${out}`,
  ].join('\n')
);
