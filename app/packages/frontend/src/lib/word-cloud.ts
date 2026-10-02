import type { CatalogVisual } from '@/lib/catalog';

const STOPWORDS = new Set(
  `a about above across after again all also an and any are as at available be because been
  before being below between both but by can could did directly do does doing down during
  each every few for from further get gets had has have having here how i if in include
  includes including into is it its itself just let lets like make makes many more most much
  my need needs no nor not now of off on once only or other our out over own provide provides
  same see show shows simple simply so some such than that the their them then there these
  they this those through to too under until up use used uses using various very via want
  was we were what when where which while who whom why will with within without would you
  your power bi visual visuals powerbi custom report reports data based one two allows easy
  easily also new help helps different create creates display displays way well`
    .split(/\s+/)
    .filter(Boolean)
);

/** Words that end in "s" without being plurals. */
const NOT_PLURAL = new Set(['series', 'analysis', 'axis', 'canvas', 'status', 'process', 'news', 'gauss']);

/**
 * The key two spellings of one word share, so "chart" and "charts" or
 * "category" and "categories" are counted together. It is never shown.
 */
export function wordKey(word: string): string {
  if (word === 'kpis') return 'kpi';
  if (NOT_PLURAL.has(word) || word.length < 4) return word;
  if (word.endsWith('ies') && word.length > 4) return `${word.slice(0, -3)}y`;
  if (/(s|x|z|ch|sh)es$/.test(word)) return word.slice(0, -2);
  if (word.endsWith('s') && !/(ss|us|is)$/.test(word)) return word.slice(0, -1);
  return word;
}

export interface CloudWord {
  /** The spelling most descriptions use. */
  word: string;
  /** How many visuals mention it. */
  count: number;
  /** The visuals that mention it, most popular first. */
  visuals: CatalogVisual[];
  /** The average popularity of those visuals, 0 to 1. */
  popularity: number;
}

/** The most frequent meaningful words across the visuals' descriptions. */
export function cloudWords(visuals: CatalogVisual[], limit = 70): CloudWord[] {
  const groups = new Map<string, { spellings: Map<string, number>; visuals: CatalogVisual[] }>();
  for (const v of visuals) {
    // A word counts once per visual, so one repetitive description cannot dominate.
    const seen = new Map<string, string>();
    for (const raw of v.description.toLowerCase().split(/[^\p{L}\p{N}-]+/u)) {
      const w = raw.replace(/^-+|-+$/g, '');
      if (w.length <= 2 || STOPWORDS.has(w) || /^\d+$/.test(w)) continue;
      const key = wordKey(w);
      if (!seen.has(key)) seen.set(key, w);
    }
    for (const [key, spelling] of seen) {
      let g = groups.get(key);
      if (!g) groups.set(key, (g = { spellings: new Map(), visuals: [] }));
      g.spellings.set(spelling, (g.spellings.get(spelling) ?? 0) + 1);
      g.visuals.push(v);
    }
  }
  return [...groups.values()]
    .map(({ spellings, visuals: vs }) => ({
      word: [...spellings.entries()].sort((a, b) => b[1] - a[1] || a[0].length - b[0].length)[0][0],
      count: vs.length,
      visuals: [...vs].sort((a, b) => b.popularity - a.popularity),
      popularity: vs.reduce((s, v) => s + v.popularity, 0) / vs.length,
    }))
    .sort((a, b) => b.count - a.count || a.word.localeCompare(b.word))
    .slice(0, limit);
}

export interface Measured {
  width: number;
  /** Distance from the baseline to the top of the tallest letter. */
  ascent: number;
  /** Distance from the baseline to the bottom of the lowest letter. */
  descent: number;
}

export type Measure = (text: string, size: number, weight: number) => Measured;

export interface PlacedWord {
  word: string;
  size: number;
  weight: number;
  vertical: boolean;
  /** Length of the word's text, before any turn. */
  width: number;
  /** Centre of the word's box. */
  x: number;
  y: number;
  /** Where the baseline sits below the box centre, before any turn. */
  baseline: number;
}

/** A stable small number per word, so the cloud looks the same on every visit. */
function hash(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 16777619);
  return h >>> 0;
}

export function fontWeight(rank: number, total: number): number {
  if (rank < 3) return 800;
  return rank < total * 0.35 ? 700 : 600;
}

interface Box {
  l: number;
  t: number;
  r: number;
  b: number;
}

/**
 * Packs the words into a width by height box, largest first, each one
 * spiralling out from the centre until it finds room. Returns null when a
 * word could not be placed, so the caller can try again with smaller type.
 */
function pack(
  words: { word: string; count: number }[],
  width: number,
  height: number,
  sizeFor: (count: number) => number,
  measure: Measure
): PlacedWord[] | null {
  const placed: PlacedWord[] = [];
  const boxes: Box[] = [];
  const pad = Math.max(2, width / 300);
  const aspect = width / height;
  const step = Math.max(1.5, Math.min(width, height) / 220);
  for (let i = 0; i < words.length; i++) {
    const { word, count } = words[i];
    const size = sizeFor(count);
    const weight = fontWeight(i, words.length);
    const h = hash(word);
    // The three biggest words stay level so the cloud reads at a glance.
    const vertical = i >= 3 && h % 4 === 0;
    const m = measure(word, size, weight);
    const boxW = (vertical ? m.ascent + m.descent : m.width) + pad * 2;
    const boxH = (vertical ? m.width : m.ascent + m.descent) + pad * 2;
    if (boxW > width || boxH > height) return null;
    const start = ((h % 360) * Math.PI) / 180;
    const maxR = Math.hypot(width, height) / 2;
    let found: Box | null = null;
    for (let t = 0; ; t += 0.08) {
      const r = step * t;
      if (r > maxR) break;
      const cx = width / 2 + r * Math.cos(t + start) * Math.sqrt(aspect);
      const cy = height / 2 + (r * Math.sin(t + start)) / Math.sqrt(aspect);
      const box = { l: cx - boxW / 2, t: cy - boxH / 2, r: cx + boxW / 2, b: cy + boxH / 2 };
      if (box.l < 0 || box.t < 0 || box.r > width || box.b > height) continue;
      if (boxes.some((o) => box.l < o.r && box.r > o.l && box.t < o.b && box.b > o.t)) continue;
      found = box;
      break;
    }
    if (!found) return null;
    boxes.push(found);
    placed.push({
      word,
      size,
      weight,
      vertical,
      width: m.width,
      x: (found.l + found.r) / 2,
      y: (found.t + found.b) / 2,
      baseline: (m.ascent - m.descent) / 2,
    });
  }
  return placed;
}

/**
 * Lays the words out as a cloud. Type size follows the square root of the
 * count, so a word mentioned four times as often is drawn twice as tall.
 * When the words do not fit, the type shrinks until they do; if even the
 * smallest type is too big, the least mentioned words are left out.
 */
export function layoutCloud(
  words: { word: string; count: number }[],
  width: number,
  height: number,
  measure: Measure
): PlacedWord[] {
  if (words.length === 0 || width <= 0 || height <= 0) return [];
  const counts = words.map((w) => w.count);
  const max = Math.max(...counts);
  const min = Math.min(...counts);
  const span = Math.sqrt(max) - Math.sqrt(min);
  const short = Math.min(width, height * 1.6);
  // Start large and shrink, so the cloud fills its space whatever its size.
  let largest = Math.min(150, Math.max(36, short * 0.22));
  const smallest = Math.min(15, Math.max(11, short * 0.018));
  let list = words;
  for (let attempt = 0; attempt < 40; attempt++) {
    const big = largest;
    const sizeFor = (c: number) =>
      span === 0 ? (big + smallest) / 2 : smallest + ((Math.sqrt(c) - Math.sqrt(min)) / span) * (big - smallest);
    const placed = pack(list, width, height, sizeFor, measure);
    if (placed) return placed;
    if (largest > smallest * 1.8) largest *= 0.94;
    else list = list.slice(0, Math.max(1, Math.floor(list.length * 0.9)));
  }
  return [];
}

/**
 * Measures text the way the browser will draw it. The fonts version only
 * tells callers to build a new measurer once the web fonts have loaded.
 */
export function canvasMeasure(family: string, fontsVersion = 0): Measure {
  void fontsVersion;
  const ctx = typeof document === 'undefined' ? null : document.createElement('canvas').getContext('2d');
  return (text, size, weight) => {
    if (!ctx) return { width: text.length * size * 0.56, ascent: size * 0.74, descent: size * 0.22 };
    ctx.font = `${weight} ${size}px ${family || 'sans-serif'}`;
    const m = ctx.measureText(text);
    return {
      width: m.width,
      ascent: m.actualBoundingBoxAscent || size * 0.74,
      descent: m.actualBoundingBoxDescent || size * 0.22,
    };
  };
}

/** The three colour tiers, from the words of the least popular visuals to the most popular. */
export const POPULARITY_TIERS = [
  { label: 'Less popular', color: 'var(--color-muted-foreground)' },
  { label: 'Middle', color: 'var(--color-foreground)' },
  { label: 'Most popular', color: 'var(--color-brand-foreground)' },
] as const;

/** A word's tier from its place among the shown words, 0 to 1, by the popularity of its visuals. */
export function popularityTier(t: number): number {
  return t >= 2 / 3 ? 2 : t >= 1 / 3 ? 1 : 0;
}
