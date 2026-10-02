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
// The leaderboard begins on 24 July 2025. What the repository recorded before
// that is read from scripts/listing-history.json, which listing-history.mjs
// built once from the older commits of "Visuals Summary.csv".
//
// Whole-catalog files are written as they are. Per-visual files are split into
// buckets, so opening one visual downloads a small file rather than everything.
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const CATALOG_URL =
  "https://catalogapi.azure.com/offers?api-version=2018-08-01-beta&storefront=appsource&$filter=offerType eq 'PowerBIVisuals'";
// A GitHub Actions run reads the file from the repository it runs in, so the
// site keeps building if the repository is renamed or forked.
const REPOSITORY = process.env.GITHUB_REPOSITORY || 'DataChant/PowerBI-Visuals-Marketplace';
const LEADERBOARD_URL = `https://raw.githubusercontent.com/${REPOSITORY}/refs/heads/main/leaderboard_data.csv`;

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'packages/frontend/public/snapshot');

/** Keep in step with `bucketOf` in packages/frontend/src/lib/snapshot.ts. */
const BUCKETS = 64;
function bucketOf(key) {
  let sum = 0;
  for (let i = 0; i < key.length; i++) sum += key.charCodeAt(i);
  return sum % BUCKETS;
}

async function get(url) {
  for (let attempt = 1; ; attempt++) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`${response.status} from ${url}`);
      return response;
    } catch (error) {
      if (attempt === 4) throw error;
      await new Promise((resolve) => setTimeout(resolve, attempt * 2000));
    }
  }
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

/** A CSV parser for quoted fields, which visual and publisher names need. */
function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;
  for (let i = text.charCodeAt(0) === 0xfeff ? 1 : 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c !== '"') field += c;
      else if (text[i + 1] === '"') (field += '"'), i++;
      else quoted = false;
    } else if (c === '"') quoted = true;
    else if (c === ',') row.push(field), (field = '');
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(field), rows.push(row), (row = []), (field = '');
    } else field += c;
  }
  if (field || row.length) row.push(field), rows.push(row);
  const [header, ...body] = rows;
  return body
    .filter((r) => r.length === header.length)
    .map((r) => Object.fromEntries(header.map((h, i) => [h, r[i]])));
}

// Trailing spaces are dropped, as AppSource listings often carry them.
const text = (value) => (value == null || value === '' ? null : String(value).trimEnd());
const number = (value) => (value == null || value === '' ? null : Number(value));
const column = (name, dataType) => ({ name, dataType });
const table = (columns, rows) => ({ status: 'success', table: { columns, rows } });

const DAY = 86400000;
/** The whole-day number of a date and time, counted the way the replay packs it. */
const dayNumber = (ms) => Math.floor(ms / DAY) + 25569;

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
const listingHistory = JSON.parse(readFileSync(join(root, 'scripts/listing-history.json'), 'utf8'));

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
    // A visual that left before the leaderboard began has no row in it. It is
    // named here so the Replay page can show who it was. Its first-seen date is
    // left empty, so the leaderboard still dates its own start correctly.
    ...Object.entries(listingHistory.visuals)
      .filter(([guid]) => !byGuid.has(guid))
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
          `${listingHistory.snapshots[gone ?? listingHistory.snapshots.length - 1].slice(0, 19)}.000`,
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
// One row per visual and week in which something was recorded about it. The
// figures are those of the latest day in that week. The day is packed in front
// of each value so one number carries both, and every packed number stays
// below 2^53:
//   Latest  = day * 10000  + popularity in thousandths * 2 + removed
//   Raters  = day * 100000 + number of ratings
//   Stars   = day * 1000   + average stars in hundredths
//   Listing = listed at the end of the week (1) + a new version that week (2)
//             + newly certified that week (4)
// A popularity of 0 is a failed crawl, so it is never written as a score, but
// its row still shows that the visual was listed. Raters and Stars are empty on
// a removal row, so a visual keeps its last real figures for the dot that fades
// out. Latest is empty on a row that records a listing, a version or a
// certification without a score, which is every row before the leaderboard
// began except those of 22 January 2024.
const asOfDay = dayNumber(asOf);
const weeks = new Map();
function weekOf(guid, ms) {
  const week = Math.floor((asOfDay - dayNumber(ms)) / 7);
  const key = `${guid}\u0000${week}`;
  let held = weeks.get(key);
  if (!held) weeks.set(key, (held = { guid, week, packed: [null, null, null], at: -Infinity, listed: false, flags: 0 }));
  return held;
}
/** The latest record in a week decides whether the visual ends that week listed. */
function setListed(held, ms, listed) {
  if (ms < held.at) return;
  held.at = ms;
  held.listed = listed;
}
function setScore(held, ms, popularity, ratings, average, removed) {
  const day = dayNumber(ms);
  [
    day * 10000 + Math.round((popularity ?? 0) * 1000) * 2 + (removed ? 1 : 0),
    removed || ratings == null ? null : day * 100000 + ratings,
    removed || average == null ? null : day * 1000 + Math.round(average * 100),
  ].forEach((value, i) => {
    if (value != null && (held.packed[i] == null || value > held.packed[i])) held.packed[i] = value;
  });
}

// Before the leaderboard: arrivals, departures, versions and certifications
// from every commit, and the scores of the one commit that carried them.
const historyTimes = listingHistory.snapshots.map((stamp) => Date.parse(stamp));
const leaderboardStart = Math.min(...leaderboard.map((r) => r.ms));
for (const [guid, v] of Object.entries(listingHistory.visuals)) {
  for (const [from, to] of v.listed) {
    setListed(weekOf(guid, historyTimes[from]), historyTimes[from], true);
    if (to != null) setListed(weekOf(guid, historyTimes[to]), historyTimes[to], false);
    // Listed in the last of those commits and never seen by the leaderboard:
    // it left in the week between the two.
    else if (!byGuid.has(guid)) setListed(weekOf(guid, leaderboardStart), leaderboardStart, false);
  }
  // A version, a certification or a score was read from a commit that listed the visual.
  const seen = (i) => {
    const held = weekOf(guid, historyTimes[i]);
    setListed(held, historyTimes[i], true);
    return held;
  };
  for (const i of v.versions) seen(i).flags |= 2;
  for (const i of v.certified) seen(i).flags |= 4;
  for (const [i, popularity, ratings, average] of v.scores)
    setScore(seen(i), historyTimes[i], popularity, ratings, average, false);
}

// From the leaderboard: every row shows the visual listed or removed that day.
for (const [guid, rows] of byGuid) {
  const before = listingHistory.visuals[guid]?.last;
  let version = before?.[0] || null;
  let certified = before ? before[1] === 1 : null;
  for (const r of [...rows].sort((a, b) => a.ms - b.ms)) {
    const held = weekOf(guid, r.ms);
    setListed(held, r.ms, !r.removed);
    if (r.version) {
      if (version && r.version !== version) held.flags |= 2;
      version = r.version;
    }
    if (r.certified) {
      if (r.certified === 'Certified' && certified === false) held.flags |= 4;
      certified = r.certified === 'Certified';
    }
    if (r.popularity > 0 || r.removed)
      setScore(held, r.ms, r.popularity, r.ratings, r.average, r.removed);
  }
}

const replay = table(
  [
    column('[Visual]', 'String'),
    column('[Week]', 'Int64'),
    column('[Latest]', 'Double'),
    column('[Raters]', 'Int64'),
    column('[Stars]', 'Double'),
    column('[Listing]', 'Int64'),
  ],
  [...weeks.values()]
    .sort((a, b) => b.week - a.week)
    .map((w) => [w.guid, w.week, ...w.packed, (w.listed ? 1 : 0) + w.flags])
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
writeFileSync(join(out, 'built.json'), JSON.stringify({ asOf: asOfStamp }));
console.log(`Data written to ${out}`);
