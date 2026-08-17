import { create } from 'zustand';

type FavoritesState = {
  ids: Set<string>;
  toggle: (id: string) => void;
  isFavorite: (id: string) => boolean;
};

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  ids: new Set<string>(),
  toggle: (id) =>
    set((state) => {
      const next = new Set(state.ids);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return { ids: next };
    }),
  isFavorite: (id) => get().ids.has(id),
}));
