import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAlertStore = create(
  persist(
    (set) => ({
      readKeys: [],
      toasted: [],
      panelOpen: false,
      openPanel: () => set({ panelOpen: true }),
      closePanel: () => set({ panelOpen: false }),
      markRead: (keys) =>
        set((s) => ({
          readKeys: [...new Set([...s.readKeys, ...keys])].slice(-60),
        })),
      markToasted: (key) => set((s) => ({ toasted: [...s.toasted, key] })),
    }),
    { name: "skydeck-alerts", partialize: (s) => ({ readKeys: s.readKeys }) },
  ),
);
