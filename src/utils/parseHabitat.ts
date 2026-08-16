import {
  Co2ScrubberStatus,
  Habitat,
  HabitatStatus,
  LifeSupport,
  RawHabitat,
  RawLifeSupport,
} from '../types/habitat';
import { getHabitability } from './habitatSafety';

const VALID_STATUSES: HabitatStatus[] = ['available', 'pending', 'occupied', 'maintenance'];
const VALID_SCRUBBER: Co2ScrubberStatus[] = ['active', 'degraded', 'failed'];

function asString(value: unknown, fallback: string): string {
  return typeof value === 'string' ? value : fallback;
}

function asNumber(value: unknown, fallback: number): number {
  return typeof value === 'number' && !Number.isNaN(value) ? value : fallback;
}

function normalizeStatus(raw: unknown): HabitatStatus {
  if (typeof raw !== 'string') return 'maintenance';
  const normalized = raw.trim().toLowerCase();
  if (VALID_STATUSES.includes(normalized as HabitatStatus)) {
    return normalized as HabitatStatus;
  }
  if (normalized === 'sold') return 'occupied';
  return 'maintenance';
}

function normalizeScrubber(raw: unknown): Co2ScrubberStatus {
  if (typeof raw !== 'string') return 'failed';
  const normalized = raw.trim().toLowerCase();
  if (VALID_SCRUBBER.includes(normalized as Co2ScrubberStatus)) {
    return normalized as Co2ScrubberStatus;
  }
  return 'failed';
}

function parseAmenities(raw: unknown, issues: string[]): string[] {
  if (raw == null) return [];
  if (!Array.isArray(raw)) {
    issues.push('Invalid amenities format');
    return [];
  }
  return raw.filter((item): item is string => typeof item === 'string');
}

function parseLifeSupport(raw: RawLifeSupport | undefined, issues: string[]): LifeSupport {
  if (!raw || typeof raw !== 'object') {
    issues.push('Missing life support data');
    return {
      o2Level: 0,
      cabinPressureKpa: 0,
      temperatureC: 0,
      radiationShieldingPct: 0,
      powerReserveHrs: 0,
      co2ScrubberStatus: 'failed',
    };
  }

  return {
    o2Level: asNumber(raw.o2_level, 0),
    cabinPressureKpa: asNumber(raw.cabin_pressure_kpa, 0),
    temperatureC: asNumber(raw.temperature_c, 0),
    radiationShieldingPct: asNumber(raw.radiation_shielding_pct, 0),
    powerReserveHrs: asNumber(raw.power_reserve_hrs, 0),
    co2ScrubberStatus: normalizeScrubber(raw.co2_scrubber_status),
  };
}

function parseLeaseCredits(raw: unknown, issues: string[]): number | null {
  if (typeof raw !== 'number' || Number.isNaN(raw) || raw <= 0) {
    issues.push('Invalid lease credits');
    return null;
  }
  return raw;
}

function formatLeaseLabel(credits: number | null): string {
  if (credits == null) return 'Credits unavailable';
  return `${credits} CR/sol`;
}

export function parseHabitat(json: RawHabitat): Habitat {
  const dataIssues: string[] = [];
  const leaseCredits = parseLeaseCredits(json.lease_credits, dataIssues);
  const lifeSupport = parseLifeSupport(json.life_support, dataIssues);

  const habitat: Habitat = {
    id: asString(json.id, 'unknown'),
    title: asString(json.title, 'Untitled Habitat'),
    leaseCredits,
    leaseLabel: formatLeaseLabel(leaseCredits),
    sector: asString(json.sector, 'Unknown Sector'),
    gridCoordinates: asString(json.grid_coordinates, 'N/A'),
    bedrooms: asNumber(json.bedrooms, 0),
    bathrooms: asNumber(json.bathrooms, 0),
    volumeM3: asNumber(json.volume_m3, 0),
    imageUrl: typeof json.image_url === 'string' ? json.image_url : null,
    description: asString(json.description, ''),
    amenities: parseAmenities(json.amenities, dataIssues),
    status: normalizeStatus(json.status),
    listedAtSol: asNumber(json.listed_at_sol, 0),
    lifeSupport,
    dataIssues,
    habitability: getHabitability(lifeSupport),
  };

  return habitat;
}

