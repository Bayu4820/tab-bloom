import { useCallback, useEffect, useRef, useState } from 'react';
import {
  BLOOM_COLORS,
  BLOOM_LIFE,
  COMBO_STEP,
  MAX_RADIUS,
  MISS_COLOR,
  POP_MS,
  RAMP_MS,
  SPAWN_INTERVAL,
  START_LIVES,
  THORN_CHANCE,
  THORN_EDGE,
} from './config';

export type Bloom = {
  id: number;
  x: number;
  y: number;
  color: string;
  thorn: boolean;
  born: number;
  life: number;
};

export type Pop = { id: number; x: number; y: number; label: string; color: string; born: number };

export type Area = { width: number; height: number };

type GameState = {
  blooms: Bloom[];
  pops: Pop[];
  score: number;
  lives: number;
  combo: number;
  startedAt: number;
  nextSpawnAt: number;
  lastTick: number;
  nextId: number;
  over: boolean;
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function createState(now: number): GameState {
  return {
    blooms: [],
    pops: [],
    score: 0,
    lives: START_LIVES,
    combo: 0,
    startedAt: now,
    nextSpawnAt: now + 500,
    lastTick: now,
    nextId: 1,
    over: false,
  };
}

function spawn(g: GameState, area: Area, now: number, difficulty: number) {
  const margin = MAX_RADIUS + 4;
  if (area.width < margin * 2 || area.height < margin * 2) return;

  // Try a few random spots and keep the first one that doesn't overlap a live bloom.
  let x = 0;
  let y = 0;
  for (let attempt = 0; attempt < 10; attempt++) {
    x = margin + Math.random() * (area.width - margin * 2);
    y = margin + Math.random() * (area.height - margin * 2);
    const clear = g.blooms.every((b) => Math.hypot(b.x - x, b.y - y) > MAX_RADIUS * 2);
    if (clear) break;
  }

  g.blooms.push({
    id: g.nextId++,
    x,
    y,
    color: BLOOM_COLORS[Math.floor(Math.random() * BLOOM_COLORS.length)],
    thorn: Math.random() < lerp(THORN_CHANCE.easy, THORN_CHANCE.hard, difficulty),
    born: now,
    life: lerp(BLOOM_LIFE.easy, BLOOM_LIFE.hard, difficulty),
  });
}

/** Returns how far through its life a bloom is, from 0 (just spawned) to 1 (bursting). */
export function bloomProgress(b: Bloom, now: number) {
  return Math.min(1, Math.max(0, (now - b.born) / b.life));
}

/** An immutable copy of what the screen needs to draw one frame. */
function snapshot(g: GameState, now: number) {
  return {
    now,
    blooms: [...g.blooms],
    pops: [...g.pops],
    score: g.score,
    lives: g.lives,
    multiplier: 1 + Math.floor(g.combo / COMBO_STEP),
  };
}

export function useGame(area: Area | null, onGameOver: (score: number) => void) {
  // Timestamps start at 0 and are set to the real clock when the loop first runs.
  const state = useRef<GameState>(createState(0));
  const [frame, setFrame] = useState(() => snapshot(createState(0), 0));
  const onGameOverRef = useRef(onGameOver);

  useEffect(() => {
    onGameOverRef.current = onGameOver;
  }, [onGameOver]);

  useEffect(() => {
    if (!area) return;
    let raf = 0;

    const tick = () => {
      const g = state.current;
      if (g.over) return;
      const t = Date.now();

      // If frames stopped (app backgrounded, tab hidden), freeze time instead of
      // letting every bloom expire at once.
      const gap = t - g.lastTick;
      if (gap > 250) {
        g.startedAt += gap;
        g.nextSpawnAt += gap;
        g.blooms.forEach((b) => (b.born += gap));
        g.pops.forEach((p) => (p.born += gap));
      }
      g.lastTick = t;

      const alive: Bloom[] = [];
      for (const b of g.blooms) {
        if (t - b.born < b.life) {
          alive.push(b);
        } else if (!b.thorn) {
          g.lives -= 1;
          g.combo = 0;
          g.pops.push({ id: g.nextId++, x: b.x, y: b.y, label: '✕', color: MISS_COLOR, born: t });
        }
      }
      g.blooms = alive;
      g.pops = g.pops.filter((p) => t - p.born < POP_MS);

      if (g.lives <= 0) {
        g.lives = 0;
        g.over = true;
        setFrame(snapshot(g, t));
        onGameOverRef.current(g.score);
        return;
      }

      if (t >= g.nextSpawnAt) {
        const difficulty = Math.min(1, (t - g.startedAt) / RAMP_MS);
        spawn(g, area, t, difficulty);
        const interval = lerp(SPAWN_INTERVAL.easy, SPAWN_INTERVAL.hard, difficulty);
        g.nextSpawnAt = t + interval * (0.7 + Math.random() * 0.6);
      }

      setFrame(snapshot(g, t));
      raf = requestAnimationFrame(tick);
    };

    if (state.current.startedAt === 0) state.current = createState(Date.now());
    state.current.lastTick = Date.now();
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [area]);

  const tap = useCallback((id: number) => {
    const g = state.current;
    if (g.over) return;
    const bloom = g.blooms.find((b) => b.id === id);
    if (!bloom) return;

    const t = Date.now();
    g.blooms = g.blooms.filter((b) => b.id !== id);

    if (bloom.thorn) {
      g.lives -= 1;
      g.combo = 0;
      g.pops.push({ id: g.nextId++, x: bloom.x, y: bloom.y, label: '−♥', color: THORN_EDGE, born: t });
      return;
    }

    // Riskier taps (bigger blooms, closer to bursting) are worth more.
    const p = bloomProgress(bloom, t);
    const base = p < 0.5 ? 1 : p < 0.8 ? 2 : 3;
    g.combo += 1;
    const points = base * (1 + Math.floor(g.combo / COMBO_STEP));
    g.score += points;
    g.pops.push({ id: g.nextId++, x: bloom.x, y: bloom.y, label: `+${points}`, color: bloom.color, born: t });
  }, []);

  return { ...frame, tap };
}
