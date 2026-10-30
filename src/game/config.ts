export const BLOOM_COLORS = ['#FF6B9A', '#FFB547', '#5CE1A6', '#57B8FF', '#B98CFF'];
export const THORN_COLOR = '#2A2140';
export const THORN_EDGE = '#FF4D6D';
export const MISS_COLOR = '#FF4D6D';

export const START_LIVES = 3;
export const MIN_RADIUS = 10;
export const MAX_RADIUS = 46;

// Difficulty ramps linearly from easy to hard over this many milliseconds.
export const RAMP_MS = 60_000;
export const SPAWN_INTERVAL = { easy: 950, hard: 380 };
export const BLOOM_LIFE = { easy: 2400, hard: 1300 };
export const THORN_CHANCE = { easy: 0.1, hard: 0.22 };

export const POP_MS = 600;
// Every this many hits in a row adds +1 to the score multiplier.
export const COMBO_STEP = 10;
