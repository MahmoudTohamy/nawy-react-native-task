import { Ionicons } from '@expo/vector-icons';
import { status } from '../theme';
import { Co2ScrubberStatus, LifeSupport, VitalMetric } from '../types/habitat';

export function getScrubberDetails(scrubberStatus: Co2ScrubberStatus) {
  if (scrubberStatus === 'active') {
    return { label: 'Active', color: status.safe.text, icon: 'checkmark-circle' as const };
  }
  if (scrubberStatus === 'degraded') {
    return { label: 'Degraded', color: status.warning.text, icon: 'alert-circle' as const };
  }
  return { label: 'Failed', color: status.critical.text, icon: 'close-circle' as const };
}

export const LIFE_SUPPORT_METRICS: {
  key: VitalMetric;
  metric: VitalMetric;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  safeRange: string;
  format: (lifeSupport: LifeSupport) => string;
}[] = [
  {
    key: 'o2',
    metric: 'o2',
    icon: 'water-outline',
    label: 'Atmospheric O₂',
    safeRange: 'Safe: 19.5–23.5%',
    format: (lifeSupport) => `${lifeSupport.o2Level.toFixed(1)}%`,
  },
  {
    key: 'pressure',
    metric: 'pressure',
    icon: 'speedometer-outline',
    label: 'Cabin Pressure',
    safeRange: 'Safe: 70–102 kPa',
    format: (lifeSupport) => `${lifeSupport.cabinPressureKpa} kPa`,
  },
  {
    key: 'temp',
    metric: 'temp',
    icon: 'thermometer-outline',
    label: 'Thermal HVAC',
    safeRange: 'Safe: 18–24°C',
    format: (lifeSupport) => `${lifeSupport.temperatureC}°C`,
  },
  {
    key: 'rad',
    metric: 'rad',
    icon: 'shield-checkmark-outline',
    label: 'Radiation Shield',
    safeRange: 'Safe: ≥90%',
    format: (lifeSupport) => `${lifeSupport.radiationShieldingPct}%`,
  },
  {
    key: 'power',
    metric: 'power',
    icon: 'battery-charging-outline',
    label: 'Battery Reserve',
    safeRange: 'Safe: ≥4 hrs',
    format: (lifeSupport) => `${lifeSupport.powerReserveHrs.toFixed(1)} hrs`,
  },
  {
    key: 'scrubber',
    metric: 'scrubber',
    icon: 'repeat-outline',
    label: 'CO₂ Scrubber',
    safeRange: 'Req: Active',
    format: (lifeSupport) => getScrubberDetails(lifeSupport.co2ScrubberStatus).label,
  },
];
