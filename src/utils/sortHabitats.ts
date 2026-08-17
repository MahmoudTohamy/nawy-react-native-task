import { Habitat, Habitability, SortKey } from '../types/habitat';

const HABITABILITY_RANK: Record<Habitability, number> = {
  safe: 0,
  warning: 1,
  critical: 2,
};

export function sortHabitats(habitats: Habitat[], sortBy: SortKey): Habitat[] {
  const copy = [...habitats];

  copy.sort((a, b) => {
    switch (sortBy) {
      case 'leaseCredits': {
        const aCredits = a.leaseCredits ?? Number.MAX_SAFE_INTEGER;
        const bCredits = b.leaseCredits ?? Number.MAX_SAFE_INTEGER;
        return aCredits - bCredits;
      }
      case 'habitability':
        return HABITABILITY_RANK[a.habitability] - HABITABILITY_RANK[b.habitability];
      case 'o2Level':
        return b.lifeSupport.o2Level - a.lifeSupport.o2Level;
      case 'listedAtSol':
        return b.listedAtSol - a.listedAtSol;
      default:
        return 0;
    }
  });

  return copy;
}
