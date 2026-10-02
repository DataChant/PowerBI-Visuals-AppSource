import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useLayoutEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';

import { formatInt, formatScore } from '@/lib/format';
import {
  canvasMeasure,
  layoutCloud,
  POPULARITY_TIERS,
  popularityTier,
  type CloudWord,
} from '@/lib/word-cloud';

/** Each word's place among the shown words by the popularity of the visuals using it, 0 to 1. */
function popularityRanks(words: CloudWord[]): Map<string, number> {
  const sorted = [...words].sort((a, b) => a.popularity - b.popularity);
  const ranks = new Map<string, number>();
  sorted.forEach((w, i) => ranks.set(w.word, sorted.length > 1 ? i / (sorted.length - 1) : 1));
  return ranks;
}

export function WordCloud({
  words,
  selected,
  onSelect,
}: {
  words: CloudWord[];
  selected: string | null;
  onSelect: (word: string | null) => void;
}) {
  const host = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [fontsReady, setFontsReady] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const reduceMotion = useReducedMotion();

  useLayoutEffect(() => {
    const el = host.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setWidth(Math.round(entry.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    let live = true;
    document.fonts?.ready.then(() => live && setFontsReady(true));
    return () => {
      live = false;
    };
  }, []);

  const measure = useMemo(
    () =>
      canvasMeasure(
        typeof document === 'undefined' ? '' : getComputedStyle(document.documentElement).getPropertyValue('--font-heading').trim(),
        fontsReady ? 1 : 0
      ),
    [fontsReady]
  );
  const phone = width > 0 && width < 560;
  const height = phone ? Math.round(width * 1.15) : Math.round(Math.min(560, Math.max(360, width * 0.56)));
  const shown = useMemo(() => (phone ? words.slice(0, 45) : words), [words, phone]);
  const placed = useMemo(
    () => (width > 0 ? layoutCloud(shown, width, height, measure) : []),
    [shown, width, height, measure]
  );
  const byWord = useMemo(() => new Map(words.map((w) => [w.word, w])), [words]);
  const ranks = useMemo(() => popularityRanks(shown), [shown]);
  const focus = hovered ?? selected;
  const caption = focus ? byWord.get(focus) : undefined;

  const onKey = (e: KeyboardEvent, word: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(selected === word ? null : word);
    }
  };

  return (
    <div className="flex flex-col gap-300">
      <div ref={host} className="relative w-full select-none" style={{ height: height || 360 }}>
        {width > 0 && (
          <svg
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            role="group"
            aria-label="Word cloud of the visual descriptions"
            className="overflow-visible"
            onClick={(e) => {
              if (e.target === e.currentTarget) onSelect(null);
            }}
          >
            {placed.map((p, i) => {
              const w = byWord.get(p.word);
              const dim = focus != null && focus !== p.word;
              const isSelected = selected === p.word;
              return (
                <motion.g
                  key={p.word}
                  data-word={p.word}
                  initial={reduceMotion ? false : { opacity: 0, scale: 0.3, x: p.x, y: p.y }}
                  animate={{ opacity: dim ? 0.22 : 1, scale: focus === p.word ? 1.08 : 1, x: p.x, y: p.y }}
                  transition={
                    reduceMotion
                      ? { duration: 0 }
                      : {
                          x: { type: 'spring', stiffness: 120, damping: 20 },
                          y: { type: 'spring', stiffness: 120, damping: 20 },
                          opacity: { duration: 0.35, delay: dim || focus ? 0 : Math.min(i * 0.018, 1.1) },
                          scale: { type: 'spring', stiffness: 260, damping: 18, delay: focus ? 0 : Math.min(i * 0.018, 1.1) },
                        }
                  }
                  role="button"
                  tabIndex={0}
                  aria-pressed={isSelected}
                  aria-label={`${p.word}, ${formatInt(w?.count)} ${w?.count === 1 ? 'visual' : 'visuals'}`}
                  className="cursor-pointer outline-none"
                  onPointerEnter={() => setHovered(p.word)}
                  onPointerLeave={() => setHovered((h) => (h === p.word ? null : h))}
                  onFocus={() => setHovered(p.word)}
                  onBlur={() => setHovered((h) => (h === p.word ? null : h))}
                  onClick={() => onSelect(isSelected ? null : p.word)}
                  onKeyDown={(e) => onKey(e, p.word)}
                >
                  <g transform={p.vertical ? 'rotate(-90)' : undefined}>
                    <text
                      y={p.baseline}
                      textAnchor="middle"
                      fontSize={p.size}
                      fontWeight={p.weight}
                      className="font-heading"
                      style={{ fill: POPULARITY_TIERS[popularityTier(ranks.get(p.word) ?? 0)].color, letterSpacing: p.size > 40 ? '-0.02em' : undefined }}
                    >
                      {p.word}
                    </text>
                    {isSelected && (
                      <rect
                        x={-p.width / 2 - 6}
                        y={p.baseline + p.size * 0.12}
                        width={p.width + 12}
                        height={Math.max(2, p.size * 0.07)}
                        rx={2}
                        style={{ fill: 'var(--color-pbi)' }}
                      />
                    )}
                  </g>
                </motion.g>
              );
            })}
          </svg>
        )}
      </div>
      <div className="flex flex-col items-center gap-200 text-200 text-muted-foreground xl:flex-row xl:justify-between">
        <p aria-live="polite" className="min-h-[1.5em] text-center xl:text-left">
          {caption ? (
            <>
              <span className="font-semibold text-foreground">{caption.word}</span> appears in{' '}
              {formatInt(caption.count)} {caption.count === 1 ? 'visual' : 'visuals'}, whose average popularity is{' '}
              {formatScore(caption.popularity)}.
            </>
          ) : (
            'Point at a word to see how many visuals use it, and select it to list them.'
          )}
        </p>
        <PopularityLegend />
      </div>
    </div>
  );
}

function PopularityLegend() {
  return (
    <div className="flex shrink-0 flex-wrap items-center justify-center gap-x-300 gap-y-100">
      <span>Colour shows how popular the visuals using a word are:</span>
      {POPULARITY_TIERS.map((t) => (
        <span key={t.label} className="inline-flex items-center gap-100">
          <span className="size-[10px] rounded-full" style={{ background: t.color }} aria-hidden />
          {t.label}
        </span>
      ))}
    </div>
  );
}
