// Builds scripts/listing-history.json: what the repository recorded about each
// custom visual before the daily leaderboard began on 24 July 2025.
//
// "Visuals Summary.csv" was committed about weekly from January 2024. Each
// commit lists every visual on Microsoft Marketplace that day, with its version
// and whether it was certified. One commit, on 22 January 2024, also carries
// popularity and ratings. This script reads every one of those commits and
// keeps only what changed between them, so the Replay page can open in January
// 2024 instead of July 2025. The name and the publisher are the last ones
// recorded, for the visuals that left before the leaderboard could name them.
//
// The result is committed, because the commits it reads never change. Run it
// again only to rebuild the file from scratch:
//
//   node scripts/listing-history.mjs                 reads the commits from GitHub
//   node scripts/listing-history.mjs --from <folder> reads saved copies, named
//                                                    <YYYY-MM-DDTHHMMSS>_<sha>.csv
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPOSITORY = process.env.GITHUB_REPOSITORY || 'DataChant/PowerBI-Visuals-Marketplace';
const FILE = 'Visuals%20Summary.csv';
/** The leaderboard's first snapshot is dated 24 July 2025, and it takes over from there. */
const CUTOFF = '2025-07-24T00:00:00Z';
const out = join(dirname(fileURLToPath(import.meta.url)), 'listing-history.json');

async function get(url) {
  for (let attempt = 1; ; attempt++) {
    try {
      const response = await fetch(url, { headers: { 'User-Agent': 'listing-history' } });
      if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
      return response;
    } catch (error) {
      if (attempt === 4) throw new Error(`Could not load ${url}: ${error.message}`);
      await new Promise((resolve) => setTimeout(resolve, attempt * 2000));
    }
  }
}

/** A quoted-field CSV reader. Rows whose length differs from the header are dropped. */
function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;
  const source = text.charCodeAt(0) === 0xfeff ? text.slice(1) : text;
  for (let i = 0; i < source.length; i++) {
    const c = source[i];
    if (quoted) {
      if (c === '"') {
        if (source[i + 1] === '"') {
          field += '"';
          i++;
        } else quoted = false;
      } else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ',') {
      row.push(field);
      field = '';
    } else if (c === '\n' || c === '\r') {
      if (c === '\r' && source[i + 1] === '\n') i++;
      row.push(field);
      field = '';
      rows.push(row);
      row = [];
    } else field += c;
  }
  if (field !== '' || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  const [header, ...body] = rows;
  return body
    .filter((r) => r.length === header.length)
    .map((r) => Object.fromEntries(header.map((name, i) => [name, r[i]])));
}

/** Every saved copy of the file before the cutoff, oldest first. */
async function loadSnapshots() {
  const from = process.argv.indexOf('--from');
  if (from > 0) {
    const folder = process.argv[from + 1];
    return readdirSync(folder)
      .map((name) => {
        const m = /^(\d{4}-\d\d-\d\d)T(\d\d)(\d\d)(\d\d)_([0-9a-f]+)\.csv$/.exec(name);
        return m && { stamp: `${m[1]}T${m[2]}:${m[3]}:${m[4]}Z`, name };
      })
      .filter((s) => s && s.stamp < CUTOFF)
      .sort((a, b) => a.stamp.localeCompare(b.stamp))
      .map((s) => ({ stamp: s.stamp, text: readFileSync(join(folder, s.name), 'utf8') }));
  }
  const commits = [];
  for (let page = 1; ; page++) {
    const batch = await (
      await get(
        `https://api.github.com/repos/${REPOSITORY}/commits?path=${FILE}&until=${CUTOFF}&per_page=100&page=${page}`
      )
    ).json();
    commits.push(...batch);
    if (batch.length < 100) break;
  }
  const snapshots = [];
  for (const c of commits) {
    const stamp = new Date(c.commit.committer.date).toISOString().replace('.000Z', 'Z');
    if (stamp >= CUTOFF) continue;
    const text = await (
      await get(`https://raw.githubusercontent.com/${REPOSITORY}/${c.sha}/${FILE}`)
    ).text();
    snapshots.push({ stamp, text });
  }
  return snapshots.sort((a, b) => a.stamp.localeCompare(b.stamp));
}

const number = (value) => {
  if (value == null || value === '') return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
};

const snapshots = (await loadSnapshots()).map(({ stamp, text }) => ({
  stamp,
  // The file changed shape twice: the name and the link each have two headings,
  // and the first four commits predate the Visual GUID column.
  rows: parseCsv(text).map((r) => ({
    guid: (r['Visual GUID'] ?? '').trim(),
    link: (r['AppSource Link'] ?? r['Link'] ?? '').trim(),
    name: (r['Custom Visual'] ?? r['Name'] ?? '').trim(),
    publisher: (r['Publisher'] ?? '').trim(),
    version: (r['Version'] ?? '').trim(),
    certified: r['Is Certified'] === 'Certified',
    popularity: number(r['Popularity']),
    ratings: number(r['# of Ratings']),
    average: number(r['Average Rating']),
  })),
}));
if (snapshots.length === 0) throw new Error('No copy of the file was found before the cutoff.');

// The first commits have no GUID, so a visual is recognised by its listing link,
// which every later commit pairs with a GUID.
const guidOfLink = new Map();
for (const s of snapshots)
  for (const r of s.rows) if (r.guid && r.link && !guidOfLink.has(r.link)) guidOfLink.set(r.link, r.guid);
let unmatched = 0;
for (const s of snapshots)
  for (const r of s.rows)
    if (!r.guid) {
      r.guid = guidOfLink.get(r.link) ?? `link:${r.link}`;
      if (r.guid.startsWith('link:')) unmatched++;
    }

const visuals = new Map();
snapshots.forEach((s, i) => {
  const seen = new Set();
  for (const r of s.rows) {
    if (seen.has(r.guid)) continue;
    seen.add(r.guid);
    let v = visuals.get(r.guid);
    if (!v) {
      v = { name: '', publisher: '', listed: [], versions: [], certified: [], scores: [], last: null, open: false };
      visuals.set(r.guid, v);
    }
    if (!v.open) {
      v.listed.push([i, null]);
      v.open = true;
    }
    if (v.last) {
      if (r.version && v.last[0] && r.version !== v.last[0]) v.versions.push(i);
      if (r.certified && v.last[1] === 0) v.certified.push(i);
    }
    v.last = [r.version || (v.last ? v.last[0] : ''), r.certified ? 1 : 0];
    v.name = r.name || v.name;
    v.publisher = r.publisher || v.publisher;
    if (r.popularity != null && r.popularity > 0)
      v.scores.push([i, r.popularity, r.ratings ?? 0, r.average ?? 0]);
  }
  for (const [guid, v] of visuals)
    if (v.open && !seen.has(guid)) {
      v.listed[v.listed.length - 1][1] = i;
      v.open = false;
    }
});

// One visual to a line, so a rebuild shows up as a readable difference.
const lines = [...visuals.keys()].sort().map((guid) => {
  const { name, publisher, listed, versions, certified, scores, last } = visuals.get(guid);
  return `    ${JSON.stringify(guid)}: ${JSON.stringify({ name, publisher, listed, versions, certified, scores, last })}`;
});
writeFileSync(
  out,
  `{
  "source": ${JSON.stringify(`Visuals Summary.csv in ${REPOSITORY}, every commit before ${CUTOFF.slice(0, 10)}`)},
  "snapshots": ${JSON.stringify(snapshots.map((s) => s.stamp))},
  "visuals": {
${lines.join(',\n')}
  }
}
`
);

const all = [...visuals.values()];
const count = (pick) => all.reduce((sum, v) => sum + pick(v), 0);
console.log(
  [
    `${snapshots.length} snapshots, ${snapshots[0].stamp} to ${snapshots[snapshots.length - 1].stamp}`,
    `${visuals.size} visuals, ${snapshots[0].rows.length} listed at the start and ${all.filter((v) => v.open).length} at the end`,
    `${count((v) => v.listed.length) - snapshots[0].rows.length} arrivals, ${count((v) => v.listed.filter((s) => s[1] != null).length)} departures`,
    `${count((v) => v.versions.length)} new versions, ${count((v) => v.certified.length)} certifications, ${count((v) => v.scores.length)} scores`,
    `${unmatched} rows without a GUID could not be matched by link`,
    `Wrote ${out}`,
  ].join('\n')
);
