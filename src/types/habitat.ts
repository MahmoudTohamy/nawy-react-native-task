export type Co2ScrubberStatus = 'active' | 'degraded' | 'failed';

export type HabitatStatus = 'available' | 'pending' | 'occupied' | 'maintenance';

export type Habitability = 'safe' | 'warning' | 'critical';

export type VitalMetric = 'o2' | 'pressure' | 'temp' | 'rad' | 'power' | 'scrubber';

export type CompareSide = 'left' | 'right' | 'tie';

export type CompareMetric =
  | 'habitability'
  | 'price'
  | 'volume'
  | 'berths'
  | 'baths'
  | 'o2'
  | 'pressure';

export type LifeSupport = {
  o2Level: number;
  cabinPressureKpa: number;
  temperatureC: number;
  radiationShieldingPct: number;
  powerReserveHrs: number;
  co2ScrubberStatus: Co2ScrubberStatus;
};

export type Habitat = {
  id: string;
  title: string;
  leaseCredits: number | null;
  leaseLabel: string;
  sector: string;
  gridCoordinates: string;
  bedrooms: number;
  bathrooms: number;
  volumeM3: number;
  imageUrl: string | null;
  description: string;
  amenities: string[];
  status: HabitatStatus;
  listedAtSol: number;
  lifeSupport: LifeSupport;
  dataIssues: string[];
  habitability: Habitability;
};

export type SortKey = 'leaseCredits' | 'habitability' | 'o2Level' | 'listedAtSol';

export type HabitatFilters = {
  minLeaseCredits: number | null;
  maxLeaseCredits: number | null;
  minBedrooms: number | null;
  minBathrooms: number | null;
};

export const DEFAULT_FILTERS: HabitatFilters = {
  minLeaseCredits: null,
  maxLeaseCredits: null,
  minBedrooms: null,
  minBathrooms: null,
};

export type RawLifeSupport = {
  o2_level?: unknown;
  cabin_pressure_kpa?: unknown;
  temperature_c?: unknown;
  radiation_shielding_pct?: unknown;
  power_reserve_hrs?: unknown;
  co2_scrubber_status?: unknown;
};

export type RawHabitat = {
  id?: unknown;
  title?: unknown;
  lease_credits?: unknown;
  sector?: unknown;
  grid_coordinates?: unknown;
  bedrooms?: unknown;
  bathrooms?: unknown;
  volume_m3?: unknown;
  image_url?: unknown;
  description?: unknown;
  amenities?: unknown;
  status?: unknown;
  listed_at_sol?: unknown;
  life_support?: RawLifeSupport;
};
