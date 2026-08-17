import { Habitat, HabitatFilters } from '../types/habitat';

function hasPriceFilter(filters: HabitatFilters): boolean {
  return filters.minLeaseCredits != null || filters.maxLeaseCredits != null;
}

export function filterHabitats(habitats: Habitat[], filters: HabitatFilters): Habitat[] {
  return habitats.filter((habitat) => {
    if (filters.minBedrooms != null && habitat.bedrooms < filters.minBedrooms) {
      return false;
    }

    if (filters.minBathrooms != null && habitat.bathrooms < filters.minBathrooms) {
      return false;
    }

    if (hasPriceFilter(filters)) {
      if (habitat.leaseCredits == null) return false;
      if (filters.minLeaseCredits != null && habitat.leaseCredits < filters.minLeaseCredits) {
        return false;
      }
      if (filters.maxLeaseCredits != null && habitat.leaseCredits > filters.maxLeaseCredits) {
        return false;
      }
    }

    return true;
  });
}

export function hasActiveFilters(filters: HabitatFilters): boolean {
  return (
    filters.minLeaseCredits != null ||
    filters.maxLeaseCredits != null ||
    filters.minBedrooms != null ||
    filters.minBathrooms != null
  );
}
