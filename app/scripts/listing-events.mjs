// What happened to each visual on Microsoft Marketplace, day by day, read from
// the commits of "Visuals Summary.csv". listing-history.mjs builds
// scripts/listing-history.json with it, and snapshot.mjs uses it to add the
// commits made since that file was last built.
//
// Each commit lists every visual on Microsoft Marketplace that day, with its
// version, whether it was certified and the Release Date of that version. The
// file was committed about weekly from January 2024 and daily since May 2026, so
// a change is first seen up to a week after it happened. Its day is the Release
// Date when that falls between the commit that first shows the change and the
// one before it. A Release Date before that stretch becomes its first day, and
// one after it, or none at all, becomes the day of the commit. A visual that left
// is dated by the first commit that no longer lists it, since nothing records
// the day it went.
//
// The history holds, for each visual:
//   listed:    [from, to, certified], one per stretch the visual was listed.
//              from is the day it arrived and to the day of the first commit
//              that no longer lists it, or null. certified is 1 when it arrived
//              certified.
//   versions:  the day of each new version.
//   certified: the day of each certification. No visual has lost one.
//   last:      [version, certified] in the last commit that listed it.
// Days are written YYYY-MM-DD, in UTC.
import { writeFileSync } from 'node:fs';

export const REPOSITORY = process.env.GITHUB_REPOSITORY || 'DataChant/PowerBI-Visuals-Marketplace';
export const FILE = 'Visuals%20Summary.csv';
const DAY = 86400000;

/**
 * Fetches a URL, trying four times. A GitHub API call carries GITHUB_TOKEN when
 * it is set, since a GitHub Actions runner shares its address with others and
 * soon reaches the limit on calls made without one.
 */
export async function get(url) {
  const headers = { 'User-Agent': 'custom-visuals-marketplace' };
  if (process.env.GITHUB_TOKEN && url.startsWith('https://api.github.com/'))
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  for (let attempt = 1; ; attempt++) {
    try {
      const response = await fetch(url, { headers });
      if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
      return response;
    } catch (error) {
      if (attempt === 4) throw new Error(`Could not load ${url}: ${error.message}`);
      await new Promise((resolve) => setTimeout(resolve, attempt * 2000));
    }
  }
}

/** A quoted-field CSV reader. Rows whose length differs from the header are dropped. */
export function parseCsv(text) {
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

/** The day number of a YYYY-MM-DD date, or of a date and time, counted from 1 January 1970. */
export const dayOf = (iso) => Math.floor(Date.parse(`${iso.slice(0, 10)}T00:00:00Z`) / DAY);
export const isoOf = (day) => new Date(day * DAY).toISOString().slice(0, 10);

/**
 * A Release Date as the file writes it, as a day number, or null. The file has
 * used 10/2/2026, 1/22/2024 0:00, 2026-10-02 and a full ISO time.
 */
export function releaseDayOf(value) {
  const s = (value ?? '').trim();
  let m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+\d{1,2}:\d\d(?::\d\d)?(?:\s*[AP]M)?)?$/i.exec(s);
  if (m) {
    const [month, day] = [Number(m[1]), Number(m[2])];
    if (month < 1 || month > 12 || day < 1 || day > 31) return null;
    return dayOf(`${m[3]}-${m[1].padStart(2, '0')}-${m[2].padStart(2, '0')}`);
  }
  m = /^(\d{4})-(\d\d)-(\d\d)(?:[T ].*)?$/.exec(s);
  return m ? dayOf(s) : null;
}

/**
 * The day a change happened, when `previous` is the day of the commit before
 * the one that first shows it, on `current`. See the comment at the top.
 */
export function dated(release, previous, current) {
  if (release == null) return current;
  if (previous == null) return Math.min(release, current);
  return Math.min(Math.max(release, previous + 1), current);
}

/**
 * The rows of one copy of the file. The file changed shape twice: the name and
 * the link each have two headings, and the first four commits predate the
 * Visual GUID column, so their GUID is empty here.
 */
export function rowsOf(text) {
  return parseCsv(text).map((r) => ({
    guid: (r['Visual GUID'] ?? '').trim(),
    link: (r['AppSource Link'] ?? r['Link'] ?? '').trim(),
    name: (r['Custom Visual'] ?? r['Name'] ?? '').trim(),
    publisher: (r['Publisher'] ?? '').trim(),
    version: (r['Version'] ?? '').trim(),
    certified: r['Is Certified'] === 'Certified',
    release: releaseDayOf(r['Release Date']),
  }));
}

/** A history that has read no commit yet. */
export const emptyHistory = () => ({ from: null, through: null, commits: 0, visuals: new Map() });

/** A history as listing-history.json stores it. */
export const readHistory = (json) => ({
  from: json.from,
  through: json.through,
  commits: json.commits,
  visuals: new Map(Object.entries(json.visuals)),
});

/** The stretch a visual is listed in now, or undefined when it is not listed. */
export function openStretch(v) {
  const last = v.listed[v.listed.length - 1];
  return last && last[1] == null ? last : undefined;
}

/**
 * Adds one commit, made at `stamp`, to the history. Commits must arrive oldest
 * first. A row without a GUID is skipped.
 */
export function advance(history, stamp, rows) {
  const day = dayOf(stamp);
  const previous = history.through == null ? null : dayOf(history.through);
  const seen = new Set();
  for (const r of rows) {
    if (!r.guid || seen.has(r.guid)) continue;
    seen.add(r.guid);
    let v = history.visuals.get(r.guid);
    if (!v) {
      v = { name: '', publisher: '', listed: [], versions: [], certified: [], last: null };
      history.visuals.set(r.guid, v);
    }
    if (!openStretch(v)) {
      // The visuals in the first commit were already listed, so they have no arrival to date.
      const from = previous == null ? day : dated(r.release, previous, day);
      v.listed.push([isoOf(from), null, r.certified ? 1 : 0]);
    }
    // A visual that comes back may come back with a new version.
    if (v.last) {
      if (r.version && v.last[0] && r.version !== v.last[0])
        v.versions.push(isoOf(dated(r.release, previous, day)));
      if (r.certified && v.last[1] === 0) v.certified.push(isoOf(dated(r.release, previous, day)));
    }
    v.last = [r.version || (v.last ? v.last[0] : ''), r.certified ? 1 : 0];
    v.name = r.name || v.name;
    v.publisher = r.publisher || v.publisher;
  }
  for (const [guid, v] of history.visuals) {
    const open = openStretch(v);
    if (open && !seen.has(guid)) open[1] = isoOf(day);
  }
  history.from ??= stamp;
  history.through = stamp;
  history.commits++;
  return seen.size;
}

/** Writes the history, one visual to a line, so a rebuild shows up as a readable difference. */
export function writeHistory(history, path) {
  const lines = [...history.visuals.keys()]
    .sort()
    .map((guid) => {
      const { name, publisher, listed, versions, certified, last } = history.visuals.get(guid);
      return `    ${JSON.stringify(guid)}: ${JSON.stringify({ name, publisher, listed, versions, certified, last })}`;
    });
  writeFileSync(
    path,
    `{
  "source": ${JSON.stringify(`Visuals Summary.csv in ${REPOSITORY}`)},
  "from": ${JSON.stringify(history.from)},
  "through": ${JSON.stringify(history.through)},
  "commits": ${history.commits},
  "visuals": {
${lines.join(',\n')}
  }
}
`
  );
}

/** A commit's time as the history writes it. */
const stampOf = (commit) => new Date(commit.commit.committer.date).toISOString().replace('.000Z', 'Z');

/**
 * The commits of the file made after `since`, or every commit when it is null,
 * oldest first, as { sha, stamp }.
 */
export async function commitsSince(since) {
  const commits = [];
  const after = since ? `&since=${encodeURIComponent(since)}` : '';
  for (let page = 1; ; page++) {
    const batch = await (
      await get(`https://api.github.com/repos/${REPOSITORY}/commits?path=${FILE}&per_page=100&page=${page}${after}`)
    ).json();
    commits.push(...batch.map((c) => ({ sha: c.sha, stamp: stampOf(c) })));
    if (batch.length < 100) break;
  }
  return commits
    .filter((c) => since == null || c.stamp > since)
    .sort((a, b) => a.stamp.localeCompare(b.stamp));
}

/** The file as one commit left it. These downloads do not count toward the API limit. */
export async function copyAt(sha) {
  return (await get(`https://raw.githubusercontent.com/${REPOSITORY}/${sha}/${FILE}`)).text();
}
