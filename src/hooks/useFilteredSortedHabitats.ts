import { useMemo } from 'react';
import { useHabitatStore } from '../stores/habitatStore';
import { filterHabitats } from '../utils/filterHabitats';
import { sortHabitats } from '../utils/sortHabitats';

export function useFilteredSortedHabitats() {
  const habitats = useHabitatStore((s) => s.habitats);
  const sortBy = useHabitatStore((s) => s.sortBy);
  const filters = useHabitatStore((s) => s.filters);

  return useMemo(
    () => sortHabitats(filterHabitats(habitats, filters), sortBy),
    [habitats, sortBy, filters],
  );
}
