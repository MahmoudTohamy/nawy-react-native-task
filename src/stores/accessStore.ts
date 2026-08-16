import { create } from 'zustand';

type AccessState = {
  unlockedIds: Set<string>;
  unlockHabitat: (id: string) => void;
  isUnlocked: (id: string) => boolean;
};

export const useAccessStore = create<AccessState>((set, get) => ({
  unlockedIds: new Set<string>(),
  unlockHabitat: (id) =>
    set((state) => {
      const next = new Set(state.unlockedIds);
      next.add(id);
      return { unlockedIds: next };
    }),
  isUnlocked: (id) => get().unlockedIds.has(id),
}));
