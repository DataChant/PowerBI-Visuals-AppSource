// Builds the data files the app reads, from two public sources:
//
//   - the AppSource catalog API, for the visuals listed today;
//   - leaderboard_data.csv in DataChant/PowerBI-Visuals-Marketplace, for their
//     history. It is a change log: a snapshot holds only the visuals whose
//     figures changed, and each change column is the difference from that
//     visual's previous row.
//
// Neither needs a sign-in, so this runs anywhere: `npm run snapshot`.
//
// The leaderboard begins on 24 July 2025. Which visuals were listed, from
// January 2024, and when each new version and certification came out, is read
// from the commits of "Visuals Summary.csv": scripts/listing-history.json holds
// those up to the day it was built, and the newer commits are read here.
//
// Whole-catalog files are written as they are. Per-visual files are split into
// buckets, so opening one visual downloads a small file rather than everything.
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  advance,
  commitsSince,
  copyAt,
  dayOf,
  get,
  isoOf,
  openStretch,
  parseCsv,
  readHistory,
  REPOSITORY,
  rowsOf,
} from './listing-events.mjs';

const CATALOG_URL =
  "https://catalogapi.azure.com/offers?api-version=2018-08-01-beta&storefront=appsource&$filter=offerType eq 'PowerBIVisuals'";
// A GitHub Actions run reads the file from the repository it runs in, so the
// site keeps building if the repository is renamed or forked.
const LEADERBOARD_URL = `https://raw.githubusercontent.com/${REPOSITORY}/refs/heads/main/leaderboard_data.csv`;

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'packages/frontend/public/snapshot');

/**
 * What the data files hold, as a number, written to built.json. A copy of the
 * app published elsewhere reads the website's files only when this matches its
 * own `DATA_FORMAT` in packages/frontend/src/lib/snapshot.ts, so raise both
 * whenever a file changes shape.
 */
const DATA_FORMAT = 2;

/** Keep in step with `bucketOf` in packages/frontend/src/lib/snapshot.ts. */
const BUCKETS = 64;
function bucketOf(key) {
  let sum = 0;
  for (let i = 0; i < key.length; i++) sum += key.charCodeAt(i);
  return sum % BUCKETS;
}

async function loadCatalog() {
  const offers = [];
  for (let url = encodeURI(CATALOG_URL); url; ) {
    const page = await (await get(url)).json();
    offers.push(...(page.items ?? []));
    url = page.nextPageLink;
  }
  return offers;
}

// Trailing spaces are dropped, as AppSource listings often carry them.
const text = (value) => (value == null || value === '' ? null : String(value).trimEnd());
const number = (value) => (value == null || value === '' ? null : Number(value));
const column = (name, dataType) => ({ name, dataType });
const table = (columns, rows) => ({ status: 'success', table: { columns, rows } });

const DAY = 86400000;

// scripts/listing-history.json is committed now and then, so the commits made
// since it was built are added here, oldest first. Listing them is one GitHub
// API call, and downloading each copy does not count toward that limit. A long
// gap is read only in part, and the leaderboard dates the days after it.
const TOP_UP_LIMIT = 90;
const listingHistory = readHistory(JSON.parse(readFileSync(join(root, 'scripts/listing-history.json'), 'utf8')));
try {
  const newer = await commitsSince(listingHistory.through);
  for (const c of newer.slice(0, TOP_UP_LIMIT)) advance(listingHistory, c.stamp, rowsOf(await copyAt(c.sha)));
  console.log(`listing history: ${newer.length} newer commits read, through ${listingHistory.through}`);
  if (newer.length > 30)
    console.warn(
      `listing history: ${newer.length} commits were made since scripts/listing-history.json was built. ` +
        'Run node scripts/listing-history.mjs --update and commit the file, so later builds read fewer.'
    );
} catch (error) {
  console.warn(
    `listing history: the commits after ${listingHistory.through} could not be read, so the leaderboard dates the days after it. ${error.message}`
  );
}

const offers = await loadCatalog();
console.log(`catalog: ${offers.length} visuals`);
const leaderboard = parseCsv(await (await get(LEADERBOARD_URL)).text()).map((r) => {
  // The time is kept as the crawl wrote it, without its zone.
  const stamp = r['Snapshot Date'].slice(0, 19);
  return {
    guid: r['Visual GUID'],
    stamp: `${stamp}.000`,
    ms: Date.parse(`${stamp}Z`),
    name: r.Name.trimEnd(),
    publisher: r.Publisher.trimEnd(),
    version: r.Version.trimEnd(),
    popularity: number(r.Popularity),
    popularityChange: number(r['Popularity Change']),
    ratings: number(r['# of Ratings']),
    ratingsChange: number(r['# of Ratings Change']),
    average: number(r['Average Rating']),
    certified: r['Is Certified'].trimEnd(),
    removed: r['Is Removed'] === 'Yes',
  };
});
console.log(`leaderboard: ${leaderboard.length} rows`);

// ── Catalog ────────────────────────────────────────────────────────────────
const visuals = offers.map((o) => {
  const categories = (o.categoryIds ?? []).join(',');
  const rating = o.enrichedData?.rating?.all;
  return {
    id: o.id,
    guid: text(o.powerBIVisualId),
    thumbnail: text(o.iconFileUris?.small),
    releaseDate: o.bigCatLastModifiedDate
      ? `${new Date(o.bigCatLastModifiedDate).toISOString().slice(0, 10)}T00:00:00.000`
      : null,
    row: [
      text(o.displayName),
      text(o.publisherDisplayName),
      text(o.offerVersion),
      text(o.summary),
      categories,
    ],
    popularity: number(o.enrichedData?.popularity?.appSourceApps),
    ratings: number(rating?.totalRatings),
    average: number(rating?.averageRating),
    certified: categories.includes('PowerBICertified'),
    freePlans: o.hasFreePlans ?? null,
    download: text(o.downloadLink),
    stars: rating?.starsDistribution ?? {},
    offer: o,
  };
});

const catalog = table(
  [
    column('[ID]', 'String'),
    column('[Visual GUID]', 'String'),
    column('[Title]', 'String'),
    column('[Publisher]', 'String'),
    column('[Version]', 'String'),
    column('[Description]', 'String'),
    column('[Categories]', 'String'),
    column('[Thumbnail]', 'String'),
    column('[Popularity]', 'Double'),
    column('[Ratings]', 'Int64'),
    column('[Average Rating]', 'Double'),
    column('[Release Date]', 'DateTime'),
    column('[Certified]', 'Boolean'),
    column('[Free Plans]', 'Boolean'),
    column('[Link]', 'String'),
    column('[Download Visual]', 'String'),
  ],
  visuals.map((v) => [
    v.id,
    v.guid,
    ...v.row,
    v.thumbnail,
    v.popularity,
    v.ratings,
    v.average,
    v.releaseDate,
    v.certified,
    v.freePlans,
    `https://appsource.microsoft.com/en-us/product/power-bi-visuals/${v.id}`,
    v.download,
  ])
);

const STARS = [
  ['five', '5 Stars'],
  ['four', '4 Stars'],
  ['three', '3 Stars'],
  ['two', '2 Stars'],
  ['one', '1 Star'],
];
const stars = table(
  [column('[ID]', 'String'), column('[Stars]', 'String'), column('[Raters]', 'Int64')],
  visuals.flatMap((v) =>
    STARS.filter(([key]) => v.stars[key] > 0).map(([key, label]) => [v.id, label, v.stars[key]])
  )
);

// ── Leaderboard standings ──────────────────────────────────────────────────
const byGuid = new Map();
for (const row of leaderboard) {
  if (!byGuid.has(row.guid)) byGuid.set(row.guid, []);
  byGuid.get(row.guid).push(row);
}
const catalogByGuid = new Map(visuals.filter((v) => v.guid).map((v) => [v.guid, v]));
const asOf = Math.max(...leaderboard.map((r) => r.ms));
const asOfStamp = leaderboard.find((r) => r.ms === asOf).stamp;

/** The movement inside a window: the sum of the changes logged in it, or nothing when none was logged. */
function change(rows, field, days) {
  const values = rows
    .filter((r) => r.ms > asOf - days * DAY && r[field] != null)
    .map((r) => r[field]);
  return values.length ? values.reduce((a, b) => a + b, 0) : null;
}

const standings = table(
  [
    column('Leaderboard[Visual GUID]', 'String'),
    column('[Name]', 'String'),
    column('[Publisher]', 'String'),
    column('[Version]', 'String'),
    column('[Popularity]', 'Double'),
    column('[Ratings]', 'Int64'),
    column('[Average Rating]', 'Double'),
    column('[Certified]', 'String'),
    column('[Removed]', 'Boolean'),
    column('[Catalog ID]', 'String'),
    column('[Thumbnail]', 'String'),
    column('[Release Date]', 'DateTime'),
    column('[Last Change]', 'DateTime'),
    column('[First Seen]', 'DateTime'),
    column('[As Of]', 'DateTime'),
    column('[Popularity Change 7d]', 'Double'),
    column('[Popularity Change 30d]', 'Double'),
    column('[Popularity Change 90d]', 'Double'),
    column('[Ratings Change 7d]', 'Int64'),
    column('[Ratings Change 30d]', 'Int64'),
    column('[Ratings Change 90d]', 'Int64'),
  ],
  [
    ...[...byGuid].map(([guid, rows]) => {
      const last = Math.max(...rows.map((r) => r.ms));
      // The latest row is the visual's current state.
      const latest = rows
        .filter((r) => r.ms === last)
        .reduce((a, b) => ((b.popularity ?? -1) > (a.popularity ?? -1) ? b : a));
      const first = rows.reduce((a, b) => (b.ms < a.ms ? b : a));
      const listed = catalogByGuid.get(guid);
      return [
        guid,
        latest.name,
        latest.publisher,
        latest.version,
        latest.popularity,
        latest.ratings,
        latest.average,
        latest.certified,
        latest.removed,
        listed?.id ?? null,
        listed?.thumbnail ?? null,
        listed?.releaseDate ?? null,
        latest.stamp,
        first.stamp,
        asOfStamp,
        change(rows, 'popularityChange', 7),
        change(rows, 'popularityChange', 30),
        change(rows, 'popularityChange', 90),
        change(rows, 'ratingsChange', 7),
        change(rows, 'ratingsChange', 30),
        change(rows, 'ratingsChange', 90),
      ];
    }),
    // A visual that left before the leaderboard could record it has no row in
    // it. It is named here so the Replay page can show who it was. Its
    // first-seen date is left empty, so the leaderboard still dates its own
    // start correctly. A visual listed today that the leaderboard has not yet
    // recorded is named by the catalog instead.
    ...[...listingHistory.visuals]
      .filter(([guid, v]) => !byGuid.has(guid) && !openStretch(v))
      .map(([guid, v]) => {
        const gone = v.listed[v.listed.length - 1][1];
        const listed = catalogByGuid.get(guid);
        return [
          guid,
          v.name,
          v.publisher,
          v.last[0] || null,
          null,
          null,
          null,
          v.last[1] ? 'Certified' : 'Not Certified',
          true,
          listed?.id ?? null,
          listed?.thumbnail ?? null,
          listed?.releaseDate ?? null,
          `${gone}T00:00:00.000`,
          null,
          asOfStamp,
          null,
          null,
          null,
          null,
          null,
          null,
        ];
      }),
  ]
);

// ── Replay ─────────────────────────────────────────────────────────────────
// One row per visual and day on which something was recorded about it:
//   Day         days before the latest leaderboard snapshot, which is day 0
//   Popularity  the popularity read that day, empty when none was read
//   Raters      the number of ratings read with it
//   Stars       the average stars read with it
//   Listing     listed at the end of the day (1) + a new version that day (2)
//               + certified at the end of the day (4)
// A visual's Listing holds until its next row. Which visuals were listed, and
// when they changed, comes from the commits of "Visuals Summary.csv", which list
// every visual on each day they were made. The leaderboard records a visual only
// when its figures change, so it sees many arrivals and versions weeks late, and
// it dates them only on the days after the newest of those commits. The figures
// come from the leaderboard alone. When it read a visual more than once in a day
// the latest reading counts, and a popularity of 0 is a failed crawl, so it is
// never written as a reading.
const asOfDay = dayOf(asOfStamp);
const throughDay = listingHistory.through ? dayOf(listingHistory.through) : -Infinity;

// Each visual's stretches as [from, to, certified] day numbers, and the days of
// its new versions and its certification.
const timelines = new Map();
for (const [guid, v] of listingHistory.visuals)
  timelines.set(guid, {
    listed: v.listed.map(([from, to, certified]) => [dayOf(from), to == null ? null : dayOf(to), certified]),
    versions: v.versions.map(dayOf),
    certified: v.certified.map(dayOf),
    version: v.last?.[0] || null,
    known: true,
  });
const listedOn = (t, day) => t.listed.some(([from, to]) => from <= day && (to == null || day < to));
const certifiedOn = (t, day) =>
  t.listed.some(([from, , certified]) => certified === 1 && from <= day) || t.certified.some((d) => d <= day);

// After the newest commit, the leaderboard: a removal ends a stretch, a visual
// it shows for the first time arrives, and a version or a certification it
// records is dated by its crawl. A visual the commits saw leave stays gone,
// since the leaderboard is often late to record a removal.
for (const [guid, rows] of byGuid) {
  let t = timelines.get(guid);
  for (const r of [...rows].sort((a, b) => a.ms - b.ms)) {
    const day = dayOf(r.stamp);
    if (day <= throughDay) continue;
    if (!t) {
      if (r.removed) continue;
      t = { listed: [], versions: [], certified: [], version: null, known: false };
      timelines.set(guid, t);
    }
    const last = t.listed[t.listed.length - 1];
    const open = last != null && last[1] == null;
    if (r.removed) {
      if (open) last[1] = day;
      continue;
    }
    if (open) {
      if (r.version && t.version && r.version !== t.version) t.versions.push(day);
      if (r.certified === 'Certified' && !certifiedOn(t, day)) t.certified.push(day);
    } else if (!t.known) t.listed.push([day, null, r.certified === 'Certified' ? 1 : 0]);
    if (r.version) t.version = r.version;
  }
}

const readings = new Map();
for (const r of leaderboard) {
  if (r.removed || !(r.popularity > 0)) continue;
  const day = dayOf(r.stamp);
  if (!readings.has(r.guid)) readings.set(r.guid, new Map());
  const days = readings.get(r.guid);
  const held = days.get(day);
  if (!held || r.ms > held.ms || (r.ms === held.ms && r.popularity > held.popularity)) days.set(day, r);
}

let late = 0;
const replayRows = [];
for (const [guid, t] of timelines) {
  const read = readings.get(guid) ?? new Map();
  const days = new Set([...read.keys(), ...t.versions, ...t.certified]);
  for (const [from, to] of t.listed) {
    days.add(from);
    if (to != null) days.add(to);
  }
  for (const day of [...days].sort((a, b) => a - b)) {
    // A commit newer than the latest leaderboard snapshot waits for the next one.
    if (day > asOfDay) {
      late++;
      continue;
    }
    const r = read.get(day);
    replayRows.push([
      guid,
      asOfDay - day,
      r?.popularity ?? null,
      r?.ratings ?? null,
      r?.average ?? null,
      (listedOn(t, day) ? 1 : 0) + (t.versions.includes(day) ? 2 : 0) + (certifiedOn(t, day) ? 4 : 0),
    ]);
  }
}
const unlisted = [...readings.keys()].filter((guid) => !timelines.has(guid)).length;
console.log(
  `replay: from ${isoOf(asOfDay - replayRows.reduce((most, r) => Math.max(most, r[1]), 0))} to ${isoOf(asOfDay)}; ` +
    `${late} changes after it wait for the next leaderboard snapshot; ` +
    `${unlisted} visuals have readings but were never listed`
);

const replay = table(
  [
    column('[Visual]', 'String'),
    column('[Day]', 'Int64'),
    column('[Popularity]', 'Double'),
    column('[Raters]', 'Int64'),
    column('[Stars]', 'Double'),
    column('[Listing]', 'Int64'),
  ],
  // Each visual's rows together, oldest first, so its name repeats on
  // neighbouring rows and the served file compresses to a quarter of the size.
  replayRows.sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : b[1] - a[1]))
);

// ── Per-visual files ───────────────────────────────────────────────────────
/** The greatest of some texts, compared without regard to case. */
const greatest = (values) =>
  values.reduce(
    (a, b) => (a == null || b.localeCompare(a, 'en', { sensitivity: 'accent' }) > 0 ? b : a),
    null
  );

const profile = {
  columns: [
    column('[Long Summary]', 'String'),
    column('[Download Sample]', 'String'),
    column('[Support Link]', 'String'),
    column('[Privacy Policy]', 'String'),
    column('[Legal Terms]', 'String'),
    column('[Video]', 'String'),
    column('[Video Preview]', 'String'),
  ],
  rows: visuals.map((v) => {
    const videos = (v.offer.videos ?? []).filter((video) => video.uri);
    return [
      v.id,
      [
        text(v.offer.longSummary),
        text(v.offer.downloadSampleLink),
        text(v.offer.supportUri),
        text(v.offer.privacyPolicyUri),
        text(v.offer.legalTermsUri),
        greatest(videos.map((video) => video.uri)),
        greatest(videos.map((video) => video.previewImage?.uri).filter(Boolean)),
      ],
    ];
  }),
};

const screenshots = {
  columns: [column('[Screenshot]', 'Double'), column('[Url]', 'String')],
  rows: visuals.flatMap((v) =>
    (v.offer.images ?? [])
      .flatMap((group) => group.items ?? [])
      .filter((image) => image.type === 'screenshot')
      .map((image) => [Number(image.id.replace('screenshot', '')) + 1, text(image.uri)])
      .sort((a, b) => a[0] - b[0])
      .map((row) => [v.id, row])
  ),
};

// A popularity of 0 between two real values is a failed crawl, so those rows
// are left out and the line holds its last value.
const history = {
  columns: [
    column('[Snapshot Date]', 'DateTime'),
    column('[Popularity]', 'Double'),
    column('[Ratings]', 'Int64'),
  ],
  rows: leaderboard
    .filter((r) => !r.removed && r.popularity > 0)
    .sort((a, b) => a.ms - b.ms)
    .map((r) => [r.guid, [r.stamp, r.popularity, r.ratings]]),
};

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
for (const [name, result] of Object.entries({ catalog, stars, standings, replay })) {
  writeFileSync(join(out, `${name}.json`), JSON.stringify(result));
  console.log(`${name}: ${result.table.rows.length} rows`);
}
for (const [name, { columns, rows }] of Object.entries({ profile, screenshots, history })) {
  const buckets = Array.from({ length: BUCKETS }, () => ({}));
  for (const [key, row] of rows) (buckets[bucketOf(key)][key] ??= []).push(row);
  buckets.forEach((bucket, i) =>
    writeFileSync(join(out, `${name}-${i}.json`), JSON.stringify({ columns, rows: bucket }))
  );
  console.log(`${name}: ${rows.length} rows`);
}
writeFileSync(
  join(out, 'built.json'),
  JSON.stringify({ asOf: asOfStamp, builtAt: new Date().toISOString(), format: DATA_FORMAT })
);
console.log(`Data written to ${out}`);
