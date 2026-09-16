import { create } from "zustand";

interface HomeState {
  characterRefresh: number;
  refreshCharacter: () => void;
}

export const useHomeStore = create<HomeState>()((set) => ({
  characterRefresh: 0,
  refreshCharacter: () =>
    set((state) => ({ characterRefresh: state.characterRefresh + 1 })),
}));
