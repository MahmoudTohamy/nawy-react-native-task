import { Ionicons } from '@expo/vector-icons';
import { status } from '../theme';
import { AlertCategory, AlertSeverity } from '../types/control';

export const SEVERITY_COLORS: Record<AlertSeverity, { bg: string; text: string; border: string }> = {
  critical: { bg: status.critical.bg, text: status.critical.text, border: status.critical.border },
  warning: { bg: status.warning.bg, text: status.warning.text, border: status.warning.border },
  info: { bg: status.info.bg, text: status.info.text, border: status.info.border },
};

export const CATEGORY_ICONS: Record<AlertCategory, keyof typeof Ionicons.glyphMap> = {
  life_support: 'pulse-outline',
  energy: 'flash-outline',
  structural: 'construct-outline',
  weather: 'planet-outline',
};
