import { Habitat, LifeSupport } from '../types/habitat';

function isSameStringList(left: string[], right: string[]): boolean {
  if (left === right) return true;
  if (left.length !== right.length) return false;
  return left.every((value, index) => value === right[index]);
}

function isSameLifeSupport(left: LifeSupport, right: LifeSupport): boolean {
  return (
    left.o2Level === right.o2Level &&
    left.cabinPressureKpa === right.cabinPressureKpa &&
    left.temperatureC === right.temperatureC &&
    left.radiationShieldingPct === right.radiationShieldingPct &&
    left.powerReserveHrs === right.powerReserveHrs &&
    left.co2ScrubberStatus === right.co2ScrubberStatus
  );
}

function isSameHabitat(left: Habitat, right: Habitat): boolean {
  return (
    left.id === right.id &&
    left.title === right.title &&
    left.leaseCredits === right.leaseCredits &&
    left.leaseLabel === right.leaseLabel &&
    left.sector === right.sector &&
    left.gridCoordinates === right.gridCoordinates &&
    left.bedrooms === right.bedrooms &&
    left.bathrooms === right.bathrooms &&
    left.volumeM3 === right.volumeM3 &&
    left.imageUrl === right.imageUrl &&
    left.description === right.description &&
    left.status === right.status &&
    left.listedAtSol === right.listedAtSol &&
    left.habitability === right.habitability &&
    isSameLifeSupport(left.lifeSupport, right.lifeSupport) &&
    isSameStringList(left.amenities, right.amenities) &&
    isSameStringList(left.dataIssues, right.dataIssues)
  );
}

export function mergeHabitats(previous: Habitat[], incoming: Habitat[]): Habitat[] {
  const previousById = new Map(previous.map((habitat) => [habitat.id, habitat]));

  const merged = incoming.map((habitat) => {
    const existing = previousById.get(habitat.id);
    if (!existing) return habitat;
    return isSameHabitat(existing, habitat) ? existing : habitat;
  });

  const reusedArray =
    merged.length === previous.length && merged.every((habitat, index) => habitat === previous[index]);

  return reusedArray ? previous : merged;
}
