import { CompareMetric, CompareSide, Habitat, Habitability } from '../types/habitat';

const HABITABILITY_RANK: Record<Habitability, number> = {
  safe: 0,
  warning: 1,
  critical: 2,
};

const TARGET_O2 = 21;
const PRESSURE_MIDPOINT = (70 + 102) / 2;

function closerWins(left: number, right: number, target: number): CompareSide {
  const leftDelta = Math.abs(left - target);
  const rightDelta = Math.abs(right - target);
  if (leftDelta === rightDelta) return 'tie';
  return leftDelta < rightDelta ? 'left' : 'right';
}

function higherWins(left: number, right: number): CompareSide {
  if (left === right) return 'tie';
  return left > right ? 'left' : 'right';
}

function lowerWins(left: number, right: number): CompareSide {
  if (left === right) return 'tie';
  return left < right ? 'left' : 'right';
}

export function compareHabitability(left: Habitat, right: Habitat): CompareSide {
  return lowerWins(HABITABILITY_RANK[left.habitability], HABITABILITY_RANK[right.habitability]);
}

export function comparePrice(left: Habitat, right: Habitat): CompareSide {
  if (left.leaseCredits == null || right.leaseCredits == null) return 'tie';
  return lowerWins(left.leaseCredits, right.leaseCredits);
}

export function compareVolume(left: Habitat, right: Habitat): CompareSide {
  return higherWins(left.volumeM3, right.volumeM3);
}

export function compareBerths(left: Habitat, right: Habitat): CompareSide {
  return higherWins(left.bedrooms, right.bedrooms);
}

export function compareBaths(left: Habitat, right: Habitat): CompareSide {
  return higherWins(left.bathrooms, right.bathrooms);
}

export function compareO2(left: Habitat, right: Habitat): CompareSide {
  return closerWins(left.lifeSupport.o2Level, right.lifeSupport.o2Level, TARGET_O2);
}

export function comparePressure(left: Habitat, right: Habitat): CompareSide {
  return closerWins(
    left.lifeSupport.cabinPressureKpa,
    right.lifeSupport.cabinPressureKpa,
    PRESSURE_MIDPOINT,
  );
}

export function getCompareWinners(left: Habitat, right: Habitat): Record<CompareMetric, CompareSide> {
  return {
    habitability: compareHabitability(left, right),
    price: comparePrice(left, right),
    volume: compareVolume(left, right),
    berths: compareBerths(left, right),
    baths: compareBaths(left, right),
    o2: compareO2(left, right),
    pressure: comparePressure(left, right),
  };
}
