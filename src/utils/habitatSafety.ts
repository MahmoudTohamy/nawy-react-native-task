import { Co2ScrubberStatus, Habitability, LifeSupport } from '../types/habitat';

type MetricLevel = Habitability;

function worstLevel(a: MetricLevel, b: MetricLevel): MetricLevel {
  const rank: Record<MetricLevel, number> = { safe: 0, warning: 1, critical: 2 };
  return rank[a] >= rank[b] ? a : b;
}

function o2Level(o2: number): MetricLevel {
  if (o2 >= 19.5 && o2 <= 23.5) return 'safe';
  if (o2 >= 18 && o2 < 19.5) return 'warning';
  if (o2 > 23.5 && o2 <= 25) return 'warning';
  return 'critical';
}

function pressureLevel(kpa: number): MetricLevel {
  if (kpa >= 70 && kpa <= 102) return 'safe';
  if (kpa >= 65 && kpa < 70) return 'warning';
  if (kpa > 102 && kpa <= 105) return 'warning';
  return 'critical';
}

function temperatureLevel(c: number): MetricLevel {
  if (c >= 18 && c <= 24) return 'safe';
  if (c >= 15 && c < 18) return 'warning';
  if (c > 24 && c <= 27) return 'warning';
  return 'critical';
}

function radiationLevel(pct: number): MetricLevel {
  if (pct >= 90) return 'safe';
  if (pct >= 85) return 'warning';
  return 'critical';
}

function powerLevel(hrs: number): MetricLevel {
  if (hrs >= 4) return 'safe';
  if (hrs >= 2) return 'warning';
  return 'critical';
}

function scrubberLevel(status: Co2ScrubberStatus): MetricLevel {
  if (status === 'active') return 'safe';
  if (status === 'degraded') return 'warning';
  return 'critical';
}

export function getHabitability(lifeSupport: LifeSupport): Habitability {
  let level: Habitability = 'safe';
  level = worstLevel(level, o2Level(lifeSupport.o2Level));
  level = worstLevel(level, pressureLevel(lifeSupport.cabinPressureKpa));
  level = worstLevel(level, temperatureLevel(lifeSupport.temperatureC));
  level = worstLevel(level, radiationLevel(lifeSupport.radiationShieldingPct));
  level = worstLevel(level, powerLevel(lifeSupport.powerReserveHrs));
  level = worstLevel(level, scrubberLevel(lifeSupport.co2ScrubberStatus));
  return level;
}

export const HABITABILITY_COLORS: Record<Habitability, { bg: string; text: string; label: string }> = {
  safe: { bg: '#C8E6C9', text: '#2E7D32', label: 'SAFE' },
  warning: { bg: '#FFE0B2', text: '#EF6C00', label: 'WARNING' },
  critical: { bg: '#FFCDD2', text: '#C62828', label: 'CRITICAL' },
};
