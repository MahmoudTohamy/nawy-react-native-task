import { create } from 'zustand';
import { fetchHabitats } from '../services/habitatService';
import { DEFAULT_FILTERS, Habitat, HabitatFilters, SortKey } from '../types/habitat';

type HabitatState = {
  habitats: Habitat[];
  loading: boolean;
  error: string | null;
  sortBy: SortKey;
  filters: HabitatFilters;
  fetchHabitats: () => Promise<void>;
  setSortBy: (key: SortKey) => void;
  setFilters: (partial: Partial<HabitatFilters>) => void;
  resetFilters: () => void;
};

export const useHabitatStore = create<HabitatState>((set) => ({
  habitats: [],
  loading: false,
  error: null,
  sortBy: 'habitability',
  filters: DEFAULT_FILTERS,
  fetchHabitats: async () => {
    set({ loading: true, error: null });
    try {
      const habitats = await fetchHabitats();
      set({ habitats, loading: false });
    } catch {
      set({ loading: false, error: 'Failed to load habitats. Please try again.' });
    }
  },
  setSortBy: (sortBy) => set({ sortBy }),
  setFilters: (partial) =>
    set((state) => ({
      filters: { ...state.filters, ...partial },
    })),
  resetFilters: () => set({ filters: DEFAULT_FILTERS }),
}));
