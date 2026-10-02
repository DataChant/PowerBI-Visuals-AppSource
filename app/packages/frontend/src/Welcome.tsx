//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
//        Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>
//-----------------------------------------------------------------------

import {
  Archive,
  Calculator,
  Database,
  MessageSquare,
  Palette,
  Pause,
  Play,
  Plug2,
  PanelTop,
  ShieldCheck,
} from 'lucide-react';
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ComponentType,
} from 'react';

import { FabricAppMark } from './FabricAppMark';
import {
  AREAS,
  describeChange,
  useSourceActivity,
  type ActivityChange,
  type AreaFamily,
  type SourceActivity,
} from './Welcome.activity';
import './Welcome.css';

const PHASES = [
  'Getting to know your idea',
  'Making a space for your work',
  'Bringing your data together',
  'Adding the finishing touches',
];
const AREA_ICONS = {
  screens: PanelTop,
  reads: Database,
  logic: Calculator,
  data: Archive,
  actions: ShieldCheck,
  connections: Plug2,
  styling: Palette,
};
export interface WelcomeCompanionProps {
  activity: SourceActivity | null;
  anchors: Partial<Record<AreaFamily, { x: number; y: number }>>;
  lane: number;
  phase: number;
  paused: boolean;
  reducedMotion: boolean;
  visible: boolean;
  onActiveChange: (change: ActivityChange | undefined) => void;
  onInteractionChange: (interacting: boolean) => void;
}

interface WelcomeProps {
  companion?: ComponentType<WelcomeCompanionProps>;
  companionName?: string;
  connecting?: boolean | { error?: string };
  // Tests and alternate transports can inject a feed directly. Passing `null`
  // forces the illustrative walkthrough; omitting it observes the dev feed.
  activity?: SourceActivity | null;
}

function AreaSketch({ family }: { family: AreaFamily }) {
  return (
    <div
      className={`app-welcome__area-sketch app-welcome__area-sketch-${family}`}
      aria-hidden="true"
    >
      <i />
      <i />
      <i />
      <i />
    </div>
  );
}

export function Welcome({
  companion: Companion,
  companionName,
  connecting,
  activity: activityOverride,
}: WelcomeProps) {
  const [reducedMotion, setReducedMotion] = useState(
    () =>
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
  );
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(() => !document.hidden);
  const [interacting, setInteracting] = useState(false);
  const [companionChange, setCompanionChange] = useState<ActivityChange>();
  const observed = useSourceActivity(visible && activityOverride === undefined);
  const activity = activityOverride !== undefined ? activityOverride : observed;
  const hasActivity = !!activity;
  const [mountedAt] = useState(() => globalThis.performance.now());
  const [elapsed, setElapsed] = useState(0);
  const [phase, setPhase] = useState(0);
  const phaseTime = useRef(0);
  const canvas = useRef<HTMLDivElement>(null);
  const [anchors, setAnchors] = useState<
    Partial<Record<AreaFamily, { x: number; y: number }>>
  >({});
  const [lane, setLane] = useState(0);
  const moving = !reducedMotion && !paused && visible && !interacting;
  const connectionError =
    typeof connecting === 'object' ? connecting.error : undefined;

  useEffect(() => {
    const onVisibility = () => {
      setVisible(!document.hidden);
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  useEffect(() => {
    const preference = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (!preference) return;
    const onPreference = () => setReducedMotion(preference.matches);
    onPreference();
    preference.addEventListener('change', onPreference);
    return () => preference.removeEventListener('change', onPreference);
  }, []);

  useLayoutEffect(() => {
    const board = canvas.current;
    if (!board) return;
    const measure = () => {
      const rect = board.getBoundingClientRect();
      const positions: Partial<Record<AreaFamily, { x: number; y: number }>> =
        {};
      for (const area of AREAS) {
        const tile = board.querySelector<HTMLElement>(
          `[data-family="${area.family}"]`
        );
        if (!tile) continue;
        const bounds = tile.getBoundingClientRect();
        positions[area.family] = {
          x: bounds.left - rect.left + bounds.width / 2 - 22,
          y: bounds.top - rect.top - 38,
        };
      }
      setAnchors(positions);
      setLane(rect.width - 38);
    };
    measure();
    const observer =
      typeof globalThis.ResizeObserver === 'undefined'
        ? null
        : new globalThis.ResizeObserver(measure);
    observer?.observe(board);
    window.addEventListener('resize', measure);
    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);

  useEffect(() => {
    const timer = window.setInterval(
      () =>
        setElapsed(
          Math.floor((globalThis.performance.now() - mountedAt) / 1000)
        ),
      1000
    );
    return () => window.clearInterval(timer);
  }, [mountedAt]);

  useEffect(() => {
    if (!moving || hasActivity) return;
    const started = globalThis.performance.now();
    const timer = window.setInterval(() => {
      setPhase(
        Math.floor(
          (phaseTime.current + globalThis.performance.now() - started) / 6000
        ) % PHASES.length
      );
    }, 250);
    return () => {
      phaseTime.current += globalThis.performance.now() - started;
      window.clearInterval(timer);
    };
  }, [moving, hasActivity]);

  const recent = activity?.changes ?? [];
  // Recency is measured against the snapshot, not the rendering clock.
  const snapshotAt = activity ? Date.parse(activity.generatedAt) : 0;
  const latestChange =
    recent[0] && snapshotAt - Date.parse(recent[0].at) < 10_000
      ? recent[0]
      : undefined;
  const activeChange =
    activity && !reducedMotion && !paused
      ? Companion
        ? companionChange
        : latestChange
      : undefined;
  const timeline = activeChange
    ? [
        activeChange,
        ...recent.filter((change) => change.id !== activeChange.id),
      ].slice(0, 3)
    : recent.slice(0, 3);
  const caption = activeChange
    ? `${describeChange(activeChange)}.`
    : companionName
      ? recent.length
        ? `${companionName} is keeping an eye on your changes.`
        : `${companionName} is ready for your first change.`
      : 'Your blueprint updates as you build.';
  const positions = Object.values(anchors);
  const rows = [...new Set(positions.map((position) => position.y))].sort(
    (a, b) => a - b
  );
  const threads =
    rows
      .map(
        (y) =>
          `M${Math.min(...positions.filter((position) => position.y === y).map((position) => position.x + 22))},${y + 20} H${lane + 18}`
      )
      .join(' ') +
    (rows.length
      ? ` M${lane + 18},${rows[0] + 20} V${rows[rows.length - 1] + 20}`
      : '');

  return (
    <main
      className="app-welcome"
      data-moving={moving}
      data-static={reducedMotion || paused}
      data-mode={activity ? 'live' : 'illustrative'}
      aria-labelledby="app-welcome-title"
    >
      <div className="app-welcome__content" data-ready="true">
        <header className="app-welcome__hero">
          <div className="app-welcome__brand">
            <FabricAppMark />
            <span>Fabric Apps</span>
          </div>
          <h1 id="app-welcome-title">Your app is taking shape</h1>
          <p className="app-welcome__subhead">
            A little structure. A little imagination. A Fabric App that's yours.
          </p>
          {connecting && (
            <div className="app-welcome__connection">
              {connectionError ? (
                <p className="app-welcome__connection-error" role="alert">
                  {connectionError}
                </p>
              ) : (
                <p>We're getting connected to your data.</p>
              )}
            </div>
          )}
        </header>

        <section
          className="app-welcome__blueprint"
          aria-labelledby="app-welcome-blueprint"
        >
          <div className="app-welcome__blueprint-heading">
            <div className="app-welcome__blueprint-title">
              <h2 id="app-welcome-blueprint">
                The building blocks of your app
              </h2>
              <p className="app-welcome__blueprint-note">
                {companionName
                  ? `${companionName} sketches each piece as it appears.`
                  : 'See each piece as it takes shape.'}
              </p>
            </div>
            <div className="app-welcome__blueprint-tools">
              <span className="app-welcome__live">
                <i aria-hidden="true" />
                {activity ? 'Live activity' : 'A little inspiration'}
              </span>
              {!reducedMotion && (
                <button
                  className="app-welcome__motion-toggle"
                  type="button"
                  onClick={() => setPaused((value) => !value)}
                  aria-label={
                    paused ? 'Let the page move' : 'Keep the page still'
                  }
                  title={paused ? 'Let the page move' : 'Keep the page still'}
                >
                  {paused ? (
                    <Play size={13} aria-hidden="true" />
                  ) : (
                    <Pause size={13} aria-hidden="true" />
                  )}
                </button>
              )}
            </div>
          </div>
          <div className="app-welcome__canvas" ref={canvas}>
            <svg className="app-welcome__threads" aria-hidden="true">
              <path d={threads} />
            </svg>
            <ul className="app-welcome__areas" aria-label="Your app blueprint">
              {AREAS.map((area) => {
                const state = activity?.structure.find(
                  (entry) => entry.family === area.family
                );
                const changed =
                  !!state?.lastChangedAt &&
                  snapshotAt - Date.parse(state.lastChangedAt) < 10_000;
                const active =
                  activeChange?.family === area.family ||
                  ((reducedMotion || paused) &&
                    changed &&
                    recent[0]?.family === area.family);
                const detail = !activity
                  ? area.idea
                  : area.family === 'connections' && state?.names?.length
                    ? `Configured for ${state.names[0]}${state.names.length > 1 ? ` +${state.names.length - 1}` : ''}`
                    : changed
                      ? state?.count
                        ? 'Just updated'
                        : 'Making room for something new'
                      : state?.count
                        ? 'Taking shape'
                        : 'Room to grow';
                const Icon = AREA_ICONS[area.family];
                return (
                  <li
                    key={area.family}
                    className="app-welcome__area"
                    data-family={area.family}
                    data-filled={!!state?.count}
                    data-active={active}
                    title={detail}
                  >
                    {activeChange?.family === area.family && (
                      <span
                        key={activeChange.id}
                        className="app-welcome__area-pulse"
                        aria-hidden="true"
                      />
                    )}
                    <div className="app-welcome__area-label">
                      <Icon size={17} strokeWidth={1.6} aria-hidden="true" />
                      <h3>{area.label}</h3>
                    </div>
                    <p>{detail}</p>
                    <AreaSketch family={area.family} />
                    {activity && (
                      <span className="app-welcome__sr-only">
                        {state?.count ?? 0} building{' '}
                        {state?.count === 1 ? 'piece' : 'pieces'}
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
            {Companion && (
              <Companion
                activity={activity}
                anchors={anchors}
                lane={lane}
                phase={phase}
                paused={paused}
                reducedMotion={reducedMotion}
                visible={visible}
                onActiveChange={setCompanionChange}
                onInteractionChange={setInteracting}
              />
            )}
          </div>
          <div className="app-welcome__activity">
            {activity ? (
              <>
                <p
                  className="app-welcome__caption"
                  aria-live="polite"
                  aria-atomic="true"
                >
                  <MessageSquare size={14} aria-hidden="true" />
                  {caption}
                </p>
                {timeline.length ? (
                  <ol
                    className="app-welcome__timeline"
                    aria-label="Recent changes"
                  >
                    {timeline.map((change) => (
                      <li
                        key={change.id}
                        data-active={change.id === activeChange?.id}
                        data-family={change.family}
                      >
                        <i aria-hidden="true" />
                        <span>{describeChange(change)}</span>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p className="app-welcome__activity-note">
                    The first outlines are here. New pieces will light up as
                    they're added.
                  </p>
                )}
              </>
            ) : (
              <section
                className="app-welcome__progress"
                aria-label="Typical build steps, not live build status"
              >
                <div className="app-welcome__phases">
                  <span
                    key={phase}
                    className="app-welcome__phase"
                    aria-live="off"
                  >
                    {PHASES[phase]}
                  </span>
                  <div
                    className="app-welcome__phase-dots"
                    role="group"
                    aria-label="Explore typical build steps"
                  >
                    {PHASES.map((label, index) => (
                      <button
                        key={label}
                        type="button"
                        aria-label={label}
                        aria-pressed={phase === index}
                        title={label}
                        onClick={() => {
                          phaseTime.current += (index - phase) * 6000;
                          setPhase(index);
                        }}
                      >
                        <i />
                      </button>
                    ))}
                  </div>
                </div>
                <p className="app-welcome__progress-note">
                  A typical journey, not a live update.
                </p>
              </section>
            )}
          </div>
          <div className="app-welcome__blueprint-footnote">
            <span>
              Every app takes its own shape. Not every piece is needed.
            </span>
            <span className="app-welcome__elapsed" role="timer" aria-live="off">
              Time here {Math.floor(elapsed / 60)}m{' '}
              {String(elapsed % 60).padStart(2, '0')}s
            </span>
          </div>
        </section>

        <footer className="app-welcome__footer">
          This is your app's starting point.{' '}
          <span>Replace it with the Fabric App you're building.</span>
        </footer>
      </div>
    </main>
  );
}
