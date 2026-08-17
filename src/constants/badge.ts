import { brand, neutral, status } from '../theme';

export type BadgeTone = 'safe' | 'warning' | 'critical' | 'info' | 'neutral';

export const BADGE_TONE_STYLES: Record<BadgeTone, { bg: string; text: string }> = {
  safe: { bg: status.safe.chip, text: status.safe.text },
  warning: { bg: status.warning.chip, text: status.warning.text },
  critical: { bg: status.critical.chip, text: status.critical.text },
  info: { bg: status.info.chip, text: status.info.text },
  neutral: { bg: neutral.surface, text: brand.dark },
};
