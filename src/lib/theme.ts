// Real hex values for contexts that need an actual CSS color string rather
// than a Tailwind class (chart strokes/fills, recharts tooltip styling).
// Static layout/box styling elsewhere uses Tailwind's `ledger` palette
// (see tailwind.config.js) instead of this file.
export const THEME = {
  bg: '#12161d',
  surface: '#1a1f27',
  surfaceAlt: '#20262f',
  border: '#2a313c',
  borderSoft: '#232a33',
  text: '#eef1f5',
  textSoft: '#8b93a1',
  textFaint: '#5c6470',
  gold: '#c9a15a',
  sage: '#6fae7f',
  rust: '#c1666b',
} as const;
