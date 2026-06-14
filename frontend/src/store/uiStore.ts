import { create } from 'zustand';

export interface UiState {
  /** When true, the UI renders in a denser layout. */
  compact: boolean;
  toggleCompact: () => void;
  /** Number of items successfully added during this session. */
  addedCount: number;
  incrementAddedCount: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  compact: false,
  toggleCompact: () => set((state) => ({ compact: !state.compact })),
  addedCount: 0,
  incrementAddedCount: () =>
    set((state) => ({ addedCount: state.addedCount + 1 })),
}));
