import { status } from '../theme';
import { Habitability, LifeSupport } from '../types/habitat';

export type VitalMetric = 'o2' | 'pressure' | 'temp' | 'rad' | 'power' | 'scrubber';

const VITAL_METRICS: VitalMetric[] = ['o2', 'pressure', 'temp', 'rad', 'power', 'scrubber'];
const RANK: Record<Habitability, number> = { safe: 0, warning: 1, critical: 2 };

function worstLevel(a: Habitability, b: Habitability): Habitability {
  return RANK[a] >= RANK[b] ? a : b;
}

export function getMetricHabitability(metric: VitalMetric, lifeSupport: LifeSupport): Habitability {
  switch (metric) {
    case 'o2': {
      const o2 = lifeSupport.o2Level;
      if (o2 >= 19.5 && o2 <= 23.5) return 'safe';
      if ((o2 >= 18 && o2 < 19.5) || (o2 > 23.5 && o2 <= 25)) return 'warning';
      return 'critical';
    }
    case 'pressure': {
      const kpa = lifeSupport.cabinPressureKpa;
      if (kpa >= 70 && kpa <= 102) return 'safe';
      if ((kpa >= 65 && kpa < 70) || (kpa > 102 && kpa <= 105)) return 'warning';
      return 'critical';
    }
    case 'temp': {
      const c = lifeSupport.temperatureC;
      if (c >= 18 && c <= 24) return 'safe';
      if ((c >= 15 && c < 18) || (c > 24 && c <= 27)) return 'warning';
      return 'critical';
    }
    case 'rad':
      if (lifeSupport.radiationShieldingPct >= 90) return 'safe';
      if (lifeSupport.radiationShieldingPct >= 85) return 'warning';
      return 'critical';
    case 'power':
      if (lifeSupport.powerReserveHrs >= 4) return 'safe';
      if (lifeSupport.powerReserveHrs >= 2) return 'warning';
      return 'critical';
    case 'scrubber':
      if (lifeSupport.co2ScrubberStatus === 'active') return 'safe';
      if (lifeSupport.co2ScrubberStatus === 'degraded') return 'warning';
      return 'critical';
  }
}

export function getHabitability(lifeSupport: LifeSupport): Habitability {
  return VITAL_METRICS.reduce(
    (level, metric) => worstLevel(level, getMetricHabitability(metric, lifeSupport)),
    'safe' as Habitability,
  );
}

export const HABITABILITY_COLORS: Record<Habitability, { bg: string; text: string; label: string }> = {
  safe: { bg: status.safe.chip, text: status.safe.text, label: 'SAFE' },
  warning: { bg: status.warning.chip, text: status.warning.text, label: 'WARNING' },
  critical: { bg: status.critical.chip, text: status.critical.text, label: 'CRITICAL' },
};

export function metricToneColor(level: Habitability): string {
  return HABITABILITY_COLORS[level].text;
}

const DUST_STORM_PREFIX: Record<Habitability, string> = {
  safe: 'Dust-storm ready',
  warning: 'Blackout risk',
  critical: 'Cannot survive blackout',
};

export function getDustStormLabel(lifeSupport: LifeSupport): string {
  const prefix = DUST_STORM_PREFIX[getMetricHabitability('power', lifeSupport)];
  return `${prefix}: ${lifeSupport.powerReserveHrs.toFixed(1)} hrs`;
}
