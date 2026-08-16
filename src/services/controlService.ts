import rawAlerts from '../../assets/data/alerts.json';
import rawEnergy from '../../assets/data/energy.json';
import {
  AlertCategory,
  AlertSeverity,
  AlertStatus,
  DayNightPhase,
  DustStormRisk,
  EnergyStatus,
  HabitatAlert,
  RawAlert,
  RawEnergyStatus,
} from '../types/control';

const VALID_SEVERITIES: AlertSeverity[] = ['critical', 'warning', 'info'];
const VALID_CATEGORIES: AlertCategory[] = ['life_support', 'energy', 'structural', 'weather'];
const VALID_STATUSES: AlertStatus[] = ['active', 'dismissed', 'snoozed'];
const VALID_PHASES: DayNightPhase[] = ['day', 'dusk', 'night', 'dawn'];
const VALID_DUST_RISKS: DustStormRisk[] = ['nominal', 'moderate', 'severe'];

export function parseAlert(json: RawAlert): HabitatAlert {
  const severityRaw = typeof json.severity === 'string' ? json.severity.toLowerCase() : 'info';
  const severity: AlertSeverity = VALID_SEVERITIES.includes(severityRaw as AlertSeverity)
    ? (severityRaw as AlertSeverity)
    : 'info';

  const categoryRaw = typeof json.category === 'string' ? json.category.toLowerCase() : 'structural';
  const category: AlertCategory = VALID_CATEGORIES.includes(categoryRaw as AlertCategory)
    ? (categoryRaw as AlertCategory)
    : 'structural';

  const statusRaw = typeof json.status === 'string' ? json.status.toLowerCase() : 'active';
  const status: AlertStatus = VALID_STATUSES.includes(statusRaw as AlertStatus)
    ? (statusRaw as AlertStatus)
    : 'active';

  return {
    id: typeof json.id === 'string' ? json.id : `alert_${Math.random()}`,
    habitatId: typeof json.habitat_id === 'string' ? json.habitat_id : 'unknown',
    habitatTitle: typeof json.habitat_title === 'string' ? json.habitat_title : 'Settlement Pod',
    sector: typeof json.sector === 'string' ? json.sector : 'General Sector',
    severity,
    category,
    title: typeof json.title === 'string' ? json.title : 'Unclassified Habitat Notice',
    message: typeof json.message === 'string' ? json.message : 'No telemetry details attached.',
    suggestedAction:
      typeof json.suggested_action === 'string'
        ? json.suggested_action
        : 'Monitor colony diagnostics dashboard.',
    timestampSol: typeof json.timestamp_sol === 'number' ? json.timestamp_sol : 1248,
    timestampTime: typeof json.timestamp_time === 'string' ? json.timestamp_time : '00:00 MST',
    status,
  };
}

export function parseEnergyStatus(json: RawEnergyStatus): EnergyStatus {
  const phaseRaw = typeof json.day_night_phase === 'string' ? json.day_night_phase.toLowerCase() : 'day';
  const dayNightPhase: DayNightPhase = VALID_PHASES.includes(phaseRaw as DayNightPhase)
    ? (phaseRaw as DayNightPhase)
    : 'day';

  const riskRaw = typeof json.dust_storm_risk === 'string' ? json.dust_storm_risk.toLowerCase() : 'nominal';
  const dustStormRisk: DustStormRisk = VALID_DUST_RISKS.includes(riskRaw as DustStormRisk)
    ? (riskRaw as DustStormRisk)
    : 'nominal';

  const solarGenerationKw = typeof json.solar_generation_kw === 'number' ? json.solar_generation_kw : 40;
  const baseConsumptionKw = typeof json.base_consumption_kw === 'number' ? json.base_consumption_kw : 30;
  const powerSaveMode = Boolean(json.power_save_mode);
  const batteryPct = typeof json.battery_pct === 'number' ? json.battery_pct : 75;
  const batteryCapacityKwh = typeof json.battery_capacity_kwh === 'number' ? json.battery_capacity_kwh : 300;

  const effectiveConsumption = powerSaveMode ? baseConsumptionKw * 0.65 : baseConsumptionKw;
  const netDraw = Math.max(0.1, effectiveConsumption - solarGenerationKw);
  const availableKwh = (batteryPct / 100) * batteryCapacityKwh;
  const batteryHoursRemaining = Number((availableKwh / netDraw).toFixed(1));

  return {
    solarGenerationKw,
    baseConsumptionKw,
    powerSaveMode,
    batteryPct,
    batteryCapacityKwh,
    batteryHoursRemaining: Number.isFinite(batteryHoursRemaining) ? Math.max(0, batteryHoursRemaining) : 12,
    solTime: typeof json.sol_time === 'string' ? json.sol_time : '12:00 MST',
    dayNightPhase,
    dustStormRisk,
    dustStormCountdownSols:
      typeof json.dust_storm_countdown_sols === 'number' ? json.dust_storm_countdown_sols : null,
    hourlyGenerationHistory: Array.isArray(json.hourly_generation_history)
      ? (json.hourly_generation_history.filter((n) => typeof n === 'number') as number[])
      : [],
    hourlyConsumptionHistory: Array.isArray(json.hourly_consumption_history)
      ? (json.hourly_consumption_history.filter((n) => typeof n === 'number') as number[])
      : [],
  };
}

export async function fetchAlerts(): Promise<HabitatAlert[]> {
  await new Promise((resolve) => setTimeout(resolve, 50));
  return (rawAlerts as RawAlert[]).map(parseAlert);
}

export async function fetchEnergyStatus(): Promise<EnergyStatus> {
  await new Promise((resolve) => setTimeout(resolve, 50));
  return parseEnergyStatus(rawEnergy as RawEnergyStatus);
}
