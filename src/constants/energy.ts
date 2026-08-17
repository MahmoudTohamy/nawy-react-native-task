import { Ionicons } from '@expo/vector-icons';
import { energy, status } from '../theme';
import { DayNightPhase, DustStormRisk } from '../types/control';

export const PHASE_CONFIG: Record<
  DayNightPhase,
  { label: string; icon: keyof typeof Ionicons.glyphMap; color: string; bg: string }
> = {
  day: {
    label: 'High Solar Irradiance (Day)',
    icon: 'sunny',
    color: energy.solarOrange,
    bg: energy.solarOrangeBg,
  },
  dusk: {
    label: 'Approaching Terminator (Dusk)',
    icon: 'partly-sunny',
    color: energy.duskRed,
    bg: energy.duskRedBg,
  },
  night: {
    label: 'Solar Eclipse / Night Sol',
    icon: 'moon',
    color: energy.nightIndigo,
    bg: energy.nightIndigoBg,
  },
  dawn: {
    label: 'Dawn Illumination Rising',
    icon: 'sunny-outline',
    color: energy.dawnAmber,
    bg: energy.dawnAmberBg,
  },
};

export const RISK_CONFIG: Record<DustStormRisk, { label: string; color: string; bg: string }> = {
  nominal: {
    label: 'Nominal — No Storm Detected',
    color: status.safe.text,
    bg: status.safe.bg,
  },
  moderate: {
    label: 'Moderate — Class-2 Front Expected',
    color: status.warning.text,
    bg: status.warning.bg,
  },
  severe: {
    label: 'Severe Dust Blackout Warning',
    color: status.critical.text,
    bg: status.critical.bg,
  },
};
