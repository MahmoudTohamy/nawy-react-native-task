/**
 * Nawy Mars — Design Token: Spacing
 *
 * An 8-pt base grid. Use these tokens for all margins, paddings, and gaps.
 * Never write raw numbers for layout values.
 */

export const spacing = {
  /** 2px — micro gap, badge insets */
  xxs: 2,
  /** 4px — tight icon-text gap, small badge padding */
  xs: 4,
  /** 6px — compact chip padding, small gaps */
  sm: 6,
  /** 8px — standard chip horizontal padding, hitSlop */
  md: 8,
  /** 10px — card inner gap, filter chip vertical rhythm */
  lg: 10,
  /** 12px — card/section internal gap, group gap */
  xl: 12,
  /** 14px — banner padding, tight card padding */
  '2xl': 14,
  /** 16px — standard screen padding / card padding */
  '3xl': 16,
  /** 20px — button horizontal padding */
  '4xl': 20,
  /** 24px — empty-state padding, section vertical gap */
  '5xl': 24,
  /** 32px — large empty-state / error-state padding */
  '6xl': 32,
  /** 40px — bottom content padding */
  '7xl': 40,
  /** 48px — scroll bottom padding */
  '8xl': 48,
} as const;

/**
 * Border radius tokens
 */
export const radius = {
  /** 4px — small badges, status chips */
  xs: 4,
  /** 6px — severity badge, snooze btn */
  sm: 6,
  /** 8px — action buttons, small cards */
  md: 8,
  /** 10px — tiles, gauge cards */
  lg: 10,
  /** 12px — standard cards */
  xl: 12,
  /** 14px — filter chips */
  '2xl': 14,
  /** 16px — pill chips */
  '3xl': 16,
  /** 20px — habitat selector pills */
  '4xl': 20,
  /** 9999px — fully round (avatar, dot) */
  full: 9999,
} as const;
