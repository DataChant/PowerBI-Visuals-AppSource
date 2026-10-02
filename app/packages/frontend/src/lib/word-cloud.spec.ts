import { describe, expect, it } from 'vitest';

import type { CatalogVisual } from '@/lib/catalog';
import { cloudWords, layoutCloud, wordKey, type Measure } from '@/lib/word-cloud';

function visual(id: string, description: string, popularity = 0.5): CatalogVisual {
  return {
    id,
    guid: id,
    title: id,
    publisher: 'P',
    version: '1',
    description,
    categories: [],
    thumbnail: '',
    popularity,
    ratings: 0,
    averageRating: 0,
    releaseDate: null,
    releaseYear: null,
    certified: false,
    freePlans: false,
    link: '',
    download: '',
  };
}

const measure: Measure = (text, size) => ({ width: text.length * size * 0.55, ascent: size * 0.7, descent: size * 0.2 });

describe('wordKey', () => {
  it('folds plurals onto one key', () => {
    expect(wordKey('charts')).toBe(wordKey('chart'));
    expect(wordKey('categories')).toBe(wordKey('category'));
    expect(wordKey('boxes')).toBe(wordKey('box'));
    expect(wordKey('kpis')).toBe(wordKey('kpi'));
  });
  it('leaves words that only look plural alone', () => {
    expect(wordKey('analysis')).toBe('analysis');
    expect(wordKey('process')).toBe('process');
    expect(wordKey('series')).toBe('series');
  });
});

describe('cloudWords', () => {
  it('counts each word once per visual and merges its spellings', () => {
    const words = cloudWords([
      visual('a', 'Chart chart charts for the report', 0.9),
      visual('b', 'A gantt chart', 0.1),
      visual('c', 'Many charts', 0.5),
    ]);
    const chart = words.find((w) => w.word === 'chart' || w.word === 'charts');
    expect(chart?.count).toBe(3);
    expect(chart?.visuals.map((v) => v.id)).toEqual(['a', 'c', 'b']);
    expect(chart?.popularity).toBeCloseTo(0.5);
    expect(words[0]).toBe(chart);
    expect(words.find((w) => w.word === 'report')).toBeUndefined();
  });
  it('shows the spelling most descriptions use', () => {
    const words = cloudWords([visual('a', 'charts'), visual('b', 'charts'), visual('c', 'chart')]);
    expect(words[0].word).toBe('charts');
  });
});

describe('layoutCloud', () => {
  const words = Array.from({ length: 60 }, (_, i) => ({ word: `word${i}x`, count: 100 - i }));
  it('places every word inside the box without overlaps', () => {
    const placed = layoutCloud(words, 800, 450, measure);
    expect(placed).toHaveLength(60);
    const boxes = placed.map((p) => {
      const m = measure(p.word, p.size, p.weight);
      const w = p.vertical ? m.ascent + m.descent : m.width;
      const h = p.vertical ? m.width : m.ascent + m.descent;
      return { l: p.x - w / 2, r: p.x + w / 2, t: p.y - h / 2, b: p.y + h / 2 };
    });
    for (const b of boxes) {
      expect(b.l).toBeGreaterThanOrEqual(0);
      expect(b.r).toBeLessThanOrEqual(800);
      expect(b.t).toBeGreaterThanOrEqual(0);
      expect(b.b).toBeLessThanOrEqual(450);
    }
    for (let i = 0; i < boxes.length; i++)
      for (let j = i + 1; j < boxes.length; j++) {
        const a = boxes[i];
        const c = boxes[j];
        expect(a.l < c.r && a.r > c.l && a.t < c.b && a.b > c.t).toBe(false);
      }
  });
  it('draws the most mentioned word largest, level and near the middle', () => {
    const placed = layoutCloud(words, 800, 450, measure);
    expect(placed[0].size).toBe(Math.max(...placed.map((p) => p.size)));
    expect(placed[0].vertical).toBe(false);
    expect(Math.abs(placed[0].x - 400)).toBeLessThan(120);
    expect(Math.abs(placed[0].y - 225)).toBeLessThan(80);
  });
  it('shrinks the type to fit a small box', () => {
    const wide = layoutCloud(words, 800, 450, measure);
    const narrow = layoutCloud(words, 320, 360, measure);
    expect(narrow.length).toBeGreaterThan(0);
    expect(narrow[0].size).toBeLessThan(wide[0].size);
  });
});
