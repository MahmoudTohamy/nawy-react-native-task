export type AlertSeverity = 'critical' | 'warning' | 'info';

export type AlertSeverityFilter = AlertSeverity | 'all';

export type ControlTab = 'alerts' | 'lifesupport' | 'energy';

export type AlertCategory = 'life_support' | 'energy' | 'structural' | 'weather';

export type AlertStatus = 'active' | 'dismissed' | 'snoozed';

export type HabitatAlert = {
  id: string;
  habitatId: string;
  habitatTitle: string;
  sector: string;
  severity: AlertSeverity;
  category: AlertCategory;
  title: string;
  message: string;
  suggestedAction: string;
  timestampSol: number;
  timestampTime: string;
  status: AlertStatus;
  snoozedUntilSol?: number;
};

export type DayNightPhase = 'day' | 'dusk' | 'night' | 'dawn';
export type DustStormRisk = 'nominal' | 'moderate' | 'severe';

export type EnergyStatus = {
  solarGenerationKw: number;
  baseConsumptionKw: number;
  powerSaveMode: boolean;
  batteryPct: number;
  batteryCapacityKwh: number;
  batteryHoursRemaining: number;
  solTime: string;
  dayNightPhase: DayNightPhase;
  dustStormRisk: DustStormRisk;
  dustStormCountdownSols: number | null;
  hourlyGenerationHistory: number[];
  hourlyConsumptionHistory: number[];
};

export type RawAlert = {
  id?: unknown;
  habitat_id?: unknown;
  habitat_title?: unknown;
  sector?: unknown;
  severity?: unknown;
  category?: unknown;
  title?: unknown;
  message?: unknown;
  suggested_action?: unknown;
  timestamp_sol?: unknown;
  timestamp_time?: unknown;
  status?: unknown;
};

export type RawEnergyStatus = {
  solar_generation_kw?: unknown;
  base_consumption_kw?: unknown;
  power_save_mode?: unknown;
  battery_pct?: unknown;
  battery_capacity_kwh?: unknown;
  sol_time?: unknown;
  day_night_phase?: unknown;
  dust_storm_risk?: unknown;
  dust_storm_countdown_sols?: unknown;
  hourly_generation_history?: unknown;
  hourly_consumption_history?: unknown;
};
