/**
 * Nawy Mars — Design Token: Colors
 *
 * Single source of truth for every color used in the app.
 * Group by semantic role so consumers never hardcode hex values.
 */

// ─── Brand ────────────────────────────────────────────────────────────────────
export const brand = {
  /** Primary Mars-orange action color */
  primary: '#D84315',
  /** Slightly lighter tint used for chip backgrounds, clear buttons */
  primaryTint: '#FBE9E7',
  /** Border for primary-tint surfaces */
  primaryBorder: '#FFCCBC',
  /** Dark charcoal used for selected/active neutral chips */
  dark: '#212121',
} as const;

// ─── Semantic Status ──────────────────────────────────────────────────────────
export const status = {
  critical: {
    text: '#C62828',
    bg: '#FFEBEE',
    border: '#FFCDD2',
    chip: '#FFCDD2',
  },
  warning: {
    text: '#EF6C00',
    /** Darker warning copy for banners */
    accent: '#E65100',
    /** Header badge when warnings exist but nothing is critical */
    badge: '#FFD54F',
    bg: '#FFF3E0',
    border: '#FFE0B2',
    chip: '#FFE0B2',
  },
  info: {
    text: '#1565C0',
    bg: '#E3F2FD',
    border: '#BBDEFB',
    chip: '#BBDEFB',
  },
  safe: {
    text: '#2E7D32',
    bg: '#E8F5E9',
    border: '#C8E6C9',
    chip: '#C8E6C9',
  },
  protocol: {
    label: '#33691E',
    text: '#2E7D32',
    bg: '#F1F8E9',
    border: '#DCEDC8',
  },
} as const;

// ─── Neutral Grays ────────────────────────────────────────────────────────────
export const neutral = {
  white: '#FFFFFF',
  /** Page / screen background */
  background: '#FAFAFA',
  /** Very light card/tile background */
  surface: '#F5F5F5',
  /** Border color for cards and dividers */
  border: '#EEEEEE',
  /** Chip / toggle border */
  chipBorder: '#E0E0E0',
  /** Image placeholder background */
  placeholder: '#EEEEEE',

  // Text hierarchy
  textPrimary: '#212121',
  textSecondary: '#424242',
  textMuted: '#616161',
  textSubtle: '#757575',
  textDisabled: '#9E9E9E',
} as const;

// ─── Elevation Shadow ─────────────────────────────────────────────────────────
export const shadow = {
  color: '#000000',
} as const;

// ─── Energy / Phase Specific ──────────────────────────────────────────────────
export const energy = {
  solarOrange: '#F57C00',
  solarOrangeBg: '#FFF8E1',
  duskRed: '#E64A19',
  duskRedBg: '#FBE9E7',
  nightIndigo: '#5C6BC0',
  nightIndigoBg: '#EDE7F6',
  dawnAmber: '#FFA000',
  dawnAmberBg: '#FFF3E0',
} as const;
